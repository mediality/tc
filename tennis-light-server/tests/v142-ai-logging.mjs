import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");

assert.match(app, /function hasSafeSoloContinuation\(playerIndex\)/);
assert.match(app, /if \(hasSafeSoloContinuation\(playerIndex\)\) return false;/);
assert.match(app, /card\.effectType !== "removeOpponentLast"/);
assert.match(app, /if \(cost >= 3 && !removesActiveThreat\) return targetValue >= 26;/);
assert.match(app, /removeOpponentLast: 30,/);
assert.match(app, /recordSoloAiDecision\("pass_secured_win"/);
assert.match(app, /recordSoloAiDecision\("boost"/);
assert.match(app, /recordAction\("effect_resolution"/);
assert.match(app, /recordAction\("remove_card"/);

assert.match(app, /const HUMAN_MATCH_LOG_STORAGE_KEY = "tennisLightHumanMatchLogsV1"/);
assert.match(app, /function completeHumanMatchTelemetry\(finalEntry\)/);
assert.match(app, /function humanMatchTelemetrySummary\(session\)/);
assert.match(app, /async function uploadHumanMatchTelemetry\(session\)/);
assert.match(app, /async function exportHumanMatchLogsFile\(\)/);
assert.match(html, /id="exportHumanMatchesButton"/);
assert.match(html, /id="adminExportHumanMatchesButton"/);

assert.match(server, /CREATE TABLE IF NOT EXISTS human_match_logs/);
assert.match(server, /async function saveHumanMatchLog\(user, payload\)/);
assert.match(server, /url\.pathname === "\/api\/human-match-logs"/);
assert.match(server, /url\.pathname === "\/api\/admin\/human-match-logs"/);

console.log("v142 IA et journal des parties humaines: OK");
