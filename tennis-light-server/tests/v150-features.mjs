import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
]);

assert.match(html, /Tennis Courts Academy <span>v150<\/span>/);
assert.match(html, /<p class="label">Tennis Courts Pro Circuit<\/p>/);
assert.match(html, /DEVENEZ LE GOAT !/);
assert.doesNotMatch(html, /Barème de parcours/i);

assert.match(app, /const circuitPositionPairs = \[\[1, 16\], \[9, 8\], \[5, 12\], \[13, 4\], \[3, 14\], \[11, 6\], \[7, 10\], \[15, 2\]\]/);
assert.match(app, /state\.tournament\?\.distribution === "ranking"\s*\? circuitPositionPairs/);
assert.match(app, /rankedRoster\.forEach\(\(entry, index\) => \{ positions\[index \+ 1\] = entry; \}\)/);
assert.match(app, /revealAllTournamentAiSets\(match\.round\)/);
assert.match(app, /renderResultTournamentActionButton\(\)/);
assert.match(app, /bindResultTournamentButton\(\)/);

console.log("v150 circuit, tableau POS et progression de tournoi: OK");
