import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.76.0");
assert.match(app, /const GAME_VERSION = "v3\.76"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.76<\/span>/);
assert.match(server, /function canonicalFriendlyHumanSyncState/);
assert.match(server, /nickname: expectedPlayers\[seat\]\?\.nickname \|\| "Joueur"/);
assert.equal((server.match(/canonicalFriendlyHumanSyncState\(tournament,/g) || []).length, 4);
assert.match(app, /startMatchMode\(SERVER_SYNC\.targetSets\);\s*applyOnlinePlayersFromRoom\(players\);/);
assert.match(app, /const canSimulateCurrentRound = format === "onepointmaster"/);
assert.match(server, /control\.launched = true;\s*control\.launchAt = null;\s*simulateFriendlyAiOnlyMatches/);
assert.match(app, /nextRound === "barrage" \? 2 : 3/);
assert.match(app, /friendlyMasterZoneMarkup\(2, "Tour 2 · Barrages"/);
assert.match(html, /id="onlineInfoScreen"/);
assert.match(html, /Les cinq modes de jeu en ligne/);
assert.doesNotMatch(
  html.match(/<section id="onlineInfoScreen"[\s\S]*?<section id="soloInfoScreen"/)?.[0] || "",
  /<strong>Championnat<\/strong>/,
);
assert.match(html, /entre deux et quatre participants humains/i);

console.log("v3.76 identities, barrages and online info checks passed");
