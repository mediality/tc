import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.60.0");
assert.match(app, /const GAME_VERSION = "v3\.60"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.60<\/span>/);

assert.match(app, /state\.tournament\?\.onePointGame \|\| state\.tournament\?\.friendlyFormat === "onepoint"/);
assert.match(app, /Victoire sur boost/);
assert.match(app, /Victoire aux points · \$\{Number\(state\.players\[winner\]\?\.power \|\| 0\)\}-\$\{Number\(state\.players\[opponentOf\(winner\)\]\?\.power \|\| 0\)\}/);
assert.match(app, /Victoire sur effet/);
assert.match(app, /one-point-victory-type/);
assert.match(app, /one-point-final-score-label">Score final/);

assert.match(styles, /\.one-point-victory-type[\s\S]*animation: match-finale-set 260ms ease-out 1s forwards/);
assert.match(styles, /\.one-point-finale-overlay \.match-finale-result-image[\s\S]*animation-delay: 3s/);
assert.match(styles, /\.one-point-finale-overlay > ol li[\s\S]*calc\(3s \+ var\(--reveal-index\) \* 400ms\)/);
assert.match(styles, /\.match-finale-overlay > nav button[\s\S]*font-size: \.9rem[\s\S]*font-weight: 800[\s\S]*line-height: 1\.15/);

console.log("v3.60 : séquence finale du 1 Point Game et boutons harmonisés : OK");
