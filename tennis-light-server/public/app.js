const STARTING_ENDURANCE = 7;
const HAND_SIZE = 6;
const CARD_BACK_IMAGE = "assets/cards/Demo-TC-_0000_VERSO-CARTES.png";
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
};

const MENU_STATE = {
  selectedPlayerIndex: Number(localStorage.getItem("tennisLightSelectedPlayer") || 0),
  nickname: localStorage.getItem("tennisLightNickname") || "",
  espoirResolvedCharacterId: null,
  tournamentDifficulty: localStorage.getItem("tennisLightTournamentDifficulty") || "normal",
  lobbyTimer: null,
};

const AUTH_STATE = {
  user: null,
  loading: false,
  adminUsers: [],
  adminProCodes: [],
  adminPage: 1,
  adminTotalPages: 1,
  ranking: null,
  rankingPage: 1,
  competitions: null,
  profile: null,
};

const ROLE_LABELS = {
  free: "FREE",
  pro: "PRO",
  pro_plus: "PRO+",
  admin: "ADMIN",
};

const AI_DIFFICULTIES = ["normal", "champion", "hardcore"];
const AI_DIFFICULTY_LABELS = {
  normal: "NORMAL",
  champion: "CHAMPION",
  hardcore: "HARDCORE",
};

const EMPTY_TOURNAMENT = {
  active: false,
  visible: false,
  difficulty: "normal",
  weekly: false,
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
  aiFinalistCharacterId: null,
  currentMatch: null,
  championCharacterId: null,
  matches: [],
};

const MATCH_LOG_STORAGE_KEY = "tennisLightMatchLogs";
const ACTION_LOG_STORAGE_KEY = "tennisLightActionLogs";

const COACH_OPTIONS = ["coachJu", "coachMax", "coachCarla", "coachClem"];
const PROFILE_CHARACTER_OPTIONS = [...COACH_OPTIONS];
const PROFILE_CHARACTER_IMAGES = {
  tennisHope: "assets/cards/Demo-TC-_0027_Coach-INCONNU.png",
  coachJu: "assets/cards/Demo-TC-_0028_Coach-JU-LOBBY.png",
  coachMax: "assets/cards/Demo-TC-_0029_Coach-MAX-LOBBY.png",
  coachCarla: "assets/cards/Demo-TC-_0030_Coach-CARLA-LOBBY.png",
  coachClem: "assets/cards/Demo-TC-_0031_Coach-CLEM-LOBBY.png",
};
const HISTORIC_TOURNAMENT_PLAYERS = [
  "theoBriancourt",
  "alessandraConti",
  "saharaJackson",
  "kjellBlomqvist",
  "kojiIwata",
  "elianaMarquez",
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
];
const TOURNAMENT_CHARACTER_POOL = [...HISTORIC_TOURNAMENT_PLAYERS, ...NEW_TOURNAMENT_PLAYERS];
const FULL_PROFILE_CHARACTER_OPTIONS = [...COACH_OPTIONS, ...HISTORIC_TOURNAMENT_PLAYERS, ...NEW_TOURNAMENT_PLAYERS];
const HUMAN_TOURNAMENT_ENTRY = "__human__";
const SURFACE_SPECIALISTS = {
  grass: ["elianaMarquez", "kojiIwata"],
  hard: ["alessandraConti", "kjellBlomqvist"],
  clay: ["saharaJackson", "theoBriancourt"],
};
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

const HISTORIC_PERMANENT_BONUSES = [
  { id: "historicPermanentPlacement", label: "+1 placement permanent", placement: 1, precision: 0 },
  { id: "historicPermanentPrecision", label: "+1 précision permanente", placement: 0, precision: 1 },
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
};

const CHARACTER_IMAGES = {
  coachUnknown: [
    "assets/cards/Demo-TC-_0027_Coach-INCONNU.png",
    "assets/cards/Demo-TC-_0027_Coach-INCONNU.png",
  ],
  tennisHope: [
    "assets/ESPOIRRECTO.png",
    "assets/ESPOIRVERSO.png",
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
  theoBriancourt: [
    "assets/cards/_0023_BRIANCOURT.png",
    "assets/cards/_0022_BRIANCOURT-VERSO.png",
  ],
  alessandraConti: [
    "assets/cards/_0021_CONTI.png",
    "assets/cards/_0020_CONTI-VERSO.png",
  ],
  saharaJackson: [
    "assets/cards/_0019_JACKSON.png",
    "assets/cards/_0018_JACKSON-VERSO.png",
  ],
  kjellBlomqvist: [
    "assets/cards/_0017_BLOMQVIST.png",
    "assets/cards/_0016_BLOMQVIST-VERSO.png",
  ],
  kojiIwata: [
    "assets/cards/_0015_IWATA.png",
    "assets/cards/_0014_IWATA-VERSO.png",
  ],
  elianaMarquez: [
    "assets/cards/_0013_MARQUEZ.png",
    "assets/cards/_0012_MARQUEZ-VERSO.png",
  ],
  jonasFalkenried: [
    "assets/cards/TC-new-Jonas-Falkenried.png",
    "assets/cards/TC-new-Jonas-Falkenried-VERSO.png",
  ],
  yunaSeo: [
    "assets/cards/TC-new-Yuna-Seo.png",
    "assets/cards/TC-new-Yuna-Seo-VERSO.png",
  ],
  ikerSalvat: [
    "assets/cards/TC-new-Iker-Salvat.png",
    "assets/cards/TC-new-Iker-Salvat-VERSO.png",
  ],
  loganBrooks: [
    "assets/cards/TC-new-Logan-Brooks.png",
    "assets/cards/TC-new-Logan-Brooks-VERSO.png",
  ],
  kavyaSaran: [
    "assets/cards/TC-new-Kavya-Saran.png",
    "assets/cards/TC-new-Kavya-Saran-VERSO.png",
  ],
  zariaCampbell: [
    "assets/cards/TC-new-Zaria-Campbell.png",
    "assets/cards/TC-new-Zaria-Campbell-VERSO.png",
  ],
  renAoshima: [
    "assets/cards/TC-new-Ren-Aoshima.png",
    "assets/cards/TC-new-Ren-Aoshima-VERSO.png",
  ],
  yasmineElMansouri: [
    "assets/cards/TC-new-Yasmine-El-Mansouri.png",
    "assets/cards/TC-new-Yasmine-El-Mansouri-VERSO.png",
  ],
  daanVermeer: [
    "assets/cards/TC-new-Daan-Vermeer.png",
    "assets/cards/TC-new-Daan-Vermeer-VERSO.png",
  ],
  lukasEberhardt: [
    "assets/cards/TC-new-Lukas-Eberhardt.png",
    "assets/cards/TC-new-Lukas-Eberhardt-VERSO.png",
  ],
  milanVerhaegen: [
    "assets/cards/TC-new-Milan-Verhaegen.png",
    "assets/cards/TC-new-Milan-Verhaegen-VERSO.png",
  ],
};

const MATCH_RESULT_IMAGES = {
  coachJu: {
    win: "assets/cards/CoachJuWin.png",
    lose: "assets/cards/CoachJuLoose.png",
  },
  coachMax: {
    win: "assets/cards/CoachMaxWin.png",
    lose: "assets/cards/CoachMaxLoose.png",
  },
  coachCarla: {
    win: "assets/cards/CoachClaraWin.png",
    lose: "assets/cards/CoachClaraLoose.png",
  },
  coachClem: {
    win: "assets/cards/CoachClemWin.png",
    lose: "assets/cards/CoachClemLoose.png",
  },
  theoBriancourt: {
    win: "assets/cards/_0002_BRIANCOURT-WIN.png",
    lose: "assets/cards/_0003_BRIANCOURT-LOSE.png",
  },
  alessandraConti: {
    win: "assets/cards/_0006_CONTI-WIN.png",
    lose: "assets/cards/_0007_CONTI-LOSE.png",
  },
  saharaJackson: {
    win: "assets/cards/_0005_JACKSON-WIN.png",
    lose: "assets/cards/_0004_JACKSON-LOSE.png",
  },
  kjellBlomqvist: {
    win: "assets/cards/_0001_BLOMQVIST-WIN.png",
    lose: "assets/cards/_0000_BLOMQVIST-LOSE.png",
  },
  kojiIwata: {
    win: "assets/cards/_0008_IWATA-WIN.png",
    lose: "assets/cards/_0009_IWATA-LOSE.png",
  },
  elianaMarquez: {
    win: "assets/cards/_0011_MARQUEZ-WIN.png",
    lose: "assets/cards/_0010_MARQUEZ-LOSE.png",
  },
  jonasFalkenried: {
    win: "assets/cards/Illu-Jonas-Falkenried.png",
    lose: "assets/cards/Illu-Jonas-Falkenried.png",
  },
  yunaSeo: {
    win: "assets/cards/Illu-Yuna-Seo.png",
    lose: "assets/cards/Illu-Yuna-Seo.png",
  },
  ikerSalvat: {
    win: "assets/cards/Illu-Iker-Salvat.png",
    lose: "assets/cards/Illu-Iker-Salvat.png",
  },
  loganBrooks: {
    win: "assets/cards/Illu-Logan-Brooks.png",
    lose: "assets/cards/Illu-Logan-Brooks.png",
  },
  kavyaSaran: {
    win: "assets/cards/Illu-Kavya-Saran.png",
    lose: "assets/cards/Illu-Kavya-Saran.png",
  },
  zariaCampbell: {
    win: "assets/cards/Illu-Zaria-Campbell.png",
    lose: "assets/cards/Illu-Zaria-Campbell.png",
  },
  renAoshima: {
    win: "assets/cards/Illu-Ren-Aoshima.png",
    lose: "assets/cards/Illu-Ren-Aoshima.png",
  },
  yasmineElMansouri: {
    win: "assets/cards/Illu-Yasmine-El-Mansouri.png",
    lose: "assets/cards/Illu-Yasmine-El-Mansouri.png",
  },
  daanVermeer: {
    win: "assets/cards/Illu-Daan-Vermeer.png",
    lose: "assets/cards/Illu-Daan-Vermeer.png",
  },
  lukasEberhardt: {
    win: "assets/cards/Illu-Lukas-Eberhardt.png",
    lose: "assets/cards/Illu-Lukas-Eberhardt.png",
  },
  milanVerhaegen: {
    win: "assets/cards/Illu-Milan-Verhaegen.png",
    lose: "assets/cards/Illu-Milan-Verhaegen.png",
  },
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

const TUTORIAL_COACH_IMAGE = "assets/Coach-Ju-Speak.png";
const TUTORIAL_MAX_IMAGE = "assets/CoachMaxTRS.png";
const TUTORIAL_SCRIPT = [
  {
    id: "m1-1",
    type: "message",
    speaker: "ju",
    title: "Principes de base",
    text: "Bienvenue dans Tennis Courts Academy. Je suis Coach Ju, et je vais vous apprendre les bases de Tennis Courts.",
  },
  {
    id: "m1-2",
    type: "message",
    speaker: "ju",
    title: "Le but",
    text: "Dans Tennis Courts, vous jouez une succession d'échanges. Chaque échange permet de gagner des jeux. Les jeux permettent de gagner un set. Les sets permettent de gagner le match.",
  },
  {
    type: "message",
    speaker: "ju",
    title: "Gagner un échange",
    text: "Il existe deux façons de gagner un échange : marquer plus de points de puissance que l'adversaire, ou réussir une frappe boostée que l'adversaire ne peut pas renvoyer.",
  },
  {
    type: "message",
    speaker: "ju",
    title: "Deck d'académie",
    text: "Dans cette académie, nous allons apprendre avec un deck unique de 18 cartes. Dans la version complète de Tennis Courts, chaque joueur dispose de son propre deck, de 48 cartes, et d'une carte personnage.",
  },
  {
    id: "m1-5",
    type: "message",
    speaker: "ju",
    title: "Premier échange",
    text: "Pour commencer, nous allons jouer un échange simple. Vous incarnez l'Espoir du Tennis. Vous êtes au service.",
  },
  {
    id: "m2-setup",
    type: "message",
    speaker: "ju",
    title: "Jouer une carte",
    text: "Pour jouer une carte, vous devez payer son coût en endurance. Le coût est indiqué en haut à gauche de la carte.",
  },
  {
    id: "m2-power",
    type: "message",
    speaker: "ju",
    title: "Puissance",
    text: "Une fois la carte jouée, vous marquez immédiatement ses points de puissance. La puissance est indiquée en haut à droite.",
  },
  {
    id: "m2-service",
    type: "message",
    speaker: "ju",
    title: "Service",
    text: "Au service, vous pouvez jouer n'importe quelle carte. Mais si votre première carte n'est ni un Service, ni un Coup droit, l'adversaire pioche 1 carte. C'est la conséquence d'une mise en jeu moins solide.",
  },
  {
    id: "m2-play-service",
    type: "action",
    speaker: "ju",
    title: "À vous de servir",
    text: "Jouez la carte Service.",
    action: { kind: "play", playerIndex: 0, cardId: "service-coup-droit", mode: "normal" },
  },
  {
    id: "m2-after-service",
    type: "message",
    speaker: "ju",
    title: "Endurance et puissance",
    text: "Vous avez payé l'endurance de la carte. Votre endurance diminue, et votre puissance augmente.",
  },
  {
    id: "m2-precision-placement",
    type: "message",
    speaker: "ju",
    title: "Précision et placement",
    text: "La carte jouée indique aussi une précision et un placement. La précision représente la qualité du coup envoyé. Le placement représente la capacité à répondre au coup adverse.",
  },
  {
    id: "m2-coach-reply",
    type: "message",
    speaker: "ju",
    title: "Réponse adverse",
    text: "Je réponds avec assez de placement. L'échange continue normalement.",
    auto: { kind: "play", playerIndex: 1, cardId: "passing-1-1-4", mode: "normal" },
  },
  {
    id: "m3-setup",
    type: "message",
    speaker: "ju",
    title: "Gagner aux points",
    text: "Un échange continue tant que les deux joueurs jouent des cartes. À chaque carte jouée, on paie l'endurance, on marque la puissance, puis on résout l'effet éventuel.",
    auto: { kind: "scenario", scenario: "points" },
  },
  {
    id: "m3-player-card-1",
    type: "action",
    speaker: "ju",
    title: "Continuer l'échange",
    text: "Jouez une nouvelle carte.",
    action: { kind: "play", playerIndex: 0, cardId: "revers-3-3-3", mode: "normal" },
  },
  {
    id: "m3-coach-card",
    type: "message",
    speaker: "ju",
    title: "Réponse",
    text: "Je réponds avec une nouvelle carte.",
    auto: { kind: "play", playerIndex: 1, cardId: "volee-2-2-3", mode: "normal" },
  },
  {
    id: "m3-pass-rule",
    type: "message",
    speaker: "ju",
    title: "Passer",
    text: "À tout moment, un joueur peut décider de passer. Passer met immédiatement fin à l'échange.",
  },
  {
    id: "m3-pass-penalty",
    type: "message",
    speaker: "ju",
    title: "Pénalité",
    text: "Mais passer donne des points à l'adversaire. Le joueur qui passe donne autant de puissance qu'il lui reste d'endurance, avec un minimum de 2.",
  },
  {
    id: "m3-player-card-2",
    type: "action",
    speaker: "ju",
    title: "Dernier coup",
    text: "Jouez une troisième carte.",
    action: { kind: "play", playerIndex: 0, cardId: "coup-droit-2-2-2", mode: "normal" },
  },
  {
    id: "m3-coach-pass",
    type: "message",
    speaker: "ju",
    title: "Fin de l'échange",
    text: "Je passe. Je vous donne donc des points de puissance supplémentaires.",
    auto: { kind: "pass", playerIndex: 1 },
  },
  {
    id: "m3-score",
    type: "message",
    speaker: "ju",
    title: "Score de l'échange",
    text: "On compare maintenant les points de puissance. Le joueur qui en a le plus gagne l'échange. En cas d'égalité, le serveur gagne.",
  },
  {
    id: "m3-games",
    type: "message",
    speaker: "ju",
    title: "Jeux gagnés",
    text: "Une victoire aux points rapporte 2 jeux au vainqueur. Si le perdant termine à moins de 5 points de puissance d'écart, il marque tout de même 1 jeu. Dans cet exemple, le bilan de l'échange est donc de 2 jeux à 1.",
  },
  {
    id: "m4-setup",
    type: "message",
    speaker: "ju",
    title: "Victoire boostée",
    text: "Nous allons maintenant voir la frappe boostée. C'est la deuxième façon de gagner un échange.",
    auto: { kind: "scenario", scenario: "boost" },
  },
  {
    id: "m4-precision",
    type: "message",
    speaker: "ju",
    title: "Créer une occasion",
    text: "Quand un joueur envoie un coup, sa carte indique une précision. Pour répondre proprement, l'adversaire doit poser assez de placement.",
  },
  {
    id: "m4-coach-high-precision",
    type: "message",
    speaker: "ju",
    title: "Coup précis",
    text: "Je joue une carte avec une précision élevée.",
    auto: { kind: "play", playerIndex: 1, cardId: "lob-2-0-4", mode: "normal" },
  },
  {
    id: "m4-low-placement",
    type: "action",
    speaker: "ju",
    title: "Placement insuffisant",
    text: "Répondez avec une carte dont le placement est inférieur à la précision demandée.",
    action: { kind: "play", playerIndex: 0, cardId: "coup-droit-3-3-3", mode: "normal" },
  },
  {
    id: "m4-window",
    type: "message",
    speaker: "ju",
    title: "Fenêtre de boost",
    text: "Votre placement est insuffisant. Vous avez le droit de jouer cette carte, mais je peux maintenant booster mon prochain coup.",
  },
  {
    id: "m4-boost-explain",
    type: "message",
    speaker: "ju",
    title: "Booster",
    text: "Pour booster, on utilise la partie basse de la carte. Une carte boostée impose une réponse plus difficile. Booster coûte aussi une carte supplémentaire, sacrifiée sous la carte boostée.",
  },
  {
    id: "m4-coach-boost",
    type: "message",
    speaker: "ju",
    title: "Frappe boostée",
    text: "Je joue une carte boostée. Vous êtes maintenant sous contrainte de boost.",
    auto: { kind: "play", playerIndex: 1, cardId: "smash-4-2-1", mode: "boost", sacrificeCardId: "double" },
  },
  {
    id: "m4-boost-danger",
    type: "message",
    speaker: "ju",
    title: "Danger",
    text: "Cette fois, vous devez répondre avec un placement suffisant. Si vous passez, ou si vous ne pouvez pas répondre, vous perdez automatiquement l'échange. Une victoire par boost rapporte 3 jeux au vainqueur, et 0 jeu au perdant.",
  },
  {
    id: "m4-defend",
    type: "action",
    speaker: "ju",
    title: "Renvoyer le boost",
    text: "Répondez avec une carte dont le placement est suffisant.",
    action: { kind: "play", playerIndex: 0, cardId: "revers-5-4-1", mode: "normal" },
  },
  {
    id: "m4-summary",
    type: "message",
    speaker: "ju",
    title: "Boost retenu",
    text: "Vous avez renvoyé le boost. Retenez l'idée principale : un placement insuffisant peut donner une occasion de boost, et un boost non renvoyé fait perdre l'échange immédiatement.",
  },
  {
    id: "m5-setup",
    type: "message",
    speaker: "max",
    title: "Effet / Remise",
    text: "Dans cette deuxième partie, je vais vous montrer les cartes Effet / Remise.",
    auto: { kind: "scenario", scenario: "remise" },
  },
  {
    id: "m5-dual",
    type: "message",
    speaker: "max",
    title: "Deux façons de jouer",
    text: "Ces cartes sont particulières. Elles peuvent être jouées de deux manières différentes : pour leur effet, ou en remise.",
  },
  {
    id: "m5-effect",
    type: "action",
    speaker: "max",
    title: "Jouer pour l'effet",
    text: "Quand vous jouez une carte Effet / Remise pour son effet, le texte de la carte s'applique. Jouez une carte Effet / Remise pour son effet.",
    action: { kind: "play", playerIndex: 0, cardId: "retour-service", mode: "effect" },
  },
  {
    id: "m5-remise",
    type: "action",
    speaker: "max",
    title: "Jouer en remise",
    text: "Quand une carte Effet / Remise est jouée en remise, son effet ne s'applique pas. En revanche, son placement est ajouté au placement total de votre tour. Jouez une carte en remise.",
    action: { kind: "play", playerIndex: 0, cardId: "joker", mode: "placement" },
  },
  {
    id: "m5-finish-shot",
    type: "action",
    speaker: "max",
    title: "Additionner le placement",
    text: "Le placement de cette carte est maintenant préparé. Jouez une carte Coup pour terminer le tour.",
    action: { kind: "play", playerIndex: 0, cardId: "coup-droit-2-2-2", mode: "normal" },
  },
  {
    id: "m5-summary",
    type: "message",
    speaker: "max",
    title: "À retenir",
    text: "Votre placement total correspond au placement de vos remises, ajouté au placement de votre coup final. Si une carte Effet / Remise termine votre tour, on tient compte à la fois de son effet et de son placement.",
  },
  {
    id: "m6-setup",
    type: "message",
    speaker: "max",
    title: "Sortir d'un boost",
    text: "Comment sortir d'un BOOST avec un EFFET, comme par exemple le Joker.",
    auto: { kind: "scenario", scenario: "joker" },
  },
  {
    id: "m6-joker",
    type: "message",
    speaker: "max",
    title: "Le Joker",
    text: "Le Joker est une carte Effet / Remise très importante. Son rôle principal est de vous aider à survivre après une frappe boostée.",
  },
  {
    id: "m6-play-joker",
    type: "action",
    speaker: "max",
    title: "Annuler la contrainte",
    text: "Vous êtes sous contrainte de boost. Si vous jouez le Joker pour son effet, il annule cette contrainte de placement. Jouez le Joker pour son effet.",
    action: { kind: "play", playerIndex: 0, cardId: "joker", mode: "effect" },
  },
  {
    id: "m6-follow",
    type: "action",
    speaker: "max",
    title: "Poursuivre l'échange",
    text: "Le Joker annule la contrainte de placement du boost. Vous pouvez maintenant jouer une carte Coup sans devoir atteindre ce niveau de placement.",
    action: { kind: "play", playerIndex: 0, cardId: "coup-droit-2-2-2", mode: "normal" },
  },
  {
    id: "m6-summary",
    type: "message",
    speaker: "max",
    title: "Limite du Joker",
    text: "Attention : le Joker annule la contrainte de placement du boost, mais il n'annule pas les autres contraintes éventuelles. Par exemple, une limite à Revers, Lob ou Remise reste active.",
  },
  {
    id: "m7-setup",
    type: "message",
    speaker: "max",
    title: "Couleurs de boost",
    text: "Il existe une autre manière de booster : les couleurs de boost.",
    auto: { kind: "scenario", scenario: "color" },
  },
  {
    id: "m7-rules",
    type: "message",
    speaker: "max",
    title: "Contre-attaque",
    text: "Certaines cartes portent une couleur de coup. Certaines cartes peuvent booster immédiatement après certaines couleurs adverses. Dans ce cas, il n'est pas nécessaire que l'adversaire ait manqué son placement.",
  },
  {
    id: "m7-relations",
    type: "message",
    speaker: "max",
    title: "Relations principales",
    text: "Un Passing peut booster après un Smash, une Amortie ou une Volée. Une Volée peut booster après un Passing. Une Amortie peut booster après une autre Amortie ou un Passing. Un Lob peut booster après une Volée ou un Smash. Un Smash peut booster après un Lob.",
  },
  {
    id: "m7-boost",
    type: "action",
    speaker: "max",
    title: "Booster par couleur",
    text: "Je viens de jouer une Volée. Votre Lob peut booster immédiatement grâce à la couleur. Jouez le Lob en boost.",
    action: { kind: "play", playerIndex: 0, cardId: "lob-2-0-4", mode: "boost", sacrificeCardId: "double" },
  },
  {
    id: "done",
    type: "message",
    speaker: "max",
    title: "Tutoriel terminé",
    text: "Les couleurs créent des fenêtres de boost tactiques. Même un coup bien placé peut être contré si sa couleur ouvre une opportunité. Vous connaissez maintenant les bases principales de Tennis Courts Academy.",
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
  },
  tutorial: {
    active: false,
    stepIndex: 0,
    completed: false,
    autoCompletedIds: [],
  },
};

const els = {
  newGameButton: document.querySelector("#newGameButton"),
  modeInfoBadge: document.querySelector("#modeInfoBadge"),
  returnLobbyButton: document.querySelector("#returnLobbyButton"),
  menuScreen: document.querySelector("#menuScreen"),
  adminScreen: document.querySelector("#adminScreen"),
  rankingScreen: document.querySelector("#rankingScreen"),
  profileScreen: document.querySelector("#profileScreen"),
  characterScreen: document.querySelector("#characterScreen"),
  resetPasswordScreen: document.querySelector("#resetPasswordScreen"),
  gameApp: document.querySelector(".game-app"),
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
  adminUsersTable: document.querySelector("#adminUsersTable"),
  generateProCodesButton: document.querySelector("#generateProCodesButton"),
  adminProCodesList: document.querySelector("#adminProCodesList"),
  adminPrevPageButton: document.querySelector("#adminPrevPageButton"),
  adminNextPageButton: document.querySelector("#adminNextPageButton"),
  adminNextWeekButton: document.querySelector("#adminNextWeekButton"),
  adminPageInfo: document.querySelector("#adminPageInfo"),
  refreshRankingButton: document.querySelector("#refreshRankingButton"),
  openRankingPageButton: document.querySelector("#openRankingPageButton"),
  backToLobbyFromRankingButton: document.querySelector("#backToLobbyFromRankingButton"),
  backToLobbyFromProfileButton: document.querySelector("#backToLobbyFromProfileButton"),
  rankingList: document.querySelector("#rankingList"),
  rankingFullList: document.querySelector("#rankingFullList"),
  profileContent: document.querySelector("#profileContent"),
  characterContent: document.querySelector("#characterContent"),
  backToProfileFromCharacterButton: document.querySelector("#backToProfileFromCharacterButton"),
  weeklyCompetitionsList: document.querySelector("#weeklyCompetitionsList"),
  nicknameInput: document.querySelector("#nicknameInput"),
  aiDifficultyButton: document.querySelector("#aiDifficultyButton"),
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
  tournamentPanel: document.querySelector("#tournamentPanel"),
  tutorialOverlay: document.querySelector("#tutorialOverlay"),
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
  return characterNameFromId(selectedCharacterId());
}

function normalizeAiDifficulty(value) {
  return AI_DIFFICULTIES.includes(value) ? value : "normal";
}

function selectedTournamentDifficulty() {
  MENU_STATE.tournamentDifficulty = normalizeAiDifficulty(MENU_STATE.tournamentDifficulty);
  return MENU_STATE.tournamentDifficulty;
}

function tournamentDifficultyLabel(value = selectedTournamentDifficulty()) {
  return AI_DIFFICULTY_LABELS[normalizeAiDifficulty(value)];
}

function cycleTournamentDifficulty() {
  const current = selectedTournamentDifficulty();
  const next = AI_DIFFICULTIES[(AI_DIFFICULTIES.indexOf(current) + 1) % AI_DIFFICULTIES.length];
  MENU_STATE.tournamentDifficulty = next;
  localStorage.setItem("tennisLightTournamentDifficulty", next);
  updateTournamentDifficultyButton();
}

function updateTournamentDifficultyButton() {
  if (!els.aiDifficultyButton) return;
  const difficulty = selectedTournamentDifficulty();
  els.aiDifficultyButton.textContent = `IA tournoi : ${tournamentDifficultyLabel(difficulty)}`;
  els.aiDifficultyButton.dataset.difficulty = difficulty;
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

function normalizeUserRole(role) {
  return ROLE_LABELS[role] ? role : "free";
}

function currentUserRole() {
  return normalizeUserRole(AUTH_STATE.user?.role);
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
  return canAccessAllCharacters() ? FULL_PROFILE_CHARACTER_OPTIONS : PROFILE_CHARACTER_OPTIONS;
}

function updateAccessControls() {
  const hasProAccess = canAccessProFeatures();
  const role = currentUserRole();
  document.querySelectorAll("[data-required-role='pro']").forEach((section) => {
    section.classList.toggle("locked", !hasProAccess);
    section.querySelectorAll("button, select").forEach((control) => {
      control.disabled = !hasProAccess;
    });
    section.querySelectorAll(".access-note").forEach((note) => {
      note.classList.toggle("hidden", hasProAccess || !AUTH_STATE.user);
    });
  });
  els.adminPanel?.classList.toggle("hidden", !canAccessAdminFeatures());
  els.proCodePanel?.classList.toggle("hidden", !AUTH_STATE.user || role !== "free");
  if (role !== "free" && els.proCodeStatus) els.proCodeStatus.textContent = "";
  if (!canAccessAdminFeatures()) {
    AUTH_STATE.adminUsers = [];
    AUTH_STATE.adminProCodes = [];
    if (els.adminUsersTable) els.adminUsersTable.innerHTML = "";
    if (els.adminProCodesList) els.adminProCodesList.innerHTML = "";
  }
  if (hasProAccess && !els.menuScreen?.classList.contains("hidden")) refreshLobbyRooms();
  if (hasProAccess && !els.menuScreen?.classList.contains("hidden")) loadRanking();
  if (hasProAccess && !els.menuScreen?.classList.contains("hidden")) loadCompetitions();
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
  els.menuScreen?.classList.toggle("auth-only", !user);
  els.proCodePanel?.classList.toggle("hidden", !user || currentUserRole() !== "free");
  els.adminNextWeekButton?.classList.toggle("hidden", !canAccessAdminFeatures());
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

function applyAuthenticatedUser(user) {
  AUTH_STATE.user = user || null;
  if (user?.nickname) {
    MENU_STATE.nickname = user.nickname;
    localStorage.setItem("tennisLightNickname", MENU_STATE.nickname);
    if (els.nicknameInput) els.nicknameInput.value = MENU_STATE.nickname;
  }
  MENU_STATE.espoirResolvedCharacterId = null;
  renderAuthState();
  updateAccessControls();
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

function rankingMarkup() {
  const top = AUTH_STATE.ranking?.top || [];
  const current = AUTH_STATE.ranking?.currentUserRank || null;
  if (!top.length) {
    return '<div class="lobby-empty">Aucun classement disponible pour le moment.</div>';
  }
  const profileName = (row) => `
    <button class="ranking-name-button" type="button" data-profile-user="${escapeHtml(row.id || "")}">
      ${escapeHtml(row.nickname)}
    </button>
  `;
  const rows = top.map((row, index) => `
    <div class="ranking-row">
      <span>${Number(row.rank || index + 1)}</span>
      <strong>${profileName(row)}</strong>
      <span>${Number(row.score_ref || 0)}</span>
      <span>${Number(row.score_week || 0)}</span>
      <span>${Number(row.score_total || 0)}</span>
    </div>
  `).join("");
  const currentRow = current && !top.some((row) => row.id === current.id)
    ? `<div class="ranking-row current-user"><span>${current.rank}</span><strong>${profileName(current)}</strong><span>${Number(current.score_ref || 0)}</span><span>${Number(current.score_week || 0)}</span><span>${Number(current.score_total || 0)}</span></div>`
    : "";
  return `
    <div class="ranking-head"><span>#</span><span>Nom</span><span>Points</span><span>Semaine</span><span>Saison</span></div>
    ${rows}
    ${currentRow}
    <div class="ranking-meta">Saison ${Number(AUTH_STATE.ranking?.season || 1)} · Semaine ${Number(AUTH_STATE.ranking?.week || 1)}</div>
  `;
}

function attachProfileLinks(container) {
  container?.querySelectorAll("[data-profile-user]").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.dataset.profileUser;
      if (!userId) return;
      showProfileScreen(userId);
    });
  });
}

function renderRanking() {
  const markup = rankingMarkup();
  if (els.rankingList) {
    els.rankingList.innerHTML = markup;
    attachProfileLinks(els.rankingList);
  }
  if (els.rankingFullList) {
    els.rankingFullList.innerHTML = markup;
    attachProfileLinks(els.rankingFullList);
  }
}

function profileMarkup(profile) {
  const user = profile?.user || AUTH_STATE.user;
  const ranking = profile?.ranking || {};
  const results = profile?.results || [];
  const aiResults = profile?.aiResults || [];
  const calendar = profile?.calendar || [];
  const isOwnProfile = !profile?.publicProfile;
  const selectedProfileCharacter = user?.selectedCharacterId || "tennisHope";
  const selectedCharacterImage = PROFILE_CHARACTER_IMAGES[selectedProfileCharacter] || CHARACTER_IMAGES[selectedProfileCharacter]?.[0] || CHARACTER_IMAGES.coachUnknown[0];
  const palmaresResults = results.filter((row) => ["winner", "finalist"].includes(String(row.achievement || "").toLowerCase()));
  const resultRows = palmaresResults.length
    ? palmaresResults.map((row) => {
      const won = row.achievement === "winner";
      const city = row.city || "";
      const country = row.country || "";
      const flag = row.flag || "";
      return `<div class="profile-row">
        <strong><span class="profile-result-medal ${won ? "gold" : "silver"}"></span>${escapeHtml(row.competition_name || row.competitionName)}</strong>
        <span>${escapeHtml(city)} · ${escapeHtml(country)} ${escapeHtml(flag)} · Saison ${Number(row.season_number || row.season)} · Semaine ${Number(row.week_number || row.week)} · ${won ? "Victoire" : "Finale"} · ${Number(row.points || 0)} pts</span>
      </div>`;
    }).join("")
    : '<div class="lobby-empty">Aucune victoire ou finale enregistrée.</div>';
  const aiRows = aiResults.length
    ? aiResults.map((row) => `<div class="profile-row"><strong>${escapeHtml(characterNameFromId(row.ai_character_id || row.aiCharacterId))}</strong><span>${Number(row.wins || 0)} / ${Number(row.losses || 0)}</span></div>`).join("")
    : '<div class="lobby-empty">Aucun résultat contre IA enregistré.</div>';
  const statRows = [
    ["Meilleur classement", user?.bestWorldRank ? `#${Number(user.bestWorldRank)}` : "-"],
    ["Semaines n°1", Number(user?.weeksWorldNumberOne || 0)],
    ["Semaines Top 3", Number(user?.weeksWorldTop3 || 0)],
    ["Semaines Top 5", Number(user?.weeksWorldTop5 || 0)],
    ["Semaines Top 10", Number(user?.weeksWorldTop10 || 0)],
  ].map(([label, value]) => `<div class="profile-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  const calendarRows = calendar.length
    ? calendar.map((item) => {
      const title = `${item.type || item.level || "Tournoi"} - ${item.name || ""}`;
      const place = `${item.city || ""} · ${item.country || ""} ${item.flag || ""}`;
      let detail = "";
      if (item.reached && item.result) {
        detail = `${item.result.label} · ${Number(item.result.points || 0)} pts${item.result.lastOpponent ? ` · Dernier match vs ${item.result.lastOpponent}` : ""}${item.result.lastScore ? ` · ${item.result.lastScore}` : ""}`;
      } else if (item.reached) {
        detail = "N'a pas participé";
      }
      return `<div class="profile-calendar-row">
        <strong>S${Number(item.week || 0)} · ${escapeHtml(title)}</strong>
        <span>${escapeHtml(place)}</span>
        ${detail ? `<em>${escapeHtml(detail)}</em>` : ""}
      </div>`;
    }).join("")
    : '<div class="lobby-empty">Calendrier indisponible.</div>';
  return `
    <div class="profile-grid">
      <section class="profile-card">
        <p class="label">Compte</p>
        <div class="profile-role">${escapeHtml(ROLE_LABELS[user?.role] || "FREE")}</div>
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
      <section class="profile-card">
        <p class="label">Personnage</p>
        <div class="profile-character-summary">
          <img src="${selectedCharacterImage}" alt="${escapeHtml(characterNameFromId(selectedProfileCharacter))}" />
          <strong>${escapeHtml(characterNameFromId(selectedProfileCharacter))}</strong>
        </div>
        ${isOwnProfile ? '<button id="openCharacterPageButton" class="primary-button" type="button">Changer de personnage</button>' : ""}
      </section>
      <section class="profile-card">
        <p class="label">Classement mondial</p>
        <div class="ranking-row current-user"><span>${Number(ranking.rank || 0) || "-"}</span><strong>${escapeHtml(user?.nickname || "")}</strong><span>${Number(ranking.score_ref || 0)}</span><span>${Number(ranking.score_week || 0)}</span><span>${Number(ranking.score_total || 0)}</span></div>
        <div class="profile-stats-grid">${statRows}</div>
        <button id="profileRankingLinkButton" class="small-button" type="button">Classement général</button>
      </section>
      <section class="profile-card profile-wide">
        <p class="label">Victoires et finales Tennis Courts Pro Circuit</p>
        ${resultRows}
      </section>
      <section class="profile-card profile-wide">
        <p class="label">Résultats contre IA</p>
        ${aiRows}
      </section>
      <section class="profile-card profile-wide">
        <p class="label">Calendrier de saison</p>
        <div class="profile-calendar">${calendarRows}</div>
      </section>
    </div>
  `;
}

async function loadProfile(userId = null) {
  if (!AUTH_STATE.user) return;
  if (els.profileContent) els.profileContent.innerHTML = '<div class="lobby-empty">Chargement du profil...</div>';
  try {
    const ownProfile = !userId || userId === AUTH_STATE.user?.id;
    const profile = ownProfile ? await authRequest("/api/profile") : await authRequest(`/api/profiles/${encodeURIComponent(userId)}`);
    if (ownProfile) AUTH_STATE.profile = profile;
    if (els.profileContent) els.profileContent.innerHTML = profileMarkup(profile);
    if (ownProfile) {
      document.querySelector("#saveProfileNicknameButton")?.addEventListener("click", saveProfileNickname);
      document.querySelector("#openCharacterPageButton")?.addEventListener("click", showCharacterScreen);
      document.querySelector("#profileRedeemProCodeButton")?.addEventListener("click", redeemProfileProCode);
    }
    document.querySelector("#profileRankingLinkButton")?.addEventListener("click", showRankingScreen);
  } catch (error) {
    if (els.profileContent) els.profileContent.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message)}</div>`;
  }
}

function characterPageMarkup(profile) {
  const user = profile?.user || AUTH_STATE.user;
  const options = profileCharacterOptionsForCurrentUser();
  const selectedProfileCharacter = options.includes(user?.selectedCharacterId) ? user.selectedCharacterId : options[0] || "coachJu";
  const characterRows = options.map((characterId) => {
    const image = PROFILE_CHARACTER_IMAGES[characterId] || CHARACTER_IMAGES[characterId]?.[0] || CHARACTER_IMAGES.coachUnknown[0];
    return `
      <button class="profile-character-choice ${selectedProfileCharacter === characterId ? "active" : ""}" type="button" data-profile-character="${escapeHtml(characterId)}">
        <img src="${image}" alt="${escapeHtml(characterNameFromId(characterId))}" />
        <span>${escapeHtml(characterNameFromId(characterId))}</span>
      </button>
    `;
  }).join("");
  const roleHint = canAccessAllCharacters()
    ? "Tous les personnages sont disponibles pour ce compte."
    : "Les comptes Free et Pro peuvent choisir parmi les 4 coachs.";
  return `
    <div class="profile-card profile-wide">
      <p class="label">${escapeHtml(roleHint)}</p>
      <div class="profile-character-grid character-screen-grid">${characterRows}</div>
      <button id="saveProfileCharacterButton" class="primary-button" type="button">Enregistrer le personnage</button>
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
    await loadCharacterPage();
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

async function loadRanking(page = AUTH_STATE.rankingPage || 1) {
  if (!canAccessProFeatures()) {
    if (els.rankingList) els.rankingList.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
    return;
  }
  try {
    AUTH_STATE.rankingPage = page;
    const data = await authRequest(`/api/ranking?page=${encodeURIComponent(page)}&pageSize=50`);
    AUTH_STATE.ranking = data;
    renderRanking();
  } catch (error) {
    if (els.rankingList) els.rankingList.innerHTML = `<div class="lobby-empty">${escapeHtml(error.message)}</div>`;
  }
}

function renderCompetitions() {
  if (!els.weeklyCompetitionsList) return;
  const competitions = AUTH_STATE.competitions?.competitions || [];
  const bestScores = AUTH_STATE.competitions?.bestScores || {};
  if (!competitions.length) {
    els.weeklyCompetitionsList.innerHTML = '<div class="lobby-empty">Aucune compétition générée.</div>';
    return;
  }
  const retriesUsed = Number(AUTH_STATE.competitions?.retriesUsed || 0);
  const retryLimit = Number(AUTH_STATE.competitions?.retryLimit || 5);
  const nextUpdateText = formatCountdown(AUTH_STATE.competitions?.nextUpdateAt);
  els.weeklyCompetitionsList.innerHTML = `
    <div class="weekly-competition-counter">Saison ${Number(AUTH_STATE.competitions?.season || 1)} · Semaine ${Number(AUTH_STATE.competitions?.week || 1)} · Nouvelles tentatives : ${retriesUsed}/${retryLimit} · Prochaine semaine : ${escapeHtml(nextUpdateText)}</div>
    ${competitions.map((competition) => {
      const alreadyPlayed = Object.prototype.hasOwnProperty.call(bestScores, competition.id);
      const canReplay = !alreadyPlayed || retriesUsed < retryLimit;
      const label = alreadyPlayed ? "Rejouer" : "Jouer";
      const replayClass = alreadyPlayed ? "replay-button" : "";
      return `
      <article class="weekly-competition">
        <div>
          <strong>${escapeHtml(competition.type || competition.name)} - ${escapeHtml(competition.name)}</strong>
          <span>${escapeHtml(competition.city || "")} · ${escapeHtml(competition.country || "")} ${escapeHtml(competition.flag || "")} · ${escapeHtml(competition.surfaceLabel)} · ${tournamentDifficultyLabel(competition.difficulty)} · ${Number(competition.targetSets || 2)} sets</span>
        </div>
        <span>Gains : ${Number(bestScores[competition.id] || 0)} pts</span>
        <div class="weekly-competition-actions">
          <button class="small-button ${replayClass}" type="button" data-start-weekly-competition="${escapeHtml(competition.id)}" ${canReplay ? "" : "disabled"}>${label}</button>
          ${savedTournamentProgress(competition.id) ? `<button class="small-button resume-button" type="button" data-resume-weekly-competition="${escapeHtml(competition.id)}">Reprendre</button>` : ""}
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
}

function formatCountdown(isoValue) {
  if (!isoValue) return "--:--:--";
  const ms = new Date(isoValue).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return "bientôt";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

async function loadCompetitions() {
  if (!canAccessProFeatures()) {
    if (els.weeklyCompetitionsList) els.weeklyCompetitionsList.innerHTML = "";
    return;
  }
  try {
    AUTH_STATE.competitions = await authRequest("/api/competitions");
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
  return `tennisLightTournamentSave:${season}:${week}:${competitionId}`;
}

function savedTournamentProgress(competitionId) {
  const serverSaveIds = AUTH_STATE.competitions?.savedTournamentIds || [];
  if (serverSaveIds.includes(competitionId)) return { server: true };
  try {
    const raw = localStorage.getItem(currentCircuitSaveKey(competitionId));
    if (!raw) return null;
    return JSON.parse(raw);
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
  };
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
  Object.assign(SOLO_AI, cloneData(snapshot.soloAi || {}));
  SOLO_AI.thinking = false;
  SOLO_AI.executing = false;
  SOLO_AI.timer = null;
  SOLO_AI.nudgeTimer = null;
  SOLO_AI.nudgeAutoTimer = null;
  SOLO_AI.watchdogTimer = null;
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
  const saved = await fetchSavedTournamentProgress(competitionId);
  if (!saved || !restoreStateSnapshot(saved)) {
    renderAuthState("Sauvegarde indisponible.");
    renderCompetitions();
    return;
  }
  showGameScreen();
  applySurfaceBackground(state.tournament?.competitionSurface);
  render();
}

async function startWeeklyCompetition(competitionId) {
  if (!canAccessProFeatures()) {
    renderAuthState("Le Tennis Courts Pro Circuit est réservé aux joueurs Pro.");
    return;
  }
  if (!AUTH_STATE.ranking) {
    await loadRanking();
  }
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
  showGameScreen();
  applySurfaceBackground(competition.surface);
  const targetSets = Number(competition.targetSets || 2);
  startTournamentMode(targetSets, { competition });
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

function applySurfaceBackground(surface = null) {
  document.body.classList.remove("surface-hard", "surface-grass", "surface-clay");
  if (surface === "grass") document.body.classList.add("surface-grass");
  if (surface === "clay") document.body.classList.add("surface-clay");
  if (surface === "hard") document.body.classList.add("surface-hard");
}

function showGameScreen() {
  els.menuScreen?.classList.add("hidden");
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.gameApp?.classList.remove("hidden");
}

function showRankingScreen() {
  els.menuScreen?.classList.add("hidden");
  els.adminScreen?.classList.add("hidden");
  els.gameApp?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.rankingScreen?.classList.remove("hidden");
  loadRanking();
}

function showMenuScreen() {
  els.gameApp?.classList.add("hidden");
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.menuScreen?.classList.remove("hidden");
  applySurfaceBackground(null);
  renderAuthState();
  updateMenuSelection();
  refreshLobbyRooms();
  loadRanking();
  loadCompetitions();
}

function showProfileScreen(userId = null) {
  if (!AUTH_STATE.user) return;
  els.menuScreen?.classList.add("hidden");
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.gameApp?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.profileScreen?.classList.remove("hidden");
  loadProfile(typeof userId === "string" ? userId : null);
}

function showCharacterScreen() {
  if (!AUTH_STATE.user) return;
  els.menuScreen?.classList.add("hidden");
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.gameApp?.classList.add("hidden");
  els.resetPasswordScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.remove("hidden");
  loadCharacterPage();
}

function showResetPasswordScreen() {
  els.menuScreen?.classList.add("hidden");
  els.adminScreen?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.gameApp?.classList.add("hidden");
  els.resetPasswordScreen?.classList.remove("hidden");
}

function showAdminScreen() {
  if (!canAccessAdminFeatures()) return;
  els.menuScreen?.classList.add("hidden");
  els.gameApp?.classList.add("hidden");
  els.rankingScreen?.classList.add("hidden");
  els.profileScreen?.classList.add("hidden");
  els.characterScreen?.classList.add("hidden");
  els.adminScreen?.classList.remove("hidden");
  AUTH_STATE.adminPage = 1;
  loadAdminUsers();
  loadAdminProCodes();
}

function cardByIdForTutorial(cardId, copyIndex) {
  const card = CARD_LIBRARY.find((item) => item.id === cardId);
  return card ? cloneCard(card, `tutorial-${copyIndex}`) : null;
}

function tutorialHand(cardIds, prefix) {
  return cardIds.map((cardId, index) => cardByIdForTutorial(cardId, `${prefix}-${index}`)).filter(Boolean);
}

function tutorialStep() {
  return state.tutorial.active ? TUTORIAL_SCRIPT[state.tutorial.stepIndex] ?? null : null;
}

function tutorialExpectedAction() {
  const step = tutorialStep();
  return step?.type === "action" ? step.action : null;
}

function tutorialAllowsPlay(playerIndex, card, mode, boosted = false) {
  if (!state.tutorial.active) return true;
  const action = tutorialExpectedAction();
  if (!action || action.kind !== "play" || !card) return false;
  const expectedMode = boosted ? "boost" : mode;
  return action.playerIndex === playerIndex && action.cardId === card.id && action.mode === expectedMode;
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

function startTutorial() {
  if (SERVER_SYNC.enabled) {
    leaveOnlineRoom();
  }
  resetTournament();
  resetSetMatch();
  stopSoloTimers();
  SOLO_AI.enabled = false;

  setupTutorialScenario("base");
  state.server = 0;
  state.activePlayer = 0;
  state.tutorial = { active: true, stepIndex: 0, completed: false, autoCompletedIds: [] };
  state.log = ["Tutoriel lancé."];
  captureTurnSnapshot();
  showGameScreen();
  render();
}

function completeTutorialAction(action) {
  if (!state.tutorial.active) return;
  const expected = tutorialExpectedAction();
  if (!expected || expected.kind !== action.kind || expected.playerIndex !== action.playerIndex) return;
  if (expected.kind === "play" && (expected.cardId !== action.cardId || expected.mode !== action.mode)) return;
  advanceTutorial();
}

function advanceTutorial() {
  if (!state.tutorial.active) return;
  state.tutorial.stepIndex += 1;
  runTutorialAutoSteps();
  render();
}

function finishTutorial() {
  state.tutorial = { active: false, stepIndex: 0, completed: true, autoCompletedIds: [] };
  showMenuScreen();
  render();
}

function runTutorialAutoSteps() {
  const step = tutorialStep();
  if (!step?.auto) return;
  const stepKey = step.id ?? `step-${state.tutorial.stepIndex}`;
  state.tutorial.autoCompletedIds = state.tutorial.autoCompletedIds ?? [];
  if (state.tutorial.autoCompletedIds.includes(stepKey)) return;
  state.tutorial.autoCompletedIds.push(stepKey);
  performTutorialAuto(step.auto);
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
  const edt = createPlayer("Espoir du Tennis", "tennisHope", "Espoir du Tennis");
  const coachJu = createPlayer("Coach Ju", "coachJu", "Coach Ju");
  const coachMax = createPlayer("Coach Max", "coachMax", "Coach Max");
  if (scenario === "base") {
    resetTutorialExchange(
      [edt, coachJu],
      [
        tutorialHand(["service-coup-droit", "amortie-2-1-4", "revers-3-3-3"], "base-edt"),
        tutorialHand(["passing-1-1-4", "lob-2-0-4"], "base-ju"),
      ],
      0,
      0,
    );
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
  try {
    if (state.tournament?.weekly && state.tournament.stage !== "complete") {
      await saveTournamentProgress();
    } else if (state.tournament?.weekly && state.tournament.stage === "complete") {
      await recordWeeklyCompetitionResult();
      await deleteTournamentProgress();
    }
  } catch (error) {
    state.log.unshift(`Retour lobby : ${error.message}`);
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
  SOLO_AI.difficulty = "normal";
}

function resetTournament() {
  state.tournament = cloneData(EMPTY_TOURNAMENT);
}

function randomAiCharacterId() {
  const available = COACH_OPTIONS.filter((characterId) => characterId !== selectedCharacterId());
  return available[Math.floor(Math.random() * available.length)] ?? "coachMax";
}

function startSoloFromMenu(mode) {
  if (mode.startsWith("tournament") && !canAccessProFeatures()) {
    renderAuthState("Réservé aux joueurs Pro.");
    return;
  }
  MENU_STATE.espoirResolvedCharacterId = null;
  if (!mode.startsWith("tournament")) resetTournament();
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
  if (!canAccessProFeatures()) {
    els.lobbyRooms.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
    return;
  }
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
  if (!canAccessProFeatures()) {
    if (els.lobbyRooms) els.lobbyRooms.innerHTML = '<div class="lobby-empty">Réservé aux joueurs Pro.</div>';
    return;
  }
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
    knownOpponentHand: null,
    played: [],
    nextPrecisionBonus: 0,
    nextPrecisionSources: [],
    nextPlacementBonus: 0,
    nextPlacementSources: [],
    nextDiscount: 0,
    nextDiscountSources: [],
    nextExtraCost: 0,
    nextExtraCostSources: [],
    nextPowerMultiplier: 1,
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
    permanentBonuses: [],
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
    copiedEffectType: card.copiedEffectType ?? null,
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
    version: "v99",
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
  state.players.forEach((player) => {
    player.surfaceBonus = state.tournament.active && state.tournament.surfaceBonuses
      ? state.tournament.surfaceBonuses[player.characterId] ?? null
      : null;
    player.permanentBonuses = state.tournament.active && state.tournament.permanentBonuses
      ? cloneData(state.tournament.permanentBonuses[player.characterId] ?? [])
      : [];
  });
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
  const remiseDiscount = isRemise(card) && player.surfaceBonus?.id === "grassCheapRemise" ? 1 : 0;
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
  player.nextPowerMultiplier = 1;
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

function tournamentAiDifficultyForPlayer(player) {
  if (!state.tournament.active) return "normal";
  const playerIndex = state.players.indexOf(player);
  if (playerIndex !== SOLO_AI.playerIndex) return "normal";
  return normalizeAiDifficulty(state.tournament.difficulty || SOLO_AI.difficulty);
}

function getCardStats(player, card, boosted) {
  const playerIndex = state.players.indexOf(player);
  const opponent = playerIndex >= 0 ? state.players[opponentOf(playerIndex)] : null;
  const shotBonus = isRemise(card) ? 0 : 1;
  const basePower = boosted ? card.boostPower : card.power;
  const aiDifficulty = tournamentAiDifficultyForPlayer(player);
  const aiStatBonus = aiDifficulty === "champion" || aiDifficulty === "hardcore" ? 1 : 0;
  const aiPowerBonus = aiDifficulty === "hardcore" && !isRemise(card) ? 1 : 0;
  const permanentPrecisionBonus = (player.permanentBonuses ?? []).reduce((sum, bonus) => sum + Number(bonus.precision || 0), 0);
  const permanentPlacementBonus = (player.permanentBonuses ?? []).reduce((sum, bonus) => sum + Number(bonus.placement || 0), 0);
  let precision = (boosted ? card.boostPrecision : card.precision) + (player.exchangePrecisionBonus ?? 0) + player.nextPrecisionBonus * shotBonus + aiStatBonus;
  precision += permanentPrecisionBonus;
  let placement = card.placement + (player.exchangePlacementBonus ?? 0) + player.nextPlacementBonus * shotBonus + aiStatBonus + permanentPlacementBonus;
  let surfacePowerBonus = 0;
  if (!isRemise(card) && player.surfaceBonus?.id === "grassPowerVolleySmash" && ["Volée", "Smash"].includes(card.family)) surfacePowerBonus += 2;
  if (!isRemise(card) && player.surfaceBonus?.id === "hardPrecisePower" && precision > 3) surfacePowerBonus += 1;
  if (!isRemise(card) && player.surfaceBonus?.id === "clayGroundPower" && ["Coup droit", "Revers"].includes(card.family)) surfacePowerBonus += 1;
  if (!isRemise(card) && player.surfaceBonus?.id === "clayBoostPower" && boosted) surfacePowerBonus += 2;
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
  for (const bonus of player.placementPerOpponentLowPowerCardBonuses ?? []) {
    const threshold = bonus.threshold ?? 5;
    const lowPowerCards = opponent?.played.filter((playedCard) => !playedCard.removed && (playedCard.cardPowerGained ?? playedCard.powerGained ?? playedCard.power ?? 0) < threshold).length ?? 0;
    placement += lowPowerCards * (bonus.value ?? 0);
  }
  return {
    power: (basePower + aiPowerBonus + surfacePowerBonus + characterPowerBonus) * (isRemise(card) ? 1 : (player.nextPowerMultiplier ?? 1)),
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
  const counterBoost = chooseSoloBoostPlay(playerIndex);
  const defensePlan = chooseSoloRemiseDefensePlan(playerIndex);

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
  if (isMatchDangerForPlayer(playerIndex) || isSetDangerForPlayer(playerIndex) || wouldPassLoseSetOrMatch(playerIndex)) return false;
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
  if (SOLO_AI.style !== "expert") return false;
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
  const remainingKnownIds = new Set(player.knownOpponentHand.cardIds ?? []);
  return state.players[opponentIndex].hand.filter((card) => remainingKnownIds.has(card.id));
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
  const danger = probability * (canDefend ? 8 : 28 + requiredPlacement * 2) + humanEndThreat * 0.65;
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
  const opponentEndThreat = playerEndThreatScore(state.players[opponentOf(playerIndex)]);
  const expertBlocksRisk = SOLO_AI.style === "expert"
    && !state.mandatoryPlacement
    && state.boostAvailableFor !== playerIndex
    && !best.passPressure
    && !isSetDangerForPlayer(playerIndex)
    && best.threat.probability >= (opponentEndThreat > 0 ? 0.32 : 0.42)
    && !best.threat.canDefend;
  const shouldBoost = !expertBlocksRisk && (state.mandatoryPlacement || state.boostAvailableFor === playerIndex || isSetDangerForPlayer(playerIndex) || wouldPassLoseSetOrMatch(playerIndex) || best.passPressure || best.boostedScore >= best.normalScore + styleBoostMargin);
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

function applySurfaceBonusAfterPlay(playerIndex, playedCard, costPaid) {
  const player = state.players[playerIndex];
  const bonus = player.surfaceBonus;
  if (!bonus || isRemise(playedCard)) return;
  if (bonus.id === "grassBoostPrecisionDraw" && playedCard.boosted) {
    addNextPrecisionBonus(player, 1, playedCard.playedUid);
    const drawn = drawCards(player, 1);
    state.log.unshift(`${bonus.label} : ${player.name} gagne +1 précision${drawn ? " et pioche 1 carte" : ""}.`);
  }
  if (bonus.id === "hardCheapShotDraw" && costPaid === 1) {
    const drawn = drawCards(player, 1);
    state.log.unshift(drawn ? `${bonus.label} : ${player.name} pioche 1 carte.` : `${bonus.label} : deck vide.`);
  }
  if (bonus.id === "hardBoostPlacement" && playedCard.boosted) {
    addNextPlacementBonus(player, 2, playedCard.playedUid);
    state.log.unshift(`${bonus.label} : ${player.name} gagne +2 placement sur sa carte suivante.`);
  }
  if (bonus.id === "clayForehandEndurance" && playedCard.family === "Coup droit") {
    player.endurance += 1;
    state.log.unshift(`${bonus.label} : ${player.name} récupère 1 endurance.`);
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
    sacrificedCard,
    isServiceTurn: isOpeningServe,
    costPaid: cost,
    powerGained: stats.power,
    cardPowerGained: rawStats.power,
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
  const effectPlacementText = isRemise(card) && remiseMode === "effect" && rawStats.placement
    ? `, placement de clôture ${rawStats.placement}`
    : "";
  state.log.unshift(`${player.name} joue ${card.name}${boostText}${remiseText} : +${stats.power} puissance, précision ${stats.precision}, placement ${stats.placement}${effectPlacementText}${endsTurn ? `, placement total ${combinedPlacement}` : ""}.`);
  const effectCanceled = state.players[opponentIndex].cancelNextOpponentEffect;
  if (!appliesEffect) {
    setEffectNotice("ignoré", card, `${card.effect} Ne s'applique pas car la carte est jouée en Remise.`);
    state.log.unshift(`L'effet de ${card.name} ne s'applique pas car la carte est jouée en Remise.`);
  } else if (effectCanceled) {
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
    state.log.unshift(`${player.name} peut encore jouer : une Remise ne termine pas le tour.`);
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
    return false;
  }
  const freeBoostWindow = finalCard.effectType !== "freeBoostNext" || isFreeBoostNextWindow(playerIndex);
  applyEffect(playerIndex, finalCard);
  if (freeBoostWindow) {
    setEffectNotice("appliqué", finalCard, finalCard.effect);
  }
  state.log.unshift(`${state.players[playerIndex].name} termine son tour sur ${finalCard.name} : son effet et son placement sont pris en compte.`);
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
    playerName: player.name,
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
    state.log.unshift(drawn > 0 ? `${opponent.name} pioche 1 carte car le serveur termine sans Service ni Coup droit.` : `${opponent.name} devrait piocher, mais le deck est vide.`);
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
      addNextPrecisionBonus(player, card.effectValue, card.playedUid);
      state.log.unshift(`${player.name} gagne +${card.effectValue} précision sur son prochain coup.`);
      break;
    case "nextPlacement":
      addNextPlacementBonus(player, card.effectValue, card.playedUid);
      state.log.unshift(`${player.name} gagne +${card.effectValue} placement sur son prochain coup.`);
      break;
    case "nextPrecisionAndPlacement":
      addNextPrecisionBonus(player, card.effectValue, card.playedUid);
      addNextPlacementBonus(player, card.effectValue, card.playedUid);
      state.log.unshift(`${player.name} gagne +${card.effectValue} précision et placement sur son prochain coup.`);
      break;
    case "nextDiscount":
      addNextDiscount(player, card.effectValue, card.playedUid);
      state.log.unshift(`Le prochain coup de ${player.name} coûte ${card.effectValue} endurance en moins.`);
      break;
    case "cancelOpponentNextEffect":
      player.cancelNextOpponentEffect = true;
      player.cancelNextOpponentEffectSourceUid = card.playedUid;
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
        player.freeBoostNextSourceUid = card.playedUid;
        state.log.unshift(`${player.name} pourra booster son prochain coup grâce au Retour de service.`);
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
        state.log.unshift(`${player.name} neutralise la contrainte de placement du BOOST avec Joker pour tout ce tour.`);
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
    state.log.unshift(opponent.protectedFromRemoval ? `${opponent.name} est protégé : aucune carte ne peut être supprimée.` : "Aucune carte adverse à supprimer.");
    return;
  }
  state.pendingRemoveChoice = { playerIndex, opponentIndex, sourcePlayedUid: sourceCard.playedUid };
  state.log.unshift(`${state.players[playerIndex].name} doit choisir une carte adverse à supprimer.`);
}

function removableOpponentCards(opponentIndex) {
  const opponent = state.players[opponentIndex];
  if (opponent.protectedFromRemoval) return [];
  return opponent.played.filter((card) => !card.removed);
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
  state.log.unshift(`${player.name} ne peut supprimer aucune carte adverse.`);
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
    state.log.unshift(`${opponent.name} est protégé : ses cartes ne peuvent pas être supprimées.`);
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
    const removedPrecision = removeSourcedNextBonus(player, "nextPrecisionBonus", "nextPrecisionSources", card.playedUid);
    const removedPlacement = removeSourcedNextBonus(player, "nextPlacementBonus", "nextPlacementSources", card.playedUid);
    const removedDiscount = removeSourcedNextBonus(player, "nextDiscount", "nextDiscountSources", card.playedUid);
    const removedExtraCost = removeSourcedNextBonus(player, "nextExtraCost", "nextExtraCostSources", card.playedUid);
    const removedExchangePrecision = removeSourcedNextBonus(player, "exchangePrecisionBonus", "exchangePrecisionSources", card.playedUid);
    const removedExchangePlacement = removeSourcedNextBonus(player, "exchangePlacementBonus", "exchangePlacementSources", card.playedUid);
    if (removedPrecision) state.log.unshift(`Le bonus +${removedPrecision} précision créé par ${card.name} est annulé.`);
    if (removedPlacement) state.log.unshift(`Le bonus +${removedPlacement} placement créé par ${card.name} est annulé.`);
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
  markCopiedEffectOnSource(sourceCard, chosen);
  const chosenEffectType = chosen.copiedEffectType || chosen.effectType;
  if (chosenEffectType === "choosePlayedEffect" || chosenEffectType === "gainPowerAndChooseAnyPlayedEffect") {
    sourceCard.effectType = "choosePlayedEffect";
    sourceCard.copiedEffectType = "choosePlayedEffect";
    sourceCard.effect = chosen.effect;
    state.pendingEffectChoice = { playerIndex, sourcePlayedUid: sourceCard.playedUid, shotsOnly: true };
    state.log.unshift(`${player.name} doit maintenant choisir l'effet à dupliquer.`);
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
  state.log.unshift(`${player.name} ne peut choisir aucun effet valide.`);
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
    state.log.unshift(`${player.name} retourne sa carte personnage pour la première fois : +1 endurance.`);
  }
}

function characterEffectLogMarker(effect) {
  const side = String(effect?.side || "").toLowerCase().includes("rose") ? "rose" : "blue";
  return `[[tc-effect-${side}:${effect?.label || "Effet personnage"}]]`;
}

function applyCharacterEffect(playerIndex, playedCard) {
  const player = state.players[playerIndex];
  const character = characterOf(player);
  const effect = currentCharacterEffect(player);
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
    state.log.unshift(`${character.name} (${effect.side}) : +${power} puissance. ${opponent.name} récupère ${endurance} endurance.`);
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
    state.pendingEffectChoice = { playerIndex, sourcePlayedUid: playedCard.playedUid, shotsOnly: false };
    state.log.unshift(`${character.name} (${effect.side}) : +${value} puissance, puis ${player.name} choisit un effet engagé à dupliquer.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return true;
  }

  if (effect.type === "nextDiscount") {
    const value = effect.value ?? 1;
    addNextDiscount(player, value, playedCard.playedUid);
    state.log.unshift(`${character.name} (${effect.side}) : le prochain coup de ${player.name} coûte ${value} endurance en moins.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "opponentNextExtraCost") {
    const value = effect.value ?? 1;
    const opponent = state.players[opponentOf(playerIndex)];
    addNextExtraCost(opponent, value, playedCard.playedUid);
    state.log.unshift(`${character.name} (${effect.side}) : le prochain coup de ${opponent.name} coûte ${value} endurance de plus.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "nextPowerMultiplier") {
    const value = effect.value ?? 2;
    player.nextPowerMultiplier = Math.max(player.nextPowerMultiplier ?? 1, value);
    state.log.unshift(`${character.name} (${effect.side}) : le prochain coup de ${player.name} comptera puissance x${value}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "exchangePrecisionBonus") {
    const value = effect.value ?? 2;
    player.exchangePrecisionBonus = (player.exchangePrecisionBonus ?? 0) + value;
    player.exchangePrecisionSources = player.exchangePrecisionSources ?? [];
    player.exchangePrecisionSources.push({ sourceUid: playedCard.playedUid, value });
    state.log.unshift(`${character.name} (${effect.side}) : toutes les cartes de ${player.name} gagnent +${value} précision jusqu'à la fin de l'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "exchangePlacementBonus") {
    const value = effect.value ?? 2;
    player.exchangePlacementBonus = (player.exchangePlacementBonus ?? 0) + value;
    player.exchangePlacementSources = player.exchangePlacementSources ?? [];
    player.exchangePlacementSources.push({ sourceUid: playedCard.playedUid, value });
    state.log.unshift(`${character.name} (${effect.side}) : toutes les cartes de ${player.name} gagnent +${value} placement jusqu'à la fin de l'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "exchangeFamilyPowerBonus") {
    const value = effect.value ?? 1;
    const bonus = {
      sourceUid: playedCard.playedUid,
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
      { sourceUid: playedCard.playedUid, afterFamily: effect.afterFamily, value },
    ];
    state.log.unshift(`${character.name} (${effect.side}) : ${effect.label}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "placementPerOpponentLowPowerCard") {
    player.placementPerOpponentLowPowerCardBonuses = [
      ...(player.placementPerOpponentLowPowerCardBonuses ?? []),
      { sourceUid: playedCard.playedUid, threshold: effect.threshold ?? 5, value: effect.value ?? 2 },
    ];
    state.log.unshift(`${character.name} (${effect.side}) : ${effect.label}.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "preventOpponentRemoval") {
    player.protectedFromRemoval = true;
    player.protectedFromRemovalSourceUid = playedCard.playedUid;
    state.log.unshift(`${character.name} (${effect.side}) : les cartes de ${player.name} ne peuvent plus être supprimées jusqu'à la fin de l'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "cancelNextOpponentEffect") {
    player.cancelNextOpponentEffect = true;
    player.cancelNextOpponentEffectSourceUid = playedCard.playedUid;
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
    state.log.unshift(`${character.name} (${effect.side}) : ${player.name} choisit une carte non distribuée à récupérer.`);
    setEffectNotice("coach", { name: character.name }, effect.label);
    return true;
  }

  if (effect.type === "removeOpponentPlayedChoice") {
    const opponentIndex = opponentOf(playerIndex);
    if (!removableOpponentCards(opponentIndex).length) {
      state.log.unshift(`${character.name} (${effect.side}) : aucune carte adverse engagée à défausser.`);
      setEffectNotice("coach", { name: character.name }, "Aucune carte adverse engagée disponible.");
      return false;
    }
    state.pendingRemoveChoice = { playerIndex, opponentIndex, sourcePlayedUid: playedCard.playedUid };
    state.log.unshift(`${character.name} (${effect.side}) : ${player.name} choisit une carte adverse engagée à défausser.`);
    setEffectNotice("coach", { name: character.name }, effect.label);
    return true;
  }

  if (effect.type === "drawRandomOpponentHand") {
    const opponent = state.players[opponentOf(playerIndex)];
    if (!opponent.hand.length) {
      state.log.unshift(`${character.name} (${effect.side}) : la main adverse est vide.`);
      setEffectNotice("coach", { name: character.name }, "Main adverse vide.");
      return false;
    }
    const [drawn] = opponent.hand.splice(Math.floor(Math.random() * opponent.hand.length), 1);
    player.hand.push(drawn);
    state.log.unshift(`${character.name} (${effect.side}) : ${player.name} pioche ${drawn.name} dans la main adverse.`);
    setEffectNotice("coach", { name: character.name }, `${drawn.name} rejoint la main.`);
    return false;
  }

  if (effect.type === "peekOpponentHand") {
    const opponentIndex = opponentOf(playerIndex);
    const opponent = state.players[opponentIndex];
    player.knownOpponentHand = {
      opponentIndex,
      cardIds: opponent.hand.map((card) => card.id),
      observedAt: Date.now(),
    };
    const cards = opponent.hand.map((card) => card.name).join(", ") || "main vide";
    state.log.unshift(`${character.name} (${effect.side}) : main adverse observée (${cards}).`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
  }

  if (effect.type === "endDoubleLastShot") {
    player.endBonuses.push({ type: "doubleLastShot", sourceUid: playedCard.playedUid });
    state.log.unshift(`${character.name} (${effect.side}) : prépare un doublement de la dernière carte Coup en fin d'échange.`);
    setEffectNotice("coach", { name: character.name }, `${effect.label}.`);
    return false;
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
  finishGame({
    reason: `${player.name} passe. ${opponent.name} gagne ${bonus} puissance. L'échange s'arrête immédiatement.`,
    extraPowerDetails: [{ playerIndex: opponentIndex, label: "Pénalité de passe adverse", points: bonus }],
  });
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
    scoreText: ignoreScore ? "Victoire automatique : les points ne sont pas comptés." : `Score final : ${p1.name} ${p1.power} - ${p2.power} ${p2.name}${p1.power === p2.power ? `. Égalité : le serveur (${playerName(state.server)}) gagne.` : "."}`,
    setScore,
    endBonusDetails: [...extraPowerDetails, ...endBonusDetails],
  };
  if (state.setMatch.enabled) {
    applySetMatchScore(winner, setScore);
  }
  handleTournamentMatchComplete();
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
  const server = Math.random() < 0.5 ? 0 : 1;
  newGame({ preserveSet: true, serverOverride: server });
  const styleLabel = aiStyleLabel();
  const formatLabel = targetSets ? `match en ${targetSets} sets gagnants` : "set complet";
  const opponentLabel = SERVER_SYNC.enabled ? "en ligne" : `contre ${characterNameFromId(SOLO_AI.characterId)} (${styleLabel})`;
  state.log.unshift(`Mode ${formatLabel} : ${opponentLabel}.`);
  markServerDirtyForHostAction();
  render();
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
  SOLO_AI.difficulty = normalizeAiDifficulty(weeklyCompetition?.difficulty || selectedTournamentDifficulty());
  const humanCharacterId = selectedCharacterId();
  if (weeklyCompetition) {
    startWeeklyTournamentMode(targetSets, weeklyCompetition, humanCharacterId);
    return;
  }
  const { positions } = buildTournamentRound16Positions(humanCharacterId, weeklyCompetition?.surface || "hard");
  const permanentBonuses = buildHistoricPermanentBonuses(positions);
  state.tournament = {
    active: true,
    visible: false,
    bracket16: true,
    difficulty: SOLO_AI.difficulty,
    weekly: Boolean(weeklyCompetition),
    competitionId: weeklyCompetition?.id || null,
    competitionName: weeklyCompetition?.name || null,
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
    humanEntry: HUMAN_TOURNAMENT_ENTRY,
    aiFinalistCharacterId: null,
    currentMatch: "qfHuman",
    nextHumanMatchId: null,
    championCharacterId: null,
    weeklyPositions: positions,
    surfaceBonuses: {},
    permanentBonuses,
    matches: buildWeeklyTournamentMatches(positions, HUMAN_TOURNAMENT_ENTRY, targetSets),
  };
  refreshTournamentDerivedSlots();
  const firstHumanMatch = nextHumanTournamentMatch();
  state.tournament.currentMatch = firstHumanMatch?.id || null;
  SOLO_AI.characterId = opponentCharacterInMatch(firstHumanMatch, HUMAN_TOURNAMENT_ENTRY);
  startMatchMode(targetSets, { keepSoloOpponent: true });
  state.tournament.currentMatch = firstHumanMatch?.id || null;
  state.tournament.stage = firstHumanMatch?.round || "round16";
  const tournamentLabel = weeklyCompetition?.name || (targetSets === 3 ? "Slam 3 sets" : "Tournoi 2 sets");
  const surfaceText = weeklyCompetition?.surfaceLabel ? ` · ${weeklyCompetition.surfaceLabel}` : "";
  state.log.unshift(`${tournamentLabel}${surfaceText} ${tournamentDifficultyLabel(SOLO_AI.difficulty)} : 8e de finale contre ${characterNameFromId(SOLO_AI.characterId)}.`);
  render();
}

function currentRankingTotalPoints() {
  const current = AUTH_STATE.ranking?.currentUserRank;
  return Number(current?.score_ref || 0);
}

function randomSurfaceBonus(surface) {
  const options = SURFACE_BONUSES[surface] || [];
  return options[Math.floor(Math.random() * options.length)] || null;
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

function buildWeeklySurfaceBonuses(surface, seededCharacters) {
  const bonuses = {};
  for (const characterId of seededCharacters) {
    const bonus = randomSurfaceBonus(surface);
    if (bonus) bonuses[characterId] = { ...bonus, surface };
  }
  return bonuses;
}

function buildTournamentRound16Positions(humanCharacterId, surface = "hard") {
  const preferredSeeds = SURFACE_SPECIALISTS[surface] || SURFACE_SPECIALISTS.hard || [];
  const seededHistorics = [
    ...preferredSeeds.filter((characterId) => HISTORIC_TOURNAMENT_PLAYERS.includes(characterId)),
    ...shuffle(HISTORIC_TOURNAMENT_PLAYERS.filter((characterId) => !preferredSeeds.includes(characterId))),
  ].slice(0, 2);
  const remainingHistorics = HISTORIC_TOURNAMENT_PLAYERS.filter((characterId) => !seededHistorics.includes(characterId));
  const newDraw = shuffle(NEW_TOURNAMENT_PLAYERS).slice(0, 9);
  const field = shuffle([HUMAN_TOURNAMENT_ENTRY, ...remainingHistorics, ...newDraw]).slice(0, 14);
  const positions = Array(17).fill(null);
  positions[1] = seededHistorics[0];
  positions[16] = seededHistorics[1];
  const middlePositions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  middlePositions.forEach((position, index) => {
    positions[position] = field[index] || shuffle(NEW_TOURNAMENT_PLAYERS.filter((characterId) => !positions.includes(characterId)))[0] || HUMAN_TOURNAMENT_ENTRY;
  });
  return { positions, seededHistorics };
}

function startWeeklyTournamentMode(targetSets, weeklyCompetition, humanCharacterId) {
  const surface = weeklyCompetition.surface || "hard";
  applySurfaceBackground(surface);
  const { positions, seededHistorics } = buildTournamentRound16Positions(humanCharacterId, surface);
  const surfaceBonuses = buildWeeklySurfaceBonuses(surface, seededHistorics);
  const permanentBonuses = buildHistoricPermanentBonuses(positions);
  state.tournament = {
    active: true,
    visible: false,
    bracket16: true,
    difficulty: SOLO_AI.difficulty,
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
    humanEntry: HUMAN_TOURNAMENT_ENTRY,
    aiFinalistCharacterId: null,
    currentMatch: null,
    nextHumanMatchId: null,
    championCharacterId: null,
    weeklyPositions: positions,
    surfaceBonuses,
    permanentBonuses,
    matches: buildWeeklyTournamentMatches(positions, HUMAN_TOURNAMENT_ENTRY, targetSets),
  };
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
    winner: null,
    score: null,
    liveScore: null,
    playable: playerA === humanEntry || playerB === humanEntry,
    simulated: playerA !== humanEntry && playerB !== humanEntry,
    hiddenWinner: null,
    hiddenSetScores: null,
    revealedSetScores: [],
  });
  return [
    match("r16_1", "8e de finale 1", "round16", positions[1], positions[2]),
    match("r16_2", "8e de finale 2", "round16", positions[3], positions[4]),
    match("r16_3", "8e de finale 3", "round16", positions[5], positions[6]),
    match("r16_4", "8e de finale 4", "round16", positions[7], positions[8]),
    match("r16_5", "8e de finale 5", "round16", positions[9], positions[10]),
    match("r16_6", "8e de finale 6", "round16", positions[11], positions[12]),
    match("r16_7", "8e de finale 7", "round16", positions[13], positions[14]),
    match("r16_8", "8e de finale 8", "round16", positions[15], positions[16]),
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
  const winChanceA = strengthA / Math.max(1, strengthA + strengthB);
  const winner = Math.random() < winChanceA ? playerA : playerB;
  const setScores = randomMatchSetScoresForWinner(winner === playerA ? 0 : 1, targetSets);
  return { winner, setScores, score: formatSetScores(setScores) };
}

function aiTournamentStrength(characterId) {
  const isHistoric = HISTORIC_TOURNAMENT_PLAYERS.includes(characterId);
  const surface = state.tournament?.competitionSurface || "hard";
  const isSeeded = (SURFACE_SPECIALISTS[surface] || []).includes(characterId);
  const permanentBonuses = state.tournament?.permanentBonuses?.[characterId] ?? [];
  const surfaceBonus = state.tournament?.surfaceBonuses?.[characterId] ? 4 : 0;
  const historicBonus = isHistoric ? 8 : 0;
  const seededBonus = isSeeded ? 4 : 0;
  const permanentBonus = permanentBonuses.length ? 3 : 0;
  const base = COACH_OPTIONS.includes(characterId) ? 48 : 54;
  return base + historicBonus + seededBonus + surfaceBonus + permanentBonus + Math.floor(Math.random() * 17);
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

function tournamentCompletedSetScore() {
  return state.setMatch.completedScores.map((score) => `${score[0]}/${score[1]}`).join(" - ");
}

function handleTournamentMatchComplete() {
  if (!state.tournament.active || !state.setMatch.matchOver) return;
  if (state.tournament.weekly || state.tournament.bracket16) {
    handleWeeklyTournamentMatchComplete();
    return;
  }
  const match = tournamentMatchById(state.tournament.currentMatch);
  if (!match || match.winner) return;
  const winnerCharacterId = state.players[state.setMatch.matchWinner]?.characterId;
  match.winner = winnerCharacterId;
  match.score = tournamentCompletedSetScore();
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

function handleWeeklyTournamentMatchComplete() {
  const match = tournamentMatchById(state.tournament.currentMatch);
  if (!match || match.winner) return;
  const winnerEntry = tournamentWinnerEntryFromMatchWinner(state.setMatch.matchWinner);
  match.winner = winnerEntry;
  match.score = tournamentCompletedSetScore();
  match.liveScore = null;
  addHumanMatchPerformanceBonus(match);
  refreshWeeklyTournamentDerivedSlots();
  revealNextTournamentAiSet();
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

function humanMatchPerformanceBonus(match, setScores = state.setMatch.completedScores) {
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
  match.performanceBonusRecorded = true;
  match.performanceBonusPoints = bonus.points;
  match.performanceBonusDetails = bonus.details;
  state.tournament.matchBonusPoints = (state.tournament.matchBonusPoints || 0) + bonus.points;
  state.tournament.matchBonusDetails = [...(state.tournament.matchBonusDetails || []), ...bonus.details.map((detail) => `${match.label}: ${detail}`)];
  if (bonus.points) {
    state.log.unshift(`${match.label}: bonus performance +${bonus.points} points.`);
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
  if ((state.tournament.weekly || state.tournament.bracket16) && state.tournament.stage === "readyNext") {
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
  if ((state.tournament.weekly || state.tournament.bracket16) && state.tournament.stage === "readyNext") {
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
  if (!state.tournament.active || (!state.tournament.weekly && !state.tournament.bracket16) || state.tournament.stage !== "readyNext") return;
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
    current.liveScore = tournamentCompletedSetScore();
  }
  if (state.tournament.weekly) refreshWeeklyTournamentDerivedSlots();
  else refreshTournamentDerivedSlots();
  revealNextTournamentAiSet();
  if (state.tournament.weekly) refreshWeeklyTournamentDerivedSlots();
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
  if (qf1 && r16_1?.winner && r16_2?.winner) setMatchPlayers(qf1, r16_1.winner, r16_2.winner);
  if (qf2 && r16_3?.winner && r16_4?.winner) setMatchPlayers(qf2, r16_3.winner, r16_4.winner);
  if (qf3 && r16_5?.winner && r16_6?.winner) setMatchPlayers(qf3, r16_5.winner, r16_6.winner);
  if (qf4 && r16_7?.winner && r16_8?.winner) setMatchPlayers(qf4, r16_7.winner, r16_8.winner);
  if (semi1 && qf1?.winner && qf2?.winner) setMatchPlayers(semi1, qf1.winner, qf2.winner);
  if (semi2 && qf3?.winner && qf4?.winner) setMatchPlayers(semi2, qf3.winner, qf4.winner);
  if (final && semi1?.winner && semi2?.winner) setMatchPlayers(final, semi1.winner, semi2.winner);
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
    semiHuman.playerA = qfHuman?.winner ?? null;
    semiHuman.playerB = qfAi1?.winner ?? null;
  }
  if (semiAi) {
    const ready = Boolean(qfAi2?.winner && qfAi3?.winner);
    semiAi.playerA = ready ? qfAi2.winner : null;
    semiAi.playerB = ready ? qfAi3.winner : null;
    if (!ready) {
      semiAi.hiddenWinner = null;
      semiAi.hiddenSetScores = null;
      semiAi.revealedSetScores = [];
      semiAi.score = null;
      semiAi.winner = null;
    }
  }
  if (final) {
    final.playerA = semiHuman?.winner ?? (final.playerA && semiHuman?.winner ? final.playerA : null);
    final.playerB = semiAi?.winner ?? (final.playerB && semiAi?.winner ? final.playerB : null);
  }
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
  const endBonusDetails = state.resultInfo.endBonusDetails || [];
  els.resultPanel.innerHTML = `
    <p class="eyebrow">Fin de l'échange</p>
    <div class="winner-dialog">${state.players[state.resultInfo.winner].name} gagne l'échange</div>
    <p>${state.resultInfo.reason}</p>
    <p><strong>Condition :</strong> ${setScore?.label || (state.resultInfo.winType === "boost" ? "Victoire par BOOST" : "Victoire automatique")}</p>
    ${endBonusDetails.length ? `
      <div class="set-score-box end-bonus-box">
        <strong>Points supplémentaires appliqués</strong>
        ${endBonusDetails.map((bonus) => `<span>${state.players[bonus.playerIndex].name} : +${bonus.points} puissance · ${escapeHtml(bonus.label)}</span>`).join("")}
      </div>
    ` : '<p><strong>Points supplémentaires :</strong> aucun bonus de fin d’échange.</p>'}
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
  const details = [];
  for (const player of state.players) {
    for (const bonus of player.endBonuses) {
      if (bonus.type === "doubleLastShot") {
        const target = [...player.played].reverse().find((card) => !card.removed && isShot(card));
        if (target) {
          const doubledPower = target.cardPowerGained ?? target.powerGained;
          player.power += doubledPower;
          details.push({ playerIndex: state.players.indexOf(player), label: `Double ${target.name}`, points: doubledPower });
          state.log.unshift(`${player.name} double ${target.name} : +${doubledPower} puissance.`);
        }
      }
      if (bonus.type === "boostedBonus") {
        const count = player.played.filter((card) => card.boosted && !card.removed).length;
        const gained = count * bonus.value;
        player.power += gained;
        if (gained) details.push({ playerIndex: state.players.indexOf(player), label: `Bonus cartes boostées (${count})`, points: gained });
        state.log.unshift(`${player.name} gagne +${gained} puissance pour ses cartes boostées.`);
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
  renderResultPanel();
  renderTournamentPanel();
  renderTutorialOverlay();
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

function renderTutorialOverlay() {
  if (!els.tutorialOverlay) return;
  const step = tutorialStep();
  if (!state.tutorial.active || !step) {
    els.tutorialOverlay.classList.add("hidden");
    els.tutorialOverlay.innerHTML = "";
    return;
  }
  const action = step.type === "action" ? step.action : null;
  const isFinalStep = step.id === "done";
  const speakerImage = step.speaker === "max" ? TUTORIAL_MAX_IMAGE : TUTORIAL_COACH_IMAGE;
  const speakerAlt = step.speaker === "max" ? "Coach Max explique" : "Coach Ju explique";
  els.tutorialOverlay.classList.remove("hidden");
  els.tutorialOverlay.innerHTML = `
    <div class="tutorial-coach">
      <img src="${speakerImage}" alt="${speakerAlt}" />
    </div>
    <aside class="tutorial-card ${action ? "tutorial-card-action" : ""}" aria-label="Tutoriel">
      <p class="tutorial-kicker">Tutoriel</p>
      <h2>${step.title}</h2>
      <p>${step.text}</p>
      ${action ? `<p class="tutorial-action">Action attendue : ${tutorialActionLabel(action)}</p>` : ""}
      ${step.type === "message" ? `<button class="primary-button tutorial-next-button" type="button" data-tutorial-next>${tutorialClickArrow()}${isFinalStep ? "Terminer" : "Continuer"}</button>` : ""}
    </aside>
  `;
  els.tutorialOverlay.querySelector("[data-tutorial-next]")?.addEventListener("click", () => {
    if (isFinalStep) {
      finishTutorial();
    } else {
      advanceTutorial();
    }
  });
}

function tutorialActionLabel(action) {
  if (action.kind === "endTurn") return "clique sur Terminer le tour";
  const card = CARD_LIBRARY.find((item) => item.id === action.cardId);
  const cardName = card?.name ?? "la carte indiquée";
  if (action.mode === "placement") return `joue ${cardName} en Remise`;
  if (action.mode === "effect") return `joue ${cardName} en Effet`;
  if (action.mode === "boost") return `joue ${cardName} en Boost`;
  return `joue ${cardName}`;
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
  if (state.tournament.active) {
    const title = state.tournament.competitionName || (state.tournament.targetSets === 3 ? "Slam 3 sets" : "Tournoi 2 sets");
    const surface = state.tournament.competitionSurfaceLabel ? ` · ${state.tournament.competitionSurfaceLabel}` : "";
    return `${title}${surface} · ${tournamentDifficultyLabel(state.tournament.difficulty)} · ${tournamentStageLabel()}`;
  }
  if (state.setMatch.enabled && state.setMatch.targetSets) return `Contre l'IA · Match ${state.setMatch.targetSets} sets · IA ${aiStyleLabel()}`;
  if (state.setMatch.enabled) return `Contre l'IA · Set · IA ${aiStyleLabel()}`;
  if (SOLO_AI.enabled) return `Contre l'IA · Échange · IA ${aiStyleLabel()}`;
  return "Mode local";
}

function tournamentStageLabel() {
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

function renderTournamentPanel() {
  if (!els.tournamentPanel) return;
  if (!state.tournament.active) {
    els.tournamentPanel.classList.add("hidden");
    els.tournamentPanel.innerHTML = "";
    return;
  }
  const title = state.tournament.competitionName || (state.tournament.targetSets === 3 ? "Slam 3 sets" : "Tournoi 2 sets");
  const locationText = state.tournament.weekly
    ? [state.tournament.competitionCity, state.tournament.competitionCountry, state.tournament.competitionFlag].filter(Boolean).join(" · ")
    : "";
  const round16Matches = state.tournament.matches.filter((match) => match.round === "round16");
  const qualificationMatches = state.tournament.matches.filter((match) => match.round === "qualif");
  const quarterMatches = state.tournament.matches.filter((match) => match.round === "quarter");
  const semiMatches = state.tournament.matches.filter((match) => match.round === "semi");
  const final = tournamentMatchById("final");
  const champion = state.tournament.championCharacterId;
  els.tournamentPanel.innerHTML = `
    <div class="tournament-header">
      <div>
        <p class="eyebrow">Compétition</p>
        <h2>${title} ${renderHumanRoundBadge()}</h2>
        <span class="difficulty-reminder">${state.tournament.competitionSurfaceLabel ? `${escapeHtml(state.tournament.competitionSurfaceLabel)} · ` : ""}${tournamentDifficultyLabel(state.tournament.difficulty)}</span>
        ${locationText ? `<span class="difficulty-reminder tournament-location-reminder">${escapeHtml(locationText)}</span>` : ""}
        ${state.tournament.weekly ? `<span class="difficulty-reminder weekly-points-reminder">Points circuit gagnés : ${humanTournamentPoints().points}</span>` : ""}
      </div>
      <button class="small-button tournament-toggle-button" type="button" data-toggle-tournament>
        ${state.tournament.visible ? "Masquer le tableau" : "Afficher le tableau"}
      </button>
    </div>
    <div class="tournament-bracket ${state.tournament.visible ? "" : "hidden"}">
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
      <div class="tournament-champion">
        <span class="tournament-round-label">Vainqueur</span>
        <div class="tournament-trophy"><img src="${CROWN_IMAGE}" alt="Couronne du vainqueur" /></div>
        <strong>${champion ? tournamentPlayerLabel(champion) : "À déterminer"}</strong>
        ${final?.score ? `<div class="tournament-score">${final.score}</div>` : ""}
      </div>
    </div>
  `;
  els.tournamentPanel.classList.remove("hidden");
  els.tournamentPanel.querySelector("[data-toggle-tournament]")?.addEventListener("click", toggleTournamentPanel);
  els.tournamentPanel.querySelector("[data-start-tournament-semi]")?.addEventListener("click", startTournamentSemi);
  els.tournamentPanel.querySelector("[data-start-tournament-final]")?.addEventListener("click", startTournamentFinal);
}

function renderTournamentMatch(match, isFinal = false) {
  if (!match) return "";
  const unknownLabel = isFinal ? "À déterminer" : match.round === "semi" ? "À déterminer" : "Qualifié à déterminer";
  const playerA = match.playerA ? tournamentPlayerLabel(match.playerA) : unknownLabel;
  const playerB = match.playerB ? tournamentPlayerLabel(match.playerB) : unknownLabel;
  const scoreText = match.score || match.liveScore || "";
  const revealedWinner = match.score && match.winner ? match.winner : null;
  return `
    <article class="tournament-match ${state.tournament.currentMatch === match.id ? "current" : ""}">
      <span class="tournament-round-label">${isFinal ? "Finale" : match.label}</span>
      <div class="tournament-player-row ${revealedWinner === match.playerA ? "winner" : ""} ${isHumanTournamentEntry(match.playerA) ? "human-player" : ""}">
        <span>${playerA}</span>
        ${revealedWinner === match.playerA ? "<strong>✓</strong>" : ""}
      </div>
      <div class="tournament-player-row ${revealedWinner === match.playerB ? "winner" : ""} ${isHumanTournamentEntry(match.playerB) ? "human-player" : ""}">
        <span>${playerB}</span>
        ${revealedWinner === match.playerB ? "<strong>✓</strong>" : ""}
      </div>
      ${scoreText ? `<div class="tournament-score">${scoreText}</div>` : ""}
    </article>
  `;
}

function tournamentPlayerLabel(entry) {
  return isHumanTournamentEntry(entry)
    ? nicknameValue()
    : characterNameFromId(entry);
}

function toggleTournamentPanel() {
  if (!state.tournament.active) return;
  state.tournament.visible = !state.tournament.visible;
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
  if (hasReturnServiceRestriction(state.activePlayer)) activeConstraints.push("retour de service: pas Volée/Smash");
  const lines = [
    `<div><strong>Tour :</strong> ${state.gameOver ? "terminé" : active.name}</div>`,
    `<div><strong>Serveur :</strong> ${playerName(state.server)}</div>`,
    `<div><strong>Dernier coup :</strong> ${last ? `${last.name}${last.boosted ? " BOOST" : ""} · précision ${last.precision}` : "aucun"}</div>`,
    `<div class="${activeConstraints.length ? "constraint-line" : ""}"><strong>Contrainte :</strong> ${activeConstraints.length ? activeConstraints.join(" · ") : "placement insuffisant autorisé"}</div>`,
    `<div><strong>Boost :</strong> ${state.boostAvailableFor == null ? "fermé" : `ouvert pour ${playerName(state.boostAvailableFor)}`}</div>`,
    `<div><strong>Placement préparé :</strong> ${active.power != null ? turnEndPlacement(state.activePlayer) : 0}</div>`,
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

function matchResultImageForPlayer(player, playerIndex) {
  if (!state.setMatch.matchOver || state.setMatch.matchWinner == null) return null;
  const resultKey = state.setMatch.matchWinner === playerIndex ? "win" : "lose";
  return MATCH_RESULT_IMAGES[player.characterId]?.[resultKey] ?? null;
}

function renderCharacterCard(player, playerIndex) {
  const character = characterOf(player);
  const opponent = state.players[opponentOf(playerIndex)];
  const resultImage = matchResultImageForPlayer(player, playerIndex);
  const imageUrl = resultImage ?? CHARACTER_IMAGES[player.characterId]?.[player.characterSide] ?? CHARACTER_IMAGES[player.characterId]?.[0];
  const leader = leadingPlayerIndex();
  const leaderClass = leader === playerIndex ? " leading-power" : "";
  const enduranceClass = player.endurance <= 2 ? " low-endurance" : "";
  const crown = state.gameOver && state.resultInfo?.winner === playerIndex
    ? `<span class="winner-crown" aria-label="Vainqueur"><img src="${CROWN_IMAGE}" alt="Couronne" /></span>`
    : "";
  const aiNudge = playerIndex === SOLO_AI.playerIndex && state.activePlayer === playerIndex && !state.gameOver && !SERVER_SYNC.enabled && SOLO_AI.nudgeVisible
    ? '<button class="ai-nudge-button" type="button" data-force-ai-turn onclick="window.forceSoloAITurn?.()" onpointerdown="window.forceSoloAITurn?.()">Coach Max à jouer</button>'
    : "";
  const bonusReminders = [
    player.surfaceBonus,
    ...(player.permanentBonuses ?? []),
  ].filter(Boolean);
  const surfaceBonus = bonusReminders.length
    ? `<div class="surface-bonus-stack">${bonusReminders.map((bonus) => `<div class="surface-bonus-reminder">${escapeHtml(bonus.label)}</div>`).join("")}</div>`
    : "";
  return `
    <div class="character-zone">
      <div class="character-card">
        <img src="${imageUrl}" alt="${character.name}" />
        ${aiNudge}
      </div>
      ${surfaceBonus}
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
  if (isHumanTournamentRunOver()) {
    return '<button class="primary-button next-exchange-button next-set-button" type="button" data-exit-tournament>Sortir du tournoi</button>';
  }
  if (state.tournament.active && state.gameOver && state.setMatch.matchOver) {
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

function bindCenterButtons() {
  els.centerPlayedCard.querySelector("[data-next-set-exchange]")?.addEventListener("click", nextSetExchange);
  els.centerPlayedCard.querySelector("[data-next-solo-exchange]")?.addEventListener("click", nextSoloExchange);
  els.centerPlayedCard.querySelector("[data-next-full-set]")?.addEventListener("click", nextFullSet);
  els.centerPlayedCard.querySelector("[data-start-tournament-next-match]")?.addEventListener("click", startTournamentNextMatchFromCenter);
  els.centerPlayedCard.querySelector("[data-exit-tournament]")?.addEventListener("click", exitTournamentToLobby);
}

function startTournamentNextMatchFromCenter() {
  if (!state.tournament.active) return;
  if (state.tournament.stage === "readyNext" || state.tournament.stage === "readySemi") {
    startTournamentSemi();
    return;
  }
  if (state.tournament.stage === "readyFinal") {
    startTournamentFinal();
  }
}

async function exitTournamentToLobby() {
  if (!window.confirm("Confirmez vous sortir du tournoi ?")) return;
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
  if (player.nextExtraCost) badges.push({ text: `Prochain coup: +${player.nextExtraCost} endurance`, type: "effect" });
  if ((player.nextPowerMultiplier ?? 1) > 1) badges.push({ text: `Prochain coup: puissance x${player.nextPowerMultiplier}`, type: "effect" });
  if (player.exchangePrecisionBonus) badges.push({ text: `Échange: +${player.exchangePrecisionBonus} précision`, type: "effect" });
  if (player.exchangePlacementBonus) badges.push({ text: `Échange: +${player.exchangePlacementBonus} placement`, type: "effect" });
  if (player.exchangeFamilyPowerBonuses?.length) badges.push({ text: "Échange: bonus puissance par type", type: "effect" });
  if (player.exchangeAfterFamilyPlacementBonuses?.length) badges.push({ text: "Échange: bonus placement conditionnel", type: "effect" });
  if (player.placementPerOpponentLowPowerCardBonuses?.length) badges.push({ text: "Échange: bonus placement anti-carte faible", type: "effect" });
  if (player.protectedFromRemoval) badges.push({ text: "Actif: cartes protégées", type: "effect" });
  if (player.cancelNextOpponentEffect) badges.push({ text: "Actif: annule le prochain effet adverse", type: "effect" });
  if (player.freeBoostNext) badges.push({ text: "Actif: boost libre", type: "effect" });
  if (state.turnIgnoresPlacement[playerIndex]) badges.push({ text: "Joker: placement ignoré ce tour", type: "effect" });
  if (player.limitedFamilies) badges.push({ text: `Contrainte tour: ${player.limitedFamilies.join(" / ")}`, type: "constraint" });
  if (state.activePlayer === playerIndex && state.mandatoryPlacement && state.lastCard) {
    badges.push({ text: `Contrainte: placement ${state.lastCard.precision}+`, type: "constraint" });
  }
  if (state.boostAvailableFor === playerIndex) badges.push({ text: "Actif: boost possible", type: "effect" });
  if (hasReturnServiceRestriction(playerIndex)) {
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
  const passDisabled = playerIndex !== state.activePlayer || state.gameOver || !canUseSeat(playerIndex) || !tutorialAllowsPass();
  root.classList.toggle("active", playerIndex === state.activePlayer && !state.gameOver);
  root.innerHTML = `
    <header class="player-header">
      <div>
        <h2 class="${state.activePlayer === playerIndex && !state.gameOver ? "turn-name" : ""}">${player.name}</h2>
        <div class="player-nickname">${player.nickname ?? player.name}</div>
        <div class="turn-buttons">
          <button class="pass-button" type="button" data-pass="${playerIndex}" ${passDisabled ? "disabled" : ""}>${tutorialButtonCue("pass", playerIndex)}Passer</button>
          ${canEndTurn(playerIndex) ? `<button class="small-button end-turn-button" type="button" data-end-turn="${playerIndex}">${tutorialButtonCue("endTurn", playerIndex)}Terminer le tour</button>` : ""}
          ${canUndoTurn(playerIndex) ? `<button class="small-button undo-turn-button" type="button" data-undo-turn="${playerIndex}">Annuler le tour</button>` : ""}
        </div>
      </div>
      <div class="badges">
        ${state.server === playerIndex ? '<span class="badge server">Serveur</span>' : ""}
        ${state.activePlayer === playerIndex && !state.gameOver ? '<span class="badge active">À jouer</span>' : ""}
        ${player.nextPrecisionBonus ? `<span class="badge">+${player.nextPrecisionBonus} précision</span>` : ""}
        ${player.nextPlacementBonus ? `<span class="badge">+${player.nextPlacementBonus} placement</span>` : ""}
        ${player.nextDiscount ? `<span class="badge">-${player.nextDiscount} coût</span>` : ""}
        ${player.nextExtraCost ? `<span class="badge">+${player.nextExtraCost} coût</span>` : ""}
        ${(player.nextPowerMultiplier ?? 1) > 1 ? `<span class="badge">x${player.nextPowerMultiplier} puissance</span>` : ""}
        ${player.exchangePrecisionBonus ? `<span class="badge">+${player.exchangePrecisionBonus} précision échange</span>` : ""}
        ${player.exchangePlacementBonus ? `<span class="badge">+${player.exchangePlacementBonus} placement échange</span>` : ""}
        ${player.protectedFromRemoval ? `<span class="badge">cartes protégées</span>` : ""}
        ${state.activePlayer === playerIndex && turnEndPlacement(playerIndex) ? `<span class="badge">${turnEndPlacement(playerIndex)} placement préparé</span>` : ""}
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
}

function renderCard(playerIndex, card) {
  const player = state.players[playerIndex];
  const isHidden = SERVER_SYNC.enabled
    ? playerIndex !== SERVER_SYNC.seat
    : SOLO_AI.enabled
      ? playerIndex === SOLO_AI.playerIndex && !(state.gameOver && state.revealAiCards)
      : playerIndex !== state.activePlayer && !state.gameOver;
  const effectModeAllowed = canPlayNormal(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "effect", false);
  const placementModeAllowed = canPlayNormal(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "placement", false);
  const normalAllowed = canPlayNormal(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "normal", false);
  const boostAllowed = canPlayBoost(playerIndex, card) && tutorialAllowsPlay(playerIndex, card, "boost", true);
  const cost = effectiveCost(player, card);
  const stats = getCardStats(player, card, false);
  const placementTotal = totalTurnPlacement(playerIndex, card, false);
  const placementIssue = !isRemise(card) && state.lastCard && placementTotal < state.lastCard.precision && !state.turnIgnoresPlacement[playerIndex];
  const imageUrl = CARD_IMAGES[card.id];
  const hasDynamicStats = stats.precision !== card.precision || stats.placement !== card.placement || cost !== card.cost || state.turnPlacement[playerIndex] > 0;
  const showForbidEffect = playerIndex === state.activePlayer && isNextEffectCanceledFor(playerIndex) && Boolean(card.effectType);
  const riskyPlayClass = placementIssue && !state.mandatoryPlacement ? " risky-play-button" : "";
  if (isHidden) {
    return `
      <article class="card has-visual hidden-hand-card">
        ${renderCardBack()}
      </article>
    `;
  }
  return `
    <article class="card ${imageUrl ? "has-visual" : ""} ${isRemise(card) ? "remise-card" : ""} ${normalAllowed || effectModeAllowed || placementModeAllowed || boostAllowed ? "" : "unplayable"}">
      ${imageUrl ? `
        <div class="card-visual card-effect-forbid-host">
          <img src="${imageUrl}" alt="${card.name} - ${card.subtitle ?? card.family}" />
          ${showForbidEffect ? `<img class="forbid-effect-overlay" src="${FORBID_IMAGE}" alt="Effet annulé" />` : ""}
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
      <div class="card-actions ${isRemise(card) ? "remise-actions" : ""}">
        ${isRemise(card) ? `
          <button class="play-button${riskyPlayClass}" type="button" data-player="${playerIndex}" data-play="${card.uid}" data-mode="effect" ${effectModeAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "effect", false)}<span>${cost} END</span><strong>Effet</strong></button>
          <button class="boost-button" type="button" data-player="${playerIndex}" data-play="${card.uid}" data-mode="placement" ${placementModeAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "placement", false)}<span>${cost} END</span><strong>Remise</strong></button>
        ` : `
          <button class="play-button${riskyPlayClass}" type="button" data-player="${playerIndex}" data-play="${card.uid}" ${normalAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "normal", false)}<span>${cost} END</span><strong>Jouer</strong></button>
          <button class="boost-button" type="button" data-player="${playerIndex}" data-boost="${card.uid}" ${boostAllowed ? "" : "disabled"}>${tutorialButtonCue("play", playerIndex, card, "boost", true)}Boost</button>
        `}
      </div>
      ${placementIssue && !state.mandatoryPlacement ? '<div class="stat placement boost-warning">Placement total insuffisant : <strong>BOOST</strong> adverse possible</div>' : ""}
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

function renderLog() {
  els.log.innerHTML = state.log.slice(0, 14).map((line) => `<p>${formatLogLine(line)}</p>`).join("");
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
      state.pendingBoost = null;
      playCard(playerIndex, cardUid, true, sacrificeUid);
      completeTutorialAction({ kind: "play", playerIndex, cardId: boostCard?.id, mode: "boost" });
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
  MENU_STATE.tournamentDifficulty = normalizeAiDifficulty(MENU_STATE.tournamentDifficulty);
  updateMenuSelection();
  updateTournamentDifficultyButton();
  renderAuthState();
  updateAccessControls();
  loadAuthState();
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
  els.generateProCodesButton?.addEventListener("click", generateProCodes);
  els.adminPrevPageButton?.addEventListener("click", () => loadAdminUsers(AUTH_STATE.adminPage - 1));
  els.adminNextPageButton?.addEventListener("click", () => loadAdminUsers(AUTH_STATE.adminPage + 1));
  els.adminNextWeekButton?.addEventListener("click", adminAdvanceCircuitWeek);
  els.refreshRankingButton?.addEventListener("click", loadRanking);
  els.openRankingPageButton?.addEventListener("click", showRankingScreen);
  els.backToLobbyFromRankingButton?.addEventListener("click", showMenuScreen);
  els.backToLobbyFromProfileButton?.addEventListener("click", showMenuScreen);
  els.backToProfileFromCharacterButton?.addEventListener("click", showProfileScreen);
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
  document.querySelector("[data-start-tutorial]")?.addEventListener("click", startTutorial);
  els.aiDifficultyButton?.addEventListener("click", cycleTournamentDifficulty);
  els.refreshLobbyButton?.addEventListener("click", refreshLobbyRooms);
  els.createLobbyRoomButton?.addEventListener("click", createLobbyRoom);
  refreshLobbyRooms();
  loadRanking();
  loadCompetitions();
  window.clearInterval(MENU_STATE.lobbyTimer);
  MENU_STATE.lobbyTimer = window.setInterval(() => {
    if (!els.menuScreen?.classList.contains("hidden")) refreshLobbyRooms();
  }, 3500);
  if (resetTokenFromUrl()) showResetPasswordScreen();
}

els.newGameButton?.addEventListener("click", newGame);
els.returnLobbyButton?.addEventListener("click", openReturnLobbyDialog);
els.revealAiButton?.addEventListener("click", toggleRevealAiCards);
els.exportLogsButton?.addEventListener("click", exportLogsFile);
document.addEventListener("click", (event) => {
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
window.forceSoloAITurn = forceSoloAITurn;
window.tennisLightDebug = { CARD_LIBRARY, newGame, startTutorial, startSoloGame, startSetAiGame, startMatchMode, startTournamentMode, nextSetExchange, nextFullSet, startOnlineGame, pass, playCard, endTurn, restoreTurnSnapshot, getStoredMatchLogs, getStoredActionLogs, exportLogsFile, render, state };
newGame();
initMenu();
initServerSync();
