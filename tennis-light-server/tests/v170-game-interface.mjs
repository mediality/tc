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

assert.match(html, /styles\.css\?v=170\.15/);
assert.match(html, /app\.js\?v=170\.15/);
assert.match(html, /id="gameContextStrip"/);
assert.match(html, /id="gameAssistPanel"/);
assert.match(html, /Prévisualiser les conséquences/);
assert.doesNotMatch(html, /Expliquer les actions indisponibles/);
assert.match(html, /Retour accueil/);

assert.match(app, /const GAMEPLAY_ASSIST/);
assert.match(app, /localStorage\.getItem\("tennisLightAssistPreview"\) === "true"/);
assert.doesNotMatch(app, /tennisLightAssistBlockedReasons|cardActionBlockReason/);
assert.match(functionSource("renderModeButtons"), /Retour Club House/);
assert.match(functionSource("confirmReturnToLobby"), /returnToClubHouse: true/);
assert.match(functionSource("leaveFriendlyTournamentLobby"), /if \(returnToClubHouse\)/);

const soloCountdown = functionSource("scheduleSoloTournamentMatch");
assert.match(soloCountdown, /let remaining = 3/);
assert.match(soloCountdown, /event-transition-countdown/);
assert.match(soloCountdown, /data-start-event-now/);
assert.match(functionSource("startTournamentNextMatchFromCenter"), /scheduleSoloTournamentMatch/);
const onlineCountdown = functionSource("scheduleFriendlyTournamentMatch");
assert.match(onlineCountdown, /event-transition-panel/);
assert.match(onlineCountdown, /data-start-friendly-now/);

assert.match(functionSource("renderFriendlyWaitingExperience"), /event-waiting-panel/);
assert.match(functionSource("startFriendlyTournamentFromLobby"), /showEventConfirmDialog/);
assert.match(functionSource("exitTournamentToLobby"), /showEventConfirmDialog/);

assert.match(functionSource("renderGameContextStrip"), /game-context-score/);
assert.match(functionSource("currentMatchStake"), /BALLE DE MATCH/);
assert.match(functionSource("currentMatchStake"), /BALLE DE SET/);
assert.match(functionSource("renderRallyState"), /rally-context-line stake/);
assert.match(functionSource("renderPlayerPanel"), /effect-chip/);
assert.match(functionSource("openEffectHelpDialog"), /effect-help-dialog/);
assert.match(functionSource("renderCardAssistPreview"), /Puissance après/);
assert.match(functionSource("renderCardAssistPreview"), /Endurance après/);
assert.match(functionSource("renderCardAssistPreview"), /Puissance BOOST/);
assert.match(functionSource("renderLog"), /Dernière action importante/);
assert.match(functionSource("renderActionLogEntry"), /actionLogCardThumbnail/);
assert.match(functionSource("renderResultPanel"), /classList\.add\("hidden"\)/);
assert.match(functionSource("renderRallyState"), /rally-result-grid/);

const competitions = functionSource("renderCompetitions");
assert.doesNotMatch(competitions, /Adversaire :/);

assert.match(styles, /\.player-panel\.active[\s\S]*box-shadow/);
assert.match(styles, /\.rally-context-line\.stake/);
assert.match(styles, /\.effect-chip/);
assert.match(styles, /\.card-assist-preview/);
assert.match(styles, /\.event-transition-panel/);
assert.match(styles, /\.event-waiting-panel/);
assert.match(styles, /\.game-context-strip/);
assert.match(styles, /\.action-log-card-thumbnail/);
assert.match(styles, /min-height: 44px/);
assert.match(styles, /\.action-log-backdrop \{ align-items: flex-end/);

console.log("v170.10 navigation, attentes et lisibilité de jeu: OK");
