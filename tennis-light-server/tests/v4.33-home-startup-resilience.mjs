import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.33.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.33<\/span>/);
assert.match(html, /styles\.css\?v=4\.33\.0/);
assert.match(html, /app\.js\?v=4\.33\.0/);
assert.match(app, /initMenu\(\);\s*try \{\s*newGame\(\);/);
assert.match(app, /catch \(error\) \{[\s\S]*showMenuScreen\(\);/);

const startup = app.slice(app.lastIndexOf("initMenu();"));
assert.ok(startup.indexOf("initMenu();") < startup.indexOf("newGame();"));

console.log("Version 4.33 : clics de la home installés avant toute initialisation de match : OK");
