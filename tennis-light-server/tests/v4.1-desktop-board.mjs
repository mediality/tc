import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public", "app.js"), "utf8");
const desktopCss = fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");

assert.equal(packageJson.version, "4.1.0");
assert.match(html, /styles\.css\?v=4\.1\.0/);
assert.match(html, /app\.js\?v=4\.1\.0/);
assert.match(html, /mobile-game\.css\?v=3\.86\.0/);
assert.match(html, /mobile-game\.js\?v=3\.86\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.1<\/span>/);

assert.match(app, /root\.dataset\.desktopRole = playerIndex === localPlayerIndex \? "local" : "opponent"/);
assert.match(desktopCss, /\/\* Desktop match board v4\.1/);
assert.match(desktopCss, /@media \(min-width: 861px\)/);
assert.match(desktopCss, /body:not\(\.mobile-game-view\) \.game-app/);
assert.match(desktopCss, /height: 100dvh/);
assert.match(desktopCss, /overflow: hidden/);
assert.match(desktopCss, /\[data-desktop-role="local"\] \.hand/);
assert.match(desktopCss, /\[data-desktop-role="opponent"\] \.hand/);
assert.match(desktopCss, /transform: translateY\(-28%\) scale\(1\.38\)/);
assert.match(desktopCss, /@media \(min-width: 861px\) and \(max-height: 760px\)/);

console.log("Version 4.1 : plateau desktop isolé, plein écran et rôles local/adversaire : OK");
