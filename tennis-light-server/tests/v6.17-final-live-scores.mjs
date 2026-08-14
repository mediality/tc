import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const index = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

assert.equal(packageJson.version, "6.17.0");
assert.match(index, /Tennis Courts Academy · <span>V6\.17<\/span>/);
assert.match(app, /function finalizeProgressiveTournamentMatch\(match, targetSetsOverride = null\)/);
assert.match(app, /function revealAllTournamentAiSets[\s\S]*?finalizeProgressiveTournamentMatch\(match\)/);
assert.match(app, /function revealLeagueDay[\s\S]*?finalizeProgressiveTournamentMatch\(match\)/);
assert.match(app, /function revealChampionshipDay[\s\S]*?finalizeProgressiveTournamentMatch\(match\)/);

console.log("V6.17 finalisation des scores en direct du circuit pro : OK");
