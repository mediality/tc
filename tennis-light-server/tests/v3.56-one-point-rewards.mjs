import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.57.0");
assert.match(app, /const GAME_VERSION = "v3\.57"/);
assert.match(html, /CHAMPIONSHIP\.svg/);
assert.match(html, /data-ai-club-value="championship" data-pro-format/);

assert.match(app, /function adminSimulatedSetScores[\s\S]*onePointGame[\s\S]*winnerGames[\s\S]*loserGames/);
assert.match(app, /function showCompetitionSummaryScreen/);
assert.match(app, /function completeCompetitionForSummary/);
assert.match(app, /data-competition-summary>RÉSUMÉ COMPÉTITION/);
assert.match(app, /data-finish-competition>TERMINER LA COMPÉTITION/);
assert.match(html, /id="competitionSummaryScreen"/);
assert.match(styles, /\.competition-summary-winner img[\s\S]*aspect-ratio:\s*1/);

assert.match(app, /formatCard\("onepoint", "1 Point Game"/);
assert.match(app, /friendlyFormat === "onepoint"/);
assert.match(server, /\["match", "classic", "league", "onepoint"\]/);
assert.match(server, /tournament\.format === "onepoint" \? 1/);
assert.match(server, /function friendlyHumanWinnerFromState[\s\S]*tournament\.format === "onepoint"/);
assert.match(app, /function onePointResultPerformance[\s\S]*winnerScore\) === 3[\s\S]*return 3[\s\S]*return 2[\s\S]*return 1/);
assert.match(app, /onePointRewards\?\.\[tournamentEntry\]/);
assert.match(app, /state\.tournament\.active && playerIndex === 0[\s\S]*humanTournamentEntry\(\)/);
assert.match(app, /state\.tournament\.onePointRewards\[winnerEntry\]/);
assert.match(server, /function recordFriendlyOnePointResults/);
assert.match(server, /previousWinScores:\s*tournament\.previousWinScores/);
assert.match(server, /rewardCounts:\s*tournament\.rewardCounts/);

console.log("v3.57 : récompenses humaines et priorité de service Solo/En ligne : OK");
