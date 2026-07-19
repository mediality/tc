import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [html, app, styles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
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

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=169\.5/);
assert.match(html, /app\.js\?v=169\.5/);
assert.match(app, /const CARD_ASSET_VERSION = "169"/);

const intelligenceContext = vm.createContext({ SOLO_AI: { style: "legend" }, Math });
vm.runInContext([
  functionSource("normalizeAiIntelligence"),
  functionSource("aiRiskProjectionFactor"),
  functionSource("aiScoreNoise"),
].join("\n"), intelligenceContext);
assert.equal(vm.runInContext("aiRiskProjectionFactor()", intelligenceContext), 1.18);
assert.equal(vm.runInContext("aiScoreNoise(100)", intelligenceContext), 0);
vm.runInContext('SOLO_AI.style = "expert"', intelligenceContext);
assert.equal(vm.runInContext("aiRiskProjectionFactor()", intelligenceContext), 1);
vm.runInContext('SOLO_AI.style = "champion"', intelligenceContext);
assert.equal(vm.runInContext("aiRiskProjectionFactor()", intelligenceContext), 1.06);

const attitude = functionSource("chooseSoloAttitude");
assert.match(attitude, /intelligence === "legend"[\s\S]*Object\.entries\(weights\)\.sort/);
assert.match(attitude, /legend: \[1, 1\]/);
assert.match(attitude, /expert: \[2, 4\]/);
assert.match(attitude, /champion: \[1, 3\]/);

const reevaluation = functionSource("shouldReevaluateSoloAttitude");
assert.match(reevaluation, /legend: 1/);
assert.match(reevaluation, /expert: 0\.68/);
assert.match(reevaluation, /champion: 0\.82/);
assert.match(reevaluation, /intelligence === "legend" \|\| Math\.random\(\) < reevaluationChance/);

const punishment = functionSource("chooseSoloPunitiveContinuation");
assert.match(punishment, /const legendary = normalizeAiIntelligence\(SOLO_AI\.style\) === "legend"/);
assert.match(punishment, /passProjection\.matchClinched/);
assert.match(punishment, /const threshold = legendary[\s\S]*\? 0\.08/);

const passDecision = functionSource("canSoloPassAndWin");
assert.match(passDecision, /aiIntelligenceAtLeast\("expert"\)/);
assert.match(passDecision, /soloOpponentResponseProjection\(playerIndex\)\.risk > 0\.08/);

const scoredChoice = functionSource("chooseSoloScoredOption");
assert.match(scoredChoice, /expert: \[0\.92, 0\.08\]/);
assert.match(scoredChoice, /champion: \[1\]/);
assert.match(scoredChoice, /expert: 3, champion: 0, legend: 0/);

const scoreNoise = functionSource("aiScoreNoise");
assert.match(scoreNoise, /expert: 0\.8/);
assert.match(scoreNoise, /champion: 0\.15/);

const boostDecision = functionSource("chooseSoloBoostPlay");
assert.match(boostDecision, /const styleBoostMargin = legendary/);
assert.match(boostDecision, /const unsafeRiskThreshold = legendary/);
assert.match(boostDecision, /opponentEndThreat > 0 \? 0\.2 : 0\.28/);

assert.doesNotMatch(styles, /image-rendering: -webkit-optimize-contrast/);

console.log("v169 IA Légendaire déterministe, prudente sur les gains acquis et plus précise sur les boosts: OK");
