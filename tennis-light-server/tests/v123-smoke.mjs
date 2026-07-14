import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://localhost:3023";

async function request(session, path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (session?.cookie) headers.cookie = session.cookie;
  if (options.body && !headers["content-type"]) headers["content-type"] = "application/json";
  const response = await fetch(`${base}${path}`, { ...options, headers });
  const setCookie = response.headers.get("set-cookie");
  if (session && setCookie) session.cookie = setCookie.split(";")[0];
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function register(email, nickname) {
  const session = { cookie: "", user: null };
  const { response, data } = await request(session, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password: "Test-v123!", nickname }),
  });
  assert.equal(response.status, 201, data.error);
  session.user = data.user;
  return session;
}

async function promote(admin, player) {
  const { response, data } = await request(admin, `/api/admin/users/${player.user.id}/role`, {
    method: "POST",
    body: JSON.stringify({ role: "pro" }),
  });
  assert.equal(response.status, 200, data.error);
}

async function createTournament(player) {
  const { response, data } = await request(player, "/api/lobby/friendly-tournaments", {
    method: "POST",
    body: JSON.stringify({ characterId: "coachJu" }),
  });
  assert.equal(response.status, 201, data.error);
  return {
    id: data.tournament.id,
    participantId: data.tournament.participant.id,
    token: data.tournament.participant.token,
    entry: data.tournament.participant.entry,
  };
}

async function joinTournament(player, tournamentId, characterId = "coachMax") {
  const { response, data } = await request(player, `/api/lobby/friendly-tournaments/${tournamentId}/join`, {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
  assert.equal(response.status, 200, data.error);
  return {
    id: tournamentId,
    participantId: data.tournament.participant.id,
    token: data.tournament.participant.token,
    entry: data.tournament.participant.entry,
  };
}

async function tournamentState(player, access) {
  const query = new URLSearchParams({ participantId: access.participantId, token: access.token });
  return request(player, `/api/friendly-tournaments/${access.id}?${query}`);
}

async function setTournament(player, access, settings) {
  return request(player, `/api/friendly-tournaments/${access.id}/settings`, {
    method: "POST",
    body: JSON.stringify({ participantId: access.participantId, token: access.token, ...settings }),
  });
}

async function reportCurrentMatches(accessByPlayer, expectedRound) {
  const current = [];
  for (const [player, access] of accessByPlayer) {
    const { response, data } = await tournamentState(player, access);
    assert.equal(response.status, 200, data.error);
    assert.equal(data.tournament.round, expectedRound);
    if (data.currentMatch && !current.some((item) => item.match.id === data.currentMatch.id)) {
      current.push({ player, access, match: data.currentMatch });
    }
  }
  assert.ok(current.length >= 2, `${expectedRound}: plusieurs rencontres humaines doivent bloquer la journee`);
  for (let index = 0; index < current.length; index += 1) {
    const { player, access, match } = current[index];
    const winner = match.playerA === access.entry ? match.playerA : match.playerB;
    const { response, data } = await request(player, `/api/friendly-tournaments/${access.id}/matches/${match.id}/result`, {
      method: "POST",
      body: JSON.stringify({ participantId: access.participantId, token: access.token, winner, score: "6/3 - 6/4 - 6/2" }),
    });
    assert.equal(response.status, 200, data.error);
    if (index === 0) assert.equal(data.tournament.round, expectedRound, `${expectedRound} ne doit pas avancer apres un seul resultat`);
  }
}

function assertLeagueStandings(tournament) {
  for (const group of ["A", "B"]) {
    const rows = tournament.standings[group];
    assert.equal(rows.length, 4);
    for (const row of rows) {
      assert.equal(row.points, row.wins, "une victoire doit rapporter exactement 1 point");
      assert.equal(row.setDifference, row.setsWon - row.setsLost);
      assert.equal(row.gameDifference, row.gamesWon - row.gamesLost);
      assert.ok(Number.isFinite(row.worldRank));
    }
    for (let index = 1; index < rows.length; index += 1) {
      const previous = rows[index - 1];
      const current = rows[index];
      const correctlyOrdered = previous.points > current.points
        || (previous.points === current.points && previous.setDifference > current.setDifference)
        || (previous.points === current.points && previous.setDifference === current.setDifference && previous.gameDifference > current.gameDifference)
        || (previous.points === current.points && previous.setDifference === current.setDifference && previous.gameDifference === current.gameDifference && previous.worldRank <= current.worldRank);
      assert.equal(correctlyOrdered, true, "le classement LEAGUE doit respecter tous les departages");
    }
  }
}

const stamp = Date.now();
const admin = await register("julien.castagnoli@mediality.fr", "ADMIN");
const players = await Promise.all([
  register(`v123-a-${stamp}@example.test`, "Alpha"),
  register(`v123-b-${stamp}@example.test`, "Bravo"),
  register(`v123-c-${stamp}@example.test`, "Charlie"),
  register(`v123-d-${stamp}@example.test`, "Delta"),
]);
for (const player of players) await promote(admin, player);

const roomCreate = await request(players[0], "/api/lobby/rooms", {
  method: "POST",
  body: JSON.stringify({ characterId: "coachJu", targetSets: 2 }),
});
assert.equal(roomCreate.response.status, 201, roomCreate.data.error);
const roomDelete = await request(admin, `/api/lobby/rooms/${roomCreate.data.room.id}/admin-delete`, { method: "POST" });
assert.equal(roomDelete.response.status, 200, roomDelete.data.error);

const host = await createTournament(players[0]);
const guest1 = await joinTournament(players[1], host.id, "coachMax");
const guest2 = await joinTournament(players[2], host.id, "coachCarla");
const guest3 = await joinTournament(players[3], host.id, "coachClem");

const forbiddenSettings = await setTournament(players[1], guest1, { format: "league", targetSets: 3, distribution: "separated" });
assert.equal(forbiddenSettings.response.status, 403);
const configured = await setTournament(players[0], host, { format: "league", targetSets: 3, distribution: "separated" });
assert.equal(configured.response.status, 200, configured.data.error);

const kick = await request(players[0], `/api/friendly-tournaments/${host.id}/kick`, {
  method: "POST",
  body: JSON.stringify({ participantId: host.participantId, token: host.token, targetParticipantId: guest3.participantId }),
});
assert.equal(kick.response.status, 200, kick.data.error);
const kickedState = await tournamentState(players[3], guest3);
assert.equal(kickedState.response.status, 403);
assert.equal(kickedState.data.kicked, true);
const kickedRejoin = await request(players[3], `/api/lobby/friendly-tournaments/${host.id}/join`, {
  method: "POST",
  body: JSON.stringify({ characterId: "coachClem" }),
});
assert.equal(kickedRejoin.response.status, 403);

const start = await request(players[0], `/api/friendly-tournaments/${host.id}/start`, {
  method: "POST",
  body: JSON.stringify({ participantId: host.participantId, token: host.token }),
});
assert.equal(start.response.status, 200, start.data.error);
assert.equal(start.data.tournament.format, "league");
assert.equal(start.data.tournament.targetSets, 3);
assert.equal(start.data.tournament.matches.length, 15);
assert.equal(start.data.tournament.groups.A.length, 4);
assert.equal(start.data.tournament.groups.B.length, 4);
const humanCounts = ["A", "B"].map((group) => start.data.tournament.groups[group].filter((entry) => entry.type === "human").length).sort();
assert.deepEqual(humanCounts, [1, 2]);
const locked = await setTournament(players[0], host, { format: "classic", targetSets: 2, distribution: "random" });
assert.equal(locked.response.status, 409);

const activePlayers = [[players[0], host], [players[1], guest1], [players[2], guest2]];
await reportCurrentMatches(activePlayers, "group1");
const afterDay1 = (await tournamentState(players[0], host)).data.tournament;
assert.equal(afterDay1.round, "group2");
assertLeagueStandings(afterDay1);
await reportCurrentMatches(activePlayers, "group2");
const afterDay2 = (await tournamentState(players[0], host)).data.tournament;
assert.equal(afterDay2.round, "group3");
assertLeagueStandings(afterDay2);
await reportCurrentMatches(activePlayers, "group3");
const afterDay3 = (await tournamentState(players[0], host)).data.tournament;
assert.equal(afterDay3.round, "semi");
assertLeagueStandings(afterDay3);

const deletePlaying = await request(admin, `/api/lobby/friendly-tournaments/${host.id}/admin-delete`, { method: "POST" });
assert.equal(deletePlaying.response.status, 200, deletePlaying.data.error);

const classicHost = await createTournament(players[3]);
const classicGuest = await joinTournament(players[0], classicHost.id);
assert.equal((await setTournament(players[3], classicHost, { format: "classic", targetSets: 2, distribution: "separated" })).response.status, 200);
const classicStart = await request(players[3], `/api/friendly-tournaments/${classicHost.id}/start`, {
  method: "POST",
  body: JSON.stringify({ participantId: classicHost.participantId, token: classicHost.token }),
});
assert.equal(classicStart.response.status, 200, classicStart.data.error);
const humanQuarterIds = classicStart.data.tournament.matches
  .filter((match) => match.round === "quarter" && (match.playerAInfo?.type === "human" || match.playerBInfo?.type === "human"))
  .map((match) => match.id);
assert.equal(humanQuarterIds.length, 2);
assert.ok(humanQuarterIds.some((id) => ["qf1", "qf2"].includes(id)));
assert.ok(humanQuarterIds.some((id) => ["qf3", "qf4"].includes(id)));
assert.equal((await request(admin, `/api/lobby/friendly-tournaments/${classicHost.id}/admin-delete`, { method: "POST" })).response.status, 200);

const rankingHost = await createTournament(players[1]);
const rankingGuest = await joinTournament(players[2], rankingHost.id);
assert.equal((await setTournament(players[1], rankingHost, { format: "classic", targetSets: 3, distribution: "ranking" })).response.status, 200);
const rankingStart = await request(players[1], `/api/friendly-tournaments/${rankingHost.id}/start`, {
  method: "POST",
  body: JSON.stringify({ participantId: rankingHost.participantId, token: rankingHost.token }),
});
assert.equal(rankingStart.response.status, 200, rankingStart.data.error);
const rankingResponse = await request(players[1], "/api/ranking?page=1&pageSize=50&sort=points");
assert.equal(rankingResponse.response.status, 200, rankingResponse.data.error);
const rankById = new Map(rankingResponse.data.top.map((row) => [String(row.id), Number(row.rank)]));
const userIdByParticipant = new Map([
  [rankingHost.participantId, players[1].user.id],
  [rankingGuest.participantId, players[2].user.id],
]);
const quarterMatches = rankingStart.data.tournament.matches.filter((match) => match.round === "quarter");
const bracketSlots = quarterMatches.flatMap((match) => [match.playerA, match.playerB]);
const rankingKey = (entry) => String(entry).startsWith("human:")
  ? String(userIdByParticipant.get(String(entry).slice(6)))
  : `ai:${entry}`;
const seeds = [...bracketSlots].sort((entryA, entryB) => rankById.get(rankingKey(entryA)) - rankById.get(rankingKey(entryB)));
assert.deepEqual(bracketSlots, [seeds[0], seeds[7], seeds[4], seeds[3], seeds[2], seeds[5], seeds[6], seeds[1]]);
assert.equal((await request(admin, `/api/lobby/friendly-tournaments/${rankingHost.id}/admin-delete`, { method: "POST" })).response.status, 200);

console.log("v123 smoke test: OK");
