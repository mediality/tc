import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.71.0");
assert.match(app, /const GAME_VERSION = "v3\.71"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.71<\/span>/);

assert.match(
  app,
  /data-return-club-house>RETOURNER AU CLUB HOUSE/,
  "un match en ligne terminé doit proposer uniquement le retour au Club House",
);
assert.match(
  app,
  /if \(state\.tournament\?\.friendly\) return false;/,
  "le résumé local ne doit jamais piloter une compétition en ligne",
);
assert.match(
  server,
  /\/clubhouse-return/,
  "le serveur doit recevoir explicitement le retour d’un joueur au Club House",
);
assert.match(
  server,
  /simulateFriendlyAiOnlyMatches\(tournament\);\s+revealAllFriendlyAiSets\(tournament, tournament\.round\);/,
  "les matchs IA doivent être simulés lors du retour au Club House",
);
assert.match(
  server,
  /friendlyOnePointFormat\(tournament\) && !friendlyMasterControl\(tournament\)\.launched/,
  "les deux compétitions 1 Point doivent attendre le lancement depuis le Club House",
);
assert.match(
  server,
  /function noteFriendlyHumanSetProgress[\s\S]*if \(friendlyOnePointFormat\(tournament\)\) return false;/,
  "la diffusion d’un score ne doit jamais simuler une rencontre IA en mode 1 Point",
);
assert.doesNotMatch(
  app,
  /SIMULER LES MATCHS IA/,
  "aucune simulation IA ne doit être proposée depuis le flux de match",
);

console.log("v3.71 online One Point Club House checks passed");
