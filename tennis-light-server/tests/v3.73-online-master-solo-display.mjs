import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.73.0");
assert.match(app, /const GAME_VERSION = "v3\.73"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.73<\/span>/);
assert.match(app, /function friendlyMasterZoneMarkup/);
assert.match(app, /class="championship-zone/);
assert.match(app, /class="league-standings championship-standings one-point-master-standings"/);
assert.match(app, /data-friendly-master-zone/);
assert.match(app, /open \? "−" : "\+"/);
assert.match(
  app,
  /\[0, 1, 2, 3, 4, 5\]\.flatMap\(\(slot\)[\s\S]*\["A", "B", "C", "D"\]\.map/,
  "le tirage en ligne doit remplir les groupes par emplacement comme le solo",
);
assert.match(app, /FRIENDLY_TOURNAMENT\.drawVisibleCount \+= 1/);
assert.match(app, /window\.setInterval\(\(\) => \{[\s\S]*drawVisibleCount[\s\S]*\}, 1000\)/);
assert.match(app, /const currentMatches = \(state\.tournament\.matches \|\| \[\]\)\.filter\(\(match\) => match\.round === stage\)/);
assert.match(app, /<span>Tour actuel<\/span>/);

console.log("v3.73 online Master solo display checks passed");
