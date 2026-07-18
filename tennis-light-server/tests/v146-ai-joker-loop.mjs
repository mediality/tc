import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = app.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

const scoreContext = {
  state: {
    players: [
      { cancelNextOpponentEffect: true },
      { endurance: 1, hand: [{ uid: "joker-1", effectType: "jokerResponse" }] },
    ],
  },
  opponentOf: (index) => 1 - index,
  effectiveCost: () => 1,
};
vm.runInNewContext(`${functionSource("soloBoostEscapeEffectScore")}; this.score = soloBoostEscapeEffectScore(1, state.players[1].hand[0]);`, scoreContext);
assert.equal(scoreContext.score, 0, "un Joker annulé ne doit pas être considéré comme une défense contre un boost");

scoreContext.state.players[0].cancelNextOpponentEffect = false;
vm.runInNewContext("this.scoreWithoutCancellation = soloBoostEscapeEffectScore(1, state.players[1].hand[0]);", scoreContext);
assert.ok(scoreContext.scoreWithoutCancellation > 0, "le Joker doit rester une défense valide quand son effet peut s'appliquer");

const strategicContext = {
  state: {
    mandatoryPlacement: true,
    turnHasEffect: [false, false],
    players: [{ cancelNextOpponentEffect: true }, {}],
  },
  opponentOf: (index) => 1 - index,
  chooseSoloCancellationBait: () => {
    throw new Error("aucun appât ne doit être évalué sous contrainte obligatoire");
  },
};
vm.runInNewContext(`${functionSource("chooseSoloStrategicEffect")}; this.choice = chooseSoloStrategicEffect(1);`, strategicContext);
assert.equal(strategicContext.choice, null, "l'IA ne doit pas absorber une annulation au lieu de répondre à la contrainte");

const recoveryContext = {
  state: {
    activePlayer: 1,
    lastCard: { playedUid: "boost-1" },
    mandatoryPlacement: true,
    mandatoryPlacementReason: "boost",
    players: [{}, { endurance: 1, hand: [{ uid: "joker-1" }] }],
    setMatch: { exchangeNumber: 4 },
    turnSnapshot: {
      activePlayer: 1,
      lastCard: { playedUid: "boost-1" },
      mandatoryPlacement: true,
      mandatoryPlacementReason: "boost",
      players: [{}, { endurance: 1, hand: [{ uid: "joker-1" }] }],
      setMatch: { exchangeNumber: 4 },
    },
  },
  SOLO_AI: { recoveryTurnKey: null, recoveryCount: 0 },
};
vm.runInNewContext(`${functionSource("soloTurnRecoveryKey")}; ${functionSource("registerSoloTurnRecovery")};`, recoveryContext);
assert.equal(vm.runInNewContext("registerSoloTurnRecovery(1)", recoveryContext), false);
assert.equal(vm.runInNewContext("registerSoloTurnRecovery(1)", recoveryContext), true, "la deuxième restauration identique doit déclencher la sortie de secours");

const aiTurnSource = functionSource("runSoloAITurn");
assert.match(aiTurnSource, /registerSoloTurnRecovery\(playerIndex\)/);
assert.match(aiTurnSource, /restoreTurnSnapshot\(\);\s*pass\(playerIndex\);/);
assert.match(aiTurnSource, /forced_pass_after_repeated_recovery/);

console.log("v146 anti-boucle IA Joker sous contrainte de boost: OK");
