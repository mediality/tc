import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.9.0");
assert.match(html, /styles\.css\?v=4\.9\.0/);
assert.match(html, /app\.js\?v=4\.9\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.9<\/span>/);

assert.match(app, /function desktopExchangeResultData\(line\)/);
assert.match(app, /function desktopExchangeResultMarkup\(line, playerSide = "information"\)/);
assert.match(app, /class="desktop-exchange-winner desktop-exchange-winner--\$\{result\.winnerSide \|\| playerSide\}"/);
assert.match(app, /class="desktop-exchange-score"/);
assert.match(app, /Score du set : \$\{Number\(recalledScore\[0\]/);
assert.match(css, /\.desktop-exchange-winner--player\s*\{\s*background:\s*#8ce0bf/);
assert.match(css, /\.desktop-exchange-winner--opponent\s*\{\s*background:\s*#f2a37f/);
assert.match(css, /\.desktop-exchange-score\s*\{\s*background:\s*#fff/);

assert.match(css, /\.court > \.log\s*\{[\s\S]*?width:\s*clamp\(250px, 23vw, 340px\)/);
assert.match(css, /player-panel\[data-desktop-role="local"\]\s*\{\s*z-index:\s*40/);
assert.match(css, /\.desktop-played-row--player\s*\{\s*bottom:\s*-10%/);

assert.match(css, /\.global-player-dock\.read-only[\s\S]*?width:\s*42px/);
assert.match(css, /\.global-player-dock\.read-only \.global-player-copy\s*\{\s*display:\s*none/);
assert.match(css, /\.character-power-reminder\s*\{[\s\S]*?width:\s*min\(132px, 100%\)[\s\S]*?border-radius:\s*18px/);
assert.match(css, /\.character-endurance-reminder\.warning-endurance[\s\S]*?background:\s*#f4cbd5/);
assert.match(css, /\.character-endurance-reminder\.low-endurance[\s\S]*?background:\s*#c92828/);
assert.match(css, /\.desktop-player-bonus-count\s*\{[\s\S]*?color:\s*#dff376[\s\S]*?background:\s*rgba\(223, 243, 118, \.08\)/);

assert.match(app, /pass-button--winning/);
assert.match(css, /\.court::before,[\s\S]*?\.net-line\s*\{\s*display:\s*none/);

console.log("Version 4.9 : bilan lisible, historique protégé, cartes rapprochées et profils affinés : OK");
