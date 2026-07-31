import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.27.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.27<\/span>/);

assert.match(app, /const answersBoost = state\.mandatoryPlacement && state\.mandatoryPlacementReason === "boost";/);
assert.match(app, /const boostWindow = answersBoost\s*\? colorBoost\s*:/);
assert.match(app, /state\.boostAvailableFor = !boosted && placementWasInsufficient \? opponentIndex : null;/);
assert.match(app, /const opensBoost = Boolean\(state\.lastCard && preparedPlacement < state\.lastCard\.precision && !state\.turnIgnoresPlacement\[playerIndex\]\);/);
assert.doesNotMatch(app, /if \(answeredBoostConstraint && !boosted\) \{\s*state\.turnCannotOpenBoost\[playerIndex\] = true;/);
assert.match(app, /const riskyPlayClass = placementIssue && !state\.mandatoryPlacement/);

const canPlayBoostStart = app.indexOf("function canPlayBoost(");
const canPlayBoostEnd = app.indexOf("\n}\n", canPlayBoostStart) + 2;
const canPlayBoostSource = app.slice(canPlayBoostStart, canPlayBoostEnd);
const boostContext = {
  state: {
    gameOver: false,
    activePlayer: 0,
    server: 1,
    mandatoryPlacement: true,
    mandatoryPlacementReason: "boost",
    boostAvailableFor: 0,
    players: [{ hand: [{ uid: "played" }, { uid: "sacrifice" }], freeBoostNext: true }],
  },
  canUseSeat: () => true,
  isRemise: () => false,
  isOpeningServeAvailable: () => false,
  isServiceBoostHintWindow: () => false,
  isNextEffectCanceledFor: () => false,
  satisfiesColorBoostCondition: () => false,
  canAfford: () => true,
  satisfiesFamilyLimit: () => true,
  satisfiesReturnServiceRestriction: () => true,
};
vm.runInNewContext(`${canPlayBoostSource}; result = canPlayBoost(0, { uid: "played", family: "Coup droit" });`, boostContext);
assert.equal(boostContext.result, false, "un contre-Boost sans condition de couleur doit rester interdit");
boostContext.satisfiesColorBoostCondition = () => true;
vm.runInNewContext("result = canPlayBoost(0, { uid: \"played\", family: \"Coup droit\" });", boostContext);
assert.equal(boostContext.result, true, "la couleur doit autoriser le contre-Boost et ignorer le placement");
boostContext.state.mandatoryPlacement = false;
boostContext.satisfiesColorBoostCondition = () => false;
vm.runInNewContext("result = canPlayBoost(0, { uid: \"played\", family: \"Coup droit\" });", boostContext);
assert.equal(boostContext.result, true, "le Boost ouvert par un placement insuffisant doit rester disponible");

assert.match(css, /--desktop-played-stack-height:[\s\S]*?desktop-played-row--player/);
assert.match(css, /desktop-played-row--opponent \.desktop-played-card:hover[\s\S]*?translateY\(10%\) scale\(1\.38\)/);
assert.match(css, /desktop-played-row:has\(\.desktop-played-card:hover\) \.desktop-played-viewport[\s\S]*?overflow: visible/);
assert.match(css, /object-position: center 20%/);
assert.match(css, /power-flash\.svg/);
assert.match(css, /visual-stat-icon--placement[\s\S]*?mask-size: 132%/);

console.log("Version 4.13 : règles de Boost et visibilité du plateau : OK");
