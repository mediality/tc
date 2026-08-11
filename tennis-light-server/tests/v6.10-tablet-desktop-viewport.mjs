import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mobile = readFileSync(new URL("../public/mobile-game.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "6.10.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.10<\/span>/);
assert.match(html, /app\.js\?v=6\.10\.0/);
assert.match(mobile, /function shouldUseVirtualDesktopViewport\(\)/);
assert.match(mobile, /window\.screen\?\.width/);
assert.match(mobile, /screenWidth <= MOBILE_MAX_WIDTH && hasTouchCapability\(\) && hasMobilePlatformSignal\(\)/);
assert.match(
  mobile,
  /admin-forced-desktop-view"\) && shouldUseVirtualDesktopViewport\(\)[\s\S]*?desktopMatchViewportContent[\s\S]*?: mobileViewportContent/,
);
assert.match(mobile, /forceDesktop && matchWasVisible && shouldUseVirtualDesktopViewport\(\)/);

console.log("V6.10 native tablet desktop viewport checks passed.");
