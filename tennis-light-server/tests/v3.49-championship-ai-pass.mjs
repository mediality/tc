import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const index = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v3\.49"/);
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

console.log("v3.49 : Championnat à 24 et décision de passe IA : OK");
