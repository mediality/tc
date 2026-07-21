import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const [html, app, css, pkg] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);

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

assert.equal(JSON.parse(pkg).version, "2.169.21");
assert.match(app, /const GAME_VERSION = "v2\.169\.21"/);
assert.match(html, /Tennis Courts Academy · 2\.169\.21/);
assert.match(html, /styles\.css\?v=170\.18/);
assert.match(html, /app\.js\?v=170\.18/);
assert.match(html, /id="rallyScoreDeltaBadge"/);

const badgeContext = vm.createContext({ state: { resultInfo: null } });
vm.runInContext(`${functionSource("rallyEndGamesAdded")}\n${functionSource("rallyEndGamesAddedLabel")}`, badgeContext);
badgeContext.state.resultInfo = { setScore: { winner: 1, loser: 0, winnerGames: 3, loserGames: 0 } };
assert.equal(vm.runInContext("rallyEndGamesAddedLabel()", badgeContext), "+ 0/3");
badgeContext.state.resultInfo = { setScore: { winner: 0, loser: 1, winnerGames: 2, loserGames: 1 } };
assert.equal(vm.runInContext("rallyEndGamesAddedLabel()", badgeContext), "+ 2/1");

const logContext = vm.createContext({
  state: { players: [{ power: 24 }, { power: 21 }] },
  playerName: (index) => index === 0 ? "Joueur gauche" : "Joueur droite",
});
vm.runInContext(functionSource("exchangeResultLogLine"), logContext);
const pointsLog = vm.runInContext("exchangeResultLogLine(0, 'power', { winner: 0, loser: 1, winnerGames: 2, loserGames: 1 })", logContext);
assert.match(pointsLog, /Victoire aux Points/);
assert.match(pointsLog, /Le vainqueur reçoit \+2/);
assert.match(pointsLog, /Écart de 3, inférieur à 5 : le perdant reçoit \+1/);
assert.match(pointsLog, /Joueur gauche \+2 · Joueur droite \+1/);

const boostLog = vm.runInContext("exchangeResultLogLine(1, 'boost', { winner: 1, loser: 0, winnerGames: 3, loserGames: 0 })", logContext);
assert.match(boostLog, /Victoire sur Boost/);
assert.match(boostLog, /points de puissance ne sont pas pris en compte/);
assert.match(boostLog, /Joueur gauche \+0 · Joueur droite \+3/);

const effectLog = vm.runInContext("exchangeResultLogLine(0, 'smash', { winner: 0, loser: 1, winnerGames: 2, loserGames: 0 })", logContext);
assert.match(effectLog, /Victoire sur Effet/);
assert.match(effectLog, /points de puissance ne sont pas pris en compte/);

assert.match(functionSource("finishGame"), /state\.log\.unshift\(exchangeResultLogLine/);
assert.match(functionSource("renderActionLogEntry"), /action-log-result-details/);
assert.match(css, /\.action-log-result-details/);
assert.match(css, /\.center-card-wrap\.boosted-center-wrap \+ \.center-progression-actions\s*\{[^}]*margin-top: 140px/);
assert.match(css, /\.center-progression-actions\s*\{[^}]*z-index: 20/);

console.log("v2.169.21 pastilles de résultat et déroulé détaillé: OK");
