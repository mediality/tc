import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");

function functionSource(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `fonction absente: ${name}`);
  const bodyStart = app.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`fonction incomplète: ${name}`);
}

assert.equal((html.match(/id="academyInfoScreen"/g) || []).length, 1);
assert.equal((html.match(/id="openAcademyInfoButton"/g) || []).length, 1);
assert.equal((html.match(/id="academyDeckList"/g) || []).length, 1);
assert.match(html, /Apprenez les bases avec un deck unique/);
assert.match(html, /le même deck de 18 cartes/);
assert.match(html, /plus de <strong>500 cartes<\/strong>/);
assert.match(html, /https:\/\/www\.mediality\.fr\/shop\/#tenniscourts/);
assert.match(html, /target="_blank" rel="noopener noreferrer"/);

const cards = Array.from({ length: 18 }, (_, index) => ({
  id: `card-${index + 1}`,
  name: `Carte ${index + 1}`,
  subtitle: `Variante ${index + 1}`,
  family: "Coup",
}));
const markupContext = {
  CARD_LIBRARY: cards,
  CARD_IMAGES: Object.fromEntries(cards.map((card) => [card.id, `assets/cards/${card.id}.png`])),
  CARD_BACK_IMAGE: "assets/cards/back.png",
  escapeHtml: (value) => String(value),
};
vm.runInNewContext(`${functionSource("academyDeckMarkup")}; result = academyDeckMarkup();`, markupContext);
assert.equal((markupContext.result.match(/class="academy-deck-card"/g) || []).length, 18);
assert.equal((markupContext.result.match(/data-image-zoom=/g) || []).length, 18);
assert.match(markupContext.result, /Carte 01/);
assert.match(markupContext.result, /Carte 18/);

const showSource = functionSource("showAcademyInfoScreen");
assert.match(showSource, /academyInfoScreen\?\.classList\.remove\("hidden"\)/);
assert.match(showSource, /renderAcademyDeck\(\)/);
assert.match(functionSource("renderAcademyDeck"), /attachImageZoomHandlers\(els\.academyDeckList\)/);
assert.match(app, /openAcademyInfoButton\?\.addEventListener\("click", showAcademyInfoScreen\)/);
assert.match(app, /backToLobbyFromAcademyInfoButton\?\.addEventListener\("click", showMenuScreen\)/);

assert.match(styles, /\.academy-deck-grid\s*\{[\s\S]*?grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/);
assert.match(styles, /\.academy-deck-card > img\s*\{[\s\S]*?aspect-ratio: 731 \/ 1039/);
assert.match(styles, /@media \(max-width: 720px\)[\s\S]*?\.academy-deck-grid\s*\{[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/);

console.log("v143 page d'information Academy: OK");
