import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.34.0");
assert.match(html, /Tennis Courts Academy · <span>v4\.34<\/span>/);
assert.match(html, /styles\.css\?v=4\.34\.0/);
assert.match(styles, /V4\.34 stable card angles/);
assert.match(styles, /--local-card-angle: -4deg/);
assert.match(styles, /:focus-within[\s\S]*rotate\(var\(--local-card-angle, 0deg\)\) !important/);
assert.match(styles, /\.character-card \{[\s\S]*overflow: hidden;[\s\S]*isolation: isolate/);
assert.match(styles, /clip-path: circle\(50% at 50% 50%\)/);
assert.match(styles, /character-endurance-reminder[\s\S]*visibility: visible !important;[\s\S]*opacity: 1 !important/);
assert.match(styles, /--opponent-hand-tuck: 50%/);
assert.match(styles, /translateY\(calc\(-1 \* var\(--opponent-hand-tuck\)\)\)/);
assert.match(styles, /max-height: 620px[\s\S]*--opponent-hand-tuck: 64%/);

console.log("Version 4.34 : inclinaison stable, énergie persistante, portrait rond et main adverse ajustable : OK");
