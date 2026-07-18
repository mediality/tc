import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");

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

assert.match(html, /Tennis Courts Academy <span>v143<\/span>/);
assert.equal((html.match(/id="openAiClubHouseButton"/g) || []).length, 1);
assert.match(html, /id="aiClubHouseScreen"/);
assert.match(html, /data-ai-club-value="tournament"/);
assert.match(html, /data-ai-club-value="league"/);
assert.match(html, /data-ai-club-value="2"/);
assert.match(html, /data-ai-club-value="3"/);

for (const difficulty of ["amateur", "normal", "expert", "champion", "legend", "ranking", "circuit"]) {
  assert.match(html, new RegExp(`data-ai-club-value="${difficulty}"`));
}
for (const bonus of ["none", "ascendant", "domination", "nemesis"]) {
  assert.match(html, new RegExp(`data-ai-club-setting="bonus" data-ai-club-value="${bonus}"`));
}
for (const value of ["random", "best", "ranking"]) {
  assert.match(html, new RegExp(`data-ai-club-value="${value}"`));
}

const aiClubHouseHtml = html.slice(
  html.indexOf('id="aiClubHouseScreen"'),
  html.indexOf('<main class="app game-app'),
);
assert.match(aiClubHouseHtml, /Joueurs/);
assert.match(aiClubHouseHtml, /Répartition/);
assert.match(aiClubHouseHtml, /Bonus/);
assert.doesNotMatch(html, /data-start-solo="(?:tournament|league)/);

assert.match(app, /const AI_DIFFICULTIES = \["amateur", "normal", "expert", "champion", "legend", "ranking", "circuit"\]/);
assert.match(app, /const AI_BONUS_COUNTS = \{\s+none: 0,\s+ascendant: 1,\s+domination: 2,\s+nemesis: 3,/);
assert.match(app, /function allCircuitSeedBonuses\(\)/);
assert.match(app, /bonuses\[entry\] = shuffle\(allCircuitSeedBonuses\(\)\)\.slice\(0, bonusCount\)/);
assert.match(app, /function aiIntelligenceForEntry\(entry, difficulty = "normal"\)/);
assert.match(app, /function buildTournamentAiIntelligenceLevels\(entries = \[\], difficulty = "normal", options = \{\}\)/);
assert.match(app, /function buildCircuitProBonuses\(entries = \[\], seededEntries = \[\], surface = null\)/);
assert.match(app, /if \(rankIa === 1\) return Math\.random\(\) < 0\.5 \? "champion" : "legend"/);
assert.match(app, /return rankIa >= 16 \? "amateur" : "normal"/);
assert.match(app, /aiIntelligenceLevels,/);
assert.match(app, /function aiIntelligenceBadgeMarkup\(entry\)/);
assert.match(app, /amateur: \{ initial: "A", label: "Amateur" \}/);
assert.match(app, /expert: \{ initial: "E", label: "Expert" \}/);
assert.match(app, /champion: \{ initial: "C", label: "Champion" \}/);
assert.match(app, /legend: \{ initial: "L", label: "Légendaire" \}/);
assert.match(styles, /\.ai-intelligence-badge\.amateur\s*\{[\s\S]*?color: #111827;[\s\S]*?background: #fff;/);
assert.match(styles, /\.ai-intelligence-badge\.expert/);
assert.match(styles, /\.ai-intelligence-badge\.champion/);
assert.match(styles, /\.ai-intelligence-badge\.legend/);
assert.match(styles, /\.ai-intelligence-badge \{[\s\S]*?border-radius: 50%/);
assert.match(styles, /\.friendly-setting-row\.setting-disabled/);
assert.match(app, /button\.disabled = setting === "bonus" && circuitMode/);
assert.match(app, /aiClubHouseScreen\?\.addEventListener\("click"/);
assert.match(styles, /\.ai-club-house-settings \.friendly-setting-button\s*\{[\s\S]*?min-height: 34px/);
assert.match(app, /function chooseSoloScoredOption\(options,/);
assert.match(app, /amateur: \[0\.35, 0\.4, 0\.25\]/);
assert.match(app, /normal: \[0\.55, 0\.3, 0\.15\]/);
assert.match(app, /expert: \[0\.78, 0\.18, 0\.04\]/);
assert.match(app, /champion: \[0\.92, 0\.08\]/);
assert.match(app, /legend: \[1\]/);
assert.match(app, /selectAiClubHousePlayers\(15,/);
assert.match(app, /\[1, 16, 9, 8, 5, 12, 13, 4, 3, 14, 11, 6, 7, 10, 15, 2\]/);
assert.match(app, /function startLeagueTournamentMode\(targetSets = 2, options = \{\}\)/);
assert.match(app, /targetSets = Number\(targetSets\) === 3 \? 3 : 2/);
assert.match(app, /A: \[pick\(1\), pick\(4\), pick\(5\), pick\(8\)\]/);
assert.match(app, /B: \[pick\(2\), pick\(3\), pick\(6\), pick\(7\)\]/);
assert.match(app, /state\.tournament\.active && !state\.tournament\.aiClubHouse/);
assert.doesNotMatch(app, /aiStatBonus|aiPowerBonus/);
const leagueTableSource = functionSource("renderLeagueStandingsTable");
assert.match(leagueTableSource, /<span>Joueur<\/span><span>Points<\/span><span>Sets \+\/-<\/span><span>Jeux \+\/-<\/span>/);
assert.match(leagueTableSource, /formatLeagueDifference\(row\.setDifference\)/);
assert.match(leagueTableSource, /formatLeagueDifference\(row\.gameDifference\)/);
assert.doesNotMatch(leagueTableSource, /<span>J<\/span>|<span>V<\/span>/);
assert.match(styles, /grid-template-columns: minmax\(0, 1fr\) 64px 74px 74px/);

const classicContext = {
  HUMAN_TOURNAMENT_ENTRY: "human",
  selectedCharacterId: () => "human-character",
  selectAiClubHousePlayers: () => Array.from({ length: 15 }, (_, index) => `ai${index + 1}`),
  rankedTournamentEntries: (entries) => entries,
  shuffle: (entries) => entries,
};
vm.runInNewContext(`${functionSource("buildAiClubHouseClassicSetup")}; result = buildAiClubHouseClassicSetup({ distribution: "ranking" });`, classicContext);
assert.deepEqual(
  Array.from(classicContext.result.positions.slice(1)),
  ["human", "ai15", "ai8", "ai7", "ai4", "ai11", "ai12", "ai3", "ai2", "ai13", "ai10", "ai5", "ai6", "ai9", "ai14", "ai1"],
);

const amateurSelectionContext = {
  AI_DIFFICULTIES: ["amateur", "normal", "expert", "champion", "legend", "ranking", "circuit"],
  AI_CLUB_HOUSE: { format: "tournament", targetSets: 2, difficulty: "normal", bonus: "none", players: "random", distribution: "random" },
  localStorage: { setItem: (key, value) => { amateurSelectionContext.stored = { key, value }; } },
  renderAiClubHouse: () => { amateurSelectionContext.rendered = true; },
};
vm.runInNewContext(`
  ${functionSource("normalizeAiDifficulty")}
  ${functionSource("updateAiClubHouseSetting")}
  updateAiClubHouseSetting("difficulty", "amateur");
`, amateurSelectionContext);
assert.equal(amateurSelectionContext.AI_CLUB_HOUSE.difficulty, "amateur");
assert.deepEqual(amateurSelectionContext.stored, { key: "tennisLightAiClubDifficulty", value: "amateur" });
assert.equal(amateurSelectionContext.rendered, true);

const amateurBadgeContext = {
  state: { tournament: { aiIntelligenceLevels: { ai1: "amateur" }, difficulty: "amateur" } },
  isHumanTournamentEntry: () => false,
  aiIntelligenceForEntry: () => "amateur",
};
vm.runInNewContext(`${functionSource("aiIntelligenceBadgeMarkup")}; result = aiIntelligenceBadgeMarkup("ai1");`, amateurBadgeContext);
assert.match(amateurBadgeContext.result, /class="ai-intelligence-badge amateur"/);
assert.match(amateurBadgeContext.result, /aria-label="Niveau Amateur">A<\/span>/);

const intelligenceContext = {
  HUMAN_TOURNAMENT_ENTRY: "human",
  normalizeAiDifficulty: (value) => value,
  normalizeAiIntelligence: (value) => value,
  rankedAiTournamentEntries: (entries) => [...entries].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2))),
  tournamentRankIa: (entry) => Number(entry.slice(2)),
  Math: { random: () => 0.75 },
};
vm.runInNewContext(`${functionSource("drawRankedAiIntelligence")}; ${functionSource("buildTournamentAiIntelligenceLevels")}; result = buildTournamentAiIntelligenceLevels(["human", "ai16", "ai10", "ai2", "ai1", "ai3", "ai4", "ai5", "ai6", "ai7", "ai8", "ai9", "ai11"], "ranking");`, intelligenceContext);
assert.deepEqual(
  { ...intelligenceContext.result },
  { ai1: "legend", ai2: "champion", ai3: "champion", ai4: "champion", ai5: "expert", ai6: "expert", ai7: "expert", ai8: "expert", ai9: "expert", ai10: "expert", ai11: "normal", ai16: "amateur" },
);

const leagueFinalContext = {
  state: {
    tournament: {
      stage: "semi",
      currentMatch: "league_semi1",
      nextHumanMatchId: null,
      championCharacterId: null,
      matches: [
        { id: "league_semi2", round: "semi", playerA: "ai1", playerB: "ai2", winner: null, score: null, hiddenWinner: null, hiddenSetScores: null, simulated: true },
        { id: "final", round: "final", playerA: null, playerB: null, winner: null, score: null, simulated: false },
      ],
    },
  },
  isHumanTournamentEntry: (entry) => entry === "human",
  ensureSimulatedTournamentMatchReady: (match) => {
    match.hiddenWinner = "ai1";
    match.hiddenSetScores = [[6, 3], [6, 4]];
    return true;
  },
  formatSetScores: () => "6/3 - 6/4",
};
leagueFinalContext.tournamentMatchById = (id) => leagueFinalContext.state.tournament.matches.find((match) => match.id === id);
leagueFinalContext.refreshLeagueKnockoutSlots = () => {
  const semi = leagueFinalContext.tournamentMatchById("league_semi2");
  const final = leagueFinalContext.tournamentMatchById("final");
  if (semi.winner && !final.playerA) {
    final.playerA = "human";
    final.playerB = semi.winner;
  }
};
leagueFinalContext.nextHumanTournamentMatch = () => leagueFinalContext.state.tournament.matches.find((match) => !match.winner && (match.playerA === "human" || match.playerB === "human")) || null;
vm.runInNewContext(`${functionSource("completeLeagueWithoutHuman")}; completeLeagueWithoutHuman();`, leagueFinalContext);
assert.equal(leagueFinalContext.state.tournament.stage, "readyNext");
assert.equal(leagueFinalContext.state.tournament.nextHumanMatchId, "final");
assert.equal(leagueFinalContext.tournamentMatchById("final").score, null);

const circuitBonusContext = {
  HUMAN_TOURNAMENT_ENTRY: "human",
  SURFACE_BONUSES: {
    grass: [1, 2, 3].map((number) => ({ id: `grass${number}`, label: `Herbe ${number}` })),
    hard: [1, 2, 3].map((number) => ({ id: `hard${number}`, label: `Dur ${number}` })),
    clay: [1, 2, 3].map((number) => ({ id: `clay${number}`, label: `Terre ${number}` })),
  },
  shuffle: (entries) => [...entries],
  rankedAiTournamentEntries: (entries) => [...entries].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2))),
  tournamentAiRankingEntries: () => Array.from({ length: 12 }, (_, index) => ({ entry: `ai${index + 1}`, rankIa: index + 1 })),
  circuitEntries: ["human", ...Array.from({ length: 10 }, (_, index) => `ai${index + 1}`)],
  Math: { random: () => 0.75, floor: Math.floor },
};
vm.runInNewContext(`${functionSource("randomSurfaceBonus")}; ${functionSource("allCircuitSeedBonuses")}; ${functionSource("randomCircuitBonus")}; ${functionSource("addCircuitBonus")}; ${functionSource("buildCircuitProBonuses")}; result = buildCircuitProBonuses(circuitEntries, ["ai1", "ai2"], "grass");`, circuitBonusContext);
assert.equal(circuitBonusContext.result.bonuses.ai1.length, 2, "le numéro 1 reçoit son bonus supplémentaire");
assert.equal(circuitBonusContext.result.bonuses.ai2.length, 1, "la deuxième tête de série conserve son bonus surface garanti");
for (let rank = 3; rank <= 8; rank += 1) assert.equal(circuitBonusContext.result.bonuses[`ai${rank}`], undefined);
assert.equal(circuitBonusContext.result.bonuses.ai9, undefined);
circuitBonusContext.Math.random = () => 0.25;
vm.runInNewContext(`allBonusesResult = buildCircuitProBonuses(circuitEntries, ["ai1", "ai2"], "grass");`, circuitBonusContext);
assert.equal(circuitBonusContext.allBonusesResult.bonuses.ai1.length, 2);
assert.equal(circuitBonusContext.allBonusesResult.bonuses.ai2.length, 2);
for (let rank = 3; rank <= 8; rank += 1) assert.equal(circuitBonusContext.allBonusesResult.bonuses[`ai${rank}`].length, 1);
assert.equal(circuitBonusContext.allBonusesResult.bonuses.ai9, undefined);
circuitBonusContext.Math.random = () => 0.75;
vm.runInNewContext(`leaderOutsideSeeds = buildCircuitProBonuses(circuitEntries, ["ai2", "ai3"], "grass");`, circuitBonusContext);
assert.equal(circuitBonusContext.leaderOutsideSeeds.bonuses.ai1.length, 1, "le numéro 1 hors têtes de série reçoit un bonus");

const weeklyStartSource = functionSource("startWeeklyTournamentMode");
assert.match(weeklyStartSource, /SOLO_AI\.difficulty = "circuit"/);
assert.match(weeklyStartSource, /buildTournamentAiIntelligenceLevels\(positions, "circuit", \{ humanLevel \}\)/);
assert.match(weeklyStartSource, /buildWeeklyCircuitProBonuses\(positions, seedEntries, surface, humanLevel\)/);
assert.doesNotMatch(weeklyStartSource, /buildWeeklySurfaceBonuses|buildTournamentPermanentBonuses|previousWeekDynamicBonusIds/);

const bonusContext = {
  HUMAN_TOURNAMENT_ENTRY: "human",
  aiBonusCount: (value) => ({ none: 0, ascendant: 1, domination: 2, nemesis: 3 }[value]),
  allCircuitSeedBonuses: () => Array.from({ length: 9 }, (_, index) => ({ id: `bonus${index + 1}` })),
  shuffle: (entries) => entries,
};
vm.runInNewContext(`${functionSource("buildAiClubHouseBonuses")}; result = buildAiClubHouseBonuses(["human", "ai1", "ai2"], "domination");`, bonusContext);
assert.equal(bonusContext.result.ai1.length, 2);
assert.equal(bonusContext.result.ai2.length, 2);
assert.equal(bonusContext.result.human, undefined);

const choiceContext = {
  SOLO_AI: { style: "normal" },
  normalizeAiIntelligence: (value) => value,
  roll: 0.6,
};
choiceContext.Math = { random: () => choiceContext.roll };
vm.runInNewContext(`${functionSource("chooseSoloScoredOption")};
  const options = [{ id: "best", score: 100 }, { id: "second", score: 95 }, { id: "third", score: 90 }];
  normalResult = chooseSoloScoredOption(options).id;
  SOLO_AI.style = "legend";
  legendResult = chooseSoloScoredOption(options).id;`, choiceContext);
assert.equal(choiceContext.normalResult, "second");
assert.equal(choiceContext.legendResult, "best");

console.log("v143 CLUB HOUSE: OK");
