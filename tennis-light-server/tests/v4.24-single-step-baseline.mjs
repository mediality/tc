import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.29.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.29<\/span>/);
assert.match(app, /panel\.offsetTop \+ panel\.scrollHeight \+ panelBorder/);
assert.match(app, /panelBottom - card\.offsetHeight/);
assert.match(app, /const bottomSafety = 28/);
assert.match(app, /Math\.ceil\(overhang \* hoverScale\) \+ bottomSafety/);
assert.doesNotMatch(app, /const safeBottom = window\.innerHeight/);

console.log("Version 4.24 : alignement bas exact calculé en une seule étape : OK");
