import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");
const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

assert.match(html, /Tennis Courts Academy <span>v148<\/span>/);
assert.match(html, /id="openAcademyInfoButton"[^>]*info-highlight-button[^>]*>DÉCOUVRIR L'ACADEMIE<\/button>/);
assert.match(html, /id="openCircuitInfoButton"[^>]*info-highlight-button[^>]*>EN SAVOIR PLUS<\/button>/);
assert.match(css, /\.info-highlight-button[\s\S]*?background:\s*#e57d9d;/);

assert.match(html, /class="circuit-info-feature"/);
assert.match(html, /src="\.\/assets\/circuit-pro-contigoat\.jpg"/);
await access(new URL("../public/assets/circuit-pro-contigoat.jpg", import.meta.url));
assert.match(css, /\.circuit-info-feature\s*\{[\s\S]*?grid-template-columns:/);

assert.match(html, /id="tournamentLoadingDialog"[^>]*aria-hidden="true"/);
assert.match(html, /class="tournament-loading-track"/);
assert.match(css, /@keyframes tournamentLoadingProgress/);
assert.match(app, /function showTournamentLoadingDialog\(/);
assert.match(app, /function hideTournamentLoadingDialog\(/);

for (const functionName of [
  "startWeeklyCompetition",
  "resumeWeeklyCompetition",
  "startAiClubHouseCompetition",
  "createFriendlyTournament",
  "joinFriendlyTournament",
  "resumeFriendlyTournament",
  "startFriendlyTournamentFromLobby",
  "createLobbyRoom",
  "joinLobbyRoom",
]) {
  const start = app.indexOf(`function ${functionName}(`);
  assert.ok(start >= 0, `${functionName} doit exister`);
  const nextFunction = app.indexOf("\nfunction ", start + 1);
  const nextAsyncFunction = app.indexOf("\nasync function ", start + 1);
  const boundaries = [nextFunction, nextAsyncFunction].filter((value) => value > start);
  const end = boundaries.length ? Math.min(...boundaries) : app.length;
  assert.match(app.slice(start, end), /showTournamentLoadingDialog\(/, `${functionName} doit afficher le chargement`);
}

assert.doesNotMatch(html, /v145/);
assert.doesNotMatch(app, /tennis-courts-human-matches-v145/);

console.log("v148 lobby, information Circuit et chargement des tournois: OK");
