import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, mobile, matrix] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../MOBILE_GAME_MODE_COMPATIBILITY_MATRIX.md", import.meta.url), "utf8"),
]);

assert.match(matrix, /Entraînement \/ tutoriel/);
assert.match(app, /function mobileTutorialState\(\)/);
assert.match(app, /tutorialStep\(\)/);
assert.match(app, /tutorialActionLabel\(step\.action\)/);
assert.match(app, /function continueMobileTutorial\(\)/);
assert.match(app, /if \(step\.final\) finishTutorial\(\)/);
assert.match(app, /tutorialAllowsPlay\(playerIndex, card, mode, candidate\.mode === "boost"\)/);
assert.match(mobile, /class="mobile-tutorial"/);
assert.match(mobile, /data-mobile-tutorial-next/);
assert.match(mobile, /tennisLightMobileAdapter\?\.continueTutorial\(\)/);

console.log("Compatibilité mobile entraînement et tutoriel : OK");
