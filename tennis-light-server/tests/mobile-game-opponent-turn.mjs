import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, mobileApp, mobileStyles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

assert.match(app, /const GAME_VERSION = "v3\.11"/);
assert.match(html, /id="gameVersion">v3\.11</);
assert.match(html, /app\.js\?v=3\.11\.0/);
assert.match(app, /function mobilePlayedCardSummary\(card, playerIndex\)/);
assert.match(app, /if \(SERVER_SYNC\.enabled && Number\.isInteger\(SERVER_SYNC\.seat\)\) return SERVER_SYNC\.seat/);
assert.match(app, /cost: Number\(card\.costPaid \?\? card\.cost \?\? 0\)/);
assert.match(app, /power: Number\(card\.cardPowerGained \?\? card\.powerGained \?\? 0\)/);
assert.match(app, /placement = Number\(card\.turnEndPlacement \?\? card\.turnPlacement \?\? card\.placement \?\? 0\)/);
assert.match(app, /acknowledgeOpponentCard: acknowledgeMobileOpponentCard/);
assert.match(app, /currentCardId: state\.latestPlayedCard\?\.playedUid/);
assert.match(app, /synchronizedRevision: Number\(SERVER_SYNC\.revision \|\| 0\)/);
assert.match(app, /importSyncState\(data\.state\)/);

assert.match(app, /stopOpponentCard: localStorage\.getItem\("tennisLightMobileStopOpponentCard"\) !== "false"/);
assert.match(app, /function setMobileAssistance\(options = \{\}\)/);
assert.match(mobileApp, /function scheduleOpponentAutoContinue\(viewState\)/);
assert.match(mobileApp, /window\.setTimeout\(\(\) => \{[\s\S]*continueOpponentReveal\(button\);[\s\S]*\}, 1000\)/);
assert.match(mobileApp, /sessionStorage\.getItem\(ACKNOWLEDGED_OPPONENT_CARDS_KEY\)/);
assert.match(mobileApp, /data-mobile-opponent-reveal=/);
assert.match(mobileApp, /data-mobile-opponent-continue>Continuer/);
assert.match(mobileApp, /data-mobile-opponent-card/);
assert.match(mobileApp, /data-mobile-close-opponent-zoom/);
assert.match(mobileApp, /if \(!pendingOpponentReveal \|\| opponentRevealSequence \|\| button\.disabled\) return/);
assert.match(mobileApp, /animateCardBetween\(sceneImage, fromBounds, toBounds, 240, token\)/);
assert.match(mobileApp, /rememberAcknowledgedOpponentCard\(card\.id\)/);
assert.match(mobileApp, /acknowledgeOpponentCard\(card\.id\)/);
assert.match(mobileApp, /viewState\.phase === "OPPONENT_CARD_REVEAL"/);
assert.match(mobileApp, /interactionLocked \? "disabled" : ""/);
assert.doesNotMatch(mobileApp, /(?:^|[^.])\b(?:playCard|endTurn)\(/);

assert.match(mobileStyles, /\.mobile-scene--opponent-reveal/);
assert.match(mobileStyles, /\.mobile-opponent-continue\s*\{[\s\S]*min-height: 48px/);
assert.match(mobileStyles, /\.mobile-hand-section--disabled \.mobile-card-hand\s*\{[\s\S]*pointer-events: none/);
assert.match(mobileStyles, /@media \(max-width: 340px\)/);
assert.doesNotMatch(mobileStyles, /\.game-app\s/);

console.log("Présentation du tour adverse mobile : OK");
