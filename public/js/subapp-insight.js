/**
 * ECOSISTEMA ACT - Sub-App 3: El Panel de Insight
 * Analítica, Métricas de Flexibilidad Psicológica, Hexaflex de Steven Hayes, Re-análisis e Historial
 */

class InsightApp {
  constructor() {
    this.activeInsightTab = 'terapia'; // 'terapia' | 'graficos' | 'historial'
    this.filterType = 'all'; // 'all' | 'paz_falsa' | 'act_crisis' | 'pending_integration'
    this.emotionFilter = 'all'; // 'all' | 'miedo' | 'ira' | 'tristeza' | 'agotamiento' | 'aversion' | 'sorpresa' | 'alegria' | 'exact:<id>'
    this.contextFilter = 'all'; // 'all' | 'Pareja' | 'Trabajo' | 'Familia' | 'Amigos' | 'Otro'
    this.historySearchQuery = '';
    this.pendingTherapyDraft = '';
    this.pendingTherapyContext = '';
    this.therapyFilter = 'all'; // 'all' | 'pending' | 'discussed'
    this.activeFollowUpId = null;
    this.activeFollowUpType = null;
  }

  init() {
    this.render();
    this.bindEvents();
    window.addEventListener('resize', () => {
      if (this.activeInsightTab === 'graficos') {
        this.drawCharts();
      }
    });
    window.addEventListener('khora:themechange', () => {
      const container = document.getElementById('insight-view');
      if (this.activeInsightTab === 'graficos' && container && !container.classList.contains('hidden')) {
        this.drawCharts();
      }
    });
  }

  render() {
    const container = document.getElementById('insight-view');
    if (!container) return;

    const analytics = window.stateManager.getAnalytics();
    const pfEntries = window.stateManager.getPazFalsaEntries();
    const actEntries = window.stateManager.getActCrisisEntries();
    const hexHistory = window.stateManager.getHexaflexHistory();
    const latestHex = hexHistory.length > 0 ? hexHistory[0] : null;
    const therapyReflections = window.stateManager.getTherapyReflections();

    let tabContentHtml = '';
    if (this.activeInsightTab === 'graficos') {
      tabContentHtml = this.renderGraficosTab(latestHex);
    } else if (this.activeInsightTab === 'historial') {
      tabContentHtml = this.renderHistorialTab(pfEntries, actEntries);
    } else if (this.activeInsightTab === 'actividad') {
      tabContentHtml = this.renderRecentActivitySection();
    } else {
      tabContentHtml = this.renderTherapyReflectionsSection(therapyReflections);
    }

    container.innerHTML = `
      <!-- KPI Top Summary -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-number">${analytics.totalPf}</div>
          <div class="kpi-label">Falsa Paz Registrada</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-number">${analytics.avgTollScore}<small style="font-size: 1rem;">/100</small></div>
          <div class="kpi-label">Índice Autoabandono</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-number">${analytics.valueChoiceRatio}%</div>
          <div class="kpi-label">Elección por Valores</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-number">-${analytics.avgDefusionReduction}</div>
          <div class="kpi-label">Reducción Media Crisis</div>
        </div>
      </div>

      ${tabContentHtml}
    `;

    if (this.activeInsightTab === 'graficos') {
      setTimeout(() => this.drawCharts(), 50);
    }
  }

  renderGraficosTab(latestHex) {
    return `
      <div class="insight-charts-grid">
        <!-- Steven Hayes Hexaflex Radar Assessment Card -->
        <div class="card">
          <div class="card-header flex-between" style="flex-wrap: wrap; gap: 8px;">
            <div class="title-with-help">
              <h3 class="card-title" style="margin: 0;">Perfil de Flexibilidad Psicológica (Hexaflex)</h3>
              <button type="button" class="help-info-trigger" data-help-topic="hexaflex-perfil" aria-label="Información de esta herramienta">?</button>
            </div>
            <button type="button" class="btn-primary" id="btn-open-hexaflex-modal" style="font-size: 0.82rem; padding: 6px 14px;">
              Evaluar mi Hexaflex
            </button>
          </div>

          <div class="chart-wrapper" style="height: 280px;">
            <canvas id="hexaflex-chart"></canvas>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; text-align: center; font-size: 0.78rem;">
            <div style="background: var(--bg-surface-elevated); padding: 8px; border-radius: var(--radius-sm);">
              <strong>1. Aceptación</strong><br><span style="color: var(--sage-700); font-weight: 700;">${latestHex ? latestHex.scores.acceptance + '/10' : '—'}</span>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 8px; border-radius: var(--radius-sm);">
              <strong>2. Defusión</strong><br><span style="color: var(--sage-700); font-weight: 700;">${latestHex ? latestHex.scores.defusion + '/10' : '—'}</span>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 8px; border-radius: var(--radius-sm);">
              <strong>3. Presente</strong><br><span style="color: var(--sage-700); font-weight: 700;">${latestHex ? latestHex.scores.present + '/10' : '—'}</span>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 8px; border-radius: var(--radius-sm);">
              <strong>4. Yo Contexto</strong><br><span style="color: var(--sage-700); font-weight: 700;">${latestHex ? latestHex.scores.context + '/10' : '—'}</span>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 8px; border-radius: var(--radius-sm);">
              <strong>5. Valores</strong><br><span style="color: var(--sage-700); font-weight: 700;">${latestHex ? latestHex.scores.values + '/10' : '—'}</span>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 8px; border-radius: var(--radius-sm);">
              <strong>6. Acción</strong><br><span style="color: var(--sage-700); font-weight: 700;">${latestHex ? latestHex.scores.action + '/10' : '—'}</span>
            </div>
          </div>
        </div>

        <div class="insight-charts-right-col">
          <!-- Charts Section: Macro Trends -->
          <div class="card">
            <div class="card-header">
              <div class="title-with-help">
                <h3 class="card-title" style="margin: 0;">Tendencias Emocionales y Evolución</h3>
                <button type="button" class="help-info-trigger" data-help-topic="tendencias-evolucion" aria-label="Información de esta herramienta">?</button>
              </div>
            </div>

            <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; font-size: 0.8rem; color: var(--text-muted);">
              <span style="display: flex; align-items: center; gap: 6px;">
<span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--sage-500); display: inline-block;"></span>
                Eficacia Defusión (Intensidad inicial)
              </span>
              <span style="display: flex; align-items: center; gap: 6px;">
<span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--accent-warmth); display: inline-block;"></span>
                Peaje de Autoabandono
              </span>
              <span style="display: flex; align-items: center; gap: 6px;">
<span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--accent-tension); display: inline-block;"></span>
                Resentimiento Acumulado
              </span>
            </div>

            <div class="chart-wrapper">
              <canvas id="timeline-chart"></canvas>
            </div>
          </div>

          <!-- Context Heatmap -->
          <div class="card">
            <div class="card-header flex-between" style="flex-wrap: wrap; gap: 8px;">
              <div class="title-with-help">
                <h3 class="card-title" style="margin: 0;">Mapa de Calor por Contextos (Sumisión Emocional)</h3>
                <button type="button" class="help-info-trigger" data-help-topic="mapa-calor-contextos" aria-label="Información de esta herramienta">?</button>
              </div>
              <button type="button" class="btn-secondary" id="btn-insight-go-anchors" style="font-size: 0.76rem; padding: 5px 11px;">
                Gestionar Tarjetas de Anclaje →
              </button>
            </div>
            <div class="chart-wrapper" style="height: 200px;">
              <canvas id="context-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRecentActivitySection() {
    const profile = window.stateManager.getProfile?.() || {};
    const log = (profile.progressLog || []).slice(0, 8);
    const hasExampleActivity = log.some(entry => window.stateManager?.isExampleItem?.(entry));
    const typeIcons = {
      challenge_added:'',
      challenge_status:'',
      concern_changed:'',
      barrier_toggled:'',
      passenger_added:'',
      passenger_status:'',
      manual_note:'',
      values_updated:''
    };

    return `
      <div class="card mt-4">
        <div class="card-header" style="margin-bottom: 12px;">
          <div class="title-with-help">
<h3 class="card-title" style="margin: 0;">Actividad Reciente y Micro-Victorias</h3>
            <button type="button" class="help-info-trigger" data-help-topic="resumen-progresion" aria-label="Información de esta herramienta">?</button>
          </div>
        </div>

        ${hasExampleActivity ? `
          <div class="example-notice-bar">
            <span>Hay actividad de ejemplo en este historial. Puedes quitar los ejemplos cuando quieras.</span>
            <button type="button" class="btn-secondary" data-clear-examples="true" style="font-size: 0.75rem; padding: 4px 10px;">
              Quitar ejemplos
            </button>
          </div>
        ` : ''}

        ${log.length > 0 ? `
          <div style="border-left: 2px solid var(--border-subtle); padding-left: 14px; margin-left: 6px; margin-bottom: 14px;">
            ${log.map(entry => {
              const date = new Date(entry.date);
              const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
              const icon = typeIcons[entry.type] || '•';
              const isExample = window.stateManager?.isExampleItem?.(entry);
              return `
                <div style="position: relative; padding-bottom: 8px;">
                  <span style="position: absolute; left: -21px; top: 4px; width: 10px; height: 10px; background: var(--sage-400); border-radius: 50%;"></span>
                  <span style="font-size: 0.68rem; color: var(--text-muted);">${dateStr}</span>
                  ${isExample ? '<span class="badge example-item-badge" style="margin-left: 6px;">Ejemplo guía</span>' : ''}
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 1px 0 0;"><span>${icon}</span> <span>${this.escapeHtml(entry.note)}</span></p>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 12px;">
            Aún no hay actividad registrada. Tus cambios de foco, valores y notas irán apareciendo aquí.
          </p>
        `}

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <input type="text" id="input-progress-note" class="form-input" style="flex: 1; min-width: 200px; font-size: 0.84rem; padding: 8px 12px;" placeholder="Añadir aprendizaje o micro-victoria...">
<button type="button" class="btn-secondary" id="btn-add-progress-note" style="font-size: 0.8rem; padding: 8px 14px; white-space: nowrap;">Anotar</button>
        </div>
      </div>
    `;
  }

  getEmotionFamilyKeywords() {
    return {
      miedo: ['miedo', 'ansiedad', 'pánico', 'inseguridad', 'rechazo', 'sumisión', 'desamparo', 'vulnerabilidad', 'fear', 'anxiety', 'panic'],
      ira: ['ira', 'rabia', 'frustración', 'resentimiento', 'indignación', 'irritabilidad', 'celos', 'envidia', 'herido', 'ofensa', 'anger', 'resentment', 'frustration'],
      tristeza: ['tristeza', 'pena', 'duelo', 'soledad', 'culpa', 'vergüenza', 'desesperanza', 'vacío', 'melancolía', 'sadness', 'guilt', 'shame'],
      agotamiento: ['agotamiento', 'hastío', 'desbordamiento', 'parálisis', 'anestesia', 'exhaustion', 'overwhelm'],
      aversion: ['aversión', 'repulsión', 'asco', 'desprecio', 'decepción', 'desaprobación', 'traición', 'menosprecio', 'hastío', 'aversion', 'disappointment'],
      sorpresa: ['sorpresa', 'conmoción', 'shock', 'desconcierto', 'desbordamiento', 'parálisis', 'indecisión', 'anestesia', 'extrañeza'],
      alegria: ['alegría', 'gozo', 'serenidad', 'alivio', 'gratitud', 'esperanza', 'compasión', 'dignidad', 'firmeza', 'paz', 'joy', 'relief', 'peace']
    };
  }

  matchesEmotionFilter(item, filterVal) {
    if (!filterVal || filterVal === 'all') return true;
    if (item.type === 'act_crisis') {
      const emStr = String(item.data.emotion || '').toLowerCase();
      const emList = Array.isArray(item.data.emotions) ? item.data.emotions.map(x => String(x).toLowerCase()) : [];
      const hay = [emStr, ...emList].join(' ');
      if (filterVal.startsWith('exact:')) {
        const target = filterVal.slice(6).toLowerCase();
        return emList.includes(target) || emStr.includes(target);
      }
      const keywords = this.getEmotionFamilyKeywords()[filterVal] || [];
      return keywords.some(kw => hay.includes(kw));
    }
    if (item.type === 'paz_falsa') {
      if (filterVal.startsWith('exact:')) {
        const target = filterVal.slice(6).toLowerCase();
        const noteHay = `${item.data.situation || ''} ${item.data.note || ''}`.toLowerCase();
        if (target.includes('ansiedad') || target.includes('miedo')) return (item.data.toll?.anxiety || 0) >= 6;
        if (target.includes('resentimiento') || target.includes('ira')) return (item.data.toll?.resentment || 0) >= 6;
        return noteHay.includes(target);
      }
      const toll = item.data.toll || {};
      if (filterVal === 'miedo') return (toll.anxiety || 0) >= 6;
      if (filterVal === 'ira') return (toll.resentment || 0) >= 6;
      if (filterVal === 'tristeza') return (toll.emptiness || 0) >= 6;
      if (filterVal === 'agotamiento') return (toll.physicalExhaustion || 0) >= 6;
      return false;
    }
    return false;
  }

  getFilteredHistoryItems(pfEntries, actEntries) {
    const combined = [];

    if (this.filterType === 'all' || this.filterType === 'paz_falsa' || this.filterType === 'pending_integration') {
      pfEntries.forEach(entry => {
        combined.push({ type: 'paz_falsa', id: entry.id, timestamp: entry.timestamp, data: entry });
      });
    }

    if (this.filterType === 'all' || this.filterType === 'act_crisis' || this.filterType === 'pending_integration') {
      actEntries.forEach(entry => {
        combined.push({ type: 'act_crisis', id: entry.id, timestamp: entry.timestamp, data: entry });
      });
    }

    const q = (this.historySearchQuery || '').trim().toLowerCase();
    const filtered = combined.filter(item => {
      if (this.filterType === 'pending_integration' && item.data.followUpNotes && item.data.followUpNotes.length > 0) {
        return false;
      }
      if (!this.matchesEmotionFilter(item, this.emotionFilter)) {
        return false;
      }
      if (this.contextFilter && this.contextFilter !== 'all') {
        if (item.type === 'paz_falsa') {
          if ((item.data.context || '') !== this.contextFilter) return false;
        } else {
          // ACT Space entries do not enforce context field unless saved inside passenger/value
          const actHay = `${item.data.valueChosen || ''} ${item.data.committedAction || ''} ${item.data.thought || ''}`.toLowerCase();
          if (!actHay.includes(this.contextFilter.toLowerCase())) return false;
        }
      }
      if (q) {
        const d = item.data;
        const fields = item.type === 'paz_falsa'
          ? [d.context, d.situation, d.note, d.internalConflict?.wanted, d.internalConflict?.did]
          : [d.emotion, d.thought, d.reframedThought, d.valueChosen, d.committedAction, d.carriedPassenger, ...(d.bodyZones || []), ...(d.emotions || [])];
        const rawText = fields.filter(Boolean).join(' ').toLowerCase();
        const trText = fields.filter(Boolean).map(f => window.i18n?.translateText?.(f) || f).join(' ').toLowerCase();
        if (!rawText.includes(q) && !trText.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => b.timestamp - a.timestamp);
    return filtered;
  }

  renderHistorialTab(pfEntries, actEntries) {
    const distinctEmotions = [];
    const seenEm = new Set();
    actEntries.forEach(e => {
      const list = Array.isArray(e.emotions) && e.emotions.length ? e.emotions : String(e.emotion || '').split(',').map(x => x.trim()).filter(Boolean);
      list.forEach(em => {
        if (em && !seenEm.has(em.toLowerCase())) {
          seenEm.add(em.toLowerCase());
          distinctEmotions.push(em);
        }
      });
    });

    const familyChips = [
      { id: 'all', label: 'Todas las emociones' },
      { id:'miedo', label:'Miedo / Ansiedad' },
      { id:'ira', label:'Ira / Resentimiento' },
      { id:'tristeza', label:'Tristeza / Culpa' },
      { id:'agotamiento', label:'Agotamiento' },
      { id:'aversion', label:'Aversión' },
      { id:'sorpresa', label:'Bloqueo' }
    ];

    const filteredItems = this.getFilteredHistoryItems(pfEntries, actEntries);
    const hasExtraFilters = this.emotionFilter !== 'all' || this.contextFilter !== 'all' || Boolean((this.historySearchQuery || '').trim());

    return `
      <!-- History & Re-analysis Section -->
      <div class="view-plain-shell">
        <div class="card-header flex-between" style="flex-wrap: wrap; gap: 10px;">
          <p class="card-subtitle" style="margin: 0;">Vuelve a tus registros pasados para integrar perspectiva en frío o filtra por emoción y ámbito</p>

          <!-- Entry Type Filter Pills -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="badge filter-btn ${this.filterType === 'all' ? 'active' : ''}" data-filter="all" style="cursor: pointer; border: 1px solid var(--border-subtle); background: ${this.filterType === 'all' ? 'var(--sage-500)' : 'var(--bg-surface)'}; color: ${this.filterType === 'all' ? '#fff' : 'inherit'};">
              Todos
            </button>
            <button type="button" class="badge filter-btn ${this.filterType === 'pending_integration' ? 'active' : ''}" data-filter="pending_integration" style="cursor: pointer; border: 1px solid var(--border-subtle); background: ${this.filterType === 'pending_integration' ? '#c98a58' : 'var(--bg-surface)'}; color: ${this.filterType === 'pending_integration' ? '#fff' : 'inherit'};">
              Pendientes de integrar
            </button>
            <button type="button" class="badge filter-btn ${this.filterType === 'paz_falsa' ? 'active' : ''}" data-filter="paz_falsa" style="cursor: pointer; border: 1px solid var(--border-subtle); background: ${this.filterType === 'paz_falsa' ? 'var(--accent-warmth)' : 'var(--bg-surface)'}; color: ${this.filterType === 'paz_falsa' ? '#fff' : 'inherit'};">
              Paz Falsa
            </button>
            <button type="button" class="badge filter-btn ${this.filterType === 'act_crisis' ? 'active' : ''}" data-filter="act_crisis" style="cursor: pointer; border: 1px solid var(--border-subtle); background: ${this.filterType === 'act_crisis' ? 'var(--sage-600)' : 'var(--bg-surface)'}; color: ${this.filterType === 'act_crisis' ? '#fff' : 'inherit'};">
              Espacio ACT
            </button>
          </div>
        </div>

        <!-- Retrospective Emotion, Context & Search Filter Bar -->
        <div class="history-retro-filter-box">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
            Explorar por emoción sentida (para reflexionar a pasado):
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">
            ${familyChips.map(fc => `
              <button type="button" class="quick-fill-chip history-emotion-chip ${this.emotionFilter === fc.id ? 'active' : ''}" data-history-emotion="${fc.id}">
                ${fc.label}
              </button>
            `).join('')}
            ${distinctEmotions.map(em => `
              <button type="button" class="quick-fill-chip history-emotion-chip ${this.emotionFilter === 'exact:' + em ? 'active' : ''}" data-history-emotion="exact:${this.escapeHtml(em)}">
                ${this.escapeHtml(em)}
              </button>
            `).join('')}
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 8px; align-items: center;">
            <input type="text" id="history-search-input" class="form-input" style="padding: 7px 12px; font-size: 0.82rem;"
                   placeholder="Buscar por emoción, pensamiento o situación..." value="${this.escapeHtml(this.historySearchQuery)}">
            <select id="history-context-select" class="form-select" style="padding: 7px 12px; font-size: 0.82rem;">
              <option value="all" ${this.contextFilter === 'all' ? 'selected' : ''}>Todos los ámbitos</option>
              <option value="Pareja" ${this.contextFilter === 'Pareja' ? 'selected' : ''}>Pareja</option>
              <option value="Trabajo" ${this.contextFilter === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
              <option value="Familia" ${this.contextFilter === 'Familia' ? 'selected' : ''}>Familia</option>
              <option value="Amigos" ${this.contextFilter === 'Amigos' ? 'selected' : ''}>Amigos</option>
              <option value="Otro" ${this.contextFilter === 'Otro' ? 'selected' : ''}>Otro</option>
            </select>
          </div>

          ${hasExtraFilters ? `
<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
              <span style="font-size: 0.78rem; color: var(--sage-700); font-weight: 700;">
                Mostrando ${filteredItems.length} registro(s) con este filtro
              </span>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${filteredItems.length > 0 ? `
                  <button type="button" class="btn-primary" id="btn-history-to-therapy" style="font-size: 0.76rem; padding: 5px 11px;">
                    Reflexionar sobre este patrón en Cuaderno de Terapia
                  </button>
                ` : ''}
                <button type="button" class="btn-secondary" id="btn-clear-history-filters" style="font-size: 0.76rem; padding: 5px 10px;">
                  ✕ Limpiar filtros
                </button>
              </div>
            </div>
          ` : ''}
        </div>

        <div id="history-list-container">
          ${[...pfEntries, ...actEntries].some(x => window.stateManager?.isExampleItem?.(x)) ? `
            <div class="example-notice-bar">
<span>Este historial contiene registros de demostración/ejemplo para probar los gráficos y el re-análisis.</span>
              <button type="button" class="btn-secondary" data-clear-examples="true" style="font-size: 0.75rem; padding: 4px 10px;">
                Quitar ejemplos
              </button>
            </div>
          ` : ''}
          <div class="history-items-grid">
            ${this.renderHistoryList(pfEntries, actEntries, filteredItems)}
          </div>
        </div>
      </div>

      <!-- Discreet Settings Link -->
<div style="margin-top: 14px; padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated); display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
        <span class="explanatory-subtext" style="font-size: 0.82rem; color: var(--text-secondary);">
          Los ajustes de base de datos SQLite, copias de seguridad (.db / JSON) y tema están en el icono de Configuración superior.
        </span>
        <button type="button" class="btn-secondary" id="btn-open-storage-modal" style="font-size: 0.8rem; padding: 7px 12px;">
          Abrir Configuración y Copias
        </button>
      </div>
    `;
  }

  renderHistoryList(pfEntries, actEntries, prefiltered = null) {
    const filteredCombined = Array.isArray(prefiltered)
      ? prefiltered
      : this.getFilteredHistoryItems(pfEntries, actEntries);

    if (filteredCombined.length === 0) {
      return `
        <div style="text-align: center; padding: 30px; color: var(--text-muted); font-size: 0.9rem; grid-column: 1 / -1;">
          ${this.filterType === 'pending_integration'
            ?'¡Todo al día! No tienes registros pendientes de valorar en frío.'
            : (this.emotionFilter !== 'all' || this.contextFilter !== 'all' || (this.historySearchQuery || '').trim()
              ? 'No hay episodios guardados que coincidan con este filtro.'
              : 'No hay registros aún. Completa una sesión en "Paz Falsa" o en "Espacio ACT", o carga "Cargar Datos Demo" desde Configuración para probar.')}
        </div>
      `;
    }

    return filteredCombined.map(item => {
      const dateStr = new Date(item.timestamp).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const isIntegrated = item.data.followUpNotes && item.data.followUpNotes.length > 0;
      const integrationBadge = isIntegrated
        ?`<span class="badge" style="background: rgba(74, 122, 102, 0.2); color: var(--sage-700); font-size: 0.7rem;">Valorado e integrado (${item.data.followUpNotes.length})</span>`
        :`<span class="badge" style="background: rgba(201, 138, 88, 0.18); color: #c98a58; font-size: 0.7rem;">Pendiente de valorar en frío</span>`;

      if (item.type === 'paz_falsa') {
        const e = item.data;
        const toll = e.toll || {};
        return `
          <div class="history-item">
            <div class="history-header" style="flex-wrap: wrap; gap: 6px;">
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <span class="history-tag paz-falsa">Paz Falsa • ${e.context}</span>
                ${window.stateManager?.isExampleItem?.(e) ?'<span class="badge example-item-badge">Ejemplo guía</span>' :''}
                ${integrationBadge}
              </div>
              <span class="history-date">${dateStr}</span>
            </div>
            <div class="history-title">"${e.situation || 'Sin descripción'}"</div>
            <div class="history-detail">
              <strong>Lo que quería:</strong> ${e.internalConflict?.wanted || '—'}<br>
              <strong>Lo que cedí:</strong> ${e.internalConflict?.did || '—'}
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
              <span class="badge" style="background: rgba(184, 107, 89, 0.15); color: var(--accent-tension);">Resentimiento: ${toll.resentment || 0}/10</span>
              <span class="badge" style="background: rgba(96, 123, 139, 0.15); color: var(--accent-sorrow);">Agotamiento: ${toll.physicalExhaustion || 0}/10</span>
              <span class="badge" style="background: rgba(87, 139, 116, 0.15); color: var(--sage-700);">Ansiedad: ${toll.anxiety || 0}/10</span>
            </div>

            ${isIntegrated ? `
              <div style="margin-top: 8px;">
                ${e.followUpNotes.map(n => `
                  <div class="follow-up-box">
                    <strong>Reflexión posterior (${new Date(n.timestamp).toLocaleDateString('es-ES')}):</strong> ${n.text}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <button type="button" class="btn-add-followup" data-add-followup-id="${e.id}" data-type="paz_falsa">
              Valorar e Integrar en frío (Con perspectiva)
            </button>
          </div>
        `;
      } else {
        const e = item.data;
        const delta = (e.initialIntensity || 0) - (e.postIntensity || 0);
        return `
          <div class="history-item">
            <div class="history-header" style="flex-wrap: wrap; gap: 6px;">
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <span class="history-tag espacio-act">Espacio ACT • ${e.emotion}</span>
                ${window.stateManager?.isExampleItem?.(e) ?'<span class="badge example-item-badge">Ejemplo guía</span>' :''}
                ${integrationBadge}
              </div>
              <span class="history-date">${dateStr}</span>
            </div>
            <div class="history-title">Pensamiento observado: "${e.thought || '—'}"</div>
            <div class="history-detail">
              <strong>Distanciamiento:</strong> "${e.reframedThought || e.thought || '—'}"<br>
<strong>Dirección elegida:</strong> ${e.choiceType ==='value' ?'' + e.valueChosen :'Piloto Automático'}
              ${e.committedAction ? ` — Acción: "${e.committedAction}"` : ''}
              ${e.carriedPassenger ?`<br><strong>Pasajero a bordo:</strong> ${e.carriedPassenger}` :''}
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
              <span class="badge" style="background: rgba(87, 139, 116, 0.2); color: var(--sage-700);">
                Intensidad: ${e.initialIntensity}/10 → ${e.postIntensity}/10 (${delta >= 0 ? '-' + delta : '+' + Math.abs(delta)})
              </span>
              ${e.bodyZones && e.bodyZones.length ? `
                <span class="badge" style="background: rgba(96, 123, 139, 0.15); color: var(--accent-sorrow);">
                  Zonas: ${e.bodyZones.join(', ')}
                </span>
              ` : ''}
            </div>

            ${isIntegrated ? `
              <div style="margin-top: 8px;">
                ${e.followUpNotes.map(n => `
                  <div class="follow-up-box">
                    <strong>Reflexión posterior (${new Date(n.timestamp).toLocaleDateString('es-ES')}):</strong> ${n.text}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <button type="button" class="btn-add-followup" data-add-followup-id="${e.id}" data-type="act_crisis">
              Valorar e Integrar en frío (Con perspectiva)
            </button>
          </div>
        `;
      }
    }).join('');
  }

  // -------------------------------------------------------------
  // HTML5 Canvas Chart Rendering
  // -------------------------------------------------------------
  drawCharts() {
    this.drawTimelineChart();
    this.drawContextChart();
    this.drawHexaflexChart();
  }

  drawTimelineChart() {
    const canvas = document.getElementById('timeline-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#b0c4ba' : '#53675e';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';

    ctx.clearRect(0, 0, w, h);

    const analytics = window.stateManager.getAnalytics();
    const timeline = analytics.combinedTimeline || [];

    const padLeft = 35;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 10; i += 2) {
      const y = padTop + plotH - (i / 10) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
      ctx.fillText(i.toString(), padLeft - 6, y + 3);
    }

    if (timeline.length === 0) {
      ctx.textAlign = 'center';
      ctx.fillText('Sin datos registrados aún.', w / 2, h / 2);
      return;
    }

    const cs = getComputedStyle(document.documentElement);
    const colAccent = cs.getPropertyValue('--sage-500').trim() || '#96553E';
    const colTension = cs.getPropertyValue('--accent-tension').trim() || '#9A4B38';
    const colWarmth = cs.getPropertyValue('--accent-warmth').trim() || '#96553E';
    const colBg = cs.getPropertyValue('--bg-primary').trim() || (isDark ? '#1B1613' : '#F3EDE4');

    const stepX = timeline.length > 1 ? plotW / (timeline.length - 1) : plotW / 2;

    ctx.beginPath();
    timeline.forEach((pt, idx) => {
      const x = padLeft + (timeline.length > 1 ? idx * stepX : plotW / 2);
      const y = padTop + plotH - (pt.intensity / 10) * plotH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = colAccent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    let hasResentment = false;
    timeline.forEach((pt, idx) => {
      if (pt.type === 'paz_falsa') {
        const x = padLeft + (timeline.length > 1 ? idx * stepX : plotW / 2);
        const y = padTop + plotH - (pt.resentment / 10) * plotH;
        if (!hasResentment) {
          ctx.moveTo(x, y);
          hasResentment = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    if (hasResentment) {
      ctx.strokeStyle = colTension;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    timeline.forEach((pt, idx) => {
      const x = padLeft + (timeline.length > 1 ? idx * stepX : plotW / 2);
      const y = padTop + plotH - (pt.intensity / 10) * plotH;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = pt.type ==='act_crisis' ? colAccent : colWarmth;
      ctx.fill();
      ctx.strokeStyle = colBg;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (idx === 0 || idx === timeline.length - 1 || idx % 2 === 0) {
        const d = new Date(pt.timestamp);
        const dateLabel = `${d.getDate()}/${d.getMonth() + 1}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(dateLabel, x, h - 10);
      }
    });
  }

  drawContextChart() {
    const canvas = document.getElementById('context-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#b0c4ba' : '#53675e';
    const subtleColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

    ctx.clearRect(0, 0, w, h);

    const analytics = window.stateManager.getAnalytics();
    const contextMap = analytics.contextMap || {};
    const contexts = ['Trabajo', 'Pareja', 'Familia', 'Amigos', 'Otro'];

    const padLeft = 70;
    const padRight = 30;
    const padTop = 15;
    const padBottom = 20;
    const barAreaH = h - padTop - padBottom;
    const barH = barAreaH / contexts.length - 8;

    let maxCount = 1;
    contexts.forEach(c => {
      if (contextMap[c] && contextMap[c].count > maxCount) maxCount = contextMap[c].count;
    });

    contexts.forEach((c, idx) => {
      const y = padTop + idx * (barAreaH / contexts.length);
      const count = contextMap[c] ? contextMap[c].count : 0;
      const barW = ((w - padLeft - padRight) * (count / maxCount));

      ctx.fillStyle = textColor;
      ctx.font = '11px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(c, padLeft - 10, y + barH / 2 + 4);

      ctx.fillStyle = subtleColor;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(padLeft, y, w - padLeft - padRight, barH, 4) : ctx.rect(padLeft, y, w - padLeft - padRight, barH);
      ctx.fill();

      if (barW > 0) {
        ctx.fillStyle = '#c98a58';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(padLeft, y, barW, barH, 4) : ctx.rect(padLeft, y, barW, barH);
        ctx.fill();
      }

      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.fillText(`${count} ev.`, padLeft + barW + 8, y + barH / 2 + 4);
    });
  }

  // -------------------------------------------------------------
  // HEXAFLEX SPIDER/RADAR CHART (Steven Hayes 6 Processes)
  // -------------------------------------------------------------
  drawHexaflexChart() {
    const canvas = document.getElementById('hexaflex-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#b0c4ba' : '#53675e';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

    ctx.clearRect(0, 0, w, h);

    const hexHistory = window.stateManager.getHexaflexHistory();
    const currentScores = hexHistory.length > 0 ? hexHistory[0].scores : {
      acceptance: 5, defusion: 5, present: 5, context: 5, values: 5, action: 5
    };

    const processes = [
      { key: 'acceptance', label: 'Aceptación' },
      { key: 'defusion', label: 'Defusión' },
      { key: 'present', label: 'Presente' },
      { key: 'context', label: 'Yo Contexto' },
      { key: 'values', label: 'Valores' },
      { key: 'action', label: 'Acción' }
    ];

    const cx = w / 2;
    const cy = h / 2 + 4;
    const maxR = Math.min(w / 2 - 50, h / 2 - 32);

    // Draw concentric web rings
    const rings = [0.25, 0.5, 0.75, 1.0];
    rings.forEach(ring => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - (Math.PI / 2);
        const x = cx + Math.cos(angle) * (maxR * ring);
        const y = cy + Math.sin(angle) * (maxR * ring);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw axis lines and labels
    processes.forEach((proc, i) => {
      const angle = (i * Math.PI / 3) - (Math.PI / 2);
      const xEnd = cx + Math.cos(angle) * maxR;
      const yEnd = cy + Math.sin(angle) * maxR;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(xEnd, yEnd);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      const labelDist = maxR + 18;
      const lx = cx + Math.cos(angle) * labelDist;
      const ly = cy + Math.sin(angle) * labelDist;

      ctx.fillStyle = textColor;
      ctx.font = '11px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(proc.label, lx, ly);
    });

    // Draw Score Polygon
    ctx.beginPath();
    processes.forEach((proc, i) => {
      const val = currentScores[proc.key] || 0;
      const dist = (val / 10) * maxR;
      const angle = (i * Math.PI / 3) - (Math.PI / 2);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    const csHex = getComputedStyle(document.documentElement);
    const hexAccent = csHex.getPropertyValue('--sage-500').trim() || '#96553E';
    const hexAccentDeep = csHex.getPropertyValue('--sage-600').trim() || hexAccent;
    const hexBg = csHex.getPropertyValue('--bg-primary').trim() || (isDark ? '#1B1613' : '#F3EDE4');

    ctx.save();
    ctx.globalAlpha = isDark ? 0.28 : 0.2;
    ctx.fillStyle = hexAccent;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = hexAccent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Score node dots
    processes.forEach((proc, i) => {
      const val = currentScores[proc.key] || 0;
      const dist = (val / 10) * maxR;
      const angle = (i * Math.PI / 3) - (Math.PI / 2);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = hexAccentDeep;
      ctx.fill();
      ctx.strokeStyle = hexBg;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  escapeHtml(str) {
    return window.KhoraUtils.escapeHtml(str);
  }

  renderTherapyReflectionsSection(reflections) {
    const allCount = reflections.length;
    const pendingCount = reflections.filter(r => r.status === 'pending').length;
    const discussedCount = reflections.filter(r => r.status === 'discussed').length;

    const filtered = reflections.filter(r => {
      if (this.therapyFilter === 'pending') return r.status === 'pending';
      if (this.therapyFilter === 'discussed') return r.status === 'discussed';
      return true;
    });

    const cardsHtml = filtered.length === 0
      ? `<div style="text-align: center; padding: 22px; color: var(--text-muted); font-size: 0.9rem;">
           ${this.therapyFilter === 'pending'
             ?'No tienes reflexiones pendientes por revisar en sesión.'
             : 'Todavía no hay reflexiones en este filtro. Escribe una arriba cuando notes un patrón o idea.'}
         </div>`
      : filtered.map(r => {
          const dateStr = new Date(r.timestamp).toLocaleDateString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          });
          const ext = r.clinicalExtract || {};
          const isPending = r.status === 'pending';
          const statusBadge = isPending
            ?`<span class="badge" style="background: rgba(201, 138, 88, 0.18); color: #c98a58; font-size: 0.72rem;">Pendiente de sesión</span>`
            :`<span class="badge" style="background: rgba(87, 139, 116, 0.2); color: var(--border-focus); font-size: 0.72rem;">Tratada en sesión</span>`;

          const emotionsTags = (ext.emotions || []).map(em =>
            `<span class="badge" style="background: rgba(184, 107, 89, 0.14); color: var(--accent-tension); font-size: 0.72rem;">${this.escapeHtml(em)}</span>`
          ).join(' ');

          return `
            <div class="history-item" style="margin-bottom: 12px;">
              <div class="history-header" style="flex-wrap: wrap; gap: 6px;">
                <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
<span class="history-tag act-crisis">${this.escapeHtml(r.context)}</span>
                  <span class="badge" style="background: var(--bg-surface-elevated); font-size: 0.72rem;">${this.escapeHtml(r.category)}</span>
                  ${window.stateManager?.isExampleItem?.(r) ?'<span class="badge example-item-badge">Ejemplo guía</span>' :''}
                  ${statusBadge}
                </div>
                <span class="history-date">${dateStr}</span>
              </div>

              <div class="history-title" style="margin-top: 6px; line-height: 1.5;">
                "${this.escapeHtml(r.text)}"
              </div>

              <div style="margin-top: 10px; padding: 10px 12px; border-radius: var(--radius-sm); background: rgba(87, 139, 116, 0.08); border-left: 3px solid var(--sage-600); font-size: 0.84rem; line-height: 1.45;">
<div style="font-weight: 700; color: var(--border-focus); margin-bottom: 6px;">Detalles Extraídos para el Psicólogo</div>
                <div style="margin-bottom: 5px; display: flex; flex-wrap: wrap; align-items: center; gap: 5px;">
                  <strong>Emociones detectadas:</strong> ${emotionsTags}
                </div>
                <div style="margin-bottom: 4px;">
                  <strong>Proceso ACT / Hexaflex:</strong> ${this.escapeHtml(ext.hexaflexProcess || 'Autoobservación')}
                </div>
                <div style="margin-bottom: 4px;">
                  <strong>Patrón conductual:</strong> ${this.escapeHtml(ext.behaviorPattern || 'En exploración')}
                </div>
                <div>
                  <strong>Posible foco para sesión:</strong> ${this.escapeHtml(ext.sessionFocus || 'Revisar antecedente y función')}
                </div>
              </div>

              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                <button type="button" class="btn-secondary" style="font-size: 0.8rem; padding: 6px 12px;" data-toggle-reflection-id="${r.id}">
                  ${isPending ?'✓ Marcar como tratada en sesión' :'Reabrir como pendiente'}
                </button>
                <button type="button" class="btn-secondary" data-delete-reflection-id="${r.id}" style="font-size: 0.8rem; padding: 6px 12px; color: var(--accent-tension); border-color: rgba(184, 107, 89, 0.35);">
                  Eliminar
                </button>
              </div>
            </div>
          `;
        }).join('');

    return `
      <div class="view-plain-shell" id="therapy-notebook-card">
        <div class="card-header flex-between" style="flex-wrap: wrap; gap: 10px;">
          <p class="card-subtitle" style="margin: 0; flex: 1; min-width: 220px;">Anota ideas, bucles o dudas entre sesiones para llevar un resumen clínico a consulta.</p>
          <button type="button" class="btn-primary" id="btn-open-therapy-brief" style="font-size: 0.82rem; padding: 8px 14px;">
            Ver / Copiar Informe para mi Psicólogo
          </button>
        </div>

        <div class="therapy-notebook-layout">
          <div class="therapy-form-col">
            <div class="form-group" style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); margin-bottom: 16px;">
              <label class="form-label" for="input-therapy-reflection">Nueva reflexión o tema para llevar a terapia</label>
              <textarea id="input-therapy-reflection" class="form-textarea mt-1" rows="3" placeholder="Escribe con tus palabras qué quieres llevar a sesión...">${this.escapeHtml(this.pendingTherapyDraft || '')}</textarea>
              <div style="margin-top: 8px;">
                <button type="button" class="btn-inline-link" id="btn-therapy-toggle-examples" style="font-size: 0.78rem;">
                  ¿Bloqueado? Ver inicios de ejemplo
                </button>
                <div class="quick-chips-row hidden" id="therapy-examples-row" style="margin-top: 8px;">
                  ${[
                    'Esta semana me di cuenta de que...',
                    'Me costó sostener lo que necesitaba ante...',
                    'Conseguí frenar el piloto automático en...',
                    'Quiero trabajar en sesión...'
                  ].map(st => `
                    <button type="button" class="quick-fill-chip" data-therapy-starter="${st.replace(/"/g, '&quot;')}">
                      ${st}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 10px; margin-top: 10px; align-items: end;">
                <div>
                  <label class="form-label" for="select-therapy-context" style="font-size: 0.78rem;">Contexto</label>
                  <select id="select-therapy-context" class="form-select">
                    <option value="Pareja" ${this.pendingTherapyContext === 'Pareja' ? 'selected' : ''}>Pareja</option>
                    <option value="Familia" ${this.pendingTherapyContext === 'Familia' ? 'selected' : ''}>Familia</option>
                    <option value="Trabajo" ${this.pendingTherapyContext === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
                    <option value="Amistad" ${this.pendingTherapyContext === 'Amigos' || this.pendingTherapyContext === 'Amistad' ? 'selected' : ''}>Amistad</option>
                    <option value="Salud / Personal" ${this.pendingTherapyContext === 'Otro' ? 'selected' : ''}>Salud / Personal</option>
                    <option value="General" ${!this.pendingTherapyContext ? 'selected' : ''}>General</option>
                  </select>
                </div>
                <div>
                  <label class="form-label" for="select-therapy-cat" style="font-size: 0.78rem;">Tipo de apunte</label>
                  <select id="select-therapy-cat" class="form-select">
                    <option value="Patrón o bucle que me cuesta">Patrón o bucle que me cuesta</option>
                    <option value="Disparador / Miedo recurrente">Disparador / Miedo recurrente</option>
                    <option value="Idea o insight entre sesiones">Idea o insight entre sesiones</option>
                    <option value="Logro o cambio observado">Logro o cambio observado</option>
                    <option value="Duda o pregunta para sesión">Duda o pregunta para sesión</option>
                  </select>
                </div>
                <button type="button" class="btn-primary" id="btn-save-therapy-reflection" style="width: 100%; justify-content: center;">
                  Guardar y Analizar para Terapia
                </button>
              </div>
            </div>
          </div>

          <div class="therapy-list-col">
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
              <button type="button" class="btn-secondary therapy-filter-btn ${this.therapyFilter === 'all' ? 'active' : ''}" data-therapy-filter="all" style="font-size: 0.8rem; padding: 6px 12px; ${this.therapyFilter === 'all' ? 'background: var(--sage-600); color: #fff; border-color: var(--sage-600);' : ''}">
                Todas (${allCount})
              </button>
              <button type="button" class="btn-secondary therapy-filter-btn ${this.therapyFilter === 'pending' ? 'active' : ''}" data-therapy-filter="pending" style="font-size: 0.8rem; padding: 6px 12px; ${this.therapyFilter === 'pending' ? 'background: var(--sage-600); color: #fff; border-color: var(--sage-600);' : ''}">
                Pendientes de sesión (${pendingCount})
              </button>
              <button type="button" class="btn-secondary therapy-filter-btn ${this.therapyFilter === 'discussed' ? 'active' : ''}" data-therapy-filter="discussed" style="font-size: 0.8rem; padding: 6px 12px; ${this.therapyFilter === 'discussed' ? 'background: var(--sage-600); color: #fff; border-color: var(--sage-600);' : ''}">
                Tratadas (${discussedCount})
              </button>
            </div>

            <div>
              ${reflections.some(r => window.stateManager?.isExampleItem?.(r)) ? `
                <div class="example-notice-bar">
<span>Hay un apunte de ejemplo en tu Cuaderno para enseñarte cómo extrae los procesos para sesión.</span>
                  <button type="button" class="btn-secondary" data-clear-examples="true" style="font-size: 0.75rem; padding: 4px 10px;">
                    Quitar ejemplos
                  </button>
                </div>
              ` : ''}
              ${cardsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  openTherapyBriefModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const reflections = window.stateManager.getTherapyReflections();
    const pendingRefs = reflections.filter(r => r.status === 'pending');
    const analytics = window.stateManager.getAnalytics();
    const profile = window.stateManager.getProfile();
    const hexHistory = window.stateManager.getHexaflexHistory();
    const latestHex = hexHistory.length > 0 ? hexHistory[0].scores : null;

    const topEmotions = Object.entries(analytics.emotionMap || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const activePassengers = (profile.busPassengers || []).filter(p => p.status !== 'integrated');
    const coreValues = profile.coreValues || [];

    const todayStr = new Date().toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    const lines = [
      `INFORME BREVE DE SEGUIMIENTO ACT PARA SESIÓN DE PSICOLOGÍA`,
      `Fecha de generación: ${todayStr}`,
      ``,
      `1. INDICADORES CUANTITATIVOS DE AUTORREGULACIÓN Y FLEXIBILIDAD`,
      `- Registros de Falsa Paz (evitación/complacencia): ${analytics.totalPf}`,
      `- Índice medio de autoabandono: ${analytics.avgTollScore}/100`,
      `- Porcentaje de elección alineada con valores (vs piloto automático): ${analytics.valueChoiceRatio}%`,
      `- Intervenciones de crisis en Espacio ACT: ${analytics.totalAct} (reducción media de intensidad: -${analytics.avgDefusionReduction} puntos)`,
    ];

    if (latestHex) {
      lines.push(`- Último Hexaflex (0-10): Aceptación ${latestHex.acceptance}, Defusión ${latestHex.defusion}, Presente ${latestHex.present}, Yo Contexto ${latestHex.context}, Valores ${latestHex.values}, Acción ${latestHex.action}`);
    }

    lines.push(``, `2. EMOCIONES MÁS FRECUENTES (RUEDA EMOCIONAL)`);
    if (topEmotions.length > 0) {
      topEmotions.forEach(([em, count]) => lines.push(`- ${em}: ${count} registro(s)`));
    } else {
      lines.push(`- Sin registros suficientes en Rueda Emocional todavía.`);
    }

    lines.push(``, `3. PASAJEROS ACTIVOS EN EL AUTOBÚS (MIEDOS / VOCES AUTOMÁTICAS)`);
    if (activePassengers.length > 0) {
      activePassengers.forEach(p => {
        const st = p.status === 'loud' ? 'Haciendo ruido / intentando conducir' : 'Sentado atrás / en trabajo';
        lines.push(`- ${p.name} [${st}] -> Voz: "${p.shouts}"`);
      });
    } else {
      lines.push(`- Sin pasajeros activos pendientes de asiento.`);
    }

    lines.push(``, `4. VALORES NUCLEARES Y DIRECCIÓN ELEGIDA (CONSTRUCTOR DE HAYES)`);
    if (coreValues.length > 0) {
      coreValues.forEach(v => {
        lines.push(`- [${v.domain}] ${v.statement}${v.microAction ? ` (Micro-acción: ${v.microAction})` : ''}`);
      });
    } else {
      lines.push(`- Aún no se han formulado valores en el perfil.`);
    }

    lines.push(``, `5. REFLEXIONES Y TEMAS PENDIENTES PARA COMENTAR EN SESIÓN (${pendingRefs.length})`);
    if (pendingRefs.length > 0) {
      pendingRefs.forEach((r, idx) => {
        const ext = r.clinicalExtract || {};
        lines.push(``);
        lines.push(`[${idx + 1}] (${r.context} • ${r.category}) - ${new Date(r.timestamp).toLocaleDateString('es-ES')}`);
        lines.push(`Reflexión del paciente: "${r.text}"`);
        lines.push(`  • Emociones detectadas: ${(ext.emotions || []).join(', ')}`);
        lines.push(`  • Proceso ACT / Hexaflex: ${ext.hexaflexProcess || 'Autoobservación'}`);
        lines.push(`  • Patrón conductual: ${ext.behaviorPattern || 'En exploración'}`);
        lines.push(`  • Posible foco clínico: ${ext.sessionFocus || 'Explorar antecedente y función'}`);
      });
    } else {
      lines.push(`- No hay reflexiones marcadas como pendientes en este momento.`);
    }

    const briefText = lines.join('\n');

    modalBody.innerHTML = `
<h3 class="card-title">Informe Breve para tu Psicólogo</h3>
      <p class="card-subtitle mt-2">
        Consolida tus indicadores ACT, emociones dominantes, pasajeros activos, valores y tus <strong>${pendingRefs.length}</strong> reflexiones pendientes de sesión.
      </p>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0;">
<span class="badge" style="background: rgba(87, 139, 116, 0.18); color: var(--border-focus);">${pendingRefs.length} ${pendingRefs.length === 1 ?'tema pendiente' :'temas pendientes'}</span>
        <span class="badge" style="background: rgba(184, 107, 89, 0.14); color: var(--accent-tension);">Autoabandono: ${analytics.avgTollScore}/100</span>
<span class="badge" style="background: var(--bg-surface-elevated);">${activePassengers.length} pasajeros activos</span>
<span class="badge" style="background: var(--bg-surface-elevated);">${coreValues.length} valores</span>
      </div>

      <textarea id="therapy-brief-textarea" class="form-textarea" rows="13" readonly style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.79rem; line-height: 1.45; white-space: pre-wrap;">${this.escapeHtml(briefText)}</textarea>

      <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; margin-top: 14px;">
        <button type="button" class="btn-secondary" id="btn-close-therapy-brief">Cerrar</button>
<button type="button" class="btn-primary" id="btn-copy-therapy-brief">Copiar al Portapapeles</button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('medium');
    } else {
      modal.classList.add('active');
    }

    document.getElementById('btn-close-therapy-brief')?.addEventListener('click', () => {
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    });

    document.getElementById('btn-copy-therapy-brief')?.addEventListener('click', async () => {
      const textarea = document.getElementById('therapy-brief-textarea');
      const copyBtn = document.getElementById('btn-copy-therapy-brief');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(briefText);
        } else if (textarea) {
          textarea.select();
          document.execCommand('copy');
        }
        window.app?.showToast('Informe clínico copiado al portapapeles');
        if (copyBtn) copyBtn.textContent ='¡Informe Copiado!';
      } catch (err) {
        if (textarea) {
          textarea.select();
          document.execCommand('copy');
        }
        window.app?.showToast('Informe preparado para copiar');
        if (copyBtn) copyBtn.textContent ='Copiado / Seleccionado';
      }
    });
  }

  // -------------------------------------------------------------
  // Event Binding & Modals
  // -------------------------------------------------------------
  bindEvents() {
    document.querySelectorAll('[data-insight-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeInsightTab = btn.dataset.insightTab;
        this.render();
        this.bindEvents();
      });
    });

    document.getElementById('btn-therapy-toggle-examples')?.addEventListener('click', (e) => {
      const row = document.getElementById('therapy-examples-row');
      if (!row) return;
      const isHidden = row.classList.toggle('hidden');
      e.currentTarget.textContent = isHidden ?'¿Bloqueado? Ver inicios de ejemplo' :'▴ Ocultar ejemplos';
    });

    document.querySelectorAll('[data-therapy-starter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ta = document.getElementById('input-therapy-reflection');
        if (ta) {
          ta.value = btn.dataset.therapyStarter + ' ';
          ta.focus();
        }
        document.querySelectorAll('[data-therapy-starter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('btn-insight-go-anchors')?.addEventListener('click', () => {
      if (window.pildorasAnclajesApp) {
        window.pildorasAnclajesApp.mode = 'estudio';
        window.pildorasAnclajesApp.currentTab = 'pildoras';
      }
      window.app?.navigate('readings');
    });

    document.getElementById('btn-add-progress-note')?.addEventListener('click', () => {
      const input = document.getElementById('input-progress-note');
      const note = input?.value?.trim();
      if (note) {
        window.stateManager.addProgressNote(note);
        input.value = '';
        this.render();
        this.bindEvents();
        window.app?.showToast('Nota de progreso añadida');
      }
    });

    document.getElementById('btn-save-therapy-reflection')?.addEventListener('click', () => {
      const textEl = document.getElementById('input-therapy-reflection');
      const ctxEl = document.getElementById('select-therapy-context');
      const catEl = document.getElementById('select-therapy-cat');
      const text = textEl?.value?.trim();
      if (!text) {
        window.app?.showToast('Escribe tu reflexión o idea antes de guardarla para terapia');
        return;
      }
      window.stateManager.addTherapyReflection({
        text,
        context: ctxEl?.value || 'General',
        category: catEl?.value || 'Idea o insight entre sesiones'
      });
      this.therapyFilter = 'all';
      window.app?.showToast('Reflexión analizada y guardada en tu Cuaderno de Terapia');
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-open-therapy-brief')?.addEventListener('click', () => {
      this.openTherapyBriefModal();
    });

    document.querySelectorAll('.therapy-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.therapyFilter = e.currentTarget.dataset.therapyFilter;
        this.render();
        this.bindEvents();
      });
    });

    document.querySelectorAll('[data-toggle-reflection-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.toggleReflectionId;
        const updated = window.stateManager.toggleTherapyReflectionStatus(id);
        window.app?.showToast(
          updated?.status === 'discussed'
            ? 'Marcada como tratada en sesión'
            : 'Reabierta como pendiente de sesión'
        );
        this.render();
        this.bindEvents();
      });
    });

    document.querySelectorAll('[data-delete-reflection-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.deleteReflectionId;
        if (confirm('¿Eliminar esta reflexión del Cuaderno de Terapia?')) {
          window.stateManager.deleteTherapyReflection(id);
          window.app?.showToast('Reflexión eliminada');
          this.render();
          this.bindEvents();
        }
      });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterType = e.currentTarget.dataset.filter;
        this.render();
        this.bindEvents();
      });
    });

    document.querySelectorAll('.history-emotion-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.emotionFilter = e.currentTarget.dataset.historyEmotion || 'all';
        this.render();
        this.bindEvents();
      });
    });

    document.getElementById('history-context-select')?.addEventListener('change', (e) => {
      this.contextFilter = e.target.value || 'all';
      this.render();
      this.bindEvents();
    });

    document.getElementById('history-search-input')?.addEventListener('input', (e) => {
      this.historySearchQuery = e.target.value || '';
      const pfEntries = window.stateManager.getPazFalsaEntries();
      const actEntries = window.stateManager.getActCrisisEntries();
      const filteredItems = this.getFilteredHistoryItems(pfEntries, actEntries);
      const gridEl = document.querySelector('#history-list-container .history-items-grid');
      if (gridEl) {
        gridEl.innerHTML = this.renderHistoryList(pfEntries, actEntries, filteredItems);
        gridEl.querySelectorAll('[data-add-followup-id]').forEach(btn => {
          btn.addEventListener('click', (ev) => {
            this.openFollowUpModal(ev.currentTarget.dataset.addFollowupId, ev.currentTarget.dataset.type);
          });
        });
      }
    });

    document.getElementById('btn-clear-history-filters')?.addEventListener('click', () => {
      this.emotionFilter = 'all';
      this.contextFilter = 'all';
      this.historySearchQuery = '';
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-history-to-therapy')?.addEventListener('click', () => {
      const pfEntries = window.stateManager.getPazFalsaEntries();
      const actEntries = window.stateManager.getActCrisisEntries();
      const matches = this.getFilteredHistoryItems(pfEntries, actEntries);
      const isEn = window.i18n?.isEn?.();
      const emNames = {
        miedo: isEn ? 'Fear / Anxiety' : 'Miedo / Ansiedad',
        ira: isEn ? 'Anger / Resentment' : 'Ira / Resentimiento',
        tristeza: isEn ? 'Sadness / Guilt' : 'Tristeza / Culpa',
        agotamiento: isEn ? 'Exhaustion' : 'Agotamiento',
        aversion: isEn ? 'Aversion' : 'Aversión',
        sorpresa: isEn ? 'Freeze / Overwhelm' : 'Bloqueo'
      };
      const emLabel = this.emotionFilter === 'all'
        ? (isEn ? 'filtered episodes' : 'episodios filtrados')
        : (this.emotionFilter.startsWith('exact:')
          ? (window.i18n?.translateText?.(this.emotionFilter.slice(6)) || this.emotionFilter.slice(6))
          : (emNames[this.emotionFilter] || this.emotionFilter));
      const ctxLabel = this.contextFilter !== 'all' ? (window.i18n?.translateText?.(this.contextFilter) || this.contextFilter) : '';
      const latestSnippets = matches.slice(0, 3).map(m => {
        const dt = new Date(m.timestamp).toLocaleDateString(isEn ? 'en-US' : 'es-ES');
        const txt = m.type === 'paz_falsa' ? (m.data.situation || '') : (m.data.thought || '');
        return `- (${dt}) "${txt.slice(0, 75)}${txt.length > 75 ? '…' : ''}"`;
      }).join('\n');

      const draftText = isEn
        ? `Looking back across ${matches.length} episode(s) linked to ${emLabel}${ctxLabel ? ` in ${ctxLabel}` : ''}:\n${latestSnippets}\n\nWhat I notice recurring here is...`
        : `Al revisar en perspectiva ${matches.length} episodio(s) ligados a ${emLabel}${ctxLabel ? ` en ${ctxLabel}` : ''}:\n${latestSnippets}\n\nLo que noto que se repite aquí es...`;
      this.pendingTherapyContext = this.contextFilter !== 'all' ? this.contextFilter : '';
      this.pendingTherapyDraft = draftText;

      if (window.app?.navigate) {
        window.app.navigate('therapy');
      } else {
        this.activeInsightTab = 'terapia';
        this.render();
        this.bindEvents();
      }
      const ta = document.getElementById('input-therapy-reflection');
      if (ta) {
        ta.value = draftText;
        ta.focus?.();
      }
      this.pendingTherapyDraft = '';
      this.pendingTherapyContext = '';
    });

    document.getElementById('btn-add-anchor-modal')?.addEventListener('click', () => {
      this.openAddAnchorModal();
    });

    document.getElementById('btn-open-hexaflex-modal')?.addEventListener('click', () => {
      this.openHexaflexModal();
    });

    document.querySelectorAll('[data-add-followup-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.addFollowupId;
        const type = e.currentTarget.dataset.type;
        this.openFollowUpModal(id, type);
      });
    });

    document.getElementById('btn-open-storage-modal')?.addEventListener('click', () => {
      window.app?.openSettingsModal();
    });

    document.querySelectorAll('[data-clear-examples]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('¿Quitar todos los datos de ejemplo de la app? Tus registros propios se conservarán intactos.')) {
          window.stateManager.clearExampleData();
          this.render();
          this.bindEvents();
          window.app?.showToast('Ejemplos retirados — tus datos propios se mantienen');
        }
      });
    });
  }

  // Hexaflex Assessment Modal
  openHexaflexModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const hexHistory = window.stateManager.getHexaflexHistory();
    const curr = hexHistory.length > 0 ? hexHistory[0].scores : {
      acceptance: 6, defusion: 5, present: 7, context: 6, values: 8, action: 6
    };

    modalBody.innerHTML = `
      <h3 class="card-title">Test Rápido de Flexibilidad (Psy-Flex Hexaflex)</h3>
      <p class="card-subtitle mt-2">Evalúa cómo has transitado los 6 procesos de Steven Hayes en los últimos días (0 a 10):</p>

      <div class="form-group mt-4 modal-grid-2col">
        <div class="slider-group">
          <div class="slider-header">
<span>1. Aceptación (Espacio a la incomodidad sin huir)</span>
            <span class="slider-val-badge" id="val-hex-acc">${curr.acceptance}/10</span>
          </div>
          <input type="range" class="range-slider" id="sl-hex-acc" min="0" max="10" value="${curr.acceptance}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>2. Defusión (Tomar distancia de los pensamientos)</span>
            <span class="slider-val-badge" id="val-hex-def">${curr.defusion}/10</span>
          </div>
          <input type="range" class="range-slider" id="sl-hex-def" min="0" max="10" value="${curr.defusion}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>3. Momento Presente (Anclado aquí y ahora vs. rumiación)</span>
            <span class="slider-val-badge" id="val-hex-pre">${curr.present}/10</span>
          </div>
          <input type="range" class="range-slider" id="sl-hex-pre" min="0" max="10" value="${curr.present}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>4. Yo como Contexto (Sentirse como el cielo que contiene las nubes)</span>
            <span class="slider-val-badge" id="val-hex-con">${curr.context}/10</span>
          </div>
          <input type="range" class="range-slider" id="sl-hex-con" min="0" max="10" value="${curr.context}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>5. Claridad de Valores (Saber qué es digno e importante)</span>
            <span class="slider-val-badge" id="val-hex-val">${curr.values}/10</span>
          </div>
          <input type="range" class="range-slider" id="sl-hex-val" min="0" max="10" value="${curr.values}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>6. Acción Comprometida (Dar pasos alineados a pesar del miedo)</span>
            <span class="slider-val-badge" id="val-hex-act">${curr.action}/10</span>
          </div>
          <input type="range" class="range-slider" id="sl-hex-act" min="0" max="10" value="${curr.action}">
        </div>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
        <button type="button" class="btn-primary" id="btn-save-hexaflex">Guardar Evaluación</button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('wide');
    } else {
      modal.classList.add('active');
    }

    const bindSlider = (slId, badgeId) => {
      const sl = document.getElementById(slId);
      const badge = document.getElementById(badgeId);
      if (sl && badge) {
        sl.addEventListener('input', (e) => {
          badge.textContent = `${e.target.value}/10`;
        });
      }
    };

    bindSlider('sl-hex-acc', 'val-hex-acc');
    bindSlider('sl-hex-def', 'val-hex-def');
    bindSlider('sl-hex-pre', 'val-hex-pre');
    bindSlider('sl-hex-con', 'val-hex-con');
    bindSlider('sl-hex-val', 'val-hex-val');
    bindSlider('sl-hex-act', 'val-hex-act');

    const closeModal = () => {
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    };

    document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('btn-save-hexaflex')?.addEventListener('click', () => {
      const scores = {
        acceptance: parseInt(document.getElementById('sl-hex-acc')?.value || '5', 10),
        defusion: parseInt(document.getElementById('sl-hex-def')?.value || '5', 10),
        present: parseInt(document.getElementById('sl-hex-pre')?.value || '5', 10),
        context: parseInt(document.getElementById('sl-hex-con')?.value || '5', 10),
        values: parseInt(document.getElementById('sl-hex-val')?.value || '5', 10),
        action: parseInt(document.getElementById('sl-hex-act')?.value || '5', 10)
      };

      window.stateManager.addHexaflexScore(scores);
      closeModal();
      window.app?.showToast('Hexaflex evaluado y actualizado');
      this.render();
      this.bindEvents();
    });
  }

  openAddAnchorModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <h3 class="card-title">Crear Tarjeta de Anclaje</h3>
      <p class="card-subtitle mt-2">Escribe una frase, metáfora o recordatorio que te devuelva a tu centro y a tus valores.</p>

      <div class="form-group mt-4">
        <label class="form-label" for="new-anchor-text">Frase o Recordatorio</label>
        <textarea id="new-anchor-text" class="form-textarea" placeholder="Ej: No tengo que complacer para ser valioso..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="new-anchor-cat">Categoría</label>
        <input type="text" id="new-anchor-cat" class="form-input" value="Valores">
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
        <button type="button" class="btn-primary" id="btn-modal-save-anchor">Guardar Anclaje</button>
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

    document.getElementById('btn-modal-save-anchor')?.addEventListener('click', () => {
      const text = document.getElementById('new-anchor-text')?.value?.trim();
      const cat = document.getElementById('new-anchor-cat')?.value?.trim() || 'Valores';
      if (!text) {
        window.app?.showToast('Escribe la frase de anclaje antes de guardar');
        return;
      }
      window.stateManager.addAnchor(text, 'Personal', cat);
      closeModal();
      window.app?.showToast('Anclaje guardado');
      this.render();
      this.bindEvents();
    });
  }

  openFollowUpModal(entryId, type) {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const retroOptions = [
'Mantuve el volante en mis valores aunque el pasajero hizo ruido',
'Hice pacto de Paz Falsa: cedí el volante para que el miedo se callara',
'Paré el autobús discutiendo con el pasajero, pero hoy veo qué valor quiero cuidar'
    ];

    modalBody.innerHTML = `
<h3 class="card-title">Valorar e Integrar en Frío (Metáfora del Autobús)</h3>
      <p class="card-subtitle mt-2">
        Mirar lo vivido cuando pasa el tiempo transforma un episodio puntual en aprendizaje integrado para tu ruta.
      </p>

      <div class="form-group mt-4">
        <label class="form-label" style="font-size: 0.86rem;">1. Con la perspectiva del tiempo, ¿qué ocurrió con el volante aquel día?</label>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
          ${retroOptions.map(opt => `
            <button type="button" class="badge retro-bus-chip" data-retro-bus="${opt.replace(/"/g, '&quot;')}"
                    style="cursor: pointer; text-align: left; white-space: normal; padding: 8px 12px; font-size: 0.78rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); color: var(--text-primary);">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="form-group mt-3">
        <label class="form-label" for="followup-text">2. ¿Qué intentaba proteger ese pasajero y qué aprendo hoy para integrarlo?</label>
        <p class="form-hint">¿Qué consecuencias tuvo a medio plazo y qué le dirías hoy a tu versión de ese momento?</p>
        <textarea id="followup-text" class="form-textarea" style="min-height: 115px;" placeholder="Ej: Mirándolo con perspectiva, el miedo quería evitar el rechazo, pero al poner el límite no ocurrió el desastre que anticipaba..."></textarea>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
<button type="button" class="btn-primary" id="btn-modal-save-followup">Guardar e Integrar Aprendizaje</button>
      </div>
    `;

    if (window.app?.openModal) {
      window.app.openModal('medium');
    } else {
      modal.classList.add('active');
    }

    modalBody.querySelectorAll('.retro-bus-chip[data-retro-bus]').forEach(chip => {
      chip.addEventListener('click', () => {
        modalBody.querySelectorAll('.retro-bus-chip').forEach(c => {
          c.style.borderColor = 'var(--border-subtle)';
          c.style.background = 'var(--bg-surface-elevated)';
          c.style.color = 'var(--text-primary)';
        });
        chip.style.borderColor = 'var(--sage-500)';
        chip.style.background = 'rgba(87, 139, 116, 0.16)';

        const ta = document.getElementById('followup-text');
        if (ta) {
          const prefix = chip.dataset.retroBus + '. ';
          if (!ta.value.includes(chip.dataset.retroBus)) {
            ta.value = prefix + ta.value;
          }
          ta.focus();
        }
      });
    });

    const closeModal = () => {
      if (window.app?.closeModal) window.app.closeModal();
      else modal.classList.remove('active');
    };

    document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('btn-modal-save-followup')?.addEventListener('click', () => {
      const text = document.getElementById('followup-text')?.value?.trim();
      if (!text) {
        window.app?.showToast('Escribe tu reflexión para guardarla');
        return;
      }

      if (type === 'paz_falsa') {
        window.stateManager.addPazFalsaFollowUp(entryId, text);
      } else {
        window.stateManager.addActCrisisFollowUp(entryId, text);
      }

      closeModal();
      window.app?.showToast('Reflexión de consolidación guardada');
      this.render();
      this.bindEvents();
    });
  }
}

window.insightApp = new InsightApp();
