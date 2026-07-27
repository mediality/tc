import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.57.0");
assert.match(app, /const GAME_VERSION = "v3\.57"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.57<\/span>/);

const turnStart = app.indexOf("function runSoloAITurn(");
const turnEnd = app.indexOf("\nfunction ", turnStart + 10);
const turnSource = app.slice(turnStart, turnEnd);
assert.ok(
  turnSource.indexOf("soloCertainWinDecision(playerIndex)") < turnSource.indexOf('normalizeAiIntelligence(SOLO_AI.style) === "amateur"'),
  "La décision de victoire certaine doit précéder tous les comportements liés au niveau de l’IA",
);

assert.match(app, /function soloCertainWinDecision\(playerIndex\)/);
assert.match(app, /projection\.projectedWinner !== playerIndex/);
assert.match(app, /function opponentIsUnableToReply\(playerIndex\)/);
assert.match(app, /!opponent\?\.hand\.length/);
assert.match(app, /opponent\.endurance > 0/);
assert.match(app, /effectiveCost\(opponent, card\) === 0/);
assert.match(app, /function certainWinImprovementPath\(playerIndex\)/);
assert.match(app, /guaranteedScore: "3-0"/);
assert.match(app, /card\.effectType === "smashThreat"/);
assert.match(app, /guaranteedScore: "2-0"/);
assert.match(app, /option\.winner === playerIndex && option\.score\.loserGames === 0/);
assert.match(app, /action: "pass"/);

console.log("v3.57 : passage universel sur victoire certaine et exceptions de score propre : OK");
