import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const cardsDirectory = path.join(root, "public/assets/cards");
const [html, app, styles, cardFiles] = await Promise.all([
  readFile(path.join(root, "public/index.html"), "utf8"),
  readFile(path.join(root, "public/app.js"), "utf8"),
  readFile(path.join(root, "public/styles.css"), "utf8"),
  readdir(cardsDirectory),
]);

function jpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error("Dimensions JPEG introuvables");
}

assert.match(html, /Tennis Courts Academy <span>v159<\/span>/);
assert.match(html, /styles\.css\?v=159\.0/);
assert.match(html, /app\.js\?v=159\.0/);

const jpgCards = cardFiles.filter((file) => file.toLowerCase().endsWith(".jpg"));
assert.equal(jpgCards.length, 158);
const dimensions = await Promise.all(jpgCards.map(async (file) => ({
  file,
  ...jpegDimensions(await readFile(path.join(cardsDirectory, file))),
})));
assert.equal(dimensions.filter(({ width, height }) => width >= 1462 && height >= 2076).length, 158);

assert.match(app, /const CARD_ASSET_VERSION = "159"/);
assert.match(app, /value\.startsWith\("assets\/cards\/"\) \? `\$\{value\}\?v=\$\{CARD_ASSET_VERSION\}`/);
assert.match(app, /function fitZoomImageToScreen\(image\)/);
assert.match(app, /window\.devicePixelRatio/);
assert.match(app, /image\.naturalWidth \/ pixelRatio/);
assert.match(app, /image\.naturalHeight \/ pixelRatio/);
assert.match(app, /window\.addEventListener\("resize", fit\)/);
assert.match(app, /attachResolutionAwareZoom\(backdrop\.querySelector\("\.image-zoom-figure img"\)\)/);
assert.match(app, /attachResolutionAwareZoom\(image\)/);
assert.match(styles, /\.card-image-zoom-trigger\s*\{[\s\S]*cursor: zoom-in/);

console.log("v159 cartes x2, cache actualisé et loupe adaptée à la densité: OK");
