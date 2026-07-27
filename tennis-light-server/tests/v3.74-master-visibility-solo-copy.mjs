import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.74.0");
assert.match(app, /const GAME_VERSION = "v3\.74"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.74<\/span>/);
assert.match(app, /const drawPending = Boolean\(state\.tournament\.friendlyCompetitionControl\?\.drawRequired\)/);
assert.match(app, /drawPending \? "" : `<section class="championship-lobby-section">/);
assert.match(app, /\.filter\(\(day\) => day <= activeGroupDay\)/);
assert.match(app, /Tour 1 · Phase de groupes/);
assert.match(app, /Tour 2 · Barrages/);
assert.match(app, /Tour 3 · Tour final/);
assert.match(app, /\$\{masterControlMarkup\}[\s\S]*friendly-visibility-section/);
assert.match(app, /data-friendly-master-control="simulate"/);
assert.equal((server.match(/selectedFriendlyParticipants\(tournament\)\.length >= 2/g) || []).length, 2);
assert.match(server, /selectedFriendlyParticipants\(tournament\)\.length < 2/);
assert.match(app, /Une partie ne peut pas être lancée avec un seul joueur sélectionné/);
assert.match(styles, /\.event-confirm-panel \.event-transition-actions \{ justify-content: center; \}/);
assert.match(styles, /\.online-clubhouse-room-panel \.friendly-master-board \*/);
assert.match(html, /Le Match Solo est le format le plus simple et le plus immédiat/);
assert.match(html, /Le Championnat est le format le plus long et le plus complet du Mode Solo/);
assert.match(html, /Le 1 Point Master réunit 24 participants/);
assert.doesNotMatch(html, /Reprednre l'animation finale/);

console.log("v3.74 Master visibility and Solo copy checks passed");
