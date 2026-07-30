import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.8.0");
assert.match(html, /styles\.css\?v=4\.8\.0/);
assert.match(html, /app\.js\?v=4\.8\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.8<\/span>/);

assert.doesNotMatch(html, /id="gamePreviewToggle"/);
assert.doesNotMatch(html, /Prévisualiser les conséquences/);
assert.match(html, /id="gameInformationToggle"/);
assert.doesNotMatch(app, /GAMEPLAY_ASSIST\.preview/);
assert.match(app, /if \(!GAMEPLAY_ASSIST\.information\) return ""/);
assert.match(app, /showPlacementWarning = GAMEPLAY_ASSIST\.information/);
assert.match(app, /card-assist-icon--power/);
assert.match(app, /card-assist-icon--endurance/);
assert.match(app, /<small>BOOST<\/small>/);

assert.match(app, /PROFILE_CHARACTER_IMAGES\[player\.characterId\]/);
assert.match(app, /class="desktop-player-identity/);
assert.match(app, /class="desktop-player-bonus-count"/);
assert.match(app, /function openDesktopBonusDialog\(playerIndex\)/);
assert.match(app, /class="desktop-bonus-dialog"/);
assert.match(css, /\.desktop-player-bonus-count/);
assert.match(css, /\.desktop-bonus-dialog/);

assert.match(app, /class="boost-sacrifice-layer desktop-boost-underlay"/);
assert.match(app, /class="desktop-remise-underlay"/);
assert.match(app, /placementRemisesForShot\(playedCards, playerOrder\)/);
assert.match(css, /\.desktop-played-card > img:not\([\s\S]*?z-index:\s*4/);
assert.match(css, /\.desktop-remise-underlay > span[\s\S]*?border:\s*2px solid #f1cf55/);

assert.match(css, /\.desktop-match-score\s*\{\s*top:\s*64px/);
assert.match(css, /\.hand::before\s*\{\s*content:\s*none;\s*display:\s*none/);
assert.match(css, /\.desktop-played-row\s*\{\s*height:\s*112%/);
assert.match(app, /pass-button--winning/);
assert.match(app, /passProjection\?\.winner === "PLAYER"/);
assert.match(css, /\.pass-button--winning[\s\S]*?#197d68[\s\S]*?#126452/);
assert.match(css, /\.pass-button--losing[\s\S]*?#a94d3c[\s\S]*?#813528/);
assert.match(css, /\.court::before,[\s\S]*?\.net-line\s*\{\s*display:\s*none/);

console.log("Version 4.8 : informations unifiées, profils verticaux, bonus et empilements de cartes : OK");
