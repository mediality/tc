import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.16.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.16<\/span>/);

assert.match(app, /const projectedPowers = state\.players\.map\(\(player\) => Number\(player\?\.power \|\| 0\) \+ projectedEndBonuses\(player\)\)/);
assert.match(app, /const passBonus = Math\.max\(2, Number\(passingPlayer\?\.endurance \|\| 0\)\)/);
assert.match(app, /projectedPowers\[passWinnerCandidate\] \+= passBonus \+ rosaBonus/);
assert.match(app, /: state\.server;/);
assert.doesNotMatch(css, /desktop-live-power-score--effect/);

assert.match(app, /desktop-score-turn-dot--player\$\{state\.activePlayer === localIndex/);
assert.match(app, /desktop-score-turn-dot--opponent\$\{state\.activePlayer === opponentIndex/);
assert.match(css, /desktop-score-turn-dot--player[\s\S]*?left: 9px/);
assert.match(css, /desktop-score-turn-dot--opponent[\s\S]*?right: 9px/);

assert.match(app, /els\.saveMatchButton\?\.classList\.toggle\("hidden", !state\.tournament\?\.weekly\)/);
assert.match(app, /available: Boolean\(state\.tournament\?\.weekly\)/);
assert.match(app, /La sauvegarde manuelle est réservée au Circuit Pro/);

assert.match(css, /--desktop-played-stack-height: calc\(var\(--desktop-played-card-height\) \* 1\.3\)/);
assert.match(css, /desktop-played-row--opponent[\s\S]*?top: calc\(50% - var\(--desktop-played-stack-height\) - 5px\)/);
assert.match(css, /desktop-played-row--player[\s\S]*?top: calc\(50% \+ 5px\)/);
assert.doesNotMatch(app, /playerRow\.style\.setProperty\("--desktop-row-offset"/);

console.log("Version 4.15 : meneur projeté, sauvegarde Circuit Pro et plateau stable : OK");
