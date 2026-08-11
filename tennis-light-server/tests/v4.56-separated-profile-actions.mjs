import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

assert.match(app, /class="character-portrait-stage"[\s\S]*class="character-card[\s\S]*<\/div>\s*\$\{actionRole === "local" \? academyTurnButtons : ""\}/);
assert.match(app, /ULTIMATE_MODE\.active \? `<div class="turn-buttons">[\s\S]*: actionRole === "opponent" \? academyTurnButtons : ""/);
assert.match(app, /desktopRole: playerIndex === localPlayerIndex \? "local" : "opponent"/);

assert.match(css, /data-desktop-role="local"[^}]*\.desktop-profile-actions--local\s*\{[\s\S]*bottom: calc\(100% \+ 40px\);/);
assert.match(css, /data-desktop-role="opponent"[^}]*> \.desktop-profile-actions--opponent\s*\{[\s\S]*top: calc\(100% \+ 40px\);/);
assert.match(css, /\.character-portrait-stage\s*\{[\s\S]*overflow: visible;/);

assert.equal(packageJson.version, "6.9.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.9<\/span>/);

console.log("V4.56 separated local and opponent profile action checks passed.");
