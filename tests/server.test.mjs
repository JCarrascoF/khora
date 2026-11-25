import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { PassThrough } from 'node:stream';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function invokeServer(server, { method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const req = new PassThrough();
    req.method = method;
    req.url = url;
    req.headers = { host: 'localhost', ...headers };
    req.socket = { remoteAddress: '127.0.0.1' };

    const chunks = [];
    const resHeaders = {};
    const res = new PassThrough();
    res.statusCode = 200;
    res.setHeader = function (name, value) {
      resHeaders[name.toLowerCase()] = value;
    };
    res.getHeader = function (name) {
      return resHeaders[name.toLowerCase()];
    };
    res.writeHead = function (code, hdrs = {}) {
      this.statusCode = code;
      for (const [k, v] of Object.entries(hdrs)) {
        resHeaders[k.toLowerCase()] = v;
      }
    };
    res.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    res.on('finish', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      resolve({
        status: res.statusCode,
        headers: resHeaders,
        body: raw,
        json() {
          return JSON.parse(raw);
        }
      });
    });

    server.emit('request', req, res);

    queueMicrotask(() => {
      try {
        if (body !== null) {
          const payload = typeof body === 'string' ? body : JSON.stringify(body);
          req.write(payload);
        }
        req.end();
      } catch (err) {
        reject(err);
      }
    });
  });
}

test('server.js enforces auth, serves health, and persists state in SQLite', async (t) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'khora-server-test-'));
  const dbPath = path.join(tmpDir, 'test.db');

  process.env.ENABLE_SQLITE_DB = 'true';
  process.env.DB_PATH = dbPath;
  process.env.AUTH_PASSWORD = 'test-secret-password';
  process.env.AUTH_SECRET = 'test-hmac-secret-0123456789abcdef';

  const { server, db } = require('../server/server.js');

  t.after(() => {
    try {
      if (db) db.close();
    } catch {
      // ignore
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // 1. Health endpoint
  const healthRes = await invokeServer(server, { method: 'GET', url: '/api/health' });
  assert.equal(healthRes.status, 200);
  const healthJson = healthRes.json();
  assert.equal(healthJson.ok, true);
  assert.equal(healthJson.engine, 'node:sqlite');
  assert.equal(healthJson.authRequired, true);
  assert.equal(healthJson.authenticated, false);

  // 2. Protected endpoint rejects unauthenticated requests
  const unauthRes = await invokeServer(server, { method: 'GET', url: '/api/state' });
  assert.equal(unauthRes.status, 401);

  // 3. Login returns session cookie
  const loginRes = await invokeServer(server, {
    method: 'POST',
    url: '/api/auth/login',
    headers: { 'content-type': 'application/json' },
    body: { username: 'admin', password: 'test-secret-password' }
  });
  assert.equal(loginRes.status, 200);
  const setCookie = loginRes.headers['set-cookie'];
  const cookieHeader = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  assert.ok(cookieHeader && cookieHeader.includes('khora_act_session='), 'Expected session cookie');
  const cookiePair = cookieHeader.split(';')[0];

  // 4. PUT /api/state and GET /api/state round-trip (including array pillFavorites)
  const putRes = await invokeServer(server, {
    method: 'PUT',
    url: '/api/state',
    headers: {
      'content-type': 'application/json',
      cookie: cookiePair
    },
    body: {
      settings: { palette: 'musgo', theme: 'dark' },
      anchors: [{ id: 'a1', text: 'Respirar' }],
      pillFavorites: ['pill_1', 'pill_2', 'a1', 'demo_anc_1']
    }
  });
  assert.equal(putRes.status, 200);

  const getRes = await invokeServer(server, {
    method: 'GET',
    url: '/api/state',
    headers: { cookie: cookiePair }
  });
  assert.equal(getRes.status, 200);
  const stateJson = getRes.json();
  assert.equal(stateJson.ok, true);
  assert.equal(stateJson.state.settings.palette, 'musgo');
  assert.equal(stateJson.state.anchors[0].text, 'Respirar');
  assert.deepEqual(stateJson.state.pillFavorites, ['pill_1', 'pill_2', 'a1', 'demo_anc_1']);

  // 4b. PUT /api/state/pillFavorites accepts plain array
  const putFavRes = await invokeServer(server, {
    method: 'PUT',
    url: '/api/state/pillFavorites',
    headers: {
      'content-type': 'application/json',
      cookie: cookiePair
    },
    body: { data: ['pill_1', 'a1'] }
  });
  assert.equal(putFavRes.status, 200);
  const getAfterFavRes = await invokeServer(server, {
    method: 'GET',
    url: '/api/state',
    headers: { cookie: cookiePair }
  });
  assert.equal(getAfterFavRes.status, 200);
  assert.deepEqual(getAfterFavRes.json().state.pillFavorites, ['pill_1', 'a1']);

  // 5. Invalid collection/payload returns 400
  const badPutRes = await invokeServer(server, {
    method: 'PUT',
    url: '/api/state/anchors',
    headers: {
      'content-type': 'application/json',
      cookie: cookiePair
    },
    body: { data: 'not-an-array' }
  });
  assert.equal(badPutRes.status, 400);

  // 6. Root HTML injects khora-api meta when SQLite is enabled
  const htmlRes = await invokeServer(server, { method: 'GET', url: '/' });
  assert.equal(htmlRes.status, 200);
  assert.ok(htmlRes.body.includes('<meta name="khora-api" content="1">'), 'Expected khora-api meta tag in HTML');
});

test('server.js with NO_CACHE=true disables caching on all assets and injects khora-no-sw', async (t) => {
  const prevNoCache = process.env.NO_CACHE;
  const prevSqlite = process.env.ENABLE_SQLITE_DB;
  const serverPath = require.resolve('../server/server.js');
  delete require.cache[serverPath];

  process.env.NO_CACHE = 'true';
  process.env.ENABLE_SQLITE_DB = 'false';

  const { server } = require('../server/server.js');

  t.after(() => {
    delete require.cache[serverPath];
    if (prevNoCache === undefined) delete process.env.NO_CACHE;
    else process.env.NO_CACHE = prevNoCache;
    if (prevSqlite === undefined) delete process.env.ENABLE_SQLITE_DB;
    else process.env.ENABLE_SQLITE_DB = prevSqlite;
  });

  const htmlRes = await invokeServer(server, { method: 'GET', url: '/' });
  assert.equal(htmlRes.status, 200);
  assert.ok(htmlRes.headers['cache-control'].includes('no-store'));
  assert.equal(htmlRes.headers['pragma'], 'no-cache');
  assert.equal(htmlRes.headers['expires'], '0');
  assert.ok(htmlRes.body.includes('<meta name="khora-no-sw" content="1">'), 'Expected khora-no-sw meta tag in HTML');

  const manifestRes = await invokeServer(server, { method: 'GET', url: '/manifest.json' });
  assert.equal(manifestRes.status, 200);
  assert.ok(manifestRes.headers['cache-control'].includes('no-store'));
  assert.equal(manifestRes.headers['pragma'], 'no-cache');
  assert.equal(manifestRes.headers['expires'], '0');
});

test('server.js with NO_CACHE=true streams SSE on /__dev/events', async (t) => {
  const prevNoCache = process.env.NO_CACHE;
  const prevSqlite = process.env.ENABLE_SQLITE_DB;
  const serverPath = require.resolve('../server/server.js');
  delete require.cache[serverPath];

  process.env.NO_CACHE = 'true';
  process.env.ENABLE_SQLITE_DB = 'false';

  const { server } = require('../server/server.js');

  t.after(() => {
    delete require.cache[serverPath];
    if (prevNoCache === undefined) delete process.env.NO_CACHE;
    else process.env.NO_CACHE = prevNoCache;
    if (prevSqlite === undefined) delete process.env.ENABLE_SQLITE_DB;
    else process.env.ENABLE_SQLITE_DB = prevSqlite;
  });

  // Use a real HTTP server + socket to test the SSE streaming endpoint.
  const port = 0;
  const realServer = server.listen(port, '127.0.0.1');
  await new Promise(resolve => realServer.once('listening', resolve));
  const url = `http://127.0.0.1:${realServer.address().port}/__dev/events`;

  const sseResult = await new Promise((resolve, reject) => {
    let settled = false;
    const respond = (res, body) => {
      if (settled) return;
      settled = true;
      resolve({ status: res.statusCode, headers: res.headers, body });
    };
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { respond(res, data); req.destroy(); });
      // Give the SSE stream a moment to send the handshake, then abort.
      setTimeout(() => { respond(res, data); req.destroy(); }, 200);
    });
    req.on('error', (err) => {
      if (err.code === 'ECONNRESET') return; // expected after req.destroy()
      reject(new Error('SSE connection error: ' + err.message));
    });
  }).catch(err => { realServer.close(); throw err; });

  realServer.close();

  assert.equal(sseResult.status, 200);
  assert.equal(sseResult.headers['content-type'], 'text/event-stream; charset=utf-8');
  assert.equal(sseResult.headers['cache-control'], 'no-cache, no-transform');
  assert.ok(sseResult.body.includes(': connected'), 'SSE handshake message should be sent on connect');
});

test('server.js without NO_CACHE returns 404 for /__dev/events', async (t) => {
  const prevNoCache = process.env.NO_CACHE;
  const prevSqlite = process.env.ENABLE_SQLITE_DB;
  const serverPath = require.resolve('../server/server.js');
  delete require.cache[serverPath];

  delete process.env.NO_CACHE;
  process.env.ENABLE_SQLITE_DB = 'false';

  const { server } = require('../server/server.js');

  t.after(() => {
    delete require.cache[serverPath];
    if (prevNoCache === undefined) delete process.env.NO_CACHE;
    else process.env.NO_CACHE = prevNoCache;
    if (prevSqlite === undefined) delete process.env.ENABLE_SQLITE_DB;
    else process.env.ENABLE_SQLITE_DB = prevSqlite;
  });

  const sseRes = await invokeServer(server, { method: 'GET', url: '/__dev/events' });
  assert.equal(sseRes.status, 404);
});
