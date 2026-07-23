import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const csv = fs.readFileSync(new URL("../world-tour.csv", import.meta.url), "utf8");
const image = new URL("../public/assets/prestige-ultimate-league.jpeg", import.meta.url);

assert.ok(fs.statSync(image).size > 100_000);
assert.match(app, /v16929-prestige-ultimate-league/);
assert.match(app, /Bienvenue dans la Prestige League et l’Ultimate League/);
assert.match(app, /image: "assets\/prestige-ultimate-league\.jpeg"/);
assert.match(app, /Cette dernière a lieu toutes les quatre semaines/);
assert.match(server, /v16929-prestige-ultimate-league/);

assert.match(server, /function backfillCurrentLeagueAiPoints/);
assert.match(server, /v2\.169\.29-league-launch/);
assert.match(server, /circuit_ai_league_backfills/);
assert.match(server, /SET points = circuit_ai_week_scores\.points \+ \$5/);
assert.match(server, /competition\.eventType === "League"/);
assert.match(server, /const competitions = COMPETITION_DEFINITIONS\.filter\(\(competition\) => competition\.week === week\)/);
assert.match(server, /await backfillCurrentLeagueAiPoints\(currentCircuit\)/);

for (let week = 1; week <= 20; week += 1) {
  const lines = csv.split(/\r?\n/).filter((line) => line.includes(`;${week};6;`));
  assert.equal(lines.length, 1, `une League doit être prévue en semaine ${week}`);
}

console.log("v2.169.29 immediate League launch, news and idempotent AI backfill: OK");
