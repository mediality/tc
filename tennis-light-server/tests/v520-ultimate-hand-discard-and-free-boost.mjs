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

{
  const response = { uid: "response", family: "Revers", cost: 2 };
  const sacrifice = { uid: "sacrifice", family: "Coup droit", cost: 1 };
  const player = { endurance: 7, hand: [response, sacrifice], reserve: [], freeBoostNext: true };
  const context = {
    state: {
      gameOver: false,
      activePlayer: 0,
      server: 1,
      mandatoryPlacement: true,
      mandatoryPlacementReason: "boost",
      boostAvailableFor: null,
      lastCard: { owner: 1, family: "Service", boosted: true },
      players: [player, { endurance: 7 }],
      ultimateDiscards: [[], []],
    },
    ULTIMATE_MODE: { active: false },
    canUseSeat: () => true,
    isRemise: () => false,
    effectiveCost: (_player, card) => card.cost,
    satisfiesFamilyLimit: () => true,
    satisfiesReturnServiceRestriction: () => true,
    satisfiesColorBoostCondition: () => false,
    isOpeningServeAvailable: () => false,
    isServiceBoostHintWindow: () => false,
    isNextEffectCanceledFor: () => false,
    opponentOf: (index) => index === 0 ? 1 : 0,
  };
  vm.createContext(context);
  vm.runInContext(`${functionSource("canPlayBoost")}\nthis.canPlayBoost = canPlayBoost;`, context);
  assert.equal(context.canPlayBoost(0, response), true, "Retour de service doit autoriser un contre-BOOST sans condition de couleur");
  player.freeBoostNext = false;
  assert.equal(context.canPlayBoost(0, response), false, "sans effet ni couleur, le contre-BOOST doit rester interdit");
}

{
  const sacrificed = { uid: "sacrifice" };
  const kept = { uid: "reserve" };
  const played = { uid: "played", sacrificedCard: sacrificed };
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${functionSource("ultimatePlayedCardsForDiscard")}\nthis.collect = ultimatePlayedCardsForDiscard;`, context);
  const discarded = context.collect({ reserve: [kept], played: [played, kept] });
  assert.equal(discarded.map((card) => card.uid).join(","), "played,sacrifice", "le coup joué et son sacrifice doivent rejoindre la défausse, contrairement à la réserve");
}

console.log("V5.20 hand, discard and free BOOST checks passed.");
