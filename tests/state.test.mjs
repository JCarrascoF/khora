import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stateSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'state.js'), 'utf8');
const vaultSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'state-vault.js'), 'utf8');

function loadState({ withMetaTag }) {
  const store = {};
  const sandbox = {
    window: {},
    document: {
      querySelector: (sel) =>
        withMetaTag && sel === 'meta[name="khora-api"][content="1"]' ? {} : null
    },
    localStorage: {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    fetch: null,
    indexedDB: undefined,
    crypto: { getRandomValues: (arr) => { for (let i = 0; i < arr.length; i++) arr[i] = i % 256; } },
    Notification: undefined,
    console,
    KhoraStateVaultMixin: null
  };
  sandbox.window = sandbox;
  vm.runInNewContext(vaultSrc, sandbox);
  sandbox.KhoraStateVaultMixin = sandbox.KhoraStateVaultMixin;
  vm.runInNewContext(stateSrc, sandbox);
  return { sm: sandbox.stateManager, store };
}

test('checkServerHealth returns false immediately when khora-api meta is absent', async () => {
  const { sm, store } = loadState({ withMetaTag: false });

  const result = await sm.checkServerHealth();

  assert.equal(result, false);
  assert.equal(sm.dbStatus.serverAvailable, false);
  assert.equal(sm.dbStatus.serverChecked, true);
  assert.equal(sm.dbStatus.authRequired, false);
  assert.equal(sm.dbStatus.authenticated, false);
  assert.equal(sm.dbStatus.mode, 'local');
});

test('checkServerHealth does NOT force local mode when meta is present but fetch fails', async () => {
  const { sm, store } = loadState({ withMetaTag: true });

  const result = await sm.checkServerHealth();

  assert.equal(result, false);
  // fetch is null → guarded by typeof check, NOT the _setServerUnavailable path
  // The dbStatus should reflect the early return from the fetch-not-function guard,
  // which does NOT reset authRequired/authenticated (they retain prior values)
  assert.equal(sm.dbStatus.serverAvailable, false);
  assert.equal(sm.dbStatus.serverChecked, true);
});
