import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'ui-catalog.json');

async function main() {
  const args = process.argv.slice(2);
  const tagQuery = args.find(a => a.startsWith('--tag='))?.split('=')[1];
  const archetypeQuery = args.find(a => a.startsWith('--archetype='))?.split('=')[1];

  let raw;
  try {
    raw = await fs.readFile(CATALOG_PATH, 'utf8');
  } catch (err) {
    console.error(`[UI Check] Error reading ${CATALOG_PATH}:`, err.message);
    process.exit(1);
  }

  const catalog = JSON.parse(raw);
  const allEntries = [...(catalog.screens || []), ...(catalog.modals || [])];

  // Query mode for LLMs / Devs
  if (tagQuery) {
    const matched = allEntries.filter(e => e.characteristics?.includes(tagQuery));
    console.log(`\n[UI Query] Elementos con la característica '${tagQuery}' (${matched.length}):`);
    for (const m of matched) {
      console.log(`  - ${m.id} [${m.name}] -> ${m.file} (método: ${m.render_method || 'render'})`);
    }
    return;
  }

  if (archetypeQuery) {
    const matched = allEntries.filter(e => e.archetype === archetypeQuery);
    console.log(`\n[UI Query] Elementos con el arquetipo '${archetypeQuery}' (${matched.length}):`);
    for (const m of matched) {
      console.log(`  - ${m.id} [${m.name}] -> ${m.file} (método: ${m.render_method || 'render'})`);
    }
    return;
  }

  console.log(`[UI Check] Validando catálogo de UI (v${catalog.version})...`);
  let errors = 0;
  let warnings = 0;

  // Cache files content for method checks
  const fileCache = new Map();

  for (const entry of allEntries) {
    const filePath = path.join(ROOT, entry.file);
    try {
      if (!fileCache.has(entry.file)) {
        const content = await fs.readFile(filePath, 'utf8');
        fileCache.set(entry.file, content);
      }
    } catch {
      console.error(`  ❌ [${entry.id}] Archivo no encontrado: ${entry.file}`);
      errors++;
      continue;
    }

    const content = fileCache.get(entry.file);
    if (entry.render_method && !content.includes(entry.render_method)) {
      console.error(`  ❌ [${entry.id}] Método '${entry.render_method}' no existe en ${entry.file}`);
      errors++;
    }

    // Check steps methods if any
    if (Array.isArray(entry.steps)) {
      for (const st of entry.steps) {
        if (st.render_method && !content.includes(st.render_method)) {
          console.error(`  ❌ [${entry.id} -> Paso ${st.step}] Método '${st.render_method}' no existe en ${entry.file}`);
          errors++;
        }
      }
    }

    // Check screenshot existence (warning)
    if (entry.screenshot) {
      const shotPath = path.join(ROOT, entry.screenshot);
      try {
        await fs.access(shotPath);
      } catch {
        warnings++;
      }
    }
  }

  console.log(`\nResumen:`);
  console.log(`  - Pantallas registradas: ${catalog.screens?.length || 0}`);
  console.log(`  - Modales registrados: ${catalog.modals?.length || 0}`);
  console.log(`  - Arquetipos disponibles: ${Object.keys(catalog.archetypes || {}).length}`);
  console.log(`  - Características taxonómicas: ${Object.keys(catalog.characteristics_glossary || {}).length}`);

  if (warnings > 0) {
    console.log(`  ℹ️  ${warnings} capturas de referencia no están en disco (ejecuta 'npm run ui:capture' para regenerarlas si es necesario).`);
  }

  if (errors > 0) {
    console.error(`\n❌ Se encontraron ${errors} errores en el catálogo de UI.`);
    process.exit(1);
  } else {
    console.log(`\n✅ Catálogo de UI 100% consistente con el código fuente.`);
  }
}

main().catch((err) => {
  console.error('[UI Check] Error fatal:', err);
  process.exit(1);
});
