import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "public/styles.css"), "utf8");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

assert.equal(pkg.version, "3.68.0");
assert.match(app, /const GAME_VERSION = "v3\.68"/);
assert.match(html, /Tennis Courts Academy · <span>v3\.68<\/span>/);

assert.match(server, /function friendlyMasterControl\(/);
assert.match(server, /function friendlyControlParticipantIds\(/);
assert.match(server, /ids = new Set\(\[tournament\.creatorParticipantId\]/);
assert.match(server, /Date\.now\(\) \+ 10000/);
assert.match(server, /competition-control/);
assert.match(server, /Tous les matchs du tour doivent être terminés/);
assert.match(server, /Les barrages ne peuvent pas être simulés tant qu’un joueur humain y participe/);
assert.match(server, /participant\.id !== tournament\.lastEliminatedParticipantId/);
assert.match(server, /Seul le dernier joueur humain éliminé peut simuler la suite/);

assert.match(server, /function separatedOnePointMasterGroups\(/);
assert.match(server, /excludedGroups = new Set\(\)/);
assert.match(server, /tournament\.distribution === "separated"/);
assert.match(server, /previousFormat !== "onepointmaster"[\s\S]*\? "reward"/);

assert.match(app, /data-friendly-master-control="draw"/);
assert.match(app, /data-friendly-master-control="next"/);
assert.match(app, /MATCH SUIVANT · 10 S/);
assert.match(app, /function controlFriendlyCompetition\(/);
assert.match(app, /friendly-master-calendar-columns/);
assert.match(styles, /\.friendly-master-calendar-columns \{[\s\S]*grid-template-columns: repeat\(4/);
assert.match(styles, /\.friendly-master-standing \.friendly-standing-head,[\s\S]*repeat\(4, minmax\(58px, 70px\)\)/);

console.log("v3.68 : Club House Master, autorité, tirages, lancement, simulations et calendrier : OK");
