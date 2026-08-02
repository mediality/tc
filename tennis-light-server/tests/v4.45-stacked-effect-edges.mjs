import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.45.0");
assert.match(index, /styles\.css\?v=4\.45\.0/);
assert.match(index, /app\.js\?v=4\.45\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.45<\/span>/);

assert.match(app, /function effectCardPrecedesCard\(playedCards, cardIndex\)/);
assert.match(app, /const targetCard = playedCards\[cardIndex\]/);
assert.match(app, /if \(!targetCard \|\| targetCard\.remiseMode === "placement"\) return false;/);
assert.match(app, /card\.remiseMode === "effect" && !card\.removed/);
assert.match(app, /precededByEffect: effectCardPrecedesCard\(playedCards, playerOrder\)/);
assert.match(app, /precededByEffect && !remiseCards\.length \? " preceded-by-effect" : ""/);
assert.match(styles, /V4\.45 the same single restored edge also applies between consecutive Effect cards/);
assert.match(styles, /\.desktop-played-card\.preceded-by-effect::after\s*\{\s*border-left: 2px solid #fff;/);

console.log("Version 4.45 : bord restauré entre Effets successifs, sans toucher aux Remises : OK");
