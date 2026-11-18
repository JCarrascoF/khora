# Security Policy

Khora handles **sensitive personal data** (mental-health notes, values,
patterns, therapy notes). We take security and privacy seriously.

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 3.x     | ✅ Bug fixes within 30 days for critical security issues |
| < 3.0   | ❌ Unsupported      |

## Reporting a vulnerability

**Do not open a public issue or PR for security vulnerabilities.**
Public disclosure before a fix is available may expose users.

Please report security issues privately:

- **Email:** `jorgecfnb@gmail.com` (PGP key available on request)
- Include: a description of the issue, steps to reproduce, and the
  version(s) affected.

We aim to acknowledge receipt within **48 hours** and provide a timeline
for a fix within **7 days**. Critical issues (e.g. data exfiltration,
authentication bypass) will be prioritized.

## Scope

The following are **in scope**:

- The PWA (client-side code in `index.html`, `js/`, `sw.js`, `manifest.json`)
- The optional Node server (`server.js`)
- The Docker image and `docker-compose.yml`

The following are **out of scope**:

- Third-party services we do not control (e.g. GitHub Pages, browsers)
- User-configured reverse proxies or hosting environments

## Security model

### Local-first by design

By default Khora does **not** send any data over the network:

- All user data is stored in the browser (IndexedDB + localStorage).
- The Service Worker (`sw.js`) only fetches from the same origin.
- No analytics, no telemetry, no third-party scripts.

### Encryption at rest (client)

When the user enables the privacy lock (Settings → Privacy & Encryption):

- The PIN / password is used to derive an AES-256 key via
  [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
  (PBKDF2 or equivalent KDF).
- All persisted records are encrypted before being written to
  IndexedDB / localStorage.
- Biometric unlock (FaceID / fingerprint) uses the Web
  [Credential Management API](https://www.w3.org/TR/cred-man/) where
  available; the biometric key never leaves the device.

> **Note:** the PIN itself and the encryption metadata are stored in
> `localStorage` (not encrypted). This is a deliberate trade-off: the
> encryption protects the *contents* of the data at rest, not the
> existence of the vault. See the README for the full privacy model.

### Optional SQLite backend (self-hosted)

When `ENABLE_SQLITE_DB=true`, the Node server in `server.js` stores data
in a local SQLite database. In this mode:

- All traffic should be over **HTTPS** (use a reverse proxy like Caddy
  or nginx with a TLS certificate).
- If `AUTH_PASSWORD` is set, every `/api/*` request requires a
  signed session cookie (HMAC-SHA256, 30-day TTL).
- The server binds to `0.0.0.0` by default for containerized use;
  restrict it in production.
- **The backend is single-tenant.** Do not expose it to multiple users.

## Data deletion

Users can delete all their data:

- **Client:** Settings → Backup → Export, then clear site data in the
  browser (or uninstall the PWA).
- **Server (SQLite):** delete the `data/act.db` file (or stop the
  container and remove the volume).

## Dependencies

Khora has **zero runtime npm dependencies** (see `package.json`). The
attack surface is therefore limited to:

- The Node.js standard library (`node:http`, `node:sqlite`, `node:crypto`)
- Browser Web APIs (Web Crypto, IndexedDB, Service Workers, Credential
  Management)

If you add a dependency, please update this file and the
[CONTRIBUTING guide](./CONTRIBUTING.md).
