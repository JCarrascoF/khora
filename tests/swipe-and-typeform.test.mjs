import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const utilsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'utils.js'), 'utf8');
const falsePeaceSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'subapp-false-peace.js'), 'utf8');
const compassSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'subapp-values-compass.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app.js'), 'utf8');
const settingsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app-settings.js'), 'utf8');

function createMockElement(tag = 'div', id = '') {
  const classes = new Set();
  const listeners = new Map();
  const attrs = new Map();
  const styleProps = new Map();
  const el = {
    tagName: tag.toUpperCase(),
    id,
    innerHTML: '',
    outerHTML: `<${tag}${id ? ` id="${id}"` : ''}></${tag}>`,
    dataset: {},
    children: [],
    parentElement: null,
    style: {
      setProperty: (k, v) => styleProps.set(k, v),
      removeProperty: (k) => styleProps.delete(k),
      getPropertyValue: (k) => styleProps.get(k) || '',
      transform: '',
      opacity: '',
      transition: '',
      animation: ''
    },
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      toggle: (c, force) => {
        if (force === undefined) {
          if (classes.has(c)) { classes.delete(c); return false; }
          classes.add(c); return true;
        }
        if (force) classes.add(c); else classes.delete(c);
        return Boolean(force);
      },
      contains: (c) => classes.has(c)
    },
    set className(val) {
      classes.clear();
      String(val || '').split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
    },
    get className() {
      return Array.from(classes).join(' ');
    },
    setAttribute: (k, v) => attrs.set(k, String(v)),
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
    appendChild: (child) => {
      child.parentElement = el;
      el.children.push(child);
      return child;
    },
    insertBefore: (child, ref) => {
      child.parentElement = el;
      const idx = el.children.indexOf(ref);
      if (idx === -1) el.children.push(child);
      else el.children.splice(idx, 0, child);
      return child;
    },
    remove: () => {
      if (!el.parentElement) return;
      const idx = el.parentElement.children.indexOf(el);
      if (idx !== -1) el.parentElement.children.splice(idx, 1);
      el.parentElement = null;
    },
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    dispatchEvent: (event) => {
      event.currentTarget = el;
      event.target = event.target || el;
      for (const fn of (listeners.get(event.type) || [])) fn(event);
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
    matches: () => false,
    offsetWidth: 390
  };
  return el;
}

function createSwipeEnv({ innerWidth = 390 } = {}) {
  const docListeners = new Map();
  const body = createMockElement('body');
  const document = {
    body,
    documentElement: createMockElement('html'),
    createElement: (tag) => createMockElement(tag),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: (type, fn) => {
      if (!docListeners.has(type)) docListeners.set(type, []);
      docListeners.get(type).push(fn);
    }
  };

  const sandbox = {
    window: null,
    document,
    innerWidth,
    setTimeout,
    clearTimeout,
    requestAnimationFrame: (cb) => cb()
  };
  sandbox.window = sandbox;
  vm.runInNewContext(utilsSrc, sandbox);

  const emitTouch = (type, clientX, clientY = 200, target = createMockElement('div')) => {
    const touch = { clientX, clientY };
    const event = {
      type,
      target,
      touches: type === 'touchend' || type === 'touchcancel' ? [] : [touch],
      changedTouches: [touch]
    };
    for (const fn of (docListeners.get(type) || [])) fn(event);
  };

  return { sandbox, emitTouch, KhoraSwipe: sandbox.KhoraSwipe, KhoraUI: sandbox.KhoraUI, KhoraUtils: sandbox.KhoraUtils };
}

test('KhoraSwipe.bind commits horizontal swipe past COMMIT_RATIO and triggers haptic', () => {
  const { KhoraSwipe, emitTouch } = createSwipeEnv({ innerWidth: 400 });
  const stageEl = createMockElement('div');
  const hostEl = createMockElement('div');
  let committed = null;
  let hapticCount = 0;
  let progressCalls = 0;

  KhoraSwipe.bind({
    isBlocked: () => false,
    resolveContext: () => ({
      element: stageEl,
      skeletonHost: hostEl,
      hasTarget: (dir) => dir === 'next',
      onProgress: () => { progressCalls += 1; },
      onClearProgress: () => {},
      onCommit: (dir, state) => { committed = { dir, state }; }
    }),
    onHaptic: () => { hapticCount += 1; }
  });

  // Start at X=300 (inside edge guard 24..376), swipe left 130px (> 26% of 400 = 104px)
  emitTouch('touchstart', 300, 200);
  emitTouch('touchmove', 270, 202);
  emitTouch('touchmove', 170, 204);
  emitTouch('touchend', 170, 204);

  assert.equal(committed?.dir, 'next');
  assert.equal(typeof committed?.state?.offset, 'number');
  assert.equal(hapticCount, 1);
  assert.ok(progressCalls > 0);
});

test('KhoraSwipe.bind ignores edge touches, blocked targets, and vertical scrolls', () => {
  const { KhoraSwipe, emitTouch } = createSwipeEnv({ innerWidth: 400 });
  const stageEl = createMockElement('div');
  let commits = 0;
  let blocked = false;

  KhoraSwipe.bind({
    isBlocked: () => blocked,
    resolveContext: () => ({
      element: stageEl,
      hasTarget: () => true,
      onCommit: () => { commits += 1; }
    })
  });

  // Edge guard (< 24px)
  emitTouch('touchstart', 10, 200);
  emitTouch('touchmove', 180, 200);
  emitTouch('touchend', 180, 200);
  assert.equal(commits, 0);

  // Blocked target
  blocked = true;
  emitTouch('touchstart', 200, 200);
  emitTouch('touchmove', 60, 200);
  emitTouch('touchend', 60, 200);
  assert.equal(commits, 0);

  // Vertical scroll lock (deltaY > 16 && deltaY >= deltaX)
  blocked = false;
  emitTouch('touchstart', 200, 200);
  emitTouch('touchmove', 205, 230);
  emitTouch('touchmove', 70, 235);
  emitTouch('touchend', 70, 235);
  assert.equal(commits, 0);
});

test('KhoraSwipe.bind snaps back without committing when below threshold or lacking target', () => {
  const { KhoraSwipe, emitTouch } = createSwipeEnv({ innerWidth: 400 });
  const stageEl = createMockElement('div');
  let commits = 0;
  let cleared = 0;
  let allowTarget = true;

  KhoraSwipe.bind({
    isBlocked: () => false,
    resolveContext: () => ({
      element: stageEl,
      hasTarget: () => allowTarget,
      onClearProgress: () => { cleared += 1; },
      onCommit: () => { commits += 1; }
    })
  });

  // Below COMMIT_RATIO (40px < 104px)
  emitTouch('touchstart', 250, 200);
  emitTouch('touchmove', 220, 200);
  emitTouch('touchend', 210, 200);
  assert.equal(commits, 0);
  assert.ok(cleared >= 1);

  // No target in direction
  allowTarget = false;
  emitTouch('touchstart', 300, 200);
  emitTouch('touchmove', 140, 200);
  emitTouch('touchend', 140, 200);
  assert.equal(commits, 0);
});

test('KhoraUtils.bindGotoStep and splashSvg work as expected', () => {
  const { KhoraUtils } = createSwipeEnv();
  const jumped = [];
  const btn1 = createMockElement('button');
  btn1.dataset.gotoStep = '2';
  const btnInvalid = createMockElement('button');
  btnInvalid.dataset.gotoStep = '';

  const scope = {
    querySelectorAll: (sel) => (sel === '[data-goto-step]' ? [btn1, btnInvalid] : [])
  };

  KhoraUtils.bindGotoStep(scope, (step) => jumped.push(step));
  btn1.dispatchEvent({ type: 'click' });
  btnInvalid.dispatchEvent({ type: 'click' });
  assert.deepEqual(jumped, [2]);

  const svg = KhoraUtils.splashSvg('feedback-pull-icon "x"', 48);
  assert.match(svg, /width="48" height="48"/);
  assert.match(svg, /class="feedback-pull-icon &quot;x&quot;"/);
  assert.match(svg, /class="khora-logo-ring"/);
});

test('KhoraUI.prepareTypeformTransition and animateTypeformTransition handle tap and swipe transitions', () => {
  const { KhoraUI, sandbox } = createSwipeEnv();
  const root = createMockElement('div', 'act-space-view');
  const stage = createMockElement('div');
  stage.classList.add('act-typeform-stage');
  const content = createMockElement('div');
  content.outerHTML = '<div id="old-step" class="step-body">Paso 1</div>';
  const footer = createMockElement('div');
  footer.classList.add('act-typeform-footer');
  stage.appendChild(content);
  stage.appendChild(footer);

  const titleBtn = createMockElement('button');
  titleBtn.outerHTML = '<button id="step-trigger" class="act-typeform-step-trigger">1. Emoción</button>';
  const header = createMockElement('div');
  header.appendChild(titleBtn);

  root.querySelector = (sel) => {
    if (sel === '.act-typeform-stage') return stage;
    if (sel === '.act-typeform-step-trigger, .act-typeform-step-counter-mobile') return titleBtn;
    return null;
  };
  sandbox.document.getElementById = (id) => (id === 'act-space-view' ? root : null);

  // Tap transition: captures leaving HTML without ids
  KhoraUI.prepareTypeformTransition('act-space-view');
  KhoraUI.animateTypeformTransition('act-space-view', 1, 2, 7);

  const leaving = stage.children.find(c => c.classList.contains('act-typeform-leaving'));
  assert.ok(leaving, 'should insert leaving snapshot');
  assert.doesNotMatch(leaving.innerHTML, /id="old-step"/);
  assert.equal(stage.classList.contains('swipe-from-right'), true);
  assert.equal(titleBtn.classList.contains('step-label-next'), true);

  // Swipe commit transition: sets --swipe-start-x and skips leaving snapshot
  stage.classList.remove('swipe-from-right');
  KhoraUI.setPendingSwipeCommit({ offset: 120, opacity: 0.45 });
  KhoraUI.prepareTypeformTransition('act-space-view');
  KhoraUI.animateTypeformTransition('act-space-view', 2, 1, 7);
  assert.equal(stage.classList.contains('swipe-from-left'), true);
  assert.equal(titleBtn.classList.contains('step-label-prev'), true);
  assert.equal(stage.style.getPropertyValue('--swipe-start-x'), '120px');
  assert.equal(stage.style.getPropertyValue('--swipe-start-opacity'), '0.45');
});

test('PazFalsaApp and BrujulaValoresApp expose STEPS, renderTypeformShell, and disabled Atrás on step 1', () => {
  const { KhoraUI, KhoraUtils } = createSwipeEnv();
  const sandbox = {
    window: null,
    document: {
      getElementById: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    KhoraUI,
    KhoraUtils,
    stateManager: { getState: () => ({ pazFalsa: [], compass: [], profile: { values: [] } }) }
  };
  sandbox.window = sandbox;

  const PazFalsaApp = vm.runInNewContext(`${falsePeaceSrc}\n;PazFalsaApp;`, sandbox);
  const BrujulaValoresApp = vm.runInNewContext(`${compassSrc}\n;BrujulaValoresApp;`, sandbox);

  const pf = new PazFalsaApp();
  assert.equal(pf.totalSteps, 5);
  assert.equal(PazFalsaApp.STEPS.length, 5);
  assert.match(pf.renderStep1(), /<button type="button" class="btn-secondary" disabled>Atrás<\/button>/);

  const comp = new BrujulaValoresApp();
  assert.equal(comp.totalSteps, 4);
  assert.equal(BrujulaValoresApp.STEPS.length, 4);
  assert.match(comp.renderStep1(), /<button type="button" class="btn-secondary" disabled>Atrás<\/button>/);
});

test('AppController setFlowImmersive/exitFlowImmersive and app-settings dev reload button', () => {
  assert.match(appSrc, /setFlowImmersive\(active, onExit = null\)/);
  assert.match(appSrc, /exitFlowImmersive\(\)/);
  assert.match(appSrc, /document\.body\.classList\.remove\('flow-immersive', 'flow-keyboard-open'\)/);
  assert.match(appSrc, /this\.initTabSwipeGesture\(\)/);

  // Verify settings dev reload button is wired when _noSwRequested is true
  assert.match(settingsSrc, /if \(this\._noSwRequested\)/);
  assert.match(settingsSrc, /id="btn-dev-force-reload"/);
  assert.match(settingsSrc, /this\._forceDevReload\?\.\(\{ clearCaches: true \}\)/);
});
