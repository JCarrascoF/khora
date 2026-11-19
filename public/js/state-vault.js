/**
 * AES-256-GCM Vault, PBKDF2 Key Derivation & WebAuthn Biometric Mixin for StateManager.
 * Loaded immediately before public/js/state.js.
 */
(function (global) {
  global.KhoraStateVaultMixin = function (STORAGE_KEYS, DATA_STORAGE_KEYS) {
    return {
  // -------------------------------------------------------------
  // CRYPTO ENGINE (AES-256-GCM + PBKDF2) & BIOMETRIC (WEBAUTHN)
  // -------------------------------------------------------------
  isCryptoSupported() {
    return Boolean(typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle);
  },

  isBiometricSupported() {
    return Boolean(
      this.isCryptoSupported() &&
      typeof window !== 'undefined' &&
      window.PublicKeyCredential &&
      typeof navigator !== 'undefined' &&
      navigator.credentials
    );
  },

  getVaultMeta() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULT_META)) || null;
    } catch {
      return null;
    }
  },

  isVaultEnabled() {
    const meta = this.getVaultMeta();
    return Boolean(meta && meta.enabled === true && meta.verifier);
  },

  isVaultLocked() {
    return Boolean(this.isVaultEnabled() && (this.vaultLocked || !this.cryptoKey));
  },

  hasBiometricEnabled() {
    if (!this.isVaultEnabled()) return false;
    try {
      const bio = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIOMETRIC_LOCAL) || 'null');
      return Boolean(bio && bio.credId && bio.wrappedKey && bio.wrapIv && bio.deviceKey);
    } catch {
      return false;
    }
  },

  getVaultStatus() {
    const meta = this.getVaultMeta();
    return {
      enabled: this.isVaultEnabled(),
      locked: this.isVaultLocked(),
      autoLockMinutes: meta?.autoLockMinutes ?? 5,
      cryptoSupported: this.isCryptoSupported(),
      biometricSupported: this.isBiometricSupported(),
      biometricEnabled: this.hasBiometricEnabled(),
      storagePersisted: this.storagePersisted
    };
  },

  bytesToBase64(bytes) {
    const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(arr).toString('base64');
    }
    let bin = '';
    for (let i = 0; i < arr.length; i += 1) {
      bin += String.fromCharCode(arr[i]);
    }
    return btoa(bin);
  },

  base64ToBytes(b64) {
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(b64, 'base64'));
    }
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  },

  isEncryptedEnvelope(val) {
    return Boolean(val && typeof val === 'object' && !Array.isArray(val) && val.__ethos_enc === 'v1' && val.iv && val.ct);
  },

  async deriveAesKey(passphrase, saltB64, iterations = 100000) {
    const enc = new TextEncoder();
    const baseKey = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(String(passphrase || '')),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return globalThis.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.base64ToBytes(saltB64),
        iterations,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  },

  async encryptValue(value, cryptoKey = this.cryptoKey) {
    if (!cryptoKey) throw new Error('NO_CRYPTO_KEY');
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const cipherBuf = await globalThis.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      enc.encode(JSON.stringify(value))
    );
    return {
      id: 'vault_enc',
      __ethos_enc: 'v1',
      alg: 'AES-256-GCM',
      iv: this.bytesToBase64(iv),
      ct: this.bytesToBase64(new Uint8Array(cipherBuf))
    };
  },

  async decryptValue(rawOrEnvelope, cryptoKey = this.cryptoKey) {
    let target = rawOrEnvelope;
    if (Array.isArray(rawOrEnvelope) && rawOrEnvelope.length === 1 && this.isEncryptedEnvelope(rawOrEnvelope[0])) {
      target = rawOrEnvelope[0];
    }
    if (!this.isEncryptedEnvelope(target)) {
      return rawOrEnvelope;
    }
    if (!cryptoKey) throw new Error('VAULT_LOCKED');
    const plainBuf = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: this.base64ToBytes(target.iv) },
      cryptoKey,
      this.base64ToBytes(target.ct)
    );
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(plainBuf));
  },


  async enableVault(passphrase, autoLockMinutes = 5) {
    if (!this.isCryptoSupported()) {
      return { ok: false, error: this.tr('Tu navegador requiere HTTPS o localhost para cifrar con AES-256.') };
    }
    const cleanPass = String(passphrase || '');
    if (cleanPass.length < 4) {
      return { ok: false, error: this.tr('Usa un PIN o contraseña de al menos 4 caracteres.') };
    }

    try {
      this.ensureDefaultSeedsInMemory();
      const salt = this.bytesToBase64(globalThis.crypto.getRandomValues(new Uint8Array(16)));
      const iterations = 100000;
      const key = await this.deriveAesKey(cleanPass, salt, iterations);
      const verifier = await this.encryptValue('ETHOS_VAULT_OK', key);

      const meta = {
        enabled: true,
        alg: 'PBKDF2-SHA256+AES-256-GCM',
        salt,
        iterations,
        verifier,
        autoLockMinutes: Number.isFinite(Number(autoLockMinutes)) ? Number(autoLockMinutes) : 5,
        updatedAt: Date.now()
      };

      const metaStr = JSON.stringify(meta);
      localStorage.setItem(STORAGE_KEYS.VAULT_META, metaStr);
      this.idbPut(STORAGE_KEYS.VAULT_META, metaStr);

      this.cryptoKey = key;
      this.vaultLocked = false;

      await this.encryptAllCurrentData();
      this.notify('vault_status_changed', this.getVaultStatus());
      this.notify('vault_unlocked', this.getVaultStatus());
      return { ok: true };
    } catch (err) {
      console.error('enableVault failed', err);
      return { ok: false, error: this.tr('No se pudo activar el cifrado en este navegador.') };
    }
  },

  async encryptAllCurrentData() {
    if (!this.cryptoKey || this.vaultLocked) return false;
    for (const key of DATA_STORAGE_KEYS) {
      let plainVal = this.memStore.has(key) ? this.memStore.get(key) : null;
      if (plainVal === null || plainVal === undefined) {
        try {
          const rawStr = localStorage.getItem(key);
          if (rawStr) {
            const parsed = JSON.parse(rawStr);
            plainVal = await this.decryptValue(parsed, this.cryptoKey);
          } else {
            plainVal = this.getDefaultValueForKey(key);
          }
        } catch {
          plainVal = this.getDefaultValueForKey(key);
        }
        this.memStore.set(key, JSON.parse(JSON.stringify(plainVal)));
      }
      const env = await this.encryptValue(plainVal, this.cryptoKey);
      const envStr = JSON.stringify(env);
      localStorage.setItem(key, envStr);
      this.idbPut(key, envStr);
    }

    if (this.getStorageMode() === 'db') {
      await this.pushFullStateToServer();
    }
    return true;
  },

  async unlockVaultWithKey(key) {
    const meta = this.getVaultMeta();
    if (!meta || !meta.enabled || !meta.verifier) {
      return { ok: false, error: this.tr('No hay bóveda configurada.') };
    }
    try {
      const check = await this.decryptValue(meta.verifier, key);
      if (check !== 'ETHOS_VAULT_OK') {
        return { ok: false, error: this.tr('PIN o contraseña incorrectos.') };
      }

      this.cryptoKey = key;
      this.vaultLocked = false;

      let needsReencrypt = false;
      for (const storageKey of DATA_STORAGE_KEYS) {
        const rawStr = localStorage.getItem(storageKey);
        if (!rawStr) {
          this.memStore.set(storageKey, this.getDefaultValueForKey(storageKey));
          needsReencrypt = true;
          continue;
        }
        const parsed = JSON.parse(rawStr);
        if (this.isEncryptedEnvelope(parsed) || (Array.isArray(parsed) && parsed.length === 1 && this.isEncryptedEnvelope(parsed[0]))) {
          const decrypted = await this.decryptValue(parsed, key);
          this.memStore.set(storageKey, decrypted);
        } else {
          this.memStore.set(storageKey, parsed);
          needsReencrypt = true;
        }
      }

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
      if (settings.surface) {
        try {
          localStorage.setItem(STORAGE_KEYS.SURFACE_PREF, settings.surface);
        } catch {
          // Ignore
        }
      }
      if (settings.customPalette) {
        try {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_PALETTE_PREF, JSON.stringify(settings.customPalette));
        } catch {
          // Ignore
        }
      }

      if (needsReencrypt) {
        await this.encryptAllCurrentData();
      }

      this.notify('vault_unlocked', this.getVaultStatus());
      this.notify('vault_status_changed', this.getVaultStatus());
      if (this.getStorageMode() === 'db') {
        this.initServerSync();
      }
      return { ok: true };
    } catch {
      this.cryptoKey = null;
      this.vaultLocked = true;
      return { ok: false, error: this.tr('PIN o contraseña incorrectos.') };
    }
  },

  async unlockVault(passphrase) {
    if (!this.isCryptoSupported()) {
      return { ok: false, error: this.tr('Web Crypto no disponible en este contexto.') };
    }
    const meta = this.getVaultMeta();
    if (!meta || !meta.salt) {
      return { ok: false, error: this.tr('No hay bóveda configurada.') };
    }
    try {
      const key = await this.deriveAesKey(String(passphrase || ''), meta.salt, meta.iterations || 100000);
      return await this.unlockVaultWithKey(key);
    } catch {
      return { ok: false, error: this.tr('PIN o contraseña incorrectos.') };
    }
  },

  lockVault() {
    if (!this.isVaultEnabled()) return false;
    this.cryptoKey = null;
    this.vaultLocked = true;
    this.memStore.clear();
    this.notify('vault_locked', this.getVaultStatus());
    this.notify('vault_status_changed', this.getVaultStatus());
    return true;
  },

  updateVaultAutoLock(minutes) {
    const meta = this.getVaultMeta();
    if (!meta || !meta.enabled) return false;
    meta.autoLockMinutes = Number(minutes);
    meta.updatedAt = Date.now();
    const metaStr = JSON.stringify(meta);
    localStorage.setItem(STORAGE_KEYS.VAULT_META, metaStr);
    this.idbPut(STORAGE_KEYS.VAULT_META, metaStr);
    if (this.getStorageMode() === 'db' && !this.isVaultLocked()) {
      this.persistKey(STORAGE_KEYS.VAULT_META, meta);
    }
    this.notify('vault_status_changed', this.getVaultStatus());
    return true;
  },

  async disableVault(passphrase) {
    const verify = await this.unlockVault(passphrase);
    if (!verify.ok) return verify;

    const snapshot = this.collectAllState();
    const disabledMeta = { enabled: false, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEYS.VAULT_META, JSON.stringify(disabledMeta));
    this.idbPut(STORAGE_KEYS.VAULT_META, JSON.stringify(disabledMeta));
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_LOCAL);

    this.cryptoKey = null;
    this.vaultLocked = false;

    Object.entries(SERVER_KEY_MAP).forEach(([storageKey, serverKey]) => {
      if (storageKey === STORAGE_KEYS.VAULT_META) return;
      const val = snapshot[serverKey] !== undefined ? snapshot[serverKey] : this.getDefaultValueForKey(storageKey);
      this.memStore.set(storageKey, JSON.parse(JSON.stringify(val)));
      const serialized = JSON.stringify(val);
      localStorage.setItem(storageKey, serialized);
      this.idbPut(storageKey, serialized);
    });

    if (this.getStorageMode() === 'db') {
      await this.pushFullStateToServer();
    }

    this.notify('vault_status_changed', this.getVaultStatus());
    this.notify('vault_unlocked', this.getVaultStatus());
    return { ok: true };
  },

  async registerBiometric() {
    if (!this.isBiometricSupported()) {
      return { ok: false, error: this.tr('Tu navegador o dispositivo no soporta FaceID / Huella (WebAuthn).') };
    }
    if (!this.cryptoKey || this.vaultLocked) {
      return { ok: false, error: this.tr('Desbloquea primero la bóveda con tu PIN/contraseña.') };
    }
    try {
      const challenge = globalThis.crypto.getRandomValues(new Uint8Array(32));
      const userId = globalThis.crypto.getRandomValues(new Uint8Array(16));
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: (typeof window !=='undefined' && window.i18n?.isEn?.()) ?'Khōra — Your ACT space' :'Khōra — Tu espacio ACT' },
          user: { id: userId, name: 'khora-local', displayName: 'Khora' },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      });
      if (!credential || !credential.rawId) {
        return { ok: false, error: this.tr('Registro biométrico cancelado.') };
      }

      const rawVaultKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', this.cryptoKey));
      const deviceKeyRaw = globalThis.crypto.getRandomValues(new Uint8Array(32));
      const wrapKey = await globalThis.crypto.subtle.importKey(
        'raw',
        deviceKeyRaw,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
      const wrapIv = globalThis.crypto.getRandomValues(new Uint8Array(12));
      const wrappedBuf = await globalThis.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: wrapIv },
        wrapKey,
        rawVaultKey
      );

      const bioRecord = {
        credId: this.bytesToBase64(new Uint8Array(credential.rawId)),
        deviceKey: this.bytesToBase64(deviceKeyRaw),
        wrapIv: this.bytesToBase64(wrapIv),
        wrappedKey: this.bytesToBase64(new Uint8Array(wrappedBuf)),
        createdAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.BIOMETRIC_LOCAL, JSON.stringify(bioRecord));
      this.notify('vault_status_changed', this.getVaultStatus());
      return { ok: true };
    } catch (err) {
      console.error('registerBiometric failed', err);
      return { ok: false, error: this.tr('No se pudo registrar FaceID / Huella en este dispositivo.') };
    }
  },

  removeBiometric() {
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_LOCAL);
    this.notify('vault_status_changed', this.getVaultStatus());
  },

  async unlockWithBiometric() {
    if (!this.hasBiometricEnabled() || !this.isBiometricSupported()) {
      return { ok: false, error: this.tr('Desbloqueo biométrico no disponible en este dispositivo.') };
    }
    try {
      const bio = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIOMETRIC_LOCAL));
      const challenge = globalThis.crypto.getRandomValues(new Uint8Array(32));
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{ id: this.base64ToBytes(bio.credId), type: 'public-key' }],
          userVerification: 'required',
          timeout: 60000
        }
      });
      if (!assertion) {
        return { ok: false, error: this.tr('Verificación biométrica cancelada.') };
      }

      const wrapKey = await globalThis.crypto.subtle.importKey(
        'raw',
        this.base64ToBytes(bio.deviceKey),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      const rawVaultKey = await globalThis.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: this.base64ToBytes(bio.wrapIv) },
        wrapKey,
        this.base64ToBytes(bio.wrappedKey)
      );
      const restoredKey = await globalThis.crypto.subtle.importKey(
        'raw',
        rawVaultKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      return await this.unlockVaultWithKey(restoredKey);
    } catch (err) {
      console.error('unlockWithBiometric failed', err);
      return { ok: false, error: this.tr('No se pudo verificar FaceID / Huella.') };
    }
  }
    };
  };
})(window);
