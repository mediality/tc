import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, styles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
]);

assert.match(html, /Tennis Courts Academy <span>v161<\/span>/);
assert.match(html, /styles\.css\?v=161\.0/);
assert.match(html, /app\.js\?v=161\.1/);
assert.match(app, /const CARD_ASSET_VERSION = "161"/);

assert.match(app, /function showCardLocalPreview\(anchor, imageUrl, label = "Carte", immediate = false\)/);
assert.doesNotMatch(app, /matchMedia\("\(hover: hover\) and \(pointer: fine\)"\)/);
assert.match(app, /cardLocalPreviewTimer = window\.setTimeout\(renderPreview, 90\)/);
assert.match(app, /function positionCardLocalPreview\(preview, anchor, image\)/);
assert.match(app, /sourcePixels\.width \/ pixelRatio/);
assert.match(app, /sourcePixels\.height \/ pixelRatio/);
assert.match(app, /anchorRect\.left \+ \(\(anchorRect\.width - previewWidth\) \/ 2\)/);
assert.match(app, /anchorRect\.top \+ \(\(anchorRect\.height - previewHeight\) \/ 2\)/);
assert.doesNotMatch(app, /anchorRect\.right \+ gap \+ previewWidth/);
assert.match(app, /maximumViewportHeight \* imageRatio/);
assert.match(app, /function attachCardLocalPreviewHandlers\(root = document\)/);
assert.match(app, /const CARD_PREVIEW_ZONE_RATIO = 0\.75/);
assert.match(app, /function pointerIsInsideCardPreviewZone\(button, event\)/);
assert.match(app, /rect\.width \* \(\(1 - CARD_PREVIEW_ZONE_RATIO\) \/ 2\)/);
assert.match(app, /rect\.height \* \(\(1 - CARD_PREVIEW_ZONE_RATIO\) \/ 2\)/);
assert.match(app, /button\.addEventListener\("pointerenter"/);
assert.match(app, /button\.addEventListener\("pointermove"/);
assert.match(app, /button\.addEventListener\("pointerdown"/);
assert.match(app, /button\.addEventListener\("pointerup"[\s\S]*?closeCardLocalPreview/);
assert.match(app, /button\.addEventListener\("pointercancel"[\s\S]*?closeCardLocalPreview/);
assert.match(app, /function prepareCardTouchPreview\(button, imageUrl, label\)/);
assert.match(app, /suppressNextTouchMaximumZoom = true/);
assert.match(app, /function suppressMaximumZoomAfterTouch\(\)/);
assert.match(app, /if \(suppressMaximumZoomAfterTouch\(\)\) return/);
assert.match(app, /button\.addEventListener\("touchend", closeCardLocalPreview/);
assert.match(app, /attachCardLocalPreviewHandlers\(root\)/);
assert.match(app, /data-image-hover="\$\{escapeHtml\(imageUrl\)\}"/);
assert.match(app, /attachCardLocalPreviewHandlers\(els\.academyDeckList\)/);
assert.match(app, /function openImageZoom\([\s\S]*?closeCardLocalPreview\(\)/);
assert.match(app, /class="character-card" data-image-hover="\$\{escapeHtml\(imageUrl\)\}"/);
assert.match(app, /function prepareRetinaCardImages\(root = document\)/);
assert.match(app, /image\.setAttribute\("srcset", `\$\{source\} 2x`\)/);
assert.doesNotMatch(app, /image\.setAttribute\("width", "731"\)/);
assert.doesNotMatch(app, /image\.setAttribute\("height", "1039"\)/);
assert.match(app, /image\.dataset\.sourcePixelWidth = "1462"/);

assert.match(styles, /\.card-local-preview\s*\{[\s\S]*position: fixed;[\s\S]*z-index: 1000/);
assert.match(styles, /\.card-local-preview\s*\{[\s\S]*pointer-events: none/);
assert.match(styles, /\.card-local-preview\.visible\s*\{[\s\S]*opacity: 1/);
assert.doesNotMatch(styles, /@media \(hover: none\), \(pointer: coarse\)[\s\S]*card-local-preview/);
assert.match(styles, /\.image-zoom-backdrop\s*\{[\s\S]*z-index: 1010/);
assert.match(styles, /\.card-image-zoom-trigger\s*\{[\s\S]*cursor: zoom-in/);
assert.match(styles, /border-radius: 5\.35% \/ 3\.75%/);
assert.doesNotMatch(styles, /border-radius: 5% \/ 3\.55%/);

console.log("v161 arrondi, zone centrale 75 %, appui mobile et pouvoirs des personnages: OK");
