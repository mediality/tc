import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.40.0");
assert.match(index, /styles\.css\?v=4\.40\.0/);
assert.match(index, /app\.js\?v=4\.40\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.40<\/span>/);

const renderLogSource = app.slice(app.indexOf("function renderLog()"), app.indexOf("function closeFullActionLogDialog()"));
assert.match(renderLogSource, /data-open-full-action-log/);
assert.match(renderLogSource, /addEventListener\("click", openFullActionLogDialog\)/);
assert.doesNotMatch(renderLogSource, /desktop-history-drawer-content/);
assert.doesNotMatch(renderLogSource, /data-toggle-history-drawer/);
assert.match(styles, /V4\.40 direct centered history dialog and larger profile power bolts/);
assert.match(styles, /\.action-log-backdrop\s*\{\s*align-items: center;/);
assert.match(styles, /\.action-log-dialog\s*\{[\s\S]*?border-radius: 24px;/);
assert.match(styles, /\.character-power-reminder \.stat-symbol-power\s*\{\s*width: 20px;\s*height: 20px;/);
assert.match(styles, /\.character-power-reminder\.double-digit-power \.stat-symbol-power\s*\{\s*width: 18px;\s*height: 18px;/);

console.log("Version 4.40 : historique en dialogue central et éclairs de puissance agrandis : OK");
