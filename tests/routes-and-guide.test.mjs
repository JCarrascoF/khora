import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function createElementStub(id = '') {
  const listeners = new Map();
  let html = '';
  return {
    id,
    classList: {
      add() {},
      remove() {},
      contains() { return false; }
    },
    dataset: {},
    setAttribute() {},
    getAttribute() { return null; },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    click() {
      (listeners.get('click') || []).forEach((fn) => fn({ currentTarget: this, target: this, preventDefault() {}, stopPropagation() {} }));
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    get innerHTML() { return html; },
    set innerHTML(val) { html = String(val || ''); }
  };
}

function loadAppHarness({ initialLang = 'es' } = {}) {
  const homeView = createElementStub('home-view');
  const guideView = createElementStub('guide-view');
  const modal = createElementStub('app-modal');
  const modalBody = createElementStub('modal-body');
  const sections = new Map([
    ['home-view', homeView],
    ['guide-view', guideView],
    ['profile-view', createElementStub('profile-view')],
    ['false-peace-view', createElementStub('false-peace-view')],
    ['act-space-view', createElementStub('act-space-view')],
    ['patterns-view', createElementStub('patterns-view')],
    ['compass-view', createElementStub('compass-view')],
    ['pills-anchors-view', createElementStub('pills-anchors-view')],
    ['insight-view', createElementStub('insight-view')]
  ]);

  const store = { act_lang_pref: initialLang };
  const noop = () => {};

  const sandbox = {
    scrollTo: noop,
    KhoraAppSettingsMixin: {},
    KhoraAppHelpMixin: {},
    window: {},
    location: { hash: '' },
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    NodeFilter: { SHOW_TEXT: 4 },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    document: {
      documentElement: { lang: initialLang, setAttribute: noop, getAttribute: () => null },
      body: createElementStub('body'),
      addEventListener: noop,
      createTreeWalker: () => ({ nextNode: () => null }),
      getElementById(id) {
        if (id === 'app-modal') return modal;
        if (id === 'modal-body') return modalBody;
        if (sections.has(id)) return sections.get(id);
        return null;
      },
      querySelector: () => null,
      querySelectorAll: () => []
    },
    stateManager: {
      getSettings: () => ({}),
      getDbStatus: () => ({ mode: 'local' }),
      getStorageMode: () => 'local',
      subscribe: noop,
      isVaultLocked: () => false
    },
    navigator: { vibrate: noop },
    setTimeout,
    clearTimeout,
    matchMedia: () => ({ matches: false }),
    console
  };

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  for (const rel of [
    'public/js/utils.js',
    'public/js/i18n-dict.js',
    'public/js/i18n.js',
    'public/js/app.js'
  ]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { filename: rel });
  }

  const app = vm.runInContext('new AppController()', sandbox);
  sandbox.app = app;
  sandbox.i18n.init();
  return { app, sandbox, homeView, guideView };
}

test('AppController resolves English routes and backward-compatible Spanish aliases', () => {
  const { app, sandbox } = loadAppHarness();

  const aliasPairs = [
    ['guia-inicio', 'home'],
    ['espacio-act', 'act-space'],
    ['pildoras-trucos', 'toolkit'],
    ['pildoras-estudio', 'readings'],
    ['perfil-valores', 'values'],
    ['perfil-autobus', 'bus'],
    ['perfil-anclajes', 'anchors'],
    ['paz-falsa', 'false-peace'],
    ['brujula-valores', 'compass'],
    ['radar-patrones', 'patterns'],
    ['insight-terapia', 'therapy'],
    ['insight-historial', 'history'],
    ['insight-graficos', 'charts'],
    ['insight-actividad', 'activity']
  ];

  for (const [legacy, canonical] of aliasPairs) {
    assert.equal(app.resolveViewAlias(legacy), canonical);
    app.navigate(legacy);
    assert.equal(app.currentView, canonical);
    assert.equal(sandbox.location.hash, canonical);
  }
});

test('HTML exposes English section IDs', () => {
  const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');

  for (const id of [
    'home-view',
    'profile-view',
    'false-peace-view',
    'act-space-view',
    'patterns-view',
    'compass-view',
    'pills-anchors-view',
    'insight-view'
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});
