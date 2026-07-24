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
    return portrait
      && window.innerWidth <= MOBILE_MAX_WIDTH
      && hasTouchCapability()
      && hasMobilePlatformSignal();
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

  function handMarkup(hand) {
    if (!hand.length) return '<p class="mobile-empty-hand">Aucune carte en main</p>';
    return hand.map((card) => `
      <article class="mobile-hand-card${card.playable ? "" : " mobile-hand-card--locked"}" aria-label="${escapeText(card.name)}${card.playable ? "" : ", indisponible"}">
        <img src="${card.artwork}" alt="${escapeText(card.name)}" />
        ${card.requiredPlacement ? '<span>Placement requis</span>' : ""}
        ${card.playable ? "" : '<i aria-hidden="true">🔒</i>'}
      </article>
    `).join("");
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
        <section class="mobile-hand-section" aria-label="Votre main">
          <header><strong>Votre main</strong><span>Lecture seule</span></header>
          <div class="mobile-card-hand">${handMarkup(viewState.hand)}</div>
        </section>
        <div class="mobile-portrait-lock" role="status">
          <strong>Revenez en mode portrait</strong>
          <span>La partie mobile reste ouverte pendant la rotation.</span>
        </div>
      </div>
    `;
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
