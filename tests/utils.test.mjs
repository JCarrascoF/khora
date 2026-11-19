import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const utilsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'utils.js'), 'utf8');

function loadUtils() {
  const sandbox = { window: {} };
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
