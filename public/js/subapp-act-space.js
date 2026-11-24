/**
 * ECOSISTEMA ACT - Sub-App 2: El Espacio ACT
 * Procesamiento de Crisis en Tiempo Real (4 Pasos Guiados)
 * Incluye la Rueda de las Emociones Estándar (Modo Circular Radial y Modo Fichas),
 * Nombre de la Mente (Hayes) y Postura del SÍ
 */

class EspacioActApp {
  /** Single source for step labels (consumed by totalSteps, render() and renderStepN). */
  static STEPS = [
    { step: 1, label: '1. Emoción' },
    { step: 2, label: '2. Intensidad' },
    { step: 3, label: '3. Cuerpo' },
    { step: 4, label: '4. Mente' },
    { step: 5, label: '5. Distancia' },
    { step: 6, label: '6. Elección' },
    { step: 7, label: '7. Cierre' }
  ];

  constructor() {
    this.currentStep = 1;
    this.totalSteps = EspacioActApp.STEPS.length;
    this.emotionViewMode = 'wheel'; // 'wheel' (Rueda Circular Estándar) | 'chips' (Fichas / Lista)
    this.activeEmotionFamily = 'Ira';
    this.emotionSearchQuery = '';
    this.zoomedWheelFamily = null;

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

    this.defusionStyle = 'notice'; // 'notice' | 'story' | 'thanks'
    this.showMoreValues = false;
    this.showBodyDetails = false;
    this.showThoughtExamples = false;
    this.showActionExamples = false;
    this.postIntensityTouched = false;

    this.breathingPhaseTimeout = null;
    this.breathingActive = false;
    this.breathingPhase = 'idle'; // 'idle' | 'inhale' | 'hold' | 'exhale' | 'rest'
    this.breathingCyclesDone = 0;
  }

  escapeHtml(value) {
    if (window.KhoraUtils?.escapeHtml) {
      return window.KhoraUtils.escapeHtml(value);
    }
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  init() {
    this.render();
    this.bindEvents();
  }

  resetForm() {
    this.stopBreathing();
    this.currentStep = 1;
    this.defusionStyle = 'notice';
    this.showMoreValues = false;
    this.showBodyDetails = false;
    this.showThoughtExamples = false;
    this.showActionExamples = false;
    this.postIntensityTouched = false;
    this.breathingCyclesDone = 0;
    this.emotionViewMode = 'wheel';
    this.activeEmotionFamily = 'Ira';
    this.emotionSearchQuery = '';
    this.zoomedWheelFamily = null;
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
      postIntensity: 8,
      autopilotUrge: '',
      valueChosen: '',
      committedAction: '',
      carriedPassenger: '',
      savePassengerToBus: false,
      choiceType: 'value'
    };

    this.render();
    this.bindEvents();
  }

  setStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    const prevStep = this.currentStep;
    if (this.currentStep === 3 && step !== 3) {
      this.stopBreathing();
    }
    if (step === 7 && !this.postIntensityTouched) {
      this.entryData.postIntensity = this.entryData.initialIntensity;
    }
    this.currentStep = step;
    window.KhoraUI?.prepareTypeformTransition?.('act-space-view');
    this.render();
    window.KhoraUI?.animateTypeformTransition?.('act-space-view', prevStep, step, this.totalSteps);
    this.bindEvents();
  }

  render() {
    const container = document.getElementById('act-space-view');
    if (!container) return;

    const progressPercent = (this.currentStep / this.totalSteps) * 100;

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
      case 5:
        stepHtml = this.renderStep5();
        break;
      case 6:
        stepHtml = this.renderStep6();
        break;
      case 7:
        stepHtml = this.renderStep7();
        break;
    }

    container.innerHTML = window.KhoraUI.renderTypeformShell({
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      steps: EspacioActApp.STEPS,
      navAriaLabel: 'Pasos de Espacio ACT',
      bodyId: 'act-step-body',
      stepHtml
    });
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
        <div class="selected-emotions-bar" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
          <span>Aún no has marcado ninguna emoción.</span>
          <button type="button" class="btn-inline-link" id="btn-act-skip-unnamed" style="font-size: 0.78rem;">
            No sé nombrarla aún →
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
        <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">Marcadas (${selected.length}):</span>
        ${chips}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 1: ¿Qué estás sintiendo?
  // -------------------------------------------------------------
  renderStep1() {
    const selected = Array.isArray(this.entryData.emotions) ? this.entryData.emotions : [];
    const focusedEmotion = this.entryData.lastFocusedEmotion || selected[selected.length - 1] || '';
    let activeNuanceDesc = '';
    if (focusedEmotion) {
      this.emotionFamilies.forEach(fam => {
        const found = fam.nuances.find(n => n.id === focusedEmotion);
        if (found) {
          activeNuanceDesc = found.desc;
        }
      });
    }

    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Qué estás sintiendo?</h3>
      </div>

      ${this.emotionViewMode === 'wheel' ? this.renderCircularEmotionWheel(false) : this.renderChipsEmotionWheel()}

      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 8px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          ${selected.length === 0 ? `
            <button type="button" class="btn-inline-link" id="btn-act-skip-unnamed" style="font-size: 0.78rem; color: var(--text-muted);">
              No sé nombrarla aún →
            </button>
          ` : ''}
          <button type="button" class="btn-inline-link" id="btn-act-overload-skip" style="font-size: 0.78rem; color: var(--text-muted);">
            Ir directo al cuerpo →
          </button>
        </div>
        <div style="display: flex; align-items: center; gap: 14px; margin-left: auto;">
          <button type="button" class="btn-inline-link" id="btn-maximize-wheel" style="font-size: 0.78rem; color: var(--text-muted);">
            Ampliar
          </button>
          ${this.emotionViewMode === 'wheel' ? `
            <button type="button" class="btn-inline-link mode-toggle-btn" data-emotion-mode="chips" style="font-size: 0.78rem; color: var(--text-muted);">
              Ver lista
            </button>
          ` : `
            <button type="button" class="btn-inline-link mode-toggle-btn" data-emotion-mode="wheel" style="font-size: 0.78rem; font-weight: 600;">
              Ver rueda
            </button>
          `}
        </div>
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" disabled>Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-next-1">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // CIRCULAR RADIAL EMOTION WHEEL GENERATOR (SVG)
  // -------------------------------------------------------------
  getWheelZoomTransform(familyId) {
    if (!familyId) return '';
    const idx = this.emotionFamilies.findIndex(f => f.id === familyId);
    if (idx < 0) return '';
    const cx = 260;
    const cy = 260;
    const rFocus = 160;
    const scale = 1.92;
    const midAngle = idx * 60 + 30;
    const rad = (midAngle - 90) * Math.PI / 180.0;
    const fx = cx + rFocus * Math.cos(rad);
    const fy = cy + rFocus * Math.sin(rad);
    const tx = (-scale * (fx - cx)).toFixed(2);
    const ty = (-scale * (fy - cy)).toFixed(2);
    return `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  getWheelDefaultHint(isCompact = false, zoomedFamily = null) {
    if (zoomedFamily) {
      return 'Toca una emoción para elegirla, o toca fuera para volver a toda la rueda.';
    }
    if (isCompact) {
      return 'Desliza el dedo para ver ejemplos. Toca una zona para ampliarla y elegir.';
    }
    return 'Pasa el ratón por el anillo exterior para ampliar y ver un ejemplo. Haz clic para elegir.';
  }

  renderCircularEmotionWheel(isMaximized = false) {
    const selectedList = Array.isArray(this.entryData.emotions) ? this.entryData.emotions : [];
    const zoomedFam = this.zoomedWheelFamily
      ? this.emotionFamilies.find(f => f.id === this.zoomedWheelFamily) || null
      : null;
    const cx = 260;
    const cy = 260;
    const rIn = 46;
    const rMid = 112;
    const rOut = 244;

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

    let innerDefsHtml = '';
    let innerSlicesHtml = '';
    let outerSlicesHtml = '';
    const arcPrefix = isMaximized ? 'wheel-fam-arc-modal' : 'wheel-fam-arc';

    this.emotionFamilies.forEach((fam, i) => {
      const famStart = i * 60;
      const famEnd = (i + 1) * 60;

      // Inner Family Slice (Nivel 1: No seleccionable, solo orientativo para concretar)
      const innerD = arcPath(rIn, rMid, famStart + 0.5, famEnd - 0.5);
      const isBottomHalf = i >= 2 && i <= 4;
      const arcR = isBottomHalf ? 84 : 79;
      const arcStartPt = p2c(arcR, isBottomHalf ? famEnd - 3 : famStart + 3);
      const arcEndPt = p2c(arcR, isBottomHalf ? famStart + 3 : famEnd - 3);
      const arcSweep = isBottomHalf ? 0 : 1;
      const famArcId = `${arcPrefix}-${i}`;
      innerDefsHtml += `<path id="${famArcId}" d="M ${arcStartPt.x} ${arcStartPt.y} A ${arcR} ${arcR} 0 0 ${arcSweep} ${arcEndPt.x} ${arcEndPt.y}" />`;

      const isDimmedFam = zoomedFam && zoomedFam.id !== fam.id;
      const famFontSize = fam.id.length > 10 ? '10.0' : '11.2';

      innerSlicesHtml += `
        <path d="${innerD}" fill="${innerFamilyColors[fam.id] || fam.color}" opacity="${isDimmedFam ? '0.28' : '0.94'}" class="wheel-family-sector ${isDimmedFam ? 'dimmed' : ''}" data-wheel-family="${fam.id}" />
        <text font-size="${famFontSize}" class="wheel-family-label" style="opacity: 1;">
          <textPath href="#${famArcId}" startOffset="50%" text-anchor="middle">${fam.id}</textPath>
        </text>
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
        const textPos = p2c(184, nMidA);
        let rot = (nMidA - 90) % 360;
        if (rot > 180) rot -= 360;
        if (rot < -180) rot += 360;
        if (rot > 90) rot -= 180;
        else if (rot < -90) rot += 180;

        const safeDesc = (nuance.desc || '').replace(/"/g, '&quot;');
        const safeExample = (nuance.example || '').replace(/"/g, '&quot;');

        // Una sola línea radial erguida adaptada al ancho del sector (42 emociones: 7 por familia)
        let labelFontSize = '10.6';
        if (nuance.id.length >= 15) {
          labelFontSize = '9.2';
        } else if (nuance.id.length > 12) {
          labelFontSize = '9.8';
        }

        outerSlicesHtml += `
          <g class="wheel-nuance-group ${isSel ? 'selected' : ''} ${isDimmedFam ? 'dimmed' : ''}" 
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
      <text x="260" y="261" text-anchor="middle" font-size="${selCount === 0 ? '9.8' : '10.6'}" font-weight="800" fill="var(--text-primary)">
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
        <text x="260" y="255" text-anchor="middle" font-size="9.2" font-weight="800" fill="var(--text-primary)">
          <tspan x="260" dy="0">${part1}</tspan>
          <tspan x="260" dy="1.15em">${part2}</tspan>
        </text>
      `;
    }

    const zoomTransform = this.getWheelZoomTransform(zoomedFam?.id);
    const isInitialCompact = typeof window !== 'undefined' && window.innerWidth < 460;
    const defaultHint = this.getWheelDefaultHint(isInitialCompact, zoomedFam?.id);

    return `
      <div class="emotion-wheel-container ${zoomedFam ? 'is-zoomed' : ''}">
        <div class="emotion-wheel-viewport">
          <svg class="emotion-wheel-svg" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
            <defs>${innerDefsHtml}</defs>
            <g class="wheel-zoom-layer" style="${zoomTransform ? `transform: ${zoomTransform};` : ''}">
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
                <circle cx="260" cy="260" r="45" fill="var(--bg-surface)" stroke="var(--sage-500)" stroke-width="2.5" />
                <text x="260" y="243" text-anchor="middle" font-size="16">${activeFamilyIcon}</text>
                ${centerTextHtml}
                <text x="260" y="279" text-anchor="middle" font-size="7.8" font-weight="600" fill="var(--border-focus)">
                  ${subHubLabel}
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Hover Example Tooltip (desktop: populated on hover, mobile: populated on scrub/tap) -->
        <div ${isMaximized ? '' : 'id="wheel-hover-example"'} class="wheel-hover-example" style="min-height: 36px; text-align: center; font-size: 0.82rem; color: var(--text-tertiary); font-style: italic; padding: 8px 12px; transition: all 0.25s ease;">
          ${defaultHint}
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
            <small class="explanatory-subtext" style="font-size: 0.68rem; color: var(--text-muted); line-height: 1.2;">${n.desc}</small>
            ${n.example ? `<small class="explanatory-subtext" style="font-size: 0.66rem; color: var(--sage-600); font-style: italic; line-height: 1.2; margin-top: 3px;">${n.example}</small>` : ''}
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
  // STEP 2: ¿Qué tan fuerte es?
  // -------------------------------------------------------------
  renderStep2() {
    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Qué tan fuerte sientes «${this.getSelectedEmotionsLabel()}»?</h3>
      </div>

      <div class="slider-group act-typeform-block" style="padding: 20px 18px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div class="slider-header" style="margin-bottom: 14px;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">1 = Suave · 10 = Muy fuerte</span>
          <span class="slider-val-badge" id="val-act-intensity" style="font-size: 1.05rem; padding: 4px 12px;">${this.entryData.initialIntensity}/10</span>
        </div>
        <input type="range" class="range-slider" id="slider-act-intensity" min="1" max="10" value="${this.entryData.initialIntensity}">
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-act-prev-2">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-next-2">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 3: ¿Dónde lo notas en el cuerpo?
  // -------------------------------------------------------------
  renderStep3() {
    const allZones = ['Cabeza', 'Mandíbula/Garganta', 'Hombros/Cuello', 'Pecho/Corazón', 'Estómago/Plexo', 'Espalda', 'Brazos/Manos', 'Piernas/Pies'];

    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Dónde lo notas en el cuerpo?</h3>
      </div>

      <div class="body-map-container">
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
      </div>

      <div class="act-typeform-block" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <button type="button" class="btn-secondary" id="btn-open-breathing-modal" style="font-size: 0.8rem; border-color: var(--sage-400); padding: 6px 12px;">
          Pausa para respirar
        </button>
        <button type="button" class="btn-secondary" id="btn-open-somatic-posture" style="font-size: 0.8rem; padding: 6px 12px;">
          Postura de apertura
        </button>
        <button type="button" class="btn-inline-link" id="btn-toggle-body-details" style="font-size: 0.8rem; margin-left: auto;">
          ${this.showBodyDetails ? 'Ocultar detalles' : '+ Cómo se siente'}
        </button>
      </div>

      ${this.showBodyDetails ? `
        <div class="act-typeform-block" style="background: var(--bg-surface-elevated); padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="margin-bottom: 10px;">
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 5px;">Se siente como:</span>
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
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 5px;">Ritmo o temperatura:</span>
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
      ` : ''}

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-act-prev-3">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-next-3">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  buildReframedThought(style, rawThought, mindName) {
    const clean = String(rawThought || '').trim().replace(/\.+$/, '');
    if (!clean) return '';
    const mind = (mindName || 'George').trim() || 'George';
    if (style === 'story') {
      return `${mind} me vuelve a contar la historia de que ${clean}.`;
    }
    if (style === 'thanks') {
      return `Gracias, ${mind}, por intentar protegerme con la idea de que ${clean}.`;
    }
    return `Estoy pensando que ${clean}.`;
  }

  // -------------------------------------------------------------
  // STEP 4: ¿Qué te dice tu mente?
  // -------------------------------------------------------------
  renderStep4() {
    const esc = (s) => this.escapeHtml(s);
    const rawThought = this.entryData.thought || '';
    const quickThoughts = [
      'Se van a enfadar si digo que no',
      'Soy egoísta por priorizarme',
      'Tengo que poder con todo',
      'No voy a poder sostener esto',
      'Si no cedo, me rechazarán'
    ];

    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Qué te dice tu mente?</h3>
      </div>

      <div class="form-group">
        <textarea id="act-thought-input" class="form-textarea" rows="3" style="min-height: 82px; font-size: 0.98rem;" placeholder="Ej: Se van a enfadar si digo que no…">${esc(rawThought)}</textarea>

        <div style="margin-top: 10px;">
          <button type="button" class="btn-inline-link" id="btn-toggle-thought-examples" style="font-size: 0.8rem;">
            ${this.showThoughtExamples ? 'Ocultar ideas' : 'Ver ideas frecuentes'}
          </button>
        </div>

        ${this.showThoughtExamples ? `
          <div class="quick-chips-row" style="margin-top: 8px;">
            ${quickThoughts.map(qt => `
              <button type="button" class="quick-fill-chip ${rawThought.trim() === qt ? 'active' : ''}" data-quick-thought="${esc(qt)}">
                "${esc(qt)}"
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-act-prev-4">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-next-4">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 5: Míralo desde fuera
  // -------------------------------------------------------------
  renderStep5() {
    const esc = (s) => this.escapeHtml(s);
    const rawThought = this.entryData.thought || '';
    const mindName = window.stateManager.getMindName() || 'George';
    const reframed = this.buildReframedThought(this.defusionStyle, rawThought, mindName);
    this.entryData.reframedThought = reframed;

    const styleTabs = [
      { id: 'notice', label: 'Es solo un pensamiento' },
      { id: 'story', label: `Historia de ${mindName}` },
      { id: 'thanks', label: `Gracias, ${mindName}` }
    ];

    return `
      <div class="act-step-header">
        <div class="flex-between" style="flex-wrap: wrap; gap: 8px; align-items: center;">
          <h3 class="act-step-question" style="margin-bottom: 0;">Míralo desde fuera</h3>
          <button type="button" class="btn-secondary" id="btn-edit-mind-name" style="font-size: 0.74rem; padding: 4px 10px;">
            Nombre de tu mente: «${esc(mindName)}»
          </button>
        </div>
      </div>

      <div class="defusion-style-tabs" role="tablist" aria-label="Míralo desde fuera">
        ${styleTabs.map(tab => {
          const active = this.defusionStyle === tab.id;
          return `
            <button type="button"
                    role="tab"
                    aria-selected="${active}"
                    class="defusion-style-pill ${active ? 'active' : ''}"
                    data-defusion-style="${tab.id}">
              ${esc(tab.label)}
            </button>
          `;
        }).join('')}
      </div>

      <div class="defusion-reframing-card defusion-live-card" id="act-defusion-live-card">
        ${reframed ? `
          <div class="defusion-text" id="act-defusion-live-text">"${esc(reframed)}"</div>
        ` : `
          <div class="defusion-text is-placeholder" id="act-defusion-live-text">Si quieres, vuelve atrás y escribe una frase breve.</div>
        `}
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-act-prev-5">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-next-5">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  getDerivedPassenger() {
    const thought = (this.entryData.thought || '').trim();
    if (thought) return thought;
    const emotions = Array.isArray(this.entryData.emotions) ? this.entryData.emotions : [];
    if (emotions.length > 0) {
      const zone = Array.isArray(this.entryData.bodyZones) && this.entryData.bodyZones[0]
        ? ` en ${this.entryData.bodyZones[0]}`
        : '';
      return `${this.getSelectedEmotionsLabel()}${zone}`;
    }
    return '';
  }

  // -------------------------------------------------------------
  // STEP 6: ¿Qué quieres hacer ahora?
  // -------------------------------------------------------------
  renderStep6() {
    const esc = (s) => this.escapeHtml(s);
    const profile = window.stateManager.getProfile();
    const profileValues = (profile.coreValues || []).map(
      v => `${v.domain}: ${v.statement.slice(0, 32)}${v.statement.length > 32 ? '…' : ''}`
    );
    const baseValues = ['Dignidad', 'Autocuidado', 'Honestidad', 'Límites Sanos', 'Calma', 'Compasión'];
    const isValue = this.entryData.choiceType !== 'autopilot';

    const quickCommitted = [
      'Pausar y responder con calma',
      'Decir que no en 1 frase sin excusas',
      'Priorizar mi descanso',
      'Expresar mi postura con calma'
    ];
    const quickAutopilot = [
      'Callarme y ceder',
      'Justificarme de más',
      'Contestar a la defensiva',
      'Huir o posponer'
    ];

    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Qué quieres hacer ahora?</h3>
      </div>

      <div class="act-choice-switch" role="tablist" aria-label="¿Qué quieres hacer ahora?">
        <button type="button"
                role="tab"
                aria-selected="${isValue}"
                class="act-choice-switch-btn ${isValue ? 'active value' : ''}"
                id="btn-select-value">
          Hacia lo que me importa
        </button>
        <button type="button"
                role="tab"
                aria-selected="${!isValue}"
                class="act-choice-switch-btn ${!isValue ? 'active autopilot' : ''}"
                id="btn-select-autopilot">
          En piloto automático
        </button>
      </div>

      <div class="act-choice-panel">
        ${isValue ? `
          <div>
            <label class="form-label" for="act-custom-value" style="font-size: 0.9rem; margin-bottom: 6px;">
              ¿Qué es importante para ti?
            </label>

            ${profileValues.length > 0 ? `
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                ${profileValues.map(val => `
                  <button type="button" class="quick-fill-chip ${this.entryData.valueChosen === val ? 'active' : ''}" data-val-chip="${esc(val)}">
                    ${esc(val)}
                  </button>
                `).join('')}
              </div>
              <div style="margin-bottom: 8px;">
                <button type="button" class="btn-inline-link" id="btn-toggle-more-values" style="font-size: 0.78rem;">
                  ${this.showMoreValues ? 'Ocultar otros valores' : 'Ver otros valores'}
                </button>
              </div>
            ` : ''}

            ${(profileValues.length === 0 || this.showMoreValues) ? `
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                ${baseValues.map(val => `
                  <button type="button" class="quick-fill-chip ${this.entryData.valueChosen === val ? 'active' : ''}" data-val-chip="${esc(val)}">
                    ${esc(val)}
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <input type="text" id="act-custom-value" class="form-input" style="font-size: 0.86rem; padding: 8px 11px;"
                   value="${esc(this.entryData.valueChosen)}"
                   placeholder="O escríbelo con tus palabras…">

            <label class="form-label mt-3" for="act-committed-action" style="font-size: 0.9rem; margin-bottom: 4px;">
              Tu siguiente paso
            </label>
            <textarea id="act-committed-action" class="form-textarea" rows="2" style="min-height: 54px;" placeholder="Ej: Tomar una pausa antes de responder…">${esc(this.entryData.committedAction)}</textarea>

            <div style="margin-top: 8px;">
              <button type="button" class="btn-inline-link" id="btn-toggle-action-examples" style="font-size: 0.8rem;">
                ${this.showActionExamples ? 'Ocultar ideas' : 'Ver ideas'}
              </button>
            </div>

            ${this.showActionExamples ? `
              <div class="quick-chips-row" style="margin-top: 8px; margin-bottom: 0;">
                ${quickCommitted.map(ca => `
                  <button type="button" class="quick-fill-chip ${this.entryData.committedAction === ca ? 'active' : ''}" data-quick-committed="${esc(ca)}">
                    + ${esc(ca)}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        ` : `
          <div>
            <label class="form-label" for="act-autopilot-urge" style="font-size: 0.9rem; margin-bottom: 4px;">
              ¿Qué te sale hacer por inercia?
            </label>
            <textarea id="act-autopilot-urge" class="form-textarea" rows="2" style="min-height: 56px;" placeholder="Ej: Callarme y ceder para evitar tensión…">${esc(this.entryData.autopilotUrge)}</textarea>

            <div style="margin-top: 8px;">
              <button type="button" class="btn-inline-link" id="btn-toggle-action-examples" style="font-size: 0.8rem;">
                ${this.showActionExamples ? 'Ocultar ideas' : 'Ver ideas'}
              </button>
            </div>

            ${this.showActionExamples ? `
              <div class="quick-chips-row" style="margin-top: 8px; margin-bottom: 0;">
                ${quickAutopilot.map(ap => `
                  <button type="button" class="quick-fill-chip ${this.entryData.autopilotUrge === ap ? 'active' : ''}" data-quick-autopilot="${esc(ap)}">
                    ${esc(ap)}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-act-prev-6">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-next-6">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 7: Cierre (Intensidad final + Guardar)
  // -------------------------------------------------------------
  renderStep7() {
    const derivedPassenger = this.getDerivedPassenger();

    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Qué tan fuerte lo sientes ahora?</h3>
      </div>

      <div class="slider-group act-typeform-block" style="padding: 20px 18px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div class="slider-header" style="margin-bottom: 14px;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">Antes: ${this.entryData.initialIntensity}/10</span>
          <span class="slider-val-badge" id="val-act-post-intensity" style="font-size: 1.05rem; padding: 4px 12px;">${this.entryData.postIntensity}/10</span>
        </div>
        <input type="range" class="range-slider" id="slider-act-post-intensity" min="1" max="10" value="${this.entryData.postIntensity}">
      </div>

      ${derivedPassenger ? `
        <label style="display: flex; align-items: center; gap: 8px; margin-top: 16px; font-size: 0.84rem; color: var(--text-secondary); cursor: pointer;">
          <input type="checkbox" id="chk-save-passenger-to-bus" ${this.entryData.savePassengerToBus ? 'checked' : ''} style="width: 16px; height: 16px;">
          <span>Guardar en «Mi Autobús»</span>
        </label>
      ` : ''}

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-act-prev-7">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-act-save">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Guardar y terminar
        </button>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // Breathing Pacer Logic (Opt-In, Word-Guided)
  // -------------------------------------------------------------
  getBreathingPhaseMeta(phase) {
    switch (phase) {
      case 'inhale':
        return {
          orbLabel: 'Inhala',
          phaseText: 'Inhala suavemente',
          instruction: 'Deja entrar el aire y abre espacio alrededor de la sensación.'
        };
      case 'hold':
        return {
          orbLabel: 'Mantén',
          phaseText: 'Mantén con suavidad',
          instruction: 'Observa la sensación sin empujarla ni pelear contra ella.'
        };
      case 'exhale':
        return {
          orbLabel: 'Suelta',
          phaseText: 'Exhala soltando la lucha',
          instruction: 'Deja salir el aire lento y hazle hueco a lo que notas.'
        };
      case 'rest':
        return {
          orbLabel: 'Pausa',
          phaseText: 'Pausa serena',
          instruction: 'Descansa un instante antes del siguiente aliento.'
        };
      default:
        return {
          orbLabel: 'Respirar',
          phaseText: 'Respiración guiada (opcional)',
          instruction: 'Un ritmo lento (4s inhalar · 4s mantener · 6s soltar) para hacer espacio alrededor de la sensación.'
        };
    }
  }

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
    } else if (phase === 'rest') {
      window.app?.triggerHaptic([30]);
    }
  }

  startBreathing() {
    if (this.breathingPhaseTimeout) {
      clearTimeout(this.breathingPhaseTimeout);
      this.breathingPhaseTimeout = null;
    }
    this.breathingActive = true;
    this.breathingCyclesDone = 0;
    this.breathingPhase = 'inhale';
    this.updateBreathingUI();
    this.notifyBreathingPhase(this.breathingPhase);
    this.scheduleNextBreathingPhase();
  }

  scheduleNextBreathingPhase() {
    if (!this.breathingActive) return;
    const durations = {
      inhale: 4000,
      hold: 4000,
      exhale: 6000,
      rest: 2000
    };
    const nextMap = {
      inhale: 'hold',
      hold: 'exhale',
      exhale: 'rest',
      rest: 'inhale'
    };
    const delay = durations[this.breathingPhase] || 4000;
    this.breathingPhaseTimeout = setTimeout(() => {
      if (!this.breathingActive) return;
      const nextPhase = nextMap[this.breathingPhase] || 'inhale';
      if (this.breathingPhase === 'rest' && nextPhase === 'inhale') {
        this.breathingCyclesDone++;
      }
      this.breathingPhase = nextPhase;
      this.updateBreathingUI();
      this.notifyBreathingPhase(this.breathingPhase);
      this.scheduleNextBreathingPhase();
    }, delay);
  }

  stopBreathing() {
    if (this.breathingPhaseTimeout) {
      clearTimeout(this.breathingPhaseTimeout);
      this.breathingPhaseTimeout = null;
    }
    this.breathingActive = false;
    this.breathingPhase = 'idle';
    this.updateBreathingUI();
  }

  updateBreathingUI() {
    const orb = document.getElementById('breathing-orb');
    const phaseWord = document.getElementById('breathing-phase-word');
    const phaseText = document.getElementById('breathing-phase-text');
    const instructionText = document.getElementById('breathing-instruction-text');
    const cycleHint = document.getElementById('breathing-cycle-hint');
    const toggleBtn = document.getElementById('btn-toggle-breathing');
    const sensoryControls = document.getElementById('breathing-sensory-controls');

    if (!orb) return;

    const meta = this.getBreathingPhaseMeta(this.breathingPhase);
    orb.className = `breathing-orb ${this.breathingPhase}`;
    orb.setAttribute('aria-pressed', String(this.breathingActive));
    orb.setAttribute('aria-label', this.breathingActive ? 'Detener respiración' : 'Iniciar respiración guiada');

    if (phaseWord) phaseWord.textContent = meta.orbLabel;
    if (phaseText) phaseText.textContent = meta.phaseText;
    if (instructionText) instructionText.textContent = meta.instruction;

    if (cycleHint) {
      if (this.breathingActive && this.breathingCyclesDone > 0) {
        cycleHint.textContent = `Ciclos completados: ${this.breathingCyclesDone}`;
        cycleHint.hidden = false;
      } else {
        cycleHint.textContent = '';
        cycleHint.hidden = true;
      }
    }

    if (toggleBtn) {
      toggleBtn.textContent = this.breathingActive ? 'Detener respiración' : 'Iniciar respiración guiada';
      toggleBtn.className = this.breathingActive ? 'btn-secondary' : 'btn-primary';
    }

    if (sensoryControls) {
      sensoryControls.hidden = !this.breathingActive;
    }
  }

  // -------------------------------------------------------------
  // Event Binding
  // -------------------------------------------------------------
  bindEvents() {
    const viewRoot = document.getElementById('act-space-view') || document;

    // Top step pills navigation
    window.KhoraUtils?.bindGotoStep?.(viewRoot, (targetStep) => {
      if (targetStep !== this.currentStep) {
        this.setStep(targetStep);
      }
    });

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
              <small class="explanatory-subtext" style="font-size: 0.68rem; color: var(--text-muted); line-height: 1.2;">${n.desc}</small>
              ${n.example ? `<small class="explanatory-subtext" style="font-size: 0.66rem; color: var(--sage-600); font-style: italic; line-height: 1.2; margin-top: 3px;">${n.example}</small>` : ''}
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
      this.setStep(3);
      window.app?.showToast('Pasando directo al cuerpo');
    });

    document.getElementById('btn-act-skip-unnamed')?.addEventListener('click', () => {
      if (!this.entryData.emotions || this.entryData.emotions.length === 0) {
        this.entryData.emotions = ['Malestar / Activación en curso'];
        this.entryData.lastFocusedEmotion = 'Malestar / Activación en curso';
        this.entryData.emotion = 'Malestar / Activación en curso';
      }
      this.setStep(2);
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
      }
      this.setStep(2);
    });

    // Step 2 Events (Initial Intensity)
    document.getElementById('btn-act-prev-2')?.addEventListener('click', () => this.setStep(1));
    document.getElementById('btn-act-next-2')?.addEventListener('click', () => this.setStep(3));

    // Step 3 Events (Body Map, Optional Details, Breathing Modal & Somatic Posture)
    if (this.currentStep === 3) {
      document.getElementById('btn-open-breathing-modal')?.addEventListener('click', () => {
        this.openBreathingModal();
      });

      document.getElementById('btn-open-somatic-posture')?.addEventListener('click', () => {
        this.openSomaticPostureModal();
      });

      document.getElementById('btn-toggle-body-details')?.addEventListener('click', () => {
        this.showBodyDetails = !this.showBodyDetails;
        this.render();
        this.bindEvents();
      });
    }

    document.getElementById('btn-act-prev-3')?.addEventListener('click', () => this.setStep(2));
    document.getElementById('btn-act-next-3')?.addEventListener('click', () => this.setStep(4));

    // Step 4 & 5 Events (Thought Input + Perspective Defusion)
    const syncDefusionCard = () => {
      const mindName = window.stateManager.getMindName() || 'George';
      const reframed = this.buildReframedThought(this.defusionStyle, this.entryData.thought, mindName);
      this.entryData.reframedThought = reframed;
      const liveTextEl = document.getElementById('act-defusion-live-text');
      if (liveTextEl) {
        if (reframed) {
          liveTextEl.textContent = `"${reframed}"`;
          liveTextEl.classList.remove('is-placeholder');
        } else {
          liveTextEl.textContent = 'Si quieres, vuelve atrás y escribe una frase breve.';
          liveTextEl.classList.add('is-placeholder');
        }
      }
    };

    const thoughtInput = document.getElementById('act-thought-input');
    if (thoughtInput) {
      thoughtInput.addEventListener('input', (e) => {
        const val = e.target.value;
        this.entryData.thought = val;
        document.querySelectorAll('[data-quick-thought]').forEach(c => {
          c.classList.toggle('active', c.dataset.quickThought === val.trim());
        });
        syncDefusionCard();
      });
    }

    document.getElementById('btn-toggle-thought-examples')?.addEventListener('click', () => {
      this.showThoughtExamples = !this.showThoughtExamples;
      this.render();
      this.bindEvents();
    });

    document.querySelectorAll('[data-quick-thought]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.quickThought;
        this.entryData.thought = val;
        if (thoughtInput) thoughtInput.value = val;
        document.querySelectorAll('[data-quick-thought]').forEach(c => {
          c.classList.toggle('active', c === e.currentTarget);
        });
        syncDefusionCard();
      });
    });

    document.querySelectorAll('[data-defusion-style]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        this.defusionStyle = e.currentTarget.dataset.defusionStyle || 'notice';
        document.querySelectorAll('[data-defusion-style]').forEach(p => {
          const isSel = p === e.currentTarget;
          p.classList.toggle('active', isSel);
          p.setAttribute('aria-selected', String(isSel));
        });
        syncDefusionCard();
      });
    });

    document.getElementById('btn-edit-mind-name')?.addEventListener('click', () => {
      this.openMindNameModal();
    });

    document.getElementById('btn-act-prev-4')?.addEventListener('click', () => {
      this.setStep(3);
    });
    document.getElementById('btn-act-next-4')?.addEventListener('click', () => {
      syncDefusionCard();
      this.setStep(5);
    });

    document.getElementById('btn-act-prev-5')?.addEventListener('click', () => {
      this.setStep(4);
    });
    document.getElementById('btn-act-next-5')?.addEventListener('click', () => {
      syncDefusionCard();
      this.setStep(6);
    });

    // Step 4 Events (Choice Point + Derived Willingness + Closing Intensity)
    const syncWillingnessBanner = () => {
      const valEl = document.getElementById('act-willingness-value-text');
      if (valEl) {
        const valLabel = (this.entryData.valueChosen || '').trim() || 'lo que me importa';
        valEl.textContent = `«${valLabel}»`;
      }
    };

    document.getElementById('btn-select-value')?.addEventListener('click', () => {
      this.entryData.choiceType = 'value';
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-select-autopilot')?.addEventListener('click', () => {
      this.entryData.choiceType = 'autopilot';
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-toggle-more-values')?.addEventListener('click', () => {
      this.showMoreValues = !this.showMoreValues;
      this.render();
      this.bindEvents();
    });

    const customValueInput = document.getElementById('act-custom-value');
    if (customValueInput) {
      customValueInput.addEventListener('input', (e) => {
        const val = e.target.value;
        this.entryData.valueChosen = val;
        this.entryData.choiceType = 'value';
        document.querySelectorAll('[data-val-chip]').forEach(c => {
          c.classList.toggle('active', c.dataset.valChip === val);
        });
        syncWillingnessBanner();
      });
    }

    document.querySelectorAll('[data-val-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.valChip;
        this.entryData.valueChosen = val;
        this.entryData.choiceType = 'value';
        if (customValueInput) customValueInput.value = val;
        document.querySelectorAll('[data-val-chip]').forEach(c => {
          c.classList.toggle('active', c.dataset.valChip === val);
        });
        syncWillingnessBanner();
      });
    });

    const autopilotInput = document.getElementById('act-autopilot-urge');
    if (autopilotInput) {
      autopilotInput.addEventListener('input', (e) => {
        const val = e.target.value;
        this.entryData.autopilotUrge = val;
        document.querySelectorAll('[data-quick-autopilot]').forEach(c => {
          c.classList.toggle('active', c.dataset.quickAutopilot === val);
        });
      });
    }

    document.querySelectorAll('[data-quick-autopilot]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.quickAutopilot;
        this.entryData.autopilotUrge = val;
        if (autopilotInput) autopilotInput.value = val;
        document.querySelectorAll('[data-quick-autopilot]').forEach(c => {
          c.classList.toggle('active', c === e.currentTarget);
        });
      });
    });

    const actionInput = document.getElementById('act-committed-action');
    if (actionInput) {
      actionInput.addEventListener('input', (e) => {
        const val = e.target.value;
        this.entryData.committedAction = val;
        document.querySelectorAll('[data-quick-committed]').forEach(c => {
          c.classList.toggle('active', c.dataset.quickCommitted === val);
        });
      });
    }

    document.querySelectorAll('[data-quick-committed]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.quickCommitted;
        this.entryData.committedAction = val;
        this.entryData.choiceType = 'value';
        if (actionInput) actionInput.value = val;
        document.querySelectorAll('[data-quick-committed]').forEach(c => {
          c.classList.toggle('active', c === e.currentTarget);
        });
      });
    });

    const postSlider = document.getElementById('slider-act-post-intensity');
    const postBadge = document.getElementById('val-act-post-intensity');
    if (postSlider && postBadge) {
      postSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.postIntensityTouched = true;
        this.entryData.postIntensity = val;
        postBadge.textContent = `${val}/10`;
      });
    }

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

    const savePasChk = document.getElementById('chk-save-passenger-to-bus');
    if (savePasChk) {
      savePasChk.addEventListener('change', (e) => {
        this.entryData.savePassengerToBus = e.target.checked;
      });
    }

    document.getElementById('btn-toggle-action-examples')?.addEventListener('click', () => {
      this.showActionExamples = !this.showActionExamples;
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-act-prev-6')?.addEventListener('click', () => this.setStep(5));
    document.getElementById('btn-act-next-6')?.addEventListener('click', () => this.setStep(7));
    document.getElementById('btn-act-prev-7')?.addEventListener('click', () => this.setStep(6));
    document.getElementById('btn-act-save')?.addEventListener('click', () => this.saveEntry());
  }

  bindWheelInteraction(scopeEl, { isChipsView = false, bindFamilies = true, onMutate } = {}) {
    if (!scopeEl) return;

    const isCompactWheel = (wheelSvg) => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) return true;
      if (!wheelSvg) return false;
      const rect = wheelSvg.getBoundingClientRect();
      if (rect && rect.width > 0) return rect.width < 460;
      return false;
    };

    const applyWheelZoom = (wheelContainer, famId) => {
      const wheelSvg = wheelContainer?.querySelector('.emotion-wheel-svg');
      const zoomLayer = wheelContainer?.querySelector('.wheel-zoom-layer');
      const hoverBox = wheelContainer?.querySelector('.wheel-hover-example');
      if (!wheelSvg || !zoomLayer) return;

      this.zoomedWheelFamily = famId || null;
      const transform = famId ? this.getWheelZoomTransform(famId) : '';
      zoomLayer.style.transform = transform;
      wheelContainer.classList.toggle('is-zoomed', Boolean(famId));

      wheelSvg.querySelectorAll('.wheel-nuance-group[data-emotion-family]').forEach(g => {
        g.classList.toggle('dimmed', Boolean(famId && g.dataset.emotionFamily !== famId));
        g.classList.remove('hovered');
      });
      wheelSvg.querySelectorAll('.wheel-family-sector[data-wheel-family]').forEach(s => {
        const dim = Boolean(famId && s.dataset.wheelFamily !== famId);
        s.classList.toggle('dimmed', dim);
        s.style.opacity = dim ? '0.28' : '0.94';
      });

      if (hoverBox) {
        hoverBox.innerHTML = this.getWheelDefaultHint(isCompactWheel(wheelSvg), famId);
        hoverBox.style.opacity = '0.85';
      }
    };

    if (bindFamilies) {
      scopeEl.querySelectorAll('[data-wheel-family]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const famId = e.currentTarget.dataset.wheelFamily;
          this.activeEmotionFamily = famId;
          if (isChipsView) {
            this.emotionSearchQuery = '';
            if (onMutate) onMutate();
          } else {
            const wheelContainer = btn.closest('.emotion-wheel-container') || scopeEl.querySelector('.emotion-wheel-container');
            const wheelSvg = wheelContainer?.querySelector('.emotion-wheel-svg');
            if (wheelContainer && isCompactWheel(wheelSvg)) {
              e.stopPropagation();
              if (this.zoomedWheelFamily === famId) {
                applyWheelZoom(wheelContainer, null);
              } else {
                applyWheelZoom(wheelContainer, famId);
              }
              return;
            }
            const outerGroups = (wheelContainer || scopeEl).querySelectorAll(`.wheel-nuance-group[data-emotion-family="${famId}"]`);
            outerGroups.forEach(g => {
              g.classList.remove('family-pulse');
              void g.offsetWidth;
              g.classList.add('family-pulse');
              setTimeout(() => g.classList.remove('family-pulse'), 1200);
            });
            const hoverBox = (wheelContainer || scopeEl).querySelector('.wheel-hover-example');
            if (hoverBox) {
              hoverBox.innerHTML = `<strong>${famId}</strong> es una categoría general. Concreta tocando uno de sus matices resaltados en el anillo exterior.`;
              hoverBox.style.opacity = '1';
            }
            window.app?.showToast(`Concreta qué matiz de ${famId} sientes en el anillo exterior`);
          }
        });
      });
    }

    scopeEl.querySelectorAll('[data-act-emotion]:not(.wheel-nuance-group)').forEach(chip => {
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
      let pointerDown = null;
      let suppressNextClick = false;

      const clearAllHover = (resetText = true) => {
        wheelSvg.querySelectorAll('.wheel-nuance-group.hovered').forEach(g => {
          g.classList.remove('hovered');
        });
        activeHoveredGroup = null;
        if (resetText && hoverBox) {
          hoverBox.innerHTML = this.getWheelDefaultHint(isCompactWheel(wheelSvg), this.zoomedWheelFamily);
          hoverBox.style.opacity = '0.78';
        }
      };

      const raiseSelectedGroups = () => {
        wheelSvg.querySelectorAll('.wheel-nuance-group.selected').forEach(sel => {
          if (sel.parentNode && sel.parentNode.lastElementChild !== sel) {
            sel.parentNode.appendChild(sel);
          }
        });
      };

      const highlightGroup = (group) => {
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

      // Sync initial hint after layout measurement
      if (hoverBox && !activeHoveredGroup) {
        hoverBox.innerHTML = this.getWheelDefaultHint(isCompactWheel(wheelSvg), this.zoomedWheelFamily);
      }

      wheelContainer.querySelector('.wheel-zoom-reset-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        applyWheelZoom(wheelContainer, null);
      });

      let lastTouchTap = null;

      wheelSvg.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
          if (isCompactWheel(wheelSvg) && !this.zoomedWheelFamily) {
            lastTouchTap = null;
            return;
          }
          const target = document.elementFromPoint(e.clientX, e.clientY);
          const group = target?.closest?.('.wheel-nuance-group[data-act-emotion]:not(.dimmed)');
          const emotionId = group?.dataset?.actEmotion || '';
          const wasPreviewed = Boolean(group && activeHoveredGroup === group);
          pointerDown = { x: e.clientX, y: e.clientY, moved: false, pointerType: e.pointerType, emotionId, wasPreviewed };
          lastTouchTap = { emotionId, wasPreviewed };
          if (group) highlightGroup(group);
        } else {
          lastTouchTap = null;
        }
      });

      wheelSvg.addEventListener('pointerover', (e) => {
        if (e.pointerType === 'touch') return;
        const group = e.target.closest('.wheel-nuance-group[data-act-emotion]:not(.dimmed)');
        highlightGroup(group);
      });

      wheelSvg.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
          if (isCompactWheel(wheelSvg) && !this.zoomedWheelFamily) return;
          if (!pointerDown) return;
          if (!pointerDown.moved && Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y) > 8) {
            pointerDown.moved = true;
          }
          const target = document.elementFromPoint(e.clientX, e.clientY);
          const group = target?.closest?.('.wheel-nuance-group[data-act-emotion]:not(.dimmed)');
          highlightGroup(group);
          return;
        }
        const group = e.target.closest('.wheel-nuance-group[data-act-emotion]:not(.dimmed)');
        highlightGroup(group);
      });

      const handlePointerEnd = (e) => {
        if ((e.pointerType === 'touch' || e.pointerType === 'pen') && pointerDown) {
          if (pointerDown.moved) {
            suppressNextClick = true;
            setTimeout(() => { suppressNextClick = false; }, 150);
          }
          pointerDown = null;
        }
      };

      wheelSvg.addEventListener('pointerup', handlePointerEnd);
      wheelSvg.addEventListener('pointercancel', handlePointerEnd);

      wheelSvg.addEventListener('click', (e) => {
        if (suppressNextClick) {
          suppressNextClick = false;
          return;
        }

        const group = e.target.closest('.wheel-nuance-group[data-act-emotion]');
        const compact = isCompactWheel(wheelSvg);
        const isAlreadySelected = Boolean(group?.classList?.contains('selected'));
        const touchPreviewOnly = Boolean(
          lastTouchTap &&
          group &&
          !isAlreadySelected &&
          lastTouchTap.emotionId === group.dataset.actEmotion &&
          !lastTouchTap.wasPreviewed
        );

        if (this.zoomedWheelFamily) {
          if (!group) {
            lastTouchTap = null;
            applyWheelZoom(wheelContainer, null);
            return;
          }
          if (group.classList.contains('dimmed')) {
            const famId = group.dataset.emotionFamily;
            lastTouchTap = null;
            applyWheelZoom(wheelContainer, famId || null);
            return;
          }
          if (touchPreviewOnly) {
            highlightGroup(group);
            lastTouchTap = null;
            return;
          }
          lastTouchTap = null;
          this.toggleEmotion(group.dataset.actEmotion);
          if (onMutate) onMutate();
          return;
        }

        if (!group) return;

        if (compact) {
          const famId = group.dataset.emotionFamily;
          if (famId) {
            lastTouchTap = null;
            applyWheelZoom(wheelContainer, famId);
          }
          return;
        }

        if (touchPreviewOnly) {
          highlightGroup(group);
          lastTouchTap = null;
          return;
        }
        lastTouchTap = null;
        this.toggleEmotion(group.dataset.actEmotion);
        if (onMutate) onMutate();
      });

      const handleLeaveWheel = (e) => {
        if (e.pointerType === 'touch') return;
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
      this.zoomedWheelFamily = null;
      if (window.app?.closeModal) {
        window.app.closeModal();
      } else {
        modal.classList.remove('active');
        modalBody.classList.remove('modal-wheel-maximized');
      }
    };

    const syncInlineView = () => {
      if (this.currentStep === 1) {
        this.render();
        this.bindEvents();
      }
    };

    const renderModalContent = ({ preserveScroll = false } = {}) => {
      const prevScroll = preserveScroll ? modalBody.scrollTop : 0;
      modalBody.classList.add('modal-wheel-maximized');
      const isInEspacioAct = window.app?.currentView === 'act-space';

      modalBody.innerHTML = `
        <div class="flex-between" style="margin-bottom: 10px; gap: 10px; flex-wrap: wrap;">
          <div>
<h3 class="card-title" style="margin-bottom: 2px;">Rueda de las Emociones (Vista Maximizada)</h3>
            <p class="explanatory-subtext" style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Toca una o varias emociones concretas en el anillo exterior para nombrar lo que sientes.</p>
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
          renderModalContent({ preserveScroll: true });
        }
      });

      document.getElementById('btn-modal-wheel-x')?.addEventListener('click', closeModal);
      document.getElementById('btn-modal-wheel-close')?.addEventListener('click', closeModal);
      document.getElementById('btn-modal-wheel-clear')?.addEventListener('click', () => {
        this.entryData.emotions = [];
        this.entryData.emotion = '';
        this.entryData.lastFocusedEmotion = '';
        syncInlineView();
        renderModalContent({ preserveScroll: true });
      });
      document.getElementById('btn-modal-wheel-go-act')?.addEventListener('click', () => {
        closeModal();
        this.currentStep = 1;
        window.app?.navigate('act-space');
        this.render();
        this.bindEvents();
      });

      if (preserveScroll) {
        modalBody.scrollTop = prevScroll;
      }
    };

    renderModalContent();
    if (window.app?.openModal) {
      window.app.openModal('wheel');
    } else {
      modalBody.classList.add('modal-wheel-maximized');
      modal.classList.add('active');
    }
  }

  // Modals for Hayes Tools
  openMindNameModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

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

    if (window.app?.openModal) {
      window.app.openModal('default');
    } else {
      modal.classList.add('active');
    }

    const closeModal = () => {
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    };

    document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('btn-modal-save-mind-name')?.addEventListener('click', () => {
      const name = document.getElementById('input-mind-name')?.value?.trim();
      window.stateManager.setMindName(name || 'George');
      closeModal();
      window.app?.showToast(`Mente nombrada: ${name || 'George'}`);
      this.render();
      this.bindEvents();
    });
  }

  openBreathingModal() {
    this.stopBreathing();
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const meta = this.getBreathingPhaseMeta(this.breathingPhase);
    const st = window.stateManager.getSettings();
    const vibOn = st.vibration !== false;
    const sndOn = st.sound === true;

    modalBody.innerHTML = `
      <div class="flex-between" style="margin-bottom: 6px; gap: 10px;">
        <h3 class="card-title" style="margin: 0;">Hacerle hueco en el cuerpo</h3>
        <button type="button" class="btn-secondary" id="btn-modal-breathing-x" aria-label="Cerrar" style="font-size: 0.85rem; padding: 6px 11px;">✕</button>
      </div>
      <p class="card-subtitle" style="margin-bottom: 14px;">Respira alrededor de la sensación sin pelear contra ella.</p>

      <div class="breathing-pacer-container">
        <div class="breathing-circle-outer">
          <div class="breathing-ring"></div>
          <button type="button"
                  class="breathing-orb ${this.breathingPhase}"
                  id="breathing-orb"
                  aria-pressed="${this.breathingActive}"
                  aria-label="Iniciar respiración guiada">
            <span id="breathing-phase-word">${meta.orbLabel}</span>
          </button>
        </div>

        <div class="breathing-phase-label" id="breathing-phase-text">${meta.phaseText}</div>
        <div class="breathing-instruction" id="breathing-instruction-text">${meta.instruction}</div>
        <div class="breathing-cycle-hint" id="breathing-cycle-hint" hidden></div>

        <div class="breathing-actions-row mt-3">
          <button type="button" class="btn-primary" id="btn-toggle-breathing" style="font-size: 0.84rem; padding: 8px 18px;">
            Iniciar respiración guiada
          </button>
        </div>

        <div class="breathing-sensory-controls" id="breathing-sensory-controls" hidden>
          <button type="button" class="btn-secondary" id="btn-toggle-haptic" style="font-size: 0.78rem; padding: 6px 12px; border-color: ${vibOn ? 'var(--sage-500)' : 'var(--border-subtle)'};">
            Vibración guía: ${vibOn ? 'Sí' : 'No'}
          </button>
          <button type="button" class="btn-secondary" id="btn-toggle-sound" style="font-size: 0.78rem; padding: 6px 12px; border-color: ${sndOn ? 'var(--sage-500)' : 'var(--border-subtle)'};">
            Tonos ojos cerrados: ${sndOn ? 'Sí' : 'No'}
          </button>
        </div>
      </div>

      <div class="btn-group" style="justify-content: center; margin-top: 18px;">
        <button type="button" class="btn-secondary" id="btn-modal-breathing-done">
          Listo / Volver al Paso 2
        </button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('medium');
    } else {
      modal.classList.add('active');
    }

    const closeModal = () => {
      this.stopBreathing();
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    };

    const handleBreathingToggle = () => {
      if (this.breathingActive) {
        this.stopBreathing();
      } else {
        this.startBreathing();
      }
    };

    document.getElementById('btn-modal-breathing-x')?.addEventListener('click', closeModal);
    document.getElementById('btn-modal-breathing-done')?.addEventListener('click', closeModal);
    document.getElementById('btn-toggle-breathing')?.addEventListener('click', handleBreathingToggle);
    document.getElementById('breathing-orb')?.addEventListener('click', handleBreathingToggle);

    document.getElementById('btn-toggle-haptic')?.addEventListener('click', (e) => {
      const currSt = window.stateManager.getSettings();
      const nextVal = currSt.vibration === false;
      currSt.vibration = nextVal;
      window.stateManager.saveSettings(currSt);
      e.currentTarget.textContent = `Vibración guía: ${nextVal ? 'Sí' : 'No'}`;
      e.currentTarget.style.borderColor = nextVal ? 'var(--sage-500)' : 'var(--border-subtle)';
      if (nextVal) window.app?.triggerHaptic([60]);
      window.app?.showToast(nextVal ? 'Vibración guía activada' : 'Vibración guía desactivada');
    });

    document.getElementById('btn-toggle-sound')?.addEventListener('click', (e) => {
      const currSt = window.stateManager.getSettings();
      const nextVal = currSt.sound !== true;
      currSt.sound = nextVal;
      window.stateManager.saveSettings(currSt);
      e.currentTarget.textContent = `Tonos ojos cerrados: ${nextVal ? 'Sí' : 'No'}`;
      e.currentTarget.style.borderColor = nextVal ? 'var(--sage-500)' : 'var(--border-subtle)';
      if (nextVal) window.app?.playGentleTone(432, 350);
      window.app?.showToast(nextVal ? 'Tonos suaves activados' : 'Tonos suaves desactivados');
    });
  }

  openSomaticPostureModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

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

      <div class="explanatory-subtext" style="text-align: center; margin-top: 18px; font-style: italic; color: var(--sage-700); font-size: 0.9rem;">
        "Tu postura le informa a tu sistema nervioso de que estás a salvo incluso en medio de la incomodidad."
      </div>

      <div class="btn-group" style="justify-content: center; margin-top: 20px;">
        <button type="button" class="btn-primary" id="btn-modal-close-somatic">
          Postura Integrada / Continuar
        </button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('medium');
    } else {
      modal.classList.add('active');
    }

    document.getElementById('btn-modal-close-somatic')?.addEventListener('click', () => {
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    });
  }

  saveEntry() {
    this.stopBreathing();
    const esc = (s) => this.escapeHtml(s);
    this.entryData.carriedPassenger = this.getDerivedPassenger();
    if ((this.entryData.thought || '').trim() && !this.entryData.reframedThought) {
      this.entryData.reframedThought = this.buildReframedThought(
        this.defusionStyle,
        this.entryData.thought,
        window.stateManager.getMindName()
      );
    }

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

    const container = document.getElementById('act-space-view');
    if (!container) return;

    const delta = (entry.initialIntensity || 0) - (entry.postIntensity || 0);
    const quoteText = (entry.reframedThought || entry.thought || '').trim();
    const choiceLabel = entry.choiceType === 'value'
      ? (entry.valueChosen || 'Dirección con valores')
      : 'Piloto Automático';

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
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <span class="badge" style="background: rgba(87, 139, 116, 0.2); color: var(--sage-700);">Emoción: ${esc(entry.emotion || 'Malestar')}</span>
            <span class="badge" style="background: ${delta >= 0 ? 'rgba(74, 122, 102, 0.2)' : 'rgba(184, 107, 89, 0.2)'}; color: ${delta >= 0 ? 'var(--sage-700)' : 'var(--accent-tension)'};">
              Intensidad: ${entry.initialIntensity} → ${entry.postIntensity} (${delta >= 0 ? '-' + delta : '+' + Math.abs(delta)})
            </span>
          </div>

          ${quoteText ? `
            <div style="font-size: 0.85rem; font-style: italic; color: var(--text-secondary); margin-bottom: 8px;">
              "${esc(quoteText)}"
            </div>
          ` : ''}

          <div style="font-size: 0.82rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px; margin-top: 8px;">
            <span>Elección: </span><strong>${esc(choiceLabel)}</strong>
            ${entry.choiceType === 'value' && entry.committedAction ? `<br>Acción: "${esc(entry.committedAction)}"` : ''}
            ${entry.choiceType === 'autopilot' && entry.autopilotUrge ? `<br>Reflejo: "${esc(entry.autopilotUrge)}"` : ''}
            ${entry.carriedPassenger ? `<br>Pasajero a bordo: "${esc(entry.carriedPassenger)}"` : ''}
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
      window.app?.navigate('therapy');
    });

    window.app?.showToast('Crisis procesada e integrada en tu historial');
  }
}

window.espacioActApp = new EspacioActApp();
