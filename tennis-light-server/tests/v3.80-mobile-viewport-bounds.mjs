import assert from "node:assert/strict";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const mobileStyles = fs.readFileSync(new URL("../public/mobile-game.css", import.meta.url), "utf8");

assert.equal(pkg.version, "3.80.0");
assert.match(app, /const GAME_VERSION = "v3\.80"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.80<\/span>/);

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

assert.match(styles, /\.menu-screen \{\s*width: calc\(100% - 20px\)/);
assert.match(styles, /\.lobby-mode-grid \{[\s\S]*?padding-inline: 3px/);
assert.match(styles, /\.lobby-mode-card > \.lobby-mode-art \{[\s\S]*?inset: 5px/);
assert.match(mobileStyles, /width: min\(100%, 100dvw\)/);

console.log("v3.80 mobile viewport bounds checks passed");
