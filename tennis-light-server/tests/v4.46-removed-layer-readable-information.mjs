import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.46.0");
assert.match(index, /styles\.css\?v=4\.46\.0/);
assert.match(index, /app\.js\?v=4\.46\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.46<\/span>/);

assert.match(app, /--desktop-played-layer: \$\{sequenceIndex \+ 1\}/);
assert.match(styles, /\.desktop-played-slot\s*\{[\s\S]*?z-index: var\(--desktop-played-layer, 1\);/);
assert.match(styles, /\.desktop-played-card\.removed\s*\{[\s\S]*?filter: none;[\s\S]*?opacity: 1;/);
assert.match(styles, /\.desktop-played-card\.removed > img:not\(\.remise-forbid-overlay\),[\s\S]*?filter: grayscale\(1\) brightness\(\.62\);/);
assert.match(app, /if \(card\.remiseMode === "effect"\) return true;/);

assert.match(styles, /\.hand \.card-readable-data\s*\{[\s\S]*?display: grid !important;[\s\S]*?background: rgba\(3, 24, 38, \.97\);/);
assert.match(styles, /\.card-readable-data \.card-readable-stats > span[\s\S]*?background: rgba\(255, 255, 255, \.1\);/);

assert.match(app, /PLACEMENT INSUFFISANT · <strong>BOOST ADVERSE POSSIBLE<\/strong>/);
assert.match(styles, /\.hand \.boost-warning\s*\{[\s\S]*?font-size: \.46rem;[\s\S]*?text-transform: uppercase;/);
assert.match(styles, /game-actions-always-visible[\s\S]*?\.card:hover \.card-assist-preview[\s\S]*?display: grid;[\s\S]*?width: 100%;[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(styles, /\.card-assist-preview\.has-boost[\s\S]*?repeat\(3, minmax\(0, 1fr\)\)/);

console.log("Version 4.46 : plan des cartes supprimées, descriptifs et informations desktop stabilisés : OK");
