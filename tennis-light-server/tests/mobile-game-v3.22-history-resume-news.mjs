import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const mobile = fs.readFileSync(path.join(root, "public/mobile-game.js"), "utf8");
const mobileCss = fs.readFileSync(path.join(root, "public/mobile-game.css"), "utf8");
const styles = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");

assert.match(app, /const GAME_VERSION = "v3\.22"/);
assert.match(app, /playerSide: actorIndex < 0 \? "information" : actorIndex === localPlayerIndex \? "player" : "opponent"/);
assert.match(mobile, /mobile-history-entry--side-\$\{escapeText\(entry\.playerSide\)\}/);
assert.match(mobile, /mobile-history-player-name/);
assert.match(mobileCss, /\.mobile-history-entry--side-player[\s\S]*var\(--mobile-player-color\)/);
assert.match(mobileCss, /\.mobile-history-entry--side-opponent[\s\S]*var\(--mobile-opponent-color\)/);

assert.match(app, /Supprimer une carte pour gagner en puissance/);
assert.match(app, /Piocher une carte non distribuée/);
assert.match(mobileCss, /body\.mobile-game-view \.choice-grid[\s\S]*display: flex[\s\S]*overflow-x: auto/);
assert.match(mobileCss, /background: rgba\(2, 13, 20, 0\.86\)/);

assert.doesNotMatch(mobile, /anchorPassButtonWhenItAppears/);
assert.doesNotMatch(mobile, /querySelector\("\[data-mobile-pass\]"\)\?\.scrollIntoView/);
assert.match(mobile, /input type="checkbox" data-mobile-fullscreen/);
assert.match(mobile, /\[data-mobile-fullscreen\]"\)\?\.addEventListener\("change"/);

assert.match(app, /const LOCAL_MOBILE_MATCH_EXIT_GRACE_MS = 20000/);
assert.match(app, /params\.set\(LOCAL_MOBILE_MATCH_QUERY, matchId\)/);
assert.match(app, /snapshot: \{[\s\S]*state: cloneData\(state\)[\s\S]*soloAi: cloneData\(SOLO_AI\)/);
assert.match(app, /restoreLocalMobileMatchFromUrl\(\)/);

assert.match(app, /class="pro-news-close"[\s\S]*aria-label="Fermer l’actualité"/);
assert.match(styles, /\.pro-news-close[\s\S]*min-width: 44px[\s\S]*height: 44px/);
assert.match(styles, /\.pro-news-copy[\s\S]*overflow-y: auto/);
assert.doesNotMatch(styles, /exchange-winner-halo/);
assert.match(app, /startsWith\(label\.toLocaleLowerCase\("fr"\)\)[\s\S]*\? source\.label/);

console.log("Mobile v3.22 : historique, choix, plein écran, reprise et actualités : OK");
