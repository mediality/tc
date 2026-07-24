(function mobileGameBootstrap() {
  const MOBILE_MAX_WIDTH = 600;
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
  let openMobilePanel = null;
  let mobilePanelTrigger = null;
  let panelGestureStartY = null;
  let detailedMobileCard = null;
  let cardDetailParentPanel = null;
  let cardDetailParentTrigger = null;
  let selectedPlayMode = null;
  let selectedBoostSacrificeId = null;
  let scheduledMobileRender = null;
  let transientDialogTrigger = null;
  let opponentAutoContinueTimer = null;
  let playerHadControlOnPreviousRender = false;

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

  function mobilePlayerArtwork(artwork) {
    if (String(artwork || "").endsWith("assets/CoachMaxTRS.png")) {
      return "assets/cards/Demo-TC-_0029_Coach-MAX-LOBBY.webp";
    }
    return artwork || "";
  }

  function isSmartphonePortrait() {
    const previewRequested = new URLSearchParams(window.location.search).get("mobileGamePreview") === "1";
    return Math.min(window.innerWidth, window.innerHeight) <= MOBILE_MAX_WIDTH
      && (previewRequested || (hasTouchCapability() && hasMobilePlatformSignal()));
  }

  function scoreMarkup(score) {
    return score.sets.map((set, index) => {
      const pending = set.player == null || set.opponent == null;
      const winner = set.winner ? ` mobile-set-score--${set.winner.toLowerCase()}` : "";
      const winnerLabel = set.winner === "PLAYER" ? ", set remporté par vous" : set.winner === "OPPONENT" ? ", set remporté par l’adversaire" : "";
      return `
        <li class="mobile-set-score${winner}${pending ? " mobile-set-score--pending" : ""}" aria-label="Set ${index + 1}${pending ? " non commencé" : ` : ${set.player} à ${set.opponent}${winnerLabel}`}">
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

  function playerMarkup(player, side, isServer, bonuses = []) {
    const bonusCount = bonuses.length;
    return `
      <article class="mobile-player mobile-player--${side}${player.isActive ? " mobile-player--active" : ""}">
        <div class="mobile-player-avatar">
          <img src="${escapeText(mobilePlayerArtwork(player.artwork))}" alt="" decoding="async" fetchpriority="high" />
          ${isServer ? '<span class="mobile-server" aria-label="Au service">●</span>' : ""}
        </div>
        <button class="mobile-player-copy" type="button" data-mobile-player-star="${side}" aria-haspopup="dialog" aria-label="Voir le prochain pouvoir étoile de ${escapeText(player.name)}">
          <strong>${escapeText(player.name)}</strong>
          <span>${escapeText(player.characterName)}</span>
        </button>
        <div class="mobile-player-meta">
          ${bonusCount ? `<button class="mobile-bonus-button" type="button" data-mobile-open-bonuses="${side}" aria-haspopup="dialog" aria-label="${bonusCount} bonus actifs pour ${escapeText(player.name)}"><span aria-hidden="true">✦</span><b>${bonusCount}</b></button>` : ""}
          <dl class="mobile-player-stats">
            <div class="${player.endurance <= 2 ? " mobile-player-stat--critical" : ""}" data-mobile-value="${side}-endurance"><dt>END</dt><dd>${player.endurance}</dd>${deltaMarkup(side, "endurance")}</div>
            <div class="${player.handCount === 0 ? " mobile-player-stat--critical" : ""}" data-mobile-value="${side}-handCount"><dt>Cartes</dt><dd>${player.handCount}</dd>${deltaMarkup(side, "handCount")}</div>
          </dl>
        </div>
      </article>
    `;
  }

  function handMarkup(hand, selectedCardId, interactionLocked = false) {
    if (!hand.length) return '<p class="mobile-empty-hand">Aucune carte en main</p>';
    return hand.map((card) => `
      <button class="mobile-hand-card${card.playable && !interactionLocked ? "" : " mobile-hand-card--locked"}${card.id === selectedCardId ? " mobile-hand-card--selected" : ""}" type="button" data-mobile-card="${escapeText(card.id)}" aria-pressed="${card.id === selectedCardId}" aria-label="${escapeText(card.name)}${interactionLocked ? ", indisponible pendant le tour adverse" : card.playable ? "" : `, indisponible : ${card.unavailableReason}`}" ${interactionLocked ? "disabled" : ""}>
        <img src="${card.artwork}" alt="${escapeText(card.name)}" loading="lazy" decoding="async" />
        ${card.playable ? "" : '<i aria-hidden="true">🔒</i>'}
      </button>
    `).join("");
  }

  function selectedPreviewMarkup(viewState) {
    const preview = viewState.selectedCardPreview;
    if (!preview) return "";
    const options = preview.playOptions || [];
    const activeOption = options.find((option) => option.mode === selectedPlayMode)
      || (options.length === 1 ? options[0] : null);
    const selectedSacrifice = activeOption?.sacrifices?.find((card) => card.id === selectedBoostSacrificeId);
    const shortLabel = (mode) => ({ effect: "EFFET", placement: "REMISE", normal: "JOUER", boost: "BOOST" }[mode] || mode);
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
        ${activeOption?.requiresSacrifice ? `
          <fieldset class="mobile-boost-sacrifices">
            <legend>Carte à sacrifier pour le Boost</legend>
            ${activeOption.sacrifices.map((card) => `
              <button type="button" data-mobile-boost-sacrifice="${escapeText(card.id)}" aria-pressed="${card.id === selectedBoostSacrificeId}">
                <img src="${card.artwork}" alt="" loading="lazy" decoding="async" /><span>${escapeText(card.name)}</span>
              </button>
            `).join("")}
          </fieldset>
        ` : ""}
      </section>
      <div class="mobile-card-actions" aria-label="Actions de la carte sélectionnée">
        <button class="mobile-cancel-card mobile-mode-action--cancel" type="button" data-mobile-cancel aria-label="Annuler la sélection et revenir à la main"><span aria-hidden="true">↓</span></button>
        ${options.map((option) => {
          const requiresChoice = option.requiresSacrifice && activeOption?.mode === option.mode && !selectedSacrifice;
          return `<button class="mobile-mode-action mobile-mode-action--${option.mode}${option.boostRisk ? " mobile-mode-action--risk" : ""}" type="button" data-mobile-action-mode="${option.mode}" aria-pressed="${activeOption?.mode === option.mode}" ${viewState.playSubmissionLocked || requiresChoice ? "aria-disabled=\"true\"" : ""}>${shortLabel(option.mode)}</button>`;
        }).join("")}
      </div>
    `;
  }

  function activeCardMarkup(card) {
    if (!card) {
      return '<div class="mobile-active-card mobile-active-card--empty"><span>En attente de votre coup</span></div>';
    }
    return `
      <article class="mobile-active-card">
        <img src="${card.artwork}" alt="${escapeText(card.name)}" decoding="async" />
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
          <img src="${card.artwork}" alt="${escapeText(card.name)}" decoding="async" />
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
          ${card.consequence ? `<p><strong>Conséquence</strong>${escapeText(card.consequence)}</p>` : ""}
        </div>
        <button class="mobile-opponent-continue" type="button" data-mobile-opponent-continue>Continuer</button>
      </article>
    `;
  }

  function lastPlayedCardMarkup(card) {
    if (!card) return '<span class="mobile-last-card-empty">Aucune carte jouée</span>';
    return `
      <button class="mobile-last-card-button${card.boosted ? " mobile-last-card-button--boost" : ""}" type="button" data-mobile-last-card aria-label="Agrandir ${escapeText(card.name)}${card.boosted ? ", jouée en Boost" : ""}">
        <img src="${card.artwork}" alt="${escapeText(card.name)}" loading="lazy" decoding="async" />
        <span><strong>${escapeText(card.name)}</strong><small>Toucher pour agrandir</small></span>
        ${card.boosted ? '<b class="mobile-last-card-boost">BOOST</b>' : ""}
      </button>
    `;
  }

  function bonusesMarkup(bonuses) {
    if (!bonuses.length) return '<p class="mobile-sheet-empty">Aucun bonus actif actuellement.</p>';
    return `<ul class="mobile-bonus-list">${bonuses.map((bonus) => `
      <li class="mobile-bonus-item mobile-bonus-item--${bonus.type}">
        <span aria-hidden="true">${escapeText(bonus.icon)}</span>
        <div><small>${escapeText(bonus.duration)}</small><strong>${escapeText(bonus.label)}</strong><p>${escapeText(bonus.description)}</p></div>
      </li>
    `).join("")}</ul>`;
  }

  function starCardMarkup(card) {
    return `
      <article class="mobile-star-card mobile-star-card--${String(card.side || "").toLowerCase()}">
        <img src="${card.artwork}" alt="${escapeText(card.name)}, côté ${escapeText(card.side)}" decoding="async" />
        <div>
          <span>Prochaine étoile · ${escapeText(card.side)}</span>
          <strong>${escapeText(card.name)}</strong>
          <p>${escapeText(card.effect)}</p>
        </div>
      </article>
    `;
  }

  function historyMarkup(history) {
    if (!history.length) return '<p class="mobile-sheet-empty">L’échange va commencer.</p>';
    return `<ol class="mobile-history-list">${history.map((entry) => `
      <li class="mobile-history-entry mobile-history-entry--${escapeText(entry.type)}">
        <div>
          <span>${escapeText(entry.label)}</span>
          ${entry.variationTypes.map((type) => `<small>${escapeText(type)}</small>`).join("")}
        </div>
        ${entry.card ? `<button type="button" data-mobile-history-card="${escapeText(entry.id)}" aria-label="Agrandir ${escapeText(entry.card.name)}"><img src="${entry.card.artwork}" alt="" loading="lazy" decoding="async" /></button>` : ""}
        <p>${escapeText(entry.message)}</p>
        ${entry.variations.length ? `<ul>${entry.variations.map((variation) => `<li>${escapeText(variation)}</li>`).join("")}</ul>` : ""}
      </li>
    `).join("")}</ol>`;
  }

  function competitionMarkup(competition) {
    if (!competition) return '<p class="mobile-sheet-empty">Aucune compétition active.</p>';
    return `
      <div class="mobile-competition-summary">
        <span>${escapeText(competition.stage)}</span>
        <strong>${escapeText(competition.title)}</strong>
        <p>${escapeText([competition.round, competition.surface, competition.standing].filter(Boolean).join(" · "))}</p>
        ${competition.points != null ? `<p><b>${competition.points}</b> points acquis</p>` : ""}
        ${competition.champion ? `<p>Vainqueur : <b>${escapeText(competition.champion)}</b></p>` : ""}
      </div>
      <ol class="mobile-competition-matches">
        ${competition.matches.map((match) => `
          <li class="${match.current ? "current" : ""}">
            <header><strong>${escapeText(match.label)}</strong><span>${escapeText(match.status)}</span></header>
            <p>${escapeText(match.playerA || "À déterminer")} <i>—</i> ${escapeText(match.playerB || "À déterminer")}</p>
            ${match.score ? `<small>${escapeText(match.score)}</small>` : ""}
          </li>
        `).join("")}
      </ol>
    `;
  }

  function standingsMarkup(competition) {
    if (!competition?.league || !competition.standings?.length) {
      return '<p class="mobile-sheet-empty">Aucun classement de League disponible.</p>';
    }
    return competition.standings.map((standing) => `
      <section class="mobile-league-standing">
        <h3>Groupe ${escapeText(standing.group)}</h3>
        <div role="table" aria-label="Classement du groupe ${escapeText(standing.group)}">
          <div role="row" class="mobile-standing-head"><span role="columnheader">#</span><span role="columnheader">Joueur</span><span role="columnheader">J</span><span role="columnheader">V</span><span role="columnheader">Pts</span></div>
          ${standing.rows.map((row) => `<div role="row"><b role="cell">${row.position}</b><span role="cell">${escapeText(row.player)}</span><span role="cell">${row.played}</span><span role="cell">${row.wins}</span><strong role="cell">${row.points}</strong></div>`).join("")}
        </div>
      </section>
    `).join("");
  }

  function matchMenuMarkup(viewState) {
    return `
      <nav class="mobile-match-menu-list" aria-label="Menu du match">
        ${viewState.modeContext.competition ? '<button type="button" data-mobile-menu-destination="competition">Compétition</button>' : ""}
        ${viewState.modeContext.competition?.league ? '<button type="button" data-mobile-menu-destination="standings">Classement</button>' : ""}
        <button type="button" data-mobile-menu-destination="assistance">Assistance</button>
        <button type="button" data-mobile-open-return>Quitter le match</button>
      </nav>
    `;
  }

  function assistanceMarkup(assistance) {
    return `
      <label class="mobile-assistance-option">
        <span><strong>Stop carte adverse</strong><small>Attendre votre validation avant la carte suivante.</small></span>
        <input type="checkbox" data-mobile-stop-opponent-card ${assistance.stopOpponentCard ? "checked" : ""} />
      </label>
      <p class="mobile-assistance-note">${assistance.stopOpponentCard
    ? "Activé : utilisez Continuer pour chaque carte adverse."
    : "Désactivé : chaque carte adverse reste visible une seconde puis la partie continue."}</p>
    `;
  }

  function tutorialMarkup(tutorial) {
    if (!tutorial) return "";
    return `
      <aside class="mobile-tutorial" role="dialog" aria-modal="false" aria-labelledby="mobileTutorialTitle">
        <header>
          <img src="${tutorial.narrator.artwork}" alt="" decoding="async" />
          <div><span>${escapeText(tutorial.lesson)}${tutorial.progress ? ` · ${escapeText(tutorial.progress)}` : ""}</span><strong>${escapeText(tutorial.narrator.name)}</strong></div>
        </header>
        ${tutorial.showcase ? `<figure><img src="${tutorial.showcase.artwork}" alt="${escapeText(tutorial.showcase.name)}" decoding="async" /><figcaption>${escapeText(tutorial.showcase.label)}</figcaption></figure>` : ""}
        <h2 id="mobileTutorialTitle">${escapeText(tutorial.title)}</h2>
        <p>${escapeText(tutorial.text)}</p>
        ${tutorial.error ? `<p class="mobile-tutorial-error" role="alert">${escapeText(tutorial.error)}</p>` : ""}
        ${tutorial.actionLabel ? `<p class="mobile-tutorial-action">${escapeText(tutorial.actionLabel)}</p>` : ""}
        ${tutorial.waiting ? '<p class="mobile-tutorial-wait" role="status">Le coach prépare la suite…</p>' : ""}
        ${tutorial.canContinue ? `<button type="button" data-mobile-tutorial-next>${escapeText(tutorial.continueLabel)}</button>` : ""}
      </aside>
    `;
  }

  function resultMarkup(result) {
    if (!result) return "";
    return `
      <section class="mobile-match-result mobile-match-result--${result.winner.toLowerCase()}" aria-live="polite">
        <span>${escapeText(result.condition)}</span>
        <strong>${escapeText(result.score)}</strong>
        ${result.actions.length ? `<nav aria-label="Progression">${result.actions.map((action) => `<button type="button" data-mobile-progression="${action.id}">${escapeText(action.label)}</button>`).join("")}</nav>` : ""}
      </section>
    `;
  }

  function connectionMarkup(connection) {
    if (!connection) return "";
    return `<div class="mobile-connection mobile-connection--${connection.kind}" role="status"><strong>${escapeText(connection.label)}</strong><span>${escapeText(connection.detail)}</span><i>${connection.synchronized ? "Synchronisé" : "Connexion…"}</i></div>`;
  }

  function mobileSheetMarkup(name, title, content) {
    const open = openMobilePanel === name;
    return `
      <div class="mobile-sheet-backdrop${open ? "" : " hidden"}" data-mobile-sheet="${name}" role="presentation" aria-hidden="${!open}">
        <section class="mobile-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-${name}-title" tabindex="-1">
          <div class="mobile-sheet-grabber" aria-hidden="true"></div>
          <header>
            <h2 id="mobile-${name}-title">${title}</h2>
            <button type="button" data-mobile-close-panel aria-label="Fermer">×</button>
          </header>
          <div class="mobile-sheet-content">${content}</div>
        </section>
      </div>
    `;
  }

  function returnConfirmationMarkup(info) {
    const open = openMobilePanel === "return";
    return `
      <div class="mobile-return-confirm${open ? "" : " hidden"}" data-mobile-sheet="return" role="presentation" aria-hidden="${!open}">
        <section role="dialog" aria-modal="true" aria-labelledby="mobileReturnTitle" aria-describedby="mobileReturnConsequence" tabindex="-1">
          <span>Sortie du match</span>
          <h2 id="mobileReturnTitle">${escapeText(info.title)}</h2>
          <p id="mobileReturnConsequence">${escapeText(info.consequence)}</p>
          <div>
            <button type="button" data-mobile-cancel-return>Rester dans le match</button>
            <button type="button" data-mobile-confirm-return>Quitter le match</button>
          </div>
        </section>
      </div>
    `;
  }

  function importantMessagesMarkup(viewState) {
    const messages = lastResolutionReceipt?.messages?.length
      ? lastResolutionReceipt.messages
      : viewState.activeCard?.resolutionMessage ? [viewState.activeCard.resolutionMessage] : [];
    if (!messages.length) return "";
    return `<div class="mobile-resolution-messages" role="status">${messages.map((message) => `<p>${escapeText(message)}</p>`).join("")}</div>`;
  }

  function resolutionAnnouncementMarkup() {
    const receipt = activeResolutionReceipt || lastResolutionReceipt;
    if (!receipt?.deltas?.length) return "";
    const sideLabel = { player: "Vous", opponent: "Adversaire" };
    const metricLabel = { power: "puissance", endurance: "endurance", handCount: "cartes en main" };
    const announcement = receipt.deltas.map((delta) => (
      `${sideLabel[delta.side] || delta.side} : ${delta.delta > 0 ? "gain de" : "perte de"} ${Math.abs(delta.delta)} ${metricLabel[delta.metric] || delta.metric}`
    )).join(". ");
    return `<p class="mobile-visually-hidden" role="status" aria-live="assertive" aria-atomic="true">${escapeText(announcement)}</p>`;
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
      <div class="mobile-game-shell${opponentInteractionLocked ? " mobile-game-shell--opponent-locked" : ""}" data-mobile-resolution-deltas="${activeResolutionReceipt?.deltas?.length || 0}" data-mobile-stop-opponent="${viewState.assistance.stopOpponentCard}">
        <a class="mobile-skip-link" href="#mobileGameHand">Aller à la main</a>
        ${resolutionAnnouncementMarkup()}
        <header class="mobile-game-header">
          <span>Tennis Courts</span>
          <strong>${viewState.result ? viewState.result.title : viewState.spectator ? "Lecture seule" : "Match en cours"}</strong>
        </header>
        <section class="mobile-mode-context" aria-label="Contexte du match">
          <div><span>Mode</span><strong>${escapeText(viewState.modeContext.label)}</strong></div>
          <button class="mobile-match-menu-button" type="button" data-mobile-open-match-menu aria-haspopup="dialog" aria-label="Ouvrir le menu du match"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
        </section>
        ${connectionMarkup(viewState.connection)}
        <ol class="mobile-set-scores" aria-label="Score des sets">${scoreMarkup(viewState.score)}</ol>
        <section class="mobile-player-pair" aria-label="Joueurs">
          ${playerMarkup(viewState.opponent, "opponent", viewState.score.server === "OPPONENT", viewState.opponentBonuses)}
          ${playerMarkup(viewState.player, "player", viewState.score.server === "PLAYER", viewState.bonuses)}
        </section>
        <section class="mobile-power${viewState.confrontation.winner ? ` mobile-power--winner-${viewState.confrontation.winner.toLowerCase()}` : ""}" aria-label="Confrontation de puissance">
          <div data-mobile-value="player-power"><span>Vous</span><strong>${viewState.confrontation.playerPower}</strong>${deltaMarkup("player", "power")}</div>
          <i class="mobile-power-bolt" aria-hidden="true"></i>
          <div data-mobile-value="opponent-power"><span>Adversaire</span><strong>${viewState.confrontation.opponentPower}</strong>${deltaMarkup("opponent", "power")}</div>
          <p>${escapeText(viewState.confrontation.contextMessage)}</p>
        </section>
        ${viewState.selectedCardId && !viewState.spectator
    ? selectedPreviewMarkup(viewState)
    : `<section class="mobile-scene${resolutionSequence || opponentRevealSequence ? " mobile-scene--resolving" : ""}${pendingOpponentReveal ? " mobile-scene--opponent-reveal" : ""}" aria-label="Carte active">
          ${viewState.result ? resultMarkup(viewState.result) : pendingOpponentReveal ? opponentRevealMarkup(pendingOpponentReveal) : activeCardMarkup(sceneCard)}
        </section>
        <section class="mobile-last-card" aria-label="Dernière carte jouée">
          <header><strong>Dernière carte jouée</strong></header>
          ${lastPlayedCardMarkup(viewState.lastPlayedCard)}
        </section>
        ${viewState.spectator ? "" : `<div class="mobile-turn-actions" aria-label="Actions du tour">
          ${viewState.turnActions.canUndo
    ? '<button class="mobile-undo-turn" type="button" data-mobile-undo-turn>ANNULER</button>'
    : `<button class="mobile-pass-button${viewState.turnActions.passProjection ? ` mobile-pass-button--${viewState.turnActions.passProjection.winner.toLowerCase()}` : ""}" type="button" data-mobile-pass ${viewState.turnActions.canPass ? "" : "disabled"} aria-label="${escapeText(viewState.turnActions.passProjection?.label || "Passer")}">Passer</button>`}
          ${viewState.turnActions.hideEndTurn ? "" : `<button type="button" data-mobile-end-turn ${viewState.turnActions.canEndTurn ? "" : "disabled"}>TERMINER LE TOUR</button>`}
        </div>`}`}
        ${viewState.spectator ? '<p class="mobile-spectator-notice">Mode spectateur · mains masquées · aucune action de jeu autorisée.</p>' : `<section id="mobileGameHand" class="mobile-hand-section${opponentInteractionLocked ? " mobile-hand-section--disabled" : ""}" aria-label="Votre main" aria-disabled="${opponentInteractionLocked}" tabindex="-1">
          <div class="mobile-card-hand">${handMarkup(viewState.hand, viewState.selectedCardId, opponentInteractionLocked)}</div>
        </section>`}
        ${tutorialMarkup(viewState.tutorial)}
        <div class="mobile-card-explanation hidden" role="dialog" aria-modal="true" aria-labelledby="mobileCardExplanationTitle">
          <button class="mobile-card-explanation-backdrop" type="button" data-mobile-close-explanation aria-label="Fermer"></button>
          <section>
            <span>Carte indisponible</span>
            <strong id="mobileCardExplanationTitle"></strong>
            <p data-mobile-explanation-reason></p>
            <button type="button" data-mobile-close-explanation>Compris</button>
          </section>
        </div>
        <div class="mobile-card-detail${openMobilePanel === "card-detail" ? "" : " hidden"}" role="dialog" aria-modal="true" aria-labelledby="mobileCardDetailTitle">
          <button type="button" data-mobile-close-card-detail aria-label="Fermer le détail">×</button>
          <img data-mobile-card-detail-image src="${detailedMobileCard?.artwork || ""}" alt="${escapeText(detailedMobileCard?.name || "")}" decoding="async" />
          <section>
            <span>Détail de la carte</span>
            <h2 id="mobileCardDetailTitle" data-mobile-card-detail-name>${escapeText(detailedMobileCard?.name || "")}</h2>
            <dl data-mobile-card-detail-stats>
              <div><dt>Coût</dt><dd>${Number(detailedMobileCard?.cost || 0)}</dd></div>
              <div><dt>Puissance</dt><dd>+${Number(detailedMobileCard?.power || 0)}</dd></div>
              <div><dt>Précision</dt><dd>${Number(detailedMobileCard?.precision || 0)}</dd></div>
              <div><dt>Placement</dt><dd>${Number(detailedMobileCard?.placement || 0)}</dd></div>
            </dl>
            <p data-mobile-card-detail-effect>${escapeText(detailedMobileCard?.effect || "")}</p>
          </section>
        </div>
        <div class="mobile-opponent-card-zoom hidden" role="dialog" aria-modal="true" aria-label="Carte adverse agrandie">
          <button type="button" data-mobile-close-opponent-zoom aria-label="Fermer l’agrandissement">×</button>
          ${pendingOpponentReveal ? `<img src="${pendingOpponentReveal.artwork}" alt="${escapeText(pendingOpponentReveal.name)}" decoding="async" />` : ""}
        </div>
        <div class="mobile-portrait-lock" role="status">
          <strong>Revenez en mode portrait</strong>
          <span>La partie mobile reste ouverte pendant la rotation.</span>
        </div>
        ${viewState.lastPlayedCard ? `<nav class="mobile-utility-nav" aria-label="Informations et navigation">
          <button type="button" data-mobile-open-history aria-haspopup="dialog"><span aria-hidden="true">☰</span>Historique</button>
        </nav>` : ""}
        ${mobileSheetMarkup("bonuses-player", `Bonus · ${escapeText(viewState.player.name)}`, bonusesMarkup(viewState.bonuses))}
        ${mobileSheetMarkup("bonuses-opponent", `Bonus · ${escapeText(viewState.opponent.name)}`, bonusesMarkup(viewState.opponentBonuses))}
        ${mobileSheetMarkup("star-player", "Pouvoir étoile", starCardMarkup(viewState.playerStarCard))}
        ${mobileSheetMarkup("star-opponent", "Pouvoir étoile", starCardMarkup(viewState.opponentStarCard))}
        ${mobileSheetMarkup("history", "Déroulé de l’échange", historyMarkup(viewState.history))}
        ${mobileSheetMarkup("match-menu", "Menu du match", matchMenuMarkup(viewState))}
        ${viewState.modeContext.competition ? mobileSheetMarkup("competition", "Compétition", competitionMarkup(viewState.modeContext.competition)) : ""}
        ${viewState.modeContext.competition?.league ? mobileSheetMarkup("standings", "Classement", standingsMarkup(viewState.modeContext.competition)) : ""}
        ${mobileSheetMarkup("assistance", "Assistance", assistanceMarkup(viewState.assistance))}
        ${returnConfirmationMarkup(viewState.returnToMenu)}
      </div>
    `;
    bindMobileGameInteractions(viewState);
    if (openMobilePanel) window.queueMicrotask(() => focusOpenMobilePanel(false));
    anchorMobileGameToBottom(viewState);
  }

  function anchorMobileGameToBottom(viewState) {
    const playerHasControl = viewState.phase === "PLAYER_TURN"
      && !pendingOpponentReveal
      && !resolutionSequence
      && !viewState.spectator;
    const shouldAnchor = playerHasControl && !playerHadControlOnPreviousRender && !openMobilePanel;
    playerHadControlOnPreviousRender = playerHasControl;
    if (!shouldAnchor) return;
    window.requestAnimationFrame(() => {
      root?.querySelector("#mobileGameHand")?.scrollIntoView({ block: "end", behavior: "auto" });
    });
  }

  function scheduleMobileRender() {
    if (!matchUsesMobileView || scheduledMobileRender != null) return;
    scheduledMobileRender = window.requestAnimationFrame(() => {
      scheduledMobileRender = null;
      renderMobileGame(false);
    });
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
    const scene = root?.querySelector(".mobile-scene")
      || root?.querySelector(".mobile-selection-preview");
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
    const receipt = window.tennisLightMobileAdapter?.playSelectedCard({
      mode: selectedPlayMode || viewState.selectedCardPreview?.playOptions?.[0]?.mode,
      sacrificeUid: selectedBoostSacrificeId,
    });
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
    selectedPlayMode = null;
    selectedBoostSacrificeId = null;
    activeResolutionReceipt = null;
    resolutionSequence = null;
    setResolutionLock(false);
    renderMobileGame(true);
  }

  async function continueOpponentReveal(button) {
    if (!pendingOpponentReveal || opponentRevealSequence || button.disabled) return;
    window.clearTimeout(opponentAutoContinueTimer);
    opponentAutoContinueTimer = null;
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

  function scheduleOpponentAutoContinue(viewState) {
    window.clearTimeout(opponentAutoContinueTimer);
    opponentAutoContinueTimer = null;
    if (!pendingOpponentReveal || viewState.assistance.stopOpponentCard) return;
    opponentAutoContinueTimer = window.setTimeout(() => {
      opponentAutoContinueTimer = null;
      const button = root?.querySelector("[data-mobile-opponent-continue]");
      if (button instanceof HTMLButtonElement) continueOpponentReveal(button);
    }, 1000);
  }

  function interruptMobileResolution() {
    resolutionSequenceToken += 1;
    resolutionSequence?.flyer?.remove();
    resolutionSequence = null;
    activeResolutionReceipt = null;
    root?.classList.remove("mobile-resolution-locked");
  }

  function showUnavailableExplanation(card, trigger = null) {
    const dialog = root?.querySelector(".mobile-card-explanation");
    if (!dialog) return;
    const title = dialog.querySelector("#mobileCardExplanationTitle");
    const reason = dialog.querySelector("[data-mobile-explanation-reason]");
    if (title) title.textContent = card.name;
    if (reason) reason.textContent = card.unavailableReason || "Cette carte ne peut pas être jouée maintenant.";
    transientDialogTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
    dialog.classList.remove("hidden");
    dialog.querySelector("section button")?.focus();
  }

  function closeUnavailableExplanation() {
    root?.querySelector(".mobile-card-explanation")?.classList.add("hidden");
    if (transientDialogTrigger?.isConnected) transientDialogTrigger.focus();
    transientDialogTrigger = null;
  }

  function focusableElements(container) {
    return [...(container?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])]
      .filter((element) => !element.closest(".hidden"));
  }

  function openPanelElement() {
    if (openMobilePanel === "card-detail") return root?.querySelector(".mobile-card-detail");
    return root?.querySelector(`[data-mobile-sheet="${openMobilePanel}"]`);
  }

  function focusOpenMobilePanel(selectFirst = true) {
    const panel = openPanelElement();
    if (!panel || panel.classList.contains("hidden")) return;
    if (!selectFirst && panel.contains(document.activeElement)) return;
    const focusable = focusableElements(panel);
    (focusable[0] || panel.querySelector('[role="dialog"]'))?.focus();
  }

  function showMobilePanel(name, trigger) {
    closeMobilePanel(false);
    openMobilePanel = name;
    mobilePanelTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
    const panel = openPanelElement();
    panel?.classList.remove("hidden");
    panel?.setAttribute("aria-hidden", "false");
    root?.classList.add("mobile-overlay-open");
    focusOpenMobilePanel(true);
  }

  function closeMobilePanel(restoreFocus = true) {
    if (!openMobilePanel) return;
    const closingPanel = openMobilePanel;
    const returnPanel = closingPanel === "card-detail" && restoreFocus ? cardDetailParentPanel : null;
    const returnTrigger = cardDetailParentTrigger;
    const panel = openPanelElement();
    panel?.classList.add("hidden");
    panel?.setAttribute("aria-hidden", "true");
    openMobilePanel = null;
    detailedMobileCard = null;
    root?.classList.remove("mobile-overlay-open");
    cardDetailParentPanel = null;
    cardDetailParentTrigger = null;
    if (returnPanel) {
      openMobilePanel = returnPanel;
      const parent = openPanelElement();
      parent?.classList.remove("hidden");
      parent?.setAttribute("aria-hidden", "false");
      root?.classList.add("mobile-overlay-open");
      mobilePanelTrigger = returnTrigger;
      if (mobilePanelTrigger?.isConnected) mobilePanelTrigger.focus();
      return;
    }
    if (restoreFocus && mobilePanelTrigger?.isConnected) mobilePanelTrigger.focus();
    mobilePanelTrigger = null;
  }

  function showMobileCardDetail(card, trigger) {
    if (!card) return;
    const parentPanel = openMobilePanel;
    const parentTrigger = mobilePanelTrigger;
    showMobilePanel("card-detail", trigger);
    detailedMobileCard = card;
    cardDetailParentPanel = parentPanel === "history" ? parentPanel : null;
    cardDetailParentTrigger = parentPanel === "history" ? parentTrigger : null;
    const dialog = root?.querySelector(".mobile-card-detail");
    dialog?.querySelector("[data-mobile-card-detail-image]")?.setAttribute("src", card.artwork || "");
    dialog?.querySelector("[data-mobile-card-detail-image]")?.setAttribute("alt", card.name || "");
    if (dialog?.querySelector("[data-mobile-card-detail-name]")) dialog.querySelector("[data-mobile-card-detail-name]").textContent = card.name || "";
    const values = [
      ["Coût", card.cost],
      ["Puissance", `+${Number(card.power || 0)}`],
      ["Précision", card.precision],
      ["Placement", card.placement],
    ].filter(([, value]) => value != null);
    const stats = dialog?.querySelector("[data-mobile-card-detail-stats]");
    if (stats) stats.innerHTML = values.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
    if (dialog?.querySelector("[data-mobile-card-detail-effect]")) {
      dialog.querySelector("[data-mobile-card-detail-effect]").textContent = card.effect || card.consequence || "Aucun effet.";
    }
  }

  function bindPanelGestures(panel) {
    const sheet = panel?.querySelector(".mobile-bottom-sheet");
    sheet?.addEventListener("pointerdown", (event) => {
      panelGestureStartY = event.clientY;
    });
    sheet?.addEventListener("pointerup", (event) => {
      if (panelGestureStartY != null && event.clientY - panelGestureStartY > 64) closeMobilePanel();
      panelGestureStartY = null;
    });
  }

  function bindMobileGameInteractions(viewState) {
    root?.querySelectorAll("[data-mobile-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = viewState.hand.find((candidate) => candidate.id === button.dataset.mobileCard);
        if (!card) return;
        if (!card.playable) {
          showUnavailableExplanation(card, button);
          return;
        }
        lastResolutionReceipt = null;
        settledLocalCardId = null;
        selectedPlayMode = null;
        selectedBoostSacrificeId = null;
        window.tennisLightMobileAdapter?.selectCard(card.id);
      });
    });
    root?.querySelector("[data-mobile-cancel]")?.addEventListener("click", () => {
      selectedPlayMode = null;
      selectedBoostSacrificeId = null;
      window.tennisLightMobileAdapter?.cancelCardSelection();
    });
    root?.querySelectorAll("[data-mobile-action-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        const option = viewState.selectedCardPreview?.playOptions?.find((candidate) => candidate.mode === button.dataset.mobileActionMode);
        if (!option || viewState.playSubmissionLocked) return;
        if (selectedPlayMode !== option.mode) {
          selectedPlayMode = option.mode;
          selectedBoostSacrificeId = null;
          if (option.requiresSacrifice) {
            renderMobileGame(true);
            return;
          }
        }
        if (option.requiresSacrifice && !selectedBoostSacrificeId) return;
        runMobileResolution(button, viewState);
      });
    });
    root?.querySelectorAll("[data-mobile-boost-sacrifice]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedBoostSacrificeId = button.dataset.mobileBoostSacrifice;
        renderMobileGame(true);
      });
    });
    root?.querySelector("[data-mobile-play]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      runMobileResolution(button, viewState);
    });
    root?.querySelector("[data-mobile-pass]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      selectedPlayMode = null;
      selectedBoostSacrificeId = null;
      window.tennisLightMobileAdapter?.passTurn();
    });
    root?.querySelector("[data-mobile-end-turn]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      selectedPlayMode = null;
      selectedBoostSacrificeId = null;
      window.tennisLightMobileAdapter?.endTurn();
    });
    root?.querySelector("[data-mobile-undo-turn]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      selectedPlayMode = null;
      selectedBoostSacrificeId = null;
      window.tennisLightMobileAdapter?.undoTurn();
    });
    root?.querySelectorAll("[data-mobile-close-explanation]").forEach((button) => {
      button.addEventListener("click", closeUnavailableExplanation);
    });
    root?.querySelector(".mobile-hand-card--selected")?.scrollIntoView({ block: "nearest", inline: "center" });
    root?.querySelector("[data-mobile-last-card]")?.addEventListener("click", (event) => {
      showMobileCardDetail(viewState.lastPlayedCard, event.currentTarget);
    });
    root?.querySelector("[data-mobile-opponent-card]")?.addEventListener("click", () => {
      transientDialogTrigger = document.activeElement;
      root.querySelector(".mobile-opponent-card-zoom")?.classList.remove("hidden");
      root.querySelector("[data-mobile-close-opponent-zoom]")?.focus();
    });
    root?.querySelector("[data-mobile-close-opponent-zoom]")?.addEventListener("click", () => {
      root.querySelector(".mobile-opponent-card-zoom")?.classList.add("hidden");
      if (transientDialogTrigger?.isConnected) transientDialogTrigger.focus();
      transientDialogTrigger = null;
    });
    root?.querySelector("[data-mobile-opponent-continue]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (button instanceof HTMLButtonElement) continueOpponentReveal(button);
    });
    root?.querySelectorAll("[data-mobile-open-bonuses]").forEach((button) => {
      button.addEventListener("click", (event) => {
        showMobilePanel(`bonuses-${event.currentTarget.dataset.mobileOpenBonuses}`, event.currentTarget);
      });
    });
    root?.querySelectorAll("[data-mobile-player-star]").forEach((button) => {
      button.addEventListener("click", (event) => {
        showMobilePanel(`star-${event.currentTarget.dataset.mobilePlayerStar}`, event.currentTarget);
      });
    });
    root?.querySelector("[data-mobile-open-match-menu]")?.addEventListener("click", (event) => {
      showMobilePanel("match-menu", event.currentTarget);
    });
    root?.querySelectorAll("[data-mobile-menu-destination]").forEach((button) => {
      button.addEventListener("click", (event) => {
        showMobilePanel(button.dataset.mobileMenuDestination, event.currentTarget);
      });
    });
    root?.querySelector("[data-mobile-open-competition]")?.addEventListener("click", (event) => {
      showMobilePanel("competition", event.currentTarget);
    });
    root?.querySelector("[data-mobile-stop-opponent-card]")?.addEventListener("change", (event) => {
      const input = event.currentTarget;
      if (!(input instanceof HTMLInputElement)) return;
      window.tennisLightMobileAdapter?.setAssistance({ stopOpponentCard: input.checked });
    });
    root?.querySelector("[data-mobile-tutorial-next]")?.addEventListener("click", () => {
      window.tennisLightMobileAdapter?.continueTutorial();
    });
    root?.querySelectorAll("[data-mobile-progression]").forEach((button) => {
      button.addEventListener("click", () => {
        button.disabled = true;
        window.tennisLightMobileAdapter?.runProgressionAction(button.dataset.mobileProgression);
      });
    });
    const historyButton = root?.querySelector("[data-mobile-open-history]");
    historyButton?.addEventListener("click", (event) => showMobilePanel("history", event.currentTarget));
    historyButton?.addEventListener("pointerdown", (event) => {
      panelGestureStartY = event.clientY;
    });
    historyButton?.addEventListener("pointerup", (event) => {
      if (panelGestureStartY != null && panelGestureStartY - event.clientY > 48) {
        event.preventDefault();
        showMobilePanel("history", historyButton);
      }
      panelGestureStartY = null;
    });
    root?.querySelector("[data-mobile-open-return]")?.addEventListener("click", (event) => {
      showMobilePanel("return", event.currentTarget);
    });
    scheduleOpponentAutoContinue(viewState);
    root?.querySelectorAll("[data-mobile-close-panel], [data-mobile-cancel-return]").forEach((button) => {
      button.addEventListener("click", () => closeMobilePanel());
    });
    root?.querySelector("[data-mobile-close-card-detail]")?.addEventListener("click", () => closeMobilePanel());
    root?.querySelector("[data-mobile-confirm-return]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;
      button.disabled = true;
      window.tennisLightMobileAdapter?.confirmReturnToMenu();
    });
    root?.querySelectorAll("[data-mobile-sheet]").forEach((panel) => {
      panel.addEventListener("click", (event) => {
        if (event.target === panel) closeMobilePanel();
      });
      bindPanelGestures(panel);
    });
    root?.querySelectorAll("[data-mobile-history-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const entry = viewState.history.find((candidate) => candidate.id === button.dataset.mobileHistoryCard);
        if (entry?.card) showMobileCardDetail(entry.card, button);
      });
    });
  }

  function applySelectedView() {
    desktopApp?.classList.toggle("hidden", matchUsesMobileView);
    if (!matchUsesMobileView) playerHadControlOnPreviousRender = false;
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
    closeMobilePanel(false);
    matchUsesMobileView = false;
    if (scheduledMobileRender != null) window.cancelAnimationFrame(scheduledMobileRender);
    scheduledMobileRender = null;
    document.body.classList.remove("mobile-game-view");
    mobileApp?.classList.add("hidden");
  }

  window.TennisLightMobileGame = {
    isSmartphonePortrait,
    selectViewForMatch,
    clearSelectedView,
    render: renderMobileGame,
  };

  window.addEventListener("tennis-light:match-render", scheduleMobileRender);
  window.addEventListener("orientationchange", scheduleMobileRender);
  window.addEventListener("resize", scheduleMobileRender);
  document.addEventListener("keydown", (event) => {
    if (!matchUsesMobileView) return;
    const explanation = root?.querySelector(".mobile-card-explanation:not(.hidden)");
    const opponentZoom = root?.querySelector(".mobile-opponent-card-zoom:not(.hidden)");
    if (event.key === "Escape" && explanation) {
      event.preventDefault();
      closeUnavailableExplanation();
      return;
    }
    if (event.key === "Escape" && opponentZoom) {
      event.preventDefault();
      root.querySelector("[data-mobile-close-opponent-zoom]")?.click();
      return;
    }
    if (!openMobilePanel) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMobilePanel();
      return;
    }
    if (event.key !== "Tab") return;
    const panel = openPanelElement();
    const focusable = focusableElements(panel);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (desktopApp && !desktopApp.classList.contains("hidden")) selectViewForMatch();
})();
