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

const diagnostics = [];
const currentCard = { uid: "current", playedUid: "p-current", ultimateOfficial: true, ultimateExchangeNumber: 2 };
const staleCard = { uid: "stale", playedUid: "p-stale", ultimateOfficial: true, ultimateExchangeNumber: 1 };
const context = {
  ULTIMATE_MODE: { active: true },
  SOLO_AI: { enabled: false, playerIndex: 0 },
  SERVER_SYNC: { enabled: true },
  state: {
    gameOver: false,
    activePlayer: 0,
    setMatch: { exchangeNumber: 2 },
    ultimateDiscards: [[], []],
    players: [
      { reserve: [{ uid: "r1" }, { uid: "r2" }, { uid: "r3" }], played: [staleCard, currentCard] },
      { reserve: [], played: [] },
    ],
  },
  canUseSeat: (playerIndex) => playerIndex === 0 && !context.SERVER_SYNC.enabled && context.SOLO_AI.playerIndex === 1,
  recordUltimateDiagnostic: (kind, payload) => diagnostics.push({ kind, payload }),
};
vm.createContext(context);
vm.runInContext(`${functionSource("auditUltimateRuntime")}\nthis.audit = auditUltimateRuntime;`, context);
const issues = context.audit("test");

assert.ok(issues.length >= 3, "les anomalies injectées doivent être détectées");
assert.equal(context.SERVER_SYNC.enabled, false);
assert.equal(context.SOLO_AI.enabled, true);
assert.equal(context.SOLO_AI.playerIndex, 1);
assert.equal(context.state.players[0].reserve.length, 2);
assert.deepEqual(context.state.players[0].played.map((card) => card.uid), ["current"]);
assert.ok(context.state.ultimateDiscards[0].some((card) => card.uid === "stale"));
assert.equal(diagnostics[0].kind, "ultimate_invariant_failure");

console.log("V5.18 Ultimate runtime audit checks passed.");
