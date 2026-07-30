import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const mobile = fs.readFileSync(path.join(root, "public", "mobile-game.js"), "utf8");
const css = fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");

assert.equal(packageJson.version, "4.4.0");
assert.match(html, /styles\.css\?v=4\.4\.0/);
assert.match(html, /app\.js\?v=4\.4\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.4<\/span>/);

assert.match(html, /id="desktopMatchScore"/);
assert.doesNotMatch(html, /id="rallyState"/);
assert.doesNotMatch(html, /État de l’échange/);
assert.match(html, /<section id="player2Panel"[\s\S]*<div id="log"/);

assert.match(app, /function renderDesktopMatchScore\(\)/);
assert.match(app, /mobileSetScoreState\(mobileLocalPlayerIndex\(\)\)/);
assert.match(app, /desktop-set-score--player/);
assert.match(app, /desktop-set-score--opponent/);
assert.match(app, /function syncDesktopStarReveal\(card\)/);
assert.match(app, /}, 2000\);/);
assert.match(app, /desktop-played-star-power--\$\{side\}/);
assert.match(app, /const history = mobileHistoryEntries\(\)/);

assert.match(mobile, /const matchWasVisible = Boolean/);
assert.match(mobile, /if \(matchWasVisible\) \{\s*applySelectedView\(\)/);
assert.match(mobile, /desktopApp\?\.classList\.add\("hidden"\)/);

assert.match(css, /Desktop board v4\.4/);
assert.match(css, /\.desktop-match-score-list/);
assert.match(css, /\.court > \.log/);
assert.match(css, /\.desktop-history-latest--player/);
assert.match(css, /\.desktop-history-latest--opponent/);
assert.match(css, /\.desktop-played-star-power--rose/);

console.log("Version 4.4 : score mobile, historique compact, carte centrale et révélation étoile temporisée : OK");
