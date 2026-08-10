import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

assert.match(app, /<div class="character-card[\s\S]*?<div class="turn-buttons">/);
assert.match(css, /V4\.55[\s\S]*\.player-panel \.character-card\s*\{\s*overflow: visible;/);
assert.match(css, /\.character-card > img\s*\{[\s\S]*border-radius: 50%;/);
assert.match(css, /\.character-card > \.turn-buttons\s*\{[\s\S]*z-index: 40;[\s\S]*bottom: calc\(100% \+ 20px\);[\s\S]*left: 50%;[\s\S]*transform: translateX\(-50%\);[\s\S]*visibility: visible;[\s\S]*opacity: 1;[\s\S]*pointer-events: auto;/);

assert.equal(packageJson.version, "4.55.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.55<\/span>/);
assert.doesNotMatch(html, /v=4\.54\.0/);

console.log("V4.55 visible profile action tray checks passed.");
