import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [html, app, css, server] = await Promise.all([
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
assert.match(html, /styles\.css\?v=170\.5/);
assert.match(html, /app\.js\?v=170\.5/);
assert.match(app, /const CARD_ASSET_VERSION = "169"/);

const effectGuard = functionSource(app, "legendaryEffectSequenceIsUseful");
assert.match(effectGuard, /effect\.effectType !== "freeBoostNext"/);
assert.match(effectGuard, /!isFreeBoostNextWindow\(playerIndex\)/);
const effectContext = vm.createContext({
  state: { players: [{}, { endurance: 7, hand: [{ uid: "effect" }, { uid: "shot" }, { uid: "sacrifice" }] }] },
  effectiveCost: (_player, card) => card.cost || 1,
  isFreeBoostNextWindow: () => false,
});
vm.runInContext(effectGuard, effectContext);
assert.equal(vm.runInContext("legendaryEffectSequenceIsUseful(1, { uid: 'effect', effectType: 'freeBoostNext', cost: 1 }, { uid: 'shot', cost: 1 })", effectContext), false);
effectContext.isFreeBoostNextWindow = () => true;
assert.equal(vm.runInContext("legendaryEffectSequenceIsUseful(1, { uid: 'effect', effectType: 'freeBoostNext', cost: 1 }, { uid: 'shot', cost: 1 })", effectContext), true);
const effectPlayLock = functionSource(app, "canPlayEffectMode");
assert.match(effectPlayLock, /card\.effectType === "freeBoostNext" && !isFreeBoostNextWindow\(playerIndex\)/);
assert.match(functionSource(app, "playCard"), /remiseMode === "effect" && !canPlayEffectMode\(playerIndex, card\)/);
assert.match(functionSource(app, "renderCard"), /const effectModeAllowed = canPlayEffectMode\(playerIndex, card\)/);

const probability = functionSource(app, "probabilityAtLeastOneCard");
const unavailable = functionSource(app, "legendaryUnavailableCardIds");
const counterThreat = functionSource(app, "legendaryCounterBoostThreat");
const inventoryContext = vm.createContext({
  Math,
  CARD_LIBRARY: [
    { id: "lob", uid: "lob", family: "Lob", cost: 1, boostPrecision: 4 },
    { id: "smash", uid: "smash", family: "Smash", cost: 1, boostPrecision: 4 },
    { id: "forehand", uid: "forehand", family: "Coup droit", cost: 1, boostPrecision: 4 },
  ],
  COLOR_BOOST_RULES: { Smash: ["Lob"] },
  state: {
    lastCard: { precision: 3 },
    turnIgnoresPlacement: [false, false],
    turnCannotOpenBoost: [false, false],
    discardedCards: [],
    players: [
      { hand: [{ id: "a" }, { id: "b" }], endurance: 3, played: [], endBonuses: [] },
      { hand: [{ id: "lob", uid: "lob", family: "Lob", cost: 1, boostPrecision: 4 }], endurance: 5, played: [], endBonuses: [] },
    ],
  },
  isRemise: (card) => card.family === "Remise",
  opponentOf: (index) => index === 0 ? 1 : 0,
  totalTurnPlacement: () => 4,
  effectiveCost: (_player, card) => card.cost || 0,
  expertKnownOpponentCards: () => [],
  expertCanDefendBoostWithCards: () => false,
  playerEndThreatScore: () => 0,
  aiRiskProjectionFactor: () => 1,
  canFamilyBoostAfter: (previous, family) => ({ Smash: ["Lob"] })[family]?.includes(previous),
});
vm.runInContext(`${probability}\n${unavailable}\n${counterThreat}`, inventoryContext);
let threat = vm.runInContext("legendaryCounterBoostThreat(1, state.players[1].hand[0])", inventoryContext);
assert.equal(threat.placementExposure, false);
assert.equal(threat.colorExposure, true);
assert.equal(threat.remainingCounterCount, 1);
assert.equal(threat.probability, 1);
inventoryContext.state.players[0].played.push({ id: "smash" });
threat = vm.runInContext("legendaryCounterBoostThreat(1, state.players[1].hand[0])", inventoryContext);
assert.equal(threat.remainingCounterCount, 0);
assert.equal(threat.probability, 0);

const plan = functionSource(app, "buildLegendarySequencePlan");
assert.match(plan, /legendaryCounterBoostThreat\(playerIndex, card\)/);
assert.match(plan, /legendaryEffectSequenceIsUseful\(playerIndex, effect, coup\)/);
assert.match(plan, /counterBoostFamilies: threat\.byFamily/);
const passGuard = functionSource(app, "legendaryPassSafetyDecision");
assert.match(passGuard, /best\.counterBoostRemaining === 0/);

assert.match(server, /const PRO_REWARD_CHARACTER_IDS = \["milanVerhaegen"\]/);
assert.match(server, /role === "pro"\) return \[\.\.\.COACH_CHARACTER_IDS, \.\.\.PRO_REWARD_CHARACTER_IDS\]/);
assert.match(server, /role === "pro" && PRO_REWARD_CHARACTER_IDS\.includes\(characterId\)/);
assert.match(app, /const PRO_PROFILE_CHARACTER_OPTIONS = \[\.\.\.COACH_OPTIONS, "milanVerhaegen"\]/);
assert.match(app, /currentUserRole\(\) === "pro" \? PRO_PROFILE_CHARACTER_OPTIONS/);

const unlockContext = vm.createContext({
  COACH_CHARACTER_IDS: ["coachJu", "coachMax", "coachCarla", "coachClem"],
  PRO_REWARD_CHARACTER_IDS: ["milanVerhaegen"],
  ALL_PROFILE_CHARACTER_IDS: ["coachJu", "milanVerhaegen", "jonasFalkenried"],
  normalizeRole: (role) => role,
});
vm.runInContext(`${functionSource(server, "userUnlockedCharacters")}\n${functionSource(server, "canSelectCharacter")}`, unlockContext);
assert.equal(vm.runInContext("userUnlockedCharacters({ role: 'pro' }).includes('milanVerhaegen')", unlockContext), true);
assert.equal(vm.runInContext("canSelectCharacter({ role: 'pro' }, 'milanVerhaegen')", unlockContext), true);
assert.equal(vm.runInContext("canSelectCharacter({ role: 'free' }, 'milanVerhaegen')", unlockContext), false);

const announcement = "Bravo à Milan Verhaeghen, meilleur joueur de la semaine dernière. Pour fêter sa progression au classement, ce personnage est désormais débloqué et jouable. Pour l'utiliser, choisissez le depuis votre page profil. A bientôt sur les courts ! (signé - Coach Ju)";
assert.ok(app.includes(announcement));
assert.ok(server.includes(announcement));
assert.match(server, /ALTER TABLE users ADD COLUMN IF NOT EXISTS seen_news/);
assert.match(server, /\/api\\\/news\\\/\(\[\^\/\]\+\)\\\/seen/);
assert.doesNotMatch(app, /showNextProNewsDialog/);
assert.doesNotMatch(app, /function renderLatestNewsPanel\(\)/);
assert.match(app, /function showGameNewsDialog\(newsId\)/);
assert.match(app, /TC-new-Milan-Verhaegen\.webp/);
assert.match(css, /\.pro-news-modal/);
assert.match(css, /\.pro-news-card-frame/);
assert.match(css, /\.latest-news-panel/);

const newsContext = vm.createContext({
  PRO_ROLES: new Set(["pro", "pro_plus", "admin"]),
  GAME_NEWS: [{ id: "v166-milan-verhaegen-pro-unlock", audienceRoles: ["pro", "pro_plus", "admin"] }],
  normalizeRole: (role) => role,
});
vm.runInContext(`${functionSource(server, "seenNewsIds")}\n${functionSource(server, "pendingNewsForUser")}`, newsContext);
assert.equal(vm.runInContext("pendingNewsForUser({ role: 'pro', seenNews: '' }).length", newsContext), 1);
assert.equal(vm.runInContext("pendingNewsForUser({ role: 'pro', seenNews: 'v166-milan-verhaegen-pro-unlock' }).length", newsContext), 0);
assert.equal(vm.runInContext("pendingNewsForUser({ role: 'free', seenNews: '' }).length", newsContext), 0);

console.log("v169 inventaire de contre-boost Légende, Milan PRO et actualité persistante: OK");
