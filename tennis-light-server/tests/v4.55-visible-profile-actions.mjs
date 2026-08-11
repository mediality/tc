import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

assert.match(app, /desktop-profile-actions desktop-profile-actions--\$\{actionRole\}/);
assert.match(css, /V6\.1 Academy action trays[\s\S]*\.desktop-profile-actions\s*\{[\s\S]*z-index: 40;[\s\S]*left: 50%;[\s\S]*visibility: visible;[\s\S]*opacity: 1;[\s\S]*pointer-events: auto;/);

assert.equal(packageJson.version, "6.6.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.6<\/span>/);

console.log("V4.55 visible profile action tray checks passed.");
