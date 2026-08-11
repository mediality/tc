import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mobile = readFileSync(new URL("../public/mobile-game.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.9<\/span>/);
assert.match(html, /styles\.css\?v=6\.9\.0/);
assert.match(html, /mobile-game\.js\?v=6\.9\.0/);

assert.match(
  mobile,
  /const desktopMatchViewportContent = "width=1440, initial-scale=0\.25, minimum-scale=0\.2, maximum-scale=1, viewport-fit=cover"/,
);
assert.match(
  mobile,
  /function selectViewForMatch\(\)[\s\S]*?document\.body\.classList\.contains\("admin-forced-desktop-view"\)[\s\S]*?desktopMatchViewportContent[\s\S]*?: mobileViewportContent/,
);
assert.match(
  mobile,
  /function setAdminViewPreference\(preference = "auto"\)[\s\S]*?forceDesktop && matchWasVisible[\s\S]*?desktopMatchViewportContent[\s\S]*?: mobileViewportContent/,
);
assert.match(
  mobile,
  /function clearSelectedView\(\)[\s\S]*?viewportMeta\?\.setAttribute\("content", mobileViewportContent\)/,
);

console.log("V6.9 iPad lobby viewport restoration checks passed.");
