import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

assert.match(app, /const effectSourceUid = characterEffectSourceUid\(playedCard\)/);
assert.match(app, /exchangePlacementSources\.push\(\{ sourceUid: effectSourceUid, value \}\)/);
assert.match(app, /exchangeFamilyPowerBonuses = \[\.\.\.\(player\.exchangeFamilyPowerBonuses \?\? \[\]\), bonus\]/);
assert.match(app, /endBonuses\.push\(\{ type: "doubleLastShot", sourceUid: effectSourceUid \}\)/);
assert.match(app, /playedUid: effectSourceUid \|\| sourceCard\.playedUid/);
assert.match(app, /resolutionPlayedUid: sourceCard\.playedUid/);
assert.match(app, /sourcePlayedUid: sourceCard\.resolutionPlayedUid \|\| sourceCard\.playedUid/);

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function: ${name}`);
  const bodyStart = app.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`unterminated function: ${name}`);
}

const context = {
  state: {
    players: [],
    log: [],
    latestPlayedCard: null,
    returnServiceRestrictionFor: null,
    mandatoryPlacementSourceUid: null,
    mandatoryPlacement: false,
    mandatoryPlacementReason: null,
    lastCard: null,
    boostAvailableFor: null,
  },
};

vm.createContext(context);
vm.runInContext(`
  ${functionSource("opponentOf")}
  ${functionSource("displayPlayerName")}
  ${functionSource("removeSourcedNextBonus")}
  ${functionSource("clearActiveEffectsFromRemovedCard")}
  ${functionSource("characterEffectSourceUid")}
  ${functionSource("removeOpponentPlayed")}
  this.rules = {
    clearActiveEffectsFromRemovedCard,
    characterEffectSourceUid,
    removeOpponentPlayed,
  };
`, context);

function player(overrides = {}) {
  return {
    name: "Player",
    nickname: "Player",
    power: 0,
    played: [],
    nextPowerCap: null,
    nextPowerCapSourceUid: null,
    nextPowerMultiplier: 1,
    nextPowerMultiplierSourceUid: null,
    nextPrecisionBonus: 0,
    nextPrecisionSources: [],
    nextPlacementBonus: 0,
    nextPlacementSources: [],
    nextAnyPlacementBonus: 0,
    nextAnyPlacementSources: [],
    nextDiscount: 0,
    nextDiscountSources: [],
    nextExtraCost: 0,
    nextExtraCostSources: [],
    exchangePrecisionBonus: 0,
    exchangePrecisionSources: [],
    exchangePlacementBonus: 0,
    exchangePlacementSources: [],
    exchangeFamilyPowerBonuses: [],
    exchangeAfterFamilyPlacementBonuses: [],
    placementPerOpponentLowPowerCardBonuses: [],
    protectedFromRemoval: false,
    protectedFromRemovalSourceUid: null,
    limitedFamilies: null,
    limitedFamiliesSourceUid: null,
    cancelNextOpponentEffect: false,
    cancelNextOpponentEffectSourceUid: null,
    freeBoostNext: false,
    freeBoostNextSourceUid: null,
    endBonuses: [],
    ...overrides,
  };
}

const starCard = { playedUid: "star-card-1", name: "Star card", star: true };
const starSourceUid = context.rules.characterEffectSourceUid(starCard);
assert.equal(starSourceUid, "star-card-1:star");

const owner = player({
  exchangePlacementBonus: 3,
  exchangePlacementSources: [
    { sourceUid: starCard.playedUid, value: 2 },
    { sourceUid: starSourceUid, value: 1 },
  ],
  exchangeFamilyPowerBonuses: [
    { sourceUid: starCard.playedUid, value: 2 },
    { sourceUid: starSourceUid, value: 1 },
  ],
  endBonuses: [
    { sourceUid: starCard.playedUid, type: "boostedBonus" },
    { sourceUid: starSourceUid, type: "doubleLastShot" },
  ],
});
context.state.players = [owner, player()];
context.rules.clearActiveEffectsFromRemovedCard(starCard);

assert.equal(owner.exchangePlacementBonus, 1, "the printed ongoing effect must be removed");
assert.deepEqual(JSON.parse(JSON.stringify(owner.exchangePlacementSources)), [{ sourceUid: starSourceUid, value: 1 }]);
assert.deepEqual(JSON.parse(JSON.stringify(owner.exchangeFamilyPowerBonuses)), [{ sourceUid: starSourceUid, value: 1 }]);
assert.deepEqual(JSON.parse(JSON.stringify(owner.endBonuses)), [{ sourceUid: starSourceUid, type: "doubleLastShot" }]);

const removedCard = {
  playedUid: "powered-card-1",
  name: "Powered card",
  owner: 0,
  power: 3,
  boostPower: 5,
  boosted: false,
  basePowerGained: 3,
  cardPowerGained: 6,
  powerGained: 6,
  removed: false,
};
const poweredOwner = player({ power: 10, played: [removedCard] });
context.state.players = [poweredOwner, player()];
context.state.latestPlayedCard = null;
context.state.log = [];
context.rules.removeOpponentPlayed(0, removedCard.playedUid);

assert.equal(poweredOwner.power, 7, "only the printed power must be removed");
assert.equal(removedCard.removed, true);
assert.match(context.state.log[0], /bonus.*acquis.*appliqu/i);

console.log("v142 removal rules: OK");
