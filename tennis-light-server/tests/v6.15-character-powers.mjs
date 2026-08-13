import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v6\.15"/);
assert.match(app, /type: "exchangeAllShotsPowerBonus"/);
assert.match(app, /pendingRecoverPlayedChoice/);
assert.doesNotMatch(app, /player\.power = Math\.max\(0, player\.power - Number\(target\.cardPowerGained/);
assert.match(app, /effect\.type === "opponentExchangePlacementPenalty"/);
assert.match(app, /Math\.max\(0, basePlacement .*exchangePlacementPenalty/s);
assert.match(app, /effect\.type === "suppressOpponentBonuses"/);
assert.match(app, /effect\.type === "exchangeHighPowerDiscount"/);
assert.match(app, /effectiveCost\(player, card, boosted\)/);
assert.match(app, /effect\.type === "exchangeHighPowerEndurance"/);
assert.match(app, /récupère .* endurance grâce à Mikolas/);
assert.match(app, /const ULTIMATE_STARTING_ENERGY = 3/);

console.log("V6.15 character powers checks passed.");
