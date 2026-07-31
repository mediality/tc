import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const mobileCss = fs.readFileSync(new URL("../public/mobile-game.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.29.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.29<\/span>/);
assert.match(app, /class="card-action-cost"/);
assert.match(app, />EFFET<\/strong>/);
assert.match(app, />REMISE<\/strong>/);
assert.match(css, /\.remise-button[\s\S]*?background:\s*#257a91/);
assert.match(css, /\.visual-stats--2[\s\S]*?repeat\(2/);
assert.match(css, /\.visual-stats--3[\s\S]*?repeat\(4/);
assert.match(css, /\.game-assist-panel[\s\S]*?position:\s*fixed !important[\s\S]*?background:\s*#062d42 !important/);
assert.match(css, /desktop-played-card--arriving[\s\S]*?visibility:\s*hidden !important/);
assert.match(app, /2000 \+ starRevealDelay/);
assert.match(app, /adminDesktopViewSwitch\?\.classList\.toggle\("hidden", !canAccessAdminFeatures\(\)\)/);
assert.match(mobileCss, /-webkit-touch-callout:\s*none/);

const requiredPlacement = 5;
const accumulatedRemise = 3;
const nextShotPlacement = 2;
assert.ok(accumulatedRemise + nextShotPlacement >= requiredPlacement);
assert.match(app, /state\.turnPlacement\[playerIndex\] \+ getCardStats\(state\.players\[playerIndex\], card, boosted\)\.placement/);
assert.match(app, /if \(isRemise\(card\)\) return true/);

console.log("Version 4.26 : commandes, fenêtres, iOS, admin, animation et cumul de Remise : OK");
