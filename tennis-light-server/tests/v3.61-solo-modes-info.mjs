import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.61.0");
assert.match(app, /const GAME_VERSION = "v3\.61"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.61<\/span>/);

const classic = html.indexOf('data-ai-club-value="classic"');
const league = html.indexOf('data-ai-club-value="league"');
const championship = html.indexOf('data-ai-club-value="championship"');
const onePoint = html.indexOf('data-ai-club-value="onepoint"');
assert.ok(classic < league && league < championship && championship < onePoint);

assert.match(app, /storedFormat === "onepoint" && \(!storedBonus \|\| storedBonus === "none"\)[\s\S]*return "reward"/);
assert.match(app, /if \(AI_CLUB_HOUSE\.format === "onepoint"\)[\s\S]*AI_CLUB_HOUSE\.bonus = "reward"/);
assert.match(app, /classList\.toggle\("reward-visible", isOnePoint\)/);
assert.match(styles, /\.friendly-setting-switch\.five-options \{[\s\S]*repeat\(4/);
assert.match(styles, /\.friendly-setting-switch\.five-options\.reward-visible \{[\s\S]*repeat\(5/);

assert.match(app, /image: "assets\/news-competition\.jpg"/);
assert.match(html, /id="openSoloInfoButton"/);
assert.match(html, /id="soloInfoScreen"/);
assert.match(html, /infos-competition\.jpg/);
assert.equal((html.match(/<details class="solo-competition-accordion">/g) || []).length, 4);
assert.doesNotMatch(html, /<details class="solo-competition-accordion" open/);
for (const icon of ["trophy-circuit.svg", "LEAGUE.svg", "CHAMPIONSHIP.svg", "power-flash.svg"]) {
  assert.match(html, new RegExp(icon.replace(".", "\\.")));
}
assert.match(styles, /\.solo-competition-accordion summary i::after/);
assert.match(styles, /\.solo-competition-accordion\[open\] summary i::after/);

console.log("v3.61 : ordre Solo, Récompense par défaut, nouvelle image et page des modes : OK");
