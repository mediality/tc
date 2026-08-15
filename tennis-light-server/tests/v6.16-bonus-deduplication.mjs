import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

assert.match(app, /const GAME_VERSION = "v6\.18"/);
assert.match(app, /const temporaryBonuses = player\.temporaryBonuses \|\| \[\]/);
assert.match(app, /\.\.\.temporaryBonuses,[\s\S]*\.\.\.\(player\.permanentBonuses/);
assert.match(app, /const normalizedLabel = withoutDurationSuffix/);
assert.match(app, /const statSignature = \["power", "precision", "placement", "endurance"\]/);
assert.match(app, /const identity = normalizedLabel/);
assert.match(app, /const provisional = temporaryBonuses\.includes\(bonus\)/);

const oldDuplicateIdentity = "const identity = bonus?.sourceBonusId || bonus?.id || bonus?.label;";
assert.equal(app.includes(oldDuplicateIdentity), false);

console.log("V6.18 bonus deduplication checks passed.");
