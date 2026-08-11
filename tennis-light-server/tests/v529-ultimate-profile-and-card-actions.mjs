import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const energyIcon = readFileSync(new URL("../public/assets/icons/ultimate-energy.svg", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy · <span>V6\.8<\/span>/);
assert.match(app, /character-zone\$\{ULTIMATE_MODE\.active \? " ultimate-character-zone"/);
assert.match(app, /assets\/icons\/ultimate-energy\.svg/);
assert.match(app, /ULTIMATE_MODE\.active \? "" : "<strong>JOUER<\/strong>"/);
assert.match(app, /ultimate-card-play-button/);
assert.match(css, /ultimate-character-zone[^}]*character-stats[^}]*repeat\(3/s);
assert.match(css, /#59b5f7/);
assert.match(css, /#ff2c2c/);
assert.match(css, /#ffa500/);
assert.doesNotMatch(energyIcon, /<rect/);

console.log("V5.29 Ultimate-only profile and card action checks passed.");
