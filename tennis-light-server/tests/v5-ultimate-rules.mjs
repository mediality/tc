import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const mobileJs = fs.readFileSync(path.join(root, "public/mobile-game.js"), "utf8");
const mobileCss = fs.readFileSync(path.join(root, "public/mobile-game.css"), "utf8");

assert.match(html, /id="ultimateModeButton"[\s\S]*data-required-role="admin"/);
assert.match(html, /Draft 1 sur 3/);
assert.match(html, /Énergie 💡/);
assert.match(html, /deux emplacements de réserve/i);
assert.match(app, /ULTIMATE_STARTING_ENERGY = 3/);
assert.match(app, /ULTIMATE_DECK_SIZE = 48/);
assert.match(app, /ultimateDecks: \[\[\], \[\]\]/);
assert.match(app, /player\.endurance = STARTING_ENDURANCE/);
assert.match(app, /card\._fromReserve = true/);
assert.match(css, /@media \(max-width: 860px\)[\s\S]*\.ultimate-resources/);
assert.doesNotMatch(mobileJs, /ULTIMATE_MODE|ultimate-resources|ultimateModeButton/);
assert.doesNotMatch(mobileCss, /ultimate-resources|lobby-mode-ultimate/);

console.log("V5 Ultimate admin, rules, resources and mobile isolation checks passed.");
