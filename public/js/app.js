/**
 * KHORA - Tu espacio ACT
 * Main Application Orchestrator & Controller
 */

const KHORA_CREDITS = {
  githubUser: (typeof window !== 'undefined' && window.location?.hostname?.endsWith('.github.io'))
    ? window.location.hostname.split('.')[0]
    : 'JCarrascoF',
  repoName: 'khora',
  kofiUrl: 'https://ko-fi.com/jcarrascof'
};

const ACT_GLOSSARY = {
  'autoabandono': {
    title: 'Autoabandono',
    plain: 'Dejar tus propias necesidades, límites o bienestar en último lugar para que otra persona no se moleste.',
    example: 'Decir "no pasa nada, yo me encargo" estando agotado/a solo para evitar mala cara.'
  },
  'paz-falsa': {
    title: 'Paz Falsa',
    plain: 'Calma aparente afuera conseguida a base de callarte o ceder, que te deja en guerra por dentro (con resentimiento o agotamiento).',
    example: 'Aceptar un plan que detestas para no discutir y pasarte la tarde apagado/a y con rabia.'
  },
  'sumision-emocional': {
    title: 'Sumisión Emocional',
    plain: 'Hacerte pequeño/a o darle la razón al otro automáticamente por miedo a su enfado, frialdad o desaprobación.',
    example: 'Pedir perdón cuando en realidad no has hecho nada malo, solo para destensar el ambiente.'
  },
  'peaje-emocional': {
    title: 'Peaje Emocional',
    plain: 'La factura física y mental (rumiación, cansancio, nudo en el estómago, irritabilidad) que pagas tras haber cedido contra tu voluntad.',
    example: 'Sentirte vacío/a o con dolor de cabeza horas después de una conversación donde te callaste lo que pensabas.'
  },
  'defusion': {
    title: 'Defusión Cognitiva',
    plain: 'Dar un paso atrás para ver tus pensamientos como simples palabras o historias que cuenta tu mente, no como verdades absolutas que debas obedecer.',
    example: 'Pasar de "soy egoísta" a notar: "mi mente me está contando otra vez la historia de que soy egoísta".'
  },
  'piloto-automatico': {
    title: 'Piloto Automático',
    plain: 'Reaccionar por puro reflejo aprendido (complacer, justificarte de más o huir) sin parar un segundo a elegir qué quieres hacer.',
    example: 'Decir "sí, claro" en medio segundo antes de mirar tu agenda o cómo tienes el cuerpo.'
  },
  'aceptacion': {
    title: 'Aceptación / Disposición ACT',
    plain: 'No es resignarte ni aguantar abusos; es hacerle hueco en el cuerpo a una incomodidad limpia (como el vértigo o la culpa al poner un límite) para actuar según tus valores.',
    example: 'Sostener el cosquilleo de culpa 10 minutos tras decir "hoy no puedo" sin correr a retractarte.'
  },
  'fisicalizar': {
    title: 'Fisicalizar la Sensación',
    plain: 'Dejar de darle vueltas con la cabeza y observar la emoción como si fuera un objeto físico en tu cuerpo (forma, peso, temperatura).',
    example: 'Notar la ansiedad como "un bloque caliente en el pecho" en lugar de discutir por qué está ahí.'
  },
  'yo-contexto': {
    title: 'Yo como Contexto (Yo Observador)',
    plain: 'Darte cuenta de que tú eres la persona consciente que observa tus miedos y pensamientos (el conductor del autobús), no los miedos mismos.',
    example: 'Tú eres el cielo; el agobio de hoy es solo una nube pasajera que cruza sin dañarte.'
  },
  'hexaflex': {
    title: 'Hexaflex (Flexibilidad Psicológica)',
    plain: 'Los 6 músculos psicológicos de ACT (Aceptación, Defusión, Presente, Yo Observador, Valores y Acción) que te permiten adaptarte y ser fiel a ti mismo/a.',
    example: 'Entrenar estos 6 puntos para mantener el rumbo hacia lo que te importa aunque aparezca miedo.'
  },
  'dolor-limpio': {
    title: 'Dolor Limpio vs. Dolor Sucio',
    plain: 'El dolor limpio es la incomodidad natural de vivir o poner un límite; el dolor sucio es el machaque y culpa extra que tu mente añade encima.',
    example: 'Sentir tensión al decir una verdad (dolor limpio) vs. castigarte 3 días llamándote mala persona (dolor sucio).'
  },
  'pasajeros-autobus': {
    title: 'Pasajeros del Autobús',
    plain: 'Tus miedos, agobios y culpas habituales. Pueden subirse y gritar, pero no tienen manos para girar el volante de tu vida si tú conduces desde tus valores.',
    example: 'El miedo a decepcionar gritándote que cedas cuando vas a defender tu descanso.'
  },
  'valores-act': {
    title: 'Valores ACT (Constructor de Hayes)',
    plain: 'En ACT, un valor no es una meta ni una palabra abstracta, sino una cualidad elegida de tu propia conducta (cómo eliges actuar y cuidarte en cada área).',
    example: '"Ser una pareja comprensiva y atenta que escucha con ternura pero expresa sus límites" en lugar de un sustantivo suelto.'
  },
  'deconstructor-yo': {
    title: 'Deconstructor del "Yo Soy" (Self-as-Context)',
    plain: 'Ejercicio de Steven Hayes para desmontar etiquetas rígidas de identidad ("soy débil", "soy complaciente") y transformarlas en conductas concretas y modificables.',
    example: 'Pasar de "soy incapaz de decir no" a "cuando me piden algo urgente y miro al suelo, siento miedo y cedo".'
  },
  'postura-si': {
    title: 'Postura Somática del "SÍ"',
    plain: 'Entrenamiento corporal de Steven Hayes (soltar hombros, abrir palmas, exhalar lento) para desactivar el reflejo físico de defensa o sumisión antes de hablar.',
    example: 'Apoyar las manos abiertas sobre los muslos y aflojar la mandíbula antes de expresar un límite.'
  },
  'pivote-act': {
    title: 'El Pivote: Del Dolor al Anhelo',
    plain: 'Principio de Hayes: debajo de cada herida o miedo que te empuja a ceder hay un anhelo legítimo. Pivotar es cuidar ese anhelo desde tu dignidad en vez de con sumisión.',
    example: 'Detrás del miedo a que tu pareja se enfade está tu anhelo de conexión; pivotas hablando con afecto pero respetando tu descanso.'
  },
  'hojas-rio': {
    title: 'Hojas en el Río',
    plain: 'Ejercicio visual de defusión: colocar el pensamiento intrusivo sobre una hoja que flota en la corriente y observarlo pasar sin empujarlo ni obedecerlo.',
    example: 'Ver pasar la frase "se van a molestar conmigo" sobre la hoja mientras mantienes tu respiración.'
  },
  'generador-pensamientos': {
    title: 'Apodo de tu Generador de Pensamientos (Hayes)',
    plain: 'Ponerle un nombre o apodo a la fábrica automática de pensamientos (ej. "George", "Radio Catástrofe" o "El Juez") para recordar que tú eres quien escucha la radio, no el locutor.',
    example: '"Ah, ya está Radio Catástrofe diciéndome que se van a enfadar si digo que no. Gracias por avisar".'
  },
  'echar-el-ancla': {
    title: 'Echar el Ancla (Protocolo ACE de Russ Harris)',
    plain: 'En ACT, echar el ancla no sirve para hacer desaparecer la tormenta emocional (eso sería evitación), sino para sujetar el barco al fondo marino: Reconocer lo que sientes (A), Volver al cuerpo (C) y Conectar con lo que tienes delante (E).',
    example: 'Notar que hay angustia, pisar firme el suelo al exhalar lento y mirar 3 objetos reales de la habitación antes de decidir qué hacer.'
  },
  'evitacion-experiencial': {
    title: 'Evitación Experiencial',
    plain: 'El intento de luchar, suprimir, anestesiar o huir de emociones, pensamientos o sensaciones incómodas, aunque eso te aleje de la vida que valoras.',
    example: 'Cancelar algo importante o ceder a todo solo para no sentir el cosquilleo de ansiedad o culpa.'
  }
};

const ACT_GLOSSARY_PATTERNS = [
  { key: 'sumision-emocional', regex: /\bsumisi[oó]n emocional\b/i },
  { key: 'peaje-emocional', regex: /\bpeaje emocional\b|\bpeaje de autoabandono\b/i },
  { key: 'defusion', regex: /\bdefusi[oó]n cognitiva\b|\bdefusi[oó]n\b/i },
  { key: 'piloto-automatico', regex: /\bpiloto autom[aá]tico\b/i },
  { key: 'fisicalizar', regex: /\bfisicalizar la sensaci[oó]n\b|\bfisicalizar\b/i },
  { key: 'yo-contexto', regex: /\byo como contexto\b|\byo contexto\b|\byo observador\b/i },
  { key: 'dolor-limpio', regex: /\bdolor limpio\b|\bdolor sucio\b/i },
  { key: 'pasajeros-autobus', regex: /\bpasajeros de mi autob[uú]s\b|\bpasajeros del autob[uú]s\b|\bpasajero en el autob[uú]s\b/i },
  { key: 'valores-act', regex: /\bmis valores reales\b|\bvalores act\b|\bvalores construidos\b/i },
  { key: 'deconstructor-yo', regex: /\bdeconstructor del "yo soy"/i },
  { key: 'postura-si', regex: /\bpostura som[aá]tica del "s[ií]"/i },
  { key: 'pivote-act', regex: /\bel pivote: del dolor al anhelo\b|\bel pivote\b/i },
  { key: 'hojas-rio', regex: /\bhojas en el r[ií]o\b/i },
  { key: 'generador-pensamientos', regex: /\bgenerador de pensamientos\b|\bradio mental\b/i },
  { key: 'echar-el-ancla', regex: /\bechar el ancla\b|\bprotocolo ace\b/i },
  { key: 'evitacion-experiencial', regex: /\bevitaci[oó]n experiencial\b/i },
  { key: 'autoabandono', regex: /\bautoabandono\b/i },
  { key: 'paz-falsa', regex: /\bpaz falsa\b|\bfalsa paz\b/i },
  { key: 'hexaflex', regex: /\bhexaflex\b/i },
  { key: 'aceptacion', regex: /\bhacerle hueco\b|\baceptaci[oó]n act\b|\bdisposici[oó]n act\b/i }
];

if (typeof window !== 'undefined') {
  window.KHORA_CREDITS = KHORA_CREDITS;
  window.ACT_GLOSSARY = ACT_GLOSSARY;
  window.ACT_GLOSSARY_PATTERNS = ACT_GLOSSARY_PATTERNS;
}
if (typeof globalThis !== 'undefined') {
  globalThis.KHORA_CREDITS = KHORA_CREDITS;
  globalThis.ACT_GLOSSARY = ACT_GLOSSARY;
  globalThis.ACT_GLOSSARY_PATTERNS = ACT_GLOSSARY_PATTERNS;
}

class AppController {
  constructor() {
    this.currentView = 'guia-inicio';
    this.currentGroup = 'ahora-mismo';
    this.toastTimer = null;
    this.deferredInstallPrompt = null;

    this.navGroups = {
      'ahora-mismo': {
        label:'Ahora mismo',
        items: [
          { id:'guia-inicio', icon:'', label:'Inicio' },
          { id:'espacio-act', icon:'', label:'Procesar Emoción' },
          { id:'pildoras-trucos', icon:'', label:'Botiquín 1-Min' },
          { id:'brujula-valores', icon:'', label:'Elegir qué Hacer' },
          { id:'paz-falsa', icon:'', label:'Acabo de Ceder' },
          { id:'pildoras-estudio', icon:'', label:'Lecturas y Ejercicios' }
        ]
      },
      'yo': {
        label:'Yo',
        items: [
          { id:'perfil-valores', icon:'', label:'Mis Valores', helpTopic:'valores-faro' },
          { id:'perfil-autobus', icon:'', label:'Mi Autobús', helpTopic:'autobus-act' },
          { id:'radar-patrones', icon:'', label:'Mis Patrones', helpTopic:'radar-patrones' }
        ]
      },
      'insight': {
        label:'Evolución',
        items: [
          { id:'insight-terapia', icon:'', label:'Cuaderno de Terapia', helpTopic:'cuaderno-terapia' },
          { id:'insight-historial', icon:'', label:'Historial en Frío', helpTopic:'insight-historial' },
          { id:'insight-graficos', icon:'', label:'Gráficos y Hexaflex' },
          { id:'insight-actividad', icon:'', label:'Actividad Reciente' }
        ]
      }
    };
  }

  init() {
    this.initTheme();
    this.initPalette();
    this.initSurface();
    this.initButtons();
    this.initPWA();
    window.i18n?.init?.();
    this.bindGlobalNavigation();
    
    // Initialize sub-apps
    if (window.perfilApp) window.perfilApp.init();
    if (window.pazFalsaApp) window.pazFalsaApp.init();
    if (window.espacioActApp) window.espacioActApp.init();
    if (window.radarPatronesApp) window.radarPatronesApp.init();
    if (window.brujulaValoresApp) window.brujulaValoresApp.init();
    if (window.pildorasAnclajesApp) window.pildorasAnclajesApp.init();
    if (window.insightApp) window.insightApp.init();
    this.renderGuiaInicio();

    this.initGlossaryTooltips();
    this.updateDbStatusBadge();
    this.updateLockHeaderButton();
    this.renderPrivacyLockOverlay();
    this.updatePersistenceWarningBanner();
    this.maybeShowInstallGateModal();

    // Check url hash if present & support browser Back / Forward (hashchange)
    this.validViews = [
      'guia-inicio', 'ahora-mismo', 'yo', 'valores-rutina',
      'perfil', 'perfil-valores', 'perfil-autobus',
      'paz-falsa', 'espacio-act', 'radar-patrones', 'brujula-valores',
      'pildoras-anclajes', 'pildoras-trucos', 'pildoras-estudio',
      'insight', 'insight-terapia', 'insight-graficos', 'insight-historial', 'insight-actividad'
    ];
    const initialHash = (window.location.hash || '').replace('#', '');
    if (this.validViews.includes(initialHash)) {
      this.navigate(initialHash, { updateHash: false });
    } else {
      this.navigate('guia-inicio');
    }

    if (!this._hashChangeBound) {
      window.addEventListener('hashchange', () => {
        const nextHash = (window.location.hash || '').replace('#', '') || 'guia-inicio';
        const target = this.validViews.includes(nextHash) ? nextHash : 'guia-inicio';
        if (target !== this.currentView) {
          this.navigate(target, { updateHash: false });
        }
      });
      this._hashChangeBound = true;
    }

    // Modal background close
    document.getElementById('app-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'app-modal') {
        this.closeModal();
      }
    });

    // Auto-lock when returning from background if configured
    this.hiddenSince = null;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.hiddenSince = Date.now();
      } else if (document.visibilityState === 'visible') {
        const vault = window.stateManager?.getVaultStatus?.();
        if (vault && vault.enabled && !vault.locked && vault.autoLockMinutes >= 0 && this.hiddenSince) {
          const elapsedMs = Date.now() - this.hiddenSince;
          const thresholdMs = vault.autoLockMinutes === 0 ? 0 : vault.autoLockMinutes * 60 * 1000;
          if (elapsedMs >= thresholdMs) {
            this.closeModal();
            window.stateManager.lockVault();
          }
        }
        this.hiddenSince = null;
      }
    });

    // Global Escape key closes active modal or glossary tooltip
    document.addEventListener('keydown', (e) => {
      if (window.stateManager?.isVaultLocked?.()) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        const closedModal = this.closeModal();
        const tooltip = document.getElementById('act-glossary-tooltip');
        const tooltipWasVisible = tooltip && tooltip.classList.contains('visible');
        if (tooltipWasVisible) {
          tooltip.classList.remove('visible');
          tooltip.setAttribute('aria-hidden', 'true');
        }
        if (closedModal || tooltipWasVisible) {
          e.preventDefault?.();
        }
      }
    });

    // Listen to state changes to update active views & DB status badge
    window.stateManager.subscribe((event) => {
      if (event === 'vault_locked' || event === 'vault_unlocked' || event === 'vault_status_changed') {
        this.updateLockHeaderButton();
        this.renderPrivacyLockOverlay();
        if (event === 'vault_unlocked') {
          this.initTheme();
          this.initPalette();
          this.initSurface();
    this.initButtons();
          this.updatePersistenceWarningBanner();
          this.maybeShowInstallGateModal();
        } else if (event === 'vault_locked') {
          this.closeModal();
          this.setCrisisImmersive(false);
        }
      }
      if (event === 'auth_required') {
        if (!window.stateManager.isVaultLocked() && window.stateManager.getStorageMode() === 'db' && !document.getElementById('login-modal-root')) {
          this.openLoginModal();
        }
        return;
      }
      if (event === 'db_status_changed' || event === 'server_synced' || event === 'storage_mode_changed' || event === 'auth_changed') {
        this.updateDbStatusBadge();
        this.updatePersistenceWarningBanner();
        if (event === 'db_status_changed' || event === 'storage_mode_changed') {
          this.maybeShowInstallGateModal();
        }
      }
      if (event === 'db_status_changed' || event === 'vault_status_changed') {
        return;
      }
      if (event === 'server_synced' || event === 'storage_mode_changed') {
        this.initTheme();
        this.initPalette();
        this.initSurface();
    this.initButtons();
      }

      if (this.currentView === 'guia-inicio') {
        this.renderGuiaInicio();
      } else if (
        (this.currentView === 'perfil' ||
         this.currentView === 'perfil-valores' ||
         this.currentView === 'perfil-autobus') &&
        window.perfilApp
      ) {
        window.perfilApp.render();
        window.perfilApp.bindEvents();
      } else if (
        (this.currentView === 'insight' ||
         this.currentView === 'insight-terapia' ||
         this.currentView === 'insight-graficos' ||
         this.currentView === 'insight-historial' ||
         this.currentView === 'insight-actividad') &&
        window.insightApp
      ) {
        window.insightApp.render();
        window.insightApp.bindEvents();
      } else if (this.currentView === 'radar-patrones' && window.radarPatronesApp) {
        window.radarPatronesApp.render();
        window.radarPatronesApp.bindEvents();
      } else if (this.currentView === 'brujula-valores' && window.brujulaValoresApp) {
        window.brujulaValoresApp.render();
        window.brujulaValoresApp.bindEvents();
      } else if (
        (this.currentView === 'pildoras-anclajes' ||
         this.currentView === 'pildoras-trucos' ||
         this.currentView === 'pildoras-estudio') &&
        window.pildorasAnclajesApp
      ) {
        window.pildorasAnclajesApp.render();
        window.pildorasAnclajesApp.bindEvents();
      } else if (
        (event === 'server_synced' || event === 'data_imported' || event === 'data_cleared' || event === 'demo_seeded') &&
        this.currentView === 'espacio-act' &&
        window.espacioActApp
      ) {
        window.espacioActApp.render();
        window.espacioActApp.bindEvents();
      } else if (
        (event === 'server_synced' || event === 'data_imported' || event === 'data_cleared' || event === 'demo_seeded') &&
        this.currentView === 'paz-falsa' &&
        window.pazFalsaApp
      ) {
        window.pazFalsaApp.render();
        window.pazFalsaApp.bindEvents();
      }
    });
  }

  updateDbStatusBadge() {
    const settingsBtn = document.getElementById('btn-settings');
    const dot = document.getElementById('db-status-dot');
    const legacyBtn = document.getElementById('btn-db-status');
    const legacyLabel = document.getElementById('db-status-label');
    if (!window.stateManager) return;

    const status = window.stateManager.getDbStatus();
    const mode = status?.mode || window.stateManager.getStorageMode?.() || 'db';
    if (mode === 'local') {
      if (dot) dot.style.backgroundColor = 'var(--accent-clarity)';
      if (settingsBtn) settingsBtn.title = 'Configuración · Almacenamiento: Navegador local (solo este dispositivo)';
      if (legacyLabel) legacyLabel.textContent ='Navegador';
      if (legacyBtn) legacyBtn.title = 'Modo Navegador (solo en este dispositivo). Pulsa para configurar';
    } else if (status && status.connected) {
      if (dot) dot.style.backgroundColor = 'var(--sage-500)';
      if (settingsBtn) settingsBtn.title = 'Configuración · Almacenamiento: BD SQLite conectada';
      if (legacyLabel) legacyLabel.textContent ='BD SQLite';
      if (legacyBtn) legacyBtn.title = 'Conectado a Base de Datos SQLite. Pulsa para configurar';
    } else {
      if (dot) dot.style.backgroundColor = '#c98a58';
      if (settingsBtn) settingsBtn.title = 'Configuración · Almacenamiento: BD SQLite (sin conexión, usando caché local)';
      if (legacyLabel) legacyLabel.textContent ='BD (Offline)';
      if (legacyBtn) legacyBtn.title = 'Modo BD SQLite (sin conexión al servidor, guardando en caché local)';
    }
  }

  setModalSize(size = 'default') {
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;
    modalBody.classList.remove('modal-wheel-maximized', 'modal-wide', 'modal-medium');
    if (size === 'wide') modalBody.classList.add('modal-wide');
    else if (size === 'medium') modalBody.classList.add('modal-medium');
  }

  closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      this.setModalSize('default');
      window.pildorasAnclajesApp?.stopTrickTimer?.();
      return true;
    }
    return false;
  }

  // Navigation (Ahora mismo | Yo | Evolución [Reloj])
  navigate(targetView, options = {}) {
    this.closeModal();
    let resolvedSubView = targetView;
    if (targetView === 'ahora-mismo' || targetView === 'perfil-foco') resolvedSubView = 'guia-inicio';
    else if (targetView === 'yo' || targetView === 'valores-rutina' || targetView === 'perfil') resolvedSubView = 'perfil-valores';
    else if (targetView === 'insight') resolvedSubView = 'insight-terapia';

    let sectionId = resolvedSubView;
    let activeGroup = 'ahora-mismo';

    if (resolvedSubView === 'pildoras-trucos') {
      sectionId = 'pildoras-anclajes';
      activeGroup = 'ahora-mismo';
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.mode = 'trucos';
        window.pildorasAnclajesApp.currentTab = 'trucos';
      }
    } else if (resolvedSubView === 'pildoras-estudio') {
      sectionId = 'pildoras-anclajes';
      activeGroup = 'ahora-mismo';
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.mode = 'estudio';
        if (window.pildorasAnclajesApp.currentTab === 'trucos' || window.pildorasAnclajesApp.currentTab === 'posture') {
          window.pildorasAnclajesApp.currentTab = 'pildoras';
        }
      }
    } else if (resolvedSubView === 'pildoras-anclajes') {
      sectionId = 'pildoras-anclajes';
      const isTricks = window.pildorasAnclajesApp?.mode === 'trucos' || window.pildorasAnclajesApp?.currentTab === 'trucos';
      activeGroup = 'ahora-mismo';
      resolvedSubView = isTricks ? 'pildoras-trucos' : 'pildoras-estudio';
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.mode = isTricks ? 'trucos' : 'estudio';
      }
    } else if (
      resolvedSubView === 'perfil-valores' ||
      resolvedSubView === 'perfil-autobus'
    ) {
      sectionId = 'perfil';
      activeGroup = 'yo';
      if (window.perfilApp) {
        const tabMap = {
          'perfil-valores': 'valores',
          'perfil-autobus': 'autobus'
        };
        window.perfilApp.activeProfileTab = tabMap[resolvedSubView] || 'valores';
      }
    } else if (resolvedSubView === 'radar-patrones') {
      sectionId = 'radar-patrones';
      activeGroup = 'yo';
    } else if (
      resolvedSubView === 'insight-terapia' ||
      resolvedSubView === 'insight-graficos' ||
      resolvedSubView === 'insight-historial' ||
      resolvedSubView === 'insight-actividad'
    ) {
      sectionId = 'insight';
      activeGroup = 'insight';
      if (window.insightApp) {
        const tabMap = {
          'insight-terapia': 'terapia',
          'insight-graficos': 'graficos',
          'insight-historial': 'historial',
          'insight-actividad': 'actividad'
        };
        window.insightApp.activeInsightTab = tabMap[resolvedSubView] || 'terapia';
      }
    } else {
      // guia-inicio, espacio-act, paz-falsa, brujula-valores
      activeGroup = 'ahora-mismo';
    }

    this.currentView = resolvedSubView;
    this.currentGroup = activeGroup;
    if (sectionId !=='espacio-act') {
      this.setCrisisImmersive(false);
    }
    if (options.updateHash !== false && window.location.hash !== `#${resolvedSubView}`) {
      window.location.hash = resolvedSubView;
    }

    // Update the 3 top-level nav tabs
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.navGroup === activeGroup) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Switch view containers
    document.querySelectorAll('.subapp-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`${sectionId}-view`);
    if (targetSec) {
      targetSec.classList.add('active');
    }

    // Render contextual sub-navigation bar
    this.renderContextSubnav(activeGroup, resolvedSubView);

    // Scroll to top gently
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-render target subapp if necessary
    if (sectionId === 'guia-inicio') {
      this.renderGuiaInicio();
    } else if (sectionId === 'perfil' && window.perfilApp) {
      window.perfilApp.render();
      window.perfilApp.bindEvents();
    } else if (sectionId === 'insight' && window.insightApp) {
      window.insightApp.render();
      window.insightApp.bindEvents();
    } else if (sectionId === 'brujula-valores' && window.brujulaValoresApp) {
      window.brujulaValoresApp.render();
      window.brujulaValoresApp.bindEvents();
    } else if (sectionId === 'pildoras-anclajes' && window.pildorasAnclajesApp) {
      window.pildorasAnclajesApp.render();
      window.pildorasAnclajesApp.bindEvents();
    } else if (sectionId === 'espacio-act' && window.espacioActApp) {
      window.espacioActApp.render();
      window.espacioActApp.bindEvents();
    } else if (sectionId === 'paz-falsa' && window.pazFalsaApp) {
      window.pazFalsaApp.render();
      window.pazFalsaApp.bindEvents();
    } else if (sectionId === 'radar-patrones' && window.radarPatronesApp) {
      window.radarPatronesApp.render();
      window.radarPatronesApp.bindEvents();
    }
  }

  getCozyTimeGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h< 12) return'Buenos días. Sin prisa, estás en un lugar seguro.';
    if (h >= 12 && h< 20) return'Buenas tardes. Tómate un respiro antes de seguir.';
    return'Buenas noches. Sin prisa, estás en un lugar seguro.';
  }

  setCrisisImmersive(active) {
    if (active) {
      document.body.classList.add('crisis-immersive');
    } else {
      document.body.classList.remove('crisis-immersive');
    }
  }

  renderGuiaInicio() {
    const container = document.getElementById('guia-inicio-view');
    if (!container || !window.stateManager) return;

    const hotFlows = [
      {
        view: 'espacio-act',
        primary: true,
        title:'Siento una emoción intensa o bloqueo',
        time:'3 min',
        does:'Acompaña lo que notas en el cuerpo y toma distancia del pensamiento que lo alimenta.'
      },
      {
        view: 'pildoras-trucos',
        primary: false,
        title:'Botiquín de un minuto',
        time:'1 min',
        does:'Echar el ancla (ACE), pausa de 2 minutos o decir «no» con serenidad.'
      },
      {
        view: 'brujula-valores',
        primary: false,
        title:'Dudo qué hacer o temo ceder',
        time:'1 min',
        does:'Aclara qué te está frenando y elige un micro-paso fiel a tus valores.'
      },
      {
        view: 'paz-falsa',
        primary: false,
        title:'Acabo de ceder (Paz Falsa)',
        time:'2 min',
        does:'Déjalo por escrito sin reproche para ver con claridad el desgaste real.'
      }
    ];

    const greeting = this.getCozyTimeGreeting();

    container.innerHTML = `
      <div class="view-plain-shell">
<div class="cozy-home-header">
<p class="cozy-greeting">${greeting}</p>
          <div class="title-with-help">
<h2 class="cozy-home-heading">¿Dónde quieres poner atención ahora?</h2>
            <button type="button" class="help-info-trigger" data-help-topic="guia-inicio" aria-label="Información de esta herramienta">ⓘ</button>
          </div>
<p class="cozy-home-sub">No hace falta resolver nada de golpe. Elige el lugar desde el que quieres observarlo.</p>
        </div>

<div>
<div class="cozy-section-label">Ahora mismo</div>
          <div class="guided-triage-grid">
            ${hotFlows.map(flow => `
<button type="button" class="triage-card ${flow.primary ?'triage-card-primary' :''}" data-go-view="${flow.view}">
<div class="triage-card-body">
<div class="triage-card-title">${flow.title}</div>
<p class="triage-card-desc">${flow.does}</p>
                </div>
<div class="triage-card-meta">
<span class="triage-time-badge">${flow.time}</span>
<span class="triage-card-arrow" aria-hidden="true">→</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

<div class="triage-calm-section">
<div class="cozy-section-label">En calma</div>
<button type="button" class="triage-calm-item" data-go-view="pildoras-estudio" style="width: 100%; text-align: left; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
<div class="triage-card-title" style="font-size: 1.04rem;">Lecturas y ejercicios ACT</div>
<p class="triage-card-desc">
                Píldoras de 1 minuto, frases ancla, Deconstructor «Yo Soy» y El Pivote.
</p>
            </div>
<span class="triage-card-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-go-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.goView;
        if (target) this.navigate(target);
      });
    });
  }

  renderContextSubnav(groupId, activeSubView) {
    const subnavEl = document.getElementById('context-subnav');
    if (!subnavEl) return;

    const group = this.navGroups[groupId];
    if (!group || groupId === 'ahora-mismo') {
      subnavEl.classList.add('hidden');
      subnavEl.innerHTML = '';
      return;
    }

    subnavEl.classList.remove('hidden');
    subnavEl.innerHTML = `
      <div class="context-subnav-inner">
        <span class="context-subnav-label">${group.label}</span>
        ${group.items.map(item => {
          const isActive = item.id === activeSubView;
          const btnHtml = `
            <button type="button" class="subnav-pill ${isActive ? 'active' : ''}" data-subnav-view="${item.id}">
              ${item.icon ?`<span>${item.icon}</span>` :''}
              <span>${item.label}</span>
            </button>
          `;
          if (isActive && item.helpTopic) {
            return `
              <span class="subnav-pill-group">
                ${btnHtml}
                <button type="button" class="help-info-trigger subnav-help-trigger" data-help-topic="${item.helpTopic}" aria-label="Información de esta herramienta">ⓘ</button>
              </span>
            `;
          }
          return btnHtml;
        }).join('')}
      </div>
    `;

    subnavEl.querySelectorAll('.subnav-pill[data-subnav-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigate(btn.dataset.subnavView);
      });
    });
  }

  bindGlobalNavigation() {
    // Nav items (use data-nav-group or data-view)
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.dataset.navGroup || item.dataset.view;
        if (target) this.navigate(target);
      });
    });

    // Brand click returns to guided home
    document.querySelector('.brand-wrapper')?.addEventListener('click', () => {
      this.navigate('guia-inicio');
    });

    // Header local-storage warning pill -> opens local storage / install info modal
    document.getElementById('header-storage-warning')?.addEventListener('click', () => {
      this.openInstallGateModal(true);
    });

    // SOS Crisis quick button -> Opens Low-Load ACT Crisis Triage Modal
    document.getElementById('btn-sos-crisis')?.addEventListener('click', () => {
      this.openSosCrisisModal();
    });

    // Quick Privacy Lock Button
    document.getElementById('btn-quick-lock')?.addEventListener('click', () => {
      if (window.stateManager?.lockVault?.()) {
        this.closeModal();
        this.showToast('Khōra bloqueado');
      }
    });

    // Global Technical Settings (Theme, Language, DB Storage, Backups, Sensory & PWA)
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.openSettingsModal();
    });

    // Quick Header Language Toggle (ES / EN)
    document.getElementById('btn-lang-toggle')?.addEventListener('click', () => {
      window.i18n?.toggleLang?.();
    });

    // Global Persistent Footer Credits & Feedback trigger
    const footerGh = document.getElementById('footer-github-link');
    if (footerGh) {
      footerGh.href = `https://github.com/${KHORA_CREDITS.githubUser}/${KHORA_CREDITS.repoName}`;
      footerGh.textContent = `@${KHORA_CREDITS.githubUser}`;
    }
    const footerKofi = document.getElementById('footer-kofi-link');
    if (footerKofi) {
      footerKofi.href = KHORA_CREDITS.kofiUrl;
    }
    document.getElementById('btn-footer-feedback')?.addEventListener('click', () => {
      this.openFeedbackModal();
    });

    // Contextual Screen Help button (?)
    document.getElementById('btn-context-help')?.addEventListener('click', () => {
      this.openScreenHelpModal(this.currentView);
    });

    // Inline (i) Help & Tutorial triggers across sections
    if (!this._helpDelegatedBound) {
      document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest?.('.help-info-trigger[data-help-topic]');
        if (trigger) {
          e.preventDefault();
          e.stopPropagation();
          this.openTopicHelpModal(trigger.dataset.helpTopic);
        }
      });
      this._helpDelegatedBound = true;
    }

    // Legacy shortcut support
    document.getElementById('btn-db-status')?.addEventListener('click', () => {
      this.openSettingsModal();
    });

    // Theme Toggle (kept safely if present)
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Exit Immersive Crisis Mode bar
    document.getElementById('btn-exit-crisis-immersive')?.addEventListener('click', () => {
      this.setCrisisImmersive(false);
      this.navigate('guia-inicio');
    });
  }


  // Sensory Feedback for Eyes-Closed ACT Grounding & Breathing
  triggerHaptic(pattern = [60]) {
    try {
      const settings = window.stateManager?.getSettings() || {};
      if (settings.vibration === false) return;
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore unsupported environments
    }
  }

  playGentleTone(freq = 432, durationMs = 450) {
    try {
      const settings = window.stateManager?.getSettings() || {};
      if (settings.sound !== true) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + durationMs / 1000 + 0.02);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore disconnect errors
        }
      };
    } catch {
      // Ignore audio errors
    }
  }

  // SOS ACT Crisis Triage Modal (Low Cognitive Load)
  openSosCrisisModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    this.setModalSize('medium');

    const esc = window.KhoraUtils.escapeHtml;

    const profile = window.stateManager?.getProfile() || {};
    const anchors = window.stateManager?.getAnchors() || [];
    const primaryVal = (profile.coreValues && profile.coreValues[0]) ? profile.coreValues[0] : null;
    const topAnchor = anchors[0] || null;

    let lighthouseHtml = '';
    if (primaryVal || topAnchor) {
      const valText = primaryVal ? `${primaryVal.domain}: ${primaryVal.statement}` : '';
      const anchorText = topAnchor ? topAnchor.text : '';
      lighthouseHtml = `
<div style="background: var(--bg-surface); border-left: 2px solid var(--sage-500); border-radius: var(--radius-md); padding: 12px 15px; margin: 12px 0; text-align: left;">
<div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--sage-500); margin-bottom: 4px;">
            Tu Faro Personal ACT
          </div>
          ${valText ?`<div style="font-family: var(--font-serif); font-size: 0.96rem; color: var(--text-primary); line-height: 1.45;">«${esc(valText)}»</div>` :''}
          ${anchorText ?`<div style="font-family: var(--font-serif); font-size: 0.84rem; font-style: italic; color: var(--text-secondary); margin-top: ${valText ?'4px' :'0'};">"${esc(anchorText)}"</div>` :''}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="flex-between" style="gap: 8px; align-items: flex-start;">
        <div>
<h3 class="card-title">Asistencia rápida en crisis ACT</h3>
<p class="card-subtitle mt-1" style="line-height: 1.5;">
            En ACT no luchamos contra la ola emocional ni intentamos suprimirla. Primero echamos el ancla para no ser arrastrados y luego elegimos hacia dónde llevar el timón.
          </p>
        </div>
        <button type="button" class="btn-icon" id="btn-sos-close" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
      </div>

      ${lighthouseHtml}

      <div class="sos-options-stack" style="display: flex; flex-direction: column; margin-top: 14px;">
        <button type="button" id="btn-sos-drop-anchor" class="sos-option-block sos-option-primary" style="text-align: left; width: 100%; cursor: pointer; font-family: inherit;">
          <div style="font-family: var(--font-serif); font-size: 1.06rem; color: var(--text-primary); margin-bottom: 4px;">
            1. Echar el Ancla en 60s (Protocolo ACE)
          </div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.48;">
            Para picos de angustia, agobio o miedo intenso: reconoce la ola (A), vuelve al cuerpo (C) y conecta con el presente (E).
          </div>
        </button>

        <div class="sos-option-block">
          <div style="font-family: var(--font-serif); font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">
            2. Frenar el piloto automático
            </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">
              Cuando sientes urgencia de huir, ceder por miedo o reaccionar en caliente:
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-secondary" id="btn-sos-bus-driver" style="flex: 1; font-size: 0.8rem; padding: 8px 12px;">
              Negar el Volante
              </button>
            <button type="button" class="btn-secondary" id="btn-sos-pause-2min" style="flex: 1; font-size: 0.8rem; padding: 8px 12px;">
              Pausa de 2 Minutos
              </button>
            </div>
          </div>

        <div class="sos-option-block">
          <div style="font-family: var(--font-serif); font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">
            3. Procesar la crisis en 4 pasos
            </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
              <button type="button" class="btn-primary" id="btn-sos-full-act" style="flex: 1; font-size: 0.82rem; padding: 9px 12px;">
              Empezar en Rueda Emocional
              </button>
              <button type="button" class="btn-secondary" id="btn-sos-body-act" style="flex: 1; font-size: 0.82rem; padding: 9px 12px;">
              Ir directo al Cuerpo (Paso 2)
              </button>
            </div>
          </div>
        </div>
    `;

    modal.classList.add('active');
    this.triggerHaptic([50]);

    document.getElementById('btn-sos-close')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    document.getElementById('btn-sos-drop-anchor')?.addEventListener('click', () => {
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.launchTrickRunner('trick_drop_anchor');
      }
    });

    document.getElementById('btn-sos-bus-driver')?.addEventListener('click', () => {
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.launchTrickRunner('trick_bus_driver');
      }
    });

    document.getElementById('btn-sos-pause-2min')?.addEventListener('click', () => {
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.launchTrickRunner('trick_pause_rescue');
      }
    });

    document.getElementById('btn-sos-full-act')?.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.espacioActApp) {
        window.espacioActApp.resetForm();
      }
      this.navigate('espacio-act');
      this.setCrisisImmersive(true);
      this.showToast('Espacio de Acompañamiento ACT iniciado');
    });

    document.getElementById('btn-sos-body-act')?.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.espacioActApp) {
        window.espacioActApp.resetForm();
        window.espacioActApp.entryData.emotions = ['Desbordamiento'];
        window.espacioActApp.entryData.lastFocusedEmotion = 'Desbordamiento';
        window.espacioActApp.entryData.emotion = 'Desbordamiento';
        window.espacioActApp.breathingPausedByUser = false;
        window.espacioActApp.setStep(2);
      }
      this.navigate('espacio-act');
      this.setCrisisImmersive(true);
      this.showToast('Aterrizando en el cuerpo (Aceptación ACT)');
    });
  }

  // Toast System
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const localizedMsg = window.i18n?.translateText ? window.i18n.translateText(message) : message;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${localizedMsg}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Global Accessible ACT Glossary Tooltips (.act-term, .help-info-trigger & #act-glossary-tooltip)
  initGlossaryTooltips() {
    const tooltip = document.getElementById('act-glossary-tooltip');
    if (!tooltip) return;

    const localizeTooltip = () => {
      window.i18n?.localizeDOM?.(tooltip);
    };

    const positionAndShowTooltip = (anchorEl) => {
      localizeTooltip();
      tooltip.setAttribute('aria-hidden', 'false');
      tooltip.classList.add('visible');

      const rect = anchorEl.getBoundingClientRect();
      const tipW = tooltip.offsetWidth || 345;
      const tipH = tooltip.offsetHeight || 150;
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - tipW - 12));
      const top = rect.top - tipH - 10 >= 8
        ? rect.top - tipH - 10
        : Math.min(window.innerHeight - tipH - 12, rect.bottom + 10);

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const showTooltipForTerm = (termEl) => {
      const key = termEl.dataset.term;
      const entry = ACT_GLOSSARY[key];
      if (!entry) return;

      tooltip.innerHTML = `
<div class="act-glossary-title">${entry.title}</div>
        <div class="act-glossary-plain">${entry.plain}</div>
        <div class="act-glossary-example"><strong>${window.i18n?.isEn?.() ? 'Example:' : 'Ejemplo:'}</strong> ${entry.example}</div>
      `;
      positionAndShowTooltip(termEl);
    };

    const showTooltipForHelpTrigger = (triggerEl) => {
      const topicId = triggerEl.dataset.helpTopic;
      const catalog = this.getHelpCatalog();
      const item = catalog.topics[topicId] || catalog.screens[topicId];
      if (!item) return;

      tooltip.innerHTML = `
        <div class="act-glossary-title" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
          <span>${item.title}</span>
          ${item.time ? `<span class="flow-purpose-pill" style="font-size: 0.72rem; padding: 1px 8px;">${item.time}</span>` : ''}
        </div>
        <div class="act-glossary-plain" style="display: flex; flex-direction: column; gap: 5px; margin-top: 6px;">
          ${item.does ? `<div><strong>Qué haces:</strong> <span>${item.does}</span></div>` : (item.summary ? `<div>${item.summary}</div>` : '')}
          ${item.brings ?`<div><strong>Qué aporta:</strong><span>${item.brings}</span></div>` :''}
        </div>
        <div class="act-glossary-example" style="margin-top: 6px; font-style: normal; font-size: 0.73rem;">
          Pulsa ⓘ para ver la guía paso a paso
        </div>
      `;
      positionAndShowTooltip(triggerEl);
    };

    const hideTooltip = () => {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
    };

    const handleEnter = (e) => {
      const helpTrigger = e.target.closest?.('.help-info-trigger[data-help-topic]');
      if (helpTrigger) {
        showTooltipForHelpTrigger(helpTrigger);
        return;
      }
      const termEl = e.target.closest?.('.act-term[data-term]');
      if (termEl) showTooltipForTerm(termEl);
    };

    const handleLeave = (e) => {
      if (e.target.closest?.('.help-info-trigger[data-help-topic], .act-term[data-term]')) {
        hideTooltip();
      }
    };

    document.body.addEventListener('mouseover', handleEnter);
    document.body.addEventListener('mouseout', handleLeave);
    document.body.addEventListener('focusin', handleEnter);
    document.body.addEventListener('focusout', handleLeave);

    document.body.addEventListener('click', (e) => {
      if (e.target.closest?.('.help-info-trigger[data-help-topic]')) {
        hideTooltip();
        return;
      }
      const termEl = e.target.closest?.('.act-term[data-term]');
      if (termEl) {
        showTooltipForTerm(termEl);
      } else {
        hideTooltip();
      }
    });

    const appContainer = document.querySelector('.app-container') || document.body;
    this.glossaryObserver = new MutationObserver(() => {
      this.decorateGlossaryTerms();
    });
    this.decorateGlossaryTerms();
    this.glossaryObserver.observe(appContainer, { childList: true, subtree: true });
  }

  decorateGlossaryTerms() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;

    window.i18n?.localizeDOM?.(appContainer);

    if (this.glossaryObserver) this.glossaryObserver.disconnect();
    try {
      const targets = appContainer.querySelectorAll(
        '.card-subtitle, .form-hint, .history-detail'
      );

      const processTextNode = (textNode, usedKeys) => {
        if (!textNode || !textNode.nodeValue || !textNode.parentNode) return;
        const text = textNode.nodeValue;
        for (const pat of ACT_GLOSSARY_PATTERNS) {
          if (usedKeys.has(pat.key)) continue;
          const match = pat.regex.exec(text);
          if (!match) continue;

          usedKeys.add(pat.key);
          const idx = match.index;
          const matchedText = match[0];
          const before = text.slice(0, idx);
          const after = text.slice(idx + matchedText.length);

          const frag = document.createDocumentFragment();
          let beforeNode = null;
          let afterNode = null;
          if (before) {
            beforeNode = document.createTextNode(before);
            frag.appendChild(beforeNode);
          }

          const span = document.createElement('span');
          span.className = 'act-term';
          span.dataset.term = pat.key;
          span.textContent = matchedText;
          frag.appendChild(span);

          if (after) {
            afterNode = document.createTextNode(after);
            frag.appendChild(afterNode);
          }

          textNode.parentNode.replaceChild(frag, textNode);
          if (beforeNode) processTextNode(beforeNode, usedKeys);
          if (afterNode) processTextNode(afterNode, usedKeys);
          return;
        }
      };

      targets.forEach((block) => {
        if (block.dataset.glossaryProcessed === '1') return;
        block.dataset.glossaryProcessed = '1';

        const usedKeys = new Set();
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) {
          if (!node.nodeValue || !node.nodeValue.trim()) continue;
          const parentTag = node.parentElement?.tagName;
          if (node.parentElement?.closest('.act-term, button, input, textarea, select, svg')) continue;
          if (parentTag === 'SCRIPT' || parentTag === 'STYLE') continue;
          textNodes.push(node);
        }

        textNodes.forEach((textNode) => processTextNode(textNode, usedKeys));
      });
    } finally {
      if (this.glossaryObserver) {
        this.glossaryObserver.observe(appContainer, { childList: true, subtree: true });
      }
    }
  }


  updateLockHeaderButton() {
    const btn = document.getElementById('btn-quick-lock');
    if (!btn || !window.stateManager) return;
    const enabled = window.stateManager.isVaultEnabled?.();
    btn.style.display = enabled ? 'inline-flex' : 'none';
  }

  renderPrivacyLockOverlay() {
    const overlay = document.getElementById('privacy-lock-overlay');
    if (!overlay || !window.stateManager) return;

    const locked = window.stateManager.isVaultLocked?.();
    if (!locked) {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      return;
    }

    const bioEnabled = window.stateManager.hasBiometricEnabled?.() && window.stateManager.isBiometricSupported?.();
    overlay.classList.remove('hidden');
    overlay.innerHTML = `
      <div class="privacy-lock-card">
        <div class="privacy-lock-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0 0 2px 0;">
          Khōra bloqueado
        </h2>
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 10px;">
          Tu espacio ACT
        </div>
        <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45; margin: 0 0 18px 0;">
          Tus datos están protegidos con cifrado <strong>AES-256-GCM</strong>. Introduce tu PIN o contraseña para descifrarlos.
        </p>

        <form id="privacy-lock-form" style="display: flex; flex-direction: column; gap: 10px;">
          <input type="password" id="lock-passphrase" class="form-input" placeholder="PIN o contraseña" autocomplete="current-password" required style="text-align: center; font-size: 1rem; letter-spacing: 0.08em;">
          <div id="lock-error" style="display: none; font-size: 0.82rem; color: var(--accent-tension); font-weight: 600;"></div>
          <button type="submit" class="btn-primary" id="btn-lock-unlock" style="width: 100%; justify-content: center;">
            Desbloquear
          </button>
        </form>

        ${bioEnabled ? `
          <button type="button" class="btn-secondary" id="btn-lock-biometric" style="width: 100%; justify-content: center; margin-top: 10px;">
            Desbloquear con FaceID / Huella
          </button>
        ` : ''}
      </div>
    `;

    const passInput = document.getElementById('lock-passphrase');
    setTimeout(() => passInput?.focus?.(), 30);

    document.getElementById('privacy-lock-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pass = document.getElementById('lock-passphrase')?.value || '';
      const errorEl = document.getElementById('lock-error');
      const btn = document.getElementById('btn-lock-unlock');
      if (btn) btn.disabled = true;
      if (errorEl) errorEl.style.display = 'none';

      const res = await window.stateManager.unlockVault(pass);
      if (btn) btn.disabled = false;

      if (!res.ok && errorEl) {
        errorEl.textContent = res.error || 'PIN o contraseña incorrectos';
        errorEl.style.display = 'block';
        passInput?.focus?.();
      }
    });

    document.getElementById('btn-lock-biometric')?.addEventListener('click', async () => {
      const errorEl = document.getElementById('lock-error');
      if (errorEl) errorEl.style.display = 'none';
      const res = await window.stateManager.unlockWithBiometric();
      if (!res.ok && errorEl) {
        errorEl.textContent = res.error || 'No se pudo verificar FaceID / Huella';
        errorEl.style.display = 'block';
      }
    });
  }


  // Login Modal for Protected Shared SQLite Server
  openLoginModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody || !window.stateManager) return;

    this.setModalSize('default');
    modalBody.innerHTML = `
      <div id="login-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
<h3 class="card-title">Iniciar sesión en Khōra</h3>
            <p class="card-subtitle mt-1" style="line-height: 1.45;">
              Los datos compartidos de la base de datos SQLite están protegidos. Introduce tus credenciales para sincronizar.
            </p>
          </div>
          <button type="button" class="btn-icon" id="btn-login-close" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        <form id="login-modal-form" style="margin-top: 14px; display: flex; flex-direction: column; gap: 10px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="login-username">Usuario</label>
            <input type="text" id="login-username" class="form-input" value="admin" autocomplete="username" required>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="login-password">Contraseña</label>
            <input type="password" id="login-password" class="form-input" placeholder="Tu contraseña" autocomplete="current-password" required>
          </div>
          <div id="login-error" style="display: none; font-size: 0.82rem; color: var(--accent-tension); font-weight: 600;"></div>

          <button type="submit" class="btn-primary" id="btn-login-submit" style="width: 100%; justify-content: center; margin-top: 4px;">
            Entrar y sincronizar
          </button>
        </form>

<div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); text-align: center;">
          <button type="button" class="btn-secondary" id="btn-login-use-local" style="width: 100%; justify-content: center; font-size: 0.8rem;">
            Usar solo en este navegador (sin acceder a la BD)
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');

    document.getElementById('btn-login-close')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('btn-login-use-local')?.addEventListener('click', async () => {
      await window.stateManager.setStorageMode('local');
      this.closeModal();
      this.updateDbStatusBadge();
      this.showToast('Modo Navegador activado (sin acceso al servidor)');
    });

    document.getElementById('login-modal-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username')?.value?.trim() || 'admin';
      const password = document.getElementById('login-password')?.value || '';
      const errorEl = document.getElementById('login-error');
      const submitBtn = document.getElementById('btn-login-submit');
      if (submitBtn) submitBtn.disabled = true;
      if (errorEl) errorEl.style.display = 'none';

      const result = await window.stateManager.login(username, password);
      if (submitBtn) submitBtn.disabled = false;

      if (result.ok) {
        this.closeModal();
        this.updateDbStatusBadge();
        if (this.currentView) {
          this.navigate(this.currentView);
        }
        this.showToast('Sesión iniciada y datos sincronizados');
      } else if (errorEl) {
        errorEl.textContent = result.error || 'Usuario o contraseña incorrectos';
        errorEl.style.display = 'block';
      }
    });
  }

  // -------------------------------------------------------------
  // PWA INSTALLATION DETECTOR & PERSISTENCE WARNINGS
  // -------------------------------------------------------------
  isStandalonePWA() {
    try {
      const m1 = typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)')?.matches;
      const m2 = typeof window !== 'undefined' && window.matchMedia?.('(display-mode: fullscreen)')?.matches;
      const iosStandalone = typeof window !== 'undefined' && window.navigator?.standalone === true;
      return Boolean(m1 || m2 || iosStandalone);
    } catch {
      return false;
    }
  }

  isIosDevice() {
    const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
    const maxTouch = typeof navigator !== 'undefined' ? (navigator.maxTouchPoints || 0) : 0;
    return /iPhone|iPad|iPod/i.test(ua) || (maxTouch > 1 && /Macintosh/i.test(ua));
  }

  isMobileOrTabletDevice() {
    const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
    return this.isIosDevice() || /Android|Mobile|Tablet/i.test(ua);
  }

  isBannerDismissed() {
    if (this.desktopBannerDismissed) return true;
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem('act_persistence_banner_dismissed') === '1';
    } catch {
      return false;
    }
  }

  markBannerDismissed() {
    this.desktopBannerDismissed = true;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('act_persistence_banner_dismissed', '1');
      }
    } catch {
      // Ignore storage errors
    }
  }

  isInstallGateDismissed() {
    if (this.installGateDismissed) return true;
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('act_storage_welcome_seen') === '1') {
        return true;
      }
      return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ethos_install_gate_dismissed') === '1';
    } catch {
      return false;
    }
  }

  markInstallGateDismissed() {
    this.installGateDismissed = true;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('act_storage_welcome_seen', '1');
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('ethos_install_gate_dismissed', '1');
      }
    } catch {
      // Ignore storage errors
    }
  }

  openFeedbackModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    this.setModalSize('default');
    modalBody.innerHTML = `
      <div id="feedback-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
<h3 class="card-title">Enviar Feedback o Sugerencia</h3>
            <p class="card-subtitle mt-1" style="line-height: 1.45;">
              Comparte cualquier idea de mejora, fallo detectado o comentario sobre tu experiencia con Khōra.
            </p>
          </div>
          <button type="button" class="btn-icon" id="btn-feedback-x" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        <div class="form-group mt-3">
          <label class="form-label" for="feedback-type">Tipo de comentario</label>
          <select id="feedback-type" class="form-select">
<option value="Sugerencia o nueva idea">Sugerencia o nueva idea</option>
<option value="Fallo o problema técnico">Fallo o problema técnico</option>
<option value="Comentario sobre la app">Comentario sobre la app</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="feedback-title">Título breve</label>
          <input type="text" id="feedback-title" class="form-input" placeholder="Resumen breve (ej: Idea para el historial, ajuste en móvil...)">
        </div>

        <div class="form-group">
          <label class="form-label" for="feedback-message">Detalles</label>
          <textarea id="feedback-message" class="form-textarea" rows="4" placeholder="Describe tu sugerencia, comentario o qué ocurrió..."></textarea>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button type="button" class="btn-primary" id="btn-feedback-github" style="width: 100%; justify-content: center;">
            Enviar en GitHub Issues
          </button>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-secondary" id="btn-feedback-copy" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              Copiar mensaje
            </button>
            <button type="button" class="btn-secondary" id="btn-feedback-cancel" style="font-size: 0.82rem;">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    const buildFormatted = () => {
      const type = document.getElementById('feedback-type')?.value ||'Sugerencia o nueva idea';
      const title = document.getElementById('feedback-title')?.value?.trim() ||'Feedback Khōra';
      const bodyMsg = document.getElementById('feedback-message')?.value?.trim() || '';
      const lang = window.i18n?.getLang?.() || 'es';
      const issueTitle = `[Feedback] ${title}`;
      const issueBody = [
        `**${type}**`,
        '',
        bodyMsg || '(Sin descripción adicional)',
        '',
        `---`,
`Khōra · lang: ${lang} · mode: ${window.stateManager?.getStorageMode?.() ||'local'}`
      ].join('\n');
      return { issueTitle, issueBody };
    };

    document.getElementById('btn-feedback-x')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-feedback-cancel')?.addEventListener('click', () => this.closeModal());

    document.getElementById('btn-feedback-github')?.addEventListener('click', () => {
      const { issueTitle, issueBody } = buildFormatted();
      const url = `https://github.com/${KHORA_CREDITS.githubUser}/${KHORA_CREDITS.repoName}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
      window.open?.(url, '_blank', 'noopener,noreferrer');
      this.showToast('Abriendo GitHub Issues con tu mensaje preparado');
    });

    document.getElementById('btn-feedback-copy')?.addEventListener('click', async () => {
      const { issueTitle, issueBody } = buildFormatted();
      const fullText = `${issueTitle}\n\n${issueBody}`;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(fullText);
        } else {
          const tmp = document.createElement('textarea');
          tmp.value = fullText;
          document.body.appendChild(tmp);
          tmp.select?.();
          document.execCommand?.('copy');
          tmp.remove();
        }
        this.showToast('Feedback copiado al portapapeles');
      } catch {
        this.showToast('Feedback preparado para copiar');
      }
    });
  }

  async triggerQuickBackupShareOrDownload() {
    if (!window.stateManager || window.stateManager.isVaultLocked?.()) {
      this.showToast('Desbloquea primero la app para exportar tus datos');
      return;
    }
    const json = window.stateManager.exportData();
    const filename = `khora_act_backup_${new Date().toISOString().slice(0, 10)}.json`;
    try {
      if (typeof navigator !== 'undefined' && typeof File === 'function' && navigator.share) {
        const file = new File([json], filename, { type: 'application/json' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({
            title:'Copia de seguridad Khōra (ACT)',
            files: [file]
          });
          this.showToast('Copia de seguridad compartida / guardada');
          return;
        }
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Copia de seguridad JSON descargada');
  }

  updatePersistenceWarningBanner() {
    const banner = document.getElementById('persistence-warning-banner');
    const headerBtn = document.getElementById('header-storage-warning');
    const headerLabel = document.getElementById('header-storage-warning-text');
    if (!window.stateManager) return;

    const status = window.stateManager.getDbStatus();
    const mode = status.mode || window.stateManager.getStorageMode();
    const serverAvailable = Boolean(status.serverAvailable);
    const serverChecked = Boolean(status.serverChecked);
    const standalone = this.isStandalonePWA();
    const isMobile = this.isMobileOrTabletDevice();
    const usingLocalOnly = serverChecked && (!serverAvailable || mode === 'local');

    if (headerBtn) {
      if (!usingLocalOnly) {
        headerBtn.classList.add('hidden');
      } else {
        headerBtn.classList.remove('hidden');
        const labelEs = (isMobile && !standalone) ? 'Pestaña temporal' : 'Solo navegador';
        const titleEs = (isMobile && !standalone)
          ?'Pestaña temporal sin instalar: pulsa para ver cómo fijar Khōra o exportar copia JSON'
          : 'Sin servidor conectado: tus datos se guardan solo en este navegador. Pulsa para más detalles o exportar copia JSON';
        if (headerLabel) headerLabel.textContent = labelEs;
        if (window.i18n) {
          headerBtn.setAttribute('data-i18n-orig-title', titleEs);
          headerBtn.title = window.i18n.t(titleEs);
        } else {
          headerBtn.title = titleEs;
        }
        window.i18n?.localizeDOM?.(headerBtn);
      }
    }

    if (!banner) return;

    // Wait until initial server probe finishes, or hide if connected to SQLite server in DB mode or dismissed
    if (!usingLocalOnly || this.isBannerDismissed()) {
      banner.classList.add('hidden');
      banner.innerHTML = '';
      return;
    }

    if (isMobile && !standalone) {
      banner.classList.remove('hidden');
      banner.innerHTML = `
        <span>
<strong>Pestaña temporal en móvil:</strong> añade Khōra a tu Pantalla de Inicio antes de guardar datos reales (en iPhone los datos de pestaña suelta no pasan al icono y caducan a los 7 días).
        </span>
        <div class="persistence-warning-actions">
          <button type="button" class="btn-primary" id="btn-banner-install-guide" style="font-size: 0.76rem; padding: 5px 10px;">
            Cómo instalar
          </button>
          <button type="button" class="btn-secondary" id="btn-banner-quick-export" style="font-size: 0.76rem; padding: 5px 10px;">
            Exportar JSON
          </button>
          <button type="button" class="btn-icon" id="btn-banner-dismiss" aria-label="Ocultar aviso" style="width: 28px; height: 28px; font-size: 0.75rem;">✕</button>
        </div>
      `;
      document.getElementById('btn-banner-install-guide')?.addEventListener('click', () => {
        this.openInstallGateModal(true);
      });
      document.getElementById('btn-banner-quick-export')?.addEventListener('click', () => {
        this.triggerQuickBackupShareOrDownload();
      });
      document.getElementById('btn-banner-dismiss')?.addEventListener('click', () => {
        this.markBannerDismissed();
        banner.classList.add('hidden');
        this.showToast('Aviso fijado junto al título — pulsa «Pestaña temporal» para ver detalles');
      });
      return;
    }

    banner.classList.remove('hidden');
    banner.innerHTML = `
      <span>
<strong>Modo Navegador Local:</strong> tus datos se guardan solo en este ${isMobile ?'dispositivo' :'navegador'}. Exporta una copia JSON cuando quieras moverlos o hacer respaldo.
      </span>
      <div class="persistence-warning-actions">
        <button type="button" class="btn-secondary" id="btn-banner-quick-export" style="font-size: 0.76rem; padding: 5px 10px;">
          Exportar Copia JSON
        </button>
        <button type="button" class="btn-icon" id="btn-banner-dismiss" aria-label="Ocultar aviso" style="width: 28px; height: 28px; font-size: 0.75rem;">✕</button>
      </div>
    `;
    document.getElementById('btn-banner-quick-export')?.addEventListener('click', () => {
      this.triggerQuickBackupShareOrDownload();
    });
    document.getElementById('btn-banner-dismiss')?.addEventListener('click', () => {
      this.markBannerDismissed();
      banner.classList.add('hidden');
      this.showToast('Aviso fijado junto al título — pulsa «Solo navegador» para ver detalles');
    });
  }

  maybeShowInstallGateModal() {
    if (!window.stateManager || window.stateManager.isVaultLocked?.()) return;
    if (this.isInstallGateDismissed()) return;
    const status = window.stateManager.getDbStatus();
    const mode = status.mode || window.stateManager.getStorageMode();
    if (!status.serverChecked || (status.serverAvailable && mode === 'db')) return;
    const modal = document.getElementById('app-modal');
    if (modal && modal.classList.contains('active')) return;
    this.openInstallGateModal(false);
  }

  openInstallGateModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const isMobile = this.isMobileOrTabletDevice();
    const standalone = this.isStandalonePWA();
    const isIos = this.isIosDevice();
    this.setModalSize('default');

    if (isMobile && !standalone) {
      const deviceStepsHtml = isIos
        ? `
          <div style="background: rgba(87, 139, 116, 0.1); border: 1px solid var(--sage-400); border-radius: var(--radius-md); padding: 12px 14px; margin-top: 12px; text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--sage-700); margin-bottom: 6px;">
              Pasos en iPhone / iPad (Safari):
            </div>
            <ol style="font-size: 0.8rem; color: var(--text-primary); line-height: 1.55; padding-left: 18px; margin: 0;">
<li>Pulsa el botón<strong>Compartir</strong> (cuadrado con flecha hacia arriba ) en la barra de Safari.</li>
              <li>Baja y toca <strong>«Añadir a pantalla de inicio»</strong>.</li>
<li><strong>Cierra Safari y abre Khōra desde el nuevo icono</strong> de tu pantalla de inicio antes de escribir tus datos.</li>
            </ol>
          </div>
        `
        : `
          <div style="background: rgba(87, 139, 116, 0.1); border: 1px solid var(--sage-400); border-radius: var(--radius-md); padding: 12px 14px; margin-top: 12px; text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--sage-700); margin-bottom: 6px;">
              Pasos en Android (Chrome):
            </div>
            <ol style="font-size: 0.8rem; color: var(--text-primary); line-height: 1.55; padding-left: 18px; margin: 0;">
              <li>Pulsa el botón <strong>«Instalar App»</strong> debajo o abre el menú <strong>⋮</strong> en Chrome.</li>
              <li>Elige <strong>«Instalar aplicación»</strong> / <em>«Añadir a pantalla de inicio»</em>.</li>
              <li>Ábrela siempre desde el icono instalado para asegurar persistencia offline y almacenamiento propio.</li>
            </ol>
          </div>
        `;

      modalBody.innerHTML = `
        <div id="install-gate-modal-root">
          <div class="flex-between" style="gap: 8px; align-items: flex-start;">
            <div>
<h3 class="card-title">Instala Khōra antes de guardar tus datos</h3>
              <p class="card-subtitle mt-1" style="line-height: 1.45;">
                Estás abriendo tu espacio ACT en una pestaña temporal del móvil sin servidor detrás.
              </p>
            </div>
            <button type="button" class="btn-icon" id="btn-gate-close-x" aria-label="Cerrar" style="width: 32px; height: 32px; flex-shrink: 0;">✕</button>
          </div>

          <div style="margin-top: 10px; padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid rgba(201, 138, 88, 0.45); background: rgba(201, 138, 88, 0.12); font-size: 0.8rem; color: var(--text-primary); line-height: 1.45;">
<strong>¿Por qué importa esto?</strong> En móvil (especialmente en iPhone), la memoria de una pestaña normal de navegador<strong>no se comparte</strong> con el icono de la Pantalla de Inicio y Safari puede borrar pestañas inactivas a los 7 días.
          </div>

          ${deviceStepsHtml}

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
            ${this.deferredInstallPrompt ? `
              <button type="button" class="btn-primary" id="btn-gate-pwa-install" style="width: 100%; justify-content: center;">
                Instalar Khōra ahora
              </button>
            ` : ''}
            <button type="button" class="btn-secondary" id="btn-gate-export-first" style="width: 100%; justify-content: center; font-size: 0.82rem;">
              Ya tengo datos aquí: Exportar copia JSON primero
            </button>
            <button type="button" class="btn-secondary" id="btn-gate-continue-anyway" style="width: 100%; justify-content: center; font-size: 0.8rem; color: var(--text-secondary);">
              Explorar en el navegador por ahora (sin instalar)
            </button>
          </div>
        </div>
      `;

      modal.classList.add('active');

      document.getElementById('btn-gate-close-x')?.addEventListener('click', () => {
        this.markInstallGateDismissed();
        this.closeModal();
        this.updatePersistenceWarningBanner();
      });

      document.getElementById('btn-gate-pwa-install')?.addEventListener('click', async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const choice = await this.deferredInstallPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          this.markInstallGateDismissed();
          this.markBannerDismissed();
          this.closeModal();
          this.showToast('Instalando Khōra en tu dispositivo...');
        }
        this.deferredInstallPrompt = null;
        this.updatePersistenceWarningBanner();
      });

      document.getElementById('btn-gate-export-first')?.addEventListener('click', () => {
        this.triggerQuickBackupShareOrDownload();
      });

      document.getElementById('btn-gate-continue-anyway')?.addEventListener('click', () => {
        this.markInstallGateDismissed();
        this.markBannerDismissed();
        this.closeModal();
        this.updatePersistenceWarningBanner();
        this.showToast('Modo exploración en pestaña activa — recuerda instalarla antes de guardar datos reales');
      });
      return;
    }

    // Desktop / Standalone Local Mode First-Visit & Status Modal
    modalBody.innerHTML = `
      <div id="install-gate-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
<h3 class="card-title">Almacenamiento Local (Sin Servidor)</h3>
            <p class="card-subtitle mt-1" style="line-height: 1.45;">
              Khōra funciona de forma 100% privada directamente en tu navegador.
            </p>
          </div>
          <button type="button" class="btn-icon" id="btn-gate-close-x" aria-label="Cerrar" style="width: 32px; height: 32px; flex-shrink: 0;">✕</button>
        </div>

        <div style="margin-top: 10px; padding: 11px 13px; border-radius: var(--radius-md); border: 1px solid rgba(201, 138, 88, 0.45); background: rgba(201, 138, 88, 0.12); font-size: 0.81rem; color: var(--text-primary); line-height: 1.48;">
<strong>¿Qué debes tener en cuenta?</strong> Tus registros se guardan únicamente en la memoria de este navegador y dispositivo. Si borras los datos del navegador o cambias de equipo sin exportar una copia, se perderán.
        </div>

        <div style="background: rgba(87, 139, 116, 0.09); border: 1px solid var(--sage-300); border-radius: var(--radius-md); padding: 11px 13px; margin-top: 10px;">
          <ul style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; padding-left: 18px; margin: 0;">
<li>Exporta una copia JSON periódicamente desde el botón de respaldo o pulsando el aviso<strong>«Solo navegador»</strong> junto al título.</li>
<li>Puedes activar cifrado AES-256 con PIN/contraseña o conectar un servidor SQLite propio desde<strong>Configuración</strong>.</li>
          </ul>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button type="button" class="btn-primary" id="btn-gate-continue-anyway" style="width: 100%; justify-content: center;">
            ✓ Entendido, empezar a usar Khōra
          </button>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-secondary" id="btn-gate-export-first" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              Exportar copia JSON ahora
            </button>
            <button type="button" class="btn-secondary" id="btn-gate-open-settings" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              Ver opciones de Configuración
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    document.getElementById('btn-gate-close-x')?.addEventListener('click', () => {
      this.markInstallGateDismissed();
      this.markBannerDismissed();
      this.closeModal();
      this.updatePersistenceWarningBanner();
    });

    document.getElementById('btn-gate-export-first')?.addEventListener('click', () => {
      this.triggerQuickBackupShareOrDownload();
    });

    document.getElementById('btn-gate-open-settings')?.addEventListener('click', () => {
      this.markInstallGateDismissed();
      this.markBannerDismissed();
      this.updatePersistenceWarningBanner();
      this.openSettingsModal();
    });

    document.getElementById('btn-gate-continue-anyway')?.addEventListener('click', () => {
      this.markInstallGateDismissed();
      this.markBannerDismissed();
      this.closeModal();
      this.updatePersistenceWarningBanner();
    });
  }

  showPwaUpdateToast(registration) {
    const container = document.getElementById('toast-container');
    if (!container || !registration) return;

    const existing = document.getElementById('pwa-update-toast');
    if (existing) existing.remove();

    const t = (text) => (window.i18n?.translateText ? window.i18n.translateText(text) : text);
    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    toast.className = 'toast toast-update';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
<span>${t('Nueva versión de Khōra disponible')}</span>
<button type="button" class="toast-update-btn" id="btn-pwa-apply-update">${t('Actualizar')}</button>
<button type="button" class="toast-update-dismiss" id="btn-pwa-dismiss-update" aria-label="${t('Más tarde')}">&times;</button>
`;

    container.appendChild(toast);

    const applyBtn = toast.querySelector('#btn-pwa-apply-update');
    const dismissBtn = toast.querySelector('#btn-pwa-dismiss-update');

    dismissBtn?.addEventListener('click', () => {
      toast.remove();
    });

    applyBtn?.addEventListener('click', async () => {
      if (applyBtn.disabled) return;
      applyBtn.disabled = true;
      applyBtn.textContent = t('Actualizando…');
      this.swUpdateRequested = true;

      try {
        await window.state?.flushPendingWrites?.(4000);
      } catch {
        // Proceed with update even if flush encounters an error
      }

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        // Fallback reload in case controllerchange does not fire
        setTimeout(() => {
          if (!this.swRefreshing) {
            this.swRefreshing = true;
            window.location?.reload?.();
          }
        }, 2500);
      } else {
        this.swRefreshing = true;
        window.location?.reload?.();
      }
    });
  }

  // PWA Service Worker Registration
  initPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (document.getElementById('install-gate-modal-root')) {
        this.openInstallGateModal();
      }
    });

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.markInstallGateDismissed();
      this.markBannerDismissed();
      this.updatePersistenceWarningBanner();
    });

    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
      this.swRefreshing = false;
      this.swUpdateRequested = false;
      const hadController = Boolean(navigator.serviceWorker.controller);

      navigator.serviceWorker.addEventListener?.('controllerchange', async () => {
        if (this.swRefreshing) return;
        if (!hadController && !this.swUpdateRequested) return;
        this.swRefreshing = true;
        try {
          await window.state?.flushPendingWrites?.(3000);
        } catch {
          // Ignore flush errors before reload
        }
        window.location?.reload?.();
      });

      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
        .then((reg) => {
          console.log('[PWA] Service Worker registrado con éxito:', reg.scope);

          const notifyIfWaiting = () => {
            if (reg.waiting && navigator.serviceWorker.controller) {
              this.showPwaUpdateToast(reg);
            }
          };

          notifyIfWaiting();

          reg.addEventListener?.('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showPwaUpdateToast(reg);
              }
            });
          });

          const UPDATE_CHECK_INTERVAL_MS = 15 * 60 * 1000;
          let lastUpdateCheck = 0;

          const checkForUpdate = (force = false) => {
            if (navigator.onLine === false) return;
            const now = Date.now();
            if (!force && now - lastUpdateCheck < UPDATE_CHECK_INTERVAL_MS) return;
            lastUpdateCheck = now;
          reg.update?.().catch(() => {});
          };

          checkForUpdate(true);

          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              notifyIfWaiting();
              checkForUpdate(false);
            }
          });

          window.addEventListener('online', () => {
            checkForUpdate(false);
          });
        })
        .catch((err) => {
          console.warn('[PWA] Error en registro de Service Worker:', err);
        });
    }
  }
}

Object.assign(AppController.prototype, window.KhoraAppSettingsMixin, window.KhoraAppHelpMixin);

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
  window.app.init();
});
