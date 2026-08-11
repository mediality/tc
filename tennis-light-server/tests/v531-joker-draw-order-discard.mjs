import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.5<\/span>/);
assert.match(app, /placementRequired && !state\.turnIgnoresPlacement\[playerIndex\]/);
assert.match(app, /state\.turnUndoLocked = true/);
assert.match(app, /state\.turnDirty && !state\.turnUndoLocked/);
assert.match(app, /canPassAfterIrreversibleDrawImpasse/);
assert.match(app, /ultimateDeckOrder: index \+ 1/);
assert.match(app, /ultimateDeckOrder: card\.ultimateDeckOrder/);
assert.match(app, /ultimate-discard-grid[\s\S]*data-image-zoom/);
assert.match(css, /ultimate-profile-energy[^}]*#ff2c2c/);
assert.match(css, /ultimate-card-play-button[^}]*#274ab3/);

console.log("V5.31 Joker, irreversible draw, fixed deck order and discard preview checks passed.");
