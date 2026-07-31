import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.20.0");
assert.match(html, /styles\.css\?v=4\.20\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.20<\/span>/);
assert.match(app, /expandedHeight - actionHeight/);
assert.match(app, /--local-card-hover-lift/);
assert.match(css, /translateY\(calc\(-1 \* var\(--local-card-hover-lift, 0px\)\)\) scale\(1\.26\)/);
assert.match(css, /\.card-actions[\s\S]*?order:\s*20/);

console.log("Version 4.20 : remontée mesurée, carte stable et actions sur la ligne basse : OK");
