import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'public', 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'public', 'css', 'tokens.css'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'public', 'manifest.json'), 'utf8'));

function extractPrePaintScript(html) {
  const match = html.match(/<!-- Pre-paint theme & palette hydration[\s\S]*?<script>([\s\S]*?)<\/script>/);
  assert.ok(match, 'Pre-paint inline script not found in public/index.html');
  return match[1];
}

function runPrePaint(storageData = {}) {
  const attrs = {};
  const styleProps = {};
  const metaAttrs = { content: '' };

  const sandbox = {
    window: {
      matchMedia: () => ({ matches: false })
    },
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(storageData, k) ? storageData[k] : null)
    },
    document: {
      documentElement: {
        setAttribute: (k, v) => {
          attrs[k] = v;
        },
        style: {
          setProperty: (k, v) => {
            styleProps[k] = v;
          }
        }
      },
      querySelector: (sel) => {
        if (sel === 'meta[name="theme-color"]') {
          return {
            setAttribute: (k, v) => {
              metaAttrs[k] = v;
            }
          };
        }
        return null;
      }
    }
  };
  sandbox.window.window = sandbox.window;
  vm.runInNewContext(extractPrePaintScript(indexHtml), sandbox);
  return { window: sandbox.window, attrs, styleProps, metaThemeColor: metaAttrs.content };
}

function extractCssBgPrimary(palette, theme) {
  const selector =
    theme === 'dark'
      ? `\\[data-theme="dark"\\]\\[data-palette="${palette}"\\]`
      : `\\[data-palette="${palette}"\\]`;
  const re = new RegExp(`${selector}\\s*\\{[^}]*--bg-primary:\\s*(#[0-9a-fA-F]{6})`, 'i');
  const m = stylesCss.match(re);
  assert.ok(m, `Could not find --bg-primary for ${palette} (${theme}) in public/css/styles.css`);
  return m[1].toUpperCase();
}

test('Pre-paint palette colors match styles.css --bg-primary and manifest.json', () => {
  const { window } = runPrePaint();
  const colors = window.__KHORA_PALETTE_COLORS__;
  assert.ok(colors, 'window.__KHORA_PALETTE_COLORS__ must be defined');

  for (const palette of ['arcilla', 'musgo', 'sepia', 'niebla']) {
    for (const theme of ['light', 'dark']) {
      assert.equal(
        colors[palette][theme].toUpperCase(),
        extractCssBgPrimary(palette, theme),
        `Mismatch for ${palette}.${theme} between index.html and styles.css`
      );
    }
  }

  assert.equal(manifest.background_color.toUpperCase(), colors.arcilla.light.toUpperCase());
  assert.equal(manifest.theme_color.toUpperCase(), colors.arcilla.light.toUpperCase());
});

test('Custom palette pre-paint validates hex and sets WCAG --custom-on-accent', () => {
  const { styleProps, metaThemeColor } = runPrePaint({
    act_theme_pref: 'light',
    act_palette_pref: 'custom',
    act_custom_palette_pref: JSON.stringify({
      light: { bg: '#FFFFFF', text: 'not-a-hex', accent: '#F2E572' }
    })
  });

  assert.equal(styleProps['--custom-bg'], '#FFFFFF');
  assert.equal(styleProps['--custom-text'], '#262420');
  assert.equal(styleProps['--custom-accent'], '#F2E572');
  assert.equal(styleProps['--custom-on-accent'], '#1A1A18');
  assert.equal(metaThemeColor, '#FFFFFF');
});

test('__KHORA_GET_ON_ACCENT__ picks readable foreground for dark, light, and invalid hex', () => {
  const { window } = runPrePaint();
  const getOnAccent = window.__KHORA_GET_ON_ACCENT__;
  assert.equal(typeof getOnAccent, 'function');

  assert.equal(getOnAccent('#1B1613'), '#FAF8F4');
  assert.equal(getOnAccent('#F3EDE4'), '#1A1A18');
  assert.equal(getOnAccent('#5D6E64'), '#FAF8F4');
  assert.equal(getOnAccent('invalid'), '#FAF8F4');
});
