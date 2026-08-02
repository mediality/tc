import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.35.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.35<\/span>/);
assert.match(html, /styles\.css\?v=4\.35\.0/);
assert.match(app, /let desktopHistoryExpanded = false/);
assert.match(app, /data-toggle-history-drawer[\s\S]*desktopHistoryExpanded \? "→" : "←"/);
assert.match(app, /if \(!preserveSet\) desktopHistoryExpanded = false/);
assert.match(app, /tutorialAllowsPass\(\)\s*&& !hasPlayedThisTurn\(playerIndex\)/);
assert.match(app, /canEndTurn\(playerIndex\)[\s\S]*Terminer le tour/);
assert.match(app, /canUndoTurn\(playerIndex\)[\s\S]*Annuler le tour/);
assert.match(styles, /V4\.35 center-right collapsible history drawer/);
assert.match(styles, /top: 50%;[\s\S]*right: 0;[\s\S]*translate\(calc\(100% - 46px\), -50%\)/);
assert.match(styles, /desktop-history-drawer--open[\s\S]*translate\(0, -50%\)/);
assert.match(styles, /writing-mode: vertical-rl/);

console.log("Version 4.35 : historique repliable au centre droit et actions de tour cohérentes : OK");
