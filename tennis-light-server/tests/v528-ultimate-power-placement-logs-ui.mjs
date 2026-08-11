import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.4<\/span>/);
assert.match(app, /boostedReplyRequired = Boolean\(state\.lastCard\?\.boosted/);
assert.match(app, /placementRequired = state\.mandatoryPlacement \|\| boostedReplyRequired/);
assert.match(app, /ultimateConsumedStarUids/);
assert.match(app, /consumesContiStarPower/);
assert.match(app, /ultimate_conti_star_power_resolved/);
assert.match(app, /indexedDB\.open\(ULTIMATE_LOG_DATABASE/);
assert.match(app, /readAllUltimateMatchArchives/);
assert.match(css, /ultimate-profile-energy[^}]*background: #d93743/s);
assert.match(css, /nth-child\(n \+ 7\)/);

console.log("V5.28 Ultimate power, placement, archive and profile checks passed.");
