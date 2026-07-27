import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const mobileStyles = fs.readFileSync(path.join(root, "public/mobile-game.css"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

assert.equal(pkg.version, "3.67.0");
assert.match(app, /const GAME_VERSION = "v3\.67"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.67<\/span>/);

assert.match(app, /bonus\.id === "clayForehandEndurance" && \(playedCard\.family === "Coup droit" \|\| playedCard\.id === "service-coup-droit"\)/);
assert.match(app, /seedNumber >= 1 && seedNumber <= 8/);
assert.match(server, /Number\(rank\) >= 1 && Number\(rank\) <= 8/);

assert.match(app, /const newsItems = allNews\.slice\(0, 5\)/);
assert.match(app, /news-archive-featured[\s\S]*news-archive-summary/);
assert.match(styles, /\.home-news-scroll \{\s*overflow: visible;/);
assert.match(styles, /\.news-archive-summary \{[\s\S]*background: #fff;/);
assert.ok(
  html.indexOf('id="homeNewsArchiveAction"') > html.indexOf('class="home-news-scroll"')
  && html.indexOf('id="homeNewsArchiveAction"') > html.indexOf('id="homeNewsList"'),
);

assert.match(app, /function showMenuScreen\(\) \{[\s\S]*hideStandaloneScreens\(\)/);
assert.match(app, /function showGameScreen\(\) \{[\s\S]*hideStandaloneScreens\(\)/);

assert.match(app, /formatCard\("onepointmaster", "1 Point Master"/);
assert.match(server, /\["match", "classic", "league", "onepoint", "onepointmaster"\]\.includes\(payload\.format\)/);
assert.match(server, /tournament\.format === "onepointmaster" \? 24 : 8/);
assert.match(server, /function refreshFriendlyOnePointMasterSlots\(/);
assert.match(server, /\[\[0, 5\], \[1, 4\], \[2, 3\]\]/);
assert.match(server, /`master-barrage-\$\{index\}`/);
assert.match(server, /friendlySelectionLimit\(tournament\)[\s\S]*return tournament\?\.format === "match" \? 2 : 4/);

assert.match(mobileStyles, /\.mobile-boost-sacrifices \{[\s\S]*grid-auto-flow: column;[\s\S]*overflow-x: auto;/);
assert.match(mobileStyles, /\.mobile-turn-actions \{\s*position: sticky;\s*bottom: 0;/);

console.log("v3.67 : Coup droit/service, actualités, navigation, Master en ligne et Boost mobile : OK");
