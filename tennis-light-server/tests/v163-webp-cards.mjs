import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const cardsDirectory = path.join(root, "public/assets/cards");
const [html, app, styles, server, files] = await Promise.all([
  readFile(path.join(root, "public/index.html"), "utf8"),
  readFile(path.join(root, "public/app.js"), "utf8"),
  readFile(path.join(root, "public/styles.css"), "utf8"),
  readFile(path.join(root, "server.js"), "utf8"),
  readdir(cardsDirectory),
]);

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=170\.8/);
assert.match(html, /app\.js\?v=170\.8/);
assert.match(app, /const CARD_ASSET_VERSION = "170"/);

const webpCards = files.filter((file) => file.toLowerCase().endsWith(".webp"));
assert.equal(webpCards.length, 158);
assert.equal(files.filter((file) => /\.(?:jpe?g|png)$/i.test(file)).length, 0);

for (const file of webpCards) {
  const bytes = await readFile(path.join(cardsDirectory, file));
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `${file} n'est pas un RIFF WebP`);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${file} n'est pas un WebP valide`);
}

const references = [...app.matchAll(/assets\/cards\/([^"']+)/g)].map((match) => match[1]);
assert.ok(references.length > 100);
assert.ok(references.every((reference) => reference.endsWith(".webp")));
for (const reference of new Set(references)) await access(path.join(cardsDirectory, reference));

const totalBytes = (await Promise.all(webpCards.map(async (file) => (await stat(path.join(cardsDirectory, file))).size)))
  .reduce((sum, size) => sum + size, 0);
assert.ok(totalBytes < 30 * 1024 * 1024);

assert.match(server, /"\.webp": "image\/webp"/);
assert.match(styles, /src\*="\.webp"/);
assert.doesNotMatch(styles, /image-rendering: -webkit-optimize-contrast/);
assert.doesNotMatch(app, /assets\/cards\/[^"']+\.jpg/);

console.log("v169: 158 cartes WebP, références, cache, MIME et rendu naturel: OK");
