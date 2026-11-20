🇪🇸 **Español** | 🇬🇧 [English](./README.dev.en.md)

# Khora (`khora`) — Documentación Técnica

Guía técnica para desarrolladores, auto-alojamiento (Docker / Node / servidor estático), despliegue en **GitHub Pages** / **Cloudflare Pages** y configuración del cifrado, i18n y persistencia.

> ¿Buscas la guía de uso para personas usuarias? Ve al [README.md](README.md) ([English](README.en.md)).

---

## Arquitectura y Stack

- **Frontend:** Vanilla HTML/CSS/JS modular sin bundler ni dependencias npm en tiempo de compilación (`index.html`, `css/styles.css`, `js/i18n.js`, `js/state.js`, `js/app.js`, `js/subapp-*.js`), instalado como **PWA** con Service Worker (`sw.js`: precache atómico, *network-first* para HTML, *cache-first* para assets versionados y *stale-while-revalidate* para estáticos).
- **Internacionalización (`js/i18n.js`):** motor bilingüe `ES` / `EN` (`window.i18n` / `window.t`) con detección inicial de navegador, persistencia en `localStorage` (`act_lang_pref`), sincronización de catálogos de dominio, localización reversible de nodos DOM/SVG/atributos + texto Canvas y actualización inteligente de semillas/ejemplos sin alterar los textos propios del usuario.
- **Persistencia Local-First:**
  - `localStorage` + espejo automático en **`IndexedDB`** (`ethos_act_idb`) y solicitud de almacenamiento persistente (`navigator.storage.persist()`).
- **Cifrado y Privacidad (Client-Side):**
  - `Web Crypto API`: derivación de clave con **`PBKDF2`** (SHA-256, 100.000 iteraciones) y cifrado autenticado **`AES-256-GCM`** por colección/singleton antes de escribir en `localStorage`, `IndexedDB` o enviar a SQLite.
  - Desbloqueo biométrico opcional por dispositivo mediante **`WebAuthn`** (*Platform Authenticator*: FaceID / TouchID / Huella).
- **Backend opcional (`server/server.js`):** Node.js >= 22.5.0 puro (sin dependencias externas), que utiliza `node:http`, `node:crypto` y `node:sqlite`.

---

## Personalizar Créditos y Ko-fi

En la parte superior de [`public/js/app.js`](../public/js/app.js) encontrarás el objeto `KHORA_CREDITS`:

```javascript
const KHORA_CREDITS = {
  githubUser: (typeof window !== 'undefined' && window.location?.hostname?.endsWith('.github.io'))
    ? window.location.hostname.split('.')[0]
    : 'jcarrascof',
  repoName: 'khora',
  kofiUrl: 'https://ko-fi.com/jcarrascof'
};
```

- Cuando se sirve en `*.github.io`, `githubUser` detecta automáticamente tu usuario de GitHub del subdominio.
- Si haces fork del repo y lo sirves en Cloudflare Pages u otro dominio, sustituye `'jcarrascof'` y `kofiUrl` por los tuyos (y el pie de `README.md` / `README.en.md`).

---

## Despliegue gratuito como PWA estática (recomendado)

### Opción A: Cloudflare Pages (automático)

Este repositorio incluye [`.github/workflows/pages.yml`](../.github/workflows/pages.yml), que ejecuta `npm run check` y publica con `wrangler pages deploy public` **únicamente** los archivos estáticos del cliente en `public/` (`index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `icons/`). Además, publica la Page Function [`functions/api/feedback.js`](../functions/api/feedback.js) en el endpoint `/api/feedback`.

1. Crea un proyecto **Pages** en **Cloudflare Dashboard → Workers & Pages**.
2. En **Settings → Variables and Secrets**, define:
   - `CLOUDFLARE_API_TOKEN` (token con permisos de *Cloudflare Pages: Edit*)
   - `CLOUDFLARE_ACCOUNT_ID` (en **Workers & Pages → 你的 project page**)
   - `GITHUB_FEEDBACK_TOKEN` (fine-grained token de GitHub con acceso *Contents: read/write* al repo, para que el modal de feedback cree issues)
   - `GITHUB_REPO` *(opcional)*, p. ej. `JCarrascoF/khora` (por defecto ya es ese)
3. Cada push a `main` ejecuta las comprobaciones y despliega la PWA con HTTPS.

### Opción B: GitHub Pages u otro hosting estático (manual)

1. Publica los archivos estáticos de `public/` en tu hosting favorito (o usa **Upload assets** en Cloudflare Pages subiendo únicamente la carpeta `public/`).
2. Sin las Page Functions, el modal de **💬 Feedback** solo ofrece «Copiar mensaje» y «GitHub Issues» como vías alternativas.

> **Comportamiento sin backend:** Al no existir `/api/health`, Khora activa automáticamente el **Modo Navegador Local**, oculta los ajustes de SQLite en `⚙️ Configuración` y activa el **detector de instalación PWA + warning de persistencia** en navegadores móviles que aún no hayan añadido la app a la Pantalla de Inicio. Sin `GITHUB_FEEDBACK_TOKEN`, el envío directo del feedback responde `503` y el modal muestra la alternativa manual.

---

## Ejecución en local y con Docker

### 1. Docker Compose (modo local en navegador por defecto)

Por defecto [`docker-compose.yml`](docker-compose.yml) arranca con `ENABLE_SQLITE_DB="false"`: el contenedor solo sirve los archivos estáticos de la PWA para que cada persona que acceda guarde sus datos únicamente en su propio dispositivo, sin compartir una base de datos común.

```bash
cp .env.example .env
docker compose up -d --build
```

Disponible en `http://localhost:8084`. *(Nota: `docker-compose.yml` usa `env_file` con `required: false`, lo que requiere Docker Compose `v2.24+`.)*

#### Activar persistencia SQLite en el servidor *(opcional, solo uso personal monousuario)*

Si quieres guardar tus datos en `./data/act.db` dentro de tu propio servidor:

1. En `.env`, pon:
   ```env
   ENABLE_SQLITE_DB=true
   # Recomendado si la expones fuera de localhost:
   AUTH_USER=admin
   AUTH_PASSWORD=una-clave-segura
   AUTH_SECRET=una-cadena-aleatoria-larga
   ```
2. En [`docker-compose.yml`](docker-compose.yml), descomenta el volumen:
   ```yaml
   - ./data:/app/data
   ```
3. Reinicia el contenedor:
   ```bash
   docker compose up -d --build
   ```

Con `AUTH_PASSWORD` definida, `server/server.js` protege `/api/state`, `/api/state/*` y `/api/backup/db` con `401 Unauthorized` y cookie `HttpOnly` (`khora_act_session`, firma HMAC-SHA256). Si además activas el cifrado **AES-256-GCM** dentro de Khora, incluso `act.db` almacenará sobres cifrados (`__ethos_enc: "v1"`).

### 2. Node.js directo (sin Docker)

Requiere **Node.js >= 22.5.0** (`npm start` carga `.env` automáticamente si existe, sin sobrescribir variables ya definidas en el shell):

```bash
cp .env.example .env
npm start
# O con SQLite activado:
ENABLE_SQLITE_DB=true DB_PATH=./data/act.db npm start
```

### 3. Servidor estático simple (desarrollo)

```bash
python3 -m http.server 8084
# o
npx serve .
```

> **Nota sobre Web Crypto y WebAuthn:** Los navegadores solo habilitan `crypto.subtle` (AES-256) y `PublicKeyCredential` (FaceID/Huella) en orígenes seguros (`https://...`, `http://localhost` o `http://127.0.0.1`). Si accedes por una IP LAN sin HTTPS (`http://192.168.x.x:8084`), usa un túnel HTTPS (como Tailscale Serve o Cloudflare Pages) para habilitar cifrado y biometría.

---

## Estructura de archivos

- `public/index.html`, `public/manifest.json`, `public/sw.js`: shell principal y manifiesto PWA.
- `public/css/styles.css`: sistema visual (modo claro/oscuro, autobús ACT, modales y banners).
- `public/js/i18n.js`: motor de internacionalización `ES` / `EN` (catálogos, glosario, datos de ejemplo y observador DOM/Canvas).
- `public/js/state.js`: gestión de estado, espejo `IndexedDB`, cifrado `AES-256-GCM`, `WebAuthn`, datos semilla/demo, analizador de terapia bilingüe y sincronización SQLite opcional.
- `public/js/app.js`: orquestador de navegación, pantalla de bloqueo, triaje `Crisis ACT`, detector de instalación PWA, modal de configuración (`openSettingsModal`) y créditos (`KHORA_CREDITS`).
- `public/js/subapp-*.js`: módulos funcionales (`perfil`, `paz-falsa`, `espacio-act`, `radar-patrones`, `brujula-valores`, `pildoras-anclajes`, `insight`).
- `server/server.js`, `Dockerfile`, `docker-compose.yml`: servidor HTTP estático y API SQLite opcional con `node:sqlite`.
- `scripts/sync-version.mjs`: sincroniza `version` de `package.json` con `public/sw.js` y `public/index.html` (`npm run sync:version` / `npm run check`).
