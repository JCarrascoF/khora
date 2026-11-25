import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const utilsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'utils.js'), 'utf8');

function loadUtils(overrides = {}) {
  const sandbox = { window: {} };
  Object.assign(sandbox, overrides);
  sandbox.window = sandbox;
  vm.runInNewContext(utilsSrc, sandbox);
  return sandbox.KhoraUtils;
}

test('KhoraUtils.escapeHtml escapes HTML special characters and handles nullish/non-string values', () => {
  const { escapeHtml } = loadUtils();

  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(42), '42');
  assert.equal(escapeHtml('Hola Khōra'), 'Hola Khōra');
  assert.equal(
    escapeHtml('<script>alert("xss" & \'1\')</script>'),
    '&lt;script&gt;alert(&quot;xss&quot; &amp; &#39;1&#39;)&lt;/script&gt;'
  );
});

test('KhoraUtils.hasHorizontalOverflow detects horizontal scrollable overflow', () => {
  const wideEl = { scrollWidth: 300, clientWidth: 200 };
  const narrowEl = { scrollWidth: 100, clientWidth: 200 };

  // With overflowX = auto → true
  let { hasHorizontalOverflow } = loadUtils({ getComputedStyle: () => ({ overflowX: 'auto' }) });
  assert.equal(hasHorizontalOverflow(null), false, 'null should return false');
  assert.equal(hasHorizontalOverflow(undefined), false, 'undefined should return false');
  assert.equal(hasHorizontalOverflow(42), false, 'non-object should return false');
  assert.equal(hasHorizontalOverflow(narrowEl), false, 'no overflow → false');
  assert.equal(hasHorizontalOverflow(wideEl), true, 'overflow + auto → true');

  // With overflowX = scroll → true
  ({ hasHorizontalOverflow } = loadUtils({ getComputedStyle: () => ({ overflowX: 'scroll' }) }));
  assert.equal(hasHorizontalOverflow(wideEl), true, 'overflow + scroll → true');

  // With overflowX = hidden → false
  ({ hasHorizontalOverflow } = loadUtils({ getComputedStyle: () => ({ overflowX: 'hidden' }) }));
  assert.equal(hasHorizontalOverflow(wideEl), false, 'overflow + hidden → false');

  // Without getComputedStyle → false (graceful degradation)
  ({ hasHorizontalOverflow } = loadUtils());
  assert.equal(hasHorizontalOverflow(wideEl), false, 'no getComputedStyle → false');

  // Explicit win parameter overrides VM window
  assert.equal(
    hasHorizontalOverflow(wideEl, { getComputedStyle: () => ({ overflowX: 'auto' }) }),
    true,
    'explicit win parameter → true'
  );
});
