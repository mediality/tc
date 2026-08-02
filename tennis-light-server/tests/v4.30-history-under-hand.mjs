import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.32.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.32<\/span>/);
assert.match(styles, /\.court > \.log \{[\s\S]*z-index: 1 !important/);
assert.match(styles, /player-panel\[data-desktop-role="local"\][\s\S]*z-index: 300 !important/);
assert.match(styles, /\.hand \.card \{[\s\S]*z-index: 320 !important/);
assert.match(styles, /width: clamp\(360px, 42vw, 760px\) !important/);

console.log("Version 4.30 : historique strictement sous la main et logo agrandi : OK");
