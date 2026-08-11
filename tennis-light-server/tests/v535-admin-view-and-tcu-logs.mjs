import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const mobile = readFileSync(new URL("../public/mobile-game.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.6<\/span>/);
assert.match(html, /Tennis Courts Ultimate<\/strong><small>V5\.35/);
assert.match(html, /id="adminUltimateExportLogsButton"[^>]*>Exporter les logs TCU<\/button>/);
assert.match(html, /id="adminGameViewToggle"[^>]*role="switch"/);
assert.doesNotMatch(html, /id="adminDesktopViewSwitch"/);
assert.doesNotMatch(html, />\s*Version desktop\s*</i);
assert.match(app, /const ADMIN_GAME_VIEW_KEY = "tennisLightAdminGameView"/);
assert.match(app, /admin-forced-mobile-view/);
assert.match(app, /adminUltimateExportLogsButton.*runAdminGameTool\(exportLogsFile\)/s);
assert.match(mobile, /data-mobile-admin-tool="export-tcu-logs"/);
assert.match(mobile, /data-mobile-admin-game-view/);
assert.match(mobile, /function setAdminViewPreference\(preference = "auto"\)/);

console.log("V5.35 admin game-view and TCU log export checks passed.");
