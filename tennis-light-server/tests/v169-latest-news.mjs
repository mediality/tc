import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, styles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
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

assert.match(html, /Tennis Courts Academy <span>v2\.169\.17<\/span>/);
assert.match(html, /styles\.css\?v=2\.169\.17/);
assert.match(html, /app\.js\?v=2\.169\.17/);
assert.match(app, /const CARD_ASSET_VERSION = "2.169.17"/);

const onlineClubHouseIndex = html.indexOf('class="menu-panel online-lobby-panel');
const latestNewsIndex = html.indexOf('id="latestNewsPanel"');
const posterIndex = html.indexOf('class="lobby-poster-panel"');
assert.ok(onlineClubHouseIndex >= 0 && latestNewsIndex > onlineClubHouseIndex);
assert.ok(posterIndex > latestNewsIndex);

const authenticatedUser = functionSource(app, "applyAuthenticatedUser");
assert.doesNotMatch(authenticatedUser, /NewsDialog|pendingNews/);
assert.doesNotMatch(app, /showNextProNewsDialog/);

const panel = functionSource(app, "renderLatestNewsPanel");
assert.match(panel, /DERNIÈRES ACTU/);
assert.match(panel, /latest-news-thumbnail/);
assert.match(panel, /latest-news-title/);
assert.match(panel, /latest-news-read-button/);
assert.match(panel, /data-read-game-news/g);
assert.match(panel, /showGameNewsDialog/);
assert.match(panel, /formatGameNewsDate/);

const dialog = functionSource(app, "showGameNewsDialog");
assert.match(dialog, /DERNIÈRES ACTU/);
assert.match(dialog, /data-close-pro-news>FERMER</);
assert.doesNotMatch(dialog, /markProNewsAsSeen/);

assert.match(app, /TC-new-Milan-Verhaegen\.webp/);
assert.match(styles, /\.latest-news-thumbnail\s*\{[\s\S]*width: 50px;[\s\S]*height: 50px;/);
assert.match(styles, /\.latest-news-thumbnail img\s*\{[\s\S]*transform: scale\(1\.85\)/);
assert.match(styles, /\.latest-news-read-button\s*\{[\s\S]*justify-self: end;[\s\S]*background: #facc15;/);
assert.match(styles, /\.latest-news-title:hover/);

console.log("v169 actualité Milan accessible depuis le lobby, sans ouverture automatique: OK");
