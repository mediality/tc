const http = require("http");
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
const USER_ROLES = new Set(["free", "pro", "admin"]);
const COMPETITION_DEFINITIONS = [
  { id: "minor400", name: "Minor 400", difficulty: "normal", points: { qualif: 0, quarter: 50, semi: 100, finalist: 200, winner: 400 }, directThreshold: 500 },
  { id: "minor600", name: "Minor 600", difficulty: "champion", points: { qualif: 0, quarter: 75, semi: 150, finalist: 300, winner: 600 }, directThreshold: 700 },
  { id: "major1000", name: "Major 1000", difficulty: "normal", points: { qualif: 0, quarter: 100, semi: 200, finalist: 500, winner: 1000 }, directThreshold: 1200 },
  { id: "major1500", name: "Major 1500", difficulty: "champion", points: { qualif: 0, quarter: 150, semi: 350, finalist: 750, winner: 1500 }, directThreshold: 1800 },
  { id: "slam2000", name: "Slam 2000", difficulty: "champion", points: { qualif: 0, quarter: 200, semi: 500, finalist: 1200, winner: 2000 }, directThreshold: 2500 },
];
const SURFACES = ["grass", "hard", "clay"];
const SURFACE_LABELS = { grass: "HERBE", hard: "DUR", clay: "TERRE-BATTUE" };
const authMemory = {
  users: new Map(),
  sessions: new Map(),
  weeklyScores: new Map(),
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

function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();
  return USER_ROLES.has(value) ? value : "free";
}

function defaultRoleForEmail(email) {
  return normalizeEmail(email) === ADMIN_EMAIL ? "admin" : "free";
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
    createdAt: user.created_at || user.createdAt,
  } : null;
}

function currentWeekKey(date = new Date()) {
  const parisDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const reset = new Date(parisDate);
  reset.setHours(3, 0, 0, 0);
  if (parisDate < reset) reset.setDate(reset.getDate() - 1);
  return reset.toISOString().slice(0, 10);
}

function seededNumber(seed) {
  const hash = crypto.createHash("sha256").update(seed).digest();
  return hash.readUInt32BE(0) / 0xffffffff;
}

function weeklyCompetitionPayload(weekKey = currentWeekKey()) {
  return COMPETITION_DEFINITIONS.map((competition, index) => {
    const surface = SURFACES[Math.floor(seededNumber(`${weekKey}:${competition.id}:surface`) * SURFACES.length)] || SURFACES[index % SURFACES.length];
    return {
      ...competition,
      weekKey,
      surface,
      surfaceLabel: SURFACE_LABELS[surface],
    };
  });
}

function competitionDefinitionById(competitionId) {
  return COMPETITION_DEFINITIONS.find((competition) => competition.id === competitionId) || null;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 32, "sha256").toString("base64url");
  return `pbkdf2:${PASSWORD_ITERATIONS}:${salt}:${hash}`;
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
  await db.query("CREATE SEQUENCE IF NOT EXISTS users_account_number_seq START WITH 1");
  await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS account_number BIGINT");
  await db.query("UPDATE users SET account_number = nextval('users_account_number_seq') WHERE account_number IS NULL");
  await db.query("SELECT setval('users_account_number_seq', GREATEST((SELECT COALESCE(MAX(account_number), 0) FROM users), 1))");
  await db.query("ALTER TABLE users ALTER COLUMN account_number SET DEFAULT nextval('users_account_number_seq')");
  await db.query("ALTER TABLE users ALTER COLUMN account_number SET NOT NULL");
  await db.query("CREATE UNIQUE INDEX IF NOT EXISTS users_account_number_idx ON users(account_number)");
  await db.query("UPDATE users SET role = 'admin' WHERE email = $1", [ADMIN_EMAIL]);
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

async function findUserByEmail(email) {
  if (db) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }
  return [...authMemory.users.values()].find((user) => user.email === email) || null;
}

async function createUser({ email, nickname, password }) {
  const user = {
    id: crypto.randomUUID(),
    email,
    nickname,
    password_hash: hashPassword(password),
    role: defaultRoleForEmail(email),
    createdAt: new Date().toISOString(),
  };
  if (db) {
    const result = await db.query(
      "INSERT INTO users (id, email, nickname, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user.id, user.email, user.nickname, user.password_hash, user.role],
    );
    const created = result.rows[0];
    const duplicates = await db.query("SELECT COUNT(*)::int AS count FROM users WHERE LOWER(nickname) = LOWER($1)", [created.nickname]);
    if (duplicates.rows[0]?.count > 1) {
      const updated = await db.query("UPDATE users SET nickname = $1 WHERE id = $2 RETURNING *", [`${created.nickname} #${created.account_number}`, created.id]);
      return updated.rows[0];
    }
    return created;
  }
  const duplicateCount = [...authMemory.users.values()].filter((item) => item.nickname.toLowerCase() === user.nickname.toLowerCase()).length;
  user.accountNumber = authMemory.users.size + 1;
  if (duplicateCount > 0) user.nickname = `${user.nickname} #${user.accountNumber}`;
  authMemory.users.set(user.id, user);
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
  if (!user || !["pro", "admin"].includes(normalizeRole(user.role))) {
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
    const nickname = normalizeNickname(payload.nickname);
    const password = String(payload.password || "");
    if (!isValidEmail(email)) {
      sendJson(res, 400, { error: "Adresse email invalide." });
      return true;
    }
    if (nickname.length < 3) {
      sendJson(res, 400, { error: "Le pseudo doit contenir au moins 3 caractères." });
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
    const user = await createUser({ email, nickname, password });
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

  if (req.method === "GET" && url.pathname === "/api/admin/users") {
    if (!await requireAdmin(req, res)) return true;
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = 50;
    const offset = (page - 1) * pageSize;
    if (db) {
      const [result, countResult] = await Promise.all([
        db.query("SELECT id, account_number, email, nickname, role, created_at, last_login_at FROM users ORDER BY account_number ASC LIMIT $1 OFFSET $2", [pageSize, offset]),
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
    if (db) {
      const result = await db.query(
        "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, account_number, email, nickname, role, created_at, last_login_at",
        [role, userId],
      );
      if (!result.rows[0]) {
        sendJson(res, 404, { error: "Utilisateur introuvable." });
        return true;
      }
      sendJson(res, 200, { user: publicUser(result.rows[0]) });
      return true;
    }
    const user = authMemory.users.get(userId);
    if (!user) {
      sendJson(res, 404, { error: "Utilisateur introuvable." });
      return true;
    }
    user.role = role;
    sendJson(res, 200, { user: publicUser(user) });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/competitions") {
    const user = await requirePro(req, res);
    if (!user) return true;
    const weekKey = currentWeekKey();
    let bestScores = {};
    if (user && db) {
      const result = await db.query("SELECT competition_id, points FROM weekly_competition_scores WHERE user_id = $1 AND week_key = $2", [user.id, weekKey]);
      bestScores = Object.fromEntries(result.rows.map((row) => [row.competition_id, row.points]));
    } else if (user) {
      bestScores = Object.fromEntries([...authMemory.weeklyScores.entries()]
        .filter(([key]) => key.startsWith(`${user.id}:${weekKey}:`))
        .map(([key, value]) => [key.split(":").pop(), value.points]));
    }
    sendJson(res, 200, { weekKey, competitions: weeklyCompetitionPayload(weekKey), bestScores });
    return true;
  }

  const scoreMatch = url.pathname.match(/^\/api\/competitions\/([^/]+)\/score$/);
  if (req.method === "POST" && scoreMatch) {
    const user = await requirePro(req, res);
    if (!user) return true;
    const competitionId = decodeURIComponent(scoreMatch[1]);
    const competition = competitionDefinitionById(competitionId);
    if (!competition) {
      sendJson(res, 404, { error: "Tournoi introuvable." });
      return true;
    }
    const payload = await readJson(req);
    const maxPoints = Math.max(...Object.values(competition.points)) + 500;
    const points = Math.max(0, Math.min(maxPoints, Number(payload.points || 0)));
    const achievement = String(payload.achievement || "").slice(0, 32);
    const weekKey = currentWeekKey();
    if (db) {
      await db.query(`
        INSERT INTO weekly_competition_scores (user_id, week_key, competition_id, points, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, week_key, competition_id) DO UPDATE
          SET points = GREATEST(weekly_competition_scores.points, EXCLUDED.points),
              updated_at = CASE WHEN EXCLUDED.points > weekly_competition_scores.points THEN NOW() ELSE weekly_competition_scores.updated_at END
      `, [user.id, weekKey, competitionId, points]);
    } else {
      const key = `${user.id}:${weekKey}:${competitionId}`;
      const previous = authMemory.weeklyScores.get(key)?.points || 0;
      authMemory.weeklyScores.set(key, { points: Math.max(previous, points), achievement, updatedAt: new Date().toISOString() });
    }
    sendJson(res, 200, { ok: true, weekKey, competitionId, points });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/ranking") {
    const user = await currentUser(req);
    const weekKey = currentWeekKey();
    if (db) {
      const ranking = await db.query(`
        WITH current_scores AS (
          SELECT user_id, COALESCE(SUM(points), 0)::int AS current_points
          FROM weekly_competition_scores
          WHERE week_key = $1
          GROUP BY user_id
        )
        SELECT users.id, users.account_number, users.nickname, COALESCE(weekly_rankings.ranking_points, 0)::int AS ranking_points,
               COALESCE(current_scores.current_points, 0)::int AS current_points
        FROM users
        LEFT JOIN weekly_rankings ON weekly_rankings.user_id = users.id
        LEFT JOIN current_scores ON current_scores.user_id = users.id
        ORDER BY ranking_points DESC, current_points DESC, users.account_number ASC
      `, [weekKey]);
      let currentUserRank = null;
      if (user) {
        const rankResult = await db.query(`
          WITH current_scores AS (
            SELECT user_id, COALESCE(SUM(points), 0)::int AS current_points
            FROM weekly_competition_scores
            WHERE week_key = $1
            GROUP BY user_id
          ),
          ranked AS (
            SELECT users.id, users.account_number, users.nickname,
                   COALESCE(weekly_rankings.ranking_points, 0)::int AS ranking_points,
                   COALESCE(current_scores.current_points, 0)::int AS current_points,
                   ROW_NUMBER() OVER (ORDER BY COALESCE(weekly_rankings.ranking_points, 0) DESC, COALESCE(current_scores.current_points, 0) DESC, users.account_number ASC) AS rank
            FROM users
            LEFT JOIN weekly_rankings ON weekly_rankings.user_id = users.id
            LEFT JOIN current_scores ON current_scores.user_id = users.id
          )
          SELECT * FROM ranked WHERE id = $2
        `, [weekKey, user.id]);
        currentUserRank = rankResult.rows[0] || null;
      }
      sendJson(res, 200, { weekKey, top: ranking.rows, currentUserRank });
      return true;
    }
    sendJson(res, 200, { weekKey, top: [], currentUserRank: null });
    return true;
  }

  return false;
}

function normalizeCharacterId(characterId, fallback = "coachJu") {
  return COACH_IDS.has(characterId) ? characterId : fallback;
}

function publicBaseUrl(req) {
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

  if ((url.pathname.startsWith("/api/auth/") || url.pathname.startsWith("/api/admin/") || url.pathname.startsWith("/api/competitions") || url.pathname === "/api/ranking") && await handleAuth(req, res, url)) {
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
