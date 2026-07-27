import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

assert.equal(pkg.version, "3.69.0");
assert.match(app, /const GAME_VERSION = "v3\.69"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.69<\/span>/);

const start = app.indexOf("function onePointTournamentServer(");
const end = app.indexOf("\nfunction startLeagueTournamentMode(", start);
const source = app.slice(start, end);
assert.match(source, /state\.tournament\?\.onePointMaster && match\.round === "quarter"/);
assert.match(source, /state\.tournament\.friendlyStandings/);
assert.match(source, /state\.tournament\.championshipGroupWinners/);
assert.match(source, /if \(servingEntry\) return servingEntry === humanTournamentEntry\(\) \? 0 : 1/);
assert.ok(
  source.indexOf('match.round === "quarter"') < source.indexOf("const previousScores"),
  "l’exception des quarts doit être appliquée avant la règle générale du score précédent",
);

console.log("v3.69 : avantage de service aux vainqueurs de groupe en quarts du 1 Point Master : OK");
