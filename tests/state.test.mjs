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

test('seedDemoData populates every section of the app after clearAllData', () => {
  const { sm } = loadState({ withMetaTag: false });
  sm.clearAllData();

  const seeded = sm.seedDemoData();
  assert.equal(seeded, true);

  assert.equal(sm.getPazFalsaEntries().length, 4);
  assert.equal(sm.getPazFalsaEntries()[0].followUpNotes.length, 1);

  const actEntries = sm.getActCrisisEntries();
  assert.equal(actEntries.length, 3);
  assert.ok(actEntries.some(e => e.choiceType === 'value'));
  assert.ok(actEntries.some(e => e.choiceType === 'autopilot'));
  assert.ok(actEntries.every(e => Array.isArray(e.emotions) && e.emotions.length > 0));
  assert.ok(actEntries.every(e => Boolean(e.carriedPassenger)));

  assert.equal(sm.getPatterns().length, 2);
  assert.equal(sm.getCompassEntries().length, 2);
  assert.equal(sm.getHexaflexHistory().length, 2);
  assert.equal(sm.getDeconstructedStatements().length, 2);
  assert.equal(sm.getPivots().length, 2);

  const reflections = sm.getTherapyReflections();
  assert.equal(reflections.length, 2);
  assert.ok(reflections.some(r => r.status === 'pending'));
  assert.ok(reflections.some(r => r.status === 'discussed'));
  assert.ok(reflections.every(r => r.clinicalExtract && r.clinicalExtract.emotions.length > 0));

  const anchors = sm.getAnchors();
  assert.equal(anchors.length, 6);
  assert.ok(anchors.some(a => a.id === 'demo_anc_1'));
  assert.ok(anchors.some(a => a.id === 'a1'));

  const favs = sm.getPillFavorites();
  assert.ok(favs.includes('pill_1'));
  assert.ok(favs.includes('pill_2'));
  assert.ok(favs.includes('a1'));
  assert.ok(favs.includes('demo_anc_1'));
  assert.equal(favs.includes('mantra_1'), false);

  const profile = sm.getProfile();
  assert.equal(profile.coreValues.length, 3);
  assert.deepEqual(Array.from(profile.coreValues, v => v.domain), ['Pareja', 'Trabajo', 'Conmigo Mismo']);

  assert.equal(profile.busPassengers.length, 3);
  assert.deepEqual(Array.from(profile.busPassengers, p => p.status), ['loud', 'seated', 'integrated']);
  assert.ok(profile.busPassengers.every(p => Array.isArray(p.affectedValues) && p.affectedValues.length > 0));

  assert.equal(profile.progressLog.length, 4);
  assert.equal(sm.countExampleItems(), 30);
});

test('seedDemoData is non-destructive, idempotent, and clearExampleData preserves user items', () => {
  const { sm } = loadState({ withMetaTag: false });
  sm.clearAllData();

  const userVal = sm.addConstructedValue({
    domain: 'Amistad',
    statement: 'Escuchar con atención genuina',
    microAction: 'Llamar sin prisas',
    willingness: 'Sostener silencios'
  });
  sm.addBusPassenger({
    name: 'Pasajero propio',
    shouts: 'No digas nada',
    status: 'loud'
  });
  sm.addProgressNote('Nota propia del usuario');
  sm.addAnchor('Anclaje propio', 'Personal', 'Valores');
  sm.togglePillFavorite('pill_3');
  sm.addPazFalsaEntry({ context: 'Amigos', situation: 'Situación propia', toll: { resentment: 5, physicalExhaustion: 4, anxiety: 3, emptiness: 2 } });
  sm.addActCrisisEntry({ emotion: 'Calma', thought: 'Pensamiento propio', initialIntensity: 6, postIntensity: 3, choiceType: 'value' });
  sm.addPattern({ title: 'Patrón propio', category: 'Amigos' });
  sm.addCompassEntry({ situation: 'Brújula propia', selectedValue: 'Honestidad', keyAction: 'Hablar claro' });
  sm.addHexaflexScore({ acceptance: 8, defusion: 8, present: 8, context: 8, values: 8, action: 8 });
  sm.addDeconstructedStatement({ rigidLabel: 'Etiqueta propia', softened: 'Pensamiento propio', contextualized: 'Contexto propio' });
  sm.addPivot({ pain: 'Dolor propio', yearning: 'Anhelo propio', pivotAction: 'Acción propia' });
  sm.addTherapyReflection({ text: 'Reflexión propia para sesión', context: 'Amistad', category: 'Idea o insight entre sesiones' });

  sm.seedDemoData();
  const countsAfterFirst = {
    pf: sm.getPazFalsaEntries().length,
    act: sm.getActCrisisEntries().length,
    pat: sm.getPatterns().length,
    comp: sm.getCompassEntries().length,
    hex: sm.getHexaflexHistory().length,
    dec: sm.getDeconstructedStatements().length,
    piv: sm.getPivots().length,
    ref: sm.getTherapyReflections().length,
    anc: sm.getAnchors().length,
    vals: sm.getProfile().coreValues.length,
    pas: sm.getProfile().busPassengers.length,
    log: sm.getProfile().progressLog.length
  };

  // Call a second time -> identical counts, no duplicate demos
  sm.seedDemoData();
  assert.equal(sm.getPazFalsaEntries().length, countsAfterFirst.pf);
  assert.equal(sm.getActCrisisEntries().length, countsAfterFirst.act);
  assert.equal(sm.getPatterns().length, countsAfterFirst.pat);
  assert.equal(sm.getCompassEntries().length, countsAfterFirst.comp);
  assert.equal(sm.getHexaflexHistory().length, countsAfterFirst.hex);
  assert.equal(sm.getDeconstructedStatements().length, countsAfterFirst.dec);
  assert.equal(sm.getPivots().length, countsAfterFirst.piv);
  assert.equal(sm.getTherapyReflections().length, countsAfterFirst.ref);
  assert.equal(sm.getAnchors().length, countsAfterFirst.anc);
  assert.equal(sm.getProfile().coreValues.length, countsAfterFirst.vals);
  assert.equal(sm.getProfile().busPassengers.length, countsAfterFirst.pas);
  assert.equal(sm.getProfile().progressLog.length, countsAfterFirst.log);

  // User primary value and custom anchor remain first
  assert.equal(sm.getProfile().coreValues[0].id, userVal.id);
  assert.equal(sm.getAnchors()[0].text, 'Anclaje propio');
  assert.ok(sm.getPillFavorites().includes('pill_3'));

  // clearExampleData removes all 30 demo items while leaving every user item & 5 DEFAULT_ANCHORS intact
  const removed = sm.clearExampleData();
  assert.equal(removed, 30);
  assert.equal(sm.countExampleItems(), 0);

  assert.equal(sm.getPazFalsaEntries().length, 1);
  assert.equal(sm.getActCrisisEntries().length, 1);
  assert.equal(sm.getPatterns().length, 1);
  assert.equal(sm.getCompassEntries().length, 1);
  assert.equal(sm.getHexaflexHistory().length, 1);
  assert.equal(sm.getDeconstructedStatements().length, 1);
  assert.equal(sm.getPivots().length, 1);
  assert.equal(sm.getTherapyReflections().length, 1);
  assert.equal(sm.getAnchors().length, 6); // 1 user anchor + 5 DEFAULT_ANCHORS
  assert.equal(sm.getProfile().coreValues.length, 1);
  assert.equal(sm.getProfile().busPassengers.length, 1);
  // 1 user progressLog note + 1 value added + 1 passenger added = 3 user log items
  assert.equal(sm.getProfile().progressLog.length, 3);
  assert.equal(sm.getPillFavorites().includes('demo_anc_1'), false);
  assert.ok(sm.getPillFavorites().includes('pill_3'));
});

test('clearing example data leaves bus with clean empty state and no stray fake values or 1-min time references', () => {
  const profileSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'subapp-profile.js'), 'utf8');
  const appSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app.js'), 'utf8');
  const utilsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'utils.js'), 'utf8');

  const { sm } = loadState({ withMetaTag: false });
  // Initial state has val_seed_1 (example item)
  assert.equal(sm.getProfile().coreValues.length, 1);
  assert.equal(sm.getProfile().coreValues[0].isExample, true);

  // Clear all example data
  sm.clearExampleData();
  const profileAfterClear = sm.getProfile();
  assert.equal(profileAfterClear.coreValues.length, 0);

  // Run ProfileApp in sandbox
  const sandbox = {
    window: {},
    document: { getElementById: () => null, querySelectorAll: () => [] },
    localStorage: { getItem: () => null, setItem: () => {} },
    console
  };
  sandbox.window = sandbox;
  sandbox.window.stateManager = sm;
  vm.runInNewContext(utilsSrc, sandbox);
  vm.runInNewContext(profileSrc + '\n;window.PerfilApp = PerfilApp;', sandbox);

  const profileApp = new sandbox.PerfilApp();
  const busHtml = profileApp.renderMindAndBusBlock(profileAfterClear);

  // Must NOT contain the old hardcoded fallback value
  assert.equal(busHtml.includes('«Cuidar mi dignidad y elegir mi camino con honestidad»'), false);
  // Must render empty state guidance
  assert.ok(busHtml.includes('Aún no has definido ningún valor rumbo'));
  // Must NOT include "(1 min)"
  assert.equal(busHtml.includes('Ensayar respuesta (1 min)'), false);

  // App navigation must NOT include 'Botiquín 1-Min'
  assert.equal(appSrc.includes('Botiquín 1-Min'), false);
});
