import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, mobile, css] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

assert.match(html, /viewport-fit=cover/);
assert.match(html, /meta name="theme-color" content="#062b3d"/);
assert.match(mobile, /Math\.min\(window\.innerWidth, window\.innerHeight\) <= MOBILE_MAX_WIDTH/);
assert.match(mobile, /class="mobile-portrait-lock" role="status"/);
assert.match(mobile, /aria-live="assertive" aria-atomic="true"/);
assert.match(mobile, /gain de.*perte de/s);
assert.match(mobile, /class="mobile-skip-link"/);
assert.match(mobile, /loading="lazy" decoding="async"/);
assert.match(mobile, /function scheduleMobileRender\(\)/);
assert.match(mobile, /window\.requestAnimationFrame/);
assert.match(mobile, /window\.addEventListener\("resize", scheduleMobileRender\)/);
assert.match(mobile, /event\.key === "Escape" && explanation/);
assert.match(mobile, /event\.key === "Escape" && opponentZoom/);
assert.match(mobile, /set remporté par vous/);
assert.match(mobile, /set remporté par l’adversaire/);

assert.match(css, /env\(safe-area-inset-left\)/);
assert.match(css, /env\(safe-area-inset-right\)/);
assert.match(css, /overflow-x: clip/);
assert.match(css, /min-width: 44px;\s*min-height: 44px/s);
assert.match(css, /:focus-visible/);
assert.match(css, /\.mobile-value-delta--loss[\s\S]*background:\s*#a83445/);
assert.match(css, /\.mobile-player--player[\s\S]*padding-bottom:\s*52px/);
assert.match(css, /\.mobile-player-copy strong,[\s\S]*overflow-wrap:\s*anywhere/);
assert.match(css, /touch-action: manipulation/);
assert.match(css, /content-visibility: auto/);
assert.match(css, /contain: layout paint/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /animation-iteration-count: 1 !important/);
assert.match(css, /@media \(orientation: landscape\) and \(max-height: 600px\)/);

console.log("Finition mobile : zones sûres, accessibilité, orientation et performances : OK");
