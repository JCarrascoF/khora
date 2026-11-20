import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pillsAnchorsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'subapp-pills-anchors.js'), 'utf8');
const appJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app.js'), 'utf8');
const helpJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app-help.js'), 'utf8');
const i18nDictSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n-dict.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n.js'), 'utf8');
const surfacesCss = fs.readFileSync(path.join(ROOT_DIR, 'public', 'css', 'surfaces.css'), 'utf8');

function extractAttrButtons(html, attrName, datasetKey) {
  const results = [];
  const regex = new RegExp(`<(?:button|div|article)\\b([^>]*\\b${attrName}="([^"]*)"[^>]*)>`, 'g');
  let match;
  while ((match = regex.exec(html)) !== null) {
    const attrs = match[1];
    const value = match[2];
    const classMatch = attrs.match(/\bclass="([^"]*)"/);
    const listeners = {};
    const el = {
      dataset: { [datasetKey]: value },
      className: classMatch ? classMatch[1] : '',
      closest: () => null,
      addEventListener(type, fn) {
        if (!listeners[type]) listeners[type] = [];
        listeners[type].push(fn);
      },
      click() {
        const evt = {
          currentTarget: el,
          target: el,
          stopPropagation() {},
          preventDefault() {}
        };
        (listeners.click || []).forEach((fn) => fn(evt));
      }
    };
    results.push(el);
  }
  return results;
}

function loadToolkitHarness({ withApp = false, withI18n = false, initialLang = 'es' } = {}) {
  let containerHtml = '';
  let cachedGroupBtns = [];
  let cachedTrickBtns = [];
  let cachedStudyAreaBtns = [];
  let cachedPillCards = [];
  let cachedReadingBtns = [];
  let cachedWorkshopBtns = [];
  let cachedIdButtons = new Map();

  const container = {
    id: 'pildoras-anclajes-view',
    classList: { add: () => {}, remove: () => {} },
    get innerHTML() {
      return containerHtml;
    },
    set innerHTML(val) {
      containerHtml = String(val || '');
      cachedGroupBtns = extractAttrButtons(containerHtml, 'data-trick-group', 'trickGroup');
      cachedTrickBtns = extractAttrButtons(containerHtml, 'data-launch-trick-id', 'launchTrickId');
      cachedStudyAreaBtns = extractAttrButtons(containerHtml, 'data-study-area', 'studyArea');
      cachedPillCards = extractAttrButtons(containerHtml, 'data-pill-id', 'pillId');
      cachedReadingBtns = extractAttrButtons(containerHtml, 'data-open-reading', 'openReading');
      cachedWorkshopBtns = extractAttrButtons(containerHtml, 'data-open-workshop', 'openWorkshop');
      cachedIdButtons = new Map();
      for (const id of ['btn-reading-back', 'btn-reading-back-bottom', 'btn-workshop-back']) {
        if (containerHtml.includes(`id="${id}"`)) {
          const listeners = [];
          cachedIdButtons.set(id, {
            id,
            addEventListener(type, fn) { if (type === 'click') listeners.push(fn); },
            click() { listeners.forEach((fn) => fn({ currentTarget: this, target: this, stopPropagation() {} })); }
          });
        }
      }
    }
  };

  const modal = {
    classList: {
      add() {},
      remove() {},
      contains() { return false; }
    }
  };
  const modalBody = { innerHTML: '', scrollTop: 0, classList: { add() {}, remove() {} } };

  const noop = () => {};
  const store = { act_lang_pref: initialLang };
  const launchedTricks = [];
  const sections = new Map([
    ['guia-inicio-view', { innerHTML: '', classList: { add: noop, remove: noop }, querySelectorAll: () => [] }],
    ['pildoras-anclajes-view', { innerHTML: '', classList: { add: noop, remove: noop }, querySelectorAll: () => [] }]
  ]);

  const bodyEl = {
    nodeType: 1,
    classList: { add: noop, remove: noop },
    hasAttribute: () => false,
    querySelectorAll: () => []
  };

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
      documentElement: { lang: initialLang, setAttribute: noop },
      body: bodyEl,
      addEventListener: noop,
      createTreeWalker: () => ({ nextNode: () => null }),
      getElementById(id) {
        if (id === 'pildoras-anclajes-view') return container;
        if (id === 'app-modal') return modal;
        if (id === 'modal-body') return modalBody;
        if (cachedIdButtons.has(id)) return cachedIdButtons.get(id);
        if (sections.has(id)) return sections.get(id);
        return null;
      },
      querySelector: () => null,
      querySelectorAll(selector) {
        if (selector === '[data-trick-group]') return cachedGroupBtns;
        if (selector === '[data-launch-trick-id]') return cachedTrickBtns;
        if (selector === '[data-study-area]') return cachedStudyAreaBtns;
        if (selector === '[data-pill-id]') return cachedPillCards;
        if (selector === '[data-open-reading]') return cachedReadingBtns;
        if (selector === '[data-open-workshop]') return cachedWorkshopBtns;
        return [];
      }
    },
    KhoraUtils: {
      escapeHtml: (s) =>
        String(s ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;'),
      scrollToTop: () => {}
    },
    stateManager: {
      getSettings: () => ({ showAnchorsCard: true }),
      getAnchors: () => [],
      getPillFavorites: () => [],
      getDeconstructedStatements: () => [],
      getPivots: () => [],
      getMindName: () => 'George',
      getProfile: () => ({ coreValues: [], busPassengers: [] }),
      isVaultLocked: () => false,
      getDbStatus: () => ({ mode: 'local', serverAvailable: false, serverChecked: true }),
      getStorageMode: () => 'local'
    },
    setTimeout,
    clearTimeout,
    console
  };

  if (!withApp) {
    sandbox.app = {
      openModal: noop,
      closeModal: noop,
      showToast: noop,
      navigate: noop
    };
  }

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  if (withI18n) {
    vm.runInNewContext(i18nDictSrc, sandbox);
    vm.runInNewContext(i18nSrc, sandbox);
  }
  if (withApp) {
    vm.runInNewContext(helpJsSrc, sandbox);
    vm.runInNewContext(`${appJsSrc}\n;globalThis.__AppController = AppController;`, sandbox);
    sandbox.app = new sandbox.__AppController();
  }
  vm.runInNewContext(pillsAnchorsSrc, sandbox);

  if (withI18n) {
    sandbox.i18n.init();
  }

  const toolkit = sandbox.pildorasAnclajesApp;
  const origLaunch = toolkit.launchTrickRunner.bind(toolkit);
  const trackLaunch = (fn) => {
    toolkit.launchTrickRunner = (trickId, options) => {
      launchedTricks.push(trickId);
      if (fn) return fn(trickId, options);
    };
  };
  trackLaunch(null);

  return {
    toolkit,
    app: sandbox.app,
    i18n: sandbox.i18n,
    container,
    launchedTricks,
    restoreRealLaunch: () => {
      toolkit.launchTrickRunner = origLaunch;
    },
    getGroupButtons: () => cachedGroupBtns,
    getTrickButtons: () => cachedTrickBtns,
    getStudyAreaButtons: () => cachedStudyAreaBtns,
    getPillCards: () => cachedPillCards,
    getReadingButtons: () => cachedReadingBtns,
    getWorkshopButtons: () => cachedWorkshopBtns,
    getIdButton: (id) => cachedIdButtons.get(id) || null,
    modalBody
  };
}

test('Botiquín default landing shows 3 calm situational doors without dumping 8 cards or intent chips', () => {
  const { toolkit, container, getGroupButtons, getTrickButtons } = loadToolkitHarness();
  toolkit.init();

  const html = container.innerHTML;
  assert.equal(toolkit.activeTrickGroup, null);

  // 3 doors + 1 "Ver los 8 ejercicios en lista" footer button
  const groupBtns = getGroupButtons();
  const doorBtns = groupBtns.filter((b) => b.className.includes('toolkit-door-card'));
  assert.equal(doorBtns.length, 3);
  assert.deepEqual(
    doorBtns.map((b) => b.dataset.trickGroup),
    ['calm', 'mind', 'limits']
  );

  // Counts on doors match 2 / 3 / 3
  assert.match(html, /2 ejercicios/);
  assert.match(html, /3 ejercicios/);
  assert.match(html, /Ver los 8 ejercicios en lista →/);

  // No upfront 8-exercise dump, no noisy intent chip bar, no uppercase trick badges
  assert.equal(getTrickButtons().length, 0);
  assert.equal(html.includes('trick-intent-chip'), false);
  assert.equal(html.includes('trick-badge'), false);
});

test('Selecting a situation shows only its exercises, launches clicked runner, and returns to doors', () => {
  const { toolkit, container, launchedTricks, getGroupButtons, getTrickButtons } = loadToolkitHarness();
  toolkit.init();

  const expectedGroups = {
    calm: ['trick_drop_anchor', 'trick_somatic_yes'],
    mind: ['trick_comic_voice', 'trick_bus_driver', 'trick_two_arrows'],
    limits: ['trick_serene_silence', 'trick_pause_rescue', 'trick_cold_breath']
  };

  for (const [groupId, expectedIds] of Object.entries(expectedGroups)) {
    const door = getGroupButtons().find(
      (b) => b.className.includes('toolkit-door-card') && b.dataset.trickGroup === groupId
    );
    assert.ok(door, `Expected door button for group "${groupId}"`);
    door.click();

    assert.equal(toolkit.activeTrickGroup, groupId);
    assert.match(container.innerHTML, /← Elegir situación/);
    assert.match(container.innerHTML, /role="tablist"/);

    const trickBtns = getTrickButtons();
    assert.deepEqual(
      trickBtns.map((b) => b.dataset.launchTrickId),
      expectedIds
    );

    // Click first exercise row in group and verify launchTrickRunner receives exact ID
    trickBtns[0].click();
    assert.equal(launchedTricks.at(-1), expectedIds[0]);

    // Click "← Elegir situación" to return to 3-door triage
    const backBtn = getGroupButtons().find((b) => b.className.includes('toolkit-back-btn'));
    assert.ok(backBtn, 'Expected back button');
    backBtn.click();
    assert.equal(toolkit.activeTrickGroup, null);
    assert.equal(getTrickButtons().length, 0);
  }
});

test('All-exercises directory shows all 8 unique tricks grouped cleanly with zero duplicates', () => {
  const { toolkit, container, getGroupButtons, getTrickButtons } = loadToolkitHarness();
  toolkit.init();

  const showAllBtn = getGroupButtons().find((b) => b.className.includes('toolkit-show-all-btn'));
  assert.ok(showAllBtn, 'Expected "Ver los 8 ejercicios en lista" button');
  showAllBtn.click();

  assert.equal(toolkit.activeTrickGroup, 'all');
  assert.match(container.innerHTML, /Los 8 ejercicios breves ordenados por situación\./);

  const ids = getTrickButtons().map((b) => b.dataset.launchTrickId);
  assert.equal(ids.length, 8);
  assert.equal(new Set(ids).size, 8, 'Every trick must appear once without duplicates');
  assert.equal(ids.filter((id) => id === 'trick_somatic_yes').length, 1);
});

test('AppController.navigate resets activeTrickGroup on entry from another view and preserves it in-place', () => {
  const { toolkit, app } = loadToolkitHarness({ withApp: true });
  app.currentView = 'guia-inicio';
  toolkit.activeTrickGroup = 'limits';

  // Entering pildoras-trucos from guia-inicio resets to 3-door triage
  app.navigate('pildoras-trucos');
  assert.equal(app.currentView, 'pildoras-trucos');
  assert.equal(toolkit.activeTrickGroup, null);

  // Switching to a group while already on pildoras-trucos and re-navigating keeps the open group
  toolkit.activeTrickGroup = 'mind';
  app.navigate('pildoras-trucos');
  assert.equal(toolkit.activeTrickGroup, 'mind');

  // Leaving to another screen and returning resets back to null
  app.navigate('guia-inicio');
  app.navigate('pildoras-trucos');
  assert.equal(toolkit.activeTrickGroup, null);
});

test('EN i18n translates Botiquín doors, tabs, tricks, dynamic counts, and help, and reverts cleanly to ES', () => {
  const { toolkit, app, i18n, container, getGroupButtons } = loadToolkitHarness({
    withApp: true,
    withI18n: true,
    initialLang: 'es'
  });
  toolkit.init();

  i18n.setLang('en');

  // Catalog translations
  assert.equal(toolkit.trickGroups.find((g) => g.id === 'calm').tabLabel, 'Body & calm');
  assert.equal(toolkit.tricksCatalog.find((t) => t.id === 'trick_drop_anchor').title, 'Dropping Anchor (ACE)');
  assert.equal(toolkit.tricksCatalog.find((t) => t.id === 'trick_somatic_yes').duration, '45 sec');

  // Landing strings & dynamic counts
  assert.equal(i18n.t('¿Qué necesitas ahora mismo?'), 'What do you need right now?');
  assert.equal(
    i18n.t('Elige lo que más se parezca a este momento para ver 2 o 3 ejercicios breves.'),
    'Pick what fits this moment to see just 2 or 3 short exercises.'
  );
  assert.equal(i18n.t('2 ejercicios'), '2 exercises');
  assert.equal(i18n.t('3 ejercicios'), '3 exercises');
  assert.equal(i18n.t('Todos (8)'), 'All (8)');
  assert.equal(i18n.t('Ver los 8 ejercicios en lista →'), 'View all 8 exercises →');
  assert.equal(i18n.t('Los 8 ejercicios breves ordenados por situación.'), 'All 8 short exercises grouped by situation.');
  assert.equal(i18n.t('← Elegir situación'), '← Pick a situation');
  assert.equal(i18n.t('Empezar →'), 'Start →');
  assert.equal(i18n.t('La Postura Somática del "SÍ"'), 'The Somatic "YES" Posture');

  // Help catalog step updated cleanly
  const helpStep = app.getHelpCatalog().screens['pildoras-trucos'].steps[0];
  assert.equal(i18n.t(helpStep), '1. Pick the situation closest to this moment (body, mind, or boundaries).');

  // Render in EN and open a group
  toolkit.render();
  toolkit.bindEvents();
  assert.match(container.innerHTML, /Overwhelm, fear, or physical tension/);

  getGroupButtons().find((b) => b.dataset.trickGroup === 'calm').click();
  assert.match(container.innerHTML, /Dropping Anchor \(ACE\)/);

  // Switch back to ES
  i18n.setLang('es');
  assert.equal(toolkit.trickGroups.find((g) => g.id === 'calm').tabLabel, 'Cuerpo y calma');
  assert.equal(toolkit.tricksCatalog.find((t) => t.id === 'trick_drop_anchor').title, 'Echar el Ancla (ACE)');
  assert.match(container.innerHTML, /Echar el Ancla \(ACE\)/);
});

test('surfaces.css styles .toolkit-row for both editorial and lino modes and keeps modal runner classes', () => {
  assert.match(surfacesCss, /\[data-surface="editorial"\]\s*\.toolkit-row\s*\{/);
  assert.match(surfacesCss, /\[data-surface="lino"\]\s*\.toolkit-row\s*\{/);
  assert.match(surfacesCss, /\.toolkit-row-title\b/);
  assert.match(surfacesCss, /\.trick-card,/);
  assert.match(surfacesCss, /\.trick-step-card,/);
});

test('Lecturas y Conceptos ACT renders open editorial index and navigates readings and workshops in surface without modals', () => {
  const { toolkit, container, modalBody, getReadingButtons, getWorkshopButtons, getIdButton } = loadToolkitHarness();
  toolkit.mode = 'estudio';
  toolkit.currentTab = 'pildoras';
  toolkit.init();

  // Default landing shows open editorial index without anchors card or hero time banner
  assert.equal(toolkit.activeReadingId, null);
  assert.equal(toolkit.activeWorkshopId, null);
  assert.equal(container.innerHTML.includes('anchors-unified-card'), false);
  assert.equal(container.innerHTML.includes('intro-guide-card'), false);
  assert.match(container.innerHTML, /Fundamentos de Khōra y ACT/);
  assert.match(container.innerHTML, /Defusión Cognitiva/);
  assert.match(container.innerHTML, /Límites y Soberanía/);
  assert.match(container.innerHTML, /Aceptación y Compasión/);
  assert.match(container.innerHTML, /Momento Presente y Regulación/);
  assert.match(container.innerHTML, /El Pivote: Del Dolor al Anhelo/);

  // Clicking a reading opens it in surface without opening a modal
  const readingBtns = getReadingButtons();
  assert.equal(readingBtns.length, 7);
  readingBtns.find((b) => b.dataset.openReading === 'pill_2').click();
  assert.equal(toolkit.activeReadingId, 'pill_2');
  assert.equal(modalBody.innerHTML, '');
  assert.match(container.innerHTML, /← Volver a Lecturas y Ejercicios/);
  assert.match(container.innerHTML, /tu deseo por sí solo no tiene validez legal/);

  // Returning to index works in surface
  getIdButton('btn-reading-back').click();
  assert.equal(toolkit.activeReadingId, null);
  assert.match(container.innerHTML, /Fundamentos de Khōra y ACT/);

  // Clicking a workshop opens it in surface without opening a modal
  const workshopBtn = getWorkshopButtons().find((b) => b.dataset.openWorkshop === 'pivot');
  assert.ok(workshopBtn);
  workshopBtn.click();
  assert.equal(toolkit.activeWorkshopId, 'pivot');
  assert.equal(modalBody.innerHTML, '');
  assert.match(container.innerHTML, /← Volver a Lecturas y Ejercicios/);
  assert.match(container.innerHTML, /El Pivote: Del Dolor al Anhelo/);

  getIdButton('btn-workshop-back').click();
  assert.equal(toolkit.activeWorkshopId, null);
});

test('AppController.navigate resets activeStudyArea on entry from another view and preserves it in-place', () => {
  const { toolkit, app } = loadToolkitHarness({ withApp: true });
  app.currentView = 'guia-inicio';
  toolkit.activeStudyArea = 'limites';

  app.navigate('pildoras-estudio');
  assert.equal(app.currentView, 'pildoras-estudio');
  assert.equal(toolkit.activeStudyArea, null);

  toolkit.activeStudyArea = 'defusion';
  app.navigate('pildoras-estudio');
  assert.equal(toolkit.activeStudyArea, 'defusion');

  app.navigate('guia-inicio');
  app.navigate('pildoras-estudio');
  assert.equal(toolkit.activeStudyArea, null);
});

test('EN i18n translates Lecturas y Conceptos ACT progressive main-view strings', () => {
  const { i18n } = loadToolkitHarness({ withApp: true, withI18n: true, initialLang: 'es' });
  i18n.setLang('en');

  assert.equal(i18n.t('← Todos los conceptos'), '← All concepts');
  assert.equal(i18n.t('Todas (6)'), 'All (6)');
  assert.equal(i18n.t('Ver las 6 lecturas en lista →'), 'View all 6 readings in a list →');
  assert.equal(i18n.t('Las 6 lecturas breves ordenadas por concepto.'), 'All 6 short readings grouped by concept.');
  assert.equal(i18n.t('Lecturas breves'), 'Short readings');
  assert.equal(i18n.t('Talleres en calma'), 'Calm-state workshops');
  assert.equal(i18n.t('Practicar trucos rápidos en el Botiquín →'), 'Practice quick tricks in the First-Aid Kit →');
});
