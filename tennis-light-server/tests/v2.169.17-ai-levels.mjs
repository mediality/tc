import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const [html, app, css, pkg] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
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

assert.match(html, /Tennis Courts Academy · 2\.169\.21/);
assert.match(html, /styles\.css\?v=170\.18/);
assert.match(html, /app\.js\?v=170\.18/);
assert.equal(JSON.parse(pkg).version, "2.169.25");
assert.match(app, /const GAME_VERSION = "v2\.169\.21"/);

const levelsContext = vm.createContext({ currentRankingTotalPoints: () => 0, Math });
vm.runInContext(functionSource("circuitHumanLevel"), levelsContext);
for (const [points, level] of [[0, 1], [499, 1], [500, 2], [999, 2], [1000, 3], [2499, 3], [2500, 4], [4999, 4], [5000, 5], [7999, 5], [8000, 6]]) {
  assert.equal(vm.runInContext(`circuitHumanLevel(${points})`, levelsContext), level);
}

const positionContext = vm.createContext({});
vm.runInContext(functionSource("circuitPositionAiIntelligence"), positionContext);
const positionLevel = (position, level) => vm.runInContext(`circuitPositionAiIntelligence(${position}, ${level})`, positionContext);
assert.deepEqual(Array.from({ length: 16 }, (_, index) => positionLevel(index + 1, 1)), ["normal", "normal", ...Array(14).fill("amateur")]);
assert.deepEqual(Array.from({ length: 16 }, (_, index) => positionLevel(index + 1, 2)), ["expert", ...Array(3).fill("normal"), ...Array(12).fill("amateur")]);
assert.deepEqual(Array.from({ length: 16 }, (_, index) => positionLevel(index + 1, 3)), [...Array(3).fill("expert"), ...Array(3).fill("normal"), ...Array(10).fill("amateur")]);
assert.deepEqual(Array.from({ length: 16 }, (_, index) => positionLevel(index + 1, 4)), ["champion", ...Array(3).fill("expert"), ...Array(4).fill("normal"), ...Array(8).fill("amateur")]);

const styleContext = vm.createContext({
  state: { tournament: { aiIntelligenceLevels: {}, aiClubHouse: false }, setMatch: { enabled: false } },
  SOLO_AI: { characterId: "coach", difficulty: "normal" },
  aiIntelligenceForEntry: () => "normal",
});
vm.runInContext(functionSource("chooseSoloAIStyle"), styleContext);
assert.equal(vm.runInContext("chooseSoloAIStyle()", styleContext), "amateur");
styleContext.state.setMatch.enabled = true;
assert.equal(vm.runInContext("chooseSoloAIStyle()", styleContext), "normal");

const effectContext = vm.createContext({ canPlayNormal: () => true, isRemise: () => true });
vm.runInContext(functionSource("canPlayEffectMode"), effectContext);
assert.equal(vm.runInContext("canPlayEffectMode(0, { effectType: 'freeBoostNext' })", effectContext), true);

assert.match(functionSource("expertCanDefendBoostWithCards"), /opponentCanCancelEffect/);
assert.match(functionSource("soloOpponentResponseProjection"), /placement >= 4/);
assert.match(functionSource("soloCardScore"), /card\.family === "Smash"[\s\S]*endurance <= 0/);
assert.match(app, /Lucky Loser/);
assert.match(app, /Top player/);
assert.match(app, /"★"\.repeat\(circuitLevel\.level\)/);
assert.match(css, /\.profile-level-stars/);

console.log("v2.169.17 niveaux joueur, Circuit Pro, entraînement et IA avancée: OK");
