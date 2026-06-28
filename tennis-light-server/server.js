const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const rooms = new Map();

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

function publicBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

function playerUrl(req, roomId, seat, token) {
  return `${publicBaseUrl(req)}/?room=${encodeURIComponent(roomId)}&seat=${seat}&token=${encodeURIComponent(token)}`;
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
      if (body.length > 2_000_000) {
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

function createRoom(req) {
  let roomId = makeId(3);
  while (rooms.has(roomId)) roomId = makeId(3);
  const tokens = [makeToken(), makeToken()];
  const room = {
    id: roomId,
    tokens,
    state: null,
    revision: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  rooms.set(roomId, room);
  return {
    room,
    coachJuUrl: playerUrl(req, roomId, 0, tokens[0]),
    coachMaxUrl: playerUrl(req, roomId, 1, tokens[1]),
  };
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

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/rooms") {
    const { room, coachJuUrl, coachMaxUrl } = createRoom(req);
    sendJson(res, 201, { roomId: room.id, coachJuUrl, coachMaxUrl });
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
    room.revision += 1;
    room.updatedAt = Date.now();
    sendJson(res, 200, {
      ok: true,
      roomId: room.id,
      seat,
      revision: room.revision,
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

server.listen(PORT, () => {
  console.log(`Tennis Courts Light server running on http://localhost:${PORT}`);
  console.log(`Create a remote test room at http://localhost:${PORT}/new-room`);
});
