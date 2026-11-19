/**
 * ECOSISTEMA ACT - Sub-App 2: El Espacio ACT
 * Procesamiento de Crisis en Tiempo Real (4 Pasos Guiados)
 * Incluye la Rueda de las Emociones Estándar (Modo Circular Radial y Modo Fichas),
 * Nombre de la Mente (Hayes) y Postura del SÍ
 */

class EspacioActApp {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.emotionViewMode = 'wheel'; // 'wheel' (Rueda Circular Estándar) | 'chips' (Fichas / Lista)
    this.activeEmotionFamily = 'Ira';
    this.emotionSearchQuery = '';

    // Taxonomía Terapéutica Formal Completa (42 Emociones en 6 Familias de Ekman, Plutchik y Willcox/Roberts)
    this.emotionFamilies = [
      {
        id: 'Ira',
        label: 'Ira / Enfado',
        icon:'',
        color: '#994131',
        desc: 'Límites transgredidos, agravio o frustración',
        nuances: [
          { id: 'Rabia', desc: 'Furia intensa e impulso visceral de confrontar o defenderse', example: 'Ej: "Siento que voy a explotar por cómo me habló delante de todos"' },
          { id: 'Frustración', desc: 'Bloqueo ante un obstáculo o exigencia externa injusta', example: 'Ej: "Haga lo que haga, la situación no cambia y me siento atrapado/a"' },
          { id: 'Resentimiento', desc: 'Rencor sordo por haber cedido contra mi propia voluntad', example: 'Ej: "Cedí en los planes del fin de semana y ahora me hierve por dentro"' },
          { id: 'Indignación', desc: 'Reacción ante un trato asimétrico, falta de respeto o abuso', example: 'Ej: "Lo que me pide no se lo pediría a nadie más; me trata de forma desigual"' },
          { id: 'Irritabilidad', desc: 'Hipersensibilidad reactiva por sobrecarga acumulada', example: 'Ej: "Cualquier tontería me pone de los nervios hoy; estoy al límite"' },
          { id: 'Celos / Envidia', desc: 'Temor a perder el lugar o anhelo doliente ante lo que otro tiene', example: 'Ej: "Me escuece ver la atención o calma que le da a otros y no a mí"' },
          { id: 'Herido / Ofensa', desc: 'Dolor agudo mezclado con enfado tras sentirse atacado o juzgado', example: 'Ej: "Su comentario despectivo me ha dolido y cerrado por dentro"' }
        ]
      },
      {
        id: 'Miedo',
        label: 'Miedo / Ansiedad',
        icon:'',
        color: '#965d2e',
        desc: 'Amenaza al vínculo, al rechazo o a la seguridad',
        nuances: [
          { id: 'Ansiedad', desc: 'Anticipación catastrófica e hipervigilancia constante', example: 'Ej: "No paro de darle vueltas a lo que puede salir mal mañana"' },
          { id: 'Pánico', desc: 'Alarma somática desbordante y urgencia de escape', example: 'Ej: "El corazón se me dispara y siento que me ahogo; necesito salir de aquí"' },
          { id: 'Inseguridad', desc: 'Duda paralizante sobre mi propio valor o capacidad', example: 'Ej: "¿Y si no soy suficiente? ¿Y si pierdo su afecto si digo lo que pienso?"' },
          { id: 'Rechazo', desc: 'Temor vivo a quedar excluido o no ser aceptado al mostrarme real', example: 'Ej: "Si muestro desacuerdo siento que me van a apartar o castigar con silencio"' },
          { id: 'Sumisión', desc: 'Apocamiento automático para desactivar la amenaza ajena', example: 'Ej: "Dije que sí automáticamente para que no se enfadara conmigo"' },
          { id: 'Desamparo', desc: 'Sensación de estar desprotegido o sin red ante el conflicto', example: 'Ej: "Siento que nadie va a sostenerme si expreso mi malestar"' },
          { id: 'Vulnerabilidad', desc: 'Sensación de exposición frágil sin coraza frente a los demás', example: 'Ej: "Me tiembla la voz al decir lo que necesito y me siento expuesto/a"' }
        ]
      },
      {
        id: 'Tristeza',
        label: 'Tristeza / Duelo',
        icon:'',
        color: '#3f5a6c',
        desc: 'Pérdida, desconexión o herida interna',
        nuances: [
          { id: 'Pena / Duelo', desc: 'Dolor limpio por una pérdida real o por lo que no pudo ser', example: 'Ej: "Lloro en silencio al aceptar que este vínculo no me da lo que necesito"' },
          { id: 'Soledad', desc: 'Incomunicación profunda aun estando rodeado de gente', example: 'Ej: "Estoy acompañado/a, pero nadie ve lo que me pasa de verdad"' },
          { id: 'Culpa', desc: 'Peso opresivo por creer haber hecho daño o ser egoísta', example: 'Ej: "Siento que fui egoísta por poner mi descanso por delante"' },
          { id: 'Vergüenza', desc: 'Deseo de esconderse por sentirse defectuoso o inadecuado', example: 'Ej: "Me veo tan pequeño/a… ¿cómo he dejado que esto llegue hasta aquí?"' },
          { id: 'Desesperanza', desc: 'Creencia de que nada cambiará por mucho que lo intente', example: 'Ej: "Da igual lo que haga o diga, siempre acabamos en el mismo punto"' },
          { id: 'Vacío', desc: 'Sensación hueca tras haber apagado los propios deseos', example: 'Ej: "Ya no sé ni qué me gusta fuera de lo que los demás esperan de mí"' },
          { id: 'Melancolía', desc: 'Añoranza dulce-amarga de una calma o conexión pasada', example: 'Ej: "Echo de menos cuando me sentía libre y sin este peso diario"' }
        ]
      },
      {
        id: 'Aversión',
        label: 'Asco / Aversión',
        icon:'',
        color: '#6b4b32',
        desc: 'Rechazo moral, desprecio o desencanto',
        nuances: [
          { id: 'Repulsión / Asco', desc: 'Rechazo físico o moral ante la hipocresía o la manipulación', example: 'Ej: "Su doble discurso me revuelve el estómago: dice una cosa y hace otra"' },
          { id: 'Desprecio', desc: 'Distanciamiento frío y juicio severo ante una conducta indigna', example: 'Ej: "Siento un rechazo seco hacia esa actitud tan falta de empatía"' },
          { id: 'Decepción', desc: 'Caída brusca de expectativas al chocar con la realidad del otro', example: 'Ej: "Esperaba cuidado tras mi esfuerzo y me encontré con indiferencia"' },
          { id: 'Desaprobación', desc: 'Inconformidad firme ante algo que vulnera tus valores', example: 'Ej: "Esto que está ocurriendo no está bien y no quiero validarlo"' },
          { id: 'Traición', desc: 'Ruptura dolorosa del pacto implícito de cuidado y lealtad', example: 'Ej: "Confiaba en que me protegería y ha mirado solo por su conveniencia"' },
          { id: 'Menosprecio', desc: 'Sensación de ser tratado como invisible o inferior', example: 'Ej: "Me habla como si mi opinión o mi tiempo no tuvieran ningún valor"' },
          { id: 'Hastío', desc: 'Cansancio crónico de repetir siempre la misma dinámica tóxica', example: 'Ej: "Otra vez la misma discusión, el mismo guion. Estoy agotado/a"' }
        ]
      },
      {
        id: 'Sorpresa',
        label: 'Sorpresa / Bloqueo',
        icon:'',
        color: '#3b6372',
        desc: 'Sobresalto, parálisis y sobrecarga mental',
        nuances: [
          { id: 'Conmoción / Shock', desc: 'Impacto súbito ante algo inesperado que deja sin aliento', example: 'Ej: "Me quedé helado/a con su respuesta; no me lo esperaba en absoluto"' },
          { id: 'Desconcierto', desc: 'Pérdida temporal de brújula ante mensajes contradictorios', example: 'Ej: "Me dice que me quiere pero me exige cosas que me hacen daño"' },
          { id: 'Desbordamiento', desc: 'Demasiadas demandas emocionales al mismo tiempo', example: 'Ej: "Son tantos frentes abiertos que me dan ganas de soltarlo todo"' },
          { id: 'Parálisis', desc: 'Bloqueo físico o mental ante el temor a las consecuencias', example: 'Ej: "Sé lo que debería responder pero mi cuerpo se queda congelado"' },
          { id: 'Indecisión', desc: 'Dilema interno paralizante por miedo a incomodar elija lo que elija', example: 'Ej: "Si digo que sí me traiciono; si digo que no, se enfada"' },
          { id: 'Anestesia', desc: 'Desconexión refleja automática: no sentir para no sufrir', example: 'Ej: "Ha pasado algo fuerte pero no siento ni rabia ni pena, solo niebla"' },
          { id: 'Extrañeza', desc: 'Sentirse ajeno a uno mismo o irreal dentro de la escena', example: 'Ej: "Es como si observara mi vida desde fuera; no me reconozco aquí"' }
        ]
      },
      {
        id: 'Alegría / Paz',
        label: 'Alegría / Paz y Firmeza',
        icon:'',
        color: '#34614f',
        desc: 'Bienestar, apertura, dignidad y conexión',
        nuances: [
          { id: 'Alegría / Gozo', desc: 'Vitalidad cálida, entusiasmo o disfrute genuino del presente', example: 'Ej: "Disfruto de este momento libre sin preocuparme por complacer"' },
          { id: 'Serenidad', desc: 'Calma espaciosa que convive con la realidad sin luchar', example: 'Ej: "Respiro hondo sabiendo que no necesito controlar al otro"' },
          { id: 'Alivio', desc: 'Ligereza física tras soltar una carga o decir la verdad', example: 'Ej: "Se me aflojó la mandíbula al cancelar el plan que no quería hacer"' },
          { id: 'Gratitud', desc: 'Reconocimiento tierno de lo valioso en ti o en el vínculo', example: 'Ej: "Agradezco poder ser honesto/a y contar con espacios seguros"' },
          { id: 'Esperanza', desc: 'Confianza tranquila en tu capacidad de cambiar el rumbo', example: 'Ej: "Sé que cuesta romper el patrón, pero hoy he dado un paso real"' },
          { id: 'Compasión', desc: 'Mirada amable hacia tu propia vulnerabilidad humana', example: 'Ej: "Me abrazo con cariño en vez de insultarme por haber sentido miedo"' },
          { id: 'Dignidad / Firmeza', desc: 'Solidez respetuosa tras sostener un límite con calma', example: 'Ej: "Dije lo que pensaba con firmeza y sin agresividad. Estoy en paz"' }
        ]
      }
    ];

    this.entryData = {
      emotions: [],
      emotion: '',
      lastFocusedEmotion: '',
      initialIntensity: 8,
      bodyZones: [],
      physicalShape: '',
      physicalTemp: '',
      thought: '',
      reframedThought: '',
      postIntensity: 5,
      autopilotUrge: '',
      valueChosen: '',
      committedAction: '',
      carriedPassenger: '',
      savePassengerToBus: false,
      choiceType: 'value'
    };

    this.showThoughtExamples = false;
    this.showStep4Examples = false;
    this.showPassengerExamples = false;

    this.breathingTimer = null;
    this.breathingPhase = 'idle';
    this.breathingSecondsLeft = 4;
    this.breathingCyclesDone = 0;
    this.breathingPausedByUser = false;
    this.anchorBannerIndex = 0;
  }

  init() {
    this.render();
    this.bindEvents();
  }

  resetForm() {
    this.stopBreathing();
    this.currentStep = 1;
    this.showThoughtExamples = false;
    this.showStep4Examples = false;
    this.showPassengerExamples = false;
    this.emotionViewMode = 'wheel';
    this.activeEmotionFamily = 'Ira';
    this.emotionSearchQuery = '';
    this.entryData = {
      emotions: [],
      emotion: '',
      lastFocusedEmotion: '',
      initialIntensity: 8,
      bodyZones: [],
      physicalShape: '',
      physicalTemp: '',
      thought: '',
      reframedThought: '',
      postIntensity: 5,
      autopilotUrge: '',
      valueChosen: '',
      committedAction: '',
      carriedPassenger: '',
      savePassengerToBus: false,
      choiceType: 'value'
    };

    this.showThoughtExamples = false;
    this.showStep4Examples = false;
    this.showPassengerExamples = false;
    this.render();
    this.bindEvents();
  }

  setStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    if (this.currentStep === 2 && step !== 2) {
      this.stopBreathing();
    }
    this.currentStep = step;
    this.render();
    this.bindEvents();
  }

  render() {
    const container = document.getElementById('espacio-act-view');
    if (!container) return;

    const progressPercent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;

    let stepHtml = '';
    switch (this.currentStep) {
      case 1:
        stepHtml = this.renderStep1();
        break;
      case 2:
        stepHtml = this.renderStep2();
        break;
      case 3:
        stepHtml = this.renderStep3();
        break;
      case 4:
        stepHtml = this.renderStep4();
        break;
    }

    container.innerHTML = `
      <div class="view-plain-shell">
        <div class="card-header flex-between" style="margin-bottom: 12px;">
          <div class="title-with-help">
<h2 class="card-title" style="margin: 0;">El Espacio ACT</h2>
            <button type="button" class="help-info-trigger" data-help-topic="espacio-act" aria-label="Información de esta herramienta">ⓘ</button>
          </div>
          <span class="badge" style="background-color: rgba(87, 139, 116, 0.2); color: var(--sage-700)">
            Paso ${this.currentStep} de ${this.totalSteps}
          </span>
        </div>

        <!-- Step Indicator Bar -->
        <div class="step-bar-container with-labels">
          <div class="step-bar-track">
            <div class="step-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          ${[
            { n: 1, label: '1. Rueda Emocional' },
            { n: 2, label: '2. Identificación Física' },
            { n: 3, label: '3. Defusión Mental' },
            { n: 4, label: '4. Valores y Autobús' }
          ].map(st => `
            <div class="step-item">
              <div class="step-node ${this.currentStep >= st.n ? (this.currentStep === st.n ? 'active' : 'completed') : ''}" title="${st.label}">${st.n}</div>
              <span class="step-item-label ${this.currentStep === st.n ? 'active' : ''}">${st.label}</span>
            </div>
          `).join('')}
        </div>

        <div id="act-step-body">
          ${stepHtml}
        </div>
      </div>
    `;
  }

  toggleEmotion(emotionId) {
    if (!emotionId) return;
    if (!Array.isArray(this.entryData.emotions)) {
      this.entryData.emotions = [];
    }
    const idx = this.entryData.emotions.indexOf(emotionId);
    if (idx > -1) {
      this.entryData.emotions.splice(idx, 1);
      if (this.entryData.lastFocusedEmotion === emotionId) {
        this.entryData.lastFocusedEmotion = this.entryData.emotions[this.entryData.emotions.length - 1] || '';
      }
    } else {
      this.entryData.emotions.push(emotionId);
      this.entryData.lastFocusedEmotion = emotionId;
    }
    this.entryData.emotion = this.entryData.emotions.join(' + ');
  }

  getSelectedEmotionsLabel() {
    return (Array.isArray(this.entryData.emotions) && this.entryData.emotions.length > 0)
      ? this.entryData.emotions.join(' + ')
      : (this.entryData.emotion || 'esta emoción');
  }

  renderSelectedEmotionsBar() {
    const selected = Array.isArray(this.entryData.emotions) ? this.entryData.emotions : [];
    if (selected.length === 0) {
      return `
        <div class="selected-emotions-bar" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px;">
          <span style="font-style: italic;">Aún no has seleccionado ninguna emoción — puedes marcar una o varias abajo o usar un acceso rápido.</span>
          <button type="button" class="badge" id="btn-act-skip-unnamed" style="cursor: pointer; padding: 5px 10px; font-size: 0.74rem; border: 1px solid var(--sage-400); background: var(--bg-surface-elevated); color: var(--sage-700);">
            No sé nombrarla aún (Avanzar)
          </button>
        </div>
      `;
    }

    const chips = selected.map(em => {
      let famIcon ='';
      this.emotionFamilies.forEach(fam => {
        if (fam.id === em || fam.nuances.some(n => n.id === em)) {
          famIcon = fam.icon;
        }
      });
      const safeEm = em.replace(/"/g, '&quot;');
      return `
        <span class="badge" style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; font-size: 0.78rem; background: rgba(87, 139, 116, 0.18); color: var(--border-focus); border: 1px solid rgba(87, 139, 116, 0.35);">
          <span>${famIcon}</span>
          <strong>${em}</strong>
          <button type="button" data-remove-emotion="${safeEm}" aria-label="Quitar ${safeEm}" style="background: none; border: none; color: inherit; cursor: pointer; font-weight: 800; padding: 0 2px; line-height: 1; font-size: 0.85rem;">✕</button>
        </span>
      `;
    }).join('');

    return `
      <div class="selected-emotions-bar" style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 12px;">
        <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">Seleccionadas (${selected.length}):</span>
        ${chips}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 1: La Rueda de las Emociones (Vista Primaria) + Intensidad Inicial
  // -------------------------------------------------------------
  renderStep1() {
    const selected = Array.isArray(this.entryData.emotions) ? this.entryData.emotions : [];
    const focusedEmotion = this.entryData.lastFocusedEmotion || selected[selected.length - 1] || '';
    let activeNuanceDesc = '';
    let activeNuanceExample = '';
    if (focusedEmotion) {
      this.emotionFamilies.forEach(fam => {
        const found = fam.nuances.find(n => n.id === focusedEmotion);
        if (found) {
          activeNuanceDesc = found.desc;
          activeNuanceExample = found.example || '';
        }
      });
    }

    return `
      <!-- Acceso Rápido de Baja Fricción (Para picos de saturación) -->
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-left: 3.5px solid var(--sage-500); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 16px;">
        <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: space-between;">
          <div style="display: flex; flex-wrap: wrap; gap: 5px; align-items: center;">
            <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); margin-right: 2px;">Atajo rápido:</span>
            ${this.emotionFamilies.map(fam => {
              const isSel = selected.includes(fam.id);
              return `
                <button type="button" class="badge quick-family-chip ${isSel ? 'active' : ''}" data-quick-family="${fam.id}"
                        style="cursor: pointer; padding: 4px 9px; font-size: 0.74rem; border: 1px solid ${isSel ? 'var(--sage-500)' : 'var(--border-subtle)'}; background: ${isSel ? 'var(--sage-500)' : 'var(--bg-surface)'}; color: ${isSel ? '#fff' : 'var(--text-secondary)'};">
                  ${fam.icon} ${fam.id}
                </button>
              `;
            }).join('')}
          </div>
          <button type="button" class="btn-secondary" id="btn-act-overload-skip" style="font-size: 0.76rem; padding: 6px 12px; border-radius: var(--radius-full); border-color: var(--sage-400);">
            Saltar directo al Cuerpo (si estás muy saturado/a)
          </button>
        </div>
      </div>

      <!-- Emotion Wheel Header & Secondary View Action -->
      <div class="form-group">
        <div class="flex-between" style="margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div>
            <label class="form-label" style="margin-bottom: 0;">1. Nombra lo que sientes (toca 1 o varias emociones)</label>
            <p class="form-hint" style="margin-top: 2px;">
              ${activeNuanceDesc ? `<em>"${focusedEmotion}: ${activeNuanceDesc}"</em>` : 'Poner nombre exacto ayuda a tomar distancia de la ola.'}
              ${activeNuanceExample ?`<br/><span style="color: var(--sage-600); font-size: 0.78rem;">${activeNuanceExample}</span>` :''}
            </p>
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
            <button type="button" class="btn-secondary" id="btn-maximize-wheel" style="font-size: 0.78rem; padding: 6px 13px; border-radius: var(--radius-full);">
              Ampliar Rueda
            </button>
            ${this.emotionViewMode === 'wheel' ? `
              <button type="button" class="btn-secondary mode-toggle-btn" data-emotion-mode="chips" style="font-size: 0.78rem; padding: 6px 13px; border-radius: var(--radius-full);">
                Ver en Lista / Buscar
              </button>
            ` : `
              <button type="button" class="btn-primary mode-toggle-btn" data-emotion-mode="wheel" style="font-size: 0.78rem; padding: 6px 14px; border-radius: var(--radius-full);">
                Volver a Rueda
              </button>
            `}
          </div>
        </div>

        ${this.renderSelectedEmotionsBar()}

        <!-- Render Primary Wheel or Secondary Chips View -->
        ${this.emotionViewMode === 'wheel' ? this.renderCircularEmotionWheel(false) : this.renderChipsEmotionWheel()}
      </div>

      <!-- Initial Intensity Slider -->
      <div class="slider-group mt-4">
        <div class="slider-header">
          <label class="form-label" style="margin-bottom: 0;">Intensidad del malestar presente</label>
          <span class="slider-val-badge" id="val-act-intensity">${this.entryData.initialIntensity}/10</span>
        </div>
        <input type="range" class="range-slider" id="slider-act-intensity" min="1" max="10" value="${this.entryData.initialIntensity}">
      </div>

      <div class="btn-group">
        <button type="button" class="btn-primary" id="btn-act-next-1">
          Paso 2: Identificación Física en el Cuerpo
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // CIRCULAR RADIAL EMOTION WHEEL GENERATOR (SVG)
  // -------------------------------------------------------------
  renderCircularEmotionWheel(isMaximized = false) {
    const selectedList = Array.isArray(this.entryData.emotions) ? this.entryData.emotions : [];
    const cx = 260;
    const cy = 260;
    const rIn = 58;
    const rMid = 114;
    const rOut = 232;

    // Helper polar to cartesian
    const p2c = (radius, angleInDeg) => {
      const rad = (angleInDeg - 90) * Math.PI / 180.0;
      return {
        x: cx + (radius * Math.cos(rad)),
        y: cy + (radius * Math.sin(rad))
      };
    };

    // Annular sector path builder
    const arcPath = (r1, r2, a1, a2) => {
      const p1 = p2c(r2, a2);
      const p2 = p2c(r2, a1);
      const p3 = p2c(r1, a2);
      const p4 = p2c(r1, a1);
      const sweep = (a2 - a1) <= 180 ? 0 : 1;
      return `M ${p1.x} ${p1.y} A ${r2} ${r2} 0 ${sweep} 0 ${p2.x} ${p2.y} L ${p4.x} ${p4.y} A ${r1} ${r1} 0 ${sweep} 1 ${p3.x} ${p3.y} Z`;
    };

    // Paletas orgánicas de tonos medios-profundos para alto contraste WCAG AA+ con texto blanco
    const palettes = {
      Ira: ['#994131', '#a54b3a', '#b05544', '#8f3b2b', '#9c4535', '#a8503f', '#933f30'],
      Miedo: ['#965d2e', '#a16737', '#ac7140', '#8b5325', '#975f30', '#a36939', '#8e5728'],
      Tristeza: ['#3f5a6c', '#486477', '#526e82', '#365061', '#415c6e', '#4b6678', '#395365'],
      'Aversión': ['#6b4b32', '#76553b', '#815f44', '#604129', '#6d4d34', '#78573d', '#63442b'],
      Sorpresa: ['#3b6372', '#446d7c', '#4e7786', '#325967', '#3d6574', '#476f7e', '#355c6a'],
      'Alegría / Paz': ['#34614f', '#3d6b58', '#467662', '#2b5645', '#366351', '#406d5a', '#2e5947'],
      // Aliases de respaldo
      Injusticia: ['#6b4b32', '#76553b', '#815f44', '#604129', '#6d4d34', '#78573d', '#63442b'],
      Bloqueo: ['#3b6372', '#446d7c', '#4e7786', '#325967', '#3d6574', '#476f7e', '#355c6a'],
      Paz: ['#34614f', '#3d6b58', '#467662', '#2b5645', '#366351', '#406d5a', '#2e5947']
    };

    const innerFamilyColors = {
      Ira: '#7c3224',
      Miedo: '#7a4921',
      Tristeza: '#314959',
      'Aversión': '#553a25',
      Sorpresa: '#2d4f5c',
      'Alegría / Paz': '#264d3e',
      Injusticia: '#553a25',
      Bloqueo: '#2d4f5c',
      Paz: '#264d3e'
    };

    let innerSlicesHtml = '';
    let outerSlicesHtml = '';

    this.emotionFamilies.forEach((fam, i) => {
      const famStart = i * 60;
      const famEnd = (i + 1) * 60;

      // Inner Family Slice (Nivel 1: No seleccionable, solo orientativo para concretar)
      const innerD = arcPath(rIn, rMid, famStart + 0.5, famEnd - 0.5);
      const innerMidA = famStart + 30;
      const innerPos = p2c(86, innerMidA);

      let innerLabelHtml = fam.id;
      let innerFontSize = '9.2';
      let innerY = innerPos.y + 10;
      if (fam.id.includes(' / ')) {
        const parts = fam.id.split(' / ');
        innerFontSize = '8.2';
        innerY = innerPos.y + 8;
        innerLabelHtml = `<tspan x="${innerPos.x}" dy="0">${parts[0]}</tspan><tspan x="${innerPos.x}" dy="1.05em">/ ${parts[1]}</tspan>`;
      }

      innerSlicesHtml += `
        <path d="${innerD}" fill="${innerFamilyColors[fam.id] || fam.color}" opacity="0.94" class="wheel-family-sector" data-wheel-family="${fam.id}" />
        <text x="${innerPos.x}" y="${innerPos.y - 7}" text-anchor="middle" font-size="13.5" style="pointer-events: none;">${fam.icon}</text>
        <text x="${innerPos.x}" y="${innerY}" text-anchor="middle" font-size="${innerFontSize}" class="wheel-family-label">${innerLabelHtml}</text>
      `;

      // Outer Nuance Slices (Nivel 2: Emociones concretas seleccionables con efecto lupa)
      const K = fam.nuances.length;
      const delta = 60 / K;
      const palette = palettes[fam.id] || palettes.Ira;

      fam.nuances.forEach((nuance, j) => {
        const nStart = famStart + j * delta;
        const nEnd = famStart + (j + 1) * delta;
        const outerD = arcPath(rMid + 3, rOut, nStart + 0.35, nEnd - 0.35);
        const isSel = selectedList.includes(nuance.id);

        // Label rotation & position: mathematically guaranteed upright text (rot in [-90, +90])
        const nMidA = nStart + delta / 2;
        const textPos = p2c(174.5, nMidA);
        let rot = (nMidA - 90) % 360;
        if (rot > 180) rot -= 360;
        if (rot < -180) rot += 360;
        if (rot > 90) rot -= 180;
        else if (rot < -90) rot += 180;

        const safeDesc = (nuance.desc || '').replace(/"/g, '&quot;');
        const safeExample = (nuance.example || '').replace(/"/g, '&quot;');

        // Una sola línea radial erguida adaptada al ancho del sector (42 emociones: 7 por familia)
        let labelFontSize = '8.1';
        if (nuance.id.length >= 15) {
          labelFontSize = '7.3';
        } else if (nuance.id.length > 13) {
          labelFontSize = '7.5';
        }

        outerSlicesHtml += `
          <g class="wheel-nuance-group ${isSel ? 'selected' : ''}" 
             data-act-emotion="${nuance.id}" 
             data-emotion-family="${fam.id}" 
             data-emotion-desc="${safeDesc}" 
             data-emotion-example="${safeExample}">
            <path d="${outerD}" fill="${palette[j % palette.length]}" class="wheel-slice ${isSel ? 'selected' : ''}" />
            <text x="${textPos.x}" y="${textPos.y}" text-anchor="middle" dominant-baseline="central" 
                  font-size="${labelFontSize}" class="wheel-slice-label" transform="rotate(${rot}, ${textPos.x}, ${textPos.y})">
              ${nuance.id}
            </text>
          </g>
        `;
      });
    });

    const selCount = selectedList.length;
    const focusedEm = this.entryData.lastFocusedEmotion || selectedList[selCount - 1] || '';

    let activeFamilyIcon = selCount === 0 ?'' :'';
    if (focusedEm) {
      this.emotionFamilies.forEach(fam => {
        if (fam.id === focusedEm || fam.nuances.some(n => n.id === focusedEm)) {
          activeFamilyIcon = fam.icon;
        }
      });
    }

    const emotionLabel = selCount === 0 ? '¿Qué sientes?' : focusedEm;
    const subHubLabel = selCount === 0
      ? 'Elige 1 o varias'
      : (selCount === 1 ? '1 seleccionada' : `${selCount} seleccionadas`);

    const hasSplitCenter = selCount > 0 && emotionLabel.length > 12 && (emotionLabel.includes(' / ') || emotionLabel.includes(' '));
    let centerTextHtml = `
      <text x="260" y="261" text-anchor="middle" font-size="${selCount === 0 ? '11.4' : '12.2'}" font-weight="800" fill="var(--text-primary)">
        ${emotionLabel}
      </text>
    `;
    if (hasSplitCenter) {
      let part1 = '';
      let part2 = '';
      if (emotionLabel.includes(' / ')) {
        const parts = emotionLabel.split(' / ');
        part1 = parts[0];
        part2 = '/ ' + parts.slice(1).join(' / ');
      } else {
        const parts = emotionLabel.split(' ');
        part1 = parts[0];
        part2 = parts.slice(1).join(' ');
      }
      centerTextHtml = `
        <text x="260" y="255" text-anchor="middle" font-size="10.4" font-weight="800" fill="var(--text-primary)">
          <tspan x="260" dy="0">${part1}</tspan>
          <tspan x="260" dy="1.15em">${part2}</tspan>
        </text>
      `;
    }

    return `
      <div class="emotion-wheel-container">
        <svg class="emotion-wheel-svg" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Nuance Ring (Nivel 2: Seleccionable con zoom lupa) -->
          <g class="wheel-outer-ring">
            ${outerSlicesHtml}
          </g>

          <!-- Inner Family Ring (Nivel 1: Solo orientativo, fuerza a concretar afuera) -->
          <g class="wheel-inner-ring">
            ${innerSlicesHtml}
          </g>

          <!-- Center Hub Indicator -->
          <g class="wheel-center-hub">
            <circle cx="260" cy="260" r="54" fill="var(--bg-surface)" stroke="var(--sage-500)" stroke-width="2.5" />
            <text x="260" y="241" text-anchor="middle" font-size="19">${activeFamilyIcon}</text>
            ${centerTextHtml}
            <text x="260" y="284" text-anchor="middle" font-size="8.6" font-weight="600" fill="var(--border-focus)">
              ${subHubLabel}
            </text>
          </g>
        </svg>

        <!-- Hover Example Tooltip (desktop: populated on hover, mobile: populated on tap) -->
        <div ${isMaximized ? '' : 'id="wheel-hover-example"'} class="wheel-hover-example" style="min-height: 36px; text-align: center; font-size: 0.82rem; color: var(--text-tertiary); font-style: italic; padding: 8px 14px; transition: all 0.25s ease;">
          Pasa el ratón por el anillo exterior para ampliar y ver un ejemplo identificador.
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // CHIPS / LIST EMOTION WHEEL GENERATOR
  // -------------------------------------------------------------
  renderChipsEmotionWheel() {
    return `
      <div style="margin-bottom: 12px;">
<input type="text" id="input-search-emotion" class="form-input" style="padding: 8px 14px; font-size: 0.88rem;" placeholder="Filtrar o buscar emoción exacta (ej. culpa, resentimiento, desamparo, vacío)..." value="${this.emotionSearchQuery}">
      </div>

      <!-- Family Petals -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 12px;">
        ${this.emotionFamilies.map(fam => `
          <button type="button" class="badge wheel-family-btn ${this.activeEmotionFamily === fam.id ? 'active' : ''}" 
                  data-wheel-family="${fam.id}" 
                  style="cursor: pointer; border: 1px solid var(--border-subtle); padding: 7px 12px; white-space: nowrap; font-size: 0.82rem; background: ${this.activeEmotionFamily === fam.id ? 'var(--sage-500)' : 'var(--bg-surface-elevated)'}; color: ${this.activeEmotionFamily === fam.id ? '#fff' : 'var(--text-secondary)'};">
            <span>${fam.icon}</span> <span>${fam.label}</span>
          </button>
        `).join('')}
      </div>

      <!-- Nuanced Emotions Grid -->
      <div class="chip-grid" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-bottom: 16px;">
        ${this.getFilteredNuances().map(n => `
          <button type="button" class="chip-btn ${(this.entryData.emotions || []).includes(n.id) ? 'selected' : ''}" data-act-emotion="${n.id}" title="${(n.example || '').replace(/"/g, '&quot;')}" style="padding: 10px 8px;">
            <span style="font-weight: 700; font-size: 0.88rem;">${n.id}</span>
            <small style="font-size: 0.68rem; color: var(--text-muted); line-height: 1.2;">${n.desc}</small>
            ${n.example ? `<small style="font-size: 0.66rem; color: var(--sage-600); font-style: italic; line-height: 1.2; margin-top: 3px;">${n.example}</small>` : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  getFilteredNuances() {
    if (this.emotionSearchQuery.trim()) {
      const q = this.emotionSearchQuery.toLowerCase();
      const allNuances = [];
      this.emotionFamilies.forEach(f => {
        f.nuances.forEach(n => {
          if (n.id.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q)) {
            allNuances.push(n);
          }
        });
      });
      return allNuances;
    }
    const currentFamily = this.emotionFamilies.find(f => f.id === this.activeEmotionFamily) || this.emotionFamilies[0];
    return currentFamily.nuances;
  }

  // -------------------------------------------------------------
  // STEP 2: Identificación Física de la Emoción y Apertura Somática
  // -------------------------------------------------------------
  renderStep2() {
    const allZones = ['Cabeza', 'Mandíbula/Garganta', 'Hombros/Cuello', 'Pecho/Corazón', 'Estómago/Plexo', 'Espalda', 'Brazos/Manos', 'Piernas/Pies'];

    return `
      <div class="desktop-two-col">
        <div class="form-group">
          <label class="form-label" style="font-size: 1.02rem; margin-bottom: 4px;">
            2. Identificación Física de «${this.getSelectedEmotionsLabel()}» en tu Cuerpo
          </label>

          <!-- Somatic Body Map -->
          <div class="body-map-container mt-3">
            <svg class="body-silhouette-svg" viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg">
              <path id="zone-Cabeza" class="body-zone ${this.entryData.bodyZones.includes('Cabeza') ? 'active' : ''}"
                    d="M 100 20 C 85 20, 80 35, 80 50 C 80 65, 88 75, 100 75 C 112 75, 120 65, 120 50 C 120 35, 115 20, 100 20 Z" />
              <path id="zone-Mandibula" class="body-zone ${this.entryData.bodyZones.includes('Mandíbula/Garganta') ? 'active' : ''}"
                    d="M 92 75 L 108 75 L 108 90 L 92 90 Z" />
              <path id="zone-Hombros" class="body-zone ${this.entryData.bodyZones.includes('Hombros/Cuello') ? 'active' : ''}"
                    d="M 65 90 Q 100 85, 135 90 L 145 110 L 55 110 Z" />
              <path id="zone-Pecho" class="body-zone ${this.entryData.bodyZones.includes('Pecho/Corazón') ? 'active' : ''}"
                    d="M 70 110 L 130 110 L 125 150 L 75 150 Z" />
              <path id="zone-Estomago" class="body-zone ${this.entryData.bodyZones.includes('Estómago/Plexo') ? 'active' : ''}"
                    d="M 75 150 L 125 150 L 120 190 L 80 190 Z" />
              <path id="zone-Brazos" class="body-zone ${this.entryData.bodyZones.includes('Brazos/Manos') ? 'active' : ''}"
                    d="M 55 110 L 40 180 L 48 185 L 68 120 Z M 145 110 L 160 180 L 152 185 L 132 120 Z" />
              <path id="zone-Espalda" class="body-zone ${this.entryData.bodyZones.includes('Espalda') ? 'active' : ''}"
                    d="M 80 190 L 120 190 L 125 215 L 75 215 Z" />
              <path id="zone-Piernas" class="body-zone ${this.entryData.bodyZones.includes('Piernas/Pies') ? 'active' : ''}"
                    d="M 78 215 L 94 215 L 90 295 L 75 295 Z M 106 215 L 122 215 L 125 295 L 110 295 Z" />
            </svg>

            <div class="selected-zones-list">
              ${allZones.map(z => `
                <span class="zone-tag" style="cursor: pointer; opacity: ${this.entryData.bodyZones.includes(z) ? '1' : '0.5'}" data-zone-chip="${z}">
                  ${this.entryData.bodyZones.includes(z) ? '✓ ' : '+ '} ${z}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <div>
          <!-- Exercise #1: Physicalizing Emotions (Steven C. Hayes) -->
          <div class="form-group" style="background: var(--bg-surface-elevated); padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="title-with-help" style="margin-bottom: 8px;">
              <label class="form-label" style="font-size: 0.92rem; margin-bottom: 0;">
                Fisicalizar la Sensación (Técnica de Steven C. Hayes)
              </label>
              <button type="button" class="help-info-trigger" data-help-topic="fisicalizar" aria-label="Información de esta herramienta">ⓘ</button>
            </div>

            <div style="margin-bottom: 8px;">
              <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 5px;">Forma / Textura:</span>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${['Bloque pesado','Nudo apretado','Presión ardiente','Hueco / Vacío','Corriente eléctrica'].map(shape =>`
                  <button type="button" class="badge phys-chip-btn ${this.entryData.physicalShape === shape ? 'active' : ''}"
                          data-phys-shape="${shape}"
                          style="cursor: pointer; padding: 5px 11px; font-size: 0.78rem; border: 1px solid ${this.entryData.physicalShape === shape ? 'var(--sage-500)' : 'var(--border-subtle)'}; background: ${this.entryData.physicalShape === shape ? 'var(--sage-500)' : 'var(--bg-surface)'}; color: ${this.entryData.physicalShape === shape ? '#fff' : 'var(--text-secondary)'};">
                    ${shape}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 5px;">Temperatura / Dinamismo:</span>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${['Caliente / Hirviendo','Fría / Helada','Girando / Pulsante','Rígida / Inmóvil'].map(temp =>`
                  <button type="button" class="badge phys-chip-btn ${this.entryData.physicalTemp === temp ? 'active' : ''}"
                          data-phys-temp="${temp}"
                          style="cursor: pointer; padding: 5px 11px; font-size: 0.78rem; border: 1px solid ${this.entryData.physicalTemp === temp ? 'var(--sage-500)' : 'var(--border-subtle)'}; background: ${this.entryData.physicalTemp === temp ? 'var(--sage-500)' : 'var(--bg-surface)'}; color: ${this.entryData.physicalTemp === temp ? '#fff' : 'var(--text-secondary)'};">
                    ${temp}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

<!-- Hacerle Hueco (Aceptación Somática y Postura del SÍ) -->
          <div class="form-group mt-4 text-center" style="background: var(--bg-surface-elevated); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <label class="form-label" style="font-size: 0.94rem; margin-bottom: 4px;">
              Hacerle Hueco en el Cuerpo
            </label>
            <p class="form-hint" style="max-width: 480px; margin: 0 auto 12px; line-height: 1.4;">
              Respira para hacer espacio a la sensación sin pelear contra ella.
            </p>

            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 12px;">
              <button type="button" class="btn-secondary" id="btn-open-somatic-posture" style="font-size: 0.82rem; border-color: var(--sage-400); background: var(--bg-surface); padding: 7px 14px;">
                Practicar la Postura Somática del"SÍ" (Steven Hayes)
              </button>
              ${(() => {
                const st = window.stateManager.getSettings();
                const vibOn = st.vibration !== false;
                const sndOn = st.sound === true;
                return `
                  <button type="button" class="btn-secondary" id="btn-toggle-haptic" style="font-size: 0.78rem; padding: 6px 12px; border-color: ${vibOn ? 'var(--sage-500)' : 'var(--border-subtle)'};">
                    Vibración guía: ${vibOn ?'Sí' :'No'}
                  </button>
                  <button type="button" class="btn-secondary" id="btn-toggle-sound" style="font-size: 0.78rem; padding: 6px 12px; border-color: ${sndOn ? 'var(--sage-500)' : 'var(--border-subtle)'};">
                    Tonos ojos cerrados: ${sndOn ?'Sí' :'No'}
                  </button>
                `;
              })()}
            </div>

            <div class="breathing-pacer-container mt-2">
              <div class="breathing-circle-outer">
                <div class="breathing-ring"></div>
                <div class="breathing-orb ${this.breathingPhase}" id="breathing-orb">
                  <span id="breathing-countdown">${this.breathingSecondsLeft || 4}</span>
                </div>
              </div>

              <div class="breathing-phase-label" id="breathing-phase-text">Inhala profundamente</div>
              <div class="breathing-instruction" id="breathing-instruction-text">Expande suavemente alrededor de la sensación...</div>

              <div class="mt-3">
                <button type="button" class="btn-secondary" id="btn-toggle-breathing" style="font-size: 0.82rem; padding: 5px 14px;">
                  ${this.breathingPausedByUser ? 'Reanudar Respiración Guiada' : 'Pausar Respiración Guiada'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-act-prev-2">← Volver a la Rueda</button>
        <button type="button" class="btn-primary" id="btn-act-next-2">
          Paso 3: Desarmar la Mente (Defusión)
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderPersonalAnchorBanner() {
    const profile = window.stateManager.getProfile();
    const anchors = window.stateManager.getAnchors();
    const primaryValue = (profile.coreValues && profile.coreValues[0]) ? profile.coreValues[0] : null;
    const anchor = anchors.length > 0 ? anchors[this.anchorBannerIndex % anchors.length] : null;
    if (!primaryValue && !anchor) return '';

    const esc = window.KhoraUtils.escapeHtml;

    return `
      <div class="personal-anchor-banner" style="background: rgba(87, 139, 116, 0.1); border: 1px solid var(--sage-400); border-left: 4px solid var(--sage-600); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 16px;">
        <div class="flex-between" style="flex-wrap: wrap; gap: 6px; margin-bottom: 6px;">
          <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: var(--sage-700);">
            Tu Faro Personal y Tarjeta de Anclaje ACT
          </span>
          ${anchors.length > 1 ? `
            <button type="button" class="btn-secondary" id="btn-rotate-anchor-banner" style="font-size: 0.72rem; padding: 3px 10px;">
              Otra tarjeta de anclaje
            </button>
          ` : ''}
        </div>
        ${primaryValue ? `
          <div style="font-size: 0.82rem; color: var(--text-primary); margin-bottom: ${anchor ? '6px' : '0'};">
            <strong>Valor elegido (${esc(primaryValue.domain)}):</strong> «${esc(primaryValue.statement)}»
          </div>
        ` : ''}
        ${anchor ? `
          <div id="espacio-anchor-quote" style="font-size: 0.83rem; font-style: italic; color: var(--text-secondary); line-height: 1.45;">
            "${esc(anchor.text)}" <span style="font-style: normal; font-size: 0.74rem; color: var(--text-muted);">— ${esc(anchor.author)} (${esc(anchor.category)})</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 3: Defusión Cognitiva (Separarte del Pensamiento + Re-evaluar Intensidad)
  // -------------------------------------------------------------
  renderStep3() {
    const rawThought = this.entryData.thought || '';
    const cleanThought = rawThought.trim() || '[tu pensamiento]';
    const mindName = window.stateManager.getMindName();

    const reframing1 = `Estoy teniendo el pensamiento de que ${cleanThought}.`;
    const reframing2 = `Observo con curiosidad que ${mindName} (mi mente) me está contando la historia de que ${cleanThought}.`;
    const reframing3 = `Agradezco a ${mindName} por intentar protegerme creyendo que ${cleanThought}.`;

    const quickThoughts = [
      'Se van a enfadar si digo que no',
      'Soy egoísta por priorizarme',
      'Tengo que poder con todo sin fallar',
      'No voy a ser capaz de sostener esto',
      'Si no cedo, me van a rechazar'
    ];

    return `
      ${this.renderPersonalAnchorBanner()}
      <div class="form-group">
        <div class="flex-between" style="flex-wrap: wrap; gap: 6px;">
          <label class="form-label" for="act-thought-input" style="margin-bottom: 0;">3. ¿Qué pensamiento te repite «${mindName}»?</label>
          <button type="button" class="btn-secondary" id="btn-edit-mind-name" style="font-size: 0.75rem; padding: 4px 10px;">
            Apodo:<strong>«${mindName}»</strong>
          </button>
        </div>
        <textarea id="act-thought-input" class="form-textarea mt-2" rows="2" style="min-height: 70px;" placeholder="Escribe el pensamiento que te atrapa ahora mismo...">${rawThought}</textarea>
        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-act-toggle-thought-examples" style="font-size: 0.78rem;">
            ${this.showThoughtExamples ?'▴ Ocultar ejemplos' :'¿Bloqueado? Ver ejemplos de pensamientos'}
          </button>
          ${this.showThoughtExamples ? `
            <div class="quick-chips-row" style="margin-top: 8px;">
              ${quickThoughts.map(qt => `
                <button type="button" class="quick-fill-chip ${rawThought.trim() === qt ? 'active' : ''}" data-quick-thought="${qt.replace(/"/g, '&quot;')}">
                  "${qt}"
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Real-time Defusion Cards -->
      <div class="form-group mt-4">
        <div class="title-with-help" style="margin-bottom: 8px;">
          <label class="form-label" style="margin-bottom: 0;">Fórmulas de Distanciamiento ACT (Yo Observador vs. ${mindName})</label>
          <button type="button" class="help-info-trigger" data-help-topic="defusion-act" aria-label="Información de esta herramienta">ⓘ</button>
        </div>
        
        <div class="defusion-card-group">
          <div class="defusion-reframing-card" style="cursor: pointer;" id="defusion-card-1">
            <div class="defusion-badge">1. Nombrar el Proceso Mental</div>
            <div class="defusion-text" id="def-text-1">"${reframing1}"</div>
          </div>

          <div class="defusion-reframing-card" style="cursor: pointer;" id="defusion-card-2">
            <div class="defusion-badge">2. La Historia de ${mindName}</div>
            <div class="defusion-text" id="def-text-2">"${reframing2}"</div>
          </div>

          <div class="defusion-reframing-card" style="cursor: pointer;" id="defusion-card-3">
            <div class="defusion-badge">3. Gratitud y No-Lucha</div>
            <div class="defusion-text" id="def-text-3">"${reframing3}"</div>
          </div>
        </div>
      </div>

      <!-- Interactive Leaves on a Stream Exercise -->
      <div class="form-group mt-4">
        <label class="form-label">Ejercicio Visual: Hojas en el Río</label>
        
        <div class="stream-container">
          <div class="stream-water-lines"></div>
          <div class="floating-leaf" id="floating-leaf-thought">
<span></span>
            <span id="floating-leaf-text">${cleanThought}</span>
          </div>
        </div>
      </div>

      <!-- Post-Defusion Intensity Check -->
      <div class="slider-group mt-4" style="background: var(--bg-surface-elevated); padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div class="slider-header">
          <label class="form-label" style="margin-bottom: 0;">¿Cómo está la intensidad ahora? (antes: ${this.entryData.initialIntensity}/10)</label>
          <span class="slider-val-badge" id="val-act-post-intensity">${this.entryData.postIntensity}/10</span>
        </div>
        <input type="range" class="range-slider" id="slider-act-post-intensity" min="1" max="10" value="${this.entryData.postIntensity}">
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-act-prev-3">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-next-3">
          Paso 4: Valores y Autobús ACT
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 4: Dirección de Valores vs. Piloto Automático
  // -------------------------------------------------------------
  renderStep4() {
    const profile = window.stateManager.getProfile();
    const profileValues = (profile.coreValues || []).map(v => `${v.domain}: ${v.statement.slice(0, 32)}${v.statement.length > 32 ? '…' : ''}`);
    const baseValues = [
      'Dignidad', 'Autocuidado', 'Honestidad', 'Límites Sanos', 
      'Valentía', 'Respeto mutuo', 'Calma', 'Autenticidad', 'Compasión'
    ];
    const valuesList = [...new Set([...profileValues, ...baseValues])];

    const savedPassengers = (profile.busPassengers || [])
      .filter(p => p.status !== 'integrated')
      .map(p => p.name);
    const livePassengers = [
      'El miedo a que se enfade o ponga mala cara',
      `La voz de ${window.stateManager.getMindName()} diciendo que soy egoísta`,
      `La sensación de ${this.entryData.physicalShape || 'tensión'} en ${this.entryData.bodyZones[0] || 'el cuerpo'}`
    ];
    const escAttr = (s) => String(s || '').replace(/"/g, '&quot;');

    return `
      ${this.renderPersonalAnchorBanner()}
      <div class="form-group">
        <label class="form-label">El Cruce de Caminos: Piloto Automático vs. Tus Valores</label>

        <!-- Showdown Cards -->
        <div class="choice-showdown-grid">
          <!-- Autopilot Column -->
          <div class="choice-box ${this.entryData.choiceType === 'autopilot' ? 'selected-autopilot' : ''}" id="choice-autopilot-box">
            <div>
<span class="choice-badge autopilot">Piloto Automático</span>
              <textarea id="act-autopilot-urge" class="form-textarea mt-2" style="min-height: 62px;" placeholder="¿Qué te pide el reflejo rápido?">${this.entryData.autopilotUrge}</textarea>
              ${this.showStep4Examples ? `
                <div class="quick-chips-row" style="margin-top: 8px; margin-bottom: 4px;">
                  ${['Callarme y ceder', 'Justificarme de más', 'Contestar a la defensiva', 'Huir o posponer'].map(ap => `
                    <button type="button" class="quick-fill-chip ${this.entryData.autopilotUrge === ap ? 'active' : ''}" data-quick-autopilot="${escAttr(ap)}">
                      ${ap}
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            <button type="button" class="btn-secondary mt-2" id="btn-select-autopilot" style="width: 100%; font-size: 0.85rem;">
              ${this.entryData.choiceType === 'autopilot' ? '✓ Seleccionado' : 'Esta vez caí en piloto'}
            </button>
          </div>

          <!-- Value Column -->
          <div class="choice-box ${this.entryData.choiceType === 'value' ? 'selected-value' : ''}" id="choice-value-box">
            <div>
<span class="choice-badge value">Opción con Valores</span>

              ${profileValues.length > 0 ? `
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; margin-bottom: 6px;">
                  ${profileValues.map(val => `
                    <span class="zone-tag" style="cursor: pointer; ${this.entryData.valueChosen === val ? 'background-color: var(--sage-500); color: #fff;' : ''}" data-val-chip="${escAttr(val)}">
                      ${val}
                    </span>
                  `).join('')}
                </div>
              ` : ''}

              <input type="text" id="act-custom-value" class="form-input mt-2" style="font-size: 0.84rem; padding: 7px 10px;"
                     value="${escAttr(this.entryData.valueChosen)}"
                     placeholder="Valor guía (ej: Honestidad, Presencia, Cuidado...)">

              ${this.showStep4Examples ? `
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; margin-bottom: 6px;">
                  ${baseValues.map(val => `
                    <span class="zone-tag" style="cursor: pointer; ${this.entryData.valueChosen === val ? 'background-color: var(--sage-500); color: #fff;' : ''}" data-val-chip="${escAttr(val)}">
                      ${val}
                    </span>
                  `).join('')}
                </div>
                <div class="quick-chips-row" style="margin-top: 4px; margin-bottom: 6px;">
                  ${['Respirar y responder en 15 min', 'Expresar mi postura con calma', 'Priorizar mi descanso', 'Hablar con cariño y firmeza'].map(ca => `
                    <button type="button" class="quick-fill-chip ${this.entryData.committedAction === ca ? 'active' : ''}" data-quick-committed="${escAttr(ca)}">
                      + ${ca}
                    </button>
                  `).join('')}
                </div>
              ` : ''}

              <textarea id="act-committed-action" class="form-textarea mt-2" style="min-height: 62px;" placeholder="Micro-acción concreta que eliges dar...">${this.entryData.committedAction}</textarea>
            </div>
            <button type="button" class="btn-primary mt-2" id="btn-select-value" style="width: 100%; font-size: 0.85rem;">
              ${this.entryData.choiceType === 'value' ? '✓ Elijo este Valor' : 'Comprometerme con mi Valor'}
            </button>
          </div>
        </div>

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-act-toggle-step4-examples" style="font-size: 0.78rem;">
            ${this.showStep4Examples ?'▴ Ocultar ejemplos' :'¿Bloqueado? Ver ejemplos de respuestas, valores y acciones'}
          </button>
        </div>
      </div>

      <!-- Exercise #2: Passengers on the Bus / Carrying Your Cards (Steven C. Hayes) -->
      <div class="form-group mt-4" style="background: var(--bg-surface-elevated); padding: 15px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); border-left: 4px solid var(--sage-500);">
        <label class="form-label" style="font-size: 0.92rem; margin-bottom: 8px;">
          El Pasajero en el Autobús (Disposición ACT — Steven C. Hayes)
        </label>

        ${savedPassengers.length > 0 ? `
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
            ${savedPassengers.map(p => `
              <button type="button" class="badge passenger-chip-btn ${this.entryData.carriedPassenger === p ? 'active' : ''}"
                      data-passenger-chip="${escAttr(p)}"
                      style="cursor: pointer; padding: 5px 10px; font-size: 0.76rem; white-space: normal; text-align: left; border: 1px solid ${this.entryData.carriedPassenger === p ? 'var(--sage-500)' : 'var(--border-subtle)'}; background: ${this.entryData.carriedPassenger === p ? 'var(--sage-500)' : 'var(--bg-surface)'}; color: ${this.entryData.carriedPassenger === p ? '#fff' : 'var(--text-secondary)'};">
                ${p}
              </button>
            `).join('')}
          </div>
        ` : ''}

        <input type="text" id="act-passenger-input" class="form-input" style="font-size: 0.85rem; padding: 8px 12px;"
               placeholder="¿Qué pensamiento o sensación incómoda llevas contigo mientras avanzas?"
               value="${escAttr(this.entryData.carriedPassenger || '')}">

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-act-toggle-passenger-examples" style="font-size: 0.78rem;">
            ${this.showPassengerExamples ?'▴ Ocultar ejemplos' :'Ver ejemplos de pasajeros'}
          </button>
          ${this.showPassengerExamples ? `
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              ${livePassengers.map(p => `
                <button type="button" class="badge passenger-chip-btn ${this.entryData.carriedPassenger === p ? 'active' : ''}"
                        data-passenger-chip="${escAttr(p)}"
                        style="cursor: pointer; padding: 5px 10px; font-size: 0.76rem; white-space: normal; text-align: left; border: 1px solid ${this.entryData.carriedPassenger === p ? 'var(--sage-500)' : 'var(--border-subtle)'}; background: ${this.entryData.carriedPassenger === p ? 'var(--sage-500)' : 'var(--bg-surface)'}; color: ${this.entryData.carriedPassenger === p ? '#fff' : 'var(--text-secondary)'};">
                  ${p}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <label style="display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 0.78rem; color: var(--text-secondary); cursor: pointer;">
          <input type="checkbox" id="chk-save-passenger-to-bus" ${this.entryData.savePassengerToBus ? 'checked' : ''} style="width: 16px; height: 16px;">
<span>Dejar este pasajero fichado en<strong>"Mi Autobús"</strong> (Valores y Rutina) para seguir trabajándolo a medio plazo</span>
        </label>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-act-prev-4">Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-save">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Completar Procesamiento ACT
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // Breathing Timer Logic
  // -------------------------------------------------------------
  notifyBreathingPhase(phase) {
    if (phase === 'inhale') {
      window.app?.triggerHaptic([70]);
      window.app?.playGentleTone(432, 500);
    } else if (phase === 'hold') {
      window.app?.triggerHaptic([40, 40]);
      window.app?.playGentleTone(528, 350);
    } else if (phase === 'exhale') {
      window.app?.triggerHaptic([130]);
      window.app?.playGentleTone(396, 650);
    } else {
      window.app?.triggerHaptic([30]);
    }
  }

  startBreathing() {
    this.stopBreathing();
    this.breathingPhase = 'inhale';
    this.breathingSecondsLeft = 4;
    this.updateBreathingUI();
    this.notifyBreathingPhase(this.breathingPhase);

    this.breathingTimer = setInterval(() => {
      this.breathingSecondsLeft--;
      if (this.breathingSecondsLeft <= 0) {
        if (this.breathingPhase === 'inhale') {
          this.breathingPhase = 'hold';
          this.breathingSecondsLeft = 4;
        } else if (this.breathingPhase === 'hold') {
          this.breathingPhase = 'exhale';
          this.breathingSecondsLeft = 6;
        } else if (this.breathingPhase === 'exhale') {
          this.breathingPhase = 'rest';
          this.breathingSecondsLeft = 2;
        } else {
          this.breathingPhase = 'inhale';
          this.breathingSecondsLeft = 4;
          this.breathingCyclesDone++;
        }
        this.notifyBreathingPhase(this.breathingPhase);
      }
      this.updateBreathingUI();
    }, 1000);
  }

  stopBreathing() {
    if (this.breathingTimer) {
      clearInterval(this.breathingTimer);
      this.breathingTimer = null;
    }
  }

  updateBreathingUI() {
    const orb = document.getElementById('breathing-orb');
    const countdown = document.getElementById('breathing-countdown');
    const phaseText = document.getElementById('breathing-phase-text');
    const instructionText = document.getElementById('breathing-instruction-text');

    if (!orb || !countdown) return;

    countdown.textContent = this.breathingSecondsLeft;
    orb.className = `breathing-orb ${this.breathingPhase}`;

    if (this.breathingPhase === 'inhale') {
      phaseText.textContent = 'Inhala suavemente';
      instructionText.textContent = 'Deja entrar el aire, siente el espacio en tu interior...';
    } else if (this.breathingPhase === 'hold') {
      phaseText.textContent = 'Mantén la calma';
      instructionText.textContent = 'Observa sin juzgar lo que está presente en tu cuerpo...';
    } else if (this.breathingPhase === 'exhale') {
      phaseText.textContent = 'Exhala soltando la lucha';
      instructionText.textContent = 'Hazle hueco a la incomodidad, no necesitas pelear contra la ola...';
    } else {
      phaseText.textContent = 'Pausa serena';
      instructionText.textContent = 'Descansa en el presente antes del próximo aliento...';
    }
  }

  // -------------------------------------------------------------
  // Event Binding
  // -------------------------------------------------------------
  bindEvents() {
    const viewRoot = document.getElementById('espacio-act-view') || document;

    // Maximize Wheel modal trigger
    document.getElementById('btn-maximize-wheel')?.addEventListener('click', () => {
      this.openMaximizedWheelModal();
    });

    // Mode switcher buttons
    document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.emotionViewMode = e.currentTarget.dataset.emotionMode;
        this.render();
        this.bindEvents();
      });
    });

    // Emotion Search Input in chips mode
    const searchInput = document.getElementById('input-search-emotion');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.emotionSearchQuery = e.target.value;
        const nuancesContainer = viewRoot.querySelector('.chip-grid');
        if (nuancesContainer) {
          nuancesContainer.innerHTML = this.getFilteredNuances().map(n => `
            <button type="button" class="chip-btn ${(this.entryData.emotions || []).includes(n.id) ? 'selected' : ''}" data-act-emotion="${n.id}" title="${(n.example || '').replace(/"/g, '&quot;')}" style="padding: 10px 8px;">
              <span style="font-weight: 700; font-size: 0.88rem;">${n.id}</span>
              <small style="font-size: 0.68rem; color: var(--text-muted); line-height: 1.2;">${n.desc}</small>
              ${n.example ? `<small style="font-size: 0.66rem; color: var(--sage-600); font-style: italic; line-height: 1.2; margin-top: 3px;">${n.example}</small>` : ''}
            </button>
          `).join('');
          this.bindWheelInteraction(viewRoot, {
            bindFamilies: false,
            onMutate: () => {
              this.render();
              this.bindEvents();
            }
          });
        }
      });
    }

    this.bindWheelInteraction(viewRoot, {
      isChipsView: this.emotionViewMode === 'chips',
      onMutate: () => {
        this.render();
        this.bindEvents();
      }
    });

    // Intensity slider
    const intensitySlider = document.getElementById('slider-act-intensity');
    const intensityBadge = document.getElementById('val-act-intensity');
    if (intensitySlider && intensityBadge) {
      intensitySlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.entryData.initialIntensity = val;
        intensityBadge.textContent = `${val}/10`;
      });
    }

    // Somatic zones
    const toggleZone = (zoneName) => {
      const idx = this.entryData.bodyZones.indexOf(zoneName);
      if (idx > -1) {
        this.entryData.bodyZones.splice(idx, 1);
      } else {
        this.entryData.bodyZones.push(zoneName);
      }
      this.render();
      this.bindEvents();
    };

    document.querySelectorAll('[data-zone-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        toggleZone(chip.dataset.zoneChip);
      });
    });

    const zoneMap = {
      'zone-Cabeza': 'Cabeza',
      'zone-Mandibula': 'Mandíbula/Garganta',
      'zone-Hombros': 'Hombros/Cuello',
      'zone-Pecho': 'Pecho/Corazón',
      'zone-Estomago': 'Estómago/Plexo',
      'zone-Brazos': 'Brazos/Manos',
      'zone-Espalda': 'Espalda',
      'zone-Piernas': 'Piernas/Pies'
    };

    Object.keys(zoneMap).forEach(svgId => {
      const el = document.getElementById(svgId);
      if (el) {
        el.addEventListener('click', () => {
          toggleZone(zoneMap[svgId]);
        });
      }
    });

    // Low-friction Step 1 access (Crisis overload & quick family selection)
    document.getElementById('btn-act-overload-skip')?.addEventListener('click', () => {
      if (!this.entryData.emotions || this.entryData.emotions.length === 0) {
        this.entryData.emotions = ['Desbordamiento'];
        this.entryData.lastFocusedEmotion = 'Desbordamiento';
        this.entryData.emotion = 'Desbordamiento';
      }
      this.breathingPausedByUser = false;
      this.setStep(2);
      window.app?.showToast('Pasando directo a hacer espacio en el cuerpo');
    });

    document.getElementById('btn-act-skip-unnamed')?.addEventListener('click', () => {
      if (!this.entryData.emotions || this.entryData.emotions.length === 0) {
        this.entryData.emotions = ['Malestar / Activación en curso'];
        this.entryData.lastFocusedEmotion = 'Malestar / Activación en curso';
        this.entryData.emotion = 'Malestar / Activación en curso';
      }
      this.breathingPausedByUser = false;
      this.setStep(2);
      window.app?.showToast('Avanzando al cuerpo sin forzar etiqueta');
    });

    document.querySelectorAll('.quick-family-chip[data-quick-family]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toggleEmotion(e.currentTarget.dataset.quickFamily);
        this.render();
        this.bindEvents();
      });
    });

    document.getElementById('btn-act-next-1')?.addEventListener('click', () => {
      if (!this.entryData.emotions || this.entryData.emotions.length === 0) {
        this.entryData.emotions = ['Malestar / Activación en curso'];
        this.entryData.lastFocusedEmotion = 'Malestar / Activación en curso';
        this.entryData.emotion = 'Malestar / Activación en curso';
        window.app?.showToast('Continuando sin etiqueta específica; puedes hacerle hueco en el cuerpo');
      }
      this.breathingPausedByUser = false;
      this.setStep(2);
    });

    // Step 2 Events (Body Map, Physicalizing, Somatic Posture & Breathing)
    if (this.currentStep === 2) {
      if (!this.breathingTimer && !this.breathingPausedByUser) {
        this.startBreathing();
      } else {
        this.updateBreathingUI();
      }

      document.getElementById('btn-open-somatic-posture')?.addEventListener('click', () => {
        this.openSomaticPostureModal();
      });

      document.getElementById('btn-toggle-haptic')?.addEventListener('click', (e) => {
        const st = window.stateManager.getSettings();
        const nextVal = st.vibration === false;
        st.vibration = nextVal;
        window.stateManager.saveSettings(st);
        e.currentTarget.textContent =`Vibración guía: ${nextVal ?'Sí' :'No'}`;
        e.currentTarget.style.borderColor = nextVal ? 'var(--sage-500)' : 'var(--border-subtle)';
        if (nextVal) window.app?.triggerHaptic([60]);
        window.app?.showToast(nextVal ? 'Vibración guía activada' : 'Vibración guía desactivada');
      });

      document.getElementById('btn-toggle-sound')?.addEventListener('click', (e) => {
        const st = window.stateManager.getSettings();
        const nextVal = st.sound !== true;
        st.sound = nextVal;
        window.stateManager.saveSettings(st);
        e.currentTarget.textContent =`Tonos ojos cerrados: ${nextVal ?'Sí' :'No'}`;
        e.currentTarget.style.borderColor = nextVal ? 'var(--sage-500)' : 'var(--border-subtle)';
        if (nextVal) window.app?.playGentleTone(432, 350);
        window.app?.showToast(nextVal ? 'Tonos suaves activados' : 'Tonos suaves desactivados');
      });

      const toggleBtn = document.getElementById('btn-toggle-breathing');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          if (this.breathingTimer) {
            this.breathingPausedByUser = true;
            this.stopBreathing();
            toggleBtn.textContent = 'Reanudar Respiración Guiada';
          } else {
            this.breathingPausedByUser = false;
            this.startBreathing();
            toggleBtn.textContent = 'Pausar Respiración Guiada';
          }
        });
      }
    }

    // Rotate Personal Anchor Banner in Steps 3 & 4
    document.getElementById('btn-rotate-anchor-banner')?.addEventListener('click', () => {
      const anchors = window.stateManager.getAnchors();
      if (!anchors || anchors.length === 0) return;
      this.anchorBannerIndex = (this.anchorBannerIndex + 1) % anchors.length;
      const anchor = anchors[this.anchorBannerIndex];
      const quoteEl = document.getElementById('espacio-anchor-quote');
      if (quoteEl && anchor) {
        quoteEl.innerHTML = '';
        const txtNode = document.createTextNode(`"${anchor.text}" `);
        const span = document.createElement('span');
        span.style.cssText = 'font-style: normal; font-size: 0.74rem; color: var(--text-muted);';
        span.textContent = `— ${anchor.author} (${anchor.category})`;
        quoteEl.appendChild(txtNode);
        quoteEl.appendChild(span);
      }
    });

    document.getElementById('btn-act-prev-2')?.addEventListener('click', () => this.setStep(1));
    document.getElementById('btn-act-next-2')?.addEventListener('click', () => this.setStep(3));

    // Step 3 Events (Defusion + Post-Intensity Check)
    const applyThoughtUpdate = (val) => {
      this.entryData.thought = val;
      const textVal = val.trim() || 'me siento totalmente desbordado y nadie me apoya';
      const mindName = window.stateManager.getMindName();

      const d1 = document.getElementById('def-text-1');
      const d2 = document.getElementById('def-text-2');
      const d3 = document.getElementById('def-text-3');
      const leaf = document.getElementById('floating-leaf-text');
      if (d1) d1.textContent = `"Estoy teniendo el pensamiento de que ${textVal}."`;
      if (d2) d2.textContent = `"Observo con curiosidad que ${mindName} (mi mente) me está contando la historia de que ${textVal}."`;
      if (d3) d3.textContent = `"Agradezco a ${mindName} por intentar protegerme creyendo que ${textVal}."`;
      if (leaf) leaf.textContent = textVal;
    };

    const thoughtInput = document.getElementById('act-thought-input');
    if (thoughtInput) {
      thoughtInput.addEventListener('input', (e) => {
        applyThoughtUpdate(e.target.value);
      });
    }

    document.getElementById('btn-act-toggle-thought-examples')?.addEventListener('click', () => {
      this.showThoughtExamples = !this.showThoughtExamples;
      this.render();
      this.bindEvents();
    });

    document.querySelectorAll('[data-quick-thought]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.quickThought;
        if (thoughtInput) thoughtInput.value = val;
        applyThoughtUpdate(val);
        document.querySelectorAll('[data-quick-thought]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    document.getElementById('btn-edit-mind-name')?.addEventListener('click', () => {
      this.openMindNameModal();
    });

    ['defusion-card-1', 'defusion-card-2', 'defusion-card-3'].forEach((cardId) => {
      const card = document.getElementById(cardId);
      if (card) {
        card.addEventListener('click', () => {
          const textEl = card.querySelector('.defusion-text');
          this.entryData.reframedThought = textEl.textContent.replace(/^"|"$/g, '');
          document.querySelectorAll('.defusion-reframing-card').forEach(c => c.style.borderColor = 'var(--sage-500)');
          card.style.borderColor = 'var(--accent-warmth)';
          window.app?.showToast(`Re-enmarque seleccionado`);
        });
      }
    });

    const postSlider = document.getElementById('slider-act-post-intensity');
    const postBadge = document.getElementById('val-act-post-intensity');
    if (postSlider && postBadge) {
      postSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.entryData.postIntensity = val;
        postBadge.textContent = `${val}/10`;
      });
    }

    document.getElementById('btn-act-prev-3')?.addEventListener('click', () => {
      this.breathingPausedByUser = false;
      this.setStep(2);
    });
    document.getElementById('btn-act-next-3')?.addEventListener('click', () => {
      if (!this.entryData.reframedThought) {
        const textVal = this.entryData.thought.trim() || 'este malestar es insoportable';
        const mindName = window.stateManager.getMindName();
        this.entryData.reframedThought = `Observo con curiosidad que ${mindName} me está contando la historia de que ${textVal}.`;
      }
      this.setStep(4);
    });

    // Step 4 Events
    document.getElementById('btn-act-toggle-step4-examples')?.addEventListener('click', () => {
      this.showStep4Examples = !this.showStep4Examples;
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-act-toggle-passenger-examples')?.addEventListener('click', () => {
      this.showPassengerExamples = !this.showPassengerExamples;
      this.render();
      this.bindEvents();
    });

    document.getElementById('act-custom-value')?.addEventListener('input', (e) => {
      this.entryData.valueChosen = e.target.value;
      this.entryData.choiceType = 'value';
    });

    const autopilotInput = document.getElementById('act-autopilot-urge');
    if (autopilotInput) {
      autopilotInput.addEventListener('input', (e) => {
        this.entryData.autopilotUrge = e.target.value;
      });
    }

    document.querySelectorAll('[data-quick-autopilot]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.quickAutopilot;
        this.entryData.autopilotUrge = val;
        if (autopilotInput) autopilotInput.value = val;
        document.querySelectorAll('[data-quick-autopilot]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    const actionInput = document.getElementById('act-committed-action');
    if (actionInput) {
      actionInput.addEventListener('input', (e) => {
        this.entryData.committedAction = e.target.value;
      });
    }

    document.querySelectorAll('[data-quick-committed]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.quickCommitted;
        this.entryData.committedAction = val;
        this.entryData.choiceType = 'value';
        if (actionInput) actionInput.value = val;
        document.querySelectorAll('[data-quick-committed]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    document.querySelectorAll('[data-val-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.entryData.valueChosen = e.currentTarget.dataset.valChip;
        this.entryData.choiceType = 'value';
        this.render();
        this.bindEvents();
      });
    });

    document.getElementById('btn-select-autopilot')?.addEventListener('click', () => {
      this.entryData.choiceType = 'autopilot';
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-select-value')?.addEventListener('click', () => {
      this.entryData.choiceType = 'value';
      this.render();
      this.bindEvents();
    });

    // Physicalizing Emotions (Hayes)
    document.querySelectorAll('[data-phys-shape]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.physShape;
        this.entryData.physicalShape = this.entryData.physicalShape === val ? '' : val;
        this.render();
        this.bindEvents();
      });
    });

    document.querySelectorAll('[data-phys-temp]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.physTemp;
        this.entryData.physicalTemp = this.entryData.physicalTemp === val ? '' : val;
        this.render();
        this.bindEvents();
      });
    });

    // Passengers on the Bus (Hayes)
    document.querySelectorAll('[data-passenger-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.entryData.carriedPassenger = e.currentTarget.dataset.passengerChip;
        const inp = document.getElementById('act-passenger-input');
        if (inp) inp.value = this.entryData.carriedPassenger;
        this.render();
        this.bindEvents();
      });
    });

    const passengerInput = document.getElementById('act-passenger-input');
    if (passengerInput) {
      passengerInput.addEventListener('input', (e) => {
        this.entryData.carriedPassenger = e.target.value;
      });
    }

    const savePasChk = document.getElementById('chk-save-passenger-to-bus');
    if (savePasChk) {
      savePasChk.addEventListener('change', (e) => {
        this.entryData.savePassengerToBus = e.target.checked;
      });
    }

    document.getElementById('btn-act-prev-4')?.addEventListener('click', () => this.setStep(3));
    document.getElementById('btn-act-save')?.addEventListener('click', () => this.saveEntry());
  }

  bindWheelInteraction(scopeEl, { isChipsView = false, bindFamilies = true, onMutate } = {}) {
    if (!scopeEl) return;

    if (bindFamilies) {
      scopeEl.querySelectorAll('[data-wheel-family]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const famId = e.currentTarget.dataset.wheelFamily;
          this.activeEmotionFamily = famId;
          if (isChipsView) {
            this.emotionSearchQuery = '';
            if (onMutate) onMutate();
          } else {
            const wheelContainer = btn.closest('.emotion-wheel-container') || scopeEl;
            const outerGroups = wheelContainer.querySelectorAll(`.wheel-nuance-group[data-emotion-family="${famId}"]`);
            outerGroups.forEach(g => {
              g.classList.remove('family-pulse');
              void g.offsetWidth;
              g.classList.add('family-pulse');
              setTimeout(() => g.classList.remove('family-pulse'), 1200);
            });
            const hoverBox = wheelContainer.querySelector('.wheel-hover-example');
            if (hoverBox) {
              hoverBox.innerHTML =`<strong>${famId}</strong> es una categoría general. Concreta tocando uno de sus matices resaltados en el anillo exterior.`;
              hoverBox.style.opacity = '1';
            }
            window.app?.showToast(`Concreta qué matiz de ${famId} sientes en el anillo exterior`);
          }
        });
      });
    }

    scopeEl.querySelectorAll('[data-act-emotion]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.toggleEmotion(e.currentTarget.dataset.actEmotion);
        if (onMutate) onMutate();
      });
    });

    scopeEl.querySelectorAll('[data-remove-emotion]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleEmotion(e.currentTarget.dataset.removeEmotion);
        if (onMutate) onMutate();
      });
    });

    scopeEl.querySelectorAll('.emotion-wheel-container').forEach(wheelContainer => {
      const wheelSvg = wheelContainer.querySelector('.emotion-wheel-svg');
      const hoverBox = wheelContainer.querySelector('.wheel-hover-example');
      if (!wheelSvg) return;

      let activeHoveredGroup = null;

      const clearAllHover = (resetText = true) => {
        wheelSvg.querySelectorAll('.wheel-nuance-group.hovered').forEach(g => {
          g.classList.remove('hovered');
        });
        activeHoveredGroup = null;
        if (resetText && hoverBox) {
          hoverBox.innerHTML = 'Pasa el ratón por el anillo exterior para ampliar y ver un ejemplo identificador.';
          hoverBox.style.opacity = '0.7';
        }
      };

      const raiseSelectedGroups = () => {
        wheelSvg.querySelectorAll('.wheel-nuance-group.selected').forEach(sel => {
          if (sel.parentNode && sel.parentNode.lastElementChild !== sel) {
            sel.parentNode.appendChild(sel);
          }
        });
      };

      const handlePointer = (e) => {
        const group = e.target.closest('.wheel-nuance-group[data-act-emotion]');
        if (!group) {
          if (activeHoveredGroup) {
            clearAllHover(true);
            raiseSelectedGroups();
          }
          return;
        }
        if (group === activeHoveredGroup) return;

        clearAllHover(false);
        activeHoveredGroup = group;

        if (group.parentNode && group.parentNode.lastElementChild !== group) {
          group.parentNode.appendChild(group);
        }
        group.classList.add('hovered');

        if (hoverBox) {
          const name = group.dataset.actEmotion;
          const desc = group.dataset.emotionDesc || '';
          const example = group.dataset.emotionExample || '';
          hoverBox.innerHTML = `<strong>${name}</strong>: ${desc}${example ? `<br/><span style="color: var(--sage-600);">${example}</span>` : ''}`;
          hoverBox.style.opacity = '1';
        }
      };

      wheelSvg.addEventListener('pointerover', handlePointer);
      wheelSvg.addEventListener('pointermove', handlePointer);

      const handleLeaveWheel = () => {
        clearAllHover(true);
        raiseSelectedGroups();
      };

      wheelSvg.addEventListener('pointerleave', handleLeaveWheel);
      wheelSvg.addEventListener('mouseleave', handleLeaveWheel);
      wheelContainer.addEventListener('mouseleave', handleLeaveWheel);
    });
  }

  openMaximizedWheelModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const closeModal = () => {
      modal.classList.remove('active');
      modalBody.classList.remove('modal-wheel-maximized');
    };

    const syncInlineView = () => {
      if (this.currentStep === 1) {
        this.render();
        this.bindEvents();
      }
    };

    const renderModalContent = () => {
      modalBody.classList.add('modal-wheel-maximized');
      const isInEspacioAct = window.app?.currentView === 'espacio-act';

      modalBody.innerHTML = `
        <div class="flex-between" style="margin-bottom: 10px; gap: 10px; flex-wrap: wrap;">
          <div>
<h3 class="card-title" style="margin-bottom: 2px;">Rueda de las Emociones (Vista Maximizada)</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Toca una o varias emociones concretas en el anillo exterior para nombrar lo que sientes.</p>
          </div>
          <button type="button" class="btn-secondary" id="btn-modal-wheel-x" aria-label="Cerrar" style="font-size: 0.85rem; padding: 6px 11px;">✕</button>
        </div>

        ${this.renderSelectedEmotionsBar()}
        ${this.renderCircularEmotionWheel(true)}

        <div style="display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; margin-top: 8px;">
          <button type="button" class="btn-secondary" id="btn-modal-wheel-clear" style="font-size: 0.82rem; padding: 7px 12px;">
            Limpiar selección
          </button>
          <button type="button" class="${isInEspacioAct ? 'btn-primary' : 'btn-secondary'}" id="btn-modal-wheel-close" style="font-size: 0.84rem; padding: 8px 16px;">
            ✓ Listo / Cerrar
          </button>
          ${!isInEspacioAct ? `
            <button type="button" class="btn-primary" id="btn-modal-wheel-go-act" style="font-size: 0.84rem; padding: 8px 16px;">
              Procesar en Espacio ACT →
            </button>
          ` : ''}
        </div>
      `;

      this.bindWheelInteraction(modalBody, {
        isChipsView: false,
        onMutate: () => {
          syncInlineView();
          renderModalContent();
        }
      });

      document.getElementById('btn-modal-wheel-x')?.addEventListener('click', closeModal);
      document.getElementById('btn-modal-wheel-close')?.addEventListener('click', closeModal);
      document.getElementById('btn-modal-wheel-clear')?.addEventListener('click', () => {
        this.entryData.emotions = [];
        this.entryData.emotion = '';
        this.entryData.lastFocusedEmotion = '';
        syncInlineView();
        renderModalContent();
      });
      document.getElementById('btn-modal-wheel-go-act')?.addEventListener('click', () => {
        closeModal();
        this.currentStep = 1;
        window.app?.navigate('espacio-act');
        this.render();
        this.bindEvents();
      });
    };

    renderModalContent();
    modal.classList.add('active');
  }

  // Modals for Hayes Tools
  openMindNameModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    window.app?.setModalSize?.('default');

    const currentName = window.stateManager.getMindName();

    modalBody.innerHTML = `
<h3 class="card-title">Apodo de tu Generador de Pensamientos</h3>
      <p class="card-subtitle mt-2">
        Steven C. Hayes bautizó a su mente como <em>"George"</em> para recordar que esa voz es como una radio o generador automático de comentarios, no tu identidad ni una orden que debas obedecer.
      </p>

      <div class="form-group mt-4">
        <label class="form-label" for="input-mind-name">¿Qué apodo quieres darle a esa radio automática?</label>
        <input type="text" id="input-mind-name" class="form-input" value="${currentName}" placeholder="Ej: George, Radio Catástrofe, Doña Culpa, El Juez Interior...">
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
        <button type="button" class="btn-primary" id="btn-modal-save-mind-name">Guardar Nombre</button>
      </div>
    `;

    modal.classList.add('active');

    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    document.getElementById('btn-modal-save-mind-name')?.addEventListener('click', () => {
      const name = document.getElementById('input-mind-name')?.value?.trim();
      window.stateManager.setMindName(name || 'George');
      modal.classList.remove('active');
      window.app?.showToast(`Mente nombrada: ${name || 'George'}`);
      this.render();
      this.bindEvents();
    });
  }

  openSomaticPostureModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    window.app?.setModalSize?.('medium');

    modalBody.innerHTML = `
      <h3 class="card-title">La Postura Somática del "SÍ"</h3>
      <p class="card-subtitle mt-2">Ejercicio corporal de Steven Hayes para salir del modo defensa antes de un límite o conversación difícil.</p>

      <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr; gap: 12px;">
        <div style="background: var(--bg-surface-elevated); padding: 14px; border-left: 4px solid var(--accent-tension); border-radius: var(--radius-sm);">
          <strong style="color: var(--accent-tension);">1. Observa la Postura del "NO" (Resistencia):</strong>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">
            Hombros encogidos, mandíbula apretada, puños cerrados o respiración corta. Tu cuerpo intenta blindarse contra la reacción ajena.
          </p>
        </div>

        <div style="background: var(--bg-surface-elevated); padding: 14px; border-left: 4px solid var(--sage-500); border-radius: var(--radius-sm);">
          <strong style="color: var(--sage-700);">2. Cambia a la Postura del "SÍ" (Apertura):</strong>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">
            Baja los hombros suavemente. Abre las palmas de las manos apoyadas en tus piernas orientadas hacia arriba. Eleva ligeramente la barbilla y exhala lentamente.
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 18px; font-style: italic; color: var(--sage-700); font-size: 0.9rem;">
        "Tu postura le informa a tu sistema nervioso de que estás a salvo incluso en medio de la incomodidad."
      </div>

      <div class="btn-group" style="justify-content: center; margin-top: 20px;">
        <button type="button" class="btn-primary" id="btn-modal-close-somatic">
          Postura Integrada / Continuar
        </button>
      </div>
    `;

    modal.classList.add('active');

    document.getElementById('btn-modal-close-somatic')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  saveEntry() {
    this.stopBreathing();
    const entry = window.stateManager.addActCrisisEntry(this.entryData);

    if (this.entryData.savePassengerToBus && (this.entryData.carriedPassenger || '').trim()) {
      const pasName = this.entryData.carriedPassenger.trim();
      const existing = (window.stateManager.getProfile().busPassengers || []).find(
        p => p.name.toLowerCase() === pasName.toLowerCase()
      );
      if (!existing) {
        window.stateManager.addBusPassenger({
          name: pasName,
          shouts: this.entryData.thought || 'Apareció en caliente pidiéndome ceder o frenar.',
          driverReply: `No te doy el volante porque elijo conducir hacia ${this.entryData.valueChosen || 'mis valores'}, pero puedes sentarte atrás.`,
          status: 'seated'
        });
      }
    }

    const container = document.getElementById('espacio-act-view');
    if (!container) return;

    const delta = (entry.initialIntensity || 0) - (entry.postIntensity || 0);

    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 36px 20px;">
        <div style="width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 50%; background-color: var(--sage-100); display: flex; align-items: center; justify-content: center; color: var(--sage-600);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 class="card-title">Has navegado la tormenta con presencia</h3>
        <p class="card-subtitle mt-2" style="max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Has observado la emoción sin dejarte gobernar por ella. Cada vez que nombras lo que sientes y eliges tus valores, ensanchas tu libertad interior.
        </p>

        <div class="card mt-4" style="background-color: var(--bg-surface-elevated); max-width: 480px; margin-left: auto; margin-right: auto; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge" style="background: rgba(87, 139, 116, 0.2); color: var(--sage-700);">Emoción: ${entry.emotion}</span>
            <span class="badge" style="background: ${delta >= 0 ? 'rgba(74, 122, 102, 0.2)' : 'rgba(184, 107, 89, 0.2)'}; color: ${delta >= 0 ? 'var(--sage-700)' : 'var(--accent-tension)'};">
              Intensidad: ${entry.initialIntensity} → ${entry.postIntensity} (${delta >= 0 ? '-' + delta : '+' + Math.abs(delta)})
            </span>
          </div>

          <div style="font-size: 0.85rem; font-style: italic; color: var(--text-secondary); margin-bottom: 8px;">
            "${entry.reframedThought || entry.thought}"
          </div>

          <div style="font-size: 0.82rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px; margin-top: 8px;">
            Elección:<strong>${entry.choiceType ==='value' ?'' + entry.valueChosen :'Piloto Automático'}</strong>
            ${entry.committedAction ? `<br>Acción: "${entry.committedAction}"` : ''}
            ${entry.carriedPassenger ?`<br>Pasajero a bordo:"${entry.carriedPassenger}"` :''}
          </div>
        </div>

        <div class="btn-group" style="justify-content: center; margin-top: 24px;">
          <button type="button" class="btn-secondary" id="btn-act-new">
            Nueva Consulta ACT
          </button>
          <button type="button" class="btn-primary" id="btn-act-go-insight">
            Ver Estadísticas y Aprendizajes
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-act-new')?.addEventListener('click', () => {
      this.resetForm();
    });

    document.getElementById('btn-act-go-insight')?.addEventListener('click', () => {
      window.app?.navigate('insight');
    });

    window.app?.showToast('Crisis procesada e integrada en tu historial');
  }
}

window.espacioActApp = new EspacioActApp();
