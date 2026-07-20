import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, app, styles] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
]);

assert.match(html, /Tennis Courts Academy <span>v169<\/span>/);
assert.match(html, /styles\.css\?v=169\.9/);
assert.match(html, /app\.js\?v=169\.9/);
assert.match(app, /const CARD_ASSET_VERSION = "169"/);

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
assert.match(app, /let activeCardTouchIdentifier = null/);
assert.match(app, /let activeCardTouchButton = null/);
assert.match(app, /function prepareCardTouchPreview\(button, imageUrl, label, touchIdentifier = null\)/);
assert.match(app, /function endActiveCardTouch\(changedTouches = null\)/);
assert.match(app, /button\.addEventListener\("pointercancel"[\s\S]*?event\.pointerType !== "touch"/);
assert.match(app, /suppressNextTouchMaximumZoom = true/);
assert.match(app, /function suppressMaximumZoomAfterTouch\(\)/);
assert.match(app, /if \(suppressMaximumZoomAfterTouch\(\)\) return/);
assert.match(app, /button\.addEventListener\("touchstart"[\s\S]*?event\.changedTouches\[0\]/);
assert.match(app, /document\.addEventListener\("touchend", \(event\) => endActiveCardTouch\(event\.changedTouches\)/);
assert.match(app, /document\.addEventListener\("touchcancel", \(event\) => endActiveCardTouch\(event\.changedTouches\)/);
assert.match(app, /attachCardLocalPreviewHandlers\(root\)/);
assert.match(app, /data-image-hover="\$\{escapeHtml\(imageUrl\)\}"/);
assert.match(app, /attachCardLocalPreviewHandlers\(els\.academyDeckList\)/);
assert.match(app, /function openImageZoom\([\s\S]*?closeCardLocalPreview\(\)/);
assert.match(app, /class="character-card" data-image-hover="\$\{escapeHtml\(imageUrl\)\}"/);
assert.match(app, /function prepareRetinaCardImages\(root = document\)/);
assert.match(app, /image\.removeAttribute\("srcset"\)/);
assert.doesNotMatch(app, /image\.setAttribute\("srcset"/);
assert.doesNotMatch(app, /image\.setAttribute\("width", "731"\)/);
assert.doesNotMatch(app, /image\.setAttribute\("height", "1039"\)/);
assert.match(app, /image\.dataset\.sourcePixelWidth = "1462"/);
assert.match(app, /function compactAiClubHouseSaveState\(\)/);
assert.match(app, /snapshot\.actionLog = \[\]/);
assert.match(app, /state: compactAiClubHouseSaveState\(\)/);
assert.match(app, /humanMatchTelemetry: null/);

assert.match(styles, /\.card-local-preview\s*\{[\s\S]*position: fixed;[\s\S]*z-index: 1000/);
assert.match(styles, /\.card-local-preview\s*\{[\s\S]*pointer-events: none/);
assert.match(styles, /\.card-local-preview\.visible\s*\{[\s\S]*opacity: 1/);
assert.doesNotMatch(styles, /@media \(hover: none\), \(pointer: coarse\)[\s\S]*card-local-preview/);
assert.match(styles, /\.image-zoom-backdrop\s*\{[\s\S]*z-index: 1010/);
assert.match(styles, /\.card-image-zoom-trigger\s*\{[\s\S]*cursor: zoom-in/);
assert.match(styles, /border-radius: 6% \/ 4\.25%/);
assert.doesNotMatch(styles, /border-radius: 5% \/ 3\.55%/);
assert.doesNotMatch(styles, /image-rendering: -webkit-optimize-contrast/);

console.log("v169 arrondi, source x2 brute, appui mobile persistant et sauvegarde amicale compacte: OK");
