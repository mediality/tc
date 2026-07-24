import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, mobile, css] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

assert.match(app, /function mobilePassProjection\(playerIndex\)/);
assert.match(app, /const playerPower = Number\(player\.power \|\| 0\) \+ projectedEndBonuses\(player\)/);
assert.match(app, /const winner = playerPower > opponentPower \? playerIndex/);
assert.match(app, /canPass:[\s\S]*tutorialAllowsPass\(\)[\s\S]*!hasPlayedThisTurn\(playerIndex\)/);
assert.match(app, /canUndo: !SPECTATOR_MODE\.enabled && canUndoTurn\(playerIndex\)/);
assert.match(app, /hideEndTurn: !state\.turnDirty[\s\S]*state\.mandatoryPlacement && !canEndTurn\(playerIndex\)/);
assert.match(app, /const endsTurn = !isRemise\(card\)/);
assert.match(app, /const opponent = state\.players\[opponentIndex\]/);
assert.match(app, /function undoMobileTurn\(\)[\s\S]*restoreTurnSnapshot\(\)/);
assert.match(app, /standings: leagueStandingsState/);
assert.match(app, /opponentBonuses: activeEffectBadges\(opponentIndex\)/);
assert.match(app, /stopOpponentCard: GAMEPLAY_ASSIST\.stopOpponentCard/);
assert.match(app, /consequence: consequenceParts\.join\(" · "\)/);
assert.match(app, /boosted: Boolean\(card\.boosted\)/);
assert.match(app, /!boosted[\s\S]*mode !== "effect"[\s\S]*totalTurnPlacement\(playerIndex, card, boosted\) < Number\(state\.lastCard\.precision/);
assert.match(app, /fullscreenAvailable: Boolean\([\s\S]*document\.documentElement\.requestFullscreen[\s\S]*document\.documentElement\.webkitRequestFullscreen/);
assert.match(app, /function canPlayEffectMode\(playerIndex, card\)[\s\S]*canAfford\(player, card\) && satisfiesFamilyLimit\(player, card\)/);
assert.match(app, /window\.dispatchEvent\(new CustomEvent\("tennis-light:match-render"\)\)/);
assert.match(app, /const expiresAt = Date\.now\(\) \+ 5_000/);
assert.match(app, /passNeedsConfirmation: player\?\.hand\?\.some\(\(card\) => mobileCardPlayOptions\(playerIndex, card\)\.length > 0\)/);

assert.match(mobile, /data-mobile-open-match-menu/);
assert.match(mobile, /data-mobile-menu-destination="competition"/);
assert.match(mobile, /data-mobile-menu-destination="standings"/);
assert.match(mobile, /data-mobile-menu-destination="assistance"/);
assert.match(mobile, /data-mobile-open-return>Quitter le match/);
assert.match(mobile, /data-mobile-stop-opponent-card/);
assert.match(mobile, /data-mobile-action-mode=/);
assert.match(mobile, /mobile-mode-action--risk/);
assert.match(mobile, /data-mobile-undo-turn/);
assert.match(mobile, /data-mobile-undo-turn>ANNULER/);
assert.match(mobile, /data-mobile-end-turn[^>]*>TERMINER LE TOUR/);
assert.match(mobile, /mobile-pass-button--\$\{viewState\.turnActions\.passProjection\.winner\.toLowerCase\(\)\}/);
assert.match(mobile, /card\.consequence \? `<p><strong>Conséquence/);
assert.match(mobile, /En attente de votre coup/);
assert.match(mobile, /mobile-last-card-boost/);
assert.match(mobile, /class="mobile-last-card-row"/);
assert.match(mobile, /data-mobile-fullscreen/);
assert.match(mobile, /document\.documentElement\.webkitRequestFullscreen/);
assert.match(mobile, /request\?\.call\(document\.documentElement\)/);
assert.match(mobile, /document\.webkitExitFullscreen/);
assert.match(mobile, /previousHandScrollLeft/);
assert.match(mobile, /mobileSheetMarkup\("bonuses-player"/);
assert.match(mobile, /mobileSheetMarkup\("bonuses-opponent"/);
assert.match(mobile, /showMobilePanel\(`bonuses-\$\{event\.currentTarget\.dataset\.mobileOpenBonuses\}`/);
assert.match(mobile, /function anchorMobileGameToBottom\(viewState\)/);
assert.match(mobile, /playerHasControl && !playerHadControlOnPreviousRender/);
assert.match(mobile, /querySelector\("#mobileGameHand"\)\?\.scrollIntoView\(\{ block: "end", behavior: "auto" \}\)/);
assert.match(mobile, /mobileSheetMarkup\("history", "Déroulé de l’échange"/);
assert.match(mobile, /data-mobile-player-star=/);
assert.match(mobile, /mobileSheetMarkup\("star-player"/);
assert.match(mobile, /mobileSheetMarkup\("star-opponent"/);
assert.match(mobile, /class="mobile-history-inline"/);
assert.match(mobile, /!pendingOpponentReveal && viewState\.turnActions\.canPass \? `<button class="mobile-pass-button/);
assert.match(mobile, /data-mobile-confirm-pass/);
assert.match(mobile, /Passer malgré une carte jouable/);
assert.doesNotMatch(mobile, /☰<\/span>Historique/);
assert.doesNotMatch(mobile, /<header><strong>Votre main<\/strong>/);
assert.doesNotMatch(mobile, /Placement requis/);
assert.doesNotMatch(mobile, /Comment jouer cette carte/);

assert.match(css, /\.mobile-match-menu-button span[\s\S]*height:\s*3px/);
assert.match(css, /\.mobile-power i[\s\S]*mask:\s*url\("assets\/icons\/power-flash\.svg"\)/);
assert.match(css, /\.mobile-set-score--player[\s\S]*background:\s*#197d68/);
assert.match(css, /\.mobile-set-score--opponent[\s\S]*background:\s*#a9563f/);
assert.match(css, /\.mobile-mode-action--risk/);
assert.match(css, /\.mobile-mode-action--risk\s*\{[\s\S]*color:\s*#fff !important/);
assert.match(css, /\.mobile-mode-action--normal,[\s\S]*background:\s*var\(--mobile-player-color\)/);
assert.match(css, /\.mobile-pass-button--player/);
assert.match(css, /\.mobile-pass-button--opponent/);
assert.match(css, /\.mobile-player-stat--critical dd/);
assert.match(css, /\.mobile-last-card-button--boost/);
assert.match(css, /\.mobile-hand-section\s*\{[\s\S]*position:\s*fixed/);
assert.match(css, /\.mobile-hand-section\s*\{[\s\S]*backface-visibility:\s*hidden[\s\S]*transform:\s*translate3d\(0, 0, 0\)/);
assert.match(css, /\.mobile-last-card-row\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) auto/);
assert.match(css, /body\.mobile-game-view \.confrontation-intro-backdrop\s*\{[\s\S]*z-index:\s*720/);
assert.match(css, /\.mobile-scene--empty\s*\{[\s\S]*min-height:\s*68px/);
assert.match(css, /max\(214px, calc\(env\(safe-area-inset-bottom\) \+ 204px\)\)/);
assert.match(css, /\.mobile-history-inline\s*\{[\s\S]*height:\s*64px/);
assert.doesNotMatch(css, /\.mobile-undo-turn\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);

console.log("Mobile v3.16 : tour adverse automatique et sécurité Passer : OK");
