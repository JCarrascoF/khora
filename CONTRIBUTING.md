# Contributing to Khora

Thank you for considering contributing! Khora is a **local-first PWA** for
ACT (Acceptance and Commitment Therapy) practice. This guide explains how
to run it locally, how the code is organized, and the conventions we follow.

## Quick start

### Run the PWA (no backend — recommended)

Khora is designed to work fully offline in the browser. The quickest way
to try it is to serve the static files:

```sh
npx serve .
# open http://localhost:3000
```

All data is stored in your browser (IndexedDB + localStorage) and is
encrypted at rest with AES-256 when you enable the privacy lock.

### Run with the optional SQLite backend

The Node server in `server.js` is **optional**. It exists for a single
use case: persisting Khora data in a SQLite database on your own server
(monousuario, self-hosted). It is disabled by default.

```sh
cp .env.example .env
# edit .env: set ENABLE_SQLITE_DB=true and (optionally) AUTH_USER/AUTH_PASSWORD
npm start
# open http://localhost:8080
```

> **Do not enable the SQLite backend for multi-user deployments.**
> It is a single-tenant storage helper, not a multi-tenant API.

### Run with Docker

```sh
cp .env.example .env
docker compose up --build
```

## Repository layout

```
.
├── index.html            # PWA shell
├── sw.js                 # Service worker (offline caching)
├── manifest.json         # PWA manifest
├── css/styles.css
├── icons/                # PWA icons (192 + 512)
├── js/
│   ├── app.js            # App bootstrap & routing
│   ├── state.js          # Data layer: IndexedDB + localStorage + server sync
│   ├── i18n.js           # ES/EN translations
│   └── subapp-*.js       # One file per feature (sub-app)
├── server.js             # Optional Node server (static + SQLite API)
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/    # GitHub Pages deploy (static PWA)
```

## Code conventions

- **Zero runtime dependencies.** Khora ships with no `node_modules` at
  runtime. If your change requires a new dependency, please open an
  issue first — we want to keep the project dependency-free.
- **Vanilla JS, no build step.** Files in `js/` are loaded directly by
  the browser via `<script>` tags. Avoid ES modules unless we adopt them
  across the whole codebase (currently classic scripts).
- **No formatter enforced.** Match the surrounding style: 2-space
  indent, single quotes, semicolons, `camelCase` for variables and
  functions, `PascalCase` for classes.
- **i18n is mandatory.** Any user-facing string must go through
  `js/i18n.js` (ES + EN). Do not hardcode Spanish or English in the UI.

### Adding a new language

1. In `js/i18n.js`, add a new object alongside `es` and `en`.
2. Add the language code to the language switcher in the header.
3. Every key in `es` / `en` must have a translation in the new language
   (or a fallback that the app already supports).

### Adding a new feature (sub-app)

1. Create `js/subapp-<name>.js` with a top-level function that mounts
   the sub-app into its container.
2. Register it in `js/app.js` (routing + navigation).
3. Add the `<script>` tag in `index.html` (order matters: `state.js`
   before sub-apps, sub-apps before `app.js`).
4. Add the file to `ASSETS_TO_CACHE` in `sw.js` and bump `CACHE_NAME`.

## Testing

There is no automated test suite yet. Before submitting a PR:

1. `node --check server.js` (and each `js/*.js` file you touched).
2. Manually exercise the PWA in at least one modern browser, in
   **offline mode** (DevTools → Network → "Offline") to confirm the
   service worker still works.
3. If you touched `server.js`, also test with `ENABLE_SQLITE_DB=true`.

## Pull requests

- Small, focused PRs are easier to review. If your change spans
  multiple concerns, split it.
- Reference the issue you are addressing (`Fixes #123` or `Relates to #123`).
- Do not commit generated files, `.env`, or anything under `data/`.

## Security considerations

Khora handles sensitive, personal data (mental-health notes). When in
doubt, prefer the more private option:

- Do not add analytics, telemetry, or external network calls.
- Do not upload user data to any service.
- If you find a security issue, **do not open a public issue**.
  See [`SECURITY.md`](./SECURITY.md).

## Code of conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/).
See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
