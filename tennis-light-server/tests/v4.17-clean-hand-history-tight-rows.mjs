import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.18.0");
assert.match(html, /styles\.css\?v=4\.18\.0/);
assert.match(html, /app\.js\?v=4\.18\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.18<\/span>/);

assert.match(app, /<div class="card-hover-panel">/);
assert.match(css, /\.hand \.card-hover-panel[\s\S]*?visibility:\s*hidden/);
assert.match(css, /\.hand \.card:hover \.card-hover-panel[\s\S]*?visibility:\s*visible/);
assert.match(css, /\.hand \.card-actions button:not\(:disabled\)[\s\S]*?border:\s*1px solid rgba\(255, 255, 255, \.2\)/);
assert.match(css, /\.desktop-played-slot[\s\S]*?height:\s*var\(--desktop-played-card-height\)[\s\S]*?place-items:\s*start center/);
assert.match(css, /\.desktop-history-latest > button\[data-open-latest-history-card\] img[\s\S]*?object-fit:\s*contain/);
assert.match(css, /\.action-log-entry\.result:has\(\.desktop-exchange-result\)[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) 34px/);

console.log("Version 4.17 : main épurée, historique non rogné et rangées resserrées : OK");
