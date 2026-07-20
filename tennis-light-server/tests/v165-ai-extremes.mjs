import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [html, app] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
]);

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = app.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=170\.8/);
assert.match(html, /app\.js\?v=170\.8/);
assert.match(app, /const CARD_ASSET_VERSION = "169"/);

const attitude = functionSource("chooseSoloAttitude");
assert.match(attitude, /intelligence === "legend"\) weights\.opportunistic \+= 4/);

const sequencePlan = functionSource("buildLegendarySequencePlan");
assert.match(sequencePlan, /type: "normal_sequence"/);
assert.match(sequencePlan, /type: "boost_sequence"/);
assert.match(sequencePlan, /type: "effect_coup_sequence"/);
assert.match(sequencePlan, /projected_response/);
assert.match(sequencePlan, /projected_defense/);
assert.match(sequencePlan, /candidates\.slice\(0, 5\)/);

const resourcePlan = functionSource("legendarySequenceResourceScore");
assert.match(resourcePlan, /reserveShortfall \* 16/);
assert.match(resourcePlan, /exposedPenalty/);

const safetyPass = functionSource("legendaryPassSafetyDecision");
assert.match(safetyPass, /if \(losesMatch\) return null/);
assert.match(safetyPass, /best\.risk >= 0\.48/);
assert.match(safetyPass, /best\.remainingEndurance < best\.reserve/);
assert.match(safetyPass, /concéder l'échange pour conserver une défense/);

const aiTurn = functionSource("runSoloAITurn");
assert.match(aiTurn, /runAmateurSoloAITurn\(playerIndex\)/);
assert.match(aiTurn, /legendary_safety_pass/);
assert.match(aiTurn, /legendary_sequence/);

const amateur = functionSource("runAmateurSoloAITurn");
assert.match(amateur, /amateurPassChance/);
assert.match(amateur, /Math\.random\(\) < 0\.16/);
assert.match(amateur, /Math\.random\(\) < 0\.08/);
assert.match(amateur, /amateur_basic_coup/);

const amateurChoice = functionSource("chooseAmateurOption");
assert.match(amateurChoice, /sort\(\(a, b\) => scoreOf\(a\) - scoreOf\(b\)\)/);
assert.match(amateurChoice, /ranked\.length \* 0\.65/);

const amateurContext = vm.createContext({
  Math: { ceil: Math.ceil, floor: Math.floor, max: Math.max, random: () => 0.99 },
});
vm.runInContext(amateurChoice, amateurContext);
const amateurSelectedScore = vm.runInContext("chooseAmateurOption([1,2,3,4,5,6,7,8,9,10].map(score => ({ score }))).score", amateurContext);
assert.ok(amateurSelectedScore <= 7, `l'Amateur ne doit pas sélectionner le haut du classement: ${amateurSelectedScore}`);

const safetyContext = vm.createContext({
  SOLO_AI: { style: "legend" },
  state: { mandatoryPlacement: false, setMatch: { targetSets: 2, setsWon: [1, 0] } },
  normalizeAiIntelligence: (value) => value,
  hasPlayedThisTurn: () => false,
  opponentOf: (index) => index === 0 ? 1 : 0,
  soloPassProjection: () => ({ projectedWinner: 0, setOver: false, setWinner: null }),
});
vm.runInContext(safetyPass, safetyContext);
const safetyTrade = vm.runInContext("legendaryPassSafetyDecision(1, { best: { risk: 0.7, canDefendCounterBoost: false, remainingEndurance: 0, reserve: 2, type: 'boost_sequence' } })", safetyContext);
assert.equal(safetyTrade.reason, "concéder l'échange pour conserver une défense");
safetyContext.soloPassProjection = () => ({ projectedWinner: 0, setOver: true, setWinner: 0 });
safetyContext.state.setMatch.setsWon = [1, 0];
const refusedMatchLoss = vm.runInContext("legendaryPassSafetyDecision(1, { best: { risk: 0.95, canDefendCounterBoost: false, remainingEndurance: 0, reserve: 2, type: 'boost_sequence' } })", safetyContext);
assert.equal(refusedMatchLoss, null);

console.log("v169 Légendaire multi-séquences et Amateur très accessible: OK");
