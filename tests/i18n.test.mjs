import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const i18nDictSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n-dict.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n.js'), 'utf8');

function loadI18n() {
  const noop = () => {};
  const sandbox = {
    window: {},
    localStorage: { getItem: () => 'en', setItem: noop },
    document: {
      documentElement: { lang: 'en', setAttribute: noop },
      querySelectorAll: () => [],
      getElementById: () => null,
      addEventListener: noop,
      body: null
    },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    setTimeout,
    clearTimeout,
    console
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(i18nDictSrc, sandbox);
  vm.runInNewContext(i18nSrc, sandbox);
  return sandbox.i18n;
}

test('i18n dictionary exposes non-empty EN translations and restyling UI keys', () => {
  const i18n = loadI18n();
  assert.ok(i18n, 'window.i18n should be initialized');
  i18n.lang = 'en';

  const requiredKeys = [
    'Nueva versión de Khōra disponible',
    'Actualizar',
    'Actualizando…',
    'Más tarde',
    'Configuración: paleta, tema, idioma y copias de seguridad',
    '🔒 Iniciar sesión en Khōra'
  ];

  for (const key of requiredKeys) {
    const translated = i18n.t(key);
    assert.ok(translated && translated !== key, `Missing EN translation for: ${key}`);
  }
});
