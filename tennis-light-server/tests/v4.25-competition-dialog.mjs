import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.28.0");
assert.match(html, /id="competitionDialogButton"[\s\S]*?>Compétition<\/button>/);
assert.match(html, /id="competitionDialogClose"[\s\S]*?>×<\/button>/);
assert.match(html, /competition-dialog-scroll[\s\S]*?id="tournamentPanel"/);
assert.match(app, /function openCompetitionDialog\(\)/);
assert.match(app, /TOURNAMENT_PANEL_UI\.visible = true/);
assert.match(app, /if \(event\.key === "Escape"/);
assert.match(app, /const bottomSafety = 28/);
assert.match(css, /\.competition-dialog-scroll[\s\S]*?overflow:\s*auto/);
assert.match(css, /max-height:\s*calc\(100dvh - 44px\)/);
assert.match(css, /tournament-toggle-button\[data-toggle-tournament\][\s\S]*?display:\s*none/);

console.log("Version 4.25 : compétition dans une fenêtre superposée défilable : OK");
