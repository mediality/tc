import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

const portraitMarkup = app.match(/<div class="character-portrait-stage">[\s\S]*?<\/div>`;/);
assert.ok(portraitMarkup, "le rendu du portrait doit être présent");
assert.match(portraitMarkup[0], /academyTurnButtons/);
assert.match(css, /\.character-portrait-stage > \.character-card\s*\{[\s\S]*width: 100%;[\s\S]*height: 100%;/);
assert.match(css, /desktop-profile-actions--local[\s\S]*bottom: calc\(100% \+ 40px\);/);

assert.equal(packageJson.version, "6.5.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.5<\/span>/);

console.log("V4.54 profile-anchored desktop action tray checks passed.");
