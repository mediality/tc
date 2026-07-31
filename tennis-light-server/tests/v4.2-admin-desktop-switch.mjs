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

const [major, minor] = packageJson.version.split(".").map(Number);
assert.ok(major > 4 || (major === 4 && minor >= 2));
assert.match(html, /styles\.css\?v=4\.(?:[2-9]|[1-9]\d)\.\d+/);
assert.match(html, /app\.js\?v=4\.(?:[2-9]|[1-9]\d)\.\d+/);
assert.match(html, /mobile-game\.js\?v=4\.(?:[2-9]|[1-9]\d)\.\d+/);
assert.match(html, /id="adminDesktopViewSwitch"/);
assert.match(html, /data-required-role="admin"/);
assert.match(html, /Tennis Courts Academy · <span>v4\.(?:[2-9]|[1-9]\d)<\/span>/);

assert.match(app, /tennisLightAdminDesktopView/);
assert.match(app, /if \(!canAccessAdminFeatures\(\)\) return/);
assert.match(app, /setForcedDesktopView\(forced\)/);
assert.match(mobile, /admin-forced-desktop-view/);
assert.match(mobile, /function setForcedDesktopView\(forceDesktop\)/);
assert.match(mobile, /width=1440, initial-scale=0\.25/);
assert.match(mobile, /: mobileViewportContent/);
assert.match(mobile, /matchUsesMobileView = !forceDesktop && isSmartphonePortrait\(\)/);
assert.match(css, /Admin mobile\/desktop switch v4\.2/);
assert.match(css, /\.admin-desktop-view-switch:not\(\.hidden\)/);
assert.match(css, /\.admin-forced-desktop-view \.admin-desktop-view-switch:not\(\.hidden\)/);

console.log("Version 4.2 : switch ADMIN mobile/desktop persistant et protégé : OK");
