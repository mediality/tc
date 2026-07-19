import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const [html, app] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
]);

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

assert.match(html, /Tennis Courts Academy <span>v152<\/span>/);

const intelligenceSource = functionSource("drawLevelThreeAiIntelligence");
const intelligence = (rankIa, random) => {
  const context = { rankIa, Math: { random: () => random } };
  vm.runInNewContext(`${intelligenceSource}; result = drawLevelThreeAiIntelligence(rankIa);`, context);
  return context.result;
};

assert.equal(intelligence(1, 0.9), "legend");
assert.equal(intelligence(2, 0.9), "legend");
assert.equal(intelligence(3, 0.1), "legend");
assert.equal(intelligence(3, 0.9), "champion");
assert.equal(intelligence(5, 0.9), "champion");
assert.equal(intelligence(7, 0.1), "champion");
assert.equal(intelligence(7, 0.9), "expert");
assert.equal(intelligence(10, 0.9), "expert");
assert.equal(intelligence(12, 0.1), "expert");
assert.equal(intelligence(12, 0.9), "normal");
assert.equal(intelligence(18, 0.1), "normal");
assert.equal(intelligence(19, 0.1), "normal");
assert.equal(intelligence(19, 0.9), "amateur");

function runBonusDraw(randomValue) {
  const entries = Array(17).fill(null);
  for (let position = 1; position <= 16; position += 1) entries[position] = `P${position}`;
  const context = {
    entries,
    HUMAN_TOURNAMENT_ENTRY: "__human__",
    Math: { random: () => randomValue },
    randomSurfaceBonus: () => ({ id: "surface", label: "Surface" }),
    randomCircuitBonus: (excluded = []) => {
      const ids = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
      const id = ids.find((candidate) => !excluded.includes(candidate));
      return id ? { id, label: id } : null;
    },
    addCircuitBonus: (target, entry, bonus) => {
      if (entry && bonus) target[entry] = [...(target[entry] || []), bonus];
    },
  };
  vm.runInNewContext(`${functionSource("buildWeeklyCircuitProBonuses")}; result = buildWeeklyCircuitProBonuses(entries, entries.slice(1, 5), "hard", 3);`, context);
  return context.result.bonuses;
}

const allSuccessful = runBonusDraw(0.1);
assert.equal(allSuccessful.P1.length, 3);
assert.equal(allSuccessful.P2.length, 3);
assert.equal(allSuccessful.P3.length, 1);
assert.equal(allSuccessful.P4.length, 1);
for (const position of [5, 6, 7, 8]) assert.equal(allSuccessful[`P${position}`].length, 1);

const allFailed = runBonusDraw(0.9);
for (const position of [1, 2, 3, 4]) assert.equal(allFailed[`P${position}`].length, 1);
for (const position of [5, 6, 7, 8]) assert.equal(allFailed[`P${position}`], undefined);

assert.match(functionSource("buildTournamentAiIntelligenceLevels"), /options\.humanLevel[\s\S]*drawLevelThreeAiIntelligence/);

console.log("v151 règles spécifiques aux joueurs niveau 3: OK");
