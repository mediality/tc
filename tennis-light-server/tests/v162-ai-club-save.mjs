import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

function functionSource(name, nextName) {
  const start = app.indexOf(`function ${name}(`);
  const end = app.indexOf(`function ${nextName}(`, start + 1);
  assert.notEqual(start, -1, `${name} doit exister`);
  assert.notEqual(end, -1, `${nextName} doit suivre ${name}`);
  return app.slice(start, end);
}

const storage = new Map();
const localStorage = {
  getItem(key) {
    return storage.has(key) ? storage.get(key) : null;
  },
  setItem(key, value) {
    storage.set(key, String(value));
  },
  removeItem(key) {
    storage.delete(key);
  },
};

const context = vm.createContext({
  localStorage,
  AI_CLUB_HOUSE_SAVE_PREFIX: "tennisLightAiClubHouseSave",
  authenticatedUserId: () => "test-user",
  cloneData: (value) => JSON.parse(JSON.stringify(value)),
  state: {
    tournament: { aiClubHouse: true, stage: "round16" },
    log: Array.from({ length: 300 }, (_, index) => `Journal ${index}`),
    actionLog: Array.from({ length: 500 }, (_, index) => ({ index, payload: "x".repeat(200) })),
    turnSnapshot: {
      log: Array.from({ length: 100 }, (_, index) => `Tour ${index}`),
      actionLog: Array.from({ length: 100 }, (_, index) => ({ index })),
    },
  },
  SOLO_AI: { enabled: true, difficulty: "normal" },
});

vm.runInContext([
  functionSource("aiClubHouseSaveKey", "readAiClubHouseSave"),
  functionSource("readAiClubHouseSave", "compactAiClubHouseSaveState"),
  functionSource("compactAiClubHouseSaveState", "saveAiClubHouseProgress"),
  functionSource("saveAiClubHouseProgress", "resumeAiClubHouseSave"),
].join("\n"), context);

assert.equal(vm.runInContext("saveAiClubHouseProgress()", context), true);
const saved = JSON.parse(storage.get("tennisLightAiClubHouseSave:test-user"));
assert.equal(saved.state.tournament.aiClubHouse, true);
assert.equal(saved.state.log.length, 120);
assert.deepEqual(saved.state.actionLog, []);
assert.equal(saved.state.turnSnapshot.log.length, 40);
assert.deepEqual(saved.state.turnSnapshot.actionLog, []);
assert.equal(saved.humanMatchTelemetry, null);

assert.equal(vm.runInContext("saveAiClubHouseProgress()", context), false, "une sauvegarde existante ne doit pas être remplacée");
storage.clear();
vm.runInContext('state.tournament.stage = "complete"', context);
assert.equal(vm.runInContext("saveAiClubHouseProgress()", context), false, "une compétition terminée ne doit pas être sauvegardée");

console.log("v166 première sauvegarde amicale, limite à une sauvegarde et format compact: OK");
