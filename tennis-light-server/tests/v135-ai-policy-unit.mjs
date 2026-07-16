import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

function functionSource(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

const safeContext = {
  state: {
    players: [{}, { hand: [{ id: "safe", placement: 4 }] }],
    lastCard: { precision: 2 },
    turnIgnoresPlacement: [false, false],
  },
  isRemise: () => false,
  canPlayNormal: () => true,
  totalTurnPlacement: (_playerIndex, card) => card.placement,
  chooseSoloRemiseDefensePlan: () => null,
};
vm.runInNewContext(`${functionSource("hasSafeSoloContinuation")}; result = hasSafeSoloContinuation(1);`, safeContext);
assert.equal(safeContext.result, true);

const passContext = {
  state: {
    mandatoryPlacement: false,
    setMatch: { enabled: true },
    players: [{}, {}],
  },
  hasPlayedThisTurn: () => false,
  isVulnerableToJuBoostPressure: () => true,
  isExpertVulnerableToCounterPressure: () => false,
  isMatchDangerForPlayer: () => false,
  isSetDangerForPlayer: () => false,
  wouldPassLoseSetOrMatch: () => false,
  hasSafeSoloContinuation: () => true,
};
vm.runInNewContext(`${functionSource("shouldSoloPassToLimitBoostDamage")}; result = shouldSoloPassToLimitBoostDamage(1);`, passContext);
assert.equal(passContext.result, false);

const preservationContext = {};
vm.runInNewContext(`${functionSource("soloEffectPreservationScore")}; result = soloEffectPreservationScore({ effectType: "removeOpponentLast" });`, preservationContext);
assert.equal(preservationContext.result, 30);

console.log("v135 politique IA: OK");
