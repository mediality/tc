import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.42.0");
assert.match(index, /styles\.css\?v=4\.42\.0/);
assert.match(index, /app\.js\?v=4\.42\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.42<\/span>/);

assert.match(app, /remiseCards\.length \? " has-remise-underlay" : ""/);
assert.match(styles, /V4\.42 complete white outline above stacked effect \+ shot cards/);
assert.match(styles, /\.desktop-played-card\.has-remise-underlay::after\s*\{[\s\S]*?position: absolute;[\s\S]*?inset: 0;[\s\S]*?z-index: 12;[\s\S]*?border: 2px solid #fff;[\s\S]*?border-radius: var\(--game-card-radius\);[\s\S]*?pointer-events: none;/);

console.log("Version 4.42 : contour blanc complet de la carte Coup au-dessus de la carte Effet : OK");
