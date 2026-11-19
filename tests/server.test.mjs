import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
    const res = {
      statusCode: 200,
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
      },
      getHeader(name) {
        return resHeaders[name.toLowerCase()];
      },
      writeHead(code, hdrs = {}) {
        this.statusCode = code;
        for (const [k, v] of Object.entries(hdrs)) {
          resHeaders[k.toLowerCase()] = v;
        }
      },
      write(chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return true;
      },
      end(chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve({
          status: this.statusCode,
          headers: resHeaders,
          body: raw,
          json() {
            return JSON.parse(raw);
          }
        });
      }
    };

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

  // 4. PUT /api/state and GET /api/state round-trip
  const putRes = await invokeServer(server, {
    method: 'PUT',
    url: '/api/state',
    headers: {
      'content-type': 'application/json',
      cookie: cookiePair
    },
    body: {
      settings: { palette: 'musgo', theme: 'dark' },
      anchors: [{ id: 'a1', text: 'Respirar' }]
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
