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
const COACH_IDS = new Set(["coachJu", "coachMax", "coachCarla", "coachClem"]);
const SESSION_COOKIE = "tc_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 210000;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const ADMIN_EMAIL = "julien.castagnoli@mediality.fr";
const USER_ROLES = new Set(["free", "pro", "pro_plus", "admin"]);
const COACH_CHARACTER_IDS = ["coachJu", "coachMax", "coachCarla", "coachClem"];
const HISTORIC_CHARACTER_IDS = ["theoBriancourt", "alessandraConti", "saharaJackson", "kjellBlomqvist", "kojiIwata", "elianaMarquez"];
const NEW_CHARACTER_IDS = [
  "jonasFalkenried", "yunaSeo", "ikerSalvat", "loganBrooks", "kavyaSaran", "zariaCampbell",
  "renAoshima", "yasmineElMansouri", "daanVermeer", "lukasEberhardt", "milanVerhaegen",
];
const ALL_PROFILE_CHARACTER_IDS = [...COACH_CHARACTER_IDS, ...HISTORIC_CHARACTER_IDS, ...NEW_CHARACTER_IDS];
const SURFACES = ["grass", "hard", "clay"];
const SURFACE_LABELS = { grass: "HERBE", hard: "DUR", clay: "TERRE-BATTUE" };
const CIRCUIT_SEASON_LENGTH = 20;
const DAILY_RETRY_LIMIT = 5;
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
  Circuit: "Circuit 400",
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
  circuitAttempts: new Map(),
  circuitSaves: new Map(),
  circuitResults: [],
  aiResults: new Map(),
  appState: new Map(),
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
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
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
    bestWorldRank: user.best_world_rank || user.bestWorldRank || null,
    weeksWorldNumberOne: user.weeks_world_number_one || user.weeksWorldNumberOne || 0,
    weeksWorldTop3: user.weeks_world_top3 || user.weeksWorldTop3 || 0,
    weeksWorldTop5: user.weeks_world_top5 || user.weeksWorldTop5 || 0,
    weeksWorldTop10: user.weeks_world_top10 || user.weeksWorldTop10 || 0,
    createdAt: user.created_at || user.createdAt,
  } : null;
}

function currentWeekKey(date = new Date()) {
  const parisDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const period = new Date(parisDate);
  period.setHours(3, 0, 0, 0);
  if (parisDate < period) period.setDate(period.getDate() - 1);
  return period.toISOString().slice(0, 10);
}

function nextCircuitUpdateAt(date = new Date()) {
  const parisDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const next = new Date(parisDate);
  next.setHours(3, 0, 0, 0);
  if (parisDate >= next) next.setDate(next.getDate() + 1);
  return next.toISOString();
}

function loadWorldTourDefinitions() {
  if (!fs.existsSync(WORLD_TOUR_CSV)) {
    return [
      { id: "circuit400", week: 1, slot: 1, type: "Circuit 400", level: "Circuit", name: "Blue Lantern Cup", city: "Vancouver", country: "Canada", flag: "🇨🇦", surface: "hard", surfaceLabel: "DUR", difficulty: "normal", targetSets: 2, points: POINT_TABLES[400], directThreshold: DIRECT_THRESHOLDS[400], value: 400 },
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
  const refWeeks = previousCircuitWeeks(week);
  await db.query(`
    WITH week_scores AS (
      SELECT users.id AS user_id,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE circuit_week_scores.week_number = ANY($2::int[])), 0)::int AS score_ref,
        COALESCE(SUM(circuit_week_scores.points) FILTER (WHERE circuit_week_scores.week_number = $3), 0)::int AS score_week,
        COALESCE(SUM(circuit_week_scores.points), 0)::int AS score_total,
        users.account_number
      FROM users
      LEFT JOIN circuit_week_scores
        ON circuit_week_scores.user_id = users.id
        AND circuit_week_scores.season_number = $1
      GROUP BY users.id, users.account_number
    ),
    ranked AS (
      SELECT user_id,
        ROW_NUMBER() OVER (
          ORDER BY score_ref DESC, score_week DESC, score_total DESC, account_number ASC
        ) AS rank
      FROM week_scores
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
  `, [season, refWeeks, week]);
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
    const previous = new Date(`${storedPeriod}T03:00:00+02:00`);
    const current = new Date(`${periodKey}T03:00:00+02:00`);
    const elapsedDays = Math.max(1, Math.round((current - previous) / 86400000));
    for (let index = 0; index < elapsedDays; index += 1) {
      await updateRankingMilestonesForWeek(season, week);
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
  return { weekKey: periodKey, week, season };
}

async function advanceCircuitWeek() {
  const current = await circuitState();
  await updateRankingMilestonesForWeek(current.season, current.week);
  let week = current.week + 1;
  let season = current.season;
  if (week > CIRCUIT_SEASON_LENGTH) {
    week = 1;
    season += 1;
  }
  await setAppStateValue("circuit_week_number", week);
  await setAppStateValue("circuit_season_number", season);
  await setAppStateValue("circuit_period_key", currentWeekKey());
  return { weekKey: currentWeekKey(), week, season };
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

function previousCircuitWeeks(week) {
  return [1, 2, 3, 4].map((offset) => {
    let value = week - offset;
    if (value <= 0) value += CIRCUIT_SEASON_LENGTH;
    return value;
  });
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

async function buildRanking(page = 1, pageSize = 50, currentUser = null) {
  const current = await circuitState();
  const refWeeks = previousCircuitWeeks(current.week);
  if (db) {
    const result = await db.query(`
      WITH week_scores AS (
        SELECT user_id,
          COALESCE(SUM(points) FILTER (WHERE week_number = ANY($2::int[])), 0)::int AS score_ref,
          COALESCE(SUM(points) FILTER (WHERE week_number = $3), 0)::int AS score_week,
          COALESCE(SUM(points), 0)::int AS score_total
        FROM circuit_week_scores
        WHERE season_number = $1
        GROUP BY user_id
      ),
      ranked AS (
        SELECT users.id, users.account_number, users.nickname,
          COALESCE(week_scores.score_ref, 0)::int AS score_ref,
          COALESCE(week_scores.score_week, 0)::int AS score_week,
          COALESCE(week_scores.score_total, 0)::int AS score_total,
          ROW_NUMBER() OVER (
            ORDER BY COALESCE(week_scores.score_ref, 0) DESC,
                     COALESCE(week_scores.score_week, 0) DESC,
                     COALESCE(week_scores.score_total, 0) DESC,
                     users.account_number ASC
          ) AS rank
        FROM users
        LEFT JOIN week_scores ON week_scores.user_id = users.id
      )
      SELECT * FROM ranked
      ORDER BY rank ASC
    `, [current.season, refWeeks, current.week]);
    const rows = result.rows;
    const offset = (page - 1) * pageSize;
    const pageRows = rows.slice(offset, offset + pageSize);
    const currentUserRank = currentUser ? rows.find((row) => row.id === currentUser.id) || null : null;
    return {
      ...current,
      refWeeks,
      page,
      pageSize,
      totalPlayers: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / pageSize)),
      top: pageRows,
      currentUserRank,
    };
  }
  return { ...current, refWeeks, page, pageSize, totalPlayers: 0, totalPages: 1, top: [], currentUserRank: null };
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
  const resultByCompetition = new Map(rows.map((row) => [row.competition_id || row.competitionId, row]));
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
    ranking: fullRanking.currentUserRank,
    circuit: { season: current.season, week: current.week },
    results,
    aiResults,
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
  return COACH_CHARACTER_IDS;
}

function canSelectCharacter(user, characterId) {
  const role = normalizeRole(user?.role);
  if (characterId === "tennisHope") return true;
  if ((role === "admin" || role === "pro_plus") && ALL_PROFILE_CHARACTER_IDS.includes(characterId)) return true;
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

  if (req.method === "GET" && url.pathname === "/api/admin/users") {
    if (!await requireAdmin(req, res)) return true;
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = 50;
    const offset = (page - 1) * pageSize;
    if (db) {
      const [result, countResult] = await Promise.all([
        db.query("SELECT id, account_number, email, nickname, role, pro_code, created_at, last_login_at FROM users ORDER BY account_number ASC LIMIT $1 OFFSET $2", [pageSize, offset]),
        db.query("SELECT COUNT(*)::int AS total FROM users"),
      ]);
      const total = countResult.rows[0]?.total || 0;
      sendJson(res, 200, { users: result.rows.map(publicUser), page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
      return true;
    }
    const allUsers = [...authMemory.users.values()].sort((a, b) => (a.accountNumber || 0) - (b.accountNumber || 0));
    const users = allUsers.slice(offset, offset + pageSize);
    sendJson(res, 200, { users: users.map(publicUser), page, pageSize, total: allUsers.length, totalPages: Math.max(1, Math.ceil(allUsers.length / pageSize)) });
    return true;
  }

  const roleMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/role$/);
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
    const retryInfo = await currentRetryInfo(user.id);
    sendJson(res, 200, {
      ...current,
      scoreKey: circuitScoreKey(current),
      title: "Tennis Courts Pro Circuit",
      competitions: await weeklyCompetitionPayload(),
      nextUpdateAt: nextCircuitUpdateAt(),
      bestScores,
      savedTournamentIds: await currentTournamentSaveIds(user.id),
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
          SET achievement = CASE
              WHEN circuit_tournament_results.achievement = 'winner' THEN 'winner'
              WHEN EXCLUDED.achievement = 'winner' THEN 'winner'
              ELSE EXCLUDED.achievement
            END,
            points = GREATEST(circuit_tournament_results.points, EXCLUDED.points),
            round_reached = EXCLUDED.round_reached,
            last_opponent = EXCLUDED.last_opponent,
            last_score = EXCLUDED.last_score,
            city = EXCLUDED.city,
            country = EXCLUDED.country,
            flag = EXCLUDED.flag,
            updated_at = NOW()
      `, [user.id, current.season, current.week, competitionId, competition.name, competition.type, competition.city, competition.country, competition.flag, achievement, points, roundReached, lastOpponent, lastScore]);
    } else {
      const key = `${user.id}:${scoreKey}:${competitionId}`;
      const previous = authMemory.weeklyScores.get(key)?.points || 0;
      authMemory.weeklyScores.set(key, { points: Math.max(previous, points), achievement, updatedAt: new Date().toISOString() });
      const filtered = authMemory.circuitResults.filter((row) => !(row.userId === user.id && row.season === current.season && row.week === current.week && row.competitionId === competitionId));
      filtered.push({ userId: user.id, season: current.season, week: current.week, competitionId, competitionName: competition.name, competitionType: competition.type, city: competition.city, country: competition.country, flag: competition.flag, achievement, points, roundReached, lastOpponent, lastScore });
      authMemory.circuitResults = filtered;
    }
    await registerCircuitAiResults(user.id, payload.aiResults);
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
    sendJson(res, 200, await buildRanking(page, pageSize, user));
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
      hostSeat === 0 ? { nickname: options.nickname ?? "Coach Ju", characterId: options.characterId ?? "coachJu", joinedAt: Date.now(), isHost: true } : null,
      hostSeat === 1 ? { nickname: options.nickname ?? "Coach Max", characterId: options.characterId ?? "coachMax", joinedAt: Date.now(), isHost: true } : null,
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

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if ((url.pathname.startsWith("/api/auth/") || url.pathname.startsWith("/api/admin/") || url.pathname.startsWith("/api/competitions") || url.pathname === "/api/ranking" || url.pathname.startsWith("/api/profile") || url.pathname.startsWith("/api/profiles/")) && await handleAuth(req, res, url)) {
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/lobby") {
    if (!await requirePro(req, res)) return;
    const openRooms = [...rooms.values()]
      .filter((room) => room.status === "waiting")
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((room) => publicRoomInfo(req, room));
    sendJson(res, 200, { rooms: openRooms });
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
      players: room.players,
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
