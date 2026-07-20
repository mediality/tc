import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const [html, app] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
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

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=169\.9/);
assert.match(html, /app\.js\?v=169\.9/);

function seedPermanentBonuses(randomValue) {
  const context = {
    HUMAN_TOURNAMENT_ENTRY: "__human__",
    Math: { random: () => randomValue },
    addPermanentBonus: (target, entry, bonus) => {
      if (entry && bonus) target[entry] = [...(target[entry] || []), bonus];
    },
  };
  vm.runInNewContext(
    `${functionSource("buildCircuitSeedPermanentBonuses")}; result = buildCircuitSeedPermanentBonuses(["IA1", HUMAN_TOURNAMENT_ENTRY, "IA3", "IA4"]);`,
    context,
  );
  return context.result;
}

const successfulDraw = seedPermanentBonuses(0.49);
assert.deepEqual(Object.keys(successfulDraw), ["IA1", "IA3", "IA4"]);
for (const bonuses of Object.values(successfulDraw)) {
  assert.equal(bonuses.length, 1);
  assert.equal(bonuses[0].precision, 1);
  assert.equal(bonuses[0].placement, 1);
}
assert.deepEqual(Object.keys(seedPermanentBonuses(0.5)), []);

const officialCircuit = functionSource("startWeeklyTournamentMode");
assert.match(officialCircuit, /buildTournamentRound16Positions/);
assert.match(officialCircuit, /buildWeeklyCircuitProBonuses\(positions, seedEntries, surface, humanLevel\)/);
assert.match(officialCircuit, /buildTournamentAiIntelligenceLevels\(positions, "circuit", \{ humanLevel \}\)/);
assert.match(officialCircuit, /buildCircuitSeedPermanentBonuses\(seedEntries\)/);

const clubHouseTournament = functionSource("startTournamentMode");
assert.match(clubHouseTournament, /buildAiClubHouseClassicSetup/);
assert.match(clubHouseTournament, /buildTournamentAiIntelligenceLevels\(positions, SOLO_AI\.difficulty, \{ humanLevel \}\)/);
assert.match(clubHouseTournament, /buildAiClubHouseBonuses\(positions, bonusLevel\)/);
assert.match(clubHouseTournament, /humanCircuitLevel: circuitIntelligence \? humanLevel/);

assert.doesNotMatch(functionSource("startLeagueTournamentMode"), /startTournamentMode/);
assert.match(functionSource("startAiClubHouseCompetition"), /AI_CLUB_HOUSE\.format === "league"/);
assert.match(functionSource("startAiClubHouseCompetition"), /isMatch[\s\S]*startMatchMode/);
assert.match(functionSource("renderAiClubHouse"), /data-pro-format/);
assert.match(functionSource("renderAiClubHouse"), /AI_CLUB_HOUSE\.format === "match"/);
assert.doesNotMatch(functionSource("updateAiClubHouseSetting"), /difficulty === "circuit"/);
assert.match(functionSource("renderFriendlyLobbyScreen"), /clubhouse-format-card/);
assert.match(functionSource("renderFriendlyLobbyScreen"), /Répartition des joueurs/);

const newGame = functionSource("newGame");
assert.match(newGame, /state\.tournament\.active && !state\.tournament\.aiClubHouse && !SERVER_SYNC\.enabled/);

console.log("v153 têtes de série IA et CLUB HOUSE Circuit Pro: OK");
