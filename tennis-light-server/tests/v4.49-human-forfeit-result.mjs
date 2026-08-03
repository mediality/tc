import assert from "node:assert/strict";
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const indexHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.49.0");
assert.match(indexHtml, /app\.js\?v=4\.49\.0/);
assert.match(indexHtml, /Tennis Courts Academy · <span>v4\.49<\/span>/);

assert.match(app, /FRIENDLY_TOURNAMENT\.localMatchSeat = seat;/);
assert.match(app, /if \(FRIENDLY_TOURNAMENT\.enabled && Number\.isInteger\(FRIENDLY_TOURNAMENT\.localMatchSeat\)\)[\s\S]*?return FRIENDLY_TOURNAMENT\.localMatchSeat;/);
assert.match(app, /FRIENDLY_TOURNAMENT\.localMatchSeat = null;/);

assert.match(server, /function friendlyForfeitScore\(tournament, match, winnerEntry\)/);
assert.match(server, /const winnerGames = friendlyOnePointFormat\(tournament\) \? 3 : 6;/);
assert.match(server, /Math\.max\(1, Number\(tournament\?\.targetSets \|\| 2\)\)/);
assert.match(server, /winnerIsPlayerA \? `\$\{winnerGames\}\/0` : `0\/\$\{winnerGames\}`/);
assert.match(server, /match\.score = friendlyForfeitScore\(tournament, match, match\.winner\);/);

const helperSource = server.slice(
  server.indexOf("function friendlyForfeitScore("),
  server.indexOf("\nfunction refreshFriendlyTournamentSlots", server.indexOf("function friendlyForfeitScore(")),
);
const friendlyForfeitScore = new Function(
  "friendlyOnePointFormat",
  `${helperSource}; return friendlyForfeitScore;`,
)((tournament) => ["onepoint", "onepointmaster"].includes(tournament?.format));
const match = { playerA: "human:a", playerB: "human:b" };

assert.equal(friendlyForfeitScore({ format: "classic", targetSets: 2 }, match, match.playerA), "6/0 - 6/0 · FORFAIT");
assert.equal(friendlyForfeitScore({ format: "classic", targetSets: 3 }, match, match.playerA), "6/0 - 6/0 - 6/0 · FORFAIT");
assert.equal(friendlyForfeitScore({ format: "classic", targetSets: 2 }, match, match.playerB), "0/6 - 0/6 · FORFAIT");
assert.equal(friendlyForfeitScore({ format: "onepoint", targetSets: 1 }, match, match.playerA), "3/0 · FORFAIT");
assert.equal(friendlyForfeitScore({ format: "onepointmaster", targetSets: 1 }, match, match.playerB), "0/3 · FORFAIT");

console.log("V4.49 human forfeit result checks passed.");
