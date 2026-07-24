import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, mobileApp, mobileStyles, pkgText] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);
const pkg = JSON.parse(pkgText);

assert.equal(pkg.version, "3.8.1");
assert.match(app, /const GAME_VERSION = "v3\.8"/);
assert.match(html, /id="gameVersion">v3\.8</);
assert.match(html, /mobile-game\.js\?v=3\.8\.0/);

assert.match(app, /bonuses: activeEffectBadges\(playerIndex\)/);
assert.match(app, /function mobileHistoryEntries\(\)/);
assert.match(app, /return state\.log\.map\(\(line, index\) =>/);
assert.match(app, /type: actionLogEntryType\(line\)/);
assert.match(app, /label: actionLogEntryLabel\(actionLogEntryType\(line\)\)/);
assert.match(app, /variationTypes/);
assert.match(app, /playedAction\?\.costPaid \?\? playedCard\?\.costPaid/);
assert.match(app, /variations/);
assert.match(app, /lastPlayedCard: activeCardSummary/);
assert.match(app, /function mobileReturnToMenuInfo\(\)/);
assert.match(app, /function confirmMobileReturnToMenu\(\)/);
assert.match(app, /confirmReturnToLobby\(\)/);
assert.match(app, /confirmReturnToMenu: confirmMobileReturnToMenu/);

assert.match(mobileApp, /data-mobile-open-bonuses/);
assert.match(mobileApp, /data-mobile-open-history/);
assert.match(mobileApp, /data-mobile-open-return/);
assert.match(mobileApp, /mobileSheetMarkup\("bonuses"/);
assert.match(mobileApp, /mobileSheetMarkup\("history"/);
assert.match(mobileApp, /data-mobile-confirm-return/);
assert.match(mobileApp, /data-mobile-cancel-return/);
assert.match(mobileApp, /data-mobile-history-card/);
assert.match(mobileApp, /showMobileCardDetail\(viewState\.lastPlayedCard/);
assert.match(mobileApp, /panelGestureStartY - event\.clientY > 48/);
assert.match(mobileApp, /event\.clientY - panelGestureStartY > 64/);
assert.match(mobileApp, /if \(event\.key === "Escape"\)/);
assert.match(mobileApp, /if \(event\.key !== "Tab"\) return/);
assert.match(mobileApp, /mobilePanelTrigger\?\.isConnected/);
assert.match(mobileApp, /window\.tennisLightMobileAdapter\?\.confirmReturnToMenu\(\)/);
assert.doesNotMatch(mobileApp, /pointerup[\s\S]{0,250}confirmReturnToMenu/);
assert.doesNotMatch(mobileApp, /(?:^|[^.])\b(?:playCard|endTurn)\(|activeEffectBadges|actionLogEntryType/);

assert.match(mobileStyles, /\.mobile-utility-nav/);
assert.match(mobileStyles, /\.mobile-sheet-backdrop/);
assert.match(mobileStyles, /\.mobile-bottom-sheet/);
assert.match(mobileStyles, /\.mobile-return-confirm/);
assert.match(mobileStyles, /\.mobile-utility-nav button\s*\{[\s\S]*min-height: 48px/);
assert.match(mobileStyles, /\.mobile-bottom-sheet > header button\s*\{[\s\S]*width: 44px;[\s\S]*height: 44px/);
assert.doesNotMatch(mobileStyles, /\.game-app\s/);

console.log("Informations secondaires et navigation mobile : OK");
