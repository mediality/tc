import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.60.0");
assert.match(app, /const GAME_VERSION = "v3\.60"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.60<\/span>/);
assert.match(styles, /\.news-archive-shell[\s\S]*margin-inline: auto/);

const start = app.indexOf("function showAiClubHouseScreen(");
const end = app.indexOf("\nfunction ", start + 10);
const source = app.slice(start, end);
assert.match(source, /hideStandaloneScreens\(\)/);
assert.match(source, /els\.aiClubHouseScreen\?\.classList\.remove\("hidden"\)/);
assert.ok(
  source.indexOf("hideStandaloneScreens()") < source.indexOf('els.aiClubHouseScreen?.classList.remove("hidden")'),
  "Tous les autres écrans, notamment les archives, doivent être masqués avant d’afficher le Mode Solo",
);

console.log("v3.60 : archives centrées et navigation vers le Mode Solo isolée : OK");
