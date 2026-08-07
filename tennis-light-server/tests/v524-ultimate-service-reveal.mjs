import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

assert.match(app, /function beginUltimateServiceReveal\(\)/);
assert.match(app, /artwork: config\?\.character/);
assert.match(app, /<p>AU SERVICE<\/p>/);
assert.match(app, /ULTIMATE_MODE\.serviceRevealTimer = window\.setTimeout\([\s\S]*}, 2000\)/);
assert.match(app, /if \(ULTIMATE_MODE\.active && ULTIMATE_MODE\.serviceReveal\) return false/);
assert.match(app, /captureTurnSnapshot\(\);\s*render\(\);\s*beginUltimateServiceReveal\(\);/);
assert.match(app, /if \(!resetUltimate\) beginUltimateServiceReveal\(\)/);
assert.match(app, /secureUltimateTurnContinuation\(null\);[\s\S]*maybeRunSoloAI\(\);/);
assert.match(css, /\.ultimate-service-reveal-layer/);
assert.match(css, /\.ultimate-service-reveal p[\s\S]*font-weight: 950/);
assert.match(html, /Tennis Courts Academy · <span>V5\.26<\/span>/);

console.log("V5.24 Ultimate service announcement checks passed.");
