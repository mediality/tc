import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = app.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(app, /function startOpponentHandReveal\(viewerIndex, opponentIndex\)/);
assert.match(app, /expiresAt: Date\.now\(\) \+ 10_000/);
assert.match(app, /Terminer la visualisation · \$\{remaining\} s/);
assert.match(app, /cardUids: opponent\.hand\.map\(\(card\) => card\.uid\)/);
assert.match(app, /if \(localHumanControlsPlayer\(playerIndex\)\) startOpponentHandReveal/);
assert.match(app, /state\.effectNotice = null/);
assert.match(app, /knownOpponentCards: expertKnownOpponentCards\(playerIndex\)\.map\(cardLogInfo\)/);
assert.match(app, /const temporarilyRevealed = isOpponentHandTemporarilyRevealed\(playerIndex\)/);

assert.match(app, /function showConfrontationIntro\(\)/);
assert.match(app, /Date\.now\(\) \+ 5_000/);
assert.match(app, /const image = PROFILE_CHARACTER_IMAGES\[player\?\.characterId\]/);
assert.match(app, /const participantName = isHuman[\s\S]*?player\?\.nickname/);
assert.match(app, /state\.tournament\.competitionCity/);
assert.match(app, /state\.tournament\.competitionFlag/);
assert.match(app, /currentOpponentConfrontationStatus\(\)/);
assert.match(app, /queueConfrontationIntro\(\)/);
assert.match(css, /\.confrontation-intro-backdrop/);
assert.match(css, /background: rgba\(0, 0, 0, 0\.5\)/);

assert.match(app, /state\.tournament\?\.humanNickname\s+\|\| AUTH_STATE\.user\?\.nickname/);
assert.match(app, /createPlayer\(characterNameFromId\(humanCharacterId\), humanCharacterId, state\.tournament\?\.humanNickname \|\| nicknameValue\(\)\)/);
assert.match(app, /async function saveProfileCharacter\(\)[\s\S]*?showProfileScreen\(\)/);
assert.match(html, /id="backToLobbyFromCharacterButton"/);
assert.match(app, /backToLobbyFromCharacterButton\?\.addEventListener\("click", showMenuScreen\)/);

assert.match(css, /\.opponent-hand-reveal-controls/);
assert.match(html, />CLUB HOUSE<\/button>/);

assert.match(html, /id="adminSimulateScoreButton"/);
assert.match(app, /adminSimulateScoreButton\?\.addEventListener\("click", simulateAdminMatchScore\)/);
assert.match(css, /\.admin-simulate-score-button/);

const simulationContext = {
  SERVER_SYNC: { enabled: false, isHost: false, seat: null },
  SPECTATOR_MODE: { enabled: false },
  state: {
    gameOver: false,
    activePlayer: 1,
    players: [
      { nickname: "Admin", power: 18, endurance: 4 },
      { nickname: "IA", power: 20, endurance: 3 },
    ],
    setMatch: {
      enabled: true,
      targetSets: 2,
      score: [2, 3],
      completedScores: [],
      decisiveExchange: false,
      setOver: false,
      winner: null,
      setsWon: [0, 0],
      matchOver: false,
      matchWinner: null,
    },
    log: [],
    resultInfo: null,
  },
  canAccessAdminFeatures: () => true,
  displayPlayerName: (player) => player.nickname,
  playerName: (index) => simulationContext.state.players[index].nickname,
  formatSetScores: (scores) => scores.map((score) => score.join("/")).join(" - "),
  stopSoloTimers: () => {},
  updateTournamentSetProgress: () => { simulationContext.progressUpdates += 1; },
  recordAction: (kind, payload) => { simulationContext.recordedAction = { kind, payload }; },
  playerLogInfo: (player) => ({ nickname: player.nickname }),
  storeMatchLog: () => { simulationContext.stored = true; },
  handleTournamentMatchComplete: () => { simulationContext.completed = true; },
  markServerDirtyForHostAction: () => { simulationContext.markedDirty = true; },
  render: () => { simulationContext.rendered = true; },
  progressUpdates: 0,
};
vm.runInNewContext(`${functionSource("canAdminSimulateMatchScore")}; ${functionSource("adminSimulatedSetScores")}; ${functionSource("simulateAdminMatchScore")}; simulateAdminMatchScore();`, simulationContext);
assert.equal(simulationContext.state.gameOver, true);
assert.equal(simulationContext.state.setMatch.matchOver, true);
assert.deepEqual(Array.from(simulationContext.state.setMatch.setsWon), [2, 0]);
assert.equal(JSON.stringify(simulationContext.state.setMatch.completedScores), JSON.stringify([[6, 2], [6, 3]]));
assert.equal(simulationContext.recordedAction.kind, "exchange_end");
assert.equal(simulationContext.recordedAction.payload.winType, "admin-simulation");
assert.equal(simulationContext.completed, true);
assert.equal(simulationContext.markedDirty, true);
assert.equal(simulationContext.rendered, true);

console.log("v141 effets joueurs et interfaces: OK");
