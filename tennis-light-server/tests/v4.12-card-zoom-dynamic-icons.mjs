import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.15.0");
assert.match(html, /styles\.css\?v=4\.15\.0/);
assert.match(html, /app\.js\?v=4\.15\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.15<\/span>/);

assert.match(css, /Desktop interface v4\.12/);
assert.match(css, /\.desktop-played-card:hover,[\s\S]*?transform:\s*translateY\(-28%\) scale\(1\.38\)/);
assert.match(css, /\.desktop-played-row:has\(\.desktop-played-card:hover\)/);

assert.match(app, /visual-stat--\$\{cost < card\.cost \? "positive" : "negative"\}/);
assert.match(app, /visual-stat--\$\{stats\.precision > card\.precision \? "positive" : "negative"\}/);
assert.match(app, /currentPlacement > card\.placement \? "positive" : currentPlacement < card\.placement \? "negative" : "neutral"/);
assert.doesNotMatch(app, /<span>Coût actuel \$\{cost\}<\/span>/);
assert.match(css, /\.visual-stat--positive strong\s*\{\s*color:\s*#16845f/);
assert.match(css, /\.visual-stat--negative strong\s*\{\s*color:\s*#c92828/);
assert.match(css, /assets\/icons\/precision-target\.svg/);
assert.match(css, /assets\/icons\/placement-pin\.svg/);
assert.match(css, /assets\/icons\/endurance-heart\.svg/);

console.log("Version 4.12 : loupe centrale harmonisée et effets dynamiques illustrés : OK");
