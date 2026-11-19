import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const i18nDictSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n-dict.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n.js'), 'utf8');
const stateSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'state.js'), 'utf8');
const vaultSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'state-vault.js'), 'utf8');

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

function loadStateWithI18n(initialLang = 'es') {
  const noop = () => {};
  const store = { act_lang_pref: initialLang };
  const sandbox = {
    window: {},
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    document: {
      documentElement: { lang: initialLang, setAttribute: noop },
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      addEventListener: noop,
      body: null
    },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    fetch: null,
    indexedDB: undefined,
    crypto: { getRandomValues: (arr) => { for (let i = 0; i < arr.length; i++) arr[i] = i % 256; } },
    Notification: undefined,
    setTimeout,
    clearTimeout,
    console
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(i18nDictSrc, sandbox);
  vm.runInNewContext(i18nSrc, sandbox);
  vm.runInNewContext(vaultSrc, sandbox);
  vm.runInNewContext(stateSrc, sandbox);
  sandbox.i18n.init();
  return { sm: sandbox.stateManager, i18n: sandbox.i18n, store };
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
    '🔒 Iniciar sesión en Khōra',
    'Guardando…',
    'Guardado',
    '¿Cargar datos de ejemplo en toda la app? Tus registros propios se conservarán intactos.',
    'No hay registros aún. Completa una sesión en "Paz Falsa" o en "Espacio ACT", o carga "Cargar Datos Demo" desde Configuración para probar.',
    'Hay patrones de ejemplo en tu radar. Edítalos o quita todos los ejemplos cuando quieras.',
    'Hay actividad de ejemplo en este historial. Puedes quitar los ejemplos cuando quieras.',
    '¿Cómo estás ahora mismo?',
    'Ahora mismo…',
    'Tengo un nudo, agobio o bloqueo',
    'Necesito frenar ya y bajar revoluciones',
    'Dudo qué hacer y me cuesta decir que no',
    'Acabo de callarme o decir que sí sin querer',
    'Tengo un rato tranquilo para leer o practicar',
    'Guía de Inicio — ¿Cómo estás ahora mismo?',
    'Aviso normal de Chrome en Android:',
    'la notificación «Toca para copiar la URL de esta aplicación» aparece siempre al abrir cualquier app web (PWA). Puedes ocultarla manteniendo pulsada la notificación y desactivando solo ese canal.',
    'Entendido'
  ];

  for (const key of requiredKeys) {
    const translated = i18n.t(key);
    assert.ok(translated && translated !== key, `Missing EN translation for: ${key}`);
  }

  assert.equal(i18n.t('Quitar Ejemplos (24)'), 'Remove Examples (24)');
  assert.equal(i18n.t('🧹 Quitar Ejemplos (24)'), 'Remove Examples (24)');
});

test('seedDemoData localizes all demo items in EN and reverts cleanly to ES', () => {
  // 1. Seed in ES -> switch to EN -> switch back to ES
  const { sm, i18n } = loadStateWithI18n('es');
  sm.clearAllData();
  sm.seedDemoData();

  const esValStatement = sm.getProfile().coreValues.find(v => v.id === 'demo_val_2').statement;
  const esPasName = sm.getProfile().busPassengers.find(p => p.id === 'demo_pas_3').name;
  const esLogNote = sm.getProfile().progressLog.find(l => l.id === 'demo_log_3').note;
  const esAncText = sm.getAnchors().find(a => a.id === 'demo_anc_1').text;
  const esPf4Sit = sm.getPazFalsaEntries().find(e => e.id === 'demo_pf_4').situation;
  const esAct3Pas = sm.getActCrisisEntries().find(e => e.id === 'demo_act_3').carriedPassenger;
  const esPat2Title = sm.getPatterns().find(p => p.id === 'demo_pat_2').title;
  const esComp2Sit = sm.getCompassEntries().find(c => c.id === 'demo_comp_2').situation;
  const esDec2Label = sm.getDeconstructedStatements().find(d => d.id === 'demo_dec_2').rigidLabel;
  const esPiv2Pain = sm.getPivots().find(p => p.id === 'demo_piv_2').pain;
  const esRef2Focus = sm.getTherapyReflections().find(r => r.id === 'demo_ref_2').clinicalExtract.sessionFocus;

  i18n.setLang('en');

  assert.notEqual(sm.getProfile().coreValues.find(v => v.id === 'demo_val_2').statement, esValStatement);
  assert.notEqual(sm.getProfile().busPassengers.find(p => p.id === 'demo_pas_3').name, esPasName);
  assert.notEqual(sm.getProfile().progressLog.find(l => l.id === 'demo_log_3').note, esLogNote);
  assert.notEqual(sm.getAnchors().find(a => a.id === 'demo_anc_1').text, esAncText);
  assert.notEqual(sm.getPazFalsaEntries().find(e => e.id === 'demo_pf_4').situation, esPf4Sit);
  assert.notEqual(sm.getActCrisisEntries().find(e => e.id === 'demo_act_3').carriedPassenger, esAct3Pas);
  assert.notEqual(sm.getPatterns().find(p => p.id === 'demo_pat_2').title, esPat2Title);
  assert.notEqual(sm.getCompassEntries().find(c => c.id === 'demo_comp_2').situation, esComp2Sit);
  assert.notEqual(sm.getDeconstructedStatements().find(d => d.id === 'demo_dec_2').rigidLabel, esDec2Label);
  assert.notEqual(sm.getPivots().find(p => p.id === 'demo_piv_2').pain, esPiv2Pain);
  assert.notEqual(sm.getTherapyReflections().find(r => r.id === 'demo_ref_2').clinicalExtract.sessionFocus, esRef2Focus);

  i18n.setLang('es');

  assert.equal(sm.getProfile().coreValues.find(v => v.id === 'demo_val_2').statement, esValStatement);
  assert.equal(sm.getProfile().busPassengers.find(p => p.id === 'demo_pas_3').name, esPasName);
  assert.equal(sm.getProfile().progressLog.find(l => l.id === 'demo_log_3').note, esLogNote);
  assert.equal(sm.getAnchors().find(a => a.id === 'demo_anc_1').text, esAncText);
  assert.equal(sm.getPazFalsaEntries().find(e => e.id === 'demo_pf_4').situation, esPf4Sit);
  assert.equal(sm.getActCrisisEntries().find(e => e.id === 'demo_act_3').carriedPassenger, esAct3Pas);
  assert.equal(sm.getPatterns().find(p => p.id === 'demo_pat_2').title, esPat2Title);
  assert.equal(sm.getCompassEntries().find(c => c.id === 'demo_comp_2').situation, esComp2Sit);
  assert.equal(sm.getDeconstructedStatements().find(d => d.id === 'demo_dec_2').rigidLabel, esDec2Label);
  assert.equal(sm.getPivots().find(p => p.id === 'demo_piv_2').pain, esPiv2Pain);
  assert.equal(sm.getTherapyReflections().find(r => r.id === 'demo_ref_2').clinicalExtract.sessionFocus, esRef2Focus);

  // 2. Seed directly while in EN -> immediately EN -> switch to ES -> clean Spanish
  const enEnv = loadStateWithI18n('en');
  enEnv.sm.clearAllData();
  enEnv.sm.seedDemoData();

  assert.equal(enEnv.sm.getProfile().coreValues.find(v => v.id === 'demo_val_1').lensUsed, 'Guide example (Hayes)');
  assert.equal(enEnv.sm.getAnchors().find(a => a.id === 'demo_anc_1').category, 'Boundaries');
  assert.ok(enEnv.sm.getTherapyReflections().find(r => r.id === 'demo_ref_2').clinicalExtract.emotions.includes('Relief / Integrity'));

  enEnv.i18n.setLang('es');

  assert.equal(enEnv.sm.getProfile().coreValues.find(v => v.id === 'demo_val_1').lensUsed, 'Ejemplo guía (Hayes)');
  assert.equal(enEnv.sm.getAnchors().find(a => a.id === 'demo_anc_1').category, 'Límites');
  assert.equal(enEnv.sm.getTherapyReflections().find(r => r.id === 'demo_ref_2').clinicalExtract.sessionFocus, esRef2Focus);
});
