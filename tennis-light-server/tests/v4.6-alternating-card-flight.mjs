import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");

const [major, minor] = packageJson.version.split(".").map(Number);
assert.ok(major > 4 || (major === 4 && minor >= 6));
assert.match(html, /styles\.css\?v=4\.[6-9]\.\d+/);
assert.match(html, /app\.js\?v=4\.[6-9]\.\d+/);
assert.match(html, /Tennis Courts Academy · <span>v4\.[6-9]<\/span>/);
assert.doesNotMatch(html, /id="gameContextStrip"/);

assert.match(app, /desktopPlayOrder: nextDesktopPlayOrder\(\)/);
assert.match(app, /function desktopPlayedSequence\(\)/);
assert.match(app, /desktop-played-slot--empty/);
assert.match(app, /function captureDesktopCardFlight\(playerIndex, card\)/);
assert.match(app, /function runDesktopCardFlightAnimation\(\)/);
assert.match(app, /duration: 720/);
assert.match(app, /data-hand-card-uid/);
assert.match(app, /data-desktop-played-target/);

assert.match(css, /Desktop board v4\.6/);
assert.match(css, /justify-content: flex-start/);
assert.match(css, /\.desktop-played-slot--empty/);
assert.match(css, /\.desktop-card-flight/);
assert.match(css, /\.desktop-played-card--arriving/);
assert.match(css, /\.hand::before/);
assert.match(css, /\.court > \.log[\s\S]*width: min\(390px, 31vw\)/);
assert.match(css, /\[data-desktop-role="local"\] \.player-header,[\s\S]*grid-row: 2 \/ 4/);
assert.match(css, /\[data-desktop-role="opponent"\] \.player-header,[\s\S]*grid-row: 1 \/ 3/);

console.log("Version 4.6 : alternance chronologique, départ à gauche, vol de carte et hiérarchie desktop : OK");
