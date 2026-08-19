import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const index = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} doit exister`);
  const next = app.indexOf("\nfunction ", start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

assert.equal(pkg.version, "6.19.0");
assert.match(app, /const GAME_VERSION = "v6\.19"/);
assert.match(index, /Tennis Courts Academy · <span>V6\.19<\/span>/);

const dialog = functionSource("openDesktopBonusDialog");
assert.match(dialog, /\.filter\(\(bonus\) => !Number\(bonus\?\.remainingExchanges \|\| 0\)\)/);
assert.match(dialog, /displayedEffectBonusIds\.has\(bonusIdentity\(label\)\)/);
assert.match(dialog, /bonusIdentity\(candidate\.label\)/);
assert.ok(dialog.indexOf("...effectBadges.map") < dialog.indexOf("...simpleBonuses.map"), "la version avec durée doit rester prioritaire");

console.log("V6.19 dédoublonnage des bonus sur deux échanges : OK");
