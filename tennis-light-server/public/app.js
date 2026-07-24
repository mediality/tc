const STARTING_ENDURANCE = 7;
const HAND_SIZE = 6;
const GAME_VERSION = "v3.6";
const CARD_ASSET_VERSION = "170";

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

// Préférence strictement locale : une synchronisation du match ne doit jamais
// rouvrir le tableau qu'un joueur a choisi de masquer.
const TOURNAMENT_PANEL_UI = {
  visible: true,
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
    if (storedFormat === "league") return "league";
    if (["classic", "tournament"].includes(storedFormat)) return "classic";
    return "match";
  })(),
  targetSets: Number(localStorage.getItem("tennisLightAiClubSets")) === 3 ? 3 : 2,
  difficulty: localStorage.getItem("tennisLightAiClubDifficulty") || "normal",
  bonus: localStorage.getItem("tennisLightAiClubBonus") || "none",
  players: localStorage.getItem("tennisLightAiClubPlayers") === "best" ? "best" : "random",
  distribution: localStorage.getItem("tennisLightAiClubDistribution") === "ranking" ? "ranking" : "random",
};

const AI_CLUB_HOUSE_SAVE_PREFIX = "tennisLightAiClubHouseSave";

const AUTH_STATE = {
  user: null,
  loading: false,
  adminUsers: [],
  adminProCodes: [],
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
  legend: "LÉGENDE",
  ranking: "SELON CLASSEMENT",
  circuit: "CIRCUIT PRO",
};
const AI_DIFFICULTY_DESCRIPTIONS = {
  amateur: "Amateur · adversaires peu agressifs pour débuter facilement.",
  normal: "Normal · décisions variées et adversaires abordables.",
  expert: "Expert · adversaires concentrés qui prennent de bonnes décisions.",
  champion: "Champion · adversaires forts qui analysent avec précision les situations.",
  legend: "Légende · adversaires calculateurs pour des challenges très relevés.",
  ranking: "Selon classement · adversaires de niveaux variables selon leur propre classement.",
  circuit: "Circuit Pro · adversaires de niveau Amateur à Légende, selon le classement du Circuit Pro.",
};
const HUMAN_CIRCUIT_LEVELS = [
  { level: 1, min: 0, max: 499, label: "Lucky Loser" },
  { level: 2, min: 500, max: 999, label: "Qualifier" },
  { level: 3, min: 1000, max: 2499, label: "Wild Card" },
  { level: 4, min: 2500, max: 4999, label: "Challenger" },
  { level: 5, min: 5000, max: 7999, label: "Contender" },
  { level: 6, min: 8000, max: Infinity, label: "Top player" },
];
const AI_BONUS_LEVELS = ["none", "ascendant", "domination", "nemesis"];
const AI_BONUS_LABELS = {
  none: "SANS",
  ascendant: "ASCENDANT",
  domination: "DOMINATION",
  nemesis: "BÊTE NOIRE",
};
const AI_BONUS_COUNTS = {
  none: 0,
  ascendant: 1,
  domination: 2,
  nemesis: 3,
};
const AI_BONUS_DESCRIPTIONS = {
  none: "Sans · aucun bonus pour les joueurs IA.",
  ascendant: "Ascendant · 1 bonus aléatoire pour chaque joueur IA.",
  domination: "Domination · 2 bonus aléatoires différents pour chaque joueur IA.",
  nemesis: "Bête noire · 3 bonus aléatoires différents pour chaque joueur IA.",
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
];
const TOURNAMENT_CHARACTER_POOL = [...HISTORIC_TOURNAMENT_PLAYERS, ...NEW_TOURNAMENT_PLAYERS];
const FULL_PROFILE_CHARACTER_OPTIONS = [...COACH_OPTIONS, ...HISTORIC_TOURNAMENT_PLAYERS, ...NEW_TOURNAMENT_PLAYERS];
const GAME_NEWS = [
  {
    id: "v16929-prestige-ultimate-league",
    publishedAt: "2026-07-23",
    availableAt: "2026-07-23T00:00:00+02:00",
    title: "Bienvenue dans la Prestige League et l’Ultimate League",
    image: "assets/prestige-ultimate-league.jpeg",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Un nouveau format pour marquer des points… et votre empreinte ! La Prestige League et l’Ultimate League s’ajoutent désormais en tant que sixième tournoi de la semaine. Ces tournois se jouent au format League : huit joueurs s’affrontent dans deux poules de quatre. Votre objectif est de terminer parmi les deux premiers de votre poule afin de poursuivre votre parcours jusqu’à la victoire. La Prestige League se joue en deux sets gagnants et l’Ultimate League en trois sets gagnants. Cette dernière a lieu toutes les quatre semaines et rapporte davantage de points. Ces tournois sont adaptés à votre niveau : vous rencontrerez des joueurs correspondant à votre classement actuel. À noter cependant que, contrairement aux autres tournois, les Leagues ne sont pas rejouables dans la semaine. Bons matchs !",
  },
  {
    id: "v16921-rosa-benavente-espana",
    publishedAt: "2026-07-21",
    availableAt: "2026-07-21T18:00:00+02:00",
    title: "Que viva España!",
    characterId: "rosaBenavente",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Avec la victoire de l’Espagne en Coupe du monde de football, Rosa Benavente et sa tenue en hommage à la Roja intègrent le Tennis Courts Pro Circuit. Vous pouvez la rencontrer dans les tournois dès maintenant. Et comme une bonne nouvelle n’arrive jamais seule, elle rejoint également votre sélection de personnages. Tentez de devenir le GOAT avec Rosa Benavente… En tout cas, elle porte déjà un maillot de championne !",
  },
  {
    id: "v16921-coach-hans-staff",
    publishedAt: "2026-07-22",
    availableAt: "2026-07-22T08:00:00+02:00",
    title: "Le staff s’étoffe",
    characterId: "coachHans",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "S’il y a bien un coach qui a la cote quand on débute, c’est Hans… allez savoir pourquoi. En tout cas, l’équipe de Tennis Courts en sait quelque chose. Il a revêtu sa plus belle tenue, aux couleurs de son pays de cœur, pour vous entraîner ou servir de victime expiatoire : à vous de voir. Et si vous aimez changer les destinées, prenez le contrôle de Coach Hans et affrontez le Circuit Pro avec lui. Il fait désormais partie des personnages jouables !",
  },
  {
    id: "v166-milan-verhaegen-pro-unlock",
    publishedAt: "2026-07-19",
    title: "Milan Verhaegen rejoint les joueurs PRO",
    characterId: "milanVerhaegen",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Bravo à Milan Verhaegen, meilleur joueur de la semaine dernière. Pour fêter sa progression au classement, ce personnage est désormais débloqué et jouable. Pour l’utiliser, choisissez-le depuis votre page de profil. À bientôt sur les courts ! — Coach Ju",
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
};
const SURFACE_SPECIALISTS = Object.fromEntries(["grass", "hard", "clay"].map((surface) => [
  surface,
  Object.entries(AI_SURFACE_PREFERENCES)
    .filter(([, preference]) => preference === surface)
    .map(([characterId]) => characterId),
]));
const SURFACE_BONUSES = {
  grass: [
    { id: "grassPowerVolleySmash", label: "+2 puissance pour chaque Volée ou Smash joué" },
    { id: "grassCheapRemise", label: "Les cartes Effet/Remise coûtent 1 endurance en moins" },
    { id: "grassBoostPrecisionDraw", label: "Chaque BOOST donne +1 précision sur la carte suivante et pioche 1 carte" },
  ],
  hard: [
    { id: "hardPrecisePower", label: "+1 puissance pour chaque Coup avec précision supérieure à 3" },
    { id: "hardCheapShotDraw", label: "Pioche 1 carte à chaque Coup qui coûte 1 endurance" },
    { id: "hardBoostPlacement", label: "Chaque BOOST donne +2 placement sur la carte suivante" },
  ],
  clay: [
    { id: "clayGroundPower", label: "+1 puissance pour chaque Coup droit ou Revers joué" },
    { id: "clayForehandEndurance", label: "+1 endurance pour chaque Coup droit joué" },
    { id: "clayBoostPower", label: "+2 puissance pour chaque BOOST joué" },
  ],
};
const SURFACE_LABELS = { grass: "HERBE", hard: "DUR", clay: "TERRE-BATTUE" };

const HISTORIC_PERMANENT_BONUSES = [
  { id: "historicPermanentPlacement", label: "+1 placement permanent", placement: 1, precision: 0 },
  { id: "historicPermanentPrecision", label: "+1 précision permanente", placement: 0, precision: 1 },
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
  coachHans: {
    name: "Coach Hans",
    effects: [
      { side: "Bleu", label: "Défaussez une carte de votre main et gagnez 3 puissance", type: "discardHandForPower", value: 3 },
      { side: "Rose", label: "Tous les Coups du prochain tour adverse coûtent 1 endurance de plus", type: "opponentTurnShotExtraCost", value: 1 },
    ],
  },
  theoBriancourt: {
    name: "Theo Briancourt",
    effects: [
      { side: "Bleu", label: "Récupère 1 carte dans la défausse", type: "recoverUndealt" },
      { side: "Rose", label: "Défausse une carte adverse engagée de votre choix", type: "removeOpponentPlayedChoice" },
    ],
  },
  alessandraConti: {
    name: "Alessandra Conti",
    effects: [
      { side: "Bleu", label: "Toutes vos cartes gagnent +2 placement jusqu'à la fin de l'échange", type: "exchangePlacementBonus", value: 2 },
      { side: "Rose", label: "Récupère 2 endurance et pioche 1 carte", type: "gainEnduranceAndDraw", endurance: 2, draw: 1 },
    ],
  },
  saharaJackson: {
    name: "Sahara Jackson",
    effects: [
      { side: "Bleu", label: "+1 puissance", type: "gainPower", value: 1 },
      { side: "Rose", label: "Double votre dernière carte Coup à la fin de l'échange", type: "endDoubleLastShot" },
    ],
  },
  kjellBlomqvist: {
    name: "Kjell Blomqvist",
    effects: [
      { side: "Bleu", label: "Toutes vos cartes gagnent +2 précision jusqu'à la fin de l'échange", type: "exchangePrecisionBonus", value: 2 },
      { side: "Rose", label: "Pioche 2 cartes", type: "drawCard", count: 2 },
    ],
  },
  kojiIwata: {
    name: "Koji Iwata",
    effects: [
      { side: "Bleu", label: "Récupère 1 endurance", type: "gainEndurance", value: 1 },
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
      { side: "Rose", label: "+2 puissance sur tous vos Coups droits joués dans cet échange", type: "exchangeFamilyPowerBonus", families: ["Coup droit"], value: 2 },
    ],
  },
  calvinBrentwood: {
    name: "Calvin Brentwood",
    effects: [
      { side: "Bleu", label: "+1 puissance sur vos Smash, Volées et Passing jusqu'à la fin de l'échange", type: "exchangeFamilyPowerBonus", families: ["Smash", "Volée", "Passing"], value: 1 },
      { side: "Rose", label: "Pioche 1 carte et récupère 1 endurance", type: "gainEnduranceAndDraw", endurance: 1, draw: 1 },
    ],
  },
  javierRamirez: {
    name: "Javier Ramirez",
    effects: [
      { side: "Bleu", label: "+1 placement jusqu'à la fin de l'échange", type: "exchangePlacementBonus", value: 1 },
      { side: "Rose", label: "+1 endurance et +1 puissance", type: "gainEnduranceAndPower", endurance: 1, power: 1 },
    ],
  },
  petraEckermann: {
    name: "Petra Eckermann",
    effects: [
      { side: "Bleu", label: "Annule l'effet de la prochaine carte adverse", type: "cancelNextOpponentEffect" },
      { side: "Rose", label: "Supprime une carte Coup jouée par l'adversaire", type: "removeOpponentPlayedChoice", shotsOnly: true },
    ],
  },
  jonasFalkenried: {
    name: "Jonas Falkenried",
    effects: [
      { side: "Bleu", label: "+1 placement jusqu'à la fin de l'échange", type: "exchangePlacementBonus", value: 1 },
      { side: "Rose", label: "+1 endurance et +1 puissance", type: "gainEnduranceAndPower", endurance: 1, power: 1 },
    ],
  },
  yunaSeo: {
    name: "Yuna Seo",
    effects: [
      { side: "Bleu", label: "+1 puissance sur vos Revers jusqu'à la fin de l'échange", type: "exchangeFamilyPowerBonus", families: ["Revers"], value: 1 },
      { side: "Rose", label: "+1 endurance et pioche 1 carte", type: "gainEnduranceAndDraw", endurance: 1, draw: 1 },
    ],
  },
  ikerSalvat: {
    name: "Iker Salvat",
    effects: [
      { side: "Bleu", label: "+2 placement pour chaque coup après un Coup droit", type: "exchangeAfterFamilyPlacementBonus", afterFamily: "Coup droit", value: 2 },
      { side: "Rose", label: "+3 puissance, l'adversaire récupère 1 endurance", type: "gainPowerOpponentEndurance", power: 3, opponentEndurance: 1 },
    ],
  },
  loganBrooks: {
    name: "Logan Brooks",
    effects: [
      { side: "Bleu", label: "+1 puissance sur vos Coups droits jusqu'à la fin de l'échange", type: "exchangeFamilyPowerBonus", families: ["Coup droit"], value: 1 },
      { side: "Rose", label: "Pioche 2 cartes et récupère 1 endurance", type: "gainEnduranceAndDraw", endurance: 1, draw: 2 },
    ],
  },
  kavyaSaran: {
    name: "Kavya Saran",
    effects: [
      { side: "Bleu", label: "Annule l'effet de la prochaine carte adverse", type: "cancelNextOpponentEffect" },
      { side: "Rose", label: "+1 puissance pour chaque Coup engagé de votre côté", type: "coupPowerBonus" },
    ],
  },
  zariaCampbell: {
    name: "Zaria Campbell",
    effects: [
      { side: "Bleu", label: "+2 placement par carte adverse jouée avec puissance inférieure à 5", type: "placementPerOpponentLowPowerCard", threshold: 5, value: 2 },
      { side: "Rose", label: "Pioche 1 carte dans la main adverse", type: "drawRandomOpponentHand" },
    ],
  },
  renAoshima: {
    name: "Ren Aoshima",
    effects: [
      { side: "Bleu", label: "Choisit 1 carte de la pioche", type: "recoverUndealt" },
      { side: "Rose", label: "+2 puissance sur vos Coups droits et Revers jusqu'à la fin de l'échange", type: "exchangeFamilyPowerBonus", families: ["Coup droit", "Revers"], value: 2 },
    ],
  },
  yasmineElMansouri: {
    name: "Yasmine El Mansouri",
    effects: [
      { side: "Bleu", label: "L'adversaire ne peut plus supprimer vos cartes jusqu'à la fin de l'échange", type: "preventOpponentRemoval" },
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
      { side: "Bleu", label: "Le prochain coup adverse coûte 1 endurance de plus", type: "opponentNextExtraCost", value: 1 },
      { side: "Rose", label: "Supprime 1 carte jouée par l'adversaire", type: "removeOpponentPlayedChoice" },
    ],
  },
  milanVerhaegen: {
    name: "Milan Verhaegen",
    effects: [
      { side: "Bleu", label: "+1 placement pour tous vos Coups jusqu'à la fin de l'échange", type: "exchangePlacementBonus", value: 1 },
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

const TUTORIAL_NARRATORS = {
  coachJu: {
    name: "Coach Ju",
    role: "Créateur de Tennis Courts",
    image: "assets/Coach-Ju-Speak.png",
  },
  coachMax: {
    name: "Coach Max",
    role: "Coach de Tennis Courts",
    image: "assets/CoachMaxTRS.png",
  },
};

// Les prochains modules réutilisent cette structure : scénario, étapes, ciblages,
// validations, erreurs et déclenchements automatiques restent entièrement déclaratifs.
const TUTORIAL_MODULES = {
  basics: {
    id: "module-1-basics",
    lesson: "Académie · Module 1",
    title: "Découverte de Tennis Courts Academy",
    narrator: "coachJu",
    scenario: "interface",
    readOnly: true,
    initialLog: ["Le journal d'échange affichera ici toutes les actions du point."],
    totalDisplaySteps: 19,
    steps: [
      {
        id: "m1-1-welcome",
        displayStep: 1,
        title: "Bienvenue",
        text: "Bienvenue dans Tennis Courts Academy ! Je suis Coach Ju et je serai ton entraîneur.",
      },
      {
        id: "m1-2-shared-deck",
        displayStep: 2,
        title: "Le deck de l'Académie",
        text: "Pour apprendre simplement, les deux joueurs partagent ici un deck unique de 18 cartes.",
        focus: [{ target: "hand", playerIndex: 0 }],
      },
      {
        id: "m1-3-full-game",
        displayStep: 3,
        title: "Le jeu complet",
        text: "Dans le jeu complet, chaque joueur possède son propre deck de 48 cartes et son personnage.",
      },
      {
        id: "m1-4-player",
        displayStep: 4,
        title: "Ton personnage",
        text: "Ton personnage se trouve à gauche du court.",
        focus: [{ target: "character", playerIndex: 0 }],
      },
      {
        id: "m1-5-opponent",
        displayStep: 5,
        title: "Ton adversaire",
        text: "Le personnage de ton adversaire se trouve à droite.",
        focus: [{ target: "character", playerIndex: 1 }],
      },
      {
        id: "m1-6-last-card",
        displayStep: 6,
        title: "La dernière carte",
        text: "Au centre du plateau, tu peux consulter et agrandir la dernière carte jouée.",
        focus: [{ target: "lastCard" }],
      },
      {
        id: "m1-7-power",
        displayStep: 7,
        title: "La puissance",
        text: "La puissance de ton personnage t'aide à gagner l'échange.",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m1-8-endurance",
        displayStep: 8,
        title: "L'endurance",
        text: "L'endurance permet de jouer tes cartes. Quand elle est épuisée, tu ne peux plus jouer de nouveau coup.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m1-9-card",
        displayStep: 9,
        title: "Une carte de jeu",
        text: "Regardons maintenant une carte de plus près.",
        showcase: { cardId: "revers-3-3-3" },
      },
      {
        id: "m1-10-card-cost",
        displayStep: 10,
        title: "Le coût en endurance",
        text: "En haut à gauche, ce nombre indique l'endurance dépensée pour jouer la carte.",
        showcase: {
          cardId: "revers-3-3-3",
          pointer: "cost",
          label: "Coût",
        },
      },
      {
        id: "m1-11-card-power",
        displayStep: 11,
        title: "La puissance de la carte",
        text: "En haut à droite, ce nombre indique la puissance apportée par la carte.",
        showcase: {
          cardId: "revers-3-3-3",
          pointer: "power",
          label: "Puissance",
        },
      },
      {
        id: "m1-12-precision",
        displayStep: 12,
        title: "La précision",
        text: "La précision sera utilisée dans une prochaine leçon.",
        showcase: { cardId: "revers-3-3-3", pointer: "precision", label: "Précision" },
      },
      {
        id: "m1-13-placement",
        displayStep: 13,
        title: "Le placement",
        text: "Le placement sera lui aussi expliqué dans une prochaine leçon.",
        showcase: { cardId: "revers-3-3-3", pointer: "placement", label: "Placement" },
      },
      {
        id: "m1-14-effect",
        displayStep: 14,
        title: "L'effet",
        text: "Au centre de la carte se trouve son éventuel effet de jeu.",
        showcase: { cardId: "revers-3-3-3", pointer: "effect", label: "Effet" },
      },
      {
        id: "m1-15-boost-zone",
        displayStep: 15,
        title: "La zone Boost",
        text: "Certaines cartes possèdent en bas une zone Boost, que nous étudierons plus tard.",
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
        text: "Le bouton Boost s'active quand ses conditions sont réunies. Le Boost coûte la même endurance que la carte, mais exige de sacrifier une autre carte.",
        focus: [{ target: "boost", playerIndex: 0, cardId: "revers-3-3-3" }],
      },
      {
        id: "m1-18-history",
        displayStep: 18,
        title: "Le journal d'échange",
        text: "Le journal d'échange conserve toutes les actions effectuées pendant le point.",
        focus: [{ target: "history" }],
      },
      {
        id: "m1-19-conclusion",
        displayStep: 19,
        title: "Conclusion",
        text: "Parfait, tu connais les principaux éléments de l'interface ! La prochaine leçon te fera jouer ton premier échange.",
        final: true,
      },
    ],
  },
  guidedRally: {
    id: "module-2-guided-rally",
    lesson: "Académie · Module 2",
    title: "Premier échange guidé",
    narrator: "coachJu",
    scenario: "guided-rally",
    initialLog: ["Premier échange guidé : suis les indications de Coach Ju."],
    totalDisplaySteps: 22,
    steps: [
      {
        id: "m2-1-court",
        displayStep: 1,
        title: "Bienvenue sur le court",
        text: "Nous allons jouer ensemble ton premier échange. Je te guiderai à chaque action.",
      },
      {
        id: "m2-2-server",
        displayStep: 2,
        title: "Tu es au service",
        text: "Le badge Serveur indique que tu dois engager l'échange.",
        focus: [{ target: "character", playerIndex: 0 }],
      },
      {
        id: "m2-3-select-service",
        displayStep: 3,
        title: "Choisis le Service",
        text: "Sélectionne maintenant la carte Service.",
        action: { kind: "selectCard", playerIndex: 0, cardId: "service-coup-droit" },
        error: "Sélectionne la carte Service indiquée par la flèche.",
      },
      {
        id: "m2-4-play-service",
        displayStep: 4,
        title: "Joue le Service",
        text: "Clique sur Jouer sous la carte Service pour engager l'échange.",
        action: { kind: "play", playerIndex: 0, cardId: "service-coup-droit", mode: "normal" },
      },
      {
        id: "m2-5-service-cost",
        displayStep: 5,
        title: "Endurance dépensée",
        text: "Ton Service a coûté 2 points d'endurance.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m2-6-service-power",
        displayStep: 6,
        title: "Puissance gagnée",
        text: "Ton Service t'a rapporté 4 points de puissance.",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m2-7-coach-first-reply",
        displayStep: 7,
        title: "La réponse de Coach Ju",
        text: "Je réponds avec un Passing. Regarde l'échange changer de côté.",
        auto: { kind: "play", playerIndex: 1, cardId: "passing-1-1-4", mode: "normal" },
        autoDelayMs: 500,
      },
      {
        id: "m2-8-alternation",
        displayStep: 8,
        title: "Chacun son tour",
        text: "Chaque joueur joue une carte à son tour. C'est de nouveau à toi.",
        focus: [{ target: "character", playerIndex: 0 }],
      },
      {
        id: "m2-9-select-forehand",
        displayStep: 9,
        title: "Choisis le Coup droit",
        text: "Sélectionne le Coup droit indiqué.",
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
        text: "À chaque carte jouée, son coût est retiré de ton endurance.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m2-12-more-power",
        displayStep: 12,
        title: "La puissance augmente",
        text: "La puissance de la carte s'ajoute à ton total.",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m2-13-coach-second-reply",
        displayStep: 13,
        title: "Coach Ju poursuit",
        text: "Je joue maintenant un Lob. L'échange continue.",
        auto: { kind: "play", playerIndex: 1, cardId: "lob-2-0-4", mode: "normal" },
        autoDelayMs: 500,
      },
      {
        id: "m2-14-select-backhand",
        displayStep: 14,
        title: "Choisis le Revers",
        text: "Il te reste exactement assez d'endurance. Sélectionne ton Revers.",
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
        title: "Endurance épuisée",
        text: "Ton endurance est maintenant à zéro.",
        focus: [{ target: "endurance", playerIndex: 0 }],
      },
      {
        id: "m2-17-coach-last-reply",
        displayStep: 17,
        title: "Dernière réponse",
        text: "Je joue une dernière Amortie. Tu ne peux plus répondre avec une carte.",
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
        text: "Clique maintenant sur Passer pour terminer l'échange.",
        action: { kind: "pass", playerIndex: 0 },
      },
      {
        id: "m2-20-pass-bonus",
        displayStep: 20,
        title: "Le bonus de passe",
        text: "Ton adversaire reçoit un bonus égal à ton endurance restante, avec un minimum de 2 points.",
      },
      {
        id: "m2-21-result",
        displayStep: 21,
        title: "Résolution de l'échange",
        text: "Les puissances finales sont comparées. Tu remportes cet échange !",
        focus: [{ target: "power", playerIndex: 0 }],
      },
      {
        id: "m2-22-conclusion",
        displayStep: 22,
        title: "Premier échange terminé",
        text: "Bravo, tu viens de terminer ton premier échange ! La prochaine leçon expliquera en détail le calcul du vainqueur.",
        final: true,
      },
    ],
  },
};

const TUTORIAL_ENGINE = window.TennisCourtsTutorialEngine;
if (!TUTORIAL_ENGINE) throw new Error("Le moteur du tutoriel n'a pas été chargé.");
TUTORIAL_ENGINE.assertValidModules(TUTORIAL_MODULES);
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

const GAMEPLAY_ASSIST = {
  preview: localStorage.getItem("tennisLightAssistPreview") === "true",
  information: localStorage.getItem("tennisLightAssistInformation") === "true",
  panelOpen: false,
};

const state = {
  players: [],
  deck: [],
  discardedCards: [],
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
  modeInfoBadge: document.querySelector("#modeInfoBadge"),
  adminGameTools: document.querySelector("#adminGameTools"),
  adminGameToolsButton: document.querySelector("#adminGameToolsButton"),
  adminGameToolsPanel: document.querySelector("#adminGameToolsPanel"),
  adminSimulateScoreButton: document.querySelector("#adminSimulateScoreButton"),
  returnLobbyButton: document.querySelector("#returnLobbyButton"),
  topProgressionActions: document.querySelector("#topProgressionActions"),
  gameAssistTools: document.querySelector("#gameAssistTools"),
  gameAssistButton: document.querySelector("#gameAssistButton"),
  gameAssistPanel: document.querySelector("#gameAssistPanel"),
  gamePreviewToggle: document.querySelector("#gamePreviewToggle"),
  gameInformationToggle: document.querySelector("#gameInformationToggle"),
  gameContextStrip: document.querySelector("#gameContextStrip"),
  spectatorQuitButton: document.querySelector("#spectatorQuitButton"),
  gameLogoButton: document.querySelector("#gameLogoButton"),
  menuScreen: document.querySelector("#menuScreen"),
  lobbySectionScreen: document.querySelector("#lobbySectionScreen"),
  lobbySectionPanels: document.querySelectorAll("[data-lobby-section-panel]"),
  lobbyModeCards: document.querySelectorAll("[data-open-lobby-section]"),
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
  manageUsersButton: document.querySelector("#manageUsersButton"),
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
  adminPageInfo: document.querySelector("#adminPageInfo"),
  openRankingPageButton: document.querySelector("#openRankingPageButton"),
  backToLobbyFromRankingButton: document.querySelector("#backToLobbyFromRankingButton"),
  rankingHomeButton: document.querySelector("#rankingHomeButton"),
  openCircuitInfoButton: document.querySelector("#openCircuitInfoButton"),
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
  exportHumanMatchesButton: document.querySelector("#exportHumanMatchesButton"),
  soloModeButton: document.querySelector("#soloModeButton"),
  setModeButton: document.querySelector("#setModeButton"),
  matchTwoButton: document.querySelector("#matchTwoButton"),
  matchThreeButton: document.querySelector("#matchThreeButton"),
  onlineModeButton: document.querySelector("#onlineModeButton"),
  resultPanel: document.querySelector("#resultPanel"),
  tournamentPanel: document.querySelector("#tournamentPanel"),
  tutorialOverlay: document.querySelector("#tutorialOverlay"),
  player1Summary: document.querySelector("#player1Summary"),
  player2Summary: document.querySelector("#player2Summary"),
  rallyPhaseLabel: document.querySelector("#rallyPhaseLabel"),
  rallyStatusBadge: document.querySelector("#rallyStatusBadge"),
  rallyScoreDeltaBadge: document.querySelector("#rallyScoreDeltaBadge"),
  rallyFullLogButton: document.querySelector("#rallyFullLogButton"),
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

const PAGE_NAVIGATION_STATE = { profileReturn: "home" };

function visibleScreenDestination() {
  if (!els.gameApp?.classList.contains("hidden") || !els.mobileGameApp?.classList.contains("hidden")) return "game";
  if (!els.friendlyLobbyScreen?.classList.contains("hidden")) return "online-room";
  if (!els.aiClubHouseScreen?.classList.contains("hidden")) return "solo";
  if (!els.rankingScreen?.classList.contains("hidden")) return "ranking";
  if (!els.circuitInfoScreen?.classList.contains("hidden")) return "circuit-info";
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

function updateGlobalPlayerDock() {
  const user = AUTH_STATE.user;
  const destination = visibleScreenDestination();
  const gameActive = destination === "game";
  const hidden = !user || destination === "home";
  const activeScreen = destination === "game" ? els.gameApp : [els.lobbySectionScreen, els.adminScreen, els.rankingScreen, els.circuitInfoScreen, els.academyInfoScreen, els.tutorialModulesScreen, els.profileScreen, els.characterScreen, els.friendlyLobbyScreen, els.aiClubHouseScreen]
    .find((screen) => screen && !screen.classList.contains("hidden"));
  const dockHost = activeScreen?.querySelector(".lobby-section-header, .mode-clubhouse-topbar, .topbar") || null;
  if (dockHost && els.globalPlayerDock) {
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
  if (els.globalPlayerRole) els.globalPlayerRole.textContent = gameActive ? "Profil consultable après la partie" : (ROLE_LABELS[currentUserRole()] || "Profil joueur");
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
    if (section.matches("button, select") && !section.classList.contains("lobby-mode-card")) section.disabled = !hasProAccess;
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
}

function renderAuthState(message = "") {
  if (!els.authStatus) return;
  const user = AUTH_STATE.user;
  const roleLabel = ROLE_LABELS[currentUserRole()] || "FREE";
  els.authStatus.textContent = message || (user ? `Connecté : ${user.nickname} · ${roleLabel}` : "Non connecté");
  els.authStatus.classList.toggle("connected", Boolean(user));
  els.authForm?.classList.toggle("hidden", Boolean(user));
  els.logoutButton?.classList.toggle("hidden", !user);
  els.profileButton?.classList.toggle("hidden", !user);
  els.proCodePanel?.classList.toggle("hidden", !user || currentUserRole() !== "free");
  els.adminNextWeekButton?.classList.toggle("hidden", !canAccessAdminFeatures());
  if (els.lobbyHeaderNickname) els.lobbyHeaderNickname.textContent = user?.nickname || "Se connecter";
  if (els.lobbyHeaderRole) els.lobbyHeaderRole.textContent = user ? roleLabel : "Invité";
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
  if (Number.isNaN(date.getTime())) return "Date à venir";
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
    els.homeNewsList.innerHTML = '<div class="home-news-empty">Les prochaines actualités de l’Academy arrivent bientôt.</div>';
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
          <button class="home-news-read" type="button" data-read-game-news="${escapeHtml(news.id)}">Lire l'actualité <span aria-hidden="true">→</span></button>
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
  els.newsArchiveList.innerHTML = newsItems.map((news) => {
    const characterId = news.characterId || "milanVerhaegen";
    const image = gameNewsImage(news);
    return `
      <article class="news-archive-card">
        <button class="news-archive-visual" type="button" data-read-game-news="${escapeHtml(news.id)}" aria-label="Lire : ${escapeHtml(news.title)}">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(news.image ? news.title : `Portrait de ${characterNameFromId(characterId)}`)}" />
        </button>
        <div class="news-archive-copy">
          <time datetime="${escapeHtml(news.publishedAt)}">${escapeHtml(formatGameNewsDate(news.publishedAt))}</time>
          <button class="news-archive-title" type="button" data-read-game-news="${escapeHtml(news.id)}">${escapeHtml(news.title)}</button>
          <p>${escapeHtml(news.message)}</p>
          <button class="home-news-read" type="button" data-read-game-news="${escapeHtml(news.id)}">Lire l’actualité <span aria-hidden="true">→</span></button>
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
      <div class="pro-news-card-frame">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(news.image ? news.title : `Carte de ${characterNameFromId(characterId)}`)}" />
      </div>
      <div class="pro-news-copy">
        <p class="label">DERNIÈRES ACTU · ${escapeHtml(formatGameNewsDate(news.publishedAt))}</p>
        <h2 id="proNewsTitle">${escapeHtml(news.title)}</h2>
        <p id="proNewsMessage">${escapeHtml(news.message)}</p>
        <div class="dialog-actions">
          <button class="primary-button" type="button" data-close-pro-news>FERMER</button>
        </div>
      </div>
    </article>
  `;
  const close = () => {
    backdrop.remove();
  };
  backdrop.querySelector("[data-close-pro-news]")?.addEventListener("click", close);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });
  document.body.append(backdrop);
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
  renderAuthState("Création du compte...");
  try {
    const data = await authRequest("/api/auth/register", { email, password });
    applyAuthenticatedUser(data.user);
    if (els.authPasswordInput) els.authPasswordInput.value = "";
  } catch (error) {
    renderAuthState(error.message);
  }
}

async function requestPasswordReset() {
  const email = window.prompt("Adresse email du compte à récupérer :");
  if (!email) return;
  renderAuthState("Si ce compte existe, un lien de réinitialisation va être envoyé.");
  try {
    await authRequest("/api/auth/password-reset/request", { email });
    renderAuthState("Si ce compte existe, un lien de réinitialisation va être envoyé.");
  } catch (error) {
    renderAuthState("Si ce compte existe, un lien de réinitialisation va être envoyé.");
  }
}

function resetTokenFromUrl() {
  return new URLSearchParams(window.location.search).get("reset") || "";
}

async function confirmPasswordReset() {
  const token = resetTokenFromUrl();
  const password = els.resetPasswordInput?.value || "";
  if (!token) return;
  if (els.resetPasswordStatus) els.resetPasswordStatus.textContent = "Mise à jour...";
  try {
    await authRequest("/api/auth/password-reset/confirm", { token, password });
    if (els.resetPasswordStatus) els.resetPasswordStatus.textContent = "Mot de passe modifié. Retour à la connexion.";
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
  renderAuthState("Déconnexion...");
  try {
    await authRequest("/api/auth/logout", {});
  } catch (error) {
    // Même si le serveur ne répond pas, on libère l'interface locale.
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
  if (els.proCodeStatus) els.proCodeStatus.textContent = "Vérification du code...";
  try {
    const data = await authRequest("/api/auth/redeem-pro-code", { code });
    if (els.proCodeInput) els.proCodeInput.value = "";
    if (els.proCodeStatus) els.proCodeStatus.textContent = "Compte Pro activé.";
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
    els.adminUsersTable.innerHTML = '<div class="admin-empty">Aucun utilisateur à afficher.</div>';
    return;
  }
  els.adminUsersTable.innerHTML = `
    <div class="admin-table-head">
      <span>ID</span>
      <span>Nom</span>
      <span>Mail</span>
      <span>Rôle</span>
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
    <div class="admin-code-head"><span>Code</span><span>Statut</span><span>Compte</span></div>
    ${codes.map((item) => `
      <div class="admin-code-row ${item.assignedTo ? "used" : ""}">
        <strong>${escapeHtml(item.code)}</strong>
        <span>${item.assignedTo ? "Attribué" : "Disponible"}</span>
        <span>${escapeHtml(item.assignedTo?.nickname || item.assignedTo?.email || "-")}</span>
      </div>
    `).join("")}
  `;
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
  if (els.adminProCodesList) els.adminProCodesList.innerHTML = '<div class="admin-empty">Génération des codes...</div>';
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
  if (!window.confirm(`Supprimer définitivement ${label} ?`)) return;
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
      return `<span class="ranking-ai-name">${escapeHtml(row.nickname)}</span>`;
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
    <div class="ranking-meta">Saison ${Number(ranking?.season || 1)} · Semaine ${Number(ranking?.week || 1)}</div>
  `;
}

function attachProfileLinks(container) {
  container?.querySelectorAll("[data-profile-user]").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.dataset.profileUser;
      if (!userId || userId.startsWith("ai:")) return;
      showProfileScreen(userId);
    });
  });
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
  element.textContent = `(${circuitRankLabel(projected)} projeté)`;
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

  if (els.circuitHeroPeriod) els.circuitHeroPeriod.textContent = `Saison ${season} · Semaine ${week} · Tournois de la semaine`;
  const fixedWorldRank = Number(current?.points_rank || current?.rank || 0);
  if (els.circuitRankValue) els.circuitRankValue.textContent = circuitRankLabel(fixedWorldRank);
  setCircuitProjection(els.circuitRankProjection, fixedWorldRank, current?.projected_rank);
  if (els.circuitPointsValue) els.circuitPointsValue.textContent = String(Number(current?.score_ref || 0));
  if (els.circuitWeekPointsValue) els.circuitWeekPointsValue.textContent = String(Number(current?.score_week || 0));
  if (els.circuitAttemptsValue) els.circuitAttemptsValue.textContent = `${remainingAttempts}/${retryLimit}`;
  if (els.circuitAttemptsCaption) els.circuitAttemptsCaption.textContent = remainingAttempts
    ? `${remainingAttempts} amélioration${remainingAttempts > 1 ? "s" : ""} encore possible${remainingAttempts > 1 ? "s" : ""}`
    : "Toutes les tentatives ont été utilisées";

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

function confrontationStatus(wins, losses) {
  const total = wins + losses;
  if (total < 6) return null;
  const ratio = (wins / total) * 100;
  if (total >= 10 && ratio > 90) return { label: "Domination humaine", className: "domination" };
  if (ratio > 80) return { label: "Ascendant humain", className: "ascendant-positive" };
  if (ratio < 35) return { label: "Bête noire", className: "bete-noire" };
  if (ratio < 50) return { label: "Ascendant IA", className: "ascendant-negative" };
  return null;
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
    // Les JPG du dossier cards sont déjà les fichiers x2 (1462 × 2078).
    // On conserve leur résolution physique complète dans src : certains moteurs
    // réduisent trop tôt une source déclarée uniquement avec le descripteur 2x.
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
  if (!imageUrl || document.querySelector(".image-zoom-backdrop")) return;
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
      // touchstart mémorise également l'identifiant du doigt. Pointerdown sert
      // de secours aux stylets et aux navigateurs sans événements tactiles.
      if (event.pointerType !== "touch") prepareCardTouchPreview(button, imageUrl, label);
    });
    button.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "touch") endActiveCardTouch();
    });
    button.addEventListener("pointercancel", (event) => {
      // Les navigateurs envoient pointercancel dès qu'un défilement commence.
      // La loupe reste donc visible jusqu'au véritable touchend.
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
  closeCardLocalPreview();
  document.querySelector(".image-zoom-backdrop")?.remove();
  if (!imageUrl) return;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop image-zoom-backdrop";
  backdrop.innerHTML = `
    <button class="image-zoom-close" type="button" aria-label="Fermer l'agrandissement">×</button>
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
    button.addEventListener("click", () => {
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
    <button class="image-zoom-close" type="button" aria-label="Fermer l'agrandissement">×</button>
    <button class="academy-gallery-arrow previous" type="button" data-academy-gallery-direction="-1" aria-label="Carte précédente">‹</button>
    <figure class="image-zoom-figure academy-gallery-figure" role="dialog" aria-modal="true">
      <img alt="" />
    </figure>
    <button class="academy-gallery-arrow next" type="button" data-academy-gallery-direction="1" aria-label="Carte suivante">›</button>
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
          <span>Saison ${entry.season} · Semaine ${entry.week}</span>
        </div>`;
      }
      const row = entry.row;
      const won = String(row.achievement || "").toLowerCase() === "winner";
      const city = row.city || "";
      const country = row.country || "";
      const flag = row.flag || "";
      return `<div class="profile-row${extraClass}" ${index >= 10 ? 'data-profile-collapse-group="career"' : ""}>
        <strong><span class="profile-result-medal ${won ? "gold" : "silver"}"></span>${escapeHtml(row.competition_name || row.competitionName)}</strong>
        <span>${escapeHtml(city)} · ${escapeHtml(country)} ${escapeHtml(flag)} · Saison ${entry.season} · Semaine ${entry.week} · ${won ? "Victoire" : "Finale"} · ${Number(row.points || 0)} pts</span>
      </div>`;
    }).join("")
    : '<div class="lobby-empty">Aucune victoire ou finale enregistrée.</div>';
  const careerToggle = careerEntries.length > 10
    ? '<button class="profile-expand-button" type="button" data-profile-toggle="career" aria-expanded="false" aria-label="Afficher tout le palmarès">+</button>'
    : "";
  const adminScoreRows = profile?.viewerIsAdmin && profile?.adminScores?.periods?.length
    ? profile.adminScores.periods.map((period) => `
        <label class="admin-score-period">
          <span>${escapeHtml(period.label)} · Saison ${Number(period.season)} · Semaine ${Number(period.week)}</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${Number(period.points || 0)}" data-profile-score-key="${escapeHtml(period.key)}" />
        </label>
      `).join("")
    : "";
  const sortedAiResults = [...aiResults].sort((a, b) => (
    Number(b.wins || 0) + Number(b.losses || 0) - Number(a.wins || 0) - Number(a.losses || 0)
    || Number(b.wins || 0) - Number(a.wins || 0)
  ));
  const aiRows = sortedAiResults.length
    ? sortedAiResults.map((row, index) => {
      const wins = Number(row.wins || 0);
      const losses = Number(row.losses || 0);
      const matches = wins + losses;
      const status = confrontationStatus(wins, losses);
      return `<div class="profile-row confrontation-row${index >= 5 ? " profile-collapsible-item hidden" : ""}" ${index >= 5 ? 'data-profile-collapse-group="rivalries"' : ""}>
        <strong>${escapeHtml(characterNameFromId(row.ai_character_id || row.aiCharacterId))}</strong>
        <span class="confrontation-summary">
          ${status ? `<span class="confrontation-status ${status.className}">${escapeHtml(status.label)}</span>` : ""}
          <span class="confrontation-matches">${matches} match${matches > 1 ? "s" : ""}</span>
          <span class="confrontation-ratio" aria-label="${wins} victoires et ${losses} défaites">${wins} / ${losses}</span>
        </span>
      </div>`;
    }).join("")
    : '<div class="lobby-empty">Aucun résultat de confrontation enregistré.</div>';
  const rivalriesToggle = sortedAiResults.length > 5
    ? '<button class="profile-expand-button" type="button" data-profile-toggle="rivalries" aria-expanded="false" aria-label="Afficher toutes les rivalités">+</button>'
    : "";
  const statRows = [
    ["Meilleur classement", user?.bestWorldRank ? `#${Number(user.bestWorldRank)}` : "-"],
    ["Semaines n°1", Number(user?.weeksWorldNumberOne || 0)],
    ["Semaines Top 3", Number(user?.weeksWorldTop3 || 0)],
    ["Semaines Top 5", Number(user?.weeksWorldTop5 || 0)],
    ["Semaines Top 10", Number(user?.weeksWorldTop10 || 0)],
  ].map(([label, value]) => `<div class="profile-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  const calendarRowMarkup = (item, collapsed = false) => {
      const title = `${item.type || item.level || "Tournoi"} - ${item.name || ""}`;
      const place = `${item.city || ""} · ${item.country || ""} ${item.flag || ""}`;
      let detail = "";
      if (item.reached && item.result) {
        detail = `${item.result.label} · ${Number(item.result.points || 0)} pts${item.result.lastOpponent ? ` · Dernier match vs ${item.result.lastOpponent}` : ""}${item.result.lastScore ? ` · ${item.result.lastScore}` : ""}`;
      } else if (item.reached) {
        detail = "N'a pas participé";
      }
      const achievement = String(item.result?.achievement || "").toLowerCase();
      const isCurrentWeek = Number(item.week || 0) === Number(profile?.circuit?.week || 0);
      const resultClass = achievement === "winner" ? " result-winner" : achievement === "finalist" ? " result-finalist" : "";
      return `<div class="profile-calendar-row${isCurrentWeek ? " current-week" : ""}${resultClass}${collapsed ? " profile-collapsible-item hidden" : ""}" ${collapsed ? 'data-profile-collapse-group="calendar"' : ""}>
        <div class="profile-calendar-heading">
          <strong>S${Number(item.week || 0)} · ${escapeHtml(title)}</strong>
          ${profile?.viewerIsAdmin && item.reached ? `<button class="small-button danger-button profile-tournament-reset" type="button" data-reset-profile-tournament="${escapeHtml(item.id)}" data-reset-profile-season="${Number(profile?.circuit?.season || 1)}" data-reset-profile-week="${Number(item.week || 0)}" data-profile-admin-user="${escapeHtml(user?.id || "")}">Réinitialiser à 0</button>` : ""}
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
  return `
    <section class="profile-identity-hero">
      <div class="profile-identity-portrait">
        <img src="${escapeHtml(selectedCharacterVisuals.illustration)}" alt="${escapeHtml(selectedCharacterName)}" />
      </div>
      <div class="profile-identity-info">
        <div class="profile-identity-copy">
          <span class="profile-role">${escapeHtml(ROLE_LABELS[user?.role] || "FREE")}</span>
          <p class="label">${isOwnProfile ? "Votre carrière" : "Profil joueur"}</p>
          <h2>${escapeHtml(user?.nickname || "Joueur")}</h2>
          <p>${escapeHtml(selectedCharacterName)} vous représente dans le lobby et sur les courts.</p>
        </div>
        <dl class="profile-identity-metrics">
          <div><dt>Rang mondial</dt><dd>${Number(ranking.points_rank || ranking.rank || 0) ? `#${Number(ranking.points_rank || ranking.rank)}` : "-"}</dd><small>${Number(ranking.projected_rank || 0) ? `#${Number(ranking.projected_rank)} projeté` : "Projection indisponible"}</small></div>
          <div><dt>Points Circuit</dt><dd>${Number(ranking.score_ref || 0)}</dd><small>4 semaines terminées</small></div>
          <div><dt>Cette semaine</dt><dd>${Number(ranking.score_week || 0)}</dd><small>En cours</small></div>
          <div class="profile-trophy-metric gold"><dt>Tournois gagnés</dt><dd><img src="./assets/icons/trophy-circuit.svg" alt="" aria-hidden="true" />${tournamentWins}</dd></div>
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
        <div class="profile-card-heading"><div><p class="label">Personnage</p><h3>Identité sur le court</h3></div></div>
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
          <span>Adversaire : ${escapeHtml(activity.opponent || "Adversaire")} · Score : ${escapeHtml(activity.score || "En direct")}</span>
        </div>
        ${activity.watchable ? `<button class="small-button profile-watch-button" type="button" data-watch-profile-user="${escapeHtml(user?.id || "")}" data-watch-profile-label="${escapeHtml(activity.type || "Partie en cours")}">VOIR</button>` : ""}
      </section>` : ""}
      <section class="profile-card profile-ranking-card">
        <div class="profile-card-heading"><div><p class="label">Circuit Pro</p><h3>Classement mondial</h3></div></div>
        <div class="profile-player-level" aria-label="Niveau ${circuitLevel.level} sur 6, ${escapeHtml(circuitLevel.label)}">
          <span>Niveau ${circuitLevel.level}</span>
          <strong>${escapeHtml(circuitLevel.label)}</strong>
          <span class="profile-level-stars" title="${circuitLevel.level} étoile${circuitLevel.level > 1 ? "s" : ""}">${"★".repeat(circuitLevel.level)}</span>
        </div>
        <div class="ranking-row current-user"><span class="ranking-position"><strong>${Number(ranking.points_rank || ranking.rank || 0) || "-"}</strong>${Number(ranking.projected_rank || 0) ? `<small class="ranking-projection">(${Number(ranking.projected_rank)})</small>` : ""}</span><strong>${escapeHtml(user?.nickname || "")}</strong><span>${Number(ranking.score_ref || 0)}</span><span>${Number(ranking.score_week || 0)}</span><span>${Number(ranking.score_total || 0)}</span></div>
        <div class="profile-stats-grid">${statRows}</div>
        <button id="profileRankingLinkButton" class="small-button" type="button">Classement général</button>
      </section>
      <section class="profile-card profile-wide profile-results-card">
        <div class="profile-card-heading"><div><p class="label">Carrière</p><h3>Palmarès</h3></div></div>
        ${careerRows}
        ${careerToggle}
      </section>
      ${profile?.viewerIsAdmin ? `<section class="profile-card profile-wide admin-profile-tools">
        <p class="label">Administration du joueur</p>
        <div class="admin-score-periods">${adminScoreRows}</div>
        <label class="admin-score-period admin-weekly-attempts">
          <span>Tentatives utilisées cette semaine</span>
          <input type="number" min="0" max="${Number(profile?.adminScores?.weeklyAttempts?.limit || 5)}" step="1" inputmode="numeric" value="${Number(profile?.adminScores?.weeklyAttempts?.used || 0)}" data-profile-weekly-attempts />
        </label>
        <div class="admin-inline-actions">
          <button id="saveProfileRankingScoresButton" class="primary-button" type="button" data-profile-admin-user="${escapeHtml(user?.id || "")}">Enregistrer points et tentatives</button>
          <button id="resetProfileCareerButton" class="small-button danger-button" type="button" data-profile-admin-user="${escapeHtml(user?.id || "")}">Réinitialiser palmarès et classement</button>
        </div>
      </section>` : ""}
      <section class="profile-card profile-wide profile-confrontations-card">
        <div class="profile-card-heading"><div><p class="label">Rivalités</p><h3>Les adversaires les plus rencontrés</h3></div></div>
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

function toggleProfileCollection(event) {
  const button = event.currentTarget;
  const group = String(button?.dataset.profileToggle || "");
  if (!group || !els.profileContent) return;
  const expanded = button.getAttribute("aria-expanded") !== "true";
  els.profileContent.querySelectorAll(`[data-profile-collapse-group="${group}"]`).forEach((row) => {
    row.classList.toggle("hidden", !expanded);
  });
  button.setAttribute("aria-expanded", String(expanded));
  button.textContent = expanded ? "−" : "+";
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
    SPECTATOR_MODE.matchLabel = `${data.type || "Partie en cours"} · ${data.opponent || "Adversaire"}`;
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

async function resetProfileTournament(event) {
  if (!canAccessAdminFeatures()) return;
  const button = event.currentTarget;
  const userId = button?.dataset.profileAdminUser;
  const competitionId = button?.dataset.resetProfileTournament;
  const season = Number(button?.dataset.resetProfileSeason || 0);
  const week = Number(button?.dataset.resetProfileWeek || 0);
  if (!userId || !competitionId) return;
  if (!window.confirm("Réinitialiser ce tournoi à 0 ? Les points, la sauvegarde et le dernier adversaire seront définitivement effacés.")) return;
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
  if (!userId || !window.confirm("Réinitialiser définitivement le palmarès et les statistiques de classement mondial de ce joueur ?")) return;
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
        <span class="character-choice-check" aria-hidden="true">✓</span>
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
          <p class="label">Personnage sélectionné</p>
          <h2 id="characterPreviewName">${escapeHtml(characterNameFromId(selectedProfileCharacter))}</h2>
          <p>Ce personnage apparaîtra comme votre avatar dans le lobby et représentera votre profil sur le Circuit.</p>
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
          previewImage.alt = button.dataset.profileCharacterName || "Personnage sélectionné";
        }
        if (previewName) previewName.textContent = button.dataset.profileCharacterName || "Personnage sélectionné";
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
  if (!window.confirm("Passer à la semaine suivante du circuit ? Cette action est immédiate.")) return;
  renderAuthState("Passage à la semaine suivante...");
  try {
    await authRequest("/api/admin/circuit/next-week", {});
    await loadCompetitions();
    await loadRanking(1);
    renderAuthState("Semaine suivante activée.");
  } catch (error) {
    renderAuthState(error.message);
  }
}

async function adminRestartCurrentSeason() {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("Relancer la saison en cours ? Les palmarès et calendriers humains de la saison seront remis à zéro, mais les points des 4 dernières semaines seront conservés.")) return;
  renderAuthState("Relance de la saison...");
  try {
    await authRequest("/api/admin/circuit/restart-season", {});
    await loadCompetitions();
    await loadRanking(1);
    renderAuthState("Saison relancée.");
  } catch (error) {
    renderAuthState(error.message);
  }
}

async function adminRestartSeasonOne() {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("RESTART SAISON 1 : réinitialiser la saison, les palmarès et les statistiques mondiales ? Les quatre semaines de référence humaines seront conservées comme historique avant la saison 1.")) return;
  if (!window.confirm("Confirmer une seconde fois le redémarrage complet de la SAISON 1 ?")) return;
  renderAuthState("Redémarrage de la saison 1...");
  try {
    await authRequest("/api/admin/circuit/restart-season-one", {});
    AUTH_STATE.rankingSort = "points";
    await loadCompetitions();
    await loadRanking(1);
    await loadAdminUsers(1);
    renderAuthState("Saison 1 redémarrée.");
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
    if (els.rankingFullList) els.rankingFullList.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
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
    if (els.rankingList) els.rankingList.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
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
    els.weeklyCompetitionsList.innerHTML = '<div class="lobby-empty">Aucune compétition générée.</div>';
    renderCircuitDashboard();
    return;
  }
  const retriesUsed = Number(AUTH_STATE.competitions?.retriesUsed || 0);
  const retryLimit = Number(AUTH_STATE.competitions?.retryLimit || 5);
  const remainingAttempts = Math.max(0, retryLimit - retriesUsed);
  els.weeklyCompetitionsList.innerHTML = `
    <div class="circuit-attempt-banner ${remainingAttempts ? "" : "empty"}">
      <span><strong>${remainingAttempts}</strong> tentative${remainingAttempts > 1 ? "s" : ""} d'amélioration restante${remainingAttempts > 1 ? "s" : ""}</span>
      <small id="weeklyCountdown">${escapeHtml(formatCountdown(AUTH_STATE.competitions?.nextUpdateAt))}</small>
    </div>
    ${competitions.map((competition) => {
      const alreadyPlayed = Object.prototype.hasOwnProperty.call(bestScores, competition.id);
      const singleEntryLeague = competition.eventType === "League"
        || ["Prestige League", "Ultimate League"].includes(competition.level);
      const replayLocked = alreadyPlayed && singleEntryLeague;
      const canReplay = !alreadyPlayed || (!replayLocked && retriesUsed < retryLimit);
      const label = replayLocked ? "Terminé" : alreadyPlayed ? "Rejouer" : "Jouer";
      const replayClass = alreadyPlayed ? "replay-button" : "";
      const saved = savedTournamentProgress(competition.id);
      const performance = bestPerformances[competition.id] || null;
      const performanceOpponent = String(performance?.lastOpponent || "").trim();
      const performanceScore = String(performance?.lastScore || "").trim();
      const performanceMarkup = alreadyPlayed
        ? `<span class="circuit-best-performance">
            <small>Meilleure performance</small>
            <span class="circuit-performance-line"><strong>${escapeHtml(performance?.label || "Résultat enregistré")}</strong><em>${Number(performance?.points ?? bestScores[competition.id] ?? 0)} pts</em></span>
            ${(performanceOpponent || performanceScore) ? `<span class="circuit-performance-detail">${performanceOpponent ? escapeHtml(performanceOpponent) : ""}${performanceOpponent && performanceScore ? " · " : ""}${performanceScore ? escapeHtml(performanceScore) : ""}</span>` : ""}
          </span>`
        : '<span class="circuit-best-performance not-played"><strong>N’A PAS ENCORE PARTICIPÉ</strong></span>';
      const category = String(competition.type || competition.name || "Tournoi");
      const categoryKey = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
      return `
      <article class="weekly-competition circuit-competition-card" data-competition-category="${escapeHtml(categoryKey)}">
        <div class="circuit-competition-head">
          <span class="circuit-competition-category">${escapeHtml(category)}</span>
          <span class="circuit-competition-state ${saved ? "saved" : alreadyPlayed ? "played" : "new"}">${saved ? "Sauvegardé" : replayLocked ? "Participation terminée" : alreadyPlayed ? "Déjà joué" : "À jouer"}</span>
        </div>
        <div class="circuit-competition-copy">
          <h3>${escapeHtml(competition.name)}</h3>
          <span>${escapeHtml(competition.city || "")} · ${escapeHtml(competition.country || "")} ${escapeHtml(competition.flag || "")}</span>
          <div class="circuit-competition-meta">
            <span>${escapeHtml(competition.surfaceLabel)}</span>
            <span>${Number(competition.targetSets || 2)} sets gagnants</span>
            ${singleEntryLeague ? '<span class="single-entry-league-badge">Non rejouable</span>' : ""}
          </div>
        </div>
        <div class="circuit-competition-footer">
          ${performanceMarkup}
          <div class="weekly-competition-actions">
            ${saved ? "" : `<button class="small-button ${replayClass}" type="button" data-start-weekly-competition="${escapeHtml(competition.id)}" ${canReplay ? "" : "disabled"} title="${replayLocked ? "Une seule participation est autorisée pour cette League." : ""}">${label}</button>`}
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
  if (!Number.isFinite(ms) || ms <= 0) return "Prochaine semaine bientôt";
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
  await showTournamentLoadingDialog("Votre tournoi du Circuit Pro est en train d'être chargé.");
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
    renderAuthState("Le Tennis Courts Pro Circuit est réservé aux joueurs Pro.");
    return;
  }
  await showTournamentLoadingDialog("Votre tournoi du Circuit Pro est en train d'être créé.");
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
      renderAuthState("Le tournoi n'a pas pu démarrer. Réessaie depuis le lobby.");
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

function showTournamentLoadingDialog(message = "Le tournoi est en train d'être chargé.", title = "Chargement du tournoi") {
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
  els.lobbySettingsButton?.setAttribute("aria-expanded", String(shouldOpen));
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
    els.adminScreen,
    els.rankingScreen,
    els.circuitInfoScreen,
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
    renderAuthState("Réservé aux joueurs Pro.");
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
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.tutorialModulesScreen?.classList.add("hidden");
  els.newsArchiveScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.friendlyLobbyScreen?.classList.add("hidden");
  els.aiClubHouseScreen?.classList.add("hidden");
  els.gameApp?.classList.remove("hidden");
  window.TennisLightMobileGame?.selectViewForMatch();
}

function hideGameScreen() {
  els.gameApp?.classList.add("hidden");
  els.mobileGameApp?.classList.add("hidden");
  window.TennisLightMobileGame?.clearSelectedView();
}

function showFriendlyLobbyScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  hideGameScreen();
  els.aiClubHouseScreen?.classList.add("hidden");
  els.friendlyLobbyScreen?.classList.remove("hidden");
}

function showAiClubHouseScreen() {
  if (!canAccessProFeatures() && AI_CLUB_HOUSE.format !== "match") AI_CLUB_HOUSE.format = "match";
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.circuitInfoScreen?.classList.add("hidden");
  els.academyInfoScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.friendlyLobbyScreen?.classList.add("hidden");
  hideGameScreen();
  els.aiClubHouseScreen?.classList.remove("hidden");
  renderAiClubHouse();
}

function showRankingScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
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
  hideGameScreen();
  hideLobbySectionScreen();
  els.friendlyLobbyScreen?.classList.add("hidden");
  els.aiClubHouseScreen?.classList.add("hidden");
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
}

function showProfileScreen(userId = null) {
  if (!AUTH_STATE.user) return;
  const previousDestination = visibleScreenDestination();
  if (!["profile", "character", "game"].includes(previousDestination)) PAGE_NAVIGATION_STATE.profileReturn = previousDestination;
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
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
}

function showCircuitInfoScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
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

function showAcademyInfoScreen() {
  els.menuScreen?.classList.add("hidden");
  hideLobbySectionScreen();
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
  if (!canAccessAdminFeatures()) return;
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
    : (tutorialStep()?.final ? "Terminer la leçon" : "Suivant");
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
    state.tutorial.error = tutorialStep()?.error ?? "Ce n'est pas la carte attendue. Regarde la carte indiquée par Coach Ju.";
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
  state.log = module.initialLog ? [...module.initialLog] : ["Tutoriel lancé."];
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
    // Le retour à l’accueil ne doit pas être bloqué par une réponse réseau absente.
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
        ? "Votre compétition amicale a été sauvegardée."
        : readAiClubHouseSave()
          ? "Une sauvegarde existe déjà : cette nouvelle compétition n'a pas remplacé l'ancienne."
          : "La compétition n'a pas pu être sauvegardée.";
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
      <h2 id="returnLobbyTitle">${spectatorExit ? "Quitter le mode spectateur ?" : waitingFriendlyExit ? "Quitter ce CLUB HOUSE ?" : activeFriendlyMatch ? "Retourner au Club House ?" : friendlyTournamentExit ? "Retourner au Club House ?" : "Retourner à l’accueil ?"}</h2>
      <p>${friendlyTournamentExit
        ? spectatorExit
          ? "Vous reviendrez au Club House du tournoi."
          : waitingFriendlyExit
            ? "Vous pourrez rejoindre ce CLUB HOUSE de nouveau tant que le tournoi n'est pas lancé."
            : activeFriendlyMatch
              ? `Quitter cette rencontre peut entraîner un forfait. Elle sera mise en pause et l’espace d’attente du tournoi sera affiché. Vous aurez ${friendlyMatchGraceSeconds} secondes pour la reprendre.`
              : "Vous retrouverez l’espace d’attente et le tableau du tournoi."
        : "La partie en cours sera quittée et l’accueil sera affiché."}</p>
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

function renderAiClubHouse() {
  const proAccess = canAccessProFeatures();
  if (!proAccess && AI_CLUB_HOUSE.format !== "match") AI_CLUB_HOUSE.format = "match";
  AI_CLUB_HOUSE.difficulty = normalizeAiDifficulty(AI_CLUB_HOUSE.difficulty);
  AI_CLUB_HOUSE.bonus = normalizeAiBonusLevel(AI_CLUB_HOUSE.bonus);
  els.aiClubSettingButtons?.forEach((button) => {
    const setting = button.dataset.aiClubSetting;
    const expected = {
      format: AI_CLUB_HOUSE.format,
      sets: String(AI_CLUB_HOUSE.targetSets),
      difficulty: AI_CLUB_HOUSE.difficulty,
      bonus: AI_CLUB_HOUSE.bonus,
      players: AI_CLUB_HOUSE.players,
      distribution: AI_CLUB_HOUSE.distribution,
    }[setting];
    button.classList.toggle("active", button.dataset.aiClubValue === expected);
    button.disabled = button.hasAttribute("data-pro-format") && !proAccess;
  });
  const isMatch = AI_CLUB_HOUSE.format === "match";
  document.querySelectorAll("[data-competition-setting]").forEach((row) => row.classList.toggle("hidden", isMatch));
  els.aiBonusSettingRow?.classList.remove("setting-disabled");
  if (els.aiLevelDescription) {
    els.aiLevelDescription.textContent = AI_DIFFICULTY_DESCRIPTIONS[AI_CLUB_HOUSE.difficulty];
  }
  if (els.aiBonusDescription) {
    els.aiBonusDescription.textContent = AI_BONUS_DESCRIPTIONS[AI_CLUB_HOUSE.bonus];
  }
  if (els.aiClubHouseSummary) {
    const format = AI_CLUB_HOUSE.format === "league" ? "League" : AI_CLUB_HOUSE.format === "classic" ? "Tournoi Classic" : "Match Solo";
    const bonusText = `bonus ${aiBonusLabel(AI_CLUB_HOUSE.bonus).toLowerCase()}`;
    const playersText = AI_CLUB_HOUSE.players === "best" ? "meilleurs joueurs" : "joueurs aléatoires";
    const distributionText = AI_CLUB_HOUSE.distribution === "ranking" ? "répartition selon classement" : "répartition aléatoire";
    els.aiClubHouseSummary.textContent = isMatch
      ? `${AI_CLUB_HOUSE.targetSets} sets gagnants · ${tournamentDifficultyLabel(AI_CLUB_HOUSE.difficulty)}`
      : `${AI_CLUB_HOUSE.targetSets} sets gagnants · ${tournamentDifficultyLabel(AI_CLUB_HOUSE.difficulty)} · ${bonusText} · ${playersText} · ${distributionText}`;
    if (els.aiClubHouseSummaryTitle) els.aiClubHouseSummaryTitle.textContent = format;
  }
  if (els.startAiClubHouseButton) {
    els.startAiClubHouseButton.textContent = isMatch ? "Lancer le match" : AI_CLUB_HOUSE.format === "league" ? "Lancer la League" : "Lancer le tournoi";
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
  // Les journaux d'analyse sont déjà conservés séparément. Les dupliquer dans
  // la sauvegarde pouvait dépasser le quota local après plusieurs rencontres.
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
    // La télémétrie reste dans son stockage dédié et n'est pas nécessaire pour
    // reprendre la compétition au même échange.
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
  showGameScreen();
  applySurfaceBackground(state.tournament?.competitionSurface);
  render();
}

function deleteAiClubHouseSave() {
  if (!readAiClubHouseSave() || !window.confirm("Supprimer définitivement la partie sauvegardée ?")) return;
  localStorage.removeItem(aiClubHouseSaveKey());
  renderAiClubHouse();
}

function updateAiClubHouseSetting(setting, value) {
  if (setting === "format") {
    if (["classic", "league"].includes(value) && !canAccessProFeatures()) return;
    AI_CLUB_HOUSE.format = ["match", "classic", "league"].includes(value) ? value : "match";
    localStorage.setItem("tennisLightAiClubFormat", AI_CLUB_HOUSE.format);
  } else if (setting === "sets") {
    AI_CLUB_HOUSE.targetSets = Number(value) === 3 ? 3 : 2;
    localStorage.setItem("tennisLightAiClubSets", String(AI_CLUB_HOUSE.targetSets));
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
    // Une indisponibilité du profil ne doit pas empêcher le lancement de la partie.
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
  const isMatch = AI_CLUB_HOUSE.format === "match";
  if (!isMatch && !canAccessProFeatures()) {
    showMenuScreen();
    renderAuthState("Réservé aux joueurs Pro.");
    return;
  }
  resetTutorialMode();
  MENU_STATE.espoirResolvedCharacterId = null;
  await showTournamentLoadingDialog(
    isMatch ? "Votre match Solo est en train d'être préparé." : "Votre compétition du Club House est en train d'être créée.",
    isMatch ? "Préparation du match" : "Chargement de la compétition",
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
    };
    try {
      if (isMatch) {
        resetTournament();
        configureSoloOpponent();
        SOLO_AI.difficulty = AI_CLUB_HOUSE.difficulty;
        startMatchMode(AI_CLUB_HOUSE.targetSets, { keepSoloOpponent: true });
      } else if (AI_CLUB_HOUSE.format === "league") {
        startLeagueTournamentMode(AI_CLUB_HOUSE.targetSets, options);
      } else {
        startTournamentMode(AI_CLUB_HOUSE.targetSets, options);
      }
      showGameScreen();
      render();
    } catch (error) {
      resetTournament();
      SOLO_AI.enabled = false;
      showMenuScreen();
      renderAuthState("La partie n'a pas pu démarrer. Vérifie sa configuration puis réessaie.");
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
    renderAuthState("Réservé aux joueurs Pro.");
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
      <span class="online-room-format-icon"><img src="./assets/icons/${tournament.format === "league" ? "LEAGUE.svg" : tournament.format === "match" ? "MATCH.svg" : "trophy-circuit.svg"}" alt="" aria-hidden="true" /></span>
      <div>
        <strong>${escapeHtml(tournament.creatorNickname || "Joueur")} · Partie en ligne</strong>
        <span>CLUB HOUSE ${tournament.id} · ${tournament.participantCount}/${tournament.maxParticipants} connectés · ${tournament.format === "league" ? "LEAGUE" : tournament.format === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE"} · ${Number(tournament.targetSets || 2)} sets · ${tournament.visibility === "private" ? "Privé" : "Public"} · ${tournament.status === "playing" ? "En cours" : "Ouvert"}</span>
      </div>
      <div class="lobby-room-actions">
        ${tournament.canResume
          ? `<button class="small-button friendly-resume-button" type="button" data-resume-friendly-tournament="${tournament.id}">REPRENDRE</button>`
          : tournament.status === "playing" && tournament.canSpectate
          ? `<button class="small-button friendly-spectator-button" type="button" data-spectate-friendly-tournament="${tournament.id}">SPECTATEUR</button>`
          : tournament.status === "playing"
          ? `<span class="online-private-event-badge">ÉVÉNEMENT PRIVÉ</span>`
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
          <strong>${host?.nickname ?? "Joueur"} · ${format}</strong>
          <span>${coach} · Salon ${room.id}</span>
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
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
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
    if (els.lobbyRooms) els.lobbyRooms.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
    return;
  }
  let navigating = false;
  await showTournamentLoadingDialog("Le Club House du tournoi en ligne est en train d'être créé.");
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
    els.lobbyRooms.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message || "Impossible de créer le tournoi.")}</div>`;
  } finally {
    if (!navigating) hideTournamentLoadingDialog();
  }
}

async function joinFriendlyTournament(tournamentId) {
  let navigating = false;
  await showTournamentLoadingDialog("Le tournoi en ligne est en train d'être chargé.");
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
  await showTournamentLoadingDialog("Votre tournoi en ligne est en train d'être chargé.");
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
    MENU_STATE.lobbyNotice = error.message || "Ce tournoi ne peut plus être repris.";
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
  if (!window.confirm("Supprimer ce CLUB HOUSE et éjecter tous les joueurs ?")) return;
  try {
    const response = await fetch(`/api/lobby/friendly-tournaments/${encodeURIComponent(tournamentId)}/admin-delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error("delete failed");
    MENU_STATE.lobbyNotice = "CLUB HOUSE supprimé.";
    await refreshLobbyRooms();
  } catch (error) {
    MENU_STATE.lobbyNotice = "Impossible de supprimer ce CLUB HOUSE.";
    await refreshLobbyRooms();
  }
}

async function adminDeleteLobbyRoom(roomId) {
  if (!canAccessAdminFeatures()) return;
  if (!window.confirm("Supprimer cette partie en ligne et éjecter les joueurs présents ?")) return;
  try {
    const response = await fetch(`/api/lobby/rooms/${encodeURIComponent(roomId)}/admin-delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error("delete failed");
    MENU_STATE.lobbyNotice = "Partie en ligne supprimée.";
    await refreshLobbyRooms();
  } catch (error) {
    MENU_STATE.lobbyNotice = "Impossible de supprimer cette partie.";
    await refreshLobbyRooms();
  }
}

async function createLobbyRoom() {
  if (!canAccessProFeatures()) {
    if (els.lobbyRooms) els.lobbyRooms.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
    return;
  }
  const targetSets = Number(els.onlineFormatSelect?.value || 2);
  let navigating = false;
  await showTournamentLoadingDialog("La partie en ligne est en train d'être créée.", "Chargement de la partie");
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
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Impossible de créer une partie depuis cette version. Lancez la version serveur.</div>';
  } finally {
    if (!navigating) hideTournamentLoadingDialog();
  }
}

async function joinLobbyRoom(roomId) {
  let navigating = false;
  await showTournamentLoadingDialog("La partie en ligne est en train d'être chargée.", "Chargement de la partie");
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
  if (Number(match?.day)) return `Journée ${Number(match.day)}`;
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
  const opponentName = opponentEntry ? tournamentPlayerLabel(opponentEntry) : "Adversaire à venir";
  let remaining = 3;
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop event-transition-backdrop solo-tournament-countdown";
  const begin = () => {
    cancelSoloTournamentCountdown();
    startAction();
  };
  backdrop.innerHTML = `
    <section class="event-transition-panel event-countdown-panel" role="dialog" aria-modal="true" aria-labelledby="soloTournamentCountdownTitle">
      <p class="event-transition-kicker">${escapeHtml(state.tournament.competitionName || "Compétition Solo")}</p>
      <h2 id="soloTournamentCountdownTitle">${escapeHtml(roundLabel)}</h2>
      <div class="event-transition-versus"><strong>${escapeHtml(selectedPlayerName())}</strong><span>contre</span><strong>${escapeHtml(opponentName)}</strong></div>
      <strong class="event-transition-countdown" aria-live="assertive">${remaining}</strong>
      <button class="primary-button" type="button" data-start-event-now>Démarrer</button>
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
      <button class="primary-button" type="button" data-start-friendly-now>Démarrer</button>
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
      <h2 id="friendlyDisconnectTitle">Adversaire déconnecté</h2>
      <p>${escapeHtml(opponent.nickname || "Votre adversaire")} a quitté la partie. Le match reprendra automatiquement s'il revient.</p>
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
    league: payload.format === "league",
    difficulty: payload.difficulty || "normal",
    competitionName: `Événement amical en ligne · ${payload.format === "league" ? "LEAGUE" : payload.format === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE"}`,
    stage: payload.round || "waiting",
    targetSets: Number(payload.targetSets || 2),
    friendlyFormat: payload.format || "classic",
    friendlyDistribution: payload.distribution || "random",
    friendlyBonus: payload.bonus || "none",
    friendlyPlayerSelection: payload.playerSelection || "random",
    friendlyVisibility: payload.visibility === "private" ? "private" : "public",
    friendlySelectionLimit: Number(payload.selectionLimit || (payload.format === "match" ? 2 : 4)),
    friendlySettingsLocked: Boolean(payload.settingsLocked),
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
      <h2 id="friendlyForfeitTitle">QUALIFIÉ PAR FORFAIT</h2>
      <p>${escapeHtml(opponent?.nickname || "Votre adversaire")} est forfait. Vous êtes qualifié pour le tour suivant sans jouer.</p>
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
    state.log.unshift(`${match.label} : reprise de la partie au score ${friendlyLiveScoreText(match).replace(/\s*·\s*EN DIRECT$/i, "")}.`);
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
    state.tournament.stage = match.round;
    state.tournament.currentMatch = match.id;
    state.log.unshift(`${match.label} : session partagée entre ${players[0].nickname} et ${players[1].nickname}.`);
  } else {
    resetSetMatch();
    state.players = players.map((player) => createPlayer(characterNameFromId(player.characterId), player.characterId, player.nickname));
    state.players.forEach((player) => { player.hand = []; });
    state.log = [`${match.label} : reprise de la session partagée entre ${players[0].nickname} et ${players[1].nickname}.`];
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
  if (!match || !state.setMatch?.enabled) return "0/0 · EN DIRECT";
  const scores = tournamentCompletedSetScoresForMatch(match);
  if (!state.setMatch.matchOver && !state.setMatch.setOver && Array.isArray(state.setMatch.score)) {
    const current = [...state.setMatch.score];
    const shouldInvert = !SERVER_SYNC.friendlyMatch && match.playerB === FRIENDLY_TOURNAMENT.entry;
    scores.push(shouldInvert ? [current[1], current[0]] : current);
  }
  return `${formatSetScores(scores) || "0/0"} · EN DIRECT`;
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
    // La partie continue localement si la diffusion est momentanément indisponible.
  }
}

function renderFriendlyLobbyMatchCard(match) {
  const status = match.liveScore && !match.winner ? match.liveScore : match.score || (match.winner ? "Terminé" : "En attente");
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
      <h3>Journée ${day}</h3>
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
  const canStart = !FRIENDLY_TOURNAMENT.isSpectator && FRIENDLY_TOURNAMENT.isCreator && state.tournament.stage === "waiting" && FRIENDLY_TOURNAMENT.canStart;
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
  els.friendlyLobbyContent.innerHTML = `
    <header class="online-room-hero">
      <img src="./assets/MODE-EN-LIGNE.jpg" alt="" aria-hidden="true" />
      <div>
        <p class="label">Club House en ligne</p>
        <h1>${format === "league" ? "League" : format === "match" ? "Match" : "Tournoi Classic"}</h1>
        <p>${participants.length}/4 joueurs connectés · ${targetSets} sets gagnants</p>
      </div>
    </header>
    <div class="friendly-lobby-title clubhouse-room-heading">
      <div>
        <p class="label">CLUB HOUSE · ${escapeHtml(FRIENDLY_TOURNAMENT.id || "")}</p>
        <h2>${FRIENDLY_TOURNAMENT.isSpectator ? "Vue spectateur" : "Configuration et joueurs"}</h2>
        <p>${participants.length}/4 connectés · ${selectedCount}/${selectionLimit} sélectionnés · ${format === "league" ? "LEAGUE" : format === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE"} · ${targetSets} sets gagnants</p>
      </div>
    </div>
    <div class="friendly-lobby-status">${escapeHtml(status)}</div>
    ${renderFriendlyWaitingExperience()}
    <section class="clubhouse-format-section online-room-format-section" aria-labelledby="onlineRoomFormatTitle">
      <div class="clubhouse-section-heading"><div><p class="label">Format</p><h2 id="onlineRoomFormatTitle">Configurez votre Club House</h2></div><span class="clubhouse-friendly-note">Réglages réservés à l'hôte</span></div>
      <div class="clubhouse-format-grid" aria-label="Format du Club House en ligne">
        ${formatCard("match", "Match", "Une rencontre directe entre deux joueurs.", "MATCH.svg")}
        ${formatCard("classic", "Tournoi Classic", "Un tableau à élimination directe.", "trophy-circuit.svg")}
        ${formatCard("league", "League", "Une phase de groupes puis les finales.", "LEAGUE.svg")}
      </div>
    </section>
    <div class="clubhouse-configuration-layout online-room-configuration">
    <section class="friendly-settings-panel clubhouse-settings-card ${settingsLocked ? "locked" : ""}">
      <div class="friendly-setting-row">
        <div><strong>Niveau IA</strong><span>${escapeHtml(AI_DIFFICULTY_DESCRIPTIONS[difficulty] || AI_DIFFICULTY_DESCRIPTIONS.normal)}</span></div>
        <div class="friendly-setting-switch seven-options">
          ${["amateur", "normal", "expert", "champion", "legend", "ranking", "circuit"].map((value) => settingButton("difficulty", value, AI_DIFFICULTY_LABELS[value], difficulty === value)).join("")}
        </div>
      </div>
      <div class="friendly-setting-row">
        <div><strong>Bonus</strong><span>Avantage attribué aux joueurs IA</span></div>
        <div class="friendly-setting-switch four-options">
          ${settingButton("bonus", "none", "SANS", bonus === "none")}
          ${settingButton("bonus", "ascendant", "ASCENDANT", bonus === "ascendant")}
          ${settingButton("bonus", "domination", "DOMINATION", bonus === "domination")}
          ${settingButton("bonus", "nemesis", "BÊTE NOIRE", bonus === "nemesis")}
        </div>
      </div>
      <div class="friendly-setting-row">
        <div><strong>Joueurs</strong><span>Choix des joueurs IA qui complètent l'événement</span></div>
        <div class="friendly-setting-switch">
          ${settingButton("playerSelection", "random", "ALÉATOIRES", playerSelection === "random")}
          ${settingButton("playerSelection", "best", "MEILLEURS", playerSelection === "best")}
        </div>
      </div>
      <div class="friendly-setting-row">
        <div><strong>Format des sets</strong><span>Sets gagnants par rencontre</span></div>
        <div class="friendly-setting-switch">
          ${settingButton("targetSets", "2", "2 SETS", targetSets === 2)}
          ${settingButton("targetSets", "3", "3 SETS", targetSets === 3)}
        </div>
      </div>
      <div class="friendly-setting-row">
        <div><strong>Répartition des joueurs</strong><span>Placement des 8 participants</span></div>
        <div class="friendly-setting-switch three-options">
          ${settingButton("distribution", "random", "ALÉATOIRE", distribution === "random")}
          ${settingButton("distribution", "ranking", "CLASSEMENT MONDIAL", distribution === "ranking")}
          ${settingButton("distribution", "separated", "JOUEURS SÉPARÉS", distribution === "separated")}
        </div>
      </div>
    </section>
    <aside class="clubhouse-summary-card online-room-summary-card">
      <p class="label">Votre Club House</p>
      <h2>${format === "league" ? "League" : format === "match" ? "Match en ligne" : "Tournoi Classic"}</h2>
      <div class="clubhouse-summary-text"><strong>${participants.length}/4 joueurs connectés</strong><span>${targetSets} sets gagnants · ${AI_DIFFICULTY_LABELS[difficulty]} · ${AI_BONUS_LABELS[bonus]}</span><span>Répartition : ${distribution === "ranking" ? "classement mondial" : distribution === "separated" ? "joueurs séparés" : "aléatoire"}</span></div>
      ${FRIENDLY_TOURNAMENT.resumableMatch && !FRIENDLY_TOURNAMENT.isSpectator ? `<button class="small-button friendly-clubhouse-resume-button" type="button" data-resume-friendly-match>REPRENDRE MON MATCH</button>` : ""}
      ${FRIENDLY_TOURNAMENT.isSpectator || state.tournament.stage !== "waiting" ? "" : `<div class="friendly-start-selection-count"><strong>${selectedCount}</strong><span>joueur${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}</span></div><button class="primary-button friendly-lobby-start-button" type="button" data-start-friendly-tournament ${startDisabled ? "disabled" : ""}>LANCER L’ÉVÉNEMENT</button>`}
      <button class="small-button danger-button friendly-lobby-exit-button" type="button" data-leave-friendly-tournament>Sortir</button>
      ${!FRIENDLY_TOURNAMENT.isSpectator && FRIENDLY_TOURNAMENT.isCreator && state.tournament.stage === "complete" ? `<button class="primary-button friendly-new-event-button" type="button" data-new-friendly-event>NOUVEL ÉVÉNEMENT</button>` : ""}
    </aside>
    </div>
    <section>
      <p class="label">Joueurs humains</p>
      <div class="friendly-player-grid">
        ${participants.map((participant) => `
          <article class="friendly-player-card ${participant.selected ? "selected" : ""} ${FRIENDLY_TOURNAMENT.isCreator && !settingsLocked ? "selectable" : ""}" ${FRIENDLY_TOURNAMENT.isCreator && !settingsLocked ? `data-select-friendly-participant="${escapeHtml(participant.id)}" data-selected="${participant.selected ? "true" : "false"}" role="button" tabindex="0"` : ""}>
            <div class="friendly-player-identity">
              ${participant.selected ? `<img class="friendly-selected-icon" src="./assets/icons/VALID.svg" alt="Sélectionné" />` : ""}
              <div class="friendly-player-copy">
                <strong class="friendly-player-name">${escapeHtml(participant.nickname || "Joueur")}${participant.isCreator ? " · Créateur" : ""}</strong>
                <span>${escapeHtml(characterNameFromId(participant.characterId))}${participant.selected ? " · Prêt à jouer" : " · En attente"}${participant.forfeited ? " · Forfait définitif" : participant.eliminated ? " · Éliminé" : participant.away ? " · Absent temporairement" : ""}</span>
              </div>
            </div>
            ${FRIENDLY_TOURNAMENT.isCreator && !settingsLocked && participant.id !== FRIENDLY_TOURNAMENT.participantId ? `<button class="small-button danger-button friendly-kick-button" type="button" data-kick-friendly-participant="${escapeHtml(participant.id)}" data-kick-friendly-nickname="${escapeHtml(participant.nickname || "Joueur")}">EXCLURE</button>` : ""}
          </article>
        `).join("")}
      </div>
    </section>
    <section class="friendly-visibility-section">
      <div>
        <p class="label">Confidentialité</p>
        <h2>Événement public ou privé</h2>
        <p>${visibility === "private" ? "Seuls les joueurs validés peuvent regarder les rencontres." : "Les autres joueurs peuvent suivre les rencontres en spectateur."}</p>
      </div>
      <div class="friendly-setting-switch friendly-visibility-switch" aria-label="Confidentialité de l’événement">
        ${settingButton("visibility", "public", "PUBLIC", visibility === "public")}
        ${settingButton("visibility", "private", "PRIVÉ", visibility === "private")}
      </div>
    </section>
    ${leagueGroupMarkup}
    ${format === "league" ? renderFriendlyLeagueSchedule(matches) : ""}
    ${matches.length && format !== "league" ? `
      <section>
        <p class="label">Tableau CLASSIC</p>
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
  if (setting === "format") next.format = ["match", "classic", "league"].includes(value) ? value : "match";
  if (setting === "targetSets") next.targetSets = Number(value) === 3 ? 3 : 2;
  if (setting === "distribution") next.distribution = ["random", "ranking", "separated"].includes(value) ? value : "random";
  if (setting === "difficulty") next.difficulty = AI_DIFFICULTIES.includes(value) ? value : "normal";
  if (setting === "bonus") next.bonus = ["none", "ascendant", "domination", "nemesis"].includes(value) ? value : "none";
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
    state.log.unshift("La configuration du tournoi n'a pas pu être modifiée.");
  }
}

async function createNewFriendlyEventFromClubHouse() {
  if (!FRIENDLY_TOURNAMENT.enabled || !FRIENDLY_TOURNAMENT.isCreator || state.tournament?.stage !== "complete") return;
  const confirmed = await showEventConfirmDialog({
    kicker: "Club House en ligne",
    title: "Préparer un nouvel événement ?",
    message: "Le tableau terminé sera remplacé par une nouvelle configuration avec les joueurs encore présents dans le Club House.",
    highlight: "Les réglages seront de nouveau modifiables",
    confirmLabel: "NOUVEL ÉVÉNEMENT",
  });
  if (!confirmed) return;
  await showTournamentLoadingDialog("Le nouveau Club House est en train d'être préparé.", "Nouvel événement");
  try {
    const response = await fetch(`/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/new-event`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ participantId: FRIENDLY_TOURNAMENT.participantId, token: FRIENDLY_TOURNAMENT.token }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Le nouvel événement n'a pas pu être préparé.");
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
    MENU_STATE.lobbyNotice = error.message || "Le nouvel événement n'a pas pu être préparé.";
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
    if (!response.ok) throw new Error(data.error || "Sélection impossible.");
    applyFriendlyTournamentState(data.tournament, null);
  } catch (error) {
    state.log.unshift(error.message || "Sélection impossible.");
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
  const finalScore = String(match.score || SPECTATOR_MODE.liveScore || "Score indisponible").replace(/\s*·\s*EN DIRECT\s*$/i, "");
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
  if (matchEnded) MENU_STATE.lobbyNotice = "Le match regardé est terminé.";
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
      ? `Tournoi terminé. Vainqueur : ${tournamentPlayerLabel(state.tournament.championCharacterId)}.`
      : "Mode spectateur : consultez les scores et ouvrez les matchs humains disponibles avec VOIR.";
  }
  if (state.tournament.stage === "waiting") {
    if (FRIENDLY_TOURNAMENT.isCreator) {
      const selectedCount = state.tournament.friendlyParticipants.filter((participant) => participant.selected).length;
      return selectedCount
        ? `${selectedCount} joueur${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}. Tu peux lancer l'événement : l'IA complètera les places libres.`
        : "Sélectionne au moins un pseudo pour lancer l'événement.";
    }
    return "En attente de la sélection et du lancement par l'hôte du CLUB HOUSE.";
  }
  if (state.tournament.stage === "complete") {
    return `Tournoi terminé. Vainqueur : ${tournamentPlayerLabel(state.tournament.championCharacterId)}.`;
  }
  if (friendlyPlayerStillQualified()) return "Attente de la fin des rencontres avant le début du tour suivant.";
  return "Ton parcours est terminé. Tu peux suivre la suite du tournoi depuis le CLUB HOUSE.";
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
        <h2>${qualified ? "Préparation du prochain tour" : "La compétition continue"}</h2>
        <p>${qualified ? "Les autres rencontres se terminent. Votre prochain match apparaîtra automatiquement." : "Votre parcours est terminé, mais vous pouvez suivre les scores depuis le Club House."}</p>
      </div>
      <strong>${completed}/${total || "–"}<span>matchs terminés</span></strong>
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
      MENU_STATE.lobbyNotice = "LE CLUB HOUSE A ÉTÉ FERMÉ";
      resetTournament();
      showMenuScreen();
      return;
    }
    if (response.status === 403) {
      const data = await response.json().catch(() => ({}));
      if (data.kicked) {
        window.clearInterval(FRIENDLY_TOURNAMENT.pollTimer);
        resetFriendlyTournamentConnection();
        MENU_STATE.lobbyNotice = "VOUS AVEZ ÉTÉ EXCLU DU CLUB HOUSE";
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
  if (!FRIENDLY_TOURNAMENT.canStart) {
    renderFriendlyLobbyScreen();
    return;
  }
  const friendlyFormat = state.tournament?.friendlyFormat || "match";
  const formatLabel = friendlyFormat === "league" ? "LEAGUE" : friendlyFormat === "match" ? "MATCH AMICAL" : "TOURNOI CLASSIQUE";
  const setsLabel = Number(state.tournament?.targetSets || 2);
  const selectedCount = state.tournament?.friendlyParticipants?.filter((participant) => participant.selected).length || 0;
  const confirmed = await showEventConfirmDialog({
    kicker: "Club House en ligne",
    title: `Lancer ${formatLabel} ?`,
    message: `L’événement se jouera en ${setsLabel} sets gagnants. La configuration sera ensuite verrouillée.`,
    highlight: `${selectedCount} joueur${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`,
    confirmLabel: "LANCER L’ÉVÉNEMENT",
  });
  if (!confirmed) return;
  await showTournamentLoadingDialog("Votre événement en ligne est en train d'être créé.");
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
    MENU_STATE.lobbyNotice = "Vous avez quitté le mode spectateur.";
    resetTournament();
    if (destination === "online") showLobbySection("online");
    else showMenuScreen();
    return;
  }
  const waitingRoomExit = state.tournament?.stage === "waiting";
  const confirmationText = waitingRoomExit
    ? "Quitter ce CLUB HOUSE ? Vous pourrez le rejoindre de nouveau tant que le tournoi n'est pas lancé."
    : "Quitter ce tournoi peut entraîner un forfait. Vous aurez 20 secondes pour reprendre votre match depuis le mode en ligne ou le Club House.";
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
      ? "Vous avez quitté le CLUB HOUSE. Vous pouvez le rejoindre de nouveau tant que le tournoi reste ouvert."
      : leaveResult?.inMatch
        ? `Match interrompu. Utilisez REPRENDRE dans les ${Number(leaveResult.graceSeconds || 20)} secondes pour éviter le forfait.`
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
  FRIENDLY_TOURNAMENT.waitingForNextRound = false;
  FRIENDLY_TOURNAMENT.readyRound = null;
  FRIENDLY_TOURNAMENT.forfeitDialogOpen = false;
  FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = false;
  FRIENDLY_TOURNAMENT.resumableMatch = null;
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
    state.log.unshift("Résultat non envoyé au tournoi amical.");
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
    power: 0,
    hand: [],
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
  if (["admin", "pro_plus"].includes(currentUserRole())) {
    const stored = readStoredJson(ACTION_LOG_STORAGE_KEY, []);
    stored.push(entry);
    writeStoredJson(ACTION_LOG_STORAGE_KEY, stored.slice(-5000));
  }
  recordHumanMatchAction(entry);
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
      localStorage.setItem(HUMAN_MATCH_LOG_STORAGE_KEY, JSON.stringify(merged.slice(0, limit)));
      break;
    } catch (error) {
      // Réduit progressivement l'historique si le quota local est atteint.
    }
  }
}

function getStoredHumanMatchLogs() {
  return readStoredJson(HUMAN_MATCH_LOG_STORAGE_KEY, []);
}

async function uploadHumanMatchTelemetry(session) {
  if (!AUTH_STATE.user || !session?.matchId || HUMAN_MATCH_TELEMETRY.uploadedIds.has(session.matchId)) return;
  HUMAN_MATCH_TELEMETRY.uploadedIds.add(session.matchId);
  try {
    const response = await fetch("/api/human-match-logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ session }),
    });
    if (!response.ok) throw new Error("telemetry upload failed");
  } catch (error) {
    HUMAN_MATCH_TELEMETRY.uploadedIds.delete(session.matchId);
  }
}

async function uploadPendingHumanMatchLogs() {
  if (!AUTH_STATE.user) return;
  const pending = getStoredHumanMatchLogs()
    .filter((session) => session.status === "completed")
    .slice(0, 20);
  for (const session of pending) {
    await uploadHumanMatchTelemetry(session);
  }
}

function formatPermanentBonusStats(bonus) {
  const stats = [
    Number(bonus?.power || 0) ? `+${Number(bonus.power)} puissance sur les Coups` : "",
    Number(bonus?.precision || 0) ? `+${Number(bonus.precision)} précision` : "",
    Number(bonus?.placement || 0) ? `+${Number(bonus.placement)} placement` : "",
  ].filter(Boolean);
  return stats.length ? stats.join(" / ") : null;
}

function permanentBonusLogLine(player) {
  const bonuses = [...(player.surfaceBonuses ?? []), ...(player.permanentBonuses ?? []), ...(player.temporaryBonuses ?? [])]
    .filter((bonus, index, entries) => bonus && entries.findIndex((entry) => (
      String(entry?.id || entry?.label || "") === String(bonus.id || bonus.label || "")
    )) === index);
  if (!bonuses.length) return `Bonus de ${displayPlayerName(player)} : aucun.`;
  const details = bonuses.map((bonus) => {
    const stats = formatPermanentBonusStats(bonus);
    return stats ? `${bonus.label} (${stats})` : bonus.label;
  }).join(" ; ");
  return `Bonus de ${displayPlayerName(player)} : ${details}.`;
}

function exportLogsFile() {
  if (!canAccessAdminFeatures()) return;
  const detailedActions = mergeLogEntries(readStoredJson(ACTION_LOG_STORAGE_KEY, []), state.actionLog ?? []);
  const exchangeResults = getStoredMatchLogs();
  const payload = {
    exportedAt: new Date().toISOString(),
    game: "Tennis Courts Academy",
    version: GAME_VERSION,
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
  downloadJsonFile(payload, "tennis-courts-academy-logs");
}

function downloadJsonFile(payload, prefix) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `${prefix}-${stamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportHumanMatchLogsFile() {
  if (!canAccessAdminFeatures()) return;
  const localMatches = getStoredHumanMatchLogs();
  const activeMatch = HUMAN_MATCH_TELEMETRY.active
    || readStoredJson(ACTIVE_HUMAN_MATCH_LOG_STORAGE_KEY, null);
  let serverMatches = [];
  if (AUTH_STATE.user) {
    try {
      const endpoint = canAccessAdminFeatures()
        ? "/api/admin/human-match-logs?limit=500"
        : "/api/human-match-logs?limit=100";
      const response = await fetch(endpoint);
      if (response.ok) {
        const payload = await response.json();
        serverMatches = Array.isArray(payload.matches) ? payload.matches : [];
      }
    } catch (error) {
      // L'export local reste disponible si le serveur n'est pas joignable.
    }
  }
  const merged = new Map();
  for (const match of [...serverMatches, ...localMatches, ...(activeMatch ? [activeMatch] : [])]) {
    if (!match?.matchId) continue;
    const observerId = match.observerUser?.id || match.observerUserId || "";
    merged.set(`${match.matchId}:${observerId}`, match);
  }
  const matches = [...merged.values()].sort((a, b) => (
    String(b.completedAt || b.updatedAt || b.startedAt).localeCompare(String(a.completedAt || a.updatedAt || a.startedAt))
  ));
  const completed = matches.filter((match) => match.status === "completed");
  const payload = {
    exportedAt: new Date().toISOString(),
    game: "Tennis Courts Academy",
    version: GAME_VERSION,
    schemaVersion: HUMAN_MATCH_LOG_SCHEMA_VERSION,
    description: "Parties impliquant au moins un joueur humain, regroupées par match complet.",
    scope: canAccessAdminFeatures() ? "administration et navigateur local" : "joueur connecté",
    summary: {
      matchCount: matches.length,
      completedMatchCount: completed.length,
      incompleteMatchCount: matches.length - completed.length,
      circuitMatchCount: matches.filter((match) => match.context?.type === "circuit-ai").length,
      humanVsHumanMatchCount: matches.filter((match) => match.participants?.every((participant) => participant.type === "human")).length,
      humanVsAiMatchCount: matches.filter((match) => match.participants?.some((participant) => participant.type === "ai")).length,
    },
    matches,
  };
  downloadJsonFile(payload, "tennis-courts-human-matches-v3.6");
}

function emptyMomentumState() {
  return [
    { consecutiveWins: 0, activeBonuses: [], motivationResolved: false, ascendantResolved: false, permanentAwards: [] },
    { consecutiveWins: 0, activeBonuses: [], motivationResolved: false, ascendantResolved: false, permanentAwards: [] },
  ];
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
    momentum: emptyMomentumState(),
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
    HUMAN_MATCH_TELEMETRY.forceNew = true;
  }
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  window.clearTimeout(SOLO_AI.timer);
  window.clearTimeout(SOLO_AI.nudgeTimer);
  window.clearTimeout(SOLO_AI.nudgeAutoTimer);
  window.clearTimeout(SOLO_AI.watchdogTimer);
  SOLO_AI.nudgeVisible = false;
  SOLO_AI.nudgeWatchedTurn = null;
  SOLO_AI.recoveryTurnKey = null;
  SOLO_AI.recoveryCount = 0;
  const deck = shuffle(CARD_LIBRARY.map(cloneCard));
  const profiles = SERVER_SYNC.enabled
    ? [onlineProfileForSeat(0), onlineProfileForSeat(1)]
    : [null, null];
  const humanCharacterId = selectedCharacterId();
  const aiCharacterId = SOLO_AI.characterId ?? randomAiCharacterId();
  state.players = SERVER_SYNC.enabled
    ? profiles.map((profile) => createPlayer(profile.name, profile.characterId, profile.nickname))
    : [
      createPlayer(characterNameFromId(humanCharacterId), humanCharacterId, state.tournament?.humanNickname || nicknameValue()),
      createPlayer(characterNameFromId(aiCharacterId), aiCharacterId, characterNameFromId(aiCharacterId)),
    ];
  if (SERVER_SYNC.enabled) {
    state.players.forEach((player, playerIndex) => {
      player.worldRank = Number(profiles[playerIndex]?.worldRank || 0) || null;
    });
  }
  state.players.forEach((player, playerIndex) => {
    const tournamentEntry = state.tournament.active && playerIndex === 0
      ? HUMAN_TOURNAMENT_ENTRY
      : player.characterId;
    const humanInProCircuit = state.tournament.active
      && state.tournament.difficulty === "circuit"
      && tournamentEntry === HUMAN_TOURNAMENT_ENTRY;
    const assignedSurfaceBonuses = state.tournament.active && !humanInProCircuit && state.tournament.surfaceBonuses
      ? state.tournament.surfaceBonuses[tournamentEntry] ?? null
      : null;
    player.surfaceBonuses = Array.isArray(assignedSurfaceBonuses)
      ? cloneData(assignedSurfaceBonuses)
      : assignedSurfaceBonuses
        ? [cloneData(assignedSurfaceBonuses)]
        : [];
    player.surfaceBonus = player.surfaceBonuses[0] ?? null;
    player.permanentBonuses = state.tournament.active && !humanInProCircuit && state.tournament.permanentBonuses
      ? cloneData(state.tournament.permanentBonuses[tournamentEntry] ?? [])
      : [];
    player.permanentBonuses.push(...cloneData(state.setMatch.momentum?.[playerIndex]?.permanentAwards || []));
    player.worldRank = state.tournament.active
      ? tournamentWorldRankForEntry(tournamentEntry)
      : null;
    player.temporaryBonuses = cloneData(state.setMatch.momentum?.[playerIndex]?.activeBonuses || []);
  });
  applyMotivationBonus();
  applyHumanAscendantBonus();
  state.players[0].hand = deck.splice(0, HAND_SIZE);
  state.players[1].hand = deck.splice(0, HAND_SIZE);
  state.deck = deck;
  state.discardedCards = [];
  state.server = serverOverride ?? (Math.random() < 0.5 ? 0 : 1);
  state.activePlayer = state.server;
  state.lastCard = null;
  state.boostAvailableFor = null;
  state.mandatoryPlacement = false;
  state.mandatoryPlacementReason = null;
  state.mandatoryPlacementSourceUid = null;
  state.openingServePlayed = false;
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
  state.revealAiCards = false;
  window.clearInterval(opponentHandRevealTimer);
  opponentHandRevealTimer = null;
  state.opponentHandReveal = null;
  document.querySelector(".opponent-hand-reveal-controls")?.remove();
  state.actionLog = [];
  if (state.setMatch.enabled) {
    state.setMatch.exchangeNumber += 1;
    state.setMatch.previousServer = state.server;
    state.setMatch.decisiveExchange = isDecisiveSetScore(state.setMatch.score);
  }
  const setText = state.setMatch.enabled ? ` Set ${state.setMatch.score[0]}/${state.setMatch.score[1]}.` : "";
  const decisiveText = state.setMatch.decisiveExchange ? " Échange décisif." : "";
  state.log = [`${playerName(state.server)} sert. L'échange commence.${setText}${decisiveText}`];
  const shouldLogPermanentBonuses = !state.setMatch.enabled || state.setMatch.exchangeNumber <= 1;
  if (shouldLogPermanentBonuses) {
    state.log.unshift(permanentBonusLogLine(state.players[1]));
    state.log.unshift(permanentBonusLogLine(state.players[0]));
  }
  if (SOLO_AI.enabled) {
    SOLO_AI.style = chooseSoloAIStyle();
    initializeSoloAiExchangeStrategy(SOLO_AI.playerIndex);
  }
  recordAction("exchange_start", {
    playerIndex: state.server,
    playerName: playerName(state.server),
    players: state.players.map(playerLogInfo),
    deckCount: state.deck.length,
    constraints: constraintsLogInfo(),
    aiAttitude: SOLO_AI.enabled ? SOLO_AI.attitude : null,
    aiAttitudeReason: SOLO_AI.enabled ? SOLO_AI.attitudeReason : null,
  });
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
  "discardedCards",
  "activePlayer",
  "server",
  "lastCard",
  "boostAvailableFor",
  "mandatoryPlacement",
  "mandatoryPlacementReason",
  "mandatoryPlacementSourceUid",
  "openingServePlayed",
  "returnServiceRestrictionFor",
  "returnServiceRestrictionSpent",
  "turnPlacement",
  "turnEffectPlacement",
  "turnHasEffect",
  "turnIgnoresPlacement",
  "turnCannotOpenBoost",
  "turnPlayedCards",
  "latestPlayedCard",
  "gameOver",
  "log",
  "pendingBoost",
  "pendingEffectChoice",
  "pendingCoachChoice",
  "pendingRemoveChoice",
  "pendingEndTurnAfterChoice",
  "effectNotice",
  "resultInfo",
  "revealAiCards",
  "opponentHandReveal",
  "tournament",
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
  const friendlyIdentity = SERVER_SYNC.friendlyMatch ? {
    humanEntry: FRIENDLY_TOURNAMENT.entry,
    humanCharacterId: friendlyEntryCharacterId(FRIENDLY_TOURNAMENT.entry),
    friendlyParticipants: state.tournament?.friendlyParticipants,
    friendlyEntries: state.tournament?.friendlyEntries,
  } : null;
  SERVER_SYNC.applyingRemote = true;
  for (const key of SYNC_STATE_KEYS) {
    if (remoteState && Object.prototype.hasOwnProperty.call(remoteState, key)) {
      state[key] = cloneData(remoteState[key]);
    }
  }
  if (friendlyIdentity && state.tournament) {
    state.tournament.humanEntry = friendlyIdentity.humanEntry;
    state.tournament.humanCharacterId = friendlyIdentity.humanCharacterId;
    state.tournament.friendlyParticipants = friendlyIdentity.friendlyParticipants;
    state.tournament.friendlyEntries = friendlyIdentity.friendlyEntries;
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
  return displayPlayerName(state.players[index]);
}

function frenchOrdinalRank(rank) {
  const value = Number(rank || 0);
  if (!value) return "Non classé";
  return value === 1 ? "1er" : `${value}e`;
}

function currentOpponentConfrontationStatus() {
  if (!state.tournament.active || !SOLO_AI.enabled) return null;
  const opponent = state.players?.[SOLO_AI.playerIndex];
  const profile = AUTH_STATE.profileUserId === authenticatedUserId() ? AUTH_STATE.profile : null;
  const row = (profile?.aiResults || []).find((result) => (
    String(result.ai_character_id || result.aiCharacterId || "") === String(opponent?.characterId || "")
  ));
  if (!row) return null;
  return confrontationStatus(Number(row.wins || 0), Number(row.losses || 0));
}

function closeConfrontationIntro() {
  window.clearInterval(confrontationIntroTimer);
  confrontationIntroTimer = null;
  confrontationIntroSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  confrontationIntroSequenceTimers = [];
  confrontationIntroActive = false;
  document.querySelector(".confrontation-intro-backdrop")?.remove();
  maybeRunSoloAI();
}

function confrontationPlayerCardMarkup(player, playerIndex) {
  const image = PROFILE_CHARACTER_IMAGES[player?.characterId]
    || CHARACTER_IMAGES[player?.characterId]?.[0]
    || CHARACTER_IMAGES.coachUnknown[0];
  const tournamentEntry = playerIndex === 0 ? HUMAN_TOURNAMENT_ENTRY : player?.characterId;
  const rank = player?.worldRank || tournamentWorldRankForEntry(tournamentEntry);
  const isHuman = SERVER_SYNC.enabled || !SOLO_AI.enabled || playerIndex !== SOLO_AI.playerIndex;
  const participantName = isHuman
    ? player?.nickname || (playerIndex === 0 ? state.tournament?.humanNickname : null) || AUTH_STATE.user?.nickname || player?.name
    : player?.name;
  return `
    <article class="confrontation-intro-player confrontation-sequence-item" data-confrontation-stage>
      <div class="confrontation-player-card-frame">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(player?.name || "Joueur")}" />
      </div>
      <div class="confrontation-player-name">
        <strong>${escapeHtml(participantName || "Joueur")}</strong>
        ${aiIntelligenceBadgeMarkup(tournamentEntry)}
      </div>
      <span class="confrontation-player-rank confrontation-sequence-item" data-confrontation-stage>${escapeHtml(frenchOrdinalRank(rank))}</span>
    </article>
  `;
}

function confrontationEventTypeLabel() {
  if (state.tournament.weekly) return "Circuit Pro";
  if (state.tournament.friendly && state.tournament.league) return "League amicale";
  if (state.tournament.friendly) return "Tournoi amical";
  if (state.tournament.league) return "League";
  if (state.tournament.active) return "Tournoi Classic";
  return "Match amical";
}

function showConfrontationIntro() {
  if (state.tutorial.active || !state.players?.[0] || !state.players?.[1]) {
    confrontationIntroActive = false;
    return;
  }
  document.querySelector(".confrontation-intro-backdrop")?.remove();
  window.clearInterval(confrontationIntroTimer);
  confrontationIntroSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  confrontationIntroSequenceTimers = [];
  confrontationIntroTimer = null;
  confrontationIntroActive = true;
  const eventType = confrontationEventTypeLabel();
  const eventName = state.tournament.active ? state.tournament.competitionName || eventType : "Rencontre amicale";
  const location = state.tournament.weekly
    ? [state.tournament.competitionCity, state.tournament.competitionCountry, state.tournament.competitionFlag].filter(Boolean).join(" · ")
    : "";
  const roundLabel = state.tournament.active ? humanTournamentRoundLabel() || tournamentStageLabel() : state.setMatch.enabled ? "Match" : "Échange";
  const backdrop = document.createElement("div");
  backdrop.className = "confrontation-intro-backdrop";
  backdrop.innerHTML = `
    <section class="confrontation-intro" role="dialog" aria-modal="true" aria-label="Présentation de la confrontation">
      <div class="confrontation-event-glow" aria-hidden="true"></div>
      <header class="confrontation-intro-event ${location ? "has-location" : "no-location"}">
        <p class="confrontation-intro-type confrontation-sequence-item" data-confrontation-stage><span>Événement</span><strong>${escapeHtml(eventType)}</strong><small>${escapeHtml(eventName)}</small></p>
        ${location ? `<p class="confrontation-intro-location confrontation-sequence-item" data-confrontation-stage><span>Lieu</span><strong>${escapeHtml(location)}</strong></p>` : ""}
        <p class="confrontation-intro-round confrontation-sequence-item" data-confrontation-stage><span>Tour</span><strong>${escapeHtml(roundLabel)}</strong></p>
      </header>
      <div class="confrontation-intro-versus">
        ${confrontationPlayerCardMarkup(state.players[0], 0)}
        <div class="confrontation-versus-mark" aria-hidden="true"><span>VS</span></div>
        ${confrontationPlayerCardMarkup(state.players[1], 1)}
      </div>
      <div class="confrontation-countdown-shell" data-confrontation-countdown-shell aria-hidden="true">
        <div class="confrontation-intro-countdown" aria-live="polite">
          <strong data-confrontation-countdown>5</strong>
        </div>
        <button class="primary-button confrontation-start-button" type="button" data-start-confrontation>Démarrer</button>
      </div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelector("[data-start-confrontation]")?.addEventListener("click", closeConfrontationIntro);
  const sequenceItems = [...backdrop.querySelectorAll("[data-confrontation-stage]")];
  const sequenceDuration = 3_000;
  sequenceItems.forEach((item, index) => {
    const delay = sequenceItems.length <= 1 ? 0 : Math.round((index / sequenceItems.length) * 2_800);
    confrontationIntroSequenceTimers.push(window.setTimeout(() => item.classList.add("revealed"), delay));
  });
  confrontationIntroSequenceTimers.push(window.setTimeout(() => {
    const countdownShell = backdrop.querySelector("[data-confrontation-countdown-shell]");
    countdownShell?.classList.add("revealed");
    countdownShell?.setAttribute("aria-hidden", "false");
    const expiresAt = Date.now() + 5_000;
    confrontationIntroTimer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      const countdown = backdrop.querySelector("[data-confrontation-countdown]");
      if (countdown) countdown.textContent = String(remaining);
      if (remaining <= 0) closeConfrontationIntro();
    }, 100);
  }, sequenceDuration));
}

function queueConfrontationIntro() {
  window.clearInterval(confrontationIntroTimer);
  confrontationIntroSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  confrontationIntroSequenceTimers = [];
  if (state.tutorial.active || !state.players?.[0] || !state.players?.[1]) {
    confrontationIntroActive = false;
    return;
  }
  confrontationIntroActive = true;
  confrontationIntroTimer = window.setTimeout(showConfrontationIntro, 0);
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
  if (SPECTATOR_MODE.enabled) return false;
  if (SERVER_SYNC.enabled) return SERVER_SYNC.ready && onlineRoomReady() && playerIndex === SERVER_SYNC.seat;
  if (SOLO_AI.enabled) return playerIndex !== SOLO_AI.playerIndex || (playerIndex === SOLO_AI.playerIndex && SOLO_AI.executing);
  return true;
}

function surfaceBonusesForPlayer(player) {
  const assigned = player?.surfaceBonuses?.length
    ? player.surfaceBonuses
    : player?.surfaceBonus ? [player.surfaceBonus] : [];
  const dynamic = [...(player?.permanentBonuses || []), ...(player?.temporaryBonuses || [])]
    .filter((bonus) => bonus?.surface || bonus?.sourceBonusId);
  return [...assigned, ...dynamic].map((bonus) => (
    bonus.sourceBonusId ? { ...bonus, id: bonus.sourceBonusId } : bonus
  ));
}

function playerHasSurfaceBonus(player, bonusId) {
  return surfaceBonusesForPlayer(player).some((bonus) => bonus.id === bonusId);
}

function effectiveCost(player, card) {
  const remiseDiscount = isRemise(card) && playerHasSurfaceBonus(player, "grassCheapRemise") ? 1 : 0;
  return isRemise(card)
    ? Math.max(0, card.cost - remiseDiscount)
    : Math.max(0, card.cost - player.nextDiscount + (player.nextExtraCost ?? 0));
}

function addNextPrecisionBonus(player, value, sourceUid = null) {
  player.nextPrecisionSources = player.nextPrecisionSources ?? [];
  player.nextPrecisionBonus += value;
  if (sourceUid) player.nextPrecisionSources.push({ sourceUid, value });
}

function addNextPlacementBonus(player, value, sourceUid = null) {
  player.nextPlacementSources = player.nextPlacementSources ?? [];
  player.nextPlacementBonus += value;
  if (sourceUid) player.nextPlacementSources.push({ sourceUid, value });
}

function addNextAnyPlacementBonus(player, value, sourceUid = null) {
  player.nextAnyPlacementSources = player.nextAnyPlacementSources ?? [];
  player.nextAnyPlacementBonus = (player.nextAnyPlacementBonus ?? 0) + value;
  if (sourceUid) player.nextAnyPlacementSources.push({ sourceUid, value });
}

function addNextDiscount(player, value, sourceUid = null) {
  player.nextDiscountSources = player.nextDiscountSources ?? [];
  player.nextDiscount += value;
  if (sourceUid) player.nextDiscountSources.push({ sourceUid, value });
}

function addNextExtraCost(player, value, sourceUid = null) {
  player.nextExtraCostSources = player.nextExtraCostSources ?? [];
  player.nextExtraCost = (player.nextExtraCost ?? 0) + value;
  if (sourceUid) player.nextExtraCostSources.push({ sourceUid, value });
}

function clearNextShotBonuses(player) {
  player.nextDiscount = 0;
  player.nextDiscountSources = [];
  player.nextExtraCost = 0;
  player.nextExtraCostSources = [];
  player.nextPrecisionBonus = 0;
  player.nextPrecisionSources = [];
  player.nextPlacementBonus = 0;
  player.nextPlacementSources = [];
  player.nextAnyPlacementBonus = 0;
  player.nextAnyPlacementSources = [];
  player.nextPowerMultiplier = 1;
  player.nextPowerMultiplierSourceUid = null;
  player.nextPowerCap = null;
  player.nextPowerCapSourceUid = null;
  player.nextShotBasePlacementZero = false;
}

function clearNextAnyCardBonuses(player) {
  player.nextAnyPlacementBonus = 0;
  player.nextAnyPlacementSources = [];
}

function removeSourcedNextBonus(player, key, sourceKey, sourceUid) {
  const sources = player[sourceKey] ?? [];
  const removedValue = sources
    .filter((source) => source.sourceUid === sourceUid)
    .reduce((sum, source) => sum + source.value, 0);
  if (!removedValue) return 0;
  player[key] = Math.max(0, player[key] - removedValue);
  player[sourceKey] = sources.filter((source) => source.sourceUid !== sourceUid);
  return removedValue;
}

function getCardStats(player, card, boosted) {
  const playerIndex = state.players.indexOf(player);
  const opponent = playerIndex >= 0 ? state.players[opponentOf(playerIndex)] : null;
  const shotBonus = isRemise(card) ? 0 : 1;
  const basePower = boosted ? card.boostPower : card.power;
  const permanentPrecisionBonus = (player.permanentBonuses ?? []).reduce((sum, bonus) => sum + Number(bonus.precision || 0), 0);
  const permanentPlacementBonus = (player.permanentBonuses ?? []).reduce((sum, bonus) => sum + Number(bonus.placement || 0), 0);
  const permanentPowerBonus = isRemise(card) ? 0 : (player.permanentBonuses ?? []).reduce((sum, bonus) => sum + Number(bonus.power || 0), 0);
  let precision = (boosted ? card.boostPrecision : card.precision) + (player.exchangePrecisionBonus ?? 0) + player.nextPrecisionBonus * shotBonus;
  precision += permanentPrecisionBonus;
  const basePlacement = !isRemise(card) && player.nextShotBasePlacementZero ? 0 : card.placement;
  let placement = basePlacement + (player.exchangePlacementBonus ?? 0) + player.nextPlacementBonus * shotBonus + (player.nextAnyPlacementBonus ?? 0) + permanentPlacementBonus;
  let surfacePowerBonus = 0;
  if (!isRemise(card) && playerHasSurfaceBonus(player, "grassPowerVolleySmash") && ["Volée", "Smash"].includes(card.family)) surfacePowerBonus += 2;
  if (!isRemise(card) && playerHasSurfaceBonus(player, "hardPrecisePower") && precision > 3) surfacePowerBonus += 1;
  if (!isRemise(card) && playerHasSurfaceBonus(player, "clayGroundPower") && ["Coup droit", "Revers"].includes(card.family)) surfacePowerBonus += 1;
  if (!isRemise(card) && playerHasSurfaceBonus(player, "clayBoostPower") && boosted) surfacePowerBonus += 2;
  let characterPowerBonus = 0;
  if (!isRemise(card)) {
    for (const bonus of player.exchangeFamilyPowerBonuses ?? []) {
      const families = bonus.families ?? [];
      const excludedFamilies = bonus.excludedFamilies ?? [];
      if ((families.length && families.includes(card.family)) || (!families.length && !excludedFamilies.includes(card.family))) {
        characterPowerBonus += bonus.value ?? 0;
      }
    }
    const previousShot = [...player.played].reverse().find((playedCard) => !playedCard.removed && isShot(playedCard));
    for (const bonus of player.exchangeAfterFamilyPlacementBonuses ?? []) {
      if (previousShot?.family === bonus.afterFamily) placement += bonus.value ?? 0;
    }
  }
  let power = (basePower + permanentPowerBonus + surfacePowerBonus + characterPowerBonus) * (isRemise(card) ? 1 : (player.nextPowerMultiplier ?? 1));
  if (!isRemise(card) && player.nextPowerCap != null) power = Math.min(power, Number(player.nextPowerCap));
  return {
    power,
    precision,
    placement,
  };
}

function canAfford(player, card) {
  return player.endurance >= effectiveCost(player, card);
}

function satisfiesFamilyLimit(player, card) {
  return !player.limitedFamilies || player.limitedFamilies.includes(card.family);
}

function hasReturnServiceRestriction(playerIndex) {
  return state.returnServiceRestrictionFor === playerIndex && !state.returnServiceRestrictionSpent?.[playerIndex];
}

function satisfiesReturnServiceRestriction(card) {
  const playerIndex = state.activePlayer;
  const restrictionActive = hasReturnServiceRestriction(playerIndex);
  return !restrictionActive || !["Volée", "Smash"].includes(card.family);
}

const COLOR_BOOST_RULES = {
  Passing: ["Smash", "Amortie", "Volée"],
  Volée: ["Passing"],
  Amortie: ["Amortie", "Passing"],
  Lob: ["Volée", "Smash"],
  Smash: ["Lob"],
};

function satisfiesColorBoostCondition(card) {
  return Boolean(state.lastCard && state.lastCard.owner !== state.activePlayer && COLOR_BOOST_RULES[card.family]?.includes(state.lastCard.family));
}

function isFreeBoostNextWindow(playerIndex) {
  if (!state.lastCard?.boosted) return false;
  if (state.lastCard.isServiceTurn && playerIndex === opponentOf(state.server)) return true;
  const serverShots = state.players[state.server].played.filter((card) => isShot(card)).length;
  const receiverIndex = opponentOf(state.server);
  const receiverShots = state.players[receiverIndex].played.filter((card) => isShot(card)).length;
  return playerIndex === state.server && state.lastCard.owner === receiverIndex && serverShots === 1 && receiverShots === 1;
}

function isServiceBoostHintWindow(playerIndex) {
  if (!state.lastCard?.isServiceTurn || state.lastCard.boosted) return false;
  if (playerIndex !== opponentOf(state.server)) return false;
  const receiverShots = state.players[playerIndex].played.filter((card) => isShot(card)).length;
  return receiverShots === 0;
}

function isOpeningServeAvailable() {
  const serverCards = state.players[state.server]?.played ?? [];
  const serverAlreadyPlayedOpeningShot = serverCards.some((card) => card.isServiceTurn || isShot(card));
  return !state.openingServePlayed && !serverAlreadyPlayedOpeningShot;
}

function isNextEffectCanceledFor(playerIndex) {
  return Boolean(state.players[opponentOf(playerIndex)]?.cancelNextOpponentEffect);
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

function turnEndPlacement(playerIndex) {
  return state.turnPlacement[playerIndex] + (state.turnEffectPlacement?.[playerIndex] ?? 0);
}

function finalRemisePlayedThisTurn(playerIndex) {
  const played = (state.turnPlayedCards[playerIndex] ?? []).filter((card) => !card.removed);
  const finalCard = played[played.length - 1];
  return finalCard && isRemise(finalCard) ? finalCard : null;
}

function finalRemiseCanResolvePlacementConstraint(playerIndex) {
  const finalCard = finalRemisePlayedThisTurn(playerIndex);
  if (!finalCard || !finalCard.effectDeferredUntilEndTurn || finalCard.effectApplied) return false;
  if (isNextEffectCanceledFor(playerIndex)) return false;
  return ["jokerResponse", "removeOpponentLast"].includes(finalCard.effectType);
}

function canPlayNormal(playerIndex, card) {
  if (state.gameOver || playerIndex !== state.activePlayer) return false;
  if (!canUseSeat(playerIndex)) return false;
  const player = state.players[playerIndex];
  if (!canAfford(player, card) || !satisfiesFamilyLimit(player, card)) return false;
  if (isRemise(card)) return true;
  if (!satisfiesReturnServiceRestriction(card)) return false;
  const jokerAnswersBoost = card.effectType === "jokerResponse" && state.mandatoryPlacementReason === "boost";
  if (state.mandatoryPlacement && !hasPlacementForPrevious(playerIndex, card) && !jokerAnswersBoost) return false;
  return true;
}

function canPlayEffectMode(playerIndex, card) {
  // Une Remise reste jouable en mode Effet même si son effet n'a plus de
  // cible utile : elle peut relancer l'échange ou absorber une annulation.
  return canPlayNormal(playerIndex, card) && isRemise(card);
}

function canEndTurn(playerIndex) {
  if (state.gameOver || playerIndex !== state.activePlayer || !canUseSeat(playerIndex)) return false;
  if (!tutorialAllowsEndTurn(playerIndex)) return false;
  if (state.mandatoryPlacement) {
    return hasPlayedThisTurn(playerIndex)
      && state.lastCard
      && (turnEndPlacement(playerIndex) >= state.lastCard.precision || finalRemiseCanResolvePlacementConstraint(playerIndex));
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
  const openingServiceBoost = card.effectType === "serviceCard" && playerIndex === state.server && isOpeningServeAvailable();
  const boostAfterNonBoostedService = card.effectType === "serviceBoostHint" && isServiceBoostHintWindow(playerIndex) && !isNextEffectCanceledFor(playerIndex);
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
  SOLO_AI.playerIndex = 1;
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
  queueConfrontationIntro();
}

async function startOnlineGame() {
  showMenuScreen();
  await refreshLobbyRooms();
}

function toggleRevealAiCards() {
  if (!canAccessAdminFeatures()) return;
  if (!SOLO_AI.enabled || !state.gameOver) return;
  state.revealAiCards = !state.revealAiCards;
  render();
}

function localHumanControlsPlayer(playerIndex) {
  if (SPECTATOR_MODE.enabled) return false;
  if (SERVER_SYNC.enabled) return playerIndex === SERVER_SYNC.seat;
  if (SOLO_AI.enabled) return playerIndex !== SOLO_AI.playerIndex;
  return true;
}

function opponentHandRevealRemainingSeconds() {
  if (!state.opponentHandReveal?.expiresAt) return 0;
  return Math.max(0, Math.ceil((state.opponentHandReveal.expiresAt - Date.now()) / 1000));
}

function localCanViewOpponentHandReveal() {
  const reveal = state.opponentHandReveal;
  return Boolean(reveal && opponentHandRevealRemainingSeconds() > 0 && localHumanControlsPlayer(reveal.viewerIndex));
}

function isOpponentHandTemporarilyRevealed(playerIndex) {
  return localCanViewOpponentHandReveal() && state.opponentHandReveal.opponentIndex === playerIndex;
}

function endOpponentHandReveal(shouldRender = true) {
  window.clearInterval(opponentHandRevealTimer);
  opponentHandRevealTimer = null;
  state.opponentHandReveal = null;
  document.querySelector(".opponent-hand-reveal-controls")?.remove();
  if (shouldRender) render();
}

function scheduleOpponentHandRevealCountdown() {
  window.clearInterval(opponentHandRevealTimer);
  opponentHandRevealTimer = window.setInterval(() => {
    const remaining = opponentHandRevealRemainingSeconds();
    const button = document.querySelector("[data-end-opponent-hand-reveal]");
    if (button) button.textContent = `Terminer la visualisation · ${remaining} s`;
    if (remaining <= 0) endOpponentHandReveal();
  }, 250);
}

function startOpponentHandReveal(viewerIndex, opponentIndex) {
  state.opponentHandReveal = { viewerIndex, opponentIndex, expiresAt: Date.now() + 10_000 };
  scheduleOpponentHandRevealCountdown();
}

function renderOpponentHandRevealControls() {
  let controls = document.querySelector(".opponent-hand-reveal-controls");
  if (!localCanViewOpponentHandReveal()) {
    controls?.remove();
    if (state.opponentHandReveal && opponentHandRevealRemainingSeconds() <= 0) state.opponentHandReveal = null;
    return;
  }
  if (!controls) {
    controls = document.createElement("aside");
    controls.className = "opponent-hand-reveal-controls";
    controls.setAttribute("aria-live", "polite");
    document.body.append(controls);
  }
  const remaining = opponentHandRevealRemainingSeconds();
  controls.innerHTML = `
    <strong>Main adverse révélée</strong>
    <button class="primary-button" type="button" data-end-opponent-hand-reveal>Terminer la visualisation · ${remaining} s</button>
  `;
  controls.querySelector("[data-end-opponent-hand-reveal]")?.addEventListener("click", () => endOpponentHandReveal());
  if (!opponentHandRevealTimer) scheduleOpponentHandRevealCountdown();
}

function maybeRunSoloAI() {
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || state.gameOver || confrontationIntroActive) return;
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
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || state.gameOver || confrontationIntroActive || state.activePlayer !== SOLO_AI.playerIndex) return;
  SOLO_AI.executing = true;
  const beforeSignature = soloTurnSignature();
  try {
    if (resolveSoloPendingChoice()) {
      ensureSoloProgress(beforeSignature);
      return;
    }

    const playerIndex = SOLO_AI.playerIndex;
    if (normalizeAiIntelligence(SOLO_AI.style) === "amateur" && runAmateurSoloAITurn(playerIndex)) {
      ensureSoloProgress(beforeSignature);
      return;
    }
    const legalInventory = soloLegalActionInventory(playerIndex);
    const scenarioPlan = prepareSoloScenarioPlan(playerIndex);
    if (canEndTurn(playerIndex) && state.turnHasEffect[playerIndex] && !canSoloFinishWithCoup(playerIndex)) {
      recordSoloAiDecision("end_turn_after_effect");
      endTurn(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (!legalInventory.canProgress && canSoloPassAndWin(playerIndex)) {
      const punitivePath = chooseSoloPunitiveContinuation(playerIndex, scenarioPlan);
      if (punitivePath) {
        recordSoloAiDecision("press_secured_advantage", {
          path: punitivePath,
          pass: soloPassDecisionSnapshot(playerIndex),
        });
        executeSoloPlanPath(playerIndex, punitivePath);
        ensureSoloProgress(beforeSignature);
        return;
      }
      recordSoloAiDecision("pass_secured_win", soloPassDecisionSnapshot(playerIndex));
      pass(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    const legendarySafetyPass = !legalInventory.canProgress
      ? legendaryPassSafetyDecision(playerIndex, scenarioPlan?.legendaryPlan)
      : null;
    if (legendarySafetyPass) {
      recordSoloAiDecision("legendary_safety_pass", legendarySafetyPass);
      pass(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (!legalInventory.canProgress && shouldSoloPassToLimitBoostDamage(playerIndex)) {
      recordSoloAiDecision("pass_limit_boost_damage", soloPassDecisionSnapshot(playerIndex));
      pass(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (state.mandatoryPlacement) {
      const defenseAction = chooseSoloPlacementDefenseAction(playerIndex);
      if (defenseAction) {
        recordSoloAiDecision("mandatory_defense", {
          actionType: defenseAction.type,
          card: cardLogInfo(defenseAction.card),
          sacrifice: cardLogInfo(defenseAction.sacrifice),
        });
        performSoloDefenseAction(playerIndex, defenseAction);
        ensureSoloProgress(beforeSignature);
        return;
      }
    }

    const selectedPlanPath = scenarioPlan?.selectedPath;
    if (
      normalizeAiIntelligence(SOLO_AI.style) === "legend"
      && selectedPlanPath
      && ["boost", "normal", "effect"].includes(selectedPlanPath.type)
    ) {
      recordSoloAiDecision("legendary_sequence", {
        path: selectedPlanPath,
        sequence: scenarioPlan.legendaryPlan?.best?.steps,
      });
      if (executeSoloPlanPath(playerIndex, selectedPlanPath)) {
        ensureSoloProgress(beforeSignature);
        return;
      }
    }

    const strategicEffect = chooseSoloStrategicEffect(playerIndex);
    if (strategicEffect) {
      recordSoloAiDecision(
        state.players[opponentOf(playerIndex)].cancelNextOpponentEffect ? "absorb_effect_cancellation" : "strategic_effect",
        { card: cardLogInfo(strategicEffect), cost: effectiveCost(state.players[playerIndex], strategicEffect) },
      );
      playCard(playerIndex, strategicEffect.uid, false, null, "effect");
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (selectedPlanPath && ["boost", "normal", "effect"].includes(selectedPlanPath.type)) {
      recordSoloAiDecision(`planned_${scenarioPlan.selectedObjective}`, { path: selectedPlanPath });
      if (executeSoloPlanPath(playerIndex, selectedPlanPath)) {
        ensureSoloProgress(beforeSignature);
        return;
      }
    }

    const boostPlay = chooseSoloBoostPlay(playerIndex);
    if (boostPlay) {
      recordSoloAiDecision("boost", {
        card: cardLogInfo(boostPlay.card),
        sacrifice: cardLogInfo(boostPlay.sacrifice),
        analysis: boostPlay.analysis,
      });
      playCard(playerIndex, boostPlay.card.uid, true, boostPlay.sacrifice.uid);
      ensureSoloProgress(beforeSignature);
      return;
    }

    const urgentPlacementRemise = chooseSoloRemiseForPlacement(playerIndex);
    if (urgentPlacementRemise) {
      recordSoloAiDecision("placement_remise", { card: cardLogInfo(urgentPlacementRemise) });
      playCard(playerIndex, urgentPlacementRemise.uid, false, null, "placement");
      ensureSoloProgress(beforeSignature);
      return;
    }

    const normalCoup = chooseSoloNormalCoup(playerIndex);
    if (normalCoup) {
      recordSoloAiDecision("normal_coup", { card: cardLogInfo(normalCoup) });
      playCard(playerIndex, normalCoup.uid);
      ensureSoloProgress(beforeSignature);
      return;
    }

    const legalPlacementRemise = legalInventory.placementRemises[0];
    if (legalPlacementRemise) {
      recordSoloAiDecision("fallback_placement_remise", { card: cardLogInfo(legalPlacementRemise) });
      playCard(playerIndex, legalPlacementRemise.uid, false, null, "placement");
      ensureSoloProgress(beforeSignature);
      return;
    }

    const usefulEffect = chooseSoloEffectCard(playerIndex);
    if (usefulEffect) {
      recordSoloAiDecision("fallback_effect", { card: cardLogInfo(usefulEffect) });
      playCard(playerIndex, usefulEffect.uid, false, null, "effect");
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (canEndTurn(playerIndex)) {
      recordSoloAiDecision("end_turn");
      endTurn(playerIndex);
      ensureSoloProgress(beforeSignature);
      return;
    }

    if (state.turnDirty && state.turnSnapshot) {
      const repeatedRecovery = registerSoloTurnRecovery(playerIndex);
      if (repeatedRecovery) {
        recordSoloAiDecision("forced_pass_after_repeated_recovery", {
          recoveryCount: SOLO_AI.recoveryCount,
          reason: "same_turn_dead_end",
        });
        restoreTurnSnapshot();
        pass(playerIndex);
        ensureSoloProgress(beforeSignature);
        return;
      }
      restoreTurnSnapshot();
      ensureSoloProgress(beforeSignature);
      return;
    }

    recordSoloAiDecision("forced_pass", soloPassDecisionSnapshot(playerIndex));
    pass(playerIndex);
  } catch (error) {
    state.log.unshift(`IA Coach Max : décision impossible, plan de secours activé.`);
    soloEmergencyFallback(SOLO_AI.playerIndex);
  } finally {
    SOLO_AI.executing = false;
    maybeRunSoloAI();
  }
}

function chooseAmateurOption(options, scoreOf = (option) => option.score) {
  if (!options.length) return null;
  const ranked = [...options].sort((a, b) => scoreOf(a) - scoreOf(b));
  const accessiblePoolSize = Math.max(1, Math.ceil(ranked.length * 0.65));
  return ranked[Math.floor(Math.random() * accessiblePoolSize)] ?? ranked[0];
}

function runAmateurSoloAITurn(playerIndex) {
  const player = state.players[playerIndex];
  const legalCoups = player.hand
    .filter((card) => !isRemise(card) && canPlayNormal(playerIndex, card))
    .map((card) => ({ card, score: soloPlayableCoupScore(playerIndex, card) }));
  const legalRemises = player.hand.filter((card) => isRemise(card) && canPlayNormal(playerIndex, card));

  if (state.mandatoryPlacement) {
    const weakDefense = chooseAmateurOption(legalCoups);
    if (weakDefense) {
      recordSoloAiDecision("amateur_basic_defense", { card: cardLogInfo(weakDefense.card) });
      playCard(playerIndex, weakDefense.card.uid);
      return true;
    }
    const placementRemises = legalRemises.filter((card) => getCardStats(player, card, false).placement > 0);
    if (placementRemises.length) {
      const remise = placementRemises[Math.floor(Math.random() * placementRemises.length)];
      recordSoloAiDecision("amateur_placement_attempt", { card: cardLogInfo(remise) });
      playCard(playerIndex, remise.uid, false, null, "placement");
      return true;
    }
    recordSoloAiDecision("amateur_forced_pass", soloPassDecisionSnapshot(playerIndex));
    pass(playerIndex);
    return true;
  }

  if (!state.turnHasEffect[playerIndex] && legalRemises.length && Math.random() < 0.16) {
    const effect = legalRemises[Math.floor(Math.random() * legalRemises.length)];
    recordSoloAiDecision("amateur_random_effect", { card: cardLogInfo(effect) });
    playCard(playerIndex, effect.uid, false, null, "effect");
    return true;
  }

  const boostCards = player.hand.filter((card) => canPlayBoost(playerIndex, card));
  if (boostCards.length && Math.random() < 0.08) {
    const card = boostCards[Math.floor(Math.random() * boostCards.length)];
    const sacrifices = player.hand.filter((candidate) => candidate.uid !== card.uid);
    const sacrifice = sacrifices[Math.floor(Math.random() * sacrifices.length)];
    if (sacrifice) {
      recordSoloAiDecision("amateur_random_boost", { card: cardLogInfo(card), sacrifice: cardLogInfo(sacrifice) });
      playCard(playerIndex, card.uid, true, sacrifice.uid);
      return true;
    }
  }

  const basicCoup = chooseAmateurOption(legalCoups);
  if (basicCoup) {
    recordSoloAiDecision("amateur_basic_coup", { card: cardLogInfo(basicCoup.card) });
    playCard(playerIndex, basicCoup.card.uid);
    return true;
  }

  if (canEndTurn(playerIndex)) {
    recordSoloAiDecision("amateur_end_turn");
    endTurn(playerIndex);
    return true;
  }

  recordSoloAiDecision("amateur_pass", soloPassDecisionSnapshot(playerIndex));
  pass(playerIndex);
  return true;
}

function recordSoloAiDecision(decision, details = {}) {
  const playerIndex = SOLO_AI.playerIndex;
  recordAction("ai_decision", {
    playerIndex,
    opponentIndex: opponentOf(playerIndex),
    playerName: displayPlayerName(state.players[playerIndex]),
    decision,
    details: {
      ...details,
      attitude: SOLO_AI.attitude,
      attitudeReason: SOLO_AI.attitudeReason,
      plan: soloPlanLogInfo(SOLO_AI.plan),
    },
    aiStyle: SOLO_AI.style,
    aiAttitude: SOLO_AI.attitude,
    aiDifficulty: state.tournament?.difficulty || SOLO_AI.difficulty,
    constraints: constraintsLogInfo(),
  });
}

function soloPassDecisionSnapshot(playerIndex) {
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const passPenalty = Math.max(2, player.endurance);
  const projectedPowers = state.players.map((candidate, index) => (
    candidate.power + projectedEndBonuses(candidate) + (index === opponentIndex ? passPenalty : 0)
  ));
  return {
    passPenalty,
    currentPower: state.players.map((candidate) => candidate.power),
    projectedPower: projectedPowers,
    projectedWinner: projectedPowers[playerIndex] > projectedPowers[opponentIndex]
      ? playerIndex
      : projectedPowers[playerIndex] < projectedPowers[opponentIndex]
        ? opponentIndex
        : state.server,
    hasSafeContinuation: hasSafeSoloContinuation(playerIndex),
  };
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

function soloTurnRecoveryKey(playerIndex) {
  const snapshot = state.turnSnapshot;
  const player = snapshot?.players?.[playerIndex];
  return JSON.stringify({
    exchangeNumber: snapshot?.setMatch?.exchangeNumber ?? state.setMatch.exchangeNumber ?? 0,
    activePlayer: snapshot?.activePlayer ?? state.activePlayer,
    endurance: player?.endurance ?? state.players[playerIndex]?.endurance,
    hand: (player?.hand ?? state.players[playerIndex]?.hand ?? []).map((card) => card.uid).sort(),
    lastCard: snapshot?.lastCard?.playedUid ?? state.lastCard?.playedUid ?? null,
    mandatoryPlacement: snapshot?.mandatoryPlacement ?? state.mandatoryPlacement,
    mandatoryPlacementReason: snapshot?.mandatoryPlacementReason ?? state.mandatoryPlacementReason,
  });
}

function registerSoloTurnRecovery(playerIndex) {
  const recoveryKey = soloTurnRecoveryKey(playerIndex);
  const repeatedRecovery = SOLO_AI.recoveryTurnKey === recoveryKey && SOLO_AI.recoveryCount >= 1;
  SOLO_AI.recoveryTurnKey = recoveryKey;
  SOLO_AI.recoveryCount = repeatedRecovery ? SOLO_AI.recoveryCount + 1 : 1;
  return repeatedRecovery;
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
  const inventory = soloLegalActionInventory(playerIndex);
  if (inventory.boosts.length) {
    const forcedBoost = inventory.boosts[0];
    playCard(playerIndex, forcedBoost.card.uid, true, forcedBoost.sacrifice.uid);
    return;
  }
  const forcedCoup = inventory.coups[0];
  if (forcedCoup) {
    playCard(playerIndex, forcedCoup.uid);
    return;
  }
  const usefulEffect = inventory.effects[0];
  if (usefulEffect && !state.mandatoryPlacement) {
    playCard(playerIndex, usefulEffect.uid, false, null, "effect");
    return;
  }
  const placementRemise = inventory.placementRemises[0];
  if (placementRemise) {
    playCard(playerIndex, placementRemise.uid, false, null, "placement");
    return;
  }
  pass(playerIndex);
}

function chooseSoloPlacementDefenseAction(playerIndex) {
  if (!state.mandatoryPlacement || !state.lastCard) return null;
  if (canEndTurn(playerIndex)) return { type: "end" };

  const escapeEffect = chooseSoloBoostEscapeEffect(playerIndex);
  const directCoup = chooseSoloNormalCoup(playerIndex);
  const counterBoost = chooseSoloBoostPlay(playerIndex);
  const defensePlan = chooseSoloRemiseDefensePlan(playerIndex);

  if (counterBoost && (state.mandatoryPlacementReason === "boost" || Math.random() < 0.35)) {
    return { type: "boost", card: counterBoost.card, sacrifice: counterBoost.sacrifice };
  }

  if (escapeEffect && shouldUseSoloBoostEscapeEffect(playerIndex, escapeEffect, directCoup, defensePlan)) {
    return { type: "effect", card: escapeEffect };
  }

  if (counterBoost) return { type: "boost", card: counterBoost.card, sacrifice: counterBoost.sacrifice };

  if (directCoup) return { type: "normal", card: directCoup };

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
  const opponent = state.players[opponentOf(playerIndex)];
  if (opponent.cancelNextOpponentEffect) return 0;
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
    if (!isSoloRemovalWorthCost(playerIndex, card, target)) return 0;
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
    if (soloTurnIsBlocked(SOLO_AI.playerIndex)) {
      forceSoloBlockedExchangeLoss(SOLO_AI.playerIndex);
      return;
    }
    if (soloTurnSignature() !== watchedSignature) return;
    state.log.unshift("Sécurité IA : aucun coup validé après 10 secondes, l’IA passe automatiquement.");
    state.pendingBoost = null;
    SOLO_AI.executing = true;
    resolveSoloPendingChoice(true);
    if (!state.gameOver && state.activePlayer === SOLO_AI.playerIndex) {
      pass(SOLO_AI.playerIndex);
    }
    SOLO_AI.executing = false;
  }, 10000);
}

function soloTurnIsBlocked(playerIndex) {
  return state.activePlayer === playerIndex
    && hasPlayedThisTurn(playerIndex)
    && !canEndTurn(playerIndex);
}

function forceSoloBlockedExchangeLoss(playerIndex) {
  if (state.gameOver || state.activePlayer !== playerIndex) return;
  const opponentIndex = opponentOf(playerIndex);
  const boostLoss = state.mandatoryPlacementReason === "boost" || Boolean(state.lastCard?.boosted);
  state.pendingBoost = null;
  state.pendingEffectChoice = null;
  state.pendingRemoveChoice = null;
  state.pendingCoachChoice = null;
  state.pendingEndTurnAfterChoice = null;
  state.players[playerIndex].passed = true;
  const score = boostLoss ? "3-0" : "2-0";
  state.log.unshift(`Sécurité IA : ${displayPlayerName(state.players[playerIndex])} est bloqué depuis 10 secondes. Passage forcé, ${displayPlayerName(state.players[opponentIndex])} gagne l’échange ${score}.`);
  recordAction("pass", {
    playerIndex,
    opponentIndex,
    playerName: displayPlayerName(state.players[playerIndex]),
    opponentName: displayPlayerName(state.players[opponentIndex]),
    forced: true,
    mandatoryPlacement: state.mandatoryPlacement,
    mandatoryPlacementReason: state.mandatoryPlacementReason,
    penaltyPowerGiven: 0,
    constraintsBefore: constraintsLogInfo(),
  });
  finishGame({
    forcedWinner: opponentIndex,
    ignoreScore: true,
    winType: boostLoss ? "boost" : "power",
    reason: `${displayPlayerName(state.players[playerIndex])} reste bloqué après une Remise. Passage forcé : ${displayPlayerName(state.players[opponentIndex])} gagne ${score}.`,
  });
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
        state.log.unshift("Relance automatique de l’IA après attente.");
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
  state.log.unshift("Relance de l’IA.");
  runSoloAITurn();
}

function resolveSoloPendingChoice(forceClose = false) {
  const playerIndex = SOLO_AI.playerIndex;
  if (state.pendingCoachChoice?.playerIndex === playerIndex) {
    const discardMode = state.pendingCoachChoice.mode === "discardHandForPower";
    const pool = discardMode ? state.players[playerIndex].hand : state.deck;
    const chosenCard = [...pool].sort((a, b) => (
      discardMode
        ? soloCardScore(playerIndex, a) - soloCardScore(playerIndex, b)
        : soloCardScore(playerIndex, b) - soloCardScore(playerIndex, a)
    ))[0];
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
  if (state.tournament?.aiIntelligenceLevels?.[SOLO_AI.characterId]) {
    return aiIntelligenceForEntry(SOLO_AI.characterId, state.tournament.difficulty || SOLO_AI.difficulty);
  }
  if (!state.tournament?.aiClubHouse) return state.setMatch?.enabled ? "normal" : "amateur";
  return aiIntelligenceForEntry(SOLO_AI.characterId, state.tournament.difficulty || SOLO_AI.difficulty);
}

function normalizeAiIntelligence(value) {
  return ["amateur", "normal", "expert", "champion", "legend"].includes(value) ? value : "normal";
}

function aiIntelligenceForEntry(entry, difficulty = "normal") {
  const assignedLevel = state.tournament?.aiIntelligenceLevels?.[entry];
  if (assignedLevel) return normalizeAiIntelligence(assignedLevel);
  const normalized = normalizeAiDifficulty(difficulty);
  if (normalized !== "ranking" && normalized !== "circuit") return normalizeAiIntelligence(normalized);
  return "normal";
}

function drawRankedAiIntelligence(rankIa) {
  if (rankIa === 1) return "legend";
  if (rankIa === 2) return "champion";
  if (rankIa <= 4) return Math.random() < 0.5 ? "expert" : "champion";
  if (rankIa <= 6) return "expert";
  if (rankIa <= 10) return Math.random() < 0.5 ? "normal" : "expert";
  if (rankIa <= 14) return "normal";
  if (rankIa <= 18) return Math.random() < 0.5 ? "normal" : "amateur";
  return "amateur";
}

function drawLevelSixAiIntelligence(rankIa) {
  if (rankIa <= 2) return "legend";
  if (rankIa === 3) return Math.random() < 0.5 ? "legend" : "champion";
  if (rankIa <= 5) return "champion";
  if (rankIa <= 8) return Math.random() < 0.5 ? "champion" : "expert";
  if (rankIa <= 10) return "expert";
  if (rankIa <= 12) return Math.random() < 0.5 ? "expert" : "normal";
  if (rankIa <= 18) return "normal";
  return Math.random() < 0.5 ? "normal" : "amateur";
}

function circuitPositionAiIntelligence(position, humanLevel) {
  const pos = Number(position || 99999);
  const level = Number(humanLevel || 1);
  if (level === 1) return "normal";
  if (level === 2) {
    if (pos === 1) return "expert";
    return "normal";
  }
  if (level === 3) {
    if (pos <= 3) return "expert";
    return "normal";
  }
  if (pos === 1) return "champion";
  if (pos <= 4) return "expert";
  return "normal";
}

function buildTournamentAiIntelligenceLevels(entries = [], difficulty = "normal", options = {}) {
  const aiEntries = [...new Set(entries.filter((entry) => entry && entry !== HUMAN_TOURNAMENT_ENTRY))];
  const normalized = normalizeAiDifficulty(difficulty);
  if (normalized !== "ranking" && normalized !== "circuit") {
    const level = normalizeAiIntelligence(normalized);
    return Object.fromEntries(aiEntries.map((entry) => [entry, level]));
  }
  const humanLevel = Number(options.humanLevel || 1);
  const positionByEntry = Object.fromEntries(entries.map((entry, position) => [entry, position]));
  return Object.fromEntries(rankedAiTournamentEntries(aiEntries).map((entry) => {
    const level = normalized !== "circuit"
      ? drawRankedAiIntelligence(tournamentRankIa(entry))
      : humanLevel <= 4
        ? circuitPositionAiIntelligence(positionByEntry[entry], humanLevel)
        : humanLevel === 5
          ? drawRankedAiIntelligence(tournamentRankIa(entry))
          : drawLevelSixAiIntelligence(tournamentRankIa(entry));
    return [entry, normalized === "circuit" && level === "amateur" ? "normal" : level];
  }));
}

function aiIntelligenceBadgeMarkup(entry) {
  if (!state.tournament?.aiIntelligenceLevels || !entry || isHumanTournamentEntry(entry)) return "";
  if (!state.tournament.aiIntelligenceLevels[entry]) return "";
  const level = aiIntelligenceForEntry(entry, state.tournament.difficulty);
  if (level === "normal" || level === "amateur") return "";
  const badges = {
    expert: { initial: "E", label: "Expert" },
    champion: { initial: "C", label: "Champion" },
    legend: { initial: "L", label: "Légendaire" },
  };
  const badge = badges[level];
  return `<span class="ai-intelligence-badge ${level}" title="${badge.label}" aria-label="Niveau ${badge.label}">${badge.initial}</span>`;
}

function aiIntelligenceRank(level = SOLO_AI.style) {
  return { amateur: -1, normal: 0, expert: 1, champion: 2, legend: 3 }[normalizeAiIntelligence(level)] ?? 0;
}

function aiIntelligenceAtLeast(level) {
  return aiIntelligenceRank() >= aiIntelligenceRank(level);
}

function aiRiskProjectionFactor() {
  return { amateur: 0.4, normal: 0.58, expert: 1, champion: 1.06, legend: 1.18 }[normalizeAiIntelligence(SOLO_AI.style)];
}

function chooseSoloScoredOption(options, scoreOf = (option) => option.score) {
  if (!options.length) return null;
  const ranked = [...options].sort((a, b) => scoreOf(b) - scoreOf(a));
  const level = normalizeAiIntelligence(SOLO_AI.style);
  const weights = {
    amateur: [0.35, 0.4, 0.25],
    normal: [0.55, 0.3, 0.15],
    expert: [0.92, 0.08],
    champion: [1],
    legend: [1],
  }[level];
  const plausibleGap = { amateur: 18, normal: 12, expert: 3, champion: 0, legend: 0 }[level];
  const bestScore = scoreOf(ranked[0]);
  const candidates = ranked
    .filter((option) => bestScore - scoreOf(option) <= plausibleGap)
    .slice(0, weights.length);
  if (candidates.length === 1) return candidates[0];
  const roll = Math.random();
  let cursor = 0;
  for (let index = 0; index < candidates.length; index += 1) {
    cursor += weights[index] || 0;
    if (roll <= cursor) return candidates[index];
  }
  return candidates[0];
}

function weightedSoloChoice(weights) {
  const entries = Object.entries(weights).filter(([, value]) => value > 0);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  let cursor = Math.random() * Math.max(1, total);
  for (const [key, value] of entries) {
    cursor -= value;
    if (cursor <= 0) return key;
  }
  return entries[0]?.[0] || "opportunistic";
}

function soloOpponentExperience(playerIndex) {
  const opponentIndex = opponentOf(playerIndex);
  const active = HUMAN_MATCH_TELEMETRY.active;
  const stored = getStoredHumanMatchLogs()
    .filter((session) => session.context?.type === "circuit-ai" || session.context?.type === "club-house-ai")
    .filter((session) => session.participants?.some((participant) => participant.type === "ai" && participant.characterId === state.players[playerIndex]?.characterId))
    .slice(0, 6);
  const sessions = [active, ...stored].filter(Boolean);
  const exchanges = sessions.flatMap((session) => session.exchanges || []);
  const actions = exchanges.flatMap((exchange) => exchange.actions || []);
  const humanActions = actions.filter((action) => action.playerIndex === opponentIndex);
  const humanCards = humanActions.filter((action) => action.kind === "play_card");
  const completedExchanges = exchanges.filter((exchange) => exchange.completedAt);
  const aiBoostExchanges = completedExchanges.filter((exchange) => (
    exchange.actions?.some((action) => action.playerIndex === playerIndex && action.kind === "play_card" && action.boosted)
  ));
  return {
    sampleExchanges: completedExchanges.length,
    boostRate: humanCards.length ? humanCards.filter((action) => action.boosted).length / humanCards.length : 0,
    placementRiskRate: humanCards.length ? humanCards.filter((action) => action.placementWasInsufficient).length / humanCards.length : 0,
    jokerRate: humanCards.length ? humanCards.filter((action) => action.card?.effectType === "jokerResponse").length / humanCards.length : 0,
    preparedDefenseRate: humanCards.length ? humanCards.filter((action) => ["nextPlacement", "nextPrecisionAndPlacement"].includes(action.card?.effectType)).length / humanCards.length : 0,
    aiBoostSuccessRate: aiBoostExchanges.length
      ? aiBoostExchanges.filter((exchange) => exchange.result?.winner === playerIndex).length / aiBoostExchanges.length
      : 0.5,
  };
}

function soloInitialHandProfile(playerIndex) {
  const player = state.players[playerIndex];
  const shots = player.hand.filter((card) => !isRemise(card));
  const remises = player.hand.filter(isRemise);
  const strongShots = shots.filter((card) => card.power >= 4 || card.boostPower >= 5).length;
  const boostPairs = shots.reduce((count, card) => (
    count + shots.filter((candidate) => candidate.uid !== card.uid && canFamilyBoostAfter(card.family, candidate.family)).length
  ), 0);
  return {
    strongShots,
    boostPairs,
    hasJoker: remises.some((card) => card.effectType === "jokerResponse"),
    hasSuppression: remises.some((card) => card.effectType === "removeOpponentLast"),
    hasDouble: remises.some((card) => card.effectType === "doubleLastShot"),
    totalCost: player.hand.reduce((sum, card) => sum + effectiveCost(player, card), 0),
  };
}

function isLateCircuitRoundWithoutBonus(playerIndex) {
  const player = state.players[playerIndex];
  return Boolean(
    state.tournament?.weekly
    && ["semi", "final"].includes(state.tournament.stage)
    && !(player.permanentBonuses || []).length
    && !surfaceBonusesForPlayer(player).length
  );
}

function chooseSoloAttitude(playerIndex, reason = "lecture initiale") {
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  const hand = soloInitialHandProfile(playerIndex);
  const experience = soloOpponentExperience(playerIndex);
  const informationExposure = soloInformationExposureProfile(playerIndex);
  const intelligence = normalizeAiIntelligence(SOLO_AI.style);
  const weights = { aggressive: 3, prudent: 3, opportunistic: 4 };
  if (hand.strongShots >= 2 || hand.boostPairs >= 2) weights.aggressive += 4;
  if (hand.hasJoker || hand.hasSuppression) weights.aggressive += 2;
  if (hand.hasDouble) weights.opportunistic += 4;
  if (hand.totalCost > player.endurance * 2) weights.prudent += 3;
  if (experience.sampleExchanges >= 2 && experience.boostRate >= 0.16) {
    if (intelligence === "legend") weights.opportunistic += 4;
    else weights.prudent += 3;
  }
  if (experience.sampleExchanges >= 2 && experience.placementRiskRate >= 0.12) weights.opportunistic += 3;
  if (experience.jokerRate + experience.preparedDefenseRate >= 0.12) weights.opportunistic += 2;
  if (experience.sampleExchanges >= 3 && experience.aiBoostSuccessRate >= 0.62) weights.aggressive += 3;
  if (experience.sampleExchanges >= 3 && experience.aiBoostSuccessRate <= 0.38) weights.prudent += 3;
  if (informationExposure.opponentConservative && !informationExposure.pressureWindow) {
    weights.opportunistic += 4;
    weights.prudent += 3;
  }
  if (informationExposure.opponentMoreCommitted || informationExposure.pressureWindow) weights.aggressive += 4;
  if (opponent.hand.length <= 2 || (opponent.endurance <= 1 && !opponent.nextDiscount)) weights.aggressive += 4;
  if (isSetDangerForPlayer(playerIndex) || isMatchDangerForPlayer(playerIndex)) weights.aggressive += 2;
  if (isLateCircuitRoundWithoutBonus(playerIndex)) {
    weights.opportunistic += 3;
    weights.aggressive += 2;
  }
  const attitude = intelligence === "legend"
    ? Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] || "opportunistic"
    : weightedSoloChoice(weights);
  SOLO_AI.attitude = attitude;
  SOLO_AI.attitudeReason = reason;
  SOLO_AI.attitudeRevisionAt = SOLO_AI.planRevision;
  const revisionWindow = {
    amateur: [5, 7],
    normal: [4, 6],
    expert: [2, 4],
    champion: [1, 3],
    legend: [1, 1],
  }[normalizeAiIntelligence(SOLO_AI.style)] || [5, 7];
  SOLO_AI.attitudeRevisionWindow = revisionWindow[0] + Math.floor(Math.random() * (revisionWindow[1] - revisionWindow[0] + 1));
  return attitude;
}

function initializeSoloAiExchangeStrategy(playerIndex) {
  SOLO_AI.plan = null;
  SOLO_AI.planRevision = 0;
  chooseSoloAttitude(playerIndex, "main initiale et expérience récente");
}

function shouldReevaluateSoloAttitude(playerIndex) {
  if (!SOLO_AI.plan) return false;
  if (SOLO_AI.planRevision - SOLO_AI.attitudeRevisionAt < SOLO_AI.attitudeRevisionWindow) return false;
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  const primaryUid = SOLO_AI.plan.selectedPath?.cardUid;
  const primaryBlocked = primaryUid && !player.hand.some((card) => card.uid === primaryUid);
  const resourceSwing = Math.abs((SOLO_AI.plan.resources?.opponentEndurance ?? opponent.endurance) - opponent.endurance) >= 2
    || Math.abs((SOLO_AI.plan.resources?.opponentHand ?? opponent.hand.length) - opponent.hand.length) >= 2;
  const informationExposure = soloInformationExposureProfile(playerIndex);
  const informationShift = Boolean(SOLO_AI.plan.resources?.informationExposure?.opponentConservative) !== informationExposure.opponentConservative
    || Boolean(SOLO_AI.plan.resources?.informationExposure?.pressureWindow) !== informationExposure.pressureWindow;
  const planContradicted = state.mandatoryPlacement || primaryBlocked || resourceSwing || informationShift || opponent.hand.length <= 1 || opponent.endurance <= 0;
  const intelligence = normalizeAiIntelligence(SOLO_AI.style);
  const reevaluationChance = {
    amateur: 0.18,
    normal: 0.35,
    expert: 0.68,
    champion: 0.82,
    legend: 1,
  }[intelligence] ?? 0.18;
  return planContradicted && (intelligence === "legend" || Math.random() < reevaluationChance);
}

function soloAttitudeLabel(attitude = SOLO_AI.attitude) {
  return attitude === "aggressive" ? "agressive" : attitude === "prudent" ? "prudente" : "opportuniste";
}

function soloDoubleProjection(playerIndex, card) {
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  const target = [...player.played].reverse().find((played) => !played.removed && isShot(played));
  const duplicatedPower = target?.cardPowerGained ?? target?.powerGained ?? 0;
  const cost = card ? effectiveCost(player, card) : 0;
  if (!target || duplicatedPower <= 0 || cost > player.endurance) {
    return { viable: false, duplicatedPower: 0, cost, score: -Infinity, target: null };
  }
  const beforePowers = state.players.map((candidate) => candidate.power + projectedEndBonuses(candidate));
  const afterPowers = [...beforePowers];
  afterPowers[playerIndex] += duplicatedPower;
  const beforeGap = beforePowers[playerIndex] - beforePowers[opponentOf(playerIndex)];
  const afterGap = afterPowers[playerIndex] - afterPowers[opponentOf(playerIndex)];
  const changesLeader = beforeGap <= 0 && afterGap > 0;
  const removesLoserGame = Math.abs(beforeGap) < 5 && afterGap >= 5;
  const humanImplication = Math.max(0, afterPowers[playerIndex] - opponent.power);
  const score = duplicatedPower * 5 - cost * 4 + (changesLeader ? 28 : 0) + (removesLoserGame ? 14 : 0) + Math.min(10, humanImplication);
  return {
    viable: score >= 8,
    duplicatedPower,
    cost,
    score,
    target: cardLogInfo(target),
    beforeGap,
    afterGap,
    changesLeader,
    removesLoserGame,
    humanImplication,
  };
}

function soloInformationExposureProfile(playerIndex) {
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  const committedCards = (player.played || []).filter((card) => !card.removed).length;
  const opponentCommittedCards = (opponent.played || []).filter((card) => !card.removed).length;
  const totalCommittedCards = committedCards + opponentCommittedCards;
  const opening = totalCommittedCards <= 4;
  const opponentHoldingResources = opponent.hand.length >= 3 && opponent.endurance >= 2;
  const opponentMoreCommitted = opponentCommittedCards > committedCards;
  const commitmentLead = Math.max(0, committedCards - opponentCommittedCards);
  const powerLead = player.power - opponent.power;
  let patience = opening ? 0.18 : 0.06;
  if (opponentHoldingResources) patience += 0.18;
  if (opponentCommittedCards === 0) patience += 0.22;
  patience += Math.min(0.32, commitmentLead * 0.16);
  if (powerLead >= 4) patience += 0.12;
  if (opponentMoreCommitted) patience -= 0.22;
  if (opponent.hand.length <= 2 || opponent.endurance <= 1) patience -= 0.28;
  patience = Math.max(0, Math.min(1, patience));
  return {
    opening,
    patience,
    opponentConservative: patience >= 0.45,
    opponentHoldingResources,
    opponentMoreCommitted,
    committedCards,
    opponentCommittedCards,
    commitmentLead,
    powerLead,
    alreadyExposed: commitmentLead > 0 || powerLead >= 5,
    pressureWindow: opponent.hand.length <= 2 || opponent.endurance <= 1,
  };
}

function strategicEnduranceReserve(playerIndex) {
  const opponent = state.players[opponentOf(playerIndex)];
  if (opponent.hand.length <= 1 || opponent.endurance <= 0) return 0;
  if (isSetDangerForPlayer(playerIndex) || isMatchDangerForPlayer(playerIndex)) return 0;
  return {
    amateur: 0,
    normal: 0,
    expert: 1,
    champion: 1,
    legend: 2,
  }[normalizeAiIntelligence(SOLO_AI.style)] ?? 0;
}

function boostDisruptionValue(playerIndex, threat, passPressure = false) {
  const opponent = state.players[opponentOf(playerIndex)];
  const tier = {
    amateur: 0.25,
    normal: 0.55,
    expert: 1,
    champion: 1.25,
    legend: 1.45,
  }[normalizeAiIntelligence(SOLO_AI.style)] ?? 0.25;
  const forcedCardCost = opponent.hand.length > 1 ? 4 : 1;
  const forcedEnduranceCost = Math.min(4, opponent.endurance) * 1.7;
  const strategyInterruption = opponent.hand.length >= 3 ? 3 : 1;
  const directPressure = passPressure ? 10 : 0;
  const counterableDiscount = threat?.canDefend ? 0.9 : 1;
  return (forcedCardCost + forcedEnduranceCost + strategyInterruption + directPressure) * tier * counterableDiscount;
}

function soloCommitmentDiscipline(playerIndex, options = {}) {
  const profile = soloInformationExposureProfile(playerIndex);
  const intelligence = normalizeAiIntelligence(SOLO_AI.style);
  const tier = { amateur: 0, normal: 0.15, expert: 0.5, champion: 0.78, legend: 1 }[intelligence] ?? 0;
  const forced = state.mandatoryPlacement
    || state.boostAvailableFor === playerIndex
    || isSetDangerForPlayer(playerIndex)
    || isMatchDangerForPlayer(playerIndex)
    || wouldPassLoseSetOrMatch(playerIndex);
  if (!tier || forced) return { score: 0, penalty: 0, aggressionBonus: 0, safeSequence: false, profile };

  const player = state.players[playerIndex];
  const stats = options.stats || (options.card ? getCardStats(player, options.card, Boolean(options.boosted)) : {});
  const power = Math.max(0, Number(options.power ?? stats.power ?? 0));
  const cost = Math.max(0, Number(options.cost ?? (options.card ? effectiveCost(player, options.card) : 0)));
  const cardsCommitted = Math.max(1, Number(options.cardsCommitted || (options.boosted ? 2 : 1)));
  const remainingEndurance = Number(options.remainingEndurance ?? (player.endurance - cost));
  const reserve = Math.max(0, Number(options.reserve ?? strategicEnduranceReserve(playerIndex)));
  const risk = Math.max(0, Number(options.risk || 0));
  const canDefend = Boolean(options.canDefend);
  const projectedPowerLead = profile.powerLead + power;
  const safeSequence = Boolean(
    options.plannedSequence
    && risk <= 0.24
    && remainingEndurance >= reserve
    && (canDefend || risk <= 0.1),
  );
  const commitmentLoad = Math.max(0, power - 2) * 1.25
    + cost * 1.4
    + (options.boosted ? 4.5 : 0)
    + Math.max(0, cardsCommitted - 1) * 2.5
    + Math.max(0, projectedPowerLead - 5) * 0.45;
  let penalty = profile.patience * commitmentLoad * tier * (profile.opening ? 1.15 : 0.75);
  if (profile.opponentConservative && !options.plannedSequence) {
    penalty += Math.max(0, power - 3) * 3.2 * tier * (profile.opening ? 1 : 0.65);
  }
  if (profile.alreadyExposed && !profile.opponentMoreCommitted) {
    penalty += (2 + Math.max(0, profile.powerLead) * 0.35) * tier;
  }
  const reserveShortfall = Math.max(0, reserve - remainingEndurance);
  if (reserveShortfall && !options.passPressure) {
    penalty += reserveShortfall * (8 + 10 * tier);
  }

  let aggressionBonus = 0;
  if (profile.opponentConservative && !options.plannedSequence && power <= 3 && cost <= 1) aggressionBonus += 2.5 * tier;
  if (options.passPressure) aggressionBonus += 9 * tier;
  if (safeSequence) aggressionBonus += (8 + Math.max(0, power - 3) * 0.65) * tier;
  if (profile.pressureWindow) aggressionBonus += 6 * tier;
  if (profile.opponentMoreCommitted) aggressionBonus += 2.5 * tier;
  if (SOLO_AI.attitude === "aggressive" && safeSequence) aggressionBonus += 3 * tier;
  return {
    score: aggressionBonus - penalty,
    penalty,
    aggressionBonus,
    safeSequence,
    reserve,
    reserveShortfall,
    profile,
  };
}

function soloBoostOptionCandidates(playerIndex) {
  const player = state.players[playerIndex];
  return player.hand
    .filter((card) => canPlayBoost(playerIndex, card))
    .map((card) => {
      const sacrifice = chooseSoloSacrifice(playerIndex, card);
      if (!sacrifice) return null;
      const sacrificeScore = soloSacrificeScore(sacrifice);
      const rawBoostedScore = soloBoostScore(playerIndex, card) - sacrificeScore * 0.35;
      const normalScore = canPlayNormal(playerIndex, card) ? soloCardScore(playerIndex, card) : -Infinity;
      const passPressure = wouldOpponentBeAbleToPassAndWin(playerIndex, card, true);
      const threat = expertCounterBoostThreat(playerIndex, card, sacrifice);
      const remainingEndurance = player.endurance - effectiveCost(player, card);
      const informationDiscipline = soloCommitmentDiscipline(playerIndex, {
        card,
        boosted: true,
        cardsCommitted: 2,
        remainingEndurance,
        risk: threat.probability,
        canDefend: threat.canDefend,
        passPressure,
        plannedSequence: true,
      });
      const disruptionValue = boostDisruptionValue(playerIndex, threat, passPressure);
      const boostedScore = rawBoostedScore + disruptionValue - threat.danger + informationDiscipline.score;
      const catastrophicRisk = !state.mandatoryPlacement && !threat.canDefend && boostedScore < 0;
      const destroysSuppression = sacrifice.effectType === "removeOpponentLast";
      return {
        card,
        sacrifice,
        threat,
        boostedScore,
        rawBoostedScore,
        normalScore,
        passPressure,
        sacrificeScore,
        informationDiscipline,
        disruptionValue,
        rejected: catastrophicRisk || (destroysSuppression && !state.mandatoryPlacement),
        rejectionReason: catastrophicRisk ? "projection négative sans défense" : destroysSuppression ? "Suppression préservée" : null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.boostedScore - a.boostedScore);
}

function completeSoloScenarioPaths(paths, objective) {
  const completed = [...paths];
  const fallbacks = [
    { type: "pass", label: "sécuriser par la passe", score: 0 },
    { type: "end_turn", label: "clore après un effet", score: -2 },
    { type: "replan", label: "réévaluer après la réponse humaine", score: -4 },
  ];
  for (const fallback of fallbacks) {
    if (completed.length >= 3) break;
    if (!completed.some((path) => path.type === fallback.type)) completed.push({ ...fallback, objective });
  }
  return completed.slice(0, 3);
}

function buildSoloScenarioPlan(playerIndex) {
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  const doubleCard = player.hand.find((card) => card.effectType === "doubleLastShot" && canPlayNormal(playerIndex, card));
  const doubleProjection = doubleCard ? soloDoubleProjection(playerIndex, doubleCard) : null;
  const pointPaths = [];
  if (doubleCard && doubleProjection?.viable) {
    pointPaths.push({
      objective: "points",
      type: "effect",
      cardUid: doubleCard.uid,
      cardName: doubleCard.name,
      score: doubleProjection.score,
      projection: doubleProjection,
      label: `Double +${doubleProjection.duplicatedPower} puissance`,
    });
  }
  player.hand
    .filter((card) => isRemise(card) && card.uid !== doubleCard?.uid && canPlayNormal(playerIndex, card))
    .map((card) => ({ card, score: soloImmediateEffectValue(playerIndex, card) }))
    .filter((option) => option.score >= 6)
    .map((option) => ({
      objective: "points",
      type: "effect",
      cardUid: option.card.uid,
      cardName: option.card.name,
      score: option.score,
      label: `${option.card.name} pour améliorer le total final`,
    }))
    .forEach((path) => pointPaths.push(path));
  player.hand
    .filter((card) => !isRemise(card) && canPlayNormal(playerIndex, card))
    .map((card) => {
      const informationDiscipline = soloCommitmentDiscipline(playerIndex, { card });
      return {
        objective: "points",
        type: "normal",
        cardUid: card.uid,
        cardName: card.name,
        score: soloPlayableCoupScore(playerIndex, card) + informationDiscipline.score,
        projectedPower: player.power + getCardStats(player, card, false).power + projectedEndBonuses(player),
        informationDiscipline,
        label: `${card.name} pour la puissance finale`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .forEach((path) => pointPaths.push(path));

  const boostPaths = soloBoostOptionCandidates(playerIndex)
    .filter((option) => !option.rejected)
    .map((option) => ({
      objective: "boost",
      type: "boost",
      cardUid: option.card.uid,
      cardName: option.card.name,
      sacrificeUid: option.sacrifice.uid,
      sacrificeName: option.sacrifice.name,
      score: option.boostedScore,
      counterBoostProbability: option.threat.probability,
      canDefendCounterBoost: option.threat.canDefend,
      humanImplication: option.threat.probability > 0 ? "contre-BOOST possible" : "aucun contre-BOOST identifié",
      label: `${option.card.name} en BOOST`,
    }));

  const scenarios = {
    points: {
      objective: "points",
      paths: completeSoloScenarioPaths(pointPaths.sort((a, b) => b.score - a.score), "points"),
    },
    boost: {
      objective: "boost",
      paths: completeSoloScenarioPaths(boostPaths, "boost"),
    },
  };
  const pointScore = scenarios.points.paths[0]?.score ?? -Infinity;
  const boostScore = scenarios.boost.paths[0]?.type === "boost" ? scenarios.boost.paths[0].score : -Infinity;
  let selectedObjective = "points";
  if (state.mandatoryPlacement || state.boostAvailableFor === playerIndex) selectedObjective = boostScore > -Infinity ? "boost" : "points";
  else if (SOLO_AI.attitude === "aggressive" && boostScore >= pointScore - 4) selectedObjective = "boost";
  else if (SOLO_AI.attitude === "opportunistic" && boostScore > pointScore + 1) selectedObjective = "boost";
  else if (isSetDangerForPlayer(playerIndex) && boostScore > -Infinity) selectedObjective = "boost";
  const playablePaths = scenarios[selectedObjective].paths.filter((path) => !["pass", "end_turn", "replan"].includes(path.type));
  let selectedPath = chooseSoloScoredOption(playablePaths) || scenarios.points.paths[0];
  const legendaryPlan = normalizeAiIntelligence(SOLO_AI.style) === "legend"
    ? buildLegendarySequencePlan(playerIndex)
    : null;
  if (legendaryPlan?.best?.firstAction) {
    selectedObjective = legendaryPlan.best.objective;
    selectedPath = legendaryPlan.best.firstAction;
  }
  SOLO_AI.planRevision += 1;
  return {
    revision: SOLO_AI.planRevision,
    createdAt: new Date().toISOString(),
    attitude: SOLO_AI.attitude,
    selectedObjective,
    selectedPath,
    scenarios,
    legendaryPlan,
    resources: {
      playerEndurance: player.endurance,
      playerHand: player.hand.length,
      opponentEndurance: opponent.endurance,
      opponentHand: opponent.hand.length,
      knownOpponentCards: expertKnownOpponentCards(playerIndex).map(cardLogInfo),
      informationExposure: soloInformationExposureProfile(playerIndex),
    },
  };
}

function prepareSoloScenarioPlan(playerIndex) {
  if (shouldReevaluateSoloAttitude(playerIndex)) {
    chooseSoloAttitude(playerIndex, "plan contrarié par l'évolution de l'échange");
  }
  SOLO_AI.plan = buildSoloScenarioPlan(playerIndex);
  return SOLO_AI.plan;
}

function soloPlanLogInfo(plan) {
  if (!plan) return null;
  return {
    revision: plan.revision,
    attitude: plan.attitude,
    selectedObjective: plan.selectedObjective,
    selectedPath: plan.selectedPath,
    pointPaths: plan.scenarios?.points?.paths,
    boostPaths: plan.scenarios?.boost?.paths,
    legendarySequences: plan.legendaryPlan?.candidates,
    legendarySelectedSequence: plan.legendaryPlan?.best,
    resources: plan.resources,
  };
}

function soloOpponentResponseProjection(playerIndex) {
  const opponent = state.players[opponentOf(playerIndex)];
  const knownCards = expertKnownOpponentCards(playerIndex);
  const riskPool = knownCards.length ? knownCards : expertUnseenCards(playerIndex);
  const discount = Number(opponent.nextDiscount || 0);
  const canAffordAny = riskPool.some((card) => Math.max(0, card.cost - discount) <= opponent.endurance);
  const canCounterBoost = opponent.hand.length >= 2 && canAffordAny;
  const defensiveTrap = riskPool.some((card) => card.effectType === "jokerResponse")
    || riskPool.some((card) => getCardStats(opponent, card, false).placement >= 4)
    || riskPool.some((card) => ["nextPlacement", "nextPrecisionAndPlacement"].includes(card.effectType));
  let risk = 0.46;
  if (opponent.hand.length === 0) risk = 0;
  else if (opponent.endurance <= 0 && discount <= 0 && !opponent.freeBoostNext) risk = 0;
  else if (opponent.hand.length === 1) risk = canAffordAny ? 0.12 : 0;
  else if (!canAffordAny) risk = 0.04;
  else if (!canCounterBoost) risk = 0.16;
  else risk = defensiveTrap ? 0.44 : 0.32;
  risk = Math.min(0.98, risk * aiRiskProjectionFactor());
  return {
    handCount: opponent.hand.length,
    endurance: opponent.endurance,
    discount,
    canAffordAny,
    canCounterBoost,
    defensiveTrap,
    risk,
  };
}

function soloPassProjection(playerIndex) {
  const snapshot = soloPassDecisionSnapshot(playerIndex);
  const exchangeWinner = snapshot.projectedWinner;
  const exchangeScore = getProjectedExchangeSetScore(exchangeWinner, "power", snapshot.projectedPower);
  const projectedSetScore = state.setMatch.enabled ? previewSetMatchScore(exchangeWinner, exchangeScore) : null;
  const setOver = projectedSetScore ? isSetOver(projectedSetScore) : false;
  const setWinner = setOver ? leadingSetPlayer(projectedSetScore) : null;
  let matchClinched = false;
  if (setWinner === playerIndex && state.setMatch.targetSets) {
    matchClinched = state.setMatch.setsWon[playerIndex] + 1 >= state.setMatch.targetSets;
  }
  return { ...snapshot, exchangeScore, projectedSetScore, setOver, setWinner, matchClinched };
}

function legendaryEnduranceReserve(playerIndex, response = soloOpponentResponseProjection(playerIndex)) {
  if (isSetDangerForPlayer(playerIndex) || isMatchDangerForPlayer(playerIndex)) return 0;
  const opponent = state.players[opponentOf(playerIndex)];
  if (opponent.hand.length >= 3 && response.risk >= 0.36) return 2;
  if (opponent.hand.length >= 2 && response.risk >= 0.18) return 1;
  return 0;
}

function legendaryDefenseProfile(playerIndex, excludedUids = [], remainingEndurance = null, requiredPlacement = 5) {
  const player = state.players[playerIndex];
  const excluded = new Set(excludedUids.filter(Boolean));
  const endurance = remainingEndurance == null ? player.endurance : remainingEndurance;
  const remainingHand = player.hand.filter((card) => !excluded.has(card.uid));
  const emergencyCards = remainingHand.filter((card) => (
    isRemise(card)
    && ["jokerResponse", "removeOpponentLast"].includes(card.effectType)
    && effectiveCost(player, card) <= endurance
  ));
  const placementCards = remainingHand.filter((card) => (
    effectiveCost(player, card) <= endurance
    && getCardStats(player, card, false).placement >= requiredPlacement
  ));
  const canDefendBoost = expertCanDefendBoostWithCards(playerIndex, remainingHand, endurance, requiredPlacement);
  return {
    endurance,
    handCount: remainingHand.length,
    emergencyCount: emergencyCards.length,
    placementCount: placementCards.length,
    canDefendBoost,
    score: emergencyCards.length * 13 + placementCards.length * 4 + Math.min(3, endurance) * 3 + (canDefendBoost ? 12 : -18),
  };
}

function legendarySequenceResourceScore(playerIndex, excludedUids, remainingEndurance, threat) {
  const response = soloOpponentResponseProjection(playerIndex);
  const reserve = legendaryEnduranceReserve(playerIndex, response);
  const requiredPlacement = Math.max(4, ...(threat?.possibleCounters || []).map((card) => Number(card.boostPrecision || 0)));
  const defense = legendaryDefenseProfile(playerIndex, excludedUids, remainingEndurance, requiredPlacement);
  const reserveShortfall = Math.max(0, reserve - remainingEndurance);
  const exposedPenalty = threat?.probability >= 0.35 && !defense.canDefendBoost
    ? threat.probability * 36
    : 0;
  return {
    defense,
    reserve,
    score: defense.score - reserveShortfall * 16 - exposedPenalty,
  };
}

function legendaryEffectFollowUpBonus(effect, coup) {
  const bonuses = {
    nextPrecisionAndPlacement: 13,
    nextPlacement: 8,
    nextPrecision: 7,
    nextDiscount: 8,
    gainEndurance: 9,
    drawCard: 5,
    cancelOpponentNextEffect: 5,
    limitOpponentFamilies: 7,
    discardOpponent: 6,
    freeBoostNext: 5,
  };
  let score = bonuses[effect.effectType] ?? 2;
  if (["nextPlacement", "nextPrecisionAndPlacement"].includes(effect.effectType) && coup.placement >= 3) score += 3;
  if (effect.effectType === "nextDiscount" && coup.cost >= 2) score += 3;
  return score;
}

function legendaryEffectSequenceIsUseful(playerIndex, effect, coup) {
  if (effect.effectType !== "freeBoostNext") return true;
  if (!isFreeBoostNextWindow(playerIndex)) return false;
  const player = state.players[playerIndex];
  const enduranceAfterEffect = player.endurance - effectiveCost(player, effect);
  if (effectiveCost(player, coup) > enduranceAfterEffect) return false;
  return player.hand.some((card) => card.uid !== effect.uid && card.uid !== coup.uid);
}

function buildLegendarySequencePlan(playerIndex) {
  const player = state.players[playerIndex];
  const response = soloOpponentResponseProjection(playerIndex);
  const candidates = [];

  for (const card of player.hand.filter((candidate) => !isRemise(candidate) && canPlayNormal(playerIndex, candidate))) {
    const cost = effectiveCost(player, card);
    const threat = legendaryCounterBoostThreat(playerIndex, card);
    const resource = legendarySequenceResourceScore(playerIndex, [card.uid], player.endurance - cost, threat);
    const risk = threat.probability * (resource.defense.canDefendBoost ? 0.45 : 1);
    const informationDiscipline = soloCommitmentDiscipline(playerIndex, {
      card,
      remainingEndurance: player.endurance - cost,
      reserve: resource.reserve,
      risk,
      canDefend: resource.defense.canDefendBoost,
    });
    const score = soloPlayableCoupScore(playerIndex, card) + resource.score - risk * 24 + informationDiscipline.score;
    candidates.push({
      objective: "points",
      type: "normal_sequence",
      score,
      risk,
      counterBoostRemaining: threat.remainingCounterCount,
      counterBoostFamilies: threat.byFamily,
      canDefendCounterBoost: resource.defense.canDefendBoost,
      remainingEndurance: player.endurance - cost,
      reserve: resource.reserve,
      informationDiscipline,
      steps: [
        { actor: "ai", type: "normal", cardUid: card.uid, cardName: card.name },
        { actor: "opponent", type: "projected_response", probability: threat.probability },
        { actor: "ai", type: "projected_defense", available: resource.defense.canDefendBoost },
      ],
      firstAction: {
        objective: "points",
        type: "normal",
        cardUid: card.uid,
        cardName: card.name,
        score,
        sequenceType: "normal_response_defense",
      },
    });
  }

  for (const option of soloBoostOptionCandidates(playerIndex).filter((candidate) => !candidate.rejected)) {
    const remainingEndurance = player.endurance - effectiveCost(player, option.card);
    const excluded = [option.card.uid, option.sacrifice.uid];
    const threat = legendaryCounterBoostThreat(playerIndex, option.card, option.sacrifice);
    const resource = legendarySequenceResourceScore(playerIndex, excluded, remainingEndurance, threat);
    const risk = threat.probability * (resource.defense.canDefendBoost ? 0.35 : 1);
    const informationDiscipline = soloCommitmentDiscipline(playerIndex, {
      card: option.card,
      boosted: true,
      cardsCommitted: 2,
      remainingEndurance,
      reserve: resource.reserve,
      risk,
      canDefend: resource.defense.canDefendBoost,
      passPressure: option.passPressure,
      plannedSequence: true,
    });
    const score = option.rawBoostedScore + resource.score - risk * 34 + informationDiscipline.score;
    candidates.push({
      objective: "boost",
      type: "boost_sequence",
      score,
      risk,
      counterBoostRemaining: threat.remainingCounterCount,
      counterBoostFamilies: threat.byFamily,
      canDefendCounterBoost: resource.defense.canDefendBoost,
      remainingEndurance,
      reserve: resource.reserve,
      informationDiscipline,
      steps: [
        { actor: "ai", type: "boost", cardUid: option.card.uid, cardName: option.card.name, sacrificeUid: option.sacrifice.uid },
        { actor: "opponent", type: "counter_boost", probability: threat.probability },
        { actor: "ai", type: "projected_defense", available: resource.defense.canDefendBoost },
      ],
      firstAction: {
        objective: "boost",
        type: "boost",
        cardUid: option.card.uid,
        cardName: option.card.name,
        sacrificeUid: option.sacrifice.uid,
        sacrificeName: option.sacrifice.name,
        score,
        sequenceType: "boost_counter_defense",
        counterBoostProbability: threat.probability,
        canDefendCounterBoost: resource.defense.canDefendBoost,
      },
    });
  }

  if (!state.turnHasEffect[playerIndex] && !state.mandatoryPlacement) {
    const effects = player.hand.filter((card) => isRemise(card) && canPlayEffectMode(playerIndex, card));
    for (const effect of effects) {
      const effectCost = effectiveCost(player, effect);
      for (const coup of player.hand.filter((card) => card.uid !== effect.uid && !isRemise(card) && canPlayNormal(playerIndex, card))) {
        const coupCost = effectiveCost(player, coup);
        if (effectCost + coupCost > player.endurance) continue;
        if (!legendaryEffectSequenceIsUseful(playerIndex, effect, coup)) continue;
        const threat = legendaryCounterBoostThreat(playerIndex, coup);
        const remainingEndurance = player.endurance - effectCost - coupCost;
        const resource = legendarySequenceResourceScore(playerIndex, [effect.uid, coup.uid], remainingEndurance, threat);
        const effectValue = Math.max(soloImmediateEffectValue(playerIndex, effect), soloEffectScore(effect) * 1.5);
        const synergy = legendaryEffectFollowUpBonus(effect, coup);
        const risk = threat.probability * (resource.defense.canDefendBoost ? 0.4 : 1);
        const informationDiscipline = soloCommitmentDiscipline(playerIndex, {
          power: getCardStats(player, coup, false).power,
          cost: effectCost + coupCost,
          cardsCommitted: 2,
          remainingEndurance,
          reserve: resource.reserve,
          risk,
          canDefend: resource.defense.canDefendBoost,
          plannedSequence: true,
        });
        const score = effectValue + synergy + soloPlayableCoupScore(playerIndex, coup) + resource.score - risk * 27 + informationDiscipline.score;
        candidates.push({
          objective: "points",
          type: "effect_coup_sequence",
          score,
          risk,
          counterBoostRemaining: threat.remainingCounterCount,
          counterBoostFamilies: threat.byFamily,
          canDefendCounterBoost: resource.defense.canDefendBoost,
          remainingEndurance,
          reserve: resource.reserve,
          informationDiscipline,
          steps: [
            { actor: "ai", type: "effect", cardUid: effect.uid, cardName: effect.name },
            { actor: "ai", type: "normal", cardUid: coup.uid, cardName: coup.name },
            { actor: "opponent", type: "projected_response", probability: threat.probability },
          ],
          firstAction: {
            objective: "points",
            type: "effect",
            cardUid: effect.uid,
            cardName: effect.name,
            score,
            sequenceType: "effect_then_coup",
            followUpCardUid: coup.uid,
            followUpCardName: coup.name,
          },
        });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score || a.risk - b.risk);
  return {
    response,
    best: candidates[0] ?? null,
    candidates: candidates.slice(0, 5).map((candidate) => ({
      objective: candidate.objective,
      type: candidate.type,
      score: Math.round(candidate.score * 10) / 10,
      risk: Math.round(candidate.risk * 1000) / 1000,
      counterBoostRemaining: candidate.counterBoostRemaining ?? null,
      counterBoostFamilies: candidate.counterBoostFamilies ?? null,
      canDefendCounterBoost: candidate.canDefendCounterBoost,
      remainingEndurance: candidate.remainingEndurance,
      reserve: candidate.reserve,
      informationDiscipline: candidate.informationDiscipline,
      steps: candidate.steps,
    })),
  };
}

function legendaryPassSafetyDecision(playerIndex, legendaryPlan) {
  if (normalizeAiIntelligence(SOLO_AI.style) !== "legend" || state.mandatoryPlacement || hasPlayedThisTurn(playerIndex)) return null;
  const best = legendaryPlan?.best;
  if (!best) return null;
  if (best.counterBoostRemaining === 0 || best.risk < 0.25) return null;
  const passProjection = soloPassProjection(playerIndex);
  if (passProjection.projectedWinner === playerIndex) return null;
  const opponentIndex = opponentOf(playerIndex);
  const losesSet = passProjection.setOver && passProjection.setWinner === opponentIndex;
  const losesMatch = losesSet
    && state.setMatch.targetSets
    && state.setMatch.setsWon[opponentIndex] + 1 >= state.setMatch.targetSets;
  if (losesMatch) return null;
  const exposed = !best.canDefendCounterBoost && best.risk >= 0.48;
  const belowReserve = best.remainingEndurance < best.reserve && best.risk >= 0.38;
  const acceptsLostSet = losesSet
    && state.setMatch.setsWon[playerIndex] > state.setMatch.setsWon[opponentIndex]
    && best.risk >= 0.78;
  if ((!losesSet && (exposed || belowReserve)) || acceptsLostSet) {
    return {
      reason: acceptsLostSet ? "préserver le match plutôt que subir un BOOST probable" : "concéder l'échange pour conserver une défense",
      passProjection,
      sequence: {
        type: best.type,
        risk: best.risk,
        canDefendCounterBoost: best.canDefendCounterBoost,
        remainingEndurance: best.remainingEndurance,
        reserve: best.reserve,
      },
    };
  }
  return null;
}

function chooseSoloPunitiveContinuation(playerIndex, plan) {
  if (!plan || state.mandatoryPlacement || hasPlayedThisTurn(playerIndex)) return null;
  const attemptChance = {
    amateur: 0.08,
    normal: 0.2,
    expert: 0.82,
    champion: 1,
    legend: 1,
  }[normalizeAiIntelligence(SOLO_AI.style)] ?? 0.08;
  if (Math.random() > attemptChance) return null;
  const response = soloOpponentResponseProjection(playerIndex);
  const passProjection = soloPassProjection(playerIndex);
  const legendary = normalizeAiIntelligence(SOLO_AI.style) === "legend";
  if (legendary && (passProjection.matchClinched || (passProjection.setOver && passProjection.setWinner === playerIndex))) return null;
  const threshold = legendary
    ? 0.08
    : SOLO_AI.attitude === "aggressive" ? 0.34 : SOLO_AI.attitude === "prudent" ? 0.07 : 0.2;
  if ((passProjection.matchClinched || (passProjection.setOver && passProjection.setWinner === playerIndex)) && response.risk > 0.02) return null;
  if (response.risk > threshold) return null;
  const alternateObjective = plan.selectedObjective === "boost" ? "points" : "boost";
  const paths = [
    ...(plan.scenarios?.[plan.selectedObjective]?.paths || []),
    ...(plan.scenarios?.[alternateObjective]?.paths || []),
  ].filter((path) => ["boost", "normal", "effect"].includes(path.type));
  const selected = paths.find((path) => {
    if (path.type === "boost" && response.canCounterBoost && !path.canDefendCounterBoost) return false;
    if (path.type === "effect" && path.cardName !== "Double") return false;
    return true;
  });
  return selected ? { ...selected, response, passProjection } : null;
}

function executeSoloPlanPath(playerIndex, path) {
  if (!path) return false;
  if (path.type === "boost") {
    playCard(playerIndex, path.cardUid, true, path.sacrificeUid);
    return true;
  }
  if (path.type === "effect") {
    playCard(playerIndex, path.cardUid, false, null, "effect");
    return true;
  }
  if (path.type === "normal") {
    playCard(playerIndex, path.cardUid);
    return true;
  }
  return false;
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
  if (aiIntelligenceAtLeast("expert") && exchangeWinner === playerIndex && shouldExpertPlayForCleanerSetScore(playerIndex, projectedPowers)) {
    if (normalizeAiIntelligence(SOLO_AI.style) === "legend" && soloOpponentResponseProjection(playerIndex).risk > 0.08) return true;
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
  if (isMatchDangerForPlayer(playerIndex) || isSetDangerForPlayer(playerIndex) || wouldPassLoseSetOrMatch(playerIndex)) return false;
  if (hasSafeSoloContinuation(playerIndex)) return false;
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

function hasSafeSoloContinuation(playerIndex) {
  const player = state.players[playerIndex];
  const requiredPlacement = state.lastCard?.precision ?? 0;
  const directCoup = player.hand.some((card) => {
    if (isRemise(card) || !canPlayNormal(playerIndex, card)) return false;
    if (!state.lastCard || state.turnIgnoresPlacement[playerIndex]) return true;
    return totalTurnPlacement(playerIndex, card, false) >= requiredPlacement;
  });
  if (directCoup) return true;
  const defensePlan = chooseSoloRemiseDefensePlan(playerIndex);
  return Boolean(defensePlan?.coup || defensePlan?.remises?.length);
}

function soloLegalActionInventory(playerIndex) {
  const player = state.players[playerIndex];
  if (!player || state.gameOver || state.activePlayer !== playerIndex) {
    return { coups: [], boosts: [], effects: [], placementRemises: [], canEnd: false, canProgress: false };
  }
  const coups = player.hand.filter((card) => !isRemise(card) && canPlayNormal(playerIndex, card));
  const boosts = player.hand
    .filter((card) => canPlayBoost(playerIndex, card))
    .map((card) => ({
      card,
      sacrifice: player.hand.find((candidate) => candidate.uid !== card.uid) || null,
    }))
    .filter((option) => option.sacrifice);
  const effects = player.hand.filter((card) => (
    isRemise(card)
    && canPlayEffectMode(playerIndex, card)
    && soloImmediateEffectValue(playerIndex, card) > 0
  ));
  const defensePlan = chooseSoloRemiseDefensePlan(playerIndex);
  const placementRemises = defensePlan?.remises?.length
    ? [...defensePlan.remises]
    : !state.mandatoryPlacement
      ? player.hand.filter((card) => (
        isRemise(card)
        && canPlayNormal(playerIndex, card)
        && getCardStats(player, card, false).placement > 0
      ))
      : [];
  const canEnd = canEndTurn(playerIndex);
  return {
    coups,
    boosts,
    effects,
    placementRemises,
    canEnd,
    canProgress: Boolean(coups.length || boosts.length || effects.length || placementRemises.length || canEnd),
  };
}

function wouldPassLoseSetOrMatch(playerIndex) {
  if (!state.setMatch.enabled || hasPlayedThisTurn(playerIndex)) return false;
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
  const exchangeScore = getProjectedExchangeSetScore(exchangeWinner, "power", projectedPowers);
  const projectedSetScore = previewSetMatchScore(exchangeWinner, exchangeScore);
  if (!isSetOver(projectedSetScore)) return false;
  const setWinner = leadingSetPlayer(projectedSetScore);
  if (setWinner === playerIndex) return false;
  if (!state.setMatch.targetSets) return true;
  const projectedSetsWon = [...state.setMatch.setsWon];
  projectedSetsWon[setWinner] += 1;
  return projectedSetsWon[setWinner] >= state.setMatch.targetSets || isSetDangerForPlayer(playerIndex);
}

function isExpertVulnerableToCounterPressure(playerIndex) {
  if (!aiIntelligenceAtLeast("expert")) return false;
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  if (player.endurance > 2 || opponent.hand.length < 2 || !state.lastCard) return false;
  const unseen = expertUnseenCards(playerIndex);
  const knownOpponentCards = expertKnownOpponentCards(playerIndex);
  const riskPool = knownOpponentCards.length ? knownOpponentCards : unseen;
  if (!riskPool.length) return false;
  const possibleBoostCards = riskPool
    .filter((card) => !isRemise(card) && card.family !== "Service")
    .filter((card) => effectiveCost(opponent, card) <= opponent.endurance)
    .filter((card) => state.boostAvailableFor === opponentOf(playerIndex) || canFamilyBoostAfter(state.lastCard.family, card.family));
  const probability = knownOpponentCards.length
    ? (possibleBoostCards.length ? Math.min(0.95, possibleBoostCards.length / Math.max(1, knownOpponentCards.length) + 0.35) : 0)
    : Math.min(0.95, (possibleBoostCards.length / unseen.length) * Math.max(1, opponent.hand.length - 1));
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
    ...(player.knownOpponentHand?.cardIds ?? []),
    ...state.players.flatMap((candidate) => candidate.played.map((card) => card.id)),
  ]);
}

function expertUnseenCards(playerIndex) {
  const visibleIds = allVisibleCardIdsForExpert(playerIndex);
  return CARD_LIBRARY.filter((card) => !visibleIds.has(card.id));
}

function expertKnownOpponentCards(playerIndex) {
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  if (player.knownOpponentHand?.opponentIndex !== opponentIndex) return [];
  const remainingKnownUids = new Set(player.knownOpponentHand.cardUids ?? []);
  if (remainingKnownUids.size) {
    return state.players[opponentIndex].hand.filter((card) => remainingKnownUids.has(card.uid));
  }
  const remainingKnownIds = new Set(player.knownOpponentHand.cardIds ?? []);
  return state.players[opponentIndex].hand.filter((card) => remainingKnownIds.has(card.id));
}

function canFamilyBoostAfter(previousFamily, cardFamily) {
  return COLOR_BOOST_RULES[cardFamily]?.includes(previousFamily);
}

function probabilityAtLeastOneCard(totalCards, matchingCards, draws) {
  const total = Math.max(0, Number(totalCards || 0));
  const matches = Math.max(0, Math.min(total, Number(matchingCards || 0)));
  const sample = Math.max(0, Math.min(total, Number(draws || 0)));
  if (!matches || !sample || !total) return 0;
  if (sample > total - matches) return 1;
  let missesOnly = 1;
  for (let index = 0; index < sample; index += 1) {
    missesOnly *= (total - matches - index) / (total - index);
  }
  return Math.max(0, Math.min(1, 1 - missesOnly));
}

function legendaryUnavailableCardIds(playerIndex) {
  const player = state.players[playerIndex];
  return new Set([
    ...player.hand.map((card) => card.id),
    ...state.players.flatMap((candidate) => candidate.played.flatMap((card) => [card.id, card.sacrificedCard?.id].filter(Boolean))),
    ...(state.discardedCards ?? []).map((card) => card.id),
  ]);
}

function legendaryCounterBoostThreat(playerIndex, exposedCard, sacrifice = null) {
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  const boosted = Boolean(sacrifice);
  const placementExposure = Boolean(
    state.lastCard
    && !state.turnIgnoresPlacement[playerIndex]
    && !state.turnCannotOpenBoost[playerIndex]
    && totalTurnPlacement(playerIndex, exposedCard, boosted) < state.lastCard.precision
  );
  const allPotentialCounters = CARD_LIBRARY
    .filter((card) => !isRemise(card) && card.family !== "Service")
    .filter((card) => placementExposure || canFamilyBoostAfter(exposedCard.family, card.family));
  const colorExposure = !placementExposure && allPotentialCounters.length > 0;
  const unavailableIds = legendaryUnavailableCardIds(playerIndex);
  const remainingCards = CARD_LIBRARY.filter((card) => !unavailableIds.has(card.id));
  const remainingCounters = allPotentialCounters
    .filter((card) => !unavailableIds.has(card.id))
    .filter((card) => effectiveCost(opponent, card) <= opponent.endurance);
  const knownOpponentCards = expertKnownOpponentCards(playerIndex);
  const knownIds = new Set(knownOpponentCards.map((card) => card.id));
  const knownCounters = remainingCounters.filter((card) => knownIds.has(card.id));
  const unknownCards = remainingCards.filter((card) => !knownIds.has(card.id));
  const unknownCounters = remainingCounters.filter((card) => !knownIds.has(card.id));
  const unknownHandSlots = Math.max(0, opponent.hand.length - knownOpponentCards.length);
  let probability = 0;
  if (opponent.hand.length >= 2 && opponent.endurance > 0 && (placementExposure || colorExposure)) {
    probability = knownCounters.length
      ? 1
      : probabilityAtLeastOneCard(unknownCards.length, unknownCounters.length, unknownHandSlots);
  }
  const requiredPlacement = remainingCounters.reduce((max, card) => Math.max(max, Number(card.boostPrecision || 0)), 0);
  const remainingHand = player.hand.filter((card) => card.uid !== exposedCard.uid && card.uid !== sacrifice?.uid);
  const remainingEndurance = player.endurance - effectiveCost(player, exposedCard);
  const canDefend = requiredPlacement === 0
    || expertCanDefendBoostWithCards(playerIndex, remainingHand, remainingEndurance, requiredPlacement);
  const counterFamilies = [...new Set(allPotentialCounters.map((card) => card.family))];
  const byFamily = Object.fromEntries(counterFamilies.map((family) => [family, {
    total: allPotentialCounters.filter((card) => card.family === family).length,
    remaining: remainingCounters.filter((card) => card.family === family).length,
    knownInOpponentHand: knownCounters.filter((card) => card.family === family).length,
  }]));
  const humanEndThreat = opponentIndex === 0 ? playerEndThreatScore(opponent) : 0;
  const danger = probability * (canDefend ? 8 : 30 + requiredPlacement * 2)
    + humanEndThreat * 0.65 * aiRiskProjectionFactor();
  return {
    probability,
    canDefend,
    danger,
    possibleCounters: remainingCounters,
    remainingCounterCount: remainingCounters.length,
    knownCounterCount: knownCounters.length,
    placementExposure,
    colorExposure,
    byFamily,
  };
}

function expertCounterBoostThreat(playerIndex, boostedCard, sacrifice = null) {
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  if (opponent.hand.length < 2 || opponent.endurance <= 0) {
    return { probability: 0, canDefend: true, danger: 0, possibleCounters: [] };
  }
  const unseen = expertUnseenCards(playerIndex);
  const knownOpponentCards = expertKnownOpponentCards(playerIndex);
  const riskPool = knownOpponentCards.length ? knownOpponentCards : unseen;
  const possibleCounters = riskPool
    .filter((card) => !isRemise(card) && card.family !== "Service")
    .filter((card) => canFamilyBoostAfter(boostedCard.family, card.family))
    .filter((card) => effectiveCost(opponent, card) <= opponent.endurance);
  const probability = knownOpponentCards.length
    ? (possibleCounters.length ? Math.min(0.98, possibleCounters.length / Math.max(1, knownOpponentCards.length) + 0.4) : 0)
    : unseen.length
    ? Math.min(0.95, (possibleCounters.length / unseen.length) * Math.max(1, opponent.hand.length - 1))
    : 0;
  const requiredPlacement = possibleCounters.reduce((max, card) => Math.max(max, card.boostPrecision), 0);
  const remainingHand = player.hand.filter((card) => card.uid !== boostedCard.uid && card.uid !== sacrifice?.uid);
  const remainingEndurance = player.endurance - effectiveCost(player, boostedCard);
  const canDefend = requiredPlacement === 0 || expertCanDefendBoostWithCards(playerIndex, remainingHand, remainingEndurance, requiredPlacement);
  const humanEndThreat = opponentIndex === 0 ? playerEndThreatScore(opponent) : 0;
  const projectedProbability = Math.min(0.98, probability * aiRiskProjectionFactor());
  const danger = projectedProbability * (canDefend ? 8 : 28 + requiredPlacement * 2) + humanEndThreat * 0.65 * aiRiskProjectionFactor();
  return { probability: projectedProbability, canDefend, danger, possibleCounters };
}

function expertCanDefendBoostWithCards(playerIndex, cards, endurance, requiredPlacement) {
  if (endurance < 0) return false;
  const player = state.players[playerIndex];
  const opponentCanCancelEffect = Boolean(state.players[opponentOf(playerIndex)]?.cancelNextOpponentEffect);
  if (!opponentCanCancelEffect && cards.some((card) => isRemise(card) && ["jokerResponse", "removeOpponentLast"].includes(card.effectType) && effectiveCost(player, card) <= endurance)) {
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

function playerEndThreatScore(player) {
  const projected = projectedEndBonuses(player);
  const activeBonusPressure = player.endBonuses.reduce((score, bonus) => {
    if (bonus.type === "doubleLastShot") return score + 10;
    if (bonus.type === "boostedBonus") return score + 8;
    return score + 4;
  }, 0);
  return projected + activeBonusPressure;
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
        score: 42 + remisePlacement - overPlacement * 2 - remiseCost * 8 + aiScoreNoise(),
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
        score: 50 + soloPlayableCoupScore(playerIndex, coup) + totalPlacement - overPlacement * 2 - remiseCost * 8 + aiScoreNoise(),
      });
    }
  }
  options.sort((a, b) => b.score - a.score);
  const preservesSuppression = options.filter((option) => (
    !option.remises.some((card) => card.effectType === "removeOpponentLast")
  ));
  if (preservesSuppression.length) return preservesSuppression[0];
  if (!state.mandatoryPlacement) return null;
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
  const opponent = state.players[opponentOf(playerIndex)];
  if (opponent.cancelNextOpponentEffect) {
    if (state.mandatoryPlacement) return null;
    return chooseSoloCancellationBait(playerIndex);
  }
  const effects = player.hand
    .filter((card) => isRemise(card) && canPlayEffectMode(playerIndex, card))
    .map((card) => ({ card, score: soloImmediateEffectValue(playerIndex, card) }))
    .filter((choice) => choice.score >= 6)
    .sort((a, b) => b.score - a.score);
  return effects[0]?.card ?? null;
}

function chooseSoloCancellationBait(playerIndex) {
  const player = state.players[playerIndex];
  const candidates = player.hand
    .filter((card) => isRemise(card) && card.effectType !== "removeOpponentLast" && canPlayEffectMode(playerIndex, card))
    .filter((card) => effectiveCost(player, card) <= 2)
    .map((card) => {
      const remainingEndurance = player.endurance - effectiveCost(player, card);
      const followUp = player.hand
        .filter((candidate) => candidate.uid !== card.uid && !isRemise(candidate))
        .filter((candidate) => effectiveCost(player, candidate) <= remainingEndurance)
        .filter((candidate) => satisfiesFamilyLimit(player, candidate) && satisfiesReturnServiceRestriction(candidate))
        .sort((a, b) => soloPlayableCoupScore(playerIndex, b) - soloPlayableCoupScore(playerIndex, a))[0];
      return {
        card,
        followUp,
        score: followUp
          ? soloPlayableCoupScore(playerIndex, followUp) - effectiveCost(player, card) * 10 - soloEffectPreservationScore(card)
          : -Infinity,
      };
    })
    .filter((choice) => choice.followUp)
    .sort((a, b) => b.score - a.score || effectiveCost(player, a.card) - effectiveCost(player, b.card));
  return candidates[0]?.card ?? null;
}

function soloImmediateEffectValue(playerIndex, card) {
  const opponentIndex = opponentOf(playerIndex);
  const opponent = state.players[opponentIndex];
  if (card.effectType === "removeOpponentLast") {
    if (opponent.cancelNextOpponentEffect) return 0;
    const target = bestRemovalTargetFor(playerIndex);
    return target && isSoloRemovalWorthCost(playerIndex, card, target)
      ? removalTargetScore(target) - effectiveCost(state.players[playerIndex], card) * 2
      : 0;
  }
  if (card.effectType === "jokerResponse" && (state.mandatoryPlacementReason === "boost" || state.lastCard?.boosted)) return 14;
  if (card.effectType === "freeBoostNext" && isFreeBoostNextWindow(playerIndex) && player.hand.some((candidate) => !isRemise(candidate))) return 6;
  if (card.effectType === "doubleLastShot") {
    const projection = soloDoubleProjection(playerIndex, card);
    return projection.viable ? projection.score : 0;
  }
  return 0;
}

function isSoloRemovalWorthCost(playerIndex, card, target) {
  if (!card || !target) return false;
  const player = state.players[playerIndex];
  const cost = effectiveCost(player, card);
  const targetValue = removalTargetScore(target);
  const isMandatoryDefense = state.mandatoryPlacement
    && state.mandatoryPlacementSourceUid === target.playedUid;
  const removesActiveThreat = Boolean(
    target.boosted
    || target.copiedSmashThreat
    || target.copiedEffectType
    || ["smashThreat", "limitOpponentFamilies", "boostedBonusAtEnd", "doubleLastShot"].includes(target.effectType),
  );
  if (isMandatoryDefense) return true;
  if (cost >= 3 && !removesActiveThreat) return targetValue >= 26;
  return targetValue >= 14 + cost * 3;
}

function chooseSoloBoostPlay(playerIndex) {
  if (shouldAvoidOptionalBoostForSet(playerIndex)) return null;
  const options = soloBoostOptionCandidates(playerIndex).filter((option) => !option.rejected);
  const best = chooseSoloScoredOption(options, (option) => option.boostedScore);
  if (!best) return null;
  const legendary = normalizeAiIntelligence(SOLO_AI.style) === "legend";
  const styleBoostMargin = legendary
    ? SOLO_AI.attitude === "aggressive" ? 0 : SOLO_AI.attitude === "prudent" ? 3 : 1
    : SOLO_AI.attitude === "aggressive" ? 2 : SOLO_AI.attitude === "prudent" ? 7 : 4;
  const opponentEndThreat = playerEndThreatScore(state.players[opponentOf(playerIndex)]);
  const unsafeRiskThreshold = legendary
    ? opponentEndThreat > 0 ? 0.2 : 0.28
    : opponentEndThreat > 0 ? 0.32 : 0.42;
  const expertBlocksRisk = aiIntelligenceAtLeast("expert")
    && !state.mandatoryPlacement
    && state.boostAvailableFor !== playerIndex
    && !best.passPressure
    && !isSetDangerForPlayer(playerIndex)
    && best.threat.probability >= unsafeRiskThreshold
    && !best.threat.canDefend;
  const forcedButIrrational = !best.threat.canDefend && best.boostedScore < 0;
  const shouldBoost = !expertBlocksRisk
    && !forcedButIrrational
    && (state.mandatoryPlacement || state.boostAvailableFor === playerIndex || isSetDangerForPlayer(playerIndex) || wouldPassLoseSetOrMatch(playerIndex) || best.passPressure || best.boostedScore >= best.normalScore + styleBoostMargin);
  if (aiIntelligenceAtLeast("expert") && best.threat.probability > 0.3) {
    state.log.unshift(`IA ${aiStyleLabel()} : risque de contre-boost estimé ${Math.round(best.threat.probability * 100)}%${best.threat.canDefend ? ", défense possible." : ", défense fragile."}`);
  }
  return shouldBoost ? {
    card: best.card,
    sacrifice: best.sacrifice,
    analysis: {
      boostedScore: best.boostedScore,
      rawBoostedScore: best.rawBoostedScore,
      normalScore: best.normalScore,
      sacrificeScore: best.sacrificeScore,
      passPressure: best.passPressure,
      counterBoostProbability: best.threat.probability,
      canDefendCounterBoost: best.threat.canDefend,
    },
  } : null;
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
  const candidates = player.hand.filter((candidate) => candidate.uid !== boostedCard.uid);
  const preservesSuppression = candidates.filter((candidate) => candidate.effectType !== "removeOpponentLast");
  const pool = !state.mandatoryPlacement && preservesSuppression.length ? preservesSuppression : candidates;
  return pool
    .sort((a, b) => soloSacrificeScore(a) - soloSacrificeScore(b))[0] ?? null;
}

function chooseSoloNormalCoup(playerIndex) {
  const player = state.players[playerIndex];
  const options = player.hand
    .filter((card) => !isRemise(card) && canPlayNormal(playerIndex, card))
    .map((card) => ({
      card,
      score: soloPlayableCoupScore(playerIndex, card) + soloCommitmentDiscipline(playerIndex, { card }).score + aiScoreNoise(),
    }));
  return chooseSoloScoredOption(options)?.card ?? null;
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
  const effectWillBeCanceled = state.players[opponentOf(playerIndex)].cancelNextOpponentEffect;
  const remises = player.hand
    .filter((card) => isRemise(card) && canPlayEffectMode(playerIndex, card))
    .filter((card) => !effectWillBeCanceled || (card.effectType !== "removeOpponentLast" && effectiveCost(player, card) <= 2))
    .filter((card) => soloImmediateEffectValue(playerIndex, card) > 0);
  const joker = remises
    .filter((card) => card.effectType === "jokerResponse" && state.lastCard?.boosted)
    .sort((a, b) => soloCardScore(playerIndex, b) - soloCardScore(playerIndex, a))[0];
  if (joker) return joker;
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
  if (aiIntelligenceAtLeast("champion") && card.family === "Smash" && state.players[opponentOf(playerIndex)].endurance <= 0) {
    score += state.mandatoryPlacement ? 6 : 18;
  }
  if (aiIntelligenceAtLeast("expert") && !boosted && state.boostAvailableFor !== playerIndex && opensLikelyBoostWindowForOpponent(playerIndex, card)) {
    score -= state.players[playerIndex].endurance <= 2 ? 8 : 3;
  }
  return score;
}

function aiScoreNoise(scale = 1.4) {
  if (normalizeAiIntelligence(SOLO_AI.style) === "legend") return 0;
  const multiplier = {
    amateur: 7,
    normal: 5,
    expert: 0.8,
    champion: 0.15,
    legend: 0,
  }[normalizeAiIntelligence(SOLO_AI.style)] ?? 7;
  const adjustedScale = isLateCircuitRoundWithoutBonus(SOLO_AI.playerIndex) ? Math.min(0.45, scale) : scale;
  return (Math.random() - 0.5) * adjustedScale * multiplier;
}

function opensLikelyBoostWindowForOpponent(playerIndex, card) {
  if (!state.lastCard || state.turnIgnoresPlacement[playerIndex] || state.turnCannotOpenBoost[playerIndex]) return false;
  const player = state.players[playerIndex];
  const opponent = state.players[opponentOf(playerIndex)];
  if (opponent.hand.length < 2 || opponent.endurance <= 0) return false;
  const totalPlacement = totalTurnPlacement(playerIndex, card, false);
  return totalPlacement < state.lastCard.precision && !expertCanDefendBoostWithCards(playerIndex, player.hand.filter((item) => item.uid !== card.uid), player.endurance - effectiveCost(player, card), state.lastCard.precision);
}

function soloBoostScore(playerIndex, card) {
  const styleBonus = SOLO_AI.attitude === "aggressive" ? 4 : SOLO_AI.attitude === "prudent" ? 0 : 2;
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
  return card.power * 3 + card.placement + card.precision - card.cost + soloEffectPreservationScore(card);
}

function soloEffectPreservationScore(card) {
  const preservation = {
    removeOpponentLast: 30,
    jokerResponse: 18,
    freeBoostNext: 13,
    doubleLastShot: 16,
    drawCard: 10,
    gainEndurance: 9,
    nextPrecisionAndPlacement: 9,
    cancelOpponentNextEffect: 9,
    limitOpponentFamilies: 8,
    boostedBonusAtEnd: 8,
    discardOpponent: 7,
    nextPlacement: 6,
    nextPrecision: 6,
    nextDiscount: 5,
  };
  return preservation[card.effectType] ?? 2;
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

function applySurfaceBonusAfterPlay(playerIndex, playedCard, costPaid) {
  const player = state.players[playerIndex];
  if (isRemise(playedCard)) return;
  for (const bonus of surfaceBonusesForPlayer(player)) {
    if (bonus.id === "grassBoostPrecisionDraw" && playedCard.boosted) {
      addNextPrecisionBonus(player, 1, playedCard.playedUid);
      const drawn = drawCards(player, 1);
      state.log.unshift(`${bonus.label} : ${displayPlayerName(player)} gagne +1 précision${drawn ? " et pioche 1 carte" : ""}.`);
    }
    if (bonus.id === "hardCheapShotDraw" && costPaid === 1) {
      const drawn = drawCards(player, 1);
      state.log.unshift(drawn ? `${bonus.label} : ${displayPlayerName(player)} pioche 1 carte.` : `${bonus.label} : deck vide.`);
    }
    if (bonus.id === "hardBoostPlacement" && playedCard.boosted) {
      addNextPlacementBonus(player, 2, playedCard.playedUid);
      state.log.unshift(`${bonus.label} : ${displayPlayerName(player)} gagne +2 placement sur sa carte suivante.`);
    }
    if (bonus.id === "clayForehandEndurance" && playedCard.family === "Coup droit") {
      player.endurance += 1;
      state.log.unshift(`${bonus.label} : ${displayPlayerName(player)} récupère 1 endurance.`);
    }
  }
}

function applyOpponentLowPowerCharacterTriggers(cardOwnerIndex, playedCard) {
  const opponentIndex = opponentOf(cardOwnerIndex);
  const opponent = state.players[opponentIndex];
  const watchers = opponent.placementPerOpponentLowPowerCardBonuses ?? [];
  if (!watchers.length || !playedCard?.playedUid) return;
  const playedPower = playedCard.cardPowerGained ?? playedCard.powerGained ?? playedCard.power ?? 0;
  for (const watcher of watchers) {
    watcher.seenPlayedUids = watcher.seenPlayedUids ?? [];
    if (watcher.seenPlayedUids.includes(playedCard.playedUid)) continue;
    watcher.seenPlayedUids.push(playedCard.playedUid);
    if (playedPower < (watcher.threshold ?? 5)) {
      addNextAnyPlacementBonus(opponent, watcher.value ?? 2, watcher.sourceUid);
      state.log.unshift(`${displayPlayerName(opponent)} gagne +${watcher.value ?? 2} placement sur sa prochaine carte : l'adversaire vient de jouer une carte à puissance inférieure à ${watcher.threshold ?? 5}.`);
    }
  }
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
  if (!boosted && isRemise(card) && remiseMode === "effect" && !canPlayEffectMode(playerIndex, card)) return;
  state.turnDirty = true;
  markLocalServerDirty(playerIndex);

  const opponentIndex = opponentOf(playerIndex);
  const beforeContext = {
    player: playerLogInfo(player),
    opponent: playerLogInfo(state.players[opponentIndex]),
    constraints: constraintsLogInfo(),
  };
  const answeredBoostConstraint = !boosted && Boolean(state.lastCard?.boosted || (state.mandatoryPlacement && state.mandatoryPlacementReason === "boost"));
  if (answeredBoostConstraint && !boosted) {
    state.turnCannotOpenBoost[playerIndex] = true;
  }
  const endsTurn = !isRemise(card);
  const isOpeningServe = endsTurn && playerIndex === state.server && isOpeningServeAvailable();
  if (isOpeningServe) {
    state.openingServePlayed = true;
  }
  const countsPlacement = !isRemise(card) || remiseMode === "placement";
  const appliesEffect = !isRemise(card) || remiseMode === "effect";
  const cost = effectiveCost(player, card);
  const rawStats = getCardStats(player, card, boosted);
  const stats = {
    ...rawStats,
    placement: countsPlacement ? rawStats.placement : 0,
  };
  state.turnEffectPlacement[playerIndex] = isRemise(card) && remiseMode === "effect" ? rawStats.placement : 0;
  const combinedPlacement = state.turnPlacement[playerIndex] + stats.placement;
  const placementWasInsufficient = Boolean(endsTurn && state.lastCard && combinedPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]);

  player.endurance -= cost;
  clearNextAnyCardBonuses(player);
  if (endsTurn) {
    clearNextShotBonuses(player);
  }
  if (boosted) {
    player.freeBoostNext = false;
    player.freeBoostNextSourceUid = null;
  }

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
    remiseMode: isRemise(card) ? remiseMode : null,
    sacrificedCard,
    isServiceTurn: isOpeningServe,
    costPaid: cost,
    powerGained: stats.power,
    cardPowerGained: rawStats.power,
    basePowerGained: boosted ? card.boostPower : card.power,
    effectPowerGained: 0,
    answeredBoostConstraint,
    precision: stats.precision,
    placement: stats.placement,
    turnPlacement: combinedPlacement,
    turnEndPlacement: combinedPlacement + (state.turnEffectPlacement[playerIndex] ?? 0),
    effectApplied: appliesEffect,
    effectDeferredUntilEndTurn: isRemise(card) && remiseMode === "placement",
    removed: false,
  };

  player.played.push(playedCard);
  state.turnPlayedCards[playerIndex].push(playedCard);
  state.latestPlayedCard = { ...playedCard };
  player.power += stats.power;
  applySurfaceBonusAfterPlay(playerIndex, playedCard, cost);
  applyOpponentLowPowerCharacterTriggers(playerIndex, playedCard);

  recordAction("play_card", {
    playerIndex,
    opponentIndex,
    playerName: displayPlayerName(player),
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
  const effectPlacementText = isRemise(card) && remiseMode === "effect" && rawStats.placement
    ? `, placement de clôture ${rawStats.placement}`
    : "";
  state.log.unshift(`${displayPlayerName(player)} joue ${card.name}${boostText}${remiseText} : +${stats.power} puissance, précision ${stats.precision}, placement ${stats.placement}${effectPlacementText}${endsTurn ? `, placement total ${combinedPlacement}` : ""}.`);
  const effectCanceled = state.players[opponentIndex].cancelNextOpponentEffect;
  let effectResolution = "applied";
  if (!appliesEffect) {
    effectResolution = "ignored_remise";
    setEffectNotice("ignoré", card, `${card.effect} Ne s'applique pas car la carte est jouée en Remise.`);
    state.log.unshift(`L'effet de ${card.name} ne s'applique pas car la carte est jouée en Remise.`);
  } else if (effectCanceled) {
    effectResolution = "canceled_by_opponent";
    state.players[opponentIndex].cancelNextOpponentEffect = false;
    state.players[opponentIndex].cancelNextOpponentEffectSourceUid = null;
    playedCard.effectApplied = false;
    setEffectNotice("annulé", card, `${card.effect} Annulé par l'effet adverse.`);
    state.log.unshift(`L'effet de ${card.name} est annulé.`);
  } else {
    const freeBoostWindow = card.effectType !== "freeBoostNext" || isFreeBoostNextWindow(playerIndex);
    applyEffect(playerIndex, playedCard);
    if (freeBoostWindow) {
      setEffectNotice("appliqué", card, card.effect);
    }
  }
  recordAction("effect_resolution", {
    playerIndex,
    opponentIndex,
    playerName: displayPlayerName(player),
    card: cardLogInfo(playedCard),
    effectType: card.effectType,
    resolution: effectResolution,
    costPaid: cost,
  });

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

  completePlayedCardResolution(playerIndex, opponentIndex, card, playedCard, isOpeningServe, placementWasInsufficient, boosted, remiseMode, answeredBoostConstraint);
}

function completePlayedCardResolution(playerIndex, opponentIndex, card, playedCard, isOpeningServe, placementWasInsufficient, boosted, remiseMode = "effect", answeredBoostConstraint = false) {
  const player = state.players[playerIndex];
  const endsTurn = !isRemise(card);
  const hasActiveEffect = playedCard.effectApplied !== false;
  const hasSmashThreat = hasActiveEffect && (card.effectType === "smashThreat" || playedCard.copiedSmashThreat || playedCard.copiedEffectType === "smashThreat");

  if (isRemise(card) && remiseMode === "effect") {
    state.turnHasEffect[playerIndex] = true;
  }

  state.turnPlacement[playerIndex] = playedCard.turnPlacement;

  if (!endsTurn) {
    state.log.unshift(`${displayPlayerName(player)} peut encore jouer : une Remise ne termine pas le tour.`);
    render();
    return;
  }

  if (isOpeningServe && !["Service", "Coup droit"].includes(card.family)) {
    const drawn = drawCards(state.players[opponentIndex], 1);
    state.log.unshift(drawn > 0 ? `${playerName(opponentIndex)} pioche 1 carte car le service n'est ni un Service ni un Coup droit.` : `${playerName(opponentIndex)} devrait piocher, mais le deck est vide.`);
  }

  state.lastCard = playedCard;
  if (isOpeningServe) {
    state.returnServiceRestrictionSpent = state.returnServiceRestrictionSpent ?? [false, false];
    state.returnServiceRestrictionFor = opponentIndex;
    state.returnServiceRestrictionSpent[opponentIndex] = false;
  }
  state.mandatoryPlacement = boosted || hasSmashThreat;
  state.mandatoryPlacementReason = boosted ? "boost" : hasSmashThreat ? "smash" : null;
  state.mandatoryPlacementSourceUid = state.mandatoryPlacement ? playedCard.playedUid : null;
  state.boostAvailableFor = !boosted && !answeredBoostConstraint && !state.turnCannotOpenBoost[playerIndex] && placementWasInsufficient ? opponentIndex : null;
  state.turnPlacement[playerIndex] = 0;
  state.turnPlacement[opponentIndex] = 0;
  state.turnEffectPlacement[playerIndex] = 0;
  state.turnEffectPlacement[opponentIndex] = 0;
  state.turnHasEffect[playerIndex] = false;
  state.turnHasEffect[opponentIndex] = false;
  state.turnIgnoresPlacement[playerIndex] = false;
  state.turnIgnoresPlacement[opponentIndex] = false;
  state.turnCannotOpenBoost[playerIndex] = false;
  state.turnCannotOpenBoost[opponentIndex] = false;
  rememberPreviousTurn(playerIndex);
  player.limitedFamilies = null;
  player.limitedFamiliesSourceUid = null;
  if (state.returnServiceRestrictionFor === playerIndex) {
    state.returnServiceRestrictionSpent = state.returnServiceRestrictionSpent ?? [false, false];
    state.returnServiceRestrictionSpent[playerIndex] = true;
    state.returnServiceRestrictionFor = null;
  }
  state.activePlayer = opponentIndex;
  captureTurnSnapshot();
  render();
}

function endTurn(playerIndex) {
  if (!canEndTurn(playerIndex)) return;
  markLocalServerDirty(playerIndex);
  if (applyDeferredFinalRemiseEffect(playerIndex)) {
    render();
    return;
  }
  commitEndTurn(playerIndex);
}

function applyDeferredFinalRemiseEffect(playerIndex) {
  const finalCard = finalRemisePlayedThisTurn(playerIndex);
  if (!finalCard || !isRemise(finalCard) || !finalCard.effectDeferredUntilEndTurn || finalCard.effectApplied) return false;
  const opponentIndex = opponentOf(playerIndex);
  const effectCanceled = state.players[opponentIndex].cancelNextOpponentEffect;
  finalCard.effectDeferredUntilEndTurn = false;
  finalCard.effectApplied = true;
  if (effectCanceled) {
    state.players[opponentIndex].cancelNextOpponentEffect = false;
    state.players[opponentIndex].cancelNextOpponentEffectSourceUid = null;
    finalCard.effectApplied = false;
    setEffectNotice("annulé", finalCard, `${finalCard.effect} Annulé par l'effet adverse.`);
    state.log.unshift(`L'effet final de ${finalCard.name} est annulé.`);
    recordAction("effect_resolution", {
      playerIndex,
      opponentIndex,
      playerName: displayPlayerName(state.players[playerIndex]),
      card: cardLogInfo(finalCard),
      effectType: finalCard.effectType,
      resolution: "canceled_by_opponent",
      costPaid: finalCard.costPaid ?? finalCard.cost,
      deferred: true,
    });
    return false;
  }
  const freeBoostWindow = finalCard.effectType !== "freeBoostNext" || isFreeBoostNextWindow(playerIndex);
  applyEffect(playerIndex, finalCard);
  if (freeBoostWindow) {
    setEffectNotice("appliqué", finalCard, finalCard.effect);
  }
  recordAction("effect_resolution", {
    playerIndex,
    opponentIndex,
    playerName: displayPlayerName(state.players[playerIndex]),
    card: cardLogInfo(finalCard),
    effectType: finalCard.effectType,
    resolution: "applied",
    costPaid: finalCard.costPaid ?? finalCard.cost,
    deferred: true,
  });
  state.log.unshift(`${playerName(playerIndex)} termine son tour sur ${finalCard.name} : son effet et son placement sont pris en compte.`);
  if (state.pendingEffectChoice || state.pendingRemoveChoice || state.pendingCoachChoice) {
    state.pendingEndTurnAfterChoice = { playerIndex, sourcePlayedUid: finalCard.playedUid };
    return true;
  }
  return false;
}

function continuePendingEndTurnIfNeeded(playerIndex, sourcePlayedUid) {
  if (state.pendingEffectChoice || state.pendingRemoveChoice || state.pendingCoachChoice) return true;
  if (!state.pendingEndTurnAfterChoice) return false;
  if (state.pendingEndTurnAfterChoice.playerIndex !== playerIndex) return false;
  if (sourcePlayedUid && state.pendingEndTurnAfterChoice.sourcePlayedUid !== sourcePlayedUid) return false;
  state.pendingEndTurnAfterChoice = null;
  commitEndTurn(playerIndex);
  return true;
}

function commitEndTurn(playerIndex) {
  const opponentIndex = opponentOf(playerIndex);
  const player = state.players[playerIndex];
  const opponent = state.players[opponentIndex];
  const preparedPlacement = turnEndPlacement(playerIndex);
  const finalRemise = finalRemisePlayedThisTurn(playerIndex);
  const answeredBoostConstraint = Boolean(state.lastCard?.boosted || state.mandatoryPlacementReason === "boost");
  const opensBoost = Boolean(state.lastCard && !answeredBoostConstraint && preparedPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]);
  recordAction("end_turn", {
    playerIndex,
    opponentIndex,
    playerName: displayPlayerName(player),
    preparedPlacement,
    opensBoost,
    answeredBoostConstraint,
    constraintsBefore: constraintsLogInfo(),
    player: playerLogInfo(player),
    opponent: playerLogInfo(opponent),
  });

  if (playerIndex === state.server && isOpeningServeAvailable()) {
    state.openingServePlayed = true;
    const drawn = drawCards(opponent, 1);
    state.log.unshift(drawn > 0 ? `${displayPlayerName(opponent)} pioche 1 carte car le serveur termine sans Service ni Coup droit.` : `${displayPlayerName(opponent)} devrait piocher, mais le deck est vide.`);
  }

  if (finalRemise) {
    finalRemise.turnPlacement = preparedPlacement;
    finalRemise.turnEndPlacement = preparedPlacement;
    state.lastCard = finalRemise;
  }
  state.boostAvailableFor = opensBoost ? opponentIndex : null;
  state.mandatoryPlacement = false;
  state.mandatoryPlacementReason = null;
  state.mandatoryPlacementSourceUid = null;
  state.turnPlacement[playerIndex] = 0;
  state.turnEffectPlacement[playerIndex] = 0;
  state.turnHasEffect[playerIndex] = false;
  state.turnIgnoresPlacement[playerIndex] = false;
  state.turnCannotOpenBoost[playerIndex] = false;
  rememberPreviousTurn(playerIndex);
  player.limitedFamilies = null;
  player.limitedFamiliesSourceUid = null;
  if (state.returnServiceRestrictionFor === playerIndex) {
    state.returnServiceRestrictionSpent = state.returnServiceRestrictionSpent ?? [false, false];
    state.returnServiceRestrictionSpent[playerIndex] = true;
    state.returnServiceRestrictionFor = null;
  }
  state.activePlayer = opponentIndex;
  state.log.unshift(`${displayPlayerName(player)} termine son tour après une carte Effet.`);
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
      state.log.unshift(`${displayPlayerName(player)} récupère ${card.effectValue} endurance.`);
      break;
    case "drawCard":
      drawCards(player, card.effectValue);
      state.log.unshift(`${displayPlayerName(player)} pioche ${card.effectValue} carte.`);
      break;
    case "nextPrecision":
      addNextPrecisionBonus(player, card.effectValue, card.playedUid);
      state.log.unshift(`${displayPlayerName(player)} gagne +${card.effectValue} précision sur son prochain coup.`);
      break;
    case "nextPlacement":
      addNextPlacementBonus(player, card.effectValue, card.playedUid);
      state.log.unshift(`${displayPlayerName(player)} gagne +${card.effectValue} placement sur son prochain coup.`);
      break;
    case "nextPrecisionAndPlacement":
      addNextPrecisionBonus(player, card.effectValue, card.playedUid);
      addNextPlacementBonus(player, card.effectValue, card.playedUid);
      state.log.unshift(`${displayPlayerName(player)} gagne +${card.effectValue} précision et placement sur son prochain coup.`);
      break;
    case "nextDiscount":
      addNextDiscount(player, card.effectValue, card.playedUid);
      state.log.unshift(`Le prochain coup de ${displayPlayerName(player)} coûte ${card.effectValue} endurance en moins.`);
      break;
    case "cancelOpponentNextEffect":
      player.cancelNextOpponentEffect = true;
      player.cancelNextOpponentEffectSourceUid = card.playedUid;
      state.log.unshift(`${displayPlayerName(player)} annulera le prochain effet adverse.`);
      break;
    case "limitOpponentFamilies":
      opponent.limitedFamilies = card.effectFamilies;
      opponent.limitedFamiliesSourceUid = card.playedUid;
      state.log.unshift(`${displayPlayerName(opponent)} devra jouer ${card.effectFamilies.join(", ")} au prochain coup.`);
      break;
    case "discardOpponent":
      if (opponent.protectedFromRemoval) {
        state.log.unshift(`${displayPlayerName(opponent)} est protégé : sa main ne peut pas être attaquée.`);
        setEffectNotice("sans effet", card, `${displayPlayerName(opponent)} est protégé jusqu'à la fin de l'échange.`);
        break;
      }
      if (opponent.hand.length > 0) {
        const discarded = opponent.hand.splice(Math.floor(Math.random() * opponent.hand.length), 1)[0];
        state.discardedCards.push(discarded);
        state.log.unshift(`${displayPlayerName(opponent)} défausse ${discarded.name}.`);
      }
      break;
    case "removeOpponentLast":
      openRemoveChoice(playerIndex, card);
      break;
    case "doubleLastShot":
      player.endBonuses.push({ type: "doubleLastShot", sourceUid: card.playedUid });
      state.log.unshift(`${displayPlayerName(player)} prépare un Double pour la fin de l'échange.`);
      break;
    case "boostedBonusAtEnd":
      player.endBonuses.push({ type: "boostedBonus", value: card.effectValue, sourceUid: card.playedUid });
      state.log.unshift(`${displayPlayerName(player)} marquera +${card.effectValue} par carte boostée à la fin.`);
      break;
    case "freeBoostNext":
      if (isFreeBoostNextWindow(playerIndex)) {
        player.freeBoostNext = true;
        player.freeBoostNextSourceUid = card.playedUid;
        state.log.unshift(`${displayPlayerName(player)} pourra booster son prochain coup grâce au Retour de service.`);
      } else {
        state.log.unshift(`Retour de service est joué hors fenêtre : son bonus de boost ne s'applique pas.`);
        setEffectNotice("sans effet", card, "Le bonus ne s'applique que juste après un service boosté ou un retour de service boosté.");
      }
      break;
    case "jokerResponse":
      if (state.mandatoryPlacement && state.mandatoryPlacementReason === "boost") {
        state.turnIgnoresPlacement[playerIndex] = true;
        state.turnCannotOpenBoost[playerIndex] = true;
        state.mandatoryPlacement = false;
        state.mandatoryPlacementReason = null;
        state.mandatoryPlacementSourceUid = null;
        state.log.unshift(`${displayPlayerName(player)} neutralise la contrainte de placement du BOOST avec Joker pour tout ce tour.`);
      } else {
        state.log.unshift(`Joker ne neutralise aucune contrainte : il annule uniquement la contrainte de placement d'un BOOST adverse.`);
        setEffectNotice("sans effet", card, "Le Joker annule uniquement la contrainte de placement liée à un BOOST adverse.");
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
    const opponent = state.players[opponentIndex];
    state.log.unshift(opponent.protectedFromRemoval ? `${displayPlayerName(opponent)} est protégé : aucune carte ne peut être supprimée.` : "Aucune carte adverse à supprimer.");
    return;
  }
  state.pendingRemoveChoice = {
    playerIndex,
    opponentIndex,
    sourcePlayedUid: sourceCard.resolutionPlayedUid || sourceCard.playedUid,
  };
  state.log.unshift(`${playerName(playerIndex)} doit choisir une carte adverse à supprimer.`);
}

function removableOpponentCards(opponentIndex, shotsOnly = false) {
  const opponent = state.players[opponentIndex];
  if (opponent.protectedFromRemoval) return [];
  return opponent.played.filter((card) => !card.removed && (!shotsOnly || isShot(card)));
}

function removalTargetScore(card) {
  let score = (card.cardPowerGained ?? card.powerGained ?? 0) * 3 + card.precision + card.placement;
  if (card.boosted) score += 12;
  if (state.lastCard?.playedUid === card.playedUid) score += 8;
  if (state.mandatoryPlacementSourceUid === card.playedUid) score += 10;
  if (state.boostAvailableFor != null && state.lastCard?.playedUid === card.playedUid) score += 5;
  for (const player of state.players) {
    if (player.limitedFamiliesSourceUid === card.playedUid) score += 8;
    if (player.endBonuses.some((bonus) => bonus.sourceUid === card.playedUid)) score += 18;
  }
  if (["smashThreat", "limitOpponentFamilies", "boostedBonusAtEnd", "doubleLastShot"].includes(card.effectType) || card.copiedEffectType) score += 5;
  return score;
}

function bestRemovalTargetFor(playerIndex) {
  return removableOpponentCards(opponentOf(playerIndex), Boolean(state.pendingRemoveChoice?.shotsOnly))
    .sort((a, b) => removalTargetScore(b) - removalTargetScore(a))[0] ?? null;
}

function resolveRemoveChoice(targetPlayedUid) {
  if (!state.pendingRemoveChoice) return;
  const { playerIndex, opponentIndex, sourcePlayedUid, shotsOnly } = state.pendingRemoveChoice;
  if (!canUseSeat(playerIndex)) return;
  markLocalServerDirty(playerIndex);
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  const target = removableOpponentCards(opponentIndex, Boolean(shotsOnly)).find((card) => card.playedUid === targetPlayedUid);
  state.pendingRemoveChoice = null;
  if (!sourceCard || !target) {
    state.log.unshift("Choix de suppression impossible.");
    render();
    return;
  }
  recordAction("remove_card", {
    playerIndex,
    opponentIndex,
    playerName: displayPlayerName(player),
    sourceCard: cardLogInfo(sourceCard),
    targetCard: cardLogInfo(target),
    targetValue: removalTargetScore(target),
    sourceCost: sourceCard.costPaid ?? sourceCard.cost,
  });
  removeOpponentPlayed(opponentIndex, target.playedUid);
  if (continuePendingEndTurnIfNeeded(playerIndex, sourcePlayedUid)) {
    return;
  }
  completePlayedCardResolution(
    playerIndex,
    opponentIndex,
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]),
    sourceCard.boosted,
    "effect",
    Boolean(sourceCard.answeredBoostConstraint),
  );
}

function closeImpossibleRemoveChoice(playerIndex) {
  if (!state.pendingRemoveChoice || state.pendingRemoveChoice.playerIndex !== playerIndex) return;
  const { sourcePlayedUid } = state.pendingRemoveChoice;
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingRemoveChoice = null;
  state.log.unshift(`${displayPlayerName(player)} ne peut supprimer aucune carte adverse.`);
  if (!sourceCard) {
    render();
    return;
  }
  if (continuePendingEndTurnIfNeeded(playerIndex, sourcePlayedUid)) {
    return;
  }
  completePlayedCardResolution(
    playerIndex,
    opponentOf(playerIndex),
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]),
    sourceCard.boosted,
    "effect",
    Boolean(sourceCard.answeredBoostConstraint),
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
  if (opponent.protectedFromRemoval) {
    state.log.unshift(`${displayPlayerName(opponent)} est protégé : ses cartes ne peuvent pas être supprimées.`);
    return;
  }
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
  const removedPower = target.basePowerGained
    ?? (target.boosted ? target.boostPower : target.power)
    ?? target.cardPowerGained
    ?? target.powerGained
    ?? 0;
  opponent.power -= removedPower;
  clearActiveEffectsFromRemovedCard(target);
  if (target.boosted && target.sacrificedCard) {
    state.log.unshift(`La carte sacrifiée sous le BOOST (${target.sacrificedCard.name}) est aussi supprimée.`);
  }
  state.log.unshift(`${target.name} est supprimée : ${displayPlayerName(state.players[opponentIndex])} perd uniquement ses ${removedPower} points de puissance initiaux. Les bonus déjà acquis restent appliqués.`);
}

function clearActiveEffectsFromRemovedCard(card) {
  for (const player of state.players) {
    if (player.nextPowerCapSourceUid === card.playedUid) {
      player.nextPowerCap = null;
      player.nextPowerCapSourceUid = null;
      state.log.unshift(`La limitation de puissance créée par ${card.name} est annulée.`);
    }
    if (player.nextPowerMultiplierSourceUid === card.playedUid) {
      player.nextPowerMultiplier = 1;
      player.nextPowerMultiplierSourceUid = null;
      state.log.unshift(`Le multiplicateur de puissance créé par ${card.name} est annulé.`);
    }
    const removedPrecision = removeSourcedNextBonus(player, "nextPrecisionBonus", "nextPrecisionSources", card.playedUid);
    const removedPlacement = removeSourcedNextBonus(player, "nextPlacementBonus", "nextPlacementSources", card.playedUid);
    const removedAnyPlacement = removeSourcedNextBonus(player, "nextAnyPlacementBonus", "nextAnyPlacementSources", card.playedUid);
    const removedDiscount = removeSourcedNextBonus(player, "nextDiscount", "nextDiscountSources", card.playedUid);
    const removedExtraCost = removeSourcedNextBonus(player, "nextExtraCost", "nextExtraCostSources", card.playedUid);
    const removedExchangePrecision = removeSourcedNextBonus(player, "exchangePrecisionBonus", "exchangePrecisionSources", card.playedUid);
    const removedExchangePlacement = removeSourcedNextBonus(player, "exchangePlacementBonus", "exchangePlacementSources", card.playedUid);
    if (removedPrecision) state.log.unshift(`Le bonus +${removedPrecision} précision créé par ${card.name} est annulé.`);
    if (removedPlacement) state.log.unshift(`Le bonus +${removedPlacement} placement créé par ${card.name} est annulé.`);
    if (removedAnyPlacement) state.log.unshift(`Le bonus +${removedAnyPlacement} placement sur la prochaine carte créé par ${card.name} est annulé.`);
    if (removedDiscount) state.log.unshift(`Le bonus -${removedDiscount} endurance créé par ${card.name} est annulé.`);
    if (removedExtraCost) state.log.unshift(`Le malus +${removedExtraCost} endurance créé par ${card.name} est annulé.`);
    if (removedExchangePrecision) state.log.unshift(`Le bonus permanent +${removedExchangePrecision} précision créé par ${card.name} est annulé.`);
    if (removedExchangePlacement) state.log.unshift(`Le bonus permanent +${removedExchangePlacement} placement créé par ${card.name} est annulé.`);
    const familyPowerBefore = player.exchangeFamilyPowerBonuses?.length ?? 0;
    player.exchangeFamilyPowerBonuses = (player.exchangeFamilyPowerBonuses ?? []).filter((bonus) => bonus.sourceUid !== card.playedUid);
    if ((player.exchangeFamilyPowerBonuses?.length ?? 0) !== familyPowerBefore) {
      state.log.unshift(`Le bonus de puissance par type créé par ${card.name} est annulé.`);
    }
    const afterFamilyBefore = player.exchangeAfterFamilyPlacementBonuses?.length ?? 0;
    player.exchangeAfterFamilyPlacementBonuses = (player.exchangeAfterFamilyPlacementBonuses ?? []).filter((bonus) => bonus.sourceUid !== card.playedUid);
    if ((player.exchangeAfterFamilyPlacementBonuses?.length ?? 0) !== afterFamilyBefore) {
      state.log.unshift(`Le bonus de placement conditionnel créé par ${card.name} est annulé.`);
    }
    const lowPowerBefore = player.placementPerOpponentLowPowerCardBonuses?.length ?? 0;
    player.placementPerOpponentLowPowerCardBonuses = (player.placementPerOpponentLowPowerCardBonuses ?? []).filter((bonus) => bonus.sourceUid !== card.playedUid);
    if ((player.placementPerOpponentLowPowerCardBonuses?.length ?? 0) !== lowPowerBefore) {
      state.log.unshift(`Le bonus de placement contre cartes faibles créé par ${card.name} est annulé.`);
    }
    if (player.protectedFromRemovalSourceUid === card.playedUid) {
      player.protectedFromRemoval = false;
      player.protectedFromRemovalSourceUid = null;
      state.log.unshift(`La protection contre suppression créée par ${card.name} est annulée.`);
    }
    if (player.limitedFamiliesSourceUid === card.playedUid) {
      player.limitedFamilies = null;
      player.limitedFamiliesSourceUid = null;
      state.log.unshift(`La contrainte de type créée par ${card.name} est annulée.`);
    }
    if (player.cancelNextOpponentEffectSourceUid === card.playedUid) {
      player.cancelNextOpponentEffect = false;
      player.cancelNextOpponentEffectSourceUid = null;
      state.log.unshift(`L'annulation du prochain effet créée par ${card.name} est annulée.`);
    }
    if (player.freeBoostNextSourceUid === card.playedUid) {
      player.freeBoostNext = false;
      player.freeBoostNextSourceUid = null;
      state.log.unshift(`Le boost libre créé par ${card.name} est annulé.`);
    }
    player.endBonuses = player.endBonuses.filter((bonus) => bonus.sourceUid !== card.playedUid);
  }
  if (card.isServiceTurn && state.returnServiceRestrictionFor === opponentOf(card.owner)) {
    state.returnServiceRestrictionFor = null;
    state.log.unshift("La contrainte de retour de service disparaît avec le service supprimé.");
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

function markCopiedEffectOnSource(sourceCard, chosen) {
  sourceCard.copiedEffectType = chosen.effectType;
  sourceCard.copiedEffectName = chosen.name;
  sourceCard.effectType = chosen.effectType;
  sourceCard.effect = chosen.effect;
  if (chosen.effectType === "smashThreat") sourceCard.copiedSmashThreat = true;
  if (state.latestPlayedCard?.playedUid === sourceCard.playedUid) {
    state.latestPlayedCard.copiedEffectType = chosen.effectType;
    state.latestPlayedCard.copiedEffectName = chosen.name;
    state.latestPlayedCard.effectType = chosen.effectType;
    state.latestPlayedCard.effect = chosen.effect;
    if (chosen.effectType === "smashThreat") state.latestPlayedCard.copiedSmashThreat = true;
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
  const sourcePlayedUid = sourceCard.resolutionPlayedUid || sourceCard.playedUid;
  const choices = effectChoicesFor(sourcePlayedUid, { shotsOnly: true });
  if (choices.length === 0) {
    state.log.unshift("Aucun effet déjà joué à choisir.");
    setEffectNotice("sans choix", sourceCard, "Aucun effet déjà joué ne peut être choisi.");
    return;
  }
  state.pendingEffectChoice = { playerIndex, sourcePlayedUid };
  state.log.unshift(`${playerName(playerIndex)} doit choisir un effet déjà joué.`);
}

function resolveEffectChoice(chosenPlayedUid) {
  if (!state.pendingEffectChoice) return;
  const { playerIndex, sourcePlayedUid, effectSourceUid = null, shotsOnly = true } = state.pendingEffectChoice;
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
    playedUid: effectSourceUid || sourceCard.playedUid,
    resolutionPlayedUid: sourceCard.playedUid,
    name: chosen.name,
  };
  state.log.unshift(`${displayPlayerName(player)} choisit l'effet de ${chosen.name}.`);
  markCopiedEffectOnSource(sourceCard, chosen);
  const chosenEffectType = chosen.copiedEffectType || chosen.effectType;
  if (chosenEffectType === "choosePlayedEffect" || chosenEffectType === "gainPowerAndChooseAnyPlayedEffect") {
    sourceCard.effectType = "choosePlayedEffect";
    sourceCard.copiedEffectType = "choosePlayedEffect";
    sourceCard.effect = chosen.effect;
    state.pendingEffectChoice = { playerIndex, sourcePlayedUid: sourceCard.playedUid, effectSourceUid, shotsOnly: true };
    state.log.unshift(`${displayPlayerName(player)} doit maintenant choisir l'effet à dupliquer.`);
    setEffectNotice("appliqué", chosen, "Effet de duplication choisi : choisissez maintenant l'effet copié.");
    render();
    return;
  }
  applyEffect(playerIndex, effectCard);
  setEffectNotice("appliqué", chosen, `Effet choisi via ${sourceCard.name}: ${chosen.effect}`);
  if (state.pendingEffectChoice || state.pendingRemoveChoice || state.pendingCoachChoice) {
    render();
    return;
  }
  if (continuePendingEndTurnIfNeeded(playerIndex, sourcePlayedUid)) {
    return;
  }
  completePlayedCardResolution(
    playerIndex,
    opponentIndex,
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]),
    sourceCard.boosted,
    "effect",
    Boolean(sourceCard.answeredBoostConstraint),
  );
}

function closeImpossibleEffectChoice(playerIndex) {
  if (!state.pendingEffectChoice || state.pendingEffectChoice.playerIndex !== playerIndex) return;
  const { sourcePlayedUid } = state.pendingEffectChoice;
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingEffectChoice = null;
  state.log.unshift(`${displayPlayerName(player)} ne peut choisir aucun effet valide.`);
  if (!sourceCard) {
    render();
    return;
  }
  if (continuePendingEndTurnIfNeeded(playerIndex, sourcePlayedUid)) {
    return;
  }
  completePlayedCardResolution(
    playerIndex,
    opponentOf(playerIndex),
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]),
    sourceCard.boosted,
    "effect",
    Boolean(sourceCard.answeredBoostConstraint),
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
    state.log.unshift(`${displayPlayerName(player)} retourne sa carte personnage pour la première fois : +1 endurance.`);
  }
}

function characterEffectLogMarker(effect) {
  const side = String(effect?.side || "").toLowerCase().includes("rose") ? "rose" : "blue";
  return `[[tc-effect-${side}:${effect?.label || "Effet personnage"}]]`;
}

function characterEffectSourceUid(playedCard) {
  const sourceUid = playedCard.starEffectSourceUid || `${playedCard.playedUid}:star`;
  playedCard.starEffectSourceUid = sourceUid;
  if (state.latestPlayedCard?.playedUid === playedCard.playedUid) {
    state.latestPlayedCard.starEffectSourceUid = sourceUid;
  }
  return sourceUid;
}

function applyCharacterEffect(playerIndex, playedCard) {
  const player = state.players[playerIndex];
  const character = characterOf(player);
  const effect = currentCharacterEffect(player);
  const effectSourceUid = characterEffectSourceUid(playedCard);
  playedCard.starEffectLabel = effect?.label || "Bonus du personnage";
  if (state.latestPlayedCard?.playedUid === playedCard.playedUid) {
    state.latestPlayedCard.starEffectLabel = playedCard.starEffectLabel;
  }
  flipCharacter(player);
  state.log.unshift(`${character.name} active ${characterEffectLogMarker(effect)}.`);

  if (effect.type === "drawCard") {
    const count = effect.count ?? 1;
    const drawn = drawCards(player, count);
    const message = drawn > 0 ? `Piochez ${drawn} carte${drawn > 1 ? "s" : ""}.` : "Le deck est vide, aucune carte piochée.";
    state.log.unshift(`${character.name} (${effect.side}) : ${message}`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}. ${message}`);
    return false;
  }

  if (effect.type === "gainEndurance") {
    const value = effect.value ?? 1;
    player.endurance += value;
    state.log.unshift(`${character.name} (${effect.side}) : +${value} endurance.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "gainEnduranceAndDraw") {
    const endurance = effect.endurance ?? 2;
    const drawCount = effect.draw ?? 1;
    player.endurance += endurance;
    const drawn = drawCards(player, drawCount);
    state.log.unshift(`${character.name} (${effect.side}) : +${endurance} endurance et pioche ${drawn} carte${drawn > 1 ? "s" : ""}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "gainEnduranceAndPower") {
    const endurance = effect.endurance ?? 1;
    const power = effect.power ?? 1;
    player.endurance += endurance;
    player.power += power;
    playedCard.effectPowerGained += power;
    state.log.unshift(`${character.name} (${effect.side}) : +${endurance} endurance et +${power} puissance.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
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

  if (effect.type === "gainPowerOpponentEndurance") {
    const power = effect.power ?? 3;
    const endurance = effect.opponentEndurance ?? 1;
    const opponent = state.players[opponentOf(playerIndex)];
    player.power += power;
    playedCard.effectPowerGained += power;
    opponent.endurance += endurance;
    state.log.unshift(`${character.name} (${effect.side}) : +${power} puissance. ${displayPlayerName(opponent)} récupère ${endurance} endurance.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
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
    state.pendingEffectChoice = { playerIndex, sourcePlayedUid: playedCard.playedUid, effectSourceUid, shotsOnly: false };
    state.log.unshift(`${character.name} (${effect.side}) : +${value} puissance, puis ${displayPlayerName(player)} choisit un effet engagé à dupliquer.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return true;
  }

  if (effect.type === "nextDiscount") {
    const value = effect.value ?? 1;
    addNextDiscount(player, value, effectSourceUid);
    state.log.unshift(`${character.name} (${effect.side}) : le prochain coup de ${displayPlayerName(player)} coûte ${value} endurance en moins.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "opponentNextPowerCap") {
    const value = effect.value ?? 2;
    const opponent = state.players[opponentOf(playerIndex)];
    opponent.nextPowerCap = value;
    opponent.nextPowerCapSourceUid = effectSourceUid;
    state.log.unshift(`${character.name} (${effect.side}) : le prochain Coup de ${displayPlayerName(opponent)} rapportera ${value} puissance maximum.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "opponentNextExtraCost") {
    const value = effect.value ?? 1;
    const opponent = state.players[opponentOf(playerIndex)];
    addNextExtraCost(opponent, value, effectSourceUid);
    state.log.unshift(`${character.name} (${effect.side}) : le prochain coup de ${displayPlayerName(opponent)} coûte ${value} endurance de plus.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "opponentTurnShotExtraCost") {
    const value = effect.value ?? 1;
    const opponent = state.players[opponentOf(playerIndex)];
    addNextExtraCost(opponent, value, effectSourceUid);
    state.log.unshift(`${character.name} (${effect.side}) : tous les Coups du prochain tour de ${displayPlayerName(opponent)} coûtent ${value} endurance de plus.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "opponentNextShotBasePlacementZero") {
    const opponent = state.players[opponentOf(playerIndex)];
    opponent.nextShotBasePlacementZero = true;
    state.log.unshift(`${character.name} (${effect.side}) : le placement de base du prochain Coup de ${displayPlayerName(opponent)} est ramené à 0 ; bonus et Remises restent applicables.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "opponentPassPowerBonus") {
    player.rosaPassPowerBonus = effect.value ?? 2;
    state.log.unshift(`${character.name} (${effect.side}) : +${player.rosaPassPowerBonus} puissance si l’adversaire passe avant la fin de l’échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "discardHandForPower") {
    if (!player.hand.length) {
      state.log.unshift(`${character.name} (${effect.side}) : main vide, aucune carte supprimée et aucun gain de puissance.`);
      setEffectNotice("coach", { name: character.name }, "La carte personnage est retournée, mais l’effet ne se déclenche pas car la main est vide.");
      return false;
    }
    state.pendingCoachChoice = { playerIndex, sourcePlayedUid: playedCard.playedUid, mode: "discardHandForPower", power: effect.value ?? 3 };
    state.log.unshift(`${character.name} (${effect.side}) : ${displayPlayerName(player)} choisit une carte de sa main à supprimer.`);
    setEffectNotice("coach", { name: character.name }, effect.label);
    return true;
  }

  if (effect.type === "nextPowerMultiplier") {
    const value = effect.value ?? 2;
    player.nextPowerMultiplier = Math.max(player.nextPowerMultiplier ?? 1, value);
    player.nextPowerMultiplierSourceUid = effectSourceUid;
    state.log.unshift(`${character.name} (${effect.side}) : le prochain coup de ${displayPlayerName(player)} comptera puissance x${value}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "exchangePrecisionBonus") {
    const value = effect.value ?? 2;
    player.exchangePrecisionBonus = (player.exchangePrecisionBonus ?? 0) + value;
    player.exchangePrecisionSources = player.exchangePrecisionSources ?? [];
    player.exchangePrecisionSources.push({ sourceUid: effectSourceUid, value });
    state.log.unshift(`${character.name} (${effect.side}) : toutes les cartes de ${displayPlayerName(player)} gagnent +${value} précision jusqu'à la fin de l'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "exchangePlacementBonus") {
    const value = effect.value ?? 2;
    player.exchangePlacementBonus = (player.exchangePlacementBonus ?? 0) + value;
    player.exchangePlacementSources = player.exchangePlacementSources ?? [];
    player.exchangePlacementSources.push({ sourceUid: effectSourceUid, value });
    state.log.unshift(`${character.name} (${effect.side}) : toutes les cartes de ${displayPlayerName(player)} gagnent +${value} placement jusqu'à la fin de l'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "exchangeFamilyPowerBonus") {
    const value = effect.value ?? 1;
    const bonus = {
      sourceUid: effectSourceUid,
      value,
      families: effect.families ?? [],
      excludedFamilies: effect.excludedFamilies ?? [],
    };
    player.exchangeFamilyPowerBonuses = [...(player.exchangeFamilyPowerBonuses ?? []), bonus];
    state.log.unshift(`${character.name} (${effect.side}) : ${effect.label}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "exchangeAfterFamilyPlacementBonus") {
    const value = effect.value ?? 2;
    player.exchangeAfterFamilyPlacementBonuses = [
      ...(player.exchangeAfterFamilyPlacementBonuses ?? []),
      { sourceUid: effectSourceUid, afterFamily: effect.afterFamily, value },
    ];
    state.log.unshift(`${character.name} (${effect.side}) : ${effect.label}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "placementPerOpponentLowPowerCard") {
    const opponent = state.players[opponentOf(playerIndex)];
    player.placementPerOpponentLowPowerCardBonuses = [
      ...(player.placementPerOpponentLowPowerCardBonuses ?? []),
      {
        sourceUid: effectSourceUid,
        threshold: effect.threshold ?? 5,
        value: effect.value ?? 2,
        seenPlayedUids: (opponent?.played ?? []).map((card) => card.playedUid).filter(Boolean),
      },
    ];
    state.log.unshift(`${character.name} (${effect.side}) : ${effect.label}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "preventOpponentRemoval") {
    player.protectedFromRemoval = true;
    player.protectedFromRemovalSourceUid = effectSourceUid;
    state.log.unshift(`${character.name} (${effect.side}) : les cartes de ${displayPlayerName(player)} ne peuvent plus être supprimées jusqu'à la fin de l'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "cancelNextOpponentEffect") {
    player.cancelNextOpponentEffect = true;
    player.cancelNextOpponentEffectSourceUid = effectSourceUid;
    state.log.unshift(`${character.name} (${effect.side}) : le prochain effet adverse sera annulé.`);
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
    state.log.unshift(`${character.name} (${effect.side}) : ${displayPlayerName(player)} choisit une carte non distribuée à récupérer.`);
    setEffectNotice("coach", { name: character.name }, effect.label);
    return true;
  }

  if (effect.type === "removeOpponentPlayedChoice") {
    const opponentIndex = opponentOf(playerIndex);
    if (!removableOpponentCards(opponentIndex, Boolean(effect.shotsOnly)).length) {
      state.log.unshift(`${character.name} (${effect.side}) : aucune carte adverse engagée à défausser.`);
      setEffectNotice("coach", { name: character.name }, "Aucune carte adverse engagée disponible.");
      return false;
    }
    state.pendingRemoveChoice = { playerIndex, opponentIndex, sourcePlayedUid: playedCard.playedUid, shotsOnly: Boolean(effect.shotsOnly) };
    state.log.unshift(`${character.name} (${effect.side}) : ${displayPlayerName(player)} choisit une carte adverse engagée à défausser.`);
    setEffectNotice("coach", { name: character.name }, effect.label);
    return true;
  }

  if (effect.type === "drawRandomOpponentHand") {
    const opponent = state.players[opponentOf(playerIndex)];
    if (opponent.protectedFromRemoval) {
      state.log.unshift(`${character.name} (${effect.side}) : ${displayPlayerName(opponent)} est protégé, sa main ne peut pas être attaquée.`);
      setEffectNotice("coach", { name: character.name }, `${displayPlayerName(opponent)} est protégé jusqu'à la fin de l'échange.`);
      return false;
    }
    if (!opponent.hand.length) {
      state.log.unshift(`${character.name} (${effect.side}) : la main adverse est vide.`);
      setEffectNotice("coach", { name: character.name }, "Main adverse vide.");
      return false;
    }
    const [drawn] = opponent.hand.splice(Math.floor(Math.random() * opponent.hand.length), 1);
    player.hand.push(drawn);
    state.log.unshift(`${character.name} (${effect.side}) : ${displayPlayerName(player)} pioche ${drawn.name} dans la main adverse.`);
    setEffectNotice("coach", { name: character.name }, `${drawn.name} rejoint la main.`);
    return false;
  }

  if (effect.type === "peekOpponentHand") {
    const opponentIndex = opponentOf(playerIndex);
    const opponent = state.players[opponentIndex];
    player.knownOpponentHand = {
      opponentIndex,
      cardIds: opponent.hand.map((card) => card.id),
      cardUids: opponent.hand.map((card) => card.uid),
      observedAt: Date.now(),
    };
    if (localHumanControlsPlayer(playerIndex)) startOpponentHandReveal(playerIndex, opponentIndex);
    state.log.unshift(`${character.name} (${effect.side}) : main adverse observée.`);
    state.effectNotice = null;
    return false;
  }

  if (effect.type === "endDoubleLastShot") {
    player.endBonuses.push({ type: "doubleLastShot", sourceUid: effectSourceUid });
    state.log.unshift(`${character.name} (${effect.side}) : prépare un doublement de la dernière carte Coup en fin d'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  return false;
}

function resolveCoachChoice(cardUid) {
  if (!state.pendingCoachChoice) return;
  const { playerIndex, sourcePlayedUid, mode, power = 3 } = state.pendingCoachChoice;
  if (!canUseSeat(playerIndex)) return;
  markLocalServerDirty(playerIndex);
  const player = state.players[playerIndex];
  const opponentIndex = opponentOf(playerIndex);
  const chosen = mode === "discardHandForPower"
    ? player.hand.find((card) => card.uid === cardUid)
    : state.deck.find((card) => card.uid === cardUid);
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingCoachChoice = null;

  if (!chosen || !sourceCard) {
    state.log.unshift("Choix de coach impossible.");
    render();
    return;
  }

  if (mode === "discardHandForPower") {
    player.hand = player.hand.filter((card) => card.uid !== chosen.uid);
    player.power += power;
    sourceCard.effectPowerGained = (sourceCard.effectPowerGained ?? 0) + power;
    state.log.unshift(`${displayPlayerName(player)} supprime ${chosen.name} grâce à ${characterOf(player).name} et gagne +${power} puissance.`);
    setEffectNotice("coach", { name: characterOf(player).name }, `${chosen.name} est supprimée : +${power} puissance.`);
  } else {
    state.deck = state.deck.filter((card) => card.uid !== chosen.uid);
    player.hand.push(chosen);
    state.log.unshift(`${displayPlayerName(player)} récupère ${chosen.name} grâce à ${characterOf(player).name}.`);
    setEffectNotice("coach", { name: characterOf(player).name }, `${chosen.name} rejoint la main.`);
  }
  completePlayedCardResolution(
    playerIndex,
    opponentIndex,
    sourceCard,
    sourceCard,
    sourceCard.isServiceTurn,
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]),
    sourceCard.boosted,
    "effect",
    Boolean(sourceCard.answeredBoostConstraint),
  );
}

function closeImpossibleCoachChoice(playerIndex) {
  if (!state.pendingCoachChoice || state.pendingCoachChoice.playerIndex !== playerIndex) return;
  const { sourcePlayedUid } = state.pendingCoachChoice;
  const player = state.players[playerIndex];
  const sourceCard = player.played.find((card) => card.playedUid === sourcePlayedUid);
  state.pendingCoachChoice = null;
  state.log.unshift(`${displayPlayerName(player)} ne peut récupérer aucune carte non distribuée.`);
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
    Boolean(state.lastCard && sourceCard.turnPlacement < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex]),
    sourceCard.boosted,
    "effect",
    Boolean(sourceCard.answeredBoostConstraint),
  );
}

function pass(playerIndex, tutorialBypass = false) {
  if (state.gameOver || playerIndex !== state.activePlayer) return;
  if (!canUseSeat(playerIndex)) return;
  if (!tutorialBypass && !tutorialAllowsPass()) {
    state.log.unshift("Le tutoriel guide l'action suivante : suis l'étape indiquée par Coach Ju.");
    render();
    return;
  }
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
    playerName: displayPlayerName(player),
    opponentName: displayPlayerName(opponent),
    mandatoryPlacement: state.mandatoryPlacement,
    mandatoryPlacementReason: state.mandatoryPlacementReason,
    penaltyPowerGiven: state.mandatoryPlacement ? 0 : Math.max(2, player.endurance),
    constraintsBefore: constraintsLogInfo(),
    player: playerLogInfo(player),
    opponent: playerLogInfo(opponent),
  });
  const rosaBonus = opponent.characterId === "rosaBenavente" ? Number(opponent.rosaPassPowerBonus || 0) : 0;
  if (rosaBonus > 0) {
    opponent.power += rosaBonus;
    state.log.unshift(`Pouvoir de Rosa Benavente : ${displayPlayerName(opponent)} gagne +${rosaBonus} puissance supplémentaire car son adversaire passe.`);
  }
  if (state.mandatoryPlacement) {
    player.passed = true;
    const reasonLabel = state.mandatoryPlacementReason === "smash" ? "un Smash" : "un BOOST";
    state.log.unshift(`${displayPlayerName(player)} passe sur ${reasonLabel} : ${displayPlayerName(opponent)} gagne automatiquement.`);
    finishGame({
      forcedWinner: opponentIndex,
      ignoreScore: true,
      winType: state.mandatoryPlacementReason === "boost" ? "boost" : "smash",
      reason: `${displayPlayerName(player)} passe sur ${reasonLabel}. ${displayPlayerName(opponent)} gagne automatiquement l'échange.`,
    });
    return;
  }
  const bonus = Math.max(2, player.endurance);
  player.passed = true;
  opponent.power += bonus;
  state.log.unshift(`${displayPlayerName(player)} passe et donne ${bonus} puissance à ${displayPlayerName(opponent)}.`);
  finishGame({
    reason: `${displayPlayerName(player)} passe. ${displayPlayerName(opponent)} gagne ${bonus} puissance${rosaBonus ? `, plus ${rosaBonus} grâce au pouvoir de Rosa Benavente` : ""}. L'échange s'arrête immédiatement.`,
    extraPowerDetails: [
      { playerIndex: opponentIndex, label: "Pénalité de passe adverse", points: bonus },
      ...(rosaBonus ? [{ playerIndex: opponentIndex, label: "Pouvoir bleu de Rosa Benavente", points: rosaBonus }] : []),
    ],
  });
}

function exchangeWasAce(winner) {
  if (winner !== state.server) return false;
  const coups = state.players.flatMap((player) => player.played || [])
    .filter((card) => !isRemise(card));
  return coups.length === 1
    && coups[0].owner === winner
    && Boolean(coups[0].isServiceTurn);
}

function expireUsedTemporaryBonuses() {
  for (const [playerIndex, momentum] of (state.setMatch.momentum || []).entries()) {
    momentum.activeBonuses = (momentum.activeBonuses || [])
      .map((bonus) => {
        const remainingExchanges = Number(bonus.remainingExchanges || 0) - 1;
        return {
          ...bonus,
          remainingExchanges,
          label: `${bonus.baseLabel || bonus.label} · ${remainingExchanges} échange${remainingExchanges > 1 ? "s" : ""}`,
        };
      })
      .filter((bonus) => bonus.remainingExchanges > 0);
    state.players[playerIndex].temporaryBonuses = cloneData(momentum.activeBonuses);
  }
}

function activateSequenceBonus(playerIndex, triggerName, validFor) {
  const player = state.players[playerIndex];
  const momentum = state.setMatch.momentum?.[playerIndex];
  if (!momentum) return null;
  const bonus = wrappedRandomBonus(player, triggerName, triggerName, validFor);
  if (!bonus) return null;
  bonus.baseLabel = bonus.label;
  bonus.label = `${bonus.baseLabel} · ${validFor} échange${validFor > 1 ? "s" : ""}`;
  momentum.activeBonuses = [...(momentum.activeBonuses || []), cloneData(bonus)];
  player.temporaryBonuses = cloneData(momentum.activeBonuses);
  const message = `${displayPlayerName(player)} vient de déclencher le ${triggerName} : ${bonus.label} pour ${validFor} échange${validFor > 1 ? "s" : ""}.`;
  state.log.unshift(message);
  recordAction("bonus_activation", {
    playerIndex,
    playerName: displayPlayerName(player),
    trigger: triggerName,
    validForExchanges: validFor,
    bonus: cloneData(bonus),
    message,
  });
  return bonus;
}

function updateSequenceBonusesAfterExchange(winner) {
  if (!state.setMatch.momentum) state.setMatch.momentum = emptyMomentumState();
  expireUsedTemporaryBonuses();
  const loser = opponentOf(winner);
  state.setMatch.momentum[winner].consecutiveWins += 1;
  state.setMatch.momentum[loser].consecutiveWins = 0;
  const activated = [];
  if (exchangeWasAce(winner)) {
    const bonus = activateSequenceBonus(winner, "Ace", 1);
    if (bonus) activated.push(bonus);
  }
  if (state.setMatch.momentum[winner].consecutiveWins >= 3) {
    state.setMatch.momentum[winner].consecutiveWins = 0;
    const bonus = activateSequenceBonus(winner, "Enchaînement", 2);
    if (bonus) activated.push(bonus);
  }
  const completedSet = state.setMatch.setOver ? state.setMatch.completedScores.at(-1) : null;
  if (completedSet && Math.max(...completedSet) === 6 && Math.min(...completedSet) === 0 && state.setMatch.winner === winner) {
    const bonus = activateSequenceBonus(winner, "Bulle", 2);
    if (bonus) activated.push(bonus);
  }
  return activated;
}

function finishGame({ forcedWinner = null, ignoreScore = false, winType = "power", reason, extraPowerDetails = [] }) {
  const endBonusDetails = ignoreScore ? [] : applyEndBonuses();
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
    scoreText: ignoreScore ? "Victoire automatique : les points ne sont pas comptés." : `Score final : ${displayPlayerName(p1)} ${p1.power} - ${p2.power} ${displayPlayerName(p2)}${p1.power === p2.power ? `. Égalité : le serveur (${playerName(state.server)}) gagne.` : "."}`,
    setScore,
    endBonusDetails: [...extraPowerDetails, ...endBonusDetails],
  };
  if (state.setMatch.enabled) {
    applySetMatchScore(winner, setScore);
  }
  state.resultInfo.activatedBonuses = updateSequenceBonusesAfterExchange(winner);
  state.log.unshift(exchangeResultLogLine(winner, winType, setScore));
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
    activatedBonuses: cloneData(state.resultInfo.activatedBonuses),
  });
  storeMatchLog(winner, reason);
  handleTournamentMatchComplete();
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

function exchangeResultLogLine(winner, winType, exchangeScore) {
  const added = [0, 0];
  added[exchangeScore.winner] = Number(exchangeScore.winnerGames || 0);
  added[exchangeScore.loser] = Number(exchangeScore.loserGames || 0);
  const outcome = winType === "boost" ? "Victoire sur Boost" : winType === "power" ? "Victoire aux Points" : "Victoire sur Effet";
  const scoreImpact = `Jeux ajoutés au score du set : ${playerName(0)} +${added[0]} · ${playerName(1)} +${added[1]}`;
  if (winType !== "power") {
    return `Bilan de l’échange|${outcome} — ${playerName(winner)}|Les points de puissance ne sont pas pris en compte pour cette victoire.|${scoreImpact}`;
  }
  const powers = state.players.map((player) => Number(player.power || 0));
  const gap = Math.abs(powers[0] - powers[1]);
  const loserRule = gap < 5
    ? `Écart de ${gap}, inférieur à 5 : le perdant reçoit +1.`
    : `Écart de ${gap}, au moins égal à 5 : le perdant reçoit +0.`;
  return `Bilan de l’échange|${outcome} — ${playerName(winner)}|Puissance finale : ${playerName(0)} ${powers[0]} · ${playerName(1)} ${powers[1]}|Le vainqueur reçoit +2. ${loserRule}|${scoreImpact}`;
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
    updateTournamentSetProgress();
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
  state.log.unshift(`Score du set : ${playerName(0)} ${next[0]} / ${next[1]} ${playerName(1)}.`);
  if (state.setMatch.setOver) {
    state.log.unshift(`Score du match : ${playerName(0)} ${state.setMatch.setsWon[0]} / ${state.setMatch.setsWon[1]} ${playerName(1)}.`);
  }
  if (state.setMatch.matchOver) {
    state.log.unshift(`${playerName(state.setMatch.matchWinner)} gagne le match.`);
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

function startMatchMode(targetSets = null, options = {}) {
  if (SERVER_SYNC.enabled && !SERVER_SYNC.isHost) {
    state.log.unshift("Seul l'hôte peut lancer un set ou un match en ligne.");
    render();
    return;
  }
  if (!SERVER_SYNC.enabled && !options.keepSoloOpponent) {
    configureSoloOpponent();
  }
  resetSetMatch();
  state.setMatch.enabled = true;
  state.setMatch.targetSets = targetSets;
  state.setMatch.setsWon = [0, 0];
  state.setMatch.matchOver = false;
  state.setMatch.matchWinner = null;
  HUMAN_MATCH_TELEMETRY.forceNew = true;
  const server = Math.random() < 0.5 ? 0 : 1;
  confrontationIntroActive = !state.tutorial.active;
  newGame({ preserveSet: true, serverOverride: server });
  const styleLabel = aiStyleLabel();
  const formatLabel = targetSets ? `match en ${targetSets} sets gagnants` : "set complet";
  const opponentLabel = SERVER_SYNC.enabled ? "en ligne" : `contre ${characterNameFromId(SOLO_AI.characterId)} (${styleLabel})`;
  state.log.unshift(`Mode ${formatLabel} : ${opponentLabel}.`);
  markServerDirtyForHostAction();
  render();
  queueConfrontationIntro();
}

function startLeagueTournamentMode(targetSets = 2, options = {}) {
  targetSets = Number(targetSets) === 3 ? 3 : 2;
  if (SERVER_SYNC.enabled) {
    state.log.unshift("LEAGUE est disponible hors partie en ligne.");
    render();
    return;
  }
  resetTournament();
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.difficulty = normalizeAiDifficulty(options.difficulty || "normal");
  const humanCharacterId = selectedCharacterId();
  const weeklyCompetition = options.competition || null;
  if (weeklyCompetition) SOLO_AI.difficulty = "circuit";
  const aiClubHouse = Boolean(options.aiClubHouse);
  const circuitIntelligence = aiClubHouse && SOLO_AI.difficulty === "circuit";
  const humanLevel = circuitHumanLevel();
  const bonusLevel = normalizeAiBonusLevel(options.bonus || "none");
  const leagueDistribution = aiClubHouse ? options.distribution || "random" : "ranking";
  const setup = buildLeagueTournamentSetup({
    aiClubHouse,
    playerSelection: options.players || "random",
    distribution: leagueDistribution,
    humanCharacterId,
    humanLevel,
    weeklyCompetition,
  });
  const dynamicBonusIds = aiClubHouse ? [] : previousWeekDynamicBonusIds();
  const permanentBonuses = aiClubHouse
    ? {}
    : buildTournamentPermanentBonuses(setup.seededEntries, [], dynamicBonusIds);
  const surfaceBonuses = aiClubHouse
      ? buildAiClubHouseBonuses(setup.seededEntries, bonusLevel)
      : {};
  const aiIntelligenceLevels = weeklyCompetition
    ? weeklyCompetition.level === "Ultimate League" && humanLevel === 6
      ? Object.fromEntries(setup.seededEntries.filter((entry) => entry !== HUMAN_TOURNAMENT_ENTRY).map((entry) => [entry, "legend"]))
      : buildTournamentAiIntelligenceLevels(setup.seededEntries, "circuit", { humanLevel })
    : aiClubHouse
      ? buildTournamentAiIntelligenceLevels(setup.seededEntries, SOLO_AI.difficulty, { humanLevel })
      : {};
  state.tournament = {
    active: true,
    visible: true,
    league: true,
    aiClubHouse,
    difficulty: SOLO_AI.difficulty,
    aiIntelligenceLevels,
    bonusLevel,
    playerSelection: options.players || "random",
    distribution: leagueDistribution,
    weekly: Boolean(weeklyCompetition),
    competitionId: weeklyCompetition?.id || null,
    competitionName: weeklyCompetition?.name || `LEAGUE ${targetSets} sets`,
    competitionCity: weeklyCompetition?.city || null,
    competitionCountry: weeklyCompetition?.country || null,
    competitionFlag: weeklyCompetition?.flag || null,
    competitionSurface: weeklyCompetition?.surface || null,
    competitionSurfaceLabel: weeklyCompetition?.surfaceLabel || null,
    competitionSeason: Number(AUTH_STATE.competitions?.season || 1),
    competitionWeek: Number(AUTH_STATE.competitions?.week || 1),
    competitionPoints: weeklyCompetition?.points || null,
    matchBonusPoints: 0,
    matchBonusDetails: [],
    pointsRecorded: false,
    stage: "day1",
    targetSets,
    humanCharacterId,
    humanNickname: nicknameValue(),
    humanEntry: HUMAN_TOURNAMENT_ENTRY,
    aiFinalistCharacterId: null,
    currentMatch: null,
    nextHumanMatchId: null,
    championCharacterId: null,
    leagueGroups: setup.groups,
    leagueSeededEntries: setup.seededEntries,
    tournamentSeedNumbers: Object.fromEntries(setup.seededEntries.slice(0, 4).map((entry, index) => [entry, index + 1])),
    leagueCompletedDays: 0,
    humanCircuitLevel: weeklyCompetition || circuitIntelligence ? humanLevel : null,
    circuitBonusSurface: null,
    surfaceBonuses,
    permanentBonuses,
    seededCharacters: [],
    dynamicBonusIds,
    matches: [],
  };
  state.tournament.matches = buildLeagueTournamentMatches(setup.groups, HUMAN_TOURNAMENT_ENTRY, targetSets, setup.seededEntries);
  prepareLeagueHumanMatch();
  const bonusLabel = `bonus ${aiBonusLabel(bonusLevel)}`;
  state.log.unshift(weeklyCompetition
    ? `${weeklyCompetition.name} · ${targetSets} sets gagnants · niveau Circuit Pro ${humanLevel}.`
    : `CLUB HOUSE · LEAGUE ${targetSets} sets · intelligence ${tournamentDifficultyLabel(SOLO_AI.difficulty)} · ${bonusLabel}.`);
  render();
}

function rankedTournamentEntries(entries = []) {
  const rankByEntry = new Map(tournamentRankingEntries().map((entry) => [entry.entry, entry.rank]));
  const rankOf = (entry) => rankByEntry.get(entry) ?? 99999;
  return [...entries].sort((a, b) => rankOf(a) - rankOf(b) || tournamentPlayerLabel(a).localeCompare(tournamentPlayerLabel(b), "fr"));
}

function rankedAiTournamentEntries(entries = []) {
  return [...entries].sort((a, b) => tournamentRankIa(a) - tournamentRankIa(b)
    || characterNameFromId(a).localeCompare(characterNameFromId(b), "fr"));
}

function selectAiClubHousePlayers(count, selection = "random", humanCharacterId = selectedCharacterId()) {
  const available = TOURNAMENT_CHARACTER_POOL.filter((entry) => entry !== humanCharacterId);
  if (selection === "best") return rankedTournamentEntries(available).slice(0, count);
  return shuffle(available).slice(0, count);
}

function buildLeagueTournamentSetup(options = {}) {
  const humanLevel = Number(options.humanLevel || circuitHumanLevel());
  const rankedAi = rankedAiTournamentEntries(TOURNAMENT_CHARACTER_POOL);
  const weeklySelected = humanLevel === 6 ? rankedAi.slice(0, 7)
    : humanLevel === 5 ? rankedAi.slice(2, 9)
      : humanLevel === 4 ? rankedAi.slice(4, 11)
        : shuffle(rankedAi.slice(humanLevel === 3 ? 9 : humanLevel === 2 ? 11 : 13)).slice(0, 7);
  const selectedAi = options.weeklyCompetition
    ? weeklySelected
    : options.aiClubHouse
      ? selectAiClubHousePlayers(7, options.playerSelection, options.humanCharacterId)
      : shuffle(TOURNAMENT_CHARACTER_POOL).slice(0, 7);
  const roster = [HUMAN_TOURNAMENT_ENTRY, ...selectedAi];
  const seededEntries = rankedTournamentEntries(roster);
  if (options.distribution !== "ranking") {
    const randomEntries = shuffle(roster);
    return {
      seededEntries,
      groups: { A: randomEntries.slice(0, 4), B: randomEntries.slice(4, 8) },
    };
  }
  const pick = (rank) => seededEntries[rank - 1];
  return {
    seededEntries,
    groups: {
      A: [pick(1), pick(4), pick(5), pick(8)].filter(Boolean),
      B: [pick(2), pick(3), pick(6), pick(7)].filter(Boolean),
    },
  };
}

function buildLeagueTournamentMatches(groups, humanEntry, targetSets, seededEntries = []) {
  const match = (id, label, day, group, playerA, playerB) => {
    const playable = playerA === humanEntry || playerB === humanEntry;
    const item = {
      id,
      label,
      round: `day${day}`,
      day,
      group,
      seedA: seededEntries.indexOf(playerA) + 1,
      seedB: seededEntries.indexOf(playerB) + 1,
      playerA,
      playerB,
      winner: null,
      score: null,
      liveScore: null,
      playable,
      simulated: !playable,
      hiddenWinner: null,
      hiddenSetScores: null,
      revealedSetScores: [],
    };
    if (item.simulated) {
      const result = simulateAiTournamentMatch(item.playerA, item.playerB, targetSets);
      item.hiddenWinner = result.winner;
      item.hiddenSetScores = result.setScores;
    }
    return item;
  };
  const schedule = [
    [[0, 3], [1, 2]],
    [[0, 2], [3, 1]],
    [[0, 1], [2, 3]],
  ];
  const matches = [];
  for (const group of ["A", "B"]) {
    schedule.forEach((dayMatches, dayIndex) => {
      dayMatches.forEach(([indexA, indexB], matchIndex) => {
        matches.push(match(
          `league_${group.toLowerCase()}_d${dayIndex + 1}_m${matchIndex + 1}`,
          `Journée ${dayIndex + 1} · Groupe ${group}`,
          dayIndex + 1,
          group,
          groups[group][indexA],
          groups[group][indexB],
        ));
      });
    });
  }
  matches.push(
    {
      id: "league_semi1",
      label: "Demi-finale 1 · 1A contre 2B",
      round: "semi",
      playerA: null,
      playerB: null,
      winner: null,
      score: null,
      liveScore: null,
      playable: false,
      simulated: false,
      hiddenWinner: null,
      hiddenSetScores: null,
      revealedSetScores: [],
    },
    {
      id: "league_semi2",
      label: "Demi-finale 2 · 1B contre 2A",
      round: "semi",
      playerA: null,
      playerB: null,
      winner: null,
      score: null,
      liveScore: null,
      playable: false,
      simulated: false,
      hiddenWinner: null,
      hiddenSetScores: null,
      revealedSetScores: [],
    },
    {
      id: "final",
      label: "Finale",
      round: "final",
      playerA: null,
      playerB: null,
      winner: null,
      score: null,
      liveScore: null,
      playable: false,
      simulated: false,
      hiddenWinner: null,
      hiddenSetScores: null,
      revealedSetScores: [],
    },
  );
  return matches;
}

function prepareLeagueHumanMatch() {
  const nextMatch = nextHumanTournamentMatch();
  if (!nextMatch) {
    completeLeagueWithoutHuman();
    return;
  }
  state.tournament.currentMatch = nextMatch.id;
  state.tournament.nextHumanMatchId = null;
  state.tournament.stage = nextMatch.round;
  SOLO_AI.characterId = opponentCharacterInMatch(nextMatch, HUMAN_TOURNAMENT_ENTRY);
  startMatchMode(state.tournament.targetSets ?? 2, { keepSoloOpponent: true });
  state.tournament.currentMatch = nextMatch.id;
  state.tournament.stage = nextMatch.round;
  state.log.unshift(`${nextMatch.label} : ${selectedPlayerName()} contre ${characterNameFromId(SOLO_AI.characterId)}.`);
}

function leagueGroupMatches(group = null) {
  return state.tournament.matches.filter((match) => match.day && (!group || match.group === group));
}

function leagueCompletedGroupDays() {
  let days = 0;
  for (const day of [1, 2, 3]) {
    const dayMatches = leagueGroupMatches().filter((match) => match.day === day);
    if (dayMatches.length && dayMatches.every((match) => match.winner && match.score)) days = day;
  }
  return days;
}

function leagueStandings(group, throughDay = 3) {
  if (state.tournament.friendly) {
    return (state.tournament.friendlyStandings?.[group] || []).map((row) => ({
      entry: row.entry || row.player?.entry,
      points: Number(row.points || 0),
      played: Number(row.played || 0),
      wins: Number(row.wins || 0),
      losses: Number(row.losses || 0),
      setsWon: Number(row.setsWon || 0),
      setsLost: Number(row.setsLost || 0),
      gamesWon: Number(row.gamesWon || 0),
      gamesLost: Number(row.gamesLost || 0),
      setDifference: Number(row.setDifference || 0),
      gameDifference: Number(row.gameDifference || 0),
      worldRank: Number(row.worldRank || 999999),
    }));
  }
  const rows = new Map((state.tournament.leagueGroups?.[group] || []).map((entry) => [entry, {
    entry,
    points: 0,
    played: 0,
    wins: 0,
    losses: 0,
    setsWon: 0,
    setsLost: 0,
    gamesWon: 0,
    gamesLost: 0,
    worldRank: tournamentWorldRankForEntry(entry) ?? 999999,
  }]));
  for (const match of leagueGroupMatches(group)) {
    if (!match.score || !match.winner || Number(match.day || 0) > throughDay) continue;
    const setScores = match.revealedSetScores?.length ? match.revealedSetScores : parseTournamentScore(match.score);
    const playerAStats = rows.get(match.playerA);
    const playerBStats = rows.get(match.playerB);
    applyLeagueMatchStats(playerAStats, playerBStats, setScores);
    playerAStats.played += 1;
    playerBStats.played += 1;
    const winnerStats = rows.get(match.winner);
    const loserStats = match.winner === match.playerA ? playerBStats : playerAStats;
    winnerStats.points += 1;
    winnerStats.wins += 1;
    loserStats.losses += 1;
  }
  return [...rows.values()].map((row) => ({
    ...row,
    setDifference: row.setsWon - row.setsLost,
    gameDifference: row.gamesWon - row.gamesLost,
  })).sort((a, b) => (
    b.points - a.points
    || b.setDifference - a.setDifference
    || b.gameDifference - a.gameDifference
    || a.worldRank - b.worldRank
  ));
}

function parseTournamentScore(score = "") {
  return String(score).split(" - ").map((set) => {
    const [left, right] = set.split("/").map((value) => Number(value.trim()));
    return [left || 0, right || 0];
  }).filter((set) => set.some((value) => Number.isFinite(value)));
}

function applyLeagueMatchStats(playerAStats, playerBStats, setScores = []) {
  if (!playerAStats || !playerBStats) return;
  for (const [gamesA, gamesB] of setScores) {
    playerAStats.gamesWon += gamesA;
    playerAStats.gamesLost += gamesB;
    playerBStats.gamesWon += gamesB;
    playerBStats.gamesLost += gamesA;
    if (gamesA > gamesB) {
      playerAStats.setsWon += 1;
      playerBStats.setsLost += 1;
    } else {
      playerBStats.setsWon += 1;
      playerAStats.setsLost += 1;
    }
  }
}

function revealLeagueDay(day) {
  for (const match of state.tournament.matches.filter((item) => item.day === day)) {
    if (match.winner || match.score) continue;
    if (!ensureSimulatedTournamentMatchReady(match)) continue;
    match.revealedSetScores = match.hiddenSetScores.map((score) => [...score]);
    match.score = formatSetScores(match.revealedSetScores);
    match.winner = match.hiddenWinner;
  }
  state.tournament.leagueCompletedDays = Math.max(state.tournament.leagueCompletedDays || 0, leagueCompletedGroupDays());
}

function refreshLeagueKnockoutSlots() {
  if (!state.tournament.league || leagueCompletedGroupDays() < 3) return;
  const groupA = leagueStandings("A", 3);
  const groupB = leagueStandings("B", 3);
  setMatchPlayers(tournamentMatchById("league_semi1"), groupA[0]?.entry || null, groupB[1]?.entry || null);
  setMatchPlayers(tournamentMatchById("league_semi2"), groupB[0]?.entry || null, groupA[1]?.entry || null);
  const semi1 = tournamentMatchById("league_semi1");
  const semi2 = tournamentMatchById("league_semi2");
  const final = tournamentMatchById("final");
  if (final && (semi1?.winner || semi2?.winner)) {
    setMatchPlayers(final, semi1?.winner || null, semi2?.winner || null);
  }
}

function completeLeagueWithoutHuman() {
  refreshLeagueKnockoutSlots();
  for (const match of state.tournament.matches.filter((item) => item.round === "semi" || item.round === "final")) {
    if (!match.playerA || !match.playerB || match.winner) continue;
    if (isHumanTournamentEntry(match.playerA) || isHumanTournamentEntry(match.playerB)) continue;
    if (!ensureSimulatedTournamentMatchReady(match)) continue;
    match.winner = match.hiddenWinner;
    match.revealedSetScores = match.hiddenSetScores.map((score) => [...score]);
    match.score = formatSetScores(match.revealedSetScores);
    refreshLeagueKnockoutSlots();
  }
  const nextHumanMatch = nextHumanTournamentMatch();
  if (nextHumanMatch) {
    state.tournament.stage = "readyNext";
    state.tournament.currentMatch = null;
    state.tournament.nextHumanMatchId = nextHumanMatch.id;
    state.tournament.championCharacterId = null;
    return;
  }
  const final = tournamentMatchById("final");
  state.tournament.stage = final?.winner ? "complete" : state.tournament.stage;
  state.tournament.currentMatch = null;
  state.tournament.nextHumanMatchId = null;
  state.tournament.championCharacterId = final?.winner || null;
}

function buildAiClubHouseClassicSetup(options = {}) {
  const selectedAi = selectAiClubHousePlayers(15, options.playerSelection, options.humanCharacterId);
  const roster = [HUMAN_TOURNAMENT_ENTRY, ...selectedAi];
  const positions = Array(17).fill(null);
  const rankedRoster = rankedTournamentEntries(roster);
  const seedEntries = rankedRoster.slice(0, 4);
  if (options.distribution === "ranking") {
    rankedRoster.forEach((entry, index) => { positions[index + 1] = entry; });
  } else {
    shuffle(roster).forEach((entry, index) => { positions[index + 1] = entry; });
  }
  return {
    positions,
    seededHistorics: [],
    seedEntries,
    seedNumbers: Object.fromEntries(seedEntries.map((entry, index) => [entry, index + 1])),
    positionByEntry: tournamentPositionMap(positions),
    roster,
  };
}

function startTournamentMode(targetSets = 2, options = {}) {
  if (SERVER_SYNC.enabled) {
    state.log.unshift("Le tournoi IA est disponible hors partie en ligne.");
    render();
    return;
  }
  const weeklyCompetition = options.competition || null;
  resetTournament();
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.difficulty = normalizeAiDifficulty(options.difficulty || (weeklyCompetition ? "circuit" : "normal"));
  const requestedBonusLevel = normalizeAiBonusLevel(options.bonus || "none");
  const humanCharacterId = selectedCharacterId();
  if (weeklyCompetition) {
    startWeeklyTournamentMode(targetSets, weeklyCompetition, humanCharacterId);
    return;
  }
  const aiClubHouse = Boolean(options.aiClubHouse);
  const circuitIntelligence = aiClubHouse && SOLO_AI.difficulty === "circuit";
  const bonusLevel = requestedBonusLevel;
  const tournamentSetup = aiClubHouse
    ? buildAiClubHouseClassicSetup({
      humanCharacterId,
      playerSelection: options.players || "random",
      distribution: options.distribution || "random",
    })
    : buildTournamentRound16Positions(humanCharacterId, weeklyCompetition?.surface || "hard");
  const {
    positions,
    seededHistorics = [],
    seedEntries = [],
    seedNumbers = {},
    positionByEntry = tournamentPositionMap(positions),
    humanLevel = circuitHumanLevel(),
  } = tournamentSetup;
  const dynamicBonusIds = aiClubHouse ? [] : previousWeekDynamicBonusIds();
  const permanentBonuses = aiClubHouse
    ? {}
    : buildTournamentPermanentBonuses(positions, seededHistorics, dynamicBonusIds);
  const surfaceBonuses = aiClubHouse
      ? buildAiClubHouseBonuses(positions, bonusLevel)
      : {};
  const aiIntelligenceLevels = aiClubHouse
    ? buildTournamentAiIntelligenceLevels(positions, SOLO_AI.difficulty, { humanLevel })
    : {};
  state.tournament = {
    active: true,
    visible: false,
    bracket16: true,
    aiClubHouse,
    difficulty: SOLO_AI.difficulty,
    aiIntelligenceLevels,
    bonusLevel,
    playerSelection: options.players || "random",
    distribution: options.distribution || "random",
    weekly: Boolean(weeklyCompetition),
    competitionId: weeklyCompetition?.id || null,
    competitionName: weeklyCompetition?.name || (aiClubHouse ? "TOURNOI CLUB HOUSE" : null),
    competitionCity: weeklyCompetition?.city || null,
    competitionCountry: weeklyCompetition?.country || null,
    competitionFlag: weeklyCompetition?.flag || null,
    competitionSurface: weeklyCompetition?.surface || null,
    competitionSurfaceLabel: weeklyCompetition?.surfaceLabel || null,
    competitionPoints: weeklyCompetition?.points || null,
    matchBonusPoints: 0,
    matchBonusDetails: [],
    pointsRecorded: false,
    stage: "quarter",
    targetSets,
    humanCharacterId,
    humanNickname: nicknameValue(),
    humanEntry: HUMAN_TOURNAMENT_ENTRY,
    aiFinalistCharacterId: null,
    currentMatch: "qfHuman",
    nextHumanMatchId: null,
    championCharacterId: null,
    weeklyPositions: positions,
    tournamentPositions: positionByEntry,
    tournamentSeedNumbers: seedNumbers,
    humanCircuitLevel: circuitIntelligence ? humanLevel : null,
    circuitBonusSurface: null,
    surfaceBonuses,
    permanentBonuses,
    seededCharacters: aiClubHouse ? [] : seededHistorics,
    dynamicBonusIds,
    matches: [],
  };
  state.tournament.matches = buildWeeklyTournamentMatches(positions, HUMAN_TOURNAMENT_ENTRY, targetSets);
  refreshTournamentDerivedSlots();
  const firstHumanMatch = nextHumanTournamentMatch();
  state.tournament.currentMatch = firstHumanMatch?.id || null;
  SOLO_AI.characterId = opponentCharacterInMatch(firstHumanMatch, HUMAN_TOURNAMENT_ENTRY);
  startMatchMode(targetSets, { keepSoloOpponent: true });
  state.tournament.currentMatch = firstHumanMatch?.id || null;
  state.tournament.stage = firstHumanMatch?.round || "round16";
  const tournamentLabel = weeklyCompetition?.name || `Tournoi amical ${targetSets} sets`;
  const surfaceText = weeklyCompetition?.surfaceLabel ? ` · ${weeklyCompetition.surfaceLabel}` : "";
  state.log.unshift(`${tournamentLabel}${surfaceText} : 8e de finale contre ${characterNameFromId(SOLO_AI.characterId)}.`);
  render();
}

function currentUserTournamentRanking() {
  const userId = authenticatedUserId();
  if (!userId) return null;
  const candidates = [
    [AUTH_STATE.gameplayRanking, AUTH_STATE.gameplayRankingUserId],
    [AUTH_STATE.ranking, AUTH_STATE.rankingUserId],
    [AUTH_STATE.lobbyRanking, AUTH_STATE.lobbyRankingUserId],
  ];
  return candidates.find(([ranking, ownerId]) => (
    ranking
    && ownerId === userId
    && String(ranking.currentUserRank?.id || "") === userId
  ))?.[0] || null;
}

function currentRankingTotalPoints() {
  const current = currentUserTournamentRanking()?.currentUserRank;
  return Number(current?.score_ref || 0);
}

function humanCircuitLevelInfo(points = currentRankingTotalPoints()) {
  const total = Math.max(0, Number(points || 0));
  return HUMAN_CIRCUIT_LEVELS.find((level) => total >= level.min && total <= level.max)
    || HUMAN_CIRCUIT_LEVELS[0];
}

function circuitHumanLevel(points = currentRankingTotalPoints()) {
  const total = Math.max(0, Number(points || 0));
  if (total < 500) return 1;
  if (total < 1000) return 2;
  if (total < 2500) return 3;
  if (total < 5000) return 4;
  if (total < 8000) return 5;
  return 6;
}

function tournamentRankingEntries() {
  const ranking = currentUserTournamentRanking();
  const rows = [...(ranking?.top || [])];
  const current = ranking?.currentUserRank;
  if (current && !rows.some((row) => row.id === current.id)) rows.push(current);
  return rows
    .map((row) => {
      if (row.is_ai || String(row.id || "").startsWith("ai:")) {
        return {
          entry: String(row.id).replace(/^ai:/, ""),
          rank: Number(row.points_rank || row.rank || 9999),
          worldRank: Number(row.points_rank || row.rank || 9999),
          scoreRef: Number(row.score_ref || 0),
          scoreWeek: Number(row.score_week || 0),
          scoreTotal: Number(row.score_total || 0),
          previousWeek: Number(row.score_previous_week || 0),
        };
      }
      if (AUTH_STATE.user && String(row.id) === String(AUTH_STATE.user.id)) {
        return {
          entry: HUMAN_TOURNAMENT_ENTRY,
          rank: Number(row.points_rank || row.rank || 9999),
          worldRank: Number(row.points_rank || row.rank || 9999),
          scoreRef: Number(row.score_ref || 0),
          scoreWeek: Number(row.score_week || 0),
          scoreTotal: Number(row.score_total || 0),
          previousWeek: Number(row.score_previous_week || 0),
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank || String(a.entry).localeCompare(String(b.entry), "fr"));
}

function tournamentAiRankingEntries() {
  return tournamentRankingEntries()
    .filter((entry) => entry.entry !== HUMAN_TOURNAMENT_ENTRY)
    .sort((a, b) => b.scoreRef - a.scoreRef
      || b.scoreWeek - a.scoreWeek
      || b.scoreTotal - a.scoreTotal
      || characterNameFromId(a.entry).localeCompare(characterNameFromId(b.entry), "fr"))
    .map((entry, index) => ({ ...entry, rankIa: index + 1 }));
}

function tournamentRankIa(entry) {
  const ranked = tournamentAiRankingEntries();
  const stored = ranked.find((item) => item.entry === entry)?.rankIa;
  if (stored) return stored;
  const missing = TOURNAMENT_CHARACTER_POOL
    .filter((characterId) => !ranked.some((item) => item.entry === characterId))
    .sort((a, b) => characterNameFromId(a).localeCompare(characterNameFromId(b), "fr"));
  const index = missing.indexOf(entry);
  return index >= 0 ? ranked.length + index + 1 : 99999;
}

function tournamentWorldRankForEntry(entry) {
  return tournamentRankingEntries().find((row) => row.entry === entry)?.worldRank ?? null;
}

function tournamentHeadToHeadBonus(aiCharacterId) {
  const profile = AUTH_STATE.profileUserId === authenticatedUserId() ? AUTH_STATE.profile : null;
  const row = (profile?.aiResults || []).find((result) => (
    String(result.ai_character_id || result.aiCharacterId || "") === String(aiCharacterId || "")
  ));
  const wins = Number(row?.wins || 0);
  const losses = Number(row?.losses || 0);
  const matches = wins + losses;
  const winRatio = (wins / matches) * 100;
  if (matches >= 10 && winRatio > 90) return { target: "human", placement: 2, label: "Domination : +2 placement" };
  if (matches <= 5) return null;
  if (winRatio > 70 && state.tournament?.difficulty !== "circuit") {
    return { target: "human", placement: 1, label: "Ascendant : +1 placement" };
  }
  if (winRatio < 20) return { target: "ai", placement: 2, label: "Bête noire : +2 placement" };
  if (winRatio < 30) return { target: "ai", placement: 1, label: "Ascendant : +1 placement" };
  return null;
}

function previousWeekDynamicBonusIds() {
  return tournamentRankingEntries()
    .filter((entry) => entry.entry !== HUMAN_TOURNAMENT_ENTRY
      && TOURNAMENT_CHARACTER_POOL.includes(entry.entry)
      && !HISTORIC_TOURNAMENT_PLAYERS.includes(entry.entry))
    .sort((a, b) => b.previousWeek - a.previousWeek || a.rank - b.rank || String(a.entry).localeCompare(String(b.entry), "fr"))
    .slice(0, 2)
    .map((entry) => entry.entry);
}

function randomSurfaceBonus(surface) {
  const options = SURFACE_BONUSES[surface] || [];
  return options[Math.floor(Math.random() * options.length)] || null;
}

function allCircuitSeedBonuses() {
  return Object.entries(SURFACE_BONUSES).flatMap(([surface, bonuses]) => (
    bonuses.map((bonus) => ({ ...bonus, surface }))
  ));
}

function randomCircuitBonus(excludedIds = []) {
  const excluded = new Set(excludedIds);
  return shuffle(allCircuitSeedBonuses()).find((bonus) => !excluded.has(bonus.id)) || null;
}

function wrappedRandomBonus(player, label, reason, remainingExchanges = null) {
  const excludedIds = [
    ...(player.surfaceBonuses || []),
    ...(player.permanentBonuses || []),
    ...(player.temporaryBonuses || []),
  ].map((bonus) => bonus.sourceBonusId || bonus.id);
  const source = randomCircuitBonus(excludedIds) || randomCircuitBonus();
  if (!source) return null;
  return {
    ...source,
    id: `${label.toLowerCase().replace(/\s+/g, "-")}-${crypto.randomUUID()}`,
    sourceBonusId: source.id,
    label: `${label} · ${source.label}`,
    reason,
    remainingExchanges,
  };
}

function persistMatchPermanentAward(playerIndex, bonus) {
  if (!bonus) return;
  const momentum = state.setMatch.momentum?.[playerIndex];
  if (!momentum) return;
  momentum.permanentAwards = [...(momentum.permanentAwards || []), cloneData(bonus)];
  state.players[playerIndex].permanentBonuses.push(cloneData(bonus));
}

function applyMotivationBonus() {
  const ranks = state.players.map((player) => Number(player.worldRank || 0) || null);
  if (!ranks[0] || !ranks[1] || ranks[0] === ranks[1]) return;
  const lessWellRanked = ranks[0] > ranks[1] ? 0 : 1;
  const momentum = state.setMatch.momentum?.[lessWellRanked];
  if (!momentum || momentum.motivationResolved) return;
  momentum.motivationResolved = true;
  if (Math.random() >= 0.5) return;
  const bonus = wrappedRandomBonus(
    state.players[lessWellRanked],
    "Motivation",
    "Joueur moins bien classé",
  );
  persistMatchPermanentAward(lessWellRanked, bonus);
}

function applyHumanAscendantBonus() {
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || !state.tournament.active) return;
  const momentum = state.setMatch.momentum?.[0];
  if (!momentum || momentum.ascendantResolved) return;
  momentum.ascendantResolved = true;
  const headToHead = tournamentHeadToHeadBonus(state.players[1].characterId);
  if (headToHead?.target !== "human" || Math.random() >= 0.5) return;
  const bonus = wrappedRandomBonus(
    state.players[0],
    "Ascendant",
    `Ascendant sur ${displayPlayerName(state.players[1])}`,
  );
  persistMatchPermanentAward(0, bonus);
}

function addCircuitBonus(target, entry, bonus) {
  if (!entry || !bonus) return;
  target[entry] = [...(target[entry] || []), { ...bonus }];
}

function buildCircuitProBonuses(entries = [], seededEntries = [], surface = null) {
  const presentAi = [...new Set(entries.filter((entry) => entry && entry !== HUMAN_TOURNAMENT_ENTRY))];
  const rankedAi = rankedAiTournamentEntries(presentAi);
  const topSeeds = [...new Set(seededEntries.filter((entry) => presentAi.includes(entry)))].slice(0, 2);
  for (const entry of rankedAi) {
    if (topSeeds.length >= 2) break;
    if (!topSeeds.includes(entry)) topSeeds.push(entry);
  }
  const circuitSurface = SURFACE_BONUSES[surface]
    ? surface
    : shuffle(Object.keys(SURFACE_BONUSES))[0] || "hard";
  const bonuses = {};

  for (const entry of topSeeds) {
    const surfaceBonus = randomSurfaceBonus(circuitSurface);
    addCircuitBonus(bonuses, entry, surfaceBonus ? { ...surfaceBonus, surface: circuitSurface } : null);
    if (Math.random() < 0.5) {
      addCircuitBonus(bonuses, entry, randomCircuitBonus((bonuses[entry] || []).map((bonus) => bonus.id)));
    }
  }

  for (const entry of rankedAi.filter((entry) => !topSeeds.includes(entry)).slice(0, 6)) {
    if (Math.random() < 0.5) addCircuitBonus(bonuses, entry, randomCircuitBonus());
  }

  const worldNumberOne = tournamentAiRankingEntries().find((entry) => entry.rankIa === 1)?.entry || null;
  if (worldNumberOne && presentAi.includes(worldNumberOne) && (bonuses[worldNumberOne] || []).length < 2) {
    addCircuitBonus(
      bonuses,
      worldNumberOne,
      randomCircuitBonus((bonuses[worldNumberOne] || []).map((bonus) => bonus.id)),
    );
  }
  return { bonuses, surface: circuitSurface, topSeeds };
}

function buildWeeklyCircuitProBonuses(entries = [], seedEntries = [], surface = "hard", humanLevel = 1) {
  const present = new Set(entries.filter(Boolean));
  const topSeeds = seedEntries.filter((entry) => present.has(entry)).slice(0, 4);
  const bonuses = {};
  for (const [seedIndex, entry] of topSeeds.entries()) {
    if (entry === HUMAN_TOURNAMENT_ENTRY) continue;
    const surfaceBonus = randomSurfaceBonus(surface);
    addCircuitBonus(bonuses, entry, surfaceBonus ? { ...surfaceBonus, surface } : null);
    if (humanLevel >= 3 && seedIndex < 2 && Math.random() < 0.75) {
      addCircuitBonus(
        bonuses,
        entry,
        randomCircuitBonus((bonuses[entry] || []).map((bonus) => bonus.id)),
      );
    }
    if (humanLevel >= 3 && seedIndex < 2 && Math.random() < 0.5) {
      addCircuitBonus(
        bonuses,
        entry,
        randomCircuitBonus((bonuses[entry] || []).map((bonus) => bonus.id)),
      );
    } else if (humanLevel < 3 && Math.random() < 0.5) {
      addCircuitBonus(
        bonuses,
        entry,
        randomCircuitBonus((bonuses[entry] || []).map((bonus) => bonus.id)),
      );
    }
  }
  if (humanLevel >= 3) {
    for (const entry of entries.slice(5, 9).filter((candidate) => candidate && candidate !== HUMAN_TOURNAMENT_ENTRY)) {
      if (Math.random() < 0.5) addCircuitBonus(bonuses, entry, randomCircuitBonus());
    }
  }
  return { bonuses, surface, topSeeds };
}

function aiCircuitPerformanceRank(entry) {
  const rankIa = tournamentRankIa(entry);
  return rankIa < 99999 ? rankIa : null;
}

function buildAiClubHouseBonuses(entries = [], bonusLevel = "none") {
  const bonuses = {};
  const bonusCount = aiBonusCount(bonusLevel);
  if (!bonusCount) return bonuses;
  const aiEntries = [...new Set(entries.filter((entry) => entry && entry !== HUMAN_TOURNAMENT_ENTRY))];
  for (const entry of aiEntries) {
    bonuses[entry] = shuffle(allCircuitSeedBonuses()).slice(0, bonusCount);
  }
  return bonuses;
}

function randomHistoricPermanentBonus() {
  const bonus = HISTORIC_PERMANENT_BONUSES[Math.floor(Math.random() * HISTORIC_PERMANENT_BONUSES.length)];
  return bonus ? { ...bonus } : null;
}

function buildHistoricPermanentBonuses(entries = []) {
  const bonuses = {};
  for (const entry of entries) {
    const characterId = tournamentEntryCharacterId(entry);
    if (!HISTORIC_TOURNAMENT_PLAYERS.includes(characterId)) continue;
    const bonus = randomHistoricPermanentBonus();
    if (bonus) bonuses[characterId] = [bonus];
  }
  return bonuses;
}

function addPermanentBonus(target, entry, bonus) {
  if (!entry || !bonus) return;
  target[entry] = [...(target[entry] || []), { ...bonus }];
}

function buildCircuitSeedPermanentBonuses(seedEntries = []) {
  const bonuses = {};
  for (const entry of seedEntries.slice(0, 4)) {
    if (!entry || entry === HUMAN_TOURNAMENT_ENTRY || Math.random() >= 0.5) continue;
    addPermanentBonus(bonuses, entry, {
      id: "circuitSeedPrecisionPlacement",
      label: "Tête de série IA : +1 précision / +1 placement",
      precision: 1,
      placement: 1,
    });
  }
  return bonuses;
}

function buildTournamentPermanentBonuses(entries = [], seededEntries = [], dynamicBonusIds = []) {
  const bonuses = {};
  const ranked = tournamentRankingEntries();
  const worldLeader = ranked.find((entry) => entry.rank === 1)?.entry || null;
  const seeded = new Set(seededEntries);
  const usedEntries = new Set(entries.filter(Boolean));

  if (worldLeader && worldLeader !== HUMAN_TOURNAMENT_ENTRY && usedEntries.has(worldLeader) && !seeded.has(worldLeader)) {
    addPermanentBonus(bonuses, worldLeader, {
      id: "worldNumberOnePermanent",
      label: "Numéro 1 mondial : +2 précision / +2 placement",
      precision: 2,
      placement: 2,
    });
  }

  for (const entry of seededEntries) {
    if (entry === HUMAN_TOURNAMENT_ENTRY) continue;
    addPermanentBonus(bonuses, entry, {
      id: "seededPermanent",
      label: "Tête de série : +1 précision / +1 placement",
      precision: 1,
      placement: 1,
    });
  }

  for (const entry of usedEntries) {
    if (entry === HUMAN_TOURNAMENT_ENTRY) continue;
    const characterId = entry === HUMAN_TOURNAMENT_ENTRY ? selectedCharacterId() : entry;
    const eligibleHistoric = HISTORIC_TOURNAMENT_PLAYERS.includes(characterId);
    const eligibleMomentum = dynamicBonusIds.includes(entry);
    if ((!eligibleHistoric && !eligibleMomentum) || entry === worldLeader || seeded.has(entry)) continue;
    const bonus = randomHistoricPermanentBonus();
    if (bonus) addPermanentBonus(bonuses, entry, bonus);
  }
  return bonuses;
}

function addDynamicPermanentBonuses(permanentBonuses, dynamicBonusIds = []) {
  const bonuses = cloneData(permanentBonuses || {});
  for (const characterId of dynamicBonusIds) {
    if (!characterId || characterId === HUMAN_TOURNAMENT_ENTRY) continue;
    bonuses[characterId] = [
      ...(bonuses[characterId] || []),
      {
        id: "previousWeekMomentum",
        label: "Dynamique",
        description: "Top 4 semaine precedente : +1 precision",
        precision: 1,
      },
    ];
  }
  return bonuses;
}

function buildWeeklySurfaceBonuses(surface, seededCharacters) {
  const bonuses = {};
  for (const characterId of seededCharacters) {
    const bonus = randomSurfaceBonus(surface);
    if (bonus) bonuses[characterId] = { ...bonus, surface };
  }
  return bonuses;
}

function sortTournamentEntriesByWorldRank(entries = []) {
  return [...entries].sort((a, b) => {
    const rankDifference = (tournamentWorldRankForEntry(a) ?? 99999) - (tournamentWorldRankForEntry(b) ?? 99999);
    if (rankDifference) return rankDifference;
    return tournamentPlayerLabel(a).localeCompare(tournamentPlayerLabel(b), "fr");
  });
}

function tournamentPositionMap(positions = []) {
  return Object.fromEntries(positions
    .map((entry, position) => entry ? [entry, position] : null)
    .filter(Boolean));
}

function buildTournamentRound16Positions(humanCharacterId, surface = "hard", points = currentRankingTotalPoints()) {
  const humanLevel = circuitHumanLevel(points);
  const positions = Array(17).fill(null);
  const rankedAi = rankedAiTournamentEntries(TOURNAMENT_CHARACTER_POOL);

  if (humanLevel === 1) {
    const roster = [HUMAN_TOURNAMENT_ENTRY, ...shuffle(rankedAi).slice(0, 15)];
    const rankedRoster = sortTournamentEntriesByWorldRank(roster);
    rankedRoster.slice(0, 4).forEach((entry, index) => { positions[index + 1] = entry; });
    shuffle(rankedRoster.slice(4)).forEach((entry, index) => { positions[index + 5] = entry; });
  } else {
    const specialistCandidates = rankedAi.filter((entry) => AI_SURFACE_PREFERENCES[entry] === surface).slice(0, 2);
    const otherCandidates = rankedAi.filter((entry) => AI_SURFACE_PREFERENCES[entry] !== surface).slice(0, 2);
    const groupOne = sortTournamentEntriesByWorldRank([
      ...specialistCandidates,
      ...otherCandidates,
      HUMAN_TOURNAMENT_ENTRY,
    ]);
    groupOne.slice(0, 4).forEach((entry, index) => { positions[index + 1] = entry; });

    const topSeedSet = new Set(positions.slice(1, 5).filter(Boolean));
    const groupTwoPool = rankedAi.filter((entry) => !topSeedSet.has(entry)).slice(0, 6);
    const groupTwo = topSeedSet.has(HUMAN_TOURNAMENT_ENTRY)
      ? shuffle(groupTwoPool).slice(0, 5)
      : [...shuffle(groupTwoPool).slice(0, 4), HUMAN_TOURNAMENT_ENTRY];
    sortTournamentEntriesByWorldRank(groupTwo).slice(0, 4)
      .forEach((entry, index) => { positions[index + 5] = entry; });

    const placed = new Set(positions.slice(1, 9).filter(Boolean));
    const remainingAi = rankedAi.filter((entry) => !placed.has(entry));
    const finalGroup = placed.has(HUMAN_TOURNAMENT_ENTRY)
      ? shuffle(remainingAi).slice(0, 8)
      : [HUMAN_TOURNAMENT_ENTRY, ...shuffle(remainingAi).slice(0, 7)];
    shuffle(finalGroup).forEach((entry, index) => { positions[index + 9] = entry; });
  }

  const seedEntries = positions.slice(1, 5);
  return {
    positions,
    seededHistorics: seedEntries.filter((entry) => entry !== HUMAN_TOURNAMENT_ENTRY),
    seedEntries,
    seedNumbers: Object.fromEntries(seedEntries.map((entry, index) => [entry, index + 1])),
    positionByEntry: tournamentPositionMap(positions),
    humanLevel,
    humanCharacterId,
  };
}

function startWeeklyTournamentMode(targetSets, weeklyCompetition, humanCharacterId) {
  const surface = weeklyCompetition.surface || "hard";
  applySurfaceBackground(surface);
  const {
    positions,
    seedEntries,
    seedNumbers,
    positionByEntry,
    humanLevel,
  } = buildTournamentRound16Positions(humanCharacterId, surface);
  SOLO_AI.difficulty = "circuit";
  const circuitBonusSetup = buildWeeklyCircuitProBonuses(positions, seedEntries, surface, humanLevel);
  const surfaceBonuses = circuitBonusSetup.bonuses;
  const aiIntelligenceLevels = buildTournamentAiIntelligenceLevels(positions, "circuit", { humanLevel });
  const dynamicBonusIds = [];
  const permanentBonuses = buildCircuitSeedPermanentBonuses(seedEntries);
  state.tournament = {
    active: true,
    visible: false,
    bracket16: true,
    difficulty: "circuit",
    aiIntelligenceLevels,
    weekly: true,
    competitionId: weeklyCompetition.id,
    competitionName: weeklyCompetition.name,
    competitionCity: weeklyCompetition.city,
    competitionCountry: weeklyCompetition.country,
    competitionFlag: weeklyCompetition.flag,
    competitionSurface: weeklyCompetition.surface,
    competitionSurfaceLabel: weeklyCompetition.surfaceLabel,
    competitionSeason: Number(AUTH_STATE.competitions?.season || 1),
    competitionWeek: Number(AUTH_STATE.competitions?.week || 1),
    competitionPoints: weeklyCompetition.points,
    matchBonusPoints: 0,
    matchBonusDetails: [],
    pointsRecorded: false,
    stage: "weekly",
    targetSets,
    humanCharacterId,
    humanNickname: nicknameValue(),
    humanEntry: HUMAN_TOURNAMENT_ENTRY,
    aiFinalistCharacterId: null,
    currentMatch: null,
    nextHumanMatchId: null,
    championCharacterId: null,
    weeklyPositions: positions,
    tournamentPositions: positionByEntry,
    tournamentSeedNumbers: seedNumbers,
    humanCircuitLevel: humanLevel,
    circuitBonusSurface: circuitBonusSetup.surface,
    surfaceBonuses,
    permanentBonuses,
    seededCharacters: seedEntries,
    dynamicBonusIds,
    matches: [],
  };
  state.tournament.matches = buildWeeklyTournamentMatches(positions, HUMAN_TOURNAMENT_ENTRY, targetSets);
  refreshWeeklyTournamentDerivedSlots();
  let firstHumanMatch = nextHumanTournamentMatch();
  state.tournament.currentMatch = firstHumanMatch?.id || null;
  SOLO_AI.characterId = opponentCharacterInMatch(firstHumanMatch, HUMAN_TOURNAMENT_ENTRY);
  startMatchMode(targetSets, { keepSoloOpponent: true });
  state.tournament.stage = firstHumanMatch?.round || "weekly";
  state.tournament.currentMatch = firstHumanMatch?.id || null;
  state.log.unshift(`${weeklyCompetition.name} ${weeklyCompetition.surfaceLabel} : 8e de finale contre ${characterNameFromId(SOLO_AI.characterId)}.`);
  render();
}

function buildWeeklyTournamentMatches(positions, humanEntry, targetSets) {
  const match = (id, label, round, playerA, playerB) => ({
    id,
    label,
    round,
    playerA,
    playerB,
    positionA: state.tournament?.tournamentPositions?.[playerA] ?? null,
    positionB: state.tournament?.tournamentPositions?.[playerB] ?? null,
    winner: null,
    score: null,
    liveScore: null,
    playable: playerA === humanEntry || playerB === humanEntry,
    simulated: playerA !== humanEntry && playerB !== humanEntry,
    hiddenWinner: null,
    hiddenSetScores: null,
    revealedSetScores: [],
  });
  const circuitPositionPairs = [[1, 16], [9, 8], [5, 12], [13, 4], [3, 14], [11, 6], [7, 10], [15, 2]];
  const displayOrderPairs = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 14], [15, 16]];
  const round16Pairs = state.tournament?.weekly || state.tournament?.distribution === "ranking"
    ? circuitPositionPairs
    : displayOrderPairs;
  return [
    ...round16Pairs.map(([positionA, positionB], index) => match(
      `r16_${index + 1}`,
      `8e de finale ${index + 1}`,
      "round16",
      positions[positionA],
      positions[positionB],
    )),
    match("qf1", "Quart de finale 1", "quarter", null, null),
    match("qf2", "Quart de finale 2", "quarter", null, null),
    match("qf3", "Quart de finale 3", "quarter", null, null),
    match("qf4", "Quart de finale 4", "quarter", null, null),
    match("semi1", "Demi-finale 1", "semi", null, null),
    match("semi2", "Demi-finale 2", "semi", null, null),
    match("final", "Finale", "final", null, null),
  ].map((item) => {
    if (item.simulated) {
      const result = simulateAiTournamentMatch(item.playerA, item.playerB, targetSets);
      item.hiddenWinner = result.winner;
      item.hiddenSetScores = result.setScores;
    }
    return item;
  });
}

function buildSimulatedTournamentMatch(id, label, playerA, playerB, targetSets, round) {
  const result = simulateAiTournamentMatch(playerA, playerB, targetSets);
  return {
    id,
    label,
    round,
    playerA,
    playerB,
    winner: null,
    score: null,
    hiddenWinner: result.winner,
    hiddenSetScores: result.setScores,
    revealedSetScores: [],
    simulated: true,
  };
}

function simulateAiTournamentMatch(playerA, playerB, targetSets = state.tournament.targetSets ?? 2) {
  const strengthA = aiTournamentStrength(playerA);
  const strengthB = aiTournamentStrength(playerB);
  const winChanceA = Math.max(0.1, Math.min(0.9, 1 / (1 + Math.exp(-(strengthA - strengthB) / 9))));
  const winner = Math.random() < winChanceA ? playerA : playerB;
  const setScores = randomMatchSetScoresForWinner(winner === playerA ? 0 : 1, targetSets);
  return { winner, setScores, score: formatSetScores(setScores) };
}

function aiTournamentStrength(characterId) {
  const isHistoric = HISTORIC_TOURNAMENT_PLAYERS.includes(characterId);
  const isSeeded = (state.tournament?.seededCharacters || []).includes(characterId);
  const permanentBonuses = state.tournament?.permanentBonuses?.[characterId] ?? [];
  const dynamicBonus = (state.tournament?.dynamicBonusIds || []).includes(characterId) ? 5 : 0;
  const assignedSurfaceBonuses = state.tournament?.surfaceBonuses?.[characterId];
  const surfaceBonusCount = Array.isArray(assignedSurfaceBonuses)
    ? assignedSurfaceBonuses.length
    : assignedSurfaceBonuses
      ? 1
      : 0;
  const circuitRules = state.tournament?.difficulty === "circuit";
  const surfaceBonus = surfaceBonusCount * 4;
  const historicBonus = circuitRules ? 0 : isHistoric ? 8 : 0;
  const seededBonus = circuitRules ? 0 : isSeeded ? 4 : 0;
  const permanentBonus = circuitRules ? 0 : permanentBonuses.length ? 3 : 0;
  const usesAssignedIntelligence = Boolean(state.tournament?.aiIntelligenceLevels?.[characterId]);
  const intelligenceLevel = usesAssignedIntelligence || state.tournament?.aiClubHouse
    ? aiIntelligenceForEntry(characterId, state.tournament.difficulty)
    : "expert";
  const intelligenceBonus = { amateur: -4, normal: 0, expert: 8, champion: 12, legend: 17 }[intelligenceLevel];
  const rankIa = tournamentRankIa(characterId);
  const rankIaBonus = rankIa < 99999 ? Math.max(0, 22 - rankIa) * 0.55 : 0;
  const base = COACH_OPTIONS.includes(characterId) ? 48 : 54;
  return base + historicBonus + seededBonus + surfaceBonus + permanentBonus + dynamicBonus + intelligenceBonus + rankIaBonus + Math.floor(Math.random() * 13);
}

function randomMatchSetScoresForWinner(winnerIndex, targetSets = 2) {
  const setScores = [];
  let winnerSets = 0;
  let loserSets = 0;
  const winningSetScores = [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [7, 5], [7, 6]];
  const losingSetScores = [[4, 6], [3, 6], [5, 7], [6, 7]];
  while (winnerSets < targetSets) {
    const winnerLosesSet = loserSets < targetSets - 1 && winnerSets < targetSets - 1 && Math.random() < 0.28;
    const pool = winnerLosesSet ? losingSetScores : winningSetScores;
    const score = pool[Math.floor(Math.random() * pool.length)];
    if (winnerLosesSet) loserSets += 1;
    else winnerSets += 1;
    const oriented = winnerIndex === 0 ? score : [score[1], score[0]];
    setScores.push([oriented[0], oriented[1]]);
  }
  return setScores;
}

function formatSetScores(setScores = []) {
  return setScores.map((score) => `${score[0]}/${score[1]}`).join(" - ");
}

function tournamentMatchById(matchId) {
  return state.tournament.matches.find((match) => match.id === matchId);
}

function humanTournamentEntry() {
  return state.tournament.humanEntry || HUMAN_TOURNAMENT_ENTRY;
}

function isHumanTournamentEntry(entry) {
  return entry === humanTournamentEntry() || (!state.tournament.humanEntry && entry === state.tournament.humanCharacterId);
}

function tournamentEntryCharacterId(entry) {
  if (state.tournament?.friendly) return friendlyEntryCharacterId(entry);
  return isHumanTournamentEntry(entry) ? state.tournament.humanCharacterId : entry;
}

function tournamentWinnerEntryFromMatchWinner(winnerIndex) {
  return winnerIndex === 0 ? humanTournamentEntry() : state.players[winnerIndex]?.characterId;
}

function opponentCharacterInMatch(match, humanEntry = humanTournamentEntry()) {
  if (!match) return randomAiCharacterId();
  const opponentEntry = match.playerA === humanEntry ? match.playerB : match.playerA;
  return tournamentEntryCharacterId(opponentEntry);
}

function nextHumanTournamentMatch() {
  const human = humanTournamentEntry();
  return state.tournament.matches.find((match) => {
    if (match.winner || match.score) return false;
    if (match.playerA !== human && match.playerB !== human) return false;
    const opponent = opponentCharacterInMatch(match, human);
    return Boolean(opponent);
  }) || null;
}

function setMatchPlayers(match, playerA, playerB) {
  if (!match) return;
  const wasReady = Boolean(match.playerA && match.playerB);
  match.playerA = playerA ?? null;
  match.playerB = playerB ?? null;
  match.positionA = state.tournament?.tournamentPositions?.[match.playerA] ?? null;
  match.positionB = state.tournament?.tournamentPositions?.[match.playerB] ?? null;
  match.playable = isHumanTournamentEntry(match.playerA) || isHumanTournamentEntry(match.playerB);
  match.simulated = Boolean(match.playerA && match.playerB && !match.playable);
  if (!wasReady && match.simulated) {
    match.hiddenWinner = null;
    match.hiddenSetScores = null;
    match.revealedSetScores = [];
    match.score = null;
    match.winner = null;
    ensureSimulatedTournamentMatchReady(match);
  }
}

function tournamentCompletedSetScoresForMatch(match) {
  const scores = state.setMatch.completedScores.map((score) => [...score]);
  if (!match) return scores;
  if (SERVER_SYNC.friendlyMatch) return scores;
  const human = humanTournamentEntry();
  if (match.playerB === human) {
    return scores.map((score) => [score[1], score[0]]);
  }
  return scores;
}

function tournamentCompletedSetScore(match = null) {
  return formatSetScores(tournamentCompletedSetScoresForMatch(match));
}

function handleTournamentMatchComplete() {
  if (!state.tournament.active || !state.setMatch.matchOver) return;
  if (state.tournament.friendly) {
    handleFriendlyTournamentMatchComplete();
    return;
  }
  if (state.tournament.league) {
    handleLeagueTournamentMatchComplete();
    return;
  }
  if (state.tournament.weekly || state.tournament.bracket16) {
    handleWeeklyTournamentMatchComplete();
    return;
  }
  const match = tournamentMatchById(state.tournament.currentMatch);
  if (!match || match.winner) return;
  const winnerCharacterId = state.players[state.setMatch.matchWinner]?.characterId;
  match.winner = winnerCharacterId;
  match.score = tournamentCompletedSetScore(match);
  if (match.id === "qfHuman") {
    revealAllTournamentAiSets("quarter");
    refreshTournamentDerivedSlots();
    const qfAi1 = tournamentMatchById("qfAi1");
    const semiHuman = tournamentMatchById("semiHuman");
    if (winnerCharacterId === state.tournament.humanCharacterId) {
      state.tournament.stage = "readySemi";
      state.tournament.currentMatch = null;
      state.log.unshift(`Demi-finale débloquée contre ${characterNameFromId(semiHuman.playerB ?? qfAi1.hiddenWinner)}.`);
    } else {
      const semiHumanResult = simulateAiTournamentMatch(winnerCharacterId, semiHuman.playerB ?? qfAi1.hiddenWinner, state.tournament.targetSets ?? 2);
      semiHuman.winner = semiHumanResult.winner;
      semiHuman.score = semiHumanResult.score;
      completeTournamentWithoutHuman(semiHumanResult.winner);
    }
  } else if (match.id === "semiHuman") {
    revealAllTournamentAiSets("semi");
    const final = tournamentMatchById("final");
    const semiAi = tournamentMatchById("semiAi");
    state.tournament.aiFinalistCharacterId = semiAi.hiddenWinner;
    if (winnerCharacterId === state.tournament.humanCharacterId) {
      final.playerA = winnerCharacterId;
      final.playerB = state.tournament.aiFinalistCharacterId;
      state.tournament.stage = "readyFinal";
      state.tournament.currentMatch = null;
      state.log.unshift(`Finale débloquée contre ${characterNameFromId(state.tournament.aiFinalistCharacterId)}.`);
    } else {
      final.playerA = winnerCharacterId;
      final.playerB = state.tournament.aiFinalistCharacterId;
      const finalResult = simulateAiTournamentMatch(winnerCharacterId, state.tournament.aiFinalistCharacterId, state.tournament.targetSets ?? 2);
      final.winner = finalResult.winner;
      final.score = finalResult.score;
      state.tournament.stage = "complete";
      state.tournament.championCharacterId = finalResult.winner;
      state.tournament.currentMatch = null;
      state.log.unshift(`Tournoi terminé : ${characterNameFromId(finalResult.winner)} gagne la finale.`);
    }
  } else if (match.id === "final") {
    state.tournament.stage = "complete";
    state.tournament.championCharacterId = winnerCharacterId;
    state.tournament.currentMatch = null;
    state.log.unshift(`Tournoi gagné par ${characterNameFromId(winnerCharacterId)}.`);
  }
  recordWeeklyCompetitionResult();
}

function handleFriendlyTournamentMatchComplete() {
  const match = tournamentMatchById(state.tournament.currentMatch);
  if (!match || match.winner) return;
  const sharedHumanMatch = Boolean(SERVER_SYNC.friendlyMatch || match.humanVsHuman);
  const winnerEntry = sharedHumanMatch
    ? (state.setMatch.matchWinner === 0 ? match.playerA : match.playerB)
    : state.setMatch.matchWinner === 0
      ? FRIENDLY_TOURNAMENT.entry
      : (match.playerA === FRIENDLY_TOURNAMENT.entry ? match.playerB : match.playerA);
  match.winner = winnerEntry;
  match.revealedSetScores = tournamentCompletedSetScoresForMatch(match);
  match.score = formatSetScores(match.revealedSetScores);
  match.liveScore = null;
  window.clearInterval(FRIENDLY_TOURNAMENT.streamTimer);
  reportFriendlyTournamentResult(match);
  if (sharedHumanMatch) leaveOnlineRoom();
  FRIENDLY_TOURNAMENT.inMatch = false;
  FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = true;
  FRIENDLY_TOURNAMENT.currentMatchId = null;
  state.tournament.currentMatch = null;
  if (winnerEntry === FRIENDLY_TOURNAMENT.entry) {
    state.log.unshift("Match terminé. Retourne au CLUB HOUSE en attendant la fin du tour.");
  } else {
    state.log.unshift("Tu es éliminé du tournoi amical. Retourne au CLUB HOUSE pour suivre la suite.");
  }
  render();
}

function handleLeagueTournamentMatchComplete() {
  const match = tournamentMatchById(state.tournament.currentMatch);
  if (!match || match.winner) return;
  const winnerEntry = tournamentWinnerEntryFromMatchWinner(state.setMatch.matchWinner);
  match.winner = winnerEntry;
  match.revealedSetScores = tournamentCompletedSetScoresForMatch(match);
  match.score = formatSetScores(match.revealedSetScores);
  match.liveScore = null;
  if (state.tournament.weekly) addHumanMatchPerformanceBonus(match);
  if (match.day) {
    revealLeagueDay(match.day);
    refreshLeagueKnockoutSlots();
    const nextMatch = nextHumanTournamentMatch();
    if (nextMatch) {
      state.tournament.stage = "readyNext";
      state.tournament.currentMatch = null;
      state.tournament.nextHumanMatchId = nextMatch.id;
      state.log.unshift(`Prochain match LEAGUE : ${nicknameValue()} contre ${characterNameFromId(opponentCharacterInMatch(nextMatch, humanTournamentEntry()))}.`);
      render();
      return;
    }
    completeLeagueWithoutHuman();
    if (state.tournament.weekly && state.tournament.stage === "complete") recordWeeklyCompetitionResult();
    render();
    return;
  }
  if (match.round === "semi") {
    refreshLeagueKnockoutSlots();
    const nextMatch = nextHumanTournamentMatch();
    if (nextMatch) {
      state.tournament.stage = "readyNext";
      state.tournament.currentMatch = null;
      state.tournament.nextHumanMatchId = nextMatch.id;
      state.log.unshift(`Finale LEAGUE prête contre ${characterNameFromId(opponentCharacterInMatch(nextMatch, humanTournamentEntry()))}.`);
      render();
      return;
    }
    completeLeagueWithoutHuman();
    if (state.tournament.weekly && state.tournament.stage === "complete") recordWeeklyCompetitionResult();
    render();
    return;
  }
  if (match.round === "final") {
    state.tournament.stage = "complete";
    state.tournament.currentMatch = null;
    state.tournament.nextHumanMatchId = null;
    state.tournament.championCharacterId = winnerEntry;
    state.log.unshift(`LEAGUE gagnée par ${tournamentPlayerLabel(winnerEntry)}.`);
    if (state.tournament.weekly) recordWeeklyCompetitionResult();
    render();
  }
}

function handleWeeklyTournamentMatchComplete() {
  const match = tournamentMatchById(state.tournament.currentMatch);
  if (!match || match.winner) return;
  const winnerEntry = tournamentWinnerEntryFromMatchWinner(state.setMatch.matchWinner);
  match.winner = winnerEntry;
  match.revealedSetScores = tournamentCompletedSetScoresForMatch(match);
  match.score = formatSetScores(match.revealedSetScores);
  match.liveScore = null;
  addHumanMatchPerformanceBonus(match);
  refreshWeeklyTournamentDerivedSlots();
  revealAllTournamentAiSets(match.round);
  refreshWeeklyTournamentDerivedSlots();
  const human = humanTournamentEntry();
  if (winnerEntry !== human) {
    completeWeeklyTournamentAfterHumanLoss();
    recordWeeklyCompetitionResult();
    render();
    return;
  }
  const nextMatch = nextHumanTournamentMatch();
  if (!nextMatch) {
    state.tournament.stage = "complete";
    state.tournament.currentMatch = null;
    state.tournament.nextHumanMatchId = null;
    state.tournament.championCharacterId = human;
    recordWeeklyCompetitionResult();
    render();
    return;
  }
  state.tournament.stage = "readyNext";
  state.tournament.currentMatch = null;
  state.tournament.nextHumanMatchId = nextMatch.id;
  state.log.unshift(`Prochain match : ${nicknameValue()} contre ${characterNameFromId(opponentCharacterInMatch(nextMatch, human))}.`);
}

function completeWeeklyTournamentAfterHumanLoss() {
  for (const match of state.tournament.matches) {
    if (match.winner || !match.playerA || !match.playerB) continue;
    if (match.playable) continue;
    ensureSimulatedTournamentMatchReady(match);
    match.revealedSetScores = match.hiddenSetScores.map((score) => [...score]);
    match.score = formatSetScores(match.revealedSetScores);
    match.winner = match.hiddenWinner;
    refreshWeeklyTournamentDerivedSlots();
  }
  refreshWeeklyTournamentDerivedSlots();
  const final = tournamentMatchById("final");
  if (final?.playerA && final?.playerB && !final.winner) {
    const result = simulateAiTournamentMatch(final.playerA, final.playerB, state.tournament.targetSets ?? 2);
    final.winner = result.winner;
    final.score = result.score;
  }
  state.tournament.stage = "complete";
  state.tournament.currentMatch = null;
  state.tournament.nextHumanMatchId = null;
  state.tournament.championCharacterId = final?.winner || null;
}

function humanTournamentAchievement() {
  if (!state.tournament.active) return null;
  const human = humanTournamentEntry();
  const final = tournamentMatchById("final");
  if (state.tournament.championCharacterId === human) return "winner";
  if (state.tournament.league) {
    const finalLeague = tournamentMatchById("final");
    if (finalLeague?.score && (finalLeague.playerA === human || finalLeague.playerB === human)) return "finalist";
    const humanSemi = state.tournament.matches.find((match) => match.round === "semi" && match.score && (match.playerA === human || match.playerB === human));
    if (humanSemi) return "semi";
    if (leagueCompletedGroupDays() >= 3) {
      for (const group of ["A", "B"]) {
        const position = leagueStandings(group, 3).findIndex((row) => row.entry === human);
        if (position >= 0) return position === 2 ? "group3" : position === 3 ? "group4" : null;
      }
    }
    return null;
  }
  if (state.tournament.weekly) {
    const playedHumanMatches = state.tournament.matches.filter((match) => match.score && (match.playerA === human || match.playerB === human));
    const last = playedHumanMatches.at(-1);
    if (!last) return null;
    if (last.round === "final") return last.winner === human ? "winner" : "finalist";
    if (last.round === "semi") return "semi";
    if (last.round === "quarter") return "quarter";
    if (last.round === "round16" || last.round === "qualif") return "round16";
    return null;
  }
  const semiHuman = tournamentMatchById("semiHuman");
  const qfHuman = tournamentMatchById("qfHuman");
  if (final?.score && (final.playerA === human || final.playerB === human)) return "finalist";
  if (semiHuman?.score && (semiHuman.playerA === human || semiHuman.playerB === human)) return "semi";
  if (qfHuman?.score && (qfHuman.playerA === human || qfHuman.playerB === human)) return "quarter";
  return null;
}

function humanIndexInMatch(match) {
  if (!match) return null;
  const human = humanTournamentEntry();
  if (match.playerA === human) return 0;
  if (match.playerB === human) return 1;
  return null;
}

function humanMatchPerformanceBonus(match, setScores = tournamentCompletedSetScoresForMatch(match)) {
  const humanMatchIndex = humanIndexInMatch(match);
  if (humanMatchIndex == null) return { points: 0, details: [] };
  let points = 0;
  let wonSets = 0;
  let lostSets = 0;
  const details = [];
  for (const score of setScores || []) {
    const humanGames = score[humanMatchIndex] ?? 0;
    const opponentGames = score[opponentOf(humanMatchIndex)] ?? 0;
    if (humanGames > opponentGames) {
      wonSets += 1;
      points += 5;
      const gap = humanGames - opponentGames;
      points += gap;
      details.push(`Set gagné ${humanGames}/${opponentGames}: +${5 + gap}`);
    } else {
      lostSets += 1;
    }
  }
  if (match.winner === humanTournamentEntry() && lostSets === 0 && wonSets > 0) {
    points += 5;
    details.push("Victoire sans perdre de set: +5");
  }
  return { points, details };
}

function addHumanMatchPerformanceBonus(match) {
  if (!state.tournament.weekly || !match || match.performanceBonusRecorded) return;
  const bonus = humanMatchPerformanceBonus(match);
  const matchWinPoints = match.winner === humanTournamentEntry()
    ? Number(state.tournament.competitionPoints?.matchWin || 0)
    : 0;
  match.performanceBonusRecorded = true;
  match.performanceBonusPoints = bonus.points + matchWinPoints;
  match.performanceBonusDetails = bonus.details;
  state.tournament.matchBonusPoints = (state.tournament.matchBonusPoints || 0) + bonus.points + matchWinPoints;
  const details = [...bonus.details, ...(matchWinPoints ? [`Match gagné: +${matchWinPoints}`] : [])];
  state.tournament.matchBonusDetails = [...(state.tournament.matchBonusDetails || []), ...details.map((detail) => `${match.label}: ${detail}`)];
  if (bonus.points + matchWinPoints) {
    state.log.unshift(`${match.label}: bonus performance +${bonus.points + matchWinPoints} points.`);
  }
}

function humanTournamentPoints() {
  const achievement = humanTournamentAchievement();
  if (!achievement) return { achievement: null, points: 0 };
  const pointsTable = state.tournament.competitionPoints || {};
  const qualificationPoints = Number(pointsTable[achievement] || 0);
  const bonusPoints = Number(state.tournament.matchBonusPoints || 0);
  return {
    achievement,
    qualificationPoints,
    bonusPoints,
    points: qualificationPoints + bonusPoints,
  };
}

function humanTournamentAiResults() {
  if (!state.tournament.weekly) return [];
  const human = humanTournamentEntry();
  return state.tournament.matches
    .filter((match) => match.score && match.winner && (match.playerA === human || match.playerB === human))
    .map((match) => {
      const aiCharacterId = tournamentEntryCharacterId(match.playerA === human ? match.playerB : match.playerA);
      return {
        aiCharacterId,
        result: match.winner === human ? "win" : "loss",
      };
    })
    .filter((item) => item.aiCharacterId);
}

function humanTournamentLastMatchSummary() {
  const human = humanTournamentEntry();
  const matches = (state.tournament.matches || []).filter((match) => match.score && (match.playerA === human || match.playerB === human));
  const match = matches.at(-1);
  if (!match) return { lastOpponent: "", lastScore: "" };
  const opponentEntry = match.playerA === human ? match.playerB : match.playerA;
  const lastOpponent = tournamentPlayerLabel(opponentEntry);
  const lastScore = Array.isArray(match.score)
    ? match.score.map((score) => Array.isArray(score) ? score.join("/") : String(score)).join(" - ")
    : String(match.score || "");
  return { lastOpponent, lastScore };
}

async function recordWeeklyCompetitionResult() {
  if (!state.tournament.weekly || state.tournament.pointsRecorded || !state.tournament.competitionId) return;
  const { achievement, points, qualificationPoints, bonusPoints } = humanTournamentPoints();
  if (!achievement) return;
  state.tournament.pointsRecorded = true;
  const lastMatch = humanTournamentLastMatchSummary();
  state.log.unshift(`${state.tournament.competitionName} : résultat ${achievement}, ${qualificationPoints} points de parcours + ${bonusPoints} points bonus = ${points} points pour demain.`);
  try {
    await authRequest(`/api/competitions/${encodeURIComponent(state.tournament.competitionId)}/score`, {
      points,
      achievement,
      roundReached: achievement,
      lastOpponent: lastMatch.lastOpponent,
      lastScore: lastMatch.lastScore,
      aiResults: humanTournamentAiResults(),
    });
    await deleteTournamentProgress();
    await loadCompetitions();
    await loadRanking();
    render();
  } catch (error) {
    state.log.unshift(`Score hebdomadaire non enregistré : ${error.message}`);
    render();
  }
}

function startTournamentSemi() {
  if ((state.tournament.weekly || state.tournament.bracket16 || state.tournament.league) && state.tournament.stage === "readyNext") {
    startWeeklyNextMatch();
    return;
  }
  if (!state.tournament.active || state.tournament.stage !== "readySemi") return;
  const semi = tournamentMatchById("semiHuman");
  state.tournament.stage = "semi";
  state.tournament.currentMatch = "semiHuman";
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.characterId = semi.playerB;
  startMatchMode(state.tournament.targetSets ?? 2, { keepSoloOpponent: true });
  state.tournament.stage = "semi";
  state.tournament.currentMatch = "semiHuman";
  state.log.unshift(`Demi-finale du tournoi : ${selectedPlayerName()} contre ${characterNameFromId(SOLO_AI.characterId)}.`);
  render();
}

function startTournamentFinal() {
  if ((state.tournament.weekly || state.tournament.bracket16 || state.tournament.league) && state.tournament.stage === "readyNext") {
    startWeeklyNextMatch();
    return;
  }
  if (!state.tournament.active || state.tournament.stage !== "readyFinal") return;
  const final = tournamentMatchById("final");
  final.playerA = humanTournamentEntry();
  final.playerB = state.tournament.aiFinalistCharacterId;
  state.tournament.stage = "final";
  state.tournament.currentMatch = "final";
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.characterId = state.tournament.aiFinalistCharacterId;
  startMatchMode(state.tournament.targetSets ?? 2, { keepSoloOpponent: true });
  state.tournament.stage = "final";
  state.tournament.currentMatch = "final";
  state.log.unshift(`Finale du tournoi : ${selectedPlayerName()} contre ${characterNameFromId(SOLO_AI.characterId)}.`);
  render();
}

function startWeeklyNextMatch() {
  if (!state.tournament.active || (!state.tournament.weekly && !state.tournament.bracket16 && !state.tournament.league) || state.tournament.stage !== "readyNext") return;
  const match = tournamentMatchById(state.tournament.nextHumanMatchId);
  if (!match) return;
  state.tournament.stage = match.round;
  state.tournament.currentMatch = match.id;
  state.tournament.nextHumanMatchId = null;
  SOLO_AI.enabled = true;
  SOLO_AI.playerIndex = 1;
  SOLO_AI.characterId = opponentCharacterInMatch(match, humanTournamentEntry());
  startMatchMode(state.tournament.targetSets ?? 2, { keepSoloOpponent: true });
  state.tournament.stage = match.round;
  state.tournament.currentMatch = match.id;
  state.log.unshift(`${match.label} : ${selectedPlayerName()} contre ${characterNameFromId(SOLO_AI.characterId)}.`);
  render();
}

function updateTournamentSetProgress() {
  if (!state.tournament.active || !state.setMatch.setOver || !state.tournament.currentMatch) return;
  const current = tournamentMatchById(state.tournament.currentMatch);
  if (current && !current.score) {
    current.liveScore = tournamentCompletedSetScore(current);
  }
  if (state.tournament.league) refreshLeagueKnockoutSlots();
  else if (state.tournament.weekly) refreshWeeklyTournamentDerivedSlots();
  else refreshTournamentDerivedSlots();
  revealNextTournamentAiSet();
  if (state.tournament.league) refreshLeagueKnockoutSlots();
  else if (state.tournament.weekly) refreshWeeklyTournamentDerivedSlots();
  else refreshTournamentDerivedSlots();
}

function revealNextTournamentAiSet() {
  const round = ["round16", "qualif", "quarter", "semi"].includes(state.tournament.stage) ? state.tournament.stage : null;
  if (!round) return;
  for (const match of simulatedTournamentMatches(round)) {
    if (!ensureSimulatedTournamentMatchReady(match)) continue;
    if ((match.revealedSetScores ?? []).length >= match.hiddenSetScores.length) continue;
    match.revealedSetScores = match.revealedSetScores ?? [];
    match.revealedSetScores.push(match.hiddenSetScores[match.revealedSetScores.length]);
    match.score = formatSetScores(match.revealedSetScores);
    if (match.revealedSetScores.length >= match.hiddenSetScores.length) {
      match.winner = match.hiddenWinner;
    }
  }
  refreshTournamentDerivedSlots();
}

function revealAllTournamentAiSets(round = null) {
  for (const match of simulatedTournamentMatches(round)) {
    if (!ensureSimulatedTournamentMatchReady(match)) continue;
    if (!match.hiddenSetScores?.length) continue;
    match.revealedSetScores = match.hiddenSetScores.map((score) => [...score]);
    match.score = formatSetScores(match.revealedSetScores);
    match.winner = match.hiddenWinner;
  }
  refreshTournamentDerivedSlots();
}

function simulatedTournamentMatches(round = null) {
  return state.tournament.matches.filter((match) => match.simulated && (!round || match.round === round));
}

function ensureSimulatedTournamentMatchReady(match) {
  if (!match?.simulated) return false;
  if (match.hiddenSetScores?.length && match.hiddenWinner) return true;
  if (!match.playerA || !match.playerB) return false;
  const result = simulateAiTournamentMatch(match.playerA, match.playerB, state.tournament.targetSets ?? 2);
  match.hiddenWinner = result.winner;
  match.hiddenSetScores = result.setScores;
  match.revealedSetScores = [];
  match.score = null;
  match.winner = null;
  return true;
}

function completeTournamentWithoutHuman(semiHumanWinner) {
  revealAllTournamentAiSets("semi");
  const semiAi = tournamentMatchById("semiAi");
  const final = tournamentMatchById("final");
  final.playerA = semiHumanWinner;
  final.playerB = semiAi.hiddenWinner;
  const finalResult = simulateAiTournamentMatch(semiHumanWinner, semiAi.hiddenWinner, state.tournament.targetSets ?? 2);
  final.winner = finalResult.winner;
  final.score = finalResult.score;
  state.tournament.aiFinalistCharacterId = semiAi.hiddenWinner;
  state.tournament.stage = "complete";
  state.tournament.championCharacterId = finalResult.winner;
  state.tournament.currentMatch = null;
  state.log.unshift(`Tournoi terminé : ${characterNameFromId(finalResult.winner)} gagne la finale.`);
  recordWeeklyCompetitionResult();
}

function refreshWeeklyTournamentDerivedSlots() {
  if (!state.tournament.active || (!state.tournament.weekly && !state.tournament.bracket16)) return;
  const r16_1 = tournamentMatchById("r16_1");
  const r16_2 = tournamentMatchById("r16_2");
  const r16_3 = tournamentMatchById("r16_3");
  const r16_4 = tournamentMatchById("r16_4");
  const r16_5 = tournamentMatchById("r16_5");
  const r16_6 = tournamentMatchById("r16_6");
  const r16_7 = tournamentMatchById("r16_7");
  const r16_8 = tournamentMatchById("r16_8");
  const qf1 = tournamentMatchById("qf1");
  const qf2 = tournamentMatchById("qf2");
  const qf3 = tournamentMatchById("qf3");
  const qf4 = tournamentMatchById("qf4");
  const semi1 = tournamentMatchById("semi1");
  const semi2 = tournamentMatchById("semi2");
  const final = tournamentMatchById("final");
  if (qf1 && (r16_1?.winner || r16_2?.winner)) setMatchPlayers(qf1, r16_1?.winner || null, r16_2?.winner || null);
  if (qf2 && (r16_3?.winner || r16_4?.winner)) setMatchPlayers(qf2, r16_3?.winner || null, r16_4?.winner || null);
  if (qf3 && (r16_5?.winner || r16_6?.winner)) setMatchPlayers(qf3, r16_5?.winner || null, r16_6?.winner || null);
  if (qf4 && (r16_7?.winner || r16_8?.winner)) setMatchPlayers(qf4, r16_7?.winner || null, r16_8?.winner || null);
  if (semi1 && (qf1?.winner || qf2?.winner)) setMatchPlayers(semi1, qf1?.winner || null, qf2?.winner || null);
  if (semi2 && (qf3?.winner || qf4?.winner)) setMatchPlayers(semi2, qf3?.winner || null, qf4?.winner || null);
  if (final && (semi1?.winner || semi2?.winner)) setMatchPlayers(final, semi1?.winner || null, semi2?.winner || null);
}

function refreshTournamentDerivedSlots() {
  if (!state.tournament.active) return;
  if (state.tournament.weekly || state.tournament.bracket16) {
    refreshWeeklyTournamentDerivedSlots();
    return;
  }
  const qfHuman = tournamentMatchById("qfHuman");
  const qfAi1 = tournamentMatchById("qfAi1");
  const qfAi2 = tournamentMatchById("qfAi2");
  const qfAi3 = tournamentMatchById("qfAi3");
  const semiHuman = tournamentMatchById("semiHuman");
  const semiAi = tournamentMatchById("semiAi");
  const final = tournamentMatchById("final");

  if (semiHuman) {
    setMatchPlayers(semiHuman, qfHuman?.winner || null, qfAi1?.winner || null);
  }
  if (semiAi) {
    const hasQualifier = Boolean(qfAi2?.winner || qfAi3?.winner);
    setMatchPlayers(semiAi, qfAi2?.winner || null, qfAi3?.winner || null);
    if (!hasQualifier) {
      semiAi.hiddenWinner = null;
      semiAi.hiddenSetScores = null;
      semiAi.revealedSetScores = [];
      semiAi.score = null;
      semiAi.winner = null;
    }
  }
  if (final) {
    setMatchPlayers(final, semiHuman?.winner || null, semiAi?.winner || null);
  }
}

function aiStyleLabel() {
  return {
    amateur: "amateur",
    normal: "normal",
    expert: "expert",
    champion: "champion",
    legend: "légende",
  }[normalizeAiIntelligence(SOLO_AI.style)];
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
  const momentum = cloneData(state.setMatch.momentum || emptyMomentumState());
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
    momentum,
  };
  const server = Math.random() < 0.5 ? 0 : 1;
  newGame({ preserveSet: true, serverOverride: server });
  state.log.unshift("Nouveau set lancé.");
  markServerDirtyForHostAction();
  render();
}

function canAdminSimulateMatchScore() {
  return canAccessAdminFeatures()
    && !SPECTATOR_MODE.enabled
    && state.setMatch?.enabled
    && Number(state.setMatch.targetSets || 0) > 0
    && !state.setMatch.matchOver
    && (!SERVER_SYNC.enabled || SERVER_SYNC.isHost);
}

function adminSimulatedSetScores(winnerIndex, targetSets) {
  return randomMatchSetScoresForWinner(winnerIndex, targetSets);
}

function simulateAdminMatchScore() {
  if (!canAdminSimulateMatchScore()) return;
  const winner = SERVER_SYNC.enabled && [0, 1].includes(Number(SERVER_SYNC.seat))
    ? Number(SERVER_SYNC.seat)
    : 0;
  const targetSets = Math.max(1, Number(state.setMatch.targetSets || 1));
  const completedScores = adminSimulatedSetScores(winner, targetSets);
  const finalScore = [...completedScores.at(-1)];
  const setsWon = winner === 0 ? [targetSets, 0] : [0, targetSets];
  const previousScore = [...state.setMatch.score];
  const reason = `Score simulé par l'ADMIN : ${displayPlayerName(state.players[winner])} remporte le match.`;

  stopSoloTimers();
  state.gameOver = true;
  state.activePlayer = winner;
  state.setMatch.score = finalScore;
  state.setMatch.completedScores = completedScores.map((score) => [...score]);
  state.setMatch.decisiveExchange = false;
  state.setMatch.setOver = true;
  state.setMatch.winner = winner;
  state.setMatch.setsWon = setsWon;
  state.setMatch.matchOver = true;
  state.setMatch.matchWinner = winner;
  state.resultInfo = {
    winner,
    ignoreScore: true,
    winType: "admin-simulation",
    reason,
    scoreText: `Score simulé : ${playerName(0)} ${setsWon[0]} - ${setsWon[1]} ${playerName(1)} · ${formatSetScores(completedScores)}.`,
    setScore: null,
    endBonusDetails: [],
    setMatch: {
      previousScore,
      score: [...finalScore],
      completedScores: completedScores.map((score) => [...score]),
      setOver: true,
      winner,
      decisiveExchange: false,
      targetSets,
      setsWon: [...setsWon],
      matchOver: true,
      matchWinner: winner,
    },
  };
  state.log.unshift(`${reason} ${formatSetScores(completedScores)}.`);

  for (let index = 0; index < completedScores.length; index += 1) {
    updateTournamentSetProgress();
  }
  recordAction("exchange_end", {
    winner,
    winnerName: playerName(winner),
    winType: "admin-simulation",
    ignoreScore: true,
    adminSimulation: true,
    reason,
    finalPower: state.players.map((player) => player.power),
    finalEndurance: state.players.map((player) => player.endurance),
    exchangeSetScore: null,
    setMatch: {
      score: [...finalScore],
      completedScores: completedScores.map((score) => [...score]),
      setOver: true,
      winner,
      targetSets,
      setsWon: [...setsWon],
      matchOver: true,
      matchWinner: winner,
    },
    players: state.players.map(playerLogInfo),
  });
  storeMatchLog(winner, reason);
  handleTournamentMatchComplete();
  markServerDirtyForHostAction();
  render();
}

function storeMatchLog(winner, reason) {
  if (!["admin", "pro_plus"].includes(currentUserRole())) return;
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
        name: displayPlayerName(player),
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

function renderCompactMatchScore(setMatch) {
  if (!setMatch) return "";
  const scores = Array.isArray(setMatch.completedScores)
    ? setMatch.completedScores.map((score) => [Number(score?.[0] || 0), Number(score?.[1] || 0)])
    : [];
  if (!setMatch.setOver && Array.isArray(setMatch.score)) {
    scores.push([Number(setMatch.score[0] || 0), Number(setMatch.score[1] || 0)]);
  } else if (!scores.length && Array.isArray(setMatch.score)) {
    scores.push([Number(setMatch.score[0] || 0), Number(setMatch.score[1] || 0)]);
  }
  if (!scores.length) return "";
  return `
    <div class="result-match-score" aria-label="Score du match">
      <div class="result-match-confrontation">
        <strong>${escapeHtml(playerName(0))}</strong>
        <span>contre</span>
        <strong>${escapeHtml(playerName(1))}</strong>
      </div>
      <div class="result-match-score-values">
        ${scores.map((score, index) => {
          const isCurrent = !setMatch.setOver && index === scores.length - 1;
          const winnerClass = isCurrent ? "current" : score[0] > score[1] ? "won-left" : "won-right";
          return `<strong class="${winnerClass}">${score[0]}–${score[1]}</strong>`;
        }).join('<i aria-hidden="true">·</i>')}
      </div>
    </div>
  `;
}

function renderResultPanel() {
  // La fin d'échange est désormais entièrement intégrée à la carte
  // « État de l'échange » afin de ne plus superposer deux résumés.
  els.resultPanel.innerHTML = "";
  els.resultPanel.classList.add("hidden");
}

function applyEndBonuses() {
  const details = [];
  for (const player of state.players) {
    for (const bonus of player.endBonuses) {
      if (bonus.type === "doubleLastShot") {
        const target = [...player.played].reverse().find((card) => !card.removed && isShot(card));
        if (target) {
          const doubledPower = target.cardPowerGained ?? target.powerGained;
          player.power += doubledPower;
          details.push({ playerIndex: state.players.indexOf(player), label: `Double ${target.name}`, points: doubledPower });
          state.log.unshift(`${displayPlayerName(player)} double ${target.name} : +${doubledPower} puissance.`);
        }
      }
      if (bonus.type === "boostedBonus") {
        const count = player.played.filter((card) => card.boosted && !card.removed).length;
        const gained = count * bonus.value;
        player.power += gained;
        if (gained) details.push({ playerIndex: state.players.indexOf(player), label: `Bonus cartes boostées (${count})`, points: gained });
        state.log.unshift(`${displayPlayerName(player)} gagne +${gained} puissance pour ses cartes boostées.`);
      }
    }
  }
  return details;
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
  renderGameContextStrip();
  renderSpectatorBanner();
  renderResultPanel();
  renderTournamentPanel();
  renderTutorialOverlay();
  renderRallyState();
  renderEffectNotice();
  renderPlayerPanel(0, els.player1Panel);
  renderPlayerPanel(1, els.player2Panel);
  renderOpponentHandRevealControls();
  renderCenterPlayedCard();
  renderLog();
  renderServerSyncPanel();
  renderBoostModal();
  renderEffectChoiceModal();
  renderCoachChoiceModal();
  renderRemoveChoiceModal();
  renderWaitingRoomModal();
  attachImageZoomHandlers(els.gameApp || document);
  window.requestAnimationFrame(() => adjustCardMagnificationOrigins(els.gameApp || document));
  applySpectatorControls();
  if (!SPECTATOR_MODE.enabled) {
    scheduleServerSync();
    scheduleSoloAINudge();
    maybeRunSoloAI();
  }
  window.dispatchEvent(new CustomEvent("tennis-light:match-render"));
}

function adjustCardMagnificationOrigins(root = document) {
  const viewportWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  root.querySelectorAll(".card.has-visual, .character-card, .played-visual").forEach((card) => {
    const bounds = card.getBoundingClientRect();
    const center = bounds.left + (bounds.width / 2);
    card.style.transformOrigin = center < viewportWidth * 0.28
      ? "left center"
      : center > viewportWidth * 0.72
        ? "right center"
        : "center center";
  });
}

function renderSpectatorBanner() {
  let banner = document.querySelector("#spectatorLiveBanner");
  if (!SPECTATOR_MODE.enabled) {
    banner?.remove();
    return;
  }
  if (!banner) {
    banner = document.createElement("section");
    banner.id = "spectatorLiveBanner";
    banner.className = "spectator-live-banner";
    els.tournamentPanel?.before(banner);
  }
  banner.innerHTML = `
    <strong>MODE VISIONNEUSE</strong>
    <span>${escapeHtml(SPECTATOR_MODE.matchLabel || "Match en cours")} · ${escapeHtml(SPECTATOR_MODE.liveScore || "Score en direct")}</span>
    <span>Mains masquées · aucune action possible</span>
  `;
}

function applySpectatorControls() {
  document.body.classList.toggle("spectator-mode", SPECTATOR_MODE.enabled);
  if (!SPECTATOR_MODE.enabled || !els.gameApp) return;
  els.gameApp.querySelectorAll("button").forEach((button) => {
    const isReadOnlyCardPreview = button.matches("[data-image-zoom]");
    button.disabled = button !== els.spectatorQuitButton && !isReadOnlyCardPreview;
  });
}

function renderTutorialOverlay() {
  if (!els.tutorialOverlay) return;
  const step = tutorialStep();
  if (!state.tutorial.active || !step) {
    clearTutorialTyping();
    document.body.classList.remove("tutorial-running", "tutorial-awaiting-action", "tutorial-showcase-active", "tutorial-auto-pending", "tutorial-readonly", "tutorial-interface-tour");
    els.tutorialOverlay.classList.add("hidden");
    els.tutorialOverlay.innerHTML = "";
    return;
  }
  const module = tutorialModule();
  const action = step.action ?? null;
  const narrator = TUTORIAL_NARRATORS[step.narrator ?? module.narrator] ?? TUTORIAL_NARRATORS.coachJu;
  const progress = step.displayStep ? ` · Étape ${step.displayStep}/${module.totalDisplaySteps}${step.part ? ` · ${step.part}` : ""}` : "";
  const autoPending = state.tutorial.pendingAutoStepId === step.id;
  document.body.classList.add("tutorial-running");
  document.body.classList.toggle("tutorial-readonly", Boolean(module.readOnly));
  document.body.classList.toggle("tutorial-interface-tour", module.scenario === "interface");
  document.body.classList.toggle("tutorial-awaiting-action", Boolean(action));
  document.body.classList.toggle("tutorial-showcase-active", Boolean(step.showcase));
  document.body.classList.toggle("tutorial-auto-pending", autoPending);
  els.tutorialOverlay.classList.remove("hidden");
  els.tutorialOverlay.innerHTML = `
    ${renderTutorialShowcase(step.showcase)}
    <aside class="tutorial-dialogue ${action ? "tutorial-dialogue-action" : ""}" aria-label="Tutoriel">
      <div class="tutorial-portrait">
        <img src="${narrator.image}" alt="Portrait de ${narrator.name}" />
      </div>
      <div class="tutorial-dialogue-content">
        <p class="tutorial-kicker">${module.lesson}${progress}</p>
        <div class="tutorial-speaker-line"><strong>${narrator.name}</strong><span>${narrator.role}</span></div>
        <h2>${step.title}</h2>
        <p class="tutorial-copy" aria-label="${escapeHtml(tutorialPlainText(step.text))}"><span data-tutorial-typed-text></span><span class="tutorial-typewriter-caret" aria-hidden="true"></span></p>
        ${step.summary?.length ? `<ul class="tutorial-summary">${step.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        ${state.tutorial.error ? `<p class="tutorial-error" role="alert">${escapeHtml(state.tutorial.error)}</p>` : ""}
        ${action ? `<p class="tutorial-action">${tutorialActionLabel(action)}</p>` : ""}
        ${autoPending ? '<p class="tutorial-wait" role="status"><span aria-hidden="true"></span>Coach Ju prépare sa réponse...</p>' : ""}
        ${!action && !autoPending ? `<button class="primary-button tutorial-next-button" type="button" data-tutorial-next>Afficher tout</button>` : ""}
      </div>
    </aside>
  `;
  els.tutorialOverlay.querySelector("[data-tutorial-next]")?.addEventListener("click", () => {
    if (tutorialTypingProgress < tutorialTypingText.length) {
      revealTutorialText();
      return;
    }
    if (step.final) {
      finishTutorial();
    } else {
      advanceTutorial();
    }
  });
  startTutorialTyping(step);
  const hasVisualTarget = Boolean(step.action || step.focus?.length || step.showcase);
  if (hasVisualTarget && state.tutorial.scrolledStepId !== step.id) {
    state.tutorial.scrolledStepId = step.id;
    window.queueMicrotask(() => {
      const target = document.querySelector(".tutorial-focus-target");
      const dialogue = document.querySelector(".tutorial-dialogue");
      if (!target || !dialogue) return;
      const targetRect = target.getBoundingClientRect();
      const dialogueRect = dialogue.getBoundingClientRect();
      const targetDocumentTop = window.scrollY + targetRect.top;
      const nextScrollTop = Math.max(0, targetDocumentTop - ((Math.max(160, dialogueRect.top) - targetRect.height) / 2));
      window.scrollTo({ top: nextScrollTop, behavior: "auto" });
    });
  }
}

function renderTutorialShowcase(showcase) {
  if (!showcase) return "";
  const card = CARD_LIBRARY.find((item) => item.id === showcase.cardId);
  const imageUrl = card ? CARD_IMAGES[card.id] : null;
  if (!card || !imageUrl) return "";
  const allowedTargets = new Set(["cost", "power", "precision", "placement", "effect", "boost"]);
  const pointers = showcase.pointer ? [{ target: showcase.pointer, label: showcase.label }] : [];
  return `
    <div class="tutorial-card-showcase${pointers.length ? "" : " tutorial-focus-target"}" aria-label="Carte ${escapeHtml(card.name)} agrandie">
      <img src="${imageUrl}" alt="${escapeHtml(card.name)} - ${escapeHtml(card.subtitle ?? card.family)}" />
      ${pointers.map((pointer) => {
        const target = allowedTargets.has(pointer?.target) ? pointer.target : "cost";
        return `<span class="tutorial-showcase-pointer tutorial-focus-target ${target}">${escapeHtml(pointer?.label ?? "Regarde ici")}</span>`;
      }).join("")}
    </div>
  `;
}

function tutorialActionLabel(action) {
  if (action.kind === "selectCard") {
    const card = CARD_LIBRARY.find((item) => item.id === action.cardId);
    return `Sélectionne ${card?.name ?? "la carte indiquée"}.`;
  }
  if (action.kind === "endTurn") return "clique sur Terminer le tour";
  const card = CARD_LIBRARY.find((item) => item.id === action.cardId);
  const cardName = card?.name ?? "la carte indiquée";
  if (action.mode === "placement") return `joue ${cardName} en Remise`;
  if (action.mode === "effect") return `joue ${cardName} en Effet`;
  if (action.mode === "boost") return `joue ${cardName} en Boost`;
  return `Clique sur Jouer pour utiliser ${cardName}.`;
}

function ensureSoloAIForSet() {
  if (SPECTATOR_MODE.enabled || SERVER_SYNC.enabled || state.gameOver || !state.setMatch.enabled) return;
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
  if (els.returnLobbyButton) els.returnLobbyButton.textContent = FRIENDLY_TOURNAMENT.enabled ? "Retour Club House" : "Retour accueil";
  if (els.topProgressionActions) {
    els.topProgressionActions.innerHTML = renderRallyEndActions();
    els.topProgressionActions.classList.toggle("hidden", !els.topProgressionActions.innerHTML.trim());
    bindRallyEndActions(els.topProgressionActions);
  }
  const completedFriendlyMatch = Boolean(FRIENDLY_TOURNAMENT.enabled && state.gameOver && state.setMatch?.matchOver);
  els.returnLobbyButton?.classList.toggle("friendly-match-complete-return", completedFriendlyMatch);
  if (els.gameAssistButton) els.gameAssistButton.setAttribute("aria-expanded", String(GAMEPLAY_ASSIST.panelOpen));
  els.gameAssistPanel?.classList.toggle("hidden", !GAMEPLAY_ASSIST.panelOpen);
  if (els.gamePreviewToggle) els.gamePreviewToggle.checked = GAMEPLAY_ASSIST.preview;
  if (els.gameInformationToggle) els.gameInformationToggle.checked = GAMEPLAY_ASSIST.information;
  const isAdminPlayer = canAccessAdminFeatures() && !SPECTATOR_MODE.enabled;
  els.adminGameTools?.classList.toggle("hidden", !isAdminPlayer);
  if (els.adminGameToolsButton) els.adminGameToolsButton.disabled = !isAdminPlayer;
  if (!isAdminPlayer) setAdminGameToolsOpen(false);
  if (els.adminSimulateScoreButton) {
    els.adminSimulateScoreButton.disabled = !canAdminSimulateMatchScore();
    els.adminSimulateScoreButton.title = SERVER_SYNC.enabled && !SERVER_SYNC.isHost
      ? "Seul l'ADMIN hôte peut simuler le score"
      : "Terminer ce match avec un score simulé";
  }
  els.spectatorQuitButton?.classList.toggle("hidden", !SPECTATOR_MODE.enabled);
  els.returnLobbyButton?.classList.toggle("hidden", SPECTATOR_MODE.enabled);
  if (els.revealAiButton) {
    const canReveal = isAdminPlayer && SOLO_AI.enabled && state.gameOver;
    els.revealAiButton.classList.toggle("hidden", !canReveal);
    els.revealAiButton.classList.toggle("active", state.revealAiCards);
    els.revealAiButton.textContent = state.revealAiCards ? "Main révélée" : "Révéler la main";
  }
  els.exportLogsButton?.classList.toggle("hidden", !isAdminPlayer);
  els.exportHumanMatchesButton?.classList.toggle("hidden", !isAdminPlayer);
}

function setGameAssistPanelOpen(open) {
  GAMEPLAY_ASSIST.panelOpen = Boolean(open);
  els.gameAssistPanel?.classList.toggle("hidden", !GAMEPLAY_ASSIST.panelOpen);
  els.gameAssistButton?.setAttribute("aria-expanded", String(GAMEPLAY_ASSIST.panelOpen));
}

function currentMatchScoreText() {
  if (!state.setMatch?.enabled) return "Échange libre";
  const completed = Array.isArray(state.setMatch.completedScores) ? state.setMatch.completedScores : [];
  const scores = completed.map((score) => `${Number(score?.[0] || 0)}–${Number(score?.[1] || 0)}`);
  if (!state.setMatch.setOver && Array.isArray(state.setMatch.score)) scores.push(`${Number(state.setMatch.score[0] || 0)}–${Number(state.setMatch.score[1] || 0)}`);
  return scores.length ? scores.join(" · ") : "0–0";
}

function leagueHumanStandingReminder() {
  if (!state.tournament?.league) return "";
  const human = humanTournamentEntry();
  for (const group of ["A", "B"]) {
    const rows = leagueStandings(group, leagueCompletedGroupDays());
    const index = rows.findIndex((row) => row.entry === human);
    if (index >= 0) return `Groupe ${group} · ${index + 1}e · ${rows[index].points} pts · sets ${formatLeagueDifference(rows[index].setDifference)}`;
  }
  return "";
}

function renderGameContextStrip() {
  if (!els.gameContextStrip || !state.players?.length) return;
  const format = state.tournament?.active
    ? `${state.tournament.competitionName || "Compétition"}${humanTournamentRoundLabel() ? ` · ${humanTournamentRoundLabel()}` : ""}`
    : state.setMatch?.enabled
      ? `${Number(state.setMatch.targetSets || 1)} set${Number(state.setMatch.targetSets || 1) > 1 ? "s" : ""} gagnant${Number(state.setMatch.targetSets || 1) > 1 ? "s" : ""}`
      : "Échange libre";
  const difficulty = SOLO_AI.enabled
    ? state.tournament?.active
      ? `IA ${tournamentDifficultyLabel(state.tournament.difficulty || "normal")}`
      : `IA ${aiStyleLabel()}`
    : SERVER_SYNC.enabled ? "En ligne" : "Local";
  const encounteredAiLevel = SOLO_AI.enabled
    ? aiIntelligenceForEntry(SOLO_AI.characterId, state.tournament?.difficulty || SOLO_AI.difficulty)
    : null;
  const encounteredAiLabel = encounteredAiLevel
    ? ({ amateur: "Amateur", normal: "Normal", expert: "Expert", champion: "Champion", legend: "Légende" }[encounteredAiLevel] || "Normal")
    : null;
  const standing = leagueHumanStandingReminder();
  els.gameContextStrip.innerHTML = `
    <div><span>Format</span><strong>${escapeHtml(format)}</strong></div>
    ${standing ? `<div><span>Classement</span><strong>${escapeHtml(standing)}</strong></div>` : ""}
    <div><span>Réglage</span><strong>${escapeHtml(difficulty)}</strong></div>
    ${encounteredAiLabel ? `<div class="game-context-ai-level"><span>Niveau de l’IA</span><strong>${escapeHtml(encounteredAiLabel)}</strong></div>` : ""}
    <div class="game-context-score"><span>Score</span><strong>${escapeHtml(currentMatchScoreText())}</strong></div>
  `;
}

function setAdminGameToolsOpen(open) {
  const shouldOpen = Boolean(open && canAccessAdminFeatures() && !SPECTATOR_MODE.enabled);
  els.adminGameToolsPanel?.classList.toggle("hidden", !shouldOpen);
  els.adminGameToolsButton?.setAttribute("aria-expanded", String(shouldOpen));
}

function runAdminGameTool(action) {
  if (!canAccessAdminFeatures() || SPECTATOR_MODE.enabled) return;
  setAdminGameToolsOpen(false);
  action();
}

function currentModeLabel() {
  if (SPECTATOR_MODE.enabled) return `MODE VISIONNEUSE · ${SPECTATOR_MODE.matchLabel || "match en cours"}`;
  if (SERVER_SYNC.enabled) {
    const format = SERVER_SYNC.targetSets === 3 ? "Match 3 sets" : "Match 2 sets";
    return `Mode en ligne · ${format}`;
  }
  if (state.tournament.active) {
    const title = state.tournament.competitionName || (state.tournament.targetSets === 3 ? "Slam 3 sets" : "Tournoi 2 sets");
    const surface = state.tournament.competitionSurfaceLabel ? ` · ${state.tournament.competitionSurfaceLabel}` : "";
    const aiLevel = state.tournament.aiClubHouse ? ` · IA ${tournamentDifficultyLabel(state.tournament.difficulty)}` : "";
    return `${title}${surface}${aiLevel} · ${tournamentStageLabel()}`;
  }
  if (state.setMatch.enabled && state.setMatch.targetSets) return `Contre l'IA · Match ${state.setMatch.targetSets} sets · IA ${aiStyleLabel()}`;
  if (state.setMatch.enabled) return `Contre l'IA · Set · IA ${aiStyleLabel()}`;
  if (SOLO_AI.enabled) return `Contre l'IA · Échange · IA ${aiStyleLabel()}`;
  return "Mode local";
}

function profileActivityType() {
  if (state.tournament?.friendly || FRIENDLY_TOURNAMENT.enabled || SERVER_SYNC.enabled) return null;
  if (state.tournament?.active) {
    if (!state.tournament.currentMatch) return null;
    if (state.tournament.weekly) return "Tennis Courts Circuit Pro";
    if (String(state.tournament.competitionName || "").toUpperCase().includes("LEAGUE")) return "League";
    return "Tournoi Classic";
  }
  if (state.setMatch?.enabled && !state.setMatch.matchOver) return "Set";
  if (SOLO_AI.enabled && !state.gameOver) return "Échange";
  return null;
}

function profileActivityScore() {
  if (!state.setMatch?.enabled) return "Échange en cours";
  const score = Array.isArray(state.setMatch.score) ? state.setMatch.score : [0, 0];
  return `${Number(score[0] || 0)}/${Number(score[1] || 0)}`;
}

async function publishProfileActivity() {
  if (!AUTH_STATE.user || SPECTATOR_MODE.enabled) return;
  const type = !els.gameApp?.classList.contains("hidden") ? profileActivityType() : null;
  if (!type) {
    if (!PROFILE_ACTIVITY.lastActive) return;
    PROFILE_ACTIVITY.lastActive = false;
    try {
      await fetch("/api/profile/activity", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ active: false }),
      });
    } catch (error) {
      // L'expiration serveur retire aussi automatiquement une activité interrompue.
    }
    return;
  }
  const opponentIndex = SOLO_AI.enabled ? SOLO_AI.playerIndex : 1;
  const opponent = displayPlayerName(state.players?.[opponentIndex]) || characterNameFromId(SOLO_AI.characterId || "coachMax");
  PROFILE_ACTIVITY.lastActive = true;
  try {
    await fetch("/api/profile/activity", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        active: true,
        type,
        opponent,
        score: profileActivityScore(),
        state: exportSyncState(),
      }),
    });
  } catch (error) {
    // La partie locale continue même si l'indication de présence est momentanément indisponible.
  }
}

function tournamentStageLabel() {
  if (state.tournament.stage === "day1" || state.tournament.stage === "group1") return "journée 1";
  if (state.tournament.stage === "day2" || state.tournament.stage === "group2") return "journée 2";
  if (state.tournament.stage === "day3" || state.tournament.stage === "group3") return "journée 3";
  if (state.tournament.stage === "round16") return "8es de finale";
  if (state.tournament.stage === "quarter") return "quarts de finale";
  if (state.tournament.stage === "qualif") return "qualifications";
  if (state.tournament.stage === "readyNext") return "match suivant prêt";
  if (state.tournament.stage === "readySemi") return "demi-finale prête";
  if (state.tournament.stage === "semi") return "demi-finales";
  if (state.tournament.stage === "readyFinal") return "finale prête";
  if (state.tournament.stage === "final") return "finale";
  if (state.tournament.stage === "complete") return "terminé";
  return "tournoi";
}

function humanTournamentRoundLabel() {
  if (!state.tournament.active) return "";
  const current = state.tournament.currentMatch ? tournamentMatchById(state.tournament.currentMatch) : null;
  const next = state.tournament.nextHumanMatchId ? tournamentMatchById(state.tournament.nextHumanMatchId) : null;
  const round = next?.round || current?.round || state.tournament.stage;
  if (round === "day1" || round === "group1") return "Journée 1";
  if (round === "day2" || round === "group2") return "Journée 2";
  if (round === "day3" || round === "group3") return "Journée 3";
  if (round === "round16") return "8e de finale";
  if (round === "qualif") return "Qualifications";
  if (round === "quarter") return "Quart-de-finale";
  if (round === "semi" || round === "readySemi") return "Demi-finale";
  if (round === "final" || round === "readyFinal") return "Finale";
  return "";
}

function tournamentSurfaceBadgeClass() {
  const surface = state.tournament.competitionSurface || "";
  if (surface === "grass") return "surface-round-grass";
  if (surface === "clay") return "surface-round-clay";
  return "surface-round-hard";
}

function renderHumanRoundBadge() {
  const label = humanTournamentRoundLabel();
  if (!label) return "";
  return `<span class="surface-round-badge ${tournamentSurfaceBadgeClass()}">${label}</span>`;
}

function renderTournamentChampion(champion, final) {
  const championName = champion ? tournamentPlayerLabel(champion) : "";
  const characterId = champion ? tournamentEntryCharacterId(champion) : null;
  const winImage = characterId ? MATCH_RESULT_IMAGES[characterId]?.win : null;
  return `
    <div class="tournament-champion ${champion ? "is-crowned" : ""}">
      <span class="tournament-round-label">Vainqueur</span>
      <div class="tournament-champion-visual">
        ${winImage ? `<img class="tournament-champion-portrait" src="${escapeHtml(winImage)}" alt="Version victoire de ${escapeHtml(championName)}" />` : ""}
        <span class="tournament-champion-crown"><img src="${CROWN_IMAGE}" alt="Couronne du vainqueur" /></span>
      </div>
      <strong>${escapeHtml(championName)}</strong>
      ${final?.score ? `<div class="tournament-score">${escapeHtml(final.score)}</div>` : ""}
    </div>
  `;
}

function renderTournamentSetScores(scoreText, isLive = false, winnerSide = null) {
  const cleanScore = String(scoreText || "").replace(/\s*·\s*EN DIRECT\s*$/i, "").trim();
  if (!cleanScore) return "";
  const setScores = cleanScore.split(/\s+-\s+/).filter(Boolean);
  return `<div class="tournament-score tournament-set-scores ${isLive ? "live" : ""}" aria-label="${isLive ? "Score en direct" : "Score final"}">${setScores.map((score) => {
    const [left, right] = score.split("/").map((value) => Number(value.trim()));
    const setWinnerSide = left > right ? "left" : right > left ? "right" : null;
    const winnerClass = winnerSide && setWinnerSide === winnerSide ? "winner-set" : "";
    return `<span class="${winnerClass}">${escapeHtml(score.replace("/", "–"))}</span>`;
  }).join("")}</div>`;
}

function renderTournamentPanel() {
  if (!els.tournamentPanel) return;
  if (SPECTATOR_MODE.enabled) {
    els.tournamentPanel.classList.add("hidden");
    els.tournamentPanel.innerHTML = "";
    return;
  }
  if (!state.tournament.active) {
    els.tournamentPanel.classList.add("hidden");
    els.tournamentPanel.innerHTML = "";
    return;
  }
  const title = state.tournament.competitionName || (state.tournament.targetSets === 3 ? "Slam 3 sets" : "Tournoi 2 sets");
  if (state.tournament.friendly && state.tournament.stage === "waiting") {
    renderFriendlyTournamentWaitingPanel(title);
    return;
  }
  const locationText = state.tournament.weekly
    ? [state.tournament.competitionCity, state.tournament.competitionCountry, state.tournament.competitionFlag].filter(Boolean).join(" · ")
    : "";
  const round16Matches = state.tournament.matches.filter((match) => match.round === "round16");
  const qualificationMatches = state.tournament.matches.filter((match) => match.round === "qualif");
  const quarterMatches = state.tournament.matches.filter((match) => match.round === "quarter");
  const semiMatches = state.tournament.matches.filter((match) => match.round === "semi");
  const final = tournamentMatchById("final");
  const champion = state.tournament.championCharacterId;
  if (state.tournament.league) {
    renderLeagueTournamentPanel(title, final, champion);
    return;
  }
  const friendlyStatus = renderFriendlyTournamentStatus();
  els.tournamentPanel.innerHTML = `
    <div class="tournament-header">
      <div class="tournament-header-copy">
        <p class="eyebrow">Compétition en cours</p>
        <h2>${title} ${renderHumanRoundBadge()}</h2>
        <div class="tournament-meta-row">
          ${state.tournament.aiClubHouse ? `<span class="difficulty-reminder">IA ${tournamentDifficultyLabel(state.tournament.difficulty)} · ${tournamentBonusSummary()}</span>` : ""}
          ${state.tournament.competitionSurfaceLabel ? `<span class="difficulty-reminder">Surface · ${escapeHtml(state.tournament.competitionSurfaceLabel)}</span>` : ""}
          ${locationText ? `<span class="difficulty-reminder tournament-location-reminder">${escapeHtml(locationText)}</span>` : ""}
          ${state.tournament.weekly ? `<span class="difficulty-reminder weekly-points-reminder">Points acquis · ${humanTournamentPoints().points}</span>` : ""}
        </div>
      </div>
      <button class="small-button tournament-toggle-button" type="button" data-toggle-tournament>
        ${TOURNAMENT_PANEL_UI.visible ? "Masquer le tableau" : "Afficher le tableau"}
      </button>
    </div>
    ${friendlyStatus}
    <div class="tournament-bracket ${TOURNAMENT_PANEL_UI.visible ? "" : "hidden"}">
      ${round16Matches.length ? `
        <div class="tournament-column round16-column">
          <span class="tournament-round-label tournament-column-title">8es</span>
          ${round16Matches.map((match) => renderTournamentMatch(match)).join("")}
        </div>
      ` : ""}
      ${state.tournament.weekly && qualificationMatches.length ? `
        <div class="tournament-column qualification-column">
          <span class="tournament-round-label tournament-column-title">Qualifications</span>
          ${qualificationMatches.map((match) => renderTournamentMatch(match)).join("")}
        </div>
      ` : ""}
      <div class="tournament-column">
        <span class="tournament-round-label tournament-column-title">Quarts</span>
        ${quarterMatches.map((match) => renderTournamentMatch(match)).join("")}
      </div>
      <div class="tournament-column">
        <span class="tournament-round-label tournament-column-title">Demies</span>
        ${semiMatches.map((match) => renderTournamentMatch(match)).join("")}
      </div>
      <div class="tournament-column">
        <span class="tournament-round-label tournament-column-title">Finale</span>
        ${renderTournamentMatch(final, true)}
      </div>
      ${renderTournamentChampion(champion, final)}
    </div>
  `;
  els.tournamentPanel.classList.remove("hidden");
  els.tournamentPanel.querySelector("[data-toggle-tournament]")?.addEventListener("click", toggleTournamentPanel);
  els.tournamentPanel.querySelector("[data-start-tournament-semi]")?.addEventListener("click", () => scheduleSoloTournamentMatch(startTournamentSemi));
  els.tournamentPanel.querySelector("[data-start-tournament-final]")?.addEventListener("click", () => scheduleSoloTournamentMatch(startTournamentFinal));
}

function renderFriendlyTournamentStatus() {
  if (!state.tournament?.friendly) return "";
  if (state.tournament.stage === "complete") {
    return `<div class="friendly-status-banner">Tournoi terminé · Vainqueur : ${escapeHtml(tournamentPlayerLabel(state.tournament.championCharacterId))}</div>`;
  }
  if (state.tournament.currentMatch) {
    const match = tournamentMatchById(state.tournament.currentMatch);
    return `<div class="friendly-status-banner">Match en cours · ${escapeHtml(match?.label || "Tour")}</div>`;
  }
  if (FRIENDLY_TOURNAMENT.waitingForNextRound) {
    return renderFriendlyWaitingExperience();
  }
  if (state.gameOver && state.setMatch.matchOver && state.tournament.stage === "readyNext") {
    return '<div class="friendly-status-banner">Match terminé. Retour au CLUB HOUSE en attente du tour suivant.</div>';
  }
  return renderFriendlyWaitingExperience() || '<div class="friendly-status-banner">En attente de la fin des matchs du tour.</div>';
}

function renderFriendlyTournamentWaitingPanel(title) {
  const participants = state.tournament.friendlyParticipants || [];
  const canStart = FRIENDLY_TOURNAMENT.isCreator && participants.length >= 2;
  els.tournamentPanel.innerHTML = `
    <div class="tournament-header">
      <div>
        <p class="eyebrow">CLUB HOUSE</p>
        <h2>${escapeHtml(title)}</h2>
        <span class="difficulty-reminder">${participants.length}/4 participants · Classic 2 sets · tableau à 8</span>
      </div>
      ${canStart ? '<button class="primary-button tournament-toggle-button" type="button" data-start-friendly-tournament>Lancer</button>' : ""}
    </div>
    <div class="lobby-rooms">
      ${participants.map((participant) => `
        <article class="lobby-room">
          <div>
            <strong>${escapeHtml(participant.nickname || "Joueur")}${participant.isCreator ? " · Créateur" : ""}</strong>
            <span>${escapeHtml(characterNameFromId(participant.characterId))}</span>
          </div>
          <span>${participant.eliminated ? "Éliminé" : "En attente"}</span>
        </article>
      `).join("")}
    </div>
  `;
  els.tournamentPanel.classList.remove("hidden");
  els.tournamentPanel.querySelector("[data-start-friendly-tournament]")?.addEventListener("click", startFriendlyTournamentFromLobby);
}

function renderLeagueTournamentPanel(title, final, champion) {
  const completedDays = leagueCompletedGroupDays();
  const dayColumn = (day) => {
    const matches = state.tournament.matches.filter((match) => match.day === day);
    return `
      <div class="tournament-column league-day-column">
        <span class="tournament-round-label tournament-column-title">Journée ${day}</span>
        ${matches.map((match) => renderTournamentMatch(match)).join("")}
      </div>
    `;
  };
  const semiMatches = state.tournament.matches.filter((match) => match.round === "semi");
  const friendlyStatus = state.tournament.friendly ? renderFriendlyTournamentStatus() : "";
  els.tournamentPanel.innerHTML = `
    <div class="tournament-header">
      <div class="tournament-header-copy">
        <p class="eyebrow">Compétition en cours</p>
        <h2>${title} ${renderHumanRoundBadge()}</h2>
        <div class="tournament-meta-row"><span class="difficulty-reminder">LEAGUE · ${Number(state.tournament.targetSets || 2)} sets gagnants · 2 groupes de 4${state.tournament.aiClubHouse ? ` · IA ${tournamentDifficultyLabel(state.tournament.difficulty)} · ${tournamentBonusSummary()}` : ""}</span></div>
      </div>
      <button class="small-button tournament-toggle-button" type="button" data-toggle-tournament>
        ${TOURNAMENT_PANEL_UI.visible ? "Masquer le tableau" : "Afficher le tableau"}
      </button>
    </div>
    ${friendlyStatus}
    <div class="league-board ${TOURNAMENT_PANEL_UI.visible ? "" : "hidden"}">
      <div class="league-standings-grid">
        ${renderLeagueStandingsTable("A", completedDays)}
        ${renderLeagueStandingsTable("B", completedDays)}
      </div>
      <div class="tournament-bracket league-bracket">
        ${dayColumn(1)}
        ${dayColumn(2)}
        ${dayColumn(3)}
        <div class="tournament-column">
          <span class="tournament-round-label tournament-column-title">Demies</span>
          ${semiMatches.map((match) => renderTournamentMatch(match)).join("")}
        </div>
        <div class="tournament-column">
          <span class="tournament-round-label tournament-column-title">Finale</span>
          ${renderTournamentMatch(final, true)}
        </div>
        ${renderTournamentChampion(champion, final)}
      </div>
    </div>
  `;
  els.tournamentPanel.classList.remove("hidden");
  els.tournamentPanel.querySelector("[data-toggle-tournament]")?.addEventListener("click", toggleTournamentPanel);
}

function formatLeagueDifference(value) {
  const number = Number(value || 0);
  return number > 0 ? `+${number}` : String(number);
}

function renderLeagueStandingsTable(group, throughDay = 0) {
  const rows = leagueStandings(group, throughDay);
  return `
    <section class="league-standings">
      <span class="tournament-round-label">Groupe ${group}</span>
      <div class="league-standings-head">
        <span>Rang</span><span>Nom</span><span>Points</span><span>Diff. sets</span><span>Diff. jeux</span>
      </div>
      ${rows.map((row, index) => `
        <div class="league-standings-row ${index < 2 && throughDay >= 3 ? "qualified" : ""} ${isHumanTournamentEntry(row.entry) ? "human-player" : ""}">
          <strong class="league-rank">${index + 1}</strong>
          <span class="tournament-player-identity">${tournamentPlayerLabel(row.entry)} ${aiIntelligenceBadgeMarkup(row.entry)}</span>
          <strong>${row.points}</strong>
          <span>${formatLeagueDifference(row.setDifference)}</span>
          <span>${formatLeagueDifference(row.gameDifference)}</span>
        </div>
      `).join("")}
    </section>
  `;
}

function renderTournamentMatch(match, isFinal = false) {
  if (!match) return "";
  const playerA = match.playerA ? tournamentPlayerLabel(match.playerA) : "";
  const playerB = match.playerB ? tournamentPlayerLabel(match.playerB) : "";
  const scoreText = match.liveScore || match.score || "";
  const revealedWinner = match.score && match.winner ? match.winner : null;
  const playerAWon = Boolean(revealedWinner && revealedWinner === match.playerA);
  const playerBWon = Boolean(revealedWinner && revealedWinner === match.playerB);
  const winnerSide = playerAWon ? "left" : playerBWon ? "right" : null;
  const isCurrent = state.tournament.currentMatch === match.id;
  const isLive = !match.winner && Boolean(isCurrent || match.liveScore || match.score);
  const statusLabel = isLive ? "En direct" : match.winner ? "Terminé" : match.playerA && match.playerB ? "À jouer" : "À venir";
  const statusClass = isLive ? "live" : match.winner ? "complete" : "upcoming";
  return `
    <article class="tournament-match ${isCurrent ? "current" : ""} ${isFinal ? "final-match" : ""}">
      <header class="tournament-match-head">
        <span class="tournament-round-label">${isFinal ? "Finale" : match.label}</span>
        <span class="tournament-match-status ${statusClass}">${statusLabel}</span>
      </header>
      <div class="tournament-player-row ${playerAWon ? "winner" : ""} ${isHumanTournamentEntry(match.playerA) ? "human-player" : ""}">
        <span class="tournament-player-identity">${playerA}${tournamentSeedNumberMarkup(match.playerA)} ${aiIntelligenceBadgeMarkup(match.playerA)}</span>
        ${playerAWon ? "<strong>✓</strong>" : ""}
      </div>
      <div class="tournament-player-row ${playerBWon ? "winner" : ""} ${isHumanTournamentEntry(match.playerB) ? "human-player" : ""}">
        <span class="tournament-player-identity">${playerB}${tournamentSeedNumberMarkup(match.playerB)} ${aiIntelligenceBadgeMarkup(match.playerB)}</span>
        ${playerBWon ? "<strong>✓</strong>" : ""}
      </div>
      ${renderTournamentSetScores(scoreText, isLive, winnerSide)}
    </article>
  `;
}

function tournamentSeedNumberMarkup(entry) {
  if (!entry) return "";
  const seedNumber = Number(state.tournament.tournamentSeedNumbers?.[entry] || 0);
  return seedNumber >= 1 && seedNumber <= 4
    ? `<span class="tournament-seed-number">(${seedNumber})</span>`
    : "";
}

function tournamentPlayerLabel(entry) {
  if (state.tournament?.friendly) {
    if (!entry) return "";
    const info = friendlyEntryInfo(entry);
    return info?.nickname || characterNameFromId(friendlyEntryCharacterId(entry));
  }
  return isHumanTournamentEntry(entry)
    ? state.tournament?.humanNickname || state.players?.[0]?.nickname || nicknameValue()
    : characterNameFromId(entry);
}

function toggleTournamentPanel() {
  if (!state.tournament.active || SPECTATOR_MODE.enabled) return;
  TOURNAMENT_PANEL_UI.visible = !TOURNAMENT_PANEL_UI.visible;
  render();
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
  const inviteUrl = !SERVER_SYNC.friendlyMatch && canAccessAdminFeatures() ? (SERVER_SYNC.inviteUrl ?? "") : "";
  const localPlayer = state.players[SERVER_SYNC.seat];
  const localLabel = localPlayer ? `${localPlayer.nickname ?? localPlayer.name} · ${localPlayer.name}` : `Siège ${SERVER_SYNC.seat + 1}`;
  panel.innerHTML = `
    <p><strong>${SERVER_SYNC.friendlyMatch ? "Match humain du tournoi" : "Partie en ligne"}</strong> ${SERVER_SYNC.friendlyMatch ? state.tournament?.competitionName || "Tournoi en ligne" : `Salon ${SERVER_SYNC.roomId}`} · ${localLabel}</p>
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
  const enduranceClass = player.endurance <= 2 ? " low-endurance" : player.endurance <= 4 ? " warning-endurance" : "";
  const powerClass = leader === playerIndex ? " leading-power" : "";
  root.innerHTML = `
    <p class="label">${escapeHtml(displayPlayerName(player))}${state.server === playerIndex ? " · serveur" : ""}</p>
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

function projectSetScoreForExchangeWinner(winner, winType = "power") {
  if (!state.setMatch?.enabled || state.setMatch.setOver) return null;
  const loser = opponentOf(winner);
  // Une victoire aux points peut produire 2–0 : l'annonce ne doit pas être
  // limitée par l'écart de puissance encore provisoire pendant l'échange.
  const exchangeScore = winType === "boost"
    ? { winnerGames: 3, loserGames: 0, winner, loser }
    : { winnerGames: 2, loserGames: 0, winner, loser };
  return previewSetMatchScore(winner, exchangeScore);
}

function currentMatchStake() {
  if (!state.setMatch?.enabled || state.gameOver || state.setMatch.setOver) return null;
  const closingPlayers = [0, 1].map((playerIndex) => {
    const powerScore = projectSetScoreForExchangeWinner(playerIndex, "power");
    const boostScore = projectSetScoreForExchangeWinner(playerIndex, "boost");
    const closesWithPower = Boolean(powerScore && isSetOver(powerScore) && leadingSetPlayer(powerScore) === playerIndex);
    const closesWithBoost = Boolean(boostScore && isSetOver(boostScore) && leadingSetPlayer(boostScore) === playerIndex);
    return { playerIndex, closesWithPower, closesWithBoost, boostOnly: !closesWithPower && closesWithBoost };
  }).filter((item) => item.closesWithPower || item.closesWithBoost);
  if (!closingPlayers.length) return null;
  const matchPlayers = closingPlayers.filter(({ playerIndex }) => state.setMatch.targetSets && Number(state.setMatch.setsWon?.[playerIndex] || 0) + 1 >= Number(state.setMatch.targetSets));
  const matchIndexes = new Set(matchPlayers.map(({ playerIndex }) => playerIndex));
  const setPlayers = closingPlayers.filter(({ playerIndex }) => !matchIndexes.has(playerIndex));
  return [
    matchPlayers.length ? {
      label: "BALLE DE MATCH",
      names: matchPlayers.map(({ playerIndex, boostOnly }) => `${displayPlayerName(state.players[playerIndex])}${boostOnly ? " (BOOST)" : ""}`).join(" · "),
    } : null,
    setPlayers.length ? {
      label: "BALLE DE SET",
      names: setPlayers.map(({ playerIndex, boostOnly }) => `${displayPlayerName(state.players[playerIndex])}${boostOnly ? " (BOOST)" : ""}`).join(" · "),
    } : null,
  ].filter(Boolean);
}

function rallyEndConditionLabel() {
  if (!state.resultInfo) return "";
  if (state.resultInfo.winType === "boost") return "BOOST";
  if (state.resultInfo.winType === "power") return "Points";
  return "EFFET";
}

function rallyEndConditionClass() {
  const condition = rallyEndConditionLabel();
  if (condition === "BOOST") return "rally-end-boost";
  if (condition === "EFFET") return "rally-end-effect";
  return "rally-end-points";
}

function rallyEndReasonLabel() {
  const condition = rallyEndConditionLabel();
  if (condition === "BOOST") return "Victoire sur Boost";
  if (condition === "EFFET") return "Victoire sur Effet";
  return "Victoire aux Points";
}

function rallyEndGamesAdded() {
  const exchangeScore = state.resultInfo?.setScore;
  const added = [0, 0];
  if (!exchangeScore) return added;
  added[exchangeScore.winner] = Number(exchangeScore.winnerGames || 0);
  added[exchangeScore.loser] = Number(exchangeScore.loserGames || 0);
  return added;
}

function rallyEndGamesAddedLabel() {
  const added = rallyEndGamesAdded();
  return `+ ${added[0]}/${added[1]}`;
}

function rallyEndScoreMarkup() {
  if (!state.resultInfo) return "";
  const setMatch = state.resultInfo.setMatch;
  const scores = [];
  if (setMatch) {
    (setMatch.completedScores || []).forEach((score) => {
      scores.push({ score: [Number(score?.[0] || 0), Number(score?.[1] || 0)], current: false });
    });
    if (!setMatch.setOver && Array.isArray(setMatch.score)) {
      scores.push({ score: [Number(setMatch.score[0] || 0), Number(setMatch.score[1] || 0)], current: true });
    } else if (!scores.length && Array.isArray(setMatch.score)) {
      scores.push({ score: [Number(setMatch.score[0] || 0), Number(setMatch.score[1] || 0)], current: true });
    }
  }
  if (!scores.length && state.resultInfo.setScore) {
    const exchangeScore = state.resultInfo.setScore;
    const score = [0, 0];
    score[exchangeScore.winner] = Number(exchangeScore.winnerGames || 0);
    score[exchangeScore.loser] = Number(exchangeScore.loserGames || 0);
    scores.push({ score, current: true });
  }
  if (!scores.length) return '<span class="rally-end-score-empty">—</span>';
  return `<div class="rally-end-score-values" aria-label="Score du match">${scores.map(({ score, current }, index) => {
    const scoreClass = current ? "current" : score[0] > score[1] ? "won-left" : "won-right";
    const label = current ? "Set en cours" : `Set ${index + 1}`;
    return `<strong class="${scoreClass}" aria-label="${label} : ${score[0]} à ${score[1]}">${score[0]}–${score[1]}</strong>`;
  }).join('<i aria-hidden="true">·</i>')}</div>`;
}

function renderRallyEndActions() {
  if (!state.gameOver) return "";
  const progression = renderProgressionButtons();
  const setMatch = state.resultInfo?.setMatch;
  const replay = setMatch?.matchOver && !state.tournament?.active && !SERVER_SYNC.enabled && SOLO_AI.enabled && [2, 3].includes(Number(state.setMatch?.targetSets))
    ? '<button class="primary-button replay-match-button" type="button" data-replay-solo-match>Rejouer le match</button>'
    : "";
  return `${progression}${replay}`;
}

function bindRallyEndActions(root = els.rallyState) {
  bindProgressionButtons(root);
  root?.querySelector("[data-replay-solo-match]")?.addEventListener("click", () => {
    startMatchMode(Number(state.setMatch.targetSets), { keepSoloOpponent: true });
  });
}

function renderRallyState() {
  const active = activePlayer();
  const last = state.lastCard;
  const activeConstraints = [];
  if (state.mandatoryPlacement && last) activeConstraints.push(`placement ${last.precision}+ obligatoire (${state.mandatoryPlacementReason === "smash" ? "Smash" : "Boost"})`);
  if (active.limitedFamilies) activeConstraints.push(`type: ${active.limitedFamilies.join(" / ")}`);
  if (hasReturnServiceRestriction(state.activePlayer)) activeConstraints.push("retour de service: pas Volée/Smash");
  const preparedPlacement = active.power != null ? turnEndPlacement(state.activePlayer) : 0;
  const stakes = currentMatchStake();
  const rallyCard = els.rallyState?.closest(".rally-card");
  rallyCard?.classList.toggle("completed", state.gameOver);
  ["rally-end-boost", "rally-end-effect", "rally-end-points"].forEach((className) => {
    rallyCard?.classList.toggle(className, Boolean(state.gameOver && className === rallyEndConditionClass()));
  });
  if (els.rallyPhaseLabel) els.rallyPhaseLabel.textContent = state.gameOver ? "Échange terminé" : "Échange en cours";
  if (els.rallyStatusBadge) {
    els.rallyStatusBadge.textContent = state.gameOver ? rallyEndReasonLabel() : `${displayPlayerName(active)} à jouer`;
    els.rallyStatusBadge.className = `rally-status-badge ${state.gameOver ? `completed ${rallyEndConditionClass()}` : "live"}`;
  }
  if (els.rallyScoreDeltaBadge) {
    els.rallyScoreDeltaBadge.textContent = state.gameOver ? rallyEndGamesAddedLabel() : "";
    els.rallyScoreDeltaBadge.classList.toggle("hidden", !state.gameOver);
  }
  const contextualNotices = [
    stakes?.length ? `<div class="rally-stakes">${stakes.map((stake) => `<div class="rally-context-line stake"><strong>${escapeHtml(stake.label)}</strong><span>${escapeHtml(stake.names)}</span></div>`).join("")}</div>` : "",
    activeConstraints.length ? `<div class="rally-context-line constraint"><strong>Contrainte</strong><span>${escapeHtml(activeConstraints.join(" · "))}</span></div>` : "",
    state.boostAvailableFor == null ? "" : `<div class="rally-context-line boost"><strong>BOOST disponible</strong><span>${escapeHtml(playerName(state.boostAvailableFor))} peut répondre en BOOST.</span></div>`,
  ].filter(Boolean).join("");
  els.rallyState.innerHTML = state.gameOver && state.resultInfo ? `
    <div class="rally-info-grid rally-result-grid">
      <div class="rally-info-chip primary"><span>Vainqueur</span><strong>${escapeHtml(playerName(state.resultInfo.winner))}</strong></div>
      <div class="rally-info-chip rally-score-chip"><span>Score</span>${rallyEndScoreMarkup()}</div>
      <div class="rally-info-chip rally-next-chip"><div class="rally-next-actions">${renderRallyEndActions()}</div></div>
    </div>
  ` : `
    <div class="rally-info-grid">
      <div class="rally-info-chip primary"><span>Tour</span><strong>${escapeHtml(displayPlayerName(active))}</strong></div>
      <div class="rally-info-chip"><span>Serveur</span><strong>${escapeHtml(playerName(state.server))}</strong></div>
      <div class="rally-info-chip"><span>Dernier coup</span><strong>${last ? `${escapeHtml(last.name)}${last.boosted ? " · BOOST" : ""}` : "Aucun"}</strong>${last ? `<small>Précision ${last.precision}</small>` : ""}</div>
      <div class="rally-info-chip"><span>Placement préparé</span><strong>${preparedPlacement}</strong></div>
    </div>
    ${contextualNotices ? `<div class="rally-context-list">${contextualNotices}</div>` : ""}
  `;
  bindRallyEndActions();
}

function renderEffectNotice() {
  if (state.gameOver || !state.effectNotice) {
    els.effectNotice.className = "effect-notice muted hidden";
    els.effectNotice.innerHTML = "";
    return;
  }
  els.effectNotice.className = "effect-notice";
  els.effectNotice.innerHTML = `<span class="effect-notice-kicker">Effet ${escapeHtml(state.effectNotice.status)}</span><strong>${escapeHtml(state.effectNotice.cardName)}</strong><p>${escapeHtml(state.effectNotice.message)}</p>`;
}

function renderCardVisualOnly(card, className = "") {
  if (!card) return '<div class="played-card empty">Aucune carte</div>';
  const imageUrl = CARD_IMAGES[card.id];
  if (!imageUrl) {
    return `<div class="played-card ${className}"><strong>${card.name}</strong>${card.subtitle ?? card.family}</div>`;
  }
  return `
    <button class="played-visual ${className} ${card.removed ? "removed" : ""}" type="button" data-image-zoom="${escapeHtml(imageUrl)}" data-image-label="${escapeHtml(`${card.name} - ${card.subtitle ?? card.family}`)}" aria-label="Agrandir ${escapeHtml(card.name)}">
      ${card.boosted ? `<span class="boost-sacrifice-layer"><img class="boost-sacrifice-back" src="${CARD_BACK_IMAGE}" alt="Carte sacrifiée face cachée" /><span class="boost-sacrifice-label">BOOST</span></span>` : ""}
      <img src="${imageUrl}" alt="${card.name} - ${card.subtitle ?? card.family}" />
      ${card.remiseMode === "placement" ? `<img class="remise-forbid-overlay" src="${FORBID_IMAGE}" alt="Effet interdit, carte jouée en Remise" />` : ""}
      ${card.boosted ? '<span class="played-chip">BOOST</span>' : ""}
      ${card.removed ? '<span class="played-chip removed-chip">RETIRÉE</span>' : ""}
    </button>
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

function matchResultImageForPlayer(player, playerIndex) {
  if (!state.setMatch.matchOver || state.setMatch.matchWinner == null) return null;
  const resultKey = state.setMatch.matchWinner === playerIndex ? "win" : "lose";
  return MATCH_RESULT_IMAGES[player.characterId]?.[resultKey] ?? null;
}

function renderCharacterCard(player, playerIndex) {
  const character = characterOf(player);
  const opponent = state.players[opponentOf(playerIndex)];
  const opponentEndurance = Number(opponent?.endurance ?? 0);
  const opponentHandCount = Number(opponent?.hand?.length ?? 0);
  const resultImage = matchResultImageForPlayer(player, playerIndex);
  const imageUrl = resultImage ?? CHARACTER_IMAGES[player.characterId]?.[player.characterSide] ?? CHARACTER_IMAGES[player.characterId]?.[0];
  const leader = leadingPlayerIndex();
  const leaderClass = leader === playerIndex ? " leading-power" : "";
  const enduranceClass = player.endurance <= 2 ? " low-endurance" : player.endurance <= 4 ? " warning-endurance" : "";
  const handCount = player.hand.length;
  const handCountClass = handCount === 0 ? " empty-hand" : handCount === 1 ? " critical-hand" : handCount === 2 ? " low-hand" : "";
  const crown = state.gameOver && state.resultInfo?.winner === playerIndex
    ? `<span class="winner-crown" aria-label="Vainqueur"><img src="${CROWN_IMAGE}" alt="Couronne" /></span>`
    : "";
  const worldRankReminder = state.tournament.active && [1, 2, 3].includes(Number(player.worldRank))
    ? { label: `N°${Number(player.worldRank)} mondial`, goldWorldRank: true }
    : null;
  const bonusReminders = [
    worldRankReminder,
    ...surfaceBonusesForPlayer(player),
    ...(player.permanentBonuses ?? []),
  ].filter(Boolean);
  const surfaceBonus = bonusReminders.length
    ? `<div class="surface-bonus-stack">${bonusReminders.map((bonus) => `<div class="surface-bonus-reminder${bonus.goldWorldRank ? " world-rank-gold" : ""}">${escapeHtml(bonus.label)}</div>`).join("")}</div>`
    : "";
  return `
    <div class="character-zone">
      <div class="character-card${state.gameOver && state.resultInfo?.winner === playerIndex ? " exchange-winner" : ""}${tutorialFocusClass("character", playerIndex)}" data-image-hover="${escapeHtml(imageUrl)}" data-image-label="${escapeHtml(`${character.name} - pouvoir`)}">
        <img src="${imageUrl}" alt="${character.name}" />
      </div>
      ${surfaceBonus}
      <div class="character-stats">
        <div class="character-power-reminder${leaderClass}${tutorialFocusClass("power", playerIndex)}" data-tutorial-target="power-${playerIndex}">
          ${crown}
          <div class="stat-value-row stat-value-power">
            <span class="stat-symbol stat-symbol-power" aria-hidden="true"></span>
            <strong>${player.power}<span class="opponent-inline">(${opponent?.power ?? 0})</span></strong>
          </div>
          ${GAMEPLAY_ASSIST.information ? "<span>Puissance</span>" : ""}
        </div>
        <div class="character-endurance-reminder${enduranceClass}${tutorialFocusClass("endurance", playerIndex)}" data-tutorial-target="endurance-${playerIndex}">
          <div class="stat-value-row stat-value-endurance">
            <span class="stat-symbol stat-symbol-endurance" aria-hidden="true"></span>
            <strong>${player.endurance}<span class="opponent-inline ${opponentEndurance <= 2 ? "critical-opponent" : ""}">(${opponentEndurance})</span></strong>
          </div>
          ${GAMEPLAY_ASSIST.information ? "<span>Endurance</span>" : ""}
        </div>
        <div class="character-hand-reminder${handCountClass}" aria-label="${handCount} carte${handCount > 1 ? "s" : ""} restante${handCount > 1 ? "s" : ""}">
          <span class="hand-cards-icon" aria-hidden="true"><i></i><i></i></span>
          <strong>${handCount}<span class="opponent-inline ${opponentHandCount <= 2 ? "critical-opponent" : ""}">(${opponentHandCount})</span></strong>
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

function renderSetMarkerImage(targetSets, wonSets, playerIndex) {
  const clamped = Math.max(0, Math.min(targetSets, wonSets ?? 0));
  const imageUrl = MATCH_SET_IMAGES[targetSets]?.[clamped];
  if (!imageUrl) return "";
  return `<img class="set-marker-image player-${playerIndex + 1}" src="${imageUrl}" alt="${clamped} set${clamped > 1 ? "s" : ""} gagné${clamped > 1 ? "s" : ""}" />`;
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
      matchLine = `<div class="center-match-markers" aria-label="Sets gagnés">
        ${renderSetMarkerImage(state.setMatch.targetSets, state.setMatch.setsWon[0], 0)}
        ${renderSetMarkerImage(state.setMatch.targetSets, state.setMatch.setsWon[1], 1)}
      </div>`;
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
  if (state.tournament.friendly && state.gameOver && state.setMatch.matchOver) {
    return '<button class="primary-button next-exchange-button next-set-button" type="button" data-return-club-house>RETOUR CLUB-HOUSE</button>';
  }
  if (isHumanTournamentRunOver()) {
    return '<button class="primary-button next-exchange-button next-set-button" type="button" data-exit-tournament>Sortir du tournoi</button>';
  }
  if (state.tournament.active && state.gameOver && state.setMatch.matchOver) {
    if (state.tournament.friendly && state.tournament.stage === "readyNext") {
      return "";
    }
    if (state.tournament.stage === "readyNext") {
      return '<button class="primary-button next-exchange-button next-set-button" type="button" data-start-tournament-next-match>MATCH SUIVANT</button>';
    }
    if (state.tournament.stage === "readySemi") {
      return '<button class="primary-button next-exchange-button next-set-button" type="button" data-start-tournament-next-match>DEMI-FINALE</button>';
    }
    if (state.tournament.stage === "readyFinal") {
      return '<button class="primary-button next-exchange-button next-set-button" type="button" data-start-tournament-next-match>FINALE</button>';
    }
  }
  if (!state.setMatch.enabled || !state.gameOver || !state.setMatch.setOver || state.setMatch.matchOver) return "";
  return '<button class="primary-button next-exchange-button next-set-button" type="button" data-next-full-set>Set suivant</button>';
}

function isHumanTournamentRunOver() {
  if (!state.tournament.active || !state.gameOver || !state.setMatch.matchOver) return false;
  const human = humanTournamentEntry();
  if (state.tournament.championCharacterId === human) return true;
  if (state.tournament.stage !== "complete") return false;
  const playedHumanMatches = state.tournament.matches.filter((match) => match.score && (match.playerA === human || match.playerB === human));
  const last = playedHumanMatches.at(-1);
  return Boolean(last && last.winner !== human);
}

function renderProgressionButtons() {
  return [
    renderCenterNextSoloExchangeButton(),
    renderCenterNextExchangeButton(),
    renderCenterNextSetButton(),
  ].filter(Boolean).join("");
}

function bindProgressionButtons(root) {
  root?.querySelector("[data-next-set-exchange]")?.addEventListener("click", nextSetExchange);
  root?.querySelector("[data-next-solo-exchange]")?.addEventListener("click", nextSoloExchange);
  root?.querySelector("[data-next-full-set]")?.addEventListener("click", nextFullSet);
  root?.querySelector("[data-start-tournament-next-match]")?.addEventListener("click", startTournamentNextMatchFromCenter);
  root?.querySelector("[data-exit-tournament]")?.addEventListener("click", exitTournamentToLobby);
  root?.querySelector("[data-return-club-house]")?.addEventListener("click", returnFriendlyMatchToClubHouse);
}

function bindCenterButtons() {
  bindProgressionButtons(els.centerPlayedCard);
}

function bindResultTournamentButton() {
  bindProgressionButtons(els.resultPanel);
}

function returnFriendlyMatchToClubHouse() {
  if (!FRIENDLY_TOURNAMENT.enabled) return;
  FRIENDLY_TOURNAMENT.awaitingClubHouseReturn = false;
  FRIENDLY_TOURNAMENT.inMatch = false;
  FRIENDLY_TOURNAMENT.currentMatchId = null;
  window.clearInterval(FRIENDLY_TOURNAMENT.streamTimer);
  if (SERVER_SYNC.friendlyMatch) leaveOnlineRoom();
  SOLO_AI.enabled = false;
  stopSoloTimers();
  showFriendlyLobbyScreen();
  renderFriendlyLobbyScreen();
  pollFriendlyTournament();
}

function startTournamentNextMatchFromCenter() {
  if (!state.tournament.active) return;
  if (state.tournament.friendly) {
    return;
  }
  if (state.tournament.stage === "readyNext" || state.tournament.stage === "readySemi") {
    scheduleSoloTournamentMatch(startTournamentSemi);
    return;
  }
  if (state.tournament.stage === "readyFinal") {
    scheduleSoloTournamentMatch(startTournamentFinal);
  }
}

async function exitTournamentToLobby() {
  const confirmed = await showEventConfirmDialog({
    kicker: state.tournament?.competitionName || "Compétition",
    title: "Quitter le tournoi ?",
    message: "Votre progression sera conservée lorsque ce format le permet, puis vous reviendrez à l’accueil.",
    confirmLabel: "Retour accueil",
  });
  if (!confirmed) return;
  if (state.tournament.weekly && state.tournament.stage !== "complete") {
    await saveTournamentProgress();
  } else if (state.tournament.weekly) {
    await recordWeeklyCompetitionResult();
    await deleteTournamentProgress();
  }
  resetTournament();
  showMenuScreen();
}

function nextSoloExchange() {
  if (!SOLO_AI.enabled || SERVER_SYNC.enabled || state.setMatch.enabled || !state.gameOver) return;
  newGame({ preserveSet: true });
  state.log.unshift(`Nouvel échange contre l'IA ${aiStyleLabel()}.`);
  render();
}

function renderCenterPlayedCard() {
  els.centerPlayedCard.classList.toggle("tutorial-focus-target", Boolean(tutorialFocusClass("lastCard", null)));
  if (!state.latestPlayedCard) {
    els.centerPlayedCard.innerHTML = `
      ${renderCenterSetScore()}
      <p class="previous-title">Dernière carte jouée</p>
      <div class="previous-empty">Aucune carte jouée</div>
      <div class="center-progression-actions">${renderRallyEndActions()}</div>
    `;
    bindRallyEndActions(els.centerPlayedCard);
    return;
  }
  els.centerPlayedCard.innerHTML = `
    ${renderCenterSetScore()}
    <p class="previous-title">Dernière carte jouée</p>
    <div class="center-card-wrap ${state.latestPlayedCard.boosted ? "boosted-center-wrap" : ""}">
      ${renderCardVisualOnly(state.latestPlayedCard, "center-played")}
    </div>
    <div class="center-progression-actions">${renderRallyEndActions()}</div>
  `;
  bindRallyEndActions(els.centerPlayedCard);
}

function activeEffectBadges(playerIndex) {
  const player = state.players[playerIndex];
  const badges = [];
  const preferredSourceUid = (sources = []) => {
    const values = (Array.isArray(sources) ? sources : [sources]).map((source) => source?.sourceUid || source).filter(Boolean);
    return values.find((sourceUid) => String(sourceUid).endsWith(":star")) || values[0] || null;
  };
  if (player.nextPrecisionBonus) badges.push({ text: `Prochain coup: +${player.nextPrecisionBonus} précision`, type: "effect", sourceUid: preferredSourceUid(player.nextPrecisionSources) });
  if (player.nextPlacementBonus) badges.push({ text: `Prochain coup: +${player.nextPlacementBonus} placement`, type: "effect", sourceUid: preferredSourceUid(player.nextPlacementSources) });
  if (player.nextAnyPlacementBonus) badges.push({ text: `Prochaine carte: +${player.nextAnyPlacementBonus} placement`, type: "effect", sourceUid: preferredSourceUid(player.nextAnyPlacementSources) });
  if (player.nextDiscount) badges.push({ text: `Prochain coup: -${player.nextDiscount} endurance`, type: "effect", sourceUid: preferredSourceUid(player.nextDiscountSources) });
  if (player.nextExtraCost) badges.push({ text: `Prochain coup: +${player.nextExtraCost} endurance`, type: "effect", sourceUid: preferredSourceUid(player.nextExtraCostSources) });
  const rosaPassBonus = Number(state.players[opponentOf(playerIndex)]?.rosaPassPowerBonus || 0);
  if (rosaPassBonus > 0) badges.push({ text: `Contrainte échange: si vous passez, Rosa gagne +${rosaPassBonus} puissance`, type: "constraint" });
  if ((player.nextPowerMultiplier ?? 1) > 1) badges.push({ text: `Prochain coup: puissance x${player.nextPowerMultiplier}`, type: "effect", sourceUid: player.nextPowerMultiplierSourceUid });
  if (player.exchangePrecisionBonus) badges.push({ text: `Échange: +${player.exchangePrecisionBonus} précision`, type: "effect", sourceUid: preferredSourceUid(player.exchangePrecisionSources) });
  if (player.exchangePlacementBonus) badges.push({ text: `Échange: +${player.exchangePlacementBonus} placement`, type: "effect", sourceUid: preferredSourceUid(player.exchangePlacementSources) });
  if (player.exchangeFamilyPowerBonuses?.length) badges.push({ text: "Échange: bonus puissance par type", type: "effect", sourceUid: preferredSourceUid(player.exchangeFamilyPowerBonuses) });
  if (player.exchangeAfterFamilyPlacementBonuses?.length) badges.push({ text: "Échange: bonus placement conditionnel", type: "effect", sourceUid: preferredSourceUid(player.exchangeAfterFamilyPlacementBonuses) });
  if (player.placementPerOpponentLowPowerCardBonuses?.length) badges.push({ text: "Échange: bonus placement anti-carte faible", type: "effect", sourceUid: preferredSourceUid(player.placementPerOpponentLowPowerCardBonuses) });
  if (player.protectedFromRemoval) badges.push({ text: "Actif: cartes protégées", type: "effect", sourceUid: player.protectedFromRemovalSourceUid });
  if (player.cancelNextOpponentEffect) badges.push({ text: "Actif: annule le prochain effet adverse", type: "effect", sourceUid: player.cancelNextOpponentEffectSourceUid });
  if (player.freeBoostNext) badges.push({ text: "Actif: boost libre", type: "effect", sourceUid: player.freeBoostNextSourceUid });
  if (state.turnIgnoresPlacement[playerIndex]) badges.push({ text: "Joker: placement ignoré ce tour", type: "effect" });
  if (player.limitedFamilies) badges.push({ text: `Contrainte tour: ${player.limitedFamilies.join(" / ")}`, type: "constraint", sourceUid: player.limitedFamiliesSourceUid });
  if (state.activePlayer === playerIndex && state.mandatoryPlacement && state.lastCard) {
    badges.push({ text: `Contrainte: placement ${state.lastCard.precision}+`, type: "constraint" });
  }
  if (state.boostAvailableFor === playerIndex) badges.push({ text: "Actif: boost possible", type: "effect" });
  if (hasReturnServiceRestriction(playerIndex)) {
    badges.push({ text: "Retour: pas Volée/Smash", type: "constraint" });
  }
  for (const bonus of player.endBonuses) {
    if (bonus.type === "doubleLastShot") badges.push({ text: "Fin échange: Double", type: "effect", sourceUid: bonus.sourceUid });
    if (bonus.type === "boostedBonus") badges.push({ text: `Fin échange: +${bonus.value}/boost`, type: "effect", sourceUid: bonus.sourceUid });
  }
  return badges.map((badge) => {
    const separator = badge.text.indexOf(":");
    const duration = separator > 0 ? badge.text.slice(0, separator) : badge.type === "constraint" ? "Ce tour" : "Actif";
    const label = separator > 0 ? badge.text.slice(separator + 1).trim() : badge.text;
    const starBonus = String(badge.sourceUid || "").endsWith(":star");
    const starPlayedUid = starBonus ? String(badge.sourceUid).replace(/:star$/, "") : "";
    const starLabel = starBonus
      ? player.played.find((card) => card.playedUid === starPlayedUid)?.starEffectLabel || "Bonus du personnage"
      : "";
    return {
      ...badge,
      label: starBonus ? `Bonus étoile · ${label}` : label,
      duration: starBonus ? "Bonus étoile" : duration,
      icon: badge.type === "constraint" ? "!" : "✦",
      description: `${starLabel ? `${starLabel}. ` : ""}${badge.text}. Cet état est appliqué tant que la carte est visible.`,
    };
  });
}

function closeEffectHelpDialog() {
  document.querySelector(".effect-help-backdrop")?.remove();
}

function openEffectHelpDialog(button) {
  closeEffectHelpDialog();
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop effect-help-backdrop";
  backdrop.innerHTML = `
    <section class="effect-help-dialog" role="dialog" aria-modal="true" aria-labelledby="effectHelpTitle">
      <span class="effect-help-icon" aria-hidden="true">${escapeHtml(button.dataset.effectIcon || "✦")}</span>
      <div><p class="label">${escapeHtml(button.dataset.effectDuration || "Effet actif")}</p><h2 id="effectHelpTitle">${escapeHtml(button.dataset.effectLabel || "Effet")}</h2><p>${escapeHtml(button.dataset.effectDescription || "")}</p></div>
      <button class="small-button" type="button" data-close-effect-help>Fermer</button>
    </section>
  `;
  backdrop.querySelector("[data-close-effect-help]")?.addEventListener("click", closeEffectHelpDialog);
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeEffectHelpDialog(); });
  document.body.appendChild(backdrop);
}

function renderPlayerPanel(playerIndex, root) {
  const player = state.players[playerIndex];
  const passDisabled = playerIndex !== state.activePlayer || state.gameOver || !canUseSeat(playerIndex) || !tutorialAllowsPass();
  root.classList.toggle("active", playerIndex === state.activePlayer && !state.gameOver);
  root.innerHTML = `
    <header class="player-header">
      <div class="player-identity-panel${state.activePlayer === playerIndex && !state.gameOver ? " active-turn" : ""}">
        <h2>${escapeHtml(displayPlayerName(player))}</h2>
        <div class="player-character-name">${escapeHtml(player.name)} ${playerIndex === SOLO_AI.playerIndex ? aiIntelligenceBadgeMarkup(player.characterId) : ""}</div>
        <div class="turn-buttons">
          <button class="pass-button${tutorialFocusClass("pass", playerIndex)}" type="button" data-pass="${playerIndex}" ${passDisabled ? "disabled" : ""}>${tutorialButtonCue("pass", playerIndex)}Passer</button>
          ${canEndTurn(playerIndex) ? `<button class="small-button end-turn-button" type="button" data-end-turn="${playerIndex}">${tutorialButtonCue("endTurn", playerIndex)}Terminer le tour</button>` : ""}
          ${canUndoTurn(playerIndex) ? `<button class="small-button undo-turn-button" type="button" data-undo-turn="${playerIndex}">Annuler le tour</button>` : ""}
        </div>
      </div>
      <div class="badges">
        ${state.server === playerIndex ? '<span class="badge server">Serveur</span>' : ""}
        ${state.activePlayer === playerIndex && !state.gameOver ? '<span class="badge active">À jouer</span>' : ""}
        ${state.activePlayer === playerIndex && turnEndPlacement(playerIndex) ? `<span class="badge">${turnEndPlacement(playerIndex)} placement préparé</span>` : ""}
        ${activeEffectBadges(playerIndex).map((badge) => `<button class="effect-chip ${badge.type}" type="button" title="${escapeHtml(badge.description)}" data-effect-help data-effect-icon="${escapeHtml(badge.icon)}" data-effect-label="${escapeHtml(badge.label)}" data-effect-duration="${escapeHtml(badge.duration)}" data-effect-description="${escapeHtml(badge.description)}"><i aria-hidden="true">${escapeHtml(badge.icon)}</i><span><strong>${escapeHtml(badge.label)}</strong><small>${escapeHtml(badge.duration)}</small></span></button>`).join("")}
      </div>
    </header>
    ${renderCharacterCard(player, playerIndex)}
    <div class="hand${tutorialFocusClass("hand", playerIndex)}">
      ${player.hand.map((card) => renderCard(playerIndex, card)).join("")}
    </div>
    <div class="played-history">
      <p class="engaged-title">Cartes jouées</p>
      ${renderPlayedHistory(player)}
    </div>
  `;

  root.querySelectorAll("[data-pass]").forEach((button) => {
    button.addEventListener("click", () => {
      const playerIndex = Number(button.dataset.pass);
      pass(playerIndex);
      completeTutorialAction({ kind: "pass", playerIndex });
    });
  });
  root.querySelectorAll("[data-end-turn]").forEach((button) => {
    button.addEventListener("click", () => {
      const playerIndex = Number(button.dataset.endTurn);
      endTurn(playerIndex);
      completeTutorialAction({ kind: "endTurn", playerIndex });
    });
  });
  root.querySelectorAll("[data-undo-turn]").forEach((button) => {
    button.addEventListener("click", () => restoreTurnSnapshot());
  });
  root.querySelectorAll("[data-effect-help]").forEach((button) => {
    button.addEventListener("click", () => openEffectHelpDialog(button));
  });
  root.querySelectorAll("[data-tutorial-select]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectTutorialCard(Number(button.dataset.tutorialPlayer), button.dataset.tutorialSelect);
    });
  });
  root.querySelectorAll("[data-tutorial-card]").forEach((cardElement) => {
    const select = () => selectTutorialCard(Number(cardElement.dataset.tutorialPlayer), cardElement.dataset.tutorialCard);
    cardElement.addEventListener("click", select);
    cardElement.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      select();
    });
  });
}

function renderCardAssistPreview(playerIndex, card, cost, boostAllowed) {
  if (!GAMEPLAY_ASSIST.preview) return "";
  const player = state.players[playerIndex];
  const normalStats = getCardStats(player, card, false);
  const boostStats = boostAllowed ? getCardStats(player, card, true) : null;
  return `
    <div class="card-assist-preview ${boostStats ? "has-boost" : ""}" aria-label="Prévisualisation de la carte">
      <span><small>Puissance après</small><strong>${player.power + normalStats.power}</strong></span>
      <span><small>Endurance après</small><strong>${Math.max(0, player.endurance - cost)}</strong></span>
      ${boostStats ? `<span class="card-assist-boost"><small>Puissance BOOST</small><strong>${player.power + boostStats.power}</strong></span>` : ""}
    </div>
  `;
}

function renderCard(playerIndex, card) {
  const player = state.players[playerIndex];
  const temporarilyRevealed = isOpponentHandTemporarilyRevealed(playerIndex);
  const isHidden = !temporarilyRevealed && (SPECTATOR_MODE.enabled || (SERVER_SYNC.enabled
    ? playerIndex !== SERVER_SYNC.seat
    : SOLO_AI.enabled
      ? playerIndex === SOLO_AI.playerIndex && !(state.gameOver && state.revealAiCards)
      : playerIndex !== state.activePlayer && !state.gameOver));
  const effectModeAllowed = canPlayEffectMode(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "effect", false);
  const placementModeAllowed = canPlayNormal(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "placement", false);
  const normalAllowed = canPlayNormal(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "normal", false);
  const boostAllowed = canPlayBoost(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "boost", true);
  const cost = effectiveCost(player, card);
  const stats = getCardStats(player, card, false);
  const placementTotal = totalTurnPlacement(playerIndex, card, false);
  const placementIssue = !isRemise(card) && state.lastCard && placementTotal < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex];
  const remisePlacementIssue = isRemise(card) && state.lastCard && placementTotal < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex] && !state.turnCannotOpenBoost[playerIndex];
  const imageUrl = CARD_IMAGES[card.id];
  const hasDynamicStats = stats.precision !== card.precision || stats.placement !== card.placement || cost !== card.cost || state.turnPlacement[playerIndex] > 0;
  const showForbidEffect = playerIndex === state.activePlayer && isNextEffectCanceledFor(playerIndex) && Boolean(card.effectType);
  const riskyPlayClass = placementIssue && !state.mandatoryPlacement ? " risky-play-button" : "";
  const riskyRemiseClass = remisePlacementIssue && !state.mandatoryPlacement ? " risky-play-button" : "";
  const expectedTutorialAction = tutorialExpectedAction();
  const tutorialSelectMode = state.tutorial.active && expectedTutorialAction?.kind === "selectCard" && expectedTutorialAction.playerIndex === playerIndex;
  const tutorialSelectedClass = state.tutorial.selectedCardUid === card.uid ? " tutorial-selected-card" : "";
  const tutorialCardFocusClass = tutorialFocusClass("card", playerIndex, card.id);
  if (isHidden) {
    return `
      <article class="card has-visual hidden-hand-card">
        ${renderCardBack()}
      </article>
    `;
  }
  return `
    <article class="card ${imageUrl ? "has-visual" : ""} ${isRemise(card) ? "remise-card" : ""} ${normalAllowed || effectModeAllowed || placementModeAllowed || boostAllowed ? "" : "unplayable"}${tutorialSelectMode ? " tutorial-selectable-card" : ""}${tutorialSelectedClass}${tutorialCardFocusClass}" data-tutorial-card="${card.uid}" data-tutorial-card-id="${card.id}" data-tutorial-player="${playerIndex}">
      ${tutorialSelectMode ? `<button class="tutorial-card-selector" type="button" data-tutorial-select="${card.uid}" data-tutorial-player="${playerIndex}" aria-label="Sélectionner ${escapeHtml(card.name)}"></button>` : ""}
      ${imageUrl ? `
        <button class="card-visual card-effect-forbid-host card-image-zoom-trigger" type="button" data-image-zoom="${escapeHtml(imageUrl)}" data-image-label="${escapeHtml(`${card.name} - ${card.subtitle ?? card.family}`)}" aria-label="Agrandir ${escapeHtml(card.name)}">
          <img src="${imageUrl}" alt="${card.name} - ${card.subtitle ?? card.family}" />
          ${showForbidEffect ? `<img class="forbid-effect-overlay" src="${FORBID_IMAGE}" alt="Effet annulé" />` : ""}
        </button>
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
        <div class="effect ${showForbidEffect ? "effect-forbid-host" : ""}">
          ${card.effect}
          ${showForbidEffect ? `<img class="forbid-effect-overlay fallback" src="${FORBID_IMAGE}" alt="Effet annulé" />` : ""}
        </div>
        ${isRemise(card) ? '<div class="boost-box remise-note">Remise : ne termine pas le tour</div>' : `<div class="boost-box">Boost : ${card.boostPower} puissance · ${card.boostPrecision} précision</div>`}
      `}
      ${imageUrl && hasDynamicStats ? `
        <div class="visual-stats">
          ${cost !== card.cost ? `<span>Coût actuel ${cost}</span>` : ""}
          ${stats.precision !== card.precision ? `<span>Précision actuelle ${stats.precision}</span>` : ""}
          ${stats.placement !== card.placement || state.turnPlacement[playerIndex] ? `<span>Placement actuel ${stats.placement}${state.turnPlacement[playerIndex] ? ` + ${state.turnPlacement[playerIndex]}` : ""}</span>` : ""}
        </div>
      ` : ""}
      ${renderCardAssistPreview(playerIndex, card, cost, boostAllowed)}
      <div class="card-actions ${isRemise(card) ? "remise-actions" : ""}">
        ${isRemise(card) ? `
          <button class="play-button${riskyPlayClass}" type="button" data-player="${playerIndex}" data-play="${card.uid}" data-mode="effect" ${effectModeAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "effect", false)}<span>${cost} END</span><strong>Effet</strong></button>
          <button class="boost-button${riskyRemiseClass}" type="button" data-player="${playerIndex}" data-play="${card.uid}" data-mode="placement" ${placementModeAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "placement", false)}<span>${cost} END</span><strong>Remise</strong></button>
        ` : `
          <button class="play-button${riskyPlayClass}${tutorialFocusClass("play", playerIndex, card.id)}" type="button" data-player="${playerIndex}" data-play="${card.uid}" ${normalAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "normal", false)}<span>${cost} END</span><strong>Jouer</strong></button>
          <button class="boost-button${tutorialFocusClass("boost", playerIndex, card.id)}" type="button" data-player="${playerIndex}" data-boost="${card.uid}" ${boostAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "boost", true)}Boost</button>
        `}
      </div>
      ${(placementIssue || remisePlacementIssue) && !state.mandatoryPlacement ? '<div class="stat placement boost-warning">Placement total insuffisant : <strong>BOOST</strong> adverse possible</div>' : ""}
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

function formatLogLine(line) {
  return escapeHtml(line)
    .replace(/\[\[tc-effect-blue:([^\]]+)\]\]/g, '<strong class="log-effect-blue">$1</strong>')
    .replace(/\[\[tc-effect-rose:([^\]]+)\]\]/g, '<strong class="log-effect-rose">$1</strong>');
}

function actionLogEntryType(line) {
  const normalized = String(line || "").toLowerCase();
  if (/gagne|victoire|bilan de l'échange|bilan de l’échange|score final|score du set|score du match|échange s'arrête|échange terminé|match terminé/.test(normalized)) return "result";
  if (/boost/.test(normalized)) return "boost";
  if (/ joue |joue /.test(normalized)) return "shot";
  if (/effet|active|défausse|pioche|récupère|retourne sa carte|bonus/.test(normalized)) return "effect";
  if (/contrainte|impossible|ne peut pas|insuffisant/.test(normalized)) return "warning";
  return "system";
}

function actionLogEntryLabel(type) {
  return {
    result: "Résultat",
    boost: "BOOST",
    shot: "Coup joué",
    effect: "Effet",
    warning: "Attention",
    system: "Information",
  }[type] || "Information";
}

function actionLogCardThumbnail(line) {
  const normalized = String(line || "").toLocaleLowerCase("fr");
  const card = CARD_LIBRARY.find((item) => normalized.includes(String(item.name || "").toLocaleLowerCase("fr")));
  const imageUrl = card ? CARD_IMAGES[card.id] : null;
  return imageUrl ? `<img class="action-log-card-thumbnail" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(card.name)}" />` : "";
}

function renderActionLogEntry(line, index, compact = false) {
  const type = actionLogEntryType(line);
  const thumbnail = compact ? "" : actionLogCardThumbnail(line);
  const shot = String(line || "").match(/^(.+?) joue (.+?) : (.+)$/);
  const exchangeResult = String(line || "").startsWith("Bilan de l’échange|") ? String(line).split("|").slice(1) : null;
  const content = exchangeResult
    ? `<strong class="action-log-result-title">${escapeHtml(exchangeResult[0] || "Résultat de l’échange")}</strong><div class="action-log-result-details">${exchangeResult.slice(1).map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}</div>`
    : shot
      ? `<strong class="action-log-player">${escapeHtml(shot[1])}</strong><span class="action-log-action">${escapeHtml(shot[2])}</span><p>${formatLogLine(shot[3])}</p>`
      : `<p>${formatLogLine(line)}</p>`;
  return `
    <article class="action-log-entry ${type}${compact ? " compact" : ""}${thumbnail ? " has-card" : ""}">
      <div class="action-log-marker" aria-hidden="true"></div>
      ${thumbnail}
      <div class="action-log-entry-copy">
        <span class="action-log-type">${actionLogEntryLabel(type)}</span>
        ${content}
      </div>
      <span class="action-log-order" aria-label="Action ${index + 1}">${index + 1}</span>
    </article>
  `;
}

function renderLog() {
  els.log.classList.toggle("tutorial-focus-target", Boolean(tutorialFocusClass("history", null)));
  const latestEntry = state.log.find((line) => actionLogEntryType(line) !== "system") || state.log[0];
  els.log.innerHTML = `
    <div class="action-log-header">
      <div><span>Déroulé de l’échange</span><strong>Dernière action importante</strong></div>
      <small>${state.log.length} événement${state.log.length > 1 ? "s" : ""}</small>
    </div>
    <div class="action-log-list">
      ${latestEntry ? renderActionLogEntry(latestEntry, 0, true) : '<p class="action-log-empty">L’échange va commencer.</p>'}
    </div>
    ${state.log.length ? '<button class="action-log-open-button" type="button" data-open-full-action-log>Voir tout le déroulé</button>' : ""}
  `;
  els.log.querySelector("[data-open-full-action-log]")?.addEventListener("click", openFullActionLogDialog);
}

function closeFullActionLogDialog() {
  document.querySelector(".action-log-backdrop")?.remove();
}

function openFullActionLogDialog() {
  closeFullActionLogDialog();
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop action-log-backdrop";
  backdrop.innerHTML = `
    <section class="action-log-dialog" role="dialog" aria-modal="true" aria-labelledby="actionLogDialogTitle">
      <header>
        <div><p class="label">Historique complet</p><h2 id="actionLogDialogTitle">Déroulé de l’échange</h2></div>
        <button class="small-button" type="button" data-close-action-log>Fermer</button>
      </header>
      <div class="action-log-dialog-list">
        ${state.log.length ? state.log.map((line, index) => renderActionLogEntry(line, index)).join("") : '<p class="action-log-empty">Aucune action enregistrée.</p>'}
      </div>
    </section>
  `;
  backdrop.querySelector("[data-close-action-log]")?.addEventListener("click", closeFullActionLogDialog);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeFullActionLogDialog();
  });
  document.body.appendChild(backdrop);
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
      <p>${escapeHtml(displayPlayerName(player))} booste <strong>${card.name}</strong>. Sélectionne une carte de la main à glisser dessous.</p>
      <button class="small-button" type="button" data-close-modal>Annuler</button>
      <div class="choice-grid">
        ${choices.map((choice) => `
          <button class="choice-card" type="button" data-sacrifice="${choice.uid}">
            ${tutorialSacrificeCue(choice)}
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
      const boostCard = player.hand.find((item) => item.uid === cardUid);
      const sacrificeCard = player.hand.find((item) => item.uid === sacrificeUid);
      state.pendingBoost = null;
      playCard(playerIndex, cardUid, true, sacrificeUid);
      completeTutorialAction({ kind: "play", playerIndex, cardId: boostCard?.id, mode: "boost", sacrificeCardId: sacrificeCard?.id });
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
  const { playerIndex, mode } = state.pendingCoachChoice;
  if (SERVER_SYNC.enabled && playerIndex !== SERVER_SYNC.seat) return;
  if (SOLO_AI.enabled && playerIndex === SOLO_AI.playerIndex) return;
  const player = state.players[playerIndex];
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop coach-choice-backdrop";
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir une carte non distribuée">
      <h2>${characterOf(player).name}</h2>
      <p>${mode === "discardHandForPower" ? `Choisis une carte de la main de ${escapeHtml(displayPlayerName(player))} à supprimer pour gagner 3 puissance.` : `Choisis une carte non distribuée à ajouter à la main de ${escapeHtml(displayPlayerName(player))}.`}</p>
      <button class="small-button" type="button" data-cancel-choice>Annuler et revenir au début du tour</button>
      <div class="choice-grid">
        ${(mode === "discardHandForPower" ? player.hand : state.deck).map((choice) => `
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
  const { playerIndex, opponentIndex, shotsOnly } = state.pendingRemoveChoice;
  if (SERVER_SYNC.enabled && playerIndex !== SERVER_SYNC.seat) return;
  if (SOLO_AI.enabled && playerIndex === SOLO_AI.playerIndex) return;
  const choices = removableOpponentCards(opponentIndex, Boolean(shotsOnly));
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop remove-choice-backdrop";
  backdrop.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Choisir une carte adverse à supprimer">
      <h2>Supprimer une carte adverse</h2>
      <p>Choisis une carte engagée par ${escapeHtml(playerName(opponentIndex))} à retirer de l'échange.</p>
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

function serverSyncStateEndpoint() {
  if (SERVER_SYNC.friendlyMatch) {
    return `/api/friendly-tournaments/${encodeURIComponent(FRIENDLY_TOURNAMENT.id)}/matches/${encodeURIComponent(SERVER_SYNC.roomId)}/state`;
  }
  return `/api/rooms/${encodeURIComponent(SERVER_SYNC.roomId)}/state`;
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
    const body = SERVER_SYNC.friendlyMatch
      ? {
        participantId: FRIENDLY_TOURNAMENT.participantId,
        token: FRIENDLY_TOURNAMENT.token,
        baseRevision: SERVER_SYNC.revision,
        state: JSON.parse(payload),
      }
      : { token: SERVER_SYNC.token, state: JSON.parse(payload) };
    const response = await fetch(serverSyncStateEndpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status === 409 && SERVER_SYNC.friendlyMatch) {
      SERVER_SYNC.lastSent = "";
      SERVER_SYNC.localDirty = false;
      await pollServerState();
      return;
    }
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
  const pollingFriendlyMatch = SERVER_SYNC.friendlyMatch;
  const endpoint = serverSyncStateEndpoint();
  const wasReady = SERVER_SYNC.ready;
  try {
    const query = pollingFriendlyMatch
      ? `participantId=${encodeURIComponent(FRIENDLY_TOURNAMENT.participantId || "")}&token=${encodeURIComponent(FRIENDLY_TOURNAMENT.token || "")}&revision=${SERVER_SYNC.revision}`
      : `token=${encodeURIComponent(SERVER_SYNC.token)}&revision=${SERVER_SYNC.revision}`;
    const response = await fetch(`${endpoint}?${query}`);
    if (response.status === 404) {
      if (pollingFriendlyMatch || FRIENDLY_TOURNAMENT.enabled) {
        await pollFriendlyTournament();
        return;
      }
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
    if (data.state && (!SERVER_SYNC.ready || data.revision !== SERVER_SYNC.revision)) {
      SERVER_SYNC.revision = data.revision;
      SERVER_SYNC.ready = true;
      SERVER_SYNC.lastSent = JSON.stringify(data.state);
      importSyncState(data.state);
      applyOnlinePlayersFromRoom(data.players ?? SERVER_SYNC.players);
      if (!wasReady) queueConfrontationIntro();
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
  AI_CLUB_HOUSE.difficulty = normalizeAiDifficulty(AI_CLUB_HOUSE.difficulty);
  AI_CLUB_HOUSE.bonus = normalizeAiBonusLevel(AI_CLUB_HOUSE.bonus);
  updateMenuSelection();
  renderAiClubHouse();
  renderAuthState();
  renderHomeNewsSection();
  updateAccessControls();
  loadAuthState();
  const toggleAccountPanel = () => setLobbyAccountPanelOpen(els.lobbyAccountPanel?.classList.contains("hidden"));
  els.lobbySettingsButton?.addEventListener("click", toggleAccountPanel);
  els.lobbyUserButton?.addEventListener("click", toggleAccountPanel);
  els.globalPlayerProfileButton?.addEventListener("click", () => {
    if (visibleScreenDestination() !== "game" && AUTH_STATE.user) showProfileScreen();
  });
  els.lobbyModeCards?.forEach((card) => {
    card.addEventListener("click", () => showLobbySection(card.dataset.openLobbySection));
  });
  els.backToHomeButton?.addEventListener("click", showMenuScreen);
  els.openNewsArchiveButton?.addEventListener("click", showNewsArchiveScreen);
  els.backFromNewsArchiveButton?.addEventListener("click", showMenuScreen);
  els.loginButton?.addEventListener("click", loginAccount);
  els.registerButton?.addEventListener("click", registerAccount);
  els.forgotPasswordButton?.addEventListener("click", requestPasswordReset);
  els.confirmResetPasswordButton?.addEventListener("click", confirmPasswordReset);
  els.backToLoginFromResetButton?.addEventListener("click", () => {
    window.history.replaceState({}, "", window.location.pathname);
    showMenuScreen();
  });
  els.logoutButton?.addEventListener("click", logoutAccount);
  els.profileButton?.addEventListener("click", showProfileScreen);
  els.redeemProCodeButton?.addEventListener("click", redeemProCode);
  els.proCodeInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") redeemProCode();
  });
  els.manageUsersButton?.addEventListener("click", showAdminScreen);
  els.backToLobbyFromAdminButton?.addEventListener("click", showMenuScreen);
  els.adminExportHumanMatchesButton?.addEventListener("click", exportHumanMatchLogsFile);
  els.generateProCodesButton?.addEventListener("click", generateProCodes);
  els.adminPrevPageButton?.addEventListener("click", () => loadAdminUsers(AUTH_STATE.adminPage - 1));
  els.adminNextPageButton?.addEventListener("click", () => loadAdminUsers(AUTH_STATE.adminPage + 1));
  els.adminNextWeekButton?.addEventListener("click", adminAdvanceCircuitWeek);
  els.adminRestartSeasonButton?.addEventListener("click", adminRestartCurrentSeason);
  els.adminRestartSeasonOneButton?.addEventListener("click", adminRestartSeasonOne);
  document.querySelectorAll("[data-ranking-sort]").forEach((button) => {
    button.addEventListener("click", () => changeRankingSort(button.dataset.rankingSort));
  });
  els.openRankingPageButton?.addEventListener("click", showRankingScreen);
  els.circuitProfileButton?.addEventListener("click", () => showProfileScreen());
  els.backToLobbyFromRankingButton?.addEventListener("click", () => showLobbySection("circuit"));
  els.rankingHomeButton?.addEventListener("click", showMenuScreen);
  els.rankingPrevPageButton?.addEventListener("click", () => loadRanking(Math.max(1, AUTH_STATE.rankingPage - 1)));
  els.rankingNextPageButton?.addEventListener("click", () => loadRanking(Math.min(Number(AUTH_STATE.ranking?.totalPages || 1), AUTH_STATE.rankingPage + 1)));
  els.openCircuitInfoButton?.addEventListener("click", showCircuitInfoScreen);
  els.backToLobbyFromCircuitInfoButton?.addEventListener("click", () => showLobbySection("circuit"));
  els.circuitInfoHomeButton?.addEventListener("click", showMenuScreen);
  els.openAcademyInfoButton?.addEventListener("click", showAcademyInfoScreen);
  els.backToLobbyFromAcademyInfoButton?.addEventListener("click", () => showLobbySection("training"));
  els.academyInfoHomeButton?.addEventListener("click", showMenuScreen);
  els.backToLobbyFromProfileButton?.addEventListener("click", returnFromProfile);
  els.profileHomeButton?.addEventListener("click", showMenuScreen);
  els.backToProfileFromCharacterButton?.addEventListener("click", showProfileScreen);
  els.backToLobbyFromCharacterButton?.addEventListener("click", showMenuScreen);
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
  document.querySelectorAll("[data-tutorial-module]").forEach((button) => {
    button.addEventListener("click", () => startTutorial(button.dataset.tutorialModule));
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target instanceof Element ? event.target.closest("[data-open-tutorial-modules]") : null;
    if (!trigger) return;
    event.preventDefault();
    showTutorialModulesScreen();
  });
  els.backToTrainingFromTutorialButton?.addEventListener("click", () => showLobbySection("training"));
  els.tutorialModulesHomeButton?.addEventListener("click", showMenuScreen);
  els.openAiClubHouseButton?.addEventListener("click", showAiClubHouseScreen);
  els.aiClubHouseHomeButton?.addEventListener("click", showMenuScreen);
  els.aiClubHouseLogoButton?.addEventListener("click", showMenuScreen);
  els.startAiClubHouseButton?.addEventListener("click", startAiClubHouseCompetition);
  els.resumeAiClubHouseSaveButton?.addEventListener("click", resumeAiClubHouseSave);
  els.deleteAiClubHouseSaveButton?.addEventListener("click", deleteAiClubHouseSave);
  els.aiClubHouseScreen?.addEventListener("click", (event) => {
    const button = event.target instanceof Element
      ? event.target.closest("[data-ai-club-setting]")
      : null;
    if (!(button instanceof HTMLButtonElement) || button.disabled) return;
    updateAiClubHouseSetting(button.dataset.aiClubSetting, button.dataset.aiClubValue);
  });
  els.refreshLobbyButton?.addEventListener("click", refreshLobbyRooms);
  els.createLobbyRoomButton?.addEventListener("click", createFriendlyTournament);
  els.createFriendlyTournamentButton?.addEventListener("click", createFriendlyTournament);
  window.clearInterval(MENU_STATE.lobbyTimer);
  MENU_STATE.lobbyTimer = window.setInterval(() => {
    const onlineSection = document.querySelector("[data-lobby-section-panel='online']");
    if (!els.lobbySectionScreen?.classList.contains("hidden") && !onlineSection?.classList.contains("hidden")) refreshLobbyRooms();
  }, 3500);
  document.addEventListener("click", (event) => {
    if (els.lobbyAccountPanel?.classList.contains("hidden")) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("#lobbyAccountPanel, #lobbySettingsButton, #lobbyUserButton, [data-open-lobby-section]")) return;
    setLobbyAccountPanelOpen(false);
  });
  els.lobbyAccountPanel?.addEventListener("mouseleave", () => {
    if (AUTH_STATE.user) setLobbyAccountPanelOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setLobbyAccountPanelOpen(false);
  });
  document.querySelectorAll(".menu-screen .brand-logo").forEach((logo) => {
    if (logo.closest("#friendlyLobbyLogoButton, #aiClubHouseLogoButton, .direct-home-button")) return;
    logo.setAttribute("role", "button");
    logo.setAttribute("tabindex", "0");
    logo.addEventListener("click", showMenuScreen);
    logo.addEventListener("keydown", (event) => {
      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        showMenuScreen();
      }
    });
  });
  document.querySelectorAll(".direct-home-button").forEach((button) => button.addEventListener("click", showMenuScreen));
  const navigationObserver = new MutationObserver(updateGlobalPlayerDock);
  [els.menuScreen, els.lobbySectionScreen, els.adminScreen, els.rankingScreen, els.circuitInfoScreen, els.academyInfoScreen, els.tutorialModulesScreen, els.profileScreen, els.characterScreen, els.friendlyLobbyScreen, els.aiClubHouseScreen, els.gameApp, els.mobileGameApp]
    .filter(Boolean)
    .forEach((screen) => navigationObserver.observe(screen, { attributes: true, attributeFilter: ["class"] }));
  updateGlobalPlayerDock();
  if (resetTokenFromUrl()) showResetPasswordScreen();
}

els.newGameButton?.addEventListener("click", newGame);
els.returnLobbyButton?.addEventListener("click", () => {
  if (FRIENDLY_TOURNAMENT.enabled && state.gameOver && state.setMatch?.matchOver) {
    returnFriendlyMatchToClubHouse();
    return;
  }
  openReturnLobbyDialog();
});
els.gameLogoButton?.addEventListener("click", openReturnLobbyDialog);
els.gameAssistButton?.addEventListener("click", () => setGameAssistPanelOpen(!GAMEPLAY_ASSIST.panelOpen));
els.gamePreviewToggle?.addEventListener("change", () => {
  GAMEPLAY_ASSIST.preview = Boolean(els.gamePreviewToggle.checked);
  localStorage.setItem("tennisLightAssistPreview", String(GAMEPLAY_ASSIST.preview));
  render();
});
els.gameInformationToggle?.addEventListener("change", () => {
  GAMEPLAY_ASSIST.information = Boolean(els.gameInformationToggle.checked);
  localStorage.setItem("tennisLightAssistInformation", String(GAMEPLAY_ASSIST.information));
  render();
});
els.friendlyLobbyHomeButton?.addEventListener("click", () => leaveFriendlyTournamentLobby({ destination: "online" }));
els.friendlyLobbyDirectHomeButton?.addEventListener("click", () => leaveFriendlyTournamentLobby({ destination: "home" }));
els.friendlyLobbyLogoButton?.addEventListener("click", () => leaveFriendlyTournamentLobby({ destination: "home" }));
els.spectatorQuitButton?.addEventListener("click", () => quitFriendlySpectator(false));
els.adminGameToolsButton?.addEventListener("click", () => {
  setAdminGameToolsOpen(els.adminGameToolsPanel?.classList.contains("hidden"));
});
els.adminSimulateScoreButton?.addEventListener("click", () => runAdminGameTool(simulateAdminMatchScore));
els.revealAiButton?.addEventListener("click", () => runAdminGameTool(toggleRevealAiCards));
els.exportLogsButton?.addEventListener("click", () => runAdminGameTool(exportLogsFile));
els.exportHumanMatchesButton?.addEventListener("click", () => runAdminGameTool(exportHumanMatchLogsFile));
els.rallyFullLogButton?.addEventListener("click", openFullActionLogDialog);
document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!els.adminGameToolsPanel?.classList.contains("hidden") && !target?.closest("#adminGameTools")) setAdminGameToolsOpen(false);
  if (!els.gameAssistPanel?.classList.contains("hidden") && !target?.closest("#gameAssistTools")) setGameAssistPanelOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setAdminGameToolsOpen(false);
    setGameAssistPanelOpen(false);
    closeFullActionLogDialog();
  }
});
document.addEventListener("click", (event) => {
  if (SPECTATOR_MODE.enabled) return;
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  const playButton = target?.closest("[data-play]");
  if (playButton instanceof HTMLButtonElement && !playButton.disabled) {
    event.preventDefault();
    const playerIndex = Number(playButton.dataset.player);
    const card = state.players[playerIndex]?.hand.find((item) => item.uid === playButton.dataset.play);
    const mode = playButton.dataset.mode ?? "normal";
    if (!tutorialAllowsPlay(playerIndex, card, mode, false)) return;
    playCard(playerIndex, playButton.dataset.play, false, null, mode);
    completeTutorialAction({ kind: "play", playerIndex, cardId: card?.id, mode });
    return;
  }
  const boostButton = target?.closest("[data-boost]");
  if (boostButton instanceof HTMLButtonElement && !boostButton.disabled) {
    event.preventDefault();
    const playerIndex = Number(boostButton.dataset.player);
    const card = state.players[playerIndex]?.hand.find((item) => item.uid === boostButton.dataset.boost);
    if (!tutorialAllowsPlay(playerIndex, card, "boost", true)) return;
    openBoostModal(playerIndex, boostButton.dataset.boost);
    return;
  }
  if (target?.closest("[data-force-ai-turn]")) {
    forceSoloAITurn();
  }
});

function mobileLocalPlayerIndex() {
  if (SERVER_SYNC.enabled && Number.isInteger(SERVER_SYNC.seat)) return SERVER_SYNC.seat;
  if (SOLO_AI.enabled) return opponentOf(SOLO_AI.playerIndex);
  return 0;
}

function mobileSetScoreState(playerIndex) {
  const opponentIndex = opponentOf(playerIndex);
  const completed = Array.isArray(state.setMatch?.completedScores) ? state.setMatch.completedScores : [];
  const targetSets = Math.max(1, Number(state.setMatch?.targetSets || 1));
  const maximumSets = (targetSets * 2) - 1;
  const sets = completed.map((score) => {
    const playerScore = Number(score?.[playerIndex] || 0);
    const opponentScore = Number(score?.[opponentIndex] || 0);
    return {
      player: playerScore,
      opponent: opponentScore,
      winner: playerScore > opponentScore ? "PLAYER" : "OPPONENT",
    };
  });
  if (!state.setMatch?.setOver && Array.isArray(state.setMatch?.score)) {
    sets.push({
      player: Number(state.setMatch.score[playerIndex] || 0),
      opponent: Number(state.setMatch.score[opponentIndex] || 0),
      winner: null,
    });
  }
  while (sets.length < maximumSets) sets.push({ player: null, opponent: null, winner: null });
  return sets.slice(0, maximumSets);
}

function mobilePlayerSummary(playerIndex) {
  const player = state.players[playerIndex];
  return {
    name: displayPlayerName(player),
    characterName: player?.name || "",
    artwork: PROFILE_CHARACTER_IMAGES[player?.characterId]
      || CHARACTER_IMAGES[player?.characterId]?.[player?.characterSide || 0]
      || CHARACTER_IMAGES.coachUnknown[0],
    power: Number(player?.power || 0),
    endurance: Number(player?.endurance || 0),
    handCount: Number(player?.hand?.length || 0),
    isActive: state.activePlayer === playerIndex && !state.gameOver,
  };
}

let mobileSelectedCardUid = null;
let mobilePlaySubmissionLocked = false;

function mobileCardUnavailableReason(playerIndex, card) {
  if (state.gameOver) return "L’échange est terminé.";
  if (playerIndex !== state.activePlayer) return "Attendez votre tour pour jouer cette carte.";
  if (!canUseSeat(playerIndex)) return SERVER_SYNC.enabled
    ? "Cette carte appartient à l’autre joueur."
    : "Cette carte ne peut pas être jouée pendant le tour de l’IA.";
  const player = state.players[playerIndex];
  const cost = effectiveCost(player, card);
  if (!canAfford(player, card)) return `Endurance insuffisante : ${cost} requise, ${player.endurance} disponible.`;
  if (!satisfiesFamilyLimit(player, card)) return `Type incompatible : jouez ${player.limitedFamilies.join(" ou ")}.`;
  if (!isRemise(card) && !satisfiesReturnServiceRestriction(card)) return "Retour de service : Volée et Smash sont interdits.";
  const jokerAnswersBoost = card.effectType === "jokerResponse" && state.mandatoryPlacementReason === "boost";
  if (!isRemise(card) && state.mandatoryPlacement && !hasPlacementForPrevious(playerIndex, card) && !jokerAnswersBoost) {
    return `Placement insuffisant : ${totalTurnPlacement(playerIndex, card)} obtenu, ${state.lastCard?.precision || 0} requis.`;
  }
  if (state.tutorial.active) {
    const action = tutorialExpectedAction();
    const mode = isRemise(card) ? "effect" : "normal";
    const selectionAllowed = action?.kind === "selectCard"
      && action.playerIndex === playerIndex
      && action.cardId === card.id;
    const playAllowed = action?.kind === "play"
      && action.playerIndex === playerIndex
      && action.cardId === card.id
      && action.mode === mode;
    if (!selectionAllowed && !playAllowed) return "Le tutoriel demande une autre action.";
  }
  return null;
}

function mobileCardPreview(playerIndex, card) {
  const player = state.players[playerIndex];
  const stats = getCardStats(player, card, false);
  const realCost = effectiveCost(player, card);
  const resultingPlacement = totalTurnPlacement(playerIndex, card, false);
  const appliedBonuses = [];
  if (realCost < card.cost) appliedBonuses.push(`Réduction de coût : -${card.cost - realCost} endurance`);
  if (realCost > card.cost) appliedBonuses.push(`Surcoût : +${realCost - card.cost} endurance`);
  if (stats.power !== card.power) appliedBonuses.push(`Puissance modifiée : ${card.power} → ${stats.power}`);
  if (stats.precision !== card.precision) appliedBonuses.push(`Précision modifiée : ${card.precision} → ${stats.precision}`);
  if (stats.placement !== card.placement) appliedBonuses.push(`Placement modifié : ${card.placement} → ${stats.placement}`);
  if (state.turnPlacement[playerIndex] > 0) appliedBonuses.push(`Placement déjà préparé : +${state.turnPlacement[playerIndex]}`);
  if (isNextEffectCanceledFor(playerIndex) && card.effectType) appliedBonuses.push("Effet annulé par l’adversaire");
  return {
    realCost,
    realPower: stats.power,
    effects: [card.effect || "Aucun effet"].filter(Boolean),
    resultingPlacement,
    appliedBonuses,
    playOptions: mobileCardPlayOptions(playerIndex, card),
  };
}

function mobileCardPlayOptions(playerIndex, card) {
  const player = state.players[playerIndex];
  if (!player || !card) return [];
  const option = (mode, label, boosted = false) => {
    const stats = getCardStats(player, card, boosted);
    return {
      mode,
      label,
      realCost: effectiveCost(player, card),
      realPower: stats.power,
      resultingPlacement: totalTurnPlacement(playerIndex, card, boosted),
      requiresSacrifice: boosted,
      sacrifices: boosted
        ? player.hand.filter((candidate) => candidate.uid !== card.uid).map((candidate) => ({
          id: candidate.uid,
          name: candidate.name,
          artwork: CARD_IMAGES[candidate.id] || CARD_BACK_IMAGE,
        }))
        : [],
    };
  };
  if (isRemise(card)) {
    return [
      canPlayEffectMode(playerIndex, card) ? option("effect", "Jouer en Effet") : null,
      canPlayNormal(playerIndex, card) ? option("placement", "Jouer en Remise") : null,
    ].filter(Boolean);
  }
  return [
    canPlayNormal(playerIndex, card) ? option("normal", "Jouer le coup") : null,
    canPlayBoost(playerIndex, card) ? option("boost", "Jouer en Boost", true) : null,
  ].filter(Boolean);
}

function selectMobileCard(cardUid) {
  const playerIndex = mobileLocalPlayerIndex();
  const card = state.players[playerIndex]?.hand.find((candidate) => candidate.uid === cardUid);
  if (!card) return { ok: false, reason: "Cette carte n’est plus dans votre main." };
  const unavailableReason = mobileCardUnavailableReason(playerIndex, card);
  if (unavailableReason) return { ok: false, reason: unavailableReason };
  mobileSelectedCardUid = card.uid;
  if (state.tutorial.active && tutorialExpectedAction()?.kind === "selectCard") {
    selectTutorialCard(playerIndex, card.uid);
  }
  window.dispatchEvent(new CustomEvent("tennis-light:match-render"));
  return { ok: true };
}

function cancelMobileCardSelection() {
  mobileSelectedCardUid = null;
  if (state.tutorial.active) state.tutorial.selectedCardUid = null;
  window.dispatchEvent(new CustomEvent("tennis-light:match-render"));
}

function mobileResolutionValues(playerIndex) {
  const opponentIndex = opponentOf(playerIndex);
  const snapshot = (index) => ({
    power: Number(state.players[index]?.power || 0),
    endurance: Number(state.players[index]?.endurance || 0),
    handCount: Number(state.players[index]?.hand?.length || 0),
  });
  return {
    player: snapshot(playerIndex),
    opponent: snapshot(opponentIndex),
  };
}

function mobileResolutionDeltas(before, after) {
  const labels = {
    power: "Puissance",
    endurance: "Endurance",
    handCount: "Cartes",
  };
  return ["player", "opponent"].flatMap((side) => (
    Object.keys(labels).map((metric) => {
      const delta = Number(after[side][metric] || 0) - Number(before[side][metric] || 0);
      return delta ? { side, metric, label: labels[metric], delta, value: after[side][metric] } : null;
    }).filter(Boolean)
  ));
}

function mobileNewResolutionMessages(previousFirstLog) {
  const messages = [];
  for (const line of state.log) {
    if (line === previousFirstLog) break;
    if (line && !messages.includes(line)) messages.push(line);
    if (messages.length >= 3) break;
  }
  if (state.effectNotice?.message && !messages.includes(state.effectNotice.message)) {
    messages.unshift(state.effectNotice.message);
  }
  return messages.slice(0, 3);
}

function mobilePlayedCardSummary(card, playerIndex) {
  if (!card) return null;
  const placement = Number(card.turnEndPlacement ?? card.turnPlacement ?? card.placement ?? 0);
  const consequenceParts = [];
  if (card.boosted) consequenceParts.push("Carte jouée en Boost");
  if (card.remiseMode === "effect") consequenceParts.push("Effet joué sans terminer le tour");
  if (card.remiseMode === "placement") consequenceParts.push("Placement préparé pour la fin du tour");
  if (placement) consequenceParts.push(`${placement} placement au total`);
  if (card.answeredBoostConstraint) consequenceParts.push("Réponse à un Boost");
  return {
    id: card.playedUid || card.uid,
    artwork: CARD_IMAGES[card.id] || CARD_BACK_IMAGE,
    name: card.name,
    owner: card.owner === playerIndex ? "PLAYER" : "OPPONENT",
    cost: Number(card.costPaid ?? card.cost ?? 0),
    power: Number(card.cardPowerGained ?? card.powerGained ?? 0),
    precision: Number(card.precision ?? 0),
    effect: card.effectApplied === false
      ? `${card.effect || "Aucun effet"} (annulé)`
      : card.effect || "Aucun effet",
    placement,
    consequence: consequenceParts.join(" · ") || "La confrontation est actualisée.",
  };
}

function mobileHistoryEntries() {
  return state.log.map((line, index) => {
    const normalized = String(line || "").toLocaleLowerCase("fr");
    const card = CARD_LIBRARY.find((item) => normalized.includes(String(item.name || "").toLocaleLowerCase("fr")));
    const isPlayedLine = /^.+ joue .+ :/.test(String(line || ""));
    const playedAction = card && isPlayedLine
      ? [...(state.actionLog || [])].reverse().find((entry) => entry.kind === "play_card" && entry.card?.id === card.id)
      : null;
    const playedCard = card && isPlayedLine
      ? state.players.flatMap((player) => player.played || []).reverse().find((entry) => entry.id === card.id)
      : null;
    const actualCost = Number(playedAction?.costPaid ?? playedCard?.costPaid ?? 0);
    const actualPower = Number(playedAction?.powerGained ?? playedCard?.powerGained ?? 0);
    const variationTypes = [
      /endurance/.test(normalized) || actualCost ? "Endurance" : null,
      /puissance/.test(normalized) || actualPower ? "Puissance" : null,
      /bonus|boost/.test(normalized) ? "Bonus" : null,
      /effet/.test(normalized) ? "Effet" : null,
    ].filter(Boolean);
    const variations = [
      actualCost ? `-${actualCost} endurance` : null,
      actualPower ? `+${actualPower} puissance` : null,
    ].filter(Boolean);
    return {
      id: `${state.actionLog?.length || 0}:${index}:${line}`,
      type: actionLogEntryType(line),
      label: actionLogEntryLabel(actionLogEntryType(line)),
      message: String(line || ""),
      variationTypes,
      variations,
      card: card ? {
        id: card.id,
        name: card.name,
        artwork: CARD_IMAGES[card.id] || CARD_BACK_IMAGE,
        cost: Number(card.cost || 0),
        power: Number(card.power || 0),
        precision: Number(card.precision || 0),
        placement: Number(card.placement || 0),
        effect: card.effect || "Aucun effet",
      } : null,
    };
  });
}

function mobileReturnToMenuInfo() {
  if (FRIENDLY_TOURNAMENT.enabled) {
    return {
      title: "Retourner au Club House ?",
      consequence: "La rencontre sera quittée. Une partie active peut être mise en pause ou compter comme forfait si elle n’est pas reprise à temps.",
    };
  }
  if (SERVER_SYNC.enabled) {
    return {
      title: "Quitter la partie en ligne ?",
      consequence: "Vous quitterez le salon en ligne et la partie en cours ne restera pas ouverte sur cet appareil.",
    };
  }
  return {
    title: "Retourner à l’accueil ?",
    consequence: "La partie en cours sera quittée et l’accueil sera affiché.",
  };
}

function confirmMobileReturnToMenu() {
  confirmReturnToLobby();
  return { ok: true };
}

function acknowledgeMobileOpponentCard(cardId) {
  if (!cardId) return { ok: false };
  window.dispatchEvent(new CustomEvent("tennis-light:match-render"));
  return {
    ok: true,
    cardId,
    currentCardId: state.latestPlayedCard?.playedUid || state.latestPlayedCard?.uid || null,
    synchronizedRevision: Number(SERVER_SYNC.revision || 0),
  };
}

function playSelectedMobileCard(intent = {}) {
  if (mobilePlaySubmissionLocked || !mobileSelectedCardUid) return false;
  const playerIndex = mobileLocalPlayerIndex();
  const card = state.players[playerIndex]?.hand.find((candidate) => candidate.uid === mobileSelectedCardUid);
  if (!card || mobileCardUnavailableReason(playerIndex, card)) return false;
  const availableOption = mobileCardPlayOptions(playerIndex, card)
    .find((option) => option.mode === intent.mode);
  if (!availableOption) return { ok: false, reason: "Ce mode de jeu n’est pas disponible." };
  const boosted = availableOption.mode === "boost";
  const sacrificeUid = boosted ? intent.sacrificeUid : null;
  if (boosted && !availableOption.sacrifices.some((candidate) => candidate.id === sacrificeUid)) {
    return { ok: false, reason: "Choisissez une carte à sacrifier pour le Boost." };
  }
  const mode = availableOption.mode === "placement" ? "placement" : availableOption.mode === "effect" ? "effect" : "normal";
  if (!tutorialAllowsPlay(playerIndex, card, mode, boosted)) return false;
  const before = mobileResolutionValues(playerIndex);
  const previousFirstLog = state.log[0] || null;
  const submittedCard = {
    id: card.uid,
    artwork: CARD_IMAGES[card.id] || CARD_BACK_IMAGE,
    name: card.name,
  };
  mobilePlaySubmissionLocked = true;
  mobileSelectedCardUid = null;
  try {
    playCard(playerIndex, card.uid, boosted, sacrificeUid, mode);
    completeTutorialAction({ kind: "play", playerIndex, cardId: card.id, mode });
    const resolvedCard = state.latestPlayedCard?.owner === playerIndex
      ? state.latestPlayedCard
      : state.players[playerIndex]?.played?.find((candidate) => candidate.uid === card.uid);
    const after = mobileResolutionValues(playerIndex);
    return {
      ok: true,
      resolutionId: resolvedCard?.playedUid || `${card.uid}:${state.actionLog?.length || 0}`,
      card: {
        ...submittedCard,
        id: resolvedCard?.playedUid || submittedCard.id,
        power: Number(resolvedCard?.cardPowerGained ?? resolvedCard?.powerGained ?? 0),
        effect: resolvedCard?.effect || card.effect || "",
      },
      deltas: mobileResolutionDeltas(before, after),
      messages: mobileNewResolutionMessages(previousFirstLog),
      before,
      after,
      synchronizedRevision: Number(SERVER_SYNC.revision || 0),
    };
  } finally {
    mobilePlaySubmissionLocked = false;
  }
}

function passMobileTurn() {
  const playerIndex = mobileLocalPlayerIndex();
  if (state.gameOver || playerIndex !== state.activePlayer || !canUseSeat(playerIndex)) return { ok: false };
  if (!tutorialAllowsPass()) return { ok: false, reason: "Le tutoriel demande une autre action." };
  pass(playerIndex);
  return { ok: true };
}

function endMobileTurn() {
  const playerIndex = mobileLocalPlayerIndex();
  if (!canEndTurn(playerIndex)) return { ok: false };
  endTurn(playerIndex);
  return { ok: true };
}

function getMobileMatchViewState() {
  const playerIndex = mobileLocalPlayerIndex();
  const opponentIndex = opponentOf(playerIndex);
  const player = state.players[playerIndex];
  const activeCard = state.latestPlayedCard;
  const activeCardSummary = mobilePlayedCardSummary(activeCard, playerIndex);
  let selectedCard = player?.hand?.find((card) => card.uid === mobileSelectedCardUid) || null;
  if (selectedCard && mobileCardUnavailableReason(playerIndex, selectedCard)) selectedCard = null;
  if (!selectedCard) mobileSelectedCardUid = null;
  return {
    phase: state.gameOver
      ? "MATCH_COMPLETE"
      : selectedCard ? "CARD_SELECTED"
        : state.activePlayer === playerIndex ? "PLAYER_TURN" : "OPPONENT_CARD_REVEAL",
    score: {
      sets: mobileSetScoreState(playerIndex),
      server: state.server === playerIndex ? "PLAYER" : "OPPONENT",
    },
    player: mobilePlayerSummary(playerIndex),
    opponent: mobilePlayerSummary(opponentIndex),
    confrontation: {
      playerPower: Number(player?.power || 0),
      opponentPower: Number(state.players[opponentIndex]?.power || 0),
      contextMessage: state.gameOver
        ? `Échange remporté par ${playerName(state.resultInfo?.winner)}`
        : `${displayPlayerName(activePlayer())} doit jouer`,
      winner: state.gameOver && Number.isInteger(state.resultInfo?.winner)
        ? state.resultInfo.winner === playerIndex ? "PLAYER" : "OPPONENT"
        : null,
    },
    hand: (player?.hand || []).map((card) => {
      const unavailableReason = mobileCardUnavailableReason(playerIndex, card);
      return {
        id: card.uid,
        artwork: CARD_IMAGES[card.id] || CARD_BACK_IMAGE,
        name: card.name,
        playable: !unavailableReason,
        unavailableReason,
        recommendedPlacement: false,
        requiredPlacement: Boolean(state.mandatoryPlacement && state.activePlayer === playerIndex),
      };
    }),
    selectedCardId: selectedCard?.uid || null,
    selectedCardPreview: selectedCard ? mobileCardPreview(playerIndex, selectedCard) : null,
    playSubmissionLocked: mobilePlaySubmissionLocked,
    turnActions: {
      canPass: !state.gameOver
        && state.activePlayer === playerIndex
        && canUseSeat(playerIndex)
        && tutorialAllowsPass()
        && (!hasPlayedThisTurn(playerIndex) || canEndTurn(playerIndex)),
      canEndTurn: canEndTurn(playerIndex),
    },
    activeCard: activeCardSummary ? {
      ...activeCardSummary,
      resolutionMessage: state.effectNotice?.message || "",
      synchronizedRevision: Number(SERVER_SYNC.revision || 0),
    } : null,
    bonuses: activeEffectBadges(playerIndex),
    history: mobileHistoryEntries(),
    returnToMenu: mobileReturnToMenuInfo(),
    lastPlayedCard: activeCardSummary,
  };
}

window.tennisLightMobileAdapter = {
  getViewState: getMobileMatchViewState,
  selectCard: selectMobileCard,
  cancelCardSelection: cancelMobileCardSelection,
  playSelectedCard: playSelectedMobileCard,
  passTurn: passMobileTurn,
  endTurn: endMobileTurn,
  acknowledgeOpponentCard: acknowledgeMobileOpponentCard,
  confirmReturnToMenu: confirmMobileReturnToMenu,
};

window.forceSoloAITurn = forceSoloAITurn;
window.tennisLightDebug = { CARD_LIBRARY, newGame, startTutorial, startSoloGame, startSetAiGame, startMatchMode, startTournamentMode, nextSetExchange, nextFullSet, startOnlineGame, pass, playCard, endTurn, restoreTurnSnapshot, getStoredMatchLogs, getStoredActionLogs, getStoredHumanMatchLogs, exportLogsFile, exportHumanMatchLogsFile, render, state };
window.addEventListener("pagehide", signalFriendlyTournamentPageExit);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) restoreFriendlyTournamentPresence();
});
newGame();
restoreLocalTutorialProgress(null);
initMenu();
initFriendlyTournament();
initServerSync();
window.clearInterval(PROFILE_ACTIVITY.timer);
PROFILE_ACTIVITY.timer = window.setInterval(publishProfileActivity, 1200);
publishProfileActivity();
