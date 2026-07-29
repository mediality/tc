import assert from "node:assert/strict";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

assert.equal(pkg.version, "3.79.0");
assert.match(app, /const GAME_VERSION = "v3\.79"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.79<\/span>/);

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
assert.match(app, /LOCAL_MATCH_DATABASE_NAME/);
assert.match(app, /window\.indexedDB\.open/);
assert.match(app, /restoreLocalMatchSessionFromDatabase/);
assert.match(app, /typeof crypto\?\.randomUUID === "function"/);
assert.doesNotMatch(app, /LOCAL_MOBILE_MATCH_EXIT_GRACE_MS/);
assert.match(app, /record\.expiresAt = state\.gameOver \? record\.expiresAt : null/);
assert.match(app, /const localMatchRestoredSynchronously = restoreLocalMobileMatchSession\(\)/);

console.log("v3.79 Safari mobile match resume checks passed");
