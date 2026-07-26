import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.34.0");
for (const id of ["johnnyKowalski", "sakubaraGeki"]) {
  assert.match(app, new RegExp(`${id}:`));
  assert.match(server, new RegExp(`${id}:`));
}
assert.match(app, /johnnyKowalski: "clay"/);
assert.match(app, /sakubaraGeki: "grass"/);
assert.match(server, /johnnyKowalski: "clay"/);
assert.match(server, /sakubaraGeki: "grass"/);
assert.match(app, /drawPrintedPowerForCurrentShot/);
assert.match(app, /stealEndurance/);
assert.match(app, /reducePreviousOpponentPrintedPower/);
assert.match(app, /target\.basePowerGained = retainedPower/);
assert.match(app, /Les bonus du Coup restent acquis/);
assert.match(app, /soloAdvancedEffectOnlyTurnDecision/);
assert.match(app, /aiIntelligenceAtLeast\("expert"\)/);
assert.match(app, /end_turn_after_effect_resource_strategy/);
assert.match(server, /\[\[1, 8\], \[9, 16\], \[17, 24\]\]/);
assert.match(server, /400 \+ Math\.floor\(seededRandom\(`pointmax:/);
assert.match(server, /adminAiPointsMatch/);
assert.match(app, /Fiche joueur IA/);
assert.match(app, /Seuls les points de la semaine actuelle peuvent être modifiés/);
assert.match(app, /v334-kowalski-sakubara-circuit/);
assert.match(app, /image: "assets\/sakuwalskinews\.jpg"/);
assert.match(app, /availableAt: "2026-07-26T00:00:00\+02:00"/);
assert.match(app, /const pointsToDefend = Math\.max\(0,[\s\S]*ranking\.score_ref[\s\S]*ranking\.score_week[\s\S]*ranking\.score_next_ref/);
assert.match(app, /\/ À défendre/);
assert.match(css, /\.profile-current-week-points dd > small[\s\S]*font-size:\s*\.46em/);
assert.match(css, /\.match-finale-overlay/);
assert.match(css, /prefers-reduced-motion: reduce/);

for (const name of [
  "TC-Johnny-Kowalski.webp", "TC-Johnny-Kowalski-VERSO.webp", "TC-Johnny-Kowalski-LOBBY.webp",
  "TC-Johnny-Kowalski-WINS.webp", "TC-Johnny-Kowalski-LOSE.webp",
  "TC-Sakubara-Geki.webp", "TC-Sakubara-Geki-VERSO.webp", "TC-Sakubara-Geki-LOBBY.webp",
  "TC-Sakubara-Geki-WINS.webp", "TC-Sakubara-Geki-LOSE.webp",
]) {
  await access(new URL(`../public/assets/cards/${name}`, import.meta.url));
}
await access(new URL("../public/assets/sakuwalskinews.jpg", import.meta.url));

console.log("v3.34 : nouveaux joueurs, profil, news, IA, RankIA, admin et finale multi-écrans : OK");
