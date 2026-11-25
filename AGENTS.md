# AGENTS.md

## Versionado en PRs

- **Por defecto, no cortes versión** al preparar cambios o abrir una PR.
- Solo aplica un bump de versión cuando el usuario pida explícitamente cortar/subir versión. En ese caso:
  - `package.json` (`version`) es la única fuente de verdad (no edites versiones manualmente en `public/sw.js` ni `public/index.html`).
  - Aplica el bump de versión (SemVer) **siempre como último commit dedicado de la rama**, una vez terminados todos los cambios y antes de abrir/mergear la PR:
    - `minor`: nueva funcionalidad retrocompatible.
    - `patch`: bugfixes o ajustes menores.
    - `major`: cambios incompatibles (formato de datos/cifrado, SQLite o API).
    - Sin bump si la PR solo toca docs, tests o CI. (Si hay duda entre niveles, pregunta antes.)
  - Para aplicar el bump: actualiza `package.json`, ejecuta `npm run sync:version` y valida con `npm run check`.
