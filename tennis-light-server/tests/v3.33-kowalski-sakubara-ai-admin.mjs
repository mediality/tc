import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.43.0");
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
assert.match(app, /v335-kowalski-sakubara-circuit/);
assert.match(app, /image: "assets\/sakuwalskinews\.jpg"/);
assert.match(app, /title: "La fureur ou la folie \?"/);
assert.match(app, /Imprévisibles, incontrôlables et capables de péter les plombs/);
assert.match(app, /La folie vient officiellement d’entrer sur le court\./);
assert.match(app, /availableAt: "2026-07-26T00:00:00\+02:00"/);
assert.match(app, /const pointsToDefend = Math\.max\(0,[\s\S]*ranking\.score_ref[\s\S]*ranking\.score_week[\s\S]*ranking\.score_next_ref/);
assert.match(app, /\/ À défendre/);
assert.match(css, /\.profile-current-week-points dd > small[\s\S]*font-size:\s*\.46em/);
assert.match(css, /\.pro-news-copy h2 \{[\s\S]*text-align: left/);
assert.match(css, /\.pro-news-copy > p:not\(\.label\):not\(\.pro-news-signature\) \{[\s\S]*white-space: pre-line/);
assert.match(css, /\.match-finale-overlay/);
assert.match(app, /let renderedDesktopMatchFinaleKey = ""/);
assert.match(app, /renderedDesktopMatchFinaleKey === finaleKey[\s\S]*\.match-finale-overlay/);
assert.match(app, /els\.resultPanel\.classList\.add\("match-finale-host"\)/);
assert.match(app, /const progressionMarkup = renderRallyEndActions\(\)/);
assert.match(app, /function bindResultTournamentButton\(\) \{\s*bindRallyEndActions\(els\.resultPanel\)/);
assert.match(app, /function startTournamentNextMatchFromCenter\(\)[\s\S]*els\.resultPanel\?\.classList\.add\("hidden"\)[\s\S]*scheduleSoloTournamentMatch/);
assert.match(app, /const finaleWasVisible = Boolean\(els\.resultPanel[\s\S]*showEventConfirmDialog[\s\S]*if \(!confirmed\)[\s\S]*classList\.remove\("hidden"\)/);
assert.match(app, /catch \(error\) \{[\s\S]*persistance de sortie du tournoi a échoué[\s\S]*resetTournament\(\)[\s\S]*showMenuScreen\(\)/);
assert.match(app, /state\.gameOver \? "exchange-complete-card" : "unplayable"/);
assert.match(app, /players: players\.map\(\(player\) => \[player\.name, player\.lobby, player\.result\]\)/);
assert.match(css, /\.result-panel\.match-finale-host \{[\s\S]*overflow: visible[\s\S]*backdrop-filter: none/);
assert.match(css, /\.card\.exchange-complete-card \{[\s\S]*filter: none/);
assert.match(html, /class="lobby-footer"[\s\S]*v3\.43/);
assert.doesNotMatch(html, /<span>v169<\/span>/);
assert.match(css, /\.hand \.card-visual > img:not\(\.forbid-effect-overlay\) \{[\s\S]*clip-path: none[\s\S]*image-rendering: auto/);
assert.match(app, /effectDeferredUntilEndTurn:[\s\S]*turnCompleted: false/);
assert.match(app, /playedCard\.turnCompleted = true;[\s\S]*state\.lastCard = playedCard/);
assert.match(app, /finalRemise\.turnCompleted = true;[\s\S]*finalRemise\.turnPlacement = preparedPlacement/);
assert.match(app, /function placementRemisesForShot\([\s\S]*card\.turnCompleted \|\| !isRemise\(card\)[\s\S]*card\.remiseMode === "placement"[\s\S]*function renderRemiseStack/);
assert.match(app, /function renderPlayedHistory\([\s\S]*laterShot[\s\S]*renderRemiseStack\(card, remiseCards\)/);
assert.match(app, /jouée en Remise : \$\{card\.placement\} placement, \$\{card\.costPaid \?\? card\.cost \?\? 0\} endurance/);
assert.match(css, /\.center-remise-stack \{[\s\S]*--remise-peek: 54px[\s\S]*width: calc\(148px \+ var\(--remise-count\) \* var\(--remise-peek\)\)/);
assert.match(css, /\.center-remise-stack-shot \{[\s\S]*left: calc\(var\(--remise-count\) \* var\(--remise-peek\)\)/);
assert.match(css, /\.center-remise-stack-peek \{[\s\S]*left: calc\(var\(--remise-index\) \* var\(--remise-peek\)\)/);
assert.match(css, /\.center-remise-stack-peek \.played-visual \{[\s\S]*transform: translateX\(calc\(var\(--remise-peek\) - 148px\)\)/);
assert.match(app, /const friendlyIdentity = SERVER_SYNC\.friendlyMatch \? \{[\s\S]*humanNickname: state\.tournament\?\.humanNickname[\s\S]*state\.tournament\.humanNickname = friendlyIdentity\.humanNickname/);
assert.match(app, /const isAiPlayer = SOLO_AI\.enabled && playerIndex === SOLO_AI\.playerIndex[\s\S]*desktop-player-rank[\s\S]*secondaryIdentity/);
assert.match(css, /\.desktop-player-rank \{[\s\S]*background: #f1cf55/);
assert.match(app, /const seenBonusReminders = new Set\(\)/);
assert.match(app, /bonus\.sourceBonusId \|\| String\(bonus\.label \|\| ""\)\.trim\(\)\.toLocaleLowerCase\("fr"\) \|\| bonus\.id/);
assert.match(app, /adaptiveBoard: localStorage\.getItem\("tennisLightAssistAdaptiveBoard"\) === "true"/);
assert.match(html, /id="gameAdaptiveBoardToggle"[\s\S]*Plateau adapté à l’écran/);
assert.match(app, /document\.body\.classList\.toggle\("game-adaptive-board", GAMEPLAY_ASSIST\.adaptiveBoard\)/);
assert.match(css, /body\.game-adaptive-board:not\(\.mobile-game-view\) \.app[\s\S]*width: min\(1880px, calc\(100vw - 24px\)\)/);
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

console.log("v3.43 : nouveaux joueurs, profil, news, IA, RankIA, admin et finale multi-écrans : OK");
