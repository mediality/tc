import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, mobileApp, mobileStyles] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

assert.match(app, /function mobileCardUnavailableReason\(playerIndex, card\)/);
assert.match(app, /function mobileCardPreview\(playerIndex, card\)/);
assert.match(app, /realCost = effectiveCost\(player, card\)/);
assert.match(app, /realPower: stats\.power/);
assert.match(app, /resultingPlacement = totalTurnPlacement\(playerIndex, card, false\)/);
assert.match(app, /function selectMobileCard\(cardUid\)/);
assert.match(app, /function cancelMobileCardSelection\(\)/);
assert.match(app, /function playSelectedMobileCard\(intent = \{\}\)/);
assert.match(app, /if \(mobilePlaySubmissionLocked \|\| !mobileSelectedCardUid\) return false/);
assert.match(app, /playCard\(playerIndex, card\.uid, boosted, sacrificeUid, mode\)/);
assert.match(app, /playCard[\s\S]*?const cost = effectiveCost\(player, card\)[\s\S]*?player\.endurance -= cost/);
assert.match(app, /selectCard: selectMobileCard/);
assert.match(app, /cancelCardSelection: cancelMobileCardSelection/);
assert.match(app, /playSelectedCard: playSelectedMobileCard/);

assert.match(mobileApp, /data-mobile-card=/);
assert.match(mobileApp, /data-mobile-cancel/);
assert.match(mobileApp, /data-mobile-action-mode=/);
assert.match(mobileApp, /data-mobile-action-mode="\$\{option\.mode\}"/);
assert.match(mobileApp, /window\.tennisLightMobileAdapter\?\.selectCard\(card\.id\)/);
assert.match(mobileApp, /window\.tennisLightMobileAdapter\?\.cancelCardSelection\(\)/);
assert.match(mobileApp, /window\.tennisLightMobileAdapter\?\.playSelectedCard\(\{/);
assert.doesNotMatch(mobileApp, /Comment jouer cette carte/);
assert.match(mobileApp, /if \(!card\.playable\)[\s\S]*showUnavailableExplanation\(card, button\)/);
assert.doesNotMatch(mobileApp, /effectiveCost|getCardStats|totalTurnPlacement|canPlayNormal/);

assert.match(mobileStyles, /\.mobile-hand-card--locked img\s*\{[\s\S]*filter: grayscale\(1\)/);
assert.match(mobileStyles, /\.mobile-hand-card--selected\s*\{[\s\S]*translateY\(-6px\) scale\(1\.035\)/);
assert.match(mobileStyles, /\.mobile-card-actions button,[\s\S]*min-height: 48px/);
assert.match(mobileStyles, /\.mobile-card-explanation\s*\{[\s\S]*position: fixed/);
assert.doesNotMatch(mobileStyles, /\.game-app\s/);

console.log("Sélection, inspection, annulation et validation mobile : OK");
