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

const ranked = Array.from({ length: 24 }, (_, index) => `rankia-${index + 1}`);
const coaches = ["coachJu", "coachMax", "coachCarla", "coachClem", "coachHans"];
const context = vm.createContext({
  TOURNAMENT_CHARACTER_POOL: [...ranked].reverse(),
  COACH_OPTIONS: coaches,
  rankedAiTournamentEntries: () => ranked,
  shuffle: (entries) => [...entries].reverse(),
});
vm.runInContext(functionSource(app, "thirtyTwoPlayerTournamentAiEntries"), context);
const entries = JSON.parse(JSON.stringify(vm.runInContext("thirtyTwoPlayerTournamentAiEntries()", context)));

assert.equal(packageJson.version, "6.9.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.9<\/span>/);
assert.equal(entries.length, 31);
assert.deepEqual(entries.slice(0, 24), ranked);
assert.deepEqual(entries.slice(24, 29), coaches);
assert.deepEqual(entries.slice(29), ["coachHans::duplicate:1", "coachClem::duplicate:2"]);
assert.equal(new Set(entries.slice(29).map((entry) => entry.split("::")[0])).size, 2);
assert.match(app, /size === 32\s*\? thirtyTwoPlayerTournamentAiEntries\(\)/);

console.log("V6.5 32-player RankIA, human and coach roster passed.");
