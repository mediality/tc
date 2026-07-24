import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(app, /if \(isOpeningServe && hasActiveEffect\) \{[\s\S]*state\.returnServiceRestrictionFor = opponentIndex/);
assert.match(app, /playedCard\.effectApplied = false[\s\S]*completePlayedCardResolution/);
assert.match(app, /absorb_effect_cancellation_with_coup/);
assert.match(app, /if \(opponent\.cancelNextOpponentEffect\) return null/);
assert.match(app, /!state\.players\[opponentOf\(playerIndex\)\]\.cancelNextOpponentEffect[\s\S]*legalRemises\.length/);

const context = vm.createContext({
  state: {
    mandatoryPlacement: false,
    mandatoryPlacementReason: null,
    lastCard: { boosted: false },
    players: [
      {
        hand: [
          { uid: "valuable", family: "Revers", effectType: "drawCard", power: 5 },
          { uid: "service", family: "Service", effectType: "serviceCard", power: 3 },
        ],
      },
      { cancelNextOpponentEffect: true },
    ],
  },
  opponentOf: () => 1,
  isRemise: () => false,
  canPlayNormal: () => true,
  isOpeningServeAvailable: () => false,
  isServiceBoostHintWindow: () => false,
  isFreeBoostNextWindow: () => false,
  soloPlayableCoupScore: (_playerIndex, card) => card.power,
  soloEffectPreservationScore: (card) => card.effectType === "drawCard" ? 10 : 2,
});
vm.runInContext(functionSource(app, "isSoloCardEffectDormant"), context);
vm.runInContext(functionSource(app, "chooseSoloCancellationAbsorbingCoup"), context);
assert.equal(
  vm.runInContext("chooseSoloCancellationAbsorbingCoup(0).uid", context),
  "service",
  "L’IA doit absorber l’annulation avec le Service devenu caduc plutôt qu’avec un effet utile",
);

console.log("v3.19 : annulation du service et absorption IA par un coup caduc : OK");
