import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const [html, app, styles, server] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../server.js", import.meta.url), "utf8"),
]);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = source.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

for (const icon of ["MATCH.svg", "LEAGUE.svg", "JOIN.svg", "JUST-WATCH.svg", "VALID.svg"]) {
  await access(new URL(`../public/assets/icons/${icon}`, import.meta.url));
}

assert.match(html, /Tennis Courts Academy · 2\.169\.14/);
assert.match(html, /styles\.css\?v=170\.10/);
assert.match(html, /app\.js\?v=170\.10/);
assert.match(html, /academy-upgrade-cta/);
assert.match(html, /TENNIS COURTS — LE JEU COMPLET/);
assert.match(html, /10 joueurs à incarner/);
assert.match(html, /plus de 500 cartes/);
assert.match(html, /construire votre style/);
assert.match(html, /https:\/\/www\.tenniscourts\.cc/);
assert.doesNotMatch(html, /class="lobby-shop-banner"/);

const lobbyRooms = functionSource(app, "renderLobbyRooms");
for (const icon of ["MATCH.svg", "LEAGUE.svg", "JOIN.svg", "JUST-WATCH.svg"]) {
  assert.match(lobbyRooms, new RegExp(icon.replace(".", "\\.")));
}

const clubhouse = functionSource(app, "renderFriendlyLobbyScreen");
assert.match(clubhouse, /VALID\.svg/);
assert.match(clubhouse, /LANCER L’ÉVÉNEMENT/);
assert.match(clubhouse, /data-resume-friendly-match/);
assert.doesNotMatch(clubhouse, /club-house-tournoi\.jpg/);

const launch = functionSource(app, "startFriendlyTournamentFromLobby");
assert.match(launch, /selectedCount/);
assert.match(launch, /highlight:/);

const spectatorEnd = functionSource(app, "showFriendlySpectatorMatchEndDialog");
assert.match(spectatorEnd, /FIN DU MATCH/);
assert.match(spectatorEnd, /let remaining = 5/);
assert.match(spectatorEnd, /match\.playerA/);
assert.match(spectatorEnd, /match\.playerB/);
assert.match(spectatorEnd, /match\.score/);

const leave = functionSource(app, "leaveFriendlyTournamentLobby");
assert.match(leave, /risque le forfait|peut entraîner un forfait/);
assert.match(leave, /destination === "online"/);
assert.match(app, /friendlyLobbyHomeButton[\s\S]*leaveFriendlyTournamentLobby\(\{ destination: "online" \}\)/);
assert.match(server, /graceSeconds = FRIENDLY_RECONNECT_GRACE_MS \/ 1000/);
assert.match(server, /circuitWorldRankForUser/);
assert.match(server, /worldRank/);

assert.doesNotMatch(app, /\(signé - Coach Ju\)/);
assert.match(functionSource(app, "showGameNewsDialog"), /PROFILE_CHARACTER_IMAGES\[characterId\]/);
assert.match(styles, /\.academy-upgrade-cta/);
assert.match(styles, /grid-template-columns: minmax\(0, 45%\) minmax\(0, 55%\)/);
assert.match(styles, /@media \(max-width: 768px\)/);
assert.match(styles, /prefers-reduced-motion/);

console.log("v2.169.14 Club House en ligne et promotion de la home: OK");
