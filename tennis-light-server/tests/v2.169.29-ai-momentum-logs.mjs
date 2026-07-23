import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "2.169.29");
assert.match(app, /const GAME_VERSION = "v2\.169\.29"/);
assert.match(html, /Tennis Courts Academy · 2\.169\.29/);

for (const trigger of ["Ace", "Enchaînement", "Bulle"]) {
  assert.match(app, new RegExp(`activateSequenceBonus\\(winner, "${trigger}"`));
}
assert.match(app, /exchangeWasAce/);
assert.match(app, /remainingExchanges/);
assert.match(app, /sourceBonusId/);
assert.match(app, /"Motivation"/);
assert.match(app, /"Ascendant"/);

assert.match(app, /strategicEnduranceReserve/);
assert.match(app, /boostDisruptionValue/);
assert.match(app, /reserveShortfall/);
assert.match(app, /opponent\.hand\.length <= 1 \|\| opponent\.endurance <= 0/);

assert.match(app, /tennisLightHumanMatchLogsV2/);
assert.match(app, /\["admin", "pro_plus"\]\.includes\(currentUserRole\(\)\)/);
assert.match(server, /Journaux détaillés réservés aux joueurs ADMIN et PRO\+/);
assert.match(server, /schemaVersion'\)::int, 0\) >= 2/);

assert.match(styles, /grid-template-columns: minmax\(104px, 112px\) 84px/);
assert.match(styles, /\.character-endurance-reminder \{[^}]*width: 84px/s);
assert.match(styles, /\.character-hand-reminder \{[^}]*width: 84px/s);

console.log("v2.169.29 AI, bonus, logs and layout checks passed");
