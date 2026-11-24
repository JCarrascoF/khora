import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const utilsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'utils.js'), 'utf8');

function loadKhoraUI() {
  const sandbox = { window: {}, setTimeout, clearTimeout };
  sandbox.window = sandbox;
  vm.runInNewContext(utilsSrc, sandbox);
  return sandbox.KhoraUI;
}

test('KhoraUI.renderHeader renders title and step badge cleanly without scattered help triggers', () => {
  const KhoraUI = loadKhoraUI();

  const html = KhoraUI.renderHeader({
    title: 'Mi Flujo ACT',
    currentStep: 2,
    totalSteps: 5,
    helpTopic: 'act-flow'
  });

  assert.match(html, /<h2 class="card-title"[^>]*>Mi Flujo ACT<\/h2>/);
  assert.doesNotMatch(html, /help-info-trigger/);
  assert.match(html, /Paso 2 de 5/);
});

test('KhoraUI.buttonInlineState transitions pending -> ok -> restored', async () => {
  const KhoraUI = loadKhoraUI();
  const classes = new Set();
  const btn = {
    innerHTML: 'Enviar feedback',
    textContent: 'Enviar feedback',
    disabled: false,
    dataset: {},
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      has: (c) => classes.has(c)
    }
  };

  KhoraUI.buttonInlineState(btn, 'pending', 'Enviando…');
  assert.equal(btn.disabled, true);
  assert.equal(btn.textContent, 'Enviando…');
  assert.equal(classes.has('btn-inline-pending'), true);

  let doneCalled = false;
  KhoraUI.buttonInlineState(btn, 'ok', '✓ Enviado', {
    resetMs: 25,
    onDone: () => { doneCalled = true; }
  });
  assert.equal(btn.textContent, '✓ Enviado');
  assert.equal(classes.has('btn-inline-ok'), true);

  await new Promise(r => setTimeout(r, 45));
  assert.equal(doneCalled, true);
  assert.equal(btn.disabled, false);
  assert.equal(btn.innerHTML, 'Enviar feedback');
  assert.equal(classes.has('btn-inline-ok'), false);
});

test('KhoraUI.renderStepper renders nodes variant with correct active/completed states', () => {
  const KhoraUI = loadKhoraUI();

  const html = KhoraUI.renderStepper({
    currentStep: 2,
    totalSteps: 4,
    variant: 'nodes'
  });

  assert.match(html, /class="step-bar-container"/);
  assert.match(html, /class="step-node completed">1<\/div>/);
  assert.match(html, /class="step-node active">2<\/div>/);
  assert.match(html, /class="step-node ">3<\/div>/);
  assert.match(html, /class="step-node ">4<\/div>/);
  assert.match(html, /style="width: 33\.33/);
});

test('KhoraUI.renderStepper renders pills variant with clickable step pills', () => {
  const KhoraUI = loadKhoraUI();

  const html = KhoraUI.renderStepper({
    currentStep: 1,
    totalSteps: 3,
    variant: 'pills',
    steps: [
      { step: 1, label: 'Emoción' },
      { step: 2, label: 'Cuerpo' },
      { step: 3, label: 'Elección' }
    ]
  });

  assert.match(html, /class="act-typeform-steps-nav"/);
  assert.match(html, /class="act-step-pill active" data-goto-step="1"/);
  assert.match(html, /class="act-step-pill " data-goto-step="2"/);
});

test('KhoraUI.renderActionBar renders previous and next buttons in a btn-group', () => {
  const KhoraUI = loadKhoraUI();

  const html = KhoraUI.renderActionBar({
    prevId: 'btn-prev',
    prevLabel: 'Volver',
    nextId: 'btn-next',
    nextLabel: 'Siguiente paso'
  });

  assert.match(html, /class="btn-group"/);
  assert.match(html, /id="btn-prev"[^>]*>Volver<\/button>/);
  assert.match(html, /id="btn-next"[^>]*>Siguiente paso<\/button>/);
});

test('KhoraUI.renderEmptyState escapes user-provided content', () => {
  const KhoraUI = loadKhoraUI();

  const html = KhoraUI.renderEmptyState({
    title: 'Sin elementos <script>',
    description: 'No hay registros & datos'
  });

  assert.match(html, /Sin elementos &lt;script&gt;/);
  assert.match(html, /No hay registros &amp; datos/);
});

test('KhoraUI.renderInternalTabs renders accessible tab buttons', () => {
  const KhoraUI = loadKhoraUI();

  const html = KhoraUI.renderInternalTabs({
    tabs: [
      { id: 'tab1', label: 'Valores' },
      { id: 'tab2', label: 'Autobús' }
    ],
    activeId: 'tab1',
    dataAttr: 'data-profile-tab'
  });

  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-selected="true" class="internal-tab-btn active" data-profile-tab="tab1">Valores<\/button>/);
  assert.match(html, /aria-selected="false" class="internal-tab-btn " data-profile-tab="tab2">Autobús<\/button>/);
});

test('KhoraUI.renderTypeformShell renders exit control, compact mobile step dropdown, and desktop pills', () => {
  const KhoraUI = loadKhoraUI();

  const html = KhoraUI.renderTypeformShell({
    currentStep: 2,
    totalSteps: 3,
    steps: [
      { step: 1, label: '1. Contexto' },
      { step: 2, label: '2. Situación' },
      { step: 3, label: '3. Límite' }
    ],
    stepHtml: '<p>Contenido</p>'
  });

  assert.match(html, /class="act-typeform-exit-btn" data-flow-exit/);
  assert.match(html, /class="act-typeform-step-trigger"[^>]*><span>2 \/ 3 · <strong>Situación<\/strong><\/span>/);
  assert.match(html, /class="act-typeform-step-dropdown hidden"/);
  assert.match(html, /class="act-typeform-dropdown-item completed" data-goto-step="1"[^>]*><span>1\. Contexto<\/span><span class="act-typeform-dropdown-check" aria-hidden="true">✓<\/span>/);
  assert.match(html, /class="act-typeform-dropdown-item active" data-goto-step="2" aria-current="step"><span>2\. Situación<\/span><\/button>/);
  assert.doesNotMatch(html, /●/);
  assert.match(html, /class="act-step-pill active" data-goto-step="2"/);
});
