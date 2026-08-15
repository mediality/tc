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

assert.equal(packageJson.version, "6.18.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.18<\/span>/);
const rosterSource = functionSource(app, "thirtyTwoPlayerTournamentAiEntries");
assert.match(rosterSource, /uniqueTournamentAiEntries\(31/);
assert.doesNotMatch(rosterSource, /COACH_OPTIONS|::duplicate:/);
assert.match(app, /size === 32\s*\? thirtyTwoPlayerTournamentAiEntries\(options\.playerSelection, options\.humanCharacterId\)/);

console.log("V6.5 32-player human and coach-free NEXT GEN roster passed.");
