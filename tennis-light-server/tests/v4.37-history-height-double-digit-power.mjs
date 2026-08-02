import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const index = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.37.0");
assert.match(index, /styles\.css\?v=4\.37\.0/);
assert.match(index, /app\.js\?v=4\.37\.0/);
assert.match(index, /Tennis Courts Academy · <span>v4\.37<\/span>/);

assert.match(styles, /V4\.37 content-height history drawer and readable double-digit power/);
assert.match(styles, /\.court > \.log\s*\{[\s\S]*?height: auto;[\s\S]*?max-height: calc\(100% - 92px\)/);
assert.match(styles, /\.desktop-history-drawer-content\s*\{\s*grid-template-rows: auto auto auto;/);
assert.match(styles, /\.desktop-history-drawer-content \.desktop-history-latest\s*\{\s*height: auto;/);

assert.match(app, /player\.power > 9 \? " double-digit-power" : ""/);
assert.match(styles, /\.character-power-reminder\.double-digit-power \.stat-value-power\s*\{[\s\S]*?grid-template-columns: 14px minmax\(0, auto\);[\s\S]*?gap: 1px;/);
assert.match(styles, /\.character-power-reminder\.double-digit-power strong\s*\{[\s\S]*?overflow: visible;[\s\S]*?font-weight: 1000;[\s\S]*?white-space: nowrap;/);

console.log("Version 4.37 : historique ajusté au contenu et puissance à deux chiffres toujours lisible : OK");
