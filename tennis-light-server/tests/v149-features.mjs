import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, server, styles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../server.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
]);

assert.match(html, /Tennis Courts Academy <span>v2\.169\.17<\/span>/);
assert.match(html, /Club House en ligne/);
assert.doesNotMatch(html, /id="onlineFormatSelect"/);
assert.doesNotMatch(html, /id="createFriendlyTournamentButton"/);
assert.match(app, /MATCH AMICAL/);
assert.match(app, /TOURNOI CLASSIQUE/);
assert.match(app, /data-replay-solo-match/);
assert.match(app, /AI_CLUB_HOUSE_SAVE_PREFIX/);
assert.match(server, /friendlySelectionLimit/);
assert.match(server, /selectedFriendlyParticipants/);
assert.match(server, /hostReturnDeadline/);
assert.match(server, /userHasOpenFriendlyTournament/);
assert.match(styles, /friendly-player-card\.selected/);

console.log("v149 Club House en ligne, replay et sauvegarde solo: OK");
