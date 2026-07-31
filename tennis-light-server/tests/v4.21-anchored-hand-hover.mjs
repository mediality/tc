import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.21.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.21<\/span>/);
assert.match(app, /--local-card-hover-lift", "0px"/);
assert.match(app, /panel\.getBoundingClientRect\(\)\.bottom - safeViewportBottom/);
assert.doesNotMatch(app, /expandedHeight - actionHeight/);
assert.match(css, /transform-origin:\s*bottom center/);
assert.match(css, /translateY\(calc\(-1 \* var\(--local-card-hover-lift, 0px\)\)\) scale\(1\.26\)/);

console.log("Version 4.21 : carte ancrée dans sa colonne et remontée limitée au débordement réel : OK");
