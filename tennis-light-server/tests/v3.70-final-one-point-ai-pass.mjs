import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

assert.equal(pkg.version, "3.70.0");
assert.match(app, /const GAME_VERSION = "v3\.70"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.70<\/span>/);

const turnStart = app.indexOf("function runSoloAITurn(");
const turnEnd = app.indexOf("\nfunction ", turnStart + 10);
const turn = app.slice(turnStart, turnEnd);
assert.ok(
  turn.indexOf("soloFinalOnePointWinningPass(playerIndex)") < turn.indexOf("soloCertainWinDecision(playerIndex)"),
  "la passe gagnante de finale doit précéder toutes les autres optimisations de victoire certaine",
);
assert.match(turn, /recordSoloAiDecision\("pass_final_one_point_certain_win"/);
assert.match(turn, /pass\(playerIndex\)/);

const helperStart = app.indexOf("function soloFinalOnePointWinningPass(");
const helperEnd = app.indexOf("\nfunction ", helperStart + 10);
const helper = app.slice(helperStart, helperEnd);
assert.match(helper, /state\.tournament\?\.onePointGame/);
assert.match(helper, /match\.round !== "final"/);
assert.match(helper, /!canSoloPassAndWin\(playerIndex\)/);
assert.match(helper, /projection\.projectedWinner === playerIndex && projection\.matchClinched/);

console.log("v3.70 : passe IA garantie en finale du 1 Point Game et du 1 Point Master : OK");
