import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, mobile, css] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

for (const command of ["nextSoloExchange", "nextSetExchange", "nextFullSet", "startMatchMode"]) {
  assert.match(app, new RegExp(`\\b${command}\\(`));
}
assert.match(app, /function mobileResultState\(playerIndex\)/);
assert.match(app, /state\.setMatch\.matchOver \? "Match terminé" : state\.setMatch\.setOver \? "Set terminé" : "Échange terminé"/);
assert.match(app, /resultArtwork: MATCH_RESULT_IMAGES\[matchPlayer\?\.characterId\]\?\.\[won \? "win" : "lose"\]/);
assert.match(app, /name: displayPlayerName\(matchPlayer\)/);
assert.match(app, /matchOver: Boolean\(state\.setMatch\.matchOver\)/);
assert.match(app, /sets: mobileSetScoreState\(playerIndex\)\.filter/);
assert.match(app, /players: \[presentationPlayer\(playerIndex\), presentationPlayer\(opponentIndex\)\]/);
assert.match(app, /function mobileProgressionActions\(\)/);
assert.match(app, /renderProgressionButtons\(\)/);
assert.match(app, /function runMobileProgressionAction\(actionId\)/);
assert.match(mobile, /class="mobile-match-result/);
assert.match(mobile, /class="mobile-match-finale/);
assert.match(mobile, /mobile-match-finale-lobby/);
assert.match(mobile, /mobile-match-finale-outcome/);
assert.match(mobile, /Math\.round\(\(\(index \+ 1\) \/ setCount\) \* 2000\)/);
assert.match(mobile, /matchEndPresentation\.finalState = true/);
assert.match(mobile, /data-mobile-progression=/);
assert.match(mobile, /runProgressionAction\(button\.dataset\.mobileProgression\)/);
assert.match(css, /\.mobile-match-finale\s*\{[\s\S]*position:\s*fixed[\s\S]*z-index:\s*690/);
assert.match(css, /\.mobile-match-finale--resolved \.mobile-match-finale-outcome\s*\{[\s\S]*opacity:\s*1/);
assert.match(css, /\.mobile-match-finale-set--player\s*\{[\s\S]*var\(--mobile-player-color\)/);
assert.match(css, /\.mobile-match-finale-set--opponent\s*\{[\s\S]*var\(--mobile-opponent-color\)/);
assert.doesNotMatch(css, /\.mobile-match-finale-player\s*\{[^}]*animation:/);
assert.doesNotMatch(mobile, /<b>\$\{escapeText\(player\.outcome\)\}<\/b>/);
assert.match(css, /body\.mobile-game-view \.event-confirm-backdrop\s*\{[\s\S]*z-index:\s*730/);

console.log("Compatibilité mobile IA, set, match et progression : OK");
