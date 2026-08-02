import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.38.0");
assert.match(index, /styles\.css\?v=4\.38\.0/);
assert.match(index, /app\.js\?v=4\.38\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.38<\/span>/);

assert.match(app, /let desktopHistoryResizeObserver = null/);
assert.match(app, /historyToggle\.style\.height = `\$\{Math\.ceil\(historyContent\.getBoundingClientRect\(\)\.height\)\}px`/);
assert.match(app, /desktopHistoryResizeObserver = new ResizeObserver\(syncHistoryToggleHeight\)/);
assert.match(styles, /V4\.38 measured history toggle and inherited angle for drawn cards/);
assert.match(styles, /\.court > \.log\s*\{\s*align-items: start;/);

assert.match(app, /function desktopHandAngleForIndex\(index\)/);
assert.match(app, /const precedingCard = player\.hand\[player\.hand\.length - 1\]/);
assert.match(app, /card\.desktopHandAngle = precedingCard\?\.desktopHandAngle[\s\S]*?desktopHandAngleForIndex\(player\.hand\.length - 1\)/);
assert.match(app, /style="--local-card-angle: \$\{escapeHtml\(card\.desktopHandAngle\)\}"/);

console.log("Version 4.38 : languette historique synchronisée et angle de pioche hérité : OK");
