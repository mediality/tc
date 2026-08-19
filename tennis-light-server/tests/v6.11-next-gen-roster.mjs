import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const ids = [
  "nellAshcombe", "dylanWainforde", "dynastiaAbreu", "renataSolvera",
  "viktorSerevin", "milaWierczek", "kostasMikolas", "edouardSaintVenant",
];

assert.equal(packageJson.version, "6.19.0");
for (const id of ids) {
  assert.match(app, new RegExp(`\\b${id}\\b`), `${id} must be integrated in the client`);
  assert.match(server, new RegExp(`\\b${id}\\b`), `${id} must be integrated in the server`);
}

const poolBlock = app.match(/const TOURNAMENT_CHARACTER_POOL = ([^;]+);/)?.[1] || "";
assert.match(poolBlock, /NEXT_GEN_TOURNAMENT_PLAYERS/);
assert.doesNotMatch(poolBlock, /COACH_OPTIONS/);
assert.doesNotMatch(app.match(/function uniqueTournamentAiEntries[\s\S]*?\n}/)?.[0] || "", /COACH_OPTIONS|::duplicate:/);
assert.doesNotMatch(app.match(/function thirtyTwoPlayerTournamentAiEntries[\s\S]*?\n}/)?.[0] || "", /COACH_OPTIONS|::duplicate:/);
assert.match(server, /ALL_PROFILE_CHARACTER_IDS[^\n]+NEXT_GEN_CHARACTER_IDS/);
assert.match(server.match(/const CIRCUIT_AI_CHARACTER_IDS =[^;]+;/)?.[0] || "", /NEXT_GEN/);

const pointsBlock = server.match(/const NEXT_GEN_CIRCUIT_POINTS = \{([\s\S]*?)\n};/)?.[1] || "";
const points = [...pointsBlock.matchAll(/:\s*(\d+)/g)].map((match) => Number(match[1]));
assert.equal(points.length, 8);
assert.ok(points.every((point) => point >= 1 && point <= 100));
assert.doesNotMatch(server, /ranking_only: true/);

const cardDir = path.join(root, "public/assets/cards");
const nextGenAssets = fs.readdirSync(cardDir).filter((name) => name.startsWith("nextgen-25to32-") && name.endsWith(".webp"));
assert.equal(nextGenAssets.length, 40);

console.log("V6.11 NEXT GEN roster and coach-free Solo draws checks passed.");
