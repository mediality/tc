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
assert.equal(module1.totalDisplaySteps, 19);
assert.equal(module1.steps.length, 19);
assert.deepEqual(Array.from(module1.steps, (step) => step.displayStep), Array.from({ length: 19 }, (_, index) => index + 1));
assert.deepEqual(Array.from(module1.steps, (step) => step.title), [
  "Bienvenue",
  "Le deck de l'Académie",
  "Le jeu complet",
  "Ton personnage",
  "Ton adversaire",
  "La dernière carte",
  "La puissance",
  "L'endurance",
  "Une carte de jeu",
  "Le coût en endurance",
  "La puissance de la carte",
  "La précision",
  "Le placement",
  "L'effet",
  "La zone Boost",
  "Le bouton Jouer",
  "Le bouton Boost",
  "Le journal d'échange",
  "Conclusion",
]);
assert.ok(module1.steps.every((step) => !step.action && !step.validation && !step.auto));
assert.ok(module1.steps.every((step) => (step.focus?.length ?? 0) <= 1));
assert.ok(module1.steps.every((step) => !Array.isArray(step.showcase?.pointers)));
assert.ok(module1.steps.every((step) => {
  const dialogue = Array.isArray(step.text) ? step.text.join(" ") : step.text;
  return (dialogue.match(/[.!?](?:\s|$)/g) ?? []).length <= 2;
}), "Une micro-étape ne doit pas dépasser deux phrases");
assert.equal(module1.steps.at(-1).final, true);

const allDialogue = module1.steps.flatMap((step) => Array.isArray(step.text) ? step.text : [step.text]).join(" ");
for (const expectedText of [
  "deck unique de 18 cartes",
  "propre deck de 48 cartes",
  "Quand elle est épuisée",
  "même endurance que la carte",
  "sacrifier une autre carte",
  "journal d'échange",
  "premier échange",
]) {
  assert.match(allDialogue, new RegExp(expectedText));
}

assert.equal(module1.steps[8].showcase.cardId, "revers-3-3-3");
assert.deepEqual(Array.from(module1.steps.slice(9, 15), (step) => step.showcase.pointer), [
  "cost", "power", "precision", "placement", "effect", "boost",
]);
assert.deepEqual(Array.from(module1.steps.slice(15, 18), (step) => step.focus[0].target), [
  "play", "boost", "history",
]);

assert.match(appSource, /scenario === "interface"/);
assert.match(appSource, /state\.latestPlayedCard = createTutorialPlayedCard\("revers-3-3-3", 1\)/);
assert.match(appSource, /state\.lastCard = null/);
assert.match(appSource, /tutorialFocusClass\("character", playerIndex\)/);
assert.match(appSource, /tutorialFocusClass\("hand", playerIndex\)/);
assert.match(appSource, /tutorialFocusClass\("boost", playerIndex, card\.id\)/);
assert.match(appSource, /tutorialFocusClass\("lastCard", null\)/);
assert.match(appSource, /tutorialFocusClass\("history", null\)/);
assert.match(stylesSource, /body\.tutorial-readonly \.game-app button:not\(\.tutorial-next-button\)/);
assert.match(stylesSource, /body\.tutorial-interface-tour \.scoreboard/);
assert.match(appSource, /window\.setInterval[\s\S]*tutorialTypingProgress/);
assert.match(appSource, /if \(tutorialTypingProgress < tutorialTypingText\.length\)/);
assert.match(stylesSource, /\.tutorial-action-target::before/);
assert.doesNotMatch(stylesSource, /\.tutorial-focus-target::before/);
assert.match(htmlSource, /data-start-solo="exchange">Commencer l'entraînement<\/button>/);
assert.match(htmlSource, /data-start-tutorial data-required-role="admin"/);
assert.match(appSource, /querySelectorAll\("\[data-start-tutorial\]"\)/);

console.log("Module 1 conforme à la spécification documentaire : OK");
