(function mobileGameBootstrap() {
  const MOBILE_MAX_WIDTH = 600;
  const AUTO_CONTINUE_OPPONENT_REVEAL = false;
  const ACKNOWLEDGED_OPPONENT_CARDS_KEY = "tennisLightMobileAcknowledgedOpponentCards";
  const root = document.querySelector("#mobileGameRoot");
  const mobileApp = document.querySelector("#mobileGameApp");
  const desktopApp = document.querySelector(".game-app");
  let matchUsesMobileView = false;
  let resolutionSequence = null;
  let activeResolutionReceipt = null;
  let lastResolutionReceipt = null;
  let settledLocalCardId = null;
  let resolutionSequenceToken = 0;
  let pendingOpponentReveal = null;
  let opponentRevealSequence = null;
  const acknowledgedOpponentCards = new Set();

  function acknowledgedOpponentCardIds() {
    try {
      JSON.parse(sessionStorage.getItem(ACKNOWLEDGED_OPPONENT_CARDS_KEY) || "[]")
        .forEach((cardId) => acknowledgedOpponentCards.add(cardId));
    } catch (error) {
      // La mémoire de la page reste la source de secours.
    }
    return acknowledgedOpponentCards;
  }

  function rememberAcknowledgedOpponentCard(cardId) {
    const acknowledged = acknowledgedOpponentCardIds();
    acknowledged.add(cardId);
    try {
      sessionStorage.setItem(ACKNOWLEDGED_OPPONENT_CARDS_KEY, JSON.stringify([...acknowledged].slice(-40)));
    } catch (error) {
      // L'accusé reste valable en mémoire même si le stockage de session est indisponible.
    }
  }

  function hasTouchCapability() {
    return navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  }

  function hasMobilePlatformSignal() {
    return /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent)
      || (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);
  }

  function isSmartphonePortrait() {
    const portrait = window.matchMedia("(orientation: portrait)").matches
      || window.innerHeight >= window.innerWidth;
    const previewRequested = new URLSearchParams(window.location.search).get("mobileGamePreview") === "1";
    return portrait
      && window.innerWidth <= MOBILE_MAX_WIDTH
      && (previewRequested || (hasTouchCapability() && hasMobilePlatformSignal()));
  }

  function scoreMarkup(score) {
    return score.sets.map((set, index) => {
      const pending = set.player == null || set.opponent == null;
      const winner = set.winner ? ` mobile-set-score--${set.winner.toLowerCase()}` : "";
      return `
        <li class="mobile-set-score${winner}${pending ? " mobile-set-score--pending" : ""}" aria-label="Set ${index + 1}${pending ? " non commencé" : ` : ${set.player} à ${set.opponent}`}">
          <span>${pending ? "–" : set.player}</span>
          <i aria-hidden="true"></i>
          <span>${pending ? "–" : set.opponent}</span>
        </li>
      `;
    }).join("");
  }

  function deltaMarkup(side, metric) {
    const receipt = activeResolutionReceipt || (prefersReducedMotion() ? lastResolutionReceipt : null);
    const delta = receipt?.deltas?.find((item) => item.side === side && item.metric === metric);
    if (!delta) return "";
    return `<span class="mobile-value-delta mobile-value-delta--${delta.delta > 0 ? "gain" : "loss"}" role="status">${delta.delta > 0 ? "+" : ""}${delta.delta}</span>`;
  }

  function playerMarkup(player, side, isServer) {
    return `
      <article class="mobile-player mobile-player--${side}${player.isActive ? " mobile-player--active" : ""}">
        <div class="mobile-player-avatar">
          <img src="${player.artwork}" alt="" />
          ${isServer ? '<span class="mobile-server" aria-label="Au service">●</span>' : ""}
        </div>
        <div class="mobile-player-copy">
          <strong>${escapeText(player.name)}</strong>
          <span>${escapeText(player.characterName)}</span>
        </div>
        <dl class="mobile-player-stats">
          <div data-mobile-value="${side}-endurance"><dt>END</dt><dd>${player.endurance}</dd>${deltaMarkup(side, "endurance")}</div>
          <div data-mobile-value="${side}-handCount"><dt>Cartes</dt><dd>${player.handCount}</dd>${deltaMarkup(side, "handCount")}</div>
        </dl>
      </article>
    `;
  }

  function handMarkup(hand, selectedCardId, interactionLocked = false) {
    if (!hand.length) return '<p class="mobile-empty-hand">Aucune carte en main</p>';
    return hand.map((card) => `
      <button class="mobile-hand-card${card.playable && !interactionLocked ? "" : " mobile-hand-card--locked"}${card.id === selectedCardId ? " mobile-hand-card--selected" : ""}" type="button" data-mobile-card="${escapeText(card.id)}" aria-pressed="${card.id === selectedCardId}" aria-label="${escapeText(card.name)}${interactionLocked ? ", indisponible pendant le tour adverse" : card.playable ? "" : `, indisponible : ${card.unavailableReason}`}" ${interactionLocked ? "disabled" : ""}>
        <img src="${card.artwork}" alt="${escapeText(card.name)}" />
        ${card.requiredPlacement ? '<span>Placement requis</span>' : ""}
        ${card.playable ? "" : '<i aria-hidden="true">🔒</i>'}
      </button>
    `).join("");
  }

  function selectedPreviewMarkup(viewState) {
    const preview = viewState.selectedCardPreview;
    if (!preview) return "";
    return `
      <section class="mobile-selection-preview" aria-label="Aperçu de la carte sélectionnée">
        <dl>
          <div><dt>Coût réel</dt><dd>${preview.realCost}</dd></div>
          <div><dt>Puissance réelle</dt><dd>+${preview.realPower}</dd></div>
          <div><dt>Placement résultant</dt><dd>${preview.resultingPlacement}</dd></div>
        </dl>
        <div class="mobile-selection-detail">
          <strong>Effet</strong>
          ${preview.effects.map((effect) => `<p>${escapeText(effect)}</p>`).join("")}
        </div>
        <div class="mobile-selection-detail">
          <strong>Bonus appliqués</strong>
          ${preview.appliedBonuses.length
    ? `<ul>${preview.appliedBonuses.map((bonus) => `<li>${escapeText(bonus)}</li>`).join("")}</ul>`
    : "<p>Aucun bonus appliqué</p>"}
        </div>
      </section>
      <div class="mobile-card-actions" aria-label="Actions de la carte sélectionnée">
        <button class="mobile-cancel-card" type="button" data-mobile-cancel>Annuler</button>
        <button class="mobile-play-card" type="button" data-mobile-play ${viewState.playSubmissionLocked ? "disabled" : ""}>Jouer (-${preview.realCost} endurance)</button>
      </div>
    `;
  }

  function activeCardMarkup(card) {
    if (!card) {
      return '<div class="mobile-active-card mobile-active-card--empty"><span>En attente du premier coup</span></div>';
    }
    return `
      <article class="mobile-active-card">
        <img src="${card.artwork}" alt="${escapeText(card.name)}" />
        <div>
          <span>${card.owner === "PLAYER" ? "Votre carte" : "Carte adverse"}</span>
          <strong>${escapeText(card.name)}</strong>
          <small>+${card.power} puissance</small>
        </div>
      </article>
    `;
  }

  function opponentRevealMarkup(card) {
    if (!card) return "";
    return `
      <article class="mobile-opponent-reveal" data-mobile-opponent-reveal="${escapeText(card.id)}">
        <button class="mobile-opponent-card-visual" type="button" data-mobile-opponent-card aria-label="Agrandir la carte adverse ${escapeText(card.name)}">
          <img src="${card.artwork}" alt="${escapeText(card.name)}" />
        </button>
        <div class="mobile-opponent-card-details">
          <span>Carte adverse</span>
          <strong>${escapeText(card.name)}</strong>
          <dl>
            <div><dt>Coût</dt><dd>-${card.cost} END</dd></div>
            <div><dt>Puissance</dt><dd>+${card.power}</dd></div>
            <div><dt>Placement</dt><dd>${card.placement}</dd></div>
          </dl>
          <p><strong>Effet</strong>${escapeText(card.effect)}</p>
          <p><strong>Conséquence</strong>${escapeText(card.consequence)}</p>
        </div>
        <button class="mobile-opponent-continue" type="button" data-mobile-opponent-continue>Continuer</button>
      </article>
    `;
  }

  function lastPlayedCardMarkup(card) {
    if (!card) return '<span class="mobile-last-card-empty">Aucune carte jouée</span>';
    return `
      <button class="mobile-last-card-button" type="button" data-mobile-last-card aria-label="Agrandir ${escapeText(card.name)}">
        <img src="${card.artwork}" alt="${escapeText(card.name)}" />
        <span><strong>${escapeText(card.name)}</strong><small>Toucher pour agrandir</small></span>
      </button>
    `;
  }

  function importantMessagesMarkup(viewState) {
    const messages = lastResolutionReceipt?.messages?.length
      ? lastResolutionReceipt.messages
      : viewState.activeCard?.resolutionMessage ? [viewState.activeCard.resolutionMessage] : [];
    if (!messages.length) return "";
    return `<div class="mobile-resolution-messages" role="status">${messages.map((message) => `<p>${escapeText(message)}</p>`).join("")}</div>`;
  }

  function escapeText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function synchronizeOpponentReveal(viewState) {
    const opponentCard = viewState.activeCard?.owner === "OPPONENT" ? viewState.activeCard : null;
    if (pendingOpponentReveal || !opponentCard) return;
    if (acknowledgedOpponentCardIds().has(opponentCard.id)) return;
    pendingOpponentReveal = { ...opponentCard };
  }

  function renderMobileGame(force = false) {
    if (!matchUsesMobileView || !root) return;
    if (resolutionSequence && !force) return;
    const viewState = window.tennisLightMobileAdapter?.getViewState();
    if (!viewState) {
      root.innerHTML = '<p class="mobile-game-fallback" role="status">Chargement du match…</p>';
      return;
    }
    synchronizeOpponentReveal(viewState);
    const opponentInteractionLocked = Boolean(pendingOpponentReveal)
      || viewState.phase === "OPPONENT_CARD_REVEAL";
    const sceneCard = pendingOpponentReveal
      ? null
      : viewState.activeCard?.owner === "OPPONENT"
        ? acknowledgedOpponentCardIds().has(viewState.activeCard.id) ? null : viewState.activeCard
        : viewState.activeCard?.id === settledLocalCardId ? null : viewState.activeCard;
    root.innerHTML = `
      <div class="mobile-game-shell${opponentInteractionLocked ? " mobile-game-shell--opponent-locked" : ""}" data-mobile-resolution-deltas="${activeResolutionReceipt?.deltas?.length || 0}" data-mobile-auto-continue-opponent="${AUTO_CONTINUE_OPPONENT_REVEAL}">
        <header class="mobile-game-header">
          <span>Tennis Courts</span>
          <strong>${viewState.phase === "MATCH_COMPLETE" ? "Match terminé" : "Match en cours"}</strong>
        </header>
        <ol class="mobile-set-scores" aria-label="Score des sets">${scoreMarkup(viewState.score)}</ol>
        <section class="mobile-player-pair" aria-label="Joueurs">
          ${playerMarkup(viewState.opponent, "opponent", viewState.score.server === "OPPONENT")}
          ${playerMarkup(viewState.player, "player", viewState.score.server === "PLAYER")}
        </section>
        <section class="mobile-power" aria-label="Confrontation de puissance">
          <div data-mobile-value="player-power"><span>Vous</span><strong>${viewState.confrontation.playerPower}</strong>${deltaMarkup("player", "power")}</div>
          <i aria-hidden="true">VS</i>
          <div data-mobile-value="opponent-power"><span>Adversaire</span><strong>${viewState.confrontation.opponentPower}</strong>${deltaMarkup("opponent", "power")}</div>
          <p>${escapeText(viewState.confrontation.contextMessage)}</p>
        </section>
        <section class="mobile-scene${resolutionSequence || opponentRevealSequence ? " mobile-scene--resolving" : ""}${pendingOpponentReveal ? " mobile-scene--opponent-reveal" : ""}" aria-label="Carte active">
          ${pendingOpponentReveal ? opponentRevealMarkup(pendingOpponentReveal) : activeCardMarkup(sceneCard)}
          ${importantMessagesMarkup(viewState)}
        </section>
        <section class="mobile-last-card" aria-label="Dernière carte jouée">
          <header><strong>Dernière carte jouée</strong></header>
          ${lastPlayedCardMarkup(viewState.lastPlayedCard)}
        </section>
        ${selectedPreviewMarkup(viewState)}
        <section class="mobile-hand-section${opponentInteractionLocked ? " mobile-hand-section--disabled" : ""}" aria-label="Votre main" aria-disabled="${opponentInteractionLocked}">
          <header><strong>Votre main</strong><span>${opponentInteractionLocked ? "Tour adverse en cours" : viewState.selectedCardId ? "Carte sélectionnée" : "Touchez pour inspecter"}</span></header>
          <div class="mobile-card-hand">${handMarkup(viewState.hand, viewState.selectedCardId, opponentInteractionLocked)}</div>
        </section>
        <div class="mobile-card-explanation hidden" role="dialog" aria-modal="true" aria-labelledby="mobileCardExplanationTitle">
          <button class="mobile-card-explanation-backdrop" type="button" data-mobile-close-explanation aria-label="Fermer"></button>
          <section>
            <span>Carte indisponible</span>
            <strong id="mobileCardExplanationTitle"></strong>
            <p data-mobile-explanation-reason></p>
            <button type="button" data-mobile-close-explanation>Compris</button>
          </section>
        </div>
        <div class="mobile-last-card-zoom hidden" role="dialog" aria-modal="true" aria-label="Dernière carte jouée agrandie">
          <button type="button" data-mobile-close-card-zoom aria-label="Fermer l’agrandissement">×</button>
          ${viewState.lastPlayedCard ? `<img src="${viewState.lastPlayedCard.artwork}" alt="${escapeText(viewState.lastPlayedCard.name)}" />` : ""}
        </div>
        <div class="mobile-opponent-card-zoom hidden" role="dialog" aria-modal="true" aria-label="Carte adverse agrandie">
          <button type="button" data-mobile-close-opponent-zoom aria-label="Fermer l’agrandissement">×</button>
          ${pendingOpponentReveal ? `<img src="${pendingOpponentReveal.artwork}" alt="${escapeText(pendingOpponentReveal.name)}" />` : ""}
        </div>
        <div class="mobile-portrait-lock" role="status">
          <strong>Revenez en mode portrait</strong>
          <span>La partie mobile reste ouverte pendant la rotation.</span>
        </div>
      </div>
    `;
    bindMobileGameInteractions(viewState);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || new URLSearchParams(window.location.search).get("reduceMotion") === "1";
  }

  function waitForResolutionStep(duration, token) {
    if (!duration || prefersReducedMotion()) return Promise.resolve(token === resolutionSequenceToken);
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(token === resolutionSequenceToken), duration);
    });
  }

  function createFlyingCard(image, bounds) {
    const flyer = image.cloneNode(true);
    flyer.className = "mobile-resolution-flyer";
    Object.assign(flyer.style, {
      top: `${bounds.top}px`,
      left: `${bounds.left}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
    });
    document.body.append(flyer);
    return flyer;
  }

  async function animateCardBetween(image, fromBounds, toBounds, duration, token) {
    if (prefersReducedMotion() || !image || !fromBounds || !toBounds) return token === resolutionSequenceToken;
    const flyer = createFlyingCard(image, fromBounds);
    resolutionSequence.flyer = flyer;
    const translateX = toBounds.left + (toBounds.width / 2) - (fromBounds.left + (fromBounds.width / 2));
    const translateY = toBounds.top + (toBounds.height / 2) - (fromBounds.top + (fromBounds.height / 2));
    const scale = Math.min(toBounds.width / fromBounds.width, toBounds.height / fromBounds.height);
    const animation = flyer.animate([
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      { opacity: 1, transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})` },
    ], { duration, easing: "ease-out", fill: "forwards" });
    await animation.finished.catch(() => {});
    flyer.remove();
    if (resolutionSequence) resolutionSequence.flyer = null;
    return token === resolutionSequenceToken;
  }

  function setResolutionLock(locked) {
    root?.classList.toggle("mobile-resolution-locked", locked);
    root?.querySelectorAll("button").forEach((button) => {
      if (locked) button.disabled = true;
    });
  }

  async function runMobileResolution(playButton, viewState) {
    if (resolutionSequence || playButton.disabled || !viewState.selectedCardId) return;
    const selectedButton = root?.querySelector(".mobile-hand-card--selected");
    const selectedImage = selectedButton?.querySelector("img");
    const scene = root?.querySelector(".mobile-scene");
    const fromBounds = selectedImage?.getBoundingClientRect();
    const sceneBounds = scene?.getBoundingClientRect();
    const targetBounds = sceneBounds ? {
      left: sceneBounds.left + (sceneBounds.width - Math.min(96, sceneBounds.width * 0.32)) / 2,
      top: sceneBounds.top + 12,
      width: Math.min(96, sceneBounds.width * 0.32),
      height: Math.min(136, sceneBounds.height - 24),
    } : null;
    const token = ++resolutionSequenceToken;
    resolutionSequence = { token, phase: "hand-to-scene", flyer: null };
    setResolutionLock(true);
    const receipt = window.tennisLightMobileAdapter?.playSelectedCard();
    if (!receipt?.ok) {
      resolutionSequence = null;
      setResolutionLock(false);
      renderMobileGame(true);
      return;
    }
    if (!await animateCardBetween(selectedImage, fromBounds, targetBounds, 320, token)) return;
    activeResolutionReceipt = receipt;
    lastResolutionReceipt = receipt;
    resolutionSequence.phase = "values";
    renderMobileGame(true);
    setResolutionLock(true);
    if (!await waitForResolutionStep(700, token)) return;
    resolutionSequence.phase = "scene-to-last";
    const sceneImage = root?.querySelector(".mobile-active-card img");
    const lastTarget = root?.querySelector(".mobile-last-card-button img");
    const sceneCardBounds = sceneImage?.getBoundingClientRect();
    const lastBounds = lastTarget?.getBoundingClientRect();
    if (!await animateCardBetween(sceneImage, sceneCardBounds, lastBounds, 240, token)) return;
    settledLocalCardId = receipt.card.id;
    activeResolutionReceipt = null;
    resolutionSequence = null;
    setResolutionLock(false);
    renderMobileGame(true);
  }

  async function continueOpponentReveal(button) {
    if (!pendingOpponentReveal || opponentRevealSequence || button.disabled) return;
    const card = pendingOpponentReveal;
    const token = ++resolutionSequenceToken;
    opponentRevealSequence = { token, flyer: null };
    button.disabled = true;
    const sceneImage = root?.querySelector(".mobile-opponent-card-visual img");
    const lastImage = root?.querySelector(".mobile-last-card-button img");
    const fromBounds = sceneImage?.getBoundingClientRect();
    const toBounds = lastImage?.getBoundingClientRect();
    resolutionSequence = opponentRevealSequence;
    if (!await animateCardBetween(sceneImage, fromBounds, toBounds, 240, token)) return;
    resolutionSequence = null;
    rememberAcknowledgedOpponentCard(card.id);
    window.tennisLightMobileAdapter?.acknowledgeOpponentCard(card.id);
    pendingOpponentReveal = null;
    opponentRevealSequence = null;
    renderMobileGame(true);
  }

  function interruptMobileResolution() {
    resolutionSequenceToken += 1;
    resolutionSequence?.flyer?.remove();
    resolutionSequence = null;
    activeResolutionReceipt = null;
    root?.classList.remove("mobile-resolution-locked");
  }

  function showUnavailableExplanation(card) {
    const dialog = root?.querySelector(".mobile-card-explanation");
    if (!dialog) return;
    const title = dialog.querySelector("#mobileCardExplanationTitle");
    const reason = dialog.querySelector("[data-mobile-explanation-reason]");
    if (title) title.textContent = card.name;
    if (reason) reason.textContent = card.unavailableReason || "Cette carte ne peut pas être jouée maintenant.";
    dialog.classList.remove("hidden");
    dialog.querySelector("section button")?.focus();
  }

  function closeUnavailableExplanation() {
    root?.querySelector(".mobile-card-explanation")?.classList.add("hidden");
  }

  function bindMobileGameInteractions(viewState) {
    root?.querySelectorAll("[data-mobile-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = viewState.hand.find((candidate) => candidate.id === button.dataset.mobileCard);
        if (!card) return;
        if (!card.playable) {
          showUnavailableExplanation(card);
          return;
        }
        lastResolutionReceipt = null;
        settledLocalCardId = null;
        window.tennisLightMobileAdapter?.selectCard(card.id);
      });
    });
    root?.querySelector("[data-mobile-cancel]")?.addEventListener("click", () => {
      window.tennisLightMobileAdapter?.cancelCardSelection();
    });
    root?.querySelector("[data-mobile-play]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      runMobileResolution(button, viewState);
    });
    root?.querySelectorAll("[data-mobile-close-explanation]").forEach((button) => {
      button.addEventListener("click", closeUnavailableExplanation);
    });
    root?.querySelector(".mobile-hand-card--selected")?.scrollIntoView({ block: "nearest", inline: "center" });
    root?.querySelector("[data-mobile-last-card]")?.addEventListener("click", () => {
      root.querySelector(".mobile-last-card-zoom")?.classList.remove("hidden");
    });
    root?.querySelector("[data-mobile-close-card-zoom]")?.addEventListener("click", () => {
      root.querySelector(".mobile-last-card-zoom")?.classList.add("hidden");
    });
    root?.querySelector("[data-mobile-opponent-card]")?.addEventListener("click", () => {
      root.querySelector(".mobile-opponent-card-zoom")?.classList.remove("hidden");
    });
    root?.querySelector("[data-mobile-close-opponent-zoom]")?.addEventListener("click", () => {
      root.querySelector(".mobile-opponent-card-zoom")?.classList.add("hidden");
    });
    root?.querySelector("[data-mobile-opponent-continue]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (button instanceof HTMLButtonElement) continueOpponentReveal(button);
    });
  }

  function applySelectedView() {
    desktopApp?.classList.toggle("hidden", matchUsesMobileView);
    mobileApp?.classList.toggle("hidden", !matchUsesMobileView);
    document.body.classList.toggle("mobile-game-view", matchUsesMobileView);
    if (matchUsesMobileView) renderMobileGame();
  }

  function selectViewForMatch() {
    matchUsesMobileView = isSmartphonePortrait();
    applySelectedView();
  }

  function clearSelectedView() {
    interruptMobileResolution();
    pendingOpponentReveal = null;
    opponentRevealSequence = null;
    matchUsesMobileView = false;
    document.body.classList.remove("mobile-game-view");
    mobileApp?.classList.add("hidden");
  }

  window.TennisLightMobileGame = {
    isSmartphonePortrait,
    selectViewForMatch,
    clearSelectedView,
    render: renderMobileGame,
  };

  window.addEventListener("tennis-light:match-render", () => renderMobileGame(false));
  window.addEventListener("orientationchange", () => renderMobileGame(false));
  window.addEventListener("resize", () => renderMobileGame(false));

  if (desktopApp && !desktopApp.classList.contains("hidden")) selectViewForMatch();
})();
