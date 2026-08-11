import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

assert.match(app, /function requiredPlacementForLastCard/);
assert.match(app, /hasInstantPlacementThreat[\s\S]*ultimateRequiredPlacement/);
assert.match(app, /mandatoryPlacementReason = boosted \? "boost"[\s\S]*"lob"/);
assert.match(app, /combinedPlacement < requiredPlacementForLastCard\(\)/);
assert.match(app, /function ultimateBlockingDialogOpen/);
assert.match(app, /ultimateBlockingDialogOpen\(\)[\s\S]*resumeUltimateAiAfterDialogs\(\)/);
assert.match(app, /function clearUltimateExchangeEffects[\s\S]*power: 0/);
assert.match(app, /function clearUltimateExchangeEffects[\s\S]*nextDiscount: 0/);
assert.match(app, /function clearUltimateExchangeEffects[\s\S]*ultimateNextCostOne: false/);
assert.match(app, /clearUltimateExchangeEffects\(player\)/);
assert.match(app, /!canUseSeat\(0\) && !ULTIMATE_MODE\.serviceReveal/);
assert.doesNotMatch(app, />Détail de la carte</);
assert.match(app, />CONTINUER<\/button>/);
assert.match(app, /reserve\.length < 2 \|\| !candidates\.length/);
assert.match(app, /ultimate-reserve-hand-card[\s\S]*desktop-hand-card--locked/);
assert.match(app, /ULTIMATE_MODE\.active && playerIndex === mobileLocalPlayerIndex\(\)/);
assert.match(app, /if \(playerIndex !== mobileLocalPlayerIndex\(\)\) return/);
assert.match(app, /data-cancel-mark-choice/);
assert.match(app, /data-cancel-hand-discard/);
assert.match(app, /data-cancel-recovery/);
assert.match(app, /dialog-card-preview/);
assert.match(app, /contextmenu[\s\S]*preventDefault/);
assert.match(css, /-webkit-touch-callout: none/);
assert.match(html, /Cartes de la main en plein écran au clic/);
assert.match(html, /Tennis Courts Academy · <span>V6\.9<\/span>/);

console.log("V5.25 Ultimate rules, reset, dialogs and iOS protection checks passed.");
