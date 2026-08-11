import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const index = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");

assert.equal(packageJson.version, "6.9.0");
assert.match(index, /Tennis Courts Academy · <span>V6\.9<\/span>/);
assert.match(index, /styles\.css\?v=6\.9\.0/);
assert.match(index, /mobile-game\.css\?v=6\.9\.0/);
assert.match(index, /app\.js\?v=6\.9\.0/);
assert.match(index, /mobile-game\.js\?v=6\.9\.0/);

// The sanctuarized mode keeps its own version and assets unchanged.
assert.match(index, /Tennis Courts Ultimate<\/strong><small>V5\.35/);
assert.match(index, /ultimate-card-data\.js\?v=5\.35\.0/);

// Tutorials stay in the codebase for later rework but cannot be opened or started.
assert.match(index, /id="openTutorialModulesButton"[^>]*disabled[^>]*aria-disabled="true"/);
assert.doesNotMatch(index, /id="openTutorialModulesButton"[^>]*data-open-tutorial-modules/);
assert.match(app, /const TUTORIALS_ENABLED = false;/);
assert.match(app, /function startTutorial\(moduleId = "basics"\) \{\s+if \(!TUTORIALS_ENABLED\) return;/);

// Academy gets V4.56's separate desktop action trays.
assert.match(app, /character-portrait-stage/);
assert.match(app, /desktop-profile-actions--\$\{actionRole\}/);
assert.match(app, /ULTIMATE_MODE\.active \? `<div class="turn-buttons">/);
assert.match(styles, /character-zone:not\(\.ultimate-character-zone\) \.desktop-profile-actions/);
assert.match(styles, /desktop-profile-actions--local/);
assert.match(styles, /desktop-profile-actions--opponent/);
assert.match(styles, /max-height: 700px/);

// Service Coup droit has two families in Academy only.
assert.match(app, /if \(!ULTIMATE_MODE\.active && card\.id === "service-coup-droit"\) families\.push\("Coup droit", "Service"\)/);
assert.match(app, /cardHasAnyFamily\(card, \["Coup droit", "Revers"\]\)/);
assert.match(app, /cardHasAnyFamily\(card, player\.limitedFamilies\)/);
assert.match(app, /cardHasFamily\(previousShot, bonus\.afterFamily\)/);

// A canonical URL never uses the remembered match as an automatic fallback.
assert.match(app, /function restoreLocalMobileMatchSession\(matchId = localMobileMatchId\(\)\)/);
assert.doesNotMatch(app, /const matchId = localMobileMatchId\(\) \|\| rememberedActiveLocalMatchId\(\)/);
assert.match(app, /if \(!explicitLocalMatchId\) \{[\s\S]*showMenuScreen\(\);[\s\S]*refreshLocalMatchResumePrompt\(\)/);
assert.match(index, /id="localMatchResumePrompt"/);
assert.match(index, /id="resumeLocalMatchButton"[^>]*>Reprendre la partie<\/button>/);
assert.match(index, /id="discardLocalMatchButton"[^>]*>Abandonner la sauvegarde<\/button>/);
assert.match(app, /resumeLocalMatchButton\?\.addEventListener\("click", resumeRememberedLocalMatch\)/);
assert.match(app, /discardLocalMatchButton\?\.addEventListener\("click", discardRememberedLocalMatch\)/);

// Online and Circuit Pro are disabled without blending into the lobby background.
assert.match(app, /if \(section\.matches\("button, select"\)\) section\.disabled = !hasProAccess/);
assert.match(app, /section\.setAttribute\("aria-disabled", String\(!hasProAccess\)\)/);
assert.match(styles, /\.lobby-mode-card\.locked \{[\s\S]*?opacity: 1;[\s\S]*?grayscale\(1\)/);
assert.match(styles, /\.lobby-mode-card\.locked::after \{\s*content: none/);

console.log("V6.3 lobby resume and Academy integration checks passed.");
