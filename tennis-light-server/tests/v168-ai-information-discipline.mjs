import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [html, app] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
]);

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

assert.match(html, /Tennis Courts Academy <span>v168<\/span>/);
assert.match(html, /styles\.css\?v=168\.0/);
assert.match(html, /app\.js\?v=168\.0/);
assert.match(app, /const CARD_ASSET_VERSION = "168"/);

const exposureSource = functionSource(app, "soloInformationExposureProfile");
const disciplineSource = functionSource(app, "soloCommitmentDiscipline");
const context = vm.createContext({
  SOLO_AI: { style: "legend", attitude: "aggressive" },
  state: {
    mandatoryPlacement: false,
    boostAvailableFor: null,
    players: [
      { hand: [{}, {}, {}, {}, {}, {}], endurance: 7, power: 0, played: [] },
      { hand: [{}, {}, {}, {}], endurance: 4, power: 8, played: [{}, {}] },
    ],
  },
  opponentOf: (index) => index === 0 ? 1 : 0,
  normalizeAiIntelligence: (style) => style,
  isSetDangerForPlayer: () => false,
  isMatchDangerForPlayer: () => false,
  wouldPassLoseSetOrMatch: () => false,
  getCardStats: (_player, card) => card,
  effectiveCost: (_player, card) => card.cost || 0,
});
vm.runInContext(`${exposureSource}\n${disciplineSource}`, context);

let profile = vm.runInContext("soloInformationExposureProfile(1)", context);
assert.equal(profile.opponentConservative, true);
assert.equal(profile.alreadyExposed, true);
assert.ok(profile.patience >= 0.75);

context.state.players[0].played = [{}, {}, {}];
context.state.players[0].power = 9;
context.state.players[0].hand = [{}, {}, {}];
context.state.players[0].endurance = 3;
context.state.players[1].played = [];
context.state.players[1].power = 0;
profile = vm.runInContext("soloInformationExposureProfile(1)", context);
assert.equal(profile.opponentMoreCommitted, true);
assert.equal(profile.opponentConservative, false);

context.state.players[0] = { hand: [{}, {}, {}, {}, {}, {}], endurance: 7, power: 0, played: [] };
context.state.players[1] = { hand: [{}, {}, {}, {}], endurance: 7, power: 0, played: [] };
const cautious = vm.runInContext("soloCommitmentDiscipline(1, { card: { power: 6, cost: 2 } })", context);
const probingShot = vm.runInContext("soloCommitmentDiscipline(1, { card: { power: 3, cost: 1 } })", context);
const preparedAttack = vm.runInContext(`soloCommitmentDiscipline(1, {
  card: { power: 6, cost: 2 }, boosted: true, cardsCommitted: 2,
  remainingEndurance: 5, reserve: 2, risk: 0.08, canDefend: true, plannedSequence: true
})`, context);
const recklessAttack = vm.runInContext(`soloCommitmentDiscipline(1, {
  card: { power: 6, cost: 2 }, boosted: true, cardsCommitted: 2,
  remainingEndurance: 1, reserve: 2, risk: 0.55, canDefend: false, plannedSequence: true
})`, context);
assert.ok(cautious.score < 0, "une grosse carte isolée doit subir un coût d'exposition");
assert.ok(probingShot.score > cautious.score + 8, "une carte de sondage doit être nettement préférée quand l'humain ne révèle rien");
assert.equal(preparedAttack.safeSequence, true);
assert.ok(preparedAttack.score > recklessAttack.score, "la séquence préparée doit rester plus attractive qu'une attaque exposée");
assert.ok(recklessAttack.score < 0, "une attaque sans réserve ni défense doit être découragée");

assert.match(functionSource(app, "chooseSoloAttitude"), /informationExposure\.opponentConservative/);
assert.match(functionSource(app, "shouldReevaluateSoloAttitude"), /informationShift/);
assert.match(functionSource(app, "soloBoostOptionCandidates"), /informationDiscipline\.score/);
assert.match(functionSource(app, "buildSoloScenarioPlan"), /informationExposure: soloInformationExposureProfile/);
assert.match(functionSource(app, "buildLegendarySequencePlan"), /plannedSequence: true/);
assert.match(functionSource(app, "chooseSoloNormalCoup"), /soloCommitmentDiscipline/);

console.log("v168 IA: patience face à un humain prudent et agressivité conservée pour les séquences préparées: OK");
