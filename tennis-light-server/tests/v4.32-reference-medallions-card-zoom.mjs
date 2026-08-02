import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.32.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.32<\/span>/);
assert.match(html, /id="gameCardZoomToggle"[\s\S]*Effet loupe sur les cartes/);
assert.match(app, /cardZoom: localStorage\.getItem\("tennisLightCardZoom"\) !== "false"/);
assert.match(app, /if \(!GAMEPLAY_ASSIST\.cardZoom/);
assert.match(app, /localStorage\.setItem\("tennisLightCardZoom"/);
assert.match(styles, /V4\.32 reference medallions/);
assert.match(styles, /grid-template-rows: 92px 24px 34px auto auto/);
assert.match(styles, /width: 84px;[\s\S]*height: 84px;[\s\S]*border-radius: 50%/);
assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(styles, /grid-column: 1 \/ 4;[\s\S]*grid-row: 2;[\s\S]*border-radius: 999px/);
assert.match(styles, /player-panel\[data-desktop-role="opponent"\] \.character-zone[\s\S]*grid-column: 1;[\s\S]*grid-row: 1 \/ 3/);
assert.match(styles, /player-panel\[data-desktop-role="local"\] \.character-zone[\s\S]*grid-column: 3;[\s\S]*grid-row: 2 \/ 4/);

console.log("Version 4.32 : médaillons fidèles à la référence et loupe optionnelle activée par défaut : OK");
