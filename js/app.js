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
        label: 'Ahora mismo:',
        items: [
          { id: 'guia-inicio', icon: '🧭', label: 'Inicio' },
          { id: 'espacio-act', icon: '🌪️', label: 'Procesar Emoción' },
          { id: 'pildoras-trucos', icon: '⚡', label: 'Botiquín 1-Min' },
          { id: 'brujula-valores', icon: '⚖️', label: 'Elegir qué Hacer' },
          { id: 'paz-falsa', icon: '🏳️', label: 'Acabo de Ceder' },
          { id: 'pildoras-estudio', icon: '📖', label: 'Lecturas y Ejercicios' }
        ]
      },
      'yo': {
        label: 'Yo:',
        items: [
          { id: 'perfil-valores', icon: '💎', label: 'Mis Valores', helpTopic: 'valores-faro' },
          { id: 'perfil-autobus', icon: '🚌', label: 'Mi Autobús', helpTopic: 'autobus-act' },
          { id: 'radar-patrones', icon: '🔄', label: 'Mis Patrones', helpTopic: 'radar-patrones' }
        ]
      },
      'insight': {
        label: 'Evolución:',
        items: [
          { id: 'insight-terapia', icon: '🛋️', label: 'Cuaderno de Terapia', helpTopic: 'cuaderno-terapia' },
          { id: 'insight-historial', icon: '🌱', label: 'Historial en Frío', helpTopic: 'insight-historial' },
          { id: 'insight-graficos', icon: '📈', label: 'Gráficos y Hexaflex' },
          { id: 'insight-actividad', icon: '📝', label: 'Actividad Reciente' }
        ]
      }
    };
  }

  init() {
    this.initTheme();
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
          this.updatePersistenceWarningBanner();
          this.maybeShowInstallGateModal();
        } else if (event === 'vault_locked') {
          this.closeModal();
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
      if (legacyLabel) legacyLabel.textContent = '📱 Navegador';
      if (legacyBtn) legacyBtn.title = 'Modo Navegador (solo en este dispositivo). Pulsa para configurar';
    } else if (status && status.connected) {
      if (dot) dot.style.backgroundColor = 'var(--sage-500)';
      if (settingsBtn) settingsBtn.title = 'Configuración · Almacenamiento: BD SQLite conectada';
      if (legacyLabel) legacyLabel.textContent = '🗄️ BD SQLite';
      if (legacyBtn) legacyBtn.title = 'Conectado a Base de Datos SQLite. Pulsa para configurar';
    } else {
      if (dot) dot.style.backgroundColor = '#c98a58';
      if (settingsBtn) settingsBtn.title = 'Configuración · Almacenamiento: BD SQLite (sin conexión, usando caché local)';
      if (legacyLabel) legacyLabel.textContent = '⚠️ BD (Offline)';
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

  renderGuiaInicio() {
    const container = document.getElementById('guia-inicio-view');
    if (!container || !window.stateManager) return;

    const hotFlows = [
      {
        view: 'espacio-act',
        title: '🌊 Siento una emoción intensa, ansiedad o bloqueo',
        time: '⏱️ 3 min',
        does: 'Pones nombre exacto a la emoción, la bajas al cuerpo y separas el pensamiento que la alimenta.',
        brings: 'Bajar la intensidad emocional y elegir tu próximo paso sin actuar en piloto automático.'
      },
      {
        view: 'pildoras-trucos',
        title: '⚡ Necesito cortar un impulso urgente ahora mismo',
        time: '⏱️ 1 min',
        does: 'Ejecutas un micro-truco guiado en vivo (Echar el Ancla, Decir NO en 15s, Frenar rescate o Postura del SÍ).',
        brings: 'Estabilizarte en 60 segundos y evitar justificarte de más o ceder por pánico.'
      },
      {
        view: 'brujula-valores',
        title: '⚖️ Dudo qué hacer o temo ceder ante alguien',
        time: '⏱️ 1 min',
        does: 'Eliges qué te está frenando, tu valor faro y una micro-acción honesta en 2 pasos.',
        brings: 'Salir de la indecisión con una respuesta clara y alineada contigo.'
      },
      {
        view: 'paz-falsa',
        title: '🏳️ Acabo de callarme o decir «sí» queriendo decir «no»',
        time: '⏱️ 2 min',
        does: 'Anotas qué querías hacer realmente vs. qué cediste y mides tu desgaste.',
        brings: 'Visibilizar el coste de la «falsa paz» y detectar dónde necesitas límites.'
      }
    ];

    container.innerHTML = `
      <div class="view-plain-shell">
        <div class="card-header" style="margin-bottom: 12px;">
          <div class="title-with-help">
            <h2 class="card-title" style="margin: 0;">🧭 ¿En qué momento estás ahora?</h2>
            <button type="button" class="help-info-trigger" data-help-topic="guia-inicio" aria-label="Información de esta herramienta">ⓘ</button>
          </div>
          <p class="card-subtitle">Elige tu situación para ir directo al ejercicio adecuado.</p>
        </div>

        <div style="margin-top: 6px;">
          <div style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); letter-spacing: 0.01em;">
            🔥 Ahora Mismo (En Caliente)
          </div>
          <div class="guided-triage-grid">
            ${hotFlows.map(flow => `
              <button type="button" class="triage-card" data-go-view="${flow.view}">
                <div>
                  <div class="triage-card-top">
                    <span class="triage-card-title">${flow.title}</span>
                    <span class="triage-time-badge">${flow.time}</span>
                  </div>
                  <p class="triage-card-desc" style="margin-top: 8px;">${flow.does}</p>
                </div>
                <div class="triage-card-value">
                  <strong>✨ Qué aporta:</strong> ${flow.brings}
                </div>
              </button>
            `).join('')}
          </div>
        </div>
        <div style="margin-top: 18px; padding-top: 16px; border-top: 1px dashed var(--border-subtle);">
          <div style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); letter-spacing: 0.01em; margin-bottom: 10px;">
            📖 Entrenar y Leer (En calma)
          </div>
          <button type="button" class="triage-calm-item" data-go-view="pildoras-estudio" style="width: 100%; text-align: left; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div>
              <strong style="font-size: 0.94rem; color: var(--text-primary); display: block;">📖 Lecturas y Ejercicios ACT</strong>
              <span style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;">
                Píldoras de 1 min, frases ancla, Deconstructor «Yo Soy» y El Pivote (Dolor → Anhelo).
              </span>
            </div>
            <span class="triage-time-badge">Abrir →</span>
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
              <span>${item.icon}</span>
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
        this.showToast('Khora bloqueado 🔒');
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
  }

  // Theme Management
  initTheme() {
    const settings = window.stateManager.getSettings();
    const currentTheme = settings.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);
  }

  setTheme(newTheme) {
    const resolved = newTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);

    const settings = window.stateManager.getSettings();
    settings.theme = resolved;
    window.stateManager.saveSettings(settings);

    this.updateThemeIcon(resolved);

    // Redraw charts if on insight view
    if (this.currentView === 'insight' && window.insightApp) {
      window.insightApp.drawCharts();
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateThemeIcon(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;
    if (theme === 'dark') {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      btn.setAttribute('title', 'Cambiar a modo claro');
    } else {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      btn.setAttribute('title', 'Cambiar a modo oscuro');
    }
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

    const esc = (str) => String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const profile = window.stateManager?.getProfile() || {};
    const anchors = window.stateManager?.getAnchors() || [];
    const primaryVal = (profile.coreValues && profile.coreValues[0]) ? profile.coreValues[0] : null;
    const topAnchor = anchors[0] || null;

    let lighthouseHtml = '';
    if (primaryVal || topAnchor) {
      const valText = primaryVal ? `${primaryVal.domain}: ${primaryVal.statement}` : '';
      const anchorText = topAnchor ? topAnchor.text : '';
      lighthouseHtml = `
        <div style="background: rgba(87, 139, 116, 0.12); border: 1px solid var(--sage-400); border-radius: var(--radius-md); padding: 11px 14px; margin: 12px 0; text-align: left;">
          <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sage-700); margin-bottom: 4px;">
            🧭 Tu Faro Personal ACT
          </div>
          ${valText ? `<div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary); line-height: 1.4;">«${esc(valText)}»</div>` : ''}
          ${anchorText ? `<div style="font-size: 0.78rem; font-style: italic; color: var(--text-secondary); margin-top: ${valText ? '4px' : '0'};">"${esc(anchorText)}"</div>` : ''}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="flex-between" style="gap: 8px; align-items: flex-start;">
        <div>
          <h3 class="card-title">⚓ Asistencia Rápida en Crisis ACT</h3>
          <p class="card-subtitle mt-1" style="line-height: 1.45;">
            En ACT no luchamos contra la ola emocional ni intentamos suprimirla. Primero echamos el ancla para no ser arrastrados y luego elegimos hacia dónde llevar el timón.
          </p>
        </div>
        <button type="button" class="btn-icon" id="btn-sos-close" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
      </div>

      ${lighthouseHtml}

      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
        <button type="button" id="btn-sos-drop-anchor"
                style="text-align: left; padding: 14px 16px; border-radius: var(--radius-md); border: 2px solid var(--sage-500); background: linear-gradient(135deg, rgba(87, 139, 116, 0.18), rgba(66, 111, 92, 0.06)); color: var(--text-primary); cursor: pointer;">
          <div style="font-size: 0.96rem; font-weight: 800; color: var(--sage-700); margin-bottom: 3px;">
            ⚓ 1. Echar el Ancla en 60s (Protocolo ACE)
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
            Para picos de angustia, agobio o miedo intenso: reconoce la ola (A), vuelve al cuerpo (C) y conecta con el presente (E).
          </div>
        </button>

        <div class="modal-grid-2col">
          <div style="padding: 13px 15px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              🛑 2. Frenar el Piloto Automático
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 9px;">
              Cuando sientes urgencia de huir, ceder por miedo o reaccionar en caliente:
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn-secondary" id="btn-sos-bus-driver" style="flex: 1; font-size: 0.8rem; padding: 8px 10px;">
                🚌 Negar el Volante
              </button>
              <button type="button" class="btn-secondary" id="btn-sos-pause-2min" style="flex: 1; font-size: 0.8rem; padding: 8px 10px;">
                ⏳ Pausa de 2 Minutos
              </button>
            </div>
          </div>

          <div style="padding: 13px 15px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              🌪️ 3. Procesar la Crisis en 4 Pasos (El Espacio ACT)
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
              <button type="button" class="btn-primary" id="btn-sos-full-act" style="flex: 1; font-size: 0.82rem; padding: 9px 12px;">
                🧭 Empezar en Rueda Emocional
              </button>
              <button type="button" class="btn-secondary" id="btn-sos-body-act" style="flex: 1; font-size: 0.82rem; padding: 9px 12px;">
                🌬️ Ir directo al Cuerpo (Paso 2)
              </button>
            </div>
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
      this.showToast('Aterrizando en el cuerpo (Aceptación ACT) 🌿');
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
        <div class="act-glossary-title">💡 ${entry.title}</div>
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
          ${item.brings ? `<div><strong>✨ Qué aporta:</strong> <span>${item.brings}</span></div>` : ''}
        </div>
        <div class="act-glossary-example" style="margin-top: 6px; font-style: normal; font-size: 0.73rem;">
          💡 Pulsa ⓘ para ver la guía paso a paso
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

  async openStorageModeModal() {
    return this.openSettingsModal();
  }

  // Unified Technical Settings Modal (Appearance, Sensory, DB Storage, Backups & PWA)
  async openSettingsModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody || !window.stateManager) return;

    this.setModalSize('wide');

    const refreshCurrentViewIfNeeded = () => {
      if (this.currentView) {
        this.navigate(this.currentView);
      }
    };

    const renderModalContent = () => {
      const status = window.stateManager.getDbStatus();
      const settings = window.stateManager.getSettings() || {};
      const currentTheme = document.documentElement.getAttribute('data-theme') || settings.theme || 'light';
      const vibOn = settings.vibration !== false;
      const sndOn = settings.sound === true;
      const mode = status.mode || window.stateManager.getStorageMode();
      const vault = window.stateManager.getVaultStatus ? window.stateManager.getVaultStatus() : { enabled: false, locked: false, autoLockMinutes: 5 };
      const exampleCount = window.stateManager.countExampleItems ? window.stateManager.countExampleItems() : 0;
      const serverAvailable = Boolean(status.serverAvailable);
      const showDbSection = serverAvailable || mode === 'db';
      const authRequired = Boolean(status.authRequired);
      const authenticated = authRequired ? Boolean(status.authenticated) : true;
      const canUseDb = serverAvailable && authenticated;
      const serverRecords = status.serverCounts?.totalRecords ?? null;
      const lastSyncText = status.lastSync
        ? new Date(status.lastSync).toLocaleTimeString(window.i18n?.getLocale?.() || 'es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : '—';
      const currentLang = window.i18n?.getLang?.() || 'es';
      const anchorsOn = settings.showAnchorsCard !== false;

      const serverBadge = serverAvailable
        ? (authRequired && !authenticated
          ? `<span class="badge" style="background: rgba(201, 138, 88, 0.18); color: #c98a58;">🔒 Sesión requerida para BD SQLite</span>`
          : `<span class="badge" style="background: rgba(87, 139, 116, 0.18); color: var(--sage-700);">🟢 Servidor SQLite accesible${serverRecords !== null ? ` (${serverRecords} registros)` : ''}</span>`)
        : `<span class="badge" style="background: rgba(201, 138, 88, 0.18); color: #c98a58;">🟡 Servidor SQLite no accesible ahora</span>`;

      const authBadgeHtml = (serverAvailable && authRequired)
        ? (authenticated
          ? `<span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700);">🔓 Sesión: ${status.authUser || 'admin'}</span>`
          : '')
        : '';

      const vaultBadgeHtml = vault.enabled
        ? `<span class="badge" style="background: rgba(87, 139, 116, 0.18); color: var(--sage-700);">🛡️ Cifrado AES-256-GCM Activo</span>`
        : `<span class="badge" style="background: var(--bg-surface); color: var(--text-muted);">Sin bloqueo / sin cifrar</span>`;

      modalBody.innerHTML = `
        <div id="storage-mode-modal-root">
          <div class="flex-between" style="gap: 8px; align-items: flex-start;">
            <div>
              <h3 class="card-title">⚙️ Configuración y Ajustes Técnicos</h3>
              <p class="card-subtitle mt-1" style="line-height: 1.45;">
                Privacidad AES-256, tema visual, almacenamiento SQLite/Navegador, copias de seguridad y app móvil.
              </p>
            </div>
            <button type="button" class="btn-icon" id="btn-storage-modal-close" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
          </div>

          <div class="modal-grid-2col" style="margin-top: 14px;">
            <!-- 0. Privacidad, Bloqueo y Cifrado AES-256-GCM -->
            <div style="margin-top: 14px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
            <div class="flex-between" style="gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
              <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary);">
                🔐 Bloqueo de Privacidad y Cifrado (AES-256)
              </div>
              ${vaultBadgeHtml}
            </div>
            <p style="font-size: 0.77rem; color: var(--text-secondary); line-height: 1.4; margin: 0 0 10px 0;">
              Cifra todos tus registros (navegador y SQLite) con tu PIN o contraseña y permite desbloquear con FaceID / Huella. Si olvidas la clave sin tener copia JSON, los datos cifrados no se podrán recuperar.
            </p>
            ${!vault.cryptoSupported ? `
              <div style="font-size: 0.78rem; color: #c98a58; background: rgba(201, 138, 88, 0.12); border-radius: var(--radius-sm); padding: 8px 10px;">
                ⚠️ El navegador exige <strong>HTTPS / localhost</strong> para activar Web Crypto AES-256 (funciona en GitHub Pages, localhost o Tailscale HTTPS).
              </div>
            ` : (vault.enabled ? `
              <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px;">
                <button type="button" class="btn-secondary" id="btn-vault-lock-now" style="font-size: 0.78rem; padding: 7px 11px;">
                  🔒 Bloquear ahora
                </button>
                ${vault.biometricSupported ? (vault.biometricEnabled ? `
                  <button type="button" class="btn-secondary" id="btn-vault-remove-bio" style="font-size: 0.78rem; padding: 7px 11px; border-color: var(--sage-500);">
                    👆 FaceID / Huella activo (Quitar)
                  </button>
                ` : `
                  <button type="button" class="btn-primary" id="btn-vault-enable-bio" style="font-size: 0.78rem; padding: 7px 11px;">
                    👆 Activar FaceID / Huella
                  </button>
                `) : ''}
                <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.77rem; color: var(--text-secondary);">
                  Auto-bloqueo:
                  <select id="select-vault-autolock" class="form-select" style="padding: 4px 8px; font-size: 0.77rem; width: auto;">
                    <option value="0" ${vault.autoLockMinutes === 0 ? 'selected' : ''}>Al cambiar de app</option>
                    <option value="1" ${vault.autoLockMinutes === 1 ? 'selected' : ''}>1 min</option>
                    <option value="5" ${vault.autoLockMinutes === 5 ? 'selected' : ''}>5 min</option>
                    <option value="15" ${vault.autoLockMinutes === 15 ? 'selected' : ''}>15 min</option>
                    <option value="-1" ${vault.autoLockMinutes === -1 ? 'selected' : ''}>Solo manual / al abrir</option>
                  </select>
                </label>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; padding-top: 8px; border-top: 1px dashed var(--border-subtle);">
                <input type="password" id="vault-disable-pass" class="form-input" placeholder="PIN/clave actual para quitar cifrado" style="flex: 1; min-width: 170px; padding: 6px 10px; font-size: 0.78rem;">
                <button type="button" class="btn-secondary" id="btn-vault-disable" style="font-size: 0.78rem; padding: 6px 11px; color: var(--accent-tension); border-color: rgba(184, 107, 89, 0.4);">
                  🔓 Desactivar cifrado
                </button>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 8px;">
                <input type="password" id="vault-setup-pass" class="form-input" placeholder="PIN o contraseña (mín. 4)" autocomplete="new-password" style="padding: 7px 10px; font-size: 0.8rem;">
                <input type="password" id="vault-setup-pass-confirm" class="form-input" placeholder="Repetir PIN / contraseña" autocomplete="new-password" style="padding: 7px 10px; font-size: 0.8rem;">
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <select id="vault-setup-autolock" class="form-select" style="padding: 6px 8px; font-size: 0.78rem; width: auto;">
                  <option value="0">Auto-bloqueo: Al cambiar de app</option>
                  <option value="1">Auto-bloqueo: 1 min</option>
                  <option value="5" selected>Auto-bloqueo: 5 min</option>
                  <option value="15">Auto-bloqueo: 15 min</option>
                  <option value="-1">Auto-bloqueo: Solo al abrir/manual</option>
                </select>
                <button type="button" class="btn-primary" id="btn-vault-enable" style="flex: 1; justify-content: center; font-size: 0.8rem; padding: 7px 12px;">
                  🛡️ Activar Bloqueo + Cifrado AES-256
                </button>
              </div>
            `)}
          </div>

          <!-- 1. Apariencia, Idioma y Guía Sensorial -->
          <div style="margin-top: 14px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
            <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
              🎨 Apariencia, Idioma y Guía Sensorial
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 10px;" data-no-i18n="true">
              <button type="button" class="storage-mode-card ${currentLang === 'es' ? 'active' : ''}" data-select-lang="es" style="padding: 8px 12px; text-align: center;">
                <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary);">🇪🇸 Español</span>
              </button>
              <button type="button" class="storage-mode-card ${currentLang === 'en' ? 'active' : ''}" data-select-lang="en" style="padding: 8px 12px; text-align: center;">
                <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary);">🇬🇧 English</span>
              </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 10px;">
              <button type="button" class="storage-mode-card ${currentTheme === 'light' ? 'active' : ''}" data-select-theme="light" style="padding: 9px 12px; text-align: center;">
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">☀️ Modo Claro</span>
              </button>
              <button type="button" class="storage-mode-card ${currentTheme === 'dark' ? 'active' : ''}" data-select-theme="dark" style="padding: 9px 12px; text-align: center;">
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">🌙 Modo Oscuro</span>
              </button>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn-secondary" id="btn-setting-toggle-vibration" style="flex: 1; min-width: 185px; font-size: 0.78rem; padding: 7px 10px; border-color: ${vibOn ? 'var(--sage-500)' : 'var(--border-subtle)'};">
                📳 Vibración guía: ${vibOn ? 'Activada' : 'Desactivada'}
              </button>
              <button type="button" class="btn-secondary" id="btn-setting-toggle-sound" style="flex: 1; min-width: 185px; font-size: 0.78rem; padding: 7px 10px; border-color: ${sndOn ? 'var(--sage-500)' : 'var(--border-subtle)'};">
                🔔 Tonos ojos cerrados: ${sndOn ? 'Activados' : 'Desactivados'}
              </button>
              <button type="button" class="btn-secondary" id="btn-setting-toggle-anchors" style="flex: 1 1 100%; font-size: 0.78rem; padding: 7px 10px; border-color: ${anchorsOn ? 'var(--sage-500)' : 'var(--border-subtle)'};">
                ⚓ Tarjetas de Anclaje en Lecturas: ${anchorsOn ? 'Activadas' : 'Desactivadas'}
              </button>
            </div>
          </div>

          ${showDbSection ? `
            <!-- 2. Almacenamiento y Sincronización -->
            <div style="margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
              <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
                💾 Base de Datos y Sincronización
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 10px;">
                ${serverBadge}
                ${authBadgeHtml}
                ${status.lastSync ? `<span class="badge" style="background: var(--bg-surface); color: var(--text-secondary);">Última sinc.: ${lastSyncText}</span>` : ''}
              </div>

              <div class="storage-mode-grid" style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button type="button" class="storage-mode-card ${mode === 'db' ? 'active' : ''}" data-select-storage-mode="db">
                  <div class="flex-between" style="gap: 8px; margin-bottom: 3px;">
                    <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">🗄️ Base de Datos SQLite (Servidor Docker)</span>
                    ${mode === 'db' ? '<span class="badge" style="background: var(--sage-500); color: #fff;">Activo</span>' : '<span class="badge" style="background: var(--bg-surface); color: var(--text-muted);">Elegir</span>'}
                  </div>
                  <p style="font-size: 0.77rem; color: var(--text-secondary); line-height: 1.4; margin: 0; text-align: left;">
                    Sincroniza automáticamente en <code>/app/data/act.db</code> (con respaldo local en el navegador). Ideal para uso personal monousuario.
                  </p>
                </button>

                <button type="button" class="storage-mode-card ${mode === 'local' ? 'active' : ''}" data-select-storage-mode="local">
                  <div class="flex-between" style="gap: 8px; margin-bottom: 3px;">
                    <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">📱 Almacenamiento en el Navegador (Solo este dispositivo)</span>
                    ${mode === 'local' ? '<span class="badge" style="background: var(--accent-clarity); color: #fff;">Activo</span>' : '<span class="badge" style="background: var(--bg-surface); color: var(--text-muted);">Elegir</span>'}
                  </div>
                  <p style="font-size: 0.77rem; color: var(--text-secondary); line-height: 1.4; margin: 0; text-align: left;">
                    Guarda solo en este dispositivo sin enviar ni sobrescribir datos en el servidor.
                  </p>
                </button>
              </div>

              <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="btn-secondary" id="btn-modal-push-db" ${canUseDb ? '' : 'disabled'} style="flex: 1; min-width: 190px; font-size: 0.78rem; padding: 7px 10px;">
                  ⬆️ Subir Navegador → BD SQLite
                </button>
                <button type="button" class="btn-secondary" id="btn-modal-pull-db" ${canUseDb ? '' : 'disabled'} style="flex: 1; min-width: 190px; font-size: 0.78rem; padding: 7px 10px;">
                  ⬇️ Descargar BD SQLite → Navegador
                </button>
                ${(serverAvailable && authRequired && !authenticated) ? `
                  <button type="button" class="btn-primary" id="btn-modal-open-login" style="flex: 1 1 100%; justify-content: center; font-size: 0.8rem; padding: 8px 12px;">
                    🔑 Iniciar sesión para sincronizar con SQLite
                  </button>
                ` : ''}
                ${(serverAvailable && authRequired && authenticated) ? `
                  <button type="button" class="btn-secondary" id="btn-modal-logout" style="flex: 1 1 100%; justify-content: center; font-size: 0.78rem; padding: 7px 10px;">
                    🚪 Cerrar sesión del servidor
                  </button>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- 3. Copias de Seguridad y Datos -->
          <div style="margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
            <div class="flex-between" style="gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
              <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary);">
                📦 Copias de Seguridad y Gestión de Datos
              </div>
              <span class="badge" style="background: var(--bg-surface); color: var(--text-secondary);">
                ${vault.storagePersisted ? '🟢 Persistencia móvil reforzada (IndexedDB)' : '💾 Respaldo doble (IndexedDB + Local)'}
              </span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button type="button" class="btn-primary" id="btn-modal-share-backup" style="font-size: 0.78rem; padding: 7px 11px;">
                📲 Guardar / Compartir Copia en Móvil
              </button>
              ${showDbSection ? `
                <button type="button" class="btn-secondary" id="btn-modal-download-sqlite" ${canUseDb ? '' : 'disabled'} style="font-size: 0.78rem; padding: 7px 11px;">
                  🗄️ Descargar SQLite (.db)
                </button>
              ` : ''}
              <button type="button" class="btn-secondary" id="btn-modal-export-json" style="font-size: 0.78rem; padding: 7px 11px;">
                💾 Exportar JSON
              </button>
              <label class="btn-secondary" style="font-size: 0.78rem; padding: 7px 11px; cursor: pointer;">
                📥 Importar JSON
                <input type="file" id="input-modal-import-json" accept=".json" style="display: none;">
              </label>
              <button type="button" class="btn-secondary" id="btn-modal-clear-examples" ${exampleCount > 0 ? '' : 'disabled'} style="font-size: 0.78rem; padding: 7px 11px;">
                🧹 Quitar Ejemplos (${exampleCount})
              </button>
              <button type="button" class="btn-secondary" id="btn-modal-seed-demo" style="font-size: 0.78rem; padding: 7px 11px;">
                🧪 Cargar Datos Demo
              </button>
              <button type="button" class="btn-secondary" id="btn-modal-clear-all" style="font-size: 0.78rem; padding: 7px 11px; color: var(--accent-tension); border-color: rgba(184, 107, 89, 0.4);">
                🗑️ Limpiar Todo
              </button>
            </div>
          </div>

          <!-- 4. Instalar como App Móvil (PWA) -->
          <div style="margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
            <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
              📲 Usar como App en el Móvil (PWA)
            </div>
            ${this.deferredInstallPrompt ? `
              <button type="button" class="btn-primary" id="btn-pwa-install" style="width: 100%; justify-content: center; margin-bottom: 8px; font-size: 0.82rem;">
                📲 Instalar App en este dispositivo
              </button>
            ` : ''}
            <ul style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45; padding-left: 18px; margin: 0;">
              <li><strong>iPhone / iPad (Safari):</strong> <em>Compartir</em> → <strong>«Añadir a pantalla de inicio»</strong>.</li>
              <li><strong>Android (Chrome):</strong> Menú <strong>⋮</strong> → <strong>«Instalar aplicación»</strong>.</li>
              <li><strong>Offline:</strong> Funciona sin conexión en modo <em>Navegador</em> tras la primera carga.</li>
            </ul>
          </div>

            <!-- 5. Sobre Khora y Autor -->
            <div class="modal-span-full" style="margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
              <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary); margin-bottom: 5px;">
                🌱 Sobre Khora — Tu espacio ACT
              </div>
              <p style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45; margin: 0 0 10px 0;">
                En filosofía griega, <em>khōra</em> es el espacio que da cabida sin juzgar. Esta aplicación es gratuita, sin rastreadores y guarda tus datos únicamente en tu dispositivo. Es una herramienta personal de práctica ACT y no sustituye la terapia psicológica.
              </p>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <a href="https://github.com/${KHORA_CREDITS.githubUser}/${KHORA_CREDITS.repoName}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.78rem; padding: 6px 11px; text-decoration: none;">
                  Creado con ❤️ por @${KHORA_CREDITS.githubUser}
                </a>
                <a href="${KHORA_CREDITS.kofiUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.78rem; padding: 6px 11px; text-decoration: none;">
                  ☕ Invítame a un café en Ko-fi
                </a>
                <button type="button" class="btn-secondary" id="btn-settings-feedback" style="font-size: 0.78rem; padding: 6px 12px;">
                  💬 Enviar Feedback
                </button>
              </div>
            </div>
          </div>

          <div class="btn-group" style="margin-top: 14px; justify-content: flex-end;">
            <button type="button" class="btn-primary" id="btn-storage-modal-done" style="font-size: 0.82rem;">
              Listo
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-storage-modal-close')?.addEventListener('click', () => {
        modal.classList.remove('active');
      });
      document.getElementById('btn-storage-modal-done')?.addEventListener('click', () => {
        modal.classList.remove('active');
      });

      modalBody.querySelectorAll('[data-select-lang]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextLang = btn.dataset.selectLang;
          window.i18n?.setLang?.(nextLang);
          this.showToast(nextLang === 'en' ? 'Language switched to English 🇬🇧' : 'Idioma cambiado a Español 🇪🇸');
          renderModalContent();
        });
      });

      modalBody.querySelectorAll('[data-select-theme]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextTheme = btn.dataset.selectTheme;
          this.setTheme(nextTheme);
          this.showToast(nextTheme === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado');
          renderModalContent();
        });
      });

      document.getElementById('btn-setting-toggle-vibration')?.addEventListener('click', () => {
        const st = window.stateManager.getSettings();
        const nextVal = st.vibration === false;
        st.vibration = nextVal;
        window.stateManager.saveSettings(st);
        if (nextVal) this.triggerHaptic([40]);
        this.showToast(nextVal ? 'Vibración guía activada' : 'Vibración guía desactivada');
        renderModalContent();
      });

      document.getElementById('btn-setting-toggle-anchors')?.addEventListener('click', () => {
        const st = window.stateManager.getSettings();
        const nextVal = st.showAnchorsCard === false;
        st.showAnchorsCard = nextVal;
        window.stateManager.saveSettings(st);
        if (window.pildorasAnclajesApp) {
          window.pildorasAnclajesApp.render();
          window.pildorasAnclajesApp.bindEvents();
        }
        this.showToast(nextVal ? 'Tarjetas de Anclaje activadas' : 'Tarjetas de Anclaje ocultas');
        renderModalContent();
      });

      document.getElementById('btn-setting-toggle-sound')?.addEventListener('click', () => {
        const st = window.stateManager.getSettings();
        const nextVal = st.sound !== true;
        st.sound = nextVal;
        window.stateManager.saveSettings(st);
        if (nextVal) this.playGentleTone(432, 220);
        this.showToast(nextVal ? 'Tonos suaves activados' : 'Tonos suaves desactivados');
        renderModalContent();
      });

      modalBody.querySelectorAll('[data-select-storage-mode]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const nextMode = btn.dataset.selectStorageMode;
          await window.stateManager.setStorageMode(nextMode);
          this.updateDbStatusBadge();
          this.showToast(
            nextMode === 'local'
              ? 'Modo Navegador activado: datos guardados solo en este dispositivo'
              : (window.stateManager.getDbStatus().connected
                ? 'Modo BD SQLite activado y sincronizado'
                : 'Modo BD SQLite activado (sin conexión ahora; se usará caché local hasta reconectar)')
          );
          renderModalContent();
        });
      });

      document.getElementById('btn-modal-push-db')?.addEventListener('click', async () => {
        if (!confirm('¿Subir y sobrescribir la base de datos SQLite del servidor con los datos actuales de este navegador?')) {
          return;
        }
        const ok = await window.stateManager.pushFullStateToServer({ force: true });
        await window.stateManager.checkServerHealth();
        this.updateDbStatusBadge();
        this.showToast(ok ? 'Datos del navegador subidos a BD SQLite' : 'No se pudo conectar con el servidor SQLite');
        renderModalContent();
      });

      document.getElementById('btn-modal-pull-db')?.addEventListener('click', async () => {
        if (!confirm('¿Descargar los datos de la base de datos SQLite y reemplazar los datos locales de este navegador?')) {
          return;
        }
        const ok = await window.stateManager.pullStateFromServer();
        await window.stateManager.checkServerHealth();
        this.updateDbStatusBadge();
        refreshCurrentViewIfNeeded();
        this.showToast(ok ? 'Datos descargados de BD SQLite a este navegador' : 'No se pudo descargar desde el servidor SQLite');
        renderModalContent();
      });

      document.getElementById('btn-modal-open-login')?.addEventListener('click', () => {
        this.openLoginModal();
      });

      document.getElementById('btn-modal-logout')?.addEventListener('click', async () => {
        await window.stateManager.logout();
        this.updateDbStatusBadge();
        this.showToast('Sesión cerrada');
        renderModalContent();
      });

      document.getElementById('btn-modal-download-sqlite')?.addEventListener('click', () => {
        const dbStatus = window.stateManager.getDbStatus();
        if ((!dbStatus.connected && !dbStatus.serverAvailable) || (dbStatus.authRequired && !dbStatus.authenticated)) {
          this.showToast('Inicia sesión en el servidor SQLite o usa Exportar JSON');
          return;
        }
        const a = document.createElement('a');
        a.href = '/api/backup/db';
        a.download = `khora_act_${new Date().toISOString().slice(0, 10)}.sqlite`;
        a.click();
        this.showToast('Descargando base de datos SQLite (.db)');
      });

      document.getElementById('btn-modal-share-backup')?.addEventListener('click', () => {
        this.triggerQuickBackupShareOrDownload();
      });

      document.getElementById('btn-vault-enable')?.addEventListener('click', async () => {
        const p1 = document.getElementById('vault-setup-pass')?.value || '';
        const p2 = document.getElementById('vault-setup-pass-confirm')?.value || '';
        const autoLock = document.getElementById('vault-setup-autolock')?.value || '5';
        if (p1 !== p2) {
          this.showToast('Las dos claves no coinciden');
          return;
        }
        const res = await window.stateManager.enableVault(p1, Number(autoLock));
        if (!res.ok) {
          this.showToast(res.error || 'No se pudo activar el cifrado');
          return;
        }
        this.updateLockHeaderButton();
        this.showToast('Cifrado AES-256-GCM y bloqueo activados 🛡️');
        renderModalContent();
      });

      document.getElementById('btn-vault-lock-now')?.addEventListener('click', () => {
        modal.classList.remove('active');
        window.stateManager.lockVault();
        this.showToast('Khora bloqueado 🔒');
      });

      document.getElementById('btn-vault-enable-bio')?.addEventListener('click', async () => {
        const res = await window.stateManager.registerBiometric();
        this.showToast(res.ok ? 'FaceID / Huella activado en este dispositivo 👆' : (res.error || 'No se pudo activar la biometría'));
        renderModalContent();
      });

      document.getElementById('btn-vault-remove-bio')?.addEventListener('click', () => {
        window.stateManager.removeBiometric();
        this.showToast('Desbloqueo biométrico retirado');
        renderModalContent();
      });

      document.getElementById('select-vault-autolock')?.addEventListener('change', (e) => {
        window.stateManager.updateVaultAutoLock(Number(e.target.value));
        this.showToast('Tiempo de auto-bloqueo actualizado');
      });

      document.getElementById('btn-vault-disable')?.addEventListener('click', async () => {
        const pass = document.getElementById('vault-disable-pass')?.value || '';
        if (!pass) {
          this.showToast('Introduce tu PIN o contraseña actual para quitar el cifrado');
          return;
        }
        if (!confirm('¿Desactivar el bloqueo y guardar los datos sin cifrar?')) return;
        const res = await window.stateManager.disableVault(pass);
        if (!res.ok) {
          this.showToast(res.error || 'PIN o contraseña incorrectos');
          return;
        }
        this.updateLockHeaderButton();
        this.showToast('Bloqueo y cifrado desactivados');
        renderModalContent();
      });

      document.getElementById('btn-modal-export-json')?.addEventListener('click', () => {
        const json = window.stateManager.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `khora_act_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Copia de seguridad JSON descargada');
      });

      document.getElementById('input-modal-import-json')?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const success = window.stateManager.importData(evt.target.result);
          if (success) {
            this.initTheme();
            this.updateDbStatusBadge();
            refreshCurrentViewIfNeeded();
            this.showToast('Datos restaurados correctamente');
            renderModalContent();
          } else {
            this.showToast('El archivo no tiene un formato JSON válido');
          }
        };
        reader.readAsText(file);
      });

      document.getElementById('btn-modal-clear-examples')?.addEventListener('click', () => {
        if (confirm('¿Quitar todos los elementos de ejemplo de la app? Tus registros y valores propios se mantendrán intactos.')) {
          window.stateManager.clearExampleData();
          refreshCurrentViewIfNeeded();
          this.showToast('Datos de ejemplo eliminados — tus registros propios se mantienen');
          renderModalContent();
        }
      });

      document.getElementById('btn-modal-seed-demo')?.addEventListener('click', () => {
        if (confirm('¿Cargar datos de demostración para explorar los gráficos y analíticas?')) {
          window.stateManager.seedDemoData();
          refreshCurrentViewIfNeeded();
          this.showToast('Datos de demostración cargados');
          renderModalContent();
        }
      });

      document.getElementById('btn-modal-clear-all')?.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar TODOS los registros guardados en este dispositivo?')) {
          window.stateManager.clearAllData();
          refreshCurrentViewIfNeeded();
          this.showToast('Todos los datos han sido eliminados');
          renderModalContent();
        }
      });

      document.getElementById('btn-pwa-install')?.addEventListener('click', async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const choice = await this.deferredInstallPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          this.showToast('Instalando Khora en tu dispositivo...');
        }
        this.deferredInstallPrompt = null;
        renderModalContent();
      });

      document.getElementById('btn-settings-feedback')?.addEventListener('click', () => {
        this.openFeedbackModal();
      });
    };

    renderModalContent();
    modal.classList.add('active');

    await window.stateManager.checkServerHealth();
    this.updateDbStatusBadge();
    if (modal.classList.contains('active') && document.getElementById('storage-mode-modal-root')) {
      renderModalContent();
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
          Khora bloqueado
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
            🔓 Desbloquear
          </button>
        </form>

        ${bioEnabled ? `
          <button type="button" class="btn-secondary" id="btn-lock-biometric" style="width: 100%; justify-content: center; margin-top: 10px;">
            👆 Desbloquear con FaceID / Huella
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

  getHelpCatalog() {
    return {
      screens: {
        'guia-inicio': {
          title: '🏠 Guía de Inicio — ¿Qué necesitas ahora?',
          time: '⏱️ 10 seg',
          does: 'Elegir cómo te encuentras ahora mismo (en caliente o en calma) para ir directo al ejercicio adecuado.',
          brings: 'Orientarte sin fricción según lo que necesites en este instante.',
          whenToUse: 'Es tu punto de entrada rápido según cómo te sientas en este momento: en medio de una ola emocional o con calma para entrenar.',
          steps: [
            '1. Arriba ves tu Valor Faro actual para orientarte de un vistazo.',
            '2. Elige una tarjeta de «Ahora Mismo (En Caliente)» si estás bloqueado/a, saturado/a o temes ceder.',
            '3. Usa «Entrenar y Leer (En calma)» para fortalecer límites, desmontar etiquetas y guardar anclajes.'
          ],
          tip: 'En Khora no hace falta rellenarlo todo ni entrar cada día: abre solo la herramienta que encaja contigo ahora.'
        },
        'espacio-act': {
          title: '🌪️ El Espacio ACT — Procesar en 4 Pasos',
          time: '⏱️ 3 min',
          does: 'Nombrar la emoción, bajarla al cuerpo y desenganchar la mente.',
          brings: 'Bajar la intensidad del malestar y responder desde tus valores.',
          whenToUse: 'Úsalo cuando notes una emoción intensa (ansiedad, miedo, enfado, culpa o bloqueo) para atravesarla sin dejarte arrastrar.',
          steps: [
            '1. Rueda Emocional: nombra con precisión qué sientes (o salta directo al cuerpo si estás muy saturado/a).',
            '2. Cuerpo y Fisicalización: ubica la sensación en tu silueta, obsérvala con curiosidad y hazle hueco respirando.',
            '3. Defusión y Valores: desengancha la mente llamándola por su apodo y elige una micro-acción fiel a tus valores.'
          ],
          tip: 'El objetivo no es suprimir la emoción ni sentir cero miedo, sino bajar la lucha y recuperar tu margen de elección.'
        },
        'paz-falsa': {
          title: '🏳️ El Espejo de la Paz Falsa',
          time: '⏱️ 2 min',
          does: 'Contrastar qué querías decir vs. qué cediste por miedo.',
          brings: 'Medir el desgaste de callarte y detectar dónde poner límites.',
          whenToUse: 'Cuando acabas de callarte, pedir perdón de más o decir «sí» queriendo decir «no» para evitar una mala cara ajena.',
          steps: [
            '1. Anota dónde ocurrió y qué pedía la otra persona.',
            '2. Contrasta «lo que querías hacer realmente» frente a «lo que hiciste por fuera».',
            '3. Mide del 0 al 10 tu peaje real (resentimiento, agotamiento, ansiedad y vacío) para hacerlo visible.'
          ],
          tip: 'Nombrar la falsa paz no sirve para machacarte: tu resentimiento indica dónde te importa cuidar tus límites.'
        },
        'brujula-valores': {
          title: '🧭 La Brújula de Valores',
          time: '⏱️ 1 min',
          does: 'Pasar de «¿qué espera el otro?» a «¿qué elijo yo?».',
          brings: 'Una micro-acción clara para desbloquear tu decisión.',
          whenToUse: 'Antes de responder o tomar una decisión difícil, cuando dudas entre complacer al otro o ser fiel a lo que importa para ti.',
          steps: [
            '1. Resume en una línea la situación y marca qué miedo te frena ahora mismo.',
            '2. Elige el Valor que quieres representar como brújula (por encima del miedo inmediato).',
            '3. Fija una micro-acción concreta y honesta que dependa al 100% de ti.'
          ],
          tip: 'Pasa de «¿qué esperan que haga?» a «¿qué clase de persona elijo ser aquí?».'
        },
        'pildoras-trucos': {
          title: '⚡ Botiquín de 1 Minuto (Micro-Trucos)',
          time: '⏱️ 30-60 seg',
          does: 'Ejecutar una micro-técnica guiada paso a paso.',
          brings: 'Frenar el piloto automático en vivo.',
          whenToUse: 'Cuando necesitas frenar un impulso urgente en vivo en menos de 60 segundos (decir no, soltar culpa o bajar ansiedad).',
          steps: [
            '1. Filtra arriba por lo que quieres desatascar ahora mismo.',
            '2. Abre el ejercicio guiado paso a paso (Echar el Ancla, Silencio de 15s, Dos Flechas, Autobús ACT o Postura del SÍ).',
            '3. Síguelo en directo antes de contestar o decidir.'
          ],
          tip: 'Los temporizadores (15s de silencio o 2 minutos de pausa) cortan el reflejo automático de justificarte.'
        },
        'pildoras-estudio': {
          title: '📖 Lecturas y Ejercicios ACT (En Calma)',
          time: '⏱️ 2-3 min',
          does: 'Reencuadrar etiquetas rígidas, transformar dolor en anhelo y guardar mantras.',
          brings: 'Entrenar flexibilidad psicológica en frío sin sub-menús extra.',
          whenToUse: 'En momentos tranquilos para recordar ideas clave, desmontar etiquetas rígidas y ensanchar tu perspectiva.',
          steps: [
            '1. Revisa tus Tarjetas de Anclaje ACT o añade frases propias que quieras tener presentes en crisis.',
            '2. Usa el Deconstructor del «Yo Soy» para pasar de «soy egoísta/débil» a hechos concretos.',
            '3. Practica El Pivote para transformar un temor en el anhelo legítimo que esconde.'
          ],
          tip: 'Lo que entrenas en calma se vuelve accesible con mucho menos esfuerzo cuando llega la tormenta.'
        },
        'perfil-valores': {
          title: '💎 Mis Valores — Tu Brújula Vital',
          time: '⏱️ 2 min',
          does: 'Definir quién eliges ser en tus 5 ámbitos vitales y en qué conducta concreta se nota.',
          brings: 'Tener un Faro claro que guía toda la app cuando aparece la duda o el miedo.',
          whenToUse: 'Para definir quién eliges ser en tus áreas vitales (Pareja, Trabajo, Familia, Amistad, Conmigo Mismo).',
          steps: [
            '1. Pulsa cualquier ámbito o «+ Construir Valor» para crear tu frase con las 4 preguntas guía de Steven Hayes.',
            '2. Conviértelo en un pequeño gesto visible y nombra qué incomodidad estás dispuesto/a a sostener.',
            '3. Fija tu Valor Faro principal: guiará tu pantalla de inicio, tu Autobús ACT y tus crisis.'
          ],
          tip: 'Un valor no es un resultado ajeno («que me quieran»), sino una dirección continua («comunicar con afecto y honestidad»).'
        },
        'perfil-foco': {
          title: '🧭 Mi Foco Actual y Ruta Sugerida',
          time: '⏱️ 1 min',
          does: 'Anotar qué situación tienes en mente y qué barreras se te activan.',
          brings: 'Conectar tu bloqueo actual con tu valor de ese ámbito y ver qué herramienta encaja mejor.',
          whenToUse: 'Para situar qué tema te preocupa ahora, marcar qué barreras se te activan y ver qué ejercicio te ayuda más.',
          steps: [
            '1. A la izquierda escribe tu Foco actual, elige su ámbito y marca tus «Barreras que se te activan».',
            '2. A la derecha se calcula automáticamente tu «Hoja de Ruta Sugerida» con los ejercicios más afines.',
            '3. Pulsa cualquiera de las tarjetas sugeridas para ir directo a trabajarlo.'
          ],
          tip: 'Marcar las barreras no es una etiqueta negativa: es el filtro que le dice a la app qué ejercicio encaja mejor contigo.'
        },
        'radar-patrones': {
          title: '🔄 El Radar de Patrones y Práctica de Opuestos',
          time: '⏱️ 3 min',
          does: 'Mapear un bucle que se repite y diseñar 1 micro-experimento semanal.',
          brings: 'Romper hábitos de complacencia con cambios pequeños y medibles.',
          whenToUse: 'Para estudiar en frío un bucle repetitivo (detonante → sumisión → falsa paz → coste) y probar un pequeño giro realista.',
          steps: [
            '1. Pulsa «+ Nuevo Patrón» y dibuja las 4 piezas del bucle junto con su ámbito.',
            '2. Elige 1 micro-experimento semanal usando los generadores de Práctica de Opuestos.',
            '3. Haz check-in cuando quieras para contrastar qué ocurrió en la realidad frente a lo que temía tu mente.'
          ],
          tip: 'Los cambios pequeños pero medibles rompen hábitos de complacencia mucho mejor que propósitos gigantes.'
        },
        'perfil-autobus': {
          title: '🚌 Mi Autobús ACT y Radio Mental',
          time: '⏱️ 2 min',
          does: 'Identificar a tus pasajeros recurrentes (miedos y culpas) y sentarlos atrás sin pelear con ellos.',
          brings: 'Reconocer tus voces habituales al vuelo para que no giren tu volante.',
          whenToUse: 'Para poner nombre a tu «radio automática» y tener localizados los miedos que suelen intentar coger tu volante.',
          steps: [
            '1. Bautiza a tu mente pensante (ej. «George» o «Radio Catástrofe») para recordar que solo es un comentarista.',
            '2. Registra tus pasajeros recurrentes: qué gritan, de qué intentan protegerte y qué desvío te piden.',
            '3. Mándalos al asiento trasero sin pelear ni echarlos, y practica con el simulador en 1 minuto.'
          ],
          tip: 'En ACT los miedos no desaparecen del autobús; aprendes a conducir hacia tus valores aunque sigan hablando atrás.'
        },
        'insight-terapia': {
          title: '🛋️ Cuaderno de Terapia',
          time: '⏱️ 1-2 min',
          does: 'Anotar reflexiones, bloqueos o avances entre sesiones y preparar un resumen clínico listo para copiar.',
          brings: 'Llegar a tu sesión de psicología con los temas importantes claros y ordenados.',
          whenToUse: 'Entre sesiones de psicología para anotar bucles, disparadores, dudas o pequeños logros que no quieres olvidar.',
          steps: [
            '1. Escribe lo que observaste (o usa un inicio rápido) y selecciona ámbito y tipo de apunte.',
            '2. La app extrae automáticamente emociones y procesos ACT/Hexaflex orientativos para sesión.',
            '3. Pulsa «Ver / Copiar Informe para mi Psicólogo» para llevar un resumen ordenado listo para compartir.'
          ],
          tip: 'Marca las reflexiones como «Tratadas en sesión» cuando ya las hayáis trabajado en consulta.'
        },
        'insight-historial': {
          title: '🌱 Historial en Frío y Consolidación',
          time: '⏱️ 2 min',
          does: 'Filtrar episodios pasados por emoción o ámbito y revisarlos en frío con perspectiva.',
          brings: 'Detectar patrones emocionales repetidos y convertir episodios difíciles en aprendizaje.',
          whenToUse: 'Para revisar episodios pasados (Espacio ACT y Paz Falsa), filtrarlos por emoción o ámbito y sacar aprendizajes.',
          steps: [
            '1. Filtra por emoción sentida (Miedo, Ira, Tristeza, Agotamiento…), ámbito o palabra clave.',
            '2. Abre «Valorar e Integrar en frío» en cualquier episodio para reflexionar qué pasó con perspectiva.',
            '3. Usa «Reflexionar sobre este patrón en Cuaderno de Terapia» para sintetizar varios episodios repetidos.'
          ],
          tip: 'Mirar en frío un episodio pasado transforma la culpa en aprendizaje práctico para la próxima vez.'
        },
        'insight-graficos': {
          title: '📈 Gráficos y Perfil Hexaflex',
          time: '⏱️ 1 min',
          does: 'Revisar tu evolución, integrar episodios en frío y observar tendencias y tu perfil Hexaflex.',
          brings: 'Visión clara de tus avances para detectar patrones con curiosidad y compasión.',
          whenToUse: 'Para observar tendencias de intensidad, peaje de falsa paz, ámbitos con más sumisión y tu perfil Hexaflex.',
          steps: [
            '1. Evalúa de 0 a 10 los 6 procesos de flexibilidad psicológica en «Evaluar mi Hexaflex (1 min)».',
            '2. Revisa si baja la intensidad en tus crisis y qué ocurre con tu resentimiento en el tiempo.',
            '3. Observa en el mapa de calor en qué contextos (Trabajo, Pareja, Familia…) cedes más a menudo.'
          ],
          tip: 'Los gráficos no buscan la perfección: ayudan a detectar patrones con curiosidad científica y compasión.'
        },
        'insight-actividad': {
          title: '🌱 Actividad Reciente y Micro-Victorias',
          time: '⏱️ Consulta rápida',
          does: 'Revisar tus últimos pasos en Khora (foco, valores, barreras y pasajeros) y anotar micro-victorias.',
          brings: 'Ver tu constancia y tus pequeños avances cotidianos en un mismo sitio.',
          whenToUse: 'Para repasar tus cambios recientes en Khora o dejar apuntada una pequeña victoria o aprendizaje del día.',
          steps: [
            '1. Revisa la línea temporal de cambios en tu foco, valores, barreras y pasajeros.',
            '2. Escribe una micro-victoria o aprendizaje rápido abajo y pulsa «📝 Anotar».',
            '3. Vuelve aquí cuando necesites recordar todo lo que ya estás moviendo aunque cueste.'
          ],
          tip: 'La flexibilidad psicológica se construye con pequeños gestos repetidos, no con días perfectos.'
        }
      },
      topics: {
        'guia-inicio': {
          title: '🧭 ¿En qué momento estás ahora?',
          time: '⏱️ 10 seg',
          does: 'Elegir cómo te encuentras ahora mismo (en caliente o en calma) para ir directo al ejercicio adecuado.',
          brings: 'Orientarte sin fricción según lo que necesites en este instante.',
          summary: 'Es tu punto de entrada rápido según cómo te sientas en este momento: en medio de una ola emocional o con calma para entrenar.',
          bullets: [
            '1. Arriba ves tu Valor Faro actual y tu foco activo para orientarte de un vistazo.',
            '2. Elige una tarjeta de «Ahora Mismo (En Caliente)» si estás bloqueado/a, saturado/a o temes ceder.',
            '3. Usa «Entrenar y Leer (En calma)» para fortalecer límites, desmontar etiquetas y guardar anclajes.'
          ],
          note: 'En Khora no hace falta rellenarlo todo ni entrar cada día: abre solo la herramienta que encaja contigo ahora.'
        },
        'espacio-act': {
          title: '🌪️ El Espacio ACT — Procesar en 4 Pasos',
          time: '⏱️ 3 min',
          does: 'Nombrar la emoción, bajarla al cuerpo y desenganchar la mente.',
          brings: 'Bajar la intensidad del malestar y responder desde tus valores.',
          summary: 'Úsalo cuando notes una emoción intensa (ansiedad, miedo, enfado, culpa o bloqueo) para atravesarla sin dejarte arrastrar.',
          bullets: [
            '1. Rueda Emocional: nombra con precisión qué sientes (o salta directo al cuerpo si estás muy saturado/a).',
            '2. Cuerpo y Fisicalización: ubica la sensación en tu silueta, obsérvala con curiosidad y hazle hueco respirando.',
            '3. Defusión y Valores: desengancha la mente llamándola por su apodo y elige una micro-acción fiel a tus valores.'
          ],
          note: 'El objetivo no es suprimir la emoción ni sentir cero miedo, sino bajar la lucha y recuperar tu margen de elección.'
        },
        fisicalizar: {
          title: '🎨 Fisicalizar la Sensación (Aceptación Somática)',
          time: '⏱️ 1 min',
          does: 'Ubicar la emoción en el cuerpo, describirla como un objeto físico y respirar haciéndole espacio.',
          brings: 'Dejar de pelear con la sensación física para que pierda rigidez.',
          summary: 'En vez de darle vueltas mentales a por qué sientes ansiedad o miedo, bajas la atención a tu cuerpo y describes la sensación como si fuera un objeto físico.',
          bullets: [
            '1. Marca dónde está en el cuerpo y qué forma o temperatura tendría.',
            '2. Respira «alrededor» de ella haciendo espacio en lugar de intentar apretar o huir.',
            '3. Usa la Postura Somática del «SÍ» (hombros sueltos, palmas abiertas) para avisar a tu sistema nervioso de que estás a salvo.'
          ],
          note: 'Cuando dejas de pelear con la sensación física, suele perder intensidad por sí sola.'
        },
        'defusion-act': {
          title: '🍃 Fórmulas de Distanciamiento (Defusión Cognitiva)',
          time: '⏱️ 1 min',
          does: 'Anteponer una frase de perspectiva o soltar tus pensamientos en las Hojas en el Río.',
          brings: 'Separarte del pensamiento automático para que no funcione como una orden.',
          summary: 'Cuando estamos fusionados con un pensamiento («soy egoísta»), lo vivimos como una verdad absoluta. La defusión restaura distancia.',
          bullets: [
            '• Anteponer «Estoy teniendo el pensamiento de que…» convierte una verdad en un evento mental.',
            '• Decir «Observo que George (mi mente) me cuenta la historia de que…» añade perspectiva y humor.',
            '• Las Hojas en el Río ayudan a ver los pensamientos pasar sin tener que agarrarlos ni obedecerlos.'
          ],
          note: 'No hace falta discutir si el pensamiento es verdadero o falso: basta preguntarse si seguirlo te acerca a tus valores.'
        },
        'paz-falsa': {
          title: '🏳️ El Espejo de la Paz Falsa',
          time: '⏱️ 2 min',
          does: 'Contrastar qué querías decir vs. qué cediste por miedo.',
          brings: 'Medir el desgaste de callarte y detectar dónde poner límites.',
          summary: 'Cuando acabas de callarte, pedir perdón de más o decir «sí» queriendo decir «no» para evitar una mala cara ajena.',
          bullets: [
            '1. Anota dónde ocurrió y qué pedía la otra persona.',
            '2. Contrasta «lo que querías hacer realmente» frente a «lo que hiciste por fuera».',
            '3. Mide del 0 al 10 tu peaje real (resentimiento, agotamiento, ansiedad y vacío) para hacerlo visible.'
          ],
          note: 'Nombrar la falsa paz no sirve para machacarte: tu resentimiento indica dónde te importa cuidar tus límites.'
        },
        'peaje-emocional': {
          title: '🏳️ El Peaje Emocional de la Falsa Paz',
          time: '⏱️ 30 seg',
          does: 'Valorar del 0 al 10 cuánto resentimiento, agotamiento, ansiedad y vacío te dejó ceder.',
          brings: 'Hacer visible la factura interna de complacer y calcular tu Índice de Autoabandono.',
          summary: 'Ceder automáticamente suele traer alivio de 5 minutos por fuera, pero cobra una factura física y emocional por dentro.',
          bullets: [
            '🔥 Resentimiento, 🔋 Agotamiento, 🌪️ Ansiedad y 🕳️ Vacío resumen el coste real de callar o complacer.',
            '📊 Su media alimenta el «Índice de Autoabandono» para que veas qué situaciones o contextos te desgastan más.'
          ],
          note: 'Reconocer este coste es el primer paso para elegir límites más cuidadosos contigo.'
        },
        'brujula-valores': {
          title: '🧭 La Brújula de Valores',
          time: '⏱️ 1 min',
          does: 'Pasar de «¿qué espera el otro?» a «¿qué elijo yo?».',
          brings: 'Una micro-acción clara para desbloquear tu decisión.',
          summary: 'Antes de responder o tomar una decisión difícil, cuando dudas entre complacer al otro o ser fiel a lo que importa para ti.',
          bullets: [
            '1. Resume en una línea la situación y marca qué miedo te frena ahora mismo.',
            '2. Elige el Valor que quieres representar como brújula (por encima del miedo inmediato).',
            '3. Fija una micro-acción concreta y honesta que dependa al 100% de ti.'
          ],
          note: 'Pasa de «¿qué esperan que haga?» a «¿qué clase de persona elijo ser aquí?».'
        },
        'nortes-recientes': {
          title: '🧭 Nortes Fijados Recientemente',
          time: '⏱️ 30 seg',
          does: 'Revisar las micro-acciones y valores que ya has elegido en dilemas recientes.',
          brings: 'Reforzar tu confianza recordando cómo ya has respondido desde tus valores.',
          summary: 'Es tu registro de decisiones tomadas con la Brújula de Valores.',
          bullets: [
            '• Cada tarjeta guarda la situación, el miedo que apareció, el valor elegido y tu micro-acción.',
            '• Revisarlo antes de una conversación difícil te recuerda que puedes actuar aunque haya miedo.'
          ],
          note: 'Cada micro-acción honesta suma dirección vital aunque el resultado externo no dependa de ti.'
        },
        'pildoras-trucos': {
          title: '⚡ Botiquín de 1 Minuto (Micro-Trucos)',
          time: '⏱️ 30-60 seg',
          does: 'Ejecutar una micro-técnica guiada paso a paso.',
          brings: 'Frenar el piloto automático en vivo.',
          summary: 'Cuando necesitas frenar un impulso urgente en vivo en menos de 60 segundos (decir no, soltar culpa o bajar ansiedad).',
          bullets: [
            '1. Filtra arriba por lo que quieres desatascar ahora mismo.',
            '2. Abre el ejercicio guiado paso a paso (Echar el Ancla, Silencio de 15s, Dos Flechas, Autobús ACT o Postura del SÍ).',
            '3. Síguelo en directo antes de contestar o decidir.'
          ],
          note: 'Los temporizadores (15s de silencio o 2 minutos de pausa) cortan el reflejo automático de justificarte.'
        },
        'tarjetas-anclaje': {
          title: '⚓ Mis Tarjetas de Anclaje ACT',
          time: '⏱️ 30 seg',
          does: 'Guardar y repasar frases breves o mantras personales alineados con tus valores.',
          brings: 'Tener recordatorios rápidos a mano cuando aparece una ola emocional.',
          summary: 'Frases cortas de perspectiva ACT y recordatorios propios que también aparecen en tu botón SOS de crisis.',
          bullets: [
            '1. Desliza las tarjetas para leer tus anclajes guardados.',
            '2. Pulsa «+ Nuevo Anclaje» para escribir una frase tuya que te devuelva al presente.',
            '3. Tus tarjetas se integran automáticamente en la ventana de Asistencia Rápida SOS.'
          ],
          note: 'Las mejores frases ancla no son positivismo forzado, sino recordatorios de aceptación y valores.'
        },
        'miniguias-bolsillo': {
          title: '📖 Miniguías de Bolsillo (Lecturas de 1 Minuto)',
          time: '⏱️ 1 min',
          does: 'Leer micro-reflexiones prácticas sobre defusión, límites y aceptación y abrir su truco guiado.',
          brings: 'Entrenar flexibilidad psicológica en calma para que sea accesible en crisis.',
          summary: 'Lecturas breves diseñadas para asimilar conceptos ACT en momentos tranquilos.',
          bullets: [
            '1. Filtra por categoría (Defusión, Límites, Aceptación) o marca tus favoritas con ❤️.',
            '2. Abre cualquier píldora para leer el desglose completo en menos de 1 minuto.',
            '3. Pulsa «⚡ Ejecutar truco guiado» para practicar la técnica asociada al instante.'
          ],
          note: 'Lo que entrenas en calma se vuelve accesible con mucho menos esfuerzo cuando llega la tormenta.'
        },
        'deconstructor-pivote': {
          title: '🏷️ El Deconstructor del "Yo Soy"',
          time: '⏱️ 1 min',
          does: 'Desmontar una etiqueta fija en una conducta concreta y modificable.',
          brings: 'Soltar juicios absolutos sobre ti y recuperar margen de cambio.',
          summary: 'Dos prácticas breves en calma para flexibilizar juicios rígidos y transformar miedos en dirección valiosa.',
          bullets: [
            '🏷️ Deconstructor: transforma etiquetas globales («soy débil») en un pensamiento dentro de un contexto concreto y modificable.',
            '🔄 El Pivote: en la otra cara de cada dolor o miedo hay algo legítimo que valoras (vínculo, respeto, descanso); aprende a cuidarlo con dignidad en vez de sumisión.'
          ],
          note: 'Puedes probar cualquiera tocando una plantilla arriba y guardarla adaptada a tus palabras.'
        },
        'el-pivote': {
          title: '🔄 El Pivote: Del Dolor al Anhelo',
          time: '⏱️ 1 min',
          does: 'Transformar lo que te duele o temes en el valor o anhelo legítimo que esconde.',
          brings: 'Cuidar lo que te importa con dignidad en lugar de sumisión.',
          summary: 'En ACT, detrás de cada miedo o culpa suele esconderse algo que te importa de verdad (vínculo, respeto, descanso).',
          bullets: [
            '1. Nombra qué te duele o qué temes que ocurra.',
            '2. Pregúntate qué anhelo sano o valor hay en la otra cara de ese dolor.',
            '3. Elige un gesto digno para honrar ese anhelo sin caer en la falsa paz.'
          ],
          note: 'Donde hay dolor hay algo que valoras: el pivote te devuelve la dirección sin luchar contra el miedo.'
        },
        'valores-faro': {
          title: '💎 ¿Qué es un Valor en ACT?',
          time: '⏱️ 2 min',
          does: 'Definir quién eliges ser en tus 5 ámbitos vitales y en qué conducta concreta se nota.',
          brings: 'Tener una brújula clara que guía toda la app cuando aparece la duda o el miedo.',
          summary: 'Según Steven Hayes, un valor es una dirección vital continua (como ir hacia el Oeste), nunca un destino que se tacha ni algo que dependa de otra persona.',
          bullets: [
            '🧭 Valor (depende de ti): «Expresar mis necesidades con honestidad y calma».',
            '🚧 Trampa de meta ajena (no depende de ti): «Conseguir que nunca se enfaden conmigo».',
            '🌱 Micro-acción y Disposición: cada valor se aterriza en un gesto pequeño y en aceptar el pellizco de incomodidad que conlleva.'
          ],
          note: 'El valor que marques como «Valor Principal (Portada)» aparece destacado en Inicio y en momentos de crisis.'
        },
        'preguntas-guia-valores': {
          title: '🔭 Preguntas guía para descubrir valores (ACT)',
          time: '⏱️ 1 min',
          does: 'Usar 4 perspectivas clínicas de ACT para descubrir qué cualidad humana quieres encarnar en este ámbito.',
          brings: 'Salir del «¿qué debería hacer?» para conectar con lo que de verdad te importa.',
          summary: 'Son 4 preguntas clásicas de Terapia de Aceptación y Compromiso (Steven C. Hayes, Kelly Wilson y Russ Harris) pensadas para inspirarte antes de elegir semillas o escribir tu frase.',
          bullets: [
            '• Donde duele (Hayes): «Sufrimos donde nos importa»; detrás de tu frustración suele haber algo valioso que quieres cuidar.',
            '• Sin miedo ni culpa (Pregunta del milagro): cómo elegirías comportarte si el miedo al rechazo no decidiera hoy.',
            '• Tu huella (Wilson / Hayes): qué cualidad humana quieres que recuerden quienes te quieren.',
            '• Tu dignidad: qué acción te deja en paz contigo al mirarte al espejo.'
          ],
          note: 'No hace falta elegir ninguna: léelas solo para inspirarte y construye tu frase libremente.'
        },
        'perfil-foco': {
          title: '🧭 Mi Foco y Radar de Patrones',
          time: '⏱️ 1 min',
          does: 'Anotar qué situación tienes en mente y qué barreras se te activan.',
          brings: 'Conectar tu bloqueo actual con tu valor de ese ámbito y ver qué herramienta encaja mejor.',
          summary: 'Para situar qué tema te preocupa ahora, marcar qué barreras se te activan y mapear bucles repetitivos.',
          bullets: [
            '1. Arriba a la izquierda escribe tu Foco actual y marca tus «Barreras que se te activan».',
            '2. A la derecha se calcula automáticamente tu «Hoja de Ruta Sugerida» con los ejercicios más afines.',
            '3. Abajo, en «El Radar de Patrones», dibuja tus bucles repetitivos y define un micro-experimento semanal.'
          ],
          note: 'Marcar las barreras no es una etiqueta negativa: es el filtro que le dice a la app qué ejercicio encaja mejor contigo.'
        },
        'foco-situacion': {
          title: '📌 ¿Qué situación tienes en mente ahora?',
          time: '⏱️ 30 seg',
          does: 'Describir en una línea la situación o conversación que te preocupa y marcar su ámbito.',
          brings: 'Conectar tu preocupación actual con tu Valor Faro de ese ámbito y afinar tu ruta sugerida.',
          summary: 'Te ayuda a aterrizar una preocupación difusa en un contexto concreto (Pareja, Trabajo, Familia, Amigos).',
          bullets: [
            '1. Toca un chip rápido o escribe en una frase qué situación tienes presente.',
            '2. Selecciona el ámbito para ver al instante tu Valor Faro en esa área.',
            '3. Pulsa Guardar para que la Hoja de Ruta Sugerida adapte sus recomendaciones.'
          ],
          note: 'Puedes actualizar tu foco tantas veces como cambie tu semana.'
        },
        barreras: {
          title: '🧱 Barreras que se te activan — ¿Para qué sirven?',
          time: '⏱️ 15 seg',
          does: 'Marcar qué bloqueos internos (miedo al conflicto, culpa, urgencia de ceder, rumiación…) notas activos ahora.',
          brings: 'Alimentar la Hoja de Ruta Sugerida para recomendarte el ejercicio ACT más útil.',
          summary: 'Son los bloqueos psicológicos habituales (miedo al conflicto, culpa al poner límites, urgencia de ceder, rumiación…) que aparecen cuando intentas actuar según tus valores.',
          bullets: [
            '🎯 Para qué sirven aquí: al activar uno o varios chips, Khora los cruza con tu Foco actual y recalcula al instante tu «💡 Hoja de Ruta Sugerida».',
            '💡 Ejemplo: si marcas «Culpa al cuidar mis límites», te priorizará herramientas de límites breves y el Espejo de la Paz Falsa.',
            '🧭 También quedan reflejadas en tu resumen de progresión para detectar qué barrera te frena más a menudo.'
          ],
          note: 'No es un examen ni queda fijo: actívalas o desactívalas según lo que notes presente en tu momento actual.'
        },
        'hoja-ruta': {
          title: '💡 Hoja de Ruta Sugerida — ¿Cómo se calcula?',
          time: '⏱️ Instantáneo',
          does: 'Cruzar localmente tu Foco, tus barreras activas y tu Autobús ACT sin enviar datos fuera.',
          brings: 'Proponerte las herramientas ACT que mejor encajan con tu bloqueo actual.',
          summary: 'Es una recomendación local en tu propio navegador (sin IA externa ni servidores) basada en reglas transparentes.',
          bullets: [
            '🚌 Si tienes pasajeros haciendo ruido junto al volante, sugiere primero el ejercicio del Autobús ACT.',
            '🧱 Suma afinidad según las barreras que has marcado y las palabras clave de tu situación en «Mi Foco».',
            '💎 Conecta cada herramienta sugerida con el Valor Faro de ese ámbito para que recuerdes el «para qué».'
          ],
          note: 'Puedes ignorar cualquier sugerencia y entrar directamente al ejercicio que prefieras.'
        },
        'radar-patrones': {
          title: '🔄 El Radar de Patrones y Práctica de Opuestos',
          time: '⏱️ 3 min',
          does: 'Mapear un bucle que se repite y diseñar 1 micro-experimento semanal.',
          brings: 'Romper hábitos de complacencia con cambios pequeños y medibles.',
          summary: 'Sirve para estudiar en frío un bucle que se repite una y otra vez y probar una pequeña variación conductual realista.',
          bullets: [
            '1. Dibuja las 4 piezas del bucle: Detonante → Respuesta automática → Alivio rápido (Falsa Paz) → Coste real después.',
            '2. Elige 1 micro-experimento para la semana (usando los generadores de Opuestos: variar tiempo, forma o postura).',
            '3. Haz check-in cuando quieras para registrar qué descubrió la experiencia frente a lo que predecía tu mente.'
          ],
          note: 'Los cambios pequeños pero medibles rompen hábitos de complacencia mucho mejor que propósitos gigantes.'
        },
        'autobus-act': {
          title: '🚌 La Metáfora del Autobús (Steven C. Hayes)',
          time: '⏱️ 2 min',
          does: 'Identificar a tus pasajeros recurrentes (miedos y culpas) y sentarlos atrás sin pelear con ellos.',
          brings: 'Reconocer tus voces habituales al vuelo para que no giren tu volante.',
          summary: 'Tú conduces el autobús de tu vida hacia tus valores. Tus miedos, dudas y culpas son pasajeros que suben contigo e intentan hacerte girar cuando gritan.',
          bullets: [
            '❌ Luchar o intentar echarlos suele obligarte a parar el autobús y discutir con ellos.',
            '❌ Obedecerlos («digo que sí para que se callen») te saca de tu ruta y acaba en Falsa Paz.',
            '✅ Maniobra ACT: escuchar de qué intentan protegerte, sentarlos en los asientos traseros y mantener las manos en el volante.'
          ],
          note: 'Bautizar a tu mente (ej. «George») ayuda a recordar que esa voz es ruido automático, no una orden.'
        },
        'resumen-progresion': {
          title: '🌱 Actividad Reciente y Micro-Victorias',
          time: '⏱️ Consulta rápida',
          does: 'Revisar tus últimos pasos en Khora (foco, valores, barreras y pasajeros) y anotar micro-victorias.',
          brings: 'Ver tu constancia y tus pequeños avances cotidianos en un mismo sitio.',
          summary: 'Un registro ligero de tus pasos recientes en Khora.',
          bullets: [
            '• Muestra una línea temporal breve con tus últimos cambios de foco, valores, barreras y pasajeros.',
            '• Puedes anotar aprendizajes rápidos o micro-victorias del día.'
          ],
          note: 'La flexibilidad psicológica se construye con pequeños gestos repetidos, no con días perfectos.'
        },
        'cuaderno-terapia': {
          title: '🛋️ Cuaderno de Terapia e Informe Clínico',
          time: '⏱️ 1-2 min',
          does: 'Anotar reflexiones, bloqueos o avances entre sesiones y preparar un resumen clínico listo para copiar.',
          brings: 'Llegar a tu sesión de psicología con los temas importantes claros y ordenados.',
          summary: 'Un bloc pensado para capturar entre sesiones lo que suele olvidarse al sentarse en consulta.',
          bullets: [
            '🩺 Khora detecta de forma local palabras clave emocionales y procesos del Hexaflex para sugerir focos de sesión.',
            '📋 El botón «Ver / Copiar Informe para mi Psicólogo» reúne indicadores, emociones frecuentes, pasajeros, valores y temas pendientes en texto plano listo para pegar.'
          ],
          note: 'Ningún dato sale de tu navegador a menos que tú copies o exportes el texto.'
        },
        'insight-historial': {
          title: '🌱 Historial en Frío y Consolidación',
          time: '⏱️ 2 min',
          does: 'Filtrar episodios pasados por emoción o ámbito y revisarlos en frío con perspectiva.',
          brings: 'Detectar patrones emocionales repetidos y convertir episodios difíciles en aprendizaje.',
          summary: 'Para revisar episodios pasados (Espacio ACT y Paz Falsa), filtrarlos por emoción o ámbito y sacar aprendizajes.',
          bullets: [
            '1. Filtra por emoción sentida (Miedo, Ira, Tristeza, Agotamiento…), ámbito o palabra clave.',
            '2. Abre «Valorar e Integrar en frío» en cualquier episodio para reflexionar qué pasó con perspectiva.',
            '3. Usa «Reflexionar sobre este patrón en Cuaderno de Terapia» para sintetizar varios episodios repetidos.'
          ],
          note: 'Mirar en frío un episodio pasado transforma la culpa en aprendizaje práctico para la próxima vez.'
        },
        'hexaflex-perfil': {
          title: '📈 Perfil de Flexibilidad Psicológica (Hexaflex)',
          time: '⏱️ 1 min',
          does: 'Autoevaluar del 0 al 10 los 6 procesos ACT (Aceptación, Defusión, Presente, Yo Contexto, Valores y Acción).',
          brings: 'Visualizar qué proceso tienes más fuerte y cuál necesita entrenamiento suave.',
          summary: 'El Hexaflex de Steven Hayes resume las 6 habilidades que componen la flexibilidad psicológica.',
          bullets: [
            '1. Pulsa «Evaluar mi Hexaflex (1 min)» para puntuar cómo te has sentido en cada proceso.',
            '2. El gráfico radar dibuja tu equilibrio actual entre aceptación, defusión, presencia y acción.',
            '3. Repítelo cada cierto tiempo para observar qué área se va fortaleciendo.'
          ],
          note: 'No hay puntuaciones buenas o malas: es un mapa orientativo para saber qué herramienta practicar.'
        },
        'tendencias-evolucion': {
          title: '📈 Tendencias Emocionales y Evolución',
          time: '⏱️ Consulta visual',
          does: 'Comparar en el tiempo la intensidad de tus olas emocionales frente al peaje de falsa paz y resentimiento.',
          brings: 'Observar con perspectiva cómo evoluciona tu margen de respuesta.',
          summary: 'Cruza en una sola gráfica tus sesiones de Espacio ACT y tus registros de Paz Falsa.',
          bullets: [
            '• Línea verde: intensidad emocional procesada en Espacio ACT.',
            '• Nodos cálidos y línea discontinua: peaje de autoabandono y resentimiento acumulado en Paz Falsa.'
          ],
          note: 'En ACT el progreso no es dejar de sentir emociones intensas, sino ceder menos al piloto automático.'
        },
        'mapa-calor-contextos': {
          title: '📈 Mapa de Calor por Contextos (Sumisión Emocional)',
          time: '⏱️ Consulta visual',
          does: 'Agrupar tus registros de Falsa Paz según el ámbito vital donde ocurrieron (Trabajo, Pareja, Familia…).',
          brings: 'Identificar en qué entorno te cuesta más poner límites.',
          summary: 'Muestra cuántos episodios de Falsa Paz se concentran en cada área de tu vida.',
          bullets: [
            '• Te permite ver de un vistazo si tu mayor desgaste está en Trabajo, Pareja, Familia o Amigos.',
            '• Úsalo para decidir en qué ámbito construir tu próximo Valor Faro o micro-experimento en el Radar.'
          ],
          note: 'Detectar el contexto donde más cedes te ayuda a preparar frases ancla específicas antes de entrar en él.'
        }
      }
    };
  }

  openScreenHelpModal(viewId = null) {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const catalog = this.getHelpCatalog();
    const resolvedId = viewId || this.currentView || 'guia-inicio';
    const guide = catalog.screens[resolvedId] || catalog.screens['guia-inicio'];
    this.setModalSize('medium');

    modalBody.innerHTML = `
      <div id="help-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
            <span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700); margin-bottom: 6px; display: inline-block;">
              📘 Guía rápida de esta pantalla
            </span>
            <h3 class="card-title">${guide.title}</h3>
          </div>
          <button type="button" class="btn-icon" id="btn-help-close-x" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        <div style="margin-top: 12px; padding: 11px 13px; border-radius: var(--radius-md); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); font-size: 0.84rem; color: var(--text-primary); line-height: 1.5;">
          <strong>🎯 Cuándo usarla:</strong> <span>${guide.whenToUse}</span>
        </div>

        <div style="margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface);">
          <div style="font-size: 0.84rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            🪜 Cómo funciona paso a paso
          </div>
          <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.55; padding-left: 18px; margin: 0;">
            ${guide.steps.map(st => `<li style="margin-bottom: 5px;">${st}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top: 12px; padding: 10px 13px; border-radius: var(--radius-md); background: rgba(87, 139, 116, 0.1); border-left: 3.5px solid var(--sage-500); font-size: 0.81rem; color: var(--text-primary); line-height: 1.48;">
          <strong>💡 Clave ACT:</strong> <span>${guide.tip}</span>
        </div>

        <div class="btn-group" style="margin-top: 16px; justify-content: flex-end;">
          <button type="button" class="btn-primary" id="btn-help-done">✓ Entendido</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.getElementById('btn-help-close-x')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-help-done')?.addEventListener('click', () => this.closeModal());
  }

  openTopicHelpModal(topicId) {
    const tooltip = document.getElementById('act-glossary-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
    }

    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const catalog = this.getHelpCatalog();
    const topic = catalog.topics[topicId];
    if (!topic) {
      this.openScreenHelpModal(this.currentView);
      return;
    }
    this.setModalSize('medium');

    modalBody.innerHTML = `
      <div id="help-topic-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
            <span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700); margin-bottom: 6px; display: inline-block;">
              ⓘ Ayuda contextual ACT
            </span>
            <h3 class="card-title">${topic.title}</h3>
          </div>
          <button type="button" class="btn-icon" id="btn-help-topic-x" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        ${(topic.time || topic.does || topic.brings) ? `
          <div class="flow-purpose-bar" style="margin-top: 12px; margin-bottom: 10px;">
            ${topic.time ? `<span class="flow-purpose-pill">${topic.time}</span>` : ''}
            ${topic.does ? `<span class="flow-purpose-item"><strong>Qué haces:</strong> <span>${topic.does}</span></span>` : ''}
            ${topic.brings ? `<span class="flow-purpose-item"><strong>✨ Qué aporta:</strong> <span>${topic.brings}</span></span>` : ''}
          </div>
        ` : ''}

        <p class="card-subtitle mt-2" style="line-height: 1.5; color: var(--text-primary);">
          ${topic.summary}
        </p>

        <div style="margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated);">
          <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.55; padding-left: 18px; margin: 0;">
            ${topic.bullets.map(b => `<li style="margin-bottom: 5px;">${b}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top: 12px; padding: 10px 13px; border-radius: var(--radius-md); background: rgba(87, 139, 116, 0.1); border-left: 3.5px solid var(--sage-500); font-size: 0.81rem; color: var(--text-primary); line-height: 1.48;">
          ${topic.note}
        </div>

        <div class="btn-group" style="margin-top: 16px; justify-content: flex-end;">
          <button type="button" class="btn-primary" id="btn-help-topic-done">✓ Entendido</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.getElementById('btn-help-topic-x')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-help-topic-done')?.addEventListener('click', () => this.closeModal());
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
            <h3 class="card-title">🔒 Iniciar sesión en Khora</h3>
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
            🔓 Entrar y sincronizar
          </button>
        </form>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--border-subtle); text-align: center;">
          <button type="button" class="btn-secondary" id="btn-login-use-local" style="width: 100%; justify-content: center; font-size: 0.8rem;">
            📱 Usar solo en este navegador (sin acceder a la BD)
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
            <h3 class="card-title">💬 Enviar Feedback o Sugerencia</h3>
            <p class="card-subtitle mt-1" style="line-height: 1.45;">
              Comparte cualquier idea de mejora, fallo detectado o comentario sobre tu experiencia con Khora.
            </p>
          </div>
          <button type="button" class="btn-icon" id="btn-feedback-x" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        <div class="form-group mt-3">
          <label class="form-label" for="feedback-type">Tipo de comentario</label>
          <select id="feedback-type" class="form-select">
            <option value="💡 Sugerencia o nueva idea">💡 Sugerencia o nueva idea</option>
            <option value="🐛 Fallo o problema técnico">🐛 Fallo o problema técnico</option>
            <option value="💚 Comentario sobre la app">💚 Comentario sobre la app</option>
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
            🐙 Enviar en GitHub Issues
          </button>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-secondary" id="btn-feedback-copy" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              📋 Copiar mensaje
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
      const type = document.getElementById('feedback-type')?.value || '💡 Sugerencia o nueva idea';
      const title = document.getElementById('feedback-title')?.value?.trim() || 'Feedback Khora';
      const bodyMsg = document.getElementById('feedback-message')?.value?.trim() || '';
      const lang = window.i18n?.getLang?.() || 'es';
      const issueTitle = `[Feedback] ${title}`;
      const issueBody = [
        `**${type}**`,
        '',
        bodyMsg || '(Sin descripción adicional)',
        '',
        `---`,
        `Khora · lang: ${lang} · mode: ${window.stateManager?.getStorageMode?.() || 'local'}`
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
            title: 'Copia de seguridad Khora (ACT)',
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
          ? 'Pestaña temporal sin instalar: pulsa para ver cómo fijar Khora o exportar copia JSON'
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
          ⚠️ <strong>Pestaña temporal en móvil:</strong> añade Khora a tu Pantalla de Inicio antes de guardar datos reales (en iPhone los datos de pestaña suelta no pasan al icono y caducan a los 7 días).
        </span>
        <div class="persistence-warning-actions">
          <button type="button" class="btn-primary" id="btn-banner-install-guide" style="font-size: 0.76rem; padding: 5px 10px;">
            📲 Cómo instalar
          </button>
          <button type="button" class="btn-secondary" id="btn-banner-quick-export" style="font-size: 0.76rem; padding: 5px 10px;">
            💾 Exportar JSON
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
        this.showToast('Aviso fijado junto al título — pulsa «⚠️ Pestaña temporal» para ver detalles');
      });
      return;
    }

    banner.classList.remove('hidden');
    banner.innerHTML = `
      <span>
        💾 <strong>Modo Navegador Local:</strong> tus datos se guardan solo en este ${isMobile ? 'dispositivo' : 'navegador'}. Exporta una copia JSON cuando quieras moverlos o hacer respaldo.
      </span>
      <div class="persistence-warning-actions">
        <button type="button" class="btn-secondary" id="btn-banner-quick-export" style="font-size: 0.76rem; padding: 5px 10px;">
          💾 Exportar Copia JSON
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
      this.showToast('Aviso fijado junto al título — pulsa «⚠️ Solo navegador» para ver detalles');
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
              🍎 Pasos en iPhone / iPad (Safari):
            </div>
            <ol style="font-size: 0.8rem; color: var(--text-primary); line-height: 1.55; padding-left: 18px; margin: 0;">
              <li>Pulsa el botón <strong>Compartir</strong> (cuadrado con flecha hacia arriba ⬆️) en la barra de Safari.</li>
              <li>Baja y toca <strong>«Añadir a pantalla de inicio»</strong>.</li>
              <li><strong>Cierra Safari y abre Khora desde el nuevo icono</strong> de tu pantalla de inicio antes de escribir tus datos.</li>
            </ol>
          </div>
        `
        : `
          <div style="background: rgba(87, 139, 116, 0.1); border: 1px solid var(--sage-400); border-radius: var(--radius-md); padding: 12px 14px; margin-top: 12px; text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--sage-700); margin-bottom: 6px;">
              🤖 Pasos en Android (Chrome):
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
              <h3 class="card-title">📲 Instala Khora antes de guardar tus datos</h3>
              <p class="card-subtitle mt-1" style="line-height: 1.45;">
                Estás abriendo tu espacio ACT en una pestaña temporal del móvil sin servidor detrás.
              </p>
            </div>
            <button type="button" class="btn-icon" id="btn-gate-close-x" aria-label="Cerrar" style="width: 32px; height: 32px; flex-shrink: 0;">✕</button>
          </div>

          <div style="margin-top: 10px; padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid rgba(201, 138, 88, 0.45); background: rgba(201, 138, 88, 0.12); font-size: 0.8rem; color: var(--text-primary); line-height: 1.45;">
            ⚠️ <strong>¿Por qué importa esto?</strong> En móvil (especialmente en iPhone), la memoria de una pestaña normal de navegador <strong>no se comparte</strong> con el icono de la Pantalla de Inicio y Safari puede borrar pestañas inactivas a los 7 días.
          </div>

          ${deviceStepsHtml}

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
            ${this.deferredInstallPrompt ? `
              <button type="button" class="btn-primary" id="btn-gate-pwa-install" style="width: 100%; justify-content: center;">
                📲 Instalar Khora ahora
              </button>
            ` : ''}
            <button type="button" class="btn-secondary" id="btn-gate-export-first" style="width: 100%; justify-content: center; font-size: 0.82rem;">
              💾 Ya tengo datos aquí: Exportar copia JSON primero
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
          this.showToast('Instalando Khora en tu dispositivo...');
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
            <h3 class="card-title">💾 Almacenamiento Local (Sin Servidor)</h3>
            <p class="card-subtitle mt-1" style="line-height: 1.45;">
              Khora funciona de forma 100% privada directamente en tu navegador.
            </p>
          </div>
          <button type="button" class="btn-icon" id="btn-gate-close-x" aria-label="Cerrar" style="width: 32px; height: 32px; flex-shrink: 0;">✕</button>
        </div>

        <div style="margin-top: 10px; padding: 11px 13px; border-radius: var(--radius-md); border: 1px solid rgba(201, 138, 88, 0.45); background: rgba(201, 138, 88, 0.12); font-size: 0.81rem; color: var(--text-primary); line-height: 1.48;">
          ⚠️ <strong>¿Qué debes tener en cuenta?</strong> Tus registros se guardan únicamente en la memoria de este navegador y dispositivo. Si borras los datos del navegador o cambias de equipo sin exportar una copia, se perderán.
        </div>

        <div style="background: rgba(87, 139, 116, 0.09); border: 1px solid var(--sage-300); border-radius: var(--radius-md); padding: 11px 13px; margin-top: 10px;">
          <ul style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; padding-left: 18px; margin: 0;">
            <li>💾 Exporta una copia JSON periódicamente desde el botón de respaldo o pulsando el aviso <strong>«⚠️ Solo navegador»</strong> junto al título.</li>
            <li>🔐 Puedes activar cifrado AES-256 con PIN/contraseña o conectar un servidor SQLite propio desde <strong>⚙️ Configuración</strong>.</li>
          </ul>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button type="button" class="btn-primary" id="btn-gate-continue-anyway" style="width: 100%; justify-content: center;">
            ✓ Entendido, empezar a usar Khora
          </button>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-secondary" id="btn-gate-export-first" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              💾 Exportar copia JSON ahora
            </button>
            <button type="button" class="btn-secondary" id="btn-gate-open-settings" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              ⚙️ Ver opciones de Configuración
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
      let swRefreshing = false;
      navigator.serviceWorker.addEventListener?.('controllerchange', () => {
        if (swRefreshing) return;
        swRefreshing = true;
        window.location?.reload?.();
      });

      navigator.serviceWorker.register('./sw.js?v=4.47', { updateViaCache: 'none' })
        .then((reg) => {
          console.log('[PWA] Service Worker registrado con éxito:', reg.scope);
          reg.update?.().catch(() => {});
        })
        .catch((err) => {
          console.warn('[PWA] Error en registro de Service Worker:', err);
        });
    }
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
  window.app.init();
});
