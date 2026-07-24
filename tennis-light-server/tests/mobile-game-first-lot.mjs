import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, mobileApp, mobileStyles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

assert.match(html, /<main id="mobileGameApp" class="mobile-game-app hidden"/);
assert.match(html, /mobile-game\.css\?v=3\.8\.3/);
assert.match(html, /mobile-game\.js\?v=3\.8\.3/);
assert.match(html, /<main class="app game-app hidden">/);

assert.match(app, /window\.tennisLightMobileAdapter = \{\s*getViewState: getMobileMatchViewState/);
assert.match(app, /window\.TennisLightMobileGame\?\.selectViewForMatch\(\)/);
assert.match(app, /window\.dispatchEvent\(new CustomEvent\("tennis-light:match-render"\)\)/);
assert.match(app, /function mobileSetScoreState\(playerIndex\)/);
assert.match(app, /function mobilePlayerSummary\(playerIndex\)/);

assert.match(mobileApp, /const MOBILE_MAX_WIDTH = 600/);
assert.match(mobileApp, /navigator\.maxTouchPoints/);
assert.match(mobileApp, /Math\.min\(window\.innerWidth, window\.innerHeight\) <= MOBILE_MAX_WIDTH/);
assert.match(mobileApp, /mobileGamePreview/);
assert.match(mobileApp, /let matchUsesMobileView = false/);
assert.match(mobileApp, /window\.addEventListener\("orientationchange", scheduleMobileRender\)/);
assert.doesNotMatch(mobileApp, /window\.addEventListener\("orientationchange", selectViewForMatch\)/);
assert.match(mobileApp, /Touchez pour inspecter/);
assert.doesNotMatch(mobileApp, /(?:^|[^.])\b(?:playCard|endTurn)\(/);

assert.match(mobileStyles, /body\.mobile-game-view \.mobile-game-app/);
assert.match(mobileStyles, /\.mobile-card-hand\s*\{[\s\S]*overflow-x: auto/);
assert.match(mobileStyles, /@media \(orientation: landscape\) and \(max-height: 600px\)/);
assert.match(mobileStyles, /env\(safe-area-inset-top\)/);
assert.match(mobileStyles, /@media \(prefers-reduced-motion: reduce\)/);
assert.doesNotMatch(mobileStyles, /\.game-app\s/);

console.log("Premier lot de l’interface mobile isolée : OK");
