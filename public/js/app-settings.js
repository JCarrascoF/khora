/**
 * Theme, Palette, Surface & Technical Settings Modal Mixin for AppController.
 * Loaded immediately before public/js/app.js.
 */
(function (global) {
  global.KhoraAppSettingsMixin = {
  // Theme & Palette Management
  getDefaultCustomPalette() {
    const def = window.__KHORA_DEFAULT_CUSTOM_PALETTE__;
    if (def?.light && def?.dark) {
      return {
        light: { ...def.light },
        dark: { ...def.dark }
      };
    }
    return {
      light: { bg: '#F4F1EA', text: '#262420', accent: '#5D6E64' },
      dark: { bg: '#1B1D1C', text: '#EAECE9', accent: '#94ABA0' }
    };
  },

  getCustomPalette() {
    const def = this.getDefaultCustomPalette();
    const settings = window.stateManager?.getSettings?.() || {};
    let cp = settings.customPalette;
    if (!cp) {
      try {
        const raw = localStorage.getItem('act_custom_palette_pref');
        if (raw) cp = JSON.parse(raw);
      } catch {
        cp = null;
      }
    }
    const isHex = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);
    return {
      light: {
        bg: isHex(cp?.light?.bg) ? cp.light.bg : def.light.bg,
        text: isHex(cp?.light?.text) ? cp.light.text : def.light.text,
        accent: isHex(cp?.light?.accent) ? cp.light.accent : def.light.accent
      },
      dark: {
        bg: isHex(cp?.dark?.bg) ? cp.dark.bg : def.dark.bg,
        text: isHex(cp?.dark?.text) ? cp.dark.text : def.dark.text,
        accent: isHex(cp?.dark?.accent) ? cp.dark.accent : def.dark.accent
      }
    };
  },

  getReadableOnAccent(hex) {
    if (typeof window.__KHORA_GET_ON_ACCENT__ === 'function') {
      return window.__KHORA_GET_ON_ACCENT__(hex);
    }
    if (typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) return '#FAF8F4';
    const relLum = (h) => {
      const ch = [1, 3, 5].map((i) => {
        const c = parseInt(h.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
    };
    const lBg = relLum(hex);
    const lDark = relLum('#1A1A18');
    const lLight = relLum('#FAF8F4');
    const cDark = (Math.max(lBg, lDark) + 0.05) / (Math.min(lBg, lDark) + 0.05);
    const cLight = (Math.max(lBg, lLight) + 0.05) / (Math.min(lBg, lLight) + 0.05);
    return cDark >= cLight ? '#1A1A18' : '#FAF8F4';
  },

  applyCustomPaletteVars() {
    const root = document.documentElement;
    const palette = root.getAttribute('data-palette');
    if (palette !== 'custom') {
      root.style.removeProperty('--custom-bg');
      root.style.removeProperty('--custom-text');
      root.style.removeProperty('--custom-accent');
      root.style.removeProperty('--custom-on-accent');
      return;
    }
    const theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const cp = this.getCustomPalette()[theme];
    root.style.setProperty('--custom-bg', cp.bg);
    root.style.setProperty('--custom-text', cp.text);
    root.style.setProperty('--custom-accent', cp.accent);
    root.style.setProperty('--custom-on-accent', this.getReadableOnAccent(cp.accent));
  },

  saveCustomPalette(nextCp) {
    const settings = window.stateManager.getSettings();
    settings.customPalette = nextCp;
    settings.palette = 'custom';
    window.stateManager.saveSettings(settings);
    document.documentElement.setAttribute('data-palette', 'custom');
    this.applyCustomPaletteVars();
    this.updateThemeColorMeta();
    this.emitThemeChange({ palette: 'custom' });
  },

  exportCustomThemeFile() {
    const cp = this.getCustomPalette();
    const payload = {
      type: 'khora-theme',
      version: 1,
      exportedAt: new Date().toISOString(),
      light: cp.light,
      dark: cp.dark
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'khora-theme.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    this.showToast('Tema personal exportado (khora-theme.json)');
  },

  updateThemeColorMeta() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const rawPal = document.documentElement.getAttribute('data-palette');
    const palette = ['arcilla', 'musgo', 'sepia', 'niebla', 'custom'].includes(rawPal) ? rawPal : 'arcilla';
    const colors = window.__KHORA_PALETTE_COLORS__;
    const col = palette === 'custom'
      ? this.getCustomPalette()[theme].bg
      : (colors?.[palette]?.[theme] || (theme === 'dark' ? '#1B1613' : '#F3EDE4'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', col);
    }
  },

  emitThemeChange(detail = {}) {
    window.dispatchEvent(new CustomEvent('khora:themechange', { detail }));
  },

  initTheme() {
    const settings = window.stateManager.getSettings();
    const currentTheme = settings.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);
    this.applyCustomPaletteVars();
    this.updateThemeColorMeta();
  },

  setTheme(newTheme) {
    const resolved = newTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);

    const settings = window.stateManager.getSettings();
    settings.theme = resolved;
    window.stateManager.saveSettings(settings);

    this.updateThemeIcon(resolved);
    this.applyCustomPaletteVars();
    this.updateThemeColorMeta();
    this.emitThemeChange({ theme: resolved });
  },

  initPalette() {
    const valid = ['arcilla', 'musgo', 'sepia', 'niebla', 'custom'];
    const settings = window.stateManager.getSettings();
    let palette = settings.palette;
    if (!valid.includes(palette)) {
      try {
        const stored = localStorage.getItem('act_palette_pref');
        palette = valid.includes(stored) ? stored : 'arcilla';
      } catch {
        palette = 'arcilla';
      }
    }
    document.documentElement.setAttribute('data-palette', palette);
    this.applyCustomPaletteVars();
    this.updateThemeColorMeta();
  },

  setPalette(newPalette) {
    const valid = ['arcilla', 'musgo', 'sepia', 'niebla', 'custom'];
    const resolved = valid.includes(newPalette) ? newPalette : 'arcilla';
    document.documentElement.setAttribute('data-palette', resolved);

    const settings = window.stateManager.getSettings();
    settings.palette = resolved;
    window.stateManager.saveSettings(settings);

    this.applyCustomPaletteVars();
    this.updateThemeColorMeta();
    this.emitThemeChange({ palette: resolved });
  },

  initSurface() {
    const settings = window.stateManager.getSettings();
    let surface = settings.surface;
    if (surface !=='lino' && surface !=='editorial') {
      try {
        const stored = localStorage.getItem('act_surface_pref');
        surface = stored ==='lino' ?'lino' :'editorial';
      } catch {
        surface ='editorial';
      }
    }
    document.documentElement.setAttribute('data-surface', surface);
  },

  setSurface(newSurface) {
    const resolved = newSurface ==='lino' ?'lino' :'editorial';
    document.documentElement.setAttribute('data-surface', resolved);

    const settings = window.stateManager.getSettings();
    settings.surface = resolved;
    window.stateManager.saveSettings(settings);
  },

  initButtons() {
    const settings = window.stateManager.getSettings();
    let buttons = settings.buttons;
    if (buttons !== 'editorial' && buttons !== 'ultraligero') {
      try {
        const stored = localStorage.getItem('act_buttons_pref');
        buttons = stored === 'editorial' ? 'editorial' : 'ultraligero';
      } catch {
        buttons = 'ultraligero';
      }
    }
    document.documentElement.setAttribute('data-buttons', buttons);
  },

  setButtons(newButtons) {
    const resolved = newButtons === 'editorial' ? 'editorial' : 'ultraligero';
    document.documentElement.setAttribute('data-buttons', resolved);

    const settings = window.stateManager.getSettings();
    settings.buttons = resolved;
    window.stateManager.saveSettings(settings);
  },

  initExplanations() {
    const settings = window.stateManager.getSettings();
    let explanations = settings.explanations;
    if (explanations !== 'hide' && explanations !== 'show') {
      try {
        const stored = localStorage.getItem('act_explanations_pref');
        explanations = stored === 'hide' ? 'hide' : 'show';
      } catch {
        explanations = 'show';
      }
    }
    document.documentElement.setAttribute('data-explanations', explanations);
  },

  setExplanations(newVal) {
    const resolved = newVal === 'hide' ? 'hide' : 'show';
    document.documentElement.setAttribute('data-explanations', resolved);

    const settings = window.stateManager.getSettings();
    settings.explanations = resolved;
    window.stateManager.saveSettings(settings);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },

  updateThemeIcon(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;
    if (theme === 'dark') {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      btn.setAttribute('title', 'Cambiar a modo claro');
    } else {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      btn.setAttribute('title', 'Cambiar a modo oscuro');
    }
  },

  getSettingsSaveIndicator() {
    let indicator = document.getElementById('settings-save-indicator');
    if (indicator) return indicator;
    const host = document.querySelector?.('#storage-mode-modal-root .settings-title-row')
      || document.getElementById('storage-mode-modal-root');
    if (!host || typeof document.createElement !== 'function') return null;
    indicator = document.createElement('span');
    indicator.id = 'settings-save-indicator';
    indicator.className = 'settings-save-indicator';
    indicator.setAttribute('data-state', 'idle');
    indicator.setAttribute('data-no-i18n', 'true');
    indicator.setAttribute('role', 'status');
    indicator.setAttribute('aria-live', 'polite');
    indicator.setAttribute('aria-atomic', 'true');
    indicator.innerHTML = `
      <span class="settings-save-spinner" aria-hidden="true"></span>
      <svg class="settings-save-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span class="settings-save-label"></span>
    `;
    host.appendChild(indicator);
    return indicator;
  },

  hideSettingsSaveIndicator() {
    this._settingsSaveSeq = (this._settingsSaveSeq || 0) + 1;
    if (this._settingsSaveHideTimer) {
      clearTimeout(this._settingsSaveHideTimer);
      this._settingsSaveHideTimer = null;
    }
    const indicator = document.getElementById('settings-save-indicator');
    if (!indicator) return;
    indicator.dataset.state = 'idle';
    const labelEl = indicator.querySelector?.('.settings-save-label');
    if (labelEl) labelEl.textContent = '';
  },

  async triggerSettingsSaveIndicator(asyncWork = null, options = {}) {
    const {
      minSpinnerMs = 260,
      savedVisibleMs = 1500,
      flushTimeoutMs = 2000
    } = options;
    const translate = (phrase) => (window.i18n?.translateText ? window.i18n.translateText(phrase) : phrase);
    const indicator = this.getSettingsSaveIndicator();
    if (!indicator) {
      if (typeof asyncWork === 'function') await asyncWork();
      return;
    }

    const seq = (this._settingsSaveSeq || 0) + 1;
    this._settingsSaveSeq = seq;
    if (this._settingsSaveHideTimer) {
      clearTimeout(this._settingsSaveHideTimer);
      this._settingsSaveHideTimer = null;
    }

    const labelEl = indicator.querySelector?.('.settings-save-label');
    const savingText = translate('Guardando…');
    if (indicator.dataset.state !== 'saving') {
      indicator.dataset.state = 'saving';
    }
    if (labelEl && labelEl.textContent !== savingText) {
      labelEl.textContent = savingText;
    }

    const minBeat = minSpinnerMs > 0
      ? new Promise((resolve) => setTimeout(resolve, minSpinnerMs))
      : Promise.resolve();

    try {
      if (typeof asyncWork === 'function') {
        await asyncWork();
      }
      const flushPromise = window.stateManager?.flushPendingWrites
        ? window.stateManager.flushPendingWrites(flushTimeoutMs)
        : Promise.resolve();
      await Promise.all([minBeat, flushPromise]);
    } catch (err) {
      if (seq === this._settingsSaveSeq) {
        this.hideSettingsSaveIndicator();
      }
      throw err;
    }

    if (seq !== this._settingsSaveSeq) return;

    const modal = document.getElementById('app-modal');
    if (!modal?.classList?.contains('active') || !document.getElementById('storage-mode-modal-root')) {
      this.hideSettingsSaveIndicator();
      return;
    }

    const currentIndicator = this.getSettingsSaveIndicator();
    if (!currentIndicator) return;
    const currentLabelEl = currentIndicator.querySelector?.('.settings-save-label');
    currentIndicator.dataset.state = 'saved';
    if (currentLabelEl) {
      currentLabelEl.textContent = translate('Guardado');
    }

    this._settingsSaveHideTimer = setTimeout(() => {
      if (seq !== this._settingsSaveSeq) return;
      const latestIndicator = document.getElementById('settings-save-indicator');
      if (latestIndicator) {
        latestIndicator.dataset.state = 'idle';
      }
      this._settingsSaveHideTimer = null;
    }, savedVisibleMs);
  },

  async openStorageModeModal() {
    return this.openSettingsModal();
  },

  // Unified Technical Settings Modal (Appearance, Sensory, DB Storage, Backups & PWA)
  async openSettingsModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody || !window.stateManager) return;

    const openId = (this._settingsModalOpenId || 0) + 1;
    this._settingsModalOpenId = openId;

    const refreshCurrentViewIfNeeded = () => {
      if (this.currentView) {
        this.navigate(this.currentView, { keepModal: true, updateHash: false });
      }
    };

    let activeSettingsTab = 'apariencia';

    modalBody.innerHTML = `
      <div id="storage-mode-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
            <div class="settings-title-row">
              <h3 class="card-title">Configuración y Ajustes Técnicos</h3>
              <span id="settings-save-indicator" class="settings-save-indicator" data-state="idle" data-no-i18n="true" role="status" aria-live="polite" aria-atomic="true">
                <span class="settings-save-spinner" aria-hidden="true"></span>
                <svg class="settings-save-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span class="settings-save-label"></span>
              </span>
            </div>
            <p class="card-subtitle mt-1" style="line-height: 1.45;">
              Privacidad AES-256, tema visual, almacenamiento SQLite/Navegador, copias de seguridad y app móvil.
            </p>
          </div>
          <button type="button" class="btn-icon" id="btn-storage-modal-close" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        <div id="settings-modal-dynamic-content"></div>

        <div class="btn-group" style="margin-top: 14px; justify-content: flex-end;">
          <button type="button" class="btn-primary" id="btn-storage-modal-done" style="font-size: 0.82rem;">
            Listo
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-storage-modal-close')?.addEventListener('click', () => {
      this.closeModal();
    });
    document.getElementById('btn-storage-modal-done')?.addEventListener('click', () => {
      this.closeModal();
    });

    const dynamicContent = document.getElementById('settings-modal-dynamic-content');
    if (!dynamicContent) return;

    const renderModalContent = ({ resetScroll = false } = {}) => {
      const prevScroll = (!resetScroll && modal.classList.contains('active')) ? modalBody.scrollTop : 0;
      const status = window.stateManager.getDbStatus();
      const settings = window.stateManager.getSettings() || {};
      const currentTheme = document.documentElement.getAttribute('data-theme') || settings.theme || 'light';
      const currentPalette = document.documentElement.getAttribute('data-palette') || settings.palette ||'arcilla';
      const currentSurface = document.documentElement.getAttribute('data-surface') || settings.surface ||'editorial';
      const currentButtons = document.documentElement.getAttribute('data-buttons') || settings.buttons || 'ultraligero';
      const vibOn = settings.vibration !== false;
      const sndOn = settings.sound === true;
      const mode = status.mode || window.stateManager.getStorageMode();
      const vault = window.stateManager.getVaultStatus ? window.stateManager.getVaultStatus() : { enabled: false, locked: false, autoLockMinutes: 5 };
      const exampleCount = window.stateManager.countExampleItems ? window.stateManager.countExampleItems() : 0;
      const serverAvailable = Boolean(status.serverAvailable);
      const showDbSection = serverAvailable || mode === 'db';
      const authRequired = Boolean(status.authRequired);
      const authenticated = authRequired ? Boolean(status.authenticated) : true;
      const canUseDb = serverAvailable && authenticated;
      const serverRecords = status.serverCounts?.totalRecords ?? null;
      const lastSyncText = status.lastSync
        ? new Date(status.lastSync).toLocaleTimeString(window.i18n?.getLocale?.() || 'es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : '—';
      const currentLang = window.i18n?.getLang?.() || 'es';
      const anchorsOn = settings.showAnchorsCard !== false;
      const explanationsOn = (document.documentElement.getAttribute('data-explanations') || settings.explanations || 'show') !== 'hide';

      const serverBadge = serverAvailable
        ? (authRequired && !authenticated
          ?`<span class="badge" style="background: rgba(201, 138, 88, 0.18); color: #c98a58;">Sesión requerida para BD SQLite</span>`
          :`<span class="badge" style="background: rgba(87, 139, 116, 0.18); color: var(--sage-700);">Servidor SQLite accesible${serverRecords !== null ?` (${serverRecords} registros)` :''}</span>`)
        :`<span class="badge" style="background: rgba(201, 138, 88, 0.18); color: #c98a58;">Servidor SQLite no accesible ahora</span>`;

      const authBadgeHtml = (serverAvailable && authRequired)
        ? (authenticated
          ?`<span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700);">Sesión: ${status.authUser ||'admin'}</span>`
          : '')
        : '';

      const vaultBadgeHtml = vault.enabled
        ?`<span class="badge" style="background: rgba(87, 139, 116, 0.18); color: var(--sage-700);">Cifrado AES-256-GCM Activo</span>`
        : `<span class="badge" style="background: var(--bg-surface); color: var(--text-muted);">Sin bloqueo / sin cifrar</span>`;

      dynamicContent.innerHTML = `
          <div class="internal-tabs-bar" role="tablist" style="margin-top: 12px; margin-bottom: 14px;">
            <button type="button" class="internal-tab-btn ${activeSettingsTab === 'apariencia' ? 'active' : ''}" data-settings-tab="apariencia" role="tab" aria-selected="${activeSettingsTab === 'apariencia'}">Apariencia</button>
            <button type="button" class="internal-tab-btn ${activeSettingsTab === 'privacidad' ? 'active' : ''}" data-settings-tab="privacidad" role="tab" aria-selected="${activeSettingsTab === 'privacidad'}">Privacidad</button>
            <button type="button" class="internal-tab-btn ${activeSettingsTab === 'datos' ? 'active' : ''}" data-settings-tab="datos" role="tab" aria-selected="${activeSettingsTab === 'datos'}">Datos y App</button>
          </div>

          <div class="modal-grid-2col" style="margin-top: 6px;">
            ${activeSettingsTab === 'privacidad' ? `
            <!-- 0. Privacidad, Bloqueo y Cifrado AES-256-GCM -->
<div class="settings-section-block">
<div class="flex-between" style="gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
<div class="settings-section-title">
                Bloqueo de Privacidad y Cifrado (AES-256)
              </div>
              ${vaultBadgeHtml}
            </div>
            <p style="font-size: 0.77rem; color: var(--text-secondary); line-height: 1.4; margin: 0 0 10px 0;">
              Cifra todos tus registros (navegador y SQLite) con tu PIN o contraseña y permite desbloquear con FaceID / Huella. Si olvidas la clave sin tener copia JSON, los datos cifrados no se podrán recuperar.
            </p>
            ${!vault.cryptoSupported ? `
              <div style="font-size: 0.78rem; color: #c98a58; background: rgba(201, 138, 88, 0.12); border-radius: var(--radius-sm); padding: 8px 10px;">
                El navegador exige<strong>HTTPS / localhost</strong> para activar Web Crypto AES-256 (funciona en GitHub Pages, localhost o Tailscale HTTPS).
              </div>
            ` : (vault.enabled ? `
              <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px;">
                <button type="button" class="btn-secondary" id="btn-vault-lock-now" style="font-size: 0.78rem; padding: 7px 11px;">
                  Bloquear ahora
                </button>
                ${vault.biometricSupported ? (vault.biometricEnabled ? `
                  <button type="button" class="btn-secondary" id="btn-vault-remove-bio" style="font-size: 0.78rem; padding: 7px 11px; border-color: var(--sage-500);">
                    FaceID / Huella activo (Quitar)
                  </button>
                ` : `
                  <button type="button" class="btn-primary" id="btn-vault-enable-bio" style="font-size: 0.78rem; padding: 7px 11px;">
                    Activar FaceID / Huella
                  </button>
                `) : ''}
                <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.77rem; color: var(--text-secondary);">
                  Auto-bloqueo:
                  <select id="select-vault-autolock" class="form-select" style="padding: 4px 8px; font-size: 0.77rem; width: auto;">
                    <option value="0" ${vault.autoLockMinutes === 0 ? 'selected' : ''}>Al cambiar de app</option>
                    <option value="1" ${vault.autoLockMinutes === 1 ? 'selected' : ''}>1 min</option>
                    <option value="5" ${vault.autoLockMinutes === 5 ? 'selected' : ''}>5 min</option>
                    <option value="15" ${vault.autoLockMinutes === 15 ? 'selected' : ''}>15 min</option>
                    <option value="-1" ${vault.autoLockMinutes === -1 ? 'selected' : ''}>Solo manual / al abrir</option>
                  </select>
                </label>
              </div>
<div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
                <input type="password" id="vault-disable-pass" class="form-input" placeholder="PIN/clave actual para quitar cifrado" style="flex: 1; min-width: 170px; padding: 6px 10px; font-size: 0.78rem;">
                <button type="button" class="btn-secondary" id="btn-vault-disable" style="font-size: 0.78rem; padding: 6px 11px; color: var(--accent-tension); border-color: rgba(184, 107, 89, 0.4);">
                  Desactivar cifrado
                </button>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 8px;">
                <input type="password" id="vault-setup-pass" class="form-input" placeholder="PIN o contraseña (mín. 4)" autocomplete="new-password" style="padding: 7px 10px; font-size: 0.8rem;">
                <input type="password" id="vault-setup-pass-confirm" class="form-input" placeholder="Repetir PIN / contraseña" autocomplete="new-password" style="padding: 7px 10px; font-size: 0.8rem;">
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <select id="vault-setup-autolock" class="form-select" style="padding: 6px 8px; font-size: 0.78rem; width: auto;">
                  <option value="0">Auto-bloqueo: Al cambiar de app</option>
                  <option value="1">Auto-bloqueo: 1 min</option>
                  <option value="5" selected>Auto-bloqueo: 5 min</option>
                  <option value="15">Auto-bloqueo: 15 min</option>
                  <option value="-1">Auto-bloqueo: Solo al abrir/manual</option>
                </select>
                <button type="button" class="btn-primary" id="btn-vault-enable" style="flex: 1; justify-content: center; font-size: 0.8rem; padding: 7px 12px;">
                  Activar Bloqueo + Cifrado AES-256
                </button>
              </div>
            `)}
          </div>
            ` : ''}

            ${activeSettingsTab === 'apariencia' ? `
<!-- 1. Apariencia, Paleta, Superficie, Idioma y Guía Sensorial -->
<div class="settings-section-block">
<div class="settings-section-title" style="margin-bottom: 12px;">
              Apariencia, idioma y guía sensorial
            </div>

<div class="pref-list">
${(() => {
  const isDark = currentTheme === 'dark';
  const cpMode = this.getCustomPalette()[currentTheme];
  const paletteMeta = [
    { id: 'arcilla', name: 'Avena y Arcilla', bg: isDark ? '#1B1613' : '#F3EDE4', accent: isDark ? '#C47C61' : '#96553E' },
    { id: 'musgo', name: 'Papel y Musgo', bg: isDark ? '#171614' : '#F6F3EC', accent: isDark ? '#779C88' : '#3B5246' },
    { id: 'sepia', name: 'Sepia y Pergamino', bg: isDark ? '#1D1812' : '#F4ECD8', accent: isDark ? '#C2915B' : '#8C5E35' },
    { id: 'niebla', name: 'Niebla y Pastel', bg: isDark ? '#1A1C20' : '#F2F3F5', accent: isDark ? '#8FA0B2' : '#5B6B7C' },
    { id: 'custom', name: 'Personalizada', bg: cpMode.bg, accent: cpMode.accent, isCustom: true }
  ];
  const activeMeta = paletteMeta.find(p => p.id === currentPalette) || paletteMeta[0];
  return `
<div class="pref-row">
  <div class="pref-row-info">
    <span class="pref-row-label">Paleta de colores</span>
    <span class="pref-row-hint">${activeMeta.name}</span>
  </div>
  <div class="palette-dots-row" role="radiogroup" aria-label="Paleta de colores">
    ${paletteMeta.map(p => `
      <button type="button"
              class="palette-dot-btn ${currentPalette === p.id ? 'active' : ''}"
              data-select-palette="${p.id}"
              title="${p.name}"
              aria-label="${p.name}"
              aria-pressed="${currentPalette === p.id ? 'true' : 'false'}"
              style="background: linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%);">
        ${p.isCustom ? '<span class="palette-dot-custom-mark" aria-hidden="true">+</span>' : ''}
              </button>
    `).join('')}
            </div>
            </div>
  `;
})()}

${currentPalette === 'custom' ? (() => {
  const cpMode = this.getCustomPalette()[currentTheme];
  return `
<div class="custom-theme-editor">
  <div style="font-size: 0.72rem; color: var(--text-muted);">
    Editando colores del modo <strong>${currentTheme === 'dark' ? 'oscuro' : 'claro'}</strong> (el resto de tonos se calcula automáticamente):
  </div>
  <div class="custom-color-pickers">
    <label class="custom-color-field">
      <span>Fondo</span>
      <input type="color" id="input-custom-bg" value="${cpMode.bg}">
    </label>
    <label class="custom-color-field">
      <span>Texto</span>
      <input type="color" id="input-custom-text" value="${cpMode.text}">
    </label>
    <label class="custom-color-field">
      <span>Acento</span>
      <input type="color" id="input-custom-accent" value="${cpMode.accent}">
    </label>
  </div>
  <div class="custom-theme-actions">
    <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
      <button type="button" class="btn-inline-link" id="btn-export-custom-theme" style="font-size: 0.78rem;">Exportar tema (.json)</button>
      <label class="btn-inline-link" style="font-size: 0.78rem; cursor: pointer;">
        Importar tema (.json)
        <input type="file" id="input-import-custom-theme" accept=".json" style="display: none;">
      </label>
    </div>
    <button type="button" class="btn-inline-link" id="btn-reset-custom-theme" style="font-size: 0.76rem; color: var(--text-muted);">Restablecer</button>
  </div>
</div>
  `;
})() : ''}
<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Luz</span>
<span class="pref-row-hint">Aspecto claro u oscuro</span>
</div>
<div class="segmented-control">
<button type="button" class="segmented-btn ${currentTheme ==='light' ?'active' :''}" data-select-theme="light">Claro</button>
<button type="button" class="segmented-btn ${currentTheme ==='dark' ?'active' :''}" data-select-theme="dark">Oscuro</button>
</div>
</div>

<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Superficie</span>
<span class="pref-row-hint">Filetes 1px sin cards o capas suaves</span>
</div>
<div class="segmented-control">
<button type="button" class="segmented-btn ${currentSurface ==='editorial' ?'active' :''}" data-select-surface="editorial">Continuo</button>
<button type="button" class="segmented-btn ${currentSurface ==='lino' ?'active' :''}" data-select-surface="lino">Por bloques</button>
</div>
</div>

<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Botones</span>
<span class="pref-row-hint">Subrayado sin cajas o relleno con borde</span>
</div>
<div class="segmented-control">
<button type="button" class="segmented-btn ${currentButtons === 'ultraligero' ? 'active' : ''}" data-select-buttons="ultraligero">Subrayado</button>
<button type="button" class="segmented-btn ${currentButtons === 'editorial' ? 'active' : ''}" data-select-buttons="editorial">Relleno</button>
</div>
</div>

<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Idioma</span>
</div>
<div class="segmented-control" data-no-i18n="true">
<button type="button" class="segmented-btn ${currentLang ==='es' ?'active' :''}" data-select-lang="es">Español</button>
<button type="button" class="segmented-btn ${currentLang ==='en' ?'active' :''}" data-select-lang="en">English</button>
</div>
</div>

<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Vibración guía</span>
<span class="pref-row-hint">Impulsos suaves en ejercicios de respiración y anclaje</span>
</div>
<button type="button" class="pref-switch ${vibOn ?'on' :''}" id="btn-setting-toggle-vibration" role="switch" aria-checked="${vibOn ?'true' :'false'}" aria-label="Vibración guía">
<span class="pref-switch-knob"></span>
              </button>
</div>

<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Tonos con ojos cerrados</span>
<span class="pref-row-hint">Campana suave al cambiar de fase</span>
</div>
<button type="button" class="pref-switch ${sndOn ?'on' :''}" id="btn-setting-toggle-sound" role="switch" aria-checked="${sndOn ?'true' :'false'}" aria-label="Tonos con ojos cerrados">
<span class="pref-switch-knob"></span>
              </button>
</div>

<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Tarjetas de anclaje en Lecturas</span>
<span class="pref-row-hint">Mostrar tus frases ancla en la parte superior</span>
</div>
<button type="button" class="pref-switch ${anchorsOn ?'on' :''}" id="btn-setting-toggle-anchors" role="switch" aria-checked="${anchorsOn ?'true' :'false'}" aria-label="Tarjetas de anclaje en Lecturas">
<span class="pref-switch-knob"></span>
              </button>
            </div>

<div class="pref-row">
<div class="pref-row-info">
<span class="pref-row-label">Textos explicativos</span>
<span class="pref-row-hint">Mostrar descripciones y guías breves en pantalla (no afecta a los botones ⓘ)</span>
</div>
<button type="button" class="pref-switch ${explanationsOn ?'on' :''}" id="btn-setting-toggle-explanations" role="switch" aria-checked="${explanationsOn ?'true' :'false'}" aria-label="Textos explicativos">
<span class="pref-switch-knob"></span>
              </button>
            </div>
</div>
          </div>
            ` : ''}

            ${activeSettingsTab === 'datos' ? `
          ${showDbSection ? `
            <!-- 2. Almacenamiento y Sincronización -->
<div class="settings-section-block">
<div class="settings-section-title" style="margin-bottom: 8px;">
                Base de Datos y Sincronización
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 10px;">
                ${serverBadge}
                ${authBadgeHtml}
                ${status.lastSync ? `<span class="badge" style="background: var(--bg-surface); color: var(--text-secondary);">Última sinc.: ${lastSyncText}</span>` : ''}
              </div>

              <div class="storage-mode-grid" style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button type="button" class="storage-mode-card ${mode === 'db' ? 'active' : ''}" data-select-storage-mode="db">
                  <div class="flex-between" style="gap: 8px; margin-bottom: 3px;">
<span style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">Base de Datos SQLite (Servidor Docker)</span>
                    ${mode === 'db' ? '<span class="badge" style="background: var(--sage-500); color: #fff;">Activo</span>' : '<span class="badge" style="background: var(--bg-surface); color: var(--text-muted);">Elegir</span>'}
                  </div>
                  <p style="font-size: 0.77rem; color: var(--text-secondary); line-height: 1.4; margin: 0; text-align: left;">
                    Sincroniza automáticamente en <code>/app/data/act.db</code> (con respaldo local en el navegador). Ideal para uso personal monousuario.
                  </p>
                </button>

                <button type="button" class="storage-mode-card ${mode === 'local' ? 'active' : ''}" data-select-storage-mode="local">
                  <div class="flex-between" style="gap: 8px; margin-bottom: 3px;">
<span style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">Almacenamiento en el Navegador (Solo este dispositivo)</span>
                    ${mode === 'local' ? '<span class="badge" style="background: var(--accent-clarity); color: #fff;">Activo</span>' : '<span class="badge" style="background: var(--bg-surface); color: var(--text-muted);">Elegir</span>'}
                  </div>
                  <p style="font-size: 0.77rem; color: var(--text-secondary); line-height: 1.4; margin: 0; text-align: left;">
                    Guarda solo en este dispositivo sin enviar ni sobrescribir datos en el servidor.
                  </p>
                </button>
              </div>

              <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="btn-secondary" id="btn-modal-push-db" ${canUseDb ? '' : 'disabled'} style="flex: 1; min-width: 190px; font-size: 0.78rem; padding: 7px 10px;">
                  Subir Navegador → BD SQLite
                </button>
                <button type="button" class="btn-secondary" id="btn-modal-pull-db" ${canUseDb ? '' : 'disabled'} style="flex: 1; min-width: 190px; font-size: 0.78rem; padding: 7px 10px;">
                  Descargar BD SQLite → Navegador
                </button>
                ${(serverAvailable && authRequired && !authenticated) ? `
                  <button type="button" class="btn-primary" id="btn-modal-open-login" style="flex: 1 1 100%; justify-content: center; font-size: 0.8rem; padding: 8px 12px;">
                    Iniciar sesión para sincronizar con SQLite
                  </button>
                ` : ''}
                ${(serverAvailable && authRequired && authenticated) ? `
                  <button type="button" class="btn-secondary" id="btn-modal-logout" style="flex: 1 1 100%; justify-content: center; font-size: 0.78rem; padding: 7px 10px;">
                    Cerrar sesión del servidor
                  </button>
                ` : ''}
              </div>
            </div>
          ` : ''}

          ${(!showDbSection || mode === 'local') ? `
            <!-- 2b. Información de Almacenamiento Local -->
            <div class="settings-section-block">
              <div class="flex-between" style="gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                <div class="settings-section-title">
                  Cómo se guardan tus datos
                </div>
                <span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700);">
                  100% Privado · Solo este dispositivo
                </span>
              </div>
              <ul style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; padding-left: 18px; margin: 0;">
                <li>Tus registros se almacenan únicamente en la memoria de este navegador y dispositivo (sin servidores externos).</li>
                <li>Si borras los datos del navegador o cambias de equipo sin exportar una copia JSON, tus registros se perderán.</li>
                <li>Puedes proteger tus datos localmente con <strong>cifrado AES-256</strong> desde la pestaña <em>Privacidad</em>.</li>
              </ul>
            </div>
          ` : ''}

          <!-- 3. Copias de Seguridad y Datos -->
<div class="settings-section-block">
<div class="flex-between" style="gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
<div class="settings-section-title">
                Copias de Seguridad y Gestión de Datos
              </div>
              <span class="badge" style="background: var(--bg-surface); color: var(--text-secondary);">
                ${vault.storagePersisted ?'Persistencia móvil reforzada (IndexedDB)' :'Respaldo doble (IndexedDB + Local)'}
              </span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button type="button" class="btn-primary" id="btn-modal-share-backup" style="font-size: 0.78rem; padding: 7px 11px;">
                Guardar / Compartir Copia en Móvil
              </button>
              ${showDbSection ? `
                <button type="button" class="btn-secondary" id="btn-modal-download-sqlite" ${canUseDb ? '' : 'disabled'} style="font-size: 0.78rem; padding: 7px 11px;">
                  Descargar SQLite (.db)
                </button>
              ` : ''}
              <button type="button" class="btn-secondary" id="btn-modal-export-json" style="font-size: 0.78rem; padding: 7px 11px;">
                Exportar JSON
              </button>
              <label class="btn-secondary" style="font-size: 0.78rem; padding: 7px 11px; cursor: pointer;">
                Importar JSON
                <input type="file" id="input-modal-import-json" accept=".json" style="display: none;">
              </label>
              <button type="button" class="btn-secondary" id="btn-modal-clear-examples" ${exampleCount > 0 ? '' : 'disabled'} style="font-size: 0.78rem; padding: 7px 11px;">
                Quitar Ejemplos (${exampleCount})
              </button>
              <button type="button" class="btn-secondary" id="btn-modal-seed-demo" style="font-size: 0.78rem; padding: 7px 11px;">
                Cargar Datos Demo
              </button>
              <button type="button" class="btn-secondary" id="btn-modal-clear-all" style="font-size: 0.78rem; padding: 7px 11px; color: var(--accent-tension); border-color: rgba(184, 107, 89, 0.4);">
                Limpiar Todo
              </button>
            </div>
          </div>

          <!-- 4. Instalar como App Móvil (PWA) -->
<div class="settings-section-block">
<div class="settings-section-title" style="margin-bottom: 8px;">
              Usar como App en el Móvil (PWA)
            </div>
            ${this.deferredInstallPrompt ? `
              <button type="button" class="btn-primary" id="btn-pwa-install" style="width: 100%; justify-content: center; margin-bottom: 8px; font-size: 0.82rem;">
                Instalar App en este dispositivo
              </button>
            ` : ''}
            <ul style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45; padding-left: 18px; margin: 0;">
              <li><strong>iPhone / iPad (Safari):</strong> <em>Compartir</em> → <strong>«Añadir a pantalla de inicio»</strong>.</li>
              <li><strong>Android (Chrome):</strong> Menú <strong>⋮</strong> → <strong>«Instalar aplicación»</strong>.</li>
              <li><strong>Persistencia y Offline:</strong> Funciona sin conexión tras la primera carga. En iOS, ábrela siempre desde el icono instalado para evitar la limpieza de pestañas de Safari a los 7 días.</li>
              <li><strong>Aviso normal de Chrome en Android:</strong> la notificación «Toca para copiar la URL de esta aplicación» aparece siempre al abrir cualquier app web (PWA). Puedes ocultarla manteniendo pulsada la notificación y desactivando solo ese canal.</li>
            </ul>
          </div>

<!-- 5. Sobre Khōra y Autor -->
<div class="modal-span-full settings-section-block">
<div class="settings-section-title" style="margin-bottom: 8px;">
                Sobre Khōra — Tu espacio ACT
              </div>
              <p style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45; margin: 0 0 10px 0;">
                En filosofía griega, <em>khōra</em> es el espacio que da cabida sin juzgar. Esta aplicación es gratuita, sin rastreadores y guarda tus datos únicamente en tu dispositivo. Es una herramienta personal de práctica ACT y no sustituye la terapia psicológica.
              </p>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <a href="https://github.com/${KHORA_CREDITS.githubUser}/${KHORA_CREDITS.repoName}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.78rem; padding: 6px 11px; text-decoration: none;">
                  Creado con por @${KHORA_CREDITS.githubUser}
                </a>
                <a href="${KHORA_CREDITS.kofiUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.78rem; padding: 6px 11px; text-decoration: none;">
                  Invítame a un café en Ko-fi
                </a>
                <button type="button" class="btn-secondary" id="btn-settings-feedback" style="font-size: 0.78rem; padding: 6px 12px;">
                  Enviar Feedback
                </button>
              </div>
            </div>
            ` : ''}
          </div>
      `;

      dynamicContent.querySelectorAll('[data-settings-tab]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeSettingsTab = btn.dataset.settingsTab || 'apariencia';
          renderModalContent({ resetScroll: true });
          this.resetModalScroll();
        });
      });

      dynamicContent.querySelectorAll('[data-select-lang]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextLang = btn.dataset.selectLang;
          if (!nextLang || nextLang === window.i18n?.getLang?.()) return;
          if (window.i18n?.setLang) {
            window.i18n.setLang(nextLang);
          } else {
            renderModalContent();
          }
          this.triggerSettingsSaveIndicator();
        });
      });

      dynamicContent.querySelectorAll('[data-select-surface]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextSurface = btn.dataset.selectSurface;
          if (nextSurface === currentSurface) return;
          this.setSurface(nextSurface);
          renderModalContent();
          this.triggerSettingsSaveIndicator();
        });
      });

      dynamicContent.querySelectorAll('[data-select-buttons]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextButtons = btn.dataset.selectButtons;
          if (nextButtons === currentButtons) return;
          this.setButtons(nextButtons);
          renderModalContent();
          this.triggerSettingsSaveIndicator();
        });
      });

      dynamicContent.querySelectorAll('[data-select-palette]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextPalette = btn.dataset.selectPalette;
          if (nextPalette === currentPalette) return;
          this.setPalette(nextPalette);
          renderModalContent();
          this.triggerSettingsSaveIndicator();
        });
      });

      const bindCustomColorInput = (inputId, prop) => {
        const el = document.getElementById(inputId);
        if (!el) return;
        el.addEventListener('input', (e) => {
          const val = e.target.value;
          const cp = this.getCustomPalette();
          const modeKey = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'dark' : 'light';
          cp[modeKey][prop] = val;
          this.saveCustomPalette(cp);
          this.triggerSettingsSaveIndicator();
        });
      };
      bindCustomColorInput('input-custom-bg', 'bg');
      bindCustomColorInput('input-custom-text', 'text');
      bindCustomColorInput('input-custom-accent', 'accent');

      document.getElementById('btn-export-custom-theme')?.addEventListener('click', () => {
        this.exportCustomThemeFile();
      });

      document.getElementById('input-import-custom-theme')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || '{}'));
            const isHex = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);
            const cur = this.getCustomPalette();
            const next = {
              light: {
                bg: isHex(parsed?.light?.bg) ? parsed.light.bg : cur.light.bg,
                text: isHex(parsed?.light?.text) ? parsed.light.text : cur.light.text,
                accent: isHex(parsed?.light?.accent) ? parsed.light.accent : cur.light.accent
              },
              dark: {
                bg: isHex(parsed?.dark?.bg) ? parsed.dark.bg : cur.dark.bg,
                text: isHex(parsed?.dark?.text) ? parsed.dark.text : cur.dark.text,
                accent: isHex(parsed?.dark?.accent) ? parsed.dark.accent : cur.dark.accent
              }
            };
            this.saveCustomPalette(next);
            renderModalContent();
            this.triggerSettingsSaveIndicator();
          } catch {
            this.showToast('El archivo de tema no tiene un formato JSON válido');
          }
        };
        reader.readAsText(file);
      });

      document.getElementById('btn-reset-custom-theme')?.addEventListener('click', () => {
        this.saveCustomPalette(this.getDefaultCustomPalette());
        renderModalContent();
        this.triggerSettingsSaveIndicator();
      });

      dynamicContent.querySelectorAll('[data-select-theme]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextTheme = btn.dataset.selectTheme;
          if (nextTheme === currentTheme) return;
          this.setTheme(nextTheme);
          renderModalContent();
          this.triggerSettingsSaveIndicator();
        });
      });

      document.getElementById('btn-setting-toggle-vibration')?.addEventListener('click', () => {
        const st = window.stateManager.getSettings();
        const nextVal = st.vibration === false;
        st.vibration = nextVal;
        window.stateManager.saveSettings(st);
        if (nextVal) this.triggerHaptic([40]);
        renderModalContent();
        this.triggerSettingsSaveIndicator();
      });

      document.getElementById('btn-setting-toggle-anchors')?.addEventListener('click', () => {
        const st = window.stateManager.getSettings();
        const nextVal = st.showAnchorsCard === false;
        st.showAnchorsCard = nextVal;
        window.stateManager.saveSettings(st);
        if (window.pildorasAnclajesApp) {
          window.pildorasAnclajesApp.render();
          window.pildorasAnclajesApp.bindEvents();
        }
        renderModalContent();
        this.triggerSettingsSaveIndicator();
      });

      document.getElementById('btn-setting-toggle-explanations')?.addEventListener('click', () => {
        const currentlyOn = (document.documentElement.getAttribute('data-explanations') || 'show') !== 'hide';
        const nextVal = currentlyOn ? 'hide' : 'show';
        this.setExplanations(nextVal);
        renderModalContent();
        this.triggerSettingsSaveIndicator();
      });

      document.getElementById('btn-setting-toggle-sound')?.addEventListener('click', () => {
        const st = window.stateManager.getSettings();
        const nextVal = st.sound !== true;
        st.sound = nextVal;
        window.stateManager.saveSettings(st);
        if (nextVal) this.playGentleTone(432, 220);
        renderModalContent();
        this.triggerSettingsSaveIndicator();
      });

      dynamicContent.querySelectorAll('[data-select-storage-mode]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const nextMode = btn.dataset.selectStorageMode;
          await this.triggerSettingsSaveIndicator(async () => {
            await window.stateManager.setStorageMode(nextMode);
            this.updateDbStatusBadge();
            renderModalContent();
          });
        });
      });

      document.getElementById('btn-modal-push-db')?.addEventListener('click', async () => {
        if (!confirm('¿Subir y sobrescribir la base de datos SQLite del servidor con los datos actuales de este navegador?')) {
          return;
        }
        const ok = await window.stateManager.pushFullStateToServer({ force: true });
        await window.stateManager.checkServerHealth();
        this.updateDbStatusBadge();
        this.showToast(ok ? 'Datos del navegador subidos a BD SQLite' : 'No se pudo conectar con el servidor SQLite');
        renderModalContent();
      });

      document.getElementById('btn-modal-pull-db')?.addEventListener('click', async () => {
        if (!confirm('¿Descargar los datos de la base de datos SQLite y reemplazar los datos locales de este navegador?')) {
          return;
        }
        const ok = await window.stateManager.pullStateFromServer();
        await window.stateManager.checkServerHealth();
        this.updateDbStatusBadge();
        refreshCurrentViewIfNeeded();
        this.showToast(ok ? 'Datos descargados de BD SQLite a este navegador' : 'No se pudo descargar desde el servidor SQLite');
        renderModalContent();
      });

      document.getElementById('btn-modal-open-login')?.addEventListener('click', () => {
        this.hideSettingsSaveIndicator();
        this.openLoginModal();
      });

      document.getElementById('btn-modal-logout')?.addEventListener('click', async () => {
        await window.stateManager.logout();
        this.updateDbStatusBadge();
        this.showToast('Sesión cerrada');
        renderModalContent();
      });

      document.getElementById('btn-modal-download-sqlite')?.addEventListener('click', () => {
        const dbStatus = window.stateManager.getDbStatus();
        if ((!dbStatus.connected && !dbStatus.serverAvailable) || (dbStatus.authRequired && !dbStatus.authenticated)) {
          this.showToast('Inicia sesión en el servidor SQLite o usa Exportar JSON');
          return;
        }
        const a = document.createElement('a');
        a.href = '/api/backup/db';
        a.download = `khora_act_${new Date().toISOString().slice(0, 10)}.sqlite`;
        a.click();
        this.showToast('Descargando base de datos SQLite (.db)');
      });

      document.getElementById('btn-modal-share-backup')?.addEventListener('click', () => {
        this.triggerQuickBackupShareOrDownload();
      });

      document.getElementById('btn-vault-enable')?.addEventListener('click', async () => {
        const p1 = document.getElementById('vault-setup-pass')?.value || '';
        const p2 = document.getElementById('vault-setup-pass-confirm')?.value || '';
        const autoLock = document.getElementById('vault-setup-autolock')?.value || '5';
        if (p1 !== p2) {
          this.showToast('Las dos claves no coinciden');
          return;
        }
        const res = await window.stateManager.enableVault(p1, Number(autoLock));
        if (!res.ok) {
          this.showToast(res.error || 'No se pudo activar el cifrado');
          return;
        }
        this.updateLockHeaderButton();
        this.showToast('Cifrado AES-256-GCM y bloqueo activados');
        renderModalContent();
      });

      document.getElementById('btn-vault-lock-now')?.addEventListener('click', () => {
        this.closeModal();
        window.stateManager.lockVault();
        this.showToast('Khōra bloqueado');
      });

      document.getElementById('btn-vault-enable-bio')?.addEventListener('click', async () => {
        const res = await window.stateManager.registerBiometric();
        this.showToast(res.ok ?'FaceID / Huella activado en este dispositivo' : (res.error ||'No se pudo activar la biometría'));
        renderModalContent();
      });

      document.getElementById('btn-vault-remove-bio')?.addEventListener('click', () => {
        window.stateManager.removeBiometric();
        this.showToast('Desbloqueo biométrico retirado');
        renderModalContent();
      });

      document.getElementById('select-vault-autolock')?.addEventListener('change', (e) => {
        window.stateManager.updateVaultAutoLock(Number(e.target.value));
        this.triggerSettingsSaveIndicator();
      });

      document.getElementById('btn-vault-disable')?.addEventListener('click', async () => {
        const pass = document.getElementById('vault-disable-pass')?.value || '';
        if (!pass) {
          this.showToast('Introduce tu PIN o contraseña actual para quitar el cifrado');
          return;
        }
        if (!confirm('¿Desactivar el bloqueo y guardar los datos sin cifrar?')) return;
        const res = await window.stateManager.disableVault(pass);
        if (!res.ok) {
          this.showToast(res.error || 'PIN o contraseña incorrectos');
          return;
        }
        this.updateLockHeaderButton();
        this.showToast('Bloqueo y cifrado desactivados');
        renderModalContent();
      });

      document.getElementById('btn-modal-export-json')?.addEventListener('click', () => {
        const json = window.stateManager.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `khora_act_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Copia de seguridad JSON descargada');
      });

      document.getElementById('input-modal-import-json')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const success = window.stateManager.importData(evt.target.result);
          if (success) {
            this.initTheme();
            this.updateDbStatusBadge();
            refreshCurrentViewIfNeeded();
            this.showToast('Datos restaurados correctamente');
            renderModalContent();
          } else {
            this.showToast('El archivo no tiene un formato JSON válido');
          }
        };
        reader.readAsText(file);
      });

      document.getElementById('btn-modal-clear-examples')?.addEventListener('click', () => {
        if (confirm('¿Quitar todos los elementos de ejemplo de la app? Tus registros y valores propios se mantendrán intactos.')) {
          window.stateManager.clearExampleData();
          refreshCurrentViewIfNeeded();
          this.showToast('Datos de ejemplo eliminados — tus registros propios se mantienen');
          renderModalContent();
        }
      });

      document.getElementById('btn-modal-seed-demo')?.addEventListener('click', () => {
        if (confirm('¿Cargar datos de ejemplo en toda la app? Tus registros propios se conservarán intactos.')) {
          const ok = window.stateManager.seedDemoData();
          if (!ok) return;
          refreshCurrentViewIfNeeded();
          this.showToast('Datos de demostración cargados');
          renderModalContent();
        }
      });

      document.getElementById('btn-modal-clear-all')?.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar TODOS los registros guardados en este dispositivo?')) {
          window.stateManager.clearAllData();
          refreshCurrentViewIfNeeded();
          this.showToast('Todos los datos han sido eliminados');
          renderModalContent();
        }
      });

      document.getElementById('btn-pwa-install')?.addEventListener('click', async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const choice = await this.deferredInstallPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          this.showToast('Instalando Khōra en tu dispositivo...');
        }
        this.deferredInstallPrompt = null;
        renderModalContent();
      });

      document.getElementById('btn-settings-feedback')?.addEventListener('click', () => {
        this.hideSettingsSaveIndicator();
        this.openFeedbackModal();
      });

      if (modal.classList.contains('active') && prevScroll > 0) {
        modalBody.scrollTop = prevScroll;
      }
    };

    renderModalContent();
    this.openModal('wide');

    await window.stateManager.checkServerHealth();
    if (openId !== this._settingsModalOpenId) return;
    this.updateDbStatusBadge();
    if (modal.classList.contains('active') && document.getElementById('storage-mode-modal-root')) {
      renderModalContent();
    }
  }
  };
})(window);
