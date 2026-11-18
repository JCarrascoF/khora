🇪🇸 [Español](./README.dev.md) | 🇬🇧 **English**

# Khora (`khora`) — Technical Documentation

Developer guide covering architecture, **i18n (`ES`/`EN`)**, self-hosting (Docker / Node / static hosting), **GitHub Pages** / **Cloudflare Pages** deployment, encryption, and optional SQLite persistence.

> Looking for the end-user guide? See [README.en.md](README.en.md) ([Español](README.md)).

---

## Architecture & Stack

- **Frontend:** Zero-build modular Vanilla HTML/CSS/JS (`index.html`, `css/styles.css`, `js/i18n.js`, `js/state.js`, `js/app.js`, `js/subapp-*.js`), installable as a **PWA** with a Service Worker (`sw.js`: atomic precache, *network-first* for HTML, *cache-first* for versioned assets, and *stale-while-revalidate* for unversioned static assets).
- **Internationalization (`js/i18n.js`):** Bilingual `ES` / `EN` engine (`window.i18n` / `window.t`) with automatic browser locale detection, `localStorage` persistence (`act_lang_pref`), bidirectional domain catalog synchronization (preserving internal `id` keys so stored logs and filters never break when switching languages), reversible DOM/SVG/attribute + Canvas text localization, and safe seed/demo translation without overwriting user edits.
- **Local-First Persistence:**
  - `localStorage` + automatic mirror in **`IndexedDB`** (`ethos_act_idb`) plus persistent storage request (`navigator.storage.persist()`).
- **Client-Side Encryption & Privacy:**
  - `Web Crypto API`: key derivation via **`PBKDF2`** (SHA-256, 100,000 iterations) and authenticated **`AES-256-GCM`** encryption per storage key before writing to `localStorage`, `IndexedDB`, or SQLite.
  - Optional per-device biometric unlock via **`WebAuthn`** (*Platform Authenticator*: FaceID / TouchID / Fingerprint).
- **Optional Backend (`server/server.js`):** Pure Node.js `>= 22.5.0` (zero external npm dependencies), using `node:http`, `node:crypto`, and `node:sqlite`.

---

## Customizing Credits & Ko-fi

At the top of [`public/js/app.js`](../public/js/app.js) you will find `KHORA_CREDITS`:

```javascript
const KHORA_CREDITS = {
  githubUser: (typeof window !== 'undefined' && window.location?.hostname?.endsWith('.github.io'))
    ? window.location.hostname.split('.')[0]
    : 'jcarrascof',
  repoName: 'khora',
  kofiUrl: 'https://ko-fi.com/jcarrascof'
};
```

- When hosted on `*.github.io`, `githubUser` is automatically inferred from the subdomain.
- If you fork the repository and deploy to Cloudflare Pages or a custom domain, replace `'jcarrascof'` and `kofiUrl` with your own details (plus the footers in `README.md` / `README.en.md`).

---

## Free Static PWA Hosting (Recommended)

### Option A: GitHub Pages (Automated)

This repository includes [`.github/workflows/pages.yml`](../.github/workflows/pages.yml), which packages and publishes **only** the static client files in `public/` (`index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `icons/`).

1. Push the project to a GitHub repository named `khora` (`.gitignore` already excludes `data/`, `*.db`, `*.sqlite*`, and `.env`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Every push to `main` deploys the HTTPS PWA at `https://<your-user>.github.io/khora/`.

### Option B: Cloudflare Pages

1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages**.
2. Connect your GitHub repository (`Build command`: empty, `Build output directory`: `/public/`) **or** use **Upload assets** uploading only the `public/` folder.

> **Static-only behavior:** When `/api/health` is absent, Khora automatically enables **Local Browser Mode**, hides SQLite controls inside `⚙️ Settings`, and activates the **PWA install detector + persistence warning** on mobile browsers not yet launched from the Home Screen.

---

## Local Run & Docker

### 1. Docker Compose (Local Browser Mode by Default)

By default [`docker-compose.yml`](docker-compose.yml) sets `ENABLE_SQLITE_DB="false"`: the container only serves the static PWA assets so every visitor stores their data locally on their own device rather than sharing one database.

```bash
cp .env.example .env
docker compose up -d --build
```

Available at `http://localhost:8084`.

#### Enabling Server-Side SQLite Persistence *(optional, single-user personal hosting)*

To store data in `./data/act.db` on your own server:

1. In `.env`, configure:
   ```env
   ENABLE_SQLITE_DB=true
   # Recommended if exposed beyond localhost:
   AUTH_USER=admin
   AUTH_PASSWORD=a-strong-password
   AUTH_SECRET=a-long-random-string
   ```
2. In [`docker-compose.yml`](docker-compose.yml), uncomment the volume mount:
   ```yaml
   - ./data:/app/data
   ```
3. Rebuild and restart the container:
   ```bash
   docker compose up -d --build
   ```

When `AUTH_PASSWORD` is set, `server/server.js` protects `/api/state`, `/api/state/*`, and `/api/backup/db` with `401 Unauthorized` and an `HttpOnly` cookie (`khora_act_session`, signed via HMAC-SHA256). If you also enable **AES-256-GCM** encryption inside Khora, even `act.db` only stores encrypted envelopes (`__ethos_enc: "v1"`).

### 2. Direct Node.js (No Docker)

Requires **Node.js >= 22.5.0**:

```bash
cp .env.example .env
npm start
# Or with SQLite enabled:
ENABLE_SQLITE_DB=true DB_PATH=./data/act.db npm start
```

### 3. Simple Static Server (Development)

```bash
python3 -m http.server 8084
# or
npx serve .
```

> **Note on Web Crypto & WebAuthn:** Browsers only expose `crypto.subtle` (AES-256) and `PublicKeyCredential` (FaceID/Fingerprint) in secure contexts (`https://...`, `http://localhost`, or `http://127.0.0.1`). If accessing via plain LAN IP (`http://192.168.x.x:8084`), use an HTTPS tunnel (such as Tailscale Serve or Cloudflare Pages) to unlock encryption and biometrics.

---

## Project Structure

- `public/index.html`, `public/manifest.json`, `public/sw.js`: app shell and PWA manifest.
- `public/css/styles.css`: design system (light/dark themes, ACT bus, modals, banners).
- `public/js/i18n.js`: `ES` / `EN` internationalization engine (catalogs, glossary, example items, and DOM/Canvas observer).
- `public/js/state.js`: state manager, `IndexedDB` mirror, `AES-256-GCM` vault, `WebAuthn`, seed/demo data, bilingual therapy analyzer, and optional SQLite sync.
- `public/js/app.js`: navigation controller, lock screen, `ACT Crisis` triage, PWA install gate, Settings modal (`openSettingsModal`), and `KHORA_CREDITS`.
- `public/js/subapp-*.js`: feature modules (`perfil`, `paz-falsa`, `espacio-act`, `radar-patrones`, `brujula-valores`, `pildoras-anclajes`, `insight`).
- `server/server.js`, `Dockerfile`, `docker-compose.yml`: static HTTP server and optional `node:sqlite` API.
- `scripts/sync-version.mjs`: syncs `package.json` `version` into `public/sw.js` and `public/index.html` (`npm run sync:version` / `npm run check`).
