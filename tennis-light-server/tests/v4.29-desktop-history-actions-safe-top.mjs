import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.31.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.31<\/span>/);
assert.match(app, /playerAvatar\(opponentIndex, opponentPlayer, "opponent"\)/);
assert.match(styles, /padding-top: max\(8px, env\(safe-area-inset-top\)\) !important/);
assert.match(styles, /\.court > \.log \{\s*z-index: 30/);
assert.match(styles, /game-actions-always-visible[\s\S]*\.card-actions \{[\s\S]*pointer-events: auto !important/);
assert.match(styles, /\.card-actions button \{[\s\S]*flex: 1 1 0/);

console.log("Version 4.29 : historique sous la main, actions actives et scores protégés : OK");
