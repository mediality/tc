import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /function initializeSoloAiExchangeStrategy\(playerIndex\)/);
assert.match(app, /function chooseSoloAttitude\(playerIndex, reason/);
assert.match(app, /aggressive: 3, prudent: 3, opportunistic: 4/);
assert.match(app, /amateur: \[5, 7\]/);
assert.match(app, /normal: \[4, 6\]/);
assert.match(app, /legend: \[1, 3\]/);
assert.match(app, /amateur: 0\.18,[\s\S]*?normal: 0\.35,[\s\S]*?expert: 0\.52,[\s\S]*?champion: 0\.68,[\s\S]*?legend: 0\.82/);
assert.match(app, /function buildSoloScenarioPlan\(playerIndex\)/);
assert.match(app, /points: \{/);
assert.match(app, /boost: \{/);
assert.match(app, /if \(completed\.length >= 3\) break/);
assert.match(app, /function chooseSoloPunitiveContinuation\(playerIndex, plan\)/);
assert.match(app, /amateur: 0\.08,[\s\S]*?normal: 0\.2,[\s\S]*?expert: 0\.55,[\s\S]*?champion: 0\.82,[\s\S]*?legend: 1/);
assert.match(app, /opponent\.hand\.length === 1/);
assert.match(app, /function soloDoubleProjection\(playerIndex, card\)/);
assert.match(app, /duplicatedPower \* 5/);
assert.match(app, /projection négative sans défense/);
assert.match(app, /if \(!state\.mandatoryPlacement\) return null;/);
assert.match(app, /aiPunitiveContinuations/);

assert.match(app, /data-image-zoom/);
assert.match(app, /profile-character-visuals/);
assert.match(app, /remise-forbid-overlay/);
assert.match(css, /\.played-visual\.history-card:hover/);
assert.match(css, /transform: scale\(5\.4\)/);
assert.match(css, /\.image-zoom-figure/);

console.log("v143 stratégies IA et affichages: OK");
