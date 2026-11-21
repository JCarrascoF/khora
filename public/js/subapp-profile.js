/**
 * ECOSISTEMA ACT - Sub-App 0: Mi Perfil ACT
 * Mapa Interior Simplificado y Conectado:
 * 1. Mi Momento Actual (Foco + Barreras que se activan + Retos)
 * 2. Hoja de Ruta Sugerida (Con trazabilidad explícita: ¿Por qué te sugerimos esto?)
 * 3. Mis Valores Construidos (Asistente Guiado de 4 Pasos de Steven C. Hayes)
 * 4. Resumen Compacto de Progresión
 */

class PerfilApp {
  constructor() {
    this.activeProfileTab = 'valores'; // 'valores' | 'momento' | 'autobus'

    // Context options for current concern (unified with value domains)
    this.contextOptions = ['Pareja', 'Trabajo', 'Familia', 'Amigos', 'Conmigo Mismo'];

    this.quickConcernPresets = [
      { text: 'Me cuesta poner límites en el trabajo sin sentir culpa', context: 'Trabajo' },
      { text: 'Tensión o miedo a discutir con mi pareja cuando digo lo que necesito', context: 'Pareja' },
      { text: 'Sobrecarga familiar y culpa al parar a descansar', context: 'Familia' },
      { text: 'Rumiación constante y exceso de autoexigencia', context: 'Conmigo Mismo' }
    ];

    this.passengerArchetypes = [
      {
        icon:'',
        name: 'El Policía de la Culpa',
        shouts: 'Si dices que no o descansas, eres egoísta y harás daño.',
        protectsFrom: 'Sentirme mala persona o culpable',
        detour: 'Decir que sí a todo y dejarme en último lugar'
      },
      {
        icon:'',
        name: 'El Vigilante del Enfado',
        shouts: 'No digas lo que piensas; se van a molestar o habrá mala cara.',
        protectsFrom: 'El conflicto, la tensión o la frialdad ajena',
        detour: 'Callarme mi opinión y ceder rápido'
      },
      {
        icon:'',
        name: 'El Complaciente Automático',
        shouts: 'Sonríe, di "no pasa nada" y resuélvelo tú para que haya paz.',
        protectsFrom: 'La desaprobación o decepcionar a otros',
        detour: 'Sobre-justificarme y asumir cargas que no me tocan'
      },
      {
        icon:'',
        name: 'El Juez de la Autoexigencia',
        shouts: 'Tienes que poder con todo sin quejarte ni bajar el ritmo.',
        protectsFrom: 'Sentirme insuficiente, débil o vulnerable',
        detour: 'Ignorar mi cansancio hasta agotarme'
      },
      {
        icon:'',
        name: 'El Catastrofista',
        shouts: '¿Y si sale mal y la incomodidad se vuelve insoportable?',
        protectsFrom: 'La incertidumbre y perder el control',
        detour: 'Quedarme bloqueado/a o posponer la decisión'
      }
    ];
    this.showMindEditorInline = false;
    this.showQuietPassengers = false;

    // Domain metadata
    this.domains = [
      { id:'Pareja', label:'Pareja', icon:'' },
      { id:'Trabajo', label:'Trabajo', icon:'' },
      { id:'Familia', label:'Familia', icon:'' },
      { id:'Amistad', label:'Amistad / Amigos', icon:'', matchContext:'Amigos' },
      { id:'Conmigo Mismo', label:'Conmigo Mismo', icon:'' }
    ];

    // 6 ACT Barriers / Fears frequently activated
    this.barriersCatalog = [
      {
        id: 'miedo_conflicto',
        icon:'',
        label: 'Miedo al enfado/conflicto',
        desc: 'Anticipo que si digo lo que pienso habrá tensión o bronca'
      },
      {
        id: 'culpa_limites',
        icon:'',
        label: 'Culpa al priorizarme',
        desc: 'Siento que soy egoísta o hago daño cuando cuido mis necesidades'
      },
      {
        id: 'impulso_ceder',
        icon:'',
        label: 'Impulso de ceder/complacer',
        desc: 'Digo "sí" o "me da igual" en piloto automático para apaciguar'
      },
      {
        id: 'rumiacion_ansiosa',
        icon:'',
        label: 'Anticipación catastrófica',
        desc: 'Mi mente da vueltas sin parar imaginando el peor escenario'
      },
      {
        id: 'miedo_rechazo',
        icon:'',
        label: 'Miedo al rechazo/desaprobación',
        desc: 'Temo que me retiren el afecto o la valoración si no cumplo expectativas'
      },
      {
        id: 'paralisis_expresar',
        icon:'',
        label: 'Parálisis al expresar lo que necesito',
        desc: 'Me bloqueo físicamente y me cuesta encontrar palabras con serenidad'
      },
      {
        id: 'intolerancia_incertidumbre',
        icon:'',
        label: 'Miedo a la incertidumbre / Control',
        desc: 'Necesito garantías mentales absolutas antes de actuar y me saturo ante la duda'
      },
      {
        id: 'autoexigencia_rigida',
        icon:'',
        label: 'Autoexigencia rígida y sobrecarga',
        desc: 'Me fusiono con el "tengo que poder con todo" y me cuesta parar sin culpa'
      }
    ];

    // Challenge categories
    this.challengeCategories = [
      { id:'limites', label:'Poner límites', icon:'' },
      { id:'conflicto', label:'Gestión de conflictos', icon:'' },
      { id:'sumision', label:'Evitar la sumisión', icon:'' },
      { id:'culpa', label:'Culpa y autoexigencia', icon:'' },
      { id:'ansiedad', label:'Ansiedad y anticipación', icon:'' },
      { id:'autoestima', label:'Autoestima y valor propio', icon:'' }
    ];

    // Hayes 4 Lenses for Value Discovery
    this.hayesLenses = [
      {
        id: 'anverso_dolor',
        title: 'El Anverso del Dolor ("Donde duele, importa")',
        prompt: 'Steven Hayes dice: "Sufrimos donde nos importa". Detrás de lo que te duele en este ámbito, ¿qué cualidad humana te gustaría encarnar?',
        prefix: 'Elegir'
      },
      {
        id: 'milagro_sin_miedo',
        title: 'El Milagro sin Miedo ("Si la culpa no mandara")',
        prompt: 'Imagina que actúas sin miedo al enfado ni culpa por cuidar tus límites. ¿Cómo tratarías esta situación o vínculo?',
        prefix: 'Actuar desde'
      },
      {
        id: 'espejo_10_anos',
        title: 'El Espejo de los 10 Años ("Quién elegí ser")',
        prompt: 'Mirando atrás dentro de diez años, ¿por qué manera concreta de estar presente aquí te sentirías orgulloso/a de ti?',
        prefix: 'Ser alguien capaz de'
      },
      {
        id: 'punto_dulce',
        title:'El Punto Dulce ("The Sweet Spot" — Plenitud Vivida)',
        prompt: 'Recuerda un momento real (aunque fuera sencillo) en que te sentiste digno/a, presente y en paz en este ámbito. ¿Qué cualidad tuya estaba viva ahí?',
        prefix: 'Cultivar y vivir desde'
      }
    ];

    // Guided optional example seeds per domain (only shown if user opens "Ver ejemplos")
    this.domainSeeds = {
      'Pareja': [
        'escuchar con presencia y curiosidad genuina',
        'expresar lo que siento y necesito con honestidad y cariño',
        'cuidar la complicidad y el respeto mutuo',
        'sostener conversaciones difíciles sin desconectarme'
      ],
      'Trabajo': [
        'trabajar con rigor y honestidad respetando mi descanso',
        'aportar valor y aprender con curiosidad',
        'comunicar prioridades y límites con serenidad',
        'colaborar desde la responsabilidad sin perder mi calma'
      ],
      'Familia': [
        'estar presente con afecto y escucha real',
        'construir vínculos desde el respeto mutuo y la autonomía',
        'compartir tiempo genuino con quienes quiero'
      ],
      'Amistad': [
        'ser una amistad leal, presente y honesta',
        'cuidar mis vínculos desde la reciprocidad y la escucha',
        'proponer y compartir momentos que nutran a ambos'
      ],
      'Conmigo Mismo': [
        'tratarme con amabilidad y paciencia en los días difíciles',
        'cuidar mi cuerpo, mi descanso y mi energía vital',
        'vivir con coherencia aunque aparezca incertidumbre',
        'reservar espacio para la curiosidad, el juego o la calma'
      ],
      'Otro': [
        'actuar con presencia, honestidad y respeto por lo que importa',
        'dedicar atención y cuidado constante a este ámbito'
      ]
    };

    // Suggested micro-actions & willingness examples per domain (optional, collapsed by default)
    this.domainActionHelpers = {
      'Pareja': {
        microActions: [
          'Preguntar con presencia cómo ha ido su día y escuchar sin mirar el móvil',
          'Expresar en primera persona algo que necesito hoy con calma'
        ],
        willingnessOptions: [
          'Sostener la incomodidad de una conversación sincera sin cerrar el diálogo',
          'Permitir que haya desacuerdo o silencio un rato sin entrar en pánico'
        ]
      },
      'Trabajo': {
        microActions: [
          'Clarificar prioridades con mi equipo antes de aceptar nuevas tareas',
          'Cerrar la jornada a la hora acordada para proteger mi descanso'
        ],
        willingnessOptions: [
          'Hacer hueco a la incomodidad de no estar disponible al instante',
          'Sostener la duda de si todo quedará perfecto hoy'
        ]
      },
      'Familia': {
        microActions: [
          'Escuchar con afecto sin asumir automáticamente la responsabilidad de resolverlo todo',
          'Planificar un rato de presencia real y respetuosa'
        ],
        willingnessOptions: [
          'Tolerar la sensación de incomodidad si mantengo un límite amable'
        ]
      },
      'Amistad': {
        microActions: [
          'Escribir a alguien que aprecio o proponer un plan que ambos disfrutemos'
        ],
        willingnessOptions: [
          'Aceptar la vulnerabilidad de mostrarme tal como estoy hoy'
        ]
      },
      'Conmigo Mismo': {
        microActions: [
          'Hacer una pausa sin pantallas para respirar y notar cómo estoy',
          'Dedicar un rato a algo que me nutra o me dé calma'
        ],
        willingnessOptions: [
          'Hacer espacio a la sensación de culpa o prisa cuando paro a cuidarme'
        ]
      },
      'Otro': {
        microActions: [
          'Dar un primer paso coherente con este valor hoy'
        ],
        willingnessOptions: [
          'Sostener la incomodidad o incertidumbre inicial al empezar'
        ]
      }
    };

    // Wizard state for Hayes Value Constructor modal (2 pasos ágiles)
    this.wizardState = {
      step: 1,
      editingValueId: null,
      domain: 'Pareja',
      isCustomDomain: false,
      selectedSeeds: [],
      showExamples: false,
      showStep2Examples: false,
      statement: '',
      microAction: '',
      willingness: ''
    };
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    const container = document.getElementById('profile-view');
    if (!container) return;

    const profile = window.stateManager.getProfile();
    if (this.activeProfileTab === 'autobus') {
      container.innerHTML = this.renderMindAndBusBlock(profile);
    } else if (this.activeProfileTab === 'anclajes') {
      container.innerHTML = this.renderAnchorsBlock();
    } else {
      container.innerHTML = this.renderValuesBlock(profile);
    }
  }

  renderMindAndBusBlock(profile) {
    const mindName = window.stateManager.getMindName();
    const coreValues = profile.coreValues || [];
    const selectedValId = this.activeBusValueId || 'all';
    const selectedVal = selectedValId !== 'all' ? coreValues.find(v => v.id === selectedValId) : null;
    const passengers = profile.busPassengers || [];
    const loudPassengers = passengers.filter(p => p.status === 'loud');
    const seatedPassengers = passengers.filter(p => p.status !== 'loud' && p.status !== 'integrated');
    const quietPassengers = passengers.filter(p => p.status === 'integrated');
    const esc = window.KhoraUtils.escapeHtml;

    const getDomainIcon = (domainName) => {
      const d = this.domains.find(dom => dom.id === domainName);
      return d ? d.icon :'';
    };

    const renderPassengerCard = (pas, zone) => {
      const isLoud = zone === 'loud';
      const isQuiet = zone === 'quiet';
      const icon = pas.icon ||'';
      const isExample = window.stateManager?.isExampleItem?.(pas);
      const affectedList = (pas.affectedValues || []).map(vid => {
        const matched = coreValues.find(v => v.id === vid || v.domain === vid);
        return matched ? { label: matched.domain, icon: getDomainIcon(matched.domain), id: matched.id } : { label: vid, icon:'', id: vid };
      });
      const matchesSelected = selectedVal && affectedList.some(a => a.id === selectedVal.id || a.label === selectedVal.domain);

      const hasDistinctShout = pas.shouts && pas.shouts.trim().toLowerCase() !== pas.name.trim().toLowerCase();

      return `
<article class="cozy-bus-passenger-card ${isLoud ? 'is-loud' : isQuiet ? 'is-quiet' : 'is-seated'}" ${matchesSelected ? 'style="border-color: var(--sage-500);"' : ''}>
  <div class="cozy-bus-passenger-header">
    <div class="cozy-bus-passenger-title-group">
      <span aria-hidden="true" class="cozy-bus-status-indicator ${isLoud ? 'loud' : isQuiet ? 'quiet' : 'seated'}">${isLoud ? '●' : '○'}</span>
      <h4 class="cozy-bus-passenger-name">${esc(pas.name)}</h4>
      ${isLoud ? '<span class="cozy-meta-tension" style="font-size: 0.68rem;">🚨 Al volante</span>' : ''}
      ${isQuiet ? '<span class="cozy-meta-tag" style="font-size: 0.68rem;">En silencio</span>' : ''}
      ${isExample ? '<span class="cozy-meta-muted" style="font-size: 0.68rem;">Ejemplo</span>' : ''}
    </div>
    <div class="cozy-bus-passenger-quick-actions">
      <button type="button" class="btn-inline-link bus-pas-edit-btn" data-pas-edit-id="${pas.id}" title="Editar pasajero" style="font-size: 0.76rem;">
        Editar
      </button>
      <button type="button" class="btn-inline-link bus-pas-remove-btn" data-pas-remove-id="${pas.id}" title="Quitar pasajero" style="font-size: 0.78rem; color: var(--text-muted);">
        ✕
      </button>
    </div>
  </div>

  ${hasDistinctShout ? `
    <blockquote class="act-passenger-shout" style="margin: 4px 0 8px; font-size: 0.92rem;">
      «${esc(pas.shouts)}»
    </blockquote>
  ` : ''}

  ${pas.driverReply ? `
    <div class="cozy-bus-driver-reply-block">
      <span class="cozy-bus-driver-reply-label">Tu respuesta al volante</span>
      <p class="cozy-bus-driver-reply-quote">«${esc(pas.driverReply)}»</p>
    </div>
  ` : ''}

  ${(pas.protectsFrom || pas.detour) ? `
    <div class="cozy-bus-meta-notes">
      ${pas.protectsFrom ? `
        <div class="cozy-bus-meta-note">
          <span class="cozy-bus-meta-label">Intenta proteger de:</span>
          <span class="cozy-bus-meta-val">${esc(pas.protectsFrom)}</span>
        </div>
      ` : ''}
      ${pas.detour ? `
        <div class="cozy-bus-meta-note">
          <span class="cozy-bus-meta-label">Desvío que pide:</span>
          <span class="cozy-bus-meta-val" style="color: var(--accent-warmth);">${esc(pas.detour)}</span>
        </div>
      ` : ''}
    </div>
  ` : ''}

  ${affectedList.length > 0 ? `
    <div class="cozy-bus-affected-values">
      <span class="cozy-meta-muted">Valores que perturba:</span>
      <span class="cozy-bus-affected-list">${affectedList.map(a => esc(a.label)).join(' · ')}</span>
    </div>
  ` : ''}

  <div class="cozy-bus-actions-bar">
    ${isLoud ? `
      <button type="button" class="btn-primary bus-pas-status-btn" data-pas-id="${pas.id}" data-pas-status="seated" style="font-size: 0.78rem; padding: 6px 14px;">
        Mandar al asiento trasero
      </button>
      <button type="button" class="cozy-bus-btn-action bus-pas-practice-btn" data-pas-practice-id="${pas.id}">
        Ensayar respuesta
      </button>
    ` : isQuiet ? `
      <button type="button" class="cozy-bus-btn-action bus-pas-status-btn" data-pas-id="${pas.id}" data-pas-status="seated">
        ↩ Volver a asientos traseros
      </button>
    ` : `
      <button type="button" class="cozy-bus-btn-action warning bus-pas-status-btn" data-pas-id="${pas.id}" data-pas-status="loud" title="Marcar que se ha levantado a gritar">
        ⚠️ Se ha levantado a gritar
      </button>
      <button type="button" class="cozy-bus-btn-link bus-pas-status-btn" data-pas-id="${pas.id}" data-pas-status="integrated" title="Marcar que ya no te desvía">
        ✓ Ya no me desvía
      </button>
    `}
  </div>
</article>
      `;
    };

    return `
<div class="cozy-bus-layout">
  <!-- 1. Cabina Unificada del Conductor (Rumbo + Mandos) -->
  <section class="cozy-bus-cabin">
    <div class="cozy-bus-cabin-top">
      <div>
        <div class="cozy-bus-driver-title">
          Al volante: <strong>Tú (Yo Observador)</strong>
        </div>
        <p class="explanatory-subtext" style="font-size: 0.8rem; color: var(--text-muted); margin: 3px 0 0;">
          Los pasajeros pueden gritar, pero solo tú tienes manos para girar el volante.
        </p>
      </div>
      <div class="cozy-bus-cabin-actions">
        <button type="button" class="btn-inline-link" id="btn-toggle-bus-mind-editor" style="font-size: 0.8rem;">
          Radio mental: <strong>«${esc(mindName)}»</strong>
        </button>
        <button type="button" class="btn-primary" id="btn-add-bus-passenger" style="font-size: 0.82rem; padding: 7px 14px; white-space: nowrap;">
          + Añadir pasajero
        </button>
      </div>
    </div>

    <div class="cozy-bus-faro-row">
      <div class="flex-between" style="gap: 12px; align-items: baseline; flex-wrap: wrap; margin-bottom: 6px;">
        <span class="cozy-meta-accent" style="font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;">
          🧭 Rumbo del autobús
        </span>
        <button type="button" class="btn-inline-link" id="btn-bus-change-faro" style="font-size: 0.78rem;">
          Editar valores →
        </button>
      </div>
      ${coreValues.length === 0 ? `
        <p class="cozy-empty-note" style="margin: 0; font-size: 0.92rem; color: var(--text-muted); font-style: italic;">
          Aún no has definido ningún valor rumbo. Pulsa «Editar valores →» para definir hacia dónde quieres orientar tu camino.
        </p>
      ` : selectedVal ? `
        <blockquote class="cozy-value-quote" style="margin: 0; font-size: 1.05rem;">
          <span class="cozy-meta-tag" style="margin-right: 8px;">${esc(selectedVal.domain)}</span>
          «${esc(selectedVal.statement)}»
        </blockquote>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${coreValues.map(val => `
            <div style="font-family: var(--font-serif); font-size: 1.02rem; line-height: 1.45; color: var(--text-primary);">
              <span class="cozy-meta-tag" style="margin-right: 8px;">${esc(val.domain)}</span>
              «${esc(val.statement)}»
            </div>
          `).join('')}
        </div>
      `}

      ${coreValues.length > 1 ? `
        <div class="cozy-bus-filter-bar" style="margin-top: 10px; padding-top: 8px;">
          <button type="button" class="cozy-bus-filter-btn bus-value-sign-chip ${!selectedVal ? 'active' : ''}" data-bus-value-id="all">
            Todos los valores
          </button>
          ${coreValues.map(val => {
            const isSel = selectedVal && selectedVal.id === val.id;
            return `
              <button type="button" class="cozy-bus-filter-btn bus-value-sign-chip ${isSel ? 'active' : ''}" data-bus-value-id="${val.id}">
                ${esc(val.domain)}
              </button>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  </section>

  ${this.showMindEditorInline ? `
    <div class="cozy-value-layer" style="margin-top: 12px;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <input type="text" id="input-profile-mind-name" class="form-input" value="${esc(mindName)}"
               placeholder="Apodo para tu radio mental (ej. George, Radio Catástrofe)..."
               style="flex: 1; min-width: 180px; padding: 8px 12px; font-size: 0.85rem;">
        <button type="button" class="btn-secondary" id="btn-save-profile-mind-name" style="font-size: 0.8rem; padding: 8px 14px;">
          Guardar apodo
        </button>
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; align-items: center;">
        <span style="font-size: 0.74rem; color: var(--text-muted);">Ideas:</span>
        ${['George', 'Radio Catástrofe', 'El Juez Interior', 'Doña Culpa', 'El Alarmista'].map(preset => `
          <button type="button" class="quick-fill-chip mind-preset-chip ${mindName === preset ? 'active' : ''}" data-mind-preset="${preset}">
            ${preset}
          </button>
        `).join('')}
      </div>
    </div>
  ` : ''}

  ${passengers.some(p => window.stateManager?.isExampleItem?.(p)) ? `
    <div class="example-notice-bar" style="margin-top: 6px;">
      <span>Hay pasajeros de ejemplo en tu autobús. Edítalos para adaptarlos a ti o quítalos cuando quieras.</span>
      <button type="button" class="btn-secondary" data-clear-examples="true" style="font-size: 0.76rem; padding: 5px 11px;">
        Quitar ejemplos
      </button>
    </div>
  ` : ''}

  <!-- 2. Zona Delantera: Solo si hay miedos activos que intentan desviar el volante -->
  ${loudPassengers.length > 0 ? `
    <section class="cozy-bus-zone">
      <div class="cozy-bus-zone-head">
        <span class="cozy-meta-tension">Junto al volante (${loudPassengers.length})</span>
        <span class="cozy-bus-zone-sub">Miedos activos que intentan hacerte girar</span>
      </div>
      <div class="cozy-bus-cards-stack">
        ${loudPassengers.map(pas => renderPassengerCard(pas, 'loud')).join('')}
      </div>
    </section>
  ` : ''}

  <!-- 3. Zona Trasera: Solo si hay pasajeros en los asientos traseros -->
  ${seatedPassengers.length > 0 ? `
    <section class="cozy-bus-zone">
      <div class="cozy-bus-zone-head">
        <span class="cozy-meta-tag">Asientos traseros (${seatedPassengers.length})</span>
        <span class="cozy-bus-zone-sub">Viajan contigo, pero no mandan en el rumbo</span>
      </div>
      <div class="cozy-bus-cards-stack">
        ${seatedPassengers.map(pas => renderPassengerCard(pas, 'seated')).join('')}
      </div>
    </section>
  ` : ''}

  <!-- 4. Pasajeros en silencio (si existen) -->
  ${quietPassengers.length > 0 ? `
    <div style="padding: 4px 0;">
      <button type="button" class="btn-inline-link" id="btn-toggle-quiet-passengers" style="font-size: 0.82rem; font-weight: 700;">
        ${this.showQuietPassengers ? '▴ Ocultar' : '▾ Ver'} pasajeros en silencio (${quietPassengers.length})
      </button>
      <div class="explanatory-subtext" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
        Siguen en tu historia, pero ya no te hacen girar el volante.
      </div>
      ${this.showQuietPassengers ? `
        <div class="cozy-bus-cards-stack" style="margin-top: 10px;">
          ${quietPassengers.map(pas => renderPassengerCard(pas, 'quiet')).join('')}
        </div>
      ` : ''}
    </div>
  ` : ''}
</div>
    `;
  }

  // ---------------------------------------------------------------
  // BLOQUE 3: Mis Valores Construidos (Mapa de Ámbitos + Tarjetas Interactivas)
  // ---------------------------------------------------------------
  renderValuesBlock(profile) {
    const values = profile.coreValues || [];
    const esc = window.KhoraUtils.escapeHtml;

    return `
      <div class="view-plain-shell">
        <div class="flex-between" style="flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
          <p class="form-hint" style="margin: 0; flex: 1; min-width: 220px;">En ACT un valor no es una meta que se tacha, sino cómo eliges actuar en lo que te importa.</p>
          <button type="button" class="btn-primary" id="btn-open-value-wizard" style="font-size: 0.84rem; padding: 8px 16px; white-space: nowrap;">
            + Construir Valor
          </button>
        </div>

        ${values.some(v => window.stateManager?.isExampleItem?.(v)) ? `
          <div class="example-notice-bar">
<span>Estás viendo valores de ejemplo para inspirarte. Puedes editarlos para hacerlos tuyos o quitar todos los ejemplos.</span>
            <button type="button" class="btn-secondary" data-clear-examples="true" style="font-size: 0.75rem; padding: 4px 10px;">
              Quitar ejemplos
            </button>
          </div>
        ` : ''}

        ${values.length === 0 ? `
<div class="cozy-empty-box">
<p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 14px;">
              Aún no has definido valores. Pulsa el botón para construir tu primer valor en 2 pasos.
            </p>
            <button type="button" class="btn-secondary" id="btn-open-value-wizard-empty" style="font-size: 0.84rem;">
              Construir mi Primer Valor
            </button>
          </div>
        ` : `
<div class="cozy-values-stack">
            ${values.map((val, idx) => {
              const domObj = this.domains.find(d => d.id === val.domain) || { icon:'', label: val.domain };
              const isPrimary = idx === 0;
              const practicedCount = Number(val.practicedCount) || 0;
              const isExample = window.stateManager?.isExampleItem?.(val);
              return `
<article class="cozy-value-layer ${isPrimary ? 'cozy-value-primary' : ''}">
  <div class="flex-between" style="margin-bottom: 10px; gap: 10px; flex-wrap: wrap;">
    <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
      <span class="cozy-meta-tag">${domObj.label}</span>
      ${isPrimary ? `<span class="cozy-meta-accent">Valor Principal (Portada)</span>` : ''}
      ${isExample ? '<span class="cozy-meta-muted">Ejemplo guía</span>' : ''}
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      ${!isPrimary ? `
        <button type="button" class="btn-inline-link value-set-primary-btn" data-value-set-primary-id="${val.id}" style="font-size: 0.76rem;">
          Fijar como Principal
                        </button>
      ` : ''}
      <button type="button" class="btn-inline-link value-remove-btn" data-value-remove-id="${val.id}" title="Retirar este valor" style="font-size: 0.78rem; color: var(--text-muted);">
                      ✕
                    </button>
                  </div>
                    </div>

  <blockquote class="cozy-value-quote">
                    «${esc(val.statement)}»
  </blockquote>

  ${isPrimary ? `
    <p class="explanatory-subtext" style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
      Activo como guía en tu inicio, tu autobús y momentos de calma.
                  </p>
  ` : ''}

  ${(val.microAction || val.willingness) ? `
    <div class="cozy-value-notes">
                    ${val.microAction ? `
        <div class="cozy-value-note">
          <span class="cozy-note-label">Conducta visible</span>
          <p>${esc(val.microAction)}</p>
                      </div>
                    ` : ''}
                    ${val.willingness ? `
        <div class="cozy-value-note">
          <span class="cozy-note-label" style="color: var(--accent-warmth);">Incomodidad que sostengo</span>
          <p>${esc(val.willingness)}</p>
                      </div>
                    ` : ''}
                  </div>
  ` : ''}

  <div class="cozy-value-actions">
    <button type="button" class="btn-secondary value-practice-btn" data-value-practice-id="${val.id}" style="font-size: 0.78rem; padding: 6px 13px;">
      Registrar práctica${practicedCount > 0 ? ` (${practicedCount})` : ''}
                    </button>
    <button type="button" class="btn-inline-link value-edit-btn" data-value-edit-id="${val.id}" style="font-size: 0.78rem;">
      Editar
                    </button>
    <button type="button" class="btn-inline-link value-compass-btn" data-value-compass-id="${val.id}" style="font-size: 0.78rem;">
      Usar en La Brújula
                      </button>
                </div>
</article>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  // ---------------------------------------------------------------
  // BLOQUE 4: Mis Tarjetas de Anclaje ACT (Frases Faro)
  // ---------------------------------------------------------------
  renderAnchorsBlock() {
    const anchors = window.stateManager.getAnchors ? window.stateManager.getAnchors() : [];
    const esc = window.KhoraUtils.escapeHtml;
    const hasExamples = anchors.some(a => window.stateManager?.isExampleItem?.(a));

    return `
      <div class="view-plain-shell">
        <div class="flex-between" style="flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
          <p class="form-hint" style="margin: 0; flex: 1; min-width: 220px;">Frases personales y de referentes ACT que te sirven como faro en momentos de ruido mental o crisis.</p>
          <button type="button" class="btn-primary" id="btn-profile-new-anchor" style="font-size: 0.84rem; padding: 8px 16px; white-space: nowrap;">
            + Nuevo Anclaje
          </button>
        </div>

        ${hasExamples ? `
          <div class="example-notice-bar">
            <span>Estás viendo tarjetas de ejemplo para inspirarte. Puedes editarlas para hacerlas tuyas o quitar los ejemplos.</span>
            <button type="button" class="btn-secondary" data-clear-examples="true" style="font-size: 0.75rem; padding: 4px 10px;">
              Quitar ejemplos
            </button>
          </div>
        ` : ''}

        ${anchors.length === 0 ? `
          <div class="cozy-empty-box">
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 14px;">
              Aún no tienes tarjetas de anclaje guardadas. Crea la primera para tenerla a mano en tu perfil y en tu botón SOS.
            </p>
            <button type="button" class="btn-secondary" id="btn-profile-new-anchor-empty" style="font-size: 0.84rem;">
              Crear mi Primer Anclaje
            </button>
          </div>
        ` : `
          <div class="cozy-values-stack">
            ${anchors.map((anc, idx) => {
              const isPrimary = idx === 0;
              const isExample = window.stateManager?.isExampleItem?.(anc);
              return `
                <article class="cozy-value-layer ${isPrimary ? 'cozy-value-primary' : ''}">
                  <div class="flex-between" style="margin-bottom: 10px; gap: 10px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
                      <span class="cozy-meta-tag">${esc(anc.category || 'Aceptación')}</span>
                      ${isPrimary ? `<span class="cozy-meta-accent">Anclaje Principal</span>` : ''}
                      ${isExample ? '<span class="cozy-meta-muted">Ejemplo guía</span>' : ''}
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <button type="button" class="btn-inline-link profile-anchor-edit-btn" data-anchor-edit-id="${anc.id}" style="font-size: 0.78rem;">
                        Editar
                      </button>
                      <button type="button" class="btn-inline-link profile-anchor-delete-btn" data-anchor-delete-id="${anc.id}" title="Borrar anclaje" style="font-size: 0.78rem; color: var(--text-muted);">
                        ✕
                      </button>
                    </div>
                  </div>

                  <blockquote class="cozy-value-quote">
                    «${esc(anc.text)}»
                  </blockquote>

                  ${anc.author ? `
                    <p class="explanatory-subtext" style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
                      — ${esc(anc.author)}
                    </p>
                  ` : ''}
                </article>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  // ---------------------------------------------------------------
  // HAYES GUIDED VALUE CONSTRUCTOR MODAL (2 PASOS ÁGILES)
  // ---------------------------------------------------------------
  openValueWizardModal(options = {}) {
    const existingVal = options.editValue || null;
    const initialDomain = existingVal ? existingVal.domain : (options.domain || 'Pareja');
    const isPresetDomain = this.domains.some(d => d.id === initialDomain);
    this.wizardState = {
      step: 1,
      editingValueId: existingVal ? existingVal.id : null,
      domain: initialDomain,
      isCustomDomain: !isPresetDomain,
      selectedSeeds: [],
      showExamples: false,
      showStep2Examples: false,
      statement: existingVal ? existingVal.statement : '',
      microAction: existingVal ? (existingVal.microAction || '') : '',
      willingness: existingVal ? (existingVal.willingness || '') : ''
    };
    this.renderWizardModal({ resetScroll: true });
  }

  renderWizardModal({ resetScroll = false } = {}) {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    const prevScroll = resetScroll ? 0 : modalBody.scrollTop;

    const w = this.wizardState;
    const seeds = this.domainSeeds[w.domain] || this.domainSeeds['Otro'] || this.domainSeeds['Conmigo Mismo'];
    const helpers = this.domainActionHelpers[w.domain] || this.domainActionHelpers['Otro'] || this.domainActionHelpers['Conmigo Mismo'];
    const escAttr = (s) => String(s || '').replace(/"/g, '&quot;');

    let stepHtml = '';

    if (w.step === 1) {
      stepHtml = `
        <div class="act-step-header">
          <h3 class="act-step-question">${w.editingValueId ? '¿En qué ámbito está este valor?' : '¿En qué ámbito quieres trabajar?'}</h3>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${this.domains.map(dom => {
            const active = !w.isCustomDomain && w.domain === dom.id;
            return `
              <button type="button" class="quick-fill-chip wizard-domain-btn ${active ? 'active' : ''}" data-wiz-domain="${dom.id}"
                      style="display: inline-flex; align-items: center; gap: 5px; padding: 7px 13px; font-size: 0.84rem;">
                <span>${dom.icon}</span>
                <span>${dom.label}</span>
              </button>
            `;
          }).join('')}
          <button type="button" class="quick-fill-chip ${w.isCustomDomain ? 'active' : ''}" id="btn-wiz-custom-domain"
                  style="display: inline-flex; align-items: center; gap: 5px; padding: 7px 13px; font-size: 0.84rem;">
            <span>Otro ámbito</span>
          </button>
        </div>

        ${w.isCustomDomain ? `
          <div class="form-group mt-3" style="margin-bottom: 4px;">
            <input type="text" id="input-wiz-custom-domain" class="form-input" style="font-size: 0.88rem;"
                   value="${escAttr(this.domains.some(d => d.id === w.domain) ? '' : w.domain)}"
                   placeholder="Escribe tu ámbito (ej: Salud, Crianza, Creatividad…)">
          </div>
        ` : ''}

        <div class="act-typeform-footer">
          <button type="button" class="btn-secondary" id="btn-wiz-cancel">Cancelar</button>
          <button type="button" class="btn-primary" id="btn-wiz-next-1">
            Siguiente
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      `;
    } else if (w.step === 2) {
      stepHtml = `
        <div class="act-step-header">
          <h3 class="act-step-question">¿Qué valor quieres cuidar en «${escAttr(w.domain || 'este ámbito')}»?</h3>
        </div>

        <div class="form-group">
          <textarea id="input-wiz-statement" class="form-textarea" rows="3" style="font-size: 0.92rem; min-height: 80px;"
                    placeholder="Escribe con tus palabras cómo quieres actuar aquí…">${w.statement}</textarea>
        </div>

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-wiz-toggle-examples" style="font-size: 0.8rem;">
            ${w.showExamples ? 'Ocultar ideas' : 'Ver ideas y preguntas guía'}
          </button>
          ${w.showExamples ? `
            <div style="margin-top: 10px;">
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
                ${seeds.map(seed => {
                  const chosen = w.selectedSeeds.includes(seed);
                  const label = seed.charAt(0).toUpperCase() + seed.slice(1);
                  return `
                    <button type="button" class="wizard-seed-btn badge" data-wiz-seed="${escAttr(seed)}"
                            style="cursor: pointer; padding: 6px 11px; font-size: 0.78rem; text-align: left; white-space: normal;
                                   background: ${chosen ? 'var(--sage-500)' : 'var(--bg-surface-elevated)'};
                                   color: ${chosen ? '#fff' : 'var(--text-primary)'};
                                   border: 1px solid ${chosen ? 'var(--sage-600)' : 'var(--border-subtle)'};">
                      ${chosen ? '✓ ' : '+ '}${label}
                    </button>
                  `;
                }).join('')}
              </div>
              <ul class="explanatory-subtext" style="margin: 0; padding-left: 16px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5;">
                <li><strong>Sin miedo ni culpa:</strong> Si hoy no mandaran el miedo ni la culpa, ¿cómo actuarías?</li>
                <li><strong>Tu huella:</strong> ¿Cómo te gustaría comportarte aquí?</li>
              </ul>
            </div>
          ` : ''}
        </div>

        <div class="act-typeform-footer">
          <button type="button" class="btn-secondary" id="btn-wiz-prev-2">← Atrás</button>
          <button type="button" class="btn-primary" id="btn-wiz-next-2">
            Siguiente
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      `;
    } else {
      stepHtml = `
        <div class="act-step-header">
          <h3 class="act-step-question">¿Qué primer paso darás hoy?</h3>
        </div>

        <div class="form-group">
          <label class="form-label" for="input-wiz-micro" style="font-size: 0.86rem;">Un gesto concreto (opcional)</label>
          <input type="text" id="input-wiz-micro" class="form-input" style="font-size: 0.88rem;" value="${escAttr(w.microAction)}"
                 placeholder="Ej: Hablar con calma 5 minutos…">
        </div>

        <div class="form-group mt-3">
          <label class="form-label" for="input-wiz-will" style="font-size: 0.86rem;">¿Qué incomodidad aceptas sentir? (opcional)</label>
          <input type="text" id="input-wiz-will" class="form-input" style="font-size: 0.88rem;" value="${escAttr(w.willingness)}"
                 placeholder="Ej: Miedo a incomodar o dudas…">
        </div>

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-wiz-toggle-step2-examples" style="font-size: 0.8rem;">
            ${w.showStep2Examples ? 'Ocultar ideas' : 'Ver ideas'}
          </button>
          ${w.showStep2Examples ? `
            <div class="modal-grid-2col mt-2" style="gap: 10px;">
              <div>
                <div style="font-size: 0.73rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">Ejemplos de gesto:</div>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                  ${helpers.microActions.map(ma => `
                    <button type="button" class="badge wiz-micro-preset" data-wiz-micro="${escAttr(ma)}"
                            style="cursor: pointer; text-align: left; white-space: normal; padding: 6px 10px; font-size: 0.76rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary);">
                      + ${ma}
                    </button>
                  `).join('')}
                </div>
              </div>
              <div>
                <div style="font-size: 0.73rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">Ejemplos de disposición:</div>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                  ${helpers.willingnessOptions.map(wo => `
                    <button type="button" class="badge wiz-will-preset" data-wiz-will="${escAttr(wo)}"
                            style="cursor: pointer; text-align: left; white-space: normal; padding: 6px 10px; font-size: 0.76rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary);">
                      + ${wo}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="act-typeform-footer">
          <button type="button" class="btn-secondary" id="btn-wiz-prev-3">← Atrás</button>
          <button type="button" class="btn-primary" id="btn-wiz-save">Guardar Valor</button>
        </div>
      `;
    }

    const container = document.getElementById('profile-view');
    if (!container) return;

    container.innerHTML = window.KhoraUI.renderTypeformShell({
      currentStep: w.step,
      totalSteps: 3,
      bodyId: 'wiz-step-body',
      stepHtml
    });
    if (resetScroll) {
      window.KhoraUtils?.scrollToTop?.();
    }
    this.bindWizardEvents();
  }

  bindWizardEvents() {
    const w = this.wizardState;

    const closeModal = () => {
      this.render();
      this.bindEvents();
    };

    document.getElementById('btn-wiz-cancel')?.addEventListener('click', closeModal);

    // Step 1 events
    document.querySelectorAll('.wizard-domain-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        w.isCustomDomain = false;
        w.domain = btn.dataset.wizDomain;
        w.selectedSeeds = [];
        if (!w.editingValueId) {
          w.statement = '';
        }
        this.renderWizardModal();
      });
    });

    document.getElementById('btn-wiz-custom-domain')?.addEventListener('click', () => {
      w.isCustomDomain = true;
      if (this.domains.some(d => d.id === w.domain)) {
        w.domain = '';
      }
      w.selectedSeeds = [];
      this.renderWizardModal();
      document.getElementById('input-wiz-custom-domain')?.focus?.();
    });

    document.getElementById('input-wiz-custom-domain')?.addEventListener('input', (e) => {
      w.domain = e.target.value;
    });

    document.getElementById('btn-wiz-toggle-examples')?.addEventListener('click', () => {
      w.showExamples = !w.showExamples;
      this.renderWizardModal();
    });

    document.querySelectorAll('.wizard-seed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const seed = btn.dataset.wizSeed;
        const idx = w.selectedSeeds.indexOf(seed);
        if (idx > -1) {
          w.selectedSeeds.splice(idx, 1);
        } else {
          w.selectedSeeds.push(seed);
        }
        if (w.selectedSeeds.length > 0) {
          const joined = w.selectedSeeds.join(' y ');
          w.statement = joined.charAt(0).toUpperCase() + joined.slice(1);
        } else if (!w.editingValueId) {
          w.statement = '';
        }
        this.renderWizardModal();
      });
    });

    document.getElementById('input-wiz-statement')?.addEventListener('input', (e) => {
      w.statement = e.target.value;
    });

    document.getElementById('btn-wiz-next-1')?.addEventListener('click', () => {
      const customDomainInput = document.getElementById('input-wiz-custom-domain')?.value?.trim();
      if (w.isCustomDomain) {
        if (!customDomainInput) {
          window.app?.showToast('Escribe el nombre del ámbito personalizado');
          document.getElementById('input-wiz-custom-domain')?.focus?.();
          return;
        }
        w.domain = customDomainInput;
      }
      w.step = 2;
      this.renderWizardModal({ resetScroll: true });
    });

    // Step 2 events
    document.getElementById('btn-wiz-prev-2')?.addEventListener('click', () => {
      w.step = 1;
      this.renderWizardModal({ resetScroll: true });
    });

    document.getElementById('btn-wiz-next-2')?.addEventListener('click', () => {
      const currentText = document.getElementById('input-wiz-statement')?.value?.trim() || '';
      if (!currentText) {
        window.app?.showToast('Escribe cómo quieres actuar en este ámbito (o abre un ejemplo)');
        document.getElementById('input-wiz-statement')?.focus?.();
        return;
      }
      w.statement = currentText;
      w.step = 3;
      this.renderWizardModal({ resetScroll: true });
    });

    // Step 3 events
    document.getElementById('btn-wiz-toggle-step2-examples')?.addEventListener('click', () => {
      w.showStep2Examples = !w.showStep2Examples;
      this.renderWizardModal();
    });

    document.querySelectorAll('.wiz-micro-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        w.microAction = btn.dataset.wizMicro;
        const inp = document.getElementById('input-wiz-micro');
        if (inp) inp.value = w.microAction;
      });
    });
    document.querySelectorAll('.wiz-will-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        w.willingness = btn.dataset.wizWill;
        const inp = document.getElementById('input-wiz-will');
        if (inp) inp.value = w.willingness;
      });
    });
    document.getElementById('input-wiz-micro')?.addEventListener('input', (e) => {
      w.microAction = e.target.value;
    });
    document.getElementById('input-wiz-will')?.addEventListener('input', (e) => {
      w.willingness = e.target.value;
    });

    document.getElementById('btn-wiz-prev-3')?.addEventListener('click', () => {
      w.step = 2;
      this.renderWizardModal({ resetScroll: true });
    });

    document.getElementById('btn-wiz-save')?.addEventListener('click', () => {
      const micro = document.getElementById('input-wiz-micro')?.value?.trim() || '';
      const will = document.getElementById('input-wiz-will')?.value?.trim() || '';

      if (w.editingValueId) {
        window.stateManager.updateConstructedValue(w.editingValueId, {
          domain: w.domain,
          statement: w.statement,
          microAction: micro,
          willingness: will,
          lensUsed: 'Constructor ACT'
        });
      } else {
        window.stateManager.addConstructedValue({
          domain: w.domain,
          statement: w.statement,
          microAction: micro,
          willingness: will,
          lensUsed: 'Constructor ACT'
        });
      }

      closeModal();
      this.activeProfileTab = 'valores';
      this.render();
      this.bindEvents();
      window.app?.showToast(w.editingValueId ?`Valor actualizado en ${w.domain}` :`Valor guardado en ${w.domain}`);
    });
  }

  // ---------------------------------------------------------------
  // BUS PASSENGER MODAL (Híbrido: Arquetipos + Chips + Escritura Libre)
  // ---------------------------------------------------------------
  openBusPassengerModal(editPassenger = null) {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    const profileValues = window.stateManager.getProfile().coreValues || [];
    const selectedAffectedValues = new Set(Array.isArray(editPassenger?.affectedValues) ? editPassenger.affectedValues : []);

    const esc = window.KhoraUtils.escapeHtml;

    const icons = ['●', '○', '◆', '◇', '▪', '▫'];
    const protectsChips = [
      'Del rechazo o abandono',
      'De un conflicto o mala cara',
      'De sentirme egoísta o culpable',
      'De fallar o perder el control'
    ];
    const detourChips = [
      'Callarme y ceder',
      'Justificarme de más',
      'Asumir carga que no me toca',
      'Huir o posponer'
    ];
    const shoutChips = [
      'Si dices que no, se va a enfadar o te retirará la palabra.',
      'Tienes que poder con todo sin quejarte.',
      'Calla y cede ahora para que haya paz.'
    ];

    let pasStep = 1;
    let showPasExamples = false;
    let pasData = {
      name: editPassenger?.name || '',
      shouts: editPassenger?.shouts || '',
      protectsFrom: editPassenger?.protectsFrom || '',
      detour: editPassenger?.detour || '',
      driverReply: editPassenger?.driverReply || '',
      icon: editPassenger?.icon || '',
      status: editPassenger?.status || 'loud'
    };
    let replyEditedManually = Boolean(editPassenger && editPassenger.driverReply);

    const buildSuggestedReply = (protects, detour) => {
      const p = (protects || 'pasarlo mal').trim();
      const d = (detour || 'ceder').trim();
      return `Sé que gritas porque intentas protegerme de ${p.charAt(0).toLowerCase() + p.slice(1)}, pero ${d.charAt(0).toLowerCase() + d.slice(1)} me aleja de mis valores. Puedes viajar atrás; al volante voy yo.`;
    };

    const closeModal = () => {
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    };

    const renderPassengerStep = ({ resetScroll = false } = {}) => {
      let stepHtml = '';

      if (pasStep === 1) {
        stepHtml = `
          <div class="act-step-header">
            <h3 class="act-step-question">${editPassenger ? '¿Qué dice este pasajero?' : '¿Cómo se llama este pensamiento o miedo?'}</h3>
          </div>

          <div class="form-group">
            <label class="form-label" for="input-pas-name" style="font-size: 0.86rem;">Nombre breve</label>
            <input type="text" id="input-pas-name" class="form-input" value="${esc(pasData.name)}"
                   placeholder="Ej: La Duda, El Miedo al Qué Dirán…">
          </div>

          <div class="form-group mt-3">
            <label class="form-label" for="input-pas-shouts" style="font-size: 0.86rem;">¿Qué frase te repite?</label>
            <textarea id="input-pas-shouts" class="form-textarea" rows="2" style="font-size: 0.88rem; min-height: 64px;"
                      placeholder="Escribe lo que te dice esa voz…">${esc(pasData.shouts)}</textarea>
          </div>

          <div style="margin-top: 8px;">
            <button type="button" class="btn-inline-link" id="btn-pas-toggle-examples" style="font-size: 0.8rem;">
              ${showPasExamples ? 'Ocultar ideas' : 'Ver ideas'}
            </button>
            ${showPasExamples ? `
              <div style="margin-top: 8px;">
                ${!editPassenger ? `
                  <div class="quick-chips-row" style="margin-top: 0; margin-bottom: 8px;">
                    ${this.passengerArchetypes.map((arch, idx) => `
                      <button type="button" class="quick-fill-chip pas-arch-btn" data-pas-arch-idx="${idx}">
                        ${arch.icon} ${arch.name}
                      </button>
                    `).join('')}
                  </div>
                ` : ''}
                <div class="quick-chips-row" style="margin-top: 0;">
                  ${shoutChips.map(s => `
                    <button type="button" class="quick-fill-chip pas-shout-preset" data-pas-shout="${esc(s)}">
                      + "${s}"
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="act-typeform-footer">
            <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
            <button type="button" class="btn-primary" id="btn-pas-next-1">
              Siguiente
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        `;
      } else if (pasStep === 2) {
        stepHtml = `
          <div class="act-step-header">
            <h3 class="act-step-question">¿De qué intenta protegerte «${esc(pasData.name || 'este pasajero')}»?</h3>
          </div>

          <div class="form-group">
            <label class="form-label" for="input-pas-protects" style="font-size: 0.86rem;">¿Qué intenta evitar?</label>
            <input type="text" id="input-pas-protects" class="form-input" value="${esc(pasData.protectsFrom)}"
                   placeholder="Ej: Quedar mal, sufrir rechazo o fallar…">
          </div>

          <div class="form-group mt-3">
            <label class="form-label" for="input-pas-detour" style="font-size: 0.86rem;">¿Qué te empuja a hacer?</label>
            <input type="text" id="input-pas-detour" class="form-input" value="${esc(pasData.detour)}"
                   placeholder="Ej: Callarme, posponer, evitar la escena…">
          </div>

          <div style="margin-top: 8px;">
            <button type="button" class="btn-inline-link" id="btn-pas-toggle-examples" style="font-size: 0.8rem;">
              ${showPasExamples ? 'Ocultar ideas' : 'Ver ideas'}
            </button>
            ${showPasExamples ? `
              <div style="margin-top: 8px;">
                <div class="quick-chips-row" style="margin-top: 0; margin-bottom: 6px;">
                  ${protectsChips.map(p => `
                    <button type="button" class="quick-fill-chip pas-protects-chip" data-pas-protects="${esc(p)}">
                      ${p}
                    </button>
                  `).join('')}
                </div>
                <div class="quick-chips-row" style="margin-top: 0;">
                  ${detourChips.map(d => `
                    <button type="button" class="quick-fill-chip pas-detour-chip" data-pas-detour="${esc(d)}">
                      ${d}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="act-typeform-footer">
            <button type="button" class="btn-secondary" id="btn-pas-prev-2">← Atrás</button>
            <button type="button" class="btn-primary" id="btn-pas-next-2">
              Siguiente
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        `;
      } else {
        const displayReply = pasData.driverReply || (!replyEditedManually && (pasData.protectsFrom || pasData.detour) ? buildSuggestedReply(pasData.protectsFrom, pasData.detour) : '');
        stepHtml = `
          <div class="act-step-header">
            <h3 class="act-step-question">¿Qué le respondes desde el volante?</h3>
          </div>

          <div class="form-group">
            <div class="flex-between" style="gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
              <label class="form-label" for="input-pas-reply" style="font-size: 0.86rem; margin-bottom: 0;">Tu respuesta</label>
              <button type="button" class="badge" id="btn-generate-driver-reply"
                      style="cursor: pointer; padding: 4px 10px; font-size: 0.74rem; border: 1px solid var(--sage-400); background: rgba(87, 139, 116, 0.12); color: var(--sage-700); font-weight: 700;">
                Sugerir respuesta
              </button>
            </div>
            <textarea id="input-pas-reply" class="form-textarea" rows="3" style="font-size: 0.88rem; min-height: 76px;"
                      placeholder="Cómo reconoces su miedo sin darle el volante…">${esc(displayReply)}</textarea>
          </div>

          <div class="form-group mt-3">
            <label class="form-label" style="font-size: 0.84rem;">¿Dónde viaja ahora?</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button type="button" class="quick-fill-chip pas-status-choice ${pasData.status === 'loud' ? 'active' : ''}" data-pas-choice-status="loud" style="text-align: center; padding: 8px 10px;">
                Junto al volante
              </button>
              <button type="button" class="quick-fill-chip pas-status-choice ${pasData.status !== 'loud' ? 'active' : ''}" data-pas-choice-status="seated" style="text-align: center; padding: 8px 10px;">
                Atrás en su asiento
              </button>
            </div>
          </div>

          ${profileValues.length > 0 ? `
            <div class="form-group mt-3">
              <label class="form-label" style="font-size: 0.82rem; margin-bottom: 6px;">Valores que intenta desviar (opcional)</label>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${profileValues.map(val => {
                  const isSel = selectedAffectedValues.has(val.id) || selectedAffectedValues.has(val.domain);
                  const shortStmt = val.statement.length > 36 ? val.statement.slice(0, 36) + '…' : val.statement;
                  return `
                    <button type="button" class="quick-fill-chip pas-value-toggle-btn ${isSel ? 'active' : ''}" data-pas-value-id="${val.id}" style="font-size: 0.76rem; padding: 5px 10px;">
                      <strong>${esc(val.domain)}:</strong> ${esc(shortStmt)}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <div class="act-typeform-footer">
            <button type="button" class="btn-secondary" id="btn-pas-prev-3">← Atrás</button>
            <button type="button" class="btn-primary" id="btn-modal-save-passenger">
              ${editPassenger ? 'Guardar cambios' : 'Guardar pasajero'}
            </button>
          </div>
        `;
      }

      const container = document.getElementById('profile-view');
      if (!container) return;
      const closeModal = () => {
        this.render();
        this.bindEvents();
      };

      container.innerHTML = window.KhoraUI.renderTypeformShell({
        currentStep: pasStep,
        totalSteps: 3,
        bodyId: 'pas-step-body',
        stepHtml
      });

      if (resetScroll) {
        window.KhoraUtils?.scrollToTop?.();
      }

      document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);
      document.getElementById('btn-pas-toggle-examples')?.addEventListener('click', () => {
        showPasExamples = !showPasExamples;
        renderPassengerStep();
      });

      const nameEl = document.getElementById('input-pas-name');
      const shoutsEl = document.getElementById('input-pas-shouts');
      const protectsEl = document.getElementById('input-pas-protects');
      const detourEl = document.getElementById('input-pas-detour');
      const replyEl = document.getElementById('input-pas-reply');

      nameEl?.addEventListener('input', (e) => { pasData.name = e.target.value; });
      shoutsEl?.addEventListener('input', (e) => { pasData.shouts = e.target.value; });
      protectsEl?.addEventListener('input', (e) => { pasData.protectsFrom = e.target.value; });
      detourEl?.addEventListener('input', (e) => { pasData.detour = e.target.value; });
      replyEl?.addEventListener('input', (e) => {
        pasData.driverReply = e.target.value;
        replyEditedManually = true;
      });

      modalBody.querySelectorAll('.pas-arch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const arch = this.passengerArchetypes[parseInt(btn.dataset.pasArchIdx, 10)];
          if (!arch) return;
          pasData.icon = arch.icon;
          pasData.name = arch.name;
          pasData.shouts = arch.shouts;
          pasData.protectsFrom = arch.protectsFrom;
          pasData.detour = arch.detour;
          replyEditedManually = false;
          renderPassengerStep();
        });
      });

      modalBody.querySelectorAll('.pas-shout-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          pasData.shouts = btn.dataset.pasShout;
          if (shoutsEl) shoutsEl.value = pasData.shouts;
        });
      });

      modalBody.querySelectorAll('.pas-protects-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          pasData.protectsFrom = btn.dataset.pasProtects;
          if (protectsEl) protectsEl.value = pasData.protectsFrom;
          modalBody.querySelectorAll('.pas-protects-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });

      modalBody.querySelectorAll('.pas-detour-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          pasData.detour = btn.dataset.pasDetour;
          if (detourEl) detourEl.value = pasData.detour;
          modalBody.querySelectorAll('.pas-detour-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });

      document.getElementById('btn-pas-next-1')?.addEventListener('click', () => {
        if (!pasData.name.trim()) {
          window.app?.showToast('Ponle un nombre breve al pasajero');
          nameEl?.focus?.();
          return;
        }
        pasStep = 2;
        renderPassengerStep({ resetScroll: true });
      });

      document.getElementById('btn-pas-prev-2')?.addEventListener('click', () => {
        pasStep = 1;
        renderPassengerStep({ resetScroll: true });
      });

      document.getElementById('btn-pas-next-2')?.addEventListener('click', () => {
        pasStep = 3;
        renderPassengerStep({ resetScroll: true });
      });

      document.getElementById('btn-pas-prev-3')?.addEventListener('click', () => {
        pasStep = 2;
        renderPassengerStep({ resetScroll: true });
      });

      document.getElementById('btn-generate-driver-reply')?.addEventListener('click', () => {
        pasData.driverReply = buildSuggestedReply(pasData.protectsFrom, pasData.detour);
        if (replyEl) replyEl.value = pasData.driverReply;
        replyEditedManually = false;
        window.app?.showToast('Respuesta sugerida (puedes retocarla)');
      });

      modalBody.querySelectorAll('.pas-status-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          pasData.status = btn.dataset.pasChoiceStatus;
          modalBody.querySelectorAll('.pas-status-choice').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });

      modalBody.querySelectorAll('.pas-value-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const vid = btn.dataset.pasValueId;
          if (!vid) return;
          if (selectedAffectedValues.has(vid)) {
            selectedAffectedValues.delete(vid);
            btn.classList.remove('active');
          } else {
            selectedAffectedValues.add(vid);
            btn.classList.add('active');
          }
        });
      });

      document.getElementById('btn-modal-save-passenger')?.addEventListener('click', () => {
        const name = pasData.name.trim();
        if (!name) {
          window.app?.showToast('Ponle un nombre breve al pasajero');
          return;
        }
        const finalReply = (replyEl?.value ?? pasData.driverReply ?? '').trim();
        const payload = {
          icon: pasData.icon,
          name,
          shouts: pasData.shouts.trim(),
          protectsFrom: pasData.protectsFrom.trim(),
          detour: pasData.detour.trim(),
          driverReply: finalReply,
          affectedValues: [...selectedAffectedValues],
          status: pasData.status
        };

        if (editPassenger) {
          window.stateManager.updateBusPassenger(editPassenger.id, payload);
          window.app?.showToast(`Pasajero actualizado: "${name}"`);
        } else {
          window.stateManager.addBusPassenger(payload);
          window.app?.showToast(`Pasajero subido al autobús: "${name}"`);
        }

        closeModal();
        this.activeProfileTab = 'autobus';
        this.render();
        this.bindEvents();
      });
    };

    renderPassengerStep({ resetScroll: true });
  }

  // ---------------------------------------------------------------
  // CHALLENGE MODAL
  // ---------------------------------------------------------------
  openChallengeModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
<h3 class="card-title">Añadir Reto Concreto</h3>
      <p class="card-subtitle mt-2">
        Define una situación o miedo concreto que quieras entrenar esta semana.
      </p>

      <div class="form-group mt-4">
        <label class="form-label" for="input-challenge-label">¿Qué quieres trabajar?</label>
        <input type="text" id="input-challenge-label" class="form-input" 
               placeholder="Ej: 'Decir que no a planes que no me apetecen sin justificarme'...">
      </div>

      <div class="form-group mt-3">
        <label class="form-label">Categoría</label>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 6px;">
          ${this.challengeCategories.map((cat, i) => `
            <button type="button" class="badge challenge-cat-btn ${i === 0 ? 'active' : ''}" 
                    data-cat-id="${cat.id}"
                    style="cursor: pointer; padding: 8px 10px; font-size: 0.8rem; text-align: left;
                           background: ${i === 0 ? 'var(--sage-500)' : 'var(--bg-surface-elevated)'}; 
                           color: ${i === 0 ? '#fff' : 'var(--text-secondary)'}; 
                           border: 1px solid ${i === 0 ? 'var(--sage-500)' : 'var(--border-subtle)'};">
              ${cat.icon} ${cat.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="btn-group mt-4">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
<button type="button" class="btn-primary" id="btn-modal-save-challenge">Añadir Reto</button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('default');
    } else {
      modal.classList.add('active');
    }

    const closeModal = () => {
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    };

    modalBody.querySelectorAll('.challenge-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modalBody.querySelectorAll('.challenge-cat-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'var(--bg-surface-elevated)';
          b.style.color = 'var(--text-secondary)';
          b.style.borderColor = 'var(--border-subtle)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--sage-500)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'var(--sage-500)';
      });
    });

    document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('btn-modal-save-challenge')?.addEventListener('click', () => {
      const label = document.getElementById('input-challenge-label')?.value?.trim();
      const activeCat = modalBody.querySelector('.challenge-cat-btn.active');
      const category = activeCat ? activeCat.dataset.catId : 'otro';

      if (!label) {
        window.app?.showToast('Escribe el reto concreto que quieres trabajar');
        return;
      }

      window.stateManager.addChallenge({ label, category });
      closeModal();
      this.render();
      this.bindEvents();
      window.app?.showToast(`Reto añadido: "${label}"`);
    });
  }

  // ---------------------------------------------------------------
  // EVENT BINDING
  // ---------------------------------------------------------------
  bindEvents() {
    // Internal profile tabs
    document.querySelectorAll('[data-profile-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeProfileTab = btn.dataset.profileTab;
        this.render();
        this.bindEvents();
      });
    });

    // Open Hayes Value Constructor Wizard (with optional domain or edit value)
    document.getElementById('btn-open-value-wizard')?.addEventListener('click', () => {
      this.openValueWizardModal();
    });
    document.getElementById('btn-open-value-wizard-empty')?.addEventListener('click', () => {
      this.openValueWizardModal();
    });
    document.querySelectorAll('[data-open-wizard-domain]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dom = btn.dataset.openWizardDomain;
        const existingInDomain = (window.stateManager.getProfile().coreValues || []).find(v => v.domain === dom);
        if (existingInDomain) {
          this.openValueWizardModal({ editValue: existingInDomain });
        } else {
          this.openValueWizardModal({ domain: dom });
        }
      });
    });

    // Set Primary Constructed Value (Faro Principal)
    document.querySelectorAll('.value-set-primary-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = window.stateManager.setPrimaryConstructedValue(btn.dataset.valueSetPrimaryId);
        this.render();
        this.bindEvents();
        if (chosen) window.app?.showToast(`Valor Principal fijado en ${chosen.domain}`);
      });
    });

    // Log Value Practice Step
    document.querySelectorAll('.value-practice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = window.stateManager.logValuePractice(btn.dataset.valuePracticeId);
        this.render();
        this.bindEvents();
        if (val) window.app?.showToast(`Paso registrado hacia tu valor en ${val.domain}`);
      });
    });

    // Edit Constructed Value
    document.querySelectorAll('.value-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = (window.stateManager.getProfile().coreValues || []).find(v => v.id === btn.dataset.valueEditId);
        if (val) {
          this.openValueWizardModal({ editValue: val });
        }
      });
    });

    // Use Value in La Brújula
    document.querySelectorAll('.value-compass-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = (window.stateManager.getProfile().coreValues || []).find(v => v.id === btn.dataset.valueCompassId);
        if (val && window.brujulaValoresApp) {
          window.brujulaValoresApp.reset();
          if (val.microAction) {
            window.brujulaValoresApp.formData.keyAction = val.microAction;
          }
          window.brujulaValoresApp.formData.situation = `Quiero actuar fiel a mi valor en ${val.domain}: ${val.statement}`;
        }
        window.app?.navigate('compass');
      });
    });

    // Clear all example items keeping user data intact
    document.querySelectorAll('[data-clear-examples]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('¿Quitar todos los datos de ejemplo de la app? Tus registros y valores propios se conservarán intactos.')) {
          window.stateManager.clearExampleData();
          this.render();
          this.bindEvents();
          window.app?.showToast('Ejemplos retirados — tus datos propios se mantienen');
        }
      });
    });

    // Remove Constructed Value
    document.querySelectorAll('.value-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.stateManager.removeConstructedValue(btn.dataset.valueRemoveId);
        this.render();
        this.bindEvents();
        window.app?.showToast('Valor retirado');
      });
    });

    // Add Bus Passenger button
    document.getElementById('btn-add-bus-passenger')?.addEventListener('click', () => {
      this.openBusPassengerModal();
    });

    // Change Faro shortcut in bus destination sign
    document.getElementById('btn-bus-change-faro')?.addEventListener('click', () => {
      if (window.app) {
        window.app.navigate('values');
      } else {
        this.activeProfileTab = 'valores';
        this.render();
        this.bindEvents();
      }
    });

    // Toggle inline Radio Mental editor in bus cabin
    document.getElementById('btn-toggle-bus-mind-editor')?.addEventListener('click', () => {
      this.showMindEditorInline = !this.showMindEditorInline;
      this.render();
      this.bindEvents();
    });

    document.querySelectorAll('.bus-value-sign-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeBusValueId = btn.dataset.busValueId || 'all';
        this.render();
        this.bindEvents();
      });
    });

    // Edit Bus Passenger button
    document.querySelectorAll('.bus-pas-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pasId = btn.dataset.pasEditId;
        const pas = (window.stateManager.getProfile().busPassengers || []).find(p => p.id === pasId);
        if (pas) {
          this.openBusPassengerModal(pas);
        }
      });
    });

    // Practice Bus Passenger live (opens trick_bus_driver for this exact passenger)
    document.querySelectorAll('.bus-pas-practice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pasId = btn.dataset.pasPracticeId;
        const pas = (window.stateManager.getProfile().busPassengers || []).find(p => p.id === pasId);
        if (window.pildorasAnclajesApp) {
          window.pildorasAnclajesApp.launchTrickRunner('trick_bus_driver', { passenger: pas || null });
        }
      });
    });

    document.getElementById('btn-toggle-quiet-passengers')?.addEventListener('click', () => {
      this.showQuietPassengers = !this.showQuietPassengers;
      this.render();
      this.bindEvents();
    });

    // Save Mind / Thought Generator Nickname
    document.getElementById('btn-save-profile-mind-name')?.addEventListener('click', () => {
      const val = document.getElementById('input-profile-mind-name')?.value?.trim();
      window.stateManager.setMindName(val || 'George');
      this.render();
      this.bindEvents();
      window.app?.showToast('Apodo de tu generador de pensamientos actualizado');
    });

    document.querySelectorAll('.mind-preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.mindPreset;
        if (!preset) return;
        window.stateManager.setMindName(preset);
        this.render();
        this.bindEvents();
        window.app?.showToast(`Generador de pensamientos bautizado como "${preset}"`);
      });
    });

    // Bus Passenger status buttons
    document.querySelectorAll('.bus-pas-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.stateManager.updateBusPassengerStatus(btn.dataset.pasId, btn.dataset.pasStatus);
        this.render();
        this.bindEvents();
        window.app?.showToast('Estado del pasajero actualizado');
      });
    });

    // Bus Passenger remove buttons
    document.querySelectorAll('.bus-pas-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.stateManager.removeBusPassenger(btn.dataset.pasRemoveId);
        this.render();
        this.bindEvents();
        window.app?.showToast('Pasajero retirado del autobús');
      });
    });

    // Add Challenge button
    document.getElementById('btn-add-challenge')?.addEventListener('click', () => {
      this.openChallengeModal();
    });

    // Challenge status change buttons
    document.querySelectorAll('.challenge-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.stateManager.updateChallengeStatus(btn.dataset.chId, btn.dataset.chStatus);
        this.render();
        this.bindEvents();
        window.app?.showToast('Estado del reto actualizado');
      });
    });

    // Challenge remove buttons
    document.querySelectorAll('.challenge-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.stateManager.removeChallenge(btn.dataset.chId);
        this.render();
        this.bindEvents();
        window.app?.showToast('Reto quitado');
      });
    });

    // Anchors management in Yo -> Mis Anclajes
    document.getElementById('btn-profile-new-anchor')?.addEventListener('click', () => {
      window.pildorasAnclajesApp?.openCreateAnchorModal?.();
    });
    document.getElementById('btn-profile-new-anchor-empty')?.addEventListener('click', () => {
      window.pildorasAnclajesApp?.openCreateAnchorModal?.();
    });
    document.querySelectorAll('.profile-anchor-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const anchors = window.stateManager.getAnchors ? window.stateManager.getAnchors() : [];
        const anc = anchors.find(a => a.id === btn.dataset.anchorEditId);
        if (anc) window.pildorasAnclajesApp?.openCreateAnchorModal?.(anc);
      });
    });
    document.querySelectorAll('.profile-anchor-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.stateManager.deleteAnchor(btn.dataset.anchorDeleteId);
        this.render();
        this.bindEvents();
        window.app?.showToast('Anclaje eliminado');
      });
    });
  }
}

// Global instance
window.perfilApp = new PerfilApp();
