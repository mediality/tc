import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.39.0");
assert.match(index, /styles\.css\?v=4\.39\.0/);
assert.match(index, /app\.js\?v=4\.39\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.39<\/span>/);

assert.doesNotMatch(app, /desktopHistoryResizeObserver/);
assert.match(styles, /V4\.39 compact history tab and explicit seventh-card angle inheritance/);
assert.match(styles, /\.desktop-history-drawer-toggle\s*\{[\s\S]*?align-self: center;[\s\S]*?height: auto !important;[\s\S]*?grid-template-rows: auto auto;/);
assert.match(styles, /\.desktop-history-drawer-content\s*\{\s*align-self: center;\s*height: auto;/);

assert.match(app, /const precedingCard = player\.hand\[player\.hand\.length - 1\]/);
assert.match(app, /card\.desktopHandAngle = precedingCard\?\.desktopHandAngle[\s\S]*?desktopHandAngleForIndex\(player\.hand\.length - 1\)/);
assert.match(app, /drawn-card-inherited-angle/);
assert.match(app, /--drawn-card-angle: \$\{escapeHtml\(card\.desktopHandAngle\)\}/);
assert.match(styles, /\.card\.drawn-card-inherited-angle[\s\S]*?transform: rotate\(var\(--drawn-card-angle\)\) !important;/);

console.log("Version 4.39 : languette compacte et septième carte inclinée comme la sixième : OK");
