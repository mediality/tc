import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDir, "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} doit exister`);
  let depth = 0;
  let opened = false;
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === "{") { depth += 1; opened = true; }
    if (source[index] === "}") depth -= 1;
    if (opened && depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Source incomplète pour ${name}`);
}

assert.equal(pkg.version, "3.15.0");
assert.match(html, /data-open-tutorial-modules data-required-role="admin"/);
assert.equal((html.match(/data-open-tutorial-modules/g) || []).length, 1);
assert.match(app, /closest\("\[data-open-tutorial-modules\]"\)/);
assert.match(functionSource(app, "showTutorialModulesScreen"), /tutorialModulesScreen\?\.classList\.remove\("hidden"\)/);
assert.match(functionSource(app, "startTutorial"), /if \(!TUTORIAL_MODULES\[selectedModuleId\]\)/);

const aiTurn = functionSource(app, "runSoloAITurn");
assert.match(aiTurn, /const legalInventory = soloLegalActionInventory\(playerIndex\)/);
assert.match(aiTurn, /!legalInventory\.canProgress && canSoloPassAndWin/);
assert.match(aiTurn, /!legalInventory\.canProgress && shouldSoloPassToLimitBoostDamage/);
assert.doesNotMatch(functionSource(app, "runAmateurSoloAITurn"), /amateur_early_pass/);
assert.match(functionSource(app, "soloLegalActionInventory"), /coups\.length \|\| boosts\.length \|\| effects\.length \|\| placementRemises\.length \|\| canEnd/);
assert.match(functionSource(app, "soloEmergencyFallback"), /inventory\.placementRemises/);

assert.match(app, /stat-value-row stat-value-power/);
assert.match(app, /stat-symbol-power[^>]*><\/span>/);
assert.match(app, /stat-value-row stat-value-endurance/);
assert.match(app, /stat-symbol-endurance[^>]*><\/span>/);
assert.match(css, /power-flash\.svg/);
assert.match(css, /endurance-heart\.svg/);
assert.match(css, /\.opponent-inline[\s\S]*?color: inherit !important/);
assert.match(app, /tennisLightAssistInformation/);
assert.match(app, /GAMEPLAY_ASSIST\.information \? "<span>Puissance<\/span>"/);
assert.match(app, /GAMEPLAY_ASSIST\.information \? "<span>Endurance<\/span>"/);
assert.match(app, /exchange-winner/);
assert.match(app, /world-rank-gold/);
assert.match(css, /\.character-power-reminder \.stat-symbol-power \{[\s\S]*?width: 29px/);
assert.match(css, /\.player-identity-panel\.active-turn/);
assert.doesNotMatch(app, /¡Que viva España!/);
assert.match(css, /width: 22px;[\s\S]*height: 22px;/);
assert.match(functionSource(app, "renderGameContextStrip"), /Niveau de l’IA/);

assert.match(css, /body \{ max-width: 100%; overflow-x: clip; \}/);
assert.match(css, /circuit-page-hero \.circuit-info-button \{ top: auto;/);
assert.match(css, /grid-template-columns: 38px minmax\(68px, 1fr\) repeat\(3, minmax\(42px, 52px\)\)/);

assert.match(app, /Le staff s’étoffe/);
assert.doesNotMatch(app, /s’etoffe|Verhaeghen|pays de coeur|vous entrainer/);

assert.match(functionSource(app, "renderCircuitDashboard"), /current\?\.points_rank \|\| current\?\.rank/);
assert.match(functionSource(server, "circuitWorldRankForUser"), /points_rank \|\| ranking\.currentUserRank\?\.rank/);

const capSource = functionSource(server, "aiHumanWinBonusCap");
const capContext = vm.createContext({ Math, Number });
vm.runInContext(`${capSource}; result = [aiHumanWinBonusCap(200, 500), aiHumanWinBonusCap(450, 500), aiHumanWinBonusCap(500, 500), aiHumanWinBonusCap(650, 500)]`, capContext);
assert.deepEqual(Array.from(capContext.result), [300, 50, 100, 100]);
assert.match(functionSource(server, "registerCircuitAiHumanWinBonuses"), /Math\.min\(300, wins \* 25\)/);

console.log("v2.169.28 assistance, identités, HUD SVG et retours visuels : OK");
