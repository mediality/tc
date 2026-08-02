import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.32.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.32<\/span>/);
assert.match(app, /panelBottom - card\.offsetHeight/);
assert.match(app, /--local-card-action-lift/);

console.log("Version 4.23 : boutons et rebords inférieurs entièrement visibles : OK");
