import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [html, app] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
]);

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = app.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(html, /Tennis Courts Academy <span>v160<\/span>/);
assert.match(html, /styles\.css\?v=160\.0/);
assert.match(html, /app\.js\?v=160\.0/);

const progressionContext = {
  renderCenterNextSoloExchangeButton: () => "SOLO",
  renderCenterNextExchangeButton: () => "ECHANGE",
  renderCenterNextSetButton: () => "SET_OU_MATCH",
};
vm.runInNewContext(`${functionSource("renderProgressionButtons")}; result = renderProgressionButtons();`, progressionContext);
assert.equal(progressionContext.result, "SOLOECHANGESET_OU_MATCH");

assert.match(functionSource("renderResultPanel"), /renderProgressionButtons\(\)/);
assert.equal((functionSource("renderCenterPlayedCard").match(/renderProgressionButtons\(\)/g) || []).length, 2);
const bindingSource = functionSource("bindProgressionButtons");
for (const action of [
  "data-next-set-exchange",
  "data-next-solo-exchange",
  "data-next-full-set",
  "data-start-tournament-next-match",
  "data-exit-tournament",
  "data-return-club-house",
]) assert.match(bindingSource, new RegExp(action));
assert.match(functionSource("bindCenterButtons"), /bindProgressionButtons\(els\.centerPlayedCard\)/);
assert.match(functionSource("bindResultTournamentButton"), /bindProgressionButtons\(els\.resultPanel\)/);

const startMatchSource = functionSource("startMatchMode");
assert.ok(startMatchSource.indexOf("confrontationIntroActive = !state.tutorial.active") < startMatchSource.indexOf("newGame("));
const queuedIntroSource = functionSource("queueConfrontationIntro");
assert.ok(queuedIntroSource.indexOf("confrontationIntroActive = true") < queuedIntroSource.indexOf("window.setTimeout(showConfrontationIntro"));
assert.match(functionSource("showConfrontationIntro"), /state\.tutorial\.active[\s\S]*confrontationIntroActive = false/);
assert.match(functionSource("maybeRunSoloAI"), /confrontationIntroActive/);
assert.match(functionSource("runSoloAITurn"), /confrontationIntroActive/);
assert.match(functionSource("closeConfrontationIntro"), /confrontationIntroActive = false[\s\S]*maybeRunSoloAI\(\)/);

async function sha256(relativeUrl) {
  const bytes = await readFile(new URL(relativeUrl, import.meta.url));
  return createHash("sha256").update(bytes).digest("hex");
}

assert.equal(
  await sha256("../public/assets/cards/TC-result-Jonas-Falkenried-LOSE.jpg"),
  "da75d14e2fc838a7b4163653f0285509d59fb80f14cca068e51177b6ad28d527",
);
assert.equal(
  await sha256("../public/assets/cards/TC-result-Jonas-Falkenried-WIN.jpg"),
  "e39c2110130e54c2b6a305a43e3329aa15bdb9de4a1087d824c710ac5d4c5132",
);
assert.match(app, /jonasFalkenried:\s*\{[\s\S]*?win: "assets\/cards\/TC-result-Jonas-Falkenried-WIN\.jpg"[\s\S]*?lose: "assets\/cards\/TC-result-Jonas-Falkenried-LOSE\.jpg"/);

console.log("v155 boutons doublés, attente IA et images Falkenried: OK");
