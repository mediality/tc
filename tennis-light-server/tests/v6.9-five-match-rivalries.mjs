import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const server = readFileSync(new URL("../server.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} introuvable`);
  let depth = 0;
  let opened = false;
  for (let index = start; index < app.length; index += 1) {
    if (app[index] === "{") { depth += 1; opened = true; }
    if (app[index] === "}") depth -= 1;
    if (opened && depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} incomplet`);
}

assert.equal(packageJson.version, "6.10.0");
assert.match(html, /Tennis Courts Academy · <span>V6\.10<\/span>/);
assert.match(html, /app\.js\?v=6\.10\.0/);

const context = {};
vm.runInNewContext(`${functionSource("confrontationStatus")}; results = [
  confrontationStatus("VVVVV", 6), confrontationStatus("VVVVD", 6),
  confrontationStatus("VVDDD", 6), confrontationStatus("VDDDD", 6), confrontationStatus("DDDDD", 6),
  confrontationStatus("VVVVV", 3), confrontationStatus("VVVVD", 3),
  confrontationStatus("VVDDD", 3), confrontationStatus("VDDDD", 3), confrontationStatus("DDDDD", 3),
  confrontationStatus("VVVDD", 6)
];`, context);
assert.deepEqual(Array.from(context.results, (result) => result?.bonusCount ?? null), [1, 0, 1, 2, 3, 2, 1, 0, 0, 1, null]);
assert.deepEqual(Array.from(context.results, (result) => result?.target ?? null), ["human", "human", "ai", "ai", "ai", "human", "human", "ai", "ai", "ai", null]);

assert.match(server, /recent_results TEXT NOT NULL DEFAULT ''/);
assert.match(server, /recent_results = EXCLUDED\.recent_results \|\| LEFT\(circuit_ai_results\.recent_results, 4\)/);
assert.match(server, /DELETE FROM circuit_ai_results WHERE ai_character_id = ANY/);
assert.match(server, /COACH_IDS\.has\(aiCharacterId\)/);
assert.match(styles, /\.confrontation-result\.victory \{ color: #15803d; \}/);
assert.match(styles, /\.confrontation-result\.defeat \{ color: #dc2626; \}/);
assert.match(app, /margin-left: auto|confrontation-summary/);

console.log("V6.10 five-match Circuit Pro rivalry checks passed.");
