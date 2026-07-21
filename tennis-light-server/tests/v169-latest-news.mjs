import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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

assert.match(html, /Tennis Courts Academy · 2\.169\.20/);
assert.match(html, /styles\.css\?v=170\.17/);
assert.match(html, /app\.js\?v=170\.17/);
assert.match(app, /const CARD_ASSET_VERSION = "169"/);
assert.match(server, /"\.svg": "image\/svg\+xml; charset=utf-8"/);

const latestNewsIndex = html.indexOf('id="latestNewsPanel"');
const accountPanelIndex = html.indexOf('id="lobbyAccountPanel"');
assert.ok(accountPanelIndex >= 0);
assert.equal(latestNewsIndex, -1);
assert.match(html, /id="homeNewsList"/);
assert.match(html, /class="lobby-hero"/);
assert.match(html, /src="\.\/assets\/HERO\.jpg"/);
assert.match(html, /id="lobbyProfileAvatar"/);
for (const asset of ["ENTRAINEMENT.jpg", "MODE-SOLO.jpg", "MODE-EN-LIGNE.jpg", "CIRCUIT-PRO.jpg"]) {
  assert.match(html, new RegExp(`src="\\.\\/assets\\/${asset.replace(".", "\\.")}"`));
}
for (const icon of ["TRAINING.svg", "SOLO.svg", "ONLINE.svg", "trophy-circuit.svg", "next.svg"]) {
  assert.match(html, new RegExp(`src="\\.\\/assets\\/icons\\/${icon.replace(".", "\\.")}"`));
}
for (const section of ["training", "solo", "online", "circuit"]) {
  assert.match(html, new RegExp(`data-open-lobby-section="${section}"`));
}
for (const format of ["match", "classic", "league"]) {
  assert.match(html, new RegExp(`data-ai-club-value="${format}"`));
}
assert.match(html, /Centre d'entraînement/);
assert.match(html, /Club House Solo/);
assert.match(html, /Club House en ligne/);
assert.match(html, /id="circuitRankProjection"/);
assert.match(html, /id="circuitAttemptsValue"/);
assert.match(html, /id="circuitPlayerProjection"/);
assert.match(html, /<h2>Top 20<\/h2>/);
assert.match(html, /Prêt à passer au niveau supérieur/);
assert.match(html, /href="https:\/\/mediality\.fr\/shop\/#tenniscourts"/);

const authenticatedUser = functionSource(app, "applyAuthenticatedUser");
assert.doesNotMatch(authenticatedUser, /NewsDialog|pendingNews/);
assert.doesNotMatch(app, /showNextProNewsDialog/);

const initMenu = functionSource(app, "initMenu");
assert.doesNotMatch(initMenu, /loadLobbyRanking\(\)/);
assert.doesNotMatch(initMenu, /loadRanking\(1\)/);
assert.doesNotMatch(initMenu, /loadCompetitions\(\)/);
assert.match(initMenu, /lobbySectionScreen[\s\S]*onlineSection[\s\S]*refreshLobbyRooms\(\)/);
const authenticatedCircuitRefresh = functionSource(app, "refreshAuthenticatedCircuitData");
assert.match(authenticatedCircuitRefresh, /canAccessProFeatures\(\)/);
assert.match(authenticatedCircuitRefresh, /loadRanking\(1\)/);
assert.doesNotMatch(authenticatedCircuitRefresh, /loadLobbyRanking|loadCompetitions|ensureGameplayProfile|ensureGameplayRanking/);
const lobbySection = functionSource(app, "showLobbySection");
assert.match(lobbySection, /section === "solo"[\s\S]*showAiClubHouseScreen\(\)/);
assert.match(lobbySection, /hideStandaloneScreens\(\)/);
assert.match(lobbySection, /section === "online"\) refreshLobbyRooms\(\)/);
assert.match(lobbySection, /section === "circuit"/);
const hiddenStandaloneScreens = functionSource(app, "hideStandaloneScreens");
for (const screen of ["profileScreen", "circuitInfoScreen", "academyInfoScreen", "friendlyLobbyScreen", "aiClubHouseScreen"]) {
  assert.match(hiddenStandaloneScreens, new RegExp(`els\\.${screen}`));
}
assert.match(html, /Disputez les tournois les plus prestigieux/);
assert.match(html, /inscrire votre nom dans la légende du Circuit/);
const avatar = functionSource(app, "updateLobbyProfileAvatar");
assert.match(avatar, /PROFILE_CHARACTER_IMAGES\[characterId\]/);
const circuitDashboard = functionSource(app, "renderCircuitDashboard");
assert.match(circuitDashboard, /retryLimit - retriesUsed/);
assert.match(circuitDashboard, /projected_rank/);
assert.match(circuitDashboard, /score_ref/);
assert.match(circuitDashboard, /score_week/);
const rankingMarkup = functionSource(app, "rankingMarkup");
assert.match(rankingMarkup, /ranking-position/);
assert.match(rankingMarkup, /projected_rank/);
assert.match(app, /pageSize=20/);
assert.match(app, /pageSize=25/);

const homeNews = functionSource(app, "renderHomeNewsSection");
assert.match(homeNews, /home-news-card/);
assert.match(homeNews, /data-read-game-news/);
assert.match(homeNews, /showGameNewsDialog/);
assert.match(homeNews, /PROFILE_CHARACTER_IMAGES\[characterId\]/);

const dialog = functionSource(app, "showGameNewsDialog");
assert.match(dialog, /DERNIÈRES ACTU/);
assert.match(dialog, /data-close-pro-news>FERMER</);
assert.doesNotMatch(dialog, /markProNewsAsSeen/);

assert.match(app, /TC-new-Milan-Verhaegen\.webp/);
assert.match(styles, /\.home-news-visual\s*\{[\s\S]*width: 120px;[\s\S]*height: 60px;/);
assert.match(styles, /\.home-news-title:hover/);
assert.match(html, /La vie de l’académie/);

console.log("v169 actualité Milan accessible depuis le lobby, sans ouverture automatique: OK");
