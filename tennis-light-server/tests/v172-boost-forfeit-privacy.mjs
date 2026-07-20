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

assert.match(html, /Tennis Courts Academy · 2\.169\.16/);
assert.match(html, /styles\.css\?v=170\.13/);
assert.match(html, /app\.js\?v=170\.13/);
assert.equal((html.match(/class="academy-upgrade-cta(?:\s|\")/g) || []).length, 2);
assert.equal((html.match(/href="http:\/\/www\.tenniscourts\.cc"/g) || []).length, 2);
assert.doesNotMatch(html, /<footer class="academy-info-footer">/);

const stakeSource = functionSource(app, "currentMatchStake");
const setProjectionSource = functionSource(app, "projectSetScoreForExchangeWinner");
assert.match(setProjectionSource, /winnerGames: 2, loserGames: 0/);
assert.match(setProjectionSource, /previewSetMatchScore/);
assert.match(stakeSource, /closesWithPower/);
assert.match(stakeSource, /closesWithBoost/);
assert.match(stakeSource, /boostOnly/);
assert.match(stakeSource, /\(BOOST\)/);

const stakeContext = {
  state: {
    gameOver: false,
    setMatch: { enabled: true, setOver: false, score: [4, 4], setsWon: [1, 0], targetSets: 2 },
    players: [{ name: "Gauche", power: 5 }, { name: "Droite", power: 5 }],
  },
  getExchangeSetScore: (winner, winType) => ({ winnerGames: winType === "boost" ? 3 : 2, loserGames: winType === "boost" ? 0 : 1, winner, loser: winner === 0 ? 1 : 0 }),
  previewSetMatchScore: (winner, exchangeScore) => {
    const loser = winner === 0 ? 1 : 0;
    const next = [...stakeContext.state.setMatch.score];
    next[winner] += exchangeScore.winnerGames;
    next[loser] += exchangeScore.loserGames;
    return next;
  },
  isSetOver: ([left, right]) => (left >= 6 || right >= 6) && Math.abs(left - right) >= 2,
  leadingSetPlayer: ([left, right]) => left > right ? 0 : right > left ? 1 : null,
  displayPlayerName: (player) => player.name,
  opponentOf: (winner) => winner === 0 ? 1 : 0,
  result: null,
};
vm.createContext(stakeContext);
vm.runInContext(`${setProjectionSource}\n${stakeSource}\nresult = currentMatchStake();`, stakeContext);
assert.equal(stakeContext.result[0].label, "BALLE DE MATCH");
assert.equal(stakeContext.result[0].names, "Gauche");
assert.equal(stakeContext.result[1].label, "BALLE DE SET");
assert.equal(stakeContext.result[1].names, "Droite");
assert.doesNotMatch(stakeContext.result.map((stake) => stake.names).join(" "), /BOOST/);

const clubhouse = functionSource(app, "renderFriendlyLobbyScreen");
assert.match(clubhouse, /friendly-player-identity[\s\S]*VALID\.svg[\s\S]*friendly-player-name/);
assert.match(clubhouse, /Événement public ou privé/);
assert.match(clubhouse, /data-new-friendly-event/);
assert.match(clubhouse, /NOUVEL ÉVÉNEMENT/);
assert.match(functionSource(app, "updateFriendlyTournamentSettings"), /next\.visibility/);
assert.match(functionSource(app, "createNewFriendlyEventFromClubHouse"), /\/new-event/);
assert.match(functionSource(app, "showFriendlyForfeitDialog"), /QUALIFIÉ PAR FORFAIT/);

const departed = functionSource(server, "friendlyEntryHasLeft");
assert.match(departed, /forfeitedAt/);
assert.match(functionSource(server, "lockFriendlyParticipantForfeit"), /selected = false/);
assert.match(functionSource(server, "currentFriendlyMatchForParticipant"), /participant\.forfeitedAt/);
assert.match(functionSource(server, "resolveFriendlyReconnectTimeouts"), /lockFriendlyParticipantForfeit/);
assert.match(functionSource(server, "resolveFriendlyDepartedForfeits"), /forfeitParticipantId/);
assert.match(server, /Votre forfait est définitif pour cet événement/);

assert.match(server, /visibility: "public"/);
assert.match(server, /tournament\.visibility = payload\.visibility === "private"/);
assert.match(functionSource(server, "friendlyUserCanSpectate"), /friendlyUserIsValidated/);
assert.match(functionSource(server, "publicProfileActivity"), /friendlyUserCanSpectate/);
assert.match(server, /Cet événement privé est réservé aux joueurs validés/);
assert.ok(server.includes("const friendlyNewEventMatch = url.pathname.match"));
assert.match(functionSource(server, "resetFriendlyTournamentForNewEvent"), /status = "waiting"/);
assert.match(functionSource(server, "removeFriendlyParticipantAfterComplete"), /leftAt/);

const privacyContext = { tournament: { visibility: "private", participants: [{ userId: "inside", selected: true }] }, result: null };
vm.createContext(privacyContext);
vm.runInContext(`
  ${functionSource(server, "friendlyTournamentVisibility")}
  ${functionSource(server, "friendlyUserIsValidated")}
  ${functionSource(server, "friendlyUserCanSpectate")}
  result = {
    outsider: friendlyUserCanSpectate(tournament, { id: "outside" }),
    validated: friendlyUserCanSpectate(tournament, { id: "inside" }),
  };
`, privacyContext);
assert.deepEqual(JSON.parse(JSON.stringify(privacyContext.result)), { outsider: false, validated: true });

const forfeitContext = {
  tournament: {
    round: "semi",
    status: "playing",
    participants: [
      { id: "gone", forfeitedAt: 1000 },
      { id: "here", forfeitedAt: null },
    ],
    matches: [{ id: "semi1", round: "semi", playerA: "human:gone", playerB: "human:here", winner: null }],
  },
  result: null,
};
vm.createContext(forfeitContext);
vm.runInContext(`
  function friendlyEntryIsHuman(entry) { return String(entry || "").startsWith("human:"); }
  function friendlyParticipantEntry(participantId) { return \`human:\${participantId}\`; }
  function friendlyRoundReadyForPlay() { return true; }
  ${departed}
  ${functionSource(server, "resolveFriendlyDepartedForfeits")}
  ${functionSource(server, "currentFriendlyMatchForParticipant")}
  resolveFriendlyDepartedForfeits(tournament);
  result = {
    winner: tournament.matches[0].winner,
    forfeitParticipantId: tournament.matches[0].forfeitParticipantId,
    remainingMatch: currentFriendlyMatchForParticipant(tournament, "here"),
  };
`, forfeitContext);
assert.equal(forfeitContext.result.winner, "human:here");
assert.equal(forfeitContext.result.forfeitParticipantId, "gone");
assert.equal(forfeitContext.result.remainingMatch, null);

assert.match(styles, /\.friendly-player-identity/);
assert.match(styles, /\.friendly-visibility-section/);
assert.match(styles, /\.friendly-new-event-button/);
assert.match(styles, /\.online-private-event-badge/);

console.log("v2.169.16 boost, forfait définitif, confidentialité et nouvel événement: OK");
