import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.72.0");
assert.match(app, /const GAME_VERSION = "v3\.72"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.72<\/span>/);
assert.match(
  app,
  /FRIENDLY_TOURNAMENT\.awaitingClubHouseReturn \|\| \(state\.gameOver && state\.setMatch\.matchOver\)/,
  "le bouton Club House doit rester visible après une fin distante",
);
assert.match(
  server,
  /if \(delegate\) return new Set\(\[delegate\.id\]\)/,
  "le joueur qualifié délégué doit être le seul à récupérer les commandes",
);
assert.doesNotMatch(
  server,
  /control\.launchAt = Date\.now\(\) \+ 10000/,
  "les compétitions 1 Point ne doivent plus utiliser dix secondes",
);
assert.equal((server.match(/control\.launchAt = Date\.now\(\) \+ 5000/g) || []).length, 2);
assert.match(app, /MATCH SUIVANT · 5 S/);
assert.match(app, /function showFriendlyDrawAnimation/);
assert.match(app, /window\.setInterval\(reveal, 1000\)/);
assert.match(app, /settingsLocked \? "" : `<section class="clubhouse-format-section/);
assert.match(app, /settingsLocked \? "" : `<section class="friendly-settings-panel/);
assert.match(app, /settingsLocked \? "" : `<section class="friendly-visibility-section/);

console.log("v3.72 online Club House flow checks passed");
