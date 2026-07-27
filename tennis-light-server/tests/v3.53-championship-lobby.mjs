import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const index = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v3\.58"/);
assert.match(index, /data-ai-club-value="championship"/);
assert.match(index, /<strong>Championnat<\/strong>/);
assert.match(app, /function startChampionshipMode\(/);
assert.match(app, /slice\(0, 23\)/, "Le Championnat doit tirer 23 IA");
assert.match(app, /const seeds = ranked\.slice\(0, 8\)/, "Les huit mieux classés doivent être têtes de série");
assert.match(app, /"ABCDEFGH"/, "Le premier tour doit comporter huit groupes");
assert.match(app, /champ_p1_\$\{group\}_d1.*A–C/s);
assert.match(app, /champ_p1_\$\{group\}_d2.*B–C/s);
assert.match(app, /champ_p1_\$\{group\}_d3.*A–B/s);
assert.match(app, /1: \[ranked\.A\[0\].*ranked\.B\[1\].*ranked\.C\[0\].*ranked\.D\[1\]/s);
assert.match(app, /2: \[ranked\.E\[0\].*ranked\.F\[1\].*ranked\.G\[0\].*ranked\.H\[1\]/s);
assert.match(app, /3: \[ranked\.B\[0\].*ranked\.A\[1\].*ranked\.D\[0\].*ranked\.C\[1\]/s);
assert.match(app, /4: \[ranked\.F\[0\].*ranked\.E\[1\].*ranked\.H\[0\].*ranked\.G\[1\]/s);
assert.match(app, /b\.points - a\.points[\s\S]*b\.setDifference - a\.setDifference[\s\S]*b\.gameDifference - a\.gameDifference[\s\S]*a\.worldRank - b\.worldRank/);
assert.match(app, /champ_playoff_1.*ranked\["1"\]\[1\].*ranked\["2"\]\[2\]/s);
assert.match(app, /champ_playoff_4.*ranked\["4"\]\[1\].*ranked\["1"\]\[2\]/s);
assert.match(app, /const pos1to4 = shuffle/);
assert.match(app, /const pos5to8 = shuffle/);
assert.match(app, /championshipOpenZone = next\.championshipPhase/);
assert.match(app, /function advanceChampionshipToNextHumanMatch/);
assert.match(app, /revealChampionshipDay\(nextAiMatch\.championshipPhase, nextAiMatch\.day\)/);
assert.match(app, /const next = advanceChampionshipToNextHumanMatch\(\)/);
assert.match(app, /class="championship-day-matches"/);
assert.match(app, /class="championship-playoffs"/);
assert.match(styles, /\.championship-zone-toggle/);
assert.match(styles, /\.championship-groups \{ grid-template-columns: repeat\(2/);
assert.match(styles, /\.championship-playoffs \{ display: grid; grid-template-columns: repeat\(4/);
assert.match(styles, /\.championship-lobby-content \.championship-board/);
assert.match(styles, /\.championship-lobby-content \.league-standings/);
assert.match(styles, /\.championship-lobby-content \.championship-day \{ grid-template-columns: 120px/);
assert.match(styles, /\.match-finale-overlay > nav \{[^}]*gap: 10px/);
assert.match(styles, /\.league-standings-row\.human-player[^}]*background: #fff8e5/);
assert.match(styles, /\.tournament-player-row\.winner[^}]*background: #eaf5f1/);
assert.match(index, /id="championshipLobbyScreen"/);
assert.match(index, /id="championshipLobbyContent"/);
assert.match(app, /function renderChampionshipLobby\(/);
assert.match(app, /function startChampionshipDraw\(/);
assert.match(app, /function renderChampionshipLobbyStandings\(/);
assert.match(app, /function renderChampionshipLobbyGroupPhase\(/);
assert.match(app, /function renderChampionshipLobbyFinal\(/);
assert.match(app, /championship-section-label">Groupes/);
assert.match(app, /championship-section-label">Calendrier/);
assert.match(app, /1er Tour · Groupes A à H/);
assert.match(app, /2e Tour · Groupes 1 à 4/);
assert.match(app, /3e Tour · Barrages/);
assert.match(app, /<span>Rang<\/span><span>Nom<\/span><span>Points<\/span><span>Diff\. sets<\/span><span>Diff\. jeux<\/span>/);
assert.match(app, /tournament-column-title">Quarts/);
assert.match(app, /tournament-column-title">Demi-finales/);
assert.match(app, /CHAMPIONSHIP_LOBBY_UI\.openZone = lobbyCurrentPhase/);
assert.match(app, /CHAMPIONSHIP_LOBBY_UI\.openZone === phase \? 0 : phase/);
assert.match(app, /championshipDrawVisibleCount \+= 1/);
assert.match(app, /}, 1000\)/);
assert.match(app, /function simulateChampionshipBatchAnimated\(/);
assert.match(app, /data-return-championship-lobby/);
assert.match(app, /function ensureTournamentMatchHasWinningSetCount\(/);

const clubLaunchStart = app.indexOf("async function startAiClubHouseCompetition(");
const clubLaunchEnd = app.indexOf("\nfunction configureSoloOpponent(", clubLaunchStart);
const clubLaunchSource = app.slice(clubLaunchStart, clubLaunchEnd);
assert.match(clubLaunchSource, /const selectedFormat = AI_CLUB_HOUSE\.format/);
assert.match(clubLaunchSource, /const isChampionship = selectedFormat === "championship"/);
assert.match(clubLaunchSource, /if \(isChampionship\) \{\s*showChampionshipLobbyScreen\(\);\s*render\(\);\s*return;/s);
assert.ok(
  clubLaunchSource.indexOf("showChampionshipLobbyScreen();") < clubLaunchSource.lastIndexOf("showGameScreen();"),
  "Le Championnat doit s'arrêter sur le salon avant le chemin normal vers le jeu",
);
const launchCalls = [];
const launchContext = {
  AI_CLUB_HOUSE: {
    format: "championship",
    targetSets: 2,
    difficulty: "expert",
    bonus: "none",
    players: "random",
    distribution: "random",
  },
  canAccessProFeatures: () => true,
  resetTutorialMode() {},
  MENU_STATE: {},
  showTournamentLoadingDialog: async () => {},
  hideTournamentLoadingDialog() {},
  ensureGameplayRanking: async () => {},
  ensureGameplayProfile: async () => {},
  startChampionshipMode: (...args) => launchCalls.push(["championship", ...args]),
  startLeagueTournamentMode: () => launchCalls.push(["league"]),
  startTournamentMode: () => launchCalls.push(["classic"]),
  resetTournament() {},
  configureSoloOpponent() {},
  SOLO_AI: {},
  startMatchMode: () => launchCalls.push(["match"]),
  showChampionshipLobbyScreen: () => launchCalls.push(["lobby"]),
  showGameScreen: () => launchCalls.push(["game"]),
  showMenuScreen() {},
  renderAuthState() {},
  render: () => launchCalls.push(["render"]),
  console,
  result: null,
};
vm.runInNewContext(`${clubLaunchSource}; result = startAiClubHouseCompetition();`, launchContext);
await launchContext.result;
assert.deepEqual(
  launchCalls.map(([name]) => name),
  ["championship", "lobby", "render"],
  "Lancer le Championnat doit ouvrir le salon sans jamais afficher l'interface de jeu",
);

const championshipStart = app.indexOf("function startChampionshipMode(");
const championshipStartEnd = app.indexOf("\nfunction championshipMatches(", championshipStart);
const championshipStartSource = app.slice(championshipStart, championshipStartEnd);
assert.match(championshipStartSource, /SOLO_AI\.enabled = false/);
assert.doesNotMatch(championshipStartSource, /startMatchMode\(/);

const prepareStart = app.indexOf("function prepareChampionshipHumanMatch(");
const prepareEnd = app.indexOf("\nfunction handleChampionshipMatchComplete(", prepareStart);
const prepareSource = app.slice(prepareStart, prepareEnd);
assert.match(prepareSource, /!state\.tournament\.championshipDrawComplete\) return/);
assert.match(prepareSource, /selectedOpponents\.includes\(opponent\)/);
assert.match(prepareSource, /SOLO_AI\.enabled = true[\s\S]*startMatchMode/);

const resumeStart = app.indexOf("function resumeAiClubHouseSave(");
const resumeEnd = app.indexOf("\nfunction deleteAiClubHouseSave(", resumeStart);
const resumeSource = app.slice(resumeStart, resumeEnd);
assert.match(resumeSource, /state\.tournament\?\.championship && !state\.tournament\.currentMatch/);
assert.match(resumeSource, /SOLO_AI\.enabled = false;\s*showChampionshipLobbyScreen\(\)/s);

const aiTurn = app.slice(app.indexOf("function runSoloAITurn"), app.indexOf("function chooseAmateurOption"));
assert.match(aiTurn, /soloSecuredPassDecision\(playerIndex, scenarioPlan\)/);
assert.doesNotMatch(aiTurn, /!legalInventory\.canProgress && canSoloPassAndWin/);
assert.match(app, /function soloSecuredPassDecision/);
assert.match(app, /le passage garantit le match/);
assert.match(app, /le passage garantit le set/);
assert.match(app, /préserver les ressources/);

const advanceStart = app.indexOf("function advanceChampionshipToNextHumanMatch(");
const advanceEnd = app.indexOf("\nfunction prepareChampionshipHumanMatch(", advanceStart);
const advanceSource = app.slice(advanceStart, advanceEnd);
const playoffMatches = Array.from({ length: 4 }, (_, index) => ({
  id: `playoff-${index + 1}`,
  championshipPhase: 3,
  day: 1,
  playerA: `ai-a-${index}`,
  playerB: `ai-b-${index}`,
  winner: null,
}));
const quarter = { id: "quarter-human", championshipPhase: 4, day: 1, playerA: null, playerB: null, winner: null };
const advanceContext = {
  state: { tournament: { matches: [...playoffMatches, quarter], stage: "championship2", currentMatch: null, nextHumanMatchId: null } },
  refreshChampionshipSlots() {
    if (playoffMatches.every((match) => match.winner)) {
      quarter.playerA = "__human__";
      quarter.playerB = playoffMatches[0].winner;
    }
  },
  nextHumanTournamentMatch() {
    return advanceContext.state.tournament.matches.find((match) => (
      !match.winner && (match.playerA === "__human__" || match.playerB === "__human__")
    )) || null;
  },
  isHumanTournamentEntry(entry) { return entry === "__human__"; },
  revealChampionshipDay(phase, day) {
    advanceContext.state.tournament.matches
      .filter((match) => match.championshipPhase === phase && match.day === day)
      .forEach((match, index) => { if (!match.winner) match.winner = `winner-${index}`; });
  },
  tournamentMatchById() { return null; },
  result: null,
};
vm.runInNewContext(`${advanceSource}; result = advanceChampionshipToNextHumanMatch();`, advanceContext);
assert.equal(advanceContext.result?.id, "quarter-human", "Le premier de groupe doit reprendre directement en quart après simulation des barrages");
assert.ok(playoffMatches.every((match) => match.winner), "Tous les barrages sans humain doivent être simulés");

const scoreStart = app.indexOf("function randomMatchSetScoresForWinner(");
const scoreEnd = app.indexOf("\nfunction formatSetScores(", scoreStart);
const scoreContext = { Math, results: [] };
vm.runInNewContext(`${app.slice(scoreStart, scoreEnd)}; for (const target of [2, 3]) for (let i = 0; i < 500; i += 1) results.push({ target, scores: randomMatchSetScoresForWinner(i % 2, target), winner: i % 2 });`, scoreContext);
for (const { target, scores, winner } of scoreContext.results) {
  const wins = scores.filter((score) => score[winner] > score[1 - winner]).length;
  assert.equal(wins, target, `Le vainqueur doit gagner ${target} sets`);
  assert.ok(scores.length <= (target * 2) - 1, `Un match en ${target} sets gagnants ne peut dépasser ${(target * 2) - 1} sets`);
}

console.log("v3.53 : salon Championnat sobre, tours repliables, classements et tableau final : OK");
