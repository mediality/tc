import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.7.0");
assert.match(html, /styles\.css\?v=4\.7\.0/);
assert.match(html, /app\.js\?v=4\.7\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.7<\/span>/);

assert.match(css, /player-panel\[data-desktop-role="local"\]\s*\{\s*z-index:\s*24/);
assert.match(css, /player-panel\[data-desktop-role="local"\] \.hand\s*\{\s*z-index:\s*90/);
assert.match(css, /--desktop-played-step:\s*calc\(\(var\(--desktop-played-card-width\) \/ 2\)/);
assert.match(css, /\.desktop-played-slot\s*\{[\s\S]*?flex-basis:\s*var\(--desktop-played-step\)/);

const rowMarkupStart = app.indexOf("function desktopPlayedRowMarkup(");
const rowMarkupEnd = app.indexOf("\nfunction desktopPlayedCardByKey(", rowMarkupStart);
const rowMarkup = app.slice(rowMarkupStart, rowMarkupEnd);
assert.doesNotMatch(rowMarkup, /data-desktop-played-scroll/);

const centerStart = app.indexOf("function renderCenterPlayedCard(");
const centerEnd = app.indexOf("\nfunction activeEffectBadges(", centerStart);
const centerMarkup = app.slice(centerStart, centerEnd);
assert.equal((centerMarkup.match(/data-desktop-played-scroll/g) || []).length, 2);
assert.doesNotMatch(centerMarkup, /center-progression-actions/);

assert.match(app, /let desktopPlayedBoardScroll = 0/);
assert.match(app, /function updateDesktopPlayedBoardControls\(\)/);
assert.match(app, /viewports\.forEach\(\(otherViewport\)/);
assert.match(app, /desktop-history-progression-actions/);
assert.match(app, /bindRallyEndActions\(els\.log\)/);

console.log("Version 4.7 : main au premier plan, demi-carte, actions historiques et défilement commun : OK");
