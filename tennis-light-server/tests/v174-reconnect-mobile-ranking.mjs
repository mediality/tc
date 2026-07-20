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

assert.match(html, /styles\.css\?v=170\.13/);
assert.match(html, /app\.js\?v=170\.13/);
assert.equal((html.match(/data-ranking-sort="points">S-4<\/button>/g) || []).length, 3);

const resumeMatch = functionSource(app, "resumeFriendlyMatchFromClubHouse");
assert.match(resumeMatch, /presenceId = crypto\.randomUUID\(\)/);
assert.match(resumeMatch, /presenceRestored = await restoreFriendlyTournamentPresence\(\)/);
assert.match(resumeMatch, /!presenceRestored/);
assert.ok(resumeMatch.indexOf("restoreFriendlyTournamentPresence") < resumeMatch.indexOf("startFriendlyTournamentMatch"));

const leaveLobby = functionSource(app, "leaveFriendlyTournamentLobby");
assert.match(leaveLobby, /presenceId: FRIENDLY_TOURNAMENT\.presenceId/);

const presenceStart = server.indexOf("const friendlyPresenceMatch");
const leaveStart = server.indexOf("const friendlyLeaveMatch", presenceStart);
assert.ok(presenceStart >= 0 && leaveStart > presenceStart);
const presenceRoute = server.slice(presenceStart, leaveStart);
const onlineBranch = presenceRoute.indexOf('if (payload.status === "online")');
assert.ok(onlineBranch >= 0);
const onlineRoute = presenceRoute.slice(onlineBranch);
assert.ok(onlineRoute.indexOf("markFriendlyParticipantPresent(participant)") < onlineRoute.indexOf("resolveFriendlyReconnectTimeouts(tournament)"));

const leaveRoute = server.slice(leaveStart, server.indexOf("const friendlyStateMatch", leaveStart));
assert.match(leaveRoute, /leavingPresenceId/);
assert.match(leaveRoute, /leavingPresenceId !== participant\.activePresenceId/);
assert.match(leaveRoute, /ignored: true/);

const reconnectContext = {
  tournament: {
    status: "playing",
    participants: [{ id: "returning", awayAt: 1000, reconnectDeadline: 2000, reconnectMatchId: "semi" }],
    matches: [{ id: "semi", winner: null }],
  },
  result: null,
};
vm.createContext(reconnectContext);
vm.runInContext(`
  function activeFriendlyParticipants(tournament) { return tournament.participants; }
  function lockFriendlyParticipantForfeit(tournament, participant) { participant.forfeitedAt = true; return true; }
  function forfeitFriendlyMatchAfterDisconnect(tournament, match, participant) { participant.forfeitedAt = true; return true; }
  ${functionSource(server, "markFriendlyParticipantPresent")}
  ${functionSource(server, "resolveFriendlyReconnectTimeouts")}
  markFriendlyParticipantPresent(tournament.participants[0], 1900);
  resolveFriendlyReconnectTimeouts(tournament, 2100);
  result = tournament.participants[0];
`, reconnectContext);
assert.equal(reconnectContext.result.forfeitedAt, undefined);
assert.equal(reconnectContext.result.awayAt, null);
assert.equal(reconnectContext.result.reconnectDeadline, null);

const ranking = functionSource(app, "rankingMarkup");
assert.match(ranking, /ranking-score-points/);
assert.match(ranking, /ranking-score-week/);
assert.match(ranking, /ranking-score-season/);
assert.match(functionSource(app, "renderRanking"), /dataset\.mobileScore = AUTH_STATE\.rankingSort/);
assert.match(functionSource(app, "changeRankingSort"), /renderRanking\(\)/);

assert.match(styles, /@media \(max-width: 700px\) and \(orientation: portrait\)/);
assert.match(styles, /ranking-list\[data-mobile-score="points"\] \.ranking-score-points/);
assert.match(styles, /grid-template-columns: 64px minmax\(0, 1fr\) minmax\(70px, max-content\)/);
assert.match(styles, /\.profile-identity-hero \{ grid-template-columns: 1fr/);
assert.match(styles, /\.circuit-points-table thead \{ display: none; \}/);
assert.match(styles, /\.circuit-points-table td:nth-child\(6\)::before \{ content: "Victoire"; \}/);
assert.match(styles, /\.confrontation-player-card-frame \{[^}]*0 0 0 4px/);

console.log("reconnexion sécurisée et pages Circuit mobiles verticales: OK");
