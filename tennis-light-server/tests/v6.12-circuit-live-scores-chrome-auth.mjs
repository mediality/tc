import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const server = await readFile(new URL("../server.js", import.meta.url), "utf8");
const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} doit exister`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

const weeklyCircuit = functionSource(app, "startWeeklyTournamentMode");
assert.match(weeklyCircuit, /progressiveLiveScores:\s*true/);

const authRequest = functionSource(app, "authRequest");
assert.match(authRequest, /credentials:\s*"same-origin"/);
assert.match(authRequest, /cache:\s*"no-store"/);
assert.match(app, /\[els\.authEmailInput, els\.authPasswordInput\][\s\S]*event\.key !== "Enter"[\s\S]*loginAccount\(\)/);
assert.match(html, /app\.js\?v=6\.12\.0/);

const cookies = functionSource(server, "cookieOptions");
assert.match(cookies, /split\(","\)\[0\]/);
assert.match(cookies, /req\.socket\?\.encrypted/);
assert.doesNotMatch(cookies, /NODE_ENV/);

const sendJson = functionSource(server, "sendJson");
assert.match(sendJson, /cache-control": "no-store"/);

console.log("V6.12 circuit live scores and Chrome authentication passed.");
