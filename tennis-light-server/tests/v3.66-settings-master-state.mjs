import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const mobile = fs.readFileSync(path.join(root, "public/mobile-game.js"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

assert.equal(pkg.version, "3.66.0");
assert.match(html, /Tennis Courts Academy · <span>v3\.66<\/span>/);
assert.doesNotMatch(html, />Assistance</);
assert.doesNotMatch(mobile, />Assistance</);
assert.match(html, /id="gameAssistButton"[^>]*>Paramètres<\/button>/);
assert.match(html, /id="gameCardDescriptionsToggle"[^>]*\/> Descriptif lisible des cartes/);

assert.match(app, /cardDescriptions:\s*localStorage\.getItem\("tennisLightCardDescriptions"\) === "true"/);
assert.match(app, /GAMEPLAY_ASSIST\.cardDescriptions \? `<section class="card-readable-data"/);
assert.match(app, /localStorage\.setItem\("tennisLightCardDescriptions", String\(GAMEPLAY_ASSIST\.cardDescriptions\)\)/);

const simulationStart = app.indexOf("function simulateAiTournamentMatch(");
const simulationEnd = app.indexOf("\nfunction onePointScorePriority(", simulationStart);
const simulation = app.slice(simulationStart, simulationEnd);
assert.doesNotMatch(simulation, /onePointRewards|surfaceBonuses|previousWinScores|recordOnePointMatchOutcome/);

const outcomeStart = app.indexOf("function recordOnePointMatchOutcome(");
const outcomeEnd = app.indexOf("\nfunction onePointResultPerformance(", outcomeStart);
const outcome = app.slice(outcomeStart, outcomeEnd);
assert.match(outcome, /ownScore === 3[\s\S]*opponentScore === 0[\s\S]*\? 2/);
assert.match(outcome, /ownScore === 2[\s\S]*opponentScore === 0[\s\S]*\? 1/);
assert.match(outcome, /:\s*0;/);
assert.match(outcome, /previousWinScores\[entry\] = onePointScorePriority/);

const priorityStart = app.indexOf("function onePointScorePriority(");
const priorityEnd = app.indexOf("\nfunction recordOnePointMatchOutcome(", priorityStart);
assert.deepEqual(
  [...app.slice(priorityStart, priorityEnd).matchAll(/"([0-3]-[0-3])": (\d)/g)].map((match) => [match[1], Number(match[2])]),
  [["3-0", 6], ["2-0", 5], ["2-1", 4], ["1-2", 3], ["0-2", 2], ["0-3", 1]],
);

const serverStart = app.indexOf("function onePointTournamentServer(");
const serverEnd = app.indexOf("\nfunction startLeagueTournamentMode(", serverStart);
const server = app.slice(serverStart, serverEnd);
assert.match(server, /scoreA === scoreB[\s\S]*Math\.random\(\)/);
assert.match(server, /scoreA > scoreB \? match\.playerA : match\.playerB/);

console.log("v3.66 : Paramètres, descriptif optionnel et état Récompense du 1 Point Master : OK");
