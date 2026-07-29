import assert from "node:assert/strict";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

assert.equal(pkg.version, "3.78.0");
assert.match(app, /const GAME_VERSION = "v3\.78"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.78<\/span>/);

assert.match(app, /function installBrowserNavigation\(\)/);
assert.match(app, /window\.history\.pushState\(/);
assert.match(app, /window\.addEventListener\("popstate"/);
assert.match(app, /window\.addEventListener\("beforeunload"/);
assert.match(app, /confirmBrowserMatchExit/);
assert.match(app, /tennisLightDestination/);

assert.match(app, /function localMatchViewIsActive\(\)/);
assert.match(app, /LOCAL_ACTIVE_MATCH_STORAGE_KEY/);
assert.match(app, /localMobileMatchId\(\) \|\| rememberedActiveLocalMatchId\(\)/);
assert.match(app, /document\.visibilityState === "hidden"/);
assert.doesNotMatch(app, /LOCAL_MOBILE_MATCH_EXIT_GRACE_MS/);
assert.match(app, /record\.expiresAt = state\.gameOver \? record\.expiresAt : null/);
assert.match(app, /restoreLocalMobileMatchSession\(\);\s*installBrowserNavigation\(\);/);

console.log("v3.78 mobile reload and match resume checks passed");
