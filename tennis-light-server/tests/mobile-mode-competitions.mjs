import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, mobile, css] = await Promise.all([
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.js", import.meta.url), "utf8"),
  readFile(new URL("../public/mobile-game.css", import.meta.url), "utf8"),
]);

assert.match(app, /competition: state\.tournament\?\.active \? \{/);
assert.match(app, /league: Boolean\(state\.tournament\.league\)/);
assert.match(app, /standing: leagueHumanStandingReminder\(\)/);
assert.match(app, /points: state\.tournament\.weekly \? humanTournamentPoints\(\)\.points : null/);
assert.match(app, /state\.tournament\.matches \|\| \[\]/);
assert.match(app, /startTournamentNextMatchFromCenter\(\)/);
assert.match(app, /returnFriendlyMatchToClubHouse\(\)/);
assert.match(mobile, /function competitionMarkup\(competition\)/);
assert.match(mobile, /data-mobile-open-competition/);
assert.match(mobile, /mobileSheetMarkup\("competition"/);
assert.match(css, /\.mobile-competition-matches/);

console.log("Compatibilité mobile Tournoi, Circuit Pro, League et Club House : OK");
