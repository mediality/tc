import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, styles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
]);

assert.match(html, /Tennis Courts Academy <span>v160<\/span>/);
assert.match(html, /styles\.css\?v=160\.0/);
assert.match(html, /app\.js\?v=160\.0/);
assert.match(app, /const CARD_ASSET_VERSION = "160"/);

assert.match(app, /function showCardLocalPreview\(anchor, imageUrl, label = "Carte", immediate = false\)/);
assert.doesNotMatch(app, /matchMedia\("\(hover: hover\) and \(pointer: fine\)"\)/);
assert.match(app, /cardLocalPreviewTimer = window\.setTimeout\(renderPreview, 90\)/);
assert.match(app, /function positionCardLocalPreview\(preview, anchor, image\)/);
assert.match(app, /image\.naturalWidth \/ pixelRatio/);
assert.match(app, /image\.naturalHeight \/ pixelRatio/);
assert.match(app, /anchorRect\.left \+ \(\(anchorRect\.width - previewWidth\) \/ 2\)/);
assert.match(app, /anchorRect\.top \+ \(\(anchorRect\.height - previewHeight\) \/ 2\)/);
assert.doesNotMatch(app, /anchorRect\.right \+ gap \+ previewWidth/);
assert.match(app, /maximumViewportHeight \* imageRatio/);
assert.match(app, /function attachCardLocalPreviewHandlers\(root = document\)/);
assert.match(app, /button\.addEventListener\("pointerenter"/);
assert.match(app, /button\.addEventListener\("pointerdown"/);
assert.match(app, /function prepareCardTouchPreview\(button, imageUrl, label\)/);
assert.match(app, /function keepLocalPreviewOnFirstTouch\(button\)/);
assert.match(app, /if \(keepLocalPreviewOnFirstTouch\(button\)\) return/);
assert.match(app, /attachCardLocalPreviewHandlers\(root\)/);
assert.match(app, /data-image-hover="\$\{escapeHtml\(imageUrl\)\}"/);
assert.match(app, /attachCardLocalPreviewHandlers\(els\.academyDeckList\)/);
assert.match(app, /function openImageZoom\([\s\S]*?closeCardLocalPreview\(\)/);

assert.match(styles, /\.card-local-preview\s*\{[\s\S]*position: fixed;[\s\S]*z-index: 1000/);
assert.match(styles, /\.card-local-preview\s*\{[\s\S]*pointer-events: none/);
assert.match(styles, /\.card-local-preview\.visible\s*\{[\s\S]*opacity: 1/);
assert.doesNotMatch(styles, /@media \(hover: none\), \(pointer: coarse\)[\s\S]*card-local-preview/);
assert.match(styles, /\.image-zoom-backdrop\s*\{[\s\S]*z-index: 1010/);
assert.match(styles, /\.card-image-zoom-trigger\s*\{[\s\S]*cursor: zoom-in/);

console.log("v160 agrandissement au niveau de la carte sur ordinateur et mobile: OK");
