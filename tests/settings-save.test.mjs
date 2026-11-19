import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'public', 'index.html'), 'utf8');
const settingsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app-settings.js'), 'utf8');

function createMockElement(tagName, id = '') {
  const attrs = {};
  const classes = new Set();
  const children = [];
  const el = {
    tagName: String(tagName || 'div').toUpperCase(),
    id,
    get className() {
      return [...classes].join(' ');
    },
    set className(val) {
      classes.clear();
      String(val || '')
        .split(/\s+/)
        .filter(Boolean)
        .forEach((c) => classes.add(c));
    },
    children,
    firstChild: null,
    parentNode: null,
    textContent: '',
    innerHTML: '',
    dataset: new Proxy(
      {},
      {
        get(_, prop) {
          const attr = 'data-' + String(prop).replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          return attrs[attr];
        },
        set(_, prop, val) {
          const attr = 'data-' + String(prop).replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          attrs[attr] = String(val);
          return true;
        }
      }
    ),
    classList: {
      add: (...names) => names.forEach((n) => classes.add(n)),
      remove: (...names) => names.forEach((n) => classes.delete(n)),
      contains: (n) => classes.has(n)
    },
    setAttribute: (k, v) => {
      attrs[k] = String(v);
      if (k === 'id') el.id = String(v);
    },
    getAttribute: (k) => (Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null),
    insertBefore: (node, ref) => {
      node.parentNode = el;
      const idx = ref ? children.indexOf(ref) : -1;
      if (idx === -1) children.push(node);
      else children.splice(idx, 0, node);
      el.firstChild = children[0] || null;
      return node;
    },
    appendChild: (node) => {
      node.parentNode = el;
      children.push(node);
      el.firstChild = children[0] || null;
      return node;
    },
    querySelector: (selector) => {
      if (selector === '.settings-save-label') {
        if (el._labelEl) return el._labelEl;
        for (const child of children) {
          const found = child.querySelector?.(selector);
          if (found) return found;
        }
      }
      if (selector === '.settings-title-row') {
        if (classes.has('settings-title-row')) return el;
        for (const child of children) {
          const found = child.querySelector?.(selector);
          if (found) return found;
        }
      }
      return null;
    }
  };
  return el;
}

function loadSettingsHarness({ withExistingIndicator = true, lang = 'es', flushImpl = null } = {}) {
  const modal = createMockElement('div', 'app-modal');
  modal.classList.add('modal-overlay', 'active');
  const modalBody = createMockElement('div', 'modal-body');
  const storageRoot = createMockElement('div', 'storage-mode-modal-root');
  const titleRow = createMockElement('div');
  titleRow.className = 'settings-title-row';
  const heading = createMockElement('h3');
  heading.className = 'card-title';
  heading.textContent = 'Configuración y Ajustes Técnicos';
  titleRow.appendChild(heading);
  storageRoot.appendChild(titleRow);
  modalBody.appendChild(storageRoot);
  modal.appendChild(modalBody);

  let indicator = null;
  let labelEl = null;

  const attachIndicatorParts = (ind) => {
    labelEl = createMockElement('span');
    labelEl.className = 'settings-save-label';
    ind._labelEl = labelEl;
    ind.appendChild(labelEl);
    return ind;
  };

  if (withExistingIndicator) {
    indicator = attachIndicatorParts(createMockElement('span', 'settings-save-indicator'));
    indicator.className = 'settings-save-indicator';
    indicator.dataset.state = 'idle';
    titleRow.appendChild(indicator);
  }

  const findById = (root, id) => {
    if (!root) return null;
    if (root.id === id) return root;
    for (const child of root.children || []) {
      const hit = findById(child, id);
      if (hit) return hit;
    }
    return null;
  };

  const sandbox = {
    window: null,
    document: {
      getElementById: (id) => findById(modal, id),
      querySelector: (selector) => {
        if (selector === '#storage-mode-modal-root .settings-title-row') {
          return findById(modal, 'storage-mode-modal-root')?.querySelector('.settings-title-row') || null;
        }
        return null;
      },
      createElement: (tag) => {
        const node = createMockElement(tag);
        // Mirror declarative label child created via innerHTML in getSettingsSaveIndicator
        attachIndicatorParts(node);
        return node;
      }
    },
    stateManager: {
      flushPendingWrites: flushImpl || (() => Promise.resolve(true))
    },
    i18n: {
      translateText: (phrase) => {
        if (lang !== 'en') return phrase;
        const map = { 'Guardando…': 'Saving…', 'Guardado': 'Saved' };
        return map[phrase] || phrase;
      }
    },
    setTimeout,
    clearTimeout,
    Promise,
    console
  };
  sandbox.window = sandbox;

  vm.runInNewContext(settingsSrc, sandbox);

  const controller = Object.create(sandbox.KhoraAppSettingsMixin);
  return {
    controller,
    modal,
    titleRow,
    getIndicator: () => findById(modal, 'settings-save-indicator'),
    getLabel: () => findById(modal, 'settings-save-indicator')?.querySelector('.settings-save-label')
  };
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('settings-save-indicator is rendered inline in title row rather than outside modal-body', () => {
  assert.equal(
    indexHtml.includes('id="settings-save-indicator"'),
    false,
    'public/index.html should not render #settings-save-indicator outside #modal-body'
  );
  assert.match(
    settingsSrc,
    /<div class="settings-title-row">\s*<h3 class="card-title">Configuración y Ajustes Técnicos<\/h3>\s*<span id="settings-save-indicator"/s,
    'app-settings.js must render #settings-save-indicator inside .settings-title-row right after the heading'
  );
});

test('triggerSettingsSaveIndicator transitions idle -> saving -> saved -> idle', async () => {
  const { controller, titleRow, getIndicator, getLabel } = loadSettingsHarness();
  const ind = getIndicator();
  assert.equal(ind.parentNode, titleRow);
  assert.equal(ind.dataset.state, 'idle');

  const p = controller.triggerSettingsSaveIndicator(null, {
    minSpinnerMs: 25,
    savedVisibleMs: 35,
    flushTimeoutMs: 200
  });

  assert.equal(ind.dataset.state, 'saving');
  assert.equal(getLabel().textContent, 'Guardando…');

  await p;
  assert.equal(ind.dataset.state, 'saved');
  assert.equal(getLabel().textContent, 'Guardado');

  await delay(55);
  assert.equal(ind.dataset.state, 'idle');
});

test('rapid consecutive triggers coalesce and only the latest switches to saved and idle', async () => {
  const { controller, getIndicator, getLabel } = loadSettingsHarness();
  const ind = getIndicator();

  const p1 = controller.triggerSettingsSaveIndicator(null, {
    minSpinnerMs: 20,
    savedVisibleMs: 35,
    flushTimeoutMs: 200
  });
  await delay(5);
  const p2 = controller.triggerSettingsSaveIndicator(null, {
    minSpinnerMs: 40,
    savedVisibleMs: 35,
    flushTimeoutMs: 200
  });

  await p1;
  assert.equal(ind.dataset.state, 'saving', 'first trigger must not finish saving prematurely');
  assert.equal(getLabel().textContent, 'Guardando…');

  await p2;
  assert.equal(ind.dataset.state, 'saved');
  assert.equal(getLabel().textContent, 'Guardado');

  await delay(55);
  assert.equal(ind.dataset.state, 'idle');
});

test('triggerSettingsSaveIndicator keeps saving state until asyncWork resolves', async () => {
  let resolveWork;
  const asyncWork = () => new Promise((resolve) => {
    resolveWork = resolve;
  });

  const { controller, getIndicator, getLabel } = loadSettingsHarness();
  const ind = getIndicator();

  const p = controller.triggerSettingsSaveIndicator(asyncWork, {
    minSpinnerMs: 5,
    savedVisibleMs: 30,
    flushTimeoutMs: 200
  });

  await delay(20);
  assert.equal(ind.dataset.state, 'saving');
  assert.equal(getLabel().textContent, 'Guardando…');

  resolveWork();
  await p;
  assert.equal(ind.dataset.state, 'saved');
  assert.equal(getLabel().textContent, 'Guardado');

  await delay(45);
  assert.equal(ind.dataset.state, 'idle');
});

test('hideSettingsSaveIndicator mid-save cancels pending transition and resets to idle', async () => {
  const { controller, getIndicator, getLabel } = loadSettingsHarness();
  const ind = getIndicator();

  const p = controller.triggerSettingsSaveIndicator(null, {
    minSpinnerMs: 30,
    savedVisibleMs: 40,
    flushTimeoutMs: 200
  });

  assert.equal(ind.dataset.state, 'saving');
  controller.hideSettingsSaveIndicator();

  assert.equal(ind.dataset.state, 'idle');
  assert.equal(getLabel().textContent, '');

  await p;
  await delay(50);
  assert.equal(ind.dataset.state, 'idle');
  assert.equal(getLabel().textContent, '');
});

test('triggerSettingsSaveIndicator translates labels to English when i18n is EN and lazily creates indicator in title row', async () => {
  const { controller, modal, titleRow, getIndicator, getLabel } = loadSettingsHarness({
    withExistingIndicator: false,
    lang: 'en'
  });

  assert.equal(getIndicator(), null);

  const p = controller.triggerSettingsSaveIndicator(null, {
    minSpinnerMs: 15,
    savedVisibleMs: 25,
    flushTimeoutMs: 200
  });

  const created = getIndicator();
  assert.ok(created, 'indicator should be lazily created inside .settings-title-row');
  assert.equal(created.parentNode, titleRow, 'indicator should be appended inside .settings-title-row');
  assert.notEqual(created.parentNode, modal, 'indicator must not be mounted directly under #app-modal');
  assert.equal(created.dataset.state, 'saving');
  assert.equal(getLabel().textContent, 'Saving…');

  await p;
  assert.equal(created.dataset.state, 'saved');
  assert.equal(getLabel().textContent, 'Saved');

  await delay(40);
  assert.equal(created.dataset.state, 'idle');
});
