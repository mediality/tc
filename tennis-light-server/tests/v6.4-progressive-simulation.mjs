import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

function functionSource(source, name) {
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

assert.equal(packageJson.version, "6.18.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.18<\/span>/);
assert.match(app, /Math\.max\(\.18, Math\.min\(\.82,/);
assert.match(app, /hands\[0\] \* 0\.75/);
assert.match(app, /progress\.momentum\[winner\] = Math\.min\(1, progress\.momentum\[winner\] \+ 0\.2\)/);
assert.doesNotMatch(functionSource(app, "advanceProgressiveTournamentMatch"), /progress\.server = loser/);

const math = Object.create(Math);
let randomValue = 0;
math.random = () => randomValue;
const context = vm.createContext({ Math: math, tournamentRankIa: (entry) => Number(entry), opponentOf: (index) => 1 - index });
for (const name of [
  "progressiveTournamentRankRating",
  "progressiveTournamentHandQuality",
  "progressiveTournamentExchangeScore",
  "progressiveTournamentNextServer",
]) {
  vm.runInContext(functionSource(app, name), context);
}

assert.equal(vm.runInContext("progressiveTournamentRankRating(1)", context), 0);
assert.equal(vm.runInContext("progressiveTournamentRankRating(24)", context), -2.055);
for (const [roll, expected] of [[0.01, -2], [0.10, -1], [0.50, 0], [0.90, 1], [0.99, 2]]) {
  randomValue = roll;
  assert.equal(vm.runInContext("progressiveTournamentHandQuality()", context), expected);
}

assert.equal(vm.runInContext("progressiveTournamentNextServer({ server: 0 }, [2, 2])", context), 1);
assert.equal(vm.runInContext("progressiveTournamentNextServer({ server: 1 }, [6, 5])", context), 0);
assert.equal(vm.runInContext("progressiveTournamentNextServer({ server: 0 }, [5, 6])", context), 1);

let seed = 0x6a4f19;
math.random = () => {
  seed = (1664525 * seed + 1013904223) >>> 0;
  return seed / 0x100000000;
};
const counts = { "2-1": 0, "2-0": 0, "3-0": 0 };
for (let index = 0; index < 200000; index += 1) {
  const score = vm.runInContext("progressiveTournamentExchangeScore(0)", context);
  counts[`${score[0]}-${score[1]}`] += 1;
}
assert.ok(counts["2-1"] / 200000 > 0.59 && counts["2-1"] / 200000 < 0.61);
assert.ok(counts["2-0"] / 200000 > 0.29 && counts["2-0"] / 200000 < 0.31);
assert.ok(counts["3-0"] / 200000 > 0.09 && counts["3-0"] / 200000 < 0.11);

console.log("V6.4 calibrated progressive tournament simulation passed.");
