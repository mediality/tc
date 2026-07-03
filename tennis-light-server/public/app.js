const STARTING_ENDURANCE = 7;
const HAND_SIZE = 6;
const CARD_BACK_IMAGE = "assets/cards/Demo-TC-_0000_VERSO-CARTES.png";
const CROWN_IMAGE = "assets/crown_9418806.png";
const SCORE_DIGIT_IMAGES = {
  0: "assets/0.jpg",
  1: "assets/1.jpg",
  2: "assets/2.jpg",
  3: "assets/3.jpg",
  4: "assets/4.jpg",
  5: "assets/5.jpg",
  6: "assets/6.jpg",
  7: "assets/7.jpg",
};

const SERVER_SYNC = {
  enabled: false,
  roomId: null,
  token: null,
  seat: null,
  ready: false,
  initializing: false,
  applyingRemote: false,
  localDirty: false,
  isHost: false,
  targetSets: null,
  status: null,
  hostSeat: null,
  players: [null, null],
  lastSent: "",
  timer: null,
  pollTimer: null,
  revision: 0,
};

const SOLO_AI = {
  enabled: false,
  playerIndex: 1,
  characterId: "coachMax",
  style: "balanced",
  thinking: false,
  executing: false,
  timer: null,
  nudgeTimer: null,
  nudgeAutoTimer: null,
  watchdogTimer: null,
  nudgeVisible: false,
  nudgeWatchedTurn: null,
};

const MENU_STATE = {
  selectedPlayerIndex: Number(localStorage.getItem("tennisLightSelectedPlayer") || 0),
  nickname: localStorage.getItem("tennisLightNickname") || "",
  lobbyTimer: null,
};

const MATCH_LOG_STORAGE_KEY = "tennisLightMatchLogs";
const ACTION_LOG_STORAGE_KEY = "tennisLightActionLogs";

const COACH_OPTIONS = ["coachJu", "coachMax", "coachCarla", "coachClem"];

const CHARACTERS = {
  coachUnknown: {
    name: "Coach",
    effects: [],
  },
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
  coachCarla: {
    name: "Coach Carla",
    effects: [
      { side: "Bleu", label: "Votre prochain coup coûte 1 endurance en moins", type: "nextDiscount", value: 1 },
      { side: "Rose", label: "+1 puissance et duplique un effet déjà engagé", type: "gainPowerAndChooseAnyPlayedEffect", value: 1 },
    ],
  },
  coachClem: {
    name: "Coach Clem",
    effects: [
      { side: "Bleu", label: "+1 puissance", type: "gainPower", value: 1 },
      { side: "Rose", label: "Récupère autant d'endurance que de coups visibles", type: "recoverEnduranceByShots" },
    ],
  },
};

const CHARACTER_IMAGES = {
  coachUnknown: [
    "assets/cards/Demo-TC-_0027_Coach-INCONNU.png",
    "assets/cards/Demo-TC-_0027_Coach-INCONNU.png",
  ],
  coachJu: [
    "assets/cards/Demo-TC-_0004_Coach-JU-RECTO.png",
    "assets/cards/Demo-TC-_0003_Coach-JU-VERSO-.png",
  ],
  coachMax: [
    "assets/cards/Demo-TC-_0002_Coach-MAX-VERSO.png",
    "assets/cards/Demo-TC-_0001_Coach-MAX-VERSO.png",
  ],
  coachCarla: [
    "assets/cards/Demo-TC-_0025_Coach-CARLA-RECTO.png",
    "assets/cards/Demo-TC-_0026_Coach-CARLA-VERSO.png",
  ],
  coachClem: [
    "assets/cards/Demo-TC-_0023_Coach-CLEM-RECTO.png",
    "assets/cards/Demo-TC-_0024_Coach-CLEM-VERSO.png",
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
    effect: "Si l'adversaire ne rattrape pas avec le placement, il perd immédiatement et ne marque pas de jeu.",
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
  pendingRemoveChoice: null,
  effectNotice: null,
  resultInfo: null,
  turnSnapshot: null,
  turnDirty: false,
  revealAiCards: false,
  actionLog: [],
  setMatch: {
    enabled: false,
    score: [0, 0],
    completedScores: [],
    previousServer: null,
    exchangeNumber: 0,
    decisiveExchange: false,
    setOver: false,
    winner: null,
    targetSets: null,
    setsWon: [0, 0],
    matchOver: false,
    matchWinner: null,
  },
};

const els = {
  newGameButton: document.querySelector("#newGameButton"),
  modeInfoBadge: document.querySelector("#modeInfoBadge"),
  returnLobbyButton: document.querySelector("#returnLobbyButton"),
  menuScreen: document.querySelector("#menuScreen"),
  gameApp: document.querySelector(".game-app"),
  nicknameInput: document.querySelector("#nicknameInput"),
  coachChoiceButtons: document.querySelectorAll("[data-menu-coach]"),
  refreshLobbyButton: document.querySelector("#refreshLobbyButton"),
  createLobbyRoomButton: document.querySelector("#createLobbyRoomButton"),
  onlineFormatSelect: document.querySelector("#onlineFormatSelect"),
  lobbyRooms: document.querySelector("#lobbyRooms"),
  revealAiButton: document.querySelector("#revealAiButton"),
  exportLogsButton: document.querySelector("#exportLogsButton"),
  soloModeButton: document.querySelector("#soloModeButton"),
  setModeButton: document.querySelector("#setModeButton"),
  matchTwoButton: document.querySelector("#matchTwoButton"),
  matchThreeButton: document.querySelector("#matchThreeButton"),
  onlineModeButton: document.querySelector("#onlineModeButton"),
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
    isHost: params.get("host") === "1",
    targetSets: params.has("targetSets") ? Number(params.get("targetSets")) : null,
  };
}

function selectedCharacterId() {
  return COACH_OPTIONS[MENU_STATE.selectedPlayerIndex] ?? "coachJu";
}

function selectedPlayerName() {
  return characterNameFromId(selectedCharacterId());
}

function characterNameFromId(characterId) {
  return CHARACTERS[characterId]?.name ?? "Coach";
}

function normalizeCharacterId(characterId, fallback = "coachJu") {
  return COACH_OPTIONS.includes(characterId) ? characterId : fallback;
}

function onlineProfileForSeat(seat) {
  const remotePlayer = SERVER_SYNC.players?.[seat];
  const fallbackCharacterId = SERVER_SYNC.enabled ? "coachUnknown" : seat === 0 ? "coachJu" : "coachMax";
  const characterId = remotePlayer ? normalizeCharacterId(remotePlayer.characterId, fallbackCharacterId) : fallbackCharacterId;
  const name = characterNameFromId(characterId);
  return {
    name,
    characterId,
    nickname: remotePlayer?.nickname ?? name,
  };
}

function applyOnlinePlayersFromRoom(players = []) {
  SERVER_SYNC.players = [players[0] ?? null, players[1] ?? null];
  if (!state.players.length) return false;
  let changed = false;
  state.players.forEach((player, seat) => {
    const remotePlayer = SERVER_SYNC.players[seat];
    const characterId = remotePlayer ? normalizeCharacterId(remotePlayer.characterId, player.characterId) : "coachUnknown";
    const name = characterNameFromId(characterId);
    const nickname = remotePlayer?.nickname || name;
    if (player.characterId !== characterId) {
      player.characterId = characterId;
      player.characterSide = 0;
      changed = true;
    }
    if (player.name !== name) {
      player.name = name;
      changed = true;
    }
    if (player.nickname !== nickname) {
      player.nickname = nickname;
      changed = true;
    }
  });
  return changed;
}

function nicknameValue() {
  const value = els.nicknameInput?.value?.trim() || MENU_STATE.nickname || "";
  return value || selectedPlayerName();
}

function updateMenuSelection() {
  if (els.nicknameInput) els.nicknameInput.value = MENU_STATE.nickname;
  els.coachChoiceButtons?.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.menuCoach) === MENU_STATE.selectedPlayerIndex);
  });
}

function showGameScreen() {
  els.menuScreen?.classList.add("hidden");
  els.gameApp?.classList.remove("hidden");
}

function showMenuScreen() {
  els.gameApp?.classList.add("hidden");
  els.menuScreen?.classList.remove("hidden");
}

function stopSoloTimers() {
  window.clearTimeout(SOLO_AI.timer);
  window.clearTimeout(SOLO_AI.nudgeTimer);
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  window.clearTimeout(SOLO_AI.watchdogTimer);
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  SOLO_AI.nudgeVisible = false;
  SOLO_AI.nudgeWatchedTurn = null;
}

function leaveOnlineRoom() {
  window.clearInterval(SERVER_SYNC.pollTimer);
  window.clearTimeout(SERVER_SYNC.timer);
  SERVER_SYNC.enabled = false;
  SERVER_SYNC.roomId = null;
  SERVER_SYNC.token = null;
  SERVER_SYNC.seat = null;
  SERVER_SYNC.ready = false;
  SERVER_SYNC.initializing = false;
  SERVER_SYNC.applyingRemote = false;
  SERVER_SYNC.localDirty = false;
  SERVER_SYNC.isHost = false;
  SERVER_SYNC.targetSets = null;
  SERVER_SYNC.status = null;
  SERVER_SYNC.hostSeat = null;
  SERVER_SYNC.players = [null, null];
  SERVER_SYNC.lastSent = "";
  SERVER_SYNC.revision = 0;
}

async function notifyServerLeaveRoom() {
  if (!SERVER_SYNC.enabled || !SERVER_SYNC.roomId || !SERVER_SYNC.token) return;
  try {
    await fetch(`/api/rooms/${SERVER_SYNC.roomId}/leave`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: SERVER_SYNC.token }),
    });
  } catch (error) {
    // Le retour au lobby ne doit pas être bloqué par une réponse réseau absente.
  }
}

function clearOnlineUrlParams() {
  const params = new URLSearchParams(window.location.search);
  ["room", "token", "seat", "host", "targetSets"].forEach((key) => params.delete(key));
  const nextQuery = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
}

function handleRemoteRoomClosed() {
  closeReturnLobbyDialog();
  SOLO_AI.enabled = false;
  stopSoloTimers();
  leaveOnlineRoom();
  clearOnlineUrlParams();
  showMenuScreen();
  refreshLobbyRooms();
  render();
}

function closeReturnLobbyDialog() {
  document.querySelector(".return-lobby-dialog")?.remove();
}

async function confirmReturnToLobby() {
  closeReturnLobbyDialog();
  await notifyServerLeaveRoom();
  SOLO_AI.enabled = false;
  stopSoloTimers();
  leaveOnlineRoom();
  clearOnlineUrlParams();
  showMenuScreen();
  refreshLobbyRooms();
  render();
}

function openReturnLobbyDialog() {
  closeReturnLobbyDialog();
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop return-lobby-dialog";
  backdrop.innerHTML = `
    <div class="modal return-lobby-modal" role="dialog" aria-modal="true" aria-labelledby="returnLobbyTitle">
      <h2 id="returnLobbyTitle">Voulez-vous retourner au lobby ?</h2>
      <p>La partie en cours restera affichée seulement si vous choisissez Non.</p>
      <div class="dialog-actions">
        <button class="primary-button" type="button" data-confirm-return-lobby>OUI</button>
        <button class="small-button" type="button" data-cancel-return-lobby>NON</button>
      </div>
    </div>
  `;
  backdrop.querySelector("[data-confirm-return-lobby]")?.addEventListener("click", confirmReturnToLobby);
  backdrop.querySelector("[data-cancel-return-lobby]")?.addEventListener("click", closeReturnLobbyDialog);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeReturnLobbyDialog();
  });
  document.body.appendChild(backdrop);
}

function configureSoloOpponent() {
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.characterId = randomAiCharacterId();
}

function randomAiCharacterId() {
  const available = COACH_OPTIONS.filter((characterId) => characterId !== selectedCharacterId());
  return available[Math.floor(Math.random() * available.length)] ?? "coachMax";
}

function startSoloFromMenu(mode) {
  configureSoloOpponent();
  showGameScreen();
  if (mode === "exchange") {
    startSoloGame();
  } else if (mode === "set") {
    startMatchMode(null);
  } else if (mode === "match2") {
    startMatchMode(2);
  } else if (mode === "match3") {
    startMatchMode(3);
  }
}

function renderLobbyRooms(rooms = []) {
  if (!els.lobbyRooms) return;
  if (!rooms.length) {
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Aucune partie ouverte pour le moment.</div>';
    return;
  }
  els.lobbyRooms.innerHTML = rooms.map((room) => {
    const host = room.players.find(Boolean);
    const format = room.targetSets === 3 ? "Match 3 sets" : "Match 2 sets";
    const coach = characterNameFromId(normalizeCharacterId(host?.characterId, "coachJu"));
    return `
      <article class="lobby-room">
        <div>
          <strong>${host?.nickname ?? "Joueur"} · ${format}</strong>
          <span>${coach} · Salon ${room.id}</span>
        </div>
        <button class="small-button" type="button" data-join-room="${room.id}">Rejoindre</button>
      </article>
    `;
  }).join("");
  els.lobbyRooms.querySelectorAll("[data-join-room]").forEach((button) => {
    button.addEventListener("click", () => joinLobbyRoom(button.dataset.joinRoom));
  });
}

async function refreshLobbyRooms() {
  if (!els.lobbyRooms) return;
  try {
    const response = await fetch("/api/lobby");
    if (!response.ok) throw new Error("lobby unavailable");
    const data = await response.json();
    renderLobbyRooms(data.rooms ?? []);
  } catch (error) {
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Lobby indisponible sur cette version locale.</div>';
  }
}

async function createLobbyRoom() {
  const targetSets = Number(els.onlineFormatSelect?.value || 2);
  try {
    const response = await fetch("/api/lobby/rooms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nickname: nicknameValue(),
        characterId: selectedCharacterId(),
        targetSets,
      }),
    });
    if (!response.ok) throw new Error("create failed");
    const data = await response.json();
    window.location.href = data.playerUrl;
  } catch (error) {
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Impossible de créer une partie depuis cette version. Lancez la version serveur.</div>';
  }
}

async function joinLobbyRoom(roomId) {
  try {
    const response = await fetch(`/api/lobby/rooms/${encodeURIComponent(roomId)}/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname: nicknameValue(), characterId: selectedCharacterId() }),
    });
    if (!response.ok) throw new Error("join failed");
    const data = await response.json();
    window.location.href = data.playerUrl;
  } catch (error) {
    await refreshLobbyRooms();
  }
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

function createPlayer(name, characterId, nickname = name) {
  return {
    name,
    nickname,
    characterId,
    characterSide: 0,
    roseEnduranceAwarded: false,
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

function readStoredJson(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Les logs sont utiles pour l'analyse, mais ne doivent jamais bloquer la partie.
  }
}

function cardLogInfo(card) {
  if (!card) return null;
  return {
    id: card.id,
    uid: card.uid,
    playedUid: card.playedUid,
    name: card.name,
    subtitle: card.subtitle,
    family: card.family,
    cost: card.cost,
    power: card.power,
    precision: card.precision,
    placement: card.placement,
    boostPower: card.boostPower,
    boostPrecision: card.boostPrecision,
    effectType: card.effectType,
    copiedSmashThreat: Boolean(card.copiedSmashThreat),
    boosted: Boolean(card.boosted),
    removed: Boolean(card.removed),
  };
}

function playerLogInfo(player) {
  return {
    name: player.name,
    characterId: player.characterId,
    endurance: player.endurance,
    power: player.power,
    handCount: player.hand.length,
    playedCount: player.played.filter((card) => !card.removed).length,
    hand: player.hand.map(cardLogInfo),
  };
}

function constraintsLogInfo() {
  return {
    activePlayer: state.activePlayer,
    server: state.server,
    lastCard: cardLogInfo(state.lastCard),
    boostAvailableFor: state.boostAvailableFor,
    mandatoryPlacement: state.mandatoryPlacement,
    mandatoryPlacementReason: state.mandatoryPlacementReason,
    mandatoryPlacementSourceUid: state.mandatoryPlacementSourceUid,
    returnServiceRestrictionFor: state.returnServiceRestrictionFor,
    turnPlacement: [...state.turnPlacement],
    turnHasEffect: [...state.turnHasEffect],
    turnIgnoresPlacement: [...state.turnIgnoresPlacement],
    limitedFamilies: state.players.map((player) => player.limitedFamilies ? [...player.limitedFamilies] : null),
  };
}

function recordAction(kind, payload = {}) {
  const playMode = payload.mode ?? null;
  const entry = {
    createdAt: new Date().toISOString(),
    kind,
    ...payload,
    mode: SERVER_SYNC.enabled ? "online" : state.setMatch.enabled ? "set-ai" : SOLO_AI.enabled ? "solo-ai" : "local",
    playMode,
    exchangeNumber: state.setMatch.exchangeNumber,
    setScore: state.setMatch.enabled ? [...state.setMatch.score] : null,
    server: state.server,
    activePlayer: state.activePlayer,
    coachJuFocus: payload.playerIndex === 0 || payload.opponentIndex === 0,
  };
  state.actionLog.push(entry);
  const stored = readStoredJson(ACTION_LOG_STORAGE_KEY, []);
  stored.push(entry);
  writeStoredJson(ACTION_LOG_STORAGE_KEY, stored.slice(-2500));
}

function logKey(entry) {
  return `${entry.createdAt ?? entry.completedAt ?? ""}:${entry.kind ?? entry.winType ?? ""}:${entry.exchangeNumber ?? ""}:${entry.playerIndex ?? ""}`;
}

function mergeLogEntries(...groups) {
  const map = new Map();
  for (const entry of groups.flat().filter(Boolean)) {
    map.set(logKey(entry), entry);
  }
  return [...map.values()];
}

function absorbServerLogs(logs = []) {
  if (!Array.isArray(logs) || logs.length === 0) return;
  const merged = mergeLogEntries(readStoredJson(ACTION_LOG_STORAGE_KEY, []), logs);
  writeStoredJson(ACTION_LOG_STORAGE_KEY, merged.slice(-5000));
}

function exportLogsFile() {
  const detailedActions = mergeLogEntries(readStoredJson(ACTION_LOG_STORAGE_KEY, []), state.actionLog ?? []);
  const exchangeResults = getStoredMatchLogs();
  const payload = {
    exportedAt: new Date().toISOString(),
    game: "Tennis Courts Academy",
    version: "v65",
    description: "Journal detaille des actions pour analyser le style de jeu, surtout Coach Ju.",
    summary: {
      detailedActionCount: detailedActions.length,
      exchangeResultCount: exchangeResults.length,
      coachJuActionCount: detailedActions.filter((entry) => entry.playerIndex === 0 || entry.coachJuFocus).length,
    },
    coachJuActions: detailedActions.filter((entry) => entry.playerIndex === 0 || entry.coachJuFocus),
    detailedActions,
    exchangeResults,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `tennis-courts-academy-logs-${stamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function resetSetMatch() {
  state.setMatch = {
    enabled: false,
    score: [0, 0],
    completedScores: [],
    previousServer: null,
    exchangeNumber: 0,
    decisiveExchange: false,
    setOver: false,
    winner: null,
    targetSets: null,
    setsWon: [0, 0],
    matchOver: false,
    matchWinner: null,
  };
}

function newGame(options = {}) {
  const { preserveSet = false, serverOverride = null } = options;
  if (SERVER_SYNC.enabled && SERVER_SYNC.ready && !SERVER_SYNC.isHost) {
    state.log.unshift("Seul l'hôte peut relancer un échange en ligne pour le moment.");
    render();
    return;
  }
  if (!preserveSet) {
    resetSetMatch();
  }
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  window.clearTimeout(SOLO_AI.timer);
  window.clearTimeout(SOLO_AI.nudgeTimer);
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  window.clearTimeout(SOLO_AI.watchdogTimer);
  SOLO_AI.nudgeVisible = false;
  SOLO_AI.nudgeWatchedTurn = null;
  const deck = shuffle(CARD_LIBRARY.map(cloneCard));
  const profiles = SERVER_SYNC.enabled
    ? [onlineProfileForSeat(0), onlineProfileForSeat(1)]
    : [null, null];
  const humanCharacterId = selectedCharacterId();
  const aiCharacterId = SOLO_AI.characterId ?? randomAiCharacterId();
  state.players = SERVER_SYNC.enabled
    ? profiles.map((profile) => createPlayer(profile.name, profile.characterId, profile.nickname))
    : [
      createPlayer(characterNameFromId(humanCharacterId), humanCharacterId, nicknameValue()),
      createPlayer(characterNameFromId(aiCharacterId), aiCharacterId, characterNameFromId(aiCharacterId)),
    ];
  state.players[0].hand = deck.splice(0, HAND_SIZE);
  state.players[1].hand = deck.splice(0, HAND_SIZE);
  state.deck = deck;
  state.server = serverOverride ?? (Math.random() < 0.5 ? 0 : 1);
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
  state.pendingRemoveChoice = null;
  state.effectNotice = null;
  state.resultInfo = null;
  state.turnDirty = false;
  state.revealAiCards = false;
  state.actionLog = [];
  if (state.setMatch.enabled) {
    state.setMatch.exchangeNumber += 1;
    state.setMatch.previousServer = state.server;
    state.setMatch.decisiveExchange = isDecisiveSetScore(state.setMatch.score);
  }
  const setText = state.setMatch.enabled ? ` Set ${state.setMatch.score[0]}/${state.setMatch.score[1]}.` : "";
  const decisiveText = state.setMatch.decisiveExchange ? " Échange décisif." : "";
  state.log = [`${playerName(state.server)} sert. L'échange commence.${setText}${decisiveText}`];
  recordAction("exchange_start", {
    playerIndex: state.server,
    playerName: playerName(state.server),
    players: state.players.map(playerLogInfo),
    deckCount: state.deck.length,
    constraints: constraintsLogInfo(),
  });
  if (SOLO_AI.enabled) {
    SOLO_AI.style = chooseSoloAIStyle();
  }
  captureTurnSnapshot();
  els.resultPanel.classList.add("hidden");
  if (SERVER_SYNC.enabled && SERVER_SYNC.isHost) {
    SERVER_SYNC.initializing = true;
    SERVER_SYNC.ready = true;
  }
  render();
  if (SOLO_AI.enabled) {
    window.clearTimeout(SOLO_AI.timer);
    window.clearTimeout(SOLO_AI.nudgeTimer);
    window.clearTimeout(SOLO_AI.nudgeAutoTimer);
    window.clearTimeout(SOLO_AI.watchdogTimer);
    SOLO_AI.thinking = false;
    SOLO_AI.executing = false;
    SOLO_AI.nudgeVisible = false;
    SOLO_AI.nudgeWatchedTurn = null;
    window.setTimeout(maybeRunSoloAI, 80);
  }
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
  "pendingRemoveChoice",
  "effectNotice",
  "resultInfo",
  "revealAiCards",
  "setMatch",
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
  state.pendingRemoveChoice = null;
  state.log.unshift(`${activeName} annule son tour et revient au début de ses choix.`);
  recordAction("undo_turn", {
    playerIndex: state.activePlayer,
    playerName: activeName,
    constraints: constraintsLogInfo(),
    players: state.players.map(playerLogInfo),
  });
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

function onlineRoomReady() {
  return !SERVER_SYNC.enabled || SERVER_SYNC.players.filter(Boolean).length === 2;
}

function markLocalServerDirty(playerIndex) {
  if (SERVER_SYNC.enabled && !SERVER_SYNC.applyingRemote && playerIndex === SERVER_SYNC.seat) {
    SERVER_SYNC.localDirty = true;
  }
}

function markServerDirtyForHostAction() {
  if (SERVER_SYNC.enabled && !SERVER_SYNC.applyingRemote && SERVER_SYNC.isHost) {
    SERVER_SYNC.localDirty = true;
  }
}

function activePlayer() {
  return state.players[state.activePlayer];
}

function canUseSeat(playerIndex) {
  if (SERVER_SYNC.enabled) return SERVER_SYNC.ready && onlineRoomReady() && playerIndex === SERVER_SYNC.seat;
  if (SOLO_AI.enabled) return playerIndex !== SOLO_AI.playerIndex || (playerIndex === SOLO_AI.playerIndex && SOLO_AI.executing);
  return true;
}

function effectiveCost(player, card) {
  return isRemise(card) ? card.cost : Math.max(0, card.cost - player.nextDiscount);
}

function getCardStats(player, card, boosted) {
  const shotBonus = isRemise(card) ? 0 : 1;
  return {
    power: boosted ? card.boostPower : card.power,
    precision: (boosted ? card.boostPrecision : card.precision) + player.nextPrecisionBonus * shotBonus,
    placement: card.placement + player.nextPlacementBonus * shotBonus,
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

function isFreeBoostNextWindow(playerIndex) {
  if (!state.lastCard?.boosted) return false;
  if (state.lastCard.isServiceTurn && playerIndex === opponentOf(state.server)) return true;
  const serverShots = state.players[state.server].played.filter((card) => !card.removed && isShot(card)).length;
  const receiverIndex = opponentOf(state.server);
  const receiverShots = state.players[receiverIndex].played.filter((card) => !card.removed && isShot(card)).length;
  return playerIndex === state.server && state.lastCard.owner === receiverIndex && serverShots === 1 && receiverShots === 1;
}

function isServiceBoostHintWindow(playerIndex) {
  if (!state.lastCard?.isServiceTurn || state.lastCard.boosted) return false;
  if (playerIndex !== opponentOf(state.server)) return false;
  const receiverShots = state.players[playerIndex].played.filter((card) => !card.removed && isShot(card)).length;
  return receiverShots === 0;
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
  if (state.gameOver || playerIndex !== state.activePlayer || !canUseSeat(playerIndex)) return false;
  if (state.mandatoryPlacement) {
    return hasPlayedThisTurn(playerIndex) && state.lastCard && state.turnPlacement[playerIndex] >= state.lastCard.precision;
  }
  return state.turnHasEffect[playerIndex] || state.turnPlacement[playerIndex] > 0;
}

function hasPlayedThisTurn(playerIndex) {
  return state.turnHasEffect[playerIndex] || state.turnPlacement[playerIndex] > 0 || state.turnPlayedCards[playerIndex].length > 0;
}

function canPlayBoost(playerIndex, card) {
  if (state.gameOver || playerIndex !== state.activePlayer) return false;
  if (!canUseSeat(playerIndex)) return false;
  if (isRemise(card)) return false;
  const player = state.players[playerIndex];
  const hasSacrifice = player.hand.some((candidate) => candidate.uid !== card.uid);
  const openingServiceBoost = card.effectType === "serviceCard" && playerIndex === state.server && state.lastCard == null;
  const boostAfterNonBoostedService = card.effectType === "serviceBoostHint" && isServiceBoostHintWindow(playerIndex);
  if (card.family === "Service" && !openingServiceBoost) return false;
  const colorBoost = satisfiesColorBoostCondition(card);
  const boostWindow = state.boostAvailableFor === playerIndex || player.freeBoostNext || openingServiceBoost || boostAfterNonBoostedService || colorBoost;
  if (!boostWindow || !hasSacrifice) return false;
  if (!canAfford(player, card) || !satisfiesFamilyLimit(player, card)) return false;
  if (!satisfiesReturnServiceRestriction(card)) return false;
  return true;
}

function startSoloGame() {
  if (SERVER_SYNC.enabled) {
    state.log.unshift("Le mode solo est disponible hors partie en ligne.");
    render();
    return;
  }
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = opponentOf(MENU_STATE.selectedPlayerIndex);
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  window.clearTimeout(SOLO_AI.timer);
  window.clearTimeout(SOLO_AI.nudgeTimer);
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  window.clearTimeout(SOLO_AI.watchdogTimer);
  SOLO_AI.nudgeVisible = false;
  SOLO_AI.nudgeWatchedTurn = null;
  newGame();
  const styleLabel = aiStyleLabel();
  state.log.unshift(`Mode IA : vous jouez ${selectedPlayerName()}, l'autre coach joue ${styleLabel}.`);
  render();
}

async function startOnlineGame() {
  showMenuScreen();
  await refreshLobbyRooms();
}

function toggleRevealAiCards() {
  if (!SOLO_AI.enabled || !state.gameOver) return;
  state.revealAiCards = !state.revealAiCards;
  render();
}

function maybeRunSoloAI() {
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || state.gameOver) return;
  if (state.activePlayer !== SOLO_AI.playerIndex) return;
  if (SOLO_AI.thinking || SOLO_AI.executing) return;
  SOLO_AI.thinking = true;
  SOLO_AI.nudgeVisible = false;
  window.clearTimeout(SOLO_AI.timer);
  SOLO_AI.timer = window.setTimeout(runSoloAITurn, 2000);
  scheduleSoloAINudge();
  scheduleSoloAIWatchdog();
}

function runSoloAITurn() {
  SOLO_AI.thinking = false;
  SOLO_AI.nudgeVisible = false;
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || state.gameOver || state.activePlayer !== SOLO_AI.playerIndex) return;
  SOLO_AI.executing = true;
  const beforeSignature = soloTurnSignature();
  try {
    if (resolveSoloPendingChoice()) {
      ensureSoloProgress(beforeSignature);
      return;
    }

    const playerIndex = SOLO_AI.playerIndex;
    if (canEndTurn(playerIndex) && state.turnHasEffect[playerIndex] && !canSoloFinishWithCoup(playerIndex)) {
      endTurn(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (canSoloPassAndWin(playerIndex)) {
      pass(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (shouldSoloPassToLimitBoostDamage(playerIndex)) {
      pass(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (state.mandatoryPlacement) {
      const defenseAction = chooseSoloPlacementDefenseAction(playerIndex);
      if (defenseAction) {
        performSoloDefenseAction(playerIndex, defenseAction);
        ensureSoloProgress(beforeSignature);
        return;
      }
    }

    const strategicEffect = chooseSoloStrategicEffect(playerIndex);
    if (strategicEffect) {
      playCard(playerIndex, strategicEffect.uid, false, null, "effect");
      ensureSoloProgress(beforeSignature);
      return;
    }

    const boostPlay = chooseSoloBoostPlay(playerIndex);
    if (boostPlay) {
      playCard(playerIndex, boostPlay.card.uid, true, boostPlay.sacrifice.uid);
      ensureSoloProgress(beforeSignature);
      return;
    }

    const urgentPlacementRemise = chooseSoloRemiseForPlacement(playerIndex);
    if (urgentPlacementRemise) {
      playCard(playerIndex, urgentPlacementRemise.uid, false, null, "placement");
      ensureSoloProgress(beforeSignature);
      return;
    }

    const normalCoup = chooseSoloNormalCoup(playerIndex);
    if (normalCoup) {
      playCard(playerIndex, normalCoup.uid);
      ensureSoloProgress(beforeSignature);
      return;
    }

    const usefulEffect = chooseSoloEffectCard(playerIndex);
    if (usefulEffect) {
      playCard(playerIndex, usefulEffect.uid, false, null, "effect");
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (canEndTurn(playerIndex)) {
      endTurn(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (state.turnDirty && state.turnSnapshot) {
      restoreTurnSnapshot();
      ensureSoloProgress(beforeSignature);
      return;
    }

    pass(playerIndex);
  } catch (error) {
    state.log.unshift(`IA Coach Max : décision impossible, plan de secours activé.`);
    soloEmergencyFallback(SOLO_AI.playerIndex);
  } finally {
    SOLO_AI.executing = false;
    maybeRunSoloAI();
  }
}

function soloTurnSignature() {
  const player = state.players[SOLO_AI.playerIndex];
  return JSON.stringify({
    activePlayer: state.activePlayer,
    gameOver: state.gameOver,
    hand: player?.hand.length,
    played: player?.played.length,
    endurance: player?.endurance,
    power: player?.power,
    log: state.log.length,
    pendingEffect: state.pendingEffectChoice,
    pendingCoach: state.pendingCoachChoice,
    turnHasEffect: state.turnHasEffect[SOLO_AI.playerIndex],
    turnPlacement: state.turnPlacement[SOLO_AI.playerIndex],
  });
}

function ensureSoloProgress(beforeSignature) {
  if (state.gameOver || state.activePlayer !== SOLO_AI.playerIndex) return;
  if (soloTurnSignature() !== beforeSignature) return;
  state.log.unshift("IA Coach Max : aucune progression détectée, action de secours.");
  soloEmergencyFallback(SOLO_AI.playerIndex);
}

function soloEmergencyFallback(playerIndex) {
  if (state.gameOver || state.activePlayer !== playerIndex) return;
  if (resolveSoloPendingChoice(true)) return;
  const defenseAction = chooseSoloPlacementDefenseAction(playerIndex);
  if (defenseAction) {
    performSoloDefenseAction(playerIndex, defenseAction);
    return;
  }
  const forcedPlacementRemise = chooseSoloRemiseForPlacement(playerIndex);
  if (forcedPlacementRemise) {
    playCard(playerIndex, forcedPlacementRemise.uid, false, null, "placement");
    return;
  }
  if (canEndTurn(playerIndex)) {
    endTurn(playerIndex);
    return;
  }
  const player = state.players[playerIndex];
  const forcedBoost = chooseSoloBoostPlay(playerIndex);
  if (forcedBoost) {
    playCard(playerIndex, forcedBoost.card.uid, true, forcedBoost.sacrifice.uid);
    return;
  }
  const forcedCoup = player.hand.find((card) => !isRemise(card) && canPlayNormal(playerIndex, card));
  if (forcedCoup) {
    playCard(playerIndex, forcedCoup.uid);
    return;
  }
  const forcedRemise = player.hand.find((card) => isRemise(card) && canPlayNormal(playerIndex, card));
  if (forcedRemise && !state.mandatoryPlacement) {
    playCard(playerIndex, forcedRemise.uid, false, null, "effect");
    return;
  }
  pass(playerIndex);
}

function chooseSoloPlacementDefenseAction(playerIndex) {
  if (!state.mandatoryPlacement || !state.lastCard) return null;
  if (canEndTurn(playerIndex)) return { type: "end" };

  const escapeEffect = chooseSoloBoostEscapeEffect(playerIndex);
  const directCoup = chooseSoloNormalCoup(playerIndex);
  const defensePlan = chooseSoloRemiseDefensePlan(playerIndex);

  if (escapeEffect && shouldUseSoloBoostEscapeEffect(playerIndex, escapeEffect, directCoup, defensePlan)) {
    return { type: "effect", card: escapeEffect };
  }

  if (directCoup) return { type: "normal", card: directCoup };

  const counterBoost = chooseSoloBoostPlay(playerIndex);
  if (counterBoost) return { type: "boost", card: counterBoost.card, sacrifice: counterBoost.sacrifice };

  if (defensePlan?.remises.length) {
    return { type: "remise", card: defensePlan.remises[0] };
  }
  if (defensePlan?.coup && canPlayNormal(playerIndex, defensePlan.coup)) {
    return { type: "normal", card: defensePlan.coup };
  }
  return null;
}

function performSoloDefenseAction(playerIndex, action) {
  if (action.type === "end") {
    endTurn(playerIndex);
    return;
  }
  if (action.type === "boost") {
    playCard(playerIndex, action.card.uid, true, action.sacrifice.uid);
    return;
  }
  if (action.type === "remise") {
    playCard(playerIndex, action.card.uid, false, null, "placement");
    return;
  }
  if (action.type === "effect") {
    playCard(playerIndex, action.card.uid, false, null, "effect");
    return;
  }
  if (action.type === "normal") {
    playCard(playerIndex, action.card.uid);
  }
}

function chooseSoloBoostEscapeEffect(playerIndex) {
  if (state.mandatoryPlacementReason !== "boost") return null;
  const player = state.players[playerIndex];
  const effects = player.hand
    .filter((card) => isRemise(card) && canPlayNormal(playerIndex, card))
    .filter((card) => card.effectType === "jokerResponse" || card.effectType === "removeOpponentLast")
    .map((card) => ({ card, score: soloBoostEscapeEffectScore(playerIndex, card) }))
    .filter((choice) => choice.score > 0)
    .sort((a, b) => b.score - a.score);
  return effects[0]?.card ?? null;
}

function soloBoostEscapeEffectScore(playerIndex, card) {
  const player = state.players[playerIndex];
  const remainingEndurance = player.endurance - effectiveCost(player, card);
  if (remainingEndurance < 0) return 0;
  const followUpCoups = player.hand
    .filter((candidate) => candidate.uid !== card.uid && !isRemise(candidate))
    .filter((candidate) => effectiveCost(player, candidate) <= remainingEndurance)
    .filter((candidate) => satisfiesFamilyLimit(player, candidate) && satisfiesReturnServiceRestriction(candidate));
  const bestFollowUp = followUpCoups.sort((a, b) => soloPlayableCoupScore(playerIndex, b) - soloPlayableCoupScore(playerIndex, a))[0];
  const followUpValue = bestFollowUp ? 18 + soloPlayableCoupScore(playerIndex, bestFollowUp) : 0;
  if (card.effectType === "jokerResponse") return 20 + followUpValue - effectiveCost(player, card) * 4;
  if (card.effectType === "removeOpponentLast") {
    const target = bestRemovalTargetFor(playerIndex);
    if (!target) return 0;
    return 24 + removalTargetScore(target) + followUpValue - effectiveCost(player, card) * 4;
  }
  return 0;
}

function shouldUseSoloBoostEscapeEffect(playerIndex, escapeEffect, directCoup, defensePlan) {
  if (!directCoup && !defensePlan?.coup) return true;
  const escapeScore = soloBoostEscapeEffectScore(playerIndex, escapeEffect);
  const directScore = directCoup ? soloPlayableCoupScore(playerIndex, directCoup) + 18 : -Infinity;
  const defenseScore = defensePlan?.score ?? -Infinity;
  return escapeScore >= Math.max(directScore, defenseScore - 4);
}

function currentAITurnKey() {
  return `${state.setMatch.exchangeNumber ?? 0}:${state.activePlayer}:${state.players[SOLO_AI.playerIndex]?.played.length ?? 0}:${state.players[SOLO_AI.playerIndex]?.hand.length ?? 0}:${state.log.length}`;
}

function scheduleSoloAINudge() {
  if (SERVER_SYNC.enabled || state.gameOver || state.activePlayer !== SOLO_AI.playerIndex) {
    window.clearTimeout(SOLO_AI.nudgeTimer);
    window.clearTimeout(SOLO_AI.nudgeAutoTimer);
    window.clearTimeout(SOLO_AI.watchdogTimer);
    SOLO_AI.nudgeVisible = false;
    SOLO_AI.nudgeWatchedTurn = null;
    return;
  }
  const turnKey = currentAITurnKey();
  if (SOLO_AI.nudgeWatchedTurn === turnKey) return;
  SOLO_AI.nudgeWatchedTurn = turnKey;
  SOLO_AI.nudgeVisible = false;
  window.clearTimeout(SOLO_AI.nudgeTimer);
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  SOLO_AI.nudgeTimer = window.setTimeout(showSoloAINudge, 5000);
  scheduleSoloAIWatchdog();
}

function scheduleSoloAIWatchdog() {
  if (SERVER_SYNC.enabled || state.gameOver || state.activePlayer !== SOLO_AI.playerIndex) return;
  const watchedSignature = soloTurnSignature();
  window.clearTimeout(SOLO_AI.watchdogTimer);
  SOLO_AI.watchdogTimer = window.setTimeout(() => {
    if (SERVER_SYNC.enabled || state.gameOver || state.activePlayer !== SOLO_AI.playerIndex) return;
    if (soloTurnSignature() !== watchedSignature) return;
    state.log.unshift("Surveillance IA : Coach Max est relancé automatiquement.");
    forceSoloAITurn();
  }, 6500);
}

function showSoloAINudge() {
  if (SERVER_SYNC.enabled || state.gameOver) return;
  if (state.activePlayer !== SOLO_AI.playerIndex) return;
  if (SOLO_AI.executing) return;
  SOLO_AI.nudgeVisible = true;
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  if (SOLO_AI.enabled || state.setMatch.enabled) {
    SOLO_AI.nudgeAutoTimer = window.setTimeout(() => {
      if (state.activePlayer === SOLO_AI.playerIndex && !state.gameOver && !SOLO_AI.executing) {
        state.log.unshift("Relance automatique de Coach Max après attente.");
        forceSoloAITurn();
      }
    }, 3000);
  }
  render();
}

function forceSoloAITurn() {
  if (SERVER_SYNC.enabled || state.gameOver) return;
  if (state.activePlayer !== SOLO_AI.playerIndex) return;
  SOLO_AI.enabled = true;
  window.clearTimeout(SOLO_AI.timer);
  window.clearTimeout(SOLO_AI.nudgeTimer);
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  window.clearTimeout(SOLO_AI.watchdogTimer);
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  SOLO_AI.nudgeVisible = false;
  SOLO_AI.nudgeWatchedTurn = null;
  state.log.unshift("Relance de Coach Max.");
  runSoloAITurn();
}

function resolveSoloPendingChoice(forceClose = false) {
  const playerIndex = SOLO_AI.playerIndex;
  if (state.pendingCoachChoice?.playerIndex === playerIndex) {
    const chosenCard = [...state.deck].sort((a, b) => soloCardScore(playerIndex, b) - soloCardScore(playerIndex, a))[0];
    if (chosenCard) {
      resolveCoachChoice(chosenCard.uid);
    } else if (forceClose) {
      closeImpossibleCoachChoice(playerIndex);
    }
    return true;
  }
  if (state.pendingEffectChoice?.playerIndex === playerIndex) {
    const choices = effectChoicesFor(state.pendingEffectChoice.sourcePlayedUid, { shotsOnly: state.pendingEffectChoice.shotsOnly ?? true });
    const chosenEffect = choices.sort((a, b) => soloEffectScore(b) - soloEffectScore(a))[0];
    if (chosenEffect) {
      resolveEffectChoice(chosenEffect.playedUid);
    } else if (forceClose) {
      closeImpossibleEffectChoice(playerIndex);
    }
    return true;
  }
  if (state.pendingRemoveChoice?.playerIndex === playerIndex) {
    const target = bestRemovalTargetFor(playerIndex);
    if (target) {
      resolveRemoveChoice(target.playedUid);
    } else if (forceClose) {
      closeImpossibleRemoveChoice(playerIndex);
    }
    return true;
  }
  return false;
}

function chooseSoloAIStyle() {
  return "expert";
}

function canSoloFinishWithCoup(playerIndex) {
  return Boolean(chooseSoloBoostPlay(playerIndex) || chooseSoloNormalCoup(playerIndex));
}

function canSoloPassAndWin(playerIndex) {
  if (state.mandatoryPlacement) return false;
  if (hasPlayedThisTurn(playerIndex)) return false;
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const projectedPowers = state.players.map((candidate, index) => {
    const passBonus = index === opponentIndex ? Math.max(2, player.endurance) : 0;
    return candidate.power + passBonus + projectedEndBonuses(candidate);
  });
  const exchangeWinner = projectedPowers[playerIndex] > projectedPowers[opponentIndex]
    ? playerIndex
    : projectedPowers[playerIndex] < projectedPowers[opponentIndex]
      ? opponentIndex
      : state.server;
  if (!isProjectedSetAcceptableForAI(playerIndex, exchangeWinner, projectedPowers, "power")) return false;
  if (state.setMatch.enabled) {
    const projectedSetScore = previewSetMatchScore(exchangeWinner, getProjectedExchangeSetScore(exchangeWinner, "power", projectedPowers));
    if (isSetOver(projectedSetScore) && leadingSetPlayer(projectedSetScore) === playerIndex) return true;
  }
  if (SOLO_AI.style === "expert" && exchangeWinner === playerIndex && shouldExpertPlayForCleanerSetScore(playerIndex, projectedPowers)) {
    return false;
  }
  return exchangeWinner === playerIndex;
}

function shouldExpertPlayForCleanerSetScore(playerIndex, projectedPowersAfterPass) {
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  if (hasPlayedThisTurn(playerIndex) || state.mandatoryPlacement || opponent.endurance > 0) return false;
  const passScore = getProjectedExchangeSetScore(playerIndex, "power", projectedPowersAfterPass);
  if (passScore.loserGames === 0) return false;
  const bestCoup = chooseSoloNormalCoup(playerIndex);
  if (!bestCoup) return false;
  const stats = getCardStats(player, bestCoup, false);
  const projectedAfterCoup = state.players.map((candidate, index) => {
    const coupPower = index === playerIndex ? stats.power : 0;
    const forcedPassBonus = index === playerIndex ? Math.max(2, opponent.endurance) : 0;
    return candidate.power + coupPower + forcedPassBonus + projectedEndBonuses(candidate);
  });
  const afterScore = getProjectedExchangeSetScore(playerIndex, "power", projectedAfterCoup);
  return afterScore.loserGames < passScore.loserGames;
}

function shouldSoloPassToLimitBoostDamage(playerIndex) {
  if (state.mandatoryPlacement || hasPlayedThisTurn(playerIndex)) return false;
  if (!isVulnerableToJuBoostPressure(playerIndex) && !isExpertVulnerableToCounterPressure(playerIndex)) return false;
  if (isMatchDangerForPlayer(playerIndex) || isSetDangerForPlayer(playerIndex)) return false;
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const projectedPowers = state.players.map((candidate, index) => {
    const passBonus = index === opponentIndex ? Math.max(2, player.endurance) : 0;
    return candidate.power + passBonus + projectedEndBonuses(candidate);
  });
  const exchangeWinner = projectedPowers[playerIndex] > projectedPowers[opponentIndex]
    ? playerIndex
    : projectedPowers[playerIndex] < projectedPowers[opponentIndex]
      ? opponentIndex
      : state.server;
  if (exchangeWinner === playerIndex) return false;
  if (!isProjectedSetAcceptableForAI(playerIndex, exchangeWinner, projectedPowers, "power")) return false;
  const exchangeScore = getProjectedExchangeSetScore(exchangeWinner, "power", projectedPowers);
  return exchangeScore.loserGames > 0 || !state.setMatch.enabled;
}

function isExpertVulnerableToCounterPressure(playerIndex) {
  if (SOLO_AI.style !== "expert") return false;
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  if (player.endurance > 2 || opponent.hand.length < 2 || !state.lastCard) return false;
  const unseen = expertUnseenCards(playerIndex);
  if (!unseen.length) return false;
  const possibleBoostCards = unseen
    .filter((card) => !isRemise(card) && card.family !== "Service")
    .filter((card) => Math.max(0, card.cost - opponent.nextDiscount) <= opponent.endurance)
    .filter((card) => state.boostAvailableFor === opponentOf(playerIndex) || canFamilyBoostAfter(state.lastCard.family, card.family));
  const probability = Math.min(0.95, (possibleBoostCards.length / unseen.length) * Math.max(1, opponent.hand.length - 1));
  const hasEmergencyDefense = player.hand.some((card) => isRemise(card) && ["jokerResponse", "removeOpponentLast"].includes(card.effectType) && effectiveCost(player, card) <= player.endurance);
  return probability >= 0.5 && !hasEmergencyDefense;
}

function isProjectedSetAcceptableForAI(playerIndex, exchangeWinner, projectedPowers, winType) {
  if (!state.setMatch.enabled || state.setMatch.setOver) return true;
  const exchangeScore = getProjectedExchangeSetScore(exchangeWinner, winType, projectedPowers);
  const projectedSetScore = previewSetMatchScore(exchangeWinner, exchangeScore);
  if (!isSetOver(projectedSetScore)) return true;
  const setWinner = leadingSetPlayer(projectedSetScore);
  if (!state.setMatch.targetSets) return setWinner === playerIndex;
  const projectedSetsWon = [...state.setMatch.setsWon];
  projectedSetsWon[setWinner] += 1;
  const matchWinner = projectedSetsWon[setWinner] >= state.setMatch.targetSets ? setWinner : null;
  return matchWinner == null || matchWinner === playerIndex;
}

function getProjectedExchangeSetScore(winner, winType, projectedPowers) {
  const loser = opponentOf(winner);
  if (winType === "boost") {
    return { winnerGames: 3, loserGames: 0, winner, loser, label: "Victoire par BOOST" };
  }
  if (winType === "smash") {
    return { winnerGames: 2, loserGames: 0, winner, loser, label: "Victoire par SMASH" };
  }
  const gap = Math.abs(projectedPowers[0] - projectedPowers[1]);
  return {
    winnerGames: 2,
    loserGames: gap < 5 ? 1 : 0,
    winner,
    loser,
    label: "Victoire aux points de puissance",
  };
}

function allVisibleCardIdsForExpert(playerIndex) {
  const player = state.players[playerIndex];
  return new Set([
    ...player.hand.map((card) => card.id),
    ...state.players.flatMap((candidate) => candidate.played.map((card) => card.id)),
  ]);
}

function expertUnseenCards(playerIndex) {
  const visibleIds = allVisibleCardIdsForExpert(playerIndex);
  return CARD_LIBRARY.filter((card) => !visibleIds.has(card.id));
}

function canFamilyBoostAfter(previousFamily, cardFamily) {
  return COLOR_BOOST_RULES[cardFamily]?.includes(previousFamily);
}

function expertCounterBoostThreat(playerIndex, boostedCard, sacrifice = null) {
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  if (opponent.hand.length < 2 || opponent.endurance <= 0) {
    return { probability: 0, canDefend: true, danger: 0, possibleCounters: [] };
  }
  const unseen = expertUnseenCards(playerIndex);
  const possibleCounters = unseen
    .filter((card) => !isRemise(card) && card.family !== "Service")
    .filter((card) => canFamilyBoostAfter(boostedCard.family, card.family))
    .filter((card) => Math.max(0, card.cost - opponent.nextDiscount) <= opponent.endurance);
  const probability = unseen.length
    ? Math.min(0.95, (possibleCounters.length / unseen.length) * Math.max(1, opponent.hand.length - 1))
    : 0;
  const requiredPlacement = possibleCounters.reduce((max, card) => Math.max(max, card.boostPrecision), 0);
  const remainingHand = player.hand.filter((card) => card.uid !== boostedCard.uid && card.uid !== sacrifice?.uid);
  const remainingEndurance = player.endurance - effectiveCost(player, boostedCard);
  const canDefend = requiredPlacement === 0 || expertCanDefendBoostWithCards(playerIndex, remainingHand, remainingEndurance, requiredPlacement);
  const danger = probability * (canDefend ? 8 : 28 + requiredPlacement * 2);
  return { probability, canDefend, danger, possibleCounters };
}

function expertCanDefendBoostWithCards(playerIndex, cards, endurance, requiredPlacement) {
  if (endurance < 0) return false;
  const player = state.players[playerIndex];
  if (cards.some((card) => isRemise(card) && ["jokerResponse", "removeOpponentLast"].includes(card.effectType) && effectiveCost(player, card) <= endurance)) {
    return true;
  }
  const remises = cards.filter((card) => isRemise(card));
  const coups = cards.filter((card) => !isRemise(card) && satisfiesFamilyLimit(player, card) && satisfiesReturnServiceRestriction(card));
  if (coups.some((card) => effectiveCost(player, card) <= endurance && getCardStats(player, card, false).placement >= requiredPlacement)) {
    return true;
  }
  for (const subset of expertRemiseSubsets(remises)) {
    const remiseCost = subset.reduce((sum, card) => sum + effectiveCost(player, card), 0);
    if (remiseCost > endurance) continue;
    const remisePlacement = subset.reduce((sum, card) => sum + getCardStats(player, card, false).placement, 0);
    if (remisePlacement >= requiredPlacement) return true;
    if (coups.some((card) => remiseCost + effectiveCost(player, card) <= endurance && remisePlacement + getCardStats(player, card, false).placement >= requiredPlacement)) {
      return true;
    }
  }
  return false;
}

function expertRemiseSubsets(remises) {
  const subsets = [];
  const maxMask = 1 << remises.length;
  for (let mask = 1; mask < maxMask; mask += 1) {
    subsets.push(remises.filter((_, index) => mask & (1 << index)));
  }
  return subsets;
}

function previewSetMatchScore(winner, exchangeScore) {
  const loser = opponentOf(winner);
  const previous = [...state.setMatch.score];
  const next = [...previous];
  if (Math.max(...previous) === 6 && Math.min(...previous) === 5) {
    next[winner] = 7;
    next[loser] = Math.min(6, previous[loser] + exchangeScore.loserGames);
  } else if (state.setMatch.decisiveExchange || isDecisiveSetScore(previous)) {
    next[winner] = 7;
    next[loser] = 6;
  } else {
    next[winner] = computeWinnerSetGames(previous[winner], previous[loser], exchangeScore.winnerGames);
    next[loser] = Math.min(7, previous[loser] + exchangeScore.loserGames);
    if (next[winner] === 7 && next[loser] < 5) next[winner] = 6;
    if (next[loser] > 6 && next[winner] < 7) next[loser] = 6;
  }
  return next;
}

function projectedEndBonuses(player) {
  let total = 0;
  for (const bonus of player.endBonuses) {
    if (bonus.type === "doubleLastShot") {
      const target = [...player.played].reverse().find((card) => !card.removed && isShot(card));
      if (target) total += target.cardPowerGained ?? target.powerGained ?? 0;
    }
    if (bonus.type === "boostedBonus") {
      const count = player.played.filter((card) => card.boosted && !card.removed).length;
      total += count * bonus.value;
    }
  }
  return total;
}

function chooseSoloRemiseForPlacement(playerIndex) {
  if (!state.lastCard || state.turnIgnoresPlacement[playerIndex]) return null;
  const player = state.players[playerIndex];
  const needsStrictPlacement = state.mandatoryPlacement || state.lastCard.boosted;
  if (!needsStrictPlacement && state.turnPlacement[playerIndex] >= state.lastCard.precision) return null;
  const playableCoups = player.hand.filter((card) => !isRemise(card) && canPlayNormal(playerIndex, card));
  const bestCoupPlacement = playableCoups.reduce((best, card) => Math.max(best, totalTurnPlacement(playerIndex, card)), state.turnPlacement[playerIndex]);
  if (bestCoupPlacement >= state.lastCard.precision) return null;
  const defensePlan = chooseSoloRemiseDefensePlan(playerIndex);
  return defensePlan?.remises[0] ?? null;
}

function chooseSoloRemiseDefensePlan(playerIndex) {
  if (!state.lastCard || state.turnIgnoresPlacement[playerIndex]) return null;
  const player = state.players[playerIndex];
  const targetPlacement = state.lastCard.precision;
  const remises = player.hand.filter((card) => isRemise(card) && canPlayNormal(playerIndex, card));
  const options = [];

  for (const subset of remiseSubsets(playerIndex, remises)) {
    const remiseCost = subset.reduce((sum, card) => sum + effectiveCost(player, card), 0);
    if (remiseCost > player.endurance) continue;
    const remisePlacement = subset.reduce((sum, card) => sum + getCardStats(player, card, false).placement, state.turnPlacement[playerIndex]);
    if (remisePlacement >= targetPlacement) {
      const overPlacement = Math.max(0, remisePlacement - targetPlacement);
      options.push({
        remises: subset,
        coup: null,
        score: 42 + remisePlacement - overPlacement * 2 - remiseCost * 8,
      });
    }
    for (const coup of player.hand.filter((card) => !isRemise(card) && !subset.some((remise) => remise.uid === card.uid))) {
      if (remiseCost + effectiveCost(player, coup) > player.endurance) continue;
      if (!satisfiesFamilyLimit(player, coup) || !satisfiesReturnServiceRestriction(coup)) continue;
      const totalPlacement = remisePlacement + getCardStats(player, coup, false).placement;
      if (totalPlacement < targetPlacement) continue;
      const overPlacement = Math.max(0, totalPlacement - targetPlacement);
      options.push({
        remises: subset,
        coup,
        score: 50 + soloPlayableCoupScore(playerIndex, coup) + totalPlacement - overPlacement * 2 - remiseCost * 8,
      });
    }
  }
  options.sort((a, b) => b.score - a.score);
  return options[0] ?? null;
}

function remiseSubsets(playerIndex, remises) {
  const player = state.players[playerIndex];
  const subsets = [];
  const maxMask = 1 << remises.length;
  for (let mask = 1; mask < maxMask; mask += 1) {
    const subset = remises.filter((_, index) => mask & (1 << index));
    subset.sort((a, b) => effectiveCost(player, a) - effectiveCost(player, b) || getCardStats(player, b, false).placement - getCardStats(player, a, false).placement);
    subsets.push(subset);
  }
  return subsets;
}

function chooseSoloStrategicEffect(playerIndex) {
  if (state.turnHasEffect[playerIndex]) return null;
  const player = state.players[playerIndex];
  const effects = player.hand
    .filter((card) => isRemise(card) && canPlayNormal(playerIndex, card))
    .map((card) => ({ card, score: soloImmediateEffectValue(playerIndex, card) }))
    .filter((choice) => choice.score >= 6)
    .sort((a, b) => b.score - a.score);
  return effects[0]?.card ?? null;
}

function soloImmediateEffectValue(playerIndex, card) {
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  const lastOpponentCard = [...opponent.played].reverse().find((played) => !played.removed);
  if (card.effectType === "removeOpponentLast") {
    const target = bestRemovalTargetFor(playerIndex);
    return target ? Math.max(6, removalTargetScore(target) / 2) : 0;
  }
  if (card.effectType === "jokerResponse" && (state.mandatoryPlacementReason === "boost" || state.lastCard?.boosted)) return 14;
  if (card.effectType === "freeBoostNext" && isFreeBoostNextWindow(playerIndex) && player.hand.some((candidate) => !isRemise(candidate))) return 6;
  if (card.effectType === "doubleLastShot" && player.played.some((played) => !played.removed && isShot(played))) return 6;
  return 0;
}

function chooseSoloBoostPlay(playerIndex) {
  const player = state.players[playerIndex];
  if (shouldAvoidOptionalBoostForSet(playerIndex)) return null;
  const cards = player.hand.filter((card) => canPlayBoost(playerIndex, card));
  if (!cards.length) return null;
  const options = cards
    .map((card) => {
      const sacrifice = chooseSoloSacrifice(playerIndex, card);
      if (!sacrifice) return null;
      const boostedScore = soloBoostScore(playerIndex, card) - soloSacrificeScore(sacrifice) * 0.35;
      const normalScore = canPlayNormal(playerIndex, card) ? soloCardScore(playerIndex, card) : -Infinity;
      const passPressure = wouldOpponentBeAbleToPassAndWin(playerIndex, card, true);
      const threat = SOLO_AI.style === "expert" ? expertCounterBoostThreat(playerIndex, card, sacrifice) : { danger: 0, probability: 0, canDefend: true };
      return {
        card,
        sacrifice,
        threat,
        boostedScore: boostedScore - threat.danger,
        rawBoostedScore: boostedScore,
        normalScore,
        passPressure,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.boostedScore - a.boostedScore);
  const best = options[0];
  if (!best) return null;
  const styleBoostMargin = SOLO_AI.style === "aggressive" ? 2 : SOLO_AI.style === "cautious" ? 7 : SOLO_AI.style === "expert" ? 4 : 5;
  const expertBlocksRisk = SOLO_AI.style === "expert"
    && !state.mandatoryPlacement
    && state.boostAvailableFor !== playerIndex
    && !best.passPressure
    && !isSetDangerForPlayer(playerIndex)
    && best.threat.probability >= 0.42
    && !best.threat.canDefend;
  const shouldBoost = !expertBlocksRisk && (state.mandatoryPlacement || state.boostAvailableFor === playerIndex || isSetDangerForPlayer(playerIndex) || best.passPressure || best.boostedScore >= best.normalScore + styleBoostMargin);
  if (SOLO_AI.style === "expert" && best.threat.probability > 0.3) {
    state.log.unshift(`IA Expert : risque de contre-boost estimé ${Math.round(best.threat.probability * 100)}%${best.threat.canDefend ? ", défense possible." : ", défense fragile."}`);
  }
  return shouldBoost ? { card: best.card, sacrifice: best.sacrifice } : null;
}

function shouldAvoidOptionalBoostForSet(playerIndex) {
  if (!state.setMatch.enabled || state.mandatoryPlacement || state.boostAvailableFor === playerIndex) return false;
  const playerGames = state.setMatch.score[playerIndex];
  const opponentGames = state.setMatch.score[opponentOf(playerIndex)];
  if (isMatchComfortForPlayer(playerIndex) && playerGames >= opponentGames) return true;
  return playerGames === 5 && opponentGames <= 2;
}

function isSetDangerForPlayer(playerIndex) {
  if (!state.setMatch.enabled) return false;
  const playerGames = state.setMatch.score[playerIndex];
  const opponentGames = state.setMatch.score[opponentOf(playerIndex)];
  return opponentGames === 5 && playerGames <= 2;
}

function isMatchDangerForPlayer(playerIndex) {
  if (!state.setMatch.targetSets) return false;
  return state.setMatch.setsWon[opponentOf(playerIndex)] >= state.setMatch.targetSets - 1 && state.setMatch.setsWon[playerIndex] < state.setMatch.setsWon[opponentOf(playerIndex)];
}

function isMatchComfortForPlayer(playerIndex) {
  if (!state.setMatch.targetSets) return false;
  return state.setMatch.setsWon[playerIndex] >= state.setMatch.targetSets - 1 && state.setMatch.setsWon[playerIndex] > state.setMatch.setsWon[opponentOf(playerIndex)];
}

function isVulnerableToJuBoostPressure(playerIndex) {
  if (playerIndex !== SOLO_AI.playerIndex || state.activePlayer !== playerIndex) return false;
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  if (player.endurance > 1 || !state.lastCard || state.boostAvailableFor === playerIndex || state.mandatoryPlacement) return false;
  const canDefendFutureBoost = player.hand.some((card) => isRemise(card) && ["jokerResponse", "removeOpponentLast"].includes(card.effectType))
    || player.hand.some((card) => isRemise(card) && getCardStats(player, card, false).placement >= 2);
  const opponentCanPressure = opponent.hand.length >= 2 || opponent.power >= player.power;
  return opponentCanPressure && !canDefendFutureBoost;
}

function chooseSoloSacrifice(playerIndex, boostedCard) {
  const player = state.players[playerIndex];
  return player.hand
    .filter((candidate) => candidate.uid !== boostedCard.uid)
    .sort((a, b) => soloSacrificeScore(a) - soloSacrificeScore(b))[0] ?? null;
}

function chooseSoloNormalCoup(playerIndex) {
  const player = state.players[playerIndex];
  return player.hand
    .filter((card) => !isRemise(card) && canPlayNormal(playerIndex, card))
    .sort((a, b) => soloPlayableCoupScore(playerIndex, b) - soloPlayableCoupScore(playerIndex, a))[0] ?? null;
}

function soloPlayableCoupScore(playerIndex, card) {
  let score = soloCardScore(playerIndex, card);
  if (state.lastCard) {
    const totalPlacement = totalTurnPlacement(playerIndex, card);
    if (totalPlacement >= state.lastCard.precision) score += 12 + totalPlacement;
  }
  if (state.mandatoryPlacement && hasPlacementForPrevious(playerIndex, card)) score += 20;
  return score;
}

function chooseSoloEffectCard(playerIndex) {
  if (state.turnHasEffect[playerIndex] || state.mandatoryPlacement) return null;
  const player = state.players[playerIndex];
  const remises = player.hand.filter((card) => isRemise(card) && canPlayNormal(playerIndex, card));
  const joker = remises
    .filter((card) => card.effectType === "jokerResponse" && state.lastCard?.boosted)
    .sort((a, b) => soloCardScore(playerIndex, b) - soloCardScore(playerIndex, a))[0];
  if (joker) return joker;
  if (player.limitedFamilies?.includes("Remise") && !canSoloFinishWithCoup(playerIndex)) {
    return remises.sort((a, b) => soloEffectScore(b) - soloEffectScore(a))[0] ?? null;
  }
  if (!canSoloFinishWithCoup(playerIndex)) {
    return remises.sort((a, b) => soloEffectScore(b) - soloEffectScore(a))[0] ?? null;
  }
  return null;
}

function soloCardScore(playerIndex, card, boosted = false) {
  const player = state.players[playerIndex];
  const stats = getCardStats(player, card, boosted);
  const cost = effectiveCost(player, card);
  let score = stats.power * 4 + stats.precision * 1.2 + stats.placement * 1.5 - cost * 2;
  if (state.lastCard && !state.turnIgnoresPlacement[playerIndex]) {
    const totalPlacement = totalTurnPlacement(playerIndex, card, boosted);
    if (totalPlacement < state.lastCard.precision) score -= state.lastCard.precision - totalPlacement + 4;
  }
  if (card.star) score += 1.5;
  if (card.effectType === "gainEndurance") score += 1;
  if (card.effectType === "drawCard") score += 1.2;
  if (card.effectType === "limitOpponentFamilies") score += 1.4;
  return score;
}

function soloBoostScore(playerIndex, card) {
  const styleBonus = SOLO_AI.style === "aggressive" ? 4 : SOLO_AI.style === "cautious" ? 0 : 2;
  return soloCardScore(playerIndex, card, true) + styleBonus;
}

function wouldOpponentBeAbleToPassAndWin(playerIndex, card, boosted) {
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  const stats = getCardStats(player, card, boosted);
  const projectedPlayerPower = player.power + stats.power;
  const projectedOpponentPower = opponent.power + Math.max(2, opponent.endurance);
  if (projectedOpponentPower < projectedPlayerPower) return false;
  if (projectedOpponentPower > projectedPlayerPower) return true;
  return state.server === opponentOf(playerIndex);
}

function soloSacrificeScore(card) {
  return card.power * 3 + card.placement + card.precision - card.cost;
}

function soloEffectScore(card) {
  const effectScores = {
    recoverUndealt: 8,
    drawCard: 7,
    gainEndurance: 6,
    nextPrecisionAndPlacement: 6,
    removeOpponentLast: 6,
    jokerResponse: 5,
    nextPlacement: 4,
    nextPrecision: 4,
    nextDiscount: 4,
    limitOpponentFamilies: 4,
    discardOpponent: 3,
    boostedBonusAtEnd: 3,
    doubleLastShot: 2,
    freeBoostNext: 2,
  };
  return effectScores[card.effectType] ?? 1;
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
  const beforeContext = {
    player: playerLogInfo(player),
    opponent: playerLogInfo(state.players[opponentIndex]),
    constraints: constraintsLogInfo(),
  };
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
  if (endsTurn) {
    player.nextDiscount = 0;
    player.nextPrecisionBonus = 0;
    player.nextPlacementBonus = 0;
  }
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

  recordAction("play_card", {
    playerIndex,
    opponentIndex,
    playerName: player.name,
    card: cardLogInfo(playedCard),
    sacrifice: cardLogInfo(sacrificedCard),
    mode: boosted ? "boost" : isRemise(card) ? remiseMode : "normal",
    boosted,
    remiseMode: isRemise(card) ? remiseMode : null,
    endsTurn,
    costPaid: cost,
    powerGained: stats.power,
    cardPowerGained: rawStats.power,
    precision: stats.precision,
    placement: stats.placement,
    turnPlacement: combinedPlacement,
    placementWasInsufficient,
    before: beforeContext,
    after: {
      player: playerLogInfo(player),
      opponent: playerLogInfo(state.players[opponentIndex]),
      constraints: constraintsLogInfo(),
    },
  });

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
    const freeBoostWindow = card.effectType !== "freeBoostNext" || isFreeBoostNextWindow(playerIndex);
    applyEffect(playerIndex, playedCard);
    if (freeBoostWindow) {
      setEffectNotice("appliqué", card, card.effect);
    }
  }

  if (state.gameOver) return;

  if (state.pendingEffectChoice || state.pendingRemoveChoice) {
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
  const hasSmashThreat = card.effectType === "smashThreat" || playedCard.copiedSmashThreat;

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
  state.mandatoryPlacement = boosted || hasSmashThreat;
  state.mandatoryPlacementReason = boosted ? "boost" : hasSmashThreat ? "smash" : null;
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
  recordAction("end_turn", {
    playerIndex,
    opponentIndex,
    playerName: player.name,
    preparedPlacement,
    opensBoost,
    constraintsBefore: constraintsLogInfo(),
    player: playerLogInfo(player),
    opponent: playerLogInfo(opponent),
  });

  if (playerIndex === state.server && state.lastCard == null) {
    const drawn = drawCards(opponent, 1);
    state.log.unshift(drawn > 0 ? `${opponent.name} pioche 1 carte car le serveur termine sans Service ni Coup droit.` : `${opponent.name} devrait piocher, mais le deck est vide.`);
  }

  state.boostAvailableFor = opensBoost ? opponentIndex : null;
  state.mandatoryPlacement = false;
  state.mandatoryPlacementReason = null;
  state.mandatoryPlacementSourceUid = null;
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
      openRemoveChoice(playerIndex, card);
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
      if (isFreeBoostNextWindow(playerIndex)) {
        player.freeBoostNext = true;
        state.log.unshift(`${player.name} pourra booster son prochain coup grâce au Retour de service.`);
      } else {
        state.log.unshift(`Retour de service est joué hors fenêtre : son bonus de boost ne s'applique pas.`);
        setEffectNotice("sans effet", card, "Le bonus ne s'applique que juste après un service boosté ou un retour de service boosté.");
      }
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

function openRemoveChoice(playerIndex, sourceCard) {
  const opponentIndex = opponentOf(playerIndex);
  const targets = removableOpponentCards(opponentIndex);
  if (!targets.length) {
    state.log.unshift("Aucune carte adverse à supprimer.");
    return;
  }
  state.pendingRemoveChoice = { playerIndex, opponentIndex, sourcePlayedUid: sourceCard.playedUid };
  state.log.unshift(`${state.players[playerIndex].name} doit choisir une carte adverse à supprimer.`);
}

function removableOpponentCards(opponentIndex) {
  return state.players[opponentIndex].played.filter((card) => !card.removed);
}

function removalTargetScore(card) {
  let score = (card.cardPowerGained ?? card.powerGained ?? 0) * 3 + card.precision + card.placement;
  if (card.boosted) score += 12;
  if (state.lastCard?.playedUid === card.playedUid) score += 8;
  if (state.mandatoryPlacementSourceUid === card.playedUid) score += 10;
  if (state.boostAvailableFor != null && state.lastCard?.playedUid === card.playedUid) score += 5;
  for (const player of state.players) {
    if (player.limitedFamiliesSourceUid === card.playedUid) score += 8;
  }
  if (["smashThreat", "limitOpponentFamilies", "boostedBonusAtEnd", "doubleLastShot"].includes(card.effectType)) score += 5;
  return score;
}

function bestRemovalTargetFor(playerIndex) {
  return removableOpponentCards(opponentOf(playerIndex))
    .sort((a, b) => removalTargetScore(b) - removalTargetScore(a))[0] ?? null;
}

function resolveRemoveChoice(targetPlayedUid) {
  if (!state.pendingRemoveChoice) return;
  const { playerIndex, opponentIndex, sourcePlayedUid } = state.pendingRemoveChoice;
  if (!canUseSeat(playerIndex)) return;
  markLocalServerDirty(playerIndex);
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  const target = removableOpponentCards(opponentIndex).find((card) => card.playedUid === targetPlayedUid);
  state.pendingRemoveChoice = null;
  if (!sourceCard || !target) {
    state.log.unshift("Choix de suppression impossible.");
    render();
    return;
  }
  removeOpponentPlayed(opponentIndex, target.playedUid);
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

function closeImpossibleRemoveChoice(playerIndex) {
  if (!state.pendingRemoveChoice || state.pendingRemoveChoice.playerIndex !== playerIndex) return;
  const { sourcePlayedUid } = state.pendingRemoveChoice;
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingRemoveChoice = null;
  state.log.unshift(`${player.name} ne peut supprimer aucune carte adverse.`);
  if (!sourceCard) {
    render();
    return;
  }
  completePlayedCardResolution(
    playerIndex,
    opponentOf(playerIndex),
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex]),
    sourceCard.boosted,
    "effect",
  );
}

function removeOpponentLastPlayed(opponentIndex) {
  const opponent = state.players[opponentIndex];
  const target = [...opponent.played].reverse().find((card) => !card.removed);
  if (!target) {
    state.log.unshift("Aucune carte adverse à supprimer.");
    return;
  }
  removeOpponentPlayed(opponentIndex, target.playedUid);
}

function removeOpponentPlayed(opponentIndex, targetPlayedUid) {
  const opponent = state.players[opponentIndex];
  const target = opponent.played.find((card) => card.playedUid === targetPlayedUid && !card.removed);
  if (!target) {
    state.log.unshift("Aucune carte adverse à supprimer.");
    return;
  }
  target.removed = true;
  if (state.latestPlayedCard?.playedUid === target.playedUid) {
    state.latestPlayedCard.removed = true;
    if (state.latestPlayedCard.sacrificedCard) {
      state.latestPlayedCard.sacrificedCard.removed = true;
    }
  }
  if (target.boosted && target.sacrificedCard) {
    target.sacrificedCard.removed = true;
  }
  const removedPower = target.cardPowerGained ?? target.powerGained;
  opponent.power -= removedPower;
  clearActiveEffectsFromRemovedCard(target);
  if (target.boosted && target.sacrificedCard) {
    state.log.unshift(`La carte sacrifiée sous le BOOST (${target.sacrificedCard.name}) est aussi supprimée.`);
  }
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
    state.mandatoryPlacement = false;
    state.mandatoryPlacementReason = null;
    state.mandatoryPlacementSourceUid = null;
    state.log.unshift(`La carte précédente étant supprimée, il n'y a plus de contrainte de précision ni de fenêtre de boost.`);
  } else if (state.boostAvailableFor != null) {
    state.boostAvailableFor = null;
    state.log.unshift(`La fenêtre de boost est refermée après la suppression de ${card.name}.`);
  }
}

function effectChoicesFor(sourcePlayedUid, options = {}) {
  const { shotsOnly = true } = options;
  return state.players
    .flatMap((player) => player.played)
    .filter((card) => !card.removed
      && (!shotsOnly || isShot(card))
      && card.playedUid !== sourcePlayedUid
      && card.effectType
      && card.effectType !== "choosePlayedEffect");
}

function openEffectChoice(playerIndex, sourceCard) {
  const choices = effectChoicesFor(sourceCard.playedUid, { shotsOnly: true });
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
  const { playerIndex, sourcePlayedUid, shotsOnly = true } = state.pendingEffectChoice;
  if (!canUseSeat(playerIndex)) return;
  markLocalServerDirty(playerIndex);
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  const chosen = effectChoicesFor(sourcePlayedUid, { shotsOnly }).find((card) => card.playedUid === chosenPlayedUid);
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
  if (chosen.effectType === "smashThreat") {
    sourceCard.copiedSmashThreat = true;
    if (state.latestPlayedCard?.playedUid === sourceCard.playedUid) {
      state.latestPlayedCard.copiedSmashThreat = true;
    }
  }
  applyEffect(playerIndex, effectCard);
  setEffectNotice("appliqué", chosen, `Effet choisi via ${sourceCard.name}: ${chosen.effect}`);
  if (state.pendingEffectChoice || state.pendingRemoveChoice || state.pendingCoachChoice) {
    render();
    return;
  }
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

function closeImpossibleEffectChoice(playerIndex) {
  if (!state.pendingEffectChoice || state.pendingEffectChoice.playerIndex !== playerIndex) return;
  const { sourcePlayedUid } = state.pendingEffectChoice;
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingEffectChoice = null;
  state.log.unshift(`${player.name} ne peut choisir aucun effet valide.`);
  if (!sourceCard) {
    render();
    return;
  }
  completePlayedCardResolution(
    playerIndex,
    opponentOf(playerIndex),
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
  if (player.characterSide === 1 && !player.roseEnduranceAwarded) {
    player.roseEnduranceAwarded = true;
    player.endurance += 1;
    state.log.unshift(`${player.name} retourne sa carte personnage pour la première fois : +1 endurance.`);
  }
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
    const value = effect.value ?? 2;
    player.power += value;
    playedCard.effectPowerGained += value;
    state.log.unshift(`${character.name} (${effect.side}) : +${value} puissance.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "gainPowerAndDraw") {
    const value = effect.value ?? 1;
    const drawCount = effect.draw ?? 1;
    player.power += value;
    playedCard.effectPowerGained += value;
    const drawn = drawCards(player, drawCount);
    const drawMessage = drawn > 0 ? `pioche ${drawn} carte.` : "ne pioche aucune carte, le deck est vide.";
    state.log.unshift(`${character.name} (${effect.side}) : +${value} puissance et ${drawMessage}`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}. +${value} puissance et ${drawMessage}`);
    return false;
  }

  if (effect.type === "gainPowerAndChooseAnyPlayedEffect") {
    const value = effect.value ?? 1;
    player.power += value;
    playedCard.effectPowerGained += value;
    const choices = effectChoicesFor(playedCard.playedUid, { shotsOnly: false });
    if (choices.length === 0) {
      state.log.unshift(`${character.name} (${effect.side}) : +${value} puissance. Aucun effet engagé à dupliquer.`);
      setEffectNotice("coach", { name: character.name }, `${effect.label}. Aucun effet engagé ne peut être dupliqué.`);
      return false;
    }
    state.pendingEffectChoice = { playerIndex, sourcePlayedUid: playedCard.playedUid, shotsOnly: false };
    state.log.unshift(`${character.name} (${effect.side}) : +${value} puissance, puis ${player.name} choisit un effet engagé à dupliquer.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return true;
  }

  if (effect.type === "nextDiscount") {
    const value = effect.value ?? 1;
    player.nextDiscount += value;
    state.log.unshift(`${character.name} (${effect.side}) : le prochain coup de ${player.name} coûte ${value} endurance en moins.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "recoverEnduranceByShots") {
    const visibleShots = player.played.filter((card) => !card.removed && isShot(card)).length;
    player.endurance += visibleShots;
    state.log.unshift(`${character.name} (${effect.side}) : récupère ${visibleShots} endurance.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}. ${visibleShots} coup(s) visible(s).`);
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
  if (!canUseSeat(playerIndex)) return;
  markLocalServerDirty(playerIndex);
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

function closeImpossibleCoachChoice(playerIndex) {
  if (!state.pendingCoachChoice || state.pendingCoachChoice.playerIndex !== playerIndex) return;
  const { sourcePlayedUid } = state.pendingCoachChoice;
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingCoachChoice = null;
  state.log.unshift(`${player.name} ne peut récupérer aucune carte non distribuée.`);
  if (!sourceCard) {
    render();
    return;
  }
  completePlayedCardResolution(
    playerIndex,
    opponentOf(playerIndex),
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
  if (hasPlayedThisTurn(playerIndex)) {
    if (canEndTurn(playerIndex)) {
      endTurn(playerIndex);
    } else {
      state.log.unshift(`${playerName(playerIndex)} a déjà joué une carte ce tour-ci : il ne peut pas passer.`);
      render();
    }
    return;
  }
  markLocalServerDirty(playerIndex);
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  recordAction("pass", {
    playerIndex,
    opponentIndex,
    playerName: player.name,
    opponentName: opponent.name,
    mandatoryPlacement: state.mandatoryPlacement,
    mandatoryPlacementReason: state.mandatoryPlacementReason,
    penaltyPowerGiven: state.mandatoryPlacement ? 0 : Math.max(2, player.endurance),
    constraintsBefore: constraintsLogInfo(),
    player: playerLogInfo(player),
    opponent: playerLogInfo(opponent),
  });
  if (state.mandatoryPlacement) {
    player.passed = true;
    const reasonLabel = state.mandatoryPlacementReason === "smash" ? "un Smash" : "un BOOST";
    state.log.unshift(`${player.name} passe sur ${reasonLabel} : ${opponent.name} gagne automatiquement.`);
    finishGame({
      forcedWinner: opponentIndex,
      ignoreScore: true,
      winType: state.mandatoryPlacementReason === "boost" ? "boost" : "smash",
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

function finishGame({ forcedWinner = null, ignoreScore = false, winType = "power", reason }) {
  if (!ignoreScore) applyEndBonuses();
  state.gameOver = true;
  const winner = forcedWinner ?? getWinner();
  const p1 = state.players[0];
  const p2 = state.players[1];
  const setScore = getExchangeSetScore(winner, winType);
  state.log.unshift(reason);
  state.resultInfo = {
    winner,
    ignoreScore,
    winType,
    reason,
    scoreText: ignoreScore ? "Victoire automatique : les points ne sont pas comptés." : `Score final : ${p1.name} ${p1.power} - ${p2.power} ${p2.name}${p1.power === p2.power ? `. Égalité : le serveur (${playerName(state.server)}) gagne.` : "."}`,
    setScore,
  };
  if (state.setMatch.enabled) {
    applySetMatchScore(winner, setScore);
  }
  recordAction("exchange_end", {
    winner,
    winnerName: playerName(winner),
    winType,
    ignoreScore,
    reason,
    finalPower: state.players.map((player) => player.power),
    finalEndurance: state.players.map((player) => player.endurance),
    exchangeSetScore: setScore,
    setMatch: state.setMatch.enabled ? {
      score: [...state.setMatch.score],
      completedScores: state.setMatch.completedScores.map((score) => [...score]),
      setOver: state.setMatch.setOver,
      winner: state.setMatch.winner,
    } : null,
    players: state.players.map(playerLogInfo),
  });
  storeMatchLog(winner, reason);
  render();
}

function getExchangeSetScore(winner, winType) {
  const loser = opponentOf(winner);
  if (winType === "boost") {
    return { winnerGames: 3, loserGames: 0, winner, loser, label: "Victoire par BOOST" };
  }
  if (winType === "smash") {
    return { winnerGames: 2, loserGames: 0, winner, loser, label: "Victoire par SMASH" };
  }
  const gap = Math.abs(state.players[0].power - state.players[1].power);
  return {
    winnerGames: 2,
    loserGames: gap < 5 ? 1 : 0,
    winner,
    loser,
    label: "Victoire aux points de puissance",
  };
}

function isDecisiveSetScore(score = state.setMatch.score) {
  const [p1, p2] = score;
  return (p1 === 5 && p2 === 5) || (p1 === 6 && p2 === 6) || (p1 === 6 && p2 === 5) || (p1 === 5 && p2 === 6);
}

function applySetMatchScore(winner, exchangeScore) {
  const loser = opponentOf(winner);
  const previous = [...state.setMatch.score];
  const next = [...previous];

  if (Math.max(...previous) === 6 && Math.min(...previous) === 5) {
    next[winner] = 7;
    next[loser] = Math.min(6, previous[loser] + exchangeScore.loserGames);
  } else if (state.setMatch.decisiveExchange || isDecisiveSetScore(previous)) {
    next[winner] = 7;
    next[loser] = 6;
  } else {
    next[winner] = computeWinnerSetGames(previous[winner], previous[loser], exchangeScore.winnerGames);
    next[loser] = Math.min(7, previous[loser] + exchangeScore.loserGames);
    if (next[winner] === 7 && next[loser] < 5) next[winner] = 6;
    if (next[loser] > 6 && next[winner] < 7) next[loser] = 6;
  }

  state.setMatch.score = next;
  state.setMatch.setOver = isSetOver(next);
  state.setMatch.winner = state.setMatch.setOver ? leadingSetPlayer(next) : null;
  if (state.setMatch.setOver) {
    state.setMatch.completedScores.push([...next]);
    state.setMatch.setsWon[state.setMatch.winner] += 1;
    state.setMatch.matchOver = Boolean(state.setMatch.targetSets && state.setMatch.setsWon[state.setMatch.winner] >= state.setMatch.targetSets);
    state.setMatch.matchWinner = state.setMatch.matchOver ? state.setMatch.winner : null;
  }
  state.resultInfo.setMatch = {
    previousScore: previous,
    score: [...next],
    completedScores: state.setMatch.completedScores.map((score) => [...score]),
    setOver: state.setMatch.setOver,
    winner: state.setMatch.winner,
    decisiveExchange: state.setMatch.decisiveExchange,
    targetSets: state.setMatch.targetSets,
    setsWon: [...state.setMatch.setsWon],
    matchOver: state.setMatch.matchOver,
    matchWinner: state.setMatch.matchWinner,
  };
  state.log.unshift(`Score du set : ${state.players[0].name} ${next[0]} / ${next[1]} ${state.players[1].name}.`);
  if (state.setMatch.setOver) {
    state.log.unshift(`Score du match : ${state.players[0].name} ${state.setMatch.setsWon[0]} / ${state.setMatch.setsWon[1]} ${state.players[1].name}.`);
  }
  if (state.setMatch.matchOver) {
    state.log.unshift(`${state.players[state.setMatch.matchWinner].name} gagne le match.`);
  }
}

function computeWinnerSetGames(currentWinnerGames, currentLoserGames, gainedGames) {
  let target = currentWinnerGames + gainedGames;
  if (target <= 6) return target;
  if (gainedGames === 3) {
    if (currentWinnerGames === 4 && currentLoserGames === 5) return 7;
    if (currentWinnerGames === 5 && currentLoserGames >= 5) return 7;
    return 6;
  }
  if (currentWinnerGames === 5 && currentLoserGames >= 4) return 7;
  if (currentLoserGames >= 5) return 7;
  return 6;
}

function isSetOver(score = state.setMatch.score) {
  const leader = Math.max(score[0], score[1]);
  const gap = Math.abs(score[0] - score[1]);
  return (leader === 6 && gap >= 2) || leader === 7;
}

function leadingSetPlayer(score = state.setMatch.score) {
  if (score[0] > score[1]) return 0;
  if (score[1] > score[0]) return 1;
  return null;
}

function nextSetServer() {
  const [p1, p2] = state.setMatch.score;
  if (Math.max(p1, p2) === 6 && Math.abs(p1 - p2) === 1) {
    return p1 > p2 ? 0 : 1;
  }
  return opponentOf(state.setMatch.previousServer ?? state.server);
}

function startSetAiGame() {
  startMatchMode(null);
}

function startMatchMode(targetSets = null) {
  if (SERVER_SYNC.enabled && !SERVER_SYNC.isHost) {
    state.log.unshift("Seul l'hôte peut lancer un set ou un match en ligne.");
    render();
    return;
  }
  if (!SERVER_SYNC.enabled) {
    configureSoloOpponent();
  }
  resetSetMatch();
  state.setMatch.enabled = true;
  state.setMatch.targetSets = targetSets;
  state.setMatch.setsWon = [0, 0];
  state.setMatch.matchOver = false;
  state.setMatch.matchWinner = null;
  const server = Math.random() < 0.5 ? 0 : 1;
  newGame({ preserveSet: true, serverOverride: server });
  const styleLabel = aiStyleLabel();
  const formatLabel = targetSets ? `match en ${targetSets} sets gagnants` : "set complet";
  const opponentLabel = SERVER_SYNC.enabled ? "en ligne" : `contre Coach Max (${styleLabel})`;
  state.log.unshift(`Mode ${formatLabel} : ${opponentLabel}.`);
  markServerDirtyForHostAction();
  render();
}

function aiStyleLabel() {
  if (SOLO_AI.style === "expert") return "expert";
  if (SOLO_AI.style === "aggressive") return "agressif";
  if (SOLO_AI.style === "cautious") return "prudent";
  return "équilibré";
}

function nextSetExchange() {
  if (!state.setMatch.enabled || !state.gameOver || state.setMatch.setOver || state.setMatch.matchOver) return;
  if (SERVER_SYNC.enabled && !SERVER_SYNC.isHost) {
    state.log.unshift("Seul l'hôte peut lancer l'échange suivant en ligne.");
    render();
    return;
  }
  const server = nextSetServer();
  newGame({ preserveSet: true, serverOverride: server });
  markServerDirtyForHostAction();
}

function nextFullSet() {
  if (!state.setMatch.enabled || !state.gameOver || !state.setMatch.setOver || state.setMatch.matchOver) return;
  if (SERVER_SYNC.enabled && !SERVER_SYNC.isHost) {
    state.log.unshift("Seul l'hôte peut lancer le set suivant en ligne.");
    render();
    return;
  }
  const completedScores = state.setMatch.completedScores.map((score) => [...score]);
  const targetSets = state.setMatch.targetSets;
  const setsWon = [...state.setMatch.setsWon];
  state.setMatch = {
    enabled: true,
    score: [0, 0],
    completedScores,
    previousServer: null,
    exchangeNumber: 0,
    decisiveExchange: false,
    setOver: false,
    winner: null,
    targetSets,
    setsWon,
    matchOver: false,
    matchWinner: null,
  };
  const server = Math.random() < 0.5 ? 0 : 1;
  newGame({ preserveSet: true, serverOverride: server });
  state.log.unshift("Nouveau set lancé.");
  markServerDirtyForHostAction();
  render();
}

function storeMatchLog(winner, reason) {
  try {
    const existing = JSON.parse(localStorage.getItem(MATCH_LOG_STORAGE_KEY) || "[]");
    const entry = {
      createdAt: new Date().toISOString(),
      mode: SOLO_AI.enabled ? "solo-ai" : SERVER_SYNC.enabled ? "online" : "local",
      aiStyle: SOLO_AI.enabled ? SOLO_AI.style : null,
      server: state.server,
      winner,
      winType: state.resultInfo?.winType ?? null,
      setScore: state.resultInfo?.setScore ?? null,
      setMatch: state.setMatch.enabled ? {
        ...state.setMatch,
        score: [...state.setMatch.score],
        completedScores: state.setMatch.completedScores.map((score) => [...score]),
      } : null,
      actionLog: [...state.actionLog],
      reason,
      players: state.players.map((player) => ({
        name: player.name,
        endurance: player.endurance,
        power: player.power,
        remainingHand: player.hand.map((card) => ({ id: card.id, name: card.name, family: card.family })),
        played: player.played.map((card) => ({
          id: card.id,
          name: card.name,
          family: card.family,
          boosted: Boolean(card.boosted),
          removed: Boolean(card.removed),
          powerGained: card.cardPowerGained ?? card.powerGained ?? 0,
          effectPowerGained: card.effectPowerGained ?? 0,
          sacrificedCard: card.sacrificedCard ? { id: card.sacrificedCard.id, name: card.sacrificedCard.name, removed: Boolean(card.sacrificedCard.removed) } : null,
        })),
      })),
      log: [...state.log],
    };
    existing.unshift(entry);
    localStorage.setItem(MATCH_LOG_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch (error) {
    // Le stockage de logs est facultatif et ne doit jamais bloquer la partie.
  }
}

function getStoredMatchLogs() {
  try {
    return JSON.parse(localStorage.getItem(MATCH_LOG_STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function getStoredActionLogs() {
  return readStoredJson(ACTION_LOG_STORAGE_KEY, []);
}

function renderResultPanel() {
  if (!state.resultInfo) {
    els.resultPanel.classList.add("hidden");
    return;
  }
  const setScore = state.resultInfo.setScore;
  const setMatch = state.resultInfo.setMatch;
  els.resultPanel.innerHTML = `
    <p class="eyebrow">Fin de l'échange</p>
    <div class="winner-dialog">${state.players[state.resultInfo.winner].name} gagne l'échange</div>
    <p>${state.resultInfo.reason}</p>
    <p>${state.resultInfo.scoreText}</p>
    ${setScore ? `
      <div class="set-score-box">
        <strong>Jeux gagnés sur cet échange · ${setScore.label}</strong>
        <span>${state.players[setScore.winner].name} - ${setScore.winnerGames} jeu${setScore.winnerGames > 1 ? "x" : ""}</span>
        <span>${state.players[setScore.loser].name} - ${setScore.loserGames} jeu${setScore.loserGames > 1 ? "x" : ""}</span>
      </div>
    ` : ""}
    ${setMatch ? `
      <div class="set-score-box set-match-box">
        <strong>Score du set : ${setMatch.score[0]} / ${setMatch.score[1]}</strong>
        ${setMatch.setOver ? `<span>Set gagné par ${state.players[setMatch.winner].name}</span>` : "<span>Le set continue.</span>"}
        ${setMatch.targetSets ? `<span>Match : ${setMatch.setsWon[0]} / ${setMatch.setsWon[1]} set(s)</span>` : ""}
        ${setMatch.matchOver ? `<span>Match gagné par ${state.players[setMatch.matchWinner].name}</span>` : ""}
      </div>
    ` : ""}
  `;
  els.resultPanel.classList.remove("hidden");
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
  ensureSoloAIForSet();
  renderModeButtons();
  renderResultPanel();
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
  renderRemoveChoiceModal();
  renderWaitingRoomModal();
  scheduleServerSync();
  scheduleSoloAINudge();
  maybeRunSoloAI();
}

function ensureSoloAIForSet() {
  if (SERVER_SYNC.enabled || state.gameOver || !state.setMatch.enabled) return;
  if (!SOLO_AI.enabled) {
    SOLO_AI.enabled = true;
    SOLO_AI.thinking = false;
    SOLO_AI.executing = false;
    SOLO_AI.nudgeVisible = false;
    window.clearTimeout(SOLO_AI.timer);
    window.clearTimeout(SOLO_AI.nudgeTimer);
    window.clearTimeout(SOLO_AI.nudgeAutoTimer);
    window.clearTimeout(SOLO_AI.watchdogTimer);
    state.log.unshift("Mode Set IA : Coach Max est repris par l'IA.");
  }
}

function renderModeButtons() {
  if (els.modeInfoBadge) els.modeInfoBadge.textContent = currentModeLabel();
  if (els.revealAiButton) {
    const canReveal = SOLO_AI.enabled && state.gameOver;
    els.revealAiButton.classList.toggle("hidden", !canReveal);
    els.revealAiButton.classList.toggle("active", state.revealAiCards);
    els.revealAiButton.textContent = state.revealAiCards ? "Cartes révélées" : "Révéler les cartes";
  }
}

function currentModeLabel() {
  if (SERVER_SYNC.enabled) {
    const format = SERVER_SYNC.targetSets === 3 ? "Match 3 sets" : "Match 2 sets";
    return `Mode en ligne · ${format}`;
  }
  if (state.setMatch.enabled && state.setMatch.targetSets) return `Contre l'IA · Match ${state.setMatch.targetSets} sets · IA ${aiStyleLabel()}`;
  if (state.setMatch.enabled) return `Contre l'IA · Set · IA ${aiStyleLabel()}`;
  if (SOLO_AI.enabled) return `Contre l'IA · Échange · IA ${aiStyleLabel()}`;
  return "Mode local";
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
  const localPlayer = state.players[SERVER_SYNC.seat];
  const localLabel = localPlayer ? `${localPlayer.nickname ?? localPlayer.name} · ${localPlayer.name}` : `Siège ${SERVER_SYNC.seat + 1}`;
  panel.innerHTML = `
    <p><strong>Partie en ligne</strong> Salon ${SERVER_SYNC.roomId} · ${localLabel}</p>
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

function renderWaitingRoomModal() {
  let backdrop = document.querySelector(".waiting-room-backdrop");
  if (!SERVER_SYNC.enabled || onlineRoomReady()) {
    backdrop?.remove();
    return;
  }
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop waiting-room-backdrop";
    document.body.append(backdrop);
  }
  const missingSeat = SERVER_SYNC.players[0] ? 1 : 0;
  backdrop.innerHTML = `
    <div class="modal waiting-room-modal" role="dialog" aria-modal="true" aria-labelledby="waitingRoomTitle">
      <h2 id="waitingRoomTitle">EN ATTENTE DE JOUEUR</h2>
      <p>Salon ${SERVER_SYNC.roomId}. En attente d'un adversaire pour ${missingSeat === 0 ? "la zone gauche" : "la zone droite"}.</p>
      <div class="dialog-actions">
        <button class="primary-button" type="button" data-waiting-return-lobby>RETOUR LOBBY</button>
      </div>
    </div>
  `;
  backdrop.querySelector("[data-waiting-return-lobby]")?.addEventListener("click", confirmReturnToLobby);
}

function renderSummary(playerIndex, root) {
  const player = state.players[playerIndex];
  const leader = leadingPlayerIndex();
  const enduranceClass = player.endurance <= 2 ? " low-endurance" : "";
  const powerClass = leader === playerIndex ? " leading-power" : "";
  root.innerHTML = `
    <p class="label">${player.name}${state.server === playerIndex ? " · serveur" : ""}</p>
    <div class="summary-grid">
      <div class="metric endurance-metric${enduranceClass}"><strong>${player.endurance}</strong><span>Endurance</span></div>
      <div class="metric power-metric${powerClass}"><strong>${player.power}</strong><span>Puissance</span></div>
      <div class="metric"><strong>${player.hand.length}</strong><span>Main</span></div>
      <div class="metric"><strong>${player.played.filter((card) => !card.removed).length}</strong><span>Engagées</span></div>
    </div>
  `;
}

function leadingPlayerIndex() {
  const [p1, p2] = state.players;
  if (!p1 || !p2) return null;
  if (p1.power > p2.power) return 0;
  if (p2.power > p1.power) return 1;
  return state.server;
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
      ${card.boosted ? `<span class="boost-sacrifice-layer"><img class="boost-sacrifice-back" src="${CARD_BACK_IMAGE}" alt="Carte sacrifiée face cachée" /><span class="boost-sacrifice-label">BOOST</span></span>` : ""}
      <img src="${imageUrl}" alt="${card.name} - ${card.subtitle ?? card.family}" />
      ${card.boosted ? '<span class="played-chip">BOOST</span>' : ""}
      ${card.removed ? '<span class="played-chip removed-chip">RETIRÉE</span>' : ""}
    </div>
  `;
}

function renderChoiceCardVisual(card) {
  const imageUrl = CARD_IMAGES[card.id];
  if (!imageUrl) {
    return `<strong>${card.name}</strong><span>${card.family}</span>`;
  }
  return `
    <div class="choice-card-visual">
      <img src="${imageUrl}" alt="${card.name} - ${card.subtitle ?? card.family}" />
    </div>
    <strong>${card.name}</strong>
    <span>${card.subtitle ?? card.family}</span>
  `;
}

function renderCardBack(className = "") {
  return `
    <div class="card-visual card-back ${className}">
      <img src="${CARD_BACK_IMAGE}" alt="Carte face cachée" />
    </div>
  `;
}

function renderCharacterCard(player, playerIndex) {
  const character = characterOf(player);
  const opponent = state.players[opponentOf(playerIndex)];
  const imageUrl = CHARACTER_IMAGES[player.characterId]?.[player.characterSide] ?? CHARACTER_IMAGES[player.characterId]?.[0];
  const leader = leadingPlayerIndex();
  const leaderClass = leader === playerIndex ? " leading-power" : "";
  const enduranceClass = player.endurance <= 2 ? " low-endurance" : "";
  const crown = state.gameOver && state.resultInfo?.winner === playerIndex
    ? `<span class="winner-crown" aria-label="Vainqueur"><img src="${CROWN_IMAGE}" alt="Couronne" /></span>`
    : "";
  const aiNudge = playerIndex === SOLO_AI.playerIndex && state.activePlayer === playerIndex && !state.gameOver && !SERVER_SYNC.enabled && SOLO_AI.nudgeVisible
    ? '<button class="ai-nudge-button" type="button" data-force-ai-turn onclick="window.forceSoloAITurn?.()" onpointerdown="window.forceSoloAITurn?.()">Coach Max à jouer</button>'
    : "";
  return `
    <div class="character-zone">
      <div class="character-card">
        <img src="${imageUrl}" alt="${character.name}" />
        ${aiNudge}
      </div>
      <div class="character-stats">
        <div class="character-power-reminder${leaderClass}">
          ${crown}
          <strong>${player.power}<span class="opponent-inline">(${opponent?.power ?? 0})</span></strong>
          <span>Puissance</span>
        </div>
        <div class="character-endurance-reminder${enduranceClass}">
          <strong>${player.endurance}<span class="opponent-inline">(${opponent?.endurance ?? 0})</span></strong>
          <span>Endurance</span>
        </div>
      </div>
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

function renderDigitImage(value) {
  const imageUrl = SCORE_DIGIT_IMAGES[value];
  if (!imageUrl) return `<span class="score-digit-fallback">${value}</span>`;
  return `<img class="score-digit-image" src="${imageUrl}" alt="${value}" />`;
}

function renderCenterSetScore() {
  let games = null;
  let label = "Score de l'échange";
  let completedScores = [];
  let showCurrentScore = true;
  let matchLine = "";
  if (state.setMatch.enabled) {
    games = state.setMatch.score;
    completedScores = state.setMatch.completedScores ?? [];
    showCurrentScore = !state.setMatch.setOver;
    label = "Score du set";
    if (state.setMatch.targetSets) {
      matchLine = `<div class="center-match-score">Match ${state.setMatch.setsWon[0]} / ${state.setMatch.setsWon[1]} · ${state.setMatch.targetSets} sets gagnants</div>`;
    }
  } else if (state.gameOver && state.resultInfo?.setScore) {
    games = [0, 0];
    games[state.resultInfo.setScore.winner] = state.resultInfo.setScore.winnerGames;
    games[state.resultInfo.setScore.loser] = state.resultInfo.setScore.loserGames;
  }
  if (!games) return "";
  return `
    <div class="center-set-stack" aria-label="${label}">
      ${matchLine}
      ${completedScores.map((score) => `
        <div class="center-set-score completed-set-score">
          ${renderDigitImage(score[0])}
          <strong>/</strong>
          ${renderDigitImage(score[1])}
        </div>
      `).join("")}
      ${showCurrentScore ? `<div class="center-set-score${state.setMatch.enabled ? " live-set-score" : ""}">
        ${renderDigitImage(games[0])}
        <strong>/</strong>
        ${renderDigitImage(games[1])}
      </div>` : ""}
    </div>
  `;
}

function renderCenterNextExchangeButton() {
  if (!state.setMatch.enabled || !state.gameOver || state.setMatch.setOver || state.setMatch.matchOver) return "";
  return '<button class="primary-button next-exchange-button" type="button" data-next-set-exchange>Échange suivant</button>';
}

function renderCenterNextSoloExchangeButton() {
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || state.setMatch.enabled || !state.gameOver) return "";
  return '<button class="primary-button next-exchange-button" type="button" data-next-solo-exchange>Échange suivant</button>';
}

function renderCenterNextSetButton() {
  if (!state.setMatch.enabled || !state.gameOver || !state.setMatch.setOver || state.setMatch.matchOver) return "";
  return '<button class="primary-button next-exchange-button next-set-button" type="button" data-next-full-set>Set suivant</button>';
}

function bindCenterButtons() {
  els.centerPlayedCard.querySelector("[data-next-set-exchange]")?.addEventListener("click", nextSetExchange);
  els.centerPlayedCard.querySelector("[data-next-solo-exchange]")?.addEventListener("click", nextSoloExchange);
  els.centerPlayedCard.querySelector("[data-next-full-set]")?.addEventListener("click", nextFullSet);
}

function nextSoloExchange() {
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || state.setMatch.enabled || !state.gameOver) return;
  newGame();
  state.log.unshift(`Nouvel échange contre l'IA ${aiStyleLabel()}.`);
  render();
}

function renderCenterPlayedCard() {
  if (!state.latestPlayedCard) {
    els.centerPlayedCard.innerHTML = `
      ${renderCenterSetScore()}
      <p class="previous-title">Dernière carte jouée</p>
      <div class="previous-empty">Aucune carte jouée</div>
      ${renderCenterNextSoloExchangeButton()}
      ${renderCenterNextExchangeButton()}
      ${renderCenterNextSetButton()}
    `;
    bindCenterButtons();
    return;
  }
  els.centerPlayedCard.innerHTML = `
    ${renderCenterSetScore()}
    <p class="previous-title">Dernière carte jouée</p>
    <div class="center-card-wrap ${state.latestPlayedCard.boosted ? "boosted-center-wrap" : ""}">
      ${renderCardVisualOnly(state.latestPlayedCard, "center-played")}
    </div>
    ${renderCenterNextSoloExchangeButton()}
    ${renderCenterNextExchangeButton()}
    ${renderCenterNextSetButton()}
  `;
  bindCenterButtons();
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
        <h2 class="${state.activePlayer === playerIndex && !state.gameOver ? "turn-name" : ""}">${player.name}</h2>
        <div class="player-nickname">${player.nickname ?? player.name}</div>
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
    ${renderCharacterCard(player, playerIndex)}
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
  const isHidden = SERVER_SYNC.enabled
    ? playerIndex !== SERVER_SYNC.seat
    : SOLO_AI.enabled
      ? playerIndex === SOLO_AI.playerIndex && !(state.gameOver && state.revealAiCards)
      : playerIndex !== state.activePlayer && !state.gameOver;
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
            ${renderChoiceCardVisual(choice)}
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
  const { playerIndex, sourcePlayedUid, shotsOnly = true } = state.pendingEffectChoice;
  if (SERVER_SYNC.enabled && playerIndex !== SERVER_SYNC.seat) return;
  if (SOLO_AI.enabled && playerIndex === SOLO_AI.playerIndex) return;
  const choices = effectChoicesFor(sourcePlayedUid, { shotsOnly });
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop effect-choice-backdrop";
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir un effet">
      <h2>Choisir un effet</h2>
      <p>Sélectionne l'effet d'une carte déjà jouée dans cet échange.</p>
      <button class="small-button" type="button" data-cancel-choice>Annuler et revenir au début du tour</button>
      <div class="choice-grid">
        ${choices.map((choice) => `
          <button class="choice-card" type="button" data-effect-choice="${choice.playedUid}">
            ${renderChoiceCardVisual(choice)}
          </button>
        `).join("")}
      </div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelector("[data-cancel-choice]")?.addEventListener("click", restoreTurnSnapshot);
  backdrop.querySelectorAll("[data-effect-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveEffectChoice(button.dataset.effectChoice));
  });
}

function renderCoachChoiceModal() {
  document.querySelector(".coach-choice-backdrop")?.remove();
  if (!state.pendingCoachChoice) return;
  const { playerIndex } = state.pendingCoachChoice;
  if (SERVER_SYNC.enabled && playerIndex !== SERVER_SYNC.seat) return;
  if (SOLO_AI.enabled && playerIndex === SOLO_AI.playerIndex) return;
  const player = state.players[playerIndex];
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop coach-choice-backdrop";
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir une carte non distribuée">
      <h2>${characterOf(player).name}</h2>
      <p>Choisis une carte non distribuée à ajouter à la main de ${player.name}.</p>
      <button class="small-button" type="button" data-cancel-choice>Annuler et revenir au début du tour</button>
      <div class="choice-grid">
        ${state.deck.map((choice) => `
          <button class="choice-card" type="button" data-coach-choice="${choice.uid}">
            ${renderChoiceCardVisual(choice)}
          </button>
        `).join("")}
      </div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelector("[data-cancel-choice]")?.addEventListener("click", restoreTurnSnapshot);
  backdrop.querySelectorAll("[data-coach-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveCoachChoice(button.dataset.coachChoice));
  });
}

function renderRemoveChoiceModal() {
  document.querySelector(".remove-choice-backdrop")?.remove();
  if (!state.pendingRemoveChoice) return;
  const { playerIndex, opponentIndex } = state.pendingRemoveChoice;
  if (SERVER_SYNC.enabled && playerIndex !== SERVER_SYNC.seat) return;
  if (SOLO_AI.enabled && playerIndex === SOLO_AI.playerIndex) return;
  const choices = removableOpponentCards(opponentIndex);
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop remove-choice-backdrop";
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir une carte adverse à supprimer">
      <h2>Supprimer une carte adverse</h2>
      <p>Choisis une carte engagée par ${state.players[opponentIndex].name} à retirer de l'échange.</p>
      <button class="small-button" type="button" data-cancel-choice>Annuler et revenir au début du tour</button>
      <div class="choice-grid">
        ${choices.map((choice) => `
          <button class="choice-card" type="button" data-remove-choice="${choice.playedUid}">
            ${renderChoiceCardVisual(choice)}
          </button>
        `).join("")}
      </div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelector("[data-cancel-choice]")?.addEventListener("click", restoreTurnSnapshot);
  backdrop.querySelectorAll("[data-remove-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveRemoveChoice(button.dataset.removeChoice));
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
    SERVER_SYNC.status = data.status ?? SERVER_SYNC.status;
    SERVER_SYNC.hostSeat = data.hostSeat ?? SERVER_SYNC.hostSeat;
    SERVER_SYNC.isHost = data.isHost ?? SERVER_SYNC.isHost;
    absorbServerLogs(data.logs);
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
    if (response.status === 404) {
      handleRemoteRoomClosed();
      return;
    }
    if (!response.ok) throw new Error("poll failed");
    const data = await response.json();
    SERVER_SYNC.inviteUrl = data.inviteUrl ?? SERVER_SYNC.inviteUrl;
    SERVER_SYNC.targetSets = data.targetSets ?? SERVER_SYNC.targetSets;
    SERVER_SYNC.status = data.status ?? SERVER_SYNC.status;
    SERVER_SYNC.hostSeat = data.hostSeat ?? SERVER_SYNC.hostSeat;
    SERVER_SYNC.isHost = data.isHost ?? SERVER_SYNC.isHost;
    absorbServerLogs(data.logs);
    const playersChanged = applyOnlinePlayersFromRoom(data.players ?? SERVER_SYNC.players);
    if (data.state && data.revision !== SERVER_SYNC.revision) {
      SERVER_SYNC.revision = data.revision;
      SERVER_SYNC.ready = true;
      SERVER_SYNC.lastSent = JSON.stringify(data.state);
      importSyncState(data.state);
      applyOnlinePlayersFromRoom(data.players ?? SERVER_SYNC.players);
    } else {
      renderServerSyncPanel();
    }
    if (SERVER_SYNC.isHost && playersChanged) {
      markServerDirtyForHostAction();
      render();
      scheduleServerSync();
    }
  } catch (error) {
    renderServerSyncPanel();
  }
}

function initServerSync() {
  const params = serverSyncParams();
  if (!params) return;
  SOLO_AI.enabled = false;
  resetSetMatch();
  window.clearTimeout(SOLO_AI.timer);
  window.clearTimeout(SOLO_AI.nudgeTimer);
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  window.clearTimeout(SOLO_AI.watchdogTimer);
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  SOLO_AI.nudgeVisible = false;
  SOLO_AI.nudgeWatchedTurn = null;
  SERVER_SYNC.enabled = true;
  SERVER_SYNC.roomId = params.roomId;
  SERVER_SYNC.token = params.token;
  SERVER_SYNC.seat = params.seat;
  SERVER_SYNC.isHost = params.isHost;
  SERVER_SYNC.targetSets = params.targetSets;
  SERVER_SYNC.status = null;
  SERVER_SYNC.hostSeat = params.isHost ? params.seat : null;
  SERVER_SYNC.players = [null, null];
  SERVER_SYNC.players[SERVER_SYNC.seat] = {
    nickname: nicknameValue(),
    characterId: selectedCharacterId(),
  };
  SERVER_SYNC.initializing = SERVER_SYNC.isHost;
  showGameScreen();
  if (SERVER_SYNC.isHost) {
    startMatchMode(SERVER_SYNC.targetSets ?? 2);
    pollServerState();
    SERVER_SYNC.pollTimer = window.setInterval(pollServerState, 1000);
    return;
  }
  render();
  pollServerState();
  SERVER_SYNC.pollTimer = window.setInterval(pollServerState, 1000);
}

function initMenu() {
  MENU_STATE.selectedPlayerIndex = COACH_OPTIONS[MENU_STATE.selectedPlayerIndex] ? MENU_STATE.selectedPlayerIndex : 0;
  updateMenuSelection();
  els.nicknameInput?.addEventListener("input", () => {
    MENU_STATE.nickname = els.nicknameInput.value.trim();
    localStorage.setItem("tennisLightNickname", MENU_STATE.nickname);
  });
  els.coachChoiceButtons?.forEach((button) => {
    button.addEventListener("click", () => {
      const nextIndex = Number(button.dataset.menuCoach);
      MENU_STATE.selectedPlayerIndex = COACH_OPTIONS[nextIndex] ? nextIndex : 0;
      localStorage.setItem("tennisLightSelectedPlayer", String(MENU_STATE.selectedPlayerIndex));
      updateMenuSelection();
    });
  });
  document.querySelectorAll("[data-start-solo]").forEach((button) => {
    button.addEventListener("click", () => startSoloFromMenu(button.dataset.startSolo));
  });
  els.refreshLobbyButton?.addEventListener("click", refreshLobbyRooms);
  els.createLobbyRoomButton?.addEventListener("click", createLobbyRoom);
  refreshLobbyRooms();
  window.clearInterval(MENU_STATE.lobbyTimer);
  MENU_STATE.lobbyTimer = window.setInterval(() => {
    if (!els.menuScreen?.classList.contains("hidden")) refreshLobbyRooms();
  }, 3500);
}

els.newGameButton?.addEventListener("click", newGame);
els.returnLobbyButton?.addEventListener("click", openReturnLobbyDialog);
els.revealAiButton?.addEventListener("click", toggleRevealAiCards);
els.exportLogsButton?.addEventListener("click", exportLogsFile);
document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  if (target?.closest("[data-force-ai-turn]")) {
    forceSoloAITurn();
  }
});
window.forceSoloAITurn = forceSoloAITurn;
window.tennisLightDebug = { CARD_LIBRARY, newGame, startSoloGame, startSetAiGame, startMatchMode, nextSetExchange, nextFullSet, startOnlineGame, pass, playCard, endTurn, restoreTurnSnapshot, getStoredMatchLogs, getStoredActionLogs, exportLogsFile, render, state };
newGame();
initMenu();
initServerSync();
