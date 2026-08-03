import assert from "node:assert/strict";
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const indexHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.51.0");
assert.match(indexHtml, /styles\.css\?v=4\.51\.0/);
assert.match(indexHtml, /app\.js\?v=4\.51\.0/);
assert.match(indexHtml, /Tennis Courts Academy · <span>v4\.51<\/span>/);

const syncPanelFunction = app.slice(
  app.indexOf("function renderServerSyncPanel()"),
  app.indexOf("\nfunction renderWaitingRoomModal", app.indexOf("function renderServerSyncPanel()")),
);
assert.match(syncPanelFunction, /document\.querySelector\("#serverSyncPanel"\)\?\.remove\(\);/);
assert.doesNotMatch(syncPanelFunction, /Match humain du tournoi|Partie en ligne|Synchronisé|Connexion/);
assert.doesNotMatch(syncPanelFunction, /append\(panel\)|innerHTML/);
assert.match(indexHtml, /id="desktopGameMenuToggle"[\s\S]*?>↓<\/button>/);
assert.match(indexHtml, /id="onlineForfeitButton"/);

console.log("V4.51 silent online header checks passed.");
