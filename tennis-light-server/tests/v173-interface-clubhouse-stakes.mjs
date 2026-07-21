import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const [html, app, styles, server] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../server.js", import.meta.url), "utf8"),
]);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(html, /Tennis Courts Academy · 2\.169\.21/);
assert.match(html, /styles\.css\?v=170\.18/);
assert.match(html, /app\.js\?v=170\.18/);

const renderTournament = functionSource(app, "renderTournamentPanel");
const toggleTournament = functionSource(app, "toggleTournamentPanel");
assert.match(renderTournament, /SPECTATOR_MODE\.enabled[\s\S]*classList\.add\("hidden"\)/);
assert.match(renderTournament, /TOURNAMENT_PANEL_UI\.visible/);
assert.doesNotMatch(toggleTournament, /state\.tournament\.visible\s*=/);
assert.match(toggleTournament, /TOURNAMENT_PANEL_UI\.visible/);
assert.match(app, /lobbyAccountPanel\?\.addEventListener\("mouseleave"/);
assert.match(app, /FRIENDLY_TOURNAMENT\.enabled && state\.gameOver && state\.setMatch\?\.matchOver[\s\S]*returnFriendlyMatchToClubHouse\(\)/);

const lobbyRooms = functionSource(app, "renderLobbyRooms");
assert.doesNotMatch(lobbyRooms, /JOIN\.svg|JUST-WATCH\.svg/);
assert.match(lobbyRooms, />REJOINDRE<\/button>/);
assert.match(lobbyRooms, />SPECTATEUR<\/button>/);
assert.doesNotMatch(functionSource(app, "renderFriendlyLobbyMatchCard"), /JUST-WATCH\.svg/);
assert.doesNotMatch(functionSource(app, "renderFriendlyLobbyScreen"), /JOIN\.svg/);

assert.match(styles, /#proNewsMessage[\s\S]*rgba\(255, 255, 255, 0\.94\)/);
assert.match(styles, /\.confrontation-player-card-frame \{[^}]*border: 2px solid/);
assert.match(styles, /\.confrontation-player-card-frame::after \{ display: none; \}/);
assert.match(styles, /#returnLobbyButton\.friendly-match-complete-return/);

const setProjectionSource = functionSource(app, "projectSetScoreForExchangeWinner");
const stakeSource = functionSource(app, "currentMatchStake");
const stakeContext = {
  state: {
    gameOver: false,
    setMatch: { enabled: true, setOver: false, score: [3, 3], setsWon: [1, 0], targetSets: 2 },
    players: [{ name: "Joueur A" }, { name: "Joueur B" }],
  },
  opponentOf: (winner) => winner === 0 ? 1 : 0,
  previewSetMatchScore: (winner, exchangeScore) => {
    const loser = winner === 0 ? 1 : 0;
    const score = [...stakeContext.state.setMatch.score];
    score[winner] += exchangeScore.winnerGames;
    score[loser] += exchangeScore.loserGames;
    return score;
  },
  isSetOver: ([left, right]) => (left >= 6 || right >= 6) && Math.abs(left - right) >= 2,
  leadingSetPlayer: ([left, right]) => left > right ? 0 : right > left ? 1 : null,
  displayPlayerName: (player) => player.name,
  result: null,
};
vm.createContext(stakeContext);
vm.runInContext(`${setProjectionSource}\n${stakeSource}\nresult = currentMatchStake();`, stakeContext);
assert.deepEqual(JSON.parse(JSON.stringify(stakeContext.result)), [
  { label: "BALLE DE MATCH", names: "Joueur A (BOOST)" },
  { label: "BALLE DE SET", names: "Joueur B (BOOST)" },
]);
stakeContext.state.setMatch.score = [3, 4];
stakeContext.state.setMatch.setsWon = [0, 1];
vm.runInContext("result = currentMatchStake();", stakeContext);
assert.deepEqual(JSON.parse(JSON.stringify(stakeContext.result)), [
  { label: "BALLE DE MATCH", names: "Joueur B" },
  { label: "BALLE DE SET", names: "Joueur A (BOOST)" },
]);

assert.match(functionSource(app, "activeEffectBadges"), /Bonus étoile/);
assert.match(functionSource(app, "activeEffectBadges"), /tant que la carte est visible/);
assert.doesNotMatch(functionSource(app, "activeEffectBadges"), /tant que son indicateur reste visible/);

const leaveWaiting = functionSource(server, "leaveWaitingFriendlyParticipant");
assert.match(leaveWaiting, /transferFriendlyTournamentCreator/);
assert.match(leaveWaiting, /participant\.leftAt = now/);
assert.match(server, /rejoined: true/);
assert.match(server, /previousParticipant\.selected = false/);
assert.match(server, /Vous êtes déjà présent dans ce tournoi/);
assert.doesNotMatch(server, /Vous avez déjà participé à ce tournoi et ne pouvez pas le rejoindre à nouveau/);
assert.match(functionSource(app, "applyFriendlyTournamentState"), /roundJustChanged/);
assert.match(functionSource(app, "scheduleFriendlyTournamentMatch"), /let remaining = 3/);

console.log("v2.169.16 lisibilité, annonces, tableau local et Club House: OK");
