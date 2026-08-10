import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.3<\/span>/);
assert.match(css, /\.image-zoom-backdrop\s*\{[^}]*z-index: 3000/s);
assert.match(css, /ultimate-profile-energy[^}]*#ff2c2c/);
assert.match(css, /ultimate-card-play-button[^}]*#274ab3/);

console.log("V5.32 red energy and foreground discard zoom checks passed.");
