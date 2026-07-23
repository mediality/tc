import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const csv = fs.readFileSync(new URL("../world-tour.csv", import.meta.url), "utf8").trim().split(/\r?\n/);

assert.equal(pkg.version, "2.169.28");
assert.match(app, /const GAME_VERSION = "v2\.169\.28"/);
assert.match(html, /Tennis Courts Academy · 2\.169\.28/);
assert.match(html, /styles\.css\?v=170\.28/);
assert.match(html, /app\.js\?v=170\.28/);

const headers = csv.shift().replace(/^\uFEFF/, "").split(";");
const rows = csv.map((line) => Object.fromEntries(headers.map((header, index) => [header, line.split(";")[index]])));
assert.equal(rows.length, 120);
for (let week = 1; week <= 20; week += 1) {
  const events = rows.filter((row) => Number(row.semaine) === week);
  assert.equal(events.length, 6, `la semaine ${week} doit contenir six compétitions`);
  const league = events.find((row) => Number(row.slot_semaine) === 6);
  assert.ok(league);
  const ultimateWeek = [2, 6, 10, 14, 18].includes(week);
  assert.equal(league.niveau, ultimateWeek ? "Ultimate League" : "Prestige League");
  assert.equal(Number(league.points), ultimateWeek ? 1200 : 800);
  assert.equal(league.type_epreuve, "League");
}

assert.match(server, /800: \{ group4: 0, group3: 25, semi: 200, finalist: 400, winner: 800, matchWin: 10, weeklyPotential: 1100 \}/);
assert.match(server, /1200: \{ group4: 0, group3: 40, semi: 300, finalist: 700, winner: 1200, matchWin: 20, weeklyPotential: 1500 \}/);
assert.match(server, /function simulatedAiLeaguePoints/);
assert.match(server, /\[\[1, 8\], \[9, 16\], \[15, 22\]\]/);
assert.match(server, /competition\.eventType === "League"/);
assert.match(server, /Groupe \(3e\)/);
assert.match(server, /Groupe \(4e\)/);

assert.match(app, /competition\.eventType === "League"\) startLeagueTournamentMode/);
assert.match(app, /humanLevel === 6 \? rankedAi\.slice\(0, 7\)/);
assert.match(app, /humanLevel === 5 \? rankedAi\.slice\(2, 9\)/);
assert.match(app, /humanLevel === 4 \? rankedAi\.slice\(4, 11\)/);
assert.match(app, /humanLevel === 3 \? 9 : humanLevel === 2 \? 11 : 13/);
assert.match(app, /weeklyCompetition\.level === "Ultimate League" && humanLevel === 6/);
assert.match(app, /map\(\(entry\) => \[entry, "legend"\]\)/);
assert.match(app, /state\.tournament\.competitionPoints\?\.matchWin/);
assert.match(app, /return position === 2 \? "group3" : position === 3 \? "group4"/);

assert.match(css, /animation: exchange-winner-halo \.55s/);
assert.match(css, /rgba\(255, 255, 255, \.98\)/);
assert.match(css, /\.player-identity-panel\.active-turn h2/);

console.log("v2.169.28 Prestige League, Ultimate League, calendrier et retours visuels : OK");
