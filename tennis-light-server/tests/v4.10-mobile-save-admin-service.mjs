import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const mobile = fs.readFileSync(new URL("../public/mobile-game.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.10.0");
assert.match(html, /styles\.css\?v=4\.10\.0/);
assert.match(html, /app\.js\?v=4\.10\.0/);
assert.match(html, /mobile-game\.js\?v=4\.10\.0/);
assert.match(html, /Tennis Courts Academy · <span>v4\.10<\/span>/);

assert.doesNotMatch(app, /La contrainte de retour de service disparaît avec le service supprimé/);
assert.match(app, /function localMatchIsCompleted\(\)[\s\S]*state\.setMatch\?\.enabled[\s\S]*state\.setMatch\.matchOver/);
assert.match(app, /status: completed \? "completed" : "active"/);
assert.match(app, /function manuallySaveMatch\(\)/);
assert.match(app, /saveMatch: manuallySaveMatch/);
assert.match(html, /id="saveMatchButton"[^>]*>Sauvegarder<\/button>/);
assert.match(mobile, /data-mobile-save-match/);

assert.match(html, /id="lobbySettingsButton"[^>]*data-required-role="admin"[^>]*aria-label="Ouvrir l’administration"/);
assert.match(html, /assets\/icons\/admin\.svg/);
assert.doesNotMatch(html, /id="manageUsersButton"/);
assert.match(app, /lobbySettingsButton\?\.addEventListener\("click", showAdminScreen\)/);
assert.doesNotMatch(app, /lobbySettingsButton\?\.addEventListener\("click", toggleAccountPanel\)/);
assert.match(app, /lobbyUserButton\?\.addEventListener\("click", toggleAccountPanel\)/);

console.log("Version 4.10 : service mobile, sauvegardes et accès profil/admin : OK");
