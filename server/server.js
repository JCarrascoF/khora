const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const ROOT_DIR = path.join(__dirname, '..');
// En ejecución local (`npm start`), carga `.env` si existe sin sobrescribir variables ya definidas en el entorno (p. ej. Docker).
const ENV_FILE_PATH = path.join(ROOT_DIR, '.env');
if (fs.existsSync(ENV_FILE_PATH)) {
  process.loadEnvFile(ENV_FILE_PATH);
}
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const SQLITE_ENABLED = process.env.ENABLE_SQLITE_DB === 'true';
const DB_PATH = process.env.DB_PATH || path.join(ROOT_DIR, 'data', 'act.db');
const AUTH_USER = (process.env.AUTH_USER || 'admin').trim();
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '';
const AUTH_ENABLED = AUTH_PASSWORD.length > 0;
const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_COOKIE_NAME = 'khora_act_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const ARRAY_KEYS = [
  'pazFalsa',
  'actCrisis',
  'anchors',
  'patterns',
  'compass',
  'hexaflex',
  'deconstruct',
  'pivots',
  'therapyNotes'
];

const SINGLETON_KEYS = [
  'settings',
  'profile',
  'pillFavorites',
  'vaultMeta'
];

const ALL_KEYS = new Set([...ARRAY_KEYS, ...SINGLETON_KEYS]);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function initDatabase(dbFilePath) {
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  const db = new DatabaseSync(dbFilePath);

  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS act_records (
      collection TEXT NOT NULL,
      id TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      timestamp INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (collection, id)
    );
    CREATE INDEX IF NOT EXISTS idx_act_records_col_order
      ON act_records (collection, sort_order ASC);

    CREATE TABLE IF NOT EXISTS act_singletons (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  return db;
}

const db = SQLITE_ENABLED ? initDatabase(DB_PATH) : null;

const stmtSelectRecordsByCol = db ? db.prepare(
  'SELECT data FROM act_records WHERE collection = ? ORDER BY sort_order ASC'
) : null;
const stmtDeleteRecordsByCol = db ? db.prepare(
  'DELETE FROM act_records WHERE collection = ?'
) : null;
const stmtInsertRecord = db ? db.prepare(
  'INSERT INTO act_records (collection, id, sort_order, timestamp, data, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
) : null;
const stmtSelectAllSingletons = db ? db.prepare(
  'SELECT key, data, updated_at FROM act_singletons'
) : null;
const stmtUpsertSingleton = db ? db.prepare(
  `INSERT INTO act_singletons (key, data, updated_at)
   VALUES (?, ?, ?)
   ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
) : null;
const stmtCounts = db ? db.prepare(
  `SELECT
     (SELECT COUNT(*) FROM act_records) AS record_count,
     (SELECT COUNT(*) FROM act_singletons) AS singleton_count,
     MAX(
       COALESCE((SELECT MAX(updated_at) FROM act_records), 0),
       COALESCE((SELECT MAX(updated_at) FROM act_singletons), 0)
     ) AS last_updated`
) : null;
const stmtGroupCounts = db ? db.prepare(
  'SELECT collection, COUNT(*) AS total FROM act_records GROUP BY collection'
) : null;

function saveCollection(collection, items, now) {
  const list = Array.isArray(items) ? items : [];
  stmtDeleteRecordsByCol.run(collection);
  const seenIds = new Set();

  list.forEach((item, index) => {
    let itemId = (item && item.id != null) ? String(item.id) : `${collection}_${index}_${now}`;
    if (seenIds.has(itemId)) {
      itemId = `${itemId}_${index}`;
    }
    seenIds.add(itemId);

    const ts = Number(item && (item.timestamp || item.createdAt || item.date)) || now;
    stmtInsertRecord.run(collection, itemId, index, ts, JSON.stringify(item), now);
  });
}

function saveSingleton(key, value, now) {
  stmtUpsertSingleton.run(key, JSON.stringify(value), now);
}

function withTransaction(fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // Ignore rollback error
    }
    throw err;
  }
}

function readFullState() {
  const countsRow = stmtCounts.get();
  const hasData = (countsRow.record_count + countsRow.singleton_count) > 0;
  const state = {};

  ARRAY_KEYS.forEach((col) => {
    const rows = stmtSelectRecordsByCol.all(col);
    state[col] = rows.map((row) => JSON.parse(row.data));
  });

  const singletonRows = stmtSelectAllSingletons.all();
  singletonRows.forEach((row) => {
    if (SINGLETON_KEYS.includes(row.key)) {
      state[row.key] = JSON.parse(row.data);
    }
  });

  return {
    hasData,
    updatedAt: countsRow.last_updated || null,
    state
  };
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function readRequestBody(req, maxBytes = 10 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);
  });
}

function serveStaticFile(res, pathname) {
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  try {
    reqPath = decodeURIComponent(reqPath);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  if (
    reqPath.startsWith('/data/') ||
    reqPath === '/data' ||
    reqPath.includes('/.') ||
    reqPath.endsWith('.db') ||
    reqPath.endsWith('.sqlite') ||
    reqPath.endsWith('.db-wal') ||
    reqPath.endsWith('.db-shm')
  ) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  const relativePath = reqPath.replace(/^\/+/, '');
  const fullPath = path.resolve(PUBLIC_DIR, relativePath);
  if (fullPath !== PUBLIC_DIR && !fullPath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(fullPath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const noCacheExts = ext === '.html' || ext === '.js' || ext === '.css';
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': noCacheExts ? 'no-store, no-cache, must-revalidate' : 'public, max-age=3600'
    };

    if (SQLITE_ENABLED && reqPath === '/index.html') {
      fs.readFile(fullPath, 'utf8', (readErr, html) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Internal Server Error');
          return;
        }
        const injected = html.includes('name="khora-api"')
          ? html
          : html.replace('</head>', '  <meta name="khora-api" content="1">\n</head>');
        res.writeHead(200, headers);
        res.end(injected);
      });
      return;
    }

    res.writeHead(200, headers);
    fs.createReadStream(fullPath).pipe(res);
  });
}

function safeEqualStr(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a || '')).digest();
  const hashB = crypto.createHash('sha256').update(String(b || '')).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function parseCookies(req) {
  const header = req.headers?.cookie || '';
  const cookies = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  });
  return cookies;
}

function signSessionToken(username) {
  const payload = Buffer.from(JSON.stringify({
    u: username,
    exp: Date.now() + SESSION_TTL_MS
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return null;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  if (!safeEqualStr(sig, expectedSig)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed || !parsed.u || !parsed.exp || Date.now() > Number(parsed.exp)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function getRequestAuth(req) {
  if (!AUTH_ENABLED) {
    return { authRequired: false, authenticated: true, username: null };
  }
  const cookies = parseCookies(req);
  const session = verifySessionToken(cookies[SESSION_COOKIE_NAME]);
  if (!session) {
    return { authRequired: true, authenticated: false, username: null };
  }
  return { authRequired: true, authenticated: true, username: session.u };
}

function buildSessionCookie(token, maxAgeSec) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSec}`
  ];
  return parts.join('; ');
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', 'http://localhost');
  const pathname = parsedUrl.pathname;

  try {
    if (!SQLITE_ENABLED && pathname.startsWith('/api/')) {
      sendJson(res, 404, {
        ok: false,
        sqliteEnabled: false,
        error: 'Persistencia SQLite desactivada en este servidor (modo local en navegador)'
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      if (!AUTH_ENABLED) {
        sendJson(res, 200, { ok: true, authRequired: false, authenticated: true, username: null });
        return;
      }

      const rawBody = await readRequestBody(req);
      let payload;
      try {
        payload = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        sendJson(res, 400, { ok: false, error: 'JSON inválido' });
        return;
      }

      const username = String(payload?.username || '').trim();
      const password = String(payload?.password || '');

      if (!safeEqualStr(username, AUTH_USER) || !safeEqualStr(password, AUTH_PASSWORD)) {
        sendJson(res, 401, { ok: false, error: 'Usuario o contraseña incorrectos' });
        return;
      }

      const token = signSessionToken(AUTH_USER);
      res.setHeader('Set-Cookie', buildSessionCookie(token, Math.floor(SESSION_TTL_MS / 1000)));
      sendJson(res, 200, { ok: true, authRequired: true, authenticated: true, username: AUTH_USER });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      res.setHeader('Set-Cookie', buildSessionCookie('', 0));
      sendJson(res, 200, { ok: true, authRequired: AUTH_ENABLED, authenticated: false });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/auth/status') {
      const auth = getRequestAuth(req);
      sendJson(res, 200, { ok: true, ...auth });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/health') {
      const auth = getRequestAuth(req);
      if (auth.authRequired && !auth.authenticated) {
        sendJson(res, 200, {
          ok: true,
          engine: 'node:sqlite',
          authRequired: true,
          authenticated: false,
          timestamp: Date.now()
        });
        return;
      }

      const countsRow = stmtCounts.get();
      const grouped = {};
      stmtGroupCounts.all().forEach((r) => {
        grouped[r.collection] = r.total;
      });
      sendJson(res, 200, {
        ok: true,
        engine: 'node:sqlite',
        dbPath: DB_PATH,
        authRequired: auth.authRequired,
        authenticated: auth.authenticated,
        username: auth.username,
        hasData: (countsRow.record_count + countsRow.singleton_count) > 0,
        counts: {
          totalRecords: countsRow.record_count,
          totalSingletons: countsRow.singleton_count,
          collections: grouped
        },
        timestamp: Date.now()
      });
      return;
    }

    if (pathname.startsWith('/api/')) {
      const auth = getRequestAuth(req);
      if (auth.authRequired && !auth.authenticated) {
        sendJson(res, 401, { ok: false, error: 'Autenticación requerida', authRequired: true });
        return;
      }
    }

    if (req.method === 'GET' && pathname === '/api/state') {
      const { hasData, updatedAt, state } = readFullState();
      sendJson(res, 200, {
        ok: true,
        meta: { hasData, updatedAt },
        state
      });
      return;
    }

    if (req.method === 'PUT' && pathname === '/api/state') {
      const rawBody = await readRequestBody(req);
      let payload;
      try {
        payload = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        sendJson(res, 400, { ok: false, error: 'JSON inválido' });
        return;
      }

      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        sendJson(res, 400, { ok: false, error: 'El cuerpo debe ser un objeto JSON' });
        return;
      }

      const validateCollectionValue = (key, value) => {
        if (ARRAY_KEYS.includes(key)) {
          return Array.isArray(value) ? null : `La colección "${key}" debe ser un array`;
        }
        return value && typeof value === 'object' && !Array.isArray(value)
          ? null
          : `La clave "${key}" debe ser un objeto JSON`;
      };

      for (const col of ARRAY_KEYS) {
        if (Object.prototype.hasOwnProperty.call(payload, col)) {
          const errMsg = validateCollectionValue(col, payload[col]);
          if (errMsg) {
            sendJson(res, 400, { ok: false, error: errMsg });
            return;
          }
        }
      }
      for (const key of SINGLETON_KEYS) {
        if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key] !== undefined) {
          const errMsg = validateCollectionValue(key, payload[key]);
          if (errMsg) {
            sendJson(res, 400, { ok: false, error: errMsg });
            return;
          }
        }
      }

      const now = Date.now();
      withTransaction(() => {
        ARRAY_KEYS.forEach((col) => {
          if (Object.prototype.hasOwnProperty.call(payload, col)) {
            saveCollection(col, payload[col], now);
          }
        });
        SINGLETON_KEYS.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key] !== undefined) {
            saveSingleton(key, payload[key], now);
          }
        });
      });

      sendJson(res, 200, { ok: true, updatedAt: now });
      return;
    }

    if (req.method === 'PUT' && pathname.startsWith('/api/state/')) {
      const key = pathname.slice('/api/state/'.length);
      if (!ALL_KEYS.has(key)) {
        sendJson(res, 400, { ok: false, error: `Clave no permitida: ${key}` });
        return;
      }

      const rawBody = await readRequestBody(req);
      let payload;
      try {
        payload = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        sendJson(res, 400, { ok: false, error: 'JSON inválido' });
        return;
      }

      const value = (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'data'))
        ? payload.data
        : payload;

      if (ARRAY_KEYS.includes(key) && !Array.isArray(value)) {
        sendJson(res, 400, { ok: false, error: `La colección "${key}" debe ser un array` });
        return;
      }
      if (!ARRAY_KEYS.includes(key) && (!value || typeof value !== 'object' || Array.isArray(value))) {
        sendJson(res, 400, { ok: false, error: `La clave "${key}" debe ser un objeto JSON` });
        return;
      }

      const now = Date.now();
      withTransaction(() => {
        if (ARRAY_KEYS.includes(key)) {
          saveCollection(key, value, now);
        } else {
          saveSingleton(key, value, now);
        }
      });

      sendJson(res, 200, { ok: true, key, updatedAt: now });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/backup/db') {
      db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
      const dateStr = new Date().toISOString().slice(0, 10);
      const stat = fs.statSync(DB_PATH);
      res.writeHead(200, {
        'Content-Type': 'application/x-sqlite3',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="khora_act_${dateStr}.sqlite"`,
        'Cache-Control': 'no-store'
      });
      fs.createReadStream(DB_PATH).pipe(res);
      return;
    }

    if (pathname.startsWith('/api/')) {
      sendJson(res, 404, { ok: false, error: 'Endpoint no encontrado' });
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Method Not Allowed');
      return;
    }

    serveStaticFile(res, pathname);
  } catch (err) {
    if (err && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, { ok: false, error: 'Payload demasiado grande' });
      return;
    }
    console.error('[Khora Server Error]', err);
    sendJson(res, 500, { ok: false, error: 'Error interno del servidor' });
  }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`[Khora] Servidor activo en http://${HOST}:${PORT} (${SQLITE_ENABLED ? `SQLite: ${DB_PATH}` : 'Modo estático / local en navegador'})`);
  });

  const shutdown = () => {
    server.close(() => {
      try {
        if (db) db.close();
      } catch {
        // Ignore close error
      }
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = { server, db, initDatabase };
