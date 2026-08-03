import assert from "node:assert/strict";
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const indexHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const mobileGame = fs.readFileSync(new URL("../public/mobile-game.js", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.50.0");
assert.match(indexHtml, /styles\.css\?v=4\.50\.0/);
assert.match(indexHtml, /mobile-game\.css\?v=4\.50\.0/);
assert.match(indexHtml, /id="onlineForfeitButton"[\s\S]*?>Forfait<\/button>/);
assert.match(indexHtml, /Tennis Courts Academy · <span>v4\.50<\/span>/);

assert.match(styles, /V4\.50 online match menu/);
assert.match(styles, /\.game-app\.desktop-game-menu-open \.top-actions \{[\s\S]*?display: flex !important;[\s\S]*?pointer-events: auto;/);
assert.match(app, /function openOnlineForfeitDialog\(\)/);
assert.match(app, /Décision irréversible/);
assert.match(app, /forfait pour toute la compétition/);
assert.match(app, /\/api\/friendly-tournaments\/\$\{encodeURIComponent\(FRIENDLY_TOURNAMENT\.id\)\}\/forfeit/);
assert.match(app, /\/api\/rooms\/\$\{encodeURIComponent\(SERVER_SYNC\.roomId\)\}\/forfeit/);
assert.match(app, /state\.resultInfo\?\.kind === "forfeit"[\s\S]*?"Victoire par forfait"/);
assert.match(app, /openForfeitDialog: openOnlineForfeitDialog/);
assert.match(mobileGame, /data-mobile-forfeit>Déclarer forfait/);

assert.match(server, /function roomForfeitState\(room, forfeitingSeat\)/);
assert.match(server, /completedScores: Array\.from\(\{ length: targetSets \}, \(\) => \[\.\.\.setScore\]\)/);
assert.match(server, /const roomForfeitMatch = url\.pathname\.match\(\/\^\\\/api\\\/rooms/);
assert.match(server, /const friendlyForfeitMatch = url\.pathname\.match\(\/\^\\\/api\\\/friendly-tournaments/);
assert.match(server, /forfeitFriendlyMatchAfterDisconnect\(tournament, currentMatch, participant\)/);
assert.match(server, /resolveFriendlyDepartedForfeits\(tournament\);[\s\S]*?refreshFriendlyTournamentSlots\(tournament\);/);

const roomHelperSource = server.slice(
  server.indexOf("function roomForfeitState("),
  server.indexOf("\nfunction liveScoreFromState", server.indexOf("function roomForfeitState(")),
);
const roomForfeitState = new Function(
  "cloneFriendlyMatchState",
  `${roomHelperSource}; return roomForfeitState;`,
)((value) => value == null ? null : JSON.parse(JSON.stringify(value)));
const baseRoom = {
  targetSets: 2,
  players: [{ nickname: "Alice" }, { nickname: "Bob" }],
  state: { players: [{ nickname: "Alice" }, { nickname: "Bob" }], setMatch: { enabled: true } },
};
const playerAForfeit = roomForfeitState(baseRoom, 0);
assert.equal(playerAForfeit.setMatch.matchWinner, 1);
assert.deepEqual(playerAForfeit.setMatch.completedScores, [[0, 6], [0, 6]]);
assert.equal(playerAForfeit.resultInfo.reason, "FORFAIT");
const playerBForfeit = roomForfeitState({ ...baseRoom, targetSets: 3 }, 1);
assert.equal(playerBForfeit.setMatch.matchWinner, 0);
assert.deepEqual(playerBForfeit.setMatch.completedScores, [[6, 0], [6, 0], [6, 0]]);

console.log("V4.50 online menu and explicit forfeit checks passed.");
