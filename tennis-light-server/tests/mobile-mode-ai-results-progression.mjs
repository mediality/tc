import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, mobile] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
]);

for (const command of ["nextSoloExchange", "nextSetExchange", "nextFullSet", "startMatchMode"]) {
  assert.match(app, new RegExp(`\\b${command}\\(`));
}
assert.match(app, /function mobileResultState\(playerIndex\)/);
assert.match(app, /state\.setMatch\.matchOver \? "Match terminé" : state\.setMatch\.setOver \? "Set terminé" : "Échange terminé"/);
assert.match(app, /function mobileProgressionActions\(\)/);
assert.match(app, /renderProgressionButtons\(\)/);
assert.match(app, /function runMobileProgressionAction\(actionId\)/);
assert.match(mobile, /class="mobile-match-result/);
assert.match(mobile, /data-mobile-progression=/);
assert.match(mobile, /runProgressionAction\(button\.dataset\.mobileProgression\)/);

console.log("Compatibilité mobile IA, set, match et progression : OK");
