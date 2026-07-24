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
assert.match(app, /hideEndTurn: Boolean\(state\.mandatoryPlacement && !canEndTurn\(playerIndex\)\)/);
assert.match(app, /function undoMobileTurn\(\)[\s\S]*restoreTurnSnapshot\(\)/);
assert.match(app, /standings: leagueStandingsState/);
assert.match(app, /opponentBonuses: activeEffectBadges\(opponentIndex\)/);
assert.match(app, /stopOpponentCard: GAMEPLAY_ASSIST\.stopOpponentCard/);
assert.match(app, /consequence: consequenceParts\.join\(" · "\)/);
assert.match(app, /boosted: Boolean\(card\.boosted\)/);

assert.match(mobile, /data-mobile-open-match-menu/);
assert.match(mobile, /data-mobile-menu-destination="competition"/);
assert.match(mobile, /data-mobile-menu-destination="standings"/);
assert.match(mobile, /data-mobile-menu-destination="assistance"/);
assert.match(mobile, /data-mobile-open-return>Quitter le match/);
assert.match(mobile, /data-mobile-stop-opponent-card/);
assert.match(mobile, /data-mobile-action-mode=/);
assert.match(mobile, /mobile-mode-action--risk/);
assert.match(mobile, /data-mobile-undo-turn/);
assert.match(mobile, /mobile-pass-button--\$\{viewState\.turnActions\.passProjection\.winner\.toLowerCase\(\)\}/);
assert.match(mobile, /card\.consequence \? `<p><strong>Conséquence/);
assert.match(mobile, /En attente de votre coup/);
assert.match(mobile, /mobile-last-card-boost/);
assert.match(mobile, /mobileSheetMarkup\("bonuses-player"/);
assert.match(mobile, /mobileSheetMarkup\("bonuses-opponent"/);
assert.match(mobile, /showMobilePanel\(`bonuses-\$\{event\.currentTarget\.dataset\.mobileOpenBonuses\}`/);
assert.match(mobile, /function anchorMobileGameToBottom\(viewState\)/);
assert.match(mobile, /window\.scrollTo\(\{ top: document\.documentElement\.scrollHeight, behavior: "auto" \}\)/);
assert.doesNotMatch(mobile, /Placement requis/);
assert.doesNotMatch(mobile, /Comment jouer cette carte/);

assert.match(css, /\.mobile-match-menu-button span[\s\S]*height:\s*3px/);
assert.match(css, /\.mobile-power i[\s\S]*mask:\s*url\("assets\/icons\/power-flash\.svg"\)/);
assert.match(css, /\.mobile-set-score--player[\s\S]*background:\s*#197d68/);
assert.match(css, /\.mobile-set-score--opponent[\s\S]*background:\s*#a9563f/);
assert.match(css, /\.mobile-mode-action--risk/);
assert.match(css, /\.mobile-mode-action--normal,[\s\S]*background:\s*var\(--mobile-player-color\)/);
assert.match(css, /\.mobile-pass-button--player/);
assert.match(css, /\.mobile-pass-button--opponent/);
assert.match(css, /\.mobile-player-stat--critical dd/);
assert.match(css, /\.mobile-last-card-button--boost/);

console.log("Mobile v3.11 : menu, classement, assistance et commandes tactiques : OK");
