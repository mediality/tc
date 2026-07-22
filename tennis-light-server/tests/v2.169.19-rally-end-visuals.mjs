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

const accessControls = functionSource("updateAccessControls");
assert.match(accessControls, /hasInlineAdminContent/);
assert.match(accessControls, /!hasAdminAccess \|\| !hasInlineAdminContent/);
assert.match(css, /\.admin-panel:empty\s*\{\s*display: none/);

const authenticatedRefresh = functionSource("refreshAuthenticatedCircuitData");
assert.match(authenticatedRefresh, /canAccessProFeatures\(\)/);
assert.match(authenticatedRefresh, /loadRanking\(1\)/);
assert.doesNotMatch(functionSource("renderCharacterCard"), /Coach Max à jouer|ai-nudge-button|data-force-ai-turn/);
assert.doesNotMatch(css, /\.ai-nudge-button/);

const conditionContext = vm.createContext({ state: { resultInfo: null } });
vm.runInContext(`${functionSource("rallyEndConditionLabel")}\n${functionSource("rallyEndConditionClass")}`, conditionContext);
for (const [winType, expected] of [["boost", "rally-end-boost"], ["smash", "rally-end-effect"], ["power", "rally-end-points"]]) {
  conditionContext.state.resultInfo = { winType };
  assert.equal(vm.runInContext("rallyEndConditionClass()", conditionContext), expected);
}

const scoreContext = vm.createContext({ state: { resultInfo: {
  setMatch: { completedScores: [[6, 4], [3, 6]], score: [2, 1], setOver: false },
} } });
vm.runInContext(functionSource("rallyEndScoreMarkup"), scoreContext);
const scoreMarkup = vm.runInContext("rallyEndScoreMarkup()", scoreContext);
assert.match(scoreMarkup, /won-left[^>]*>6–4/);
assert.match(scoreMarkup, /won-right[^>]*>3–6/);
assert.match(scoreMarkup, /current[^>]*>2–1/);

const rallyState = functionSource("renderRallyState");
assert.match(rallyState, /rally-end-boost/);
assert.match(rallyState, /rallyEndScoreMarkup\(\)/);
assert.match(functionSource("rallyEndReasonLabel"), /Victoire aux Points/);
assert.match(functionSource("rallyEndReasonLabel"), /Victoire sur Boost/);
assert.match(functionSource("rallyEndReasonLabel"), /Victoire sur Effet/);
assert.doesNotMatch(rallyState, /<span>Condition<\/span>|<span>Échange suivant<\/span>|"Terminé"/);
assert.doesNotMatch(css, /\.rally-card\.completed\.rally-end-(?:boost|effect|points)\s*\{[^}]*background/);
assert.match(css, /\.rally-status-badge\.completed\.rally-end-boost\s*\{[^}]*background: #e2b52f/);
assert.match(css, /\.rally-status-badge\.completed\.rally-end-effect\s*\{[^}]*background: #75409e/);
assert.match(css, /\.rally-status-badge\.completed\.rally-end-points\s*\{[^}]*background: #087162/);
assert.match(css, /\.rally-card\.completed \.rally-full-log-button\s*\{[^}]*background: #e2e6e8/);
assert.match(css, /\.rally-card\.completed \.rally-end-score-values strong\.current\s*\{[^}]*color: #fff;[^}]*background: #087162/);
assert.match(html, /id="topProgressionActions"[^>]*>[\s\S]*id="returnLobbyButton"/);
assert.match(functionSource("renderModeButtons"), /topProgressionActions[\s\S]*renderRallyEndActions\(\)/);
assert.match(functionSource("renderCenterPlayedCard"), /center-progression-actions[\s\S]*renderRallyEndActions\(\)/);

console.log("v2.169.19 profil admin et fin d’échange enrichie: OK");
