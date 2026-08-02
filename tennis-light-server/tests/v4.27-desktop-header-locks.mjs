import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.32.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.32<\/span>/);
assert.match(html, /id="desktopGameMenuToggle"/);
assert.doesNotMatch(html, /id="gameProfileButton"/);
assert.match(app, /const desktopCardLocked = playerIndex === state\.activePlayer/);
assert.match(app, /desktop-hand-card--locked/);
assert.match(app, /desktop-card-lock/);
assert.match(app, /desktop-game-menu-open/);
assert.match(styles, /desktop-hand-card--locked[\s\S]*grayscale\(1\)/);
assert.match(styles, /grid-template-rows: 48px minmax\(0, 1fr\) !important/);
assert.match(styles, /font-size: clamp\(\.42rem, \.48vw, \.52rem\) !important/);

console.log("Version 4.27 : cartes verrouillées et barre desktop compacte : OK");
