import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://localhost:3025";

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
    body: JSON.stringify({ email, password: "Test-v125!", nickname }),
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
      const publicMatch = data.tournament.matches.find((match) => match.id === data.currentMatch.id);
      current.push({ player, access, match: { ...publicMatch, ...data.currentMatch }, targetSets: data.tournament.targetSets });
    }
  }
  assert.ok(current.length >= 2, `${expectedRound}: plusieurs rencontres humaines doivent bloquer la journee`);
  for (let index = 0; index < current.length; index += 1) {
    const { player, access, match, targetSets } = current[index];
    const winner = match.playerA === access.entry ? match.playerA : match.playerB;
    const winnerSeat = winner === match.playerA ? 0 : 1;
    const winnerScores = Array.from({ length: Number(targetSets || 2) }, (_, setIndex) => (
      winnerSeat === 0 ? [6, 2 + setIndex] : [2 + setIndex, 6]
    ));
    const sharedState = match.humanVsHuman ? {
      players: [{ characterId: match.playerAInfo.characterId }, { characterId: match.playerBInfo.characterId }],
      activePlayer: winnerSeat,
      server: winnerSeat,
      tournament: { currentMatch: match.id },
      setMatch: {
        enabled: true,
        targetSets: Number(targetSets || 2),
        completedScores: winnerScores,
        score: winnerScores.at(-1),
        matchOver: true,
        matchWinner: winnerSeat,
      },
    } : null;
    const { response, data } = await request(player, `/api/friendly-tournaments/${access.id}/matches/${match.id}/result`, {
      method: "POST",
      body: JSON.stringify({
        participantId: access.participantId,
        token: access.token,
        winner,
        score: "6/3 - 6/4 - 6/2",
        state: sharedState,
      }),
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

function visibleSetCount(score) {
  return [...String(score || "").matchAll(/\d+\s*\/\s*\d+/g)].length;
}

function assertNoLeagueMatchCounted(tournament) {
  for (const group of ["A", "B"]) {
    for (const row of tournament.standings[group]) {
      assert.equal(row.played, 0, "un score IA partiel ne doit pas compter au classement");
      assert.equal(row.points, 0, "un vainqueur IA caché ne doit rapporter aucun point");
      assert.equal(row.setsWon + row.setsLost + row.gamesWon + row.gamesLost, 0);
    }
  }
}

const stamp = Date.now();
const admin = await register("julien.castagnoli@mediality.fr", "ADMIN");
const players = await Promise.all([
  register(`v125-a-${stamp}@example.test`, "Alpha"),
  register(`v125-b-${stamp}@example.test`, "Bravo"),
  register(`v125-c-${stamp}@example.test`, "Charlie"),
  register(`v125-d-${stamp}@example.test`, "Delta"),
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
const hiddenAiMatches = start.data.tournament.matches.filter((match) => (
  match.round === "group1" && match.playerAInfo?.type === "ai" && match.playerBInfo?.type === "ai"
));
assert.ok(hiddenAiMatches.length >= 1, "la première journée doit contenir au moins une rencontre IA");
for (const match of hiddenAiMatches) {
  assert.equal(match.score, null, "le score IA ne doit pas être affiché au lancement");
  assert.equal(match.winner, null, "le vainqueur IA ne doit pas être exposé au lancement");
  assert.equal(Object.hasOwn(match, "hiddenWinner"), false, "le résultat caché ne doit jamais sortir de l'API");
}
assertNoLeagueMatchCounted(start.data.tournament);

let progressReporter = null;
for (const [player, access] of activePlayers) {
  const stateResult = await tournamentState(player, access);
  const currentMatch = stateResult.data.tournament.matches.find((match) => match.id === stateResult.data.currentMatch?.id);
  if (currentMatch && !currentMatch.humanVsHuman) {
    progressReporter = { player, access, match: currentMatch };
    break;
  }
}
assert.ok(progressReporter, "un humain doit pouvoir publier l'avancement d'un set contre l'IA");
const publishHumanProgress = (completedScores) => request(
  progressReporter.player,
  `/api/friendly-tournaments/${progressReporter.access.id}/matches/${progressReporter.match.id}/live`,
  {
    method: "POST",
    body: JSON.stringify({
      participantId: progressReporter.access.participantId,
      token: progressReporter.access.token,
      liveScore: completedScores.map((score) => score.join("/")).join(" - "),
      state: { players: [], setMatch: { completedScores } },
    }),
  },
);

assert.equal((await publishHumanProgress([[6, 2]])).response.status, 200);
const afterFirstHumanSet = (await tournamentState(progressReporter.player, progressReporter.access)).data.tournament;
for (const hiddenMatch of hiddenAiMatches) {
  const revealedMatch = afterFirstHumanSet.matches.find((match) => match.id === hiddenMatch.id);
  assert.equal(visibleSetCount(revealedMatch.score), 1, "un set humain doit dévoiler exactement un set IA");
  assert.equal(revealedMatch.winner, null, "le vainqueur IA reste caché après un seul set");
}
assertNoLeagueMatchCounted(afterFirstHumanSet);

assert.equal((await publishHumanProgress([[6, 2]])).response.status, 200);
const afterDuplicateProgress = (await tournamentState(progressReporter.player, progressReporter.access)).data.tournament;
for (const hiddenMatch of hiddenAiMatches) {
  assert.equal(visibleSetCount(afterDuplicateProgress.matches.find((match) => match.id === hiddenMatch.id).score), 1, "un set déjà reçu ne doit pas être dévoilé deux fois");
}

assert.equal((await publishHumanProgress([[6, 2], [4, 6]])).response.status, 200);
const afterSecondHumanSet = (await tournamentState(progressReporter.player, progressReporter.access)).data.tournament;
for (const hiddenMatch of hiddenAiMatches) {
  const revealedMatch = afterSecondHumanSet.matches.find((match) => match.id === hiddenMatch.id);
  assert.equal(visibleSetCount(revealedMatch.score), 2, "le deuxième set humain doit dévoiler le deuxième set IA");
  assert.equal(revealedMatch.winner, null, "en trois sets gagnants, deux sets ne peuvent pas révéler le vainqueur IA");
}
assertNoLeagueMatchCounted(afterSecondHumanSet);
if (process.env.KEEP_AI_REVEAL === "1") {
  console.log(`v125 AI reveal: ${base}/?friendlyTournament=${progressReporter.access.id}&participant=${progressReporter.access.participantId}&token=${progressReporter.access.token}`);
  console.log("v125 AI reveal browser fixture: READY");
  process.exit(0);
}

await reportCurrentMatches(activePlayers, "group1");
const afterDay1 = (await tournamentState(players[0], host)).data.tournament;
assert.equal(afterDay1.round, "group2");
for (const hiddenMatch of hiddenAiMatches) {
  const completedAiMatch = afterDay1.matches.find((match) => match.id === hiddenMatch.id);
  assert.ok(completedAiMatch.winner, "le vainqueur IA doit être publié lorsque le score intégral est dévoilé");
  assert.ok(visibleSetCount(completedAiMatch.score) >= 3, "le score IA intégral doit être visible à la fin de la journée");
}
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
const classicAiQuarters = classicStart.data.tournament.matches.filter((match) => (
  match.round === "quarter" && match.playerAInfo?.type === "ai" && match.playerBInfo?.type === "ai"
));
assert.ok(classicAiQuarters.length >= 1);
for (const match of classicAiQuarters) {
  assert.equal(match.score, null, "le tableau CLASSIC ne doit pas dévoiler les scores IA au lancement");
  assert.equal(match.winner, null, "le tableau CLASSIC ne doit pas dévoiler les vainqueurs IA au lancement");
}
assert.equal(humanQuarterIds.length, 2);
assert.ok(humanQuarterIds.some((id) => ["qf1", "qf2"].includes(id)));
assert.ok(humanQuarterIds.some((id) => ["qf3", "qf4"].includes(id)));
assert.equal((await request(admin, `/api/lobby/friendly-tournaments/${classicHost.id}/admin-delete`, { method: "POST" })).response.status, 200);

let sharedDuel = null;
for (let attempt = 0; attempt < 40 && !sharedDuel; attempt += 1) {
  const duelHost = await createTournament(players[0]);
  const duelGuest = await joinTournament(players[1], duelHost.id, "coachMax");
  assert.equal((await setTournament(players[0], duelHost, { format: "classic", targetSets: 2, distribution: "random" })).response.status, 200);
  const duelStart = await request(players[0], `/api/friendly-tournaments/${duelHost.id}/start`, {
    method: "POST",
    body: JSON.stringify({ participantId: duelHost.participantId, token: duelHost.token }),
  });
  assert.equal(duelStart.response.status, 200, duelStart.data.error);
  const hostState = await tournamentState(players[0], duelHost);
  const guestState = await tournamentState(players[1], duelGuest);
  assert.equal(hostState.response.status, 200, hostState.data.error);
  assert.equal(guestState.response.status, 200, guestState.data.error);
  if (hostState.data.currentMatch?.id === guestState.data.currentMatch?.id) {
    sharedDuel = { host: duelHost, guest: duelGuest, hostState: hostState.data, guestState: guestState.data };
  } else {
    assert.equal((await request(admin, `/api/lobby/friendly-tournaments/${duelHost.id}/admin-delete`, { method: "POST" })).response.status, 200);
  }
}
assert.ok(sharedDuel, "le tirage aléatoire doit finir par produire un quart humain contre humain");
const sharedMatch = {
  ...sharedDuel.hostState.tournament.matches.find((match) => match.id === sharedDuel.hostState.currentMatch.id),
  ...sharedDuel.hostState.currentMatch,
};
assert.equal(sharedMatch.humanVsHuman, true);
assert.equal(sharedMatch.id, sharedDuel.guestState.currentMatch.id, "les deux humains doivent recevoir le même match");
const duelPlayers = [
  { player: players[0], access: sharedDuel.host, state: sharedDuel.hostState },
  { player: players[1], access: sharedDuel.guest, state: sharedDuel.guestState },
];
const playerAContext = duelPlayers.find((item) => item.access.entry === sharedMatch.playerA);
const playerBContext = duelPlayers.find((item) => item.access.entry === sharedMatch.playerB);
assert.ok(playerAContext && playerBContext);
assert.equal(playerAContext.state.currentMatch.session.seat, 0, "playerA doit conserver la place 0");
assert.equal(playerBContext.state.currentMatch.session.seat, 1, "playerB doit conserver la place 1");

const syncPath = `/api/friendly-tournaments/${sharedDuel.host.id}/matches/${sharedMatch.id}/state`;
const guestEarlyState = {
  players: [{ characterId: sharedMatch.playerAInfo.characterId }, { characterId: sharedMatch.playerBInfo.characterId }],
  activePlayer: 0,
  server: 0,
  tournament: { currentMatch: sharedMatch.id },
  setMatch: { enabled: true, targetSets: 2, completedScores: [], score: [0, 0], matchOver: false, matchWinner: null },
};
const guestEarly = await request(playerBContext.player, syncPath, {
  method: "POST",
  body: JSON.stringify({ participantId: playerBContext.access.participantId, token: playerBContext.access.token, baseRevision: 0, state: guestEarlyState }),
});
assert.equal(guestEarly.response.status, 409, "playerB ne doit pas créer une session concurrente");
if (process.env.KEEP_SHARED_DUEL === "1") {
  const participantUrl = (access) => `${base}/?friendlyTournament=${access.id}&participant=${access.participantId}&token=${access.token}`;
  console.log(`v125 shared player A: ${participantUrl(playerAContext.access)}`);
  console.log(`v125 shared player B: ${participantUrl(playerBContext.access)}`);
  console.log("v125 shared browser fixture: READY");
  process.exit(0);
}

const hostInit = await request(playerAContext.player, syncPath, {
  method: "POST",
  body: JSON.stringify({ participantId: playerAContext.access.participantId, token: playerAContext.access.token, baseRevision: 0, state: guestEarlyState }),
});
assert.equal(hostInit.response.status, 200, hostInit.data.error);
assert.equal(hostInit.data.revision, 1);
const guestReadQuery = new URLSearchParams({ participantId: playerBContext.access.participantId, token: playerBContext.access.token });
const guestRead = await request(playerBContext.player, `${syncPath}?${guestReadQuery}`);
assert.equal(guestRead.response.status, 200, guestRead.data.error);
assert.equal(guestRead.data.revision, 1);
assert.deepEqual(guestRead.data.state, guestEarlyState, "playerB doit lire exactement l'état créé par playerA");

const staleGuest = await request(playerBContext.player, syncPath, {
  method: "POST",
  body: JSON.stringify({ participantId: playerBContext.access.participantId, token: playerBContext.access.token, baseRevision: 0, state: guestEarlyState }),
});
assert.equal(staleGuest.response.status, 409, "un ancien état ne doit pas écraser la partie commune");

const finalSharedState = {
  ...guestEarlyState,
  activePlayer: 1,
  server: 1,
  setMatch: {
    enabled: true,
    targetSets: 2,
    completedScores: [[4, 6], [3, 6]],
    score: [3, 6],
    matchOver: true,
    matchWinner: 1,
  },
};
const finalResult = await request(playerBContext.player, `/api/friendly-tournaments/${sharedDuel.host.id}/matches/${sharedMatch.id}/result`, {
  method: "POST",
  body: JSON.stringify({
    participantId: playerBContext.access.participantId,
    token: playerBContext.access.token,
    winner: sharedMatch.playerA,
    score: "6/0 - 6/0",
    state: finalSharedState,
  }),
});
assert.equal(finalResult.response.status, 200, finalResult.data.error);
const recordedSharedMatch = finalResult.data.tournament.matches.find((match) => match.id === sharedMatch.id);
assert.equal(recordedSharedMatch.winner, sharedMatch.playerB, "le vainqueur doit provenir de la place gagnante dans l'état partagé");
assert.equal(recordedSharedMatch.score, "4/6 - 3/6", "le faux score envoyé séparément doit être ignoré");
assert.equal((await request(admin, `/api/lobby/friendly-tournaments/${sharedDuel.host.id}/admin-delete`, { method: "POST" })).response.status, 200);

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

console.log("v125 smoke test: OK");
