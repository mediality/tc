(function mobileGameBootstrap() {
  const MOBILE_MAX_WIDTH = 600;
  const root = document.querySelector("#mobileGameRoot");
  const mobileApp = document.querySelector("#mobileGameApp");
  const desktopApp = document.querySelector(".game-app");
  let matchUsesMobileView = false;

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
          <div><dt>END</dt><dd>${player.endurance}</dd></div>
          <div><dt>Cartes</dt><dd>${player.handCount}</dd></div>
        </dl>
      </article>
    `;
  }

  function handMarkup(hand, selectedCardId) {
    if (!hand.length) return '<p class="mobile-empty-hand">Aucune carte en main</p>';
    return hand.map((card) => `
      <button class="mobile-hand-card${card.playable ? "" : " mobile-hand-card--locked"}${card.id === selectedCardId ? " mobile-hand-card--selected" : ""}" type="button" data-mobile-card="${escapeText(card.id)}" aria-pressed="${card.id === selectedCardId}" aria-label="${escapeText(card.name)}${card.playable ? "" : `, indisponible : ${card.unavailableReason}`}">
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

  function escapeText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderMobileGame() {
    if (!matchUsesMobileView || !root) return;
    const viewState = window.tennisLightMobileAdapter?.getViewState();
    if (!viewState) {
      root.innerHTML = '<p class="mobile-game-fallback" role="status">Chargement du match…</p>';
      return;
    }
    root.innerHTML = `
      <div class="mobile-game-shell">
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
          <div><span>Vous</span><strong>${viewState.confrontation.playerPower}</strong></div>
          <i aria-hidden="true">VS</i>
          <div><span>Adversaire</span><strong>${viewState.confrontation.opponentPower}</strong></div>
          <p>${escapeText(viewState.confrontation.contextMessage)}</p>
        </section>
        <section class="mobile-scene" aria-label="Carte active">${activeCardMarkup(viewState.activeCard)}</section>
        ${selectedPreviewMarkup(viewState)}
        <section class="mobile-hand-section" aria-label="Votre main">
          <header><strong>Votre main</strong><span>${viewState.selectedCardId ? "Carte sélectionnée" : "Touchez pour inspecter"}</span></header>
          <div class="mobile-card-hand">${handMarkup(viewState.hand, viewState.selectedCardId)}</div>
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
        <div class="mobile-portrait-lock" role="status">
          <strong>Revenez en mode portrait</strong>
          <span>La partie mobile reste ouverte pendant la rotation.</span>
        </div>
      </div>
    `;
    bindMobileGameInteractions(viewState);
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
        window.tennisLightMobileAdapter?.selectCard(card.id);
      });
    });
    root?.querySelector("[data-mobile-cancel]")?.addEventListener("click", () => {
      window.tennisLightMobileAdapter?.cancelCardSelection();
    });
    root?.querySelector("[data-mobile-play]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      button.disabled = true;
      window.tennisLightMobileAdapter?.playSelectedCard();
    });
    root?.querySelectorAll("[data-mobile-close-explanation]").forEach((button) => {
      button.addEventListener("click", closeUnavailableExplanation);
    });
    root?.querySelector(".mobile-hand-card--selected")?.scrollIntoView({ block: "nearest", inline: "center" });
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

  window.addEventListener("tennis-light:match-render", renderMobileGame);
  window.addEventListener("orientationchange", renderMobileGame);
  window.addEventListener("resize", renderMobileGame);

  if (desktopApp && !desktopApp.classList.contains("hidden")) selectViewForMatch();
})();
