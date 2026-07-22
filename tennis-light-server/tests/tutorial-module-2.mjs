import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDir, "..");
const appSource = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const htmlSource = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

const declaration = "const TUTORIAL_MODULES = ";
const moduleStart = appSource.indexOf(declaration);
const moduleEnd = appSource.indexOf("\n\nconst TUTORIAL_ENGINE", moduleStart);
const moduleLiteral = appSource.slice(moduleStart + declaration.length, moduleEnd).trim().replace(/;$/, "");
const context = {};
vm.runInNewContext(`result = ${moduleLiteral}`, context);
const module2 = context.result.guidedRally;

assert.equal(module2.id, "module-2-guided-rally");
assert.equal(module2.title, "Premier échange guidé");
assert.equal(module2.scenario, "guided-rally");
assert.equal(module2.totalDisplaySteps, 22);
assert.equal(module2.steps.length, 22);
assert.deepEqual(Array.from(module2.steps, (step) => step.displayStep), Array.from({ length: 22 }, (_, index) => index + 1));
assert.ok(module2.steps.every((step) => (step.focus?.length ?? 0) <= 1));
assert.ok(module2.steps.every((step) => {
  const dialogue = Array.isArray(step.text) ? step.text.join(" ") : step.text;
  return (dialogue.match(/[.!?](?:\s|$)/g) ?? []).length <= 2;
}), "Chaque séquence du Module 2 doit rester limitée à deux phrases");

assert.deepEqual(
  Array.from(module2.steps.filter((step) => step.action?.kind === "play"), (step) => step.action.cardId),
  ["service-coup-droit", "coup-droit-4-3-5", "revers-3-3-3"],
);
assert.deepEqual(
  Array.from(module2.steps.filter((step) => step.auto?.kind === "play"), (step) => step.auto.cardId),
  ["passing-1-1-4", "lob-2-0-4", "amortie-2-1-4"],
);
assert.equal(module2.steps.filter((step) => step.action?.kind === "selectCard").length, 3);
assert.equal(module2.steps.filter((step) => step.action?.kind === "pass").length, 1);
assert.equal(module2.steps.at(-1).final, true);

assert.match(appSource, /tutorialTypingDurationMs = Math\.min\(1800,/);
assert.match(appSource, /Date\.now\(\) - tutorialTypingStartedAt/);
assert.match(appSource, /scenario === "guided-rally"/);
assert.match(appSource, /state\.players\[0\]\.endurance = 7/);
assert.match(appSource, /tutorialFocusClass\("pass", playerIndex\)/);
assert.match(htmlSource, /data-start-tutorial="guidedRally" data-required-role="admin"/);
assert.match(appSource, /startTutorial\(button\.dataset\.startTutorial \|\| "basics"\)/);

console.log("Module 2 guidé, séquences courtes et animation sous deux secondes : OK");
