import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.60.0");
assert.match(app, /const GAME_VERSION = "v3\.60"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.60<\/span>/);

assert.match(app, /id: "v359-new-competitions"/);
assert.match(app, /publishedAt: "2026-07-27"/);
assert.match(app, /title: "Deux nouveaux défis débarquent !"/);
assert.match(app, /image: "assets\/news-new-competitions-v359\.jpg"/);
assert.match(app, /Sprint ou marathon \? À vous de choisir !/);
assert.match(app, /Le 1 Point Game vous propulse/);
assert.match(app, /Le Championnat vous embarque/);
assert.match(app, /const newsItems = allNews;/);
assert.doesNotMatch(app, /allNews\.slice\(0, 5\)/);

assert.match(html, /class="home-news-scroll" aria-label="Actualités défilantes"/);
assert.match(html, /id="openNewsArchiveButton"[\s\S]*Plus d’infos/);
assert.match(styles, /\.home-news-scroll[\s\S]*max-height: 390px[\s\S]*overflow-y: auto[\s\S]*direction: rtl/);
assert.match(styles, /\.home-news-scroll > \*[\s\S]*direction: ltr/);
assert.match(styles, /scrollbar-width: thin/);
assert.match(app, /String\(right\.publishedAt\)\.localeCompare\(String\(left\.publishedAt\)\)/);

console.log("v3.60 : nouvelle compétition, ascenseur des actualités et archives chronologiques : OK");
