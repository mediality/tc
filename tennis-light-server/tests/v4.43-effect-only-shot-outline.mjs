import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.43.0");
assert.match(index, /styles\.css\?v=4\.43\.0/);
assert.match(index, /app\.js\?v=4\.43\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.43<\/span>/);

assert.match(app, /function effectCardPrecedesShot\(playedCards, shotIndex\)/);
assert.match(app, /card\.remiseMode === "effect" && !card\.removed/);
assert.match(app, /precededByEffect: effectCardPrecedesShot\(playedCards, playerOrder\)/);
assert.match(app, /precededByEffect && !remiseCards\.length \? " preceded-by-effect" : ""/);
assert.match(styles, /\.desktop-played-card\.preceded-by-effect::after/);
assert.doesNotMatch(styles, /\.desktop-played-card\.has-remise-underlay::after\s*\{[\s\S]*?border: 2px solid #fff/);
assert.match(styles, /V4\.43 outline applies to Effect \+ Shot only, never Remise \+ Shot/);
assert.match(styles, /\.desktop-played-card\.has-remise-underlay:not\(\.preceded-by-effect\)::after[\s\S]*?content: none;/);

console.log("Version 4.43 : contour complété uniquement pour Effet + Coup, jamais pour Remise + Coup : OK");
