import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy <span>v134<\/span>/);
assert.equal((html.match(/id="openAiClubHouseButton"/g) || []).length, 1);
assert.match(html, /id="aiClubHouseScreen"/);
assert.match(html, /data-ai-club-value="tournament"/);
assert.match(html, /data-ai-club-value="league"/);
assert.match(html, /data-ai-club-value="2"/);
assert.match(html, /data-ai-club-value="3"/);

for (const difficulty of ["normal", "expert", "champion", "legend"]) {
  assert.match(html, new RegExp(`data-ai-club-value="${difficulty}"`));
}

const aiClubHouseHtml = html.slice(
  html.indexOf('id="aiClubHouseScreen"'),
  html.indexOf('<main class="app game-app'),
);
assert.doesNotMatch(aiClubHouseHtml, /adversaire|placement des joueurs|distribution/i);
assert.doesNotMatch(html, /data-start-solo="(?:tournament|league)/);

assert.match(app, /const AI_DIFFICULTIES = \["normal", "expert", "champion", "legend"\]/);
assert.match(app, /normal: 0,\s+expert: 1,\s+champion: 2,\s+legend: 3,/);
assert.match(app, /function allCircuitSeedBonuses\(\)/);
assert.match(app, /bonuses\[entry\] = shuffle\(allCircuitSeedBonuses\(\)\)\.slice\(0, bonusCount\)/);
assert.match(app, /function startLeagueTournamentMode\(targetSets = 2, options = \{\}\)/);
assert.match(app, /targetSets = Number\(targetSets\) === 3 \? 3 : 2/);
assert.match(app, /aiClubHouse,\s+difficulty: SOLO_AI\.difficulty,\s+weekly: false,/);
assert.match(app, /state\.tournament\.active && !state\.tournament\.aiClubHouse/);
assert.doesNotMatch(app, /aiStatBonus|aiPowerBonus/);

console.log("v134 CLUB HOUSE IA: OK");
