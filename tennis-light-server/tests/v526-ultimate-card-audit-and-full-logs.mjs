import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const dataSource = fs.readFileSync(new URL("../public/ultimate-card-data.js", import.meta.url), "utf8");
const context = { window: {} };
vm.runInNewContext(dataSource, context);

const expected = {
  Conti: [
    [2,3,2,5,4,4],[3,3,4,3,4,6],[2,3,3,5,4,4],[4,6,5,4,7,5],[2,4,4,1,1,5],[2,2,2,3,4,4],
    [1,1,1,4,3,4],[1,1,1,4,4,4],[2,4,4,0,4,4],[1,2,4,0,3,4],[2,4,4,1,5,4],[2,2,3,3,1,5],
    [2,2,3,2,3,5],[2,4,4,0,5,4],[2,2,4,3,2,5],[2,3,1,3,4,4],[2,4,0,3,3,5],[1,1,3,2,4,4],
    [3,3,5,4,4,5],[1,3,2,2,2,4],[3,5,4,4,3,5],[3,4,3,5,4,5],[2,3,1,3,4,4],[1,2,0,4,2,4],
    [2,3,3,2,3,4],[3,5,4,4,5,5],[3,4,3,5,5,5],[2,4,0,3,4,4],[1,3,0,4,2,4],[2,3,3,3,4,4],
    [1,3,1,1,4,4],[1,3,3,0,4,4],[1,1,4,2,1,4],[1,3,0,2,4,4],[1,3,2,1,2,4],[1,1,3,3,1,4],
  ],
  Brentwood: [
    [2,3,0,3,5,5],[3,4,4,1,4,6],[3,5,1,4,4,4],[4,5,5,3,6,6],[2,4,4,0,3,5],[2,3,3,3,4,4],
    [1,2,1,4,2,4],[2,3,1,5,4,4],[3,5,3,0,4,4],[2,1,5,0,2,4],[3,4,5,2,5,4],[1,2,3,2,1,5],
    [2,2,3,4,3,5],[3,5,1,0,5,4],[2,2,5,2,2,5],[2,4,0,3,3,4],[2,3,0,3,4,5],[2,1,2,4,5,4],
    [3,3,5,3,4,5],[2,3,3,2,3,4],[3,5,4,2,3,5],[3,3,2,4,4,5],[2,2,4,3,3,4],[1,2,0,4,2,4],
    [2,4,2,0,3,4],[3,5,3,2,5,5],[3,3,3,4,5,5],[3,5,1,3,4,4],[1,2,0,4,2,4],[2,3,1,4,4,4],
    [1,2,4,1,3,4],[1,2,3,2,3,4],[2,2,1,4,4,4],[1,3,1,1,4,4],[1,2,4,1,2,4],[2,2,2,4,4,4],
  ],
};

for (const [player, values] of Object.entries(expected)) {
  const cards = context.window.ULTIMATE_CARD_DATA.filter((card) => card.player === player && card.type === "COUP");
  assert.equal(cards.length, 36, `${player} doit avoir 36 cartes COUP`);
  const actual = JSON.parse(JSON.stringify(cards.map((card) => [card.cost, card.power, card.precision, card.placement, card.boostPower, card.boostPrecision])));
  assert.deepEqual(actual, values);
}

assert.match(html, /Tennis Courts Academy · <span>V6\.6<\/span>/);
assert.match(html, /Tennis Courts Ultimate<\/strong><small>V5\.35/);
assert.match(app, /ULTIMATE_MATCH_LOG_STORAGE_KEY/);
assert.match(app, /function startUltimateMatchLog/);
assert.match(app, /match\.entries\.push\(entry\)/);
assert.doesNotMatch(app, /match\.entries\.slice/);
assert.match(app, /localDateTime/);
assert.match(app, /ultimateConditionalPowerCaps\.push/);
assert.doesNotMatch(app, /player\.ultimateConditionalPowerCaps = \[\]/);
assert.match(app, /cardPowerGained: stats\.power/);

console.log("V5.26 Ultimate card audit, persistent full-match logs and Lob constraint checks passed.");
