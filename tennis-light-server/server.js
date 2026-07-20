const http = require("http");
const https = require("https");
const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
let PgPool = null;
try {
  ({ Pool: PgPool } = require("pg"));
} catch (error) {
  PgPool = null;
}

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const rooms = new Map();
const friendlyTournaments = new Map();
const playerActivities = new Map();
const LIVE_ACTIVITY_TTL_MS = 15000;
const ROOM_ACTIVITY_TTL_MS = 60000;
const FRIENDLY_PRESENCE_STALE_MS = 4000;
const FRIENDLY_RECONNECT_GRACE_MS = 20000;
const COACH_IDS = new Set(["coachJu", "coachMax", "coachCarla", "coachClem"]);
const SESSION_COOKIE = "tc_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 210000;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const ADMIN_EMAIL = "julien.castagnoli@mediality.fr";
const USER_ROLES = new Set(["free", "pro", "pro_plus", "admin"]);
const PRO_ROLES = new Set(["pro", "pro_plus", "admin"]);
const COACH_CHARACTER_IDS = ["coachJu", "coachMax", "coachCarla", "coachClem"];
const HISTORIC_CHARACTER_IDS = [
  "theoBriancourt", "alessandraConti", "saharaJackson", "kjellBlomqvist", "kojiIwata", "elianaMarquez",
  "bryanGoodwin", "calvinBrentwood", "javierRamirez", "petraEckermann",
];
const NEW_CHARACTER_IDS = [
  "jonasFalkenried", "yunaSeo", "ikerSalvat", "loganBrooks", "kavyaSaran", "zariaCampbell",
  "renAoshima", "yasmineElMansouri", "daanVermeer", "lukasEberhardt", "milanVerhaegen",
];
const ALL_PROFILE_CHARACTER_IDS = [...COACH_CHARACTER_IDS, ...HISTORIC_CHARACTER_IDS, ...NEW_CHARACTER_IDS];
const PRO_REWARD_CHARACTER_IDS = ["milanVerhaegen"];
const GAME_NEWS = [
  {
    id: "v166-milan-verhaegen-pro-unlock",
    publishedAt: "2026-07-19",
    title: "Milan Verhaegen rejoint les joueurs PRO",
    characterId: "milanVerhaegen",
    audienceRoles: ["pro", "pro_plus", "admin"],
    message: "Bravo à Milan Verhaeghen, meilleur joueur de la semaine dernière. Pour fêter sa progression au classement, ce personnage est désormais débloqué et jouable. Pour l'utiliser, choisissez le depuis votre page profil. A bientôt sur les courts ! (signé - Coach Ju)",
    signature: "Coach Ju",
  },
];
const CIRCUIT_AI_CHARACTER_IDS = [...HISTORIC_CHARACTER_IDS, ...NEW_CHARACTER_IDS];
const AI_CHARACTER_NAMES = {
  theoBriancourt: "Theo Briancourt",
  alessandraConti: "Alessandra Conti",
  saharaJackson: "Sahara Jackson",
  kjellBlomqvist: "Kjell Blomqvist",
  kojiIwata: "Koji Iwata",
  elianaMarquez: "Eliana Marquez",
  bryanGoodwin: "Bryan Goodwin",
  calvinBrentwood: "Calvin Brentwood",
  javierRamirez: "Javier Ramirez",
  petraEckermann: "Petra Eckermann",
  jonasFalkenried: "Jonas Falkenried",
  yunaSeo: "Yuna Seo",
  ikerSalvat: "Iker Salvat",
  loganBrooks: "Logan Brooks",
  kavyaSaran: "Kavya Saran",
  zariaCampbell: "Zaria Campbell",
  renAoshima: "Ren Aoshima",
  yasmineElMansouri: "Yasmine El Mansouri",
  daanVermeer: "Daan Vermeer",
  lukasEberhardt: "Lukas Eberhardt",
  milanVerhaegen: "Milan Verhaegen",
};
const AI_SURFACE_PREFERENCES = {
  theoBriancourt: "clay",
  alessandraConti: "hard",
  saharaJackson: "clay",
  kjellBlomqvist: "hard",
  kojiIwata: "grass",
  elianaMarquez: "grass",
  bryanGoodwin: "hard",
  calvinBrentwood: "grass",
  javierRamirez: "clay",
  petraEckermann: "hard",
  jonasFalkenried: "hard",
  yunaSeo: "hard",
  ikerSalvat: "clay",
  loganBrooks: "grass",
  kavyaSaran: "hard",
  zariaCampbell: "grass",
  renAoshima: "hard",
  yasmineElMansouri: "clay",
  daanVermeer: "grass",
  lukasEberhardt: "clay",
  milanVerhaegen: "grass",
};
const TOURNAMENT_SEED_CANDIDATES = {
  grass: ["kojiIwata", "elianaMarquez", "calvinBrentwood"],
  hard: ["petraEckermann", "bryanGoodwin", "alessandraConti", "kjellBlomqvist"],
  clay: ["saharaJackson", "javierRamirez", "theoBriancourt"],
};
const SURFACES = ["grass", "hard", "clay"];
const SURFACE_LABELS = { grass: "HERBE", hard: "DUR", clay: "TERRE-BATTUE" };
const CIRCUIT_SEASON_LENGTH = 20;
const DAILY_RETRY_LIMIT = 5;
const ADMIN_MANUAL_COMPETITION_ID = "__admin_manual_season_points__";
const ADMIN_ATTEMPT_COMPETITION_ID = "__admin_weekly_attempts__";
const WORLD_TOUR_CSV = path.join(__dirname, "world-tour.csv");
const COUNTRY_FLAGS = {
  Allemagne: "🇩🇪", Argentine: "🇦🇷", Australie: "🇦🇺", Autriche: "🇦🇹", Belgique: "🇧🇪",
  Bresil: "🇧🇷", Brésil: "🇧🇷", Canada: "🇨🇦", Chine: "🇨🇳", Croatie: "🇭🇷",
  Danemark: "🇩🇰", Espagne: "🇪🇸", "Etats-Unis": "🇺🇸", "États-Unis": "🇺🇸", France: "🇫🇷",
  Italie: "🇮🇹", Japon: "🇯🇵", Maroc: "🇲🇦", Mexique: "🇲🇽", Norvege: "🇳🇴",
  Norvège: "🇳🇴", PaysBas: "🇳🇱", "Pays-Bas": "🇳🇱", Portugal: "🇵🇹", RoyaumeUni: "🇬🇧",
  "Royaume-Uni": "🇬🇧", Serbie: "🇷🇸", Suede: "🇸🇪", Suède: "🇸🇪", Suisse: "🇨🇭",
};
const LEVEL_LABELS = {
  Circuit: "Challenge 400",
  Major: "Major 600",
  Premier: "Premier 1000",
  Crown: "Crown 1500",
  Slam: "Slam 2000",
  Finals: "Tennis Courts World Finals 4000",
};
const SURFACE_FROM_CSV = {
  DUR: "hard",
  HERBE: "grass",
  "TERRE-BATTUE": "clay",
};
const POINT_TABLES = {
  400: { qualif: 0, quarter: 50, semi: 100, finalist: 200, winner: 400 },
  600: { qualif: 0, quarter: 75, semi: 150, finalist: 300, winner: 600 },
  1000: { qualif: 0, quarter: 100, semi: 200, finalist: 500, winner: 1000 },
  1500: { qualif: 0, quarter: 150, semi: 350, finalist: 750, winner: 1500 },
  2000: { qualif: 0, quarter: 200, semi: 500, finalist: 1200, winner: 2000 },
  4000: { qualif: 0, quarter: 400, semi: 1000, finalist: 2400, winner: 4000 },
};
const DIRECT_THRESHOLDS = { 400: 2000, 600: 2800, 1000: 4400, 1500: 6400, 2000: 8400, 4000: 12000 };
const COMPETITION_DEFINITIONS = loadWorldTourDefinitions();
const authMemory = {
  users: new Map(),
  sessions: new Map(),
  passwordResetTokens: new Map(),
  weeklyScores: new Map(),
  proCodes: new Map(),
  circuitWeekScores: new Map(),
  circuitAiWeekScores: new Map(),
  circuitAiHumanBonuses: new Map(),
  circuitAttempts: new Map(),
  circuitSaves: new Map(),
  circuitResets: new Map(),
  circuitResults: [],
  aiResults: new Map(),
  appState: new Map(),
  humanMatchLogs: new Map(),
};
const db = PgPool && process.env.DATABASE_URL
  ? new PgPool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
  })
  : null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function makeId(size = 4) {
  return crypto.randomBytes(size).toString("hex").toUpperCase();
}

function makeToken() {
  return crypto.randomBytes(18).toString("base64url");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeNickname(nickname) {
  return String(nickname || "").trim().slice(0, 24);
}

function comparableNickname(nickname) {
  return String(nickname || "")
    .trim()
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const RESERVED_NICKNAMES = new Set([
  "Julien",
  "Julien Casta",
  "Julien Castagnoli",
  "Julien Vendaume",
  "Novax Djocovid",
  "Julien C",
  "Le créateur",
  "Créateur",
].map(comparableNickname));

function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();
  return USER_ROLES.has(value) ? value : "free";
}

function defaultRoleForEmail(email) {
  return normalizeEmail(email) === ADMIN_EMAIL ? "admin" : "free";
}

function canUseReservedNickname(user) {
  return normalizeRole(user?.role) === "admin" || normalizeEmail(user?.email) === ADMIN_EMAIL;
}

function isReservedNickname(nickname) {
  return RESERVED_NICKNAMES.has(comparableNickname(nickname));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function seenNewsIds(user) {
  const raw = user?.seen_news || user?.seenNews || "";
  return new Set(String(raw).split(",").map((id) => id.trim()).filter(Boolean));
}

function pendingNewsForUser(user) {
  if (!user) return [];
  const role = normalizeRole(user.role);
  if (!PRO_ROLES.has(role)) return [];
  const seen = seenNewsIds(user);
  return GAME_NEWS.filter((news) => news.audienceRoles.includes(role) && !seen.has(news.id));
}

function publicUser(user) {
  return user ? {
    id: user.id,
    accountNumber: user.account_number || user.accountNumber || null,
    email: user.email,
    nickname: user.nickname,
    role: normalizeRole(user.role),
    proCode: user.pro_code || user.proCode || null,
    selectedCharacterId: user.selected_character_id || user.selectedCharacterId || "tennisHope",
    unlockedCharacters: userUnlockedCharacters(user),
    pendingNews: pendingNewsForUser(user),
    bestWorldRank: user.best_world_rank || user.bestWorldRank || null,
    weeksWorldNumberOne: user.weeks_world_number_one || user.weeksWorldNumberOne || 0,
    weeksWorldTop3: user.weeks_world_top3 || user.weeksWorldTop3 || 0,
    weeksWorldTop5: user.weeks_world_top5 || user.weeksWorldTop5 || 0,
    weeksWorldTop10: user.weeks_world_top10 || user.weeksWorldTop10 || 0,
    createdAt: user.created_at || user.createdAt,
  } : null;
}

function adminPublicUser(user) {
  const base = publicUser(user);
  if (!base) return null;
  return {
    ...base,
    scoreRef: Number(user.score_ref || user.scoreRef || 0),
    scoreWeek: Number(user.score_week || user.scoreWeek || 0),
    scoreTotal: Number(user.score_total || user.scoreTotal || 0),
  };
}

function parisDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function parisOffsetMs(date = new Date()) {
  const parts = parisDateParts(date);
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - date.getTime();
}

function parisLocalDateToUtc(year, month, day, hour, minute = 0, second = 0) {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  return new Date(utcGuess - parisOffsetMs(new Date(utcGuess)));
}

function circuitUpdateBoundariesAround(date = new Date(), dayRadius = 18) {
  const parts = parisDateParts(date);
  const center = Date.UTC(parts.year, parts.month - 1, parts.day);
  const boundaries = [];
  for (let offset = -dayRadius; offset <= dayRadius; offset += 1) {
    const localDate = new Date(center + offset * 86400000);
    const year = localDate.getUTCFullYear();
    const month = localDate.getUTCMonth() + 1;
    const day = localDate.getUTCDate();
    const weekday = localDate.getUTCDay();
    if (weekday === 3) boundaries.push(parisLocalDateToUtc(year, month, day, 14, 0, 0));
    if (weekday === 0) boundaries.push(parisLocalDateToUtc(year, month, day, 2, 0, 0));
  }
  return boundaries.sort((a, b) => a - b);
}

function previousCircuitBoundaryAt(date = new Date()) {
  const boundaries = circuitUpdateBoundariesAround(date);
  return boundaries.filter((boundary) => boundary <= date).pop() || boundaries[0] || date;
}

function nextCircuitBoundaryAt(date = new Date()) {
  const boundaries = circuitUpdateBoundariesAround(date);
  return boundaries.find((boundary) => boundary > date) || boundaries[boundaries.length - 1] || date;
}

function currentWeekKey(date = new Date()) {
  return previousCircuitBoundaryAt(date).toISOString();
}

function nextCircuitUpdateAt(date = new Date()) {
  return nextCircuitBoundaryAt(date).toISOString();
}

function countCircuitBoundariesBetween(storedKey, currentKey) {
  const start = new Date(storedKey);
  const end = new Date(currentKey);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return 1;
  const boundaries = circuitUpdateBoundariesAround(end, 80);
  return Math.max(1, boundaries.filter((boundary) => boundary > start && boundary <= end).length);
}

function loadWorldTourDefinitions() {
  if (!fs.existsSync(WORLD_TOUR_CSV)) {
    return [
      { id: "circuit400", week: 1, slot: 1, type: "Challenge 400", level: "Circuit", name: "Blue Lantern Cup", city: "Vancouver", country: "Canada", flag: "🇨🇦", surface: "hard", surfaceLabel: "DUR", difficulty: "normal", targetSets: 2, points: POINT_TABLES[400], directThreshold: DIRECT_THRESHOLDS[400], value: 400 },
      { id: "major600", week: 1, slot: 2, type: "Major 600", level: "Major", name: "Clayforge Open", city: "Valence", country: "Espagne", flag: "🇪🇸", surface: "clay", surfaceLabel: "TERRE-BATTUE", difficulty: "champion", targetSets: 2, points: POINT_TABLES[600], directThreshold: DIRECT_THRESHOLDS[600], value: 600 },
      { id: "premier1000", week: 1, slot: 3, type: "Premier 1000", level: "Premier", name: "Oakspire Masters", city: "Copenhague", country: "Danemark", flag: "🇩🇰", surface: "grass", surfaceLabel: "HERBE", difficulty: "normal", targetSets: 2, points: POINT_TABLES[1000], directThreshold: DIRECT_THRESHOLDS[1000], value: 1000 },
      { id: "crown1500", week: 1, slot: 4, type: "Crown 1500", level: "Crown", name: "Sunbridge Crown", city: "Tokyo", country: "Japon", flag: "🇯🇵", surface: "hard", surfaceLabel: "DUR", difficulty: "champion", targetSets: 2, points: POINT_TABLES[1500], directThreshold: DIRECT_THRESHOLDS[1500], value: 1500 },
      { id: "slam2000", week: 1, slot: 5, type: "Slam 2000", level: "Slam", name: "Grand Slam Academy", city: "Paris", country: "France", flag: "🇫🇷", surface: "clay", surfaceLabel: "TERRE-BATTUE", difficulty: "champion", targetSets: 3, points: POINT_TABLES[2000], directThreshold: DIRECT_THRESHOLDS[2000], value: 2000 },
    ];
  }
  const rows = fs.readFileSync(WORLD_TOUR_CSV, "utf8").trim().split(/\r?\n/);
  const headers = rows.shift().replace(/^\uFEFF/, "").split(";");
  const definitions = rows.map((line) => {
    const values = line.split(";");
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    const pointsValue = Number(row.points || 400);
    const level = row.niveau || "Circuit";
    const surface = SURFACE_FROM_CSV[row.surface] || "hard";
    return {
      id: row.tournament_id,
      week: Number(row.semaine || 1),
      slot: Number(row.slot_semaine || 1),
      level,
      type: LEVEL_LABELS[level] || `${level} ${pointsValue}`,
      value: pointsValue,
      name: row.nom_tournoi,
      city: row.ville,
      country: row.pays,
      flag: COUNTRY_FLAGS[row.pays] || "🏳️",
      surface,
      surfaceLabel: SURFACE_LABELS[surface],
      difficulty: pointsValue === 400 || pointsValue === 1000 ? "normal" : "champion",
      targetSets: pointsValue >= 2000 ? 3 : 2,
      points: POINT_TABLES[pointsValue] || POINT_TABLES[400],
      directThreshold: DIRECT_THRESHOLDS[pointsValue] || 500,
      eventType: row.type_epreuve || "Tour",
    };
  });
  const hasFinals = definitions.some((competition) => competition.value === 4000);
  if (!hasFinals) {
    definitions.push({
      id: "TCWT-FINALS-20",
      week: CIRCUIT_SEASON_LENGTH,
      slot: 6,
      level: "Finals",
      type: LEVEL_LABELS.Finals,
      value: 4000,
      name: "Tennis Courts World Finals",
      city: "Paris",
      country: "France",
      flag: "🇫🇷",
      surface: "hard",
      surfaceLabel: SURFACE_LABELS.hard,
      difficulty: "champion",
      targetSets: 3,
      points: POINT_TABLES[4000],
      directThreshold: DIRECT_THRESHOLDS[4000],
      eventType: "Finals",
    });
  }
  return definitions;
}

function seededNumber(seed) {
  const hash = crypto.createHash("sha256").update(seed).digest();
  return hash.readUInt32BE(0) / 0xffffffff;
}

async function getAppStateValue(key, fallback = null) {
  if (db) {
    const result = await db.query("SELECT value FROM app_state WHERE key = $1", [key]);
    return result.rows[0]?.value ?? fallback;
  }
  return authMemory.appState.get(key) ?? fallback;
}

async function setAppStateValue(key, value) {
  if (db) {
    await db.query(`
      INSERT INTO app_state (key, value) VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `, [key, String(value)]);
    return;
  }
  authMemory.appState.set(key, String(value));
}

async function updateRankingMilestonesForWeek(season, week) {
  if (!db) return;
  const marker = `ranking_milestones_${season}_${week}`;
  if (await getAppStateValue(marker, null)) return;
  const nextPeriod = nextCircuitPeriod(season, week);
  const refPeriodKeys = previousCircuitPeriods(nextPeriod.season, nextPeriod.week).map((period) => period.key);
  const currentPeriodKey = circuitPeriodKey(season, week);
  await db.query(`
    WITH human_scores AS (
      SELECT users.id AS user_id,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE CONCAT(circuit_week_scores.season_number, ':', circuit_week_scores.week_number) = ANY($1::text[])), 0)::int AS score_ref,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE CONCAT(circuit_week_scores.season_number, ':', circuit_week_scores.week_number) = $2), 0)::int AS score_week,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE circuit_week_scores.season_number = $3), 0)::int AS score_total,
        users.nickname
      FROM users
      LEFT JOIN circuit_week_scores
        ON circuit_week_scores.user_id = users.id
      GROUP BY users.id, users.nickname
    ),
    ai_scores AS (
      SELECT CONCAT('ai:', ai_character_id) AS user_id,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])), 0)::int AS score_ref,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = $2), 0)::int AS score_week,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE season_number = $3), 0)::int AS score_total,
        ai_character_id AS nickname
      FROM circuit_ai_week_scores
      GROUP BY ai_character_id
    ),
    combined AS (
      SELECT * FROM human_scores
      UNION ALL
      SELECT * FROM ai_scores
    ),
    ranked AS (
      SELECT user_id,
        ROW_NUMBER() OVER (
          ORDER BY score_ref DESC, score_week DESC, score_total DESC, nickname ASC
        ) AS rank
      FROM combined
      WHERE score_ref > 0
    )
    UPDATE users
    SET best_world_rank = CASE
          WHEN users.best_world_rank IS NULL THEN ranked.rank
          ELSE LEAST(users.best_world_rank, ranked.rank)
        END,
        weeks_world_number_one = users.weeks_world_number_one + CASE WHEN ranked.rank = 1 THEN 1 ELSE 0 END,
        weeks_world_top3 = users.weeks_world_top3 + CASE WHEN ranked.rank <= 3 THEN 1 ELSE 0 END,
        weeks_world_top5 = users.weeks_world_top5 + CASE WHEN ranked.rank <= 5 THEN 1 ELSE 0 END,
        weeks_world_top10 = users.weeks_world_top10 + CASE WHEN ranked.rank <= 10 THEN 1 ELSE 0 END
    FROM ranked
    WHERE users.id = ranked.user_id
  `, [refPeriodKeys, currentPeriodKey, season]);
  await db.query(`
    WITH human_scores AS (
      SELECT users.id AS user_id, users.nickname,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE CONCAT(circuit_week_scores.season_number, ':', circuit_week_scores.week_number) = ANY($1::text[])), 0)::int AS score_ref,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE CONCAT(circuit_week_scores.season_number, ':', circuit_week_scores.week_number) = $2), 0)::int AS score_week,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE circuit_week_scores.season_number = $3), 0)::int AS score_total
      FROM users
      LEFT JOIN circuit_week_scores ON circuit_week_scores.user_id = users.id
      GROUP BY users.id, users.nickname
    ),
    ai_scores AS (
      SELECT CONCAT('ai:', ai_character_id) AS user_id, ai_character_id AS nickname,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])), 0)::int AS score_ref,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = $2), 0)::int AS score_week,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE season_number = $3), 0)::int AS score_total
      FROM circuit_ai_week_scores GROUP BY ai_character_id
    ),
    ranked AS (
      SELECT user_id, ROW_NUMBER() OVER (ORDER BY score_ref DESC, score_week DESC, score_total DESC, nickname ASC)::int AS rank
      FROM (SELECT * FROM human_scores UNION ALL SELECT * FROM ai_scores) combined
      WHERE score_ref > 0
    ),
    human_ranked AS (
      SELECT ranked.user_id, ranked.rank FROM ranked WHERE ranked.user_id NOT LIKE 'ai:%' AND ranked.rank <= 10
    ),
    honors AS (
      SELECT human_ranked.user_id, human_ranked.rank, thresholds.honor_type, thresholds.label
      FROM human_ranked
      CROSS JOIN (VALUES
        (10, 'world_top_10', 'Top 10 atteint'),
        (5, 'world_top_5', 'Top 5 atteint'),
        (3, 'world_top_3', 'Top 3 atteint'),
        (1, 'world_number_one', 'Numéro 1 mondial atteint')
      ) AS thresholds(max_rank, honor_type, label)
      WHERE human_ranked.rank <= thresholds.max_rank
    )
    INSERT INTO circuit_honors (honor_key, user_id, honor_type, label, season_number, week_number, rank, points)
    SELECT CONCAT(user_id, ':', honor_type), user_id, honor_type, label, $3, $4, rank, 0
    FROM honors
    ON CONFLICT (honor_key) DO NOTHING
  `, [refPeriodKeys, currentPeriodKey, season, week]);
  await setAppStateValue(marker, new Date().toISOString());
}

async function finalizeCircuitSeason(season) {
  if (!db) return;
  const marker = `season_finalized_${season}`;
  if (await getAppStateValue(marker, null)) return;
  await db.query(`
    WITH totals AS (
      SELECT users.id AS user_id, users.nickname, COALESCE(SUM(circuit_week_scores.points), 0)::int AS points
      FROM users
      LEFT JOIN circuit_week_scores ON circuit_week_scores.user_id = users.id AND circuit_week_scores.season_number = $1
      GROUP BY users.id, users.nickname
    ),
    ranked AS (
      SELECT user_id, points, ROW_NUMBER() OVER (ORDER BY points DESC, nickname ASC)::int AS rank
      FROM totals WHERE points > 0
    )
    INSERT INTO circuit_honors (honor_key, user_id, honor_type, label, season_number, week_number, rank, points)
    SELECT CONCAT(user_id, ':season_final:', $1), user_id, 'season_final',
      CONCAT('SAISON ', $1, ' - ', rank, ' - ', points, ' POINTS CUMULÉS SUR LA SAISON'),
      $1, 20, rank, points
    FROM ranked
    ON CONFLICT (honor_key) DO NOTHING
  `, [season]);
  await db.query(`
    WITH totals AS (
      SELECT users.id AS user_id, users.nickname, COALESCE(SUM(circuit_week_scores.points), 0)::int AS points
      FROM users
      LEFT JOIN circuit_week_scores ON circuit_week_scores.user_id = users.id AND circuit_week_scores.season_number = $1
      GROUP BY users.id, users.nickname
    ),
    ranked AS (
      SELECT user_id, points, ROW_NUMBER() OVER (ORDER BY points DESC, nickname ASC)::int AS rank
      FROM totals WHERE points > 0
    )
    INSERT INTO circuit_honors (honor_key, user_id, honor_type, label, season_number, week_number, rank, points)
    SELECT CONCAT(user_id, ':season_trophy:', $1), user_id, 'season_trophy',
      CASE WHEN rank = 1 THEN CONCAT('Trophée de la saison, champion du monde - SAISON ', $1)
        ELSE CONCAT('Trophée de la saison, PLACE ', rank, ' - SAISON ', $1) END,
      $1, 20, rank, points
    FROM ranked WHERE rank <= 10
    ON CONFLICT (honor_key) DO NOTHING
  `, [season]);
  await setAppStateValue(marker, new Date().toISOString());
}

function aiCharacterName(characterId) {
  return AI_CHARACTER_NAMES[characterId] || characterId;
}

function seededRandom(seed) {
  const hash = crypto.createHash("sha256").update(String(seed)).digest();
  return hash.readUInt32BE(0) / 0xffffffff;
}

function simulatedAiIntelligence(rankIa, seed = "") {
  if (rankIa === 1) return "legend";
  if (rankIa === 2) return "champion";
  if (rankIa <= 4) return seededRandom(`${seed}:level`) < 0.5 ? "expert" : "champion";
  if (rankIa <= 6) return "expert";
  if (rankIa <= 10) return seededRandom(`${seed}:level`) < 0.5 ? "normal" : "expert";
  if (rankIa <= 14) return "normal";
  if (rankIa <= 18) return seededRandom(`${seed}:level`) < 0.5 ? "normal" : "amateur";
  return "amateur";
}

function aiMatchStrength(characterId, competition, season, week, slot, bonusTopIds = [], simulationNonce = "", rankingOrder = [], seedBonusCounts = {}) {
  const rankIa = Math.max(1, rankingOrder.indexOf(characterId) + 1 || CIRCUIT_AI_CHARACTER_IDS.length);
  const intelligence = simulatedAiIntelligence(rankIa, `${simulationNonce}:${competition.id}:${season}:${week}:${characterId}`);
  const intelligenceBonus = { amateur: -5, normal: 0, expert: 5, champion: 10, legend: 15 }[intelligence] || 0;
  const rankBonus = Math.max(0, CIRCUIT_AI_CHARACTER_IDS.length + 1 - rankIa) * 0.7;
  const surfaceBonus = AI_SURFACE_PREFERENCES[characterId] === competition.surface ? 3 : 0;
  const protectedBonus = bonusTopIds.includes(characterId) ? 2 : 0;
  const tournamentBonus = Number(seedBonusCounts[characterId] || 0) * 4;
  const matchForm = (seededRandom(`${simulationNonce}:${characterId}:${competition.id}:${season}:${week}:${slot}:form`) - 0.5) * 12;
  return 50 + rankBonus + intelligenceBonus + surfaceBonus + protectedBonus + tournamentBonus + matchForm;
}

function deterministicShuffle(items, seed) {
  return [...items]
    .map((item) => ({ item, order: seededRandom(`${seed}:${item}`) }))
    .sort((a, b) => a.order - b.order || String(a.item).localeCompare(String(b.item), "fr"))
    .map((entry) => entry.item);
}

function simulatedAiMatchPerformancePoints(playerA, playerB, winner, targetSets, seed) {
  const loser = winner === playerA ? playerB : playerA;
  const points = new Map([[playerA, 0], [playerB, 0]]);
  const winningSetScores = [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [7, 5], [7, 6]];
  const losingSetScores = [[4, 6], [3, 6], [5, 7], [6, 7]];
  let winnerSets = 0;
  let loserSets = 0;
  let setIndex = 0;
  while (winnerSets < targetSets) {
    const winnerLosesSet = loserSets < targetSets - 1
      && seededRandom(`${seed}:set:${setIndex}:outcome`) < 0.28;
    const pool = winnerLosesSet ? losingSetScores : winningSetScores;
    const score = pool[Math.floor(seededRandom(`${seed}:set:${setIndex}:score`) * pool.length)];
    const setWinner = winnerLosesSet ? loser : winner;
    points.set(setWinner, (points.get(setWinner) || 0) + 5 + Math.abs(score[0] - score[1]));
    if (winnerLosesSet) loserSets += 1;
    else winnerSets += 1;
    setIndex += 1;
  }
  if (loserSets === 0) points.set(winner, (points.get(winner) || 0) + 5);
  return points;
}

function simulatedAiTournamentPoints(competition, season, week, bonusTopIds = [], simulationNonce = "", rankingOrder = []) {
  const rankById = new Map(rankingOrder.map((characterId, index) => [characterId, index + 1]));
  const rankOf = (characterId) => rankById.get(characterId) || 99999;
  const byRanking = (a, b) => rankOf(a) - rankOf(b) || aiCharacterName(a).localeCompare(aiCharacterName(b), "fr");
  const specialists = CIRCUIT_AI_CHARACTER_IDS
    .filter((characterId) => AI_SURFACE_PREFERENCES[characterId] === competition.surface)
    .sort(byRanking)
    .slice(0, 2);
  const nonSpecialists = CIRCUIT_AI_CHARACTER_IDS
    .filter((characterId) => AI_SURFACE_PREFERENCES[characterId] !== competition.surface)
    .sort(byRanking)
    .slice(0, 2);
  const seeds = [...specialists, ...nonSpecialists].sort(byRanking);
  const positions = Array(17).fill(null);
  seeds.forEach((characterId, index) => { positions[index + 1] = characterId; });

  const groupTwoPool = CIRCUIT_AI_CHARACTER_IDS.filter((id) => !seeds.includes(id)).sort(byRanking).slice(0, 6);
  const groupTwo = deterministicShuffle(groupTwoPool, `${simulationNonce}:${competition.id}:${season}:${week}:group2`)
    .slice(0, 4)
    .sort(byRanking);
  groupTwo.forEach((characterId, index) => { positions[index + 5] = characterId; });

  const placed = new Set(positions.filter(Boolean));
  const groupThree = deterministicShuffle(
    CIRCUIT_AI_CHARACTER_IDS.filter((id) => !placed.has(id)),
    `${simulationNonce}:${competition.id}:${season}:${week}:group3-selection`,
  ).slice(0, 8);
  deterministicShuffle(groupThree, `${simulationNonce}:${competition.id}:${season}:${week}:group3-positions`)
    .forEach((characterId, index) => { positions[index + 9] = characterId; });

  const seedBonusCounts = Object.fromEntries(seeds.map((characterId) => [
    characterId,
    1 + (seededRandom(`${simulationNonce}:${competition.id}:${season}:${week}:${characterId}:second-bonus`) < 0.5 ? 1 : 0),
  ]));

  const table = competition.points || POINT_TABLES[competition.value] || POINT_TABLES[400];
  const awards = new Map();
  const performanceAwards = new Map();
  const playRound = (players, roundLabel, loserPoints) => {
    const winners = [];
    for (let index = 0; index < players.length; index += 2) {
      const playerA = players[index];
      const playerB = players[index + 1];
      const strengthA = aiMatchStrength(playerA, competition, season, week, `${roundLabel}:${index}`, bonusTopIds, simulationNonce, rankingOrder, seedBonusCounts);
      const strengthB = aiMatchStrength(playerB, competition, season, week, `${roundLabel}:${index + 1}`, bonusTopIds, simulationNonce, rankingOrder, seedBonusCounts);
      const chanceA = Math.max(0.08, Math.min(0.92, 1 / (1 + Math.exp(-(strengthA - strengthB) / 10))));
      const roll = seededRandom(`${simulationNonce}:${competition.id}:${season}:${week}:${roundLabel}:${index}:winner`);
      const winner = roll < chanceA ? playerA : playerB;
      const loser = winner === playerA ? playerB : playerA;
      const matchPerformance = simulatedAiMatchPerformancePoints(
        playerA,
        playerB,
        winner,
        Number(competition.targetSets || 2),
        `${simulationNonce}:${competition.id}:${season}:${week}:${roundLabel}:${index}`,
      );
      matchPerformance.forEach((points, characterId) => {
        performanceAwards.set(characterId, (performanceAwards.get(characterId) || 0) + points);
      });
      awards.set(loser, loserPoints || 0);
      winners.push(winner);
    }
    return winners;
  };
  const bracketPositionOrder = [1, 16, 9, 8, 5, 12, 13, 4, 3, 14, 11, 6, 7, 10, 15, 2];
  const round16 = bracketPositionOrder.map((position) => positions[position]);
  const quarterFinalists = playRound(round16, "round16", table.qualif || 0);
  const semiFinalists = playRound(quarterFinalists, "quarter", table.quarter || 0);
  const finalists = playRound(semiFinalists, "semi", table.semi || 0);
  const winner = playRound(finalists, "final", table.finalist || 0)[0];
  if (winner) awards.set(winner, table.winner || 0);
  return new Map([...awards].map(([characterId, points]) => [
    characterId,
    points + (performanceAwards.get(characterId) || 0),
  ]));
}

async function topAiIdsForReference(season, week, limit = 8) {
  const refPeriods = previousCircuitPeriods(season, week);
  const refPeriodKeys = refPeriods.map((period) => period.key);
  if (db) {
    const result = await db.query(`
      SELECT ai_character_id, COALESCE(SUM(points + COALESCE(human_win_bonus, 0)), 0)::int AS score_ref
      FROM circuit_ai_week_scores
      WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])
      GROUP BY ai_character_id
      ORDER BY score_ref DESC, ai_character_id ASC
      LIMIT $2
    `, [refPeriodKeys, limit]);
    return result.rows.map((row) => row.ai_character_id);
  }
  return CIRCUIT_AI_CHARACTER_IDS
    .map((characterId) => ({
      characterId,
      scoreRef: sumMemoryAiPeriodScores(authMemory.circuitAiWeekScores, characterId, refPeriods),
    }))
    .sort((a, b) => b.scoreRef - a.scoreRef || a.characterId.localeCompare(b.characterId))
    .slice(0, limit)
    .map((entry) => entry.characterId);
}

function maxWeeklyTournamentPoints(week) {
  return COMPETITION_DEFINITIONS
    .filter((competition) => competition.week === week)
    .reduce((sum, competition) => {
      const table = competition.points || POINT_TABLES[competition.value] || POINT_TABLES[400];
      return sum + (table.winner || 0);
    }, 0);
}

function previousCircuitWeekNumber(week) {
  return week <= 1 ? CIRCUIT_SEASON_LENGTH : week - 1;
}

function nextCircuitWeekNumber(week) {
  return week >= CIRCUIT_SEASON_LENGTH ? 1 : week + 1;
}

async function aiCircuitStandingsForBoost(season, week) {
  const refPeriods = previousCircuitPeriods(season, week);
  const refPeriodKeys = refPeriods.map((period) => period.key);
  const previousPeriodKey = previousCircuitPeriods(season, week, 1)[0]?.key;
  let rows = [];
  if (db) {
    const result = await db.query(`
      SELECT ai_character_id,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])), 0)::int AS score_ref,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = $2), 0)::int AS score_previous_week,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE season_number = $3), 0)::int AS score_total
      FROM circuit_ai_week_scores
      GROUP BY ai_character_id
    `, [refPeriodKeys, previousPeriodKey, season]);
    const byId = new Map(result.rows.map((row) => [row.ai_character_id, row]));
    rows = CIRCUIT_AI_CHARACTER_IDS.map((characterId) => {
      const stored = byId.get(characterId);
      return {
        characterId,
        scoreRef: Number(stored?.score_ref || 0),
        scorePreviousWeek: Number(stored?.score_previous_week || 0),
        scoreTotal: Number(stored?.score_total || 0),
      };
    });
  } else {
    rows = CIRCUIT_AI_CHARACTER_IDS.map((characterId) => ({
      characterId,
      scoreRef: sumMemoryAiPeriodScores(authMemory.circuitAiWeekScores, characterId, refPeriods),
      scorePreviousWeek: previousPeriodKey
        ? memoryAiWeekScore(characterId, ...previousPeriodKey.split(":").map(Number))
        : 0,
      scoreTotal: Array.from({ length: CIRCUIT_SEASON_LENGTH }, (_, index) => index + 1)
        .reduce((sum, weekNumber) => (
          sum + memoryAiWeekScore(characterId, season, weekNumber)
        ), 0),
    }));
  }
  const sortByRef = [...rows].sort((a, b) => b.scoreRef - a.scoreRef || aiCharacterName(a.characterId).localeCompare(aiCharacterName(b.characterId), "fr"));
  const worldOrderIds = sortByRef.map((entry) => entry.characterId);
  const worldLeaderId = worldOrderIds[0] || null;
  const seasonLeaderId = [...rows]
    .filter((entry) => entry.characterId !== worldLeaderId)
    .sort((a, b) => b.scoreTotal - a.scoreTotal || b.scoreRef - a.scoreRef || aiCharacterName(a.characterId).localeCompare(aiCharacterName(b.characterId), "fr"))
    .at(0)?.characterId || null;
  const previousWeekLeaderId = [...rows]
    .filter((entry) => entry.characterId !== worldLeaderId && entry.characterId !== seasonLeaderId)
    .sort((a, b) => b.scorePreviousWeek - a.scorePreviousWeek || b.scoreRef - a.scoreRef || aiCharacterName(a.characterId).localeCompare(aiCharacterName(b.characterId), "fr"))
    .at(0)?.characterId || null;
  const boostedTopIds = [worldLeaderId, seasonLeaderId, previousWeekLeaderId].filter(Boolean);
  return { rows, worldOrderIds, boostedTopIds, previousWeekLeaderId };
}

function applyAiWeeklyPerformanceCoefficients(totals, standings, maxSem) {
  if (!maxSem) return totals;
  const boostedTopSet = new Set(standings.boostedTopIds || []);
  const rankIaById = new Map((standings.worldOrderIds || []).map((characterId, index) => [characterId, index + 1]));
  const standingById = new Map((standings.rows || []).map((entry) => [entry.characterId, entry]));
  const adjusted = new Map();
  const cappedCandidates = [];
  for (const [characterId, points] of totals) {
    const rankIa = rankIaById.get(characterId) || 0;
    let multiplier = 1.5;
    if (boostedTopSet.has(characterId)) multiplier = 2.2;
    else if (rankIa === 2 || rankIa === 3) multiplier = 2;
    else if (rankIa === 4) multiplier = 1.8;
    else if (rankIa === 5) multiplier = 1.6;
    const boostedPoints = Math.round(points * multiplier);
    adjusted.set(characterId, Math.min(boostedPoints, maxSem));
    if (boostedPoints > maxSem) {
      const standing = standingById.get(characterId) || { scoreRef: 0, scoreTotal: 0 };
      cappedCandidates.push({
        characterId,
        boostedPoints,
        scoreRef: standing.scoreRef || 0,
        scoreTotal: standing.scoreTotal || 0,
      });
    }
  }
  cappedCandidates
    .sort((a, b) => b.scoreRef - a.scoreRef
      || b.scoreTotal - a.scoreTotal
      || b.boostedPoints - a.boostedPoints
      || aiCharacterName(a.characterId).localeCompare(aiCharacterName(b.characterId), "fr"))
    .forEach((entry, index) => {
      const penalty = index === 0 ? 0 : index === 1 ? 400 : index === 2 ? 800 : 1200;
      adjusted.set(entry.characterId, Math.max(0, maxSem - penalty));
    });
  const overThreshold = [...adjusted.entries()]
    .filter(([, points]) => points >= 3750)
    .map(([characterId, points]) => {
      const standing = standingById.get(characterId) || { scoreRef: 0, scoreTotal: 0 };
      return { characterId, points, scoreRef: standing.scoreRef || 0, scoreTotal: standing.scoreTotal || 0 };
    })
    .sort((a, b) => b.points - a.points
      || b.scoreRef - a.scoreRef
      || b.scoreTotal - a.scoreTotal
      || aiCharacterName(a.characterId).localeCompare(aiCharacterName(b.characterId), "fr"));
  if (overThreshold[0]?.points > 3750) {
    overThreshold.slice(1).forEach((entry, index) => {
      adjusted.set(entry.characterId, Math.max(0, 3750 - (index * 250)));
    });
  }
  return adjusted;
}

async function simulateAiCircuitWeek(season, week, options = {}) {
  const competitions = COMPETITION_DEFINITIONS.filter((competition) => competition.week === week);
  const bonusTopIds = options.bonusTopIds || [];
  let simulationNonce = options.simulationNonce || await getAppStateValue("ai_simulation_nonce", null);
  if (!simulationNonce) {
    simulationNonce = makeToken();
    await setAppStateValue("ai_simulation_nonce", simulationNonce);
  }
  const totals = new Map(CIRCUIT_AI_CHARACTER_IDS.map((characterId) => [characterId, 0]));
  const standings = await aiCircuitStandingsForBoost(season, week);
  competitions.forEach((competition) => {
    const awards = simulatedAiTournamentPoints(competition, season, week, bonusTopIds, simulationNonce, standings.worldOrderIds);
    awards.forEach((points, characterId) => {
      totals.set(characterId, (totals.get(characterId) || 0) + points);
    });
  });
  const maxSem = maxWeeklyTournamentPoints(week);
  const adjustedTotals = applyAiWeeklyPerformanceCoefficients(totals, standings, maxSem);
  if (db) {
    for (const [characterId, points] of adjustedTotals) {
      await db.query(`
        INSERT INTO circuit_ai_week_scores (ai_character_id, season_number, week_number, points, human_win_bonus)
        VALUES ($1, $2, $3, $4, 0)
        ON CONFLICT (ai_character_id, season_number, week_number) DO UPDATE
          SET points = EXCLUDED.points,
              human_win_bonus = LEAST(
                circuit_ai_week_scores.human_win_bonus,
                GREATEST(0, $5 - EXCLUDED.points)
              ),
              updated_at = NOW()
      `, [characterId, season, week, points, maxSem]);
    }
    return;
  }
  authMemory.circuitAiWeekScores = authMemory.circuitAiWeekScores || new Map();
  for (const [characterId, points] of adjustedTotals) {
    const key = `${season}:${week}:${characterId}`;
    authMemory.circuitAiWeekScores.set(key, points);
    authMemory.circuitAiHumanBonuses.set(
      key,
      Math.min(Number(authMemory.circuitAiHumanBonuses.get(key) || 0), Math.max(0, maxSem - points)),
    );
  }
}

async function ensureAiCircuitWeekSimulated(season, week, options = {}) {
  const marker = `ai_simulated_${season}_${week}`;
  if (!options.force && await getAppStateValue(marker, null)) return;
  const bonusTopIds = options.bonusTopIds || await topAiIdsForReference(season, week, 8);
  await simulateAiCircuitWeek(season, week, { bonusTopIds, simulationNonce: options.simulationNonce });
  await setAppStateValue(marker, new Date().toISOString());
}

async function circuitState() {
  const periodKey = currentWeekKey();
  let storedPeriod = await getAppStateValue("circuit_period_key", null);
  let week = Number(await getAppStateValue("circuit_week_number", 1));
  let season = Number(await getAppStateValue("circuit_season_number", 1));
  if (!storedPeriod) {
    await setAppStateValue("circuit_period_key", periodKey);
    await setAppStateValue("circuit_week_number", week);
    await setAppStateValue("circuit_season_number", season);
  } else if (storedPeriod !== periodKey) {
    const elapsedPeriods = countCircuitBoundariesBetween(storedPeriod, periodKey);
    for (let index = 0; index < elapsedPeriods; index += 1) {
      await updateRankingMilestonesForWeek(season, week);
      if (week === CIRCUIT_SEASON_LENGTH) await finalizeCircuitSeason(season);
      week += 1;
      if (week > CIRCUIT_SEASON_LENGTH) {
        week = 1;
        season += 1;
      }
    }
    await setAppStateValue("circuit_period_key", periodKey);
    await setAppStateValue("circuit_week_number", week);
    await setAppStateValue("circuit_season_number", season);
  }
  await ensureAiCircuitWeekSimulated(season, week);
  return { weekKey: periodKey, week, season, nextUpdateAt: nextCircuitUpdateAt() };
}

async function advanceCircuitWeek() {
  const current = await circuitState();
  await updateRankingMilestonesForWeek(current.season, current.week);
  if (current.week === CIRCUIT_SEASON_LENGTH) await finalizeCircuitSeason(current.season);
  let week = current.week + 1;
  let season = current.season;
  if (week > CIRCUIT_SEASON_LENGTH) {
    week = 1;
    season += 1;
  }
  await setAppStateValue("circuit_week_number", week);
  await setAppStateValue("circuit_season_number", season);
  await setAppStateValue("circuit_period_key", currentWeekKey());
  await ensureAiCircuitWeekSimulated(season, week, { force: true });
  return { weekKey: currentWeekKey(), week, season, nextUpdateAt: nextCircuitUpdateAt() };
}

async function restartCurrentSeason() {
  const current = await circuitState();
  const season = current.season;
  const retainedWeeks = [17, 18, 19, 20];
  const simulationNonce = makeToken();
  if (db) {
    await db.query("DELETE FROM circuit_tournament_results WHERE season_number = $1", [season]);
    await db.query("DELETE FROM weekly_competition_scores");
    await db.query("DELETE FROM circuit_attempts WHERE season_number = $1", [season]);
    await db.query("DELETE FROM circuit_tournament_saves WHERE season_number = $1", [season]);
    await db.query("DELETE FROM circuit_tournament_resets WHERE season_number = $1", [season]);
    await db.query("DELETE FROM circuit_week_scores WHERE season_number = $1 AND NOT (week_number = ANY($2::int[]))", [season, retainedWeeks]);
    await db.query("DELETE FROM circuit_ai_week_scores WHERE season_number = $1", [season]);
    await db.query("DELETE FROM app_state WHERE key LIKE 'ai_simulated_%'");
  } else {
    authMemory.circuitResults = [];
    authMemory.weeklyScores.clear();
    authMemory.circuitAttempts.clear();
    authMemory.circuitSaves.clear();
    authMemory.circuitResets.clear();
    for (const key of Array.from(authMemory.circuitWeekScores.keys())) {
      const [, keySeason, keyWeek] = key.match(/^([^:]+):(\d+):(\d+)$/) || [];
      if (Number(keySeason) === season && !retainedWeeks.includes(Number(keyWeek))) {
        authMemory.circuitWeekScores.delete(key);
      }
    }
    authMemory.circuitAiWeekScores.clear();
    authMemory.circuitAiHumanBonuses.clear();
    for (const key of Array.from(authMemory.appState.keys())) {
      if (key.startsWith("ai_simulated_")) authMemory.appState.delete(key);
    }
  }
  await setAppStateValue("circuit_season_number", season);
  await setAppStateValue("circuit_week_number", 1);
  await setAppStateValue("circuit_period_key", currentWeekKey());
  await setAppStateValue("ai_simulation_nonce", simulationNonce);
  for (const weekNumber of retainedWeeks) {
    await simulateAiCircuitWeek(season, weekNumber, { bonusTopIds: [], simulationNonce });
    await setAppStateValue(`ai_simulated_${season}_${weekNumber}`, new Date().toISOString());
  }
  const topAiIds = await topAiIdsForReference(season, 1, 8);
  await simulateAiCircuitWeek(season, 1, { bonusTopIds: topAiIds, simulationNonce });
  await setAppStateValue(`ai_simulated_${season}_1`, new Date().toISOString());
  return { weekKey: currentWeekKey(), week: 1, season, nextUpdateAt: nextCircuitUpdateAt() };
}

async function restartSeasonOne() {
  const current = await circuitState();
  const sourcePeriods = previousCircuitPeriods(current.season, current.week, 4).reverse();
  const simulationNonce = makeToken();
  if (db) {
    const preserved = await db.query(`
      SELECT user_id, season_number, week_number, points
      FROM circuit_week_scores
      WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])
    `, [sourcePeriods.map((period) => period.key)]);
    await db.query("BEGIN");
    try {
      await db.query("DELETE FROM circuit_tournament_results");
      await db.query("DELETE FROM weekly_competition_scores");
      await db.query("DELETE FROM circuit_attempts");
      await db.query("DELETE FROM circuit_tournament_saves");
      await db.query("DELETE FROM circuit_tournament_resets");
      await db.query("DELETE FROM circuit_week_scores");
      await db.query("DELETE FROM circuit_ai_week_scores");
      await db.query("DELETE FROM circuit_honors");
      await db.query(`
        UPDATE users SET best_world_rank = NULL, weeks_world_number_one = 0,
          weeks_world_top3 = 0, weeks_world_top5 = 0, weeks_world_top10 = 0
      `);
      for (const row of preserved.rows) {
        const sourceIndex = sourcePeriods.findIndex((period) => period.season === Number(row.season_number) && period.week === Number(row.week_number));
        if (sourceIndex < 0) continue;
        await db.query(`
          INSERT INTO circuit_week_scores (user_id, season_number, week_number, points, updated_at)
          VALUES ($1, 0, $2, $3, NOW())
          ON CONFLICT (user_id, season_number, week_number) DO UPDATE SET points = EXCLUDED.points, updated_at = NOW()
        `, [row.user_id, 17 + sourceIndex, Number(row.points || 0)]);
      }
      await db.query("DELETE FROM app_state WHERE key LIKE 'ai_simulated_%' OR key LIKE 'ranking_milestones_%' OR key LIKE 'season_finalized_%'");
      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } else {
    const preserved = new Map();
    for (const user of authMemory.users.values()) {
      sourcePeriods.forEach((period, index) => {
        preserved.set(`${user.id}:0:${17 + index}`, authMemory.circuitWeekScores.get(`${user.id}:${period.season}:${period.week}`) || 0);
      });
      user.bestWorldRank = null;
      user.weeksWorldNumberOne = 0;
      user.weeksWorldTop3 = 0;
      user.weeksWorldTop5 = 0;
      user.weeksWorldTop10 = 0;
    }
    authMemory.circuitResults = [];
    authMemory.weeklyScores.clear();
    authMemory.circuitAttempts.clear();
    authMemory.circuitSaves.clear();
    authMemory.circuitResets.clear();
    authMemory.circuitWeekScores = preserved;
    authMemory.circuitAiWeekScores.clear();
    authMemory.circuitAiHumanBonuses.clear();
    for (const key of Array.from(authMemory.appState.keys())) {
      if (key.startsWith("ai_simulated_") || key.startsWith("ranking_milestones_") || key.startsWith("season_finalized_")) authMemory.appState.delete(key);
    }
  }
  await setAppStateValue("circuit_season_number", 1);
  await setAppStateValue("circuit_week_number", 1);
  await setAppStateValue("circuit_period_key", currentWeekKey());
  await setAppStateValue("ai_simulation_nonce", simulationNonce);
  for (const weekNumber of [17, 18, 19, 20]) {
    await simulateAiCircuitWeek(0, weekNumber, { bonusTopIds: [], simulationNonce });
    await setAppStateValue(`ai_simulated_0_${weekNumber}`, new Date().toISOString());
  }
  const topAiIds = await topAiIdsForReference(1, 1, 8);
  await simulateAiCircuitWeek(1, 1, { bonusTopIds: topAiIds, simulationNonce });
  await setAppStateValue("ai_simulated_1_1", new Date().toISOString());
  return { weekKey: currentWeekKey(), week: 1, season: 1, nextUpdateAt: nextCircuitUpdateAt() };
}

function circuitScoreKey(current) {
  return `S${current.season}-W${current.week}`;
}

async function weeklyCompetitionPayload() {
  const current = await circuitState();
  return COMPETITION_DEFINITIONS
    .filter((competition) => competition.week === current.week)
    .sort((a, b) => a.slot - b.slot)
    .map((competition) => ({ ...competition, weekKey: current.weekKey, season: current.season, week: current.week }));
}

async function competitionDefinitionById(competitionId) {
  const competitions = await weeklyCompetitionPayload();
  return competitions.find((competition) => competition.id === competitionId) || null;
}

function anyCompetitionDefinitionById(competitionId) {
  return COMPETITION_DEFINITIONS.find((competition) => competition.id === competitionId) || null;
}

function previousCircuitWeeks(week) {
  return [1, 2, 3, 4].map((offset) => {
    let value = week - offset;
    if (value <= 0) value += CIRCUIT_SEASON_LENGTH;
    return value;
  });
}

function circuitPeriodKey(season, week) {
  return `${season}:${week}`;
}

function previousCircuitPeriods(season, week, count = 4) {
  const periods = [];
  let periodSeason = season;
  let periodWeek = week;
  for (let offset = 0; offset < count; offset += 1) {
    periodWeek -= 1;
    if (periodWeek <= 0) {
      periodSeason -= 1;
      periodWeek = CIRCUIT_SEASON_LENGTH;
    }
    periods.push({ season: periodSeason, week: periodWeek, key: circuitPeriodKey(periodSeason, periodWeek) });
  }
  return periods;
}

function nextCircuitPeriod(season, week) {
  if (week >= CIRCUIT_SEASON_LENGTH) return { season: season + 1, week: 1 };
  return { season, week: week + 1 };
}

function sumMemoryUserPeriodScores(map, userId, periods) {
  return periods.reduce((sum, period) => sum + (map.get(`${userId}:${period.season}:${period.week}`) || 0), 0);
}

function sumMemoryAiPeriodScores(map, characterId, periods) {
  return periods.reduce((sum, period) => {
    const key = `${period.season}:${period.week}:${characterId}`;
    return sum + Number(map.get(key) || 0) + Number(authMemory.circuitAiHumanBonuses.get(key) || 0);
  }, 0);
}

function memoryAiWeekScore(characterId, season, week) {
  const key = `${season}:${week}:${characterId}`;
  return Number(authMemory.circuitAiWeekScores.get(key) || 0)
    + Number(authMemory.circuitAiHumanBonuses.get(key) || 0);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 32, "sha256").toString("base64url");
  return `pbkdf2:${PASSWORD_ITERATIONS}:${salt}:${hash}`;
}

function normalizeProCode(code) {
  return String(code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function generateProCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function verifyPassword(password, stored) {
  const [kind, iterationsText, salt, expected] = String(stored || "").split(":");
  if (kind !== "pbkdf2" || !salt || !expected) return false;
  const iterations = Number(iterationsText);
  const actual = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((cookie) => {
    const index = cookie.indexOf("=");
    if (index === -1) return null;
    return [cookie.slice(0, index).trim(), decodeURIComponent(cookie.slice(index + 1).trim())];
  }).filter(Boolean));
}

function signSessionId(sessionId) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(sessionId).digest("base64url");
}

function packSessionCookie(sessionId) {
  return `${sessionId}.${signSessionId(sessionId)}`;
}

function unpackSessionCookie(value) {
  const [sessionId, signature] = String(value || "").split(".");
  if (!sessionId || !signature) return null;
  const expected = signSessionId(sessionId);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return sessionId;
}

function cookieOptions(req, maxAgeMs = SESSION_TTL_MS) {
  const proto = req.headers["x-forwarded-proto"] || "";
  const secure = proto === "https" || process.env.NODE_ENV === "production";
  return [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

function setSessionCookie(req, res, sessionId) {
  res.setHeader("set-cookie", `${SESSION_COOKIE}=${encodeURIComponent(packSessionCookie(sessionId))}; ${cookieOptions(req)}`);
}

function clearSessionCookie(res) {
  res.setHeader("set-cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

async function initAuthStorage() {
  if (!db) {
    console.log("Auth storage: in-memory fallback. Configure DATABASE_URL for persistent accounts.");
    return;
  }
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      nickname TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'free',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login_at TIMESTAMPTZ
    )
  `);
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'free'");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS pro_code TEXT UNIQUE");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS selected_character_id TEXT NOT NULL DEFAULT 'tennisHope'");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS unlocked_characters TEXT NOT NULL DEFAULT 'coachJu,coachMax,coachCarla,coachClem'");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS seen_news TEXT NOT NULL DEFAULT ''");
  await db.query("CREATE SEQUENCE IF NOT EXISTS users_account_number_seq START WITH 1");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS account_number BIGINT");
  await db.query("UPDATE users SET account_number = nextval('users_account_number_seq') WHERE account_number IS NULL");
  await db.query("SELECT setval('users_account_number_seq', GREATEST((SELECT COALESCE(MAX(account_number), 0) FROM users), 1))");
  await db.query("ALTER TABLE users ALTER COLUMN account_number SET DEFAULT nextval('users_account_number_seq')");
  await db.query("ALTER TABLE users ALTER COLUMN account_number SET NOT NULL");
  await db.query("CREATE UNIQUE INDEX IF NOT EXISTS users_account_number_idx ON users(account_number)");
  await db.query(`
    CREATE TABLE IF NOT EXISTS pro_codes (
      code TEXT PRIMARY KEY,
      assigned_user_id TEXT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      redeemed_at TIMESTAMPTZ
    )
  `);
  await db.query("CREATE INDEX IF NOT EXISTS pro_codes_assigned_user_id_idx ON pro_codes(assigned_user_id)");
  await db.query(`
    INSERT INTO pro_codes (code)
    VALUES ('JUL1EN')
    ON CONFLICT (code) DO NOTHING
  `);
  await db.query(`
    UPDATE users
    SET role = 'admin',
        pro_code = 'JUL1EN'
    WHERE email = $1
  `, [ADMIN_EMAIL]);
  await db.query(`
    UPDATE pro_codes
    SET assigned_user_id = users.id,
        redeemed_at = COALESCE(pro_codes.redeemed_at, NOW())
    FROM users
    WHERE users.email = $1 AND pro_codes.code = 'JUL1EN'
  `, [ADMIN_EMAIL]);
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS best_world_rank INTEGER");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS weeks_world_number_one INTEGER NOT NULL DEFAULT 0");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS weeks_world_top3 INTEGER NOT NULL DEFAULT 0");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS weeks_world_top5 INTEGER NOT NULL DEFAULT 0");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS weeks_world_top10 INTEGER NOT NULL DEFAULT 0");
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_honors (
      honor_key TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      honor_type TEXT NOT NULL,
      label TEXT NOT NULL,
      season_number INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      rank INTEGER,
      points INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query("CREATE INDEX IF NOT EXISTS circuit_honors_user_idx ON circuit_honors(user_id, season_number DESC, week_number DESC)");
  await db.query(`
    WITH duplicates AS (
      SELECT id, nickname, account_number, ROW_NUMBER() OVER (PARTITION BY LOWER(nickname) ORDER BY created_at, account_number) AS duplicate_rank
      FROM users
      WHERE nickname !~ ' #[0-9]+$'
    )
    UPDATE users
    SET nickname = CONCAT(duplicates.nickname, ' #', duplicates.account_number)
    FROM duplicates
    WHERE users.id = duplicates.id AND duplicates.duplicate_rank > 1
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    )
  `);
  await db.query("CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id)");
  await db.query("DELETE FROM sessions WHERE expires_at < NOW()");
  await db.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ
    )
  `);
  await db.query("CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id)");
  await db.query("DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL");
  await db.query(`
    CREATE TABLE IF NOT EXISTS weekly_competition_scores (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week_key TEXT NOT NULL,
      competition_id TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, week_key, competition_id)
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS weekly_rankings (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      ranking_points INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_week_scores (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      season_number INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, season_number, week_number)
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_ai_week_scores (
      ai_character_id TEXT NOT NULL,
      season_number INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (ai_character_id, season_number, week_number)
    )
  `);
  await db.query(`
    ALTER TABLE circuit_ai_week_scores
    ADD COLUMN IF NOT EXISTS human_win_bonus INTEGER NOT NULL DEFAULT 0
  `);
  await db.query(`
    UPDATE users
    SET best_world_rank = NULL, weeks_world_number_one = 0, weeks_world_top3 = 0,
      weeks_world_top5 = 0, weeks_world_top10 = 0
    WHERE NOT EXISTS (
      SELECT 1 FROM circuit_week_scores
      WHERE circuit_week_scores.user_id = users.id AND circuit_week_scores.points > 0
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_attempts (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      season_number INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      competition_id TEXT NOT NULL,
      retries INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, season_number, week_number, competition_id)
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_tournament_saves (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      season_number INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      competition_id TEXT NOT NULL,
      save_json JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, season_number, week_number, competition_id)
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_tournament_resets (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      season_number INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      competition_id TEXT NOT NULL,
      reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, season_number, week_number, competition_id)
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_tournament_results (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      season_number INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      competition_id TEXT NOT NULL,
      competition_name TEXT NOT NULL,
      competition_type TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      flag TEXT NOT NULL DEFAULT '',
      achievement TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, season_number, week_number, competition_id)
    )
  `);
  await db.query("ALTER TABLE circuit_tournament_results ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT ''");
  await db.query("ALTER TABLE circuit_tournament_results ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT ''");
  await db.query("ALTER TABLE circuit_tournament_results ADD COLUMN IF NOT EXISTS flag TEXT NOT NULL DEFAULT ''");
  await db.query("ALTER TABLE circuit_tournament_results ADD COLUMN IF NOT EXISTS round_reached TEXT NOT NULL DEFAULT ''");
  await db.query("ALTER TABLE circuit_tournament_results ADD COLUMN IF NOT EXISTS last_opponent TEXT NOT NULL DEFAULT ''");
  await db.query("ALTER TABLE circuit_tournament_results ADD COLUMN IF NOT EXISTS last_score TEXT NOT NULL DEFAULT ''");
  await db.query(`
    CREATE TABLE IF NOT EXISTS circuit_ai_results (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ai_character_id TEXT NOT NULL,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, ai_character_id)
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS human_match_logs (
      match_id TEXT NOT NULL,
      observer_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      context_type TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'completed',
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      payload JSONB NOT NULL,
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (match_id, observer_user_id)
    )
  `);
  await db.query("CREATE INDEX IF NOT EXISTS human_match_logs_completed_idx ON human_match_logs(completed_at DESC, received_at DESC)");
  await db.query("CREATE INDEX IF NOT EXISTS human_match_logs_context_idx ON human_match_logs(context_type, completed_at DESC)");
  await applyWeeklyRankingRollover();
}

async function applyWeeklyRankingRollover() {
  if (!db) return;
  const weekKey = currentWeekKey();
  const result = await db.query("SELECT value FROM app_state WHERE key = 'ranking_week_key'");
  const storedWeekKey = result.rows[0]?.value || null;
  if (!storedWeekKey) {
    await db.query("INSERT INTO app_state (key, value) VALUES ('ranking_week_key', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [weekKey]);
    return;
  }
  if (storedWeekKey === weekKey) return;
  await db.query(`
    INSERT INTO weekly_rankings (user_id, ranking_points, updated_at)
    SELECT users.id, COALESCE(SUM(weekly_competition_scores.points), 0)::int, NOW()
    FROM users
    LEFT JOIN weekly_competition_scores
      ON weekly_competition_scores.user_id = users.id
      AND weekly_competition_scores.week_key = $1
    GROUP BY users.id
    ON CONFLICT (user_id) DO UPDATE
      SET ranking_points = EXCLUDED.ranking_points,
          updated_at = NOW()
  `, [storedWeekKey]);
  await db.query("UPDATE app_state SET value = $1 WHERE key = 'ranking_week_key'", [weekKey]);
}

async function recomputeUserCircuitWeekScore(userId, season, week) {
  const scoreKey = circuitScoreKey({ season, week });
  if (db) {
    await db.query(`
      INSERT INTO circuit_week_scores (user_id, season_number, week_number, points, updated_at)
      SELECT $1, $2, $3, COALESCE(SUM(points), 0)::int, NOW()
      FROM weekly_competition_scores
      WHERE user_id = $1 AND week_key = $4
      ON CONFLICT (user_id, season_number, week_number) DO UPDATE
        SET points = EXCLUDED.points,
            updated_at = NOW()
    `, [userId, season, week, scoreKey]);
    return;
  }
  const total = [...authMemory.weeklyScores.entries()]
    .filter(([key]) => key.startsWith(`${userId}:${scoreKey}:`))
    .reduce((sum, [, value]) => sum + Number(value.points || 0), 0);
  authMemory.circuitWeekScores.set(`${userId}:${season}:${week}`, total);
}

async function adminScoreEditorPayload(userId) {
  const current = await circuitState();
  const retryInfo = await currentRetryInfo(userId);
  const periods = [
    { ...current, label: "Semaine actuelle" },
    ...previousCircuitPeriods(current.season, current.week, 4).map((period, index) => ({ ...period, label: `S-${index + 1}` })),
  ];
  let values = new Map();
  if (db) {
    const result = await db.query(`
      SELECT season_number, week_number, points
      FROM circuit_week_scores
      WHERE user_id = $1 AND CONCAT(season_number, ':', week_number) = ANY($2::text[])
    `, [userId, periods.map((period) => circuitPeriodKey(period.season, period.week))]);
    values = new Map(result.rows.map((row) => [circuitPeriodKey(row.season_number, row.week_number), Number(row.points || 0)]));
  } else {
    values = new Map(periods.map((period) => [
      circuitPeriodKey(period.season, period.week),
      Number(authMemory.circuitWeekScores.get(`${userId}:${period.season}:${period.week}`) || 0),
    ]));
  }
  return {
    currentSeason: current.season,
    currentWeek: current.week,
    weeklyAttempts: {
      used: retryInfo.retriesUsed,
      limit: retryInfo.retryLimit,
    },
    periods: periods.map((period, index) => ({
      key: index === 0 ? "current" : `s${index}`,
      label: period.label,
      season: period.season,
      week: period.week,
      points: values.get(circuitPeriodKey(period.season, period.week)) || 0,
    })),
  };
}

async function setAdminScorePeriods(userId, submittedPeriods = []) {
  const editable = await adminScoreEditorPayload(userId);
  const submitted = new Map((Array.isArray(submittedPeriods) ? submittedPeriods : [])
    .map((item) => [String(item.key || ""), Math.max(0, Math.round(Number(item.points || 0)))]));
  for (const period of editable.periods) {
    if (!submitted.has(period.key)) continue;
    const points = submitted.get(period.key);
    if (db) {
      const weekKey = `S${period.season}-W${period.week}`;
      const otherScores = await db.query(`
        SELECT COALESCE(SUM(points), 0)::int AS points
        FROM weekly_competition_scores
        WHERE user_id = $1 AND week_key = $2 AND competition_id <> $3
      `, [userId, weekKey, ADMIN_MANUAL_COMPETITION_ID]);
      const adjustment = points - Number(otherScores.rows[0]?.points || 0);
      await db.query(`
        INSERT INTO weekly_competition_scores (user_id, week_key, competition_id, points, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, week_key, competition_id) DO UPDATE
          SET points = EXCLUDED.points, updated_at = NOW()
      `, [userId, weekKey, ADMIN_MANUAL_COMPETITION_ID, adjustment]);
      await recomputeUserCircuitWeekScore(userId, period.season, period.week);
    } else {
      authMemory.circuitWeekScores.set(`${userId}:${period.season}:${period.week}`, points);
    }
  }
  return adminScoreEditorPayload(userId);
}

async function currentTournamentScoreMap(userId) {
  const current = await circuitState();
  const scoreKey = circuitScoreKey(current);
  if (db) {
    const result = await db.query(
      "SELECT competition_id, points FROM weekly_competition_scores WHERE user_id = $1 AND week_key = $2",
      [userId, scoreKey],
    );
    return Object.fromEntries(result.rows.map((row) => [row.competition_id, row.points]));
  }
  return Object.fromEntries([...authMemory.weeklyScores.entries()]
    .filter(([key]) => key.startsWith(`${userId}:${scoreKey}:`))
    .map(([key, value]) => [key.split(":").pop(), value.points]));
}

async function currentTournamentPerformanceMap(userId) {
  const current = await circuitState();
  if (db) {
    const result = await db.query(`
      SELECT competition_id, achievement, points, last_opponent, last_score
      FROM circuit_tournament_results
      WHERE user_id = $1 AND season_number = $2 AND week_number = $3
    `, [userId, current.season, current.week]);
    return Object.fromEntries(result.rows.map((row) => [row.competition_id, {
      achievement: normalizeTournamentAchievement(row.achievement),
      label: achievementLabel(row.achievement),
      points: Number(row.points || 0),
      lastOpponent: row.last_opponent || "",
      lastScore: row.last_score || "",
    }]));
  }
  return Object.fromEntries(authMemory.circuitResults
    .filter((row) => row.userId === userId && Number(row.season) === Number(current.season) && Number(row.week) === Number(current.week))
    .map((row) => [row.competitionId, {
      achievement: normalizeTournamentAchievement(row.achievement),
      label: achievementLabel(row.achievement),
      points: Number(row.points || 0),
      lastOpponent: row.lastOpponent || "",
      lastScore: row.lastScore || "",
    }]));
}

async function currentRetryInfo(userId) {
  const current = await circuitState();
  if (db) {
    const result = await db.query(
      "SELECT competition_id, retries FROM circuit_attempts WHERE user_id = $1 AND season_number = $2 AND week_number = $3",
      [userId, current.season, current.week],
    );
    const byCompetition = Object.fromEntries(result.rows.map((row) => [row.competition_id, Number(row.retries || 0)]));
    return {
      byCompetition,
      retriesUsed: result.rows.reduce((sum, row) => sum + Number(row.retries || 0), 0),
      retryLimit: DAILY_RETRY_LIMIT,
    };
  }
  const prefix = `${userId}:${current.season}:${current.week}:`;
  const entries = [...authMemory.circuitAttempts.entries()].filter(([key]) => key.startsWith(prefix));
  return {
    byCompetition: Object.fromEntries(entries.map(([key, value]) => [key.split(":").pop(), value])),
    retriesUsed: entries.reduce((sum, [, value]) => sum + Number(value || 0), 0),
    retryLimit: DAILY_RETRY_LIMIT,
  };
}

async function setCurrentRetryCount(userId, requestedCount) {
  const current = await circuitState();
  const retries = Math.min(DAILY_RETRY_LIMIT, Math.max(0, Math.round(Number(requestedCount || 0))));
  if (db) {
    await db.query(
      "DELETE FROM circuit_attempts WHERE user_id = $1 AND season_number = $2 AND week_number = $3",
      [userId, current.season, current.week],
    );
    if (retries > 0) {
      await db.query(`
        INSERT INTO circuit_attempts (user_id, season_number, week_number, competition_id, retries, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [userId, current.season, current.week, ADMIN_ATTEMPT_COMPETITION_ID, retries]);
    }
  } else {
    const prefix = `${userId}:${current.season}:${current.week}:`;
    for (const key of Array.from(authMemory.circuitAttempts.keys())) {
      if (key.startsWith(prefix)) authMemory.circuitAttempts.delete(key);
    }
    if (retries > 0) authMemory.circuitAttempts.set(`${prefix}${ADMIN_ATTEMPT_COMPETITION_ID}`, retries);
  }
  return currentRetryInfo(userId);
}

async function currentTournamentResetMap(userId) {
  const current = await circuitState();
  if (db) {
    const result = await db.query(
      "SELECT competition_id, reset_at FROM circuit_tournament_resets WHERE user_id = $1 AND season_number = $2 AND week_number = $3",
      [userId, current.season, current.week],
    );
    return Object.fromEntries(result.rows.map((row) => [row.competition_id, row.reset_at]));
  }
  const prefix = `${userId}:${current.season}:${current.week}:`;
  return Object.fromEntries([...authMemory.circuitResets.entries()]
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, value]) => [key.slice(prefix.length), value]));
}

async function currentTournamentSaveIds(userId) {
  const current = await circuitState();
  if (db) {
    const result = await db.query(
      "SELECT competition_id FROM circuit_tournament_saves WHERE user_id = $1 AND season_number = $2 AND week_number = $3",
      [userId, current.season, current.week],
    );
    return result.rows.map((row) => row.competition_id);
  }
  const prefix = `${userId}:${current.season}:${current.week}:`;
  return [...authMemory.circuitSaves.keys()]
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.split(":").pop());
}

async function getTournamentSave(userId, competitionId) {
  const current = await circuitState();
  if (db) {
    const result = await db.query(
      "SELECT save_json, updated_at FROM circuit_tournament_saves WHERE user_id = $1 AND season_number = $2 AND week_number = $3 AND competition_id = $4",
      [userId, current.season, current.week, competitionId],
    );
    const row = result.rows[0];
    return row ? { save: row.save_json, updatedAt: row.updated_at } : null;
  }
  const key = `${userId}:${current.season}:${current.week}:${competitionId}`;
  return authMemory.circuitSaves.get(key) || null;
}

async function putTournamentSave(userId, competitionId, save) {
  const current = await circuitState();
  if (db) {
    await db.query(`
      INSERT INTO circuit_tournament_saves (user_id, season_number, week_number, competition_id, save_json, updated_at)
      VALUES ($1, $2, $3, $4, $5::jsonb, NOW())
      ON CONFLICT (user_id, season_number, week_number, competition_id) DO UPDATE
        SET save_json = EXCLUDED.save_json,
            updated_at = NOW()
    `, [userId, current.season, current.week, competitionId, JSON.stringify(save)]);
    return;
  }
  const key = `${userId}:${current.season}:${current.week}:${competitionId}`;
  authMemory.circuitSaves.set(key, { save, updatedAt: new Date().toISOString() });
}

async function deleteTournamentSave(userId, competitionId) {
  const current = await circuitState();
  if (db) {
    await db.query(
      "DELETE FROM circuit_tournament_saves WHERE user_id = $1 AND season_number = $2 AND week_number = $3 AND competition_id = $4",
      [userId, current.season, current.week, competitionId],
    );
    return;
  }
  authMemory.circuitSaves.delete(`${userId}:${current.season}:${current.week}:${competitionId}`);
}

async function buildRanking(page = 1, pageSize = 50, currentUser = null, sortBy = "points") {
  const current = await circuitState();
  const rankingSort = ["points", "week", "season"].includes(sortBy) ? sortBy : "points";
  const refWeeks = previousCircuitWeeks(current.week);
  const refPeriodKeys = previousCircuitPeriods(current.season, current.week).map((period) => period.key);
  const currentPeriodKey = circuitPeriodKey(current.season, current.week);
  const nextPeriod = nextCircuitPeriod(current.season, current.week);
  const nextRefPeriodKeys = previousCircuitPeriods(nextPeriod.season, nextPeriod.week).map((period) => period.key);
  const previousPeriodKey = previousCircuitPeriods(current.season, current.week, 1)[0]?.key;
  if (db) {
    const humanResult = await db.query(`
      WITH week_scores AS (
        SELECT user_id,
          COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])), 0)::int AS score_ref,
          COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = $2), 0)::int AS score_week,
          COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($3::text[])), 0)::int AS score_next_ref,
          COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = $4), 0)::int AS score_previous_week,
          COALESCE(SUM(points) FILTER (WHERE season_number = $5), 0)::int AS score_total
        FROM circuit_week_scores
        GROUP BY user_id
      )
      SELECT users.id::text AS id, users.account_number, users.nickname,
          COALESCE(week_scores.score_ref, 0)::int AS score_ref,
          COALESCE(week_scores.score_week, 0)::int AS score_week,
          COALESCE(week_scores.score_next_ref, 0)::int AS score_next_ref,
          COALESCE(week_scores.score_previous_week, 0)::int AS score_previous_week,
          COALESCE(week_scores.score_total, 0)::int AS score_total,
          FALSE AS is_ai
      FROM users
      LEFT JOIN week_scores ON week_scores.user_id = users.id
    `, [refPeriodKeys, currentPeriodKey, nextRefPeriodKeys, previousPeriodKey, current.season]);
    const aiResult = await db.query(`
      SELECT ai_character_id,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])), 0)::int AS score_ref,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = $2), 0)::int AS score_week,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($3::text[])), 0)::int AS score_next_ref,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE CONCAT(season_number, ':', week_number) = $4), 0)::int AS score_previous_week,
        COALESCE(SUM(points + COALESCE(human_win_bonus, 0)) FILTER (WHERE season_number = $5), 0)::int AS score_total
      FROM circuit_ai_week_scores
      GROUP BY ai_character_id
    `, [refPeriodKeys, currentPeriodKey, nextRefPeriodKeys, previousPeriodKey, current.season]);
    const aiRowsById = new Map(aiResult.rows.map((row) => [row.ai_character_id, row]));
    const rows = [
      ...humanResult.rows,
      ...CIRCUIT_AI_CHARACTER_IDS.map((characterId) => {
        const scores = aiRowsById.get(characterId) || {};
        return {
          id: `ai:${characterId}`,
          account_number: null,
          nickname: aiCharacterName(characterId),
          score_ref: Number(scores.score_ref || 0),
          score_week: Number(scores.score_week || 0),
          score_next_ref: Number(scores.score_next_ref || 0),
          score_previous_week: Number(scores.score_previous_week || 0),
          score_total: Number(scores.score_total || 0),
          is_ai: true,
        };
      }),
    ];
    [...rows]
      .sort((a, b) => Number(b.score_ref || 0) - Number(a.score_ref || 0)
        || Number(b.score_week || 0) - Number(a.score_week || 0)
        || Number(b.score_total || 0) - Number(a.score_total || 0)
        || String(a.nickname || "").localeCompare(String(b.nickname || ""), "fr"))
      .forEach((row, index) => { row.points_rank = index + 1; });
    const scoreOrder = rankingSort === "week"
      ? ["score_week", "score_ref", "score_total"]
      : rankingSort === "season"
        ? ["score_total", "score_ref", "score_week"]
        : ["score_ref", "score_week", "score_total"];
    rows.sort((a, b) => {
      for (const field of scoreOrder) {
        const difference = Number(b[field] || 0) - Number(a[field] || 0);
        if (difference) return difference;
      }
      return String(a.nickname || "").localeCompare(String(b.nickname || ""), "fr");
    });
    rows.forEach((row, index) => { row.rank = index + 1; });
    const projectedRanks = [...rows]
      .sort((a, b) => (
        Number(b.score_next_ref || 0) - Number(a.score_next_ref || 0)
        || Number(b.score_week || 0) - Number(a.score_week || 0)
        || Number(b.score_total || 0) - Number(a.score_total || 0)
        || String(a.nickname || "").localeCompare(String(b.nickname || ""), "fr")
      ))
      .map((row, index) => [row.id, index + 1]);
    const projectedRankById = new Map(projectedRanks);
    rows.forEach((row) => {
      row.projected_rank = projectedRankById.get(row.id) || row.rank;
    });
    const offset = (page - 1) * pageSize;
    const pageRows = rows.slice(offset, offset + pageSize);
    const currentUserRank = currentUser ? rows.find((row) => row.id === currentUser.id) || null : null;
    return {
      ...current,
      sortBy: rankingSort,
      refWeeks,
      page,
      pageSize,
      totalPlayers: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / pageSize)),
      top: pageRows,
      currentUserRank,
    };
  }
  const refPeriods = previousCircuitPeriods(current.season, current.week);
  const nextRefPeriods = previousCircuitPeriods(nextPeriod.season, nextPeriod.week);
  const humanRows = [...authMemory.users.values()].map((user) => ({
    id: user.id,
    account_number: user.accountNumber || user.account_number || null,
    nickname: user.nickname,
    score_ref: sumMemoryUserPeriodScores(authMemory.circuitWeekScores, user.id, refPeriods),
    score_week: Number(authMemory.circuitWeekScores.get(`${user.id}:${current.season}:${current.week}`) || 0),
    score_next_ref: sumMemoryUserPeriodScores(authMemory.circuitWeekScores, user.id, nextRefPeriods),
    score_previous_week: Number(authMemory.circuitWeekScores.get(`${user.id}:${previousPeriodKey}`) || 0),
    score_total: Array.from({ length: CIRCUIT_SEASON_LENGTH }, (_, index) => index + 1)
      .reduce((sum, weekNumber) => sum + Number(authMemory.circuitWeekScores.get(`${user.id}:${current.season}:${weekNumber}`) || 0), 0),
    is_ai: false,
  }));
  const aiRows = CIRCUIT_AI_CHARACTER_IDS.map((characterId) => {
    const scoreRef = sumMemoryAiPeriodScores(authMemory.circuitAiWeekScores, characterId, refPeriods);
    const scoreWeek = memoryAiWeekScore(characterId, current.season, current.week);
    const scoreNextRef = sumMemoryAiPeriodScores(authMemory.circuitAiWeekScores, characterId, nextRefPeriods);
    const [previousSeason, previousWeek] = previousPeriodKey.split(":").map(Number);
    const scorePreviousWeek = memoryAiWeekScore(characterId, previousSeason, previousWeek);
    const scoreTotal = Array.from({ length: CIRCUIT_SEASON_LENGTH }, (_, index) => index + 1)
      .reduce((sum, weekNumber) => sum + memoryAiWeekScore(characterId, current.season, weekNumber), 0);
    return {
      id: `ai:${characterId}`,
      account_number: null,
      nickname: aiCharacterName(characterId),
      score_ref: scoreRef,
      score_week: scoreWeek,
      score_next_ref: scoreNextRef,
      score_previous_week: scorePreviousWeek,
      score_total: scoreTotal,
      is_ai: true,
    };
  });
  const rows = [...humanRows, ...aiRows];
  const memoryScoreOrder = rankingSort === "week"
    ? ["score_week", "score_ref", "score_total"]
    : rankingSort === "season"
      ? ["score_total", "score_ref", "score_week"]
      : ["score_ref", "score_week", "score_total"];
  [...rows]
    .sort((a, b) => b.score_ref - a.score_ref || b.score_week - a.score_week || b.score_total - a.score_total || a.nickname.localeCompare(b.nickname, "fr"))
    .forEach((row, index) => { row.points_rank = index + 1; });
  rows.sort((a, b) => {
    for (const field of memoryScoreOrder) {
      const difference = Number(b[field] || 0) - Number(a[field] || 0);
      if (difference) return difference;
    }
    return a.nickname.localeCompare(b.nickname, "fr");
  });
  rows.forEach((row, index) => { row.rank = index + 1; });
  const projectedRankById = new Map([...rows]
    .sort((a, b) => b.score_next_ref - a.score_next_ref || b.score_week - a.score_week || a.nickname.localeCompare(b.nickname, "fr"))
    .map((row, index) => [row.id, index + 1]));
  rows.forEach((row) => {
    row.projected_rank = projectedRankById.get(row.id) || row.rank;
  });
  const offset = (page - 1) * pageSize;
  return {
    ...current,
    sortBy: rankingSort,
    refWeeks,
    page,
    pageSize,
    totalPlayers: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / pageSize)),
    top: rows.slice(offset, offset + pageSize),
    currentUserRank: currentUser ? rows.find((row) => row.id === currentUser.id) || null : null,
  };
}

async function registerCircuitAiResults(userId, results = []) {
  for (const item of Array.isArray(results) ? results : []) {
    const aiCharacterId = String(item.aiCharacterId || "").slice(0, 48);
    if (!aiCharacterId) continue;
    const won = item.result === "win";
    if (db) {
      await db.query(`
        INSERT INTO circuit_ai_results (user_id, ai_character_id, wins, losses)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, ai_character_id) DO UPDATE
          SET wins = circuit_ai_results.wins + EXCLUDED.wins,
              losses = circuit_ai_results.losses + EXCLUDED.losses
      `, [userId, aiCharacterId, won ? 1 : 0, won ? 0 : 1]);
    } else {
      const key = `${userId}:${aiCharacterId}`;
      const current = authMemory.aiResults.get(key) || { wins: 0, losses: 0 };
      authMemory.aiResults.set(key, { wins: current.wins + (won ? 1 : 0), losses: current.losses + (won ? 0 : 1) });
    }
  }
}

async function registerCircuitAiHumanWinBonuses(results = [], season, week) {
  const winsByAi = new Map();
  for (const item of Array.isArray(results) ? results : []) {
    const aiCharacterId = String(item.aiCharacterId || "").slice(0, 48);
    if (!aiCharacterId || item.result !== "loss") continue;
    winsByAi.set(aiCharacterId, (winsByAi.get(aiCharacterId) || 0) + 1);
  }
  if (!winsByAi.size) return;
  const maxSem = maxWeeklyTournamentPoints(week);
  for (const [aiCharacterId, wins] of winsByAi) {
    const increment = Math.min(250, wins * 25);
    if (db) {
      await db.query(`
        INSERT INTO circuit_ai_week_scores
          (ai_character_id, season_number, week_number, points, human_win_bonus)
        VALUES ($1, $2, $3, 0, LEAST(250, $4, $5))
        ON CONFLICT (ai_character_id, season_number, week_number) DO UPDATE
          SET human_win_bonus = LEAST(
                250,
                GREATEST(0, $5 - circuit_ai_week_scores.points),
                circuit_ai_week_scores.human_win_bonus + EXCLUDED.human_win_bonus
              ),
              updated_at = NOW()
      `, [aiCharacterId, season, week, increment, maxSem]);
    } else {
      const key = `${season}:${week}:${aiCharacterId}`;
      const basePoints = Number(authMemory.circuitAiWeekScores.get(key) || 0);
      const previousBonus = Number(authMemory.circuitAiHumanBonuses.get(key) || 0);
      authMemory.circuitAiHumanBonuses.set(
        key,
        Math.min(250, previousBonus + increment, Math.max(0, maxSem - basePoints)),
      );
    }
  }
}

function normalizeTournamentAchievement(value) {
  const key = String(value || "").trim().toLowerCase();
  if (key === "winner" || key === "vainqueur") return "winner";
  if (key === "finalist" || key === "finaliste") return "finalist";
  if (key === "semi" || key === "demi-finale") return "semi";
  if (key === "quarter" || key === "quart de finale") return "quarter";
  if (key === "round16" || key === "8e de finale" || key === "qualif" || key === "qualification") return "round16";
  return key || "round16";
}

function achievementLabel(value) {
  const key = normalizeTournamentAchievement(value);
  return {
    winner: "VAINQUEUR",
    finalist: "FINALISTE",
    semi: "DEMI-FINALE",
    quarter: "QUART DE FINALE",
    round16: "8e DE FINALE",
  }[key] || "8e DE FINALE";
}

function seasonCalendar(current, rows = []) {
  const resultByCompetition = new Map(rows
    .filter((row) => Number(row.season_number || row.season) === Number(current.season))
    .map((row) => [row.competition_id || row.competitionId, row]));
  return COMPETITION_DEFINITIONS
    .filter((competition) => competition.week >= 1 && competition.week <= CIRCUIT_SEASON_LENGTH)
    .sort((a, b) => a.week - b.week || a.slot - b.slot)
    .map((competition) => {
      const reached = Number(competition.week) < Number(current.week) || Number(competition.week) === Number(current.week);
      const result = resultByCompetition.get(competition.id) || null;
      return {
        ...competition,
        reached,
        result: result ? {
          achievement: normalizeTournamentAchievement(result.achievement || result.round_reached || result.roundReached),
          label: achievementLabel(result.achievement || result.round_reached || result.roundReached),
          points: Number(result.points || 0),
          lastOpponent: result.last_opponent || result.lastOpponent || "",
          lastScore: result.last_score || result.lastScore || "",
        } : null,
      };
    });
}

async function profilePayload(user, viewer = user) {
  const ranking = await buildRanking(1, 50, viewer || user);
  const current = await circuitState();
  let results = [];
  let aiResults = [];
  let honors = [];
  if (db) {
    const resultRows = await db.query(`
      SELECT season_number, week_number, competition_id, competition_name, competition_type, city, country, flag, achievement, points, round_reached, last_opponent, last_score
      FROM circuit_tournament_results
      WHERE user_id = $1
      ORDER BY season_number DESC, week_number DESC, updated_at DESC
    `, [user.id]);
    results = resultRows.rows;
    const aiRows = await db.query("SELECT ai_character_id, wins, losses FROM circuit_ai_results WHERE user_id = $1 ORDER BY ai_character_id", [user.id]);
    aiResults = aiRows.rows;
    const honorRows = await db.query(`
      SELECT honor_type, label, season_number, week_number, rank, points, created_at
      FROM circuit_honors
      WHERE user_id = $1
      ORDER BY season_number DESC, week_number DESC, created_at DESC
    `, [user.id]);
    honors = honorRows.rows;
  } else {
    results = authMemory.circuitResults.filter((row) => row.userId === user.id);
    aiResults = [...authMemory.aiResults.entries()]
      .filter(([key]) => key.startsWith(`${user.id}:`))
      .map(([key, value]) => ({ ai_character_id: key.split(":").pop(), ...value }));
  }
  const fullRanking = await buildRanking(1, 100000, user);
  return {
    user: publicUser(user),
    publicProfile: viewer?.id !== user.id,
    viewerIsAdmin: normalizeRole(viewer?.role) === "admin",
    activity: publicProfileActivity(user.id),
    ranking: fullRanking.currentUserRank,
    circuit: { season: current.season, week: current.week },
    results,
    aiResults,
    honors,
    adminScores: normalizeRole(viewer?.role) === "admin" ? await adminScoreEditorPayload(user.id) : null,
    calendar: seasonCalendar(current, results),
  };
}

async function findUserByEmail(email) {
  if (db) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }
  return [...authMemory.users.values()].find((user) => user.email === email) || null;
}

function generateDefaultNickname(accountNumber) {
  const randomPart = String(Math.floor(1000 + Math.random() * 9000));
  return `Player${randomPart}${accountNumber}`;
}

async function createUser({ email, password, nickname: requestedNickname }) {
  const initialNickname = normalizeNickname(requestedNickname);
  const user = {
    id: crypto.randomUUID(),
    email,
    nickname: initialNickname || "Player",
    password_hash: hashPassword(password),
    role: defaultRoleForEmail(email),
    proCode: normalizeEmail(email) === ADMIN_EMAIL ? "JUL1EN" : null,
    selectedCharacterId: "tennisHope",
    unlockedCharacters: "coachJu,coachMax,coachCarla,coachClem",
    seenNews: "",
    createdAt: new Date().toISOString(),
  };
  if (db) {
    const result = await db.query(
      "INSERT INTO users (id, email, nickname, password_hash, role, pro_code, selected_character_id, unlocked_characters) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [user.id, user.email, user.nickname, user.password_hash, user.role, user.proCode, user.selectedCharacterId, user.unlockedCharacters],
    );
    const created = result.rows[0];
    const nickname = initialNickname && (!isReservedNickname(initialNickname) || canUseReservedNickname(created)) ? initialNickname : generateDefaultNickname(created.account_number);
    const updated = await db.query("UPDATE users SET nickname = $1 WHERE id = $2 RETURNING *", [nickname, created.id]);
    return updated.rows[0];
  }
  user.accountNumber = authMemory.users.size + 1;
  user.nickname = initialNickname && (!isReservedNickname(initialNickname) || canUseReservedNickname(user)) ? initialNickname : generateDefaultNickname(user.accountNumber);
  authMemory.users.set(user.id, user);
  if (user.role === "admin") authMemory.proCodes.set("JUL1EN", { code: "JUL1EN", assignedUserId: user.id, redeemedAt: new Date().toISOString() });
  return user;
}

async function createSession(userId) {
  const session = {
    id: crypto.randomBytes(32).toString("base64url"),
    userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
  if (db) {
    await db.query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [session.id, userId, session.expiresAt]);
  } else {
    authMemory.sessions.set(session.id, session);
  }
  return session.id;
}

async function deleteSession(sessionId) {
  if (!sessionId) return;
  if (db) {
    await db.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  } else {
    authMemory.sessions.delete(sessionId);
  }
}

async function userFromSession(sessionId) {
  if (!sessionId) return null;
  if (db) {
    const result = await db.query(
      `SELECT users.*
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = $1 AND sessions.expires_at > NOW()`,
      [sessionId],
    );
    return result.rows[0] || null;
  }
  const session = authMemory.sessions.get(sessionId);
  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    authMemory.sessions.delete(sessionId);
    return null;
  }
  return authMemory.users.get(session.userId) || null;
}

async function currentUser(req) {
  const sessionId = unpackSessionCookie(parseCookies(req)[SESSION_COOKIE]);
  return userFromSession(sessionId);
}

async function findUserById(userId) {
  if (db) {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    return result.rows[0] || null;
  }
  return authMemory.users.get(userId) || null;
}

async function assignProCodeToUser(user, code) {
  const cleanCode = normalizeProCode(code);
  if (cleanCode.length !== 6) throw new Error("Code Pro invalide.");
  if (db) {
    const codeResult = await db.query("SELECT * FROM pro_codes WHERE code = $1", [cleanCode]);
    const codeRow = codeResult.rows[0];
    if (!codeRow) throw new Error("Code Pro inconnu.");
    if (codeRow.assigned_user_id && codeRow.assigned_user_id !== user.id) throw new Error("Ce code Pro est déjà utilisé.");
    const updated = await db.query(`
      UPDATE users
      SET role = CASE WHEN email = $3 THEN 'admin' ELSE 'pro' END,
          pro_code = $1
      WHERE id = $2
      RETURNING *
    `, [cleanCode, user.id, ADMIN_EMAIL]);
    await db.query(`
      UPDATE pro_codes
      SET assigned_user_id = $2,
          redeemed_at = COALESCE(redeemed_at, NOW())
      WHERE code = $1
    `, [cleanCode, user.id]);
    return updated.rows[0];
  }
  const codeRow = authMemory.proCodes.get(cleanCode);
  if (!codeRow) throw new Error("Code Pro inconnu.");
  if (codeRow.assignedUserId && codeRow.assignedUserId !== user.id) throw new Error("Ce code Pro est déjà utilisé.");
  user.role = user.email === ADMIN_EMAIL ? "admin" : "pro";
  user.proCode = cleanCode;
  codeRow.assignedUserId = user.id;
  codeRow.redeemedAt = codeRow.redeemedAt || new Date().toISOString();
  return user;
}

function userUnlockedCharacters(user) {
  const role = normalizeRole(user?.role);
  if (role === "admin" || role === "pro_plus") return ALL_PROFILE_CHARACTER_IDS;
  if (role === "pro") return [...COACH_CHARACTER_IDS, ...PRO_REWARD_CHARACTER_IDS];
  return COACH_CHARACTER_IDS;
}

function canSelectCharacter(user, characterId) {
  const role = normalizeRole(user?.role);
  if (characterId === "tennisHope") return true;
  if ((role === "admin" || role === "pro_plus") && ALL_PROFILE_CHARACTER_IDS.includes(characterId)) return true;
  if (role === "pro" && PRO_REWARD_CHARACTER_IDS.includes(characterId)) return true;
  return COACH_CHARACTER_IDS.includes(characterId);
}

async function createAdminProCodes(adminUser, count = 5) {
  const amount = Math.max(1, Math.min(20, Number(count || 5)));
  const created = [];
  for (let index = 0; index < amount; index += 1) {
    let code = generateProCode();
    if (db) {
      while (true) {
        try {
          await db.query("INSERT INTO pro_codes (code, created_by) VALUES ($1, $2)", [code, adminUser.id]);
          created.push(code);
          break;
        } catch (error) {
          if (error.code !== "23505") throw error;
          code = generateProCode();
        }
      }
    } else {
      while (authMemory.proCodes.has(code)) code = generateProCode();
      authMemory.proCodes.set(code, { code, createdBy: adminUser.id, assignedUserId: null, createdAt: new Date().toISOString(), redeemedAt: null });
      created.push(code);
    }
  }
  return created;
}

function passwordResetTokenHash(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function publicBaseUrl(req) {
  const configured = process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL;
  if (configured) return configured.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

async function createPasswordResetToken(userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = passwordResetTokenHash(token);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  if (db) {
    await db.query("INSERT INTO password_reset_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)", [tokenHash, userId, expiresAt]);
  } else {
    authMemory.passwordResetTokens.set(tokenHash, { tokenHash, userId, expiresAt, usedAt: null, createdAt: new Date().toISOString() });
  }
  return { token, expiresAt };
}

function smtpReadResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      const last = lines[lines.length - 1];
      if (/^\d{3} /.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), text: buffer });
      }
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };
    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function smtpCommand(socket, command, expectedCodes = []) {
  socket.write(`${command}\r\n`);
  const response = await smtpReadResponse(socket);
  if (expectedCodes.length && !expectedCodes.includes(response.code)) {
    throw new Error(`SMTP ${response.code}: ${response.text.trim()}`);
  }
  return response;
}

function connectSmtpSocket(host, port, secure) {
  return new Promise((resolve, reject) => {
    const socket = secure
      ? tls.connect({ host, port, servername: host, rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === "false" ? false : true })
      : net.connect({ host, port });
    socket.setTimeout(15000);
    socket.once("connect", () => resolve(socket));
    socket.once("secureConnect", () => resolve(socket));
    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error("SMTP timeout"));
    });
    socket.once("error", reject);
  });
}

function emailFromAddress(value) {
  const match = String(value || "").match(/<([^>]+)>/);
  return (match ? match[1] : value || "").trim();
}

function smtpEscapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

async function sendSmtpMail({ to, subject, text, html }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  if (!host || !user || !pass || !from) {
    throw new Error("Configuration SMTP incomplète.");
  }
  const secure = port === 465;
  let socket = await connectSmtpSocket(host, port, secure);
  try {
    await smtpReadResponse(socket);
    await smtpCommand(socket, `EHLO ${process.env.SMTP_HELO || "tennis-courts-academy"}`, [250]);
    if (!secure) {
      await smtpCommand(socket, "STARTTLS", [220]);
      socket = tls.connect({ socket, servername: host, rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === "false" ? false : true });
      await new Promise((resolve, reject) => {
        socket.once("secureConnect", resolve);
        socket.once("error", reject);
      });
      await smtpCommand(socket, `EHLO ${process.env.SMTP_HELO || "tennis-courts-academy"}`, [250]);
    }
    await smtpCommand(socket, "AUTH LOGIN", [334]);
    await smtpCommand(socket, Buffer.from(user).toString("base64"), [334]);
    await smtpCommand(socket, Buffer.from(pass).toString("base64"), [235]);
    await smtpCommand(socket, `MAIL FROM:<${emailFromAddress(from)}>`, [250]);
    await smtpCommand(socket, `RCPT TO:<${emailFromAddress(to)}>`, [250, 251]);
    await smtpCommand(socket, "DATA", [354]);
    const message = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: multipart/alternative; boundary=\"tcacademy-reset\"",
      "",
      "--tcacademy-reset",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      text,
      "",
      "--tcacademy-reset",
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      html,
      "",
      "--tcacademy-reset--",
      ".",
    ].join("\r\n");
    socket.write(`${message}\r\n`);
    await smtpReadResponse(socket);
    await smtpCommand(socket, "QUIT", [221]);
  } finally {
    socket.destroy();
  }
}

function sendBrevoApiMail({ to, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const from = process.env.BREVO_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!apiKey || !from) {
    throw new Error("Configuration Brevo API incomplète.");
  }
  const fromEmail = emailFromAddress(from);
  const fromNameMatch = String(from).match(/^(.+?)\s*</);
  const payload = JSON.stringify({
    sender: {
      email: fromEmail,
      name: fromNameMatch ? fromNameMatch[1].trim().replace(/^"|"$/g, "") : "Tennis Courts Academy",
    },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html,
  });
  return new Promise((resolve, reject) => {
    const request = https.request({
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "api-key": apiKey,
        "accept": "application/json",
        "content-type": "application/json",
        "content-length": Buffer.byteLength(payload),
      },
      timeout: 15000,
    }, (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString("utf8");
      });
      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(body);
          return;
        }
        reject(new Error(`Brevo API ${response.statusCode}: ${body || response.statusMessage}`));
      });
    });
    request.on("timeout", () => {
      request.destroy(new Error("Brevo API timeout"));
    });
    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

async function sendPasswordResetLink(email, link) {
  const safeLink = smtpEscapeHtml(link);
  const message = {
    to: email,
    subject: "Réinitialisation du mot de passe Tennis Courts Academy",
    text: `Bonjour,\n\nCliquez sur ce lien pour réinitialiser votre mot de passe Tennis Courts Academy. Il est valable 10 minutes :\n${link}\n\nSi vous n'avez rien demandé, ignorez cet email.`,
    html: `<p>Bonjour,</p><p>Cliquez sur ce lien pour réinitialiser votre mot de passe Tennis Courts Academy. Il est valable 10 minutes :</p><p><a href="${safeLink}">${safeLink}</a></p><p>Si vous n'avez rien demandé, ignorez cet email.</p>`,
  };
  if (process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY) {
    try {
      await sendBrevoApiMail(message);
      console.log(`Password reset email sent through Brevo API to ${email}`);
      return;
    } catch (error) {
      console.error(`Brevo password reset email failed for ${email}: ${error.message}`);
      if (!process.env.SMTP_HOST) throw error;
    }
  }
  if (!process.env.SMTP_HOST) {
    console.log(`Password reset link for ${email}: ${link}`);
    return;
  }
  await sendSmtpMail(message);
  console.log(`Password reset email sent through SMTP to ${email}`);
}

async function consumePasswordResetToken(token, password) {
  const tokenHash = passwordResetTokenHash(token);
  if (db) {
    const result = await db.query(`
      SELECT * FROM password_reset_tokens
      WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
    `, [tokenHash]);
    const row = result.rows[0];
    if (!row) return null;
    const updated = await db.query("UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *", [hashPassword(password), row.user_id]);
    await db.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = $1", [tokenHash]);
    return updated.rows[0] || null;
  }
  const row = authMemory.passwordResetTokens.get(tokenHash);
  if (!row || row.usedAt || Date.parse(row.expiresAt) <= Date.now()) return null;
  const user = authMemory.users.get(row.userId);
  if (!user) return null;
  user.password_hash = hashPassword(password);
  row.usedAt = new Date().toISOString();
  return user;
}

async function listProCodes() {
  if (db) {
    const result = await db.query(`
      SELECT pro_codes.code, pro_codes.created_at, pro_codes.redeemed_at,
             users.id AS assigned_user_id, users.email AS assigned_email, users.nickname AS assigned_nickname
      FROM pro_codes
      LEFT JOIN users ON users.id = pro_codes.assigned_user_id
      ORDER BY pro_codes.created_at DESC, pro_codes.code ASC
    `);
    return result.rows.map((row) => ({
      code: row.code,
      createdAt: row.created_at,
      redeemedAt: row.redeemed_at,
      assignedTo: row.assigned_user_id ? { id: row.assigned_user_id, email: row.assigned_email, nickname: row.assigned_nickname } : null,
    }));
  }
  return [...authMemory.proCodes.values()].map((row) => {
    const user = row.assignedUserId ? authMemory.users.get(row.assignedUserId) : null;
    return {
      code: row.code,
      createdAt: row.createdAt,
      redeemedAt: row.redeemedAt,
      assignedTo: user ? { id: user.id, email: user.email, nickname: user.nickname } : null,
    };
  }).sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function normalizeHumanMatchLogSession(payload, user) {
  const session = payload?.session;
  if (!session || typeof session !== "object" || Array.isArray(session)) {
    throw new Error("Journal de partie invalide.");
  }
  const matchId = String(session.matchId || "").trim();
  if (!matchId || matchId.length > 160) throw new Error("Identifiant de partie invalide.");
  if (session.status !== "completed" || !session.completedAt) {
    throw new Error("Seules les parties terminées peuvent être enregistrées.");
  }
  const serialized = JSON.stringify(session);
  if (serialized.length > 9_000_000) throw new Error("Journal de partie trop volumineux.");
  return {
    ...session,
    schemaVersion: Number(session.schemaVersion || 1),
    matchId,
    status: "completed",
    observerUser: {
      id: user.id,
      nickname: user.nickname,
    },
    receivedAt: new Date().toISOString(),
  };
}

async function saveHumanMatchLog(user, payload) {
  const session = normalizeHumanMatchLogSession(payload, user);
  if (db) {
    await db.query(`
      INSERT INTO human_match_logs
        (match_id, observer_user_id, context_type, status, started_at, completed_at, payload, received_at, updated_at)
      VALUES ($1, $2, $3, 'completed', $4, $5, $6::jsonb, NOW(), NOW())
      ON CONFLICT (match_id, observer_user_id)
      DO UPDATE SET
        context_type = EXCLUDED.context_type,
        status = EXCLUDED.status,
        started_at = EXCLUDED.started_at,
        completed_at = EXCLUDED.completed_at,
        payload = EXCLUDED.payload,
        received_at = NOW(),
        updated_at = NOW()
    `, [
      session.matchId,
      user.id,
      String(session.context?.type || ""),
      session.startedAt || null,
      session.completedAt || null,
      JSON.stringify(session),
    ]);
  } else {
    authMemory.humanMatchLogs.set(`${user.id}:${session.matchId}`, session);
  }
  return session;
}

async function listHumanMatchLogs({ userId = null, limit = 100 } = {}) {
  const safeLimit = Math.max(1, Math.min(500, Number(limit || 100)));
  if (db) {
    const params = [];
    const where = userId ? "WHERE observer_user_id = $1" : "";
    if (userId) params.push(userId);
    params.push(safeLimit);
    const result = await db.query(`
      SELECT payload
      FROM human_match_logs
      ${where}
      ORDER BY completed_at DESC NULLS LAST, received_at DESC
      LIMIT $${params.length}
    `, params);
    return result.rows.map((row) => row.payload);
  }
  return [...authMemory.humanMatchLogs.entries()]
    .filter(([key]) => !userId || key.startsWith(`${userId}:`))
    .map(([, session]) => session)
    .sort((a, b) => String(b.completedAt || b.receivedAt || "").localeCompare(String(a.completedAt || a.receivedAt || "")))
    .slice(0, safeLimit);
}

async function requireAdmin(req, res) {
  const user = await currentUser(req);
  if (!user || normalizeRole(user.role) !== "admin") {
    sendJson(res, 403, { error: "Accès administrateur requis." });
    return null;
  }
  return user;
}

async function requirePro(req, res) {
  const user = await currentUser(req);
  if (!user || !["pro", "pro_plus", "admin"].includes(normalizeRole(user.role))) {
    sendJson(res, 403, { error: "Compte Pro requis." });
    return null;
  }
  return user;
}

async function markNewsSeen(user, newsId) {
  const news = GAME_NEWS.find((item) => item.id === newsId);
  if (!news || !news.audienceRoles.includes(normalizeRole(user?.role))) return false;
  const seen = seenNewsIds(user);
  seen.add(newsId);
  const serialized = [...seen].join(",");
  if (db) {
    await db.query("UPDATE users SET seen_news = $1 WHERE id = $2", [serialized, user.id]);
    user.seen_news = serialized;
  } else {
    user.seenNews = serialized;
  }
  return true;
}

async function handleAuth(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    sendJson(res, 200, { user: publicUser(await currentUser(req)) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/register") {
    const payload = await readJson(req);
    const email = normalizeEmail(payload.email);
    const password = String(payload.password || "");
    if (!isValidEmail(email)) {
      sendJson(res, 400, { error: "Adresse email invalide." });
      return true;
    }
    if (password.length < 8) {
      sendJson(res, 400, { error: "Le mot de passe doit contenir au moins 8 caractères." });
      return true;
    }
    if (await findUserByEmail(email)) {
      sendJson(res, 409, { error: "Un compte existe déjà avec cet email." });
      return true;
    }
    const user = await createUser({ email, password, nickname: payload.nickname });
    const sessionId = await createSession(user.id);
    setSessionCookie(req, res, sessionId);
    sendJson(res, 201, { user: publicUser(user) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const payload = await readJson(req);
    const email = normalizeEmail(payload.email);
    const password = String(payload.password || "");
    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      sendJson(res, 401, { error: "Email ou mot de passe incorrect." });
      return true;
    }
    if (db) await db.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);
    const sessionId = await createSession(user.id);
    setSessionCookie(req, res, sessionId);
    sendJson(res, 200, { user: publicUser(user) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    await deleteSession(unpackSessionCookie(parseCookies(req)[SESSION_COOKIE]));
    clearSessionCookie(res);
    sendJson(res, 200, { ok: true });
    return true;
  }

  const seenNewsMatch = url.pathname.match(/^\/api\/news\/([^/]+)\/seen$/);
  if (req.method === "POST" && seenNewsMatch) {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    const newsId = decodeURIComponent(seenNewsMatch[1]);
    if (!await markNewsSeen(user, newsId)) {
      sendJson(res, 404, { error: "Actualité inconnue." });
      return true;
    }
    sendJson(res, 200, { ok: true, newsId });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/password-reset/request") {
    const payload = await readJson(req);
    const email = normalizeEmail(payload.email);
    const user = await findUserByEmail(email);
    if (user) {
      const reset = await createPasswordResetToken(user.id);
      const link = `${publicBaseUrl(req)}/?reset=${encodeURIComponent(reset.token)}`;
      try {
        await sendPasswordResetLink(email, link);
      } catch (error) {
        console.error(`Password reset email failed for ${email}:`, error);
      }
    }
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/password-reset/confirm") {
    const payload = await readJson(req);
    const token = String(payload.token || "");
    const password = String(payload.password || "");
    if (password.length < 8) {
      sendJson(res, 400, { error: "Le mot de passe doit contenir au moins 8 caractères." });
      return true;
    }
    const user = await consumePasswordResetToken(token, password);
    if (!user) {
      sendJson(res, 400, { error: "Lien expiré ou déjà utilisé." });
      return true;
    }
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/redeem-pro-code") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    if (normalizeRole(user.role) !== "free") {
      sendJson(res, 400, { error: "Ce compte a déjà un accès Pro." });
      return true;
    }
    const payload = await readJson(req);
    try {
      const updated = await assignProCodeToUser(user, payload.code);
      sendJson(res, 200, { user: publicUser(updated) });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/human-match-logs") {
    if (!await requireAdmin(req, res)) return true;
    const matches = await listHumanMatchLogs({ limit: url.searchParams.get("limit") || 500 });
    sendJson(res, 200, { matches });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/users") {
    if (!await requireAdmin(req, res)) return true;
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = 50;
    const offset = (page - 1) * pageSize;
    const current = await circuitState();
    const refPeriodKeys = previousCircuitPeriods(current.season, current.week).map((period) => period.key);
    const currentPeriodKey = circuitPeriodKey(current.season, current.week);
    if (db) {
      const [result, countResult] = await Promise.all([
        db.query(`
          WITH scores AS (
            SELECT user_id,
              COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])), 0)::int AS score_ref,
              COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = $2), 0)::int AS score_week,
              COALESCE(SUM(points) FILTER (WHERE season_number = $3), 0)::int AS score_total
            FROM circuit_week_scores
            GROUP BY user_id
          )
          SELECT users.id, users.account_number, users.email, users.nickname, users.role, users.pro_code, users.created_at, users.last_login_at,
            COALESCE(scores.score_ref, 0)::int AS score_ref,
            COALESCE(scores.score_week, 0)::int AS score_week,
            COALESCE(scores.score_total, 0)::int AS score_total
          FROM users
          LEFT JOIN scores ON scores.user_id = users.id
          ORDER BY users.account_number ASC
          LIMIT $4 OFFSET $5
        `, [refPeriodKeys, currentPeriodKey, current.season, pageSize, offset]),
        db.query("SELECT COUNT(*)::int AS total FROM users"),
      ]);
      const total = countResult.rows[0]?.total || 0;
      sendJson(res, 200, { users: result.rows.map(adminPublicUser), page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
      return true;
    }
    const allUsers = [...authMemory.users.values()].sort((a, b) => (a.accountNumber || 0) - (b.accountNumber || 0));
    const refPeriods = previousCircuitPeriods(current.season, current.week);
    const users = allUsers.slice(offset, offset + pageSize).map((user) => ({
      ...user,
      scoreRef: sumMemoryUserPeriodScores(authMemory.circuitWeekScores, user.id, refPeriods),
      scoreWeek: authMemory.circuitWeekScores.get(`${user.id}:${current.season}:${current.week}`) || 0,
      scoreTotal: Array.from({ length: CIRCUIT_SEASON_LENGTH }, (_, index) => index + 1)
        .reduce((sum, weekNumber) => sum + (authMemory.circuitWeekScores.get(`${user.id}:${current.season}:${weekNumber}`) || 0), 0),
    }));
    sendJson(res, 200, { users: users.map(adminPublicUser), page, pageSize, total: allUsers.length, totalPages: Math.max(1, Math.ceil(allUsers.length / pageSize)) });
    return true;
  }

  const seasonPointsMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/season-points$/);
  if (req.method === "POST" && seasonPointsMatch) {
    const admin = await requireAdmin(req, res);
    if (!admin) return true;
    const userId = decodeURIComponent(seasonPointsMatch[1]);
    const target = await findUserById(userId);
    if (!target) {
      sendJson(res, 404, { error: "Utilisateur introuvable." });
      return true;
    }
    const payload = await readJson(req);
    const points = Math.max(0, Math.round(Number(payload.points || 0)));
    if (!points) {
      sendJson(res, 400, { error: "Indique un nombre de points supérieur à 0." });
      return true;
    }
    const current = await circuitState();
    const scoreKey = circuitScoreKey(current);
    if (db) {
      await db.query(`
        INSERT INTO weekly_competition_scores (user_id, week_key, competition_id, points, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, week_key, competition_id) DO UPDATE
          SET points = weekly_competition_scores.points + EXCLUDED.points,
              updated_at = NOW()
      `, [userId, scoreKey, ADMIN_MANUAL_COMPETITION_ID, points]);
      await recomputeUserCircuitWeekScore(userId, current.season, current.week);
      const refreshed = await db.query(`
        WITH scores AS (
          SELECT user_id,
            COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = ANY($1::text[])), 0)::int AS score_ref,
            COALESCE(SUM(points) FILTER (WHERE CONCAT(season_number, ':', week_number) = $2), 0)::int AS score_week,
            COALESCE(SUM(points) FILTER (WHERE season_number = $3), 0)::int AS score_total
          FROM circuit_week_scores
          WHERE user_id = $4
          GROUP BY user_id
        )
        SELECT users.*, COALESCE(scores.score_ref, 0)::int AS score_ref,
          COALESCE(scores.score_week, 0)::int AS score_week,
          COALESCE(scores.score_total, 0)::int AS score_total
        FROM users
        LEFT JOIN scores ON scores.user_id = users.id
        WHERE users.id = $4
      `, [
        previousCircuitPeriods(current.season, current.week).map((period) => period.key),
        circuitPeriodKey(current.season, current.week),
        current.season,
        userId,
      ]);
      sendJson(res, 200, { user: adminPublicUser(refreshed.rows[0]), addedPoints: points });
      return true;
    }
    const key = `${userId}:${scoreKey}:${ADMIN_MANUAL_COMPETITION_ID}`;
    const previous = authMemory.weeklyScores.get(key)?.points || 0;
    authMemory.weeklyScores.set(key, { points: previous + points, achievement: "admin", updatedAt: new Date().toISOString() });
    await recomputeUserCircuitWeekScore(userId, current.season, current.week);
    const refPeriods = previousCircuitPeriods(current.season, current.week);
    const updated = {
      ...target,
      scoreRef: sumMemoryUserPeriodScores(authMemory.circuitWeekScores, userId, refPeriods),
      scoreWeek: authMemory.circuitWeekScores.get(`${userId}:${current.season}:${current.week}`) || 0,
      scoreTotal: Array.from({ length: CIRCUIT_SEASON_LENGTH }, (_, index) => index + 1)
        .reduce((sum, weekNumber) => sum + (authMemory.circuitWeekScores.get(`${userId}:${current.season}:${weekNumber}`) || 0), 0),
    };
    sendJson(res, 200, { user: adminPublicUser(updated), addedPoints: points });
    return true;
  }

  const roleMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/role$/);
  const rankingScoresMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/ranking-scores$/);
  if ((req.method === "GET" || req.method === "POST") && rankingScoresMatch) {
    if (!await requireAdmin(req, res)) return true;
    const userId = decodeURIComponent(rankingScoresMatch[1]);
    const target = await findUserById(userId);
    if (!target) {
      sendJson(res, 404, { error: "Utilisateur introuvable." });
      return true;
    }
    if (req.method === "POST") {
      const payload = await readJson(req);
      const scores = await setAdminScorePeriods(userId, payload.periods);
      if (Object.prototype.hasOwnProperty.call(payload, "weeklyAttempts")) {
        await setCurrentRetryCount(userId, payload.weeklyAttempts);
      }
      scores.weeklyAttempts = (await adminScoreEditorPayload(userId)).weeklyAttempts;
      sendJson(res, 200, { scores });
      return true;
    }
    sendJson(res, 200, { scores: await adminScoreEditorPayload(userId) });
    return true;
  }

  const resetTournamentMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/tournaments\/([^/]+)\/reset$/);
  if (req.method === "POST" && resetTournamentMatch) {
    if (!await requireAdmin(req, res)) return true;
    const userId = decodeURIComponent(resetTournamentMatch[1]);
    const competitionId = decodeURIComponent(resetTournamentMatch[2]);
    const target = await findUserById(userId);
    const competition = anyCompetitionDefinitionById(competitionId);
    if (!target || !competition) {
      sendJson(res, 404, { error: !target ? "Utilisateur introuvable." : "Tournoi introuvable." });
      return true;
    }
    const payload = await readJson(req);
    const season = Math.max(1, Math.round(Number(payload.season || 0)));
    const week = Math.max(1, Math.round(Number(payload.week || competition.week || 0)));
    if (!season || !week || Number(competition.week) !== week) {
      sendJson(res, 400, { error: "Période de tournoi invalide." });
      return true;
    }
    const scoreKey = circuitScoreKey({ season, week });
    const resetAt = new Date().toISOString();
    if (db) {
      await db.query(
        "DELETE FROM circuit_tournament_results WHERE user_id = $1 AND season_number = $2 AND week_number = $3 AND competition_id = $4",
        [userId, season, week, competitionId],
      );
      await db.query(
        "DELETE FROM weekly_competition_scores WHERE user_id = $1 AND week_key = $2 AND competition_id = $3",
        [userId, scoreKey, competitionId],
      );
      await db.query(
        "DELETE FROM circuit_tournament_saves WHERE user_id = $1 AND season_number = $2 AND week_number = $3 AND competition_id = $4",
        [userId, season, week, competitionId],
      );
      await db.query(
        "DELETE FROM circuit_attempts WHERE user_id = $1 AND season_number = $2 AND week_number = $3 AND competition_id = $4",
        [userId, season, week, competitionId],
      );
      await db.query(`
        INSERT INTO circuit_tournament_resets (user_id, season_number, week_number, competition_id, reset_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, season_number, week_number, competition_id) DO UPDATE
          SET reset_at = EXCLUDED.reset_at
      `, [userId, season, week, competitionId, resetAt]);
    } else {
      authMemory.circuitResults = authMemory.circuitResults.filter((row) => !(
        row.userId === userId && Number(row.season) === season && Number(row.week) === week && row.competitionId === competitionId
      ));
      authMemory.weeklyScores.delete(`${userId}:${scoreKey}:${competitionId}`);
      authMemory.circuitSaves.delete(`${userId}:${season}:${week}:${competitionId}`);
      authMemory.circuitAttempts.delete(`${userId}:${season}:${week}:${competitionId}`);
      authMemory.circuitResets.set(`${userId}:${season}:${week}:${competitionId}`, resetAt);
    }
    await recomputeUserCircuitWeekScore(userId, season, week);
    sendJson(res, 200, { ok: true, competitionId, season, week, resetAt });
    return true;
  }

  const resetCareerMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/reset-career$/);
  if (req.method === "POST" && resetCareerMatch) {
    if (!await requireAdmin(req, res)) return true;
    const userId = decodeURIComponent(resetCareerMatch[1]);
    const target = await findUserById(userId);
    if (!target) {
      sendJson(res, 404, { error: "Utilisateur introuvable." });
      return true;
    }
    if (db) {
      await db.query("DELETE FROM circuit_tournament_results WHERE user_id = $1", [userId]);
      await db.query("DELETE FROM weekly_competition_scores WHERE user_id = $1", [userId]);
      await db.query("DELETE FROM circuit_week_scores WHERE user_id = $1", [userId]);
      await db.query("DELETE FROM circuit_honors WHERE user_id = $1", [userId]);
      await db.query(`
        UPDATE users SET best_world_rank = NULL, weeks_world_number_one = 0,
          weeks_world_top3 = 0, weeks_world_top5 = 0, weeks_world_top10 = 0
        WHERE id = $1
      `, [userId]);
    } else {
      authMemory.circuitResults = authMemory.circuitResults.filter((row) => row.userId !== userId);
      for (const key of Array.from(authMemory.weeklyScores.keys())) if (key.startsWith(`${userId}:`)) authMemory.weeklyScores.delete(key);
      for (const key of Array.from(authMemory.circuitWeekScores.keys())) if (key.startsWith(`${userId}:`)) authMemory.circuitWeekScores.delete(key);
      target.bestWorldRank = null;
      target.weeksWorldNumberOne = 0;
      target.weeksWorldTop3 = 0;
      target.weeksWorldTop5 = 0;
      target.weeksWorldTop10 = 0;
    }
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === "POST" && roleMatch) {
    const admin = await requireAdmin(req, res);
    if (!admin) return true;
    const userId = decodeURIComponent(roleMatch[1]);
    const payload = await readJson(req);
    const role = normalizeRole(payload.role);
    const target = await findUserById(userId);
    if (!target) {
      sendJson(res, 404, { error: "Utilisateur introuvable." });
      return true;
    }
    if (normalizeEmail(target.email) === ADMIN_EMAIL || normalizeRole(target.role) === "admin") {
      sendJson(res, 403, { error: "Le compte ADMIN ne peut pas être modifié." });
      return true;
    }
    if (role === "admin") {
      sendJson(res, 403, { error: "Impossible de créer un autre compte ADMIN." });
      return true;
    }
    if (role === "pro" && !(target.pro_code || target.proCode)) {
      const [code] = await createAdminProCodes(admin, 1);
      const updated = await assignProCodeToUser(target, code);
      sendJson(res, 200, { user: publicUser(updated) });
      return true;
    }
    if (db) {
      const result = await db.query(
        "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, account_number, email, nickname, role, pro_code, created_at, last_login_at",
        [role, userId],
      );
      if (!result.rows[0]) {
        sendJson(res, 404, { error: "Utilisateur introuvable." });
        return true;
      }
      sendJson(res, 200, { user: publicUser(result.rows[0]) });
      return true;
    }
    const user = target;
    user.role = role;
    sendJson(res, 200, { user: publicUser(user) });
    return true;
  }

  const deleteUserMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (req.method === "DELETE" && deleteUserMatch) {
    if (!await requireAdmin(req, res)) return true;
    const userId = decodeURIComponent(deleteUserMatch[1]);
    const target = await findUserById(userId);
    if (!target) {
      sendJson(res, 404, { error: "Utilisateur introuvable." });
      return true;
    }
    if (normalizeEmail(target.email) === ADMIN_EMAIL || normalizeRole(target.role) === "admin") {
      sendJson(res, 403, { error: "Le compte ADMIN ne peut pas être supprimé." });
      return true;
    }
    if (db) {
      await db.query("DELETE FROM users WHERE id = $1", [userId]);
    } else {
      authMemory.users.delete(userId);
      for (const [sessionId, session] of authMemory.sessions.entries()) {
        if (session.userId === userId) authMemory.sessions.delete(sessionId);
      }
    }
    sendJson(res, 200, { ok: true, deletedUserId: userId });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/pro-codes") {
    if (!await requireAdmin(req, res)) return true;
    sendJson(res, 200, { codes: await listProCodes() });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/pro-codes/generate") {
    const admin = await requireAdmin(req, res);
    if (!admin) return true;
    const payload = await readJson(req);
    await createAdminProCodes(admin, payload.count || 5);
    sendJson(res, 201, { codes: await listProCodes() });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/competitions") {
    const user = await requirePro(req, res);
    if (!user) return true;
    const current = await circuitState();
    const bestScores = await currentTournamentScoreMap(user.id);
    const bestPerformances = await currentTournamentPerformanceMap(user.id);
    const retryInfo = await currentRetryInfo(user.id);
    sendJson(res, 200, {
      ...current,
      scoreKey: circuitScoreKey(current),
      title: "Tennis Courts Pro Circuit",
      competitions: await weeklyCompetitionPayload(),
      nextUpdateAt: nextCircuitUpdateAt(),
      bestScores,
      bestPerformances,
      savedTournamentIds: await currentTournamentSaveIds(user.id),
      resetAtByCompetition: await currentTournamentResetMap(user.id),
      retriesUsed: retryInfo.retriesUsed,
      retryLimit: retryInfo.retryLimit,
      retriesRemaining: Math.max(0, retryInfo.retryLimit - retryInfo.retriesUsed),
      retriesByCompetition: retryInfo.byCompetition,
    });
    return true;
  }

  const attemptMatch = url.pathname.match(/^\/api\/competitions\/([^/]+)\/attempt$/);
  if (req.method === "POST" && attemptMatch) {
    const user = await requirePro(req, res);
    if (!user) return true;
    const competitionId = decodeURIComponent(attemptMatch[1]);
    const competition = await competitionDefinitionById(competitionId);
    if (!competition) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return true;
    }
    const current = await circuitState();
    const scoreKey = circuitScoreKey(current);
    const bestScores = await currentTournamentScoreMap(user.id);
    const alreadyPlayed = Object.prototype.hasOwnProperty.call(bestScores, competitionId);
    const retryInfo = await currentRetryInfo(user.id);
    if (alreadyPlayed && retryInfo.retriesUsed >= DAILY_RETRY_LIMIT) {
      sendJson(res, 403, { error: "Vous avez utilisé vos 5 nouvelles tentatives de la semaine." });
      return true;
    }
    if (alreadyPlayed) {
      if (db) {
        await db.query(`
          INSERT INTO circuit_attempts (user_id, season_number, week_number, competition_id, retries, updated_at)
          VALUES ($1, $2, $3, $4, 1, NOW())
          ON CONFLICT (user_id, season_number, week_number, competition_id) DO UPDATE
            SET retries = circuit_attempts.retries + 1,
                updated_at = NOW()
        `, [user.id, current.season, current.week, competitionId]);
      } else {
        const key = `${user.id}:${current.season}:${current.week}:${competitionId}`;
        authMemory.circuitAttempts.set(key, Number(authMemory.circuitAttempts.get(key) || 0) + 1);
      }
    }
    sendJson(res, 200, { ok: true, scoreKey, countedAsRetry: alreadyPlayed });
    return true;
  }

  const scoreMatch = url.pathname.match(/^\/api\/competitions\/([^/]+)\/score$/);
  if (req.method === "POST" && scoreMatch) {
    const user = await requirePro(req, res);
    if (!user) return true;
    const competitionId = decodeURIComponent(scoreMatch[1]);
    const competition = await competitionDefinitionById(competitionId);
    if (!competition) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return true;
    }
    const payload = await readJson(req);
    const points = Math.max(0, Math.round(Number(payload.points || 0)));
    const achievement = normalizeTournamentAchievement(payload.achievement);
    const roundReached = normalizeTournamentAchievement(payload.roundReached || payload.achievement);
    const lastOpponent = String(payload.lastOpponent || "").slice(0, 80);
    const lastScore = String(payload.lastScore || "").slice(0, 80);
    const current = await circuitState();
    const scoreKey = circuitScoreKey(current);
    if (db) {
      await db.query(`
        INSERT INTO weekly_competition_scores (user_id, week_key, competition_id, points, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, week_key, competition_id) DO UPDATE
          SET points = GREATEST(weekly_competition_scores.points, EXCLUDED.points),
              updated_at = CASE WHEN EXCLUDED.points > weekly_competition_scores.points THEN NOW() ELSE weekly_competition_scores.updated_at END
      `, [user.id, scoreKey, competitionId, points]);
      await db.query(`
        INSERT INTO circuit_tournament_results
          (user_id, season_number, week_number, competition_id, competition_name, competition_type, city, country, flag, achievement, points, round_reached, last_opponent, last_score, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
        ON CONFLICT (user_id, season_number, week_number, competition_id) DO UPDATE
          SET achievement = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN EXCLUDED.achievement ELSE circuit_tournament_results.achievement END,
            points = GREATEST(circuit_tournament_results.points, EXCLUDED.points),
            round_reached = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN EXCLUDED.round_reached ELSE circuit_tournament_results.round_reached END,
            last_opponent = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN EXCLUDED.last_opponent ELSE circuit_tournament_results.last_opponent END,
            last_score = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN EXCLUDED.last_score ELSE circuit_tournament_results.last_score END,
            city = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN EXCLUDED.city ELSE circuit_tournament_results.city END,
            country = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN EXCLUDED.country ELSE circuit_tournament_results.country END,
            flag = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN EXCLUDED.flag ELSE circuit_tournament_results.flag END,
            updated_at = CASE WHEN EXCLUDED.points > circuit_tournament_results.points THEN NOW() ELSE circuit_tournament_results.updated_at END
      `, [user.id, current.season, current.week, competitionId, competition.name, competition.type, competition.city, competition.country, competition.flag, achievement, points, roundReached, lastOpponent, lastScore]);
    } else {
      const key = `${user.id}:${scoreKey}:${competitionId}`;
      const previousScore = authMemory.weeklyScores.get(key);
      if (!previousScore || points > previousScore.points) {
        authMemory.weeklyScores.set(key, { points, achievement, updatedAt: new Date().toISOString() });
      }
      const previousResult = authMemory.circuitResults.find((row) => row.userId === user.id && row.season === current.season && row.week === current.week && row.competitionId === competitionId);
      if (!previousResult || points > previousResult.points) {
        const filtered = authMemory.circuitResults.filter((row) => !(row.userId === user.id && row.season === current.season && row.week === current.week && row.competitionId === competitionId));
        filtered.push({ userId: user.id, season: current.season, week: current.week, competitionId, competitionName: competition.name, competitionType: competition.type, city: competition.city, country: competition.country, flag: competition.flag, achievement, points, roundReached, lastOpponent, lastScore });
        authMemory.circuitResults = filtered;
      }
    }
    await registerCircuitAiResults(user.id, payload.aiResults);
    await registerCircuitAiHumanWinBonuses(payload.aiResults, current.season, current.week);
    await recomputeUserCircuitWeekScore(user.id, current.season, current.week);
    sendJson(res, 200, { ok: true, weekKey: current.weekKey, scoreKey, competitionId, points });
    return true;
  }

  const saveMatch = url.pathname.match(/^\/api\/competitions\/([^/]+)\/save$/);
  if (saveMatch) {
    const user = await requirePro(req, res);
    if (!user) return true;
    const competitionId = decodeURIComponent(saveMatch[1]);
    const competition = await competitionDefinitionById(competitionId);
    if (!competition) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return true;
    }
    if (req.method === "GET") {
      const saved = await getTournamentSave(user.id, competitionId);
      if (!saved) {
        sendJson(res, 404, { error: "Aucune sauvegarde disponible." });
        return true;
      }
      sendJson(res, 200, saved);
      return true;
    }
    if (req.method === "POST") {
      const payload = await readJson(req);
      if (!payload.save?.state) {
        sendJson(res, 400, { error: "Sauvegarde invalide." });
        return true;
      }
      await putTournamentSave(user.id, competitionId, payload.save);
      sendJson(res, 200, { ok: true, competitionId });
      return true;
    }
    if (req.method === "DELETE") {
      await deleteTournamentSave(user.id, competitionId);
      sendJson(res, 200, { ok: true, competitionId });
      return true;
    }
  }

  if (req.method === "GET" && url.pathname === "/api/ranking") {
    const user = await currentUser(req);
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(10, Number(url.searchParams.get("pageSize") || 50)));
    const sortBy = String(url.searchParams.get("sort") || "points");
    sendJson(res, 200, await buildRanking(page, pageSize, user, sortBy));
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/profile") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    sendJson(res, 200, await profilePayload(user, user));
    return true;
  }

  const publicProfileMatch = url.pathname.match(/^\/api\/profiles\/([^/]+)$/);
  if (req.method === "GET" && publicProfileMatch) {
    const viewer = await currentUser(req);
    if (!viewer) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    const target = await findUserById(decodeURIComponent(publicProfileMatch[1]));
    if (!target) {
      sendJson(res, 404, { error: "Profil introuvable." });
      return true;
    }
    sendJson(res, 200, await profilePayload(target, viewer));
    return true;
  }

  const publicProfileWatchMatch = url.pathname.match(/^\/api\/profiles\/([^/]+)\/watch$/);
  if (req.method === "GET" && publicProfileWatchMatch) {
    const viewer = await currentUser(req);
    if (!viewer) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    const target = await findUserById(decodeURIComponent(publicProfileWatchMatch[1]));
    const activity = target ? activeProfileActivity(target.id) : null;
    if (!target || !activity || !activity.watchable || !activity.state) {
      sendJson(res, 404, { error: "Cette partie n'est plus disponible." });
      return true;
    }
    sendJson(res, 200, {
      active: true,
      type: activity.type,
      opponent: activity.opponent,
      score: activity.score,
      playerNickname: target.nickname,
      playerIndex: Number(activity.playerIndex ?? 0),
      state: sanitizeFriendlySpectatorState(activity.state),
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/profile/activity") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    const payload = await readJson(req);
    if (payload.active === false) {
      playerActivities.delete(String(user.id));
      sendJson(res, 200, { ok: true, active: false });
      return true;
    }
    const state = sanitizeFriendlySpectatorState(payload.state);
    playerActivities.set(String(user.id), {
      type: String(payload.type || "Partie en cours").slice(0, 60),
      opponent: String(payload.opponent || "Adversaire").slice(0, 40),
      score: String(payload.score || "En direct").slice(0, 100),
      playerIndex: 0,
      state,
      updatedAt: Date.now(),
    });
    sendJson(res, 200, { ok: true, active: true });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/profile/nickname") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    const payload = await readJson(req);
    const nickname = normalizeNickname(payload.nickname);
    if (!nickname) {
      sendJson(res, 400, { error: "Pseudo invalide." });
      return true;
    }
    if (isReservedNickname(nickname) && !canUseReservedNickname(user)) {
      sendJson(res, 403, { error: "Ce pseudo est réservé." });
      return true;
    }
    if (db) {
      const duplicate = await db.query("SELECT id FROM users WHERE LOWER(nickname) = LOWER($1) AND id <> $2 LIMIT 1", [nickname, user.id]);
      if (duplicate.rows[0]) {
        sendJson(res, 409, { error: "Ce pseudo existe déjà." });
        return true;
      }
      const updated = await db.query("UPDATE users SET nickname = $1 WHERE id = $2 RETURNING *", [nickname, user.id]);
      sendJson(res, 200, { user: publicUser(updated.rows[0]) });
      return true;
    }
    const duplicate = [...authMemory.users.values()].find((candidate) => candidate.id !== user.id && candidate.nickname.toLowerCase() === nickname.toLowerCase());
    if (duplicate) {
      sendJson(res, 409, { error: "Ce pseudo existe déjà." });
      return true;
    }
    user.nickname = nickname;
    sendJson(res, 200, { user: publicUser(user) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/profile/character") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Connexion requise." });
      return true;
    }
    const payload = await readJson(req);
    const characterId = String(payload.characterId || "tennisHope");
    if (!canSelectCharacter(user, characterId)) {
      sendJson(res, 403, { error: "Personnage non disponible pour ce compte." });
      return true;
    }
    if (db) {
      const updated = await db.query("UPDATE users SET selected_character_id = $1 WHERE id = $2 RETURNING *", [characterId, user.id]);
      sendJson(res, 200, { user: publicUser(updated.rows[0]) });
      return true;
    }
    user.selectedCharacterId = characterId;
    sendJson(res, 200, { user: publicUser(user) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/circuit/next-week") {
    if (!await requireAdmin(req, res)) return true;
    sendJson(res, 200, await advanceCircuitWeek());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/circuit/restart-season") {
    if (!await requireAdmin(req, res)) return true;
    sendJson(res, 200, await restartCurrentSeason());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/circuit/restart-season-one") {
    if (!await requireAdmin(req, res)) return true;
    sendJson(res, 200, await restartSeasonOne());
    return true;
  }

  return false;
}

function normalizeCharacterId(characterId, fallback = "coachJu") {
  return ALL_PROFILE_CHARACTER_IDS.includes(characterId) ? characterId : fallback;
}

function publicBaseUrl(req) {
  const configured = process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL;
  if (configured) return configured.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

function playerUrl(req, roomId, seat, token, isHost = false) {
  return `${publicBaseUrl(req)}/?room=${encodeURIComponent(roomId)}&seat=${seat}&token=${encodeURIComponent(token)}${isHost ? "&host=1" : ""}`;
}

function friendlyTournamentUrl(req, tournamentId, participantId, token) {
  return `${publicBaseUrl(req)}/?friendlyTournament=${encodeURIComponent(tournamentId)}&participant=${encodeURIComponent(participantId)}&token=${encodeURIComponent(token)}`;
}

function friendlySpectatorUrl(req, tournamentId, spectatorId, token) {
  return `${publicBaseUrl(req)}/?friendlyTournament=${encodeURIComponent(tournamentId)}&spectator=${encodeURIComponent(spectatorId)}&token=${encodeURIComponent(token)}`;
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": MIME_TYPES[".json"],
    "cache-control": "no-store",
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000_000) {
        reject(new Error("payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function createRoom(req, options = {}) {
  let roomId = makeId(3);
  while (rooms.has(roomId)) roomId = makeId(3);
  const tokens = [makeToken(), makeToken()];
  const hostSeat = options.hostSeat ?? 0;
  const guestSeat = hostSeat === 0 ? 1 : 0;
  const room = {
    id: roomId,
    tokens,
    state: null,
    revision: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    logs: [],
    status: options.status ?? "direct",
    targetSets: options.targetSets ?? null,
    hostSeat,
    players: [
      hostSeat === 0 ? { userId: options.userId || null, nickname: options.nickname ?? "Coach Ju", characterId: options.characterId ?? "coachJu", joinedAt: Date.now(), isHost: true } : null,
      hostSeat === 1 ? { userId: options.userId || null, nickname: options.nickname ?? "Coach Max", characterId: options.characterId ?? "coachMax", joinedAt: Date.now(), isHost: true } : null,
    ],
  };
  rooms.set(roomId, room);
  return {
    room,
    coachJuUrl: playerUrl(req, roomId, 0, tokens[0], hostSeat === 0),
    coachMaxUrl: playerUrl(req, roomId, 1, tokens[1]),
    hostUrl: playerUrl(req, roomId, hostSeat, tokens[hostSeat], true),
    guestUrl: playerUrl(req, roomId, guestSeat, tokens[guestSeat]),
  };
}

function logKey(entry) {
  return `${entry.createdAt || entry.completedAt || ""}:${entry.kind || entry.winType || ""}:${entry.exchangeNumber ?? ""}:${entry.playerIndex ?? ""}`;
}

function mergeRoomLogs(room, incomingLogs = []) {
  if (!Array.isArray(incomingLogs)) return;
  const map = new Map(room.logs.map((entry) => [logKey(entry), entry]));
  for (const entry of incomingLogs.filter(Boolean)) {
    map.set(logKey(entry), entry);
  }
  room.logs = [...map.values()].slice(-5000);
}

function seatForToken(room, token) {
  const seat = room.tokens.indexOf(token);
  return seat === -1 ? null : seat;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const type = MIME_TYPES[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, {
      "content-type": type,
      "cache-control": type.includes("text/html") ? "no-store" : "public, max-age=3600",
    });
    res.end(data);
  });
}

function publicRoomInfo(req, room) {
  return {
    id: room.id,
    status: room.status,
    targetSets: room.targetSets,
    hostSeat: room.hostSeat,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    players: room.players.map((player, seat) => player ? { seat, nickname: player.nickname, characterId: player.characterId, isHost: seat === room.hostSeat } : null),
    openSeat: room.players.findIndex((player) => player == null),
  };
}

function liveScoreFromState(remoteState, perspectiveIndex = 0) {
  const match = remoteState?.setMatch;
  if (!match?.enabled) return "Échange en cours";
  const current = Array.isArray(match.score) ? match.score : [0, 0];
  const score = perspectiveIndex === 1 ? [current[1], current[0]] : current;
  return `${Number(score[0] || 0)}/${Number(score[1] || 0)}`;
}

function activeProfileActivity(userId) {
  const now = Date.now();
  for (const tournament of friendlyTournaments.values()) {
    if (tournament.status !== "playing") continue;
    const participant = activeFriendlyParticipants(tournament).find((item) => String(item.userId) === String(userId));
    if (!participant) continue;
    const match = currentFriendlyMatchForParticipant(tournament, participant.id);
    if (!match) continue;
    const entry = friendlyParticipantEntry(participant.id);
    const opponent = friendlyEntryPublic(tournament, match.playerA === entry ? match.playerB : match.playerA);
    return {
      type: "Tournoi en ligne",
      opponent: opponent?.nickname || "Adversaire",
      score: String(match.liveScore || "Match en cours").replace(/\s*·\s*EN DIRECT\s*$/i, ""),
      watchable: friendlyMatchIsWatchable(match),
      source: "friendly",
      tournamentId: tournament.id,
      matchId: match.id,
      playerIndex: match.playerA === entry ? 0 : 1,
      state: match.liveState,
    };
  }
  for (const room of rooms.values()) {
    if (room.status !== "playing" || !room.state || now - Number(room.updatedAt || 0) > ROOM_ACTIVITY_TTL_MS) continue;
    const seat = room.players.findIndex((player) => String(player?.userId || "") === String(userId));
    if (seat < 0) continue;
    const opponent = room.players[seat === 0 ? 1 : 0];
    return {
      type: "Match en ligne",
      opponent: opponent?.nickname || "Adversaire",
      score: liveScoreFromState(room.state, seat),
      watchable: true,
      source: "room",
      roomId: room.id,
      playerIndex: seat,
      state: room.state,
    };
  }
  const activity = playerActivities.get(String(userId));
  if (!activity || now - Number(activity.updatedAt || 0) > LIVE_ACTIVITY_TTL_MS) {
    playerActivities.delete(String(userId));
    return null;
  }
  return { ...activity, watchable: Boolean(activity.state) };
}

function publicProfileActivity(userId) {
  const activity = activeProfileActivity(userId);
  if (!activity) return null;
  return {
    type: activity.type,
    opponent: activity.opponent,
    score: activity.score,
    watchable: Boolean(activity.watchable),
  };
}

function friendlyParticipantEntry(participantId) {
  return `human:${participantId}`;
}

function friendlyAiName(characterId) {
  return AI_CHARACTER_NAMES[characterId] || characterId;
}

function makeFriendlyMatch(id, label, round, playerA = null, playerB = null, options = {}) {
  return {
    id,
    label,
    round,
    playerA,
    playerB,
    winner: null,
    score: null,
    hiddenWinner: null,
    hiddenSetScores: [],
    revealedSetScores: [],
    humanSetsObserved: 0,
    liveScore: null,
    liveState: null,
    liveParticipantId: null,
    liveUpdatedAt: null,
    presenceStartedAt: null,
    group: options.group || null,
    day: options.day || null,
  };
}

function friendlyEntryPublic(tournament, entry) {
  if (!entry) return null;
  if (String(entry).startsWith("human:")) {
    const participant = tournament.participants.find((item) => friendlyParticipantEntry(item.id) === entry);
    return participant ? {
      entry,
      type: "human",
      participantId: participant.id,
      nickname: participant.nickname,
      characterId: participant.characterId,
      eliminated: Boolean(participant.eliminated),
      left: Boolean(participant.leftAt),
      away: Boolean(participant.awayAt),
    } : { entry, type: "human", nickname: "Joueur", characterId: "coachJu" };
  }
  return { entry, type: "ai", nickname: friendlyAiName(entry), characterId: entry };
}

function activeFriendlyParticipants(tournament) {
  return (tournament?.participants || []).filter((participant) => !participant.leftAt && !participant.kickedAt);
}

function friendlySelectionLimit(tournament) {
  return tournament?.format === "match" ? 2 : 4;
}

function selectedFriendlyParticipants(tournament) {
  return activeFriendlyParticipants(tournament).filter((participant) => participant.selected);
}

function friendlyDisconnectedPlayersForMatch(tournament, match) {
  if (!match) return [];
  return activeFriendlyParticipants(tournament)
    .filter((participant) => (
      participant.awayAt
      && participant.reconnectDeadline
      && participant.reconnectMatchId === match.id
      && (friendlyParticipantEntry(participant.id) === match.playerA || friendlyParticipantEntry(participant.id) === match.playerB)
    ))
    .map((participant) => ({
      participantId: participant.id,
      entry: friendlyParticipantEntry(participant.id),
      nickname: participant.nickname,
      deadline: Number(participant.reconnectDeadline),
      graceSeconds: Number(participant.reconnectGraceSeconds || 20),
      reason: participant.awayReason || "connection",
    }));
}

function transferFriendlyTournamentCreator(tournament) {
  const nextCreator = activeFriendlyParticipants(tournament)
    .sort((a, b) => Number(a.joinedAt || 0) - Number(b.joinedAt || 0))[0] || null;
  tournament.creatorParticipantId = nextCreator?.id || null;
  return nextCreator;
}

function resolveWaitingFriendlyHost(tournament, now = Date.now()) {
  if (!tournament || tournament.status !== "waiting") return true;
  const creator = activeFriendlyParticipants(tournament).find((item) => item.id === tournament.creatorParticipantId);
  if (creator && !creator.awayAt && now - Number(creator.lastSeenAt || now) > 10_000) {
    creator.awayAt = Number(creator.lastSeenAt || now);
    creator.hostReturnDeadline = Number(creator.lastSeenAt || now) + 10_000;
  }
  if (creator?.awayAt && Number(creator.hostReturnDeadline || 0) <= now) {
    creator.leftAt = now;
    creator.selected = false;
    transferFriendlyTournamentCreator(tournament);
    tournament.updatedAt = now;
  }
  return activeFriendlyParticipants(tournament).length > 0;
}

function friendlyMatchIsWatchable(match) {
  return Boolean(
    match
    && !match.winner
    && match.liveState
    && match.liveUpdatedAt
    && Date.now() - match.liveUpdatedAt < 10000
  );
}

function sanitizeFriendlySpectatorState(remoteState) {
  if (!remoteState || typeof remoteState !== "object") return null;
  let safeState;
  try {
    safeState = JSON.parse(JSON.stringify(remoteState));
  } catch (error) {
    return null;
  }
  safeState.players = Array.isArray(safeState.players)
    ? safeState.players.map((player, playerIndex) => {
      const handSize = Array.isArray(player?.hand) ? player.hand.length : 0;
      return {
        ...player,
        hand: Array.from({ length: handSize }, (_, cardIndex) => ({
          id: "spectator-hidden",
          uid: `spectator-hidden-${playerIndex}-${cardIndex}`,
          name: "Carte face cachée",
          family: "Carte cachée",
          subtitle: "Carte cachée",
          cost: 0,
          power: 0,
          precision: 0,
          placement: 0,
          effect: "",
          effectType: null,
          boostPower: 0,
          boostPrecision: 0,
        })),
        knownOpponentHand: null,
      };
    })
    : [];
  safeState.deck = [];
  safeState.turnSnapshot = null;
  safeState.pendingBoost = null;
  safeState.pendingEffectChoice = null;
  safeState.pendingCoachChoice = null;
  safeState.pendingRemoveChoice = null;
  safeState.pendingEndTurnAfterChoice = null;
  safeState.revealAiCards = false;
  return safeState;
}

function publicFriendlyTournamentInfo(req, tournament, participant = null, spectator = null) {
  const activeParticipants = activeFriendlyParticipants(tournament);
  return {
    id: tournament.id,
    status: tournament.status,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
    creatorParticipantId: tournament.creatorParticipantId,
    participantCount: activeParticipants.length,
    maxParticipants: 4,
    canStart: tournament.status === "waiting" && selectedFriendlyParticipants(tournament).length >= 1,
    format: tournament.format || "classic",
    targetSets: Number(tournament.targetSets || 2),
    distribution: tournament.distribution || "random",
    difficulty: tournament.difficulty || "normal",
    bonus: tournament.bonus || "none",
    playerSelection: tournament.playerSelection || "random",
    selectionLimit: friendlySelectionLimit(tournament),
    seedNumbers: Object.fromEntries(Object.entries(tournament.seedRanks || {}).filter(([, rank]) => Number(rank) >= 1 && Number(rank) <= 4)),
    settingsLocked: tournament.status !== "waiting",
    participants: activeParticipants.map((item) => ({
      id: item.id,
      nickname: item.nickname,
      characterId: item.characterId,
      isCreator: item.id === tournament.creatorParticipantId,
      eliminated: Boolean(item.eliminated),
      away: Boolean(item.awayAt),
      selected: Boolean(item.selected),
    })),
    entries: (tournament.entries || []).map((entry) => friendlyEntryPublic(tournament, entry)),
    matches: (tournament.matches || []).map((match) => ({
      id: match.id,
      label: match.label,
      round: match.round,
      playerA: match.playerA,
      playerB: match.playerB,
      winner: match.winner,
      score: match.score,
      liveScore: match.liveScore || null,
      liveUpdatedAt: match.liveUpdatedAt || null,
      watchable: friendlyMatchIsWatchable(match),
      playerAInfo: friendlyEntryPublic(tournament, match.playerA),
      playerBInfo: friendlyEntryPublic(tournament, match.playerB),
      winnerInfo: friendlyEntryPublic(tournament, match.winner),
      forfeitParticipantId: match.forfeitParticipantId || null,
      group: match.group || null,
      day: match.day || null,
      humanVsHuman: friendlyEntryIsHuman(match.playerA) && friendlyEntryIsHuman(match.playerB),
      disconnectedPlayers: friendlyDisconnectedPlayersForMatch(tournament, match),
    })),
    groups: {
      A: (tournament.groups?.A || []).map((entry) => friendlyEntryPublic(tournament, entry)),
      B: (tournament.groups?.B || []).map((entry) => friendlyEntryPublic(tournament, entry)),
    },
    standings: friendlyLeagueStandings(tournament),
    round: tournament.round,
    champion: tournament.champion || null,
    championInfo: friendlyEntryPublic(tournament, tournament.champion),
    ready: tournament.ready || {},
    nextReady: tournament.nextReady || {},
    participant: participant ? {
      id: participant.id,
      token: participant.token,
      isCreator: participant.id === tournament.creatorParticipantId,
      entry: friendlyParticipantEntry(participant.id),
    } : null,
    spectator: spectator ? { id: spectator.id, nickname: spectator.nickname } : null,
  };
}

function publicFriendlyLobbyInfo(req, tournament, user = null) {
  const activeParticipants = activeFriendlyParticipants(tournament);
  const creator = activeParticipants.find((item) => item.id === tournament.creatorParticipantId) || activeParticipants[0];
  const currentParticipant = user
    ? activeParticipants.find((item) => String(item.userId) === String(user.id)) || null
    : null;
  return {
    id: tournament.id,
    status: tournament.status,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
    creatorNickname: creator?.nickname || "Joueur",
    participantCount: activeParticipants.length,
    maxParticipants: 4,
    canStart: tournament.status === "waiting" && selectedFriendlyParticipants(tournament).length >= 1,
    format: tournament.format || "classic",
    targetSets: Number(tournament.targetSets || 2),
    distribution: tournament.distribution || "random",
    difficulty: tournament.difficulty || "normal",
    bonus: tournament.bonus || "none",
    playerSelection: tournament.playerSelection || "random",
    selectionLimit: friendlySelectionLimit(tournament),
    canResume: Boolean(currentParticipant && ["waiting", "playing"].includes(tournament.status)),
    resumeInMatch: Boolean(currentParticipant && currentFriendlyMatchForParticipant(tournament, currentParticipant.id)),
    reconnectDeadline: Number(currentParticipant?.reconnectDeadline || 0) || null,
    participants: activeParticipants.map((item) => ({
      nickname: item.nickname,
      characterId: item.characterId,
      isCreator: item.id === tournament.creatorParticipantId,
      selected: Boolean(item.selected),
    })),
  };
}

function participantForToken(tournament, participantId, token) {
  return tournament?.participants.find((item) => !item.leftAt && !item.kickedAt && item.id === participantId && item.token === token) || null;
}

function spectatorForToken(tournament, spectatorId, token) {
  return tournament?.spectators?.find((item) => item.id === spectatorId && item.token === token) || null;
}

function userHasOpenFriendlyTournament(userId) {
  return [...friendlyTournaments.values()].some((tournament) => (
    ["waiting", "playing"].includes(tournament.status)
    && activeFriendlyParticipants(tournament).some((item) => String(item.userId) === String(userId))
  ));
}

function shuffleFriendlyEntries(entries) {
  const shuffled = [...entries];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

async function rankFriendlyEntries(tournament, entries) {
  const ranking = await buildRanking(1, 100000, null, "points");
  const rankById = new Map((ranking.top || []).map((row) => [String(row.id), Number(row.rank || 999999)]));
  const ranked = [...entries].sort((entryA, entryB) => {
    const participantA = friendlyEntryIsHuman(entryA)
      ? tournament.participants.find((item) => friendlyParticipantEntry(item.id) === entryA)
      : null;
    const participantB = friendlyEntryIsHuman(entryB)
      ? tournament.participants.find((item) => friendlyParticipantEntry(item.id) === entryB)
      : null;
    const keyA = participantA ? String(participantA.userId) : `ai:${entryA}`;
    const keyB = participantB ? String(participantB.userId) : `ai:${entryB}`;
    return Number(rankById.get(keyA) || 999999) - Number(rankById.get(keyB) || 999999)
      || String(entryA).localeCompare(String(entryB), "fr");
  });
  tournament.seedRanks = Object.fromEntries(ranked.map((entry, index) => [entry, index + 1]));
  return ranked;
}

function separatedClassicEntries(humanEntries, aiEntries) {
  const humans = shuffleFriendlyEntries(humanEntries);
  const ais = shuffleFriendlyEntries(aiEntries);
  const slots = Array(8).fill(null);
  let quarterIndexes = [];
  if (humans.length === 2) quarterIndexes = [Math.floor(Math.random() * 2), 2 + Math.floor(Math.random() * 2)];
  if (humans.length === 3) quarterIndexes = [0, 3, 1 + Math.floor(Math.random() * 2)];
  if (humans.length >= 4) quarterIndexes = [0, 1, 2, 3];
  humans.forEach((entry, index) => {
    const quarterIndex = quarterIndexes[index] ?? index % 4;
    slots[(quarterIndex * 2) + Math.floor(Math.random() * 2)] = entry;
  });
  for (let index = 0; index < slots.length; index += 1) {
    if (!slots[index]) slots[index] = ais.shift();
  }
  return slots;
}

function separatedLeagueGroups(humanEntries, aiEntries) {
  const humans = shuffleFriendlyEntries(humanEntries);
  const ais = shuffleFriendlyEntries(aiEntries);
  const groupA = [];
  const groupB = [];
  if (humans[0]) groupA.push(humans[0]);
  if (humans[1]) groupB.push(humans[1]);
  if (humans[2]) (Math.random() < 0.5 ? groupA : groupB).push(humans[2]);
  if (humans[3]) (groupA.length < groupB.length ? groupA : groupB).push(humans[3]);
  while (groupA.length < 4) groupA.push(ais.shift());
  while (groupB.length < 4) groupB.push(ais.shift());
  return { A: shuffleFriendlyEntries(groupA), B: shuffleFriendlyEntries(groupB) };
}

function buildFriendlyLeagueMatches(groups) {
  const schedule = [
    [[0, 3], [1, 2]],
    [[0, 2], [3, 1]],
    [[0, 1], [2, 3]],
  ];
  const matches = [];
  for (const groupName of ["A", "B"]) {
    schedule.forEach((dayMatches, dayIndex) => {
      dayMatches.forEach(([indexA, indexB], matchIndex) => {
        matches.push(makeFriendlyMatch(
          `${groupName.toLowerCase()}d${dayIndex + 1}m${matchIndex + 1}`,
          `Groupe ${groupName} · Journée ${dayIndex + 1} · Match ${matchIndex + 1}`,
          `group${dayIndex + 1}`,
          groups[groupName][indexA],
          groups[groupName][indexB],
          { group: groupName, day: dayIndex + 1 },
        ));
      });
    });
  }
  matches.push(makeFriendlyMatch("semi1", "Demi-finale 1 · A1 contre B2", "semi"));
  matches.push(makeFriendlyMatch("semi2", "Demi-finale 2 · B1 contre A2", "semi"));
  matches.push(makeFriendlyMatch("final", "Finale", "final"));
  return matches;
}

function parseFriendlySetScores(score = "") {
  return [...String(score).matchAll(/(\d+)\s*\/\s*(\d+)/g)]
    .map((match) => [Number(match[1]), Number(match[2])]);
}

function friendlySetIsComplete(gamesA, gamesB) {
  const high = Math.max(gamesA, gamesB);
  const low = Math.min(gamesA, gamesB);
  return (high >= 6 && high - low >= 2) || (high === 7 && low === 6);
}

function applyFriendlyLeagueScore(playerAStats, playerBStats, score) {
  for (const [gamesA, gamesB] of parseFriendlySetScores(score)) {
    playerAStats.gamesWon += gamesA;
    playerAStats.gamesLost += gamesB;
    playerBStats.gamesWon += gamesB;
    playerBStats.gamesLost += gamesA;
    if (!friendlySetIsComplete(gamesA, gamesB)) continue;
    if (gamesA > gamesB) {
      playerAStats.setsWon += 1;
      playerBStats.setsLost += 1;
    } else {
      playerBStats.setsWon += 1;
      playerAStats.setsLost += 1;
    }
  }
}

function friendlyLeagueStandings(tournament) {
  if ((tournament?.format || "classic") !== "league") return { A: [], B: [] };
  const result = {};
  for (const groupName of ["A", "B"]) {
    const entries = tournament.groups?.[groupName] || [];
    const rows = new Map(entries.map((entry, groupIndex) => [entry, {
        entry,
        player: friendlyEntryPublic(tournament, entry),
        played: 0,
        wins: 0,
        losses: 0,
        points: 0,
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        worldRank: Number(tournament.seedRanks?.[entry] || 999999 + groupIndex),
      }]));
    for (const match of (tournament.matches || []).filter((item) => item.group === groupName && item.winner)) {
      const playerAStats = rows.get(match.playerA);
      const playerBStats = rows.get(match.playerB);
      if (!playerAStats || !playerBStats) continue;
      playerAStats.played += 1;
      playerBStats.played += 1;
      if (match.winner === match.playerA) {
        playerAStats.wins += 1;
        playerBStats.losses += 1;
        playerAStats.points += 1;
      } else {
        playerBStats.wins += 1;
        playerAStats.losses += 1;
        playerBStats.points += 1;
      }
      applyFriendlyLeagueScore(playerAStats, playerBStats, match.score || match.liveScore || "");
    }
    result[groupName] = [...rows.values()].map((row) => ({
      ...row,
      setDifference: row.setsWon - row.setsLost,
      gameDifference: row.gamesWon - row.gamesLost,
    })).sort((a, b) => (
      b.points - a.points
      || b.setDifference - a.setDifference
      || b.gameDifference - a.gameDifference
      || a.worldRank - b.worldRank
    ))
      .map((row, index) => ({ ...row, position: index + 1 }));
  }
  return result;
}

async function buildFriendlyTournamentBracket(tournament) {
  const activeParticipants = selectedFriendlyParticipants(tournament);
  const humanEntries = activeParticipants.map((item) => friendlyParticipantEntry(item.id));
  const usedCharacters = new Set(activeParticipants.map((item) => item.characterId));
  const aiPool = CIRCUIT_AI_CHARACTER_IDS.filter((characterId) => !usedCharacters.has(characterId));
  const orderedAiPool = tournament.playerSelection === "best" ? aiPool : shuffleFriendlyEntries(aiPool);
  const eventSize = tournament.format === "match" ? 2 : 8;
  const aiEntries = orderedAiPool.slice(0, Math.max(0, eventSize - humanEntries.length));
  const entries = [...humanEntries, ...aiEntries];
  while (entries.length < eventSize) entries.push(CIRCUIT_AI_CHARACTER_IDS[entries.length % CIRCUIT_AI_CHARACTER_IDS.length]);
  const fullEntries = entries.slice(0, eventSize);
  const rankedEntries = await rankFriendlyEntries(tournament, fullEntries);
  if (tournament.format === "match") {
    tournament.entries = tournament.distribution === "ranking" ? rankedEntries : shuffleFriendlyEntries(fullEntries);
    tournament.groups = { A: [], B: [] };
    tournament.matches = [makeFriendlyMatch("friendly-match", "Match amical", "final", tournament.entries[0], tournament.entries[1])];
    tournament.round = "final";
    simulateFriendlyAiOnlyMatches(tournament);
    return;
  }
  if (tournament.format === "league") {
    if (tournament.distribution === "ranking") {
      tournament.groups = {
        A: [rankedEntries[0], rankedEntries[3], rankedEntries[4], rankedEntries[7]],
        B: [rankedEntries[1], rankedEntries[2], rankedEntries[5], rankedEntries[6]],
      };
    } else if (tournament.distribution === "separated") {
      tournament.groups = separatedLeagueGroups(humanEntries, fullEntries.filter((entry) => !friendlyEntryIsHuman(entry)));
    } else {
      const shuffled = shuffleFriendlyEntries(fullEntries);
      tournament.groups = { A: shuffled.slice(0, 4), B: shuffled.slice(4, 8) };
    }
    tournament.entries = [...tournament.groups.A, ...tournament.groups.B];
    tournament.matches = buildFriendlyLeagueMatches(tournament.groups);
    tournament.round = "group1";
    simulateFriendlyAiOnlyMatches(tournament);
    return;
  }
  if (tournament.distribution === "ranking") {
    tournament.entries = [rankedEntries[0], rankedEntries[7], rankedEntries[4], rankedEntries[3], rankedEntries[2], rankedEntries[5], rankedEntries[6], rankedEntries[1]];
  } else if (tournament.distribution === "separated") {
    tournament.entries = separatedClassicEntries(humanEntries, fullEntries.filter((entry) => !friendlyEntryIsHuman(entry)));
  } else {
    tournament.entries = shuffleFriendlyEntries(fullEntries);
  }
  tournament.groups = { A: [], B: [] };
  tournament.matches = [
    makeFriendlyMatch("qf1", "Quart de finale 1", "quarter", tournament.entries[0], tournament.entries[1]),
    makeFriendlyMatch("qf2", "Quart de finale 2", "quarter", tournament.entries[2], tournament.entries[3]),
    makeFriendlyMatch("qf3", "Quart de finale 3", "quarter", tournament.entries[4], tournament.entries[5]),
    makeFriendlyMatch("qf4", "Quart de finale 4", "quarter", tournament.entries[6], tournament.entries[7]),
    makeFriendlyMatch("semi1", "Demi-finale 1", "semi"),
    makeFriendlyMatch("semi2", "Demi-finale 2", "semi"),
    makeFriendlyMatch("final", "Finale", "final"),
  ];
  tournament.round = "quarter";
  simulateFriendlyAiOnlyMatches(tournament);
}

function friendlyEntryIsHuman(entry) {
  return String(entry || "").startsWith("human:");
}

function simulateFriendlyScore(winnerIsPlayerA, targetSets = 2) {
  const winningScores = [[6, 1], [6, 2], [6, 3], [6, 4], [7, 5], [7, 6]];
  const losingScores = [[3, 6], [4, 6], [5, 7], [6, 7]];
  const scores = [];
  let winnerSets = 0;
  let loserSets = 0;
  while (winnerSets < targetSets) {
    const winnerLosesSet = loserSets < targetSets - 1 && winnerSets < targetSets - 1 && Math.random() < 0.25;
    const pool = winnerLosesSet ? losingScores : winningScores;
    const score = pool[Math.floor(Math.random() * pool.length)];
    if (winnerLosesSet) loserSets += 1;
    else winnerSets += 1;
    scores.push(winnerIsPlayerA ? score : [score[1], score[0]]);
  }
  return scores.map(([gamesA, gamesB]) => `${gamesA}/${gamesB}`).join(" - ");
}

function simulateFriendlyAiOnlyMatches(tournament) {
  for (const match of tournament.matches) {
    if (match.winner || match.hiddenWinner || !match.playerA || !match.playerB) continue;
    if (match.round !== tournament.round) continue;
    if (friendlyEntryIsHuman(match.playerA) || friendlyEntryIsHuman(match.playerB)) continue;
    const rankA = Number(tournament.seedRanks?.[match.playerA] || 999);
    const rankB = Number(tournament.seedRanks?.[match.playerB] || 999);
    const rankGap = Math.max(-12, Math.min(12, rankB - rankA));
    const winChanceA = Math.max(0.15, Math.min(0.85, 1 / (1 + Math.exp(-rankGap / 3.5))));
    match.hiddenWinner = Math.random() < winChanceA ? match.playerA : match.playerB;
    match.hiddenSetScores = parseFriendlySetScores(simulateFriendlyScore(
      match.hiddenWinner === match.playerA,
      Number(tournament.targetSets || 2),
    ));
    match.revealedSetScores = [];
    match.winner = null;
    match.score = null;
  }
}

function friendlyAiOnlyMatch(match) {
  return Boolean(
    match?.playerA
    && match?.playerB
    && !friendlyEntryIsHuman(match.playerA)
    && !friendlyEntryIsHuman(match.playerB)
  );
}

function friendlySetScoresText(scores = []) {
  return scores.map(([gamesA, gamesB]) => `${gamesA}/${gamesB}`).join(" - ");
}

function revealNextFriendlyAiSet(tournament, round = tournament.round) {
  let changed = false;
  for (const match of tournament.matches || []) {
    if (match.round !== round || !friendlyAiOnlyMatch(match) || !match.hiddenSetScores?.length) continue;
    match.revealedSetScores = Array.isArray(match.revealedSetScores) ? match.revealedSetScores : [];
    if (match.revealedSetScores.length >= match.hiddenSetScores.length) continue;
    const nextSet = match.hiddenSetScores[match.revealedSetScores.length];
    match.revealedSetScores.push([...nextSet]);
    match.score = friendlySetScoresText(match.revealedSetScores);
    if (match.revealedSetScores.length >= match.hiddenSetScores.length) match.winner = match.hiddenWinner;
    changed = true;
  }
  return changed;
}

function revealAllFriendlyAiSets(tournament, round = tournament.round) {
  let changed = false;
  for (const match of tournament.matches || []) {
    if (match.round !== round || !friendlyAiOnlyMatch(match) || !match.hiddenSetScores?.length) continue;
    if (match.revealedSetScores?.length < match.hiddenSetScores.length || !match.winner) changed = true;
    match.revealedSetScores = match.hiddenSetScores.map((score) => [...score]);
    match.score = friendlySetScoresText(match.revealedSetScores);
    match.winner = match.hiddenWinner;
  }
  return changed;
}

function noteFriendlyHumanSetProgress(tournament, match, remoteState = null, completedScore = "") {
  if (!match || match.round !== tournament.round || friendlyAiOnlyMatch(match)) return false;
  const stateScores = friendlyHumanCompletedScores(remoteState).filter(([gamesA, gamesB]) => friendlySetIsComplete(gamesA, gamesB));
  const scoreCount = parseFriendlySetScores(completedScore).filter(([gamesA, gamesB]) => friendlySetIsComplete(gamesA, gamesB)).length;
  const completedSets = Math.max(stateScores.length, scoreCount);
  const previousSets = Number(match.humanSetsObserved || 0);
  if (completedSets <= previousSets) return false;
  match.humanSetsObserved = completedSets;
  for (let index = previousSets; index < completedSets; index += 1) revealNextFriendlyAiSet(tournament, match.round);
  tournament.updatedAt = Date.now();
  return true;
}

function revealFriendlyAiRoundWhenHumansAreDone(tournament) {
  const roundMatches = (tournament.matches || []).filter((match) => (
    match.round === tournament.round && match.playerA && match.playerB
  ));
  if (!roundMatches.length) return false;
  const humanMatches = roundMatches.filter((match) => !friendlyAiOnlyMatch(match));
  if (humanMatches.length && !humanMatches.every((match) => match.winner)) return false;
  return revealAllFriendlyAiSets(tournament, tournament.round);
}

function refreshFriendlyLeagueSlots(tournament) {
  const byId = new Map((tournament.matches || []).map((match) => [match.id, match]));
  const semi1 = byId.get("semi1");
  const semi2 = byId.get("semi2");
  const final = byId.get("final");
  for (let step = 0; step < 8; step += 1) {
    resolveFriendlyDepartedForfeits(tournament);
    simulateFriendlyAiOnlyMatches(tournament);
    revealFriendlyAiRoundWhenHumansAreDone(tournament);
    if (["group1", "group2", "group3"].includes(tournament.round)) {
      const roundMatches = tournament.matches.filter((match) => match.round === tournament.round);
      if (!roundMatches.length || !roundMatches.every((match) => match.winner)) return;
      if (tournament.round === "group1") {
        tournament.round = "group2";
        continue;
      }
      if (tournament.round === "group2") {
        tournament.round = "group3";
        continue;
      }
      const standings = friendlyLeagueStandings(tournament);
      if (semi1 && !semi1.playerA && !semi1.playerB) {
        semi1.playerA = standings.A[0]?.entry || null;
        semi1.playerB = standings.B[1]?.entry || null;
      }
      if (semi2 && !semi2.playerA && !semi2.playerB) {
        semi2.playerA = standings.B[0]?.entry || null;
        semi2.playerB = standings.A[1]?.entry || null;
      }
      tournament.round = "semi";
      continue;
    }
    if (tournament.round === "semi") {
      const semiMatches = [semi1, semi2].filter(Boolean);
      if (final && semi1?.winner) final.playerA = semi1.winner;
      if (final && semi2?.winner) final.playerB = semi2.winner;
      if (!semiMatches.every((match) => match.winner)) return;
      tournament.round = "final";
      continue;
    }
    if (tournament.round === "final") {
      if (!final?.winner) return;
      tournament.status = "complete";
      tournament.round = "complete";
      tournament.champion = final.winner;
      return;
    }
    return;
  }
}

function friendlyEntryHasLeft(tournament, entry) {
  if (!friendlyEntryIsHuman(entry)) return false;
  const participant = tournament.participants.find((item) => friendlyParticipantEntry(item.id) === entry);
  return Boolean(participant?.leftAt);
}

function cloneFriendlyMatchState(remoteState) {
  if (!remoteState || typeof remoteState !== "object") return null;
  try {
    return JSON.parse(JSON.stringify(remoteState));
  } catch (error) {
    return null;
  }
}

function markFriendlyParticipantPresent(participant, now = Date.now()) {
  if (!participant) return false;
  const wasAway = Boolean(participant.awayAt || participant.reconnectDeadline || participant.reconnectMatchId);
  participant.awayAt = null;
  participant.awayReason = null;
  participant.reconnectDeadline = null;
  participant.reconnectMatchId = null;
  participant.reconnectGraceSeconds = null;
  participant.disconnectScore = null;
  participant.lastSeenAt = now;
  participant.hostReturnDeadline = null;
  return wasAway;
}

function touchFriendlyParticipant(participant, now = Date.now()) {
  if (!participant) return false;
  if (participant.awayAt && participant.hostReturnDeadline && Number(participant.hostReturnDeadline) > now) {
    markFriendlyParticipantPresent(participant, now);
    return true;
  }
  if (participant.awayAt && participant.awayReason === "heartbeat" && Number(participant.reconnectDeadline || 0) > now) {
    markFriendlyParticipantPresent(participant, now);
    return true;
  }
  if (!participant.awayAt) participant.lastSeenAt = now;
  return false;
}

function markFriendlyParticipantAway(tournament, participant, match, options = {}) {
  if (!tournament || !participant || !match || match.winner) return false;
  const entry = friendlyParticipantEntry(participant.id);
  if (match.playerA !== entry && match.playerB !== entry) return false;
  const disconnectedAt = Number(options.disconnectedAt || Date.now());
  const graceSeconds = Number(options.graceSeconds || 20);
  participant.awayAt = disconnectedAt;
  participant.awayReason = options.reason || "connection";
  participant.disconnectScore = String(options.score || participant.disconnectScore || match.liveScore || "0/0")
    .replace(/\s*·\s*EN DIRECT\s*$/i, "")
    .slice(0, 80);
  participant.reconnectMatchId = match.id;
  participant.reconnectGraceSeconds = graceSeconds;
  participant.reconnectDeadline = Number(options.deadline || (disconnectedAt + (graceSeconds * 1000)));
  tournament.updatedAt = Date.now();
  return true;
}

function resolveFriendlyPresenceLosses(tournament, now = Date.now()) {
  if (!tournament || tournament.status !== "playing") return false;
  let changed = false;
  for (const participant of activeFriendlyParticipants(tournament)) {
    if (participant.awayAt) continue;
    const match = currentFriendlyMatchForParticipant(tournament, participant.id);
    if (!match) continue;
    if (!match.presenceStartedAt) match.presenceStartedAt = now;
    const lastSeenAt = Math.max(Number(participant.lastSeenAt || 0), Number(match.presenceStartedAt || now));
    if (now - lastSeenAt < FRIENDLY_PRESENCE_STALE_MS) continue;
    changed = markFriendlyParticipantAway(tournament, participant, match, {
      reason: "heartbeat",
      disconnectedAt: lastSeenAt + FRIENDLY_PRESENCE_STALE_MS,
      deadline: lastSeenAt + FRIENDLY_RECONNECT_GRACE_MS,
      graceSeconds: FRIENDLY_RECONNECT_GRACE_MS / 1000,
      score: match.liveScore,
    }) || changed;
  }
  return changed;
}

function forfeitFriendlyMatchAfterDisconnect(tournament, match, participant) {
  if (!tournament || !match || !participant || match.winner) return false;
  const entry = friendlyParticipantEntry(participant.id);
  if (match.playerA !== entry && match.playerB !== entry) return false;
  match.winner = match.playerA === entry ? match.playerB : match.playerA;
  const scoreAtDeparture = String(participant.disconnectScore || match.liveScore || "0/0")
    .replace(/\s*·\s*EN DIRECT\s*$/i, "")
    .slice(0, 80);
  match.score = `${scoreAtDeparture || "0/0"} · FORFAIT`;
  match.liveScore = match.score;
  match.liveState = null;
  match.liveParticipantId = null;
  match.liveUpdatedAt = Date.now();
  match.forfeitParticipantId = participant.id;
  match.resumeState = null;
  participant.graceExpiredAt = Date.now();
  participant.awayReason = "forfeit";
  participant.reconnectDeadline = null;
  participant.reconnectMatchId = null;
  participant.reconnectGraceSeconds = null;
  participant.disconnectScore = null;
  tournament.updatedAt = Date.now();
  return true;
}

function resolveFriendlyReconnectTimeouts(tournament, now = Date.now()) {
  if (!tournament || tournament.status !== "playing") return false;
  let changed = false;
  for (const participant of activeFriendlyParticipants(tournament)) {
    const deadline = Number(participant.reconnectDeadline || 0);
    if (!participant.awayAt || !deadline || deadline > now) continue;
    const match = (tournament.matches || []).find((item) => item.id === participant.reconnectMatchId) || null;
    if (match?.winner) {
      participant.reconnectDeadline = null;
      participant.reconnectMatchId = null;
      participant.reconnectGraceSeconds = null;
      participant.disconnectScore = null;
      changed = true;
      continue;
    }
    changed = forfeitFriendlyMatchAfterDisconnect(tournament, match, participant) || changed;
  }
  return changed;
}

function resolveFriendlyDepartedForfeits(tournament) {
  for (const match of tournament.matches || []) {
    if (match.winner || !match.playerA || !match.playerB) continue;
    const playerALeft = friendlyEntryHasLeft(tournament, match.playerA);
    const playerBLeft = friendlyEntryHasLeft(tournament, match.playerB);
    if (!playerALeft && !playerBLeft) continue;
    match.winner = playerALeft && !playerBLeft ? match.playerB : match.playerA;
    match.score = playerALeft && playerBLeft ? "DOUBLE FORFAIT" : "FORFAIT";
    const departedEntry = playerALeft ? match.playerA : match.playerB;
    match.forfeitParticipantId = String(departedEntry || "").replace(/^human:/, "") || null;
    match.liveScore = match.score;
    match.liveState = null;
    match.liveParticipantId = null;
    match.liveUpdatedAt = Date.now();
  }
}

function refreshFriendlyTournamentSlots(tournament) {
  if (tournament.status === "waiting") {
    tournament.round = "waiting";
    return;
  }
  if (tournament.format === "league") {
    refreshFriendlyLeagueSlots(tournament);
    return;
  }
  if (tournament.format === "match") {
    const match = tournament.matches?.[0];
    resolveFriendlyDepartedForfeits(tournament);
    simulateFriendlyAiOnlyMatches(tournament);
    revealFriendlyAiRoundWhenHumansAreDone(tournament);
    if (match?.winner) {
      tournament.status = "complete";
      tournament.round = "complete";
      tournament.champion = match.winner;
    } else {
      tournament.round = "final";
    }
    return;
  }
  const byId = new Map(tournament.matches.map((match) => [match.id, match]));
  const qf1 = byId.get("qf1");
  const qf2 = byId.get("qf2");
  const qf3 = byId.get("qf3");
  const qf4 = byId.get("qf4");
  const semi1 = byId.get("semi1");
  const semi2 = byId.get("semi2");
  const final = byId.get("final");
  resolveFriendlyDepartedForfeits(tournament);
  simulateFriendlyAiOnlyMatches(tournament);
  revealFriendlyAiRoundWhenHumansAreDone(tournament);
  if (semi1 && qf1?.winner) semi1.playerA = qf1.winner;
  if (semi1 && qf2?.winner) semi1.playerB = qf2.winner;
  if (semi2 && qf3?.winner) semi2.playerA = qf3.winner;
  if (semi2 && qf4?.winner) semi2.playerB = qf4.winner;
  resolveFriendlyDepartedForfeits(tournament);
  simulateFriendlyAiOnlyMatches(tournament);
  revealFriendlyAiRoundWhenHumansAreDone(tournament);
  if (final && semi1?.winner) final.playerA = semi1.winner;
  if (final && semi2?.winner) final.playerB = semi2.winner;
  resolveFriendlyDepartedForfeits(tournament);
  simulateFriendlyAiOnlyMatches(tournament);
  revealFriendlyAiRoundWhenHumansAreDone(tournament);
  const quarterDone = [qf1, qf2, qf3, qf4].every((match) => match?.winner);
  const semiDone = [semi1, semi2].every((match) => match?.winner);
  if (final?.winner) {
    tournament.status = "complete";
    tournament.round = "complete";
    tournament.champion = final.winner;
  } else if (!quarterDone) {
    tournament.round = "quarter";
  } else if (!semiDone) {
    tournament.round = "semi";
  } else {
    tournament.round = "final";
  }
}

function currentFriendlyMatchForParticipant(tournament, participantId) {
  const entry = friendlyParticipantEntry(participantId);
  if (!friendlyRoundReadyForPlay(tournament)) return null;
  return (tournament.matches || []).find((match) => (
    !match.winner
    && match.playerA
    && match.playerB
    && match.round === tournament.round
    && (match.playerA === entry || match.playerB === entry)
  )) || null;
}

function friendlyParticipantIdFromEntry(entry) {
  return friendlyEntryIsHuman(entry) ? String(entry).replace(/^human:/, "") : null;
}

function friendlyMatchIsHumanVsHuman(match) {
  return Boolean(match && friendlyEntryIsHuman(match.playerA) && friendlyEntryIsHuman(match.playerB));
}

function ensureFriendlyHumanMatchSession(match) {
  if (!friendlyMatchIsHumanVsHuman(match)) return null;
  if (!match.session) {
    match.session = {
      hostParticipantId: friendlyParticipantIdFromEntry(match.playerA),
      revision: 0,
      state: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
  return match.session;
}

function friendlyHumanMatchAccess(tournament, match, participant) {
  if (!tournament || !participant || !friendlyMatchIsHumanVsHuman(match)) return null;
  const entry = friendlyParticipantEntry(participant.id);
  const seat = match.playerA === entry ? 0 : match.playerB === entry ? 1 : null;
  if (seat == null) return null;
  const session = ensureFriendlyHumanMatchSession(match);
  return { entry, seat, session, isHost: seat === 0 };
}

function publicFriendlyCurrentMatch(tournament, participantId) {
  const match = currentFriendlyMatchForParticipant(tournament, participantId);
  if (!match) return null;
  const participant = tournament.participants.find((item) => item.id === participantId);
  const access = friendlyHumanMatchAccess(tournament, match, participant);
  if (!access) return {
    ...match,
    humanVsHuman: false,
    resumeState: cloneFriendlyMatchState(match.resumeState),
  };
  return {
    ...match,
    humanVsHuman: true,
    session: {
      seat: access.seat,
      isHost: access.isHost,
      revision: access.session.revision,
    },
  };
}

function friendlyHumanSessionPlayers(tournament, match) {
  return [match.playerA, match.playerB].map((entry, seat) => {
    const info = friendlyEntryPublic(tournament, entry);
    return {
      seat,
      nickname: info?.nickname || "Joueur",
      characterId: info?.characterId || "coachJu",
      isHost: seat === 0,
    };
  });
}

function validateFriendlyHumanSyncState(tournament, match, remoteState) {
  if (!remoteState || typeof remoteState !== "object") return "État de match invalide.";
  if (!Array.isArray(remoteState.players) || remoteState.players.length !== 2) return "Les deux joueurs doivent partager la même partie.";
  const expectedPlayers = friendlyHumanSessionPlayers(tournament, match);
  for (let seat = 0; seat < 2; seat += 1) {
    if (String(remoteState.players[seat]?.characterId || "") !== String(expectedPlayers[seat].characterId)) {
      return "Les places des joueurs ne correspondent pas au tableau.";
    }
  }
  if (String(remoteState.tournament?.currentMatch || "") !== String(match.id)) return "Le match partagé ne correspond pas au tableau.";
  if (!remoteState.setMatch?.enabled || Number(remoteState.setMatch.targetSets) !== Number(tournament.targetSets || 2)) {
    return "Le format du match partagé est invalide.";
  }
  if (![0, 1].includes(Number(remoteState.activePlayer)) || ![0, 1].includes(Number(remoteState.server))) {
    return "La position active du match est invalide.";
  }
  return null;
}

function friendlyHumanCompletedScores(remoteState) {
  return (Array.isArray(remoteState?.setMatch?.completedScores) ? remoteState.setMatch.completedScores : [])
    .filter((score) => Array.isArray(score) && score.length >= 2 && Number.isFinite(Number(score[0])) && Number.isFinite(Number(score[1])))
    .map((score) => [Number(score[0]), Number(score[1])]);
}

function friendlyHumanScoreText(remoteState, includeCurrent = false) {
  const scores = friendlyHumanCompletedScores(remoteState);
  if (includeCurrent && !remoteState?.setMatch?.matchOver && !remoteState?.setMatch?.setOver && Array.isArray(remoteState?.setMatch?.score)) {
    scores.push([Number(remoteState.setMatch.score[0] || 0), Number(remoteState.setMatch.score[1] || 0)]);
  }
  const text = scores.map(([gamesA, gamesB]) => `${gamesA}/${gamesB}`).join(" - ");
  return includeCurrent ? `${text || "0/0"} · EN DIRECT` : text;
}

function friendlyHumanWinnerFromState(tournament, match, remoteState) {
  if (!remoteState?.setMatch?.matchOver || ![0, 1].includes(Number(remoteState.setMatch.matchWinner))) return null;
  const targetSets = Number(tournament.targetSets || 2);
  const completedScores = friendlyHumanCompletedScores(remoteState);
  if (!completedScores.length || completedScores.length > (targetSets * 2) - 1) return null;
  const setWins = [0, 0];
  for (const [gamesA, gamesB] of completedScores) {
    if (!friendlySetIsComplete(gamesA, gamesB) || setWins[0] >= targetSets || setWins[1] >= targetSets) return null;
    if (gamesA > gamesB) setWins[0] += 1;
    else if (gamesB > gamesA) setWins[1] += 1;
  }
  const winnerSeat = Number(remoteState.setMatch.matchWinner);
  if (setWins[winnerSeat] < targetSets || setWins[winnerSeat === 0 ? 1 : 0] >= targetSets) return null;
  return winnerSeat === 0 ? match.playerA : match.playerB;
}

function friendlyRoundReadyForPlay(tournament) {
  if (tournament.status !== "playing") return false;
  if (tournament.round === "quarter") return true;
  if (tournament.round === "complete") return false;
  return true;
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/human-match-logs") {
    const user = await currentUser(req);
    if (!user) {
      sendJson(res, 401, { error: "Connexion requise." });
      return;
    }
    if (req.method === "POST") {
      try {
        const session = await saveHumanMatchLog(user, await readJson(req));
        sendJson(res, 201, { ok: true, matchId: session.matchId });
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }
      return;
    }
    if (req.method === "GET") {
      const matches = await listHumanMatchLogs({
        userId: user.id,
        limit: url.searchParams.get("limit") || 100,
      });
      sendJson(res, 200, { matches });
      return;
    }
    sendJson(res, 405, { error: "Méthode non autorisée." });
    return;
  }

  if ((url.pathname.startsWith("/api/auth/") || url.pathname.startsWith("/api/admin/") || url.pathname.startsWith("/api/competitions") || url.pathname === "/api/ranking" || url.pathname.startsWith("/api/profile") || url.pathname.startsWith("/api/profiles/")) && await handleAuth(req, res, url)) {
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/lobby") {
    const user = await requirePro(req, res);
    if (!user) return;
    const openRooms = [...rooms.values()]
      .filter((room) => room.status === "waiting")
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((room) => publicRoomInfo(req, room));
    for (const tournament of friendlyTournaments.values()) {
      if (!resolveWaitingFriendlyHost(tournament)) friendlyTournaments.delete(tournament.id);
    }
    const tournaments = [...friendlyTournaments.values()]
      .filter((tournament) => tournament.status === "waiting" || tournament.status === "playing")
      .map((tournament) => {
        resolveFriendlyPresenceLosses(tournament);
        resolveFriendlyReconnectTimeouts(tournament);
        refreshFriendlyTournamentSlots(tournament);
        return tournament;
      })
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((tournament) => publicFriendlyLobbyInfo(req, tournament, user));
    sendJson(res, 200, { rooms: openRooms, tournaments });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/lobby/friendly-tournaments") {
    const user = await requirePro(req, res);
    if (!user) return;
    if (userHasOpenFriendlyTournament(user.id)) {
      sendJson(res, 409, { error: "Vous avez déjà une partie en ligne ouverte. Fermez-la ou quittez-la avant d'en créer une autre." });
      return;
    }
    const payload = await readJson(req);
    let tournamentId = makeId(3);
    while (friendlyTournaments.has(tournamentId)) tournamentId = makeId(3);
    const participantId = makeId(4);
    const participant = {
      id: participantId,
      token: makeToken(),
      userId: user.id,
      nickname: String(user.nickname || payload.nickname || "Joueur").slice(0, 24),
      characterId: normalizeCharacterId(payload.characterId, "coachJu"),
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
      selected: true,
    };
    const tournament = {
      id: tournamentId,
      status: "waiting",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      creatorParticipantId: participantId,
      format: "match",
      targetSets: 2,
      distribution: "random",
      difficulty: "normal",
      bonus: "none",
      playerSelection: "random",
      excludedUserIds: [],
      participants: [participant],
      spectators: [],
      entries: [],
      matches: [],
      round: "waiting",
      ready: {},
      nextReady: {},
      champion: null,
    };
    friendlyTournaments.set(tournamentId, tournament);
    sendJson(res, 201, {
      tournament: publicFriendlyTournamentInfo(req, tournament, participant),
      playerUrl: friendlyTournamentUrl(req, tournament.id, participant.id, participant.token),
    });
    return;
  }

  const friendlyJoinMatch = url.pathname.match(/^\/api\/lobby\/friendly-tournaments\/([^/]+)\/join$/);
  const friendlyResumeMatch = url.pathname.match(/^\/api\/lobby\/friendly-tournaments\/([^/]+)\/resume$/);
  const friendlySpectateMatch = url.pathname.match(/^\/api\/lobby\/friendly-tournaments\/([^/]+)\/spectate$/);
  const friendlyAdminDeleteMatch = url.pathname.match(/^\/api\/lobby\/friendly-tournaments\/([^/]+)\/admin-delete$/);
  if (req.method === "POST" && friendlyAdminDeleteMatch) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const tournament = friendlyTournaments.get(friendlyAdminDeleteMatch[1]);
    if (!tournament) {
      sendJson(res, 404, { error: "Salon introuvable." });
      return;
    }
    friendlyTournaments.delete(tournament.id);
    sendJson(res, 200, { ok: true, closed: true });
    return;
  }

  if (req.method === "POST" && friendlyResumeMatch) {
    const user = await requirePro(req, res);
    if (!user) return;
    const tournament = friendlyTournaments.get(friendlyResumeMatch[1]);
    if (!tournament || !["waiting", "playing"].includes(tournament.status)) {
      sendJson(res, 404, { error: "Cette partie ne peut plus être reprise." });
      return;
    }
    resolveFriendlyReconnectTimeouts(tournament);
    refreshFriendlyTournamentSlots(tournament);
    const participant = activeFriendlyParticipants(tournament)
      .find((item) => String(item.userId) === String(user.id)) || null;
    if (!participant) {
      sendJson(res, 403, { error: "Vous n'êtes pas inscrit à ce tournoi." });
      return;
    }
    markFriendlyParticipantPresent(participant);
    participant.token = makeToken();
    participant.resumedAt = Date.now();
    tournament.updatedAt = Date.now();
    sendJson(res, 200, {
      tournament: publicFriendlyTournamentInfo(req, tournament, participant),
      playerUrl: friendlyTournamentUrl(req, tournament.id, participant.id, participant.token),
      resumedInMatch: Boolean(currentFriendlyMatchForParticipant(tournament, participant.id)),
    });
    return;
  }

  if (req.method === "POST" && friendlyJoinMatch) {
    const user = await requirePro(req, res);
    if (!user) return;
    const tournament = friendlyTournaments.get(friendlyJoinMatch[1]);
    if (!tournament || tournament.status !== "waiting") {
      sendJson(res, 404, { error: "Tournoi indisponible." });
      return;
    }
    if (activeFriendlyParticipants(tournament).length >= 4) {
      sendJson(res, 409, { error: "Tournoi complet." });
      return;
    }
    if ((tournament.excludedUserIds || []).some((userId) => String(userId) === String(user.id))) {
      sendJson(res, 403, { error: "Vous avez été exclu de ce salon." });
      return;
    }
    if (tournament.participants.some((item) => String(item.userId) === String(user.id))) {
      sendJson(res, 409, { error: "Vous avez déjà participé à ce tournoi et ne pouvez pas le rejoindre à nouveau." });
      return;
    }
    const payload = await readJson(req);
    const participant = {
      id: makeId(4),
      token: makeToken(),
      userId: user.id,
      nickname: String(user.nickname || payload.nickname || "Joueur").slice(0, 24),
      characterId: normalizeCharacterId(payload.characterId, "coachJu"),
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
      selected: false,
    };
    tournament.participants.push(participant);
    tournament.updatedAt = Date.now();
    sendJson(res, 200, {
      tournament: publicFriendlyTournamentInfo(req, tournament, participant),
      playerUrl: friendlyTournamentUrl(req, tournament.id, participant.id, participant.token),
    });
    return;
  }

  if (req.method === "POST" && friendlySpectateMatch) {
    const user = await requirePro(req, res);
    if (!user) return;
    const tournament = friendlyTournaments.get(friendlySpectateMatch[1]);
    if (!tournament || tournament.status !== "playing") {
      sendJson(res, 404, { error: "Ce tournoi n'est pas disponible en mode spectateur." });
      return;
    }
    tournament.spectators = tournament.spectators || [];
    let spectator = tournament.spectators.find((item) => String(item.userId) === String(user.id));
    if (!spectator) {
      spectator = {
        id: makeId(4),
        token: makeToken(),
        userId: user.id,
        nickname: String(user.nickname || "Spectateur").slice(0, 24),
        joinedAt: Date.now(),
      };
      tournament.spectators.push(spectator);
    }
    sendJson(res, 200, {
      tournament: publicFriendlyTournamentInfo(req, tournament, null, spectator),
      spectatorUrl: friendlySpectatorUrl(req, tournament.id, spectator.id, spectator.token),
    });
    return;
  }

  const friendlySettingsMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/settings$/);
  if (req.method === "POST" && friendlySettingsMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlySettingsMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament || !participant) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return;
    }
    if (participant.id !== tournament.creatorParticipantId) {
      sendJson(res, 403, { error: "Seul l'hôte peut modifier le tournoi." });
      return;
    }
    if (tournament.status !== "waiting") {
      sendJson(res, 409, { error: "La configuration est verrouillée après le lancement." });
      return;
    }
    tournament.format = ["match", "classic", "league"].includes(payload.format) ? payload.format : "match";
    tournament.targetSets = Number(payload.targetSets) === 3 ? 3 : 2;
    tournament.distribution = ["random", "ranking", "separated"].includes(payload.distribution) ? payload.distribution : "random";
    tournament.difficulty = ["amateur", "normal", "expert", "champion", "legend", "ranking", "circuit"].includes(payload.difficulty) ? payload.difficulty : "normal";
    tournament.bonus = ["none", "ascendant", "domination", "nemesis"].includes(payload.bonus) ? payload.bonus : "none";
    tournament.playerSelection = payload.playerSelection === "best" ? "best" : "random";
    const selected = selectedFriendlyParticipants(tournament);
    const limit = friendlySelectionLimit(tournament);
    selected.slice(limit).forEach((item) => { item.selected = false; });
    tournament.updatedAt = Date.now();
    sendJson(res, 200, { tournament: publicFriendlyTournamentInfo(req, tournament, participant) });
    return;
  }

  const friendlySelectionMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/selection$/);
  if (req.method === "POST" && friendlySelectionMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlySelectionMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament || !participant || participant.id !== tournament.creatorParticipantId || tournament.status !== "waiting") {
      sendJson(res, 403, { error: "Sélection impossible." });
      return;
    }
    const target = activeFriendlyParticipants(tournament).find((item) => item.id === payload.targetParticipantId);
    if (!target) {
      sendJson(res, 404, { error: "Joueur introuvable." });
      return;
    }
    const nextSelected = Boolean(payload.selected);
    if (nextSelected && !target.selected && selectedFriendlyParticipants(tournament).length >= friendlySelectionLimit(tournament)) {
      sendJson(res, 409, { error: `Vous pouvez sélectionner au maximum ${friendlySelectionLimit(tournament)} joueurs pour cet événement.` });
      return;
    }
    target.selected = nextSelected;
    tournament.updatedAt = Date.now();
    sendJson(res, 200, { tournament: publicFriendlyTournamentInfo(req, tournament, participant) });
    return;
  }

  const friendlyKickMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/kick$/);
  if (req.method === "POST" && friendlyKickMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlyKickMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament || !participant) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return;
    }
    if (participant.id !== tournament.creatorParticipantId || tournament.status !== "waiting") {
      sendJson(res, 403, { error: "Exclusion impossible." });
      return;
    }
    const target = activeFriendlyParticipants(tournament).find((item) => item.id === payload.targetParticipantId && item.id !== participant.id);
    if (!target) {
      sendJson(res, 404, { error: "Joueur introuvable." });
      return;
    }
    target.kickedAt = Date.now();
    tournament.excludedUserIds = [...new Set([...(tournament.excludedUserIds || []), String(target.userId)])];
    tournament.updatedAt = Date.now();
    sendJson(res, 200, { tournament: publicFriendlyTournamentInfo(req, tournament, participant) });
    return;
  }

  const friendlyStartMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/start$/);
  if (req.method === "POST" && friendlyStartMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlyStartMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament || !participant) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return;
    }
    if (participant.id !== tournament.creatorParticipantId) {
      sendJson(res, 403, { error: "Seul le créateur peut lancer le tournoi." });
      return;
    }
    if (tournament.status !== "waiting" || selectedFriendlyParticipants(tournament).length < 1) {
      sendJson(res, 409, { error: "Sélectionnez au moins un joueur avant de lancer l'événement." });
      return;
    }
    tournament.status = "playing";
    tournament.updatedAt = Date.now();
    tournament.ready = {};
    tournament.nextReady = {};
    await buildFriendlyTournamentBracket(tournament);
    sendJson(res, 200, { tournament: publicFriendlyTournamentInfo(req, tournament, participant) });
    return;
  }

  const friendlyPresenceMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/presence$/);
  if (req.method === "POST" && friendlyPresenceMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlyPresenceMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament || !participant || !["waiting", "playing"].includes(tournament.status)) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return;
    }
    resolveFriendlyPresenceLosses(tournament);
    resolveFriendlyReconnectTimeouts(tournament);
    refreshFriendlyTournamentSlots(tournament);
    if (payload.status === "online") {
      participant.activePresenceId = String(payload.presenceId || participant.activePresenceId || "").slice(0, 80) || null;
      markFriendlyParticipantPresent(participant);
      tournament.updatedAt = Date.now();
      sendJson(res, 200, {
        ok: true,
        resumed: true,
        currentMatch: publicFriendlyCurrentMatch(tournament, participant.id),
      });
      return;
    }
    if (tournament.status === "waiting") {
      const now = Date.now();
      if (participant.id === tournament.creatorParticipantId) {
        participant.awayAt = now;
        participant.hostReturnDeadline = now + 10_000;
      } else {
        participant.leftAt = now;
        participant.selected = false;
      }
      tournament.updatedAt = now;
      sendJson(res, 200, { ok: true, paused: true, graceSeconds: participant.id === tournament.creatorParticipantId ? 10 : null });
      return;
    }
    const closingPresenceId = String(payload.presenceId || "").slice(0, 80);
    if (closingPresenceId && participant.activePresenceId && closingPresenceId !== participant.activePresenceId) {
      sendJson(res, 200, { ok: true, paused: false, ignored: true });
      return;
    }
    const currentMatch = currentFriendlyMatchForParticipant(tournament, participant.id);
    const paused = markFriendlyParticipantAway(tournament, participant, currentMatch, {
      reason: "window",
      graceSeconds: FRIENDLY_RECONNECT_GRACE_MS / 1000,
      score: payload.score,
    });
    sendJson(res, 200, {
      ok: true,
      paused,
      graceSeconds: paused ? FRIENDLY_RECONNECT_GRACE_MS / 1000 : null,
      reconnectDeadline: paused ? participant.reconnectDeadline : null,
    });
    return;
  }

  const friendlyLeaveMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/leave$/);
  if (req.method === "POST" && friendlyLeaveMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlyLeaveMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament) {
      sendJson(res, 200, { ok: true, closed: true });
      return;
    }
    if (!participant) {
      sendJson(res, 200, { ok: true, closed: false, alreadyLeft: true });
      return;
    }
    if (tournament.status === "waiting") {
      if (participant.id === tournament.creatorParticipantId) {
        participant.awayAt = Date.now();
        participant.hostReturnDeadline = Date.now() + 10_000;
      } else {
        participant.leftAt = Date.now();
        participant.selected = false;
      }
      tournament.updatedAt = Date.now();
      const remainingParticipants = activeFriendlyParticipants(tournament);
      if (!remainingParticipants.length) {
        friendlyTournaments.delete(tournament.id);
        sendJson(res, 200, { ok: true, closed: true, rejoinAllowed: true });
        return;
      }
      sendJson(res, 200, {
        ok: true,
        closed: false,
        rejoinAllowed: true,
        graceSeconds: participant.id === tournament.creatorParticipantId ? 10 : null,
        participantCount: remainingParticipants.length,
        creatorParticipantId: tournament.creatorParticipantId,
        tournament: publicFriendlyTournamentInfo(req, tournament, null),
      });
      return;
    }
    resolveFriendlyReconnectTimeouts(tournament);
    refreshFriendlyTournamentSlots(tournament);
    const entry = friendlyParticipantEntry(participant.id);
    const currentMatch = tournament.matches.find((match) => (
      !match.winner
      && match.round === tournament.round
      && (match.playerA === entry || match.playerB === entry)
    )) || null;
    const now = Date.now();
    participant.awayAt = now;
    participant.awayReason = "explicit";
    participant.disconnectScore = String(payload.score || currentMatch?.liveScore || "0/0")
      .replace(/\s*·\s*EN DIRECT\s*$/i, "")
      .slice(0, 80);
    let graceSeconds = null;
    if (currentMatch) {
      const humanVsHuman = friendlyMatchIsHumanVsHuman(currentMatch);
      graceSeconds = humanVsHuman ? 20 : 10;
      participant.reconnectMatchId = currentMatch.id;
      participant.reconnectGraceSeconds = graceSeconds;
      participant.reconnectDeadline = now + (graceSeconds * 1000);
      if (humanVsHuman) {
        const access = friendlyHumanMatchAccess(tournament, currentMatch, participant);
        const canStoreState = access
          && payload.state
          && Number(payload.baseRevision) === Number(access.session.revision || 0)
          && !validateFriendlyHumanSyncState(tournament, currentMatch, payload.state);
        if (canStoreState) {
          access.session.state = cloneFriendlyMatchState(payload.state);
          access.session.revision += 1;
          access.session.updatedAt = now;
          currentMatch.liveScore = friendlyHumanScoreText(payload.state, true);
          currentMatch.liveState = sanitizeFriendlySpectatorState(payload.state);
          currentMatch.liveUpdatedAt = now;
        }
      } else if (payload.state) {
        currentMatch.resumeState = cloneFriendlyMatchState(payload.state);
        currentMatch.liveScore = String(payload.score || currentMatch.liveScore || "0/0").slice(0, 100);
        currentMatch.liveState = sanitizeFriendlySpectatorState(payload.state);
        currentMatch.liveUpdatedAt = now;
      }
    } else {
      participant.reconnectMatchId = null;
      participant.reconnectGraceSeconds = null;
      participant.reconnectDeadline = null;
    }
    tournament.updatedAt = Date.now();
    sendJson(res, 200, {
      ok: true,
      closed: false,
      paused: true,
      resumeAllowed: true,
      graceSeconds,
      reconnectDeadline: participant.reconnectDeadline || null,
      inMatch: Boolean(currentMatch),
      score: participant.disconnectScore || null,
      participantCount: activeFriendlyParticipants(tournament).length,
      creatorParticipantId: tournament.creatorParticipantId,
      tournament: publicFriendlyTournamentInfo(req, tournament, null),
    });
    return;
  }

  const friendlyStateMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)$/);
  if (req.method === "GET" && friendlyStateMatch) {
    const tournament = friendlyTournaments.get(friendlyStateMatch[1]);
    const kickedParticipant = tournament?.participants.find((item) => (
      item.kickedAt
      && item.id === url.searchParams.get("participantId")
      && item.token === url.searchParams.get("token")
    ));
    if (kickedParticipant) {
      sendJson(res, 403, { error: "Vous avez été exclu du salon.", kicked: true });
      return;
    }
    const participant = participantForToken(tournament, url.searchParams.get("participantId"), url.searchParams.get("token"));
    const spectator = spectatorForToken(tournament, url.searchParams.get("spectatorId"), url.searchParams.get("token"));
    if (!tournament || (!participant && !spectator)) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return;
    }
    if (participant) {
      const presenceId = String(url.searchParams.get("presenceId") || "").slice(0, 80);
      if (presenceId && !participant.activePresenceId) participant.activePresenceId = presenceId;
      if (!presenceId || !participant.activePresenceId || presenceId === participant.activePresenceId) {
        touchFriendlyParticipant(participant);
      }
    }
    if (!resolveWaitingFriendlyHost(tournament)) {
      friendlyTournaments.delete(tournament.id);
      sendJson(res, 404, { error: "Partie fermée." });
      return;
    }
    resolveFriendlyPresenceLosses(tournament);
    resolveFriendlyReconnectTimeouts(tournament);
    refreshFriendlyTournamentSlots(tournament);
    sendJson(res, 200, {
      tournament: publicFriendlyTournamentInfo(req, tournament, participant, spectator),
      currentMatch: participant ? publicFriendlyCurrentMatch(tournament, participant.id) : null,
    });
    return;
  }

  const friendlySyncMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/matches\/([^/]+)\/state$/);
  if (friendlySyncMatch && (req.method === "GET" || req.method === "POST")) {
    const tournament = friendlyTournaments.get(friendlySyncMatch[1]);
    const payload = req.method === "POST" ? await readJson(req) : null;
    const participantId = req.method === "POST" ? payload.participantId : url.searchParams.get("participantId");
    const token = req.method === "POST" ? payload.token : url.searchParams.get("token");
    const participant = participantForToken(tournament, participantId, token);
    const match = tournament?.matches.find((item) => item.id === friendlySyncMatch[2]);
    const access = friendlyHumanMatchAccess(tournament, match, participant);
    if (!tournament || !participant || !match || !access || tournament.status !== "playing" || match.winner) {
      sendJson(res, 404, { error: "Session de match indisponible." });
      return;
    }
    touchFriendlyParticipant(participant);
    if (match.round !== tournament.round) {
      sendJson(res, 409, { error: "Cette rencontre n'est pas encore disponible." });
      return;
    }
    if (req.method === "GET") {
      sendJson(res, 200, {
        matchId: match.id,
        seat: access.seat,
        revision: access.session.revision,
        state: access.session.state,
        targetSets: Number(tournament.targetSets || 2),
        status: "playing",
        hostSeat: 0,
        isHost: access.isHost,
        players: friendlyHumanSessionPlayers(tournament, match),
        logs: [],
      });
      return;
    }
    if (!access.session.state && !access.isHost) {
      sendJson(res, 409, { error: "En attente de l'initialisation du match par le joueur A.", revision: access.session.revision });
      return;
    }
    if (Number(payload.baseRevision || 0) !== Number(access.session.revision || 0)) {
      sendJson(res, 409, { error: "État de match dépassé.", revision: access.session.revision });
      return;
    }
    const validationError = validateFriendlyHumanSyncState(tournament, match, payload.state);
    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return;
    }
    access.session.state = payload.state;
    access.session.revision += 1;
    access.session.updatedAt = Date.now();
    match.liveScore = friendlyHumanScoreText(payload.state, true);
    match.liveState = sanitizeFriendlySpectatorState(payload.state);
    match.liveParticipantId = participant.id;
    match.liveUpdatedAt = Date.now();
    noteFriendlyHumanSetProgress(tournament, match, payload.state);
    tournament.updatedAt = Date.now();
    sendJson(res, 200, {
      ok: true,
      matchId: match.id,
      seat: access.seat,
      revision: access.session.revision,
      targetSets: Number(tournament.targetSets || 2),
      status: "playing",
      hostSeat: 0,
      isHost: access.isHost,
      players: friendlyHumanSessionPlayers(tournament, match),
      logs: [],
    });
    return;
  }

  const friendlyLiveMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/matches\/([^/]+)\/live$/);
  if (req.method === "POST" && friendlyLiveMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlyLiveMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    const match = tournament?.matches.find((item) => item.id === friendlyLiveMatch[2]);
    const entry = participant ? friendlyParticipantEntry(participant.id) : null;
    if (!tournament || !participant || tournament.status !== "playing" || !match || match.winner) {
      sendJson(res, 404, { error: "Match indisponible." });
      return;
    }
    touchFriendlyParticipant(participant);
    if (match.round !== tournament.round || (match.playerA !== entry && match.playerB !== entry)) {
      sendJson(res, 403, { error: "Ce joueur ne participe pas à ce match." });
      return;
    }
    const currentStreamIsFresh = match.liveParticipantId && Date.now() - Number(match.liveUpdatedAt || 0) < 5000;
    if (currentStreamIsFresh && match.liveParticipantId !== participant.id) {
      sendJson(res, 409, { error: "Une diffusion est déjà active pour ce match." });
      return;
    }
    const safeState = sanitizeFriendlySpectatorState(payload.state);
    if (!safeState) {
      sendJson(res, 400, { error: "État de match invalide." });
      return;
    }
    match.resumeState = cloneFriendlyMatchState(payload.state);
    match.liveScore = String(payload.liveScore || "0/0").slice(0, 100);
    match.liveState = safeState;
    match.liveParticipantId = participant.id;
    match.liveUpdatedAt = Date.now();
    noteFriendlyHumanSetProgress(tournament, match, payload.state);
    tournament.updatedAt = Date.now();
    sendJson(res, 200, {
      ok: true,
      liveScore: match.liveScore,
      liveUpdatedAt: match.liveUpdatedAt,
    });
    return;
  }

  const friendlyWatchMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/matches\/([^/]+)\/watch$/);
  if (req.method === "GET" && friendlyWatchMatch) {
    const tournament = friendlyTournaments.get(friendlyWatchMatch[1]);
    const participant = participantForToken(tournament, url.searchParams.get("participantId"), url.searchParams.get("token"));
    const spectator = spectatorForToken(tournament, url.searchParams.get("spectatorId"), url.searchParams.get("token"));
    const match = tournament?.matches.find((item) => item.id === friendlyWatchMatch[2]);
    if (!tournament || (!participant && !spectator) || !match) {
      sendJson(res, 404, { error: "Match introuvable." });
      return;
    }
    const active = friendlyMatchIsWatchable(match);
    sendJson(res, 200, {
      active,
      liveScore: match.liveScore || null,
      liveUpdatedAt: match.liveUpdatedAt || null,
      state: active ? match.liveState : null,
      match: {
        id: match.id,
        label: match.label,
        playerA: friendlyEntryPublic(tournament, match.playerA),
        playerB: friendlyEntryPublic(tournament, match.playerB),
        winner: friendlyEntryPublic(tournament, match.winner),
        score: match.score || null,
      },
    });
    return;
  }

  const friendlyResultMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/matches\/([^/]+)\/result$/);
  if (req.method === "POST" && friendlyResultMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlyResultMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament || !participant || tournament.status !== "playing") {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return;
    }
    touchFriendlyParticipant(participant);
    const match = tournament.matches.find((item) => item.id === friendlyResultMatch[2]);
    const entry = friendlyParticipantEntry(participant.id);
    if (!match || (match.playerA !== entry && match.playerB !== entry)) {
      sendJson(res, 409, { error: "Match indisponible." });
      return;
    }
    if (match.winner) {
      sendJson(res, 200, { tournament: publicFriendlyTournamentInfo(req, tournament, participant), alreadyRecorded: true });
      return;
    }
    if (friendlyMatchIsHumanVsHuman(match)) {
      const access = friendlyHumanMatchAccess(tournament, match, participant);
      const finalState = payload.state || access?.session?.state;
      const validationError = validateFriendlyHumanSyncState(tournament, match, finalState);
      const verifiedWinner = validationError ? null : friendlyHumanWinnerFromState(tournament, match, finalState);
      const verifiedScore = validationError ? "" : friendlyHumanScoreText(finalState, false);
      if (!access || validationError || !verifiedWinner || !verifiedScore) {
        sendJson(res, 409, { error: validationError || "Le résultat partagé n'est pas encore validé." });
        return;
      }
      access.session.state = finalState;
      access.session.revision += 1;
      access.session.updatedAt = Date.now();
      match.winner = verifiedWinner;
      match.score = verifiedScore.slice(0, 80);
    } else {
      match.winner = String(payload.winner || "") === match.playerB ? match.playerB : match.playerA;
      match.score = String(payload.score || "").slice(0, 80);
    }
    noteFriendlyHumanSetProgress(
      tournament,
      match,
      friendlyMatchIsHumanVsHuman(match) ? payload.state || match.session?.state : null,
      match.score,
    );
    match.liveScore = match.score;
    match.liveState = null;
    match.liveParticipantId = null;
    match.liveUpdatedAt = Date.now();
    match.resumeState = null;
    for (const matchParticipant of activeFriendlyParticipants(tournament)) {
      if (matchParticipant.reconnectMatchId !== match.id) continue;
      matchParticipant.reconnectDeadline = null;
      matchParticipant.reconnectMatchId = null;
      matchParticipant.reconnectGraceSeconds = null;
      matchParticipant.disconnectScore = null;
    }
    tournament.ready = tournament.ready || {};
    tournament.nextReady = tournament.nextReady || {};
    delete tournament.nextReady[participant.id];
    tournament.updatedAt = Date.now();
    refreshFriendlyTournamentSlots(tournament);
    sendJson(res, 200, { tournament: publicFriendlyTournamentInfo(req, tournament, participant) });
    return;
  }

  const friendlyReadyMatch = url.pathname.match(/^\/api\/friendly-tournaments\/([^/]+)\/ready$/);
  if (req.method === "POST" && friendlyReadyMatch) {
    const payload = await readJson(req);
    const tournament = friendlyTournaments.get(friendlyReadyMatch[1]);
    const participant = participantForToken(tournament, payload.participantId, payload.token);
    if (!tournament || !participant) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return;
    }
    tournament.ready[tournament.round] = tournament.ready[tournament.round] || {};
    tournament.ready[tournament.round][participant.id] = true;
    tournament.nextReady = tournament.nextReady || {};
    tournament.nextReady[participant.id] = true;
    tournament.updatedAt = Date.now();
    sendJson(res, 200, { tournament: publicFriendlyTournamentInfo(req, tournament, participant) });
    return;
  }

  const roomAdminDeleteMatch = url.pathname.match(/^\/api\/lobby\/rooms\/([^/]+)\/admin-delete$/);
  if (req.method === "POST" && roomAdminDeleteMatch) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const room = rooms.get(roomAdminDeleteMatch[1]);
    if (!room) {
      sendJson(res, 404, { error: "Salon introuvable." });
      return;
    }
    rooms.delete(room.id);
    sendJson(res, 200, { ok: true, closed: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/lobby/rooms") {
    const user = await requirePro(req, res);
    if (!user) return;
    const payload = await readJson(req);
    const targetSets = Number(payload.targetSets) === 3 ? 3 : 2;
    const characterId = normalizeCharacterId(payload.characterId);
    const hostSeat = characterId === "coachMax" ? 1 : 0;
    const nickname = String(user.nickname || payload.nickname || (hostSeat === 0 ? "Coach Ju" : "Coach Max")).slice(0, 24);
    const { room, hostUrl } = createRoom(req, {
      status: "waiting",
      targetSets,
      hostSeat,
      userId: user.id,
      nickname,
      characterId,
    });
    sendJson(res, 201, { room: publicRoomInfo(req, room), playerUrl: `${hostUrl}&targetSets=${targetSets}` });
    return;
  }

  const joinMatch = url.pathname.match(/^\/api\/lobby\/rooms\/([^/]+)\/join$/);
  if (req.method === "POST" && joinMatch) {
    const user = await requirePro(req, res);
    if (!user) return;
    const room = rooms.get(joinMatch[1]);
    if (!room || room.status !== "waiting") {
      sendJson(res, 404, { error: "Partie indisponible." });
      return;
    }
    const openSeat = room.players.findIndex((player) => player == null);
    if (openSeat === -1) {
      sendJson(res, 409, { error: "Partie complète." });
      return;
    }
    const payload = await readJson(req);
    const characterId = normalizeCharacterId(payload.characterId, "coachJu");
    room.players[openSeat] = {
      userId: user.id,
      nickname: String(user.nickname || payload.nickname || (openSeat === 0 ? "Coach Ju" : "Coach Max")).slice(0, 24),
      characterId,
      joinedAt: Date.now(),
      isHost: false,
    };
    room.status = "playing";
    room.updatedAt = Date.now();
    sendJson(res, 200, { room: publicRoomInfo(req, room), playerUrl: playerUrl(req, room.id, openSeat, room.tokens[openSeat]) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/rooms") {
    const { room, coachJuUrl, coachMaxUrl } = createRoom(req);
    sendJson(res, 201, { roomId: room.id, coachJuUrl, coachMaxUrl });
    return;
  }

  const leaveMatch = url.pathname.match(/^\/api\/rooms\/([^/]+)\/leave$/);
  if (req.method === "POST" && leaveMatch) {
    const room = rooms.get(leaveMatch[1]);
    if (!room) {
      sendJson(res, 200, { ok: true, closed: true });
      return;
    }
    const payload = await readJson(req);
    const seat = seatForToken(room, payload.token);
    if (seat == null) {
      sendJson(res, 403, { error: "Token invalide." });
      return;
    }
    const remainingSeat = room.players.findIndex((player, index) => index !== seat && player);
    if (remainingSeat === -1) {
      rooms.delete(room.id);
      sendJson(res, 200, { ok: true, closed: true });
      return;
    }
    room.players[seat] = null;
    room.hostSeat = remainingSeat;
    room.players[remainingSeat].isHost = true;
    room.status = "waiting";
    room.updatedAt = Date.now();
    room.revision += 1;
    sendJson(res, 200, { ok: true, closed: false, room: publicRoomInfo(req, room), revision: room.revision });
    return;
  }

  if (req.method === "GET" && url.pathname === "/new-room") {
    const { coachJuUrl } = createRoom(req);
    res.writeHead(302, { location: coachJuUrl });
    res.end();
    return;
  }

  const stateMatch = url.pathname.match(/^\/api\/rooms\/([^/]+)\/state$/);
  if (!stateMatch) {
    sendJson(res, 404, { error: "Route inconnue." });
    return;
  }

  const room = rooms.get(stateMatch[1]);
  if (!room) {
    sendJson(res, 404, { error: "Salon introuvable." });
    return;
  }

  if (req.method === "GET") {
    const token = url.searchParams.get("token");
    const seat = seatForToken(room, token);
    if (seat == null) {
      sendJson(res, 403, { error: "Token invalide." });
      return;
    }
    sendJson(res, 200, {
      roomId: room.id,
      seat,
      revision: room.revision,
      state: room.state,
      targetSets: room.targetSets,
      status: room.status,
      hostSeat: room.hostSeat,
      isHost: seat === room.hostSeat,
      players: publicRoomInfo(req, room).players,
      logs: room.logs,
      inviteUrl: playerUrl(req, room.id, seat === 0 ? 1 : 0, room.tokens[seat === 0 ? 1 : 0]),
    });
    return;
  }

  if (req.method === "POST") {
    const payload = await readJson(req);
    const seat = seatForToken(room, payload.token);
    if (seat == null) {
      sendJson(res, 403, { error: "Token invalide." });
      return;
    }
    room.state = payload.state;
    mergeRoomLogs(room, payload.state?.actionLog);
    room.revision += 1;
    room.updatedAt = Date.now();
    if (room.status === "direct") room.status = "playing";
    sendJson(res, 200, {
      ok: true,
      roomId: room.id,
      seat,
      revision: room.revision,
      targetSets: room.targetSets,
      status: room.status,
      hostSeat: room.hostSeat,
      isHost: seat === room.hostSeat,
      logs: room.logs,
      inviteUrl: playerUrl(req, room.id, seat === 0 ? 1 : 0, room.tokens[seat === 0 ? 1 : 0]),
    });
    return;
  }

  sendJson(res, 405, { error: "Méthode non autorisée." });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/") || req.url === "/new-room") {
    handleApi(req, res).catch((error) => {
      sendJson(res, 500, { error: error.message });
    });
    return;
  }
  serveStatic(req, res);
});

const friendlyPresenceSweep = setInterval(() => {
  for (const tournament of friendlyTournaments.values()) {
    if (tournament.status === "waiting") {
      if (!resolveWaitingFriendlyHost(tournament)) friendlyTournaments.delete(tournament.id);
      continue;
    }
    if (tournament.status !== "playing") continue;
    resolveFriendlyPresenceLosses(tournament);
    resolveFriendlyReconnectTimeouts(tournament);
    refreshFriendlyTournamentSlots(tournament);
  }
}, 1000);
friendlyPresenceSweep.unref?.();

initAuthStorage()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Tennis Courts Light server running on http://localhost:${PORT}`);
      console.log(`Create a remote test room at http://localhost:${PORT}/new-room`);
    });
  })
  .catch((error) => {
    console.error("Unable to initialize authentication storage:", error);
    process.exit(1);
  });
