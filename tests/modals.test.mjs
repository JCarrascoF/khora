import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'public', 'css', 'styles.css'), 'utf8');
const surfacesCss = fs.readFileSync(path.join(ROOT_DIR, 'public', 'css', 'surfaces.css'), 'utf8');
const appJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app.js'), 'utf8');

function createClassList(initial = []) {
  const set = new Set(initial);
  return {
    add(...tokens) {
      tokens.forEach((t) => set.add(t));
    },
    remove(...tokens) {
      tokens.forEach((t) => set.delete(t));
    },
    contains(token) {
      return set.has(token);
    },
    toggle(token, force) {
      if (force === undefined) {
        if (set.has(token)) { set.delete(token); return false; }
        set.add(token); return true;
      }
      if (force) { set.add(token); return true; }
      set.delete(token); return false;
    },
    values() {
      return [...set];
    }
  };
}

function loadAppController() {
  const modalClassList = createClassList();
  const modalBodyClassList = createClassList();
  const scrollEvents = [];

  let currentScrollTop = 0;
  const modal = { classList: modalClassList };
  const modalBody = {
    classList: modalBodyClassList,
    get scrollTop() {
      return currentScrollTop;
    },
    set scrollTop(value) {
      currentScrollTop = value;
      scrollEvents.push({
        value,
        modalActive: modalClassList.contains('active')
      });
    }
  };

  let stopTrickTimerCalls = 0;
  const noop = () => {};
  const sandbox = {
    window: {
      KhoraAppSettingsMixin: {},
      KhoraAppHelpMixin: {},
      pildorasAnclajesApp: {
        stopTrickTimer() {
          stopTrickTimerCalls += 1;
        }
      }
    },
    document: {
      addEventListener: noop,
      getElementById(id) {
        if (id === 'app-modal') return modal;
        if (id === 'modal-body') return modalBody;
        return null;
      }
    },
    console
  };
  sandbox.window.window = sandbox.window;
  sandbox.globalThis = sandbox;

  vm.runInNewContext(`${appJsSrc}\n;globalThis.__AppController = AppController;`, sandbox);
  const controller = new sandbox.__AppController();
  return {
    controller,
    modal,
    modalBody,
    scrollEvents,
    getStopTrickTimerCalls: () => stopTrickTimerCalls
  };
}

test('CSS anchors all #app-modal overlays consistently at the top over the app', () => {
  assert.match(
    stylesCss,
    /\.modal-overlay\s*\{[^}]*align-items:\s*flex-start;[^}]*padding:\s*calc\(clamp\(20px,\s*6dvh,\s*56px\)\s*\+\s*env\(safe-area-inset-top\)\)/s,
    'styles.css .modal-overlay must align flex-start with top safe-area clamp padding'
  );
  assert.match(
    surfacesCss,
    /\.modal-overlay\s*\{[^}]*align-items:\s*flex-start;[^}]*padding:\s*calc\(clamp\(20px,\s*6dvh,\s*56px\)\s*\+\s*env\(safe-area-inset-top\)\)/s,
    'surfaces.css .modal-overlay must anchor all modals using the Settings top offset'
  );

  assert.equal(
    surfacesCss.includes('.modal-overlay:has(#storage-mode-modal-root)'),
    false,
    'Settings modal overlay positioning must apply globally instead of via :has(#storage-mode-modal-root)'
  );

  assert.equal(
    /\.modal-overlay\s*\{[^}]*align-items:\s*flex-end/s.test(stylesCss),
    false,
    'styles.css must not push .modal-overlay to flex-end on mobile'
  );
  assert.equal(
    /\.modal-overlay\s*\{[^}]*align-items:\s*flex-end/s.test(surfacesCss),
    false,
    'surfaces.css must not push .modal-overlay to flex-end on mobile'
  );

  assert.match(
    surfacesCss,
    /\.modal-card:has\(#storage-mode-modal-root\)\s*\{[^}]*min-height:/s,
    'Settings modal card must retain steady min-height across tab switches'
  );

  assert.match(stylesCss, /\.modal-overlay\s*\{[^}]*overscroll-behavior:\s*contain;/s);
  assert.match(stylesCss, /\.modal-card\s*\{[^}]*overscroll-behavior:\s*contain;/s);
  assert.match(surfacesCss, /\.modal-overlay\s*\{[^}]*overscroll-behavior:\s*contain;/s);
  assert.match(surfacesCss, /\.modal-card\s*\{[^}]*overscroll-behavior:\s*contain;/s);

  assert.match(
    stylesCss,
    /\.modal-overlay\.active\s*\{[^}]*animation:\s*modalOverlayFadeIn\b/s,
    'Overlay backdrop should fade opacity without shifting vertically'
  );
  assert.match(
    stylesCss,
    /\.modal-overlay\.active\s+\.modal-card\s*\{[^}]*animation:\s*fadeIn\b/s,
    'Modal card should perform the entrance animation'
  );
  assert.match(
    stylesCss,
    /\.privacy-lock-overlay\s*\{[^}]*align-items:\s*center;/s,
    'Full-screen privacy lock overlay must remain centered'
  );
});

test('AppController modal lifecycle manages sizes, scroll reset timing, and clean close', () => {
  const { controller, modal, modalBody, scrollEvents, getStopTrickTimerCalls } = loadAppController();

  // Open wide modal (e.g. Settings) and simulate user scrolling down
  assert.equal(controller.openModal('wide'), true);
  assert.equal(modal.classList.contains('active'), true);
  assert.equal(modalBody.classList.contains('modal-wide'), true);
  assert.equal(scrollEvents.at(-1).value, 0);
  assert.equal(scrollEvents.at(-1).modalActive, true, 'scrollTop reset must happen while modal is active');

  modalBody.scrollTop = 240;

  // Switching directly to maximized wheel clears modal-wide and applies modal-wheel-maximized + resets scroll
  assert.equal(controller.openModal('wheel'), true);
  assert.equal(modalBody.classList.contains('modal-wide'), false);
  assert.equal(modalBody.classList.contains('modal-medium'), false);
  assert.equal(modalBody.classList.contains('modal-wheel-maximized'), true);
  assert.equal(modalBody.scrollTop, 0);

  // Preserving scroll on in-place updates (e.g. Value Wizard step toggles)
  modalBody.scrollTop = 180;
  assert.equal(controller.openModal('medium', { resetScroll: false }), true);
  assert.equal(modalBody.classList.contains('modal-wheel-maximized'), false);
  assert.equal(modalBody.classList.contains('modal-medium'), true);
  assert.equal(modalBody.scrollTop, 180);

  // resetModalScroll resets scroll explicitly (e.g. Settings tab switch)
  controller.resetModalScroll();
  assert.equal(modalBody.scrollTop, 0);

  // closeModal resets scroll while still active, removes active, clears sizes, and stops timers
  modalBody.scrollTop = 120;
  scrollEvents.length = 0;
  assert.equal(controller.closeModal(), true);
  assert.equal(modal.classList.contains('active'), false);
  assert.equal(modalBody.classList.contains('modal-medium'), false);
  assert.equal(modalBody.scrollTop, 0);
  assert.equal(scrollEvents[0].value, 0);
  assert.equal(scrollEvents[0].modalActive, true, 'closeModal must reset scrollTop before hiding modal');
  assert.equal(getStopTrickTimerCalls(), 1);
  assert.equal(controller.closeModal(), false);
});

test('All JS modals route through openModal/closeModal without stray setModalSize calls', () => {
  const jsDir = path.join(ROOT_DIR, 'public', 'js');
  const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));

  const actSpaceSrc = fs.readFileSync(path.join(jsDir, 'subapp-act-space.js'), 'utf8');
  assert.match(
    actSpaceSrc,
    /openMaximizedWheelModal\(\)[\s\S]*window\.app\.openModal\('wheel'\)/,
    'openMaximizedWheelModal must open via window.app.openModal("wheel")'
  );

  for (const file of jsFiles) {
    const src = fs.readFileSync(path.join(jsDir, file), 'utf8');
    if (file !== 'app.js') {
      assert.equal(
        src.includes('setModalSize'),
        false,
        `${file} should call openModal(size) instead of setModalSize directly`
      );
    }

    const lines = src.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes("modal.classList.add('active')")) {
        const surrounding = lines.slice(Math.max(0, idx - 6), idx + 1).join('\n');
        const allowed =
          (file === 'app.js' && surrounding.includes('openModal(')) ||
          surrounding.includes('openModal');
        assert.equal(
          allowed,
          true,
          `${file}:${idx + 1} activates modal without going through openModal()`
        );
      }
    });
  }
});

function loadPwaController({
  userAgent = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
  standalone = false,
  iosStandalone = false,
  maxTouchPoints = 0,
  dbMode = 'local',
  serverAvailable = false,
  serverChecked = true,
  vaultLocked = false,
  initialLocalStorage = {}
} = {}) {
  const lsStore = { ...initialLocalStorage };
  const ssStore = {};
  const bannerClassList = createClassList(['persistence-warning-banner', 'hidden']);
  const modalClassList = createClassList();
  const modalBodyClassList = createClassList();
  const buttonElements = new Map();

  const registerIdsFromHtml = (html, scope) => {
    for (const [id, entry] of buttonElements.entries()) {
      if (entry.scope === scope) buttonElements.delete(id);
    }
    for (const m of String(html || '').matchAll(/\bid="([^"]+)"/g)) {
      const id = m[1];
      const listeners = {};
      buttonElements.set(id, {
        scope,
        id,
        addEventListener(type, fn) {
          if (!listeners[type]) listeners[type] = [];
          listeners[type].push(fn);
        },
        click() {
          (listeners.click || []).forEach((fn) => fn());
        }
      });
    }
  };

  let bannerHtml = '';
  const banner = {
    classList: bannerClassList,
    get innerHTML() {
      return bannerHtml;
    },
    set innerHTML(val) {
      bannerHtml = String(val || '');
      registerIdsFromHtml(bannerHtml, 'banner');
    }
  };

  let modalHtml = '';
  const modal = { classList: modalClassList };
  const modalBody = {
    classList: modalBodyClassList,
    scrollTop: 0,
    get innerHTML() {
      return modalHtml;
    },
    set innerHTML(val) {
      modalHtml = String(val || '');
      registerIdsFromHtml(modalHtml, 'modal');
    }
  };

  const navObj = { userAgent, maxTouchPoints, standalone: iosStandalone };
  const matchMedia = (query) => ({
    matches: Boolean(standalone && query === '(display-mode: standalone)')
  });
  const stateManager = {
    getDbStatus: () => ({ mode: dbMode, serverAvailable, serverChecked }),
    getStorageMode: () => dbMode,
    isVaultLocked: () => vaultLocked
  };

  const noop = () => {};
  const sandbox = {
    navigator: navObj,
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(lsStore, k) ? lsStore[k] : null),
      setItem: (k, v) => { lsStore[k] = String(v); },
      removeItem: (k) => { delete lsStore[k]; }
    },
    sessionStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(ssStore, k) ? ssStore[k] : null),
      setItem: (k, v) => { ssStore[k] = String(v); },
      removeItem: (k) => { delete ssStore[k]; }
    },
    matchMedia,
    window: {
      KhoraAppSettingsMixin: {},
      KhoraAppHelpMixin: {},
      navigator: navObj,
      matchMedia,
      stateManager,
      pildorasAnclajesApp: { stopTrickTimer: noop }
    },
    stateManager,
    document: {
      addEventListener: noop,
      getElementById(id) {
        if (id === 'app-modal') return modal;
        if (id === 'modal-body') return modalBody;
        if (id === 'persistence-warning-banner') return banner;
        return buttonElements.get(id) || null;
      }
    },
    console
  };
  sandbox.window.window = sandbox.window;
  sandbox.globalThis = sandbox;

  vm.runInNewContext(`${appJsSrc}\n;globalThis.__AppController = AppController;`, sandbox);
  const controller = new sandbox.__AppController();
  return {
    controller,
    banner,
    modal,
    modalBody,
    lsStore,
    clickEl: (id) => {
      const el = buttonElements.get(id);
      assert.ok(el, `Expected element #${id} to exist`);
      el.click();
    }
  };
}

test('Android device detection & one-time Chrome URL notice banner in standalone PWA', () => {
  const androidUa = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36';
  const iosUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
  const desktopUa = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

  // 1. Device detection
  const androidStandalone = loadPwaController({ userAgent: androidUa, standalone: true, dbMode: 'db', serverAvailable: true });
  assert.equal(androidStandalone.controller.isAndroidDevice(), true);
  assert.equal(loadPwaController({ userAgent: iosUa }).controller.isAndroidDevice(), false);
  assert.equal(loadPwaController({ userAgent: desktopUa }).controller.isAndroidDevice(), false);

  // 2. Android standalone shows calm info banner once (even in db mode), and "Entendido" dismisses permanently
  androidStandalone.controller.updatePersistenceWarningBanner();
  assert.equal(androidStandalone.banner.classList.contains('hidden'), false);
  assert.equal(androidStandalone.banner.classList.contains('persistence-warning-banner--info'), true);
  assert.ok(androidStandalone.banner.innerHTML.includes('Toca para copiar la URL de esta aplicación'));

  androidStandalone.clickEl('btn-banner-android-url-ok');
  assert.equal(androidStandalone.lsStore.act_android_url_notice_dismissed, '1');
  assert.equal(androidStandalone.banner.classList.contains('hidden'), true);
  assert.equal(androidStandalone.banner.classList.contains('persistence-warning-banner--info'), false);

  androidStandalone.controller.updatePersistenceWarningBanner();
  assert.equal(androidStandalone.banner.classList.contains('hidden'), true);

  // 3. Close button ("✕") also dismisses permanently
  const androidDismissX = loadPwaController({ userAgent: androidUa, standalone: true });
  androidDismissX.controller.updatePersistenceWarningBanner();
  assert.equal(androidDismissX.banner.classList.contains('hidden'), false);
  androidDismissX.clickEl('btn-banner-android-url-dismiss');
  assert.equal(androidDismissX.lsStore.act_android_url_notice_dismissed, '1');
  assert.equal(androidDismissX.banner.classList.contains('hidden'), true);

  // 4. Hidden on iOS standalone, desktop standalone, and when vault is locked
  const iosEnv = loadPwaController({ userAgent: iosUa, standalone: true, iosStandalone: true });
  iosEnv.controller.updatePersistenceWarningBanner();
  assert.equal(iosEnv.banner.classList.contains('hidden'), true);

  const desktopEnv = loadPwaController({ userAgent: desktopUa, standalone: true });
  desktopEnv.controller.updatePersistenceWarningBanner();
  assert.equal(desktopEnv.banner.classList.contains('hidden'), true);

  const lockedEnv = loadPwaController({ userAgent: androidUa, standalone: true, vaultLocked: true });
  lockedEnv.controller.updatePersistenceWarningBanner();
  assert.equal(lockedEnv.banner.classList.contains('hidden'), true);

  // 5. Mobile non-standalone warning strips --info modifier if present
  const androidTab = loadPwaController({ userAgent: androidUa, standalone: false });
  androidTab.banner.classList.add('persistence-warning-banner--info');
  androidTab.controller.updatePersistenceWarningBanner();
  assert.equal(androidTab.banner.classList.contains('hidden'), false);
  assert.equal(androidTab.banner.classList.contains('persistence-warning-banner--info'), false);
  assert.ok(androidTab.banner.innerHTML.includes('Pestaña temporal en móvil:'));
});

test('Install gate modal & Settings PWA section explain Android Chrome URL notification', () => {
  const androidUa = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36';
  const iosUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
  const desktopUa = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

  // Branch A: Android mobile browser tab includes note, iOS tab does not
  const androidTab = loadPwaController({ userAgent: androidUa, standalone: false });
  androidTab.controller.openInstallGateModal();
  assert.ok(androidTab.modalBody.innerHTML.includes('Pasos en Android (Chrome):'));
  assert.ok(androidTab.modalBody.innerHTML.includes('Toca para copiar la URL de esta aplicación'));
  assert.equal(androidTab.lsStore.act_android_url_notice_dismissed, undefined);

  const iosTab = loadPwaController({ userAgent: iosUa, standalone: false });
  iosTab.controller.openInstallGateModal();
  assert.ok(iosTab.modalBody.innerHTML.includes('Pasos en iPhone / iPad (Safari):'));
  assert.equal(iosTab.modalBody.innerHTML.includes('Toca para copiar la URL de esta aplicación'), false);

  // Branch B: Android standalone includes note and dismissing marks notice dismissed + hides banner
  const androidStandalone = loadPwaController({ userAgent: androidUa, standalone: true });
  androidStandalone.controller.updatePersistenceWarningBanner();
  assert.equal(androidStandalone.banner.classList.contains('hidden'), false);
  androidStandalone.controller.openInstallGateModal();
  assert.ok(androidStandalone.modalBody.innerHTML.includes('Toca para copiar la URL de esta aplicación'));
  androidStandalone.clickEl('btn-gate-continue-anyway');
  assert.equal(androidStandalone.lsStore.act_android_url_notice_dismissed, '1');
  assert.equal(androidStandalone.banner.classList.contains('hidden'), true);

  // Branch B on Desktop omits Android note
  const desktopEnv = loadPwaController({ userAgent: desktopUa, standalone: false });
  desktopEnv.controller.openInstallGateModal();
  assert.equal(desktopEnv.modalBody.innerHTML.includes('Toca para copiar la URL de esta aplicación'), false);

  // Settings PWA section includes Android Chrome URL notice
  const settingsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app-settings.js'), 'utf8');
  assert.match(
    settingsSrc,
    /Usar como App en el Móvil \(PWA\)[\s\S]*Aviso normal de Chrome en Android:[\s\S]*Toca para copiar la URL de esta aplicación/
  );
});

test('Feedback modal submits anonymously to /api/feedback without requiring an account', async () => {
  const { onRequestPost } = await import('../functions/api/feedback.js');

  // 1. Rejects empty feedback
  const emptyRes = await onRequestPost({
    request: new Request('https://khora.pages.dev/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Sugerencia o nueva idea', title: '   ', message: '' })
    }),
    env: { GITHUB_FEEDBACK_TOKEN: 'ghp_test' }
  });
  assert.equal(emptyRes.status, 400);

  // 2. Honeypot silently succeeds without calling upstream fetch
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return new Response('{}', { status: 201 });
  };
  try {
    const botRes = await onRequestPost({
      request: new Request('https://khora.pages.dev/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Spam', message: 'Buy stuff', website: 'http://spam.example' })
      }),
      env: { GITHUB_FEEDBACK_TOKEN: 'ghp_test' }
    });
    assert.equal(botRes.status, 200);
    assert.equal(fetchCalled, false);

    // 3. Missing token returns 503
    const unconfiguredRes = await onRequestPost({
      request: new Request('https://khora.pages.dev/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Idea', message: 'Detalle' })
      }),
      env: {}
    });
    assert.equal(unconfiguredRes.status, 503);

    // 4. Valid feedback creates GitHub issue via upstream API
    let capturedUrl = '';
    let capturedInit = null;
    globalThis.fetch = async (url, init) => {
      capturedUrl = url;
      capturedInit = init;
      return new Response(JSON.stringify({ html_url: 'https://github.com/JCarrascoF/khora/issues/99' }), {
        status: 201
      });
    };
    const okRes = await onRequestPost({
      request: new Request('https://khora.pages.dev/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Sugerencia o nueva idea',
          title: 'Filtro nuevo',
          message: 'Sería útil filtrar por fecha',
          lang: 'es',
          mode: 'local',
          website: ''
        })
      }),
      env: { GITHUB_FEEDBACK_TOKEN: 'ghp_secret_token' }
    });
    assert.equal(okRes.status, 201);
    assert.equal(capturedUrl, 'https://api.github.com/repos/JCarrascoF/khora/issues');
    assert.equal(capturedInit.method, 'POST');
    assert.equal(capturedInit.headers.Authorization, 'Bearer ghp_secret_token');
    const sentBody = JSON.parse(capturedInit.body);
    assert.equal(sentBody.title, '[Feedback] Filtro nuevo');
    assert.match(sentBody.body, /Sería útil filtrar por fecha/);
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 5. Frontend modal renders direct submit button, honeypot, copy and GitHub fallback
  assert.match(appJsSrc, /id="btn-feedback-submit"/);
  assert.match(appJsSrc, /id="feedback-website"/);
  assert.match(appJsSrc, /fetch\('\/api\/feedback'/);
});

test('Feedback swipe gesture works inside active exercise modal (>50% viewport) and uses dedicated overlay', () => {
  assert.match(stylesCss, /\.feedback-pull-overlay\s*\{/);
  assert.match(stylesCss, /\.feedback-pull-splash\s*\{/);
  assert.match(stylesCss, /\.feedback-modal-overlay\s*\{/);

  const docListeners = {};
  const elementsById = new Map();
  const appModal = { id: 'app-modal', classList: createClassList(['active']) };
  elementsById.set('app-modal', appModal);

  const makeEl = (tag = 'div') => {
    const classList = createClassList();
    const styleProps = {};
    const el = {
      tagName: tag.toUpperCase(),
      classList,
      style: {
        setProperty(k, v) { styleProps[k] = v; },
        getPropertyValue(k) { return styleProps[k] || ''; }
      },
      attributes: {},
      children: [],
      _innerHTML: '',
      _textContent: '',
      set className(val) {
        classList.remove(...classList.values());
        String(val || '').split(/\s+/).filter(Boolean).forEach((c) => classList.add(c));
      },
      get className() {
        return classList.values().join(' ');
      },
      set id(val) {
        this._id = val;
        if (val) elementsById.set(val, this);
      },
      get id() {
        return this._id;
      },
      setAttribute(k, v) { this.attributes[k] = v; },
      addEventListener() {},
      appendChild(child) {
        this.children.push(child);
        if (child.id) elementsById.set(child.id, child);
        return child;
      },
      set innerHTML(html) {
        this._innerHTML = html;
        if (html.includes('id="feedback-modal-card"')) {
          const card = makeEl('div');
          card.id = 'feedback-modal-card';
          this.children.push(card);
        }
      },
      get innerHTML() {
        return this._innerHTML;
      },
      set textContent(val) {
        this._textContent = val;
      },
      get textContent() {
        return this._textContent;
      },
      querySelector(sel) {
        const cls = sel.startsWith('.') ? sel.slice(1) : null;
        if (!cls) return null;
        if (!this._qCache) this._qCache = {};
        if (!this._qCache[cls]) {
          this._qCache[cls] = makeEl('div');
        }
        return this._qCache[cls];
      }
    };
    return el;
  };

  const scrollContainer = {
    nodeType: 1,
    scrollTop: 400,
    clientHeight: 600,
    scrollHeight: 1000,
    parentElement: null
  };

  const body = makeEl('body');
  const docEl = { scrollTop: 0, clientHeight: 800, scrollHeight: 800 };

  const sandbox = {
    window: {
      innerHeight: 800,
      KhoraAppSettingsMixin: {},
      KhoraAppHelpMixin: {},
      getComputedStyle: () => ({ overflowY: 'auto' })
    },
    document: {
      body,
      documentElement: docEl,
      scrollingElement: docEl,
      createElement: (tag) => makeEl(tag),
      getElementById: (id) => elementsById.get(id) || null,
      addEventListener(type, fn) {
        docListeners[type] = docListeners[type] || [];
        docListeners[type].push(fn);
      }
    },
    navigator: {},
    console
  };
  sandbox.window.window = sandbox.window;
  sandbox.globalThis = sandbox;

  vm.runInNewContext(`${appJsSrc}\n;globalThis.__AppController = AppController;`, sandbox);
  const controller = new sandbox.__AppController();
  controller.initFeedbackGesture();

  const emitTouch = (type, clientY, target = scrollContainer) => {
    const ev = type === 'touchend' || type === 'touchcancel'
      ? { touches: [] }
      : { target, touches: [{ clientX: 180, clientY }] };
    (docListeners[type] || []).forEach((fn) => fn(ev));
  };

  // 1. Short swipe (< 50% viewport) shows "Desliza más..." and does NOT open feedback
  emitTouch('touchstart', 700);
  emitTouch('touchmove', 450); // deltaY = -250 (< 52% of 800 = 416)
  const overlayEl = body.children.find((c) => c.classList.contains('feedback-pull-overlay'));
  assert.ok(overlayEl, 'feedback-pull-overlay should be created');
  assert.equal(overlayEl.querySelector('.feedback-pull-label').textContent, 'Desliza más si quieres enviar feedback');
  assert.equal(overlayEl.classList.contains('ready'), false);
  emitTouch('touchend', 450);
  assert.equal(elementsById.get('feedback-modal-overlay'), undefined);

  // 2. Long swipe (> 52% viewport) while #app-modal is active switches text and opens dedicated overlay
  emitTouch('touchstart', 750);
  emitTouch('touchmove', 250); // deltaY = -500 (> 416)
  assert.equal(overlayEl.classList.contains('ready'), true);
  assert.equal(overlayEl.querySelector('.feedback-pull-label').textContent, 'Suelta si quieres enviar feedback');
  assert.equal(overlayEl.style.getPropertyValue('--pull-pct'), '100%', 'long swipe must set --pull-pct to 100%');
  emitTouch('touchend', 250);

  const feedbackModalOverlay = elementsById.get('feedback-modal-overlay');
  assert.ok(feedbackModalOverlay, 'dedicated #feedback-modal-overlay should be created');
  assert.equal(feedbackModalOverlay.classList.contains('active'), true);
  assert.equal(appModal.classList.contains('active'), true, 'underlying #app-modal exercise must remain active');

  // 3. Closing feedback modal leaves #app-modal intact
  assert.equal(controller.closeFeedbackModal(), true);
  assert.equal(feedbackModalOverlay.classList.contains('active'), false);
  assert.equal(appModal.classList.contains('active'), true);
});

test('Mobile hides #app-footer and Settings exposes dedicated Acerca de tab', () => {
  const settingsJsSrc = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'app-settings.js'), 'utf8');
  assert.match(stylesCss, /@media\s*\(max-width:\s*767px\)\s*\{\s*\.app-footer\s*\{\s*display:\s*none;\s*\}\s*\}/);
  assert.match(settingsJsSrc, /data-settings-tab="acerca"/);
  assert.match(settingsJsSrc, /activeSettingsTab === 'acerca'/);
});
