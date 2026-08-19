import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
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

const context = vm.createContext({ Object, Math });
vm.runInContext(functionSource(app, "seededTournamentSlotMap"), context);
assert.deepEqual(
  JSON.parse(JSON.stringify(vm.runInContext("seededTournamentSlotMap(32, 8)", context))),
  { 1: 1, 8: 8, 5: 9, 4: 16, 3: 17, 6: 24, 7: 25, 2: 32 },
);
assert.deepEqual(
  JSON.parse(JSON.stringify(vm.runInContext("seededTournamentSlotMap(8, 4)", context))),
  { 1: 1, 4: 4, 3: 5, 2: 8 },
);

assert.equal(packageJson.version, "6.19.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.19<\/span>/);
assert.match(html, /data-ai-club-setting="tournamentSize" data-ai-club-value="8"/);
assert.match(html, /data-ai-club-setting="tournamentSize" data-ai-club-value="16"/);
assert.match(html, /data-ai-club-setting="tournamentSize" data-ai-club-value="32"/);
assert.match(app, /advanceProgressiveTournamentScores\(\);/);
assert.match(app, /progressiveLiveScores: true/);
assert.match(app, /section\.removeAttribute\("title"\)/);
assert.match(app, /progressiveTournamentExchangeScore\(hands\[winner\] - hands\[loser\]\)/);
assert.match(app, /progressiveTournamentNextServer\(progress, next\)/);
assert.match(app, /round32-column/);
assert.match(css, /\.lobby-mode-card\.locked\s*\{[\s\S]*?opacity:\s*1/);
assert.match(css, /\.lobby-mode-card\.locked::after\s*\{\s*content:\s*none/);
assert.match(css, /V6\.3 compact, readable 8\/16\/32-player Solo brackets/);

console.log("V6.3 live scores, seeded draws, locked cards and compact brackets passed.");
