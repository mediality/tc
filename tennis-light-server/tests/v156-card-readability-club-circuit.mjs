import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

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

assert.match(html, /Tennis Courts Academy <span>v156<\/span>/);
assert.match(html, /styles\.css\?v=156\.0/);
assert.match(html, /app\.js\?v=156\.0/);

const readableContext = {
  card: { effect: "Bonus <important> & lisible" },
  escapeHtml: (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
};
vm.runInNewContext(`${functionSource("renderReadableCardEffect")}; result = renderReadableCardEffect(card, "test-effect");`, readableContext);
assert.match(readableContext.result, /readable-card-effect test-effect/);
assert.match(readableContext.result, /<strong>EFFET<\/strong>/);
assert.match(readableContext.result, /Bonus &lt;important&gt; &amp; lisible/);

assert.match(functionSource("renderCard"), /renderReadableCardEffect\(card, "hand-readable-effect"\)/);
assert.match(functionSource("renderCardVisualOnly"), /renderReadableCardEffect\(card, "played-readable-effect"\)/);
assert.match(functionSource("renderChoiceCardVisual"), /renderReadableCardEffect\(card, "choice-readable-effect"\)/);
assert.match(styles, /\.readable-card-effect\s*\{[\s\S]*font-size: clamp\(0\.82rem/);
assert.match(styles, /\.readable-card-effect\s*\{[\s\S]*font-weight: 780/);
assert.match(styles, /\.readable-card-effect > strong\s*\{[\s\S]*font-weight: 950/);

const clubUi = functionSource("renderAiClubHouse");
assert.match(clubUi, /button\.disabled = false/);
assert.doesNotMatch(clubUi, /AI_CLUB_HOUSE\.format = "tournament"/);
assert.doesNotMatch(functionSource("updateAiClubHouseSetting"), /difficulty === "circuit"/);
assert.match(functionSource("startAiClubHouseCompetition"), /if \(AI_CLUB_HOUSE\.format === "league"\)/);

const league = functionSource("startLeagueTournamentMode");
assert.doesNotMatch(league, /startTournamentMode/);
assert.match(league, /buildLeagueTournamentSetup/);
assert.match(league, /playerSelection: options\.players/);
assert.match(league, /distribution: leagueDistribution/);
assert.match(league, /buildAiClubHouseBonuses\(setup\.seededEntries, bonusLevel\)/);
assert.match(league, /buildTournamentAiIntelligenceLevels\(setup\.seededEntries, SOLO_AI\.difficulty, \{ humanLevel \}\)/);

const tournament = functionSource("startTournamentMode");
assert.match(tournament, /buildAiClubHouseClassicSetup/);
assert.match(tournament, /playerSelection: options\.players/);
assert.match(tournament, /distribution: options\.distribution/);
assert.match(tournament, /buildAiClubHouseBonuses\(positions, bonusLevel\)/);
assert.match(tournament, /buildTournamentAiIntelligenceLevels\(positions, SOLO_AI\.difficulty, \{ humanLevel \}\)/);
assert.doesNotMatch(tournament, /buildWeeklyCircuitProBonuses/);

assert.match(app, /circuit: "Circuit Pro · niveaux IA d'Amateur à Légende selon le RankIA et le niveau du joueur créateur\."/);

console.log("v156 lisibilité des effets et CLUB HOUSE Circuit Pro libre: OK");
