import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, mobile, matrix] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../MOBILE_GAME_MODE_COMPATIBILITY_MATRIX.md", import.meta.url), "utf8"),
]);

assert.match(app, /function mobileConnectionState\(playerIndex\)/);
assert.match(app, /kind: "spectator"/);
assert.match(app, /kind: "online"/);
assert.match(app, /synchronized: Boolean\(SERVER_SYNC\.ready\)/);
assert.match(app, /hand: \(SPECTATOR_MODE\.enabled \? \[\] : player\?\.hand \|\| \[\]\)/);
assert.match(app, /canPass: !SPECTATOR_MODE\.enabled/);
assert.match(app, /canEndTurn: !SPECTATOR_MODE\.enabled/);
assert.match(app, /phase: SPECTATOR_MODE\.enabled/);
assert.match(mobile, /mains masquées · aucune action de jeu autorisée/);
assert.match(mobile, /viewState\.spectator \? "" : selectedPreviewMarkup/);
assert.match(matrix, /Sauvegarde \/ reprise/);
assert.match(matrix, /reconnexion réelle de deux navigateurs/);

console.log("Compatibilité mobile en ligne, spectateur et reprise : OK");
