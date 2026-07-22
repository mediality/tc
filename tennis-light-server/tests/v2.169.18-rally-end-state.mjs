import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const [html, app, css, pkg] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
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

assert.equal(JSON.parse(pkg).version, "2.169.25");
assert.match(app, /const GAME_VERSION = "v2\.169\.21"/);
assert.match(html, /Tennis Courts Academy · 2\.169\.21/);
assert.match(html, /styles\.css\?v=170\.18/);
assert.match(html, /app\.js\?v=170\.18/);

const resultPanel = functionSource("renderResultPanel");
assert.match(resultPanel, /classList\.add\("hidden"\)/);
assert.doesNotMatch(resultPanel, /Fin de l’échange|winner-dialog|renderProgressionButtons/);

const rallyState = functionSource("renderRallyState");
assert.match(rallyState, /rallyCard\?\.classList\.toggle\("completed", state\.gameOver\)/);
assert.match(rallyState, /Vainqueur/);
assert.match(rallyState, /Score/);
assert.doesNotMatch(rallyState, /<span>Condition<\/span>|<span>Échange suivant<\/span>/);
assert.match(rallyState, /renderRallyEndActions\(\)/);
assert.match(functionSource("renderCenterPlayedCard"), /renderRallyEndActions\(\)/);
assert.match(functionSource("renderEffectNotice"), /state\.gameOver \|\| !state\.effectNotice/);

const context = vm.createContext({ state: { resultInfo: null } });
vm.runInContext(`${functionSource("rallyEndConditionLabel")}\n${functionSource("rallyEndScoreMarkup")}`, context);
for (const [winType, expected] of [["power", "Points"], ["boost", "BOOST"], ["smash", "EFFET"]]) {
  context.state.resultInfo = { winType };
  assert.equal(vm.runInContext("rallyEndConditionLabel()", context), expected);
}
context.state.resultInfo = {
  winType: "power",
  setMatch: { completedScores: [[6, 4]], score: [2, 1], setOver: false },
};
const scoreMarkup = vm.runInContext("rallyEndScoreMarkup()", context);
assert.match(scoreMarkup, /won-left[^>]*>6–4/);
assert.match(scoreMarkup, /current[^>]*>2–1/);

assert.match(css, /\.rally-card\.completed[\s\S]*background: rgba\(248, 251, 249, \.96\)/);
assert.match(css, /\.rally-next-actions/);

console.log("v2.169.18 fin d’échange intégrée à l’état de l’échange: OK");
