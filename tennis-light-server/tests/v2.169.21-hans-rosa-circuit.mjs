import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "2.169.21");
assert.match(app, /const GAME_VERSION = "v2\.169\.21"/);
assert.match(html, /Tennis Courts Academy · 2\.169\.21/);

assert.match(app, /coachHans:[\s\S]*discardHandForPower[\s\S]*opponentTurnShotExtraCost/);
assert.match(app, /rosaBenavente:[\s\S]*opponentPassPowerBonus[\s\S]*opponentNextShotBasePlacementZero/);
assert.match(app, /TC-Coach-Hans-LOBBY\.webp/);
assert.match(app, /TC-Rosa-Benavente-LOBBY\.webp/);
assert.match(app, /2026-07-21T18:00:00\+02:00/);
assert.match(app, /2026-07-22T08:00:00\+02:00/);
assert.match(server, /ROSA_BENAVENTE_AVAILABLE_AT = Date\.parse\("2026-07-21T18:00:00\+02:00"\)/);
assert.match(server, /COACH_HANS_AVAILABLE_AT = Date\.parse\("2026-07-22T08:00:00\+02:00"\)/);

const historicBody = server.match(/const HISTORIC_CHARACTER_IDS = \[([\s\S]*?)\];/)[1];
const newBody = server.match(/const NEW_CHARACTER_IDS = \[([\s\S]*?)\];/)[1];
const count = (historicBody.match(/"[^"\n]+"/g) || []).length + (newBody.match(/"[^"\n]+"/g) || []).length;
assert.equal(count, 22, "le circuit Pro doit contenir exactement 22 IA");
assert.match(server, /const CIRCUIT_AI_CHARACTER_IDS = \[\.\.\.HISTORIC_CHARACTER_IDS, \.\.\.NEW_CHARACTER_IDS\]/);
assert.match(server, /const totals = new Map\(CIRCUIT_AI_CHARACTER_IDS\.map/);
assert.match(server, /simulatedAiTournamentPoints/);
assert.match(app, /\}, 10000\);/);
assert.match(app, /Sécurité IA : aucun coup validé après 10 secondes/);
assert.match(css, /\.badge \{[\s\S]*?justify-content: center;[\s\S]*?text-align: center;/);
assert.match(css, /\.confrontation-player-card-frame \{[^}]*border: 0;/);

for (const file of [
  "TC-Coach-Hans-VERSO.webp", "TC-Coach-Hans.webp", "TC-Coach-Hans-WINS.webp", "TC-Coach-Hans-LOSE.webp", "TC-Coach-Hans-LOBBY.webp",
  "TC-Rosa-Benavente-LOBBY.webp", "TC-Rosa-Benavente-LOSE.webp", "TC-Rosa-Benavente-WINS.webp", "TC-Rosa-Benavente-VERSO.webp", "TC-Rosa-Benavente.webp",
]) assert.ok(fs.existsSync(new URL(`../public/assets/cards/${file}`, import.meta.url)), `${file} manquant`);

console.log("v2.169.21 Coach Hans, Rosa Benavente, sécurité IA et circuit 22 IA : OK");
