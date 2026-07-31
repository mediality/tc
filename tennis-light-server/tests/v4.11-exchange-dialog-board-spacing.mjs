import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const [major, minor] = packageJson.version.split(".").map(Number);
assert.ok(major > 4 || (major === 4 && minor >= 11));
assert.match(html, /styles\.css\?v=4\.(?:1[1-9]|[2-9]\d)\.\d+/);
assert.match(html, /app\.js\?v=4\.(?:1[1-9]|[2-9]\d)\.\d+/);
assert.match(html, /Tennis Courts Academy · <span>v4\.(?:1[1-9]|[2-9]\d)<\/span>/);

assert.match(css, /Desktop interface v4\.11/);
assert.match(css, /\.desktop-match-score\s*\{[\s\S]*?position:\s*relative[\s\S]*?grid-row:\s*2/);
assert.match(css, /\.court\s*\{\s*grid-row:\s*3/);
assert.match(app, /function alignDesktopPlayedRows\(\)/);
assert.match(css, /top: calc\(50% \+ 5px\)/);
assert.match(css, /--desktop-played-stack-height:\s*calc\(var\(--desktop-played-card-height\) \* 1\.3\)/);

assert.match(app, /desktop-exchange-power-score/);
assert.match(app, /action-log-result-details--\$\{result\.victoryType\}/);
assert.match(app, /exchange-score-consequence/);
assert.match(css, /\.action-log-result-details--boost \.exchange-outcome-detail/);
assert.match(css, /\.action-log-result-details--effect \.exchange-outcome-detail/);
assert.match(css, /\.action-log-result-details--power \.exchange-outcome-detail/);

assert.match(app, /class="exchange-result-overlay \$\{resultClass\} exchange-result-winner--\$\{winnerSide\}"/);
assert.match(app, /Vainqueur de l’échange/);
assert.match(app, /exchange-result-victory-type/);
assert.match(app, /Conséquence sur le set/);
assert.match(app, /data-open-exchange-history/);
assert.match(css, /\.result-panel\.exchange-result-host/);

console.log("Version 4.11 : score séparé, rangées à 10 px, historique enrichi et dialogue de fin d’échange : OK");
