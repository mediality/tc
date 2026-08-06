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

function coordinatorScenario({ signatureChanges = false } = {}) {
  const timers = [];
  const calls = { maybe: 0, watchdog: 0, force: 0 };
  let signature = "exchange-3-ai-turn";
  const context = {
    ULTIMATE_MODE: { active: true, markChoice: null, turnSafetyTimer: null, turnRecoveryTimer: null },
    SOLO_AI: { playerIndex: 1, thinking: true, executing: true },
    state: { gameOver: false, activePlayer: 1, setMatch: { exchangeNumber: 3 }, log: [] },
    window: {
      clearTimeout() {},
      setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; },
    },
    soloTurnSignature: () => signature,
    maybeRunSoloAI: () => { calls.maybe += 1; },
    scheduleSoloAIWatchdog: () => { calls.watchdog += 1; },
    forceSoloAITurn: () => { calls.force += 1; },
  };
  vm.createContext(context);
  vm.runInContext(`${functionSource("secureUltimateTurnContinuation")}\nthis.secureUltimateTurnContinuation = secureUltimateTurnContinuation;`, context);
  context.secureUltimateTurnContinuation(0);
  assert.deepEqual(timers.map((timer) => timer.delay), [60, 4500]);
  timers.find((timer) => timer.delay === 60).callback();
  assert.equal(context.SOLO_AI.thinking, false, "un verrou de réflexion périmé doit être libéré");
  assert.equal(context.SOLO_AI.executing, false, "un verrou d'exécution périmé doit être libéré");
  assert.equal(calls.maybe, 1, "l'IA doit être déclenchée après le tour humain");
  assert.equal(calls.watchdog, 1, "le chien de garde doit être armé");
  if (signatureChanges) signature = "exchange-3-ai-progressed";
  timers.find((timer) => timer.delay === 4500).callback();
  assert.equal(calls.force, signatureChanges ? 0 : 1, "la relance forte ne doit intervenir que sans progression");
}

coordinatorScenario();
coordinatorScenario({ signatureChanges: true });

console.log("V5.16 Ultimate turn continuation checks passed.");
