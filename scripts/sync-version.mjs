#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PKG_PATH = path.join(ROOT_DIR, 'package.json');
const SW_PATH = path.join(PUBLIC_DIR, 'sw.js');
const HTML_PATH = path.join(PUBLIC_DIR, 'index.html');
const APP_JS_PATH = path.join(PUBLIC_DIR, 'js', 'app.js');

const checkOnly = process.argv.includes('--check');

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
const version = pkg.version;

if (!version || typeof version !== 'string') {
  console.error('[sync-version] Invalid or missing "version" in package.json');
  process.exit(1);
}

const expectedCacheName = `khora-v${version}`;
const errors = [];

function updateOrCheck(filePath, transform, label) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = transform(original);
  if (original !== updated) {
    if (checkOnly) {
      errors.push(`${label} is out of sync with package.json version (${version}). Run: npm run sync:version`);
    } else {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`[sync-version] Updated ${label} -> v${version}`);
    }
  }
  return checkOnly ? original : updated;
}

const swContent = updateOrCheck(
  SW_PATH,
  (src) =>
    src
      .replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = '${expectedCacheName}';`)
      .replace(/\?v=[0-9A-Za-z._-]+/g, `?v=${version}`),
  'public/sw.js'
);

const htmlContent = updateOrCheck(
  HTML_PATH,
  (src) => src.replace(/((?:href|src)="\.\/(?:css|js)\/[^"?]+)\?v=[0-9A-Za-z._-]+(")/g, `$1?v=${version}$2`),
  'public/index.html'
);

// Verify ASSETS_TO_CACHE entries exist on disk
const assetsBlockMatch = swContent.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/);
if (!assetsBlockMatch) {
  errors.push('Could not find ASSETS_TO_CACHE array in public/sw.js');
} else {
  const assets = [...assetsBlockMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const assetSet = new Set(assets);

  for (const asset of assets) {
    const cleanRel = asset.split('?')[0].replace(/^\.\//, '');
    const targetPath = cleanRel === '' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, cleanRel);
    if (!fs.existsSync(targetPath)) {
      errors.push(`ASSETS_TO_CACHE entry does not exist on disk: ${asset} (${path.relative(ROOT_DIR, targetPath)})`);
    }
  }

  // Verify all versioned CSS/JS in index.html are listed in ASSETS_TO_CACHE
  const htmlAssets = [
    ...htmlContent.matchAll(/(?:href|src)="(\.\/(?:css|js)\/[^"]+)"/g)
  ].map((m) => m[1]);

  for (const htmlAsset of htmlAssets) {
    if (!assetSet.has(htmlAsset)) {
      errors.push(`Asset in public/index.html is missing from ASSETS_TO_CACHE in public/sw.js: ${htmlAsset}`);
    }
  }
}

// Verify SW registration in public/js/app.js does not append a ?v= query string
const appJsContent = fs.readFileSync(APP_JS_PATH, 'utf8');
if (/serviceWorker\.register\(['"]\.\/sw\.js\?/.test(appJsContent)) {
  errors.push('public/js/app.js should register "./sw.js" without a ?v= query string');
}

if (errors.length > 0) {
  for (const err of errors) {
    console.error(`[sync-version] ERROR: ${err}`);
  }
  process.exit(1);
}

console.log(`[sync-version] OK (${expectedCacheName})`);
