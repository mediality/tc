import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.7<\/span>/);
assert.match(app, /function restoreUltimateCardPrintedState\(card\)/);
assert.match(app, /window\.ULTIMATE_CARD_DATA[\s\S]*shotNumber - 1/);
assert.match(app, /player\.reserve\.push\(reserveCard\)/);
assert.match(app, /player\.hand\.push\(\.\.\.\(player\.reserve \|\| \[\]\)\.map\(restoreUltimateCardPrintedState\)\)/);
assert.match(app, /const rulesCard = restoreUltimateCardPrintedState\(card\)/);
assert.match(app, /function prepareSoloUltimateReserveFallback\(playerIndex\)/);
assert.match(app, /prepareSoloUltimateReserveFallback\(playerIndex\);/);
assert.match(app, /ai_reserve_fallback_prepared/);

console.log("V5.34 reserve printed-state and AI fallback checks passed.");
