import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const mobile = await readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8");

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

const boostedServiceEffectContext = vm.createContext({
  state: {
    gameOver: false,
    activePlayer: 1,
    mandatoryPlacement: true,
    mandatoryPlacementReason: "boost",
    players: [{}, { endurance: 5, limitedFamilies: null }],
  },
  isRemise: (card) => card.family === "Remise",
  canUseSeat: () => true,
  canAfford: () => true,
  satisfiesFamilyLimit: () => true,
});
vm.runInContext(functionSource(app, "canPlayEffectMode"), boostedServiceEffectContext);
assert.equal(
  vm.runInContext("canPlayEffectMode(1, { family: 'Remise', effectType: 'freeBoostNext' })", boostedServiceEffectContext),
  true,
  "Retour de service doit rester jouable en Effet après un service boosté",
);

assert.match(app, /function mobileCardPlayOptions\(playerIndex, card\)/);
assert.match(app, /canPlayEffectMode\(playerIndex, card\) \? option\("effect"/);
assert.match(app, /canPlayNormal\(playerIndex, card\) \? option\("placement"/);
assert.match(app, /canPlayBoost\(playerIndex, card\) \? option\("boost"/);
assert.match(app, /playCard\(playerIndex, card\.uid, boosted, sacrificeUid, mode\)/);
assert.match(app, /function passMobileTurn\(\)/);
assert.match(app, /function endMobileTurn\(\)/);
assert.match(app, /function mobilePassProjection\(playerIndex\)/);
assert.match(app, /function undoMobileTurn\(\)/);
assert.match(app, /passTurn: passMobileTurn/);
assert.match(app, /endTurn: endMobileTurn/);
assert.match(app, /undoTurn: undoMobileTurn/);

assert.match(mobile, /data-mobile-action-mode=/);
assert.match(mobile, /data-mobile-boost-sacrifice=/);
assert.match(mobile, /data-mobile-pass/);
assert.match(mobile, /data-mobile-end-turn/);
assert.match(mobile, /data-mobile-undo-turn/);
assert.match(mobile, /EFFET/);
assert.match(mobile, /REMISE/);
assert.match(mobile, /JOUER/);
assert.match(mobile, /BOOST/);
assert.doesNotMatch(mobile, /Comment jouer cette carte/);
assert.match(mobile, /class="mobile-power-bolt"[^>]*><\/i>/);
assert.doesNotMatch(mobile, />VS</);

assert.match(css, /--mobile-player-color:/);
assert.match(css, /--mobile-opponent-color:/);
assert.match(css, /\.mobile-player--player[\s\S]*border-left/);
assert.match(css, /\.mobile-player--opponent[\s\S]*border-left/);
assert.match(css, /\.mobile-power--winner-player/);
assert.match(css, /\.mobile-power--winner-opponent/);
assert.match(css, /mask:\s*url\("assets\/icons\/power-flash\.svg"\)/);

console.log("Mobile turn choices, Boost, Remise/Effect, Pass and colors are wired.");
