import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.26.0");
assert.match(html, /styles\.css\?v=4\.26\.0/);
assert.match(html, /app\.js\?v=4\.26\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.26<\/span>/);

assert.match(css, /--desktop-played-card-width:\s*clamp\(92px, 7\.9vw, 140px\)/);
assert.match(app, /const winnerSide = winner === mobileLocalPlayerIndex\(\) \? "player" : "opponent"/);
assert.match(app, /exchange-result-winner--\$\{winnerSide\}/);
assert.match(css, /exchange-result-winner--player[\s\S]*?--exchange-result-winner-color:\s*#8ce0bf/);
assert.match(css, /exchange-result-winner--opponent[\s\S]*?--exchange-result-winner-color:\s*#f2a37f/);
assert.match(css, /\.exchange-result-victory-type[\s\S]*?background:\s*var\(--exchange-result-winner-color/);
assert.match(css, /\.exchange-result-power-score[\s\S]*?background:\s*var\(--exchange-result-winner-color/);

console.log("Version 4.16 : cartes centrales réduites et résultat aux couleurs du vainqueur : OK");
