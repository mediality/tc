import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v6\.18"/);
for (const type of ["nextShotsPowerBonus", "gainEnduranceAndRecoverPlayed", "nextBoostAnyShot", "exchangeShotDiscount"]) {
  assert.match(app, new RegExp(`if \\(effect\\.type === "${type}"\\)`), `${type} doit être géré par le moteur Academy`);
}
assert.match(app, /multiShotPowerBonus/);
assert.match(app, /exchangeShotDiscount \?\? 0/);
assert.match(html, /gameDesktopEffectsToggle/);
assert.match(app, /GAMEPLAY_ASSIST\.desktopEffects/);
assert.match(css, /character-zone:not\(\.ultimate-character-zone\) \.academy-desktop-effects/);
assert.match(css, /V6\.14 · Academy desktop only/);
assert.match(server, /function advanceFriendlyAiLiveScores/);
assert.match(server, /match\.liveScore = `\$\{completed\.length/);
assert.match(server, /advanceFriendlyAiLiveScores\(tournament\)/);
assert.match(html, /Tennis Courts Academy · <span>V6\.18<\/span>/);

console.log("V6.14 Academy powers, viewer, desktop effects and online AI live scores: OK");
