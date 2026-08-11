import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.9<\/span>/);
assert.match(app, /conti:\s*\{\s*stars: \[5, 6, 9, 12, 13, 17, 25, 28\]/);
assert.match(app, /brentwood:\s*\{\s*stars: \[5, 8, 16, 17, 18, 20, 33, 36\]/);
assert.match(app, /card\.star = printedRules\.stars\.includes\(printedNumber\)/);
assert.match(app, /ultimateBoostOnPlacementMiss = printedRules\.miss\.includes\(printedNumber\)/);
assert.match(app, /ultimateBoostColors = \[\.\.\.\(printedRules\.boostColors\[printedNumber\] \|\| \[\]\)\]/);
assert.match(app, /state\.lastCard\.ultimateColor[\s\S]*card\.ultimateBoostColors\?\.includes\(state\.lastCard\.ultimateColor\)/);
assert.match(app, /placementMissBoost = state\.boostAvailableFor === playerIndex[\s\S]*card\.ultimateBoostOnPlacementMiss === true/);
assert.match(app, /printedAlternateServiceCondition = ULTIMATE_MODE\.active && \(placementMissBoost \|\| colorBoost\)/);
assert.match(app, /!openingServiceBoost && !printedAlternateServiceCondition\) return false/);
assert.match(app, /const consumesFreeBoost = endsTurn && player\.freeBoostNext/);
assert.match(app, /recordAction\("ultimate_character_star_activated"/);
assert.match(app, /ULTIMATE_MATCH_HISTORY_STORAGE_KEY/);
assert.match(app, /ultimateMatches\.flatMap\(\(match\) => match\.entries \|\| \[\]\)/);
assert.doesNotMatch(app, /ULTIMATE_MATCH_HISTORY_STORAGE_KEY[\s\S]{0,300}\.slice\(/);
assert.match(app, /function resumeUltimateAiAfterDialogs/);
assert.match(app, /function runSoloAITurn\(\)[\s\S]*ultimateBlockingDialogOpen\(\)[\s\S]*resumeUltimateAiAfterDialogs\(\)/);
assert.match(app, /function forceSoloAITurn\(\)[\s\S]*ultimateBlockingDialogOpen\(\)[\s\S]*resumeUltimateAiAfterDialogs\(\)/);

console.log("V5.27 Ultimate stars, printed BOOST conditions, one-turn free BOOST and log history checks passed.");
