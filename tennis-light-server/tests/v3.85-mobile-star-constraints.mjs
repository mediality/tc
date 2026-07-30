import assert from "node:assert/strict";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const mobileStyles = fs.readFileSync(new URL("../public/mobile-game.css", import.meta.url), "utf8");

const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const mobileGame = fs.readFileSync(new URL("../public/mobile-game.js", import.meta.url), "utf8");

assert.equal(pkg.version, "3.85.0");
assert.match(app, /const GAME_VERSION = "v3\.85"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.85<\/span>/);

assert.match(app, /function installBrowserNavigation\(\)/);
assert.match(app, /window\.history\.pushState\(/);
assert.match(app, /window\.addEventListener\("popstate"/);
assert.match(app, /window\.addEventListener\("beforeunload"/);
assert.match(app, /confirmBrowserMatchExit/);
assert.match(app, /tennisLightDestination/);

assert.match(app, /function localMatchViewIsActive\(\)/);
assert.match(app, /LOCAL_ACTIVE_MATCH_STORAGE_KEY/);
assert.match(app, /localMobileMatchId\(\) \|\| rememberedActiveLocalMatchId\(\)/);
assert.match(app, /document\.visibilityState === "hidden"/);
assert.match(app, /LOCAL_MATCH_DATABASE_NAME/);
assert.match(app, /window\.indexedDB\.open/);
assert.match(app, /restoreLocalMatchSessionFromDatabase/);
assert.match(app, /typeof crypto\?\.randomUUID === "function"/);
assert.doesNotMatch(app, /LOCAL_MOBILE_MATCH_EXIT_GRACE_MS/);
assert.match(app, /record\.expiresAt = state\.gameOver \? record\.expiresAt : null/);
assert.match(app, /const localMatchRestoredSynchronously = restoreLocalMobileMatchSession\(\)/);

assert.match(styles, /\.menu-screen \{\s*width: calc\(100% - 20px\)/);
assert.match(styles, /\.lobby-mode-grid \{[\s\S]*?padding-inline: 3px/);
assert.match(styles, /\.lobby-mode-card > \.lobby-mode-art \{[\s\S]*?inset: 5px/);
assert.match(mobileStyles, /width: min\(100%, 100dvw\)/);

assert.match(html, /id="academyComparisonTitle"/);
assert.match(html, /48 cartes par joueur, soit 96 en tout/);
assert.match(html, /Réserve de 2 cartes par joueur/);
assert.match(html, /un jeu qui mêle deckbuilding et gestion/);
assert.match(styles, /\.academy-comparison-table-wrap/);
assert.match(styles, /-webkit-overflow-scrolling: touch/);

assert.match(server, /ADD COLUMN IF NOT EXISTS admin_status/);
assert.match(server, /pro-codes\\\/\(\[\^\/\]\+\)\\\/status/);
assert.match(app, /data-admin-code-status/);
assert.match(app, /ATTRIBUÉ/);
assert.match(app, /item\.assignedTo \? "disabled" : ""/);
assert.match(server, /adminAiScoreEditorPayload/);
assert.match(server, /setAdminAiScorePeriods/);
assert.match(server, /week_number, points, human_win_bonus\)[\s\S]*?VALUES \(\$1, \$2, 0, \$3, 0\)/);
assert.match(app, /function aiAdminProfileMarkup/);
assert.match(app, /data-ai-profile-season-total/);
assert.match(app, /saveAiProfileRankingScores/);

assert.match(app, /category: provisional \? "provisional" : "permanent"/);
assert.match(app, /badge\.type === "constraint" \? "constraint" : "provisional"/);
assert.match(mobileGame, /Bonus permanents/);
assert.match(mobileGame, /Bonus provisoires/);
assert.match(mobileGame, /Contraintes/);
assert.match(mobileGame, /<span aria-hidden="true">\+<\/span>/);
assert.match(mobileStyles, /\.mobile-bonus-item--permanent/);
assert.match(mobileStyles, /\.mobile-bonus-item--constraint/);
assert.match(server, /async function clampAiWeekScoresToPointMax/);
assert.match(server, /await clampAiSeasonScoresToPointMax\(currentCircuit\.season\)/);
assert.match(server, /const maxSem = maxWeeklyTournamentPoints\(week, `\$\{season\}:\$\{week\}`\)/);

assert.match(app, /const starPower = card\.starEffectLabel/);
assert.match(app, /lastPlayedCardSummary = activeCardSummary \? \{ \.\.\.activeCardSummary, starPower: undefined \}/);
assert.match(mobileGame, /function starPowerPlayedMarkup/);
assert.match(mobileGame, /resolutionSequence\.phase = "star-power"/);
assert.match(mobileGame, /data-mobile-star-continue/);
assert.match(mobileGame, /Voir la carte jouée/);
assert.match(mobileStyles, /\.mobile-played-star-power/);
assert.match(app, /starEffectSide/);
assert.match(app, /Prochain Effet joué : sera annulé par l’adversaire/);
assert.match(app, /Prochain Coup : coûte \$\{player\.nextExtraCost\} endurance de plus`, type: "constraint"/);
assert.match(app, /state\.players\.flatMap/);
assert.match(mobileGame, /mobile-bonus-star-icon/);
assert.match(mobileGame, /mobile-bonus-item--star-/);
assert.match(mobileStyles, /\.mobile-bonus-item--constraint\.mobile-bonus-item--star-blue/);
assert.match(mobileStyles, /\.mobile-bonus-item--constraint\.mobile-bonus-item--star-rose/);

console.log("v3.85 mobile star constraints checks passed");
