import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.23.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.23<\/span>/);
assert.match(app, /const safeBottom = window\.innerHeight - 8/);
assert.match(app, /actions\.getBoundingClientRect\(\)\.bottom - safeBottom/);
assert.match(app, /baseLift \+ overflow/);
assert.match(app, /card\.matches\(":hover, :focus-within"\)/);

console.log("Version 4.23 : boutons entièrement visibles au-dessus du bas de l’écran : OK");
