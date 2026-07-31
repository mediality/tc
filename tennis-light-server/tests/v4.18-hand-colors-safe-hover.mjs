import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.18.0");
assert.match(html, /styles\.css\?v=4\.18\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.18<\/span>/);

assert.match(css, /\.hand \.card:hover[\s\S]*?translateY\(-118%\) scale\(1\.26\)/);
assert.match(css, /\.hand \.card-hover-panel[\s\S]*?background:\s*rgba\(11, 64, 83, \.99\)/);
assert.match(css, /\.hand \.visual-stat--positive[\s\S]*?background:\s*#16845f/);
assert.match(css, /\.hand \.visual-stat--negative[\s\S]*?background:\s*#b93535/);
assert.match(css, /\.hand \.visual-stat-icon[\s\S]*?background:\s*#fff/);
assert.match(css, /\.hand \.card-actions button:not\(:disabled\)[\s\S]*?border:\s*1px solid rgba\(255, 255, 255, \.2\)/);
assert.match(css, /player-panel\[data-desktop-role="opponent"\] \.hand[\s\S]*?z-index:\s*245/);
assert.match(css, /\.turn-buttons \.pass-button[\s\S]*?min-height:\s*32px[\s\S]*?text-transform:\s*uppercase/);

console.log("Version 4.18 : indicateurs colorés, survol sécurisé et commandes compactes : OK");
