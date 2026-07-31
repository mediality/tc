import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

assert.equal(packageJson.version, "4.27.0");
assert.match(html, /gameAlwaysVisibleActionsToggle/);
assert.match(html, /Boutons toujours visibles/);
assert.match(app, /tennisLightAlwaysVisibleActions/);
assert.match(app, /game-actions-always-visible/);
assert.match(css, /game-actions-always-visible[\s\S]*?\.card-actions[\s\S]*?pointer-events:\s*auto/);

console.log("Version 4.19 : boutons de la main toujours visibles en option : OK");
