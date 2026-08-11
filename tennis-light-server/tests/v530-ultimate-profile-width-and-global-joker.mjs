import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.8<\/span>/);
assert.match(css, /ultimate-character-zone \.character-stats \{ grid-column: 1 \/ -1;/);
assert.match(css, /ultimate-profile-discard[^}]*width: 66%/);
assert.match(app, /state\.lastCard\?\.boosted && state\.lastCard\.owner !== playerIndex/);
assert.match(app, /case "jokerResponse":[\s\S]*state\.turnIgnoresPlacement\[playerIndex\] = true/);

console.log("V5.30 full-width Ultimate resources and global Joker response checks passed.");
