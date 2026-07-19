import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, styles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
]);

assert.match(html, /Tennis Courts Academy <span>v159<\/span>/);
assert.match(html, /styles\.css\?v=159\.0/);
assert.match(html, /app\.js\?v=159\.0/);
assert.match(app, /const CARD_ASSET_VERSION = "159"/);

assert.match(app, /function showCardHoverPreview\(anchor, imageUrl, label = "Carte"\)/);
assert.match(app, /window\.matchMedia\("\(hover: hover\) and \(pointer: fine\)"\)\.matches/);
assert.match(app, /cardHoverTimer = window\.setTimeout\([\s\S]*?, 120\)/);
assert.match(app, /function positionCardHoverPreview\(preview, anchor, image\)/);
assert.match(app, /image\.naturalWidth \/ pixelRatio/);
assert.match(app, /image\.naturalHeight \/ pixelRatio/);
assert.match(app, /anchorRect\.right \+ gap \+ previewWidth/);
assert.match(app, /anchorRect\.left - gap - previewWidth/);
assert.match(app, /maximumViewportHeight \* imageRatio/);
assert.match(app, /function attachCardHoverHandlers\(root = document\)/);
assert.match(app, /button\.addEventListener\("pointerenter"/);
assert.match(app, /button\.addEventListener\("pointerleave", closeCardHoverPreview\)/);
assert.match(app, /attachCardHoverHandlers\(root\)/);
assert.match(app, /data-image-hover="\$\{escapeHtml\(imageUrl\)\}"/);
assert.match(app, /attachCardHoverHandlers\(els\.academyDeckList\)/);
assert.match(app, /function openImageZoom\([\s\S]*?closeCardHoverPreview\(\)/);

assert.match(styles, /\.card-hover-preview\s*\{[\s\S]*position: fixed;[\s\S]*z-index: 139/);
assert.match(styles, /\.card-hover-preview\s*\{[\s\S]*pointer-events: none/);
assert.match(styles, /\.card-hover-preview\.visible\s*\{[\s\S]*opacity: 1/);
assert.match(styles, /@media \(hover: none\), \(pointer: coarse\)/);
assert.match(styles, /\.card-image-zoom-trigger\s*\{[\s\S]*cursor: zoom-in/);

console.log("v159 loupe au survol puis agrandissement maximal au clic: OK");
