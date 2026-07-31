import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.18.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.18<\/span>/);

assert.match(app, /data-quit-solo-court>Quitter le court/);
assert.match(app, /data-quit-solo-court\]"\)\?\.addEventListener\("click", confirmReturnToLobby\)/);
assert.match(app, /actions\.push\(\{ id: "quit-court", label: "Quitter le court" \}\)/);

assert.match(css, /--choice-card-width: clamp\(96px, 8\.4vw, 148px\)/);
assert.match(css, /grid-template-columns: repeat\(auto-fit, var\(--choice-card-width\)\)/);
assert.match(css, /width: var\(--choice-card-width\);[\s\S]*?max-width: var\(--choice-card-width\)/);

assert.match(app, /desktop-live-power-score--\$\{constraintTone\}/);
assert.match(app, /desktop-score-avatar--\$\{side\}/);
assert.match(app, /mobile-server desktop-score-server/);
assert.match(app, /desktop-score-turn-dot--player\$\{state\.activePlayer === localIndex/);
assert.match(app, /desktop-score-turn-dot--opponent\$\{state\.activePlayer === opponentIndex/);
assert.match(css, /desktop-live-power-score--boost[\s\S]*?background: #f1cf55/);
assert.match(css, /desktop-live-power-score i[\s\S]*?power-flash\.svg/);
assert.match(css, /desktop-score-avatar > img[\s\S]*?object-position: center 18%/);
assert.match(css, /desktop-score-turn-dot[\s\S]*?opacity: 0/);
assert.match(css, /desktop-score-turn-dot\.is-active[\s\S]*?opacity: 1/);

console.log("Version 4.14 : sortie solo, choix fixes et score de puissance central : OK");
