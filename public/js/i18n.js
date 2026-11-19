/**
 * KHORA - Your ACT Space / Tu espacio ACT
 * Lightweight Bilingual Internationalization Engine (ES / EN)
 * Handles preference persistence, dynamic domain catalogs, example data,
 * reversible DOM/SVG/attribute localization, Canvas chart text, and toasts.
 */

(function () {
  const LANG_STORAGE_KEY = 'act_lang_pref';

  const {
    DOMAIN_MAP_EN,
    EMOTION_MAP_EN,
    BODY_ZONES_EN,
    PHYSICAL_CHIPS_EN,
    VALUES_EN,
    ACT_GLOSSARY_EN,
    ACT_GLOSSARY_PATTERNS_EN,
    DEFAULT_ANCHORS_EN,
    DEFAULT_PASSENGERS_EN,
    SEED_VALUE_EN,
    SEED_REFLECTION_EN,
    DEMO_ITEMS_EN,
    CATALOGS_EN,
    EXACT_MAP
  } = globalThis.KHORA_I18N_DICT;

  function translateWordOrDomainList(str) {
    return String(str || '')
      .split(',')
      .map((part) => {
        const clean = part.trim();
        return EXACT_MAP[clean] || clean;
      })
      .join(', ');
  }

  function translateValueChoice(v) {
    const clean = String(v || '').trim();
    if (Object.prototype.hasOwnProperty.call(EXACT_MAP, clean)) {
      return EXACT_MAP[clean];
    }
    const colonMatch = clean.match(/^([^:]+): (.+)$/);
    if (colonMatch) {
      const dom = DOMAIN_MAP_EN[colonMatch[1].trim()] || EXACT_MAP[colonMatch[1].trim()];
      if (dom) {
        return `${dom}: ${EXACT_MAP[colonMatch[2]] || colonMatch[2]}`;
      }
    }
    return clean;
  }

  // Regex rules for dynamic templates containing numbers, user variables, or names
  const PATTERN_RULES = [
    [/^Paso (\d+) de (\d+)$/, (_, a, b) => `Step ${a} of ${b}`],
    [/^Paso (\d+)\/(\d+)$/, (_, a, b) => `Step ${a}/${b}`],
    [/^Seleccionadas \((\d+)\):$/, (_, n) => `Selected (${n}):`],
    [/^(\d+) seleccionada$/, (_, n) => `${n} selected`],
    [/^(\d+) seleccionadas$/, (_, n) => `${n} selected`],
    [/^🧹 Quitar Ejemplos \((\d+)\)$/, (_, n) => `🧹 Remove Examples (${n})`],
    [/^📌 Pendientes de sesión \((\d+)\)$/, (_, n) => `📌 Pending session (${n})`],
    [/^✅ Tratadas \((\d+)\)$/, (_, n) => `✅ Discussed (${n})`],
    [/^Todas \((\d+)\)$/, (_, n) => `All (${n})`],
    [/^❤️ Favoritas \((\d+)\)$/, (_, n) => `❤️ Favorites (${n})`],
    [/^⚓ Mis Tarjetas de Anclaje ACT \((\d+)\)$/, (_, n) => `⚓ My ACT Anchor Cards (${n})`],
    [/^Etiquetas Desmontadas \((\d+)\)$/, (_, n) => `Deconstructed Labels (${n})`],
    [/^Pivotes Registrados \((\d+)\)$/, (_, n) => `Recorded Pivots (${n})`],
    [/^🚨 Junto al Volante \((\d+)\)$/, (_, n) => `🚨 Near the Wheel (${n})`],
    [/^💺 Asientos Traseros \((\d+)\)$/, (_, n) => `💺 Back Seats (${n})`],
    [/^✅ Valorado e integrado \((\d+)\)$/, (_, n) => `✅ Reviewed & integrated (${n})`],
    [/^📌 (\d+) tema pendiente$/, (_, n) => `📌 ${n} pending topic`],
    [/^📌 (\d+) temas pendientes$/, (_, n) => `📌 ${n} pending topics`],
    [/^Autoabandono: (\d+)\/100$/, (_, n) => `Self-abandonment: ${n}/100`],
    [/^🚌 (\d+) pasajeros activos$/, (_, n) => `🚌 ${n} active passengers`],
    [/^🧭 (\d+) valores$/, (_, n) => `🧭 ${n} values`],
    [/^Exhala lento\.\.\. (\d+)s$/, (_, s) => `Exhale slowly... ${s}s`],
    [/^Exhala soltando hombros\.\.\. (\d+)s$/, (_, s) => `Exhale, dropping shoulders... ${s}s`],
    [/^Actualizado: (.+)$/, (_, v) => `Updated: ${v}`],
    [/^Última sinc\.: (.+)$/, (_, v) => `Last sync: ${v}`],
    [/^🔓 Sesión: (.+)$/, (_, u) => `🔓 Session: ${u}`],
    [/^🟢 Servidor SQLite accesible(?: \((\d+) registros\))?$/, (_, n) => n ? `🟢 SQLite server reachable (${n} records)` : '🟢 SQLite server reachable'],
    [/^Intensidad: (\d+) → (\d+) \(([-+]\d+)\)$/, (_, a, b, d) => `Intensity: ${a} → ${b} (${d})`],
    [/^Intensidad: (\d+)\/10 → (\d+)\/10 \(([-+]\d+)\)$/, (_, a, b, d) => `Intensity: ${a}/10 → ${b}/10 (${d})`],
    [/^Resentimiento: (\d+)\/10$/, (_, n) => `Resentment: ${n}/10`],
    [/^Agotamiento: (\d+)\/10$/, (_, n) => `Exhaustion: ${n}/10`],
    [/^Ansiedad: (\d+)\/10$/, (_, n) => `Anxiety: ${n}/10`],
    [/^Zonas: (.+)$/, (_, z) => `Zones: ${translateWordOrDomainList(z)}`],
    [/^Pensamiento observado: "(.+)"$/, (_, t) => `Observed thought: "${t}"`],
    [/^Valor: (.+)$/, (_, v) => `Value: ${translateValueChoice(v)}`],
    [/^Emoción: (.+)$/, (_, e) => `Emotion: ${translateWordOrDomainList(e)}`],
    [/^Contexto: (.+)$/, (_, c) => `Context: ${EXACT_MAP[c] || c}`],
    [/^Eje: (.+)$/, (_, x) => `Axis: ${EXACT_MAP[x] || x}`],
    [/^🛋️ (.+)$/, (_, c) => `🛋️ ${EXACT_MAP[c] || c}`],
    [/^(?:Falsa Paz) • (.+)$/, (_, c) => `False Peace • ${EXACT_MAP[c] || c}`],
    [/^(?:Espacio ACT) • (.+)$/, (_, e) => `ACT Space • ${translateWordOrDomainList(e)}`],
    [/^(.+) • Lectura de 1 minuto$/, (_, c) => `${EXACT_MAP[c] || c} • 1-minute read`],
    [/^(.+) • ⏱️ (\d+)\s*seg$/, (_, b, s) => `${EXACT_MAP[b] || b} • ⏱️ ${s} sec`],
    [/^(.+) • ⏱️ (.+)$/, (_, b, d) => `${EXACT_MAP[b] || b} • ⏱️ ${EXACT_MAP[d] || d}`],
    [/^Acción elegida: "(.+)"$/, (_, a) => `Chosen action: "${a}"`],
    [/^(.+?)\s*Si fueras fiel a «(.+)», ¿qué harías concretamente\?$/, (_, icon, v) => `${icon} If you stayed true to "${EXACT_MAP[v] || v}", what would you concretely do?`],
    [/^Tu declaración en «(.+)»:$/, (_, d) => `Your statement in "${EXACT_MAP[d] || d}":`],
    [/^Creado con ❤️ por @(.+)$/, (_, u) => `Created with ❤️ by @${u}`],
    [/^Acción: "(.+)"$/, (_, a) => `Action: "${a}"`],
    [/^(?:🌿 ([^—]+?)|⚡ Piloto Automático) — Acción: "(.+)"$/, (_, val, a) => `${val !== undefined ? `🌿 ${translateValueChoice(val)}` : '⚡ Autopilot'} — Action: "${EXACT_MAP[a] || a}"`],
    [/^— Acción: "(.+)"$/, (_, a) => `— Action: "${EXACT_MAP[a] || a}"`],
    [/^🌿 (.+)$/, (_, v) => `🌿 ${translateValueChoice(v)}`],
    [/^Quitar (.+)$/, (_, em) => `Remove ${EXACT_MAP[em] || em}`],
    [/^3\. ¿Qué pensamiento te repite «(.+)»\?$/, (_, m) => `3. What thought is "${m}" repeating to you?`],
    [/^📻 Apodo: «(.+)»$/, (_, m) => `📻 Nickname: "${m}"`],
    [/^Fórmulas de Distanciamiento ACT \(Yo Observador vs\. (.+)\)$/, (_, m) => `ACT Defusion Formulas (Observing Self vs. ${m})`],
    [/^2\. La Historia de (.+)$/, (_, m) => `2. ${m}'s Story`],
    [/^¿Cómo está la intensidad ahora\? \(antes: (\d+)\/10\)$/, (_, n) => `How is the intensity now? (before: ${n}/10)`],
    [/^"Estoy teniendo el pensamiento de que (.+)\."$/, (_, t) => `"I am having the thought that ${EXACT_MAP[t] || t}."`],
    [/^"Observo con curiosidad que (.+?) \(mi mente\) me está contando la historia de que (.+)\."$/, (_, m, t) => `"I notice with curiosity that ${m} (my mind) is telling me the story that ${EXACT_MAP[t] || t}."`],
    [/^"Agradezco a (.+?) por intentar protegerme creyendo que (.+)\."$/, (_, m, t) => `"Thank you, ${m}, for trying to protect me by thinking that ${EXACT_MAP[t] || t}."`],
    [/^1\. "Estoy teniendo el pensamiento de que (.+)\."$/, (_, t) => `1. "I am having the thought that ${EXACT_MAP[t] || t}."`],
    [/^2\. "Observo que (.+?) me cuenta la historia de que (.+)\."$/, (_, m, t) => `2. "I notice ${m} is telling me the story that ${EXACT_MAP[t] || t}."`],
    [/^3\. "Gracias, (.+?), por intentar protegerme creyendo que (.+)\."$/, (_, m, t) => `3. "Thank you, ${m}, for trying to protect me by thinking that ${EXACT_MAP[t] || t}."`],
    [/^2\. "Observo que (.+?) me cuenta la historia de que\.\.\."$/, (_, m) => `2. "I notice ${m} is telling me the story that..."`],
    [/^3\. "Gracias, (.+?), por tu novela dramática\."$/, (_, m) => `3. "Thank you, ${m}, for your dramatic novel."`],
    [/^Tengo la creencia automática de que (.+)$/, (_, t) => `I hold the automatic belief that ${EXACT_MAP[t] || t}`],
    [/^2\. Identificación Física de «(.+)» en tu Cuerpo$/, (_, e) => `2. Physical Mapping of "${translateWordOrDomainList(e)}" in Your Body`],
    [/^(\S+) Si fueras fiel a tu «(.+)», ¿qué harías concretamente\?$/, (_, ic, v) => `${ic} If you honored your "${EXACT_MAP[v] || v}", what would you concretely do?`],
    [/^Tu declaración en «(.+)»:$/, (_, d) => `Your statement in "${EXACT_MAP[d] || d}":`],
    [/^💎 Tu Valor en ([^:]+): «(.+)»$/, (_, d, st) => `💎 Your Value in ${EXACT_MAP[d] || d}: "${st}"`],
    [/^🧭 Tu Faro \(([^)]+)\):$/, (_, d) => `🧭 Your Lighthouse (${DOMAIN_MAP_EN[d] || EXACT_MAP[d] || d}):`],
    [/^«(.+)» \((Pareja|Trabajo|Familia|Amigos|Amistad|Amistad \/ Amigos|Conmigo Mismo|Salud \/ Personal|Personal \/ Salud|General|Otro|Autocuidado)\)$/, (_, st, dom) => `"${EXACT_MAP[st] || st}" (${DOMAIN_MAP_EN[dom] || EXACT_MAP[dom] || dom})`],
    [/^«(Pareja|Trabajo|Familia|Amigos|Amistad|Amistad \/ Amigos|Conmigo Mismo|Salud \/ Personal|Personal \/ Salud|General|Otro|Autocuidado): (.+)»$/, (_, dom, st) => `"${DOMAIN_MAP_EN[dom] || EXACT_MAP[dom] || dom}: ${EXACT_MAP[st] || st}"`],
    [/^Valor elegido \(([^)]+)\):$/, (_, d) => `Chosen value (${EXACT_MAP[d] || d}):`],
    [/^\+ Definir mi Valor en (.+)$/, (_, d) => `+ Define my Value in ${EXACT_MAP[d] || d}`],
    [/^Aún no tienes un valor definido para$/, () => 'You do not have a defined value for'],
    [/^\. Anclarlo te dará claridad al decidir\.$/, () => '. Anchoring one will clarify your decisions.'],
    [/^🌱 Micro-paso sugerido: (.+)$/, (_, m) => `🌱 Suggested micro-step: ${m}`],
    [/^✅ Registrar práctica(?: \((\d+)\))?$/, (_, n) => n ? `✅ Log practice (${n})` : '✅ Log practice'],
    [/^Reflexión posterior \(([^)]+)\):$/, (_, dt) => `Follow-up reflection (${dt}):`],
    [/^Dolor \/ Temor: "(.+)"$/, (_, p) => `Pain / Fear: "${p}"`],
    [/^🌱 Anhelo: "(.+)"$/, (_, y) => `🌱 Yearning: "${y}"`],
    [/^Practicar(?: maniobra en vivo)? \(1 min\)$/, () => 'Practice live (1 min)'],
    [/^🚦 Practicar(?: maniobra en vivo)? \(1 min\)$/, () => '🚦 Practice live (1 min)'],
    [/^📻 Radio del salpicadero:$/, () => '📻 Dashboard radio:'],
    [/^Elección consciente basada en$/, () => 'Conscious choice grounded in'],
    [/^Concreta qué matiz de (.+) sientes en el anillo exterior$/, (_, f) => `Pick which nuance of ${EXACT_MAP[f] || f} you feel in the outer ring`],
    [/^es una categoría general\. Concreta tocando uno de sus matices resaltados en el anillo exterior\.$/, () => 'is a broad category. Narrow it down by tapping one of its highlighted nuances in the outer ring.'],
    [/^Mente nombrada: (.+)$/, (_, m) => `Mind named: ${m}`],
    [/^Valor guardado en (.+) 🧭$/, (_, d) => `Value saved in ${EXACT_MAP[d] || d} 🧭`],
    [/^Valor actualizado en (.+) 🧭$/, (_, d) => `Value updated in ${EXACT_MAP[d] || d} 🧭`],
    [/^🌟 Valor Faro fijado en (.+)$/, (_, d) => `🌟 Lighthouse Value set in ${EXACT_MAP[d] || d}`],
    [/^✅ Paso registrado hacia tu valor en (.+)$/, (_, d) => `✅ Step logged toward your value in ${EXACT_MAP[d] || d}`],
    [/^Pasajero actualizado: "(.+)" 🚌$/, (_, n) => `Passenger updated: "${n}" 🚌`],
    [/^Pasajero subido al autobús: "(.+)" 🚌$/, (_, n) => `Passenger added to bus: "${n}" 🚌`],
    [/^Reto añadido: "(.+)"$/, (_, l) => `Challenge added: "${l}"`],
    [/^Generador de pensamientos bautizado como "(.+)"$/, (_, p) => `Thought generator named "${p}"`],
    [/^🚌 Pasajero haciendo ruido \(A medias\): «(.+)»$/, (_, n) => `🚌 Loud passenger: "${n}"`],
    [/^Para sostener tu dirección frente a "(.+)"$/, (_, s) => `To keep steering amid "${s}"`],
    [/^Para retomar el volante hacia tus valores\.$/, () => 'To reclaim the steering wheel toward your values.'],
    [/^Acompaña tu situación actual en (.+)\.$/, (_, c) => `Supports your current situation in ${EXACT_MAP[c] || c}.`],
    [/^Conecta con tu foco actual: "(.+)"$/, (_, s) => `Connects with your focus: "${s}"`],
    [/^Para clarificar cómo actuar en el ámbito de (.+)\.$/, (_, c) => `To clarify action within ${EXACT_MAP[c] || c}.`],
    [/^Para salir de la inercia y orientar tu próximo paso\.$/, () => 'To step out of inertia and orient your next step.'],
    [/^Detectamos "(.+)" en tu foco(?: \((.+)\))?\.$/, (_, k, c) => `Matched "${k}" in your focus${c ? ` (${EXACT_MAP[c] || c})` : ''}.`],
    [/^Quiero actuar fiel a mi valor en ([^:]+): (.+)$/, (_, d, s) => `I want to act aligned with my value in ${EXACT_MAP[d] || d}: ${s}`],
    [/^Reconozco con curiosidad que aquí dentro hay (.+)\.$/, (_, list) => `I notice with curiosity that ${translateWordOrDomainList(list).toLowerCase()} is here right now.`],
    [/^Sé que gritas porque intentas protegerme de (.+), pero (.+) me aleja de mis valores\. Puedes viajar atrás; (?:hoy conduzco yo|al volante voy yo)\.$/, (_, p, d) => `I know you shout because you try to protect me from ${EXACT_MAP[p] || p}, yet ${EXACT_MAP[d] || d} pulls me away from my values. You can ride in the back; I am at the wheel.`],
    [/^Gracias por avisarme, (.+) \(sé que intentas protegerme de ([^)]+)\), pero ese desvío va en contra de mi ruta\. Puedes quedarte en el autobús\.\.\. pero el volante lo sostengo yo\.$/, (_, n, pr) => `Thank you for warning me, ${n} (I know you try to protect me from ${EXACT_MAP[pr] || pr}), yet that detour goes against my route. You can stay on the bus... while I hold the steering wheel.`],
    [/^No tocas el volante porque vas en contra de mi ruta \(([^)]+)\), pero tienes asiento atrás mientras avanzo\.$/, (_, val) => `You don't touch the wheel because you steer away from my route (${val}), yet you have a back seat as I move forward.`],
    [/^La voz de (.+) diciendo que soy egoísta$/, (_, m) => `${m}'s voice saying I am selfish`],
    [/^La sensación de (.+) en (.+)$/, (_, s, z) => `The feeling of ${EXACT_MAP[s] || s} in ${EXACT_MAP[z] || z}`],
    [/^💾\s*Modo Navegador Local:?\s*tus datos se guardan solo en este (dispositivo|navegador)\. Exporta una copia JSON cuando quieras moverlos o hacer respaldo\.$/, (_, dev) => `Browser Local Mode: your data stays on this ${dev === 'dispositivo' ? 'device' : 'browser'} only. Export a JSON backup anytime to move or safeguard it.`],
    [/^⚠️\s*Pestaña temporal en móvil:\s*añade Khōra a tu Pantalla de Inicio antes de guardar datos reales.*$/, () => 'Temporary mobile tab: add Khōra to your Home Screen before saving personal data (on iPhone, regular tab storage does not transfer and expires after 7 days).'],
    [/^🎯 Mostrando (\d+) registro\(s\) con este filtro$/, (_, n) => `🎯 Showing ${n} matching record(s)`],
    [/^Barrera identificada en tu foco:\s*"(.+)"$/, (_, b) => `Barrier noticed in your focus: "${EXACT_MAP[b] || b}"`],
    [/^(\d+) guías?$/, (_, n) => `${n} ${n === '1' ? 'guide' : 'guides'}`],
    [/^🎯 (\d+) dinámicas guiadas$/, (_, n) => `🎯 ${n} guided ${n === '1' ? 'activity' : 'activities'}`],
    [/^⭐ Valor Principal fijado en (.+)$/, (_, d) => `⭐ Primary Value set in ${EXACT_MAP[d] || d}`],
    [/^📋 Listar anclajes \((\d+)\)$/, (_, n) => `📋 List anchors (${n})`],
    [/^📖 (\d+) lecturas? · 🎯 (\d+) dinámicas?$/, (_, r, a) => `📖 ${r} ${r === '1' ? 'reading' : 'readings'} · 🎯 ${a} ${a === '1' ? 'activity' : 'activities'}`],
    [/^📖 (\d+) lecturas?(?: · 🎯 (\d+) taller(?:es)?)?$/, (_, r, w) => `📖 ${r} ${r === '1' ? 'reading' : 'readings'}${w ? ` · 🎯 ${w} ${w === '1' ? 'workshop' : 'workshops'}` : ''}`],
    [/^(▾ Ver|▴ Ocultar) pasajeros en silencio \((\d+)\)$/, (_, verb, n) => `${verb === '▾ Ver' ? '▾ Show' : '▴ Hide'} quiet passengers (${n})`]
  ];

  const MONTHS_ES_TO_EN = {
    enero: 'January',
    febrero: 'February',
    marzo: 'March',
    abril: 'April',
    mayo: 'May',
    junio: 'June',
    julio: 'July',
    agosto: 'August',
    septiembre: 'September',
    octubre: 'October',
    noviembre: 'November',
    diciembre: 'December'
  };

  // Translate plain-text clinical report generated in InsightApp.openTherapyBriefModal()
  function translateTherapyBrief(text) {
    if (!text || !text.includes('INFORME BREVE DE SEGUIMIENTO ACT')) return text;
    return text
      .replace('INFORME BREVE DE SEGUIMIENTO ACT PARA SESIÓN DE PSICOLOGÍA', 'BRIEF ACT FOLLOW-UP SUMMARY FOR THERAPY SESSION')
      .replace(/^Fecha de generación: (\d{1,2}) de ([a-záéíóú]+) de (\d{4})/gmi, (_, d, m, y) => {
        const enMonth = MONTHS_ES_TO_EN[m.toLowerCase()] || m;
        return `Generated on: ${enMonth} ${d}, ${y}`;
      })
      .replace(/^Fecha de generación:/gm, 'Generated on:')
      .replace('1. INDICADORES CUANTITATIVOS DE AUTORREGULACIÓN Y FLEXIBILIDAD', '1. SELF-REGULATION & FLEXIBILITY INDICATORS')
      .replace(/^- Registros de Falsa Paz \(evitación\/complacencia\):/gm, '- False Peace logs (avoidance/appeasing):')
      .replace(/^- Índice medio de autoabandono:/gm, '- Avg. self-abandonment index:')
      .replace(/^- Porcentaje de elección alineada con valores \(vs piloto automático\):/gm, '- Value-driven choice rate (vs autopilot):')
      .replace(/- Intervenciones de crisis en Espacio ACT: (\d+) \(reducción media de intensidad: -([\d.]+) puntos\)/g, '- ACT Space interventions: $1 (avg. intensity drop: -$2 pts)')
      .replace(/^- Último Hexaflex \(0-10\): Aceptación ([^,]+), Defusión ([^,]+), Presente ([^,]+), Yo Contexto ([^,]+), Valores ([^,]+), Acción ([^\n]+)/gm,
        '- Latest Hexaflex (0-10): Acceptance $1, Defusion $2, Present $3, Self-as-Context $4, Values $5, Action $6')
      .replace('2. EMOCIONES MÁS FRECUENTES (RUEDA EMOCIONAL)', '2. MOST FREQUENT EMOTIONS (EMOTION WHEEL)')
      .replace('- Sin registros suficientes en Rueda Emocional todavía.', '- Not enough Emotion Wheel logs yet.')
      .replace(/registro\(s\)/g, 'entry(ies)')
      .replace(/^- ([^:\n]+): (\d+) entry\(ies\)$/gm, (_, em, count) => {
        const emClean = em.trim();
        const emTr = emClean === 'Desconocida'
          ? 'Unspecified'
          : (EMOTION_MAP_EN[emClean] || EXACT_MAP[emClean] || emClean);
        return `- ${emTr}: ${count} entry(ies)`;
      })
      .replace('3. PASAJEROS ACTIVOS EN EL AUTOBÚS (MIEDOS / VOCES AUTOMÁTICAS)', '3. ACTIVE BUS PASSENGERS (FEARS / AUTOMATIC VOICES)')
      .replace('- Sin pasajeros activos pendientes de asiento.', '- No active passengers waiting for a seat.')
      .replace('- Sin pasajeros añadidos en el perfil todavía.', '- No passengers added to profile yet.')
      .replace(/\[Haciendo ruido \/ intentando conducir\]/g, '[Making noise / trying to steer]')
      .replace(/\[Ruidoso junto al volante\]/g, '[Loud near the wheel]')
      .replace(/\[Sentado atrás \/ en trabajo\]/g, '[Seated in back / in progress]')
      .replace(/\[Sentado atrás\]/g, '[Seated in back]')
      .replace(/-> Voz:/g, '-> Voice:')
      .replace('4. VALORES NUCLEARES Y DIRECCIÓN ELEGIDA (CONSTRUCTOR DE HAYES)', '4. CORE VALUES & CHOSEN DIRECTION (HAYES CONSTRUCTOR)')
      .replace(/^- \[([^\]]+)\]/gm, (_, dom) => `- [${DOMAIN_MAP_EN[dom] || EXACT_MAP[dom] || dom}]`)
      .replace(/\(Micro-acción:/g, '(Micro-action:')
      .replace('- Aún no se han formulado valores en el perfil.', '- No values constructed in profile yet.')
      .replace(/5\. REFLEXIONES Y TEMAS PENDIENTES PARA COMENTAR EN SESIÓN \((\d+)\)/g, '5. PENDING REFLECTIONS & TOPICS FOR SESSION ($1)')
      .replace('- No hay reflexiones marcadas como pendientes en este momento.', '- No reflections currently marked as pending.')
      .replace('- Sin reflexiones pendientes registradas.', '- No pending reflections recorded.')
      .replace(/^\[(\d+)\] \(([^•\n]+) • ([^)\n]+)\)/gm, (_, idx, ctx, cat) => {
        const ctxClean = ctx.trim();
        const catClean = cat.trim();
        return `[${idx}] (${DOMAIN_MAP_EN[ctxClean] || EXACT_MAP[ctxClean] || ctxClean} • ${EXACT_MAP[catClean] || catClean})`;
      })
      .replace(/^Reflexión del paciente:/gm, 'Client reflection:')
      .replace(/^  • Emociones detectadas:/gm, '  • Detected emotions:')
      .replace(/^  • Proceso ACT \/ Hexaflex:/gm, '  • ACT / Hexaflex process:')
      .replace(/^  • Patrón conductual:/gm, '  • Behavioral pattern:')
      .replace(/^  • Posible foco clínico:/gm, '  • Suggested clinical focus:')
      .replace(/ACT \/ Hexaflex process: Autoobservación$/gm, 'ACT / Hexaflex process: Self-observation')
      .replace(/Behavioral pattern: En exploración$/gm, 'Behavioral pattern: Under exploration')
      .replace(/Suggested clinical focus: Explorar antecedente y función$/gm, 'Suggested clinical focus: Explore antecedent and function');
  }

  const UI_EMOJI_RE = /(?:[\p{Extended_Pictographic}](?:\uFE0F|\u200D[\p{Extended_Pictographic}]\uFE0F?)*)\s*/gu;
  function stripUiEmoji(s) {
    return String(s || '').replace(UI_EMOJI_RE, '').replace(/\s+/g, ' ').trim();
  }

  const PLAIN_EXACT_MAP = Object.create(null);
  Object.keys(EXACT_MAP).forEach((k) => {
    const plainK = stripUiEmoji(k);
    if (plainK && !Object.prototype.hasOwnProperty.call(PLAIN_EXACT_MAP, plainK)) {
      PLAIN_EXACT_MAP[plainK] = stripUiEmoji(EXACT_MAP[k]);
    }
  });

  function translateSentence(str, _depth = 0) {
    if (str == null) return str;
    const raw = String(str);
    const trimmed = raw.trim().replace(/\s+/g, ' ');
    if (!trimmed) return raw;

    if (Object.prototype.hasOwnProperty.call(EXACT_MAP, trimmed)) {
      return stripUiEmoji(EXACT_MAP[trimmed]);
    }
    const plainTrimmed = stripUiEmoji(trimmed);
    if (plainTrimmed && Object.prototype.hasOwnProperty.call(PLAIN_EXACT_MAP, plainTrimmed)) {
      return PLAIN_EXACT_MAP[plainTrimmed];
    }
    for (let i = 0; i < PATTERN_RULES.length; i++) {
      const [regex, replacer] = PATTERN_RULES[i];
      if (regex.test(trimmed)) {
        return stripUiEmoji(trimmed.replace(regex, replacer));
      }
    }
    // Also match common Yo practice / bus patterns without leading emojis
    const pracMatch = plainTrimmed.match(/^Registrar práctica(?: \((\d+)\))?$/);
    if (pracMatch) {
      return pracMatch[1] ? `Log practice (${pracMatch[1]})` : 'Log practice';
    }
    const primaryValMatch = plainTrimmed.match(/^Valor Principal fijado en (.+)$/);
    if (primaryValMatch) {
      const d = primaryValMatch[1];
      return `Primary Value set in ${PLAIN_EXACT_MAP[d] || EXACT_MAP[d] || d}`;
    }
    const stepValMatch = plainTrimmed.match(/^Paso registrado hacia tu valor en (.+)$/);
    if (stepValMatch) {
      const d = stepValMatch[1];
      return `Step logged toward your value in ${PLAIN_EXACT_MAP[d] || EXACT_MAP[d] || d}`;
    }

    if (_depth < 2) {
      const quoteMatch = trimmed.match(/^"([\s\S]+)"$/) || trimmed.match(/^«([\s\S]+)»$/);
      if (quoteMatch) {
        const inner = quoteMatch[1];
        const innerTr = translateSentence(inner, _depth + 1);
        if (innerTr !== null && innerTr !== inner) {
          return `"${innerTr}"`;
        }
      }

      const prefixMatch = trimmed.match(/^(\+|✓|🎒|⚡)\s+(.+)$/);
      if (prefixMatch) {
        const prefix = prefixMatch[1];
        const rest = prefixMatch[2];
        const restTr = translateSentence(rest, _depth + 1);
        if (restTr !== null && restTr !== rest) {
          return `${prefix} ${restTr}`;
        }
      }

      if (trimmed.includes(' · ')) {
        const parts = trimmed.split(' · ');
        let anyTranslated = false;
        const mapped = parts.map((p) => {
          const tr = translateSentence(p, _depth + 1);
          if (tr !== null && tr !== p) {
            anyTranslated = true;
            return tr;
          }
          return p;
        });
        if (anyTranslated) {
          return mapped.join(' · ');
        }
      }
    }

    return null;
  }

  class KhoraI18n {
    constructor() {
      this.lang = this.detectInitialLang();
      this.observer = null;
      this.esCatalogBackup = null;
      this.seedEsBackup = new Map();
      this.isMutating = false;
      this.confirmWrapped = false;
      this.canvasWrapped = false;
      this.clickHookBound = false;
    }

    detectInitialLang() {
      try {
        const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LANG_STORAGE_KEY) : null;
        if (saved === 'en' || saved === 'es') return saved;
        const nav = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.toLowerCase() : 'es';
        return nav.startsWith('en') ? 'en' : 'es';
      } catch {
        return 'es';
      }
    }

    getLang() {
      return this.lang;
    }

    isEn() {
      return this.lang === 'en';
    }

    getLocale() {
      return this.isEn() ? 'en-US' : 'es-ES';
    }

    t(phrase, vars = null) {
      let out = phrase;
      if (this.isEn()) {
        const mapped = translateSentence(phrase);
        if (mapped !== null) out = mapped;
      }
      if (vars && typeof out === 'string') {
        Object.keys(vars).forEach((k) => {
          out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
        });
      }
      return out;
    }

    translateText(phrase) {
      return this.t(phrase);
    }

    init() {
      this.wrapGlobals();
      this.updateDocumentMeta();
      this.syncCatalogs();
      this.localizeExampleDataInState();
      this.startObserver();
      if (typeof document !== 'undefined' && document.body) {
        this.localizeDOM(document.body);
      }
    }

    wrapGlobals() {
      if (!this.confirmWrapped && typeof window !== 'undefined' && typeof window.confirm === 'function') {
        const origConfirm = window.confirm.bind(window);
        window.confirm = (msg) => origConfirm(this.isEn() ? this.t(msg) : msg);
        this.confirmWrapped = true;
      }

      if (!this.canvasWrapped && typeof CanvasRenderingContext2D !== 'undefined' && CanvasRenderingContext2D.prototype?.fillText) {
        const origFillText = CanvasRenderingContext2D.prototype.fillText;
        const self = this;
        CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
          let finalText = text;
          if (self.isEn() && typeof text === 'string') {
            finalText = self.t(text);
          }
          return arguments.length >= 4
            ? origFillText.call(this, finalText, x, y, maxWidth)
            : origFillText.call(this, finalText, x, y);
        };
        this.canvasWrapped = true;
      }

      if (!this.clickHookBound && typeof document !== 'undefined') {
        // Translate values populated dynamically into inputs/textareas by inline preset chips
        document.addEventListener('click', (e) => {
          if (!this.isEn()) return;
          const target = e.target.closest(
            '[data-dec-preset-idx], [data-pivot-preset-idx], [data-pattern-template], .ace-ack-chip, .bus-runner-preset, .bus-runner-protects-chip, #btn-bus-seat-passenger, .pas-arch-btn, .pas-shout-preset, .pas-protects-chip, .pas-detour-chip, [data-therapy-starter], [data-retro-bus]'
          );
          if (!target) return;
          setTimeout(() => {
            if (!this.isEn()) return;
            const fields = document.querySelectorAll(
              '#dec-label, #dec-softened, #dec-context, #piv-pain, #piv-yearning, #piv-action, #pat-title, #pat-trigger, #pat-response, #pat-short, #pat-long, #pat-exp, #ace-ack-input, #bus-runner-name, #bus-runner-shouts, #bus-runner-protects, #bus-driver-script-input, #input-pas-name, #input-pas-shouts, #input-pas-protects, #input-pas-detour, #input-pas-reply, #input-therapy-reflection, #followup-text'
            );
            fields.forEach((el) => {
              if (!el || !el.value) return;
              const trimmed = el.value.trim();
              const translated = translateSentence(trimmed);
              if (translated !== null) {
                el.value = el.id === 'input-therapy-reflection' ? `${translated} ` : translated;
              }
            });
          }, 0);
        }, true);
        this.clickHookBound = true;
      }
    }

    updateDocumentMeta() {
      if (typeof document === 'undefined') return;
      document.documentElement.lang = this.lang;
      document.title = 'Khōra';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          this.isEn()
            ? 'Khōra — Your ACT space. Personal Acceptance & Commitment Therapy toolkit to observe, accept, and act toward your values.'
            : 'Khōra — Tu espacio ACT. Herramienta personal de Terapia de Aceptación y Compromiso para observar, aceptar y actuar hacia tus valores.'
        );
      }
      const badge = document.getElementById('lang-toggle-label');
      if (badge) {
        badge.textContent = this.lang.toUpperCase();
      }
    }

    setLang(nextLang) {
      const normalized = nextLang === 'en' ? 'en' : 'es';
      this.lang = normalized;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(LANG_STORAGE_KEY, normalized);
        }
      } catch {
        // Ignore storage errors
      }

      this.updateDocumentMeta();
      this.syncCatalogs();
      this.localizeExampleDataInState();

      // Re-render open application views cleanly
      if (typeof window !== 'undefined' && window.app) {
        window.app.updateDbStatusBadge?.();
        window.app.updatePersistenceWarningBanner?.();
        if (window.stateManager?.isVaultLocked?.()) {
          window.app.renderPrivacyLockOverlay?.();
        }
        const cur = window.app.currentView || 'guia-inicio';
        const modalWasOpen = document.getElementById('app-modal')?.classList.contains('active');
        const wasSettingsOpen = Boolean(document.getElementById('storage-mode-modal-root'));

        // Re-render all views so hidden sections never retain stale language DOM or pre-split glossary spans
        window.app.renderGuiaInicio?.();
        if (window.perfilApp) {
          window.perfilApp.render?.();
          window.perfilApp.bindEvents?.();
        }
        if (window.brujulaValoresApp) {
          window.brujulaValoresApp.render?.();
          window.brujulaValoresApp.bindEvents?.();
        }
        if (window.espacioActApp) {
          window.espacioActApp.render?.();
          window.espacioActApp.bindEvents?.();
        }
        if (window.pazFalsaApp) {
          window.pazFalsaApp.render?.();
          window.pazFalsaApp.bindEvents?.();
        }
        if (window.pildorasAnclajesApp) {
          window.pildorasAnclajesApp.render?.();
          window.pildorasAnclajesApp.bindEvents?.();
        }
        if (window.radarPatronesApp) {
          window.radarPatronesApp.render?.();
          window.radarPatronesApp.bindEvents?.();
        }
        if (window.insightApp) {
          window.insightApp.render?.();
          window.insightApp.bindEvents?.();
        }

        window.app.renderContextSubnav?.(window.app.currentGroup, cur);
        if (modalWasOpen && wasSettingsOpen) {
          window.app.openSettingsModal?.();
        }
      }

      if (typeof document !== 'undefined' && document.body) {
        this.localizeDOM(document.body);
      }
      if (typeof window !== 'undefined' && window.app?.decorateGlossaryTerms) {
        window.app.decorateGlossaryTerms();
      }
    }

    toggleLang() {
      const next = this.isEn() ? 'es' : 'en';
      this.setLang(next);
      if (typeof window !== 'undefined' && window.app?.showToast) {
        window.app.showToast(next === 'en' ? 'Language: English 🇬🇧' : 'Idioma: Español 🇪🇸');
      }
    }

    backupSpanishCatalogs() {
      if (this.esCatalogBackup) return;
      const clone = (o) => JSON.parse(JSON.stringify(o));
      const gl = typeof globalThis !== 'undefined' ? globalThis : window;

      this.esCatalogBackup = {
        ACT_GLOSSARY: gl.ACT_GLOSSARY ? clone(gl.ACT_GLOSSARY) : null,
        ACT_GLOSSARY_PATTERNS: gl.ACT_GLOSSARY_PATTERNS ? [...gl.ACT_GLOSSARY_PATTERNS] : null,
        navGroups: gl.app?.navGroups ? clone(gl.app.navGroups) : null,
        brujula: gl.brujulaValoresApp ? {
          valuesCatalog: clone(gl.brujulaValoresApp.valuesCatalog),
          situationChips: clone(gl.brujulaValoresApp.situationChips),
          barrierOptions: clone(gl.brujulaValoresApp.barrierOptions),
          actionChips: clone(gl.brujulaValoresApp.actionChips)
        } : null,
        pazFalsa: gl.pazFalsaApp ? {
          situationChips: clone(gl.pazFalsaApp.situationChips),
          wantedChips: clone(gl.pazFalsaApp.wantedChips),
          didChips: clone(gl.pazFalsaApp.didChips)
        } : null,
        radar: gl.radarPatronesApp ? {
          oppositesTemplates: clone(gl.radarPatronesApp.oppositesTemplates)
        } : null,
        espacioAct: gl.espacioActApp ? {
          emotionFamilies: clone(gl.espacioActApp.emotionFamilies)
        } : null,
        perfil: gl.perfilApp ? {
          quickConcernPresets: clone(gl.perfilApp.quickConcernPresets),
          passengerArchetypes: clone(gl.perfilApp.passengerArchetypes),
          domains: clone(gl.perfilApp.domains),
          barriersCatalog: clone(gl.perfilApp.barriersCatalog),
          challengeCategories: clone(gl.perfilApp.challengeCategories),
          hayesLenses: clone(gl.perfilApp.hayesLenses),
          domainSeeds: clone(gl.perfilApp.domainSeeds),
          domainActionHelpers: clone(gl.perfilApp.domainActionHelpers)
        } : null,
        pildoras: gl.pildorasAnclajesApp ? {
          mantras: clone(gl.pildorasAnclajesApp.mantras),
          pills: clone(gl.pildorasAnclajesApp.pills),
          tricksCatalog: clone(gl.pildorasAnclajesApp.tricksCatalog)
        } : null
      };
    }

    syncCatalogs() {
      this.backupSpanishCatalogs();
      const b = this.esCatalogBackup;
      const gl = typeof globalThis !== 'undefined' ? globalThis : window;
      const isEn = this.isEn();

      // 1. ACT_GLOSSARY + ACT_GLOSSARY_PATTERNS
      if (gl.ACT_GLOSSARY && b.ACT_GLOSSARY) {
        Object.keys(b.ACT_GLOSSARY).forEach((k) => {
          const src = isEn && ACT_GLOSSARY_EN[k] ? ACT_GLOSSARY_EN[k] : b.ACT_GLOSSARY[k];
          gl.ACT_GLOSSARY[k] = { ...src };
        });
      }
      if (gl.ACT_GLOSSARY_PATTERNS && b.ACT_GLOSSARY_PATTERNS) {
        const nextPatterns = isEn
          ? [...ACT_GLOSSARY_PATTERNS_EN, ...b.ACT_GLOSSARY_PATTERNS]
          : [...b.ACT_GLOSSARY_PATTERNS];
        gl.ACT_GLOSSARY_PATTERNS.splice(0, gl.ACT_GLOSSARY_PATTERNS.length, ...nextPatterns);
      }

      // 2. AppController navGroups
      if (gl.app?.navGroups && b.navGroups) {
        Object.keys(b.navGroups).forEach((gid) => {
          const srcGroup = b.navGroups[gid];
          const enGroup = isEn ? CATALOGS_EN.navGroups[gid] : null;
          gl.app.navGroups[gid].label = enGroup ? enGroup.label : srcGroup.label;
          gl.app.navGroups[gid].items.forEach((item, idx) => {
            const enItem = enGroup?.items?.find((x) => x.id === item.id);
            item.label = enItem ? enItem.label : srcGroup.items[idx].label;
          });
        });
      }

      // 3. BrujulaValoresApp
      if (gl.brujulaValoresApp && b.brujula) {
        const bv = gl.brujulaValoresApp;
        bv.valuesCatalog.forEach((val, idx) => {
          val.desc = (isEn && CATALOGS_EN.brujula.valuesCatalog[val.id])
            ? CATALOGS_EN.brujula.valuesCatalog[val.id]
            : b.brujula.valuesCatalog[idx].desc;
        });
        bv.situationChips = isEn ? [...CATALOGS_EN.brujula.situationChips] : [...b.brujula.situationChips];
        bv.actionChips = isEn ? [...CATALOGS_EN.brujula.actionChips] : [...b.brujula.actionChips];
        bv.barrierOptions.forEach((opt, idx) => {
          const src = (isEn && CATALOGS_EN.brujula.barrierOptions[opt.id]) || b.brujula.barrierOptions[idx];
          opt.label = src.label;
          opt.motive = src.motive;
          opt.shortVsLong = src.shortVsLong;
          opt.fear = src.fear;
        });
        // Update default untouched form answers if switching language before editing
        const prevEn = CATALOGS_EN.brujula.barrierOptions[bv.selectedBarrierId];
        const prevEs = b.brujula.barrierOptions.find((x) => x.id === bv.selectedBarrierId);
        if (prevEn && prevEs && (bv.formData?.answers?.motive === prevEs.motive || bv.formData?.answers?.motive === prevEn.motive)) {
          const cur = isEn ? prevEn : prevEs;
          bv.formData.answers = { motive: cur.motive, shortVsLong: cur.shortVsLong, fear: cur.fear };
        }
      }

      // 4. PazFalsaApp
      if (gl.pazFalsaApp && b.pazFalsa) {
        const pf = gl.pazFalsaApp;
        pf.situationChips = isEn ? [...CATALOGS_EN.pazFalsa.situationChips] : [...b.pazFalsa.situationChips];
        pf.wantedChips = isEn ? [...CATALOGS_EN.pazFalsa.wantedChips] : [...b.pazFalsa.wantedChips];
        pf.didChips = isEn ? [...CATALOGS_EN.pazFalsa.didChips] : [...b.pazFalsa.didChips];
      }

      // 5. RadarPatronesApp
      if (gl.radarPatronesApp && b.radar) {
        gl.radarPatronesApp.oppositesTemplates = (isEn ? CATALOGS_EN.radarPatrones.oppositesTemplates : b.radar.oppositesTemplates).map((x) => ({ ...x }));
      }

      // 6. EspacioActApp (keep fam.id & nuance.id invariant!)
      if (gl.espacioActApp && b.espacioAct) {
        gl.espacioActApp.emotionFamilies.forEach((fam, fi) => {
          const esFam = b.espacioAct.emotionFamilies[fi];
          const enFam = isEn ? CATALOGS_EN.espacioActFamilies[fam.id] : null;
          fam.label = enFam ? enFam.label : esFam.label;
          fam.desc = enFam ? enFam.desc : esFam.desc;
          fam.nuances.forEach((nu, ni) => {
            const esNu = esFam.nuances[ni];
            const enNu = enFam?.nuances?.[nu.id];
            nu.desc = enNu ? enNu.desc : esNu.desc;
            nu.example = enNu ? enNu.example : esNu.example;
          });
        });
      }

      // 7. PerfilApp
      if (gl.perfilApp && b.perfil) {
        const p = gl.perfilApp;
        const ep = CATALOGS_EN.perfil;
        if (Array.isArray(p.quickConcernPresets)) {
          p.quickConcernPresets = (isEn ? ep.quickConcernPresets : b.perfil.quickConcernPresets).map((x) => ({ ...x }));
        }
        p.passengerArchetypes = (isEn ? ep.passengerArchetypes : b.perfil.passengerArchetypes).map((x) => ({ ...x }));
        p.domains.forEach((dom, idx) => {
          dom.label = isEn && ep.domains[dom.id] ? ep.domains[dom.id] : b.perfil.domains[idx].label;
        });
        if (Array.isArray(p.barriersCatalog)) {
          p.barriersCatalog.forEach((bar, idx) => {
            const src = isEn && ep.barriersCatalog[bar.id] ? ep.barriersCatalog[bar.id] : b.perfil.barriersCatalog[idx];
            bar.label = src.label;
            bar.desc = src.desc;
          });
        }
        p.challengeCategories.forEach((cat, idx) => {
          cat.label = isEn && ep.challengeCategories[cat.id] ? ep.challengeCategories[cat.id] : b.perfil.challengeCategories[idx];
        });
        p.hayesLenses.forEach((lens, idx) => {
          const src = isEn && ep.hayesLenses[lens.id] ? ep.hayesLenses[lens.id] : b.perfil.hayesLenses[idx];
          lens.title = src.title;
          lens.prompt = src.prompt;
          lens.prefix = src.prefix;
        });
        p.domainSeeds = JSON.parse(JSON.stringify(isEn ? ep.domainSeeds : b.perfil.domainSeeds));
        p.domainActionHelpers = JSON.parse(JSON.stringify(isEn ? ep.domainActionHelpers : b.perfil.domainActionHelpers));
      }

      // 8. PildorasAnclajesApp
      if (gl.pildorasAnclajesApp && b.pildoras) {
        const pa = gl.pildorasAnclajesApp;
        const epa = CATALOGS_EN.pildoras;
        pa.mantras.forEach((m, idx) => {
          const src = isEn && epa.mantras[m.id] ? epa.mantras[m.id] : b.pildoras.mantras[idx];
          m.text = src.text;
          m.context = src.context;
        });
        pa.pills.forEach((pill, idx) => {
          const src = isEn && epa.pills[pill.id] ? epa.pills[pill.id] : b.pildoras.pills[idx];
          pill.categoryLabel = src.categoryLabel;
          pill.title = src.title;
          pill.summary = src.summary;
          pill.content = src.content;
        });
        pa.tricksCatalog.forEach((tr, idx) => {
          const src = isEn && epa.tricksCatalog[tr.id] ? epa.tricksCatalog[tr.id] : b.pildoras.tricksCatalog[idx];
          tr.title = src.title;
          tr.intentLabel = src.intentLabel;
          tr.badge = src.badge;
          tr.duration = src.duration;
          tr.desc = src.desc;
        });
      }
    }

    // Losslessly localize seed & demo items in stateManager without altering user-authored edits
    localizeExampleDataInState() {
      const sm = typeof window !== 'undefined' ? window.stateManager : null;
      if (!sm || sm.isVaultLocked?.() || typeof STORAGE_KEYS === 'undefined') return;

      const isEn = this.isEn();
      const applyField = (item, field, esVal, enVal) => {
        if (esVal === undefined || enVal === undefined) return;
        const cur = item[field];
        if (cur === esVal || cur === enVal) {
          item[field] = isEn ? enVal : esVal;
        }
      };

      // Capture Spanish defaults from DEFAULT_ANCHORS if present
      if (typeof DEFAULT_ANCHORS !== 'undefined' && Array.isArray(DEFAULT_ANCHORS)) {
        const anchors = sm.getAnchors?.();
        if (Array.isArray(anchors) && anchors.length > 0) {
          let changed = false;
          anchors.forEach((anc) => {
            const esDef = DEFAULT_ANCHORS.find((a) => a.id === anc.id);
            const enDef = DEFAULT_ANCHORS_EN.find((a) => a.id === anc.id);
            if (!esDef || !enDef) return;
            ['text', 'author', 'category'].forEach((f) => {
              const before = anc[f];
              applyField(anc, f, esDef[f], enDef[f]);
              if (anc[f] !== before) changed = true;
            });
          });
          if (changed) sm.memStore?.set?.(STORAGE_KEYS.ANCHORS, anchors);
        }
      }

      // Profile seeds (coreValues & busPassengers)
      const profile = sm.getProfile?.();
      if (profile) {
        let profChanged = false;
        const esPassengers = sm.getDefaultBusPassengers ? sm.getDefaultBusPassengers() : [];
        if (Array.isArray(profile.busPassengers)) {
          profile.busPassengers.forEach((pas) => {
            const esP = esPassengers.find((x) => x.id === pas.id);
            const enP = DEFAULT_PASSENGERS_EN.find((x) => x.id === pas.id);
            if (!esP || !enP) return;
            ['name', 'shouts', 'protectsFrom', 'detour', 'driverReply'].forEach((f) => {
              const before = pas[f];
              applyField(pas, f, esP[f], enP[f]);
              if (pas[f] !== before) profChanged = true;
            });
          });
        }
        if (Array.isArray(profile.coreValues)) {
          const valSeed = profile.coreValues.find((v) => v.id === 'val_seed_1');
          if (valSeed) {
            const esValSeed = {
              statement: 'Ser una pareja comprensiva y atenta que escucha con ternura pero expresa sus límites con honestidad',
              microAction: 'Escuchar cómo se siente sin interrumpir y expresar con calma cuando necesite descanso',
              willingness: 'Sostener la incomodidad si hay un desacuerdo sin ceder automáticamente por miedo',
              lensUsed: 'Ejemplo guía (Hayes)'
            };
            ['statement', 'microAction', 'willingness', 'lensUsed'].forEach((f) => {
              const before = valSeed[f];
              applyField(valSeed, f, esValSeed[f], SEED_VALUE_EN[f]);
              if (valSeed[f] !== before) profChanged = true;
            });
          }
        }
        if (profChanged) sm.memStore?.set?.(STORAGE_KEYS.PROFILE, profile);
      }

      // Therapy notes seeds & demos
      const notes = sm.getTherapyReflections?.();
      if (Array.isArray(notes) && notes.length > 0) {
        let notesChanged = false;
        const esNotes = {
          ref_seed_1: {
            text: 'Me doy cuenta de que cuando alguien cercano se queda en silencio o cambia el tono, entro automáticamente en alerta y busco explicarme demasiado para recuperar su aprobación, aunque eso me deje agotamiento después.'
          },
          demo_ref_1: {
            text: 'Me doy cuenta de que cuando alguien cercano se queda en silencio o cambia el tono, entro automáticamente en alerta y busco explicarme demasiado para recuperar su aprobación, aunque eso me deje agotamiento después.'
          },
          demo_ref_2: {
            text: 'Esta semana pude decir que no a una tarea extra en el trabajo sin inventar excusas médicas; sentí un nudo fuerte en el estómago y culpa las dos primeras horas, pero luego sentí alivio y coherencia.'
          }
        };
        notes.forEach((n) => {
          const esN = esNotes[n.id];
          const enN = n.id === 'ref_seed_1' ? SEED_REFLECTION_EN : DEMO_ITEMS_EN[n.id];
          if (!esN || !enN) return;
          if (!this.seedEsBackup.has(n.id) && n.text === esN.text) {
            this.seedEsBackup.set(n.id, JSON.parse(JSON.stringify(n)));
          }
          if (n.text === esN.text || n.text === enN.text) {
            n.text = isEn ? enN.text : esN.text;
            if (isEn && enN.clinicalExtract) {
              n.clinicalExtract = JSON.parse(JSON.stringify(enN.clinicalExtract));
            } else if (!isEn && this.seedEsBackup.has(n.id)) {
              n.clinicalExtract = JSON.parse(JSON.stringify(this.seedEsBackup.get(n.id).clinicalExtract));
            } else if (!isEn && sm.analyzeReflectionForTherapist) {
              n.clinicalExtract = sm.analyzeReflectionForTherapist(n.text, n.context, n.category);
            }
            notesChanged = true;
          }
        });
        if (notesChanged) sm.memStore?.set?.(STORAGE_KEYS.THERAPY_NOTES, notes);
      }

      // Seeded Demo items across collections
      const syncCollection = (storageKey, getFn, fieldsBuilder) => {
        const list = getFn?.call(sm);
        if (!Array.isArray(list) || list.length === 0) return;
        let dirty = false;
        list.forEach((item) => {
          const enItem = DEMO_ITEMS_EN[item.id];
          if (!enItem) return;
          if (!this.seedEsBackup.has(item.id)) {
            // Only snapshot if it still looks Spanish
            const snap = JSON.parse(JSON.stringify(item));
            this.seedEsBackup.set(item.id, snap);
          }
          const esSnap = this.seedEsBackup.get(item.id);
          if (!esSnap) return;
          dirty = fieldsBuilder(item, esSnap, enItem, isEn) || dirty;
        });
        if (dirty) sm.memStore?.set?.(storageKey, list);
      };

      syncCollection(STORAGE_KEYS.PAZ_FALSA, sm.getPazFalsaEntries, (it, es, en, enMode) => {
        let ch = false;
        if (it.situation === es.situation || it.situation === en.situation) {
          it.situation = enMode ? en.situation : es.situation;
          it.internalConflict = JSON.parse(JSON.stringify(enMode ? en.internalConflict : es.internalConflict));
          it.note = enMode ? en.note : es.note;
          if (Array.isArray(it.followUpNotes) && it.followUpNotes[0] && es.followUpNotes?.[0] && en.followUpNotes?.[0]) {
            it.followUpNotes[0].text = enMode ? en.followUpNotes[0].text : es.followUpNotes[0].text;
          }
          ch = true;
        }
        return ch;
      });

      syncCollection(STORAGE_KEYS.ACT_CRISIS, sm.getActCrisisEntries, (it, es, en, enMode) => {
        let ch = false;
        if (it.thought === es.thought || it.thought === en.thought) {
          it.thought = enMode ? en.thought : es.thought;
          it.reframedThought = enMode ? en.reframedThought : es.reframedThought;
          it.autopilotUrge = enMode ? en.autopilotUrge : es.autopilotUrge;
          it.committedAction = enMode ? en.committedAction : es.committedAction;
          if (Array.isArray(it.followUpNotes) && it.followUpNotes[0] && es.followUpNotes?.[0] && en.followUpNotes?.[0]) {
            it.followUpNotes[0].text = enMode ? en.followUpNotes[0].text : es.followUpNotes[0].text;
          }
          ch = true;
        }
        return ch;
      });

      syncCollection(STORAGE_KEYS.PATTERNS, sm.getPatterns, (it, es, en, enMode) => {
        if (it.title === es.title || it.title === en.title) {
          it.title = enMode ? en.title : es.title;
          it.loop = JSON.parse(JSON.stringify(enMode ? en.loop : es.loop));
          if (it.weeklyExperiment && en.weeklyExperiment) {
            it.weeklyExperiment.text = enMode ? en.weeklyExperiment.text : es.weeklyExperiment.text;
          }
          if (Array.isArray(it.checkins) && it.checkins[0] && es.checkins?.[0] && en.checkins?.[0]) {
            it.checkins[0].learned = enMode ? en.checkins[0].learned : es.checkins[0].learned;
            it.checkins[0].nextStep = enMode ? en.checkins[0].nextStep : es.checkins[0].nextStep;
          }
          return true;
        }
        return false;
      });

      syncCollection(STORAGE_KEYS.COMPASS, sm.getCompassEntries, (it, es, en, enMode) => {
        if (it.situation === es.situation || it.situation === en.situation) {
          it.situation = enMode ? en.situation : es.situation;
          it.answers = JSON.parse(JSON.stringify(enMode ? en.answers : es.answers));
          it.keyAction = enMode ? en.keyAction : es.keyAction;
          return true;
        }
        return false;
      });

      syncCollection(STORAGE_KEYS.DECONSTRUCT, sm.getDeconstructedStatements, (it, es, en, enMode) => {
        if (it.rigidLabel === es.rigidLabel || it.rigidLabel === en.rigidLabel) {
          it.rigidLabel = enMode ? en.rigidLabel : es.rigidLabel;
          it.softened = enMode ? en.softened : es.softened;
          it.contextualized = enMode ? en.contextualized : es.contextualized;
          return true;
        }
        return false;
      });

      syncCollection(STORAGE_KEYS.PIVOTS, sm.getPivots, (it, es, en, enMode) => {
        if (it.pain === es.pain || it.pain === en.pain) {
          it.pain = enMode ? en.pain : es.pain;
          it.yearning = enMode ? en.yearning : es.yearning;
          it.pivotAction = enMode ? en.pivotAction : es.pivotAction;
          return true;
        }
        return false;
      });
    }

    startObserver() {
      if (typeof MutationObserver === 'undefined' || typeof document === 'undefined' || !document.body) return;
      if (this.observer) this.observer.disconnect();
      this.observer = new MutationObserver((mutations) => {
        if (this.isMutating) return;
        if (!this.isEn()) return;
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (m.type === 'characterData') {
            this.localizeTextNode(m.target);
          } else if (m.type === 'childList') {
            m.addedNodes.forEach((node) => {
              if (node.nodeType === 1) this.localizeDOM(node);
              else if (node.nodeType === 3) this.localizeTextNode(node);
            });
          }
        }
      });
      this.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    localizeTextNode(node) {
      if (!node || node.nodeType !== 3) return;
      const parent = node.parentElement;
      if (parent) {
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
        if (tag === 'TEXTAREA' && !parent.hasAttribute('readonly')) return;
        if (parent.closest && parent.closest('[data-no-i18n="true"]')) return;
      }

      if (node.__i18nOrig === undefined) {
        node.__i18nOrig = node.nodeValue;
      }

      if (!this.isEn()) {
        if (node.nodeValue !== node.__i18nOrig) {
          this.isMutating = true;
          try { node.nodeValue = node.__i18nOrig; } finally { this.isMutating = false; }
        }
        return;
      }

      // Check if an interactive script rewrote textContent in Spanish after first capture
      const currentVal = node.nodeValue;
      const candidate = (currentVal !== node.__i18nLastTranslated) ? currentVal : node.__i18nOrig;
      if (currentVal !== node.__i18nLastTranslated) {
        node.__i18nOrig = currentVal;
      }

      const trimmed = candidate.trim();
      if (!trimmed) return;

      const translated = parent && parent.id === 'therapy-brief-textarea'
        ? translateTherapyBrief(trimmed)
        : translateSentence(trimmed);

      if (translated !== null && translated !== trimmed) {
        const leading = (candidate.match(/^\s*/) || [''])[0];
        const trailing = (candidate.match(/\s*$/) || [''])[0];
        const nextVal = `${leading}${translated}${trailing}`;
        if (node.nodeValue !== nextVal) {
          this.isMutating = true;
          try {
            node.nodeValue = nextVal;
            node.__i18nLastTranslated = nextVal;
          } finally {
            this.isMutating = false;
          }
        }
      }
    }

    localizeAttributes(el) {
      if (!el || el.nodeType !== 1) return;
      const attrs = ['placeholder', 'title', 'aria-label'];
      attrs.forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        const origKey = `data-i18n-orig-${attr}`;
        if (!el.hasAttribute(origKey)) {
          el.setAttribute(origKey, el.getAttribute(attr));
        }
        const origVal = el.getAttribute(origKey);
        if (!this.isEn()) {
          if (el.getAttribute(attr) !== origVal) {
            el.setAttribute(attr, origVal);
          }
          return;
        }
        const translated = translateSentence(origVal);
        if (translated !== null && el.getAttribute(attr) !== translated) {
          el.setAttribute(attr, translated);
        }
      });

      // Translate untouched preset value inside text inputs/textareas (e.g. trick runners)
      if ((el.tagName === 'INPUT' && (el.type === 'text' || !el.type)) || el.tagName === 'TEXTAREA') {
        if (el.id === 'therapy-brief-textarea') {
          const origKey = 'data-i18n-orig-val';
          if (!el.hasAttribute(origKey)) {
            el.setAttribute(origKey, el.value || el.textContent || '');
          }
          const orig = el.getAttribute(origKey);
          const nextBrief = this.isEn() ? translateTherapyBrief(orig) : orig;
          el.value = nextBrief;
          el.textContent = nextBrief;
          return;
        }
        if (el.defaultValue !== undefined && el.value === el.defaultValue) {
          const origKey = 'data-i18n-orig-val';
          if (!el.hasAttribute(origKey)) {
            el.setAttribute(origKey, el.value);
          }
          const orig = el.getAttribute(origKey);
          if (!this.isEn()) {
            if (el.value !== orig) el.value = orig;
          } else {
            const tr = translateSentence(orig);
            if (tr !== null && el.value !== tr) el.value = tr;
          }
        }
      }
    }

    localizeDOM(root) {
      if (!root || typeof document === 'undefined') return;
      if (this.observer) this.observer.disconnect();
      this.isMutating = true;
      try {
        if (root.nodeType === 1) {
          this.localizeAttributes(root);
          root.querySelectorAll('[placeholder], [title], [aria-label], input, textarea').forEach((el) => {
            this.localizeAttributes(el);
          });
        }
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);
        for (let i = 0; i < nodes.length; i++) {
          this.localizeTextNode(nodes[i]);
        }
      } finally {
        this.isMutating = false;
        this.startObserver();
      }
    }
  }

  const i18nInstance = new KhoraI18n();
  if (typeof window !== 'undefined') {
    window.i18n = i18nInstance;
    window.t = (phrase, vars) => i18nInstance.t(phrase, vars);
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.i18n = i18nInstance;
    globalThis.t = (phrase, vars) => i18nInstance.t(phrase, vars);
  }
})();
