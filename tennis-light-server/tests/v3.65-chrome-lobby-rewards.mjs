import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v3\.65"/);
assert.match(html, /styles\.css\?v=3\.65\.0/);
assert.match(html, /app\.js\?v=3\.65\.0/);

const masterStart = app.indexOf("function startOnePointMasterMode(");
const masterEnd = app.indexOf("\nfunction onePointMasterStandings(", masterStart);
const master = app.slice(masterStart, masterEnd);
assert.match(master, /bonusLevel: "reward"/);
assert.match(master, /surfaceBonuses: Object\.fromEntries\(setup\.ranked\.map\(\(entry\) => \[entry, \[\]\]\)\)/);
assert.doesNotMatch(master, /surfaceBonuses: buildAiClubHouseBonuses/);

assert.match(styles, /\.card\.has-visual,[\s\S]*transition: box-shadow 160ms ease;/);
assert.doesNotMatch(styles, /\.card\.unplayable \{\s*filter:/);
assert.match(styles, /\.card\.unplayable \{[\s\S]*background: #eef1f2;/);
assert.match(styles, /\.championship-lobby-screen :is\(h1, h2, h3, p, span, strong, b, small, button\) \{\s*color: #243947 !important;/);

console.log("v3.65 : rendu Chrome, salons sombres sur fond clair et Récompense sans bonus initial : OK");
