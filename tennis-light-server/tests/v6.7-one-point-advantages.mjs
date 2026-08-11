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

assert.equal(packageJson.version, "6.10.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.10<\/span>/);

const context = vm.createContext({ Math });
vm.runInContext(functionSource(app, "onePointWinChanceFromAdvantage"), context);
for (const [gap, expected] of [[0, 0.5], [1, 0.58], [2, 0.66], [3, 0.73], [4, 0.79], [5, 0.83], [6, 0.85], [-6, 0.15]]) {
  assert.ok(Math.abs(vm.runInContext(`onePointWinChanceFromAdvantage(${gap})`, context) - expected) < 0.000001);
}

const simulation = functionSource(app, "simulateCalibratedOnePointMatch");
const positions = functionSource(app, "onePointMasterPositionAdvantages");
const previous = functionSource(app, "onePointPreviousResultAdvantage");
const score = functionSource(app, "onePointScoreFromWinnerAdvantage");
const ready = functionSource(app, "ensureSimulatedTournamentMatchReady");

assert.match(simulation, /progressiveTournamentHandQuality\(\)/);
assert.match(simulation, /onePointPreviousResultAdvantage/);
assert.match(simulation, /onePointSimulatedServer/);
assert.match(simulation, /onePointMasterPositionAdvantages/);
assert.match(simulation, /\(ranks\[1\] - ranks\[0\]\) \/ 12/);
assert.match(previous, /priority === 6[\s\S]*return 2/);
assert.match(previous, /priority === 5[\s\S]*return 1/);
assert.match(positions, /championshipPhase === 3/);
assert.match(positions, /onePointMasterSecondPlaceEntries/);
assert.match(positions, /match\.round === "quarter"/);
assert.match(score, /\[0\.80, 0\.17, 0\.03\]/);
assert.match(score, /\[0\.10, 0\.30, 0\.60\]/);
assert.match(ready, /simulateAiTournamentMatch\(match\.playerA, match\.playerB,[\s\S]*match\)/);

console.log("V6.10 One Point contextual advantages passed.");
