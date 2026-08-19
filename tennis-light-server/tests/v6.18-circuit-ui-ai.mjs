import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");

assert.match(server, /1500: \{ round32: 0, round16: 75,/);
assert.match(server, /2000: \{ round32: 0, round16: 100,/);
assert.match(server, /4000: \{ round32: 0, round16: 200,/);
assert.match(app, /const tournamentSize = Number\(weeklyCompetition\.value \|\| 0\) >= 1500 \? 32 : 16/);
assert.match(app, /buildTournamentRound16Positions\(humanCharacterId, surface, currentRankingTotalPoints\(\), tournamentSize\)/);
assert.match(app, /bracketSize: tournamentSize/);
assert.match(app, /if \(last\.round === "round32"\) return "round32"/);
assert.match(app, /Tournoi de la semaine \$\{week\} \(Saison \$\{season\}\)/);
assert.match(app, /function soloCertainWinDecision[\s\S]*?!aiIntelligenceAtLeast\("expert"\)/);
assert.match(app, /function certainWinImprovementPath\(playerIndex, passProjection = soloPassProjection\(playerIndex\)\)/);
assert.match(app, /loserGames < passScore\.loserGames[\s\S]*?winnerGames > passScore\.winnerGames/);
assert.match(app, /function certainWinImprovementPath[\s\S]*?guaranteedScore: "3-0"[\s\S]*?guaranteedScore: "2-0"/);
assert.match(html, /<th>16e<\/th><th>8e<\/th>/);
assert.match(html, /Crown 1500<\/th><td>0<\/td><td>75<\/td>/);
assert.match(html, /Slam 2000<\/th><td>0<\/td><td>100<\/td>/);
assert.match(html, /Finals 4000<\/th><td>0<\/td><td>200<\/td>/);
assert.match(styles, /V6\.18 — contraste des surfaces sombres/);
assert.match(styles, /font-size: \.82rem;[\s\S]*?line-height: 1\.15;/);

console.log("V6.18 circuit 32 joueurs, interface et décision IA : OK");
