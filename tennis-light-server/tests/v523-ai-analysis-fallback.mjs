import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} est introuvable`);
  const bodyStart = app.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} est incomplète`);
}

{
  const calls = [];
  const context = {
    state: {
      players: [{ endurance: 7 }, {}],
      mandatoryPlacement: false,
      mandatoryPlacementSourceUid: null,
    },
    effectiveCost: (...args) => { calls.push(args); return 2; },
    removalTargetScore: () => 30,
  };
  vm.createContext(context);
  vm.runInContext(`${functionSource("isSoloRemovalWorthCost")}\nthis.evaluate = isSoloRemovalWorthCost;`, context);
  assert.equal(context.evaluate(0, { effectType: "removeOpponentLast" }, { playedUid: "target" }), true);
  assert.equal(calls[0][2], false, "une suppression en mode Effet doit être évaluée sans BOOST");
}

const aiTurn = functionSource("runSoloAITurn");
assert.match(aiTurn, /soloPrimitiveLegalFallback\(SOLO_AI\.playerIndex\)/);
assert.ok(
  aiTurn.indexOf("soloPrimitiveLegalFallback(SOLO_AI.playerIndex)")
    < aiTurn.lastIndexOf("forceSoloBlockedExchangeLoss(SOLO_AI.playerIndex)"),
  "la recherche directe d'un coup légal doit précéder toute clôture forcée",
);
assert.match(app, /function soloPrimitiveLegalFallback[\s\S]*primitive_legal_coup_after_error/);
assert.match(app, /primitive_legal_boost_after_error/);
assert.match(app, /ai_no_legal_action/);
assert.doesNotMatch(functionSource("isSoloRemovalWorthCost"), /effectiveCost\(player, card, boosted\)/);

console.log("V5.23 AI analysis and independent fallback checks passed.");
