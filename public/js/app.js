/**
 * KHORA - Tu espacio ACT
 * Main Application Orchestrator & Controller
 */

const KHORA_CREDITS = {
  githubUser: 'JCarrascoF',
  repoName: 'khora',
  kofiUrl: 'https://ko-fi.com/jcarrascof'
};

const KHORA_VERSION = (typeof window !== 'undefined' && window.__KHORA_APP_VERSION__) || '1.0.0';
window.KHORA_VERSION = KHORA_VERSION;

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
    example: 'Sostener el cosquilleo de culpa tras decir "hoy no puedo" sin correr a retractarte.'
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
    this.currentView = 'home';
    this.currentGroup = 'ahora-mismo';
    this.guideSection = null;
    this.guideReturnView = null;
    this.toastTimer = null;
    this.deferredInstallPrompt = null;

    this.legacyViewAliases = {
      'guia-inicio': 'home',
      'ahora-mismo': 'home',
      'perfil-foco': 'home',
      'now': 'home',
      'espacio-act': 'act-space',
      'pildoras-trucos': 'toolkit',
      'brujula-valores': 'compass',
      'paz-falsa': 'false-peace',
      'pildoras-estudio': 'readings',
      'pildoras-anclajes': 'pills-anchors',
      'yo': 'values',
      'me': 'values',
      'valores-rutina': 'values',
      'perfil': 'values',
      'profile': 'values',
      'perfil-valores': 'values',
      'perfil-autobus': 'bus',
      'perfil-anclajes': 'anchors',
      'radar-patrones': 'patterns',
      'insight': 'therapy',
      'evolution': 'therapy',
      'insight-terapia': 'therapy',
      'insight-historial': 'history',
      'insight-graficos': 'charts',
      'insight-actividad': 'activity',
      'learn': 'readings',
      'aprender': 'readings'
    };

    this.navGroups = {
      'ahora-mismo': {
        label:'Ahora',
        items: [
          { id:'home', icon:'', label:'Inicio' },
          { id:'act-space', icon:'', label:'Procesar Emoción' },
          { id:'toolkit', icon:'', label:'Botiquín' },
          { id:'compass', icon:'', label:'Elegir qué Hacer' },
          { id:'false-peace', icon:'', label:'Acabo de Ceder' }
        ]
      },
      'yo': {
        label:'Yo',
        items: [
          { id:'values', icon:'', label:'Mis Valores', helpTopic:'valores-faro' },
          { id:'bus', icon:'', label:'Mi Autobús', helpTopic:'autobus-act' },
          { id:'anchors', icon:'', label:'Mis Anclajes', helpTopic:'tarjetas-anclaje' },
          { id:'patterns', icon:'', label:'Mis Patrones', helpTopic:'radar-patrones' }
        ]
      },
      'insight': {
        label:'Evolución',
        items: [
          { id:'therapy', icon:'', label:'Cuaderno de Terapia', helpTopic:'cuaderno-terapia' },
          { id:'history', icon:'', label:'Historial en Frío', helpTopic:'insight-historial' },
          { id:'charts', icon:'', label:'Gráficos y Hexaflex' },
          { id:'activity', icon:'', label:'Actividad Reciente' }
        ]
      },
      'learn': {
        label:'Aprender',
        items: [
          { id:'readings', icon:'', label:'Lecturas y Ejercicios' }
        ]
      }
    };
  }

  resolveViewAlias(viewId) {
    if (!viewId) return 'home';
    return this.legacyViewAliases[viewId] || viewId;
  }

  dismissSplash() {
    const splash = document.getElementById('app-splash');
    if (!splash) return;
    const isLocked = Boolean(window.stateManager?.isVaultLocked?.());
    const reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    if (isLocked || reducedMotion) {
      splash.classList.add('hidden');
      return;
    }
    setTimeout(() => {
      splash.classList.add('is-leaving');
      setTimeout(() => {
        splash.classList.add('hidden');
      }, 360);
    }, 700);
  }

  init() {
    this.dismissSplash();
    this.initTheme();
    this.initPalette();
    this.initSurface();
    this.initButtons();
    this.initExplanations();
    this.initActConcepts();
    this.initPWA();
    window.i18n?.init?.();
    this.bindGlobalNavigation();
    this.initFeedbackGesture();
    
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
      'home', 'guide',
      'act-space', 'toolkit', 'compass', 'false-peace', 'readings', 'pills-anchors',
      'values', 'bus', 'anchors', 'patterns',
      'therapy', 'history', 'charts', 'activity'
    ];
    const handleHashRoute = (rawHash, { isInitial = false } = {}) => {
      const clean = (rawHash || '').replace('#', '');
      const readingPrefix = clean.startsWith('readings/reading/')
        ? 'readings/reading/'
        : (clean.startsWith('pildoras-estudio/lectura/') ? 'pildoras-estudio/lectura/' : null);
      if (readingPrefix) {
        const pillId = clean.slice(readingPrefix.length);
        if (window.pildorasAnclajesApp) {
          window.pildorasAnclajesApp.activeReadingId = pillId || null;
          window.pildorasAnclajesApp.activeWorkshopId = null;
        }
        if (this.currentView === 'readings') {
          window.pildorasAnclajesApp?.render?.();
          window.pildorasAnclajesApp?.bindEvents?.();
        } else {
          this.navigate('readings', { updateHash: false, preserveStudySubView: true });
        }
        return;
      }
      const workshopPrefix = clean.startsWith('readings/workshop/')
        ? 'readings/workshop/'
        : (clean.startsWith('pildoras-estudio/taller/') ? 'pildoras-estudio/taller/' : null);
      if (workshopPrefix) {
        const workshopId = clean.slice(workshopPrefix.length);
        if (window.pildorasAnclajesApp) {
          window.pildorasAnclajesApp.activeWorkshopId = workshopId || null;
          window.pildorasAnclajesApp.activeReadingId = null;
        }
        if (this.currentView === 'readings') {
          window.pildorasAnclajesApp?.render?.();
          window.pildorasAnclajesApp?.bindEvents?.();
        } else {
          this.navigate('readings', { updateHash: false, preserveStudySubView: true });
        }
        return;
      }

      const resolvedClean = this.resolveViewAlias(clean);
      const isKnownRoute = this.validViews.includes(resolvedClean) && Boolean(clean);
      const target = isKnownRoute ? resolvedClean : 'home';
      if (
        target === 'readings' &&
        this.currentView === 'readings' &&
        window.pildorasAnclajesApp &&
        (window.pildorasAnclajesApp.activeReadingId || window.pildorasAnclajesApp.activeWorkshopId)
      ) {
        window.pildorasAnclajesApp.activeReadingId = null;
        window.pildorasAnclajesApp.activeWorkshopId = null;
        window.pildorasAnclajesApp.render();
        window.pildorasAnclajesApp.bindEvents();
        return;
      }

      if (isInitial) {
        if (isKnownRoute) {
          const shouldNormalizeLegacy = resolvedClean !== clean;
          this.navigate(target, { updateHash: shouldNormalizeLegacy });
        } else {
          this.navigate('home');
        }
      } else if (target !== this.currentView) {
        this.navigate(target, { updateHash: resolvedClean !== clean });
      }
    };

    handleHashRoute(window.location.hash, { isInitial: true });

    if (!this._hashChangeBound) {
      window.addEventListener('hashchange', () => {
        handleHashRoute(window.location.hash, { isInitial: false });
      });
      this._hashChangeBound = true;
    }

    // Modal background close (require explicit confirmation for the first-visit storage/PWA modal)
    document.getElementById('app-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'app-modal' && !document.getElementById('install-gate-modal-root')) {
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
          return;
        }
        if (document.body.classList.contains('flow-immersive')) {
          this.setFlowImmersive(false);
          this.navigate('home');
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
    this.initExplanations();
    this.initActConcepts();
          this.updatePersistenceWarningBanner();
          this.maybeShowInstallGateModal();
        } else if (event === 'vault_locked') {
          this.closeModal();
          this.setFlowImmersive(false);
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
    this.initExplanations();
    this.initActConcepts();
      }

      if (this.currentView === 'home') {
        this.renderGuiaInicio();
      } else if (this.currentView === 'guide') {
        this.renderKhoraGuide();
      } else if (
        (this.currentView === 'values' ||
         this.currentView === 'bus' ||
         this.currentView === 'anchors') &&
        window.perfilApp
      ) {
        window.perfilApp.render();
        window.perfilApp.bindEvents();
      } else if (
        (this.currentView === 'therapy' ||
         this.currentView === 'charts' ||
         this.currentView === 'history' ||
         this.currentView === 'activity') &&
        window.insightApp
      ) {
        window.insightApp.render();
        window.insightApp.bindEvents();
      } else if (this.currentView === 'patterns' && window.radarPatronesApp) {
        window.radarPatronesApp.render();
        window.radarPatronesApp.bindEvents();
      } else if (this.currentView === 'compass' && window.brujulaValoresApp) {
        window.brujulaValoresApp.render();
        window.brujulaValoresApp.bindEvents();
      } else if (
        (this.currentView === 'pills-anchors' ||
         this.currentView === 'toolkit' ||
         this.currentView === 'readings') &&
        window.pildorasAnclajesApp
      ) {
        window.pildorasAnclajesApp.render();
        window.pildorasAnclajesApp.bindEvents();
      } else if (
        (event === 'server_synced' || event === 'data_imported' || event === 'data_cleared' || event === 'demo_seeded') &&
        this.currentView === 'act-space' &&
        window.espacioActApp
      ) {
        window.espacioActApp.render();
        window.espacioActApp.bindEvents();
      } else if (
        (event === 'server_synced' || event === 'data_imported' || event === 'data_cleared' || event === 'demo_seeded') &&
        this.currentView === 'false-peace' &&
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
    else if (size === 'wheel') modalBody.classList.add('modal-wheel-maximized');
  }

  resetModalScroll() {
    const modalBody = document.getElementById('modal-body');
    if (modalBody) modalBody.scrollTop = 0;
  }

  openModal(size = 'default', { resetScroll = true } = {}) {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return false;
    this.setModalSize(size);
    modal.classList.add('active');
    if (resetScroll) {
      modalBody.scrollTop = 0;
    }
    return true;
  }

  closeModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (modal && modal.classList.contains('active')) {
      if (modalBody) modalBody.scrollTop = 0;
      modal.classList.remove('active');
      this.setModalSize('default');
      this.hideSettingsSaveIndicator?.();
      window.pildorasAnclajesApp?.stopTrickTimer?.();
      window.espacioActApp?.stopBreathing?.();
      return true;
    }
    return false;
  }

  // Navigation (Ahora | Yo | Evolución [Reloj])
  navigate(targetView, options = {}) {
    if (!options.keepModal) {
      this.closeModal();
    }
    let resolvedSubView = this.resolveViewAlias(targetView);

    let sectionId = resolvedSubView;
    let activeGroup = 'ahora-mismo';

    if (resolvedSubView === 'toolkit') {
      sectionId = 'pills-anchors';
      activeGroup = 'ahora-mismo';
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.mode = 'trucos';
        window.pildorasAnclajesApp.currentTab = 'trucos';
        if (this.currentView !== 'toolkit') {
          window.pildorasAnclajesApp.activeTrickGroup = null;
        }
      }
    } else if (resolvedSubView === 'readings') {
      sectionId = 'pills-anchors';
      activeGroup = 'learn';
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.mode = 'estudio';
        if (window.pildorasAnclajesApp.currentTab === 'trucos' || window.pildorasAnclajesApp.currentTab === 'posture') {
          window.pildorasAnclajesApp.currentTab = 'pildoras';
        }
        if (this.currentView !== 'readings' && !options.preserveStudySubView) {
          window.pildorasAnclajesApp.activeStudyArea = null;
          window.pildorasAnclajesApp.activeReadingId = null;
          window.pildorasAnclajesApp.activeWorkshopId = null;
          window.pildorasAnclajesApp.readingReturnView = null;
        }
      }
    } else if (resolvedSubView === 'pills-anchors') {
      sectionId = 'pills-anchors';
      const isTricks = window.pildorasAnclajesApp?.mode === 'trucos' || window.pildorasAnclajesApp?.currentTab === 'trucos';
      activeGroup = isTricks ? 'ahora-mismo' : 'learn';
      resolvedSubView = isTricks ? 'toolkit' : 'readings';
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.mode = isTricks ? 'trucos' : 'estudio';
      }
    } else if (
      resolvedSubView === 'values' ||
      resolvedSubView === 'bus' ||
      resolvedSubView === 'anchors'
    ) {
      sectionId = 'profile';
      activeGroup = 'yo';
      if (window.perfilApp) {
        const tabMap = {
          'values': 'valores',
          'bus': 'autobus',
          'anchors': 'anclajes'
        };
        window.perfilApp.activeProfileTab = tabMap[resolvedSubView] || 'valores';
      }
    } else if (resolvedSubView === 'patterns') {
      sectionId = 'patterns';
      activeGroup = 'yo';
    } else if (
      resolvedSubView === 'therapy' ||
      resolvedSubView === 'charts' ||
      resolvedSubView === 'history' ||
      resolvedSubView === 'activity'
    ) {
      sectionId = 'insight';
      activeGroup = 'insight';
      if (window.insightApp) {
        const tabMap = {
          'therapy': 'terapia',
          'charts': 'graficos',
          'history': 'historial',
          'activity': 'actividad'
        };
        window.insightApp.activeInsightTab = tabMap[resolvedSubView] || 'terapia';
      }
    } else if (resolvedSubView === 'guide') {
      sectionId = 'guide';
      activeGroup = this.guideReturnView === 'readings' ? 'learn' : 'ahora-mismo';
      if (options.guideReturnView !== undefined) {
        this.guideReturnView = options.guideReturnView;
        activeGroup = this.guideReturnView === 'readings' ? 'learn' : 'ahora-mismo';
      } else if (this.currentView !== 'guide') {
        this.guideReturnView = null;
        activeGroup = 'ahora-mismo';
      }
      if (options.guideSection !== undefined) {
        this.guideSection = options.guideSection;
      } else if (this.currentView !== 'guide') {
        this.guideSection = null;
      }
    } else {
      // home, act-space, false-peace, compass
      activeGroup = 'ahora-mismo';
    }

    const prevView = this.currentView;
    this.currentView = resolvedSubView;
    this.currentGroup = activeGroup;
    const immersiveViews = new Set(['act-space', 'false-peace', 'compass']);
    if (!immersiveViews.has(sectionId)) {
      this.setFlowImmersive(false);
    }
    if (sectionId !== 'act-space') {
      if (prevView === 'act-space' && window.espacioActApp?.resetForm) {
        window.espacioActApp.resetForm();
      } else {
        window.espacioActApp?.stopBreathing?.();
      }
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
    if (!options.keepModal) {
      window.KhoraUtils.scrollToTop();
    }

    // Re-render target subapp if necessary
    if (sectionId === 'home') {
      this.renderGuiaInicio();
    } else if (sectionId === 'guide') {
      this.renderKhoraGuide();
    } else if (sectionId === 'profile' && window.perfilApp) {
      window.perfilApp.render();
      window.perfilApp.bindEvents();
    } else if (sectionId === 'insight' && window.insightApp) {
      window.insightApp.render();
      window.insightApp.bindEvents();
    } else if (sectionId === 'compass' && window.brujulaValoresApp) {
      this.setFlowImmersive(true);
      window.brujulaValoresApp.render();
      window.brujulaValoresApp.bindEvents();
    } else if (sectionId === 'pills-anchors' && window.pildorasAnclajesApp) {
      window.pildorasAnclajesApp.render();
      window.pildorasAnclajesApp.bindEvents();
    } else if (sectionId === 'act-space' && window.espacioActApp) {
      this.setFlowImmersive(true);
      window.espacioActApp.render();
      window.espacioActApp.bindEvents();
    } else if (sectionId === 'false-peace' && window.pazFalsaApp) {
      this.setFlowImmersive(true);
      window.pazFalsaApp.render();
      window.pazFalsaApp.bindEvents();
    } else if (sectionId === 'patterns' && window.radarPatronesApp) {
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

  setFlowImmersive(active) {
    if (active) {
      document.body.classList.add('flow-immersive');
    } else {
      document.body.classList.remove('flow-immersive');
    }
  }

  renderGuiaInicio() {
    const container = document.getElementById('home-view');
    if (!container || !window.stateManager) return;

    const isEn = window.i18n?.getLang?.() === 'en';
    const hotFlows = [
      {
        view: 'act-space',
        primary: true,
        title: 'Siento agobio, tensión o la cabeza llena de ruido',
        does: isEn
          ? 'Put what you feel into words, <span class="act-term" data-term="defusion">let go of the mental struggle</span>, and give <span class="act-term" data-term="aceptacion">your body a breather</span>.'
          : 'Pon en palabras lo que sientes, <span class="act-term" data-term="defusion">suelta la pelea mental</span> y dale un <span class="act-term" data-term="aceptacion">respiro a tu cuerpo</span>.'
      },
      {
        view: 'toolkit',
        primary: false,
        title: 'Voy muy acelerado/a y necesito frenar un momento',
        does: isEn
          ? 'One-minute resets to breathe, <span class="act-term" data-term="echar-el-ancla">pause the urge</span>, or reply calmly.'
          : 'Pausas de un minuto para respirar, <span class="act-term" data-term="echar-el-ancla">frenar el impulso</span> o responder con calma.'
      },
      {
        view: 'compass',
        primary: false,
        title: 'No sé qué hacer o me cuesta tomar una decisión',
        does: isEn
          ? 'Clarify what fear is holding you back and pick the step that <span class="act-term" data-term="valores-act">makes the most sense to you</span>.'
          : 'Aclara qué miedo te está frenando y elige el paso que tenga más <span class="act-term" data-term="valores-act">sentido para ti</span>.'
      },
      {
        view: 'false-peace',
        primary: false,
        title: 'He dicho que sí por compromiso o miedo al conflicto',
        does: isEn
          ? 'Write down when <span class="act-term" data-term="paz-falsa">you gave in out of obligation</span> to understand the toll and learn to protect your boundaries.'
          : 'Anota cuándo <span class="act-term" data-term="paz-falsa">cediste por compromiso</span> para entender el desgaste y aprender a cuidar tus límites.'
      }
    ];

    const isIntroDismissed = typeof localStorage !== 'undefined' && localStorage.getItem('act_intro_guide_dismissed') === '1';

    container.innerHTML = `
      <div class="view-plain-shell">
        ${!isIntroDismissed ? `
          <div class="intro-guide-card" id="intro-guide-recommendation">
            <div class="intro-guide-kicker">Bienvenido/a a Khōra</div>
            <p class="intro-guide-text">Descubre en 2 minutos cómo está organizado este espacio local-first para acompañarte sin juzgar ni luchar contra lo que sientes.</p>
            <div class="intro-guide-actions">
              <button type="button" class="intro-guide-link" id="btn-open-khora-guide">Guía de uso de Khōra →</button>
              <button type="button" class="intro-guide-dismiss" id="btn-dismiss-intro-guide" aria-label="Ya conozco la guía">Ya la conozco</button>
            </div>
          </div>
        ` : ''}

        <div>
          <div class="cozy-section-label">Ahora…</div>
          <div class="guided-triage-grid">
            ${hotFlows.map(flow => `
              <button type="button" class="triage-card ${flow.primary ? 'triage-card-primary' : ''}" data-go-view="${flow.view}">
                <div class="triage-card-body">
                  <div class="triage-card-title">${flow.title}</div>
                  <p class="triage-card-desc">${flow.does}</p>
                </div>
                <span class="triage-card-arrow" aria-hidden="true">→</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-open-khora-guide')?.addEventListener('click', () => {
      try { localStorage.setItem('act_intro_guide_dismissed', '1'); } catch {}
      this.navigate('guide', { guideSection: null });
    });

    document.getElementById('btn-dismiss-intro-guide')?.addEventListener('click', () => {
      try { localStorage.setItem('act_intro_guide_dismissed', '1'); } catch {}
      const card = document.getElementById('intro-guide-recommendation');
      if (card) card.remove();
    });

    container.querySelectorAll('[data-go-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isConceptsActive = document.documentElement.getAttribute('data-act-concepts') !== 'hide';
        if (isConceptsActive && e.target.closest('.act-term')) {
          e.stopPropagation();
          return;
        }
        const target = btn.dataset.goView;
        if (target) this.navigate(target);
      });
    });
  }

  renderKhoraGuide() {
    const container = document.getElementById('guide-view');
    if (!container) return;

    const esc = window.KhoraUtils.escapeHtml;
    const tr = (text) => (window.i18n?.getLang?.() === 'en' && window.i18n?.translateText ? window.i18n.translateText(text) : text);

    const sections = [
      {
        id: 'now',
        label: tr('1. Ahora'),
        title: tr('1. Ahora: sostener el presente'),
        lead: tr('Cuando hay agobio, bloqueo o prisa, pensar demasiado suele empeorar el ruido. Ahora está diseñada para acompañarte dentro del momento difícil sin pedirte análisis profundos ni explicaciones largas.'),
        points: [
          {
            name: tr('Procesar Emoción (Espacio ACT)'),
            text: tr('úsalo cuando sientes una emoción intensa y tienes unos minutos para atravesarla en 7 pasos: bajar el ruido mental, notar el cuerpo y elegir un gesto con sentido.')
          },
          {
            name: tr('Botiquín'),
            text: tr('úsalo cuando estás desbordado/a o con prisa y solo puedes hacer una pausa de 1 minuto (respiración, anclaje o freno al impulso).')
          },
          {
            name: tr('Elegir qué Hacer'),
            text: tr('úsalo antes de actuar cuando sientes duda, parálisis o conflicto interno entre lo que te da miedo y lo que te importa.')
          },
          {
            name: tr('Acabo de Ceder'),
            text: tr('úsalo después de haber evitado algo o cedido por compromiso o culpa, para observar qué pasó sin castigarte.')
          }
        ],
        connection: tr('Lo que guardes aquí nutre después tu Historial en Frío y tus gráficos en Evolución, apoyándose en los valores y anclajes que hayas preparado en Yo.'),
        ctaLabel: tr('Ir a Ahora'),
        ctaView: 'home'
      },
      {
        id: 'me',
        label: tr('2. Yo'),
        title: tr('2. Yo: tus valores, tu autobús y tus patrones'),
        lead: tr('En medio de una crisis es difícil recordar qué es importante para ti. Yo es el espacio para construir tu brújula personal en días más tranquilos. No es una lista rígida ni definitiva: evoluciona contigo.'),
        points: [
          {
            name: tr('Mis Valores'),
            text: tr('define qué importa de verdad en tu vida y tradúcelo en acciones pequeñas y concretas. Tu Valor Faro guía las decisiones en toda la app.')
          },
          {
            name: tr('Mi Autobús'),
            text: tr('pon nombre a tus «pasajeros» internos (miedos, autoexigencia, culpa) para recordar que pueden hacer ruido en el asiento de atrás sin llevar el volante.')
          },
          {
            name: tr('Mis Anclajes'),
            text: tr('guarda frases y recordatorios propios que te devuelven perspectiva cuando la mente se engancha en un bucle.')
          },
          {
            name: tr('Mis Patrones'),
            text: tr('observa qué emociones, pensamientos o contextos se repiten en tu día a día con curiosidad y sin juicio.')
          }
        ],
        connection: tr('Todo lo que defines aquí aparece como apoyo directo cuando usas Espacio ACT o Elegir qué Hacer en Ahora.'),
        ctaLabel: tr('Explorar Yo'),
        ctaView: 'values'
      },
      {
        id: 'evolution',
        label: tr('3. Evolución'),
        title: tr('3. Evolución: mirar atrás en frío'),
        lead: tr('Cuando estamos dentro del malestar, la mente tiende a verlo todo más grande o permanente. Evolución existe para revisar tu recorrido en frío, con distancia, y transformar registros sueltos en aprendizaje sereno para ti o para tus sesiones.'),
        points: [
          {
            name: tr('Cuaderno de Terapia'),
            text: tr('reúne notas, temas pendientes y genera un resumen en texto plano listo para copiar antes de una sesión.')
          },
          {
            name: tr('Historial en Frío'),
            text: tr('repasa tus registros pasados de Espacio ACT, Elegir qué Hacer y Acabo de Ceder sin la carga emocional del momento.')
          },
          {
            name: tr('Gráficos y Hexaflex'),
            text: tr('visualiza tendencias en el tiempo y el equilibrio entre los 6 procesos de flexibilidad psicológica de ACT.')
          },
          {
            name: tr('Actividad Reciente'),
            text: tr('una línea temporal breve para ver tus últimos pasos y micro-victorias sin abrumarte con métricas.')
          }
        ],
        connection: tr('Se alimenta automáticamente de lo que vas registrando en Ahora; si acabas de empezar, es normal verla casi vacía al principio.'),
        ctaLabel: tr('Ver Evolución'),
        ctaView: 'therapy'
      },
      {
        id: 'learn',
        label: tr('4. Aprender'),
        title: tr('4. Aprender: lecturas, introducción a ACT y talleres'),
        lead: tr('Aprender teoría o hacer ejercicios reflexivos mientras lo estás pasando mal no suele funcionar. Aprender separa el estudio y la práctica calmada de los momentos de urgencia, para que entiendas el porqué de las herramientas a tu ritmo.'),
        points: [
          {
            name: tr('Introducción a ACT'),
            text: tr('una lectura breve para entender por qué aquí no luchamos contra lo que sientes y qué significan conceptos como aceptación o defusión.')
          },
          {
            name: tr('Lecturas breves'),
            text: tr('píldoras cortas organizadas por tema (límites, valores, evitación, presencia) para leer en 2 minutos.')
          },
          {
            name: tr('Talleres y ejercicios'),
            text: tr('prácticas interactivas más pausadas, como El Pivote o el Deconstructor, pensadas para días de calma.')
          }
        ],
        connection: tr('Muchas lecturas enlazan directamente con técnicas del Botiquín para que puedas pasar de la idea a la práctica cuando quieras.'),
        ctaLabel: tr('Ir a Aprender'),
        ctaView: 'readings'
      },
      {
        id: 'privacy',
        label: tr('5. Privacidad y copias'),
        title: tr('5. Privacidad local y copias de seguridad'),
        lead: tr('Para escribir con honestidad necesitas saber que nadie te está mirando. Khōra es local-first: funciona sin cuentas obligatorias, sin nube y sin rastreadores.'),
        points: [
          {
            name: tr('Almacenamiento local'),
            text: tr('todo se guarda en tu dispositivo (o en tu propio servidor SQLite opcional si la autoalojas).')
          },
          {
            name: tr('Bloqueo rápido con PIN o contraseña'),
            text: tr('activa la bóveda en Configuración → Privacidad y bloqueo para cifrar tus datos si compartes dispositivo o quieres una capa extra de intimidad.')
          },
          {
            name: tr('Copias de seguridad'),
            text: tr('exporta o importa un archivo JSON cifrado o en texto cuando quieras cambiar de dispositivo o guardar un respaldo.')
          },
          {
            name: tr('Ayuda contextual (?)'),
            text: tr('en cualquier pantalla puedes pulsar el botón ? superior para ver instrucciones paso a paso de esa vista concreta.')
          }
        ],
        connection: tr('Puedes volver a abrir esta guía en cualquier momento desde Aprender o Configuración → Sobre Khōra.'),
        ctaLabel: tr('Abrir Configuración'),
        ctaAction: 'settings'
      }
    ];

    const activeSection = this.guideSection
      ? sections.find(s => s.id === this.guideSection) || null
      : null;

    if (activeSection) {
      container.innerHTML = `
        <div class="view-plain-shell">
          <div class="toolkit-header toolkit-header-compact" style="margin-bottom: 18px;">
            <div class="flex-between" style="flex-wrap: wrap; gap: 10px 16px;">
              <button type="button" class="btn-inline-link toolkit-back-btn" id="btn-guide-section-back">
                ${esc(tr('← Todas las secciones'))}
              </button>
            </div>
          </div>

          <article>
            <div style="margin-bottom: 10px;">
              <span class="cozy-meta-tag">${esc(tr('Guía de uso'))}</span>
            </div>
            <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); margin: 0 0 18px; line-height: 1.3;">
              ${esc(activeSection.title)}
            </h2>

            <div class="study-reading-body" style="color: var(--text-primary); font-size: 0.96rem; line-height: 1.7;">
              <p style="margin-bottom: 12px; line-height: 1.6;">${esc(activeSection.lead)}</p>
              <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-top: 14px; margin-bottom: 8px;">
                ${esc(tr('Qué encuentras y cuándo usarlo'))}
              </div>
              <ul style="padding-left: 20px; line-height: 1.6; display: grid; gap: 8px; margin-bottom: 12px;">
                ${activeSection.points.map(p => `<li><strong>${esc(p.name)}:</strong> ${esc(p.text)}</li>`).join('')}
              </ul>
              ${activeSection.connection ? `
                <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-top: 14px; margin-bottom: 6px;">
                  ${esc(tr('Cómo conecta con el resto'))}
                </div>
                <p style="margin-bottom: 4px; line-height: 1.6;">${esc(activeSection.connection)}</p>
              ` : ''}
            </div>
          </article>

          <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <div class="cozy-section-label" style="margin-bottom: 10px;">${esc(tr('Ir directamente'))}</div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button type="button" class="btn-secondary" id="btn-guide-jump" data-guide-view="${activeSection.ctaView || ''}" data-guide-action="${activeSection.ctaAction || ''}" style="font-size: 0.84rem;">
                ${esc(activeSection.ctaLabel)} →
              </button>
            </div>
          </div>

          <div class="toolkit-all-footer" style="margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn-inline-link" id="btn-guide-section-back-bottom">
              ${esc(tr('← Todas las secciones'))}
            </button>
          </div>
        </div>
      `;

      const goIndex = () => {
        this.guideSection = null;
        this.renderKhoraGuide();
        window.KhoraUtils?.scrollToTop?.();
      };
      container.querySelector('#btn-guide-section-back')?.addEventListener('click', goIndex);
      container.querySelector('#btn-guide-section-back-bottom')?.addEventListener('click', goIndex);
      container.querySelector('#btn-guide-jump')?.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.guideAction;
        const view = e.currentTarget.dataset.guideView;
        if (action === 'settings') {
          this.openSettingsModal();
        } else if (view) {
          this.navigate(view);
        }
      });
      return;
    }

    const appSections = sections.slice(0, 4);
    const privacySection = sections[4];
    const returnView = this.guideReturnView === 'readings' ? 'readings' : 'home';
    const backLabel = returnView === 'readings' ? tr('← Volver a Aprender') : tr('← Volver a Inicio');

    container.innerHTML = `
      <div class="view-plain-shell">
        <div class="toolkit-header toolkit-header-compact" style="margin-bottom: 14px;">
          <button type="button" class="btn-inline-link toolkit-back-btn" id="btn-guide-back-home">
            ${esc(backLabel)}
          </button>
        </div>

        <div class="card-header flex-between" style="margin-bottom: 18px;">
          <div>
            <h2 class="card-title" style="margin: 0;">${esc(tr('Guía de uso de Khōra'))}</h2>
            <p class="card-subtitle explanatory-subtext">${esc(tr('Índice de secciones para orientarte en la app a tu ritmo.'))}</p>
          </div>
        </div>

        <div class="study-index-groups">
          <section class="study-index-group">
            <div class="cozy-section-label">${esc(tr('Secciones de la app'))}</div>
            <div class="study-index-list">
              ${appSections.map(sec => `
                <button type="button" class="study-index-item" data-guide-section="${esc(sec.id)}">
                  <span class="study-index-item-title">${esc(sec.label)}</span>
                  <span class="study-index-arrow" aria-hidden="true">→</span>
                </button>
              `).join('')}
            </div>
          </section>

          ${privacySection ? `
            <section class="study-index-group">
              <div class="cozy-section-label">${esc(tr('Datos y privacidad'))}</div>
              <div class="study-index-list">
                <button type="button" class="study-index-item" data-guide-section="${esc(privacySection.id)}">
                  <span class="study-index-item-title">${esc(privacySection.label)}</span>
                  <span class="study-index-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    `;

    container.querySelector('#btn-guide-back-home')?.addEventListener('click', () => {
      this.navigate(returnView);
    });

    container.querySelectorAll('[data-guide-section]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.guideSection = btn.dataset.guideSection || null;
        this.renderKhoraGuide();
        window.KhoraUtils?.scrollToTop?.();
      });
    });
  }

  renderContextSubnav(groupId, activeSubView) {
    const subnavEl = document.getElementById('context-subnav');
    if (!subnavEl) return;

    const group = this.navGroups[groupId];
    if (!group || groupId === 'ahora-mismo' || group.items.length <= 1) {
      subnavEl.classList.add('hidden');
      subnavEl.innerHTML = '';
      return;
    }

    subnavEl.classList.remove('hidden');
    subnavEl.innerHTML = `
      <div class="context-subnav-inner">
        ${group.items.map(item => {
          const isActive = item.id === activeSubView;
          return `
            <button type="button" class="subnav-pill ${isActive ? 'active' : ''}" data-subnav-view="${item.id}">
              ${item.icon ?`<span>${item.icon}</span>` :''}
              <span>${item.label}</span>
            </button>
          `;
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
      this.navigate('home');
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
    document.getElementById('btn-exit-flow-immersive')?.addEventListener('click', () => {
      this.setFlowImmersive(false);
      this.navigate('home');
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
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Unified Contextual Help & ACT Glossary Triggers (.act-term -> #help-drawer)
  initGlossaryTooltips() {
    document.body.addEventListener('click', (e) => {
      const termEl = e.target.closest?.('.act-term[data-term]');
      if (!termEl) return;
      if (document.documentElement.getAttribute('data-act-concepts') === 'hide') return;
      e.preventDefault();
      e.stopPropagation();
      this.openHelpDrawer?.({ termKey: termEl.dataset.term });
    }, true);

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

    this.openModal('default');

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

  isAndroidDevice() {
    const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
    return /Android/i.test(ua);
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

  isAndroidUrlNoticeDismissed() {
    if (this.androidUrlNoticeDismissed) return true;
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem('act_android_url_notice_dismissed') === '1';
    } catch {
      return false;
    }
  }

  markAndroidUrlNoticeDismissed() {
    this.androidUrlNoticeDismissed = true;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('act_android_url_notice_dismissed', '1');
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

  getFeedbackContext() {
    const view = this.currentView || 'home';
    if (view === 'guide' && this.guideSection) {
      return `guide/${this.guideSection}`;
    }
    if (view === 'readings' && window.pildorasAnclajesApp) {
      if (window.pildorasAnclajesApp.activeReadingId) {
        return `readings/reading/${window.pildorasAnclajesApp.activeReadingId}`;
      }
      if (window.pildorasAnclajesApp.activeWorkshopId) {
        return `readings/workshop/${window.pildorasAnclajesApp.activeWorkshopId}`;
      }
    }
    return view;
  }

  initFeedbackGesture() {
    if (this._feedbackGestureBound || typeof window === 'undefined' || typeof document === 'undefined') return;
    this._feedbackGestureBound = true;

    let lastTriggeredAt = 0;
    const isBlocked = () => {
      if (Date.now() - lastTriggeredAt < 1500) return true;
      if (window.stateManager?.isVaultLocked?.()) return true;
      const modal = document.getElementById('app-modal');
      if (modal?.classList?.contains('active')) return true;
      const drawer = document.getElementById('help-drawer');
      if (drawer?.classList?.contains('open')) return true;
      return false;
    };

    const tr = (text) => (window.i18n?.translateText ? window.i18n.translateText(text) : text);

    let backdropEl = null;
    let indicatorEl = null;
    const ensureIndicator = () => {
      if (!backdropEl) {
        backdropEl = document.createElement('div');
        backdropEl.className = 'feedback-pull-backdrop';
        backdropEl.setAttribute('aria-hidden', 'true');
        document.body?.appendChild?.(backdropEl);
      }
      if (!indicatorEl) {
        indicatorEl = document.createElement('div');
        indicatorEl.className = 'feedback-pull-indicator pos-bottom';
        indicatorEl.setAttribute('aria-hidden', 'true');
        indicatorEl.innerHTML = `<img src="./icons/icon-192.svg" alt=""><span class="feedback-pull-label"></span>`;
        document.body?.appendChild?.(indicatorEl);
      }
      return { backdropEl, indicatorEl };
    };

    const updateIndicator = (progress, position = 'bottom') => {
      const { backdropEl: bg, indicatorEl: el } = ensureIndicator();
      const clamped = Math.max(0, Math.min(1, progress));
      const isReady = clamped >= 1;

      bg.classList.toggle('ready', isReady);
      bg.style.opacity = clamped > 0.08 ? (isReady ? '1' : String((clamped * 0.65).toFixed(2))) : '0';

      el.classList.toggle('pos-bottom', position === 'bottom');
      el.classList.toggle('pos-top', position === 'top');
      el.classList.toggle('ready', isReady);
      el.style.opacity = String(clamped > 0.08 ? Math.min(1, clamped * 1.15) : 0);

      const img = el.querySelector('img');
      if (img) {
        const deg = Math.round(clamped * 360);
        const gray = (1 - clamped).toFixed(2);
        const opa = (0.35 + 0.65 * clamped).toFixed(2);
        const scale = (0.9 + 0.1 * clamped).toFixed(2);
        img.style.filter = `grayscale(${gray}) opacity(${opa})`;
        img.style.transform = `rotate(${deg}deg) scale(${scale})`;
      }
      const label = el.querySelector('.feedback-pull-label');
      if (label) {
        label.textContent = isReady ? tr('Suelta para enviar feedback') : tr('Enviar feedback');
        if (!isReady) {
          label.style.opacity = String((0.25 + 0.75 * clamped).toFixed(2));
        } else {
          label.style.opacity = '1';
        }
      }
    };

    const hideIndicator = () => {
      if (backdropEl) {
        backdropEl.style.opacity = '0';
        backdropEl.classList.remove('ready');
      }
      if (indicatorEl) {
        indicatorEl.style.opacity = '0';
        indicatorEl.classList.remove('ready');
      }
    };

    // Mobile/touch only: pull-up on bottom nav bar OR long pull-down at top of page
    const NAV_PULL_THRESHOLD = 64;
    const TOP_PULL_THRESHOLD = 120;
    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartedInNav = false;
    let touchAtTop = false;
    let currentProgress = 0;

    document.addEventListener('touchstart', (e) => {
      currentProgress = 0;
      if (isBlocked() || !e.touches || e.touches.length !== 1) {
        touchStartedInNav = false;
        touchAtTop = false;
        return;
      }
      const t = e.touches[0];
      touchStartY = t.clientY;
      touchStartX = t.clientX;
      touchStartedInNav = Boolean(e.target?.closest?.('.app-nav'));
      const scrollTop = window.scrollY || document.documentElement?.scrollTop || 0;
      touchAtTop = scrollTop <= 2;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if ((!touchStartedInNav && !touchAtTop) || !e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      const deltaY = t.clientY - touchStartY;
      const deltaX = t.clientX - touchStartX;
      const isVertical = Math.abs(deltaY) > Math.abs(deltaX) * 1.4;
      if (!isVertical) {
        currentProgress = 0;
        hideIndicator();
        return;
      }

      if (touchStartedInNav && deltaY < -10) {
        currentProgress = Math.min(1, Math.abs(deltaY) / NAV_PULL_THRESHOLD);
        updateIndicator(currentProgress, 'bottom');
      } else if (touchAtTop && !touchStartedInNav && deltaY > 18) {
        currentProgress = Math.min(1, deltaY / TOP_PULL_THRESHOLD);
        updateIndicator(currentProgress, 'top');
      } else {
        currentProgress = 0;
        hideIndicator();
      }
    }, { passive: true });

    const finishTouch = () => {
      const shouldOpen = currentProgress >= 1 && !isBlocked();
      currentProgress = 0;
      touchStartedInNav = false;
      touchAtTop = false;
      hideIndicator();
      if (shouldOpen) {
        lastTriggeredAt = Date.now();
        this.openFeedbackModal();
      }
    };

    document.addEventListener('touchend', finishTouch, { passive: true });
    document.addEventListener('touchcancel', () => {
      currentProgress = 0;
      touchStartedInNav = false;
      touchAtTop = false;
      hideIndicator();
    }, { passive: true });
  }

  openFeedbackModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const t = (text) => (window.i18n?.translateText ? window.i18n.translateText(text) : text);
    const esc = window.KhoraUtils?.escapeHtml || ((v) => String(v ?? ''));
    const viewContext = this.getFeedbackContext();

    modalBody.innerHTML = `
      <div id="feedback-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
            <h3 class="card-title">Enviar Feedback o Sugerencia</h3>
            <p class="card-subtitle mt-1" style="line-height: 1.45;">
              Comparte cualquier idea de mejora, fallo detectado o comentario sobre tu experiencia con Khōra. No necesitas cuenta.
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

        <label style="display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 0.82rem; color: var(--text-secondary); cursor: pointer;">
          <input type="checkbox" id="feedback-include-context" checked>
          <span>El feedback tiene que ver con donde estaba</span>
          <code style="font-size: 0.74rem; color: var(--text-muted);">#${esc(viewContext)}</code>
        </label>

        <input type="text" id="feedback-website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none;">

        <div id="feedback-status" class="hidden" style="margin-top: 10px; font-size: 0.82rem; color: var(--terracotta-700, #9a4a35); line-height: 1.4;"></div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button type="button" class="btn-primary" id="btn-feedback-submit" style="width: 100%; justify-content: center;">
            Enviar feedback
          </button>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-secondary" id="btn-feedback-copy" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              Copiar mensaje
            </button>
            <button type="button" class="btn-secondary" id="btn-feedback-github" style="flex: 1; justify-content: center; font-size: 0.82rem;">
              GitHub Issues
            </button>
            <button type="button" class="btn-secondary" id="btn-feedback-cancel" style="font-size: 0.82rem;">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;

    this.openModal('default');

    const buildFormatted = () => {
      const type = document.getElementById('feedback-type')?.value || 'Sugerencia o nueva idea';
      const rawTitle = document.getElementById('feedback-title')?.value?.trim() || '';
      const rawBody = document.getElementById('feedback-message')?.value?.trim() || '';
      const title = rawTitle || 'Feedback Khōra';
      const lang = window.i18n?.getLang?.() || 'es';
      const mode = window.stateManager?.getStorageMode?.() || 'local';
      const issueTitle = `[Feedback] ${title}`;
      const includeContext = Boolean(document.getElementById('feedback-include-context')?.checked);
      const metaLine = includeContext
        ? `Khōra · view: #${viewContext} · lang: ${lang} · mode: ${mode}`
        : `Khōra · lang: ${lang} · mode: ${mode}`;
      const issueBody = [
        `**${type}**`,
        '',
        rawBody || '(Sin descripción adicional)',
        '',
        '---',
        metaLine
      ].join('\n');
      return { type, rawTitle, rawBody, lang, mode, issueTitle, issueBody };
    };

    const showStatusError = (msg) => {
      const el = document.getElementById('feedback-status');
      if (!el) return;
      el.textContent = t(msg);
      el.classList?.remove('hidden');
    };

    document.getElementById('btn-feedback-x')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-feedback-cancel')?.addEventListener('click', () => this.closeModal());

    document.getElementById('btn-feedback-submit')?.addEventListener('click', async () => {
      const submitBtn = document.getElementById('btn-feedback-submit');
      const statusEl = document.getElementById('feedback-status');
      statusEl?.classList?.add('hidden');

      const { type, rawTitle, rawBody, lang, mode } = buildFormatted();
      if (!rawTitle && !rawBody) {
        showStatusError('Escribe un título o detalle antes de enviar');
        return;
      }

      const website = document.getElementById('feedback-website')?.value || '';
      window.KhoraUI?.buttonInlineState?.(submitBtn, 'pending', t('Enviando…'));

      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            title: rawTitle,
            message: rawBody,
            lang,
            mode,
            website
          })
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        window.KhoraUI?.buttonInlineState?.(submitBtn, 'ok', t('✓ Enviado'), {
          resetMs: 1200,
          onDone: () => this.closeModal()
        });
      } catch {
        window.KhoraUI?.buttonInlineState?.(submitBtn, 'reset');
        showStatusError('No se pudo enviar automáticamente. Puedes usar «Copiar mensaje» o «GitHub Issues».');
      }
    });

    document.getElementById('btn-feedback-github')?.addEventListener('click', () => {
      const { issueTitle, issueBody } = buildFormatted();
      const url = `https://github.com/${KHORA_CREDITS.githubUser}/${KHORA_CREDITS.repoName}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
      window.open?.(url, '_blank', 'noopener,noreferrer');
    });

    document.getElementById('btn-feedback-copy')?.addEventListener('click', async () => {
      const copyBtn = document.getElementById('btn-feedback-copy');
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
        window.KhoraUI?.buttonInlineState?.(copyBtn, 'ok', t('✓ Copiado'));
      } catch {
        window.KhoraUI?.buttonInlineState?.(copyBtn, 'error', t('No se pudo copiar'));
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
    if (!banner || !window.stateManager) return;

    const status = window.stateManager.getDbStatus();
    const mode = status.mode || window.stateManager.getStorageMode();
    const serverAvailable = Boolean(status.serverAvailable);
    const serverChecked = Boolean(status.serverChecked);
    const standalone = this.isStandalonePWA();
    const isMobile = this.isMobileOrTabletDevice();
    const isAndroid = this.isAndroidDevice();
    const vaultLocked = Boolean(window.stateManager.isVaultLocked?.());
    const usingLocalOnly = serverChecked && (!serverAvailable || mode === 'local');

    // Only show the top warning banner on mobile when opened in a regular browser tab (not installed as PWA).
    // On desktop or installed PWA, the first-visit confirmation modal handles local-storage awareness.
    if (usingLocalOnly && !this.isBannerDismissed() && isMobile && !standalone) {
      banner.classList.remove('hidden', 'persistence-warning-banner--info');
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
        this.showToast('Aviso ocultado — puedes instalar Khōra en tu pantalla de inicio desde el menú del navegador');
      });
      return;
    }

    // One-time calm info notice for Android standalone PWA users about Chrome's URL notification
    if (isAndroid && standalone && !vaultLocked && !this.isAndroidUrlNoticeDismissed()) {
      banner.classList.remove('hidden');
      banner.classList.add('persistence-warning-banner--info');
      banner.innerHTML = `
        <span>
          <strong>Aviso normal de Chrome en Android:</strong> la notificación «Toca para copiar la URL de esta aplicación» aparece siempre al abrir cualquier app web (PWA). Puedes ocultarla manteniendo pulsada la notificación y desactivando solo ese canal.
        </span>
        <div class="persistence-warning-actions">
          <button type="button" class="btn-secondary" id="btn-banner-android-url-ok" style="font-size: 0.76rem; padding: 5px 10px;">
            Entendido
          </button>
          <button type="button" class="btn-icon" id="btn-banner-android-url-dismiss" aria-label="Ocultar aviso" style="width: 28px; height: 28px; font-size: 0.75rem;">✕</button>
        </div>
      `;
      const dismissAndroidNotice = () => {
        this.markAndroidUrlNoticeDismissed();
        banner.classList.add('hidden');
        banner.classList.remove('persistence-warning-banner--info');
        banner.innerHTML = '';
      };
      document.getElementById('btn-banner-android-url-ok')?.addEventListener('click', dismissAndroidNotice);
      document.getElementById('btn-banner-android-url-dismiss')?.addEventListener('click', dismissAndroidNotice);
      return;
    }

    banner.classList.add('hidden');
    banner.classList.remove('persistence-warning-banner--info');
    banner.innerHTML = '';
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
    const isAndroid = this.isAndroidDevice();

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
            <p style="font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45; margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid rgba(87, 139, 116, 0.25);">
              <strong>Aviso normal de Chrome en Android:</strong> la notificación «Toca para copiar la URL de esta aplicación» aparece siempre al abrir cualquier app web (PWA). Puedes ocultarla manteniendo pulsada la notificación y desactivando solo ese canal.
            </p>
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

      this.openModal('default');

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
    const showAndroidUrlNote = isAndroid && standalone;
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
<li>Exporta una copia JSON periódicamente desde el botón inferior o desde <strong>Configuración</strong>.</li>
<li>Puedes activar cifrado AES-256 con PIN/contraseña o conectar un servidor SQLite propio desde<strong>Configuración</strong>.</li>
${showAndroidUrlNote ? `
<li><strong>Aviso normal de Chrome en Android:</strong> la notificación «Toca para copiar la URL de esta aplicación» aparece siempre al abrir cualquier app web (PWA). Puedes ocultarla manteniendo pulsada la notificación y desactivando solo ese canal.</li>
` : ''}
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

    this.openModal('default');

    document.getElementById('btn-gate-close-x')?.addEventListener('click', () => {
      this.markInstallGateDismissed();
      this.markBannerDismissed();
      if (showAndroidUrlNote) this.markAndroidUrlNoticeDismissed();
      this.closeModal();
      this.updatePersistenceWarningBanner();
    });

    document.getElementById('btn-gate-export-first')?.addEventListener('click', () => {
      this.triggerQuickBackupShareOrDownload();
    });

    document.getElementById('btn-gate-open-settings')?.addEventListener('click', () => {
      this.markInstallGateDismissed();
      this.markBannerDismissed();
      if (showAndroidUrlNote) this.markAndroidUrlNoticeDismissed();
      this.updatePersistenceWarningBanner();
      this.openSettingsModal();
    });

    document.getElementById('btn-gate-continue-anyway')?.addEventListener('click', () => {
      this.markInstallGateDismissed();
      this.markBannerDismissed();
      if (showAndroidUrlNote) this.markAndroidUrlNoticeDismissed();
      this.closeModal();
      this.updatePersistenceWarningBanner();
    });
  }

  applyPwaUpdate(reg, applyBtn = null, toastEl = null) {
    const t = (text) => (window.i18n?.translateText ? window.i18n.translateText(text) : text);
    if (applyBtn) {
      applyBtn.disabled = true;
      applyBtn.textContent = t('Actualizando…');
    }
    this.swUpdateRequested = true;

    (async () => {
      try {
        await window.state?.flushPendingWrites?.(4000);
      } catch {
        // Proceed with update even if flush encounters an error
      }

      if (reg?.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
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
    })();

    if (toastEl) {
      toastEl.querySelector('#btn-pwa-dismiss-update')?.addEventListener('click', () => {
        toastEl.remove();
      });
    }
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
    applyBtn?.addEventListener('click', () => {
      this.applyPwaUpdate(registration, applyBtn, toast);
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
          this.swRegistration = reg;
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
