import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const mobile = await readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8");

assert.match(app, /function mobileCardPlayOptions\(playerIndex, card\)/);
assert.match(app, /canPlayEffectMode\(playerIndex, card\) \? option\("effect"/);
assert.match(app, /canPlayNormal\(playerIndex, card\) \? option\("placement"/);
assert.match(app, /canPlayBoost\(playerIndex, card\) \? option\("boost"/);
assert.match(app, /playCard\(playerIndex, card\.uid, boosted, sacrificeUid, mode\)/);
assert.match(app, /function passMobileTurn\(\)/);
assert.match(app, /function endMobileTurn\(\)/);
assert.match(app, /passTurn: passMobileTurn/);
assert.match(app, /endTurn: endMobileTurn/);

assert.match(mobile, /data-mobile-play-mode=/);
assert.match(mobile, /data-mobile-boost-sacrifice=/);
assert.match(mobile, /data-mobile-pass/);
assert.match(mobile, /data-mobile-end-turn/);
assert.match(mobile, /Choisissez un mode de jeu/);
assert.match(mobile, /class="mobile-power-bolt"[^>]*>⚡</);
assert.doesNotMatch(mobile, />VS</);

assert.match(css, /--mobile-player-color:/);
assert.match(css, /--mobile-opponent-color:/);
assert.match(css, /\.mobile-player--player[\s\S]*border-left/);
assert.match(css, /\.mobile-player--opponent[\s\S]*border-left/);
assert.match(css, /\.mobile-power--winner-player/);
assert.match(css, /\.mobile-power--winner-opponent/);

console.log("Mobile turn choices, Boost, Remise/Effect, Pass and colors are wired.");
