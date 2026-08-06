import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} est introuvable`);
  const bodyStart = app.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} est incomplète`);
}

const sources = [
  "resolveUltimateReserveChoice",
  "continueUltimatePostExchangeDistribution",
  "completeUltimatePostExchangeDistribution",
  "ensureUltimateNextExchangeStarted",
  "startNextUltimateExchange",
].map(functionSource).join("\n");

function runScenario({ winner, reserveChoice, initialReserve = 0, legacyFlow = false }) {
  const cards = (prefix, count) => Array.from({ length: count }, (_, index) => ({ uid: `${prefix}-${index}`, name: `${prefix}-${index}`, power: index + 1 }));
  const state = {
    gameOver: true,
    activePlayer: 0,
    players: [
      { hand: [], reserve: cards("human-reserve", initialReserve), played: cards("human-played", 2) },
      { hand: [], reserve: [], played: cards("ai-played", 2) },
    ],
    ultimateDecks: [cards("human-deck", 8), cards("ai-deck", 8)],
    ultimateDiscards: [[], []],
    setMatch: { exchangeNumber: 4, setOver: false, matchOver: false },
    log: [],
  };
  const ULTIMATE_MODE = {
    active: true,
    postExchange: {
      winner,
      selectedReserveUid: null,
      phase: "reserve",
      distributionStarted: false,
      completed: false,
      completedExchangeNumber: 4,
    },
  };
  if (legacyFlow) {
    delete ULTIMATE_MODE.postExchange.phase;
    delete ULTIMATE_MODE.postExchange.distributionStarted;
    delete ULTIMATE_MODE.postExchange.completedExchangeNumber;
  }
  const calls = { draft: 0, newGame: 0, trim: 0 };
  const context = {
    state,
    ULTIMATE_MODE,
    SOLO_AI: { playerIndex: 1 },
    els: {
      ultimatePostExchangeDialog: { classList: { add() {} } },
      ultimateDraftDialog: { classList: { add() {} } },
    },
    window: { setTimeout(callback) { callback(); } },
    opponentOf: (index) => index === 0 ? 1 : 0,
    displayPlayerName: (_player) => "Joueur",
    ultimateReserveCandidates(playerIndex) { return state.players[playerIndex].played; },
    reserveUltimateCard(playerIndex, uid) {
      if (!uid) return false;
      const player = state.players[playerIndex];
      const card = player.played.find((candidate) => candidate.uid === uid);
      if (!card) return false;
      player.played = player.played.filter((candidate) => candidate.uid !== uid);
      player.reserve.push(card);
      return true;
    },
    drawCards(player, count) {
      const playerIndex = state.players.indexOf(player);
      const drawn = state.ultimateDecks[playerIndex].splice(0, count);
      player.hand.push(...drawn);
      return drawn.length;
    },
    ultimateDrawThree(playerIndex) { return state.ultimateDecks[playerIndex].splice(0, 3); },
    beginUltimateDraft() { calls.draft += 1; },
    openUltimateReserveTrimChoice() {
      calls.trim += 1;
      const removed = state.players[0].reserve.pop();
      state.ultimateDiscards[0].push(removed);
      context.continueUltimatePostExchangeDistribution();
    },
    nextSetServer: () => 1,
    maybeRunSoloAI() {},
    newGame() {
      calls.newGame += 1;
      state.gameOver = false;
      state.setMatch.exchangeNumber += 1;
      state.activePlayer = 1;
      ULTIMATE_MODE.postExchange = null;
    },
  };
  vm.createContext(context);
  vm.runInContext(`${sources}\nthis.resolveUltimateReserveChoice = resolveUltimateReserveChoice; this.continueUltimatePostExchangeDistribution = continueUltimatePostExchangeDistribution; this.completeUltimatePostExchangeDistribution = completeUltimatePostExchangeDistribution;`, context);
  context.resolveUltimateReserveChoice(reserveChoice ? "human-played-0" : null);
  if (winner === 0) {
    assert.equal(calls.draft, 1, "le vainqueur humain doit recevoir sa draft");
    context.completeUltimatePostExchangeDistribution();
  }
  assert.equal(calls.newGame, 1, "le nouvel échange doit démarrer exactement une fois");
  assert.equal(state.gameOver, false, "l'état de fin doit être levé");
  assert.equal(state.setMatch.exchangeNumber, 5, "le compteur d'échange doit avancer");
  assert.deepEqual(state.players.map((player) => player.played.length), [0, 0], "le plateau doit être vidé");
  assert.equal(state.players[winner === 0 ? 1 : 0].hand.length, 2, "le perdant doit piocher deux cartes");
  return calls;
}

runScenario({ winner: 0, reserveChoice: true });
runScenario({ winner: 0, reserveChoice: false });
runScenario({ winner: 1, reserveChoice: true });
runScenario({ winner: 1, reserveChoice: false });
const trimCalls = runScenario({ winner: 1, reserveChoice: true, initialReserve: 2 });
assert.equal(trimCalls.trim, 1, "une réserve de trois cartes doit passer par le choix de suppression");
runScenario({ winner: 0, reserveChoice: true, legacyFlow: true });

console.log("V5.15 Ultimate post-exchange scenarios passed.");
