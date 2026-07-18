import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `missing function: ${name}`);
  const bodyStart = app.indexOf(") {", start) + 2;
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`unterminated function: ${name}`);
}

assert.match(app, /if \(accountChanged\) clearAuthenticatedCircuitCaches\(\)/);
assert.match(app, /ensureGameplayProfile\(true\)/);
assert.match(app, /AUTH_STATE\.profileUserId === authenticatedUserId\(\) \? AUTH_STATE\.profile : null/);
assert.match(app, /authenticatedUserId\(\) !== userId/);

const context = {
  AUTH_STATE: {
    user: { id: "games-user" },
    profile: { user: { id: "admin-user" }, aiResults: [{ ai_character_id: "conti", wins: 6, losses: 0 }] },
    profileUserId: "admin-user",
    gameplayRanking: { currentUserRank: { id: "admin-user", score_ref: 3900 } },
    gameplayRankingUserId: "admin-user",
    ranking: null,
    rankingUserId: null,
    lobbyRanking: null,
    lobbyRankingUserId: null,
    competitions: { season: 1, week: 2 },
    competitionsUserId: "admin-user",
    rankingPage: 4,
  },
};
vm.createContext(context);
vm.runInContext(`
  ${functionSource("authenticatedUserId")}
  ${functionSource("clearAuthenticatedCircuitCaches")}
  ${functionSource("currentUserTournamentRanking")}
  ${functionSource("currentRankingTotalPoints")}
  ${functionSource("circuitHumanLevel")}
  ${functionSource("currentCircuitSaveKey")}
  this.api = { clearAuthenticatedCircuitCaches, currentRankingTotalPoints, circuitHumanLevel, currentCircuitSaveKey };
`, context);

assert.equal(context.api.currentRankingTotalPoints(), 0, "another account ranking must be ignored");
assert.equal(context.api.circuitHumanLevel(), 1, "a fresh account must use Circuit level 1");

context.AUTH_STATE.gameplayRanking = { currentUserRank: { id: "games-user", score_ref: 3100 } };
context.AUTH_STATE.gameplayRankingUserId = "games-user";
assert.equal(context.api.currentRankingTotalPoints(), 3100);
assert.equal(context.api.circuitHumanLevel(), 3);

context.AUTH_STATE.user = { id: "games-user" };
const gamesSaveKey = context.api.currentCircuitSaveKey("challenge");
context.AUTH_STATE.user = { id: "admin-user" };
const adminSaveKey = context.api.currentCircuitSaveKey("challenge");
assert.notEqual(gamesSaveKey, adminSaveKey, "local Circuit saves must be account-scoped");
assert.match(gamesSaveKey, /games-user/);

context.api.clearAuthenticatedCircuitCaches();
assert.equal(context.AUTH_STATE.profile, null);
assert.equal(context.AUTH_STATE.gameplayRanking, null);
assert.equal(context.AUTH_STATE.competitions, null);
assert.equal(context.AUTH_STATE.rankingPage, 1);

console.log("v143 account isolation and Circuit level: OK");
