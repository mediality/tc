import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [app, mobileApp, mobileStyles] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

assert.match(app, /function mobileResolutionValues\(playerIndex\)/);
assert.match(app, /function mobileResolutionDeltas\(before, after\)/);
assert.match(app, /function mobileNewResolutionMessages\(previousFirstLog\)/);
assert.match(app, /const before = mobileResolutionValues\(playerIndex\)/);
assert.match(app, /playCard\(playerIndex, card\.uid, false, null, mode\)/);
assert.match(app, /const after = mobileResolutionValues\(playerIndex\)/);
assert.match(app, /resolutionId: resolvedCard\?\.playedUid/);
assert.match(app, /deltas: mobileResolutionDeltas\(before, after\)/);
assert.match(app, /synchronizedRevision: Number\(SERVER_SYNC\.revision \|\| 0\)/);

const deltaFunctionSource = app.match(/function mobileResolutionDeltas\(before, after\) \{[\s\S]*?^}/m)?.[0];
assert.ok(deltaFunctionSource);
const calculateDeltas = vm.runInNewContext(`(${deltaFunctionSource})`);
assert.deepEqual(
  JSON.parse(JSON.stringify(calculateDeltas(
    {
      player: { power: 3, endurance: 5, handCount: 4 },
      opponent: { power: 2, endurance: 4, handCount: 5 },
    },
    {
      player: { power: 7, endurance: 3, handCount: 3 },
      opponent: { power: 2, endurance: 5, handCount: 4 },
    },
  ))),
  [
    { side: "player", metric: "power", label: "Puissance", delta: 4, value: 7 },
    { side: "player", metric: "endurance", label: "Endurance", delta: -2, value: 3 },
    { side: "player", metric: "handCount", label: "Cartes", delta: -1, value: 3 },
    { side: "opponent", metric: "endurance", label: "Endurance", delta: 1, value: 5 },
    { side: "opponent", metric: "handCount", label: "Cartes", delta: -1, value: 4 },
  ],
);

assert.match(mobileApp, /if \(resolutionSequence \|\| playButton\.disabled \|\| !viewState\.selectedCardId\) return/);
assert.match(mobileApp, /setResolutionLock\(true\)/);
assert.match(mobileApp, /window\.tennisLightMobileAdapter\?\.playSelectedCard\(\)/);
assert.match(mobileApp, /animateCardBetween\(selectedImage, fromBounds, targetBounds, 320, token\)/);
assert.match(mobileApp, /waitForResolutionStep\(700, token\)/);
assert.match(mobileApp, /animateCardBetween\(sceneImage, sceneCardBounds, lastBounds, 240, token\)/);
assert.match(mobileApp, /resolutionSequence = null;\s*setResolutionLock\(false\);\s*renderMobileGame\(true\)/);
assert.match(mobileApp, /prefers-reduced-motion: reduce/);
assert.match(mobileApp, /window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/);
assert.match(mobileApp, /get\("reduceMotion"\) === "1"/);
assert.match(mobileApp, /resolutionSequenceToken \+= 1/);
assert.match(mobileApp, /if \(resolutionSequence && !force\) return/);
assert.match(mobileApp, /window\.addEventListener\("tennis-light:match-render", \(\) => renderMobileGame\(false\)\)/);
assert.match(mobileApp, /data-mobile-last-card/);
assert.match(mobileApp, /data-mobile-close-card-zoom/);

assert.match(mobileStyles, /\.mobile-resolution-flyer\s*\{[\s\S]*will-change: transform, opacity/);
assert.match(mobileStyles, /@keyframes mobile-value-delta/);
assert.match(mobileStyles, /\.mobile-value-delta\s*\{[\s\S]*700ms ease-out/);
assert.match(mobileStyles, /\.mobile-resolution-locked button\s*\{[\s\S]*pointer-events: none/);
assert.match(mobileStyles, /\.mobile-last-card-button\s*\{[\s\S]*min-height: 52px/);
assert.doesNotMatch(mobileStyles, /\.game-app\s/);

console.log("Mise en scène et résolution mobile : OK");
