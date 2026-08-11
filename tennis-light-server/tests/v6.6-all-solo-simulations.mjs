import assert from "node:assert/strict";
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

assert.equal(packageJson.version, "6.8.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.8<\/span>/);

const league = functionSource(app, "startLeagueTournamentMode");
const championship = functionSource(app, "startChampionshipMode");
const master = functionSource(app, "startOnePointMasterMode");
const classic = functionSource(app, "startTournamentMode");
const simulation = functionSource(app, "simulateAiTournamentMatch");
const live = functionSource(app, "advanceProgressiveTournamentScores");

assert.match(league, /progressiveLiveScores: true/);
assert.match(championship, /progressiveLiveScores: true/);
assert.match(master, /progressiveLiveScores: false/);
assert.match(classic, /progressiveLiveScores: !onePointGame/);
assert.match(simulation, /simulateCalibratedOnePointMatch\(playerA, playerB, match\)/);
assert.match(simulation, /advanceProgressiveTournamentMatch\(simulatedMatch, targetSets\)/);
assert.doesNotMatch(simulation, /aiTournamentStrength/);
assert.doesNotMatch(simulation, /Math\.random\(\) < 0\.2/);
assert.match(live, /state\.tournament\.championship/);
assert.match(live, /refreshChampionshipSlots\(\)/);
assert.match(live, /refreshLeagueKnockoutSlots\(\)/);

console.log("V6.6 calibrated Solo and Circuit Pro simulations passed.");
