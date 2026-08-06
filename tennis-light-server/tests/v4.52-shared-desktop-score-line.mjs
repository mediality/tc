import assert from "node:assert/strict";
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const indexHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

assert.equal(packageJson.version, "4.52.0");
assert.match(indexHtml, /styles\.css\?v=5\.20\.0/);
assert.match(indexHtml, /app\.js\?v=5\.20\.0/);
assert.match(indexHtml, /Tennis Courts Academy · <span>V5\.20<\/span>/);

const desktopScoreFunction = app.slice(
  app.indexOf("function renderDesktopMatchScore()"),
  app.indexOf("\nfunction renderCenterNextExchangeButton", app.indexOf("function renderDesktopMatchScore()")),
);
assert.match(desktopScoreFunction, /const localIndex = mobileLocalPlayerIndex\(\);/);
assert.match(desktopScoreFunction, /desktop-match-score-list/);
assert.match(desktopScoreFunction, /desktop-exchange-score-line/);
assert.match(desktopScoreFunction, /playerAvatar\(localIndex, localPlayer, "player"\)/);
assert.match(desktopScoreFunction, /playerAvatar\(opponentIndex, opponentPlayer, "opponent"\)/);
assert.match(desktopScoreFunction, /Score de puissance/);
assert.doesNotMatch(desktopScoreFunction, /SERVER_SYNC|SOLO_AI/);

assert.match(styles, /V4\.52 identical solo\/online desktop score line/);
assert.match(styles, /\.desktop-match-score \{[\s\S]*?z-index: 530 !important;[\s\S]*?display: grid !important;[\s\S]*?visibility: visible;/);
assert.match(styles, /\.desktop-match-score\.hidden \{[\s\S]*?display: none !important;/);

console.log("V4.52 shared desktop score line checks passed.");
