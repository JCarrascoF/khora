/**
 * ECOSISTEMA ACT - State & Storage Management
 * 100% LocalStorage / Private / Offline First
 */

const STORAGE_KEYS = {
  PAZ_FALSA: 'act_paz_falsa_entries',
  ACT_CRISIS: 'act_crisis_entries',
  ANCHORS: 'act_user_anchors',
  SETTINGS: 'act_user_settings',
  PATTERNS: 'act_patterns_lab',
  COMPASS: 'act_compass_entries',
  PILL_FAVORITES: 'act_pill_favorites',
  HEXAFLEX: 'act_hexaflex_scores',
  DECONSTRUCT: 'act_deconstruct_statements',
  PIVOTS: 'act_pivot_entries',
  PROFILE: 'act_user_profile',
  THERAPY_NOTES: 'act_therapy_reflections',
  STORAGE_MODE: 'act_storage_mode',
  VAULT_META: 'act_privacy_vault_meta',
  BIOMETRIC_LOCAL: 'act_biometric_local_wrap',
  THEME_PREF:'act_theme_pref',
  PALETTE_PREF:'act_palette_pref',
  SURFACE_PREF:'act_surface_pref',
  BUTTONS_PREF:'act_buttons_pref',
  EXPLANATIONS_PREF:'act_explanations_pref',
  CUSTOM_PALETTE_PREF:'act_custom_palette_pref'
};

const SERVER_ARRAY_KEYS = new Set([
  'pazFalsa',
  'actCrisis',
  'anchors',
  'patterns',
  'compass',
  'hexaflex',
  'deconstruct',
  'pivots',
  'therapyNotes'
]);

const SERVER_KEY_MAP = {
  [STORAGE_KEYS.PAZ_FALSA]: 'pazFalsa',
  [STORAGE_KEYS.ACT_CRISIS]: 'actCrisis',
  [STORAGE_KEYS.ANCHORS]: 'anchors',
  [STORAGE_KEYS.SETTINGS]: 'settings',
  [STORAGE_KEYS.PATTERNS]: 'patterns',
  [STORAGE_KEYS.COMPASS]: 'compass',
  [STORAGE_KEYS.PILL_FAVORITES]: 'pillFavorites',
  [STORAGE_KEYS.HEXAFLEX]: 'hexaflex',
  [STORAGE_KEYS.DECONSTRUCT]: 'deconstruct',
  [STORAGE_KEYS.PIVOTS]: 'pivots',
  [STORAGE_KEYS.PROFILE]: 'profile',
  [STORAGE_KEYS.THERAPY_NOTES]: 'therapyNotes',
  [STORAGE_KEYS.VAULT_META]: 'vaultMeta'
};

const DATA_STORAGE_KEYS = [
  STORAGE_KEYS.PAZ_FALSA,
  STORAGE_KEYS.ACT_CRISIS,
  STORAGE_KEYS.ANCHORS,
  STORAGE_KEYS.SETTINGS,
  STORAGE_KEYS.PATTERNS,
  STORAGE_KEYS.COMPASS,
  STORAGE_KEYS.PILL_FAVORITES,
  STORAGE_KEYS.HEXAFLEX,
  STORAGE_KEYS.DECONSTRUCT,
  STORAGE_KEYS.PIVOTS,
  STORAGE_KEYS.PROFILE,
  STORAGE_KEYS.THERAPY_NOTES
];

const DEFAULT_ANCHORS = [
  {
    id: 'a1',
    text: "Tus emociones son mensajeras, no dictadoras. Puedes sentirlas y aún así elegir tu conducta con dignidad.",
    author: "Steven C. Hayes",
    category: "Aceptación"
  },
  {
    id: 'a2',
    text: "Ceder para evitar el conflicto con otros suele ser el inicio del conflicto y el resentimiento contigo mismo.",
    author: "Paz Falsa",
    category: "Límites"
  },
  {
    id: 'a3',
    text: "¿Esto que voy a hacer me acerca a la persona que quiero ser o me aleja de ella por comodidad?",
    author: "Russ Harris",
    category: "Valores"
  },
  {
    id: 'a4',
    text: "No luches con tus pensamientos como si fueran monstruos en un pantano. Son solo palabras generadas por una mente hiper-protectora.",
    author: "Defusión",
    category: "Mente"
  },
  {
    id: 'a5',
    text: "Estar dispuesto a sentir incomodidad es el precio de admisión para vivir una vida con significado.",
    author: "Kelly G. Wilson",
    category: "Compromiso"
  }
];

if (typeof window !== 'undefined') {
  window.STORAGE_KEYS = STORAGE_KEYS;
  window.DEFAULT_ANCHORS = DEFAULT_ANCHORS;
}
if (typeof globalThis !== 'undefined') {
  globalThis.STORAGE_KEYS = STORAGE_KEYS;
  globalThis.DEFAULT_ANCHORS = DEFAULT_ANCHORS;
}

class StateManager {
  constructor() {
    this.listeners = new Set();
    this.memStore = new Map();
    this.pendingWrites = new Set();
    this.cryptoKey = null;
    this.idbPromise = null;
    this.storagePersisted = false;
    this.vaultLocked = this.isVaultEnabled();
    const initialMode = this.getStorageMode();
    this.dbStatus = {
      connected: false,
      mode: initialMode,
      engine: initialMode === 'local' ? 'local' : 'sqlite',
      serverAvailable: false,
      serverChecked: false,
      serverCounts: null,
      lastSync: null,
      authRequired: false,
      authenticated: false,
      authUser: null
    };
    this.init();
  }

  // -------------------------------------------------------------
  // BROWSER PERSISTENCE & INDEXEDDB MIRROR
  // -------------------------------------------------------------
  openMirrorDb() {
    if (this.idbPromise) return this.idbPromise;
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    this.idbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open('ethos_act_idb', 1);
        req.onupgradeneeded = (e) => {
          const idb = e.target.result;
          if (!idb.objectStoreNames.contains('kv')) {
            idb.createObjectStore('kv');
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    return this.idbPromise;
  }

  async idbPut(key, serializedValue) {
    try {
      const idb = await this.openMirrorDb();
      if (!idb) return false;
      return await new Promise((resolve) => {
        const tx = idb.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(serializedValue, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  async idbGetAll() {
    try {
      const idb = await this.openMirrorDb();
      if (!idb) return {};
      return await new Promise((resolve) => {
        const tx = idb.transaction('kv', 'readonly');
        const store = tx.objectStore('kv');
        const result = {};
        const req = store.openCursor();
        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            result[cursor.key] = cursor.value;
            cursor.continue();
          } else {
            resolve(result);
          }
        };
        req.onerror = () => resolve({});
      });
    } catch {
      return {};
    }
  }

  async initIndexedDbMirror() {
    try {
      const mirrorKeys = [...DATA_STORAGE_KEYS, STORAGE_KEYS.VAULT_META];
      const fromIdb = await this.idbGetAll();
      let restored = false;

      mirrorKeys.forEach((k) => {
        const lsVal = localStorage.getItem(k);
        if (!lsVal && fromIdb[k]) {
          localStorage.setItem(k, fromIdb[k]);
          restored = true;
        } else if (lsVal && !fromIdb[k]) {
          this.idbPut(k, lsVal);
        }
      });

      if (restored) {
        if (this.isVaultEnabled() && !this.cryptoKey) {
          this.vaultLocked = true;
          this.memStore.clear();
          this.notify('vault_locked', this.getVaultStatus());
          this.notify('vault_status_changed', this.getVaultStatus());
        } else if (!this.isVaultEnabled()) {
          this.loadPlainStoreIntoMemory();
          this.notify('server_synced', null);
        }
      }
    } catch {
      // Ignore IDB mirror errors
    }
  }

  getDefaultValueForKey(storageKey) {
    switch (storageKey) {
      case STORAGE_KEYS.ANCHORS:
        return JSON.parse(JSON.stringify(DEFAULT_ANCHORS));
      case STORAGE_KEYS.SETTINGS: {
        let themePref = 'light';
        let palettePref ='arcilla';
        let surfacePref ='editorial';
        let buttonsPref ='ultraligero';
        let explanationsPref ='show';
        try {
          themePref = localStorage.getItem(STORAGE_KEYS.THEME_PREF) ||
            (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          const storedPal = localStorage.getItem(STORAGE_KEYS.PALETTE_PREF);
          if (['arcilla','musgo','sepia','niebla','custom'].includes(storedPal)) palettePref = storedPal;
          const storedSurf = localStorage.getItem(STORAGE_KEYS.SURFACE_PREF);
          if (storedSurf ==='lino' || storedSurf ==='editorial') surfacePref = storedSurf;
          const storedBtns = localStorage.getItem(STORAGE_KEYS.BUTTONS_PREF);
          if (storedBtns ==='editorial' || storedBtns ==='ultraligero') buttonsPref = storedBtns;
          const storedEx = localStorage.getItem(STORAGE_KEYS.EXPLANATIONS_PREF);
          if (storedEx ==='hide' || storedEx ==='show') explanationsPref = storedEx;
        } catch {
          themePref = 'light';
          palettePref ='arcilla';
          surfacePref ='editorial';
          buttonsPref ='ultraligero';
          explanationsPref ='show';
        }
        return { theme: themePref, palette: palettePref, surface: surfacePref, buttons: buttonsPref, explanations: explanationsPref, sound: false, vibration: true, mindName: '', mindNameCustomized: false };
      }
      case STORAGE_KEYS.PROFILE:
        return {
          coreValues: [],
          activeBarriers: [],
          busPassengers: this.getDefaultBusPassengers(),
          challenges: [],
          currentConcern: { text: '', context: '', updatedAt: null },
          progressLog: []
        };
      default:
        return [];
    }
  }

  getStoreItem(storageKey, fallback) {
    if (this.isVaultLocked()) {
      return fallback;
    }
    if (this.memStore.has(storageKey)) {
      return JSON.parse(JSON.stringify(this.memStore.get(storageKey)));
    }
    try {
      const rawStr = localStorage.getItem(storageKey);
      if (!rawStr) return fallback;
      const parsed = JSON.parse(rawStr);
      if (this.isEncryptedEnvelope(parsed) || (Array.isArray(parsed) && parsed.length === 1 && this.isEncryptedEnvelope(parsed[0]))) {
        return fallback;
      }
      this.memStore.set(storageKey, JSON.parse(JSON.stringify(parsed)));
      return parsed;
    } catch {
      return fallback;
    }
  }

  setStoreItem(storageKey, value, syncServer = true) {
    this.memStore.set(storageKey, JSON.parse(JSON.stringify(value)));
    return this.persistKey(storageKey, value, syncServer);
  }

  loadPlainStoreIntoMemory() {
    DATA_STORAGE_KEYS.forEach((key) => {
      try {
        const rawStr = localStorage.getItem(key);
        if (!rawStr) return;
        const parsed = JSON.parse(rawStr);
        if (!this.isEncryptedEnvelope(parsed) && !(Array.isArray(parsed) && parsed.length === 1 && this.isEncryptedEnvelope(parsed[0]))) {
          this.memStore.set(key, parsed);
        }
      } catch {
        // Ignore parse error
      }
    });
  }

  tr(msg) {
    return (typeof window !== 'undefined' && window.i18n && typeof window.i18n.t === 'function')
      ? window.i18n.t(msg)
      : msg;
  }


  getStorageMode() {
    try {
      return localStorage.getItem(STORAGE_KEYS.STORAGE_MODE) === 'db' ? 'db' : 'local';
    } catch {
      return 'local';
    }
  }

  async requestBrowserPersistence() {
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.persist === 'function') {
        const persisted = await navigator.storage.persist();
        this.storagePersisted = Boolean(persisted);
        this.notify('vault_status_changed', this.getVaultStatus());
        return persisted;
      }
    } catch {
      // Ignore storage persistence request errors
    }
    return false;
  }

  async setStorageMode(mode) {
    const nextMode = mode === 'local' ? 'local' : 'db';
    localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, nextMode);

    if (nextMode === 'local') {
      await this.requestBrowserPersistence();
      this.dbStatus = {
        ...this.dbStatus,
        connected: false,
        mode: 'local',
        engine: 'local'
      };
      this.notify('storage_mode_changed', nextMode);
      this.notify('db_status_changed', this.dbStatus);
      await this.checkServerHealth();
      return true;
    }

    this.dbStatus = {
      ...this.dbStatus,
      mode: 'db'
    };
    this.notify('storage_mode_changed', nextMode);
    await this.initServerSync();
    return true;
  }

  hasApiServer() {
    // Non-browser env (Node tests): assume API is available
    if (typeof document === 'undefined') return true;
    return Boolean(document.querySelector('meta[name="khora-api"][content="1"]'));
  }

  _setServerUnavailable(explicitMode) {
    if (!explicitMode) {
      localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'local');
    }
    const mode = this.getStorageMode();
    this.dbStatus = {
      ...this.dbStatus,
      mode,
      engine: mode === 'local' ? 'local' : this.dbStatus.engine,
      serverChecked: true,
      serverAvailable: false,
      authRequired: false,
      authenticated: false,
      serverCounts: null
    };
    this.notify('db_status_changed', this.dbStatus);
    return false;
  }

  async checkServerHealth() {
    if (typeof fetch !== 'function') {
      this.dbStatus = { ...this.dbStatus, serverChecked: true, serverAvailable: false };
      return false;
    }
    const explicitMode = localStorage.getItem(STORAGE_KEYS.STORAGE_MODE);
    if (!this.hasApiServer()) {
      return this._setServerUnavailable(explicitMode);
    }
    try {
      const res = await fetch('/api/health', { cache: 'no-store', credentials: 'same-origin' });
      if (!res.ok) {
        let errJson = null;
        try { errJson = await res.json(); } catch {}
        if (errJson && errJson.sqliteEnabled === false) {
          localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'local');
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const payload = await res.json();
      if (!payload || !payload.ok) throw new Error('Invalid health payload');
      const mode = this.getStorageMode();
      const authRequired = Boolean(payload.authRequired);
      const authenticated = authRequired ? Boolean(payload.authenticated) : true;
      this.dbStatus = {
        ...this.dbStatus,
        mode,
        serverChecked: true,
        serverAvailable: true,
        authRequired,
        authenticated,
        authUser: payload.username || null,
        serverCounts: payload.counts || null,
        connected: mode === 'db' && authenticated ? this.dbStatus.connected : false
      };
      this.notify('db_status_changed', this.dbStatus);
      if (mode === 'db' && authRequired && !authenticated) {
        this.notify('auth_required', this.dbStatus);
      }
      return true;
    } catch {
      return this._setServerUnavailable(explicitMode);
    }
  }

  async login(username, password) {
    if (typeof fetch !== 'function') return { ok: false, error: this.tr('Fetch no disponible') };
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        return { ok: false, error: this.tr(payload.error || 'Credenciales incorrectas') };
      }

      this.dbStatus = {
        ...this.dbStatus,
        serverAvailable: true,
        authRequired: Boolean(payload.authRequired),
        authenticated: true,
        authUser: payload.username || username || null
      };
      this.notify('auth_changed', this.dbStatus);
      await this.checkServerHealth();
      if (this.getStorageMode() === 'db') {
        await this.initServerSync();
      }
      return { ok: true };
    } catch {
      return { ok: false, error: this.tr('No se pudo conectar con el servidor') };
    }
  }

  async logout() {
    if (typeof fetch !== 'function') return false;
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch {
      // Ignore network errors on logout
    }
    this.dbStatus = {
      ...this.dbStatus,
      connected: false,
      authenticated: false,
      authUser: null,
      serverCounts: null
    };
    this.notify('auth_changed', this.dbStatus);
    this.notify('db_status_changed', this.dbStatus);
    return true;
  }

  async ingestServerState(serverState) {
    if (!serverState || typeof serverState !== 'object') return;

    const incomingMeta = serverState.vaultMeta;
    let serverHasEncryptedData = Boolean(incomingMeta && incomingMeta.enabled);

    if (incomingMeta && typeof incomingMeta === 'object') {
      const metaStr = JSON.stringify(incomingMeta);
      localStorage.setItem(STORAGE_KEYS.VAULT_META, metaStr);
      this.idbPut(STORAGE_KEYS.VAULT_META, metaStr);
      if (!incomingMeta.enabled) {
        localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_LOCAL);
      }
    }

    Object.entries(SERVER_KEY_MAP).forEach(([storageKey, serverKey]) => {
      if (storageKey === STORAGE_KEYS.VAULT_META) return;
      const val = serverState[serverKey];
      if (this.isEncryptedEnvelope(val) || (Array.isArray(val) && val.length === 1 && this.isEncryptedEnvelope(val[0]))) {
        serverHasEncryptedData = true;
      }
    });

    if (serverHasEncryptedData || this.isVaultEnabled()) {
      for (const [storageKey, serverKey] of Object.entries(SERVER_KEY_MAP)) {
        if (storageKey === STORAGE_KEYS.VAULT_META) continue;
        const serverVal = serverState[serverKey];
        if (serverVal === undefined || serverVal === null) continue;

        const unwrappedForStorage = (Array.isArray(serverVal) && serverVal.length === 1 && this.isEncryptedEnvelope(serverVal[0]))
          ? serverVal[0]
          : serverVal;
        const serialized = JSON.stringify(unwrappedForStorage);
        localStorage.setItem(storageKey, serialized);
        this.idbPut(storageKey, serialized);

        if (this.cryptoKey && !this.vaultLocked) {
          try {
            const plainVal = await this.decryptValue(unwrappedForStorage, this.cryptoKey);
            this.memStore.set(storageKey, plainVal);
          } catch {
            this.cryptoKey = null;
            this.vaultLocked = true;
            this.memStore.clear();
          }
        }
      }

      if (!this.cryptoKey || this.vaultLocked) {
        this.vaultLocked = true;
        this.memStore.clear();
        this.notify('vault_locked', this.getVaultStatus());
        this.notify('vault_status_changed', this.getVaultStatus());
      } else {
        this.notify('vault_status_changed', this.getVaultStatus());
      }
      return;
    }

    Object.entries(SERVER_KEY_MAP).forEach(([storageKey, serverKey]) => {
      if (storageKey === STORAGE_KEYS.VAULT_META) return;
      const serverVal = serverState[serverKey];
      if (serverVal !== undefined && serverVal !== null) {
        this.memStore.set(storageKey, JSON.parse(JSON.stringify(serverVal)));
        const serialized = JSON.stringify(serverVal);
        localStorage.setItem(storageKey, serialized);
        this.idbPut(storageKey, serialized);
      }
    });
  }

  async pullStateFromServer() {
    if (typeof fetch !== 'function') return false;
    try {
      const res = await fetch('/api/state', { cache: 'no-store', credentials: 'same-origin' });
      if (res.status === 401) {
        this.dbStatus = {
          ...this.dbStatus,
          connected: false,
          serverAvailable: true,
          authRequired: true,
          authenticated: false
        };
        this.notify('db_status_changed', this.dbStatus);
        this.notify('auth_required', this.dbStatus);
        return false;
      }
      if (!res.ok) {
        let errJson = null;
        try { errJson = await res.json(); } catch {}
        if (errJson && errJson.sqliteEnabled === false) {
          localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'local');
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const payload = await res.json();
      if (!payload || !payload.ok || !payload.state) throw new Error('Invalid state payload');

      await this.ingestServerState(payload.state);

      const mode = this.getStorageMode();
      this.dbStatus = {
        ...this.dbStatus,
        mode,
        connected: mode === 'db',
        engine: mode === 'db' ? 'sqlite' : 'local',
        serverAvailable: true,
        authenticated: true,
        lastSync: Date.now()
      };
      this.notify('server_synced', payload.state);
      this.notify('db_status_changed', this.dbStatus);
      return true;
    } catch {
      const mode = this.getStorageMode();
      this.dbStatus = {
        ...this.dbStatus,
        mode,
        connected: false,
        serverAvailable: false
      };
      this.notify('db_status_changed', this.dbStatus);
      return false;
    }
  }

  ensureDefaultSeedsInMemory() {
    if (!this.memStore.has(STORAGE_KEYS.PAZ_FALSA)) this.memStore.set(STORAGE_KEYS.PAZ_FALSA, []);
    if (!this.memStore.has(STORAGE_KEYS.ACT_CRISIS)) this.memStore.set(STORAGE_KEYS.ACT_CRISIS, []);
    if (!this.memStore.has(STORAGE_KEYS.ANCHORS)) this.memStore.set(STORAGE_KEYS.ANCHORS, JSON.parse(JSON.stringify(DEFAULT_ANCHORS)));
    if (!this.memStore.has(STORAGE_KEYS.PATTERNS)) this.memStore.set(STORAGE_KEYS.PATTERNS, []);
    if (!this.memStore.has(STORAGE_KEYS.COMPASS)) this.memStore.set(STORAGE_KEYS.COMPASS, []);
    if (!this.memStore.has(STORAGE_KEYS.PILL_FAVORITES)) this.memStore.set(STORAGE_KEYS.PILL_FAVORITES, []);
    if (!this.memStore.has(STORAGE_KEYS.HEXAFLEX)) this.memStore.set(STORAGE_KEYS.HEXAFLEX, []);
    if (!this.memStore.has(STORAGE_KEYS.DECONSTRUCT)) this.memStore.set(STORAGE_KEYS.DECONSTRUCT, []);
    if (!this.memStore.has(STORAGE_KEYS.PIVOTS)) this.memStore.set(STORAGE_KEYS.PIVOTS, []);
    if (!this.memStore.has(STORAGE_KEYS.PROFILE)) {
      this.memStore.set(STORAGE_KEYS.PROFILE, {
        coreValues: [
          {
            id: 'val_seed_1',
            isExample: true,
            domain: 'Pareja',
            statement: 'Ser una pareja comprensiva y atenta que escucha con ternura pero expresa sus límites con honestidad',
            microAction: 'Escuchar cómo se siente sin interrumpir y expresar con calma cuando necesite descanso',
            willingness: 'Sostener la incomodidad si hay un desacuerdo sin ceder automáticamente por miedo',
            lensUsed: 'Ejemplo guía (Hayes)',
            createdAt: Date.now()
          }
        ],
        activeBarriers: [],
        busPassengers: this.getDefaultBusPassengers(),
        challenges: [],
        currentConcern: { text: '', context: '', updatedAt: null },
        progressLog: []
      });
    }
    if (!this.memStore.has(STORAGE_KEYS.SETTINGS)) {
      let palettePref ='arcilla';
      let surfacePref ='editorial';
      let buttonsPref ='ultraligero';
      let explanationsPref ='show';
      try {
        const storedPal = localStorage.getItem(STORAGE_KEYS.PALETTE_PREF);
        if (['arcilla','musgo','sepia','niebla','custom'].includes(storedPal)) palettePref = storedPal;
        const storedSurf = localStorage.getItem(STORAGE_KEYS.SURFACE_PREF);
        if (storedSurf ==='lino' || storedSurf ==='editorial') surfacePref = storedSurf;
        const storedBtns = localStorage.getItem(STORAGE_KEYS.BUTTONS_PREF);
        if (storedBtns ==='editorial' || storedBtns ==='ultraligero') buttonsPref = storedBtns;
        const storedEx = localStorage.getItem(STORAGE_KEYS.EXPLANATIONS_PREF);
        if (storedEx ==='hide' || storedEx ==='show') explanationsPref = storedEx;
      } catch {
        // Ignore
      }
      this.memStore.set(STORAGE_KEYS.SETTINGS, {
        theme: (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
        palette: palettePref,
        surface: surfacePref,
        buttons: buttonsPref,
        explanations: explanationsPref,
        sound: false,
        vibration: true,
        mindName: '',
        mindNameCustomized: false
      });
    }
    if (!this.memStore.has(STORAGE_KEYS.THERAPY_NOTES)) {
      const sampleText = 'Me doy cuenta de que cuando alguien cercano se queda en silencio o cambia el tono, entro automáticamente en alerta y busco explicarme demasiado para recuperar su aprobación, aunque eso me deje agotamiento después.';
      const sampleContext = 'Pareja';
      const sampleCategory = 'Patrón o bucle que me cuesta';
      this.memStore.set(STORAGE_KEYS.THERAPY_NOTES, [
        {
          id: 'ref_seed_1',
          isExample: true,
          timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000),
          text: sampleText,
          context: sampleContext,
          category: sampleCategory,
          status: 'pending',
          clinicalExtract: this.analyzeReflectionForTherapist(sampleText, sampleContext, sampleCategory)
        }
      ]);
    }
  }

  init() {
    this.requestBrowserPersistence();

    if (this.isVaultLocked()) {
      this.vaultLocked = true;
      this.memStore.clear();
      this.initIndexedDbMirror();
      if (this.getStorageMode() === 'local') {
        this.checkServerHealth();
      } else {
        this.initServerSync();
      }
      return;
    }

    this.loadPlainStoreIntoMemory();
    this.ensureDefaultSeedsInMemory();

    DATA_STORAGE_KEYS.forEach((key) => {
      if (!localStorage.getItem(key) && this.memStore.has(key)) {
        const serialized = JSON.stringify(this.memStore.get(key));
        localStorage.setItem(key, serialized);
        this.idbPut(key, serialized);
      }
    });

    const settings = this.getSettings();
    if (settings.theme) {
      try {
        localStorage.setItem(STORAGE_KEYS.THEME_PREF, settings.theme);
      } catch {
        // Ignore
      }
    }
    if (settings.palette) {
      try {
        localStorage.setItem(STORAGE_KEYS.PALETTE_PREF, settings.palette);
      } catch {
        // Ignore
      }
    }

    this.initIndexedDbMirror();

    if (this.getStorageMode() === 'local') {
      this.dbStatus = {
        ...this.dbStatus,
        connected: false,
        mode: 'local',
        engine: 'local',
        serverAvailable: false,
        serverCounts: null,
        lastSync: null
      };
      this.checkServerHealth();
    } else {
      this.initServerSync();
    }
  }

  getDbStatus() {
    return { ...this.dbStatus, mode: this.getStorageMode() };
  }

  trackWrite(promise) {
    if (!promise || typeof promise.then !=='function') return promise;
    this.pendingWrites.add(promise);
    const cleanup = () => this.pendingWrites.delete(promise);
    promise.then(cleanup, cleanup);
    return promise;
  }

  hasPendingWrites() {
    return this.pendingWrites.size > 0;
  }

  async flushPendingWrites(timeoutMs = 4000) {
    if (this.pendingWrites.size === 0) return true;
    let timedOut = false;
    const drain = (async () => {
      while (this.pendingWrites.size > 0 && !timedOut) {
        await Promise.allSettled(Array.from(this.pendingWrites));
      }
      return !timedOut;
    })();
    const timeout = new Promise((resolve) => {
      setTimeout(() => {
        timedOut = true;
        resolve(false);
      }, timeoutMs);
    });
    return Promise.race([drain, timeout]);
  }

  persistKey(storageKey, value, syncServer = true) {
    if (this.isVaultLocked() && storageKey !== STORAGE_KEYS.VAULT_META) {
      return;
    }

    this.memStore.set(storageKey, JSON.parse(JSON.stringify(value)));
    if (storageKey === STORAGE_KEYS.SETTINGS && value) {
      try {
        if (value.theme) localStorage.setItem(STORAGE_KEYS.THEME_PREF, value.theme);
        if (value.palette) localStorage.setItem(STORAGE_KEYS.PALETTE_PREF, value.palette);
        if (value.surface) localStorage.setItem(STORAGE_KEYS.SURFACE_PREF, value.surface);
        if (value.buttons) localStorage.setItem(STORAGE_KEYS.BUTTONS_PREF, value.buttons);
        if (value.explanations) localStorage.setItem(STORAGE_KEYS.EXPLANATIONS_PREF, value.explanations);
        if (value.customPalette) localStorage.setItem(STORAGE_KEYS.CUSTOM_PALETTE_PREF, JSON.stringify(value.customPalette));
      } catch {
        // Ignore
      }
    }

    const writeAndSync = async () => {
      let localPayload = value;
      let serverPayload = value;

      if (this.isVaultEnabled() && storageKey !== STORAGE_KEYS.VAULT_META) {
        if (!this.cryptoKey || this.vaultLocked) return;
        const envelope = await this.encryptValue(value, this.cryptoKey);
        localPayload = envelope;
        const serverKey = SERVER_KEY_MAP[storageKey];
        serverPayload = (serverKey && SERVER_ARRAY_KEYS.has(serverKey)) ? [envelope] : envelope;
      }

      const serialized = JSON.stringify(localPayload);
      localStorage.setItem(storageKey, serialized);
      await this.idbPut(storageKey, serialized);

      if (!syncServer || this.getStorageMode() === 'local') return;
      const serverKey = SERVER_KEY_MAP[storageKey];
      if (!serverKey || typeof fetch !== 'function') return;

      await fetch(`/api/state/${serverKey}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: serverPayload })
      })
        .then((res) => {
          if (res.status === 401) {
            this.dbStatus = {
              ...this.dbStatus,
              connected: false,
              serverAvailable: true,
              authRequired: true,
              authenticated: false
            };
            this.notify('db_status_changed', this.dbStatus);
            this.notify('auth_required', this.dbStatus);
            throw new Error('HTTP 401');
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(() => {
          this.dbStatus = {
            ...this.dbStatus,
            connected: true,
            mode: 'db',
            engine: 'sqlite',
            serverAvailable: true,
            lastSync: Date.now()
          };
          this.notify('db_status_changed', this.dbStatus);
        })
        .catch(() => {
          if (this.dbStatus.connected || this.dbStatus.serverAvailable) {
            this.dbStatus = {
              ...this.dbStatus,
              connected: false,
              mode: this.getStorageMode(),
              engine: 'local',
              serverAvailable: false,
              lastSync: this.dbStatus.lastSync
            };
            this.notify('db_status_changed', this.dbStatus);
          }
        });
    };

    const writePromise = writeAndSync().catch((err) => {
      console.error('persistKey failed', err);
    });
    this.trackWrite(writePromise);
  }

  collectAllState() {
    return {
      pazFalsa: this.getPazFalsaEntries(),
      actCrisis: this.getActCrisisEntries(),
      anchors: this.getAnchors(),
      settings: this.getSettings(),
      patterns: this.getPatterns(),
      compass: this.getCompassEntries(),
      pillFavorites: this.getPillFavorites(),
      hexaflex: this.getHexaflexHistory(),
      deconstruct: this.getDeconstructedStatements(),
      pivots: this.getPivots(),
      profile: this.getProfile(),
      therapyNotes: this.getTherapyReflections()
    };
  }

  async buildServerPayload() {
    if (!this.isVaultEnabled()) {
      return {
        ...this.collectAllState(),
        vaultMeta: this.getVaultMeta() || { enabled: false }
      };
    }

    const payload = {
      vaultMeta: this.getVaultMeta()
    };

    const plainSnapshots = new Map();
    if (this.cryptoKey && !this.vaultLocked) {
      for (const [storageKey] of Object.entries(SERVER_KEY_MAP)) {
        if (storageKey === STORAGE_KEYS.VAULT_META) continue;
        const val = this.memStore.has(storageKey)
          ? this.memStore.get(storageKey)
          : this.getDefaultValueForKey(storageKey);
        plainSnapshots.set(storageKey, JSON.parse(JSON.stringify(val)));
      }
    }

    for (const [storageKey, serverKey] of Object.entries(SERVER_KEY_MAP)) {
      if (storageKey === STORAGE_KEYS.VAULT_META) continue;
      if (this.cryptoKey && !this.vaultLocked) {
        const plainVal = plainSnapshots.get(storageKey);
        const envelope = await this.encryptValue(plainVal, this.cryptoKey);
        payload[serverKey] = SERVER_ARRAY_KEYS.has(serverKey) ? [envelope] : envelope;
      } else {
        const rawStr = localStorage.getItem(storageKey);
        if (rawStr) {
          const parsed = JSON.parse(rawStr);
          payload[serverKey] = (SERVER_ARRAY_KEYS.has(serverKey) && this.isEncryptedEnvelope(parsed)) ? [parsed] : parsed;
        }
      }
    }
    return payload;
  }

  async pushFullStateToServer(options = {}) {
    const mode = this.getStorageMode();
    if (mode === 'local' && !options.force) return false;
    if (typeof fetch !== 'function') return false;
    if (this.isVaultLocked() && !options.force) return false;
    try {
      const serverPayload = await this.buildServerPayload();
      const res = await fetch('/api/state', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverPayload)
      });
      if (res.status === 401) {
        this.dbStatus = {
          ...this.dbStatus,
          mode,
          connected: false,
          serverAvailable: true,
          authRequired: true,
          authenticated: false
        };
        this.notify('db_status_changed', this.dbStatus);
        this.notify('auth_required', this.dbStatus);
        return false;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      this.dbStatus = {
        ...this.dbStatus,
        mode,
        connected: mode === 'db',
        engine: mode === 'db' ? 'sqlite' : 'local',
        serverAvailable: true,
        lastSync: Date.now()
      };
      this.notify('db_status_changed', this.dbStatus);
      return true;
    } catch {
      this.dbStatus = {
        ...this.dbStatus,
        mode,
        connected: false,
        engine: 'local',
        serverAvailable: false,
        lastSync: this.dbStatus.lastSync
      };
      this.notify('db_status_changed', this.dbStatus);
      return false;
    }
  }

  async initServerSync() {
    if (this.getStorageMode() === 'local') return;
    if (typeof fetch !== 'function') {
      this.dbStatus = { ...this.dbStatus, serverChecked: true, serverAvailable: false };
      return;
    }
    const explicitMode = localStorage.getItem(STORAGE_KEYS.STORAGE_MODE);
    try {
      const res = await fetch('/api/state', { cache: 'no-store', credentials: 'same-origin' });
      if (res.status === 401) {
        this.dbStatus = {
          ...this.dbStatus,
          mode: 'db',
          connected: false,
          engine: 'local',
          serverChecked: true,
          serverAvailable: true,
          authRequired: true,
          authenticated: false
        };
        this.notify('db_status_changed', this.dbStatus);
        this.notify('auth_required', this.dbStatus);
        return;
      }
      if (!res.ok) {
        let errJson = null;
        try { errJson = await res.json(); } catch {}
        if (errJson && errJson.sqliteEnabled === false) {
          localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'local');
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const payload = await res.json();
      if (!payload || !payload.ok || !payload.state) throw new Error('Invalid state payload');

      if (payload.meta && payload.meta.hasData) {
        await this.ingestServerState(payload.state);
        this.dbStatus = {
          ...this.dbStatus,
          mode: 'db',
          connected: true,
          engine: 'sqlite',
          serverChecked: true,
          serverAvailable: true,
          authenticated: true,
          lastSync: Date.now()
        };
        this.notify('server_synced', payload.state);
        this.notify('db_status_changed', this.dbStatus);
      } else if (!this.isVaultLocked()) {
        await this.pushFullStateToServer();
        this.notify('server_synced', this.collectAllState());
      }
    } catch {
      if (!explicitMode) {
        localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'local');
      }
      const mode = this.getStorageMode();
      this.dbStatus = {
        ...this.dbStatus,
        mode,
        connected: false,
        engine: 'local',
        serverChecked: true,
        serverAvailable: false,
        lastSync: null
      };
      this.notify('db_status_changed', this.dbStatus);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(event, data);
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    });
  }

  // Settings & Mind Name
  getSettings() {
    try {
      const s = this.getStoreItem(STORAGE_KEYS.SETTINGS, this.getDefaultValueForKey(STORAGE_KEYS.SETTINGS)) || {};
      if (typeof s.mindName !== 'string') s.mindName = '';
      return s;
    } catch {
      return { mindName: '', mindNameCustomized: false };
    }
  }

  saveSettings(settings) {
    this.persistKey(STORAGE_KEYS.SETTINGS, settings);
    this.notify('settings_updated', settings);
  }

  // Legacy installs stored 'George' as an implicit default; only treat it as a nickname if the user chose it.
  hasCustomMindName() {
    const s = this.getSettings();
    const raw = String(s.mindName || '').trim();
    if (!raw) return false;
    if (raw === 'George' && s.mindNameCustomized !== true) return false;
    return true;
  }

  getMindName() {
    return this.hasCustomMindName() ? String(this.getSettings().mindName).trim() : 'Mi mente';
  }

  setMindName(name) {
    const s = this.getSettings();
    const clean = String(name || '').trim();
    s.mindName = clean;
    s.mindNameCustomized = Boolean(clean);
    this.saveSettings(s);
  }

  // Paz Falsa Entries
  getPazFalsaEntries() {
    return this.getStoreItem(STORAGE_KEYS.PAZ_FALSA, []);
  }

  addPazFalsaEntry(entry) {
    const entries = this.getPazFalsaEntries();
    const newEntry = {
      id: 'pf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      followUpNotes: [],
      ...entry
    };
    entries.unshift(newEntry);
    this.persistKey(STORAGE_KEYS.PAZ_FALSA, entries);
    this.notify('paz_falsa_added', newEntry);
    return newEntry;
  }

  addPazFalsaFollowUp(entryId, noteText) {
    const entries = this.getPazFalsaEntries();
    const target = entries.find(e => e.id === entryId);
    if (target) {
      if (!target.followUpNotes) target.followUpNotes = [];
      target.followUpNotes.push({
        id: 'note_' + Date.now(),
        timestamp: Date.now(),
        text: noteText
      });
      this.persistKey(STORAGE_KEYS.PAZ_FALSA, entries);
      this.notify('entry_updated', target);
      return true;
    }
    return false;
  }

  // ACT Crisis Entries
  getActCrisisEntries() {
    return this.getStoreItem(STORAGE_KEYS.ACT_CRISIS, []);
  }

  addActCrisisEntry(entry) {
    const entries = this.getActCrisisEntries();
    const newEntry = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      followUpNotes: [],
      ...entry
    };
    entries.unshift(newEntry);
    this.persistKey(STORAGE_KEYS.ACT_CRISIS, entries);
    this.notify('act_crisis_added', newEntry);
    return newEntry;
  }

  addActCrisisFollowUp(entryId, noteText) {
    const entries = this.getActCrisisEntries();
    const target = entries.find(e => e.id === entryId);
    if (target) {
      if (!target.followUpNotes) target.followUpNotes = [];
      target.followUpNotes.push({
        id: 'note_' + Date.now(),
        timestamp: Date.now(),
        text: noteText
      });
      this.persistKey(STORAGE_KEYS.ACT_CRISIS, entries);
      this.notify('entry_updated', target);
      return true;
    }
    return false;
  }

  // Anchor Cards
  getAnchors() {
    return this.getStoreItem(STORAGE_KEYS.ANCHORS, DEFAULT_ANCHORS);
  }

  addAnchor(text, author = 'Personal', category = 'Anclaje') {
    const anchors = this.getAnchors();
    const newAnchor = {
      id: 'anc_' + Date.now(),
      text,
      author,
      category
    };
    anchors.unshift(newAnchor);
    this.persistKey(STORAGE_KEYS.ANCHORS, anchors);
    this.notify('anchor_added', newAnchor);
    return newAnchor;
  }

  updateAnchor(id, patch = {}) {
    const anchors = this.getAnchors();
    const target = anchors.find(a => a.id === id);
    if (!target) return null;
    if (patch.text !== undefined) target.text = String(patch.text).trim();
    if (patch.category !== undefined) target.category = String(patch.category).trim();
    if (patch.author !== undefined) target.author = String(patch.author).trim();
    this.persistKey(STORAGE_KEYS.ANCHORS, anchors);
    this.notify('anchor_updated', target);
    return target;
  }

  deleteAnchor(id) {
    const anchors = this.getAnchors().filter(a => a.id !== id);
    this.persistKey(STORAGE_KEYS.ANCHORS, anchors);
    this.notify('anchor_deleted', id);
    return anchors;
  }

  // SUB-APP 4: PATTERNS LAB
  getPatterns() {
    return this.getStoreItem(STORAGE_KEYS.PATTERNS, []);
  }

  addPattern(patternData) {
    const patterns = this.getPatterns();
    const newPattern = {
      id: 'pat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: Date.now(),
      title: patternData.title || 'Patrón recurrente',
      category: patternData.category || 'General',
      loop: {
        trigger: patternData.loop?.trigger || '',
        autoResponse: patternData.loop?.autoResponse || '',
        shortTermGain: patternData.loop?.shortTermGain || '',
        longTermCost: patternData.loop?.longTermCost || ''
      },
      weeklyExperiment: {
        text: patternData.weeklyExperiment?.text || '',
        definedAt: Date.now(),
        targetDate: Date.now() + (7 * 24 * 60 * 60 * 1000)
      },
      checkins: []
    };
    patterns.unshift(newPattern);
    this.persistKey(STORAGE_KEYS.PATTERNS, patterns);
    this.notify('pattern_added', newPattern);
    return newPattern;
  }

  updatePattern(patternId, patch) {
    const patterns = this.getPatterns();
    const idx = patterns.findIndex(p => p.id === patternId);
    if (idx !== -1) {
      patterns[idx] = { ...patterns[idx], ...patch, updatedAt: Date.now() };
      this.persistKey(STORAGE_KEYS.PATTERNS, patterns);
      this.notify('pattern_updated', patterns[idx]);
      return patterns[idx];
    }
    return null;
  }

  addPatternCheckin(patternId, checkinData) {
    const patterns = this.getPatterns();
    const target = patterns.find(p => p.id === patternId);
    if (target) {
      if (!target.checkins) target.checkins = [];
      const newCheckin = {
        id: 'chk_' + Date.now(),
        timestamp: Date.now(),
        status: checkinData.status || 'completed',
        learned: checkinData.learned || '',
        nextStep: checkinData.nextStep || ''
      };
      target.checkins.unshift(newCheckin);
      this.persistKey(STORAGE_KEYS.PATTERNS, patterns);
      this.notify('pattern_checkin_added', { patternId, checkin: newCheckin });
      return newCheckin;
    }
    return null;
  }

  deletePattern(patternId) {
    let patterns = this.getPatterns();
    patterns = patterns.filter(p => p.id !== patternId);
    this.persistKey(STORAGE_KEYS.PATTERNS, patterns);
    this.notify('pattern_deleted', patternId);
  }

  // SUB-APP 5: COMPASS ENTRIES
  getCompassEntries() {
    return this.getStoreItem(STORAGE_KEYS.COMPASS, []);
  }

  addCompassEntry(entryData) {
    const entries = this.getCompassEntries();
    const newEntry = {
      id: 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      situation: entryData.situation || '',
      selectedValue: entryData.selectedValue !== undefined ? String(entryData.selectedValue).trim() : '',
      answers: entryData.answers || {},
      keyAction: entryData.keyAction || ''
    };
    entries.unshift(newEntry);
    this.persistKey(STORAGE_KEYS.COMPASS, entries);
    this.notify('compass_added', newEntry);
    return newEntry;
  }

  // SUB-APP 6: PILL FAVORITES
  getPillFavorites() {
    return this.getStoreItem(STORAGE_KEYS.PILL_FAVORITES, []);
  }

  togglePillFavorite(pillId) {
    const favorites = this.getPillFavorites();
    const idx = favorites.indexOf(pillId);
    let isFavorite = false;
    if (idx > -1) {
      favorites.splice(idx, 1);
      isFavorite = false;
    } else {
      favorites.push(pillId);
      isFavorite = true;
    }
    this.persistKey(STORAGE_KEYS.PILL_FAVORITES, favorites);
    this.notify('pill_favorite_toggled', { pillId, isFavorite });
    return isFavorite;
  }

  // -------------------------------------------------------------
  // STEVEN HAYES TOOLS: HEXAFLEX, DECONSTRUCTOR, PIVOT
  // -------------------------------------------------------------
  getHexaflexHistory() {
    return this.getStoreItem(STORAGE_KEYS.HEXAFLEX, []);
  }

  addHexaflexScore(scores) {
    const history = this.getHexaflexHistory();
    const newScore = {
      id: 'hex_' + Date.now(),
      timestamp: Date.now(),
      scores: {
        acceptance: scores.acceptance || 5, // Aceptación
        defusion: scores.defusion || 5,     // Defusión
        present: scores.present || 5,       // Momento Presente
        context: scores.context || 5,       // Yo como Contexto
        values: scores.values || 5,         // Valores
        action: scores.action || 5          // Acción Comprometida
      }
    };
    history.unshift(newScore);
    this.persistKey(STORAGE_KEYS.HEXAFLEX, history);
    this.notify('hexaflex_added', newScore);
    return newScore;
  }

  getDeconstructedStatements() {
    return this.getStoreItem(STORAGE_KEYS.DECONSTRUCT, []);
  }

  addDeconstructedStatement(item) {
    const items = this.getDeconstructedStatements();
    const newItem = {
      id: 'dec_' + Date.now(),
      timestamp: Date.now(),
      rigidLabel: item.rigidLabel,
      softened: item.softened,
      contextualized: item.contextualized
    };
    items.unshift(newItem);
    this.persistKey(STORAGE_KEYS.DECONSTRUCT, items);
    this.notify('deconstruct_added', newItem);
    return newItem;
  }

  getPivots() {
    return this.getStoreItem(STORAGE_KEYS.PIVOTS, []);
  }

  addPivot(pivotData) {
    const pivots = this.getPivots();
    const newPivot = {
      id: 'piv_' + Date.now(),
      timestamp: Date.now(),
      pain: pivotData.pain,
      yearning: pivotData.yearning,
      pivotAction: pivotData.pivotAction
    };
    pivots.unshift(newPivot);
    this.persistKey(STORAGE_KEYS.PIVOTS, pivots);
    this.notify('pivot_added', newPivot);
    return newPivot;
  }

  getDefaultBusPassengers() {
    return [
      {
        id: 'pas_seed_1',
        isExample: true,
        icon:'',
        name: 'El Policía de la Culpa ("Eres egoísta")',
        shouts: 'Si te priorizas o dices que no, harás daño y pensarán mal de ti.',
        protectsFrom: 'Sentirme mala persona o que me rechacen',
        detour: 'Ceder y cargar con todo aunque esté agotado/a',
        driverReply: 'Sé que intentas protegerme del rechazo, pero ceder va contra mi valor. Toma asiento atrás; hoy conduzco yo.',
        status: 'seated',
        createdAt: Date.now()
      },
      {
        id: 'pas_seed_2',
        isExample: true,
        icon:'',
        name: 'El Vigilante del Enfado Ajeno',
        shouts: 'Gira por el camino seguro y cede ahora mismo para evitar caras largas.',
        protectsFrom: 'La tensión, el conflicto o la frialdad del otro',
        detour: 'Callarme lo que pienso y sonreír para apaciguar',
        driverReply: 'Gracias por avisarme del miedo al conflicto, pero mis manos siguen en el volante hacia mis valores. Puedes ir atrás.',
        status: 'loud',
        createdAt: Date.now()
      }
    ];
  }

  isExampleItem(item) {
    if (!item || typeof item !== 'object') return false;
    if (item.isExample === false) return false;
    if (item.isExample === true) return true;
    const id = String(item.id || '');
    return id.includes('_seed_') || id.startsWith('demo_') || id === 'dec_1' || id === 'piv_1';
  }

  countExampleItems() {
    if (this.isVaultLocked()) return 0;
    const profile = this.getProfile();
    const lists = [
      profile.coreValues || [],
      profile.busPassengers || [],
      profile.progressLog || [],
      this.getAnchors(),
      this.getPazFalsaEntries(),
      this.getActCrisisEntries(),
      this.getPatterns(),
      this.getCompassEntries(),
      this.getHexaflexHistory(),
      this.getDeconstructedStatements(),
      this.getPivots(),
      this.getTherapyReflections()
    ];
    return lists.reduce((acc, arr) => acc + arr.filter(item => this.isExampleItem(item)).length, 0);
  }

  hasExampleData() {
    return this.countExampleItems() > 0;
  }

  clearExampleData() {
    if (this.isVaultLocked()) return 0;
    const removedCount = this.countExampleItems();

    const p = this.getProfile();
    p.coreValues = (p.coreValues || []).filter(v => !this.isExampleItem(v));
    p.busPassengers = (p.busPassengers || []).filter(pas => !this.isExampleItem(pas));
    p.progressLog = (p.progressLog || []).filter(entry => !this.isExampleItem(entry));
    this.persistKey(STORAGE_KEYS.PROFILE, p, false);

    this.persistKey(STORAGE_KEYS.ANCHORS, this.getAnchors().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.PILL_FAVORITES, this.getPillFavorites().filter(id => !String(id || '').startsWith('demo_')), false);
    this.persistKey(STORAGE_KEYS.PAZ_FALSA, this.getPazFalsaEntries().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.ACT_CRISIS, this.getActCrisisEntries().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.PATTERNS, this.getPatterns().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.COMPASS, this.getCompassEntries().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.HEXAFLEX, this.getHexaflexHistory().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.DECONSTRUCT, this.getDeconstructedStatements().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.PIVOTS, this.getPivots().filter(x => !this.isExampleItem(x)), false);
    this.persistKey(STORAGE_KEYS.THERAPY_NOTES, this.getTherapyReflections().filter(x => !this.isExampleItem(x)), false);

    this.pushFullStateToServer();
    this.notify('examples_cleared', removedCount);
    this.notify('data_cleared', null);
    return removedCount;
  }

  // User Profile (Constructed Values by Hayes, Active Barriers, Bus Passengers, Challenges, Current Concern)
  getProfile() {
    const legacyMap = {
      dignidad: 'Actuar con dignidad y respeto hacia mí mismo incluso cuando incomode al otro',
      autocuidado: 'Cuidar mi energía física y emocional como una prioridad legítima',
      honestidad: 'Expresar mi verdad con amabilidad aunque resulte difícil',
      autonomia: 'Tomar mis decisiones desde lo que valoro y no desde el miedo',
      paz_interior: 'Cultivar una calma que nazca del respeto propio',
      conexion: 'Construir vínculos genuinos sin sumisión disfrazada',
      valentia: 'Dar pasos hacia lo que me importa aunque sienta miedo',
      autenticidad: 'Mostrarme tal como soy sin pedir permiso',
      libertad: 'Elegir mi camino sin someterme al guion emocional ajeno',
      respeto: 'Tratar y ser tratado en pie de igualdad',
      amor_propio: 'Tratarme con ternura incluso en mi vulnerabilidad',
      responsabilidad: 'Hacerme cargo de mis actos y sostener mis límites'
    };

    try {
      if (this.isVaultLocked()) {
        return {
          coreValues: [],
          activeBarriers: [],
          busPassengers: this.getDefaultBusPassengers(),
          challenges: [],
          currentConcern: { text: '', context: '', updatedAt: null },
          progressLog: []
        };
      }
      const raw = this.getStoreItem(STORAGE_KEYS.PROFILE, {}) || {};
      let values = Array.isArray(raw.coreValues) ? raw.coreValues : [];
      let migrated = false;

      values = values.map((v, idx) => {
        if (typeof v === 'string') {
          migrated = true;
          return {
            id: 'val_mig_' + idx + '_' + Date.now(),
            domain: 'Conmigo Mismo',
            statement: legacyMap[v] || `Cultivar ${v} de forma activa y consciente`,
            microAction: 'Observar una oportunidad concreta para elegir desde este valor',
            willingness: 'Hacer espacio a la incomodidad que surja al sostenerlo',
            lensUsed: 'Migrado de brújula',
            createdAt: Date.now()
          };
        }
        return v;
      });

      const hasPassengers = Array.isArray(raw.busPassengers);
      if (!hasPassengers) migrated = true;

      const normalized = {
        coreValues: values,
        activeBarriers: Array.isArray(raw.activeBarriers) ? raw.activeBarriers : [],
        busPassengers: hasPassengers ? raw.busPassengers : this.getDefaultBusPassengers(),
        challenges: Array.isArray(raw.challenges) ? raw.challenges : [],
        currentConcern: raw.currentConcern || { text: '', context: '', updatedAt: null },
        progressLog: Array.isArray(raw.progressLog) ? raw.progressLog : []
      };

      if (migrated) {
        this.persistKey(STORAGE_KEYS.PROFILE, normalized, false);
      }

      return normalized;
    } catch {
      return {
        coreValues: [],
        activeBarriers: [],
        busPassengers: [
          {
            id: 'pas_seed_1',
            icon:'',
            name: 'El Policía de la Culpa ("Eres egoísta")',
            shouts: 'Si te priorizas o dices que no, harás daño y pensarán mal de ti.',
            protectsFrom: 'Sentirme mala persona o que me rechacen',
            detour: 'Ceder y cargar con todo aunque esté agotado/a',
            driverReply: 'Sé que intentas protegerme del rechazo, pero ceder va contra mi valor. Toma asiento atrás; hoy conduzco yo.',
            status: 'seated',
            createdAt: Date.now()
          },
          {
            id: 'pas_seed_2',
            icon:'',
            name: 'El Vigilante del Enfado Ajeno',
            shouts: 'Gira por el camino seguro y cede ahora mismo para evitar caras largas.',
            protectsFrom: 'La tensión, el conflicto o la frialdad del otro',
            detour: 'Callarme lo que pienso y sonreír para apaciguar',
            driverReply: 'Gracias por avisarme del miedo al conflicto, pero mis manos siguen en el volante hacia mis valores. Puedes ir atrás.',
            status: 'loud',
            createdAt: Date.now()
          }
        ],
        challenges: [],
        currentConcern: { text: '', context: '', updatedAt: null },
        progressLog: []
      };
    }
  }

  saveProfile(profile) {
    this.persistKey(STORAGE_KEYS.PROFILE, profile);
    this.notify('profile_updated', profile);
  }

  setCoreValues(values) {
    const p = this.getProfile();
    p.coreValues = values.slice(0, 8);
    this.saveProfile(p);
  }

  addConstructedValue(valObj) {
    const p = this.getProfile();
    const newVal = {
      id: 'val_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      domain: valObj.domain || 'Conmigo Mismo',
      statement: (valObj.statement || '').trim(),
      microAction: (valObj.microAction || '').trim(),
      willingness: (valObj.willingness || '').trim(),
      lensUsed: valObj.lensUsed || 'Constructor de Hayes',
      createdAt: Date.now()
    };
    p.coreValues.unshift(newVal);
    p.progressLog.unshift({
      date: Date.now(),
      type: 'values_updated',
      note: `Nuevo valor construido (${newVal.domain}): "${newVal.statement}"`
    });
    this.saveProfile(p);
    return newVal;
  }

  removeConstructedValue(valId) {
    const p = this.getProfile();
    const removed = p.coreValues.find(v => v.id === valId);
    p.coreValues = p.coreValues.filter(v => v.id !== valId);
    if (removed) {
      p.progressLog.unshift({
        date: Date.now(),
        type: 'values_updated',
        note: `Valor retirado (${removed.domain}): "${removed.statement}"`
      });
    }
    this.saveProfile(p);
  }

  updateConstructedValue(valId, patch) {
    const p = this.getProfile();
    const target = p.coreValues.find(v => v.id === valId);
    if (!target) return null;

    if (patch.domain !== undefined) target.domain = patch.domain || target.domain;
    if (patch.statement !== undefined) target.statement = String(patch.statement).trim();
    if (patch.microAction !== undefined) target.microAction = String(patch.microAction).trim();
    if (patch.willingness !== undefined) target.willingness = String(patch.willingness).trim();
    if (patch.lensUsed !== undefined) target.lensUsed = patch.lensUsed || target.lensUsed;
    target.isExample = false;
    target.updatedAt = Date.now();

    p.progressLog.unshift({
      date: Date.now(),
      type: 'values_updated',
      note: `Valor actualizado (${target.domain}): "${target.statement}"`
    });
    this.saveProfile(p);
    return target;
  }

  setPrimaryConstructedValue(valId) {
    const p = this.getProfile();
    const idx = p.coreValues.findIndex(v => v.id === valId);
    if (idx === -1) return null;
    const [chosen] = p.coreValues.splice(idx, 1);
    p.coreValues.unshift(chosen);
    p.progressLog.unshift({
      date: Date.now(),
      type: 'values_updated',
      note:`Valor Faro Principal fijado (${chosen.domain}):"${chosen.statement}"`
    });
    this.saveProfile(p);
    return chosen;
  }

  logValuePractice(valId) {
    const p = this.getProfile();
    const val = p.coreValues.find(v => v.id === valId);
    if (!val) return null;
    val.practicedCount = (val.practicedCount || 0) + 1;
    val.lastPracticedAt = Date.now();
    p.progressLog.unshift({
      date: Date.now(),
      type: 'values_updated',
      note:`Paso dado en ${val.domain}:"${val.microAction || val.statement}"`
    });
    this.saveProfile(p);
    return val;
  }

  toggleActiveBarrier(barrierId, barrierLabel) {
    const p = this.getProfile();
    const idx = p.activeBarriers.indexOf(barrierId);
    if (idx > -1) {
      p.activeBarriers.splice(idx, 1);
    } else {
      p.activeBarriers.push(barrierId);
      p.progressLog.unshift({
        date: Date.now(),
        type: 'barrier_toggled',
        note: `Barrera identificada en tu foco: "${barrierLabel || barrierId}"`
      });
    }
    this.saveProfile(p);
  }

  addBusPassenger(passengerObj) {
    const p = this.getProfile();
    if (!Array.isArray(p.busPassengers)) p.busPassengers = [];
    const newPas = {
      id: 'pas_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      icon: passengerObj.icon ||'',
      name: (passengerObj.name || '').trim(),
      shouts: (passengerObj.shouts || '').trim(),
      protectsFrom: (passengerObj.protectsFrom || '').trim(),
      detour: (passengerObj.detour || '').trim(),
      driverReply: (passengerObj.driverReply || '').trim(),
      affectedValues: Array.isArray(passengerObj.affectedValues) ? [...new Set(passengerObj.affectedValues.filter(Boolean))] : [],
      status: passengerObj.status || 'loud', // loud | seated | integrated
      createdAt: Date.now()
    };
    if (!newPas.name) return null;
    p.busPassengers.unshift(newPas);
    p.progressLog.unshift({
      date: Date.now(),
      type: 'passenger_added',
      note: `${newPas.icon} Pasajero fichado en Mi Autobús: "${newPas.name}"`
    });
    this.saveProfile(p);
    return newPas;
  }

  updateBusPassenger(passengerId, patch) {
    const p = this.getProfile();
    if (!Array.isArray(p.busPassengers)) return null;
    const target = p.busPassengers.find(pas => pas.id === passengerId);
    if (!target) return null;

    if (patch.icon !== undefined) target.icon = patch.icon || target.icon ||'';
    if (patch.name !== undefined) target.name = String(patch.name).trim();
    if (patch.shouts !== undefined) target.shouts = String(patch.shouts).trim();
    if (patch.protectsFrom !== undefined) target.protectsFrom = String(patch.protectsFrom).trim();
    if (patch.detour !== undefined) target.detour = String(patch.detour).trim();
    if (patch.driverReply !== undefined) target.driverReply = String(patch.driverReply).trim();
    if (patch.affectedValues !== undefined) {
      target.affectedValues = Array.isArray(patch.affectedValues) ? [...new Set(patch.affectedValues.filter(Boolean))] : [];
    }
    if (patch.status !== undefined) target.status = patch.status || target.status;
    target.isExample = false;
    target.updatedAt = Date.now();

    p.progressLog.unshift({
      date: Date.now(),
      type: 'passenger_status',
      note:`${target.icon ||''} Pasajero actualizado:"${target.name}"`
    });
    this.saveProfile(p);
    return target;
  }

  updateBusPassengerStatus(passengerId, newStatus) {
    const p = this.getProfile();
    if (!Array.isArray(p.busPassengers)) return;
    const target = p.busPassengers.find(pas => pas.id === passengerId);
    if (target) {
      target.status = newStatus;
      const labels = {
        loud:'Haciendo ruido (A medias)',
        seated:'Sentado atrás (En trabajo)',
        integrated:'Aceptado e integrado'
      };
      p.progressLog.unshift({
        date: Date.now(),
        type: 'passenger_status',
        note:`"${target.name}": ${labels[newStatus] || newStatus}`
      });
      this.saveProfile(p);
    }
  }

  removeBusPassenger(passengerId) {
    const p = this.getProfile();
    if (!Array.isArray(p.busPassengers)) return;
    p.busPassengers = p.busPassengers.filter(pas => pas.id !== passengerId);
    this.saveProfile(p);
  }

  // Cuaderno de Terapia y Reflexiones para el Psicólogo
  getTherapyReflections() {
    return this.getStoreItem(STORAGE_KEYS.THERAPY_NOTES, []);
  }

  analyzeReflectionForTherapist(text, context, category, langOverride = null) {
    const raw = (text || '').trim();
    const lower = raw.toLowerCase();
    const isEn = langOverride
      ? langOverride === 'en'
      : (typeof window !== 'undefined' && Boolean(window.i18n?.isEn?.()));

    const emotionLexicon = [
      { keys: ['culpa', 'culpable', 'remordimiento', 'guilt', 'remorse'], label: isEn ? 'Guilt' : 'Culpa' },
      { keys: ['miedo', 'temor', 'asust', 'pánico', 'fear', 'afraid', 'scared', 'panic'], label: isEn ? 'Fear / Threat' : 'Miedo / Amenaza' },
      { keys: ['vergüenza', 'ridícul', 'humill', 'shame', 'embarrass', 'humiliat'], label: isEn ? 'Shame' : 'Vergüenza' },
      { keys: ['ansiedad', 'agobio', 'angustia', 'nervios', 'alerta', 'tensión', 'anxiety', 'anxious', 'overwhelm', 'alert', 'tension', 'dread'], label: isEn ? 'Anxiety / Hypervigilance' : 'Ansiedad / Hiperalerta' },
      { keys: ['rabia', 'ira', 'enfad', 'frustr', 'impotencia', 'indign', 'anger', 'angry', 'rage', 'frustrat', 'resent'], label: isEn ? 'Anger / Frustration' : 'Ira / Frustración' },
      { keys: ['trist', 'pena', 'dolor', 'llor', 'vacío', 'soledad', 'sad', 'grief', 'pain', 'cry', 'empty', 'lonel'], label: isEn ? 'Sadness / Disconnection' : 'Tristeza / Desconexión' },
      { keys: ['agot', 'cansan', 'desgaste', 'peso', 'drenad', 'exhaust', 'drain', 'tired', 'fatigue', 'burnout'], label: isEn ? 'Exhaustion / Burden' : 'Agotamiento / Carga' },
      { keys: ['rechazo', 'abandono', 'desaprobación', 'decepcion', 'reject', 'abandon', 'disapprov', 'disappoint'], label: isEn ? 'Fear of Rejection' : 'Miedo al rechazo' },
      { keys: ['alivio', 'calma', 'paz', 'orgullo', 'libre', 'coheren', 'relief', 'calm', 'peace', 'proud', 'free', 'integrity'], label: isEn ? 'Relief / Integrity' : 'Alivio / Coherencia' }
    ];

    const emotions = emotionLexicon
      .filter(item => item.keys.some(k => lower.includes(k)))
      .map(item => item.label);

    if (emotions.length === 0) {
      emotions.push(isEn ? 'Discomfort / Implicit emotional activation' : 'Malestar / Activación emocional implícita');
    }

    const processes = [];
    if (['evit', 'ced', 'justific', 'explic', 'disculp', 'call', 'tragu', 'huir', 'hui', 'complac', 'cara', 'tono', 'aprobación', 'falsa paz', 'conflicto', 'avoid', 'cav', 'gave in', 'apolog', 'quiet', 'silen', 'pleas', 'approv', 'false peace', 'conflict', 'frown'].some(k => lower.includes(k))) {
      processes.push(isEn ? 'Experiential Avoidance / False Peace' : 'Evitación Experiencial / Falsa Paz');
    }
    if (['pienso', 'pensé', 'mente', 'historia', 'soy ', 'siempre', 'nunca', 'egoísta', 'débil', 'debería', 'tengo que', 'van a pensar', 'voz', 'think', 'thought', 'mind', 'story', 'i am ', 'always', 'never', 'selfish', 'weak', 'should', 'have to', 'voice'].some(k => lower.includes(k))) {
      processes.push(isEn ? 'Cognitive Fusion / Rigid Rule' : 'Fusión Cognitiva / Regla rígida');
    }
    if (['límite', 'autoabandono', 'traicion', 'dije que sí', 'posterg', 'dejé de', 'necesidad', 'boundar', 'self-abandon', 'betray', 'said yes', 'postpon', 'need'].some(k => lower.includes(k))) {
      processes.push(isEn ? 'Values Disconnect / Self-Abandonment' : 'Desconexión de Valores / Autoabandono');
    }
    if (['paus', 'respir', 'acept', 'observ', 'pasajero', 'volante', 'elegí', 'sostuv', 'límite claro', 'autentic', 'valor', 'breath', 'accept', 'notic', 'observ', 'passenger', 'wheel', 'chose', 'held', 'value', 'authent'].some(k => lower.includes(k))) {
      processes.push(isEn ? 'Flexibility / Committed Action' : 'Flexibilidad / Acción Comprometida');
    }
    if (['cuerpo', 'pecho', 'estómago', 'garganta', 'nudo', 'hombros', 'mandíbula', 'físic', 'body', 'chest', 'stomach', 'throat', 'knot', 'shoulder', 'jaw', 'somatic'].some(k => lower.includes(k))) {
      processes.push(isEn ? 'Somatic Awareness / Present Self' : 'Conciencia Somática / Yo Presente');
    }

    const hexaflexProcess = processes.length > 0
      ? processes.join(' + ')
      : (isEn ? 'Self-Observation & Context (Self-as-Context)' : 'Autoobservación y Contexto (Yo como Contexto)');

    const patterns = [];
    if (['justific', 'explic', 'disculp', 'convenc', 'over-explain', 'excuse', 'apolog'].some(k => lower.includes(k))) {
      patterns.push(isEn ? 'Over-explaining or preemptive apologizing to appease' : 'Sobre-explicación o disculpa preventiva para aplacar al otro');
    }
    if (['ced', 'dije que sí', 'complac', 'callé', 'tragué', 'falsa paz', 'cav', 'gave in', 'said yes', 'pleas', 'swallow', 'false peace'].some(k => lower.includes(k))) {
      patterns.push(isEn ? 'Appeasing / False Peace at the cost of personal needs' : 'Complacencia / Falsa Paz a costa de las propias necesidades');
    }
    if (['tono', 'silencio', 'cara', 'mirada', 'alerta', 'rechaz', 'enfad', 'reacción', 'tone', 'silen', 'face', 'frown', 'alert', 'reject', 'angry', 'react'].some(k => lower.includes(k))) {
      patterns.push(isEn ? 'Hypervigilance to interpersonal cues (relational threat)' : 'Hipervigilancia a señales micro-interpersonales (amenaza relacional)');
    }
    if (['vueltas', 'rumi', 'culp', 'reproch', 'exig', 'agot', 'ruminat', 'spin', 'guilt', 'drain', 'exhaust'].some(k => lower.includes(k))) {
      patterns.push(isEn ? 'Self-critical rumination or post-event fatigue' : 'Rumiación autocrítica o desgaste posterior al evento');
    }
    if (['puse', 'dije que no', 'sostuv', 'elegí', 'paré', 'pausé', 'expresé', 'said no', 'held', 'chose', 'paused', 'stopp', 'express'].some(k => lower.includes(k))) {
      patterns.push(isEn ? 'Value-aligned alternative behavior (discomfort exposure)' : 'Conducta alternativa alineada con valores (exposición al malestar)');
    }

    const behaviorPattern = patterns.length > 0
      ? patterns.join('; ')
      : (category === 'Logro o cambio observado'
        ? (isEn ? 'Consolidation of mindful response to prior triggers' : 'Consolidación de respuesta consciente frente a disparadores previos')
        : (isEn ? 'Interpersonal regulation / ongoing boundary exploration' : 'Regulación interpersonal / exploración de límites en curso'));

    let sessionFocus = '';
    const ctxLabel = isEn ? this.tr(context || 'General') : (context || 'General');
    if (behaviorPattern.includes('Sobre-explicación') || behaviorPattern.includes('Complacencia') || behaviorPattern.includes('Over-explaining') || behaviorPattern.includes('Appeasing')) {
      sessionFocus = isEn
        ? `Explore in ${ctxLabel} what protective function appeasing plays, what fear surfaces when holding another's silence without justifying, and how to rehearse minimal boundaries while tolerating guilt.`
        : `Explorar en ${ctxLabel} qué función protectora cumple apaciguar al otro, qué temor aparece al sostener el silencio ajeno sin justificarse y cómo ensayar límites mínimos tolerando la culpa.`;
    } else if (processes.some(p => p.includes('Fusión') || p.includes('Fusion'))) {
      sessionFocus = isEn
        ? `Work in ${ctxLabel} on the origin and function of implicit verbal rules ("should / I am...") via defusion and self-compassion without obeying the automatic command.`
        : `Trabajar en ${ctxLabel} el origen y función de la regla verbal implícita ("debería / soy...") mediante defusión y autocompasión sin obedecer al mandato automático.`;
    } else if (processes.some(p => p.includes('Flexibilidad') || p.includes('Flexibility')) || category === 'Logro o cambio observado') {
      sessionFocus = isEn
        ? `Reinforce discriminative learning in ${ctxLabel}: what helped hold discomfort and how to generalize this value-driven step to more demanding contexts.`
        : `Reforzar el aprendizaje discriminativo en ${ctxLabel}: qué facilitó sostener la incomodidad y cómo generalizar este movimiento de valores a contextos más exigentes.`;
    } else if (category === 'Duda o pregunta para sesión') {
      sessionFocus = isEn
        ? `Address the clinical question in ${ctxLabel}, distinguishing when a behavior stems from genuine care vs. subtle conflict avoidance.`
        : `Abordar la pregunta clínica en ${ctxLabel} distinguiendo cuándo una conducta responde a cuidado genuino vs. evitación sutil del conflicto.`;
    } else {
      sessionFocus = isEn
        ? `Map antecedent -> inner passenger -> relief behavior vs. long-term cost in ${ctxLabel} to spot the therapeutic pivot point.`
        : `Mapear antecedente -> pasajero interno -> conducta de alivio vs. coste en ${ctxLabel} para identificar el punto de inflexión terapéutico.`;
    }

    return {
      emotions,
      hexaflexProcess,
      behaviorPattern,
      sessionFocus
    };
  }

  addTherapyReflection({ text, context, category }) {
    const cleanText = (text || '').trim();
    if (!cleanText) return null;
    const cleanContext = (context || 'General').trim();
    const cleanCategory = (category || 'Idea o insight entre sesiones').trim();
    const list = this.getTherapyReflections();
    const entry = {
      id: 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
      text: cleanText,
      context: cleanContext,
      category: cleanCategory,
      status: 'pending',
      clinicalExtract: this.analyzeReflectionForTherapist(cleanText, cleanContext, cleanCategory)
    };
    list.unshift(entry);
    this.persistKey(STORAGE_KEYS.THERAPY_NOTES, list);
    this.notify('therapy_reflection_added', entry);
    return entry;
  }

  toggleTherapyReflectionStatus(id) {
    const list = this.getTherapyReflections();
    const target = list.find(r => r.id === id);
    if (!target) return null;
    target.status = target.status === 'pending' ? 'discussed' : 'pending';
    this.persistKey(STORAGE_KEYS.THERAPY_NOTES, list);
    this.notify('therapy_reflection_updated', target);
    return target;
  }

  deleteTherapyReflection(id) {
    const list = this.getTherapyReflections().filter(r => r.id !== id);
    this.persistKey(STORAGE_KEYS.THERAPY_NOTES, list);
    this.notify('therapy_reflection_updated', { id });
  }

  addChallenge(challenge) {
    const p = this.getProfile();
    const newCh = {
      id: 'ch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      label: challenge.label,
      category: challenge.category || 'General',
      status: 'exploring', // exploring | working | integrating | resolved
      createdAt: Date.now(),
      notes: []
    };
    p.challenges.unshift(newCh);
    p.progressLog.unshift({ date: Date.now(), type: 'challenge_added', note: `Nuevo reto: "${newCh.label}"` });
    this.saveProfile(p);
    return newCh;
  }

  updateChallengeStatus(challengeId, newStatus) {
    const p = this.getProfile();
    const ch = p.challenges.find(c => c.id === challengeId);
    if (ch) {
      const oldStatus = ch.status;
      ch.status = newStatus;
      const statusLabels = { exploring: 'Explorando', working: 'Trabajando', integrating: 'Integrando', resolved: 'Integrado ✓' };
      p.progressLog.unshift({ date: Date.now(), type: 'challenge_status', note: `"${ch.label}": ${statusLabels[oldStatus] || oldStatus} → ${statusLabels[newStatus] || newStatus}` });
      this.saveProfile(p);
    }
  }

  removeChallenge(challengeId) {
    const p = this.getProfile();
    p.challenges = p.challenges.filter(c => c.id !== challengeId);
    this.saveProfile(p);
  }

  setCurrentConcern(text, context) {
    const p = this.getProfile();
    if (p.currentConcern.text && p.currentConcern.text !== text) {
      p.progressLog.unshift({ date: Date.now(), type: 'concern_changed', note: `Foco anterior: "${p.currentConcern.text}"` });
    }
    p.currentConcern = { text: (text || '').trim(), context: context || '', updatedAt: Date.now() };
    this.saveProfile(p);
  }

  addProgressNote(note) {
    const p = this.getProfile();
    p.progressLog.unshift({ date: Date.now(), type: 'manual_note', note });
    this.saveProfile(p);
  }

  // Analytics & Metrics Computation
  getAnalytics() {
    const pfEntries = this.getPazFalsaEntries();
    const actEntries = this.getActCrisisEntries();
    const hexHistory = this.getHexaflexHistory();

    const totalPf = pfEntries.length;
    const totalAct = actEntries.length;

    let avgTollScore = 0;
    if (totalPf > 0) {
      const sumTolls = pfEntries.reduce((acc, curr) => {
        const toll = curr.toll || {};
        const avgItem = ((toll.resentment || 0) + (toll.physicalExhaustion || 0) + (toll.anxiety || 0) + (toll.emptiness || 0)) / 4;
        return acc + avgItem;
      }, 0);
      avgTollScore = (sumTolls / totalPf) * 10;
    }

    let valueChoiceRatio = 0;
    if (totalAct > 0) {
      const valueChoices = actEntries.filter(e => e.choiceType === 'value').length;
      valueChoiceRatio = Math.round((valueChoices / totalAct) * 100);
    }

    let avgDefusionReduction = 0;
    if (totalAct > 0) {
      const totalDrop = actEntries.reduce((acc, curr) => {
        const drop = Math.max(0, (curr.initialIntensity || 0) - (curr.postIntensity || 0));
        return acc + drop;
      }, 0);
      avgDefusionReduction = (totalDrop / totalAct).toFixed(1);
    }

    const contextMap = {};
    pfEntries.forEach(e => {
      const c = e.context || 'Otro';
      if (!contextMap[c]) {
        contextMap[c] = { count: 0, totalResentment: 0, totalToll: 0 };
      }
      contextMap[c].count++;
      const toll = e.toll || {};
      contextMap[c].totalResentment += (toll.resentment || 0);
      const avgT = ((toll.resentment || 0) + (toll.physicalExhaustion || 0) + (toll.anxiety || 0) + (toll.emptiness || 0)) / 4;
      contextMap[c].totalToll += avgT;
    });

    const emotionMap = {};
    actEntries.forEach(e => {
      const list = Array.isArray(e.emotions) && e.emotions.length > 0
        ? e.emotions
        : (e.emotion ? String(e.emotion).split(' + ').map(s => s.trim()).filter(Boolean) : ['Desconocida']);
      list.forEach(em => {
        emotionMap[em] = (emotionMap[em] || 0) + 1;
      });
    });

    const combinedTimeline = [];
    pfEntries.forEach(e => {
      const toll = e.toll || {};
      const avgToll = ((toll.resentment || 0) + (toll.physicalExhaustion || 0) + (toll.anxiety || 0) + (toll.emptiness || 0)) / 4;
      combinedTimeline.push({
        id: e.id,
        timestamp: e.timestamp,
        type: 'paz_falsa',
        label: 'Paz Falsa (' + (e.context || 'General') + ')',
        intensity: Math.round(avgToll),
        resentment: toll.resentment || 0,
        anxiety: toll.anxiety || 0
      });
    });

    actEntries.forEach(e => {
      combinedTimeline.push({
        id: e.id,
        timestamp: e.timestamp,
        type: 'act_crisis',
        label: 'Espacio ACT (' + (e.emotion || 'Crisis') + ')',
        intensity: e.initialIntensity || 5,
        postIntensity: e.postIntensity || 3,
        reduction: Math.max(0, (e.initialIntensity || 5) - (e.postIntensity || 3))
      });
    });

    combinedTimeline.sort((a, b) => a.timestamp - b.timestamp);

    const latestHexaflex = hexHistory.length > 0 ? hexHistory[0] : null;

    return {
      totalPf,
      totalAct,
      avgTollScore: Math.round(avgTollScore),
      valueChoiceRatio,
      avgDefusionReduction,
      contextMap,
      emotionMap,
      combinedTimeline,
      latestHexaflex
    };
  }

  // Backup & Restore
  exportData() {
    return JSON.stringify({
      version: 4,
      exportedAt: new Date().toISOString(),
      pazFalsa: this.getPazFalsaEntries(),
      actCrisis: this.getActCrisisEntries(),
      patterns: this.getPatterns(),
      compass: this.getCompassEntries(),
      pillFavorites: this.getPillFavorites(),
      hexaflex: this.getHexaflexHistory(),
      deconstruct: this.getDeconstructedStatements(),
      pivots: this.getPivots(),
      anchors: this.getAnchors(),
      settings: this.getSettings(),
      profile: this.getProfile(),
      therapyNotes: this.getTherapyReflections()
    }, null, 2);
  }

  importData(jsonString) {
    if (this.isVaultLocked()) return false;
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.pazFalsa)) this.persistKey(STORAGE_KEYS.PAZ_FALSA, data.pazFalsa, false);
      if (Array.isArray(data.actCrisis)) this.persistKey(STORAGE_KEYS.ACT_CRISIS, data.actCrisis, false);
      if (Array.isArray(data.patterns)) this.persistKey(STORAGE_KEYS.PATTERNS, data.patterns, false);
      if (Array.isArray(data.compass)) this.persistKey(STORAGE_KEYS.COMPASS, data.compass, false);
      if (Array.isArray(data.pillFavorites)) this.persistKey(STORAGE_KEYS.PILL_FAVORITES, data.pillFavorites, false);
      if (Array.isArray(data.hexaflex)) this.persistKey(STORAGE_KEYS.HEXAFLEX, data.hexaflex, false);
      if (Array.isArray(data.deconstruct)) this.persistKey(STORAGE_KEYS.DECONSTRUCT, data.deconstruct, false);
      if (Array.isArray(data.pivots)) this.persistKey(STORAGE_KEYS.PIVOTS, data.pivots, false);
      if (Array.isArray(data.anchors)) this.persistKey(STORAGE_KEYS.ANCHORS, data.anchors, false);
      if (data.settings && typeof data.settings === 'object') {
        this.persistKey(STORAGE_KEYS.SETTINGS, data.settings, false);
      }
      if (data.profile && typeof data.profile === 'object') {
        this.persistKey(STORAGE_KEYS.PROFILE, data.profile, false);
      }
      if (Array.isArray(data.therapyNotes)) {
        this.persistKey(STORAGE_KEYS.THERAPY_NOTES, data.therapyNotes, false);
      }
      this.pushFullStateToServer();
      this.notify('data_imported', null);
      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  }

  clearAllData() {
    if (this.isVaultLocked()) return;
    this.persistKey(STORAGE_KEYS.PAZ_FALSA, [], false);
    this.persistKey(STORAGE_KEYS.ACT_CRISIS, [], false);
    this.persistKey(STORAGE_KEYS.PATTERNS, [], false);
    this.persistKey(STORAGE_KEYS.COMPASS, [], false);
    this.persistKey(STORAGE_KEYS.PILL_FAVORITES, [], false);
    this.persistKey(STORAGE_KEYS.HEXAFLEX, [], false);
    this.persistKey(STORAGE_KEYS.DECONSTRUCT, [], false);
    this.persistKey(STORAGE_KEYS.PIVOTS, [], false);
    this.persistKey(STORAGE_KEYS.ANCHORS, DEFAULT_ANCHORS, false);
    this.persistKey(STORAGE_KEYS.PROFILE, {
      coreValues: [],
      activeBarriers: [],
      busPassengers: [],
      challenges: [],
      currentConcern: { text: '', context: '', updatedAt: null },
      progressLog: []
    }, false);
    this.persistKey(STORAGE_KEYS.THERAPY_NOTES, [], false);
    this.pushFullStateToServer();
    this.notify('data_cleared', null);
  }

  seedDemoData() {
    if (this.isVaultLocked()) return false;

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const mergeWithUserItems = (existingList, demoList) => {
      const userItems = (Array.isArray(existingList) ? existingList : []).filter(
        (item) => !this.isExampleItem(item)
      );
      return [...userItems, ...demoList];
    };

    const sampleValues = [
      {
        id: 'demo_val_1',
        isExample: true,
        domain: 'Pareja',
        statement: 'Ser una pareja comprensiva y atenta que escucha con ternura pero expresa sus límites con honestidad',
        microAction: 'Escuchar cómo se siente sin interrumpir y expresar con calma cuando necesite descanso',
        willingness: 'Sostener la incomodidad si hay un desacuerdo sin ceder automáticamente por miedo',
        lensUsed: 'Ejemplo guía (Hayes)',
        practicedCount: 3,
        lastPracticedAt: now - (1 * day),
        createdAt: now - (12 * day)
      },
      {
        id: 'demo_val_2',
        isExample: true,
        domain: 'Trabajo',
        statement: 'Trabajar con rigor y honestidad protegiendo mi descanso y comunicando prioridades con claridad',
        microAction: 'Pedir 15 minutos para revisar prioridades antes de aceptar un encargo fuera de horario',
        willingness: 'Hacer hueco a la incomodidad de no estar disponible al instante sin dar mil excusas',
        lensUsed: 'Ejemplo guía (Hayes)',
        practicedCount: 2,
        lastPracticedAt: now - (2 * day),
        createdAt: now - (10 * day)
      },
      {
        id: 'demo_val_3',
        isExample: true,
        domain: 'Conmigo Mismo',
        statement: 'Tratarme con paciencia y respeto en los días difíciles cuidando mi energía física y emocional',
        microAction: 'Hacer una pausa de 5 minutos sin pantallas para notar mi cuerpo antes de responder en automático',
        willingness: 'Sostener el cosquilleo de culpa inicial cuando paro a descansar',
        lensUsed: 'Ejemplo guía (Hayes)',
        practicedCount: 4,
        lastPracticedAt: now - (1 * day),
        createdAt: now - (8 * day)
      }
    ];

    const samplePassengers = [
      {
        id: 'demo_pas_1',
        isExample: true,
        icon: '',
        name: 'El Vigilante del Enfado Ajeno',
        shouts: 'Gira por el camino seguro y cede ahora mismo para evitar caras largas.',
        protectsFrom: 'La tensión, el conflicto o la frialdad del otro',
        detour: 'Callarme lo que pienso y sonreír para apaciguar',
        driverReply: 'Gracias por avisarme del miedo al conflicto, pero mis manos siguen en el volante hacia mis valores. Puedes ir atrás.',
        affectedValues: ['demo_val_1', 'demo_val_2'],
        status: 'loud',
        createdAt: now - (11 * day)
      },
      {
        id: 'demo_pas_2',
        isExample: true,
        icon: '',
        name: 'El Policía de la Culpa ("Eres egoísta")',
        shouts: 'Si te priorizas o dices que no, harás daño y pensarán mal de ti.',
        protectsFrom: 'Sentirme mala persona o que me rechacen',
        detour: 'Ceder y cargar con todo aunque esté agotado/a',
        driverReply: 'Sé que intentas protegerme del rechazo, pero ceder va contra mi valor. Toma asiento atrás; hoy conduzco yo.',
        affectedValues: ['demo_val_1', 'demo_val_3'],
        status: 'seated',
        createdAt: now - (9 * day)
      },
      {
        id: 'demo_pas_3',
        isExample: true,
        icon: '',
        name: 'El Juez de la Autoexigencia',
        shouts: 'Tienes que poder con todo sin quejarte ni bajar el ritmo nunca.',
        protectsFrom: 'Sentirme insuficiente, vulnerable o decepcionar en el trabajo',
        detour: 'Alargar la jornada hasta el agotamiento y decir sí a todo',
        driverReply: 'Te escucho, pero cuidar mi descanso forma parte de hacer bien mi trabajo. Ya no decides mi horario.',
        affectedValues: ['demo_val_2'],
        status: 'integrated',
        createdAt: now - (14 * day)
      }
    ];

    const sampleProgressLog = [
      {
        id: 'demo_log_1',
        isExample: true,
        date: now - (1 * day),
        type: 'values_updated',
        note: 'Paso dado en Trabajo: "Pedir 15 minutos para revisar prioridades antes de aceptar un encargo fuera de horario"'
      },
      {
        id: 'demo_log_2',
        isExample: true,
        date: now - (2 * day),
        type: 'passenger_status',
        note: '"El Policía de la Culpa ("Eres egoísta")": Sentado atrás (En trabajo)'
      },
      {
        id: 'demo_log_3',
        isExample: true,
        date: now - (3 * day),
        type: 'manual_note',
        note: 'Pude decir que no a una tarea extra sin inventar excusas; la culpa bajó a las dos horas.'
      },
      {
        id: 'demo_log_4',
        isExample: true,
        date: now - (5 * day),
        type: 'values_updated',
        note: 'Nuevo valor construido (Pareja): "Ser una pareja comprensiva y atenta que escucha con ternura pero expresa sus límites con honestidad"'
      }
    ];

    const demoAnchor = {
      id: 'demo_anc_1',
      isExample: true,
      text: 'Decir que hoy necesito descansar no rompe el vínculo; cuidarme me permite estar presente de verdad.',
      author: 'Personal',
      category: 'Límites'
    };

    const samplePf = [
      {
        id: 'demo_pf_1',
        isExample: true,
        timestamp: now - (6 * day),
        context: 'Trabajo',
        situation: 'Reunión de planificación: mi jefe asignó una tarea extra para el fin de semana sin consulta previa.',
        internalConflict: {
          wanted: 'Decir que mi fin de semana ya estaba comprometido y que podíamos renegociar las prioridades del lunes.',
          did: 'Asentí con la cabeza y dije que me encargaría sin rechistar, fingiendo que no me importaba.'
        },
        toll: {
          resentment: 8,
          physicalExhaustion: 7,
          anxiety: 6,
          emptiness: 5
        },
        note: 'Sentí una presión enorme en el pecho y rabia conmigo mismo por haber sonreído cuando por dentro gritaba que no.',
        followUpNotes: [
          {
            id: 'n1',
            timestamp: now - (2 * day),
            text: 'Re-análisis: El lunes terminé exhausto y le contesté con aspereza a un compañero. Ceder no evitó el conflicto, solo lo trasladó a personas inocentes.'
          }
        ]
      },
      {
        id: 'demo_pf_2',
        isExample: true,
        timestamp: now - (4 * day),
        context: 'Pareja',
        situation: 'Mi pareja eligió ir a cenar con sus amigos a un lugar ruidoso cuando yo necesitaba calma y descanso.',
        internalConflict: {
          wanted: 'Pedir quedarnos en casa o proponer un plan íntimo y tranquilo.',
          did: 'Fui sin decir nada y me mostré distante y callado toda la noche.'
        },
        toll: {
          resentment: 7,
          physicalExhaustion: 8,
          anxiety: 4,
          emptiness: 6
        },
        note: 'La máscara de que todo está bien agota el triple.',
        followUpNotes: []
      },
      {
        id: 'demo_pf_3',
        isExample: true,
        timestamp: now - (2 * day),
        context: 'Familia',
        situation: 'Comentario invasivo sobre mis horarios personales durante una llamada familiar.',
        internalConflict: {
          wanted: 'Poner un límite sereno: "Agradezco tu interés, pero ese aspecto de mi vida lo gestiono yo".',
          did: 'Cambié de tema apresuradamente y me sentí pequeño e infantilizado.'
        },
        toll: {
          resentment: 6,
          physicalExhaustion: 5,
          anxiety: 7,
          emptiness: 4
        },
        note: 'Sigo intentando complacer la imagen que tienen de mí.',
        followUpNotes: []
      },
      {
        id: 'demo_pf_4',
        isExample: true,
        timestamp: now - (1 * day),
        context: 'Trabajo',
        situation: 'Acepté quedarme a una reunión de última hora fuera de mi jornada aunque ya había terminado mis tareas.',
        internalConflict: {
          wanted: 'Avisar de que cerraba mi jornada y proponer revisarlo mañana a primera hora.',
          did: 'Me conecté en silencio sintiendo enfado y cansancio.'
        },
        toll: {
          resentment: 7,
          physicalExhaustion: 8,
          anxiety: 5,
          emptiness: 6
        },
        note: 'Volví a priorizar evitar incomodidad ajena frente a mi descanso.',
        followUpNotes: []
      }
    ];

    const sampleAct = [
      {
        id: 'demo_act_1',
        isExample: true,
        timestamp: now - (5 * day),
        emotion: 'Resentimiento',
        emotions: ['Resentimiento', 'Impotencia'],
        initialIntensity: 9,
        bodyZones: ['Mandíbula/Garganta', 'Pecho/Corazón', 'Hombros/Cuello'],
        thought: 'Nadie valora lo que hago, siempre tengo que resolverlo todo yo y se aprovechan de mi disposición.',
        reframedThought: 'Observo con curiosidad que George (mi mente) me está contando la historia de que nadie valora lo que hago y que tengo que resolverlo todo yo.',
        postIntensity: 4,
        autopilotUrge: 'Enviar un mensaje incendiario al grupo de chat y desconectar el teléfono.',
        valueChosen: 'Dignidad',
        committedAction: 'Escribir un correo formal estableciendo los límites del entregable sin caer en la queja reactiva.',
        carriedPassenger: 'El Vigilante del Enfado Ajeno',
        choiceType: 'value',
        followUpNotes: [
          {
            id: 'n2',
            timestamp: now - (3 * day),
            text: 'El correo funcionó. Respetaron el límite sin drama y me ahorré dos días de culpa y arrepentimiento.'
          }
        ]
      },
      {
        id: 'demo_act_2',
        isExample: true,
        timestamp: now - (3 * day),
        emotion: 'Ansiedad',
        emotions: ['Ansiedad', 'Inseguridad'],
        initialIntensity: 8,
        bodyZones: ['Estómago/Plexo', 'Mandíbula/Garganta'],
        thought: 'Si digo lo que realmente pienso me van a rechazar y me quedaré solo.',
        reframedThought: 'Estoy teniendo el pensamiento de que si soy honesto seré rechazado.',
        postIntensity: 5,
        autopilotUrge: 'Ceder de nuevo y disculparme preventivamente.',
        valueChosen: 'Autenticidad',
        committedAction: 'Pausar 10 minutos, respirar en el plexo y expresar mi postura con suavidad pero con firmeza.',
        carriedPassenger: 'El Policía de la Culpa ("Eres egoísta")',
        choiceType: 'value',
        followUpNotes: []
      },
      {
        id: 'demo_act_3',
        isExample: true,
        timestamp: now - (1 * day),
        emotion: 'Culpa',
        emotions: ['Culpa', 'Agotamiento'],
        initialIntensity: 7,
        bodyZones: ['Pecho/Corazón', 'Estómago/Plexo'],
        thought: 'Si cancelo esta cena pensarán que no me importan y que solo miro por mí.',
        reframedThought: 'Observo que mi mente me cuenta la historia de que cuidarme me convierte en egoísta.',
        postIntensity: 5,
        autopilotUrge: 'Confirmar asistencia aunque esté sin fuerzas para evitar sentirme culpable.',
        valueChosen: 'Autocuidado',
        committedAction: 'Terminé yendo por inercia, pero identifiqué el bucle al llegar a casa y anoté qué haré distinto.',
        carriedPassenger: 'El Policía de la Culpa ("Eres egoísta")',
        choiceType: 'autopilot',
        followUpNotes: []
      }
    ];

    const samplePatterns = [
      {
        id: 'demo_pat_1',
        isExample: true,
        createdAt: now - (14 * day),
        title: 'Ceder en planes de ocio por miedo al enfado o la frialdad ajena',
        category: 'Pareja',
        loop: {
          trigger: 'Se propone un plan que no deseo o que choca con mi necesidad de descanso.',
          autoResponse: 'Cedo inmediatamente fingiendo entusiasmo o indiferencia.',
          shortTermGain: 'Falsa paz inmediata: evito una mala cara, una discusión o que el otro se moleste.',
          longTermCost: 'Agotamiento acumulado, resentimiento sordo hacia el otro y desconexión de mi dignidad.'
        },
        weeklyExperiment: {
          text: 'Esta semana, ante una propuesta imprevista, pediré 15 minutos para consultar mi agenda y sentir si me apetece, sin decir "sí" de inmediato.',
          definedAt: now - (6 * day),
          targetDate: now + (1 * day)
        },
        checkins: [
          {
            id: 'chk_1',
            timestamp: now - (2 * day),
            status: 'completed',
            learned: 'Pausé antes de responder. La otra persona no se molestó en absoluto; fue mi mente la que anticipó el juicio catastrófico.',
            nextStep: 'Proponer una alternativa proactiva la próxima vez.'
          }
        ]
      },
      {
        id: 'demo_pat_2',
        isExample: true,
        createdAt: now - (9 * day),
        title: 'Asumir encargos urgentes fuera de horario por miedo a decepcionar',
        category: 'Trabajo',
        loop: {
          trigger: 'Llega una petición urgente al final del día o fuera de mi alcance.',
          autoResponse: 'Acepto al instante y alargo la jornada para cumplir sin negociar.',
          shortTermGain: 'Evito parecer poco comprometido y calmo la alarma de rechazo.',
          longTermCost: 'Fatiga acumulada, pérdida de vida personal y resentimiento hacia el trabajo.'
        },
        weeklyExperiment: {
          text: 'Responder: «Puedo revisarlo mañana a primera hora o repriorizar lo que ya tengo en marcha».',
          definedAt: now - (5 * day),
          targetDate: now + (2 * day)
        },
        checkins: [
          {
            id: 'chk_2',
            timestamp: now - (1 * day),
            status: 'in_progress',
            learned: 'Me costó sostener el silencio tras decir que lo vería al día siguiente, pero nadie se molestó.',
            nextStep: 'Mantener el límite sin añadir explicaciones extra.'
          }
        ]
      }
    ];

    const sampleCompass = [
      {
        id: 'demo_comp_1',
        isExample: true,
        timestamp: now - (3 * day),
        situation: 'Dudar sobre si cancelar una comida familiar para poder descansar tras una semana agotadora.',
        selectedValue: 'Autocuidado',
        answers: {
          motive: 'Culpa y miedo a que me juzguen como egoísta.',
          shortVsLong: 'A corto plazo evito la llamada incómoda; a largo plazo llego al lunes enfermo.',
          fear: 'Que piensen que no me importan.'
        },
        keyAction: 'Llamar a las 11:00 am, comunicar con cariño que necesito reposar y acordar vernos el siguiente fin de semana.'
      },
      {
        id: 'demo_comp_2',
        isExample: true,
        timestamp: now - (1 * day),
        situation: 'Me piden opinar sobre una propuesta del equipo con la que no estoy de acuerdo y temo generar tensión.',
        selectedValue: 'Honestidad',
        answers: {
          motive: 'Miedo al conflicto y a parecer incómodo.',
          shortVsLong: 'Si callo evito tensión hoy, pero luego cargaré con un plan inviable.',
          fear: 'Que se molesten conmigo o me vean conflictivo.'
        },
        keyAction: 'Compartir mi punto de vista con tono sereno en dos frases concretas, sin disculparme por discrepar.'
      }
    ];

    const sampleHexaflex = [
      {
        id: 'demo_hex_1',
        isExample: true,
        timestamp: now - (1 * day),
        scores: {
          acceptance: 6,
          defusion: 5,
          present: 7,
          context: 6,
          values: 8,
          action: 7
        }
      },
      {
        id: 'demo_hex_2',
        isExample: true,
        timestamp: now - (10 * day),
        scores: {
          acceptance: 4,
          defusion: 4,
          present: 5,
          context: 5,
          values: 6,
          action: 5
        }
      }
    ];

    const sampleDeconstructed = [
      {
        id: 'dec_1',
        isExample: true,
        timestamp: now - (2 * day),
        rigidLabel: 'Soy una persona débil que no sabe poner límites',
        softened: 'Tengo el pensamiento automático de que soy débil',
        contextualized: 'Cuando mi pareja se muestra decepcionada y yo bajo la mirada y pido disculpas, experimento una profunda sensación de vulnerabilidad.'
      },
      {
        id: 'demo_dec_2',
        isExample: true,
        timestamp: now - (4 * day),
        rigidLabel: 'Soy egoísta si miro por mí',
        softened: 'Aparece el pensamiento de que soy egoísta cuando cuido mi descanso',
        contextualized: 'Cuando priorizo descansar frente a un plan ajeno, noto culpa física en el estómago aunque mi límite sea sano.'
      }
    ];

    const samplePivots = [
      {
        id: 'piv_1',
        isExample: true,
        timestamp: now - (3 * day),
        pain: 'Pánico a que mi pareja se distancie si digo que hoy no quiero salir.',
        yearning: 'Anhelo intimidad, comprensión recíproca y un espacio seguro para ser yo mismo.',
        pivotAction: 'Expresar mi necesidad de descanso desde el afecto: "Te quiero y deseo verte mañana descansado; hoy mi cuerpo necesita calma".'
      },
      {
        id: 'demo_piv_2',
        isExample: true,
        timestamp: now - (5 * day),
        pain: 'Me da culpa parar y decir que hoy no llego a todo en el trabajo.',
        yearning: 'Anhelo tratarme con respeto y tener energía real para lo que de verdad importa.',
        pivotAction: 'Cerrar a tiempo hoy sin pedir perdón en exceso, sosteniendo el cosquilleo de culpa.'
      }
    ];

    const ref1Text = 'Me doy cuenta de que cuando alguien cercano se queda en silencio o cambia el tono, entro automáticamente en alerta y busco explicarme demasiado para recuperar su aprobación, aunque eso me deje agotamiento después.';
    const ref2Text = 'Esta semana pude decir que no a una tarea extra en el trabajo sin inventar excusas médicas; sentí un nudo fuerte en el estómago y culpa las dos primeras horas, pero luego sentí alivio y coherencia.';
    const sampleTherapyReflections = [
      {
        id: 'demo_ref_1',
        isExample: true,
        timestamp: now - (2 * day),
        text: ref1Text,
        context: 'Pareja',
        category: 'Patrón o bucle que me cuesta',
        status: 'pending',
        clinicalExtract: this.analyzeReflectionForTherapist(ref1Text, 'Pareja', 'Patrón o bucle que me cuesta', 'es')
      },
      {
        id: 'demo_ref_2',
        isExample: true,
        timestamp: now - (4 * day),
        text: ref2Text,
        context: 'Trabajo',
        category: 'Logro o cambio observado',
        status: 'discussed',
        clinicalExtract: this.analyzeReflectionForTherapist(ref2Text, 'Trabajo', 'Logro o cambio observado', 'es')
      }
    ];

    const existingProfile = this.getProfile();
    const mergedProfile = {
      ...existingProfile,
      coreValues: mergeWithUserItems(existingProfile.coreValues, sampleValues),
      busPassengers: mergeWithUserItems(existingProfile.busPassengers, samplePassengers),
      progressLog: mergeWithUserItems(existingProfile.progressLog, sampleProgressLog)
    };

    const defaultAnchorIds = new Set(DEFAULT_ANCHORS.map(a => a.id));
    const nonExampleAnchors = this.getAnchors().filter(a => !this.isExampleItem(a));
    const customUserAnchors = nonExampleAnchors.filter(a => !defaultAnchorIds.has(a.id));
    const existingDefaultAnchors = nonExampleAnchors.filter(a => defaultAnchorIds.has(a.id));
    const baseDefaultAnchors = existingDefaultAnchors.length > 0
      ? existingDefaultAnchors
      : JSON.parse(JSON.stringify(DEFAULT_ANCHORS));
    const mergedAnchors = [...customUserAnchors, demoAnchor, ...baseDefaultAnchors];

    const mergedFavorites = Array.from(
      new Set([...this.getPillFavorites(), 'pill_1', 'pill_2', 'a1', 'demo_anc_1'])
    );

    this.persistKey(STORAGE_KEYS.PROFILE, mergedProfile, false);
    this.persistKey(STORAGE_KEYS.ANCHORS, mergedAnchors, false);
    this.persistKey(STORAGE_KEYS.PAZ_FALSA, mergeWithUserItems(this.getPazFalsaEntries(), samplePf), false);
    this.persistKey(STORAGE_KEYS.ACT_CRISIS, mergeWithUserItems(this.getActCrisisEntries(), sampleAct), false);
    this.persistKey(STORAGE_KEYS.PATTERNS, mergeWithUserItems(this.getPatterns(), samplePatterns), false);
    this.persistKey(STORAGE_KEYS.COMPASS, mergeWithUserItems(this.getCompassEntries(), sampleCompass), false);
    this.persistKey(STORAGE_KEYS.PILL_FAVORITES, mergedFavorites, false);
    this.persistKey(STORAGE_KEYS.HEXAFLEX, mergeWithUserItems(this.getHexaflexHistory(), sampleHexaflex), false);
    this.persistKey(STORAGE_KEYS.DECONSTRUCT, mergeWithUserItems(this.getDeconstructedStatements(), sampleDeconstructed), false);
    this.persistKey(STORAGE_KEYS.PIVOTS, mergeWithUserItems(this.getPivots(), samplePivots), false);
    this.persistKey(STORAGE_KEYS.THERAPY_NOTES, mergeWithUserItems(this.getTherapyReflections(), sampleTherapyReflections), false);

    this.pushFullStateToServer();
    if (typeof window !== 'undefined' && window.i18n?.isEn?.()) {
      window.i18n.localizeExampleDataInState?.();
    }
    this.notify('demo_seeded', null);
    return true;
  }
}

// Global instance
Object.assign(StateManager.prototype, window.KhoraStateVaultMixin(STORAGE_KEYS, DATA_STORAGE_KEYS));
window.stateManager = new StateManager();

