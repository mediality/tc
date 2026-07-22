import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDir, "..");
const appSource = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const engineSource = fs.readFileSync(path.join(root, "public/tutorial-engine.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const htmlSource = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

const declaration = "const TUTORIAL_MODULES = ";
const moduleStart = appSource.indexOf(declaration);
const moduleEnd = appSource.indexOf("\n\nconst TUTORIAL_ENGINE", moduleStart);
assert.ok(moduleStart >= 0 && moduleEnd > moduleStart, "La déclaration des modules doit rester extractible");
const moduleLiteral = appSource
  .slice(moduleStart + declaration.length, moduleEnd)
  .trim()
  .replace(/;$/, "");
const moduleContext = {};
vm.runInNewContext(`result = ${moduleLiteral}`, moduleContext);
const modules = moduleContext.result;
const module1 = modules.basics;

const engineContext = {};
vm.runInNewContext(engineSource, engineContext);
assert.equal(engineContext.TennisCourtsTutorialEngine.assertValidModules(modules), true);

assert.equal(module1.id, "module-1-basics");
assert.equal(module1.title, "Découverte de Tennis Courts Academy");
assert.equal(module1.scenario, "interface");
assert.equal(module1.readOnly, true);
assert.equal(module1.totalDisplaySteps, 8);
assert.equal(module1.steps.length, 8);
assert.deepEqual(Array.from(module1.steps, (step) => step.displayStep), [1, 2, 3, 4, 5, 6, 7, 8]);
assert.deepEqual(Array.from(module1.steps, (step) => step.title), [
  "Bienvenue",
  "Découverte du plateau",
  "Les compteurs",
  "Lecture d'une carte",
  "Les autres informations",
  "Les boutons",
  "Dernière carte et historique",
  "Conclusion",
]);
assert.ok(module1.steps.every((step) => !step.action && !step.validation && !step.auto));
assert.equal(module1.steps.at(-1).final, true);

const allDialogue = module1.steps.flatMap((step) => Array.isArray(step.text) ? step.text : [step.text]).join(" ");
for (const expectedText of [
  "deck unique de 18 cartes",
  "propre deck de 48 cartes",
  "Lorsque ton endurance est épuisée",
  "Précision et le Placement",
  "conditions de Boost",
  "journal d'échange",
  "jouer notre premier échange ensemble",
]) {
  assert.match(allDialogue, new RegExp(expectedText));
}

assert.deepEqual(
  Array.from(module1.steps[1].focus, (focus) => focus.target),
  ["character", "character", "lastCard"],
);
assert.deepEqual(
  Array.from(module1.steps[2].focus, (focus) => focus.target),
  ["power", "endurance"],
);
assert.equal(module1.steps[3].showcase.cardId, "revers-3-3-3");
assert.deepEqual(
  Array.from(module1.steps[3].showcase.pointers, (pointer) => pointer.target),
  ["cost", "power"],
);
assert.deepEqual(
  Array.from(module1.steps[4].showcase.pointers, (pointer) => pointer.target),
  ["precision", "placement", "effect", "boost"],
);
assert.deepEqual(
  Array.from(module1.steps[5].focus, (focus) => focus.target),
  ["play", "boost"],
);
assert.equal(module1.steps[5].dialoguePosition, "top");
assert.deepEqual(
  Array.from(module1.steps[6].focus, (focus) => focus.target),
  ["lastCard", "history"],
);
assert.equal(module1.steps[6].dialoguePosition, "top");

assert.match(appSource, /scenario === "interface"/);
assert.match(appSource, /state\.latestPlayedCard = createTutorialPlayedCard\("revers-3-3-3", 1\)/);
assert.match(appSource, /state\.lastCard = null/);
assert.match(appSource, /tutorialFocusClass\("character", playerIndex\)/);
assert.match(appSource, /tutorialFocusClass\("boost", playerIndex, card\.id\)/);
assert.match(appSource, /tutorialFocusClass\("lastCard", null\)/);
assert.match(appSource, /tutorialFocusClass\("history", null\)/);
assert.match(stylesSource, /body\.tutorial-readonly \.game-app button:not\(\.tutorial-next-button\)/);
assert.match(stylesSource, /body\.tutorial-interface-tour \.scoreboard/);
assert.match(htmlSource, /data-start-solo="exchange">Commencer l'entraînement<\/button>/);
assert.match(htmlSource, /data-start-tutorial data-required-role="admin"/);
assert.match(appSource, /querySelectorAll\("\[data-start-tutorial\]"\)/);

console.log("Module 1 conforme à la spécification documentaire : OK");
