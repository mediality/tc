const STARTING_ENDURANCE = 7;
const HAND_SIZE = 6;
const ULTIMATE_STARTING_ENERGY = 3;
const ULTIMATE_DECK_SIZE = 48;
const GAME_VERSION = "v3.86";
const CARD_ASSET_VERSION = "170";

const ULTIMATE_MODE = {
  active: false,
  playerOrder: [0, 1],
  draftNumber: 0,
  draftPlayer: 0,
  draftPurpose: "set-start",
  draftChoices: [],
  draftSelected: new Set(),
  postExchange: null,
  aiDifficulty: "normal",
  markChoice: null,
  serviceReveal: null,
  serviceRevealTimer: null,
  turnSafetyTimer: null,
  turnRecoveryTimer: null,
  dialogResumeTimer: null,
};

function ultimatePlayerConfig(playerIndex) {
  return ULTIMATE_PLAYERS[ULTIMATE_MODE.playerOrder[playerIndex] ?? playerIndex];
}

const ULTIMATE_PLAYERS = [
  {
    id: "alessandraConti",
    name: "Alessandra Conti",
    key: "conti",
    lobby: "assets/ultimate/conti/lobby.png",
    back: "assets/ultimate/conti/back.png",
    character: "assets/ultimate/conti/character.png",
    power: "assets/ultimate/conti/power.png",
  },
  {
    id: "calvinBrentwood",
    name: "Calvin Brentwood",
    key: "brentwood",
    lobby: "assets/ultimate/brentwood/lobby.png",
    back: "assets/ultimate/brentwood/back.png",
    character: "assets/ultimate/brentwood/character.png",
    power: "assets/ultimate/brentwood/power.png",
  },
];

const ULTIMATE_CARD_RULES = {
  conti: {
    stars: [5, 6, 9, 12, 13, 17, 25, 28],
    colors: { 5: "yellow", 6: "yellow", 7: "orange", 8: "white", 9: "purple", 10: "green", 11: "yellow", 12: "orange", 13: "white", 14: "purple", 15: "green", 16: "yellow" },
    miss: [3, 4, 5, 6, 7, 11, 12, 16, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    boostColors: { 2: ["yellow", "purple"], 5: ["white"], 6: ["white"], 7: ["yellow", "white"], 8: ["yellow", "purple"], 9: ["green"], 10: ["yellow", "purple"], 11: ["white"], 12: ["yellow", "white"], 13: ["yellow", "purple"], 14: ["green"], 15: ["yellow", "purple"], 16: ["white"] },
  },
  brentwood: {
    stars: [5, 8, 16, 17, 18, 20, 33, 36],
    colors: { 5: "yellow", 6: "yellow", 7: "orange", 8: "yellow", 9: "purple", 10: "green", 11: "yellow", 12: "orange", 13: "white", 14: "purple", 15: "green", 16: "yellow", 25: "yellow", 29: "orange" },
    miss: [2, 3, 4, 5, 6, 7, 8, 11, 12, 16, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35],
    boostColors: { 2: ["white"], 5: ["white"], 6: ["white"], 7: ["yellow", "white"], 8: ["white"], 9: ["green"], 10: ["yellow", "purple"], 11: ["white"], 12: ["yellow", "white"], 13: ["yellow", "purple"], 14: ["green"], 15: ["yellow", "purple"], 16: ["white"], 25: ["white"], 26: ["green"], 29: ["yellow", "white"] },
  },
};

const ULTIMATE_EFFECT_DEFINITIONS = [
  { name: "Double", cost: 2, placement: 3, effectType: "doubleLastShot", effect: "Ã€ la fin de lâ€™Ã©change, doublez la puissance de votre derniÃ¨re carte COUP." },
  { name: "Joker", cost: 1, placement: 2, effectType: "jokerResponse", effect: "Poursuivez aprÃ¨s un BOOST adverse mÃªme sans placement suffisant." },
  { name: "RÃ©serve adverse", cost: 2, placement: 3, effectType: "ultimateDiscardReserve", effect: "DÃ©faussez toutes les cartes de la rÃ©serve adverse." },
  { name: "Vous Ãªtes menÃ©", cost: 0, placement: 1, effectType: "ultimateScoreEndurance", effect: "RÃ©cupÃ©rez 2 endurance si vous Ãªtes menÃ© dans le set, sinon 1." },
  { name: "PrÃ©cision et placement", cost: 1, placement: 2, effectType: "ultimateExchangeAccuracy", effect: "+2 prÃ©cision et +2 placement sur vos cartes jusquâ€™Ã  la fin de lâ€™Ã©change." },
  { name: "Endurance", cost: 0, placement: 1, effectType: "ultimateHandForEndurance", effect: "DÃ©faussez 2 cartes et rÃ©cupÃ©rez autant dâ€™endurance que de cartes COUP visibles." },
  { name: "RÃ©serve en main", cost: 2, placement: 3, effectType: "ultimateRecoverReserve", effect: "Piochez 2 cartes et rÃ©cupÃ©rez en main les cartes de votre rÃ©serve." },
  { name: "Choix dans la pioche", cost: 3, placement: 4, effectType: "recoverUndealt", effect: "Prenez la carte de votre choix dans la pioche puis mÃ©langez-la." },
  { name: "Suppression adverse", cost: 3, placement: 4, effectType: "removeOpponentLast", effect: "Supprimez une carte adverse engagÃ©e pendant cet Ã©change." },
  { name: "Tous les coups", cost: 2, placement: 3, effectType: "ultimateAllShotsPower", effect: "Chaque COUP visible de votre cÃ´tÃ© rapporte +1 puissance." },
  { name: "Piochez", cost: 1, placement: 2, effectType: "drawCard", effectValue: 2, effect: "Piochez 2 cartes." },
  { name: "Retour de service", cost: 1, placement: 2, effectType: "freeBoostNext", effect: "BOOST autorisÃ© aprÃ¨s un service ou un retour de service boostÃ©." },
];

function versionCardAsset(value) {
  if (typeof value === "string") {
    return value.startsWith("assets/cards/") ? `${value}?v=${CARD_ASSET_VERSION}` : value;
  }
  if (Array.isArray(value)) return value.map(versionCardAsset);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, versionCardAsset(entry)]));
  }
  return value;
}

const CARD_BACK_IMAGE = versionCardAsset("assets/cards/Demo-TC-_0000_VERSO-CARTES.webp");
const REMISE_UNDERLAY_IMAGE = "assets/fond-carte-remise.jpg?v=3.61";
const CROWN_IMAGE = "assets/crown_9418806.png";
const FORBID_IMAGE = "assets/forbid.png";
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
const MATCH_SET_IMAGES = {
  2: {
    0: "assets/2set0.png",
    1: "assets/2set1.png",
    2: "assets/2set2.png",
  },
  3: {
    0: "assets/3set0.png",
    1: "assets/3set1.png",
    2: "assets/3set2.png",
    3: "assets/3set3.png",
  },
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
  friendlyMatch: false,
};

const FRIENDLY_TOURNAMENT = {
  enabled: false,
  isSpectator: false,
  id: null,
  participantId: null,
  spectatorId: null,
  token: null,
  isCreator: false,
  entry: null,
  currentMatchId: null,
  lastReportedMatchId: null,
  readyRound: null,
  pollTimer: null,
  waitingForNextRound: false,
  inMatch: false,
  canStart: false,
  streamTimer: null,
  lastStreamPayload: "",
  lastForfeitNoticeMatchId: null,
  localMatchSeat: null,
  forfeitDialogOpen: false,
  awaitingClubHouseReturn: false,
  countdownMatchId: null,
  countdownTimer: null,
  countdownMatch: null,
  opponentDisconnectTimer: null,
  opponentDisconnectMatchId: null,
  pageExitSignaled: false,
  presenceId: null,
  resumableMatch: null,
  drawAnimating: false,
  drawVisibleCount: null,
  drawEntries: [],
};

const SPECTATOR_MODE = {
  enabled: false,
  source: null,
  matchId: null,
  matchLabel: "",
  liveScore: "",
  pollTimer: null,
  lastTournamentPayload: null,
  profileUserId: null,
  returnProfileUserId: null,
  endDialogOpen: false,
  endCountdownTimer: null,
};

// PrÃ©fÃ©rence strictement locale : une synchronisation du match ne doit jamais
// rouvrir le tableau qu'un joueur a choisi de masquer.
const TOURNAMENT_PANEL_UI = {
  visible: true,
  championshipOpenZone: 1,
};

const CHAMPIONSHIP_LOBBY_UI = {
  timer: null,
  busy: false,
  openZone: 1,
  currentPhase: 1,
};

const PROFILE_ACTIVITY = {
  timer: null,
  lastActive: false,
};

const HUMAN_MATCH_TELEMETRY = {
  active: null,
  forceNew: false,
  uploadedIds: new Set(),
};

const SOLO_AI = {
  enabled: false,
  playerIndex: 1,
  characterId: "coachMax",
  difficulty: "normal",
  style: "balanced",
  thinking: false,
  executing: false,
  timer: null,
  nudgeTimer: null,
  nudgeAutoTimer: null,
  watchdogTimer: null,
  nudgeVisible: false,
  nudgeWatchedTurn: null,
  attitude: "opportunistic",
  attitudeReason: "lecture initiale",
  attitudeRevisionAt: 0,
  attitudeRevisionWindow: 2,
  plan: null,
  planRevision: 0,
  recoveryTurnKey: null,
  recoveryCount: 0,
};

const MENU_STATE = {
  selectedPlayerIndex: Number(localStorage.getItem("tennisLightSelectedPlayer") || 0),
  nickname: localStorage.getItem("tennisLightNickname") || "",
  espoirResolvedCharacterId: null,
  lobbyTimer: null,
  lobbyNotice: "",
};

const AI_CLUB_HOUSE = {
  format: (() => {
    const storedFormat = localStorage.getItem("tennisLightAiClubFormat");
    if (["league", "championship", "onepoint", "onepointmaster"].includes(storedFormat)) return storedFormat;
    if (["classic", "tournament"].includes(storedFormat)) return "classic";
    return "match";
  })(),
  targetSets: Number(localStorage.getItem("tennisLightAiClubSets")) === 3 ? 3 : 2,
  tournamentSize: [8, 16, 32].includes(Number(localStorage.getItem("tennisLightAiClubTournamentSize")))
    ? Number(localStorage.getItem("tennisLightAiClubTournamentSize"))
    : 16,
  difficulty: localStorage.getItem("tennisLightAiClubDifficulty") || "normal",
  bonus: (() => {
    const storedBonus = localStorage.getItem("tennisLightAiClubBonus");
    const storedFormat = localStorage.getItem("tennisLightAiClubFormat");
    if (storedFormat === "onepoint" && (!storedBonus || storedBonus === "none")) return "reward";
    if (storedFormat === "onepointmaster" && (!storedBonus || storedBonus === "none")) return "reward";
    return storedBonus || "none";
  })(),
  players: localStorage.getItem("tennisLightAiClubPlayers") === "best" ? "best" : "random",
  distribution: localStorage.getItem("tennisLightAiClubDistribution") === "ranking" ? "ranking" : "random",
};

const AI_CLUB_HOUSE_SAVE_PREFIX = "tennisLightAiClubHouseSave";

const AUTH_STATE = {
  user: null,
  loading: false,
  adminUsers: [],
  adminProCodes: [],
  adminAiReport: null,
  adminPage: 1,
  adminTotalPages: 1,
  ranking: null,
  gameplayRanking: null,
  lobbyRanking: null,
  rankingPage: 1,
  rankingSort: "points",
  competitions: null,
  profile: null,
  profileUserId: null,
  gameplayRankingUserId: null,
  rankingUserId: null,
  lobbyRankingUserId: null,
  competitionsUserId: null,
};

let weeklyCountdownTimer = null;

const ROLE_LABELS = {
  free: "FREE",
  pro: "PRO",
  pro_plus: "PRO+",
  admin: "ADMIN",
};

const AI_DIFFICULTIES = ["amateur", "normal", "expert", "champion", "legend", "ranking", "circuit"];
const AI_DIFFICULTY_LABELS = {
  amateur: "AMATEUR",
  normal: "NORMAL",
  expert: "EXPERT",
  champion: "CHAMPION",
  legend: "LÃ‰GENDE",
  ranking: "SELON CLASSEMENT",
  circuit: "CIRCUIT PRO",
};
const AI_DIFFICULTY_DESCRIPTIONS = {
  amateur: "Amateur Â· adversaires peu agressifs pour dÃ©buter facilement.",
  normal: "Normal Â· dÃ©cisions variÃ©es et adversaires abordables.",
  expert: "Expert Â· adversaires concentrÃ©s qui prennent de bonnes dÃ©cisions.",
  champion: "Champion Â· adversaires forts qui analysent avec prÃ©cision les situations.",
  legend: "LÃ©gende Â· adversaires calculateurs pour des challenges trÃ¨s relevÃ©s.",
  ranking: "Selon classement Â· adversaires de niveaux variables selon leur propre classement.",
  circuit: "Circuit Pro Â· adversaires de niveau Amateur Ã  LÃ©gende, selon le classement du Circuit Pro.",
};
const HUMAN_CIRCUIT_LEVELS = [
  { level: 1, min: 0, max: 499, label: "Lucky Loser" },
  { level: 2, min: 500, max: 999, label: "Qualifier" },
  { level: 3, min: 1000, max: 2499, label: "Wild Card" },
  { level: 4, min: 2500, max: 4999, label: "Challenger" },
  { level: 5, min: 5000, max: 7999, label: "Contender" },
  { level: 6, min: 8000, max: Infinity, label: "Top player" },
];
const AI_BONUS_LEVELS = ["none", "ascendant", "domination", "nemesis", "reward"];
const AI_BONUS_LABELS = {
  none: "SANS",
  ascendant: "ASCENDANT",
  domination: "DOMINATION",
  nemesis: "BÃŠTE NOIRE",
  reward: "RÃ‰COMPENSE",
};
const AI_BONUS_COUNTS = {
  none: 0,
  ascendant: 1,
  domination: 2,
  nemesis: 3,
  reward: 0,
};
const AI_BONUS_DESCRIPTIONS = {
  none: "Sans Â· aucun bonus pour les joueurs IA.",
  ascendant: "Ascendant Â· 1 bonus alÃ©atoire pour chaque joueur IA.",
  domination: "Domination Â· 2 bonus alÃ©atoires diffÃ©rents pour chaque joueur IA.",
  nemesis: "BÃªte noire Â· 3 bonus alÃ©atoires diffÃ©rents pour chaque joueur IA.",
  reward: "RÃ©compense Â· tout le monde commence sans bonus, puis les victoires 2â€“0 et 3â€“0 offrent des bonus pour le match suivant.",
};

const EMPTY_TOURNAMENT = {
  active: false,
  visible: false,
  difficulty: "normal",
  aiClubHouse: false,
  aiIntelligenceLevels: {},
  tournamentPositions: {},
  tournamentSeedNumbers: {},
  humanCircuitLevel: null,
  bonusLevel: "none",
  weekly: false,
  league: false,
  championship: false,
  onePointMaster: false,
  competitionId: null,
  competitionName: null,
  competitionSurface: null,
  competitionSurfaceLabel: null,
  permanentBonuses: null,
  competitionPoints: null,
  matchBonusPoints: 0,
  matchBonusDetails: [],
  pointsRecorded: false,
  stage: null,
  humanCharacterId: null,
  humanNickname: null,
  aiFinalistCharacterId: null,
  currentMatch: null,
  championCharacterId: null,
  matches: [],
};

const MATCH_LOG_STORAGE_KEY = "tennisLightMatchLogsV2";
const ACTION_LOG_STORAGE_KEY = "tennisLightActionLogsV2";
const ULTIMATE_MATCH_LOG_STORAGE_KEY = "tennisLightUltimateMatchLogV526";
const ULTIMATE_MATCH_HISTORY_STORAGE_KEY = "tennisLightUltimateMatchHistoryV527";
const HUMAN_MATCH_LOG_STORAGE_KEY = "tennisLightHumanMatchLogsV2";
const ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY = "tennisLightActiveHumanMatchLogV2";
const HUMAN_MATCH_LOG_SCHEMA_VERSION = 2;

const COACH_OPTIONS = ["coachJu", "coachMax", "coachCarla", "coachClem", "coachHans"];
const PROFILE_CHARACTER_OPTIONS = [...COACH_OPTIONS];
const PRO_PROFILE_CHARACTER_OPTIONS = [...COACH_OPTIONS, "milanVerhaegen", "rosaBenavente"];
const PROFILE_CHARACTER_IMAGES = versionCardAsset({
  tennisHope: "assets/cards/Demo-TC-_0027_Coach-INCONNU.webp",
  coachJu: "assets/cards/Demo-TC-_0028_Coach-JU-LOBBY.webp",
  coachMax: "assets/cards/Demo-TC-_0029_Coach-MAX-LOBBY.webp",
  coachCarla: "assets/cards/Demo-TC-_0030_Coach-CARLA-LOBBY.webp",
  coachClem: "assets/cards/Demo-TC-_0031_Coach-CLEM-LOBBY.webp",
  coachHans: "assets/cards/TC-Coach-Hans-LOBBY.webp",
  theoBriancourt: "assets/cards/LOBBY-Briancourt.webp",
  alessandraConti: "assets/cards/LOBBY-Conti.webp",
  saharaJackson: "assets/cards/LOBBY-Jackson.webp",
  kjellBlomqvist: "assets/cards/LOBBY-Blomqvist.webp",
  kojiIwata: "assets/cards/LOBBY-Iwata.webp",
  elianaMarquez: "assets/cards/LOBBY-Marquez.webp",
  bryanGoodwin: "assets/cards/LOBBY-Goodwin.webp",
  calvinBrentwood: "assets/cards/LOBBY-Brentwood.webp",
  javierRamirez: "assets/cards/LOBBY-Ramirez.webp",
  petraEckermann: "assets/cards/LOBBY-Eckermann.webp",
  jonasFalkenried: "assets/cards/LOBBY-Jonas-Falkenried.webp",
  yunaSeo: "assets/cards/LOBBY-Yuna-Seo.webp",
  ikerSalvat: "assets/cards/LOBBY-Iker-Salvat.webp",
  loganBrooks: "assets/cards/LOBBY-Logan-Brooks.webp",
  kavyaSaran: "assets/cards/LOBBY-Kavya-Saran.webp",
  zariaCampbell: "assets/cards/LOBBY-Zaria-Campbell.webp",
  renAoshima: "assets/cards/LOBBY-Ren-Aoshima.webp",
  yasmineElMansouri: "assets/cards/LOBBY-Yasmine-El-Mansouri.webp",
  daanVermeer: "assets/cards/LOBBY-Daan-Vermeer.webp",
  lukasEberhardt: "assets/cards/LOBBY-Lukas-Eberhardt.webp",
  milanVerhaegen: "assets/cards/LOBBY-Milan-Verhaegen.webp",
  rosaBenavente: "assets/cards/TC-Rosa-Benavente-LOBBY.webp",
  johnnyKowalski: "assets/cards/TC-Johnny-Kowalski-LOBBY.webp",
  sakubaraGeki: "assets/cards/TC-Sakubara-Geki-LOBBY.webp",
  nellAshcombe: "assets/cards/nextgen-25to32-_0004_nell-ashcombe-gb-lobby.webp",
  dylanWainforde: "assets/cards/nextgen-25to32-_0009_dylan-wainforde-aus-lobby.webp",
  dynastiaAbreu: "assets/cards/nextgen-25to32-_0014_dynastia-abreu-bra-lobby.webp",
  renataSolvera: "assets/cards/nextgen-25to32-_0019_renata-solvera-mex-lobby.webp",
  viktorSerevin: "assets/cards/nextgen-25to32-_0024_viktor-serevin-rtc-lobby.webp",
  milaWierczek: "assets/cards/nextgen-25to32-_0029_mila-wierczek-pol-lobby.webp",
  kostasMikolas: "assets/cards/nextgen-25to32-_0034_kostas-mikolas-gre-lobby.webp",
  edouardSaintVenant: "assets/cards/nextgen-25to32-_0039_edouard-saint-venant-mon-lobby.webp",
});
const HISTORIC_TOURNAMENT_PLAYERS = [
  "theoBriancourt",
  "alessandraConti",
  "saharaJackson",
  "kjellBlomqvist",
  "kojiIwata",
  "elianaMarquez",
  "bryanGoodwin",
  "calvinBrentwood",
  "javierRamirez",
  "petraEckermann",
];
const NEW_TOURNAMENT_PLAYERS = [
  "jonasFalkenried",
  "yunaSeo",
  "ikerSalvat",
  "loganBrooks",
  "kavyaSaran",
  "zariaCampbell",
  "renAoshima",
  "yasmineElMansouri",
  "daanVermeer",
  "lukasEberhardt",
  "milanVerhaegen",
  "rosaBenavente",
  "johnnyKowalski",
  "sakubaraGeki",
];
const NEXT_GEN_TOURNAMENT_PLAYERS = [
  "nellAshcombe", "dylanWainforde", "dynastiaAbreu", "renataSolvera",
  "viktorSerevin", "milaWierczek", "kostasMikolas", "edouardSaintVenant",
];
const TOURNAMENT_CHARACTER_POOL = [...HISTORIC_TOURNAMENT_PLAYERS, ...NEW_TOURNAMENT_PLAYERS, ...NEXT_GEN_TOURNAMENT_PLAYERS];
const FULL_PROFILE_CHARACTER_OPTIONS = [...COACH_OPTIONS, ...HISTORIC_TOURNAMENT_PLAYERS, ...NEW_TOURNAMENT_PLAYERS, ...NEXT_GEN_TOURNAMENT_PLAYERS];
const GAME_NEWS = [
  {
    id: "v359-new-competitions",
    publishedAt: "2026-07-27",
    availableAt: "2026-07-27T00:00:00+02:00",
    title: "Deux nouveaux dÃ©fis dÃ©barquent !",
    image: "assets/news-competition.jpg",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Sprint ou marathon ? Ã€ vous de choisir !\n\nLe 1 Point Game vous propulse dans un tournoi express oÃ¹ 4 points gagnÃ©s d'affilÃ©e suffisent pour dÃ©crocher le trophÃ©eâ€¦ avec un mode RÃ©compense qui met la pression Ã  chaque victoire.\n\nEnvie d'un vrai dÃ©fi ? Le Championnat vous embarque dans une compÃ©tition longue, tactique et impitoyable oÃ¹ seuls les plus rÃ©guliers survivront.\n\nDeux formats, deux ambiancesâ€¦ mais une seule question : jusqu'oÃ¹ irez-vous ?",
  },
  {
    id: "v335-kowalski-sakubara-circuit",
    publishedAt: "2026-07-26",
    availableAt: "2026-07-26T00:00:00+02:00",
    title: "La fureur ou la folie ?",
    image: "assets/sakuwalskinews.jpg",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "ImprÃ©visibles, incontrÃ´lables et capables de pÃ©ter les plombs Ã  nâ€™importe quel moment, Sakubara Geki, la fureur rose venue du Japon, et Johnny Kowalski, le fantasque AmÃ©ricain, dÃ©barquent sur les courts avec une seule idÃ©e : chambouler la hiÃ©rarchie.\n\nColÃ¨re, rage, folie, provocationsâ€¦ Ils sont prÃªts Ã  enflammer les terrains, retourner les tribunes et faire craquer leurs adversaires. Avec eux, oubliez le calme, le fair-play et les matchs tranquilles. La folie vient officiellement dâ€™entrer sur le court.",
  },
  {
    id: "v16929-prestige-ultimate-league",
    publishedAt: "2026-07-23",
    availableAt: "2026-07-23T00:00:00+02:00",
    title: "Bienvenue dans la Prestige League et lâ€™Ultimate League",
    image: "assets/prestige-ultimate-league.jpeg",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Un nouveau format pour marquer des pointsâ€¦ et votre empreinte ! La Prestige League et lâ€™Ultimate League sâ€™ajoutent dÃ©sormais en tant que sixiÃ¨me tournoi de la semaine. Ces tournois se jouent au format League : huit joueurs sâ€™affrontent dans deux poules de quatre. Votre objectif est de terminer parmi les deux premiers de votre poule afin de poursuivre votre parcours jusquâ€™Ã  la victoire. La Prestige League se joue en deux sets gagnants et lâ€™Ultimate League en trois sets gagnants. Cette derniÃ¨re a lieu toutes les quatre semaines et rapporte davantage de points. Ces tournois sont adaptÃ©s Ã  votre niveau : vous rencontrerez des joueurs correspondant Ã  votre classement actuel. Ã€ noter cependant que, contrairement aux autres tournois, les Leagues ne sont pas rejouables dans la semaine. Bons matchs !",
  },
  {
    id: "v16921-rosa-benavente-espana",
    publishedAt: "2026-07-21",
    availableAt: "2026-07-21T18:00:00+02:00",
    title: "Que viva EspaÃ±a!",
    characterId: "rosaBenavente",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Avec la victoire de lâ€™Espagne en Coupe du monde de football, Rosa Benavente et sa tenue en hommage Ã  la Roja intÃ¨grent le Tennis Courts Pro Circuit. Vous pouvez la rencontrer dans les tournois dÃ¨s maintenant. Et comme une bonne nouvelle nâ€™arrive jamais seule, elle rejoint Ã©galement votre sÃ©lection de personnages. Tentez de devenir le GOAT avec Rosa Benaventeâ€¦ En tout cas, elle porte dÃ©jÃ  un maillot de championne !",
  },
  {
    id: "v16921-coach-hans-staff",
    publishedAt: "2026-07-22",
    availableAt: "2026-07-22T08:00:00+02:00",
    title: "Le staff sâ€™Ã©toffe",
    characterId: "coachHans",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Sâ€™il y a bien un coach qui a la cote quand on dÃ©bute, câ€™est Hansâ€¦ allez savoir pourquoi. En tout cas, lâ€™Ã©quipe de Tennis Courts en sait quelque chose. Il a revÃªtu sa plus belle tenue, aux couleurs de son pays de cÅ“ur, pour vous entraÃ®ner ou servir de victime expiatoire : Ã  vous de voir. Et si vous aimez changer les destinÃ©es, prenez le contrÃ´le de Coach Hans et affrontez le Circuit Pro avec lui. Il fait dÃ©sormais partie des personnages jouables !",
  },
  {
    id: "v166-milan-verhaegen-pro-unlock",
    publishedAt: "2026-07-19",
    title: "Milan Verhaegen rejoint les joueurs PRO",
    characterId: "milanVerhaegen",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Bravo Ã  Milan Verhaegen, meilleur joueur de la semaine derniÃ¨re. Pour fÃªter sa progression au classement, ce personnage est dÃ©sormais dÃ©bloquÃ© et jouable. Pour lâ€™utiliser, choisissez-le depuis votre page de profil. Ã€ bientÃ´t sur les courts ! â€” Coach Ju",
    signature: "Coach Ju",
  },
];
const HUMAN_TOURNAMENT_ENTRY = "__human__";
const AI_SURFACE_PREFERENCES = {
  theoBriancourt: "clay", alessandraConti: "hard", saharaJackson: "clay",
  kjellBlomqvist: "hard", kojiIwata: "grass", elianaMarquez: "grass",
  bryanGoodwin: "hard", calvinBrentwood: "grass", javierRamirez: "clay",
  petraEckermann: "hard", jonasFalkenried: "grass", yunaSeo: "grass",
  ikerSalvat: "clay", loganBrooks: "hard", kavyaSaran: "grass",
  zariaCampbell: "hard", renAoshima: "grass", yasmineElMansouri: "clay",
  daanVermeer: "hard", lukasEberhardt: "hard", milanVerhaegen: "clay",
  rosaBenavente: "clay",
  johnnyKowalski: "clay",
  sakubaraGeki: "grass",
};
const SURFACE_SPECIALISTS = Object.fromEntries(["grass", "hard", "clay"].map((surface) => [
  surface,
  Object.entries(AI_SURFACE_PREFERENCES)
    .filter(([, preference]) => preference === surface)
    .map(([characterId]) => characterId),
]));
const SURFACE_BONUSES = {
  grass: [
    { id: "grassPowerVolleySmash", label: "+2 puissance pour chaque VolÃ©e ou Smash jouÃ©" },
    { id: "grassCheapRemise", label: "Les cartes Effet/Remise coÃ»tent 1 endurance en moins" },
    { id: "grassBoostPrecisionDraw", label: "Chaque BOOST donne +1 prÃ©cision sur la carte suivante et pioche 1 carte" },
  ],
  hard: [
    { id: "hardPrecisePower", label: "+1 puissance pour chaque Coup avec prÃ©cision supÃ©rieure Ã  3" },
    { id: "hardCheapShotDraw", label: "Pioche 1 carte Ã  chaque Coup qui coÃ»te 1 endurance" },
    { id: "hardBoostPlacement", label: "Chaque BOOST donne +2 placement sur la carte suivante" },
  ],
  clay: [
    { id: "clayGroundPower", label: "+1 puissance pour chaque Coup droit ou Revers jouÃ©" },
    { id: "clayForehandEndurance", label: "+1 endurance pour chaque Coup droit jouÃ©" },
    { id: "clayBoostPower", label: "+2 puissance pour chaque BOOST jouÃ©" },
  ],
};
const SURFACE_LABELS = { grass: "HERBE", hard: "DUR", clay: "TERRE-BATTUE" };

const HISTORIC_PERMANENT_BONUSES = [
  { id: "historicPermanentPlacement", label: "+1 placement permanent", placement: 1, precision: 0 },
  { id: "historicPermanentPrecision", label: "+1 prÃ©cision permanente", placement: 0, precision: 1 },
  { id: "historicPermanentPower", label: "+1 puissance permanente", placement: 0, precision: 0, power: 1 },
];

const CHARACTERS = {
  coachUnknown: {
    name: "Coach",
    effects: [],
  },
  tennisHope: {
    name: "Espoir du Tennis",
    effects: [
      { side: "Bleu", label: "Pioche 1 carte", type: "drawCard" },
      { side: "Rose", label: "Gagne 2 endurance", type: "gainEndurance", value: 2 },
    ],
  },
  coachJu: {
    name: "Coach Ju",
    effects: [
      { side: "Bleu", label: "Pioche 1 carte", type: "drawCard" },
      { side: "Rose", label: "+1 puissance par coup dÃ©jÃ  jouÃ©", type: "coupPowerBonus" },
    ],
  },
  coachMax: {
    name: "Coach Max",
    effects: [
      { side: "Bleu", label: "RÃ©cupÃ¨re 1 carte non distribuÃ©e", type: "recoverUndealt" },
      { side: "Rose", label: "+2 puissance", type: "gainPower" },
    ],
  },
  coachCarla: {
    name: "Coach Carla",
    effects: [
      { side: "Bleu", label: "Votre prochain coup coÃ»te 1 endurance en moins", type: "nextDiscount", value: 1 },
      { side: "Rose", label: "+1 puissance et duplique un effet dÃ©jÃ  engagÃ©", type: "gainPowerAndChooseAnyPlayedEffect", value: 1 },
    ],
  },
  coachClem: {
    name: "Coach Clem",
    effects: [
      { side: "Bleu", label: "+1 puissance", type: "gainPower", value: 1 },
      { side: "Rose", label: "RÃ©cupÃ¨re autant d'endurance que de coups visibles", type: "recoverEnduranceByShots" },
    ],
  },
  coachHans: {
    name: "Coach Hans",
    effects: [
      { side: "Bleu", label: "DÃ©faussez une carte de votre main et gagnez 3 puissance", type: "discardHandForPower", value: 3 },
      { side: "Rose", label: "Tous les Coups du prochain tour adverse coÃ»tent 1 endurance de plus", type: "opponentTurnShotExtraCost", value: 1 },
    ],
  },
  theoBriancourt: {
    name: "Theo Briancourt",
    effects: [
      { side: "Bleu", label: "RÃ©cupÃ¨re 1 carte dans la dÃ©fausse", type: "recoverUndealt" },
      { side: "Rose", label: "DÃ©fausse une carte adverse engagÃ©e de votre choix", type: "removeOpponentPlayedChoice" },
    ],
  },
  alessandraConti: {
    name: "Alessandra Conti",
    effects: [
      { side: "Bleu", label: "Toutes vos cartes gagnent +2 placement jusqu'Ã  la fin de l'Ã©change", type: "exchangePlacementBonus", value: 2 },
      { side: "Rose", label: "RÃ©cupÃ¨re 2 endurance et pioche 1 carte", type: "gainEnduranceAndDraw", endurance: 2, draw: 1 },
    ],
  },
  saharaJackson: {
    name: "Sahara Jackson",
    effects: [
      { side: "Bleu", label: "+1 puissance", type: "gainPower", value: 1 },
      { side: "Rose", label: "Double votre derniÃ¨re carte Coup Ã  la fin de l'Ã©change", type: "endDoubleLastShot" },
    ],
  },
  kjellBlomqvist: {
    name: "Kjell Blomqvist",
    effects: [
      { side: "Bleu", label: "Toutes vos cartes gagnent +2 prÃ©cision jusqu'Ã  la fin de l'Ã©change", type: "exchangePrecisionBonus", value: 2 },
      { side: "Rose", label: "Pioche 2 cartes", type: "drawCard", count: 2 },
    ],
  },
  kojiIwata: {
    name: "Koji Iwata",
    effects: [
      { side: "Bleu", label: "RÃ©cupÃ¨re 1 endurance", type: "gainEndurance", value: 1 },
      { side: "Rose", label: "Pioche au hasard 1 carte dans la main adverse", type: "drawRandomOpponentHand" },
    ],
  },
  elianaMarquez: {
    name: "Eliana Marquez",
    effects: [
      { side: "Bleu", label: "Regarde la main adverse", type: "peekOpponentHand" },
      { side: "Rose", label: "Double la puissance de votre prochain coup", type: "nextPowerMultiplier", value: 2 },
    ],
  },
  bryanGoodwin: {
    name: "Bryan Goodwin",
    effects: [
      { side: "Bleu", label: "Le prochain Coup adverse rapporte 2 puissance maximum", type: "opponentNextPowerCap", value: 2 },
      { side: "Rose", label: "+2 puissance sur tous vos Coups droits jouÃ©s dans cet Ã©change", type: "exchangeFamilyPowerBonus", families: ["Coup droit"], value: 2 },
    ],
  },
  calvinBrentwood: {
    name: "Calvin Brentwood",
    effects: [
      { side: "Bleu", label: "+1 puissance sur vos Smash, VolÃ©es et Passing jusqu'Ã  la fin de l'Ã©change", type: "exchangeFamilyPowerBonus", families: ["Smash", "VolÃ©e", "Passing"], value: 1 },
      { side: "Rose", label: "Pioche 1 carte et rÃ©cupÃ¨re 1 endurance", type: "gainEnduranceAndDraw", endurance: 1, draw: 1 },
    ],
  },
  javierRamirez: {
    name: "Javier Ramirez",
    effects: [
      { side: "Bleu", label: "+1 placement jusqu'Ã  la fin de l'Ã©change", type: "exchangePlacementBonus", value: 1 },
      { side: "Rose", label: "+1 endurance et +1 puissance", type: "gainEnduranceAndPower", endurance: 1, power: 1 },
    ],
  },
  petraEckermann: {
    name: "Petra Eckermann",
    effects: [
      { side: "Bleu", label: "Annule l'effet de la prochaine carte adverse", type: "cancelNextOpponentEffect" },
      { side: "Rose", label: "Supprime une carte Coup jouÃ©e par l'adversaire", type: "removeOpponentPlayedChoice", shotsOnly: true },
    ],
  },
  jonasFalkenried: {
    name: "Jonas Falkenried",
    effects: [
      { side: "Bleu", label: "+1 placement jusqu'Ã  la fin de l'Ã©change", type: "exchangePlacementBonus", value: 1 },
      { side: "Rose", label: "+1 endurance et +1 puissance", type: "gainEnduranceAndPower", endurance: 1, power: 1 },
    ],
  },
  yunaSeo: {
    name: "Yuna Seo",
    effects: [
      { side: "Bleu", label: "+1 puissance sur vos Revers jusqu'Ã  la fin de l'Ã©change", type: "exchangeFamilyPowerBonus", families: ["Revers"], value: 1 },
      { side: "Rose", label: "+1 endurance et pioche 1 carte", type: "gainEnduranceAndDraw", endurance: 1, draw: 1 },
    ],
  },
  ikerSalvat: {
    name: "Iker Salvat",
    effects: [
      { side: "Bleu", label: "+2 placement pour chaque coup aprÃ¨s un Coup droit", type: "exchangeAfterFamilyPlacementBonus", afterFamily: "Coup droit", value: 2 },
      { side: "Rose", label: "+3 puissance, l'adversaire rÃ©cupÃ¨re 1 endurance", type: "gainPowerOpponentEndurance", power: 3, opponentEndurance: 1 },
    ],
  },
  loganBrooks: {
    name: "Logan Brooks",
    effects: [
      { side: "Bleu", label: "+1 puissance sur vos Coups droits jusqu'Ã  la fin de l'Ã©change", type: "exchangeFamilyPowerBonus", families: ["Coup droit"], value: 1 },
      { side: "Rose", label: "Pioche 2 cartes et rÃ©cupÃ¨re 1 endurance", type: "gainEnduranceAndDraw", endurance: 1, draw: 2 },
    ],
  },
  kavyaSaran: {
    name: "Kavya Saran",
    effects: [
      { side: "Bleu", label: "Annule l'effet de la prochaine carte adverse", type: "cancelNextOpponentEffect" },
      { side: "Rose", label: "+1 puissance pour chaque Coup engagÃ© de votre cÃ´tÃ©", type: "coupPowerBonus" },
    ],
  },
  zariaCampbell: {
    name: "Zaria Campbell",
    effects: [
      { side: "Bleu", label: "+2 placement par carte adverse jouÃ©e avec puissance infÃ©rieure Ã  5", type: "placementPerOpponentLowPowerCard", threshold: 5, value: 2 },
      { side: "Rose", label: "Pioche 1 carte dans la main adverse", type: "drawRandomOpponentHand" },
    ],
  },
  renAoshima: {
    name: "Ren Aoshima",
    effects: [
      { side: "Bleu", label: "Choisit 1 carte de la pioche", type: "recoverUndealt" },
      { side: "Rose", label: "+2 puissance sur vos Coups droits et Revers jusqu'Ã  la fin de l'Ã©change", type: "exchangeFamilyPowerBonus", families: ["Coup droit", "Revers"], value: 2 },
    ],
  },
  yasmineElMansouri: {
    name: "Yasmine El Mansouri",
    effects: [
      { side: "Bleu", label: "L'adversaire ne peut plus supprimer vos cartes jusqu'Ã  la fin de l'Ã©change", type: "preventOpponentRemoval" },
      { side: "Rose", label: "+1 endurance et pioche 1 carte", type: "gainEnduranceAndDraw", endurance: 1, draw: 1 },
    ],
  },
  daanVermeer: {
    name: "Daan Vermeer",
    effects: [
      { side: "Bleu", label: "+1 puissance sur vos Coups sauf Coup droit et Revers", type: "exchangeFamilyPowerBonus", excludedFamilies: ["Coup droit", "Revers"], value: 1 },
      { side: "Rose", label: "Gagne 2 endurance", type: "gainEndurance", value: 2 },
    ],
  },
  lukasEberhardt: {
    name: "Lukas Eberhardt",
    effects: [
      { side: "Bleu", label: "Le prochain coup adverse coÃ»te 1 endurance de plus", type: "opponentNextExtraCost", value: 1 },
      { side: "Rose", label: "Supprime 1 carte jouÃ©e par l'adversaire", type: "removeOpponentPlayedChoice" },
    ],
  },
  milanVerhaegen: {
    name: "Milan Verhaegen",
    effects: [
      { side: "Bleu", label: "+1 placement pour tous vos Coups jusqu'Ã  la fin de l'Ã©change", type: "exchangePlacementBonus", value: 1 },
      { side: "Rose", label: "+1 puissance et +1 endurance", type: "gainEnduranceAndPower", endurance: 1, power: 1 },
    ],
  },
  rosaBenavente: {
    name: "Rosa Benavente",
    effects: [
      { side: "Bleu", label: "+2 puissance si votre adversaire passe", type: "opponentPassPowerBonus", value: 2 },
      { side: "Rose", label: "Le placement du prochain Coup adverse repart de 0", type: "opponentNextShotBasePlacementZero" },
    ],
  },
  johnnyKowalski: {
    name: "Johnny Kowalski",
    effects: [
      { side: "Bleu", label: "Piochez 1 carte et ajoutez sa puissance imprimÃ©e Ã  votre Coup", type: "drawPrintedPowerForCurrentShot" },
      { side: "Rose", label: "Votre adversaire perd 1 endurance et vous rÃ©cupÃ©rez 1 endurance", type: "stealEndurance", value: 1 },
    ],
  },
  sakubaraGeki: {
    name: "Sakubara Geki",
    effects: [
      { side: "Bleu", label: "La puissance imprimÃ©e du Coup adverse prÃ©cÃ©dent est ramenÃ©e Ã  1", type: "reducePreviousOpponentPrintedPower", value: 1 },
      { side: "Rose", label: "RÃ©cupÃ©rez 1 endurance et gagnez 2 puissance", type: "gainEnduranceAndPower", endurance: 1, power: 2 },
    ],
  },
  nellAshcombe: {
    name: "Nell Ashcombe",
    effects: [
      { side: "Bleu", label: "Le Coup adverse prÃ©cÃ©dent est ramenÃ© Ã  2 puissance", type: "reducePreviousOpponentPrintedPower", value: 2 },
      { side: "Rose", label: "L'adversaire ne peut pas jouer de Smash, VolÃ©e ou Lob sur son prochain Coup", type: "opponentNextForbiddenFamilies", families: ["Smash", "VolÃ©e", "Lob"] },
    ],
  },
  dylanWainforde: {
    name: "Dylan Wainforde",
    effects: [
      { side: "Bleu", label: "Les Coups de puissance 4 ou 5 coÃ»tent 1 endurance en moins jusqu'Ã  la fin de l'Ã©change", type: "exchangeHighPowerDiscount", value: 1, powers: [4, 5] },
      { side: "Rose", label: "RÃ©cupÃ©rez 2 endurance", type: "gainEndurance", value: 2 },
    ],
  },
  dynastiaAbreu: {
    name: "Dynastia Abreu",
    effects: [
      { side: "Bleu", label: "RÃ©cupÃ©rez la carte de votre choix dans la pioche", type: "recoverUndealt" },
      { side: "Rose", label: "Votre prochain Coup est doublÃ© en puissance", type: "nextPowerMultiplier", value: 2 },
    ],
  },
  renataSolvera: {
    name: "Renata Solvera",
    effects: [
      { side: "Bleu", label: "Vos 3 prochains Coups gagnent 1 puissance", type: "nextShotsPowerBonus", value: 1, count: 3 },
      { side: "Rose", label: "RÃ©cupÃ©rez 1 endurance et 1 carte dÃ©jÃ  jouÃ©e de votre cÃ´tÃ©", type: "gainEnduranceAndRecoverPlayed", endurance: 1 },
    ],
  },
  viktorSerevin: {
    name: "Viktor Serevin",
    effects: [
      { side: "Bleu", label: "Le placement des Coups adverses est rÃ©duit de 2 jusqu'Ã  la fin de l'Ã©change", type: "opponentExchangePlacementPenalty", value: 2 },
      { side: "Rose", label: "Supprimez les bonus de match et provisoires adverses jusqu'Ã  la fin de l'Ã©change", type: "suppressOpponentBonuses" },
    ],
  },
  milaWierczek: {
    name: "Mila Wierczek",
    effects: [
      { side: "Bleu", label: "Vous pouvez booster votre prochain Coup avec n'importe quelle carte Coup", type: "nextBoostAnyShot" },
      { side: "Rose", label: "Tous vos Coups coÃ»tent 1 endurance en moins jusqu'Ã  la fin de l'Ã©change", type: "exchangeShotDiscount", value: 1 },
    ],
  },
  kostasMikolas: {
    name: "Kostas Mikolas",
    effects: [
      { side: "Bleu", label: "RÃ©cupÃ©rez 1 endurance aprÃ¨s un Coup de puissance 4 ou 5 jusqu'Ã  la fin de l'Ã©change", type: "exchangeHighPowerEndurance", value: 1, powers: [4, 5] },
      { side: "Rose", label: "Jouez votre prochain Coup gratuitement", type: "nextDiscount", value: 99 },
    ],
  },
  edouardSaintVenant: {
    name: "Edouard Saint-Venant",
    effects: [
      { side: "Bleu", label: "Vos Revers gagnent 1 puissance jusqu'Ã  la fin de l'Ã©change", type: "exchangeFamilyPowerBonus", families: ["Revers"], value: 1 },
      { side: "Rose", label: "RÃ©cupÃ©rez 1 endurance pour chaque Coup jouÃ© depuis le dÃ©but de l'Ã©change", type: "recoverEnduranceByShots" },
    ],
  },
};

const CHARACTER_IMAGES = versionCardAsset({
  coachUnknown: [
    "assets/cards/Demo-TC-_0027_Coach-INCONNU.webp",
    "assets/cards/Demo-TC-_0027_Coach-INCONNU.webp",
  ],
  tennisHope: [
    "assets/ESPOIRRECTO.png",
    "assets/ESPOIRVERSO.png",
  ],
  coachJu: [
    "assets/cards/Demo-TC-_0004_Coach-JU-RECTO.webp",
    "assets/cards/Demo-TC-_0003_Coach-JU-VERSO-.webp",
  ],
  coachMax: [
    "assets/cards/Demo-TC-_0002_Coach-MAX-VERSO.webp",
    "assets/cards/Demo-TC-_0001_Coach-MAX-VERSO.webp",
  ],
  coachCarla: [
    "assets/cards/Demo-TC-_0025_Coach-CARLA-RECTO.webp",
    "assets/cards/Demo-TC-_0026_Coach-CARLA-VERSO.webp",
  ],
  coachClem: [
    "assets/cards/Demo-TC-_0023_Coach-CLEM-RECTO.webp",
    "assets/cards/Demo-TC-_0024_Coach-CLEM-VERSO.webp",
  ],
  coachHans: [
    "assets/cards/TC-Coach-Hans.webp",
    "assets/cards/TC-Coach-Hans-VERSO.webp",
  ],
  theoBriancourt: [
    "assets/cards/_0023_BRIANCOURT.webp",
    "assets/cards/_0022_BRIANCOURT-VERSO.webp",
  ],
  alessandraConti: [
    "assets/cards/_0021_CONTI.webp",
    "assets/cards/_0020_CONTI-VERSO.webp",
  ],
  saharaJackson: [
    "assets/cards/_0019_JACKSON.webp",
    "assets/cards/_0018_JACKSON-VERSO.webp",
  ],
  kjellBlomqvist: [
    "assets/cards/_0017_BLOMQVIST.webp",
    "assets/cards/_0016_BLOMQVIST-VERSO.webp",
  ],
  kojiIwata: [
    "assets/cards/_0015_IWATA.webp",
    "assets/cards/_0014_IWATA-VERSO.webp",
  ],
  elianaMarquez: [
    "assets/cards/_0013_MARQUEZ.webp",
    "assets/cards/_0012_MARQUEZ-VERSO.webp",
  ],
  bryanGoodwin: [
    "assets/cards/HISTO4-Bryan-Goodwin.webp",
    "assets/cards/HISTO4-Bryan-Goodwin-VERSO.webp",
  ],
  calvinBrentwood: [
    "assets/cards/HISTO4-Calvin-Brentwood.webp",
    "assets/cards/HISTO4-Calvin-Brentwood-VERSO.webp",
  ],
  javierRamirez: [
    "assets/cards/HISTO4-Javier-Ramirez.webp",
    "assets/cards/HISTO4-Javier-Ramirez-VERSO.webp",
  ],
  petraEckermann: [
    "assets/cards/HISTO4-Petra-Eckermann.webp",
    "assets/cards/HISTO4-Petra-Eckermann-VERSO.webp",
  ],
  jonasFalkenried: [
    "assets/cards/TC-new-Jonas-Falkenried.webp",
    "assets/cards/TC-new-Jonas-Falkenried-VERSO.webp",
  ],
  yunaSeo: [
    "assets/cards/TC-new-Yuna-Seo.webp",
    "assets/cards/TC-new-Yuna-Seo-VERSO.webp",
  ],
  ikerSalvat: [
    "assets/cards/TC-new-Iker-Salvat.webp",
    "assets/cards/TC-new-Iker-Salvat-VERSO.webp",
  ],
  loganBrooks: [
    "assets/cards/TC-new-Logan-Brooks.webp",
    "assets/cards/TC-new-Logan-Brooks-VERSO.webp",
  ],
  kavyaSaran: [
    "assets/cards/TC-new-Kavya-Saran.webp",
    "assets/cards/TC-new-Kavya-Saran-VERSO.webp",
  ],
  zariaCampbell: [
    "assets/cards/TC-new-Zaria-Campbell.webp",
    "assets/cards/TC-new-Zaria-Campbell-VERSO.webp",
  ],
  renAoshima: [
    "assets/cards/TC-new-Ren-Aoshima.webp",
    "assets/cards/TC-new-Ren-Aoshima-VERSO.webp",
  ],
  yasmineElMansouri: [
    "assets/cards/TC-new-Yasmine-El-Mansouri.webp",
    "assets/cards/TC-new-Yasmine-El-Mansouri-VERSO.webp",
  ],
  daanVermeer: [
    "assets/cards/TC-new-Daan-Vermeer.webp",
    "assets/cards/TC-new-Daan-Vermeer-VERSO.webp",
  ],
  lukasEberhardt: [
    "assets/cards/TC-new-Lukas-Eberhardt.webp",
    "assets/cards/TC-new-Lukas-Eberhardt-VERSO.webp",
  ],
  milanVerhaegen: [
    "assets/cards/TC-new-Milan-Verhaegen.webp",
    "assets/cards/TC-new-Milan-Verhaegen-VERSO.webp",
  ],
  rosaBenavente: [
    "assets/cards/TC-Rosa-Benavente.webp",
    "assets/cards/TC-Rosa-Benavente-VERSO.webp",
  ],
  johnnyKowalski: [
    "assets/cards/TC-Johnny-Kowalski.webp",
    "assets/cards/TC-Johnny-Kowalski-VERSO.webp",
  ],
  sakubaraGeki: [
    "assets/cards/TC-Sakubara-Geki.webp",
    "assets/cards/TC-Sakubara-Geki-VERSO.webp",
  ],
  nellAshcombe: ["assets/cards/nextgen-25to32-_0001_nell-ashcombe-gb.webp", "assets/cards/nextgen-25to32-_0000_nell-ashcombe-gb-verso.webp"],
  dylanWainforde: ["assets/cards/nextgen-25to32-_0006_dylan-wainforde-aus.webp", "assets/cards/nextgen-25to32-_0005_dylan-wainforde-aus-verso.webp"],
  dynastiaAbreu: ["assets/cards/nextgen-25to32-_0011_dynastia-abreu-bre.webp", "assets/cards/nextgen-25to32-_0010_dynastia-abreu-bre-verso.webp"],
  renataSolvera: ["assets/cards/nextgen-25to32-_0016_renata-solvera-mex.webp", "assets/cards/nextgen-25to32-_0015_renata-solvera-mex-verso.webp"],
  viktorSerevin: ["assets/cards/nextgen-25to32-_0021_viktor-serevin-rtc.webp", "assets/cards/nextgen-25to32-_0020_viktor-serevin-rtc-verso.webp"],
  milaWierczek: ["assets/cards/nextgen-25to32-_0026_mila-wierczek-pol.webp", "assets/cards/nextgen-25to32-_0025_mila-wierczek-pol-verso.webp"],
  kostasMikolas: ["assets/cards/nextgen-25to32-_0031_kostas-mikolas-gre.webp", "assets/cards/nextgen-25to32-_0030_kostas-mikolas-gre-verso.webp"],
  edouardSaintVenant: ["assets/cards/nextgen-25to32-_0036_edouard-saint-venant-mon.webp", "assets/cards/nextgen-25to32-_0035_edouard-saint-venant-mon-verso.webp"],
});

const MATCH_RESULT_IMAGES = versionCardAsset({
  coachJu: {
    win: "assets/cards/CoachJuWin.webp",
    lose: "assets/cards/CoachJuLoose.webp",
  },
  coachMax: {
    win: "assets/cards/CoachMaxWin.webp",
    lose: "assets/cards/CoachMaxLoose.webp",
  },
  coachCarla: {
    win: "assets/cards/CoachClaraWin.webp",
    lose: "assets/cards/CoachClaraLoose.webp",
  },
  coachClem: {
    win: "assets/cards/CoachClemWin.webp",
    lose: "assets/cards/CoachClemLoose.webp",
  },
  coachHans: {
    win: "assets/cards/TC-Coach-Hans-WINS.webp",
    lose: "assets/cards/TC-Coach-Hans-LOSE.webp",
  },
  rosaBenavente: {
    win: "assets/cards/TC-Rosa-Benavente-WINS.webp",
    lose: "assets/cards/TC-Rosa-Benavente-LOSE.webp",
  },
  theoBriancourt: {
    win: "assets/cards/_0002_BRIANCOURT-WIN.webp",
    lose: "assets/cards/_0003_BRIANCOURT-LOSE.webp",
  },
  alessandraConti: {
    win: "assets/cards/_0006_CONTI-WIN.webp",
    lose: "assets/cards/_0007_CONTI-LOSE.webp",
  },
  saharaJackson: {
    win: "assets/cards/_0005_JACKSON-WIN.webp",
    lose: "assets/cards/_0004_JACKSON-LOSE.webp",
  },
  kjellBlomqvist: {
    win: "assets/cards/_0001_BLOMQVIST-WIN.webp",
    lose: "assets/cards/_0000_BLOMQVIST-LOSE.webp",
  },
  kojiIwata: {
    win: "assets/cards/_0008_IWATA-WIN.webp",
    lose: "assets/cards/_0009_IWATA-LOSE.webp",
  },
  elianaMarquez: {
    win: "assets/cards/_0011_MARQUEZ-WIN.webp",
    lose: "assets/cards/_0010_MARQUEZ-LOSE.webp",
  },
  bryanGoodwin: {
    win: "assets/cards/HISTO4-Bryan-Goodwin-WIN.webp",
    lose: "assets/cards/HISTO4-Bryan-Goodwin-LOSE.webp",
  },
  calvinBrentwood: {
    win: "assets/cards/HISTO4-Calvin-Brentwood-WIN.webp",
    lose: "assets/cards/HISTO4-Calvin-Brentwood-LOSE.webp",
  },
  javierRamirez: {
    win: "assets/cards/HISTO4-Javier-Ramirez-WIN.webp",
    lose: "assets/cards/HISTO4-Javier-Ramirez-LOSE.webp",
  },
  petraEckermann: {
    win: "assets/cards/HISTO4-Petra-Eckermann-WIN.webp",
    lose: "assets/cards/HISTO4-Petra-Eckermann-LOSE.webp",
  },
  jonasFalkenried: {
    win: "assets/cards/TC-result-Jonas-Falkenried-WIN.webp",
    lose: "assets/cards/TC-result-Jonas-Falkenried-LOSE.webp",
  },
  yunaSeo: {
    win: "assets/cards/TC-result-Yuna-Seo-WIN.webp",
    lose: "assets/cards/TC-result-Yuna-Seo-LOSE.webp",
  },
  ikerSalvat: {
    win: "assets/cards/TC-result-Iker-Salvat-WIN.webp",
    lose: "assets/cards/TC-result-Iker-Salvat-LOSE.webp",
  },
  loganBrooks: {
    win: "assets/cards/TC-result-Logan-Brooks-WIN.webp",
    lose: "assets/cards/TC-result-Logan-Brooks-LOSE.webp",
  },
  kavyaSaran: {
    win: "assets/cards/TC-result-Kavya-Saran-WIN.webp",
    lose: "assets/cards/TC-result-Kavya-Saran-LOSE.webp",
  },
  zariaCampbell: {
    win: "assets/cards/TC-result-Zaria-Campbell-WIN.webp",
    lose: "assets/cards/TC-result-Zaria-Campbell-LOSE.webp",
  },
  renAoshima: {
    win: "assets/cards/TC-result-Ren-Aoshima-WIN.webp",
    lose: "assets/cards/TC-result-Ren-Aoshima-LOSE.webp",
  },
  yasmineElMansouri: {
    win: "assets/cards/TC-result-Yasmine-El-Mansouri-WIN.webp",
    lose: "assets/cards/TC-result-Yasmine-El-Mansouri-LOSE.webp",
  },
  daanVermeer: {
    win: "assets/cards/TC-result-Daan-Vermeer-WIN.webp",
    lose: "assets/cards/TC-result-Daan-Vermeer-LOSE.webp",
  },
  lukasEberhardt: {
    win: "assets/cards/TC-result-Lukas-Eberhardt-WIN.webp",
    lose: "assets/cards/TC-result-Lukas-Eberhardt-LOSE.webp",
  },
  milanVerhaegen: {
    win: "assets/cards/TC-result-Milan-Verhaegen-WIN.webp",
    lose: "assets/cards/TC-result-Milan-Verhaegen-LOSE.webp",
  },
  johnnyKowalski: {
    win: "assets/cards/TC-Johnny-Kowalski-WINS.webp",
    lose: "assets/cards/TC-Johnny-Kowalski-LOSE.webp",
  },
  sakubaraGeki: {
    win: "assets/cards/TC-Sakubara-Geki-WINS.webp",
    lose: "assets/cards/TC-Sakubara-Geki-LOSE.webp",
  },
  nellAshcombe: { win: "assets/cards/nextgen-25to32-_0002_nell-ashcombe-gb-wins.webp", lose: "assets/cards/nextgen-25to32-_0003_nell-ashcombe-gb-lose.webp" },
  dylanWainforde: { win: "assets/cards/nextgen-25to32-_0007_dylan-wainforde-aus-wins.webp", lose: "assets/cards/nextgen-25to32-_0008_dylan-wainforde-aus-lose.webp" },
  dynastiaAbreu: { win: "assets/cards/nextgen-25to32-_0012_dynastia-abreu-bra-wins.webp", lose: "assets/cards/nextgen-25to32-_0013_dynastia-abreu-bra-lose.webp" },
  renataSolvera: { win: "assets/cards/nextgen-25to32-_0017_renata-solvera-mex-wins.webp", lose: "assets/cards/nextgen-25to32-_0018_renata-solvera-mex-lose.webp" },
  viktorSerevin: { win: "assets/cards/nextgen-25to32-_0022_viktor-serevin-rtc-wins.webp", lose: "assets/cards/nextgen-25to32-_0023_viktor-serevin-rtc-lose.webp" },
  milaWierczek: { win: "assets/cards/nextgen-25to32-_0027_mila-wierczek-pol-wins.webp", lose: "assets/cards/nextgen-25to32-_0028_mila-wierczek-pol-lose.webp" },
  kostasMikolas: { win: "assets/cards/nextgen-25to32-_0032_kostas-mikolas-gre-wins.webp", lose: "assets/cards/nextgen-25to32-_0033_kostas-mikolas-gre-lose.webp" },
  edouardSaintVenant: { win: "assets/cards/nextgen-25to32-_0037_edouard-saint-venant-mon-wins.webp", lose: "assets/cards/nextgen-25to32-_0038_edouard-saint-venant-mon-lose.webp" },
});

const CARD_IMAGES = versionCardAsset({
  double: "assets/cards/Demo-TC-_0005_DOUBLE-x2.webp",
  joker: "assets/cards/Demo-TC-_0006_JOKER-x2.webp",
  "sup-adv": "assets/cards/Demo-TC-_0007_SUP-ADV.webp",
  "amortie-2-1-4": "assets/cards/Demo-TC-_0011_030---AMORTIE-2-1-4.webp",
  "retour-service": "assets/cards/Demo-TC-_0008_RETOUR-DE-SERVICE.webp",
  "volee-2-2-3": "assets/cards/Demo-TC-_0010_031---VOLEE-2-2-3.webp",
  "volee-3-4-1": "assets/cards/Demo-TC-_0013_026---VOLEE-3-4-1.webp",
  "coup-droit-2-2-2": "assets/cards/Demo-TC-_0022_002---CP-DROIT-2-2-2.webp",
  "passing-1-1-4": "assets/cards/Demo-TC-_0009_029---PASSING-1-1-4.webp",
  "lob-2-0-4": "assets/cards/Demo-TC-_0012_027---LOB-2-0-4.webp",
  "coup-droit-4-3-5": "assets/cards/Demo-TC-_0019_010---CP-DROIT-4-3-5.webp",
  "service-coup-droit": "assets/cards/Demo-TC-_0015_020---CP-DROIT-SERV-3.webp",
  "revers-3-3-3": "assets/cards/Demo-TC-_0018_012---REVERS-3-3-3.webp",
  "coup-droit-3-3-3": "assets/cards/Demo-TC-_0020_007---CP-DROIT-3-3-3.webp",
  "revers-5-4-1": "assets/cards/Demo-TC-_0016_016---REVERS-5-4-1.webp",
  "smash-4-2-1": "assets/cards/Demo-TC-_0014_023---SMASH-4-2-1.webp",
  "revers-3-3-0": "assets/cards/Demo-TC-_0021_005---REVERS-3-3-0.webp",
  "revers-2": "assets/cards/Demo-TC-_0017_013---REVERS-2.webp",
});

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
    effect: "Ã€ la fin de l'Ã©change, double la puissance de votre derniÃ¨re carte Coup.",
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
    effect: "Permet de rÃ©pondre aprÃ¨s un coup boostÃ© mÃªme sans placement suffisant.",
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
    effect: "Supprime la derniÃ¨re carte adverse engagÃ©e dans l'Ã©change.",
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
    effect: "Bonus prÃ©cision +2 sur votre prochain coup.",
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
    name: "VolÃ©e",
    subtitle: "VolÃ©e haute",
    family: "VolÃ©e",
    cost: 2,
    power: 3,
    precision: 2,
    placement: 3,
    boostPower: 4,
    boostPrecision: 4,
    effect: "Votre prochain coup coÃ»te 1 endurance en moins.",
    effectType: "nextDiscount",
    effectValue: 1,
  },
  {
    id: "volee-3-4-1",
    name: "VolÃ©e",
    subtitle: "VolÃ©e puissante",
    family: "VolÃ©e",
    star: true,
    cost: 2,
    power: 4,
    precision: 4,
    placement: 1,
    boostPower: 5,
    boostPrecision: 4,
    effect: "Chaque carte boostÃ©e de votre cÃ´tÃ© rapporte +2 puissance Ã  la fin.",
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
    effect: "Vous pouvez booster ce coup aprÃ¨s un service non boostÃ©.",
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
    effect: "RÃ©cupÃ©rez 1 endurance.",
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
    effect: "Jouez l'effet de votre choix d'une carte dÃ©jÃ  jouÃ©e lors de cet Ã©change.",
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
    effect: "Si jouÃ©e au service, cette frappe peut Ãªtre boostÃ©e.",
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
    subtitle: "Coup droit slicÃ©",
    family: "Coup droit",
    star: true,
    cost: 2,
    power: 3,
    precision: 3,
    placement: 1,
    boostPower: 4,
    boostPrecision: 4,
    effect: "CÃ´tÃ© faible : l'adversaire est limitÃ© Ã  Revers, Lob ou Remise sur son prochain coup.",
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
    effect: "DÃ©faussez 1 carte de la main de l'adversaire.",
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
    effect: "Si l'adversaire ne rattrape pas avec le placement, il perd immÃ©diatement et ne marque pas de jeu.",
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
    effect: "Bonus prÃ©cision +2 et placement +2 sur votre prochain coup.",
    effectType: "nextPrecisionAndPlacement",
    effectValue: 2,
  },
];

const TUTORIAL_NARRATORS = {
  coachJu: {
    name: "Coach Ju",
    role: "CrÃ©ateur de Tennis Courts",
    image: "assets/Coach-Ju-Speak.png",
  },
  coachMax: {
    name: "Coach Max",
    role: "Coach de Tennis Courts",
    image: "assets/CoachMaxTRS.png",
  },
};

// Les prochains modules rÃ©utilisent cette structure : scÃ©nario, Ã©tapes, ciblages,
// validations, erreurs et dÃ©clenchements automatiques restent entiÃ¨rement dÃ©claratifs.
const TUTORIAL_MODULES = {
  basics: {
    id: "module-1-basics",
    lesson: "AcadÃ©mie Â· Module 1",
    title: "DÃ©couverte de Tennis Courts Academy",
    narrator: "coachJu",
    scenario: "interface",
    readOnly: true,
    initialLog: ["Le journal d'Ã©change affichera ici toutes les actions du point."],
    totalDisplaySteps: 19,
    steps: [
      {
        id: "m1-1-welcome",
        displayStep: 1,
        title: "Bienvenue",
        text: "Bienvenue dans Tennis Courts Academy ! Je suis Coach Ju et je serai ton entraÃ®neur.",
      },
      {
        id: "m1-2-shared-deck",
        displayStep: 2,
        title: "Le deck de l'AcadÃ©mie",
        text: "Pour apprendre simplement, les deux joueurs partagent ici un deck unique de 18 cartes.",
        focus: [{ target: "hand", playerIndex: 0 }],
      },
      {
        id: "m1-3-full-game",
        displayStep: 3,
        title: "Le jeu complet",
        text: "Dans le jeu complet, chaque joueur possÃ¨de son propre deck de 48 cartes et son personnage.",
      },
      {
        id: "m1-4-player",
        displayStep: 4,
        title: "Ton personnage",
        text: "Ton personnage se trouve Ã  gauche du court.",
        focus: [{ target: "character", playerIndex: 0 }],
      },
      {
        id: "m1-5-opponent",
        displayStep: 5,
        title: "Ton adversaire",
        text: "Le personnage de ton adversaire se trouve Ã  droite.",
        focus: [{ target: "character", playerIndex: 1 }],
      },
      {
        id: "m1-6-last-card",
        displayStep: 6,
        title: "La derniÃ¨re carte",
        text: "Au centre du plateau, tu peux consulter et agrandir la derniÃ¨re carte jouÃ©e.",
        focus: [{ target: "lastCard" }],
      },
      {
        id: "m1-7-power",
        displayStep: 7,
        title: "La puissance",
        text: "La puissance de ton personnage t'aide Ã  gagner l'Ã©change.",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m1-8-endurance",
        displayStep: 8,
        title: "L'endurance",
        text: "L'endurance permet de jouer tes cartes. Quand elle est Ã©puisÃ©e, tu ne peux plus jouer de nouveau coup.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m1-9-card",
        displayStep: 9,
        title: "Une carte de jeu",
        text: "Regardons maintenant une carte de plus prÃ¨s.",
        showcase: { cardId: "revers-3-3-3" },
      },
      {
        id: "m1-10-card-cost",
        displayStep: 10,
        title: "Le coÃ»t en endurance",
        text: "En haut Ã  gauche, ce nombre indique l'endurance dÃ©pensÃ©e pour jouer la carte.",
        showcase: {
          cardId: "revers-3-3-3",
          pointer: "cost",
          label: "CoÃ»t",
        },
      },
      {
        id: "m1-11-card-power",
        displayStep: 11,
        title: "La puissance de la carte",
        text: "En haut Ã  droite, ce nombre indique la puissance apportÃ©e par la carte.",
        showcase: {
          cardId: "revers-3-3-3",
          pointer: "power",
          label: "Puissance",
        },
      },
      {
        id: "m1-12-precision",
        displayStep: 12,
        title: "La prÃ©cision",
        text: "La prÃ©cision sera utilisÃ©e dans une prochaine leÃ§on.",
        showcase: { cardId: "revers-3-3-3", pointer: "precision", label: "PrÃ©cision" },
      },
      {
        id: "m1-13-placement",
        displayStep: 13,
        title: "Le placement",
        text: "Le placement sera lui aussi expliquÃ© dans une prochaine leÃ§on.",
        showcase: { cardId: "revers-3-3-3", pointer: "placement", label: "Placement" },
      },
      {
        id: "m1-14-effect",
        displayStep: 14,
        title: "L'effet",
        text: "Au centre de la carte se trouve son Ã©ventuel effet de jeu.",
        showcase: { cardId: "revers-3-3-3", pointer: "effect", label: "Effet" },
      },
      {
        id: "m1-15-boost-zone",
        displayStep: 15,
        title: "La zone Boost",
        text: "Certaines cartes possÃ¨dent en bas une zone Boost, que nous Ã©tudierons plus tard.",
        showcase: { cardId: "revers-3-3-3", pointer: "boost", label: "Zone Boost" },
      },
      {
        id: "m1-16-play-button",
        displayStep: 16,
        title: "Le bouton Jouer",
        text: "Sous une carte, le bouton Jouer permet de l'utiliser normalement.",
        focus: [{ target: "play", playerIndex: 0, cardId: "revers-3-3-3" }],
      },
      {
        id: "m1-17-boost-button",
        displayStep: 17,
        title: "Le bouton Boost",
        text: "Le bouton Boost s'active quand ses conditions sont rÃ©unies. Le Boost coÃ»te la mÃªme endurance que la carte, mais exige de sacrifier une autre carte.",
        focus: [{ target: "boost", playerIndex: 0, cardId: "revers-3-3-3" }],
      },
      {
        id: "m1-18-history",
        displayStep: 18,
        title: "Le journal d'Ã©change",
        text: "Le journal d'Ã©change conserve toutes les actions effectuÃ©es pendant le point.",
        focus: [{ target: "history" }],
      },
      {
        id: "m1-19-conclusion",
        displayStep: 19,
        title: "Conclusion",
        text: "Parfait, tu connais les principaux Ã©lÃ©ments de l'interface ! La prochaine leÃ§on te fera jouer ton premier Ã©change.",
        final: true,
      },
    ],
  },
  guidedRally: {
    id: "module-2-guided-rally",
    lesson: "AcadÃ©mie Â· Module 2",
    title: "Premier Ã©change guidÃ©",
    narrator: "coachJu",
    scenario: "guided-rally",
    initialLog: ["Premier Ã©change guidÃ© : suis les indications de Coach Ju."],
    totalDisplaySteps: 22,
    steps: [
      {
        id: "m2-1-court",
        displayStep: 1,
        title: "Bienvenue sur le court",
        text: "Nous allons jouer ensemble ton premier Ã©change. Je te guiderai Ã  chaque action.",
      },
      {
        id: "m2-2-server",
        displayStep: 2,
        title: "Tu es au service",
        text: "Le badge Serveur indique que tu dois engager l'Ã©change.",
        focus: [{ target: "character", playerIndex: 0 }],
      },
      {
        id: "m2-3-select-service",
        displayStep: 3,
        title: "Choisis le Service",
        text: "SÃ©lectionne maintenant la carte Service.",
        action: { kind: "selectCard", playerIndex: 0, cardId: "service-coup-droit" },
        error: "SÃ©lectionne la carte Service indiquÃ©e par la flÃ¨che.",
      },
      {
        id: "m2-4-play-service",
        displayStep: 4,
        title: "Joue le Service",
        text: "Clique sur Jouer sous la carte Service pour engager l'Ã©change.",
        action: { kind: "play", playerIndex: 0, cardId: "service-coup-droit", mode: "normal" },
      },
      {
        id: "m2-5-service-cost",
        displayStep: 5,
        title: "Endurance dÃ©pensÃ©e",
        text: "Ton Service a coÃ»tÃ© 2 points d'endurance.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m2-6-service-power",
        displayStep: 6,
        title: "Puissance gagnÃ©e",
        text: "Ton Service t'a rapportÃ© 4 points de puissance.",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m2-7-coach-first-reply",
        displayStep: 7,
        title: "La rÃ©ponse de Coach Ju",
        text: "Je rÃ©ponds avec un Passing. Regarde l'Ã©change changer de cÃ´tÃ©.",
        auto: { kind: "play", playerIndex: 1, cardId: "passing-1-1-4", mode: "normal" },
        autoDelayMs: 500,
      },
      {
        id: "m2-8-alternation",
        displayStep: 8,
        title: "Chacun son tour",
        text: "Chaque joueur joue une carte Ã  son tour. C'est de nouveau Ã  toi.",
        focus: [{ target: "character", playerIndex: 0 }],
      },
      {
        id: "m2-9-select-forehand",
        displayStep: 9,
        title: "Choisis le Coup droit",
        text: "SÃ©lectionne le Coup droit indiquÃ©.",
        action: { kind: "selectCard", playerIndex: 0, cardId: "coup-droit-4-3-5" },
      },
      {
        id: "m2-10-play-forehand",
        displayStep: 10,
        title: "Joue le Coup droit",
        text: "Clique sur Jouer sous ton Coup droit.",
        action: { kind: "play", playerIndex: 0, cardId: "coup-droit-4-3-5", mode: "normal" },
      },
      {
        id: "m2-11-less-endurance",
        displayStep: 11,
        title: "L'endurance diminue",
        text: "Ã€ chaque carte jouÃ©e, son coÃ»t est retirÃ© de ton endurance.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m2-12-more-power",
        displayStep: 12,
        title: "La puissance augmente",
        text: "La puissance de la carte s'ajoute Ã  ton total.",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m2-13-coach-second-reply",
        displayStep: 13,
        title: "Coach Ju poursuit",
        text: "Je joue maintenant un Lob. L'Ã©change continue.",
        auto: { kind: "play", playerIndex: 1, cardId: "lob-2-0-4", mode: "normal" },
        autoDelayMs: 500,
      },
      {
        id: "m2-14-select-backhand",
        displayStep: 14,
        title: "Choisis le Revers",
        text: "Il te reste exactement assez d'endurance. SÃ©lectionne ton Revers.",
        action: { kind: "selectCard", playerIndex: 0, cardId: "revers-3-3-3" },
      },
      {
        id: "m2-15-play-backhand",
        displayStep: 15,
        title: "Joue le Revers",
        text: "Clique sur Jouer pour utiliser tes derniers points d'endurance.",
        action: { kind: "play", playerIndex: 0, cardId: "revers-3-3-3", mode: "normal" },
      },
      {
        id: "m2-16-empty-endurance",
        displayStep: 16,
        title: "Endurance Ã©puisÃ©e",
        text: "Ton endurance est maintenant Ã  zÃ©ro.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m2-17-coach-last-reply",
        displayStep: 17,
        title: "DerniÃ¨re rÃ©ponse",
        text: "Je joue une derniÃ¨re Amortie. Tu ne peux plus rÃ©pondre avec une carte.",
        auto: { kind: "play", playerIndex: 1, cardId: "amortie-2-1-4", mode: "normal" },
        autoDelayMs: 500,
      },
      {
        id: "m2-18-pass-explanation",
        displayStep: 18,
        title: "Quand passer",
        text: "Quand tu ne peux plus continuer, utilise le bouton Passer.",
        focus: [{ target: "pass", playerIndex: 0 }],
      },
      {
        id: "m2-19-pass-action",
        displayStep: 19,
        title: "Passe",
        text: "Clique maintenant sur Passer pour terminer l'Ã©change.",
        action: { kind: "pass", playerIndex: 0 },
      },
      {
        id: "m2-20-pass-bonus",
        displayStep: 20,
        title: "Le bonus de passe",
        text: "Ton adversaire reÃ§oit un bonus Ã©gal Ã  ton endurance restante, avec un minimum de 2 points.",
      },
      {
        id: "m2-21-result",
        displayStep: 21,
        title: "RÃ©solution de l'Ã©change",
        text: "Les puissances finales sont comparÃ©es. Tu remportes cet Ã©change !",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m2-22-conclusion",
        displayStep: 22,
        title: "Premier Ã©change terminÃ©",
        text: "Bravo, tu viens de terminer ton premier Ã©change ! La prochaine leÃ§on expliquera en dÃ©tail le calcul du vainqueur.",
        final: true,
      },
    ],
  },
};

const TUTORIAL_ENGINE = window.TennisCourtsTutorialEngine;
if (!TUTORIAL_ENGINE) throw new Error("Le moteur du tutoriel n'a pas Ã©tÃ© chargÃ©.");
TUTORIAL_ENGINE.assertValidModules(TUTORIAL_MODULES);
const TUTORIALS_ENABLED = false;
const TUTORIAL_PROGRESS_STORAGE_PREFIX = "tennisCourtsTutorialProgressV1";

let tutorialAutoTimer = null;
let tutorialProgressSaveTimer = null;
let tutorialTypingTimer = null;
let tutorialTypingStepId = null;
let tutorialTypingText = "";
let tutorialTypingProgress = 0;
let tutorialTypingStartedAt = 0;
let tutorialTypingDurationMs = 0;
let opponentHandRevealTimer = null;
let confrontationIntroTimer = null;
let confrontationIntroActive = false;
let confrontationIntroSequenceTimers = [];
let soloTournamentCountdownTimer = null;
let desktopHistoryExpanded = false;

const GAMEPLAY_ASSIST = {
  information: localStorage.getItem("tennisLightAssistInformation") === "true",
  alwaysVisibleActions: localStorage.getItem("tennisLightAlwaysVisibleActions") === "true",
  cardZoom: localStorage.getItem("tennisLightCardZoom") !== "false",
  adaptiveBoard: localStorage.getItem("tennisLightAssistAdaptiveBoard") === "true",
  cardDescriptions: localStorage.getItem("tennisLightCardDescriptions") === "true",
  stopOpponentCard: localStorage.getItem("tennisLightMobileStopOpponentCard") !== "false",
  panelOpen: false,
};
const LOCAL_MOBILE_MATCH_STORAGE_PREFIX = "tennisLightLocalMobileMatch:";
const LOCAL_MOBILE_MATCH_QUERY = "localMatch";
const LOCAL_ACTIVE_MATCH_STORAGE_KEY = "tennisLightActiveLocalMatch";
const LOCAL_MATCH_DATABASE_NAME = "tennisLightMatches";
const LOCAL_MATCH_DATABASE_VERSION = 1;
const LOCAL_MATCH_DATABASE_STORE = "matches";
const LOCAL_MATCH_DATABASE_ACTIVE_KEY = "__active__";
let localMobileMatchSaveTimer = null;

function localMatchViewIsActive() {
  return !els?.gameApp?.classList.contains("hidden")
    || !els?.mobileGameApp?.classList.contains("hidden")
    || document.body.classList.contains("mobile-game-view");
}

function localMobileMatchId() {
  return new URLSearchParams(window.location.search).get(LOCAL_MOBILE_MATCH_QUERY);
}

function localMobileMatchStorageKey(matchId) {
  return `${LOCAL_MOBILE_MATCH_STORAGE_PREFIX}${matchId}`;
}

function createLocalMatchId() {
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  const randomPart = Array.from(crypto?.getRandomValues?.(new Uint32Array(4)) || [
    Math.random() * 0xffffffff,
    Math.random() * 0xffffffff,
    Math.random() * 0xffffffff,
    Math.random() * 0xffffffff,
  ]).map((value) => Math.floor(value).toString(16).padStart(8, "0")).join("");
  return `${Date.now().toString(36)}-${randomPart}`;
}

function openLocalMatchDatabase() {
  if (!window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = window.indexedDB.open(LOCAL_MATCH_DATABASE_NAME, LOCAL_MATCH_DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(LOCAL_MATCH_DATABASE_STORE)) {
        request.result.createObjectStore(LOCAL_MATCH_DATABASE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function writeLocalMatchDatabaseRecord(record) {
  const database = await openLocalMatchDatabase();
  if (!database) return false;
  return new Promise((resolve) => {
    const transaction = database.transaction(LOCAL_MATCH_DATABASE_STORE, "readwrite");
    const store = transaction.objectStore(LOCAL_MATCH_DATABASE_STORE);
    store.put(record, record.matchId);
    if (record.status === "active" || record.status === "paused") {
      store.put(record, LOCAL_MATCH_DATABASE_ACTIVE_KEY);
    } else {
      store.delete(LOCAL_MATCH_DATABASE_ACTIVE_KEY);
    }
    transaction.oncomplete = () => {
      database.close();
      resolve(true);
    };
    transaction.onerror = () => {
      database.close();
      resolve(false);
    };
  });
}

async function readLocalMatchDatabaseRecord(matchId = null) {
  const database = await openLocalMatchDatabase();
  if (!database) return null;
  return new Promise((resolve) => {
    const transaction = database.transaction(LOCAL_MATCH_DATABASE_STORE, "readonly");
    const request = transaction.objectStore(LOCAL_MATCH_DATABASE_STORE)
      .get(matchId || LOCAL_MATCH_DATABASE_ACTIVE_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
    transaction.oncomplete = () => database.close();
  });
}

async function clearActiveLocalMatchDatabaseRecord() {
  const database = await openLocalMatchDatabase();
  if (!database) return;
  const transaction = database.transaction(LOCAL_MATCH_DATABASE_STORE, "readwrite");
  transaction.objectStore(LOCAL_MATCH_DATABASE_STORE).delete(LOCAL_MATCH_DATABASE_ACTIVE_KEY);
  transaction.oncomplete = () => database.close();
  transaction.onerror = () => database.close();
}

async function deleteLocalMatchDatabaseRecord(matchId) {
  const database = await openLocalMatchDatabase();
  if (!database) return;
  const transaction = database.transaction(LOCAL_MATCH_DATABASE_STORE, "readwrite");
  const store = transaction.objectStore(LOCAL_MATCH_DATABASE_STORE);
  if (matchId) store.delete(matchId);
  store.delete(LOCAL_MATCH_DATABASE_ACTIVE_KEY);
  transaction.oncomplete = () => database.close();
  transaction.onerror = () => database.close();
}

function rememberActiveLocalMatch(matchId) {
  try {
    if (matchId) localStorage.setItem(LOCAL_ACTIVE_MATCH_STORAGE_KEY, matchId);
    else localStorage.removeItem(LOCAL_ACTIVE_MATCH_STORAGE_KEY);
  } catch (error) {
    // L'identifiant dans l'URL reste disponible si ce petit index Ã©choue.
  }
}

function rememberedActiveLocalMatchId() {
  try {
    return localStorage.getItem(LOCAL_ACTIVE_MATCH_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function ensureLocalMobileMatchSession() {
  if (!localMatchViewIsActive()
    || SERVER_SYNC.enabled
    || FRIENDLY_TOURNAMENT.enabled
    || SPECTATOR_MODE.enabled
    || !state.players?.length) return null;
  let matchId = localMobileMatchId();
  if (!matchId) {
    matchId = createLocalMatchId();
    const params = new URLSearchParams(window.location.search);
    params.set(LOCAL_MOBILE_MATCH_QUERY, matchId);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params}`);
  }
  rememberActiveLocalMatch(matchId);
  return matchId;
}

function localMatchIsCompleted() {
  return state.setMatch?.enabled
    ? Boolean(state.setMatch.matchOver)
    : Boolean(state.gameOver);
}

function saveLocalMobileMatchSession() {
  const matchId = ensureLocalMobileMatchSession();
  if (!matchId) return false;
  const completed = localMatchIsCompleted();
  const record = {
    schemaVersion: 1,
    ultimateVersion: "V5.35",
    gameVersion: GAME_VERSION,
    matchId,
    status: completed ? "completed" : "active",
    ownerUserId: authenticatedUserId() || null,
    savedAt: new Date().toISOString(),
    expiresAt: completed ? Date.now() + (7 * 24 * 60 * 60 * 1000) : null,
    snapshot: {
      state: cloneData(state),
      soloAi: cloneData(SOLO_AI),
      ultimateMode: ULTIMATE_MODE.active ? {
        active: true,
        playerOrder: [...ULTIMATE_MODE.playerOrder],
        aiDifficulty: ULTIMATE_MODE.aiDifficulty,
        draftNumber: ULTIMATE_MODE.draftNumber,
        draftPlayer: ULTIMATE_MODE.draftPlayer,
        draftPurpose: ULTIMATE_MODE.draftPurpose,
        draftChoices: cloneData(ULTIMATE_MODE.draftChoices || []),
        draftSelected: [...(ULTIMATE_MODE.draftSelected || [])],
        postExchange: cloneData(ULTIMATE_MODE.postExchange),
        markChoice: cloneData(ULTIMATE_MODE.markChoice),
      } : null,
      humanMatchTelemetry: cloneData(HUMAN_MATCH_TELEMETRY.active),
    },
  };
  try {
    localStorage.setItem(localMobileMatchStorageKey(matchId), JSON.stringify(record));
    if (completed) {
      if (rememberedActiveLocalMatchId() === matchId) rememberActiveLocalMatch(null);
    } else {
      rememberActiveLocalMatch(matchId);
    }
    void writeLocalMatchDatabaseRecord(record);
  } catch (error) {
    // Safari peut refuser localStorage (quota ou navigation privÃ©e).
    // IndexedDB reste alors la sauvegarde principale.
    void writeLocalMatchDatabaseRecord(record);
  }
  return true;
}

function manuallySaveMatch() {
  if (!state.tournament?.weekly) {
    return {
      ok: false,
      message: "La sauvegarde manuelle est rÃ©servÃ©e au Circuit Pro.",
    };
  }
  const saved = saveLocalMobileMatchSession();
  if (!saved) {
    return {
      ok: false,
      message: SERVER_SYNC.enabled || FRIENDLY_TOURNAMENT.enabled
        ? "Cette partie est dÃ©jÃ  sauvegardÃ©e par le serveur."
        : "La sauvegarde nâ€™est pas disponible pour cette partie.",
    };
  }
  return {
    ok: true,
    message: localMatchIsCompleted() ? "Match terminÃ© sauvegardÃ©." : "Match sauvegardÃ©.",
  };
}

function scheduleLocalMobileMatchSave() {
  if (!localMatchViewIsActive() || SERVER_SYNC.enabled || FRIENDLY_TOURNAMENT.enabled) return;
  window.clearTimeout(localMobileMatchSaveTimer);
  localMobileMatchSaveTimer = window.setTimeout(saveLocalMobileMatchSession, 80);
}

function expireLocalMobileMatchSessionAfterExit() {
  const matchId = localMobileMatchId();
  if (!matchId) return;
  try {
    const record = JSON.parse(localStorage.getItem(localMobileMatchStorageKey(matchId)) || "null");
    if (record) {
      const completed = localMatchIsCompleted();
      record.status = completed ? "completed" : "paused";
      // Une partie interrompue reste reprenable aprÃ¨s un retour arriÃ¨re,
      // une fermeture d'onglet ou un rechargement, sans dÃ©lai arbitraire.
      record.expiresAt = completed ? record.expiresAt : null;
      record.savedAt = new Date().toISOString();
      localStorage.setItem(localMobileMatchStorageKey(matchId), JSON.stringify(record));
    }
  } catch (error) {
    // La sortie du match ne doit jamais Ãªtre bloquÃ©e par le stockage.
  }
  if (rememberedActiveLocalMatchId() === matchId) rememberActiveLocalMatch(null);
  void clearActiveLocalMatchDatabaseRecord();
  const params = new URLSearchParams(window.location.search);
  params.delete(LOCAL_MOBILE_MATCH_QUERY);
  const nextQuery = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
}

function restoreLocalMobileMatchSession(matchId = localMobileMatchId()) {
  // V6.2: a clean site URL must always open the lobby. A remembered match is
  // restored only after an explicit click on "Reprendre la partie".
  if (!matchId || SERVER_SYNC.enabled || FRIENDLY_TOURNAMENT.enabled) return false;
  try {
    const record = JSON.parse(localStorage.getItem(localMobileMatchStorageKey(matchId)) || "null");
    const currentUserId = authenticatedUserId() || null;
    const belongsToAnotherUser = Boolean(record?.ownerUserId && currentUserId && record.ownerUserId !== currentUserId);
    if (!record?.snapshot || record.status === "completed" || belongsToAnotherUser
      || (record.expiresAt && Number(record.expiresAt) <= Date.now())) {
      localStorage.removeItem(localMobileMatchStorageKey(matchId));
      if (rememberedActiveLocalMatchId() === matchId) rememberActiveLocalMatch(null);
      return false;
    }
    if (!localMobileMatchId()) {
      const params = new URLSearchParams(window.location.search);
      params.set(LOCAL_MOBILE_MATCH_QUERY, matchId);
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params}`);
    }
    if (!restoreStateSnapshot(record.snapshot)) return false;
    showGameScreen();
    applySurfaceBackground(state.tournament?.competitionSurface);
    render();
    return true;
  } catch (error) {
    return false;
  }
}

async function restoreLocalMatchSessionFromDatabase({ matchId = localMobileMatchId(), allowActiveFallback = false } = {}) {
  if (SERVER_SYNC.enabled || FRIENDLY_TOURNAMENT.enabled) return false;
  if (!matchId && !allowActiveFallback) return false;
  const record = (matchId ? await readLocalMatchDatabaseRecord(matchId) : null)
    || (allowActiveFallback ? await readLocalMatchDatabaseRecord() : null);
  if (!record?.snapshot || record.status === "completed"
    || (record.expiresAt && Number(record.expiresAt) <= Date.now())) return false;
  const currentUserId = authenticatedUserId() || null;
  if (record.ownerUserId && currentUserId && record.ownerUserId !== currentUserId) return false;
  const params = new URLSearchParams(window.location.search);
  params.set(LOCAL_MOBILE_MATCH_QUERY, record.matchId);
  window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params}`);
  rememberActiveLocalMatch(record.matchId);
  if (!restoreStateSnapshot(record.snapshot)) return false;
  showGameScreen();
  applySurfaceBackground(state.tournament?.competitionSurface);
  render();
  return true;
}

function localMatchRecordCanResume(record) {
  if (!record?.snapshot || record.status === "completed") return false;
  if (record.expiresAt && Number(record.expiresAt) <= Date.now()) return false;
  const currentUserId = authenticatedUserId() || null;
  return !(record.ownerUserId && currentUserId && record.ownerUserId !== currentUserId);
}

function rememberedLocalMatchRecord() {
  const matchId = rememberedActiveLocalMatchId();
  if (!matchId) return null;
  try {
    const record = JSON.parse(localStorage.getItem(localMobileMatchStorageKey(matchId)) || "null");
    return localMatchRecordCanResume(record) ? record : null;
  } catch (error) {
    return null;
  }
}

function setLocalMatchResumePromptVisible(visible) {
  els.localMatchResumePrompt?.classList.toggle("hidden", !visible);
}

async function refreshLocalMatchResumePrompt() {
  if (localMobileMatchId()) {
    setLocalMatchResumePromptVisible(false);
    return;
  }
  const localRecord = rememberedLocalMatchRecord();
  if (localRecord) {
    setLocalMatchResumePromptVisible(true);
    return;
  }
  const databaseRecord = await readLocalMatchDatabaseRecord();
  setLocalMatchResumePromptVisible(localMatchRecordCanResume(databaseRecord));
}

async function resumeRememberedLocalMatch() {
  const rememberedMatchId = rememberedActiveLocalMatchId();
  if ((rememberedMatchId && restoreLocalMobileMatchSession(rememberedMatchId))
    || await restoreLocalMatchSessionFromDatabase({ matchId: rememberedMatchId, allowActiveFallback: true })) {
    setLocalMatchResumePromptVisible(false);
    installBrowserNavigation();
    return;
  }
  setLocalMatchResumePromptVisible(false);
  rememberActiveLocalMatch(null);
  await clearActiveLocalMatchDatabaseRecord();
}

async function discardRememberedLocalMatch() {
  if (!window.confirm("Abandonner dÃ©finitivement la partie sauvegardÃ©e sur cet appareil ?")) return;
  const matchId = rememberedActiveLocalMatchId();
  try {
    if (matchId) localStorage.removeItem(localMobileMatchStorageKey(matchId));
  } catch (error) {
    // IndexedDB est nettoyÃ© mÃªme si le stockage local est indisponible.
  }
  rememberActiveLocalMatch(null);
  await deleteLocalMatchDatabaseRecord(matchId);
  setLocalMatchResumePromptVisible(false);
}

const state = {
  players: [],
  deck: [],
  discardedCards: [],
  ultimateDecks: [[], []],
  ultimateDiscards: [[], []],
  activePlayer: 0,
  server: 0,
  lastCard: null,
  boostAvailableFor: null,
  mandatoryPlacement: false,
  mandatoryPlacementReason: null,
  mandatoryPlacementSourceUid: null,
  openingServePlayed: false,
  returnServiceRestrictionFor: null,
  returnServiceRestrictionSpent: [false, false],
  turnPlacement: [0, 0],
  turnEffectPlacement: [0, 0],
  turnHasEffect: [false, false],
  turnIgnoresPlacement: [false, false],
  turnCannotOpenBoost: [false, false],
  turnPlayedCards: [[], []],
  latestPlayedCard: null,
  gameOver: false,
  log: [],
  pendingBoost: null,
  pendingEffectChoice: null,
  pendingCoachChoice: null,
  pendingRemoveChoice: null,
  pendingEndTurnAfterChoice: null,
  effectNotice: null,
  resultInfo: null,
  turnSnapshot: null,
  turnDirty: false,
  turnUndoLocked: false,
  revealAiCards: false,
  opponentHandReveal: null,
  actionLog: [],
  tournament: cloneData(EMPTY_TOURNAMENT),
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
    momentum: [
      { consecutiveWins: 0, activeBonuses: [] },
      { consecutiveWins: 0, activeBonuses: [] },
    ],
  },
  tutorial: TUTORIAL_ENGINE.createState({ moduleId: "basics" }, TUTORIAL_MODULES),
};

const els = {
  newGameButton: document.querySelector("#newGameButton"),
  ultimateModeButton: document.querySelector("#ultimateModeButton"),
  ultimatePlayerDialog: document.querySelector("#ultimatePlayerDialog"),
  ultimatePlayerChoices: document.querySelector("#ultimatePlayerChoices"),
  ultimateDraftDialog: document.querySelector("#ultimateDraftDialog"),
  ultimateDraftTitle: document.querySelector("#ultimateDraftTitle"),
  ultimateDraftInstruction: document.querySelector("#ultimateDraftInstruction"),
  ultimateDraftCards: document.querySelector("#ultimateDraftCards"),
  ultimateDraftConfirm: document.querySelector("#ultimateDraftConfirm"),
  ultimateRulesDialog: document.querySelector("#ultimateRulesDialog"),
  ultimateRulesClose: document.querySelector("#ultimateRulesClose"),
  ultimatePostExchangeDialog: document.querySelector("#ultimatePostExchangeDialog"),
  ultimatePostExchangeTitle: document.querySelector("#ultimatePostExchangeTitle"),
  ultimatePostExchangeInstruction: document.querySelector("#ultimatePostExchangeInstruction"),
  ultimatePostExchangeCards: document.querySelector("#ultimatePostExchangeCards"),
  ultimatePostExchangeSkip: document.querySelector("#ultimatePostExchangeSkip"),
  ultimatePostExchangeConfirm: document.querySelector("#ultimatePostExchangeConfirm"),
  modeInfoBadge: document.querySelector("#modeInfoBadge"),
  adminGameTools: document.querySelector("#adminGameTools"),
  adminGameToolsButton: document.querySelector("#adminGameToolsButton"),
  adminGameToolsPanel: document.querySelector("#adminGameToolsPanel"),
  adminSimulateScoreButton: document.querySelector("#adminSimulateScoreButton"),
  saveMatchButton: document.querySelector("#saveMatchButton"),
  returnLobbyButton: document.querySelector("#returnLobbyButton"),
  onlineForfeitButton: document.querySelector("#onlineForfeitButton"),
  topProgressionActions: document.querySelector("#topProgressionActions"),
  gameAssistTools: document.querySelector("#gameAssistTools"),
  gameAssistButton: document.querySelector("#gameAssistButton"),
  desktopGameMenuToggle: document.querySelector("#desktopGameMenuToggle"),
  desktopGameMenu: document.querySelector("#desktopGameMenu"),
  gameAssistPanel: document.querySelector("#gameAssistPanel"),
  gameInformationToggle: document.querySelector("#gameInformationToggle"),
  gameAlwaysVisibleActionsToggle: document.querySelector("#gameAlwaysVisibleActionsToggle"),
  gameCardZoomToggle: document.querySelector("#gameCardZoomToggle"),
  gameAdaptiveBoardToggle: document.querySelector("#gameAdaptiveBoardToggle"),
  gameCardDescriptionsToggle: document.querySelector("#gameCardDescriptionsToggle"),
  gameContextStrip: document.querySelector("#gameContextStrip"),
  spectatorQuitButton: document.querySelector("#spectatorQuitButton"),
  gameLogoButton: document.querySelector("#gameLogoButton"),
  menuScreen: document.querySelector("#menuScreen"),
  lobbySectionScreen: document.querySelector("#lobbySectionScreen"),
  lobbySectionPanels: document.querySelectorAll("[data-lobby-section-panel]"),
  lobbyModeCards: document.querySelectorAll("[data-open-lobby-section]"),
  localMatchResumePrompt: document.querySelector("#localMatchResumePrompt"),
  resumeLocalMatchButton: document.querySelector("#resumeLocalMatchButton"),
  discardLocalMatchButton: document.querySelector("#discardLocalMatchButton"),
  backToHomeButton: document.querySelector("#backToHomeButton"),
  lobbyAccountPanel: document.querySelector("#lobbyAccountPanel"),
  lobbySettingsButton: document.querySelector("#lobbySettingsButton"),
  lobbyUserButton: document.querySelector("#lobbyUserButton"),
  lobbyProfileAvatar: document.querySelector("#lobbyProfileAvatar"),
  globalPlayerDock: document.querySelector("#globalPlayerDock"),
  globalPlayerProfileButton: document.querySelector("#globalPlayerProfileButton"),
  globalPlayerAvatar: document.querySelector("#globalPlayerAvatar"),
  globalPlayerNickname: document.querySelector("#globalPlayerNickname"),
  globalPlayerRole: document.querySelector("#globalPlayerRole"),
  lobbyHeaderNickname: document.querySelector("#lobbyHeaderNickname"),
  lobbyHeaderRole: document.querySelector("#lobbyHeaderRole"),
  adminScreen: document.querySelector("#adminScreen"),
  rankingScreen: document.querySelector("#rankingScreen"),
  circuitInfoScreen: document.querySelector("#circuitInfoScreen"),
  soloInfoScreen: document.querySelector("#soloInfoScreen"),
  onlineInfoScreen: document.querySelector("#onlineInfoScreen"),
  academyInfoScreen: document.querySelector("#academyInfoScreen"),
  tutorialModulesScreen: document.querySelector("#tutorialModulesScreen"),
  newsArchiveScreen: document.querySelector("#newsArchiveScreen"),
  openTutorialModulesButton: document.querySelector("#openTutorialModulesButton"),
  backToTrainingFromTutorialButton: document.querySelector("#backToTrainingFromTutorialButton"),
  tutorialModulesHomeButton: document.querySelector("#tutorialModulesHomeButton"),
  profileScreen: document.querySelector("#profileScreen"),
  characterScreen: document.querySelector("#characterScreen"),
  resetPasswordScreen: document.querySelector("#resetPasswordScreen"),
  friendlyLobbyScreen: document.querySelector("#friendlyLobbyScreen"),
  friendlyLobbyContent: document.querySelector("#friendlyLobbyContent"),
  friendlyLobbyHomeButton: document.querySelector("#friendlyLobbyHomeButton"),
  friendlyLobbyDirectHomeButton: document.querySelector("#friendlyLobbyDirectHomeButton"),
  friendlyLobbyLogoButton: document.querySelector("#friendlyLobbyLogoButton"),
  aiClubHouseScreen: document.querySelector("#aiClubHouseScreen"),
  championshipLobbyScreen: document.querySelector("#championshipLobbyScreen"),
  competitionSummaryScreen: document.querySelector("#competitionSummaryScreen"),
  competitionSummaryContent: document.querySelector("#competitionSummaryContent"),
  championshipLobbyContent: document.querySelector("#championshipLobbyContent"),
  aiClubHouseHomeButton: document.querySelector("#aiClubHouseHomeButton"),
  aiClubHouseLogoButton: document.querySelector("#aiClubHouseLogoButton"),
  openAiClubHouseButton: document.querySelector("#openAiClubHouseButton"),
  startAiClubHouseButton: document.querySelector("#startAiClubHouseButton"),
  aiLevelDescription: document.querySelector("#aiLevelDescription"),
  aiBonusDescription: document.querySelector("#aiBonusDescription"),
  aiBonusSettingRow: document.querySelector("#aiBonusSettingRow"),
  aiClubHouseSummary: document.querySelector("#aiClubHouseSummary"),
  aiClubHouseSummaryTitle: document.querySelector("#aiClubHouseSummaryTitle"),
  aiClubHouseAccessNote: document.querySelector("#aiClubHouseAccessNote"),
  aiClubHouseSaveActions: document.querySelector("#aiClubHouseSaveActions"),
  resumeAiClubHouseSaveButton: document.querySelector("#resumeAiClubHouseSaveButton"),
  deleteAiClubHouseSaveButton: document.querySelector("#deleteAiClubHouseSaveButton"),
  aiClubSettingButtons: document.querySelectorAll("[data-ai-club-setting]"),
  gameApp: document.querySelector(".game-app"),
  mobileGameApp: document.querySelector("#mobileGameApp"),
  adminGameViewToggle: document.querySelector("#adminGameViewToggle"),
  authStatus: document.querySelector("#authStatus"),
  authForm: document.querySelector("#authForm"),
  authEmailInput: document.querySelector("#authEmailInput"),
  authPasswordInput: document.querySelector("#authPasswordInput"),
  authNicknameInput: document.querySelector("#authNicknameInput"),
  loginButton: document.querySelector("#loginButton"),
  registerButton: document.querySelector("#registerButton"),
  forgotPasswordButton: document.querySelector("#forgotPasswordButton"),
  resetPasswordInput: document.querySelector("#resetPasswordInput"),
  confirmResetPasswordButton: document.querySelector("#confirmResetPasswordButton"),
  backToLoginFromResetButton: document.querySelector("#backToLoginFromResetButton"),
  resetPasswordStatus: document.querySelector("#resetPasswordStatus"),
  logoutButton: document.querySelector("#logoutButton"),
  profileButton: document.querySelector("#profileButton"),
  proCodePanel: document.querySelector("#proCodePanel"),
  proCodeInput: document.querySelector("#proCodeInput"),
  redeemProCodeButton: document.querySelector("#redeemProCodeButton"),
  proCodeStatus: document.querySelector("#proCodeStatus"),
  adminPanel: document.querySelector("#adminPanel"),
  backToLobbyFromAdminButton: document.querySelector("#backToLobbyFromAdminButton"),
  adminExportHumanMatchesButton: document.querySelector("#adminExportHumanMatchesButton"),
  adminUsersTable: document.querySelector("#adminUsersTable"),
  generateProCodesButton: document.querySelector("#generateProCodesButton"),
  adminProCodesList: document.querySelector("#adminProCodesList"),
  adminPrevPageButton: document.querySelector("#adminPrevPageButton"),
  adminNextPageButton: document.querySelector("#adminNextPageButton"),
  adminNextWeekButton: document.querySelector("#adminNextWeekButton"),
  adminRestartSeasonButton: document.querySelector("#adminRestartSeasonButton"),
  adminRestartSeasonOneButton: document.querySelector("#adminRestartSeasonOneButton"),
  adminRankingList: document.querySelector("#adminRankingList"),
  adminRefreshAiReportButton: document.querySelector("#adminRefreshAiReportButton"),
  adminAiReportSummary: document.querySelector("#adminAiReportSummary"),
  adminAiReportTable: document.querySelector("#adminAiReportTable"),
  adminPageInfo: document.querySelector("#adminPageInfo"),
  openRankingPageButton: document.querySelector("#openRankingPageButton"),
  backToLobbyFromRankingButton: document.querySelector("#backToLobbyFromRankingButton"),
  rankingHomeButton: document.querySelector("#rankingHomeButton"),
  openCircuitInfoButton: document.querySelector("#openCircuitInfoButton"),
  openSoloInfoButton: document.querySelector("#openSoloInfoButton"),
  backToLobbyFromCircuitInfoButton: document.querySelector("#backToLobbyFromCircuitInfoButton"),
  circuitInfoHomeButton: document.querySelector("#circuitInfoHomeButton"),
  openAcademyInfoButton: document.querySelector("#openAcademyInfoButton"),
  backToLobbyFromAcademyInfoButton: document.querySelector("#backToLobbyFromAcademyInfoButton"),
  academyInfoHomeButton: document.querySelector("#academyInfoHomeButton"),
  academyDeckList: document.querySelector("#academyDeckList"),
  tournamentLoadingDialog: document.querySelector("#tournamentLoadingDialog"),
  tournamentLoadingTitle: document.querySelector("#tournamentLoadingTitle"),
  tournamentLoadingMessage: document.querySelector("#tournamentLoadingMessage"),
  backToLobbyFromProfileButton: document.querySelector("#backToLobbyFromProfileButton"),
  profileHomeButton: document.querySelector("#profileHomeButton"),
  rankingList: document.querySelector("#rankingList"),
  rankingFullList: document.querySelector("#rankingFullList"),
  rankingPrevPageButton: document.querySelector("#rankingPrevPageButton"),
  rankingNextPageButton: document.querySelector("#rankingNextPageButton"),
  rankingPageInfo: document.querySelector("#rankingPageInfo"),
  circuitHeroPeriod: document.querySelector("#circuitHeroPeriod"),
  circuitHeroCountdown: document.querySelector("#circuitHeroCountdown"),
  circuitRankValue: document.querySelector("#circuitRankValue"),
  circuitRankProjection: document.querySelector("#circuitRankProjection"),
  circuitPointsValue: document.querySelector("#circuitPointsValue"),
  circuitWeekPointsValue: document.querySelector("#circuitWeekPointsValue"),
  circuitAttemptsValue: document.querySelector("#circuitAttemptsValue"),
  circuitAttemptsCaption: document.querySelector("#circuitAttemptsCaption"),
  circuitPlayerAvatar: document.querySelector("#circuitPlayerAvatar"),
  circuitPlayerNickname: document.querySelector("#circuitPlayerNickname"),
  circuitPlayerRole: document.querySelector("#circuitPlayerRole"),
  circuitPlayerRank: document.querySelector("#circuitPlayerRank"),
  circuitPlayerProjection: document.querySelector("#circuitPlayerProjection"),
  circuitPlayerPoints: document.querySelector("#circuitPlayerPoints"),
  circuitPlayerWeekPoints: document.querySelector("#circuitPlayerWeekPoints"),
  circuitPlayerAttempts: document.querySelector("#circuitPlayerAttempts"),
  circuitProfileButton: document.querySelector("#circuitProfileButton"),
  profileContent: document.querySelector("#profileContent"),
  characterContent: document.querySelector("#characterContent"),
  backToProfileFromCharacterButton: document.querySelector("#backToProfileFromCharacterButton"),
  backToLobbyFromCharacterButton: document.querySelector("#backToLobbyFromCharacterButton"),
  weeklyCompetitionsList: document.querySelector("#weeklyCompetitionsList"),
  nicknameInput: document.querySelector("#nicknameInput"),
  coachChoiceButtons: document.querySelectorAll("[data-menu-coach]"),
  refreshLobbyButton: document.querySelector("#refreshLobbyButton"),
  createLobbyRoomButton: document.querySelector("#createLobbyRoomButton"),
  createFriendlyTournamentButton: document.querySelector("#createFriendlyTournamentButton"),
  onlineFormatSelect: document.querySelector("#onlineFormatSelect"),
  lobbyRooms: document.querySelector("#lobbyRooms"),
  homeNewsList: document.querySelector("#homeNewsList"),
  homeNewsArchiveAction: document.querySelector("#homeNewsArchiveAction"),
  openNewsArchiveButton: document.querySelector("#openNewsArchiveButton"),
  backFromNewsArchiveButton: document.querySelector("#backFromNewsArchiveButton"),
  newsArchiveList: document.querySelector("#newsArchiveList"),
  revealAiButton: document.querySelector("#revealAiButton"),
  exportLogsButton: document.querySelector("#exportLogsButton"),
  adminUltimateExportLogsButton: document.querySelector("#adminUltimateExportLogsButton"),
  ultimateExportLogsButton: document.querySelector("#ultimateExportLogsButton"),
  exportHumanMatchesButton: document.querySelector("#exportHumanMatchesButton"),
  soloModeButton: document.querySelector("#soloModeButton"),
  setModeButton: document.querySelector("#setModeButton"),
  matchTwoButton: document.querySelector("#matchTwoButton"),
  matchThreeButton: document.querySelector("#matchThreeButton"),
  onlineModeButton: document.querySelector("#onlineModeButton"),
  resultPanel: document.querySelector("#resultPanel"),
  tournamentPanel: document.querySelector("#tournamentPanel"),
  competitionDialogButton: document.querySelector("#competitionDialogButton"),
  competitionDialog: document.querySelector("#competitionDialog"),
  competitionDialogClose: document.querySelector("#competitionDialogClose"),
  tutorialOverlay: document.querySelector("#tutorialOverlay"),
  player1Summary: document.querySelector("#player1Summary"),
  player2Summary: document.querySelector("#player2Summary"),
  rallyPhaseLabel: document.querySelector("#rallyPhaseLabel"),
  rallyStatusBadge: document.querySelector("#rallyStatusBadge"),
  rallyScoreDeltaBadge: document.querySelector("#rallyScoreDeltaBadge"),
  rallyFullLogButton: document.querySelector("#rallyFullLogButton"),
  rallyState: document.querySelector("#rallyState"),
  effectNotice: document.querySelector("#effectNotice"),
  desktopMatchScore: document.querySelector("#desktopMatchScore"),
  centerPlayedCard: document.querySelector("#previousTurnCards"),
  player1Panel: document.querySelector("#player1Panel"),
  player2Panel: document.querySelector("#player2Panel"),
  log: document.querySelector("#log"),
};

function serverSyncParams() {
  const params = new URLSearchParams(window.location.search);
  // Une partie locale restaurable est prioritaire sur d'anciens paramÃ¨tres de salon.
  if (params.has(LOCAL_MOBILE_MATCH_QUERY)) return null;
  if (!params.has("room") || !params.has("token") || !params.has("seat")) return null;
  return {
    roomId: params.get("room"),
    token: params.get("token"),
    seat: Number(params.get("seat")),
    isHost: params.get("host") === "1",
    targetSets: params.has("targetSets") ? Number(params.get("targetSets")) : null,
  };
}

function friendlyTournamentParams() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("friendlyTournament") || !params.has("token")) return null;
  const participantId = params.get("participant");
  const spectatorId = params.get("spectator");
  if (!participantId && !spectatorId) return null;
  return {
    id: params.get("friendlyTournament"),
    participantId,
    spectatorId,
    isSpectator: Boolean(spectatorId),
    token: params.get("token"),
  };
}

function profileSelectedCharacterId() {
  return AUTH_STATE.user?.selectedCharacterId || "tennisHope";
}

function playableCharacterFromProfile() {
  const selected = profileSelectedCharacterId();
  if (selected !== "tennisHope") return normalizeCharacterId(selected, "coachJu");
  if (!MENU_STATE.espoirResolvedCharacterId) {
    MENU_STATE.espoirResolvedCharacterId = COACH_OPTIONS[Math.floor(Math.random() * COACH_OPTIONS.length)] || "coachJu";
  }
  return MENU_STATE.espoirResolvedCharacterId;
}

function selectedCharacterId() {
  return playableCharacterFromProfile();
}

function selectedPlayerName() {
  const value = els.nicknameInput?.value?.trim() || MENU_STATE.nickname || AUTH_STATE.user?.nickname || "";
  return value || characterNameFromId(selectedCharacterId());
}

function normalizeAiDifficulty(value) {
  if (value === "hardcore") return "legend";
  return AI_DIFFICULTIES.includes(value) ? value : "normal";
}

function tournamentDifficultyLabel(value = "normal") {
  return AI_DIFFICULTY_LABELS[normalizeAiDifficulty(value)];
}

function normalizeAiBonusLevel(value) {
  return AI_BONUS_LEVELS.includes(value) ? value : "none";
}

function aiBonusCount(value = "none") {
  return AI_BONUS_COUNTS[normalizeAiBonusLevel(value)] || 0;
}

function aiBonusLabel(value = "none") {
  return AI_BONUS_LABELS[normalizeAiBonusLevel(value)];
}

function tournamentBonusSummary() {
  return state.tournament?.difficulty === "circuit" && !state.tournament?.aiClubHouse
    ? "Bonus Circuit Pro"
    : `Bonus ${aiBonusLabel(state.tournament?.bonusLevel)}`;
}

function characterNameFromId(characterId) {
  return CHARACTERS[characterId]?.name ?? "Coach";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function normalizeCharacterId(characterId, fallback = "coachJu") {
  return CHARACTERS[characterId] ? characterId : fallback;
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
    worldRank: Number(remotePlayer?.worldRank || 0) || null,
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
    const worldRank = Number(remotePlayer?.worldRank || 0) || null;
    if (player.worldRank !== worldRank) {
      player.worldRank = worldRank;
      changed = true;
    }
  });
  return changed;
}

function normalizeUserRole(role) {
  return ROLE_LABELS[role] ? role : "free";
}

function currentUserRole() {
  return normalizeUserRole(AUTH_STATE.user?.role);
}

const PAGE_NAVIGATION_STATE = {
  profileReturn: "home",
  current: null,
  applyingHistory: false,
  confirmedPop: false,
  pendingPop: false,
};

function visibleScreenDestination() {
  if (!els.gameApp?.classList.contains("hidden") || !els.mobileGameApp?.classList.contains("hidden")) return "game";
  if (!els.friendlyLobbyScreen?.classList.contains("hidden")) return "online-room";
  if (!els.championshipLobbyScreen?.classList.contains("hidden")) return "solo";
  if (!els.aiClubHouseScreen?.classList.contains("hidden")) return "solo";
  if (!els.rankingScreen?.classList.contains("hidden")) return "ranking";
  if (!els.circuitInfoScreen?.classList.contains("hidden")) return "circuit-info";
  if (!els.soloInfoScreen?.classList.contains("hidden")) return "solo-info";
  if (!els.onlineInfoScreen?.classList.contains("hidden")) return "online-info";
  if (!els.academyInfoScreen?.classList.contains("hidden")) return "academy-info";
  if (!els.tutorialModulesScreen?.classList.contains("hidden")) return "tutorial-modules";
  if (!els.adminScreen?.classList.contains("hidden")) return "admin";
  if (!els.characterScreen?.classList.contains("hidden")) return "character";
  if (!els.profileScreen?.classList.contains("hidden")) return "profile";
  if (!els.lobbySectionScreen?.classList.contains("hidden")) {
    const panel = Array.from(els.lobbySectionPanels || []).find((candidate) => !candidate.classList.contains("hidden"));
    return panel?.dataset.lobbySectionPanel || "training";
  }
  return "home";
}

function navigateToScreenDestination(destination) {
  if (destination === "game" && state.players?.length) return showGameScreen();
  if (destination === "online-room") return showFriendlyLobbyScreen();
  if (destination === "solo") return showAiClubHouseScreen();
  if (destination === "ranking") return showRankingScreen();
  if (destination === "circuit-info") return showCircuitInfoScreen();
  if (destination === "solo-info") return showSoloInfoScreen();
  if (destination === "online-info") return showOnlineInfoScreen();
  if (destination === "academy-info") return showAcademyInfoScreen();
  if (destination === "tutorial-modules") return showTutorialModulesScreen();
  if (destination === "admin") return showAdminScreen();
  if (destination === "character") return showCharacterScreen();
  if (destination === "profile") return showProfileScreen();
  if (["training", "online", "circuit"].includes(destination)) return showLobbySection(destination);
  return showMenuScreen();
}

function hasActiveMatchToProtect() {
  return Boolean(state.players?.length && !state.gameOver && visibleScreenDestination() === "game");
}

async function confirmBrowserMatchExit() {
  return showEventConfirmDialog({
    kicker: "Partie en cours",
    title: "Quitter temporairement cette partie ?",
    message: SERVER_SYNC.enabled || FRIENDLY_TOURNAMENT.enabled
      ? "Une partie en ligne peut continuer en votre absence et entraÃ®ner un forfait."
      : "Votre progression est sauvegardÃ©e. Vous pourrez revenir sur cette page pour reprendre exactement oÃ¹ vous en Ã©tiez.",
    confirmLabel: "Quitter la page",
    cancelLabel: "Rester en jeu",
  });
}

function installBrowserNavigation() {
  const initialDestination = visibleScreenDestination();
  PAGE_NAVIGATION_STATE.current = initialDestination;
  window.history.replaceState(
    { ...(window.history.state || {}), tennisLightDestination: initialDestination },
    "",
    window.location.href,
  );

  const observer = new MutationObserver(() => {
    if (PAGE_NAVIGATION_STATE.applyingHistory) return;
    const destination = visibleScreenDestination();
    if (destination === PAGE_NAVIGATION_STATE.current) return;
    PAGE_NAVIGATION_STATE.current = destination;
    window.history.pushState(
      { ...(window.history.state || {}), tennisLightDestination: destination },
      "",
      window.location.href,
    );
  });
  document.querySelectorAll("main, [id$='Screen'], #gameApp, #mobileGameApp").forEach((screen) => {
    observer.observe(screen, { attributes: true, attributeFilter: ["class"] });
  });

  window.addEventListener("popstate", async (event) => {
    const destination = event.state?.tennisLightDestination;
    if (!destination) return;
    if (PAGE_NAVIGATION_STATE.pendingPop) return;
    if (hasActiveMatchToProtect() && !PAGE_NAVIGATION_STATE.confirmedPop) {
      PAGE_NAVIGATION_STATE.pendingPop = true;
      window.history.forward();
      const confirmed = await confirmBrowserMatchExit();
      PAGE_NAVIGATION_STATE.pendingPop = false;
      if (confirmed) {
        saveLocalMobileMatchSession();
        PAGE_NAVIGATION_STATE.confirmedPop = true;
        window.history.back();
      }
      return;
    }
    PAGE_NAVIGATION_STATE.confirmedPop = false;
    PAGE_NAVIGATION_STATE.applyingHistory = true;
    PAGE_NAVIGATION_STATE.current = destination;
    navigateToScreenDestination(destination);
    window.setTimeout(() => {
      PAGE_NAVIGATION_STATE.applyingHistory = false;
      PAGE_NAVIGATION_STATE.current = visibleScreenDestination();
    }, 0);
  });

  window.addEventListener("beforeunload", (event) => {
    if (!hasActiveMatchToProtect()) return;
    saveLocalMobileMatchSession();
    event.preventDefault();
    event.returnValue = "";
  });
}

function updateGlobalPlayerDock() {
  const user = AUTH_STATE.user;
  const destination = visibleScreenDestination();
  const gameActive = destination === "game";
  const hidden = !user || destination === "home";
  const activeScreen = destination === "game" ? els.gameApp : [els.lobbySectionScreen, els.adminScreen, els.rankingScreen, els.circuitInfoScreen, els.soloInfoScreen, els.academyInfoScreen, els.tutorialModulesScreen, els.profileScreen, els.characterScreen, els.friendlyLobbyScreen, els.aiClubHouseScreen, els.championshipLobbyScreen]
    .find((screen) => screen && !screen.classList.contains("hidden"));
  const dockHost = activeScreen?.querySelector(".lobby-section-header, .mode-clubhouse-topbar, .topbar") || null;
  if (gameActive && els.desktopGameMenu && els.globalPlayerDock) {
    if (els.globalPlayerDock.parentElement !== els.desktopGameMenu || els.globalPlayerDock !== els.desktopGameMenu.firstElementChild) {
      els.desktopGameMenu.insertBefore(els.globalPlayerDock, els.desktopGameMenu.firstElementChild);
    }
  } else if (dockHost && els.globalPlayerDock) {
    const actions = dockHost.querySelector(".page-return-actions, .top-actions")
      || Array.from(dockHost.children).find((child) => child.matches("button:not(.brand-home-button)"));
    if (els.globalPlayerDock.parentElement !== dockHost || els.globalPlayerDock.nextElementSibling !== actions) {
      if (actions) dockHost.insertBefore(els.globalPlayerDock, actions);
      else dockHost.append(els.globalPlayerDock);
    }
  }
  els.globalPlayerDock?.classList.toggle("docked", Boolean(dockHost));
  els.globalPlayerDock?.classList.toggle("hidden", hidden);
  els.globalPlayerDock?.classList.toggle("read-only", gameActive);
  if (els.globalPlayerNickname) els.globalPlayerNickname.textContent = user?.nickname || "Joueur";
  if (els.globalPlayerRole) els.globalPlayerRole.textContent = gameActive ? "Profil consultable aprÃ¨s la partie" : (ROLE_LABELS[currentUserRole()] || "Profil joueur");
  if (els.globalPlayerAvatar) {
    const characterId = profileSelectedCharacterId();
    els.globalPlayerAvatar.src = PROFILE_CHARACTER_IMAGES[characterId] || PROFILE_CHARACTER_IMAGES.coachJu;
    els.globalPlayerAvatar.alt = characterNameFromId(characterId);
  }
  if (els.globalPlayerProfileButton) {
    els.globalPlayerProfileButton.disabled = !user || gameActive;
    els.globalPlayerProfileButton.setAttribute("aria-disabled", String(!user || gameActive));
    els.globalPlayerProfileButton.title = gameActive ? "Le profil est indisponible pendant une partie" : "Ouvrir le profil joueur";
  }
}

function returnFromProfile() {
  const destination = PAGE_NAVIGATION_STATE.profileReturn;
  if (destination === "ranking") return showRankingScreen();
  if (destination === "circuit-info") return showCircuitInfoScreen();
  if (destination === "solo-info") return showSoloInfoScreen();
  if (destination === "online-info") return showOnlineInfoScreen();
  if (destination === "academy-info") return showAcademyInfoScreen();
  if (destination === "tutorial-modules") return showTutorialModulesScreen();
  if (destination === "online-room") return showFriendlyLobbyScreen();
  if (destination === "admin") return showAdminScreen();
  if (destination === "circuit") return showLobbySection("circuit");
  if (destination === "online") return showLobbySection("online");
  if (destination === "solo") return showAiClubHouseScreen();
  if (destination === "training") return showLobbySection("training");
  return showMenuScreen();
}

function canAccessProFeatures() {
  return ["pro", "pro_plus", "admin"].includes(currentUserRole());
}

function canAccessAdminFeatures() {
  return currentUserRole() === "admin";
}

function canAccessUltimateFeatures() {
  return ["pro_plus", "admin"].includes(currentUserRole());
}

const ADMIN_DESKTOP_VIEW_KEY = "tennisLightAdminDesktopView";
const ADMIN_GAME_VIEW_KEY = "tennisLightAdminGameView";

function adminGameViewPreference() {
  if (!canAccessAdminFeatures()) return "auto";
  const preference = localStorage.getItem(ADMIN_GAME_VIEW_KEY);
  if (["mobile", "desktop"].includes(preference)) return preference;
  if (localStorage.getItem(ADMIN_DESKTOP_VIEW_KEY) === "true") return "desktop";
  return window.matchMedia?.("(max-width: 860px)").matches ? "mobile" : "desktop";
}

function adminDesktopViewForced() {
  return adminGameViewPreference() === "desktop";
}

function syncAdminDesktopViewPreference({ applyView = false } = {}) {
  const preference = adminGameViewPreference();
  document.body.classList.toggle("admin-forced-desktop-view", preference === "desktop");
  document.body.classList.toggle("admin-forced-mobile-view", preference === "mobile");
  if (els.adminGameViewToggle) els.adminGameViewToggle.checked = preference === "desktop";
  if (applyView) window.TennisLightMobileGame?.setAdminViewPreference(preference);
}

function canAccessAllCharacters() {
  return ["pro_plus", "admin"].includes(currentUserRole());
}

function profileCharacterOptionsForCurrentUser() {
  const unlocked = AUTH_STATE.user?.unlockedCharacters;
  if (Array.isArray(unlocked) && unlocked.length) {
    const effectiveUnlocked = new Set(unlocked);
    if (canAccessProFeatures() && Date.now() >= Date.parse("2026-07-21T18:00:00+02:00")) effectiveUnlocked.add("rosaBenavente");
    if (canAccessProFeatures() && Date.now() >= Date.parse("2026-07-22T08:00:00+02:00")) effectiveUnlocked.add("coachHans");
    return FULL_PROFILE_CHARACTER_OPTIONS.filter((characterId) => effectiveUnlocked.has(characterId));
  }
  const isAvailable = (id) => (
    (id !== "rosaBenavente" || Date.now() >= Date.parse("2026-07-21T18:00:00+02:00"))
    && (id !== "coachHans" || Date.now() >= Date.parse("2026-07-22T08:00:00+02:00"))
  );
  if (canAccessAllCharacters()) return FULL_PROFILE_CHARACTER_OPTIONS.filter(isAvailable);
  return currentUserRole() === "pro" ? PRO_PROFILE_CHARACTER_OPTIONS.filter(isAvailable) : PROFILE_CHARACTER_OPTIONS.filter((id) => id !== "coachHans");
}

function updateAccessControls() {
  const hasProAccess = canAccessProFeatures();
  const hasAdminAccess = canAccessAdminFeatures();
  const role = currentUserRole();
  document.querySelectorAll("[data-required-role='pro']").forEach((section) => {
    section.classList.toggle("locked", !hasProAccess);
    if (section.matches("button, select")) section.disabled = !hasProAccess;
    if (section.classList.contains("lobby-mode-card")) {
      section.setAttribute("aria-disabled", String(!hasProAccess));
      section.removeAttribute("title");
    }
    section.querySelectorAll("button, select").forEach((control) => {
      control.disabled = !hasProAccess;
    });
    section.querySelectorAll(".access-note").forEach((note) => {
      note.classList.toggle("hidden", hasProAccess || !AUTH_STATE.user);
    });
  });
  document.querySelectorAll("[data-required-role='admin']").forEach((control) => {
    control.classList.toggle("hidden", !hasAdminAccess);
    if ("disabled" in control) control.disabled = !hasAdminAccess;
  });
  document.querySelectorAll("[data-required-role='pro_plus']").forEach((control) => {
    const hasUltimateAccess = canAccessUltimateFeatures();
    control.classList.toggle("hidden", !hasUltimateAccess);
    if ("disabled" in control) control.disabled = !hasUltimateAccess;
  });
  const hasInlineAdminContent = Boolean(els.adminPanel?.childElementCount || els.adminPanel?.textContent?.trim());
  els.adminPanel?.classList.toggle("hidden", !hasAdminAccess || !hasInlineAdminContent);
  els.proCodePanel?.classList.toggle("hidden", !AUTH_STATE.user || role !== "free");
  if (role !== "free" && els.proCodeStatus) els.proCodeStatus.textContent = "";
  if (!hasAdminAccess) {
    setAdminGameToolsOpen(false);
    AUTH_STATE.adminUsers = [];
    AUTH_STATE.adminProCodes = [];
    if (els.adminUsersTable) els.adminUsersTable.innerHTML = "";
    if (els.adminProCodesList) els.adminProCodesList.innerHTML = "";
  }
  syncAdminDesktopViewPreference({ applyView: true });
}

function renderAuthState(message = "") {
  if (!els.authStatus) return;
  const user = AUTH_STATE.user;
  const roleLabel = ROLE_LABELS[currentUserRole()] || "FREE";
  els.authStatus.textContent = message || (user ? `ConnectÃ© : ${user.nickname} Â· ${roleLabel}` : "Non connectÃ©");
  els.authStatus.classList.toggle("connected", Boolean(user));
  els.authForm?.classList.toggle("hidden", Boolean(user));
  els.logoutButton?.classList.toggle("hidden", !user);
  els.profileButton?.classList.toggle("hidden", !user);
  els.proCodePanel?.classList.toggle("hidden", !user || currentUserRole() !== "free");
  els.adminNextWeekButton?.classList.toggle("hidden", !canAccessAdminFeatures());
  if (els.lobbyHeaderNickname) els.lobbyHeaderNickname.textContent = user?.nickname || "Se connecter";
  if (els.lobbyHeaderRole) els.lobbyHeaderRole.textContent = user ? roleLabel : "InvitÃ©";
  updateLobbyProfileAvatar();
  updateGlobalPlayerDock();
  renderCircuitDashboard();
  if (els.authNicknameInput && !els.authNicknameInput.value && MENU_STATE.nickname) {
    els.authNicknameInput.value = MENU_STATE.nickname;
  }
}

async function authRequest(path, payload = null, requestOptions = {}) {
  const options = {
    ...requestOptions,
    headers: {
      ...(requestOptions.headers || {}),
    },
  };
  if (payload) {
    options.method = options.method || "POST";
    options.headers["content-type"] = "application/json";
    options.body = JSON.stringify(payload);
  }
  const response = await fetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Action impossible pour le moment.");
  return data;
}

function authenticatedUserId(user = AUTH_STATE.user) {
  return user?.id == null ? null : String(user.id);
}

function clearAuthenticatedCircuitCaches() {
  AUTH_STATE.profile = null;
  AUTH_STATE.profileUserId = null;
  AUTH_STATE.gameplayRanking = null;
  AUTH_STATE.gameplayRankingUserId = null;
  AUTH_STATE.ranking = null;
  AUTH_STATE.rankingUserId = null;
  AUTH_STATE.lobbyRanking = null;
  AUTH_STATE.lobbyRankingUserId = null;
  AUTH_STATE.competitions = null;
  AUTH_STATE.competitionsUserId = null;
  AUTH_STATE.rankingPage = 1;
}

function refreshAuthenticatedCircuitData(userId) {
  if (!userId || authenticatedUserId() !== userId) return;
  if (!canAccessProFeatures()) return;
  loadRanking(1);
}

function applyAuthenticatedUser(user) {
  const previousUserId = authenticatedUserId();
  const nextUserId = authenticatedUserId(user);
  const accountChanged = previousUserId !== nextUserId;
  if (accountChanged) clearAuthenticatedCircuitCaches();
  AUTH_STATE.user = user || null;
  if (user?.nickname) {
    MENU_STATE.nickname = user.nickname;
    localStorage.setItem("tennisLightNickname", MENU_STATE.nickname);
    if (els.nicknameInput) els.nicknameInput.value = MENU_STATE.nickname;
  }
  MENU_STATE.espoirResolvedCharacterId = null;
  renderAuthState();
  updateAccessControls();
  if (AUTH_STATE.user) {
    window.setTimeout(uploadPendingHumanMatchLogs, 250);
    if (accountChanged) refreshAuthenticatedCircuitData(nextUserId);
  }
  if (accountChanged) window.setTimeout(synchronizeTutorialProgress, 0);
}

function formatGameNewsDate(value) {
  const date = new Date(`${value || ""}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Date Ã  venir";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function latestGameNews() {
  return availableGameNews().sort((left, right) => String(right.publishedAt).localeCompare(String(left.publishedAt)))[0] || null;
}

function availableGameNews() {
  return GAME_NEWS.filter((news) => !news.availableAt || Date.now() >= Date.parse(news.availableAt));
}

function gameNewsImage(news) {
  if (news?.image) return news.image;
  const characterId = news?.characterId || "milanVerhaegen";
  return PROFILE_CHARACTER_IMAGES[characterId] || CHARACTER_IMAGES[characterId]?.[0];
}

function renderHomeNewsSection() {
  if (!els.homeNewsList) return;
  const allNews = availableGameNews()
    .sort((left, right) => String(right.publishedAt).localeCompare(String(left.publishedAt)));
  const newsItems = allNews.slice(0, 5);
  els.homeNewsArchiveAction?.classList.toggle("hidden", allNews.length < 6);
  if (!newsItems.length) {
    els.homeNewsList.innerHTML = '<div class="home-news-empty">Les prochaines actualitÃ©s de lâ€™Academy arrivent bientÃ´t.</div>';
    return;
  }
  els.homeNewsList.innerHTML = newsItems.map((news, index) => {
    const characterId = news.characterId || "milanVerhaegen";
    const image = gameNewsImage(news);
    return `
      <article class="home-news-card ${index === 0 ? "home-news-featured" : ""}">
        <button class="home-news-visual" type="button" data-read-game-news="${escapeHtml(news.id)}" aria-label="Lire : ${escapeHtml(news.title)}">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(news.image ? news.title : `Portrait de ${characterNameFromId(characterId)}`)}" />
        </button>
        <div class="home-news-copy">
          <time datetime="${escapeHtml(news.publishedAt)}">${escapeHtml(formatGameNewsDate(news.publishedAt))}</time>
          <button class="home-news-title" type="button" data-read-game-news="${escapeHtml(news.id)}">${escapeHtml(news.title)}</button>
          <button class="home-news-read" type="button" data-read-game-news="${escapeHtml(news.id)}">Lire l'actualitÃ© <span aria-hidden="true">â†’</span></button>
        </div>
      </article>
    `;
  }).join("");
  els.homeNewsList.querySelectorAll("[data-read-game-news]").forEach((button) => {
    button.addEventListener("click", () => showGameNewsDialog(button.dataset.readGameNews));
  });
}

function renderNewsArchive() {
  if (!els.newsArchiveList) return;
  const newsItems = availableGameNews()
    .sort((left, right) => String(right.publishedAt).localeCompare(String(left.publishedAt)));
  els.newsArchiveList.innerHTML = newsItems.map((news, index) => {
    const characterId = news.characterId || "milanVerhaegen";
    const image = gameNewsImage(news);
    return `
      <article class="news-archive-card ${index === 0 ? "news-archive-featured" : "news-archive-summary"}">
        ${index === 0 ? `<button class="news-archive-visual" type="button" data-read-game-news="${escapeHtml(news.id)}" aria-label="Lire : ${escapeHtml(news.title)}">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(news.image ? news.title : `Portrait de ${characterNameFromId(characterId)}`)}" />
        </button>` : ""}
        <div class="news-archive-copy">
          <time datetime="${escapeHtml(news.publishedAt)}">${escapeHtml(formatGameNewsDate(news.publishedAt))}</time>
          <button class="news-archive-title" type="button" data-read-game-news="${escapeHtml(news.id)}">${escapeHtml(news.title)}</button>
          ${index === 0 ? `<p>${escapeHtml(news.message)}</p>` : ""}
          <button class="home-news-read" type="button" data-read-game-news="${escapeHtml(news.id)}">Lire lâ€™actualitÃ© <span aria-hidden="true">â†’</span></button>
        </div>
      </article>
    `;
  }).join("");
  els.newsArchiveList.querySelectorAll("[data-read-game-news]").forEach((button) => {
    button.addEventListener("click", () => showGameNewsDialog(button.dataset.readGameNews));
  });
}

function showNewsArchiveScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.newsArchiveScreen?.classList.remove("hidden");
  renderNewsArchive();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showGameNewsDialog(newsId) {
  const news = availableGameNews().find((item) => item.id === newsId) || latestGameNews();
  if (!news || document.querySelector(".pro-news-backdrop")) return;
  const characterId = news.characterId || "milanVerhaegen";
  const image = gameNewsImage(news);
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop pro-news-backdrop";
  backdrop.innerHTML = `
    <article class="modal pro-news-modal" role="dialog" aria-modal="true" aria-labelledby="proNewsTitle" aria-describedby="proNewsMessage">
      <button class="pro-news-close" type="button" data-close-pro-news aria-label="Fermer lâ€™actualitÃ©">Ã—</button>
      <div class="pro-news-card-frame">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(news.image ? news.title : `Carte de ${characterNameFromId(characterId)}`)}" />
      </div>
      <div class="pro-news-copy">
        <p class="label">DERNIÃˆRES ACTU Â· ${escapeHtml(formatGameNewsDate(news.publishedAt))}</p>
        <h2 id="proNewsTitle">${escapeHtml(news.title)}</h2>
        <p id="proNewsMessage">${escapeHtml(news.message)}</p>
      </div>
    </article>
  `;
  const close = () => {
    document.removeEventListener("keydown", onKeyDown);
    backdrop.remove();
  };
  const onKeyDown = (event) => {
    if (event.key === "Escape") close();
  };
  backdrop.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-pro-news]") || !event.target.closest(".pro-news-modal")) close();
  });
  document.addEventListener("keydown", onKeyDown);
  document.body.append(backdrop);
  backdrop.querySelector("[data-close-pro-news]")?.focus();
}

async function loadAuthState() {
  try {
    const data = await authRequest("/api/auth/me");
    applyAuthenticatedUser(data.user);
  } catch (error) {
    renderAuthState("Comptes indisponibles sur cette version locale.");
  }
}

async function registerAccount() {
  const email = els.authEmailInput?.value?.trim() || "";
  const password = els.authPasswordInput?.value || "";
  renderAuthState("CrÃ©ation du compte...");
  try {
    const data = await authRequest("/api/auth/register", { email, password });
    applyAuthenticatedUser(data.user);
    if (els.authPasswordInput) els.authPasswordInput.value = "";
  } catch (error) {
    renderAuthState(error.message);
  }
}

async function requestPasswordReset() {
  const email = window.prompt("Adresse email du compte Ã  rÃ©cupÃ©rer :");
  if (!email) return;
  renderAuthState("Si ce compte existe, un lien de rÃ©initialisation va Ãªtre envoyÃ©.");
  try {
    await authRequest("/api/auth/password-reset/request", { email });
    renderAuthState("Si ce compte existe, un lien de rÃ©initialisation va Ãªtre envoyÃ©.");
  } catch (error) {
    renderAuthState("Si ce compte existe, un lien de rÃ©initialisation va Ãªtre envoyÃ©.");
  }
}

function resetTokenFromUrl() {
  return new URLSearchParams(window.location.search).get("reset") || "";
}

async function confirmPasswordReset() {
  const token = resetTokenFromUrl();
  const password = els.resetPasswordInput?.value || "";
  if (!token) return;
  if (els.resetPasswordStatus) els.resetPasswordStatus.textContent = "Mise Ã  jour...";
  try {
    await authRequest("/api/auth/password-reset/confirm", { token, password });
    if (els.resetPasswordStatus) els.resetPasswordStatus.textContent = "Mot de passe modifiÃ©. Retour Ã  la connexion.";
    window.history.replaceState({}, "", window.location.pathname);
    setTimeout(showMenuScreen, 800);
  } catch (error) {
    if (els.resetPasswordStatus) els.resetPasswordStatus.textContent = error.message;
  }
}

async function loginAccount() {
  const email = els.authEmailInput?.value?.trim() || "";
  const password = els.authPasswordInput?.value || "";
  renderAuthState("Connexion...");
  try {
    const data = await authRequest("/api/auth/login", { email, password });
    applyAuthenticatedUser(data.user);
    if (els.authPasswordInput) els.authPasswordInput.value = "";
  } catch (error) {
    renderAuthState(error.message);
  }
}

async function logoutAccount() {
  renderAuthState("DÃ©connexion...");
  try {
    await authRequest("/api/auth/logout", {});
  } catch (error) {
    // MÃªme si le serveur ne rÃ©pond pas, on libÃ¨re l'interface locale.
  }
  applyAuthenticatedUser(null);
}

async function redeemProCode() {
  if (!AUTH_STATE.user || currentUserRole() !== "free") return;
  const code = (els.proCodeInput?.value || "").trim().toUpperCase();
  if (!code) {
    if (els.proCodeStatus) els.proCodeStatus.textContent = "Renseigne ton code Pro.";
    return;
  }
  if (els.proCodeStatus) els.proCodeStatus.textContent = "VÃ©rification du code...";
  try {
    const data = await authRequest("/api/auth/redeem-pro-code", { code });
    if (els.proCodeInput) els.proCodeInput.value = "";
    if (els.proCodeStatus) els.proCodeStatus.textContent = "Compte Pro activÃ©.";
    applyAuthenticatedUser(data.user);
    await loadRanking();
    await loadCompetitions();
  } catch (error) {
    if (els.proCodeStatus) els.proCodeStatus.textContent = error.message;
  }
}

function renderAdminUsers() {
  if (!els.adminUsersTable) return;
  if (!AUTH_STATE.adminUsers.length) {
    els.adminUsersTable.innerHTML = '<div class="admin-empty">Aucun utilisateur Ã  afficher.</div>';
    return;
  }
  els.adminUsersTable.innerHTML = `
    <div class="admin-table-head">
      <span>ID</span>
      <span>Nom</span>
      <span>Mail</span>
      <span>RÃ´le</span>
      <span>Code</span>
      <span>Saison</span>
      <span>Classement</span>
      <span>Action</span>
    </div>
    ${AUTH_STATE.adminUsers.map((user) => {
      const role = normalizeUserRole(user.role);
      const isProtectedAdmin = role === "admin" || String(user.email || "").toLowerCase() === "julien.castagnoli@mediality.fr";
      return `
        <article class="admin-table-row">
          <strong>${escapeHtml(user.accountNumber || "-")}</strong>
          <span>${escapeHtml(user.nickname || "Sans pseudo")}</span>
          <span>${escapeHtml(user.email || "")}</span>
          <select data-admin-role="${escapeHtml(user.id)}" aria-label="Niveau de ${escapeHtml(user.nickname || user.email)}" ${isProtectedAdmin ? "disabled" : ""}>
            <option value="free" ${role === "free" ? "selected" : ""}>FREE</option>
            <option value="pro" ${role === "pro" ? "selected" : ""}>PRO</option>
            <option value="pro_plus" ${role === "pro_plus" ? "selected" : ""}>PRO+</option>
            ${role === "admin" ? '<option value="admin" selected>ADMIN</option>' : ""}
          </select>
          <span>${escapeHtml(user.proCode || "-")}</span>
          <span>${Number(user.scoreTotal || 0)} pts</span>
          <button class="small-button" type="button" data-admin-profile="${escapeHtml(user.id)}">Modifier</button>
          <button class="small-button admin-delete-button" type="button" data-admin-delete="${escapeHtml(user.id)}" ${isProtectedAdmin ? "disabled" : ""}>Supprimer</button>
        </article>
      `;
    }).join("")}
  `;
  els.adminUsersTable.querySelectorAll("[data-admin-role]").forEach((select) => {
    select.addEventListener("change", () => updateUserRole(select.dataset.adminRole, select.value));
  });
  els.adminUsersTable.querySelectorAll("[data-admin-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteAdminUser(button.dataset.adminDelete));
  });
  els.adminUsersTable.querySelectorAll("[data-admin-profile]").forEach((button) => {
    button.addEventListener("click", () => showProfileScreen(button.dataset.adminProfile));
  });
}

function renderAdminProCodes() {
  if (!els.adminProCodesList) return;
  const codes = AUTH_STATE.adminProCodes || [];
  if (!codes.length) {
    els.adminProCodesList.innerHTML = '<div class="admin-empty">Aucun code Pro disponible.</div>';
    return;
  }
  els.adminProCodesList.innerHTML = `
    <div class="admin-code-head"><span>Code</span><span>Ã‰tat du code</span><span>Compte</span></div>
    ${codes.map((item) => `
      <div class="admin-code-row ${item.assignedTo ? "used" : ""}">
        <strong>${escapeHtml(item.code)}</strong>
        <select data-admin-code-status="${escapeHtml(item.code)}" aria-label="Ã‰tat du code ${escapeHtml(item.code)}" ${item.assignedTo ? "disabled" : ""}>
          <option value="non" ${item.adminStatus !== "attribue" ? "selected" : ""}>NON</option>
          <option value="attribue" ${item.adminStatus === "attribue" ? "selected" : ""}>ATTRIBUÃ‰</option>
        </select>
        <span>${escapeHtml(item.assignedTo?.nickname || item.assignedTo?.email || "-")}</span>
      </div>
    `).join("")}
  `;
  els.adminProCodesList.querySelectorAll("[data-admin-code-status]").forEach((select) => {
    select.addEventListener("change", () => updateAdminProCodeStatus(select.dataset.adminCodeStatus, select.value, select));
  });
}

async function updateAdminProCodeStatus(code, status, select) {
  if (!canAccessAdminFeatures() || !code) return;
  select.disabled = true;
  try {
    const data = await authRequest(`/api/admin/pro-codes/${encodeURIComponent(code)}/status`, { status });
    AUTH_STATE.adminProCodes = data.codes || [];
    renderAdminProCodes();
  } catch (error) {
    select.disabled = false;
    await loadAdminProCodes();
    if (els.adminProCodesList) {
      els.adminProCodesList.insertAdjacentHTML("afterbegin", `<div class="admin-empty">${escapeHtml(error.message)}</div>`);
    }
  }
}

function updateAdminPagination() {
  if (els.adminPageInfo) els.adminPageInfo.textContent = `Page ${AUTH_STATE.adminPage} / ${AUTH_STATE.adminTotalPages}`;
  if (els.adminPrevPageButton) els.adminPrevPageButton.disabled = AUTH_STATE.adminPage <= 1;
  if (els.adminNextPageButton) els.adminNextPageButton.disabled = AUTH_STATE.adminPage >= AUTH_STATE.adminTotalPages;
}

async function loadAdminUsers(page = AUTH_STATE.adminPage) {
  if (!canAccessAdminFeatures()) return;
  AUTH_STATE.adminPage = Math.max(1, page);
  if (els.adminUsersTable) els.adminUsersTable.innerHTML = '<div class="admin-empty">Chargement des comptes...</div>';
  try {
    const data = await authRequest(`/api/admin/users?page=${AUTH_STATE.adminPage}`);
    AUTH_STATE.adminUsers = data.users || [];
    AUTH_STATE.adminPage = data.page || AUTH_STATE.adminPage;
    AUTH_STATE.adminTotalPages = data.totalPages || 1;
    renderAdminUsers();
    updateAdminPagination();
  } catch (error) {
    if (els.adminUsersTable) els.adminUsersTable.innerHTML = `<div class="admin-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function loadAdminProCodes() {
  if (!canAccessAdminFeatures()) return;
  if (els.adminProCodesList) els.adminProCodesList.innerHTML = '<div class="admin-empty">Chargement des codes...</div>';
  try {
    const data = await authRequest("/api/admin/pro-codes");
    AUTH_STATE.adminProCodes = data.codes || [];
    renderAdminProCodes();
  } catch (error) {
    if (els.adminProCodesList) els.adminProCodesList.innerHTML = `<div class="admin-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function generateProCodes() {
  if (!canAccessAdminFeatures()) return;
  if (els.adminProCodesList) els.adminProCodesList.innerHTML = '<div class="admin-empty">GÃ©nÃ©ration des codes...</div>';
  try {
    const data = await authRequest("/api/admin/pro-codes/generate", { count: 5 });
    AUTH_STATE.adminProCodes = data.codes || [];
    renderAdminProCodes();
  } catch (error) {
    if (els.adminProCodesList) els.adminProCodesList.innerHTML = `<div class="admin-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function updateUserRole(userId, role) {
  if (!canAccessAdminFeatures() || !userId) return;
  try {
    const data = await authRequest(`/api/admin/users/${encodeURIComponent(userId)}/role`, { role });
    AUTH_STATE.adminUsers = AUTH_STATE.adminUsers.map((user) => user.id === userId ? data.user : user);
    renderAdminUsers();
    if (AUTH_STATE.user?.id === userId) applyAuthenticatedUser(data.user);
  } catch (error) {
    if (els.adminUsersTable) els.adminUsersTable.innerHTML = `<div class="admin-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function deleteAdminUser(userId) {
  if (!canAccessAdminFeatures() || !userId) return;
  const user = AUTH_STATE.adminUsers.find((item) => item.id === userId);
  const label = user?.nickname || user?.email || "ce compte";
  if (!window.confirm(`Supprimer dÃ©finitivement ${label} ?`)) return;
  try {
    await authRequest(`/api/admin/users/${encodeURIComponent(userId)}`, null, { method: "DELETE" });
    AUTH_STATE.adminUsers = AUTH_STATE.adminUsers.filter((item) => item.id !== userId);
    renderAdminUsers();
    updateAdminPagination();
  } catch (error) {
    if (els.adminUsersTable) els.adminUsersTable.insertAdjacentHTML("afterbegin", `<div class="admin-empty">${escapeHtml(error.message)}</div>`);
  }
}

async function addManualSeasonPoints(userId) {
  if (!canAccessAdminFeatures() || !userId) return;
  const input = Array.from(els.adminUsersTable?.querySelectorAll("[data-admin-points-input]") || [])
    .find((element) => element.dataset.adminPointsInput === userId);
  const points = Math.max(0, Math.round(Number(input?.value || 0)));
  if (!points) {
    input?.focus();
    return;
  }
  try {
    const data = await authRequest(`/api/admin/users/${encodeURIComponent(userId)}/season-points`, { points });
    AUTH_STATE.adminUsers = AUTH_STATE.adminUsers.map((user) => user.id === userId ? data.user : user);
    renderAdminUsers();
    await loadRanking();
  } catch (error) {
    if (els.adminUsersTable) els.adminUsersTable.insertAdjacentHTML("afterbegin", `<div class="admin-empty">${escapeHtml(error.message)}</div>`);
  }
}

function rankingMarkup(ranking = AUTH_STATE.ranking) {
  const top = ranking?.top || [];
  const current = ranking?.currentUserRank || null;
  if (!top.length) {
    return '<div class="lobby-empty">Aucun classement disponible pour le moment.</div>';
  }
  const profileName = (row) => {
    if (row.is_ai || String(row.id || "").startsWith("ai:")) {
      return canAccessAdminFeatures()
        ? `<button class="ranking-name-button ranking-ai-name" type="button" data-profile-user="${escapeHtml(row.id || "")}">${escapeHtml(row.nickname)}</button>`
        : `<span class="ranking-ai-name">${escapeHtml(row.nickname)}</span>`;
    }
    return `
      <button class="ranking-name-button" type="button" data-profile-user="${escapeHtml(row.id || "")}">
        ${escapeHtml(row.nickname)}
      </button>
    `;
  };
  const rankCell = (row) => {
    const rank = Number(row.points_rank || row.rank || 0);
    const projectedRank = Number(row.projected_rank || rank || 0);
    const trendClass = projectedRank < rank
      ? " ranking-projection-up"
      : projectedRank > rank
        ? " ranking-projection-down"
        : " ranking-projection-neutral";
    const projection = projectedRank ? `<small class="ranking-projection${trendClass}" title="Projection pour la prochaine semaine">(${projectedRank})</small>` : "";
    return `<span class="ranking-position"><strong>${rank}</strong>${projection}</span>`;
  };
  const rows = top.map((row, index) => `
    <div class="ranking-row">
      ${rankCell({ ...row, rank: Number(row.rank || index + 1) })}
      <strong>${profileName(row)}</strong>
      <span>${Number(row.score_ref || 0)}</span>
      <span><strong>${Number(row.score_week || 0)}</strong></span>
      <span>${Number(row.score_total || 0)}</span>
    </div>
  `).join("");
  const currentRow = current && !top.some((row) => row.id === current.id)
    ? `<div class="ranking-current-label">Votre classement</div><div class="ranking-row current-user">${rankCell(current)}<strong>${profileName(current)}</strong><span>${Number(current.score_ref || 0)}</span><span><strong>${Number(current.score_week || 0)}</strong></span><span>${Number(current.score_total || 0)}</span></div>`
    : "";
  return `
    <div class="ranking-head"><span>#</span><span>Nom</span><span class="ranking-points-heading">Points <small>(S-4)</small></span><span>Semaine</span><span>Saison</span></div>
    ${rows}
    ${currentRow}
    <div class="ranking-meta">Saison ${Number(ranking?.season || 1)} Â· Semaine ${Number(ranking?.week || 1)}</div>
  `;
}

function attachProfileLinks(container) {
  container?.querySelectorAll("[data-profile-user]").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.dataset.profileUser;
      if (!userId || (userId.startsWith("ai:") && !canAccessAdminFeatures())) return;
      showProfileScreen(userId);
    });
  });
  container?.querySelectorAll("[data-admin-ai-profile]").forEach((button) => {
    button.addEventListener("click", () => openAdminAiPlayerSheet(button));
  });
}

function openAdminAiPlayerSheet(button) {
  if (!canAccessAdminFeatures()) return;
  document.querySelector(".admin-ai-player-backdrop")?.remove();
  const characterId = button.dataset.adminAiProfile;
  const name = button.dataset.adminAiName || characterId;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop admin-ai-player-backdrop";
  backdrop.innerHTML = `
    <section class="effect-help-dialog" role="dialog" aria-modal="true" aria-labelledby="adminAiPlayerTitle">
      <div><p class="label">Fiche joueur IA</p><h2 id="adminAiPlayerTitle">${escapeHtml(name)}</h2>
        <p>Seuls les points de la semaine actuelle peuvent Ãªtre modifiÃ©s.</p>
        <label class="menu-field">Points<input type="number" min="0" max="100000" step="1" value="${Math.max(0, Number(button.dataset.adminAiPoints || 0))}" data-admin-ai-points-input /></label>
      </div>
      <div class="admin-inline-actions"><button class="small-button" type="button" data-close-admin-ai>Annuler</button><button class="primary-button" type="button" data-save-admin-ai>Enregistrer</button></div>
    </section>`;
  const close = () => backdrop.remove();
  backdrop.querySelector("[data-close-admin-ai]")?.addEventListener("click", close);
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
  backdrop.querySelector("[data-save-admin-ai]")?.addEventListener("click", async () => {
    const input = backdrop.querySelector("[data-admin-ai-points-input]");
    const points = Math.round(Number(input?.value));
    if (!Number.isFinite(points) || points < 0) return input?.focus();
    try {
      await authRequest(`/api/admin/ai-players/${encodeURIComponent(characterId)}/points`, { points });
      close();
      await loadRanking(AUTH_STATE.rankingPage || 1);
    } catch (error) {
      input?.setCustomValidity(error.message);
      input?.reportValidity();
    }
  });
  document.body.appendChild(backdrop);
  backdrop.querySelector("input")?.focus();
}

function renderRanking() {
  if (els.rankingList) {
    els.rankingList.innerHTML = rankingMarkup(AUTH_STATE.lobbyRanking);
    attachProfileLinks(els.rankingList);
  }
  if (els.rankingFullList) {
    els.rankingFullList.innerHTML = rankingMarkup(AUTH_STATE.ranking);
    attachProfileLinks(els.rankingFullList);
  }
  if (els.adminRankingList) {
    els.adminRankingList.innerHTML = rankingMarkup(AUTH_STATE.ranking);
    attachProfileLinks(els.adminRankingList);
  }
  const totalPages = Number(AUTH_STATE.ranking?.totalPages || 1);
  const currentPage = Number(AUTH_STATE.ranking?.page || AUTH_STATE.rankingPage || 1);
  if (els.rankingPageInfo) els.rankingPageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
  if (els.rankingPrevPageButton) els.rankingPrevPageButton.disabled = currentPage <= 1;
  if (els.rankingNextPageButton) els.rankingNextPageButton.disabled = currentPage >= totalPages;
  document.querySelectorAll("[data-ranking-sort]").forEach((button) => {
    button.classList.toggle("active", button.dataset.rankingSort === AUTH_STATE.rankingSort);
  });
  renderCircuitDashboard();
}

function renderAdminAiReport() {
  if (!els.adminAiReportTable || !els.adminAiReportSummary) return;
  const report = AUTH_STATE.adminAiReport?.report;
  if (!report) {
    els.adminAiReportSummary.innerHTML = "";
    els.adminAiReportTable.innerHTML = '<div class="admin-empty">Aucun rapport enregistrÃ© pour cette semaine.</div>';
    return;
  }
  const assignments = report.motivation?.assignments || {};
  const assignmentLabels = [
    [assignments.previousBest, "Meilleur prÃ©cÃ©dent +1"],
    [assignments.randomPositive, "Tirage positif +2"],
    [assignments.previousWorst, "Moins bon prÃ©cÃ©dent âˆ’0,5"],
    [assignments.randomNegative, "Tirage nÃ©gatif âˆ’2"],
  ].filter(([id]) => id).map(([id, label]) => `${escapeHtml(aiTournamentPlayerName(id))} : ${label}`);
  els.adminAiReportSummary.innerHTML = `
    <p><strong>Saison ${Number(report.season || 1)} Â· Semaine ${Number(report.week || 1)}</strong> Â· ${Number(report.simulationCount || 2)} simulations</p>
    <p>Plafond tournoi : ${Number(report.tournamentMax || 0).toLocaleString("fr-FR")} Â· Plafond scores : ${Number(report.performanceMax || 0).toLocaleString("fr-FR")} Â· Maximum total : ${Number(report.pointMax || 0).toLocaleString("fr-FR")}</p>
    <p>${assignmentLabels.join(" Â· ")}</p>`;
  els.adminAiReportTable.innerHTML = `
    <div class="admin-ai-report-row admin-ai-report-head"><span>#</span><span>IA</span><span>Mot.</span><span>Sim. 1</span><span>Sim. 2</span><span>Tournois bruts</span><span>Plafond</span><span>Tournois retenus</span><span>Scores bruts</span><span>50 % scores</span><span>Total</span></div>
    ${(report.players || []).map((player) => {
      const run1 = report.runs?.[0]?.[player.characterId] || {};
      const run2 = report.runs?.[1]?.[player.characterId] || {};
      const runTotal = (run) => Number(run.tournamentPoints || 0) + Number(run.performancePoints || 0);
      return `<div class="admin-ai-report-row">
        <span>${Number(player.weeklyRank || 0)}</span><span>${escapeHtml(player.name || player.characterId)}</span><span>${Number(player.motivation || 0).toLocaleString("fr-FR")}</span>
        <span>${runTotal(run1).toLocaleString("fr-FR")}</span><span>${runTotal(run2).toLocaleString("fr-FR")}</span>
        <span>${Number(player.rawTournamentPoints || 0).toLocaleString("fr-FR")}</span><span>${Number(player.tournamentCap || 0).toLocaleString("fr-FR")}</span>
        <span>${Number(player.tournamentPoints || 0).toLocaleString("fr-FR")}</span><span>${Number(player.rawPerformancePoints || 0).toLocaleString("fr-FR")}</span>
        <span>${Number(player.performancePoints || 0).toLocaleString("fr-FR")}</span><strong>${Number(player.points || 0).toLocaleString("fr-FR")}</strong>
      </div>`;
    }).join("")}`;
}

async function loadAdminAiReport() {
  if (!canAccessAdminFeatures()) return;
  if (els.adminAiReportTable) els.adminAiReportTable.innerHTML = '<div class="admin-empty">Chargement du rapport...</div>';
  try {
    AUTH_STATE.adminAiReport = await authRequest("/api/admin/ai-simulation-report");
    renderAdminAiReport();
  } catch (error) {
    if (els.adminAiReportTable) els.adminAiReportTable.innerHTML = `<div class="admin-empty">${escapeHtml(error.message)}</div>`;
  }
}

function circuitRankLabel(value) {
  const rank = Number(value || 0);
  if (!rank) return "--";
  return rank === 1 ? "1er" : `${rank}e`;
}

function setCircuitProjection(element, rank, projectedRank) {
  if (!element) return;
  const current = Number(rank || 0);
  const projected = Number(projectedRank || current || 0);
  element.classList.remove("ranking-projection-up", "ranking-projection-down", "ranking-projection-neutral");
  if (!projected) {
    element.textContent = "Projection indisponible";
    return;
  }
  element.textContent = `(${circuitRankLabel(projected)} projetÃ©)`;
  element.classList.add(projected < current
    ? "ranking-projection-up"
    : projected > current
      ? "ranking-projection-down"
      : "ranking-projection-neutral");
}

function renderCircuitDashboard() {
  const ranking = AUTH_STATE.lobbyRanking || AUTH_STATE.ranking;
  const current = ranking?.currentUserRank || null;
  const competitions = AUTH_STATE.competitions;
  const retriesUsed = Number(competitions?.retriesUsed || 0);
  const retryLimit = Number(competitions?.retryLimit || 5);
  const remainingAttempts = Math.max(0, retryLimit - retriesUsed);
  const season = Number(competitions?.season || ranking?.season || 1);
  const week = Number(competitions?.week || ranking?.week || 1);

  if (els.circuitHeroPeriod) els.circuitHeroPeriod.textContent = `Saison ${season} Â· Semaine ${week} Â· Tournois de la semaine`;
  const fixedWorldRank = Number(current?.points_rank || current?.rank || 0);
  if (els.circuitRankValue) els.circuitRankValue.textContent = circuitRankLabel(fixedWorldRank);
  setCircuitProjection(els.circuitRankProjection, fixedWorldRank, current?.projected_rank);
  if (els.circuitPointsValue) els.circuitPointsValue.textContent = String(Number(current?.score_ref || 0));
  if (els.circuitWeekPointsValue) els.circuitWeekPointsValue.textContent = String(Number(current?.score_week || 0));
  if (els.circuitAttemptsValue) els.circuitAttemptsValue.textContent = `${remainingAttempts}/${retryLimit}`;
  if (els.circuitAttemptsCaption) els.circuitAttemptsCaption.textContent = remainingAttempts
    ? `${remainingAttempts} amÃ©lioration${remainingAttempts > 1 ? "s" : ""} encore possible${remainingAttempts > 1 ? "s" : ""}`
    : "Toutes les tentatives ont Ã©tÃ© utilisÃ©es";

  const characterId = selectedCharacterId();
  if (els.circuitPlayerAvatar) {
    els.circuitPlayerAvatar.src = PROFILE_CHARACTER_IMAGES[characterId] || PROFILE_CHARACTER_IMAGES.coachJu;
    els.circuitPlayerAvatar.alt = characterNameFromId(characterId);
  }
  if (els.circuitPlayerNickname) els.circuitPlayerNickname.textContent = AUTH_STATE.user?.nickname || selectedPlayerName();
  if (els.circuitPlayerRole) els.circuitPlayerRole.textContent = ROLE_LABELS[currentUserRole()] || "PRO";
  if (els.circuitPlayerRank) els.circuitPlayerRank.textContent = circuitRankLabel(fixedWorldRank);
  setCircuitProjection(els.circuitPlayerProjection, fixedWorldRank, current?.projected_rank);
  if (els.circuitPlayerPoints) els.circuitPlayerPoints.textContent = String(Number(current?.score_ref || 0));
  if (els.circuitPlayerWeekPoints) els.circuitPlayerWeekPoints.textContent = String(Number(current?.score_week || 0));
  if (els.circuitPlayerAttempts) els.circuitPlayerAttempts.textContent = `${remainingAttempts} / ${retryLimit}`;
}

function confrontationTrend(row = {}) {
  const stored = String(row.recent_results || row.recentResults || "").toUpperCase().replace(/[^VD]/g, "").slice(0, 5);
  if (stored) return stored;
  const wins = Math.max(0, Number(row.wins || 0));
  const losses = Math.max(0, Number(row.losses || 0));
  const total = wins + losses;
  if (!total) return "";
  const length = Math.min(5, total);
  let convertedWins = total > 5 ? Math.round((wins / total) * 5) : Math.min(length, wins);
  if (losses > 0) convertedWins = Math.min(convertedWins, length - 1);
  return `${"V".repeat(Math.max(0, convertedWins))}${"D".repeat(Math.max(0, length - convertedWins))}`;
}

function confrontationStatus(sequence, humanLevel = 1) {
  const trend = String(sequence || "").toUpperCase().replace(/[^VD]/g, "").slice(0, 5);
  if (trend.length < 5) return null;
  const wins = [...trend].filter((result) => result === "V").length;
  const advancedHuman = Number(humanLevel || 1) >= 5;
  if (wins === 5) return { label: "Domination humaine", className: "domination", target: "human", bonusCount: advancedHuman ? 1 : 2 };
  if (wins === 4) return { label: "Ascendant humain", className: "ascendant-positive", target: "human", bonusCount: advancedHuman ? 0 : 1 };
  if (wins === 2) return { label: "Ascendant IA", className: "ascendant-negative", target: "ai", bonusCount: advancedHuman ? 1 : 0 };
  if (wins === 1) return { label: "Domination IA", className: "ascendant-negative", target: "ai", bonusCount: advancedHuman ? 2 : 0 };
  if (wins === 0) return { label: "BÃªte noire IA", className: "bete-noire", target: "ai", bonusCount: advancedHuman ? 3 : 1 };
  return null;
}

function confrontationTrendMarkup(sequence) {
  return [...String(sequence || "")].map((result) => (
    `<strong class="confrontation-result ${result === "V" ? "victory" : "defeat"}">${result}</strong>`
  )).join("");
}

function profileCharacterVisuals(characterId) {
  const normalizedId = CHARACTER_IMAGES[characterId] ? characterId : "coachUnknown";
  const cards = CHARACTER_IMAGES[normalizedId] || CHARACTER_IMAGES.coachUnknown;
  return {
    illustration: PROFILE_CHARACTER_IMAGES[characterId] || cards[0],
    recto: cards[0],
    verso: cards[1] || cards[0],
  };
}

function prepareRetinaCardImages(root = document) {
  if (!root) return;
  const selector = 'img[src*="assets/cards/"]';
  const images = [
    ...(root.matches?.(selector) ? [root] : []),
    ...root.querySelectorAll(selector),
  ];
  images.forEach((image) => {
    const source = image.getAttribute("src");
    if (!source || image.dataset.retinaSource === source) return;
    image.dataset.retinaSource = source;
    // Les JPG du dossier cards sont dÃ©jÃ  les fichiers x2 (1462 Ã— 2078).
    // On conserve leur rÃ©solution physique complÃ¨te dans src : certains moteurs
    // rÃ©duisent trop tÃ´t une source dÃ©clarÃ©e uniquement avec le descripteur 2x.
    image.removeAttribute("srcset");
    image.setAttribute("decoding", "async");
    image.dataset.sourcePixelWidth = "1462";
    image.dataset.sourcePixelHeight = "2078";
  });
}

function imageSourcePixelSize(image) {
  return {
    width: Number(image?.dataset?.sourcePixelWidth) || image?.naturalWidth || 0,
    height: Number(image?.dataset?.sourcePixelHeight) || image?.naturalHeight || 0,
  };
}

function fitZoomImageToScreen(image) {
  const sourcePixels = imageSourcePixelSize(image);
  if (!sourcePixels.width || !sourcePixels.height) return;
  const pixelRatio = Math.max(1, Number(window.devicePixelRatio) || 1);
  const nativeCssWidth = Math.floor(sourcePixels.width / pixelRatio);
  const nativeCssHeight = Math.floor(sourcePixels.height / pixelRatio);
  image.style.maxWidth = `min(100%, ${nativeCssWidth}px)`;
  image.style.maxHeight = `min(calc(100vh - 42px), ${nativeCssHeight}px)`;
}

function attachResolutionAwareZoom(image) {
  const fit = () => fitZoomImageToScreen(image);
  image.addEventListener("load", fit);
  if (image.complete) fit();
  window.addEventListener("resize", fit);
  return () => window.removeEventListener("resize", fit);
}

let cardLocalPreview = null;
let cardLocalPreviewAnchor = null;
let cardLocalPreviewTimer = null;
let lastCardPointerType = "mouse";
let suppressNextTouchMaximumZoom = false;
let activeCardTouchIdentifier = null;
let activeCardTouchButton = null;
const CARD_PREVIEW_ZONE_RATIO = 0.75;

function closeCardLocalPreview() {
  window.clearTimeout(cardLocalPreviewTimer);
  cardLocalPreviewTimer = null;
  cardLocalPreview?.remove();
  cardLocalPreview = null;
  cardLocalPreviewAnchor = null;
}

function positionCardLocalPreview(preview, anchor, image) {
  const sourcePixels = imageSourcePixelSize(image);
  if (!preview || !anchor || !sourcePixels.width || !sourcePixels.height) return;
  const anchorRect = anchor.getBoundingClientRect();
  const pixelRatio = Math.max(1, Number(window.devicePixelRatio) || 1);
  const imageRatio = sourcePixels.width / sourcePixels.height;
  const viewportMargin = 12;
  const maximumNativeWidth = sourcePixels.width / pixelRatio;
  const maximumNativeHeight = sourcePixels.height / pixelRatio;
  const maximumViewportWidth = window.innerWidth - (viewportMargin * 2);
  const maximumViewportHeight = window.innerHeight - (viewportMargin * 2);
  const desiredWidth = Math.max(260, anchorRect.width * 1.8);
  const previewWidth = Math.max(1, Math.min(
    420,
    desiredWidth,
    maximumNativeWidth,
    maximumNativeHeight * imageRatio,
    maximumViewportWidth,
    maximumViewportHeight * imageRatio,
  ));
  const previewHeight = previewWidth / imageRatio;
  const left = Math.min(
    window.innerWidth - viewportMargin - previewWidth,
    Math.max(viewportMargin, anchorRect.left + ((anchorRect.width - previewWidth) / 2)),
  );
  const top = Math.min(
    window.innerHeight - viewportMargin - previewHeight,
    Math.max(viewportMargin, anchorRect.top + ((anchorRect.height - previewHeight) / 2)),
  );
  preview.style.width = `${Math.round(previewWidth)}px`;
  preview.style.height = `${Math.round(previewHeight)}px`;
  preview.style.left = `${Math.round(left)}px`;
  preview.style.top = `${Math.round(top)}px`;
  preview.classList.add("visible");
}

function showCardLocalPreview(anchor, imageUrl, label = "Carte", immediate = false) {
  if (!GAMEPLAY_ASSIST.cardZoom || !imageUrl || document.querySelector(".image-zoom-backdrop")) return;
  closeCardLocalPreview();
  cardLocalPreviewAnchor = anchor;
  const renderPreview = () => {
    const preview = document.createElement("div");
    preview.className = "card-local-preview";
    preview.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = label;
    preview.append(image);
    document.body.append(preview);
    prepareRetinaCardImages(preview);
    cardLocalPreview = preview;
    const position = () => positionCardLocalPreview(preview, anchor, image);
    image.addEventListener("load", position, { once: true });
    image.addEventListener("error", closeCardLocalPreview, { once: true });
    if (image.complete && image.naturalWidth) position();
  };
  if (immediate) {
    renderPreview();
    return;
  }
  cardLocalPreviewTimer = window.setTimeout(renderPreview, 90);
}

function prepareCardTouchPreview(button, imageUrl, label, touchIdentifier = null) {
  lastCardPointerType = "touch";
  suppressNextTouchMaximumZoom = true;
  activeCardTouchIdentifier = touchIdentifier;
  activeCardTouchButton = button;
  showCardLocalPreview(button, imageUrl, label, true);
}

function endActiveCardTouch(changedTouches = null) {
  if (activeCardTouchButton == null) return;
  if (changedTouches && activeCardTouchIdentifier != null) {
    const ended = [...changedTouches].some((touch) => touch.identifier === activeCardTouchIdentifier);
    if (!ended) return;
  }
  activeCardTouchIdentifier = null;
  activeCardTouchButton = null;
  closeCardLocalPreview();
}

function suppressMaximumZoomAfterTouch() {
  if (lastCardPointerType !== "touch" || !suppressNextTouchMaximumZoom) return false;
  suppressNextTouchMaximumZoom = false;
  return true;
}

function pointerIsInsideCardPreviewZone(button, event) {
  const rect = button.getBoundingClientRect();
  const horizontalMargin = rect.width * ((1 - CARD_PREVIEW_ZONE_RATIO) / 2);
  const verticalMargin = rect.height * ((1 - CARD_PREVIEW_ZONE_RATIO) / 2);
  return event.clientX >= rect.left + horizontalMargin
    && event.clientX <= rect.right - horizontalMargin
    && event.clientY >= rect.top + verticalMargin
    && event.clientY <= rect.bottom - verticalMargin;
}

function updateMouseCardPreview(button, imageUrl, label, event) {
  if (event.pointerType !== "mouse") return;
  lastCardPointerType = "mouse";
  if (!pointerIsInsideCardPreviewZone(button, event)) {
    if (cardLocalPreviewAnchor === button) closeCardLocalPreview();
    return;
  }
  if (cardLocalPreviewAnchor !== button) showCardLocalPreview(button, imageUrl, label);
}

function attachCardLocalPreviewHandlers(root = document) {
  if (!root) return;
  root.querySelectorAll("[data-image-zoom], [data-image-hover]").forEach((button) => {
    if (button.dataset.localZoomBound === "1") return;
    button.dataset.localZoomBound = "1";
    const imageUrl = button.dataset.imageHover || button.dataset.imageZoom;
    const label = button.dataset.imageLabel || "Carte";
    button.setAttribute("draggable", "false");
    button.querySelectorAll?.("img").forEach((image) => image.setAttribute("draggable", "false"));
    button.addEventListener("contextmenu", (event) => event.preventDefault());
    button.addEventListener("dragstart", (event) => event.preventDefault());
    button.addEventListener("pointerenter", (event) => updateMouseCardPreview(button, imageUrl, label, event));
    button.addEventListener("pointermove", (event) => updateMouseCardPreview(button, imageUrl, label, event));
    button.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") closeCardLocalPreview();
    });
    button.addEventListener("pointerdown", (event) => {
      if (event.target.closest?.(".ai-nudge-button")) return;
      if (event.pointerType === "mouse") {
        lastCardPointerType = "mouse";
        return;
      }
      // touchstart mÃ©morise Ã©galement l'identifiant du doigt. Pointerdown sert
      // de secours aux stylets et aux navigateurs sans Ã©vÃ©nements tactiles.
      if (event.pointerType !== "touch") prepareCardTouchPreview(button, imageUrl, label);
    });
    button.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "touch") endActiveCardTouch();
    });
    button.addEventListener("pointercancel", (event) => {
      // Les navigateurs envoient pointercancel dÃ¨s qu'un dÃ©filement commence.
      // La loupe reste donc visible jusqu'au vÃ©ritable touchend.
      if (event.pointerType !== "mouse" && event.pointerType !== "touch") endActiveCardTouch();
    });
    button.addEventListener("touchstart", (event) => {
      if (event.target.closest?.(".ai-nudge-button")) return;
      const touch = event.changedTouches[0];
      prepareCardTouchPreview(button, imageUrl, label, touch?.identifier ?? null);
    }, { passive: true });
  });
  if (document.documentElement.dataset.localZoomOutsideBound !== "1") {
    document.documentElement.dataset.localZoomOutsideBound = "1";
    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest?.("[data-image-zoom], [data-image-hover]")) closeCardLocalPreview();
    });
    document.addEventListener("touchend", (event) => endActiveCardTouch(event.changedTouches), { passive: true });
    document.addEventListener("touchcancel", (event) => endActiveCardTouch(event.changedTouches), { passive: true });
    window.addEventListener("blur", () => endActiveCardTouch());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) endActiveCardTouch();
    });
  }
}

function openImageZoom(imageUrl, label = "Carte") {
  if (!GAMEPLAY_ASSIST.cardZoom) return;
  closeCardLocalPreview();
  document.querySelector(".image-zoom-backdrop")?.remove();
  if (!imageUrl) return;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop image-zoom-backdrop";
  backdrop.innerHTML = `
    <button class="image-zoom-close" type="button" aria-label="Fermer l'agrandissement">Ã—</button>
    <figure class="image-zoom-figure" role="dialog" aria-modal="true" aria-label="${escapeHtml(label)} agrandie">
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(label)}" />
    </figure>
  `;
  document.body.append(backdrop);
  prepareRetinaCardImages(backdrop);
  const detachResolutionFit = attachResolutionAwareZoom(backdrop.querySelector(".image-zoom-figure img"));
  const close = () => {
    detachResolutionFit();
    backdrop.remove();
    document.removeEventListener("keydown", onKeyDown);
  };
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop || event.target.closest(".image-zoom-close")) close();
  });
  const onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    close();
  };
  document.addEventListener("keydown", onKeyDown);
}

function attachImageZoomHandlers(root = document) {
  prepareRetinaCardImages(root);
  attachCardLocalPreviewHandlers(root);
  root.querySelectorAll("[data-image-zoom]").forEach((button) => {
    if (button.dataset.zoomBound === "1") return;
    button.dataset.zoomBound = "1";
    button.addEventListener("click", (event) => {
      if (button.matches(".dialog-card-preview")) event.stopPropagation();
      if (suppressMaximumZoomAfterTouch()) return;
      openImageZoom(button.dataset.imageZoom, button.dataset.imageLabel);
    });
  });
}

function academyOrderedCards() {
  return CARD_LIBRARY
    .map((card, libraryIndex) => ({ card, libraryIndex }))
    .sort((left, right) => {
      const leftEffect = left.card.family === "Remise" ? 1 : 0;
      const rightEffect = right.card.family === "Remise" ? 1 : 0;
      return leftEffect - rightEffect
        || right.card.cost - left.card.cost
        || left.libraryIndex - right.libraryIndex;
    })
    .map(({ card }) => card);
}

function openAcademyDeckGallery(startIndex = 0) {
  closeCardLocalPreview();
  document.querySelector(".image-zoom-backdrop")?.remove();
  const cards = academyOrderedCards();
  if (!cards.length) return;
  let currentIndex = ((Number(startIndex) % cards.length) + cards.length) % cards.length;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop image-zoom-backdrop academy-gallery-backdrop";
  backdrop.innerHTML = `
    <button class="image-zoom-close" type="button" aria-label="Fermer l'agrandissement">Ã—</button>
    <button class="academy-gallery-arrow previous" type="button" data-academy-gallery-direction="-1" aria-label="Carte prÃ©cÃ©dente">â€¹</button>
    <figure class="image-zoom-figure academy-gallery-figure" role="dialog" aria-modal="true">
      <img alt="" />
    </figure>
    <button class="academy-gallery-arrow next" type="button" data-academy-gallery-direction="1" aria-label="Carte suivante">â€º</button>
  `;
  document.body.append(backdrop);
  const image = backdrop.querySelector(".academy-gallery-figure img");
  const figure = backdrop.querySelector(".academy-gallery-figure");
  const detachResolutionFit = attachResolutionAwareZoom(image);
  const renderCurrentCard = () => {
    const card = cards[currentIndex];
    const cardLabel = `${card.name} - ${card.subtitle ?? card.family}`;
    image.src = CARD_IMAGES[card.id] || CARD_BACK_IMAGE;
    image.alt = cardLabel;
    figure.setAttribute("aria-label", `${cardLabel} agrandie`);
    prepareRetinaCardImages(figure);
  };
  const move = (direction) => {
    currentIndex = (currentIndex + direction + cards.length) % cards.length;
    renderCurrentCard();
  };
  const close = () => {
    detachResolutionFit();
    backdrop.remove();
    document.removeEventListener("keydown", onKeyDown);
  };
  const onKeyDown = (event) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  };
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop || event.target.closest(".image-zoom-close")) close();
  });
  backdrop.querySelectorAll("[data-academy-gallery-direction]").forEach((button) => {
    button.addEventListener("click", () => move(Number(button.dataset.academyGalleryDirection)));
  });
  document.addEventListener("keydown", onKeyDown);
  renderCurrentCard();
}

function academyDeckMarkup() {
  return academyOrderedCards().map((card, index) => {
    const imageUrl = CARD_IMAGES[card.id] || CARD_BACK_IMAGE;
    const cardLabel = `${card.name} - ${card.subtitle ?? card.family}`;
    return `
      <button class="academy-deck-card" type="button" data-academy-gallery-index="${index}" data-image-hover="${escapeHtml(imageUrl)}" data-image-label="${escapeHtml(cardLabel)}" aria-label="Agrandir ${escapeHtml(cardLabel)}">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(cardLabel)}" loading="lazy" />
      </button>
    `;
  }).join("");
}

function attachAcademyDeckHandlers() {
  attachCardLocalPreviewHandlers(els.academyDeckList);
  els.academyDeckList?.querySelectorAll("[data-academy-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => {
      if (suppressMaximumZoomAfterTouch()) return;
      openAcademyDeckGallery(Number(button.dataset.academyGalleryIndex));
    });
  });
}

function renderAcademyDeck() {
  if (!els.academyDeckList) return;
  els.academyDeckList.innerHTML = academyDeckMarkup();
  prepareRetinaCardImages(els.academyDeckList);
  attachAcademyDeckHandlers();
}

function profileMarkup(profile) {
  if (profile?.isAi) return aiAdminProfileMarkup(profile);
  const user = profile?.user || AUTH_STATE.user;
  const ranking = profile?.ranking || {};
  const circuitLevel = humanCircuitLevelInfo(ranking.score_ref);
  const results = profile?.results || [];
  const honors = profile?.honors || [];
  const aiResults = profile?.aiResults || [];
  const calendar = profile?.calendar || [];
  const isOwnProfile = !profile?.publicProfile;
  const activity = profile?.activity || null;
  const selectedProfileCharacter = user?.selectedCharacterId || "tennisHope";
  const selectedCharacterVisuals = profileCharacterVisuals(selectedProfileCharacter);
  const selectedCharacterName = characterNameFromId(selectedProfileCharacter);
  const palmaresResults = results.filter((row) => ["winner", "finalist"].includes(String(row.achievement || "").toLowerCase()));
  const tournamentWins = palmaresResults.filter((row) => String(row.achievement || "").toLowerCase() === "winner").length;
  const lostFinals = palmaresResults.filter((row) => String(row.achievement || "").toLowerCase() === "finalist").length;
  const careerEntries = [
    ...palmaresResults.map((row) => ({
      type: "result",
      season: Number(row.season_number || row.season || 0),
      week: Number(row.week_number || row.week || 0),
      row,
    })),
    ...honors.map((honor) => ({
      type: "honor",
      season: Number(honor.season_number || honor.season || 0),
      week: Number(honor.week_number || honor.week || 0),
      honor,
    })),
  ].sort((a, b) => b.season - a.season || b.week - a.week);
  const careerRows = careerEntries.length
    ? careerEntries.map((entry, index) => {
      const extraClass = index >= 10 ? " profile-collapsible-item hidden" : "";
      if (entry.type === "honor") {
        return `<div class="profile-row profile-honor-row${extraClass}" ${index >= 10 ? 'data-profile-collapse-group="career"' : ""}>
          <strong><span class="profile-result-medal gold"></span>${escapeHtml(entry.honor.label || "Distinction")}</strong>
          <span>Saison ${entry.season} Â· Semaine ${entry.week}</span>
        </div>`;
      }
      const row = entry.row;
      const won = String(row.achievement || "").toLowerCase() === "winner";
      const city = row.city || "";
      const country = row.country || "";
      const flag = row.flag || "";
      return `<div class="profile-row${extraClass}" ${index >= 10 ? 'data-profile-collapse-group="career"' : ""}>
        <strong><span class="profile-result-medal ${won ? "gold" : "silver"}"></span>${escapeHtml(row.competition_name || row.competitionName)}</strong>
        <span>${escapeHtml(city)} Â· ${escapeHtml(country)} ${escapeHtml(flag)} Â· Saison ${entry.season} Â· Semaine ${entry.week} Â· ${won ? "Victoire" : "Finale"} Â· ${Number(row.points || 0)} pts</span>
      </div>`;
    }).join("")
    : '<div class="lobby-empty">Aucune victoire ou finale enregistrÃ©e.</div>';
  const careerToggle = careerEntries.length > 10
    ? '<button class="profile-expand-button" type="button" data-profile-toggle="career" aria-expanded="false" aria-label="Afficher tout le palmarÃ¨s">+</button>'
    : "";
  const adminScoreRows = profile?.viewerIsAdmin && profile?.adminScores?.periods?.length
    ? profile.adminScores.periods.map((period) => `
        <label class="admin-score-period">
          <span>${escapeHtml(period.label)} Â· Saison ${Number(period.season)} Â· Semaine ${Number(period.week)}</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${Number(period.points || 0)}" data-profile-score-key="${escapeHtml(period.key)}" />
        </label>
      `).join("")
    : "";
  const sortedAiResults = aiResults.filter((row) => !COACH_OPTIONS.includes(row.ai_character_id || row.aiCharacterId)).sort((a, b) => (
    Number(b.wins || 0) + Number(b.losses || 0) - Number(a.wins || 0) - Number(a.losses || 0)
    || Number(b.wins || 0) - Number(a.wins || 0)
  ));
  const aiRows = sortedAiResults.length
    ? sortedAiResults.map((row, index) => {
      const trend = confrontationTrend(row);
      const trendWins = [...trend].filter((result) => result === "V").length;
      const trendLosses = trend.length - trendWins;
      const status = confrontationStatus(trend, circuitLevel.level);
      return `<div class="profile-row confrontation-row${index >= 5 ? " profile-collapsible-item hidden" : ""}" ${index >= 5 ? 'data-profile-collapse-group="rivalries"' : ""}>
        <strong>${escapeHtml(characterNameFromId(row.ai_character_id || row.aiCharacterId))}</strong>
        <span class="confrontation-summary">
          ${status ? `<span class="confrontation-status ${status.className}">${escapeHtml(status.label)}</span>` : ""}
          <span class="confrontation-trend" aria-label="SÃ©rie rÃ©cente ${escapeHtml(trend)}">${confrontationTrendMarkup(trend)}</span>
          <span class="confrontation-ratio" aria-label="${trendWins} victoires et ${trendLosses} dÃ©faites sur les derniers matchs">${trendWins}/${trendLosses}</span>
        </span>
      </div>`;
    }).join("")
    : '<div class="lobby-empty">Aucun rÃ©sultat de confrontation enregistrÃ©.</div>';
  const rivalriesToggle = sortedAiResults.length > 5
    ? '<button class="profile-expand-button" type="button" data-profile-toggle="rivalries" aria-expanded="false" aria-label="Afficher toutes les rivalitÃ©s">+</button>'
    : "";
  const statRows = [
    ["Meilleur classement", user?.bestWorldRank ? `#${Number(user.bestWorldRank)}` : "-"],
    ["Semaines nÂ°1", Number(user?.weeksWorldNumberOne || 0)],
    ["Semaines Top 3", Number(user?.weeksWorldTop3 || 0)],
    ["Semaines Top 5", Number(user?.weeksWorldTop5 || 0)],
    ["Semaines Top 10", Number(user?.weeksWorldTop10 || 0)],
  ].map(([label, value]) => `<div class="profile-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  const calendarRowMarkup = (item, collapsed = false) => {
      const title = `${item.type || item.level || "Tournoi"} - ${item.name || ""}`;
      const place = `${item.city || ""} Â· ${item.country || ""} ${item.flag || ""}`;
      let detail = "";
      if (item.reached && item.result) {
        detail = `${item.result.label} Â· ${Number(item.result.points || 0)} pts${item.result.lastOpponent ? ` Â· Dernier match vs ${item.result.lastOpponent}` : ""}${item.result.lastScore ? ` Â· ${item.result.lastScore}` : ""}`;
      } else if (item.reached) {
        detail = "N'a pas participÃ©";
      }
      const achievement = String(item.result?.achievement || "").toLowerCase();
      const isCurrentWeek = Number(item.week || 0) === Number(profile?.circuit?.week || 0);
      const resultClass = achievement === "winner" ? " result-winner" : achievement === "finalist" ? " result-finalist" : "";
      return `<div class="profile-calendar-row${isCurrentWeek ? " current-week" : ""}${resultClass}${collapsed ? " profile-collapsible-item hidden" : ""}" ${collapsed ? 'data-profile-collapse-group="calendar"' : ""}>
        <div class="profile-calendar-heading">
          <strong>S${Number(item.week || 0)} Â· ${escapeHtml(title)}</strong>
          ${profile?.viewerIsAdmin && item.reached ? `<button class="small-button danger-button profile-tournament-reset" type="button" data-reset-profile-tournament="${escapeHtml(item.id)}" data-reset-profile-season="${Number(profile?.circuit?.season || 1)}" data-reset-profile-week="${Number(item.week || 0)}" data-profile-admin-user="${escapeHtml(user?.id || "")}">RÃ©initialiser Ã  0</button>` : ""}
        </div>
        <span>${escapeHtml(place)}</span>
        ${detail ? `<em>${escapeHtml(detail)}</em>` : ""}
      </div>`;
  };
  const currentCalendar = calendar.filter((item) => Number(item.week || 0) === Number(profile?.circuit?.week || 0));
  const remainingCalendar = calendar
    .filter((item) => Number(item.week || 0) !== Number(profile?.circuit?.week || 0))
    .sort((a, b) => Number(a.week || 0) - Number(b.week || 0) || Number(a.slot || 0) - Number(b.slot || 0));
  const calendarRows = calendar.length
    ? `${currentCalendar.map((item) => calendarRowMarkup(item)).join("")}${remainingCalendar.map((item) => calendarRowMarkup(item, true)).join("")}`
    : '<div class="lobby-empty">Calendrier indisponible.</div>';
  const calendarToggle = remainingCalendar.length
    ? '<button class="profile-expand-button" type="button" data-profile-toggle="calendar" aria-expanded="false" aria-label="Afficher les autres semaines du calendrier">+</button>'
    : "";
  const pointsToDefend = Math.max(0,
    Number(ranking.score_ref || 0)
    + Number(ranking.score_week || 0)
    - Number(ranking.score_next_ref || 0));
  return `
    <section class="profile-identity-hero">
      <div class="profile-identity-portrait">
        <img src="${escapeHtml(selectedCharacterVisuals.illustration)}" alt="${escapeHtml(selectedCharacterName)}" />
      </div>
      <div class="profile-identity-info">
        <div class="profile-identity-copy">
          <span class="profile-role">${escapeHtml(ROLE_LABELS[user?.role] || "FREE")}</span>
          <p class="label">${isOwnProfile ? "Votre carriÃ¨re" : "Profil joueur"}</p>
          <h2>${escapeHtml(user?.nickname || "Joueur")}</h2>
          <p>${escapeHtml(selectedCharacterName)} vous reprÃ©sente dans le lobby et sur les courts.</p>
        </div>
        <dl class="profile-identity-metrics">
          <div><dt>Rang mondial</dt><dd>${Number(ranking.points_rank || ranking.rank || 0) ? `#${Number(ranking.points_rank || ranking.rank)}` : "-"}</dd><small>${Number(ranking.projected_rank || 0) ? `#${Number(ranking.projected_rank)} projetÃ©` : "Projection indisponible"}</small></div>
          <div><dt>Points Circuit</dt><dd>${Number(ranking.score_ref || 0)}</dd><small>4 semaines terminÃ©es</small></div>
          <div class="profile-current-week-points">
            <dt>Cette semaine</dt>
            <dd><span>${Number(ranking.score_week || 0)}</span><small>/ ${pointsToDefend}</small></dd>
            <em><span>En cours</span><span>/ Ã€ dÃ©fendre</span></em>
          </div>
          <div class="profile-trophy-metric gold"><dt>Tournois gagnÃ©s</dt><dd><img src="./assets/icons/trophy-circuit.svg" alt="" aria-hidden="true" />${tournamentWins}</dd></div>
          <div class="profile-trophy-metric silver"><dt>Finales perdues</dt><dd><img src="./assets/icons/trophy-circuit.svg" alt="" aria-hidden="true" />${lostFinals}</dd></div>
        </dl>
      </div>
    </section>
    <div class="profile-grid">
      <section class="profile-card profile-account-card">
        <div class="profile-card-heading"><div><p class="label">Compte</p><h3>Informations joueur</h3></div></div>
        ${isOwnProfile ? `
          <label class="menu-field">Pseudo
            <input id="profileNicknameInput" type="text" maxlength="24" value="${escapeHtml(user?.nickname || "")}" />
          </label>
          <button id="saveProfileNicknameButton" class="primary-button" type="button">Modifier le pseudo</button>
        ` : `<h2>${escapeHtml(user?.nickname || "")}</h2>`}
        ${isOwnProfile && user?.role === "free" ? `
          <label class="menu-field">Code Pro
            <input id="profileProCodeInput" type="text" maxlength="6" autocomplete="off" placeholder="CODE PRO" />
          </label>
          <button id="profileRedeemProCodeButton" class="small-button" type="button">Passer Pro</button>
        ` : ""}
      </section>
      <section class="profile-card profile-character-card">
        <div class="profile-card-heading"><div><p class="label">Personnage</p><h3>IdentitÃ© sur le court</h3></div></div>
        <div class="profile-character-summary">
          <div class="profile-character-visuals">
            ${[
              [selectedCharacterVisuals.illustration, `${selectedCharacterName} - illustration`],
              [selectedCharacterVisuals.recto, `${selectedCharacterName} - carte recto`],
              [selectedCharacterVisuals.verso, `${selectedCharacterName} - carte verso`],
            ].map(([image, label]) => `
              <button class="profile-character-visual" type="button" data-image-zoom="${escapeHtml(image)}" data-image-label="${escapeHtml(label)}" aria-label="Agrandir ${escapeHtml(label)}">
                <img src="${escapeHtml(image)}" alt="${escapeHtml(label)}" />
              </button>
            `).join("")}
          </div>
          <strong>${escapeHtml(selectedCharacterName)}</strong>
        </div>
        ${isOwnProfile ? '<button id="openCharacterPageButton" class="primary-button" type="button">Changer de personnage</button>' : ""}
      </section>
      ${activity ? `<section class="profile-card profile-wide profile-live-activity">
        <div>
          <p class="label">Partie en cours</p>
          <strong>${escapeHtml(activity.type || "Partie en cours")}</strong>
          <span>Adversaire : ${escapeHtml(activity.opponent || "Adversaire")} Â· Score : ${escapeHtml(activity.score || "En direct")}</span>
        </div>
        ${activity.watchable ? `<button class="small-button profile-watch-button" type="button" data-watch-profile-user="${escapeHtml(user?.id || "")}" data-watch-profile-label="${escapeHtml(activity.type || "Partie en cours")}">VOIR</button>` : ""}
      </section>` : ""}
      <section class="profile-card profile-ranking-card">
        <div class="profile-card-heading"><div><p class="label">Circuit Pro</p><h3>Classement mondial</h3></div></div>
        <div class="profile-player-level" aria-label="Niveau ${circuitLevel.level} sur 6, ${escapeHtml(circuitLevel.label)}">
          <span>Niveau ${circuitLevel.level}</span>
          <strong>${escapeHtml(circuitLevel.label)}</strong>
          <span class="profile-level-stars" title="${circuitLevel.level} Ã©toile${circuitLevel.level > 1 ? "s" : ""}">${"â˜…".repeat(circuitLevel.level)}</span>
        </div>
        <div class="ranking-row current-user"><span class="ranking-position"><strong>${Number(ranking.points_rank || ranking.rank || 0) || "-"}</strong>${Number(ranking.projected_rank || 0) ? `<small class="ranking-projection">(${Number(ranking.projected_rank)})</small>` : ""}</span><strong>${escapeHtml(user?.nickname || "")}</strong><span>${Number(ranking.score_ref || 0)}</span><span>${Number(ranking.score_week || 0)}</span><span>${Number(ranking.score_total || 0)}</span></div>
        <div class="profile-stats-grid">${statRows}</div>
        <button id="profileRankingLinkButton" class="small-button" type="button">Classement gÃ©nÃ©ral</button>
      </section>
      <section class="profile-card profile-wide profile-results-card">
        <div class="profile-card-heading"><div><p class="label">CarriÃ¨re</p><h3>PalmarÃ¨s</h3></div></div>
        ${careerRows}
        ${careerToggle}
      </section>
      ${profile?.viewerIsAdmin ? `<section class="profile-card profile-wide admin-profile-tools">
        <p class="label">Administration du joueur</p>
        <div class="admin-score-periods">${adminScoreRows}</div>
        <label class="admin-score-period admin-weekly-attempts">
          <span>Tentatives utilisÃ©es cette semaine</span>
          <input type="number" min="0" max="${Number(profile?.adminScores?.weeklyAttempts?.limit || 5)}" step="1" inputmode="numeric" value="${Number(profile?.adminScores?.weeklyAttempts?.used || 0)}" data-profile-weekly-attempts />
        </label>
        <div class="admin-inline-actions">
          <button id="saveProfileRankingScoresButton" class="primary-button" type="button" data-profile-admin-user="${escapeHtml(user?.id || "")}">Enregistrer points et tentatives</button>
          <button id="resetProfileCareerButton" class="small-button danger-button" type="button" data-profile-admin-user="${escapeHtml(user?.id || "")}">RÃ©initialiser palmarÃ¨s et classement</button>
        </div>
      </section>` : ""}
      <section class="profile-card profile-wide profile-confrontations-card">
        <div class="profile-card-heading"><div><p class="label">RivalitÃ©s</p><h3>Les adversaires les plus rencontrÃ©s</h3></div></div>
        ${aiRows}
        ${rivalriesToggle}
      </section>
      <section class="profile-card profile-wide profile-calendar-card">
        <div class="profile-card-heading"><div><p class="label">Saison en cours</p><h3>Calendrier de saison</h3></div></div>
        <div class="profile-calendar">${calendarRows}</div>
        ${calendarToggle}
      </section>
    </div>
  `;
}

function aiAdminProfileMarkup(profile) {
  const user = profile.user || {};
  const ranking = profile.ranking || {};
  const scores = profile.adminScores || {};
  const characterId = profile.characterId || user.selectedCharacterId || "coachUnknown";
  const visuals = profileCharacterVisuals(characterId);
  const scoreInputs = (scores.periods || []).map((period) => `
    <label class="admin-score-period">
      <span>${escapeHtml(period.label)} Â· Saison ${Number(period.season)} Â· Semaine ${Number(period.week)}</span>
      <input type="number" min="0" max="100000" step="1" inputmode="numeric" value="${Number(period.points || 0)}" data-ai-profile-score-key="${escapeHtml(period.key)}" />
    </label>
  `).join("");
  return `
    <section class="profile-identity-hero ai-admin-profile-hero">
      <div class="profile-identity-portrait"><img src="${escapeHtml(visuals.illustration)}" alt="${escapeHtml(user.nickname || "Joueur IA")}" /></div>
      <div class="profile-identity-info">
        <div class="profile-identity-copy"><span class="profile-role">IA</span><p class="label">Profil joueur IA</p><h2>${escapeHtml(user.nickname || "Joueur IA")}</h2><p>Points administrables pour la saison en cours.</p></div>
        <dl class="profile-identity-metrics">
          <div><dt>Rang mondial</dt><dd>${Number(ranking.points_rank || ranking.rank || 0) ? `#${Number(ranking.points_rank || ranking.rank)}` : "-"}</dd></div>
          <div><dt>Points Circuit</dt><dd>${Number(ranking.score_ref || 0)}</dd></div>
          <div><dt>Cette semaine</dt><dd>${Number(ranking.score_week || 0)}</dd></div>
          <div><dt>Total saison</dt><dd>${Number(ranking.score_total || 0)}</dd></div>
        </dl>
      </div>
    </section>
    <div class="profile-grid">
      <section class="profile-card profile-wide admin-profile-tools ai-admin-score-editor">
        <div class="profile-card-heading"><div><p class="label">Administration IA</p><h3>Modifier les points</h3></div></div>
        <div class="admin-score-periods">${scoreInputs}</div>
        <label class="admin-score-period admin-ai-season-total">
          <span>Total de la saison ${Number(scores.currentSeason || profile.circuit?.season || 1)}</span>
          <input type="number" min="0" max="1000000" step="1" inputmode="numeric" value="${Number(scores.seasonTotal || 0)}" data-ai-profile-season-total />
        </label>
        <div class="admin-inline-actions">
          <button id="saveAiProfileRankingScoresButton" class="primary-button" type="button" data-ai-character-id="${escapeHtml(characterId)}">Enregistrer tous les points</button>
          <button id="backFromAiProfileButton" class="small-button" type="button">Retour au classement</button>
        </div>
      </section>
    </div>
  `;
}

function toggleProfileCollection(event) {
  const button = event.currentTarget;
  const group = String(button?.dataset.profileToggle || "");
  if (!group || !els.profileContent) return;
  const expanded = button.getAttribute("aria-expanded") !== "true";
  els.profileContent.querySelectorAll(`[data-profile-collapse-group="${group}"]`).forEach((row) => {
    row.classList.toggle("hidden", !expanded);
  });
  button.setAttribute("aria-expanded", String(expanded));
  button.textContent = expanded ? "âˆ’" : "+";
}

async function loadProfile(userId = null) {
  if (!AUTH_STATE.user) return;
  if (els.profileContent) els.profileContent.innerHTML = '<div class="lobby-empty">Chargement du profil...</div>';
  try {
    const ownProfile = !userId || userId === AUTH_STATE.user?.id;
    const profile = ownProfile ? await authRequest("/api/profile") : await authRequest(`/api/profiles/${encodeURIComponent(userId)}`);
    if (ownProfile && authenticatedUserId() === String(profile?.user?.id || "")) {
      AUTH_STATE.profile = profile;
      AUTH_STATE.profileUserId = authenticatedUserId();
    }
    if (els.profileContent) els.profileContent.innerHTML = profileMarkup(profile);
    if (ownProfile) {
      document.querySelector("#saveProfileNicknameButton")?.addEventListener("click", saveProfileNickname);
      document.querySelector("#openCharacterPageButton")?.addEventListener("click", showCharacterScreen);
      document.querySelector("#profileRedeemProCodeButton")?.addEventListener("click", redeemProfileProCode);
    }
    document.querySelector("#profileRankingLinkButton")?.addEventListener("click", showRankingScreen);
    document.querySelectorAll("[data-profile-toggle]").forEach((button) => {
      button.addEventListener("click", toggleProfileCollection);
    });
    document.querySelector("#saveProfileRankingScoresButton")?.addEventListener("click", saveProfileRankingScores);
    document.querySelector("#saveAiProfileRankingScoresButton")?.addEventListener("click", saveAiProfileRankingScores);
    document.querySelector("#backFromAiProfileButton")?.addEventListener("click", showRankingScreen);
    document.querySelector("#resetProfileCareerButton")?.addEventListener("click", resetProfileCareer);
    document.querySelectorAll("[data-reset-profile-tournament]").forEach((button) => {
      button.addEventListener("click", resetProfileTournament);
    });
    document.querySelector("[data-watch-profile-user]")?.addEventListener("click", (event) => {
      startProfileSpectator(event.currentTarget.dataset.watchProfileUser, event.currentTarget.dataset.watchProfileLabel);
    });
    attachImageZoomHandlers(els.profileContent);
  } catch (error) {
    if (els.profileContent) els.profileContent.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message)}</div>`;
  }
}

function startProfileSpectator(userId, label = "Partie en cours") {
  if (!userId) return;
  SPECTATOR_MODE.enabled = true;
  SPECTATOR_MODE.source = "profile";
  SPECTATOR_MODE.profileUserId = userId;
  SPECTATOR_MODE.returnProfileUserId = userId;
  SPECTATOR_MODE.matchLabel = label;
  SPECTATOR_MODE.liveScore = "Connexion au direct...";
  SOLO_AI.enabled = false;
  document.body.classList.add("spectator-mode");
  showGameScreen();
  pollProfileSpectatorState();
  window.clearInterval(SPECTATOR_MODE.pollTimer);
  SPECTATOR_MODE.pollTimer = window.setInterval(pollProfileSpectatorState, 800);
}

async function pollProfileSpectatorState() {
  if (!SPECTATOR_MODE.enabled || SPECTATOR_MODE.source !== "profile" || !SPECTATOR_MODE.profileUserId) return;
  try {
    const response = await fetch(`/api/profiles/${encodeURIComponent(SPECTATOR_MODE.profileUserId)}/watch`);
    if (!response.ok) throw new Error("watch ended");
    const data = await response.json();
    if (!data.active || !data.state) throw new Error("watch ended");
    SPECTATOR_MODE.matchLabel = `${data.type || "Partie en cours"} Â· ${data.opponent || "Adversaire"}`;
    SPECTATOR_MODE.liveScore = data.score || "En direct";
    for (const key of SYNC_STATE_KEYS) {
      if (Object.prototype.hasOwnProperty.call(data.state, key)) state[key] = cloneData(data.state[key]);
    }
    const watchedPlayerIndex = Number(data.playerIndex ?? 0);
    if (state.players?.[watchedPlayerIndex] && data.playerNickname) {
      state.players[watchedPlayerIndex].nickname = data.playerNickname;
    }
    if (state.tournament?.active && watchedPlayerIndex === 0 && data.playerNickname) {
      state.tournament.humanNickname = data.playerNickname;
    }
    state.pendingBoost = null;
    state.pendingEffectChoice = null;
    state.pendingCoachChoice = null;
    state.pendingRemoveChoice = null;
    state.pendingEndTurnAfterChoice = null;
    showGameScreen();
    render();
  } catch (error) {
    quitFriendlySpectator(true);
  }
}

async function saveProfileRankingScores(event) {
  if (!canAccessAdminFeatures()) return;
  const userId = event.currentTarget?.dataset.profileAdminUser;
  if (!userId) return;
  const periods = Array.from(document.querySelectorAll("[data-profile-score-key]")).map((input) => ({
    key: input.dataset.profileScoreKey,
    points: Math.max(0, Math.round(Number(input.value || 0))),
  }));
  const weeklyAttempts = Math.max(0, Math.round(Number(document.querySelector("[data-profile-weekly-attempts]")?.value || 0)));
  try {
    await authRequest(`/api/admin/users/${encodeURIComponent(userId)}/ranking-scores`, { periods, weeklyAttempts });
    await loadProfile(userId);
    await loadRanking(1);
  } catch (error) {
    if (els.profileContent) els.profileContent.insertAdjacentHTML("afterbegin", `<div class="lobby-empty">${escapeHtml(error.message)}</div>`);
  }
}

async function saveAiProfileRankingScores(event) {
  if (!canAccessAdminFeatures()) return;
  const characterId = event.currentTarget?.dataset.aiCharacterId;
  if (!characterId) return;
  const periods = Array.from(document.querySelectorAll("[data-ai-profile-score-key]")).map((input) => ({
    key: input.dataset.aiProfileScoreKey,
    points: Math.max(0, Math.round(Number(input.value || 0))),
  }));
  const seasonTotal = Math.max(0, Math.round(Number(document.querySelector("[data-ai-profile-season-total]")?.value || 0)));
  try {
    await authRequest(`/api/admin/ai-players/${encodeURIComponent(characterId)}/ranking-scores`, { periods, seasonTotal });
    await loadRanking(1);
    await loadProfile(`ai:${characterId}`);
  } catch (error) {
    if (els.profileContent) els.profileContent.insertAdjacentHTML("afterbegin", `<div class="lobby-empty">${escapeHtml(error.message)}</div>`);
  }
}

async function resetProfileTournament(event) {
  if (!canAccessAdminFeatures()) return;
  const button = event.currentTarget;
  const userId = button?.dataset.profileAdminUser;
  const competitionId = button?.dataset.resetProfileTournament;
  const season = Number(button?.dataset.resetProfileSeason || 0);
  const week = Number(button?.dataset.resetProfileWeek || 0);
  if (!userId || !competitionId) return;
  if (!window.confirm("RÃ©initialiser ce tournoi Ã  0 ? Les points, la sauvegarde et le dernier adversaire seront dÃ©finitivement effacÃ©s.")) return;
  button.disabled = true;
  try {
    await authRequest(`/api/admin/users/${encodeURIComponent(userId)}/tournaments/${encodeURIComponent(competitionId)}/reset`, { season, week });
    await loadProfile(userId);
    await loadRanking(1);
  } catch (error) {
    button.disabled = false;
    if (els.profileContent) els.profileContent.insertAdjacentHTML("afterbegin", `<div class="lobby-empty">${escapeHtml(error.message)}</div>`);
  }
}

async function resetProfileCareer(event) {
  if (!canAccessAdminFeatures()) return;
  const userId = event.currentTarget?.dataset.profileAdminUser;
  if (!userId || !window.confirm("RÃ©initialiser dÃ©finitivement le palmarÃ¨s et les statistiques de classement mondial de ce joueur ?")) return;
  try {
    await authRequest(`/api/admin/users/${encodeURIComponent(userId)}/reset-career`, {});
    await loadProfile(userId);
  } catch (error) {
    if (els.profileContent) els.profileContent.insertAdjacentHTML("afterbegin", `<div class="lobby-empty">${escapeHtml(error.message)}</div>`);
  }
}

function characterPageMarkup(profile) {
  const user = profile?.user || AUTH_STATE.user;
  const options = profileCharacterOptionsForCurrentUser();
  const selectedProfileCharacter = options.includes(user?.selectedCharacterId) ? user.selectedCharacterId : options[0] || "coachJu";
  const characterRows = options.map((characterId) => {
    const image = PROFILE_CHARACTER_IMAGES[characterId] || CHARACTER_IMAGES[characterId]?.[0] || CHARACTER_IMAGES.coachUnknown[0];
    const name = characterNameFromId(characterId);
    return `
      <button class="profile-character-choice ${selectedProfileCharacter === characterId ? "active" : ""}" type="button" data-profile-character="${escapeHtml(characterId)}" data-profile-character-image="${escapeHtml(image)}" data-profile-character-name="${escapeHtml(name)}">
        <span class="character-choice-check" aria-hidden="true">âœ“</span>
        <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" />
        <span><strong>${escapeHtml(name)}</strong><small>${selectedProfileCharacter === characterId ? "Personnage actuel" : "Disponible"}</small></span>
      </button>
    `;
  }).join("");
  const roleHint = canAccessAllCharacters()
    ? "Tous les personnages sont disponibles pour ce compte."
    : currentUserRole() === "pro"
      ? "Votre compte PRO peut choisir parmi les 4 coachs et Milan Verhaegen."
      : "Les comptes Free peuvent choisir parmi les 4 coachs.";
  const selectedImage = PROFILE_CHARACTER_IMAGES[selectedProfileCharacter] || CHARACTER_IMAGES[selectedProfileCharacter]?.[0] || CHARACTER_IMAGES.coachUnknown[0];
  return `
    <div class="character-selection-layout">
      <aside class="character-selection-preview">
        <div class="character-preview-image"><img id="characterPreviewImage" src="${escapeHtml(selectedImage)}" alt="${escapeHtml(characterNameFromId(selectedProfileCharacter))}" /></div>
        <div class="character-preview-copy">
          <p class="label">Personnage sÃ©lectionnÃ©</p>
          <h2 id="characterPreviewName">${escapeHtml(characterNameFromId(selectedProfileCharacter))}</h2>
          <p>Ce personnage apparaÃ®tra comme votre avatar dans le lobby et reprÃ©sentera votre profil sur le Circuit.</p>
          <button id="saveProfileCharacterButton" class="primary-button" type="button">Choisir ce personnage</button>
        </div>
      </aside>
      <section class="character-selection-gallery">
        <div class="character-gallery-heading"><div><p class="label">Vestiaire</p><h2>Personnages disponibles</h2></div><span>${options.length} choix</span></div>
        <p class="character-role-hint">${escapeHtml(roleHint)}</p>
        <div class="profile-character-grid character-screen-grid">${characterRows}</div>
      </section>
    </div>
  `;
}

async function loadCharacterPage() {
  if (!AUTH_STATE.user) return;
  if (els.characterContent) els.characterContent.innerHTML = '<div class="lobby-empty">Chargement des personnages...</div>';
  try {
    AUTH_STATE.profile = AUTH_STATE.profile || await authRequest("/api/profile");
    if (els.characterContent) els.characterContent.innerHTML = characterPageMarkup(AUTH_STATE.profile);
    document.querySelector("#saveProfileCharacterButton")?.addEventListener("click", saveProfileCharacter);
    document.querySelectorAll("[data-profile-character]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-profile-character]").forEach((candidate) => candidate.classList.remove("active"));
        button.classList.add("active");
        const previewImage = document.querySelector("#characterPreviewImage");
        const previewName = document.querySelector("#characterPreviewName");
        if (previewImage) {
          previewImage.src = button.dataset.profileCharacterImage || "";
          previewImage.alt = button.dataset.profileCharacterName || "Personnage sÃ©lectionnÃ©";
        }
        if (previewName) previewName.textContent = button.dataset.profileCharacterName || "Personnage sÃ©lectionnÃ©";
      });
    });
  } catch (error) {
    if (els.characterContent) els.characterContent.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function saveProfileCharacter() {
  const selected = document.querySelector("[data-profile-character].active")?.dataset.profileCharacter || "tennisHope";
  try {
    const data = await authRequest("/api/profile/character", { characterId: selected });
    applyAuthenticatedUser(data.user);
    AUTH_STATE.profile = null;
    showProfileScreen();
  } catch (error) {
    if (els.characterContent) els.characterContent.insertAdjacentHTML("afterbegin", `<div class="lobby-empty">${escapeHtml(error.message)}</div>`);
  }
}

async function saveProfileNickname() {
  const nickname = document.querySelector("#profileNicknameInput")?.value?.trim() || "";
  if (!nickname) return;
  try {
    const data = await authRequest("/api/profile/nickname", { nickname });
    applyAuthenticatedUser(data.user);
    await loadProfile();
  } catch (error) {
    if (els.profileContent) els.profileContent.insertAdjacentHTML("afterbegin", `<div class="lobby-empty">${escapeHtml(error.message)}</div>`);
  }
}

async function redeemProfileProCode() {
  const code = document.querySelector("#profileProCodeInput")?.value?.trim().toUpperCase() || "";
  if (!code) return;
  try {
    const data = await authRequest("/api/auth/redeem-pro-code", { code });
    applyAuthenticatedUser(data.user);
    await loadProfile();
    await loadCompetitions();
    await loadRanking(1);
  } catch (error) {
    if (els.profileContent) els.profileContent.insertAdjacentHTML("afterbegin", `<div class="lobby-empty">${escapeHtml(error.message)}</div>`);
  }
}

async function adminAdvanceCircuitWeek() {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("Passer Ã  la semaine suivante du circuit ? Cette action est immÃ©diate.")) return;
  renderAuthState("Passage Ã  la semaine suivante...");
  try {
    await authRequest("/api/admin/circuit/next-week", {});
    await loadCompetitions();
    await loadRanking(1);
    renderAuthState("Semaine suivante activÃ©e.");
  } catch (error) {
    renderAuthState(error.message);
  }
}

async function adminRestartCurrentSeason() {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("Relancer la saison en cours ? Les palmarÃ¨s et calendriers humains de la saison seront remis Ã  zÃ©ro, mais les points des 4 derniÃ¨res semaines seront conservÃ©s.")) return;
  renderAuthState("Relance de la saison...");
  try {
    await authRequest("/api/admin/circuit/restart-season", {});
    await loadCompetitions();
    await loadRanking(1);
    renderAuthState("Saison relancÃ©e.");
  } catch (error) {
    renderAuthState(error.message);
  }
}

async function adminRestartSeasonOne() {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("RESTART SAISON 1 : rÃ©initialiser la saison, les palmarÃ¨s et les statistiques mondiales ? Les quatre semaines de rÃ©fÃ©rence humaines seront conservÃ©es comme historique avant la saison 1.")) return;
  if (!window.confirm("Confirmer une seconde fois le redÃ©marrage complet de la SAISON 1 ?")) return;
  renderAuthState("RedÃ©marrage de la saison 1...");
  try {
    await authRequest("/api/admin/circuit/restart-season-one", {});
    AUTH_STATE.rankingSort = "points";
    await loadCompetitions();
    await loadRanking(1);
    await loadAdminUsers(1);
    renderAuthState("Saison 1 redÃ©marrÃ©e.");
  } catch (error) {
    renderAuthState(error.message);
  }
}

function changeRankingSort(sortBy) {
  AUTH_STATE.rankingSort = ["points", "week", "season"].includes(sortBy) ? sortBy : "points";
  loadLobbyRanking();
  if (!els.rankingScreen?.classList.contains("hidden")) loadRanking(1);
}

async function loadRanking(page = AUTH_STATE.rankingPage || 1) {
  if (!canAccessProFeatures()) {
    if (els.rankingFullList) els.rankingFullList.innerHTML = '<div class="lobby-empty">RÃ©servÃ© aux joueurs Pro.</div>';
    return;
  }
  const userId = authenticatedUserId();
  try {
    AUTH_STATE.rankingPage = page;
    const data = await authRequest(`/api/ranking?page=${encodeURIComponent(page)}&pageSize=25&sort=${encodeURIComponent(AUTH_STATE.rankingSort)}`);
    if (authenticatedUserId() !== userId || String(data?.currentUserRank?.id || "") !== userId) return;
    AUTH_STATE.ranking = data;
    AUTH_STATE.rankingUserId = userId;
    renderRanking();
  } catch (error) {
    if (els.rankingFullList) els.rankingFullList.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function loadLobbyRanking() {
  if (!canAccessProFeatures()) {
    if (els.rankingList) els.rankingList.innerHTML = '<div class="lobby-empty">RÃ©servÃ© aux joueurs Pro.</div>';
    return;
  }
  const userId = authenticatedUserId();
  try {
    const ranking = await authRequest(`/api/ranking?page=1&pageSize=20&sort=${encodeURIComponent(AUTH_STATE.rankingSort)}`);
    if (authenticatedUserId() !== userId || String(ranking?.currentUserRank?.id || "") !== userId) return;
    AUTH_STATE.lobbyRanking = ranking;
    AUTH_STATE.lobbyRankingUserId = userId;
    renderRanking();
  } catch (error) {
    if (els.rankingList) els.rankingList.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message)}</div>`;
  }
}

function renderCompetitions() {
  if (!els.weeklyCompetitionsList) return;
  const competitions = AUTH_STATE.competitions?.competitions || [];
  const bestScores = AUTH_STATE.competitions?.bestScores || {};
  const bestPerformances = AUTH_STATE.competitions?.bestPerformances || {};
  if (!competitions.length) {
    els.weeklyCompetitionsList.innerHTML = '<div class="lobby-empty">Aucune compÃ©tition gÃ©nÃ©rÃ©e.</div>';
    renderCircuitDashboard();
    return;
  }
  const retriesUsed = Number(AUTH_STATE.competitions?.retriesUsed || 0);
  const retryLimit = Number(AUTH_STATE.competitions?.retryLimit || 5);
  const remainingAttempts = Math.max(0, retryLimit - retriesUsed);
  els.weeklyCompetitionsList.innerHTML = `
    <div class="circuit-attempt-banner ${remainingAttempts ? "" : "empty"}">
      <span><strong>${remainingAttempts}</strong> tentative${remainingAttempts > 1 ? "s" : ""} d'amÃ©lioration restante${remainingAttempts > 1 ? "s" : ""}</span>
      <small id="weeklyCountdown">${escapeHtml(formatCountdown(AUTH_STATE.competitions?.nextUpdateAt))}</small>
    </div>
    ${competitions.map((competition) => {
      const alreadyPlayed = Object.prototype.hasOwnProperty.call(bestScores, competition.id);
      const singleEntryLeague = competition.eventType === "League"
        || ["Prestige League", "Ultimate League"].includes(competition.level);
      const replayLocked = alreadyPlayed && singleEntryLeague;
      const canReplay = !alreadyPlayed || (!replayLocked && retriesUsed < retryLimit);
      const label = replayLocked ? "TerminÃ©" : alreadyPlayed ? "Rejouer" : "Jouer";
      const replayClass = alreadyPlayed ? "replay-button" : "";
      const saved = savedTournamentProgress(competition.id);
      const performance = bestPerformances[competition.id] || null;
      const performanceOpponent = String(performance?.lastOpponent || "").trim();
      const performanceScore = String(performance?.lastScore || "").trim();
      const performanceMarkup = alreadyPlayed
        ? `<span class="circuit-best-performance">
            <small>Meilleure performance</small>
            <span class="circuit-performance-line"><strong>${escapeHtml(performance?.label || "RÃ©sultat enregistrÃ©")}</strong><em>${Number(performance?.points ?? bestScores[competition.id] ?? 0)} pts</em></span>
            ${(performanceOpponent || performanceScore) ? `<span class="circuit-performance-detail">${performanceOpponent ? escapeHtml(performanceOpponent) : ""}${performanceOpponent && performanceScore ? " Â· " : ""}${performanceScore ? escapeHtml(performanceScore) : ""}</span>` : ""}
          </span>`
        : '<span class="circuit-best-performance not-played"><strong>Nâ€™A PAS ENCORE PARTICIPÃ‰</strong></span>';
      const category = String(competition.type || competition.name || "Tournoi");
      const categoryKey = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
      return `
      <article class="weekly-competition circuit-competition-card" data-competition-category="${escapeHtml(categoryKey)}">
        <div class="circuit-competition-head">
          <span class="circuit-competition-category">${escapeHtml(category)}</span>
          <span class="circuit-competition-state ${saved ? "saved" : alreadyPlayed ? "played" : "new"}">${saved ? "SauvegardÃ©" : replayLocked ? "Participation terminÃ©e" : alreadyPlayed ? "DÃ©jÃ  jouÃ©" : "Ã€ jouer"}</span>
        </div>
        <div class="circuit-competition-copy">
          <h3>${escapeHtml(competition.name)}</h3>
          <span>${escapeHtml(competition.city || "")} Â· ${escapeHtml(competition.country || "")} ${escapeHtml(competition.flag || "")}</span>
          <div class="circuit-competition-meta">
            <span>${escapeHtml(competition.surfaceLabel)}</span>
            <span>${Number(competition.targetSets || 2)} sets gagnants</span>
            ${singleEntryLeague ? '<span class="single-entry-league-badge">Non rejouable</span>' : ""}
          </div>
        </div>
        <div class="circuit-competition-footer">
          ${performanceMarkup}
          <div class="weekly-competition-actions">
            ${saved ? "" : `<button class="small-button ${replayClass}" type="button" data-start-weekly-competition="${escapeHtml(competition.id)}" ${canReplay ? "" : "disabled"} title="${replayLocked ? "Une seule participation est autorisÃ©e pour cette League." : ""}">${label}</button>`}
            ${saved ? `<button class="small-button resume-button" type="button" data-resume-weekly-competition="${escapeHtml(competition.id)}">Reprendre</button>` : ""}
          </div>
        </div>
      </article>
    `;
    }).join("")}
  `;
  els.weeklyCompetitionsList.querySelectorAll("[data-start-weekly-competition]").forEach((button) => {
    button.addEventListener("click", () => startWeeklyCompetition(button.dataset.startWeeklyCompetition));
  });
  els.weeklyCompetitionsList.querySelectorAll("[data-resume-weekly-competition]").forEach((button) => {
    button.addEventListener("click", () => resumeWeeklyCompetition(button.dataset.resumeWeeklyCompetition));
  });
  renderCircuitDashboard();
  startWeeklyCountdown();
}

function formatCountdown(isoValue) {
  if (!isoValue) return "Prochaine semaine : --";
  const ms = new Date(isoValue).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return "Prochaine semaine bientÃ´t";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const dayText = days ? `${days} jour${days > 1 ? "s" : ""} ` : "";
  return `Prochaine semaine dans ${dayText}${hours}h ${minutes}m ${seconds}s`;
}

function startWeeklyCountdown() {
  window.clearInterval(weeklyCountdownTimer);
  const tick = () => {
    const target = document.querySelector("#weeklyCountdown");
    const heroTarget = els.circuitHeroCountdown;
    if (!target && !heroTarget) {
      window.clearInterval(weeklyCountdownTimer);
      weeklyCountdownTimer = null;
      return;
    }
    const countdown = formatCountdown(AUTH_STATE.competitions?.nextUpdateAt);
    if (target) target.textContent = countdown;
    if (heroTarget) heroTarget.textContent = countdown;
  };
  tick();
  weeklyCountdownTimer = window.setInterval(tick, 1000);
}

async function loadCompetitions() {
  if (!canAccessProFeatures()) {
    if (els.weeklyCompetitionsList) els.weeklyCompetitionsList.innerHTML = "";
    return;
  }
  const userId = authenticatedUserId();
  try {
    const competitions = await authRequest("/api/competitions");
    if (authenticatedUserId() !== userId) return;
    AUTH_STATE.competitions = competitions;
    AUTH_STATE.competitionsUserId = userId;
    renderCompetitions();
  } catch (error) {
    if (els.weeklyCompetitionsList) els.weeklyCompetitionsList.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message)}</div>`;
  }
}

function weeklyCompetitionById(competitionId) {
  return (AUTH_STATE.competitions?.competitions || []).find((competition) => competition.id === competitionId) || null;
}

function currentCircuitSaveKey(competitionId, period = {}) {
  const season = Number(period.season || AUTH_STATE.competitions?.season || 1);
  const week = Number(period.week || AUTH_STATE.competitions?.week || 1);
  const userId = authenticatedUserId() || "guest";
  return `tennisLightTournamentSave:${userId}:${season}:${week}:${competitionId}`;
}

function savedTournamentProgress(competitionId) {
  const serverSaveIds = AUTH_STATE.competitions?.savedTournamentIds || [];
  if (serverSaveIds.includes(competitionId)) return { server: true };
  try {
    const raw = localStorage.getItem(currentCircuitSaveKey(competitionId));
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const resetAt = AUTH_STATE.competitions?.resetAtByCompetition?.[competitionId];
    if (resetAt && Date.parse(saved?.savedAt || 0) <= Date.parse(resetAt)) {
      localStorage.removeItem(currentCircuitSaveKey(competitionId));
      return null;
    }
    return saved;
  } catch (error) {
    return null;
  }
}

async function saveTournamentProgress() {
  if (!state.tournament?.weekly || !state.tournament.competitionId || state.tournament.stage === "complete") return false;
  const save = {
    savedAt: new Date().toISOString(),
    state: cloneData(state),
    soloAi: cloneData(SOLO_AI),
    serverSync: cloneData(SERVER_SYNC),
    humanMatchTelemetry: cloneData(HUMAN_MATCH_TELEMETRY.active),
  };
  if (save.state?.tutorial) {
    save.state.tutorial = inactiveTutorialState(save.state.tutorial);
  }
  const period = {
    season: state.tournament.competitionSeason,
    week: state.tournament.competitionWeek,
  };
  let saved = false;
  try {
    localStorage.setItem(currentCircuitSaveKey(state.tournament.competitionId, period), JSON.stringify(save));
    saved = true;
  } catch (error) {
    state.log.unshift(`Sauvegarde locale impossible : ${error.message}`);
  }
  if (AUTH_STATE.user && canAccessProFeatures()) {
    try {
      await authRequest(`/api/competitions/${encodeURIComponent(state.tournament.competitionId)}/save`, { save });
      AUTH_STATE.competitions ||= {};
      const ids = new Set(AUTH_STATE.competitions.savedTournamentIds || []);
      ids.add(state.tournament.competitionId);
      AUTH_STATE.competitions.savedTournamentIds = [...ids];
      saved = true;
    } catch (error) {
      state.log.unshift(`Sauvegarde serveur impossible : ${error.message}`);
    }
  }
  return saved;
}

async function deleteTournamentProgress(competitionId = state.tournament?.competitionId) {
  if (!competitionId) return;
  try {
    localStorage.removeItem(currentCircuitSaveKey(competitionId));
  } catch (error) {
    state.log.unshift(`Suppression sauvegarde locale impossible : ${error.message}`);
  }
  if (AUTH_STATE.user && canAccessProFeatures()) {
    try {
      await fetch(`/api/competitions/${encodeURIComponent(competitionId)}/save`, { method: "DELETE" });
      if (AUTH_STATE.competitions?.savedTournamentIds) {
        AUTH_STATE.competitions.savedTournamentIds = AUTH_STATE.competitions.savedTournamentIds.filter((id) => id !== competitionId);
      }
    } catch (error) {
      state.log.unshift(`Suppression sauvegarde serveur impossible : ${error.message}`);
    }
  }
}

function restoreStateSnapshot(snapshot) {
  if (!snapshot?.state) return false;
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, cloneData(snapshot.state));
  resetTutorialMode();
  Object.assign(SOLO_AI, cloneData(snapshot.soloAi || {}));
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  SOLO_AI.recoveryTurnKey = null;
  SOLO_AI.recoveryCount = 0;
  SOLO_AI.timer = null;
  SOLO_AI.nudgeTimer = null;
  SOLO_AI.nudgeAutoTimer = null;
  SOLO_AI.watchdogTimer = null;
  const restoredUltimate = snapshot.ultimateMode || null;
  const inferredUltimate = !restoredUltimate && state.players?.some((player) => (
    ["alessandraConti", "calvinBrentwood"].includes(player?.characterId)
      || player?.hand?.some((card) => card?.ultimateOfficial)
      || player?.played?.some((card) => card?.ultimateOfficial)
  ));
  if (restoredUltimate || inferredUltimate) {
    Object.assign(ULTIMATE_MODE, cloneData(restoredUltimate || {}));
    ULTIMATE_MODE.active = restoredUltimate ? Boolean(restoredUltimate.active) : true;
    ULTIMATE_MODE.draftSelected = new Set(Array.isArray(restoredUltimate?.draftSelected) ? restoredUltimate.draftSelected : []);
    ULTIMATE_MODE.turnSafetyTimer = null;
    ULTIMATE_MODE.turnRecoveryTimer = null;
    detachUltimateFromOnlineSession();
    SOLO_AI.enabled = true;
    SOLO_AI.playerIndex = 1;
  } else {
    ULTIMATE_MODE.active = false;
    ULTIMATE_MODE.postExchange = null;
    ULTIMATE_MODE.markChoice = null;
  }
  auditUltimateRuntime("restore");
  if (snapshot.humanMatchTelemetry?.status === "active") {
    HUMAN_MATCH_TELEMETRY.active = cloneData(snapshot.humanMatchTelemetry);
    HUMAN_MATCH_TELEMETRY.forceNew = false;
    writeStoredJson(ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY, HUMAN_MATCH_TELEMETRY.active);
  }
  return true;
}

async function fetchSavedTournamentProgress(competitionId) {
  if (AUTH_STATE.user && canAccessProFeatures()) {
    try {
      const data = await authRequest(`/api/competitions/${encodeURIComponent(competitionId)}/save`);
      if (data.save) return data.save;
    } catch (error) {
      state.log.unshift(`Sauvegarde serveur indisponible : ${error.message}`);
    }
  }
  return savedTournamentProgress(competitionId);
}

async function resumeWeeklyCompetition(competitionId) {
  await showTournamentLoadingDialog("Votre tournoi du Circuit Pro est en train d'Ãªtre chargÃ©.");
  try {
    const saved = await fetchSavedTournamentProgress(competitionId);
    if (!saved || !restoreStateSnapshot(saved)) {
      renderAuthState("Sauvegarde indisponible.");
      renderCompetitions();
      return;
    }
    resetTutorialMode();
    showGameScreen();
    applySurfaceBackground(state.tournament?.competitionSurface);
    render();
  } finally {
    hideTournamentLoadingDialog();
  }
}

async function startWeeklyCompetition(competitionId) {
  resetTutorialMode();
  if (!canAccessProFeatures()) {
    renderAuthState("Le Tennis Courts Pro Circuit est rÃ©servÃ© aux joueurs Pro.");
    return;
  }
  await showTournamentLoadingDialog("Votre tournoi du Circuit Pro est en train d'Ãªtre crÃ©Ã©.");
  try {
    await ensureGameplayRanking();
    await ensureGameplayProfile(true);
    const competition = weeklyCompetitionById(competitionId);
    if (!competition) {
      renderAuthState("Tournoi indisponible. Actualise le classement.");
      return;
    }
    try {
      await authRequest(`/api/competitions/${encodeURIComponent(competitionId)}/attempt`, {});
      await loadCompetitions();
    } catch (error) {
      renderAuthState(error.message);
      return;
    }
    applySurfaceBackground(competition.surface);
    const targetSets = Number(competition.targetSets || 2);
    try {
      if (competition.eventType === "League") startLeagueTournamentMode(targetSets, { competition });
      else startTournamentMode(targetSets, { competition });
      showGameScreen();
      render();
    } catch (error) {
      resetTournament();
      SOLO_AI.enabled = false;
      showMenuScreen();
      renderAuthState("Le tournoi n'a pas pu dÃ©marrer. RÃ©essaie depuis le lobby.");
      console.error("Circuit tournament launch failed", error);
    }
  } finally {
    hideTournamentLoadingDialog();
  }
}

function nicknameValue() {
  const value = els.nicknameInput?.value?.trim()
    || state.tournament?.humanNickname
    || AUTH_STATE.user?.nickname
    || MENU_STATE.nickname
    || "";
  return value || selectedPlayerName();
}

function updateMenuSelection() {
  if (els.nicknameInput) els.nicknameInput.value = MENU_STATE.nickname;
  els.coachChoiceButtons?.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.menuCoach) === MENU_STATE.selectedPlayerIndex);
  });
  updateLobbyProfileAvatar();
}

function updateLobbyProfileAvatar() {
  if (!els.lobbyProfileAvatar) return;
  const characterId = selectedCharacterId();
  els.lobbyProfileAvatar.src = PROFILE_CHARACTER_IMAGES[characterId]
    || PROFILE_CHARACTER_IMAGES[profileSelectedCharacterId()]
    || PROFILE_CHARACTER_IMAGES.coachJu;
  els.lobbyProfileAvatar.alt = characterNameFromId(characterId);
}

function applySurfaceBackground(surface = null) {
  document.body.classList.remove("surface-hard", "surface-grass", "surface-clay");
  if (surface === "grass") document.body.classList.add("surface-grass");
  if (surface === "clay") document.body.classList.add("surface-clay");
  if (surface === "hard") document.body.classList.add("surface-hard");
}

function showTournamentLoadingDialog(message = "Le tournoi est en train d'Ãªtre chargÃ©.", title = "Chargement du tournoi") {
  if (!els.tournamentLoadingDialog) return Promise.resolve();
  if (els.tournamentLoadingTitle) els.tournamentLoadingTitle.textContent = title;
  if (els.tournamentLoadingMessage) els.tournamentLoadingMessage.textContent = message;
  els.tournamentLoadingDialog.classList.remove("hidden");
  els.tournamentLoadingDialog.setAttribute("aria-hidden", "false");
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
}

function hideTournamentLoadingDialog() {
  els.tournamentLoadingDialog?.classList.add("hidden");
  els.tournamentLoadingDialog?.setAttribute("aria-hidden", "true");
}

function setLobbyAccountPanelOpen(open) {
  const shouldOpen = Boolean(open);
  els.lobbyAccountPanel?.classList.toggle("hidden", !shouldOpen);
  els.lobbyUserButton?.setAttribute("aria-expanded", String(shouldOpen));
}

function hideLobbySectionScreen() {
  els.lobbySectionScreen?.classList.add("hidden");
}

function hideStandaloneScreens() {
  [
    els.gameApp,
    els.mobileGameApp,
    els.friendlyLobbyScreen,
    els.aiClubHouseScreen,
    els.championshipLobbyScreen,
    els.competitionSummaryScreen,
    els.adminScreen,
    els.rankingScreen,
    els.circuitInfoScreen,
    els.soloInfoScreen,
    els.onlineInfoScreen,
    els.academyInfoScreen,
    els.tutorialModulesScreen,
    els.newsArchiveScreen,
    els.profileScreen,
    els.characterScreen,
    els.resetPasswordScreen,
  ].forEach((screen) => screen?.classList.add("hidden"));
  window.TennisLightMobileGame?.clearSelectedView();
}

function showLobbySection(sectionName) {
  const section = ["training", "solo", "online", "circuit"].includes(sectionName) ? sectionName : "training";
  if (section === "solo") {
    showAiClubHouseScreen();
    return;
  }
  if (["online", "circuit"].includes(section) && !canAccessProFeatures()) {
    setLobbyAccountPanelOpen(true);
    renderAuthState("RÃ©servÃ© aux joueurs Pro.");
    return;
  }
  setLobbyAccountPanelOpen(false);
  els.menuScreen?.classList.add("hidden");
  hideStandaloneScreens();
  els.lobbySectionScreen?.classList.remove("hidden");
  els.lobbySectionPanels?.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.lobbySectionPanel !== section);
  });
  if (section === "online") refreshLobbyRooms();
  if (section === "circuit") {
    loadLobbyRanking();
    loadCompetitions();
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showGameScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.soloInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.tutorialModulesScreen?.classList.add("hidden");
  els.newsArchiveScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.friendlyLobbyScreen?.classList.add("hidden");
  els.aiClubHouseScreen?.classList.add("hidden");
  els.championshipLobbyScreen?.classList.add("hidden");
  els.gameApp?.classList.remove("hidden");
  window.TennisLightMobileGame?.selectViewForMatch();
  ensureLocalMobileMatchSession();
}

function hideGameScreen() {
  els.gameApp?.classList.add("hidden");
  els.mobileGameApp?.classList.add("hidden");
  window.TennisLightMobileGame?.clearSelectedView();
}

function showFriendlyLobbyScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.soloInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  hideGameScreen();
  els.aiClubHouseScreen?.classList.add("hidden");
  els.championshipLobbyScreen?.classList.add("hidden");
  els.friendlyLobbyScreen?.classList.remove("hidden");
}

function showAiClubHouseScreen() {
  if (!canAccessProFeatures() && AI_CLUB_HOUSE.format !== "match") AI_CLUB_HOUSE.format = "match";
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.aiClubHouseScreen?.classList.remove("hidden");
  applySurfaceBackground(null);
  renderAiClubHouse();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showChampionshipLobbyScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  hideGameScreen();
  els.championshipLobbyScreen?.classList.remove("hidden");
  const lobbyTitle = document.querySelector("#championshipLobbyTitle");
  const lobbySubtitle = document.querySelector("#championshipLobbySubtitle");
  if (lobbyTitle) lobbyTitle.textContent = state.tournament?.onePointMaster ? "1 Point Master" : "Championnat";
  if (lobbySubtitle) lobbySubtitle.textContent = state.tournament?.onePointMaster
    ? "24 joueurs Â· 4 groupes de 6 Â· barrages Â· tableau final"
    : "24 joueurs Â· deux phases de groupes Â· barrages Â· tableau final";
  CHAMPIONSHIP_LOBBY_UI.currentPhase = Number(state.tournament?.championshipPhase || 1);
  CHAMPIONSHIP_LOBBY_UI.openZone = CHAMPIONSHIP_LOBBY_UI.currentPhase;
  renderChampionshipLobby();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showRankingScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  hideGameScreen();
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.rankingScreen?.classList.remove("hidden");
  loadRanking(1);
}

function showMenuScreen() {
  resetTutorialMode();
  setLobbyAccountPanelOpen(false);
  hideStandaloneScreens();
  hideLobbySectionScreen();
  els.friendlyLobbyScreen?.classList.add("hidden");
  els.aiClubHouseScreen?.classList.add("hidden");
  els.championshipLobbyScreen?.classList.add("hidden");
  els.competitionSummaryScreen?.classList.add("hidden");
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.tutorialModulesScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.menuScreen?.classList.remove("hidden");
  applySurfaceBackground(null);
  renderAuthState();
  updateMenuSelection();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showProfileScreen(userId = null) {
  if (!AUTH_STATE.user) return;
  const previousDestination = visibleScreenDestination();
  if (!["profile", "character", "game"].includes(previousDestination)) PAGE_NAVIGATION_STATE.profileReturn = previousDestination;
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.tutorialModulesScreen?.classList.add("hidden");
  hideGameScreen();
  els.aiClubHouseScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.profileScreen?.classList.remove("hidden");
  loadProfile(typeof userId === "string" ? userId : null);
}

function showCharacterScreen() {
  if (!AUTH_STATE.user) return;
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  hideGameScreen();
  els.resetPasswordScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.remove("hidden");
  loadCharacterPage();
}

function showResetPasswordScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  hideGameScreen();
  els.resetPasswordScreen?.classList.remove("hidden");
}

function showAdminScreen() {
  if (!canAccessAdminFeatures()) return;
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  hideGameScreen();
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.adminScreen?.classList.remove("hidden");
  AUTH_STATE.adminPage = 1;
  loadAdminUsers();
  loadAdminProCodes();
  loadAdminAiReport();
}

function showCircuitInfoScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  hideGameScreen();
  els.circuitInfoScreen?.classList.remove("hidden");
  applySurfaceBackground(null);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showSoloInfoScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.soloInfoScreen?.classList.remove("hidden");
  applySurfaceBackground(null);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showOnlineInfoScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.onlineInfoScreen?.classList.remove("hidden");
  applySurfaceBackground(null);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showAcademyInfoScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.friendlyLobbyScreen?.classList.add("hidden");
  els.aiClubHouseScreen?.classList.add("hidden");
  hideGameScreen();
  els.academyInfoScreen?.classList.remove("hidden");
  els.tutorialModulesScreen?.classList.add("hidden");
  applySurfaceBackground(null);
  renderAcademyDeck();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showTutorialModulesScreen() {
  if (!TUTORIALS_ENABLED || !canAccessAdminFeatures()) return;
  resetTutorialMode();
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  hideStandaloneScreens();
  els.tutorialModulesScreen?.classList.remove("hidden");
  applySurfaceBackground(null);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function cardByIdForTutorial(cardId, copyIndex) {
  const card = CARD_LIBRARY.find((item) => item.id === cardId);
  return card ? cloneCard(card, `tutorial-${copyIndex}`) : null;
}

function tutorialHand(cardIds, prefix) {
  return cardIds.map((cardId, index) => cardByIdForTutorial(cardId, `${prefix}-${index}`)).filter(Boolean);
}

function tutorialModule() {
  return TUTORIAL_ENGINE.currentModule(state.tutorial, TUTORIAL_MODULES) ?? TUTORIAL_MODULES.basics;
}

function tutorialStep() {
  return TUTORIAL_ENGINE.currentStep(state.tutorial, TUTORIAL_MODULES);
}

function tutorialExpectedAction() {
  return TUTORIAL_ENGINE.expectedValidation(state.tutorial, TUTORIAL_MODULES);
}

function tutorialProgressStorageKey(userId = authenticatedUserId()) {
  return `${TUTORIAL_PROGRESS_STORAGE_PREFIX}:${userId || "guest"}`;
}

function readLocalTutorialProgress(userId = authenticatedUserId()) {
  try {
    return JSON.parse(localStorage.getItem(tutorialProgressStorageKey(userId)) || "null");
  } catch (error) {
    return null;
  }
}

function restoreLocalTutorialProgress(userId = authenticatedUserId()) {
  const progress = readLocalTutorialProgress(userId);
  if (!progress) return false;
  state.tutorial = TUTORIAL_ENGINE.restore(progress, TUTORIAL_MODULES);
  return true;
}

async function persistTutorialProgress({ remote = true } = {}) {
  const progress = TUTORIAL_ENGINE.snapshot(state.tutorial);
  try {
    localStorage.setItem(tutorialProgressStorageKey(), JSON.stringify(progress));
  } catch (error) {
    state.log?.unshift?.(`Sauvegarde locale du tutoriel impossible : ${error.message}`);
  }
  if (!remote || !AUTH_STATE.user) return progress;
  try {
    await authRequest("/api/tutorial/progress", { progress }, { method: "PUT" });
  } catch (error) {
    state.log?.unshift?.(`Sauvegarde serveur du tutoriel impossible : ${error.message}`);
  }
  return progress;
}

function scheduleTutorialProgressSave() {
  window.clearTimeout(tutorialProgressSaveTimer);
  tutorialProgressSaveTimer = window.setTimeout(() => {
    tutorialProgressSaveTimer = null;
    persistTutorialProgress();
  }, 120);
}

async function synchronizeTutorialProgress() {
  if (!AUTH_STATE.user) {
    restoreLocalTutorialProgress(null);
    return;
  }
  if (state.tutorial.active) {
    await persistTutorialProgress();
    return;
  }
  try {
    const data = await authRequest("/api/tutorial/progress");
    if (data.progress) {
      state.tutorial = TUTORIAL_ENGINE.restore(data.progress, TUTORIAL_MODULES);
      localStorage.setItem(tutorialProgressStorageKey(), JSON.stringify(TUTORIAL_ENGINE.snapshot(state.tutorial)));
    } else {
      await persistTutorialProgress();
    }
  } catch (error) {
    restoreLocalTutorialProgress();
  }
}

function tutorialAllowsPlay(playerIndex, card, mode, boosted = false) {
  if (!state.tutorial.active) return true;
  const action = tutorialExpectedAction();
  if (!action || action.kind !== "play" || !card) return false;
  const expectedMode = boosted ? "boost" : mode;
  const selectionMatches = !action.requiresSelection || state.tutorial.selectedCardUid === card.uid;
  return selectionMatches && action.playerIndex === playerIndex && action.cardId === card.id && action.mode === expectedMode;
}

function tutorialAllowsEndTurn(playerIndex) {
  if (!state.tutorial.active) return true;
  const action = tutorialExpectedAction();
  return action?.kind === "endTurn" && action.playerIndex === playerIndex;
}

function tutorialAllowsPass() {
  if (!state.tutorial.active) return true;
  const action = tutorialExpectedAction();
  return action?.kind === "pass";
}

function tutorialClickArrow() {
  return state.tutorial.active ? '<span class="tutorial-click-arrow" aria-hidden="true"></span>' : "";
}

function tutorialButtonCue(kind, playerIndex, card = null, mode = null, boosted = false) {
  if (!state.tutorial.active) return "";
  const action = tutorialExpectedAction();
  if (!action || action.kind !== kind || action.playerIndex !== playerIndex) return "";
  if (kind === "play") {
    const expectedMode = boosted ? "boost" : mode;
    if (!card || action.cardId !== card.id || action.mode !== expectedMode) return "";
  }
  return tutorialClickArrow();
}

function tutorialSacrificeCue(card) {
  const action = tutorialExpectedAction();
  if (!state.tutorial.active || action?.kind !== "play" || action.mode !== "boost") return "";
  if (action.sacrificeCardId && card.id !== action.sacrificeCardId) return "";
  return tutorialClickArrow();
}

function tutorialFocusClass(target, playerIndex, cardId = null) {
  if (!state.tutorial.active) return "";
  const step = tutorialStep();
  const focuses = [...(step?.focus ?? [])];
  const actionFocuses = [];
  if (step?.action?.kind === "selectCard") {
    actionFocuses.push({ target: "card", playerIndex: step.action.playerIndex, cardId: step.action.cardId });
  }
  if (step?.action?.kind === "play") {
    actionFocuses.push({ target: "play", playerIndex: step.action.playerIndex, cardId: step.action.cardId });
  }
  if (step?.action?.kind === "pass") {
    actionFocuses.push({ target: "pass", playerIndex: step.action.playerIndex });
  }
  const focusMatches = (focus) => (
    focus.target === target
    && (focus.playerIndex == null || focus.playerIndex === playerIndex)
    && (focus.cardId == null || focus.cardId === cardId)
  );
  if (actionFocuses.some(focusMatches)) return " tutorial-focus-target tutorial-action-target";
  return focuses.some(focusMatches) ? " tutorial-focus-target" : "";
}

function clearTutorialTyping() {
  window.clearInterval(tutorialTypingTimer);
  tutorialTypingTimer = null;
}

function tutorialPlainText(text) {
  return (Array.isArray(text) ? text : [text]).filter(Boolean).join(" ");
}

function revealTutorialText() {
  if (!tutorialTypingText) return false;
  clearTutorialTyping();
  tutorialTypingProgress = tutorialTypingText.length;
  updateTutorialTypingDisplay();
  return true;
}

function updateTutorialTypingDisplay() {
  const output = els.tutorialOverlay?.querySelector("[data-tutorial-typed-text]");
  if (output) output.textContent = tutorialTypingText.slice(0, tutorialTypingProgress);
  const button = els.tutorialOverlay?.querySelector("[data-tutorial-next]");
  if (button) button.textContent = tutorialTypingProgress < tutorialTypingText.length
    ? "Afficher tout"
    : (tutorialStep()?.final ? "Terminer la leÃ§on" : "Suivant");
}

function startTutorialTyping(step) {
  const text = tutorialPlainText(step.text);
  if (tutorialTypingStepId !== step.id || tutorialTypingText !== text) {
    clearTutorialTyping();
    tutorialTypingStepId = step.id;
    tutorialTypingText = text;
    tutorialTypingProgress = 0;
    tutorialTypingStartedAt = Date.now();
    tutorialTypingDurationMs = Math.min(1800, Math.max(350, text.length * 10));
  }
  updateTutorialTypingDisplay();
  if (tutorialTypingProgress >= tutorialTypingText.length || tutorialTypingTimer) return;
  tutorialTypingTimer = window.setInterval(() => {
    const elapsed = Date.now() - tutorialTypingStartedAt;
    tutorialTypingProgress = Math.min(
      tutorialTypingText.length,
      Math.ceil(tutorialTypingText.length * (elapsed / tutorialTypingDurationMs)),
    );
    updateTutorialTypingDisplay();
    if (tutorialTypingProgress >= tutorialTypingText.length) clearTutorialTyping();
  }, 14);
}

function selectTutorialCard(playerIndex, cardUid) {
  if (!state.tutorial.active) return;
  const action = tutorialExpectedAction();
  if (action?.kind !== "selectCard") return;
  const card = state.players[playerIndex]?.hand.find((item) => item.uid === cardUid);
  if (!card || action.playerIndex !== playerIndex || action.cardId !== card.id) {
    state.tutorial.error = tutorialStep()?.error ?? "Ce n'est pas la carte attendue. Regarde la carte indiquÃ©e par Coach Ju.";
    render();
    return;
  }
  state.tutorial.selectedCardUid = card.uid;
  state.tutorial.error = null;
  completeTutorialAction({ kind: "selectCard", playerIndex, cardId: card.id });
}

function clearTutorialAutoTimer() {
  window.clearTimeout(tutorialAutoTimer);
  tutorialAutoTimer = null;
  if (state.tutorial) state.tutorial.pendingAutoStepId = null;
}

function inactiveTutorialState(progress = state.tutorial) {
  const source = typeof progress === "boolean"
    ? { ...state.tutorial, academyCompleted: progress, completed: progress }
    : progress;
  return TUTORIAL_ENGINE.deactivate(source, TUTORIAL_MODULES);
}

function resetTutorialMode() {
  clearTutorialAutoTimer();
  clearTutorialTyping();
  state.tutorial = inactiveTutorialState(state.tutorial);
  document.body.classList.remove("tutorial-running", "tutorial-awaiting-action", "tutorial-showcase-active", "tutorial-auto-pending", "tutorial-readonly", "tutorial-interface-tour");
  els.tutorialOverlay?.classList.add("hidden");
  if (els.tutorialOverlay) els.tutorialOverlay.innerHTML = "";
  scheduleTutorialProgressSave();
}

function startTutorial(moduleId = "basics") {
  if (!TUTORIALS_ENABLED) return;
  clearTutorialAutoTimer();
  if (SERVER_SYNC.enabled) {
    leaveOnlineRoom();
  }
  resetTournament();
  resetSetMatch();
  stopSoloTimers();
  SOLO_AI.enabled = false;

  const selectedModuleId = String(moduleId || "basics");
  if (!TUTORIAL_MODULES[selectedModuleId]) {
    console.error(`Module de tutoriel inconnu : ${selectedModuleId}`);
    return;
  }
  const module = TUTORIAL_MODULES[selectedModuleId];
  setupTutorialScenario(module.scenario);
  state.server = 0;
  state.activePlayer = 0;
  state.tutorial = TUTORIAL_ENGINE.start(state.tutorial, TUTORIAL_MODULES, selectedModuleId);
  state.log = module.initialLog ? [...module.initialLog] : ["Tutoriel lancÃ©."];
  captureTurnSnapshot();
  showGameScreen();
  runTutorialAutoSteps();
  render();
  scheduleTutorialProgressSave();
}

function completeTutorialAction(action) {
  if (!state.tutorial.active) return;
  const expected = tutorialExpectedAction();
  if (!TUTORIAL_ENGINE.validationMatches(expected, action)) return;
  state.tutorial.error = null;
  if (expected.kind === "play") state.tutorial.selectedCardUid = null;
  advanceTutorial();
}

function advanceTutorial() {
  if (!state.tutorial.active) return;
  clearTutorialAutoTimer();
  clearTutorialTyping();
  state.tutorial = TUTORIAL_ENGINE.advance(state.tutorial, TUTORIAL_MODULES);
  state.tutorial.error = null;
  runTutorialAutoSteps();
  render();
  scheduleTutorialProgressSave();
}

function finishTutorial() {
  const module = tutorialModule();
  state.tutorial = TUTORIAL_ENGINE.completeModule(state.tutorial, TUTORIAL_MODULES, {
    academyCompleted: Boolean(module.completesAcademy),
  });
  clearTutorialAutoTimer();
  clearTutorialTyping();
  document.body.classList.remove("tutorial-running", "tutorial-awaiting-action", "tutorial-showcase-active", "tutorial-auto-pending", "tutorial-readonly", "tutorial-interface-tour");
  els.tutorialOverlay?.classList.add("hidden");
  if (els.tutorialOverlay) els.tutorialOverlay.innerHTML = "";
  scheduleTutorialProgressSave();
  if (canAccessAdminFeatures()) showTutorialModulesScreen();
  else showMenuScreen();
}

function runTutorialAutoSteps() {
  const step = tutorialStep();
  if (!step?.auto) return;
  const stepKey = step.id ?? `step-${state.tutorial.stepIndex}`;
  state.tutorial.autoCompletedIds = state.tutorial.autoCompletedIds ?? [];
  if (state.tutorial.autoCompletedIds.includes(stepKey)) return;
  state.tutorial.autoCompletedIds.push(stepKey);
  const automaticActions = Array.isArray(step.auto) ? step.auto : [step.auto];
  const delayMs = Math.max(0, Number(step.autoDelayMs) || 0);
  if (!delayMs) {
    automaticActions.forEach((auto) => performTutorialAuto(auto));
    return;
  }
  state.tutorial.pendingAutoStepId = stepKey;
  tutorialAutoTimer = window.setTimeout(() => {
    tutorialAutoTimer = null;
    if (!state.tutorial.active || tutorialStep()?.id !== stepKey) return;
    automaticActions.forEach((auto) => performTutorialAuto(auto));
    state.tutorial.pendingAutoStepId = null;
    render();
  }, delayMs);
}

function performTutorialAuto(auto) {
  if (auto.kind === "scenario") {
    setupTutorialScenario(auto.scenario);
    return;
  }
  if (auto.kind === "pass") {
    pass(auto.playerIndex, true);
    return;
  }
  if (auto.kind === "endTurn") {
    endTurn(auto.playerIndex);
    return;
  }
  if (auto.kind !== "play") return;
  const player = state.players[auto.playerIndex];
  const card = player?.hand.find((item) => item.id === auto.cardId);
  if (!card) return;
  const sacrifice = auto.mode === "boost"
    ? player.hand.find((item) => item.id === auto.sacrificeCardId && item.uid !== card.uid)
    : null;
  playCard(auto.playerIndex, card.uid, auto.mode === "boost", sacrifice?.uid ?? null, auto.mode);
}

function resetTutorialExchange(players, hands, server = 0, activePlayer = server) {
  const usedIds = new Set(hands.flatMap((hand) => hand.map((card) => card.id)));
  state.players = players;
  state.players[0].hand = hands[0];
  state.players[1].hand = hands[1];
  state.deck = CARD_LIBRARY
    .filter((card) => !usedIds.has(card.id))
    .slice(0, Math.max(0, 18 - hands.flat().length))
    .map((card, index) => cloneCard(card, `tutorial-deck-${index}`));
  state.server = server;
  state.activePlayer = activePlayer;
  state.lastCard = null;
  state.boostAvailableFor = null;
  state.mandatoryPlacement = false;
  state.mandatoryPlacementReason = null;
  state.mandatoryPlacementSourceUid = null;
  state.openingServePlayed = false;
  state.returnServiceRestrictionFor = null;
  state.returnServiceRestrictionSpent = [false, false];
  state.returnServiceRestrictionFor = null;
  state.returnServiceRestrictionSpent = [false, false];
  state.turnPlacement = [0, 0];
  state.turnEffectPlacement = [0, 0];
  state.turnHasEffect = [false, false];
  state.turnIgnoresPlacement = [false, false];
  state.turnCannotOpenBoost = [false, false];
  state.turnPlayedCards = [[], []];
  state.latestPlayedCard = null;
  state.gameOver = false;
  state.pendingBoost = null;
  state.pendingEffectChoice = null;
  state.pendingCoachChoice = null;
  state.pendingRemoveChoice = null;
  state.pendingEndTurnAfterChoice = null;
  state.effectNotice = null;
  state.resultInfo = null;
  state.turnDirty = false;
  state.revealAiCards = true;
  state.actionLog = [];
}

function createTutorialPlayedCard(cardId, owner, boosted = false, sacrificeCardId = null) {
  const card = cardByIdForTutorial(cardId, `played-${owner}`);
  const sacrifice = sacrificeCardId ? cardByIdForTutorial(sacrificeCardId, `sacrifice-${owner}`) : null;
  return {
    ...card,
    playedUid: crypto.randomUUID(),
    owner,
    boosted,
    sacrificedCard: sacrifice,
    isServiceTurn: false,
    costPaid: card.cost,
    powerGained: card.power,
    cardPowerGained: card.power,
    effectPowerGained: 0,
    precision: boosted ? card.boostPrecision : card.precision,
    placement: card.placement,
    turnPlacement: card.placement,
    turnEndPlacement: card.placement,
    effectApplied: true,
    effectDeferredUntilEndTurn: false,
    removed: false,
  };
}

function setupTutorialScenario(scenario) {
  const edt = createPlayer("Nouvel Espoir", "tennisHope", "Nouvel Espoir");
  const coachJu = createPlayer("Coach Ju", "coachJu", "Coach Ju");
  const coachMax = createPlayer("Coach Max", "coachMax", "Coach Max");
  if (scenario === "base") {
    resetTutorialExchange(
      [edt, coachJu],
      [
        tutorialHand(["service-coup-droit", "coup-droit-2-2-2", "revers-3-3-3", "volee-2-2-3", "smash-4-2-1", "joker"], "base-edt"),
        tutorialHand(["passing-1-1-4", "volee-2-2-3"], "base-ju"),
      ],
      0,
      0,
    );
  } else if (scenario === "interface") {
    resetTutorialExchange(
      [edt, coachJu],
      [
        tutorialHand(["service-coup-droit", "coup-droit-2-2-2", "revers-3-3-3", "volee-2-2-3", "smash-4-2-1", "joker"], "interface-edt"),
        tutorialHand(["passing-1-1-4", "amortie-2-1-4", "lob-2-0-4", "double", "revers-5-4-1", "volee-3-4-1"], "interface-ju"),
      ],
      0,
      0,
    );
    state.latestPlayedCard = createTutorialPlayedCard("revers-3-3-3", 1);
    state.lastCard = null;
  } else if (scenario === "guided-rally") {
    resetTutorialExchange(
      [edt, coachJu],
      [
        tutorialHand(["service-coup-droit", "coup-droit-4-3-5", "revers-3-3-3", "volee-2-2-3", "smash-4-2-1", "joker"], "guided-rally-edt"),
        tutorialHand(["passing-1-1-4", "lob-2-0-4", "amortie-2-1-4"], "guided-rally-ju"),
      ],
      0,
      0,
    );
    state.players[0].endurance = 7;
    state.players[1].endurance = 7;
  } else if (scenario === "points") {
    resetTutorialExchange(
      [edt, coachJu],
      [
        tutorialHand(["revers-3-3-3", "coup-droit-2-2-2", "amortie-2-1-4"], "points-edt"),
        tutorialHand(["volee-2-2-3", "passing-1-1-4"], "points-ju"),
      ],
      0,
      0,
    );
  } else if (scenario === "boost") {
    resetTutorialExchange(
      [edt, coachJu],
      [
        tutorialHand(["coup-droit-3-3-3", "revers-5-4-1", "joker"], "boost-edt"),
        tutorialHand(["lob-2-0-4", "smash-4-2-1", "double"], "boost-ju"),
      ],
      1,
      1,
    );
  } else if (scenario === "remise") {
    resetTutorialExchange(
      [edt, coachMax],
      [
        tutorialHand(["retour-service", "joker", "coup-droit-2-2-2"], "remise-edt"),
        tutorialHand(["passing-1-1-4"], "remise-max"),
      ],
      0,
      0,
    );
  } else if (scenario === "joker") {
    resetTutorialExchange(
      [edt, coachMax],
      [
        tutorialHand(["joker", "coup-droit-2-2-2"], "joker-edt"),
        tutorialHand(["smash-4-2-1", "double"], "joker-max"),
      ],
      1,
      0,
    );
    const boostedSmash = createTutorialPlayedCard("smash-4-2-1", 1, true, "double");
    state.players[1].played.push(boostedSmash);
    state.latestPlayedCard = { ...boostedSmash };
    state.lastCard = boostedSmash;
    state.mandatoryPlacement = true;
    state.mandatoryPlacementReason = "boost";
    state.mandatoryPlacementSourceUid = boostedSmash.playedUid;
  } else if (scenario === "color") {
    resetTutorialExchange(
      [edt, coachMax],
      [
        tutorialHand(["lob-2-0-4", "double"], "color-edt"),
        tutorialHand(["volee-2-2-3"], "color-max"),
      ],
      1,
      0,
    );
    const volee = createTutorialPlayedCard("volee-2-2-3", 1, false);
    state.players[1].played.push(volee);
    state.latestPlayedCard = { ...volee };
    state.lastCard = volee;
  }
  captureTurnSnapshot();
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
  SOLO_AI.recoveryTurnKey = null;
  SOLO_AI.recoveryCount = 0;
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
  SERVER_SYNC.friendlyMatch = false;
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
    // Le retour Ã  lâ€™accueil ne doit pas Ãªtre bloquÃ© par une rÃ©ponse rÃ©seau absente.
  }
}

function clearOnlineUrlParams() {
  const params = new URLSearchParams(window.location.search);
  ["room", "token", "seat", "host", "targetSets"].forEach((key) => params.delete(key));
  const nextQuery = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
}

function clearFriendlyTournamentUrlParams() {
  const params = new URLSearchParams(window.location.search);
  ["friendlyTournament", "participant", "spectator", "token"].forEach((key) => params.delete(key));
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

function showEventConfirmDialog({ kicker = "Tennis Courts Academy", title, message, highlight = "", confirmLabel = "Confirmer", cancelLabel = "Annuler" }) {
  document.querySelector(".event-confirm-backdrop")?.remove();
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop event-confirm-backdrop";
    const finish = (confirmed) => {
      backdrop.remove();
      resolve(Boolean(confirmed));
    };
    backdrop.innerHTML = `
      <section class="event-transition-panel event-confirm-panel" role="dialog" aria-modal="true" aria-labelledby="eventConfirmTitle">
        <p class="event-transition-kicker">${escapeHtml(kicker)}</p>
        <h2 id="eventConfirmTitle">${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
        ${highlight ? `<strong class="event-confirm-highlight">${escapeHtml(highlight)}</strong>` : ""}
        <div class="event-transition-actions">
          <button class="primary-button" type="button" data-event-confirm>${escapeHtml(confirmLabel)}</button>
          <button class="small-button" type="button" data-event-cancel>${escapeHtml(cancelLabel)}</button>
        </div>
      </section>
    `;
    backdrop.querySelector("[data-event-confirm]")?.addEventListener("click", () => finish(true));
    backdrop.querySelector("[data-event-cancel]")?.addEventListener("click", () => finish(false));
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) finish(false); });
    document.body.appendChild(backdrop);
  });
}

async function confirmReturnToLobby() {
  closeReturnLobbyDialog();
  if (FRIENDLY_TOURNAMENT.enabled) {
    await leaveFriendlyTournamentLobby({ confirmed: true, returnToClubHouse: true });
    return;
  }
  try {
    if (state.tournament?.weekly && state.tournament.stage !== "complete") {
      await saveTournamentProgress();
    } else if (state.tournament?.weekly && state.tournament.stage === "complete") {
      await recordWeeklyCompetitionResult();
      await deleteTournamentProgress();
    } else if (state.tournament?.aiClubHouse && state.tournament.stage !== "complete") {
      const saved = saveAiClubHouseProgress();
      MENU_STATE.lobbyNotice = saved
        ? "Votre compÃ©tition amicale a Ã©tÃ© sauvegardÃ©e."
        : readAiClubHouseSave()
          ? "Une sauvegarde existe dÃ©jÃ  : cette nouvelle compÃ©tition n'a pas remplacÃ© l'ancienne."
          : "La compÃ©tition n'a pas pu Ãªtre sauvegardÃ©e.";
    } else if (state.tournament?.aiClubHouse && state.tournament.stage === "complete") {
      localStorage.removeItem(aiClubHouseSaveKey());
    }
  } catch (error) {
    state.log.unshift(`Retour accueil : ${error.message}`);
  }
  try {
    await notifyServerLeaveRoom();
  } catch (error) {
    state.log.unshift(`Sortie du salon en ligne impossible : ${error.message}`);
  }
  expireLocalMobileMatchSessionAfterExit();
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
  const friendlyTournamentExit = FRIENDLY_TOURNAMENT.enabled;
  const waitingFriendlyExit = friendlyTournamentExit && state.tournament?.stage === "waiting";
  const spectatorExit = friendlyTournamentExit && FRIENDLY_TOURNAMENT.isSpectator;
  const activeFriendlyMatch = friendlyTournamentExit && state.tournament?.currentMatch
    ? tournamentMatchById(state.tournament.currentMatch)
    : null;
  const friendlyMatchGraceSeconds = 20;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop return-lobby-dialog";
  backdrop.innerHTML = `
    <div class="modal return-lobby-modal" role="dialog" aria-modal="true" aria-labelledby="returnLobbyTitle">
      <p class="event-transition-kicker">Tennis Courts Academy</p>
      <h2 id="returnLobbyTitle">${spectatorExit ? "Quitter le mode spectateur ?" : waitingFriendlyExit ? "Quitter ce CLUB HOUSE ?" : activeFriendlyMatch ? "Retourner au Club House ?" : friendlyTournamentExit ? "Retourner au Club House ?" : "Retourner Ã  lâ€™accueil ?"}</h2>
      <p>${friendlyTournamentExit
        ? spectatorExit
          ? "Vous reviendrez au Club House du tournoi."
          : waitingFriendlyExit
            ? "Vous pourrez rejoindre ce CLUB HOUSE de nouveau tant que le tournoi n'est pas lancÃ©."
            : activeFriendlyMatch
              ? `Quitter cette rencontre peut entraÃ®ner un forfait. Elle sera mise en pause et lâ€™espace dâ€™attente du tournoi sera affichÃ©. Vous aurez ${friendlyMatchGraceSeconds} secondes pour la reprendre.`
              : "Vous retrouverez lâ€™espace dâ€™attente et le tableau du tournoi."
        : "La partie en cours sera quittÃ©e et lâ€™accueil sera affichÃ©."}</p>
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

function closeOnlineForfeitDialog() {
  document.querySelector(".online-forfeit-dialog")?.remove();
}

function openOnlineForfeitDialog() {
  if (SPECTATOR_MODE.enabled || state.gameOver || (!SERVER_SYNC.enabled && !FRIENDLY_TOURNAMENT.inMatch)) return;
  closeOnlineForfeitDialog();
  const competitionForfeit = FRIENDLY_TOURNAMENT.enabled;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop online-forfeit-dialog";
  backdrop.innerHTML = `
    <div class="modal return-lobby-modal" role="dialog" aria-modal="true" aria-labelledby="onlineForfeitTitle">
      <p class="event-transition-kicker">DÃ©cision irrÃ©versible</p>
      <h2 id="onlineForfeitTitle">DÃ©clarer forfait ?</h2>
      <p>${competitionForfeit
        ? "Vous perdrez immÃ©diatement le match et serez dÃ©clarÃ© forfait pour toute la compÃ©tition. Vous ne pourrez plus reprendre cet Ã©vÃ©nement."
        : "Vous perdrez immÃ©diatement ce match. La victoire sera automatiquement attribuÃ©e Ã  votre adversaire."}</p>
      <div class="dialog-actions">
        <button class="danger-button" type="button" data-confirm-online-forfeit>CONFIRMER LE FORFAIT</button>
        <button class="small-button" type="button" data-cancel-online-forfeit>ANNULER</button>
      </div>
    </div>
  `;
  backdrop.querySelector("[data-confirm-online-forfeit]")?.addEventListener("click", confirmOnlineForfeit);
  backdrop.querySelector("[data-cancel-online-forfeit]")?.addEventListener("click", closeOnlineForfeitDialog);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeOnlineForfeitDialog();
  });
  document.body.appendChild(backdrop);
}

async function confirmOnlineForfeit() {
  const confirmButton = document.querySelector("[data-confirm-online-forfeit]");
  if (confirmButton instanceof HTMLButtonElement) confirmButton.disabled = true;
  try {
    if (FRIENDLY_TOURNAMENT.enabled) {
      const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/forfeit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ participantId: FRIENDLY_TOURNAMENT.participantId, token: FRIENDLY_TOURNAMENT.token }),
      });
      if (!response.ok) throw new Error("forfeit failed");
      const data = await response.json();
      closeOnlineForfeitDialog();
      leaveOnlineRoom();
      FRIENDLY_TOURNAMENT.inMatch = false;
      FRIENDLY_TOURNAMENT.currentMatchId = null;
      FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = true;
      applyFriendlyTournamentState(data.tournament, null);
      showFriendlyLobbyScreen();
      renderFriendlyLobbyScreen();
      return;
    }
    if (!SERVER_SYNC.enabled || !SERVER_SYNC.roomId || !SERVER_SYNC.token) throw new Error("room unavailable");
    const response = await fetch(`/api/rooms/${encodeURIComponent(SERVER_SYNC.roomId)}/forfeit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: SERVER_SYNC.token }),
    });
    if (!response.ok) throw new Error("forfeit failed");
    const data = await response.json();
    closeOnlineForfeitDialog();
    if (data.state) importSyncState(data.state);
    render();
  } catch (error) {
    if (confirmButton instanceof HTMLButtonElement) confirmButton.disabled = false;
    state.log.unshift("Impossible de dÃ©clarer forfait pour le moment.");
    render();
  }
}

function renderAiClubHouse() {
  const proAccess = canAccessProFeatures();
  if (!proAccess && AI_CLUB_HOUSE.format !== "match") AI_CLUB_HOUSE.format = "match";
  AI_CLUB_HOUSE.difficulty = normalizeAiDifficulty(AI_CLUB_HOUSE.difficulty);
  AI_CLUB_HOUSE.bonus = normalizeAiBonusLevel(AI_CLUB_HOUSE.bonus);
  const isMatch = AI_CLUB_HOUSE.format === "match";
  const isChampionship = ["championship", "onepointmaster"].includes(AI_CLUB_HOUSE.format);
  const isOnePoint = ["onepoint", "onepointmaster"].includes(AI_CLUB_HOUSE.format);
  const isOnePointMaster = AI_CLUB_HOUSE.format === "onepointmaster";
  if (!isOnePoint && AI_CLUB_HOUSE.bonus === "reward") AI_CLUB_HOUSE.bonus = "none";
  els.aiClubSettingButtons?.forEach((button) => {
    const setting = button.dataset.aiClubSetting;
    const expected = {
      format: AI_CLUB_HOUSE.format,
      sets: String(AI_CLUB_HOUSE.targetSets),
      tournamentSize: String(AI_CLUB_HOUSE.tournamentSize),
      difficulty: AI_CLUB_HOUSE.difficulty,
      bonus: AI_CLUB_HOUSE.bonus,
      players: AI_CLUB_HOUSE.players,
      distribution: AI_CLUB_HOUSE.distribution,
    }[setting];
    button.classList.toggle("active", button.dataset.aiClubValue === expected);
    button.disabled = button.hasAttribute("data-pro-format") && !proAccess;
  });
  const rewardButton = document.querySelector('[data-ai-club-setting="bonus"][data-ai-club-value="reward"]');
  rewardButton?.classList.toggle("hidden", !isOnePoint);
  rewardButton?.closest(".friendly-setting-switch")?.classList.toggle("reward-visible", isOnePoint);
  document.querySelectorAll("[data-competition-setting]").forEach((row) => row.classList.toggle("hidden", isMatch));
  document.querySelector("#aiSetsSettingRow")?.classList.toggle("hidden", isOnePoint);
  document.querySelector("#aiTournamentSizeSettingRow")?.classList.toggle("hidden", AI_CLUB_HOUSE.format !== "classic");
  document.querySelector("#aiPlayersSettingRow")?.classList.toggle("hidden", isMatch || isChampionship);
  document.querySelector("#aiDistributionSettingRow")?.classList.toggle("hidden", isMatch || AI_CLUB_HOUSE.format === "championship");
  els.aiBonusSettingRow?.classList.remove("setting-disabled");
  if (els.aiLevelDescription) {
    els.aiLevelDescription.textContent = AI_DIFFICULTY_DESCRIPTIONS[AI_CLUB_HOUSE.difficulty];
  }
  if (els.aiBonusDescription) {
    els.aiBonusDescription.textContent = AI_BONUS_DESCRIPTIONS[AI_CLUB_HOUSE.bonus];
  }
  if (els.aiClubHouseSummary) {
    const format = AI_CLUB_HOUSE.format === "onepointmaster" ? "1 Point Master" : AI_CLUB_HOUSE.format === "championship" ? "Championnat" : AI_CLUB_HOUSE.format === "league" ? "League" : AI_CLUB_HOUSE.format === "onepoint" ? "1 Point Game" : AI_CLUB_HOUSE.format === "classic" ? "Tournoi Classic" : "Match Solo";
    const bonusText = `bonus ${aiBonusLabel(AI_CLUB_HOUSE.bonus).toLowerCase()}`;
    const playersText = AI_CLUB_HOUSE.players === "best" ? "meilleurs joueurs" : "joueurs alÃ©atoires";
    const distributionText = AI_CLUB_HOUSE.distribution === "ranking" ? "rÃ©partition selon classement" : "rÃ©partition alÃ©atoire";
    els.aiClubHouseSummary.textContent = isMatch
      ? `${AI_CLUB_HOUSE.targetSets} sets gagnants Â· ${tournamentDifficultyLabel(AI_CLUB_HOUSE.difficulty)}`
      : isOnePointMaster
        ? `24 joueurs Â· 4 groupes de 6 Â· 1 Ã©change par match Â· ${tournamentDifficultyLabel(AI_CLUB_HOUSE.difficulty)} Â· ${distributionText}`
      : isOnePoint
        ? `16 joueurs Â· 1 Ã©change par match Â· ${tournamentDifficultyLabel(AI_CLUB_HOUSE.difficulty)} Â· ${bonusText} Â· ${playersText} Â· ${distributionText}`
      : isChampionship
        ? `24 joueurs Â· ${AI_CLUB_HOUSE.targetSets} sets gagnants Â· ${tournamentDifficultyLabel(AI_CLUB_HOUSE.difficulty)} Â· tirage alÃ©atoire avec 8 tÃªtes de sÃ©rie`
      : `${AI_CLUB_HOUSE.tournamentSize} joueurs Â· ${AI_CLUB_HOUSE.targetSets} sets gagnants Â· ${tournamentDifficultyLabel(AI_CLUB_HOUSE.difficulty)} Â· ${bonusText} Â· ${playersText} Â· ${distributionText}`;
    if (els.aiClubHouseSummaryTitle) els.aiClubHouseSummaryTitle.textContent = format;
  }
  if (els.startAiClubHouseButton) {
    els.startAiClubHouseButton.textContent = isMatch ? "Lancer le match" : AI_CLUB_HOUSE.format === "onepointmaster" ? "Lancer le 1 Point Master" : AI_CLUB_HOUSE.format === "onepoint" ? "Lancer le 1 Point Game" : AI_CLUB_HOUSE.format === "championship" ? "Lancer le Championnat" : AI_CLUB_HOUSE.format === "league" ? "Lancer la League" : "Lancer le tournoi";
  }
  els.aiClubHouseAccessNote?.classList.toggle("hidden", proAccess);
  els.aiClubHouseSaveActions?.classList.toggle("hidden", !proAccess || !readAiClubHouseSave());
}

function aiClubHouseSaveKey() {
  return `${AI_CLUB_HOUSE_SAVE_PREFIX}:${authenticatedUserId() || "guest"}`;
}

function readAiClubHouseSave() {
  try {
    const saved = JSON.parse(localStorage.getItem(aiClubHouseSaveKey()) || "null");
    return saved?.state?.tournament?.aiClubHouse ? saved : null;
  } catch (error) {
    return null;
  }
}

function compactAiClubHouseSaveState() {
  const snapshot = cloneData(state);
  // Les journaux d'analyse sont dÃ©jÃ  conservÃ©s sÃ©parÃ©ment. Les dupliquer dans
  // la sauvegarde pouvait dÃ©passer le quota local aprÃ¨s plusieurs rencontres.
  snapshot.log = Array.isArray(snapshot.log) ? snapshot.log.slice(0, 120) : [];
  snapshot.actionLog = [];
  if (snapshot.turnSnapshot) {
    snapshot.turnSnapshot.log = Array.isArray(snapshot.turnSnapshot.log)
      ? snapshot.turnSnapshot.log.slice(0, 40)
      : [];
    snapshot.turnSnapshot.actionLog = [];
  }
  return snapshot;
}

function saveAiClubHouseProgress() {
  if (!state.tournament?.aiClubHouse || state.tournament.stage === "complete" || readAiClubHouseSave()) return false;
  const save = {
    savedAt: new Date().toISOString(),
    state: compactAiClubHouseSaveState(),
    soloAi: cloneData(SOLO_AI),
    // La tÃ©lÃ©mÃ©trie reste dans son stockage dÃ©diÃ© et n'est pas nÃ©cessaire pour
    // reprendre la compÃ©tition au mÃªme Ã©change.
    humanMatchTelemetry: null,
  };
  if (save.state?.tutorial) save.state.tutorial = inactiveTutorialState(save.state.tutorial);
  try {
    localStorage.setItem(aiClubHouseSaveKey(), JSON.stringify(save));
    return true;
  } catch (error) {
    return false;
  }
}

function resumeAiClubHouseSave() {
  if (!canAccessProFeatures()) return;
  const saved = readAiClubHouseSave();
  if (!saved || !restoreStateSnapshot(saved)) return;
  if (state.tournament?.championship && !state.tournament.currentMatch) {
    SOLO_AI.enabled = false;
    showChampionshipLobbyScreen();
  } else {
    showGameScreen();
  }
  applySurfaceBackground(state.tournament?.competitionSurface);
  render();
}

function deleteAiClubHouseSave() {
  if (!readAiClubHouseSave() || !window.confirm("Supprimer dÃ©finitivement la partie sauvegardÃ©e ?")) return;
  localStorage.removeItem(aiClubHouseSaveKey());
  renderAiClubHouse();
}

function updateAiClubHouseSetting(setting, value) {
  if (setting === "format") {
    if (["classic", "league", "championship", "onepoint", "onepointmaster"].includes(value) && !canAccessProFeatures()) return;
    AI_CLUB_HOUSE.format = ["match", "classic", "league", "championship", "onepoint", "onepointmaster"].includes(value) ? value : "match";
    localStorage.setItem("tennisLightAiClubFormat", AI_CLUB_HOUSE.format);
    if (AI_CLUB_HOUSE.format === "onepoint") {
      AI_CLUB_HOUSE.bonus = "reward";
      localStorage.setItem("tennisLightAiClubBonus", AI_CLUB_HOUSE.bonus);
    } else if (AI_CLUB_HOUSE.format === "onepointmaster") {
      AI_CLUB_HOUSE.bonus = "reward";
      localStorage.setItem("tennisLightAiClubBonus", AI_CLUB_HOUSE.bonus);
    } else if (AI_CLUB_HOUSE.bonus === "reward") {
      AI_CLUB_HOUSE.bonus = "none";
      localStorage.setItem("tennisLightAiClubBonus", AI_CLUB_HOUSE.bonus);
    }
  } else if (setting === "sets") {
    AI_CLUB_HOUSE.targetSets = Number(value) === 3 ? 3 : 2;
    localStorage.setItem("tennisLightAiClubSets", String(AI_CLUB_HOUSE.targetSets));
  } else if (setting === "tournamentSize") {
    AI_CLUB_HOUSE.tournamentSize = [8, 16, 32].includes(Number(value)) ? Number(value) : 16;
    localStorage.setItem("tennisLightAiClubTournamentSize", String(AI_CLUB_HOUSE.tournamentSize));
  } else if (setting === "difficulty") {
    AI_CLUB_HOUSE.difficulty = normalizeAiDifficulty(value);
    localStorage.setItem("tennisLightAiClubDifficulty", AI_CLUB_HOUSE.difficulty);
  } else if (setting === "bonus") {
    AI_CLUB_HOUSE.bonus = normalizeAiBonusLevel(value);
    localStorage.setItem("tennisLightAiClubBonus", AI_CLUB_HOUSE.bonus);
  } else if (setting === "players") {
    AI_CLUB_HOUSE.players = value === "best" ? "best" : "random";
    localStorage.setItem("tennisLightAiClubPlayers", AI_CLUB_HOUSE.players);
  } else if (setting === "distribution") {
    AI_CLUB_HOUSE.distribution = value === "ranking" ? "ranking" : "random";
    localStorage.setItem("tennisLightAiClubDistribution", AI_CLUB_HOUSE.distribution);
  }
  renderAiClubHouse();
}

async function ensureGameplayProfile(force = false) {
  const userId = authenticatedUserId();
  if (!userId) return;
  if (!force && AUTH_STATE.profile && AUTH_STATE.profileUserId === userId) return;
  try {
    const profile = await authRequest("/api/profile");
    if (authenticatedUserId() !== userId || String(profile?.user?.id || "") !== userId) return;
    AUTH_STATE.profile = profile;
    AUTH_STATE.profileUserId = userId;
  } catch (error) {
    // Une indisponibilitÃ© du profil ne doit pas empÃªcher le lancement de la partie.
  }
}

async function ensureGameplayRanking() {
  if (!canAccessProFeatures()) return;
  const userId = authenticatedUserId();
  try {
    const ranking = await authRequest(`/api/ranking?page=1&pageSize=100&sort=points`);
    if (authenticatedUserId() !== userId || String(ranking?.currentUserRank?.id || "") !== userId) return;
    AUTH_STATE.gameplayRanking = ranking;
    AUTH_STATE.gameplayRankingUserId = userId;
  } catch (error) {
    if (!AUTH_STATE.ranking) await loadRanking();
  }
}

async function startAiClubHouseCompetition() {
  // Conserver le format choisi avant les chargements asynchrones : le rendu du
  // profil/classement ne doit jamais transformer un Championnat en match Solo.
  const selectedFormat = AI_CLUB_HOUSE.format;
  const selectedTargetSets = AI_CLUB_HOUSE.targetSets;
  const isMatch = selectedFormat === "match";
  const isChampionship = selectedFormat === "championship";
  const isOnePoint = selectedFormat === "onepoint";
  const isOnePointMaster = selectedFormat === "onepointmaster";
  if (!isMatch && !canAccessProFeatures()) {
    showMenuScreen();
    renderAuthState("RÃ©servÃ© aux joueurs Pro.");
    return;
  }
  resetTutorialMode();
  MENU_STATE.espoirResolvedCharacterId = null;
  await showTournamentLoadingDialog(
    isMatch ? "Votre match Solo est en train d'Ãªtre prÃ©parÃ©." : "Votre compÃ©tition du Club House est en train d'Ãªtre crÃ©Ã©e.",
    isMatch ? "PrÃ©paration du match" : "Chargement de la compÃ©tition",
  );
  try {
    if (!isMatch) {
      await ensureGameplayRanking();
      await ensureGameplayProfile(true);
    }
    const options = {
      aiClubHouse: true,
      difficulty: AI_CLUB_HOUSE.difficulty,
      bonus: AI_CLUB_HOUSE.bonus,
      players: AI_CLUB_HOUSE.players,
      distribution: AI_CLUB_HOUSE.distribution,
      tournamentSize: AI_CLUB_HOUSE.tournamentSize,
    };
    try {
      if (isMatch) {
        resetTournament();
        configureSoloOpponent();
        SOLO_AI.difficulty = AI_CLUB_HOUSE.difficulty;
        startMatchMode(selectedTargetSets, { keepSoloOpponent: true });
      } else if (isChampionship) {
        startChampionshipMode(selectedTargetSets, options);
      } else if (isOnePointMaster) {
        startOnePointMasterMode(options);
      } else if (isOnePoint) {
        startOnePointTournamentMode(options);
      } else if (selectedFormat === "league") {
        startLeagueTournamentMode(selectedTargetSets, options);
      } else {
        startTournamentMode(selectedTargetSets, options);
      }
      if (isChampionship) {
        showChampionshipLobbyScreen();
        render();
        return;
      }
      if (isOnePointMaster) {
        showChampionshipLobbyScreen();
        render();
        return;
      }
      showGameScreen();
      render();
    } catch (error) {
      resetTournament();
      SOLO_AI.enabled = false;
      showMenuScreen();
      renderAuthState("La partie n'a pas pu dÃ©marrer. VÃ©rifie sa configuration puis rÃ©essaie.");
      console.error("Club House launch failed", error);
    }
  } finally {
    hideTournamentLoadingDialog();
  }
}

function configureSoloOpponent() {
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.characterId = randomAiCharacterId();
  SOLO_AI.difficulty = "normal";
}

function resetTournament() {
  state.tournament = cloneData(EMPTY_TOURNAMENT);
  TOURNAMENT_PANEL_UI.visible = true;
}

function randomAiCharacterId() {
  const available = COACH_OPTIONS.filter((characterId) => characterId !== selectedCharacterId());
  return available[Math.floor(Math.random() * available.length)] ?? "coachMax";
}

async function startSoloFromMenu(mode) {
  resetTutorialMode();
  const isCompetitionMode = mode.startsWith("tournament") || mode.startsWith("league");
  if (isCompetitionMode && !canAccessProFeatures()) {
    renderAuthState("RÃ©servÃ© aux joueurs Pro.");
    return;
  }
  MENU_STATE.espoirResolvedCharacterId = null;
  if (!isCompetitionMode) resetTournament();
  if (mode.startsWith("league") && !AUTH_STATE.ranking) {
    await loadRanking();
  }
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
  } else if (mode === "tournament2") {
    startTournamentMode(2);
  } else if (mode === "tournament3") {
    startTournamentMode(3);
  } else if (mode === "league2") {
    startLeagueTournamentMode(2);
  } else if (mode === "league3") {
    startLeagueTournamentMode(3);
  }
}

function renderLobbyRooms(rooms = [], tournaments = []) {
  if (!els.lobbyRooms) return;
  const noticeHtml = MENU_STATE.lobbyNotice
    ? `<div class="friendly-lobby-status">${escapeHtml(MENU_STATE.lobbyNotice)}</div>`
    : "";
  if (!rooms.length && !tournaments.length) {
    els.lobbyRooms.innerHTML = `${noticeHtml}<div class="lobby-empty">Aucune partie ouverte pour le moment.</div>`;
    MENU_STATE.lobbyNotice = "";
    return;
  }
  const tournamentHtml = tournaments.map((tournament) => `
    <article class="lobby-room friendly-tournament-room online-room-card">
      <span class="online-room-format-icon"><img src="./assets/icons/${tournament.format === "league" ? "LEAGUE.svg" : ["onepoint", "onepointmaster"].includes(tournament.format) ? "power-flash.svg" : tournament.format === "match" ? "MATCH.svg" : "trophy-circuit.svg"}" alt="" aria-hidden="true" /></span>
      <div>
        <strong>${escapeHtml(tournament.creatorNickname || "Joueur")} Â· Partie en ligne</strong>
        <span>CLUB HOUSE ${tournament.id} Â· ${tournament.participantCount}/${tournament.maxParticipants} connectÃ©s Â· ${tournament.format === "league" ? "LEAGUE" : tournament.format === "onepointmaster" ? "1 POINT MASTER" : tournament.format === "onepoint" ? "1 POINT MATCH" : tournament.format === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE"} Â· ${["onepoint", "onepointmaster"].includes(tournament.format) ? "1 point" : `${Number(tournament.targetSets || 2)} sets`} Â· ${tournament.visibility === "private" ? "PrivÃ©" : "Public"} Â· ${tournament.status === "playing" ? "En cours" : "Ouvert"}</span>
      </div>
      <div class="lobby-room-actions">
        ${tournament.canResume
          ? `<button class="small-button friendly-resume-button" type="button" data-resume-friendly-tournament="${tournament.id}">REPRENDRE</button>`
          : tournament.status === "playing" && tournament.canSpectate
          ? `<button class="small-button friendly-spectator-button" type="button" data-spectate-friendly-tournament="${tournament.id}">SPECTATEUR</button>`
          : tournament.status === "playing"
          ? `<span class="online-private-event-badge">Ã‰VÃ‰NEMENT PRIVÃ‰</span>`
          : `<button class="small-button" type="button" data-join-friendly-tournament="${tournament.id}">REJOINDRE</button>`}
        ${canAccessAdminFeatures() ? `<button class="small-button danger-button admin-lobby-delete-button" type="button" data-admin-delete-friendly-tournament="${tournament.id}">SUPPRIMER</button>` : ""}
      </div>
    </article>
  `).join("");
  const roomHtml = rooms.map((room) => {
    const host = room.players.find(Boolean);
    const format = room.targetSets === 3 ? "Match 3 sets" : "Match 2 sets";
    const coach = characterNameFromId(normalizeCharacterId(host?.characterId, "coachJu"));
    return `
      <article class="lobby-room online-room-card">
        <span class="online-room-format-icon"><img src="./assets/icons/MATCH.svg" alt="" aria-hidden="true" /></span>
        <div>
          <strong>${host?.nickname ?? "Joueur"} Â· ${format}</strong>
          <span>${coach} Â· Salon ${room.id}</span>
        </div>
        <div class="lobby-room-actions">
          <button class="small-button" type="button" data-join-room="${room.id}">REJOINDRE</button>
          ${canAccessAdminFeatures() ? `<button class="small-button danger-button admin-lobby-delete-button" type="button" data-admin-delete-room="${room.id}">SUPPRIMER</button>` : ""}
        </div>
      </article>
    `;
  }).join("");
  els.lobbyRooms.innerHTML = `${noticeHtml}${tournamentHtml}${roomHtml}`;
  MENU_STATE.lobbyNotice = "";
  els.lobbyRooms.querySelectorAll("[data-join-room]").forEach((button) => {
    button.addEventListener("click", () => joinLobbyRoom(button.dataset.joinRoom));
  });
  els.lobbyRooms.querySelectorAll("[data-join-friendly-tournament]").forEach((button) => {
    button.addEventListener("click", () => joinFriendlyTournament(button.dataset.joinFriendlyTournament));
  });
  els.lobbyRooms.querySelectorAll("[data-resume-friendly-tournament]").forEach((button) => {
    button.addEventListener("click", () => resumeFriendlyTournament(button.dataset.resumeFriendlyTournament));
  });
  els.lobbyRooms.querySelectorAll("[data-spectate-friendly-tournament]").forEach((button) => {
    button.addEventListener("click", () => spectateFriendlyTournament(button.dataset.spectateFriendlyTournament));
  });
  els.lobbyRooms.querySelectorAll("[data-admin-delete-friendly-tournament]").forEach((button) => {
    button.addEventListener("click", () => adminDeleteFriendlyTournament(button.dataset.adminDeleteFriendlyTournament));
  });
  els.lobbyRooms.querySelectorAll("[data-admin-delete-room]").forEach((button) => {
    button.addEventListener("click", () => adminDeleteLobbyRoom(button.dataset.adminDeleteRoom));
  });
}

async function refreshLobbyRooms() {
  if (!els.lobbyRooms) return;
  if (!canAccessProFeatures()) {
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">RÃ©servÃ© aux joueurs Pro.</div>';
    return;
  }
  try {
    const response = await fetch("/api/lobby");
    if (!response.ok) throw new Error("lobby unavailable");
    const data = await response.json();
    renderLobbyRooms(data.rooms ?? [], data.tournaments ?? []);
  } catch (error) {
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Lobby indisponible sur cette version locale.</div>';
  }
}

async function createFriendlyTournament() {
  if (!canAccessProFeatures()) {
    if (els.lobbyRooms) els.lobbyRooms.innerHTML = '<div class="lobby-empty">RÃ©servÃ© aux joueurs Pro.</div>';
    return;
  }
  let navigating = false;
  await showTournamentLoadingDialog("Le Club House du tournoi en ligne est en train d'Ãªtre crÃ©Ã©.");
  try {
    const response = await fetch("/api/lobby/friendly-tournaments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname: nicknameValue(), characterId: selectedCharacterId() }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "create failed");
    }
    const data = await response.json();
    if (!data.playerUrl) throw new Error("Adresse du tournoi indisponible.");
    navigating = true;
    window.location.href = data.playerUrl;
  } catch (error) {
    els.lobbyRooms.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message || "Impossible de crÃ©er le tournoi.")}</div>`;
  } finally {
    if (!navigating) hideTournamentLoadingDialog();
  }
}

async function joinFriendlyTournament(tournamentId) {
  let navigating = false;
  await showTournamentLoadingDialog("Le tournoi en ligne est en train d'Ãªtre chargÃ©.");
  try {
    const response = await fetch(`/api/lobby/friendly-tournaments/${encodeURIComponent(tournamentId)}/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname: nicknameValue(), characterId: selectedCharacterId() }),
    });
    if (!response.ok) throw new Error("join failed");
    const data = await response.json();
    if (!data.playerUrl) throw new Error("Adresse du tournoi indisponible.");
    navigating = true;
    window.location.href = data.playerUrl;
  } catch (error) {
    await refreshLobbyRooms();
  } finally {
    if (!navigating) hideTournamentLoadingDialog();
  }
}

async function resumeFriendlyTournament(tournamentId) {
  let navigating = false;
  await showTournamentLoadingDialog("Votre tournoi en ligne est en train d'Ãªtre chargÃ©.");
  try {
    const response = await fetch(`/api/lobby/friendly-tournaments/${encodeURIComponent(tournamentId)}/resume`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.playerUrl) throw new Error(data.error || "resume failed");
    navigating = true;
    window.location.href = data.playerUrl;
  } catch (error) {
    MENU_STATE.lobbyNotice = error.message || "Ce tournoi ne peut plus Ãªtre repris.";
    await refreshLobbyRooms();
  } finally {
    if (!navigating) hideTournamentLoadingDialog();
  }
}

async function spectateFriendlyTournament(tournamentId) {
  try {
    const response = await fetch(`/api/lobby/friendly-tournaments/${encodeURIComponent(tournamentId)}/spectate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Ce tournoi n'est plus disponible en mode spectateur.");
    window.location.href = data.spectatorUrl;
  } catch (error) {
    MENU_STATE.lobbyNotice = error.message || "Ce tournoi n'est plus disponible en mode spectateur.";
    await refreshLobbyRooms();
  }
}

async function adminDeleteFriendlyTournament(tournamentId) {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("Supprimer ce CLUB HOUSE et Ã©jecter tous les joueurs ?")) return;
  try {
    const response = await fetch(`/api/lobby/friendly-tournaments/${encodeURIComponent(tournamentId)}/admin-delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error("delete failed");
    MENU_STATE.lobbyNotice = "CLUB HOUSE supprimÃ©.";
    await refreshLobbyRooms();
  } catch (error) {
    MENU_STATE.lobbyNotice = "Impossible de supprimer ce CLUB HOUSE.";
    await refreshLobbyRooms();
  }
}

async function adminDeleteLobbyRoom(roomId) {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("Supprimer cette partie en ligne et Ã©jecter les joueurs prÃ©sents ?")) return;
  try {
    const response = await fetch(`/api/lobby/rooms/${encodeURIComponent(roomId)}/admin-delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error("delete failed");
    MENU_STATE.lobbyNotice = "Partie en ligne supprimÃ©e.";
    await refreshLobbyRooms();
  } catch (error) {
    MENU_STATE.lobbyNotice = "Impossible de supprimer cette partie.";
    await refreshLobbyRooms();
  }
}

async function createLobbyRoom() {
  if (!canAccessProFeatures()) {
    if (els.lobbyRooms) els.lobbyRooms.innerHTML = '<div class="lobby-empty">RÃ©servÃ© aux joueurs Pro.</div>';
    return;
  }
  const targetSets = Number(els.onlineFormatSelect?.value || 2);
  let navigating = false;
  await showTournamentLoadingDialog("La partie en ligne est en train d'Ãªtre crÃ©Ã©e.", "Chargement de la partie");
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
    if (!data.playerUrl) throw new Error("Adresse de la partie indisponible.");
    navigating = true;
    window.location.href = data.playerUrl;
  } catch (error) {
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Impossible de crÃ©er une partie depuis cette version. Lancez la version serveur.</div>';
  } finally {
    if (!navigating) hideTournamentLoadingDialog();
  }
}

async function joinLobbyRoom(roomId) {
  let navigating = false;
  await showTournamentLoadingDialog("La partie en ligne est en train d'Ãªtre chargÃ©e.", "Chargement de la partie");
  try {
    const response = await fetch(`/api/lobby/rooms/${encodeURIComponent(roomId)}/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname: nicknameValue(), characterId: selectedCharacterId() }),
    });
    if (!response.ok) throw new Error("join failed");
    const data = await response.json();
    if (!data.playerUrl) throw new Error("Adresse de la partie indisponible.");
    navigating = true;
    window.location.href = data.playerUrl;
  } catch (error) {
    await refreshLobbyRooms();
  } finally {
    if (!navigating) hideTournamentLoadingDialog();
  }
}

function friendlyEntryInfo(entry) {
  return (state.tournament.friendlyEntries || []).find((item) => item.entry === entry) || null;
}

function friendlyTournamentAccessQuery() {
  const accessKey = FRIENDLY_TOURNAMENT.isSpectator ? "spectatorId" : "participantId";
  const accessId = FRIENDLY_TOURNAMENT.isSpectator ? FRIENDLY_TOURNAMENT.spectatorId : FRIENDLY_TOURNAMENT.participantId;
  const presence = FRIENDLY_TOURNAMENT.isSpectator ? "" : `&presenceId=${encodeURIComponent(FRIENDLY_TOURNAMENT.presenceId || "")}`;
  return `${accessKey}=${encodeURIComponent(accessId || "")}&token=${encodeURIComponent(FRIENDLY_TOURNAMENT.token || "")}${presence}`;
}

function friendlyEntryCharacterId(entry) {
  const info = friendlyEntryInfo(entry);
  return normalizeCharacterId(info?.characterId || entry, "coachJu");
}

function friendlyRoundName(match) {
  if (Number(match?.day)) return `JournÃ©e ${Number(match.day)}`;
  if (match?.round === "quarter") return "Quarts de finale";
  if (match?.round === "semi") return "Demi-finales";
  if (match?.round === "final") return "Finale";
  return match?.label || "Prochaine rencontre";
}

function cancelFriendlyMatchCountdown() {
  window.clearInterval(FRIENDLY_TOURNAMENT.countdownTimer);
  FRIENDLY_TOURNAMENT.countdownTimer = null;
  FRIENDLY_TOURNAMENT.countdownMatchId = null;
  FRIENDLY_TOURNAMENT.countdownMatch = null;
  document.querySelector(".friendly-round-countdown")?.remove();
}

function cancelSoloTournamentCountdown() {
  window.clearInterval(soloTournamentCountdownTimer);
  soloTournamentCountdownTimer = null;
  document.querySelector(".solo-tournament-countdown")?.remove();
}

function scheduleSoloTournamentMatch(startAction) {
  if (typeof startAction !== "function" || document.querySelector(".solo-tournament-countdown")) return;
  const nextMatch = state.tournament.nextHumanMatchId ? tournamentMatchById(state.tournament.nextHumanMatchId) : null;
  const fallbackId = state.tournament.stage === "readyFinal" ? "final" : state.tournament.stage === "readySemi" ? "semiHuman" : null;
  const match = nextMatch || tournamentMatchById(fallbackId);
  const roundLabel = match?.label || humanTournamentRoundLabel() || "Match suivant";
  const opponentEntry = match ? (match.playerA === humanTournamentEntry() ? match.playerB : match.playerA) : null;
  const opponentName = opponentEntry ? tournamentPlayerLabel(opponentEntry) : "Adversaire Ã  venir";
  let remaining = 3;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop event-transition-backdrop solo-tournament-countdown";
  const begin = () => {
    cancelSoloTournamentCountdown();
    startAction();
  };
  backdrop.innerHTML = `
    <section class="event-transition-panel event-countdown-panel" role="dialog" aria-modal="true" aria-labelledby="soloTournamentCountdownTitle">
      <p class="event-transition-kicker">${escapeHtml(state.tournament.competitionName || "CompÃ©tition Solo")}</p>
      <h2 id="soloTournamentCountdownTitle">${escapeHtml(roundLabel)}</h2>
      <div class="event-transition-versus"><strong>${escapeHtml(selectedPlayerName())}</strong><span>contre</span><strong>${escapeHtml(opponentName)}</strong></div>
      <strong class="event-transition-countdown" aria-live="assertive">${remaining}</strong>
      <button class="primary-button" type="button" data-start-event-now>DÃ©marrer</button>
    </section>
  `;
  backdrop.querySelector("[data-start-event-now]")?.addEventListener("click", begin);
  document.body.appendChild(backdrop);
  const number = backdrop.querySelector(".event-transition-countdown");
  soloTournamentCountdownTimer = window.setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      if (number) number.textContent = String(remaining);
      return;
    }
    begin();
  }, 1000);
}

function scheduleFriendlyTournamentMatch(match) {
  if (!match?.id || FRIENDLY_TOURNAMENT.inMatch || FRIENDLY_TOURNAMENT.awaitingClubHouseReturn) return;
  if (FRIENDLY_TOURNAMENT.countdownMatchId === match.id) {
    FRIENDLY_TOURNAMENT.countdownMatch = match;
    return;
  }
  cancelFriendlyMatchCountdown();
  FRIENDLY_TOURNAMENT.countdownMatchId = match.id;
  FRIENDLY_TOURNAMENT.countdownMatch = match;
  let remaining = 3;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop event-transition-backdrop friendly-round-countdown";
  backdrop.innerHTML = `
    <div class="event-transition-panel event-countdown-panel friendly-round-countdown-modal" role="dialog" aria-modal="true" aria-labelledby="friendlyRoundCountdownTitle">
      <p class="event-transition-kicker">Tournoi en ligne</p>
      <h2 id="friendlyRoundCountdownTitle">${escapeHtml(friendlyRoundName(match))}</h2>
      <div class="event-transition-versus"><strong>${escapeHtml(tournamentPlayerLabel(match.playerA))}</strong><span>contre</span><strong>${escapeHtml(tournamentPlayerLabel(match.playerB))}</strong></div>
      <strong class="event-transition-countdown friendly-round-countdown-number" aria-live="assertive">${remaining}</strong>
      <button class="primary-button" type="button" data-start-friendly-now>DÃ©marrer</button>
    </div>
  `;
  document.body.appendChild(backdrop);
  const number = backdrop.querySelector(".friendly-round-countdown-number");
  const startFriendlyNow = () => {
    const pendingMatch = FRIENDLY_TOURNAMENT.countdownMatch;
    cancelFriendlyMatchCountdown();
    if (!pendingMatch || !FRIENDLY_TOURNAMENT.enabled || FRIENDLY_TOURNAMENT.awaitingClubHouseReturn) return;
    FRIENDLY_TOURNAMENT.currentMatchId = pendingMatch.id;
    startFriendlyTournamentMatch(pendingMatch);
  };
  backdrop.querySelector("[data-start-friendly-now]")?.addEventListener("click", startFriendlyNow);
  FRIENDLY_TOURNAMENT.countdownTimer = window.setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      if (number) number.textContent = String(remaining);
      return;
    }
    startFriendlyNow();
  }, 1000);
}

function closeFriendlyOpponentDisconnectDialog() {
  window.clearInterval(FRIENDLY_TOURNAMENT.opponentDisconnectTimer);
  FRIENDLY_TOURNAMENT.opponentDisconnectTimer = null;
  FRIENDLY_TOURNAMENT.opponentDisconnectMatchId = null;
  document.querySelector(".friendly-opponent-disconnect-dialog")?.remove();
}

function showFriendlyOpponentDisconnectDialog(match, opponent) {
  if (!match?.id || !opponent?.deadline) return;
  const existing = document.querySelector(".friendly-opponent-disconnect-dialog");
  if (existing?.dataset.matchId === match.id && existing?.dataset.deadline === String(opponent.deadline)) return;
  closeFriendlyOpponentDisconnectDialog();
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop friendly-opponent-disconnect-dialog";
  backdrop.dataset.matchId = match.id;
  backdrop.dataset.deadline = String(opponent.deadline);
  backdrop.innerHTML = `
    <div class="modal friendly-disconnect-modal" role="dialog" aria-modal="true" aria-labelledby="friendlyDisconnectTitle">
      <p class="label">Match temporairement interrompu</p>
      <h2 id="friendlyDisconnectTitle">Adversaire dÃ©connectÃ©</h2>
      <p>${escapeHtml(opponent.nickname || "Votre adversaire")} a quittÃ© la partie. Le match reprendra automatiquement s'il revient.</p>
      <div class="friendly-disconnect-countdown">
        <span>Forfait dans</span>
        <strong data-friendly-disconnect-seconds aria-live="assertive">${Number(opponent.graceSeconds || 20)}</strong>
        <span>secondes</span>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  FRIENDLY_TOURNAMENT.opponentDisconnectMatchId = match.id;
  const updateCountdown = () => {
    const remaining = Math.max(0, Math.ceil((Number(opponent.deadline) - Date.now()) / 1000));
    const seconds = backdrop.querySelector("[data-friendly-disconnect-seconds]");
    if (seconds) seconds.textContent = String(remaining);
  };
  updateCountdown();
  FRIENDLY_TOURNAMENT.opponentDisconnectTimer = window.setInterval(updateCountdown, 250);
}

function friendlyOnePointRewardsFromCounts(rewardCounts = {}) {
  const existing = state.tournament?.onePointRewards || {};
  return Object.fromEntries(Object.entries(rewardCounts).map(([entry, rawCount]) => {
    const count = Math.max(0, Math.min(2, Number(rawCount || 0)));
    const current = Array.isArray(existing[entry]) ? existing[entry] : [];
    return [entry, current.length === count ? cloneData(current) : shuffle(onePointRewardBonusPool()).slice(0, count)];
  }));
}

function applyFriendlyTournamentState(payload, currentMatch = null) {
  if (!payload) return;
  if (SPECTATOR_MODE.enabled) {
    SPECTATOR_MODE.lastTournamentPayload = payload;
    return;
  }
  const previousRound = state.tournament?.friendly ? state.tournament.stage : null;
  const nextRound = payload.round || "waiting";
  const roundJustChanged = Boolean(
    previousRound
    && previousRound !== nextRound
    && !["waiting", "complete"].includes(nextRound),
  );
  if (payload.format === "onepointmaster" && previousRound !== nextRound) {
    CHAMPIONSHIP_LOBBY_UI.openZone = /^group[1-5]$/.test(nextRound) ? 1 : nextRound === "barrage" ? 2 : 3;
  }
  FRIENDLY_TOURNAMENT.isCreator = Boolean(payload.participant?.isCreator || payload.creatorParticipantId === FRIENDLY_TOURNAMENT.participantId);
  FRIENDLY_TOURNAMENT.isSpectator = Boolean(payload.spectator || FRIENDLY_TOURNAMENT.spectatorId);
  FRIENDLY_TOURNAMENT.entry = payload.participant?.entry || FRIENDLY_TOURNAMENT.entry;
  FRIENDLY_TOURNAMENT.canStart = Boolean(payload.canStart);
  const matches = (payload.matches || []).map((match) => ({
    id: match.id,
    label: match.label,
    round: match.round,
    playerA: match.playerA,
    playerB: match.playerB,
    winner: match.winner,
    score: match.score,
    liveScore: match.liveScore || null,
    liveUpdatedAt: match.liveUpdatedAt || null,
    watchable: Boolean(match.watchable),
    playerAInfo: match.playerAInfo || null,
    playerBInfo: match.playerBInfo || null,
    forfeitParticipantId: match.forfeitParticipantId || null,
    group: match.group || null,
    day: match.day || null,
    disconnectedPlayers: match.disconnectedPlayers || [],
    humanVsHuman: Boolean(match.humanVsHuman || (match.playerAInfo?.type === "human" && match.playerBInfo?.type === "human")),
    playable: match.playerA === FRIENDLY_TOURNAMENT.entry || match.playerB === FRIENDLY_TOURNAMENT.entry,
    simulated: false,
  }));
  state.tournament = {
    ...cloneData(EMPTY_TOURNAMENT),
    active: true,
    visible: true,
    friendly: true,
    onePointGame: ["onepoint", "onepointmaster"].includes(payload.format),
    onePointMaster: payload.format === "onepointmaster",
    league: payload.format === "league",
    difficulty: payload.difficulty || "normal",
    competitionName: `Ã‰vÃ©nement amical en ligne Â· ${payload.format === "league" ? "LEAGUE" : payload.format === "onepointmaster" ? "1 POINT MASTER" : payload.format === "onepoint" ? "1 POINT MATCH" : payload.format === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE"}`,
    stage: payload.round || "waiting",
    targetSets: ["onepoint", "onepointmaster"].includes(payload.format) ? 1 : Number(payload.targetSets || 2),
    friendlyFormat: payload.format || "classic",
    friendlyDistribution: payload.distribution || "random",
    friendlyBonus: payload.bonus || "none",
    friendlyPlayerSelection: payload.playerSelection || "random",
    friendlyVisibility: payload.visibility === "private" ? "private" : "public",
    friendlySelectionLimit: Number(payload.selectionLimit || (payload.format === "match" ? 2 : 4)),
    friendlySettingsLocked: Boolean(payload.settingsLocked),
    friendlyCompetitionControl: payload.competitionControl || null,
    friendlyCanSimulateRemainder: Boolean(payload.canSimulateRemainder),
    bonusLevel: payload.bonus || "none",
    permanentBonuses: buildAiClubHouseBonuses(
      (payload.entries || []).filter((entry) => !String(entry?.entry || entry).startsWith("human:")).map((entry) => entry?.characterId || entry?.entry || entry),
      payload.bonus || "none",
    ),
    friendlyGroups: payload.groups || { A: [], B: [] },
    friendlyStandings: payload.standings || { A: [], B: [] },
    tournamentSeedNumbers: payload.seedNumbers || {},
    leagueGroups: {
      A: (payload.groups?.A || []).map((player) => player.entry).filter(Boolean),
      B: (payload.groups?.B || []).map((player) => player.entry).filter(Boolean),
    },
    humanCharacterId: selectedCharacterId(),
    humanNickname: payload.participant?.nickname || nicknameValue(),
    humanEntry: FRIENDLY_TOURNAMENT.entry,
    currentMatch: FRIENDLY_TOURNAMENT.inMatch ? state.tournament?.currentMatch ?? null : null,
    nextHumanMatchId: null,
    championCharacterId: payload.champion,
    previousWinScores: payload.previousWinScores || {},
    onePointRewards: friendlyOnePointRewardsFromCounts(payload.rewardCounts || {}),
    friendlyEntries: payload.entries || [],
    friendlyParticipants: payload.participants || [],
    matches,
  };
  const forfeitVictory = !FRIENDLY_TOURNAMENT.isSpectator && matches.find((match) => (
    match.winner === FRIENDLY_TOURNAMENT.entry
    && match.forfeitParticipantId
    && match.forfeitParticipantId !== FRIENDLY_TOURNAMENT.participantId
    && match.playerAInfo?.type === "human"
    && match.playerBInfo?.type === "human"
    && FRIENDLY_TOURNAMENT.lastForfeitNoticeMatchId !== match.id
  ));
  if (forfeitVictory) {
    closeFriendlyOpponentDisconnectDialog();
    FRIENDLY_TOURNAMENT.lastForfeitNoticeMatchId = forfeitVictory.id;
    FRIENDLY_TOURNAMENT.forfeitDialogOpen = true;
    FRIENDLY_TOURNAMENT.inMatch = false;
    FRIENDLY_TOURNAMENT.currentMatchId = null;
    state.tournament.currentMatch = null;
    window.clearInterval(FRIENDLY_TOURNAMENT.streamTimer);
    if (SERVER_SYNC.friendlyMatch) leaveOnlineRoom();
    SOLO_AI.enabled = false;
    stopSoloTimers();
    showFriendlyForfeitDialog(forfeitVictory);
    return;
  }
  const activeSharedMatch = FRIENDLY_TOURNAMENT.inMatch
    ? matches.find((match) => match.id === FRIENDLY_TOURNAMENT.currentMatchId && match.humanVsHuman)
    : null;
  const disconnectedOpponent = activeSharedMatch?.disconnectedPlayers?.find((item) => item.participantId !== FRIENDLY_TOURNAMENT.participantId) || null;
  if (disconnectedOpponent) showFriendlyOpponentDisconnectDialog(activeSharedMatch, disconnectedOpponent);
  else closeFriendlyOpponentDisconnectDialog();
  const completedActiveMatch = FRIENDLY_TOURNAMENT.inMatch
    ? matches.find((match) => match.id === FRIENDLY_TOURNAMENT.currentMatchId && match.winner)
    : null;
  if (completedActiveMatch) {
    window.clearInterval(FRIENDLY_TOURNAMENT.streamTimer);
    if (SERVER_SYNC.friendlyMatch) leaveOnlineRoom();
    FRIENDLY_TOURNAMENT.inMatch = false;
    FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = true;
    FRIENDLY_TOURNAMENT.currentMatchId = null;
    state.tournament.currentMatch = null;
    state.gameOver = true;
    state.setMatch.matchOver = true;
    state.setMatch.setOver = true;
    state.setMatch.matchWinner = completedActiveMatch.winner === completedActiveMatch.playerA ? 0 : 1;
    SOLO_AI.enabled = false;
    stopSoloTimers();
    render();
    return;
  }
  const nextCurrentMatch = currentMatch?.id
    ? { ...(matches.find((match) => match.id === currentMatch.id) || {}), ...currentMatch, session: currentMatch.session || null }
    : null;
  const resumesSavedMatch = Boolean(nextCurrentMatch?.resumeState || Number(nextCurrentMatch?.session?.revision || 0) > 0);
  FRIENDLY_TOURNAMENT.resumableMatch = nextCurrentMatch?.id && resumesSavedMatch ? nextCurrentMatch : null;
  if (FRIENDLY_TOURNAMENT.forfeitDialogOpen) return;
  if (FRIENDLY_TOURNAMENT.awaitingClubHouseReturn) {
    renderFriendlyLobbyScreen();
    return;
  }
  if (nextCurrentMatch?.id && !FRIENDLY_TOURNAMENT.inMatch && FRIENDLY_TOURNAMENT.currentMatchId !== nextCurrentMatch.id) {
    if (resumesSavedMatch && !roundJustChanged) {
      FRIENDLY_TOURNAMENT.currentMatchId = nextCurrentMatch.id;
      startFriendlyTournamentMatch(nextCurrentMatch);
    } else if (payload.format === "onepointmaster") {
      FRIENDLY_TOURNAMENT.currentMatchId = nextCurrentMatch.id;
      startFriendlyTournamentMatch(nextCurrentMatch);
    } else {
      scheduleFriendlyTournamentMatch(nextCurrentMatch);
    }
    return;
  }
  if (!nextCurrentMatch && FRIENDLY_TOURNAMENT.countdownMatchId) cancelFriendlyMatchCountdown();
  if (!FRIENDLY_TOURNAMENT.inMatch) {
    showFriendlyLobbyScreen();
    renderFriendlyLobbyScreen();
  }
}

function resumeFriendlyMatchFromClubHouse() {
  const match = FRIENDLY_TOURNAMENT.resumableMatch;
  if (!match?.id || !FRIENDLY_TOURNAMENT.enabled) return;
  FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = false;
  FRIENDLY_TOURNAMENT.currentMatchId = match.id;
  FRIENDLY_TOURNAMENT.resumableMatch = null;
  startFriendlyTournamentMatch(match);
}

function showFriendlyForfeitDialog(match) {
  document.querySelector(".friendly-forfeit-dialog")?.remove();
  const opponent = match.playerAInfo?.participantId === match.forfeitParticipantId ? match.playerAInfo : match.playerBInfo;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop friendly-forfeit-dialog";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="friendlyForfeitTitle">
      <p class="event-transition-kicker">Club House en ligne</p>
      <h2 id="friendlyForfeitTitle">QUALIFIÃ‰ PAR FORFAIT</h2>
      <p>${escapeHtml(opponent?.nickname || "Votre adversaire")} est forfait. Vous Ãªtes qualifiÃ© pour le tour suivant sans jouer.</p>
      <button class="primary-button" type="button" data-return-friendly-lobby>CONTINUER DANS LE CLUB HOUSE</button>
    </div>
  `;
  backdrop.querySelector("[data-return-friendly-lobby]")?.addEventListener("click", () => {
    backdrop.remove();
    FRIENDLY_TOURNAMENT.forfeitDialogOpen = false;
    showFriendlyLobbyScreen();
    renderFriendlyLobbyScreen();
    pollFriendlyTournament();
  });
  document.body.appendChild(backdrop);
}

function startFriendlyTournamentMatch(match) {
  if (!match) return;
  cancelFriendlyMatchCountdown();
  FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = false;
  if (match.humanVsHuman || (match.playerAInfo?.type === "human" && match.playerBInfo?.type === "human")) {
    startFriendlyHumanTournamentMatch(match);
    return;
  }
  FRIENDLY_TOURNAMENT.waitingForNextRound = false;
  FRIENDLY_TOURNAMENT.readyRound = null;
  FRIENDLY_TOURNAMENT.inMatch = true;
  showGameScreen();
  state.tournament.stage = match.round;
  state.tournament.currentMatch = match.id;
  state.tournament.nextHumanMatchId = null;
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.characterId = friendlyEntryCharacterId(match.playerA === FRIENDLY_TOURNAMENT.entry ? match.playerB : match.playerA);
  const humanInfo = match.playerA === FRIENDLY_TOURNAMENT.entry ? match.playerAInfo : match.playerBInfo;
  const opponentInfo = match.playerA === FRIENDLY_TOURNAMENT.entry ? match.playerBInfo : match.playerAInfo;
  if (match.resumeState) {
    const latestTournament = cloneData(state.tournament);
    importSyncState(match.resumeState);
    state.tournament = {
      ...latestTournament,
      stage: match.round,
      currentMatch: match.id,
      nextHumanMatchId: null,
    };
    if (state.players?.[0]) state.players[0].worldRank = Number(humanInfo?.worldRank || 0) || null;
    if (state.players?.[1]) state.players[1].worldRank = Number(opponentInfo?.worldRank || 0) || null;
    state.log.unshift(`${match.label} : reprise de la partie au score ${friendlyLiveScoreText(match).replace(/\s*Â·\s*EN DIRECT$/i, "")}.`);
    showGameScreen();
    render();
    maybeRunSoloAI();
    window.clearInterval(FRIENDLY_TOURNAMENT.streamTimer);
    FRIENDLY_TOURNAMENT.lastStreamPayload = "";
    publishFriendlyTournamentLiveState();
    FRIENDLY_TOURNAMENT.streamTimer = window.setInterval(publishFriendlyTournamentLiveState, 900);
    return;
  }
  startMatchMode(Number(state.tournament.targetSets || 2), { keepSoloOpponent: true });
  if (state.players?.[0]) state.players[0].worldRank = Number(humanInfo?.worldRank || 0) || null;
  if (state.players?.[1]) state.players[1].worldRank = Number(opponentInfo?.worldRank || 0) || null;
  state.tournament.stage = match.round;
  state.tournament.currentMatch = match.id;
  state.log.unshift(`${match.label} : ${nicknameValue()} contre ${tournamentPlayerLabel(match.playerA === FRIENDLY_TOURNAMENT.entry ? match.playerB : match.playerA)}.`);
  render();
  window.clearInterval(FRIENDLY_TOURNAMENT.streamTimer);
  FRIENDLY_TOURNAMENT.lastStreamPayload = "";
  publishFriendlyTournamentLiveState();
  FRIENDLY_TOURNAMENT.streamTimer = window.setInterval(publishFriendlyTournamentLiveState, 900);
}

function startFriendlyHumanTournamentMatch(match) {
  const seat = Number(match.session?.seat ?? (match.playerA === FRIENDLY_TOURNAMENT.entry ? 0 : 1));
  const isHost = seat === 0;
  const sharedSessionStarted = Number(match.session?.revision || 0) > 0;
  const players = [match.playerAInfo, match.playerBInfo].map((player, playerSeat) => ({
    seat: playerSeat,
    nickname: player?.nickname || "Joueur",
    characterId: normalizeCharacterId(player?.characterId, playerSeat === 0 ? "coachJu" : "coachMax"),
    isHost: playerSeat === 0,
    worldRank: Number(player?.worldRank || 0) || null,
  }));
  leaveOnlineRoom();
  stopSoloTimers();
  SOLO_AI.enabled = false;
  FRIENDLY_TOURNAMENT.waitingForNextRound = false;
  FRIENDLY_TOURNAMENT.readyRound = null;
  FRIENDLY_TOURNAMENT.inMatch = true;
  FRIENDLY_TOURNAMENT.localMatchSeat = seat;
  SERVER_SYNC.enabled = true;
  SERVER_SYNC.friendlyMatch = true;
  SERVER_SYNC.roomId = match.id;
  SERVER_SYNC.token = FRIENDLY_TOURNAMENT.token;
  SERVER_SYNC.seat = seat;
  SERVER_SYNC.isHost = isHost;
  SERVER_SYNC.targetSets = Number(state.tournament.targetSets || 2);
  SERVER_SYNC.status = "playing";
  SERVER_SYNC.hostSeat = 0;
  SERVER_SYNC.players = players;
  SERVER_SYNC.initializing = isHost && !sharedSessionStarted;
  SERVER_SYNC.ready = false;
  SERVER_SYNC.localDirty = false;
  SERVER_SYNC.lastSent = "";
  SERVER_SYNC.revision = Number(match.session?.revision || 0);
  showGameScreen();
  state.tournament.stage = match.round;
  state.tournament.currentMatch = match.id;
  state.tournament.nextHumanMatchId = null;
  if (isHost && !sharedSessionStarted) {
    startMatchMode(SERVER_SYNC.targetSets);
    applyOnlinePlayersFromRoom(players);
    state.tournament.stage = match.round;
    state.tournament.currentMatch = match.id;
    state.log.unshift(`${match.label} : session partagÃ©e entre ${players[0].nickname} et ${players[1].nickname}.`);
  } else {
    resetSetMatch();
    state.players = players.map((player) => createPlayer(characterNameFromId(player.characterId), player.characterId, player.nickname));
    state.players.forEach((player) => { player.hand = []; });
    state.log = [`${match.label} : reprise de la session partagÃ©e entre ${players[0].nickname} et ${players[1].nickname}.`];
    render();
  }
  state.players.forEach((player, playerSeat) => {
    player.worldRank = Number(players[playerSeat]?.worldRank || 0) || null;
  });
  render();
  pollServerState();
  window.clearInterval(SERVER_SYNC.pollTimer);
  SERVER_SYNC.pollTimer = window.setInterval(pollServerState, 500);
}

function friendlyLiveScoreText(match = tournamentMatchById(state.tournament.currentMatch)) {
  if (!match || !state.setMatch?.enabled) return "0/0 Â· EN DIRECT";
  const scores = tournamentCompletedSetScoresForMatch(match);
  if (!state.setMatch.matchOver && !state.setMatch.setOver && Array.isArray(state.setMatch.score)) {
    const current = [...state.setMatch.score];
    const shouldInvert = !SERVER_SYNC.friendlyMatch && match.playerB === FRIENDLY_TOURNAMENT.entry;
    scores.push(shouldInvert ? [current[1], current[0]] : current);
  }
  return `${formatSetScores(scores) || "0/0"} Â· EN DIRECT`;
}

async function publishFriendlyTournamentLiveState() {
  if (!FRIENDLY_TOURNAMENT.enabled || !FRIENDLY_TOURNAMENT.inMatch || SPECTATOR_MODE.enabled) return;
  const match = tournamentMatchById(state.tournament.currentMatch);
  if (!match || state.setMatch.matchOver) return;
  const streamState = exportSyncState();
  const liveScore = friendlyLiveScoreText(match);
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/matches/${encodeURIComponent(match.id)}/live`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        participantId: FRIENDLY_TOURNAMENT.participantId,
        token: FRIENDLY_TOURNAMENT.token,
        liveScore,
        state: streamState,
      }),
    });
    if (response.ok) FRIENDLY_TOURNAMENT.lastStreamPayload = liveScore;
  } catch (error) {
    // La partie continue localement si la diffusion est momentanÃ©ment indisponible.
  }
}

function renderFriendlyLobbyMatchCard(match) {
  const status = match.liveScore && !match.winner ? match.liveScore : match.score || (match.winner ? "TerminÃ©" : "En attente");
  const playerName = (entry) => {
    const label = `${escapeHtml(tournamentPlayerLabel(entry) || "")}${tournamentSeedNumberMarkup(entry)}`;
    return match.winner && match.winner === entry
      ? `<strong class="friendly-bracket-winner">${label}</strong>`
      : `<span class="friendly-bracket-player-name">${label}</span>`;
  };
  return `
    <article class="friendly-bracket-card ${match.winner ? "completed" : ""}">
      <span>${escapeHtml(match.label)}</span>
      ${playerName(match.playerA)}
      ${playerName(match.playerB)}
      <div class="friendly-bracket-live-row">
        <span class="${match.liveScore && !match.winner ? "friendly-live-score" : ""}">${escapeHtml(status)}</span>
        ${match.watchable ? `<button class="small-button friendly-watch-button" type="button" data-watch-friendly-match="${escapeHtml(match.id)}">VOIR</button>` : ""}
      </div>
    </article>
  `;
}

function renderFriendlyLeagueSchedule(matches) {
  if (!matches.length) return "";
  const dayRows = [1, 2, 3].map((day) => `
    <div class="friendly-league-day-row">
      <h3>JournÃ©e ${day}</h3>
      <div class="friendly-league-day-matches">
        ${matches.filter((match) => Number(match.day) === day).map(renderFriendlyLobbyMatchCard).join("")}
      </div>
    </div>
  `).join("");
  const semiMatches = matches.filter((match) => match.round === "semi");
  const final = matches.find((match) => match.round === "final");
  return `
    <section class="friendly-league-schedule">
      <p class="label">Calendrier LEAGUE</p>
      ${dayRows}
      <div class="friendly-league-knockout-row">
        <div>
          <h3>Demies</h3>
          <div class="friendly-league-knockout-matches">${semiMatches.map(renderFriendlyLobbyMatchCard).join("")}</div>
        </div>
        <div>
          <h3>Finale</h3>
          <div class="friendly-league-knockout-matches">${final ? renderFriendlyLobbyMatchCard(final) : ""}</div>
        </div>
        <div class="friendly-league-champion">
          <h3>Vainqueur</h3>
          <strong>${escapeHtml(tournamentPlayerLabel(state.tournament.championCharacterId) || "")}</strong>
        </div>
      </div>
    </section>
  `;
}

function friendlyMasterVisibleDrawEntries() {
  if (!FRIENDLY_TOURNAMENT.drawAnimating) return null;
  return new Set(
    (FRIENDLY_TOURNAMENT.drawEntries || [])
      .slice(0, Number(FRIENDLY_TOURNAMENT.drawVisibleCount || 0))
      .map((item) => item.entry)
      .filter(Boolean),
  );
}

function friendlyMasterZoneMarkup(phase, title, content) {
  const open = Number(CHAMPIONSHIP_LOBBY_UI.openZone) === phase;
  return `
    <section class="championship-zone ${open ? "open" : ""}">
      <button class="championship-zone-toggle" type="button" data-friendly-master-zone="${phase}" aria-expanded="${open}">
        <span>Zone ${phase}</span><strong>${title}</strong><span aria-hidden="true">${open ? "âˆ’" : "+"}</span>
      </button>
      <div class="championship-zone-content ${open ? "" : "hidden"}">${content}</div>
    </section>
  `;
}

function renderFriendlyMasterTournamentMatch(match) {
  const visibleEntries = friendlyMasterVisibleDrawEntries();
  const visibleMatch = visibleEntries ? {
    ...match,
    playerA: visibleEntries.has(match.playerA) ? match.playerA : null,
    playerB: visibleEntries.has(match.playerB) ? match.playerB : null,
  } : match;
  const card = renderTournamentMatch(visibleMatch, match.round === "final");
  if (!match.watchable) return card;
  const watchButton = `<button class="small-button friendly-watch-button" type="button" data-watch-friendly-match="${escapeHtml(match.id)}">VOIR</button>`;
  return card.replace(
    /(<div class="tournament-score[^]*?<\/div>)/,
    `<div class="friendly-bracket-live-row">$1${watchButton}</div>`,
  );
}

function renderFriendlyMasterBoard(matches, standings) {
  const visibleEntries = friendlyMasterVisibleDrawEntries();
  const drawPending = Boolean(state.tournament.friendlyCompetitionControl?.drawRequired);
  const activeGroupDay = Number(/^group([1-5])$/.exec(state.tournament.stage)?.[1] || (["barrage", "quarter", "semi", "final", "complete"].includes(state.tournament.stage) ? 5 : 0));
  const groupKeys = ["A", "B", "C", "D"];
  const groupContent = `
    <section class="championship-lobby-section">
      <p class="championship-section-label">Classement Â· 1er qualifiÃ©, 2e et 3e en barrages</p>
      <div class="league-standings-grid championship-groups">${groupKeys.map((group, groupIndex) => `
        <section class="league-standings championship-standings one-point-master-standings">
          <span class="tournament-round-label">Groupe ${groupIndex + 1}</span>
          <div class="league-standings-head"><span>Rang</span><span>Nom</span><span>Points</span><span>DiffÃ©rence</span><span>Boost</span><span>2-0</span></div>
          ${(standings[group] || []).map((row, index) => {
            const visible = !visibleEntries || visibleEntries.has(row.entry);
            return `<div class="league-standings-row ${index < 3 && state.tournament.stage !== "group1" ? "qualified" : ""} ${visible && row.entry === FRIENDLY_TOURNAMENT.entry ? "human-player" : ""}">
              <strong>${index + 1}</strong>
              <span class="tournament-player-identity">${visible ? `${escapeHtml(row.player?.nickname || "Joueur")}${tournamentSeedNumberMarkup(row.entry)}` : "â€”"}</span>
              <strong>${visible ? Number(row.points || 0) : 0}</strong>
              <span>${visible ? formatLeagueDifference(Number(row.difference || 0)) : "0"}</span>
              <span>${visible ? Number(row.boost || 0) : 0}</span>
              <span>${visible ? Number(row.twoZero || 0) : 0}</span>
            </div>`;
          }).join("")}
        </section>
      `).join("")}</div>
    </section>
    ${drawPending ? "" : `<section class="championship-lobby-section">
      <p class="championship-section-label">Calendrier</p>
      <div class="championship-days">${[1, 2, 3, 4, 5].filter((day) => day <= activeGroupDay).map((day) => `
        <section class="championship-day">
          <header><strong>JournÃ©e ${day}</strong><span>${["Aâ€“F / Bâ€“E / Câ€“D", "Aâ€“E / Bâ€“C / Dâ€“F", "Aâ€“D / Bâ€“F / Câ€“E", "Aâ€“B / Eâ€“D / Câ€“F", "Aâ€“C / Bâ€“D / Eâ€“F"][day - 1]}</span></header>
          <div class="championship-day-matches">${matches.filter((match) => match.day === day).map(renderFriendlyMasterTournamentMatch).join("")}</div>
        </section>
      `).join("")}</div>
    </section>`}`;
  const barrages = `<div class="championship-playoffs">${matches.filter((match) => match.round === "barrage" && match.playerA && match.playerB).map(renderFriendlyMasterTournamentMatch).join("")}</div>`;
  const finalContent = drawPending ? "" : `<div class="tournament-bracket championship-final-bracket">
    <div class="tournament-column"><span class="tournament-column-title">Quarts</span>${matches.filter((match) => match.round === "quarter").map(renderFriendlyMasterTournamentMatch).join("")}</div>
    <div class="tournament-column"><span class="tournament-column-title">Demi-finales</span>${matches.filter((match) => match.round === "semi").map(renderFriendlyMasterTournamentMatch).join("")}</div>
    <div class="tournament-column"><span class="tournament-column-title">Finale</span>${matches.filter((match) => match.round === "final").map(renderFriendlyMasterTournamentMatch).join("")}</div>
  </div>`;
  return `<div class="championship-lobby-content"><div class="championship-board friendly-master-board">
    ${friendlyMasterZoneMarkup(1, "Tour 1 Â· Phase de groupes", groupContent)}
    ${friendlyMasterZoneMarkup(2, "Tour 2 Â· Barrages", barrages)}
    ${friendlyMasterZoneMarkup(3, "Tour 3 Â· Tour final", finalContent)}
  </div></div>`;
}

function renderFriendlyLobbyScreen() {
  if (!els.friendlyLobbyContent || !state.tournament?.friendly) return;
  const participants = state.tournament.friendlyParticipants || [];
  const matches = state.tournament.matches || [];
  const format = state.tournament.friendlyFormat || "classic";
  const targetSets = Number(state.tournament.targetSets || 2);
  const distribution = state.tournament.friendlyDistribution || "random";
  const difficulty = state.tournament.difficulty || "normal";
  const bonus = state.tournament.friendlyBonus || "none";
  const playerSelection = state.tournament.friendlyPlayerSelection || "random";
  const visibility = state.tournament.friendlyVisibility === "private" ? "private" : "public";
  const selectionLimit = Number(state.tournament.friendlySelectionLimit || (format === "match" ? 2 : 4));
  const selectedCount = participants.filter((participant) => participant.selected).length;
  const settingsLocked = state.tournament.stage !== "waiting" || state.tournament.friendlySettingsLocked;
  const settingsDisabled = settingsLocked || !FRIENDLY_TOURNAMENT.isCreator || FRIENDLY_TOURNAMENT.isSpectator;
  const competitionControl = state.tournament.friendlyCompetitionControl || null;
  const currentRoundMatches = matches.filter((match) => match.round === state.tournament.stage && match.playerA && match.playerB && !match.winner);
  const humanInCurrentRound = currentRoundMatches.some((match) => match.playerAInfo?.type === "human" || match.playerBInfo?.type === "human");
  const canSimulateCurrentRound = format === "onepointmaster" && currentRoundMatches.length > 0 && !humanInCurrentRound;
  const launchSeconds = competitionControl?.launchAt
    ? Math.max(0, Math.ceil((Number(competitionControl.launchAt) - Date.now()) / 1000))
    : null;
  const canStart = !FRIENDLY_TOURNAMENT.isSpectator && FRIENDLY_TOURNAMENT.isCreator && state.tournament.stage === "waiting" && selectedCount >= 1;
  const startDisabled = !canStart;
  const status = friendlyLobbyStatusText();
  const settingButton = (group, value, label, active) => `<button class="friendly-setting-button ${active ? "active" : ""}" type="button" data-friendly-setting="${group}" data-friendly-setting-value="${value}" ${settingsDisabled ? "disabled" : ""}>${label}</button>`;
  const formatCard = (value, title, description, icon) => `
    <button class="clubhouse-format-card ${format === value ? "active" : ""}" type="button" data-friendly-setting="format" data-friendly-setting-value="${value}" ${settingsDisabled ? "disabled" : ""}>
      <img src="./assets/icons/${icon}" alt="" aria-hidden="true" />
      <span><small>Club House en ligne</small><strong>${title}</strong><em>${description}</em></span>
    </button>
  `;
  const standings = state.tournament.friendlyStandings || { A: [], B: [] };
  const leagueGroups = state.tournament.friendlyGroups || { A: [], B: [] };
  const leagueGroupMarkup = format === "league" && (leagueGroups.A?.length || leagueGroups.B?.length) ? `
    <section>
      <p class="label">Groupes</p>
      <div class="friendly-league-groups">
        ${["A", "B"].map((groupName) => `
          <article class="friendly-league-group">
            <h3>Groupe ${groupName}</h3>
            <div class="friendly-standing-head">
              <span>#</span><span>Joueur</span><span>Pts</span><span>Sets +/-</span><span>Jeux +/-</span>
            </div>
            ${(standings[groupName]?.length ? standings[groupName] : (leagueGroups[groupName] || []).map((player, index) => ({ player, position: index + 1, played: 0, wins: 0, points: 0, setsWon: 0, setsLost: 0, gamesWon: 0, gamesLost: 0 }))).map((row) => `
              <div class="friendly-standing-row">
                <span>${Number(row.position || 0)}</span>
                <strong>${escapeHtml(row.player?.nickname || "Joueur")}</strong>
                <strong class="friendly-standing-points">${Number(row.points || 0)}</strong>
                <span>${formatLeagueDifference(row.setDifference ?? (Number(row.setsWon || 0) - Number(row.setsLost || 0)))}</span>
                <span>${formatLeagueDifference(row.gameDifference ?? (Number(row.gamesWon || 0) - Number(row.gamesLost || 0)))}</span>
              </div>
            `).join("")}
          </article>
        `).join("")}
      </div>
    </section>
  ` : "";
  const masterGroupMarkup = format === "onepointmaster" ? renderFriendlyMasterBoard(matches, standings) : "";
  const masterControlMarkup = ["onepoint", "onepointmaster"].includes(format) && state.tournament.stage !== "waiting" && state.tournament.stage !== "complete" ? `
    <section class="friendly-master-controls" aria-live="polite">
      <div>
        <p class="label">Pilotage de la compÃ©tition</p>
        <h2>${launchSeconds != null ? `DÃ©part des matchs dans ${launchSeconds} seconde${launchSeconds > 1 ? "s" : ""}` : competitionControl?.launched ? "Matchs en cours" : competitionControl?.drawRequired ? "Tirage au sort requis" : "Matchs suivants prÃªts"}</h2>
        <p>${competitionControl?.canControl ? "Vous disposez des commandes du Club House." : "Lâ€™hÃ´te ou le joueur qualifiÃ© dÃ©signÃ© lance le prochain tour."}</p>
      </div>
      ${competitionControl?.canControl ? `<div class="friendly-master-control-actions">
        ${competitionControl.drawRequired ? '<button class="small-button" type="button" data-friendly-master-control="draw">TIRAGE AU SORT</button>' : ""}
        <button class="primary-button" type="button" data-friendly-master-control="next" ${competitionControl.launched || competitionControl.launchAt ? "disabled" : ""}>${competitionControl.drawRequired ? "MATCH SUIVANT" : "MATCH SUIVANT Â· 5 S"}</button>
        ${format === "onepointmaster" && !/^group[1-5]$/.test(state.tournament.stage) ? `<button class="small-button" type="button" data-friendly-master-control="simulate" ${canSimulateCurrentRound ? "" : "disabled"}>SIMULER LES MATCHS</button>` : ""}
      </div>` : ""}
    </section>
  ` : "";
  els.friendlyLobbyContent.innerHTML = `
    <header class="online-room-hero">
      <img src="./assets/MODE-EN-LIGNE.jpg" alt="" aria-hidden="true" />
      <div>
        <p class="label">Club House en ligne</p>
        <h1>${format === "league" ? "League" : format === "onepointmaster" ? "1 Point Master" : format === "onepoint" ? "1 Point Match" : format === "match" ? "Match" : "Tournoi Classic"}</h1>
        <p>${participants.length}/4 joueurs connectÃ©s Â· ${["onepoint", "onepointmaster"].includes(format) ? "un point dÃ©cisif" : `${targetSets} sets gagnants`}</p>
      </div>
    </header>
    <div class="friendly-lobby-title clubhouse-room-heading">
      <div>
        <p class="label">CLUB HOUSE Â· ${escapeHtml(FRIENDLY_TOURNAMENT.id || "")}</p>
        <h2>${FRIENDLY_TOURNAMENT.isSpectator ? "Vue spectateur" : settingsLocked ? "Club House de la compÃ©tition" : "Configuration et joueurs"}</h2>
        <p>${participants.length}/4 connectÃ©s Â· ${selectedCount}/${selectionLimit} sÃ©lectionnÃ©s Â· ${format === "league" ? "LEAGUE" : format === "onepointmaster" ? "1 POINT MASTER" : format === "onepoint" ? "1 POINT MATCH" : format === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE"} Â· ${["onepoint", "onepointmaster"].includes(format) ? "1 point dÃ©cisif" : `${targetSets} sets gagnants`}</p>
      </div>
    </div>
    <div class="friendly-lobby-status">${escapeHtml(status)}</div>
    ${renderFriendlyWaitingExperience()}
    ${settingsLocked ? "" : `<section class="clubhouse-format-section online-room-format-section" aria-labelledby="onlineRoomFormatTitle">
      <div class="clubhouse-section-heading"><div><p class="label">Format</p><h2 id="onlineRoomFormatTitle">Configurez votre Club House</h2></div><span class="clubhouse-friendly-note">RÃ©glages rÃ©servÃ©s Ã  l'hÃ´te</span></div>
      <div class="clubhouse-format-grid" aria-label="Format du Club House en ligne">
        ${formatCard("match", "Match", "Une rencontre directe entre deux joueurs.", "MATCH.svg")}
        ${formatCard("classic", "Tournoi Classic", "Un tableau Ã  Ã©limination directe.", "trophy-circuit.svg")}
        ${formatCard("league", "League", "Une phase de groupes puis les finales.", "LEAGUE.svg")}
        ${formatCard("onepoint", "1 Point Match", "Un unique point par rencontre.", "power-flash.svg")}
        ${formatCard("onepointmaster", "1 Point Master", "24 joueurs, groupes, barrages et tableau final.", "power-flash.svg")}
      </div>
    </section>`}
    <div class="clubhouse-configuration-layout online-room-configuration">
    ${settingsLocked ? "" : `<section class="friendly-settings-panel clubhouse-settings-card">
      <div class="friendly-setting-row">
        <div><strong>Niveau IA</strong><span>${escapeHtml(AI_DIFFICULTY_DESCRIPTIONS[difficulty] || AI_DIFFICULTY_DESCRIPTIONS.normal)}</span></div>
        <div class="friendly-setting-switch seven-options">
          ${["amateur", "normal", "expert", "champion", "legend", "ranking", "circuit"].map((value) => settingButton("difficulty", value, AI_DIFFICULTY_LABELS[value], difficulty === value)).join("")}
        </div>
      </div>
      <div class="friendly-setting-row">
        <div><strong>Bonus</strong><span>Avantage attribuÃ© aux joueurs IA</span></div>
        <div class="friendly-setting-switch five-options">
          ${settingButton("bonus", "none", "SANS", bonus === "none")}
          ${settingButton("bonus", "ascendant", "ASCENDANT", bonus === "ascendant")}
          ${settingButton("bonus", "domination", "DOMINATION", bonus === "domination")}
          ${settingButton("bonus", "nemesis", "BÃŠTE NOIRE", bonus === "nemesis")}
          ${["onepoint", "onepointmaster"].includes(format) ? settingButton("bonus", "reward", "RÃ‰COMPENSE", bonus === "reward") : ""}
        </div>
      </div>
      <div class="friendly-setting-row">
        <div><strong>Joueurs</strong><span>Choix des joueurs IA qui complÃ¨tent l'Ã©vÃ©nement</span></div>
        <div class="friendly-setting-switch">
          ${settingButton("playerSelection", "random", "ALÃ‰ATOIRES", playerSelection === "random")}
          ${settingButton("playerSelection", "best", "MEILLEURS", playerSelection === "best")}
        </div>
      </div>
      <div class="friendly-setting-row ${["onepoint", "onepointmaster"].includes(format) ? "hidden" : ""}">
        <div><strong>Format des sets</strong><span>Sets gagnants par rencontre</span></div>
        <div class="friendly-setting-switch">
          ${settingButton("targetSets", "2", "2 SETS", targetSets === 2)}
          ${settingButton("targetSets", "3", "3 SETS", targetSets === 3)}
        </div>
      </div>
      <div class="friendly-setting-row">
        <div><strong>RÃ©partition des joueurs</strong><span>Placement des 8 participants</span></div>
        <div class="friendly-setting-switch three-options">
          ${settingButton("distribution", "random", "ALÃ‰ATOIRE", distribution === "random")}
          ${settingButton("distribution", "ranking", "CLASSEMENT MONDIAL", distribution === "ranking")}
          ${settingButton("distribution", "separated", "JOUEURS SÃ‰PARÃ‰S", distribution === "separated")}
        </div>
      </div>
    </section>`}
    <aside class="clubhouse-summary-card online-room-summary-card">
      <p class="label">Votre Club House</p>
      <h2>${format === "league" ? "League" : format === "onepointmaster" ? "1 Point Master" : format === "onepoint" ? "1 Point Match" : format === "match" ? "Match en ligne" : "Tournoi Classic"}</h2>
      <div class="clubhouse-summary-text"><strong>${participants.length}/4 joueurs connectÃ©s</strong>${settingsLocked ? "" : `<span>${["onepoint", "onepointmaster"].includes(format) ? "1 point dÃ©cisif" : `${targetSets} sets gagnants`} Â· ${AI_DIFFICULTY_LABELS[difficulty]} Â· ${AI_BONUS_LABELS[bonus]}</span><span>RÃ©partition : ${distribution === "ranking" ? "classement mondial" : distribution === "separated" ? "joueurs sÃ©parÃ©s" : "alÃ©atoire"}</span>`}</div>
      ${FRIENDLY_TOURNAMENT.resumableMatch && !FRIENDLY_TOURNAMENT.isSpectator ? `<button class="small-button friendly-clubhouse-resume-button" type="button" data-resume-friendly-match>REPRENDRE MON MATCH</button>` : ""}
      ${format === "onepoint" && state.tournament.friendlyCanSimulateRemainder ? '<button class="small-button" type="button" data-friendly-simulate-remainder>SIMULER LA SUITE</button>' : ""}
      ${FRIENDLY_TOURNAMENT.isSpectator || state.tournament.stage !== "waiting" ? "" : `<div class="friendly-start-selection-count"><strong>${selectedCount}</strong><span>joueur${selectedCount > 1 ? "s" : ""} sÃ©lectionnÃ©${selectedCount > 1 ? "s" : ""}</span></div><button class="primary-button friendly-lobby-start-button" type="button" data-start-friendly-tournament ${startDisabled ? "disabled" : ""}>LANCER Lâ€™Ã‰VÃ‰NEMENT</button>`}
      <button class="small-button danger-button friendly-lobby-exit-button" type="button" data-leave-friendly-tournament>Sortir</button>
      ${!FRIENDLY_TOURNAMENT.isSpectator && FRIENDLY_TOURNAMENT.isCreator && state.tournament.stage === "complete" ? `<button class="primary-button friendly-new-event-button" type="button" data-new-friendly-event>NOUVEL Ã‰VÃ‰NEMENT</button>` : ""}
    </aside>
    </div>
    <section>
      <p class="label">Joueurs humains</p>
      <div class="friendly-player-grid">
        ${participants.map((participant) => `
          <article class="friendly-player-card ${participant.selected ? "selected" : ""} ${FRIENDLY_TOURNAMENT.isCreator && !settingsLocked ? "selectable" : ""}" ${FRIENDLY_TOURNAMENT.isCreator && !settingsLocked ? `data-select-friendly-participant="${escapeHtml(participant.id)}" data-selected="${participant.selected ? "true" : "false"}" role="button" tabindex="0"` : ""}>
            <div class="friendly-player-identity">
              ${participant.selected ? `<img class="friendly-selected-icon" src="./assets/icons/VALID.svg" alt="SÃ©lectionnÃ©" />` : ""}
              <div class="friendly-player-copy">
                <strong class="friendly-player-name">${escapeHtml(participant.nickname || "Joueur")}${participant.isCreator ? " Â· CrÃ©ateur" : ""}</strong>
                <span>${escapeHtml(characterNameFromId(participant.characterId))}${participant.selected ? " Â· PrÃªt Ã  jouer" : " Â· En attente"}${participant.forfeited ? " Â· Forfait dÃ©finitif" : participant.eliminated ? " Â· Ã‰liminÃ©" : participant.away ? " Â· Absent temporairement" : ""}</span>
              </div>
            </div>
            ${FRIENDLY_TOURNAMENT.isCreator && !settingsLocked && participant.id !== FRIENDLY_TOURNAMENT.participantId ? `<button class="small-button danger-button friendly-kick-button" type="button" data-kick-friendly-participant="${escapeHtml(participant.id)}" data-kick-friendly-nickname="${escapeHtml(participant.nickname || "Joueur")}">EXCLURE</button>` : ""}
          </article>
        `).join("")}
      </div>
    </section>
    ${masterControlMarkup}
    ${settingsLocked ? "" : `<section class="friendly-visibility-section">
      <div>
        <p class="label">ConfidentialitÃ©</p>
        <h2>Ã‰vÃ©nement public ou privÃ©</h2>
        <p>${visibility === "private" ? "Seuls les joueurs validÃ©s peuvent regarder les rencontres." : "Les autres joueurs peuvent suivre les rencontres en spectateur."}</p>
      </div>
      <div class="friendly-setting-switch friendly-visibility-switch" aria-label="ConfidentialitÃ© de lâ€™Ã©vÃ©nement">
        ${settingButton("visibility", "public", "PUBLIC", visibility === "public")}
        ${settingButton("visibility", "private", "PRIVÃ‰", visibility === "private")}
      </div>
    </section>`}
    ${leagueGroupMarkup}
    ${masterGroupMarkup}
    ${format === "league" ? renderFriendlyLeagueSchedule(matches) : ""}
    ${matches.length && format !== "league" && format !== "onepointmaster" ? `
      <section>
        <p class="label">${format === "onepointmaster" ? "Groupes, barrages et tour final" : format === "onepoint" ? "Tableau 1 Point Match" : "Tableau CLASSIC"}</p>
        <div class="friendly-bracket-grid">
          ${matches.map(renderFriendlyLobbyMatchCard).join("")}
        </div>
      </section>
    ` : ""}
  `;
  const startButton = els.friendlyLobbyContent.querySelector("[data-start-friendly-tournament]");
  if (startButton && !startDisabled) startButton.addEventListener("click", startFriendlyTournamentFromLobby);
  els.friendlyLobbyContent.querySelector("[data-resume-friendly-match]")?.addEventListener("click", resumeFriendlyMatchFromClubHouse);
  els.friendlyLobbyContent.querySelectorAll("[data-friendly-setting]").forEach((button) => {
    button.addEventListener("click", () => updateFriendlyTournamentSettings(button.dataset.friendlySetting, button.dataset.friendlySettingValue));
  });
  els.friendlyLobbyContent.querySelectorAll("[data-kick-friendly-participant]").forEach((button) => {
    button.addEventListener("click", (event) => { event.stopPropagation(); kickFriendlyParticipant(button.dataset.kickFriendlyParticipant, button.dataset.kickFriendlyNickname); });
  });
  els.friendlyLobbyContent.querySelectorAll("[data-select-friendly-participant]").forEach((card) => {
    const toggle = () => toggleFriendlyParticipantSelection(card.dataset.selectFriendlyParticipant, card.dataset.selected !== "true");
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); toggle(); } });
  });
  els.friendlyLobbyContent.querySelector("[data-leave-friendly-tournament]")?.addEventListener("click", leaveFriendlyTournamentLobby);
  els.friendlyLobbyContent.querySelector("[data-new-friendly-event]")?.addEventListener("click", createNewFriendlyEventFromClubHouse);
  els.friendlyLobbyContent.querySelector("[data-friendly-simulate-remainder]")?.addEventListener("click", () => controlFriendlyCompetition("simulate"));
  els.friendlyLobbyContent.querySelectorAll("[data-friendly-master-control]").forEach((button) => {
    button.addEventListener("click", () => controlFriendlyCompetition(button.dataset.friendlyMasterControl));
  });
  els.friendlyLobbyContent.querySelectorAll("[data-friendly-master-zone]").forEach((button) => {
    button.addEventListener("click", () => {
      const phase = Number(button.dataset.friendlyMasterZone);
      CHAMPIONSHIP_LOBBY_UI.openZone = Number(CHAMPIONSHIP_LOBBY_UI.openZone) === phase ? 0 : phase;
      renderFriendlyLobbyScreen();
    });
  });
  els.friendlyLobbyContent.querySelectorAll("[data-watch-friendly-match]").forEach((button) => {
    button.addEventListener("click", () => startFriendlySpectator(button.dataset.watchFriendlyMatch));
  });
}

async function updateFriendlyTournamentSettings(setting, value) {
  if (!FRIENDLY_TOURNAMENT.isCreator || state.tournament.stage !== "waiting") return;
  const next = {
    format: state.tournament.friendlyFormat || "classic",
    targetSets: Number(state.tournament.targetSets || 2),
    distribution: state.tournament.friendlyDistribution || "random",
    difficulty: state.tournament.difficulty || "normal",
    bonus: state.tournament.friendlyBonus || "none",
    playerSelection: state.tournament.friendlyPlayerSelection || "random",
    visibility: state.tournament.friendlyVisibility === "private" ? "private" : "public",
  };
  if (setting === "format") {
    next.format = ["match", "classic", "league", "onepoint", "onepointmaster"].includes(value) ? value : "match";
    if (["onepoint", "onepointmaster"].includes(next.format)) next.targetSets = 1;
    else if (Number(next.targetSets) === 1) next.targetSets = 2;
  }
  if (setting === "targetSets") next.targetSets = Number(value) === 3 ? 3 : 2;
  if (setting === "distribution") next.distribution = ["random", "ranking", "separated"].includes(value) ? value : "random";
  if (setting === "difficulty") next.difficulty = AI_DIFFICULTIES.includes(value) ? value : "normal";
  if (setting === "bonus") next.bonus = ["none", "ascendant", "domination", "nemesis", "reward"].includes(value) ? value : "none";
  if (setting === "playerSelection") next.playerSelection = value === "best" ? "best" : "random";
  if (setting === "visibility") next.visibility = value === "private" ? "private" : "public";
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/settings`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ participantId: FRIENDLY_TOURNAMENT.participantId, token: FRIENDLY_TOURNAMENT.token, ...next }),
    });
    if (!response.ok) throw new Error("settings failed");
    const data = await response.json();
    applyFriendlyTournamentState(data.tournament, null);
  } catch (error) {
    state.log.unshift("La configuration du tournoi n'a pas pu Ãªtre modifiÃ©e.");
  }
}

async function createNewFriendlyEventFromClubHouse() {
  if (!FRIENDLY_TOURNAMENT.enabled || !FRIENDLY_TOURNAMENT.isCreator || state.tournament?.stage !== "complete") return;
  const confirmed = await showEventConfirmDialog({
    kicker: "Club House en ligne",
    title: "PrÃ©parer un nouvel Ã©vÃ©nement ?",
    message: "Le tableau terminÃ© sera remplacÃ© par une nouvelle configuration avec les joueurs encore prÃ©sents dans le Club House.",
    highlight: "Les rÃ©glages seront de nouveau modifiables",
    confirmLabel: "NOUVEL Ã‰VÃ‰NEMENT",
  });
  if (!confirmed) return;
  await showTournamentLoadingDialog("Le nouveau Club House est en train d'Ãªtre prÃ©parÃ©.", "Nouvel Ã©vÃ©nement");
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/new-event`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ participantId: FRIENDLY_TOURNAMENT.participantId, token: FRIENDLY_TOURNAMENT.token }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Le nouvel Ã©vÃ©nement n'a pas pu Ãªtre prÃ©parÃ©.");
    FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = false;
    FRIENDLY_TOURNAMENT.waitingForNextRound = false;
    FRIENDLY_TOURNAMENT.readyRound = null;
    FRIENDLY_TOURNAMENT.lastReportedMatchId = null;
    FRIENDLY_TOURNAMENT.lastForfeitNoticeMatchId = null;
    applyFriendlyTournamentState(data.tournament, null);
    showFriendlyLobbyScreen();
    renderFriendlyLobbyScreen();
    pollFriendlyTournament();
  } catch (error) {
    MENU_STATE.lobbyNotice = error.message || "Le nouvel Ã©vÃ©nement n'a pas pu Ãªtre prÃ©parÃ©.";
    renderFriendlyLobbyScreen();
  } finally {
    hideTournamentLoadingDialog();
  }
}

async function toggleFriendlyParticipantSelection(targetParticipantId, selected) {
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/selection`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ participantId: FRIENDLY_TOURNAMENT.participantId, token: FRIENDLY_TOURNAMENT.token, targetParticipantId, selected }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "SÃ©lection impossible.");
    applyFriendlyTournamentState(data.tournament, null);
  } catch (error) {
    state.log.unshift(error.message || "SÃ©lection impossible.");
  }
}

async function kickFriendlyParticipant(targetParticipantId, nickname) {
  if (!FRIENDLY_TOURNAMENT.isCreator || !targetParticipantId) return;
  if (!window.confirm(`Exclure ${nickname || "ce joueur"} du CLUB HOUSE ? Il ne pourra plus rejoindre ce tournoi.`)) return;
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/kick`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        participantId: FRIENDLY_TOURNAMENT.participantId,
        token: FRIENDLY_TOURNAMENT.token,
        targetParticipantId,
      }),
    });
    if (!response.ok) throw new Error("kick failed");
    const data = await response.json();
    applyFriendlyTournamentState(data.tournament, null);
  } catch (error) {
    state.log.unshift("Impossible d'exclure ce joueur.");
  }
}

function startFriendlySpectator(matchId) {
  if (!FRIENDLY_TOURNAMENT.enabled || FRIENDLY_TOURNAMENT.inMatch || !matchId) return;
  const match = tournamentMatchById(matchId);
  if (!match?.watchable) return;
  SPECTATOR_MODE.enabled = true;
  SPECTATOR_MODE.source = "friendly";
  SPECTATOR_MODE.matchId = matchId;
  SPECTATOR_MODE.matchLabel = match.label || "Match en cours";
  SPECTATOR_MODE.liveScore = match.liveScore || "";
  SPECTATOR_MODE.lastTournamentPayload = null;
  SPECTATOR_MODE.endDialogOpen = false;
  SOLO_AI.enabled = false;
  document.body.classList.add("spectator-mode");
  showGameScreen();
  pollFriendlySpectatorState();
  window.clearInterval(SPECTATOR_MODE.pollTimer);
  SPECTATOR_MODE.pollTimer = window.setInterval(pollFriendlySpectatorState, 700);
}

function closeSpectatorMatchEndDialog() {
  window.clearInterval(SPECTATOR_MODE.endCountdownTimer);
  SPECTATOR_MODE.endCountdownTimer = null;
  SPECTATOR_MODE.endDialogOpen = false;
  document.querySelector(".spectator-match-end-backdrop")?.remove();
}

function showFriendlySpectatorMatchEndDialog(match = {}) {
  if (SPECTATOR_MODE.endDialogOpen) return;
  window.clearInterval(SPECTATOR_MODE.pollTimer);
  SPECTATOR_MODE.endDialogOpen = true;
  let remaining = 5;
  const playerA = match.playerA?.nickname || "Joueur 1";
  const playerB = match.playerB?.nickname || "Joueur 2";
  const finalScore = String(match.score || SPECTATOR_MODE.liveScore || "Score indisponible").replace(/\s*Â·\s*EN DIRECT\s*$/i, "");
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop event-transition-backdrop spectator-match-end-backdrop";
  backdrop.innerHTML = `
    <section class="event-transition-panel spectator-match-end-panel" role="dialog" aria-modal="true" aria-labelledby="spectatorMatchEndTitle">
      <p class="event-transition-kicker">Club House en ligne</p>
      <h2 id="spectatorMatchEndTitle">FIN DU MATCH</h2>
      <div class="spectator-match-end-versus"><strong>${escapeHtml(playerA)}</strong><span>contre</span><strong>${escapeHtml(playerB)}</strong></div>
      <div class="spectator-match-end-score"><span>Score final</span><strong>${escapeHtml(finalScore)}</strong></div>
      <p>Retour au Club House dans <strong data-spectator-end-seconds aria-live="assertive">${remaining}</strong> secondes</p>
    </section>
  `;
  document.body.appendChild(backdrop);
  SPECTATOR_MODE.endCountdownTimer = window.setInterval(() => {
    remaining -= 1;
    const counter = backdrop.querySelector("[data-spectator-end-seconds]");
    if (counter) counter.textContent = String(Math.max(0, remaining));
    if (remaining > 0) return;
    closeSpectatorMatchEndDialog();
    quitFriendlySpectator(true);
  }, 1000);
}

async function pollFriendlySpectatorState() {
  if (!SPECTATOR_MODE.enabled || !SPECTATOR_MODE.matchId) return;
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/matches/${encodeURIComponent(SPECTATOR_MODE.matchId)}/watch?${friendlyTournamentAccessQuery()}`);
    if (!response.ok) throw new Error("watch failed");
    const data = await response.json();
    if (!data.active || !data.state) {
      if (data.match?.winner || data.match?.score) showFriendlySpectatorMatchEndDialog(data.match);
      else quitFriendlySpectator(true);
      return;
    }
    SPECTATOR_MODE.matchLabel = data.match?.label || SPECTATOR_MODE.matchLabel;
    SPECTATOR_MODE.liveScore = data.liveScore || SPECTATOR_MODE.liveScore;
    for (const key of SYNC_STATE_KEYS) {
      if (Object.prototype.hasOwnProperty.call(data.state, key)) state[key] = cloneData(data.state[key]);
    }
    state.pendingBoost = null;
    state.pendingEffectChoice = null;
    state.pendingCoachChoice = null;
    state.pendingRemoveChoice = null;
    state.pendingEndTurnAfterChoice = null;
    SOLO_AI.enabled = false;
    showGameScreen();
    render();
  } catch (error) {
    quitFriendlySpectator(true);
  }
}

function quitFriendlySpectator(matchEnded = false) {
  window.clearInterval(SPECTATOR_MODE.pollTimer);
  closeSpectatorMatchEndDialog();
  SPECTATOR_MODE.enabled = false;
  const spectatorSource = SPECTATOR_MODE.source;
  const returnProfileUserId = SPECTATOR_MODE.returnProfileUserId;
  SPECTATOR_MODE.source = null;
  SPECTATOR_MODE.matchId = null;
  SPECTATOR_MODE.matchLabel = "";
  SPECTATOR_MODE.liveScore = "";
  SPECTATOR_MODE.profileUserId = null;
  SPECTATOR_MODE.returnProfileUserId = null;
  document.body.classList.remove("spectator-mode");
  if (spectatorSource === "profile") {
    showProfileScreen(returnProfileUserId);
    return;
  }
  showFriendlyLobbyScreen();
  if (matchEnded) MENU_STATE.lobbyNotice = "Le match regardÃ© est terminÃ©.";
  const latestTournament = SPECTATOR_MODE.lastTournamentPayload;
  SPECTATOR_MODE.lastTournamentPayload = null;
  if (latestTournament) applyFriendlyTournamentState(latestTournament, null);
  else pollFriendlyTournament();
}

function friendlyPlayerStillQualified() {
  const entry = FRIENDLY_TOURNAMENT.entry;
  if (!entry || FRIENDLY_TOURNAMENT.isSpectator) return false;
  const participant = (state.tournament.friendlyParticipants || []).find((item) => item.entry === entry);
  if (participant?.eliminated) return false;
  const matches = state.tournament.matches || [];
  const pendingMatch = matches.some((match) => !match.winner && (match.playerA === entry || match.playerB === entry));
  if (pendingMatch) return true;
  const stage = state.tournament.stage;
  if ((state.tournament.friendlyFormat || "classic") === "league") {
    if (["group1", "group2", "group3"].includes(stage)) return true;
    const knockoutMatches = matches.filter((match) => ["semi", "final"].includes(match.round) && (match.playerA === entry || match.playerB === entry));
    if (!knockoutMatches.length) return false;
    const latestKnockout = knockoutMatches.filter((match) => match.winner).at(-1);
    return !latestKnockout || latestKnockout.winner === entry;
  }
  const completedMatches = matches.filter((match) => match.winner && (match.playerA === entry || match.playerB === entry));
  const latestMatch = completedMatches.at(-1);
  return !latestMatch || latestMatch.winner === entry;
}

function friendlyLobbyStatusText() {
  if (!state.tournament?.friendly) return "Chargement du CLUB HOUSE...";
  if (FRIENDLY_TOURNAMENT.isSpectator) {
    return state.tournament.stage === "complete"
      ? `Tournoi terminÃ©. Vainqueur : ${tournamentPlayerLabel(state.tournament.championCharacterId)}.`
      : "Mode spectateur : consultez les scores et ouvrez les matchs humains disponibles avec VOIR.";
  }
  if (state.tournament.stage === "waiting") {
    if (FRIENDLY_TOURNAMENT.isCreator) {
      const selectedCount = state.tournament.friendlyParticipants.filter((participant) => participant.selected).length;
      return selectedCount
        ? `${selectedCount} joueur${selectedCount > 1 ? "s" : ""} sÃ©lectionnÃ©${selectedCount > 1 ? "s" : ""}. Tu peux lancer l'Ã©vÃ©nement : l'IA complÃ¨tera les places libres.`
        : "SÃ©lectionne au moins un pseudo pour lancer l'Ã©vÃ©nement.";
    }
    return "En attente de la sÃ©lection et du lancement par l'hÃ´te du CLUB HOUSE.";
  }
  if (state.tournament.stage === "complete") {
    return `Tournoi terminÃ©. Vainqueur : ${tournamentPlayerLabel(state.tournament.championCharacterId)}.`;
  }
  if (friendlyPlayerStillQualified()) return "Attente de la fin des rencontres avant le dÃ©but du tour suivant.";
  return "Ton parcours est terminÃ©. Tu peux suivre la suite du tournoi depuis le CLUB HOUSE.";
}

function renderFriendlyWaitingExperience() {
  if (!state.tournament?.friendly || ["waiting", "complete"].includes(state.tournament.stage) || FRIENDLY_TOURNAMENT.inMatch) return "";
  const qualified = friendlyPlayerStillQualified();
  const matches = state.tournament.matches || [];
  const completed = matches.filter((match) => match.winner).length;
  const total = matches.length;
  return `
    <section class="event-waiting-panel" aria-live="polite">
      <div class="event-waiting-pulse" aria-hidden="true"><i></i><i></i><i></i></div>
      <div>
        <p class="event-transition-kicker">Tournoi en cours</p>
        <h2>${qualified ? "PrÃ©paration du prochain tour" : "La compÃ©tition continue"}</h2>
        <p>${qualified ? "Les autres rencontres se terminent. Votre prochain match apparaÃ®tra automatiquement." : "Votre parcours est terminÃ©, mais vous pouvez suivre les scores depuis le Club House."}</p>
      </div>
      <strong>${completed}/${total || "â€“"}<span>matchs terminÃ©s</span></strong>
    </section>
  `;
}

async function pollFriendlyTournament() {
  if (!FRIENDLY_TOURNAMENT.enabled) return;
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}?${friendlyTournamentAccessQuery()}`);
    if (response.status === 404) {
      window.clearInterval(FRIENDLY_TOURNAMENT.pollTimer);
      FRIENDLY_TOURNAMENT.enabled = false;
      MENU_STATE.lobbyNotice = "LE CLUB HOUSE A Ã‰TÃ‰ FERMÃ‰";
      resetTournament();
      showMenuScreen();
      return;
    }
    if (response.status === 403) {
      const data = await response.json().catch(() => ({}));
      if (data.kicked) {
        window.clearInterval(FRIENDLY_TOURNAMENT.pollTimer);
        resetFriendlyTournamentConnection();
        MENU_STATE.lobbyNotice = "VOUS AVEZ Ã‰TÃ‰ EXCLU DU CLUB HOUSE";
        resetTournament();
        showMenuScreen();
        return;
      }
    }
    if (!response.ok) throw new Error("poll failed");
    const data = await response.json();
    applyFriendlyTournamentState(data.tournament, data.currentMatch);
  } catch (error) {
    state.log.unshift("Tournoi amical indisponible pour le moment.");
    render();
  }
}

async function startFriendlyTournamentFromLobby() {
  if (!FRIENDLY_TOURNAMENT.enabled || !FRIENDLY_TOURNAMENT.isCreator) return;
  const selectedCount = state.tournament?.friendlyParticipants?.filter((participant) => participant.selected).length || 0;
  if (selectedCount < 2) {
    await showEventConfirmDialog({
      kicker: "SÃ©lection des joueurs",
      title: "Deux joueurs minimum",
      message: "Une partie ne peut pas Ãªtre lancÃ©e avec un seul joueur sÃ©lectionnÃ©. SÃ©lectionnez au moins deux joueurs.",
      confirmLabel: "COMPRIS",
      cancelLabel: "RETOUR",
    });
    return;
  }
  const friendlyFormat = state.tournament?.friendlyFormat || "match";
  const formatLabel = friendlyFormat === "league" ? "LEAGUE" : friendlyFormat === "onepointmaster" ? "1 POINT MASTER" : friendlyFormat === "onepoint" ? "1 POINT MATCH" : friendlyFormat === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE";
  const setsLabel = Number(state.tournament?.targetSets || 2);
  const confirmed = await showEventConfirmDialog({
    kicker: "Club House en ligne",
    title: `Lancer ${formatLabel} ?`,
    message: `Lâ€™Ã©vÃ©nement se jouera en ${setsLabel} sets gagnants. La configuration sera ensuite verrouillÃ©e.`,
    highlight: `${selectedCount} joueur${selectedCount > 1 ? "s" : ""} sÃ©lectionnÃ©${selectedCount > 1 ? "s" : ""}`,
    confirmLabel: "LANCER Lâ€™Ã‰VÃ‰NEMENT",
  });
  if (!confirmed) return;
  await showTournamentLoadingDialog("Votre Ã©vÃ©nement en ligne est en train d'Ãªtre crÃ©Ã©.");
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/start`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ participantId: FRIENDLY_TOURNAMENT.participantId, token: FRIENDLY_TOURNAMENT.token }),
    });
    if (!response.ok) throw new Error("start failed");
    const data = await response.json();
    applyFriendlyTournamentState(data.tournament, null);
    pollFriendlyTournament();
  } catch (error) {
    state.log.unshift("Impossible de lancer le tournoi amical.");
    render();
  } finally {
    hideTournamentLoadingDialog();
  }
}

async function leaveFriendlyTournamentLobby({ confirmed = false, returnToClubHouse = false, destination = "home" } = {}) {
  if (!FRIENDLY_TOURNAMENT.enabled) return;
  if (FRIENDLY_TOURNAMENT.isSpectator) {
    if (!confirmed && !window.confirm("Quitter le CLUB HOUSE du tournoi ?")) return;
    resetFriendlyTournamentConnection();
    MENU_STATE.lobbyNotice = "Vous avez quittÃ© le mode spectateur.";
    resetTournament();
    if (destination === "online") showLobbySection("online");
    else showMenuScreen();
    return;
  }
  const waitingRoomExit = state.tournament?.stage === "waiting";
  const localParticipant = (state.tournament?.friendlyParticipants || [])
    .find((participant) => participant.id === FRIENDLY_TOURNAMENT.participantId);
  const alreadyEliminated = Boolean(localParticipant?.eliminated || localParticipant?.forfeited);
  const confirmationText = waitingRoomExit
    ? "Quitter ce CLUB HOUSE ? Vous pourrez le rejoindre de nouveau tant que le tournoi n'est pas lancÃ©."
    : alreadyEliminated
      ? "Quitter le tournoi ? Vous pourrez continuer Ã  suivre la compÃ©tition en revenant au Club House."
      : "Attention : quitter maintenant sera dÃ©clarÃ© comme forfait si vous ne vous reconnectez pas dans les 20 secondes.";
  if (!confirmed && !window.confirm(confirmationText)) return;
  const currentMatch = state.tournament?.currentMatch ? tournamentMatchById(state.tournament.currentMatch) : null;
  const scoreAtDeparture = currentMatch && state.setMatch?.enabled ? friendlyLiveScoreText(currentMatch) : null;
  const savedState = currentMatch && state.setMatch?.enabled && !state.setMatch.matchOver ? exportSyncState() : null;
  let leaveResult = null;
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/leave`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        participantId: FRIENDLY_TOURNAMENT.participantId,
        token: FRIENDLY_TOURNAMENT.token,
        matchId: currentMatch?.id || null,
        score: scoreAtDeparture,
        state: savedState,
        baseRevision: SERVER_SYNC.friendlyMatch ? SERVER_SYNC.revision : null,
      }),
    });
    if (!response.ok) throw new Error("pause failed");
    leaveResult = await response.json().catch(() => ({}));
  } catch (error) {
    state.log.unshift("Impossible d'interrompre le tournoi pour le moment.");
    render();
    return;
  }
  if (returnToClubHouse) {
    cancelFriendlyMatchCountdown();
    FRIENDLY_TOURNAMENT.inMatch = false;
    FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = true;
    FRIENDLY_TOURNAMENT.currentMatchId = null;
    leaveOnlineRoom();
    clearOnlineUrlParams();
    if (leaveResult?.tournament) applyFriendlyTournamentState(leaveResult.tournament, null);
    showFriendlyLobbyScreen();
    renderFriendlyLobbyScreen();
    pollFriendlyTournament();
    return;
  }
  resetFriendlyTournamentConnection();
  MENU_STATE.lobbyNotice = waitingRoomExit
      ? "Vous avez quittÃ© le CLUB HOUSE. Vous pouvez le rejoindre de nouveau tant que le tournoi reste ouvert."
      : leaveResult?.inMatch
        ? `Match interrompu. Utilisez REPRENDRE dans les ${Number(leaveResult.graceSeconds || 20)} secondes pour Ã©viter le forfait.`
        : "Tournoi mis en pause. Utilisez REPRENDRE pour revenir au CLUB HOUSE.";
  resetTournament();
  if (destination === "online") showLobbySection("online");
  else showMenuScreen();
}

function signalFriendlyTournamentPageExit() {
  if (
    FRIENDLY_TOURNAMENT.pageExitSignaled
    || !FRIENDLY_TOURNAMENT.enabled
    || FRIENDLY_TOURNAMENT.isSpectator
    || !FRIENDLY_TOURNAMENT.id
    || !FRIENDLY_TOURNAMENT.participantId
    || !FRIENDLY_TOURNAMENT.token
  ) return;
  const currentMatch = state.tournament?.currentMatch ? tournamentMatchById(state.tournament.currentMatch) : null;
  if (FRIENDLY_TOURNAMENT.inMatch && (!currentMatch || state.setMatch?.matchOver)) return;
  FRIENDLY_TOURNAMENT.pageExitSignaled = true;
  const payload = JSON.stringify({
    participantId: FRIENDLY_TOURNAMENT.participantId,
    token: FRIENDLY_TOURNAMENT.token,
    presenceId: FRIENDLY_TOURNAMENT.presenceId,
    status: "offline",
    matchId: currentMatch?.id || null,
    score: currentMatch ? friendlyLiveScoreText(currentMatch) : null,
  });
  const endpoint = `/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/presence`;
  const sent = typeof navigator.sendBeacon === "function"
    && navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
  if (!sent) {
    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

async function restoreFriendlyTournamentPresence() {
  if (
    !FRIENDLY_TOURNAMENT.enabled
    || FRIENDLY_TOURNAMENT.isSpectator
    || !FRIENDLY_TOURNAMENT.id
    || !FRIENDLY_TOURNAMENT.participantId
    || !FRIENDLY_TOURNAMENT.token
  ) return;
  try {
    await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/presence`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        participantId: FRIENDLY_TOURNAMENT.participantId,
        token: FRIENDLY_TOURNAMENT.token,
        presenceId: FRIENDLY_TOURNAMENT.presenceId,
        status: "online",
      }),
    });
  } catch (error) {
  } finally {
    FRIENDLY_TOURNAMENT.pageExitSignaled = false;
  }
}

function resetFriendlyTournamentConnection() {
  cancelFriendlyMatchCountdown();
  closeFriendlyOpponentDisconnectDialog();
  closeSpectatorMatchEndDialog();
  if (SERVER_SYNC.friendlyMatch) leaveOnlineRoom();
  window.clearInterval(FRIENDLY_TOURNAMENT.pollTimer);
  window.clearInterval(FRIENDLY_TOURNAMENT.streamTimer);
  window.clearInterval(SPECTATOR_MODE.pollTimer);
  SPECTATOR_MODE.enabled = false;
  SPECTATOR_MODE.source = null;
  SPECTATOR_MODE.matchId = null;
  SPECTATOR_MODE.lastTournamentPayload = null;
  SPECTATOR_MODE.endDialogOpen = false;
  document.body.classList.remove("spectator-mode");
  FRIENDLY_TOURNAMENT.enabled = false;
  FRIENDLY_TOURNAMENT.isSpectator = false;
  FRIENDLY_TOURNAMENT.presenceId = null;
  FRIENDLY_TOURNAMENT.id = null;
  FRIENDLY_TOURNAMENT.participantId = null;
  FRIENDLY_TOURNAMENT.spectatorId = null;
  FRIENDLY_TOURNAMENT.token = null;
  FRIENDLY_TOURNAMENT.entry = null;
  FRIENDLY_TOURNAMENT.inMatch = false;
  FRIENDLY_TOURNAMENT.currentMatchId = null;
  FRIENDLY_TOURNAMENT.lastReportedMatchId = null;
  FRIENDLY_TOURNAMENT.lastForfeitNoticeMatchId = null;
  FRIENDLY_TOURNAMENT.localMatchSeat = null;
  FRIENDLY_TOURNAMENT.waitingForNextRound = false;
  FRIENDLY_TOURNAMENT.readyRound = null;
  FRIENDLY_TOURNAMENT.forfeitDialogOpen = false;
  FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = false;
  FRIENDLY_TOURNAMENT.resumableMatch = null;
  FRIENDLY_TOURNAMENT.drawAnimating = false;
  FRIENDLY_TOURNAMENT.drawVisibleCount = null;
  FRIENDLY_TOURNAMENT.drawEntries = [];
  document.querySelector(".friendly-forfeit-dialog")?.remove();
  clearFriendlyTournamentUrlParams();
}

async function reportFriendlyTournamentResult(matchOverride = null) {
  const match = matchOverride || tournamentMatchById(state.tournament.currentMatch);
  if (!FRIENDLY_TOURNAMENT.enabled || !match || FRIENDLY_TOURNAMENT.lastReportedMatchId === match.id) return;
  if (!match || !state.setMatch.matchOver) return;
  const sharedHumanMatch = Boolean(SERVER_SYNC.friendlyMatch || match.humanVsHuman);
  const winner = sharedHumanMatch
    ? (state.setMatch.matchWinner === 0 ? match.playerA : match.playerB)
    : state.setMatch.matchWinner === 0
      ? FRIENDLY_TOURNAMENT.entry
      : (match.playerA === FRIENDLY_TOURNAMENT.entry ? match.playerB : match.playerA);
  const finalSharedState = sharedHumanMatch ? exportSyncState() : null;
  FRIENDLY_TOURNAMENT.lastReportedMatchId = match.id;
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/matches/${encodeURIComponent(match.id)}/result`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        participantId: FRIENDLY_TOURNAMENT.participantId,
        token: FRIENDLY_TOURNAMENT.token,
        winner,
        score: tournamentCompletedSetScore(match),
        state: finalSharedState,
      }),
    });
    if (!response.ok) throw new Error("result failed");
    const data = await response.json();
    applyFriendlyTournamentState(data.tournament, null);
  } catch (error) {
    FRIENDLY_TOURNAMENT.lastReportedMatchId = null;
    state.log.unshift("RÃ©sultat non envoyÃ© au tournoi amical.");
    render();
  }
}

async function readyFriendlyTournamentNextMatch() {
  if (!FRIENDLY_TOURNAMENT.enabled || !state.tournament.active) return;
  FRIENDLY_TOURNAMENT.waitingForNextRound = true;
  FRIENDLY_TOURNAMENT.readyRound = state.tournament.stage;
  try {
    await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/ready`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ participantId: FRIENDLY_TOURNAMENT.participantId, token: FRIENDLY_TOURNAMENT.token }),
    });
    await pollFriendlyTournament();
  } catch (error) {
    state.log.unshift("Validation du match suivant impossible.");
    render();
  }
}

function friendlyDrawAnimationEntries(tournament) {
  if (!tournament) return [];
  if (tournament.round === "group1") {
    return [0, 1, 2, 3, 4, 5].flatMap((slot) => (
      ["A", "B", "C", "D"].map((group, groupIndex) => {
        const player = tournament.groups?.[group]?.[slot];
        return player ? {
          entry: player.entry,
          label: player.nickname || tournamentPlayerLabel(player.entry),
          detail: `Groupe ${groupIndex + 1}`,
        } : null;
      }).filter(Boolean)
    ));
  }
  return (tournament.matches || [])
    .filter((match) => match.round === tournament.round)
    .flatMap((match) => [
      match.playerAInfo ? { entry: match.playerA, label: match.playerAInfo.nickname || tournamentPlayerLabel(match.playerA), detail: match.label } : null,
      match.playerBInfo ? { entry: match.playerB, label: match.playerBInfo.nickname || tournamentPlayerLabel(match.playerB), detail: match.label } : null,
    ])
    .filter(Boolean);
}

function showFriendlyDrawAnimation(tournament) {
  const entries = friendlyDrawAnimationEntries(tournament);
  if (!entries.length) return Promise.resolve();
  return new Promise((resolve) => {
    FRIENDLY_TOURNAMENT.drawAnimating = true;
    FRIENDLY_TOURNAMENT.drawEntries = entries;
    FRIENDLY_TOURNAMENT.drawVisibleCount = 0;
    CHAMPIONSHIP_LOBBY_UI.openZone = tournament.round === "quarter" ? 3 : 1;
    renderFriendlyLobbyScreen();
    const timer = window.setInterval(() => {
      FRIENDLY_TOURNAMENT.drawVisibleCount += 1;
      const done = FRIENDLY_TOURNAMENT.drawVisibleCount >= entries.length;
      if (done) {
        window.clearInterval(timer);
        FRIENDLY_TOURNAMENT.drawVisibleCount = entries.length;
      }
      renderFriendlyLobbyScreen();
      if (!done) return;
      FRIENDLY_TOURNAMENT.drawAnimating = false;
      FRIENDLY_TOURNAMENT.drawVisibleCount = null;
      FRIENDLY_TOURNAMENT.drawEntries = [];
      renderFriendlyLobbyScreen();
      resolve();
    }, 1000);
  });
}

async function controlFriendlyCompetition(action) {
  if (!FRIENDLY_TOURNAMENT.enabled || !["draw", "next", "simulate"].includes(action)) return;
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/competition-control`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        participantId: FRIENDLY_TOURNAMENT.participantId,
        token: FRIENDLY_TOURNAMENT.token,
        action,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Commande indisponible.");
    applyFriendlyTournamentState(data.tournament, null);
    if (action === "draw") await showFriendlyDrawAnimation(data.tournament);
    renderFriendlyLobbyScreen();
  } catch (error) {
    MENU_STATE.lobbyNotice = error.message || "Commande indisponible.";
    renderFriendlyLobbyScreen();
  }
}

function initFriendlyTournament() {
  const params = friendlyTournamentParams();
  if (!params) return;
  FRIENDLY_TOURNAMENT.enabled = true;
  FRIENDLY_TOURNAMENT.isSpectator = params.isSpectator;
  FRIENDLY_TOURNAMENT.id = params.id;
  FRIENDLY_TOURNAMENT.participantId = params.participantId;
  FRIENDLY_TOURNAMENT.spectatorId = params.spectatorId;
  FRIENDLY_TOURNAMENT.token = params.token;
  FRIENDLY_TOURNAMENT.presenceId = crypto.randomUUID();
  FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = false;
  FRIENDLY_TOURNAMENT.pageExitSignaled = false;
  cancelFriendlyMatchCountdown();
  showFriendlyLobbyScreen();
  if (els.friendlyLobbyContent) els.friendlyLobbyContent.innerHTML = '<div class="friendly-lobby-status">Chargement du CLUB HOUSE...</div>';
  restoreFriendlyTournamentPresence().finally(() => {
    if (!FRIENDLY_TOURNAMENT.enabled) return;
    pollFriendlyTournament();
    window.clearInterval(FRIENDLY_TOURNAMENT.pollTimer);
    FRIENDLY_TOURNAMENT.pollTimer = window.setInterval(pollFriendlyTournament, 1400);
  });
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
    worldRank: null,
    roseEnduranceAwarded: false,
    endurance: STARTING_ENDURANCE,
    energy: ULTIMATE_STARTING_ENERGY,
    ultimateEnergySpentExchangeNumber: null,
    power: 0,
    hand: [],
    reserve: [],
    characterStarActive: false,
    ultimateConsumedStarUids: [],
    ultimateNextCostOne: false,
    ultimateRecoverEnergyOnNextShot: false,
    ultimateReserveLockedNext: false,
    ultimateReserveLockedExchange: false,
    ultimateEffectLimit: false,
    ultimateNoRepeatedFamily: false,
    ultimateOpponentPrecisionAfterThird: false,
    ultimatePowerCapThree: false,
    ultimateBoostExtraCost: false,
    ultimateGrowingPrecision: false,
    ultimateDiscardMarkProtection: false,
    ultimateDrawPerDefendedBoost: false,
    ultimateBoostFromDiscard: false,
    ultimateNextExchangeEndurance: 0,
    knownOpponentHand: null,
    played: [],
    nextPrecisionBonus: 0,
    nextPrecisionSources: [],
  nextPlacementBonus: 0,
  nextPlacementSources: [],
  nextAnyPlacementBonus: 0,
  nextAnyPlacementSources: [],
    nextDiscount: 0,
    nextDiscountSources: [],
    nextExtraCost: 0,
    nextExtraCostSources: [],
    nextPowerMultiplier: 1,
    nextPowerMultiplierSourceUid: null,
    nextPowerCap: null,
    nextPowerCapSourceUid: null,
    nextShotBasePlacementZero: false,
    nextShotBasePlacementZeroSourceUid: null,
    rosaPassPowerBonus: 0,
    exchangePrecisionBonus: 0,
    exchangePrecisionSources: [],
    exchangePlacementBonus: 0,
    exchangePlacementSources: [],
    exchangeFamilyPowerBonuses: [],
    exchangeAfterFamilyPlacementBonuses: [],
    placementPerOpponentLowPowerCardBonuses: [],
    protectedFromRemoval: false,
    protectedFromRemovalSourceUid: null,
    cancelNextOpponentEffect: false,
    cancelNextOpponentEffectSourceUid: null,
    limitedFamilies: null,
    limitedFamiliesSourceUid: null,
    freeBoostNext: false,
    freeBoostNextSourceUid: null,
    endBonuses: [],
    surfaceBonus: null,
    surfaceBonuses: [],
    permanentBonuses: [],
    temporaryBonuses: [],
    passed: false,
  };
}

function displayPlayerName(player) {
  return player?.nickname || player?.name || "Joueur";
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
    basePowerGained: card.basePowerGained,
    precision: card.precision,
    placement: card.placement,
    boostPower: card.boostPower,
    boostPrecision: card.boostPrecision,
    star: Boolean(card.star),
    ultimateDeckOrder: card.ultimateDeckOrder ?? null,
    ultimateColor: card.ultimateColor || null,
    ultimateBoostOnPlacementMiss: Boolean(card.ultimateBoostOnPlacementMiss),
    ultimateBoostColors: [...(card.ultimateBoostColors || [])],
    effectType: card.effectType,
    copiedSmashThreat: Boolean(card.copiedSmashThreat),
    copiedEffectType: card.copiedEffectType ?? null,
    remiseMode: card.remiseMode ?? null,
    boosted: Boolean(card.boosted),
    removed: Boolean(card.removed),
  };
}

function playerLogInfo(player) {
  return {
    name: displayPlayerName(player),
    characterName: player.name,
    nickname: player.nickname,
    characterId: player.characterId,
    endurance: player.endurance,
    power: player.power,
    handCount: player.hand.length,
    playedCount: player.played.filter((card) => !card.removed).length,
    hand: player.hand.map(cardLogInfo),
    permanentBonuses: cloneData(player.permanentBonuses || []),
    temporaryBonuses: cloneData(player.temporaryBonuses || []),
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
    turnEffectPlacement: [...(state.turnEffectPlacement ?? [0, 0])],
    turnHasEffect: [...state.turnHasEffect],
    turnIgnoresPlacement: [...state.turnIgnoresPlacement],
    turnCannotOpenBoost: [...(state.turnCannotOpenBoost ?? [false, false])],
    limitedFamilies: state.players.map((player) => player.limitedFamilies ? [...player.limitedFamilies] : null),
  };
}

function recordAction(kind, payload = {}) {
  const playMode = payload.mode ?? null;
  const entry = {
    actionId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    localDateTime: new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "medium" }).format(new Date()),
    kind,
    ...payload,
    mode: ULTIMATE_MODE.active ? "ultimate-ai" : SERVER_SYNC.enabled ? "online" : state.setMatch.enabled ? "set-ai" : SOLO_AI.enabled ? "solo-ai" : "local",
    playMode,
    exchangeNumber: state.setMatch.exchangeNumber,
    setScore: state.setMatch.enabled ? [...state.setMatch.score] : null,
    server: state.server,
    activePlayer: state.activePlayer,
    coachJuFocus: payload.playerIndex === 0 || payload.opponentIndex === 0,
  };
  state.actionLog.push(entry);
  if (ULTIMATE_MODE.active) appendUltimateMatchLog(entry);
  if (["admin", "pro_plus"].includes(currentUserRole())) {
    const stored = readStoredJson(ACTION_LOG_STORAGE_KEY, []);
    stored.push(entry);
    writeStoredJson(ACTION_LOG_STORAGE_KEY, stored.slice(-5000));
  }
  recordHumanMatchAction(entry);
}

let ULTIMATE_MATCH_LOG_MEMORY = null;

function readUltimateMatchLog() {
  if (ULTIMATE_MATCH_LOG_MEMORY?.entries) return ULTIMATE_MATCH_LOG_MEMORY;
  const stored = readStoredJson(ULTIMATE_MATCH_LOG_STORAGE_KEY, null);
  ULTIMATE_MATCH_LOG_MEMORY = stored && Array.isArray(stored.entries) ? stored : null;
  return ULTIMATE_MATCH_LOG_MEMORY;
}

const ULTIMATE_LOG_DATABASE = "tennisCourtsUltimateFullLogsV528";
const ULTIMATE_LOG_STORE = "matches";

function openUltimateLogDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error("IndexedDB indisponible"));
    const request = window.indexedDB.open(ULTIMATE_LOG_DATABASE, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(ULTIMATE_LOG_STORE)) database.createObjectStore(ULTIMATE_LOG_STORE, { keyPath: "matchId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeUltimateMatchArchive(match) {
  if (!match?.matchId) return;
  try {
    const database = await openUltimateLogDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(ULTIMATE_LOG_STORE, "readwrite");
      transaction.objectStore(ULTIMATE_LOG_STORE).put(cloneData(match));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  } catch (error) {
    // Le stockage local historique reste le plan de secours.
  }
}

async function readAllUltimateMatchArchives() {
  try {
    const database = await openUltimateLogDatabase();
    const matches = await new Promise((resolve, reject) => {
      const request = database.transaction(ULTIMATE_LOG_STORE, "readonly").objectStore(ULTIMATE_LOG_STORE).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return matches;
  } catch (error) {
    return [];
  }
}

function startUltimateMatchLog(characterIndex) {
  const previousMatch = readUltimateMatchLog();
  if (previousMatch?.entries?.length) {
    const history = readStoredJson(ULTIMATE_MATCH_HISTORY_STORAGE_KEY, []);
    if (!history.some((match) => match.matchId === previousMatch.matchId)) history.push(previousMatch);
    writeStoredJson(ULTIMATE_MATCH_HISTORY_STORAGE_KEY, history);
    storeUltimateMatchArchive(previousMatch);
  }
  const startedAt = new Date();
  const match = {
    schemaVersion: 1,
    matchId: crypto.randomUUID(),
    startedAt: startedAt.toISOString(),
    startedAtLocal: new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "long" }).format(startedAt),
    playerCharacter: ULTIMATE_PLAYERS[characterIndex]?.name || null,
    opponentCharacter: ULTIMATE_PLAYERS[characterIndex === 0 ? 1 : 0]?.name || null,
    aiDifficulty: ULTIMATE_MODE.aiDifficulty,
    entries: [],
  };
  ULTIMATE_MATCH_LOG_MEMORY = match;
  writeStoredJson(ULTIMATE_MATCH_LOG_STORAGE_KEY, match);
  storeUltimateMatchArchive(match);
}

function appendUltimateMatchLog(entry) {
  const match = readUltimateMatchLog();
  if (!match) return;
  match.entries.push(entry);
  match.updatedAt = entry.createdAt;
  match.updatedAtLocal = entry.localDateTime;
  writeStoredJson(ULTIMATE_MATCH_LOG_STORAGE_KEY, match);
  storeUltimateMatchArchive(match);
}

function logKey(entry) {
  return entry.actionId || `${entry.createdAt ?? entry.completedAt ?? ""}:${entry.kind ?? entry.winType ?? ""}:${entry.exchangeNumber ?? ""}:${entry.playerIndex ?? ""}`;
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
  logs.forEach((entry) => recordHumanMatchAction(entry));
}

function shouldTrackHumanMatch() {
  if (!AUTH_STATE.user || SPECTATOR_MODE.enabled || state.tutorial.active) return false;
  if (!["admin", "pro_plus"].includes(currentUserRole())) return false;
  if (!Array.isArray(state.players) || state.players.length !== 2) return false;
  return state.players.some((_, playerIndex) => isHumanTelemetrySeat(playerIndex));
}

function isHumanTelemetrySeat(playerIndex) {
  return !(SOLO_AI.enabled && playerIndex === SOLO_AI.playerIndex);
}

function humanMatchContext() {
  let type = "local-human";
  if (state.tournament?.weekly) type = "circuit-ai";
  else if (state.tournament?.aiClubHouse) type = "club-house-ai";
  else if (state.tournament?.friendly && SERVER_SYNC.enabled) type = "friendly-human";
  else if (state.tournament?.friendly) type = "friendly-ai";
  else if (SERVER_SYNC.enabled) type = "online-human";
  else if (SOLO_AI.enabled && state.setMatch?.targetSets) type = "exhibition-ai";
  else if (SOLO_AI.enabled && state.setMatch?.enabled) type = "set-ai";
  else if (SOLO_AI.enabled) type = "exchange-ai";
  return {
    type,
    competitionId: state.tournament?.competitionId || null,
    competitionName: state.tournament?.competitionName || null,
    competitionSeason: state.tournament?.competitionSeason || null,
    competitionWeek: state.tournament?.competitionWeek || null,
    tournamentId: FRIENDLY_TOURNAMENT.id || null,
    tournamentMatchId: state.tournament?.currentMatch || FRIENDLY_TOURNAMENT.currentMatchId || null,
    tournamentRound: state.tournament?.stage || null,
    onlineRoomId: SERVER_SYNC.roomId || null,
    targetSets: state.setMatch?.targetSets ?? null,
    aiDifficulty: state.tournament?.difficulty || SOLO_AI.difficulty || null,
    aiStyle: SOLO_AI.enabled ? SOLO_AI.style : null,
  };
}

function humanMatchContextKey(context = humanMatchContext()) {
  return [
    context.type,
    context.competitionId,
    context.tournamentId,
    context.tournamentMatchId,
    context.onlineRoomId,
    context.targetSets,
  ].map((value) => value ?? "").join(":");
}

function humanMatchParticipants() {
  return state.players.map((player, playerIndex) => {
    const human = isHumanTelemetrySeat(playerIndex);
    const isObservedUser = human && (
      (!SERVER_SYNC.enabled && playerIndex === 0)
      || (SERVER_SYNC.enabled && Number(SERVER_SYNC.seat) === playerIndex)
    );
    return {
      playerIndex,
      type: human ? "human" : "ai",
      control: human ? (isObservedUser ? "local" : "remote") : "computer",
      userId: isObservedUser ? AUTH_STATE.user?.id || null : null,
      nickname: displayPlayerName(player),
      characterId: player.characterId,
      characterName: player.name,
      aiDifficulty: human ? null : chooseSoloAIStyle(),
      aiDifficultyMode: human ? null : state.tournament?.difficulty || SOLO_AI.difficulty,
      aiStyle: human ? null : SOLO_AI.style,
      bonuses: human ? [] : [
        ...surfaceBonusesForPlayer(player),
        ...(player.permanentBonuses || []),
      ].map((bonus) => ({ id: bonus.id, label: bonus.label })),
    };
  });
}

function ensureHumanMatchTelemetry() {
  if (!shouldTrackHumanMatch()) return null;
  const context = humanMatchContext();
  const contextKey = humanMatchContextKey(context);
  const active = HUMAN_MATCH_TELEMETRY.active;
  if (!HUMAN_MATCH_TELEMETRY.forceNew && active?.status === "active" && active.contextKey === contextKey) {
    active.context = context;
    active.participants = humanMatchParticipants();
    return active;
  }
  if (!HUMAN_MATCH_TELEMETRY.forceNew && !active) {
    const storedActive = readStoredJson(ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY, null);
    if (storedActive?.status === "active" && storedActive.contextKey === contextKey) {
      HUMAN_MATCH_TELEMETRY.active = storedActive;
      storedActive.context = context;
      storedActive.participants = humanMatchParticipants();
      return storedActive;
    }
  }
  if (active?.status === "active") {
    archiveHumanMatchSession(active, "interrupted");
  }
  const startedAt = new Date().toISOString();
  const session = {
    schemaVersion: HUMAN_MATCH_LOG_SCHEMA_VERSION,
    gameVersion: GAME_VERSION,
    matchId: crypto.randomUUID(),
    contextKey,
    status: "active",
    startedAt,
    updatedAt: startedAt,
    completedAt: null,
    observerUser: {
      id: AUTH_STATE.user?.id || null,
      nickname: AUTH_STATE.user?.nickname || nicknameValue(),
    },
    context,
    participants: humanMatchParticipants(),
    exchanges: [],
    result: null,
    summary: null,
  };
  HUMAN_MATCH_TELEMETRY.active = session;
  HUMAN_MATCH_TELEMETRY.forceNew = false;
  writeStoredJson(ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY, session);
  return session;
}

function compactHumanMatchAction(entry) {
  const compact = cloneData(entry);
  return compact;
}

function recordHumanMatchAction(entry) {
  if (!entry || !shouldTrackHumanMatch()) return;
  const session = ensureHumanMatchTelemetry();
  if (!session) return;
  const actionKey = logKey(entry);
  if (session.exchanges.some((exchange) => exchange.actions.some((action) => logKey(action) === actionKey))) return;
  if (entry.kind === "exchange_start" || !session.exchanges.length) {
    session.exchanges.push({
      exchangeId: crypto.randomUUID(),
      exchangeNumber: entry.exchangeNumber ?? session.exchanges.length + 1,
      startedAt: entry.createdAt || new Date().toISOString(),
      completedAt: null,
      server: entry.server ?? state.server,
      startingPlayers: entry.players ? cloneData(entry.players) : state.players.map(playerLogInfo),
      actions: [],
      result: null,
    });
  }
  const exchange = session.exchanges[session.exchanges.length - 1];
  exchange.actions.push(compactHumanMatchAction(entry));
  if (entry.kind === "exchange_end") {
    exchange.completedAt = entry.createdAt || new Date().toISOString();
    exchange.result = {
      winner: entry.winner,
      winnerName: entry.winnerName,
      winType: entry.winType,
      reason: entry.reason,
      finalPower: cloneData(entry.finalPower),
      finalEndurance: cloneData(entry.finalEndurance),
      exchangeSetScore: cloneData(entry.exchangeSetScore),
      setMatch: cloneData(state.setMatch),
    };
  }
  session.updatedAt = new Date().toISOString();
  session.context = humanMatchContext();
  session.participants = humanMatchParticipants();
  writeStoredJson(ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY, session);
  if (entry.kind === "exchange_end" && isHumanMatchTelemetryComplete()) {
    completeHumanMatchTelemetry(entry);
  }
}

function isHumanMatchTelemetryComplete() {
  if (!state.gameOver) return false;
  if (!state.setMatch.enabled) return true;
  if (state.setMatch.targetSets) return Boolean(state.setMatch.matchOver);
  return Boolean(state.setMatch.setOver);
}

function humanMatchTelemetrySummary(session) {
  const actions = session.exchanges.flatMap((exchange) => exchange.actions);
  const roleFor = (playerIndex) => session.participants.find((participant) => participant.playerIndex === playerIndex)?.type || "system";
  const summary = {
    exchangeCount: session.exchanges.filter((exchange) => exchange.completedAt).length,
    actionCount: actions.length,
    humanActions: 0,
    aiActions: 0,
    humanBoosts: 0,
    aiBoosts: 0,
    humanPlacementRisks: 0,
    aiPlacementRisks: 0,
    humanPasses: 0,
    aiPasses: 0,
    forcedPasses: 0,
    undoCount: 0,
    canceledEffects: 0,
    expensiveCanceledEffects: 0,
    suppressionUses: 0,
    suppressionSacrifices: 0,
    doubleUses: 0,
    aiDoubleUses: 0,
    aiPunitiveContinuations: 0,
    aiPlannedPointDecisions: 0,
    aiPlannedBoostDecisions: 0,
    aiAttitudeChanges: 0,
  };
  let previousAiAttitude = null;
  for (const action of actions) {
    const role = roleFor(action.playerIndex);
    if (role === "human") summary.humanActions += 1;
    if (role === "ai") summary.aiActions += 1;
    if (action.kind === "play_card" && action.boosted) {
      if (role === "human") summary.humanBoosts += 1;
      if (role === "ai") summary.aiBoosts += 1;
    }
    if (action.kind === "play_card" && action.placementWasInsufficient) {
      if (role === "human") summary.humanPlacementRisks += 1;
      if (role === "ai") summary.aiPlacementRisks += 1;
    }
    if (action.kind === "play_card" && action.sacrifice?.id === "sup-adv") summary.suppressionSacrifices += 1;
    if (action.kind === "pass") {
      if (role === "human") summary.humanPasses += 1;
      if (role === "ai") summary.aiPasses += 1;
      if (action.mandatoryPlacement) summary.forcedPasses += 1;
    }
    if (action.kind === "undo_turn") summary.undoCount += 1;
    if (action.kind === "effect_resolution" && action.resolution === "canceled_by_opponent") {
      summary.canceledEffects += 1;
      if (Number(action.costPaid || 0) >= 3) summary.expensiveCanceledEffects += 1;
    }
    if (action.kind === "remove_card" && action.sourceCard?.id === "sup-adv") summary.suppressionUses += 1;
    if (action.kind === "play_card" && action.card?.effectType === "doubleLastShot" && action.remiseMode === "effect") {
      summary.doubleUses += 1;
      if (role === "ai") summary.aiDoubleUses += 1;
    }
    if (action.kind === "ai_decision") {
      if (action.decision === "press_secured_advantage") summary.aiPunitiveContinuations += 1;
      if (action.decision === "planned_points") summary.aiPlannedPointDecisions += 1;
      if (action.decision === "planned_boost") summary.aiPlannedBoostDecisions += 1;
      const attitude = action.aiAttitude || action.details?.attitude;
      if (previousAiAttitude && attitude && attitude !== previousAiAttitude) summary.aiAttitudeChanges += 1;
      if (attitude) previousAiAttitude = attitude;
    }
  }
  return summary;
}

function completeHumanMatchTelemetry(finalEntry) {
  const session = HUMAN_MATCH_TELEMETRY.active;
  if (!session || session.status !== "active") return;
  session.status = "completed";
  session.completedAt = finalEntry.createdAt || new Date().toISOString();
  session.updatedAt = session.completedAt;
  session.result = {
    winner: state.setMatch.enabled ? state.setMatch.matchWinner ?? state.setMatch.winner : finalEntry.winner,
    winnerName: playerName(state.setMatch.enabled ? state.setMatch.matchWinner ?? state.setMatch.winner : finalEntry.winner),
    setsWon: state.setMatch.enabled ? [...state.setMatch.setsWon] : null,
    completedScores: state.setMatch.enabled ? state.setMatch.completedScores.map((score) => [...score]) : null,
    targetSets: state.setMatch.enabled ? state.setMatch.targetSets : null,
    tournamentMatchId: state.tournament?.currentMatch || null,
  };
  session.summary = humanMatchTelemetrySummary(session);
  archiveHumanMatchSession(session, "completed");
  HUMAN_MATCH_TELEMETRY.active = null;
  localStorage.removeItem(ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY);
  uploadHumanMatchTelemetry(session);
}

function archiveHumanMatchSession(session, status = session.status) {
  const archived = cloneData({ ...session, status, updatedAt: new Date().toISOString() });
  if (status !== "completed") {
    archived.completedAt = null;
    archived.summary = humanMatchTelemetrySummary(archived);
  }
  const stored = readStoredJson(HUMAN_MATCH_LOG_STORAGE_KEY, []);
  const merged = [archived, ...stored.filter((item) => item.matchId !== archived.matchId)];
  for (let limit = Math.min(20, merged.length); limit >= 1; limit -= 1) {
    try {
      localStorage.setItem(HUMAN_MATCH_ãûÛFòµë(š+my×$"ÒçVÆÂ’°¢6öç7BÆ–&ÆRÒ&ööÆVâ‡Æ–W$bbÆ–W$"bb†—4‡VÖåF÷W&æÖVçDVçG'’‡Æ–W$’ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’‡Æ–W$"’’“°¢6öç7BÖF6‚Ò°¢–BÀ¢Æ&VÂÀ¢&÷VæC¢6†×–öç6†—G·†6WÖÀ¢6†×–öç6†—†6S¢†6RÀ¢F’À¢w&÷WÀ¢Æ–W$À¢Æ–W$"À¢v–ææW#¢çVÆÂÀ¢66÷&S¢çVÆÂÀ¢Æ—fU66÷&S¢çVÆÂÀ¢Æ–&ÆRÀ¢6–×VÆFVC¢&ööÆVâ‡Æ–W$bbÆ–W$"bbÆ–&ÆR’À¢†–FFVåv–ææW#¢çVÆÂÀ¢†–FFVå6WE66÷&W3¢çVÆÂÀ¢&WfVÆVE6WE66÷&W3¢µÒÀ¢Ó°¢–b†ÖF6‚ç6–×VÆFVBbb7FFRçF÷W&æÖVçCòç&öw&W76—fTÆ—fU66÷&W2bb7FFRçF÷W&æÖVçCòæöæUö–çDÖ7FW"’Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚“°¢&WGW&âÖF6ƒ°§Ð ¦gVæ7F–öâ'V–ÆD6†×–öç6†—6WGW†‡VÖä6†&7FW$–B’°¢6öç7B6VÆV7FVD’Ò6‡VffÆR…DõU$äÔTåEô4„$5DU%õôôÂæf–ÇFW"‚†VçG'’’ÓâVçG'’ÓÒ‡VÖä6†&7FW$–B’’ç6Æ–6RƒÂ#2“°¢6öç7B&÷7FW"Ò´…TÔåõDõU$äÔTåEôTåE%’Âââç6VÆV7FVD•Ó°¢6öç7B&æ¶VBÒ&æ¶VEF÷W&æÖVçDVçG&–W2‡&÷7FW"“°¢6öç7B6VVG2Ò&æ¶VBç6Æ–6RƒÂ‚“°¢6öç7B6VVFVDG&rÒ6‡VffÆR‡6VVG2“°¢6öç7B÷F†W'2Ò6‡VffÆR‡&æ¶VBç6Æ–6Rƒ‚’“°¢6öç7Bw&÷W2Ò·Ó°¢$$4DTdt‚"ç7Æ—B‚""’æf÷$V6‚‚†w&÷WÂ–æFW‚’Óâ°¢w&÷W5¶w&÷WÒÒ·6VVFVDG&u¶–æFW…ÒÂ÷F†W'5¶–æFW‚¢%ÒÂ÷F†W'5¶–æFW‚¢"²ÕÓ°¢Ò“°¢&WGW&â²&÷7FW"Â&æ¶VBÂ6VVG2Âw&÷W2Ó°§Ð ¦gVæ7F–öâ'V–ÆD6†×–öç6†—ÖF6†W2†w&÷W2’°¢6öç7BÖF6†W2ÒµÓ°¢f÷"†6öç7Bw&÷Wöb$$4DTdt‚"’°¢6öç7B¶Â"Â5ÒÒw&÷W5¶w&÷WÓ°¢ÖF6†W2çW6‚€¢6†×–öç6†—ÖF6‚†6†×÷òG¶w&÷WÕöCÂW"F÷W"+rw&÷WRG¶w&÷WÒ+r(	46ÂÂÂw&÷WÂÂ2’À¢6†×–öç6†—ÖF6‚†6†×÷òG¶w&÷WÕöC&ÂW"F÷W"+rw&÷WRG¶w&÷WÒ+r.(	46ÂÂ"Âw&÷WÂ"Â2’À¢6†×–öç6†—ÖF6‚†6†×÷òG¶w&÷WÕöC6ÂW"F÷W"+rw&÷WRG¶w&÷WÒ+r(	4&ÂÂ2Âw&÷WÂÂ"’À¢“°¢Ð¢f÷"†6öç7Bw&÷Wöb²#"Â#""Â#2"Â#B%Ò’°¢µµ³ÂÒÂ³"Â5ÕÒÂµ³Â5ÒÂ³"ÂÕÒÂµ³Â%ÒÂ³Â5ÕÕÒæf÷$V6‚‚†F”ÖF6†W2ÂF”–æFW‚’Óâ°¢F”ÖF6†W2æf÷$V6‚‚‡—"ÂÖF6„–æFW‚’Óâ°¢ÖF6†W2çW6‚†6†×–öç6†—ÖF6‚€¢6†×÷%örG¶w&÷WÕöBG¶F”–æFW‚²ÕöÒG¶ÖF6„–æFW‚²ÖÀ¢&RF÷W"+rw&÷WRG¶w&÷WÒ+r¦÷W&ì:–RG¶F”–æFW‚²ÖÀ¢"À¢F”–æFW‚²À¢w&÷WÀ¢’“°¢Ò“°¢Ò“°¢Ð¢f÷"†ÆWB–æFW‚Ò²–æFW‚ÃÒC²–æFW‚³Ò’°¢ÖF6†W2çW6‚†6†×–öç6†—ÖF6‚†6†×÷Æ–öfeòG¶–æFW‡ÖÂ&'&vRG¶–æFW‡ÖÂ2ÂÂçVÆÂ’“°¢ÖF6†W2çW6‚†6†×–öç6†—ÖF6‚†6†×÷eòG¶–æFW‡ÖÂV'BFRf–æÆRG¶–æFW‡ÖÂBÂÂçVÆÂ’“°¢Ð¢ÖF6†W2çW6‚€¢6†×–öç6†—ÖF6‚‚&6†×÷6eó"Â$FVÖ’Öf–æÆR"ÂBÂ"ÂçVÆÂ’À¢6†×–öç6†—ÖF6‚‚&6†×÷6eó""Â$FVÖ’Öf–æÆR""ÂBÂ"ÂçVÆÂ’À¢6†×–öç6†—ÖF6‚‚&f–æÂ"Â$f–æÆR"ÂBÂ2ÂçVÆÂ’À¢“°¢&WGW&âÖF6†W3°§Ð ¦gVæ7F–öâ7F'D6†×–öç6†—ÖöFR‡F&vWE6WG2Ò"Â÷F–öç2Ò·Ò’°¢–b…4U%dU%õ5”ä2æVæ&ÆVB’°¢7FFRæÆörçVç6†–gB‚$ÆR6†×–öææBW7BF—7öæ–&ÆRVæ—VVÖVçBVâÖöFR6öÆòâ"“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢F&vWE6WG2ÒçVÖ&W"‡F&vWE6WG2’ÓÓÒ2ò2¢#°¢&W6WEF÷W&æÖVçB‚“°¢òòV7VâGfW'6—&RæRFö—B÷Wfö—"v—"FçBVRÆR¦÷VWW"6RG&÷WfRFç0¢òòÆR6ÆöâWBVRÆRF—&vRâvW7B2FW&Ö–ì:’à¢4ôÄõô’æVæ&ÆVBÒfÇ6S°¢4ôÄõô’çÆ–W$–æFW‚Ò°¢4ôÄõô’æF–ff–7VÇG’Òæ÷&ÖÆ—¦T”F–ff–7VÇG’†÷F–öç2æF–ff–7VÇG’ÇÂ&æ÷&ÖÂ"“°¢6öç7B‡VÖä6†&7FW$–BÒ6VÆV7FVD6†&7FW$–B‚“°¢6öç7B6WGWÒ'V–ÆD6†×–öç6†—6WGW†‡VÖä6†&7FW$–B“°¢6öç7B‡VÖäÆWfVÂÒ6—&7V—D‡VÖäÆWfVÂ‚“°¢6öç7B&öçW4ÆWfVÂÒæ÷&ÖÆ—¦T”&öçW4ÆWfVÂ†÷F–öç2æ&öçW2ÇÂ&æöæR"“°¢7FFRçF÷W&æÖVçBÒ°¢7F—fS¢G'VRÀ¢f—6–&ÆS¢G'VRÀ¢6†×–öç6†—¢G'VRÀ¢&öw&W76—fTÆ—fU66÷&W3¢G'VRÀ¢”6ÇV$†÷W6S¢G'VRÀ¢F–ff–7VÇG“¢4ôÄõô’æF–ff–7VÇG’À¢”–çFVÆÆ–vVæ6TÆWfVÇ3¢'V–ÆEF÷W&æÖVçD”–çFVÆÆ–vVæ6TÆWfVÇ2‡6WGWç&æ¶VBÂ4ôÄõô’æF–ff–7VÇG’Â²‡VÖäÆWfVÂÒ’À¢&öçW4ÆWfVÂÀ¢Æ–W%6VÆV7F–öã¢'&æFöÒ"À¢F—7G&–'WF–öã¢'6VVFVB"À¢vVV¶Ç“¢fÇ6RÀ¢6ö×WF—F–öä–C¢çVÆÂÀ¢6ö×WF—F–öäæÖS¢$6†×–öææB"À¢F&vWE6WG2À¢‡VÖä6†&7FW$–BÀ¢‡VÖäæ–6¶æÖS¢æ–6¶æÖUfÇVR‚’À¢‡VÖäVçG'“¢…TÔåõDõU$äÔTåEôTåE%’À¢7W'&VçDÖF6ƒ¢çVÆÂÀ¢æW‡D‡VÖäÖF6„–C¢çVÆÂÀ¢6†×–öä6†&7FW$–C¢çVÆÂÀ¢6†×–öç6†—†6S¢À¢6†×–öç6†—&÷7FW#¢6WGWç&÷7FW"À¢6†×–öç6†—G&t÷&FW#¢°¢âââ$$4DTdt‚"ç7Æ—B‚""’æÖ‚†w&÷W’Óâ6WGWæw&÷W5¶w&÷WÕ³Ò’À¢âââ$$4DTdt‚"ç7Æ—B‚""’æÖ‚†w&÷W’Óâ6WGWæw&÷W5¶w&÷WÕ³Ò’À¢âââ$$4DTdt‚"ç7Æ—B‚""’æÖ‚†w&÷W’Óâ6WGWæw&÷W5¶w&÷WÕ³%Ò’À¢ÒÀ¢6†×–öç6†—G&uf—6–&ÆT6÷VçC¢À¢6†×–öç6†—G&t6ö×ÆWFS¢fÇ6RÀ¢6†×–öç6†—†6Sw&÷W3¢6WGWæw&÷W2À¢6†×–öç6†—†6S$w&÷W3¢·ÒÀ¢ÆVwVU6VVFVDVçG&–W3¢6WGWç&æ¶VBÀ¢F÷W&æÖVçE6VVDçVÖ&W'3¢ö&¦V7Bæg&öÔVçG&–W2‡6WGWç6VVG2æÖ‚†VçG'’Â–æFW‚’Óâ¶VçG'’Â–æFW‚²Ò’’À¢‡VÖä6—&7V—DÆWfVÃ¢‡VÖäÆWfVÂÀ¢7W&f6T&öçW6W3¢'V–ÆD”6ÇV$†÷W6T&öçW6W2‡6WGWç&æ¶VBÂ&öçW4ÆWfVÂ’À¢W&ÖæVçD&öçW6W3¢·ÒÀ¢6VVFVD6†&7FW'3¢µÒÀ¢G–æÖ–4&öçW4–G3¢µÒÀ¢ÖF6†W3¢µÒÀ¢Ó°¢7FFRçF÷W&æÖVçBæÖF6†W2Ò'V–ÆD6†×–öç6†—ÖF6†W2‡6WGWæw&÷W2“°¢DõU$äÔTåEõäTÅõT’çf—6–&ÆRÒG'VS°¢DõU$äÔTåEõäTÅõT’æ6†×–öç6†—÷Vå¦öæRÒ°¢4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæRÒ°¢4„Õ”ôå4„•ôÄô$%•õT’æ7W'&VçE†6RÒ°¢7FFRçF÷W&æÖVçBç7FvRÒ&6†×–öç6†—Æö&'’#°¢7FFRæÆörçVç6†–gB†6†×–öææB+r#B¦÷VWW'2+rG·F&vWE6WG7Ò6WG2vvæçG2+r”G·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ…4ôÄõô’æF–ff–7VÇG’—Òæ“°¢&VæFW"‚“°§Ð ¦6öç7BôäUõô”åEôÔ5DU%ôu$õU2Ò²#"Â#""Â#2"Â#B%Ó°¦6öç7BôäUõô”åEôÔ5DU%õ4ÄõE2Ò²$"Â$""Â$2"Â$B"Â$R"Â$b%Ó°¦6öç7BôäUõô”åEôÔ5DU%õ44„TETÄRÒ°¢µ³ÂUÒÂ³ÂEÒÂ³"Â5ÕÒÀ¢µ³ÂEÒÂ³Â%ÒÂ³2ÂUÕÒÀ¢µ³Â5ÒÂ³ÂUÒÂ³"ÂEÕÒÀ¢µ³ÂÒÂ³BÂ5ÒÂ³"ÂUÕÒÀ¢µ³Â%ÒÂ³Â5ÒÂ³BÂUÕÒÀ¥Ó° ¦gVæ7F–öâ'V–ÆDöæUö–çDÖ7FW%6WGW†‡VÖä6†&7FW$–BÂF—7G&–'WF–öâÒ'&æFöÒ"’°¢6öç7B6VÆV7FVD’Ò6VÆV7D”6ÇV$†÷W6UÆ–W'2ƒ#2Â'&æFöÒ"Â‡VÖä6†&7FW$–B“°¢6öç7B&÷7FW"Ò´…TÔåõDõU$äÔTåEôTåE%’Âââç6VÆV7FVD•Ó°¢6öç7B&æ¶VBÒ&æ¶VEF÷W&æÖVçDVçG&–W2‡&÷7FW"“°¢6öç7B6VVG2Ò&æ¶VBç6Æ–6RƒÂ‚“°¢6öç7Bw&÷W2Òö&¦V7Bæg&öÔVçG&–W2„ôäUõô”åEôÔ5DU%ôu$õU2æÖ‚†w&÷W’Óâ¶w&÷WÂµÕÒ’“°¢–b†F—7G&–'WF–öâÓÓÒ'&æ¶–ær"’°¢6öç7BF÷6VVG2Ò6‡VffÆR‡6VVG2ç6Æ–6RƒÂB’“°¢6öç7BæW‡E6VVG2Ò6‡VffÆR‡6VVG2ç6Æ–6RƒBÂ‚’“°¢ôäUõô”åEôÔ5DU%ôu$õU2æf÷$V6‚‚†w&÷WÂ–æFW‚’Óâ°¢w&÷W5¶w&÷WÒçW6‚‡F÷6VVG5¶–æFW…ÒÂæW‡E6VVG5¶–æFW…Ò“°¢Ò“°¢6öç7B÷F†W'2Ò6‡VffÆR‡&æ¶VBç6Æ–6Rƒ‚’“°¢ôäUõô”åEôÔ5DU%ôu$õU2æf÷$V6‚‚†w&÷WÂ–æFW‚’Óâw&÷W5¶w&÷WÒçW6‚‚ââæ÷F†W'2ç6Æ–6R†–æFW‚¢BÂ†–æFW‚²’¢B’’“°¢ÒVÇ6R°¢6öç7B&æFöÕ&÷7FW"Ò6‡VffÆR‡&÷7FW"“°¢ôäUõô”åEôÔ5DU%ôu$õU2æf÷$V6‚‚†w&÷WÂ–æFW‚’Óâw&÷W5¶w&÷WÒÒ&æFöÕ&÷7FW"ç6Æ–6R†–æFW‚¢bÂ†–æFW‚²’¢b’“°¢Ð¢&WGW&â²&÷7FW"Â&æ¶VBÂ6VVG2Âw&÷W2Ó°§Ð ¦gVæ7F–öâöæUö–çDÖ7FW$ÖF6‚†–BÂÆ&VÂÂ†6RÂF’Âw&÷WÂÆ–W$ÒçVÆÂÂÆ–W$"ÒçVÆÂ’°¢6öç7BÖF6‚Ò6†×–öç6†—ÖF6‚†–BÂÆ&VÂÂ†6RÂF’Âw&÷WÂÆ–W$ÂÆ–W$"“°¢ÖF6‚ç&÷VæBÒ†6RÓÓÒòÖ7FW$F’G¶F—Ö¢†6RÓÓÒ2ò&Ö7FW%Æ–öfb"¢†6RÓÓÒBbbF’ÓÓÒò'V'FW""¢†6RÓÓÒBbbF’ÓÓÒ"ò'6VÖ’"¢&f–æÂ#°¢&WGW&âÖF6ƒ°§Ð ¦gVæ7F–öâ'V–ÆDöæUö–çDÖ7FW$ÖF6†W2†w&÷W2’°¢6öç7BÖF6†W2ÒµÓ°¢ôäUõô”åEôÔ5DU%ôu$õU2æf÷$V6‚‚†w&÷W’Óâ°¢ôäUõô”åEôÔ5DU%õ44„TETÄRæf÷$V6‚‚‡—'2ÂF”–æFW‚’Óâ—'2æf÷$V6‚‚…¶Â%ÒÂÖF6„–æFW‚’Óâ°¢ÖF6†W2çW6‚†öæUö–çDÖ7FW$ÖF6‚€¢Ö7FW%örG¶w&÷WÕöBG¶F”–æFW‚²ÕöÒG¶ÖF6„–æFW‚²ÖÀ¢¦÷W&ì:–RG¶F”–æFW‚²Ò+rw&÷WRG¶w&÷WÒ+rG´ôäUõô”åEôÔ5DU%õ4ÄõE5¶×Þ(	2G´ôäUõô”åEôÔ5DU%õ4ÄõE5¶%×ÖÀ¢ÂF”–æFW‚²Âw&÷WÂw&÷W5¶w&÷WÕ¶ÒÂw&÷W5¶w&÷WÕ¶%ÒÀ¢’“°¢Ò’“°¢Ò“°¢f÷"†ÆWB–æFW‚Ò²–æFW‚ÃÒC²–æFW‚³Ò’°¢ÖF6†W2çW6‚†öæUö–çDÖ7FW$ÖF6‚†Ö7FW%÷Æ–öfeòG¶–æFW‡ÖÂ&'&vRG¶–æFW‡ÖÂ2ÂÂçVÆÂ’“°¢ÖF6†W2çW6‚†öæUö–çDÖ7FW$ÖF6‚†Ö7FW%÷eòG¶–æFW‡ÖÂV'BFRf–æÆRG¶–æFW‡ÖÂBÂÂçVÆÂ’“°¢Ð¢ÖF6†W2çW6‚€¢öæUö–çDÖ7FW$ÖF6‚‚&Ö7FW%÷6eó"Â$FVÖ’Öf–æÆR"ÂBÂ"ÂçVÆÂ’À¢öæUö–çDÖ7FW$ÖF6‚‚&Ö7FW%÷6eó""Â$FVÖ’Öf–æÆR""ÂBÂ"ÂçVÆÂ’À¢öæUö–çDÖ7FW$ÖF6‚‚&f–æÂ"Â$f–æÆR"ÂBÂ2ÂçVÆÂ’À¢“°¢&WGW&âÖF6†W3°§Ð ¦gVæ7F–öâ7F'DöæUö–çDÖ7FW$ÖöFR†÷F–öç2Ò·Ò’°¢–b…4U%dU%õ5”ä2æVæ&ÆVB’&WGW&ã°¢&W6WEF÷W&æÖVçB‚“°¢4ôÄõô’æVæ&ÆVBÒfÇ6S°¢4ôÄõô’çÆ–W$–æFW‚Ò°¢4ôÄõô’æF–ff–7VÇG’Òæ÷&ÖÆ—¦T”F–ff–7VÇG’†÷F–öç2æF–ff–7VÇG’ÇÂ&æ÷&ÖÂ"“°¢6öç7B‡VÖä6†&7FW$–BÒ6VÆV7FVD6†&7FW$–B‚“°¢6öç7BF—7G&–'WF–öâÒ÷F–öç2æF—7G&–'WF–öâÓÓÒ'&æ¶–ær"ò'&æ¶–ær"¢'&æFöÒ#°¢6öç7B6WGWÒ'V–ÆDöæUö–çDÖ7FW%6WGW†‡VÖä6†&7FW$–BÂF—7G&–'WF–öâ“°¢7FFRçF÷W&æÖVçBÒ°¢ââæ6ÆöæTFF„TÕE•õDõU$äÔTåB’À¢7F—fS¢G'VRÀ¢f—6–&ÆS¢G'VRÀ¢6†×–öç6†—¢G'VRÀ¢öæUö–çDÖ7FW#¢G'VRÀ¢öæUö–çDvÖS¢G'VRÀ¢&öw&W76—fTÆ—fU66÷&W3¢fÇ6RÀ¢'&6¶WCc¢fÇ6RÀ¢”6ÇV$†÷W6S¢G'VRÀ¢F–ff–7VÇG“¢4ôÄõô’æF–ff–7VÇG’À¢”–çFVÆÆ–vVæ6TÆWfVÇ3¢'V–ÆEF÷W&æÖVçD”–çFVÆÆ–vVæ6TÆWfVÇ2‡6WGWç&æ¶VBÂ4ôÄõô’æF–ff–7VÇG’Â²‡VÖäÆWfVÃ¢6—&7V—D‡VÖäÆWfVÂ‚’Ò’À¢&öçW4ÆWfVÃ¢'&Wv&B"À¢Æ–W%6VÆV7F–öã¢÷F–öç2çÆ–W'2ÇÂ'&æFöÒ"À¢F—7G&–'WF–öâÀ¢6ö×WF—F–öäæÖS¢#ö–çBÖ7FW""À¢F&vWE6WG3¢À¢‡VÖä6†&7FW$–BÀ¢‡VÖäæ–6¶æÖS¢æ–6¶æÖUfÇVR‚’À¢‡VÖäVçG'“¢…TÔåõDõU$äÔTåEôTåE%’À¢6†×–öç6†—†6S¢À¢6†×–öç6†—&÷7FW#¢6WGWç&÷7FW"À¢6†×–öç6†—†6Sw&÷W3¢6WGWæw&÷W2À¢6†×–öç6†—†6S$w&÷W3¢·ÒÀ¢ÆVwVU6VVFVDVçG&–W3¢6WGWç&æ¶VBÀ¢F÷W&æÖVçE6VVDçVÖ&W'3¢F—7G&–'WF–öâÓÓÒ'&æ¶–ær ¢òö&¦V7Bæg&öÔVçG&–W2‡6WGWç6VVG2æÖ‚†VçG'’Â–æFW‚’Óâ¶VçG'’Â–æFW‚²Ò’¢¢·ÒÀ¢6†×–öç6†—G&t÷&FW#¢ôäUõô”åEôÔ5DU%õ4ÄõE2æfÆDÖ‚…òÂ6Æ÷B’ÓâôäUõô”åEôÔ5DU%ôu$õU2æÖ‚†w&÷W’Óâ6WGWæw&÷W5¶w&÷WÕ·6Æ÷EÒ’’À¢6†×–öç6†—G&uf—6–&ÆT6÷VçC¢À¢6†×–öç6†—G&t6ö×ÆWFS¢fÇ6RÀ¢òòÆRÖöFR,:–6ö×Vç6RL:–Ö'&R6ç2V7Vâ&öçW2ÂVVÂVR6ö—BÆR6Æ76VÖVçBà¢òò6WVÆW2ÆW2W&f÷&Öæ6W2,:–Æ—<:–W2VæFçB6WGFR6ö×:—F—F–öâVâ¦÷WFVçBà¢7W&f6T&öçW6W3¢ö&¦V7Bæg&öÔVçG&–W2‡6WGWç&æ¶VBæÖ‚†VçG'’’Óâ¶VçG'’ÂµÕÒ’’À¢&Wf–÷W5v–å66÷&W3¢·ÒÀ¢öæUö–çE&Wv&G3¢·ÒÀ¢ÖF6†W3¢µÒÀ¢7FvS¢&6†×–öç6†—Æö&'’"À¢Ó°¢7FFRçF÷W&æÖVçBæÖF6†W2Ò'V–ÆDöæUö–çDÖ7FW$ÖF6†W2‡6WGWæw&÷W2“°¢DõU$äÔTåEõäTÅõT’çf—6–&ÆRÒG'VS°¢4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæRÒ°¢4„Õ”ôå4„•ôÄô$%•õT’æ7W'&VçE†6RÒ°¢7FFRæÆörçVç6†–gB†ö–çBÖ7FW"+r‡VÖ–âWB#2”+r,:—'F—F–öâG¶F—7G&–'WF–öâÓÓÒ'&æ¶–ær"ò&fV2L:§FW2FR<:—&–R"¢&Ì:–Fö—&R'Òæ“°¢&VæFW"‚“°§Ð ¦gVæ7F–öâöæUö–çDÖ7FW%7FæF–æw2†w&÷WÂF‡&÷Vv„F’ÒR’°¢6öç7B&÷w2ÒæWrÖ‚‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6Sw&÷W3òå¶w&÷WÒÇÂµÒ’æÖ‚†VçG'’’Óâ¶VçG'’Â°¢VçG'’Âö–çG3¢ÂF–ffW&Væ6S¢Â&ö÷7C¢ÂGvõ¦W&ó¢ÂÆ–VC¢À¢v÷&ÆE&æ³¢F÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’†VçG'’’óò“““““’À¢ÕÒ’“°¢6†×–öç6†—ÖF6†W2ƒ’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æw&÷WÓÓÒw&÷WbbÖF6‚æF’ÃÒF‡&÷Vv„F’bbÖF6‚çv–ææW"bbÖF6‚ç66÷&R’æf÷$V6‚‚†ÖF6‚’Óâ°¢6öç7B66÷&W2ÒÖF6‚ç&WfVÆVE6WE66÷&W3òæÆVæwF‚òÖF6‚ç&WfVÆVE6WE66÷&W2¢'6UF÷W&æÖVçE66÷&R†ÖF6‚ç66÷&R“°¢6öç7B66÷&RÒ66÷&W5³ÒÇÂ³ÂÓ°¢6öç7B&÷tÒ&÷w2ævWB†ÖF6‚çÆ–W$“°¢6öç7B&÷t"Ò&÷w2ævWB†ÖF6‚çÆ–W$"“°¢–b‚&÷tÇÂ&÷t"’&WGW&ã°¢&÷tçÆ–VB³Ò°¢&÷t"çÆ–VB³Ò°¢&÷tæF–ffW&Væ6R³ÒçVÖ&W"‡66÷&U³Ò’ÒçVÖ&W"‡66÷&U³Ò“°¢&÷t"æF–ffW&Væ6R³ÒçVÖ&W"‡66÷&U³Ò’ÒçVÖ&W"‡66÷&U³Ò“°¢6öç7Bv–ææW%&÷rÒ&÷w2ævWB†ÖF6‚çv–ææW"“°¢v–ææW%&÷rçö–çG2³Ò°¢6öç7Bv–ææW%66÷&RÒÖF6‚çv–ææW"ÓÓÒÖF6‚çÆ–W$òçVÖ&W"‡66÷&U³Ò’¢çVÖ&W"‡66÷&U³Ò“°¢6öç7BÆ÷6W%66÷&RÒÖF6‚çv–ææW"ÓÓÒÖF6‚çÆ–W$òçVÖ&W"‡66÷&U³Ò’¢çVÖ&W"‡66÷&U³Ò“°¢–b‡v–ææW%66÷&RÓÓÒ2bbÆ÷6W%66÷&RÓÓÒ’v–ææW%&÷ræ&ö÷7B³Ò°¢–b‡v–ææW%66÷&RÓÓÒ"bbÆ÷6W%66÷&RÓÓÒ’v–ææW%&÷rçGvõ¦W&ò³Ò°¢Ò“°¢&WGW&â²ââç&÷w2çfÇVW2‚•Òç6÷'B‚†Â"’Óâ"çö–çG2Òçö–çG0¢ÇÂ"æF–ffW&Væ6RÒæF–ffW&Væ6P¢ÇÂ"æ&ö÷7BÒæ&ö÷7@¢ÇÂ"çGvõ¦W&òÒçGvõ¦W&ð¢ÇÂçv÷&ÆE&æ²Ò"çv÷&ÆE&æ²“°§Ð ¦gVæ7F–öâ&Vg&W6„öæUö–çDÖ7FW%6Æ÷G2‚’°¢–b‚7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’&WGW&ã°¢–b†6†×–öç6†—ÖF6†W2ƒÂR’æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’°¢6öç7B&æ¶VBÒö&¦V7Bæg&öÔVçG&–W2„ôäUõô”åEôÔ5DU%ôu$õU2æÖ‚†w&÷W’Óâ¶w&÷WÂöæUö–çDÖ7FW%7FæF–æw2†w&÷W•Ò’“°¢76–vä6†×–öç6†—ÖF6‚‚&Ö7FW%÷Æ–öfeó"Â&æ¶VE²#%Õ³ÓòæVçG'’Â&æ¶VE²#"%Õ³%ÓòæVçG'’“°¢76–vä6†×–öç6†—ÖF6‚‚&Ö7FW%÷Æ–öfeó""Â&æ¶VE²#"%Õ³ÓòæVçG'’Â&æ¶VE²#2%Õ³%ÓòæVçG'’“°¢76–vä6†×–öç6†—ÖF6‚‚&Ö7FW%÷Æ–öfeó2"Â&æ¶VE²#2%Õ³ÓòæVçG'’Â&æ¶VE²#B%Õ³%ÓòæVçG'’“°¢76–vä6†×–öç6†—ÖF6‚‚&Ö7FW%÷Æ–öfeóB"Â&æ¶VE²#B%Õ³ÓòæVçG'’Â&æ¶VE²#%Õ³%ÓòæVçG'’“°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—w&÷Wv–ææW'2ÒôäUõô”åEôÔ5DU%ôu$õU2æÖ‚†w&÷W’Óâ&æ¶VE¶w&÷WÕ³ÓòæVçG'’“°¢7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW%6V6öæEÆ6TVçG&–W2ÒôäUõô”åEôÔ5DU%ôu$õU2æÖ‚†w&÷W’Óâ&æ¶VE¶w&÷WÕ³ÓòæVçG'’“°¢Ð¢6öç7BÆ–öfg2Ò6†×–öç6†—ÖF6†W2ƒ2“°¢–b‡Æ–öfg2æÆVæwF‚bbÆ–öfg2æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’°¢–b‚7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&r’°¢6öç7Bv–ææW'2Ò6‡VffÆR‡7FFRçF÷W&æÖVçBæ6†×–öç6†—w&÷Wv–ææW'2ÇÂµÒ“°¢6öç7BÆ–öfev–ææW'2Ò6‡VffÆR‡Æ–öfg2æÖ‚†ÖF6‚’ÓâÖF6‚çv–ææW"’“°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&rÒ²ââçv–ææW'2ÂââçÆ–öfev–ææW'5Ó°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÒ°¢Ð¢f÷"†ÆWB–æFW‚Ò²–æFW‚ÂC²–æFW‚³Ò’76–vä6†×–öç6†—ÖF6‚†Ö7FW%÷eòG¶–æFW‚²ÖÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&u¶–æFW…ÒÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&u¶–æFW‚²EÒ“°¢Ð¢f÷"†ÆWB–æFW‚Ò²–æFW‚ÃÒ#²–æFW‚³Ò’°¢6öç7BÆVgBÒF÷W&æÖVçDÖF6„'”–B†Ö7FW%÷eòG¶–æFW‚¢"ÒÖ“°¢6öç7B&–v‡BÒF÷W&æÖVçDÖF6„'”–B†Ö7FW%÷eòG¶–æFW‚¢'Ö“°¢–b†ÆVgCòçv–ææW"bb&–v‡Còçv–ææW"’76–vä6†×–öç6†—ÖF6‚†Ö7FW%÷6eòG¶–æFW‡ÖÂÆVgBçv–ææW"Â&–v‡Bçv–ææW"“°¢Ð¢6öç7B6VÖ—2Ò·F÷W&æÖVçDÖF6„'”–B‚&Ö7FW%÷6eó"’ÂF÷W&æÖVçDÖF6„'”–B‚&Ö7FW%÷6eó""•Ó°¢–b‡6VÖ—2æWfW'’‚†ÖF6‚’ÓâÖF6ƒòçv–ææW"’’76–vä6†×–öç6†—ÖF6‚‚&f–æÂ"Â6VÖ—5³Òçv–ææW"Â6VÖ—5³Òçv–ææW"“°§Ð ¦gVæ7F–öâ6†×–öç6†—ÖF6†W2‡†6RÒçVÆÂÂF’ÒçVÆÂ’°¢&WGW&â7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’Óâ€¢ÖF6‚æ6†×–öç6†—†6P¢bb‡†6RÓÒçVÆÂÇÂÖF6‚æ6†×–öç6†—†6RÓÓÒ†6R¢bb†F’ÓÒçVÆÂÇÂÖF6‚æF’ÓÓÒF’¢’“°§Ð ¦gVæ7F–öâ6†×–öç6†—7FæF–æw2‡†6RÂw&÷WÂF‡&÷Vv„F’Ò2’°¢6öç7Bw&÷W2Ò†6RÓÓÒò7FFRçF÷W&æÖVçBæ6†×–öç6†—†6Sw&÷W2¢7FFRçF÷W&æÖVçBæ6†×–öç6†—†6S$w&÷W3°¢6öç7B&÷w2ÒæWrÖ‚†w&÷W3òå¶w&÷WÒÇÂµÒ’æÖ‚†VçG'’’Óâ¶VçG'’Â°¢VçG'’Âö–çG3¢ÂÆ–VC¢Âv–ç3¢ÂÆ÷76W3¢À¢6WG5vöã¢Â6WG4Æ÷7C¢ÂvÖW5vöã¢ÂvÖW4Æ÷7C¢À¢v÷&ÆE&æ³¢F÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’†VçG'’’óò“““““’À¢ÕÒ’“°¢f÷"†6öç7BÖF6‚öb6†×–öç6†—ÖF6†W2‡†6R’æf–ÇFW"‚†—FVÒ’Óâ—FVÒæw&÷WÓÓÒw&÷Wbb—FVÒæF’ÃÒF‡&÷Vv„F’’’°¢–b‚ÖF6‚ç66÷&RÇÂÖF6‚çv–ææW"’6öçF–çVS°¢6öç7B7FG4Ò&÷w2ævWB†ÖF6‚çÆ–W$“°¢6öç7B7FG4"Ò&÷w2ævWB†ÖF6‚çÆ–W$"“°¢Ç”ÆVwVTÖF6…7FG2‡7FG4Â7FG4"ÂÖF6‚ç&WfVÆVE6WE66÷&W3òæÆVæwF‚òÖF6‚ç&WfVÆVE6WE66÷&W2¢'6UF÷W&æÖVçE66÷&R†ÖF6‚ç66÷&R’“°¢7FG4çÆ–VB³Ò°¢7FG4"çÆ–VB³Ò°¢&÷w2ævWB†ÖF6‚çv–ææW"’çö–çG2³Ò°¢&÷w2ævWB†ÖF6‚çv–ææW"’çv–ç2³Ò°¢†ÖF6‚çv–ææW"ÓÓÒÖF6‚çÆ–W$ò7FG4"¢7FG4’æÆ÷76W2³Ò°¢Ð¢&WGW&â²ââç&÷w2çfÇVW2‚•ÒæÖ‚‡&÷r’Óâ‡°¢ââç&÷rÀ¢6WDF–ffW&Væ6S¢&÷rç6WG5vöâÒ&÷rç6WG4Æ÷7BÀ¢vÖTF–ffW&Væ6S¢&÷rævÖW5vöâÒ&÷rævÖW4Æ÷7BÀ¢Ò’’ç6÷'B‚†Â"’Óâ"çö–çG2Òçö–çG0¢ÇÂ"ç6WDF–ffW&Væ6RÒç6WDF–ffW&Væ6P¢ÇÂ"ævÖTF–ffW&Væ6RÒævÖTF–ffW&Væ6P¢ÇÂçv÷&ÆE&æ²Ò"çv÷&ÆE&æ²“°§Ð ¦gVæ7F–öâ&WfVÄ6†×–öç6†—F’‡†6RÂF’’°¢f÷"†6öç7BÖF6‚öb6†×–öç6†—ÖF6†W2‡†6RÂF’’’°¢–b†ÖF6‚çv–ææW"ÇÂÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"’6öçF–çVS°¢–b‚Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’6öçF–çVS°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚æ†–FFVå6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢Ð§Ð ¦gVæ7F–öâ76–vä6†×–öç6†—ÖF6‚†–BÂÆ–W$ÂÆ–W$"’°¢6WDÖF6…Æ–W'2‡F÷W&æÖVçDÖF6„'”–B†–B’ÂÆ–W$ÂÆ–W$"“°§Ð ¦gVæ7F–öâ&Vg&W6„6†×–öç6†—6Æ÷G2‚’°¢–b‚7FFRçF÷W&æÖVçBæ6†×–öç6†—’&WGW&ã°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’°¢&Vg&W6„öæUö–çDÖ7FW%6Æ÷G2‚“°¢&WGW&ã°¢Ð¢–b†6†×–öç6†—ÖF6†W2ƒÂ2’æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’°¢6öç7B&æ¶VBÒö&¦V7Bæg&öÔVçG&–W2‚$$4DTdt‚"ç7Æ—B‚""’æÖ‚†w&÷W’Óâ¶w&÷WÂ6†×–öç6†—7FæF–æw2ƒÂw&÷WÂ2•Ò’“°¢6öç7Bw&÷W2Ò°¢¢·&æ¶VBä³ÓòæVçG'’Â&æ¶VBä%³ÓòæVçG'’Â&æ¶VBä5³ÓòæVçG'’Â&æ¶VBäE³ÓòæVçG'•ÒÀ¢#¢·&æ¶VBäU³ÓòæVçG'’Â&æ¶VBäe³ÓòæVçG'’Â&æ¶VBäu³ÓòæVçG'’Â&æ¶VBä…³ÓòæVçG'•ÒÀ¢3¢·&æ¶VBä%³ÓòæVçG'’Â&æ¶VBä³ÓòæVçG'’Â&æ¶VBäE³ÓòæVçG'’Â&æ¶VBä5³ÓòæVçG'•ÒÀ¢C¢·&æ¶VBäe³ÓòæVçG'’Â&æ¶VBäU³ÓòæVçG'’Â&æ¶VBä…³ÓòæVçG'’Â&æ¶VBäu³ÓòæVçG'•ÒÀ¢Ó°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—†6S$w&÷W2Òw&÷W3°¢f÷"†6öç7Bw&÷Wöb²#"Â#""Â#2"Â#B%Ò’°¢6öç7BVçG&–W2Òw&÷W5¶w&÷WÓ°¢6öç7B66†VGVÆRÒµµ³ÂÒÂ³"Â5ÕÒÂµ³Â5ÒÂ³"ÂÕÒÂµ³Â%ÒÂ³Â5ÕÕÓ°¢66†VGVÆRæf÷$V6‚‚‡—'2ÂF”–æFW‚’Óâ—'2æf÷$V6‚‚…¶Â%ÒÂÖF6„–æFW‚’Óâ°¢76–vä6†×–öç6†—ÖF6‚†6†×÷%örG¶w&÷WÕöBG¶F”–æFW‚²ÕöÒG¶ÖF6„–æFW‚²ÖÂVçG&–W5¶ÒÂVçG&–W5¶%Ò“°¢Ò’“°¢Ð¢Ð¢–b†6†×–öç6†—ÖF6†W2ƒ"Â2’æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’°¢6öç7B&æ¶VBÒö&¦V7Bæg&öÔVçG&–W2…²#"Â#""Â#2"Â#B%ÒæÖ‚†w&÷W’Óâ¶w&÷WÂ6†×–öç6†—7FæF–æw2ƒ"Âw&÷WÂ2•Ò’“°¢76–vä6†×–öç6†—ÖF6‚‚&6†×÷Æ–öfeó"Â&æ¶VE²#%Õ³ÓòæVçG'’Â&æ¶VE²#"%Õ³%ÓòæVçG'’“°¢76–vä6†×–öç6†—ÖF6‚‚&6†×÷Æ–öfeó""Â&æ¶VE²#"%Õ³ÓòæVçG'’Â&æ¶VE²#2%Õ³%ÓòæVçG'’“°¢76–vä6†×–öç6†—ÖF6‚‚&6†×÷Æ–öfeó2"Â&æ¶VE²#2%Õ³ÓòæVçG'’Â&æ¶VE²#B%Õ³%ÓòæVçG'’“°¢76–vä6†×–öç6†—ÖF6‚‚&6†×÷Æ–öfeóB"Â&æ¶VE²#B%Õ³ÓòæVçG'’Â&æ¶VE²#%Õ³%ÓòæVçG'’“°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—w&÷Wv–ææW'2Ò²#"Â#""Â#2"Â#B%ÒæÖ‚†w&÷W’Óâ&æ¶VE¶w&÷WÕ³ÓòæVçG'’“°¢Ð¢6öç7BÆ–öfg2Ò6†×–öç6†—ÖF6†W2ƒ2“°¢–b‡Æ–öfg2æÆVæwF‚bbÆ–öfg2æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’°¢–b‚7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&r’°¢6öç7B÷3FóBÒ6‡VffÆR‡7FFRçF÷W&æÖVçBæ6†×–öç6†—w&÷Wv–ææW'2ÇÂµÒ“°¢6öç7B÷3WFó‚Ò6‡VffÆR‡Æ–öfg2æÖ‚†ÖF6‚’ÓâÖF6‚çv–ææW"’“°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&rÒ²ââç÷3FóBÂââç÷3WFó…Ó°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÒ°¢Ð¢6öç7BG&rÒ7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&s°¢f÷"†ÆWB–æFW‚Ò²–æFW‚ÂC²–æFW‚³Ò’76–vä6†×–öç6†—ÖF6‚†6†×÷eòG¶–æFW‚²ÖÂG&u¶–æFW…ÒÂG&u¶–æFW‚²EÒ“°¢Ð¢f÷"†ÆWB–æFW‚Ò²–æFW‚ÃÒ#²–æFW‚³Ò’°¢6öç7BÆVgBÒF÷W&æÖVçDÖF6„'”–B†6†×÷eòG²†–æFW‚¢"’ÒÖ“°¢6öç7B&–v‡BÒF÷W&æÖVçDÖF6„'”–B†6†×÷eòG¶–æFW‚¢'Ö“°¢–b†ÆVgCòçv–ææW"bb&–v‡Còçv–ææW"’76–vä6†×–öç6†—ÖF6‚†6†×÷6eòG¶–æFW‡ÖÂÆVgBçv–ææW"Â&–v‡Bçv–ææW"“°¢Ð¢6öç7B6cÒF÷W&æÖVçDÖF6„'”–B‚&6†×÷6eó"“°¢6öç7B6c"ÒF÷W&æÖVçDÖF6„'”–B‚&6†×÷6eó""“°¢–b‡6còçv–ææW"bb6c#òçv–ææW"’76–vä6†×–öç6†—ÖF6‚‚&f–æÂ"Â6cçv–ææW"Â6c"çv–ææW"“°§Ð ¦gVæ7F–öâ6†×–öç6†—‡VÖå7F–ÆÅVÆ–f–VB‚’°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’°¢–b‚6†×–öç6†—ÖF6†W2ƒÂR’æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’&WGW&âG'VS°¢&WGW&âôäUõô”åEôÔ5DU%ôu$õU2ç6öÖR‚†w&÷W’ÓâöæUö–çDÖ7FW%7FæF–æw2†w&÷WÂR’ç6Æ–6RƒÂ2’ç6öÖR‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒ‡VÖâ’“°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÓÓÒbb6†×–öç6†—ÖF6†W2ƒÂ2’æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’°¢&WGW&âö&¦V7Bæ¶W—2‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6Sw&÷W2’ç6öÖR‚†w&÷W’Óâ6†×–öç6†—7FæF–æw2ƒÂw&÷WÂ2’ç6Æ–6RƒÂ"’ç6öÖR‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒ‡VÖâ’“°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÓÓÒ"bb6†×–öç6†—ÖF6†W2ƒ"Â2’æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"’’°¢&WGW&âö&¦V7Bæ¶W—2‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6S$w&÷W2’ç6öÖR‚†w&÷W’Óâ6†×–öç6†—7FæF–æw2ƒ"Âw&÷WÂ2’ç6Æ–6RƒÂ2’ç6öÖR‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒ‡VÖâ’“°¢Ð¢&WGW&âG'VS°§Ð ¦gVæ7F–öâ6–×VÆFU&VÖ–æ–æt6†×–öç6†—‚’°¢ÆWB6†ævVBÒG'VS°¢v†–ÆR†6†ævVB’°¢6†ævVBÒfÇ6S°¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢f÷"†6öç7BÖF6‚öb7FFRçF÷W&æÖVçBæÖF6†W2’°¢–b†ÖF6‚çv–ææW"ÇÂÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$’ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"’’6öçF–çVS°¢–b‚Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’6öçF–çVS°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚æ†–FFVå6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢6†ævVBÒG'VS°¢Ð¢Ð¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÃòçv–ææW"ÇÂçVÆÃ°§Ð ¦gVæ7F–öâGfæ6T6†×–öç6†—FôæW‡D‡VÖäÖF6‚‚’°¢f÷"†ÆWBwV&BÒ²wV&BÂ#²wV&B³Ò’°¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢6öç7BæW‡D‡VÖâÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢–b†æW‡D‡VÖâ’°¢f÷"†ÆWBF’Ò²F’ÂçVÖ&W"†æW‡D‡VÖâæF’ÇÂ“²F’³Ò’°¢&WfVÄ6†×–öç6†—F’†æW‡D‡VÖâæ6†×–öç6†—†6RÂF’“°¢Ð¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢&WGW&âæW‡D‡VÖã°¢Ð¢6öç7BæW‡D”ÖF6‚Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–æB‚†ÖF6‚’Óâ€¢ÖF6‚çv–ææW ¢bbÖF6‚çÆ–W$¢bbÖF6‚çÆ–W$ ¢bb—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$¢bb—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"¢’“°¢–b‚æW‡D”ÖF6‚’'&V³°¢&WfVÄ6†×–öç6†—F’†æW‡D”ÖF6‚æ6†×–öç6†—†6RÂæW‡D”ÖF6‚æF’“°¢Ð¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b†f–æÃòçv–ææW"’°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÂçv–ææW#°¢Ð¢&WGW&âçVÆÃ°§Ð ¦gVæ7F–öâ&W&T6†×–öç6†—‡VÖäÖF6‚‚’°¢–b‚7FFRçF÷W&æÖVçBæ6†×–öç6†—ÇÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFR’&WGW&ã°¢6öç7BæW‡BÒGfæ6T6†×–öç6†—FôæW‡D‡VÖäÖF6‚‚“°¢–b‚æW‡B’°¢&WGW&ã°¢Ð¢6öç7B÷öæVçBÒ÷öæVçD6†&7FW$–äÖF6‚†æW‡BÂ‡VÖåF÷W&æÖVçDVçG'’‚’“°¢6öç7B6VÆV7FVD÷öæVçG2Ò7FFRçF÷W&æÖVçBæ6†×–öç6†—&÷7FW"ÇÂµÓ°¢–b‚÷öæVçBÇÂ6VÆV7FVD÷öæVçG2æ–æ6ÇVFW2†÷öæVçB’’°¢7FFRæÆörçVç6†–gB‚$6†×–öææB¢GfW'6—&R–çfÆ–FRÂ&WF÷W"R6Æöââ"“°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBç7FvRÒ&6†×–öç6†—Æö&'’#°¢4ôÄõô’æVæ&ÆVBÒfÇ6S°¢&WGW&ã°¢Ð¢7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÒæW‡Bæ6†×–öç6†—†6S°¢DõU$äÔTåEõäTÅõT’æ6†×–öç6†—÷Vå¦öæRÒæW‡Bæ6†×–öç6†—†6S°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒæW‡Bæ–C°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBç7FvRÒæW‡Bç&÷VæC°¢4ôÄõô’æVæ&ÆVBÒG'VS°¢4ôÄõô’æ6†&7FW$–BÒ÷öæVçC°¢7F'DÖF6„ÖöFR‡7FFRçF÷W&æÖVçBçF&vWE6WG2Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒæW‡Bæ–C°¢7FFRçF÷W&æÖVçBç7FvRÒæW‡Bç&÷VæC°§Ð ¦gVæ7F–öâ†æFÆT6†×–öç6†—ÖF6„6ö×ÆWFR‚’°¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢–b‚ÖF6‚ÇÂÖF6‚çv–ææW"’&WGW&ã°¢ÖF6‚çv–ææW"ÒF÷W&æÖVçEv–ææW$VçG'”g&öÔÖF6…v–ææW"‡7FFRç6WDÖF6‚æÖF6…v–ææW"“°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒF÷W&æÖVçD6ö×ÆWFVE6WE66÷&W4f÷$ÖF6‚†ÖF6‚“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°¢&WfVÄ6†×–öç6†—F’†ÖF6‚æ6†×–öç6†—†6RÂÖF6‚æF’“°¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÒÖF‚æÖ‚‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÂÖF6‚æ6†×–öç6†—†6R“°¢–b†ÖF6‚æ–BÓÓÒ&f–æÂ"’°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒÖF6‚çv–ææW#°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢–b‚6†×–öç6†—‡VÖå7F–ÆÅVÆ–f–VB‚’ÇÂ†ÖF6‚æ6†×–öç6†—†6RãÒ2bbÖF6‚çv–ææW"ÓÒ‡VÖåF÷W&æÖVçDVçG'’‚’’’°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—‡VÖäVÆ–Ö–æFVBÒG'VS°¢7FFRçF÷W&æÖVçBç7FvRÒ&6†×–öç6†—Æö&'’#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢7FFRçF÷W&æÖVçBç7FvRÒ'&VG”æW‡B#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢6öç7BæW‡BÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒæW‡Còæ–BÇÂçVÆÃ°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ&W&TÆVwVT‡VÖäÖF6‚‚’°¢6öç7BæW‡DÖF6‚ÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢–b‚æW‡DÖF6‚’°¢6ö×ÆWFTÆVwVUv—F†÷WD‡VÖâ‚“°¢&WGW&ã°¢Ð¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒæW‡DÖF6‚æ–C°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBç7FvRÒæW‡DÖF6‚ç&÷VæC°¢4ôÄõô’æ6†&7FW$–BÒ÷öæVçD6†&7FW$–äÖF6‚†æW‡DÖF6‚Â…TÔåõDõU$äÔTåEôTåE%’“°¢7F'DÖF6„ÖöFR‡7FFRçF÷W&æÖVçBçF&vWE6WG2óò"Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒæW‡DÖF6‚æ–C°¢7FFRçF÷W&æÖVçBç7FvRÒæW‡DÖF6‚ç&÷VæC°¢7FFRæÆörçVç6†–gB†G¶æW‡DÖF6‚æÆ&VÇÒ¢G·6VÆV7FVEÆ–W$æÖR‚—Ò6öçG&RG¶6†&7FW$æÖTg&öÔ–B…4ôÄõô’æ6†&7FW$–B—Òæ“°§Ð ¦gVæ7F–öâÆVwVTw&÷WÖF6†W2†w&÷WÒçVÆÂ’°¢&WGW&â7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æF’bb‚w&÷WÇÂÖF6‚æw&÷WÓÓÒw&÷W’“°§Ð ¦gVæ7F–öâÆVwVT6ö×ÆWFVDw&÷WF—2‚’°¢ÆWBF—2Ò°¢f÷"†6öç7BF’öb³Â"Â5Ò’°¢6öç7BF”ÖF6†W2ÒÆVwVTw&÷WÖF6†W2‚’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æF’ÓÓÒF’“°¢–b†F”ÖF6†W2æÆVæwF‚bbF”ÖF6†W2æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"bbÖF6‚ç66÷&R’’F—2ÒF“°¢Ð¢&WGW&âF—3°§Ð ¦gVæ7F–öâÆVwVU7FæF–æw2†w&÷WÂF‡&÷Vv„F’Ò2’°¢–b‡7FFRçF÷W&æÖVçBæg&–VæFÇ’’°¢&WGW&â‡7FFRçF÷W&æÖVçBæg&–VæFÇ•7FæF–æw3òå¶w&÷WÒÇÂµÒ’æÖ‚‡&÷r’Óâ‡°¢VçG'“¢&÷ræVçG'’ÇÂ&÷rçÆ–W#òæVçG'’À¢ö–çG3¢çVÖ&W"‡&÷rçö–çG2ÇÂ’À¢Æ–VC¢çVÖ&W"‡&÷rçÆ–VBÇÂ’À¢v–ç3¢çVÖ&W"‡&÷rçv–ç2ÇÂ’À¢Æ÷76W3¢çVÖ&W"‡&÷ræÆ÷76W2ÇÂ’À¢6WG5vöã¢çVÖ&W"‡&÷rç6WG5vöâÇÂ’À¢6WG4Æ÷7C¢çVÖ&W"‡&÷rç6WG4Æ÷7BÇÂ’À¢vÖW5vöã¢çVÖ&W"‡&÷rævÖW5vöâÇÂ’À¢vÖW4Æ÷7C¢çVÖ&W"‡&÷rævÖW4Æ÷7BÇÂ’À¢6WDF–ffW&Væ6S¢çVÖ&W"‡&÷rç6WDF–ffW&Væ6RÇÂ’À¢vÖTF–ffW&Væ6S¢çVÖ&W"‡&÷rævÖTF–ffW&Væ6RÇÂ’À¢v÷&ÆE&æ³¢çVÖ&W"‡&÷rçv÷&ÆE&æ²ÇÂ“““““’’À¢Ò’“°¢Ð¢6öç7B&÷w2ÒæWrÖ‚‡7FFRçF÷W&æÖVçBæÆVwVTw&÷W3òå¶w&÷WÒÇÂµÒ’æÖ‚†VçG'’’Óâ¶VçG'’Â°¢VçG'’À¢ö–çG3¢À¢Æ–VC¢À¢v–ç3¢À¢Æ÷76W3¢À¢6WG5vöã¢À¢6WG4Æ÷7C¢À¢vÖW5vöã¢À¢vÖW4Æ÷7C¢À¢v÷&ÆE&æ³¢F÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’†VçG'’’óò“““““’À¢ÕÒ’“°¢f÷"†6öç7BÖF6‚öbÆVwVTw&÷WÖF6†W2†w&÷W’’°¢–b‚ÖF6‚ç66÷&RÇÂÖF6‚çv–ææW"ÇÂçVÖ&W"†ÖF6‚æF’ÇÂ’âF‡&÷Vv„F’’6öçF–çVS°¢6öç7B6WE66÷&W2ÒÖF6‚ç&WfVÆVE6WE66÷&W3òæÆVæwF‚òÖF6‚ç&WfVÆVE6WE66÷&W2¢'6UF÷W&æÖVçE66÷&R†ÖF6‚ç66÷&R“°¢6öç7BÆ–W$7FG2Ò&÷w2ævWB†ÖF6‚çÆ–W$“°¢6öç7BÆ–W$%7FG2Ò&÷w2ævWB†ÖF6‚çÆ–W$"“°¢Ç”ÆVwVTÖF6…7FG2‡Æ–W$7FG2ÂÆ–W$%7FG2Â6WE66÷&W2“°¢Æ–W$7FG2çÆ–VB³Ò°¢Æ–W$%7FG2çÆ–VB³Ò°¢6öç7Bv–ææW%7FG2Ò&÷w2ævWB†ÖF6‚çv–ææW"“°¢6öç7BÆ÷6W%7FG2ÒÖF6‚çv–ææW"ÓÓÒÖF6‚çÆ–W$òÆ–W$%7FG2¢Æ–W$7FG3°¢v–ææW%7FG2çö–çG2³Ò°¢v–ææW%7FG2çv–ç2³Ò°¢Æ÷6W%7FG2æÆ÷76W2³Ò°¢Ð¢&WGW&â²ââç&÷w2çfÇVW2‚•ÒæÖ‚‡&÷r’Óâ‡°¢ââç&÷rÀ¢6WDF–ffW&Væ6S¢&÷rç6WG5vöâÒ&÷rç6WG4Æ÷7BÀ¢vÖTF–ffW&Væ6S¢&÷rævÖW5vöâÒ&÷rævÖW4Æ÷7BÀ¢Ò’’ç6÷'B‚†Â"’Óâ€¢"çö–çG2Òçö–çG0¢ÇÂ"ç6WDF–ffW&Væ6RÒç6WDF–ffW&Væ6P¢ÇÂ"ævÖTF–ffW&Væ6RÒævÖTF–ffW&Væ6P¢ÇÂçv÷&ÆE&æ²Ò"çv÷&ÆE&æ°¢’“°§Ð ¦gVæ7F–öâ'6UF÷W&æÖVçE66÷&R‡66÷&RÒ""’°¢&WGW&â7G&–ær‡66÷&R’ç7Æ—B‚"Ò"’æÖ‚‡6WB’Óâ°¢6öç7B¶ÆVgBÂ&–v‡EÒÒ6WBç7Æ—B‚"ò"’æÖ‚‡fÇVR’ÓâçVÖ&W"‡fÇVRçG&–Ò‚’’“°¢&WGW&â¶ÆVgBÇÂÂ&–v‡BÇÂÓ°¢Ò’æf–ÇFW"‚‡6WB’Óâ6WBç6öÖR‚‡fÇVR’ÓâçVÖ&W"æ—4f–æ—FR‡fÇVR’’“°§Ð ¦gVæ7F–öâÇ”ÆVwVTÖF6…7FG2‡Æ–W$7FG2ÂÆ–W$%7FG2Â6WE66÷&W2ÒµÒ’°¢–b‚Æ–W$7FG2ÇÂÆ–W$%7FG2’&WGW&ã°¢f÷"†6öç7B¶vÖW4ÂvÖW4%Òöb6WE66÷&W2’°¢Æ–W$7FG2ævÖW5vöâ³ÒvÖW4°¢Æ–W$7FG2ævÖW4Æ÷7B³ÒvÖW4#°¢Æ–W$%7FG2ævÖW5vöâ³ÒvÖW4#°¢Æ–W$%7FG2ævÖW4Æ÷7B³ÒvÖW4°¢–b†vÖW4âvÖW4"’°¢Æ–W$7FG2ç6WG5vöâ³Ò°¢Æ–W$%7FG2ç6WG4Æ÷7B³Ò°¢ÒVÇ6R°¢Æ–W$%7FG2ç6WG5vöâ³Ò°¢Æ–W$7FG2ç6WG4Æ÷7B³Ò°¢Ð¢Ð§Ð ¦gVæ7F–öâ&WfVÄÆVwVTF’†F’’°¢f÷"†6öç7BÖF6‚öb7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†—FVÒ’Óâ—FVÒæF’ÓÓÒF’’’°¢–b†ÖF6‚çv–ææW"ÇÂÖF6‚ç66÷&R’6öçF–çVS°¢–b‚Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’6öçF–çVS°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚æ†–FFVå6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢Ð¢7FFRçF÷W&æÖVçBæÆVwVT6ö×ÆWFVDF—2ÒÖF‚æÖ‚‡7FFRçF÷W&æÖVçBæÆVwVT6ö×ÆWFVDF—2ÇÂÂÆVwVT6ö×ÆWFVDw&÷WF—2‚’“°§Ð ¦gVæ7F–öâ&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚’°¢–b‚7FFRçF÷W&æÖVçBæÆVwVRÇÂÆVwVT6ö×ÆWFVDw&÷WF—2‚’Â2’&WGW&ã°¢6öç7Bw&÷WÒÆVwVU7FæF–æw2‚$"Â2“°¢6öç7Bw&÷W"ÒÆVwVU7FæF–æw2‚$""Â2“°¢6WDÖF6…Æ–W'2‡F÷W&æÖVçDÖF6„'”–B‚&ÆVwVU÷6VÖ“"’Âw&÷W³ÓòæVçG'’ÇÂçVÆÂÂw&÷W%³ÓòæVçG'’ÇÂçVÆÂ“°¢6WDÖF6…Æ–W'2‡F÷W&æÖVçDÖF6„'”–B‚&ÆVwVU÷6VÖ“""’Âw&÷W%³ÓòæVçG'’ÇÂçVÆÂÂw&÷W³ÓòæVçG'’ÇÂçVÆÂ“°¢6öç7B6VÖ“ÒF÷W&æÖVçDÖF6„'”–B‚&ÆVwVU÷6VÖ“"“°¢6öç7B6VÖ“"ÒF÷W&æÖVçDÖF6„'”–B‚&ÆVwVU÷6VÖ“""“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b†f–æÂbb‡6VÖ“òçv–ææW"ÇÂ6VÖ“#òçv–ææW"’’°¢6WDÖF6…Æ–W'2†f–æÂÂ6VÖ“òçv–ææW"ÇÂçVÆÂÂ6VÖ“#òçv–ææW"ÇÂçVÆÂ“°¢Ð§Ð ¦gVæ7F–öâ6ö×ÆWFTÆVwVUv—F†÷WD‡VÖâ‚’°¢&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢f÷"†6öç7BÖF6‚öb7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†—FVÒ’Óâ—FVÒç&÷VæBÓÓÒ'6VÖ’"ÇÂ—FVÒç&÷VæBÓÓÒ&f–æÂ"’’°¢–b‚ÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"ÇÂÖF6‚çv–ææW"’6öçF–çVS°¢–b†—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$’ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"’’6öçF–çVS°¢–b‚Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’6öçF–çVS°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚æ†–FFVå6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢Ð¢6öç7BæW‡D‡VÖäÖF6‚ÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢–b†æW‡D‡VÖäÖF6‚’°¢7FFRçF÷W&æÖVçBç7FvRÒ'&VG”æW‡B#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒæW‡D‡VÖäÖF6‚æ–C°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒçVÆÃ°¢&WGW&ã°¢Ð¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢7FFRçF÷W&æÖVçBç7FvRÒf–æÃòçv–ææW"ò&6ö×ÆWFR"¢7FFRçF÷W&æÖVçBç7FvS°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÃòçv–ææW"ÇÂçVÆÃ°§Ð ¦gVæ7F–öâF÷W&æÖVçD&6TVçG'’†VçG'’’°¢&WGW&â7G&–ær†VçG'’ÇÂ""’ç7Æ—B‚#£¦GWÆ–6FS¢"•³Ó°§Ð ¦gVæ7F–öâVæ—VUF÷W&æÖVçD”VçG&–W2†6÷VçBÂ6VÆV7F–öâÒ'&æFöÒ"Â‡VÖä6†&7FW$–BÒ6VÆV7FVD6†&7FW$–B‚’’°¢&WGW&â6VÆV7D”6ÇV$†÷W6UÆ–W'2„ÖF‚æÖ–â†6÷VçBÂDõU$äÔTåEô4„$5DU%õôôÂæÆVæwF‚’Â6VÆV7F–öâÂ‡VÖä6†&7FW$–B“°§Ð ¦gVæ7F–öâF†—'G•GvõÆ–W%F÷W&æÖVçD”VçG&–W2‡6VÆV7F–öâÒ'&æFöÒ"Â‡VÖä6†&7FW$–BÒçVÆÂ’°¢&WGW&âVæ—VUF÷W&æÖVçD”VçG&–W2ƒ3Â6VÆV7F–öâÂ‡VÖä6†&7FW$–B“°§Ð ¦gVæ7F–öâ6VVFVEF÷W&æÖVçE6Æ÷DÖ‡6—¦RÂ6VVD6÷VçB’°¢–b‡6—¦RÓÓÒ‚bb6VVD6÷VçBÓÓÒB’&WGW&â²¢ÂC¢BÂ3¢RÂ#¢‚Ó°¢6öç7Bf7F÷"Ò6—¦Rò3#°¢6öç7B6Æ÷G33"Ò²¢Âƒ¢‚ÂS¢’ÂC¢bÂ3¢rÂc¢#BÂs¢#RÂ#¢3"Ó°¢&WGW&âö&¦V7Bæg&öÔVçG&–W2„ö&¦V7BæVçG&–W2‡6Æ÷G33"’æÖ‚…·6VVBÂ6Æ÷EÒ’Óâ·6VVBÂÖF‚æÖ‚ƒÂÖF‚ç&÷VæB‡6Æ÷B¢f7F÷"’•Ò’“°§Ð ¦gVæ7F–öâ'V–ÆD”6ÇV$†÷W6T6Æ76–56WGW†÷F–öç2Ò·Ò’°¢6öç7B6—¦RÒ³‚ÂbÂ3%Òæ–æ6ÇVFW2„çVÖ&W"†÷F–öç2çF÷W&æÖVçE6—¦R’’òçVÖ&W"†÷F–öç2çF÷W&æÖVçE6—¦R’¢c°¢6öç7B6VÆV7FVD’Ò6—¦RÓÓÒ3 ¢òF†—'G•GvõÆ–W%F÷W&æÖVçD”VçG&–W2†÷F–öç2çÆ–W%6VÆV7F–öâÂ÷F–öç2æ‡VÖä6†&7FW$–B¢¢Væ—VUF÷W&æÖVçD”VçG&–W2‡6—¦RÒÂ÷F–öç2çÆ–W%6VÆV7F–öâÂ÷F–öç2æ‡VÖä6†&7FW$–B“°¢6öç7B&÷7FW"Ò´…TÔåõDõU$äÔTåEôTåE%’Âââç6VÆV7FVD•Ó°¢6öç7B÷6—F–öç2Ò'&’‡6—¦R²’æf–ÆÂ†çVÆÂ“°¢6öç7B&æ¶VE&÷7FW"Ò6÷'EF÷W&æÖVçDVçG&–W4'•v÷&ÆE&æ²‡&÷7FW"“°¢6öç7B6VVD6÷VçBÒ6—¦RÓÓÒ‚òB¢ƒ°¢6öç7B6VVDVçG&–W2Ò&æ¶VE&÷7FW"ç6Æ–6RƒÂ6VVD6÷VçB“°¢–b†÷F–öç2æF—7G&–'WF–öâÓÓÒ'&æ¶–ær"’°¢6öç7B6Æ÷G2Ò6VVFVEF÷W&æÖVçE6Æ÷DÖ‡6—¦RÂ6VVD6÷VçB“°¢6VVDVçG&–W2æf÷$V6‚‚†VçG'’Â–æFW‚’Óâ²÷6—F–öç5·6Æ÷G5¶–æFW‚²ÕÒÒVçG'“²Ò“°¢6öç7BVç6VVFVBÒ6‡VffÆR‡&÷7FW"æf–ÇFW"‚†VçG'’’Óâ6VVDVçG&–W2æ–æ6ÇVFW2†VçG'’’’“°¢f÷"†ÆWB÷6—F–öâÒ²÷6—F–öâÃÒ6—¦S²÷6—F–öâ³Ò’°¢–b‚÷6—F–öç5·÷6—F–öåÒ’÷6—F–öç5·÷6—F–öåÒÒVç6VVFVBç6†–gB‚“°¢Ð¢ÒVÇ6R°¢6‡VffÆR‡&÷7FW"’æf÷$V6‚‚†VçG'’Â–æFW‚’Óâ²÷6—F–öç5¶–æFW‚²ÒÒVçG'“²Ò“°¢Ð¢&WGW&â°¢÷6—F–öç2À¢6VVFVD†—7F÷&–73¢µÒÀ¢6VVDVçG&–W2À¢6VVDçVÖ&W'3¢÷F–öç2æF—7G&–'WF–öâÓÓÒ'&æ¶–ær ¢òö&¦V7Bæg&öÔVçG&–W2‡6VVDVçG&–W2æÖ‚†VçG'’Â–æFW‚’Óâ¶VçG'’Â–æFW‚²Ò’¢¢·ÒÀ¢÷6—F–öä'”VçG'“¢F÷W&æÖVçE÷6—F–öäÖ‡÷6—F–öç2’À¢&÷7FW"À¢6—¦RÀ¢Ó°§Ð ¦gVæ7F–öâ7F'DöæUö–çEF÷W&æÖVçDÖöFR†÷F–öç2Ò·Ò’°¢7F'EF÷W&æÖVçDÖöFRƒÂ²ââæ÷F–öç2ÂöæUö–çDvÖS¢G'VRÒ“°§Ð ¦gVæ7F–öâ7F'EF÷W&æÖVçDÖöFR‡F&vWE6WG2Ò"Â÷F–öç2Ò·Ò’°¢–b…4U%dU%õ5”ä2æVæ&ÆVB’°¢7FFRæÆörçVç6†–gB‚$ÆRF÷W&æö’”W7BF—7öæ–&ÆR†÷'2'F–RVâÆ–væRâ"“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢6öç7BvVV¶Ç”6ö×WF—F–öâÒ÷F–öç2æ6ö×WF—F–öâÇÂçVÆÃ°¢&W6WEF÷W&æÖVçB‚“°¢4ôÄõô’æVæ&ÆVBÒG'VS°¢4ôÄõô’çÆ–W$–æFW‚Ò°¢4ôÄõô’æF–ff–7VÇG’Òæ÷&ÖÆ—¦T”F–ff–7VÇG’†÷F–öç2æF–ff–7VÇG’ÇÂ‡vVV¶Ç”6ö×WF—F–öâò&6—&7V—B"¢&æ÷&ÖÂ"’“°¢6öç7B&WVW7FVD&öçW4ÆWfVÂÒæ÷&ÖÆ—¦T”&öçW4ÆWfVÂ†÷F–öç2æ&öçW2ÇÂ&æöæR"“°¢6öç7B‡VÖä6†&7FW$–BÒ6VÆV7FVD6†&7FW$–B‚“°¢–b‡vVV¶Ç”6ö×WF—F–öâ’°¢7F'EvVV¶Ç•F÷W&æÖVçDÖöFR‡F&vWE6WG2ÂvVV¶Ç”6ö×WF—F–öâÂ‡VÖä6†&7FW$–B“°¢&WGW&ã°¢Ð¢6öç7B”6ÇV$†÷W6RÒ&ööÆVâ†÷F–öç2æ”6ÇV$†÷W6R“°¢6öç7BöæUö–çDvÖRÒ&ööÆVâ†÷F–öç2æöæUö–çDvÖR“°¢6öç7B6—&7V—D–çFVÆÆ–vVæ6RÒ”6ÇV$†÷W6Rbb4ôÄõô’æF–ff–7VÇG’ÓÓÒ&6—&7V—B#°¢6öç7B&öçW4ÆWfVÂÒ&WVW7FVD&öçW4ÆWfVÃ°¢6öç7BF÷W&æÖVçE6WGWÒ”6ÇV$†÷W6P¢ò'V–ÆD”6ÇV$†÷W6T6Æ76–56WGW‡°¢‡VÖä6†&7FW$–BÀ¢Æ–W%6VÆV7F–öã¢÷F–öç2çÆ–W'2ÇÂ'&æFöÒ"À¢F—7G&–'WF–öã¢÷F–öç2æF—7G&–'WF–öâÇÂ'&æFöÒ"À¢F÷W&æÖVçE6—¦S¢÷F–öç2çF÷W&æÖVçE6—¦RÇÂbÀ¢Ò¢¢'V–ÆEF÷W&æÖVçE&÷VæCe÷6—F–öç2†‡VÖä6†&7FW$–BÂvVV¶Ç”6ö×WF—F–öãòç7W&f6RÇÂ&†&B"“°¢6öç7B°¢÷6—F–öç2À¢6VVFVD†—7F÷&–72ÒµÒÀ¢6VVDVçG&–W2ÒµÒÀ¢6VVDçVÖ&W'2Ò·ÒÀ¢÷6—F–öä'”VçG'’ÒF÷W&æÖVçE÷6—F–öäÖ‡÷6—F–öç2’À¢‡VÖäÆWfVÂÒ6—&7V—D‡VÖäÆWfVÂ‚’À¢ÒÒF÷W&æÖVçE6WGW°¢6öç7BG–æÖ–4&öçW4–G2Ò”6ÇV$†÷W6RòµÒ¢&Wf–÷W5vVV´G–æÖ–4&öçW4–G2‚“°¢6öç7BW&ÖæVçD&öçW6W2Ò”6ÇV$†÷W6P¢ò·Ð¢¢'V–ÆEF÷W&æÖVçEW&ÖæVçD&öçW6W2‡÷6—F–öç2Â6VVFVD†—7F÷&–72ÂG–æÖ–4&öçW4–G2“°¢6öç7B7W&f6T&öçW6W2Ò”6ÇV$†÷W6P¢ò'V–ÆD”6ÇV$†÷W6T&öçW6W2‡÷6—F–öç2Â&öçW4ÆWfVÂ¢¢·Ó°¢6öç7B”–çFVÆÆ–vVæ6TÆWfVÇ2Ò”6ÇV$†÷W6P¢ò'V–ÆEF÷W&æÖVçD”–çFVÆÆ–vVæ6TÆWfVÇ2‡÷6—F–öç2Â4ôÄõô’æF–ff–7VÇG’Â²‡VÖäÆWfVÂÒ¢¢·Ó°¢7FFRçF÷W&æÖVçBÒ°¢7F—fS¢G'VRÀ¢f—6–&ÆS¢fÇ6RÀ¢'&6¶WCc¢G'VRÀ¢'&6¶WE6—¦S¢÷6—F–öç2æÆVæwF‚ÒÀ¢&öw&W76—fTÆ—fU66÷&W3¢öæUö–çDvÖRÀ¢öæUö–çDvÖRÀ¢”6ÇV$†÷W6RÀ¢F–ff–7VÇG“¢4ôÄõô’æF–ff–7VÇG’À¢”–çFVÆÆ–vVæ6TÆWfVÇ2À¢&öçW4ÆWfVÂÀ¢Æ–W%6VÆV7F–öã¢÷F–öç2çÆ–W'2ÇÂ'&æFöÒ"À¢F—7G&–'WF–öã¢÷F–öç2æF—7G&–'WF–öâÇÂ'&æFöÒ"À¢vVV¶Ç“¢&ööÆVâ‡vVV¶Ç”6ö×WF—F–öâ’À¢6ö×WF—F–öä–C¢vVV¶Ç”6ö×WF—F–öãòæ–BÇÂçVÆÂÀ¢6ö×WF—F–öäæÖS¢vVV¶Ç”6ö×WF—F–öãòææÖRÇÂ†öæUö–çDvÖRò#ô”åBtÔR"¢”6ÇV$†÷W6Rò%DõU$äô’4ÅT"„õU4R"¢çVÆÂ’À¢6ö×WF—F–öä6—G“¢vVV¶Ç”6ö×WF—F–öãòæ6—G’ÇÂçVÆÂÀ¢6ö×WF—F–öä6÷VçG'“¢vVV¶Ç”6ö×WF—F–öãòæ6÷VçG'’ÇÂçVÆÂÀ¢6ö×WF—F–öäfÆs¢vVV¶Ç”6ö×WF—F–öãòæfÆrÇÂçVÆÂÀ¢6ö×WF—F–öå7W&f6S¢vVV¶Ç”6ö×WF—F–öãòç7W&f6RÇÂçVÆÂÀ¢6ö×WF—F–öå7W&f6TÆ&VÃ¢vVV¶Ç”6ö×WF—F–öãòç7W&f6TÆ&VÂÇÂçVÆÂÀ¢6ö×WF—F–öåö–çG3¢vVV¶Ç”6ö×WF—F–öãòçö–çG2ÇÂçVÆÂÀ¢ÖF6„&öçW5ö–çG3¢À¢ÖF6„&öçW4FWF–Ç3¢µÒÀ¢ö–çG5&V6÷&FVC¢fÇ6RÀ¢7FvS¢÷6—F–öç2æÆVæwF‚ÒÓÓÒ3"ò'&÷VæC3""¢÷6—F–öç2æÆVæwF‚ÒÓÓÒbò'&÷VæCb"¢'V'FW""À¢F&vWE6WG2À¢‡VÖä6†&7FW$–BÀ¢‡VÖäæ–6¶æÖS¢æ–6¶æÖUfÇVR‚’À¢‡VÖäVçG'“¢…TÔåõDõU$äÔTåEôTåE%’À¢”f–æÆ—7D6†&7FW$–C¢çVÆÂÀ¢7W'&VçDÖF6ƒ¢'d‡VÖâ"À¢æW‡D‡VÖäÖF6„–C¢çVÆÂÀ¢6†×–öä6†&7FW$–C¢çVÆÂÀ¢vVV¶Ç•÷6—F–öç3¢÷6—F–öç2À¢F÷W&æÖVçE÷6—F–öç3¢÷6—F–öä'”VçG'’À¢F÷W&æÖVçE6VVDçVÖ&W'3¢6VVDçVÖ&W'2À¢‡VÖä6—&7V—DÆWfVÃ¢6—&7V—D–çFVÆÆ–vVæ6Rò‡VÖäÆWfVÂ¢çVÆÂÀ¢6—&7V—D&öçW57W&f6S¢çVÆÂÀ¢7W&f6T&öçW6W2À¢W&ÖæVçD&öçW6W2À¢6VVFVD6†&7FW'3¢”6ÇV$†÷W6RòµÒ¢6VVFVD†—7F÷&–72À¢G–æÖ–4&öçW4–G2À¢ÖF6†W3¢µÒÀ¢&Wf–÷W5v–å66÷&W3¢·ÒÀ¢öæUö–çE&Wv&G3¢·ÒÀ¢Ó°¢7FFRçF÷W&æÖVçBæÖF6†W2Ò'V–ÆEvVV¶Ç•F÷W&æÖVçDÖF6†W2‡÷6—F–öç2Â…TÔåõDõU$äÔTåEôTåE%’ÂF&vWE6WG2“°¢&Vg&W6…F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢6öç7Bf—'7D‡VÖäÖF6‚ÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Òf—'7D‡VÖäÖF6ƒòæ–BÇÂçVÆÃ°¢4ôÄõô’æ6†&7FW$–BÒ÷öæVçD6†&7FW$–äÖF6‚†f—'7D‡VÖäÖF6‚Â…TÔåõDõU$äÔTåEôTåE%’“°¢7F'DÖF6„ÖöFR‡F&vWE6WG2Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Òf—'7D‡VÖäÖF6ƒòæ–BÇÂçVÆÃ°¢7FFRçF÷W&æÖVçBç7FvRÒf—'7D‡VÖäÖF6ƒòç&÷VæBÇÂ'&÷VæCb#°¢6öç7BF÷W&æÖVçDÆ&VÂÒvVV¶Ç”6ö×WF—F–öãòææÖRÇÂ†öæUö–çDvÖRò#ö–çBvÖR"¢F÷W&æö’Ö–6ÂG·F&vWE6WG7Ò6WG6“°¢6öç7B7W&f6UFW‡BÒvVV¶Ç”6ö×WF—F–öãòç7W&f6TÆ&VÂò+rG·vVV¶Ç”6ö×WF—F–öâç7W&f6TÆ&VÇÖ¢"#°¢7FFRæÆörçVç6†–gB†G·F÷W&æÖVçDÆ&VÇÒG·7W&f6UFW‡GÒ¢G¶f—'7D‡VÖäÖF6ƒòæÆ&VÂÇÂ%&VÖ–W"F÷W"'Ò6öçG&RG¶6†&7FW$æÖTg&öÔ–B…4ôÄõô’æ6†&7FW$–B—ÒG¶öæUö–çDvÖRò"+rVâ6WVÂö–çBL:–6—6–b"¢"'Òæ“°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ7W'&VçEW6W%F÷W&æÖVçE&æ¶–ær‚’°¢6öç7BW6W$–BÒWF†VçF–6FVEW6W$–B‚“°¢–b‚W6W$–B’&WGW&âçVÆÃ°¢6öç7B6æF–FFW2Ò°¢´UD…õ5DDRævÖWÆ•&æ¶–ærÂUD…õ5DDRævÖWÆ•&æ¶–æuW6W$–EÒÀ¢´UD…õ5DDRç&æ¶–ærÂUD…õ5DDRç&æ¶–æuW6W$–EÒÀ¢´UD…õ5DDRæÆö&'•&æ¶–ærÂUD…õ5DDRæÆö&'•&æ¶–æuW6W$–EÒÀ¢Ó°¢&WGW&â6æF–FFW2æf–æB‚…·&æ¶–ærÂ÷væW$–EÒ’Óâ€¢&æ¶–æp¢bb÷væW$–BÓÓÒW6W$–@¢bb7G&–ær‡&æ¶–æræ7W'&VçEW6W%&æ³òæ–BÇÂ""’ÓÓÒW6W$–@¢’“òå³ÒÇÂçVÆÃ°§Ð ¦gVæ7F–öâ7W'&VçE&æ¶–æuF÷FÅö–çG2‚’°¢6öç7B7W'&VçBÒ7W'&VçEW6W%F÷W&æÖVçE&æ¶–ær‚“òæ7W'&VçEW6W%&æ³°¢&WGW&âçVÖ&W"†7W'&VçCòç66÷&U÷&VbÇÂ“°§Ð ¦gVæ7F–öâ‡VÖä6—&7V—DÆWfVÄ–æfò‡ö–çG2Ò7W'&VçE&æ¶–æuF÷FÅö–çG2‚’’°¢6öç7BF÷FÂÒÖF‚æÖ‚ƒÂçVÖ&W"‡ö–çG2ÇÂ’“°¢&WGW&â…TÔåô4•$5T•EôÄUdTÅ2æf–æB‚†ÆWfVÂ’ÓâF÷FÂãÒÆWfVÂæÖ–âbbF÷FÂÃÒÆWfVÂæÖ‚¢ÇÂ…TÔåô4•$5T•EôÄUdTÅ5³Ó°§Ð ¦gVæ7F–öâ6—&7V—D‡VÖäÆWfVÂ‡ö–çG2Ò7W'&VçE&æ¶–æuF÷FÅö–çG2‚’’°¢6öç7BF÷FÂÒÖF‚æÖ‚ƒÂçVÖ&W"‡ö–çG2ÇÂ’“°¢–b‡F÷FÂÂS’&WGW&â°¢–b‡F÷FÂÂ’&WGW&â#°¢–b‡F÷FÂÂ#S’&WGW&â3°¢–b‡F÷FÂÂS’&WGW&âC°¢–b‡F÷FÂÂƒ’&WGW&âS°¢&WGW&âc°§Ð ¦gVæ7F–öâF÷W&æÖVçE&æ¶–ætVçG&–W2‚’°¢6öç7B&æ¶–ærÒ7W'&VçEW6W%F÷W&æÖVçE&æ¶–ær‚“°¢6öç7B&÷w2Ò²âââ‡&æ¶–æsòçF÷ÇÂµÒ•Ó°¢6öç7B7W'&VçBÒ&æ¶–æsòæ7W'&VçEW6W%&æ³°¢–b†7W'&VçBbb&÷w2ç6öÖR‚‡&÷r’Óâ&÷ræ–BÓÓÒ7W'&VçBæ–B’’&÷w2çW6‚†7W'&VçB“°¢&WGW&â&÷w0¢æÖ‚‡&÷r’Óâ°¢–b‡&÷ræ—5ö’ÇÂ7G&–ær‡&÷ræ–BÇÂ""’ç7F'G5v—F‚‚&“¢"’’°¢&WGW&â°¢VçG'“¢7G&–ær‡&÷ræ–B’ç&WÆ6R‚õæ“¢òÂ""’À¢&æ³¢çVÖ&W"‡&÷rçö–çG5÷&æ²ÇÂ&÷rç&æ²ÇÂ“““’’À¢v÷&ÆE&æ³¢çVÖ&W"‡&÷rçö–çG5÷&æ²ÇÂ&÷rç&æ²ÇÂ“““’’À¢66÷&U&Vc¢çVÖ&W"‡&÷rç66÷&U÷&VbÇÂ’À¢66÷&UvVV³¢çVÖ&W"‡&÷rç66÷&U÷vVV²ÇÂ’À¢66÷&UF÷FÃ¢çVÖ&W"‡&÷rç66÷&U÷F÷FÂÇÂ’À¢&Wf–÷W5vVV³¢çVÖ&W"‡&÷rç66÷&U÷&Wf–÷W5÷vVV²ÇÂ’À¢Ó°¢Ð¢–b„UD…õ5DDRçW6W"bb7G&–ær‡&÷ræ–B’ÓÓÒ7G&–ær„UD…õ5DDRçW6W"æ–B’’°¢&WGW&â°¢VçG'“¢…TÔåõDõU$äÔTåEôTåE%’À¢&æ³¢çVÖ&W"‡&÷rçö–çG5÷&æ²ÇÂ&÷rç&æ²ÇÂ“““’’À¢v÷&ÆE&æ³¢çVÖ&W"‡&÷rçö–çG5÷&æ²ÇÂ&÷rç&æ²ÇÂ“““’’À¢66÷&U&Vc¢çVÖ&W"‡&÷rç66÷&U÷&VbÇÂ’À¢66÷&UvVV³¢çVÖ&W"‡&÷rç66÷&U÷vVV²ÇÂ’À¢66÷&UF÷FÃ¢çVÖ&W"‡&÷rç66÷&U÷F÷FÂÇÂ’À¢&Wf–÷W5vVV³¢çVÖ&W"‡&÷rç66÷&U÷&Wf–÷W5÷vVV²ÇÂ’À¢Ó°¢Ð¢&WGW&âçVÆÃ°¢Ò¢æf–ÇFW"„&ööÆVâ¢ç6÷'B‚†Â"’Óâç&æ²Ò"ç&æ²ÇÂ7G&–ær†æVçG'’’æÆö6ÆT6ö×&R…7G&–ær†"æVçG'’’Â&g""’“°§Ð ¦gVæ7F–öâF÷W&æÖVçD•&æ¶–ætVçG&–W2‚’°¢&WGW&âF÷W&æÖVçE&æ¶–ætVçG&–W2‚¢æf–ÇFW"‚†VçG'’’ÓâVçG'’æVçG'’ÓÒ…TÔåõDõU$äÔTåEôTåE%’¢ç6÷'B‚†Â"’Óâ"ç66÷&U&VbÒç66÷&U&V`¢ÇÂ"ç66÷&UvVV²Òç66÷&UvVV°¢ÇÂ"ç66÷&UF÷FÂÒç66÷&UF÷FÀ¢ÇÂ6†&7FW$æÖTg&öÔ–B†æVçG'’’æÆö6ÆT6ö×&R†6†&7FW$æÖTg&öÔ–B†"æVçG'’’Â&g""’¢æÖ‚†VçG'’Â–æFW‚’Óâ‡²ââæVçG'’Â&æ´–¢–æFW‚²Ò’“°§Ð ¦gVæ7F–öâF÷W&æÖVçE&æ´–†VçG'’’°¢VçG'’ÒF÷W&æÖVçD&6TVçG'’†VçG'’“°¢6öç7B&æ¶VBÒF÷W&æÖVçD•&æ¶–ætVçG&–W2‚“°¢6öç7B7F÷&VBÒ&æ¶VBæf–æB‚†—FVÒ’Óâ—FVÒæVçG'’ÓÓÒVçG'’“òç&æ´–°¢–b‡7F÷&VB’&WGW&â7F÷&VC°¢6öç7BÖ—76–ærÒDõU$äÔTåEô4„$5DU%õôôÀ¢æf–ÇFW"‚†6†&7FW$–B’Óâ&æ¶VBç6öÖR‚†—FVÒ’Óâ—FVÒæVçG'’ÓÓÒ6†&7FW$–B’¢ç6÷'B‚†Â"’Óâ6†&7FW$æÖTg&öÔ–B†’æÆö6ÆT6ö×&R†6†&7FW$æÖTg&öÔ–B†"’Â&g""’“°¢6öç7B–æFW‚ÒÖ—76–æræ–æFW„öb†VçG'’“°¢&WGW&â–æFW‚ãÒò&æ¶VBæÆVæwF‚²–æFW‚²¢“““““°§Ð ¦gVæ7F–öâF÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’†VçG'’’°¢VçG'’ÒF÷W&æÖVçD&6TVçG'’†VçG'’“°¢&WGW&âF÷W&æÖVçE&æ¶–ætVçG&–W2‚’æf–æB‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒVçG'’“òçv÷&ÆE&æ²óòçVÆÃ°§Ð ¦gVæ7F–öâF÷W&æÖVçD†VEFô†VD&öçW2†”6†&7FW$–B’°¢–b‡7FFRçF÷W&æÖVçCòæF–ff–7VÇG’ÓÒ&6—&7V—B"ÇÂ4ô4…ôõD”ôå2æ–æ6ÇVFW2†”6†&7FW$–B’’&WGW&âçVÆÃ°¢6öç7B&öf–ÆRÒUD…õ5DDRç&öf–ÆUW6W$–BÓÓÒWF†VçF–6FVEW6W$–B‚’òUD…õ5DDRç&öf–ÆR¢çVÆÃ°¢6öç7B&÷rÒ‡&öf–ÆSòæ•&W7VÇG2ÇÂµÒ’æf–æB‚‡&W7VÇB’Óâ€¢7G&–ær‡&W7VÇBæ•ö6†&7FW%ö–BÇÂ&W7VÇBæ”6†&7FW$–BÇÂ""’ÓÓÒ7G&–ær†”6†&7FW$–BÇÂ""¢’“°¢–b‚&÷r’&WGW&âçVÆÃ°¢6öç7BG&VæBÒ6öæg&öçFF–öåG&VæB‡&÷r“°¢6öç7B7FGW2Ò6öæg&öçFF–öå7FGW2‡G&VæBÂ6—&7V—D‡VÖäÆWfVÂ‚’“°¢&WGW&â7FGW2ò²ââç7FGW2ÂG&VæBÒ¢çVÆÃ°§Ð ¦gVæ7F–öâ&Wf–÷W5vVV´G–æÖ–4&öçW4–G2‚’°¢&WGW&âF÷W&æÖVçE&æ¶–ætVçG&–W2‚¢æf–ÇFW"‚†VçG'’’ÓâVçG'’æVçG'’ÓÒ…TÔåõDõU$äÔTåEôTåE%¢bbDõU$äÔTåEô4„$5DU%õôôÂæ–æ6ÇVFW2†VçG'’æVçG'’¢bb„•5Dõ$”5õDõU$äÔTåEõÄ”U%2æ–æ6ÇVFW2†VçG'’æVçG'’’¢ç6÷'B‚†Â"’Óâ"ç&Wf–÷W5vVV²Òç&Wf–÷W5vVV²ÇÂç&æ²Ò"ç&æ²ÇÂ7G&–ær†æVçG'’’æÆö6ÆT6ö×&R…7G&–ær†"æVçG'’’Â&g""’¢ç6Æ–6RƒÂ"¢æÖ‚†VçG'’’ÓâVçG'’æVçG'’“°§Ð ¦gVæ7F–öâ&æFöÕ7W&f6T&öçW2‡7W&f6R’°¢6öç7B÷F–öç2Ò5U$d4Uô$ôåU4U5·7W&f6UÒÇÂµÓ°¢&WGW&â÷F–öç5´ÖF‚æfÆö÷"„ÖF‚ç&æFöÒ‚’¢÷F–öç2æÆVæwF‚•ÒÇÂçVÆÃ°§Ð ¦gVæ7F–öâÆÄ6—&7V—E6VVD&öçW6W2‚’°¢&WGW&âö&¦V7BæVçG&–W2…5U$d4Uô$ôåU4U2’æfÆDÖ‚…·7W&f6RÂ&öçW6W5Ò’Óâ€¢&öçW6W2æÖ‚†&öçW2’Óâ‡²ââæ&öçW2Â7W&f6RÒ’¢’“°§Ð ¦gVæ7F–öâöæUö–çE&Wv&D&öçW5ööÂ‚’°¢&WGW&â°¢ââæÆÄ6—&7V—E6VVD&öçW6W2‚’À¢²–C¢'&Wv&D6R"ÂÆ&VÃ¢$6R+r³,:–6—6–öâ"Â&V6—6–öã¢ÒÀ¢²–C¢'&Wv&E6WVVæ6R"ÂÆ&VÃ¢$Væ6†:ææVÖVçB+r³Æ6VÖVçB"ÂÆ6VÖVçC¢ÒÀ¢²–C¢'&Wv&D'VÆÆR"ÂÆ&VÃ¢$'VÆÆR+r³V—76æ6R"Â÷vW#¢ÒÀ¢Ó°§Ð ¦gVæ7F–öâ&æFöÔ6—&7V—D&öçW2†W†6ÇVFVD–G2ÒµÒ’°¢6öç7BW†6ÇVFVBÒæWr6WB†W†6ÇVFVD–G2“°¢&WGW&â6‡VffÆR†ÆÄ6—&7V—E6VVD&öçW6W2‚’’æf–æB‚†&öçW2’ÓâW†6ÇVFVBæ†2†&öçW2æ–B’’ÇÂçVÆÃ°§Ð ¦gVæ7F–öâw&VE&æFöÔ&öçW2‡Æ–W"ÂÆ&VÂÂ&V6öâÂ&VÖ–æ–ætW†6†ævW2ÒçVÆÂ’°¢6öç7BW†6ÇVFVD–G2Ò°¢âââ‡Æ–W"ç7W&f6T&öçW6W2ÇÂµÒ’À¢âââ‡Æ–W"çW&ÖæVçD&öçW6W2ÇÂµÒ’À¢âââ‡Æ–W"çFV×÷&'”&öçW6W2ÇÂµÒ’À¢ÒæÖ‚†&öçW2’Óâ&öçW2ç6÷W&6T&öçW4–BÇÂ&öçW2æ–B“°¢6öç7B6÷W&6RÒ&æFöÔ6—&7V—D&öçW2†W†6ÇVFVD–G2’ÇÂ&æFöÔ6—&7V—D&öçW2‚“°¢–b‚6÷W&6R’&WGW&âçVÆÃ°¢&WGW&â°¢ââç6÷W&6RÀ¢–C¢G¶Æ&VÂçFôÆ÷vW$66R‚’ç&WÆ6R‚õÇ2²örÂ"Ò"—ÒÒG¶7'—Fòç&æFöÕUT”B‚—ÖÀ¢6÷W&6T&öçW4–C¢6÷W&6Ræ–BÀ¢Æ&VÃ¢7G&–ær‡6÷W&6RæÆ&VÂÇÂ""’çFôÆö6ÆTÆ÷vW$66R‚&g""’ç7F'G5v—F‚†Æ&VÂçFôÆö6ÆTÆ÷vW$66R‚&g""’¢ò6÷W&6RæÆ&VÀ¢¢G¶Æ&VÇÒ+rG·6÷W&6RæÆ&VÇÖÀ¢&V6öâÀ¢&VÖ–æ–ætW†6†ævW2À¢Ó°§Ð ¦gVæ7F–öâW'6—7DÖF6…W&ÖæVçDv&B‡Æ–W$–æFW‚Â&öçW2’°¢–b‚&öçW2’&WGW&ã°¢6öç7BÖöÖVçGVÒÒ7FFRç6WDÖF6‚æÖöÖVçGVÓòå·Æ–W$–æFW…Ó°¢–b‚ÖöÖVçGVÒ’&WGW&ã°¢ÖöÖVçGVÒçW&ÖæVçDv&G2Ò²âââ†ÖöÖVçGVÒçW&ÖæVçDv&G2ÇÂµÒ’Â6ÆöæTFF†&öçW2•Ó°¢7FFRçÆ–W'5·Æ–W$–æFW…ÒçW&ÖæVçD&öçW6W2çW6‚†6ÆöæTFF†&öçW2’“°§Ð ¦gVæ7F–öâÇ”Ö÷F—fF–öä&öçW2‚’°¢–b‡7FFRçF÷W&æÖVçCòæöæUö–çDvÖRbb7FFRçF÷W&æÖVçCòæ&öçW4ÆWfVÂÓÓÒ'&Wv&B"’&WGW&ã°¢6öç7B&æ·2Ò7FFRçÆ–W'2æÖ‚‡Æ–W"’ÓâçVÖ&W"‡Æ–W"çv÷&ÆE&æ²ÇÂ’ÇÂçVÆÂ“°¢–b‚&æ·5³ÒÇÂ&æ·5³ÒÇÂ&æ·5³ÒÓÓÒ&æ·5³Ò’&WGW&ã°¢6öç7BÆW75vVÆÅ&æ¶VBÒ&æ·5³Òâ&æ·5³Òò¢°¢6öç7BÖöÖVçGVÒÒ7FFRç6WDÖF6‚æÖöÖVçGVÓòå¶ÆW75vVÆÅ&æ¶VEÓ°¢–b‚ÖöÖVçGVÒÇÂÖöÖVçGVÒæÖ÷F—fF–öå&W6öÇfVB’&WGW&ã°¢ÖöÖVçGVÒæÖ÷F—fF–öå&W6öÇfVBÒG'VS°¢–b„ÖF‚ç&æFöÒ‚’ãÒãR’&WGW&ã°¢6öç7B&öçW2Òw&VE&æFöÔ&öçW2€¢7FFRçÆ–W'5¶ÆW75vVÆÅ&æ¶VEÒÀ¢$Ö÷F—fF–öâ"À¢$¦÷VWW"Öö–ç2&–Vâ6Æ7<:’"À¢“°¢W'6—7DÖF6…W&ÖæVçDv&B†ÆW75vVÆÅ&æ¶VBÂ&öçW2“°§Ð ¦gVæ7F–öâÇ”‡VÖä66VæFçD&öçW2‚’°¢–b‚4ôÄõô’æVæ&ÆVBÇÂ4U%dU%õ5”ä2æVæ&ÆVBÇÂ7FFRçF÷W&æÖVçBæ7F—fRÇÂ7FFRçF÷W&æÖVçBæF–ff–7VÇG’ÓÒ&6—&7V—B"’&WGW&ã°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDvÖRbb7FFRçF÷W&æÖVçBæ&öçW4ÆWfVÂÓÓÒ'&Wv&B"’&WGW&ã°¢6öç7B†VEFô†VBÒF÷W&æÖVçD†VEFô†VD&öçW2‡7FFRçÆ–W'5³Òæ6†&7FW$–B“°¢6öç7BF&vWD–æFW‚Ò†VEFô†VCòçF&vWBÓÓÒ&’"ò¢°¢6öç7BÖöÖVçGVÒÒ7FFRç6WDÖF6‚æÖöÖVçGVÓòå·F&vWD–æFW…Ó°¢–b‚ÖöÖVçGVÒÇÂÖöÖVçGVÒæ66VæFçE&W6öÇfVB’&WGW&ã°¢ÖöÖVçGVÒæ66VæFçE&W6öÇfVBÒG'VS°¢6öç7B&öçW46÷VçBÒçVÖ&W"††VEFô†VCòæ&öçW46÷VçBÇÂ“°¢f÷"†ÆWB–æFW‚Ò²–æFW‚Â&öçW46÷VçC²–æFW‚³Ò’°¢6öç7BF&vWBÒ7FFRçÆ–W'5·F&vWD–æFW…Ó°¢6öç7B&öçW2Òw&VE&æFöÔ&öçW2€¢F&vWBÀ¢†VEFô†VBæÆ&VÂÀ¢G¶†VEFô†VBæÆ&VÇÒ+rG¶†VEFô†VBçG&VæGÖÀ¢“°¢W'6—7DÖF6…W&ÖæVçDv&B‡F&vWD–æFW‚Â&öçW2“°¢Ð§Ð ¦gVæ7F–öâFD6—&7V—D&öçW2‡F&vWBÂVçG'’Â&öçW2’°¢–b‚VçG'’ÇÂ&öçW2’&WGW&ã°¢F&vWE¶VçG'•ÒÒ²âââ‡F&vWE¶VçG'•ÒÇÂµÒ’Â²ââæ&öçW2ÕÓ°§Ð ¦gVæ7F–öâ'V–ÆD6—&7V—E&ô&öçW6W2†VçG&–W2ÒµÒÂ6VVFVDVçG&–W2ÒµÒÂ7W&f6RÒçVÆÂ’°¢6öç7B&W6VçD’Ò²ââææWr6WB†VçG&–W2æf–ÇFW"‚†VçG'’’ÓâVçG'’bbVçG'’ÓÒ…TÔåõDõU$äÔTåEôTåE%’’•Ó°¢6öç7B&æ¶VD’Ò&æ¶VD•F÷W&æÖVçDVçG&–W2‡&W6VçD’“°¢6öç7BF÷6VVG2Ò²ââææWr6WB‡6VVFVDVçG&–W2æf–ÇFW"‚†VçG'’’Óâ&W6VçD’æ–æ6ÇVFW2†VçG'’’’•Òç6Æ–6RƒÂ"“°¢f÷"†6öç7BVçG'’öb&æ¶VD’’°¢–b‡F÷6VVG2æÆVæwF‚ãÒ"’'&V³°¢–b‚F÷6VVG2æ–æ6ÇVFW2†VçG'’’’F÷6VVG2çW6‚†VçG'’“°¢Ð¢6öç7B6—&7V—E7W&f6RÒ5U$d4Uô$ôåU4U5·7W&f6UÐ¢ò7W&f6P¢¢6‡VffÆR„ö&¦V7Bæ¶W—2…5U$d4Uô$ôåU4U2’•³ÒÇÂ&†&B#°¢6öç7B&öçW6W2Ò·Ó° ¢f÷"†6öç7BVçG'’öbF÷6VVG2’°¢6öç7B7W&f6T&öçW2Ò&æFöÕ7W&f6T&öçW2†6—&7V—E7W&f6R“°¢FD6—&7V—D&öçW2†&öçW6W2ÂVçG'’Â7W&f6T&öçW2ò²ââç7W&f6T&öçW2Â7W&f6S¢6—&7V—E7W&f6RÒ¢çVÆÂ“°¢–b„ÖF‚ç&æFöÒ‚’ÂãR’°¢FD6—&7V—D&öçW2†&öçW6W2ÂVçG'’Â&æFöÔ6—&7V—D&öçW2‚†&öçW6W5¶VçG'•ÒÇÂµÒ’æÖ‚†&öçW2’Óâ&öçW2æ–B’’“°¢Ð¢Ð ¢f÷"†6öç7BVçG'’öb&æ¶VD’æf–ÇFW"‚†VçG'’’ÓâF÷6VVG2æ–æ6ÇVFW2†VçG'’’’ç6Æ–6RƒÂb’’°¢–b„ÖF‚ç&æFöÒ‚’ÂãR’FD6—&7V—D&öçW2†&öçW6W2ÂVçG'’Â&æFöÔ6—&7V—D&öçW2‚’“°¢Ð ¢6öç7Bv÷&ÆDçVÖ&W$öæRÒF÷W&æÖVçD•&æ¶–ætVçG&–W2‚’æf–æB‚†VçG'’’ÓâVçG'’ç&æ´–ÓÓÒ“òæVçG'’ÇÂçVÆÃ°¢–b‡v÷&ÆDçVÖ&W$öæRbb&W6VçD’æ–æ6ÇVFW2‡v÷&ÆDçVÖ&W$öæR’bb†&öçW6W5·v÷&ÆDçVÖ&W$öæUÒÇÂµÒ’æÆVæwF‚Â"’°¢FD6—&7V—D&öçW2€¢&öçW6W2À¢v÷&ÆDçVÖ&W$öæRÀ¢&æFöÔ6—&7V—D&öçW2‚†&öçW6W5·v÷&ÆDçVÖ&W$öæUÒÇÂµÒ’æÖ‚†&öçW2’Óâ&öçW2æ–B’’À¢“°¢Ð¢&WGW&â²&öçW6W2Â7W&f6S¢6—&7V—E7W&f6RÂF÷6VVG2Ó°§Ð ¦gVæ7F–öâ'V–ÆEvVV¶Ç”6—&7V—E&ô&öçW6W2†VçG&–W2ÒµÒÂ6VVDVçG&–W2ÒµÒÂ7W&f6RÒ&†&B"Â‡VÖäÆWfVÂÒ’°¢6öç7B&W6VçBÒæWr6WB†VçG&–W2æf–ÇFW"„&ööÆVâ’“°¢6öç7BF÷6VVG2Ò6VVDVçG&–W2æf–ÇFW"‚†VçG'’’Óâ&W6VçBæ†2†VçG'’’’ç6Æ–6RƒÂB“°¢6öç7B&öçW6W2Ò·Ó°¢f÷"†6öç7B·6VVD–æFW‚ÂVçG'•ÒöbF÷6VVG2æVçG&–W2‚’’°¢–b†VçG'’ÓÓÒ…TÔåõDõU$äÔTåEôTåE%’’6öçF–çVS°¢6öç7B7W&f6T&öçW2Ò&æFöÕ7W&f6T&öçW2‡7W&f6R“°¢FD6—&7V—D&öçW2†&öçW6W2ÂVçG'’Â7W&f6T&öçW2ò²ââç7W&f6T&öçW2Â7W&f6RÒ¢çVÆÂ“°¢–b†‡VÖäÆWfVÂãÒ2bb6VVD–æFW‚Â"bbÖF‚ç&æFöÒ‚’ÂãsR’°¢FD6—&7V—D&öçW2€¢&öçW6W2À¢VçG'’À¢&æFöÔ6—&7V—D&öçW2‚†&öçW6W5¶VçG'•ÒÇÂµÒ’æÖ‚†&öçW2’Óâ&öçW2æ–B’’À¢“°¢Ð¢–b†‡VÖäÆWfVÂãÒ2bb6VVD–æFW‚Â"bbÖF‚ç&æFöÒ‚’ÂãR’°¢FD6—&7V—D&öçW2€¢&öçW6W2À¢VçG'’À¢&æFöÔ6—&7V—D&öçW2‚†&öçW6W5¶VçG'•ÒÇÂµÒ’æÖ‚†&öçW2’Óâ&öçW2æ–B’’À¢“°¢ÒVÇ6R–b†‡VÖäÆWfVÂÂ2bbÖF‚ç&æFöÒ‚’ÂãR’°¢FD6—&7V—D&öçW2€¢&öçW6W2À¢VçG'’À¢&æFöÔ6—&7V—D&öçW2‚†&öçW6W5¶VçG'•ÒÇÂµÒ’æÖ‚†&öçW2’Óâ&öçW2æ–B’’À¢“°¢Ð¢Ð¢–b†‡VÖäÆWfVÂãÒ2’°¢f÷"†6öç7BVçG'’öbVçG&–W2ç6Æ–6RƒRÂ’’æf–ÇFW"‚†6æF–FFR’Óâ6æF–FFRbb6æF–FFRÓÒ…TÔåõDõU$äÔTåEôTåE%’’’°¢–b„ÖF‚ç&æFöÒ‚’ÂãR’FD6—&7V—D&öçW2†&öçW6W2ÂVçG'’Â&æFöÔ6—&7V—D&öçW2‚’“°¢Ð¢Ð¢&WGW&â²&öçW6W2Â7W&f6RÂF÷6VVG2Ó°§Ð ¦gVæ7F–öâ”6—&7V—EW&f÷&Öæ6U&æ²†VçG'’’°¢6öç7B&æ´–ÒF÷W&æÖVçE&æ´–†VçG'’“°¢&WGW&â&æ´–Â““““’ò&æ´–¢çVÆÃ°§Ð ¦gVæ7F–öâ'V–ÆD”6ÇV$†÷W6T&öçW6W2†VçG&–W2ÒµÒÂ&öçW4ÆWfVÂÒ&æöæR"’°¢6öç7B&öçW6W2Ò·Ó°¢6öç7B&öçW46÷VçBÒ”&öçW46÷VçB†&öçW4ÆWfVÂ“°¢–b‚&öçW46÷VçB’&WGW&â&öçW6W3°¢6öç7B”VçG&–W2Ò²ââææWr6WB†VçG&–W2æf–ÇFW"‚†VçG'’’ÓâVçG'’bbVçG'’ÓÒ…TÔåõDõU$äÔTåEôTåE%’’•Ó°¢f÷"†6öç7BVçG'’öb”VçG&–W2’°¢&öçW6W5¶VçG'•ÒÒ6‡VffÆR†ÆÄ6—&7V—E6VVD&öçW6W2‚’’ç6Æ–6RƒÂ&öçW46÷VçB“°¢Ð¢&WGW&â&öçW6W3°§Ð ¦gVæ7F–öâ&æFöÔ†—7F÷&–5W&ÖæVçD&öçW2‚’°¢6öç7B&öçW2Ò„•5Dõ$”5õU$ÔäTåEô$ôåU4U5´ÖF‚æfÆö÷"„ÖF‚ç&æFöÒ‚’¢„•5Dõ$”5õU$ÔäTåEô$ôåU4U2æÆVæwF‚•Ó°¢&WGW&â&öçW2ò²ââæ&öçW2Ò¢çVÆÃ°§Ð ¦gVæ7F–öâ'V–ÆD†—7F÷&–5W&ÖæVçD&öçW6W2†VçG&–W2ÒµÒ’°¢6öç7B&öçW6W2Ò·Ó°¢f÷"†6öç7BVçG'’öbVçG&–W2’°¢6öç7B6†&7FW$–BÒF÷W&æÖVçDVçG'”6†&7FW$–B†VçG'’“°¢–b‚„•5Dõ$”5õDõU$äÔTåEõÄ”U%2æ–æ6ÇVFW2†6†&7FW$–B’’6öçF–çVS°¢6öç7B&öçW2Ò&æFöÔ†—7F÷&–5W&ÖæVçD&öçW2‚“°¢–b†&öçW2’&öçW6W5¶6†&7FW$–EÒÒ¶&öçW5Ó°¢Ð¢&WGW&â&öçW6W3°§Ð ¦gVæ7F–öâFEW&ÖæVçD&öçW2‡F&vWBÂVçG'’Â&öçW2’°¢–b‚VçG'’ÇÂ&öçW2’&WGW&ã°¢F&vWE¶VçG'•ÒÒ²âââ‡F&vWE¶VçG'•ÒÇÂµÒ’Â²ââæ&öçW2ÕÓ°§Ð ¦gVæ7F–öâ'V–ÆD6—&7V—E6VVEW&ÖæVçD&öçW6W2‡6VVDVçG&–W2ÒµÒ’°¢6öç7B&öçW6W2Ò·Ó°¢f÷"†6öç7BVçG'’öb6VVDVçG&–W2ç6Æ–6RƒÂB’’°¢–b‚VçG'’ÇÂVçG'’ÓÓÒ…TÔåõDõU$äÔTåEôTåE%’ÇÂÖF‚ç&æFöÒ‚’ãÒãR’6öçF–çVS°¢FEW&ÖæVçD&öçW2†&öçW6W2ÂVçG'’Â°¢–C¢&6—&7V—E6VVE&V6—6–öåÆ6VÖVçB"À¢Æ&VÃ¢%L:§FRFR<:—&–R”¢³,:–6—6–öâò³Æ6VÖVçB"À¢&V6—6–öã¢À¢Æ6VÖVçC¢À¢Ò“°¢Ð¢&WGW&â&öçW6W3°§Ð ¦gVæ7F–öâ'V–ÆEF÷W&æÖVçEW&ÖæVçD&öçW6W2†VçG&–W2ÒµÒÂ6VVFVDVçG&–W2ÒµÒÂG–æÖ–4&öçW4–G2ÒµÒ’°¢6öç7B&öçW6W2Ò·Ó°¢6öç7B&æ¶VBÒF÷W&æÖVçE&æ¶–ætVçG&–W2‚“°¢6öç7Bv÷&ÆDÆVFW"Ò&æ¶VBæf–æB‚†VçG'’’ÓâVçG'’ç&æ²ÓÓÒ“òæVçG'’ÇÂçVÆÃ°¢6öç7B6VVFVBÒæWr6WB‡6VVFVDVçG&–W2“°¢6öç7BW6VDVçG&–W2ÒæWr6WB†VçG&–W2æf–ÇFW"„&ööÆVâ’“° ¢–b‡v÷&ÆDÆVFW"bbv÷&ÆDÆVFW"ÓÒ…TÔåõDõU$äÔTåEôTåE%’bbW6VDVçG&–W2æ†2‡v÷&ÆDÆVFW"’bb6VVFVBæ†2‡v÷&ÆDÆVFW"’’°¢FEW&ÖæVçD&öçW2†&öçW6W2Âv÷&ÆDÆVFW"Â°¢–C¢'v÷&ÆDçVÖ&W$öæUW&ÖæVçB"À¢Æ&VÃ¢$çVÜ:—&òÖöæF–Â¢³",:–6—6–öâò³"Æ6VÖVçB"À¢&V6—6–öã¢"À¢Æ6VÖVçC¢"À¢Ò“°¢Ð ¢f÷"†6öç7BVçG'’öb6VVFVDVçG&–W2’°¢–b†VçG'’ÓÓÒ…TÔåõDõU$äÔTåEôTåE%’’6öçF–çVS°¢FEW&ÖæVçD&öçW2†&öçW6W2ÂVçG'’Â°¢–C¢'6VVFVEW&ÖæVçB"À¢Æ&VÃ¢%L:§FRFR<:—&–R¢³,:–6—6–öâò³Æ6VÖVçB"À¢&V6—6–öã¢À¢Æ6VÖVçC¢À¢Ò“°¢Ð ¢f÷"†6öç7BVçG'’öbW6VDVçG&–W2’°¢–b†VçG'’ÓÓÒ…TÔåõDõU$äÔTåEôTåE%’’6öçF–çVS°¢6öç7B6†&7FW$–BÒVçG'’ÓÓÒ…TÔåõDõU$äÔTåEôTåE%’ò6VÆV7FVD6†&7FW$–B‚’¢VçG'“°¢6öç7BVÆ–v–&ÆT†—7F÷&–2Ò„•5Dõ$”5õDõU$äÔTåEõÄ”U%2æ–æ6ÇVFW2†6†&7FW$–B“°¢6öç7BVÆ–v–&ÆTÖöÖVçGVÒÒG–æÖ–4&öçW4–G2æ–æ6ÇVFW2†VçG'’“°¢–b‚‚VÆ–v–&ÆT†—7F÷&–2bbVÆ–v–&ÆTÖöÖVçGVÒ’ÇÂVçG'’ÓÓÒv÷&ÆDÆVFW"ÇÂ6VVFVBæ†2†VçG'’’’6öçF–çVS°¢6öç7B&öçW2Ò&æFöÔ†—7F÷&–5W&ÖæVçD&öçW2‚“°¢–b†&öçW2’FEW&ÖæVçD&öçW2†&öçW6W2ÂVçG'’Â&öçW2“°¢Ð¢&WGW&â&öçW6W3°§Ð ¦gVæ7F–öâFDG–æÖ–5W&ÖæVçD&öçW6W2‡W&ÖæVçD&öçW6W2ÂG–æÖ–4&öçW4–G2ÒµÒ’°¢6öç7B&öçW6W2Ò6ÆöæTFF‡W&ÖæVçD&öçW6W2ÇÂ·Ò“°¢f÷"†6öç7B6†&7FW$–BöbG–æÖ–4&öçW4–G2’°¢–b‚6†&7FW$–BÇÂ6†&7FW$–BÓÓÒ…TÔåõDõU$äÔTåEôTåE%’’6öçF–çVS°¢&öçW6W5¶6†&7FW$–EÒÒ°¢âââ†&öçW6W5¶6†&7FW$–EÒÇÂµÒ’À¢°¢–C¢'&Wf–÷W5vVV´ÖöÖVçGVÒ"À¢Æ&VÃ¢$G–æÖ—VR"À¢FW67&—F–öã¢%F÷B6VÖ–æR&V6VFVçFR¢³&V6—6–öâ"À¢&V6—6–öã¢À¢ÒÀ¢Ó°¢Ð¢&WGW&â&öçW6W3°§Ð ¦gVæ7F–öâ'V–ÆEvVV¶Ç•7W&f6T&öçW6W2‡7W&f6RÂ6VVFVD6†&7FW'2’°¢6öç7B&öçW6W2Ò·Ó°¢f÷"†6öç7B6†&7FW$–Böb6VVFVD6†&7FW'2’°¢6öç7B&öçW2Ò&æFöÕ7W&f6T&öçW2‡7W&f6R“°¢–b†&öçW2’&öçW6W5¶6†&7FW$–EÒÒ²ââæ&öçW2Â7W&f6RÓ°¢Ð¢&WGW&â&öçW6W3°§Ð ¦gVæ7F–öâ6÷'EF÷W&æÖVçDVçG&–W4'•v÷&ÆE&æ²†VçG&–W2ÒµÒ’°¢&WGW&â²ââæVçG&–W5Òç6÷'B‚†Â"’Óâ°¢6öç7B&æ´F–ffW&Væ6RÒ‡F÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’†’óò““““’’Ò‡F÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’†"’óò““““’“°¢–b‡&æ´F–ffW&Væ6R’&WGW&â&æ´F–ffW&Væ6S°¢&WGW&âF÷W&æÖVçEÆ–W$Æ&VÂ†’æÆö6ÆT6ö×&R‡F÷W&æÖVçEÆ–W$Æ&VÂ†"’Â&g""“°¢Ò“°§Ð ¦gVæ7F–öâF÷W&æÖVçE÷6—F–öäÖ‡÷6—F–öç2ÒµÒ’°¢&WGW&âö&¦V7Bæg&öÔVçG&–W2‡÷6—F–öç0¢æÖ‚†VçG'’Â÷6—F–öâ’ÓâVçG'’ò¶VçG'’Â÷6—F–öåÒ¢çVÆÂ¢æf–ÇFW"„&ööÆVâ’“°§Ð ¦gVæ7F–öâ'V–ÆEF÷W&æÖVçE&÷VæCe÷6—F–öç2†‡VÖä6†&7FW$–BÂ7W&f6RÒ&†&B"Âö–çG2Ò7W'&VçE&æ¶–æuF÷FÅö–çG2‚’’°¢6öç7B‡VÖäÆWfVÂÒ6—&7V—D‡VÖäÆWfVÂ‡ö–çG2“°¢6öç7B÷6—F–öç2Ò'&’ƒr’æf–ÆÂ†çVÆÂ“°¢6öç7B&æ¶VD’Ò&æ¶VD•F÷W&æÖVçDVçG&–W2…DõU$äÔTåEô4„$5DU%õôôÂ“° ¢–b†‡VÖäÆWfVÂÓÓÒ’°¢6öç7B&÷7FW"Ò´…TÔåõDõU$äÔTåEôTåE%’Âââç6‡VffÆR‡&æ¶VD’’ç6Æ–6RƒÂR•Ó°¢6öç7B&æ¶VE&÷7FW"Ò6÷'EF÷W&æÖVçDVçG&–W4'•v÷&ÆE&æ²‡&÷7FW"“°¢&æ¶VE&÷7FW"ç6Æ–6RƒÂB’æf÷$V6‚‚†VçG'’Â–æFW‚’Óâ²÷6—F–öç5¶–æFW‚²ÒÒVçG'“²Ò“°¢6‡VffÆR‡&æ¶VE&÷7FW"ç6Æ–6RƒB’’æf÷$V6‚‚†VçG'’Â–æFW‚’Óâ²÷6—F–öç5¶–æFW‚²UÒÒVçG'“²Ò“°¢ÒVÇ6R°¢6öç7B7V6–Æ—7D6æF–FFW2Ò&æ¶VD’æf–ÇFW"‚†VçG'’’Óâ•õ5U$d4Uõ$TdU$Tä4U5¶VçG'•ÒÓÓÒ7W&f6R’ç6Æ–6RƒÂ"“°¢6öç7B÷F†W$6æF–FFW2Ò&æ¶VD’æf–ÇFW"‚†VçG'’’Óâ•õ5U$d4Uõ$TdU$Tä4U5¶VçG'•ÒÓÒ7W&f6R’ç6Æ–6RƒÂ"“°¢6öç7Bw&÷WöæRÒ6÷'EF÷W&æÖVçDVçG&–W4'•v÷&ÆE&æ²…°¢ââç7V6–Æ—7D6æF–FFW2À¢ââæ÷F†W$6æF–FFW2À¢…TÔåõDõU$äÔTåEôTåE%’À¢Ò“°¢w&÷WöæRç6Æ–6RƒÂB’æf÷$V6‚‚†VçG'’Â–æFW‚’Óâ²÷6—F–öç5¶–æFW‚²ÒÒVçG'“²Ò“° ¢6öç7BF÷6VVE6WBÒæWr6WB‡÷6—F–öç2ç6Æ–6RƒÂR’æf–ÇFW"„&ööÆVâ’“°¢6öç7Bw&÷WGvõööÂÒ&æ¶VD’æf–ÇFW"‚†VçG'’’ÓâF÷6VVE6WBæ†2†VçG'’’’ç6Æ–6RƒÂb“°¢6öç7Bw&÷WGvòÒF÷6VVE6WBæ†2„…TÔåõDõU$äÔTåEôTåE%’¢ò6‡VffÆR†w&÷WGvõööÂ’ç6Æ–6RƒÂR¢¢²ââç6‡VffÆR†w&÷WGvõööÂ’ç6Æ–6RƒÂB’Â…TÔåõDõU$äÔTåEôTåE%•Ó°¢6÷'EF÷W&æÖVçDVçG&–W4'•v÷&ÆE&æ²†w&÷WGvò’ç6Æ–6RƒÂB¢æf÷$V6‚‚†VçG'’Â–æFW‚’Óâ²÷6—F–öç5¶–æFW‚²UÒÒVçG'“²Ò“° ¢6öç7BÆ6VBÒæWr6WB‡÷6—F–öç2ç6Æ–6RƒÂ’’æf–ÇFW"„&ööÆVâ’“°¢6öç7B&VÖ–æ–æt’Ò&æ¶VD’æf–ÇFW"‚†VçG'’’ÓâÆ6VBæ†2†VçG'’’“°¢6öç7Bf–æÄw&÷WÒÆ6VBæ†2„…TÔåõDõU$äÔTåEôTåE%’¢ò6‡VffÆR‡&VÖ–æ–æt’’ç6Æ–6RƒÂ‚¢¢´…TÔåõDõU$äÔTåEôTåE%’Âââç6‡VffÆR‡&VÖ–æ–æt’’ç6Æ–6RƒÂr•Ó°¢6‡VffÆR†f–æÄw&÷W’æf÷$V6‚‚†VçG'’Â–æFW‚’Óâ²÷6—F–öç5¶–æFW‚²•ÒÒVçG'“²Ò“°¢Ð ¢6öç7B6VVDVçG&–W2Ò÷6—F–öç2ç6Æ–6RƒÂR“°¢&WGW&â°¢÷6—F–öç2À¢6VVFVD†—7F÷&–73¢6VVDVçG&–W2æf–ÇFW"‚†VçG'’’ÓâVçG'’ÓÒ…TÔåõDõU$äÔTåEôTåE%’’À¢6VVDVçG&–W2À¢6VVDçVÖ&W'3¢ö&¦V7Bæg&öÔVçG&–W2‡6VVDVçG&–W2æÖ‚†VçG'’Â–æFW‚’Óâ¶VçG'’Â–æFW‚²Ò’’À¢÷6—F–öä'”VçG'“¢F÷W&æÖVçE÷6—F–öäÖ‡÷6—F–öç2’À¢‡VÖäÆWfVÂÀ¢‡VÖä6†&7FW$–BÀ¢Ó°§Ð ¦gVæ7F–öâ7F'EvVV¶Ç•F÷W&æÖVçDÖöFR‡F&vWE6WG2ÂvVV¶Ç”6ö×WF—F–öâÂ‡VÖä6†&7FW$–B’°¢6öç7B7W&f6RÒvVV¶Ç”6ö×WF—F–öâç7W&f6RÇÂ&†&B#°¢Ç•7W&f6T&6¶w&÷VæB‡7W&f6R“°¢6öç7B°¢÷6—F–öç2À¢6VVDVçG&–W2À¢6VVDçVÖ&W'2À¢÷6—F–öä'”VçG'’À¢‡VÖäÆWfVÂÀ¢ÒÒ'V–ÆEF÷W&æÖVçE&÷VæCe÷6—F–öç2†‡VÖä6†&7FW$–BÂ7W&f6R“°¢4ôÄõô’æF–ff–7VÇG’Ò&6—&7V—B#°¢6öç7B6—&7V—D&öçW56WGWÒ'V–ÆEvVV¶Ç”6—&7V—E&ô&öçW6W2‡÷6—F–öç2Â6VVDVçG&–W2Â7W&f6RÂ‡VÖäÆWfVÂ“°¢6öç7B7W&f6T&öçW6W2Ò6—&7V—D&öçW56WGWæ&öçW6W3°¢6öç7B”–çFVÆÆ–vVæ6TÆWfVÇ2Ò'V–ÆEF÷W&æÖVçD”–çFVÆÆ–vVæ6TÆWfVÇ2‡÷6—F–öç2Â&6—&7V—B"Â²‡VÖäÆWfVÂÒ“°¢6öç7BG–æÖ–4&öçW4–G2ÒµÓ°¢6öç7BW&ÖæVçD&öçW6W2Ò'V–ÆD6—&7V—E6VVEW&ÖæVçD&öçW6W2‡6VVDVçG&–W2“°¢7FFRçF÷W&æÖVçBÒ°¢7F—fS¢G'VRÀ¢f—6–&ÆS¢fÇ6RÀ¢'&6¶WCc¢G'VRÀ¢F–ff–7VÇG“¢&6—&7V—B"À¢”–çFVÆÆ–vVæ6TÆWfVÇ2À¢vVV¶Ç“¢G'VRÀ¢6ö×WF—F–öä–C¢vVV¶Ç”6ö×WF—F–öâæ–BÀ¢6ö×WF—F–öäæÖS¢vVV¶Ç”6ö×WF—F–öâææÖRÀ¢6ö×WF—F–öä6—G“¢vVV¶Ç”6ö×WF—F–öâæ6—G’À¢6ö×WF—F–öä6÷VçG'“¢vVV¶Ç”6ö×WF—F–öâæ6÷VçG'’À¢6ö×WF—F–öäfÆs¢vVV¶Ç”6ö×WF—F–öâæfÆrÀ¢6ö×WF—F–öå7W&f6S¢vVV¶Ç”6ö×WF—F–öâç7W&f6RÀ¢6ö×WF—F–öå7W&f6TÆ&VÃ¢vVV¶Ç”6ö×WF—F–öâç7W&f6TÆ&VÂÀ¢6ö×WF—F–öå6V6öã¢çVÖ&W"„UD…õ5DDRæ6ö×WF—F–öç3òç6V6öâÇÂ’À¢6ö×WF—F–öåvVV³¢çVÖ&W"„UD…õ5DDRæ6ö×WF—F–öç3òçvVV²ÇÂ’À¢6ö×WF—F–öåö–çG3¢vVV¶Ç”6ö×WF—F–öâçö–çG2À¢ÖF6„&öçW5ö–çG3¢À¢ÖF6„&öçW4FWF–Ç3¢µÒÀ¢ö–çG5&V6÷&FVC¢fÇ6RÀ¢7FvS¢'vVV¶Ç’"À¢F&vWE6WG2À¢‡VÖä6†&7FW$–BÀ¢‡VÖäæ–6¶æÖS¢æ–6¶æÖUfÇVR‚’À¢‡VÖäVçG'“¢…TÔåõDõU$äÔTåEôTåE%’À¢”f–æÆ—7D6†&7FW$–C¢çVÆÂÀ¢7W'&VçDÖF6ƒ¢çVÆÂÀ¢æW‡D‡VÖäÖF6„–C¢çVÆÂÀ¢6†×–öä6†&7FW$–C¢çVÆÂÀ¢vVV¶Ç•÷6—F–öç3¢÷6—F–öç2À¢F÷W&æÖVçE÷6—F–öç3¢÷6—F–öä'”VçG'’À¢F÷W&æÖVçE6VVDçVÖ&W'3¢6VVDçVÖ&W'2À¢‡VÖä6—&7V—DÆWfVÃ¢‡VÖäÆWfVÂÀ¢6—&7V—D&öçW57W&f6S¢6—&7V—D&öçW56WGWç7W&f6RÀ¢7W&f6T&öçW6W2À¢W&ÖæVçD&öçW6W2À¢6VVFVD6†&7FW'3¢6VVDVçG&–W2À¢G–æÖ–4&öçW4–G2À¢ÖF6†W3¢µÒÀ¢Ó°¢7FFRçF÷W&æÖVçBæÖF6†W2Ò'V–ÆEvVV¶Ç•F÷W&æÖVçDÖF6†W2‡÷6—F–öç2Â…TÔåõDõU$äÔTåEôTåE%’ÂF&vWE6WG2“°¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢ÆWBf—'7D‡VÖäÖF6‚ÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Òf—'7D‡VÖäÖF6ƒòæ–BÇÂçVÆÃ°¢4ôÄõô’æ6†&7FW$–BÒ÷öæVçD6†&7FW$–äÖF6‚†f—'7D‡VÖäÖF6‚Â…TÔåõDõU$äÔTåEôTåE%’“°¢7F'DÖF6„ÖöFR‡F&vWE6WG2Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢7FFRçF÷W&æÖVçBç7FvRÒf—'7D‡VÖäÖF6ƒòç&÷VæBÇÂ'vVV¶Ç’#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Òf—'7D‡VÖäÖF6ƒòæ–BÇÂçVÆÃ°¢7FFRæÆörçVç6†–gB†G·vVV¶Ç”6ö×WF—F–öâææÖWÒG·vVV¶Ç”6ö×WF—F–öâç7W&f6TÆ&VÇÒ¢†RFRf–æÆR6öçG&RG¶6†&7FW$æÖTg&öÔ–B…4ôÄõô’æ6†&7FW$–B—Òæ“°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ'V–ÆEvVV¶Ç•F÷W&æÖVçDÖF6†W2‡÷6—F–öç2Â‡VÖäVçG'’ÂF&vWE6WG2’°¢6öç7BÖF6‚Ò†–BÂÆ&VÂÂ&÷VæBÂÆ–W$ÂÆ–W$"’Óâ‡°¢–BÀ¢Æ&VÂÀ¢&÷VæBÀ¢Æ–W$À¢Æ–W$"À¢÷6—F–öä¢7FFRçF÷W&æÖVçCòçF÷W&æÖVçE÷6—F–öç3òå·Æ–W$ÒóòçVÆÂÀ¢÷6—F–öä#¢7FFRçF÷W&æÖVçCòçF÷W&æÖVçE÷6—F–öç3òå·Æ–W$%ÒóòçVÆÂÀ¢v–ææW#¢çVÆÂÀ¢66÷&S¢çVÆÂÀ¢Æ—fU66÷&S¢çVÆÂÀ¢Æ–&ÆS¢Æ–W$ÓÓÒ‡VÖäVçG'’ÇÂÆ–W$"ÓÓÒ‡VÖäVçG'’À¢6–×VÆFVC¢Æ–W$ÓÒ‡VÖäVçG'’bbÆ–W$"ÓÒ‡VÖäVçG'’À¢†–FFVåv–ææW#¢çVÆÂÀ¢†–FFVå6WE66÷&W3¢çVÆÂÀ¢&WfVÆVE6WE66÷&W3¢µÒÀ¢Ò“°¢6öç7B6—¦RÒ÷6—F–öç2æÆVæwF‚Ò°¢6öç7B&÷VæG2Ò6—¦RÓÓÒ3 ¢ò·²¶W“¢'&÷VæC3""Â&Vf—ƒ¢'#3""ÂÆ&VÃ¢#fRFRf–æÆR"Â6÷VçC¢bÒÂ²¶W“¢'&÷VæCb"Â&Vf—ƒ¢'#b"ÂÆ&VÃ¢#†RFRf–æÆR"Â6÷VçC¢‚ÕÐ¢¢6—¦RÓÓÒ`¢ò·²¶W“¢'&÷VæCb"Â&Vf—ƒ¢'#b"ÂÆ&VÃ¢#†RFRf–æÆR"Â6÷VçC¢‚ÕÐ¢¢µÓ°¢&÷VæG2çW6‚€¢²¶W“¢'V'FW""Â&Vf—ƒ¢'b"ÂÆ&VÃ¢%V'BFRf–æÆR"Â6÷VçC¢BÒÀ¢²¶W“¢'6VÖ’"Â&Vf—ƒ¢'6VÖ’"ÂÆ&VÃ¢$FVÖ’Öf–æÆR"Â6÷VçC¢"ÒÀ¢²¶W“¢&f–æÂ"Â&Vf—ƒ¢&f–æÂ"ÂÆ&VÃ¢$f–æÆR"Â6÷VçC¢ÒÀ¢“°¢6öç7BÖF6†W2ÒµÓ°¢6öç7B6—&7V—E÷6—F–öå—'2Òµ³ÂeÒÂ³’Â…ÒÂ³RÂ%ÒÂ³2ÂEÒÂ³2ÂEÒÂ³ÂeÒÂ³rÂÒÂ³RÂ%ÕÓ°¢&÷VæG2æf÷$V6‚‚‡&÷VæBÂ&÷VæD–æFW‚’Óâ°¢f÷"†ÆWB–æFW‚Ò²–æFW‚Â&÷VæBæ6÷VçC²–æFW‚³Ò’°¢6öç7Bf—'7E&÷VæBÒ&÷VæD–æFW‚ÓÓÒ°¢6öç7Bf—'7E&÷VæE—"Ò7FFRçF÷W&æÖVçCòçvVV¶Ç’bb6—¦RÓÓÒ`¢ò6—&7V—E÷6—F–öå—'5¶–æFW…Ð¢¢²†–æFW‚¢"’²Â†–æFW‚¢"’²%Ó°¢6öç7B–BÒ&÷VæBæ¶W’ÓÓÒ&f–æÂ"ò&f–æÂ"¢G·&÷VæBç&Vf—‡ÒG·&÷VæBç&Vf—‚ç7F'G5v—F‚‚'""’ò%ò"¢"'ÒG¶–æFW‚²Ö°¢ÖF6†W2çW6‚†ÖF6‚€¢–BÀ¢&÷VæBæ6÷VçBÓÓÒò&÷VæBæÆ&VÂ¢G·&÷VæBæÆ&VÇÒG¶–æFW‚²ÖÀ¢&÷VæBæ¶W’À¢f—'7E&÷VæBò÷6—F–öç5¶f—'7E&÷VæE—%³ÕÒ¢çVÆÂÀ¢f—'7E&÷VæBò÷6—F–öç5¶f—'7E&÷VæE—%³ÕÒ¢çVÆÂÀ¢’“°¢Ð¢Ò“°¢&WGW&âÖF6†W2æÖ‚†—FVÒ’Óâ°¢–b†—FVÒç6–×VÆFVBbb7FFRçF÷W&æÖVçCòç&öw&W76—fTÆ—fU66÷&W2’°¢6öç7B&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚†—FVÒçÆ–W$Â—FVÒçÆ–W$"ÂF&vWE6WG2“°¢—FVÒæ†–FFVåv–ææW"Ò&W7VÇBçv–ææW#°¢—FVÒæ†–FFVå6WE66÷&W2Ò&W7VÇBç6WE66÷&W3°¢Ð¢&WGW&â—FVÓ°¢Ò“°§Ð ¦gVæ7F–öâ'V–ÆE6–×VÆFVEF÷W&æÖVçDÖF6‚†–BÂÆ&VÂÂÆ–W$ÂÆ–W$"ÂF&vWE6WG2Â&÷VæB’°¢6öç7B&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚‡Æ–W$ÂÆ–W$"ÂF&vWE6WG2“°¢&WGW&â°¢–BÀ¢Æ&VÂÀ¢&÷VæBÀ¢Æ–W$À¢Æ–W$"À¢v–ææW#¢çVÆÂÀ¢66÷&S¢çVÆÂÀ¢†–FFVåv–ææW#¢&W7VÇBçv–ææW"À¢†–FFVå6WE66÷&W3¢&W7VÇBç6WE66÷&W2À¢&WfVÆVE6WE66÷&W3¢µÒÀ¢6–×VÆFVC¢G'VRÀ¢Ó°§Ð ¦gVæ7F–öâ6–×VÆFT•F÷W&æÖVçDÖF6‚‡Æ–W$ÂÆ–W$"ÂF&vWE6WG2Ò7FFRçF÷W&æÖVçBçF&vWE6WG2óò"ÂÖF6‚ÒçVÆÂ’°¢–b‡7FFRçF÷W&æÖVçCòæöæUö–çDvÖR’°¢&WGW&â6–×VÆFT6Æ–'&FVDöæUö–çDÖF6‚‡Æ–W$ÂÆ–W$"ÂÖF6‚“°¢Ð¢6öç7B6–×VÆFVDÖF6‚Ò°¢6–×VÆFVC¢G'VRÀ¢Æ–W$À¢Æ–W$"À¢v–ææW#¢çVÆÂÀ¢66÷&S¢çVÆÂÀ¢&WfVÆVE6WE66÷&W3¢µÒÀ¢Ó°¢f÷"†ÆWBwV&BÒ²wV&BÂbb6–×VÆFVDÖF6‚çv–ææW#²wV&B³Ò’°¢Gfæ6U&öw&W76—fUF÷W&æÖVçDÖF6‚‡6–×VÆFVDÖF6‚ÂF&vWE6WG2“°¢Ð¢6öç7B6WE66÷&W2Ò6–×VÆFVDÖF6‚ç&WfVÆVE6WE66÷&W2ÇÂµÓ°¢&WGW&â²v–ææW#¢6–×VÆFVDÖF6‚çv–ææW"Â6WE66÷&W2Â66÷&S¢f÷&ÖE6WE66÷&W2‡6WE66÷&W2’Ó°§Ð ¦gVæ7F–öâöæUö–çE66÷&U&–÷&—G’‡Æ–W%66÷&RÂ÷öæVçE66÷&R’°¢&WGW&â°¢#2Ó#¢bÀ¢#"Ó#¢RÀ¢#"Ó#¢BÀ¢#Ó"#¢2À¢#Ó"#¢"À¢#Ó2#¢À¢Õ¶G´çVÖ&W"‡Æ–W%66÷&R—ÒÒG´çVÖ&W"†÷öæVçE66÷&R—ÖÒÇÂ°§Ð ¦gVæ7F–öâ&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚’°¢–b‚7FFRçF÷W&æÖVçCòæöæUö–çDvÖRÇÂÖF6‚ÇÂÖF6‚çW&f÷&Öæ6U&V6÷&FVBÇÂÖF6‚çv–ææW"’&WGW&ã°¢6öç7B66÷&RÒ†ÖF6‚ç&WfVÆVE6WE66÷&W3òæÆVæwF‚òÖF6‚ç&WfVÆVE6WE66÷&W2¢'6UF÷W&æÖVçE66÷&R†ÖF6‚ç66÷&R’•³Ó°¢–b‚66÷&RÇÂÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"’&WGW&ã°¢ÖF6‚çW&f÷&Öæ6U&V6÷&FVBÒG'VS°¢7FFRçF÷W&æÖVçBç&Wf–÷W5v–å66÷&W2ÇÃÒ·Ó°¢7FFRçF÷W&æÖVçBæöæUö–çE&Wv&G2ÇÃÒ·Ó°¢7FFRçF÷W&æÖVçBç7W&f6T&öçW6W2ÇÃÒ·Ó°¢¶ÖF6‚çÆ–W$ÂÖF6‚çÆ–W$%Òæf÷$V6‚‚†VçG'’Â–æFW‚’Óâ°¢6öç7B÷vå66÷&RÒçVÖ&W"‡66÷&U¶–æFW…Ò“°¢6öç7B÷öæVçE66÷&RÒçVÖ&W"‡66÷&U¶÷öæVçDöb†–æFW‚•Ò“°¢7FFRçF÷W&æÖVçBç&Wf–÷W5v–å66÷&W5¶VçG'•ÒÒöæUö–çE66÷&U&–÷&—G’†÷vå66÷&RÂ÷öæVçE66÷&R“°¢6öç7B&Wv&D6÷VçBÒ7FFRçF÷W&æÖVçBæ&öçW4ÆWfVÂÓÓÒ'&Wv&B ¢bbÖF6‚çv–ææW"ÓÓÒVçG'¢bb÷vå66÷&RÓÓÒ0¢bb÷öæVçE66÷&RÓÓÒ ¢ò ¢¢7FFRçF÷W&æÖVçBæ&öçW4ÆWfVÂÓÓÒ'&Wv&B ¢bbÖF6‚çv–ææW"ÓÓÒVçG'¢bb÷vå66÷&RÓÓÒ ¢bb÷öæVçE66÷&RÓÓÒ ¢ò¢¢°¢7FFRçF÷W&æÖVçBæöæUö–çE&Wv&G5¶VçG'•ÒÒ&Wv&D6÷Vç@¢ò6‡VffÆR†öæUö–çE&Wv&D&öçW5ööÂ‚’’ç6Æ–6RƒÂ&Wv&D6÷VçB¢¢µÓ°¢7FFRçF÷W&æÖVçBç7W&f6T&öçW6W5¶VçG'•ÒÒ6ÆöæTFF‡7FFRçF÷W&æÖVçBæöæUö–çE&Wv&G5¶VçG'•Ò“°¢Ò“°§Ð ¦gVæ7F–öâöæUö–çE&W7VÇEW&f÷&Öæ6R‡v–ææW%66÷&RÂÆ÷6W%66÷&R’°¢–b„çVÖ&W"‡v–ææW%66÷&R’ÓÓÒ2bbçVÖ&W"†Æ÷6W%66÷&R’ÓÓÒ’&WGW&â3°¢–b„çVÖ&W"‡v–ææW%66÷&R’ÓÓÒ"bbçVÖ&W"†Æ÷6W%66÷&R’ÓÓÒ’&WGW&â#°¢–b„çVÖ&W"‡v–ææW%66÷&R’ÓÓÒ"bbçVÖ&W"†Æ÷6W%66÷&R’ÓÓÒ’&WGW&â°¢&WGW&â°§Ð ¦gVæ7F–öâ•F÷W&æÖVçE7G&VæwF‚†6†&7FW$–B’°¢6†&7FW$–BÒF÷W&æÖVçD&6TVçG'’†6†&7FW$–B“°¢6öç7B—4†—7F÷&–2Ò„•5Dõ$”5õDõU$äÔTåEõÄ”U%2æ–æ6ÇVFW2†6†&7FW$–B“°¢6öç7B—56VVFVBÒ‡7FFRçF÷W&æÖVçCòç6VVFVD6†&7FW'2ÇÂµÒ’æ–æ6ÇVFW2†6†&7FW$–B“°¢6öç7BW&ÖæVçD&öçW6W2Ò7FFRçF÷W&æÖVçCòçW&ÖæVçD&öçW6W3òå¶6†&7FW$–EÒóòµÓ°¢6öç7BG–æÖ–4&öçW2Ò‡7FFRçF÷W&æÖVçCòæG–æÖ–4&öçW4–G2ÇÂµÒ’æ–æ6ÇVFW2†6†&7FW$–B’òR¢°¢6öç7B76–væVE7W&f6T&öçW6W2Ò7FFRçF÷W&æÖVçCòç7W&f6T&öçW6W3òå¶6†&7FW$–EÓ°¢6öç7B7W&f6T&öçW46÷VçBÒ'&’æ—4'&’†76–væVE7W&f6T&öçW6W2¢ò76–væVE7W&f6T&öçW6W2æÆVæwF€¢¢76–væVE7W&f6T&öçW6W0¢ò¢¢°¢6öç7B6—&7V—E'VÆW2Ò7FFRçF÷W&æÖVçCòæF–ff–7VÇG’ÓÓÒ&6—&7V—B#°¢6öç7B7W&f6T&öçW2Ò7W&f6T&öçW46÷VçB¢C°¢6öç7B†—7F÷&–4&öçW2Ò6—&7V—E'VÆW2ò¢—4†—7F÷&–2ò‚¢°¢6öç7B6VVFVD&öçW2Ò6—&7V—E'VÆW2ò¢—56VVFVBòB¢°¢6öç7BW&ÖæVçD&öçW2Ò6—&7V—E'VÆW2ò¢W&ÖæVçD&öçW6W2æÆVæwF‚ò2¢°¢6öç7BW6W476–væVD–çFVÆÆ–vVæ6RÒ&ööÆVâ‡7FFRçF÷W&æÖVçCòæ”–çFVÆÆ–vVæ6TÆWfVÇ3òå¶6†&7FW$–EÒ“°¢6öç7B–çFVÆÆ–vVæ6TÆWfVÂÒW6W476–væVD–çFVÆÆ–vVæ6RÇÂ7FFRçF÷W&æÖVçCòæ”6ÇV$†÷W6P¢ò”–çFVÆÆ–vVæ6Tf÷$VçG'’†6†&7FW$–BÂ7FFRçF÷W&æÖVçBæF–ff–7VÇG’¢¢&W‡W'B#°¢6öç7B–çFVÆÆ–vVæ6T&öçW2Ò²ÖFWW#¢ÓBÂæ÷&ÖÃ¢ÂW‡W'C¢‚Â6†×–öã¢"ÂÆVvVæC¢rÕ¶–çFVÆÆ–vVæ6TÆWfVÅÓ°¢6öç7B&æ´–ÒF÷W&æÖVçE&æ´–†6†&7FW$–B“°¢6öç7B&æ´–&öçW2Ò&æ´–Â““““’òÖF‚æÖ‚ƒÂ#"Ò&æ´–’¢ãSR¢°¢6öç7B&6RÒ4ô4…ôõD”ôå2æ–æ6ÇVFW2†6†&7FW$–B’òC‚¢SC°¢&WGW&â&6R²†—7F÷&–4&öçW2²6VVFVD&öçW2²7W&f6T&öçW2²W&ÖæVçD&öçW2²G–æÖ–4&öçW2²–çFVÆÆ–vVæ6T&öçW2²&æ´–&öçW2²ÖF‚æfÆö÷"„ÖF‚ç&æFöÒ‚’¢2“°§Ð ¦gVæ7F–öâ&æFöÔÖF6…6WE66÷&W4f÷%v–ææW"‡v–ææW$–æFW‚ÂF&vWE6WG2Ò"’°¢6öç7B6WE66÷&W2ÒµÓ°¢ÆWBv–ææW%6WG2Ò°¢ÆWBÆ÷6W%6WG2Ò°¢6öç7Bv–ææ–æu6WE66÷&W2Òµ³bÂÒÂ³bÂÒÂ³bÂ%ÒÂ³bÂ5ÒÂ³bÂEÒÂ³rÂUÒÂ³rÂeÕÓ°¢6öç7BÆ÷6–æu6WE66÷&W2Òµ³BÂeÒÂ³2ÂeÒÂ³RÂuÒÂ³bÂuÕÓ°¢v†–ÆR‡v–ææW%6WG2ÂF&vWE6WG2’°¢6öç7Bv–ææW$Æ÷6W56WBÒÆ÷6W%6WG2ÂF&vWE6WG2Òbbv–ææW%6WG2ÂF&vWE6WG2ÒbbÖF‚ç&æFöÒ‚’Âã#ƒ°¢6öç7BööÂÒv–ææW$Æ÷6W56WBòÆ÷6–æu6WE66÷&W2¢v–ææ–æu6WE66÷&W3°¢6öç7B66÷&RÒööÅ´ÖF‚æfÆö÷"„ÖF‚ç&æFöÒ‚’¢ööÂæÆVæwF‚•Ó°¢–b‡v–ææW$Æ÷6W56WB’Æ÷6W%6WG2³Ò°¢VÇ6Rv–ææW%6WG2³Ò°¢6öç7B÷&–VçFVBÒv–ææW$–æFW‚ÓÓÒò66÷&R¢·66÷&U³ÒÂ66÷&U³ÕÓ°¢6WE66÷&W2çW6‚…¶÷&–VçFVE³ÒÂ÷&–VçFVE³ÕÒ“°¢Ð¢&WGW&â6WE66÷&W3°§Ð ¦gVæ7F–öâf÷&ÖE6WE66÷&W2‡6WE66÷&W2ÒµÒ’°¢&WGW&â6WE66÷&W2æÖ‚‡66÷&R’ÓâG·66÷&U³×ÒòG·66÷&U³×Ö’æ¦ö–â‚"Ò"“°§Ð ¦gVæ7F–öâ&öw&W76—fUF÷W&æÖVçE66÷&UFW‡B‡&öw&W72’°¢6öç7B6ö×ÆWFVBÒ&öw&W72æ6ö×ÆWFVE66÷&W2ÇÂµÓ°¢6öç7B7W'&VçBÒ&öw&W72æÖF6„÷fW"ÇÂ‡&öw&W72ç66÷&RÇÂµÒ’ç6öÖR„çVÖ&W"’òµÒ¢·&öw&W72ç66÷&UÓ°¢&WGW&âf÷&ÖE6WE66÷&W2…²ââæ6ö×ÆWFVBÂââæ7W'&VçEÒ“°§Ð ¦gVæ7F–öâ&öw&W76—fUF÷W&æÖVçE&æµ&F–ær†VçG'’’°¢6öç7B&æ²ÒÖF‚æÖ‚ƒÂÖF‚æÖ–âƒ#BÂF÷W&æÖVçE&æ´–†VçG'’’’“°¢6öç7B&F–æw2Ò°¢ÂÓã#“ÂÓãC3‚ÂÓãSc2ÂÓãc’ÂÓãcƒ‚ÂÓãscbÂÓãƒ3bÀ¢Óã“bÂÓãbÂÓãS’ÂÓã"ÂÓãs‚ÂÓã#SBÂÓã3ÂÓã3cÀ¢ÓãC#ÂÓãCs2ÂÓãS3ÂÓãS“2ÂÓãcƒ2ÂÓãssÂÓãƒS"ÂÓ"ãSRÀ¢Ó°¢&WGW&â&F–æw5·&æ²ÒÒóò&F–æw5·&F–æw2æÆVæwF‚ÒÓ°§Ð ¦gVæ7F–öâ&öw&W76—fUF÷W&æÖVçD†æEVÆ—G’‚’°¢6öç7B&öÆÂÒÖF‚ç&æFöÒ‚“°¢–b‡&öÆÂÂãR’&WGW&âÓ#°¢–b‡&öÆÂÂãR’&WGW&âÓ°¢–b‡&öÆÂÂãƒR’&WGW&â°¢–b‡&öÆÂÂã“R’&WGW&â°¢&WGW&â#°§Ð ¦gVæ7F–öâ&öw&W76—fUF÷W&æÖVçDW†6†ævU66÷&R††æDvÒ’°¢6öç7B&6UvV–v‡G2Ò³ãcÂã3ÂãÓ°¢6öç7B66÷&W2Òµ³"ÂÒÂ³"ÂÒÂ³2ÂÕÓ°¢6öç7BvV–v‡G2Ò&6UvV–v‡G2æÖ‚‡vV–v‡BÂ–æFW‚’ÓâvV–v‡B¢ÖF‚æW‡ƒãb¢†æDv¢†–æFW‚ÒãcR’’“°¢6öç7BF÷FÂÒvV–v‡G2ç&VGV6R‚‡7VÒÂvV–v‡B’Óâ7VÒ²vV–v‡BÂ“°¢ÆWB&öÆÂÒÖF‚ç&æFöÒ‚’¢F÷FÃ°¢f÷"†ÆWB–æFW‚Ò²–æFW‚ÂvV–v‡G2æÆVæwFƒ²–æFW‚³Ò’°¢&öÆÂÓÒvV–v‡G5¶–æFW…Ó°¢–b‡&öÆÂÂ’&WGW&â66÷&W5¶–æFW…Ó°¢Ð¢&WGW&â66÷&W5³Ó°§Ð ¦gVæ7F–öâ&öw&W76—fUF÷W&æÖVçDæW‡E6W'fW"‡&öw&W72ÂæW‡E66÷&R’°¢–b„ÖF‚æÖ‚‚ââææW‡E66÷&R’ÓÓÒbbbÖF‚æÖ–â‚ââææW‡E66÷&R’ÓÓÒR’°¢&WGW&âæW‡E66÷&U³ÒÓÓÒbò¢°¢Ð¢&WGW&â÷öæVçDöb‡&öw&W72ç6W'fW"“°§Ð ¦gVæ7F–öâöæUö–çE&Wf–÷W5&W7VÇDGfçFvR†VçG'’’°¢6öç7B&–÷&—G’ÒçVÖ&W"‡7FFRçF÷W&æÖVçCòç&Wf–÷W5v–å66÷&W3òå¶VçG'•ÒÇÂ“°¢–b‡&–÷&—G’ÓÓÒb’&WGW&â#°¢–b‡&–÷&—G’ÓÓÒR’&WGW&â°¢&WGW&â°§Ð ¦gVæ7F–öâöæUö–çE6–×VÆFVE6W'fW"‡Æ–W$ÂÆ–W$"ÂÖF6‚ÒçVÆÂ’°¢–b‡7FFRçF÷W&æÖVçCòæöæUö–çDÖ7FW"bbÖF6ƒòç&÷VæBÓÓÒ'V'FW""’°¢6öç7Bw&÷Wv–ææW'2Ò7FFRçF÷W&æÖVçBæ6†×–öç6†—w&÷Wv–ææW'2ÇÂµÓ°¢–b†w&÷Wv–ææW'2æ–æ6ÇVFW2‡Æ–W$’’&WGW&â°¢–b†w&÷Wv–ææW'2æ–æ6ÇVFW2‡Æ–W$"’’&WGW&â°¢Ð¢6öç7B&Wf–÷W566÷&W2Ò7FFRçF÷W&æÖVçCòç&Wf–÷W5v–å66÷&W2ÇÂ·Ó°¢6öç7B66÷&TÒçVÖ&W"‡&Wf–÷W566÷&W5·Æ–W$ÒÇÂ“°¢6öç7B66÷&T"ÒçVÖ&W"‡&Wf–÷W566÷&W5·Æ–W$%ÒÇÂ“°¢–b‡66÷&TÓÒ66÷&T"’&WGW&â66÷&Tâ66÷&T"ò¢°¢&WGW&âÖF‚ç&æFöÒ‚’ÂãRò¢°§Ð ¦gVæ7F–öâöæUö–çDÖ7FW%÷6—F–öäGfçFvW2†ÖF6‚’°¢6öç7BGfçFvW2Ò³ÂÓ°¢–b‚7FFRçF÷W&æÖVçCòæöæUö–çDÖ7FW"ÇÂÖF6‚’&WGW&âGfçFvW3°¢–b†ÖF6‚æ6†×–öç6†—†6RÓÓÒbbçVÖ&W"†ÖF6‚æF’ÇÂ’âbbÖF6‚æw&÷W’°¢6öç7B7FæF–æw2ÒöæUö–çDÖ7FW%7FæF–æw2†ÖF6‚æw&÷WÂçVÖ&W"†ÖF6‚æF’’Ò“°¢6öç7B÷6—F–öäÒ7FæF–æw2æf–æD–æFW‚‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒÖF6‚çÆ–W$“°¢6öç7B÷6—F–öä"Ò7FæF–æw2æf–æD–æFW‚‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒÖF6‚çÆ–W$"“°¢6öç7B&÷tÒ7FæF–æw5·÷6—F–öäÓ°¢6öç7B&÷t"Ò7FæF–æw5·÷6—F–öä%Ó°¢6öç7B7÷'F–æuF–RÒ&÷tbb&÷t ¢bb&÷tçö–çG2ÓÓÒ&÷t"çö–çG0¢bb&÷tæF–ffW&Væ6RÓÓÒ&÷t"æF–ffW&Væ6P¢bb&÷tæ&ö÷7BÓÓÒ&÷t"æ&ö÷7@¢bb&÷tçGvõ¦W&òÓÓÒ&÷t"çGvõ¦W&ó°¢–b‚7÷'F–æuF–Rbb÷6—F–öäãÒbb÷6—F–öä"ãÒbb÷6—F–öäÓÒ÷6—F–öä"’GfçFvW5·÷6—F–öäÂ÷6—F–öä"ò¢ÒÒ°¢ÒVÇ6R–b†ÖF6‚æ6†×–öç6†—†6RÓÓÒ2’°¢6öç7B6V6öæEÆ6W2Ò7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW%6V6öæEÆ6TVçG&–W2ÇÂµÓ°¢–b‡6V6öæEÆ6W2æ–æ6ÇVFW2†ÖF6‚çÆ–W$’’GfçFvW5³ÒÒ°¢–b‡6V6öæEÆ6W2æ–æ6ÇVFW2†ÖF6‚çÆ–W$"’’GfçFvW5³ÒÒ°¢ÒVÇ6R–b†ÖF6‚ç&÷VæBÓÓÒ'V'FW""’°¢6öç7Bw&÷Wv–ææW'2Ò7FFRçF÷W&æÖVçBæ6†×–öç6†—w&÷Wv–ææW'2ÇÂµÓ°¢–b†w&÷Wv–ææW'2æ–æ6ÇVFW2†ÖF6‚çÆ–W$’’GfçFvW5³ÒÒ°¢–b†w&÷Wv–ææW'2æ–æ6ÇVFW2†ÖF6‚çÆ–W$"’’GfçFvW5³ÒÒ°¢Ð¢&WGW&âGfçFvW3°§Ð ¦gVæ7F–öâöæUö–çEv–ä6†æ6Tg&öÔGfçFvR†v’°¢6öç7B6–vâÒÖF‚ç6–vâ†v“°¢6öç7BF—7Fæ6RÒÖF‚æÖ–âƒbÂÖF‚æ'2†v’“°¢6öç7B7FW2Ò³Âã‚ÂãbÂã#2Âã#’Âã32Âã3UÓ°¢6öç7BÆ÷vW"ÒÖF‚æfÆö÷"†F—7Fæ6R“°¢6öç7BWW"ÒÖF‚æ6V–Â†F—7Fæ6R“°¢6öç7BÆ–gBÒ7FW5¶Æ÷vW%Ò²‚‡7FW5·WW%ÒÒ7FW5¶Æ÷vW%Ò’¢†F—7Fæ6RÒÆ÷vW"’“°¢&WGW&âÖF‚æÖ‚ƒãRÂÖF‚æÖ–âƒãƒRÂãR²‡6–vâ¢Æ–gB’’“°§Ð ¦gVæ7F–öâöæUö–çE66÷&Tg&öÕv–ææW$GfçFvR‡v–ææW$GfçFvR’°¢6öç7B66÷&UvV–v‡G2Òv–ææW$GfçFvRÂ ¢ò³ãƒÂãrÂã5Ð¢¢v–ææW$GfçFvRÂ¢ò³ãcÂã3ÂãÐ¢¢v–ææW$GfçFvRÂ ¢ò³ãSÂã3RÂãUÐ¢¢v–ææW$GfçFvRÂ0¢ò³ã3‚ÂãCÂã#%Ð¢¢v–ææW$GfçFvRÂ@¢ò³ã#rÂãCÂã35Ð¢¢v–ææW$GfçFvRÂP¢ò³ã‚Âã3rÂãCUÐ¢¢³ãÂã3ÂãcÓ°¢6öç7B66÷&W2Òµ³"ÂÒÂ³"ÂÒÂ³2ÂÕÓ°¢ÆWB&öÆÂÒÖF‚ç&æFöÒ‚“°¢f÷"†ÆWB–æFW‚Ò²–æFW‚Â66÷&UvV–v‡G2æÆVæwFƒ²–æFW‚³Ò’°¢&öÆÂÓÒ66÷&UvV–v‡G5¶–æFW…Ó°¢–b‡&öÆÂÂ’&WGW&â66÷&W5¶–æFW…Ó°¢Ð¢&WGW&â66÷&W5³Ó°§Ð ¦gVæ7F–öâ6–×VÆFT6Æ–'&FVDöæUö–çDÖF6‚‡Æ–W$ÂÆ–W$"ÂÖF6‚ÒçVÆÂ’°¢6öç7B†æG2Ò·&öw&W76—fUF÷W&æÖVçD†æEVÆ—G’‚’Â&öw&W76—fUF÷W&æÖVçD†æEVÆ—G’‚•Ó°¢6öç7B&æ·2Ò·F÷W&æÖVçE&æ´–‡Æ–W$’ÂF÷W&æÖVçE&æ´–‡Æ–W$"•Ó°¢6öç7B&æ´vÒÖF‚æÖ‚‚Ó"ÂÖF‚æÖ–âƒ"Â‡&æ·5³ÒÒ&æ·5³Ò’ò"’“°¢6öç7B&æ´GfçFvW2Ò´ÖF‚æÖ‚ƒÂ&æ´v’ÂÖF‚æÖ‚ƒÂ×&æ´v•Ó°¢6öç7B6W'fW"ÒöæUö–çE6–×VÆFVE6W'fW"‡Æ–W$ÂÆ–W$"ÂÖF6‚“°¢6öç7B÷6—F–öäGfçFvW2ÒöæUö–çDÖ7FW%÷6—F–öäGfçFvW2†ÖF6‚“°¢6öç7BF÷FÇ2Ò·Æ–W$ÂÆ–W$%ÒæÖ‚†VçG'’Â–æFW‚’Óâ€¢&æ´GfçFvW5¶–æFW…Ð¢²†æG5¶–æFW…Ð¢²öæUö–çE&Wf–÷W5&W7VÇDGfçFvR†VçG'’¢²‡6W'fW"ÓÓÒ–æFW‚ò¢¢²÷6—F–öäGfçFvW5¶–æFW…Ð¢’“°¢6öç7BvÒF÷FÇ5³ÒÒF÷FÇ5³Ó°¢6öç7Bv–ææW$–æFW‚ÒÖF‚ç&æFöÒ‚’ÂöæUö–çEv–ä6†æ6Tg&öÔGfçFvR†v’ò¢°¢6öç7Bv–ææW$GfçFvRÒv–ææW$–æFW‚ÓÓÒòv¢Öv°¢6öç7B·v–ææW%66÷&RÂÆ÷6W%66÷&UÒÒöæUö–çE66÷&Tg&öÕv–ææW$GfçFvR‡v–ææW$GfçFvR“°¢6öç7B6WE66÷&W2Ò·v–ææW$–æFW‚ÓÓÒò·v–ææW%66÷&RÂÆ÷6W%66÷&UÒ¢¶Æ÷6W%66÷&RÂv–ææW%66÷&UÕÓ°¢6öç7Bv–ææW"Òv–ææW$–æFW‚ÓÓÒòÆ–W$¢Æ–W$#°¢&WGW&â²v–ææW"Â6WE66÷&W2Â66÷&S¢f÷&ÖE6WE66÷&W2‡6WE66÷&W2’Ó°§Ð ¦gVæ7F–öâ6Æ–'&FVEF÷W&æÖVçDW†6†ævR‡Æ–W$ÂÆ–W$"Â&öw&W72’°¢6öç7B†æG2Ò·&öw&W76—fUF÷W&æÖVçD†æEVÆ—G’‚’Â&öw&W76—fUF÷W&æÖVçD†æEVÆ—G’‚•Ó°¢6öç7B7G&VæwF„Ò&öw&W76—fUF÷W&æÖVçE&æµ&F–ær‡Æ–W$’²††æG5³Ò¢ãsR’²&öw&W72æÖöÖVçGVÕ³Ò²‡&öw&W72ç6W'fW"ÓÓÒòãSR¢“°¢6öç7B7G&VæwF„"Ò&öw&W76—fUF÷W&æÖVçE&æµ&F–ær‡Æ–W$"’²††æG5³Ò¢ãsR’²&öw&W72æÖöÖVçGVÕ³Ò²‡&öw&W72ç6W'fW"ÓÓÒòãSR¢“°¢6öç7B6†æ6TÒÖF‚æÖ‚‚ã‚ÂÖF‚æÖ–â‚ãƒ"Âòƒ²ÖF‚æW‡‚Ò‡7G&VæwF„Ò7G&VæwF„"’ò2ã‚’’’“°¢6öç7Bv–ææW"ÒÖF‚ç&æFöÒ‚’Â6†æ6Tò¢°¢6öç7BÆ÷6W"Ò÷öæVçDöb‡v–ææW"“°¢6öç7B·v–ææW$vÖW2ÂÆ÷6W$vÖW5ÒÒ&öw&W76—fUF÷W&æÖVçDW†6†ævU66÷&R††æG5·v–ææW%ÒÒ†æG5¶Æ÷6W%Ò“°¢&WGW&â²v–ææW"ÂÆ÷6W"Âv–ææW$vÖW2ÂÆ÷6W$vÖW2Ó°§Ð ¦gVæ7F–öâGfæ6U&öw&W76—fUF÷W&æÖVçDÖF6‚†ÖF6‚ÂF&vWE6WG4÷fW'&–FRÒçVÆÂ’°¢–b‚ÖF6ƒòç6–×VÆFVBÇÂÖF6‚çv–ææW"ÇÂÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"’&WGW&âfÇ6S°¢6öç7B&öw&W72ÒÖF6‚æÆ—fU&öw&W72ÇÂ°¢66÷&S¢³ÂÒÂ6ö×ÆWFVE66÷&W3¢µÒÂ6WG5vöã¢³ÂÒÂÖöÖVçGVÓ¢³ÂÒÂ6W'fW#¢ÖF‚ç&æFöÒ‚’ÂãRò¢À¢Ó°¢6öç7B²v–ææW"ÂÆ÷6W"Âv–ææW$vÖW2ÂÆ÷6W$vÖW2ÒÒ6Æ–'&FVEF÷W&æÖVçDW†6†ævR†ÖF6‚çÆ–W$ÂÖF6‚çÆ–W$"Â&öw&W72“°¢6öç7BæW‡BÒ²ââç&öw&W72ç66÷&UÓ°¢æW‡E·v–ææW%ÒÒ6ö×WFUv–ææW%6WDvÖW2†æW‡E·v–ææW%ÒÂæW‡E¶Æ÷6W%ÒÂv–ææW$vÖW2“°¢æW‡E¶Æ÷6W%ÒÒÖF‚æÖ–âƒrÂæW‡E¶Æ÷6W%Ò²Æ÷6W$vÖW2“°¢–b†æW‡E·v–ææW%ÒÓÓÒrbbæW‡E¶Æ÷6W%ÒÂR’æW‡E·v–ææW%ÒÒc°¢–b†æW‡E¶Æ÷6W%ÒâbbbæW‡E·v–ææW%ÒÂr’æW‡E¶Æ÷6W%ÒÒc°¢–b†æW‡E³ÒÓÓÒrbbæW‡E³ÒÓÓÒr’æW‡E¶Æ÷6W%ÒÒc°¢&öw&W72æÖöÖVçGVÕ·v–ææW%ÒÒÖF‚æÖ–âƒÂ&öw&W72æÖöÖVçGVÕ·v–ææW%Ò²ã"“°¢&öw&W72æÖöÖVçGVÕ¶Æ÷6W%ÒÒÖF‚æÖ‚‚ÓÂ&öw&W72æÖöÖVçGVÕ¶Æ÷6W%ÒÒã"“°¢&öw&W72ç6W'fW"Ò&öw&W76—fUF÷W&æÖVçDæW‡E6W'fW"‡&öw&W72ÂæW‡B“°¢&öw&W72ç66÷&RÒæW‡C°¢–b†—56WD÷fW"†æW‡B’’°¢&öw&W72æ6ö×ÆWFVE66÷&W2çW6‚…²ââææW‡EÒ“°¢&öw&W72ç6WG5vöå¶ÆVF–æu6WEÆ–W"†æW‡B•Ò³Ò°¢&öw&W72ç66÷&RÒ³ÂÓ°¢&öw&W72æÖöÖVçGVÒÒ³ÂÓ°¢Ð¢6öç7BF&vWE6WG2ÒçVÖ&W"‡F&vWE6WG4÷fW'&–FRÇÂ7FFRçF÷W&æÖVçBçF&vWE6WG2ÇÂ"“°¢6öç7BÖF6…v–ææW$–æFW‚Ò&öw&W72ç6WG5vöâæf–æD–æFW‚‚‡6WG2’Óâ6WG2ãÒF&vWE6WG2“°¢&öw&W72æÖF6„÷fW"ÒÖF6…v–ææW$–æFW‚ãÒ°¢ÖF6‚æÆ—fU&öw&W72Ò&öw&W73°¢ÖF6‚ç&WfVÆVE6WE66÷&W2Ò&öw&W72æ6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢–b‡&öw&W72æÖF6„÷fW"’°¢ÖF6‚çv–ææW"ÒÖF6…v–ææW$–æFW‚ÓÓÒòÖF6‚çÆ–W$¢ÖF6‚çÆ–W$#°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2‡&öw&W72æ6ö×ÆWFVE66÷&W2“°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°¢ÒVÇ6R°¢ÖF6‚æÆ—fU66÷&RÒG·&öw&W76—fUF÷W&æÖVçE66÷&UFW‡B‡&öw&W72—Ò+rTâD•$T5F°¢ÖF6‚ç66÷&RÒçVÆÃ°¢Ð¢&WGW&âG'VS°§Ð ¦gVæ7F–öâGfæ6U&öw&W76—fUF÷W&æÖVçE66÷&W2‡&÷VæBÒ7FFRçF÷W&æÖVçCòç7FvR’°¢–b‚7FFRçF÷W&æÖVçCòç&öw&W76—fTÆ—fU66÷&W2ÇÂ&÷VæB’&WGW&ã°¢6öç7B7W'&VçBÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢6öç7BÖF6†W2Ò7FFRçF÷W&æÖVçBæ6†×–öç6†—bb7W'&Vç@¢ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’Óâ€¢ÖF6‚ç6–×VÆFV@¢bbÖF6‚æ6†×–öç6†—†6RÓÓÒ7W'&VçBæ6†×–öç6†—†6P¢bbÖF6‚æF’ÓÓÒ7W'&VçBæF¢’¢¢6–×VÆFVEF÷W&æÖVçDÖF6†W2‡&÷VæB“°¢f÷"†6öç7BÖF6‚öbÖF6†W2’Gfæ6U&öw&W76—fUF÷W&æÖVçDÖF6‚†ÖF6‚“°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢VÇ6R–b‡7FFRçF÷W&æÖVçBæÆVwVR’&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢VÇ6R&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°§Ð ¦gVæ7F–öâVç7W&UF÷W&æÖVçDÖF6„†5v–ææ–æu6WD6÷VçB†ÖF6‚’°¢–b‚ÖF6ƒòç6–×VÆFVBÇÂ‚ÖF6‚çv–ææW"bbÖF6‚ç66÷&R’’&WGW&ã°¢6öç7Bv–ææW"ÒÖF6‚çv–ææW"ÇÂÖF6‚æ†–FFVåv–ææW#°¢6öç7Bv–ææW$–æFW‚Òv–ææW"ÓÓÒÖF6‚çÆ–W$ò¢°¢6öç7BF&vWE6WG2ÒçVÖ&W"‡7FFRçF÷W&æÖVçBçF&vWE6WG2ÇÂ"“°¢6öç7B66÷&W2ÒÖF6‚ç&WfVÆVE6WE66÷&W3òæÆVæwF€¢òÖF6‚ç&WfVÆVE6WE66÷&W0¢¢'6UF÷W&æÖVçE66÷&R†ÖF6‚ç66÷&RÇÂ""“°¢6öç7Bvöå6WG2Ò66÷&W2æf–ÇFW"‚‡66÷&R’ÓâçVÖ&W"‡66÷&Sòå·v–ææW$–æFW…ÒÇÂ’âçVÖ&W"‡66÷&Sòå¶÷öæVçDöb‡v–ææW$–æFW‚•ÒÇÂ’’æÆVæwFƒ°¢–b‡vöå6WG2ãÒF&vWE6WG2bb66÷&W2æÆVæwF‚ÃÒ‡F&vWE6WG2¢"’Ò’&WGW&ã°¢6öç7B&W—&VBÒ&æFöÔÖF6…6WE66÷&W4f÷%v–ææW"‡v–ææW$–æFW‚ÂF&vWE6WG2“°¢ÖF6‚æ†–FFVåv–ææW"Òv–ææW#°¢ÖF6‚æ†–FFVå6WE66÷&W2Ò&W—&VBæÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç&WfVÆVE6WE66÷&W2Ò&W—&VBæÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚çv–ææW"Òv–ææW#°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2‡&W—&VB“°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°§Ð ¦gVæ7F–öâF÷W&æÖVçDÖF6„'”–B†ÖF6„–B’°¢&WGW&â7FFRçF÷W&æÖVçBæÖF6†W2æf–æB‚†ÖF6‚’ÓâÖF6‚æ–BÓÓÒÖF6„–B“°§Ð ¦gVæ7F–öâ‡VÖåF÷W&æÖVçDVçG'’‚’°¢&WGW&â7FFRçF÷W&æÖVçBæ‡VÖäVçG'’ÇÂ…TÔåõDõU$äÔTåEôTåE%“°§Ð ¦gVæ7F–öâ—4‡VÖåF÷W&æÖVçDVçG'’†VçG'’’°¢&WGW&âVçG'’ÓÓÒ‡VÖåF÷W&æÖVçDVçG'’‚’ÇÂ‚7FFRçF÷W&æÖVçBæ‡VÖäVçG'’bbVçG'’ÓÓÒ7FFRçF÷W&æÖVçBæ‡VÖä6†&7FW$–B“°§Ð ¦gVæ7F–öâF÷W&æÖVçDVçG'”6†&7FW$–B†VçG'’’°¢–b‡7FFRçF÷W&æÖVçCòæg&–VæFÇ’’&WGW&âg&–VæFÇ”VçG'”6†&7FW$–B†VçG'’“°¢&WGW&â—4‡VÖåF÷W&æÖVçDVçG'’†VçG'’’ò7FFRçF÷W&æÖVçBæ‡VÖä6†&7FW$–B¢F÷W&æÖVçD&6TVçG'’†VçG'’“°§Ð ¦gVæ7F–öâF÷W&æÖVçEv–ææW$VçG'”g&öÔÖF6…v–ææW"‡v–ææW$–æFW‚’°¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçCòæ7W'&VçDÖF6‚“°¢–b†ÖF6‚bb†ÖF6‚çÆ–W$ÓÓÒ‡VÖåF÷W&æÖVçDVçG'’‚’ÇÂÖF6‚çÆ–W$"ÓÓÒ‡VÖåF÷W&æÖVçDVçG'’‚’’’°¢&WGW&âv–ææW$–æFW‚ÓÓÒ ¢ò‡VÖåF÷W&æÖVçDVçG'’‚¢¢†ÖF6‚çÆ–W$ÓÓÒ‡VÖåF÷W&æÖVçDVçG'’‚’òÖF6‚çÆ–W$"¢ÖF6‚çÆ–W$“°¢Ð¢&WGW&âv–ææW$–æFW‚ÓÓÒò‡VÖåF÷W&æÖVçDVçG'’‚’¢7FFRçÆ–W'5·v–ææW$–æFW…Óòæ6†&7FW$–C°§Ð ¦gVæ7F–öâ÷öæVçD6†&7FW$–äÖF6‚†ÖF6‚Â‡VÖäVçG'’Ò‡VÖåF÷W&æÖVçDVçG'’‚’’°¢–b‚ÖF6‚’&WGW&â&æFöÔ”6†&7FW$–B‚“°¢6öç7B÷öæVçDVçG'’ÒÖF6‚çÆ–W$ÓÓÒ‡VÖäVçG'’òÖF6‚çÆ–W$"¢ÖF6‚çÆ–W$°¢&WGW&âF÷W&æÖVçDVçG'”6†&7FW$–B†÷öæVçDVçG'’“°§Ð ¦gVæ7F–öâæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚’°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢&WGW&â7FFRçF÷W&æÖVçBæÖF6†W2æf–æB‚†ÖF6‚’Óâ°¢–b†ÖF6‚çv–ææW"ÇÂÖF6‚ç66÷&R’&WGW&âfÇ6S°¢–b†ÖF6‚çÆ–W$ÓÒ‡VÖâbbÖF6‚çÆ–W$"ÓÒ‡VÖâ’&WGW&âfÇ6S°¢6öç7B÷öæVçBÒ÷öæVçD6†&7FW$–äÖF6‚†ÖF6‚Â‡VÖâ“°¢&WGW&â&ööÆVâ†÷öæVçB“°¢Ò’ÇÂçVÆÃ°§Ð ¦gVæ7F–öâ6WDÖF6…Æ–W'2†ÖF6‚ÂÆ–W$ÂÆ–W$"’°¢–b‚ÖF6‚’&WGW&ã°¢6öç7Bv5&VG’Ò&ööÆVâ†ÖF6‚çÆ–W$bbÖF6‚çÆ–W$"“°¢ÖF6‚çÆ–W$ÒÆ–W$óòçVÆÃ°¢ÖF6‚çÆ–W$"ÒÆ–W$"óòçVÆÃ°¢ÖF6‚ç÷6—F–öäÒ7FFRçF÷W&æÖVçCòçF÷W&æÖVçE÷6—F–öç3òå¶ÖF6‚çÆ–W$ÒóòçVÆÃ°¢ÖF6‚ç÷6—F–öä"Ò7FFRçF÷W&æÖVçCòçF÷W&æÖVçE÷6—F–öç3òå¶ÖF6‚çÆ–W$%ÒóòçVÆÃ°¢ÖF6‚çÆ–&ÆRÒ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$’ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"“°¢ÖF6‚ç6–×VÆFVBÒ&ööÆVâ†ÖF6‚çÆ–W$bbÖF6‚çÆ–W$"bbÖF6‚çÆ–&ÆR“°¢–b‚v5&VG’bbÖF6‚ç6–×VÆFVB’°¢ÖF6‚æ†–FFVåv–ææW"ÒçVÆÃ°¢ÖF6‚æ†–FFVå6WE66÷&W2ÒçVÆÃ°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒµÓ°¢ÖF6‚ç66÷&RÒçVÆÃ°¢ÖF6‚çv–ææW"ÒçVÆÃ°¢–b‚7FFRçF÷W&æÖVçCòç&öw&W76—fTÆ—fU66÷&W2bb7FFRçF÷W&æÖVçCòæöæUö–çDÖ7FW"’Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚“°¢Ð§Ð ¦gVæ7F–öâF÷W&æÖVçD6ö×ÆWFVE6WE66÷&W4f÷$ÖF6‚†ÖF6‚’°¢6öç7B66÷&W2Ò7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢–b‚ÖF6‚’&WGW&â66÷&W3°¢–b…4U%dU%õ5”ä2æg&–VæFÇ”ÖF6‚’&WGW&â66÷&W3°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢–b†ÖF6‚çÆ–W$"ÓÓÒ‡VÖâ’°¢&WGW&â66÷&W2æÖ‚‡66÷&R’Óâ·66÷&U³ÒÂ66÷&U³ÕÒ“°¢Ð¢&WGW&â66÷&W3°§Ð ¦gVæ7F–öâF÷W&æÖVçD6ö×ÆWFVE6WE66÷&R†ÖF6‚ÒçVÆÂ’°¢&WGW&âf÷&ÖE6WE66÷&W2‡F÷W&æÖVçD6ö×ÆWFVE6WE66÷&W4f÷$ÖF6‚†ÖF6‚’“°§Ð ¦gVæ7F–öâ†æFÆUF÷W&æÖVçDÖF6„6ö×ÆWFR‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&ã°¢–b‡7FFRçF÷W&æÖVçBæg&–VæFÇ’’°¢†æFÆTg&–VæFÇ•F÷W&æÖVçDÖF6„6ö×ÆWFR‚“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’°¢†æFÆT6†×–öç6†—ÖF6„6ö×ÆWFR‚“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBæÆVwVR’°¢†æFÆTÆVwVUF÷W&æÖVçDÖF6„6ö×ÆWFR‚“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’ÇÂ7FFRçF÷W&æÖVçBæ'&6¶WCb’°¢†æFÆUvVV¶Ç•F÷W&æÖVçDÖF6„6ö×ÆWFR‚“°¢&WGW&ã°¢Ð¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢–b‚ÖF6‚ÇÂÖF6‚çv–ææW"’&WGW&ã°¢6öç7Bv–ææW$6†&7FW$–BÒ7FFRçÆ–W'5·7FFRç6WDÖF6‚æÖF6…v–ææW%Óòæ6†&7FW$–C°¢ÖF6‚çv–ææW"Òv–ææW$6†&7FW$–C°¢ÖF6‚ç66÷&RÒF÷W&æÖVçD6ö×ÆWFVE6WE66÷&R†ÖF6‚“°¢–b†ÖF6‚æ–BÓÓÒ'd‡VÖâ"’°¢&WfVÄÆÅF÷W&æÖVçD•6WG2‚'V'FW""“°¢&Vg&W6…F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢6öç7Bd“ÒF÷W&æÖVçDÖF6„'”–B‚'d“"“°¢6öç7B6VÖ”‡VÖâÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ”‡VÖâ"“°¢–b‡v–ææW$6†&7FW$–BÓÓÒ7FFRçF÷W&æÖVçBæ‡VÖä6†&7FW$–B’°¢7FFRçF÷W&æÖVçBç7FvRÒ'&VG•6VÖ’#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRæÆörçVç6†–gB†FVÖ’Öf–æÆRL:–&Æ÷\:–R6öçG&RG¶6†&7FW$æÖTg&öÔ–B‡6VÖ”‡VÖâçÆ–W$"óòd“æ†–FFVåv–ææW"—Òæ“°¢ÒVÇ6R°¢6öç7B6VÖ”‡VÖå&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚‡v–ææW$6†&7FW$–BÂ6VÖ”‡VÖâçÆ–W$"óòd“æ†–FFVåv–ææW"Â7FFRçF÷W&æÖVçBçF&vWE6WG2óò"“°¢6VÖ”‡VÖâçv–ææW"Ò6VÖ”‡VÖå&W7VÇBçv–ææW#°¢6VÖ”‡VÖâç66÷&RÒ6VÖ”‡VÖå&W7VÇBç66÷&S°¢6ö×ÆWFUF÷W&æÖVçEv—F†÷WD‡VÖâ‡6VÖ”‡VÖå&W7VÇBçv–ææW"“°¢Ð¢ÒVÇ6R–b†ÖF6‚æ–BÓÓÒ'6VÖ”‡VÖâ"’°¢&WfVÄÆÅF÷W&æÖVçD•6WG2‚'6VÖ’"“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢6öç7B6VÖ”’ÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ”’"“°¢7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–BÒ6VÖ”’æ†–FFVåv–ææW#°¢–b‡v–ææW$6†&7FW$–BÓÓÒ7FFRçF÷W&æÖVçBæ‡VÖä6†&7FW$–B’°¢f–æÂçÆ–W$Òv–ææW$6†&7FW$–C°¢f–æÂçÆ–W$"Ò7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–C°¢7FFRçF÷W&æÖVçBç7FvRÒ'&VG”f–æÂ#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRæÆörçVç6†–gB†f–æÆRL:–&Æ÷\:–R6öçG&RG¶6†&7FW$æÖTg&öÔ–B‡7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–B—Òæ“°¢ÒVÇ6R°¢f–æÂçÆ–W$Òv–ææW$6†&7FW$–C°¢f–æÂçÆ–W$"Ò7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–C°¢6öç7Bf–æÅ&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚‡v–ææW$6†&7FW$–BÂ7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–BÂ7FFRçF÷W&æÖVçBçF&vWE6WG2óò"“°¢f–æÂçv–ææW"Òf–æÅ&W7VÇBçv–ææW#°¢f–æÂç66÷&RÒf–æÅ&W7VÇBç66÷&S°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÅ&W7VÇBçv–ææW#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRæÆörçVç6†–gB†F÷W&æö’FW&Ö–ì:’¢G¶6†&7FW$æÖTg&öÔ–B†f–æÅ&W7VÇBçv–ææW"—ÒvvæRÆf–æÆRæ“°¢Ð¢ÒVÇ6R–b†ÖF6‚æ–BÓÓÒ&f–æÂ"’°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒv–ææW$6†&7FW$–C°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRæÆörçVç6†–gB†F÷W&æö’vvì:’"G¶6†&7FW$æÖTg&öÔ–B‡v–ææW$6†&7FW$–B—Òæ“°¢Ð¢&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°§Ð ¦gVæ7F–öâ†æFÆTg&–VæFÇ•F÷W&æÖVçDÖF6„6ö×ÆWFR‚’°¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢–b‚ÖF6‚ÇÂÖF6‚çv–ææW"’&WGW&ã°¢6öç7B6†&VD‡VÖäÖF6‚Ò&ööÆVâ…4U%dU%õ5”ä2æg&–VæFÇ”ÖF6‚ÇÂÖF6‚æ‡VÖåg4‡VÖâ“°¢6öç7Bv–ææW$VçG'’Ò6†&VD‡VÖäÖF6€¢ò‡7FFRç6WDÖF6‚æÖF6…v–ææW"ÓÓÒòÖF6‚çÆ–W$¢ÖF6‚çÆ–W$"¢¢7FFRç6WDÖF6‚æÖF6…v–ææW"ÓÓÒ ¢òe$”TäDÅ•õDõU$äÔTåBæVçG'¢¢†ÖF6‚çÆ–W$ÓÓÒe$”TäDÅ•õDõU$äÔTåBæVçG'’òÖF6‚çÆ–W$"¢ÖF6‚çÆ–W$“°¢ÖF6‚çv–ææW"Òv–ææW$VçG'“°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒF÷W&æÖVçD6ö×ÆWFVE6WE66÷&W4f÷$ÖF6‚†ÖF6‚“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°¢v–æF÷ræ6ÆV$–çFW'fÂ„e$”TäDÅ•õDõU$äÔTåBç7G&VÕF–ÖW"“°¢&W÷'Dg&–VæFÇ•F÷W&æÖVçE&W7VÇB†ÖF6‚“°¢–b‡6†&VD‡VÖäÖF6‚’ÆVfTöæÆ–æU&ööÒ‚“°¢e$”TäDÅ•õDõU$äÔTåBæ–äÖF6‚ÒfÇ6S°¢e$”TäDÅ•õDõU$äÔTåBæv—F–æt6ÇV$†÷W6U&WGW&âÒG'VS°¢e$”TäDÅ•õDõU$äÔTåBæ7W'&VçDÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢–b‡v–ææW$VçG'’ÓÓÒe$”TäDÅ•õDõU$äÔTåBæVçG'’’°¢7FFRæÆörçVç6†–gB‚$ÖF6‚FW&Ö–ì:’â&WF÷W&æRR4ÅT"„õU4RVâGFVæFçBÆf–âGRF÷W"â"“°¢ÒVÇ6R°¢7FFRæÆörçVç6†–gB‚%GRW2:–Æ–Ö–ì:’GRF÷W&æö’Ö–6Ââ&WF÷W&æRR4ÅT"„õU4R÷W"7V—g&RÆ7V—FRâ"“°¢Ð¢&VæFW"‚“°§Ð ¦gVæ7F–öâ†æFÆTÆVwVUF÷W&æÖVçDÖF6„6ö×ÆWFR‚’°¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢–b‚ÖF6‚ÇÂÖF6‚çv–ææW"’&WGW&ã°¢6öç7Bv–ææW$VçG'’ÒF÷W&æÖVçEv–ææW$VçG'”g&öÔÖF6…v–ææW"‡7FFRç6WDÖF6‚æÖF6…v–ææW"“°¢ÖF6‚çv–ææW"Òv–ææW$VçG'“°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒF÷W&æÖVçD6ö×ÆWFVE6WE66÷&W4f÷$ÖF6‚†ÖF6‚“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’FD‡VÖäÖF6…W&f÷&Öæ6T&öçW2†ÖF6‚“°¢–b†ÖF6‚æF’’°¢&WfVÄÆVwVTF’†ÖF6‚æF’“°¢&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢6öç7BæW‡DÖF6‚ÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢–b†æW‡DÖF6‚’°¢7FFRçF÷W&æÖVçBç7FvRÒ'&VG”æW‡B#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒæW‡DÖF6‚æ–C°¢7FFRæÆörçVç6†–gB†&ö6†–âÖF6‚ÄTuTR¢G¶æ–6¶æÖUfÇVR‚—Ò6öçG&RG¶6†&7FW$æÖTg&öÔ–B†÷öæVçD6†&7FW$–äÖF6‚†æW‡DÖF6‚Â‡VÖåF÷W&æÖVçDVçG'’‚’’—Òæ“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢6ö×ÆWFTÆVwVUv—F†÷WD‡VÖâ‚“°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6ö×ÆWFR"’&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢–b†ÖF6‚ç&÷VæBÓÓÒ'6VÖ’"’°¢&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢6öç7BæW‡DÖF6‚ÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢–b†æW‡DÖF6‚’°¢7FFRçF÷W&æÖVçBç7FvRÒ'&VG”æW‡B#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒæW‡DÖF6‚æ–C°¢7FFRæÆörçVç6†–gB†f–æÆRÄTuTR,:§FR6öçG&RG¶6†&7FW$æÖTg&öÔ–B†÷öæVçD6†&7FW$–äÖF6‚†æW‡DÖF6‚Â‡VÖåF÷W&æÖVçDVçG'’‚’’—Òæ“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢6ö×ÆWFTÆVwVUv—F†÷WD‡VÖâ‚“°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6ö×ÆWFR"’&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢–b†ÖF6‚ç&÷VæBÓÓÒ&f–æÂ"’°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒv–ææW$VçG'“°¢7FFRæÆörçVç6†–gB†ÄTuTRvvì:–R"G·F÷W&æÖVçEÆ–W$Æ&VÂ‡v–ææW$VçG'’—Òæ“°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°¢&VæFW"‚“°¢Ð§Ð ¦gVæ7F–öâ†æFÆUvVV¶Ç•F÷W&æÖVçDÖF6„6ö×ÆWFR‚’°¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢–b‚ÖF6‚ÇÂÖF6‚çv–ææW"’&WGW&ã°¢6öç7Bv–ææW$VçG'’ÒF÷W&æÖVçEv–ææW$VçG'”g&öÔÖF6…v–ææW"‡7FFRç6WDÖF6‚æÖF6…v–ææW"“°¢ÖF6‚çv–ææW"Òv–ææW$VçG'“°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒF÷W&æÖVçD6ö×ÆWFVE6WE66÷&W4f÷$ÖF6‚†ÖF6‚“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°¢&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢FD‡VÖäÖF6…W&f÷&Öæ6T&öçW2†ÖF6‚“°¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢&WfVÄÆÅF÷W&æÖVçD•6WG2†ÖF6‚ç&÷VæB“°¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢–b‡v–ææW$VçG'’ÓÒ‡VÖâ’°¢6ö×ÆWFUvVV¶Ç•F÷W&æÖVçDgFW$‡VÖäÆ÷72‚“°¢&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢6öç7BæW‡DÖF6‚ÒæW‡D‡VÖåF÷W&æÖVçDÖF6‚‚“°¢–b‚æW‡DÖF6‚’°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒ‡VÖã°¢&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢7FFRçF÷W&æÖVçBç7FvRÒ'&VG”æW‡B#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒæW‡DÖF6‚æ–C°¢7FFRæÆörçVç6†–gB†&ö6†–âÖF6‚¢G¶æ–6¶æÖUfÇVR‚—Ò6öçG&RG¶6†&7FW$æÖTg&öÔ–B†÷öæVçD6†&7FW$–äÖF6‚†æW‡DÖF6‚Â‡VÖâ’—Òæ“°§Ð ¦gVæ7F–öâ6ö×ÆWFUvVV¶Ç•F÷W&æÖVçDgFW$‡VÖäÆ÷72‚’°¢–b‡7FFRçF÷W&æÖVçBç&öw&W76—fTÆ—fU66÷&W2’°¢f÷"†ÆWBwV&BÒ²wV&BÂƒ²wV&B³Ò’°¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢6öç7BVæF–ærÒ7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç6–×VÆFVBbbÖF6‚çÆ–W$bbÖF6‚çÆ–W$"bbÖF6‚çv–ææW"“°¢–b‚VæF–æræÆVæwF‚’'&V³°¢VæF–æræf÷$V6‚‚†ÖF6‚’Óâ°¢f÷"†ÆWB7FWÒ²7FWÂƒbbÖF6‚çv–ææW#²7FW³Ò’Gfæ6U&öw&W76—fUF÷W&æÖVçDÖF6‚†ÖF6‚“°¢Ò“°¢Ð¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢6öç7B&öw&W76—fTf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒ&öw&W76—fTf–æÃòçv–ææW"ÇÂçVÆÃ°¢&WGW&ã°¢Ð¢f÷"†6öç7BÖF6‚öb7FFRçF÷W&æÖVçBæÖF6†W2’°¢–b†ÖF6‚çv–ææW"ÇÂÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"’6öçF–çVS°¢–b†ÖF6‚çÆ–&ÆR’6öçF–çVS°¢Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚“°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚æ†–FFVå6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢Ð¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b†f–æÃòçÆ–W$bbf–æÃòçÆ–W$"bbf–æÂçv–ææW"’°¢6öç7B&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚†f–æÂçÆ–W$Âf–æÂçÆ–W$"Â7FFRçF÷W&æÖVçBçF&vWE6WG2óò"“°¢f–æÂçv–ææW"Ò&W7VÇBçv–ææW#°¢f–æÂç66÷&RÒ&W7VÇBç66÷&S°¢Ð¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÃòçv–ææW"ÇÂçVÆÃ°§Ð ¦gVæ7F–öâ‡VÖåF÷W&æÖVçD6†–WfVÖVçB‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fR’&WGW&âçVÆÃ°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÓÓÒ‡VÖâ’&WGW&â'v–ææW"#°¢–b‡7FFRçF÷W&æÖVçBæÆVwVR’°¢6öç7Bf–æÄÆVwVRÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b†f–æÄÆVwVSòç66÷&Rbb†f–æÄÆVwVRçÆ–W$ÓÓÒ‡VÖâÇÂf–æÄÆVwVRçÆ–W$"ÓÓÒ‡VÖâ’’&WGW&â&f–æÆ—7B#°¢6öç7B‡VÖå6VÖ’Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–æB‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ'6VÖ’"bbÖF6‚ç66÷&Rbb†ÖF6‚çÆ–W$ÓÓÒ‡VÖâÇÂÖF6‚çÆ–W$"ÓÓÒ‡VÖâ’“°¢–b†‡VÖå6VÖ’’&WGW&â'6VÖ’#°¢–b†ÆVwVT6ö×ÆWFVDw&÷WF—2‚’ãÒ2’°¢f÷"†6öç7Bw&÷Wöb²$"Â$"%Ò’°¢6öç7B÷6—F–öâÒÆVwVU7FæF–æw2†w&÷WÂ2’æf–æD–æFW‚‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒ‡VÖâ“°¢–b‡÷6—F–öâãÒ’&WGW&â÷6—F–öâÓÓÒ"ò&w&÷W2"¢÷6—F–öâÓÓÒ2ò&w&÷WB"¢çVÆÃ°¢Ð¢Ð¢&WGW&âçVÆÃ°¢Ð¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’°¢6öç7BÆ–VD‡VÖäÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç66÷&Rbb†ÖF6‚çÆ–W$ÓÓÒ‡VÖâÇÂÖF6‚çÆ–W$"ÓÓÒ‡VÖâ’“°¢6öç7BÆ7BÒÆ–VD‡VÖäÖF6†W2æB‚Ó“°¢–b‚Æ7B’&WGW&âçVÆÃ°¢–b†Æ7Bç&÷VæBÓÓÒ&f–æÂ"’&WGW&âÆ7Bçv–ææW"ÓÓÒ‡VÖâò'v–ææW""¢&f–æÆ—7B#°¢–b†Æ7Bç&÷VæBÓÓÒ'6VÖ’"’&WGW&â'6VÖ’#°¢–b†Æ7Bç&÷VæBÓÓÒ'V'FW""’&WGW&â'V'FW"#°¢–b†Æ7Bç&÷VæBÓÓÒ'&÷VæCb"ÇÂÆ7Bç&÷VæBÓÓÒ'VÆ–b"’&WGW&â'&÷VæCb#°¢&WGW&âçVÆÃ°¢Ð¢6öç7B6VÖ”‡VÖâÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ”‡VÖâ"“°¢6öç7Bd‡VÖâÒF÷W&æÖVçDÖF6„'”–B‚'d‡VÖâ"“°¢–b†f–æÃòç66÷&Rbb†f–æÂçÆ–W$ÓÓÒ‡VÖâÇÂf–æÂçÆ–W$"ÓÓÒ‡VÖâ’’&WGW&â&f–æÆ—7B#°¢–b‡6VÖ”‡VÖãòç66÷&Rbb‡6VÖ”‡VÖâçÆ–W$ÓÓÒ‡VÖâÇÂ6VÖ”‡VÖâçÆ–W$"ÓÓÒ‡VÖâ’’&WGW&â'6VÖ’#°¢–b‡d‡VÖãòç66÷&Rbb‡d‡VÖâçÆ–W$ÓÓÒ‡VÖâÇÂd‡VÖâçÆ–W$"ÓÓÒ‡VÖâ’’&WGW&â'V'FW"#°¢&WGW&âçVÆÃ°§Ð ¦gVæ7F–öâ‡VÖä–æFW„–äÖF6‚†ÖF6‚’°¢–b‚ÖF6‚’&WGW&âçVÆÃ°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢–b†ÖF6‚çÆ–W$ÓÓÒ‡VÖâ’&WGW&â°¢–b†ÖF6‚çÆ–W$"ÓÓÒ‡VÖâ’&WGW&â°¢&WGW&âçVÆÃ°§Ð ¦gVæ7F–öâ‡VÖäÖF6…W&f÷&Öæ6T&öçW2†ÖF6‚Â6WE66÷&W2ÒF÷W&æÖVçD6ö×ÆWFVE6WE66÷&W4f÷$ÖF6‚†ÖF6‚’’°¢6öç7B‡VÖäÖF6„–æFW‚Ò‡VÖä–æFW„–äÖF6‚†ÖF6‚“°¢–b†‡VÖäÖF6„–æFW‚ÓÒçVÆÂ’&WGW&â²ö–çG3¢ÂFWF–Ç3¢µÒÓ°¢ÆWBö–çG2Ò°¢ÆWBvöå6WG2Ò°¢ÆWBÆ÷7E6WG2Ò°¢6öç7BFWF–Ç2ÒµÓ°¢f÷"†6öç7B66÷&Röb6WE66÷&W2ÇÂµÒ’°¢6öç7B‡VÖävÖW2Ò66÷&U¶‡VÖäÖF6„–æFW…Òóò°¢6öç7B÷öæVçDvÖW2Ò66÷&U¶÷öæVçDöb†‡VÖäÖF6„–æFW‚•Òóò°¢–b†‡VÖävÖW2â÷öæVçDvÖW2’°¢vöå6WG2³Ò°¢ö–çG2³ÒS°¢6öç7BvÒ‡VÖävÖW2Ò÷öæVçDvÖW3°¢ö–çG2³Òv°¢FWF–Ç2çW6‚†6WBvvì:’G¶‡VÖävÖW7ÒòG¶÷öæVçDvÖW7Ó¢²G³R²vÖ“°¢ÒVÇ6R°¢Æ÷7E6WG2³Ò°¢Ð¢Ð¢–b†ÖF6‚çv–ææW"ÓÓÒ‡VÖåF÷W&æÖVçDVçG'’‚’bbÆ÷7E6WG2ÓÓÒbbvöå6WG2â’°¢ö–çG2³ÒS°¢FWF–Ç2çW6‚‚%f–7Fö—&R6ç2W&G&RFR6WC¢³R"“°¢Ð¢&WGW&â²ö–çG2ÂFWF–Ç2Ó°§Ð ¦gVæ7F–öâFD‡VÖäÖF6…W&f÷&Öæ6T&öçW2†ÖF6‚’°¢–b‚7FFRçF÷W&æÖVçBçvVV¶Ç’ÇÂÖF6‚ÇÂÖF6‚çW&f÷&Öæ6T&öçW5&V6÷&FVB’&WGW&ã°¢6öç7B&öçW2Ò‡VÖäÖF6…W&f÷&Öæ6T&öçW2†ÖF6‚“°¢6öç7BÖF6…v–åö–çG2ÒÖF6‚çv–ææW"ÓÓÒ‡VÖåF÷W&æÖVçDVçG'’‚¢òçVÖ&W"‡7FFRçF÷W&æÖVçBæ6ö×WF—F–öåö–çG3òæÖF6…v–âÇÂ¢¢°¢ÖF6‚çW&f÷&Öæ6T&öçW5&V6÷&FVBÒG'VS°¢ÖF6‚çW&f÷&Öæ6T&öçW5ö–çG2Ò&öçW2çö–çG2²ÖF6…v–åö–çG3°¢ÖF6‚çW&f÷&Öæ6T&öçW4FWF–Ç2Ò&öçW2æFWF–Ç3°¢7FFRçF÷W&æÖVçBæÖF6„&öçW5ö–çG2Ò‡7FFRçF÷W&æÖVçBæÖF6„&öçW5ö–çG2ÇÂ’²&öçW2çö–çG2²ÖF6…v–åö–çG3°¢6öç7BFWF–Ç2Ò²ââæ&öçW2æFWF–Ç2Ââââ†ÖF6…v–åö–çG2ò¶ÖF6‚vvì:“¢²G¶ÖF6…v–åö–çG7ÖÒ¢µÒ•Ó°¢7FFRçF÷W&æÖVçBæÖF6„&öçW4FWF–Ç2Ò²âââ‡7FFRçF÷W&æÖVçBæÖF6„&öçW4FWF–Ç2ÇÂµÒ’ÂââæFWF–Ç2æÖ‚†FWF–Â’ÓâG¶ÖF6‚æÆ&VÇÓ¢G¶FWF–ÇÖ•Ó°¢–b†&öçW2çö–çG2²ÖF6…v–åö–çG2’°¢7FFRæÆörçVç6†–gB†G¶ÖF6‚æÆ&VÇÓ¢&öçW2W&f÷&Öæ6R²G¶&öçW2çö–çG2²ÖF6…v–åö–çG7Òö–çG2æ“°¢Ð§Ð ¦gVæ7F–öâ‡VÖåF÷W&æÖVçEö–çG2‚’°¢6öç7B6†–WfVÖVçBÒ‡VÖåF÷W&æÖVçD6†–WfVÖVçB‚“°¢–b‚6†–WfVÖVçB’&WGW&â²6†–WfVÖVçC¢çVÆÂÂö–çG3¢Ó°¢6öç7Bö–çG5F&ÆRÒ7FFRçF÷W&æÖVçBæ6ö×WF—F–öåö–çG2ÇÂ·Ó°¢6öç7BVÆ–f–6F–öåö–çG2ÒçVÖ&W"‡ö–çG5F&ÆU¶6†–WfVÖVçEÒÇÂ“°¢6öç7B&öçW5ö–çG2ÒçVÖ&W"‡7FFRçF÷W&æÖVçBæÖF6„&öçW5ö–çG2ÇÂ“°¢&WGW&â°¢6†–WfVÖVçBÀ¢VÆ–f–6F–öåö–çG2À¢&öçW5ö–çG2À¢ö–çG3¢VÆ–f–6F–öåö–çG2²&öçW5ö–çG2À¢Ó°§Ð ¦gVæ7F–öâ‡VÖåF÷W&æÖVçD•&W7VÇG2‚’°¢–b‚7FFRçF÷W&æÖVçBçvVV¶Ç’’&WGW&âµÓ°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢&WGW&â7FFRçF÷W&æÖVçBæÖF6†W0¢æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç66÷&RbbÖF6‚çv–ææW"bb†ÖF6‚çÆ–W$ÓÓÒ‡VÖâÇÂÖF6‚çÆ–W$"ÓÓÒ‡VÖâ’¢æÖ‚†ÖF6‚’Óâ°¢6öç7B”6†&7FW$–BÒF÷W&æÖVçDVçG'”6†&7FW$–B†ÖF6‚çÆ–W$ÓÓÒ‡VÖâòÖF6‚çÆ–W$"¢ÖF6‚çÆ–W$“°¢&WGW&â°¢”6†&7FW$–BÀ¢&W7VÇC¢ÖF6‚çv–ææW"ÓÓÒ‡VÖâò'v–â"¢&Æ÷72"À¢Ó°¢Ò¢æf–ÇFW"‚†—FVÒ’Óâ—FVÒæ”6†&7FW$–B“°§Ð ¦gVæ7F–öâ‡VÖåF÷W&æÖVçDÆ7DÖF6…7VÖÖ'’‚’°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢6öç7BÖF6†W2Ò‡7FFRçF÷W&æÖVçBæÖF6†W2ÇÂµÒ’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç66÷&Rbb†ÖF6‚çÆ–W$ÓÓÒ‡VÖâÇÂÖF6‚çÆ–W$"ÓÓÒ‡VÖâ’“°¢6öç7BÖF6‚ÒÖF6†W2æB‚Ó“°¢–b‚ÖF6‚’&WGW&â²Æ7D÷öæVçC¢""ÂÆ7E66÷&S¢""Ó°¢6öç7B÷öæVçDVçG'’ÒÖF6‚çÆ–W$ÓÓÒ‡VÖâòÖF6‚çÆ–W$"¢ÖF6‚çÆ–W$°¢6öç7BÆ7D÷öæVçBÒF÷W&æÖVçEÆ–W$Æ&VÂ†÷öæVçDVçG'’“°¢6öç7BÆ7E66÷&RÒ'&’æ—4'&’†ÖF6‚ç66÷&R¢òÖF6‚ç66÷&RæÖ‚‡66÷&R’Óâ'&’æ—4'&’‡66÷&R’ò66÷&Ræ¦ö–â‚"ò"’¢7G&–ær‡66÷&R’’æ¦ö–â‚"Ò"¢¢7G&–ær†ÖF6‚ç66÷&RÇÂ""“°¢&WGW&â²Æ7D÷öæVçBÂÆ7E66÷&RÓ°§Ð ¦7–æ2gVæ7F–öâ&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚’°¢–b‚7FFRçF÷W&æÖVçBçvVV¶Ç’ÇÂ7FFRçF÷W&æÖVçBçö–çG5&V6÷&FVBÇÂ7FFRçF÷W&æÖVçBæ6ö×WF—F–öä–B’&WGW&ã°¢6öç7B²6†–WfVÖVçBÂö–çG2ÂVÆ–f–6F–öåö–çG2Â&öçW5ö–çG2ÒÒ‡VÖåF÷W&æÖVçEö–çG2‚“°¢–b‚6†–WfVÖVçB’&WGW&ã°¢7FFRçF÷W&æÖVçBçö–çG5&V6÷&FVBÒG'VS°¢6öç7BÆ7DÖF6‚Ò‡VÖåF÷W&æÖVçDÆ7DÖF6…7VÖÖ'’‚“°¢7FFRæÆörçVç6†–gB†G·7FFRçF÷W&æÖVçBæ6ö×WF—F–öäæÖWÒ¢,:—7VÇFBG¶6†–WfVÖVçGÒÂG·VÆ–f–6F–öåö–çG7Òö–çG2FR&6÷W'2²G¶&öçW5ö–çG7Òö–çG2&öçW2ÒG·ö–çG7Òö–çG2÷W"FVÖ–âæ“°¢G'’°¢v—BWF…&WVW7B†ö’ö6ö×WF—F–öç2òG¶Væ6öFUU$”6ö×öæVçB‡7FFRçF÷W&æÖVçBæ6ö×WF—F–öä–B—Ò÷66÷&VÂ°¢ö–çG2À¢6†–WfVÖVçBÀ¢&÷VæE&V6†VC¢6†–WfVÖVçBÀ¢Æ7D÷öæVçC¢Æ7DÖF6‚æÆ7D÷öæVçBÀ¢Æ7E66÷&S¢Æ7DÖF6‚æÆ7E66÷&RÀ¢•&W7VÇG3¢‡VÖåF÷W&æÖVçD•&W7VÇG2‚’À¢Ò“°¢v—BFVÆWFUF÷W&æÖVçE&öw&W72‚“°¢v—BÆöD6ö×WF—F–öç2‚“°¢v—BÆöE&æ¶–ær‚“°¢&VæFW"‚“°¢Ò6F6‚†W'&÷"’°¢7FFRæÆörçVç6†–gB†66÷&R†V&FöÖF—&RæöâVç&Vv—7G,:’¢G¶W'&÷"æÖW76vWÖ“°¢&VæFW"‚“°¢Ð§Ð ¦gVæ7F–öâ7F'EF÷W&æÖVçE6VÖ’‚’°¢–b‚‡7FFRçF÷W&æÖVçBçvVV¶Ç’ÇÂ7FFRçF÷W&æÖVçBæ'&6¶WCbÇÂ7FFRçF÷W&æÖVçBæÆVwVRÇÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—’bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”æW‡B"’°¢7F'EvVV¶Ç”æW‡DÖF6‚‚“°¢&WGW&ã°¢Ð¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ7FFRçF÷W&æÖVçBç7FvRÓÒ'&VG•6VÖ’"’&WGW&ã°¢6öç7B6VÖ’ÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ”‡VÖâ"“°¢7FFRçF÷W&æÖVçBç7FvRÒ'6VÖ’#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Ò'6VÖ”‡VÖâ#°¢4ôÄõô’æVæ&ÆVBÒG'VS°¢4ôÄõô’çÆ–W$–æFW‚Ò°¢4ôÄõô’æ6†&7FW$–BÒ6VÖ’çÆ–W$#°¢7F'DÖF6„ÖöFR‡7FFRçF÷W&æÖVçBçF&vWE6WG2óò"Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢7FFRçF÷W&æÖVçBç7FvRÒ'6VÖ’#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Ò'6VÖ”‡VÖâ#°¢7FFRæÆörçVç6†–gB†FVÖ’Öf–æÆRGRF÷W&æö’¢G·6VÆV7FVEÆ–W$æÖR‚—Ò6öçG&RG¶6†&7FW$æÖTg&öÔ–B…4ôÄõô’æ6†&7FW$–B—Òæ“°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ7F'EF÷W&æÖVçDf–æÂ‚’°¢–b‚‡7FFRçF÷W&æÖVçBçvVV¶Ç’ÇÂ7FFRçF÷W&æÖVçBæ'&6¶WCbÇÂ7FFRçF÷W&æÖVçBæÆVwVRÇÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—’bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”æW‡B"’°¢7F'EvVV¶Ç”æW‡DÖF6‚‚“°¢&WGW&ã°¢Ð¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ7FFRçF÷W&æÖVçBç7FvRÓÒ'&VG”f–æÂ"’&WGW&ã°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢f–æÂçÆ–W$Ò‡VÖåF÷W&æÖVçDVçG'’‚“°¢f–æÂçÆ–W$"Ò7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–C°¢7FFRçF÷W&æÖVçBç7FvRÒ&f–æÂ#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Ò&f–æÂ#°¢4ôÄõô’æVæ&ÆVBÒG'VS°¢4ôÄõô’çÆ–W$–æFW‚Ò°¢4ôÄõô’æ6†&7FW$–BÒ7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–C°¢7F'DÖF6„ÖöFR‡7FFRçF÷W&æÖVçBçF&vWE6WG2óò"Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢7FFRçF÷W&æÖVçBç7FvRÒ&f–æÂ#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚Ò&f–æÂ#°¢7FFRæÆörçVç6†–gB†f–æÆRGRF÷W&æö’¢G·6VÆV7FVEÆ–W$æÖR‚—Ò6öçG&RG¶6†&7FW$æÖTg&öÔ–B…4ôÄõô’æ6†&7FW$–B—Òæ“°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ7F'EvVV¶Ç”æW‡DÖF6‚‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ‚7FFRçF÷W&æÖVçBçvVV¶Ç’bb7FFRçF÷W&æÖVçBæ'&6¶WCbbb7FFRçF÷W&æÖVçBæÆVwVRbb7FFRçF÷W&æÖVçBæ6†×–öç6†—’ÇÂ7FFRçF÷W&æÖVçBç7FvRÓÒ'&VG”æW‡B"’&WGW&ã°¢6öç7B6†×–öç6†—æW‡BÒ7FFRçF÷W&æÖVçBæ6†×–öç6†—òGfæ6T6†×–öç6†—FôæW‡D‡VÖäÖF6‚‚’¢çVÆÃ°¢6öç7BÖF6‚Ò6†×–öç6†—æW‡BÇÂF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–B“°¢–b‚ÖF6‚’&WGW&ã°¢7FFRçF÷W&æÖVçBç7FvRÒÖF6‚ç&÷VæC°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒÖF6‚æ–C°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÒÖF6‚æ6†×–öç6†—†6S°¢DõU$äÔTåEõäTÅõT’æ6†×–öç6†—÷Vå¦öæRÒÖF6‚æ6†×–öç6†—†6S°¢Ð¢7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BÒçVÆÃ°¢4ôÄõô’æVæ&ÆVBÒG'VS°¢4ôÄõô’çÆ–W$–æFW‚Ò°¢4ôÄõô’æ6†&7FW$–BÒ÷öæVçD6†&7FW$–äÖF6‚†ÖF6‚Â‡VÖåF÷W&æÖVçDVçG'’‚’“°¢7F'DÖF6„ÖöFR‡7FFRçF÷W&æÖVçBçF&vWE6WG2óò"Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢7FFRçF÷W&æÖVçBç7FvRÒÖF6‚ç&÷VæC°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒÖF6‚æ–C°¢7FFRæÆörçVç6†–gB†G¶ÖF6‚æÆ&VÇÒ¢G·6VÆV7FVEÆ–W$æÖR‚—Ò6öçG&RG¶6†&7FW$æÖTg&öÔ–B…4ôÄõô’æ6†&7FW$–B—Òæ“°¢&VæFW"‚“°§Ð ¦gVæ7F–öâWFFUF÷W&æÖVçE6WE&öw&W72‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ7FFRç6WDÖF6‚ç6WD÷fW"ÇÂ7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚’&WGW&ã°¢6öç7B7W'&VçBÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢–b†7W'&VçBbb7W'&VçBç66÷&R’°¢7W'&VçBæÆ—fU66÷&RÒF÷W&æÖVçD6ö×ÆWFVE6WE66÷&R†7W'&VçB“°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢VÇ6R–b‡7FFRçF÷W&æÖVçBæÆVwVR’&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢VÇ6R–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢VÇ6R&Vg&W6…F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢&WfVÄæW‡EF÷W&æÖVçD•6WB‚“°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢VÇ6R–b‡7FFRçF÷W&æÖVçBæÆVwVR’&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢VÇ6R–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢VÇ6R&Vg&W6…F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°§Ð ¦gVæ7F–öâ&WfVÄæW‡EF÷W&æÖVçD•6WB‚’°¢–b‡7FFRçF÷W&æÖVçCòç&öw&W76—fTÆ—fU66÷&W2’&WGW&ã°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’°¢6öç7B7W'&VçBÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢–b‚7W'&VçB’&WGW&ã°¢f÷"†6öç7BÖF6‚öb6†×–öç6†—ÖF6†W2†7W'&VçBæ6†×–öç6†—†6RÂ7W'&VçBæF’’’°¢–b‚ÖF6‚ç6–×VÆFVBÇÂVç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’6öçF–çVS°¢–b‚†ÖF6‚ç&WfVÆVE6WE66÷&W2óòµÒ’æÆVæwF‚ãÒÖF6‚æ†–FFVå6WE66÷&W2æÆVæwF‚’6öçF–çVS°¢ÖF6‚ç&WfVÆVE6WE66÷&W2çW6‚†ÖF6‚æ†–FFVå6WE66÷&W5¶ÖF6‚ç&WfVÆVE6WE66÷&W2æÆVæwF…Ò“°¢ÖF6‚æÆ—fU66÷&RÒG¶f÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2—Ò+rTâD•$T5F°¢–b†ÖF6‚ç&WfVÆVE6WE66÷&W2æÆVæwF‚ãÒÖF6‚æ†–FFVå6WE66÷&W2æÆVæwF‚’°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°¢&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢Ð¢Ð¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢&WGW&ã°¢Ð¢6öç7B&÷VæBÒ²'&÷VæCb"Â'VÆ–b"Â'V'FW""Â'6VÖ’%Òæ–æ6ÇVFW2‡7FFRçF÷W&æÖVçBç7FvR’ò7FFRçF÷W&æÖVçBç7FvR¢çVÆÃ°¢–b‚&÷VæB’&WGW&ã°¢f÷"†6öç7BÖF6‚öb6–×VÆFVEF÷W&æÖVçDÖF6†W2‡&÷VæB’’°¢–b‚Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’6öçF–çVS°¢–b‚†ÖF6‚ç&WfVÆVE6WE66÷&W2óòµÒ’æÆVæwF‚ãÒÖF6‚æ†–FFVå6WE66÷&W2æÆVæwF‚’6öçF–çVS°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚ç&WfVÆVE6WE66÷&W2óòµÓ°¢ÖF6‚ç&WfVÆVE6WE66÷&W2çW6‚†ÖF6‚æ†–FFVå6WE66÷&W5¶ÖF6‚ç&WfVÆVE6WE66÷&W2æÆVæwF…Ò“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢–b†ÖF6‚ç&WfVÆVE6WE66÷&W2æÆVæwF‚ãÒÖF6‚æ†–FFVå6WE66÷&W2æÆVæwF‚’°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢Ð¢Ð¢&Vg&W6…F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°§Ð ¦gVæ7F–öâ&WfVÄÆÅF÷W&æÖVçD•6WG2‡&÷VæBÒçVÆÂ’°¢–b‡7FFRçF÷W&æÖVçCòç&öw&W76—fTÆ—fU66÷&W2’°¢f÷"†6öç7BÖF6‚öb6–×VÆFVEF÷W&æÖVçDÖF6†W2‡&÷VæB’’°¢f÷"†ÆWBwV&BÒ²wV&BÂƒbbÖF6‚çv–ææW#²wV&B³Ò’Gfæ6U&öw&W76—fUF÷W&æÖVçDÖF6‚†ÖF6‚“°¢Ð¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢&WGW&ã°¢Ð¢f÷"†6öç7BÖF6‚öb6–×VÆFVEF÷W&æÖVçDÖF6†W2‡&÷VæB’’°¢–b‚Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’6öçF–çVS°¢–b‚ÖF6‚æ†–FFVå6WE66÷&W3òæÆVæwF‚’6öçF–çVS°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚æ†–FFVå6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢Ð¢&Vg&W6…F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°§Ð ¦gVæ7F–öâ6–×VÆFVEF÷W&æÖVçDÖF6†W2‡&÷VæBÒçVÆÂ’°¢&WGW&â7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç6–×VÆFVBbb‚&÷VæBÇÂÖF6‚ç&÷VæBÓÓÒ&÷VæB’“°§Ð ¦gVæ7F–öâVç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’°¢–b‚ÖF6ƒòç6–×VÆFVB’&WGW&âfÇ6S°¢–b†ÖF6‚æ†–FFVå6WE66÷&W3òæÆVæwF‚bbÖF6‚æ†–FFVåv–ææW"’&WGW&âG'VS°¢–b‚ÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"’&WGW&âfÇ6S°¢6öç7B&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚†ÖF6‚çÆ–W$ÂÖF6‚çÆ–W$"Â7FFRçF÷W&æÖVçBçF&vWE6WG2óò"ÂÖF6‚“°¢ÖF6‚æ†–FFVåv–ææW"Ò&W7VÇBçv–ææW#°¢ÖF6‚æ†–FFVå6WE66÷&W2Ò&W7VÇBç6WE66÷&W3°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒµÓ°¢ÖF6‚ç66÷&RÒçVÆÃ°¢ÖF6‚çv–ææW"ÒçVÆÃ°¢&WGW&âG'VS°§Ð ¦gVæ7F–öâ6ö×ÆWFUF÷W&æÖVçEv—F†÷WD‡VÖâ‡6VÖ”‡VÖåv–ææW"’°¢&WfVÄÆÅF÷W&æÖVçD•6WG2‚'6VÖ’"“°¢6öç7B6VÖ”’ÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ”’"“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢f–æÂçÆ–W$Ò6VÖ”‡VÖåv–ææW#°¢f–æÂçÆ–W$"Ò6VÖ”’æ†–FFVåv–ææW#°¢6öç7Bf–æÅ&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚‡6VÖ”‡VÖåv–ææW"Â6VÖ”’æ†–FFVåv–ææW"Â7FFRçF÷W&æÖVçBçF&vWE6WG2óò"“°¢f–æÂçv–ææW"Òf–æÅ&W7VÇBçv–ææW#°¢f–æÂç66÷&RÒf–æÅ&W7VÇBç66÷&S°¢7FFRçF÷W&æÖVçBæ”f–æÆ—7D6†&7FW$–BÒ6VÖ”’æ†–FFVåv–ææW#°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÅ&W7VÇBçv–ææW#°¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÒçVÆÃ°¢7FFRæÆörçVç6†–gB†F÷W&æö’FW&Ö–ì:’¢G¶6†&7FW$æÖTg&öÔ–B†f–æÅ&W7VÇBçv–ææW"—ÒvvæRÆf–æÆRæ“°¢&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°§Ð ¦gVæ7F–öâ&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ‚7FFRçF÷W&æÖVçBçvVV¶Ç’bb7FFRçF÷W&æÖVçBæ'&6¶WCb’’&WGW&ã°¢–b„çVÖ&W"‡7FFRçF÷W&æÖVçBæ'&6¶WE6—¦RÇÂb’ÓÒb’°¢6öç7B&÷VæG2Ò²'&÷VæC3""Â'&÷VæCb"Â'V'FW""Â'6VÖ’"Â&f–æÂ%Ð¢æÖ‚‡&÷VæB’Óâ7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ&÷VæB’¢æf–ÇFW"‚†ÖF6†W2’ÓâÖF6†W2æÆVæwF‚“°¢f÷"†ÆWB&÷VæD–æFW‚Ò²&÷VæD–æFW‚Â&÷VæG2æÆVæwFƒ²&÷VæD–æFW‚³Ò’°¢6öç7B&Wf–÷W2Ò&÷VæG5·&÷VæD–æFW‚ÒÓ°¢&÷VæG5·&÷VæD–æFW…Òæf÷$V6‚‚†ÖF6‚Â–æFW‚’Óâ°¢6öç7BÆVgBÒ&Wf–÷W5¶–æFW‚¢%Ó°¢6öç7B&–v‡BÒ&Wf–÷W5²†–æFW‚¢"’²Ó°¢–b†ÆVgCòçv–ææW"ÇÂ&–v‡Còçv–ææW"’6WDÖF6…Æ–W'2†ÖF6‚ÂÆVgCòçv–ææW"ÇÂçVÆÂÂ&–v‡Còçv–ææW"ÇÂçVÆÂ“°¢Ò“°¢Ð¢&WGW&ã°¢Ð¢6öç7B#eóÒF÷W&æÖVçDÖF6„'”–B‚'#eó"“°¢6öç7B#eó"ÒF÷W&æÖVçDÖF6„'”–B‚'#eó""“°¢6öç7B#eó2ÒF÷W&æÖVçDÖF6„'”–B‚'#eó2"“°¢6öç7B#eóBÒF÷W&æÖVçDÖF6„'”–B‚'#eóB"“°¢6öç7B#eóRÒF÷W&æÖVçDÖF6„'”–B‚'#eóR"“°¢6öç7B#eóbÒF÷W&æÖVçDÖF6„'”–B‚'#eób"“°¢6öç7B#eórÒF÷W&æÖVçDÖF6„'”–B‚'#eór"“°¢6öç7B#eó‚ÒF÷W&æÖVçDÖF6„'”–B‚'#eó‚"“°¢6öç7BcÒF÷W&æÖVçDÖF6„'”–B‚'c"“°¢6öç7Bc"ÒF÷W&æÖVçDÖF6„'”–B‚'c""“°¢6öç7Bc2ÒF÷W&æÖVçDÖF6„'”–B‚'c2"“°¢6öç7BcBÒF÷W&æÖVçDÖF6„'”–B‚'cB"“°¢6öç7B6VÖ“ÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ“"“°¢6öç7B6VÖ“"ÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ“""“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b‡cbb‡#eóòçv–ææW"ÇÂ#eó#òçv–ææW"’’6WDÖF6…Æ–W'2‡cÂ#eóòçv–ææW"ÇÂçVÆÂÂ#eó#òçv–ææW"ÇÂçVÆÂ“°¢–b‡c"bb‡#eó3òçv–ææW"ÇÂ#eóCòçv–ææW"’’6WDÖF6…Æ–W'2‡c"Â#eó3òçv–ææW"ÇÂçVÆÂÂ#eóCòçv–ææW"ÇÂçVÆÂ“°¢–b‡c2bb‡#eóSòçv–ææW"ÇÂ#eócòçv–ææW"’’6WDÖF6…Æ–W'2‡c2Â#eóSòçv–ææW"ÇÂçVÆÂÂ#eócòçv–ææW"ÇÂçVÆÂ“°¢–b‡cBbb‡#eósòçv–ææW"ÇÂ#eóƒòçv–ææW"’’6WDÖF6…Æ–W'2‡cBÂ#eósòçv–ææW"ÇÂçVÆÂÂ#eóƒòçv–ææW"ÇÂçVÆÂ“°¢–b‡6VÖ“bb‡còçv–ææW"ÇÂc#òçv–ææW"’’6WDÖF6…Æ–W'2‡6VÖ“Âcòçv–ææW"ÇÂçVÆÂÂc#òçv–ææW"ÇÂçVÆÂ“°¢–b‡6VÖ“"bb‡c3òçv–ææW"ÇÂcCòçv–ææW"’’6WDÖF6…Æ–W'2‡6VÖ“"Âc3òçv–ææW"ÇÂçVÆÂÂcCòçv–ææW"ÇÂçVÆÂ“°¢–b†f–æÂbb‡6VÖ“òçv–ææW"ÇÂ6VÖ“#òçv–ææW"’’6WDÖF6…Æ–W'2†f–æÂÂ6VÖ“òçv–ææW"ÇÂçVÆÂÂ6VÖ“#òçv–ææW"ÇÂçVÆÂ“°§Ð ¦gVæ7F–öâ&Vg&W6…F÷W&æÖVçDFW&—fVE6Æ÷G2‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fR’&WGW&ã°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’ÇÂ7FFRçF÷W&æÖVçBæ'&6¶WCb’°¢&Vg&W6…vVV¶Ç•F÷W&æÖVçDFW&—fVE6Æ÷G2‚“°¢&WGW&ã°¢Ð¢6öç7Bd‡VÖâÒF÷W&æÖVçDÖF6„'”–B‚'d‡VÖâ"“°¢6öç7Bd“ÒF÷W&æÖVçDÖF6„'”–B‚'d“"“°¢6öç7Bd“"ÒF÷W&æÖVçDÖF6„'”–B‚'d“""“°¢6öç7Bd“2ÒF÷W&æÖVçDÖF6„'”–B‚'d“2"“°¢6öç7B6VÖ”‡VÖâÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ”‡VÖâ"“°¢6öç7B6VÖ”’ÒF÷W&æÖVçDÖF6„'”–B‚'6VÖ”’"“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“° ¢–b‡6VÖ”‡VÖâ’°¢6WDÖF6…Æ–W'2‡6VÖ”‡VÖâÂd‡VÖãòçv–ææW"ÇÂçVÆÂÂd“òçv–ææW"ÇÂçVÆÂ“°¢Ð¢–b‡6VÖ”’’°¢6öç7B†5VÆ–f–W"Ò&ööÆVâ‡d“#òçv–ææW"ÇÂd“3òçv–ææW"“°¢6WDÖF6…Æ–W'2‡6VÖ”’Âd“#òçv–ææW"ÇÂçVÆÂÂd“3òçv–ææW"ÇÂçVÆÂ“°¢–b‚†5VÆ–f–W"’°¢6VÖ”’æ†–FFVåv–ææW"ÒçVÆÃ°¢6VÖ”’æ†–FFVå6WE66÷&W2ÒçVÆÃ°¢6VÖ”’ç&WfVÆVE6WE66÷&W2ÒµÓ°¢6VÖ”’ç66÷&RÒçVÆÃ°¢6VÖ”’çv–ææW"ÒçVÆÃ°¢Ð¢Ð¢–b†f–æÂ’°¢6WDÖF6…Æ–W'2†f–æÂÂ6VÖ”‡VÖãòçv–ææW"ÇÂçVÆÂÂ6VÖ”“òçv–ææW"ÇÂçVÆÂ“°¢Ð§Ð ¦gVæ7F–öâ•7G–ÆTÆ&VÂ‚’°¢&WGW&â°¢ÖFWW#¢&ÖFWW""À¢æ÷&ÖÃ¢&æ÷&ÖÂ"À¢W‡W'C¢&W‡W'B"À¢6†×–öã¢&6†×–öâ"À¢ÆVvVæC¢&Ì:–vVæFR"À¢Õ¶æ÷&ÖÆ—¦T”–çFVÆÆ–vVæ6R…4ôÄõô’ç7G–ÆR•Ó°§Ð ¦gVæ7F–öâæW‡E6WDW†6†ævR‚’°¢–b‚7FFRç6WDÖF6‚æVæ&ÆVBÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚ç6WD÷fW"ÇÂ7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&ã°¢–b…4U%dU%õ5”ä2æVæ&ÆVBbb4U%dU%õ5”ä2æ—4†÷7B’°¢7FFRæÆörçVç6†–gB‚%6WVÂÂvŒ;GFRWWBÆæ6W"Â|:–6†ævR7V—fçBVâÆ–væRâ"“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢–b…TÅD”ÔDUôÔôDRæ7F—fRbbTÅD”ÔDUôÔôDRç÷7DW†6†ævSòæ6ö×ÆWFVB’°¢–b‚TÅD”ÔDUôÔôDRç÷7DW†6†ævR’&Vv–åVÇF–ÖFU÷7DW†6†ævR‡7FFRç&W7VÇD–æfóòçv–ææW"óò“°¢VÇ6R&VæFW%VÇF–ÖFU÷7DW†6†ævT6†ö–6R‚“°¢&WGW&ã°¢Ð¢6öç7B6W'fW"ÒæW‡E6WE6W'fW"‚“°¢æWtvÖR‡²&W6W'fU6WC¢G'VRÂ6W'fW$÷fW'&–FS¢6W'fW"Ò“°¢Ö&µ6W'fW$F—'G”f÷$†÷7D7F–öâ‚“°§Ð ¦gVæ7F–öâæW‡DgVÆÅ6WB‚’°¢–b‚7FFRç6WDÖF6‚æVæ&ÆVBÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚ç6WD÷fW"ÇÂ7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&ã°¢–b…4U%dU%õ5”ä2æVæ&ÆVBbb4U%dU%õ5”ä2æ—4†÷7B’°¢7FFRæÆörçVç6†–gB‚%6WVÂÂvŒ;GFRWWBÆæ6W"ÆR6WB7V—fçBVâÆ–væRâ"“°¢&VæFW"‚“°¢&WGW&ã°¢Ð¢–b…TÅD”ÔDUôÔôDRæ7F—fR’TÅD”ÔDUôÔôDRç÷7DW†6†ævRÒçVÆÃ°¢6öç7B6ö×ÆWFVE66÷&W2Ò7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢6öç7BF&vWE6WG2Ò7FFRç6WDÖF6‚çF&vWE6WG3°¢6öç7B6WG5vöâÒ²ââç7FFRç6WDÖF6‚ç6WG5vöåÓ°¢6öç7BÖöÖVçGVÒÒ6ÆöæTFF‡7FFRç6WDÖF6‚æÖöÖVçGVÒÇÂV×G”ÖöÖVçGVÕ7FFR‚’“°¢7FFRç6WDÖF6‚Ò°¢Væ&ÆVC¢G'VRÀ¢66÷&S¢³ÂÒÀ¢6ö×ÆWFVE66÷&W2À¢&Wf–÷W56W'fW#¢çVÆÂÀ¢W†6†ævTçVÖ&W#¢À¢FV6—6—fTW†6†ævS¢fÇ6RÀ¢6WD÷fW#¢fÇ6RÀ¢v–ææW#¢çVÆÂÀ¢F&vWE6WG2À¢6WG5vöâÀ¢ÖF6„÷fW#¢fÇ6RÀ¢ÖF6…v–ææW#¢çVÆÂÀ¢ÖöÖVçGVÒÀ¢Ó°¢6öç7B6W'fW"ÒÖF‚ç&æFöÒ‚’ÂãRò¢°¢æWtvÖR‡²&W6W'fU6WC¢G'VRÂ6W'fW$÷fW'&–FS¢6W'fW"Â&W6WEVÇF–ÖFS¢TÅD”ÔDUôÔôDRæ7F—fRÒ“°¢7FFRæÆörçVç6†–gB‚$æ÷WfVR6WBÆæ<:’â"“°¢Ö&µ6W'fW$F—'G”f÷$†÷7D7F–öâ‚“°¢&VæFW"‚“°¢–b…TÅD”ÔDUôÔôDRæ7F—fR’&Vv–åVÇF–ÖFTG&gBƒÂÂ'6WB×7F'B"“°§Ð ¦gVæ7F–öâ6äFÖ–å6–×VÆFTÖF6…66÷&R‚’°¢&WGW&â6ä66W74FÖ–äfVGW&W2‚¢bb5T5DDõ%ôÔôDRæVæ&ÆV@¢bb7FFRç6WDÖF6ƒòæVæ&ÆV@¢bbçVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2ÇÂ’â ¢bb7FFRç6WDÖF6‚æÖF6„÷fW ¢bb‚4U%dU%õ5”ä2æVæ&ÆVBÇÂ4U%dU%õ5”ä2æ—4†÷7B“°§Ð ¦gVæ7F–öâFÖ–å6–×VÆFVE6WE66÷&W2‡v–ææW$–æFW‚ÂF&vWE6WG2’°¢–b‡7FFRçF÷W&æÖVçCòæöæUö–çDvÖRÇÂ7FFRçF÷W&æÖVçCòæg&–VæFÇ”f÷&ÖBÓÓÒ&öæWö–çB"’°¢6öç7Bv–ææW$vÖW2ÒÖF‚ç&æFöÒ‚’Âã"ò2¢#°¢6öç7BÆ÷6W$vÖW2Òv–ææW$vÖW2ÓÓÒ2ò¢ÖF‚ç&æFöÒ‚’ÂãRò¢°¢&WGW&â·v–ææW$–æFW‚ÓÓÒò·v–ææW$vÖW2ÂÆ÷6W$vÖW5Ò¢¶Æ÷6W$vÖW2Âv–ææW$vÖW5ÕÓ°¢Ð¢&WGW&â&æFöÔÖF6…6WE66÷&W4f÷%v–ææW"‡v–ææW$–æFW‚ÂF&vWE6WG2“°§Ð ¦gVæ7F–öâ6–×VÆFTFÖ–äÖF6…66÷&R‚’°¢–b‚6äFÖ–å6–×VÆFTÖF6…66÷&R‚’’&WGW&ã°¢6öç7Bv–ææW"Ò4U%dU%õ5”ä2æVæ&ÆVBbb³ÂÒæ–æ6ÇVFW2„çVÖ&W"…4U%dU%õ5”ä2ç6VB’¢òçVÖ&W"…4U%dU%õ5”ä2ç6VB¢¢°¢6öç7BF&vWE6WG2ÒÖF‚æÖ‚ƒÂçVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2ÇÂ’“°¢6öç7B6ö×ÆWFVE66÷&W2ÒFÖ–å6–×VÆFVE6WE66÷&W2‡v–ææW"ÂF&vWE6WG2“°¢6öç7Bf–æÅ66÷&RÒ²ââæ6ö×ÆWFVE66÷&W2æB‚Ó•Ó°¢6öç7B6WG5vöâÒv–ææW"ÓÓÒò·F&vWE6WG2ÂÒ¢³ÂF&vWE6WG5Ó°¢6öç7B&Wf–÷W566÷&RÒ²ââç7FFRç6WDÖF6‚ç66÷&UÓ°¢6öç7B&V6öâÒ66÷&R6–×VÌ:’"ÂtDÔ”â¢G¶F—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·v–ææW%Ò—Ò&V×÷'FRÆRÖF6‚æ° ¢7F÷6öÆõF–ÖW'2‚“°¢7FFRævÖT÷fW"ÒG'VS°¢7FFRæ7F—fUÆ–W"Òv–ææW#°¢7FFRç6WDÖF6‚ç66÷&RÒf–æÅ66÷&S°¢7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2Ò6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢7FFRç6WDÖF6‚æFV6—6—fTW†6†ævRÒfÇ6S°¢7FFRç6WDÖF6‚ç6WD÷fW"ÒG'VS°¢7FFRç6WDÖF6‚çv–ææW"Òv–ææW#°¢7FFRç6WDÖF6‚ç6WG5vöâÒ6WG5vöã°¢7FFRç6WDÖF6‚æÖF6„÷fW"ÒG'VS°¢7FFRç6WDÖF6‚æÖF6…v–ææW"Òv–ææW#°¢7FFRç&W7VÇD–æfòÒ°¢v–ææW"À¢–væ÷&U66÷&S¢G'VRÀ¢v–åG—S¢&FÖ–â×6–×VÆF–öâ"À¢&V6öâÀ¢66÷&UFW‡C¢66÷&R6–×VÌ:’¢G·Æ–W$æÖRƒ—ÒG·6WG5vöå³×ÒÒG·6WG5vöå³×ÒG·Æ–W$æÖRƒ—Ò+rG¶f÷&ÖE6WE66÷&W2†6ö×ÆWFVE66÷&W2—ÒæÀ¢6WE66÷&S¢çVÆÂÀ¢VæD&öçW4FWF–Ç3¢µÒÀ¢6WDÖF6ƒ¢°¢&Wf–÷W566÷&RÀ¢66÷&S¢²ââæf–æÅ66÷&UÒÀ¢6ö×ÆWFVE66÷&W3¢6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ’À¢6WD÷fW#¢G'VRÀ¢v–ææW"À¢FV6—6—fTW†6†ævS¢fÇ6RÀ¢F&vWE6WG2À¢6WG5vöã¢²ââç6WG5vöåÒÀ¢ÖF6„÷fW#¢G'VRÀ¢ÖF6…v–ææW#¢v–ææW"À¢ÒÀ¢Ó°¢7FFRæÆörçVç6†–gB†G·&V6öçÒG¶f÷&ÖE6WE66÷&W2†6ö×ÆWFVE66÷&W2—Òæ“° ¢f÷"†ÆWB–æFW‚Ò²–æFW‚Â6ö×ÆWFVE66÷&W2æÆVæwFƒ²–æFW‚³Ò’°¢WFFUF÷W&æÖVçE6WE&öw&W72‚“°¢Ð¢&V6÷&D7F–öâ‚&W†6†ævUöVæB"Â°¢v–ææW"À¢v–ææW$æÖS¢Æ–W$æÖR‡v–ææW"’À¢v–åG—S¢&FÖ–â×6–×VÆF–öâ"À¢–væ÷&U66÷&S¢G'VRÀ¢FÖ–å6–×VÆF–öã¢G'VRÀ¢&V6öâÀ¢f–æÅ÷vW#¢7FFRçÆ–W'2æÖ‚‡Æ–W"’ÓâÆ–W"ç÷vW"’À¢f–æÄVæGW&æ6S¢7FFRçÆ–W'2æÖ‚‡Æ–W"’ÓâÆ–W"æVæGW&æ6R’À¢W†6†ævU6WE66÷&S¢çVÆÂÀ¢6WDÖF6ƒ¢°¢66÷&S¢²ââæf–æÅ66÷&UÒÀ¢6ö×ÆWFVE66÷&W3¢6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ’À¢6WD÷fW#¢G'VRÀ¢v–ææW"À¢F&vWE6WG2À¢6WG5vöã¢²ââç6WG5vöåÒÀ¢ÖF6„÷fW#¢G'VRÀ¢ÖF6…v–ææW#¢v–ææW"À¢ÒÀ¢Æ–W'3¢7FFRçÆ–W'2æÖ‡Æ–W$Æöt–æfò’À¢Ò“°¢7F÷&TÖF6„Æör‡v–ææW"Â&V6öâ“°¢†æFÆUF÷W&æÖVçDÖF6„6ö×ÆWFR‚“°¢Ö&µ6W'fW$F—'G”f÷$†÷7D7F–öâ‚“°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ7F÷&TÖF6„Æör‡v–ææW"Â&V6öâ’°¢–b‚²&FÖ–â"Â'&õ÷ÇW2%Òæ–æ6ÇVFW2†7W'&VçEW6W%&öÆR‚’’’&WGW&ã°¢G'’°¢6öç7BW†—7F–ærÒ¥4ôâç'6R†Æö6Å7F÷&vRævWD—FVÒ„ÔD4…ôÄôuõ5Dõ$tUô´U’’ÇÂ%µÒ"“°¢6öç7BVçG'’Ò°¢7&VFVDC¢æWrFFR‚’çFô•4õ7G&–ær‚’À¢ÖöFS¢4ôÄõô’æVæ&ÆVBò'6öÆòÖ’"¢4U%dU%õ5”ä2æVæ&ÆVBò&öæÆ–æR"¢&Æö6Â"À¢•7G–ÆS¢4ôÄõô’æVæ&ÆVBò4ôÄõô’ç7G–ÆR¢çVÆÂÀ¢6W'fW#¢7FFRç6W'fW"À¢v–ææW"À¢v–åG—S¢7FFRç&W7VÇD–æfóòçv–åG—RóòçVÆÂÀ¢6WE66÷&S¢7FFRç&W7VÇD–æfóòç6WE66÷&RóòçVÆÂÀ¢6WDÖF6ƒ¢7FFRç6WDÖF6‚æVæ&ÆVBò°¢ââç7FFRç6WDÖF6‚À¢66÷&S¢²ââç7FFRç6WDÖF6‚ç66÷&UÒÀ¢6ö×ÆWFVE66÷&W3¢7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ’À¢Ò¢çVÆÂÀ¢7F–öäÆös¢²ââç7FFRæ7F–öäÆöuÒÀ¢&V6öâÀ¢Æ–W'3¢7FFRçÆ–W'2æÖ‚‡Æ–W"’Óâ‡°¢æÖS¢F—7Æ•Æ–W$æÖR‡Æ–W"’À¢VæGW&æ6S¢Æ–W"æVæGW&æ6RÀ¢÷vW#¢Æ–W"ç÷vW"À¢&VÖ–æ–æt†æC¢Æ–W"æ†æBæÖ‚†6&B’Óâ‡²–C¢6&Bæ–BÂæÖS¢6&BææÖRÂfÖ–Ç“¢6&BæfÖ–Ç’Ò’’À¢Æ–VC¢Æ–W"çÆ–VBæÖ‚†6&B’Óâ‡°¢–C¢6&Bæ–BÀ¢æÖS¢6&BææÖRÀ¢fÖ–Ç“¢6&BæfÖ–Ç’À¢&ö÷7FVC¢&ööÆVâ†6&Bæ&ö÷7FVB’À¢&VÖ÷fVC¢&ööÆVâ†6&Bç&VÖ÷fVB’À¢÷vW$v–æVC¢6&Bæ6&E÷vW$v–æVBóò6&Bç÷vW$v–æVBóòÀ¢VffV7E÷vW$v–æVC¢6&BæVffV7E÷vW$v–æVBóòÀ¢67&–f–6VD6&C¢6&Bç67&–f–6VD6&Bò²–C¢6&Bç67&–f–6VD6&Bæ–BÂæÖS¢6&Bç67&–f–6VD6&BææÖRÂ&VÖ÷fVC¢&ööÆVâ†6&Bç67&–f–6VD6&Bç&VÖ÷fVB’Ò¢çVÆÂÀ¢Ò’’À¢Ò’’À¢Æös¢²ââç7FFRæÆöuÒÀ¢Ó°¢W†—7F–ærçVç6†–gB†VçG'’“°¢Æö6Å7F÷&vRç6WD—FVÒ„ÔD4…ôÄôuõ5Dõ$tUô´U’Â¥4ôâç7G&–æv–g’†W†—7F–ærç6Æ–6RƒÂS’’“°¢Ò6F6‚†W'&÷"’°¢òòÆR7Fö6¶vRFRÆöw2W7Bf7VÇFF–bWBæRFö—B¦Ö—2&Æ÷VW"Æ'F–Rà¢Ð§Ð ¦gVæ7F–öâvWE7F÷&VDÖF6„Æöw2‚’°¢G'’°¢&WGW&â¥4ôâç'6R†Æö6Å7F÷&vRævWD—FVÒ„ÔD4…ôÄôuõ5Dõ$tUô´U’’ÇÂ%µÒ"“°¢Ò6F6‚†W'&÷"’°¢&WGW&âµÓ°¢Ð§Ð ¦gVæ7F–öâvWE7F÷&VD7F–öäÆöw2‚’°¢&WGW&â&VE7F÷&VD§6öâ„5D”ôåôÄôuõ5Dõ$tUô´U’ÂµÒ“°§Ð ¦gVæ7F–öâ&VæFW$6ö×7DÖF6…66÷&R‡6WDÖF6‚’°¢–b‚6WDÖF6‚’&WGW&â"#°¢6öç7B66÷&W2Ò'&’æ—4'&’‡6WDÖF6‚æ6ö×ÆWFVE66÷&W2¢ò6WDÖF6‚æ6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ´çVÖ&W"‡66÷&Sòå³ÒÇÂ’ÂçVÖ&W"‡66÷&Sòå³ÒÇÂ•Ò¢¢µÓ°¢–b‚6WDÖF6‚ç6WD÷fW"bb'&’æ—4'&’‡6WDÖF6‚ç66÷&R’’°¢66÷&W2çW6‚…´çVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ’ÂçVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ•Ò“°¢ÒVÇ6R–b‚66÷&W2æÆVæwF‚bb'&’æ—4'&’‡6WDÖF6‚ç66÷&R’’°¢66÷&W2çW6‚…´çVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ’ÂçVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ•Ò“°¢Ð¢–b‚66÷&W2æÆVæwF‚’&WGW&â"#°¢&WGW&â ¢ÆF—b6Æ73Ò'&W7VÇBÖÖF6‚×66÷&R"&–ÖÆ&VÃÒ%66÷&RGRÖF6‚#à¢ÆF—b6Æ73Ò'&W7VÇBÖÖF6‚Ö6öæg&öçFF–öâ#à¢Ç7G&öæsâG¶W66T‡FÖÂ‡Æ–W$æÖRƒ’—ÓÂ÷7G&öæsà¢Ç7ãæ6öçG&SÂ÷7ãà¢Ç7G&öæsâG¶W66T‡FÖÂ‡Æ–W$æÖRƒ’—ÓÂ÷7G&öæsà¢ÂöF—cà¢ÆF—b6Æ73Ò'&W7VÇBÖÖF6‚×66÷&R×fÇVW2#à¢G·66÷&W2æÖ‚‡66÷&RÂ–æFW‚’Óâ°¢6öç7B—47W'&VçBÒ6WDÖF6‚ç6WD÷fW"bb–æFW‚ÓÓÒ66÷&W2æÆVæwF‚Ò°¢6öç7Bv–ææW$6Æ72Ò—47W'&VçBò&7W'&VçB"¢66÷&U³Òâ66÷&U³Òò'vöâÖÆVgB"¢'vöâ×&–v‡B#°¢&WGW&âÇ7G&öær6Æ73Ò"G·v–ææW$6Æ77Ò#âG·66÷&U³×Þ(	2G·66÷&U³×ÓÂ÷7G&öæsæ°¢Ò’æ¦ö–â‚sÆ’&–Ö†–FFVãÒ'G'VR#ì+sÂö“âr—Ð¢ÂöF—cà¢ÂöF—cà¢°§Ð ¦ÆWB&VæFW&VDFW6·F÷ÖF6„f–æÆT¶W’Ò"#°¦ÆWB&VæFW&VDFW6·F÷W†6†ævU&W7VÇD¶W’Ò"#° ¦gVæ7F–öâ&VæFW%&W7VÇEæVÂ‚’°¢–b‚7FFRævÖT÷fW"ÇÂ7FFRç&W7VÇD–æfò’°¢&VæFW&VDFW6·F÷ÖF6„f–æÆT¶W’Ò"#°¢&VæFW&VDFW6·F÷W†6†ævU&W7VÇD¶W’Ò"#°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&ÖF6‚Öf–æÆRÖ†÷7B"“°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&W†6†ævR×&W7VÇBÖ†÷7B"“°¢VÇ2ç&W7VÇEæVÂæ–ææW$…DÔÂÒ"#°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢&WGW&ã°¢Ð¢–b‚7FFRç6WDÖF6‚æÖF6„÷fW"ÇÂ7FFRç6WDÖF6‚æÖF6…v–ææW"ÓÒçVÆÂ’°¢6öç7Bv–ææW"Ò7FFRç&W7VÇD–æfòçv–ææW#°¢6öç7BÆ÷6W"Ò÷öæVçDöb‡v–ææW"“°¢6öç7Bv–ææW%&öf–ÆRÒ$ôd”ÄUô4„$5DU%ô”ÔtU5·7FFRçÆ–W'5·v–ææW%Óòæ6†&7FW$–EÐ¢ÇÂ4„$5DU%ô”ÔtU5·7FFRçÆ–W'5·v–ææW%Óòæ6†&7FW$–EÓòå³Ó°¢6öç7BFFVBÒ&ÆÇ”VæDvÖW4FFVB‚“°¢6öç7B&Wf–÷W566÷&RÒ7FFRç&W7VÇD–æfòç6WDÖF6ƒòç&Wf–÷W566÷&RÇÂ³ÂÓ°¢6öç7B7W'&VçE66÷&RÒ7FFRç&W7VÇD–æfòç6WDÖF6ƒòç66÷&RÇÂFFVC°¢6öç7B&W7VÇD6Æ72Ò&ÆÇ”VæD6öæF—F–öä6Æ72‚“°¢6öç7Bv–ææW%6–FRÒv–ææW"ÓÓÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚’ò'Æ–W""¢&÷öæVçB#°¢6öç7B÷vW%66÷&RÒG´çVÖ&W"‡7FFRçÆ–W'5³Óòç÷vW"ÇÂ—Þ(	2G´çVÖ&W"‡7FFRçÆ–W'5³Óòç÷vW"ÇÂ—Ö°¢6öç7B&öw&W76–öäÖ&·WÒ&VæFW%&ÆÇ”VæD7F–öç2‚“°¢6öç7BW†6†ævU&W7VÇD¶W’Ò¥4ôâç7G&–æv–g’‡°¢v–ææW"À¢v–ææW%&öf–ÆRÀ¢FFVBÀ¢&Wf–÷W566÷&RÀ¢7W'&VçE66÷&RÀ¢&W7VÇD6Æ72À¢v–ææW%6–FRÀ¢÷vW%66÷&RÀ¢&öw&W76–öäÖ&·WÀ¢Ò“°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"Â&ÖF6‚Öf–æÆRÖ†÷7B"“°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7BæFB‚&W†6†ævR×&W7VÇBÖ†÷7B"“°¢–b‡&VæFW&VDFW6·F÷W†6†ævU&W7VÇD¶W’ÓÒW†6†ævU&W7VÇD¶W’ÇÂVÇ2ç&W7VÇEæVÂçVW'•6VÆV7F÷"‚"æW†6†ævR×&W7VÇBÖ÷fW&Æ’"’’°¢&VæFW&VDFW6·F÷W†6†ævU&W7VÇD¶W’ÒW†6†ævU&W7VÇD¶W“°¢&VæFW&VDFW6·F÷ÖF6„f–æÆT¶W’Ò"#°¢VÇ2ç&W7VÇEæVÂæ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&W†6†ævR×&W7VÇBÖ÷fW&Æ’G·&W7VÇD6Æ77ÒW†6†ævR×&W7VÇB×v–ææW"ÒÒG·v–ææW%6–FWÒ"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÆÆVF'“Ò&W†6†ævU&W7VÇEF—FÆR#à¢Æ†VFW#à¢Æ–Ör7&3Ò"G¶W66T‡FÖÂ‡v–ææW%&öf–ÆRÇÂ""—Ò"ÇCÒ""óà¢ÆF—cà¢Ç7ãåf–çVWW"FRÎ(	œ:–6†ævSÂ÷7ãà¢Æƒ"–CÒ&W†6†ævU&W7VÇEF—FÆR#âG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·v–ææW%Ò’—ÓÂöƒ#à¢ÂöF—cà¢Âö†VFW#à¢Ç7G&öær6Æ73Ò&W†6†ævR×&W7VÇB×f–7F÷'’×G—R#âG¶W66T‡FÖÂ‡&ÆÇ”VæE&V6öäÆ&VÂ‚’—ÓÂ÷7G&öæsà¢G·7FFRç&W7VÇD–æfòçv–åG—RÓÓÒ'÷vW""ò ¢ÆF—b6Æ73Ò&W†6†ævR×&W7VÇB×÷vW"×66÷&R"&–ÖÆ&VÃÒ%66÷&RFRV—76æ6R¢G·÷vW%66÷&WÒ#à¢Ç7ãâG´çVÖ&W"‡7FFRçÆ–W'5³Óòç÷vW"ÇÂ—ÓÂ÷7ããÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÇ7ãâG´çVÖ&W"‡7FFRçÆ–W'5³Óòç÷vW"ÇÂ—ÓÂ÷7ãà¢ÂöF—cà¢¢"'Ð¢ÆF—b6Æ73Ò&W†6†ævR×&W7VÇBÖ6öç6WVVæ6W2#à¢ÇãÇ7ãä¦WW‚vvì:—3Â÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·v–ææW%Ò’—Ò²G¶FFVE·v–ææW%×Ò+rG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5¶Æ÷6W%Ò’—Ò²G¶FFVE¶Æ÷6W%×ÓÂ÷7G&öæsãÂ÷à¢ÇãÇ7ãä6öç<:—VVæ6R7W"ÆR6WCÂ÷7ããÇ7G&öæsâG´çVÖ&W"‡&Wf–÷W566÷&U³ÒÇÂ—Þ(	2G´çVÖ&W"‡&Wf–÷W566÷&U³ÒÇÂ—Ò(i"G´çVÖ&W"†7W'&VçE66÷&U³ÒÇÂ—Þ(	2G´çVÖ&W"†7W'&VçE66÷&U³ÒÇÂ—ÓÂ÷7G&öæsãÂ÷à¢ÂöF—cà¢Ææcà¢G·&öw&W76–öäÖ&·WÐ¢Æ'WGFöâ6Æ73Ò&W†6†ævR×&W7VÇBÖ†—7F÷'’Ö'WGFöâ"G—SÒ&'WGFöâ"FFÖ÷VâÖW†6†ævRÖ†—7F÷'“ä†—7F÷&—VSÂö'WGFöãà¢Âöæcà¢Â÷6V7F–öãà¢°¢&–æE&ÆÇ”VæD7F–öç2†VÇ2ç&W7VÇEæVÂ“°¢VÇ2ç&W7VÇEæVÂçVW'•6VÆV7F÷"‚%¶FFÖ÷VâÖW†6†ævRÖ†—7F÷'•Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â÷VägVÆÄ7F–öäÆötF–Æör“°¢Ð¢&WGW&ã°¢Ð¢&VæFW&VDFW6·F÷W†6†ævU&W7VÇD¶W’Ò"#°¢6öç7Bv–ææW"Ò7FFRç6WDÖF6‚æÖF6…v–ææW#°¢6öç7BÆ–W'2Ò7FFRçÆ–W'2æÖ‚‡Æ–W"ÂÆ–W$–æFW‚’Óâ°¢6öç7BÆö&'’Ò$ôd”ÄUô4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÒÇÂ4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÓòå³Ó°¢&WGW&â°¢æÖS¢F—7Æ•Æ–W$æÖR‡Æ–W"’À¢Æö&'’À¢&W7VÇC¢ÔD4…õ$U5TÅEô”ÔtU5·Æ–W"æ6†&7FW$–EÓòå·Æ–W$–æFW‚ÓÓÒv–ææW"ò'v–â"¢&Æ÷6R%ÒÇÂÆö&'’À¢Ó°¢Ò“°¢6öç7B66÷&W2Ò‡7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2ÇÂµÒ’æÖ‚‡66÷&R’Óâ‡°¢66÷&RÀ¢v–ææW#¢66÷&U³Òâ66÷&U³Òò¢À¢Ò’“°¢6öç7B—4öæUö–çDf–æÆRÒ&ööÆVâ‡7FFRçF÷W&æÖVçCòæöæUö–çDvÖRÇÂ7FFRçF÷W&æÖVçCòæg&–VæFÇ”f÷&ÖBÓÓÒ&öæWö–çB"“°¢6öç7Bf–7F÷'•G—RÒ7FFRç&W7VÇD–æfóòæ¶–æBÓÓÒ&f÷&fV—B"ÇÂ7FFRç&W7VÇD–æfóòç&V6öâÓÓÒ$dõ$d•B ¢ò%f–7Fö—&R"f÷&f—B ¢¢7FFRç&W7VÇD–æfóòçv–åG—RÓÓÒ&&ö÷7B ¢ò%f–7Fö—&R7W"&ö÷7B ¢¢7FFRç&W7VÇD–æfóòçv–åG—RÓÓÒ'÷vW" ¢òf–7Fö—&RW‚ö–çG2+rG´çVÖ&W"‡7FFRçÆ–W'5·v–ææW%Óòç÷vW"ÇÂ—ÒÒG´çVÖ&W"‡7FFRçÆ–W'5¶÷öæVçDöb‡v–ææW"•Óòç÷vW"ÇÂ—Ö ¢¢%f–7Fö—&R7W"VffWB#°¢6öç7B&öw&W76–öäÖ&·WÒ&VæFW%&ÆÇ”VæD7F–öç2‚“°¢6öç7Bf–æÆT¶W’Ò¥4ôâç7G&–æv–g’‡°¢v–ææW"À¢Æ–W'3¢Æ–W'2æÖ‚‡Æ–W"’Óâ·Æ–W"ææÖRÂÆ–W"æÆö&'’ÂÆ–W"ç&W7VÇEÒ’À¢66÷&W3¢66÷&W2æÖ‚‡6WB’Óâ·6WBç66÷&RÂ6WBçv–ææW%Ò’À¢—4öæUö–çDf–æÆRÀ¢f–7F÷'•G—RÀ¢&öw&W76–öäÖ&·WÀ¢Ò“°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&W†6†ævR×&W7VÇBÖ†÷7B"“°¢VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7BæFB‚&ÖF6‚Öf–æÆRÖ†÷7B"“°¢–b‡&VæFW&VDFW6·F÷ÖF6„f–æÆT¶W’ÓÓÒf–æÆT¶W’bbVÇ2ç&W7VÇEæVÂçVW'•6VÆV7F÷"‚"æÖF6‚Öf–æÆRÖ÷fW&Æ’"’’&WGW&ã°¢&VæFW&VDFW6·F÷ÖF6„f–æÆT¶W’Òf–æÆT¶W“°¢VÇ2ç&W7VÇEæVÂæ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&ÖF6‚Öf–æÆRÖ÷fW&Æ’G¶—4öæUö–çDf–æÆRò"öæR×ö–çBÖf–æÆRÖ÷fW&Æ’"¢"'Ò"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÆÆVF'“Ò&ÖF6„f–æÆUF—FÆR#à¢Æ†VFW#ãÇ7ãå,:—7VÇFBf–æÃÂ÷7ããÆƒ"–CÒ&ÖF6„f–æÆUF—FÆR#äÖF6‚FW&Ö–ì:“Âöƒ#ãÂö†VFW#à¢ÆF—b6Æ73Ò&ÖF6‚Öf–æÆR×Æ–W'2#à¢G·Æ–W'2æÖ‚‡Æ–W"Â–æFW‚’ÓâÆ'F–6ÆSà¢Ç7G&öæsâG¶W66T‡FÖÂ‡Æ–W"ææÖR—ÓÂ÷7G&öæsà¢ÆF—cãÆ–Ör7&3Ò"G¶W66T‡FÖÂ‡Æ–W"æÆö&'’—Ò"ÇCÒ"G¶W66T‡FÖÂ‡Æ–W"ææÖR—Ò"óãÆ–Ör6Æ73Ò&ÖF6‚Öf–æÆR×&W7VÇBÖ–ÖvR"7&3Ò"G¶W66T‡FÖÂ‡Æ–W"ç&W7VÇB—Ò"ÇCÒ"G¶W66T‡FÖÂ‡Æ–W"ææÖR—Ò"óãÂöF—cà¢Âö'F–6ÆSæ’æ¦ö–â‚""—Ð¢ÂöF—cà¢G¶—4öæUö–çDf–æÆRòÇ6Æ73Ò&öæR×ö–çB×f–7F÷'’×G—R#âG¶W66T‡FÖÂ‡f–7F÷'•G—R—ÓÂ÷ãÇ6Æ73Ò&öæR×ö–çBÖf–æÂ×66÷&RÖÆ&VÂ#å66÷&Rf–æÃÂ÷æ¢"'Ð¢ÆöÃâG·66÷&W2æÖ‚‡6WBÂ–æFW‚’ÓâÆÆ’7G–ÆSÒ"Ò×&WfVÂÖ–æFWƒ¢G¶–æFW‡Ò"6Æ73Ò'v–ææW"ÒG·6WBçv–ææW'Ò#ãÇ7ãâG·6WBç66÷&U³×ÓÂ÷7ããÆ“ãÂö“ãÇ7ãâG·6WBç66÷&U³×ÓÂ÷7ããÂöÆ“æ’æ¦ö–â‚""—ÓÂööÃà¢ÆæcâG·&öw&W76–öäÖ&·WÓÂöæcà¢Â÷6V7F–öãæ°¢&–æE&W7VÇEF÷W&æÖVçD'WGFöâ‚“°§Ð ¦gVæ7F–öâÇ”VæD&öçW6W2‚’°¢6öç7BFWF–Ç2ÒµÓ°¢f÷"†6öç7BÆ–W"öb7FFRçÆ–W'2’°¢f÷"†6öç7B&öçW2öbÆ–W"æVæD&öçW6W2’°¢–b†&öçW2çG—RÓÓÒ&F÷V&ÆTÆ7E6†÷B"’°¢6öç7BF&vWBÒ²ââçÆ–W"çÆ–VEÒç&WfW'6R‚’æf–æB‚†6&B’Óâ6&Bç&VÖ÷fVBbb—56†÷B†6&B’“°¢–b‡F&vWB’°¢6öç7BF÷V&ÆVE÷vW"ÒF&vWBæ6&E÷vW$v–æVBóòF&vWBç÷vW$v–æVC°¢Æ–W"ç÷vW"³ÒF÷V&ÆVE÷vW#°¢FWF–Ç2çW6‚‡²Æ–W$–æFWƒ¢7FFRçÆ–W'2æ–æFW„öb‡Æ–W"’ÂÆ&VÃ¢F÷V&ÆRG·F&vWBææÖWÖÂö–çG3¢F÷V&ÆVE÷vW"Ò“°¢7FFRæÆörçVç6†–gB†G¶F—7Æ•Æ–W$æÖR‡Æ–W"—ÒF÷V&ÆRG·F&vWBææÖWÒ¢²G¶F÷V&ÆVE÷vW'ÒV—76æ6Ræ“°¢Ð¢Ð¢–b†&öçW2çG—RÓÓÒ&&ö÷7FVD&öçW2"’°¢6öç7B6÷VçBÒÆ–W"çÆ–VBæf–ÇFW"‚†6&B’Óâ6&Bæ&ö÷7FVBbb6&Bç&VÖ÷fVB’æÆVæwFƒ°¢6öç7Bv–æVBÒ6÷VçB¢&öçW2çfÇVS°¢Æ–W"ç÷vW"³Òv–æVC°¢–b†v–æVB’FWF–Ç2çW6‚‡²Æ–W$–æFWƒ¢7FFRçÆ–W'2æ–æFW„öb‡Æ–W"’ÂÆ&VÃ¢&öçW26'FW2&ö÷7L:–W2‚G¶6÷VçGÒ–Âö–çG3¢v–æVBÒ“°¢7FFRæÆörçVç6†–gB†G¶F—7Æ•Æ–W$æÖR‡Æ–W"—ÒvvæR²G¶v–æVGÒV—76æ6R÷W"6W26'FW2&ö÷7L:–W2æ“°¢Ð¢–b†&öçW2çG—RÓÓÒ'VÇF–ÖFT÷F†W%6†÷G2"’°¢6öç7B6÷VçBÒÖF‚æÖ‚ƒÂÆ–W"çÆ–VBæf–ÇFW"‚†6&B’Óâ—56†÷B†6&B’bb6&Bç&VÖ÷fVB’æÆVæwF‚Ò“°¢Æ–W"ç÷vW"³Ò6÷VçC°¢–b†6÷VçB’FWF–Ç2çW6‚‡²Æ–W$–æFWƒ¢7FFRçÆ–W'2æ–æFW„öb‡Æ–W"’ÂÆ&VÃ¢$WG&W24õU2f—6–&ÆW2"Âö–çG3¢6÷VçBÒ“°¢Ð¢–b†&öçW2çG—RÓÓÒ'VÇF–ÖFTF÷V&ÆTf—'7E6†÷B"’°¢6öç7BF&vWBÒÆ–W"çÆ–VBæf–æB‚†6&B’Óâ—56†÷B†6&B’bb6&Bç&VÖ÷fVB“°¢6öç7Bv–æVBÒçVÖ&W"‡F&vWCòæ6&E÷vW$v–æVBóòF&vWCòç÷vW$v–æVBóò“°¢Æ–W"ç÷vW"³Òv–æVC°¢–b†v–æVB’FWF–Ç2çW6‚‡²Æ–W$–æFWƒ¢7FFRçÆ–W'2æ–æFW„öb‡Æ–W"’ÂÆ&VÃ¢&VÖ–W"4õUF÷V&Ì:’+rG·F&vWBææÖWÖÂö–çG3¢v–æVBÒ“°¢Ð¢–b†&öçW2çG—RÓÓÒ'VÇF–ÖFTF÷V&ÆU7G&öævW7DgFW""’°¢6öç7B6÷W&6T–æFW‚ÒÆ–W"çÆ–VBæf–æD–æFW‚‚†6&B’Óâ6&BçÆ–VEV–BÓÓÒ&öçW2ç6÷W&6UV–B“°¢6öç7BF&vWBÒÆ–W"çÆ–VBç6Æ–6R‡6÷W&6T–æFW‚²’æf–ÇFW"‚†6&B’Óâ—56†÷B†6&B’bb6&Bç&VÖ÷fVB’ç6÷'B‚†Â"’ÓâçVÖ&W"†"æ6&E÷vW$v–æVBÇÂ’ÒçVÖ&W"†æ6&E÷vW$v–æVBÇÂ’•³Ó°¢6öç7Bv–æVBÒçVÖ&W"‡F&vWCòæ6&E÷vW$v–æVBóò“°¢Æ–W"ç÷vW"³Òv–æVC°¢–b†v–æVB’FWF–Ç2çW6‚‡²Æ–W$–æFWƒ¢7FFRçÆ–W'2æ–æFW„öb‡Æ–W"’ÂÆ&VÃ¢4õUÆRÇW2V—76çBF÷V&Ì:’+rG·F&vWBææÖWÖÂö–çG3¢v–æVBÒ“°¢Ð¢–b†&öçW2çG—RÓÓÒ'VÇF–ÖFU÷vW$gFW%F‡&VTfÖ–Ç’"’°¢6öç7B6÷VçG2ÒæWrÖ‚“°¢Æ–W"çÆ–VBæf–ÇFW"‚†6&B’Óâ—56†÷B†6&B’bb6&Bç&VÖ÷fVB’æf÷$V6‚‚†6&B’Óâ6÷VçG2ç6WB†6&BæfÖ–Ç’Â†6÷VçG2ævWB†6&BæfÖ–Ç’’ÇÂ’²’“°¢–b…²ââæ6÷VçG2çfÇVW2‚•Òç6öÖR‚†6÷VçB’Óâ6÷VçBãÒ2’’²Æ–W"ç÷vW"³ÒC²FWF–Ç2çW6‚‡²Æ–W$–æFWƒ¢7FFRçÆ–W'2æ–æFW„öb‡Æ–W"’ÂÆ&VÃ¢%G&ö—24õU2–FVçF—VW2"Âö–çG3¢BÒ“²Ð¢Ð¢–b†&öçW2çG—RÓÓÒ'VÇF–ÖFUvV¶W7D6÷–W57G&öævW7B"’°¢6öç7B6†÷G2ÒÆ–W"çÆ–VBæf–ÇFW"‚†6&B’Óâ—56†÷B†6&B’bb6&Bæ&ö÷7FVBbb6&Bç&VÖ÷fVB“°¢6öç7B÷vW'2Ò6†÷G2æÖ‚†6&B’ÓâçVÖ&W"†6&Bæ6&E÷vW$v–æVBÇÂ’“°¢6öç7Bv–æVBÒ÷vW'2æÆVæwF‚òÖF‚æÖ‚‚ââç÷vW'2’ÒÖF‚æÖ–â‚ââç÷vW'2’¢°¢Æ–W"ç÷vW"³ÒÖF‚æÖ‚ƒÂv–æVB“°¢–b†v–æVBâ’FWF–Ç2çW6‚‡²Æ–W$–æFWƒ¢7FFRçÆ–W'2æ–æFW„öb‡Æ–W"’ÂÆ&VÃ¢$4õUf–&ÆRÆ–vì:’7W"ÆRÇW2f÷'B"Âö–çG3¢v–æVBÒ“°¢Ð¢Ð¢Ð¢&WGW&âFWF–Ç3°§Ð ¦gVæ7F–öâ—56†÷B†6&B’°¢&WGW&â²%&VÖ—6R%Òæ–æ6ÇVFW2†6&BæfÖ–Ç’“°§Ð ¦gVæ7F–öâvWEv–ææW"‚’°¢6öç7B·Â%ÒÒ7FFRçÆ–W'3°¢–b‡ç÷vW"â"ç÷vW"’&WGW&â°¢–b‡"ç÷vW"âç÷vW"’&WGW&â°¢&WGW&â7FFRç6W'fW#°§Ð ¦gVæ7F–öâ÷Vä&ö÷7DÖöFÂ‡Æ–W$–æFW‚Â6&EV–B’°¢7FFRçVæF–æt&ö÷7BÒ²Æ–W$–æFW‚Â6&EV–BÓ°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ6Æ÷6T&ö÷7DÖöFÂ‚’°¢–b…TÅD”ÔDUôÔôDRæ7F—fRbb7FFRçVæF–æt&ö÷7B’°¢6öç7B²Æ–W$–æFW‚Â6&EV–BÒÒ7FFRçVæF–æt&ö÷7C°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B6&BÒÆ–W#òæ†æBæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ6&EV–Bbb—FVÒå÷VæF–æu&W6W'fT&ö÷7B“°¢–b†6&B’°¢Æ–W"æ†æBÒÆ–W"æ†æBæf–ÇFW"‚†—FVÒ’Óâ—FVÒçV–BÓÒ6&EV–B“°¢FVÆWFR6&Bå÷VæF–æu&W6W'fT&ö÷7C°¢FVÆWFR6&Båög&öÕ&W6W'fS°¢Æ–W"ç&W6W'fRçW6‚†6&B“°¢Ð¢Ð¢7FFRçVæF–æt&ö÷7BÒçVÆÃ°¢&VæFW"‚“°§Ð ¦gVæ7F–öâ'Vå&VæFW%7FW†Æ&VÂÂ6ÆÆ&6²’°¢G'’°¢&WGW&â6ÆÆ&6²‚“°¢Ò6F6‚†W'&÷"’°¢6öç6öÆRæW'&÷"†ff–6†vR–çFW'&ö×R+rG¶Æ&VÇÖÂW'&÷"“°¢&V6÷&EVÇF–ÖFTF–væ÷7F–2‚'&VæFW%öW'&÷""Â²7FvS¢Æ&VÂÂÖW76vS¢7G&–ær†W'&÷#òæÖW76vRÇÂW'&÷"ÇÂ&W'&WW"–æ6öæçVR"’Ò“°¢&WGW&âçVÆÃ°¢Ð§Ð ¦gVæ7F–öâVç7W&UVÇF–ÖFT‡VÖåGW&ä6öçG&öÇ2‚’°¢–b‚TÅD”ÔDUôÔôDRæ7F—fRÇÂ7FFRævÖT÷fW"ÇÂ6åW6U6VBƒ’’&WGW&âG'VS°¢6öç7BÆ–W"Ò7FFRçÆ–W'5³Ó°¢6öç7BF—7Æ–VE&W6W'fUV–G2ÒæWr6WB…²ââæVÇ2çÆ–W#æVÃòçVW'•6VÆV7F÷$ÆÂ‚"çVÇF–ÖFR×&W6W'fRÖ†æBÖ6&B"’ÇÂµÕÒæÖ‚†VÆVÖVçB’ÓâVÆVÖVçBæFF6WBæ†æD6&EV–B’“°¢6öç7BÖ—76–æu&W6W'fUV–G2Ò‡Æ–W"ç&W6W'fRÇÂµÒ’æÖ‚†6&B’Óâ6&BçV–B’æf–ÇFW"‚‡V–B’ÓâF—7Æ–VE&W6W'fUV–G2æ†2‡V–B’“°¢6öç7B6&G2Ò²âââ‡Æ–W"æ†æBÇÂµÒ’Ââââ‡Æ–W"ç&W6W'fRÇÂµÒ•Ó°¢6öç7B†4ÆVvÄ6&BÒ6&G2ç6öÖR‚†6&B’Óâ6åÆ”æ÷&ÖÂƒÂ6&B’ÇÂ†—5&VÖ—6R†6&B’bb6åÆ”VffV7DÖöFRƒÂ6&B’’“°¢6öç7BVæ&ÆVE6VÆV7F÷"Òræ†æBçÆ’Ö'WGFöã¦æ÷B…¶F—6&ÆVEÒ’Âæ†æBæ&ö÷7BÖ'WGFöã¦æ÷B…¶F—6&ÆVEÒ’Â¶FF×75Ó¦æ÷B…¶F—6&ÆVEÒ’s°¢6öç7BÖ—76–æt6öçG&öÇ2Ò7FFRæ7F—fUÆ–W"ÓÓÒbb†4ÆVvÄ6&BbbVÇ2çÆ–W#æVÃòçVW'•6VÆV7F÷"†Væ&ÆVE6VÆV7F÷"“°¢–b‚Ö—76–æt6öçG&öÇ2bbÖ—76–æu&W6W'fUV–G2æÆVæwF‚’&WGW&âG'VS°¢&V6÷&EVÇF–ÖFTF–væ÷7F–2‚'VÇF–ÖFUö6öçG&öÇ5÷&V'V–ÆB"Â°¢ÖW76vS¢Ö—76–æu&W6W'fUV–G2æÆVæwF€¢òÆ,:—6W'fRVç&Vv—7G,:–Râ|:—F—B2VçFœ:‡&VÖVçBff–6Œ:–R‚G¶Ö—76–æu&W6W'fUV–G2æ¦ö–â‚"Â"—Ò’æ ¢¢$ÆR¦÷VWW":—F—B7F–bfV2VæR7F–öâÌ:–vÆRÖ—2V7Vâ6öçG,;FÆR¦÷V&ÆRî(	œ:—F—Bff–6Œ:’â"À¢Ö—76–æu&W6W'fUV–G2À¢Ò“°¢&VæFW%Æ–W%æVÂƒÂVÇ2çÆ–W#æVÂ“°¢6öç7B&W—&VE&W6W'fUV–G2ÒæWr6WB…²ââæVÇ2çÆ–W#æVÃòçVW'•6VÆV7F÷$ÆÂ‚"çVÇF–ÖFR×&W6W'fRÖ†æBÖ6&B"’ÇÂµÕÒæÖ‚†VÆVÖVçB’ÓâVÆVÖVçBæFF6WBæ†æD6&EV–B’“°¢6öç7B&W6W'fU&W—&VBÒ‡Æ–W"ç&W6W'fRÇÂµÒ’æWfW'’‚†6&B’Óâ&W—&VE&W6W'fUV–G2æ†2†6&BçV–B’“°¢6öç7B6öçG&öÇ5&W—&VBÒÖ—76–æt6öçG&öÇ2ÇÂ&ööÆVâ†VÇ2çÆ–W#æVÃòçVW'•6VÆV7F÷"†Væ&ÆVE6VÆV7F÷"’“°¢6öç7B&W—&VBÒ&W6W'fU&W—&VBbb6öçG&öÇ5&W—&VC°¢–b‚&W—&VB’°¢&V6÷&EVÇF–ÖFTF–væ÷7F–2‚'VÇF–ÖFUö–çf&–çEöf–ÇW&R"Â²ÖW76vS¢$Æ&V6öç7G'V7F–öâGRææVR‡VÖ–âî(	–2&W7FW,:’F÷WFRÆ,:—6W'fR÷R6W26öçG,;FÆW2â"Ò“°¢Ð¢&WGW&â&W—&VC°§Ð ¦gVæ7F–öâ&VæFW"‚’°¢'Vå&VæFW%7FW‚&VF—BVÇF–ÖFR"Â‚’ÓâVF—EVÇF–ÖFU'VçF–ÖR‚'&VæFW""’“°¢'Vå&VæFW%7FW‚'&W&—6R”"ÂVç7W&U6öÆô”f÷%6WB“°¢'Vå&VæFW%7FW‚&&÷WFöç2FRÖöFR"Â&VæFW$ÖöFT'WGFöç2“°¢'Vå&VæFW%7FW‚&6öçFW‡FR"Â&VæFW$vÖT6öçFW‡E7G&—“°¢'Vå&VæFW%7FW‚'f—6–öææWW6R"Â&VæFW%7V7FF÷$&ææW"“°¢'Vå&VæFW%7FW‚',:—7VÇFB"Â&VæFW%&W7VÇEæVÂ“°¢'Vå&VæFW%7FW‚'F÷W&æö’"Â&VæFW%F÷W&æÖVçEæVÂ“°¢'Vå&VæFW%7FW‚'GWF÷&–VÂ"Â&VæFW%GWF÷&–Ä÷fW&Æ’“°¢'Vå&VæFW%7FW‚,:—FBFRÎ(	œ:–6†ævR"Â&VæFW%&ÆÇ•7FFR“°¢'Vå&VæFW%7FW‚&VffWB"Â&VæFW$VffV7Dæ÷F–6R“°¢'Vå&VæFW%7FW‚'66÷&R"Â&VæFW$FW6·F÷ÖF6…66÷&R“°¢6öç7BFW6·F÷Æ–W'2Ò'Vå&VæFW%7FW‚&÷&–VçFF–öâFW2¦÷VWW'2"ÂFW6·F÷Æ–W%&W6VçFF–öâ’ÇÂ²Æö6Ã¢Â÷öæVçC¢Ó°¢–b†VÇ2ævÖT’°¢VÇ2ævÖTæFF6WBæFW6·F÷Æö6ÅÆ–W"Ò7G&–ær†FW6·F÷Æ–W'2æÆö6Â“°¢VÇ2ævÖTæFF6WBæFW6·F÷÷öæVçEÆ–W"Ò7G&–ær†FW6·F÷Æ–W'2æ÷öæVçB“°¢Ð¢'Vå&VæFW%7FW‚'&öf–Â¦÷VWW""Â‚’Óâ&VæFW%Æ–W%æVÂ†FW6·F÷Æ–W'2æÆö6ÂÂVÇ2çÆ–W#æVÂ’“°¢'Vå&VæFW%7FW‚'&öf–ÂGfW'6—&R"Â‚’Óâ&VæFW%Æ–W%æVÂ†FW6·F÷Æ–W'2æ÷öæVçBÂVÇ2çÆ–W#%æVÂ’“°¢'Vå&VæFW%7FW‚&Ö–âGfW'6R"Â&VæFW$÷öæVçD†æE&WfVÄ6öçG&öÇ2“°¢'Vå&VæFW%7FW‚'ÆFVR"Â&VæFW$6VçFW%Æ–VD6&B“°¢'Vå&VæFW%7FW‚&†—7F÷&—VR"Â&VæFW$Æör“°¢'Vå&VæFW%7FW‚'7–æ6‡&öæ—6F–öâ"Â&VæFW%6W'fW%7–æ5æVÂ“°¢'Vå&VæFW%7FW‚$$ôõ5B"Â&VæFW$&ö÷7DÖöFÂ“°¢'Vå&VæFW%7FW‚&6†ö—‚N(	–VffWB"Â&VæFW$VffV7D6†ö–6TÖöFÂ“°¢'Vå&VæFW%7FW‚&6†ö—‚W'6öæævR"Â&VæFW$6ö6„6†ö–6TÖöFÂ“°¢'Vå&VæFW%7FW‚&6†ö—‚FR7W&W76–öâ"Â&VæFW%&VÖ÷fT6†ö–6TÖöFÂ“°¢'Vå&VæFW%7FW‚'6ÆÆRN(	–GFVçFR"Â&VæFW%v—F–æu&ööÔÖöFÂ“°¢'Vå&VæFW%7FW‚'¦ööÒ6'FW2"Â‚’ÓâGF6„–ÖvU¦ööÔ†æFÆW'2†VÇ2ævÖTÇÂFö7VÖVçB’“°¢v–æF÷rç&WVW7Dæ–ÖF–öäg&ÖR‚‚’Óâ'Vå&VæFW%7FW‚'÷6—F–öâFW26'FW2"Â‚’ÓâF§W7D6&DÖvæ–f–6F–öä÷&–v–ç2†VÇ2ævÖTÇÂFö7VÖVçB’’“°¢'Vå&VæFW%7FW‚&6öçG,;FÆW2f—6–öææWW6R"ÂÇ•7V7FF÷$6öçG&öÇ2“°¢–b‚5T5DDõ%ôÔôDRæVæ&ÆVB’°¢'Vå&VæFW%7FW‚'7–æ6‡&öæ—6F–öâF–fl:—,:–R"Â66†VGVÆU6W'fW%7–æ2“°¢'Vå&VæFW%7FW‚'7W'fV–ÆÆæ6R”"Â66†VGVÆU6öÆô”çVFvR“°¢'Vå&VæFW%7FW‚'F÷W"”"ÂÖ–&U'Vå6öÆô’“°¢Ð¢'Vå&VæFW%7FW‚&æ÷F–f–6F–öâ–çFW&f6R"Â‚’Óâv–æF÷ræF—7F6„WfVçB†æWr7W7FöÔWfVçB‚'FVææ—2ÖÆ–v‡C¦ÖF6‚×&VæFW""’’“°¢'Vå&VæFW%7FW‚'6WfVv&FRÆö6ÆR"Â66†VGVÆTÆö6ÄÖö&–ÆTÖF6…6fR“°¢v–æF÷rçVWVTÖ–7&÷F6²‚‚’Óâ'Vå&VæFW%7FW‚&6öçG,;FÆW2GRF÷W"‡VÖ–â"ÂVç7W&UVÇF–ÖFT‡VÖåGW&ä6öçG&öÇ2’“°§Ð ¦gVæ7F–öâF§W7D6&DÖvæ–f–6F–öä÷&–v–ç2‡&ö÷BÒFö7VÖVçB’°¢6öç7Bf–Ww÷'Ev–GF‚ÒÖF‚æÖ‚ƒÂv–æF÷ræ–ææW%v–GF‚ÇÂFö7VÖVçBæFö7VÖVçDVÆVÖVçBæ6Æ–VçEv–GF‚ÇÂ“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚"æ6&Bæ†2×f—7VÂÂæ6†&7FW"Ö6&BÂçÆ–VB×f—7VÂ"’æf÷$V6‚‚†6&B’Óâ°¢6öç7B&÷VæG2Ò6&BævWD&÷VæF–æt6Æ–VçE&V7B‚“°¢6öç7B6VçFW"Ò&÷VæG2æÆVgB²†&÷VæG2çv–GF‚ò"“°¢6&Bç7G–ÆRçG&ç6f÷&Ô÷&–v–âÒ6VçFW"Âf–Ww÷'Ev–GF‚¢ã#€¢ò&ÆVgB6VçFW" ¢¢6VçFW"âf–Ww÷'Ev–GF‚¢ãs ¢ò'&–v‡B6VçFW" ¢¢&6VçFW"6VçFW"#°¢Ò“°§Ð ¦gVæ7F–öâ&VæFW%7V7FF÷$&ææW"‚’°¢ÆWB&ææW"ÒFö7VÖVçBçVW'•6VÆV7F÷"‚"77V7FF÷$Æ—fT&ææW""“°¢–b‚5T5DDõ%ôÔôDRæVæ&ÆVB’°¢&ææW#òç&VÖ÷fR‚“°¢&WGW&ã°¢Ð¢–b‚&ææW"’°¢&ææW"ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚'6V7F–öâ"“°¢&ææW"æ–BÒ'7V7FF÷$Æ—fT&ææW"#°¢&ææW"æ6Æ74æÖRÒ'7V7FF÷"ÖÆ—fRÖ&ææW"#°¢VÇ2çF÷W&æÖVçEæVÃòæ&Vf÷&R†&ææW"“°¢Ð¢&ææW"æ–ææW$…DÔÂÒ ¢Ç7G&öæsäÔôDRd•4”ôääUU4SÂ÷7G&öæsà¢Ç7ãâG¶W66T‡FÖÂ…5T5DDõ%ôÔôDRæÖF6„Æ&VÂÇÂ$ÖF6‚Vâ6÷W'2"—Ò+rG¶W66T‡FÖÂ…5T5DDõ%ôÔôDRæÆ—fU66÷&RÇÂ%66÷&RVâF—&V7B"—ÓÂ÷7ãà¢Ç7ãäÖ–ç2Ö7\:–W2+rV7VæR7F–öâ÷76–&ÆSÂ÷7ãà¢°§Ð ¦gVæ7F–öâÇ•7V7FF÷$6öçG&öÇ2‚’°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚'7V7FF÷"ÖÖöFR"Â5T5DDõ%ôÔôDRæVæ&ÆVB“°¢–b‚5T5DDõ%ôÔôDRæVæ&ÆVBÇÂVÇ2ævÖT’&WGW&ã°¢VÇ2ævÖTçVW'•6VÆV7F÷$ÆÂ‚&'WGFöâ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢6öç7B—5&VDöæÇ”6&E&Wf–WrÒ'WGFöâæÖF6†W2‚%¶FFÖ–ÖvR×¦ööÕÒ"“°¢'WGFöâæF—6&ÆVBÒ'WGFöâÓÒVÇ2ç7V7FF÷%V—D'WGFöâbb—5&VDöæÇ”6&E&Wf–Ws°¢Ò“°§Ð ¦gVæ7F–öâ&VæFW%GWF÷&–Ä÷fW&Æ’‚’°¢–b‚VÇ2çGWF÷&–Ä÷fW&Æ’’&WGW&ã°¢6öç7B7FWÒGWF÷&–Å7FW‚“°¢–b‚7FFRçGWF÷&–Âæ7F—fRÇÂ7FW’°¢6ÆV%GWF÷&–ÅG—–ær‚“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7Bç&VÖ÷fR‚'GWF÷&–Â×'Vææ–ær"Â'GWF÷&–ÂÖv—F–ærÖ7F–öâ"Â'GWF÷&–Â×6†÷v66RÖ7F—fR"Â'GWF÷&–ÂÖWFò×VæF–ær"Â'GWF÷&–Â×&VFöæÇ’"Â'GWF÷&–ÂÖ–çFW&f6R×F÷W""“°¢VÇ2çGWF÷&–Ä÷fW&Æ’æ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢VÇ2çGWF÷&–Ä÷fW&Æ’æ–ææW$…DÔÂÒ"#°¢&WGW&ã°¢Ð¢6öç7BÖöGVÆRÒGWF÷&–ÄÖöGVÆR‚“°¢6öç7B7F–öâÒ7FWæ7F–öâóòçVÆÃ°¢6öç7Bæ'&F÷"ÒEUDõ$”Åôä%$Dõ%5·7FWææ'&F÷"óòÖöGVÆRææ'&F÷%ÒóòEUDõ$”Åôä%$Dõ%2æ6ö6„§S°¢6öç7B&öw&W72Ò7FWæF—7Æ•7FWò+r8—FRG·7FWæF—7Æ•7FWÒòG¶ÖöGVÆRçF÷FÄF—7Æ•7FW7ÒG·7FWç'Bò+rG·7FWç'GÖ¢"'Ö¢"#°¢6öç7BWFõVæF–ærÒ7FFRçGWF÷&–ÂçVæF–ætWFõ7FW–BÓÓÒ7FWæ–C°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BæFB‚'GWF÷&–Â×'Vææ–ær"“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚'GWF÷&–Â×&VFöæÇ’"Â&ööÆVâ†ÖöGVÆRç&VDöæÇ’’“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚'GWF÷&–ÂÖ–çFW&f6R×F÷W""ÂÖöGVÆRç66Væ&–òÓÓÒ&–çFW&f6R"“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚'GWF÷&–ÂÖv—F–ærÖ7F–öâ"Â&ööÆVâ†7F–öâ’“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚'GWF÷&–Â×6†÷v66RÖ7F—fR"Â&ööÆVâ‡7FWç6†÷v66R’“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚'GWF÷&–ÂÖWFò×VæF–ær"ÂWFõVæF–ær“°¢VÇ2çGWF÷&–Ä÷fW&Æ’æ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2çGWF÷&–Ä÷fW&Æ’æ–ææW$…DÔÂÒ ¢G·&VæFW%GWF÷&–Å6†÷v66R‡7FWç6†÷v66R—Ð¢Æ6–FR6Æ73Ò'GWF÷&–ÂÖF–ÆöwVRG¶7F–öâò'GWF÷&–ÂÖF–ÆöwVRÖ7F–öâ"¢"'Ò"&–ÖÆ&VÃÒ%GWF÷&–VÂ#à¢ÆF—b6Æ73Ò'GWF÷&–Â×÷'G&—B#à¢Æ–Ör7&3Ò"G¶æ'&F÷"æ–ÖvWÒ"ÇCÒ%÷'G&—BFRG¶æ'&F÷"ææÖWÒ"óà¢ÂöF—cà¢ÆF—b6Æ73Ò'GWF÷&–ÂÖF–ÆöwVRÖ6öçFVçB#à¢Ç6Æ73Ò'GWF÷&–ÂÖ¶–6¶W"#âG¶ÖöGVÆRæÆW76öçÒG·&öw&W77ÓÂ÷à¢ÆF—b6Æ73Ò'GWF÷&–Â×7V¶W"ÖÆ–æR#ãÇ7G&öæsâG¶æ'&F÷"ææÖWÓÂ÷7G&öæsãÇ7ãâG¶æ'&F÷"ç&öÆWÓÂ÷7ããÂöF—cà¢Æƒ#âG·7FWçF—FÆWÓÂöƒ#à¢Ç6Æ73Ò'GWF÷&–ÂÖ6÷’"&–ÖÆ&VÃÒ"G¶W66T‡FÖÂ‡GWF÷&–ÅÆ–åFW‡B‡7FWçFW‡B’—Ò#ãÇ7âFF×GWF÷&–Â×G—VB×FW‡CãÂ÷7ããÇ7â6Æ73Ò'GWF÷&–Â×G—Ww&—FW"Ö6&WB"&–Ö†–FFVãÒ'G'VR#ãÂ÷7ããÂ÷à¢G·7FWç7VÖÖ'“òæÆVæwF‚òÇVÂ6Æ73Ò'GWF÷&–Â×7VÖÖ'’#âG·7FWç7VÖÖ'’æÖ‚†—FVÒ’ÓâÆÆ“âG¶W66T‡FÖÂ†—FVÒ—ÓÂöÆ“æ’æ¦ö–â‚""—ÓÂ÷VÃæ¢"'Ð¢G·7FFRçGWF÷&–ÂæW'&÷"òÇ6Æ73Ò'GWF÷&–ÂÖW'&÷""&öÆSÒ&ÆW'B#âG¶W66T‡FÖÂ‡7FFRçGWF÷&–ÂæW'&÷"—ÓÂ÷æ¢"'Ð¢G¶7F–öâòÇ6Æ73Ò'GWF÷&–ÂÖ7F–öâ#âG·GWF÷&–Ä7F–öäÆ&VÂ†7F–öâ—ÓÂ÷æ¢"'Ð¢G¶WFõVæF–æròsÇ6Æ73Ò'GWF÷&–Â×v—B"&öÆSÒ'7FGW2#ãÇ7â&–Ö†–FFVãÒ'G'VR#ãÂ÷7ãä6ö6‚§R,:—&R6,:—öç6RââãÂ÷âr¢"'Ð¢G²7F–öâbbWFõVæF–æròÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâGWF÷&–ÂÖæW‡BÖ'WGFöâ"G—SÒ&'WGFöâ"FF×GWF÷&–ÂÖæW‡Cäff–6†W"F÷WCÂö'WGFöãæ¢"'Ð¢ÂöF—cà¢Âö6–FSà¢°¢VÇ2çGWF÷&–Ä÷fW&Æ’çVW'•6VÆV7F÷"‚%¶FF×GWF÷&–ÂÖæW‡EÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢–b‡GWF÷&–ÅG—–æu&öw&W72ÂGWF÷&–ÅG—–æuFW‡BæÆVæwF‚’°¢&WfVÅGWF÷&–ÅFW‡B‚“°¢&WGW&ã°¢Ð¢–b‡7FWæf–æÂ’°¢f–æ—6…GWF÷&–Â‚“°¢ÒVÇ6R°¢Gfæ6UGWF÷&–Â‚“°¢Ð¢Ò“°¢7F'EGWF÷&–ÅG—–ær‡7FW“°¢6öç7B†5f—7VÅF&vWBÒ&ööÆVâ‡7FWæ7F–öâÇÂ7FWæfö7W3òæÆVæwF‚ÇÂ7FWç6†÷v66R“°¢–b††5f—7VÅF&vWBbb7FFRçGWF÷&–Âç67&öÆÆVE7FW–BÓÒ7FWæ–B’°¢7FFRçGWF÷&–Âç67&öÆÆVE7FW–BÒ7FWæ–C°¢v–æF÷rçVWVTÖ–7&÷F6²‚‚’Óâ°¢6öç7BF&vWBÒFö7VÖVçBçVW'•6VÆV7F÷"‚"çGWF÷&–ÂÖfö7W2×F&vWB"“°¢6öç7BF–ÆöwVRÒFö7VÖVçBçVW'•6VÆV7F÷"‚"çGWF÷&–ÂÖF–ÆöwVR"“°¢–b‚F&vWBÇÂF–ÆöwVR’&WGW&ã°¢6öç7BF&vWE&V7BÒF&vWBævWD&÷VæF–æt6Æ–VçE&V7B‚“°¢6öç7BF–ÆöwVU&V7BÒF–ÆöwVRævWD&÷VæF–æt6Æ–VçE&V7B‚“°¢6öç7BF&vWDFö7VÖVçEF÷Òv–æF÷rç67&öÆÅ’²F&vWE&V7BçF÷°¢6öç7BæW‡E67&öÆÅF÷ÒÖF‚æÖ‚ƒÂF&vWDFö7VÖVçEF÷Ò‚„ÖF‚æÖ‚ƒcÂF–ÆöwVU&V7BçF÷’ÒF&vWE&V7Bæ†V–v‡B’ò"’“°¢v–æF÷rç67&öÆÅFò‡²F÷¢æW‡E67&öÆÅF÷Â&V†f–÷#¢&WFò"Ò“°¢Ò“°¢Ð§Ð ¦gVæ7F–öâ&VæFW%GWF÷&–Å6†÷v66R‡6†÷v66R’°¢–b‚6†÷v66R’&WGW&â"#°¢6öç7B6&BÒ4$EôÄ”%$%’æf–æB‚†—FVÒ’Óâ—FVÒæ–BÓÓÒ6†÷v66Ræ6&D–B“°¢6öç7B–ÖvUW&ÂÒ6&Bò4$Eô”ÔtU5¶6&Bæ–EÒ¢çVÆÃ°¢–b‚6&BÇÂ–ÖvUW&Â’&WGW&â"#°¢6öç7BÆÆ÷vVEF&vWG2ÒæWr6WB…²&6÷7B"Â'÷vW""Â'&V6—6–öâ"Â'Æ6VÖVçB"Â&VffV7B"Â&&ö÷7B%Ò“°¢6öç7Bö–çFW'2Ò6†÷v66Rçö–çFW"ò·²F&vWC¢6†÷v66Rçö–çFW"ÂÆ&VÃ¢6†÷v66RæÆ&VÂÕÒ¢µÓ°¢&WGW&â ¢ÆF—b6Æ73Ò'GWF÷&–ÂÖ6&B×6†÷v66RG·ö–çFW'2æÆVæwF‚ò""¢"GWF÷&–ÂÖfö7W2×F&vWB'Ò"&–ÖÆ&VÃÒ$6'FRG¶W66T‡FÖÂ†6&BææÖR—Òw&æF–R#à¢Æ–Ör7&3Ò"G¶–ÖvUW&ÇÒ"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—ÒÒG¶W66T‡FÖÂ†6&Bç7V'F—FÆRóò6&BæfÖ–Ç’—Ò"óà¢G·ö–çFW'2æÖ‚‡ö–çFW"’Óâ°¢6öç7BF&vWBÒÆÆ÷vVEF&vWG2æ†2‡ö–çFW#òçF&vWB’òö–çFW"çF&vWB¢&6÷7B#°¢&WGW&âÇ7â6Æ73Ò'GWF÷&–Â×6†÷v66R×ö–çFW"GWF÷&–ÂÖfö7W2×F&vWBG·F&vWGÒ#âG¶W66T‡FÖÂ‡ö–çFW#òæÆ&VÂóò%&Vv&FR–6’"—ÓÂ÷7ãæ°¢Ò’æ¦ö–â‚""—Ð¢ÂöF—cà¢°§Ð ¦gVæ7F–öâGWF÷&–Ä7F–öäÆ&VÂ†7F–öâ’°¢–b†7F–öâæ¶–æBÓÓÒ'6VÆV7D6&B"’°¢6öç7B6&BÒ4$EôÄ”%$%’æf–æB‚†—FVÒ’Óâ—FVÒæ–BÓÓÒ7F–öâæ6&D–B“°¢&WGW&â<:–ÆV7F–öææRG¶6&CòææÖRóò&Æ6'FR–æF—\:–R'Òæ°¢Ð¢–b†7F–öâæ¶–æBÓÓÒ&VæEGW&â"’&WGW&â&6Æ—VR7W"FW&Ö–æW"ÆRF÷W"#°¢6öç7B6&BÒ4$EôÄ”%$%’æf–æB‚†—FVÒ’Óâ—FVÒæ–BÓÓÒ7F–öâæ6&D–B“°¢6öç7B6&DæÖRÒ6&CòææÖRóò&Æ6'FR–æF—\:–R#°¢–b†7F–öâæÖöFRÓÓÒ'Æ6VÖVçB"’&WGW&â¦÷VRG¶6&DæÖWÒVâ&VÖ—6V°¢–b†7F–öâæÖöFRÓÓÒ&VffV7B"’&WGW&â¦÷VRG¶6&DæÖWÒVâVffWF°¢–b†7F–öâæÖöFRÓÓÒ&&ö÷7B"’&WGW&â¦÷VRG¶6&DæÖWÒVâ&ö÷7F°¢&WGW&â6Æ—VR7W"¦÷VW"÷W"WF–Æ—6W"G¶6&DæÖWÒæ°§Ð ¦gVæ7F–öâVç7W&U6öÆô”f÷%6WB‚’°¢–b…5T5DDõ%ôÔôDRæVæ&ÆVBÇÂ4U%dU%õ5”ä2æVæ&ÆVBÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚æVæ&ÆVB’&WGW&ã°¢–b‚4ôÄõô’æVæ&ÆVB’°¢4ôÄõô’æVæ&ÆVBÒG'VS°¢4ôÄõô’çF†–æ¶–ærÒfÇ6S°¢4ôÄõô’æW†V7WF–ærÒfÇ6S°¢4ôÄõô’æçVFvUf—6–&ÆRÒfÇ6S°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’çF–ÖW"“°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’æçVFvUF–ÖW"“°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’æçVFvTWFõF–ÖW"“°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’çvF6†FöuF–ÖW"“°¢7FFRæÆörçVç6†–gB‚$ÖöFR6WB”¢6ö6‚Ö‚W7B&W&—2"Ât”â"“°¢Ð§Ð ¦gVæ7F–öâ&VæFW$ÖöFT'WGFöç2‚’°¢–b†VÇ2æÖöFT–æfô&FvR’VÇ2æÖöFT–æfô&FvRçFW‡D6öçFVçBÒ7W'&VçDÖöFTÆ&VÂ‚“°¢–b†VÇ2ç&WGW&äÆö&'”'WGFöâ’VÇ2ç&WGW&äÆö&'”'WGFöâçFW‡D6öçFVçBÒe$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBò%&WF÷W"6ÇV"†÷W6R"¢%&WF÷W"67VV–Â#°¢–b†VÇ2çF÷&öw&W76–öä7F–öç2’°¢VÇ2çF÷&öw&W76–öä7F–öç2æ–ææW$…DÔÂÒ&VæFW%&ÆÇ”VæD7F–öç2‚“°¢VÇ2çF÷&öw&W76–öä7F–öç2æ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"ÂVÇ2çF÷&öw&W76–öä7F–öç2æ–ææW$…DÔÂçG&–Ò‚’“°¢&–æE&ÆÇ”VæD7F–öç2†VÇ2çF÷&öw&W76–öä7F–öç2“°¢Ð¢6öç7B6ö×ÆWFVDg&–VæFÇ”ÖF6‚Ò&ööÆVâ„e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBbb7FFRævÖT÷fW"bb7FFRç6WDÖF6ƒòæÖF6„÷fW"“°¢VÇ2ç&WGW&äÆö&'”'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&g&–VæFÇ’ÖÖF6‚Ö6ö×ÆWFR×&WGW&â"Â6ö×ÆWFVDg&–VæFÇ”ÖF6‚“°¢VÇ2ç6fTÖF6„'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â7FFRçF÷W&æÖVçCòçvVV¶Ç’“°¢6öç7B6ö×WF—F–öäf–Æ&ÆRÒ&ööÆVâ‡7FFRçF÷W&æÖVçCòæ7F—fRbb5T5DDõ%ôÔôDRæVæ&ÆVB“°¢VÇ2æ6ö×WF—F–öäF–Æöt'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â6ö×WF—F–öäf–Æ&ÆR“°¢–b‚6ö×WF—F–öäf–Æ&ÆR’6Æ÷6T6ö×WF—F–öäF–Æör‚“°¢–b†VÇ2ævÖT76—7D'WGFöâ’VÇ2ævÖT76—7D'WGFöâç6WDGG&–'WFR‚&&–ÖW‡æFVB"Â7G&–ær„tÔUÄ•ô54•5BçæVÄ÷Vâ’“°¢VÇ2ævÖT76—7EæVÃòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"ÂtÔUÄ•ô54•5BçæVÄ÷Vâ“°¢–b†VÇ2ævÖT–æf÷&ÖF–öåFövvÆR’VÇ2ævÖT–æf÷&ÖF–öåFövvÆRæ6†V6¶VBÒtÔUÄ•ô54•5Bæ–æf÷&ÖF–öã°¢–b†VÇ2ævÖTÇv—5f—6–&ÆT7F–öç5FövvÆR’VÇ2ævÖTÇv—5f—6–&ÆT7F–öç5FövvÆRæ6†V6¶VBÒtÔUÄ•ô54•5BæÇv—5f—6–&ÆT7F–öç3°¢–b†VÇ2ævÖT6&E¦ööÕFövvÆR’VÇ2ævÖT6&E¦ööÕFövvÆRæ6†V6¶VBÒtÔUÄ•ô54•5Bæ6&E¦ööÓ°¢–b†VÇ2ævÖTFF—fT&ö&EFövvÆR’VÇ2ævÖTFF—fT&ö&EFövvÆRæ6†V6¶VBÒtÔUÄ•ô54•5BæFF—fT&ö&C°¢–b†VÇ2ævÖT6&DFW67&—F–öç5FövvÆR’VÇ2ævÖT6&DFW67&—F–öç5FövvÆRæ6†V6¶VBÒtÔUÄ•ô54•5Bæ6&DFW67&—F–öç3°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚&vÖRÖFF—fRÖ&ö&B"ÂtÔUÄ•ô54•5BæFF—fT&ö&B“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚&vÖRÖ7F–öç2ÖÇv—2×f—6–&ÆR"ÂtÔUÄ•ô54•5BæÇv—5f—6–&ÆT7F–öç2“°¢6öç7B—4FÖ–åÆ–W"Ò6ä66W74FÖ–äfVGW&W2‚’bb5T5DDõ%ôÔôDRæVæ&ÆVC°¢VÇ2æFÖ–ävÖUFööÇ3òæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â—4FÖ–åÆ–W"“°¢–b†VÇ2æFÖ–ävÖUFööÇ4'WGFöâ’VÇ2æFÖ–ävÖUFööÇ4'WGFöâæF—6&ÆVBÒ—4FÖ–åÆ–W#°¢–b‚—4FÖ–åÆ–W"’6WDFÖ–ävÖUFööÇ4÷Vâ†fÇ6R“°¢–b†VÇ2æFÖ–å6–×VÆFU66÷&T'WGFöâ’°¢VÇ2æFÖ–å6–×VÆFU66÷&T'WGFöâæF—6&ÆVBÒ6äFÖ–å6–×VÆFTÖF6…66÷&R‚“°¢VÇ2æFÖ–å6–×VÆFU66÷&T'WGFöâçF—FÆRÒ4U%dU%õ5”ä2æVæ&ÆVBbb4U%dU%õ5”ä2æ—4†÷7@¢ò%6WVÂÂtDÔ”âŒ;GFRWWB6–×VÆW"ÆR66÷&R ¢¢%FW&Ö–æW"6RÖF6‚fV2Vâ66÷&R6–×VÌ:’#°¢Ð¢VÇ2ç7V7FF÷%V—D'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â5T5DDõ%ôÔôDRæVæ&ÆVB“°¢VÇ2ç&WGW&äÆö&'”'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â5T5DDõ%ôÔôDRæVæ&ÆVB“°¢6öç7BöæÆ–æTf÷&fV—Df–Æ&ÆRÒ&ööÆVâ€¢5T5DDõ%ôÔôDRæVæ&ÆV@¢bb7FFRævÖT÷fW ¢bb…4U%dU%õ5”ä2æVæ&ÆVBÇÂ„e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBbbe$”TäDÅ•õDõU$äÔTåBæ–äÖF6‚’’À¢“°¢VÇ2æöæÆ–æTf÷&fV—D'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"ÂöæÆ–æTf÷&fV—Df–Æ&ÆR“°¢–b†VÇ2ç&WfVÄ”'WGFöâ’°¢6öç7B6å&WfVÂÒ—4FÖ–åÆ–W"bb4ôÄõô’æVæ&ÆVBbb7FFRævÖT÷fW#°¢VÇ2ç&WfVÄ”'WGFöâæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â6å&WfVÂ“°¢VÇ2ç&WfVÄ”'WGFöâæ6Æ74Æ—7BçFövvÆR‚&7F—fR"Â7FFRç&WfVÄ”6&G2“°¢VÇ2ç&WfVÄ”'WGFöâçFW‡D6öçFVçBÒ7FFRç&WfVÄ”6&G2ò$Ö–â,:—l:–Ì:–R"¢%,:—l:–ÆW"ÆÖ–â#°¢Ð¢VÇ2æW‡÷'DÆöw4'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â—4FÖ–åÆ–W"“°¢VÇ2æFÖ–åVÇF–ÖFTW‡÷'DÆöw4'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â—4FÖ–åÆ–W"“°¢VÇ2çVÇF–ÖFTW‡÷'DÆöw4'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â…TÅD”ÔDUôÔôDRæ7F—fRbb6ä66W75VÇF–ÖFTfVGW&W2‚’bb5T5DDõ%ôÔôDRæVæ&ÆVB’“°¢VÇ2æW‡÷'D‡VÖäÖF6†W4'WGFöãòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â—4FÖ–åÆ–W"“°§Ð ¦gVæ7F–öâ6WDvÖT76—7EæVÄ÷Vâ†÷Vâ’°¢tÔUÄ•ô54•5BçæVÄ÷VâÒ&ööÆVâ†÷Vâ“°¢VÇ2ævÖT76—7EæVÃòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"ÂtÔUÄ•ô54•5BçæVÄ÷Vâ“°¢VÇ2ævÖT76—7D'WGFöãòç6WDGG&–'WFR‚&&–ÖW‡æFVB"Â7G&–ær„tÔUÄ•ô54•5BçæVÄ÷Vâ’“°§Ð ¦gVæ7F–öâ÷Vä6ö×WF—F–öäF–Æör‚’°¢–b‚7FFRçF÷W&æÖVçCòæ7F—fRÇÂ5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&ã°¢DõU$äÔTåEõäTÅõT’çf—6–&ÆRÒG'VS°¢&VæFW%F÷W&æÖVçEæVÂ‚“°¢VÇ2æ6ö×WF—F–öäF–Æösòæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2æ6ö×WF—F–öäF–Æöt'WGFöãòç6WDGG&–'WFR‚&&–ÖW‡æFVB"Â'G'VR"“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BæFB‚&6ö×WF—F–öâÖF–ÆörÖ÷Vâ"“°¢VÇ2æ6ö×WF—F–öäF–Æöt6Æ÷6Sòæfö7W2‚“°§Ð ¦gVæ7F–öâ6Æ÷6T6ö×WF—F–öäF–Æör‚’°¢VÇ2æ6ö×WF—F–öäF–Æösòæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢VÇ2æ6ö×WF—F–öäF–Æöt'WGFöãòç6WDGG&–'WFR‚&&–ÖW‡æFVB"Â&fÇ6R"“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7Bç&VÖ÷fR‚&6ö×WF—F–öâÖF–ÆörÖ÷Vâ"“°§Ð ¦gVæ7F–öâ7W'&VçDÖF6…66÷&UFW‡B‚’°¢–b‚7FFRç6WDÖF6ƒòæVæ&ÆVB’&WGW&â,8–6†ævRÆ–'&R#°¢6öç7B6ö×ÆWFVBÒ'&’æ—4'&’‡7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2’ò7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2¢µÓ°¢6öç7B66÷&W2Ò6ö×ÆWFVBæÖ‚‡66÷&R’ÓâG´çVÖ&W"‡66÷&Sòå³ÒÇÂ—Þ(	2G´çVÖ&W"‡66÷&Sòå³ÒÇÂ—Ö“°¢–b‚7FFRç6WDÖF6‚ç6WD÷fW"bb'&’æ—4'&’‡7FFRç6WDÖF6‚ç66÷&R’’66÷&W2çW6‚†G´çVÖ&W"‡7FFRç6WDÖF6‚ç66÷&U³ÒÇÂ—Þ(	2G´çVÖ&W"‡7FFRç6WDÖF6‚ç66÷&U³ÒÇÂ—Ö“°¢&WGW&â66÷&W2æÆVæwF‚ò66÷&W2æ¦ö–â‚"+r"’¢#(	3#°§Ð ¦gVæ7F–öâÆVwVT‡VÖå7FæF–æu&VÖ–æFW"‚’°¢–b‚7FFRçF÷W&æÖVçCòæÆVwVR’&WGW&â"#°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢f÷"†6öç7Bw&÷Wöb²$"Â$"%Ò’°¢6öç7B&÷w2ÒÆVwVU7FæF–æw2†w&÷WÂÆVwVT6ö×ÆWFVDw&÷WF—2‚’“°¢6öç7B–æFW‚Ò&÷w2æf–æD–æFW‚‚‡&÷r’Óâ&÷ræVçG'’ÓÓÒ‡VÖâ“°¢–b†–æFW‚ãÒ’&WGW&âw&÷WRG¶w&÷WÒ+rG¶–æFW‚²ÖR+rG·&÷w5¶–æFW…Òçö–çG7ÒG2+r6WG2G¶f÷&ÖDÆVwVTF–ffW&Væ6R‡&÷w5¶–æFW…Òç6WDF–ffW&Væ6R—Ö°¢Ð¢&WGW&â"#°§Ð ¦gVæ7F–öâ&VæFW$vÖT6öçFW‡E7G&—‚’°¢–b‚VÇ2ævÖT6öçFW‡E7G&—ÇÂ7FFRçÆ–W'3òæÆVæwF‚’&WGW&ã°¢6öç7Bf÷&ÖBÒ7FFRçF÷W&æÖVçCòæ7F—fP¢òG·7FFRçF÷W&æÖVçBæ6ö×WF—F–öäæÖRÇÂ$6ö×:—F—F–öâ'ÒG¶‡VÖåF÷W&æÖVçE&÷VæDÆ&VÂ‚’ò+rG¶‡VÖåF÷W&æÖVçE&÷VæDÆ&VÂ‚—Ö¢"'Ö ¢¢7FFRç6WDÖF6ƒòæVæ&ÆV@¢òG´çVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2ÇÂ—Ò6WBG´çVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2ÇÂ’âò'2"¢"'ÒvvæçBG´çVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2ÇÂ’âò'2"¢"'Ö ¢¢,8–6†ævRÆ–'&R#°¢6öç7BF–ff–7VÇG’Ò4ôÄõô’æVæ&ÆV@¢ò7FFRçF÷W&æÖVçCòæ7F—fP¢ò”G·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’ÇÂ&æ÷&ÖÂ"—Ö ¢¢”G¶•7G–ÆTÆ&VÂ‚—Ö ¢¢4U%dU%õ5”ä2æVæ&ÆVBò$VâÆ–væR"¢$Æö6Â#°¢6öç7BVæ6÷VçFW&VD”ÆWfVÂÒ4ôÄõô’æVæ&ÆV@¢ò”–çFVÆÆ–vVæ6Tf÷$VçG'’…4ôÄõô’æ6†&7FW$–BÂ7FFRçF÷W&æÖVçCòæF–ff–7VÇG’ÇÂ4ôÄõô’æF–ff–7VÇG’¢¢çVÆÃ°¢6öç7BVæ6÷VçFW&VD”Æ&VÂÒVæ6÷VçFW&VD”ÆWfVÀ¢ò‡²ÖFWW#¢$ÖFWW""Âæ÷&ÖÃ¢$æ÷&ÖÂ"ÂW‡W'C¢$W‡W'B"Â6†×–öã¢$6†×–öâ"ÂÆVvVæC¢$Ì:–vVæFR"Õ¶Væ6÷VçFW&VD”ÆWfVÅÒÇÂ$æ÷&ÖÂ"¢¢çVÆÃ°¢6öç7B7FæF–ærÒÆVwVT‡VÖå7FæF–æu&VÖ–æFW"‚“°¢VÇ2ævÖT6öçFW‡E7G&—æ–ææW$…DÔÂÒ ¢ÆF—cãÇ7ãäf÷&ÖCÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†f÷&ÖB—ÓÂ÷7G&öæsãÂöF—cà¢G·7FæF–æròÆF—cãÇ7ãä6Æ76VÖVçCÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ‡7FæF–ær—ÓÂ÷7G&öæsãÂöF—cæ¢"'Ð¢ÆF—cãÇ7ãå,:–vÆvSÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†F–ff–7VÇG’—ÓÂ÷7G&öæsãÂöF—cà¢G¶Væ6÷VçFW&VD”Æ&VÂòÆF—b6Æ73Ò&vÖRÖ6öçFW‡BÖ’ÖÆWfVÂ#ãÇ7ãäæ—fVRFRÎ(	””Â÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†Væ6÷VçFW&VD”Æ&VÂ—ÓÂ÷7G&öæsãÂöF—cæ¢"'Ð¢ÆF—b6Æ73Ò&vÖRÖ6öçFW‡B×66÷&R#ãÇ7ãå66÷&SÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†7W'&VçDÖF6…66÷&UFW‡B‚’—ÓÂ÷7G&öæsãÂöF—cà¢°§Ð ¦gVæ7F–öâ6WDFÖ–ävÖUFööÇ4÷Vâ†÷Vâ’°¢6öç7B6†÷VÆD÷VâÒ&ööÆVâ†÷Vâbb6ä66W74FÖ–äfVGW&W2‚’bb5T5DDõ%ôÔôDRæVæ&ÆVB“°¢VÇ2æFÖ–ävÖUFööÇ5æVÃòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â6†÷VÆD÷Vâ“°¢VÇ2æFÖ–ävÖUFööÇ4'WGFöãòç6WDGG&–'WFR‚&&–ÖW‡æFVB"Â7G&–ær‡6†÷VÆD÷Vâ’“°§Ð ¦gVæ7F–öâ'VäFÖ–ävÖUFööÂ†7F–öâ’°¢–b‚6ä66W74FÖ–äfVGW&W2‚’ÇÂ5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&ã°¢6WDFÖ–ävÖUFööÇ4÷Vâ†fÇ6R“°¢7F–öâ‚“°§Ð ¦gVæ7F–öâ7W'&VçDÖöFTÆ&VÂ‚’°¢–b…5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&âÔôDRd•4”ôääUU4R+rGµ5T5DDõ%ôÔôDRæÖF6„Æ&VÂÇÂ&ÖF6‚Vâ6÷W'2'Ö°¢–b…4U%dU%õ5”ä2æVæ&ÆVB’°¢6öç7Bf÷&ÖBÒ4U%dU%õ5”ä2çF&vWE6WG2ÓÓÒ2ò$ÖF6‚26WG2"¢$ÖF6‚"6WG2#°¢&WGW&âÖöFRVâÆ–væR+rG¶f÷&ÖGÖ°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ7F—fR’°¢6öç7BF—FÆRÒ7FFRçF÷W&æÖVçBæ6ö×WF—F–öäæÖRÇÂ‡7FFRçF÷W&æÖVçBçF&vWE6WG2ÓÓÒ2ò%6ÆÒ26WG2"¢%F÷W&æö’"6WG2"“°¢6öç7B7W&f6RÒ7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6TÆ&VÂò+rG·7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6TÆ&VÇÖ¢"#°¢6öç7B”ÆWfVÂÒ7FFRçF÷W&æÖVçBæ”6ÇV$†÷W6Rò+r”G·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’—Ö¢"#°¢&WGW&âG·F—FÆWÒG·7W&f6WÒG¶”ÆWfVÇÒ+rG·F÷W&æÖVçE7FvTÆ&VÂ‚—Ö°¢Ð¢–b‡7FFRç6WDÖF6‚æVæ&ÆVBbb7FFRç6WDÖF6‚çF&vWE6WG2’&WGW&â6öçG&RÂt”+rÖF6‚G·7FFRç6WDÖF6‚çF&vWE6WG7Ò6WG2+r”G¶•7G–ÆTÆ&VÂ‚—Ö°¢–b‡7FFRç6WDÖF6‚æVæ&ÆVB’&WGW&â6öçG&RÂt”+r6WB+r”G¶•7G–ÆTÆ&VÂ‚—Ö°¢–b…4ôÄõô’æVæ&ÆVB’&WGW&â6öçG&RÂt”+r8–6†ævR+r”G¶•7G–ÆTÆ&VÂ‚—Ö°¢&WGW&â$ÖöFRÆö6Â#°§Ð ¦gVæ7F–öâ&öf–ÆT7F—f—G•G—R‚’°¢–b‡7FFRçF÷W&æÖVçCòæg&–VæFÇ’ÇÂe$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBÇÂ4U%dU%õ5”ä2æVæ&ÆVB’&WGW&âçVÆÃ°¢–b‡7FFRçF÷W&æÖVçCòæ7F—fR’°¢–b‚7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚’&WGW&âçVÆÃ°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’&WGW&â%FVææ—26÷W'G26—&7V—B&ò#°¢–b…7G&–ær‡7FFRçF÷W&æÖVçBæ6ö×WF—F–öäæÖRÇÂ""’çFõWW$66R‚’æ–æ6ÇVFW2‚$ÄTuTR"’’&WGW&â$ÆVwVR#°¢&WGW&â%F÷W&æö’6Æ76–2#°¢Ð¢–b‡7FFRç6WDÖF6ƒòæVæ&ÆVBbb7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&â%6WB#°¢–b…4ôÄõô’æVæ&ÆVBbb7FFRævÖT÷fW"’&WGW&â,8–6†ævR#°¢&WGW&âçVÆÃ°§Ð ¦gVæ7F–öâ&öf–ÆT7F—f—G•66÷&R‚’°¢–b‚7FFRç6WDÖF6ƒòæVæ&ÆVB’&WGW&â,8–6†ævRVâ6÷W'2#°¢6öç7B66÷&RÒ'&’æ—4'&’‡7FFRç6WDÖF6‚ç66÷&R’ò7FFRç6WDÖF6‚ç66÷&R¢³ÂÓ°¢&WGW&âG´çVÖ&W"‡66÷&U³ÒÇÂ—ÒòG´çVÖ&W"‡66÷&U³ÒÇÂ—Ö°§Ð ¦7–æ2gVæ7F–öâV&Æ—6…&öf–ÆT7F—f—G’‚’°¢–b‚UD…õ5DDRçW6W"ÇÂ5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&ã°¢6öç7BG—RÒVÇ2ævÖTòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’ò&öf–ÆT7F—f—G•G—R‚’¢çVÆÃ°¢–b‚G—R’°¢–b‚$ôd”ÄUô5D•d•E’æÆ7D7F—fR’&WGW&ã°¢$ôd”ÄUô5D•d•E’æÆ7D7F—fRÒfÇ6S°¢G'’°¢v—BfWF6‚‚"ö’÷&öf–ÆRö7F—f—G’"Â°¢ÖWF†öC¢%õ5B"À¢†VFW'3¢²&6öçFVçB×G—R#¢&Æ–6F–öâö§6öâ"ÒÀ¢&öG“¢¥4ôâç7G&–æv–g’‡²7F—fS¢fÇ6RÒ’À¢Ò“°¢Ò6F6‚†W'&÷"’°¢òòÂvW‡—&F–öâ6W'fWW"&WF—&RW76’WFöÖF—VVÖVçBVæR7F—f—L:’–çFW'&ö×VRà¢Ð¢&WGW&ã°¢Ð¢6öç7B÷öæVçD–æFW‚Ò4ôÄõô’æVæ&ÆVBò4ôÄõô’çÆ–W$–æFW‚¢°¢6öç7B÷öæVçBÒF—7Æ•Æ–W$æÖR‡7FFRçÆ–W'3òå¶÷öæVçD–æFW…Ò’ÇÂ6†&7FW$æÖTg&öÔ–B…4ôÄõô’æ6†&7FW$–BÇÂ&6ö6„Ö‚"“°¢$ôd”ÄUô5D•d•E’æÆ7D7F—fRÒG'VS°¢G'’°¢v—BfWF6‚‚"ö’÷&öf–ÆRö7F—f—G’"Â°¢ÖWF†öC¢%õ5B"À¢†VFW'3¢²&6öçFVçB×G—R#¢&Æ–6F–öâö§6öâ"ÒÀ¢&öG“¢¥4ôâç7G&–æv–g’‡°¢7F—fS¢G'VRÀ¢G—RÀ¢÷öæVçBÀ¢66÷&S¢&öf–ÆT7F—f—G•66÷&R‚’À¢7FFS¢W‡÷'E7–æ57FFR‚’À¢Ò’À¢Ò“°¢Ò6F6‚†W'&÷"’°¢òòÆ'F–RÆö6ÆR6öçF–çVRÜ:¦ÖR6’Âv–æF–6F–öâFR,:—6Væ6RW7BÖöÖVçFì:–ÖVçB–æF—7öæ–&ÆRà¢Ð§Ð ¦gVæ7F–öâF÷W&æÖVçE7FvTÆ&VÂ‚’°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ&F“"ÇÂ7FFRçF÷W&æÖVçBç7FvRÓÓÒ&w&÷W"’&WGW&â&¦÷W&ì:–R#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ&F“""ÇÂ7FFRçF÷W&æÖVçBç7FvRÓÓÒ&w&÷W""’&WGW&â&¦÷W&ì:–R"#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ&F“2"ÇÂ7FFRçF÷W&æÖVçBç7FvRÓÓÒ&w&÷W2"’&WGW&â&¦÷W&ì:–R2#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&÷VæCb"’&WGW&â#†W2FRf–æÆR#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'V'FW""’&WGW&â'V'G2FRf–æÆR#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'VÆ–b"’&WGW&â'VÆ–f–6F–öç2#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”æW‡B"’&WGW&â&ÖF6‚7V—fçB,:§B#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG•6VÖ’"’&WGW&â&FVÖ’Öf–æÆR,:§FR#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'6VÖ’"’&WGW&â&FVÖ’Öf–æÆW2#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”f–æÂ"’&WGW&â&f–æÆR,:§FR#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ&f–æÂ"’&WGW&â&f–æÆR#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6ö×ÆWFR"’&WGW&â'FW&Ö–ì:’#°¢&WGW&â'F÷W&æö’#°§Ð ¦gVæ7F–öâ‡VÖåF÷W&æÖVçE&÷VæDÆ&VÂ‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fR’&WGW&â"#°¢6öç7B7W'&VçBÒ7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚òF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚’¢çVÆÃ°¢6öç7BæW‡BÒ7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–BòF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBææW‡D‡VÖäÖF6„–B’¢çVÆÃ°¢6öç7B&÷VæBÒæW‡Còç&÷VæBÇÂ7W'&VçCòç&÷VæBÇÂ7FFRçF÷W&æÖVçBç7FvS°¢–b‡&÷VæBÓÓÒ&F“"ÇÂ&÷VæBÓÓÒ&w&÷W"’&WGW&â$¦÷W&ì:–R#°¢–b‡&÷VæBÓÓÒ&F“""ÇÂ&÷VæBÓÓÒ&w&÷W""’&WGW&â$¦÷W&ì:–R"#°¢–b‡&÷VæBÓÓÒ&F“2"ÇÂ&÷VæBÓÓÒ&w&÷W2"’&WGW&â$¦÷W&ì:–R2#°¢–b‡&÷VæBÓÓÒ'&÷VæCb"’&WGW&â#†RFRf–æÆR#°¢–b‡&÷VæBÓÓÒ'VÆ–b"’&WGW&â%VÆ–f–6F–öç2#°¢–b‡&÷VæBÓÓÒ'V'FW""’&WGW&â%V'BÖFRÖf–æÆR#°¢–b‡&÷VæBÓÓÒ'6VÖ’"ÇÂ&÷VæBÓÓÒ'&VG•6VÖ’"’&WGW&â$FVÖ’Öf–æÆR#°¢–b‡&÷VæBÓÓÒ&f–æÂ"ÇÂ&÷VæBÓÓÒ'&VG”f–æÂ"’&WGW&â$f–æÆR#°¢&WGW&â"#°§Ð ¦gVæ7F–öâF÷W&æÖVçE7W&f6T&FvT6Æ72‚’°¢6öç7B7W&f6RÒ7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6RÇÂ"#°¢–b‡7W&f6RÓÓÒ&w&72"’&WGW&â'7W&f6R×&÷VæBÖw&72#°¢–b‡7W&f6RÓÓÒ&6Æ’"’&WGW&â'7W&f6R×&÷VæBÖ6Æ’#°¢&WGW&â'7W&f6R×&÷VæBÖ†&B#°§Ð ¦gVæ7F–öâ&VæFW$‡VÖå&÷VæD&FvR‚’°¢6öç7BÆ&VÂÒ‡VÖåF÷W&æÖVçE&÷VæDÆ&VÂ‚“°¢–b‚Æ&VÂ’&WGW&â"#°¢&WGW&âÇ7â6Æ73Ò'7W&f6R×&÷VæBÖ&FvRG·F÷W&æÖVçE7W&f6T&FvT6Æ72‚—Ò#âG¶Æ&VÇÓÂ÷7ãæ°§Ð ¦gVæ7F–öâ&VæFW%F÷W&æÖVçD6†×–öâ†6†×–öâÂf–æÂ’°¢6öç7B6†×–öäæÖRÒ6†×–öâòF÷W&æÖVçEÆ–W$Æ&VÂ†6†×–öâ’¢"#°¢6öç7B6†&7FW$–BÒ6†×–öâòF÷W&æÖVçDVçG'”6†&7FW$–B†6†×–öâ’¢çVÆÃ°¢6öç7Bv–ä–ÖvRÒ6†&7FW$–BòÔD4…õ$U5TÅEô”ÔtU5¶6†&7FW$–EÓòçv–â¢çVÆÃ°¢&WGW&â ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6†×–öâG¶6†×–öâò&—2Ö7&÷væVB"¢"'Ò#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#åf–çVWW#Â÷7ãà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6†×–öâ×f—7VÂ#à¢G·v–ä–ÖvRòÆ–Ör6Æ73Ò'F÷W&æÖVçBÖ6†×–öâ×÷'G&—B"7&3Ò"G¶W66T‡FÖÂ‡v–ä–ÖvR—Ò"ÇCÒ%fW'6–öâf–7Fö—&RFRG¶W66T‡FÖÂ†6†×–öäæÖR—Ò"óæ¢"'Ð¢Ç7â6Æ73Ò'F÷W&æÖVçBÖ6†×–öâÖ7&÷vâ#ãÆ–Ör7&3Ò"G´5$õtåô”ÔtWÒ"ÇCÒ$6÷W&öææRGRf–çVWW""óãÂ÷7ãà¢ÂöF—cà¢Ç7G&öæsâG¶W66T‡FÖÂ†6†×–öäæÖR—ÓÂ÷7G&öæsà¢G¶f–æÃòç66÷&RòÆF—b6Æ73Ò'F÷W&æÖVçB×66÷&R#âG¶W66T‡FÖÂ†f–æÂç66÷&R—ÓÂöF—cæ¢"'Ð¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ&VæFW%F÷W&æÖVçE6WE66÷&W2‡66÷&UFW‡BÂ—4Æ—fRÒfÇ6RÂv–ææW%6–FRÒçVÆÂ’°¢6öç7B6ÆVå66÷&RÒ7G&–ær‡66÷&UFW‡BÇÂ""’ç&WÆ6R‚õÇ2¬+uÇ2¤TâD•$T5EÇ2¢Bö’Â""’çG&–Ò‚“°¢–b‚6ÆVå66÷&R’&WGW&â"#°¢6öç7B6WE66÷&W2Ò6ÆVå66÷&Rç7Æ—B‚õÇ2²ÕÇ2²ò’æf–ÇFW"„&ööÆVâ“°¢&WGW&âÆF—b6Æ73Ò'F÷W&æÖVçB×66÷&RF÷W&æÖVçB×6WB×66÷&W2G¶—4Æ—fRò&Æ—fR"¢"'Ò"&–ÖÆ&VÃÒ"G¶—4Æ—fRò%66÷&RVâF—&V7B"¢%66÷&Rf–æÂ'Ò#âG·6WE66÷&W2æÖ‚‡66÷&R’Óâ°¢6öç7B¶ÆVgBÂ&–v‡EÒÒ66÷&Rç7Æ—B‚"ò"’æÖ‚‡fÇVR’ÓâçVÖ&W"‡fÇVRçG&–Ò‚’’“°¢6öç7B6WEv–ææW%6–FRÒÆVgBâ&–v‡Bò&ÆVgB"¢&–v‡BâÆVgBò'&–v‡B"¢çVÆÃ°¢6öç7Bv–ææW$6Æ72Òv–ææW%6–FRbb6WEv–ææW%6–FRÓÓÒv–ææW%6–FRò'v–ææW"×6WB"¢"#°¢&WGW&âÇ7â6Æ73Ò"G·v–ææW$6Æ77Ò#âG¶W66T‡FÖÂ‡66÷&Rç&WÆ6R‚"ò"Â.(	2"’—ÓÂ÷7ãæ°¢Ò’æ¦ö–â‚""—ÓÂöF—cæ°§Ð ¦gVæ7F–öâ&VæFW%F÷W&æÖVçEæVÂ‚’°¢–b‚VÇ2çF÷W&æÖVçEæVÂ’&WGW&ã°¢–b…5T5DDõ%ôÔôDRæVæ&ÆVB’°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒ"#°¢&WGW&ã°¢Ð¢–b‚7FFRçF÷W&æÖVçBæ7F—fR’°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒ"#°¢&WGW&ã°¢Ð¢6öç7BF—FÆRÒ7FFRçF÷W&æÖVçBæ6ö×WF—F–öäæÖRÇÂ‡7FFRçF÷W&æÖVçBçF&vWE6WG2ÓÓÒ2ò%6ÆÒ26WG2"¢%F÷W&æö’"6WG2"“°¢–b‡7FFRçF÷W&æÖVçBæg&–VæFÇ’bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ'v—F–ær"’°¢&VæFW$g&–VæFÇ•F÷W&æÖVçEv—F–æuæVÂ‡F—FÆR“°¢&WGW&ã°¢Ð¢6öç7BÆö6F–öåFW‡BÒ7FFRçF÷W&æÖVçBçvVV¶Ç¢ò·7FFRçF÷W&æÖVçBæ6ö×WF—F–öä6—G’Â7FFRçF÷W&æÖVçBæ6ö×WF—F–öä6÷VçG'’Â7FFRçF÷W&æÖVçBæ6ö×WF—F–öäfÆuÒæf–ÇFW"„&ööÆVâ’æ¦ö–â‚"+r"¢¢"#°¢6öç7B&÷VæC3$ÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ'&÷VæC3""“°¢6öç7B&÷VæCdÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ'&÷VæCb"“°¢6öç7BVÆ–f–6F–öäÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ'VÆ–b"“°¢6öç7BV'FW$ÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ'V'FW""“°¢6öç7B6VÖ”ÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ'6VÖ’"“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢6öç7B6†×–öâÒ7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–C°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’°¢&VæFW$6†×–öç6†—æVÂ‡F—FÆRÂf–æÂÂ6†×–öâ“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’°¢&VæFW$6†×–öç6†—æVÂ‡F—FÆRÂf–æÂÂ6†×–öâ“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBæÆVwVR’°¢&VæFW$ÆVwVUF÷W&æÖVçEæVÂ‡F—FÆRÂf–æÂÂ6†×–öâ“°¢&WGW&ã°¢Ð¢6öç7Bg&–VæFÇ•7FGW2Ò&VæFW$g&–VæFÇ•F÷W&æÖVçE7FGW2‚“°¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒ ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"Ö6÷’#à¢Ç6Æ73Ò&W–V'&÷r#ä6ö×:—F—F–öâVâ6÷W'3Â÷à¢Æƒ#âG·F—FÆWÒG·&VæFW$‡VÖå&÷VæD&FvR‚—ÓÂöƒ#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖÖWF×&÷r#à¢G·7FFRçF÷W&æÖVçBæ”6ÇV$†÷W6RòÇ7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#ä”G·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’—Ò+rG·F÷W&æÖVçD&öçW57VÖÖ'’‚—ÓÂ÷7ãæ¢"'Ð¢G·7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6TÆ&VÂòÇ7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#å7W&f6R+rG¶W66T‡FÖÂ‡7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6TÆ&VÂ—ÓÂ÷7ãæ¢"'Ð¢G¶Æö6F–öåFW‡BòÇ7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"F÷W&æÖVçBÖÆö6F–öâ×&VÖ–æFW"#âG¶W66T‡FÖÂ†Æö6F–öåFW‡B—ÓÂ÷7ãæ¢"'Ð¢G·7FFRçF÷W&æÖVçBçvVV¶Ç’òÇ7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"vVV¶Ç’×ö–çG2×&VÖ–æFW"#åö–çG27V—2+rG¶‡VÖåF÷W&æÖVçEö–çG2‚’çö–çG7ÓÂ÷7ãæ¢"'Ð¢ÂöF—cà¢ÂöF—cà¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâF÷W&æÖVçB×FövvÆRÖ'WGFöâ"G—SÒ&'WGFöâ"FF×FövvÆR×F÷W&æÖVçCà¢GµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò$Ö7VW"ÆRF&ÆVR"¢$ff–6†W"ÆRF&ÆVR'Ð¢Âö'WGFöãà¢ÂöF—cà¢G¶g&–VæFÇ•7FGW7Ð¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ'&6¶WBGµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò""¢&†–FFVâ'Ò#à¢G·&÷VæC3$ÖF6†W2æÆVæwF‚ò ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ&÷VæC3"Ö6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#ãfW3Â÷7ãà¢G·&÷VæC3$ÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—Ð¢ÂöF—cà¢¢"'Ð¢G·&÷VæCdÖF6†W2æÆVæwF‚ò ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ&÷VæCbÖ6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#ã†W3Â÷7ãà¢G·&÷VæCdÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—Ð¢ÂöF—cà¢¢"'Ð¢G·7FFRçF÷W&æÖVçBçvVV¶Ç’bbVÆ–f–6F–öäÖF6†W2æÆVæwF‚ò ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâVÆ–f–6F–öâÖ6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#åVÆ–f–6F–öç3Â÷7ãà¢G·VÆ–f–6F–öäÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—Ð¢ÂöF—cà¢¢"'Ð¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#åV'G3Â÷7ãà¢G·V'FW$ÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—Ð¢ÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äFVÖ–W3Â÷7ãà¢G·6VÖ”ÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—Ð¢ÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äf–æÆSÂ÷7ãà¢G·&VæFW%F÷W&æÖVçDÖF6‚†f–æÂÂG'VR—Ð¢ÂöF—cà¢G·&VæFW%F÷W&æÖVçD6†×–öâ†6†×–öâÂf–æÂ—Ð¢ÂöF—cà¢°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×FövvÆR×F÷W&æÖVçEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFövvÆUF÷W&æÖVçEæVÂ“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×7F'B×F÷W&æÖVçB×6VÖ•Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ66†VGVÆU6öÆõF÷W&æÖVçDÖF6‚‡7F'EF÷W&æÖVçE6VÖ’’“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×7F'B×F÷W&æÖVçBÖf–æÅÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ66†VGVÆU6öÆõF÷W&æÖVçDÖF6‚‡7F'EF÷W&æÖVçDf–æÂ’“°§Ð ¦gVæ7F–öâ6†×–öç6†—6ö×ÆWFVDF’‡†6R’°¢ÆWB6ö×ÆWFVBÒ°¢6öç7BF—2Ò7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"bb†6RÓÓÒò³Â"Â2ÂBÂUÒ¢³Â"Â5Ó°¢f÷"†6öç7BF’öbF—2’°¢6öç7BÖF6†W2Ò6†×–öç6†—ÖF6†W2‡†6RÂF’“°¢–b†ÖF6†W2æÆVæwF‚bbÖF6†W2æWfW'’‚†ÖF6‚’ÓâÖF6‚çv–ææW"bbÖF6‚ç66÷&R’’6ö×ÆWFVBÒF“°¢Ð¢&WGW&â6ö×ÆWFVC°§Ð ¦gVæ7F–öâ&VæFW$6†×–öç6†—7FæF–æw2‡†6RÂw&÷W’°¢6öç7BF‡&÷Vv„F’Ò6†×–öç6†—6ö×ÆWFVDF’‡†6R“°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’°¢6öç7B&÷w2ÒöæUö–çDÖ7FW%7FæF–æw2†w&÷WÂF‡&÷Vv„F’“°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&ÆVwVR×7FæF–æw26†×–öç6†—×7FæF–æw2öæR×ö–çBÖÖ7FW"×7FæF–æw2#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#äw&÷WRG¶w&÷WÓÂ÷7ãà¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Ö†VB#à¢Ç7ãå&æsÂ÷7ããÇ7ãäæöÓÂ÷7ããÇ7ãåö–çG3Â÷7ããÇ7ãäF–fl:—&Væ6SÂ÷7ããÇ7ãä&ö÷7CÂ÷7ããÇ7ãã"ÓÂ÷7ãà¢ÂöF—cà¢G·&÷w2æÖ‚‡&÷rÂ–æFW‚’Óâ ¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2×&÷rG¶–æFW‚Â2bbF‡&÷Vv„F’ãÒRò'VÆ–f–VB"¢"'ÒG¶—4‡VÖåF÷W&æÖVçDVçG'’‡&÷ræVçG'’’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7G&öær6Æ73Ò&ÆVwVR×&æ²#âG¶–æFW‚²ÓÂ÷7G&öæsà¢Ç7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ‡&÷ræVçG'’’—ÒG·7FFRçF÷W&æÖVçBçF÷W&æÖVçE6VVDçVÖ&W'3òå·&÷ræVçG'•ÒòÆ#â‚G·7FFRçF÷W&æÖVçBçF÷W&æÖVçE6VVDçVÖ&W'5·&÷ræVçG'•×Ò“Âö#æ¢"'ÓÂ÷7ãà¢Ç7G&öæsâG·&÷rçö–çG7ÓÂ÷7G&öæsãÇ7ãâG¶f÷&ÖDÆVwVTF–ffW&Væ6R‡&÷ræF–ffW&Væ6R—ÓÂ÷7ããÇ7ãâG·&÷ræ&ö÷7GÓÂ÷7ããÇ7ãâG·&÷rçGvõ¦W&÷ÓÂ÷7ãà¢ÂöF—cà¢’æ¦ö–â‚""—Ð¢Â÷6V7F–öãæ°¢Ð¢6öç7B&÷w2Ò6†×–öç6†—7FæF–æw2‡†6RÂw&÷WÂF‡&÷Vv„F’“°¢6öç7BVÆ–f–6F–öä6÷VçBÒ†6RÓÓÒò"¢3°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&ÆVwVR×7FæF–æw26†×–öç6†—×7FæF–æw2#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#äw&÷WRG¶w&÷WÓÂ÷7ãà¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Ö†VB#à¢Ç7ãå&æsÂ÷7ããÇ7ãäæöÓÂ÷7ããÇ7ãåö–çG3Â÷7ããÇ7ãäF–fbâ6WG3Â÷7ããÇ7ãäF–fbâ¦WWƒÂ÷7ãà¢ÂöF—cà¢G·&÷w2æÖ‚‡&÷rÂ–æFW‚’Óâ ¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2×&÷rG¶–æFW‚ÂVÆ–f–6F–öä6÷VçBbbF‡&÷Vv„F’ãÒ2ò'VÆ–f–VB"¢"'ÒG¶—4‡VÖåF÷W&æÖVçDVçG'’‡&÷ræVçG'’’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7G&öær6Æ73Ò&ÆVwVR×&æ²#âG¶–æFW‚²ÓÂ÷7G&öæsà¢Ç7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG·F÷W&æÖVçEÆ–W$Æ&VÂ‡&÷ræVçG'’—ÒG¶”–çFVÆÆ–vVæ6T&FvTÖ&·W‡&÷ræVçG'’—ÓÂ÷7ãà¢Ç7G&öæsâG·&÷rçö–çG7ÓÂ÷7G&öæsà¢Ç7ãâG¶f÷&ÖDÆVwVTF–ffW&Væ6R‡&÷rç6WDF–ffW&Væ6R—ÓÂ÷7ãà¢Ç7ãâG¶f÷&ÖDÆVwVTF–ffW&Væ6R‡&÷rævÖTF–ffW&Væ6R—ÓÂ÷7ãà¢ÂöF—cà¢’æ¦ö–â‚""—Ð¢Â÷6V7F–öãà¢°§Ð ¦gVæ7F–öâ6†×–öç6†—¦öæTÖ&·W‡†6RÂF—FÆRÂ6öçFVçB’°¢6öç7B÷VâÒDõU$äÔTåEõäTÅõT’æ6†×–öç6†—÷Vå¦öæRÓÓÒ†6S°¢6öç7Bf–Æ&ÆRÒ†6RÃÒçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÇÂ¢ÇÂ6†×–öç6†—ÖF6†W2‡†6R’ç6öÖR‚†ÖF6‚’ÓâÖF6‚çÆ–W$bbÖF6‚çÆ–W$"“°¢–b‚f–Æ&ÆR’&WGW&â"#°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—×¦öæRG¶÷Vâò&÷Vâ"¢"'Ò#à¢Æ'WGFöâ6Æ73Ò&6†×–öç6†—×¦öæR×FövvÆR"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—×¦öæSÒ"G·†6WÒ"&–ÖW‡æFVCÒ"G¶÷VçÒ#à¢Ç7ãå¦öæRG·†6WÓÂ÷7ããÇ7G&öæsâG·F—FÆWÓÂ÷7G&öæsãÇ7â&–Ö†–FFVãÒ'G'VR#âG¶÷Vâò.(‰""¢"²'ÓÂ÷7ãà¢Âö'WGFöãà¢ÆF—b6Æ73Ò&6†×–öç6†—×¦öæRÖ6öçFVçBG¶÷Vâò""¢&†–FFVâ'Ò#âG¶6öçFVçGÓÂöF—cà¢Â÷6V7F–öãà¢°§Ð ¦gVæ7F–öâ6†×–öç6†—G&väVçG'•6WB‚’°¢&WGW&âæWr6WB‚‡7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t÷&FW"ÇÂµÒ’ç6Æ–6RƒÂçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—G&uf—6–&ÆT6÷VçBÇÂ’’“°§Ð ¦gVæ7F–öâ6†×–öç6†—Æö&'•Æ–W"†VçG'’ÂG&vâÒ6†×–öç6†—G&väVçG'•6WB‚’’°¢&WGW&âVçG'’bbG&vâæ†2†VçG'’’òF÷W&æÖVçEÆ–W$Æ&VÂ†VçG'’’¢.(	B#°§Ð ¦gVæ7F–öâ&VæFW$6†×–öç6†—Æö&'•7FæF–æw2‡†6RÂw&÷WÂG&vâ’°¢6öç7BF‡&÷Vv„F’Ò6†×–öç6†—6ö×ÆWFVDF’‡†6R“°¢6öç7Bw&÷WVçG&–W2Ò‡†6RÓÓÒ¢ò7FFRçF÷W&æÖVçBæ6†×–öç6†—†6Sw&÷W0¢¢7FFRçF÷W&æÖVçBæ6†×–öç6†—†6S$w&÷W2“òå¶w&÷WÒÇÂµÓ°¢6öç7B&÷w2ÒF‡&÷Vv„F’â ¢ò6†×–öç6†—7FæF–æw2‡†6RÂw&÷WÂF‡&÷Vv„F’¢¢w&÷WVçG&–W2æÖ‚†VçG'’’Óâ‡°¢VçG'’À¢ö–çG3¢À¢6WDF–ffW&Væ6S¢À¢vÖTF–ffW&Væ6S¢À¢Ò’“°¢6öç7BW‡V7FVE&÷w2Ò†6RÓÓÒò2¢C°¢v†–ÆR‡&÷w2æÆVæwF‚ÂW‡V7FVE&÷w2’°¢&÷w2çW6‚‡²VçG'“¢çVÆÂÂö–çG3¢Â6WDF–ffW&Væ6S¢ÂvÖTF–ffW&Væ6S¢Ò“°¢Ð¢6öç7BVÆ–f–6F–öä6÷VçBÒ†6RÓÓÒò"¢3°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&ÆVwVR×7FæF–æw26†×–öç6†—×7FæF–æw2#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#äw&÷WRG¶w&÷WÓÂ÷7ãà¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Ö†VB#à¢Ç7ãå&æsÂ÷7ããÇ7ãäæöÓÂ÷7ããÇ7ãåö–çG3Â÷7ããÇ7ãäF–fbâ6WG3Â÷7ããÇ7ãäF–fbâ¦WWƒÂ÷7ãà¢ÂöF—cà¢G·&÷w2æÖ‚‡&÷rÂ–æFW‚’Óâ°¢6öç7Bf—6–&ÆRÒ&ööÆVâ‡&÷ræVçG'’bbG&vâæ†2‡&÷ræVçG'’’“°¢&WGW&â ¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2×&÷rG¶–æFW‚ÂVÆ–f–6F–öä6÷VçBbbF‡&÷Vv„F’ãÒ2ò'VÆ–f–VB"¢"'ÒG·f—6–&ÆRbb—4‡VÖåF÷W&æÖVçDVçG'’‡&÷ræVçG'’’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7G&öær6Æ73Ò&ÆVwVR×&æ²#âG¶–æFW‚²ÓÂ÷7G&öæsà¢Ç7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG·f—6–&ÆRòG¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ‡&÷ræVçG'’’—ÒG¶”–çFVÆÆ–vVæ6T&FvTÖ&·W‡&÷ræVçG'’—Ö¢.(	B'ÓÂ÷7ãà¢Ç7G&öæsâG·f—6–&ÆRò&÷rçö–çG2¢ÓÂ÷7G&öæsà¢Ç7ãâG·f—6–&ÆRòf÷&ÖDÆVwVTF–ffW&Væ6R‡&÷rç6WDF–ffW&Væ6R’¢#'ÓÂ÷7ãà¢Ç7ãâG·f—6–&ÆRòf÷&ÖDÆVwVTF–ffW&Væ6R‡&÷rævÖTF–ffW&Væ6R’¢#'ÓÂ÷7ãà¢ÂöF—cà¢°¢Ò’æ¦ö–â‚""—Ð¢Â÷6V7F–öãà¢°§Ð ¦gVæ7F–öâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’°¢–b‚ÖF6‚’&WGW&â"#°¢6öç7B&VG”ÒG&vâæ†2†ÖF6‚çÆ–W$“°¢6öç7B&VG”"ÒG&vâæ†2†ÖF6‚çÆ–W$"“°¢6öç7B&VG’Ò&VG”bb&VG”#°¢6öç7Bf—6–&ÆTÖF6‚Ò°¢ââæÖF6‚À¢Æ–W$¢&VG”òÖF6‚çÆ–W$¢çVÆÂÀ¢Æ–W$#¢&VG”"òÖF6‚çÆ–W$"¢çVÆÂÀ¢v–ææW#¢&VG’òÖF6‚çv–ææW"¢çVÆÂÀ¢66÷&S¢&VG’òÖF6‚ç66÷&R¢çVÆÂÀ¢Æ—fU66÷&S¢&VG’òÖF6‚æÆ—fU66÷&R¢çVÆÂÀ¢Ó°¢&WGW&â&VæFW%F÷W&æÖVçDÖF6‚‡f—6–&ÆTÖF6‚ÂÖF6‚æ–BÓÓÒ&f–æÂ"“°§Ð ¦gVæ7F–öâ&VæFW$6†×–öç6†—Æö&'”w&÷W†6R‡†6RÂG&vâ’°¢6öç7Bw&÷W2Ò†6RÓÓÒò$$4DTdt‚"ç7Æ—B‚""’¢²#"Â#""Â#2"Â#B%Ó°¢6öç7BFW67&—F–öç2Ò†6RÓÓÒ¢ò²$6öçG&R2"Â$"6öçG&R2"Â$6öçG&R"%Ð¢¢²$(	4"WB>(	4B"Â$(	4BWB>(	4""Â$(	42WB.(	4B%Ó°¢6öç7B7FæF–æw2ÒÇ6V7F–öâ6Æ73Ò&6†×–öç6†—ÖÆö&'’×6V7F–öâ#ãÇ6Æ73Ò&6†×–öç6†—×6V7F–öâÖÆ&VÂ#äw&÷WW3Â÷ãÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Öw&–B6†×–öç6†—Öw&÷W2#âG¶w&÷W2æÖ‚†w&÷W’Óâ&VæFW$6†×–öç6†—Æö&'•7FæF–æw2‡†6RÂw&÷WÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cãÂ÷6V7F–öãæ°¢6öç7BF—2Ò³Â"Â5ÒæÖ‚†F’’Óâ ¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—ÖF’#à¢Æ†VFW#ãÇ7G&öæsä¦÷W&ì:–RG¶F—ÓÂ÷7G&öæsãÇ7ãâG¶FW67&—F–öç5¶F’Ò×Ò+rG¶6†×–öç6†—ÖF6†W2‡†6RÂF’’æÆVæwF‡ÒÖF6‡3Â÷7ããÂö†VFW#à¢ÆF—b6Æ73Ò&6†×–öç6†—ÖF’ÖÖF6†W2#âG¶6†×–öç6†—ÖF6†W2‡†6RÂF’’æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cà¢Â÷6V7F–öãà¢’æ¦ö–â‚""“°¢&WGW&âG·7FæF–æw7ÓÇ6V7F–öâ6Æ73Ò&6†×–öç6†—ÖÆö&'’×6V7F–öâ#ãÇ6Æ73Ò&6†×–öç6†—×6V7F–öâÖÆ&VÂ#ä6ÆVæG&–W"+rG·†6RÓÓÒò#W"F÷W""¢#&RF÷W"'ÓÂ÷ãÆF—b6Æ73Ò&6†×–öç6†—ÖF—2#âG¶F—7ÓÂöF—cãÂ÷6V7F–öãæ°§Ð ¦gVæ7F–öâ&VæFW$6†×–öç6†—Æö&'”f–æÂ†G&vâÂ6†×–öâ’°¢6öç7Bf–æÄÖF6†W2Ò6†×–öç6†—ÖF6†W2ƒB“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢&WGW&â ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ'&6¶WB6†×–öç6†—Öf–æÂÖ'&6¶WB#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#åV'G3Â÷7ãâG¶f–æÄÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&6†×÷b"’’æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äFVÖ’Öf–æÆW3Â÷7ãâG¶f–æÄÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&6†×÷6b"’’æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äf–æÆSÂ÷7ãâG·&VæFW$6†×–öç6†—Æö&'”ÖF6‚†f–æÂÂG&vâ—ÓÂöF—cà¢G·&VæFW%F÷W&æÖVçD6†×–öâ†6†×–öâÂf–æÂ—Ð¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ6†×–öç6†—Æö&'•¦öæR‡†6RÂÆ&VÂÂ6öçFVçB’°¢6öç7B÷VâÒçVÖ&W"„4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæR’ÓÓÒ†6S°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—×¦öæRG¶÷Vâò&÷Vâ"¢"'Ò#à¢Æ'WGFöâ6Æ73Ò&6†×–öç6†—×¦öæR×FövvÆR"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—ÖÆö&'’×¦öæSÒ"G·†6WÒ"&–ÖW‡æFVCÒ"G¶÷VçÒ#à¢Ç7ãå¦öæRG·†6WÓÂ÷7ããÇ7G&öæsâG¶Æ&VÇÓÂ÷7G&öæsãÇ7â&–Ö†–FFVãÒ'G'VR#âG¶÷Vâò.(‰""¢"²'ÓÂ÷7ãà¢Âö'WGFöãà¢ÆF—b6Æ73Ò&6†×–öç6†—×¦öæRÖ6öçFVçBG¶÷Vâò""¢&†–FFVâ'Ò#âG¶6öçFVçGÓÂöF—cà¢Â÷6V7F–öãà¢°§Ð ¦gVæ7F–öâ6†×–öç6†—æW‡EVæF–æt&F6‚‚’°¢&WGW&â7FFRçF÷W&æÖVçBæÖF6†W2æf–æB‚†ÖF6‚’ÓâÖF6‚çv–ææW"bbÖF6‚çÆ–W$bbÖF6‚çÆ–W$"’ÇÂçVÆÃ°§Ð ¦gVæ7F–öâ&VæFW$öæUö–çDÖ7FW$Æö&'’‚’°¢6öç7BG&vâÒ6†×–öç6†—G&väVçG'•6WB‚“°¢6öç7B6ö×ÆWFRÒ7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6ö×ÆWFR#°¢6öç7BVæF–ærÒ6†×–öç6†—æW‡EVæF–æt&F6‚‚“°¢6öç7BVæF–æt&F6‚ÒVæF–ærò6†×–öç6†—ÖF6†W2‡VæF–æræ6†×–öç6†—†6RÂVæF–æræF’’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚çv–ææW"’¢µÓ°¢6öç7B‡VÖä–ä&F6‚ÒVæF–æt&F6‚ç6öÖR‚†ÖF6‚’Óâ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$’ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"’“°¢6öç7Bf–æÄG&uVæF–ærÒ&ööÆVâ‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&sòæÆVæwF€¢bbçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÇÂ’Â7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&ræÆVæwF‚“°¢6öç7Bw&÷W6öçFVçBÒ ¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—ÖÆö&'’×6V7F–öâ#à¢Ç6Æ73Ò&6†×–öç6†—×6V7F–öâÖÆ&VÂ#ä6Æ76VÖVçB+rW"VÆ–fœ:’Â&RWB6RVâ&'&vW3Â÷à¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Öw&–B6†×–öç6†—Öw&÷W2#âG´ôäUõô”åEôÔ5DU%ôu$õU2æÖ‚†w&÷W’Óâ°¢6öç7BF‡&÷Vv„F’Ò6†×–öç6†—6ö×ÆWFVDF’ƒ“°¢6öç7B&÷w2ÒöæUö–çDÖ7FW%7FæF–æw2†w&÷WÂF‡&÷Vv„F’“°¢&WGW&âÇ6V7F–öâ6Æ73Ò&ÆVwVR×7FæF–æw26†×–öç6†—×7FæF–æw2öæR×ö–çBÖÖ7FW"×7FæF–æw2#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#äw&÷WRG¶w&÷WÓÂ÷7ãà¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Ö†VB#ãÇ7ãå&æsÂ÷7ããÇ7ãäæöÓÂ÷7ããÇ7ãåö–çG3Â÷7ããÇ7ãäF–fl:—&Væ6SÂ÷7ããÇ7ãä&ö÷7CÂ÷7ããÇ7ãã"ÓÂ÷7ããÂöF—cà¢G·&÷w2æÖ‚‡&÷rÂ–æFW‚’Óâ°¢6öç7Bf—6–&ÆRÒG&vâæ†2‡&÷ræVçG'’“°¢6öç7B6VVBÒ7FFRçF÷W&æÖVçBçF÷W&æÖVçE6VVDçVÖ&W'3òå·&÷ræVçG'•Ó°¢&WGW&âÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2×&÷rG¶–æFW‚Â2bbF‡&÷Vv„F’ãÒRò'VÆ–f–VB"¢"'ÒG·f—6–&ÆRbb—4‡VÖåF÷W&æÖVçDVçG'’‡&÷ræVçG'’’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7G&öæsâG¶–æFW‚²ÓÂ÷7G&öæsãÇ7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG·f—6–&ÆRòG¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ‡&÷ræVçG'’’—ÒG·6VVBòÆ#â‚G·6VVGÒ“Âö#æ¢"'Ö¢.(	B'ÓÂ÷7ãà¢Ç7G&öæsâG·f—6–&ÆRò&÷rçö–çG2¢ÓÂ÷7G&öæsãÇ7ãâG·f—6–&ÆRòf÷&ÖDÆVwVTF–ffW&Væ6R‡&÷ræF–ffW&Væ6R’¢#'ÓÂ÷7ããÇ7ãâG·f—6–&ÆRò&÷ræ&ö÷7B¢ÓÂ÷7ããÇ7ãâG·f—6–&ÆRò&÷rçGvõ¦W&ò¢ÓÂ÷7ãà¢ÂöF—cæ°¢Ò’æ¦ö–â‚""—Ð¢Â÷6V7F–öãæ°¢Ò’æ¦ö–â‚""—ÓÂöF—cà¢Â÷6V7F–öãà¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—ÖÆö&'’×6V7F–öâ#ãÇ6Æ73Ò&6†×–öç6†—×6V7F–öâÖÆ&VÂ#ä6ÆVæG&–W#Â÷à¢ÆF—b6Æ73Ò&6†×–öç6†—ÖF—2#âG´ôäUõô”åEôÔ5DU%õ44„TETÄRæÖ‚‡—'2Â–æFW‚’ÓâÇ6V7F–öâ6Æ73Ò&6†×–öç6†—ÖF’#à¢Æ†VFW#ãÇ7G&öæsä¦÷W&ì:–RG¶–æFW‚²ÓÂ÷7G&öæsãÇ7ãâG·—'2æÖ‚…¶Â%Ò’ÓâG´ôäUõô”åEôÔ5DU%õ4ÄõE5¶×Þ(	2G´ôäUõô”åEôÔ5DU%õ4ÄõE5¶%×Ö’æ¦ö–â‚"ò"—ÓÂ÷7ããÂö†VFW#à¢ÆF—b6Æ73Ò&6†×–öç6†—ÖF’ÖÖF6†W2#âG¶6†×–öç6†—ÖF6†W2ƒÂ–æFW‚²’æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cà¢Â÷6V7F–öãæ’æ¦ö–â‚""—ÓÂöF—cà¢Â÷6V7F–öãæ°¢6öç7Bf–æÅf—6–&ÆRÒæWr6WB‚‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&rÇÂµÒ’ç6Æ–6RƒÂçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÇÂ’’“°¢6öç7Bf–æÄÖF6†W2Ò6†×–öç6†—ÖF6†W2ƒB“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢6öç7Bf–æÄ6öçFVçBÒÆF—b6Æ73Ò'F÷W&æÖVçBÖ'&6¶WB6†×–öç6†—Öf–æÂÖ'&6¶WB#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#åV'G3Â÷7ãâG¶f–æÄÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&Ö7FW%÷b"’’æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚Âf–æÅf—6–&ÆR’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äFVÖ’Öf–æÆW3Â÷7ãâG¶f–æÄÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&Ö7FW%÷6b"’’æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äf–æÆSÂ÷7ãâG·&VæFW$6†×–öç6†—Æö&'”ÖF6‚†f–æÂÂG&vâ—ÓÂöF—cà¢G·&VæFW%F÷W&æÖVçD6†×–öâ‡7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÂf–æÂ—Ð¢ÂöF—cæ°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBæ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—×&7F–6ÂÖ–æfò#à¢ÆF—cãÇ7ãäf÷&ÖCÂ÷7ããÇ7G&öæsåVâö–çBL:–6—6–cÂ÷7G&öæsãÂöF—cãÆF—cãÇ7ãå'F–6—çG3Â÷7ããÇ7G&öæsã‡VÖ–â+r#2”Â÷7G&öæsãÂöF—cà¢ÆF—cãÇ7ãäw&÷WW3Â÷7ããÇ7G&öæsãBw&÷WW2FRcÂ÷7G&öæsãÂöF—cãÆF—cãÇ7ãäL:—'FvSÂ÷7ããÇ7G&öæsåö–çG2+rF–fl:—&Væ6R+r&ö÷7B+r"ÓÂ÷7G&öæsãÂöF—cà¢Â÷6V7F–öãà¢ÆF—b6Æ73Ò&6†×–öç6†—ÖÆö&'’Ö7F–öç2#à¢Æ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâ"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—ÖæW‡BG¶6ö×ÆWFRÇÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—‡VÖäVÆ–Ö–æFVBÇÂ4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ò&F—6&ÆVB"¢"'Óå$ô4„”âÔD4ƒÂö'WGFöãà¢G·7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRbbf–æÄG&uVæF–ærò""¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—ÖG&rG´4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ò&F—6&ÆVB"¢"'ÓåD•$tRR4õ%CÂö'WGFöãæÐ¢G·7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRbbVæF–æt&F6‚æÆVæwF‚bb‡VÖä–ä&F6‚òÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—×6–×VÆFRG´4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ò&F—6&ÆVB"¢"'Óå4”ÕTÄU"ÄU2ÔD4…3Âö'WGFöãæ¢"'Ð¢ÂöF—cà¢ÆF—b6Æ73Ò&6†×–öç6†—Ö&ö&B#à¢G¶6†×–öç6†—Æö&'•¦öæRƒÂ%†6RFRw&÷WW2"Âw&÷W6öçFVçB—Ð¢G¶6†×–öç6†—Æö&'•¦öæRƒ2Â$&'&vW2"ÂÆF—b6Æ73Ò&6†×–öç6†—×Æ–öfg2#âG¶6†×–öç6†—ÖF6†W2ƒ2’æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cæ—Ð¢G¶6†×–öç6†—Æö&'•¦öæRƒBÂ%F÷W"f–æÂ"Âf–æÄ6öçFVçB—Ð¢ÂöF—cæ°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷"‚%¶FFÖ6†×–öç6†—ÖæW‡EÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7F'D6†×–öç6†—æW‡Dg&öÔÆö&'’“°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷"‚%¶FFÖ6†×–öç6†—ÖG&uÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ7F'D6†×–öç6†—G&r‡G'VR’“°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷"‚%¶FFÖ6†×–öç6†—×6–×VÆFUÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6–×VÆFT6†×–öç6†—&F6„æ–ÖFVB“°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ6†×–öç6†—ÖÆö&'’×¦öæUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B†6RÒçVÖ&W"†'WGFöâæFF6WBæ6†×–öç6†—Æö&'•¦öæR“°¢4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæRÒ4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæRÓÓÒ†6Rò¢†6S°¢&VæFW$6†×–öç6†—Æö&'’‚“°¢Ò’“°¢VÇ2æ6†×–öç6†—Æö&'•67&VVâçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖW†—BÖ6†×–öç6†—Ò"’æf÷$V6‚‚†'WGFöâ’Óâ²'WGFöâæöæ6Æ–6²ÒW†—EF÷W&æÖVçEFôÆö&'“²Ò“°§Ð ¦gVæ7F–öâ&VæFW$6†×–öç6†—Æö&'’‚’°¢–b‚VÇ2æ6†×–öç6†—Æö&'”6öçFVçBÇÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—’&WGW&ã°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’°¢&VæFW$öæUö–çDÖ7FW$Æö&'’‚“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRÓÒçVÆÂ’°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t÷&FW"Ò7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t÷&FW ¢ÇÂ°¢âââ$$4DTdt‚"ç7Æ—B‚""’æÖ‚†w&÷W’Óâ7FFRçF÷W&æÖVçBæ6†×–öç6†—†6Sw&÷W3òå¶w&÷WÓòå³Ò’æf–ÇFW"„&ööÆVâ’À¢âââ$$4DTdt‚"ç7Æ—B‚""’æÖ‚†w&÷W’Óâ7FFRçF÷W&æÖVçBæ6†×–öç6†—†6Sw&÷W3òå¶w&÷WÓòå³Ò’æf–ÇFW"„&ööÆVâ’À¢âââ$$4DTdt‚"ç7Æ—B‚""’æÖ‚†w&÷W’Óâ7FFRçF÷W&æÖVçBæ6†×–öç6†—†6Sw&÷W3òå¶w&÷WÓòå³%Ò’æf–ÇFW"„&ööÆVâ’À¢Ó°¢6ö×ÆWFT6†×–öç6†—G&r‚“°¢Ð¢7FFRçF÷W&æÖVçBæÖF6†W2æf÷$V6‚†Vç7W&UF÷W&æÖVçDÖF6„†5v–ææ–æu6WD6÷VçB“°¢6öç7BG&vâÒ6†×–öç6†—G&väVçG'•6WB‚“°¢6öç7BVæF–ærÒ6†×–öç6†—æW‡EVæF–æt&F6‚‚“°¢6öç7B6ö×ÆWFRÒ7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6ö×ÆWFR#°¢6öç7BÆö&'”7W'&VçE†6RÒçVÖ&W"‡VæF–æsòæ6†×–öç6†—†6RÇÂ†6ö×ÆWFRòB¢7FFRçF÷W&æÖVçBæ6†×–öç6†—†6R’ÇÂ“°¢–b„4„Õ”ôå4„•ôÄô$%•õT’æ7W'&VçE†6RÓÒÆö&'”7W'&VçE†6R’°¢4„Õ”ôå4„•ôÄô$%•õT’æ7W'&VçE†6RÒÆö&'”7W'&VçE†6S°¢4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæRÒÆö&'”7W'&VçE†6S°¢Ð¢6öç7BVæF–æt&F6‚ÒVæF–ærò6†×–öç6†—ÖF6†W2‡VæF–æræ6†×–öç6†—†6RÂVæF–æræF’’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚çv–ææW"’¢µÓ°¢6öç7B‡VÖä–ä&F6‚ÒVæF–æt&F6‚ç6öÖR‚†ÖF6‚’Óâ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$’ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"’“°¢6öç7B6†×–öâÒ7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–C°¢6öç7B6†×–öä–BÒ6†×–öâòF÷W&æÖVçDVçG'”6†&7FW$–B†6†×–öâ’¢çVÆÃ°¢6öç7B6†×–öä–ÖvRÒ6†×–öä–Bò„ÔD4…õ$U5TÅEô”ÔtU5¶6†×–öä–EÓòçv–âÇÂ$ôd”ÄUô4„$5DU%ô”ÔtU5¶6†×–öä–EÒ’¢çVÆÃ°¢6öç7Bf–æÄG&uVæF–ærÒ&ööÆVâ€¢7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&sòæÆVæwF€¢bbçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÇÂ’Â7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&ræÆVæwF€¢“°¢6öç7BgWGW&T6öçFVçBÒ‡†6R’Óâ°¢6öç7BÖF6†W2Ò6†×–öç6†—ÖF6†W2‡†6R“°¢–b‚ÖF6†W2ç6öÖR‚†ÖF6‚’ÓâÖF6‚çÆ–W$bbÖF6‚çÆ–W$"’’&WGW&âsÇ6Æ73Ò&6†×–öç6†—ÖV×G’×&÷VæB#äÆRF&ÆVR6R&V×Æ—&Rf–ÂFW2VÆ–f–6F–öç2ãÂ÷âs°¢–b‡†6RÓÓÒ"’&WGW&â&VæFW$6†×–öç6†—Æö&'”w&÷W†6Rƒ"ÂG&vâ“°¢–b‡†6RÓÓÒ2’&WGW&âÆF—b6Æ73Ò&6†×–öç6†—×Æ–öfg2#âG¶ÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW$6†×–öç6†—Æö&'”ÖF6‚†ÖF6‚ÂG&vâ’’æ¦ö–â‚""—ÓÂöF—cæ°¢6öç7Bf–æÅf—6–&ÆTVçG&–W2ÒæWr6WB‚‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&rÇÂµÒ’ç6Æ–6RƒÂçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÇÂ’’“°¢6öç7Bf—6–&ÆTf–æÄG&rÒ7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&sòæÆVæwF‚òf–æÅf—6–&ÆTVçG&–W2¢G&vã°¢&WGW&â&VæFW$6†×–öç6†—Æö&'”f–æÂ‡f—6–&ÆTf–æÄG&rÂ6†×–öâ“°¢Ó°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBæ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—×&7F–6ÂÖ–æfò#à¢ÆF—cãÇ7ãäf÷&ÖCÂ÷7ããÇ7G&öæsâG´çVÖ&W"‡7FFRçF÷W&æÖVçBçF&vWE6WG2ÇÂ"—Ò6WG2vvæçG3Â÷7G&öæsãÂöF—cà¢ÆF—cãÇ7ãå'F–6—çG3Â÷7ããÇ7G&öæsã‡VÖ–â+r#2”Â÷7G&öæsãÂöF—cà¢ÆF—cãÇ7ãäæ—fVR”Â÷7ããÇ7G&öæsâG·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’—ÓÂ÷7G&öæsãÂöF—cà¢ÆF—cãÇ7ãå&öw&W76–öãÂ÷7ããÇ7G&öæsåF÷W"G¶Æö&'”7W'&VçE†6WÒ7W"CÂ÷7G&öæsãÂöF—cà¢Â÷6V7F–öãà¢ÆF—b6Æ73Ò&6†×–öç6†—ÖÆö&'’Ö7F–öç2#à¢Æ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâ"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—ÖæW‡BG¶6ö×ÆWFRÇÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—‡VÖäVÆ–Ö–æFVBÇÂ4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ò&F—6&ÆVB"¢"'Óå$ô4„”âÔD4ƒÂö'WGFöãà¢G·7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRbbf–æÄG&uVæF–ærò""¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—ÖG&rG´4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ò&F—6&ÆVB"¢"'ÓåD•$tRR4õ%CÂö'WGFöãæÐ¢G·7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRbbVæF–æt&F6‚æÆVæwF‚bb‡VÖä–ä&F6‚òÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6†×–öç6†—×6–×VÆFRG´4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ò&F—6&ÆVB"¢"'Óå4”ÕTÄU"ÄU2ÔD4…3Âö'WGFöãæ¢"'Ð¢ÂöF—cà¢G´4„Õ”ôå4„•ôÄô$%•õT’æ'W7’òsÆF—b6Æ73Ò&6†×–öç6†—ÖÆö&'’×&öw&W72"&öÆSÒ'7FGW2#äÖ—6R:¦÷W"GRF&ÆVRVâ6÷W'>(
cÂöF—câr¢"'Ð¢G¶6ö×ÆWFRòÇ6V7F–öâ6Æ73Ò&6†×–öç6†—×v–ææW"Ö6&B#âG¶6†×–öä–ÖvRòÆ–Ör7&3Ò"G¶W66T‡FÖÂ†6†×–öä–ÖvR—Ò"ÇCÒ"G¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ†6†×–öâ’—Ò"óæ¢"'ÓÇ7ãåf–çVWW"GR6†×–öææCÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ†6†×–öâ’—ÓÂ÷7G&öæsãÂ÷6V7F–öãæ¢"'Ð¢ÆF—b6Æ73Ò&6†×–öç6†—Ö&ö&B#à¢G¶6†×–öç6†—Æö&'•¦öæRƒÂ#W"F÷W"+rw&÷WW2:‚"Â&VæFW$6†×–öç6†—Æö&'”w&÷W†6RƒÂG&vâ’—Ð¢G¶6†×–öç6†—Æö&'•¦öæRƒ"Â#&RF÷W"+rw&÷WW2:B"ÂgWGW&T6öçFVçBƒ"’—Ð¢G¶6†×–öç6†—Æö&'•¦öæRƒ2Â#6RF÷W"+r&'&vW2"ÂgWGW&T6öçFVçBƒ2’—Ð¢G¶6†×–öç6†—Æö&'•¦öæRƒBÂ%F÷W"f–æÂ"ÂgWGW&T6öçFVçBƒB’—Ð¢ÂöF—cà¢°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷"‚%¶FFÖ6†×–öç6†—ÖæW‡EÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7F'D6†×–öç6†—æW‡Dg&öÔÆö&'’“°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷"‚%¶FFÖ6†×–öç6†—ÖG&uÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ7F'D6†×–öç6†—G&r‡G'VR’“°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷"‚%¶FFÖ6†×–öç6†—×6–×VÆFUÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6–×VÆFT6†×–öç6†—&F6„æ–ÖFVB“°¢VÇ2æ6†×–öç6†—Æö&'”6öçFVçBçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ6†×–öç6†—ÖÆö&'’×¦öæUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B†6RÒçVÖ&W"†'WGFöâæFF6WBæ6†×–öç6†—Æö&'•¦öæR“°¢4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæRÒ4„Õ”ôå4„•ôÄô$%•õT’æ÷Vå¦öæRÓÓÒ†6Rò¢†6S°¢&VæFW$6†×–öç6†—Æö&'’‚“°¢Ò’“°¢VÇ2æ6†×–öç6†—Æö&'•67&VVâçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖW†—BÖ6†×–öç6†—Ò"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæöæ6Æ–6²ÒW†—EF÷W&æÖVçEFôÆö&'“°¢Ò“°§Ð ¦gVæ7F–öâ6ö×ÆWFT6†×–öç6†—G&r‚’°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—G&uf—6–&ÆT6÷VçBÒ7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t÷&FW"æÆVæwFƒ°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRÒG'VS°§Ð ¦gVæ7F–öâ7F'D6†×–öç6†—G&r†æ–ÖFVBÒG'VR’°¢–b„4„Õ”ôå4„•ôÄô$%•õT’æ'W7’’&WGW&ã°¢6öç7Bf–æÄG&rÒ7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRbb7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&sòæÆVæwF€¢ò7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&p¢¢çVÆÃ°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFRbbf–æÄG&r’&WGW&ã°¢–b†f–æÄG&rbbçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÇÂ’ãÒf–æÄG&ræÆVæwF‚’&WGW&ã°¢v–æF÷ræ6ÆV$–çFW'fÂ„4„Õ”ôå4„•ôÄô$%•õT’çF–ÖW"“°¢–b‚æ–ÖFVB’°¢–b†f–æÄG&r’7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÒf–æÄG&ræÆVæwFƒ°¢VÇ6R6ö×ÆWFT6†×–öç6†—G&r‚“°¢&VæFW$6†×–öç6†—Æö&'’‚“°¢&WGW&ã°¢Ð¢4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ÒG'VS°¢&VæFW$6†×–öç6†—Æö&'’‚“°¢4„Õ”ôå4„•ôÄô$%•õT’çF–ÖW"Òv–æF÷rç6WD–çFW'fÂ‚‚’Óâ°¢–b†f–æÄG&r’7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçB³Ò°¢VÇ6R7FFRçF÷W&æÖVçBæ6†×–öç6†—G&uf—6–&ÆT6÷VçB³Ò°¢6öç7BFöæRÒf–æÄG&p¢ò7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBãÒf–æÄG&ræÆVæwF€¢¢7FFRçF÷W&æÖVçBæ6†×–öç6†—G&uf—6–&ÆT6÷VçBãÒ7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t÷&FW"æÆVæwFƒ°¢–b†FöæR’°¢v–æF÷ræ6ÆV$–çFW'fÂ„4„Õ”ôå4„•ôÄô$%•õT’çF–ÖW"“°¢–b†f–æÄG&r’7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÒf–æÄG&ræÆVæwFƒ°¢VÇ6R6ö×ÆWFT6†×–öç6†—G&r‚“°¢4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ÒfÇ6S°¢Ð¢&VæFW$6†×–öç6†—Æö&'’‚“°¢ÒÂ“°§Ð ¦gVæ7F–öâ6–×VÆFT6†×–öç6†—&F6„æ–ÖFVB‚’°¢–b„4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ÇÂ7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFR’&WGW&ã°¢6öç7BVæF–ærÒ6†×–öç6†—æW‡EVæF–æt&F6‚‚“°¢–b‚VæF–ær’&WGW&ã°¢6öç7BÖF6†W2Ò6†×–öç6†—ÖF6†W2‡VæF–æræ6†×–öç6†—†6RÂVæF–æræF’’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚çv–ææW"“°¢–b†ÖF6†W2ç6öÖR‚†ÖF6‚’Óâ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$’ÇÂ—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"’’’&WGW&ã°¢4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ÒG'VS°¢ÆWB–æFW‚Ò°¢6öç7B6†÷tæW‡BÒ‚’Óâ°¢6öç7BÖF6‚ÒÖF6†W5¶–æFW…Ó°¢–b‚ÖF6‚’°¢4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ÒfÇ6S°¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b†f–æÃòçv–ææW"’°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÂçv–ææW#°¢Ð¢&VæFW$6†×–öç6†—Æö&'’‚“°¢&WGW&ã°¢Ð¢–b†Vç7W&U6–×VÆFVEF÷W&æÖVçDÖF6…&VG’†ÖF6‚’’°¢ÖF6‚ç&WfVÆVE6WE66÷&W2ÒÖF6‚æ†–FFVå6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢ÖF6‚ç66÷&RÒf÷&ÖE6WE66÷&W2†ÖF6‚ç&WfVÆVE6WE66÷&W2“°¢ÖF6‚çv–ææW"ÒÖF6‚æ†–FFVåv–ææW#°¢ÖF6‚æÆ—fU66÷&RÒçVÆÃ°¢&V6÷&DöæUö–çDÖF6„÷WF6öÖR†ÖF6‚“°¢Ð¢–æFW‚³Ò°¢&VæFW$6†×–öç6†—Æö&'’‚“°¢v–æF÷rç6WEF–ÖV÷WB‡6†÷tæW‡BÂ“°¢Ó°¢6†÷tæW‡B‚“°§Ð ¦gVæ7F–öâ7F'D6†×–öç6†—æW‡Dg&öÔÆö&'’‚’°¢–b„4„Õ”ôå4„•ôÄô$%•õT’æ'W7’ÇÂ7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6ö×ÆWFR"’&WGW&ã°¢–b‚7FFRçF÷W&æÖVçBæ6†×–öç6†—G&t6ö×ÆWFR’6ö×ÆWFT6†×–öç6†—G&r‚“°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&sòæÆVæwF‚’°¢7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&uf—6–&ÆT6÷VçBÒ7FFRçF÷W&æÖVçBæ6†×–öç6†—f–æÄG&ræÆVæwFƒ°¢Ð¢&W&T6†×–öç6†—‡VÖäÖF6‚‚“°¢–b‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚’°¢6†÷tvÖU67&VVâ‚“°¢&VæFW"‚“°¢ÒVÇ6R°¢&VæFW$6†×–öç6†—Æö&'’‚“°¢Ð§Ð ¦gVæ7F–öâ&VæFW$6†×–öç6†—æVÂ‡F—FÆRÂf–æÂÂ6†×–öâ’°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’°¢–b‡7FFRçF÷W&æÖVçBæg&–VæFÇ’’°¢6öç7B7FvRÒ7FFRçF÷W&æÖVçBç7FvS°¢6öç7B7W'&VçDÖF6†W2Ò‡7FFRçF÷W&æÖVçBæÖF6†W2ÇÂµÒ’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ7FvR“°¢6öç7Bw&÷WF’Òõæw&÷W…³ÓUÒ’BòæW†V2‡7FvR“°¢ÆWB7W'&VçEF—FÆRÒ%F÷W"f–æÂ#°¢ÆWB7W'&VçD6öçFVçBÒ"#°¢–b†w&÷WF’’°¢6öç7BF’ÒçVÖ&W"†w&÷WF•³Ò“°¢7W'&VçEF—FÆRÒ¦÷W&ì:–RG¶F—Ò+r†6RFRw&÷WW6°¢7W'&VçD6öçFVçBÒ ¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Öw&–B6†×–öç6†—Öw&÷W2#âGµ²$"Â$""Â$2"Â$B%ÒæÖ‚†w&÷WÂ–æFW‚’Óâ ¢Ç6V7F–öâ6Æ73Ò&ÆVwVR×7FæF–æw26†×–öç6†—×7FæF–æw2öæR×ö–çBÖÖ7FW"×7FæF–æw2#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#äw&÷WRG¶–æFW‚²ÓÂ÷7ãà¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Ö†VB#ãÇ7ãå&æsÂ÷7ããÇ7ãäæöÓÂ÷7ããÇ7ãåö–çG3Â÷7ããÇ7ãäF–fl:—&Væ6SÂ÷7ããÇ7ãä&ö÷7CÂ÷7ããÇ7ãã"ÓÂ÷7ããÂöF—cà¢G²‡7FFRçF÷W&æÖVçBæg&–VæFÇ•7FæF–æw3òå¶w&÷WÒÇÂµÒ’æÖ‚‡&÷r’ÓâÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2×&÷rG·&÷ræVçG'’ÓÓÒe$”TäDÅ•õDõU$äÔTåBæVçG'’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7G&öæsâG´çVÖ&W"‡&÷rç÷6—F–öâÇÂ—ÓÂ÷7G&öæsãÇ7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG¶W66T‡FÖÂ‡&÷rçÆ–W#òææ–6¶æÖRÇÂ$¦÷VWW""—ÒG·F÷W&æÖVçE6VVDçVÖ&W$Ö&·W‡&÷ræVçG'’—ÓÂ÷7ãà¢Ç7G&öæsâG´çVÖ&W"‡&÷rçö–çG2ÇÂ—ÓÂ÷7G&öæsãÇ7ãâG¶f÷&ÖDÆVwVTF–ffW&Væ6R„çVÖ&W"‡&÷ræF–ffW&Væ6RÇÂ’—ÓÂ÷7ããÇ7ãâG´çVÖ&W"‡&÷ræ&ö÷7BÇÂ—ÓÂ÷7ããÇ7ãâG´çVÖ&W"‡&÷rçGvõ¦W&òÇÂ—ÓÂ÷7ãà¢ÂöF—cæ’æ¦ö–â‚""—Ð¢Â÷6V7F–öãà¢’æ¦ö–â‚""—ÓÂöF—cæ°¢ÒVÇ6R–b‡7FvRÓÓÒ&&'&vR"’°¢7W'&VçEF—FÆRÒ$&'&vW2#°¢7W'&VçD6öçFVçBÒÆF—b6Æ73Ò&6†×–öç6†—×Æ–öfg2#âG¶7W'&VçDÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cæ°¢ÒVÇ6R°¢7W'&VçEF—FÆRÒ7FvRÓÓÒ'V'FW""ò%V'G2FRf–æÆR"¢7FvRÓÓÒ'6VÖ’"ò$FVÖ’Öf–æÆW2"¢$f–æÆR#°¢7W'&VçD6öçFVçBÒÆF—b6Æ73Ò'F÷W&æÖVçBÖ'&6¶WB6†×–öç6†—Öf–æÂÖ'&6¶WB#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#âG¶W66T‡FÖÂ†7W'&VçEF—FÆR—ÓÂ÷7ãâG¶7W'&VçDÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚Â7FvRÓÓÒ&f–æÂ"’’æ¦ö–â‚""—ÓÂöF—cà¢ÂöF—cæ°¢Ð¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"#ãÆF—cãÇ6Æ73Ò&W–V'&÷r#ä6ö×:—F—F–öâVâ6÷W'3Â÷ãÆƒ#âG¶W66T‡FÖÂ‡F—FÆR—ÓÂöƒ#ãÇ7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#âG¶W66T‡FÖÂ†7W'&VçEF—FÆR—ÓÂ÷7ããÂöF—cà¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâF÷W&æÖVçB×FövvÆRÖ'WGFöâ"G—SÒ&'WGFöâ"FF×FövvÆR×F÷W&æÖVçCâGµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò$Ö7VW"ÆRF÷W""¢$ff–6†W"ÆRF÷W"'ÓÂö'WGFöããÂöF—cà¢ÆF—b6Æ73Ò&6†×–öç6†—Ö&ö&BGµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò""¢&†–FFVâ'Ò#à¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—×¦öæR÷Vâ#à¢Æ'WGFöâ6Æ73Ò&6†×–öç6†—×¦öæR×FövvÆR"G—SÒ&'WGFöâ"FFÖ7W'&VçBÖÖ7FW"×¦öæR&–ÖW‡æFVCÒ'G'VR#ãÇ7ãåF÷W"7GVVÃÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†7W'&VçEF—FÆR—ÓÂ÷7G&öæsãÇ7â&–Ö†–FFVãÒ'G'VR#î(‰#Â÷7ããÂö'WGFöãà¢ÆF—b6Æ73Ò&6†×–öç6†—×¦öæRÖ6öçFVçB#âG¶7W'&VçD6öçFVçGÓÂöF—cà¢Â÷6V7F–öãà¢ÂöF—cæ°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×FövvÆR×F÷W&æÖVçEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFövvÆUF÷W&æÖVçEæVÂ“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FFÖ7W'&VçBÖÖ7FW"×¦öæUÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢6öç7B'WGFöâÒWfVçBæ7W'&VçEF&vWC°¢6öç7B¦öæRÒ'WGFöâæ6Æ÷6W7B‚"æ6†×–öç6†—×¦öæR"“°¢6öç7B6öçFVçBÒ¦öæSòçVW'•6VÆV7F÷"‚"æ6†×–öç6†—×¦öæRÖ6öçFVçB"“°¢6öç7B÷VâÒ'WGFöâævWDGG&–'WFR‚&&–ÖW‡æFVB"’ÓÒ'G'VR#°¢'WGFöâç6WDGG&–'WFR‚&&–ÖW‡æFVB"Â7G&–ær†÷Vâ’“°¢'WGFöâçVW'•6VÆV7F÷"‚'7ã¦Æ7BÖ6†–ÆB"’çFW‡D6öçFVçBÒ÷Vâò.(‰""¢"²#°¢¦öæSòæ6Æ74Æ—7BçFövvÆR‚&÷Vâ"Â÷Vâ“°¢6öçFVçCòæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â÷Vâ“°¢Ò“°¢&WGW&ã°¢Ð¢6öç7Bw&÷W2ÒÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Öw&–B6†×–öç6†—Öw&÷W2#âG´ôäUõô”åEôÔ5DU%ôu$õU2æÖ‚†w&÷W’Óâ&VæFW$6†×–öç6†—7FæF–æw2ƒÂw&÷W’’æ¦ö–â‚""—ÓÂöF—cæ°¢6öç7BÆ–öfg2ÒÆF—b6Æ73Ò&6†×–öç6†—×Æ–öfg2#âG¶6†×–öç6†—ÖF6†W2ƒ2’æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cæ°¢6öç7Bf–æÇ2ÒÆF—b6Æ73Ò'F÷W&æÖVçBÖ'&6¶WB6†×–öç6†—Öf–æÂÖ'&6¶WB#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#åV'G3Â÷7ãâG¶6†×–öç6†—ÖF6†W2ƒB’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&Ö7FW%÷b"’’æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äFVÖ’Öf–æÆW3Â÷7ãâG¶6†×–öç6†—ÖF6†W2ƒB’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&Ö7FW%÷6b"’’æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äf–æÆSÂ÷7ãâG·&VæFW%F÷W&æÖVçDÖF6‚†f–æÂÂG'VR—ÓÂöF—câG·&VæFW%F÷W&æÖVçD6†×–öâ†6†×–öâÂf–æÂ—Ð¢ÂöF—cæ°¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"#ãÆF—cãÇ6Æ73Ò&W–V'&÷r#ä6ö×:—F—F–öâVâ6÷W'3Â÷ãÆƒ#âG¶W66T‡FÖÂ‡F—FÆR—ÒG·&VæFW$‡VÖå&÷VæD&FvR‚—ÓÂöƒ#ãÇ7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#ã#B¦÷VWW'2+rVâö–çBL:–6—6–b+r”G·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’—ÓÂ÷7ããÂöF—cà¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâF÷W&æÖVçB×FövvÆRÖ'WGFöâ"G—SÒ&'WGFöâ"FF×FövvÆR×F÷W&æÖVçCâGµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò$Ö7VW"ÆRF&ÆVR"¢$ff–6†W"ÆRF&ÆVR'ÓÂö'WGFöããÂöF—cà¢ÆF—b6Æ73Ò&6†×–öç6†—Ö&ö&BGµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò""¢&†–FFVâ'Ò#âG¶6†×–öç6†—¦öæTÖ&·WƒÂ%†6RFRw&÷WW2"Âw&÷W2—ÒG¶6†×–öç6†—¦öæTÖ&·Wƒ2Â$&'&vW2"ÂÆ–öfg2—ÒG¶6†×–öç6†—¦öæTÖ&·WƒBÂ%F÷W"f–æÂ"Âf–æÇ2—ÓÂöF—cæ°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×FövvÆR×F÷W&æÖVçEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFövvÆUF÷W&æÖVçEæVÂ“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ6†×–öç6†—×¦öæUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢DõU$äÔTåEõäTÅõT’æ6†×–öç6†—÷Vå¦öæRÒçVÖ&W"†'WGFöâæFF6WBæ6†×–öç6†—¦öæR“°¢&VæFW"‚“°¢Ò’“°¢&WGW&ã°¢Ð¢7FFRçF÷W&æÖVçBæÖF6†W2æf÷$V6‚†Vç7W&UF÷W&æÖVçDÖF6„†5v–ææ–æu6WD6÷VçB“°¢6öç7B†6Sw&÷W2Ò$$4DTdt‚"ç7Æ—B‚""“°¢6öç7B†6S$w&÷W2Ò²#"Â#""Â#2"Â#B%Ó°¢6öç7BF—2Ò‡†6R’Óâ³Â"Â5ÒæÖ‚†F’’Óâ°¢6öç7BÖF6†W2Ò6†×–öç6†—ÖF6†W2‡†6RÂF’“°¢6öç7BFW67&—F–öâÒ†6RÓÓÒ¢òF’ÓÓÒò$6öçG&R2"¢F’ÓÓÒ"ò$"6öçG&R2"¢$6öçG&R" ¢¢F’ÓÓÒò$(	4"WB>(	4B"¢F’ÓÓÒ"ò$(	4BWB>(	4""¢$(	42WB.(	4B#°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&6†×–öç6†—ÖF’#à¢Æ†VFW#ãÇ7G&öæsä¦÷W&ì:–RG¶F—ÓÂ÷7G&öæsãÇ7ãâG¶FW67&—F–öçÒ+rG¶ÖF6†W2æÆVæwF‡ÒÖF6‡3Â÷7ããÂö†VFW#à¢ÆF—b6Æ73Ò&6†×–öç6†—ÖF’ÖÖF6†W2#âG¶ÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cà¢Â÷6V7F–öãà¢°¢Ò’æ¦ö–â‚""“°¢6öç7B†6SÒ ¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Öw&–B6†×–öç6†—Öw&÷W2#âG·†6Sw&÷W2æÖ‚†w&÷W’Óâ&VæFW$6†×–öç6†—7FæF–æw2ƒÂw&÷W’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò&6†×–öç6†—ÖF—2#âG¶F—2ƒ—ÓÂöF—cà¢°¢6öç7B†6S"Ò ¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Öw&–B6†×–öç6†—Öw&÷W2#âG·†6S$w&÷W2æÖ‚†w&÷W’Óâ&VæFW$6†×–öç6†—7FæF–æw2ƒ"Âw&÷W’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò&6†×–öç6†—ÖF—2#âG¶F—2ƒ"—ÓÂöF—cà¢°¢6öç7B†6S2ÒÆF—b6Æ73Ò&6†×–öç6†—×Æ–öfg2#âG¶6†×–öç6†—ÖF6†W2ƒ2’æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cæ°¢6öç7Bf–æÄÖF6†W2Ò6†×–öç6†—ÖF6†W2ƒB“°¢6öç7B†6SBÒ ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ'&6¶WB6†×–öç6†—Öf–æÂÖ'&6¶WB#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#åV'G3Â÷7ãâG¶f–æÄÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&6†×÷b"’’æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äFVÖ’Öf–æÆW3Â÷7ãâG¶f–æÄÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æ–Bç7F'G5v—F‚‚&6†×÷6b"’’æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—ÓÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#ãÇ7â6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äf–æÆSÂ÷7ãâG·&VæFW%F÷W&æÖVçDÖF6‚†f–æÂÂG'VR—ÓÂöF—cà¢G·&VæFW%F÷W&æÖVçD6†×–öâ†6†×–öâÂf–æÂ—Ð¢ÂöF—cà¢°¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒ ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"Ö6÷’#à¢Ç6Æ73Ò&W–V'&÷r#ä6ö×:—F—F–öâVâ6÷W'3Â÷à¢Æƒ#âG¶W66T‡FÖÂ‡F—FÆR—ÒG·&VæFW$‡VÖå&÷VæD&FvR‚—ÓÂöƒ#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖÖWF×&÷r#à¢Ç7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#ã#B¦÷VWW'2+rG´çVÖ&W"‡7FFRçF÷W&æÖVçBçF&vWE6WG2ÇÂ"—Ò6WG2vvæçG2+r”G·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’—ÓÂ÷7ãà¢Ç7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#åF÷W"G´çVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÇÂ—Ò7W"CÂ÷7ãà¢ÂöF—cà¢ÂöF—cà¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâF÷W&æÖVçB×FövvÆRÖ'WGFöâ"G—SÒ&'WGFöâ"FF×FövvÆR×F÷W&æÖVçCà¢GµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò$Ö7VW"ÆRF&ÆVR"¢$ff–6†W"ÆRF&ÆVR'Ð¢Âö'WGFöãà¢ÂöF—cà¢ÆF—b6Æ73Ò&6†×–öç6†—Ö&ö&BGµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò""¢&†–FFVâ'Ò#à¢G¶6†×–öç6†—¦öæTÖ&·WƒÂ#W"F÷W"+rw&÷WW2:‚"Â†6S—Ð¢G¶6†×–öç6†—¦öæTÖ&·Wƒ"Â#&RF÷W"+rw&÷WW2:B"Â†6S"—Ð¢G¶6†×–öç6†—¦öæTÖ&·Wƒ2Â#6RF÷W"+r&'&vW2"Â†6S2—Ð¢G¶6†×–öç6†—¦öæTÖ&·WƒBÂ%F÷W"f–æÂ"Â†6SB—Ð¢ÂöF—cà¢°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×FövvÆR×F÷W&æÖVçEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFövvÆUF÷W&æÖVçEæVÂ“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ6†×–öç6†—×¦öæUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢DõU$äÔTåEõäTÅõT’æ6†×–öç6†—÷Vå¦öæRÒçVÖ&W"†'WGFöâæFF6WBæ6†×–öç6†—¦öæR“°¢&VæFW"‚“°¢Ò“°¢Ò“°§Ð ¦gVæ7F–öâ&VæFW$g&–VæFÇ•F÷W&æÖVçE7FGW2‚’°¢–b‚7FFRçF÷W&æÖVçCòæg&–VæFÇ’’&WGW&â"#°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6ö×ÆWFR"’°¢&WGW&âÆF—b6Æ73Ò&g&–VæFÇ’×7FGW2Ö&ææW"#åF÷W&æö’FW&Ö–ì:’+rf–çVWW"¢G¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ‡7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–B’—ÓÂöF—cæ°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚’°¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B‡7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚“°¢&WGW&âÆF—b6Æ73Ò&g&–VæFÇ’×7FGW2Ö&ææW"#äÖF6‚Vâ6÷W'2+rG¶W66T‡FÖÂ†ÖF6ƒòæÆ&VÂÇÂ%F÷W""—ÓÂöF—cæ°¢Ð¢–b„e$”TäDÅ•õDõU$äÔTåBçv—F–ætf÷$æW‡E&÷VæB’°¢&WGW&â&VæFW$g&–VæFÇ•v—F–ætW‡W&–Væ6R‚“°¢Ð¢–b‡7FFRævÖT÷fW"bb7FFRç6WDÖF6‚æÖF6„÷fW"bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”æW‡B"’°¢&WGW&âsÆF—b6Æ73Ò&g&–VæFÇ’×7FGW2Ö&ææW"#äÖF6‚FW&Ö–ì:’â&WF÷W"R4ÅT"„õU4RVâGFVçFRGRF÷W"7V—fçBãÂöF—câs°¢Ð¢&WGW&â&VæFW$g&–VæFÇ•v—F–ætW‡W&–Væ6R‚’ÇÂsÆF—b6Æ73Ò&g&–VæFÇ’×7FGW2Ö&ææW"#äVâGFVçFRFRÆf–âFW2ÖF6‡2GRF÷W"ãÂöF—câs°§Ð ¦gVæ7F–öâ&VæFW$g&–VæFÇ•F÷W&æÖVçEv—F–æuæVÂ‡F—FÆR’°¢6öç7B'F–6—çG2Ò7FFRçF÷W&æÖVçBæg&–VæFÇ•'F–6—çG2ÇÂµÓ°¢6öç7B6å7F'BÒe$”TäDÅ•õDõU$äÔTåBæ—47&VF÷"bb'F–6—çG2æÆVæwF‚ãÒ#°¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒ ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"#à¢ÆF—cà¢Ç6Æ73Ò&W–V'&÷r#ä4ÅT"„õU4SÂ÷à¢Æƒ#âG¶W66T‡FÖÂ‡F—FÆR—ÓÂöƒ#à¢Ç7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#âG·'F–6—çG2æÆVæwF‡ÒóB'F–6—çG2+r6Æ76–2"6WG2+rF&ÆVR:ƒÂ÷7ãà¢ÂöF—cà¢G¶6å7F'BòsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâF÷W&æÖVçB×FövvÆRÖ'WGFöâ"G—SÒ&'WGFöâ"FF×7F'BÖg&–VæFÇ’×F÷W&æÖVçCäÆæ6W#Âö'WGFöãâr¢"'Ð¢ÂöF—cà¢ÆF—b6Æ73Ò&Æö&'’×&öö×2#à¢G·'F–6—çG2æÖ‚‡'F–6—çB’Óâ ¢Æ'F–6ÆR6Æ73Ò&Æö&'’×&ööÒ#à¢ÆF—cà¢Ç7G&öæsâG¶W66T‡FÖÂ‡'F–6—çBææ–6¶æÖRÇÂ$¦÷VWW""—ÒG·'F–6—çBæ—47&VF÷"ò"+r7,:–FWW""¢"'ÓÂ÷7G&öæsà¢Ç7ãâG¶W66T‡FÖÂ†6†&7FW$æÖTg&öÔ–B‡'F–6—çBæ6†&7FW$–B’—ÓÂ÷7ãà¢ÂöF—cà¢Ç7ãâG·'F–6—çBæVÆ–Ö–æFVBò,8–Æ–Ö–ì:’"¢$VâGFVçFR'ÓÂ÷7ãà¢Âö'F–6ÆSà¢’æ¦ö–â‚""—Ð¢ÂöF—cà¢°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×7F'BÖg&–VæFÇ’×F÷W&æÖVçEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7F'Dg&–VæFÇ•F÷W&æÖVçDg&öÔÆö&'’“°§Ð ¦gVæ7F–öâ&VæFW$ÆVwVUF÷W&æÖVçEæVÂ‡F—FÆRÂf–æÂÂ6†×–öâ’°¢6öç7B6ö×ÆWFVDF—2ÒÆVwVT6ö×ÆWFVDw&÷WF—2‚“°¢6öç7BF”6öÇVÖâÒ†F’’Óâ°¢6öç7BÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚æF’ÓÓÒF’“°¢&WGW&â ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâÆVwVRÖF’Ö6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#ä¦÷W&ì:–RG¶F—ÓÂ÷7ãà¢G¶ÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—Ð¢ÂöF—cà¢°¢Ó°¢6öç7B6VÖ”ÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ'6VÖ’"“°¢6öç7Bg&–VæFÇ•7FGW2Ò7FFRçF÷W&æÖVçBæg&–VæFÇ’ò&VæFW$g&–VæFÇ•F÷W&æÖVçE7FGW2‚’¢"#°¢VÇ2çF÷W&æÖVçEæVÂæ–ææW$…DÔÂÒ ¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ†VFW"Ö6÷’#à¢Ç6Æ73Ò&W–V'&÷r#ä6ö×:—F—F–öâVâ6÷W'3Â÷à¢Æƒ#âG·F—FÆWÒG·&VæFW$‡VÖå&÷VæD&FvR‚—ÓÂöƒ#à¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖÖWF×&÷r#ãÇ7â6Æ73Ò&F–ff–7VÇG’×&VÖ–æFW"#äÄTuTR+rG´çVÖ&W"‡7FFRçF÷W&æÖVçBçF&vWE6WG2ÇÂ"—Ò6WG2vvæçG2+r"w&÷WW2FRBG·7FFRçF÷W&æÖVçBæ”6ÇV$†÷W6Rò+r”G·F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’—Ò+rG·F÷W&æÖVçD&öçW57VÖÖ'’‚—Ö¢"'ÓÂ÷7ããÂöF—cà¢ÂöF—cà¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâF÷W&æÖVçB×FövvÆRÖ'WGFöâ"G—SÒ&'WGFöâ"FF×FövvÆR×F÷W&æÖVçCà¢GµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò$Ö7VW"ÆRF&ÆVR"¢$ff–6†W"ÆRF&ÆVR'Ð¢Âö'WGFöãà¢ÂöF—cà¢G¶g&–VæFÇ•7FGW7Ð¢ÆF—b6Æ73Ò&ÆVwVRÖ&ö&BGµDõU$äÔTåEõäTÅõT’çf—6–&ÆRò""¢&†–FFVâ'Ò#à¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Öw&–B#à¢G·&VæFW$ÆVwVU7FæF–æw5F&ÆR‚$"Â6ö×ÆWFVDF—2—Ð¢G·&VæFW$ÆVwVU7FæF–æw5F&ÆR‚$""Â6ö×ÆWFVDF—2—Ð¢ÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ'&6¶WBÆVwVRÖ'&6¶WB#à¢G¶F”6öÇVÖâƒ—Ð¢G¶F”6öÇVÖâƒ"—Ð¢G¶F”6öÇVÖâƒ2—Ð¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äFVÖ–W3Â÷7ãà¢G·6VÖ”ÖF6†W2æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚’’æ¦ö–â‚""—Ð¢ÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçBÖ6öÇVÖâ#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂF÷W&æÖVçBÖ6öÇVÖâ×F—FÆR#äf–æÆSÂ÷7ãà¢G·&VæFW%F÷W&æÖVçDÖF6‚†f–æÂÂG'VR—Ð¢ÂöF—cà¢G·&VæFW%F÷W&æÖVçD6†×–öâ†6†×–öâÂf–æÂ—Ð¢ÂöF—cà¢ÂöF—cà¢°¢VÇ2çF÷W&æÖVçEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢VÇ2çF÷W&æÖVçEæVÂçVW'•6VÆV7F÷"‚%¶FF×FövvÆR×F÷W&æÖVçEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFövvÆUF÷W&æÖVçEæVÂ“°§Ð ¦gVæ7F–öâf÷&ÖDÆVwVTF–ffW&Væ6R‡fÇVR’°¢6öç7BçVÖ&W"ÒçVÖ&W"‡fÇVRÇÂ“°¢&WGW&âçVÖ&W"âò²G¶çVÖ&W'Ö¢7G&–ær†çVÖ&W"“°§Ð ¦gVæ7F–öâ&VæFW$ÆVwVU7FæF–æw5F&ÆR†w&÷WÂF‡&÷Vv„F’Ò’°¢6öç7B&÷w2ÒÆVwVU7FæF–æw2†w&÷WÂF‡&÷Vv„F’“°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&ÆVwVR×7FæF–æw2#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#äw&÷WRG¶w&÷WÓÂ÷7ãà¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2Ö†VB#à¢Ç7ãå&æsÂ÷7ããÇ7ãäæöÓÂ÷7ããÇ7ãåö–çG3Â÷7ããÇ7ãäF–fbâ6WG3Â÷7ããÇ7ãäF–fbâ¦WWƒÂ÷7ãà¢ÂöF—cà¢G·&÷w2æÖ‚‡&÷rÂ–æFW‚’Óâ ¢ÆF—b6Æ73Ò&ÆVwVR×7FæF–æw2×&÷rG¶–æFW‚Â"bbF‡&÷Vv„F’ãÒ2ò'VÆ–f–VB"¢"'ÒG¶—4‡VÖåF÷W&æÖVçDVçG'’‡&÷ræVçG'’’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7G&öær6Æ73Ò&ÆVwVR×&æ²#âG¶–æFW‚²ÓÂ÷7G&öæsà¢Ç7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG·F÷W&æÖVçEÆ–W$Æ&VÂ‡&÷ræVçG'’—ÒG¶”–çFVÆÆ–vVæ6T&FvTÖ&·W‡&÷ræVçG'’—ÓÂ÷7ãà¢Ç7G&öæsâG·&÷rçö–çG7ÓÂ÷7G&öæsà¢Ç7ãâG¶f÷&ÖDÆVwVTF–ffW&Væ6R‡&÷rç6WDF–ffW&Væ6R—ÓÂ÷7ãà¢Ç7ãâG¶f÷&ÖDÆVwVTF–ffW&Væ6R‡&÷rævÖTF–ffW&Væ6R—ÓÂ÷7ãà¢ÂöF—cà¢’æ¦ö–â‚""—Ð¢Â÷6V7F–öãà¢°§Ð ¦gVæ7F–öâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚Â—4f–æÂÒfÇ6R’°¢–b‚ÖF6‚’&WGW&â"#°¢6öç7BÆ–W$ÒÖF6‚çÆ–W$òF÷W&æÖVçEÆ–W$Æ&VÂ†ÖF6‚çÆ–W$’¢"#°¢6öç7BÆ–W$"ÒÖF6‚çÆ–W$"òF÷W&æÖVçEÆ–W$Æ&VÂ†ÖF6‚çÆ–W$"’¢"#°¢6öç7B66÷&UFW‡BÒÖF6‚æÆ—fU66÷&RÇÂÖF6‚ç66÷&RÇÂ"#°¢6öç7B&WfVÆVEv–ææW"ÒÖF6‚ç66÷&RbbÖF6‚çv–ææW"òÖF6‚çv–ææW"¢çVÆÃ°¢6öç7BÆ–W$vöâÒ&ööÆVâ‡&WfVÆVEv–ææW"bb&WfVÆVEv–ææW"ÓÓÒÖF6‚çÆ–W$“°¢6öç7BÆ–W$%vöâÒ&ööÆVâ‡&WfVÆVEv–ææW"bb&WfVÆVEv–ææW"ÓÓÒÖF6‚çÆ–W$"“°¢6öç7Bv–ææW%6–FRÒÆ–W$vöâò&ÆVgB"¢Æ–W$%vöâò'&–v‡B"¢çVÆÃ°¢6öç7B—47W'&VçBÒ7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÓÓÒÖF6‚æ–C°¢6öç7B—4Æ—fRÒÖF6‚çv–ææW"bb&ööÆVâ†—47W'&VçBÇÂÖF6‚æÆ—fU66÷&RÇÂÖF6‚ç66÷&R“°¢6öç7B7FGW4Æ&VÂÒ—4Æ—fRò$VâF—&V7B"¢ÖF6‚çv–ææW"ò%FW&Ö–ì:’"¢ÖF6‚çÆ–W$bbÖF6‚çÆ–W$"ò,8¦÷VW""¢,8fVæ—"#°¢6öç7B7FGW46Æ72Ò—4Æ—fRò&Æ—fR"¢ÖF6‚çv–ææW"ò&6ö×ÆWFR"¢'W6öÖ–ær#°¢&WGW&â ¢Æ'F–6ÆR6Æ73Ò'F÷W&æÖVçBÖÖF6‚G¶—47W'&VçBò&7W'&VçB"¢"'ÒG¶—4f–æÂò&f–æÂÖÖF6‚"¢"'Ò#à¢Æ†VFW"6Æ73Ò'F÷W&æÖVçBÖÖF6‚Ö†VB#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×&÷VæBÖÆ&VÂ#âG¶—4f–æÂò$f–æÆR"¢ÖF6‚æÆ&VÇÓÂ÷7ãà¢Ç7â6Æ73Ò'F÷W&æÖVçBÖÖF6‚×7FGW2G·7FGW46Æ77Ò#âG·7FGW4Æ&VÇÓÂ÷7ãà¢Âö†VFW#à¢ÆF—b6Æ73Ò'F÷W&æÖVçB×Æ–W"×&÷rG·Æ–W$vöâò'v–ææW""¢"'ÒG¶—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG·Æ–W$ÒG·F÷W&æÖVçE6VVDçVÖ&W$Ö&·W†ÖF6‚çÆ–W$—ÒG¶”–çFVÆÆ–vVæ6T&FvTÖ&·W†ÖF6‚çÆ–W$—ÓÂ÷7ãà¢G·Æ–W$vöâò#Ç7G&öæsî)É3Â÷7G&öæsâ"¢"'Ð¢ÂöF—cà¢ÆF—b6Æ73Ò'F÷W&æÖVçB×Æ–W"×&÷rG·Æ–W$%vöâò'v–ææW""¢"'ÒG¶—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"’ò&‡VÖâ×Æ–W""¢"'Ò#à¢Ç7â6Æ73Ò'F÷W&æÖVçB×Æ–W"Ö–FVçF—G’#âG·Æ–W$'ÒG·F÷W&æÖVçE6VVDçVÖ&W$Ö&·W†ÖF6‚çÆ–W$"—ÒG¶”–çFVÆÆ–vVæ6T&FvTÖ&·W†ÖF6‚çÆ–W$"—ÓÂ÷7ãà¢G·Æ–W$%vöâò#Ç7G&öæsî)É3Â÷7G&öæsâ"¢"'Ð¢ÂöF—cà¢G·&VæFW%F÷W&æÖVçE6WE66÷&W2‡66÷&UFW‡BÂ—4Æ—fRÂv–ææW%6–FR—Ð¢Âö'F–6ÆSà¢°§Ð ¦gVæ7F–öâF÷W&æÖVçE6VVDçVÖ&W$Ö&·W†VçG'’’°¢–b‚VçG'’’&WGW&â"#°¢6öç7B6VVDçVÖ&W"ÒçVÖ&W"‡7FFRçF÷W&æÖVçBçF÷W&æÖVçE6VVDçVÖ&W'3òå¶VçG'•ÒÇÂ“°¢&WGW&â6VVDçVÖ&W"ãÒbb6VVDçVÖ&W"ÃÒ€¢òÇ7â6Æ73Ò'F÷W&æÖVçB×6VVBÖçVÖ&W"#â‚G·6VVDçVÖ&W'Ò“Â÷7ãæ ¢¢"#°§Ð ¦gVæ7F–öâF÷W&æÖVçEÆ–W$Æ&VÂ†VçG'’’°¢–b‡7FFRçF÷W&æÖVçCòæg&–VæFÇ’’°¢–b‚VçG'’’&WGW&â"#°¢6öç7B–æfòÒg&–VæFÇ”VçG'”–æfò†VçG'’“°¢&WGW&â–æfóòææ–6¶æÖRÇÂ6†&7FW$æÖTg&öÔ–B†g&–VæFÇ”VçG'”6†&7FW$–B†VçG'’’“°¢Ð¢&WGW&â—4‡VÖåF÷W&æÖVçDVçG'’†VçG'’¢ò7FFRçF÷W&æÖVçCòæ‡VÖäæ–6¶æÖRÇÂ7FFRçÆ–W'3òå³Óòææ–6¶æÖRÇÂæ–6¶æÖUfÇVR‚¢¢6†&7FW$æÖTg&öÔ–B‡F÷W&æÖVçD&6TVçG'’†VçG'’’“°§Ð ¦gVæ7F–öâFövvÆUF÷W&æÖVçEæVÂ‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&ã°¢DõU$äÔTåEõäTÅõT’çf—6–&ÆRÒDõU$äÔTåEõäTÅõT’çf—6–&ÆS°¢–b…DõU$äÔTåEõäTÅõT’çf—6–&ÆRbb7FFRçF÷W&æÖVçBæ6†×–öç6†—’°¢DõU$äÔTåEõäTÅõT’æ6†×–öç6†—÷Vå¦öæRÒçVÖ&W"‡7FFRçF÷W&æÖVçBæ6†×–öç6†—†6RÇÂ“°¢Ð¢&VæFW"‚“°§Ð ¦gVæ7F–öâ&VæFW%6W'fW%7–æ5æVÂ‚’°¢òòÆ7–æ6‡&öæ—6F–öâ&W7FR6–ÆVæ6–WW6R7W"ÆR6÷W'B¢ÆR†VFW"VâÆ–væP¢òòFö—B:§G&R7G&–7FVÖVçB–FVçF—VRR6öÆòÂfV2Æ6WVÆRfÌ:†6†RGRÖVçRà¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"76W'fW%7–æ5æVÂ"“òç&VÖ÷fR‚“°§Ð ¦gVæ7F–öâ&VæFW%v—F–æu&ööÔÖöFÂ‚’°¢ÆWB&6¶G&÷ÒFö7VÖVçBçVW'•6VÆV7F÷"‚"çv—F–ær×&ööÒÖ&6¶G&÷"“°¢–b‚4U%dU%õ5”ä2æVæ&ÆVBÇÂöæÆ–æU&ööÕ&VG’‚’’°¢&6¶G&÷òç&VÖ÷fR‚“°¢&WGW&ã°¢Ð¢–b‚&6¶G&÷’°¢&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷v—F–ær×&ööÒÖ&6¶G&÷#°¢Fö7VÖVçBæ&öG’æVæB†&6¶G&÷“°¢Ð¢6öç7BÖ—76–æu6VBÒ4U%dU%õ5”ä2çÆ–W'5³Òò¢°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢ÆF—b6Æ73Ò&ÖöFÂv—F–ær×&ööÒÖÖöFÂ"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÆÆVF'“Ò'v—F–æu&ööÕF—FÆR#à¢Æƒ"–CÒ'v—F–æu&ööÕF—FÆR#äTâEDTåDRDR¤õTUU#Âöƒ#à¢Çå6ÆöâGµ4U%dU%õ5”ä2ç&ööÔ–GÒâVâGFVçFRBwVâGfW'6—&R÷W"G¶Ö—76–æu6VBÓÓÒò&Æ¦öæRvV6†R"¢&Æ¦öæRG&ö—FR'ÒãÂ÷à¢ÆF—b6Æ73Ò&F–ÆörÖ7F–öç2#à¢Æ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâ"G—SÒ&'WGFöâ"FF×v—F–ær×&WGW&âÖÆö&'“å$UDõU"Äô$%“Âö'WGFöãà¢ÂöF—cà¢ÂöF—cà¢°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FF×v—F–ær×&WGW&âÖÆö&'•Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6öæf—&Õ&WGW&åFôÆö&'’“°§Ð ¦gVæ7F–öâ&VæFW%7VÖÖ'’‡Æ–W$–æFW‚Â&ö÷B’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7BÆVFW"ÒÆVF–æuÆ–W$–æFW‚‚“°¢6öç7BVæGW&æ6T6Æ72ÒÆ–W"æVæGW&æ6RÃÒ"ò"Æ÷rÖVæGW&æ6R"¢Æ–W"æVæGW&æ6RÃÒBò"v&æ–ærÖVæGW&æ6R"¢"#°¢6öç7B÷vW$6Æ72ÒÆVFW"ÓÓÒÆ–W$–æFW‚ò"ÆVF–ær×÷vW""¢"#°¢&ö÷Bæ–ææW$…DÔÂÒ ¢Ç6Æ73Ò&Æ&VÂ#âG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—ÒG·7FFRç6W'fW"ÓÓÒÆ–W$–æFW‚ò"+r6W'fWW""¢"'ÓÂ÷à¢ÆF—b6Æ73Ò'7VÖÖ'’Öw&–B#à¢ÆF—b6Æ73Ò&ÖWG&–2VæGW&æ6RÖÖWG&–2G¶VæGW&æ6T6Æ77Ò#ãÇ7G&öæsâG·Æ–W"æVæGW&æ6WÓÂ÷7G&öæsãÇ7ãäVæGW&æ6SÂ÷7ããÂöF—cà¢ÆF—b6Æ73Ò&ÖWG&–2÷vW"ÖÖWG&–2G·÷vW$6Æ77Ò#ãÇ7G&öæsâG·Æ–W"ç÷vW'ÓÂ÷7G&öæsãÇ7ãåV—76æ6SÂ÷7ããÂöF—cà¢ÆF—b6Æ73Ò&ÖWG&–2#ãÇ7G&öæsâG·Æ–W"æ†æBæÆVæwF‡ÓÂ÷7G&öæsãÇ7ãäÖ–ãÂ÷7ããÂöF—cà¢ÆF—b6Æ73Ò&ÖWG&–2#ãÇ7G&öæsâG·Æ–W"çÆ–VBæf–ÇFW"‚†6&B’Óâ6&Bç&VÖ÷fVB’æÆVæwF‡ÓÂ÷7G&öæsãÇ7ãäVæv|:–W3Â÷7ããÂöF—cà¢ÂöF—cà¢°§Ð ¦gVæ7F–öâÆVF–æuÆ–W$–æFW‚‚’°¢6öç7B·Â%ÒÒ7FFRçÆ–W'3°¢–b‚ÇÂ"’&WGW&âçVÆÃ°¢–b‡ç÷vW"â"ç÷vW"’&WGW&â°¢–b‡"ç÷vW"âç÷vW"’&WGW&â°¢&WGW&â7FFRç6W'fW#°§Ð ¦gVæ7F–öâ&ö¦V7E6WE66÷&Tf÷$W†6†ævUv–ææW"‡v–ææW"Âv–åG—RÒ'÷vW""’°¢–b‚7FFRç6WDÖF6ƒòæVæ&ÆVBÇÂ7FFRç6WDÖF6‚ç6WD÷fW"’&WGW&âçVÆÃ°¢6öç7BÆ÷6W"Ò÷öæVçDöb‡v–ææW"“°¢òòVæRf–7Fö—&RW‚ö–çG2WWB&öGV—&R.(	3¢Âvææöæ6RæRFö—B2:§G&P¢òòÆ–Ö—L:–R"Â|:–6'BFRV—76æ6RVæ6÷&R&÷f—6ö—&RVæFçBÂ|:–6†ævRà¢6öç7BW†6†ævU66÷&RÒv–åG—RÓÓÒ&&ö÷7B ¢ò²v–ææW$vÖW3¢2ÂÆ÷6W$vÖW3¢Âv–ææW"ÂÆ÷6W"Ð¢¢²v–ææW$vÖW3¢"ÂÆ÷6W$vÖW3¢Âv–ææW"ÂÆ÷6W"Ó°¢&WGW&â&Wf–Wu6WDÖF6…66÷&R‡v–ææW"ÂW†6†ævU66÷&R“°§Ð ¦gVæ7F–öâ7W'&VçDÖF6…7F¶R‚’°¢–b‚7FFRç6WDÖF6ƒòæVæ&ÆVBÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚ç6WD÷fW"’&WGW&âçVÆÃ°¢6öç7B6Æ÷6–æuÆ–W'2Ò³ÂÒæÖ‚‡Æ–W$–æFW‚’Óâ°¢6öç7B÷vW%66÷&RÒ&ö¦V7E6WE66÷&Tf÷$W†6†ævUv–ææW"‡Æ–W$–æFW‚Â'÷vW""“°¢6öç7B&ö÷7E66÷&RÒ&ö¦V7E6WE66÷&Tf÷$W†6†ævUv–ææW"‡Æ–W$–æFW‚Â&&ö÷7B"“°¢6öç7B6Æ÷6W5v—F…÷vW"Ò&ööÆVâ‡÷vW%66÷&Rbb—56WD÷fW"‡÷vW%66÷&R’bbÆVF–æu6WEÆ–W"‡÷vW%66÷&R’ÓÓÒÆ–W$–æFW‚“°¢6öç7B6Æ÷6W5v—F„&ö÷7BÒ&ööÆVâ†&ö÷7E66÷&Rbb—56WD÷fW"†&ö÷7E66÷&R’bbÆVF–æu6WEÆ–W"†&ö÷7E66÷&R’ÓÓÒÆ–W$–æFW‚“°¢&WGW&â²Æ–W$–æFW‚Â6Æ÷6W5v—F…÷vW"Â6Æ÷6W5v—F„&ö÷7BÂ&ö÷7DöæÇ“¢6Æ÷6W5v—F…÷vW"bb6Æ÷6W5v—F„&ö÷7BÓ°¢Ò’æf–ÇFW"‚†—FVÒ’Óâ—FVÒæ6Æ÷6W5v—F…÷vW"ÇÂ—FVÒæ6Æ÷6W5v—F„&ö÷7B“°¢–b‚6Æ÷6–æuÆ–W'2æÆVæwF‚’&WGW&âçVÆÃ°¢6öç7BÖF6…Æ–W'2Ò6Æ÷6–æuÆ–W'2æf–ÇFW"‚‡²Æ–W$–æFW‚Ò’Óâ7FFRç6WDÖF6‚çF&vWE6WG2bbçVÖ&W"‡7FFRç6WDÖF6‚ç6WG5vöãòå·Æ–W$–æFW…ÒÇÂ’²ãÒçVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2’“°¢6öç7BÖF6„–æFW†W2ÒæWr6WB†ÖF6…Æ–W'2æÖ‚‡²Æ–W$–æFW‚Ò’ÓâÆ–W$–æFW‚’“°¢6öç7B6WEÆ–W'2Ò6Æ÷6–æuÆ–W'2æf–ÇFW"‚‡²Æ–W$–æFW‚Ò’ÓâÖF6„–æFW†W2æ†2‡Æ–W$–æFW‚’“°¢&WGW&â°¢ÖF6…Æ–W'2æÆVæwF‚ò°¢Æ&VÃ¢$$ÄÄRDRÔD4‚"À¢æÖW3¢ÖF6…Æ–W'2æÖ‚‡²Æ–W$–æFW‚Â&ö÷7DöæÇ’Ò’ÓâG¶F—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·Æ–W$–æFW…Ò—ÒG¶&ö÷7DöæÇ’ò"„$ôõ5B’"¢"'Ö’æ¦ö–â‚"+r"’À¢Ò¢çVÆÂÀ¢6WEÆ–W'2æÆVæwF‚ò°¢Æ&VÃ¢$$ÄÄRDR4UB"À¢æÖW3¢6WEÆ–W'2æÖ‚‡²Æ–W$–æFW‚Â&ö÷7DöæÇ’Ò’ÓâG¶F—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·Æ–W$–æFW…Ò—ÒG¶&ö÷7DöæÇ’ò"„$ôõ5B’"¢"'Ö’æ¦ö–â‚"+r"’À¢Ò¢çVÆÂÀ¢Òæf–ÇFW"„&ööÆVâ“°§Ð ¦gVæ7F–öâ&ÆÇ”VæD6öæF—F–öäÆ&VÂ‚’°¢–b‚7FFRç&W7VÇD–æfò’&WGW&â"#°¢–b‡7FFRç&W7VÇD–æfòçv–åG—RÓÓÒ&&ö÷7B"’&WGW&â$$ôõ5B#°¢–b‡7FFRç&W7VÇD–æfòçv–åG—RÓÓÒ'÷vW""’&WGW&â%ö–çG2#°¢&WGW&â$TddUB#°§Ð ¦gVæ7F–öâ&ÆÇ”VæD6öæF—F–öä6Æ72‚’°¢6öç7B6öæF—F–öâÒ&ÆÇ”VæD6öæF—F–öäÆ&VÂ‚“°¢–b†6öæF—F–öâÓÓÒ$$ôõ5B"’&WGW&â'&ÆÇ’ÖVæBÖ&ö÷7B#°¢–b†6öæF—F–öâÓÓÒ$TddUB"’&WGW&â'&ÆÇ’ÖVæBÖVffV7B#°¢&WGW&â'&ÆÇ’ÖVæB×ö–çG2#°§Ð ¦gVæ7F–öâ&ÆÇ”VæE&V6öäÆ&VÂ‚’°¢6öç7B6öæF—F–öâÒ&ÆÇ”VæD6öæF—F–öäÆ&VÂ‚“°¢–b†6öæF—F–öâÓÓÒ$$ôõ5B"’&WGW&â%f–7Fö—&R7W"&ö÷7B#°¢–b†6öæF—F–öâÓÓÒ$TddUB"’&WGW&â%f–7Fö—&R7W"VffWB#°¢&WGW&â%f–7Fö—&RW‚ö–çG2#°§Ð ¦gVæ7F–öâ&ÆÇ”VæDvÖW4FFVB‚’°¢6öç7BW†6†ævU66÷&RÒ7FFRç&W7VÇD–æfóòç6WE66÷&S°¢6öç7BFFVBÒ³ÂÓ°¢–b‚W†6†ævU66÷&R’&WGW&âFFVC°¢FFVE¶W†6†ævU66÷&Rçv–ææW%ÒÒçVÖ&W"†W†6†ævU66÷&Rçv–ææW$vÖW2ÇÂ“°¢FFVE¶W†6†ævU66÷&RæÆ÷6W%ÒÒçVÖ&W"†W†6†ævU66÷&RæÆ÷6W$vÖW2ÇÂ“°¢&WGW&âFFVC°§Ð ¦gVæ7F–öâ&ÆÇ”VæDvÖW4FFVDÆ&VÂ‚’°¢6öç7BFFVBÒ&ÆÇ”VæDvÖW4FFVB‚“°¢&WGW&â²G¶FFVE³×ÒòG¶FFVE³×Ö°§Ð ¦gVæ7F–öâ&ÆÇ”VæE66÷&TÖ&·W‚’°¢–b‚7FFRç&W7VÇD–æfò’&WGW&â"#°¢6öç7B6WDÖF6‚Ò7FFRç&W7VÇD–æfòç6WDÖF6ƒ°¢6öç7B66÷&W2ÒµÓ°¢–b‡6WDÖF6‚’°¢‡6WDÖF6‚æ6ö×ÆWFVE66÷&W2ÇÂµÒ’æf÷$V6‚‚‡66÷&R’Óâ°¢66÷&W2çW6‚‡²66÷&S¢´çVÖ&W"‡66÷&Sòå³ÒÇÂ’ÂçVÖ&W"‡66÷&Sòå³ÒÇÂ•ÒÂ7W'&VçC¢fÇ6RÒ“°¢Ò“°¢–b‚6WDÖF6‚ç6WD÷fW"bb'&’æ—4'&’‡6WDÖF6‚ç66÷&R’’°¢66÷&W2çW6‚‡²66÷&S¢´çVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ’ÂçVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ•ÒÂ7W'&VçC¢G'VRÒ“°¢ÒVÇ6R–b‚66÷&W2æÆVæwF‚bb'&’æ—4'&’‡6WDÖF6‚ç66÷&R’’°¢66÷&W2çW6‚‡²66÷&S¢´çVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ’ÂçVÖ&W"‡6WDÖF6‚ç66÷&U³ÒÇÂ•ÒÂ7W'&VçC¢G'VRÒ“°¢Ð¢Ð¢–b‚66÷&W2æÆVæwF‚bb7FFRç&W7VÇD–æfòç6WE66÷&R’°¢6öç7BW†6†ævU66÷&RÒ7FFRç&W7VÇD–æfòç6WE66÷&S°¢6öç7B66÷&RÒ³ÂÓ°¢66÷&U¶W†6†ævU66÷&Rçv–ææW%ÒÒçVÖ&W"†W†6†ævU66÷&Rçv–ææW$vÖW2ÇÂ“°¢66÷&U¶W†6†ævU66÷&RæÆ÷6W%ÒÒçVÖ&W"†W†6†ævU66÷&RæÆ÷6W$vÖW2ÇÂ“°¢66÷&W2çW6‚‡²66÷&RÂ7W'&VçC¢G'VRÒ“°¢Ð¢–b‚66÷&W2æÆVæwF‚’&WGW&âsÇ7â6Æ73Ò'&ÆÇ’ÖVæB×66÷&RÖV×G’#î(	CÂ÷7ãâs°¢&WGW&âÆF—b6Æ73Ò'&ÆÇ’ÖVæB×66÷&R×fÇVW2"&–ÖÆ&VÃÒ%66÷&RGRÖF6‚#âG·66÷&W2æÖ‚‡²66÷&RÂ7W'&VçBÒÂ–æFW‚’Óâ°¢6öç7B66÷&T6Æ72Ò7W'&VçBò&7W'&VçB"¢66÷&U³Òâ66÷&U³Òò'vöâÖÆVgB"¢'vöâ×&–v‡B#°¢6öç7BÆ&VÂÒ7W'&VçBò%6WBVâ6÷W'2"¢6WBG¶–æFW‚²Ö°¢&WGW&âÇ7G&öær6Æ73Ò"G·66÷&T6Æ77Ò"&–ÖÆ&VÃÒ"G¶Æ&VÇÒ¢G·66÷&U³×Ò:G·66÷&U³×Ò#âG·66÷&U³×Þ(	2G·66÷&U³×ÓÂ÷7G&öæsæ°¢Ò’æ¦ö–â‚sÆ’&–Ö†–FFVãÒ'G'VR#ì+sÂö“âr—ÓÂöF—cæ°§Ð ¦gVæ7F–öâ&VæFW%&ÆÇ”VæD7F–öç2‚’°¢–b‚7FFRævÖT÷fW"’&WGW&â"#°¢6öç7B&öw&W76–öâÒ&VæFW%&öw&W76–öä'WGFöç2‚“°¢6öç7B6WDÖF6‚Ò7FFRç&W7VÇD–æfóòç6WDÖF6ƒ°¢6öç7B6öÆôÖF6„÷fW"Ò6WDÖF6ƒòæÖF6„÷fW"bb7FFRçF÷W&æÖVçCòæ7F—fRbb4U%dU%õ5”ä2æVæ&ÆVBbb4ôÄõô’æVæ&ÆVBbb³"Â5Òæ–æ6ÇVFW2„çVÖ&W"‡7FFRç6WDÖF6ƒòçF&vWE6WG2’“°¢6öç7B&WÆ’Ò6öÆôÖF6„÷fW ¢òsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâ&WÆ’ÖÖF6‚Ö'WGFöâ"G—SÒ&'WGFöâ"FF×&WÆ’×6öÆòÖÖF6ƒå&V¦÷VW"ÆRÖF6ƒÂö'WGFöããÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâV—BÖ6÷W'BÖ'WGFöâ"G—SÒ&'WGFöâ"FF×V—B×6öÆòÖ6÷W'CåV—GFW"ÆR6÷W'CÂö'WGFöãâp¢¢"#°¢&WGW&âG·&öw&W76–öçÒG·&WÆ—Ö°§Ð ¦gVæ7F–öâ&–æE&ÆÇ”VæD7F–öç2‡&ö÷BÒVÇ2ç&ÆÇ•7FFR’°¢&–æE&öw&W76–öä'WGFöç2‡&ö÷B“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FF×&WÆ’×6öÆòÖÖF6…Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢–b…TÅD”ÔDUôÔôDRæ7F—fR’7F'EVÇF–ÖFTvÖR‚“°¢VÇ6R7F'DÖF6„ÖöFR„çVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2’Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢Ò“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FF×V—B×6öÆòÖ6÷W'EÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6öæf—&Õ&WGW&åFôÆö&'’“°§Ð ¦gVæ7F–öâ&VæFW%&ÆÇ•7FFR‚’°¢–b‚VÇ2ç&ÆÇ•7FFR’&WGW&ã°¢6öç7B7F—fRÒ7F—fUÆ–W"‚“°¢6öç7BÆ7BÒ7FFRæÆ7D6&C°¢6öç7B7F—fT6öç7G&–çG2ÒµÓ°¢–b‡7FFRæÖæFF÷'•Æ6VÖVçBbbÆ7B’7F—fT6öç7G&–çG2çW6‚†Æ6VÖVçBG¶Æ7Bç&V6—6–öçÒ²ö&Æ–vFö—&R‚G·7FFRæÖæFF÷'•Æ6VÖVçE&V6öâÓÓÒ'6Ö6‚"ò%6Ö6‚"¢$&ö÷7B'Ò–“°¢–b†7F—fRæÆ–Ö—FVDfÖ–Æ–W2’7F—fT6öç7G&–çG2çW6‚†G—S¢G¶7F—fRæÆ–Ö—FVDfÖ–Æ–W2æ¦ö–â‚"ò"—Ö“°¢–b††5&WGW&å6W'f–6U&W7G&–7F–öâ‡7FFRæ7F—fUÆ–W"’’7F—fT6öç7G&–çG2çW6‚‚'&WF÷W"FR6W'f–6S¢2föÌ:–Rõ6Ö6‚"“°¢6öç7B&W&VEÆ6VÖVçBÒ7F—fRç÷vW"ÒçVÆÂòGW&äVæEÆ6VÖVçB‡7FFRæ7F—fUÆ–W"’¢°¢6öç7B7F¶W2Ò7W'&VçDÖF6…7F¶R‚“°¢6öç7B&ÆÇ”6&BÒVÇ2ç&ÆÇ•7FFSòæ6Æ÷6W7B‚"ç&ÆÇ’Ö6&B"“°¢&ÆÇ”6&Còæ6Æ74Æ—7BçFövvÆR‚&6ö×ÆWFVB"Â7FFRævÖT÷fW"“°¢²'&ÆÇ’ÖVæBÖ&ö÷7B"Â'&ÆÇ’ÖVæBÖVffV7B"Â'&ÆÇ’ÖVæB×ö–çG2%Òæf÷$V6‚‚†6Æ74æÖR’Óâ°¢&ÆÇ”6&Còæ6Æ74Æ—7BçFövvÆR†6Æ74æÖRÂ&ööÆVâ‡7FFRævÖT÷fW"bb6Æ74æÖRÓÓÒ&ÆÇ”VæD6öæF—F–öä6Æ72‚’’“°¢Ò“°¢–b†VÇ2ç&ÆÇ•†6TÆ&VÂ’VÇ2ç&ÆÇ•†6TÆ&VÂçFW‡D6öçFVçBÒ7FFRævÖT÷fW"ò,8–6†ævRFW&Ö–ì:’"¢,8–6†ævRVâ6÷W'2#°¢–b†VÇ2ç&ÆÇ•7FGW4&FvR’°¢VÇ2ç&ÆÇ•7FGW4&FvRçFW‡D6öçFVçBÒ7FFRævÖT÷fW"ò&ÆÇ”VæE&V6öäÆ&VÂ‚’¢G¶F—7Æ•Æ–W$æÖR†7F—fR—Ò:¦÷VW&°¢VÇ2ç&ÆÇ•7FGW4&FvRæ6Æ74æÖRÒ&ÆÇ’×7FGW2Ö&FvRG·7FFRævÖT÷fW"ò6ö×ÆWFVBG·&ÆÇ”VæD6öæF—F–öä6Æ72‚—Ö¢&Æ—fR'Ö°¢Ð¢–b†VÇ2ç&ÆÇ•66÷&TFVÇF&FvR’°¢VÇ2ç&ÆÇ•66÷&TFVÇF&FvRçFW‡D6öçFVçBÒ7FFRævÖT÷fW"ò&ÆÇ”VæDvÖW4FFVDÆ&VÂ‚’¢"#°¢VÇ2ç&ÆÇ•66÷&TFVÇF&FvRæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â7FFRævÖT÷fW"“°¢Ð¢6öç7B6öçFW‡GVÄæ÷F–6W2Ò°¢7F¶W3òæÆVæwF‚òÆF—b6Æ73Ò'&ÆÇ’×7F¶W2#âG·7F¶W2æÖ‚‡7F¶R’ÓâÆF—b6Æ73Ò'&ÆÇ’Ö6öçFW‡BÖÆ–æR7F¶R#ãÇ7G&öæsâG¶W66T‡FÖÂ‡7F¶RæÆ&VÂ—ÓÂ÷7G&öæsãÇ7ãâG¶W66T‡FÖÂ‡7F¶RææÖW2—ÓÂ÷7ããÂöF—cæ’æ¦ö–â‚""—ÓÂöF—cæ¢""À¢7F—fT6öç7G&–çG2æÆVæwF‚òÆF—b6Æ73Ò'&ÆÇ’Ö6öçFW‡BÖÆ–æR6öç7G&–çB#ãÇ7G&öæsä6öçG&–çFSÂ÷7G&öæsãÇ7ãâG¶W66T‡FÖÂ†7F—fT6öç7G&–çG2æ¦ö–â‚"+r"’—ÓÂ÷7ããÂöF—cæ¢""À¢7FFRæ&ö÷7Df–Æ&ÆTf÷"ÓÒçVÆÂò""¢ÆF—b6Æ73Ò'&ÆÇ’Ö6öçFW‡BÖÆ–æR&ö÷7B#ãÇ7G&öæsä$ôõ5BF—7öæ–&ÆSÂ÷7G&öæsãÇ7ãâG¶W66T‡FÖÂ‡Æ–W$æÖR‡7FFRæ&ö÷7Df–Æ&ÆTf÷"’—ÒWWB,:—öæG&RVâ$ôõ5BãÂ÷7ããÂöF—cæÀ¢Òæf–ÇFW"„&ööÆVâ’æ¦ö–â‚""“°¢VÇ2ç&ÆÇ•7FFRæ–ææW$…DÔÂÒ7FFRævÖT÷fW"bb7FFRç&W7VÇD–æfòò ¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖw&–B&ÆÇ’×&W7VÇBÖw&–B#à¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖ6†—&–Ö'’#ãÇ7ãåf–çVWW#Â÷7ããÇ7G&öæsâG¶W66T‡FÖÂ‡Æ–W$æÖR‡7FFRç&W7VÇD–æfòçv–ææW"’—ÓÂ÷7G&öæsãÂöF—cà¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖ6†—&ÆÇ’×66÷&RÖ6†—#ãÇ7ãå66÷&SÂ÷7ãâG·&ÆÇ”VæE66÷&TÖ&·W‚—ÓÂöF—cà¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖ6†—&ÆÇ’ÖæW‡BÖ6†—#ãÆF—b6Æ73Ò'&ÆÇ’ÖæW‡BÖ7F–öç2#âG·&VæFW%&ÆÇ”VæD7F–öç2‚—ÓÂöF—cãÂöF—cà¢ÂöF—cà¢¢ ¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖw&–B#à¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖ6†—&–Ö'’#ãÇ7ãåF÷W#Â÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR†7F—fR’—ÓÂ÷7G&öæsãÂöF—cà¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖ6†—#ãÇ7ãå6W'fWW#Â÷7ããÇ7G&öæsâG¶W66T‡FÖÂ‡Æ–W$æÖR‡7FFRç6W'fW"’—ÓÂ÷7G&öæsãÂöF—cà¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖ6†—#ãÇ7ãäFW&æ–W"6÷WÂ÷7ããÇ7G&öæsâG¶Æ7BòG¶W66T‡FÖÂ†Æ7BææÖR—ÒG¶Æ7Bæ&ö÷7FVBò"+r$ôõ5B"¢"'Ö¢$V7Vâ'ÓÂ÷7G&öæsâG¶Æ7BòÇ6ÖÆÃå,:–6—6–öâG¶Æ7Bç&V6—6–öçÓÂ÷6ÖÆÃæ¢"'ÓÂöF—cà¢ÆF—b6Æ73Ò'&ÆÇ’Ö–æfòÖ6†—#ãÇ7ãåÆ6VÖVçB,:—,:“Â÷7ããÇ7G&öæsâG·&W&VEÆ6VÖVçGÓÂ÷7G&öæsãÂöF—cà¢ÂöF—cà¢G¶6öçFW‡GVÄæ÷F–6W2òÆF—b6Æ73Ò'&ÆÇ’Ö6öçFW‡BÖÆ—7B#âG¶6öçFW‡GVÄæ÷F–6W7ÓÂöF—cæ¢"'Ð¢°¢&–æE&ÆÇ”VæD7F–öç2‚“°§Ð ¦gVæ7F–öâ&VæFW$VffV7Dæ÷F–6R‚’°¢–b‚VÇ2æVffV7Dæ÷F–6R’&WGW&ã°¢–b‡7FFRævÖT÷fW"ÇÂ7FFRæVffV7Dæ÷F–6R’°¢VÇ2æVffV7Dæ÷F–6Ræ6Æ74æÖRÒ&VffV7BÖæ÷F–6R×WFVB†–FFVâ#°¢VÇ2æVffV7Dæ÷F–6Ræ–ææW$…DÔÂÒ"#°¢&WGW&ã°¢Ð¢VÇ2æVffV7Dæ÷F–6Ræ6Æ74æÖRÒ&VffV7BÖæ÷F–6R#°¢VÇ2æVffV7Dæ÷F–6Ræ–ææW$…DÔÂÒÇ7â6Æ73Ò&VffV7BÖæ÷F–6RÖ¶–6¶W"#äVffWBG¶W66T‡FÖÂ‡7FFRæVffV7Dæ÷F–6Rç7FGW2—ÓÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ‡7FFRæVffV7Dæ÷F–6Ræ6&DæÖR—ÓÂ÷7G&öæsãÇâG¶W66T‡FÖÂ‡7FFRæVffV7Dæ÷F–6RæÖW76vR—ÓÂ÷æ°§Ð ¦gVæ7F–öâVÇF–ÖFT6&D&6´f÷%Æ–W"‡Æ–W$–æFW‚’°¢&WGW&âTÅD”ÔDUôÔôDRæ7F—fRbbVÇF–ÖFUÆ–W$6öæf–r‡Æ–W$–æFW‚¢òVÇF–ÖFUÆ–W$6öæf–r‡Æ–W$–æFW‚’æ&6°¢¢4$Eô$4µô”ÔtS°§Ð ¦gVæ7F–öâ6&D'Gv÷&²†6&B’°¢&WGW&â6&Còæ'Gv÷&²ÇÂ4$Eô”ÔtU5¶6&Còæ–EÒÇÂ4$Eô$4µô”ÔtS°§Ð ¦gVæ7F–öâ&VæFW$6&Ef—7VÄöæÇ’†6&BÂ6Æ74æÖRÒ""’°¢–b‚6&B’&WGW&âsÆF—b6Æ73Ò'Æ–VBÖ6&BV×G’#äV7VæR6'FSÂöF—câs°¢6öç7B–ÖvUW&ÂÒ6&Bæ'Gv÷&²ÇÂ4$Eô”ÔtU5¶6&Bæ–EÓ°¢–b‚–ÖvUW&Â’°¢&WGW&âÆF—b6Æ73Ò'Æ–VBÖ6&BG¶6Æ74æÖWÒ#ãÇ7G&öæsâG¶6&BææÖWÓÂ÷7G&öæsâG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—ÓÂöF—cæ°¢Ð¢&WGW&â ¢Æ'WGFöâ6Æ73Ò'Æ–VB×f—7VÂG¶6Æ74æÖWÒG¶6&Bç&VÖ÷fVBò'&VÖ÷fVB"¢"'Ò"G—SÒ&'WGFöâ"FFÖ–ÖvR×¦ööÓÒ"G¶W66T‡FÖÂ†–ÖvUW&Â—Ò"FFÖ–ÖvRÖÆ&VÃÒ"G¶W66T‡FÖÂ†G¶6&BææÖWÒÒG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—Ö—Ò"&–ÖÆ&VÃÒ$w&æF—"G¶W66T‡FÖÂ†6&BææÖR—Ò#à¢G¶6&Bæ&ö÷7FVBòÇ7â6Æ73Ò&&ö÷7B×67&–f–6RÖÆ–W"#ãÆ–Ör6Æ73Ò&&ö÷7B×67&–f–6RÖ&6²"7&3Ò"G·VÇF–ÖFT6&D&6´f÷%Æ–W"†6&Bæ÷væW"—Ò"ÇCÒ$6'FR67&–fœ:–Rf6R66Œ:–R"óãÇ7â6Æ73Ò&&ö÷7B×67&–f–6RÖÆ&VÂ#ä$ôõ5CÂ÷7ããÂ÷7ãæ¢"'Ð¢Æ–Ör7&3Ò"G¶–ÖvUW&ÇÒ"ÇCÒ"G¶6&BææÖWÒÒG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—Ò"óà¢G¶6&Båög&öÕ&W6W'fRòsÇ7â6Æ73Ò'VÇF–ÖFR×&W6W'fRÖÖ&²"&–ÖÆ&VÃÒ$6'FR¦÷\:–RFWV—2Æ,:—6W'fR#ãÂ÷7ãâr¢"'Ð¢G¶6&BæÖ&¶VDf÷$F—66&BòsÇ7â6Æ73Ò'VÇF–ÖFRÖF—66&BÖÖ&²"&–ÖÆ&VÃÒ$6'FRÖ'\:–R÷W"ÆL:–fW76R#ãÂ÷7ãâr¢"'Ð¢G¶6&Bç&VÖ—6TÖöFRÓÓÒ'Æ6VÖVçB"òÆ–Ör6Æ73Ò'&VÖ—6RÖf÷&&–BÖ÷fW&Æ’"7&3Ò"G´dõ$$”Eô”ÔtWÒ"ÇCÒ$VffWB–çFW&F—BÂ6'FR¦÷\:–RVâ&VÖ—6R"óæ¢"'Ð¢G¶6&Bæ&ö÷7FVBòsÇ7â6Æ73Ò'Æ–VBÖ6†—#ä$ôõ5CÂ÷7ãâr¢"'Ð¢G¶6&Bç&VÖ÷fVBòsÇ7â6Æ73Ò'Æ–VBÖ6†—&VÖ÷fVBÖ6†—#å$UD•,8”SÂ÷7ãâr¢"'Ð¢Âö'WGFöãà¢°§Ð ¦gVæ7F–öâ&VæFW$6†ö–6T6&Ef—7VÂ†6&B’°¢6öç7B–ÖvUW&ÂÒ6&Bæ'Gv÷&²ÇÂ4$Eô”ÔtU5¶6&Bæ–EÓ°¢–b‚–ÖvUW&Â’°¢&WGW&âÇ7G&öæsâG¶6&BææÖWÓÂ÷7G&öæsãÇ7ãâG¶6&BæfÖ–Ç—ÓÂ÷7ãæ°¢Ð¢&WGW&â ¢ÆF—b6Æ73Ò&6†ö–6RÖ6&B×f—7VÂ#à¢Æ–Ör6Æ73Ò&F–ÆörÖ6&B×&Wf–Wr"7&3Ò"G¶–ÖvUW&ÇÒ"FFÖ–ÖvR×¦ööÓÒ"G¶W66T‡FÖÂ†–ÖvUW&Â—Ò"FFÖ–ÖvRÖÆ&VÃÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò"ÇCÒ"G¶6&BææÖWÒÒG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—Ò"óà¢ÂöF—cà¢Ç7G&öæsâG¶6&BææÖWÓÂ÷7G&öæsà¢Ç7ãâG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—ÓÂ÷7ãà¢°§Ð ¦gVæ7F–öâ&VæFW$6&D&6²†6Æ74æÖRÒ""ÂÆ–W$–æFW‚ÒçVÆÂ’°¢&WGW&â ¢ÆF—b6Æ73Ò&6&B×f—7VÂ6&BÖ&6²G¶6Æ74æÖWÒ#à¢Æ–Ör7&3Ò"G·VÇF–ÖFT6&D&6´f÷%Æ–W"‡Æ–W$–æFW‚—Ò"ÇCÒ$6'FRf6R66Œ:–R"óà¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ&VæFW$6†&7FW$6&B‡Æ–W"ÂÆ–W$–æFW‚ÂæVÂÒ·Ò’°¢6öç7B6†&7FW"Ò6†&7FW$öb‡Æ–W"“°¢6öç7BVÇF–ÖFT6†&7FW"ÒTÅD”ÔDUôÔôDRæ7F—fRòVÇF–ÖFUÆ–W$6öæf–r‡Æ–W$–æFW‚’¢çVÆÃ°¢6öç7B–ÖvUW&ÂÒVÇF–ÖFT6†&7FW ¢ò‡Æ–W"æ6†&7FW%7F$7F—fRòVÇF–ÖFT6†&7FW"ç÷vW"¢VÇF–ÖFT6†&7FW"æ6†&7FW"¢¢$ôd”ÄUô4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÐ¢óò4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÓòå·Æ–W"æ6†&7FW%6–FUÐ¢óò4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÓòå³Ó°¢6öç7BÆVFW"ÒÆVF–æuÆ–W$–æFW‚‚“°¢6öç7BÆVFW$6Æ72ÒÆVFW"ÓÓÒÆ–W$–æFW‚ò"ÆVF–ær×÷vW""¢"#°¢6öç7BVæGW&æ6T6Æ72ÒÆ–W"æVæGW&æ6RÃÒ"ò"Æ÷rÖVæGW&æ6R"¢Æ–W"æVæGW&æ6RÃÒBò"v&æ–ærÖVæGW&æ6R"¢"#°¢6öç7B7&÷vâÒ7FFRævÖT÷fW"bb7FFRç&W7VÇD–æfóòçv–ææW"ÓÓÒÆ–W$–æFW€¢òÇ7â6Æ73Ò'v–ææW"Ö7&÷vâ"&–ÖÆ&VÃÒ%f–çVWW"#ãÆ–Ör7&3Ò"G´5$õtåô”ÔtWÒ"ÇCÒ$6÷W&öææR"óãÂ÷7ãæ ¢¢"#°¢6öç7B6†÷u74'WGFöâÒ&ööÆVâ‡æVÂç6†÷u74'WGFöâ“°¢6öç7B7F–öå&öÆRÒæVÂæFW6·F÷&öÆRÓÓÒ&÷öæVçB"ò&÷öæVçB"¢&Æö6Â#°¢6öç7B6FV×•GW&ä'WGFöç2Ò ¢ÆF—b6Æ73Ò'GW&âÖ'WGFöç2FW6·F÷×&öf–ÆRÖ7F–öç2FW6·F÷×&öf–ÆRÖ7F–öç2ÒÒG¶7F–öå&öÆWÒ#à¢G·6†÷u74'WGFöâòÆ'WGFöâ6Æ73Ò'72Ö'WGFöâG·æVÂç75&W7VÇD6Æ72ÇÂ'72Ö'WGFöâÒÖÆ÷6–ær'ÒG·GWF÷&–Äfö7W46Æ72‚'72"ÂÆ–W$–æFW‚—Ò"G—SÒ&'WGFöâ"FF×73Ò"G·Æ–W$–æFW‡Ò"F—FÆSÒ"G¶W66T‡FÖÂ‡æVÂç75&ö¦V7F–öäÆ&VÂÇÂ%76W""—Ò"G·æVÂç74F—6&ÆVBò&F—6&ÆVB"¢"'ÓâG·GWF÷&–Ä'WGFöä7VR‚'72"ÂÆ–W$–æFW‚—Õ76W#Âö'WGFöãæ¢"'Ð¢G¶6äVæEGW&â‡Æ–W$–æFW‚’òÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâVæB×GW&âÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖVæB×GW&ãÒ"G·Æ–W$–æFW‡Ò#âG·GWF÷&–Ä'WGFöä7VR‚&VæEGW&â"ÂÆ–W$–æFW‚—ÕFW&Ö–æW"ÆRF÷W#Âö'WGFöãæ¢"'Ð¢G¶6åVæFõGW&â‡Æ–W$–æFW‚’òÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâVæFò×GW&âÖ'WGFöâ"G—SÒ&'WGFöâ"FF×VæFò×GW&ãÒ"G·Æ–W$–æFW‡Ò#äæçVÆW"ÆRF÷W#Âö'WGFöãæ¢"'Ð¢ÂöF—cà¢°¢6öç7B7FGW4&FvW2Ò°¢7FFRç6W'fW"ÓÓÒÆ–W$–æFW‚òsÇ7â6Æ73Ò&&FvR6W'fW"#å6W'fWW#Â÷7ãâr¢""À¢7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW‚bb7FFRævÖT÷fW"òsÇ7â6Æ73Ò&&FvR7F—fR#ì8¦÷VW#Â÷7ãâr¢""À¢Òæf–ÇFW"„&ööÆVâ’æ¦ö–â‚""“°¢6öç7BVÇF–ÖFU&öf–ÆU&W6÷W&6W2ÒTÅD”ÔDUôÔôDRæ7F—fRò ¢Æ'WGFöâ6Æ73Ò'VÇF–ÖFR×&öf–ÆRÖVæW&w’"G—SÒ&'WGFöâ"FFÖ÷Vâ×VÇF–ÖFRÖVæW&w“Ò"G·Æ–W$–æFW‡Ò"&–ÖÆ&VÃÒ%WF–Æ—6W"VæR:–æW&v–R+rG·Æ–W"æVæW&w—ÒF—7öæ–&ÆRG·Æ–W"æVæW&w’âò'2"¢"'Ò"G·Æ–W"æVæW&w’ÃÒÇÂ7FFRævÖT÷fW"ÇÂÆ–W$–æFW‚ÓÓÒ4ôÄõô’çÆ–W$–æFW‚ò&F—6&ÆVB"¢"'ÓãÆ–Ör7&3Ò"âö76WG2ö–6öç2÷VÇF–ÖFRÖVæW&w’ç7fr"ÇCÒ""&–Ö†–FFVãÒ'G'VR#ãÇ7G&öæsâG·Æ–W"æVæW&w—ÓÂ÷7G&öæsãÂö'WGFöãà¢¢"#°¢6öç7BVÇF–ÖFTF—66&BÒTÅD”ÔDUôÔôDRæ7F—fRbbÆ–W$–æFW‚ÓÓÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚¢òÆ'WGFöâ6Æ73Ò'VÇF–ÖFR×&öf–ÆRÖF—66&B"G—SÒ&'WGFöâ"FFÖ÷Vâ×VÇF–ÖFRÖF—66&CÒ"G·Æ–W$–æFW‡Ò#î)jBL8”dU54RÇ7G&öæsâG²‡7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…ÒÇÂµÒ’æÆVæwF‡ÓÂ÷7G&öæsãÂö'WGFöãæ ¢¢"#°¢6öç7B÷'G&—DÖ&·WÒTÅD”ÔDUôÔôDRæ7F—fP¢òÆ'WGFöâ6Æ73Ò&6†&7FW"Ö6&BG·7FFRævÖT÷fW"bb7FFRç&W7VÇD–æfóòçv–ææW"ÓÓÒÆ–W$–æFW‚ò"W†6†ævR×v–ææW""¢"'ÒG·GWF÷&–Äfö7W46Æ72‚&6†&7FW""ÂÆ–W$–æFW‚—Ò"G—SÒ&'WGFöâ"FF×VÇF–ÖFRÖ6†&7FW"×7FFSÒ"G·Æ–W$–æFW‡Ò"FFÖ–ÖvRÖ†÷fW#Ò"G¶W66T‡FÖÂ†–ÖvUW&Â—Ò"FFÖ–ÖvRÖÆ&VÃÒ"G¶W66T‡FÖÂ†G¶6†&7FW"ææÖWÒÒ÷Wfö—&—Ò#à¢Æ–Ör7&3Ò"G¶–ÖvUW&ÇÒ"ÇCÒ"G¶6†&7FW"ææÖWÒ"óà¢Âö'WGFöãæ ¢¢ÆF—b6Æ73Ò&6†&7FW"×÷'G&—B×7FvR#à¢ÆF—b6Æ73Ò&6†&7FW"Ö6&BG·7FFRævÖT÷fW"bb7FFRç&W7VÇD–æfóòçv–ææW"ÓÓÒÆ–W$–æFW‚ò"W†6†ævR×v–ææW""¢"'ÒG·GWF÷&–Äfö7W46Æ72‚&6†&7FW""ÂÆ–W$–æFW‚—Ò"FFÖ–ÖvRÖ†÷fW#Ò"G¶W66T‡FÖÂ†–ÖvUW&Â—Ò"FFÖ–ÖvRÖÆ&VÃÒ"G¶W66T‡FÖÂ†G¶6†&7FW"ææÖWÒÒ÷Wfö—&—Ò#à¢Æ–Ör7&3Ò"G¶–ÖvUW&ÇÒ"ÇCÒ"G¶6†&7FW"ææÖWÒ"óà¢ÂöF—cà¢G¶7F–öå&öÆRÓÓÒ&Æö6Â"ò6FV×•GW&ä'WGFöç2¢"'Ð¢ÂöF—cæ°¢&WGW&â ¢ÆF—b6Æ73Ò&6†&7FW"×¦öæRGµTÅD”ÔDUôÔôDRæ7F—fRò"VÇF–ÖFRÖ6†&7FW"×¦öæR"¢"'Ò#à¢G·÷'G&—DÖ&·WÐ¢ÆF—b6Æ73Ò&FW6·F÷×Æ–W"Ö–FVçF—G’G·7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW‚bb7FFRævÖT÷fW"ò"7F—fR×GW&â"¢"'Ò#à¢Ç7G&öæsâG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—ÓÂ÷7G&öæsà¢ÆF—cà¢Ç7ãâG¶W66T‡FÖÂ†g&Væ6„÷&F–æÅ&æ²‡æVÂç&æ²’—ÓÂ÷7ãà¢G·æVÂæ—4•Æ–W"òÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÇ7ãâG¶W66T‡FÖÂ‡æVÂæ–çFVÆÆ–vVæ6TÆ&VÂ—ÓÂ÷7ãæ¢"'Ð¢ÂöF—cà¢ÂöF—cà¢ÆF—b6Æ73Ò&6†&7FW"×7FG2#à¢ÆF—b6Æ73Ò&6†&7FW"×÷vW"×&VÖ–æFW"G·Æ–W"ç÷vW"â’ò"F÷V&ÆRÖF–v—B×÷vW""¢"'ÒG¶ÆVFW$6Æ77ÒG·GWF÷&–Äfö7W46Æ72‚'÷vW""ÂÆ–W$–æFW‚—Ò"FF×GWF÷&–Â×F&vWCÒ'÷vW"ÒG·Æ–W$–æFW‡Ò#à¢G¶7&÷vçÐ¢ÆF—b6Æ73Ò'7FB×fÇVR×&÷r7FB×fÇVR×÷vW"#à¢Ç7â6Æ73Ò'7FB×7–Ö&öÂ7FB×7–Ö&öÂ×÷vW""&–Ö†–FFVãÒ'G'VR#ãÂ÷7ãà¢Ç7G&öæsâG·Æ–W"ç÷vW'ÓÂ÷7G&öæsà¢ÂöF—cà¢ÂöF—cà¢ÆF—b6Æ73Ò&6†&7FW"ÖVæGW&æ6R×&VÖ–æFW"G¶VæGW&æ6T6Æ77ÒG·GWF÷&–Äfö7W46Æ72‚&VæGW&æ6R"ÂÆ–W$–æFW‚—Ò"FF×GWF÷&–Â×F&vWCÒ&VæGW&æ6RÒG·Æ–W$–æFW‡Ò#à¢ÆF—b6Æ73Ò'7FB×fÇVR×&÷r7FB×fÇVRÖVæGW&æ6R#à¢Ç7â6Æ73Ò'7FB×7–Ö&öÂ7FB×7–Ö&öÂÖVæGW&æ6R"&–Ö†–FFVãÒ'G'VR#ãÂ÷7ãà¢Ç7G&öæsâG·Æ–W"æVæGW&æ6WÓÂ÷7G&öæsà¢ÂöF—cà¢ÂöF—cà¢G·VÇF–ÖFU&öf–ÆU&W6÷W&6W7Ð¢ÂöF—cà¢Æ'WGFöâ6Æ73Ò&FW6·F÷×Æ–W"Ö&öçW2Ö6÷VçB"G—SÒ&'WGFöâ"FFÖ÷VâÖFW6·F÷Ö&öçW6W3Ò"G·Æ–W$–æFW‡Ò"&–ÖÆ&VÃÒ%fö—"ÆW2G·æVÂæ&öçW46÷VçGÒ&öçW2WBÖÇW2FRG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—Ò#à¢Ç7ãä$ôåU3Â÷7ãâÇ7G&öæsâG·æVÂæ&öçW46÷VçGÓÂ÷7G&öæsà¢Âö'WGFöãà¢G·VÇF–ÖFTF—66&GÐ¢G·7FGW4&FvW2òÆF—b6Æ73Ò&FW6·F÷×Æ–W"×7FGW2#âG·7FGW4&FvW7ÓÂöF—cæ¢"'Ð¢GµTÅD”ÔDUôÔôDRæ7F—fRòÆF—b6Æ73Ò'GW&âÖ'WGFöç2#à¢G·6†÷u74'WGFöâòÆ'WGFöâ6Æ73Ò'72Ö'WGFöâG·æVÂç75&W7VÇD6Æ72ÇÂ'72Ö'WGFöâÒÖÆ÷6–ær'ÒG·GWF÷&–Äfö7W46Æ72‚'72"ÂÆ–W$–æFW‚—Ò"G—SÒ&'WGFöâ"FF×73Ò"G·Æ–W$–æFW‡Ò"F—FÆSÒ"G¶W66T‡FÖÂ‡æVÂç75&ö¦V7F–öäÆ&VÂÇÂ%76W""—Ò"G·æVÂç74F—6&ÆVBò&F—6&ÆVB"¢"'ÓâG·GWF÷&–Ä'WGFöä7VR‚'72"ÂÆ–W$–æFW‚—Õ76W#Âö'WGFöãæ¢"'Ð¢G¶6äVæEGW&â‡Æ–W$–æFW‚’òÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâVæB×GW&âÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖVæB×GW&ãÒ"G·Æ–W$–æFW‡Ò#âG·GWF÷&–Ä'WGFöä7VR‚&VæEGW&â"ÂÆ–W$–æFW‚—ÕFW&Ö–æW"ÆRF÷W#Âö'WGFöãæ¢"'Ð¢G¶6åVæFõGW&â‡Æ–W$–æFW‚’òÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâVæFò×GW&âÖ'WGFöâ"G—SÒ&'WGFöâ"FF×VæFò×GW&ãÒ"G·Æ–W$–æFW‡Ò#äæçVÆW"ÆRF÷W#Âö'WGFöãæ¢"'Ð¢ÂöF—cæ¢7F–öå&öÆRÓÓÒ&÷öæVçB"ò6FV×•GW&ä'WGFöç2¢"'Ð¢GµTÅD”ÔDUôÔôDRæ7F—fRò""¢sÆF—b6Æ73Ò&FW6·F÷×&öf–ÆRÖ&÷GFöÒ×76W""&–Ö†–FFVãÒ'G'VR#ãÂöF—câwÐ¢ÂöF—cà¢°§Ð ¦gVæ7F–öâÆ6VÖVçE&VÖ—6W4f÷%6†÷B‡Æ–VD6&G2Â6†÷D–æFW‚’°¢6öç7B6†÷BÒÆ–VD6&G5·6†÷D–æFW…Ó°¢–b‚6†÷BÇÂ—5&VÖ—6R‡6†÷B’’&WGW&âµÓ°¢6öç7B&VÖ—6W2ÒµÓ°¢f÷"†ÆWB–æFW‚Ò6†÷D–æFW‚Ò²–æFW‚ãÒ²–æFW‚ÓÒ’°¢6öç7B6&BÒÆ–VD6&G5¶–æFW…Ó°¢–b†6&BçGW&ä6ö×ÆWFVBÇÂ—5&VÖ—6R†6&B’’'&V³°¢–b†6&Bç&VÖ—6TÖöFRÓÓÒ'Æ6VÖVçB"bb6&Bç&VÖ÷fVB’&VÖ—6W2çVç6†–gB†6&B“°¢Ð¢&WGW&â&VÖ—6W3°§Ð ¦gVæ7F–öâVffV7D6&E&V6VFW46&B‡Æ–VD6&G2Â6&D–æFW‚’°¢6öç7BF&vWD6&BÒÆ–VD6&G5¶6&D–æFW…Ó°¢–b‚F&vWD6&BÇÂF&vWD6&Bç&VÖ—6TÖöFRÓÓÒ'Æ6VÖVçB"’&WGW&âfÇ6S°¢f÷"†ÆWB–æFW‚Ò6&D–æFW‚Ò²–æFW‚ãÒ²–æFW‚ÓÒ’°¢6öç7B6&BÒÆ–VD6&G5¶–æFW…Ó°¢–b†6&BçGW&ä6ö×ÆWFVBÇÂ—5&VÖ—6R†6&B’’'&V³°¢–b†6&Bç&VÖ—6TÖöFRÓÓÒ&VffV7B"’&WGW&âG'VS°¢Ð¢&WGW&âfÇ6S°§Ð ¦gVæ7F–öâ&VæFW%&VÖ—6U7F6²‡6†÷BÂ&VÖ—6T6&G2’°¢6öç7BÆ6VÖVçD&öçW2Ò&VÖ—6T6&G2ç&VGV6R‚‡F÷FÂÂ6&B’ÓâF÷FÂ²çVÖ&W"†6&BçÆ6VÖVçBÇÂ’Â“°¢6öç7BFWF–Ç2Ò&VÖ—6T6&G2æÖ‚†6&B’ÓâG¶6&BææÖWÒ²G´çVÖ&W"†6&BçÆ6VÖVçBÇÂ—Ö’æ¦ö–â‚"Â"“°¢&WGW&âÆF—b6Æ73Ò'&VÖ—6R×VæFW&Æ’×w&G·6†÷Bæ&ö÷7FVBò"†2Ö&ö÷7B"¢"'Ò"&–ÖÆ&VÃÒ"G¶W66T‡FÖÂ†&VÖ—6R²G·Æ6VÖVçD&öçW7ÒÆ6VÖVçB¢G¶FWF–Ç7Ö—Ò#à¢ÆF—b6Æ73Ò'&VÖ—6R×VæFW&Æ’ÖÆ–W""&–Ö†–FFVãÒ'G'VR#à¢Æ–Ör7&3Ò"Gµ$TÔ•4UõTäDU$Ä•ô”ÔtWÒ"ÇCÒ""óà¢Ç7ãâ²G·Æ6VÖVçD&öçW7ÓÂ÷7ãà¢ÂöF—cà¢ÆF—b6Æ73Ò'&VÖ—6R×VæFW&Æ’×6†÷B#âG·&VæFW$6&Ef—7VÄöæÇ’‡6†÷BÂ&6VçFW"×Æ–VB"—ÓÂöF—cà¢ÂöF—cæ°§Ð ¦gVæ7F–öâ&VæFW%Æ–VD†—7F÷'’‡Æ–W"’°¢–b‚Æ–W"çÆ–VBæÆVæwF‚’°¢&WGW&âsÆF—b6Æ73Ò'Æ–VBÖ6&BV×G’#äV7VæR6'FSÂöF—câs°¢Ð¢6öç7B&VæFW&VD6&G2ÒÆ–W"çÆ–VBæÖ‚†6&BÂ–æFW‚ÂÆ–VD6&G2’Óâ°¢–b†6&Bç&VÖ—6TÖöFRÓÓÒ'Æ6VÖVçB"’°¢6öç7BÆFW%6†÷BÒÆ–VD6&G2ç6Æ–6R†–æFW‚²’æf–æB‚†6æF–FFR’Óâ—5&VÖ—6R†6æF–FFR’ÇÂ6æF–FFRçGW&ä6ö×ÆWFVB“°¢–b†ÆFW%6†÷B’&WGW&â"#°¢Ð¢6öç7B&VÖ—6T6&G2ÒÆ6VÖVçE&VÖ—6W4f÷%6†÷B‡Æ–VD6&G2Â–æFW‚“°¢&WGW&â&VÖ—6T6&G2æÆVæwF‚ò&VæFW%&VÖ—6U7F6²†6&BÂ&VÖ—6T6&G2’¢&VæFW$6&Ef—7VÄöæÇ’†6&BÂ&†—7F÷'’Ö6&B"“°¢Ò“°¢&WGW&â ¢ÆF—b6Æ73Ò'Æ–VBÖ†—7F÷'’×&÷r#à¢G·&VæFW&VD6&G2æ¦ö–â‚""—Ð¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ&VæFW$F–v—D–ÖvR‡fÇVR’°¢6öç7B–ÖvUW&ÂÒ44õ$UôD”t•Eô”ÔtU5·fÇVUÓ°¢–b‚–ÖvUW&Â’&WGW&âÇ7â6Æ73Ò'66÷&RÖF–v—BÖfÆÆ&6²#âG·fÇVWÓÂ÷7ãæ°¢&WGW&âÆ–Ör6Æ73Ò'66÷&RÖF–v—BÖ–ÖvR"7&3Ò"G¶–ÖvUW&ÇÒ"ÇCÒ"G·fÇVWÒ"óæ°§Ð ¦gVæ7F–öâ&VæFW%6WDÖ&¶W$–ÖvR‡F&vWE6WG2Âvöå6WG2ÂÆ–W$–æFW‚’°¢6öç7B6Æ×VBÒÖF‚æÖ‚ƒÂÖF‚æÖ–â‡F&vWE6WG2Âvöå6WG2óò’“°¢6öç7B–ÖvUW&ÂÒÔD4…õ4UEô”ÔtU5·F&vWE6WG5Óòå¶6Æ×VEÓ°¢–b‚–ÖvUW&Â’&WGW&â"#°¢&WGW&âÆ–Ör6Æ73Ò'6WBÖÖ&¶W"Ö–ÖvRÆ–W"ÒG·Æ–W$–æFW‚²Ò"7&3Ò"G¶–ÖvUW&ÇÒ"ÇCÒ"G¶6Æ×VGÒ6WBG¶6Æ×VBâò'2"¢"'Òvvì:’G¶6Æ×VBâò'2"¢"'Ò"óæ°§Ð ¦gVæ7F–öâ&VæFW$6VçFW%6WE66÷&R‚’°¢ÆWBvÖW2ÒçVÆÃ°¢ÆWBÆ&VÂÒ%66÷&RFRÂ|:–6†ævR#°¢ÆWB6ö×ÆWFVE66÷&W2ÒµÓ°¢ÆWB6†÷t7W'&VçE66÷&RÒG'VS°¢ÆWBÖF6„Æ–æRÒ"#°¢–b‡7FFRç6WDÖF6‚æVæ&ÆVB’°¢vÖW2Ò7FFRç6WDÖF6‚ç66÷&S°¢6ö×ÆWFVE66÷&W2Ò7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2óòµÓ°¢6†÷t7W'&VçE66÷&RÒ7FFRç6WDÖF6‚ç6WD÷fW#°¢Æ&VÂÒ%66÷&RGR6WB#°¢–b‡7FFRç6WDÖF6‚çF&vWE6WG2’°¢ÖF6„Æ–æRÒÆF—b6Æ73Ò&6VçFW"ÖÖF6‚ÖÖ&¶W'2"&–ÖÆ&VÃÒ%6WG2vvì:—2#à¢G·&VæFW%6WDÖ&¶W$–ÖvR‡7FFRç6WDÖF6‚çF&vWE6WG2Â7FFRç6WDÖF6‚ç6WG5vöå³ÒÂ—Ð¢G·&VæFW%6WDÖ&¶W$–ÖvR‡7FFRç6WDÖF6‚çF&vWE6WG2Â7FFRç6WDÖF6‚ç6WG5vöå³ÒÂ—Ð¢ÂöF—cæ°¢Ð¢ÒVÇ6R–b‡7FFRævÖT÷fW"bb7FFRç&W7VÇD–æfóòç6WE66÷&R’°¢vÖW2Ò³ÂÓ°¢vÖW5·7FFRç&W7VÇD–æfòç6WE66÷&Rçv–ææW%ÒÒ7FFRç&W7VÇD–æfòç6WE66÷&Rçv–ææW$vÖW3°¢vÖW5·7FFRç&W7VÇD–æfòç6WE66÷&RæÆ÷6W%ÒÒ7FFRç&W7VÇD–æfòç6WE66÷&RæÆ÷6W$vÖW3°¢Ð¢–b‚vÖW2’&WGW&â"#°¢&WGW&â ¢ÆF—b6Æ73Ò&6VçFW"×6WB×7F6²"&–ÖÆ&VÃÒ"G¶Æ&VÇÒ#à¢G¶ÖF6„Æ–æWÐ¢G¶6ö×ÆWFVE66÷&W2æÖ‚‡66÷&R’Óâ ¢ÆF—b6Æ73Ò&6VçFW"×6WB×66÷&R6ö×ÆWFVB×6WB×66÷&R#à¢G·&VæFW$F–v—D–ÖvR‡66÷&U³Ò—Ð¢Ç7G&öæsâóÂ÷7G&öæsà¢G·&VæFW$F–v—D–ÖvR‡66÷&U³Ò—Ð¢ÂöF—cà¢’æ¦ö–â‚""—Ð¢G·6†÷t7W'&VçE66÷&RòÆF—b6Æ73Ò&6VçFW"×6WB×66÷&RG·7FFRç6WDÖF6‚æVæ&ÆVBò"Æ—fR×6WB×66÷&R"¢"'Ò#à¢G·&VæFW$F–v—D–ÖvR†vÖW5³Ò—Ð¢Ç7G&öæsâóÂ÷7G&öæsà¢G·&VæFW$F–v—D–ÖvR†vÖW5³Ò—Ð¢ÂöF—cæ¢"'Ð¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ&VæFW$FW6·F÷ÖF6…66÷&R‚’°¢–b‚VÇ2æFW6·F÷ÖF6…66÷&R’&WGW&ã°¢6öç7BÆö6Ä–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb†Æö6Ä–æFW‚“°¢6öç7BÆö6ÅÆ–W"Ò7FFRçÆ–W'5¶Æö6Ä–æFW…Ó°¢6öç7B÷öæVçEÆ–W"Ò7FFRçÆ–W'5¶÷öæVçD–æFW…Ó°¢6öç7Bf—6–&ÆU6WG2ÒÖö&–ÆU6WE66÷&U7FFR†Æö6Ä–æFW‚¢æf–ÇFW"‚‡6WB’Óâ6WBçÆ–W"ÒçVÆÂbb6WBæ÷öæVçBÒçVÆÂ“°¢6öç7BÆö6Å÷vW"ÒçVÖ&W"†Æö6ÅÆ–W#òç÷vW"ÇÂ“°¢6öç7B÷öæVçE÷vW"ÒçVÖ&W"†÷öæVçEÆ–W#òç÷vW"ÇÂ“°¢6öç7B&ö¦V7FVE÷vW'2Ò7FFRçÆ–W'2æÖ‚‡Æ–W"’ÓâçVÖ&W"‡Æ–W#òç÷vW"ÇÂ’²&ö¦V7FVDVæD&öçW6W2‡Æ–W"’“°¢–b‚7FFRævÖT÷fW"bb7FFRæÖæFF÷'•Æ6VÖVçBbb†5Æ–VEF†—5GW&â‡7FFRæ7F—fUÆ–W"’’°¢6öç7B76–æuÆ–W"Ò7FFRçÆ–W'5·7FFRæ7F—fUÆ–W%Ó°¢6öç7B75v–ææW$6æF–FFRÒ÷öæVçDöb‡7FFRæ7F—fUÆ–W"“°¢6öç7B74&öçW2ÒÖF‚æÖ‚ƒ"ÂçVÖ&W"‡76–æuÆ–W#òæVæGW&æ6RÇÂ’“°¢6öç7B&÷6&öçW2Ò7FFRçÆ–W'5·75v–ææW$6æF–FFUÓòæ6†&7FW$–BÓÓÒ'&÷6&VæfVçFR ¢òçVÖ&W"‡7FFRçÆ–W'5·75v–ææW$6æF–FFUÓòç&÷675÷vW$&öçW2ÇÂ¢¢°¢&ö¦V7FVE÷vW'5·75v–ææW$6æF–FFUÒ³Ò74&öçW2²&÷6&öçW3°¢Ð¢6öç7B&ö¦V7FVDÆVFW"Ò7FFRæÖæFF÷'•Æ6VÖVçBbb7FFRævÖT÷fW ¢ò÷öæVçDöb‡7FFRæ7F—fUÆ–W"¢¢&ö¦V7FVE÷vW'5³Òâ&ö¦V7FVE÷vW'5³Ð¢ò ¢¢&ö¦V7FVE÷vW'5³Òâ&ö¦V7FVE÷vW'5³Ð¢ò¢¢7FFRç6W'fW#°¢6öç7B6öç7G&–çEFöæRÒ7FFRæÖæFF÷'•Æ6VÖVçE&V6öâÓÓÒ&&ö÷7B ¢ò&&ö÷7B ¢¢&ö¦V7FVDÆVFW"ÓÓÒÆö6Ä–æFW‚ò'Æ–W""¢&÷öæVçB#°¢6öç7BÆ–W$fF"Ò‡Æ–W$–æFW‚ÂÆ–W"Â6–FR’Óâ°¢6öç7B'Gv÷&²Ò$ôd”ÄUô4„$5DU%ô”ÔtU5·Æ–W#òæ6†&7FW$–EÐ¢ÇÂ4„$5DU%ô”ÔtU5·Æ–W#òæ6†&7FW$–EÓòå³Ð¢ÇÂ$ôd”ÄUô4„$5DU%ô”ÔtU2æ6ö6„§S°¢6öç7B—47F—fRÒ7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW‚bb7FFRævÖT÷fW#°¢&WGW&â ¢ÆF—b6Æ73Ò&FW6·F÷×66÷&RÖfF"FW6·F÷×66÷&RÖfF"ÒÒG·6–FWÒ"&–ÖÆ&VÃÒ"G¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—ÒG¶—47F—fRò"Â:¦÷VW""¢"'Ò#à¢Æ–Ör7&3Ò"G¶W66T‡FÖÂ†'Gv÷&²ÇÂ""—Ò"ÇCÒ""óà¢G·7FFRç6W'fW"ÓÓÒÆ–W$–æFW‚òsÇ7â6Æ73Ò&Öö&–ÆR×6W'fW"FW6·F÷×66÷&R×6W'fW""&–ÖÆ&VÃÒ$R6W'f–6R#î)xóÂ÷7ãâr¢"'Ð¢ÂöF—cà¢°¢Ó°¢VÇ2æFW6·F÷ÖF6…66÷&Ræ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"ÂÆö6ÅÆ–W"ÇÂ÷öæVçEÆ–W"“°¢VÇ2æFW6·F÷ÖF6…66÷&Ræ–ææW$…DÔÂÒÆö6ÅÆ–W"bb÷öæVçEÆ–W"ò ¢ÆF—b6Æ73Ò&FW6·F÷×66÷&RÖÖF6‚Ö6öÇVÖâ#à¢ÆöÂ6Æ73Ò&FW6·F÷ÖÖF6‚×66÷&RÖÆ—7B"&–ÖÆ&VÃÒ%66÷&RGRÖF6‚#à¢G·f—6–&ÆU6WG2æÖ‚‡6WBÂ–æFW‚’Óâ°¢6öç7Bv–ææW$6Æ72Ò6WBçv–ææW"ÓÓÒ%Ä”U" ¢ò"FW6·F÷×6WB×66÷&RÒ×Æ–W" ¢¢6WBçv–ææW"ÓÓÒ$õôäTåB ¢ò"FW6·F÷×6WB×66÷&RÒÖ÷öæVçB ¢¢"#°¢6öç7Bv–ææW$Æ&VÂÒ6WBçv–ææW"ÓÓÒ%Ä”U" ¢ò"Â6WB&V×÷'L:’"f÷W2 ¢¢6WBçv–ææW"ÓÓÒ$õôäTåB ¢ò"Â6WB&V×÷'L:’"Î(	–GfW'6—&R ¢¢"#°¢&WGW&â ¢ÆÆ’6Æ73Ò&FW6·F÷×6WB×66÷&RG·v–ææW$6Æ77Ò"&–ÖÆ&VÃÒ%6WBG¶–æFW‚²Ò¢G·6WBçÆ–W'Ò:G·6WBæ÷öæVçGÒG·v–ææW$Æ&VÇÒ#à¢Ç7ãâG·6WBçÆ–W'ÓÂ÷7ããÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÇ7ãâG·6WBæ÷öæVçGÓÂ÷7ãà¢ÂöÆ“à¢°¢Ò’æ¦ö–â‚""—Ð¢ÂööÃà¢ÂöF—cà¢ÆF—b6Æ73Ò&FW6·F÷ÖW†6†ævR×66÷&RÖÆ–æR#à¢G·Æ–W$fF"†Æö6Ä–æFW‚ÂÆö6ÅÆ–W"Â'Æ–W""—Ð¢ÆF—b6Æ73Ò&FW6·F÷ÖÆ—fR×÷vW"×66÷&RFW6·F÷ÖÆ—fR×÷vW"×66÷&RÒÒG¶6öç7G&–çEFöæWÒ"&–ÖÆ&VÃÒ%66÷&RFRV—76æ6R¢G¶Æö6Å÷vW'Ò:G¶÷öæVçE÷vW'Ò#à¢Ç7â6Æ73Ò&FW6·F÷×66÷&R×GW&âÖF÷BFW6·F÷×66÷&R×GW&âÖF÷BÒ×Æ–W"G·7FFRæ7F—fUÆ–W"ÓÓÒÆö6Ä–æFW‚bb7FFRævÖT÷fW"ò"—2Ö7F—fR"¢"'Ò"&–Ö†–FFVãÒ'G'VR#î)xóÂ÷7ãà¢Ç7G&öæsâG¶Æö6Å÷vW'ÓÂ÷7G&öæsãÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÇ7G&öæsâG¶÷öæVçE÷vW'ÓÂ÷7G&öæsà¢Ç7â6Æ73Ò&FW6·F÷×66÷&R×GW&âÖF÷BFW6·F÷×66÷&R×GW&âÖF÷BÒÖ÷öæVçBG·7FFRæ7F—fUÆ–W"ÓÓÒ÷öæVçD–æFW‚bb7FFRævÖT÷fW"ò"—2Ö7F—fR"¢"'Ò"&–Ö†–FFVãÒ'G'VR#î)xóÂ÷7ãà¢ÂöF—cà¢G·Æ–W$fF"†÷öæVçD–æFW‚Â÷öæVçEÆ–W"Â&÷öæVçB"—Ð¢ÂöF—cà¢Ç7â6Æ73Ò&FW6·F÷×66÷&RÖ&Ææ6R"&–Ö†–FFVãÒ'G'VR#ãÂ÷7ãà¢¢"#°§Ð ¦gVæ7F–öâ&VæFW$6VçFW$æW‡DW†6†ævT'WGFöâ‚’°¢–b‚7FFRç6WDÖF6‚æVæ&ÆVBÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚ç6WD÷fW"ÇÂ7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&â"#°¢–b…TÅD”ÔDUôÔôDRæ7F—fR’°¢&WGW&âsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâVÇF–ÖFR×÷7BÖW†6†ævR×7F'B"G—SÒ&'WGFöâ"FF×7F'B×VÇF–ÖFR×÷7BÖW†6†ævSä4ôåD”åTU#Âö'WGFöãâs°¢Ð¢&WGW&âÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖæW‡B×6WBÖW†6†ævSì8–6†ævR7V—fçCÂö'WGFöãæ°§Ð ¦gVæ7F–öâ&VæFW$6VçFW$æW‡E6öÆôW†6†ævT'WGFöâ‚’°¢–b‚4ôÄõô’æVæ&ÆVBÇÂ4U%dU%õ5”ä2æVæ&ÆVBÇÂ7FFRç6WDÖF6‚æVæ&ÆVBÇÂ7FFRævÖT÷fW"’&WGW&â"#°¢&WGW&âsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖæW‡B×6öÆòÖW†6†ævSì8–6†ævR7V—fçCÂö'WGFöãâs°§Ð ¦gVæ7F–öâ&VæFW$6VçFW$æW‡E6WD'WGFöâ‚’°¢–b‡7FFRçF÷W&æÖVçBæg&–VæFÇ’bb„e$”TäDÅ•õDõU$äÔTåBæv—F–æt6ÇV$†÷W6U&WGW&âÇÂ‡7FFRævÖT÷fW"bb7FFRç6WDÖF6‚æÖF6„÷fW"’’’°¢&WGW&âsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FF×&WGW&âÖ6ÇV"Ö†÷W6Så$UDõU$äU"R4ÅT"„õU4SÂö'WGFöãâs°¢Ð¢–b†—4‡VÖåF÷W&æÖVçE'Vä÷fW"‚’’°¢&WGW&âsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖW†—B×F÷W&æÖVçCå4õ%D•"DRÄ4ôÕ8•D•D”ôãÂö'WGFöããÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6ö×WF—F–öâ×7VÖÖ'“å,8•5TÜ8’4ôÕ8•D•D”ôãÂö'WGFöãâs°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—bb7FFRævÖT÷fW"bb7FFRç6WDÖF6‚æÖF6„÷fW"bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ&6†×–öç6†—Æö&'’"’°¢&WGW&âsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FF×&WGW&âÖ6†×–öç6†—ÖÆö&'“å&WF÷W"R6ÇV"†÷W6SÂö'WGFöãâs°¢Ð¢–b‡7FFRçF÷W&æÖVçBæ7F—fRbb7FFRævÖT÷fW"bb7FFRç6WDÖF6‚æÖF6„÷fW"’°¢–b‡7FFRçF÷W&æÖVçBæg&–VæFÇ’bb7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”æW‡B"’°¢&WGW&â"#°¢Ð¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”æW‡B"’°¢&WGW&â7FFRçF÷W&æÖVçBæ6†×–öç6†— ¢òsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FF×7F'B×F÷W&æÖVçBÖæW‡BÖÖF6ƒäÔD4‚5T•dåCÂö'WGFöããÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FF×&WGW&âÖ6†×–öç6†—ÖÆö&'“å&WF÷W"R6ÇV"†÷W6SÂö'WGFöãâp¢¢sÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FF×7F'B×F÷W&æÖVçBÖæW‡BÖÖF6ƒäÔD4‚5T•dåCÂö'WGFöãâs°¢Ð¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG•6VÖ’"’°¢&WGW&âsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FF×7F'B×F÷W&æÖVçBÖæW‡BÖÖF6ƒäDTÔ’Ôd”äÄSÂö'WGFöãâs°¢Ð¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”f–æÂ"’°¢&WGW&âsÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FF×7F'B×F÷W&æÖVçBÖæW‡BÖÖF6ƒäd”äÄSÂö'WGFöãâs°¢Ð¢Ð¢–b‚7FFRç6WDÖF6‚æVæ&ÆVBÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚ç6WD÷fW"ÇÂ7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&â"#°¢6öç7BÆ&VÂÒ%6WB7V—fçB#°¢&WGW&âÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâæW‡BÖW†6†ævRÖ'WGFöâæW‡B×6WBÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖæW‡BÖgVÆÂ×6WCâG¶Æ&VÇÓÂö'WGFöãæ°§Ð ¦gVæ7F–öâ—4‡VÖåF÷W&æÖVçE'Vä÷fW"‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fRÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&âfÇ6S°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÓÓÒ‡VÖâ’&WGW&âG'VS°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÒ&6ö×ÆWFR"’&WGW&âfÇ6S°¢6öç7BÆ–VD‡VÖäÖF6†W2Ò7FFRçF÷W&æÖVçBæÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç66÷&Rbb†ÖF6‚çÆ–W$ÓÓÒ‡VÖâÇÂÖF6‚çÆ–W$"ÓÓÒ‡VÖâ’“°¢6öç7BÆ7BÒÆ–VD‡VÖäÖF6†W2æB‚Ó“°¢&WGW&â&ööÆVâ†Æ7BbbÆ7Bçv–ææW"ÓÒ‡VÖâ“°§Ð ¦gVæ7F–öâ&VæFW%&öw&W76–öä'WGFöç2‚’°¢&WGW&â°¢&VæFW$6VçFW$æW‡E6öÆôW†6†ævT'WGFöâ‚’À¢&VæFW$6VçFW$æW‡DW†6†ævT'WGFöâ‚’À¢&VæFW$6VçFW$æW‡E6WD'WGFöâ‚’À¢Òæf–ÇFW"„&ööÆVâ’æ¦ö–â‚""“°§Ð ¦gVæ7F–öâ&–æE&öw&W76–öä'WGFöç2‡&ö÷B’°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FF×7F'B×VÇF–ÖFR×÷7BÖW†6†ævUÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢–b‚TÅD”ÔDUôÔôDRæ7F—fRÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6‚ç6WD÷fW"ÇÂ7FFRç6WDÖF6‚æÖF6„÷fW"’&WGW&ã°¢–b‚TÅD”ÔDUôÔôDRç÷7DW†6†ævR’&Vv–åVÇF–ÖFU÷7DW†6†ævR‡7FFRç&W7VÇD–æfóòçv–ææW"óò“°¢VÇ6R&VæFW%VÇF–ÖFU÷7DW†6†ævT6†ö–6R‚“°¢Ò“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FFÖæW‡B×6WBÖW†6†ævUÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂæW‡E6WDW†6†ævR“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FFÖæW‡B×6öÆòÖW†6†ævUÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂæW‡E6öÆôW†6†ævR“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FFÖæW‡BÖgVÆÂ×6WEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂæW‡DgVÆÅ6WB“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FF×7F'B×F÷W&æÖVçBÖæW‡BÖÖF6…Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7F'EF÷W&æÖVçDæW‡DÖF6„g&öÔ6VçFW"“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FFÖW†—B×F÷W&æÖVçEÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂW†—EF÷W&æÖVçEFôÆö&'’“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FF×&WGW&âÖ6ÇV"Ö†÷W6UÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&WGW&äg&–VæFÇ”ÖF6…Fô6ÇV$†÷W6R“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FF×&WGW&âÖ6†×–öç6†—ÖÆö&'•Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&WGW&ä6†×–öç6†—Æö&'’“°¢&ö÷CòçVW'•6VÆV7F÷"‚%¶FFÖ6ö×WF—F–öâ×7VÖÖ'•Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷t6ö×WF—F–öå7VÖÖ'•67&VVâ“°§Ð ¦gVæ7F–öâ6ö×WF—F–öå7VÖÖ'”f–Æ&ÆR‚’°¢–b‡7FFRçF÷W&æÖVçCòæg&–VæFÇ’’&WGW&âfÇ6S°¢–b‚7FFRçF÷W&æÖVçCòæ7F—fRÇÂ7FFRævÖT÷fW"ÇÂ7FFRç6WDÖF6ƒòæÖF6„÷fW"’&WGW&âfÇ6S°¢6öç7B‡VÖâÒ‡VÖåF÷W&æÖVçDVçG'’‚“°¢6öç7B‡VÖäÖF6†W2Ò‡7FFRçF÷W&æÖVçBæÖF6†W2ÇÂµÒ’æf–ÇFW"‚†ÖF6‚’Óâ€¢ÖF6‚çv–ææW"bb†ÖF6‚çÆ–W$ÓÓÒ‡VÖâÇÂÖF6‚çÆ–W$"ÓÓÒ‡VÖâ¢’“°¢6öç7BÆ7BÒ‡VÖäÖF6†W2æB‚Ó“°¢–b‚Æ7B’&WGW&âfÇ6S°¢&WGW&âÆ7Bçv–ææW"ÓÒ‡VÖâÇÂÆ7Bç&÷VæBÓÓÒ&f–æÂ"ÇÂ7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÓÓÒ‡VÖã°§Ð ¦gVæ7F–öâ&Vg&W6„6ö×WF—F–öå7VÖÖ'•6Æ÷G2‚’°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’°¢&Vg&W6„6†×–öç6†—6Æ÷G2‚“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBæÆVwVR’°¢&Vg&W6„ÆVwVT¶æö6¶÷WE6Æ÷G2‚“°¢&WGW&ã°¢Ð¢6öç7Bv–ææW"Ò†–B’ÓâF÷W&æÖVçDÖF6„'”–B†–B“òçv–ææW"ÇÂçVÆÃ°¢6öç7B76–vâÒ†–BÂÂ"’Óâ°¢6öç7BÖF6‚ÒF÷W&æÖVçDÖF6„'”–B†–B“°¢–b†ÖF6‚bb†ÇÂ"’’6WDÖF6…Æ–W'2†ÖF6‚ÂÂ"“°¢Ó°¢76–vâ‚'c"Âv–ææW"‚'#eó"’Âv–ææW"‚'#eó""’“°¢76–vâ‚'c""Âv–ææW"‚'#eó2"’Âv–ææW"‚'#eóB"’“°¢76–vâ‚'c2"Âv–ææW"‚'#eóR"’Âv–ææW"‚'#eób"’“°¢76–vâ‚'cB"Âv–ææW"‚'#eór"’Âv–ææW"‚'#eó‚"’“°¢76–vâ‚'6VÖ“"Âv–ææW"‚'c"’Âv–ææW"‚'c""’“°¢76–vâ‚'6VÖ“""Âv–ææW"‚'c2"’Âv–ææW"‚'cB"’“°¢76–vâ‚'6VÖ”‡VÖâ"Âv–ææW"‚'d‡VÖâ"’Âv–ææW"‚'d“"’“°¢76–vâ‚'6VÖ”’"Âv–ææW"‚'d“""’Âv–ææW"‚'d“2"’“°¢76–vâ‚&f–æÂ"Âv–ææW"‚'6VÖ“"’ÇÂv–ææW"‚'6VÖ”‡VÖâ"’Âv–ææW"‚'6VÖ“""’ÇÂv–ææW"‚'6VÖ”’"’“°§Ð ¦gVæ7F–öâ6ö×ÆWFT6ö×WF—F–öäf÷%7VÖÖ'’‚’°¢ÆWBwV&BÒ°¢v†–ÆR†wV&BÂ3’°¢wV&B³Ò°¢&Vg&W6„6ö×WF—F–öå7VÖÖ'•6Æ÷G2‚“°¢6öç7BVæF–ærÒ‡7FFRçF÷W&æÖVçBæÖF6†W2ÇÂµÒ’æf–æB‚†ÖF6‚’Óâ€¢ÖF6‚çv–ææW"bbÖF6‚çÆ–W$bbÖF6‚çÆ–W$ ¢bb—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$¢bb—4‡VÖåF÷W&æÖVçDVçG'’†ÖF6‚çÆ–W$"¢’“°¢–b‚VæF–ær’'&V³°¢6öç7B&W7VÇBÒ6–×VÆFT•F÷W&æÖVçDÖF6‚‡VæF–ærçÆ–W$ÂVæF–ærçÆ–W$"ÂçVÖ&W"‡7FFRçF÷W&æÖVçBçF&vWE6WG2ÇÂ"’“°¢VæF–ærçv–ææW"Ò&W7VÇBçv–ææW#°¢VæF–æræ†–FFVåv–ææW"Ò&W7VÇBçv–ææW#°¢VæF–æræ†–FFVå6WE66÷&W2Ò&W7VÇBç6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢VæF–ærç&WfVÆVE6WE66÷&W2Ò&W7VÇBç6WE66÷&W2æÖ‚‡66÷&R’Óâ²ââç66÷&UÒ“°¢VæF–ærç66÷&RÒ&W7VÇBç66÷&S°¢VæF–æræÆ—fU66÷&RÒçVÆÃ°¢Ð¢&Vg&W6„6ö×WF—F–öå7VÖÖ'•6Æ÷G2‚“°¢6öç7Bf–æÂÒF÷W&æÖVçDÖF6„'”–B‚&f–æÂ"“°¢–b†f–æÃòçv–ææW"’°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒf–æÂçv–ææW#°¢7FFRçF÷W&æÖVçBç7FvRÒ&6ö×ÆWFR#°¢ÒVÇ6R–b‚7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–B’°¢6öç7BÆ7Df–æÂÒ²âââ‡7FFRçF÷W&æÖVçBæÖF6†W2ÇÂµÒ•Òç&WfW'6R‚’æf–æB‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ&f–æÂ"bbÖF6‚çv–ææW"“°¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–BÒÆ7Df–æÃòçv–ææW"ÇÂçVÆÃ°¢Ð§Ð ¦gVæ7F–öâ6ö×WF—F–öå7VÖÖ'”f÷&ÖDÆ&VÂ‚’°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDÖ7FW"’&WGW&â#ö–çBÖ7FW"#°¢–b‡7FFRçF÷W&æÖVçBæöæUö–çDvÖRÇÂ7FFRçF÷W&æÖVçBæg&–VæFÇ”f÷&ÖBÓÓÒ&öæWö–çB"’&WGW&â#ö–çBvÖR#°¢–b‡7FFRçF÷W&æÖVçBæ6†×–öç6†—’&WGW&â$6†×–öææB#°¢–b‡7FFRçF÷W&æÖVçBæÆVwVR’&WGW&â$ÆVwVR#°¢&WGW&â%F÷W&æö’::–Æ–Ö–æF–öâF—&V7FR#°§Ð ¦gVæ7F–öâ&VæFW$6ö×WF—F–öå7VÖÖ'’‚’°¢–b‚VÇ2æ6ö×WF—F–öå7VÖÖ'”6öçFVçB’&WGW&ã°¢6öç7B6†×–öâÒ7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–C°¢6öç7B6†×–öä–BÒ6†×–öâòF÷W&æÖVçDVçG'”6†&7FW$–B†6†×–öâ’¢çVÆÃ°¢6öç7B6†×–öä–ÖvRÒ6†×–öä–@¢òÔD4…õ$U5TÅEô”ÔtU5¶6†×–öä–EÓòçv–âÇÂ$ôd”ÄUô4„$5DU%ô”ÔtU5¶6†×–öä–EÒÇÂ4„$5DU%ô”ÔtU5¶6†×–öä–EÓòå³Ð¢¢çVÆÃ°¢6öç7BÖF6†W2Ò‡7FFRçF÷W&æÖVçBæÖF6†W2ÇÂµÒ’æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚çÆ–W$ÇÂÖF6‚çÆ–W$"“°¢6öç7B&÷VæD÷&FW"Ò²&w&÷W"Â&F“"Â&w&÷W""Â&F“""Â&w&÷W2"Â&F“2"Â'&÷VæCb"Â'VÆ–b"Â'V'FW""Â'6VÖ’"Â&f–æÂ%Ó°¢6öç7B&÷VæG2Ò²ââææWr6WB†ÖF6†W2æÖ‚†ÖF6‚’ÓâÖF6‚ç&÷VæB’•Òç6÷'B‚†Â"’Óâ€¢&÷VæD÷&FW"æ–æFW„öb†’Ò&÷VæD÷&FW"æ–æFW„öb†"¢’“°¢6öç7B'F–6—çD6÷VçBÒæWr6WB†ÖF6†W2æfÆDÖ‚†ÖF6‚’Óâ¶ÖF6‚çÆ–W$ÂÖF6‚çÆ–W$%Ò’æf–ÇFW"„&ööÆVâ’’ç6—¦S°¢VÇ2æ6ö×WF—F–öå7VÖÖ'”6öçFVçBæ–ææW$…DÔÂÒ ¢Æ†VFW"6Æ73Ò&6ö×WF—F–öâ×7VÖÖ'’Ö†W&ò#à¢Ç6Æ73Ò&Æ&VÂ#å,:—7VÜ:’6ö×:—F—F–öãÂ÷à¢ÆƒâG¶W66T‡FÖÂ‡7FFRçF÷W&æÖVçBæ6ö×WF—F–öäæÖRÇÂ6ö×WF—F–öå7VÖÖ'”f÷&ÖDÆ&VÂ‚’—ÓÂöƒà¢ÆF—b6Æ73Ò&6ö×WF—F–öâ×7VÖÖ'’ÖÖWF#à¢Ç7ãâG¶W66T‡FÖÂ†6ö×WF—F–öå7VÖÖ'”f÷&ÖDÆ&VÂ‚’—ÓÂ÷7ãà¢Ç7ãâG·'F–6—çD6÷VçGÒ'F–6—çG3Â÷7ãà¢Ç7ãä”G¶W66T‡FÖÂ‡F÷W&æÖVçDF–ff–7VÇG”Æ&VÂ‡7FFRçF÷W&æÖVçBæF–ff–7VÇG’’—ÓÂ÷7ãà¢G·7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6TÆ&VÂòÇ7ãâG¶W66T‡FÖÂ‡7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6TÆ&VÂ—ÓÂ÷7ãæ¢"'Ð¢ÂöF—cà¢Âö†VFW#à¢Ç6V7F–öâ6Æ73Ò&6ö×WF—F–öâ×7VÖÖ'’×v–ææW"#à¢G¶6†×–öä–ÖvRòÆ–Ör7&3Ò"G¶W66T‡FÖÂ†6†×–öä–ÖvR—Ò"ÇCÒ"G¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ†6†×–öâ’—Ò"óæ¢"'Ð¢ÆF—cãÇ7ãåf–çVWW"FRÆ6ö×:—F—F–öãÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ‡F÷W&æÖVçEÆ–W$Æ&VÂ†6†×–öâ’ÇÂ,8L:—FW&Ö–æW""—ÓÂ÷7G&öæsãÂöF—cà¢Â÷6V7F–öãà¢Ç6V7F–öâ6Æ73Ò&6ö×WF—F–öâ×7VÖÖ'’Ö'&6¶WB#à¢ÆF—b6Æ73Ò&6ÇV&†÷W6R×6V7F–öâÖ†VF–ær#ãÆF—cãÇ6Æ73Ò&Æ&VÂ#å,:—7VÇFG26ö×ÆWG3Â÷ãÆƒ#åF&ÆVRFRÆ6ö×:—F—F–öãÂöƒ#ãÂöF—cãÂöF—cà¢ÆF—b6Æ73Ò&6ö×WF—F–öâ×7VÖÖ'’×&÷VæG2#à¢G·&÷VæG2æÖ‚‡&÷VæB’Óâ ¢ÆF—b6Æ73Ò&6ö×WF—F–öâ×7VÖÖ'’×&÷VæB#à¢Æƒ3âG¶W66T‡FÖÂ†ÖF6†W2æf–æB‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ&÷VæB“òæÆ&VÃòç&WÆ6R‚õÇ2µÆB²BòÂ""’ÇÂ&÷VæB—ÓÂöƒ3à¢G¶ÖF6†W2æf–ÇFW"‚†ÖF6‚’ÓâÖF6‚ç&÷VæBÓÓÒ&÷VæB’æÖ‚†ÖF6‚’Óâ&VæFW%F÷W&æÖVçDÖF6‚†ÖF6‚Â&÷VæBÓÓÒ&f–æÂ"’’æ¦ö–â‚""—Ð¢ÂöF—cà¢’æ¦ö–â‚""—Ð¢ÂöF—cà¢Â÷6V7F–öãà¢Æ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâ6ö×WF—F–öâ×7VÖÖ'’Öf–æ—6‚"G—SÒ&'WGFöâ"FFÖf–æ—6‚Ö6ö×WF—F–öãåDU$Ô”äU"Ä4ôÕ8•D•D”ôãÂö'WGFöãà¢°¢VÇ2æ6ö×WF—F–öå7VÖÖ'”6öçFVçBçVW'•6VÆV7F÷"‚%¶FFÖf–æ—6‚Ö6ö×WF—F–öåÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Âf–æ—6„6ö×WF—F–öå7VÖÖ'’“°§Ð ¦gVæ7F–öâ6†÷t6ö×WF—F–öå7VÖÖ'•67&VVâ‚’°¢–b‚6ö×WF—F–öå7VÖÖ'”f–Æ&ÆR‚’’&WGW&ã°¢7F÷6öÆõF–ÖW'2‚“°¢6ö×ÆWFT6ö×WF—F–öäf÷%7VÖÖ'’‚“°¢VÇ2ç&W7VÇEæVÃòæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢VÇ2æÖVçU67&VVãòæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢†–FU7FæFÆöæU67&VVç2‚“°¢†–FTvÖU67&VVâ‚“°¢VÇ2æ6ö×WF—F–öå7VÖÖ'•67&VVãòæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢&VæFW$6ö×WF—F–öå7VÖÖ'’‚“°¢v–æF÷rç67&öÆÅFò‡²F÷¢Â&V†f–÷#¢&WFò"Ò“°§Ð ¦7–æ2gVæ7F–öâf–æ—6„6ö×WF—F–öå7VÖÖ'’‚’°¢G'’°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’°¢v—B&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°¢v—BFVÆWFUF÷W&æÖVçE&öw&W72‚“°¢Ð¢Ò6F6‚†W'&÷"’°¢6öç6öÆRçv&â‚$Æ6Ì;GGW&RFRÆ6ö×:—F—F–öâî(	–2R:§G&R7–æ6‡&öæ—<:–Râ"ÂW'&÷"“°¢Ð¢–b„e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVB’&W6WDg&–VæFÇ•F÷W&æÖVçD6öææV7F–öâ‚“°¢&W6WEF÷W&æÖVçB‚“°¢6†÷tÖVçU67&VVâ‚“°§Ð ¦gVæ7F–öâ&WGW&ä6†×–öç6†—Æö&'’‚’°¢–b‚7FFRçF÷W&æÖVçBæ6†×–öç6†—’&WGW&ã°¢VÇ2ç&W7VÇEæVÃòæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢7F÷6öÆõF–ÖW'2‚“°¢6†÷t6†×–öç6†—Æö&'•67&VVâ‚“°§Ð ¦gVæ7F–öâ&–æD6VçFW$'WGFöç2‚’°¢&–æE&öw&W76–öä'WGFöç2†VÇ2æ6VçFW%Æ–VD6&B“°§Ð ¦gVæ7F–öâ&–æE&W7VÇEF÷W&æÖVçD'WGFöâ‚’°¢&–æE&ÆÇ”VæD7F–öç2†VÇ2ç&W7VÇEæVÂ“°§Ð ¦7–æ2gVæ7F–öâ&WGW&äg&–VæFÇ”ÖF6…Fô6ÇV$†÷W6R‚’°¢–b‚e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVB’&WGW&ã°¢6öç7BF÷W&æÖVçD–BÒe$”TäDÅ•õDõU$äÔTåBæ–C°¢6öç7B'F–6—çD–BÒe$”TäDÅ•õDõU$äÔTåBç'F–6—çD–C°¢6öç7BFö¶VâÒe$”TäDÅ•õDõU$äÔTåBçFö¶Vã°¢e$”TäDÅ•õDõU$äÔTåBæv—F–æt6ÇV$†÷W6U&WGW&âÒfÇ6S°¢e$”TäDÅ•õDõU$äÔTåBæ–äÖF6‚ÒfÇ6S°¢e$”TäDÅ•õDõU$äÔTåBæ7W'&VçDÖF6„–BÒçVÆÃ°¢v–æF÷ræ6ÆV$–çFW'fÂ„e$”TäDÅ•õDõU$äÔTåBç7G&VÕF–ÖW"“°¢–b…4U%dU%õ5”ä2æg&–VæFÇ”ÖF6‚’ÆVfTöæÆ–æU&ööÒ‚“°¢4ôÄõô’æVæ&ÆVBÒfÇ6S°¢7F÷6öÆõF–ÖW'2‚“°¢6†÷tg&–VæFÇ”Æö&'•67&VVâ‚“°¢&VæFW$g&–VæFÇ”Æö&'•67&VVâ‚“°¢–b‡F÷W&æÖVçD–Bbb'F–6—çD–BbbFö¶Vâ’°¢G'’°¢6öç7B&W7öç6RÒv—BfWF6‚†ö’ög&–VæFÇ’×F÷W&æÖVçG2òG¶Væ6öFUU$”6ö×öæVçB‡F÷W&æÖVçD–B—Òö6ÇV&†÷W6R×&WGW&æÂ°¢ÖWF†öC¢%õ5B"À¢†VFW'3¢²$6öçFVçBÕG—R#¢&Æ–6F–öâö§6öâ"ÒÀ¢&öG“¢¥4ôâç7G&–æv–g’‡²'F–6—çD–BÂFö¶VâÒ’À¢Ò“°¢6öç7B–ÆöBÒv—B&W7öç6Ræ§6öâ‚“°¢–b‡&W7öç6Ræö²bb–ÆöBçF÷W&æÖVçB’°¢Ç”g&–VæFÇ•F÷W&æÖVçE7FFR‡–ÆöBçF÷W&æÖVçBÂçVÆÂ“°¢&VæFW$g&–VæFÇ”Æö&'•67&VVâ‚“°¢Ð¢Ò6F6‚†W'&÷"’°¢6öç6öÆRçv&â‚%&WF÷W"6ÇV"†÷W6Ræöâ7–æ6‡&öæ—<:’"ÂW'&÷"“°¢Ð¢Ð¢öÆÄg&–VæFÇ•F÷W&æÖVçB‚“°§Ð ¦gVæ7F–öâ7F'EF÷W&æÖVçDæW‡DÖF6„g&öÔ6VçFW"‚’°¢–b‚7FFRçF÷W&æÖVçBæ7F—fR’&WGW&ã°¢–b‡7FFRçF÷W&æÖVçBæg&–VæFÇ’’°¢&WGW&ã°¢Ð¢VÇ2ç&W7VÇEæVÃòæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”æW‡B"ÇÂ7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG•6VÖ’"’°¢66†VGVÆU6öÆõF÷W&æÖVçDÖF6‚‡7F'EF÷W&æÖVçE6VÖ’“°¢&WGW&ã°¢Ð¢–b‡7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”f–æÂ"’°¢66†VGVÆU6öÆõF÷W&æÖVçDÖF6‚‡7F'EF÷W&æÖVçDf–æÂ“°¢Ð§Ð ¦7–æ2gVæ7F–öâW†—EF÷W&æÖVçEFôÆö&'’‚’°¢6öç7Bf–æÆUv5f—6–&ÆRÒ&ööÆVâ†VÇ2ç&W7VÇEæVÂbbVÇ2ç&W7VÇEæVÂæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’“°¢–b†f–æÆUv5f—6–&ÆR’VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7BæFB‚&†–FFVâ"“°¢6öç7B6öæf—&ÖVBÒv—B6†÷tWfVçD6öæf—&ÔF–Æör‡°¢¶–6¶W#¢7FFRçF÷W&æÖVçCòæ6ö×WF—F–öäæÖRÇÂ$6ö×:—F—F–öâ"À¢F—FÆS¢%V—GFW"ÆRF÷W&æö’ò"À¢ÖW76vS¢%f÷G&R&öw&W76–öâ6W&6öç6W'l:–RÆ÷'7VR6Rf÷&ÖBÆRW&ÖWBÂV—2f÷W2&Wf–VæG&W¢:Î(	–67VV–Ââ"À¢6öæf—&ÔÆ&VÃ¢%&WF÷W"67VV–Â"À¢Ò“°¢–b‚6öæf—&ÖVB’°¢–b†f–æÆUv5f—6–&ÆR’VÇ2ç&W7VÇEæVÂæ6Æ74Æ—7Bç&VÖ÷fR‚&†–FFVâ"“°¢&WGW&ã°¢Ð¢G'’°¢–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’bb7FFRçF÷W&æÖVçBç7FvRÓÒ&6ö×ÆWFR"’°¢v—B6fUF÷W&æÖVçE&öw&W72‚“°¢ÒVÇ6R–b‡7FFRçF÷W&æÖVçBçvVV¶Ç’’°¢v—B&V6÷&EvVV¶Ç”6ö×WF—F–öå&W7VÇB‚“°¢v—BFVÆWFUF÷W&æÖVçE&öw&W72‚“°¢Ð¢Ò6F6‚†W'&÷"’°¢6öç6öÆRçv&â‚$ÆW'6—7Fæ6RFR6÷'F–RGRF÷W&æö’:–6†÷\:’Â&WF÷W":Î(	–67VV–ÂÖ–çFVçRâ"ÂW'&÷"“°¢Ð¢&W6WEF÷W&æÖVçB‚“°¢6†÷tÖVçU67&VVâ‚“°§Ð ¦gVæ7F–öâæW‡E6öÆôW†6†ævR‚’°¢–b‚4ôÄõô’æVæ&ÆVBÇÂ4U%dU%õ5”ä2æVæ&ÆVBÇÂ7FFRç6WDÖF6‚æVæ&ÆVBÇÂ7FFRævÖT÷fW"’&WGW&ã°¢–b…TÅD”ÔDUôÔôDRæ7F—fRbbTÅD”ÔDUôÔôDRç÷7DW†6†ævSòæ6ö×ÆWFVB’°¢&VæFW%VÇF–ÖFU÷7DW†6†ævT6†ö–6R‚“°¢&WGW&ã°¢Ð¢æWtvÖR‡²&W6W'fU6WC¢G'VRÒ“°¢7FFRæÆörçVç6†–gB†æ÷WfVÂ:–6†ævR6öçG&RÂt”G¶•7G–ÆTÆ&VÂ‚—Òæ“°¢&VæFW"‚“°§Ð ¦ÆWBFW6·F÷7F%&WfVÂÒçVÆÃ°¦ÆWBFW6·F÷7F%&WfVÅF–ÖW"ÒçVÆÃ°¦ÆWBFW6·F÷Æ7EÆ–VD6&D¶W’ÒçVÆÃ°¦ÆWBFW6·F÷VæF–æt6&DfÆ–v‡BÒçVÆÃ°¦ÆWBFW6·F÷Æ–VD&ö&E67&öÆÂÒ° ¦gVæ7F–öâVÇF–ÖFU6W'f–6U&WfVÄÖ&·W‚’°¢6öç7B&WfVÂÒTÅD”ÔDUôÔôDRç6W'f–6U&WfVÃ°¢–b‚&WfVÂ’&WGW&â"#°¢&WGW&â ¢ÆF—b6Æ73Ò'VÇF–ÖFR×6W'f–6R×&WfVÂÖÆ–W"#à¢Æ'F–6ÆR6Æ73Ò&FW6·F÷×Æ–VB×7F"×÷vW"VÇF–ÖFR×6W'f–6R×&WfVÂ"&öÆSÒ'7FGW2"&–ÖÆ—fSÒ&76W'F—fR#à¢Æ–Ör7&3Ò"G¶W66T‡FÖÂ‡&WfVÂæ'Gv÷&²—Ò"ÇCÒ"G¶W66T‡FÖÂ‡&WfVÂææÖR—Ò"óà¢ÆF—cãÇ7G&öæsâG¶W66T‡FÖÂ‡&WfVÂææÖRçFõWW$66R‚’—ÓÂ÷7G&öæsãÇäR4U%d”4SÂ÷ãÂöF—cà¢Âö'F–6ÆSà¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ&Vv–åVÇF–ÖFU6W'f–6U&WfVÂ‚’°¢–b‚TÅD”ÔDUôÔôDRæ7F—fRÇÂ7FFRævÖT÷fW"ÇÂ7FFRçÆ–W'3òå·7FFRç6W'fW%Ò’&WGW&ã°¢v–æF÷ræ6ÆV%F–ÖV÷WB…TÅD”ÔDUôÔôDRç6W'f–6U&WfVÅF–ÖW"“°¢6öç7B6öæf–rÒVÇF–ÖFUÆ–W$6öæf–r‡7FFRç6W'fW"“°¢6öç7BW†6†ævTçVÖ&W"ÒçVÖ&W"‡7FFRç6WDÖF6‚æW†6†ævTçVÖ&W"ÇÂ“°¢TÅD”ÔDUôÔôDRç6W'f–6U&WfVÂÒ°¢W†6†ævTçVÖ&W"À¢6W'fW#¢7FFRç6W'fW"À¢æÖS¢6öæf–sòææÖRÇÂF—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·7FFRç6W'fW%Ò’À¢'Gv÷&³¢6öæf–sòæ6†&7FW"ÇÂ""À¢Ó°¢&V6÷&EVÇF–ÖFTF–væ÷7F–2‚'VÇF–ÖFU÷6W'f–6Uöææ÷Væ6VB"Â°¢W†6†ævTçVÖ&W"À¢6W'fW#¢7FFRç6W'fW"À¢Æ–W$æÖS¢TÅD”ÔDUôÔôDRç6W'f–6U&WfVÂææÖRÀ¢Ò“°¢&VæFW$6VçFW%Æ–VD6&B‚“°¢TÅD”ÔDUôÔôDRç6W'f–6U&WfVÅF–ÖW"Òv–æF÷rç6WEF–ÖV÷WB‚‚’Óâ°¢–b…TÅD”ÔDUôÔôDRç6W'f–6U&WfVÃòæW†6†ævTçVÖ&W"ÓÒW†6†ævTçVÖ&W"’&WGW&ã°¢TÅD”ÔDUôÔôDRç6W'f–6U&WfVÂÒçVÆÃ°¢TÅD”ÔDUôÔôDRç6W'f–6U&WfVÅF–ÖW"ÒçVÆÃ°¢&VæFW"‚“°¢Vç7W&UVÇF–ÖFT‡VÖåGW&ä6öçG&öÇ2‚“°¢6V7W&UVÇF–ÖFUGW&ä6öçF–çVF–öâ†çVÆÂ“°¢–b‚7FFRævÖT÷fW"bb7FFRæ7F—fUÆ–W"ÓÓÒ4ôÄõô’çÆ–W$–æFW‚’Ö–&U'Vå6öÆô’‚“°¢ÒÂ#“°§Ð ¦gVæ7F–öâFW6·F÷Æ–VD6&D¶W’†6&B’°¢&WGW&â6&CòçÆ–VEV–BÇÂ6&CòçV–BÇÂçVÆÃ°§Ð ¦gVæ7F–öâæW‡DFW6·F÷Æ”÷&FW"‚’°¢6öç7B÷&FW'2Ò7FFRçÆ–W'0¢æfÆDÖ‚‡Æ–W"’ÓâÆ–W#òçÆ–VBÇÂµÒ¢æÖ‚†6&B’ÓâçVÖ&W"†6&BæFW6·F÷Æ”÷&FW"’¢æf–ÇFW"„çVÖ&W"æ—4f–æ—FR“°¢&WGW&â÷&FW'2æÆVæwF‚òÖF‚æÖ‚‚ââæ÷&FW'2’²¢7FFRçÆ–W'2æfÆDÖ‚‡Æ–W"’ÓâÆ–W#òçÆ–VBÇÂµÒ’æÆVæwF‚²°§Ð ¦gVæ7F–öâ6GW&TFW6·F÷6&DfÆ–v‡B‡Æ–W$–æFW‚Â6&B’°¢FW6·F÷VæF–æt6&DfÆ–v‡BÒçVÆÃ°¢–b€¢6&@¢ÇÂFö7VÖVçBæ&öG’æ6Æ74Æ—7Bæ6öçF–ç2‚&Öö&–ÆRÖvÖR×f–Wr"¢ÇÂv–æF÷ræÖF6„ÖVF–‚"‡&VfW'2×&VGV6VBÖÖ÷F–öã¢&VGV6R’"’æÖF6†W0¢’&WGW&ã°¢6öç7B&ö÷BÒVÇ2ævÖTòçVW'•6VÆV7F÷"†çÆ–W"×æVÅ¶FF×Æ–W"Ö–æFWƒÒ"G·Æ–W$–æFW‡Ò%Ö“°¢6öç7BW66VEV–BÒv–æF÷rä553òæW66Ròv–æF÷rä552æW66R…7G&–ær†6&BçV–B’’¢7G&–ær†6&BçV–B’ç&WÆ6R‚ò"örÂuÅÂ"r“°¢6öç7B†æD6&BÒ&ö÷CòçVW'•6VÆV7F÷"†¶FFÖ†æBÖ6&B×V–CÒ"G¶W66VEV–GÒ%Ö“°¢6öç7Bf—7VÂÒ†æD6&CòçVW'•6VÆV7F÷"‚"æ6&B×f—7VÂÂæ6&BÖ&6²"’ÇÂ†æD6&C°¢6öç7B&V7BÒf—7VÃòævWD&÷VæF–æt6Æ–VçE&V7B‚“°¢–b‚&V7Còçv–GF‚ÇÂ&V7Còæ†V–v‡B’&WGW&ã°¢FW6·F÷VæF–æt6&DfÆ–v‡BÒ°¢6&EV–C¢6&BçV–BÀ¢Æ–VEV–C¢çVÆÂÀ¢Æ–W$–æFW‚À¢–ÖvUW&Ã¢6&D'Gv÷&²†6&B’À¢6÷W&6U&V7C¢°¢F÷¢&V7BçF÷À¢ÆVgC¢&V7BæÆVgBÀ¢v–GFƒ¢&V7Bçv–GF‚À¢†V–v‡C¢&V7Bæ†V–v‡BÀ¢ÒÀ¢Ó°§Ð ¦gVæ7F–öâ6ö×ÆWFTFW6·F÷6&DfÆ–v‡B‡Æ–VD6&B’°¢–b‚FW6·F÷VæF–æt6&DfÆ–v‡BÇÂFW6·F÷VæF–æt6&DfÆ–v‡Bæ6&EV–BÓÒÆ–VD6&CòçV–B’&WGW&ã°¢FW6·F÷VæF–æt6&DfÆ–v‡BçÆ–VEV–BÒFW6·F÷Æ–VD6&D¶W’‡Æ–VD6&B“°§Ð ¦gVæ7F–öâ'VäFW6·F÷6&DfÆ–v‡Dæ–ÖF–öâ‚’°¢6öç7BfÆ–v‡BÒFW6·F÷VæF–æt6&DfÆ–v‡C°¢–b‚fÆ–v‡CòçÆ–VEV–BÇÂFW6·F÷7F%&WfVÃòæ6&D¶W’ÓÓÒfÆ–v‡BçÆ–VEV–B’&WGW&ã°¢6öç7BW66VEÆ–VEV–BÒv–æF÷rä553òæW66Ròv–æF÷rä552æW66R…7G&–ær†fÆ–v‡BçÆ–VEV–B’’¢7G&–ær†fÆ–v‡BçÆ–VEV–B’ç&WÆ6R‚ò"örÂuÅÂ"r“°¢6öç7BF&vWBÒVÇ2æ6VçFW%Æ–VD6&CòçVW'•6VÆV7F÷"†¶FFÖFW6·F÷×Æ–VB×F&vWCÒ"G¶W66VEÆ–VEV–GÒ%Ö“°¢6öç7BF&vWE&V7BÒF&vWCòævWD&÷VæF–æt6Æ–VçE&V7B‚“°¢–b‚F&vWE&V7Còçv–GF‚ÇÂF&vWE&V7Còæ†V–v‡B’&WGW&ã°¢FW6·F÷VæF–æt6&DfÆ–v‡BÒçVÆÃ°¢F&vWBæ6Æ74Æ—7BæFB‚&FW6·F÷×Æ–VBÖ6&BÒÖ'&—f–ær"“°¢6öç7BÖ÷f–æt6&BÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢Ö÷f–æt6&Bæ6Æ74æÖRÒFW6·F÷Ö6&BÖfÆ–v‡BFW6·F÷Ö6&BÖfÆ–v‡BÒÒG¶fÆ–v‡BçÆ–W$–æFW‚ÓÓÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚’ò'Æ–W""¢&÷öæVçB'Ö°¢Ö÷f–æt6&Bç7G–ÆRçF÷ÒG¶fÆ–v‡Bç6÷W&6U&V7BçF÷×†°¢Ö÷f–æt6&Bç7G–ÆRæÆVgBÒG¶fÆ–v‡Bç6÷W&6U&V7BæÆVgG×†°¢Ö÷f–æt6&Bç7G–ÆRçv–GF‚ÒG¶fÆ–v‡Bç6÷W&6U&V7Bçv–GF‡×†°¢Ö÷f–æt6&Bç7G–ÆRæ†V–v‡BÒG¶fÆ–v‡Bç6÷W&6U&V7Bæ†V–v‡G×†°¢Ö÷f–æt6&Bæ–ææW$…DÔÂÒÆ–Ör7&3Ò"G¶W66T‡FÖÂ†fÆ–v‡Bæ–ÖvUW&Â—Ò"ÇCÒ""óæ°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†Ö÷f–æt6&B“°¢6öç7BG&ç6ÆFU‚ÒF&vWE&V7BæÆVgBÒfÆ–v‡Bç6÷W&6U&V7BæÆVgC°¢6öç7BG&ç6ÆFU’ÒF&vWE&V7BçF÷ÒfÆ–v‡Bç6÷W&6U&V7BçF÷°¢6öç7B66ÆU‚ÒF&vWE&V7Bçv–GF‚òfÆ–v‡Bç6÷W&6U&V7Bçv–GFƒ°¢6öç7B66ÆU’ÒF&vWE&V7Bæ†V–v‡BòfÆ–v‡Bç6÷W&6U&V7Bæ†V–v‡C°¢6öç7Bæ–ÖF–öâÒÖ÷f–æt6&Bææ–ÖFR…°¢²G&ç6f÷&Ó¢'G&ç6ÆFS6BƒÂÂ’66ÆRƒ’"Â÷6—G“¢ÒÀ¢²G&ç6f÷&Ó¢G&ç6ÆFS6B‚G·G&ç6ÆFU‚¢ãSW×‚ÂG·G&ç6ÆFU’¢ãC'×‚Â’66ÆR‚G²ƒ²66ÆU‚’ò'ÒÂG²ƒ²66ÆU’’ò'Ò’&÷FFR‚G¶fÆ–v‡BçÆ–W$–æFW‚ÓÓÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚’òÓ"¢'ÖFVr–Â÷6—G“¢Âöfg6WC¢ãSbÒÀ¢²G&ç6f÷&Ó¢G&ç6ÆFS6B‚G·G&ç6ÆFU‡×‚ÂG·G&ç6ÆFU—×‚Â’66ÆR‚G·66ÆU‡ÒÂG·66ÆU—Ò’&÷FFRƒFVr–Â÷6—G“¢ÒÀ¢ÒÂ°¢GW&F–öã¢s#À¢V6–æs¢&7V&–2Ö&W¦–W"‚ã"Âãs‚Âã#"Ã’"À¢f–ÆÃ¢&f÷'v&G2"À¢Ò“°¢6öç7Bf–æ—6‚Ò‚’Óâ°¢Ö÷f–æt6&Bç&VÖ÷fR‚“°¢F&vWBæ6Æ74Æ—7Bç&VÖ÷fR‚&FW6·F÷×Æ–VBÖ6&BÒÖ'&—f–ær"“°¢Ó°¢æ–ÖF–öâæFDWfVçDÆ—7FVæW"‚&f–æ—6‚"Âf–æ—6‚Â²öæ6S¢G'VRÒ“°¢æ–ÖF–öâæFDWfVçDÆ—7FVæW"‚&6æ6VÂ"Âf–æ—6‚Â²öæ6S¢G'VRÒ“°§Ð ¦gVæ7F–öâFW6·F÷7F%÷vW$Ö&·W†6&B’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5¶6&Bæ÷væW%Ó°¢6öç7B6–FRÒ7G&–ær†6&Bç7F$VffV7E6–FRÇÂ""’çFôÆ÷vW$66R‚’æ–æ6ÇVFW2‚'&÷6R"’ò'&÷6R"¢&&ÇVR#°¢6öç7B'Gv÷&²Ò4„$5DU%ô”ÔtU5·Æ–W#òæ6†&7FW$–EÓòå·Æ–W#òæ6†&7FW%6–FRÓÓÒò¢Ð¢ÇÂ$ôd”ÄUô4„$5DU%ô”ÔtU5·Æ–W#òæ6†&7FW$–EÐ¢ÇÂ"#°¢&WGW&â ¢Æ'F–6ÆR6Æ73Ò&FW6·F÷×Æ–VB×7F"×÷vW"FW6·F÷×Æ–VB×7F"×÷vW"ÒÒG·6–FWÒ"&öÆSÒ'7FGW2#à¢G¶'Gv÷&²òÆ–Ör7&3Ò"G¶W66T‡FÖÂ†'Gv÷&²—Ò"ÇCÒ"G¶W66T‡FÖÂ†6†&7FW$æÖTg&öÔ–B‡Æ–W#òæ6†&7FW$–B’—Ò"óæ¢"'Ð¢ÆF—cà¢Ç7ãå÷Wfö—":—Fö–ÆR+rG·6–FRÓÓÒ'&÷6R"ò%&÷6R"¢$&ÆWR'ÓÂ÷7ãà¢Ç7G&öæsâG¶W66T‡FÖÂ†6†&7FW$æÖTg&öÔ–B‡Æ–W#òæ6†&7FW$–B’—ÓÂ÷7G&öæsà¢ÇâG¶W66T‡FÖÂ†6&Bç7F$VffV7DÆ&VÂÇÂ$&öçW2GRW'6öæævR"—ÓÂ÷à¢ÂöF—cà¢Âö'F–6ÆSà¢°§Ð ¦gVæ7F–öâ7–æ4FW6·F÷7F%&WfVÂ†6&B’°¢6öç7B6&D¶W’ÒFW6·F÷Æ–VD6&D¶W’†6&B“°¢–b†6&D¶W’ÓÓÒFW6·F÷Æ7EÆ–VD6&D¶W’’&WGW&ã°¢FW6·F÷Æ7EÆ–VD6&D¶W’Ò6&D¶W“°¢–b†FW6·F÷7F%&WfVÅF–ÖW"ÒçVÆÂ’v–æF÷ræ6ÆV%F–ÖV÷WB†FW6·F÷7F%&WfVÅF–ÖW"“°¢FW6·F÷7F%&WfVÅF–ÖW"ÒçVÆÃ°¢FW6·F÷7F%&WfVÂÒ6&Còç7F$VffV7DÆ&VÂò²6&D¶W’Â6&BÒ¢çVÆÃ°¢–b‚FW6·F÷7F%&WfVÂ’&WGW&ã°¢FW6·F÷7F%&WfVÅF–ÖW"Òv–æF÷rç6WEF–ÖV÷WB‚‚’Óâ°¢–b†FW6·F÷7F%&WfVÃòæ6&D¶W’ÓÒ6&D¶W’’&WGW&ã°¢FW6·F÷7F%&WfVÂÒçVÆÃ°¢FW6·F÷7F%&WfVÅF–ÖW"ÒçVÆÃ°¢&VæFW$6VçFW%Æ–VD6&B‚“°¢ÒÂ#“°§Ð ¦gVæ7F–öâFW6·F÷Æ–VD6&D'Gv÷&²†6&B’°¢&WGW&â6&Còæ'Gv÷&²ÇÂ4$Eô”ÔtU5¶6&Còæ–EÒÇÂ4$Eô$4µô”ÔtS°§Ð ¦gVæ7F–öâFW6·F÷Æ–VD6&DÖ&·W†6&BÂÆ–W$–æFW‚Â&VÖ—6T6&G2ÒµÒÂ&V6VFVD'”VffV7BÒfÇ6R’°¢6öç7B6&D¶W’ÒFW6·F÷Æ–VD6&D¶W’†6&B“°¢6öç7B–ÖvUW&ÂÒFW6·F÷Æ–VD6&D'Gv÷&²†6&B“°¢6öç7B&VÖ—6UfÇVRÒ&VÖ—6T6&G2ç&VGV6R‚‡F÷FÂÂ&VÖ—6R’ÓâF÷FÂ²çVÖ&W"‡&VÖ—6RçÆ6VÖVçBÇÂ’Â“°¢&WGW&â ¢Æ'WGFöâ6Æ73Ò&FW6·F÷×Æ–VBÖ6&BG¶6&Bç&VÖ÷fVBò"&VÖ÷fVB"¢"'ÒG¶6&Bæ&ö÷7FVBò"&ö÷7FVB"¢"'ÒG·&VÖ—6T6&G2æÆVæwF‚ò"†2×&VÖ—6R×VæFW&Æ’"¢"'ÒG·&V6VFVD'”VffV7Bbb&VÖ—6T6&G2æÆVæwF‚ò"&V6VFVBÖ'’ÖVffV7B"¢"'Ò"G—SÒ&'WGFöâ"FFÖFW6·F÷×Æ–VBÖ6&CÒ"G¶W66T‡FÖÂ†6&D¶W’—Ò"FFÖFW6·F÷×Æ–VB×F&vWCÒ"G¶W66T‡FÖÂ†6&D¶W’—Ò"FFÖFW6·F÷×Æ–VBÖ÷væW#Ò"G·Æ–W$–æFW‡Ò"&–ÖÆ&VÃÒ%fö—"ÆRL:—F–ÂFRG¶W66T‡FÖÂ†6&BææÖR—Ò#à¢G¶6&Bæ&ö÷7FVBòÇ7â6Æ73Ò&&ö÷7B×67&–f–6RÖÆ–W"FW6·F÷Ö&ö÷7B×VæFW&Æ’#ãÆ–Ör6Æ73Ò&&ö÷7B×67&–f–6RÖ&6²"7&3Ò"G·VÇF–ÖFT6&D&6´f÷%Æ–W"‡Æ–W$–æFW‚—Ò"ÇCÒ$6'FRWF–Æ—<:–R÷W"ÆR$ôõ5B"óãÇ7â6Æ73Ò&&ö÷7B×67&–f–6RÖÆ&VÂ#ä$ôõ5CÂ÷7ããÂ÷7ãæ¢"'Ð¢G·&VÖ—6T6&G2æÆVæwF‚òÇ7â6Æ73Ò&FW6·F÷×&VÖ—6R×VæFW&Æ’#ãÆ–Ör7&3Ò"Gµ$TÔ•4UõTäDU$Ä•ô”ÔtWÒ"ÇCÒ$6'FRFR&VÖ—6R"óãÇ7ãâ²G·&VÖ—6UfÇVWÓÂ÷7ããÂ÷7ãæ¢"'Ð¢Æ–Ör7&3Ò"G¶W66T‡FÖÂ†–ÖvUW&Â—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò"óà¢G¶6&Båög&öÕ&W6W'fRòsÇ7â6Æ73Ò'VÇF–ÖFR×&W6W'fRÖÖ&²"&–ÖÆ&VÃÒ$6'FR¦÷\:–RFWV—2Æ,:—6W'fR#ãÂ÷7ãâr¢"'Ð¢G¶6&BæÖ&¶VDf÷$F—66&BòsÇ7â6Æ73Ò'VÇF–ÖFRÖF—66&BÖÖ&²"&–ÖÆ&VÃÒ$6'FRÖ'\:–R÷W"ÆL:–fW76R#ãÂ÷7ãâr¢"'Ð¢G¶6&Bç&VÖ—6TÖöFRÓÓÒ'Æ6VÖVçB"òÆ–Ör6Æ73Ò'&VÖ—6RÖf÷&&–BÖ÷fW&Æ’"7&3Ò"G´dõ$$”Eô”ÔtWÒ"ÇCÒ$VffWB–çFW&F—BÂ6'FR¦÷\:–RVâ&VÖ—6R"óæ¢"'Ð¢G¶6&Bæ&ö÷7FVBòsÇ7â6Æ73Ò'Æ–VBÖ6†—#ä$ôõ5CÂ÷7ãâr¢"'Ð¢G¶6&Bç&VÖ÷fVBòsÇ7â6Æ73Ò'Æ–VBÖ6†—&VÖ÷fVBÖ6†—#å$UD•,8”SÂ÷7ãâr¢"'Ð¢Âö'WGFöãà¢°§Ð ¦gVæ7F–öâFW6·F÷Æ–VE6WVVæ6R‚’°¢6öç7B7F–öä÷&FW"ÒæWrÖ€¢‡7FFRæ7F–öäÆörÇÂµÒ¢æf–ÇFW"‚†VçG'’’ÓâVçG'’æ¶–æBÓÓÒ'Æ•ö6&B"bbVçG'’æ6&CòçÆ–VEV–B¢æÖ‚†VçG'’Â–æFW‚’Óâ¶VçG'’æ6&BçÆ–VEV–BÂ–æFW‚²Ò’À¢“°¢&WGW&â7FFRçÆ–W'0¢æfÆDÖ‚‡Æ–W"Â÷væW"’Óâ‡Æ–W#òçÆ–VBÇÂµÒ’æÖ‚†6&BÂÆ–W$÷&FW"ÂÆ–VD6&G2’Óâ°¢–b†6&Bç&VÖ—6TÖöFRÓÓÒ'Æ6VÖVçB"’°¢6öç7BÆFW%6†÷BÒÆ–VD6&G2ç6Æ–6R‡Æ–W$÷&FW"²’æf–æB‚†6æF–FFR’Óâ—5&VÖ—6R†6æF–FFR’ÇÂ6æF–FFRçGW&ä6ö×ÆWFVB“°¢–b†ÆFW%6†÷B’&WGW&âçVÆÃ°¢Ð¢&WGW&â°¢6&BÀ¢÷væW"À¢Æ–W$÷&FW"À¢&VÖ—6T6&G3¢Æ6VÖVçE&VÖ—6W4f÷%6†÷B‡Æ–VD6&G2ÂÆ–W$÷&FW"’À¢&V6VFVD'”VffV7C¢VffV7D6&E&V6VFW46&B‡Æ–VD6&G2ÂÆ–W$÷&FW"’À¢÷&FW#¢çVÖ&W"æ—4f–æ—FR„çVÖ&W"†6&BæFW6·F÷Æ”÷&FW"’¢òçVÖ&W"†6&BæFW6·F÷Æ”÷&FW"¢¢7F–öä÷&FW"ævWB†FW6·F÷Æ–VD6&D¶W’†6&B’’óòƒ²‡Æ–W$÷&FW"¢"’²÷væW"’À¢Ó°¢Ò’æf–ÇFW"„&ööÆVâ’¢ç6÷'B‚†ÆVgBÂ&–v‡B’ÓâÆVgBæ÷&FW"Ò&–v‡Bæ÷&FW"ÇÂÆVgBæ÷væW"Ò&–v‡Bæ÷væW"“°§Ð ¦gVæ7F–öâFW6·F÷Æ–VE&÷tÖ&·W‡Æ–W$–æFW‚Â&öÆR’°¢6öç7B6WVVæ6RÒFW6·F÷Æ–VE6WVVæ6R‚“°¢6öç7BÆ–W$6&G2Ò6WVVæ6Ræf–ÇFW"‚†VçG'’’ÓâVçG'’æ÷væW"ÓÓÒÆ–W$–æFW‚“°¢6öç7B†–FFVå7F$¶W’ÒFW6·F÷7F%&WfVÃòæ6&D¶W’ÇÂçVÆÃ°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢&WGW&â ¢Ç6V7F–öâ6Æ73Ò&FW6·F÷×Æ–VB×&÷rFW6·F÷×Æ–VB×&÷rÒÒG·&öÆWÒ"FFÖFW6·F÷×Æ–VB×&÷sÒ"G·Æ–W$–æFW‡Ò"&–ÖÆ&VÃÒ$6'FW2¦÷\:–W2"G¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—Ò#à¢ÆF—b6Æ73Ò&FW6·F÷×Æ–VB×f–Ww÷'B"FFÖFW6·F÷×Æ–VB×f–Ww÷'Cà¢ÆF—b6Æ73Ò&FW6·F÷×Æ–VB×G&6²#à¢G·6WVVæ6RæÆVæwF€¢ò6WVVæ6RæÖ‚‡²6&BÂ÷væW"Â&VÖ—6T6&G2Â&V6VFVD'”VffV7BÒÂ6WVVæ6T–æFW‚’Óâ€¢÷væW"ÓÓÒÆ–W$–æFW‚bbFW6·F÷Æ–VD6&D¶W’†6&B’ÓÒ†–FFVå7F$¶W¢òÇ7â6Æ73Ò&FW6·F÷×Æ–VB×6Æ÷B"7G–ÆSÒ"ÒÖFW6·F÷×Æ–VBÖÆ–W#¢G·6WVVæ6T–æFW‚²Ò#âG¶FW6·F÷Æ–VD6&DÖ&·W†6&BÂÆ–W$–æFW‚Â&VÖ—6T6&G2Â&V6VFVD'”VffV7B—ÓÂ÷7ãæ ¢¢Ç7â6Æ73Ò&FW6·F÷×Æ–VB×6Æ÷BFW6·F÷×Æ–VB×6Æ÷BÒÖV×G’"7G–ÆSÒ"ÒÖFW6·F÷×Æ–VBÖÆ–W#¢G·6WVVæ6T–æFW‚²Ò"&–Ö†–FFVãÒ'G'VR#ãÂ÷7ãæ ¢’’æ¦ö–â‚""¢¢Ç7â6Æ73Ò&FW6·F÷×Æ–VBÖV×G’#äV7VæR6'FR¦÷\:–SÂ÷7ãæÐ¢G·6WVVæ6RæÆVæwF‚bbÆ–W$6&G2æÆVæwF‚òÇ7â6Æ73Ò&FW6·F÷×Æ–VBÖV×G’FW6·F÷×Æ–VBÖV×G’ÒÖ÷fW&Æ’#äV7VæR6'FR¦÷\:–SÂ÷7ãæ¢"'Ð¢ÂöF—cà¢ÂöF—cà¢Â÷6V7F–öãà¢°§Ð ¦gVæ7F–öâFW6·F÷Æ–VD6&D'”¶W’†6&D¶W’ÂÆ–W$–æFW‚ÒçVÆÂ’°¢6öç7BÆ–W'2ÒçVÖ&W"æ—4–çFVvW"‡Æ–W$–æFW‚’ò·7FFRçÆ–W'5·Æ–W$–æFW…ÕÒ¢7FFRçÆ–W'3°¢&WGW&âÆ–W'0¢æfÆDÖ‚‡Æ–W"’ÓâÆ–W#òçÆ–VBÇÂµÒ¢æf–æB‚†6&B’ÓâFW6·F÷Æ–VD6&D¶W’†6&B’ÓÓÒ6&D¶W’’ÇÂçVÆÃ°§Ð ¦gVæ7F–öâFW6·F÷6&DFWF–ÄÖ&·W†6&B’°¢6öç7B6÷7BÒçVÖ&W"†6&Bæ6÷7E–Bóò6&Bæ6÷7Bóò“°¢6öç7B÷vW"ÒçVÖ&W"†6&Bæ6&E÷vW$v–æVBóò6&Bç÷vW$v–æVBóò6&Bç÷vW"óò¢²çVÖ&W"†6&BæVffV7E÷vW$v–æVBóò“°¢6öç7B&V6—6–öâÒçVÖ&W"†6&Bç&V6—6–öâóò“°¢6öç7BÆ6VÖVçBÒçVÖ&W"†6&BçGW&äVæEÆ6VÖVçBóò6&BçGW&åÆ6VÖVçBóò6&BçÆ6VÖVçBóò“°¢6öç7BVffV7BÒ6&BæVffV7DÆ–VBÓÓÒfÇ6P¢ò$TddUBäåTÌ8’"Î(	”EdU%4•$R ¢¢6&BæVffV7BÇÂ6&BæÆ&VÂÇÂ$V7VâVffWB#°¢&WGW&â ¢Æ'F–6ÆR6Æ73Ò&FW6·F÷Ö6&BÖFWF–Â×æVÂ#à¢Æƒ#âG¶W66T‡FÖÂ†6&BææÖRÇÂ$6'FR¦÷\:–R"—ÓÂöƒ#à¢ÆFÃà¢ÆF—cãÆGCä6ü;·CÂöGCãÆFCâG¶6÷7GÓÂöFCãÂöF—cà¢ÆF—cãÆGCåV—76æ6SÂöGCãÆFCâ²G·÷vW'ÓÂöFCãÂöF—cà¢ÆF—cãÆGCå,:–6—6–öãÂöGCãÆFCâG·&V6—6–öçÓÂöFCãÂöF—cà¢ÆF—cãÆGCåÆ6VÖVçCÂöGCãÆFCâG·Æ6VÖVçGÓÂöFCãÂöF—cà¢ÂöFÃà¢ÇâG¶W66T‡FÖÂ†VffV7B—ÓÂ÷à¢G¶6&Bæ&ö÷7FVBòsÇ7G&öær6Æ73Ò&FW6·F÷Ö6&BÖFWF–ÂÖ&ö÷7B#ä6'FR¦÷\:–RVâ$ôõ5CÂ÷7G&öæsâr¢"'Ð¢Âö'F–6ÆSà¢°§Ð ¦gVæ7F–öâ÷VäFW6·F÷Æ–VD6&DFWF–Â†6&B’°¢–b‚6&B’&WGW&ã°¢6Æ÷6T6&DÆö6Å&Wf–Wr‚“°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æFW6·F÷×Æ–VBÖ6&BÖ&6¶G&÷"“òç&VÖ÷fR‚“°¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷FW6·F÷×Æ–VBÖ6&BÖ&6¶G&÷#°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Æ'WGFöâ6Æ73Ò&FW6·F÷×Æ–VBÖ6&BÖ6Æ÷6R"G—SÒ&'WGFöâ"&–ÖÆ&VÃÒ$fW&ÖW"ÆRL:—F–Â#ì9sÂö'WGFöãà¢Ç6V7F–öâ6Æ73Ò&FW6·F÷×Æ–VBÖ6&BÖF–Æör"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÃÒ$L:—F–ÂFRG¶W66T‡FÖÂ†6&BææÖRÇÂ&Æ6'FR"—Ò#à¢Æ–Ör6Æ73Ò&FW6·F÷×Æ–VBÖ6&BÖÆ&vR"7&3Ò"G¶W66T‡FÖÂ†FW6·F÷Æ–VD6&D'Gv÷&²†6&B’—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖRÇÂ$6'FR¦÷\:–R"—Ò"óà¢G¶FW6·F÷6&DFWF–ÄÖ&·W†6&B—Ð¢Â÷6V7F–öãà¢°¢6öç7B6Æ÷6RÒ‚’Óâ°¢&6¶G&÷ç&VÖ÷fR‚“°¢Fö7VÖVçBç&VÖ÷fTWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Âöä¶W”F÷vâ“°¢Ó°¢6öç7Böä¶W”F÷vâÒ†WfVçB’Óâ°¢–b†WfVçBæ¶W’ÓÓÒ$W66R"’6Æ÷6R‚“°¢Ó°¢&6¶G&÷æFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢–b†WfVçBçF&vWBÓÓÒ&6¶G&÷ÇÂWfVçBçF&vWBæ6Æ÷6W7B‚"æFW6·F÷×Æ–VBÖ6&BÖ6Æ÷6R"’’6Æ÷6R‚“°¢Ò“°¢Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Âöä¶W”F÷vâ“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†&6¶G&÷“°¢&W&U&WF–æ6&D–ÖvW2†&6¶G&÷“°§Ð ¦gVæ7F–öâWFFTFW6·F÷Æ–VD&ö&D6öçG&öÇ2‚’°¢6öç7B&ö&BÒVÇ2æ6VçFW%Æ–VD6&CòçVW'•6VÆV7F÷"‚"æFW6·F÷×Æ–VBÖ&ö&B"“°¢6öç7Bf–Ww÷'G2Ò²âââ†&ö&CòçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖFW6·F÷×Æ–VB×f–Ww÷'EÒ"’ÇÂµÒ•Ó°¢–b‚&ö&BÇÂf–Ww÷'G2æÆVæwF‚’&WGW&ã°¢6öç7B÷fW&fÆ÷rÒf–Ww÷'G2ç6öÖR‚‡f–Ww÷'B’Óâf–Ww÷'Bç67&öÆÅv–GF‚âf–Ww÷'Bæ6Æ–VçEv–GF‚²"“°¢6öç7B&Wf–÷W2Ò&ö&BçVW'•6VÆV7F÷"‚u¶FFÖFW6·F÷×Æ–VB×67&öÆÃÒ"Ó%Òr“°¢6öç7BæW‡BÒ&ö&BçVW'•6VÆV7F÷"‚u¶FFÖFW6·F÷×Æ–VB×67&öÆÃÒ#%Òr“°¢&ö&Bæ6Æ74Æ—7BçFövvÆR‚&—2Ö÷fW&fÆ÷v–ær"Â÷fW&fÆ÷r“°¢&Wf–÷W3òæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â÷fW&fÆ÷r“°¢æW‡Còæ6Æ74Æ—7BçFövvÆR‚&†–FFVâ"Â÷fW&fÆ÷r“°¢–b‚÷fW&fÆ÷r’&WGW&ã°¢6öç7B&VfW&Væ6RÒf–Ww÷'G5³Ó°¢–b‡&Wf–÷W2’&Wf–÷W2æF—6&ÆVBÒ&VfW&Væ6Rç67&öÆÄÆVgBÃÒ#°¢–b†æW‡B’æW‡BæF—6&ÆVBÒ&VfW&Væ6Rç67&öÆÄÆVgB²&VfW&Væ6Ræ6Æ–VçEv–GF‚ãÒ&VfW&Væ6Rç67&öÆÅv–GF‚Ò#°§Ð ¦gVæ7F–öâÆ–väFW6·F÷Æ–VE&÷w2‚’°¢–b‡v–æF÷ræ–ææW%v–GF‚Âƒc’&WGW&ã°¢6öç7B&ö&BÒVÇ2æ6VçFW%Æ–VD6&CòçVW'•6VÆV7F÷"‚"æFW6·F÷×Æ–VBÖ&ö&B"“°¢6öç7B÷öæVçE&÷rÒ&ö&CòçVW'•6VÆV7F÷"‚"æFW6·F÷×Æ–VB×&÷rÒÖ÷öæVçB"“°¢6öç7BÆ–W%&÷rÒ&ö&CòçVW'•6VÆV7F÷"‚"æFW6·F÷×Æ–VB×&÷rÒ×Æ–W""“°¢–b‚÷öæVçE&÷rÇÂÆ–W%&÷r’&WGW&ã°¢òòÆW2FWW‚V×Æ6VÖVçG2,:—6W'fVçBL:‡2ÆRL:—'BÆ†WFWW"Ö†–ÖÆRBwVæP¢òò–ÆR&ö÷7Bõ&VÖ—6RâV7Vâ&V6Æ7VÂ,:‡2VæR6'FRæRFö—BL:—Æ6W"ÆF&ÆRà¢÷öæVçE&÷rç7G–ÆRç&VÖ÷fU&÷W'G’‚"ÒÖFW6·F÷×&÷rÖöfg6WB"“°¢Æ–W%&÷rç7G–ÆRç&VÖ÷fU&÷W'G’‚"ÒÖFW6·F÷×&÷rÖöfg6WB"“°§Ð ¦gVæ7F–öâ&–æDFW6·F÷Æ–VE&÷w2‚’°¢6öç7B&ö&BÒVÇ2æ6VçFW%Æ–VD6&BçVW'•6VÆV7F÷"‚"æFW6·F÷×Æ–VBÖ&ö&B"“°¢6öç7Bf–Ww÷'G2Ò²ââæVÇ2æ6VçFW%Æ–VD6&BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖFW6·F÷×Æ–VB×f–Ww÷'EÒ"•Ó°¢ÆWB7–æ6‡&öæ—¦–æu67&öÆÂÒfÇ6S°¢f–Ww÷'G2æf÷$V6‚‚‡f–Ww÷'B’Óâ°¢f–Ww÷'Bç67&öÆÄÆVgBÒçVÖ&W"æ—4f–æ—FR†FW6·F÷Æ–VD&ö&E67&öÆÂ’òFW6·F÷Æ–VD&ö&E67&öÆÂ¢f–Ww÷'Bç67&öÆÅv–GFƒ°¢f–Ww÷'BæFDWfVçDÆ—7FVæW"‚'67&öÆÂ"Â‚’Óâ°¢–b‡7–æ6‡&öæ—¦–æu67&öÆÂ’&WGW&ã°¢7–æ6‡&öæ—¦–æu67&öÆÂÒG'VS°¢FW6·F÷Æ–VD&ö&E67&öÆÂÒf–Ww÷'Bç67&öÆÄÆVgC°¢f–Ww÷'G2æf÷$V6‚‚†÷F†W%f–Ww÷'B’Óâ°¢–b†÷F†W%f–Ww÷'BÓÒf–Ww÷'B’÷F†W%f–Ww÷'Bç67&öÆÄÆVgBÒf–Ww÷'Bç67&öÆÄÆVgC°¢Ò“°¢7–æ6‡&öæ—¦–æu67&öÆÂÒfÇ6S°¢WFFTFW6·F÷Æ–VD&ö&D6öçG&öÇ2‚“°¢ÒÂ²76—fS¢G'VRÒ“°¢Ò“°¢–b†FW6·F÷VæF–æt6&DfÆ–v‡CòçÆ–VEV–B’°¢6öç7BW66VEÆ–VEV–BÒv–æF÷rä553òæW66P¢òv–æF÷rä552æW66R…7G&–ær†FW6·F÷VæF–æt6&DfÆ–v‡BçÆ–VEV–B’¢¢7G&–ær†FW6·F÷VæF–æt6&DfÆ–v‡BçÆ–VEV–B’ç&WÆ6R‚ò"örÂuÅÂ"r“°¢6öç7B'&—f–æuF&vWBÒ&ö&CòçVW'•6VÆV7F÷"†¶FFÖFW6·F÷×Æ–VB×F&vWCÒ"G¶W66VEÆ–VEV–GÒ%Ö“°¢6öç7BF&vWEf–Ww÷'BÒ'&—f–æuF&vWCòæ6Æ÷6W7B‚%¶FFÖFW6·F÷×Æ–VB×f–Ww÷'EÒ"“°¢–b†'&—f–æuF&vWBbbF&vWEf–Ww÷'B’°¢FW6·F÷Æ–VD&ö&E67&öÆÂÒÖF‚æÖ‚€¢À¢'&—f–æuF&vWBæöfg6WDÆVgBÒ‚‡F&vWEf–Ww÷'Bæ6Æ–VçEv–GF‚Ò'&—f–æuF&vWBæöfg6WEv–GF‚’ò"’À¢“°¢f–Ww÷'G2æf÷$V6‚‚‡f–Ww÷'B’Óâ°¢f–Ww÷'Bç67&öÆÄÆVgBÒFW6·F÷Æ–VD&ö&E67&öÆÃ°¢Ò“°¢Ð¢Ð¢&ö&CòçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖFW6·F÷×Æ–VB×67&öÆÅÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B&VfW&Væ6RÒf–Ww÷'G5³Ó°¢–b‚&VfW&Væ6R’&WGW&ã°¢6öç7BæW‡E67&öÆÂÒ&VfW&Væ6Rç67&öÆÄÆVg@¢²„çVÖ&W"†'WGFöâæFF6WBæFW6·F÷Æ–VE67&öÆÂ’¢ÖF‚æÖ‚ƒƒÂ&VfW&Væ6Ræ6Æ–VçEv–GF‚¢ãs"’“°¢FW6·F÷Æ–VD&ö&E67&öÆÂÒæW‡E67&öÆÃ°¢f–Ww÷'G2æf÷$V6‚‚‡f–Ww÷'B’Óâ°¢f–Ww÷'Bç67&öÆÅFò‡²ÆVgC¢æW‡E67&öÆÂÂ&V†f–÷#¢'6Öö÷F‚"Ò“°¢Ò“°¢Ò“°¢Ò“°¢VÇ2æ6VçFW%Æ–VD6&BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖFW6·F÷×Æ–VBÖ6&EÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B6&BÒFW6·F÷Æ–VD6&D'”¶W’€¢'WGFöâæFF6WBæFW6·F÷Æ–VD6&BÀ¢çVÖ&W"†'WGFöâæFF6WBæFW6·F÷Æ–VD÷væW"’À¢“°¢÷VäFW6·F÷Æ–VD6&DFWF–Â†6&B“°¢Ò“°¢Ò“°¢v–æF÷rç&WVW7Dæ–ÖF–öäg&ÖR‚‚’Óâ°¢WFFTFW6·F÷Æ–VD&ö&D6öçG&öÇ2‚“°¢Æ–väFW6·F÷Æ–VE&÷w2‚“°¢'VäFW6·F÷6&DfÆ–v‡Dæ–ÖF–öâ‚“°¢Ò“°¢&ö&CòçVW'•6VÆV7F÷$ÆÂ‚&–Ör"’æf÷$V6‚‚†–ÖvR’Óâ°¢–b‚–ÖvRæ6ö×ÆWFR’–ÖvRæFDWfVçDÆ—7FVæW"‚&ÆöB"ÂÆ–väFW6·F÷Æ–VE&÷w2Â²öæ6S¢G'VRÒ“°¢Ò“°§Ð §v–æF÷ræFDWfVçDÆ—7FVæW"‚'&W6—¦R"Â‚’Óâ°¢v–æF÷rç&WVW7Dæ–ÖF–öäg&ÖR‚‚’Óâ°¢WFFTFW6·F÷Æ–VD&ö&D6öçG&öÇ2‚“°¢Æ–väFW6·F÷Æ–VE&÷w2‚“°¢Ò“°§Ò“° ¦gVæ7F–öâ&VæFW$6VçFW%Æ–VD6&B‚’°¢VÇ2æ6VçFW%Æ–VD6&Bæ6Æ74Æ—7BçFövvÆR‚'GWF÷&–ÂÖfö7W2×F&vWB"Â&ööÆVâ‡GWF÷&–Äfö7W46Æ72‚&Æ7D6&B"ÂçVÆÂ’’“°¢7–æ4FW6·F÷7F%&WfVÂ‡7FFRæÆFW7EÆ–VD6&B“°¢6öç7BÆö6ÅÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb†Æö6ÅÆ–W$–æFW‚“°¢6öç7B7F$Ö&·WÒFW6·F÷7F%&WfVÃòæ6&D¶W’ÓÓÒFW6·F÷Æ–VD6&D¶W’‡7FFRæÆFW7EÆ–VD6&B¢òÆF—b6Æ73Ò&FW6·F÷×7F"×&WfVÂÖÆ–W"#âG¶FW6·F÷7F%÷vW$Ö&·W†FW6·F÷7F%&WfVÂæ6&B—ÓÂöF—cæ ¢¢"#°¢6öç7B6W'f–6TÖ&·WÒVÇF–ÖFU6W'f–6U&WfVÄÖ&·W‚“°¢VÇ2æ6VçFW%Æ–VD6&Bæ–ææW$…DÔÂÒ ¢ÆF—b6Æ73Ò&FW6·F÷×Æ–VBÖ&ö&B#à¢Æ'WGFöâ6Æ73Ò&FW6·F÷×Æ–VB×67&öÆÂFW6·F÷×Æ–VB×67&öÆÂÒ×&Wf–÷W2†–FFVâ"G—SÒ&'WGFöâ"FFÖFW6·F÷×Æ–VB×67&öÆÃÒ"Ó"&–ÖÆ&VÃÒ%fö—"ÆW26'FW2,:–<:–FVçFW2#î(“Âö'WGFöãà¢G¶FW6·F÷Æ–VE&÷tÖ&·W†÷öæVçD–æFW‚Â&÷öæVçB"—Ð¢G¶FW6·F÷Æ–VE&÷tÖ&·W†Æö6ÅÆ–W$–æFW‚Â'Æ–W""—Ð¢Æ'WGFöâ6Æ73Ò&FW6·F÷×Æ–VB×67&öÆÂFW6·F÷×Æ–VB×67&öÆÂÒÖæW‡B†–FFVâ"G—SÒ&'WGFöâ"FFÖFW6·F÷×Æ–VB×67&öÆÃÒ#"&–ÖÆ&VÃÒ%fö—"ÆW26'FW27V—fçFW2#î(£Âö'WGFöãà¢G·7F$Ö&·WÐ¢G·6W'f–6TÖ&·WÐ¢ÂöF—cà¢°¢&–æDFW6·F÷Æ–VE&÷w2‚“°§Ð ¦gVæ7F–öâ7F—fTVffV7D&FvW2‡Æ–W$–æFW‚’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B÷öæVçBÒ7FFRçÆ–W'5¶÷öæVçDöb‡Æ–W$–æFW‚•Ó°¢6öç7B&FvW2ÒµÓ°¢6öç7B6VçFVæ6RÒ‡fÇVR’Óâ°¢6öç7BFW‡BÒ7G&–ær‡fÇVRÇÂ""’çG&–Ò‚’ç&WÆ6R‚õ²åÇ5Ò²BòÂ""“°¢&WGW&âFW‡BòG·FW‡GÒæ¢"#°¢Ó°¢6öç7Bv—F†÷WDGW&F–öå7Vff—‚Ò‡fÇVR’Óâ7G&–ær‡fÇVRÇÂ""¢ç&WÆ6R‚õÇ2¬+uÇ2¥ÆBµÇ2¼:–6†ævW3õÇ2¢Bö’Â""¢çG&–Ò‚“°¢6öç7B&VfW'&VE6÷W&6UV–BÒ‡6÷W&6W2ÒµÒ’Óâ°¢6öç7BfÇVW2Ò„'&’æ—4'&’‡6÷W&6W2’ò6÷W&6W2¢·6÷W&6W5Ò’æÖ‚‡6÷W&6R’Óâ6÷W&6Sòç6÷W&6UV–BÇÂ6÷W&6R’æf–ÇFW"„&ööÆVâ“°¢&WGW&âfÇVW2æf–æB‚‡6÷W&6UV–B’Óâ7G&–ær‡6÷W&6UV–B’æVæG5v—F‚‚#§7F""’’ÇÂfÇVW5³ÒÇÂçVÆÃ°¢Ó°¢–b‡Æ–W"ææW‡E&V6—6–öä&öçW2’&FvW2çW6‚‡²FW‡C¢&ö6†–â6÷W¢²G·Æ–W"ææW‡E&V6—6–öä&öçW7Ò,:–6—6–öæÂG—S¢&VffV7B"Â6÷W&6UV–C¢&VfW'&VE6÷W&6UV–B‡Æ–W"ææW‡E&V6—6–öå6÷W&6W2’Ò“°¢–b‡Æ–W"ææW‡EÆ6VÖVçD&öçW2’&FvW2çW6‚‡²FW‡C¢&ö6†–â6÷W¢²G·Æ–W"ææW‡EÆ6VÖVçD&öçW7ÒÆ6VÖVçFÂG—S¢&VffV7B"Â6÷W&6UV–C¢&VfW'&VE6÷W&6UV–B‡Æ–W"ææW‡EÆ6VÖVçE6÷W&6W2’Ò“°¢–b‡Æ–W"ææW‡Dç•Æ6VÖVçD&öçW2’&FvW2çW6‚‡²FW‡C¢&ö6†–æR6'FR¢²G·Æ–W"ææW‡Dç•Æ6VÖVçD&öçW7ÒÆ6VÖVçFÂG—S¢&VffV7B"Â6÷W&6UV–C¢&VfW'&VE6÷W&6UV–B‡Æ–W"ææW‡Dç•Æ6VÖVçE6÷W&6W2’Ò“°¢–b‡Æ–W"ææW‡DF—66÷VçB’&FvW2çW6‚‡²FW‡C¢&ö6†–â6÷W¢6ü;·FRG·Æ–W"ææW‡DF—66÷VçGÒVæGW&æ6RFRÖö–ç6ÂG—S¢&VffV7B"Â6÷W&6UV–C¢&VfW'&VE6÷W&6UV–B‡Æ–W"ææW‡DF—66÷VçE6÷W&6W2’Ò“°¢–b‡Æ–W"çVÇF–ÖFTæW‡D6÷7DöæR’&FvW2çW6‚‡²FW‡C¢%÷Wfö—":—Fö–ÆR¢&ö6†–â6÷WÆ–Ö—L:’:VæGW&æ6R"ÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Ò“°¢–b‡Æ–W"çVÇF–ÖFU&W6W'fTÆö6¶VDæW‡B’&FvW2çW6‚‡²FW‡C¢%&ö6†–â6÷W¢,:—6W'fR–çFW&F—FR"ÂG—S¢&6öç7G&–çB"Ò“°¢–b‡Æ–W"çVÇF–ÖFU&W6W'fTÆö6¶VDW†6†ævR’&FvW2çW6‚‡²FW‡C¢%VæFçBÎ(	œ:–6†ævR¢,:—6W'fR–çFW&F—FR"ÂG—S¢&6öç7G&–çB"Â6FVv÷'“¢'W&ÖæVçB"Ò“°¢–b‡Æ–W"çVÇF–ÖFTVffV7DÆ–Ö—B’&FvW2çW6‚‡²FW‡C¢%VæFçBÎ(	œ:–6†ævR¢6WVÆR6'FRTddUBWF÷&—<:–R"ÂG—S¢&6öç7G&–çB"Â6FVv÷'“¢'W&ÖæVçB"Ò“°¢–b‡Æ–W"çVÇF–ÖFTæõ&WVFVDfÖ–Ç’’&FvW2çW6‚‡²FW‡C¢%VæFçBÎ(	œ:–6†ævR¢–×÷76–&ÆRFR&V¦÷VW"VæRfÖ–ÆÆRFR4õU"ÂG—S¢&6öç7G&–çB"Â6FVv÷'“¢'W&ÖæVçB"Ò“°¢–b‡Æ–W"çVÇF–ÖFT÷öæVçE&V6—6–öägFW%F†—&B’&FvW2çW6‚‡²FW‡C¢,8'F—"GR6R4õU¢Ó",:–6—6–öâ"ÂG—S¢&6öç7G&–çB"Â6FVv÷'“¢'W&ÖæVçB"Ò“°¢–b‡Æ–W"çVÇF–ÖFU÷vW$6F‡&VR’&FvW2çW6‚‡²FW‡C¢%VæFçBÎ(	œ:–6†ævR¢V—76æ6RFW24õU2Æ–Ö—L:–R:2"ÂG—S¢&6öç7G&–çB"Â6FVv÷'“¢'W&ÖæVçB"Ò“°¢–b‡Æ–W"çVÇF–ÖFT&ö÷7DW‡G&6÷7B’&FvW2çW6‚‡²FW‡C¢%VæFçBÎ(	œ:–6†ævR¢6†VR$ôõ5B6ü;·FR³VæGW&æ6R"ÂG—S¢&6öç7G&–çB"Â6FVv÷'“¢'W&ÖæVçB"Ò“°¢–b‡Æ–W"ææW‡DW‡G&6÷7B’&FvW2çW6‚‡²FW‡C¢&ö6†–â6÷W¢6ü;·FRG·Æ–W"ææW‡DW‡G&6÷7GÒVæGW&æ6RFRÇW6ÂG—S¢&6öç7G&–çB"Â6÷W&6UV–C¢&VfW'&VE6÷W&6UV–B‡Æ–W"ææW‡DW‡G&6÷7E6÷W&6W2’Ò“°¢–b‡Æ–W"ææW‡E÷vW$6ÒçVÆÂ’&FvW2çW6‚‡²FW‡C¢&ö6†–â6÷W¢V—76æ6RÆ–Ö—L:–R:G·Æ–W"ææW‡E÷vW$6ÖÂG—S¢&6öç7G&–çB"Â6÷W&6UV–C¢Æ–W"ææW‡E÷vW$66÷W&6UV–BÒ“°¢–b‡Æ–W"ææW‡E6†÷D&6UÆ6VÖVçE¦W&ò’&FvW2çW6‚‡²FW‡C¢%&ö6†–â6÷W¢Æ6VÖVçBFR&6R&ÖVì:’:"ÂG—S¢&6öç7G&–çB"Â6÷W&6UV–C¢Æ–W"ææW‡E6†÷D&6UÆ6VÖVçE¦W&õ6÷W&6UV–BÒ“°¢6öç7B&÷674&öçW2ÒçVÖ&W"‡7FFRçÆ–W'5¶÷öæVçDöb‡Æ–W$–æFW‚•Óòç&÷675÷vW$&öçW2ÇÂ“°¢–b‡&÷674&öçW2â’&FvW2çW6‚‡²FW‡C¢VæFçBÎ(	œ:–6†ævR¢6’f÷W276W¢Â&÷6vvæR²G·&÷674&öçW7ÒV—76æ6VÂG—S¢&6öç7G&–çB"Ò“°¢–b‚‡Æ–W"ææW‡E÷vW$×VÇF—Æ–W"óò’â’&FvW2çW6‚‡²FW‡C¢&ö6†–â6÷W¢V—76æ6R×VÇF—Æœ:–R"G·Æ–W"ææW‡E÷vW$×VÇF—Æ–W'ÖÂG—S¢&VffV7B"Â6÷W&6UV–C¢Æ–W"ææW‡E÷vW$×VÇF—Æ–W%6÷W&6UV–BÒ“°¢–b‡Æ–W"æW†6†ævU&V6—6–öä&öçW2’&FvW2çW6‚‡²FW‡C¢VæFçBÎ(	œ:–6†ævR¢²G·Æ–W"æW†6†ævU&V6—6–öä&öçW7Ò,:–6—6–öâ7W"F÷WFW2f÷26'FW6ÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢&VfW'&VE6÷W&6UV–B‡Æ–W"æW†6†ævU&V6—6–öå6÷W&6W2’Ò“°¢–b‡Æ–W"æW†6†ævUÆ6VÖVçD&öçW2’&FvW2çW6‚‡²FW‡C¢VæFçBÎ(	œ:–6†ævR¢²G·Æ–W"æW†6†ævUÆ6VÖVçD&öçW7ÒÆ6VÖVçB7W"F÷WFW2f÷26'FW6ÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢&VfW'&VE6÷W&6UV–B‡Æ–W"æW†6†ævUÆ6VÖVçE6÷W&6W2’Ò“°¢f÷"†6öç7B&öçW2öbÆ–W"æW†6†ævTfÖ–Ç•÷vW$&öçW6W2ÇÂµÒ’°¢6öç7BfÖ–Æ–W2Ò&öçW2æfÖ–Æ–W3òæÆVæwF€¢ò&öçW2æfÖ–Æ–W2æ¦ö–â‚"Â"¢¢F÷W2f÷26÷W26VbG¶&öçW2æW†6ÇVFVDfÖ–Æ–W3òæ¦ö–â‚"Â"’ÇÂ&ÆW2fÖ–ÆÆW2W†6ÇVW2'Ö°¢&FvW2çW6‚‡²FW‡C¢VæFçBÎ(	œ:–6†ævR¢²G¶&öçW2çfÇVWÒV—76æ6R7W"G¶fÖ–Æ–W7ÖÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢&öçW2ç6÷W&6UV–BÒ“°¢Ð¢f÷"†6öç7B&öçW2öbÆ–W"æW†6†ævTgFW$fÖ–Ç•Æ6VÖVçD&öçW6W2ÇÂµÒ’°¢&FvW2çW6‚‡²FW‡C¢VæFçBÎ(	œ:–6†ævR¢²G¶&öçW2çfÇVWÒÆ6VÖVçB7W"6†VR6÷W¦÷\:’,:‡2VâG¶&öçW2ægFW$fÖ–Ç—ÖÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢&öçW2ç6÷W&6UV–BÒ“°¢Ð¢f÷"†6öç7B&öçW2öbÆ–W"çÆ6VÖVçEW$÷öæVçDÆ÷u÷vW$6&D&öçW6W2ÇÂµÒ’°¢&FvW2çW6‚‡²FW‡C¢VæFçBÎ(	œ:–6†ævR¢²G¶&öçW2çfÇVWÒÆ6VÖVçB"6'FRGfW'6RFRV—76æ6R–æl:—&–WW&R:G¶&öçW2çF‡&W6†öÆGÖÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢&öçW2ç6÷W&6UV–BÒ“°¢Ð¢–b‡Æ–W"ç&÷FV7FVDg&öÕ&VÖ÷fÂ’&FvW2çW6‚‡²FW‡C¢%VæFçBÎ(	œ:–6†ævR¢f÷26'FW2æRWWfVçB2:§G&R7W&–Ü:–W2"ÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢Æ–W"ç&÷FV7FVDg&öÕ&VÖ÷fÅ6÷W&6UV–BÒ“°¢–b‡Æ–W"æ6æ6VÄæW‡D÷öæVçDVffV7B’&FvW2çW6‚‡²FW‡C¢%&ö6†–âVffWBGfW'6R¢æçVÌ:’"ÂG—S¢&VffV7B"Â6÷W&6UV–C¢Æ–W"æ6æ6VÄæW‡D÷öæVçDVffV7E6÷W&6UV–BÒ“°¢–b†÷öæVçCòæ6æ6VÄæW‡D÷öæVçDVffV7B’&FvW2çW6‚‡°¢FW‡C¢%&ö6†–âVffWB¦÷\:’¢6W&æçVÌ:’"Î(	–GfW'6—&R"À¢G—S¢&6öç7G&–çB"À¢6÷W&6UV–C¢÷öæVçBæ6æ6VÄæW‡D÷öæVçDVffV7E6÷W&6UV–BÀ¢Ò“°¢–b‡Æ–W"æg&VT&ö÷7DæW‡B’&FvW2çW6‚‡²FW‡C¢%&ö6†–â$ôõ5B¢F—7öæ–&ÆR6ç26öæF—F–öâFRÆ6VÖVçB"ÂG—S¢&VffV7B"Â6÷W&6UV–C¢Æ–W"æg&VT&ö÷7DæW‡E6÷W&6UV–BÒ“°¢–b‡7FFRçGW&ä–væ÷&W5Æ6VÖVçE·Æ–W$–æFW…Ò’&FvW2çW6‚‡²FW‡C¢$6RF÷W"¢Æ6öçG&–çFRFRÆ6VÖVçBW7B–væ÷,:–R"ÂG—S¢&VffV7B"Ò“°¢–b‡Æ–W"æÆ–Ö—FVDfÖ–Æ–W2’&FvW2çW6‚‡²FW‡C¢6RF÷W"¢6WVÆW2ÆW26'FW2G·Æ–W"æÆ–Ö—FVDfÖ–Æ–W2æ¦ö–â‚"ò"—ÒWWfVçB:§G&R¦÷\:–W6ÂG—S¢&6öç7G&–çB"Â6÷W&6UV–C¢Æ–W"æÆ–Ö—FVDfÖ–Æ–W56÷W&6UV–BÒ“°¢–b‡7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW‚bb7FFRæÖæFF÷'•Æ6VÖVçBbb7FFRæÆ7D6&B’°¢&FvW2çW6‚‡²FW‡C¢6RF÷W"¢Æ6VÖVçBÖ–æ–×VÒ&WV—2G·&WV—&VEÆ6VÖVçDf÷$Æ7D6&B‚—ÖÂG—S¢&6öç7G&–çB"Ò“°¢Ð¢–b‡7FFRæ&ö÷7Df–Æ&ÆTf÷"ÓÓÒÆ–W$–æFW‚’&FvW2çW6‚‡²FW‡C¢$6RF÷W"¢$ôõ5BF—7öæ–&ÆR"ÂG—S¢&VffV7B"Ò“°¢–b††5&WGW&å6W'f–6U&W7G&–7F–öâ‡Æ–W$–æFW‚’’°¢&FvW2çW6‚‡²FW‡C¢%&WF÷W"FR6W'f–6R¢föÌ:–RWB6Ö6‚–çFW&F—G2"ÂG—S¢&6öç7G&–çB"Ò“°¢Ð¢f÷"†6öç7B&öçW2öbÆ–W"æVæD&öçW6W2’°¢–b†&öçW2çG—RÓÓÒ&F÷V&ÆTÆ7E6†÷B"’&FvW2çW6‚‡²FW‡C¢$f–âFRÎ(	œ:–6†ævR¢F÷V&ÆRÆV—76æ6RFRf÷G&RFW&æœ:‡&R6'FR6÷W"ÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢&öçW2ç6÷W&6UV–BÒ“°¢–b†&öçW2çG—RÓÓÒ&&ö÷7FVD&öçW2"’&FvW2çW6‚‡²FW‡C¢f–âFRÎ(	œ:–6†ævR¢²G¶&öçW2çfÇVWÒV—76æ6R"6'FR¦÷\:–RVâ$ôõ5FÂG—S¢&VffV7B"Â6FVv÷'“¢'W&ÖæVçB"Â6÷W&6UV–C¢&öçW2ç6÷W&6UV–BÒ“°¢Ð¢6öç7BW'6—7FVçD&öçW6W2Ò°¢âââ‡Æ–W"ç7W&f6T&öçW6W2ÇÂ‡Æ–W"ç7W&f6T&öçW2ò·Æ–W"ç7W&f6T&öçW5Ò¢µÒ’’À¢âââ‡Æ–W"çW&ÖæVçD&öçW6W2ÇÂµÒ’À¢âââ‡Æ–W"çFV×÷&'”&öçW6W2ÇÂµÒ’À¢Ó°¢6öç7B6VVåW'6—7FVçD&öçW6W2ÒæWr6WB‚“°¢f÷"†6öç7B&öçW2öbW'6—7FVçD&öçW6W2’°¢6öç7B–FVçF—G’Ò&öçW3òç6÷W&6T&öçW4–BÇÂ&öçW3òæ–BÇÂ&öçW3òæÆ&VÃ°¢–b‚–FVçF—G’ÇÂ6VVåW'6—7FVçD&öçW6W2æ†2†–FVçF—G’’’6öçF–çVS°¢6VVåW'6—7FVçD&öçW6W2æFB†–FVçF—G’“°¢6öç7B&÷f—6–öæÂÒ‡Æ–W"çFV×÷&'”&öçW6W2ÇÂµÒ’æ–æ6ÇVFW2†&öçW2“°¢6öç7BGW&F–öâÒ&öçW3òç&VÖ–æ–ætW†6†ævW0¢òG¶&öçW2ç&VÖ–æ–ætW†6†ævW7Ò:–6†ævRG¶&öçW2ç&VÖ–æ–ætW†6†ævW2âò'2"¢"'Ö ¢¢&÷f—6–öæÂò%&÷f—6ö—&R"¢$ÖF6‚#°¢6öç7BF—7Æ–VDÆ&VÂÒv—F†÷WDGW&F–öå7Vff—‚†&öçW2æÆ&VÂÇÂ&öçW2ç&V6öâÇÂ$&öçW27F–b"“°¢&FvW2çW6‚‡°¢FW‡C¢G¶GW&F–öçÒ¢G¶F—7Æ–VDÆ&VÇÖÀ¢G—S¢&VffV7B"À¢6FVv÷'“¢&÷f—6–öæÂò'&÷f—6–öæÂ"¢'W&ÖæVçB"À¢FW67&—F–öã¢°¢6VçFVæ6R†F—7Æ–VDÆ&VÂ’À¢&öçW2ç&V6öâbbF—7Æ–VDÆ&VÂæ–æ6ÇVFW2†&öçW2ç&V6öâ’ò÷&–v–æR¢G·6VçFVæ6R†&öçW2ç&V6öâ—Ö¢""À¢Òæf–ÇFW"„&ööÆVâ’æ¦ö–â‚""’À¢Ò“°¢Ð¢&WGW&â&FvW2æÖ‚†&FvR’Óâ°¢6öç7B6W&F÷"Ò&FvRçFW‡Bæ–æFW„öb‚#¢"“°¢6öç7BGW&F–öâÒ6W&F÷"âò&FvRçFW‡Bç6Æ–6RƒÂ6W&F÷"’¢&FvRçG—RÓÓÒ&6öç7G&–çB"ò$6RF÷W""¢$7F–b#°¢6öç7BÆ&VÂÒ6W&F÷"âò&FvRçFW‡Bç6Æ–6R‡6W&F÷"²’çG&–Ò‚’¢&FvRçFW‡C°¢6öç7B7F$&öçW2Ò7G&–ær†&FvRç6÷W&6UV–BÇÂ""’æVæG5v—F‚‚#§7F""“°¢6öç7B7F%Æ–VEV–BÒ7F$&öçW2ò7G&–ær†&FvRç6÷W&6UV–B’ç&WÆ6R‚ó§7F"BòÂ""’¢"#°¢6öç7B7F$6&BÒ7F$&öçW0¢ò7FFRçÆ–W'2æfÆDÖ‚†6æF–FFR’Óâ6æF–FFSòçÆ–VBÇÂµÒ’æf–æB‚†6&B’Óâ6&BçÆ–VEV–BÓÓÒ7F%Æ–VEV–B¢¢çVÆÃ°¢6öç7B7F$Æ&VÂÒ7F$6&Còç7F$VffV7DÆ&VÂÇÂ‡7F$&öçW2ò$&öçW2GRW'6öæævR"¢""“°¢6öç7B7F%6–FRÒ7F$&öçW0¢ò…7G&–ær‡7F$6&Còç7F$VffV7E6–FRÇÂ""’çFôÆ÷vW$66R‚’æ–æ6ÇVFW2‚'&÷6R"’ò'&÷6R"¢&&ÇVR"¢¢"#°¢&WGW&â°¢ââæ&FvRÀ¢6FVv÷'“¢&FvRæ6FVv÷'’ÇÂ†&FvRçG—RÓÓÒ&6öç7G&–çB"ò&6öç7G&–çB"¢'&÷f—6–öæÂ"’À¢Æ&VÃ¢7F$&öçW2ò&öçW2:—Fö–ÆR+rG¶Æ&VÇÖ¢Æ&VÂÀ¢GW&F–öã¢7F$&öçW2ò$&öçW2:—Fö–ÆR"¢GW&F–öâÀ¢–6öã¢&FvRçG—RÓÓÒ&6öç7G&–çB"ò""¢.)Êb"À¢7F%÷vW#¢7F$&öçW2À¢7F%6–FRÀ¢FW67&—F–öã¢&FvRæFW67&—F–öâÇÂG·7F$Æ&VÂòG·6VçFVæ6R‡7F$Æ&VÂ—Ò¢"'ÒG·6VçFVæ6R†&FvRçFW‡B—ÖÀ¢Ó°¢Ò“°§Ð ¦gVæ7F–öâÖö&–ÆT6†&7FW%7F$6&B‡Æ–W"’°¢6öç7B6†&7FW"Ò6†&7FW$öb‡Æ–W"“°¢6öç7BVffV7BÒ7W'&VçD6†&7FW$VffV7B‡Æ–W"“°¢&WGW&â°¢æÖS¢6†&7FW#òææÖRÇÂF—7Æ•Æ–W$æÖR‡Æ–W"’À¢'Gv÷&³¢4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÓòå·Æ–W"æ6†&7FW%6–FUÐ¢ÇÂ4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÓòå³Ð¢ÇÂ$ôd”ÄUô4„$5DU%ô”ÔtU5·Æ–W"æ6†&7FW$–EÐ¢ÇÂ""À¢6–FS¢VffV7Còç6–FRÇÂ‡Æ–W"æ6†&7FW%6–FRÓÓÒò%&÷6R"¢$&ÆWR"’À¢VffV7C¢VffV7CòæÆ&VÂÇÂ$V7Vâ÷Wfö—":—Fö–ÆRF—7öæ–&ÆRâ"À¢Ó°§Ð ¦gVæ7F–öâ6Æ÷6TVffV7D†VÇF–Æör‚’°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æVffV7BÖ†VÇÖ&6¶G&÷"“òç&VÖ÷fR‚“°§Ð ¦gVæ7F–öâ÷VäVffV7D†VÇF–Æör†'WGFöâ’°¢6Æ÷6TVffV7D†VÇF–Æör‚“°¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷VffV7BÖ†VÇÖ&6¶G&÷#°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&VffV7BÖ†VÇÖF–Æör"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÆÆVF'“Ò&VffV7D†VÇF—FÆR#à¢Ç7â6Æ73Ò&VffV7BÖ†VÇÖ–6öâ"&–Ö†–FFVãÒ'G'VR#âG¶W66T‡FÖÂ†'WGFöâæFF6WBæVffV7D–6öâÇÂ.)Êb"—ÓÂ÷7ãà¢ÆF—cãÇ6Æ73Ò&Æ&VÂ#âG¶W66T‡FÖÂ†'WGFöâæFF6WBæVffV7DGW&F–öâÇÂ$VffWB7F–b"—ÓÂ÷ãÆƒ"–CÒ&VffV7D†VÇF—FÆR#âG¶W66T‡FÖÂ†'WGFöâæFF6WBæVffV7DÆ&VÂÇÂ$VffWB"—ÓÂöƒ#ãÇâG¶W66T‡FÖÂ†'WGFöâæFF6WBæVffV7DFW67&—F–öâÇÂ""—ÓÂ÷ãÂöF—cà¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6Æ÷6RÖVffV7BÖ†VÇäfW&ÖW#Âö'WGFöãà¢Â÷6V7F–öãà¢°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FFÖ6Æ÷6RÖVffV7BÖ†VÇÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6Æ÷6TVffV7D†VÇF–Æör“°¢&6¶G&÷æFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ²–b†WfVçBçF&vWBÓÓÒ&6¶G&÷’6Æ÷6TVffV7D†VÇF–Æör‚“²Ò“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†&6¶G&÷“°§Ð ¦gVæ7F–öâ6Æ÷6TFW6·F÷&öçW4F–Æör‚’°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æFW6·F÷Ö&öçW2Ö&6¶G&÷"“òç&VÖ÷fR‚“°§Ð ¦gVæ7F–öâ÷VäFW6·F÷&öçW4F–Æör‡Æ–W$–æFW‚’°¢6Æ÷6TFW6·F÷&öçW4F–Æör‚“°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢–b‚Æ–W"’&WGW&ã°¢6öç7BVffV7D&FvW2Ò7F—fTVffV7D&FvW2‡Æ–W$–æFW‚“°¢6öç7B6–×ÆT&öçW6W2Ò°¢ââç7W&f6T&öçW6W4f÷%Æ–W"‡Æ–W"’À¢âââ‡Æ–W"çW&ÖæVçD&öçW6W2óòµÒ’À¢Ð¢æÖ‚†&öçW2’Óâ7G&–ær†&öçW3òæÆ&VÂÇÂ""’çG&–Ò‚’¢æf–ÇFW"„&ööÆVâ¢æf–ÇFW"‚†Æ&VÂ’ÓâVffV7D&FvW2ç6öÖR‚†&FvR’Óâ&FvRæÆ&VÂÓÓÒÆ&VÂ’“°¢6öç7BVçG&–W2Ò°¢ââæVffV7D&FvW2æÖ‚†&FvR’Óâ‡°¢G—S¢&FvRçG—RÀ¢GW&F–öã¢&FvRæGW&F–öâÀ¢Æ&VÃ¢&FvRæÆ&VÂÀ¢FW67&—F–öã¢&FvRæFW67&—F–öâÀ¢Ò’’À¢ââç6–×ÆT&öçW6W2æÖ‚†Æ&VÂ’Óâ‡°¢G—S¢&VffV7B"À¢GW&F–öã¢$ÖF6‚"À¢Æ&VÂÀ¢FW67&—F–öã¢G¶Æ&VÇÒæÀ¢Ò’’À¢Òæf–ÇFW"‚†VçG'’Â–æFW‚ÂfÇVW2’Óâ€¢fÇVW2æf–æD–æFW‚‚†6æF–FFR’ÓâG¶6æF–FFRçG—WÓ¢G¶6æF–FFRæÆ&VÇÖÓÓÒG¶VçG'’çG—WÓ¢G¶VçG'’æÆ&VÇÖ’ÓÓÒ–æFW€¢’“°¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷FW6·F÷Ö&öçW2Ö&6¶G&÷#°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&FW6·F÷Ö&öçW2ÖF–Æör"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÆÆVF'“Ò&FW6·F÷&öçW5F—FÆR#à¢Æ†VFW#à¢ÆF—cà¢Ç6Æ73Ò&Æ&VÂ#ä&öçW2WBÖÇW3Â÷à¢Æƒ"–CÒ&FW6·F÷&öçW5F—FÆR#âG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—ÓÂöƒ#à¢ÂöF—cà¢Æ'WGFöâ6Æ73Ò&FW6·F÷Ö&öçW2Ö6Æ÷6R"G—SÒ&'WGFöâ"FFÖ6Æ÷6RÖFW6·F÷Ö&öçW6W2&–ÖÆ&VÃÒ$fW&ÖW"#ì9sÂö'WGFöãà¢Âö†VFW#à¢ÆF—b6Æ73Ò&FW6·F÷Ö&öçW2ÖÆ—7B#à¢G¶VçG&–W2æÆVæwF‚òVçG&–W2æÖ‚†VçG'’’Óâ ¢Æ'F–6ÆR6Æ73Ò&FW6·F÷Ö&öçW2ÖVçG'’FW6·F÷Ö&öçW2ÖVçG'’ÒÒG¶VçG'’çG—RÓÓÒ&6öç7G&–çB"ò&ÖÇW2"¢&&öçW2'Ò#à¢Ç7ãâG¶W66T‡FÖÂ†VçG'’æGW&F–öâÇÂ†VçG'’çG—RÓÓÒ&6öç7G&–çB"ò$ÖÇW2"¢$&öçW2"’—ÓÂ÷7ãà¢Ç7G&öæsâG¶W66T‡FÖÂ†VçG'’æÆ&VÂ—ÓÂ÷7G&öæsà¢ÇâG¶W66T‡FÖÂ†VçG'’æFW67&—F–öâÇÂVçG'’æÆ&VÂ—ÓÂ÷à¢Âö'F–6ÆSà¢’æ¦ö–â‚""’¢sÇ6Æ73Ò&FW6·F÷Ö&öçW2ÖV×G’#äV7Vâ&öçW2æ’ÖÇW27F–bãÂ÷âwÐ¢ÂöF—cà¢Â÷6V7F–öãà¢°¢6öç7B6Æ÷6RÒ‚’Óâ°¢6Æ÷6TFW6·F÷&öçW4F–Æör‚“°¢Fö7VÖVçBç&VÖ÷fTWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Âöä¶W”F÷vâ“°¢Ó°¢6öç7Böä¶W”F÷vâÒ†WfVçB’Óâ°¢–b†WfVçBæ¶W’ÓÓÒ$W66R"’6Æ÷6R‚“°¢Ó°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FFÖ6Æ÷6RÖFW6·F÷Ö&öçW6W5Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6Æ÷6R“°¢&6¶G&÷æFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢–b†WfVçBçF&vWBÓÓÒ&6¶G&÷’6Æ÷6R‚“°¢Ò“°¢Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Âöä¶W”F÷vâ“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†&6¶G&÷“°§Ð ¦gVæ7F–öâ&VæFW%VÇF–ÖFU&W6÷W&6W2‡Æ–W$–æFW‚’°¢&WGW&â"#°§Ð ¦gVæ7F–öâ&VæFW%VÇF–ÖFU&W6W'fT–ä†æB‡Æ–W$–æFW‚’°¢–b‚TÅD”ÔDUôÔôDRæ7F—fR’&WGW&â"#°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B&W6W'fRÒÆ–W"ç&W6W'fRÇÂµÓ°¢–b‚&W6W'fRæÆVæwF‚’&WGW&âsÇ7â6Æ73Ò'VÇF–ÖFR×&W6W'fRÖ†æBÖF—f–FW"V×G’#å,8•4U%dR+ró#Â÷7ãâs°¢&WGW&âÇ7â6Æ73Ò'VÇF–ÖFR×&W6W'fRÖ†æBÖF—f–FW"#å,8•4U%dR+rG·&W6W'fRæÆVæwF‡Òó#Â÷7ãâG·&W6W'fRæÖ‚†6&B’Óâ°¢6öç7B'VÆW46&BÒ&W7F÷&UVÇF–ÖFT6&E&–çFVE7FFR†6&B“°¢6öç7B–ÖvRÒ6&D'Gv÷&²†6&B“°¢6öç7BW6&ÆRÒÆ–W$–æFW‚ÓÓÒbb6åW6U6VB‡Æ–W$–æFW‚’bb7FFRævÖT÷fW"bbÆ–W"çVÇF–ÖFU&W6W'fTÆö6¶VDæW‡BbbÆ–W"çVÇF–ÖFU&W6W'fTÆö6¶VDW†6†ævS°¢6öç7B6÷7BÒVffV7F—fT6÷7B‡Æ–W"Â'VÆW46&B“°¢6öç7Bæ÷&ÖÄÆÆ÷vVBÒW6&ÆRbb6åÆ”æ÷&ÖÂ‡Æ–W$–æFW‚Â'VÆW46&B“°¢6öç7B&ö÷7DÆÆ÷vVBÒW6&ÆRbb6åÆ”&ö÷7B‡Æ–W$–æFW‚Â'VÆW46&B“°¢6öç7BÆ–&ÆRÒæ÷&ÖÄÆÆ÷vVBÇÂ&ö÷7DÆÆ÷vVC°¢&WGW&âÆ'F–6ÆR6Æ73Ò&6&B†2×f—7VÂVÇF–ÖFR×&W6W'fRÖ†æBÖ6&BG·W6&ÆRò""¢"VÇF–ÖFR×&W6W'fR×&VFöæÇ’'ÒG·W6&ÆRbbÆ–&ÆRò"VçÆ–&ÆRFW6·F÷Ö†æBÖ6&BÒÖÆö6¶VB"¢"'Ò"FFÖ†æBÖ6&B×V–CÒ"G¶W66T‡FÖÂ†6&BçV–B—Ò"FFÖ†æB×Æ–W#Ò"G·Æ–W$–æFW‡Ò"G·W6&ÆRòrF&–æFWƒÒ#"r¢"'Óà¢Ç7â6Æ73Ò'VÇF–ÖFR×&W6W'fRÖ†æBÖ&FvR#å,8•4U%dSÂ÷7ãà¢G·W6&ÆRbbÆ–&ÆRòsÇ7â6Æ73Ò&FW6·F÷Ö6&BÖÆö6²"&–ÖÆ&VÃÒ$6'FR–çWF–Æ—6&ÆR#ï	ùI#Â÷7ãâr¢"'Ð¢Æ'WGFöâ6Æ73Ò&6&B×f—7VÂ6&BÖ–ÖvR×¦ööÒ×G&–vvW""G—SÒ&'WGFöâ"FFÖ–ÖvR×¦ööÓÒ"G¶W66T‡FÖÂ†–ÖvR—Ò"FFÖ–ÖvRÖÆ&VÃÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò#ãÆ–Ör7&3Ò"G¶W66T‡FÖÂ†–ÖvR—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò"óãÂö'WGFöãà¢G·W6&ÆRòÆF—b6Æ73Ò&6&BÖ†÷fW"×æVÂVÇF–ÖFR×&W6W'fRÖ†÷fW"×æVÂ#ãÆF—b6Æ73Ò&6&BÖ7F–öç2VÇF–ÖFR×&W6W'fRÖ7F–öç2#ãÆ'WGFöâ6Æ73Ò'Æ’Ö'WGFöâVÇF–ÖFRÖ6&B×Æ’Ö'WGFöâ"G—SÒ&'WGFöâ"FF×W6R×&W6W'fSÒ"G¶W66T‡FÖÂ†6&BçV–B—Ò"&–ÖÆ&VÃÒ$¦÷VW"G¶W66T‡FÖÂ†6&BææÖR—Ò÷W"G¶6÷7GÒVæGW&æ6R"G¶æ÷&ÖÄÆÆ÷vVBò""¢&F—6&ÆVB'ÓãÇ7â6Æ73Ò&6&BÖ7F–öâÖ6÷7B#ãÆ#âG¶6÷7GÓÂö#ãÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÂ÷7ããÂö'WGFöããÆ'WGFöâ6Æ73Ò&&ö÷7BÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ&ö÷7B×&W6W'fSÒ"G¶W66T‡FÖÂ†6&BçV–B—Ò"G¶&ö÷7DÆÆ÷vVBò""¢&F—6&ÆVB'Óä$ôõ5CÂö'WGFöããÂöF—cãÂöF—cæ¢"'Ð¢Âö'F–6ÆSæ°¢Ò’æ¦ö–â‚""—Ö°§Ð ¦gVæ7F–öâVæ&ÆUVÇF–ÖFTF–Æöt6&E&Wf–Ww2†F–ÆörÂ6&G2’°¢6öç7B–ÖvW2Ò²âââ†F–ÆösòçVW'•6VÆV7F÷$ÆÂ‚"çVÇF–ÖFRÖG&gBÖ6&B–ÖrÂçVÇF–ÖFRÖF—66&BÖw&–B–Ör"’ÇÂµÒ•Ó°¢–ÖvW2æf÷$V6‚‚†–ÖvRÂ–æFW‚’Óâ°¢6öç7B6&BÒ6&G5¶–æFW…Ó°¢6öç7B'Gv÷&²Ò6&D'Gv÷&²†6&B“°¢–b‚6&BÇÂ'Gv÷&²’&WGW&ã°¢–ÖvRæ6Æ74Æ—7BæFB‚&F–ÆörÖ6&B×&Wf–Wr"“°¢–ÖvRæFF6WBæ–ÖvU¦ööÒÒ'Gv÷&³°¢–ÖvRæFF6WBæ–ÖvTÆ&VÂÒ6&BææÖRÇÂ$6'FR#°¢Ò“°¢GF6„–ÖvU¦ööÔ†æFÆW'2†F–Æör“°§Ð ¦gVæ7F–öâ÷VåVÇF–ÖFTF—66&B‡Æ–W$–æFW‚’°¢–b‡Æ–W$–æFW‚ÓÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚’’&WGW&ã°¢6öç7B6&G2Ò7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…ÒÇÂµÓ°¢6öç7BF–ÆörÒFö7VÖVçBæ7&VFTVÆVÖVçB‚'6V7F–öâ"“°¢F–Æöræ6Æ74æÖRÒ'VÇF–ÖFRÖF–Æör#°¢F–Æöræ–ææW$…DÔÂÒÆF—b6Æ73Ò'VÇF–ÖFRÖF–ÆörÖ6&B#ãÆ'WGFöâ6Æ73Ò'VÇF–ÖFRÖF–ÆörÖ6Æ÷6R"G—SÒ&'WGFöâ"&–ÖÆ&VÃÒ$fW&ÖW"#ì9sÂö'WGFöããÇ6Æ73Ò&W–V'&÷r#åFVææ—26÷W'G2VÇF–ÖFSÂ÷ãÆƒ#äL:–fW76RFRG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·Æ–W$–æFW…Ò’—ÓÂöƒ#ãÆF—b6Æ73Ò'VÇF–ÖFRÖF—66&BÖw&–B#âG¶6&G2æÆVæwF‚ò6&G2æÖ‚†6&B’ÓâÆ'F–6ÆSâG¶6&D'Gv÷&²†6&B’òÆ'WGFöâ6Æ73Ò&6&BÖ–ÖvR×¦ööÒ×G&–vvW""G—SÒ&'WGFöâ"FFÖ–ÖvR×¦ööÓÒ"G¶W66T‡FÖÂ†6&D'Gv÷&²†6&B’—Ò"FFÖ–ÖvRÖÆ&VÃÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò"&–ÖÆ&VÃÒ$w&æF—"G¶W66T‡FÖÂ†6&BææÖR—Ò#ãÆ–Ör7&3Ò"G¶W66T‡FÖÂ†6&D'Gv÷&²†6&B’—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò"óãÂö'WGFöãæ¢"'ÓÇ7G&öæsâG¶W66T‡FÖÂ†6&BææÖR—ÓÂ÷7G&öæsãÂö'F–6ÆSæ’æ¦ö–â‚""’¢#ÇäÆL:–fW76RW7Bf–FRãÂ÷â'ÓÂöF—cãÂöF—cæ°¢6öç7B6Æ÷6RÒ‚’ÓâF–Æörç&VÖ÷fR‚“°¢F–ÆörçVW'•6VÆV7F÷"‚&'WGFöâ"’æFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6Æ÷6R“°¢F–ÆöræFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ²–b†WfVçBçF&vWBÓÓÒF–Æör’6Æ÷6R‚“²Ò“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†F–Æör“°¢GF6„–ÖvU¦ööÔ†æFÆW'2†F–Æör“°§Ð ¦gVæ7F–öâ÷VåVÇF–ÖFT6&E&V6÷fW'”6†ö–6R‡Æ–W$–æFW‚Â6÷W&6R’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B6&G2Ò6÷W&6RÓÓÒ&FV6²"ò‡7FFRçVÇF–ÖFTFV6·5·Æ–W$–æFW…ÒÇÂµÒ’¢‡7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…ÒÇÂµÒ“°¢–b‚6&G2æÆVæwF‚’°¢7FFRæÆörçVç6†–gB‡6÷W&6RÓÓÒ&FV6²"ò$Æ–ö6†RW7Bf–FRâ"¢$ÆL:–fW76RW7Bf–FRâ"“°¢&WGW&ã°¢Ð¢6öç7BF–ÆörÒFö7VÖVçBæ7&VFTVÆVÖVçB‚'6V7F–öâ"“°¢F–Æöræ6Æ74æÖRÒ'VÇF–ÖFRÖF–Æör#°¢F–Æöræ–ææW$…DÔÂÒÆF—b6Æ73Ò'VÇF–ÖFRÖF–ÆörÖ6&B#ãÇ6Æ73Ò&W–V'&÷r#ä6†ö—‚Fç2G·6÷W&6RÓÓÒ&FV6²"ò&Æ–ö6†R"¢&ÆL:–fW76R'ÓÂ÷ãÆƒ#ä6†ö—6—76W¢VæR6'FR:,:–7W:—&W#Âöƒ#âG·6÷W&6RÓÓÒ&FV6²"òsÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6æ6VÂ×&V6÷fW'“äæçVÆW"WB&WfVæ—"RL:–'WBGRF÷W#Âö'WGFöãâr¢"'ÓÆF—b6Æ73Ò'VÇF–ÖFRÖF—66&BÖw&–B#âG¶6&G2æÖ‚†6&B’ÓâÆ'WGFöâ6Æ73Ò'VÇF–ÖFRÖG&gBÖ6&B"G—SÒ&'WGFöâ"FF×&V6÷fW"×VÇF–ÖFSÒ"G¶W66T‡FÖÂ†6&BçV–B—Ò#ãÆ–Ör7&3Ò"G¶W66T‡FÖÂ†6&D'Gv÷&²†6&B’—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò#ãÇ7G&öæsâG¶W66T‡FÖÂ†6&BææÖR—ÓÂ÷7G&öæsãÂö'WGFöãæ’æ¦ö–â‚""—ÓÂöF—cãÂöF—cæ°¢F–ÆörçVW'•6VÆV7F÷"‚%¶FFÖ6æ6VÂ×&V6÷fW'•Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢F–Æörç&VÖ÷fR‚“°¢&W7F÷&UGW&å6æ6†÷B‚“°¢Ò“°¢F–ÆörçVW'•6VÆV7F÷$ÆÂ‚%¶FF×&V6÷fW"×VÇF–ÖFUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B6VÆV7FVBÒ6&G2æf–æB‚†6&B’Óâ6&BçV–BÓÓÒ'WGFöâæFF6WBç&V6÷fW%VÇF–ÖFR“°¢–b‚6VÆV7FVB’&WGW&ã°¢Æ–W"æ†æBçW6‚‡6VÆV7FVB“°¢–b‡6÷W&6RÓÓÒ&FV6²"’7FFRçVÇF–ÖFTFV6·5·Æ–W$–æFW…ÒÒ6‡VffÆR‡7FFRçVÇF–ÖFTFV6·5·Æ–W$–æFW…Òæf–ÇFW"‚†6&B’Óâ6&BçV–BÓÒ6VÆV7FVBçV–B’“°¢VÇ6R7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…ÒÒ7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…Òæf–ÇFW"‚†6&B’Óâ6&BçV–BÓÒ6VÆV7FVBçV–B“°¢7FFRæÆörçVç6†–gB†G¶F—7Æ•Æ–W$æÖR‡Æ–W"—Ò,:–7W:‡&RG·6VÆV7FVBææÖWÒæ“°¢F–Æörç&VÖ÷fR‚“°¢&VæFW"‚“°¢v–æF÷rç6WEF–ÖV÷WB†Ö–&U'Vå6öÆô’Â“°¢Ò’“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†F–Æör“°¢Væ&ÆUVÇF–ÖFTF–Æöt6&E&Wf–Ww2†F–ÆörÂ6&G2“°§Ð ¦gVæ7F–öâ÷VåVÇF–ÖFTÖ&´6†ö–6R‡Æ–W$–æFW‚Â&WV—&VD6÷VçBÂÆÆ÷u&W6W'fTF—66&BÂ6÷W&6T6&B’°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb‡Æ–W$–æFW‚“°¢6öç7B÷öæVçBÒ7FFRçÆ–W'5¶÷öæVçD–æFW…Ó°¢6öç7B6æF–FFW2Ò÷öæVçBçÆ–VBæf–ÇFW"‚†6&B’Óâ—56†÷B†6&B’bb6&Bç&VÖ÷fVBbb6&BæÖ&¶VDf÷$F—66&B“°¢–b‚6æF–FFW2æÆVæwF‚bb†ÆÆ÷u&W6W'fTF—66&Bbb÷öæVçBç&W6W'fRæÆVæwF‚’’°¢6WDVffV7Dæ÷F–6R‚'6ç26–&ÆR"Â6÷W&6T6&BÂ$V7Vâ4õUGfW'6Rf—6–&ÆRæRWWB&V6Wfö—"FRÖ'VWW"â"“°¢&WGW&ã°¢Ð¢6öç7B6VÆV7FVBÒæWr6WB‚“°¢TÅD”ÔDUôÔôDRæÖ&´6†ö–6RÒ²Æ–W$–æFW‚Â&WV—&VD6÷VçBÓ°¢6öç7BF–ÆörÒFö7VÖVçBæ7&VFTVÆVÖVçB‚'6V7F–öâ"“°¢F–Æöræ6Æ74æÖRÒ'VÇF–ÖFRÖF–Æör#°¢6öç7B–çBÒ‚’Óâ°¢6öç7BæVVFVBÒÖF‚æÖ–â‡&WV—&VD6÷VçBÂ6æF–FFW2æÆVæwF‚“°¢F–Æöræ–ææW$…DÔÂÒÆF—b6Æ73Ò'VÇF–ÖFRÖF–ÆörÖ6&B#ãÇ6Æ73Ò&W–V'&÷r#å÷Wfö—"+rÖ'VWW"L:–fW76SÂ÷ãÆƒ#ä6†ö—6—76W¢G¶æVVFVGÒ4õUG¶æVVFVBâò%2"¢"'ÒGfW'6RG¶æVVFVBâò'2"¢"'ÓÂöƒ#ãÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6æ6VÂÖÖ&²Ö6†ö–6SäæçVÆW"WB&WfVæ—"RL:–'WBGRF÷W#Âö'WGFöããÇäÆW26'FW26†ö—6–W26W&öçBÖ'\:–W2Vâ&ÆWR7W"ÆRÆFVRWBæR÷W'&öçB2&V¦ö–æG&RÆ,:—6W'fRãÂ÷ãÆF—b6Æ73Ò'VÇF–ÖFRÖG&gBÖ6&G2#âG¶6æF–FFW2æÖ‚†6&B’ÓâÆ'WGFöâ6Æ73Ò'VÇF–ÖFRÖG&gBÖ6&BG·6VÆV7FVBæ†2†6&BçÆ–VEV–B’ò'6VÆV7FVB"¢"'Ò"G—SÒ&'WGFöâ"FFÖÖ&²Ö6&CÒ"G¶W66T‡FÖÂ†6&BçÆ–VEV–B—Ò#ãÆ–Ör7&3Ò"G¶W66T‡FÖÂ†6&D'Gv÷&²†6&B’—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò#ãÇ7G&öæsâG¶W66T‡FÖÂ†6&BææÖR—ÓÂ÷7G&öæsãÂö'WGFöãæ’æ¦ö–â‚""—ÓÂöF—câG¶ÆÆ÷u&W6W'fTF—66&Bbb÷öæVçBç&W6W'fRæÆVæwF‚òÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâVÇF–ÖFRÖÖ&²×&W6W'fRÖ6†ö–6R"G—SÒ&'WGFöâ"FFÖÖ&²ÖF—66&B×&W6W'fSì8ÆÆ6RÂL:–fW76W"VæR6'FRFRÆ,:—6W'fRGfW'6SÂö'WGFöãæ¢"'ÓÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâ"G—SÒ&'WGFöâ"FFÖ6öæf—&ÒÖÖ&·2G·6VÆV7FVBç6—¦RÓÓÒæVVFVBò""¢&F—6&ÆVB'Óä6öæf—&ÖW"ÆW2Ö'VWW'3Âö'WGFöããÂöF—cæ°¢F–ÆörçVW'•6VÆV7F÷"‚%¶FFÖ6æ6VÂÖÖ&²Ö6†ö–6UÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢TÅD”ÔDUôÔôDRæÖ&´6†ö–6RÒçVÆÃ°¢F–Æörç&VÖ÷fR‚“°¢&W7F÷&UGW&å6æ6†÷B‚“°¢Ò“°¢F–ÆörçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖÖ&²Ö6&EÒ"’æf÷$V6‚‚†'WGFöâ’Óâ'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7BV–BÒ'WGFöâæFF6WBæÖ&´6&C°¢–b‡6VÆV7FVBæ†2‡V–B’’6VÆV7FVBæFVÆWFR‡V–B“°¢VÇ6R–b‡6VÆV7FVBç6—¦RÂæVVFVB’6VÆV7FVBæFB‡V–B“°¢–çB‚“°¢Ò’“°¢F–ÆörçVW'•6VÆV7F÷"‚%¶FFÖ6öæf—&ÒÖÖ&·5Ò"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6æF–FFW2æf–ÇFW"‚†6&B’Óâ6VÆV7FVBæ†2†6&BçÆ–VEV–B’’æf÷$V6‚‚†6&B’Óâ²6&BæÖ&¶VDf÷$F—66&BÒG'VS²Ò“°¢7FFRæÆörçVç6†–gB†G·6VÆV7FVBç6—¦WÒ4õUG·6VÆV7FVBç6—¦Râò%2"¢"'ÒGfW'6RG·6VÆV7FVBç6—¦Râò'2"¢"'ÒÖ'\:’G·6VÆV7FVBç6—¦Râò'2"¢"'Ò÷W"ÆL:–fW76Ræ“°¢TÅD”ÔDUôÔôDRæÖ&´6†ö–6RÒçVÆÃ°¢F–Æörç&VÖ÷fR‚“°¢&VæFW"‚“°¢Ö–&U'Vå6öÆô’‚“°¢Ò“°¢F–ÆörçVW'•6VÆV7F÷"‚%¶FFÖÖ&²ÖF—66&B×&W6W'fUÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7BF—66&FVBÒ÷öæVçBç&W6W'fRç6†–gB‚“°¢–b†F—66&FVB’7FFRçVÇF–ÖFTF—66&G5¶÷öæVçD–æFW…ÒçW6‚†F—66&FVB“°¢TÅD”ÔDUôÔôDRæÖ&´6†ö–6RÒçVÆÃ°¢F–Æörç&VÖ÷fR‚“°¢&VæFW"‚“°¢Ö–&U'Vå6öÆô’‚“°¢Ò“°¢Væ&ÆUVÇF–ÖFTF–Æöt6&E&Wf–Ww2†F–ÆörÂ6æF–FFW2“°¢Ó°¢–çB‚“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†F–Æör“°§Ð ¦gVæ7F–öâ÷VåVÇF–ÖFT†æDF—66&D6†ö–6R‡Æ–W$–æFW‚Â&WV—&VD6÷VçBÂVæGW&æ6Tv–â’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢–b‚Æ–W"ÇÂ&WV—&VD6÷VçB’°¢–b‡Æ–W"’Æ–W"æVæGW&æ6RÒÖF‚æÖ–â…5D%D”äuôTäEU$ä4RÂÆ–W"æVæGW&æ6R²VæGW&æ6Tv–â“°¢&WGW&ã°¢Ð¢6öç7B6VÆV7FVBÒæWr6WB‚“°¢6öç7BF–ÆörÒFö7VÖVçBæ7&VFTVÆVÖVçB‚'6V7F–öâ"“°¢F–Æöræ6Æ74æÖRÒ'VÇF–ÖFRÖF–Æör#°¢6öç7B–çBÒ‚’Óâ°¢F–Æöræ–ææW$…DÔÂÒÆF—b6Æ73Ò'VÇF–ÖFRÖF–ÆörÖ6&B#ãÇ6Æ73Ò&W–V'&÷r#äVffWB+rVæGW&æ6SÂ÷ãÆƒ#ä6†ö—6—76W¢G·&WV—&VD6÷VçGÒ6'FRG·&WV—&VD6÷VçBâò'2"¢"'Ò:L:–fW76W#Âöƒ#ãÆ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6æ6VÂÖ†æBÖF—66&CäæçVÆW"WB&WfVæ—"RL:–'WBGRF÷W#Âö'WGFöããÇäÆW26'FW26†ö—6–W2&V¦ö–æG&öçBf÷G&RL:–fW76RÂV—2f÷W2,:–7W:—&W&W¢G¶VæGW&æ6Tv–çÒVæGW&æ6RãÂ÷ãÆF—b6Æ73Ò'VÇF–ÖFRÖG&gBÖ6&G2#âG·Æ–W"æ†æBæÖ‚†6&B’ÓâÆ'WGFöâ6Æ73Ò'VÇF–ÖFRÖG&gBÖ6&BG·6VÆV7FVBæ†2†6&BçV–B’ò'6VÆV7FVB"¢"'Ò"G—SÒ&'WGFöâ"FFÖF—66&BÖ†æCÒ"G¶W66T‡FÖÂ†6&BçV–B—Ò#ãÆ–Ör7&3Ò"G¶W66T‡FÖÂ†6&D'Gv÷&²†6&B’—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò#ãÇ7G&öæsâG¶W66T‡FÖÂ†6&BææÖR—ÓÂ÷7G&öæsãÂö'WGFöãæ’æ¦ö–â‚""—ÓÂöF—cãÆ'WGFöâ6Æ73Ò'&–Ö'’Ö'WGFöâ"G—SÒ&'WGFöâ"FFÖ6öæf—&ÒÖ†æBÖF—66&BG·6VÆV7FVBç6—¦RÓÓÒ&WV—&VD6÷VçBò""¢&F—6&ÆVB'Óä6öæf—&ÖW"ÆL:–fW76SÂö'WGFöããÂöF—cæ°¢F–ÆörçVW'•6VÆV7F÷"‚%¶FFÖ6æ6VÂÖ†æBÖF—66&EÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢F–Æörç&VÖ÷fR‚“°¢&W7F÷&UGW&å6æ6†÷B‚“°¢Ò“°¢F–ÆörçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖF—66&BÖ†æEÒ"’æf÷$V6‚‚†'WGFöâ’Óâ'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7BV–BÒ'WGFöâæFF6WBæF—66&D†æC°¢–b‡6VÆV7FVBæ†2‡V–B’’6VÆV7FVBæFVÆWFR‡V–B“°¢VÇ6R–b‡6VÆV7FVBç6—¦RÂ&WV—&VD6÷VçB’6VÆV7FVBæFB‡V–B“°¢–çB‚“°¢Ò’“°¢F–ÆörçVW'•6VÆV7F÷"‚%¶FFÖ6öæf—&ÒÖ†æBÖF—66&EÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢–b‡6VÆV7FVBç6—¦RÓÒ&WV—&VD6÷VçB’&WGW&ã°¢6öç7BF—66&FVBÒÆ–W"æ†æBæf–ÇFW"‚†6&B’Óâ6VÆV7FVBæ†2†6&BçV–B’“°¢Æ–W"æ†æBÒÆ–W"æ†æBæf–ÇFW"‚†6&B’Óâ6VÆV7FVBæ†2†6&BçV–B’“°¢7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…ÒçW6‚‚ââæF—66&FVB“°¢Æ–W"æVæGW&æ6RÒÖF‚æÖ–â…5D%D”äuôTäEU$ä4RÂÆ–W"æVæGW&æ6R²VæGW&æ6Tv–â“°¢7FFRæÆörçVç6†–gB†G¶F—7Æ•Æ–W$æÖR‡Æ–W"—Ò6†ö—6—BWBL:–fW76RG¶F—66&FVBæÆVæwF‡Ò6'FR‡2’ÂV—2,:–7W:‡&RG¶VæGW&æ6Tv–çÒVæGW&æ6Ræ“°¢F–Æörç&VÖ÷fR‚“°¢&VæFW"‚“°¢Ò“°¢Væ&ÆUVÇF–ÖFTF–Æöt6&E&Wf–Ww2†F–ÆörÂÆ–W"æ†æB“°¢Ó°¢–çB‚“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†F–Æör“°§Ð ¦gVæ7F–öâ&VæFW%Æ–W%æVÂ‡Æ–W$–æFW‚Â&ö÷B’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7BÆö6ÅÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢&ö÷BæFF6WBæFW6·F÷&öÆRÒÆ–W$–æFW‚ÓÓÒÆö6ÅÆ–W$–æFW‚ò&Æö6Â"¢&÷öæVçB#°¢&ö÷BæFF6WBçÆ–W$–æFW‚Ò7G&–ær‡Æ–W$–æFW‚“°¢6öç7B74F—6&ÆVBÒÆ–W$–æFW‚ÓÒ7FFRæ7F—fUÆ–W"ÇÂ7FFRævÖT÷fW"ÇÂ6åW6U6VB‡Æ–W$–æFW‚’ÇÂGWF÷&–ÄÆÆ÷w572‚“°¢6öç7B—4•Æ–W"Ò4ôÄõô’æVæ&ÆVBbbÆ–W$–æFW‚ÓÓÒ4ôÄõô’çÆ–W$–æFWƒ°¢6öç7BF÷W&æÖVçDVçG'’Ò—4•Æ–W"òÆ–W"æ6†&7FW$–B¢…TÔåõDõU$äÔTåEôTåE%“°¢6öç7B&æ²ÒÆ–W"çv÷&ÆE&æ²ÇÂ‡7FFRçF÷W&æÖVçBæ7F—fRòF÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’‡F÷W&æÖVçDVçG'’’¢çVÆÂ“°¢6öç7B–çFVÆÆ–vVæ6RÒ—4•Æ–W ¢ò‡7FFRçF÷W&æÖVçBæ7F—fP¢ò”–çFVÆÆ–vVæ6Tf÷$VçG'’‡Æ–W"æ6†&7FW$–BÂ7FFRçF÷W&æÖVçBæF–ff–7VÇG’¢¢æ÷&ÖÆ—¦T”–çFVÆÆ–vVæ6R…4ôÄõô’ç7G–ÆR’¢¢çVÆÃ°¢6öç7B–çFVÆÆ–vVæ6TÆ&VÂÒ°¢ÖFWW#¢$ÖFWW""À¢æ÷&ÖÃ¢$æ÷&ÖÂ"À¢W‡W'C¢$W‡W'B"À¢6†×–öã¢$6†×–öâ"À¢ÆVvVæC¢$Ì:–vVæF—&R"À¢Õ¶–çFVÆÆ–vVæ6UÒÇÂ$æ÷&ÖÂ#°¢6öç7BVffV7D&FvW2Ò7F—fTVffV7D&FvW2‡Æ–W$–æFW‚“°¢6öç7B&öçW4Æ&VÇ2Ò°¢ââæVffV7D&FvW2æÖ‚†&FvR’Óâ&FvRæÆ&VÂ’À¢ââç7W&f6T&öçW6W4f÷%Æ–W"‡Æ–W"’æÖ‚†&öçW2’Óâ&öçW2æÆ&VÂ’À¢âââ‡Æ–W"çW&ÖæVçD&öçW6W2óòµÒ’æÖ‚†&öçW2’Óâ&öçW2æÆ&VÂ’À¢Òæf–ÇFW"„&ööÆVâ’æf–ÇFW"‚†Æ&VÂÂ–æFW‚ÂÆ&VÇ2’ÓâÆ&VÇ2æ–æFW„öb†Æ&VÂ’ÓÓÒ–æFW‚“°¢6öç7B6†÷u74'WGFöâÒÆ–W$–æFW‚ÓÓÒ7FFRæ7F—fUÆ–W ¢bb7FFRævÖT÷fW ¢bb6åW6U6VB‡Æ–W$–æFW‚¢bbGWF÷&–ÄÆÆ÷w572‚¢bb‚†5Æ–VEF†—5GW&â‡Æ–W$–æFW‚’ÇÂ6å74gFW$—'&WfW'6–&ÆTG&t–×76R‡Æ–W$–æFW‚’“°¢6öç7B75&ö¦V7F–öâÒ6†÷u74'WGFöâòÖö&–ÆU75&ö¦V7F–öâ‡Æ–W$–æFW‚’¢çVÆÃ°¢&ö÷Bæ6Æ74Æ—7BçFövvÆR‚&7F—fR"ÂÆ–W$–æFW‚ÓÓÒ7FFRæ7F—fUÆ–W"bb7FFRævÖT÷fW"“°¢&ö÷Bæ–ææW$…DÔÂÒ ¢Æ†VFW"6Æ73Ò'Æ–W"Ö†VFW""&–Ö†–FFVãÒ'G'VR#ãÂö†VFW#à¢G·&VæFW$6†&7FW$6&B‡Æ–W"ÂÆ–W$–æFW‚Â°¢FW6·F÷&öÆS¢Æ–W$–æFW‚ÓÓÒÆö6ÅÆ–W$–æFW‚ò&Æö6Â"¢&÷öæVçB"À¢&æ²À¢—4•Æ–W"À¢–çFVÆÆ–vVæ6TÆ&VÂÀ¢&öçW46÷VçC¢&öçW4Æ&VÇ2æÆVæwF‚À¢6†÷u74'WGFöâÀ¢74F—6&ÆVBÀ¢75&W7VÇD6Æ73¢75&ö¦V7F–öãòçv–ææW"ÓÓÒ%Ä”U""ò'72Ö'WGFöâÒ×v–ææ–ær"¢'72Ö'WGFöâÒÖÆ÷6–ær"À¢75&ö¦V7F–öäÆ&VÃ¢75&ö¦V7F–öãòæÆ&VÂÇÂ%76W""À¢Ò—Ð¢G·&VæFW%VÇF–ÖFU&W6÷W&6W2‡Æ–W$–æFW‚—Ð¢ÆF—b6Æ73Ò&†æBG·GWF÷&–Äfö7W46Æ72‚&†æB"ÂÆ–W$–æFW‚—Ò#à¢G·Æ–W"æ†æBæÖ‚†6&B’Óâ&VæFW$6&B‡Æ–W$–æFW‚Â6&B’’æ¦ö–â‚""—Ð¢G·&VæFW%VÇF–ÖFU&W6W'fT–ä†æB‡Æ–W$–æFW‚—Ð¢ÂöF—cà¢ÆF—b6Æ73Ò'Æ–VBÖ†—7F÷'’#à¢Ç6Æ73Ò&VævvVB×F—FÆR#ä6'FW2¦÷\:–W3Â÷à¢G·&VæFW%Æ–VD†—7F÷'’‡Æ–W"—Ð¢ÂöF—cà¢° ¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FF×75Ò"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7BÆ–W$–æFW‚ÒçVÖ&W"†'WGFöâæFF6WBç72“°¢72‡Æ–W$–æFW‚“°¢6ö×ÆWFUGWF÷&–Ä7F–öâ‡²¶–æC¢'72"ÂÆ–W$–æFW‚Ò“°¢Ò“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ÷Vâ×VÇF–ÖFRÖVæW&w•Ò"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ÷VåVÇF–ÖFTVæW&w”6†ö–6R„çVÖ&W"†'WGFöâæFF6WBæ÷VåVÇF–ÖFTVæW&w’’’“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ÷Vâ×VÇF–ÖFRÖF—66&EÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ÷VåVÇF–ÖFTF—66&B„çVÖ&W"†'WGFöâæFF6WBæ÷VåVÇF–ÖFTF—66&B’’“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FF×VÇF–ÖFRÖ6†&7FW"×7FFUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ÷VåVÇF–ÖFT6†&7FW%7FFR„çVÖ&W"†'WGFöâæFF6WBçVÇF–ÖFT6†&7FW%7FFR’’“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FF×W6R×&W6W'fUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B7F÷&VD6&BÒÆ–W"ç&W6W'fRæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ'WGFöâæFF6WBçW6U&W6W'fR“°¢6öç7B6&BÒ&W7F÷&UVÇF–ÖFT6&E&–çFVE7FFR‡7F÷&VD6&B“°¢–b‚6&BÇÂ7FFRævÖT÷fW"’&WGW&ã°¢Æ–W"ç&W6W'fRÒÆ–W"ç&W6W'fRæf–ÇFW"‚†—FVÒ’Óâ—FVÒçV–BÓÒ6&BçV–B“°¢6&Båög&öÕ&W6W'fRÒG'VS°¢Æ–W"æ†æBçW6‚†6&B“°¢7FFRæÆörçVç6†–gB†G¶F—7Æ•Æ–W$æÖR‡Æ–W"—Ò¦÷VRG¶6&BææÖWÒFWV—26,:—6W'fR¢Æ6'FR&W7FRÖ'\:–Ræ“°¢Æ”6&B‡Æ–W$–æFW‚Â6&BçV–BÂfÇ6RÂçVÆÂÂ—5&VÖ—6R†6&B’ò&VffV7B"¢&æ÷&ÖÂ"“°¢–b‡Æ–W"æ†æBç6öÖR‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ6&BçV–B’’°¢Æ–W"æ†æBÒÆ–W"æ†æBæf–ÇFW"‚†—FVÒ’Óâ—FVÒçV–BÓÒ6&BçV–B“°¢FVÆWFR6&Båög&öÕ&W6W'fS°¢Æ–W"ç&W6W'fRçW6‚†6&B“°¢7FFRæÆörç6†–gB‚“°¢&VæFW"‚“°¢Ð¢Ò“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ&ö÷7B×&W6W'fUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B7F÷&VD6&BÒÆ–W"ç&W6W'fRæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ'WGFöâæFF6WBæ&ö÷7E&W6W'fR“°¢6öç7B6&BÒ&W7F÷&UVÇF–ÖFT6&E&–çFVE7FFR‡7F÷&VD6&B“°¢–b‚6&BÇÂ7FFRævÖT÷fW"’&WGW&ã°¢Æ–W"ç&W6W'fRÒÆ–W"ç&W6W'fRæf–ÇFW"‚†—FVÒ’Óâ—FVÒçV–BÓÒ6&BçV–B“°¢6&Båög&öÕ&W6W'fRÒG'VS°¢6&Bå÷VæF–æu&W6W'fT&ö÷7BÒG'VS°¢Æ–W"æ†æBçW6‚†6&B“°¢÷Vä&ö÷7DÖöFÂ‡Æ–W$–æFW‚Â6&BçV–B“°¢Ò“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖVæB×GW&åÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7BÆ–W$–æFW‚ÒçVÖ&W"†'WGFöâæFF6WBæVæEGW&â“°¢VæEGW&â‡Æ–W$–æFW‚“°¢6ö×ÆWFUGWF÷&–Ä7F–öâ‡²¶–æC¢&VæEGW&â"ÂÆ–W$–æFW‚Ò“°¢Ò“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FF×VæFò×GW&åÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ&W7F÷&UGW&å6æ6†÷B‚’“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖVffV7BÖ†VÇÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ÷VäVffV7D†VÇF–Æör†'WGFöâ’“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ÷VâÖFW6·F÷Ö&öçW6W5Ò"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ÷VäFW6·F÷&öçW4F–Æör„çVÖ&W"†'WGFöâæFF6WBæ÷VäFW6·F÷&öçW6W2’’“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FF×GWF÷&–Â×6VÆV7EÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢WfVçBç7F÷&÷vF–öâ‚“°¢6VÆV7EGWF÷&–Ä6&B„çVÖ&W"†'WGFöâæFF6WBçGWF÷&–ÅÆ–W"’Â'WGFöâæFF6WBçGWF÷&–Å6VÆV7B“°¢Ò“°¢Ò“°¢&ö÷BçVW'•6VÆV7F÷$ÆÂ‚%¶FF×GWF÷&–ÂÖ6&EÒ"’æf÷$V6‚‚†6&DVÆVÖVçB’Óâ°¢6öç7B6VÆV7BÒ‚’Óâ6VÆV7EGWF÷&–Ä6&B„çVÖ&W"†6&DVÆVÖVçBæFF6WBçGWF÷&–ÅÆ–W"’Â6&DVÆVÖVçBæFF6WBçGWF÷&–Ä6&B“°¢6&DVÆVÖVçBæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6VÆV7B“°¢6&DVÆVÖVçBæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Â†WfVçB’Óâ°¢–b‚²$VçFW""Â"%Òæ–æ6ÇVFW2†WfVçBæ¶W’’’&WGW&ã°¢WfVçBç&WfVçDFVfVÇB‚“°¢6VÆV7B‚“°¢Ò“°¢Ò“°§Ð ¦gVæ7F–öâ&VæFW$6&D76—7E&Wf–Wr‡Æ–W$–æFW‚Â6&BÂ6÷7BÂ&ö÷7DÆÆ÷vVB’°¢–b‚tÔUÄ•ô54•5Bæ–æf÷&ÖF–öâ’&WGW&â"#°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7Bæ÷&ÖÅ7FG2ÒvWD6&E7FG2‡Æ–W"Â6&BÂfÇ6R“°¢6öç7B&ö÷7E7FG2Ò&ö÷7DÆÆ÷vVBòvWD6&E7FG2‡Æ–W"Â6&BÂG'VR’¢çVÆÃ°¢6öç7B6–væVBÒ‡fÇVR’ÓâG·fÇVRãÒò"²"¢"'ÒG·fÇVWÖ°¢&WGW&â ¢ÆF—b6Æ73Ò&6&BÖ76—7B×&Wf–WrG¶&ö÷7E7FG2ò&†2Ö&ö÷7B"¢"'Ò"&–ÖÆ&VÃÒ%,:—f—7VÆ—6F–öâFRÆ6'FR#à¢Ç7ããÇ6ÖÆÃãÆ’6Æ73Ò&6&BÖ76—7BÖ–6öâ6&BÖ76—7BÖ–6öâÒ×÷vW""&–ÖÆ&VÃÒ%V—76æ6R#ãÂö“ãÂ÷6ÖÆÃãÇ7G&öæsâG·6–væVB†æ÷&ÖÅ7FG2ç÷vW"—ÓÂ÷7G&öæsãÂ÷7ãà¢Ç7ããÇ6ÖÆÃãÆ’6Æ73Ò&6&BÖ76—7BÖ–6öâ6&BÖ76—7BÖ–6öâÒÖVæGW&æ6R"&–ÖÆ&VÃÒ$VæGW&æ6R#ãÂö“ãÂ÷6ÖÆÃãÇ7G&öæsâG·6–væVB‚Ö6÷7B—ÓÂ÷7G&öæsãÂ÷7ãà¢G¶&ö÷7E7FG2òÇ7â6Æ73Ò&6&BÖ76—7BÖ&ö÷7B#ãÇ6ÖÆÃä$ôõ5CÂ÷6ÖÆÃãÇ7G&öæsâG·6–væVB†&ö÷7E7FG2ç÷vW"—ÓÂ÷7G&öæsãÂ÷7ãæ¢"'Ð¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ&VæFW$6&B‡Æ–W$–æFW‚Â6&B’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7BFV×÷&&–Ç•&WfVÆVBÒ—4÷öæVçD†æEFV×÷&&–Ç•&WfVÆVB‡Æ–W$–æFW‚“°¢6öç7B—4†–FFVâÒFV×÷&&–Ç•&WfVÆVBbb…5T5DDõ%ôÔôDRæVæ&ÆVBÇÂ…4U%dU%õ5”ä2æVæ&ÆV@¢òÆ–W$–æFW‚ÓÒ4U%dU%õ5”ä2ç6V@¢¢4ôÄõô’æVæ&ÆV@¢òÆ–W$–æFW‚ÓÓÒ4ôÄõô’çÆ–W$–æFW‚bb‡7FFRævÖT÷fW"bb7FFRç&WfVÄ”6&G2¢¢Æ–W$–æFW‚ÓÒ7FFRæ7F—fUÆ–W"bb7FFRævÖT÷fW"’“°¢6öç7BVffV7DÖöFTÆÆ÷vVBÒ6åÆ”VffV7DÖöFR‡Æ–W$–æFW‚Â6&B’bbGWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂ&VffV7B"ÂfÇ6R“°¢6öç7BÆ6VÖVçDÖöFTÆÆ÷vVBÒ6åÆ”æ÷&ÖÂ‡Æ–W$–æFW‚Â6&B’bbGWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂ'Æ6VÖVçB"ÂfÇ6R“°¢6öç7Bæ÷&ÖÄÆÆ÷vVBÒ6åÆ”æ÷&ÖÂ‡Æ–W$–æFW‚Â6&B’bbGWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂ&æ÷&ÖÂ"ÂfÇ6R“°¢6öç7B&ö÷7DÆÆ÷vVBÒ6åÆ”&ö÷7B‡Æ–W$–æFW‚Â6&B’bbGWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂ&&ö÷7B"ÂG'VR“°¢6öç7B6&EÆ–&ÆRÒæ÷&ÖÄÆÆ÷vVBÇÂVffV7DÖöFTÆÆ÷vVBÇÂÆ6VÖVçDÖöFTÆÆ÷vVBÇÂ&ö÷7DÆÆ÷vVC°¢6öç7BFW6·F÷6&DÆö6¶VBÒÆ–W$–æFW‚ÓÓÒ7FFRæ7F—fUÆ–W"bb7FFRævÖT÷fW"bb6&EÆ–&ÆS°¢6öç7B6÷7BÒVffV7F—fT6÷7B‡Æ–W"Â6&B“°¢6öç7B7FG2ÒvWD6&E7FG2‡Æ–W"Â6&BÂfÇ6R“°¢6öç7BÆ6VÖVçEF÷FÂÒF÷FÅGW&åÆ6VÖVçB‡Æ–W$–æFW‚Â6&BÂfÇ6R“°¢6öç7BÆ6VÖVçD—77VRÒ—5&VÖ—6R†6&B’bb7FFRæÆ7D6&BbbÆ6VÖVçEF÷FÂÂ&WV—&VEÆ6VÖVçDf÷$Æ7D6&B‚’bb7FFRçGW&ä–væ÷&W5Æ6VÖVçE·Æ–W$–æFW…Ó°¢6öç7B&VÖ—6UÆ6VÖVçD—77VRÒ—5&VÖ—6R†6&B’bb7FFRæÆ7D6&BbbÆ6VÖVçEF÷FÂÂ&WV—&VEÆ6VÖVçDf÷$Æ7D6&B‚’bb7FFRçGW&ä–væ÷&W5Æ6VÖVçE·Æ–W$–æFW…Òbb7FFRçGW&ä6ææ÷D÷Vä&ö÷7E·Æ–W$–æFW…Ó°¢6öç7B–ÖvUW&ÂÒ6&Bæ'Gv÷&²ÇÂ4$Eô”ÔtU5¶6&Bæ–EÓ°¢6öç7B†4G–æÖ–57FG2Ò7FG2ç&V6—6–öâÓÒ6&Bç&V6—6–öâÇÂ7FG2çÆ6VÖVçBÓÒ6&BçÆ6VÖVçBÇÂ6÷7BÓÒ6&Bæ6÷7BÇÂ7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…Òâ°¢6öç7BG–æÖ–57FD6÷VçBÒ¶6÷7BÓÒ6&Bæ6÷7BÂ7FG2ç&V6—6–öâÓÒ6&Bç&V6—6–öâÂ7FG2çÆ6VÖVçBÓÒ6&BçÆ6VÖVçBÇÂ7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…ÕÒæf–ÇFW"„&ööÆVâ’æÆVæwFƒ°¢6öç7B6†÷tf÷&&–DVffV7BÒÆ–W$–æFW‚ÓÓÒ7FFRæ7F—fUÆ–W"bb—4æW‡DVffV7D6æ6VÆVDf÷"‡Æ–W$–æFW‚’bb&ööÆVâ†6&BæVffV7EG—R“°¢6öç7B6†÷uÆ6VÖVçEv&æ–ærÒtÔUÄ•ô54•5Bæ–æf÷&ÖF–öâbb7FFRæÖæFF÷'•Æ6VÖVçC°¢6öç7B&—6·•Æ”6Æ72ÒÆ6VÖVçD—77VRbb7FFRæÖæFF÷'•Æ6VÖVçBò"&—6·’×Æ’Ö'WGFöâ"¢"#°¢6öç7B&—6·•&VÖ—6T6Æ72Ò&VÖ—6UÆ6VÖVçD—77VRbb7FFRæÖæFF÷'•Æ6VÖVçBò"&—6·’×Æ’Ö'WGFöâ"¢"#°¢6öç7BW‡V7FVEGWF÷&–Ä7F–öâÒGWF÷&–ÄW‡V7FVD7F–öâ‚“°¢6öç7BGWF÷&–Å6VÆV7DÖöFRÒ7FFRçGWF÷&–Âæ7F—fRbbW‡V7FVEGWF÷&–Ä7F–öãòæ¶–æBÓÓÒ'6VÆV7D6&B"bbW‡V7FVEGWF÷&–Ä7F–öâçÆ–W$–æFW‚ÓÓÒÆ–W$–æFWƒ°¢6öç7BGWF÷&–Å6VÆV7FVD6Æ72Ò7FFRçGWF÷&–Âç6VÆV7FVD6&EV–BÓÓÒ6&BçV–Bò"GWF÷&–Â×6VÆV7FVBÖ6&B"¢"#°¢6öç7BGWF÷&–Ä6&Dfö7W46Æ72ÒGWF÷&–Äfö7W46Æ72‚&6&B"ÂÆ–W$–æFW‚Â6&Bæ–B“°¢6öç7B–æ†W&—FVDG&tævÆT6Æ72Ò6&BæFW6·F÷†æDævÆRò"G&vâÖ6&BÖ–æ†W&—FVBÖævÆR"¢"#°¢6öç7BFW6·F÷†æDævÆU7G–ÆRÒ6&BæFW6·F÷†æDævÆP¢ò7G–ÆSÒ"ÒÖG&vâÖ6&BÖævÆS¢G¶W66T‡FÖÂ†6&BæFW6·F÷†æDævÆR—Ò& ¢¢"#°¢–b†—4†–FFVâ’°¢&WGW&â ¢Æ'F–6ÆR6Æ73Ò&6&B†2×f—7VÂ†–FFVâÖ†æBÖ6&BG¶–æ†W&—FVDG&tævÆT6Æ77Ò"G¶FW6·F÷†æDævÆU7G–ÆWÒFFÖ†æBÖ6&B×V–CÒ"G¶W66T‡FÖÂ†6&BçV–B—Ò"FFÖ†æB×Æ–W#Ò"G·Æ–W$–æFW‡Ò#à¢G·&VæFW$6&D&6²‚""ÂÆ–W$–æFW‚—Ð¢Âö'F–6ÆSà¢°¢Ð¢&WGW&â ¢Æ'F–6ÆR6Æ73Ò&6&BG¶–ÖvUW&Âò&†2×f—7VÂ"¢"'ÒG¶—5&VÖ—6R†6&B’ò'&VÖ—6RÖ6&B"¢"'ÒG¶FW6·F÷6&DÆö6¶VBò'VçÆ–&ÆRFW6·F÷Ö†æBÖ6&BÒÖÆö6¶VB"¢7FFRævÖT÷fW"ò&W†6†ævRÖ6ö×ÆWFRÖ6&B"¢"'ÒG·GWF÷&–Å6VÆV7DÖöFRò"GWF÷&–Â×6VÆV7F&ÆRÖ6&B"¢"'ÒG·GWF÷&–Å6VÆV7FVD6Æ77ÒG·GWF÷&–Ä6&Dfö7W46Æ77ÒG¶–æ†W&—FVDG&tævÆT6Æ77Ò"G¶FW6·F÷†æDævÆU7G–ÆWÒFF×GWF÷&–ÂÖ6&CÒ"G¶6&BçV–GÒ"FF×GWF÷&–ÂÖ6&BÖ–CÒ"G¶6&Bæ–GÒ"FF×GWF÷&–Â×Æ–W#Ò"G·Æ–W$–æFW‡Ò"FFÖ†æBÖ6&B×V–CÒ"G¶W66T‡FÖÂ†6&BçV–B—Ò"FFÖ†æB×Æ–W#Ò"G·Æ–W$–æFW‡Ò#à¢G·GWF÷&–Å6VÆV7DÖöFRòÆ'WGFöâ6Æ73Ò'GWF÷&–ÂÖ6&B×6VÆV7F÷""G—SÒ&'WGFöâ"FF×GWF÷&–Â×6VÆV7CÒ"G¶6&BçV–GÒ"FF×GWF÷&–Â×Æ–W#Ò"G·Æ–W$–æFW‡Ò"&–ÖÆ&VÃÒ%<:–ÆV7F–öææW"G¶W66T‡FÖÂ†6&BææÖR—Ò#ãÂö'WGFöãæ¢"'Ð¢G¶FW6·F÷6&DÆö6¶VBòsÇ7â6Æ73Ò&FW6·F÷Ö6&BÖÆö6²"&–ÖÆ&VÃÒ$6'FR–çWF–Æ—6&ÆR#ï	ùI#Â÷7ãâr¢"'Ð¢G¶–ÖvUW&Âò ¢Æ'WGFöâ6Æ73Ò&6&B×f—7VÂ6&BÖVffV7BÖf÷&&–BÖ†÷7B6&BÖ–ÖvR×¦ööÒ×G&–vvW""G—SÒ&'WGFöâ"FFÖ–ÖvR×¦ööÓÒ"G¶W66T‡FÖÂ†–ÖvUW&Â—Ò"FFÖ–ÖvRÖÆ&VÃÒ"G¶W66T‡FÖÂ†G¶6&BææÖWÒÒG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—Ö—Ò"&–ÖÆ&VÃÒ$w&æF—"G¶W66T‡FÖÂ†6&BææÖR—Ò#à¢Æ–Ör7&3Ò"G¶–ÖvUW&ÇÒ"ÇCÒ"G¶6&BææÖWÒÒG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—Ò"óà¢G·6†÷tf÷&&–DVffV7BòÆ–Ör6Æ73Ò&f÷&&–BÖVffV7BÖ÷fW&Æ’"7&3Ò"G´dõ$$”Eô”ÔtWÒ"ÇCÒ$VffWBæçVÌ:’"óæ¢"'Ð¢Âö'WGFöãà¢G´tÔUÄ•ô54•5Bæ6&DFW67&—F–öç2òÇ6V7F–öâ6Æ73Ò&6&B×&VF&ÆRÖFF"&–ÖÆ&VÃÒ$–æf÷&ÖF–öç2Æ—6–&ÆW2FRG¶W66T‡FÖÂ†6&BææÖR—Ò#à¢Æ†VFW#ãÇ7ãâG¶W66T‡FÖÂ†6&Bç7V'F—FÆRóò6&BæfÖ–Ç’—ÓÂ÷7ããÇ7G&öæsâG¶W66T‡FÖÂ†6&BææÖR—ÓÂ÷7G&öæsãÂö†VFW#à¢ÆF—b6Æ73Ò&6&B×&VF&ÆR×7FG2#à¢Ç7ããÇ6ÖÆÃä6ü;·CÂ÷6ÖÆÃãÇ7G&öæsâG¶6÷7GÓÂ÷7G&öæsãÂ÷7ãà¢Ç7ããÇ6ÖÆÃåV—76æ6SÂ÷6ÖÆÃãÇ7G&öæsâG·7FG2ç÷vW'ÓÂ÷7G&öæsãÂ÷7ãà¢Ç7ããÇ6ÖÆÃå,:–6—6–öãÂ÷6ÖÆÃãÇ7G&öæsâG·7FG2ç&V6—6–öçÓÂ÷7G&öæsãÂ÷7ãà¢Ç7ããÇ6ÖÆÃåÆ6VÖVçCÂ÷6ÖÆÃãÇ7G&öæsâG·7FG2çÆ6VÖVçGÒG·7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…Òò²G·7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…×Ö¢"'ÓÂ÷7G&öæsãÂ÷7ãà¢ÂöF—cà¢ÇãÆ#äVffWCÂö#âG¶W66T‡FÖÂ†6&BæVffV7BÇÂ$V7VâVffWBâ"—ÓÂ÷à¢Ç6Æ73Ò&6&B×&VF&ÆRÖ&ö÷7B#ãÆ#ä&ö÷7CÂö#âG¶6&Bæ&ö÷7E÷vW'ÒV—76æ6R+rG¶6&Bæ&ö÷7E&V6—6–öçÒ,:–6—6–öãÂ÷à¢Â÷6V7F–öãæ¢"'Ð¢¢ ¢G¶6&Bç7F"òsÆF—b6Æ73Ò&6&B×7F""&–ÖÆ&VÃÒ$6'FR:—Fö–ÆR#î)ˆSÂöF—câr¢"'Ð¢ÆF—b6Æ73Ò&6&B×F÷#à¢ÆF—b6Æ73Ò&'V&&ÆR6÷7B#âG¶6&Bæ6÷7GÓÂöF—cà¢ÆF—b6Æ73Ò&6&B×F—FÆR#à¢Ç7G&öæsâG¶6&BææÖWÓÂ÷7G&öæsà¢Ç7ãâG¶6&Bç7V'F—FÆRóò6&BæfÖ–Ç—ÓÂ÷7ãà¢ÂöF—cà¢ÆF—b6Æ73Ò&'V&&ÆR÷vW"#âG¶6&Bç÷vW'ÓÂöF—cà¢ÂöF—cà¢ÆF—b6Æ73Ò'7FG2#à¢ÆF—b6Æ73Ò'7FB&V6—6–öâ#å,:–6—6–öâG·7FG2ç&V6—6–öçÓÂöF—cà¢ÆF—b6Æ73Ò'7FBÆ6VÖVçB#åÆ6VÖVçBG·7FG2çÆ6VÖVçGÒG·7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…Òò²G·7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…×Ö¢"'ÓÂöF—cà¢ÂöF—cà¢ÆF—b6Æ73Ò&VffV7BG·6†÷tf÷&&–DVffV7Bò&VffV7BÖf÷&&–BÖ†÷7B"¢"'Ò#à¢G¶6&BæVffV7GÐ¢G·6†÷tf÷&&–DVffV7BòÆ–Ör6Æ73Ò&f÷&&–BÖVffV7BÖ÷fW&Æ’fÆÆ&6²"7&3Ò"G´dõ$$”Eô”ÔtWÒ"ÇCÒ$VffWBæçVÌ:’"óæ¢"'Ð¢ÂöF—cà¢G¶—5&VÖ—6R†6&B’òsÆF—b6Æ73Ò&&ö÷7BÖ&÷‚&VÖ—6RÖæ÷FR#å&VÖ—6R¢æRFW&Ö–æR2ÆRF÷W#ÂöF—câr¢ÆF—b6Æ73Ò&&ö÷7BÖ&÷‚#ä&ö÷7B¢G¶6&Bæ&ö÷7E÷vW'ÒV—76æ6R+rG¶6&Bæ&ö÷7E&V6—6–öçÒ,:–6—6–öãÂöF—cæÐ¢Ð¢ÆF—b6Æ73Ò&6&BÖ†÷fW"×æVÂ#à¢G¶–ÖvUW&Âbb†4G–æÖ–57FG2ò ¢ÆF—b6Æ73Ò'f—7VÂ×7FG2f—7VÂ×7FG2ÒÒG¶G–æÖ–57FD6÷VçGÒ#à¢G¶6÷7BÓÒ6&Bæ6÷7Bò ¢Ç7â6Æ73Ò'f—7VÂ×7FBf—7VÂ×7FBÒÒG¶6÷7BÂ6&Bæ6÷7Bò'÷6—F—fR"¢&æVvF—fR'Ò"&–ÖÆ&VÃÒ$VæGW&æ6R¢6ü;·B7GVVÂG¶6÷7GÒ"F—FÆSÒ$6ü;·BN(	–VæGW&æ6R7GVVÂ¢G¶6÷7GÒ#à¢Æ’6Æ73Ò'f—7VÂ×7FBÖ–6öâf—7VÂ×7FBÖ–6öâÒÖVæGW&æ6R"&–Ö†–FFVãÒ'G'VR#ãÂö“ãÇ7G&öæsâG¶6÷7GÓÂ÷7G&öæsà¢Â÷7ãà¢¢"'Ð¢G·7FG2ç&V6—6–öâÓÒ6&Bç&V6—6–öâò ¢Ç7â6Æ73Ò'f—7VÂ×7FBf—7VÂ×7FBÒÒG·7FG2ç&V6—6–öââ6&Bç&V6—6–öâò'÷6—F—fR"¢&æVvF—fR'Ò"&–ÖÆ&VÃÒ%,:–6—6–öâ7GVVÆÆRG·7FG2ç&V6—6–öçÒ"F—FÆSÒ%,:–6—6–öâ7GVVÆÆR¢G·7FG2ç&V6—6–öçÒ#à¢Æ’6Æ73Ò'f—7VÂ×7FBÖ–6öâf—7VÂ×7FBÖ–6öâÒ×&V6—6–öâ"&–Ö†–FFVãÒ'G'VR#ãÂö“ãÇ7G&öæsâG·7FG2ç&V6—6–öçÓÂ÷7G&öæsà¢Â÷7ãà¢¢"'Ð¢G·7FG2çÆ6VÖVçBÓÒ6&BçÆ6VÖVçBÇÂ7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…Òò‚‚’Óâ°¢6öç7B7W'&VçEÆ6VÖVçBÒçVÖ&W"‡7FG2çÆ6VÖVçBÇÂ’²çVÖ&W"‡7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…ÒÇÂ“°¢&WGW&âÇ7â6Æ73Ò'f—7VÂ×7FBf—7VÂ×7FBÒÒG¶7W'&VçEÆ6VÖVçBâ6&BçÆ6VÖVçBò'÷6—F—fR"¢7W'&VçEÆ6VÖVçBÂ6&BçÆ6VÖVçBò&æVvF—fR"¢&æWWG&Â'Ò"&–ÖÆ&VÃÒ%Æ6VÖVçB7GVVÂG¶7W'&VçEÆ6VÖVçGÒ"F—FÆSÒ%Æ6VÖVçB7GVVÂ¢G¶7W'&VçEÆ6VÖVçGÒ#à¢Æ’6Æ73Ò'f—7VÂ×7FBÖ–6öâf—7VÂ×7FBÖ–6öâÒ×Æ6VÖVçB"&–Ö†–FFVãÒ'G'VR#ãÂö“ãÇ7G&öæsâG¶7W'&VçEÆ6VÖVçGÓÂ÷7G&öæsà¢Â÷7ãæ°¢Ò’‚’¢"'Ð¢ÂöF—cà¢¢"'Ð¢G·&VæFW$6&D76—7E&Wf–Wr‡Æ–W$–æFW‚Â6&BÂ6÷7BÂ&ö÷7DÆÆ÷vVB—Ð¢ÆF—b6Æ73Ò&6&BÖ7F–öç2G¶—5&VÖ—6R†6&B’ò'&VÖ—6RÖ7F–öç2"¢"'Ò#à¢G¶—5&VÖ—6R†6&B’ò ¢Æ'WGFöâ6Æ73Ò'Æ’Ö'WGFöâVffV7BÖ'WGFöâG·&—6·•Æ”6Æ77Ò"G—SÒ&'WGFöâ"FF×Æ–W#Ò"G·Æ–W$–æFW‡Ò"FF×Æ“Ò"G¶6&BçV–GÒ"FFÖÖöFSÒ&VffV7B"G¶VffV7DÖöFTÆÆ÷vVBò""¢&F—6&ÆVB'ÓâG·GWF÷&–Ä'WGFöä7VR‚'Æ’"ÂÆ–W$–æFW‚Â6&BÂ&VffV7B"ÂfÇ6R—ÓÇ7â6Æ73Ò&6&BÖ7F–öâÖ6÷7B#ãÆ#âG¶6÷7GÓÂö#ãÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÂ÷7ããÇ7G&öæsäTddUCÂ÷7G&öæsãÂö'WGFöãà¢Æ'WGFöâ6Æ73Ò&&ö÷7BÖ'WGFöâ&VÖ—6RÖ'WGFöâG·&—6·•&VÖ—6T6Æ77Ò"G—SÒ&'WGFöâ"FF×Æ–W#Ò"G·Æ–W$–æFW‡Ò"FF×Æ“Ò"G¶6&BçV–GÒ"FFÖÖöFSÒ'Æ6VÖVçB"G·Æ6VÖVçDÖöFTÆÆ÷vVBò""¢&F—6&ÆVB'ÓâG·GWF÷&–Ä'WGFöä7VR‚'Æ’"ÂÆ–W$–æFW‚Â6&BÂ'Æ6VÖVçB"ÂfÇ6R—ÓÇ7â6Æ73Ò&6&BÖ7F–öâÖ6÷7B#ãÆ#âG¶6÷7GÓÂö#ãÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÂ÷7ããÇ7G&öæså$TÔ•4SÂ÷7G&öæsãÂö'WGFöãà¢¢ ¢Æ'WGFöâ6Æ73Ò'Æ’Ö'WGFöâGµTÅD”ÔDUôÔôDRæ7F—fRò"VÇF–ÖFRÖ6&B×Æ’Ö'WGFöâ"¢"'ÒG·&—6·•Æ”6Æ77ÒG·GWF÷&–Äfö7W46Æ72‚'Æ’"ÂÆ–W$–æFW‚Â6&Bæ–B—Ò"G—SÒ&'WGFöâ"FF×Æ–W#Ò"G·Æ–W$–æFW‡Ò"FF×Æ“Ò"G¶6&BçV–GÒ"G¶æ÷&ÖÄÆÆ÷vVBò""¢&F—6&ÆVB'ÓâG·GWF÷&–Ä'WGFöä7VR‚'Æ’"ÂÆ–W$–æFW‚Â6&BÂ&æ÷&ÖÂ"ÂfÇ6R—ÓÇ7â6Æ73Ò&6&BÖ7F–öâÖ6÷7B#ãÆ#âG¶6÷7GÓÂö#ãÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÂ÷7ãâGµTÅD”ÔDUôÔôDRæ7F—fRò""¢#Ç7G&öæsä¤õTU#Â÷7G&öæsâ'ÓÂö'WGFöãà¢Æ'WGFöâ6Æ73Ò&&ö÷7BÖ'WGFöâG·GWF÷&–Äfö7W46Æ72‚&&ö÷7B"ÂÆ–W$–æFW‚Â6&Bæ–B—Ò"G—SÒ&'WGFöâ"FF×Æ–W#Ò"G·Æ–W$–æFW‡Ò"FFÖ&ö÷7CÒ"G¶6&BçV–GÒ"G¶&ö÷7DÆÆ÷vVBò""¢&F—6&ÆVB'ÓâG·GWF÷&–Ä'WGFöä7VR‚'Æ’"ÂÆ–W$–æFW‚Â6&BÂ&&ö÷7B"ÂG'VR—ÓÇ7G&öæsä$ôõ5CÂ÷7G&öæsãÂö'WGFöãà¢Ð¢ÂöF—cà¢G·6†÷uÆ6VÖVçEv&æ–ærbb‡Æ6VÖVçD—77VRÇÂ&VÖ—6UÆ6VÖVçD—77VR’òsÆF—b6Æ73Ò'7FBÆ6VÖVçB&ö÷7B×v&æ–ær#åÄ4TÔTåB”å5Tdd•4åB+rÇ7G&öæsä$ôõ5BEdU%4Rõ54”$ÄSÂ÷7G&öæsãÂöF—câr¢"'Ð¢ÂöF—cà¢Âö'F–6ÆSà¢°§Ð ¦gVæ7F–öâ&VæFW%Æ–VD6&B†6&B’°¢6öç7BF÷FÅ÷vW"Ò†6&Bæ6&E÷vW$v–æVBóò6&Bç÷vW$v–æVB’²†6&BæVffV7E÷vW$v–æVBóò“°¢6öç7BVffV7E÷vW%FW‡BÒ6&BæVffV7E÷vW$v–æVBòFöçBG¶6&BæVffV7E÷vW$v–æVGÒVffWF¢"#°¢&WGW&â ¢ÆF—b6Æ73Ò'Æ–VBÖ6&BG¶6&Bæ&ö÷7FVBò&&ö÷7FVBÖ6&B"¢"'Ò#à¢Ç7G&öæsâG¶6&Bç&VÖ÷fVBò%&WF—,:–R+r"¢"'ÒG¶6&BææÖWÒG¶6&Bæ&ö÷7FVBò"$ôõ5B"¢"'ÓÂ÷7G&öæsà¢²G·F÷FÅ÷vW'ÒV—76æ6RG¶VffV7E÷vW%FW‡GÒ+r,:–6—6–öâG¶6&Bç&V6—6–öçÒ+rÆ6VÖVçBG¶6&BçÆ6VÖVçGÐ¢G¶6&Bç67&–f–6VD6&BòÆ'#ä&ö÷7Bœ:’fV2G¶6&Bç67&–f–6VD6&BææÖWÖ¢"'Ð¢ÂöF—cà¢°§Ð ¦gVæ7F–öâf÷&ÖDÆötÆ–æR†Æ–æR’°¢&WGW&âW66T‡FÖÂ†Æ–æR¢ç&WÆ6R‚õÅµÅ·F2ÖVffV7BÖ&ÇVS¢…µåÅÕÒ²•ÅÕÅÒörÂsÇ7G&öær6Æ73Ò&ÆörÖVffV7BÖ&ÇVR#âCÂ÷7G&öæsâr¢ç&WÆ6R‚õÅµÅ·F2ÖVffV7B×&÷6S¢…µåÅÕÒ²•ÅÕÅÒörÂsÇ7G&öær6Æ73Ò&ÆörÖVffV7B×&÷6R#âCÂ÷7G&öæsâr“°§Ð ¦gVæ7F–öâ7F–öäÆötVçG'•G—R†Æ–æR’°¢6öç7Bæ÷&ÖÆ—¦VBÒ7G&–ær†Æ–æRÇÂ""’çFôÆ÷vW$66R‚“°¢–b‚övvæWÇf–7Fö—&WÆ&–ÆâFRÂ|:–6†ævWÆ&–ÆâFRÎ(	œ:–6†ævWÇ66÷&Rf–æÇÇ66÷&RGR6WGÇ66÷&RGRÖF6‡Ì:–6†ævR2v',:§FWÌ:–6†ævRFW&Ö–ì:—ÆÖF6‚FW&Ö–ì:’òçFW7B†æ÷&ÖÆ—¦VB’’&WGW&â'&W7VÇB#°¢–b‚ö&ö÷7BòçFW7B†æ÷&ÖÆ—¦VB’’&WGW&â&&ö÷7B#°¢–b‚ò¦÷VRÆ¦÷VRòçFW7B†æ÷&ÖÆ—¦VB’’&WGW&â'6†÷B#°¢–b‚öVffWGÆ7F—fWÆL:–fW76WÇ–ö6†WÇ,:–7W:‡&WÇ&WF÷W&æR66'FWÆ&öçW2òçFW7B†æ÷&ÖÆ—¦VB’’&WGW&â&VffV7B#°¢–b‚ö6öçG&–çFWÆ–×÷76–&ÆWÆæRWWB7Æ–ç7Vff—6çBòçFW7B†æ÷&ÖÆ—¦VB’’&WGW&â'v&æ–ær#°¢&WGW&â'7—7FVÒ#°§Ð ¦gVæ7F–öâ7F–öäÆötVçG'”Æ&VÂ‡G—R’°¢&WGW&â°¢&W7VÇC¢%,:—7VÇFB"À¢&ö÷7C¢$$ôõ5B"À¢6†÷C¢$6÷W¦÷\:’"À¢VffV7C¢$VffWB"À¢v&æ–æs¢$GFVçF–öâ"À¢7—7FVÓ¢$–æf÷&ÖF–öâ"À¢Õ·G—UÒÇÂ$–æf÷&ÖF–öâ#°§Ð ¦gVæ7F–öâ7F–öäÆöt6&EF‡VÖ&æ–Â†Æ–æR’°¢6öç7Bæ÷&ÖÆ—¦VBÒ7G&–ær†Æ–æRÇÂ""’çFôÆö6ÆTÆ÷vW$66R‚&g""“°¢6öç7B6&BÒ4$EôÄ”%$%’æf–æB‚†—FVÒ’Óâæ÷&ÖÆ—¦VBæ–æ6ÇVFW2…7G&–ær†—FVÒææÖRÇÂ""’çFôÆö6ÆTÆ÷vW$66R‚&g""’’“°¢6öç7B–ÖvUW&ÂÒ6&Bò4$Eô”ÔtU5¶6&Bæ–EÒ¢çVÆÃ°¢&WGW&â–ÖvUW&ÂòÆ–Ör6Æ73Ò&7F–öâÖÆörÖ6&B×F‡VÖ&æ–Â"7&3Ò"G¶W66T‡FÖÂ†–ÖvUW&Â—Ò"ÇCÒ"G¶W66T‡FÖÂ†6&BææÖR—Ò"óæ¢"#°§Ð ¦gVæ7F–öâFW6·F÷W†6†ævU&W7VÇDFF†Æ–æR’°¢–b‚7G&–ær†Æ–æRÇÂ""’ç7F'G5v—F‚‚$&–ÆâFRÎ(	œ:–6†ævWÂ"’’&WGW&âçVÆÃ°¢6öç7B'G2Ò7G&–ær†Æ–æR’ç7Æ—B‚'Â"’ç6Æ–6Rƒ’æf–ÇFW"„&ööÆVâ“°¢6öç7B†VFÆ–æRÒ'G2ç6†–gB‚’ÇÂ%,:—7VÇFBFRÎ(	œ:–6†ævR#°¢6öç7B¶÷WF6öÖRÂv–ææW$æÖRÒ%f–çVWW"%ÒÒ†VFÆ–æRç7Æ—B‚õÇ2¾(	EÇ2²òÂ"“°¢6öç7Bæ÷&ÖÆ—¦VEv–ææW"Ò7G&–ær‡v–ææW$æÖR’çG&–Ò‚’çFôÆö6ÆTÆ÷vW$66R‚&g""“°¢6öç7Bv–ææW$–æFW‚Ò7FFRçÆ–W'2æf–æD–æFW‚‚‡Æ–W"’Óâ€¢¶F—7Æ•Æ–W$æÖR‡Æ–W"’ÂÆ–W#òææÖRÂÆ–W#òææ–6¶æÖUÐ¢æf–ÇFW"„&ööÆVâ¢ç6öÖR‚†æÖR’Óâ7G&–ær†æÖR’çG&–Ò‚’çFôÆö6ÆTÆ÷vW$66R‚&g""’ÓÓÒæ÷&ÖÆ—¦VEv–ææW"¢’“°¢6öç7BÆö6ÅÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢6öç7Bv–ææW%6–FRÒv–ææW$–æFW‚ÂòçVÆÂ¢v–ææW$–æFW‚ÓÓÒÆö6ÅÆ–W$–æFW‚ò'Æ–W""¢&÷öæVçB#°¢6öç7B66÷&T–æFW‚Ò'G2æf–æD–æFW‚‚‡'B’Óâõå66÷&RGR6WEÇ2£¢ö’çFW7B‡'B’“°¢6öç7B66÷&UFW‡BÒ66÷&T–æFW‚ãÒ ¢ò7G&–ær‡'G2ç7Æ–6R‡66÷&T–æFW‚Â•³Ò’ç&WÆ6R‚õå66÷&RGR6WEÇ2£¥Ç2¢ö’Â""¢¢‚‚’Óâ°¢6öç7B66÷&RÒ7FFRç&W7VÇD–æfóòç6WDÖF6ƒòç66÷&S°¢&WGW&â'&’æ—4'&’‡66÷&R’òG´çVÖ&W"‡66÷&U³ÒÇÂ—Þ(	2G´çVÖ&W"‡66÷&U³ÒÇÂ—Ö¢.(	B#°¢Ò’‚“°¢6öç7B÷vW$–æFW‚Ò'G2æf–æD–æFW‚‚‡'B’ÓâõåV—76æ6Rf–æÆUÇ2£¢ö’çFW7B‡'B’“°¢6öç7B÷vW$FWF–ÂÒ÷vW$–æFW‚ãÒò7G&–ær‡'G2ç7Æ–6R‡÷vW$–æFW‚Â•³Ò’¢"#°¢6öç7B÷vW%fÇVW2Ò÷vW$FWF–ÂæÖF6‚‚ò…ÆB²•Ç2¬+uµåÆEÒ¢…ÆB²•Ç2¢Bò“°¢6öç7Bf–7F÷'•G—RÒö&ö÷7Bö’çFW7B†÷WF6öÖR¢ò&&ö÷7B ¢¢÷ö–çG2ö’çFW7B†÷WF6öÖR¢ò'÷vW" ¢¢&VffV7B#°¢&WGW&â°¢÷WF6öÖRÀ¢v–ææW$æÖRÀ¢v–ææW%6–FRÀ¢66÷&UFW‡BÀ¢÷vW%66÷&S¢÷vW%fÇVW2ò´çVÖ&W"‡÷vW%fÇVW5³Ò’ÂçVÖ&W"‡÷vW%fÇVW5³%Ò•Ò¢çVÆÂÀ¢f–7F÷'•G—RÀ¢FWF–Ç3¢'G2À¢Ó°§Ð ¦gVæ7F–öâFW6·F÷W†6†ævU&W7VÇDÖ&·W†Æ–æRÂÆ–W%6–FRÒ&–æf÷&ÖF–öâ"’°¢6öç7B&W7VÇBÒFW6·F÷W†6†ævU&W7VÇDFF†Æ–æR“°¢–b‚&W7VÇB’&WGW&â"#°¢&WGW&â ¢ÆF—b6Æ73Ò&FW6·F÷ÖW†6†ævR×&W7VÇB#à¢ÆF—b6Æ73Ò&FW6·F÷ÖW†6†ævR×&W7VÇBÖ†VFW"#à¢Ç7G&öær6Æ73Ò&FW6·F÷ÖW†6†ævR×v–ææW"FW6·F÷ÖW†6†ævR×v–ææW"ÒÒG·&W7VÇBçv–ææW%6–FRÇÂÆ–W%6–FWÒ#âG¶W66T‡FÖÂ‡&W7VÇBçv–ææW$æÖR—ÓÂ÷7G&öæsà¢Ç7â6Æ73Ò&FW6·F÷ÖW†6†ævR×66÷&R"&–ÖÆ&VÃÒ%66÷&RGR6WB#âG¶W66T‡FÖÂ‡&W7VÇBç66÷&UFW‡B—ÓÂ÷7ãà¢G·&W7VÇBçf–7F÷'•G—RÓÓÒ'÷vW""bb&W7VÇBç÷vW%66÷&Rò ¢Ç7â6Æ73Ò&FW6·F÷ÖW†6†ævR×÷vW"×66÷&RFW6·F÷ÖW†6†ævR×÷vW"×66÷&RÒÒG·&W7VÇBçv–ææW%6–FRÇÂÆ–W%6–FWÒ"&–ÖÆ&VÃÒ%66÷&RFRV—76æ6RG·&W7VÇBç÷vW%66÷&U³×Ò:G·&W7VÇBç÷vW%66÷&U³×Ò#à¢Æ#âG·&W7VÇBç÷vW%66÷&U³×ÓÂö#ãÆ’&–Ö†–FFVãÒ'G'VR#ãÂö“ãÆ#âG·&W7VÇBç÷vW%66÷&U³×ÓÂö#à¢Â÷7ãà¢¢"'Ð¢ÂöF—cà¢ÆF—b6Æ73Ò&7F–öâÖÆör×&W7VÇBÖFWF–Ç27F–öâÖÆör×&W7VÇBÖFWF–Ç2ÒÒG·&W7VÇBçf–7F÷'•G—WÒ#à¢Ç6Æ73Ò&W†6†ævRÖ÷WF6öÖRÖFWF–Â#âG¶W66T‡FÖÂ‡&W7VÇBæ÷WF6öÖR—ÓÂ÷à¢G·&W7VÇBæFWF–Ç2æÖ‚†FWF–Â’Óâ ¢Ç6Æ73Ò"G²õä¦WW‚¦÷WL:—2R66÷&RGR6WEÇ2£¢ö’çFW7B†FWF–Â’ò&W†6†ævR×66÷&RÖ6öç6WVVæ6R"¢"'Ò#âG¶W66T‡FÖÂ†FWF–Â—ÓÂ÷à¢’æ¦ö–â‚""—Ð¢ÂöF—cà¢ÂöF—cà¢°§Ð ¦gVæ7F–öâ&VæFW$7F–öäÆötVçG'’†Æ–æRÂ–æFW‚Â6ö×7BÒfÇ6R’°¢6öç7BG—RÒ7F–öäÆötVçG'•G—R†Æ–æR“°¢6öç7BF‡VÖ&æ–ÂÒ6ö×7Bò""¢7F–öäÆöt6&EF‡VÖ&æ–Â†Æ–æR“°¢6öç7B6†÷BÒ7G&–ær†Æ–æRÇÂ""’æÖF6‚‚õâ‚â³ò’¦÷VR‚â³ò’¢‚â²’Bò“°¢6öç7BW†6†ævU&W7VÇBÒ7G&–ær†Æ–æRÇÂ""’ç7F'G5v—F‚‚$&–ÆâFRÎ(	œ:–6†ævWÂ"’ò7G&–ær†Æ–æR’ç7Æ—B‚'Â"’ç6Æ–6Rƒ’¢çVÆÃ°¢6öç7B6öçFVçBÒW†6†ævU&W7VÇ@¢òFW6·F÷W†6†ævU&W7VÇDÖ&·W†Æ–æRÂÖö&–ÆT†—7F÷'”VçG&–W2‚’æf–æB‚†VçG'’’ÓâVçG'’æÖW76vRÓÓÒÆ–æR“òçÆ–W%6–FRÇÂ&–æf÷&ÖF–öâ"¢¢6†÷@¢òÇ7G&öær6Æ73Ò&7F–öâÖÆör×Æ–W"#âG¶W66T‡FÖÂ‡6†÷E³Ò—ÓÂ÷7G&öæsãÇ7â6Æ73Ò&7F–öâÖÆörÖ7F–öâ#âG¶W66T‡FÖÂ‡6†÷E³%Ò—ÓÂ÷7ããÇâG¶f÷&ÖDÆötÆ–æR‡6†÷E³5Ò—ÓÂ÷æ ¢¢ÇâG¶f÷&ÖDÆötÆ–æR†Æ–æR—ÓÂ÷æ°¢&WGW&â ¢Æ'F–6ÆR6Æ73Ò&7F–öâÖÆörÖVçG'’G·G—WÒG¶6ö×7Bò"6ö×7B"¢"'ÒG·F‡VÖ&æ–Âò"†2Ö6&B"¢"'Ò#à¢ÆF—b6Æ73Ò&7F–öâÖÆörÖÖ&¶W""&–Ö†–FFVãÒ'G'VR#ãÂöF—cà¢G·F‡VÖ&æ–ÇÐ¢ÆF—b6Æ73Ò&7F–öâÖÆörÖVçG'’Ö6÷’#à¢Ç7â6Æ73Ò&7F–öâÖÆör×G—R#âG¶7F–öäÆötVçG'”Æ&VÂ‡G—R—ÓÂ÷7ãà¢G¶6öçFVçGÐ¢ÂöF—cà¢Ç7â6Æ73Ò&7F–öâÖÆörÖ÷&FW""&–ÖÆ&VÃÒ$7F–öâG¶–æFW‚²Ò#âG¶–æFW‚²ÓÂ÷7ãà¢Âö'F–6ÆSà¢°§Ð ¦gVæ7F–öâ&VæFW$Æör‚’°¢VÇ2æÆöræ6Æ74Æ—7BçFövvÆR‚'GWF÷&–ÂÖfö7W2×F&vWB"Â&ööÆVâ‡GWF÷&–Äfö7W46Æ72‚&†—7F÷'’"ÂçVÆÂ’’“°¢6öç7B&öw&W76–öä7F–öç2Ò&VæFW%&ÆÇ”VæD7F–öç2‚“°¢VÇ2æÆöræ6Æ74Æ—7Bç&VÖ÷fR‚&FW6·F÷Ö†—7F÷'’ÖG&vW"ÒÖ÷Vâ"“°¢VÇ2æÆöræ–ææW$…DÔÂÒ ¢ÆF—b6Æ73Ò&FW6·F÷Ö†—7F÷'’×&öw&W76–öâÖ7F–öç2#âG·&öw&W76–öä7F–öç7ÓÂöF—cà¢Æ'WGFöâ6Æ73Ò&FW6·F÷Ö†—7F÷'’ÖG&vW"×FövvÆR"G—SÒ&'WGFöâ"FFÖ÷VâÖgVÆÂÖ7F–öâÖÆör&–ÖÆ&VÃÒ$÷Wg&—"Î(	–†—7F÷&—VRFç2VæR&ü:çFRFRF–ÆöwVR#à¢Ç7â&–Ö†–FFVãÒ'G'VR#î(iÂ÷7ããÇ7G&öæsä†—7F÷&—VSÂ÷7G&öæsà¢Âö'WGFöãà¢°¢&–æE&ÆÇ”VæD7F–öç2†VÇ2æÆör“°¢VÇ2æÆörçVW'•6VÆV7F÷"‚%¶FFÖ÷VâÖgVÆÂÖ7F–öâÖÆöuÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â÷VägVÆÄ7F–öäÆötF–Æör“°§Ð ¦gVæ7F–öâ6Æ÷6TgVÆÄ7F–öäÆötF–Æör‚’°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æ7F–öâÖÆörÖ&6¶G&÷"“òç&VÖ÷fR‚“°§Ð ¦gVæ7F–öâFW6·F÷†—7F÷'”ÖW76vTÖ&·W†VçG'’’°¢ÆWBÖ&·WÒf÷&ÖDÆötÆ–æR†VçG'’æÖW76vRÇÂ""“°¢6öç7BÆ–W$æÖRÒ7G&–ær†VçG'’çÆ–W$æÖRÇÂ""’çG&–Ò‚“°¢–b‚Æ–W$æÖR’&WGW&âÖ&·W°¢6öç7BW66VDæÖRÒW66T‡FÖÂ‡Æ–W$æÖR“°¢&WGW&âÖ&·Wç&WÆ6R€¢W66VDæÖRÀ¢Ç7G&öær6Æ73Ò&FW6·F÷Ö†—7F÷'’×Æ–W"ÖæÖR#âG¶W66VDæÖWÓÂ÷7G&öæsæÀ¢“°§Ð ¦gVæ7F–öâ&VæFW$FW6·F÷†—7F÷'”VçG'’†VçG'’Â–æFW‚’°¢6öç7BFw2Ò¶VçG'’æÆ&VÂÂâââ†VçG'’çf&–F–öåG—W2ÇÂµÒ•Ð¢æf–ÇFW"„&ööÆVâ¢æf–ÇFW"‚‡FrÂFt–æFW‚ÂfÇVW2’ÓâfÇVW2æ–æFW„öb‡Fr’ÓÓÒFt–æFW‚“°¢&WGW&â ¢Æ'F–6ÆR6Æ73Ò&FW6·F÷Ö†—7F÷'’ÖVçG'’FW6·F÷Ö†—7F÷'’ÖVçG'’ÒÒG¶VçG'’çÆ–W%6–FRÇÂ&–æf÷&ÖF–öâ'Ò#à¢ÆF—b6Æ73Ò&FW6·F÷Ö†—7F÷'’ÖVçG'’×Fw2#à¢G·Fw2æÖ‚‡Fr’ÓâÇ7ãâG¶W66T‡FÖÂ‡Fr—ÓÂ÷7ãæ’æ¦ö–â‚""—Ð¢ÂöF—cà¢G¶FW6·F÷W†6†ævU&W7VÇDFF†VçG'’æÖW76vR¢òFW6·F÷W†6†ævU&W7VÇDÖ&·W†VçG'’æÖW76vRÂVçG'’çÆ–W%6–FRÇÂ&–æf÷&ÖF–öâ"¢¢ÇâG¶FW6·F÷†—7F÷'”ÖW76vTÖ&·W†VçG'’—ÓÂ÷æÐ¢G²†VçG'’çf&–F–öç2ÇÂµÒ’æÆVæwF‚ò ¢ÇVÂ6Æ73Ò&FW6·F÷Ö†—7F÷'’×f&–F–öç2#à¢G¶VçG'’çf&–F–öç2æÖ‚‡f&–F–öâ’ÓâÆÆ“âG¶W66T‡FÖÂ‡f&–F–öâ—ÓÂöÆ“æ’æ¦ö–â‚""—Ð¢Â÷VÃà¢¢"'Ð¢G¶VçG'’æ6&Còæ'Gv÷&²ò ¢Æ'WGFöâ6Æ73Ò&FW6·F÷Ö†—7F÷'’Ö6&BÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖFW6·F÷Ö†—7F÷'’Ö6&CÒ"G¶–æFW‡Ò"&–ÖÆ&VÃÒ%fö—"ÆRL:—F–ÂFRG¶W66T‡FÖÂ†VçG'’æ6&BææÖR—Ò#à¢Æ–Ör7&3Ò"G¶W66T‡FÖÂ†VçG'’æ6&Bæ'Gv÷&²—Ò"ÇCÒ"G¶W66T‡FÖÂ†VçG'’æ6&BææÖR—Ò"óà¢Âö'WGFöãà¢¢"'Ð¢Âö'F–6ÆSà¢°§Ð ¦gVæ7F–öâ÷VägVÆÄ7F–öäÆötF–Æör‚’°¢6Æ÷6TgVÆÄ7F–öäÆötF–Æör‚“°¢6öç7B†—7F÷'’ÒÖö&–ÆT†—7F÷'”VçG&–W2‚“°¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷7F–öâÖÆörÖ&6¶G&÷#°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&7F–öâÖÆörÖF–Æör"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÆÆVF'“Ò&7F–öäÆötF–ÆöuF—FÆR#à¢Æ†VFW#à¢Ç7â6Æ73Ò&7F–öâÖÆörÖF–ÆörÖw&&&W""&–Ö†–FFVãÒ'G'VR#ãÂ÷7ãà¢Æƒ"–CÒ&7F–öäÆötF–ÆöuF—FÆR#äL:—&÷VÌ:’FRÎ(	œ:–6†ævSÂöƒ#à¢Æ'WGFöâ6Æ73Ò&7F–öâÖÆörÖF–ÆörÖ6Æ÷6R"G—SÒ&'WGFöâ"FFÖ6Æ÷6RÖ7F–öâÖÆör&–ÖÆ&VÃÒ$fW&ÖW"#ì9sÂö'WGFöãà¢Âö†VFW#à¢ÆF—b6Æ73Ò&7F–öâÖÆörÖF–ÆörÖÆ—7B#à¢G¶†—7F÷'’æÆVæwF‚ò†—7F÷'’æÖ‚†VçG'’Â–æFW‚’Óâ&VæFW$FW6·F÷†—7F÷'”VçG'’†VçG'’Â–æFW‚’’æ¦ö–â‚""’¢sÇ6Æ73Ò&7F–öâÖÆörÖV×G’#äV7VæR7F–öâVç&Vv—7G,:–RãÂ÷âwÐ¢ÂöF—cà¢Â÷6V7F–öãà¢°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FFÖ6Æ÷6RÖ7F–öâÖÆöuÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6Æ÷6TgVÆÄ7F–öäÆötF–Æör“°¢&6¶G&÷çVW'•6VÆV7F÷$ÆÂ‚%¶FFÖFW6·F÷Ö†—7F÷'’Ö6&EÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢÷VäFW6·F÷Æ–VD6&DFWF–Â††—7F÷'•´çVÖ&W"†'WGFöâæFF6WBæFW6·F÷†—7F÷'”6&B•Óòæ6&B“°¢Ò“°¢Ò“°¢&6¶G&÷æFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢–b†WfVçBçF&vWBÓÓÒ&6¶G&÷’6Æ÷6TgVÆÄ7F–öäÆötF–Æör‚“°¢Ò“°¢Fö7VÖVçBæ&öG’æVæD6†–ÆB†&6¶G&÷“°§Ð ¦gVæ7F–öâ&VæFW$&ö÷7DÖöFÂ‚’°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æ&ö÷7BÖ6†ö–6RÖ&6¶G&÷"“òç&VÖ÷fR‚“°¢–b‚7FFRçVæF–æt&ö÷7B’&WGW&ã°¢6öç7B²Æ–W$–æFW‚Â6&EV–BÒÒ7FFRçVæF–æt&ö÷7C°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B6&BÒÆ–W"æ†æBæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ6&EV–B“°¢–b‚6&B’&WGW&ã° ¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷&ö÷7BÖ6†ö–6RÖ&6¶G&÷#°¢6öç7B&W6W'fT6†ö–6W2ÒTÅD”ÔDUôÔôDRæ7F—fRò‡Æ–W"ç&W6W'fRÇÂµÒ’¢µÓ°¢6öç7BF—66&D6†ö–6W2ÒTÅD”ÔDUôÔôDRæ7F—fRbbÆ–W"çVÇF–ÖFT&ö÷7Dg&öÔF—66&Bò‡7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…ÒÇÂµÒ’¢µÓ°¢6öç7B6†ö–6W2Ò²ââçÆ–W"æ†æBæf–ÇFW"‚†—FVÒ’Óâ—FVÒçV–BÓÒ6&EV–B’Âââç&W6W'fT6†ö–6W2ÂââæF—66&D6†ö–6W5Ó°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&ÖöFÂ"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÃÒ$6†ö—6—"Æ6'FRFR&ö÷7B#à¢Æƒ#ä6†ö—6—"Æ6'FR:67&–f–W#Âöƒ#à¢ÇâG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—Ò&ö÷7FRÇ7G&öæsâG¶6&BææÖWÓÂ÷7G&öæsââ<:–ÆV7F–öææW¢VæR6'FRFRÆÖ–â÷RFRÆ,:—6W'fR:vÆ—76W"FW76÷W2ãÂ÷à¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6Æ÷6RÖÖöFÃäæçVÆW#Âö'WGFöãà¢ÆF—b6Æ73Ò&6†ö–6RÖw&–B#à¢G¶6†ö–6W2æÖ‚†6†ö–6R’Óâ ¢Æ'WGFöâ6Æ73Ò&6†ö–6RÖ6&B"G—SÒ&'WGFöâ"FF×67&–f–6SÒ"G¶6†ö–6RçV–GÒ#à¢G·GWF÷&–Å67&–f–6T7VR†6†ö–6R—Ð¢G·&VæFW$6†ö–6T6&Ef—7VÂ†6†ö–6R—Ð¢Âö'WGFöãà¢’æ¦ö–â‚""—Ð¢ÂöF—cà¢Â÷6V7F–öãà¢°¢Fö7VÖVçBæ&öG’æVæB†&6¶G&÷“°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FFÖ6Æ÷6RÖÖöFÅÒ"’æFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6Æ÷6T&ö÷7DÖöFÂ“°¢&6¶G&÷çVW'•6VÆV7F÷$ÆÂ‚%¶FF×67&–f–6UÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B67&–f–6UV–BÒ'WGFöâæFF6WBç67&–f–6S°¢6öç7B&ö÷7D6&BÒÆ–W"æ†æBæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ6&EV–B“°¢6öç7B67&–f–6T6&BÒÆ–W"æ†æBæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ67&–f–6UV–B’ÇÂ‡Æ–W"ç&W6W'fRÇÂµÒ’æf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ67&–f–6UV–B’ÇÂ‡7FFRçVÇF–ÖFTF—66&G5·Æ–W$–æFW…ÒÇÂµÒ’æf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ67&–f–6UV–B“°¢7FFRçVæF–æt&ö÷7BÒçVÆÃ°¢–b†&ö÷7D6&Còå÷VæF–æu&W6W'fT&ö÷7B’FVÆWFR&ö÷7D6&Bå÷VæF–æu&W6W'fT&ö÷7C°¢Æ”6&B‡Æ–W$–æFW‚Â6&EV–BÂG'VRÂ67&–f–6UV–B“°¢6ö×ÆWFUGWF÷&–Ä7F–öâ‡²¶–æC¢'Æ’"ÂÆ–W$–æFW‚Â6&D–C¢&ö÷7D6&Còæ–BÂÖöFS¢&&ö÷7B"Â67&–f–6T6&D–C¢67&–f–6T6&Còæ–BÒ“°¢Ò“°¢Ò“°§Ð ¦gVæ7F–öâ&VæFW$VffV7D6†ö–6TÖöFÂ‚’°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æVffV7BÖ6†ö–6RÖ&6¶G&÷"“òç&VÖ÷fR‚“°¢–b‚7FFRçVæF–ætVffV7D6†ö–6R’&WGW&ã°¢6öç7B²Æ–W$–æFW‚Â6÷W&6UÆ–VEV–BÂ6†÷G4öæÇ’ÒG'VRÒÒ7FFRçVæF–ætVffV7D6†ö–6S°¢–b…4U%dU%õ5”ä2æVæ&ÆVBbbÆ–W$–æFW‚ÓÒ4U%dU%õ5”ä2ç6VB’&WGW&ã°¢–b…4ôÄõô’æVæ&ÆVBbbÆ–W$–æFW‚ÓÓÒ4ôÄõô’çÆ–W$–æFW‚’&WGW&ã°¢6öç7B6†ö–6W2ÒVffV7D6†ö–6W4f÷"‡6÷W&6UÆ–VEV–BÂ²6†÷G4öæÇ’Ò“°¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷VffV7BÖ6†ö–6RÖ&6¶G&÷#°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&ÖöFÂ"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÃÒ$6†ö—6—"VâVffWB#à¢Æƒ#ä6†ö—6—"VâVffWCÂöƒ#à¢Çå<:–ÆV7F–öææRÂvVffWBBwVæR6'FRL:–¬:¦÷\:–RFç26WB:–6†ævRãÂ÷à¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6æ6VÂÖ6†ö–6SäæçVÆW"WB&WfVæ—"RL:–'WBGRF÷W#Âö'WGFöãà¢ÆF—b6Æ73Ò&6†ö–6RÖw&–B#à¢G¶6†ö–6W2æÖ‚†6†ö–6R’Óâ ¢Æ'WGFöâ6Æ73Ò&6†ö–6RÖ6&B"G—SÒ&'WGFöâ"FFÖVffV7BÖ6†ö–6SÒ"G¶6†ö–6RçÆ–VEV–GÒ#à¢G·&VæFW$6†ö–6T6&Ef—7VÂ†6†ö–6R—Ð¢Âö'WGFöãà¢’æ¦ö–â‚""—Ð¢ÂöF—cà¢Â÷6V7F–öãà¢°¢Fö7VÖVçBæ&öG’æVæB†&6¶G&÷“°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FFÖ6æ6VÂÖ6†ö–6UÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&W7F÷&UGW&å6æ6†÷B“°¢&6¶G&÷çVW'•6VÆV7F÷$ÆÂ‚%¶FFÖVffV7BÖ6†ö–6UÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ&W6öÇfTVffV7D6†ö–6R†'WGFöâæFF6WBæVffV7D6†ö–6R’“°¢Ò“°§Ð ¦gVæ7F–öâ&VæFW$6ö6„6†ö–6TÖöFÂ‚’°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æ6ö6‚Ö6†ö–6RÖ&6¶G&÷"“òç&VÖ÷fR‚“°¢–b‚7FFRçVæF–æt6ö6„6†ö–6R’&WGW&ã°¢6öç7B²Æ–W$–æFW‚ÂÖöFRÒÒ7FFRçVæF–æt6ö6„6†ö–6S°¢–b…4U%dU%õ5”ä2æVæ&ÆVBbbÆ–W$–æFW‚ÓÒ4U%dU%õ5”ä2ç6VB’&WGW&ã°¢–b…4ôÄõô’æVæ&ÆVBbbÆ–W$–æFW‚ÓÓÒ4ôÄõô’çÆ–W$–æFW‚’&WGW&ã°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷6ö6‚Ö6†ö–6RÖ&6¶G&÷#°¢6öç7B6†ö–6UF—FÆRÒÖöFRÓÓÒ&F—66&D†æDf÷%÷vW" ¢ò%7W&–ÖW"VæR6'FR÷W"vvæW"VâV—76æ6R ¢¢%–ö6†W"VæR6'FRæöâF—7G&–'\:–R#°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&ÖöFÂ"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÆÆVF'“Ò&6ö6„6†ö–6UF—FÆR#à¢Æƒ"–CÒ&6ö6„6†ö–6UF—FÆR#âG¶6†ö–6UF—FÆWÓÂöƒ#à¢ÇâG¶ÖöFRÓÓÒ&F—66&D†æDf÷%÷vW""ò6†ö—6—2VæR6'FRFRÆÖ–âFRG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—Ò:7W&–ÖW"÷W"vvæW"2V—76æ6Ræ¢6†ö—6—2VæR6'FRæöâF—7G&–'\:–R:¦÷WFW":ÆÖ–âFRG¶W66T‡FÖÂ†F—7Æ•Æ–W$æÖR‡Æ–W"’—ÒæÓÂ÷à¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6æ6VÂÖ6†ö–6SäæçVÆW"WB&WfVæ—"RL:–'WBGRF÷W#Âö'WGFöãà¢ÆF—b6Æ73Ò&6†ö–6RÖw&–B#à¢G²†ÖöFRÓÓÒ&F—66&D†æDf÷%÷vW""òÆ–W"æ†æB¢7FFRæFV6²’æÖ‚†6†ö–6R’Óâ ¢Æ'WGFöâ6Æ73Ò&6†ö–6RÖ6&B"G—SÒ&'WGFöâ"FFÖ6ö6‚Ö6†ö–6SÒ"G¶6†ö–6RçV–GÒ#à¢G·&VæFW$6†ö–6T6&Ef—7VÂ†6†ö–6R—Ð¢Âö'WGFöãà¢’æ¦ö–â‚""—Ð¢ÂöF—cà¢Â÷6V7F–öãà¢°¢Fö7VÖVçBæ&öG’æVæB†&6¶G&÷“°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FFÖ6æ6VÂÖ6†ö–6UÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&W7F÷&UGW&å6æ6†÷B“°¢&6¶G&÷çVW'•6VÆV7F÷$ÆÂ‚%¶FFÖ6ö6‚Ö6†ö–6UÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ&W6öÇfT6ö6„6†ö–6R†'WGFöâæFF6WBæ6ö6„6†ö–6R’“°¢Ò“°§Ð ¦gVæ7F–öâ&VæFW%&VÖ÷fT6†ö–6TÖöFÂ‚’°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"ç&VÖ÷fRÖ6†ö–6RÖ&6¶G&÷"“òç&VÖ÷fR‚“°¢–b‚7FFRçVæF–æu&VÖ÷fT6†ö–6R’&WGW&ã°¢6öç7B²Æ–W$–æFW‚Â÷öæVçD–æFW‚Â6†÷G4öæÇ’ÒÒ7FFRçVæF–æu&VÖ÷fT6†ö–6S°¢–b…4U%dU%õ5”ä2æVæ&ÆVBbbÆ–W$–æFW‚ÓÒ4U%dU%õ5”ä2ç6VB’&WGW&ã°¢–b…4ôÄõô’æVæ&ÆVBbbÆ–W$–æFW‚ÓÓÒ4ôÄõô’çÆ–W$–æFW‚’&WGW&ã°¢6öç7B6†ö–6W2Ò&VÖ÷f&ÆT÷öæVçD6&G2†÷öæVçD–æFW‚Â&ööÆVâ‡6†÷G4öæÇ’’“°¢6öç7B&6¶G&÷ÒFö7VÖVçBæ7&VFTVÆVÖVçB‚&F—b"“°¢&6¶G&÷æ6Æ74æÖRÒ&ÖöFÂÖ&6¶G&÷&VÖ÷fRÖ6†ö–6RÖ&6¶G&÷#°¢&6¶G&÷æ–ææW$…DÔÂÒ ¢Ç6V7F–öâ6Æ73Ò&ÖöFÂ"&öÆSÒ&F–Æör"&–ÖÖöFÃÒ'G'VR"&–ÖÆ&VÃÒ$6†ö—6—"VæR6'FRGfW'6R:7W&–ÖW"#à¢Æƒ#å7W&–ÖW"VæR6'FRGfW'6SÂöƒ#à¢Çä6†ö—6—2VæR6'FRVæv|:–R"G¶W66T‡FÖÂ‡Æ–W$æÖR†÷öæVçD–æFW‚’—Ò:&WF—&W"FRÂ|:–6†ævRãÂ÷à¢Æ'WGFöâ6Æ73Ò'6ÖÆÂÖ'WGFöâ"G—SÒ&'WGFöâ"FFÖ6æ6VÂÖ6†ö–6SäæçVÆW"WB&WfVæ—"RL:–'WBGRF÷W#Âö'WGFöãà¢ÆF—b6Æ73Ò&6†ö–6RÖw&–B#à¢G¶6†ö–6W2æÖ‚†6†ö–6R’Óâ ¢Æ'WGFöâ6Æ73Ò&6†ö–6RÖ6&B"G—SÒ&'WGFöâ"FF×&VÖ÷fRÖ6†ö–6SÒ"G¶6†ö–6RçÆ–VEV–GÒ#à¢G·&VæFW$6†ö–6T6&Ef—7VÂ†6†ö–6R—Ð¢Âö'WGFöãà¢’æ¦ö–â‚""—Ð¢ÂöF—cà¢Â÷6V7F–öãà¢°¢Fö7VÖVçBæ&öG’æVæB†&6¶G&÷“°¢&6¶G&÷çVW'•6VÆV7F÷"‚%¶FFÖ6æ6VÂÖ6†ö–6UÒ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&W7F÷&UGW&å6æ6†÷B“°¢&6¶G&÷çVW'•6VÆV7F÷$ÆÂ‚%¶FF×&VÖ÷fRÖ6†ö–6UÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ&W6öÇfU&VÖ÷fT6†ö–6R†'WGFöâæFF6WBç&VÖ÷fT6†ö–6R’“°¢Ò“°§Ð ¦gVæ7F–öâ6†÷VÆEW6…6W'fW%7FFR‚’°¢–b‚4U%dU%õ5”ä2æVæ&ÆVBÇÂ4U%dU%õ5”ä2æÇ––æu&VÖ÷FR’&WGW&âfÇ6S°¢–b…4U%dU%õ5”ä2æ–æ—F–Æ—¦–ær’&WGW&âG'VS°¢&WGW&â4U%dU%õ5”ä2ç&VG’bb4U%dU%õ5”ä2æÆö6ÄF—'G“°§Ð ¦gVæ7F–öâ6W'fW%7–æ57FFTVæGö–çB‚’°¢–b…4U%dU%õ5”ä2æg&–VæFÇ”ÖF6‚’°¢&WGW&âö’ög&–VæFÇ’×F÷W&æÖVçG2òG¶Væ6öFUU$”6ö×öæVçB„e$”TäDÅ•õDõU$äÔTåBæ–B—ÒöÖF6†W2òG¶Væ6öFUU$”6ö×öæVçB…4U%dU%õ5”ä2ç&ööÔ–B—Ò÷7FFV°¢Ð¢&WGW&âö’÷&öö×2òG¶Væ6öFUU$”6ö×öæVçB…4U%dU%õ5”ä2ç&ööÔ–B—Ò÷7FFV°§Ð ¦gVæ7F–öâ66†VGVÆU6W'fW%7–æ2‚’°¢–b‚6†÷VÆEW6…6W'fW%7FFR‚’’&WGW&ã°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4U%dU%õ5”ä2çF–ÖW"“°¢4U%dU%õ5”ä2çF–ÖW"Òv–æF÷rç6WEF–ÖV÷WB‡W6…6W'fW%7FFRÂƒ“°§Ð ¦7–æ2gVæ7F–öâW6…6W'fW%7FFR‚’°¢–b‚6†÷VÆEW6…6W'fW%7FFR‚’’&WGW&ã°¢6öç7B–ÆöBÒ¥4ôâç7G&–æv–g’†W‡÷'E7–æ57FFR‚’“°¢–b‡–ÆöBÓÓÒ4U%dU%õ5”ä2æÆ7E6VçB’&WGW&ã°¢4U%dU%õ5”ä2æÆ7E6VçBÒ–ÆöC°¢G'’°¢6öç7B&öG’Ò4U%dU%õ5”ä2æg&–VæFÇ”ÖF6€¢ò°¢'F–6—çD–C¢e$”TäDÅ•õDõU$äÔTåBç'F–6—çD–BÀ¢Fö¶Vã¢e$”TäDÅ•õDõU$äÔTåBçFö¶VâÀ¢&6U&Wf—6–öã¢4U%dU%õ5”ä2ç&Wf—6–öâÀ¢7FFS¢¥4ôâç'6R‡–ÆöB’À¢Ð¢¢²Fö¶Vã¢4U%dU%õ5”ä2çFö¶VâÂ7FFS¢¥4ôâç'6R‡–ÆöB’Ó°¢6öç7B&W7öç6RÒv—BfWF6‚‡6W'fW%7–æ57FFTVæGö–çB‚’Â°¢ÖWF†öC¢%õ5B"À¢†VFW'3¢²&6öçFVçB×G—R#¢&Æ–6F–öâö§6öâ"ÒÀ¢&öG“¢¥4ôâç7G&–æv–g’†&öG’’À¢Ò“°¢–b‡&W7öç6Rç7FGW2ÓÓÒC’bb4U%dU%õ5”ä2æg&–VæFÇ”ÖF6‚’°¢4U%dU%õ5”ä2æÆ7E6VçBÒ"#°¢4U%dU%õ5”ä2æÆö6ÄF—'G’ÒfÇ6S°¢v—BöÆÅ6W'fW%7FFR‚“°¢&WGW&ã°¢Ð¢–b‚&W7öç6Ræö²’F‡&÷ræWrW'&÷"‚'7–æ2f–ÆVB"“°¢6öç7BFFÒv—B&W7öç6Ræ§6öâ‚“°¢4U%dU%õ5”ä2ç&VG’ÒG'VS°¢4U%dU%õ5”ä2æ–æ—F–Æ—¦–ærÒfÇ6S°¢4U%dU%õ5”ä2æÆö6ÄF—'G’ÒfÇ6S°¢4U%dU%õ5”ä2ç&Wf—6–öâÒFFç&Wf—6–öâóò4U%dU%õ5”ä2ç&Wf—6–öã°¢4U%dU%õ5”ä2æ–çf—FUW&ÂÒFFæ–çf—FUW&Âóò4U%dU%õ5”ä2æ–çf—FUW&Ã°¢4U%dU%õ5”ä2ç7FGW2ÒFFç7FGW2óò4U%dU%õ5”ä2ç7FGW3°¢4U%dU%õ5”ä2æ†÷7E6VBÒFFæ†÷7E6VBóò4U%dU%õ5”ä2æ†÷7E6VC°¢4U%dU%õ5”ä2æ—4†÷7BÒFFæ—4†÷7Bóò4U%dU%õ5”ä2æ—4†÷7C°¢'6÷&%6W'fW$Æöw2†FFæÆöw2“°¢&VæFW%6W'fW%7–æ5æVÂ‚“°¢Ò6F6‚†W'&÷"’°¢7FFRæÆörçVç6†–gB‚%7–æ6‡&öæ—6F–öâ6W'fWW"–×÷76–&ÆR÷W"ÆRÖöÖVçBâ"“°¢&VæFW%6W'fW%7–æ5æVÂ‚“°¢Ð§Ð ¦7–æ2gVæ7F–öâöÆÅ6W'fW%7FFR‚’°¢–b‚4U%dU%õ5”ä2æVæ&ÆVB’&WGW&ã°¢6öç7BöÆÆ–ætg&–VæFÇ”ÖF6‚Ò4U%dU%õ5”ä2æg&–VæFÇ”ÖF6ƒ°¢6öç7BVæGö–çBÒ6W'fW%7–æ57FFTVæGö–çB‚“°¢6öç7Bv5&VG’Ò4U%dU%õ5”ä2ç&VG“°¢G'’°¢6öç7BVW'’ÒöÆÆ–ætg&–VæFÇ”ÖF6€¢ò'F–6—çD–CÒG¶Væ6öFUU$”6ö×öæVçB„e$”TäDÅ•õDõU$äÔTåBç'F–6—çD–BÇÂ""—ÒgFö¶VãÒG¶Væ6öFUU$”6ö×öæVçB„e$”TäDÅ•õDõU$äÔTåBçFö¶VâÇÂ""—Òg&Wf—6–öãÒGµ4U%dU%õ5”ä2ç&Wf—6–öçÖ ¢¢Fö¶VãÒG¶Væ6öFUU$”6ö×öæVçB…4U%dU%õ5”ä2çFö¶Vâ—Òg&Wf—6–öãÒGµ4U%dU%õ5”ä2ç&Wf—6–öçÖ°¢6öç7B&W7öç6RÒv—BfWF6‚†G¶VæGö–çGÓòG·VW'—Ö“°¢–b‡&W7öç6Rç7FGW2ÓÓÒCB’°¢–b‡öÆÆ–ætg&–VæFÇ”ÖF6‚ÇÂe$”TäDÅ•õDõU$äÔTåBæVæ&ÆVB’°¢v—BöÆÄg&–VæFÇ•F÷W&æÖVçB‚“°¢&WGW&ã°¢Ð¢†æFÆU&VÖ÷FU&ööÔ6Æ÷6VB‚“°¢&WGW&ã°¢Ð¢–b‚&W7öç6Ræö²’F‡&÷ræWrW'&÷"‚'öÆÂf–ÆVB"“°¢6öç7BFFÒv—B&W7öç6Ræ§6öâ‚“°¢4U%dU%õ5”ä2æ–çf—FUW&ÂÒFFæ–çf—FUW&Âóò4U%dU%õ5”ä2æ–çf—FUW&Ã°¢4U%dU%õ5”ä2çF&vWE6WG2ÒFFçF&vWE6WG2óò4U%dU%õ5”ä2çF&vWE6WG3°¢4U%dU%õ5”ä2ç7FGW2ÒFFç7FGW2óò4U%dU%õ5”ä2ç7FGW3°¢4U%dU%õ5”ä2æ†÷7E6VBÒFFæ†÷7E6VBóò4U%dU%õ5”ä2æ†÷7E6VC°¢4U%dU%õ5”ä2æ—4†÷7BÒFFæ—4†÷7Bóò4U%dU%õ5”ä2æ—4†÷7C°¢'6÷&%6W'fW$Æöw2†FFæÆöw2“°¢6öç7BÆ–W'46†ævVBÒÇ”öæÆ–æUÆ–W'4g&öÕ&ööÒ†FFçÆ–W'2óò4U%dU%õ5”ä2çÆ–W'2“°¢–b†FFç7FFRbb‚4U%dU%õ5”ä2ç&VG’ÇÂFFç&Wf—6–öâÓÒ4U%dU%õ5”ä2ç&Wf—6–öâ’’°¢4U%dU%õ5”ä2ç&Wf—6–öâÒFFç&Wf—6–öã°¢4U%dU%õ5”ä2ç&VG’ÒG'VS°¢4U%dU%õ5”ä2æÆ7E6VçBÒ¥4ôâç7G&–æv–g’†FFç7FFR“°¢–×÷'E7–æ57FFR†FFç7FFR“°¢Ç”öæÆ–æUÆ–W'4g&öÕ&ööÒ†FFçÆ–W'2óò4U%dU%õ5”ä2çÆ–W'2“°¢–b‚v5&VG’’VWVT6öæg&öçFF–öä–çG&ò‚“°¢ÒVÇ6R°¢&VæFW%6W'fW%7–æ5æVÂ‚“°¢Ð¢–b…4U%dU%õ5”ä2æ—4†÷7BbbÆ–W'46†ævVB’°¢Ö&µ6W'fW$F—'G”f÷$†÷7D7F–öâ‚“°¢&VæFW"‚“°¢66†VGVÆU6W'fW%7–æ2‚“°¢Ð¢Ò6F6‚†W'&÷"’°¢&VæFW%6W'fW%7–æ5æVÂ‚“°¢Ð§Ð ¦gVæ7F–öâ–æ—E6W'fW%7–æ2‚’°¢6öç7B&×2Ò6W'fW%7–æ5&×2‚“°¢–b‚&×2’&WGW&ã°¢4ôÄõô’æVæ&ÆVBÒfÇ6S°¢&W6WE6WDÖF6‚‚“°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’çF–ÖW"“°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’æçVFvUF–ÖW"“°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’æçVFvTWFõF–ÖW"“°¢v–æF÷ræ6ÆV%F–ÖV÷WB…4ôÄõô’çvF6†FöuF–ÖW"“°¢4ôÄõô’çF†–æ¶–ærÒfÇ6S°¢4ôÄõô’æW†V7WF–ærÒfÇ6S°¢4ôÄõô’æçVFvUf—6–&ÆRÒfÇ6S°¢4ôÄõô’æçVFvUvF6†VEGW&âÒçVÆÃ°¢4U%dU%õ5”ä2æVæ&ÆVBÒG'VS°¢4U%dU%õ5”ä2ç&ööÔ–BÒ&×2ç&ööÔ–C°¢4U%dU%õ5”ä2çFö¶VâÒ&×2çFö¶Vã°¢4U%dU%õ5”ä2ç6VBÒ&×2ç6VC°¢4U%dU%õ5”ä2æ—4†÷7BÒ&×2æ—4†÷7C°¢4U%dU%õ5”ä2çF&vWE6WG2Ò&×2çF&vWE6WG3°¢4U%dU%õ5”ä2ç7FGW2ÒçVÆÃ°¢4U%dU%õ5”ä2æ†÷7E6VBÒ&×2æ—4†÷7Bò&×2ç6VB¢çVÆÃ°¢4U%dU%õ5”ä2çÆ–W'2Ò¶çVÆÂÂçVÆÅÓ°¢4U%dU%õ5”ä2çÆ–W'5µ4U%dU%õ5”ä2ç6VEÒÒ°¢æ–6¶æÖS¢æ–6¶æÖUfÇVR‚’À¢6†&7FW$–C¢6VÆV7FVD6†&7FW$–B‚’À¢Ó°¢4U%dU%õ5”ä2æ–æ—F–Æ—¦–ærÒ4U%dU%õ5”ä2æ—4†÷7C°¢6†÷tvÖU67&VVâ‚“°¢–b…4U%dU%õ5”ä2æ—4†÷7B’°¢7F'DÖF6„ÖöFR…4U%dU%õ5”ä2çF&vWE6WG2óò"“°¢öÆÅ6W'fW%7FFR‚“°¢4U%dU%õ5”ä2çöÆÅF–ÖW"Òv–æF÷rç6WD–çFW'fÂ‡öÆÅ6W'fW%7FFRÂ“°¢&WGW&ã°¢Ð¢&VæFW"‚“°¢öÆÅ6W'fW%7FFR‚“°¢4U%dU%õ5”ä2çöÆÅF–ÖW"Òv–æF÷rç6WD–çFW'fÂ‡öÆÅ6W'fW%7FFRÂ“°§Ð ¦gVæ7F–öâ–æ—DÖVçR‚’°¢ÔTåUõ5DDRç6VÆV7FVEÆ–W$–æFW‚Ò4ô4…ôõD”ôå5´ÔTåUõ5DDRç6VÆV7FVEÆ–W$–æFW…ÒòÔTåUõ5DDRç6VÆV7FVEÆ–W$–æFW‚¢°¢•ô4ÅT%ô„õU4RæF–ff–7VÇG’Òæ÷&ÖÆ—¦T”F–ff–7VÇG’„•ô4ÅT%ô„õU4RæF–ff–7VÇG’“°¢•ô4ÅT%ô„õU4Ræ&öçW2Òæ÷&ÖÆ—¦T”&öçW4ÆWfVÂ„•ô4ÅT%ô„õU4Ræ&öçW2“°¢WFFTÖVçU6VÆV7F–öâ‚“°¢&VæFW$”6ÇV$†÷W6R‚“°¢&VæFW$WF…7FFR‚“°¢&VæFW$†öÖTæWw56V7F–öâ‚“°¢WFFT66W746öçG&öÇ2‚“°¢ÆöDWF…7FFR‚“°¢6öç7BFövvÆT66÷VçEæVÂÒ‚’Óâ6WDÆö&'”66÷VçEæVÄ÷Vâ†VÇ2æÆö&'”66÷VçEæVÃòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’“°¢VÇ2æÆö&'•6WGF–æw4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tFÖ–å67&VVâ“°¢VÇ2æÆö&'•W6W$'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFövvÆT66÷VçEæVÂ“°¢VÇ2ævÆö&ÅÆ–W%&öf–ÆT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢–b‡f—6–&ÆU67&VVäFW7F–æF–öâ‚’ÓÒ&vÖR"bbUD…õ5DDRçW6W"’6†÷u&öf–ÆU67&VVâ‚“°¢Ò“°¢VÇ2æÆö&'”ÖöFT6&G3òæf÷$V6‚‚†6&B’Óâ°¢6&BæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†÷tÆö&'•6V7F–öâ†6&BæFF6WBæ÷VäÆö&'•6V7F–öâ’“°¢Ò“°¢VÇ2ç&W7VÖTÆö6ÄÖF6„'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&W7VÖU&VÖVÖ&W&VDÆö6ÄÖF6‚“°¢VÇ2æF—66&DÆö6ÄÖF6„'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂF—66&E&VÖVÖ&W&VDÆö6ÄÖF6‚“°¢VÇ2çVÇF–ÖFTÖöFT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7F'EVÇF–ÖFTvÖR“°¢VÇ2çVÇF–ÖFUÆ–W$6†ö–6W3òçVW'•6VÆV7F÷$ÆÂ‚%¶FF×VÇF–ÖFR×Æ–W%Ò"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6öæf—&ÕVÇF–ÖFUÆ–W"„çVÖ&W"†'WGFöâæFF6WBçVÇF–ÖFUÆ–W"’’“°¢Ò“°¢VÇ2çVÇF–ÖFUÆ–W$F–ÆösòçVW'•6VÆV7F÷$ÆÂ‚%¶FF×VÇF–ÖFRÖ•Ò"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢TÅD”ÔDUôÔôDRæ”F–ff–7VÇG’Ò'WGFöâæFF6WBçVÇF–ÖFT’ÇÂ&æ÷&ÖÂ#°¢VÇ2çVÇF–ÖFUÆ–W$F–ÆörçVW'•6VÆV7F÷$ÆÂ‚%¶FF×VÇF–ÖFRÖ•Ò"’æf÷$V6‚‚†6†ö–6R’Óâ6†ö–6Ræ6Æ74Æ—7BçFövvÆR‚'6VÆV7FVB"Â6†ö–6RÓÓÒ'WGFöâ’“°¢Ò“°¢Ò“°¢VÇ2çVÇF–ÖFTG&gD6öæf—&ÓòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6öæf—&ÕVÇF–ÖFTG&gB“°¢VÇ2çVÇF–ÖFU'VÆW46Æ÷6SòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâVÇ2çVÇF–ÖFU'VÆW4F–Æösòæ6Æ74Æ—7BæFB‚&†–FFVâ"’“°¢VÇ2çVÇF–ÖFU÷7DW†6†ævT6öæf—&ÓòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢&W6öÇfUVÇF–ÖFU&W6W'fT6†ö–6R…TÅD”ÔDUôÔôDRç÷7DW†6†ævSòç6VÆV7FVE&W6W'fUV–BÇÂçVÆÂ“°¢Ò“°¢VÇ2çVÇF–ÖFU÷7DW†6†ævU6¶—òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ&W6öÇfUVÇF–ÖFU&W6W'fT6†ö–6R†çVÆÂ’“°¢VÇ2æ&6µFô†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æ÷VäæWw4&6†—fT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tæWw4&6†—fU67&VVâ“°¢VÇ2æ&6´g&öÔæWw4&6†—fT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æÆöv–ä'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂÆöv–ä66÷VçB“°¢VÇ2ç&Vv—7FW$'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&Vv—7FW$66÷VçB“°¢VÇ2æf÷&v÷E77v÷&D'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&WVW7E77v÷&E&W6WB“°¢VÇ2æ6öæf—&Õ&W6WE77v÷&D'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6öæf—&Õ77v÷&E&W6WB“°¢VÇ2æ&6µFôÆöv–äg&öÕ&W6WD'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢v–æF÷ræ†—7F÷'’ç&WÆ6U7FFR‡·ÒÂ""Âv–æF÷ræÆö6F–öâçF†æÖR“°¢6†÷tÖVçU67&VVâ‚“°¢Ò“°¢VÇ2æÆöv÷WD'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂÆöv÷WD66÷VçB“°¢VÇ2ç&öf–ÆT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷u&öf–ÆU67&VVâ“°¢VÇ2ç&VFVVÕ&ô6öFT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&VFVVÕ&ô6öFR“°¢VÇ2ç&ô6öFT–çWCòæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Â†WfVçB’Óâ°¢–b†WfVçBæ¶W’ÓÓÒ$VçFW""’&VFVVÕ&ô6öFR‚“°¢Ò“°¢VÇ2æ&6µFôÆö&'”g&öÔFÖ–ä'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æFÖ–äW‡÷'D‡VÖäÖF6†W4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂW‡÷'D‡VÖäÖF6„Æöw4f–ÆR“°¢VÇ2ævVæW&FU&ô6öFW4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂvVæW&FU&ô6öFW2“°¢VÇ2æFÖ–å&WevT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâÆöDFÖ–åW6W'2„UD…õ5DDRæFÖ–åvRÒ’“°¢VÇ2æFÖ–äæW‡EvT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâÆöDFÖ–åW6W'2„UD…õ5DDRæFÖ–åvR²’“°¢VÇ2æFÖ–äæW‡EvVV´'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFÖ–äGfæ6T6—&7V—EvVV²“°¢VÇ2æFÖ–å&Vg&W6„•&W÷'D'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂÆöDFÖ–ä•&W÷'B“°¢VÇ2æFÖ–å&W7F'E6V6öä'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFÖ–å&W7F'D7W'&VçE6V6öâ“°¢VÇ2æFÖ–å&W7F'E6V6öäöæT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFÖ–å&W7F'E6V6öäöæR“°¢Fö7VÖVçBçVW'•6VÆV7F÷$ÆÂ‚%¶FF×&æ¶–ær×6÷'EÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†ævU&æ¶–æu6÷'B†'WGFöâæFF6WBç&æ¶–æu6÷'B’“°¢Ò“°¢VÇ2æ÷Vå&æ¶–æuvT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷u&æ¶–æu67&VVâ“°¢VÇ2æ6—&7V—E&öf–ÆT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†÷u&öf–ÆU67&VVâ‚’“°¢VÇ2æ&6µFôÆö&'”g&öÕ&æ¶–æt'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†÷tÆö&'•6V7F–öâ‚&6—&7V—B"’“°¢VÇ2ç&æ¶–æt†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2ç&æ¶–æu&WevT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâÆöE&æ¶–ær„ÖF‚æÖ‚ƒÂUD…õ5DDRç&æ¶–æuvRÒ’’“°¢VÇ2ç&æ¶–ætæW‡EvT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâÆöE&æ¶–ær„ÖF‚æÖ–â„çVÖ&W"„UD…õ5DDRç&æ¶–æsòçF÷FÅvW2ÇÂ’ÂUD…õ5DDRç&æ¶–æuvR²’’“°¢VÇ2æ÷Vä6—&7V—D–æfô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷t6—&7V—D–æfõ67&VVâ“°¢VÇ2æ÷Vå6öÆô–æfô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷u6öÆô–æfõ67&VVâ“°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"6÷VäöæÆ–æT–æfô'WGFöâ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷töæÆ–æT–æfõ67&VVâ“°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"6&6µFôöæÆ–æTg&öÔ–æfô'WGFöâ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†÷tÆö&'•6V7F–öâ‚&öæÆ–æR"’“°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"6öæÆ–æT–æfô†öÖT'WGFöâ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"6&6µFõ6öÆôg&öÔ–æfô'WGFöâ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷t”6ÇV$†÷W6U67&VVâ“°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"76öÆô–æfô†öÖT'WGFöâ"“òæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æ&6µFôÆö&'”g&öÔ6—&7V—D–æfô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†÷tÆö&'•6V7F–öâ‚&6—&7V—B"’“°¢VÇ2æ6—&7V—D–æfô†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æ÷Vä6FV×”–æfô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷t6FV×”–æfõ67&VVâ“°¢VÇ2æ&6µFôÆö&'”g&öÔ6FV×”–æfô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†÷tÆö&'•6V7F–öâ‚'G&–æ–ær"’“°¢VÇ2æ6FV×”–æfô†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æ&6µFôÆö&'”g&öÕ&öf–ÆT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&WGW&äg&öÕ&öf–ÆR“°¢VÇ2ç&öf–ÆT†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æ&6µFõ&öf–ÆTg&öÔ6†&7FW$'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷u&öf–ÆU67&VVâ“°¢VÇ2æ&6µFôÆö&'”g&öÔ6†&7FW$'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2ææ–6¶æÖT–çWCòæFDWfVçDÆ—7FVæW"‚&–çWB"Â‚’Óâ°¢ÔTåUõ5DDRææ–6¶æÖRÒVÇ2ææ–6¶æÖT–çWBçfÇVRçG&–Ò‚“°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡Dæ–6¶æÖR"ÂÔTåUõ5DDRææ–6¶æÖR“°¢Ò“°¢VÇ2æ6ö6„6†ö–6T'WGFöç3òæf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7BæW‡D–æFW‚ÒçVÖ&W"†'WGFöâæFF6WBæÖVçT6ö6‚“°¢ÔTåUõ5DDRç6VÆV7FVEÆ–W$–æFW‚Ò4ô4…ôõD”ôå5¶æW‡D–æFW…ÒòæW‡D–æFW‚¢°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡E6VÆV7FVEÆ–W""Â7G&–ær„ÔTåUõ5DDRç6VÆV7FVEÆ–W$–æFW‚’“°¢WFFTÖVçU6VÆV7F–öâ‚“°¢Ò“°¢Ò“°¢Fö7VÖVçBçVW'•6VÆV7F÷$ÆÂ‚%¶FF×7F'B×6öÆõÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ7F'E6öÆôg&öÔÖVçR†'WGFöâæFF6WBç7F'E6öÆò’“°¢Ò“°¢Fö7VÖVçBçVW'•6VÆV7F÷$ÆÂ‚%¶FF×GWF÷&–ÂÖÖöGVÆUÒ"’æf÷$V6‚‚†'WGFöâ’Óâ°¢'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ7F'EGWF÷&–Â†'WGFöâæFF6WBçGWF÷&–ÄÖöGVÆR’“°¢Ò“°¢Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢6öç7BG&–vvW"ÒWfVçBçF&vWB–ç7Fæ6VöbVÆVÖVçBòWfVçBçF&vWBæ6Æ÷6W7B‚%¶FFÖ÷Vâ×GWF÷&–ÂÖÖöGVÆW5Ò"’¢çVÆÃ°¢–b‚G&–vvW"’&WGW&ã°¢WfVçBç&WfVçDFVfVÇB‚“°¢6†÷uGWF÷&–ÄÖöGVÆW567&VVâ‚“°¢Ò“°¢VÇ2æ&6µFõG&–æ–ætg&öÕGWF÷&–Ä'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6†÷tÆö&'•6V7F–öâ‚'G&–æ–ær"’“°¢VÇ2çGWF÷&–ÄÖöGVÆW4†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æ÷Vä”6ÇV$†÷W6T'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷t”6ÇV$†÷W6U67&VVâ“°¢VÇ2æ”6ÇV$†÷W6T†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2æ”6ÇV$†÷W6TÆövô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢VÇ2ç7F'D”6ÇV$†÷W6T'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7F'D”6ÇV$†÷W6T6ö×WF—F–öâ“°¢VÇ2ç&W7VÖT”6ÇV$†÷W6U6fT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&W7VÖT”6ÇV$†÷W6U6fR“°¢VÇ2æFVÆWFT”6ÇV$†÷W6U6fT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂFVÆWFT”6ÇV$†÷W6U6fR“°¢VÇ2æ”6ÇV$†÷W6U67&VVãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢6öç7B'WGFöâÒWfVçBçF&vWB–ç7Fæ6VöbVÆVÖVç@¢òWfVçBçF&vWBæ6Æ÷6W7B‚%¶FFÖ’Ö6ÇV"×6WGF–æuÒ"¢¢çVÆÃ°¢–b‚†'WGFöâ–ç7Fæ6Vöb…DÔÄ'WGFöäVÆVÖVçB’ÇÂ'WGFöâæF—6&ÆVB’&WGW&ã°¢WFFT”6ÇV$†÷W6U6WGF–ær†'WGFöâæFF6WBæ”6ÇV%6WGF–ærÂ'WGFöâæFF6WBæ”6ÇV%fÇVR“°¢Ò“°¢VÇ2ç&Vg&W6„Æö&'”'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â&Vg&W6„Æö&'•&öö×2“°¢VÇ2æ7&VFTÆö&'•&ööÔ'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7&VFTg&–VæFÇ•F÷W&æÖVçB“°¢VÇ2æ7&VFTg&–VæFÇ•F÷W&æÖVçD'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â7&VFTg&–VæFÇ•F÷W&æÖVçB“°¢v–æF÷ræ6ÆV$–çFW'fÂ„ÔTåUõ5DDRæÆö&'•F–ÖW"“°¢ÔTåUõ5DDRæÆö&'•F–ÖW"Òv–æF÷rç6WD–çFW'fÂ‚‚’Óâ°¢6öç7BöæÆ–æU6V7F–öâÒFö7VÖVçBçVW'•6VÆV7F÷"‚%¶FFÖÆö&'’×6V7F–öâ×æVÃÒvöæÆ–æRuÒ"“°¢–b‚VÇ2æÆö&'•6V7F–öå67&VVãòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’bböæÆ–æU6V7F–öãòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’’&Vg&W6„Æö&'•&öö×2‚“°¢ÒÂ3S“°¢Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢–b†VÇ2æÆö&'”66÷VçEæVÃòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’’&WGW&ã°¢6öç7BF&vWBÒWfVçBçF&vWB–ç7Fæ6VöbVÆVÖVçBòWfVçBçF&vWB¢çVÆÃ°¢–b‡F&vWCòæ6Æ÷6W7B‚"6Æö&'”66÷VçEæVÂÂ6Æö&'•6WGF–æw4'WGFöâÂ6Æö&'•W6W$'WGFöâÂ¶FFÖ÷VâÖÆö&'’×6V7F–öåÒ"’’&WGW&ã°¢6WDÆö&'”66÷VçEæVÄ÷Vâ†fÇ6R“°¢Ò“°¢VÇ2æÆö&'”66÷VçEæVÃòæFDWfVçDÆ—7FVæW"‚&Ö÷W6VÆVfR"Â‚’Óâ°¢–b„UD…õ5DDRçW6W"’6WDÆö&'”66÷VçEæVÄ÷Vâ†fÇ6R“°¢Ò“°¢Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Â†WfVçB’Óâ°¢–b†WfVçBæ¶W’ÓÓÒ$W66R"’6WDÆö&'”66÷VçEæVÄ÷Vâ†fÇ6R“°¢Ò“°¢Fö7VÖVçBçVW'•6VÆV7F÷$ÆÂ‚"æÖVçR×67&VVâæ'&æBÖÆövò"’æf÷$V6‚‚†Æövò’Óâ°¢–b†Æövòæ6Æ÷6W7B‚"6g&–VæFÇ”Æö&'”Æövô'WGFöâÂ6”6ÇV$†÷W6TÆövô'WGFöâÂæF—&V7BÖ†öÖRÖ'WGFöâ"’’&WGW&ã°¢Æövòç6WDGG&–'WFR‚'&öÆR"Â&'WGFöâ"“°¢Æövòç6WDGG&–'WFR‚'F&–æFW‚"Â#"“°¢ÆövòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ“°¢ÆövòæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Â†WfVçB’Óâ°¢–b…²$VçFW""Â"%Òæ–æ6ÇVFW2†WfVçBæ¶W’’’°¢WfVçBç&WfVçDFVfVÇB‚“°¢6†÷tÖVçU67&VVâ‚“°¢Ð¢Ò“°¢Ò“°¢Fö7VÖVçBçVW'•6VÆV7F÷$ÆÂ‚"æF—&V7BÖ†öÖRÖ'WGFöâ"’æf÷$V6‚‚†'WGFöâ’Óâ'WGFöâæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6†÷tÖVçU67&VVâ’“°¢6öç7Bæf–vF–öäö'6W'fW"ÒæWr×WFF–öäö'6W'fW"‡WFFTvÆö&ÅÆ–W$Fö6²“°¢¶VÇ2æÖVçU67&VVâÂVÇ2æÆö&'•6V7F–öå67&VVâÂVÇ2æFÖ–å67&VVâÂVÇ2ç&æ¶–æu67&VVâÂVÇ2æ6—&7V—D–æfõ67&VVâÂVÇ2ç6öÆô–æfõ67&VVâÂVÇ2æöæÆ–æT–æfõ67&VVâÂVÇ2æ6FV×”–æfõ67&VVâÂVÇ2çGWF÷&–ÄÖöGVÆW567&VVâÂVÇ2ç&öf–ÆU67&VVâÂVÇ2æ6†&7FW%67&VVâÂVÇ2æg&–VæFÇ”Æö&'•67&VVâÂVÇ2æ”6ÇV$†÷W6U67&VVâÂVÇ2æ6†×–öç6†—Æö&'•67&VVâÂVÇ2ævÖTÂVÇ2æÖö&–ÆTvÖTÐ¢æf–ÇFW"„&ööÆVâ¢æf÷$V6‚‚‡67&VVâ’Óâæf–vF–öäö'6W'fW"æö'6W'fR‡67&VVâÂ²GG&–'WFW3¢G'VRÂGG&–'WFTf–ÇFW#¢²&6Æ72%ÒÒ’“°¢WFFTvÆö&ÅÆ–W$Fö6²‚“°¢–b‡&W6WEFö¶Väg&öÕW&Â‚’’6†÷u&W6WE77v÷&E67&VVâ‚“°§Ð ¦VÇ2ææWtvÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂæWtvÖR“°¦VÇ2ç&WGW&äÆö&'”'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢–b„e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBbb7FFRævÖT÷fW"bb7FFRç6WDÖF6ƒòæÖF6„÷fW"’°¢&WGW&äg&–VæFÇ”ÖF6…Fô6ÇV$†÷W6R‚“°¢&WGW&ã°¢Ð¢÷Vå&WGW&äÆö&'”F–Æör‚“°§Ò“°¦VÇ2æöæÆ–æTf÷&fV—D'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â÷VäöæÆ–æTf÷&fV—DF–Æör“°¦VÇ2ç6fTÖF6„'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B&W7VÇBÒÖçVÆÇ•6fTÖF6‚‚“°¢–b‚VÇ2ç6fTÖF6„'WGFöâ’&WGW&ã°¢VÇ2ç6fTÖF6„'WGFöâçFW‡D6öçFVçBÒ&W7VÇBæÖW76vS°¢VÇ2ç6fTÖF6„'WGFöâæ6Æ74Æ—7BçFövvÆR‚'7V66W72"Â&W7VÇBæö²“°¢v–æF÷rç6WEF–ÖV÷WB‚‚’Óâ°¢–b‚VÇ2ç6fTÖF6„'WGFöâ’&WGW&ã°¢VÇ2ç6fTÖF6„'WGFöâçFW‡D6öçFVçBÒ%6WfVv&FW"#°¢VÇ2ç6fTÖF6„'WGFöâæ6Æ74Æ—7Bç&VÖ÷fR‚'7V66W72"“°¢ÒÂƒ“°§Ò“°¦VÇ2ævÖTÆövô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â÷Vå&WGW&äÆö&'”F–Æör“°¦VÇ2æFW6·F÷vÖTÖVçUFövvÆSòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6öç7B÷VâÒVÇ2ævÖTòæ6Æ74Æ—7Bæ6öçF–ç2‚&FW6·F÷ÖvÖRÖÖVçRÖ÷Vâ"“°¢VÇ2ævÖTòæ6Æ74Æ—7BçFövvÆR‚&FW6·F÷ÖvÖRÖÖVçRÖ÷Vâ"Â÷Vâ“°¢VÇ2æFW6·F÷vÖTÖVçUFövvÆSòç6WDGG&–'WFR‚&&–ÖW‡æFVB"Â7G&–ær†÷Vâ’“°¢VÇ2æFW6·F÷vÖTÖVçUFövvÆSòç6WDGG&–'WFR‚&&–ÖÆ&VÂ"Â÷Vâò$Ö7VW"ÆRÖVçRGRÖF6‚"¢$ff–6†W"ÆRÖVçRGRÖF6‚"“°§Ò“°¦VÇ2æFÖ–ävÖUf–WuFövvÆSòæFDWfVçDÆ—7FVæW"‚&6†ævR"Â‚’Óâ°¢–b‚6ä66W74FÖ–äfVGW&W2‚’’&WGW&ã°¢6öç7B&VfW&Væ6RÒVÇ2æFÖ–ävÖUf–WuFövvÆRæ6†V6¶VBò&FW6·F÷"¢&Öö&–ÆR#°¢Æö6Å7F÷&vRç6WD—FVÒ„DÔ”åôtÔUõd”Uuô´U’Â&VfW&Væ6R“°¢Æö6Å7F÷&vRç&VÖ÷fT—FVÒ„DÔ”åôDU4µDõõd”Uuô´U’“°¢7–æ4FÖ–äFW6·F÷f–Wu&VfW&Væ6R‡²Ç•f–Ws¢G'VRÒ“°§Ò“°¦VÇ2ævÖT76—7D'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ6WDvÖT76—7EæVÄ÷Vâ‚tÔUÄ•ô54•5BçæVÄ÷Vâ’“°¦VÇ2æ6ö×WF—F–öäF–Æöt'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â÷Vä6ö×WF—F–öäF–Æör“°¦VÇ2æ6ö×WF—F–öäF–Æöt6Æ÷6SòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â6Æ÷6T6ö×WF—F–öäF–Æör“°¦VÇ2æ6ö×WF—F–öäF–ÆösòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢–b†WfVçBçF&vWBÓÓÒVÇ2æ6ö×WF—F–öäF–Æör’6Æ÷6T6ö×WF—F–öäF–Æör‚“°§Ò“°¦Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Â†WfVçB’Óâ°¢–b†WfVçBæ¶W’ÓÓÒ$W66R"bbVÇ2æ6ö×WF—F–öäF–Æösòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’’6Æ÷6T6ö×WF—F–öäF–Æör‚“°§Ò“°¦VÇ2ævÖT–æf÷&ÖF–öåFövvÆSòæFDWfVçDÆ—7FVæW"‚&6†ævR"Â‚’Óâ°¢tÔUÄ•ô54•5Bæ–æf÷&ÖF–öâÒ&ööÆVâ†VÇ2ævÖT–æf÷&ÖF–öåFövvÆRæ6†V6¶VB“°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡D76—7D–æf÷&ÖF–öâ"Â7G&–ær„tÔUÄ•ô54•5Bæ–æf÷&ÖF–öâ’“°¢Æö6Å7F÷&vRç&VÖ÷fT—FVÒ‚'FVææ—4Æ–v‡D76—7E&Wf–Wr"“°¢&VæFW"‚“°§Ò“°¦VÇ2ævÖTÇv—5f—6–&ÆT7F–öç5FövvÆSòæFDWfVçDÆ—7FVæW"‚&6†ævR"Â‚’Óâ°¢tÔUÄ•ô54•5BæÇv—5f—6–&ÆT7F–öç2Ò&ööÆVâ†VÇ2ævÖTÇv—5f—6–&ÆT7F–öç5FövvÆRæ6†V6¶VB“°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡DÇv—5f—6–&ÆT7F–öç2"Â7G&–ær„tÔUÄ•ô54•5BæÇv—5f—6–&ÆT7F–öç2’“°¢Fö7VÖVçBæ&öG’æ6Æ74Æ—7BçFövvÆR‚&vÖRÖ7F–öç2ÖÇv—2×f—6–&ÆR"ÂtÔUÄ•ô54•5BæÇv—5f—6–&ÆT7F–öç2“°¢&VæFW"‚“°§Ò“°¦VÇ2ævÖT6&E¦ööÕFövvÆSòæFDWfVçDÆ—7FVæW"‚&6†ævR"Â‚’Óâ°¢tÔUÄ•ô54•5Bæ6&E¦ööÒÒ&ööÆVâ†VÇ2ævÖT6&E¦ööÕFövvÆRæ6†V6¶VB“°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡D6&E¦ööÒ"Â7G&–ær„tÔUÄ•ô54•5Bæ6&E¦ööÒ’“°¢–b‚tÔUÄ•ô54•5Bæ6&E¦ööÒ’°¢6Æ÷6T6&DÆö6Å&Wf–Wr‚“°¢Fö7VÖVçBçVW'•6VÆV7F÷"‚"æ–ÖvR×¦ööÒÖ&6¶G&÷"“òç&VÖ÷fR‚“°¢Ð§Ò“°¦Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚'ö–çFW&÷fW""Â†WfVçB’Óâ°¢6öç7B6&BÒWfVçBçF&vWCòæ6Æ÷6W7Còâ‚rçÆ–W"×æVÅ¶FFÖFW6·F÷×&öÆSÒ&Æö6Â%Òæ†æBæ6&Br“°¢–b‚6&BÇÂ6&Bæ6öçF–ç2†WfVçBç&VÆFVEF&vWB’’&WGW&ã°¢6öç7BæVÂÒ6&BçVW'•6VÆV7F÷"‚"æ6&BÖ†÷fW"×æVÂ"“°¢–b‚æVÂ’&WGW&ã°¢6öç7BæVÄ&÷&FW"ÒÖF‚æÖ‚ƒÂæVÂæöfg6WD†V–v‡BÒæVÂæ6Æ–VçD†V–v‡B“°¢6öç7BæVÄ&÷GFöÒÒæVÂæöfg6WEF÷²æVÂç67&öÆÄ†V–v‡B²æVÄ&÷&FW#°¢6öç7B÷fW&†ærÒÖF‚æÖ‚ƒÂæVÄ&÷GFöÒÒ6&Bæöfg6WD†V–v‡B“°¢6öç7B†÷fW%66ÆRÒã#c°¢6öç7B&÷GFöÕ6fWG’Ò#ƒ°¢6&Bç7G–ÆRç6WE&÷W'G’‚"ÒÖÆö6ÂÖ6&BÖ7F–öâÖÆ–gB"ÂG´ÖF‚æ6V–Â†÷fW&†ær¢†÷fW%66ÆR’²&÷GFöÕ6fWG—×†“°§Ò“°¦VÇ2ævÖTFF—fT&ö&EFövvÆSòæFDWfVçDÆ—7FVæW"‚&6†ævR"Â‚’Óâ°¢tÔUÄ•ô54•5BæFF—fT&ö&BÒ&ööÆVâ†VÇ2ævÖTFF—fT&ö&EFövvÆRæ6†V6¶VB“°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡D76—7DFF—fT&ö&B"Â7G&–ær„tÔUÄ•ô54•5BæFF—fT&ö&B’“°¢&VæFW"‚“°§Ò“°¦VÇ2ævÖT6&DFW67&—F–öç5FövvÆSòæFDWfVçDÆ—7FVæW"‚&6†ævR"Â‚’Óâ°¢tÔUÄ•ô54•5Bæ6&DFW67&—F–öç2Ò&ööÆVâ†VÇ2ævÖT6&DFW67&—F–öç5FövvÆRæ6†V6¶VB“°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡D6&DFW67&—F–öç2"Â7G&–ær„tÔUÄ•ô54•5Bæ6&DFW67&—F–öç2’“°¢&VæFW"‚“°§Ò“°¦VÇ2æg&–VæFÇ”Æö&'”†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâÆVfTg&–VæFÇ•F÷W&æÖVçDÆö&'’‡²FW7F–æF–öã¢&öæÆ–æR"Ò’“°¦VÇ2æg&–VæFÇ”Æö&'”F—&V7D†öÖT'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâÆVfTg&–VæFÇ•F÷W&æÖVçDÆö&'’‡²FW7F–æF–öã¢&†öÖR"Ò’“°¦VÇ2æg&–VæFÇ”Æö&'”Æövô'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâÆVfTg&–VæFÇ•F÷W&æÖVçDÆö&'’‡²FW7F–æF–öã¢&†öÖR"Ò’“°¦VÇ2ç7V7FF÷%V—D'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’ÓâV—Dg&–VæFÇ•7V7FF÷"†fÇ6R’“°¦VÇ2æFÖ–ävÖUFööÇ4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ°¢6WDFÖ–ävÖUFööÇ4÷Vâ†VÇ2æFÖ–ävÖUFööÇ5æVÃòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’“°§Ò“°¦VÇ2æFÖ–å6–×VÆFU66÷&T'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ'VäFÖ–ävÖUFööÂ‡6–×VÆFTFÖ–äÖF6…66÷&R’“°¦VÇ2ç&WfVÄ”'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ'VäFÖ–ävÖUFööÂ‡FövvÆU&WfVÄ”6&G2’“°¦VÇ2æW‡÷'DÆöw4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ'VäFÖ–ävÖUFööÂ†W‡÷'DÆöw4f–ÆR’“°¦VÇ2æFÖ–åVÇF–ÖFTW‡÷'DÆöw4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ'VäFÖ–ävÖUFööÂ†W‡÷'DÆöw4f–ÆR’“°¦VÇ2çVÇF–ÖFTW‡÷'DÆöw4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"ÂW‡÷'DÆöw4f–ÆR“°¦VÇ2æW‡÷'D‡VÖäÖF6†W4'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â‚’Óâ'VäFÖ–ävÖUFööÂ†W‡÷'D‡VÖäÖF6„Æöw4f–ÆR’“°¦VÇ2ç&ÆÇ”gVÆÄÆöt'WGFöãòæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â÷VägVÆÄ7F–öäÆötF–Æör“°¦Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢6öç7BF&vWBÒWfVçBçF&vWB–ç7Fæ6VöbVÆVÖVçBòWfVçBçF&vWB¢çVÆÃ°¢–b‚VÇ2æFÖ–ävÖUFööÇ5æVÃòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’bbF&vWCòæ6Æ÷6W7B‚"6FÖ–ävÖUFööÇ2"’’6WDFÖ–ävÖUFööÇ4÷Vâ†fÇ6R“°¢–b‚VÇ2ævÖT76—7EæVÃòæ6Æ74Æ—7Bæ6öçF–ç2‚&†–FFVâ"’bbF&vWCòæ6Æ÷6W7B‚"6vÖT76—7EFööÇ2"’’6WDvÖT76—7EæVÄ÷Vâ†fÇ6R“°§Ò“°¦Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&¶W–F÷vâ"Â†WfVçB’Óâ°¢–b†WfVçBæ¶W’ÓÓÒ$W66R"’°¢6WDFÖ–ävÖUFööÇ4÷Vâ†fÇ6R“°¢6WDvÖT76—7EæVÄ÷Vâ†fÇ6R“°¢6Æ÷6TgVÆÄ7F–öäÆötF–Æör‚“°¢Ð§Ò“°¦Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚&6Æ–6²"Â†WfVçB’Óâ°¢–b…5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&ã°¢6öç7BF&vWBÒWfVçBçF&vWB–ç7Fæ6VöbVÆVÖVçBòWfVçBçF&vWB¢WfVçBçF&vWCòç&VçDVÆVÖVçC°¢6öç7BÆ”'WGFöâÒF&vWCòæ6Æ÷6W7B‚%¶FF×Æ•Ò"“°¢–b‡Æ”'WGFöâ–ç7Fæ6Vöb…DÔÄ'WGFöäVÆVÖVçBbbÆ”'WGFöâæF—6&ÆVB’°¢WfVçBç&WfVçDFVfVÇB‚“°¢6öç7BÆ–W$–æFW‚ÒçVÖ&W"‡Æ”'WGFöâæFF6WBçÆ–W"“°¢6öç7B6&BÒ7FFRçÆ–W'5·Æ–W$–æFW…Óòæ†æBæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒÆ”'WGFöâæFF6WBçÆ’“°¢6öç7BÖöFRÒÆ”'WGFöâæFF6WBæÖöFRóò&æ÷&ÖÂ#°¢–b‚GWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂÖöFRÂfÇ6R’’&WGW&ã°¢Æ”6&B‡Æ–W$–æFW‚ÂÆ”'WGFöâæFF6WBçÆ’ÂfÇ6RÂçVÆÂÂÖöFR“°¢6ö×ÆWFUGWF÷&–Ä7F–öâ‡²¶–æC¢'Æ’"ÂÆ–W$–æFW‚Â6&D–C¢6&Còæ–BÂÖöFRÒ“°¢&WGW&ã°¢Ð¢6öç7B&ö÷7D'WGFöâÒF&vWCòæ6Æ÷6W7B‚%¶FFÖ&ö÷7EÒ"“°¢–b†&ö÷7D'WGFöâ–ç7Fæ6Vöb…DÔÄ'WGFöäVÆVÖVçBbb&ö÷7D'WGFöâæF—6&ÆVB’°¢WfVçBç&WfVçDFVfVÇB‚“°¢6öç7BÆ–W$–æFW‚ÒçVÖ&W"†&ö÷7D'WGFöâæFF6WBçÆ–W"“°¢6öç7B6&BÒ7FFRçÆ–W'5·Æ–W$–æFW…Óòæ†æBæf–æB‚†—FVÒ’Óâ—FVÒçV–BÓÓÒ&ö÷7D'WGFöâæFF6WBæ&ö÷7B“°¢–b‚GWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂ&&ö÷7B"ÂG'VR’’&WGW&ã°¢÷Vä&ö÷7DÖöFÂ‡Æ–W$–æFW‚Â&ö÷7D'WGFöâæFF6WBæ&ö÷7B“°¢&WGW&ã°¢Ð¢–b‡F&vWCòæ6Æ÷6W7B‚%¶FFÖf÷&6RÖ’×GW&åÒ"’’°¢f÷&6U6öÆô•GW&â‚“°¢Ð§Ò“° ¦gVæ7F–öâÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚’°¢–b…4U%dU%õ5”ä2æVæ&ÆVBbbçVÖ&W"æ—4–çFVvW"…4U%dU%õ5”ä2ç6VB’’&WGW&â4U%dU%õ5”ä2ç6VC°¢–b„e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBbbçVÖ&W"æ—4–çFVvW"„e$”TäDÅ•õDõU$äÔTåBæÆö6ÄÖF6…6VB’’°¢&WGW&âe$”TäDÅ•õDõU$äÔTåBæÆö6ÄÖF6…6VC°¢Ð¢–b…4ôÄõô’æVæ&ÆVB’&WGW&â÷öæVçDöb…4ôÄõô’çÆ–W$–æFW‚“°¢&WGW&â°§Ð ¦gVæ7F–öâFW6·F÷Æ–W%&W6VçFF–öâ‚’°¢6öç7BÆö6ÂÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢&WGW&â°¢Æö6ÂÀ¢÷öæVçC¢÷öæVçDöb†Æö6Â’À¢Ó°§Ð ¦gVæ7F–öâÖö&–ÆU6WE66÷&U7FFR‡Æ–W$–æFW‚’°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb‡Æ–W$–æFW‚“°¢6öç7B6ö×ÆWFVBÒ'&’æ—4'&’‡7FFRç6WDÖF6ƒòæ6ö×ÆWFVE66÷&W2’ò7FFRç6WDÖF6‚æ6ö×ÆWFVE66÷&W2¢µÓ°¢6öç7BF&vWE6WG2ÒÖF‚æÖ‚ƒÂçVÖ&W"‡7FFRç6WDÖF6ƒòçF&vWE6WG2ÇÂ’“°¢6öç7BÖ†–×VÕ6WG2Ò‡F&vWE6WG2¢"’Ò°¢6öç7B6WG2Ò6ö×ÆWFVBæÖ‚‡66÷&R’Óâ°¢6öç7BÆ–W%66÷&RÒçVÖ&W"‡66÷&Sòå·Æ–W$–æFW…ÒÇÂ“°¢6öç7B÷öæVçE66÷&RÒçVÖ&W"‡66÷&Sòå¶÷öæVçD–æFW…ÒÇÂ“°¢&WGW&â°¢Æ–W#¢Æ–W%66÷&RÀ¢÷öæVçC¢÷öæVçE66÷&RÀ¢v–ææW#¢Æ–W%66÷&Râ÷öæVçE66÷&Rò%Ä”U""¢$õôäTåB"À¢Ó°¢Ò“°¢–b‚7FFRç6WDÖF6ƒòç6WD÷fW"bb'&’æ—4'&’‡7FFRç6WDÖF6ƒòç66÷&R’’°¢6WG2çW6‚‡°¢Æ–W#¢çVÖ&W"‡7FFRç6WDÖF6‚ç66÷&U·Æ–W$–æFW…ÒÇÂ’À¢÷öæVçC¢çVÖ&W"‡7FFRç6WDÖF6‚ç66÷&U¶÷öæVçD–æFW…ÒÇÂ’À¢v–ææW#¢çVÆÂÀ¢Ò“°¢Ð¢v†–ÆR‡6WG2æÆVæwF‚ÂÖ†–×VÕ6WG2’6WG2çW6‚‡²Æ–W#¢çVÆÂÂ÷öæVçC¢çVÆÂÂv–ææW#¢çVÆÂÒ“°¢&WGW&â6WG2ç6Æ–6RƒÂÖ†–×VÕ6WG2“°§Ð ¦gVæ7F–öâÖö&–ÆUÆ–W%7VÖÖ'’‡Æ–W$–æFW‚’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7BF÷W&æÖVçDVçG'’Ò7FFRçF÷W&æÖVçBæ7F—fRbbÆ–W$–æFW‚ÓÓÒ ¢ò…TÔåõDõU$äÔTåEôTåE%¢¢Æ–W#òæ6†&7FW$–C°¢6öç7B&æ²ÒÆ–W#òçv÷&ÆE&æ²ÇÂF÷W&æÖVçEv÷&ÆE&æ´f÷$VçG'’‡F÷W&æÖVçDVçG'’“°¢6öç7B—4•Æ–W"Ò4ôÄõô’æVæ&ÆVBbbÆ–W$–æFW‚ÓÓÒ4ôÄõô’çÆ–W$–æFWƒ°¢6öç7B”ÆWfVÂÒ—4•Æ–W"òæ÷&ÖÆ—¦T”–çFVÆÆ–vVæ6R…4ôÄõô’ç7G–ÆR’¢çVÆÃ°¢6öç7B”ÆWfVÄÆ&VÇ2Ò°¢ÖFWW#¢$ÖFWW""À¢æ÷&ÖÃ¢$æ÷&ÖÂ"À¢W‡W'C¢$W‡W'B"À¢6†×–öã¢$6†×–öâ"À¢ÆVvVæC¢$Ì:–vVæFR"À¢Ó°¢&WGW&â°¢æÖS¢F—7Æ•Æ–W$æÖR‡Æ–W"’À¢6†&7FW$æÖS¢Æ–W#òææÖRÇÂ""À¢6V6öæF'”Æ&VÃ¢G¶g&Væ6„÷&F–æÅ&æ²‡&æ²—ÒG¶”ÆWfVÂòÒ”G¶”ÆWfVÄÆ&VÇ5¶”ÆWfVÅ×Ö¢"'ÖÀ¢'Gv÷&³¢$ôd”ÄUô4„$5DU%ô”ÔtU5·Æ–W#òæ6†&7FW$–EÐ¢ÇÂ4„$5DU%ô”ÔtU5·Æ–W#òæ6†&7FW$–EÓòå·Æ–W#òæ6†&7FW%6–FRÇÂÐ¢ÇÂ4„$5DU%ô”ÔtU2æ6ö6…Væ¶æ÷vå³ÒÀ¢÷vW#¢çVÖ&W"‡Æ–W#òç÷vW"ÇÂ’À¢VæGW&æ6S¢çVÖ&W"‡Æ–W#òæVæGW&æ6RÇÂ’À¢†æD6÷VçC¢çVÖ&W"‡Æ–W#òæ†æCòæÆVæwF‚ÇÂ’À¢—47F—fS¢7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW‚bb7FFRævÖT÷fW"À¢Ó°§Ð ¦ÆWBÖö&–ÆU6VÆV7FVD6&EV–BÒçVÆÃ°¦ÆWBÖö&–ÆUÆ•7V&Ö—76–öäÆö6¶VBÒfÇ6S° ¦gVæ7F–öâÖö&–ÆT6&EVæf–Æ&ÆU&V6öâ‡Æ–W$–æFW‚Â6&B’°¢–b‡7FFRævÖT÷fW"’&WGW&â$Î(	œ:–6†ævRW7BFW&Ö–ì:’â#°¢–b‡Æ–W$–æFW‚ÓÒ7FFRæ7F—fUÆ–W"’&WGW&â$GFVæFW¢f÷G&RF÷W"÷W"¦÷VW"6WGFR6'FRâ#°¢–b‚6åW6U6VB‡Æ–W$–æFW‚’’&WGW&â4U%dU%õ5”ä2æVæ&ÆV@¢ò$6WGFR6'FR'F–VçB:Î(	–WG&R¦÷VWW"â ¢¢$6WGFR6'FRæRWWB2:§G&R¦÷\:–RVæFçBÆRF÷W"FRÎ(	””â#°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B6÷7BÒVffV7F—fT6÷7B‡Æ–W"Â6&B“°¢–b‚6äff÷&B‡Æ–W"Â6&B’’&WGW&âVæGW&æ6R–ç7Vff—6çFR¢G¶6÷7GÒ&WV—6RÂG·Æ–W"æVæGW&æ6WÒF—7öæ–&ÆRæ°¢–b‚6F—6f–W4fÖ–Ç”Æ–Ö—B‡Æ–W"Â6&B’’&WGW&âG—R–æ6ö×F–&ÆR¢¦÷VW¢G·Æ–W"æÆ–Ö—FVDfÖ–Æ–W2æ¦ö–â‚"÷R"—Òæ°¢–b‚—5&VÖ—6R†6&B’bb6F—6f–W5&WGW&å6W'f–6U&W7G&–7F–öâ†6&B’’&WGW&â%&WF÷W"FR6W'f–6R¢föÌ:–RWB6Ö6‚6öçB–çFW&F—G2â#°¢6öç7B¦ö¶W$ç7vW'4&ö÷7BÒ6&BæVffV7EG—RÓÓÒ&¦ö¶W%&W7öç6R"bb7FFRæÖæFF÷'•Æ6VÖVçE&V6öâÓÓÒ&&ö÷7B#°¢6öç7B&ö÷7E&VÖ–ç5Æ–&ÆRÒ—5&VÖ—6R†6&B’bb6åÆ”&ö÷7B‡Æ–W$–æFW‚Â6&B“°¢–b‚—5&VÖ—6R†6&B’bb7FFRæÖæFF÷'•Æ6VÖVçBbb†5Æ6VÖVçDf÷%&Wf–÷W2‡Æ–W$–æFW‚Â6&B’bb¦ö¶W$ç7vW'4&ö÷7Bbb&ö÷7E&VÖ–ç5Æ–&ÆR’°¢&WGW&âÆ6VÖVçB–ç7Vff—6çB¢G·F÷FÅGW&åÆ6VÖVçB‡Æ–W$–æFW‚Â6&B—Òö'FVçRÂG·&WV—&VEÆ6VÖVçDf÷$Æ7D6&B‚—Ò&WV—2æ°¢Ð¢–b‡7FFRçGWF÷&–Âæ7F—fR’°¢6öç7B7F–öâÒGWF÷&–ÄW‡V7FVD7F–öâ‚“°¢6öç7BÖöFRÒ—5&VÖ—6R†6&B’ò&VffV7B"¢&æ÷&ÖÂ#°¢6öç7B6VÆV7F–öäÆÆ÷vVBÒ7F–öãòæ¶–æBÓÓÒ'6VÆV7D6&B ¢bb7F–öâçÆ–W$–æFW‚ÓÓÒÆ–W$–æFW€¢bb7F–öâæ6&D–BÓÓÒ6&Bæ–C°¢6öç7BÆ”ÆÆ÷vVBÒ7F–öãòæ¶–æBÓÓÒ'Æ’ ¢bb7F–öâçÆ–W$–æFW‚ÓÓÒÆ–W$–æFW€¢bb7F–öâæ6&D–BÓÓÒ6&Bæ–@¢bb7F–öâæÖöFRÓÓÒÖöFS°¢–b‚6VÆV7F–öäÆÆ÷vVBbbÆ”ÆÆ÷vVB’&WGW&â$ÆRGWF÷&–VÂFVÖæFRVæRWG&R7F–öââ#°¢Ð¢&WGW&âçVÆÃ°§Ð ¦gVæ7F–öâÖö&–ÆT6&E&Wf–Wr‡Æ–W$–æFW‚Â6&B’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B7FG2ÒvWD6&E7FG2‡Æ–W"Â6&BÂfÇ6R“°¢6öç7B&VÄ6÷7BÒVffV7F—fT6÷7B‡Æ–W"Â6&B“°¢6öç7B&W7VÇF–æuÆ6VÖVçBÒF÷FÅGW&åÆ6VÖVçB‡Æ–W$–æFW‚Â6&BÂfÇ6R“°¢6öç7BÆ–VD&öçW6W2ÒµÓ°¢–b‡&VÄ6÷7BÂ6&Bæ6÷7B’Æ–VD&öçW6W2çW6‚†,:–GV7F–öâFR6ü;·B¢ÒG¶6&Bæ6÷7BÒ&VÄ6÷7GÒVæGW&æ6V“°¢–b‡&VÄ6÷7Bâ6&Bæ6÷7B’Æ–VD&öçW6W2çW6‚†7W&6ü;·B¢²G·&VÄ6÷7BÒ6&Bæ6÷7GÒVæGW&æ6V“°¢–b‡7FG2ç÷vW"ÓÒ6&Bç÷vW"’Æ–VD&öçW6W2çW6‚†V—76æ6RÖöF–fœ:–R¢G¶6&Bç÷vW'Ò(i"G·7FG2ç÷vW'Ö“°¢–b‡7FG2ç&V6—6–öâÓÒ6&Bç&V6—6–öâ’Æ–VD&öçW6W2çW6‚†,:–6—6–öâÖöF–fœ:–R¢G¶6&Bç&V6—6–öçÒ(i"G·7FG2ç&V6—6–öçÖ“°¢–b‡7FG2çÆ6VÖVçBÓÒ6&BçÆ6VÖVçB’Æ–VD&öçW6W2çW6‚†Æ6VÖVçBÖöF–fœ:’¢G¶6&BçÆ6VÖVçGÒ(i"G·7FG2çÆ6VÖVçGÖ“°¢–b‡7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…Òâ’Æ–VD&öçW6W2çW6‚†Æ6VÖVçBL:–¬:,:—,:’¢²G·7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…×Ö“°¢–b†—4æW‡DVffV7D6æ6VÆVDf÷"‡Æ–W$–æFW‚’bb6&BæVffV7EG—R’Æ–VD&öçW6W2çW6‚‚$VffWBæçVÌ:’"Î(	–GfW'6—&R"“°¢&WGW&â°¢&VÄ6÷7BÀ¢&VÅ÷vW#¢7FG2ç÷vW"À¢VffV7G3¢¶6&BæVffV7BÇÂ$V7VâVffWB%Òæf–ÇFW"„&ööÆVâ’À¢VffV7D6æ6VÆVD'”÷öæVçC¢&ööÆVâ†—4æW‡DVffV7D6æ6VÆVDf÷"‡Æ–W$–æFW‚’bb6&BæVffV7EG—R’À¢&W7VÇF–æuÆ6VÖVçBÀ¢Æ–VD&öçW6W2À¢Æ”÷F–öç3¢Öö&–ÆT6&EÆ”÷F–öç2‡Æ–W$–æFW‚Â6&B’À¢Ó°§Ð ¦gVæ7F–öâÖö&–ÆT6&EÆ”÷F–öç2‡Æ–W$–æFW‚Â6&B’°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢–b‚Æ–W"ÇÂ6&B’&WGW&âµÓ°¢6öç7B÷F–öâÒ†ÖöFRÂÆ&VÂÂ&ö÷7FVBÒfÇ6R’Óâ°¢6öç7B7FG2ÒvWD6&E7FG2‡Æ–W"Â6&BÂ&ö÷7FVB“°¢&WGW&â°¢ÖöFRÀ¢Æ&VÂÀ¢&VÄ6÷7C¢VffV7F—fT6÷7B‡Æ–W"Â6&B’À¢&VÅ÷vW#¢7FG2ç÷vW"À¢&W7VÇF–æuÆ6VÖVçC¢F÷FÅGW&åÆ6VÖVçB‡Æ–W$–æFW‚Â6&BÂ&ö÷7FVB’À¢&ö÷7E&—6³¢&ööÆVâ€¢&ö÷7FV@¢bbÖöFRÓÒ&VffV7B ¢bb7FFRæÆ7D6&@¢bbF÷FÅGW&åÆ6VÖVçB‡Æ–W$–æFW‚Â6&BÂ&ö÷7FVB’Â&WV—&VEÆ6VÖVçDf÷$Æ7D6&B‚¢bb7FFRçGW&ä–væ÷&W5Æ6VÖVçE·Æ–W$–æFW…Ð¢bb7FFRçGW&ä6ææ÷D÷Vä&ö÷7E·Æ–W$–æFW…Ð¢’À¢&WV—&W567&–f–6S¢&ö÷7FVBÀ¢67&–f–6W3¢&ö÷7FV@¢òÆ–W"æ†æBæf–ÇFW"‚†6æF–FFR’Óâ6æF–FFRçV–BÓÒ6&BçV–B’æÖ‚†6æF–FFR’Óâ‡°¢–C¢6æF–FFRçV–BÀ¢æÖS¢6æF–FFRææÖRÀ¢'Gv÷&³¢4$Eô”ÔtU5¶6æF–FFRæ–EÒÇÂ4$Eô$4µô”ÔtRÀ¢Ò’¢¢µÒÀ¢Ó°¢Ó°¢6öç7B÷F–öç2Ò—5&VÖ—6R†6&B¢ò°¢6åÆ”VffV7DÖöFR‡Æ–W$–æFW‚Â6&B’ò÷F–öâ‚&VffV7B"Â$¦÷VW"VâVffWB"’¢çVÆÂÀ¢6åÆ”æ÷&ÖÂ‡Æ–W$–æFW‚Â6&B’ò÷F–öâ‚'Æ6VÖVçB"Â$¦÷VW"Vâ&VÖ—6R"’¢çVÆÂÀ¢Ð¢¢°¢6åÆ”æ÷&ÖÂ‡Æ–W$–æFW‚Â6&B’ò÷F–öâ‚&æ÷&ÖÂ"Â$¦÷VW"ÆR6÷W"’¢çVÆÂÀ¢6åÆ”&ö÷7B‡Æ–W$–æFW‚Â6&B’ò÷F–öâ‚&&ö÷7B"Â$¦÷VW"Vâ&ö÷7B"ÂG'VR’¢çVÆÂÀ¢Ó°¢&WGW&â÷F–öç2æf–ÇFW"‚†6æF–FFR’Óâ°¢–b‚6æF–FFR’&WGW&âfÇ6S°¢6öç7BÖöFRÒ6æF–FFRæÖöFRÓÓÒ'Æ6VÖVçB"ÇÂ6æF–FFRæÖöFRÓÓÒ&VffV7B"ò6æF–FFRæÖöFR¢&æ÷&ÖÂ#°¢&WGW&âGWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂÖöFRÂ6æF–FFRæÖöFRÓÓÒ&&ö÷7B"“°¢Ò“°§Ð ¦gVæ7F–öâÖö&–ÆTÖöFT6öçFW‡B‚’°¢6öç7BÆVwVU7FæF–æw57FFRÒ7FFRçF÷W&æÖVçCòæ7F—fRbb7FFRçF÷W&æÖVçBæÆVwVP¢òö&¦V7Bæ¶W—2‡7FFRçF÷W&æÖVçBæÆVwVTw&÷W2ÇÂ·Ò’æÖ‚†w&÷W’Óâ‡°¢w&÷WÀ¢&÷w3¢ÆVwVU7FæF–æw2†w&÷WÂÖF‚æÖ‚ƒÂÆVwVT6ö×ÆWFVDw&÷WF—2‚’’’æÖ‚‡&÷rÂ–æFW‚’Óâ‡°¢÷6—F–öã¢–æFW‚²À¢Æ–W#¢F÷W&æÖVçEÆ–W$Æ&VÂ‡&÷ræVçG'’’À¢Æ–VC¢&÷rçÆ–VBÀ¢v–ç3¢&÷rçv–ç2À¢ö–çG3¢&÷rçö–çG2À¢6WG3¢G·&÷rç6WG5vöçÞ(	2G·&÷rç6WG4Æ÷7GÖÀ¢Ò’’À¢Ò’¢¢µÓ°¢&WGW&â°¢Æ&VÃ¢7W'&VçDÖöFTÆ&VÂ‚’À¢66÷&S¢7W'&VçDÖF6…66÷&UFW‡B‚’À¢6äf÷&fV—C¢&ööÆVâ‚5T5DDõ%ôÔôDRæVæ&ÆVBbb7FFRævÖT÷fW"bb…4U%dU%õ5”ä2æVæ&ÆVBÇÂ„e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBbbe$”TäDÅ•õDõU$äÔTåBæ–äÖF6‚’’’À¢6ö×WF—F–öã¢7FFRçF÷W&æÖVçCòæ7F—fRò°¢F—FÆS¢7FFRçF÷W&æÖVçBæ6ö×WF—F–öäæÖRÇÂ$6ö×:—F—F–öâ"À¢7FvS¢F÷W&æÖVçE7FvTÆ&VÂ‚’À¢&÷VæC¢‡VÖåF÷W&æÖVçE&÷VæDÆ&VÂ‚’ÇÂF÷W&æÖVçE7FvTÆ&VÂ‚’À¢7W&f6S¢7FFRçF÷W&æÖVçBæ6ö×WF—F–öå7W&f6TÆ&VÂÇÂ""À¢ö–çG3¢7FFRçF÷W&æÖVçBçvVV¶Ç’ò‡VÖåF÷W&æÖVçEö–çG2‚’çö–çG2¢çVÆÂÀ¢6†×–öã¢7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–@¢òF÷W&æÖVçEÆ–W$Æ&VÂ‡7FFRçF÷W&æÖVçBæ6†×–öä6†&7FW$–B¢¢""À¢ÆVwVS¢&ööÆVâ‡7FFRçF÷W&æÖVçBæÆVwVR’À¢7FæF–æs¢ÆVwVT‡VÖå7FæF–æu&VÖ–æFW"‚’À¢7FæF–æw3¢ÆVwVU7FæF–æw57FFRÀ¢ÖF6†W3¢‡7FFRçF÷W&æÖVçBæÖF6†W2ÇÂµÒ’æÖ‚†ÖF6‚’Óâ‡°¢–C¢ÖF6‚æ–BÀ¢Æ&VÃ¢ÖF6‚æÆ&VÂÀ¢Æ–W$¢F÷W&æÖVçEÆ–W$Æ&VÂ†ÖF6‚çÆ–W$’À¢Æ–W$#¢F÷W&æÖVçEÆ–W$Æ&VÂ†ÖF6‚çÆ–W$"’À¢66÷&S¢ÖF6‚æÆ—fU66÷&RÇÂÖF6‚ç66÷&RÇÂ""À¢7FGW3¢ÖF6‚çv–ææW"ò%FW&Ö–ì:’"¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÓÓÒÖF6‚æ–Bò$VâF—&V7B"¢ÖF6‚çÆ–W$bbÖF6‚çÆ–W$"ò,8¦÷VW""¢,8fVæ—""À¢7W'&VçC¢7FFRçF÷W&æÖVçBæ7W'&VçDÖF6‚ÓÓÒÖF6‚æ–BÀ¢Ò’’À¢Ò¢çVÆÂÀ¢Ó°§Ð ¦gVæ7F–öâÖö&–ÆUGWF÷&–Å7FFR‚’°¢6öç7B7FWÒGWF÷&–Å7FW‚“°¢–b‚7FFRçGWF÷&–Âæ7F—fRÇÂ7FW’&WGW&âçVÆÃ°¢6öç7BÖöGVÆRÒGWF÷&–ÄÖöGVÆR‚“°¢6öç7Bæ'&F÷"ÒEUDõ$”Åôä%$Dõ%5·7FWææ'&F÷"óòÖöGVÆRææ'&F÷%ÒóòEUDõ$”Åôä%$Dõ%2æ6ö6„§S°¢6öç7B6†÷v66T6&BÒ7FWç6†÷v66Sòæ6&D–@¢ò4$EôÄ”%$%’æf–æB‚†6&B’Óâ6&Bæ–BÓÓÒ7FWç6†÷v66Ræ6&D–B¢¢çVÆÃ°¢&WGW&â°¢F—FÆS¢7FWçF—FÆRÀ¢FW‡C¢GWF÷&–ÅÆ–åFW‡B‡7FWçFW‡B’À¢ÆW76öã¢ÖöGVÆRæÆW76öâÀ¢&öw&W73¢7FWæF—7Æ•7FWò8—FRG·7FWæF—7Æ•7FWÒòG¶ÖöGVÆRçF÷FÄF—7Æ•7FW7Ö¢""À¢æ'&F÷#¢²æÖS¢æ'&F÷"ææÖRÂ&öÆS¢æ'&F÷"ç&öÆRÂ'Gv÷&³¢æ'&F÷"æ–ÖvRÒÀ¢7F–öäÆ&VÃ¢7FWæ7F–öâòGWF÷&–Ä7F–öäÆ&VÂ‡7FWæ7F–öâ’¢""À¢W'&÷#¢7FFRçGWF÷&–ÂæW'&÷"ÇÂ""À¢v—F–æs¢7FFRçGWF÷&–ÂçVæF–ætWFõ7FW–BÓÓÒ7FWæ–BÀ¢6ä6öçF–çVS¢7FWæ7F–öâbb7FFRçGWF÷&–ÂçVæF–ætWFõ7FW–BÓÒ7FWæ–BÀ¢6öçF–çVTÆ&VÃ¢7FWæf–æÂò%FW&Ö–æW"ÆÆ\:vöâ"¢%7V—fçB"À¢6†÷v66S¢6†÷v66T6&Bò°¢æÖS¢6†÷v66T6&BææÖRÀ¢'Gv÷&³¢4$Eô”ÔtU5·6†÷v66T6&Bæ–EÒÇÂ4$Eô$4µô”ÔtRÀ¢Æ&VÃ¢7FWç6†÷v66RæÆ&VÂÇÂ""À¢Ò¢çVÆÂÀ¢Ó°§Ð ¦gVæ7F–öâ6öçF–çVTÖö&–ÆUGWF÷&–Â‚’°¢6öç7B7FWÒGWF÷&–Å7FW‚“°¢–b‚7FFRçGWF÷&–Âæ7F—fRÇÂ7FWÇÂ7FWæ7F–öâÇÂ7FFRçGWF÷&–ÂçVæF–ætWFõ7FW–BÓÓÒ7FWæ–B’&WGW&â²ö³¢fÇ6RÓ°¢–b‡7FWæf–æÂ’f–æ—6…GWF÷&–Â‚“°¢VÇ6RGfæ6UGWF÷&–Â‚“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâÖö&–ÆU&öw&W76–öä7F–öç2‚’°¢6öç7BÖ&·WÒ&VæFW%&öw&W76–öä'WGFöç2‚“°¢6öç7BFVf–æ—F–öç2Ò°¢²&æW‡B×6öÆòÖW†6†ævR"Â&FFÖæW‡B×6öÆòÖW†6†ævR"Â,8–6†ævR7V—fçB%ÒÀ¢²&æW‡B×6WBÖW†6†ævR"Â&FFÖæW‡B×6WBÖW†6†ævR"Â,8–6†ævR7V—fçB%ÒÀ¢²&æW‡BÖgVÆÂ×6WB"Â&FFÖæW‡BÖgVÆÂ×6WB"Â%6WB7V—fçB%ÒÀ¢²'F÷W&æÖVçBÖæW‡B"Â&FF×7F'B×F÷W&æÖVçBÖæW‡BÖÖF6‚"Â7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG”f–æÂ"ò$f–æÆR"¢7FFRçF÷W&æÖVçBç7FvRÓÓÒ'&VG•6VÖ’"ò$FVÖ’Öf–æÆR"¢$ÖF6‚7V—fçB%ÒÀ¢²&W†—B×F÷W&æÖVçB"Â&FFÖW†—B×F÷W&æÖVçB"Â%6÷'F—"GRF÷W&æö’%ÒÀ¢²'&WGW&âÖ6ÇV"Ö†÷W6R"Â&FF×&WGW&âÖ6ÇV"Ö†÷W6R"Â%&WF÷W"6ÇV"†÷W6R%ÒÀ¢²'&WGW&âÖ6†×–öç6†—ÖÆö&'’"Â&FF×&WGW&âÖ6†×–öç6†—ÖÆö&'’"Â%&WF÷W"R6ÇV"†÷W6R%ÒÀ¢²&6ö×WF—F–öâ×7VÖÖ'’"Â&FFÖ6ö×WF—F–öâ×7VÖÖ'’"Â%,:—7VÜ:’6ö×:—F—F–öâ%ÒÀ¢Ó°¢6öç7B7F–öç2ÒFVf–æ—F–öç0¢æf–ÇFW"‚…²ÂGG&–'WFUÒ’ÓâÖ&·Wæ–æ6ÇVFW2†GG&–'WFR’¢æÖ‚…¶–BÂÂÆ&VÅÒ’Óâ‡²–BÂÆ&VÂÒ’“°¢6öç7B&WÆ”f–Æ&ÆRÒ7FFRç&W7VÇD–æfóòç6WDÖF6ƒòæÖF6„÷fW ¢bb7FFRçF÷W&æÖVçCòæ7F—fRbb4U%dU%õ5”ä2æVæ&ÆVBbb4ôÄõô’æVæ&ÆV@¢bb³"Â5Òæ–æ6ÇVFW2„çVÖ&W"‡7FFRç6WDÖF6ƒòçF&vWE6WG2’“°¢–b‡&WÆ”f–Æ&ÆR’°¢7F–öç2çW6‚‡²–C¢'&WÆ’ÖÖF6‚"ÂÆ&VÃ¢%&V¦÷VW"ÆRÖF6‚"Ò“°¢7F–öç2çW6‚‡²–C¢'V—BÖ6÷W'B"ÂÆ&VÃ¢%V—GFW"ÆR6÷W'B"Ò“°¢Ð¢&WGW&â7F–öç3°§Ð ¦gVæ7F–öâ'VäÖö&–ÆU&öw&W76–öä7F–öâ†7F–öä–B’°¢6öç7Bf–Æ&ÆRÒæWr6WB†Öö&–ÆU&öw&W76–öä7F–öç2‚’æÖ‚†7F–öâ’Óâ7F–öâæ–B’“°¢–b‚f–Æ&ÆRæ†2†7F–öä–B’’&WGW&â²ö³¢fÇ6RÓ°¢–b†7F–öä–BÓÓÒ&æW‡B×6öÆòÖW†6†ævR"’æW‡E6öÆôW†6†ævR‚“°¢VÇ6R–b†7F–öä–BÓÓÒ&æW‡B×6WBÖW†6†ævR"’æW‡E6WDW†6†ævR‚“°¢VÇ6R–b†7F–öä–BÓÓÒ&æW‡BÖgVÆÂ×6WB"’æW‡DgVÆÅ6WB‚“°¢VÇ6R–b†7F–öä–BÓÓÒ'F÷W&æÖVçBÖæW‡B"’7F'EF÷W&æÖVçDæW‡DÖF6„g&öÔ6VçFW"‚“°¢VÇ6R–b†7F–öä–BÓÓÒ&W†—B×F÷W&æÖVçB"’W†—EF÷W&æÖVçEFôÆö&'’‚“°¢VÇ6R–b†7F–öä–BÓÓÒ'&WGW&âÖ6ÇV"Ö†÷W6R"’&WGW&äg&–VæFÇ”ÖF6…Fô6ÇV$†÷W6R‚“°¢VÇ6R–b†7F–öä–BÓÓÒ'&WGW&âÖ6†×–öç6†—ÖÆö&'’"’&WGW&ä6†×–öç6†—Æö&'’‚“°¢VÇ6R–b†7F–öä–BÓÓÒ&6ö×WF—F–öâ×7VÖÖ'’"’6†÷t6ö×WF—F–öå7VÖÖ'•67&VVâ‚“°¢VÇ6R–b†7F–öä–BÓÓÒ'&WÆ’ÖÖF6‚"’°¢–b…TÅD”ÔDUôÔôDRæ7F—fR’7F'EVÇF–ÖFTvÖR‚“°¢VÇ6R7F'DÖF6„ÖöFR„çVÖ&W"‡7FFRç6WDÖF6‚çF&vWE6WG2’Â²¶VW6öÆô÷öæVçC¢G'VRÒ“°¢Ð¢VÇ6R–b†7F–öä–BÓÓÒ'V—BÖ6÷W'B"’6öæf—&Õ&WGW&åFôÆö&'’‚“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâÖö&–ÆU&W7VÇE7FFR‡Æ–W$–æFW‚’°¢–b‚7FFRævÖT÷fW"ÇÂ7FFRç&W7VÇD–æfò’&WGW&âçVÆÃ°¢6öç7Bv–ææW"Ò7FFRç&W7VÇD–æfòçv–ææW#°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb‡Æ–W$–æFW‚“°¢6öç7BÖF6…v–ææW"ÒçVÖ&W"æ—4–çFVvW"‡7FFRç6WDÖF6‚æÖF6…v–ææW"¢ò7FFRç6WDÖF6‚æÖF6…v–ææW ¢¢v–ææW#°¢6öç7B&W6VçFF–öåÆ–W"Ò†–æFW‚’Óâ°¢6öç7BÖF6…Æ–W"Ò7FFRçÆ–W'5¶–æFW…Ó°¢6öç7BvöâÒ–æFW‚ÓÓÒÖF6…v–ææW#°¢6öç7BÆö&'”'Gv÷&²Ò$ôd”ÄUô4„$5DU%ô”ÔtU5¶ÖF6…Æ–W#òæ6†&7FW$–EÐ¢ÇÂ4„$5DU%ô”ÔtU5¶ÖF6…Æ–W#òæ6†&7FW$–EÓòå³Ð¢ÇÂ4„$5DU%ô”ÔtU2æ6ö6…Væ¶æ÷vå³Ó°¢&WGW&â°¢æÖS¢F—7Æ•Æ–W$æÖR†ÖF6…Æ–W"’À¢Æö&'”'Gv÷&²À¢&W7VÇD'Gv÷&³¢ÔD4…õ$U5TÅEô”ÔtU5¶ÖF6…Æ–W#òæ6†&7FW$–EÓòå·vöâò'v–â"¢&Æ÷6R%Ð¢ÇÂÆö&'”'Gv÷&²À¢÷WF6öÖS¢vöâò%t”â"¢$Äõ4R"À¢6–FS¢–æFW‚ÓÓÒÆ–W$–æFW‚ò%Ä”U""¢$õôäTåB"À¢Ó°¢Ó°¢&WGW&â°¢v–ææW#¢v–ææW"ÓÓÒÆ–W$–æFW‚ò%Ä”U""¢$õôäTåB"À¢v–ææW$æÖS¢Æ–W$æÖR‡v–ææW"’À¢F—FÆS¢7FFRç6WDÖF6‚æÖF6„÷fW"ò$ÖF6‚FW&Ö–ì:’"¢7FFRç6WDÖF6‚ç6WD÷fW"ò%6WBFW&Ö–ì:’"¢,8–6†ævRFW&Ö–ì:’"À¢6öæF—F–öã¢&ÆÇ”VæE&V6öäÆ&VÂ‚’À¢&V6öã¢7FFRç&W7VÇD–æfòç&V6öâÇÂ""À¢66÷&S¢7W'&VçDÖF6…66÷&UFW‡B‚’À¢6WG5vöã¢7FFRç6WDÖF6‚æVæ&ÆV@¢ò´çVÖ&W"‡7FFRç6WDÖF6‚ç6WG5vöãòå·Æ–W$–æFW…ÒÇÂ’ÂçVÖ&W"‡7FFRç6WDÖF6‚ç6WG5vöãòå¶÷öæVçD–æFW…ÒÇÂ•Ð¢¢çVÆÂÀ¢ÖF6„÷fW#¢&ööÆVâ‡7FFRç6WDÖF6‚æÖF6„÷fW"’À¢6WG3¢Öö&–ÆU6WE66÷&U7FFR‡Æ–W$–æFW‚’æf–ÇFW"‚‡6WB’Óâ6WBçÆ–W"ÒçVÆÂbb6WBæ÷öæVçBÒçVÆÂ’À¢Æ–W'3¢·&W6VçFF–öåÆ–W"‡Æ–W$–æFW‚’Â&W6VçFF–öåÆ–W"†÷öæVçD–æFW‚•ÒÀ¢7F–öç3¢5T5DDõ%ôÔôDRæVæ&ÆVBòµÒ¢Öö&–ÆU&öw&W76–öä7F–öç2‚’À¢Ó°§Ð ¦gVæ7F–öâÖö&–ÆT6öææV7F–öå7FFR‡Æ–W$–æFW‚’°¢–b…5T5DDõ%ôÔôDRæVæ&ÆVB’°¢&WGW&â°¢¶–æC¢'7V7FF÷""À¢Æ&VÃ¢$ÖöFR7V7FFWW""À¢FWF–Ã¢Gµ5T5DDõ%ôÔôDRæÖF6„Æ&VÂÇÂ$ÖF6‚Vâ6÷W'2'Ò+rÆV7GW&R6WVÆVÀ¢7–æ6‡&öæ—¦VC¢G'VRÀ¢Ó°¢Ð¢–b‚4U%dU%õ5”ä2æVæ&ÆVB’&WGW&âçVÆÃ°¢&WGW&â°¢¶–æC¢&öæÆ–æR"À¢Æ&VÃ¢4U%dU%õ5”ä2æg&–VæFÇ”ÖF6‚ò$ÖF6‚‡VÖ–â"¢%'F–RVâÆ–væR"À¢FWF–Ã¢6ÆöâGµ4U%dU%õ5”ä2ç&ööÔ–BÇÂ"'Ò+r6œ:†vRG·Æ–W$–æFW‚²ÖÀ¢7–æ6‡&öæ—¦VC¢&ööÆVâ…4U%dU%õ5”ä2ç&VG’’À¢Ó°§Ð ¦gVæ7F–öâ6VÆV7DÖö&–ÆT6&B†6&EV–B’°¢6öç7BÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢6öç7B6&BÒ7FFRçÆ–W'5·Æ–W$–æFW…Óòæ†æBæf–æB‚†6æF–FFR’Óâ6æF–FFRçV–BÓÓÒ6&EV–B“°¢–b‚6&B’&WGW&â²ö³¢fÇ6RÂ&V6öã¢$6WGFR6'FRî(	–W7BÇW2Fç2f÷G&RÖ–ââ"Ó°¢6öç7BVæf–Æ&ÆU&V6öâÒÖö&–ÆT6&EVæf–Æ&ÆU&V6öâ‡Æ–W$–æFW‚Â6&B“°¢–b‡Væf–Æ&ÆU&V6öâ’&WGW&â²ö³¢fÇ6RÂ&V6öã¢Væf–Æ&ÆU&V6öâÓ°¢Öö&–ÆU6VÆV7FVD6&EV–BÒ6&BçV–C°¢–b‡7FFRçGWF÷&–Âæ7F—fRbbGWF÷&–ÄW‡V7FVD7F–öâ‚“òæ¶–æBÓÓÒ'6VÆV7D6&B"’°¢6VÆV7EGWF÷&–Ä6&B‡Æ–W$–æFW‚Â6&BçV–B“°¢Ð¢v–æF÷ræF—7F6„WfVçB†æWr7W7FöÔWfVçB‚'FVææ—2ÖÆ–v‡C¦ÖF6‚×&VæFW""’“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâ6æ6VÄÖö&–ÆT6&E6VÆV7F–öâ‚’°¢Öö&–ÆU6VÆV7FVD6&EV–BÒçVÆÃ°¢–b‡7FFRçGWF÷&–Âæ7F—fR’7FFRçGWF÷&–Âç6VÆV7FVD6&EV–BÒçVÆÃ°¢v–æF÷ræF—7F6„WfVçB†æWr7W7FöÔWfVçB‚'FVææ—2ÖÆ–v‡C¦ÖF6‚×&VæFW""’“°§Ð ¦gVæ7F–öâÖö&–ÆU&W6öÇWF–öåfÇVW2‡Æ–W$–æFW‚’°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb‡Æ–W$–æFW‚“°¢6öç7B6æ6†÷BÒ†–æFW‚’Óâ‡°¢÷vW#¢çVÖ&W"‡7FFRçÆ–W'5¶–æFW…Óòç÷vW"ÇÂ’À¢VæGW&æ6S¢çVÖ&W"‡7FFRçÆ–W'5¶–æFW…ÓòæVæGW&æ6RÇÂ’À¢†æD6÷VçC¢çVÖ&W"‡7FFRçÆ–W'5¶–æFW…Óòæ†æCòæÆVæwF‚ÇÂ’À¢Ò“°¢&WGW&â°¢Æ–W#¢6æ6†÷B‡Æ–W$–æFW‚’À¢÷öæVçC¢6æ6†÷B†÷öæVçD–æFW‚’À¢Ó°§Ð ¦gVæ7F–öâÖö&–ÆU&W6öÇWF–öäFVÇF2†&Vf÷&RÂgFW"’°¢6öç7BÆ&VÇ2Ò°¢÷vW#¢%V—76æ6R"À¢VæGW&æ6S¢$VæGW&æ6R"À¢†æD6÷VçC¢$6'FW2"À¢Ó°¢&WGW&â²'Æ–W""Â&÷öæVçB%ÒæfÆDÖ‚‡6–FR’Óâ€¢ö&¦V7Bæ¶W—2†Æ&VÇ2’æÖ‚†ÖWG&–2’Óâ°¢6öç7BFVÇFÒçVÖ&W"†gFW%·6–FUÕ¶ÖWG&–5ÒÇÂ’ÒçVÖ&W"†&Vf÷&U·6–FUÕ¶ÖWG&–5ÒÇÂ“°¢&WGW&âFVÇFò²6–FRÂÖWG&–2ÂÆ&VÃ¢Æ&VÇ5¶ÖWG&–5ÒÂFVÇFÂfÇVS¢gFW%·6–FUÕ¶ÖWG&–5ÒÒ¢çVÆÃ°¢Ò’æf–ÇFW"„&ööÆVâ¢’“°§Ð ¦gVæ7F–öâÖö&–ÆTæWu&W6öÇWF–öäÖW76vW2‡&Wf–÷W4f—'7DÆör’°¢6öç7BÖW76vW2ÒµÓ°¢f÷"†6öç7BÆ–æRöb7FFRæÆör’°¢–b†Æ–æRÓÓÒ&Wf–÷W4f—'7DÆör’'&V³°¢–b†Æ–æRbbÖW76vW2æ–æ6ÇVFW2†Æ–æR’’ÖW76vW2çW6‚†Æ–æR“°¢–b†ÖW76vW2æÆVæwF‚ãÒ2’'&V³°¢Ð¢–b‡7FFRæVffV7Dæ÷F–6SòæÖW76vRbbÖW76vW2æ–æ6ÇVFW2‡7FFRæVffV7Dæ÷F–6RæÖW76vR’’°¢ÖW76vW2çVç6†–gB‡7FFRæVffV7Dæ÷F–6RæÖW76vR“°¢Ð¢&WGW&âÖW76vW2ç6Æ–6RƒÂ2“°§Ð ¦gVæ7F–öâÖö&–ÆUÆ–VD6&E7VÖÖ'’†6&BÂÆ–W$–æFW‚’°¢–b‚6&B’&WGW&âçVÆÃ°¢6öç7BÆ6VÖVçBÒçVÖ&W"†6&BçGW&äVæEÆ6VÖVçBóò6&BçGW&åÆ6VÖVçBóò6&BçÆ6VÖVçBóò“°¢6öç7B6öç6WVVæ6U'G2ÒµÓ°¢–b†6&Bæ&ö÷7FVB’6öç6WVVæ6U'G2çW6‚‚$6'FR¦÷\:–RVâ&ö÷7B"“°¢–b†6&Bç&VÖ—6TÖöFRÓÓÒ&VffV7B"’6öç6WVVæ6U'G2çW6‚‚$VffWB¦÷\:’6ç2FW&Ö–æW"ÆRF÷W""“°¢–b†6&Bç&VÖ—6TÖöFRÓÓÒ'Æ6VÖVçB"’6öç6WVVæ6U'G2çW6‚‚%Æ6VÖVçB,:—,:’÷W"Æf–âGRF÷W""“°¢–b‡Æ6VÖVçB’6öç6WVVæ6U'G2çW6‚†G·Æ6VÖVçGÒÆ6VÖVçBRF÷FÆ“°¢–b†6&Bæç7vW&VD&ö÷7D6öç7G&–çB’6öç6WVVæ6U'G2çW6‚‚%,:—öç6R:Vâ&ö÷7B"“°¢6öç7B÷væW%Æ–W"Ò7FFRçÆ–W'5¶6&Bæ÷væW%Ó°¢6öç7B7F%÷vW"Ò6&Bç7F$VffV7DÆ&VÂò°¢–C¢G¶6&BçÆ–VEV–BÇÂ6&BçV–GÓ§7F&À¢æÖS¢6†&7FW$æÖTg&öÔ–B†÷væW%Æ–W#òæ6†&7FW$–B’À¢'Gv÷&³¢4„$5DU%ô”ÔtU5¶÷væW%Æ–W#òæ6†&7FW$–EÓòå¶÷væW%Æ–W#òæ6†&7FW%6–FRÓÓÒò¢Ð¢ÇÂ$ôd”ÄUô4„$5DU%ô”ÔtU5¶÷væW%Æ–W#òæ6†&7FW$–EÐ¢ÇÂ""À¢Æ&VÃ¢6&Bç7F$VffV7DÆ&VÂÀ¢÷væW#¢6&Bæ÷væW"ÓÓÒÆ–W$–æFW‚ò%Ä”U""¢$õôäTåB"À¢Ò¢çVÆÃ°¢&WGW&â°¢–C¢6&BçÆ–VEV–BÇÂ6&BçV–BÀ¢'Gv÷&³¢4$Eô”ÔtU5¶6&Bæ–EÒÇÂ4$Eô$4µô”ÔtRÀ¢æÖS¢6&BææÖRÀ¢÷væW#¢6&Bæ÷væW"ÓÓÒÆ–W$–æFW‚ò%Ä”U""¢$õôäTåB"À¢6÷7C¢çVÖ&W"†6&Bæ6÷7E–Bóò6&Bæ6÷7Bóò’À¢÷vW#¢çVÖ&W"†6&Bæ6&E÷vW$v–æVBóò6&Bç÷vW$v–æVBóò’À¢&V6—6–öã¢çVÖ&W"†6&Bç&V6—6–öâóò’À¢VffV7D6æ6VÆVD'”÷öæVçC¢6&BæVffV7DÆ–VBÓÓÒfÇ6RÀ¢VffV7C¢6&BæVffV7DÆ–VBÓÓÒfÇ6P¢ò$TddUBäåTÌ8’"Î(	”EdU%4•$R ¢¢6&BæVffV7BÇÂ$V7VâVffWB"À¢Æ6VÖVçBÀ¢6öç6WVVæ6S¢6öç6WVVæ6U'G2æ¦ö–â‚"+r"’À¢&ö÷7FVC¢&ööÆVâ†6&Bæ&ö÷7FVB’À¢7F%÷vW"À¢Ó°§Ð ¦gVæ7F–öâÖö&–ÆU75&ö¦V7F–öâ‡Æ–W$–æFW‚’°¢–b‡7FFRævÖT÷fW"ÇÂÆ–W$–æFW‚ÓÒ7FFRæ7F—fUÆ–W"ÇÂ6åW6U6VB‡Æ–W$–æFW‚’ÇÂ†5Æ–VEF†—5GW&â‡Æ–W$–æFW‚’’&WGW&âçVÆÃ°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb‡Æ–W$–æFW‚“°¢–b‡7FFRæÖæFF÷'•Æ6VÖVçB’°¢&WGW&â°¢v–ææW#¢$õôäTåB"À¢Æ&VÃ¢7FFRæÖæFF÷'•Æ6VÖVçE&V6öâÓÓÒ'6Ö6‚ ¢ò%76W"FöææRÎ(	œ:–6†ævR,:‡2ÆR6Ö6‚ ¢¢%76W"FöææRÎ(	œ:–6†ævR,:‡2ÆR&ö÷7B"À¢Ó°¢Ð¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B÷öæVçBÒ7FFRçÆ–W'5¶÷öæVçD–æFW…Ó°¢6öç7B74&öçW2ÒÖF‚æÖ‚ƒ"ÂçVÖ&W"‡Æ–W"æVæGW&æ6RÇÂ’“°¢6öç7B&÷6&öçW2Ò÷öæVçBæ6†&7FW$–BÓÓÒ'&÷6&VæfVçFR"òçVÖ&W"†÷öæVçBç&÷675÷vW$&öçW2ÇÂ’¢°¢6öç7BÆ–W%÷vW"ÒçVÖ&W"‡Æ–W"ç÷vW"ÇÂ’²&ö¦V7FVDVæD&öçW6W2‡Æ–W"“°¢6öç7B÷öæVçE÷vW"ÒçVÖ&W"†÷öæVçBç÷vW"ÇÂ’²74&öçW2²&÷6&öçW2²&ö¦V7FVDVæD&öçW6W2†÷öæVçB“°¢6öç7Bv–ææW"ÒÆ–W%÷vW"â÷öæVçE÷vW"òÆ–W$–æFW‚¢Æ–W%÷vW"Â÷öæVçE÷vW"ò÷öæVçD–æFW‚¢7FFRç6W'fW#°¢&WGW&â°¢v–ææW#¢v–ææW"ÓÓÒÆ–W$–æFW‚ò%Ä”U""¢$õôäTåB"À¢Æ&VÃ¢v–ææW"ÓÓÒÆ–W$–æFW€¢ò76W"+r:–6†ævRvvì:’G·Æ–W%÷vW'Þ(	2G¶÷öæVçE÷vW'Ö ¢¢76W"+r:–6†ævRW&GRG·Æ–W%÷vW'Þ(	2G¶÷öæVçE÷vW'ÖÀ¢Ó°§Ð ¦gVæ7F–öâÖö&–ÆT†—7F÷'”VçG&–W2‚’°¢&WGW&â7FFRæÆöræÖ‚†Æ–æRÂ–æFW‚’Óâ°¢6öç7Bæ÷&ÖÆ—¦VBÒ7G&–ær†Æ–æRÇÂ""’çFôÆö6ÆTÆ÷vW$66R‚&g""“°¢6öç7B7F$Ö&¶W"Ò7G&–ær†Æ–æRÇÂ""’æÖF6‚‚õÅµÅ·F2ÖVffV7BÒ†&ÇVWÇ&÷6R“¢‚â³ò•ÅÕÅÒö’“°¢6öç7B7F%Æ–VD6&BÒ7F$Ö&¶W ¢ò7FFRçÆ–W'2æfÆDÖ‚†6æF–FFR’Óâ6æF–FFSòçÆ–VBÇÂµÒ’æf–æDÆ7Còâ‚†6&B’Óâ6&Bç7F$VffV7DÆ&VÂÓÓÒ7F$Ö&¶W%³%Ò¢ÇÂ²ââç7FFRçÆ–W'2æfÆDÖ‚†6æF–FFR’Óâ6æF–FFSòçÆ–VBÇÂµÒ•Òç&WfW'6R‚’æf–æB‚†6&B’Óâ6&Bç7F$VffV7DÆ&VÂÓÓÒ7F$Ö&¶W%³%Ò¢¢çVÆÃ°¢6öç7B7F÷$–æFW‚Ò7FFRçÆ–W'2æf–æD–æFW‚‚‡Æ–W"’Óâ°¢6öç7BæÖW2Ò¶F—7Æ•Æ–W$æÖR‡Æ–W"’ÂÆ–W#òææÖRÂÆ–W#òææ–6¶æÖUÐ¢æf–ÇFW"„&ööÆVâ¢æÖ‚†æÖR’Óâ7G&–ær†æÖR’çFôÆö6ÆTÆ÷vW$66R‚&g""’“°¢&WGW&âæÖW2ç6öÖR‚†æÖR’Óâæ÷&ÖÆ—¦VBæ–æ6ÇVFW2†æÖR’“°¢Ò“°¢6öç7BÆö6ÅÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢6öç7B&W6öÇfVD7F÷$–æFW‚Ò7F%Æ–VD6&Còæ÷væW"óò7F÷$–æFWƒ°¢6öç7B6&BÒ4$EôÄ”%$%’æf–æB‚†—FVÒ’Óâæ÷&ÖÆ—¦VBæ–æ6ÇVFW2…7G&–ær†—FVÒææÖRÇÂ""’çFôÆö6ÆTÆ÷vW$66R‚&g""’’“°¢6öç7B—5Æ–VDÆ–æRÒõââ²¦÷VRâ²¢òçFW7B…7G&–ær†Æ–æRÇÂ""’“°¢6öç7BÆ–VD7F–öâÒ6&Bbb—5Æ–VDÆ–æP¢ò²âââ‡7FFRæ7F–öäÆörÇÂµÒ•Òç&WfW'6R‚’æf–æB‚†VçG'’’ÓâVçG'’æ¶–æBÓÓÒ'Æ•ö6&B"bbVçG'’æ6&Còæ–BÓÓÒ6&Bæ–B¢¢çVÆÃ°¢6öç7BÆ–VD6&BÒ6&Bbb—5Æ–VDÆ–æP¢ò7FFRçÆ–W'2æfÆDÖ‚‡Æ–W"’ÓâÆ–W"çÆ–VBÇÂµÒ’ç&WfW'6R‚’æf–æB‚†VçG'’’ÓâVçG'’æ–BÓÓÒ6&Bæ–B¢¢çVÆÃ°¢6öç7B7GVÄ6÷7BÒçVÖ&W"‡Æ–VD7F–öãòæ6÷7E–BóòÆ–VD6&Còæ6÷7E–Bóò“°¢6öç7B7GVÅ÷vW"ÒçVÖ&W"‡Æ–VD7F–öãòç÷vW$v–æVBóòÆ–VD6&Còç÷vW$v–æVBóò“°¢6öç7Bf&–F–öåG—W2Ò°¢öVæGW&æ6RòçFW7B†æ÷&ÖÆ—¦VB’ÇÂ7GVÄ6÷7Bò$VæGW&æ6R"¢çVÆÂÀ¢÷V—76æ6RòçFW7B†æ÷&ÖÆ—¦VB’ÇÂ7GVÅ÷vW"ò%V—76æ6R"¢çVÆÂÀ¢ö&öçW7Æ&ö÷7BòçFW7B†æ÷&ÖÆ—¦VB’ò$&öçW2"¢çVÆÂÀ¢öVffWBòçFW7B†æ÷&ÖÆ—¦VB’ò$VffWB"¢çVÆÂÀ¢Òæf–ÇFW"„&ööÆVâ“°¢6öç7Bf&–F–öç2Ò°¢7GVÄ6÷7BòÒG¶7GVÄ6÷7GÒVæGW&æ6V¢çVÆÂÀ¢7GVÅ÷vW"ò²G¶7GVÅ÷vW'ÒV—76æ6V¢çVÆÂÀ¢Òæf–ÇFW"„&ööÆVâ“°¢&WGW&â°¢–C¢G·7FFRæ7F–öäÆösòæÆVæwF‚ÇÂÓ¢G¶–æFW‡Ó¢G¶Æ–æWÖÀ¢G—S¢7F–öäÆötVçG'•G—R†Æ–æR’À¢Æ&VÃ¢7F$Ö&¶W"ò%÷Wfö—":—Fö–ÆR"¢7F–öäÆötVçG'”Æ&VÂ†7F–öäÆötVçG'•G—R†Æ–æR’’À¢ÖW76vS¢7F$Ö&¶W"ò7F$Ö&¶W%³%ÒçG&–Ò‚’¢7G&–ær†Æ–æRÇÂ""’À¢Æ–W$æÖS¢&W6öÇfVD7F÷$–æFW‚ãÒòF—7Æ•Æ–W$æÖR‡7FFRçÆ–W'5·&W6öÇfVD7F÷$–æFW…Ò’¢""À¢Æ–W%6–FS¢&W6öÇfVD7F÷$–æFW‚Âò&–æf÷&ÖF–öâ"¢&W6öÇfVD7F÷$–æFW‚ÓÓÒÆö6ÅÆ–W$–æFW‚ò'Æ–W""¢&÷öæVçB"À¢f&–F–öåG—W3¢7F$Ö&¶W"ò²$VffWB%Ò¢f&–F–öåG—W2À¢f&–F–öç2À¢6&C¢7F$Ö&¶W"ò°¢–C¢G·7F%Æ–VD6&CòçÆ–VEV–BÇÂ–æFW‡Ó§7F&À¢æÖS¢6†&7FW$æÖTg&öÔ–B‡7FFRçÆ–W'5·&W6öÇfVD7F÷$–æFW…Óòæ6†&7FW$–B’À¢'Gv÷&³¢4„$5DU%ô”ÔtU5·7FFRçÆ–W'5·&W6öÇfVD7F÷$–æFW…Óòæ6†&7FW$–EÓòå·7F$Ö&¶W%³ÒçFôÆ÷vW$66R‚’ÓÓÒ'&÷6R"ò¢Ð¢ÇÂ$ôd”ÄUô4„$5DU%ô”ÔtU5·7FFRçÆ–W'5·&W6öÇfVD7F÷$–æFW…Óòæ6†&7FW$–EÐ¢ÇÂ""À¢6÷7C¢À¢÷vW#¢À¢&V6—6–öã¢À¢Æ6VÖVçC¢À¢VffV7C¢7F$Ö&¶W%³%ÒÀ¢Ò¢6&Bò°¢–C¢6&Bæ–BÀ¢æÖS¢6&BææÖRÀ¢'Gv÷&³¢4$Eô”ÔtU5¶6&Bæ–EÒÇÂ4$Eô$4µô”ÔtRÀ¢6÷7C¢çVÖ&W"†6&Bæ6÷7BÇÂ’À¢÷vW#¢çVÖ&W"†6&Bç÷vW"ÇÂ’À¢&V6—6–öã¢çVÖ&W"†6&Bç&V6—6–öâÇÂ’À¢Æ6VÖVçC¢çVÖ&W"†6&BçÆ6VÖVçBÇÂ’À¢VffV7C¢6&BæVffV7BÇÂ$V7VâVffWB"À¢Ò¢çVÆÂÀ¢Ó°¢Ò“°§Ð ¦gVæ7F–öâÖö&–ÆU&WGW&åFôÖVçT–æfò‚’°¢–b„e$”TäDÅ•õDõU$äÔTåBæVæ&ÆVB’°¢&WGW&â°¢F—FÆS¢%&WF÷W&æW"R6ÇV"†÷W6Rò"À¢6öç6WVVæ6S¢$Æ&Væ6öçG&R6W&V—GL:–RâVæR'F–R7F—fRWWB:§G&RÖ—6RVâW6R÷R6ö×FW"6öÖÖRf÷&f—B6’VÆÆRî(	–W7B2&W&—6R:FV×2â"À¢Ó°¢Ð¢–b…4U%dU%õ5”ä2æVæ&ÆVB’°¢&WGW&â°¢F—FÆS¢%V—GFW"Æ'F–RVâÆ–væRò"À¢6öç6WVVæ6S¢%f÷W2V—GFW&W¢ÆR6ÆöâVâÆ–væRWBÆ'F–RVâ6÷W'2æR&W7FW&2÷WfW'FR7W"6WB&V–Ââ"À¢Ó°¢Ð¢&WGW&â°¢F—FÆS¢%&WF÷W&æW":Î(	–67VV–Âò"À¢6öç6WVVæ6S¢$Æ'F–RVâ6÷W'26W&V—GL:–RWBÎ(	–67VV–Â6W&ff–6Œ:’â"À¢Ó°§Ð ¦gVæ7F–öâ6öæf—&ÔÖö&–ÆU&WGW&åFôÖVçR‚’°¢6öæf—&Õ&WGW&åFôÆö&'’‚“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâ6¶æ÷vÆVFvTÖö&–ÆT÷öæVçD6&B†6&D–B’°¢–b‚6&D–B’&WGW&â²ö³¢fÇ6RÓ°¢v–æF÷ræF—7F6„WfVçB†æWr7W7FöÔWfVçB‚'FVææ—2ÖÆ–v‡C¦ÖF6‚×&VæFW""’“°¢&WGW&â°¢ö³¢G'VRÀ¢6&D–BÀ¢7W'&VçD6&D–C¢7FFRæÆFW7EÆ–VD6&CòçÆ–VEV–BÇÂ7FFRæÆFW7EÆ–VD6&CòçV–BÇÂçVÆÂÀ¢7–æ6‡&öæ—¦VE&Wf—6–öã¢çVÖ&W"…4U%dU%õ5”ä2ç&Wf—6–öâÇÂ’À¢Ó°§Ð ¦gVæ7F–öâÆ•6VÆV7FVDÖö&–ÆT6&B†–çFVçBÒ·Ò’°¢–b†Öö&–ÆUÆ•7V&Ö—76–öäÆö6¶VBÇÂÖö&–ÆU6VÆV7FVD6&EV–B’&WGW&âfÇ6S°¢6öç7BÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢6öç7B6&BÒ7FFRçÆ–W'5·Æ–W$–æFW…Óòæ†æBæf–æB‚†6æF–FFR’Óâ6æF–FFRçV–BÓÓÒÖö&–ÆU6VÆV7FVD6&EV–B“°¢–b‚6&BÇÂÖö&–ÆT6&EVæf–Æ&ÆU&V6öâ‡Æ–W$–æFW‚Â6&B’’&WGW&âfÇ6S°¢6öç7Bf–Æ&ÆT÷F–öâÒÖö&–ÆT6&EÆ”÷F–öç2‡Æ–W$–æFW‚Â6&B¢æf–æB‚†÷F–öâ’Óâ÷F–öâæÖöFRÓÓÒ–çFVçBæÖöFR“°¢–b‚f–Æ&ÆT÷F–öâ’&WGW&â²ö³¢fÇ6RÂ&V6öã¢$6RÖöFRFR¦WRî(	–W7B2F—7öæ–&ÆRâ"Ó°¢6öç7B&ö÷7FVBÒf–Æ&ÆT÷F–öâæÖöFRÓÓÒ&&ö÷7B#°¢6öç7B67&–f–6UV–BÒ&ö÷7FVBò–çFVçBç67&–f–6UV–B¢çVÆÃ°¢–b†&ö÷7FVBbbf–Æ&ÆT÷F–öâç67&–f–6W2ç6öÖR‚†6æF–FFR’Óâ6æF–FFRæ–BÓÓÒ67&–f–6UV–B’’°¢&WGW&â²ö³¢fÇ6RÂ&V6öã¢$6†ö—6—76W¢VæR6'FR:67&–f–W"÷W"ÆR&ö÷7Bâ"Ó°¢Ð¢6öç7BÖöFRÒf–Æ&ÆT÷F–öâæÖöFRÓÓÒ'Æ6VÖVçB"ò'Æ6VÖVçB"¢f–Æ&ÆT÷F–öâæÖöFRÓÓÒ&VffV7B"ò&VffV7B"¢&æ÷&ÖÂ#°¢–b‚GWF÷&–ÄÆÆ÷w5Æ’‡Æ–W$–æFW‚Â6&BÂÖöFRÂ&ö÷7FVB’’&WGW&âfÇ6S°¢6öç7B&Vf÷&RÒÖö&–ÆU&W6öÇWF–öåfÇVW2‡Æ–W$–æFW‚“°¢6öç7B&Wf–÷W4f—'7DÆörÒ7FFRæÆöu³ÒÇÂçVÆÃ°¢6öç7B7V&Ö—GFVD6&BÒ°¢–C¢6&BçV–BÀ¢'Gv÷&³¢4$Eô”ÔtU5¶6&Bæ–EÒÇÂ4$Eô$4µô”ÔtRÀ¢æÖS¢6&BææÖRÀ¢Ó°¢Öö&–ÆUÆ•7V&Ö—76–öäÆö6¶VBÒG'VS°¢Öö&–ÆU6VÆV7FVD6&EV–BÒçVÆÃ°¢G'’°¢Æ”6&B‡Æ–W$–æFW‚Â6&BçV–BÂ&ö÷7FVBÂ67&–f–6UV–BÂÖöFR“°¢6ö×ÆWFUGWF÷&–Ä7F–öâ‡²¶–æC¢'Æ’"ÂÆ–W$–æFW‚Â6&D–C¢6&Bæ–BÂÖöFRÒ“°¢6öç7B&W6öÇfVD6&BÒ7FFRæÆFW7EÆ–VD6&Còæ÷væW"ÓÓÒÆ–W$–æFW€¢ò7FFRæÆFW7EÆ–VD6&@¢¢7FFRçÆ–W'5·Æ–W$–æFW…ÓòçÆ–VCòæf–æB‚†6æF–FFR’Óâ6æF–FFRçV–BÓÓÒ6&BçV–B“°¢6öç7BgFW"ÒÖö&–ÆU&W6öÇWF–öåfÇVW2‡Æ–W$–æFW‚“°¢&WGW&â°¢ö³¢G'VRÀ¢&W6öÇWF–öä–C¢&W6öÇfVD6&CòçÆ–VEV–BÇÂG¶6&BçV–GÓ¢G·7FFRæ7F–öäÆösòæÆVæwF‚ÇÂÖÀ¢6&C¢°¢ââç7V&Ö—GFVD6&BÀ¢–C¢&W6öÇfVD6&CòçÆ–VEV–BÇÂ7V&Ö—GFVD6&Bæ–BÀ¢÷vW#¢çVÖ&W"‡&W6öÇfVD6&Còæ6&E÷vW$v–æVBóò&W6öÇfVD6&Còç÷vW$v–æVBóò’À¢VffV7C¢&W6öÇfVD6&CòæVffV7DÆ–VBÓÓÒfÇ6P¢ò$TddUBäåTÌ8’"Î(	”EdU%4•$R ¢¢&W6öÇfVD6&CòæVffV7BÇÂ6&BæVffV7BÇÂ""À¢VffV7D6æ6VÆVD'”÷öæVçC¢&W6öÇfVD6&CòæVffV7DÆ–VBÓÓÒfÇ6RÀ¢7F%÷vW#¢Öö&–ÆUÆ–VD6&E7VÖÖ'’‡&W6öÇfVD6&BÂÆ–W$–æFW‚“òç7F%÷vW"ÇÂçVÆÂÀ¢ÒÀ¢FVÇF3¢Öö&–ÆU&W6öÇWF–öäFVÇF2†&Vf÷&RÂgFW"’À¢ÖW76vW3¢Öö&–ÆTæWu&W6öÇWF–öäÖW76vW2‡&Wf–÷W4f—'7DÆör’À¢&Vf÷&RÀ¢gFW"À¢7–æ6‡&öæ—¦VE&Wf—6–öã¢çVÖ&W"…4U%dU%õ5”ä2ç&Wf—6–öâÇÂ’À¢Ó°¢Òf–æÆÇ’°¢Öö&–ÆUÆ•7V&Ö—76–öäÆö6¶VBÒfÇ6S°¢Ð§Ð ¦gVæ7F–öâ74Öö&–ÆUGW&â‚’°¢6öç7BÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢–b‡7FFRævÖT÷fW"ÇÂÆ–W$–æFW‚ÓÒ7FFRæ7F—fUÆ–W"ÇÂ6åW6U6VB‡Æ–W$–æFW‚’’&WGW&â²ö³¢fÇ6RÓ°¢–b‚GWF÷&–ÄÆÆ÷w572‚’’&WGW&â²ö³¢fÇ6RÂ&V6öã¢$ÆRGWF÷&–VÂFVÖæFRVæRWG&R7F–öââ"Ó°¢72‡Æ–W$–æFW‚“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâVæDÖö&–ÆUGW&â‚’°¢6öç7BÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢–b‚6äVæEGW&â‡Æ–W$–æFW‚’’&WGW&â²ö³¢fÇ6RÓ°¢VæEGW&â‡Æ–W$–æFW‚“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâVæFôÖö&–ÆUGW&â‚’°¢6öç7BÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢–b‚6åVæFõGW&â‡Æ–W$–æFW‚’’&WGW&â²ö³¢fÇ6RÓ°¢&W7F÷&UGW&å6æ6†÷B‚“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâ6WDÖö&–ÆT76—7Fæ6R†÷F–öç2Ò·Ò’°¢–b‡G—Vöb÷F–öç2ç7F÷÷öæVçD6&BÓÓÒ&&ööÆVâ"’°¢tÔUÄ•ô54•5Bç7F÷÷öæVçD6&BÒ÷F–öç2ç7F÷÷öæVçD6&C°¢Æö6Å7F÷&vRç6WD—FVÒ‚'FVææ—4Æ–v‡DÖö&–ÆU7F÷÷öæVçD6&B"Â7G&–ær†÷F–öç2ç7F÷÷öæVçD6&B’“°¢Ð¢v–æF÷ræF—7F6„WfVçB†æWr7W7FöÔWfVçB‚'FVææ—2ÖÆ–v‡C¦ÖF6‚×&VæFW""’“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâÖö&–ÆTFÖ–åFööÇ57FFR‚’°¢–b‚6ä66W74FÖ–äfVGW&W2‚’ÇÂ5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&âçVÆÃ°¢&WGW&â°¢6–×VÆFU66÷&S¢°¢f–Æ&ÆS¢6äFÖ–å6–×VÆFTÖF6…66÷&R‚’À¢Æ&VÃ¢%6–×VÆW"ÆR66÷&R"À¢ÒÀ¢W‡÷'DÆöw3¢°¢f–Æ&ÆS¢G'VRÀ¢Æ&VÃ¢$W‡÷'FW"ÆW2Æöw2"À¢ÒÀ¢W‡÷'EVÇF–ÖFTÆöw3¢°¢f–Æ&ÆS¢G'VRÀ¢Æ&VÃ¢$W‡÷'FW"ÆW2Æöw2D5R"À¢ÒÀ¢vÖUf–Ws¢FÖ–ävÖUf–Wu&VfW&Væ6R‚’À¢W‡÷'D‡VÖäÖF6†W3¢°¢f–Æ&ÆS¢G'VRÀ¢Æ&VÃ¢$W‡÷'FW"ÆW2'F–W2‡VÖ–æW2"À¢ÒÀ¢&WfVÄ”†æC¢°¢f—6–&ÆS¢&ööÆVâ…4ôÄõô’æVæ&ÆVBbb7FFRævÖT÷fW"’À¢f–Æ&ÆS¢&ööÆVâ…4ôÄõô’æVæ&ÆVBbb7FFRævÖT÷fW"’À¢7F—fS¢&ööÆVâ‡7FFRç&WfVÄ”6&G2’À¢Æ&VÃ¢7FFRç&WfVÄ”6&G2ò$Ö–â,:—l:–Ì:–R"¢%,:—l:–ÆW"ÆÖ–â"À¢ÒÀ¢Ó°§Ð ¦gVæ7F–öâ'VäÖö&–ÆTFÖ–åFööÂ†7F–öä–B’°¢–b‚6ä66W74FÖ–äfVGW&W2‚’ÇÂ5T5DDõ%ôÔôDRæVæ&ÆVB’&WGW&â²ö³¢fÇ6RÓ°¢–b†7F–öä–BÓÓÒ'6–×VÆFR×66÷&R"’°¢–b‚6äFÖ–å6–×VÆFTÖF6…66÷&R‚’’&WGW&â²ö³¢fÇ6RÓ°¢6–×VÆFTFÖ–äÖF6…66÷&R‚“°¢ÒVÇ6R–b†7F–öä–BÓÓÒ&W‡÷'BÖÆöw2"ÇÂ7F–öä–BÓÓÒ&W‡÷'B×F7RÖÆöw2"’°¢W‡÷'DÆöw4f–ÆR‚“°¢ÒVÇ6R–b†7F–öä–BÓÓÒ&W‡÷'BÖ‡VÖâÖÖF6†W2"’°¢W‡÷'D‡VÖäÖF6„Æöw4f–ÆR‚“°¢ÒVÇ6R–b†7F–öä–BÓÓÒ'&WfVÂÖ’Ö†æB"’°¢–b‚4ôÄõô’æVæ&ÆVBÇÂ7FFRævÖT÷fW"’&WGW&â²ö³¢fÇ6RÓ°¢FövvÆU&WfVÄ”6&G2‚“°¢ÒVÇ6R°¢&WGW&â²ö³¢fÇ6RÓ°¢Ð¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâ6WDÖö&–ÆTFÖ–ävÖUf–Wr‡&VfW&Væ6R’°¢–b‚6ä66W74FÖ–äfVGW&W2‚’ÇÂ²&Öö&–ÆR"Â&FW6·F÷%Òæ–æ6ÇVFW2‡&VfW&Væ6R’’&WGW&â²ö³¢fÇ6RÓ°¢Æö6Å7F÷&vRç6WD—FVÒ„DÔ”åôtÔUõd”Uuô´U’Â&VfW&Væ6R“°¢Æö6Å7F÷&vRç&VÖ÷fT—FVÒ„DÔ”åôDU4µDõõd”Uuô´U’“°¢7–æ4FÖ–äFW6·F÷f–Wu&VfW&Væ6R‡²Ç•f–Ws¢G'VRÒ“°¢&WGW&â²ö³¢G'VRÓ°§Ð ¦gVæ7F–öâvWDÖö&–ÆTÖF6…f–Wu7FFR‚’°¢6öç7BÆ–W$–æFW‚ÒÖö&–ÆTÆö6ÅÆ–W$–æFW‚‚“°¢6öç7B÷öæVçD–æFW‚Ò÷öæVçDöb‡Æ–W$–æFW‚“°¢6öç7BÆ–W"Ò7FFRçÆ–W'5·Æ–W$–æFW…Ó°¢6öç7B÷öæVçBÒ7FFRçÆ–W'5¶÷öæVçD–æFW…Ó°¢6öç7B7F—fT6&BÒ7FFRæÆFW7EÆ–VD6&C°¢6öç7B7F—fT6&E7VÖÖ'’ÒÖö&–ÆUÆ–VD6&E7VÖÖ'’†7F—fT6&BÂÆ–W$–æFW‚“°¢6öç7BÆ7EÆ–VD6&E7VÖÖ'’Ò7F—fT6&E7VÖÖ'’ò²ââæ7F—fT6&E7VÖÖ'’Â7F%÷vW#¢VæFVf–æVBÒ¢çVÆÃ°¢ÆWB6VÆV7FVD6&BÒÆ–W#òæ†æCòæf–æB‚†6&B’Óâ6&BçV–BÓÓÒÖö&–ÆU6VÆV7FVD6&EV–B’ÇÂçVÆÃ°¢–b‡6VÆV7FVD6&BbbÖö&–ÆT6&EVæf–Æ&ÆU&V6öâ‡Æ–W$–æFW‚Â6VÆV7FVD6&B’’6VÆV7FVD6&BÒçVÆÃ°¢–b‚6VÆV7FVD6&B’Öö&–ÆU6VÆV7FVD6&EV–BÒçVÆÃ°¢&WGW&â°¢†6S¢5T5DDõ%ôÔôDRæVæ&ÆV@¢ò7FFRævÖT÷fW"ò%5T5DDõ%ô4ôÕÄUDR"¢%5T5DDõ" ¢¢7FFRævÖT÷fW ¢ò$ÔD4…ô4ôÕÄUDR ¢¢6VÆV7FVD6&Bò$4$Eõ4TÄT5DTB ¢¢7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW‚ò%Ä”U%õEU$â"¢$õôäTåEô4$Eõ$UdTÂ"À¢66÷&S¢°¢6WG3¢Öö&–ÆU6WE66÷&U7FFR‡Æ–W$–æFW‚’À¢6W'fW#¢7FFRç6W'fW"ÓÓÒÆ–W$–æFW‚ò%Ä”U""¢$õôäTåB"À¢ÒÀ¢Æ–W#¢Öö&–ÆUÆ–W%7VÖÖ'’‡Æ–W$–æFW‚’À¢÷öæVçC¢Öö&–ÆUÆ–W%7VÖÖ'’†÷öæVçD–æFW‚’À¢6öæg&öçFF–öã¢°¢Æ–W%÷vW#¢çVÖ&W"‡Æ–W#òç÷vW"ÇÂ’À¢÷öæVçE÷vW#¢çVÖ&W"‡7FFRçÆ–W'5¶÷öæVçD–æFW…Óòç÷vW"ÇÂ’À¢6öçFW‡DÖW76vS¢7FFRævÖT÷fW ¢ò8–6†ævR&V×÷'L:’"G·Æ–W$æÖR‡7FFRç&W7VÇD–æfóòçv–ææW"—Ö ¢¢G¶F—7Æ•Æ–W$æÖR†7F—fUÆ–W"‚’—ÒFö—B¦÷VW&À¢v–ææW#¢7FFRævÖT÷fW"bbçVÖ&W"æ—4–çFVvW"‡7FFRç&W7VÇD–æfóòçv–ææW"¢ò7FFRç&W7VÇD–æfòçv–ææW"ÓÓÒÆ–W$–æFW‚ò%Ä”U""¢$õôäTåB ¢¢çVÆÂÀ¢ÒÀ¢†æC¢…5T5DDõ%ôÔôDRæVæ&ÆVBòµÒ¢Æ–W#òæ†æBÇÂµÒ’æÖ‚†6&B’Óâ°¢6öç7BVæf–Æ&ÆU&V6öâÒÖö&–ÆT6&EVæf–Æ&ÆU&V6öâ‡Æ–W$–æFW‚Â6&B“°¢&WGW&â°¢–C¢6&BçV–BÀ¢'Gv÷&³¢4$Eô”ÔtU5¶6&Bæ–EÒÇÂ4$Eô$4µô”ÔtRÀ¢æÖS¢6&BææÖRÀ¢Æ–&ÆS¢Væf–Æ&ÆU&V6öâÀ¢Væf–Æ&ÆU&V6öâÀ¢&V6öÖÖVæFVEÆ6VÖVçC¢fÇ6RÀ¢&WV—&VEÆ6VÖVçC¢&ööÆVâ‡7FFRæÖæFF÷'•Æ6VÖVçBbb7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW‚’À¢Ó°¢Ò’À¢6VÆV7FVD6&D–C¢6VÆV7FVD6&CòçV–BÇÂçVÆÂÀ¢6VÆV7FVD6&E&Wf–Ws¢6VÆV7FVD6&BòÖö&–ÆT6&E&Wf–Wr‡Æ–W$–æFW‚Â6VÆV7FVD6&B’¢çVÆÂÀ¢Æ•7V&Ö—76–öäÆö6¶VC¢Öö&–ÆUÆ•7V&Ö—76–öäÆö6¶VBÀ¢GW&ä7F–öç3¢°¢6å73¢5T5DDõ%ôÔôDRæVæ&ÆVBbb7FFRævÖT÷fW ¢bb7FFRæ7F—fUÆ–W"ÓÓÒÆ–W$–æFW€¢bb6åW6U6VB‡Æ–W$–æFW‚¢bbGWF÷&–ÄÆÆ÷w572‚¢bb‚†5Æ–VEF†—5GW&â‡Æ–W$–æFW‚’ÇÂ6å74gFW$—'&WfW'6–&ÆTG&t–×76R‡Æ–W$–æFW‚’’À¢6äVæEGW&ã¢5T5DDõ%ôÔôDRæVæ&ÆVBbb6äVæEGW&â‡Æ–W$–æFW‚’À¢VæEGW&ä&ö÷7E&—6³¢&ööÆVâ€¢7FFRæÆ7D6&@¢bbçVÖ&W"‡7FFRçGW&åÆ6VÖVçE·Æ–W$–æFW…ÒÇÂ’Â&WV—&VEÆ6VÖVçDf÷$Æ7D6&B‚¢bb7FFRçGW&ä–væ÷&W5Æ6VÖVçE·Æ–W$–æFW…Ð¢bb7FFRçGW&ä6ææ÷D÷Vä&ö÷7E·Æ–W$–æFW…Ð¢’À¢†–FTVæEGW&ã¢7FFRçGW&äF—'G¢ÇÂ&ööÆVâ‡7FFRæÖæFF÷'•Æ6VÖVçBbb6äVæEGW&â‡Æ–W$–æFW‚’’À¢6åVæFó¢5T5DDõ%ôÔôDRæVæ&ÆVBbb6åVæFõGW&â‡Æ–W$–æFW‚’À¢74æVVG46öæf—&ÖF–öã¢Æ–W#òæ†æCòç6öÖR‚†6&B’ÓâÖö&–ÆT6&EÆ”÷F–öç2‡Æ–W$–æFW‚Â6&B’æÆVæwF‚â’ÇÂfÇ6RÀ¢75&ö¦V7F–öã¢Öö&–ÆU75&ö¦V7F–öâ‡Æ–W$–æFW‚’À¢ÒÀ¢7V7FF÷#¢5T5DDõ%ôÔôDRæVæ&ÆVBÀ¢ÖöFT6öçFW‡C¢Öö&–ÆTÖöFT6öçFW‡B‚’À¢GWF÷&–Ã¢Öö&–ÆUGWF÷&–Å7FFR‚’À¢&W7VÇC¢Öö&–ÆU&W7VÇE7FFR‡Æ–W$–æFW‚’À¢6öææV7F–öã¢Öö&–ÆT6öææV7F–öå7FFR‡Æ–W$–æFW‚’À¢7F—fT6&C¢7F—fT6&E7VÖÖ'’ò°¢ââæ7F—fT6&E7VÖÖ'’À¢&W6öÇWF–öäÖW76vS¢7FFRæVffV7Dæ÷F–6SòæÖW76vRÇÂ""À¢7–æ6‡&öæ—¦VE&Wf—6–öã¢çVÖ&W"…4U%dU%õ5”ä2ç&Wf—6–öâÇÂ’À¢Ò¢çVÆÂÀ¢&öçW6W3¢7F—fTVffV7D&FvW2‡Æ–W$–æFW‚’À¢÷öæVçD&öçW6W3¢7F—fTVffV7D&FvW2†÷öæVçD–æFW‚’À¢Æ–W%7F$6&C¢Öö&–ÆT6†&7FW%7F$6&B‡Æ–W"’À¢÷öæVçE7F$6&C¢Öö&–ÆT6†&7FW%7F$6&B†÷öæVçB’À¢76—7Fæ6S¢°¢7F÷÷öæVçD6&C¢tÔUÄ•ô54•5Bç7F÷÷öæVçD6&BÀ¢ÒÀ¢6f–æs¢°¢f–Æ&ÆS¢&ööÆVâ‡7FFRçF÷W&æÖVçCòçvVV¶Ç’’bb4U%dU%õ5”ä2æVæ&ÆVBbbe$”TäDÅ•õDõU$äÔTåBæVæ&ÆVBbb5T5DDõ%ôÔôDRæVæ&ÆVBÀ¢6ö×ÆWFVC¢Æö6ÄÖF6„—46ö×ÆWFVB‚’À¢ÒÀ¢FÖ–åFööÇ3¢Öö&–ÆTFÖ–åFööÇ57FFR‚’À¢†—7F÷'“¢Öö&–ÆT†—7F÷'”VçG&–W2‚’À¢&WGW&åFôÖVçS¢Öö&–ÆU&WGW&åFôÖVçT–æfò‚’À¢Æ7EÆ–VD6&C¢Æ7EÆ–VD6&E7VÖÖ'’À¢Ó°§Ð §v–æF÷rçFVææ—4Æ–v‡DÖö&–ÆTFFW"Ò°¢vWEf–Wu7FFS¢vWDÖö&–ÆTÖF6…f–Wu7FFRÀ¢6VÆV7D6&C¢6VÆV7DÖö&–ÆT6&BÀ¢6æ6VÄ6&E6VÆV7F–öã¢6æ6VÄÖö&–ÆT6&E6VÆV7F–öâÀ¢Æ•6VÆV7FVD6&C¢Æ•6VÆV7FVDÖö&–ÆT6&BÀ¢75GW&ã¢74Öö&–ÆUGW&âÀ¢VæEGW&ã¢VæDÖö&–ÆUGW&âÀ¢VæFõGW&ã¢VæFôÖö&–ÆUGW&âÀ¢6WD76—7Fæ6S¢6WDÖö&–ÆT76—7Fæ6RÀ¢6¶æ÷vÆVFvT÷öæVçD6&C¢6¶æ÷vÆVFvTÖö&–ÆT÷öæVçD6&BÀ¢6öæf—&Õ&WGW&åFôÖVçS¢6öæf—&ÔÖö&–ÆU&WGW&åFôÖVçRÀ¢6öçF–çVUGWF÷&–Ã¢6öçF–çVTÖö&–ÆUGWF÷&–ÂÀ¢'Vå&öw&W76–öä7F–öã¢'VäÖö&–ÆU&öw&W76–öä7F–öâÀ¢'VäFÖ–åFööÃ¢'VäÖö&–ÆTFÖ–åFööÂÀ¢6WDFÖ–ävÖUf–Ws¢6WDÖö&–ÆTFÖ–ävÖUf–WrÀ¢6fTÖF6ƒ¢ÖçVÆÇ•6fTÖF6‚À¢÷Väf÷&fV—DF–Æös¢÷VäöæÆ–æTf÷&fV—DF–ÆörÀ§Ó° §v–æF÷ræf÷&6U6öÆô•GW&âÒf÷&6U6öÆô•GW&ã°§v–æF÷rçFVææ—4Æ–v‡DFV'VrÒ²4$EôÄ”%$%’ÂæWtvÖRÂ7F'EGWF÷&–ÂÂ7F'E6öÆôvÖRÂ7F'E6WD”vÖRÂ7F'DÖF6„ÖöFRÂ7F'EF÷W&æÖVçDÖöFRÂæW‡E6WDW†6†ævRÂæW‡DgVÆÅ6WBÂ7F'DöæÆ–æTvÖRÂ72ÂÆ”6&BÂVæEGW&âÂ&W7F÷&UGW&å6æ6†÷BÂvWE7F÷&VDÖF6„Æöw2ÂvWE7F÷&VD7F–öäÆöw2ÂvWE7F÷&VD‡VÖäÖF6„Æöw2ÂW‡÷'DÆöw4f–ÆRÂW‡÷'D‡VÖäÖF6„Æöw4f–ÆRÂ&VæFW"Â7FFRÓ°§v–æF÷ræFDWfVçDÆ—7FVæW"‚'vV†–FR"Â6–væÄg&–VæFÇ•F÷W&æÖVçEvTW†—B“°§v–æF÷ræFDWfVçDÆ—7FVæW"‚'vV†–FR"Â‚’Óâ°¢–b††47F—fTÖF6…Fõ&÷FV7B‚’’6fTÆö6ÄÖö&–ÆTÖF6…6W76–öâ‚“°§Ò“°¦Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚'f—6–&–Æ—G–6†ævR"Â‚’Óâ°¢–b†Fö7VÖVçBçf—6–&–Æ—G•7FFRÓÓÒ&†–FFVâ"bb†47F—fTÖF6…Fõ&÷FV7B‚’’°¢6fTÆö6ÄÖö&–ÆTÖF6…6W76–öâ‚“°¢Ð§Ò“°§v–æF÷ræFDWfVçDÆ—7FVæW"‚'vW6†÷r"Â†WfVçB’Óâ°¢–b†WfVçBçW'6—7FVB’&W7F÷&Tg&–VæFÇ•F÷W&æÖVçE&W6Væ6R‚“°§Ò“°¦–æ—DÖVçR‚“°§G'’°¢æWtvÖR‚“°¢&W7F÷&TÆö6ÅGWF÷&–Å&öw&W72†çVÆÂ“°§Ò6F6‚†W'&÷"’°¢6öç6öÆRæW'&÷"‚$–æ—F–Æ—6F–öâGRÖF6‚æWWG&Æ—<:–R÷W",:—6W'fW"Ææf–vF–öâFRÆ†öÖRâ"ÂW'&÷"“°¢6†÷tÖVçU67&VVâ‚“°§Ð¦–æ—Dg&–VæFÇ•F÷W&æÖVçB‚“°¦–æ—E6W'fW%7–æ2‚“°¦6öç7BW‡Æ–6—DÆö6ÄÖF6„–BÒÆö6ÄÖö&–ÆTÖF6„–B‚“°¦6öç7BÆö6ÄÖF6…&W7F÷&VE7–æ6‡&öæ÷W6Ç’ÒW‡Æ–6—DÆö6ÄÖF6„–@¢ò&W7F÷&TÆö6ÄÖö&–ÆTÖF6…6W76–öâ†W‡Æ–6—DÆö6ÄÖF6„–B¢¢fÇ6S°¦–b‚W‡Æ–6—DÆö6ÄÖF6„–B’°¢òòcbã"–çf&–çC¢F†R6æöæ–6ÂU$ÂÇv—2ÆæG2öâF†RÆö&'’à¢6†÷tÖVçU67&VVâ‚“°¢&Vg&W6„Æö6ÄÖF6…&W7VÖU&ö×B‚’æf–æÆÇ’†–ç7FÆÄ'&÷w6W$æf–vF–öâ“°§ÒVÇ6R–b†Æö6ÄÖF6…&W7F÷&VE7–æ6‡&öæ÷W6Ç’’°¢–ç7FÆÄ'&÷w6W$æf–vF–öâ‚“°§ÒVÇ6R°¢&W7F÷&TÆö6ÄÖF6…6W76–öäg&öÔFF&6R‡²ÖF6„–C¢W‡Æ–6—DÆö6ÄÖF6„–BÒ’æf–æÆÇ’†–ç7FÆÄ'&÷w6W$æf–vF–öâ“°§Ð§v–æF÷ræ6ÆV$–çFW'fÂ…$ôd”ÄUô5D•d•E’çF–ÖW"“°¥$ôd”ÄUô5D•d•E’çF–ÖW"Òv–æF÷rç6WD–çFW'fÂ‡V&Æ—6…&öf–ÆT7F—f—G’Â#“°§V&Æ—6…&öf–ÆT7F—f—G’‚“°