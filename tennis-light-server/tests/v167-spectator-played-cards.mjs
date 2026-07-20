import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [html, app, styles, server] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../server.js", import.meta.url), "utf8"),
]);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=170\.7/);
assert.match(html, /app\.js\?v=170\.7/);
assert.match(app, /const CARD_ASSET_VERSION = "169"/);

assert.match(
  styles,
  /body\.spectator-mode \.game-app button:not\(#spectatorQuitButton\):not\(\[data-image-zoom\]\)\s*\{\s*display: none !important;/,
);
assert.match(styles, /body\.spectator-mode \.game-app \[data-image-zoom\]\s*\{\s*cursor: zoom-in;/);
assert.match(functionSource(app, "renderCardVisualOnly"), /data-image-zoom=/);
assert.match(functionSource(app, "renderCenterPlayedCard"), /state\.latestPlayedCard/);
assert.match(functionSource(app, "renderPlayedHistory"), /player\.played\.map/);

const quitButton = { disabled: false, matches: () => false };
const playedCardButton = { disabled: false, matches: (selector) => selector === "[data-image-zoom]" };
const actionButton = { disabled: false, matches: () => false };
const controlsContext = vm.createContext({
  document: { body: { classList: { toggle: () => {} } } },
  SPECTATOR_MODE: { enabled: true },
  els: {
    spectatorQuitButton: quitButton,
    gameApp: { querySelectorAll: () => [quitButton, playedCardButton, actionButton] },
  },
});
vm.runInContext(functionSource(app, "applySpectatorControls"), controlsContext);
vm.runInContext("applySpectatorControls()", controlsContext);
assert.equal(quitButton.disabled, false);
assert.equal(playedCardButton.disabled, false);
assert.equal(actionButton.disabled, true);

const sanitizerContext = vm.createContext({ JSON });
vm.runInContext(functionSource(server, "sanitizeFriendlySpectatorState"), sanitizerContext);
const sanitized = vm.runInContext(`sanitizeFriendlySpectatorState({
  players: [{ hand: [{ id: "secret" }], played: [{ id: "played-shot", uid: "played-1" }] }],
  latestPlayedCard: { id: "played-shot", uid: "played-1" },
  turnPlayedCards: [{ id: "played-shot", uid: "played-1" }],
  deck: [{ id: "deck-secret" }]
})`, sanitizerContext);
assert.equal(sanitized.players[0].hand[0].id, "spectator-hidden");
assert.equal(sanitized.players[0].played[0].id, "played-shot");
assert.equal(sanitized.latestPlayedCard.id, "played-shot");
assert.equal(sanitized.turnPlayedCards[0].id, "played-shot");
assert.equal(sanitized.deck.length, 0);

console.log("v169 visionnage: dernière carte, historique joué et loupe visibles sans commandes de jeu: OK");
