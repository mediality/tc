import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");

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

const confrontationIntroSource = functionSource("showConfrontationIntro");
assert.match(confrontationIntroSource, /const sequenceDuration = 3_000/);
assert.match(confrontationIntroSource, /Date\.now\(\) \+ 5_000/);
assert.match(confrontationIntroSource, /data-start-confrontation/);
assert.match(confrontationIntroSource, /data-confrontation-countdown-shell/);
assert.doesNotMatch(confrontationIntroSource, /currentOpponentConfrontationStatus/);
assert.match(app, /function confrontationEventTypeLabel\(\)/);
assert.match(css, /\.confrontation-sequence-item\.revealed/);
assert.match(css, /\.confrontation-countdown-shell\.revealed/);

assert.match(app, /state\.tournament\?\.humanNickname\s+\|\| AUTH_STATE\.user\?\.nickname/);
assert.match(app, /createPlayer\(characterNameFromId\(humanCharacterId\), humanCharacterId, state\.tournament\?\.humanNickname \|\| nicknameValue\(\)\)/);
assert.match(app, /async function saveProfileCharacter\(\)[\s\S]*?showProfileScreen\(\)/);
assert.match(html, /id="backToLobbyFromCharacterButton"/);
assert.match(app, /backToLobbyFromCharacterButton\?\.addEventListener\("click", showMenuScreen\)/);

assert.match(css, /\.opponent-hand-reveal-controls/);
assert.match(app, /CLUB HOUSE/);

assert.match(html, /id="adminSimulateScoreButton"/);
assert.match(html, /id="adminGameTools"[^>]*data-required-role="admin"/);
assert.match(html, /id="adminGameToolsPanel"/);
assert.match(html, /id="exportLogsButton"/);
assert.match(html, /id="exportHumanMatchesButton"/);
assert.match(html, /id="revealAiButton"/);
assert.match(app, /adminSimulateScoreButton\?\.addEventListener\("click", \(\) => runAdminGameTool\(simulateAdminMatchScore\)\)/);
assert.match(functionSource("exportLogsFile"), /if \(!canAccessAdminFeatures\(\)\) return/);
assert.match(app, /async function exportHumanMatchLogsFile\(\) \{\s*if \(!canAccessAdminFeatures\(\)\) return/);
assert.match(functionSource("toggleRevealAiCards"), /if \(!canAccessAdminFeatures\(\)\) return/);
assert.match(css, /\.admin-simulate-score-button/);
assert.match(css, /\.admin-game-tools-panel/);

assert.match(html, /État de l’échange/);
assert.match(html, /id="rallyFullLogButton"/);
assert.match(app, /rallyFullLogButton\?\.addEventListener\("click", openFullActionLogDialog\)/);
assert.match(app, /function renderActionLogEntry\(line, index, compact = false\)/);
assert.match(app, /function openFullActionLogDialog\(\)/);
assert.match(app, /rally-info-grid/);
assert.match(app, /rally-result-grid/);
assert.match(app, /function renderCompactMatchScore\(setMatch\)/);
assert.match(functionSource("renderResultPanel"), /classList\.add\("hidden"\)/);
assert.doesNotMatch(functionSource("renderResultPanel"), /result-banner-heading|result-outcome-badge/);
assert.match(functionSource("rallyEndConditionLabel"), /"BOOST"/);
assert.match(functionSource("rallyEndConditionLabel"), /"EFFET"/);
assert.doesNotMatch(functionSource("renderResultPanel"), /Score du set/);
assert.match(functionSource("renderLeagueStandingsTable"), /<span>Rang<\/span><span>Nom<\/span><span>Points<\/span><span>Diff\. sets<\/span><span>Diff\. jeux<\/span>/);
assert.match(app, /tournament-match-status/);
assert.match(app, /character-hand-reminder/);
assert.match(app, /opponentHandCount <= 2 \? "critical-opponent"/);
assert.match(app, /function renderTournamentChampion\(champion, final\)/);
assert.match(app, /MATCH_RESULT_IMAGES\[characterId\]\?\.win/);
assert.match(app, /function renderTournamentSetScores\(scoreText, isLive = false, winnerSide = null\)/);
assert.match(functionSource("renderTournamentMatch"), /const isLive = !match\.winner/);
assert.doesNotMatch(functionSource("renderTournamentMatch"), /À déterminer|Qualifié à déterminer/);
assert.match(functionSource("refreshWeeklyTournamentDerivedSlots"), /r16_1\?\.winner \|\| r16_2\?\.winner/);
assert.match(functionSource("refreshWeeklyTournamentDerivedSlots"), /semi1\?\.winner \|\| semi2\?\.winner/);
assert.match(server, /if \(final && semi1\?\.winner\) final\.playerA = semi1\.winner/);
assert.match(server, /if \(semi1 && qf1\?\.winner\) semi1\.playerA = qf1\.winner/);
assert.match(css, /\.action-log-dialog/);
assert.match(css, /\.result-power-score/);
assert.match(css, /\.outcome-boost \.result-outcome-badge/);
assert.match(css, /\.outcome-power \.result-outcome-badge/);
assert.match(css, /\.character-hand-reminder/);
assert.match(css, /\.hand-cards-icon/);
assert.match(css, /\.tournament-match-status\.live::before/);
assert.match(css, /tournament-live-pulse/);
assert.match(css, /\.tournament-champion-portrait/);
assert.match(css, /\.tournament-set-scores span\.winner-set/);
assert.match(css, /\.opponent-inline\.critical-opponent/);
assert.match(css, /\.confrontation-player-card-frame::after/);
assert.match(css, /--game-card-radius: 7\.2% \/ 5\.2%/);

assert.match(html, /Tennis Courts Academy · 2\.169\.18/);
assert.match(html, /styles\.css\?v=170\.14/);
assert.match(html, /app\.js\?v=170\.14/);

const profileSource = functionSource("profileMarkup");
assert.match(profileSource, /<dd>\$\{Number\(ranking\.score_ref \|\| 0\)\}<\/dd><small>4 semaines terminées<\/small>/);
assert.match(profileSource, /ranking\.projected_rank/);
assert.match(profileSource, /const tournamentWins = palmaresResults\.filter/);
assert.match(profileSource, /const lostFinals = palmaresResults\.filter/);
assert.match(profileSource, /index >= 10 \? " profile-collapsible-item hidden"/);
assert.match(profileSource, /data-profile-toggle="career"/);
assert.match(profileSource, /const sortedAiResults = \[\.\.\.aiResults\]\.sort/);
assert.match(profileSource, /index >= 5 \? " profile-collapsible-item hidden"/);
assert.match(profileSource, /data-profile-toggle="rivalries"/);
assert.match(profileSource, /const currentCalendar = calendar\.filter/);
assert.match(profileSource, /const remainingCalendar = calendar[\s\S]*?\.sort\(\(a, b\) => Number\(a\.week \|\| 0\) - Number\(b\.week \|\| 0\)/);
assert.match(profileSource, /data-profile-toggle="calendar"/);
assert.doesNotMatch(profileSource, /<span>0[1-6]<\/span>/);
assert.match(app, /function toggleProfileCollection\(event\)/);
assert.match(app, /querySelectorAll\("\[data-profile-toggle\]"\)/);
assert.match(css, /\.profile-identity-hero \{[\s\S]*?gap: 16px;[\s\S]*?background: transparent;/);
assert.match(css, /\.profile-identity-portrait \{[\s\S]*?border-radius: 18px/);
assert.match(css, /\.profile-identity-info \{[\s\S]*?border-radius: 18px/);
assert.match(css, /\.academy-copy-grid > \.academy-copy-card \+ \.academy-copy-card \{ padding-left: 26px; \}/);

const competitionsSource = functionSource("renderCompetitions");
assert.match(competitionsSource, /performance\?\.lastOpponent/);
assert.match(competitionsSource, /performance\?\.lastScore/);
assert.match(competitionsSource, /N’A PAS ENCORE PARTICIPÉ/);
assert.match(competitionsSource, /circuit-performance-line/);
assert.match(server, /SELECT competition_id, achievement, points, last_opponent, last_score/);
assert.match(server, /lastOpponent: row\.last_opponent \|\| ""/);
assert.match(server, /lastScore: row\.last_score \|\| ""/);

const resultPanelSource = functionSource("renderResultPanel");
assert.match(resultPanelSource, /classList\.add\("hidden"\)/);
assert.doesNotMatch(resultPanelSource, /result-bonus-list/);
assert.doesNotMatch(functionSource("renderCompactMatchScore"), />Score du match</);
assert.match(functionSource("renderCompactMatchScore"), /won-left/);
assert.match(functionSource("renderCompactMatchScore"), /won-right/);

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
  randomMatchSetScoresForWinner: () => [[6, 1], [6, 4]],
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
assert.equal(JSON.stringify(simulationContext.state.setMatch.completedScores), JSON.stringify([[6, 1], [6, 4]]));
assert.equal(simulationContext.recordedAction.kind, "exchange_end");
assert.equal(simulationContext.recordedAction.payload.winType, "admin-simulation");
assert.equal(simulationContext.completed, true);
assert.equal(simulationContext.markedDirty, true);
assert.equal(simulationContext.rendered, true);

console.log("v143 effets joueurs et interfaces: OK");
