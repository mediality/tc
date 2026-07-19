import assert from "node:assert/strict";
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

assert.match(html, /Tennis Courts Academy <span>v168<\/span>/);
assert.match(html, /styles\.css\?v=168\.0/);
assert.match(html, /app\.js\?v=168\.0/);

assert.doesNotMatch(app, /renderReadableCardEffect|readable-card-effect/);
assert.doesNotMatch(styles, /readable-card-effect|hand-readable-effect|played-readable-effect|choice-readable-effect/);
assert.match(functionSource("renderCard"), /card-image-zoom-trigger/);
assert.match(functionSource("renderCard"), /data-image-zoom="\$\{escapeHtml\(imageUrl\)\}"/);
assert.match(styles, /\.image-zoom-figure\s*\{[\s\S]*width: min\(731px, calc\(100vw - 42px\)\)/);
assert.match(styles, /\.image-zoom-figure img\[src\*="assets\/cards\/"\][^{]*\{[\s\S]*?width: auto;[\s\S]*?max-width: 100%/);
assert.match(styles, /\.card-image-zoom-trigger\s*\{[\s\S]*cursor: zoom-in/);
for (const removedScale of ["scale(1.42)", "scale(2.45)", "scale(2.7)", "scale(1.15)", "scale(1.45)"]) {
  assert.doesNotMatch(styles, new RegExp(removedScale.replace(/[().]/g, "\\$&")));
}

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

console.log("v168 cartes sans agrandissement pixellisé et CLUB HOUSE Circuit Pro libre: OK");
