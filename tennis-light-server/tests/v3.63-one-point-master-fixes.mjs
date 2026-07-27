import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v3\.63"/);
assert.match(html, /styles\.css\?v=3\.63\.0/);
assert.match(html, /app\.js\?v=3\.63\.0/);

const qualificationStart = app.indexOf("function championshipHumanStillQualified(");
const qualificationEnd = app.indexOf("\nfunction simulateRemainingChampionship(", qualificationStart);
const qualification = app.slice(qualificationStart, qualificationEnd);
assert.match(qualification, /if \(state\.tournament\.onePointMaster\) \{\s*if \(!championshipMatches\(1, 5\)\.every\(\(match\) => match\.winner\)\) return true;/);

assert.match(app, /function clearOnePointTournamentPerformance\(entry\)/);
assert.match(app, /previousWinScores\[entry\] = 0/);
assert.match(app, /onePointRewards\[entry\] = \[\]/);
assert.match(app, /surfaceBonuses\[entry\] = \[\]/);
assert.match(app, /clearOnePointTournamentPerformance\(loserEntry\)/);
assert.match(app, /clearOnePointTournamentPerformance\(winner === playerA \? playerB : playerA\)/);

const serviceStart = app.indexOf("function onePointTournamentServer(");
const serviceEnd = app.indexOf("\nfunction startLeagueTournamentMode(", serviceStart);
const service = app.slice(serviceStart, serviceEnd);
assert.match(service, /scoreA === scoreB[\s\S]*Math\.random\(\)/);
assert.match(service, /scoreA > scoreB \? match\.playerA : match\.playerB/);

assert.match(styles, /\.championship-lobby-screen \{\s*background: transparent;/);
assert.match(styles, /\.championship-practical-info > div[\s\S]*color: #243947;[\s\S]*background: #fff;/);
assert.match(styles, /\.confrontation-intro-player img \{[\s\S]*clip-path: none;[\s\S]*image-rendering: auto;/);

console.log("v3.63 : cinq journées, expiration des bonus, service et lisibilité : OK");
