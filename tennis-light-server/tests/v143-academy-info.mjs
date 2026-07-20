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
assert.match(html, /Apprenez\. Progressez\. Entrez sur le circuit\./);
assert.match(html, /assets\/ACADEMY-HERO\.jpg/);
assert.match(html, /le même deck de 18 cartes/);
assert.match(html, /plus de <strong>500 cartes<\/strong>/);
assert.match(html, /https:\/\/www\.mediality\.fr\/shop\/#tenniscourts/);
assert.match(html, /target="_blank" rel="noopener noreferrer"/);
assert.match(html, /assets\/academy-shop-banner\.jpg/);

const cards = [
  ...Array.from({ length: 14 }, (_, index) => ({
    id: `shot-${index + 1}`,
    name: `Coup ${index + 1}`,
    subtitle: `Variante ${index + 1}`,
    family: "Coup droit",
    cost: index < 4 ? 1 : index < 10 ? 2 : 3,
  })),
  { id: "effect-1", name: "Effet 1", family: "Remise", cost: 1 },
  { id: "effect-3", name: "Effet 3", family: "Remise", cost: 3 },
  { id: "effect-2", name: "Effet 2", family: "Remise", cost: 2 },
  { id: "effect-1b", name: "Effet 1 bis", family: "Remise", cost: 1 },
];
const markupContext = {
  CARD_LIBRARY: cards,
  CARD_IMAGES: Object.fromEntries(cards.map((card) => [card.id, `assets/cards/${card.id}.png`])),
  CARD_BACK_IMAGE: "assets/cards/back.png",
  escapeHtml: (value) => String(value),
};
vm.runInNewContext(`${functionSource("academyOrderedCards")}; ${functionSource("academyDeckMarkup")}; ordered = academyOrderedCards().map((card) => card.id); result = academyDeckMarkup();`, markupContext);
assert.equal((markupContext.result.match(/class="academy-deck-card"/g) || []).length, 18);
assert.equal((markupContext.result.match(/data-academy-gallery-index=/g) || []).length, 18);
assert.equal((markupContext.result.match(/<img /g) || []).length, 18);
assert.doesNotMatch(markupContext.result, /academy-deck-card-caption|Carte 01|Carte 18/);
assert.deepEqual(
  Array.from(markupContext.ordered),
  ["shot-11", "shot-12", "shot-13", "shot-14", "shot-5", "shot-6", "shot-7", "shot-8", "shot-9", "shot-10", "shot-1", "shot-2", "shot-3", "shot-4", "effect-3", "effect-2", "effect-1", "effect-1b"],
);

const showSource = functionSource("showAcademyInfoScreen");
assert.match(showSource, /academyInfoScreen\?\.classList\.remove\("hidden"\)/);
assert.match(showSource, /renderAcademyDeck\(\)/);
assert.match(functionSource("renderAcademyDeck"), /attachAcademyDeckHandlers\(\)/);
assert.match(functionSource("openAcademyDeckGallery"), /currentIndex = \(currentIndex \+ direction \+ cards\.length\) % cards\.length/);
assert.match(functionSource("openAcademyDeckGallery"), /event\.key === "ArrowLeft"/);
assert.match(functionSource("openAcademyDeckGallery"), /event\.key === "ArrowRight"/);
assert.match(functionSource("openAcademyDeckGallery"), /aria-label="Carte précédente"/);
assert.match(functionSource("openAcademyDeckGallery"), /aria-label="Carte suivante"/);
assert.match(app, /openAcademyInfoButton\?\.addEventListener\("click", showAcademyInfoScreen\)/);
assert.match(app, /backToLobbyFromAcademyInfoButton\?\.addEventListener\("click", \(\) => showLobbySection\("training"\)\)/);
assert.match(html, /Apprenez les bases avec un deck unique/);

assert.match(styles, /\.academy-deck-grid\s*\{[\s\S]*?grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/);
assert.match(styles, /\.academy-deck-card > img\s*\{[\s\S]*?aspect-ratio: 731 \/ 1039/);
assert.match(styles, /\.academy-shop-button\s*\{[\s\S]*?background: #be185d/);
assert.match(styles, /\.academy-shop-button\s*\{[\s\S]*?justify-content: center/);
assert.match(styles, /\.academy-gallery-arrow\.previous/);
assert.match(styles, /\.academy-gallery-arrow\.next/);
assert.match(styles, /@media \(max-width: 720px\)[\s\S]*?\.academy-deck-grid\s*\{[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/);

console.log("v143 page d'information Academy: OK");
