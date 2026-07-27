import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.75.0");
assert.match(app, /const GAME_VERSION = "v3\.75"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.75<\/span>/);
assert.match(
  server,
  /masterControl && match\.round === tournament\.round && !masterControl\.launched \? null : match\.winner/,
  "aucun vainqueur du tour ne doit être exposé avant son lancement",
);
assert.match(
  server,
  /const completedCurrentMatch = \(tournament\.matches \|\| \[\]\)\.find/,
  "le retour doit être rattaché à un match humain terminé du tour courant",
);
assert.match(
  server,
  /if \(completedCurrentMatch\) \{\s*simulateFriendlyAiOnlyMatches\(tournament\);\s*revealAllFriendlyAiSets\(tournament, tournament\.round\);/,
  "la simulation IA ne doit commencer qu’au retour d’un humain ayant terminé",
);
assert.match(server, /Les rencontres IA de la journée sont simulées au retour du premier joueur humain/);
assert.match(
  app,
  /if \(state\.tournament\.onePointMaster\) \{\s*renderChampionshipPanel/,
  "le Master en ligne doit utiliser le panneau Master filtré",
);
assert.match(app, /currentContent = `\s*<div class="league-standings-grid championship-groups">/);
assert.doesNotMatch(app, /friendly-master-watch-button/);
assert.match(app, /class="small-button friendly-watch-button"[^>]*>VOIR<\/button>/);

console.log("v3.75 Master current round and simulation checks passed");
