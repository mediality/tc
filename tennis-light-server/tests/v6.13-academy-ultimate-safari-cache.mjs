import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} doit exister`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

assert.equal(packageJson.version, "6.17.0");
assert.match(app, /const GAME_VERSION = "v6\.17"/);
assert.match(html, /Tennis Courts Academy · <span>V6\.17<\/span>/);
for (const asset of ["styles.css", "mobile-game.css", "app.js", "mobile-game.js"]) {
  assert.match(html, new RegExp(`${asset.replace(".", "\\.")}\\?v=6\\.17\\.0`));
}
assert.match(html, /tutorial-engine\.js\?v=3\.86\.0/);
assert.match(html, /ultimate-card-data\.js\?v=5\.35\.0/);

const academyLaunch = functionSource(app, "startSoloFromMenu");
assert.match(academyLaunch, /deactivateUltimateMode\(\)/);
const circuitLaunch = functionSource(app, "startWeeklyCompetition");
assert.match(circuitLaunch, /deactivateUltimateMode\(\)/);
const circuitResume = functionSource(app, "resumeWeeklyCompetition");
assert.match(circuitResume, /restoreStateSnapshot\(saved\)[\s\S]*deactivateUltimateMode\(\)/);
assert.match(functionSource(app, "startTournamentMode"), /deactivateUltimateMode\(\)/);
assert.match(functionSource(app, "startLeagueTournamentMode"), /deactivateUltimateMode\(\)/);
const deactivateUltimate = functionSource(app, "deactivateUltimateMode");
assert.match(deactivateUltimate, /ULTIMATE_MODE\.active = false/);
assert.match(deactivateUltimate, /state\.ultimateDecks = \[\[\], \[\]\]/);
assert.match(deactivateUltimate, /ultimatePlayerDialog\?\.classList\.add\("hidden"\)/);

const staticServer = functionSource(server, "serveStatic");
assert.match(staticServer, /type\.includes\("javascript"\)/);
assert.match(staticServer, /type\.includes\("text\/css"\)/);
assert.match(staticServer, /no-store, no-cache, must-revalidate/);
assert.match(staticServer, /pragma: "no-cache"/);

console.log("V6.13 Academy/Ultimate isolation and Safari cache invalidation passed.");
