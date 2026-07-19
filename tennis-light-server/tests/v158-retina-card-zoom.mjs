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

function webpDimensions(buffer) {
  assert.equal(buffer.toString("ascii", 0, 4), "RIFF");
  assert.equal(buffer.toString("ascii", 8, 12), "WEBP");
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    };
  }
  throw new Error(`Flux WebP non pris en charge: ${chunk}`);
}

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=169\.5/);
assert.match(html, /app\.js\?v=169\.5/);

const webpCards = cardFiles.filter((file) => file.toLowerCase().endsWith(".webp"));
assert.equal(webpCards.length, 158);
const dimensions = await Promise.all(webpCards.map(async (file) => ({
  file,
  ...webpDimensions(await readFile(path.join(cardsDirectory, file))),
})));
assert.equal(dimensions.filter(({ width, height }) => width >= 1462 && height >= 2076).length, 158);

assert.match(app, /const CARD_ASSET_VERSION = "169"/);
assert.match(app, /value\.startsWith\("assets\/cards\/"\) \? `\$\{value\}\?v=\$\{CARD_ASSET_VERSION\}`/);
assert.match(app, /function fitZoomImageToScreen\(image\)/);
assert.match(app, /window\.devicePixelRatio/);
assert.match(app, /sourcePixels\.width \/ pixelRatio/);
assert.match(app, /sourcePixels\.height \/ pixelRatio/);
assert.match(app, /window\.addEventListener\("resize", fit\)/);
assert.match(app, /attachResolutionAwareZoom\(backdrop\.querySelector\("\.image-zoom-figure img"\)\)/);
assert.match(app, /attachResolutionAwareZoom\(image\)/);
assert.match(styles, /\.card-image-zoom-trigger\s*\{[\s\S]*cursor: zoom-in/);

console.log("v169 cartes WebP x2, cache actualisé et loupe adaptée à la densité: OK");
