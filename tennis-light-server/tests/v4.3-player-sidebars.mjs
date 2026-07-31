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
assert.ok(major > 4 || (major === 4 && minor >= 3));
assert.match(html, /styles\.css\?v=4\.(?:[3-9]|[1-9]\d)\.\d+/);
assert.match(html, /app\.js\?v=4\.(?:[3-9]|[1-9]\d)\.\d+/);
assert.match(html, /Tennis Courts Academy · <span>v4\.(?:[3-9]|[1-9]\d)<\/span>/);
assert.match(app, /class="desktop-player-(?:bonuses|bonus-count)"/);
assert.match(app, /const showPassButton = playerIndex === state\.activePlayer/);
assert.match(app, /showPassButton \? `<button class="pass-button/);
assert.match(css, /Desktop player sidebars v4\.3/);
assert.match(css, /--desktop-player-color: #8ce0bf/);
assert.match(css, /--desktop-player-color: #f2a37f/);
assert.match(css, /border-radius: 50%/);
assert.match(css, /\.desktop-player-(?:bonuses|bonus-count)/);

console.log("Version 4.3 : bandeaux latéraux, compteurs ronds, bonus et bouton Passer contextuel : OK");
