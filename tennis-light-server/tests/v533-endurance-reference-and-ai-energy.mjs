import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V5\.33<\/span>/);
assert.match(app, /if \(action === "endurance"\) \{\s*player\.endurance \+= 2;/);
assert.doesNotMatch(app, /data-energy-choice="endurance"[^>]*disabled/);
assert.match(app, /minimumEnergyReserve/);
assert.match(app, /ultimateEnergySpentExchangeNumber === exchangeNumber/);
assert.match(app, /ultimate_energy_preserved/);
assert.match(app, /ultimate_energy_endurance/);
assert.match(app, /ultimate_energy_draft/);
assert.match(app, /decisiveDanger/);
assert.match(app, /opponentThreat/);

console.log("V5.33 endurance reference and strategic AI energy checks passed.");
