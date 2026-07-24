import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(pkg.version, "3.5.0");
assert.match(app, /const GAME_VERSION = "v3\.5"/);
assert.match(html, /Tennis Courts Academy · <strong id="gameVersion">v3\.5<\/strong>/);
assert.match(html, /app\.js\?v=3\.5/);
assert.match(html, /styles\.css\?v=3\.5/);

assert.match(app, /const singleEntryLeague = competition\.eventType === "League"/);
assert.match(app, /const replayLocked = alreadyPlayed && singleEntryLeague/);
assert.match(app, /replayLocked \? "Terminé"/);
assert.match(app, /Participation terminée/);
assert.match(app, /single-entry-league-badge">Non rejouable/);
assert.match(css, /\.single-entry-league-badge/);

assert.match(server, /const singleEntryLeague = competition\.eventType === "League"/);
assert.match(server, /alreadyPlayed && singleEntryLeague/);
assert.match(server, /Ce tournoi ne peut pas être retenté/);
assert.match(server, /return true;\s*\}\s*const retryInfo/s);

const newsSentence = "À noter cependant que, contrairement aux autres tournois, les Leagues ne sont pas rejouables dans la semaine. Bons matchs !";
assert.ok(app.includes(newsSentence));
assert.ok(server.includes(newsSentence));

console.log("v2.169.31 single-entry Prestige and Ultimate Leagues: OK");
