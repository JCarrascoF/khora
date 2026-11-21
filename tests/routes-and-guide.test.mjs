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

test('Khōra Usage Guide renders document index with 5 sections and enter/exit navigation in ES & EN', () => {
  const { app, guideView, sandbox } = loadAppHarness({ initialLang: 'es' });

  app.navigate('guide');
  assert.equal(app.currentView, 'guide');
  assert.equal(sandbox.location.hash, 'guide');
  assert.doesNotMatch(guideView.innerHTML, /act-typeform-shell/);
  assert.match(guideView.innerHTML, /study-index-list/);
  assert.match(guideView.innerHTML, /study-index-item/);
  assert.match(guideView.innerHTML, /data-guide-section="now"/);
  assert.match(guideView.innerHTML, /data-guide-section="me"/);
  assert.match(guideView.innerHTML, /data-guide-section="evolution"/);
  assert.match(guideView.innerHTML, /data-guide-section="learn"/);
  assert.match(guideView.innerHTML, /data-guide-section="privacy"/);

  app.guideSection = 'learn';
  app.renderKhoraGuide();
  assert.match(guideView.innerHTML, /study-reading-body/);
  assert.match(guideView.innerHTML, /4\. Aprender: lecturas, introducción a ACT y talleres/);
  assert.match(guideView.innerHTML, /btn-guide-section-back/);

  app.guideSection = null;
  app.renderKhoraGuide();
  assert.match(guideView.innerHTML, /Guía de uso de Khōra/);

  sandbox.i18n.setLang('en');
  app.guideSection = 'privacy';
  app.renderKhoraGuide();
  assert.match(guideView.innerHTML, /5\. Local privacy &amp; backups/);
  assert.match(guideView.innerHTML, /← All sections/);

  app.navigate('guide', { guideSection: null, guideReturnView: 'readings' });
  assert.equal(app.currentGroup, 'learn');
  assert.match(guideView.innerHTML, /← Back to Learn/);
});

test('Learn nav group is separated from Ahora mismo and Home welcome focuses on Khōra guide', () => {
  const { app, homeView } = loadAppHarness({ initialLang: 'es' });
  const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');

  assert.match(html, /data-nav-group="learn"/);
  assert.match(html, /data-view="readings"/);

  app.navigate('readings');
  assert.equal(app.currentGroup, 'learn');

  app.navigate('home');
  assert.match(homeView.innerHTML, /id="btn-open-khora-guide"/);
  assert.doesNotMatch(homeView.innerHTML, /id="btn-read-intro-guide"/);
  assert.doesNotMatch(homeView.innerHTML, /triage-calm-section/);
});

test('HTML and Settings expose English section IDs and Khōra Usage Guide button', () => {
  const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');
  const settingsJs = fs.readFileSync(path.join(ROOT, 'public/js/app-settings.js'), 'utf8');

  for (const id of [
    'home-view',
    'guide-view',
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

  assert.match(settingsJs, /id="btn-settings-khora-guide"/);
  assert.match(settingsJs, /Guía de uso de Khōra/);
});
