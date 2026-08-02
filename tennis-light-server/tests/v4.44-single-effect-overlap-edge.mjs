import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.44.0");
assert.match(index, /styles\.css\?v=4\.44\.0/);
assert.match(index, /app\.js\?v=4\.44\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.44<\/span>/);

assert.match(app, /precededByEffect && !remiseCards\.length \? " preceded-by-effect" : ""/);
assert.match(styles, /V4\.44 restore only the obscured shot edge, without doubling its outline/);
const effectOutline = styles.slice(styles.indexOf(".desktop-played-card.preceded-by-effect::after"), styles.indexOf("/* V4.43"));
assert.match(effectOutline, /border: 0;/);
assert.match(effectOutline, /border-left: 2px solid #fff;/);
assert.doesNotMatch(effectOutline, /border: 2px solid #fff;/);
assert.match(styles, /\.desktop-played-card\.preceded-by-effect::after\s*\{\s*border-top: 0;\s*border-right: 0;\s*border-bottom: 0;/);

console.log("Version 4.44 : un seul bord complété sur le Coup superposé à un Effet : OK");
