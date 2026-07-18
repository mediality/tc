import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = app.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(html, /styles\.css\?v=146\.2/);
assert.match(html, /app\.js\?v=146\.2/);

const attitudeContext = {
  state: {
    players: [
      { hand: [{ uid: "human-card" }], endurance: 5 },
      { hand: [{ uid: "ai-card" }], endurance: 5 },
    ],
  },
  SOLO_AI: { style: "amateur", planRevision: 0 },
  opponentOf: (index) => 1 - index,
  soloInitialHandProfile: () => ({
    strongShots: 0,
    boostPairs: 0,
    hasJoker: false,
    hasSuppression: false,
    hasDouble: false,
    totalCost: 3,
  }),
  soloOpponentExperience: () => ({
    sampleExchanges: 0,
    boostRate: 0,
    placementRiskRate: 0,
    jokerRate: 0,
    preparedDefenseRate: 0,
    aiBoostSuccessRate: 0.5,
  }),
  isSetDangerForPlayer: () => false,
  isMatchDangerForPlayer: () => false,
  isLateCircuitRoundWithoutBonus: () => false,
  weightedSoloChoice: () => "prudent",
  normalizeAiIntelligence: (level) => level,
};
vm.runInNewContext(`${functionSource("chooseSoloAttitude")}; result = chooseSoloAttitude(1);`, attitudeContext);
assert.equal(attitudeContext.result, "prudent");
assert.ok(attitudeContext.SOLO_AI.attitudeRevisionWindow >= 5);
assert.ok(attitudeContext.SOLO_AI.attitudeRevisionWindow <= 7);

for (const [functionName, amateurRule] of [
  ["shouldReevaluateSoloAttitude", /amateur: 0\.18/],
  ["chooseSoloPunitiveContinuation", /amateur: 0\.08/],
  ["aiScoreNoise", /amateur: 7/],
]) {
  assert.match(functionSource(functionName), amateurRule, `${functionName} doit gérer le niveau Amateur`);
}

const nextExchangeContext = {
  state: {
    gameOver: true,
    setMatch: { enabled: true, setOver: false, matchOver: false },
    log: [],
  },
  SERVER_SYNC: { enabled: false, isHost: true },
  nextSetServer: () => 1,
  newGame: (options) => { nextExchangeContext.newGameOptions = options; },
  markServerDirtyForHostAction: () => { nextExchangeContext.markedDirty = true; },
  render: () => {},
};
vm.runInNewContext(`${functionSource("nextSetExchange")}; nextSetExchange();`, nextExchangeContext);
assert.deepEqual({ ...nextExchangeContext.newGameOptions }, { preserveSet: true, serverOverride: 1 });
assert.equal(nextExchangeContext.markedDirty, true);

const nextSetContext = {
  state: {
    gameOver: true,
    setMatch: {
      enabled: true,
      score: [6, 3],
      completedScores: [[6, 3]],
      setOver: true,
      matchOver: false,
      targetSets: 2,
      setsWon: [1, 0],
    },
    log: [],
  },
  SERVER_SYNC: { enabled: false, isHost: true },
  newGame: (options) => { nextSetContext.newGameOptions = options; },
  markServerDirtyForHostAction: () => { nextSetContext.markedDirty = true; },
  render: () => { nextSetContext.rendered = true; },
};
vm.runInNewContext(`${functionSource("nextFullSet")}; nextFullSet();`, nextSetContext);
assert.equal(nextSetContext.state.setMatch.enabled, true);
assert.deepEqual(Array.from(nextSetContext.state.setMatch.score), [0, 0]);
assert.deepEqual(Array.from(nextSetContext.state.setMatch.setsWon), [1, 0]);
assert.equal(nextSetContext.newGameOptions.preserveSet, true);
assert.ok([0, 1].includes(nextSetContext.newGameOptions.serverOverride));
assert.equal(nextSetContext.markedDirty, true);
assert.equal(nextSetContext.rendered, true);

for (const launcher of ["startWeeklyCompetition", "startAiClubHouseCompetition"]) {
  const launcherSource = functionSource(launcher);
  const tournamentStart = Math.min(
    ...["startTournamentMode(", "startLeagueTournamentMode("].map((needle) => {
      const position = launcherSource.indexOf(needle);
      return position === -1 ? Number.POSITIVE_INFINITY : position;
    }),
  );
  assert.ok(tournamentStart < launcherSource.indexOf("showGameScreen()"), `${launcher} ne doit afficher le jeu qu'après son initialisation`);
  assert.match(launcherSource, /catch \(error\)/);
}

console.log("v143 cycle de vie des tournois: OK");
