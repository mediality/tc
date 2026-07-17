import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");

assert.match(app, /function startOpponentHandReveal\(viewerIndex, opponentIndex\)/);
assert.match(app, /expiresAt: Date\.now\(\) \+ 10_000/);
assert.match(app, /Terminer la visualisation · \$\{remaining\} s/);
assert.match(app, /cardUids: opponent\.hand\.map\(\(card\) => card\.uid\)/);
assert.match(app, /if \(localHumanControlsPlayer\(playerIndex\)\) startOpponentHandReveal/);
assert.match(app, /state\.effectNotice = null/);
assert.match(app, /knownOpponentCards: expertKnownOpponentCards\(playerIndex\)\.map\(cardLogInfo\)/);
assert.match(app, /const temporarilyRevealed = isOpponentHandTemporarilyRevealed\(playerIndex\)/);

assert.match(app, /function showConfrontationIntro\(\)/);
assert.match(app, /Date\.now\(\) \+ 5_000/);
assert.match(app, /const image = PROFILE_CHARACTER_IMAGES\[player\?\.characterId\]/);
assert.match(app, /const participantName = isHuman[\s\S]*?player\?\.nickname/);
assert.match(app, /state\.tournament\.competitionCity/);
assert.match(app, /state\.tournament\.competitionFlag/);
assert.match(app, /currentOpponentConfrontationStatus\(\)/);
assert.match(app, /queueConfrontationIntro\(\)/);
assert.match(css, /\.confrontation-intro-backdrop/);
assert.match(css, /background: rgba\(0, 0, 0, 0\.5\)/);

assert.match(app, /state\.tournament\?\.humanNickname\s+\|\| AUTH_STATE\.user\?\.nickname/);
assert.match(app, /createPlayer\(characterNameFromId\(humanCharacterId\), humanCharacterId, state\.tournament\?\.humanNickname \|\| nicknameValue\(\)\)/);
assert.match(app, /async function saveProfileCharacter\(\)[\s\S]*?showProfileScreen\(\)/);
assert.match(html, /id="backToLobbyFromCharacterButton"/);
assert.match(app, /backToLobbyFromCharacterButton\?\.addEventListener\("click", showMenuScreen\)/);

assert.match(css, /\.opponent-hand-reveal-controls/);
assert.match(html, />CLUB HOUSE<\/button>/);

console.log("v137 effets joueurs et interfaces: OK");
