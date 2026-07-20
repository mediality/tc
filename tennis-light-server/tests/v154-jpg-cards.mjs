import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const cardsDirectory = path.join(root, "public/assets/cards");
const [html, app, styles, files] = await Promise.all([
  readFile(path.join(root, "public/index.html"), "utf8"),
  readFile(path.join(root, "public/app.js"), "utf8"),
  readFile(path.join(root, "public/styles.css"), "utf8"),
  readdir(cardsDirectory),
]);

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=169\.7/);
assert.match(html, /app\.js\?v=169\.7/);

const webpCards = files.filter((file) => file.toLowerCase().endsWith(".webp"));
const jpgCards = files.filter((file) => file.toLowerCase().endsWith(".jpg"));
const pngCards = files.filter((file) => file.toLowerCase().endsWith(".png"));
assert.equal(webpCards.length, 158);
assert.equal(jpgCards.length, 0);
assert.equal(pngCards.length, 0);

const cardReferences = [...app.matchAll(/assets\/cards\/([^"']+)/g)].map((match) => match[1]);
assert.ok(cardReferences.length > 100);
assert.ok(cardReferences.every((reference) => reference.endsWith(".webp")));
for (const reference of new Set(cardReferences)) {
  await access(path.join(cardsDirectory, reference));
}

const totalBytes = (await Promise.all(webpCards.map(async (file) => (await stat(path.join(cardsDirectory, file))).size)))
  .reduce((sum, size) => sum + size, 0);
assert.ok(totalBytes < 30 * 1024 * 1024, `dossier WebP x2 trop volumineux: ${totalBytes} octets`);

assert.match(styles, /Les cartes V165 sont des WebP sans transparence/);
assert.match(styles, /\.card-visual > img\[src\*="assets\/cards\/"\]\[src\*="\.webp"\]/);
assert.match(styles, /\.character-card > img\[src\*="assets\/cards\/"\]\[src\*="\.webp"\]/);
assert.match(styles, /\.played-visual > img\[src\*="assets\/cards\/"\]\[src\*="\.webp"\]/);
assert.match(styles, /\.image-zoom-figure img\[src\*="assets\/cards\/"\]\[src\*="\.webp"\]/);
assert.doesNotMatch(styles, /\.character-card > img\s*[,\{]/);
assert.match(styles, /border-radius: 6% \/ 4\.25%/);
assert.match(styles, /border: clamp\(1px, 0\.28vw, 3px\) solid/);

console.log("v169 remplacement intégral des cartes JPG par WebP et bordure de masquage: OK");
