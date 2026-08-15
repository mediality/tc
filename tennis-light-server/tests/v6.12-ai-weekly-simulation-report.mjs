import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const server = await readFile(new URL("../server.js", import.meta.url), "utf8");
const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");

assert.match(server, /CIRCUIT_AI_CHARACTER_IDS = \[\.\.\.HISTORIC_CHARACTER_IDS, \.\.\.NEW_CHARACTER_IDS, \.\.\.NEXT_GEN_CHARACTER_IDS\]/);
assert.match(server, /rankBands = \[\[1, 8\], \[9, 16\], \[17, 24\], \[25, 32\]\]/);
assert.match(server, /const simulationCount = 5/);
assert.match(server, /simulationIndex < simulationCount/);
assert.match(server, /retentionRule: "best-result-per-tournament"/);
assert.match(server, /if \(!currentBest \|\| totalPoints > currentBest\.totalPoints\)/);
assert.match(server, /if \(rankIa <= 2\) return "legend"/);
assert.match(server, /if \(rankIa <= 24\) return seededRandom/);
assert.match(server, /amateur: -15, normal: -5, expert: 0, champion: 10, legend: 20/);
assert.match(server, /competition\.surface \? 5 : 0/);
assert.doesNotMatch(server, /multiplier = rankIa/);
assert.doesNotMatch(server, /function applyAiWeeklyCaps/);
assert.match(server, /add\(best, 1\)/);
assert.match(server, /add\(randomPositive, 2\)/);
assert.match(server, /add\(worst, -0\.5\)/);
assert.match(server, /add\(randomNegative, -2\)/);
assert.match(server, /streak\(id, 1\) < 4/);
assert.match(server, /CREATE TABLE IF NOT EXISTS circuit_ai_simulation_reports/);
assert.match(server, /\/api\/admin\/ai-simulation-report/);
assert.match(html, /id="adminAiReportTable"/);
assert.match(app, /function renderAdminAiReport/);
assert.match(app, /loadAdminAiReport\(\)/);

console.log("V6.12 32 IA, motivation, plafonds hebdomadaires et rapport admin : OK");
