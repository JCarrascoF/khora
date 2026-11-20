import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const actSpaceSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'subapp-act-space.js'), 'utf8');
const i18nDictSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n-dict.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'i18n.js'), 'utf8');

function createStubElement(id = '') {
  const attrs = {};
  const classes = new Set();
  return {
    id,
    attrs,
    hidden: false,
    textContent: '',
    innerHTML: '',
    value: '',
    checked: false,
    style: {},
    dataset: {},
    classList: {
      add: (...names) => names.forEach((n) => classes.add(n)),
      remove: (...names) => names.forEach((n) => classes.delete(n)),
      toggle: (name, force) => {
        if (force === undefined) {
          if (classes.has(name)) classes.delete(name);
          else classes.add(name);
          return classes.has(name);
        }
        if (force) classes.add(name);
        else classes.delete(name);
        return Boolean(force);
      },
      contains: (name) => classes.has(name)
    },
    get className() {
      return [...classes].join(' ');
    },
    set className(val) {
      classes.clear();
      String(val || '').split(/\s+/).filter(Boolean).forEach((c) => classes.add(c));
    },
    setAttribute(k, v) {
      attrs[k] = String(v);
    },
    getAttribute(k) {
      return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null;
    },
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
}

function loadActSpaceHarness({ coreValues = [], busPassengers = [], mindName = 'George' } = {}) {
  const container = createStubElement('espacio-act-view');
  const modal = createStubElement('app-modal');
  const modalBody = createStubElement('modal-body');
  const elements = new Map([
    ['espacio-act-view', container],
    ['app-modal', modal],
    ['modal-body', modalBody]
  ]);
  const ensureEl = (id) => {
    if (!elements.has(id)) elements.set(id, createStubElement(id));
    return elements.get(id);
  };

  // Pre-register interactive elements updated by updateBreathingUI
  [
    'breathing-orb',
    'breathing-phase-word',
    'breathing-phase-text',
    'breathing-instruction-text',
    'breathing-cycle-hint',
    'btn-toggle-breathing',
    'breathing-sensory-controls'
  ].forEach(ensureEl);

  let nextTimerId = 1;
  const pendingTimers = new Map();
  const fakeSetTimeout = (fn, delay) => {
    const id = nextTimerId++;
    pendingTimers.set(id, { fn, delay });
    return id;
  };
  const fakeClearTimeout = (id) => {
    pendingTimers.delete(id);
  };
  const runNextTimer = () => {
    const first = pendingTimers.entries().next();
    if (first.done) return null;
    const [id, entry] = first.value;
    pendingTimers.delete(id);
    entry.fn();
    return entry.delay;
  };

  const savedEntries = [];
  const addedPassengers = [];
  const toasts = [];
  const haptics = [];
  const tones = [];

  const profile = {
    mindName,
    coreValues: [...coreValues],
    busPassengers: [...busPassengers]
  };

  const openModalCalls = [];
  const sandbox = {
    window: {},
    document: {
      getElementById(id) {
        if (id === 'espacio-act-view') return container;
        if (id === 'app-modal') return modal;
        if (id === 'modal-body') return modalBody;
        if (
          id === 'breathing-orb' ||
          id === 'breathing-phase-word' ||
          id === 'breathing-phase-text' ||
          id === 'breathing-instruction-text' ||
          id === 'breathing-cycle-hint' ||
          id === 'btn-toggle-breathing' ||
          id === 'breathing-sensory-controls'
        ) {
          return elements.get(id);
        }
        return null;
      },
      querySelectorAll: () => []
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
      getSettings: () => ({ vibration: true, sound: false }),
      saveSettings: () => {},
      getMindName: () => profile.mindName,
      setMindName: (n) => { profile.mindName = n; },
      getProfile: () => profile,
      addActCrisisEntry: (data) => {
        const entry = { id: `act_${savedEntries.length + 1}`, timestamp: Date.now(), ...data };
        savedEntries.push(entry);
        return entry;
      },
      addBusPassenger: (pas) => {
        const record = { id: `pas_${addedPassengers.length + 1}`, ...pas };
        profile.busPassengers.push(record);
        addedPassengers.push(record);
        return record;
      }
    },
    app: {
      currentView: 'espacio-act',
      showToast: (msg) => toasts.push(msg),
      triggerHaptic: (pattern) => haptics.push(pattern),
      playGentleTone: (freq, dur) => tones.push({ freq, dur }),
      openModal: (size) => {
        openModalCalls.push(size);
        modal.classList.add('active');
        return true;
      },
      closeModal: () => {
        modal.classList.remove('active');
        sandbox.espacioActApp?.stopBreathing?.();
        return true;
      },
      navigate: () => {}
    },
    setTimeout: fakeSetTimeout,
    clearTimeout: fakeClearTimeout,
    console
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  vm.runInNewContext(actSpaceSrc, sandbox);
  return {
    app: sandbox.espacioActApp,
    container,
    modal,
    modalBody,
    openModalCalls,
    elements,
    pendingTimers,
    runNextTimer,
    savedEntries,
    addedPassengers,
    toasts,
    haptics,
    tones
  };
}

function loadI18nEn() {
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
  sandbox.i18n.lang = 'en';
  return sandbox.i18n;
}

test('Espacio ACT keeps a 7-step Typeform micro-flow with one question per screen', () => {
  const { app, container } = loadActSpaceHarness();
  app.render();

  assert.equal(app.totalSteps, 7);
  assert.ok(container.innerHTML.includes('act-typeform-shell'));
  assert.ok(container.innerHTML.includes('act-progress-track'));
  assert.ok(container.innerHTML.includes('1 / 7'));
  assert.ok(container.innerHTML.includes('¿Qué estás sintiendo?'));
  assert.equal(container.innerHTML.includes('slider-act-intensity'), false);

  app.setStep(2);
  assert.ok(container.innerHTML.includes('slider-act-intensity'));
});

test('Step 3 (Body) keeps breathing in an optional modal, word-guided without countdown, and stops cleanly', () => {
  const { app, container, modal, modalBody, openModalCalls, elements, pendingTimers, runNextTimer } = loadActSpaceHarness();
  app.setStep(3);

  // Inline Step 3 stays clean: single-column Typeform focus, optional trigger button, no inline breathing pacer
  assert.equal(app.breathingActive, false);
  assert.equal(app.breathingPhase, 'idle');
  assert.equal(pendingTimers.size, 0);
  assert.equal(container.innerHTML.includes('breathing-pacer-container'), false);
  assert.equal(container.innerHTML.includes('breathing-orb'), false);
  assert.equal(container.innerHTML.includes('breathing-countdown'), false);
  assert.equal(container.innerHTML.includes('desktop-two-col'), false);
  assert.ok(container.innerHTML.includes('id="btn-open-breathing-modal"'));
  assert.ok(container.innerHTML.includes('Pausa para respirar'));
  assert.ok(container.innerHTML.includes('id="btn-open-somatic-posture"'));
  assert.ok(container.innerHTML.includes('Postura de apertura'));
  assert.ok(container.innerHTML.includes('id="btn-toggle-body-details"'));

  // Opening the modal puts the breathing exercise inside #modal-body in idle state (no auto-start)
  app.openBreathingModal();
  assert.deepEqual(openModalCalls, ['medium']);
  assert.equal(modal.classList.contains('active'), true);
  assert.equal(pendingTimers.size, 0);
  assert.equal(modalBody.innerHTML.includes('breathing-countdown'), false);
  assert.ok(modalBody.innerHTML.includes('id="breathing-phase-word">Respirar</span>'));
  assert.ok(modalBody.innerHTML.includes('Iniciar respiración guiada'));
  assert.ok(modalBody.innerHTML.includes('id="breathing-sensory-controls" hidden'));
  assert.ok(modalBody.innerHTML.includes('id="btn-modal-breathing-done"'));

  // Start breathing -> inhale (4000ms) -> hold (4000ms) -> exhale (6000ms) -> rest (2000ms) -> inhale (cycle 1)
  app.startBreathing();
  assert.equal(app.breathingActive, true);
  assert.equal(app.breathingPhase, 'inhale');
  assert.equal(elements.get('breathing-phase-word').textContent, 'Inhala');
  assert.equal(elements.get('btn-toggle-breathing').textContent, 'Detener respiración');
  assert.equal(elements.get('breathing-sensory-controls').hidden, false);

  assert.equal(runNextTimer(), 4000);
  assert.equal(app.breathingPhase, 'hold');
  assert.equal(elements.get('breathing-phase-word').textContent, 'Mantén');

  assert.equal(runNextTimer(), 4000);
  assert.equal(app.breathingPhase, 'exhale');
  assert.equal(elements.get('breathing-phase-word').textContent, 'Suelta');

  assert.equal(runNextTimer(), 6000);
  assert.equal(app.breathingPhase, 'rest');
  assert.equal(elements.get('breathing-phase-word').textContent, 'Pausa');

  assert.equal(runNextTimer(), 2000);
  assert.equal(app.breathingPhase, 'inhale');
  assert.equal(app.breathingCyclesDone, 1);
  assert.equal(elements.get('breathing-cycle-hint').hidden, false);
  assert.equal(elements.get('breathing-cycle-hint').textContent, 'Ciclos completados: 1');

  // Leaving Step 3 stops breathing and clears pending timer
  app.setStep(4);
  assert.equal(app.breathingActive, false);
  assert.equal(app.breathingPhase, 'idle');
  assert.equal(pendingTimers.size, 0);
});

test('Step 5 renders single-gesture defusion without anchor banner, leaves on a stream, or intensity slider', () => {
  const { app, container } = loadActSpaceHarness({ mindName: 'Radio Catástrofe' });
  app.entryData.thought = 'Se van a enfadar si digo que no.';
  app.setStep(5);

  assert.equal(container.innerHTML.includes('personal-anchor-banner'), false);
  assert.equal(container.innerHTML.includes('stream-container'), false);
  assert.equal(container.innerHTML.includes('floating-leaf'), false);
  assert.equal(container.innerHTML.includes('slider-act-post-intensity'), false);

  assert.ok(container.innerHTML.includes('id="act-defusion-live-card"'));
  assert.ok(container.innerHTML.includes('data-defusion-style="notice"'));
  assert.ok(container.innerHTML.includes('data-defusion-style="story"'));
  assert.ok(container.innerHTML.includes('data-defusion-style="thanks"'));
  assert.ok(
    container.innerHTML.includes('"Estoy pensando que Se van a enfadar si digo que no."')
  );

  assert.equal(app.buildReframedThought('notice', '   ', 'George'), '');
  assert.equal(
    app.buildReframedThought('story', 'No soy suficiente...', 'Radio Catástrofe'),
    'Radio Catástrofe me vuelve a contar la historia de que No soy suficiente.'
  );
  assert.equal(
    app.buildReframedThought('thanks', 'Se enfadarán', 'George'),
    'Gracias, George, por intentar protegerme con la idea de que Se enfadarán.'
  );
});

test('Step 6 & 7 keep choice focused, sync closing intensity, derive passenger automatically, and persist cleanly', () => {
  const { app, container, savedEntries, addedPassengers } = loadActSpaceHarness({
    coreValues: [{ id: 'v1', domain: 'Límites', statement: 'Decir que no con calma y respeto' }]
  });

  app.entryData.emotions = ['Ansiedad'];
  app.entryData.emotion = 'Ansiedad';
  app.entryData.initialIntensity = 9;
  app.entryData.bodyZones = ['Pecho/Corazón'];

  // Before Step 4 thought, derived passenger falls back to emotion + body zone
  assert.equal(app.getDerivedPassenger(), 'Ansiedad en Pecho/Corazón');

  // Step 6 focuses purely on choice & next step without willingness text or closing slider
  app.setStep(6);
  assert.equal(container.innerHTML.includes('personal-anchor-banner'), false);
  assert.equal(container.innerHTML.includes('act-passenger-input'), false);
  assert.equal(container.innerHTML.includes('act-willingness-strip'), false);
  assert.equal(container.innerHTML.includes('slider-act-post-intensity'), false);
  assert.ok(container.innerHTML.includes('id="btn-select-value"'));
  assert.ok(container.innerHTML.includes('id="btn-select-autopilot"'));
  assert.ok(container.innerHTML.includes('id="btn-toggle-action-examples"'));

  // Switch to autopilot mode cleanly
  app.entryData.choiceType = 'autopilot';
  app.render();
  assert.ok(container.innerHTML.includes('id="act-autopilot-urge"'));
  assert.equal(container.innerHTML.includes('id="act-committed-action"'), false);

  // Entering Step 7 syncs postIntensity to initialIntensity until touched
  app.setStep(7);
  assert.equal(app.entryData.postIntensity, 9);
  assert.ok(container.innerHTML.includes('id="slider-act-post-intensity"'));
  assert.ok(container.innerHTML.includes('id="chk-save-passenger-to-bus"'));

  // Switch back to Step 4 thought and preserve touched postIntensity on Step 7
  app.postIntensityTouched = true;
  app.entryData.postIntensity = 4;
  app.setStep(4);
  app.entryData.thought = 'Soy egoísta por priorizarme';
  app.setStep(7);
  assert.equal(app.entryData.postIntensity, 4, 'User-adjusted postIntensity should be preserved');
  assert.equal(app.getDerivedPassenger(), 'Soy egoísta por priorizarme');

  app.entryData.choiceType = 'value';
  app.entryData.valueChosen = 'Autocuidado';
  app.entryData.committedAction = 'Priorizar mi descanso';
  app.entryData.savePassengerToBus = true;
  app.saveEntry();

  assert.equal(savedEntries.length, 1);
  assert.equal(savedEntries[0].carriedPassenger, 'Soy egoísta por priorizarme');
  assert.equal(savedEntries[0].reframedThought, 'Estoy pensando que Soy egoísta por priorizarme.');
  assert.equal(addedPassengers.length, 1);
  assert.equal(addedPassengers[0].name, 'Soy egoísta por priorizarme');

  // Re-saving same passenger should not duplicate in Mi Autobús
  app.saveEntry();
  assert.equal(addedPassengers.length, 1);
});

test('EN i18n translates all streamlined Espacio ACT labels, help strings, and dynamic rules', () => {
  const i18n = loadI18nEn();

  const exactKeys = [
    '1. Nombrar Emoción',
    '2. Sentir en el Cuerpo',
    '3. Tomar Distancia',
    '4. Elegir Micro-Paso',
    'Paso 2: Sentir en el Cuerpo',
    'Respirar',
    'Inhala',
    'Mantén',
    'Suelta',
    'Pausa',
    'Respiración guiada (opcional)',
    'Un ritmo lento (4s inhalar · 4s mantener · 6s soltar) para hacer espacio alrededor de la sensación.',
    'Iniciar respiración guiada',
    'Detener respiración',
    'Practicar la Postura Somática del "SÍ" (Steven Hayes)',
    '¿Te cuesta notarlo o la sensación aprieta demasiado?',
    'Si no lo tienes claro, puedes parar un momento a respirar o abrir la postura corporal.',
    'No lo tengo claro · Hacerle hueco en el cuerpo',
    'Hacerle hueco en el cuerpo',
    'Respira alrededor de la sensación sin pelear contra ella.',
    'Listo / Volver al Paso 2',
    'Paso 3: Tomar Distancia',
    '3. Tomar distancia del pensamiento',
    'Pon en una frase lo que te repite la mente para verlo como un pensamiento, no como una orden.',
    'Tengo que poder con todo',
    'No voy a poder sostener esto',
    'Si no cedo, me rechazarán',
    'Míralo con distancia',
    'Notar el pensamiento',
    'Escribe o toca una frase arriba para verla con distancia.',
    'Paso 4: Elegir Micro-Paso',
    'Elegir tu siguiente paso',
    '4. Elegir tu siguiente paso',
    'Elige un gesto pequeño hacia lo que te importa, o registra sin reproche si esta vez ganó el piloto automático.',
    'Hacia mis valores',
    'Caí en piloto automático',
    '¿Qué valor quieres cuidar aquí?',
    'Ver otros valores',
    'Ocultar otros valores',
    'O escribe tu valor guía…',
    'Tu micro-paso ahora (aunque sea pequeño)',
    'Decir que no en 1 frase sin excusas',
    'Priorizar mi descanso',
    'Expresar mi postura con calma',
    '¿Qué reflejo automático tomó el volante?',
    'Nombrarlo sin culpa te ayuda a detectarlo antes la próxima vez.',
    'Con disposición ACT: avanzo hacia',
    'llevando a bordo',
    ', sin esperar a que desaparezca.',
    'Observo con amabilidad que hoy me arrastró',
    '. Registrarlo ya es entrenar presencia.',
    'esta incomodidad',
    'lo que me importa',
    'Fichar en «Mi Autobús» para trabajarlo en calma',
    'Guardar y cerrar',
    'Dirección con valores',
    '1. Nombrar Emoción: pon nombre exacto a lo que sientes (o salta directo al cuerpo si estás muy saturado/a).',
    '2. Sentir en el Cuerpo: ubica la sensación, descríbela y respira si quieres hacerle espacio.',
    '3. Tomar Distancia: observa el pensamiento que repite tu mente desde fuera, sin discutir con él.',
    '4. Elegir Micro-Paso: decide un gesto pequeño hacia tus valores (o registra si ganó el piloto automático).',
    '1. Qué sientes',
    '2. En el cuerpo',
    '3. Qué piensas',
    '4. Tu paso',
    '¿Qué estás sintiendo ahora?',
    '¿Qué tan fuerte es ahora?',
    'Pausa para respirar',
    'Postura de apertura',
    '¿Qué te está diciendo tu mente?',
    'Es solo un pensamiento',
    '¿Qué quieres hacer ahora?',
    '1. Emoción',
    '2. Intensidad',
    '3. Cuerpo',
    '4. Mente',
    '5. Distancia',
    '6. Elección',
    '7. Cierre',
    'Hacia lo que me importa',
    'En piloto automático',
    'Guardar y terminar'
  ];

  for (const key of exactKeys) {
    const tr = i18n.t(key);
    assert.ok(tr && tr !== key, `Expected EN translation for "${key}", got "${tr}"`);
  }

  assert.equal(i18n.t('Nombre de tu mente: «George»'), 'Mind name: "George"');
  assert.equal(i18n.t('¿Dónde notas «Ansiedad» en tu cuerpo?'), 'Where do you notice "Anxiety" in your body?');
  assert.equal(
    i18n.t('"Estoy pensando que Se van a enfadar si digo que no."'),
    '"I am thinking that They will get angry if I say no."'
  );
  assert.equal(
    i18n.t('¿Qué tan fuerte lo sientes ahora? (antes: 8/10)'),
    'How strong is it now? (before: 8/10)'
  );

  assert.equal(i18n.t('Apodo de tu mente: «George»'), 'Mind nickname: "George"');
  assert.equal(i18n.t('Historia de George'), "George's story");
  assert.equal(i18n.t('Gracias, George'), 'Thanks, George');
  assert.equal(
    i18n.t('"George me vuelve a contar la historia de que Soy egoísta por priorizarme."'),
    '"George is telling me the story again that I am selfish for putting myself first."'
  );
  assert.equal(
    i18n.t('Gracias, George, por intentar protegerme con la idea de que Tengo que poder con todo.'),
    'Thank you, George, for trying to protect me with the idea that I have to handle everything.'
  );
  assert.equal(
    i18n.t('¿Cuánto pesa la ola ahora? (antes: 8/10)'),
    'How heavy is the wave now? (before: 8/10)'
  );
  assert.equal(i18n.t('Ciclos completados: 2'), 'Cycles completed: 2');
  assert.equal(i18n.t('Reflejo: "Callarme y ceder"'), 'Reflex: "Stay silent & give in"');
  assert.equal(
    i18n.t('Pasajero a bordo: "Se van a enfadar si digo que no"'),
    'Passenger aboard: "They will get angry if I say no"'
  );
});

test('Espacio ACT renders clickable step pills to jump directly to previous steps', () => {
  const { app, container } = loadActSpaceHarness();

  app.setStep(5);
  assert.ok(container.innerHTML.includes('act-typeform-steps-nav'));
  assert.ok(container.innerHTML.includes('class="act-step-pill completed" data-goto-step="2"'));
  assert.ok(container.innerHTML.includes('class="act-step-pill active" data-goto-step="5"'));

  app.setStep(2);
  assert.equal(app.currentStep, 2, 'Jumping to step 2 should update currentStep to 2');
  assert.ok(container.innerHTML.includes('class="act-step-pill active" data-goto-step="2"'));
});
