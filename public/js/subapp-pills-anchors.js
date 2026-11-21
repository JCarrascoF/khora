/**
 * ECOSISTEMA ACT - Sub-App 6: Píldoras, Anclajes y Botiquín de Trucos Ejecutables
 * Lecturas Rápidas de 1 Minuto, Mantras del Día y Micro-Técnicas Guiadas en Vivo
 */

class PildorasAnclajesApp {
  constructor() {
    this.mode = 'trucos'; // 'trucos' (En Caliente) | 'estudio' (Medio Plazo)
    this.currentTab = 'trucos'; // 'trucos' | 'pildoras' | 'deconstruct' | 'pivot'
    this.activeFilter = 'all'; // For pills
    this.activeTrickGroup = null; // null | 'calm' | 'mind' | 'limits' | 'all'
    this.activeStudyArea = null; // null | 'defusion' | 'limites' | 'aceptacion' | 'presente' | 'all'
    this.activeReadingId = null;
    this.activeWorkshopId = null;
    this.currentMantraIndex = 0;
    this.expandedPillIds = new Set();
    this.showAnchorsList = false;

    // Active trick runner state
    this.activeTrickRunner = null;
    this.trickTimer = null;
    this.trickSecondsLeft = 0;

    this.mantras = [
      {
        id: 'mantra_1',
        text: "No tengo que apagar mi malestar para mantener encendida la comodidad del otro.",
        context: "Límites y Dignidad"
      },
      {
        id: 'mantra_2',
        text: "La paz conseguida a costa de tu dignidad no es paz: es una tregua costosa con tu verdugo interno.",
        context: "Falsa Paz"
      },
      {
        id: 'mantra_3',
        text: "Poner un límite no es un acto de hostilidad; es la condición indispensable para que el vínculo sea real.",
        context: "Relaciones Auténticas"
      },
      {
        id: 'mantra_4',
        text: "Puedes sostener la incomodidad de la reacción ajena. La culpa al decir 'no' es solo el eco de viejos mandatos, no la prueba de que hayas hecho daño.",
        context: "Soberanía Emocional"
      },
      {
        id: 'mantra_5',
        text: "No eres responsable de cómo los demás eligen gestionar su frustración cuando tú te comunicas con serenidad y verdad.",
        context: "Diferenciación"
      },
      {
        id: 'mantra_6',
        text: "Hacer espacio a la incomodidad es el precio de entrada a una vida donde tú también importas.",
        context: "Aceptación ACT"
      }
    ];

    this.pills = [
      {
        id: 'pill_guia_act',
        category: 'fundamentos',
        categoryLabel: 'Fundamentos',
        title: 'Fundamentos de Khōra y ACT',
        summary: 'Por qué aquí no intentamos borrar las emociones difíciles, qué significa hacerles espacio y cómo usar tus valores como brújula.',
        content: `
          <p style="margin-bottom: 12px; line-height: 1.6;">
            Si has entrado en Khōra buscando «trucos para dejar de sentir ansiedad» o «pensar en positivo», esta breve guía te ahorrará mucha frustración.
          </p>
          <p style="margin-bottom: 12px; line-height: 1.6;">
            Esta aplicación se basa en la <strong>Terapia de Aceptación y Compromiso (ACT)</strong>, una corriente psicológica con amplia evidencia científica que propone algo radicalmente distinto al control mental tradicional.
          </p>
          <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-top: 14px; margin-bottom: 6px;">1. Tu mente no tiene botón de borrar</div>
          <p style="margin-bottom: 12px; line-height: 1.6;">
            Intentar <em>no</em> sentir miedo, culpa o tristeza casi siempre los multiplica. Si intentas con todas tus fuerzas no pensar en un oso blanco durante un minuto, lo único en lo que pensarás es en el oso. Aquí no venimos a luchar contra lo que sientes ni a discutir con tu cabeza.
          </p>
          <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-top: 14px; margin-bottom: 6px;">2. Hacer espacio (en lugar de pelear)</div>
          <p style="margin-bottom: 12px; line-height: 1.6;">
            El malestar emocional es incómodo, pero no es peligroso ni significa que estés roto/a. Cuando aprendes a ubicarlo en el cuerpo, ponerle nombre y dejarle un hueco sin salir corriendo a calmarlo, deja de acaparar toda tu energía.
          </p>
          <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-top: 14px; margin-bottom: 6px;">3. Tus valores conducen el autobús</div>
          <p style="margin-bottom: 12px; line-height: 1.6;">
            Tus dudas y miedos viajarán contigo en los asientos traseros, a veces gritando. Pero no tienen manos para girar el volante. La meta no es no tener miedo, sino dar pasos hacia lo que de verdad te importa <em>incluso con el miedo a cuestas</em>.
          </p>
        `
      },
      {
        id: 'pill_1',
        category: 'defusion',
        categoryLabel: 'Defusión',
        title: '¿Qué es la defusión cognitiva y cómo usarla en 30 segundos?',
        readTime: '1 min',
        trickId: 'trick_comic_voice',
        summary: 'Aprende a mirar tus pensamientos como palabras que pasan, en lugar de verdades absolutas que debes obedecer.',
        content: `
          <p style="margin-bottom: 12px; line-height: 1.6;">
            Cuando estamos "fusionados" con la mente, el pensamiento <em>"Si digo que no, me van a rechazar"</em> se siente como una verdad indiscutible. Creemos que el pensamiento y nosotros somos la misma cosa.
          </p>
          <p style="margin-bottom: 12px; line-height: 1.6;">
            <strong>La defusión cognitiva</strong> consiste en dar un paso atrás y observar el pensamiento como lo que verdaderamente es: una serie de sonidos, palabras e imágenes producidas por un órgano evolutivo diseñado para evitar peligros, no para hacerte feliz.
          </p>
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-top: 12px; margin-bottom: 6px;">El truco de los tres prefijos:</div>
          <ul style="padding-left: 20px; line-height: 1.6; margin-bottom: 4px;">
            <li>En lugar de <em>"Soy un cobarde"</em>, di: <strong>"Estoy teniendo el pensamiento de que soy un cobarde"</strong>.</li>
            <li>O mejor aún: <strong>"Me doy cuenta de que mi mente me está contando la historia de que soy un cobarde"</strong>.</li>
            <li>O con compasión: <strong>"Gracias mente por intentar protegerme recordándome ese miedo"</strong>.</li>
          </ul>
        `
      },
      {
        id: 'pill_2',
        category: 'limites',
        categoryLabel: 'Límites',
        title: 'La diferencia entre explicar tu postura y auto-justificar al otro',
        readTime: '1 min',
        trickId: 'trick_serene_silence',
        summary: 'El hábito de hablar de más cuando ponemos un límite es el síntoma de una culpa aprendida.',
        content: `
          <p style="margin-bottom: 12px; line-height: 1.6;">
            ¿Te has descubierto dando 5 minutos de explicaciones médicas, laborales o familiares cuando simplemente no querías ir a un compromiso?
          </p>
          <p style="margin-bottom: 12px; line-height: 1.6;">
            La sobre-explicación nace de la creencia inconsciente de que <strong>tu deseo por sí solo no tiene validez legal</strong>; necesitas que la otra persona "te conceda el permiso" o "te indulte" para poder descansar sin culpa.
          </p>
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-top: 12px; margin-bottom: 6px;">La regla de la sencillez serena:</div>
          <p style="margin-bottom: 4px; line-height: 1.6;">
            Un adulto no pide permiso para sus límites. Un adulto comunica su disponibilidad con cortesía:
            <br><em>"Agradezco la invitación, pero hoy no me es posible. Que lo paséis muy bien."</em>
          </p>
        `
      },
      {
        id: 'pill_3',
        category: 'aceptacion',
        categoryLabel: 'Aceptación',
        title: 'Cómo tolerar la incomodidad de la reacción ajena sin claudicar',
        readTime: '1 min',
        trickId: 'trick_cold_breath',
        summary: 'La mala cara del otro no es una emergencia que tengas que resolver de inmediato.',
        content: `
          <p style="margin-bottom: 12px; line-height: 1.6;">
            Cuando dices 'no' o marcas un límite y el otro suspira, se muestra frío o pone mala cara, tu sistema nervioso entra en alerta roja: <em>"¡Peligro! Hay que arreglar esto ya"</em>. Y casi siempre lo arreglas cediendo o pidiendo perdón.
          </p>
          <p style="margin-bottom: 4px; line-height: 1.6;">
            En ACT, tolerar la reacción ajena significa <strong>hacer espacio a la incomodidad somática</strong>: sentir el nudo en la garganta o el estómago sin correr a complacer para apagarlo.
          </p>
        `
      },
      {
        id: 'pill_4',
        category: 'limites',
        categoryLabel: 'Límites',
        title: 'El coste invisible de la complacencia: El resentimiento diferido',
        readTime: '1 min',
        trickId: 'trick_pause_rescue',
        summary: 'Ceder para mantener la paz no elimina el conflicto: solo lo guarda en tu cuerpo con intereses.',
        content: `
          <p style="margin-bottom: 12px; line-height: 1.6;">
            Cuando acallas lo que piensas para que el otro no se moleste, crees que has evitado un problema. Pero el ser humano no olvida las traiciones contra sí mismo.
          </p>
          <p style="margin-bottom: 4px; line-height: 1.6;">
            Ese malestar no expresado se transmuta en <strong>resentimiento sordo</strong>. Semanas después te descubres frío, distante, sarcástico o perdiendo los estribos por una pequeñez.
          </p>
        `
      },
      {
        id: 'pill_5',
        category: 'aceptacion',
        categoryLabel: 'Aceptación',
        title: 'Dolor limpio frente a Dolor sucio en la Terapia ACT',
        readTime: '1 min',
        trickId: 'trick_two_arrows',
        summary: 'Aprende a distinguir entre el dolor inevitable de vivir y el sufrimiento que añades al luchar contra él.',
        content: `
          <p style="margin-bottom: 12px; line-height: 1.6;">
            <strong>Dolor limpio:</strong> Es la tristeza natural por una pérdida, la culpa refleja momentánea al poner un límite, o el miedo normal ante un reto. Es la vida sucediendo en tu cuerpo.
          </p>
          <p style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Dolor sucio:</strong> Es la rumiación que fabricas para no sentir el dolor limpio: <em>"¿Por qué soy tan débil? ¿Por qué siempre me pasa a mí? No debería sentirme así. Voy a ceder para que se me pase esta angustia."</em>
          </p>
        `
      },
      {
        id: 'pill_6',
        category: 'presente',
        categoryLabel: 'Momento Presente',
        title: 'Echar el Ancla (ACE): Qué hacer cuando te desborda la angustia o el miedo',
        readTime: '1 min',
        trickId: 'trick_drop_anchor',
        summary: 'Por qué intentar suprimir la ansiedad echa gasolina al fuego (evitación experiencial) y cómo estabilizar el barco con Russ Harris.',
        content: `
          <p style="margin-bottom: 12px; line-height: 1.6;">
            En la Terapia de Aceptación y Compromiso (ACT), luchar contra el miedo o intentar borrar la angustia a la fuerza se llama <strong>evitación experiencial</strong>: cuanto más peleas por no sentirla, más alarma dispara tu mente.
          </p>
          <p style="margin-bottom: 12px; line-height: 1.6;">
            El protocolo <strong>ACE</strong> de Russ Harris no busca apagar tus emociones, sino <em>echar el ancla</em> en medio de la tormenta para no ser arrastrado por el piloto automático:
          </p>
          <ul style="padding-left: 20px; line-height: 1.6; margin-bottom: 4px;">
            <li><strong>A — Acknowledge (Reconocer):</strong> Nombra con curiosidad lo que está ocurriendo dentro (<em>"Aquí hay agobio y pensamientos acelerados"</em>).</li>
            <li><strong>C — Come back into your body (Volver al cuerpo):</strong> Empuja los pies contra el suelo, estira suavemente los hombros y exhala lento haciendo espacio alrededor de la sensación.</li>
            <li><strong>E — Engage in the present (Conectar):</strong> Mira 3 cosas y escucha 2 sonidos reales de tu entorno; luego elige un primer paso mínimo con sentido.</li>
          </ul>
        `
      }
    ];

    // Library of Executable Guided Tricks
    this.tricksCatalog = [
      {
        id: 'trick_drop_anchor',
        group: 'calm',
        title: 'Echar el Ancla (ACE)',
        intent: 'panic',
        intentLabel: 'Agobio / Angustia / Miedo',
        badge: 'Estabilización ACT',
        duration: '1 min',
        desc: 'Para picos de angustia, miedo o bloqueo: aterriza en el cuerpo y el presente en 3 pasos.',
        icon: ''
      },
      {
        id: 'trick_somatic_yes',
        group: 'calm',
        title: 'La Postura del «SÍ»',
        intent: 'cold',
        intentLabel: 'Postura de Apertura',
        badge: 'Regulación Corporal',
        duration: '45 seg',
        desc: 'Suelta hombros, mandíbula y tensión física antes de hablar o sostener un límite.',
        icon: ''
      },
      {
        id: 'trick_comic_voice',
        group: 'mind',
        title: 'Voz de dibujos y 3 prefijos',
        intent: 'rumination',
        intentLabel: 'Desactivar Rumiación',
        badge: 'Defusión Inmediata',
        duration: '30 seg',
        desc: 'Quita drama y autoridad a un pensamiento catastrófico o repetitivo.',
        icon: ''
      },
      {
        id: 'trick_bus_driver',
        group: 'mind',
        title: 'El Autobús ACT: negar el volante',
        intent: 'rumination',
        intentLabel: 'Control del Volante',
        badge: 'Metáfora de Hayes',
        duration: '1 min',
        desc: 'Da asiento atrás al miedo o la culpa sin cederles la dirección.',
        icon: ''
      },
      {
        id: 'trick_two_arrows',
        group: 'mind',
        title: 'Las Dos Flechas',
        intent: 'guilt',
        intentLabel: 'Disolver Culpa',
        badge: 'Aceptación Limpia',
        duration: '1 min',
        desc: 'Separa la incomodidad normal del auto-castigo y descarta la culpa extra.',
        icon: ''
      },
      {
        id: 'trick_serene_silence',
        group: 'limits',
        title: 'Decir «no» sin justificarte',
        intent: 'no',
        intentLabel: 'Decir NO',
        badge: 'Límites Limpios',
        duration: '1 min',
        desc: 'Elige una respuesta limpia sin excusas y sostén 15 segundos de silencio.',
        icon: ''
      },
      {
        id: 'trick_pause_rescue',
        group: 'limits',
        title: 'Pausa de Contención',
        intent: 'rescue',
        intentLabel: 'Impulso de Rescate',
        badge: 'Auto-contención',
        duration: '2 min',
        desc: 'Frena el impulso automático de resolverle la vida al otro antes de actuar.',
        icon: ''
      },
      {
        id: 'trick_cold_breath',
        group: 'limits',
        title: 'Sostener la frialdad ajena',
        intent: 'cold',
        intentLabel: 'Mala cara ajena',
        badge: 'Soberanía Somática',
        duration: '1 min',
        desc: '3 alientos para no correr a complacer ante una mala cara o distancia.',
        icon: ''
      }
    ];

    this.trickGroups = [
      {
        id: 'calm',
        tabLabel: 'Cuerpo y calma',
        title: 'Agobio, miedo o tensión física',
        subtitle: 'Bajar revoluciones, aterrizar en el cuerpo y estabilizarte.',
        trickIds: ['trick_drop_anchor', 'trick_somatic_yes']
      },
      {
        id: 'mind',
        tabLabel: 'Mente y culpa',
        title: 'Cabeza a mil, miedos o culpa',
        subtitle: 'Quitar fuerza a pensamientos en bucle, recuperar el volante o soltar el auto-castigo.',
        trickIds: ['trick_comic_voice', 'trick_bus_driver', 'trick_two_arrows']
      },
      {
        id: 'limits',
        tabLabel: 'Límites y el otro',
        title: 'Decir «no» o sostener mala cara',
        subtitle: 'Poner un límite sin justificarte, pausar el impulso de rescate o tolerar la distancia ajena.',
        trickIds: ['trick_serene_silence', 'trick_pause_rescue', 'trick_cold_breath']
      }
    ];

    this.studyAreas = [
      {
        id: 'defusion',
        icon:'',
        title: 'Defusión Cognitiva',
        tabLabel: 'Defusión',
        subtitle: 'Tomar distancia de pensamientos rígidos y etiquetas («soy…»).',
        actDefinition: 'En ACT, la defusión cognitiva es la habilidad de observar tus pensamientos como eventos mentales pasajeros —palabras o imágenes que genera la mente— en lugar de verdades literales u órdenes que tengas que obedecer.',
        trickIds: ['trick_comic_voice', 'trick_bus_driver'],
        workshops: [
          { id:'deconstruct', icon:'', title:'El Deconstructor del "Yo Soy"', duration:'1 min', badge:'Taller interactivo' }
        ]
      },
      {
        id: 'limites',
        icon:'',
        title: 'Límites y Soberanía',
        tabLabel: 'Límites',
        subtitle: 'Decir «no» sin sobre-explicarte y frenar el impulso de rescate.',
        actDefinition: 'En ACT, poner límites nace de la acción comprometida con tus valores: elegir cómo quieres actuar por dignidad y cuidado, aceptando la incomodidad que pueda generar en el otro sin intentar controlarla.',
        trickIds: ['trick_serene_silence', 'trick_pause_rescue'],
        workshops: [
          { id:'pivot', icon:'', title:'El Pivote: Del Dolor al Anhelo', duration:'1 min', badge:'Taller interactivo' }
        ]
      },
      {
        id: 'aceptacion',
        icon:'',
        title: 'Aceptación y Compasión',
        tabLabel: 'Aceptación',
        subtitle: 'Sostener la incomodidad ajena y soltar el dolor sucio de culpa.',
        actDefinition: 'En ACT, la aceptación no es resignación ni pasividad: es abrir espacio intencionadamente a las emociones o sensaciones difíciles sin luchar contra ellas, para no añadir sufrimiento innecesario.',
        trickIds: ['trick_cold_breath', 'trick_two_arrows', 'trick_somatic_yes'],
        workshops: [
          { id:'pivot', icon:'', title:'El Pivote: Del Dolor al Anhelo', duration:'1 min', badge:'Taller interactivo' }
        ]
      },
      {
        id: 'presente',
        icon:'',
        title: 'Momento Presente y Regulación',
        tabLabel: 'Presente',
        subtitle: 'Echar el ancla en medio de la tormenta y regular la postura corporal.',
        actDefinition: 'En ACT, el contacto con el momento presente consiste en traer la atención con flexibilidad al aquí y ahora —tu respiración, tu cuerpo y tu entorno— como ancla estable antes de responder.',
        trickIds: ['trick_drop_anchor', 'trick_somatic_yes'],
        workshops: []
      }
    ];
  }

  init() {
    this.render();
    this.bindEvents();
  }

  nextMantra() {
    const anchors = window.stateManager?.getAnchors?.() || [];
    const total = anchors.length || 1;
    this.currentMantraIndex = (this.currentMantraIndex + 1) % total;
    this.render();
    this.bindEvents();
  }

  render() {
    const container = document.getElementById('pildoras-anclajes-view');
    if (!container) return;

    if (this.mode === 'trucos') {
      container.innerHTML = `
        <div id="pildoras-dynamic-body">
          ${this.renderTricksHubView()}
        </div>
      `;
      return;
    }

    if (this.currentTab === 'trucos' || this.currentTab === 'posture') {
      this.currentTab = 'pildoras';
    }

    container.innerHTML = `
      <div id="pildoras-dynamic-body" style="display: flex; flex-direction: column; gap: 16px;">
        ${this.renderPillListView()}
      </div>
    `;
  }

  renderCurrentSubtab() {
    if (this.mode === 'trucos' || this.currentTab === 'trucos') {
      return this.renderTricksHubView();
    } else if (this.currentTab === 'deconstruct') {
      return this.renderDeconstructView();
    } else if (this.currentTab === 'pivot') {
      return this.renderPivotView();
    }
    return this.renderPillListView();
  }

  // -------------------------------------------------------------
  // TAB: BOTIQUÍN DE TRUCOS EJECUTABLES (ACT Live Runner Hub)
  // -------------------------------------------------------------
  renderTricksHubView() {
    const validGroupIds = this.trickGroups.map(g => g.id);
    const activeGroup = (this.activeTrickGroup === 'all' || validGroupIds.includes(this.activeTrickGroup))
      ? this.activeTrickGroup
      : null;
    const totalTricks = this.tricksCatalog.length;

    const getGroupTricks = (group) => group.trickIds
      .map(id => this.tricksCatalog.find(t => t.id === id))
      .filter(Boolean);

    const renderTrickRow = (trick) => `
      <button type="button" class="toolkit-row" data-launch-trick-id="${trick.id}">
        <div class="toolkit-row-body">
          <div class="toolkit-row-head">
            <span class="toolkit-row-title">${trick.title}</span>
          </div>
          <p class="triage-card-desc">${trick.desc}</p>
        </div>
        <span class="toolkit-row-cta" aria-hidden="true">Empezar →</span>
      </button>
    `;

    if (activeGroup === null) {
      return `
        <div class="view-plain-shell">
          <div class="cozy-home-header toolkit-header">
            <div class="title-with-help">
              <h2 class="card-title" style="margin: 0;">Botiquín</h2>
              <button type="button" class="help-info-trigger" data-help-topic="pildoras-trucos" aria-label="Información de esta herramienta">ⓘ</button>
            </div>
            <p class="cozy-home-sub">Elige lo que más se parezca a este momento para ver 2 o 3 ejercicios breves.</p>
          </div>

          <div>
            <div class="cozy-section-label">¿Qué necesitas ahora mismo?</div>
            <div class="guided-triage-grid toolkit-doors-list">
              ${this.trickGroups.map(group => {
                const count = getGroupTricks(group).length;
                return `
                  <button type="button" class="triage-card toolkit-door-card" data-trick-group="${group.id}">
                    <div class="triage-card-body">
                      <div class="triage-card-top">
                        <span class="triage-card-title">${group.title}</span>
                        <span class="toolkit-door-count">${count} ${count === 1 ? 'ejercicio' : 'ejercicios'}</span>
                      </div>
                      <p class="triage-card-desc">${group.subtitle}</p>
                    </div>
                    <span class="triage-card-arrow" aria-hidden="true">→</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="toolkit-all-footer">
            <button type="button" class="btn-inline-link toolkit-show-all-btn" data-trick-group="all">
              Ver los ${totalTricks} ejercicios en lista →
            </button>
          </div>
        </div>
      `;
    }

    const currentGroup = this.trickGroups.find(g => g.id === activeGroup) || null;

    return `
      <div class="view-plain-shell">
        <div class="toolkit-header toolkit-header-compact">
          <div class="flex-between" style="flex-wrap: wrap; gap: 8px 16px;">
            <div class="title-with-help">
              <h2 class="card-title" style="margin: 0;">Botiquín</h2>
              <button type="button" class="help-info-trigger" data-help-topic="pildoras-trucos" aria-label="Información de esta herramienta">ⓘ</button>
            </div>
            <button type="button" class="btn-inline-link toolkit-back-btn" data-trick-group="">
              ← Elegir situación
            </button>
          </div>
        </div>

        <div class="internal-tabs-bar toolkit-tabs-bar" role="tablist" aria-label="Situaciones del botiquín">
          ${this.trickGroups.map(group => `
            <button type="button" role="tab" aria-selected="${activeGroup === group.id ? 'true' : 'false'}" class="internal-tab-btn ${activeGroup === group.id ? 'active' : ''}" data-trick-group="${group.id}">
              ${group.tabLabel}
            </button>
          `).join('')}
          <button type="button" role="tab" aria-selected="${activeGroup === 'all' ? 'true' : 'false'}" class="internal-tab-btn ${activeGroup === 'all' ? 'active' : ''}" data-trick-group="all">
            Todos (${totalTricks})
          </button>
        </div>

        ${activeGroup === 'all' ? `
          <p class="toolkit-group-lead explanatory-subtext">Los ${totalTricks} ejercicios breves ordenados por situación.</p>
          <div class="toolkit-all-groups">
            ${this.trickGroups.map(group => {
              const groupTricks = getGroupTricks(group);
              if (groupTricks.length === 0) return '';
              return `
                <section class="toolkit-all-section">
                  <div class="cozy-section-label">${group.tabLabel}</div>
                  <div class="toolkit-list">
                    ${groupTricks.map(renderTrickRow).join('')}
                  </div>
                </section>
              `;
            }).join('')}
          </div>
        ` : `
          <p class="toolkit-group-lead explanatory-subtext">${currentGroup.subtitle}</p>
          <div class="toolkit-list">
            ${getGroupTricks(currentGroup).map(renderTrickRow).join('')}
          </div>
        `}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // TAB: LECTURAS Y CONCEPTOS ACT (ÍNDICE EDITORIAL + SUPERFICIE)
  // -------------------------------------------------------------
  renderPillListView() {
    if (this.activeReadingId) {
      return this.renderReadingSurfaceView(this.activeReadingId);
    }
    if (this.activeWorkshopId) {
      return this.renderWorkshopSurfaceView(this.activeWorkshopId);
    }

    const favorites = window.stateManager.getPillFavorites();
    const foundationsPill = this.pills.find(p => p.id === 'pill_guia_act');
    const seenWorkshops = new Set();

    const renderIndexReading = (p) => {
      const isFav = favorites.includes(p.id);
      return `
        <button type="button" class="study-index-item" data-open-reading="${p.id}">
          <span class="study-index-item-title">
            ${p.title}${isFav ? ' <span style="color: #b86b59; font-size: 0.82rem;" title="Guardado en favoritos">♥</span>' : ''}
          </span>
          <span class="study-index-arrow" aria-hidden="true">→</span>
        </button>
      `;
    };

    const renderIndexWorkshop = (w) => `
      <button type="button" class="study-index-item" data-open-workshop="${w.id}">
        <span class="study-index-item-title">
          ${w.title}<span class="study-index-badge">Taller</span>
        </span>
        <span class="study-index-arrow" aria-hidden="true">→</span>
      </button>
    `;

    return `
      <div class="view-plain-shell">
        <div class="card-header flex-between" style="margin-bottom: 18px;">
          <div>
            <div class="title-with-help">
              <h2 class="card-title" style="margin: 0;">Lecturas y Conceptos ACT</h2>
              <button type="button" class="help-info-trigger" data-help-topic="miniguias-bolsillo" aria-label="Información de esta herramienta">ⓘ</button>
            </div>
            <p class="card-subtitle">Índice de lecturas breves y talleres para momentos de calma.</p>
          </div>
        </div>

        <div class="study-index-groups">
          ${foundationsPill ? `
            <section class="study-index-group">
              <div class="cozy-section-label">Inicio</div>
              <div class="study-index-list">
                ${renderIndexReading(foundationsPill)}
              </div>
            </section>
          ` : ''}

          ${this.studyAreas.map(area => {
            const areaPills = this.pills.filter(p => p.category === area.id);
            const workshops = (area.workshops || []).filter(w => {
              if (seenWorkshops.has(w.id)) return false;
              seenWorkshops.add(w.id);
              return true;
            });
            if (areaPills.length === 0 && workshops.length === 0) return '';
            return `
              <section class="study-index-group">
                <div class="cozy-section-label">${area.title}</div>
                <p class="study-index-sub explanatory-subtext">${area.subtitle}</p>
                <div class="study-index-list">
                  ${areaPills.map(renderIndexReading).join('')}
                  ${workshops.map(renderIndexWorkshop).join('')}
                </div>
              </section>
            `;
          }).join('')}
        </div>

        <div class="toolkit-all-footer" style="margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
          <button type="button" class="btn-inline-link" id="btn-study-go-botiquin" style="font-size: 0.84rem;">
            Practicar trucos rápidos en el Botiquín →
          </button>
        </div>
      </div>
    `;
  }

  renderReadingSurfaceView(pillId) {
    const pill = this.pills.find(p => p.id === pillId);
    if (!pill) {
      this.activeReadingId = null;
      return this.renderPillListView();
    }

    const favorites = window.stateManager.getPillFavorites();
    const isFav = favorites.includes(pill.id);
    const area = this.studyAreas.find(a => a.id === pill.category) || null;
    const relatedWorkshop = area?.workshops?.[0] || null;

    return `
      <div class="view-plain-shell">
        <div class="toolkit-header toolkit-header-compact" style="margin-bottom: 18px;">
          <div class="flex-between" style="flex-wrap: wrap; gap: 10px 16px;">
            <button type="button" class="btn-inline-link toolkit-back-btn" id="btn-reading-back">
              ← Volver a Lecturas y Ejercicios
            </button>
            <button type="button" class="btn-secondary" data-toggle-fav="${pill.id}" style="font-size: 0.8rem; padding: 6px 12px; color: ${isFav ? '#b86b59' : 'var(--text-secondary)'};">
              ${isFav ? '♥ Guardado' : '♡ Guardar lectura'}
            </button>
          </div>
        </div>

        <article>
          <div style="margin-bottom: 10px;">
            <span class="cozy-meta-tag">${pill.categoryLabel}</span>
          </div>
          <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); margin: 0 0 18px; line-height: 1.3;">
            ${pill.title}
          </h2>

          <div class="study-reading-body" style="color: var(--text-primary); font-size: 0.96rem; line-height: 1.7;">
            ${pill.content}
          </div>
        </article>

        ${(relatedWorkshop || pill.trickId) ? `
          <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <div class="cozy-section-label" style="margin-bottom: 10px;">Llevarlo a la práctica</div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              ${relatedWorkshop ? `
                <button type="button" class="btn-secondary" data-open-workshop="${relatedWorkshop.id}" style="font-size: 0.84rem;">
                  Abrir taller: ${relatedWorkshop.title} →
                </button>
              ` : ''}
              ${pill.trickId ? `
                <button type="button" class="btn-secondary" data-launch-trick-id="${pill.trickId}" style="font-size: 0.84rem;">
                  Practicar en el Botiquín →
                </button>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <div class="toolkit-all-footer" style="margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
          <button type="button" class="btn-inline-link" id="btn-reading-back-bottom">
            ← Volver a Lecturas y Ejercicios
          </button>
        </div>
      </div>
    `;
  }

  renderWorkshopSurfaceView(workshopId) {
    const innerHtml = workshopId === 'deconstruct'
      ? this.renderDeconstructView()
      : this.renderPivotView();

    return `
      <div class="view-plain-shell">
        <div class="toolkit-header toolkit-header-compact" style="margin-bottom: 16px;">
          <button type="button" class="btn-inline-link toolkit-back-btn" id="btn-workshop-back">
            ← Volver a Lecturas y Ejercicios
          </button>
        </div>
        ${innerHtml}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // TAB: DECONSTRUCTOR DEL "YO SOY"
  // -------------------------------------------------------------
  renderDeconstructView() {
    const savedItems = window.stateManager.getDeconstructedStatements();
    const deconstructPresets = [
      {
        label: 'Soy demasiado blando/a',
        softened: 'Tengo el pensamiento automático de que soy demasiado blando/a',
        context: 'Cuando alguien insiste y yo cedo para evitar un conflicto, noto presión en el pecho y miedo al rechazo.'
      },
      {
        label: 'Soy incapaz de decir que no',
        softened: 'Mi mente me repite la historia de que no sé decir que no',
        context: 'Cuando me piden algo urgente con mala cara y digo «sí» en automático, luego siento agotamiento y rabia.'
      },
      {
        label: 'Soy egoísta si miro por mí',
        softened: 'Aparece el pensamiento de que soy egoísta cuando cuido mi descanso',
        context: 'Cuando priorizo descansar frente a un plan ajeno, noto culpa física en el estómago aunque mi límite sea sano.'
      },
      {
        label: 'Soy culpable de que el otro se enfade',
        softened: 'Estoy teniendo la creencia de que la emoción del otro depende de mí',
        context: 'Cuando el otro se muestra frío o serio tras escuchar mi opinión, entro en alerta y busco explicarme de más.'
      }
    ];

    return `
      <div class="view-plain-shell">
        <div class="card-header" style="margin-bottom: 12px;">
          <div class="title-with-help">
<h2 class="card-title" style="margin: 0;">El Deconstructor del "Yo Soy"</h2>
            <button type="button" class="help-info-trigger" data-help-topic="deconstructor-pivote" aria-label="Información de esta herramienta">ⓘ</button>
          </div>
          <p class="card-subtitle">Desmonta una etiqueta fija en una conducta concreta y modificable.</p>
        </div>

        <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <div class="form-group">
            <label class="form-label" for="dec-label">1. Etiqueta rígida ("Yo soy...")</label>
            <input type="text" id="dec-label" class="form-input mt-1" placeholder="Escribe la etiqueta fija que te dices...">
          </div>

          <div class="form-group">
            <label class="form-label" for="dec-softened">2. Tomar distancia (Defusión)</label>
            <input type="text" id="dec-softened" class="form-input mt-1" placeholder="Tengo el pensamiento de que...">
          </div>

          <div class="form-group">
            <label class="form-label" for="dec-context">3. En contexto real (Situación + Conducta + Sensación)</label>
            <textarea id="dec-context" class="form-textarea mt-1" rows="2" style="min-height: 68px;" placeholder="Cuando pasa X y hago Y, entonces siento Z..."></textarea>
          </div>

          <div style="margin-bottom: 12px;">
            <button type="button" class="btn-inline-link" id="btn-dec-toggle-examples" style="font-size: 0.78rem;">
              ¿Bloqueado? Ver ejemplos
            </button>
            <div class="quick-chips-row hidden" id="dec-examples-row" style="margin-top: 8px;">
              ${deconstructPresets.map((p, idx) => `
                <button type="button" class="quick-fill-chip" data-dec-preset-idx="${idx}">
"${p.label}"
                </button>
              `).join('')}
            </div>
          </div>

          <button type="button" class="btn-primary" id="btn-save-deconstruct" style="width: 100%;">
            Guardar Deconstrucción
          </button>
        </div>

        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 12px;">Etiquetas Desmontadas (${savedItems.length})</h3>
        ${savedItems.length === 0 ? `
          <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 0.86rem;">
            Aún no has desmontado ninguna etiqueta. Toca un ejemplo arriba para probar en 30 segundos.
          </div>
        ` : savedItems.map(item => `
          <div class="history-item" style="border-left: 4px solid var(--sage-500);">
            <div class="flex-between" style="gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">Etiqueta original:</div>
              ${window.stateManager?.isExampleItem?.(item) ? '<span class="badge example-item-badge">Ejemplo guía</span>' : ''}
            </div>
            <div style="font-size: 0.95rem; font-weight: 700; text-decoration: line-through; color: var(--accent-tension); margin-bottom: 6px;">
              "${item.rigidLabel}"
            </div>
            <div style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.5;">
              <strong>Realidad en contexto:</strong> "${item.contextualized || item.softened}"
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // TAB: EL PIVOTE
  // -------------------------------------------------------------
  renderPivotView() {
    const savedPivots = window.stateManager.getPivots();
    const pivotPresets = [
      {
        chip: 'Miedo al enfado → Vínculo seguro',
        pain: 'Temo que si pongo un límite se enfaden conmigo o se enfríe la relación.',
        yearning: 'Anhelo una relación cercana, honesta y segura donde ambos podamos expresarnos sin miedo.',
        action: 'Hablar desde el cariño y con firmeza: «Me importas y quiero estar bien contigo, por eso hoy necesito cuidar esto».'
      },
      {
        chip: 'Culpa al descansar → Autocuidado',
        pain: 'Me da culpa parar y decir que hoy no llego a todo.',
        yearning: 'Anhelo tratarme con respeto y tener energía real para lo que de verdad importa.',
        action: 'Cerrar a tiempo hoy sin pedir perdón en exceso, sosteniendo el cosquilleo de culpa.'
      },
      {
        chip: 'Agobio por exigencias → Autonomía',
        pain: 'Me saturo asumiendo cargas que otros me pasan con urgencia.',
        yearning: 'Anhelo elegir mis prioridades con calma y llevar el timón de mi tiempo.',
        action: 'Responder: «Puedo revisarlo mañana o repriorizar lo que ya tengo en marcha».'
      }
    ];

    return `
      <div class="view-plain-shell">
        <div class="card-header" style="margin-bottom: 12px;">
          <div class="title-with-help">
<h2 class="card-title" style="margin: 0;">El Pivote: Del Dolor al Anhelo</h2>
            <button type="button" class="help-info-trigger" data-help-topic="el-pivote" aria-label="Información de esta herramienta">ⓘ</button>
          </div>
          <p class="card-subtitle">Detrás de cada miedo hay algo legítimo que te importa. Cuídalo con dignidad, no con sumisión.</p>
        </div>

        <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <div class="form-group">
            <label class="form-label" for="piv-pain">1. ¿Qué te duele o qué temes?</label>
            <textarea id="piv-pain" class="form-textarea mt-1" rows="2" style="min-height: 62px;" placeholder="Describe qué te duele o qué temes..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="piv-yearning">2. ¿Qué anhelo legítimo hay debajo?</label>
            <textarea id="piv-yearning" class="form-textarea mt-1" rows="2" style="min-height: 62px;" placeholder="Qué valor o necesidad real buscas cuidar..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="piv-action">3. El Pivote: ¿Cómo lo cuidas con dignidad?</label>
            <textarea id="piv-action" class="form-textarea mt-1" rows="2" style="min-height: 62px;" placeholder="Una frase o gesto amable pero firme..."></textarea>
          </div>

          <div style="margin-bottom: 12px;">
            <button type="button" class="btn-inline-link" id="btn-pivot-toggle-examples" style="font-size: 0.78rem;">
              ¿Bloqueado? Ver ejemplos
            </button>
            <div class="quick-chips-row hidden" id="pivot-examples-row" style="margin-top: 8px;">
              ${pivotPresets.map((p, idx) => `
                <button type="button" class="quick-fill-chip" data-pivot-preset-idx="${idx}">
                  ${p.chip}
                </button>
              `).join('')}
            </div>
          </div>

          <button type="button" class="btn-primary" id="btn-save-pivot" style="width: 100%;">
            Fijar este Pivote
          </button>
        </div>

        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 12px;">Pivotes Registrados (${savedPivots.length})</h3>
        ${savedPivots.length === 0 ? `
          <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 0.86rem;">
            Aún no has guardado ningún pivote. Toca un ejemplo arriba para adaptarlo rápido.
          </div>
        ` : savedPivots.map(piv => `
          <div class="history-item" style="border-left: 4px solid var(--accent-warmth);">
            <div class="flex-between" style="gap: 8px; margin-bottom: 2px; flex-wrap: wrap;">
              <div style="font-size: 0.75rem; color: var(--accent-tension); font-weight: 700;">
                Dolor / Temor: "${piv.pain}"
              </div>
              ${window.stateManager?.isExampleItem?.(piv) ? '<span class="badge example-item-badge">Ejemplo guía</span>' : ''}
            </div>
            <div style="font-size: 0.85rem; color: var(--sage-700); font-weight: 600; margin-bottom: 4px;">
              Anhelo:"${piv.yearning}"
            </div>
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
              Acción: "${piv.pivotAction}"
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // THE INTERACTIVE LIVE TRICK RUNNER ENGINE
  // -------------------------------------------------------------
  launchTrickRunner(trickId, options = {}) {
    const trick = this.tricksCatalog.find(t => t.id === trickId);
    if (!trick) return;

    this.stopTrickTimer();
    const surfaceContainer = document.getElementById('pildoras-anclajes-view');
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    const target = surfaceContainer || modalBody;
    if (!target) return;

    if (surfaceContainer && window.app?.currentView !== 'pildoras-trucos' && window.app?.navigate) {
      window.app.navigate('pildoras-trucos', { updateHash: false });
    }

    if (trickId === 'trick_drop_anchor') {
      this.runTrickDropAnchor(target);
    } else if (trickId === 'trick_bus_driver') {
      this.runTrickBusDriver(target, options);
    } else if (trickId === 'trick_serene_silence') {
      this.runTrickSereneSilence(target);
    } else if (trickId === 'trick_comic_voice') {
      this.runTrickComicVoice(target);
    } else if (trickId === 'trick_cold_breath') {
      this.runTrickColdBreath(target);
    } else if (trickId === 'trick_two_arrows') {
      this.runTrickTwoArrows(target);
    } else if (trickId === 'trick_pause_rescue') {
      this.runTrickPauseRescue(target);
    } else if (trickId === 'trick_somatic_yes') {
      this.runTrickSomaticYes(target);
    }

    if (surfaceContainer) {
      window.KhoraUtils?.scrollToTop?.();
    } else if (window.app?.openModal) {
      const modalSize = trickId === 'trick_bus_driver' ? 'medium' : 'wide';
      window.app.openModal(modalSize);
    } else if (modal) {
      modal.classList.add('active');
    }
  }

  stopTrickTimer() {
    if (this.trickTimer) {
      clearInterval(this.trickTimer);
      this.trickTimer = null;
    }
  }

  closeAppModal() {
    this.stopTrickTimer();
    const surfaceContainer = document.getElementById('pildoras-anclajes-view');
    if (surfaceContainer) {
      this.render();
      this.bindEvents();
      return;
    }
    if (window.app?.closeModal) {
      window.app.closeModal();
    } else {
      document.getElementById('app-modal')?.classList.remove('active');
    }
  }

  // 0. TRICK RUNNER: ECHAR EL ANCLA (PROTOCOLO ACE DE RUSS HARRIS)
  runTrickDropAnchor(container) {
    const ackChips = [
      'Agobio / saturación',
      'Miedo o ansiedad física',
      'Presión en pecho / estómago',
      'Pensamientos acelerados',
      'Impulso de huir o ceder'
    ];

    container.innerHTML = `
      <div class="trick-runner-container">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Protocolo ACE • Russ Harris</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

<h3 class="card-title mt-2">Echar el Ancla en la Tormenta (ACE)</h3>
        <p class="card-subtitle">No es para borrar la ola emocional, sino para sujetar el barco y recuperar el control de tus manos y tus pies.</p>

        <!-- Fase A: Acknowledge -->
        <div class="trick-step-card mt-4">
          <label class="form-label">A — Acknowledge (Reconocer sin luchar)</label>
          <p class="form-hint" style="margin-bottom: 8px;">Nombra con curiosidad qué hay dentro ahora mismo (reconocer no es rendirse ni pelear):</p>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
            ${ackChips.map(ch => `
              <button type="button" class="badge ace-ack-chip" data-ace-ack="${ch}"
                      style="cursor: pointer; padding: 5px 10px; font-size: 0.76rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-secondary);">
                + ${ch}
              </button>
            `).join('')}
          </div>
          <input type="text" id="ace-ack-input" class="form-input" style="font-size: 0.85rem; padding: 8px 12px;"
                 value="Reconozco con curiosidad que aquí dentro hay agobio y pensamientos acelerados.">
        </div>

        <!-- Fase C: Come back into your body -->
        <div class="trick-step-card" style="border-left-color: var(--accent-warmth);">
          <label class="form-label">C — Come back into your body (Volver al cuerpo físico)</label>
          <p class="form-hint" style="margin-bottom: 8px;">Marca cada micro-gesto físico conforme lo realizas:</p>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label class="btn-secondary" style="font-size: 0.82rem; justify-content: flex-start; text-align: left; padding: 9px 12px; cursor: pointer;">
              <input type="checkbox" class="ace-body-chk" style="width: 16px; height: 16px; flex-shrink: 0;">
<span>Empujar suavemente las plantas de los pies contra el suelo y sentir su firmeza</span>
            </label>
            <label class="btn-secondary" style="font-size: 0.82rem; justify-content: flex-start; text-align: left; padding: 9px 12px; cursor: pointer;">
              <input type="checkbox" class="ace-body-chk" style="width: 16px; height: 16px; flex-shrink: 0;">
<span>Juntar las palmas o estirar los dedos y soltar los hombros hacia abajo</span>
            </label>
            <div style="display: flex; flex-direction: column; gap: 6px; background: var(--bg-surface); padding: 9px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; cursor: pointer;">
                <input type="checkbox" class="ace-body-chk" id="ace-chk-breath" style="width: 16px; height: 16px; flex-shrink: 0;">
<span>Hacer una exhalación lenta de 6 segundos abriendo espacio alrededor de la sensación</span>
              </label>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="btn-secondary" id="btn-ace-exhale-pulse" style="font-size: 0.76rem; padding: 5px 12px; border-color: var(--sage-400);">
                  Guiar exhalación de 6s
                </button>
                <span id="ace-exhale-status" style="font-size: 0.78rem; font-weight: 700; color: var(--sage-700);"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fase E: Engage in the present -->
        <div class="trick-step-card" style="border-left-color: var(--sage-600);">
          <label class="form-label">E — Engage in the present (Conectar con el aquí y ahora: 3-2-1)</label>
          <p class="form-hint" style="margin-bottom: 8px;">Mira alrededor y ancla tu atención al mundo físico presente:</p>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <input type="text" id="ace-see-3" class="form-input" style="font-size: 0.84rem; padding: 8px 12px;"
                   placeholder="3 cosas reales que veo ahora mismo en esta habitación o lugar...">
            <input type="text" id="ace-hear-2" class="form-input" style="font-size: 0.84rem; padding: 8px 12px;"
                   placeholder="2 sonidos o texturas que noto ahora (el aire, la ropa, un ruido lejano)...">
            <input type="text" id="ace-action-1" class="form-input" style="font-size: 0.84rem; padding: 8px 12px;"
                   placeholder="1 acción pequeña y valiosa que elijo hacer ahora...">
          </div>
        </div>

        <div class="btn-group" style="justify-content: flex-end; margin-top: 14px;">
          <button type="button" class="btn-primary" id="btn-ace-complete" style="width: 100%; justify-content: center;">
            Ancla Echada: Estoy Aquí y Elijo Mi Paso
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    const selectedAck = new Set();
    const ackInput = document.getElementById('ace-ack-input');
    container.querySelectorAll('.ace-ack-chip[data-ace-ack]').forEach(chip => {
      chip.addEventListener('click', () => {
        const label = chip.dataset.aceAck;
        if (selectedAck.has(label)) {
          selectedAck.delete(label);
          chip.style.background = 'var(--bg-surface)';
          chip.style.color = 'var(--text-secondary)';
          chip.style.borderColor = 'var(--border-subtle)';
        } else {
          selectedAck.add(label);
          chip.style.background = 'var(--sage-500)';
          chip.style.color = '#fff';
          chip.style.borderColor = 'var(--sage-500)';
        }
        if (ackInput) {
          const list = Array.from(selectedAck);
          ackInput.value = list.length > 0
            ? `Reconozco con curiosidad que aquí dentro hay ${list.join(', ').toLowerCase()}.`
            : 'Reconozco con curiosidad que aquí dentro hay agobio y pensamientos acelerados.';
        }
      });
    });

    document.getElementById('btn-ace-exhale-pulse')?.addEventListener('click', () => {
      this.stopTrickTimer();
      let left = 6;
      const statusEl = document.getElementById('ace-exhale-status');
      const chk = document.getElementById('ace-chk-breath');
      window.app?.triggerHaptic([120]);
      window.app?.playGentleTone(396, 650);
      if (statusEl) statusEl.textContent = `Exhala lento... ${left}s`;

      this.trickTimer = setInterval(() => {
        left--;
        if (left > 0) {
          if (statusEl) statusEl.textContent = `Exhala lento... ${left}s`;
        } else {
          this.stopTrickTimer();
          if (statusEl) statusEl.textContent = '✓ Espacio somático abierto';
          if (chk) chk.checked = true;
          window.app?.triggerHaptic([60]);
        }
      }, 1000);
    });

    document.getElementById('btn-ace-complete')?.addEventListener('click', () => {
      window.app?.triggerHaptic([80, 50, 80]);
      window.app?.playGentleTone(432, 450);
      this.closeAppModal();
      window.app?.showToast('Ancla echada: estás presente y al mando de tu conducta');
    });
  }

  // 1. TRICK RUNNER: LA REGLA DE LA SENCILLEZ SERENA
  runTrickSereneSilence(container) {
    container.innerHTML = `
      <div class="trick-runner-container">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Micro-Guía Guiada • Límites</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

        <h3 class="card-title mt-2">La Regla de la Sencillez Serena</h3>
        <p class="card-subtitle">Decir NO sin justificarte durante media hora y sostener el silencio con dignidad.</p>

        <div class="modal-grid-2col mt-4">
          <!-- Step A: Clean Limit Formulas -->
          <div class="trick-step-card">
            <label class="form-label">Paso 1: Elige tu fórmula limpia de respuesta</label>
            <p class="form-hint">Sin rodeos, sin excusas elaboradas y sin pedir permiso para descansar:</p>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
              <label class="btn-secondary" style="font-size: 0.85rem; text-align: left; cursor: pointer; padding: 10px 14px; border-left: 3px solid var(--sage-500);">
                <input type="radio" name="limit-formula" value="1" checked>
                <span>"Agradezco mucho que hayas pensado en mí, pero esta vez no me es posible. Que lo paséis muy bien."</span>
              </label>
              <label class="btn-secondary" style="font-size: 0.85rem; text-align: left; cursor: pointer; padding: 10px 14px; border-left: 3px solid var(--sage-500);">
                <input type="radio" name="limit-formula" value="2">
                <span>"Revisé mi agenda y mis energías para hoy y no podré unirme. Espero que lo comprendas."</span>
              </label>
              <label class="btn-secondary" style="font-size: 0.85rem; text-align: left; cursor: pointer; padding: 10px 14px; border-left: 3px solid var(--sage-500);">
                <input type="radio" name="limit-formula" value="3">
                <span>"No voy a poder encargarme de esto. Gracias por consultarme."</span>
              </label>
            </div>
          </div>

          <!-- Step B: The 15-second Silence Challenge -->
          <div class="trick-step-card" style="border-left-color: var(--accent-warmth);">
            <label class="form-label">Paso 2: El Desafío de los 15 Segundos de Silencio</label>
            <p class="form-hint">
              Al decir tu frase, tu mente entrará en pánico y te exigirá rellenar el hueco con disculpas. 
              <strong>El reto es enviar o decir la frase y sostener 15 segundos en silencio completo:</strong>
            </p>

            <div class="silence-timer-wrap">
              <div class="silence-timer-orb" id="silence-orb">15</div>
            </div>

            <div style="text-align: center;">
              <button type="button" class="btn-primary" id="btn-start-silence-timer" style="padding: 8px 20px;">
                Iniciar Reto de Silencio (15s)
              </button>
              <div id="silence-feedback" style="margin-top: 10px; font-size: 0.85rem; font-weight: 600; color: var(--sage-700);"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    document.getElementById('btn-start-silence-timer')?.addEventListener('click', () => {
      this.stopTrickTimer();
      let sec = 15;
      const orb = document.getElementById('silence-orb');
      const feedback = document.getElementById('silence-feedback');
      const btn = document.getElementById('btn-start-silence-timer');
      if (btn) btn.style.display = 'none';

      orb.textContent = sec;
      feedback.textContent = 'Respira... no añadas ni una sola palabra...';

      this.trickTimer = setInterval(() => {
        sec--;
        if (orb) orb.textContent = sec;
        if (sec <= 0) {
          this.stopTrickTimer();
          if (feedback) feedback.innerHTML ='¡Reto completado! Has sostenido tu límite sin entregarte a la sumisión.';
          if (orb) orb.style.background = 'var(--sage-500)';
          window.app?.showToast('Límite y dignidad sostenidos con éxito');
        }
      }, 1000);
    });
  }

  // 2. TRICK RUNNER: LA VOZ DE DIBUJOS ANIMADOS & 3 PREFIJOS
  runTrickComicVoice(container) {
    const mindName = window.stateManager.getMindName();

    container.innerHTML = `
      <div class="trick-runner-container">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Micro-Guía • Defusión</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

        <h3 class="card-title mt-2">La Voz de Dibujos Animados</h3>
        <p class="card-subtitle">Desactiva el dramatismo de los pensamientos catastróficos en 30 segundos.</p>

        <div class="trick-step-card mt-4">
          <label class="form-label" for="runner-thought">Paso 1: ¿Qué pensamiento te tiene atrapado?</label>
          <input type="text" id="runner-thought" class="form-input" value="Si no cedo, van a pensar que soy un monstruo egoísta">
        </div>

        <div class="trick-step-card" style="border-left-color: var(--accent-warmth); text-align: center;">
          <label class="form-label">Paso 2: Léelo mentalmente con la voz de Mickey Mouse o Pato Donald</label>
          <div style="margin: 14px 0;">
            <span class="comic-voice-text" id="comic-display">
              "Si no cedo, van a pensar que soy un monstruo egoísta"
            </span>
          </div>
          <p class="form-hint">Nota cómo al cambiar el tono sonoro, las palabras pierden su autoridad como órdenes absolutas.</p>
        </div>

        <div class="trick-step-card" style="border-left-color: var(--sage-500);">
          <label class="form-label">Paso 3: Fórmulas de Distanciamiento Automático</label>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px; font-size: 0.88rem;">
            <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm);" id="pref-1">
              1. "Estoy teniendo el pensamiento de que..."
            </div>
            <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm);" id="pref-2">
              2. "Observo que ${mindName} me cuenta la historia de que..."
            </div>
            <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm);" id="pref-3">
              3. "Gracias, ${mindName}, por tu novela dramática."
            </div>
          </div>
        </div>

        <div class="btn-group" style="justify-content: center; margin-top: 16px;">
          <button type="button" class="btn-primary" id="btn-finish-comic">
            Pensamiento Desenganchado / Cerrar
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    const thoughtInput = document.getElementById('runner-thought');
    const comicDisplay = document.getElementById('comic-display');
    const pref1 = document.getElementById('pref-1');
    const pref2 = document.getElementById('pref-2');
    const pref3 = document.getElementById('pref-3');

    const updateTexts = (val) => {
      const clean = val || 'Si no cedo me van a rechazar';
      comicDisplay.textContent = `"${clean}"`;
      pref1.textContent = `1. "Estoy teniendo el pensamiento de que ${clean}."`;
      pref2.textContent = `2. "Observo que ${mindName} me cuenta la historia de que ${clean}."`;
      pref3.textContent = `3. "Gracias, ${mindName}, por intentar protegerme creyendo que ${clean}."`;
    };

    thoughtInput?.addEventListener('input', (e) => updateTexts(e.target.value));

    document.getElementById('btn-finish-comic')?.addEventListener('click', () => {
      window.app?.showToast('Pensamiento desarmado con éxito');
      this.closeAppModal();
    });
  }

  // 3. TRICK RUNNER: SOSTENER LA FRIALDAD AJENA (3 ALIENTOS)
  runTrickColdBreath(container) {
    container.innerHTML = `
      <div class="trick-runner-container text-center">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Micro-Guía • Somática</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

        <h3 class="card-title mt-2">Sostener la Frialdad Ajena</h3>
        <p class="card-subtitle">3 Alientos de Diferenciación para no correr a complacer cuando el otro pone mala cara.</p>

        <div class="breathing-pacer-container mt-4" style="padding: 20px;">
          <div class="breathing-circle-outer" style="width: 140px; height: 140px;">
            <div class="breathing-ring"></div>
            <div class="breathing-orb" id="cold-orb" style="width: 80px; height: 80px; font-size: 1.1rem;">
              1/3
            </div>
          </div>

          <div style="margin-top: 16px; max-width: 460px; margin-left: auto; margin-right: auto;">
            <div id="cold-step-title" style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
              Aliento 1: Hacer espacio a la alarma corporal
            </div>
            <div id="cold-step-text" style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; font-style: italic;">
              "Siento el nudo en la garganta o el estómago. Es solo incomodidad somática pasajera, no es un peligro mortal."
            </div>
          </div>

          <div class="btn-group" style="justify-content: center; margin-top: 18px;">
            <button type="button" class="btn-primary" id="btn-next-breath-step" style="padding: 8px 20px;">
              Siguiente Aliento →
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    let breathStep = 1;
    const orb = document.getElementById('cold-orb');
    const title = document.getElementById('cold-step-title');
    const text = document.getElementById('cold-step-text');
    const nextBtn = document.getElementById('btn-next-breath-step');

    nextBtn?.addEventListener('click', () => {
      breathStep++;
      if (breathStep === 2) {
        orb.textContent = '2/3';
        orb.className = 'breathing-orb hold';
        title.textContent = 'Aliento 2: El derecho a la propia emoción';
        text.textContent = '"La otra persona tiene pleno derecho a su decepción o enfado. Y yo tengo pleno derecho a mi necesidad y mi descanso."';
      } else if (breathStep === 3) {
        orb.textContent = '3/3';
        orb.className = 'breathing-orb exhale';
        title.textContent = 'Aliento 3: Cortar el impulso de rescate';
        text.textContent = '"No tengo que apagar el fuego ajeno entregando mi paz interior. Puedo sostener esta distancia sin romperme."';
        nextBtn.textContent ='Sostenido con Dignidad / Terminar';
      } else {
        window.app?.showToast('Alientos completados. Has protegido tu centro.');
        this.closeAppModal();
      }
    });
  }

  // 4. TRICK RUNNER: LAS DOS FLECHAS (DOLOR LIMPIO VS DOLOR SUCIO)
  runTrickTwoArrows(container) {
    container.innerHTML = `
      <div class="trick-runner-container">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Micro-Guía • Aceptación</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

        <h3 class="card-title mt-2">La Técnica de las Dos Flechas</h3>
        <p class="card-subtitle">Arranca la segunda flecha del auto-castigo y quédate solo con la emoción limpia.</p>

        <div class="modal-grid-2col mt-4">
          <!-- Arrow 1: Clean Pain -->
          <div class="trick-step-card" style="border-left-color: var(--sage-500);">
            <div style="font-weight: 700; color: var(--sage-700); margin-bottom: 4px;">
              1ª Flecha: Dolor Limpio (Inevitable)
            </div>
            <p class="form-hint" style="margin-bottom: 6px;">Lo que ocurrió objetivamente en la realidad:</p>
            <input type="text" id="arrow-clean" class="form-input" value="He dicho que no a ir a la cena y sentí un pellizco de culpa refleja.">
          </div>

          <!-- Arrow 2: Dirty Pain -->
          <div class="trick-step-card arrow-discard-box" id="dirty-arrow-box" style="border-left-color: var(--accent-tension);">
            <div style="font-weight: 700; color: var(--accent-tension); margin-bottom: 4px;">
              2ª Flecha: Dolor Sucio (Opcional - La historia que te clavas tú)
            </div>
            <p class="form-hint" style="margin-bottom: 6px;">El juicio moral con el que te flagelas:</p>
            <textarea id="arrow-dirty" class="form-textarea" style="min-height: 70px;">"Soy una persona egoísta, no sé cuidar a mis relaciones, se van a cansar de mí y me quedaré solo."</textarea>
          </div>
        </div>

        <div style="text-align: center; margin-top: 14px;">
<button type="button" class="btn-primary" id="btn-discard-second-arrow" style="background: var(--bg-surface);">
            Arrancar y Descartar la 2ª Flecha
          </button>
        </div>

<div id="arrow-resolution" style="display: none; margin-top: 16px; background: rgba(87, 139, 116, 0.15); border: 1px solid var(--sage-500); padding: 14px; border-radius: var(--radius-md); text-align: center; font-size: 0.9rem; color: var(--sage-800);">
<strong>2ª Flecha descartada:</strong> La incomodidad que sientes es solo la 1ª flecha (el eco del hábito). Ábrele los brazos y trátate con compasión.
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    document.getElementById('btn-discard-second-arrow')?.addEventListener('click', () => {
      const dirtyBox = document.getElementById('dirty-arrow-box');
      const res = document.getElementById('arrow-resolution');
      const btn = document.getElementById('btn-discard-second-arrow');

      if (dirtyBox) dirtyBox.classList.add('discarded');
      if (res) res.style.display = 'block';
      if (btn) btn.style.display = 'none';

      window.app?.showToast('Segunda flecha desactivada');
    });
  }

  // 5. TRICK RUNNER: LA PAUSA DE LOS 2 MINUTOS
  runTrickPauseRescue(container) {
    container.innerHTML = `
      <div class="trick-runner-container text-center">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Micro-Guía • Auto-contención</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

        <h3 class="card-title mt-2">Pausa de Contención</h3>
        <p class="card-subtitle">Frena el impulso impulsivo de ofrecerte voluntario o resolverle la incomodidad al otro.</p>

        <div class="silence-timer-wrap mt-4" style="width: 150px; height: 150px;">
          <div class="silence-timer-orb" id="pause-orb" style="width: 120px; height: 120px; font-size: 1.9rem;">
            2:00
          </div>
        </div>

        <div style="max-width: 480px; margin: 16px auto; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; font-style: italic;" id="pause-instruction">
          "Espera antes de levantar la mano o decir 'yo me encargo'. Permite que haya silencio. Observa la urgencia de rescatar en tu pecho y déjala pasar como una ola."
        </div>

        <div class="btn-group" style="justify-content: center; margin-top: 14px;">
          <button type="button" class="btn-primary" id="btn-start-pause-timer">
            Iniciar Pausa
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    document.getElementById('btn-start-pause-timer')?.addEventListener('click', () => {
      this.stopTrickTimer();
      let totalSec = 120;
      const orb = document.getElementById('pause-orb');
      const btn = document.getElementById('btn-start-pause-timer');
      const inst = document.getElementById('pause-instruction');
      if (btn) btn.style.display = 'none';

      const updateDisplay = () => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        orb.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      };

      updateDisplay();

      this.trickTimer = setInterval(() => {
        totalSec--;
        updateDisplay();

        if (totalSec === 60 && inst) {
          inst.textContent = '"Medio camino completado. Siente cómo la urgencia fisiológica empieza a perder intensidad. Respira hondo."';
        }

        if (totalSec <= 0) {
          this.stopTrickTimer();
          if (orb) orb.style.background = 'var(--sage-500)';
          if (inst) inst.innerHTML ='<strong>¡Pausa completada!</strong> El pico de reactividad ha bajado. Ahora puedes elegir desde la calma si realmente deseas actuar o dejar que el otro se responsabilice.';
          window.app?.showToast('Impulso de rescate contenido con éxito');
        }
      }, 1000);
    });
  }

  // 6. TRICK RUNNER: EL AUTOBÚS ACT (NEGAR EL VOLANTE Y DAR ASIENTO)
  runTrickBusDriver(container, options = {}) {
    const profile = window.stateManager.getProfile();
    const profileValues = profile.coreValues || [];
    const selectedRunnerValues = new Set();
    const existingPassengers = (profile.busPassengers || []).slice(0, 5);
    const targetPas = options.passenger || null;
    const affectedIds = Array.isArray(targetPas?.affectedValues) ? targetPas.affectedValues : [];
    const matchedInitialVal = profileValues.find(v => affectedIds.includes(v.id) || affectedIds.includes(v.domain));
    let activeRouteValue = matchedInitialVal || profileValues[0] || null;
    const formatRouteValue = (v) => v ? `${v.domain}: ${v.statement}` : 'Sin rumbo definido aún';
    const primaryValue = formatRouteValue(activeRouteValue);

    const esc = window.KhoraUtils.escapeHtml;

    const firstPas = targetPas || existingPassengers[0] || {};
    const initialProtects = firstPas.protectsFrom || '';
    const buildScript = (name, protects) =>
      `Gracias por avisarme, ${name || 'este miedo'} (sé que intentas protegerme de ${(protects || 'pasarlo mal').toLowerCase()}), pero ese desvío va en contra de mi ruta. Puedes quedarte en el autobús... pero el volante lo sostengo yo.`;

    container.innerHTML = `
      <div class="trick-runner-container">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Metáfora ACT de Hayes • Control del Volante</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

<h3 class="card-title mt-2">El Autobús ACT: Negar el Volante y Dar Asiento</h3>
        <p class="card-subtitle">El ruido no tiene manos para girar el volante: puedes dejar subir al miedo o agobio sin cederle la dirección.</p>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 14px;">
          ${targetPas ? `
            <!-- 1. Pasajero concreto elegido -->
            <div style="border-left: 3px solid #b86b59; padding-left: 12px;">
              <div style="font-size: 0.74rem; text-transform: uppercase; color: #b86b59; font-weight: 700;">1. Pasajero junto al volante</div>
              <div style="font-size: 0.94rem; font-weight: 700; color: var(--text-primary); margin-top: 3px;">
                ${esc(targetPas.icon ||'')} ${esc(targetPas.name)}
              </div>
              ${targetPas.shouts ? `
                <div style="font-size: 0.82rem; font-style: italic; color: var(--text-secondary); margin-top: 4px;">
                  «${esc(targetPas.shouts)}»
                </div>
              ` : ''}
              ${targetPas.protectsFrom ? `
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">
                  Intenta protegerte de: ${esc(targetPas.protectsFrom)}
                </div>
              ` : ''}
            </div>
          ` : `
            <!-- 1. Selector libre cuando se abre desde Botiquín -->
            <div>
              <label class="form-label" for="bus-runner-name">1. ¿Qué pasajero acaba de gritar junto al volante?</label>
              ${existingPassengers.length > 0 ? `
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px;">
                  ${existingPassengers.map(p => `
                    <button type="button" class="badge bus-runner-preset"
                            data-bus-name="${esc(p.name)}"
                            data-bus-shouts="${esc(p.shouts || '')}"
                            data-bus-protects="${esc(p.protectsFrom || '')}"
                            data-bus-detour="${esc(p.detour || '')}"
                            data-bus-reply="${esc(p.driverReply || '')}"
                            style="cursor: pointer; padding: 4px 10px; font-size: 0.74rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary);">
                      ${esc(p.icon ||'')} ${esc(p.name)}
                    </button>
                  `).join('')}
                </div>
              ` : ''}
              <input type="text" id="bus-runner-name" class="form-input" style="font-size: 0.86rem; margin-bottom: 8px;"
                     value="${esc(firstPas.name || '')}" placeholder="Nombre del miedo o pensamiento...">
<label class="form-label" for="bus-runner-shouts" style="font-size: 0.8rem;">¿Qué te dice o desvío te pide?</label>
              <input type="text" id="bus-runner-shouts" class="form-input" style="font-size: 0.85rem; margin-bottom: 8px;"
                     value="${esc(firstPas.shouts || '')}" placeholder="Qué frase te dice para hacerte girar...">

<label class="form-label" for="bus-runner-protects" style="font-size: 0.8rem;">¿De qué intenta protegerte? (opcional)</label>
              <input type="text" id="bus-runner-protects" class="form-input" style="font-size: 0.84rem;"
                     value="${esc(initialProtects)}" placeholder="Ej: De quedar mal, sufrir rechazo o fallar...">
              <div style="margin-top: 6px;">
                <button type="button" class="btn-inline-link" id="btn-bus-runner-toggle-protects" style="font-size: 0.76rem;">
                  Ver ejemplos
                </button>
                <div class="quick-chips-row hidden" id="bus-runner-protects-row" style="margin-top: 6px;">
                  ${['Del rechazo', 'De un conflicto o mala cara', 'De sentir culpa', 'De fallar o perder control'].map(pr => `
                    <button type="button" class="quick-fill-chip bus-runner-protects-chip" data-runner-protects="${pr}">
                      ${pr}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          `}

          <!-- 2. Rumbo y clave ACT -->
          <div style="border-left: 3px solid var(--sage-500); padding-left: 12px;">
<div style="font-size: 0.74rem; text-transform: uppercase; color: var(--sage-700); font-weight: 700;">2. Tu rumbo</div>
            ${profileValues.length > 1 ? `
              <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; margin-bottom: 6px;">
                ${profileValues.map(val => {
                  const isSel = activeRouteValue && activeRouteValue.id === val.id;
                  return `
                    <button type="button" class="quick-fill-chip bus-runner-route-chip ${isSel ? 'active' : ''}" data-runner-route-id="${esc(val.id)}" style="font-size: 0.74rem; padding: 3px 9px;">
                      ${esc(val.domain)}
                    </button>
                  `;
                }).join('')}
              </div>
            ` : ''}
            <p id="bus-runner-route-quote" style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin: 3px 0 4px;">«${esc(primaryValue)}»</p>
            <p class="explanatory-subtext" style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">
              Ni obedecer el desvío ni parar a discutir: reconócelo, siéntalo atrás y sigue conduciendo.
            </p>
          </div>

          <!-- 3. Ensayar respuesta -->
          <div>
            <label class="form-label" for="bus-driver-script-input">
              3. Ensaya tu respuesta al pasajero:
            </label>
            <textarea id="bus-driver-script-input" class="form-textarea" rows="2" style="font-size: 0.85rem; min-height: 64px;"
                      placeholder="Escribe cómo le respondes sin cederle el volante...">${esc(firstPas.driverReply || buildScript(firstPas.name, initialProtects))}</textarea>
          </div>
        </div>

        <div class="btn-group" style="justify-content: flex-end; margin-top: 16px;">
          <button type="button" class="btn-primary" id="btn-bus-drive-on">
            Sentar atrás y seguir conduciendo
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    const nameEl = document.getElementById('bus-runner-name');
    const shoutsEl = document.getElementById('bus-runner-shouts');
    const protectsEl = document.getElementById('bus-runner-protects');
    const replyInputEl = document.getElementById('bus-driver-script-input');

    document.getElementById('btn-bus-runner-toggle-protects')?.addEventListener('click', (e) => {
      const row = document.getElementById('bus-runner-protects-row');
      if (!row) return;
      const isHidden = row.classList.toggle('hidden');
      e.currentTarget.textContent = isHidden ?'Ver ejemplos' :'▴ Ocultar ejemplos';
    });

    container.querySelectorAll('.bus-runner-route-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = profileValues.find(v => v.id === btn.dataset.runnerRouteId);
        if (!val) return;
        activeRouteValue = val;
        const quoteEl = document.getElementById('bus-runner-route-quote');
        if (quoteEl) quoteEl.textContent = `«${formatRouteValue(val)}»`;
        container.querySelectorAll('.bus-runner-route-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    container.querySelectorAll('.bus-runner-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        if (nameEl) nameEl.value = btn.dataset.busName || '';
        if (shoutsEl) shoutsEl.value = btn.dataset.busShouts || '';
        if (protectsEl) protectsEl.value = btn.dataset.busProtects || '';
        if (replyInputEl) {
          replyInputEl.value = btn.dataset.busReply || buildScript(btn.dataset.busName, btn.dataset.busProtects);
        }
      });
    });

    container.querySelectorAll('.bus-runner-protects-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        if (protectsEl) protectsEl.value = btn.dataset.runnerProtects || '';
        container.querySelectorAll('.bus-runner-protects-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('btn-bus-drive-on')?.addEventListener('click', () => {
      const name = targetPas ? targetPas.name : nameEl?.value?.trim();
      const shouts = targetPas ? targetPas.shouts : shoutsEl?.value?.trim();
      const protectsFrom = targetPas ? targetPas.protectsFrom : protectsEl?.value?.trim();
      const driverReply = replyInputEl?.value?.trim();

      if (name) {
        const existing = targetPas || (window.stateManager.getProfile().busPassengers || []).find(
          p => p.name.toLowerCase() === name.toLowerCase()
        );
        if (existing) {
          if (typeof window.stateManager.updateBusPassenger === 'function') {
            window.stateManager.updateBusPassenger(existing.id, {
              shouts: shouts || existing.shouts,
              protectsFrom: protectsFrom || existing.protectsFrom,
              driverReply: driverReply || existing.driverReply,
              affectedValues: selectedRunnerValues.size > 0 ? [...selectedRunnerValues] : existing.affectedValues,
              status: 'seated'
            });
          } else {
            window.stateManager.updateBusPassengerStatus(existing.id, 'seated');
          }
        } else {
          window.stateManager.addBusPassenger({
            icon:'',
            name,
            shouts,
            protectsFrom,
            driverReply: driverReply || `No tocas el volante porque vas en contra de mi ruta (${primaryValue}), pero tienes asiento atrás mientras avanzo.`,
            affectedValues: [...selectedRunnerValues],
            status: 'seated'
          });
        }
      }
      this.closeAppModal();
      if (window.perfilApp) {
        window.perfilApp.render();
        window.perfilApp.bindEvents();
      }
      window.app?.showToast('Autobús en marcha hacia tus valores');
    });
  }

  // 7. TRICK RUNNER: LA POSTURA SOMÁTICA DEL "SÍ" (STEVEN HAYES)
  runTrickSomaticYes(container) {
    container.innerHTML = `
      <div class="trick-runner-container">
        <div class="flex-between">
          <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">Regulación Corporal • Steven Hayes</span>
          <button type="button" class="btn-icon" id="btn-close-runner" style="border: none; background: transparent;">✕</button>
        </div>

<h3 class="card-title mt-2">La Postura Somática del "SÍ"</h3>
        <p class="card-subtitle">Cambia tu postura física en 45 segundos para desactivar la respuesta de amenaza antes de hablar.</p>

        <div class="trick-step-card mt-4" style="border-left-color: var(--accent-tension);">
          <label class="form-label" style="color: var(--accent-tension);">Paso 1: Nota la Postura del "NO" (Blindaje)</label>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">
            Observa si tienes hombros subidos, mandíbula apretada o respiración corta en el pecho. Es tu cuerpo preparándose para ceder o atacar.
          </p>
        </div>

        <div class="trick-step-card" style="border-left-color: var(--sage-500);">
          <label class="form-label" style="color: var(--sage-700);">Paso 2: Pasa a la Postura del "SÍ" (Apertura)</label>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
            <label class="btn-secondary" style="font-size: 0.82rem; justify-content: flex-start; text-align: left; padding: 8px 12px; cursor: pointer;">
              <input type="checkbox" style="width: 16px; height: 16px; flex-shrink: 0;">
<span>Suelta los hombros hacia atrás y afloja la mandíbula</span>
            </label>
            <label class="btn-secondary" style="font-size: 0.82rem; justify-content: flex-start; text-align: left; padding: 8px 12px; cursor: pointer;">
              <input type="checkbox" style="width: 16px; height: 16px; flex-shrink: 0;">
<span>Apoya las palmas abiertas hacia arriba sobre tus muslos</span>
            </label>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
              <button type="button" class="btn-secondary" id="btn-somatic-exhale" style="font-size: 0.78rem; padding: 6px 12px; border-color: var(--sage-400);">
                Guiar exhalación de 6s
              </button>
              <span id="somatic-exhale-status" style="font-size: 0.8rem; font-weight: 700; color: var(--sage-700);"></span>
            </div>
          </div>
        </div>

        <div class="btn-group" style="justify-content: flex-end; margin-top: 14px;">
          <button type="button" class="btn-primary" id="btn-somatic-done" style="width: 100%; justify-content: center;">
            Postura Integrada / Continuar
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-runner')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    document.getElementById('btn-somatic-exhale')?.addEventListener('click', () => {
      this.stopTrickTimer();
      let left = 6;
      const st = document.getElementById('somatic-exhale-status');
      window.app?.triggerHaptic([100]);
      window.app?.playGentleTone(396, 600);
      if (st) st.textContent = `Exhala soltando hombros... ${left}s`;

      this.trickTimer = setInterval(() => {
        left--;
        if (left > 0) {
          if (st) st.textContent = `Exhala soltando hombros... ${left}s`;
        } else {
          this.stopTrickTimer();
          if (st) st.textContent = '✓ Cuerpo más abierto y presente';
          window.app?.triggerHaptic([60]);
        }
      }, 1000);
    });

    document.getElementById('btn-somatic-done')?.addEventListener('click', () => {
      this.closeAppModal();
      window.app?.showToast('Postura del SÍ integrada');
    });
  }

  // -------------------------------------------------------------
  // Event Binding
  // -------------------------------------------------------------
  bindEvents() {
    // Subtab navigation
    document.querySelectorAll('.nav-subtab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentTab = e.currentTarget.dataset.subtab;
        this.render();
        this.bindEvents();
      });
    });

    // Situational group selector in Botiquín de 1 Minuto
    document.querySelectorAll('[data-trick-group]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nextGroup = e.currentTarget.dataset.trickGroup;
        this.activeTrickGroup = nextGroup ? nextGroup : null;
        this.render();
        this.bindEvents();
      });
    });

    // Launch trick runner buttons (accessible from both Tricks Hub and Pill cards!)
    document.querySelectorAll('[data-launch-trick-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trickId = e.currentTarget.dataset.launchTrickId;
        this.launchTrickRunner(trickId);
      });
    });

    if (this.mode === 'estudio' || this.currentTab === 'pildoras') {
      document.getElementById('btn-next-mantra')?.addEventListener('click', () => {
        this.nextMantra();
      });

      document.getElementById('btn-toggle-anchors-list')?.addEventListener('click', () => {
        this.showAnchorsList = !this.showAnchorsList;
        this.render();
        this.bindEvents();
      });

      document.getElementById('btn-create-custom-anchor-card')?.addEventListener('click', () => {
        this.openCreateAnchorModal();
      });

      document.querySelectorAll('[data-focus-anchor-idx]').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.focusAnchorIdx, 10);
          if (!Number.isNaN(idx)) {
            this.currentMantraIndex = idx;
            this.render();
            this.bindEvents();
          }
        });
      });

      document.querySelectorAll('[data-edit-anchor-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const anc = window.stateManager.getAnchors().find(a => a.id === btn.dataset.editAnchorId);
          if (anc) this.openCreateAnchorModal(anc);
        });
      });

      document.querySelectorAll('[data-delete-anchor-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.stateManager.deleteAnchor(btn.dataset.deleteAnchorId);
          this.currentMantraIndex = 0;
          window.app?.showToast('Anclaje eliminado');
          this.render();
          this.bindEvents();
        });
      });

      document.querySelectorAll('.pill-filter-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          this.activeFilter = e.currentTarget.dataset.pillFilter;
          this.render();
          this.bindEvents();
        });
      });

      document.querySelectorAll('[data-toggle-fav]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = e.currentTarget.dataset.toggleFav;
          const isFav = window.stateManager.togglePillFavorite(id);
          window.app?.showToast(isFav ?'Añadido a favoritos' :'Eliminado de favoritos');
          this.render();
          this.bindEvents();
        });
      });

      document.querySelectorAll('[data-open-reading]').forEach(btn => {
        btn.addEventListener('click', () => {
          const pillId = btn.dataset.openReading;
          if (!pillId) return;
          this.activeReadingId = pillId;
          this.activeWorkshopId = null;
          if (typeof location !== 'undefined' && window.app && location.hash !== `#pildoras-estudio/lectura/${pillId}`) {
            location.hash = `pildoras-estudio/lectura/${pillId}`;
          }
          this.render();
          this.bindEvents();
          window.scrollTo?.({ top: 0, behavior: 'smooth' });
        });
      });

      const returnToStudyIndex = () => {
        this.activeReadingId = null;
        this.activeWorkshopId = null;
        if (typeof location !== 'undefined' && window.app && location.hash !== '#pildoras-estudio') {
          location.hash = 'pildoras-estudio';
        }
        this.render();
        this.bindEvents();
      };

      document.getElementById('btn-reading-back')?.addEventListener('click', returnToStudyIndex);
      document.getElementById('btn-reading-back-bottom')?.addEventListener('click', returnToStudyIndex);
      document.getElementById('btn-workshop-back')?.addEventListener('click', returnToStudyIndex);

      document.getElementById('btn-study-go-botiquin')?.addEventListener('click', () => {
        window.app?.navigate?.('pildoras-trucos');
      });

      document.querySelectorAll('[data-open-workshop]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const workshopId = btn.dataset.openWorkshop;
          this.activeWorkshopId = workshopId;
          this.activeReadingId = null;
          if (typeof location !== 'undefined' && window.app && location.hash !== `#pildoras-estudio/taller/${workshopId}`) {
            location.hash = `pildoras-estudio/taller/${workshopId}`;
          }
          this.render();
          this.bindEvents();
          window.scrollTo?.({ top: 0, behavior: 'smooth' });
        });
      });

      if (this.activeWorkshopId === 'deconstruct') {
        this.bindDeconstructEvents(() => {
          this.render();
          this.bindEvents();
        });
      } else if (this.activeWorkshopId === 'pivot') {
        this.bindPivotEvents(() => {
          this.render();
          this.bindEvents();
        });
      }
    }

    if (this.currentTab === 'deconstruct') {
      this.bindDeconstructEvents(() => {
        this.render();
        this.bindEvents();
      });
    }

    if (this.currentTab === 'pivot') {
      this.bindPivotEvents(() => {
        this.render();
        this.bindEvents();
      });
    }
  }

  bindDeconstructEvents(onSaved) {
    const labelInput = document.getElementById('dec-label');
    const softenedInput = document.getElementById('dec-softened');
    const contextInput = document.getElementById('dec-context');
    const deconstructPresets = [
      {
        label: 'Soy demasiado blando/a',
        softened: 'Tengo el pensamiento automático de que soy demasiado blando/a',
        context: 'Cuando alguien insiste y yo cedo para evitar un conflicto, noto presión en el pecho y miedo al rechazo.'
      },
      {
        label: 'Soy incapaz de decir que no',
        softened: 'Mi mente me repite la historia de que no sé decir que no',
        context: 'Cuando me piden algo urgente con mala cara y digo «sí» en automático, luego siento agotamiento y rabia.'
      },
      {
        label: 'Soy egoísta si miro por mí',
        softened: 'Aparece el pensamiento de que soy egoísta cuando cuido mi descanso',
        context: 'Cuando priorizo descansar frente a un plan ajeno, noto culpa física en el estómago aunque mi límite sea sano.'
      },
      {
        label: 'Soy culpable de que el otro se enfade',
        softened: 'Estoy teniendo la creencia de que la emoción del otro depende de mí',
        context: 'Cuando el otro se muestra frío o serio tras escuchar mi opinión, entro en alerta y busco explicarme de más.'
      }
    ];

    document.getElementById('btn-dec-toggle-examples')?.addEventListener('click', (e) => {
      const row = document.getElementById('dec-examples-row');
      if (!row) return;
      const isHidden = row.classList.toggle('hidden');
      e.currentTarget.textContent = isHidden ?'¿Bloqueado? Ver ejemplos' :'▴ Ocultar ejemplos';
    });

    document.querySelectorAll('[data-dec-preset-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = deconstructPresets[parseInt(btn.dataset.decPresetIdx, 10)];
        if (!p) return;
        if (labelInput) labelInput.value = p.label;
        if (softenedInput) softenedInput.value = p.softened;
        if (contextInput) contextInput.value = p.context;
        document.querySelectorAll('[data-dec-preset-idx]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    if (labelInput && softenedInput) {
      labelInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          softenedInput.value = `Tengo la creencia automática de que ${val.toLowerCase().replace(/^soy\s+/i, '')}`;
        }
      });
    }

    document.getElementById('btn-save-deconstruct')?.addEventListener('click', () => {
      const rigid = document.getElementById('dec-label')?.value?.trim();
      const softened = document.getElementById('dec-softened')?.value?.trim();
      const context = document.getElementById('dec-context')?.value?.trim();

      if (!rigid) {
        window.app?.showToast('Por favor escribe la etiqueta rígida');
        return;
      }

      window.stateManager.addDeconstructedStatement({
        rigidLabel: rigid,
        softened: softened || rigid,
        contextualized: context || softened || rigid
      });

      window.app?.showToast('Etiqueta deconstruida con éxito');
      onSaved?.();
    });
  }

  bindPivotEvents(onSaved) {
    const pivotPresets = [
      {
        pain: 'Temo que si pongo un límite se enfaden conmigo o se enfríe la relación.',
        yearning: 'Anhelo una relación cercana, honesta y segura donde ambos podamos expresarnos sin miedo.',
        action: 'Hablar desde el cariño y con firmeza: «Me importas y quiero estar bien contigo, por eso hoy necesito cuidar esto».'
      },
      {
        pain: 'Me da culpa parar y decir que hoy no llego a todo.',
        yearning: 'Anhelo tratarme con respeto y tener energía real para lo que de verdad importa.',
        action: 'Cerrar a tiempo hoy sin pedir perdón en exceso, sosteniendo el cosquilleo de culpa.'
      },
      {
        pain: 'Me saturo asumiendo cargas que otros me pasan con urgencia.',
        yearning: 'Anhelo elegir mis prioridades con calma y llevar el timón de mi tiempo.',
        action: 'Responder: «Puedo revisarlo mañana o repriorizar lo que ya tengo en marcha».'
      }
    ];

    document.getElementById('btn-pivot-toggle-examples')?.addEventListener('click', (e) => {
      const row = document.getElementById('pivot-examples-row');
      if (!row) return;
      const isHidden = row.classList.toggle('hidden');
      e.currentTarget.textContent = isHidden ?'¿Bloqueado? Ver ejemplos' :'▴ Ocultar ejemplos';
    });

    document.querySelectorAll('[data-pivot-preset-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = pivotPresets[parseInt(btn.dataset.pivotPresetIdx, 10)];
        if (!p) return;
        const painEl = document.getElementById('piv-pain');
        const yearnEl = document.getElementById('piv-yearning');
        const actEl = document.getElementById('piv-action');
        if (painEl) painEl.value = p.pain;
        if (yearnEl) yearnEl.value = p.yearning;
        if (actEl) actEl.value = p.action;
        document.querySelectorAll('[data-pivot-preset-idx]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('btn-save-pivot')?.addEventListener('click', () => {
      const pain = document.getElementById('piv-pain')?.value?.trim();
      const yearning = document.getElementById('piv-yearning')?.value?.trim();
      const action = document.getElementById('piv-action')?.value?.trim();

      if (!pain || !action) {
        window.app?.showToast('Completa al menos el dolor y la acción pivotada');
        return;
      }

      window.stateManager.addPivot({
        pain,
        yearning: yearning || 'Dignidad y conexión auténtica',
        pivotAction: action
      });

      window.app?.showToast('Pivote hacia valores guardado');
      onSaved?.();
    });
  }

  openAreaStudyModal(areaId, { preserveScroll = false } = {}) {
    const area = this.studyAreas.find(a => a.id === areaId);
    if (!area) return;

    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    const prevScroll = preserveScroll ? modalBody.scrollTop : 0;

    const areaPills = this.pills.filter(p => p.category === area.id);
    const favorites = window.stateManager.getPillFavorites();

    modalBody.innerHTML = `
      <div id="study-area-modal-root">
        <div class="flex-between" style="gap: 10px; align-items: flex-start;">
          <div>
            <h3 class="card-title">${area.icon} ${area.title}</h3>
            <p class="card-subtitle mt-1">${area.subtitle}</p>
          </div>
          <button type="button" class="btn-icon" id="btn-close-study-area-modal" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        <div style="margin-top: 14px;">
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            Lecturas breves
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${areaPills.map(p => {
              const isFav = favorites.includes(p.id);
              const isExpanded = this.expandedPillIds.has(p.id);
              return `
                <div class="history-item pill-accordion-card ${isExpanded ? 'expanded' : ''}" data-modal-pill-toggle="${p.id}" style="margin-bottom: 0; background: var(--bg-surface-elevated);">
                  <div class="flex-between" style="gap: 8px;">
                    <strong style="font-size: 0.94rem; color: var(--text-primary);">${p.title}</strong>
                    <button type="button" class="btn-icon" data-modal-pill-fav="${p.id}" style="width: 28px; height: 28px; border: none; background: transparent; font-size: 1rem; color: ${isFav ? '#b86b59' : 'var(--text-muted)'};">
                      ${isFav ?'' :''}
                    </button>
                  </div>
                  <p class="explanatory-subtext" style="font-size: 0.82rem; color: var(--text-secondary); margin: 4px 0 6px; line-height: 1.45;">
                    ${p.summary}
                  </p>
                  <span style="font-size: 0.76rem; font-weight: 700; color: var(--sage-600);">
                    ${isExpanded ? '▴ Ocultar lectura' : '▾ Leer explicación completa'}
                  </span>
                  ${isExpanded ? `
                    <div class="pill-accordion-body" style="margin-top: 10px; padding-top: 10px;">
                      ${p.content}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        ${area.workshops.length > 0 ? `
          <div style="margin-top: 16px;">
            <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
              Talleres en calma
            </div>
            <div class="pill-activities-list">
              ${area.workshops.map(w => `
                <button type="button" class="pill-related-activity-btn" data-modal-open-workshop="${w.id}">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">${w.icon}</span>
                    <div style="min-width: 0;">
                      <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary);">${w.title}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${w.badge}</div>
                    </div>
                  </div>
                  <span style="font-size: 0.78rem; font-weight: 700; color: var(--sage-600); white-space: nowrap;">Abrir taller →</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
          <button type="button" class="btn-inline-link" id="btn-modal-go-botiquin" style="font-size: 0.8rem;">
            Practicar trucos rápidos en el Botiquín →
          </button>
        </div>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('medium', { resetScroll: !preserveScroll });
    } else {
      modal.classList.add('active');
    }
    if (preserveScroll) {
      modalBody.scrollTop = prevScroll;
    }

    document.getElementById('btn-close-study-area-modal')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    modalBody.querySelectorAll('[data-modal-pill-toggle]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-modal-pill-fav]')) return;
        const pid = el.dataset.modalPillToggle;
        if (this.expandedPillIds.has(pid)) this.expandedPillIds.delete(pid);
        else this.expandedPillIds.add(pid);
        this.openAreaStudyModal(areaId, { preserveScroll: true });
      });
    });

    modalBody.querySelectorAll('[data-modal-pill-fav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isFav = window.stateManager.togglePillFavorite(btn.dataset.modalPillFav);
        window.app?.showToast(isFav ?'Añadido a favoritos' :'Eliminado de favoritos');
        this.openAreaStudyModal(areaId, { preserveScroll: true });
      });
    });

    document.getElementById('btn-modal-go-botiquin')?.addEventListener('click', () => {
      this.closeAppModal();
      window.app?.navigate?.('pildoras-trucos');
    });

    modalBody.querySelectorAll('[data-modal-open-workshop]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openWorkshopModal(btn.dataset.modalOpenWorkshop);
      });
    });
  }

  openWorkshopModal(workshopId, { preserveScroll = false } = {}) {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    const prevScroll = preserveScroll ? modalBody.scrollTop : 0;

    const innerHtml = workshopId === 'deconstruct'
      ? this.renderDeconstructView()
      : this.renderPivotView();

    modalBody.innerHTML = `
      <div>
        <div class="flex-between" style="justify-content: flex-end; margin-bottom: 6px;">
          <button type="button" class="btn-icon" id="btn-close-workshop-modal" aria-label="Cerrar" style="width: 34px; height: 34px;">✕</button>
        </div>
        ${innerHtml}
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('medium', { resetScroll: !preserveScroll });
    } else {
      modal.classList.add('active');
    }
    if (preserveScroll) {
      modalBody.scrollTop = prevScroll;
    }

    document.getElementById('btn-close-workshop-modal')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    if (workshopId === 'deconstruct') {
      this.bindDeconstructEvents(() => this.openWorkshopModal('deconstruct', { preserveScroll: true }));
    } else {
      this.bindPivotEvents(() => this.openWorkshopModal('pivot', { preserveScroll: true }));
    }
  }

  openCreateAnchorModal(editAnchor = null) {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const esc = window.KhoraUtils.escapeHtml;

    const currentCat = editAnchor?.category || 'Aceptación';

    modalBody.innerHTML = `
<h3 class="card-title">${editAnchor ?'Editar Tarjeta de Anclaje / Mantra ACT' :'Crear Tarjeta de Anclaje / Mantra ACT'}</h3>
      <p class="card-subtitle mt-2">
        Guarda una frase personal que te devuelva al presente, a la aceptación y a tus valores cuando aparezca la tormenta emocional.
      </p>

      <div class="form-group mt-4">
        <label class="form-label" for="pildora-new-anchor-text">Frase o Anclaje</label>
        <textarea id="pildora-new-anchor-text" class="form-textarea" placeholder="Ej: Puedo sentir miedo y aun así dar un paso pequeño hacia lo que me importa...">${esc(editAnchor?.text || '')}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="pildora-new-anchor-cat">Eje / Categoría</label>
        <select id="pildora-new-anchor-cat" class="form-input">
          ${[
            { v: 'Aceptación', l: 'Aceptación' },
            { v: 'Presente', l: 'Momento Presente' },
            { v: 'Defusión', l: 'Defusión' },
            { v: 'Valores', l: 'Valores' },
            { v: 'Límites', l: 'Límites' },
            { v: 'Compasión', l: 'Compasión' }
          ].map(opt => `<option value="${opt.v}" ${currentCat === opt.v ? 'selected' : ''}>${opt.l}</option>`).join('')}
        </select>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
        <button type="button" class="btn-primary" id="btn-modal-save-custom-anchor">
          ${editAnchor ? 'Guardar Cambios' : 'Guardar Anclaje'}
        </button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('default');
    } else {
      modal.classList.add('active');
    }

    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    document.getElementById('btn-modal-save-custom-anchor')?.addEventListener('click', () => {
      const text = document.getElementById('pildora-new-anchor-text')?.value?.trim();
      const cat = document.getElementById('pildora-new-anchor-cat')?.value || 'Valores';
      if (!text) {
        window.app?.showToast('Escribe tu frase de anclaje antes de guardar');
        return;
      }
      if (editAnchor) {
        window.stateManager.updateAnchor(editAnchor.id, { text, category: cat });
        window.app?.showToast('Anclaje ACT actualizado');
      } else {
        window.stateManager.addAnchor(text, 'Personal', cat);
        window.app?.showToast('Anclaje ACT guardado en tu botiquín');
      }
      this.closeAppModal();
      this.render();
      this.bindEvents();
      if (window.perfilApp) {
        window.perfilApp.render();
        window.perfilApp.bindEvents();
      }
    });
  }

  openPill(pillId) {
    this.mode = 'estudio';
    this.currentTab = 'pildoras';
    this.activeReadingId = pillId;
    this.activeWorkshopId = null;
    if (typeof location !== 'undefined' && window.app && location.hash !== `#pildoras-estudio/lectura/${pillId}`) {
      location.hash = `pildoras-estudio/lectura/${pillId}`;
    }
    this.render();
    this.bindEvents();
  }

  openReaderModal(pillId) {
    const pill = this.pills.find(p => p.id === pillId);
    if (!pill) return;

    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const favorites = window.stateManager.getPillFavorites();
    const isFav = favorites.includes(pill.id);

    modalBody.innerHTML = `
      <div class="flex-between" style="margin-bottom: 12px;">
        <span class="badge" style="background: var(--sage-100); color: var(--sage-800);">
          ${pill.categoryLabel} • Lectura breve
        </span>
        <button type="button" class="btn-icon" id="btn-reader-toggle-fav" style="border: none; background: transparent; font-size: 1.2rem;">
          ${isFav ?'' :''}
        </button>
      </div>

      <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px; line-height: 1.3;">
        ${pill.title}
      </h2>

      <div style="color: var(--text-primary); font-size: 0.95rem;">
        ${pill.content}
      </div>

      <div class="btn-group" style="margin-top: 24px; justify-content: space-between;">
        ${pill.trickId ? `
          <button type="button" class="btn-secondary" id="btn-modal-launch-trick" style="border-color: var(--sage-400);">
            Ejecutar este truco ahora
          </button>
        ` : '<div></div>'}
        <button type="button" class="btn-primary" id="btn-modal-close-reader">
          Cerrar Lectura
        </button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('medium');
    } else {
      modal.classList.add('active');
    }

    document.getElementById('btn-modal-close-reader')?.addEventListener('click', () => {
      this.closeAppModal();
    });

    document.getElementById('btn-modal-launch-trick')?.addEventListener('click', () => {
      this.launchTrickRunner(pill.trickId);
    });

    document.getElementById('btn-reader-toggle-fav')?.addEventListener('click', () => {
      const newFavState = window.stateManager.togglePillFavorite(pill.id);
      document.getElementById('btn-reader-toggle-fav').textContent = newFavState ?'' :'';
      window.app?.showToast(newFavState ?'Añadido a favoritos' :'Eliminado de favoritos');
      this.render();
      this.bindEvents();
    });
  }
}

window.pildorasAnclajesApp = new PildorasAnclajesApp();
