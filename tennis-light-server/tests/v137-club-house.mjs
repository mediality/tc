import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

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

assert.match(html, /Tennis Courts Academy <span>v137<\/span>/);
assert.equal((html.match(/id="openAiClubHouseButton"/g) || []).length, 1);
assert.match(html, /id="aiClubHouseScreen"/);
assert.match(html, /data-ai-club-value="tournament"/);
assert.match(html, /data-ai-club-value="league"/);
assert.match(html, /data-ai-club-value="2"/);
assert.match(html, /data-ai-club-value="3"/);

for (const difficulty of ["normal", "expert", "champion", "legend", "ranking"]) {
  assert.match(html, new RegExp(`data-ai-club-value="${difficulty}"`));
}
for (const value of ["random", "best", "ranking"]) {
  assert.match(html, new RegExp(`data-ai-club-value="${value}"`));
}

const aiClubHouseHtml = html.slice(
  html.indexOf('id="aiClubHouseScreen"'),
  html.indexOf('<main class="app game-app'),
);
assert.match(aiClubHouseHtml, /Joueurs/);
assert.match(aiClubHouseHtml, /Répartition/);
assert.doesNotMatch(html, /data-start-solo="(?:tournament|league)/);

assert.match(app, /const AI_DIFFICULTIES = \["normal", "expert", "champion", "legend", "ranking"\]/);
assert.match(app, /normal: 0,\s+expert: 1,\s+champion: 2,\s+legend: 3,\s+ranking: 0,/);
assert.match(app, /function allCircuitSeedBonuses\(\)/);
assert.match(app, /bonuses\[entry\] = shuffle\(allCircuitSeedBonuses\(\)\)\.slice\(0, bonusCount\)/);
assert.match(app, /function aiLevelBonusCountForEntry\(entry, difficulty = "normal"\)/);
assert.match(app, /if \(rank === 1\) return 3/);
assert.match(app, /if \(rank && rank <= 3\) return 2/);
assert.match(app, /if \(rank && rank <= 10\) return 1/);
assert.match(app, /selectAiClubHousePlayers\(15,/);
assert.match(app, /\[1, 16, 9, 8, 5, 12, 13, 4, 3, 14, 11, 6, 7, 10, 15, 2\]/);
assert.match(app, /function startLeagueTournamentMode\(targetSets = 2, options = \{\}\)/);
assert.match(app, /targetSets = Number\(targetSets\) === 3 \? 3 : 2/);
assert.match(app, /A: \[pick\(1\), pick\(4\), pick\(5\), pick\(8\)\]/);
assert.match(app, /B: \[pick\(2\), pick\(3\), pick\(6\), pick\(7\)\]/);
assert.match(app, /state\.tournament\.active && !state\.tournament\.aiClubHouse/);
assert.doesNotMatch(app, /aiStatBonus|aiPowerBonus/);

const classicContext = {
  HUMAN_TOURNAMENT_ENTRY: "human",
  selectedCharacterId: () => "human-character",
  selectAiClubHousePlayers: () => Array.from({ length: 15 }, (_, index) => `ai${index + 1}`),
  rankedTournamentEntries: (entries) => entries,
  shuffle: (entries) => entries,
};
vm.runInNewContext(`${functionSource("buildAiClubHouseClassicSetup")}; result = buildAiClubHouseClassicSetup({ distribution: "ranking" });`, classicContext);
assert.deepEqual(
  Array.from(classicContext.result.positions.slice(1)),
  ["human", "ai15", "ai8", "ai7", "ai4", "ai11", "ai12", "ai3", "ai2", "ai13", "ai10", "ai5", "ai6", "ai9", "ai14", "ai1"],
);

const bonusContext = {
  normalizeAiDifficulty: (value) => value,
  aiDifficultyBonusCount: (value) => ({ normal: 0, expert: 1, champion: 2, legend: 3 }[value] || 0),
  aiCircuitPerformanceRank: (entry) => Number(entry.replace("ai", "")),
};
vm.runInNewContext(`${functionSource("aiLevelBonusCountForEntry")}; result = ["ai1", "ai2", "ai3", "ai4", "ai10", "ai11"].map((entry) => aiLevelBonusCountForEntry(entry, "ranking"));`, bonusContext);
assert.deepEqual(Array.from(bonusContext.result), [3, 2, 2, 1, 1, 0]);

console.log("v137 CLUB HOUSE: OK");
