const STARTING_ENDURANCE = 7;
const HAND_SIZE = 6;
const CARD_BACK_IMAGE = "assets/cards/Demo-TC-_0000_VERSO-CARTES.png";

const SERVER_SYNC = {
  enabled: false,
  roomId: null,
  token: null,
  seat: null,
  ready: false,
  initializing: false,
  applyingRemote: false,
  localDirty: false,
  lastSent: "",
  timer: null,
  pollTimer: null,
  revision: 0,
};

const CHARACTERS = {
  coachJu: {
    name: "Coach Ju",
    effects: [
      { side: "Bleu", label: "Pioche 1 carte", type: "drawCard" },
      { side: "Rose", label: "+1 puissance par coup déjà joué", type: "coupPowerBonus" },
    ],
  },
  coachMax: {
    name: "Coach Max",
    effects: [
      { side: "Bleu", label: "Récupère 1 carte non distribuée", type: "recoverUndealt" },
      { side: "Rose", label: "+2 puissance", type: "gainPower" },
    ],
  },
};

const CHARACTER_IMAGES = {
  coachJu: [
    "assets/cards/Demo-TC-_0004_Coach-JU-RECTO.png",
    "assets/cards/Demo-TC-_0003_Coach-JU-VERSO-.png",
  ],
  coachMax: [
    "assets/cards/Demo-TC-_0002_Coach-MAX-VERSO.png",
    "assets/cards/Demo-TC-_0001_Coach-MAX-VERSO.png",
  ],
};

const CARD_IMAGES = {
  double: "assets/cards/Demo-TC-_0005_DOUBLE-x2.png",
  joker: "assets/cards/Demo-TC-_0006_JOKER-x2.png",
  "sup-adv": "assets/cards/Demo-TC-_0007_SUP-ADV.png",
  "amortie-2-1-4": "assets/cards/Demo-TC-_0011_030---AMORTIE-2-1-4.png",
  "retour-service": "assets/cards/Demo-TC-_0008_RETOUR-DE-SERVICE.png",
  "volee-2-2-3": "assets/cards/Demo-TC-_0010_031---VOLEE-2-2-3.png",
  "volee-3-4-1": "assets/cards/Demo-TC-_0013_026---VOLEE-3-4-1.png",
  "coup-droit-2-2-2": "assets/cards/Demo-TC-_0022_002---CP-DROIT-2-2-2.png",
  "passing-1-1-4": "assets/cards/Demo-TC-_0009_029---PASSING-1-1-4.png",
  "lob-2-0-4": "assets/cards/Demo-TC-_0012_027---LOB-2-0-4.png",
  "coup-droit-4-3-5": "assets/cards/Demo-TC-_0019_010---CP-DROIT-4-3-5.png",
  "service-coup-droit": "assets/cards/Demo-TC-_0015_020---CP-DROIT-SERV-3.png",
  "revers-3-3-3": "assets/cards/Demo-TC-_0018_012---REVERS-3-3-3.png",
  "coup-droit-3-3-3": "assets/cards/Demo-TC-_0020_007---CP-DROIT-3-3-3.png",
  "revers-5-4-1": "assets/cards/Demo-TC-_0016_016---REVERS-5-4-1.png",
  "smash-4-2-1": "assets/cards/Demo-TC-_0014_023---SMASH-4-2-1.png",
  "revers-3-3-0": "assets/cards/Demo-TC-_0021_005---REVERS-3-3-0.png",
  "revers-2": "assets/cards/Demo-TC-_0017_013---REVERS-2.png",
};

const CARD_LIBRARY = [
  {
    id: "double",
    name: "Double",
    family: "Remise",
    cost: 2,
    power: 0,
    precision: 0,
    placement: 3,
    boostPower: 2,
    boostPrecision: 0,
    effect: "À la fin de l'échange, double la puissance de votre dernière carte Coup.",
    effectType: "doubleLastShot",
  },
  {
    id: "joker",
    name: "Joker",
    family: "Remise",
    cost: 1,
    power: 0,
    precision: 0,
    placement: 2,
    boostPower: 1,
    boostPrecision: 0,
    effect: "Permet de répondre après un coup boosté même sans placement suffisant.",
    effectType: "jokerResponse",
  },
  {
    id: "sup-adv",
    name: "Suppression adverse",
    family: "Remise",
    cost: 3,
    power: 0,
    precision: 0,
    placement: 4,
    boostPower: 3,
    boostPrecision: 0,
    effect: "Supprime la dernière carte adverse engagée dans l'échange.",
    effectType: "removeOpponentLast",
  },
  {
    id: "amortie-2-1-4",
    name: "Amortie",
    subtitle: "Contre-pied",
    family: "Amortie",
    cost: 1,
    power: 2,
    precision: 1,
    placement: 4,
    boostPower: 3,
    boostPrecision: 4,
    effect: "Bonus précision +2 sur votre prochain coup.",
    effectType: "nextPrecision",
    effectValue: 2,
  },
  {
    id: "retour-service",
    name: "Retour de service",
    family: "Remise",
    cost: 1,
    power: 0,
    precision: 0,
    placement: 2,
    boostPower: 1,
    boostPrecision: 0,
    effect: "Prototype : autorise un boost libre sur votre prochain coup.",
    effectType: "freeBoostNext",
  },
  {
    id: "volee-2-2-3",
    name: "Volée",
    subtitle: "Volée haute",
    family: "Volée",
    cost: 2,
    power: 3,
    precision: 2,
    placement: 3,
    boostPower: 4,
    boostPrecision: 4,
    effect: "Votre prochain coup coûte 1 endurance en moins.",
    effectType: "nextDiscount",
    effectValue: 1,
  },
  {
    id: "volee-3-4-1",
    name: "Volée",
    subtitle: "Volée puissante",
    family: "Volée",
    star: true,
    cost: 2,
    power: 4,
    precision: 4,
    placement: 1,
    boostPower: 5,
    boostPrecision: 4,
    effect: "Chaque carte boostée de votre côté rapporte +2 puissance à la fin.",
    effectType: "boostedBonusAtEnd",
    effectValue: 2,
  },
  {
    id: "coup-droit-2-2-2",
    name: "Coup droit",
    subtitle: "Chop",
    family: "Coup droit",
    cost: 1,
    power: 2,
    precision: 0,
    placement: 3,
    boostPower: 3,
    boostPrecision: 4,
    effect: "Vous pouvez booster ce coup après un service non boosté.",
    effectType: "serviceBoostHint",
  },
  {
    id: "passing-1-1-4",
    name: "Passing",
    subtitle: "Passing shot",
    family: "Passing",
    cost: 1,
    power: 2,
    precision: 1,
    placement: 4,
    boostPower: 4,
    boostPrecision: 4,
    effect: "Bonus placement +2 sur votre prochain coup.",
    effectType: "nextPlacement",
    effectValue: 2,
  },
  {
    id: "lob-2-0-4",
    name: "Lob",
    subtitle: "Lob",
    family: "Lob",
    cost: 1,
    power: 2,
    precision: 4,
    placement: 0,
    boostPower: 3,
    boostPrecision: 4,
    effect: "Récupérez 1 endurance.",
    effectType: "gainEndurance",
    effectValue: 1,
  },
  {
    id: "coup-droit-4-3-5",
    name: "Coup droit",
    subtitle: "Frappe puissante",
    family: "Coup droit",
    cost: 3,
    power: 5,
    precision: 3,
    placement: 5,
    boostPower: 5,
    boostPrecision: 5,
    effect: "Jouez l'effet de votre choix d'une carte déjà jouée lors de cet échange.",
    effectType: "choosePlayedEffect",
  },
  {
    id: "service-coup-droit",
    name: "Service",
    subtitle: "Coup droit service",
    family: "Service",
    cost: 2,
    power: 4,
    precision: 0,
    placement: 3,
    boostPower: 3,
    boostPrecision: 5,
    effect: "Si jouée au service, cette frappe peut être boostée.",
    effectType: "serviceCard",
  },
  {
    id: "revers-3-3-3",
    name: "Revers",
    subtitle: "Chop",
    family: "Revers",
    cost: 2,
    power: 3,
    precision: 3,
    placement: 2,
    boostPower: 3,
    boostPrecision: 4,
    effect: "Piochez 1 carte.",
    effectType: "drawCard",
    effectValue: 1,
  },
  {
    id: "coup-droit-3-3-3",
    name: "Coup droit",
    subtitle: "Coup droit slicé",
    family: "Coup droit",
    star: true,
    cost: 2,
    power: 3,
    precision: 3,
    placement: 1,
    boostPower: 4,
    boostPrecision: 4,
    effect: "Côté faible : l'adversaire est limité à Revers, Lob ou Remise sur son prochain coup.",
    effectType: "limitOpponentFamilies",
    effectFamilies: ["Revers", "Lob", "Remise"],
  },
  {
    id: "revers-5-4-1",
    name: "Revers",
    subtitle: "Revers pleine ligne",
    family: "Revers",
    cost: 3,
    power: 5,
    precision: 2,
    placement: 5,
    boostPower: 3,
    boostPrecision: 5,
    effect: "Défaussez 1 carte de la main de l'adversaire.",
    effectType: "discardOpponent",
    effectValue: 1,
  },
  {
    id: "smash-4-2-1",
    name: "Smash",
    subtitle: "Smash puissant",
    family: "Smash",
    cost: 2,
    power: 4,
    precision: 4,
    placement: 0,
    boostPower: 5,
    boostPrecision: 4,
    effect: "Si l'adversaire ne rattrape pas avec le placement, il perd immédiatement.",
    effectType: "smashThreat",
  },
  {
    id: "revers-3-3-0",
    name: "Revers",
    subtitle: "Retour",
    family: "Revers",
    cost: 1,
    power: 3,
    precision: 4,
    placement: 2,
    boostPower: 4,
    boostPrecision: 4,
    effect: "Annule l'effet de la prochaine carte adverse.",
    effectType: "cancelOpponentNextEffect",
  },
  {
    id: "revers-2",
    name: "Revers",
    subtitle: "Chop",
    family: "Revers",
    star: true,
    cost: 2,
    power: 4,
    precision: 0,
    placement: 4,
    boostPower: 4,
    boostPrecision: 5,
    effect: "Bonus précision +2 et placement +2 sur votre prochain coup.",
    effectType: "nextPrecisionAndPlacement",
    effectValue: 2,
  },
];

const state = {
  players: [],
  deck: [],
  activePlayer: 0,
  server: 0,
  lastCard: null,
  boostAvailableFor: null,
  mandatoryPlacement: false,
  mandatoryPlacementReason: null,
  mandatoryPlacementSourceUid: null,
  returnServiceRestrictionFor: null,
  turnPlacement: [0, 0],
  turnHasEffect: [false, false],
  turnIgnoresPlacement: [false, false],
  turnPlayedCards: [[], []],
  latestPlayedCard: null,
  gameOver: false,
  log: [],
  pendingBoost: null,
  pendingEffectChoice: null,
  pendingCoachChoice: null,
  effectNotice: null,
  turnSnapshot: null,
  turnDirty: false,
};

const els = {
  newGameButton: document.querySelector("#newGameButton"),
  resultPanel: document.querySelector("#resultPanel"),
  player1Summary: document.querySelector("#player1Summary"),
  player2Summary: document.querySelector("#player2Summary"),
  rallyState: document.querySelector("#rallyState"),
  effectNotice: document.querySelector("#effectNotice"),
  centerPlayedCard: document.querySelector("#previousTurnCards"),
  player1Panel: document.querySelector("#player1Panel"),
  player2Panel: document.querySelector("#player2Panel"),
  log: document.querySelector("#log"),
};

function serverSyncParams() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("room") || !params.has("token") || !params.has("seat")) return null;
  return {
    roomId: params.get("room"),
    token: params.get("token"),
    seat: Number(params.get("seat")),
  };
}

function cloneCard(card, copyIndex) {
  return {
    ...card,
    uid: `${card.id}-${copyIndex}-${crypto.randomUUID()}`,
  };
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function createPlayer(name, characterId) {
  return {
    name,
    characterId,
    characterSide: 0,
    endurance: STARTING_ENDURANCE,
    power: 0,
    hand: [],
    played: [],
    nextPrecisionBonus: 0,
    nextPlacementBonus: 0,
    nextDiscount: 0,
    cancelNextOpponentEffect: false,
    limitedFamilies: null,
    limitedFamiliesSourceUid: null,
    freeBoostNext: false,
    endBonuses: [],
    passed: false,
  };
}

function newGame() {
  if (SERVER_SYNC.enabled && SERVER_SYNC.ready && SERVER_SYNC.seat !== 0) {
    state.log.unshift("Seul Coach Ju peut relancer un échange en ligne pour le moment.");
    render();
    return;
  }
  const deck = shuffle(CARD_LIBRARY.map(cloneCard));
  state.players = [createPlayer("Coach Ju", "coachJu"), createPlayer("Coach Max", "coachMax")];
  state.players[0].hand = deck.splice(0, HAND_SIZE);
  state.players[1].hand = deck.splice(0, HAND_SIZE);
  state.deck = deck;
  state.server = Math.random() < 0.5 ? 0 : 1;
  state.activePlayer = state.server;
  state.lastCard = null;
  state.boostAvailableFor = null;
  state.mandatoryPlacement = false;
  state.mandatoryPlacementReason = null;
  state.mandatoryPlacementSourceUid = null;
  state.returnServiceRestrictionFor = null;
  state.turnPlacement = [0, 0];
  state.turnHasEffect = [false, false];
  state.turnIgnoresPlacement = [false, false];
  state.turnPlayedCards = [[], []];
  state.latestPlayedCard = null;
  state.gameOver = false;
  state.pendingBoost = null;
  state.pendingEffectChoice = null;
  state.pendingCoachChoice = null;
  state.effectNotice = null;
  state.turnDirty = false;
  state.log = [`${playerName(state.server)} sert. L'échange commence.`];
  captureTurnSnapshot();
  els.resultPanel.classList.add("hidden");
  if (SERVER_SYNC.enabled && SERVER_SYNC.seat === 0) {
    SERVER_SYNC.initializing = true;
    SERVER_SYNC.ready = true;
  }
  render();
}

const SNAPSHOT_KEYS = [
  "players",
  "deck",
  "activePlayer",
  "server",
  "lastCard",
  "boostAvailableFor",
  "mandatoryPlacement",
  "mandatoryPlacementReason",
  "mandatoryPlacementSourceUid",
  "returnServiceRestrictionFor",
  "turnPlacement",
  "turnHasEffect",
  "turnIgnoresPlacement",
  "turnPlayedCards",
  "latestPlayedCard",
  "gameOver",
  "log",
  "pendingBoost",
  "pendingEffectChoice",
  "pendingCoachChoice",
  "effectNotice",
];

const SYNC_STATE_KEYS = [
  ...SNAPSHOT_KEYS,
  "turnSnapshot",
  "turnDirty",
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function exportSyncState() {
  return Object.fromEntries(SYNC_STATE_KEYS.map((key) => [key, cloneData(state[key])]));
}

function importSyncState(remoteState) {
  SERVER_SYNC.applyingRemote = true;
  for (const key of SYNC_STATE_KEYS) {
    if (remoteState && Object.prototype.hasOwnProperty.call(remoteState, key)) {
      state[key] = cloneData(remoteState[key]);
    }
  }
  render();
  SERVER_SYNC.applyingRemote = false;
}

function captureTurnSnapshot() {
  state.turnSnapshot = Object.fromEntries(SNAPSHOT_KEYS.map((key) => [key, cloneData(state[key])]));
  state.turnDirty = false;
}

function restoreTurnSnapshot() {
  if (!state.turnSnapshot || !state.turnDirty || state.gameOver) return;
  const activeName = playerName(state.activePlayer);
  markLocalServerDirty(state.activePlayer);
  for (const key of SNAPSHOT_KEYS) {
    state[key] = cloneData(state.turnSnapshot[key]);
  }
  state.turnDirty = false;
  state.pendingBoost = null;
  state.pendingEffectChoice = null;
  state.pendingCoachChoice = null;
  state.log.unshift(`${activeName} annule son tour et revient au début de ses choix.`);
  captureTurnSnapshot();
  render();
}

function canUndoTurn(playerIndex) {
  return !state.gameOver && playerIndex === state.activePlayer && state.turnDirty;
}

function playerName(index) {
  return state.players[index].name;
}

function opponentOf(playerIndex) {
  return playerIndex === 0 ? 1 : 0;
}

function markLocalServerDirty(playerIndex) {
  if (SERVER_SYNC.enabled && !SERVER_SYNC.applyingRemote && playerIndex === SERVER_SYNC.seat) {
    SERVER_SYNC.localDirty = true;
  }
}

function activePlayer() {
  return state.players[state.activePlayer];
}

function canUseSeat(playerIndex) {
  return !SERVER_SYNC.enabled || (SERVER_SYNC.ready && playerIndex === SERVER_SYNC.seat);
}

function effectiveCost(player, card) {
  return Math.max(0, card.cost - player.nextDiscount);
}

function getCardStats(player, card, boosted) {
  return {
    power: boosted ? card.boostPower : card.power,
    precision: (boosted ? card.boostPrecision : card.precision) + player.nextPrecisionBonus,
    placement: card.placement + player.nextPlacementBonus,
  };
}

function canAfford(player, card) {
  return player.endurance >= effectiveCost(player, card);
}

function satisfiesFamilyLimit(player, card) {
  return !player.limitedFamilies || player.limitedFamilies.includes(card.family);
}

function satisfiesReturnServiceRestriction(card) {
  return state.returnServiceRestrictionFor !== state.activePlayer || !["Volée", "Smash"].includes(card.family);
}

const COLOR_BOOST_RULES = {
  Passing: ["Smash", "Amortie", "Volée"],
  Volée: ["Passing"],
  Amortie: ["Amortie", "Passing"],
  Lob: ["Volée", "Smash"],
  Smash: ["Lob"],
};

function satisfiesColorBoostCondition(card) {
  return Boolean(state.lastCard && COLOR_BOOST_RULES[card.family]?.includes(state.lastCard.family));
}

function isRemise(card) {
  return card.family === "Remise";
}

function totalTurnPlacement(playerIndex, card, boosted = false) {
  return state.turnPlacement[playerIndex] + getCardStats(state.players[playerIndex], card, boosted).placement;
}

function hasPlacementForPrevious(playerIndex, card, boosted = false) {
  if (!state.lastCard) return true;
  return totalTurnPlacement(playerIndex, card, boosted) >= state.lastCard.precision;
}

function canPlayNormal(playerIndex, card) {
  if (state.gameOver || playerIndex !== state.activePlayer) return false;
  if (!canUseSeat(playerIndex)) return false;
  const player = state.players[playerIndex];
  if (!canAfford(player, card) || !satisfiesFamilyLimit(player, card)) return false;
  if (isRemise(card)) return true;
  if (!satisfiesReturnServiceRestriction(card)) return false;
  if (state.mandatoryPlacement && !hasPlacementForPrevious(playerIndex, card) && card.effectType !== "jokerResponse") return false;
  return true;
}

function canEndTurn(playerIndex) {
  return !state.gameOver && playerIndex === state.activePlayer && canUseSeat(playerIndex) && state.turnHasEffect[playerIndex] && !state.mandatoryPlacement;
}

function canPlayBoost(playerIndex, card) {
  if (state.gameOver || playerIndex !== state.activePlayer) return false;
  if (!canUseSeat(playerIndex)) return false;
  if (isRemise(card)) return false;
  const player = state.players[playerIndex];
  const hasSacrifice = player.hand.some((candidate) => candidate.uid !== card.uid);
  const openingServiceBoost = card.effectType === "serviceCard" && playerIndex === state.server && state.lastCard == null;
  const boostAfterNonBoostedService = card.effectType === "serviceBoostHint" && state.lastCard?.isServiceTurn && !state.lastCard.boosted;
  if (card.family === "Service" && !openingServiceBoost) return false;
  const colorBoost = satisfiesColorBoostCondition(card);
  const boostWindow = state.boostAvailableFor === playerIndex || player.freeBoostNext || openingServiceBoost || boostAfterNonBoostedService || colorBoost;
  if (!boostWindow || !hasSacrifice) return false;
  if (!canAfford(player, card) || !satisfiesFamilyLimit(player, card)) return false;
  if (!satisfiesReturnServiceRestriction(card)) return false;
  return true;
}

function setEffectNotice(status, card, message) {
  state.effectNotice = {
    status,
    cardName: card?.name ?? "Effet",
    message,
  };
}

function playCard(playerIndex, cardUid, boosted = false, sacrificeUid = null, remiseMode = "effect") {
  if (state.gameOver) return;
  const player = state.players[playerIndex];
  const card = player.hand.find((item) => item.uid === cardUid);
  if (!card) return;
  if (boosted && !sacrificeUid) {
    state.pendingBoost = { playerIndex, cardUid };
    render();
    return;
  }
  if (boosted && !canPlayBoost(playerIndex, card)) return;
  if (!boosted && !canPlayNormal(playerIndex, card)) return;
  state.turnDirty = true;
  markLocalServerDirty(playerIndex);

  const opponentIndex = opponentOf(playerIndex);
  const endsTurn = !isRemise(card);
  const isOpeningServe = endsTurn && playerIndex === state.server && state.lastCard == null;
  const countsPlacement = !isRemise(card) || remiseMode === "placement";
  const appliesEffect = !isRemise(card) || remiseMode === "effect";
  const cost = effectiveCost(player, card);
  const rawStats = getCardStats(player, card, boosted);
  const stats = {
    ...rawStats,
    placement: countsPlacement ? rawStats.placement : 0,
  };
  const combinedPlacement = state.turnPlacement[playerIndex] + stats.placement;
  const placementWasInsufficient = Boolean(endsTurn && state.lastCard && combinedPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex]);

  player.endurance -= cost;
  player.nextDiscount = 0;
  player.nextPrecisionBonus = 0;
  player.nextPlacementBonus = 0;
  if (boosted) player.freeBoostNext = false;

  removeFromHand(player, card.uid);

  let sacrificedCard = null;
  if (boosted) {
    sacrificedCard = player.hand.find((item) => item.uid === sacrificeUid);
    if (!sacrificedCard) return;
    removeFromHand(player, sacrificeUid);
  }

  const playedCard = {
    ...card,
    playedUid: crypto.randomUUID(),
    owner: playerIndex,
    boosted,
    sacrificedCard,
    isServiceTurn: isOpeningServe,
    costPaid: cost,
    powerGained: stats.power,
    cardPowerGained: rawStats.power,
    effectPowerGained: 0,
    precision: stats.precision,
    placement: stats.placement,
    turnPlacement: combinedPlacement,
    removed: false,
  };

  player.played.push(playedCard);
  state.turnPlayedCards[playerIndex].push(playedCard);
  state.latestPlayedCard = { ...playedCard };
  player.power += stats.power;

  const boostText = boosted ? " en BOOST" : "";
  const remiseText = isRemise(card) ? (remiseMode === "placement" ? " en REMISE" : " pour l'EFFET") : "";
  state.log.unshift(`${player.name} joue ${card.name}${boostText}${remiseText} : +${stats.power} puissance, précision ${stats.precision}, placement ${stats.placement}${endsTurn ? `, placement total ${combinedPlacement}` : ""}.`);
  const effectCanceled = state.players[opponentIndex].cancelNextOpponentEffect;
  if (!appliesEffect) {
    setEffectNotice("ignoré", card, `${card.effect} Ne s'applique pas car la carte est jouée en Remise.`);
    state.log.unshift(`L'effet de ${card.name} ne s'applique pas car la carte est jouée en Remise.`);
  } else if (effectCanceled) {
    state.players[opponentIndex].cancelNextOpponentEffect = false;
    setEffectNotice("annulé", card, `${card.effect} Annulé par l'effet adverse.`);
    state.log.unshift(`L'effet de ${card.name} est annulé.`);
  } else {
    applyEffect(playerIndex, playedCard);
    setEffectNotice("appliqué", card, card.effect);
  }

  if (state.gameOver) return;

  if (state.pendingEffectChoice) {
    render();
    return;
  }

  if (playedCard.star && endsTurn) {
    const waitingForCoach = applyCharacterEffect(playerIndex, playedCard);
    if (waitingForCoach) {
      render();
      return;
    }
  }

  completePlayedCardResolution(playerIndex, opponentIndex, card, playedCard, isOpeningServe, placementWasInsufficient, boosted, remiseMode);
}

function completePlayedCardResolution(playerIndex, opponentIndex, card, playedCard, isOpeningServe, placementWasInsufficient, boosted, remiseMode = "effect") {
  const player = state.players[playerIndex];
  const endsTurn = !isRemise(card);

  if (isRemise(card) && remiseMode === "effect") {
    state.turnHasEffect[playerIndex] = true;
  }

  state.turnPlacement[playerIndex] = playedCard.turnPlacement;

  if (!endsTurn) {
    state.log.unshift(`${player.name} peut encore jouer : une Remise ne termine pas le tour.`);
    render();
    return;
  }

  if (isOpeningServe && !["Service", "Coup droit"].includes(card.family)) {
    const drawn = drawCards(state.players[opponentIndex], 1);
    state.log.unshift(drawn > 0 ? `${playerName(opponentIndex)} pioche 1 carte car le service n'est ni un Service ni un Coup droit.` : `${playerName(opponentIndex)} devrait piocher, mais le deck est vide.`);
  }

  state.lastCard = playedCard;
  state.returnServiceRestrictionFor = isOpeningServe ? opponentIndex : state.returnServiceRestrictionFor;
  state.mandatoryPlacement = boosted || card.effectType === "smashThreat";
  state.mandatoryPlacementReason = boosted ? "boost" : card.effectType === "smashThreat" ? "smash" : null;
  state.mandatoryPlacementSourceUid = state.mandatoryPlacement ? playedCard.playedUid : null;
  state.boostAvailableFor = !boosted && placementWasInsufficient ? opponentIndex : null;
  state.turnPlacement[playerIndex] = 0;
  state.turnPlacement[opponentIndex] = 0;
  state.turnHasEffect[playerIndex] = false;
  state.turnHasEffect[opponentIndex] = false;
  state.turnIgnoresPlacement[playerIndex] = false;
  state.turnIgnoresPlacement[opponentIndex] = false;
  rememberPreviousTurn(playerIndex);
  player.limitedFamilies = null;
  player.limitedFamiliesSourceUid = null;
  if (state.returnServiceRestrictionFor === playerIndex) {
    state.returnServiceRestrictionFor = null;
  }
  state.activePlayer = opponentIndex;
  captureTurnSnapshot();
  render();
}

function endTurn(playerIndex) {
  if (!canEndTurn(playerIndex)) return;
  markLocalServerDirty(playerIndex);
  const opponentIndex = opponentOf(playerIndex);
  const player = state.players[playerIndex];
  const opponent = state.players[opponentIndex];
  const preparedPlacement = state.turnPlacement[playerIndex];
  const opensBoost = Boolean(state.lastCard && preparedPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex]);

  if (playerIndex === state.server && state.lastCard == null) {
    const drawn = drawCards(opponent, 1);
    state.log.unshift(drawn > 0 ? `${opponent.name} pioche 1 carte car le serveur termine sans Service ni Coup droit.` : `${opponent.name} devrait piocher, mais le deck est vide.`);
  }

  state.boostAvailableFor = opensBoost ? opponentIndex : null;
  state.turnPlacement[playerIndex] = 0;
  state.turnHasEffect[playerIndex] = false;
  state.turnIgnoresPlacement[playerIndex] = false;
  rememberPreviousTurn(playerIndex);
  player.limitedFamilies = null;
  player.limitedFamiliesSourceUid = null;
  if (state.returnServiceRestrictionFor === playerIndex) {
    state.returnServiceRestrictionFor = null;
  }
  state.activePlayer = opponentIndex;
  state.log.unshift(`${player.name} termine son tour après une carte Effet.`);
  captureTurnSnapshot();
  render();
}

function removeFromHand(player, cardUid) {
  player.hand = player.hand.filter((item) => item.uid !== cardUid);
}

function drawCards(player, count) {
  let drawn = 0;
  for (let index = 0; index < count; index += 1) {
    const card = state.deck.shift();
    if (card) {
      player.hand.push(card);
      drawn += 1;
    }
  }
  return drawn;
}

function rememberPreviousTurn(playerIndex) {
  state.turnPlayedCards[playerIndex] = [];
}

function applyEffect(playerIndex, card) {
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];

  switch (card.effectType) {
    case "gainEndurance":
      player.endurance += card.effectValue;
      state.log.unshift(`${player.name} récupère ${card.effectValue} endurance.`);
      break;
    case "drawCard":
      drawCards(player, card.effectValue);
      state.log.unshift(`${player.name} pioche ${card.effectValue} carte.`);
      break;
    case "nextPrecision":
      player.nextPrecisionBonus += card.effectValue;
      state.log.unshift(`${player.name} gagne +${card.effectValue} précision sur son prochain coup.`);
      break;
    case "nextPlacement":
      player.nextPlacementBonus += card.effectValue;
      state.log.unshift(`${player.name} gagne +${card.effectValue} placement sur son prochain coup.`);
      break;
    case "nextPrecisionAndPlacement":
      player.nextPrecisionBonus += card.effectValue;
      player.nextPlacementBonus += card.effectValue;
      state.log.unshift(`${player.name} gagne +${card.effectValue} précision et placement sur son prochain coup.`);
      break;
    case "nextDiscount":
      player.nextDiscount += card.effectValue;
      state.log.unshift(`Le prochain coup de ${player.name} coûte ${card.effectValue} endurance en moins.`);
      break;
    case "cancelOpponentNextEffect":
      player.cancelNextOpponentEffect = true;
      state.log.unshift(`${player.name} annulera le prochain effet adverse.`);
      break;
    case "limitOpponentFamilies":
      opponent.limitedFamilies = card.effectFamilies;
      opponent.limitedFamiliesSourceUid = card.playedUid;
      state.log.unshift(`${opponent.name} devra jouer ${card.effectFamilies.join(", ")} au prochain coup.`);
      break;
    case "discardOpponent":
      if (opponent.hand.length > 0) {
        const discarded = opponent.hand.splice(Math.floor(Math.random() * opponent.hand.length), 1)[0];
        state.log.unshift(`${opponent.name} défausse ${discarded.name}.`);
      }
      break;
    case "removeOpponentLast":
      removeOpponentLastPlayed(opponentIndex);
      break;
    case "doubleLastShot":
      player.endBonuses.push({ type: "doubleLastShot", sourceUid: card.playedUid });
      state.log.unshift(`${player.name} prépare un Double pour la fin de l'échange.`);
      break;
    case "boostedBonusAtEnd":
      player.endBonuses.push({ type: "boostedBonus", value: card.effectValue, sourceUid: card.playedUid });
      state.log.unshift(`${player.name} marquera +${card.effectValue} par carte boostée à la fin.`);
      break;
    case "freeBoostNext":
      player.freeBoostNext = true;
      state.log.unshift(`${player.name} pourra booster son prochain coup.`);
      break;
    case "jokerResponse":
      state.turnIgnoresPlacement[playerIndex] = true;
      if (state.mandatoryPlacement && state.mandatoryPlacementReason === "boost") {
        state.mandatoryPlacement = false;
        state.mandatoryPlacementReason = null;
        state.mandatoryPlacementSourceUid = null;
        state.log.unshift(`${player.name} neutralise la contrainte de placement du BOOST avec Joker pour tout ce tour.`);
      } else {
        state.log.unshift(`${player.name} ignore la contrainte de placement pour tout ce tour grâce à Joker.`);
      }
      break;
    case "choosePlayedEffect":
      openEffectChoice(playerIndex, card);
      break;
    default:
      break;
  }
}

function removeOpponentLastPlayed(opponentIndex) {
  const opponent = state.players[opponentIndex];
  const target = [...opponent.played].reverse().find((card) => !card.removed);
  if (!target) {
    state.log.unshift("Aucune carte adverse à supprimer.");
    return;
  }
  target.removed = true;
  if (state.latestPlayedCard?.playedUid === target.playedUid) {
    state.latestPlayedCard.removed = true;
  }
  const removedPower = target.cardPowerGained ?? target.powerGained;
  opponent.power -= removedPower;
  clearActiveEffectsFromRemovedCard(target);
  state.log.unshift(`${target.name} est supprimée : ${state.players[opponentIndex].name} perd ${removedPower} puissance. Les effets déjà appliqués restent acquis.`);
}

function clearActiveEffectsFromRemovedCard(card) {
  for (const player of state.players) {
    if (player.limitedFamiliesSourceUid === card.playedUid) {
      player.limitedFamilies = null;
      player.limitedFamiliesSourceUid = null;
      state.log.unshift(`La contrainte de type créée par ${card.name} est annulée.`);
    }
    player.endBonuses = player.endBonuses.filter((bonus) => bonus.sourceUid !== card.playedUid);
  }
  if (state.mandatoryPlacementSourceUid === card.playedUid) {
    state.mandatoryPlacement = false;
    state.mandatoryPlacementReason = null;
    state.mandatoryPlacementSourceUid = null;
    state.log.unshift(`La contrainte de placement créée par ${card.name} est annulée.`);
  }
  if (state.lastCard?.playedUid === card.playedUid) {
    state.lastCard = null;
    state.boostAvailableFor = null;
  }
}

function effectChoicesFor(sourcePlayedUid) {
  return state.players
    .flatMap((player) => player.played)
    .filter((card) => !card.removed && card.playedUid !== sourcePlayedUid && card.effectType !== "choosePlayedEffect");
}

function openEffectChoice(playerIndex, sourceCard) {
  const choices = effectChoicesFor(sourceCard.playedUid);
  if (choices.length === 0) {
    state.log.unshift("Aucun effet déjà joué à choisir.");
    setEffectNotice("sans choix", sourceCard, "Aucun effet déjà joué ne peut être choisi.");
    return;
  }
  state.pendingEffectChoice = { playerIndex, sourcePlayedUid: sourceCard.playedUid };
  state.log.unshift(`${state.players[playerIndex].name} doit choisir un effet déjà joué.`);
}

function resolveEffectChoice(chosenPlayedUid) {
  if (!state.pendingEffectChoice) return;
  const { playerIndex, sourcePlayedUid } = state.pendingEffectChoice;
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  const chosen = effectChoicesFor(sourcePlayedUid).find((card) => card.playedUid === chosenPlayedUid);
  state.pendingEffectChoice = null;
  if (!sourceCard || !chosen) {
    state.log.unshift("Choix d'effet impossible.");
    render();
    return;
  }
  const effectCard = {
    ...chosen,
    playedUid: sourceCard.playedUid,
    name: chosen.name,
  };
  state.log.unshift(`${player.name} choisit l'effet de ${chosen.name}.`);
  applyEffect(playerIndex, effectCard);
  setEffectNotice("appliqué", chosen, `Effet choisi via ${sourceCard.name}: ${chosen.effect}`);
  completePlayedCardResolution(
    playerIndex,
    opponentIndex,
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex]),
    sourceCard.boosted,
    "effect",
  );
}

function characterOf(player) {
  return CHARACTERS[player.characterId];
}

function currentCharacterEffect(player) {
  return characterOf(player).effects[player.characterSide];
}

function flipCharacter(player) {
  player.characterSide = player.characterSide === 0 ? 1 : 0;
}

function applyCharacterEffect(playerIndex, playedCard) {
  const player = state.players[playerIndex];
  const character = characterOf(player);
  const effect = currentCharacterEffect(player);
  flipCharacter(player);

  if (effect.type === "drawCard") {
    const drawn = drawCards(player, 1);
    const message = drawn > 0 ? "Piochez 1 carte." : "Le deck est vide, aucune carte piochée.";
    state.log.unshift(`${character.name} (${effect.side}) : ${message}`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}. ${message}`);
    return false;
  }

  if (effect.type === "coupPowerBonus") {
    const alreadyPlayedShots = player.played.filter((card) => !card.removed && isShot(card)).length;
    player.power += alreadyPlayedShots;
    playedCard.effectPowerGained += alreadyPlayedShots;
    state.log.unshift(`${character.name} (${effect.side}) : +${alreadyPlayedShots} puissance pour les coups déjà joués.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}. ${alreadyPlayedShots} coup(s) déjà joué(s) gagnent +1 puissance.`);
    return false;
  }

  if (effect.type === "gainPower") {
    player.power += 2;
    playedCard.effectPowerGained += 2;
    state.log.unshift(`${character.name} (${effect.side}) : +2 puissance.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "recoverUndealt") {
    if (state.deck.length === 0) {
      state.log.unshift(`${character.name} (${effect.side}) : aucune carte non distribuée disponible.`);
      setEffectNotice("coach", { name: character.name }, "Aucune carte non distribuée disponible.");
      return false;
    }
    state.pendingCoachChoice = { playerIndex, sourcePlayedUid: playedCard.playedUid };
    state.log.unshift(`${character.name} (${effect.side}) : ${player.name} choisit une carte non distribuée à récupérer.`);
    setEffectNotice("coach", { name: character.name }, effect.label);
    return true;
  }

  return false;
}

function resolveCoachChoice(cardUid) {
  if (!state.pendingCoachChoice) return;
  const { playerIndex, sourcePlayedUid } = state.pendingCoachChoice;
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const chosen = state.deck.find((card) => card.uid === cardUid);
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingCoachChoice = null;

  if (!chosen || !sourceCard) {
    state.log.unshift("Choix de coach impossible.");
    render();
    return;
  }

  state.deck = state.deck.filter((card) => card.uid !== chosen.uid);
  player.hand.push(chosen);
  state.log.unshift(`${player.name} récupère ${chosen.name} grâce à ${characterOf(player).name}.`);
  setEffectNotice("coach", { name: characterOf(player).name }, `${chosen.name} rejoint la main.`);
  completePlayedCardResolution(
    playerIndex,
    opponentIndex,
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex]),
    sourceCard.boosted,
    "effect",
  );
}

function pass(playerIndex) {
  if (state.gameOver || playerIndex !== state.activePlayer) return;
  if (!canUseSeat(playerIndex)) return;
  markLocalServerDirty(playerIndex);
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  if (state.mandatoryPlacement) {
    player.passed = true;
    const reasonLabel = state.mandatoryPlacementReason === "smash" ? "un Smash" : "un BOOST";
    state.log.unshift(`${player.name} passe sur ${reasonLabel} : ${opponent.name} gagne automatiquement.`);
    finishGame({
      forcedWinner: opponentIndex,
      ignoreScore: true,
      reason: `${player.name} passe sur ${reasonLabel}. ${opponent.name} gagne automatiquement l'échange.`,
    });
    return;
  }
  const bonus = Math.max(2, player.endurance);
  player.passed = true;
  opponent.power += bonus;
  state.log.unshift(`${player.name} passe et donne ${bonus} puissance à ${opponent.name}.`);
  finishGame({ reason: `${player.name} passe. ${opponent.name} gagne ${bonus} puissance. L'échange s'arrête immédiatement.` });
}

function finishGame({ forcedWinner = null, ignoreScore = false, reason }) {
  if (!ignoreScore) applyEndBonuses();
  state.gameOver = true;
  const winner = forcedWinner ?? getWinner();
  const p1 = state.players[0];
  const p2 = state.players[1];
  state.log.unshift(reason);
  els.resultPanel.innerHTML = `
    <p class="eyebrow">Fin de l'échange</p>
    <h2>${state.players[winner].name} gagne l'échange</h2>
    <p>${reason}</p>
    <p>${ignoreScore ? "Victoire automatique : les points ne sont pas comptés." : `Score final : ${p1.name} ${p1.power} - ${p2.power} ${p2.name}${p1.power === p2.power ? `. Égalité : le serveur (${playerName(state.server)}) gagne.` : "."}`}</p>
  `;
  els.resultPanel.classList.remove("hidden");
  render();
}

function applyEndBonuses() {
  for (const player of state.players) {
    for (const bonus of player.endBonuses) {
      if (bonus.type === "doubleLastShot") {
        const target = [...player.played].reverse().find((card) => !card.removed && isShot(card));
        if (target) {
          const doubledPower = target.cardPowerGained ?? target.powerGained;
          player.power += doubledPower;
          state.log.unshift(`${player.name} double ${target.name} : +${doubledPower} puissance.`);
        }
      }
      if (bonus.type === "boostedBonus") {
        const count = player.played.filter((card) => card.boosted && !card.removed).length;
        const gained = count * bonus.value;
        player.power += gained;
        state.log.unshift(`${player.name} gagne +${gained} puissance pour ses cartes boostées.`);
      }
    }
  }
}

function isShot(card) {
  return !["Remise"].includes(card.family);
}

function getWinner() {
  const [p1, p2] = state.players;
  if (p1.power > p2.power) return 0;
  if (p2.power > p1.power) return 1;
  return state.server;
}

function openBoostModal(playerIndex, cardUid) {
  state.pendingBoost = { playerIndex, cardUid };
  render();
}

function closeBoostModal() {
  state.pendingBoost = null;
  render();
}

function render() {
  renderSummary(0, els.player1Summary);
  renderSummary(1, els.player2Summary);
  renderRallyState();
  renderEffectNotice();
  renderPlayerPanel(0, els.player1Panel);
  renderPlayerPanel(1, els.player2Panel);
  renderCenterPlayedCard();
  renderLog();
  renderServerSyncPanel();
  renderBoostModal();
  renderEffectChoiceModal();
  renderCoachChoiceModal();
  scheduleServerSync();
}

function renderServerSyncPanel() {
  let panel = document.querySelector("#serverSyncPanel");
  if (!SERVER_SYNC.enabled) {
    panel?.remove();
    return;
  }
  if (!panel) {
    panel = document.createElement("section");
    panel.id = "serverSyncPanel";
    panel.className = "sync-panel";
    document.querySelector(".topbar")?.append(panel);
  }
  const inviteUrl = SERVER_SYNC.inviteUrl ?? "";
  panel.innerHTML = `
    <p><strong>Partie en ligne</strong> Salon ${SERVER_SYNC.roomId} · ${SERVER_SYNC.seat === 0 ? "Coach Ju" : "Coach Max"}</p>
    ${inviteUrl ? `<label>Lien adversaire<input id="inviteLinkInput" readonly value="${inviteUrl}" /></label><button class="small-button copy-link-button" type="button" data-copy-invite>Copier le lien</button>` : ""}
    <span>${SERVER_SYNC.ready ? "Synchronisé" : "Connexion..."}</span>
  `;
  panel.querySelector("[data-copy-invite]")?.addEventListener("click", async () => {
    const input = panel.querySelector("#inviteLinkInput");
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input.value);
    } catch (error) {
      input.select();
      document.execCommand("copy");
    }
    panel.querySelector("[data-copy-invite]").textContent = "Lien copié";
  });
}

function renderSummary(playerIndex, root) {
  const player = state.players[playerIndex];
  root.innerHTML = `
    <p class="label">${player.name}${state.server === playerIndex ? " · serveur" : ""}</p>
    <div class="summary-grid">
      <div class="metric endurance-metric"><strong>${player.endurance}</strong><span>Endurance</span></div>
      <div class="metric power-metric"><strong>${player.power}</strong><span>Puissance</span></div>
      <div class="metric"><strong>${player.hand.length}</strong><span>Main</span></div>
      <div class="metric"><strong>${player.played.filter((card) => !card.removed).length}</strong><span>Engagées</span></div>
    </div>
  `;
}

function renderRallyState() {
  const active = activePlayer();
  const last = state.lastCard;
  const activeConstraints = [];
  if (state.mandatoryPlacement && last) activeConstraints.push(`placement ${last.precision}+ obligatoire (${state.mandatoryPlacementReason === "smash" ? "Smash" : "Boost"})`);
  if (active.limitedFamilies) activeConstraints.push(`type: ${active.limitedFamilies.join(" / ")}`);
  if (state.returnServiceRestrictionFor === state.activePlayer) activeConstraints.push("retour de service: pas Volée/Smash");
  const lines = [
    `<div><strong>Tour :</strong> ${state.gameOver ? "terminé" : active.name}</div>`,
    `<div><strong>Serveur :</strong> ${playerName(state.server)}</div>`,
    `<div><strong>Dernier coup :</strong> ${last ? `${last.name}${last.boosted ? " BOOST" : ""} · précision ${last.precision}` : "aucun"}</div>`,
    `<div class="${activeConstraints.length ? "constraint-line" : ""}"><strong>Contrainte :</strong> ${activeConstraints.length ? activeConstraints.join(" · ") : "placement insuffisant autorisé"}</div>`,
    `<div><strong>Boost :</strong> ${state.boostAvailableFor == null ? "fermé" : `ouvert pour ${playerName(state.boostAvailableFor)}`}</div>`,
    `<div><strong>Placement préparé :</strong> ${active.power != null ? state.turnPlacement[state.activePlayer] : 0}</div>`,
  ];
  els.rallyState.innerHTML = lines.join("");
}

function renderEffectNotice() {
  if (!state.effectNotice) {
    els.effectNotice.className = "effect-notice muted";
    els.effectNotice.innerHTML = "<strong>Effet</strong>Aucun effet résolu pour le moment.";
    return;
  }
  els.effectNotice.className = "effect-notice";
  els.effectNotice.innerHTML = `<strong>Effet ${state.effectNotice.status} · ${state.effectNotice.cardName}</strong>${state.effectNotice.message}`;
}

function renderCardVisualOnly(card, className = "") {
  if (!card) return '<div class="played-card empty">Aucune carte</div>';
  const imageUrl = CARD_IMAGES[card.id];
  if (!imageUrl) {
    return `<div class="played-card ${className}"><strong>${card.name}</strong>${card.subtitle ?? card.family}</div>`;
  }
  return `
    <div class="played-visual ${className} ${card.removed ? "removed" : ""}">
      <img src="${imageUrl}" alt="${card.name} - ${card.subtitle ?? card.family}" />
      ${card.boosted ? '<span class="played-chip">BOOST</span>' : ""}
      ${card.removed ? '<span class="played-chip removed-chip">RETIRÉE</span>' : ""}
    </div>
  `;
}

function renderCardBack(className = "") {
  return `
    <div class="card-visual card-back ${className}">
      <img src="${CARD_BACK_IMAGE}" alt="Carte face cachée" />
    </div>
  `;
}

function renderCharacterCard(player) {
  const character = characterOf(player);
  const imageUrl = CHARACTER_IMAGES[player.characterId]?.[player.characterSide] ?? CHARACTER_IMAGES[player.characterId]?.[0];
  return `
    <div class="character-card">
      <img src="${imageUrl}" alt="${character.name}" />
    </div>
  `;
}

function renderPlayedHistory(player) {
  if (!player.played.length) {
    return '<div class="played-card empty">Aucune carte</div>';
  }
  return `
    <div class="played-history-row">
      ${player.played.map((card) => renderCardVisualOnly(card, "history-card")).join("")}
    </div>
  `;
}

function renderCenterPlayedCard() {
  if (!state.latestPlayedCard) {
    els.centerPlayedCard.innerHTML = `
      <p class="previous-title">Dernière carte jouée</p>
      <div class="previous-empty">Aucune carte jouée</div>
    `;
    return;
  }
  els.centerPlayedCard.innerHTML = `
    <p class="previous-title">Dernière carte jouée</p>
    <div class="center-card-wrap">
      ${renderCardVisualOnly(state.latestPlayedCard, "center-played")}
    </div>
  `;
}

function activeEffectBadges(playerIndex) {
  const player = state.players[playerIndex];
  const badges = [];
  if (player.nextPrecisionBonus) badges.push({ text: `Prochain coup: +${player.nextPrecisionBonus} précision`, type: "effect" });
  if (player.nextPlacementBonus) badges.push({ text: `Prochain coup: +${player.nextPlacementBonus} placement`, type: "effect" });
  if (player.nextDiscount) badges.push({ text: `Prochain coup: -${player.nextDiscount} endurance`, type: "effect" });
  if (player.cancelNextOpponentEffect) badges.push({ text: "Actif: annule le prochain effet adverse", type: "effect" });
  if (player.freeBoostNext) badges.push({ text: "Actif: boost libre", type: "effect" });
  if (state.turnIgnoresPlacement[playerIndex]) badges.push({ text: "Joker: placement ignoré ce tour", type: "effect" });
  if (player.limitedFamilies) badges.push({ text: `Contrainte tour: ${player.limitedFamilies.join(" / ")}`, type: "constraint" });
  if (state.activePlayer === playerIndex && state.mandatoryPlacement && state.lastCard) {
    badges.push({ text: `Contrainte: placement ${state.lastCard.precision}+`, type: "constraint" });
  }
  if (state.boostAvailableFor === playerIndex) badges.push({ text: "Actif: boost possible", type: "effect" });
  if (state.returnServiceRestrictionFor === playerIndex) {
    badges.push({ text: "Retour: pas Volée/Smash", type: "constraint" });
  }
  for (const bonus of player.endBonuses) {
    if (bonus.type === "doubleLastShot") badges.push({ text: "Fin échange: Double", type: "effect" });
    if (bonus.type === "boostedBonus") badges.push({ text: `Fin échange: +${bonus.value}/boost`, type: "effect" });
  }
  return badges;
}

function renderPlayerPanel(playerIndex, root) {
  const player = state.players[playerIndex];
  root.classList.toggle("active", playerIndex === state.activePlayer && !state.gameOver);
  root.innerHTML = `
    <header class="player-header">
      <div>
        <h2>${player.name}</h2>
        <div class="turn-buttons">
          <button class="pass-button" type="button" data-pass="${playerIndex}" ${playerIndex !== state.activePlayer || state.gameOver || !canUseSeat(playerIndex) ? "disabled" : ""}>Passer</button>
          ${canEndTurn(playerIndex) ? `<button class="small-button end-turn-button" type="button" data-end-turn="${playerIndex}">Terminer le tour</button>` : ""}
          ${canUndoTurn(playerIndex) ? `<button class="small-button undo-turn-button" type="button" data-undo-turn="${playerIndex}">Annuler le tour</button>` : ""}
        </div>
      </div>
      <div class="badges">
        ${state.server === playerIndex ? '<span class="badge server">Serveur</span>' : ""}
        ${state.activePlayer === playerIndex && !state.gameOver ? '<span class="badge active">À jouer</span>' : ""}
        ${player.nextPrecisionBonus ? `<span class="badge">+${player.nextPrecisionBonus} précision</span>` : ""}
        ${player.nextPlacementBonus ? `<span class="badge">+${player.nextPlacementBonus} placement</span>` : ""}
        ${player.nextDiscount ? `<span class="badge">-${player.nextDiscount} coût</span>` : ""}
        ${state.activePlayer === playerIndex && state.turnPlacement[playerIndex] ? `<span class="badge">${state.turnPlacement[playerIndex]} placement préparé</span>` : ""}
        ${player.limitedFamilies ? `<span class="badge">${player.limitedFamilies.join(" / ")}</span>` : ""}
        ${activeEffectBadges(playerIndex).map((badge) => `<span class="badge ${badge.type}-badge">${badge.text}</span>`).join("")}
      </div>
    </header>
    ${renderCharacterCard(player)}
    <div class="hand">
      ${player.hand.map((card) => renderCard(playerIndex, card)).join("")}
    </div>
    <div class="played-history">
      <p class="engaged-title">Cartes jouées</p>
      ${renderPlayedHistory(player)}
    </div>
  `;

  root.querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => playCard(Number(button.dataset.player), button.dataset.play, false, null, button.dataset.mode ?? "effect"));
  });
  root.querySelectorAll("[data-boost]").forEach((button) => {
    button.addEventListener("click", () => openBoostModal(Number(button.dataset.player), button.dataset.boost));
  });
  root.querySelectorAll("[data-pass]").forEach((button) => {
    button.addEventListener("click", () => pass(Number(button.dataset.pass)));
  });
  root.querySelectorAll("[data-end-turn]").forEach((button) => {
    button.addEventListener("click", () => endTurn(Number(button.dataset.endTurn)));
  });
  root.querySelectorAll("[data-undo-turn]").forEach((button) => {
    button.addEventListener("click", () => restoreTurnSnapshot());
  });
}

function renderCard(playerIndex, card) {
  const player = state.players[playerIndex];
  const isHidden = SERVER_SYNC.enabled ? playerIndex !== SERVER_SYNC.seat : playerIndex !== state.activePlayer && !state.gameOver;
  const normalAllowed = canPlayNormal(playerIndex, card);
  const boostAllowed = canPlayBoost(playerIndex, card);
  const cost = effectiveCost(player, card);
  const stats = getCardStats(player, card, false);
  const placementTotal = totalTurnPlacement(playerIndex, card, false);
  const placementIssue = !isRemise(card) && state.lastCard && placementTotal < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex];
  const imageUrl = CARD_IMAGES[card.id];
  const hasDynamicStats = stats.precision !== card.precision || stats.placement !== card.placement || cost !== card.cost || state.turnPlacement[playerIndex] > 0;
  if (isHidden) {
    return `
      <article class="card has-visual hidden-hand-card">
        ${renderCardBack()}
      </article>
    `;
  }
  return `
    <article class="card ${imageUrl ? "has-visual" : ""} ${isRemise(card) ? "remise-card" : ""} ${normalAllowed || boostAllowed ? "" : "unplayable"}">
      ${imageUrl ? `
        <div class="card-visual">
          <img src="${imageUrl}" alt="${card.name} - ${card.subtitle ?? card.family}" />
        </div>
      ` : `
        ${card.star ? '<div class="card-star" aria-label="Carte étoile">★</div>' : ""}
        <div class="card-top">
          <div class="bubble cost">${card.cost}</div>
          <div class="card-title">
            <strong>${card.name}</strong>
            <span>${card.subtitle ?? card.family}</span>
          </div>
          <div class="bubble power">${card.power}</div>
        </div>
        <div class="stats">
          <div class="stat precision">Précision ${stats.precision}</div>
          <div class="stat placement">Placement ${stats.placement}${state.turnPlacement[playerIndex] ? ` + ${state.turnPlacement[playerIndex]}` : ""}</div>
        </div>
        <div class="effect">${card.effect}</div>
        ${isRemise(card) ? '<div class="boost-box remise-note">Remise : ne termine pas le tour</div>' : `<div class="boost-box">Boost : ${card.boostPower} puissance · ${card.boostPrecision} précision</div>`}
      `}
      ${imageUrl && hasDynamicStats ? `
        <div class="visual-stats">
          ${cost !== card.cost ? `<span>Coût actuel ${cost}</span>` : ""}
          ${stats.precision !== card.precision ? `<span>Précision actuelle ${stats.precision}</span>` : ""}
          ${stats.placement !== card.placement || state.turnPlacement[playerIndex] ? `<span>Placement actuel ${stats.placement}${state.turnPlacement[playerIndex] ? ` + ${state.turnPlacement[playerIndex]}` : ""}</span>` : ""}
        </div>
      ` : ""}
      <div class="card-actions ${isRemise(card) ? "remise-actions" : ""}">
        ${isRemise(card) ? `
          <button class="play-button" type="button" data-player="${playerIndex}" data-play="${card.uid}" data-mode="effect" ${normalAllowed ? "" : "disabled"}>${cost} end. · Effet</button>
          <button class="boost-button" type="button" data-player="${playerIndex}" data-play="${card.uid}" data-mode="placement" ${normalAllowed ? "" : "disabled"}>${cost} end. · Remise</button>
        ` : `
          <button class="play-button" type="button" data-player="${playerIndex}" data-play="${card.uid}" ${normalAllowed ? "" : "disabled"}>${cost} end. · Jouer</button>
          <button class="boost-button" type="button" data-player="${playerIndex}" data-boost="${card.uid}" ${boostAllowed ? "" : "disabled"}>Boost</button>
        `}
      </div>
      ${placementIssue && !state.mandatoryPlacement ? '<div class="stat placement">Placement total insuffisant : ouvre le boost adverse</div>' : ""}
    </article>
  `;
}

function renderPlayedCard(card) {
  const totalPower = (card.cardPowerGained ?? card.powerGained) + (card.effectPowerGained ?? 0);
  const effectPowerText = card.effectPowerGained ? ` dont ${card.effectPowerGained} effet` : "";
  return `
    <div class="played-card ${card.boosted ? "boosted-card" : ""}">
      <strong>${card.removed ? "Retirée · " : ""}${card.name}${card.boosted ? " BOOST" : ""}</strong>
      +${totalPower} puissance${effectPowerText} · précision ${card.precision} · placement ${card.placement}
      ${card.sacrificedCard ? `<br>Boost payé avec ${card.sacrificedCard.name}` : ""}
    </div>
  `;
}

function renderLog() {
  els.log.innerHTML = state.log.slice(0, 14).map((line) => `<p>${line}</p>`).join("");
}

function renderBoostModal() {
  document.querySelector(".boost-choice-backdrop")?.remove();
  if (!state.pendingBoost) return;
  const { playerIndex, cardUid } = state.pendingBoost;
  const player = state.players[playerIndex];
  const card = player.hand.find((item) => item.uid === cardUid);
  if (!card) return;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop boost-choice-backdrop";
  const choices = player.hand.filter((item) => item.uid !== cardUid);
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir la carte de boost">
      <h2>Choisir la carte à sacrifier</h2>
      <p>${player.name} booste <strong>${card.name}</strong>. Sélectionne une carte de la main à glisser dessous.</p>
      <button class="small-button" type="button" data-close-modal>Annuler</button>
      <div class="choice-grid">
        ${choices.map((choice) => `
          <button class="choice-card" type="button" data-sacrifice="${choice.uid}">
            <strong>${choice.name}</strong>
            ${choice.family} · coût ${choice.cost} · puissance ${choice.power}
          </button>
        `).join("")}
      </div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelector("[data-close-modal]").addEventListener("click", closeBoostModal);
  backdrop.querySelectorAll("[data-sacrifice]").forEach((button) => {
    button.addEventListener("click", () => {
      const sacrificeUid = button.dataset.sacrifice;
      state.pendingBoost = null;
      playCard(playerIndex, cardUid, true, sacrificeUid);
    });
  });
}

function renderEffectChoiceModal() {
  document.querySelector(".effect-choice-backdrop")?.remove();
  if (!state.pendingEffectChoice) return;
  const { sourcePlayedUid } = state.pendingEffectChoice;
  const choices = effectChoicesFor(sourcePlayedUid);
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop effect-choice-backdrop";
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir un effet">
      <h2>Choisir un effet</h2>
      <p>Sélectionne l'effet d'une carte déjà jouée dans cet échange.</p>
      <div class="choice-grid">
        ${choices.map((choice) => `
          <button class="choice-card" type="button" data-effect-choice="${choice.playedUid}">
            <strong>${choice.name}</strong>
            ${choice.effect}
          </button>
        `).join("")}
      </div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelectorAll("[data-effect-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveEffectChoice(button.dataset.effectChoice));
  });
}

function renderCoachChoiceModal() {
  document.querySelector(".coach-choice-backdrop")?.remove();
  if (!state.pendingCoachChoice) return;
  const { playerIndex } = state.pendingCoachChoice;
  const player = state.players[playerIndex];
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop coach-choice-backdrop";
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir une carte non distribuée">
      <h2>${characterOf(player).name}</h2>
      <p>Choisis une carte non distribuée à ajouter à la main de ${player.name}.</p>
      <div class="choice-grid">
        ${state.deck.map((choice) => `
          <button class="choice-card" type="button" data-coach-choice="${choice.uid}">
            <strong>${choice.name}</strong>
            ${choice.family} · coût ${choice.cost} · puissance ${choice.power}
          </button>
        `).join("")}
      </div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelectorAll("[data-coach-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveCoachChoice(button.dataset.coachChoice));
  });
}

function shouldPushServerState() {
  if (!SERVER_SYNC.enabled || SERVER_SYNC.applyingRemote) return false;
  if (SERVER_SYNC.initializing) return true;
  return SERVER_SYNC.ready && SERVER_SYNC.localDirty;
}

function scheduleServerSync() {
  if (!shouldPushServerState()) return;
  window.clearTimeout(SERVER_SYNC.timer);
  SERVER_SYNC.timer = window.setTimeout(pushServerState, 180);
}

async function pushServerState() {
  if (!shouldPushServerState()) return;
  const payload = JSON.stringify(exportSyncState());
  if (payload === SERVER_SYNC.lastSent) return;
  SERVER_SYNC.lastSent = payload;
  try {
    const response = await fetch(`/api/rooms/${SERVER_SYNC.roomId}/state`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: SERVER_SYNC.token, state: JSON.parse(payload) }),
    });
    if (!response.ok) throw new Error("sync failed");
    const data = await response.json();
    SERVER_SYNC.ready = true;
    SERVER_SYNC.initializing = false;
    SERVER_SYNC.localDirty = false;
    SERVER_SYNC.revision = data.revision ?? SERVER_SYNC.revision;
    SERVER_SYNC.inviteUrl = data.inviteUrl ?? SERVER_SYNC.inviteUrl;
    renderServerSyncPanel();
  } catch (error) {
    state.log.unshift("Synchronisation serveur impossible pour le moment.");
    renderServerSyncPanel();
  }
}

async function pollServerState() {
  if (!SERVER_SYNC.enabled) return;
  try {
    const response = await fetch(`/api/rooms/${SERVER_SYNC.roomId}/state?token=${encodeURIComponent(SERVER_SYNC.token)}&revision=${SERVER_SYNC.revision}`);
    if (!response.ok) throw new Error("poll failed");
    const data = await response.json();
    SERVER_SYNC.inviteUrl = data.inviteUrl ?? SERVER_SYNC.inviteUrl;
    if (data.state && data.revision !== SERVER_SYNC.revision) {
      SERVER_SYNC.revision = data.revision;
      SERVER_SYNC.ready = true;
      SERVER_SYNC.lastSent = JSON.stringify(data.state);
      importSyncState(data.state);
    } else {
      renderServerSyncPanel();
    }
  } catch (error) {
    renderServerSyncPanel();
  }
}

function initServerSync() {
  const params = serverSyncParams();
  if (!params) return;
  SERVER_SYNC.enabled = true;
  SERVER_SYNC.roomId = params.roomId;
  SERVER_SYNC.token = params.token;
  SERVER_SYNC.seat = params.seat;
  SERVER_SYNC.initializing = SERVER_SYNC.seat === 0;
  render();
  if (SERVER_SYNC.initializing) {
    scheduleServerSync();
  }
  pollServerState();
  SERVER_SYNC.pollTimer = window.setInterval(pollServerState, 1000);
}

els.newGameButton.addEventListener("click", newGame);
window.tennisLightDebug = { CARD_LIBRARY, newGame, pass, playCard, endTurn, restoreTurnSnapshot, render, state };
newGame();
initServerSync();
