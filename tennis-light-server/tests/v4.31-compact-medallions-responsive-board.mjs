import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.31.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.31<\/span>/);
assert.match(styles, /V4\.31 compact player medallions/);
assert.match(styles, /grid-template-rows: clamp\(76px, 12dvh, 110px\) minmax\(0, 1fr\) clamp\(178px, 29dvh, 276px\)/);
assert.match(styles, /player-panel\[data-desktop-role="local"\] \.character-zone/);
assert.match(styles, /grid-template-columns: 54px minmax\(0, 1fr\) auto/);
assert.match(styles, /player-panel\[data-desktop-role="local"\] \.hand \.card:nth-child\(6n \+ 1\) \{ transform: rotate\(-4deg\)/);
assert.match(styles, /scale\(1\.26\) rotate\(0deg\) !important/);
assert.match(styles, /max-height: 100dvh/);
assert.match(styles, /max-height: 620px/);

console.log("Version 4.31 : médaillons compacts, main anglée et bords verticaux protégés : OK");
