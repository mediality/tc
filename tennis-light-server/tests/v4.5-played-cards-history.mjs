import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");
const mobile = fs.readFileSync(path.join(root, "public", "mobile-game.js"), "utf8");

const [major, minor] = packageJson.version.split(".").map(Number);
assert.ok(major > 4 || (major === 4 && minor >= 5));
assert.match(html, /styles\.css\?v=4\.(?:[5-9]|[1-9]\d)\.\d+/);
assert.match(html, /app\.js\?v=4\.(?:[5-9]|[1-9]\d)\.\d+/);
assert.match(html, /Tennis Courts Academy · <span>v4\.(?:[5-9]|[1-9]\d)<\/span>/);
assert.match(html, /mobile-game\.js\?v=4\.(?:[2-9]|[1-9]\d)\.\d+/);

assert.match(app, /function desktopPlayedRowMarkup\(playerIndex, role\)/);
assert.match(app, /desktopPlayedRowMarkup\(opponentIndex, "opponent"\)/);
assert.match(app, /desktopPlayedRowMarkup\(localPlayerIndex, "player"\)/);
assert.match(app, /data-desktop-played-scroll="-1"/);
assert.match(app, /viewport\.scroll(?:By|To)\(/);
assert.match(app, /function openDesktopPlayedCardDetail\(card\)/);
assert.match(app, /function renderDesktopHistoryEntry\(entry, index\)/);
assert.match(app, /const history = mobileHistoryEntries\(\)/);

assert.match(css, /Desktop board v4\.5/);
assert.match(css, /grid-auto-columns: 96px/);
assert.match(css, /\.desktop-played-row--opponent/);
assert.match(css, /\.desktop-played-row--player/);
assert.match(css, /\.desktop-played-scroll/);
assert.match(css, /\.desktop-played-card-backdrop/);
assert.match(css, /\.desktop-card-detail-panel/);
assert.match(css, /\.desktop-history-entry--player/);
assert.match(css, /\.desktop-history-entry--opponent/);
assert.match(css, /\.boost-choice-backdrop \.modal/);
assert.match(css, /\[data-desktop-role="local"\] \.player-header,[\s\S]*\[data-desktop-role="opponent"\] \.player-header[\s\S]*grid-row: 1 \/ -1/);

assert.doesNotMatch(mobile, /desktop-played-row|desktop-card-detail-panel/);

console.log("Version 4.5 : cartes jouées défilantes, détail sombre, historique mobile et panneaux symétriques : OK");
