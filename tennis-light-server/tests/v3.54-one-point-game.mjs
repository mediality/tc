import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.60.0");
assert.match(app, /const GAME_VERSION = "v3\.60"/);
assert.match(html, /data-ai-club-value="onepoint"/);
assert.match(html, /<strong>1 Point Game<\/strong>/);
assert.match(html, /data-ai-club-value="reward">RÉCOMPENSE/);

assert.match(app, /function startOnePointTournamentMode/);
assert.match(app, /startTournamentMode\(1, \{ \.\.\.options, onePointGame: true \}\)/);
assert.match(app, /completeOnePointTournamentMatch\(winner, setScore\)/);
assert.match(app, /winnerGames \|\| 2/);
assert.match(app, /loserGames \|\| 0/);

assert.match(app, /winnerScore === 3 && loserScore === 0 \? 2/);
assert.match(app, /winnerScore === 2 && loserScore === 0 \? 1 : 0/);
assert.match(app, /function onePointRewardBonusPool/);
assert.match(app, /rewardAce[\s\S]*rewardSequence[\s\S]*rewardBulle/);
assert.match(app, /shuffle\(onePointRewardBonusPool\(\)\)\.slice\(0, rewardCount\)/);
assert.match(app, /previousWinScores\[winnerEntry\]/);
assert.match(app, /scoreA === scoreB[\s\S]*Math\.random\(\)/);
assert.match(app, /scoreA > scoreB \? match\.playerA : match\.playerB/);

assert.match(app, /selectAiClubHousePlayers\(15/);
assert.match(app, /const seedEntries = rankedRoster\.slice\(0, 4\)/);
assert.match(app, /const circuitPositionPairs = \[\[1, 16\]/);
assert.match(app, /data-competition-summary>RÉSUMÉ COMPÉTITION/);

console.log("v3.60 : tournoi 1 Point Game, récompenses et service au mérite : OK");
