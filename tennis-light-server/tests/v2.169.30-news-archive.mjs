import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.ok(Number(pkg.version.split(".").at(-1)) >= 30);
assert.match(app, /const GAME_VERSION = "v2\.169\.\d+"/);
assert.match(html, /Tennis Courts Academy · 2\.169\.\d+/);
assert.match(html, /app\.js\?v=170\.\d+/);
assert.match(html, /styles\.css\?v=170\.\d+/);

assert.match(app, /const newsItems = allNews\.slice\(0, 5\)/);
assert.match(app, /allNews\.length < 6/);
assert.match(html, /id="openNewsArchiveButton"/);
assert.match(html, /id="newsArchiveScreen"/);
assert.match(html, /id="newsArchiveList"/);
assert.match(app, /function showNewsArchiveScreen/);
assert.match(app, /function renderNewsArchive/);
assert.match(css, /\.news-archive-list/);
assert.match(css, /@media \(max-width: 680px\)/);

console.log("v2.169.30 five latest news and complete news archive: OK");
