import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");

function sourceOf(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(html, /Challenge 400/);
assert.match(html, /Chaque match ajoute 5 points par set gagné/);
assert.match(html, /class="circuit-points-table"/);
assert.match(app, /function tournamentAiRankingEntries\(\)/);
assert.match(app, /function tournamentRankIa\(entry\)/);
assert.match(app, /function circuitHumanLevel\(points = currentRankingTotalPoints\(\)\)/);
assert.match(app, /function buildWeeklyCircuitProBonuses/);
assert.match(app, /tournamentSeedNumbers: seedNumbers/);
assert.match(app, /class="tournament-seed-number"/);
assert.match(sourceOf(app, "buildWeeklyTournamentMatches"), /\[\[1, 16\], \[9, 8\], \[5, 12\], \[13, 4\], \[3, 14\], \[11, 6\], \[7, 10\], \[15, 2\]\]/);

const aiIds = Array.from({ length: 21 }, (_, index) => `ai${index + 1}`);
const worldRanks = Object.fromEntries(aiIds.map((entry, index) => [entry, index + 1]));
worldRanks.human = 3;
const drawContext = {
  HUMAN_TOURNAMENT_ENTRY: "human",
  TOURNAMENT_CHARACTER_POOL: aiIds,
  AI_SURFACE_PREFERENCES: Object.fromEntries(aiIds.map((entry, index) => [entry, index % 3 === 0 ? "hard" : "clay"])),
  currentRankingTotalPoints: () => 0,
  rankedAiTournamentEntries: (entries) => [...entries].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2))),
  tournamentWorldRankForEntry: (entry) => worldRanks[entry] || 99999,
  tournamentPlayerLabel: (entry) => entry,
  shuffle: (entries) => [...entries],
};
vm.runInNewContext(`
  ${sourceOf(app, "circuitHumanLevel")}
  ${sourceOf(app, "sortTournamentEntriesByWorldRank")}
  ${sourceOf(app, "tournamentPositionMap")}
  ${sourceOf(app, "buildTournamentRound16Positions")}
  level1 = buildTournamentRound16Positions("coach", "hard", 999);
  level2 = buildTournamentRound16Positions("coach", "hard", 1000);
  level3 = buildTournamentRound16Positions("coach", "hard", 3001);
`, drawContext);

for (const [level, expected] of [[drawContext.level1, 1], [drawContext.level2, 2], [drawContext.level3, 3]]) {
  assert.equal(level.humanLevel, expected);
  assert.equal(level.positions.slice(1).length, 16);
  assert.equal(new Set(level.positions.slice(1)).size, 16);
  assert.equal(level.positions.slice(1).filter((entry) => entry === "human").length, 1);
  assert.deepEqual(Object.values(level.seedNumbers).sort(), [1, 2, 3, 4]);
}

const bracketContext = {
  state: { tournament: { weekly: true, tournamentPositions: Object.fromEntries(Array.from({ length: 16 }, (_, index) => [`p${index + 1}`, index + 1])) } },
  simulateAiTournamentMatch: (playerA) => ({ winner: playerA, setScores: [[6, 2], [6, 3]] }),
};
vm.runInNewContext(`${sourceOf(app, "buildWeeklyTournamentMatches")}; matches = buildWeeklyTournamentMatches([null, ...Array.from({ length: 16 }, (_, index) => "p" + (index + 1))], "human", 2);`, bracketContext);
assert.equal(
  bracketContext.matches.slice(0, 8).map((match) => `${match.playerA}-${match.playerB}`).join(","),
  "p1-p16,p9-p8,p5-p12,p13-p4,p3-p14,p11-p6,p7-p10,p15-p2",
);

const bonusContext = {
  SURFACE_BONUSES: {
    hard: [1, 2, 3].map((index) => ({ id: `hard${index}` })),
    grass: [1, 2, 3].map((index) => ({ id: `grass${index}` })),
    clay: [1, 2, 3].map((index) => ({ id: `clay${index}` })),
  },
  Math: { random: () => 0.25, floor: Math.floor },
  shuffle: (entries) => [...entries],
};
vm.runInNewContext(`
  ${sourceOf(app, "randomSurfaceBonus")}
  ${sourceOf(app, "allCircuitSeedBonuses")}
  ${sourceOf(app, "randomCircuitBonus")}
  ${sourceOf(app, "addCircuitBonus")}
  ${sourceOf(app, "buildWeeklyCircuitProBonuses")}
  entries = ["human", "ai1", "ai2", "ai3", "ai4"];
  seeds = ["human", "ai1", "ai2", "ai3"];
  amateurBonuses = buildWeeklyCircuitProBonuses(entries, seeds, "hard", 1);
  middleBonuses = buildWeeklyCircuitProBonuses(entries, seeds, "hard", 2);
  advancedBonuses = buildWeeklyCircuitProBonuses(entries, seeds, "hard", 3);
`, bonusContext);
for (const entry of ["human", "ai1", "ai2", "ai3"]) {
  assert.equal(bonusContext.amateurBonuses.bonuses[entry].length, 1);
  assert.equal(bonusContext.middleBonuses.bonuses[entry].length, 1);
  assert.equal(bonusContext.middleBonuses.bonuses[entry][0].id.startsWith("hard"), true);
  assert.equal(bonusContext.advancedBonuses.bonuses[entry].length, 2);
  assert.notEqual(bonusContext.advancedBonuses.bonuses[entry][0].id, bonusContext.advancedBonuses.bonuses[entry][1].id);
}

const coefficientContext = {
  aiCharacterName: (entry) => entry,
};
vm.runInNewContext(`
  ${sourceOf(server, "applyAiWeeklyPerformanceCoefficients")}
  totals = new Map([["ai1", 100], ["ai2", 100], ["ai3", 100], ["ai4", 100], ["ai5", 100], ["ai6", 100]]);
  standings = {
    boostedTopIds: ["ai1"],
    worldOrderIds: ["ai1", "ai2", "ai3", "ai4", "ai5", "ai6"],
    rows: [],
  };
  standings.rows = standings.worldOrderIds.map((characterId) => ({ characterId, scoreRef: 0, scoreTotal: 0 }));
  adjusted = applyAiWeeklyPerformanceCoefficients(totals, standings, 10000);
`, coefficientContext);
assert.equal(coefficientContext.adjusted.get("ai1"), 220);
assert.equal(coefficientContext.adjusted.get("ai2"), 200);
assert.equal(coefficientContext.adjusted.get("ai3"), 200);
assert.equal(coefficientContext.adjusted.get("ai4"), 180);
assert.equal(coefficientContext.adjusted.get("ai5"), 160);
assert.equal(coefficientContext.adjusted.get("ai6"), 150);

assert.match(server, /function simulatedAiMatchPerformancePoints/);
assert.match(server, /5 \+ Math\.abs\(score\[0\] - score\[1\]\)/);
assert.match(server, /if \(loserSets === 0\).*\+ 5/);

console.log("v143 RankIA, tirages Circuit Pro et points IA: OK");
