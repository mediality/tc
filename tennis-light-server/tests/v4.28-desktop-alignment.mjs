import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.31.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.31<\/span>/);
assert.doesNotMatch(html, /id="gameLogoButton"/);
assert.doesNotMatch(html, /id="gameProfileButton"/);
assert.match(html, /class="court-logo-watermark"/);
assert.match(app, /const desktopCardLocked = playerIndex === state\.activePlayer/);
assert.match(app, /playerAvatar\(opponentIndex, opponentPlayer, "opponent"\)/);
assert.match(app, /els\.desktopGameMenu\.insertBefore\(els\.globalPlayerDock/);
assert.match(styles, /\.court-logo-watermark[\s\S]*opacity: \.5/);
assert.match(styles, /\.game-assist-panel[\s\S]*top: calc\(100% \+ 8px\) !important/);

console.log("Version 4.28 : scores réalignés, filigrane et menus sous la barre : OK");
