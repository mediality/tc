import assert from "node:assert/strict";
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const indexHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.48.0");
assert.match(indexHtml, /styles\.css\?v=4\.48\.0/);
assert.match(indexHtml, /app\.js\?v=4\.48\.0/);
assert.match(indexHtml, /mobile-game\.js\?v=4\.48\.0/);
assert.match(indexHtml, /Tennis Courts Academy · <span>v4\.48<\/span>/);

assert.match(app, /function desktopPlayerPresentation\(\) \{[\s\S]*?const local = mobileLocalPlayerIndex\(\);[\s\S]*?opponent: opponentOf\(local\)/);
assert.match(app, /const desktopPlayers = desktopPlayerPresentation\(\);[\s\S]*?renderPlayerPanel\(desktopPlayers\.local, els\.player1Panel\);[\s\S]*?renderPlayerPanel\(desktopPlayers\.opponent, els\.player2Panel\);/);
assert.match(app, /root\.dataset\.desktopRole = playerIndex === localPlayerIndex \? "local" : "opponent";/);
assert.match(app, /if \(SERVER_SYNC\.enabled\) return SERVER_SYNC\.ready && onlineRoomReady\(\) && playerIndex === SERVER_SYNC\.seat;/);
assert.match(app, /const winner = sharedHumanMatch[\s\S]*?state\.setMatch\.matchWinner === 0 \? match\.playerA : match\.playerB/);
assert.match(app, /const finalSharedState = sharedHumanMatch \? exportSyncState\(\) : null;/);

console.log("V4.48 local human desktop presentation checks passed.");
