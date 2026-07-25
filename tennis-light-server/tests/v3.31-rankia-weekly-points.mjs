import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const server = await readFile(new URL("../server.js", import.meta.url), "utf8");

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

const aiIds = Array.from({ length: 21 }, (_, index) => `ai${index + 1}`);
const coefficientContext = {
  CIRCUIT_AI_CHARACTER_IDS: aiIds,
  aiCharacterName: (id) => id,
};
vm.runInNewContext(`
  ${sourceOf(server, "applyAiWeeklyPerformanceCoefficients")}
  standings = {
    worldOrderIds: ${JSON.stringify(aiIds)},
  };
  base = new Map(standings.worldOrderIds.map((id) => [id, 100]));
  adjusted = applyAiWeeklyPerformanceCoefficients(base, standings, 10000);
  cappedBase = new Map(standings.worldOrderIds.map((id) => [id, 600]));
  capped = applyAiWeeklyPerformanceCoefficients(cappedBase, standings, 1000);
`, coefficientContext);

for (let index = 1; index <= 5; index += 1) {
  assert.equal(coefficientContext.adjusted.get(`ai${index}`), 170);
}
for (let index = 6; index <= 10; index += 1) {
  assert.equal(coefficientContext.adjusted.get(`ai${index}`), 150);
}
for (let index = 11; index <= 21; index += 1) {
  assert.equal(coefficientContext.adjusted.get(`ai${index}`), 125);
}

assert.equal(coefficientContext.capped.get("ai1"), 1000);
assert.equal(coefficientContext.capped.get("ai2"), 850);
assert.equal(coefficientContext.capped.get("ai3"), 800);
assert.equal(coefficientContext.capped.get("ai4"), 750);
assert.equal(coefficientContext.capped.get("ai5"), 700);
assert.equal(coefficientContext.capped.get("ai6"), 600);
assert.equal(coefficientContext.capped.get("ai21"), 600);

const pointMaxContext = {
  COMPETITION_DEFINITIONS: [
    { week: 4, points: { winner: 400 } },
    { week: 4, points: { winner: 600 } },
    { week: 4, points: { winner: 1000 } },
    { week: 4, points: { winner: 1500 } },
    { week: 4, points: { winner: 400 } },
    { week: 4, points: { winner: 800 } },
    { week: 5, points: { winner: 2000 } },
  ],
  POINT_TABLES: {},
};
vm.runInNewContext(`
  ${sourceOf(server, "maxWeeklyTournamentPoints")}
  pointMax = maxWeeklyTournamentPoints(4);
`, pointMaxContext);
assert.equal(pointMaxContext.pointMax, 5450);

const performanceSource = sourceOf(server, "simulatedAiMatchPerformancePoints");
assert.match(performanceSource, /5 \+ Math\.abs\(score\[0\] - score\[1\]\)/);
assert.match(performanceSource, /if \(loserSets === 0\) points\.set\(winner, \(points\.get\(winner\) \|\| 0\) \+ 5\)/);

const simulationSource = sourceOf(server, "simulateAiCircuitWeek");
assert.match(simulationSource, /simulationIndex < 2/);
assert.match(simulationSource, /runNonce = `\$\{simulationNonce\}:run:\$\{simulationIndex \+ 1\}`/);
assert.match(simulationSource, /simulatedAiLeaguePoints/);
assert.match(simulationSource, /simulatedAiTournamentPoints/);

console.log("v3.31 RankIA : double simulation, points de match, coefficients et PointMAX : OK");
