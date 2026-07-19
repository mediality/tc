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

assert.match(html, /Tennis Courts Academy <span>v154<\/span>/);
assert.match(html, /styles\.css\?v=154\.0/);
assert.match(html, /app\.js\?v=154\.0/);

const humanEntry = "__human__";
const entries = Array(17).fill(null);
for (let position = 1; position <= 16; position += 1) entries[position] = `P${position}`;
entries[1] = humanEntry;
entries[7] = humanEntry;
const bonusContext = {
  entries,
  HUMAN_TOURNAMENT_ENTRY: humanEntry,
  Math: { random: () => 0.1 },
  randomSurfaceBonus: () => ({ id: "surface", label: "Surface" }),
  randomCircuitBonus: (excluded = []) => {
    const id = ["b1", "b2", "b3"].find((candidate) => !excluded.includes(candidate));
    return id ? { id, label: id } : null;
  },
  addCircuitBonus: (target, entry, bonus) => {
    if (entry && bonus) target[entry] = [...(target[entry] || []), bonus];
  },
};
vm.runInNewContext(
  `${functionSource("buildWeeklyCircuitProBonuses")}; result = buildWeeklyCircuitProBonuses(entries, [HUMAN_TOURNAMENT_ENTRY, "P2", "P3", "P4"], "hard", 3);`,
  bonusContext,
);
assert.equal(bonusContext.result.bonuses[humanEntry], undefined);
assert.equal(bonusContext.result.bonuses.P2.length, 3);
assert.equal(bonusContext.result.bonuses.P3.length, 1);
assert.equal(bonusContext.result.bonuses.P4.length, 1);

const headToHeadSource = functionSource("tournamentHeadToHeadBonus");
function headToHeadBonus(wins, losses, difficulty = "circuit") {
  const context = {
    AUTH_STATE: {
      profileUserId: "user-1",
      profile: { aiResults: [{ ai_character_id: "ai-1", wins, losses }] },
    },
    authenticatedUserId: () => "user-1",
    state: { tournament: { difficulty } },
  };
  vm.runInNewContext(`${headToHeadSource}; result = tournamentHeadToHeadBonus("ai-1");`, context);
  return context.result;
}

assert.equal(headToHeadBonus(9, 0), null);
assert.equal(headToHeadBonus(10, 0)?.target, "human");
assert.match(headToHeadBonus(10, 0)?.label || "", /Domination/);
assert.equal(headToHeadBonus(6, 0), null);
assert.match(headToHeadBonus(6, 0, "classic")?.label || "", /Ascendant/);
assert.equal(headToHeadBonus(0, 10)?.target, "ai");

const statusSource = functionSource("confrontationStatus");
const statusContext = {};
vm.runInNewContext(`${statusSource}; beforeTen = confrontationStatus(9, 0); atTen = confrontationStatus(10, 0);`, statusContext);
assert.notEqual(statusContext.beforeTen?.className, "domination");
assert.equal(statusContext.atTen?.className, "domination");

const matchSetupSource = functionSource("newGame");
assert.match(matchSetupSource, /humanInProCircuit/);
assert.match(matchSetupSource, /!humanInProCircuit && state\.tournament\.surfaceBonuses/);
assert.match(matchSetupSource, /!humanInProCircuit && state\.tournament\.permanentBonuses/);
assert.match(functionSource("buildTournamentPermanentBonuses"), /worldLeader !== HUMAN_TOURNAMENT_ENTRY/);

console.log("v152 bonus humains du circuit pro et seuil de domination: OK");
