import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v3\.62"/);
assert.match(html, /styles\.css\?v=3\.62\.0/);
assert.match(html, /app\.js\?v=3\.62\.0/);
assert.match(html, /data-ai-club-value="onepointmaster"/);
assert.match(html, /<strong>1 Point Master<\/strong>/);
assert.match(app, /\["match", "classic", "league", "championship", "onepoint", "onepointmaster"\]\.includes\(value\)/);
assert.match(app, /else if \(isOnePointMaster\) \{\s*startOnePointMasterMode\(options\)/);
assert.match(app, /function showMenuScreen\(\)[\s\S]*window\.scrollTo\(\{ top: 0, behavior: "auto" \}\)/);
assert.match(styles, /\.ai-club-house-screen \{\s*background: transparent;/);
assert.doesNotMatch(html, /Compétition [1-5]/);
assert.equal((html.match(/<details class="solo-competition-accordion">/g) || []).length, 6);

console.log("v3.62 : navigation, six modes repliés et 1 Point Master : OK");
