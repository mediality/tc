import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDir, "..");
const engineSource = fs.readFileSync(path.join(root, "public/tutorial-engine.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const htmlSource = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const serverSource = fs.readFileSync(path.join(root, "server.js"), "utf8");

const context = {};
vm.runInNewContext(engineSource, context);
const engine = context.TennisCourtsTutorialEngine;

const modules = {
  foundations: {
    id: "foundations-v1",
    steps: [
      { id: "welcome", action: { kind: "play", playerIndex: 0, cardId: "service", mode: "normal", requiresSelection: true } },
      { id: "finish-rally", validation: { kind: "pass", playerIndex: 0 } },
    ],
  },
  advanced: {
    id: "advanced-v1",
    steps: [{ id: "advanced-start" }],
  },
};

assert.equal(engine.assertValidModules(modules), true);
assert.deepEqual(Array.from(engine.validateModules({})), ["Aucun module de tutoriel déclaré"]);
assert.match(engine.validateModules({ broken: { id: "broken", steps: [{ id: "same" }, { id: "same" }] } })[0], /dupliqué/);

let state = engine.createState({}, modules);
assert.equal(state.moduleId, "foundations-v1");
assert.equal(state.stepId, "welcome");
assert.equal(state.active, false);

state = engine.start(state, modules, "foundations");
assert.equal(state.moduleId, "foundations-v1");
assert.equal(engine.currentStep(state, modules).id, "welcome");
const prematureCompletion = engine.completeModule(state, modules);
assert.deepEqual(Array.from(prematureCompletion.completedModules), []);
assert.equal(prematureCompletion.active, true);
assert.equal(engine.validationMatches(engine.expectedValidation(state, modules), {
  kind: "play",
  playerIndex: 0,
  cardId: "service",
  mode: "normal",
  sacrificeCardId: "unused-extra-field",
}), true);
assert.equal(engine.validationMatches(engine.expectedValidation(state, modules), {
  kind: "play",
  playerIndex: 0,
  cardId: "other-card",
  mode: "normal",
}), false);

const validated = engine.validateAndAdvance(state, modules, {
  kind: "play",
  playerIndex: 0,
  cardId: "service",
  mode: "normal",
});
assert.equal(validated.matched, true);
state = validated.state;
assert.equal(state.stepId, "finish-rally");
assert.equal(state.stepIndex, 1);

const saved = engine.snapshot(state);
assert.deepEqual(Object.keys(saved).sort(), ["academyCompleted", "completedModules", "moduleId", "schemaVersion", "stepId"]);
assert.equal(saved.stepId, "finish-rally");
const renamedRegistry = { renamedFoundations: modules.foundations, advanced: modules.advanced };
assert.equal(engine.restore(saved, renamedRegistry).moduleId, "foundations-v1");
assert.equal(engine.restore(saved, renamedRegistry).stepId, "finish-rally");

const restoredLegacy = engine.restore({ moduleId: "foundations", stepIndex: 1, completed: true }, modules);
assert.equal(restoredLegacy.moduleId, "foundations-v1");
assert.equal(restoredLegacy.stepId, "finish-rally");
assert.equal(restoredLegacy.academyCompleted, true);
assert.equal(restoredLegacy.active, false);

state = engine.completeModule(state, modules);
assert.deepEqual(Array.from(state.completedModules), ["foundations-v1"]);
assert.equal(state.active, false);
assert.equal(state.academyCompleted, false);

state = engine.completeModule(engine.start(state, modules, "advanced"), modules, { academyCompleted: true });
assert.deepEqual(Array.from(state.completedModules), ["foundations-v1", "advanced-v1"]);
assert.equal(state.academyCompleted, true);
assert.equal(state.completed, true);

assert.ok(htmlSource.indexOf("tutorial-engine.js") < htmlSource.indexOf("app.js"));
assert.match(appSource, /const cost = effectiveCost\(player, card\);/);
assert.match(appSource, /const hasSacrifice = player\.hand\.some/);
assert.match(appSource, /if \(boosted && !sacrificeUid\)/);
assert.doesNotMatch(appSource, /boostCost/);
assert.match(appSource, /TUTORIAL_ENGINE\.snapshot\(state\.tutorial\)/);
assert.match(appSource, /\/api\/tutorial\/progress/);

assert.match(serverSource, /CREATE TABLE IF NOT EXISTS tutorial_progress/);
assert.match(serverSource, /url\.pathname === "\/api\/tutorial\/progress"/);
assert.match(serverSource, /function normalizeTutorialProgress/);

console.log("Moteur de tutoriel, progression, sauvegarde et contrat de coût du Boost : OK");
