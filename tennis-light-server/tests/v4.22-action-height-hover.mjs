import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.25.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.25<\/span>/);
assert.match(app, /panel\.scrollHeight/);
assert.match(app, /--local-card-action-lift/);
assert.doesNotMatch(app, /if \(!GAMEPLAY_ASSIST\.alwaysVisibleActions\) return/);
assert.match(css, /\.player-panel\[data-desktop-role="local"\] \.hand \.card:hover[\s\S]*?translateY\(calc\(-1 \* var\(--local-card-action-lift, 42px\)\)\) scale\(1\.26\)/);

console.log("Version 4.22 : la carte remonte uniquement de la hauteur des boutons : OK");
