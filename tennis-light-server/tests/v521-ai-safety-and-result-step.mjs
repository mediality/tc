import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");

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
  let canProgress = true;
  const context = {
    state: { activePlayer: 1 },
    hasPlayedThisTurn: () => true,
    soloLegalActionInventory: () => ({ canProgress }),
  };
  vm.createContext(context);
  vm.runInContext(`${functionSource("soloTurnIsBlocked")}\nthis.blocked = soloTurnIsBlocked;`, context);
  assert.equal(context.blocked(1), false, "un tour avec un REVERS légal ne doit jamais être déclaré bloqué");
  canProgress = false;
  assert.equal(context.blocked(1), true, "un tour réellement sans action doit être reconnu comme bloqué");
}

{
  const context = {
    state: { lastCard: { precision: 3 }, mandatoryPlacement: false },
    hasPlayedThisTurn: () => true,
    canEndTurn: () => true,
    turnEndPlacement: () => 3,
    requiredPlacementForLastCard: () => 3,
    canSoloFinishWithCoup: () => false,
  };
  vm.createContext(context);
  vm.runInContext(`${functionSource("shouldSoloClosePreparedPlacement")}\nthis.shouldClose = shouldSoloClosePreparedPlacement;`, context);
  assert.equal(context.shouldClose(1), true, "l'IA doit clôturer dès que le placement requis est atteint sans COUP utile");
  context.turnEndPlacement = () => 2;
  assert.equal(context.shouldClose(1), false, "l'IA doit continuer si le placement reste insuffisant");
}

assert.match(app, /watchedExchangeNumber[\s\S]*!== watchedExchangeNumber/);
assert.match(app, /data-start-ultimate-post-exchange/);
assert.match(css, /\.risky-play-button:not\(:disabled\)[\s\S]*background: #b93535/);

console.log("V5.21 AI safety, risk warning and result step checks passed.");
