import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.41.0");
assert.match(index, /styles\.css\?v=4\.41\.0/);
assert.match(index, /app\.js\?v=4\.41\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.41<\/span>/);

assert.match(styles, /V4\.41 rounded center-board cards matching the player's hand/);
assert.match(styles, /\.desktop-played-card\s*\{\s*border-radius: var\(--game-card-radius\);/);
assert.match(styles, /\.desktop-played-card > img:not\(\.remise-forbid-overlay\)\s*\{\s*border-radius: var\(--game-card-radius\);\s*clip-path: inset\(0 round 7\.2% \/ 5\.2%\);/);
assert.match(styles, /\.desktop-played-card \.desktop-remise-underlay,[\s\S]*?\.desktop-played-card \.desktop-boost-underlay,[\s\S]*?\.desktop-played-card \.boost-sacrifice-back[\s\S]*?border-radius: var\(--game-card-radius\);/);

console.log("Version 4.41 : coins des cartes posées arrondis comme ceux de la main : OK");
