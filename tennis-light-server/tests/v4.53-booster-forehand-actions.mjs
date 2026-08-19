import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

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

const familyContext = vm.createContext({ ULTIMATE_MODE: { active: false } });
vm.runInContext(functionSource(app, "cardFamilies"), familyContext);
vm.runInContext(functionSource(app, "cardHasFamily"), familyContext);
vm.runInContext(functionSource(app, "cardHasAnyFamily"), familyContext);
assert.equal(vm.runInContext("cardHasFamily({ id: 'service-coup-droit', family: 'Service' }, 'Service')", familyContext), true);
assert.equal(vm.runInContext("cardHasFamily({ id: 'service-coup-droit', family: 'Service' }, 'Coup droit')", familyContext), true);
assert.equal(vm.runInContext("cardHasFamily({ id: 'service-coup-droit', family: 'Service' }, 'Revers')", familyContext), false);

const boosterContext = vm.createContext({
  ULTIMATE_MODE: { active: false },
  state: {
    gameOver: false,
    activePlayer: 0,
    mandatoryPlacement: true,
    mandatoryPlacementReason: "boost",
    boostAvailableFor: null,
    players: [{ endurance: 5, freeBoostNext: true, hand: [{ uid: "shot" }, { uid: "sacrifice" }] }],
  },
  canUseSeat: () => true,
  isRemise: () => false,
  isOpeningServeAvailable: () => false,
  isServiceBoostHintWindow: () => false,
  isNextEffectCanceledFor: () => false,
  satisfiesColorBoostCondition: () => false,
  canAfford: () => true,
  effectiveCost: () => 0,
  satisfiesFamilyLimit: () => true,
  satisfiesReturnServiceRestriction: () => true,
});
vm.runInContext(functionSource(app, "canPlayBoost"), boosterContext);
assert.equal(
  vm.runInContext("canPlayBoost(0, { uid: 'shot', family: 'Coup droit' })", boosterContext),
  true,
  "l'EFFET booster doit autoriser la réponse au service ou retour boosté",
);

assert.match(app, /const boostWindow = answersBoost\s*\? player\.freeBoostNext \|\| colorBoost/);
assert.match(app, /cardHasAnyFamily\(card, families\)/);
assert.match(app, /!cardHasAnyFamily\(card, excludedFamilies\)/);
assert.match(app, /cardHasFamily\(previousShot, bonus\.afterFamily\)/);
assert.match(app, /playedCard\.family === "Coup droit" \|\| playedCard\.id === "service-coup-droit"/);

assert.match(app, /class="desktop-profile-bottom-spacer"/);
assert.match(css, /data-desktop-role="local"[^}]*\.desktop-profile-actions--local[\s\S]*bottom: calc\(100% \+ 40px\)/);
assert.match(css, /data-desktop-role="opponent"[^}]*\.desktop-profile-actions--opponent[\s\S]*top: calc\(100% \+ 40px\)/);
assert.match(css, /data-desktop-role="local"[^}]*\.desktop-profile-bottom-spacer[\s\S]*height: 38px/);

assert.equal(packageJson.version, "6.19.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.19<\/span>/);

console.log("V4.53 booster, Coup droit\/Service and desktop action tray checks passed.");
