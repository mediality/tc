import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

const portraitMarkup = app.match(/<div class="character-card[\s\S]*?<\/div>\s*<div class="desktop-player-identity/);
assert.ok(portraitMarkup, "le rendu du portrait doit être présent");
assert.match(portraitMarkup[0], /<div class="turn-buttons">/);
assert.match(css, /\.character-card > \.turn-buttons\s*\{[\s\S]*bottom: calc\(100% \+ 20px\);[\s\S]*left: 50%;[\s\S]*transform: translateX\(-50%\);/);
assert.match(css, /data-desktop-role="opponent"[^}]*\.character-card > \.turn-buttons\s*\{[\s\S]*top: calc\(100% \+ 20px\);/);

assert.equal(packageJson.version, "4.54.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.54<\/span>/);
assert.doesNotMatch(html, /v=4\.53\.0/);

console.log("V4.54 profile-anchored desktop action tray checks passed.");
