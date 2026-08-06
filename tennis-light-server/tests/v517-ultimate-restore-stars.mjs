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
  const state = { players: [], setMatch: { exchangeNumber: 3 }, log: [] };
  const player = {
    characterStarActive: false,
    characterSide: 0,
    endurance: 7,
    energy: 2,
    power: 0,
    played: [
      { family: "Service", star: true, removed: false, ultimateExchangeNumber: 2 },
      { family: "Coup droit", star: true, removed: false, ultimateExchangeNumber: 3 },
    ],
  };
  state.players = [player, { played: [] }];
  const context = {
    state,
    ULTIMATE_MODE: { active: true },
    STARTING_ENDURANCE: 7,
    isRemise: (card) => card.family === "Remise",
    openUltimateCharacterState() {},
    window: { setTimeout(callback) { callback(); } },
  };
  vm.createContext(context);
  vm.runInContext(`${functionSource("activateUltimateCharacterIfReady")}\nthis.activate = activateUltimateCharacterIfReady;`, context);
  assert.equal(context.activate(0), false, "une étoile ancienne et une étoile courante ne doivent pas activer le pouvoir");
  player.played.push({ family: "Revers", star: true, removed: false, ultimateExchangeNumber: 3 });
  assert.equal(context.activate(0), true, "deux étoiles visibles du même échange doivent activer le pouvoir");
}

{
  const state = { stale: true };
  const context = {
    state,
    SOLO_AI: {},
    ULTIMATE_MODE: { active: false, draftSelected: new Set(), turnSafetyTimer: 99, turnRecoveryTimer: 100 },
    HUMAN_MATCH_TELEMETRY: { active: null, forceNew: false },
    ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY: "unused",
    cloneData: (value) => JSON.parse(JSON.stringify(value)),
    resetTutorialMode() {},
    writeStoredJson() {},
  };
  const snapshot = {
    state: { players: [{ characterId: "alessandraConti", hand: [], played: [] }], setMatch: { exchangeNumber: 3 } },
    soloAi: { enabled: true, playerIndex: 1 },
    ultimateMode: { active: true, playerOrder: [0, 1], aiDifficulty: "expert", draftSelected: ["card-a"] },
  };
  vm.createContext(context);
  vm.runInContext(`${functionSource("restoreStateSnapshot")}\nthis.restore = restoreStateSnapshot;`, context);
  assert.equal(context.restore(snapshot), true);
  assert.equal(context.ULTIMATE_MODE.active, true, "le moteur Ultimate doit rester actif après rechargement");
  assert.equal(context.ULTIMATE_MODE.aiDifficulty, "expert");
  assert.deepEqual([...context.ULTIMATE_MODE.draftSelected], ["card-a"]);
  assert.equal(context.SOLO_AI.enabled, true);
  assert.equal(context.SOLO_AI.thinking, false);
  assert.equal(context.SOLO_AI.executing, false);
}

console.log("V5.17 Ultimate restore and star checks passed.");
