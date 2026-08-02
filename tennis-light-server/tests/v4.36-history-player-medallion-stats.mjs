import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.36.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.36<\/span>/);
assert.match(html, /styles\.css\?v=4\.36\.0/);
assert.match(styles, /V4\.36 equal-height history drawer/);
assert.match(styles, /court > \.log \{[\s\S]*height: clamp\(230px, 40vh, 390px\)/);
assert.match(styles, /desktop-history-drawer-toggle,[\s\S]*desktop-history-drawer-content[\s\S]*height: 100%/);
assert.match(styles, /player-panel\[data-desktop-role="opponent"\][\s\S]*--desktop-player-color: #f2a37f/);
assert.match(styles, /player-panel\[data-desktop-role="local"\][\s\S]*--desktop-player-color: #8ce0bf/);
assert.match(styles, /player-panel\[data-desktop-role="opponent"\] \.character-zone[\s\S]*grid-column: 3/);
assert.match(styles, /player-panel\[data-desktop-role="local"\] \.character-zone[\s\S]*grid-column: 1/);
assert.match(styles, /\.character-stats \{[\s\S]*grid-column: 1 \/ 3;[\s\S]*grid-row: 3;[\s\S]*display: grid/);
assert.match(styles, /character-power-reminder[\s\S]*background: var\(--desktop-player-color\)/);
assert.match(styles, /character-endurance-reminder\.low-endurance[\s\S]*background: #b83232/);
assert.match(styles, /low-endurance \.stat-symbol-endurance[\s\S]*background-color: #fff/);

console.log("Version 4.36 : historique pleine hauteur et statistiques verrouillées sous les portraits : OK");
