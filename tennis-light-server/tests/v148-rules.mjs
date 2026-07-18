import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(html, /Tennis Courts Academy <span>v148<\/span>/);
assert.match(html, /styles\.css\?v=148\.0/);
assert.match(html, /app\.js\?v=148\.0/);

const intelligenceContext = { Math: { random: () => 0.75 } };
vm.runInNewContext(`${functionSource(app, "drawRankedAiIntelligence")}; levels = Array.from({ length: 21 }, (_, index) => drawRankedAiIntelligence(index + 1));`, intelligenceContext);
assert.deepEqual(Array.from(intelligenceContext.levels), [
  "legend", "champion", "champion", "champion", "expert", "expert",
  "expert", "expert", "expert", "expert", "normal", "normal", "normal", "normal",
  "amateur", "amateur", "amateur", "amateur", "amateur", "amateur", "amateur",
]);

const badgeContext = {
  state: { tournament: { aiIntelligenceLevels: { ai20: "amateur" }, difficulty: "circuit" } },
  isHumanTournamentEntry: () => false,
  aiIntelligenceForEntry: () => "amateur",
};
vm.runInNewContext(`${functionSource(app, "aiIntelligenceBadgeMarkup")}; result = aiIntelligenceBadgeMarkup("ai20");`, badgeContext);
assert.equal(badgeContext.result, "");

const scoreContext = { Math: { random: () => 0.92, floor: Math.floor } };
vm.runInNewContext(`${functionSource(app, "randomMatchSetScoresForWinner")}; ${functionSource(app, "adminSimulatedSetScores")}; scores = adminSimulatedSetScores(0, 3);`, scoreContext);
assert.notDeepEqual(Array.from(scoreContext.scores, (score) => Array.from(score)), [[6, 2], [6, 3], [6, 4]]);
assert.equal(scoreContext.scores.filter(([gamesA, gamesB]) => gamesA > gamesB).length, 3);

const seedMarkupSource = functionSource(app, "tournamentSeedNumberMarkup");
assert.doesNotMatch(seedMarkupSource, /weekly/);
assert.match(app, /tournamentSeedNumbers: payload\.seedNumbers \|\| \{\}/);
assert.match(server, /seedNumbers: Object\.fromEntries/);

assert.match(server, /filter\(\(characterId\) => AI_SURFACE_PREFERENCES\[characterId\] === competition\.surface\)/);
assert.match(server, /filter\(\(characterId\) => AI_SURFACE_PREFERENCES\[characterId\] !== competition\.surface\)/);
assert.match(server, /slice\(0, 6\)/);
assert.match(server, /slice\(0, 4\)/);
assert.match(server, /slice\(0, 8\)/);
assert.match(server, /const bracketPositionOrder = \[1, 16, 9, 8, 5, 12, 13, 4, 3, 14, 11, 6, 7, 10, 15, 2\]/);
assert.match(server, /1 \+ \(seededRandom\([\s\S]*?:second-bonus/);
assert.match(server, /Math\.exp\(-\(strengthA - strengthB\) \/ 10\)/);
assert.match(server, /function simulatedAiIntelligence\(rankIa, seed = ""\)/);

assert.match(styles, /\.player-character-name\s*\{[\s\S]*?align-items: center;[\s\S]*?gap: 6px;/);
assert.match(styles, /\.played-visual\.history-card:hover\s*\{\s*transform: scale\(1\.45\);/);
assert.match(app, /function adjustCardMagnificationOrigins\(root = document\)/);

console.log("v148 RankIA global, tirages, simulations, têtes de série et interface: OK");
