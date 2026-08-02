import assert from "node:assert/strict";
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const indexHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.47.0");
assert.match(indexHtml, /styles\.css\?v=4\.47\.0/);
assert.match(indexHtml, /app\.js\?v=4\.47\.0/);
assert.match(indexHtml, /mobile-game\.js\?v=4\.47\.0/);

assert.match(styles, /V4\.47 readable competition information/);
assert.match(styles, /\.competition-dialog-scroll \.tournament-panel :is\([\s\S]*?color: #17212b !important;/);
assert.match(styles, /\.competition-dialog-scroll \.tournament-match-status\.live \{[\s\S]*?color: #155e43 !important;[\s\S]*?background: #d9f1e6;/);
assert.match(styles, /\.competition-dialog-scroll \.tournament-set-scores span\.winner-set \{[\s\S]*?color: #164d3d !important;[\s\S]*?background: #d5ece3;/);
assert.match(styles, /\.competition-dialog-scroll \.championship-zone-content \{[\s\S]*?color: #17212b;[\s\S]*?background: #f7faf9;/);

console.log("V4.47 competition dialog contrast checks passed.");
