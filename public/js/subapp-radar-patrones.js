/**
 * ECOSISTEMA ACT - Sub-App 4: El Radar de Patrones
 * Laboratorio de Problemas Recurrentes y Experimentos Semanales ACT
 */

class RadarPatronesApp {
  constructor() {
    this.selectedCategory = 'all'; // 'all' | 'Pareja' | 'Trabajo' | 'Familia' | 'Amigos' | 'Otro'
    this.oppositesTemplates = [
      {
        label: '⏱️ Variar el Tiempo (Romper la urgencia)',
        text: 'Esta semana, ante el detonante, pediré 15 minutos antes de responder sí o no para consultar qué quiero realmente.'
      },
      {
        label: '💬 Variar la Forma (Cero sobre-justificación)',
        text: 'Expresaré mi límite o preferencia en 1 sola frase amable, sosteniendo 30 segundos sin dar excusas.'
      },
      {
        label: '🧘 Variar el Cuerpo (Romper el apocamiento)',
        text: 'Adoptaré la Postura del SÍ (hombros sueltos, respiración abierta) antes de contestar, en lugar de encogerme.'
      },
      {
        label: '🔄 Hacer el Opuesto a Esconderme',
        text: "En vez de decir 'me da igual', propondré abiertamente una opción que sí me apetezca."
      }
    ];
  }

  renderOppositesGeneratorHtml() {
    return `
      <div class="form-group" style="margin-top: 8px; padding: 10px 12px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px dashed var(--sage-400);">
        <label class="form-label" style="font-size: 0.78rem; color: var(--sage-700); margin-bottom: 6px;">
          🔀 Práctica de Opuestos (Generador de Micro-Variaciones — Steven C. Hayes):
        </label>
        <div style="display: flex; flex-direction: column; gap: 6px;" class="modal-grid-2col">
          ${this.oppositesTemplates.map(op => `
            <button type="button" class="btn-secondary opposite-exp-btn" data-opposite-exp="${op.text.replace(/"/g, '&quot;')}"
                    style="font-size: 0.76rem; text-align: left; justify-content: flex-start; padding: 7px 10px; line-height: 1.35;">
              <span><strong>${op.label}:</strong> "${op.text}"</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindOppositesGenerator(modalBody, textareaId) {
    modalBody.querySelectorAll('.opposite-exp-btn[data-opposite-exp]').forEach(btn => {
      btn.addEventListener('click', () => {
        const textarea = document.getElementById(textareaId);
        if (textarea) {
          textarea.value = btn.dataset.oppositeExp;
          textarea.focus();
        }
      });
    });
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    const container = document.getElementById('radar-patrones-view');
    if (!container) return;

    const patterns = window.stateManager.getPatterns();
    const filteredPatterns = this.selectedCategory === 'all' 
      ? patterns 
      : patterns.filter(p => p.category === this.selectedCategory);

    container.innerHTML = `
      <div class="view-plain-shell">
        <div class="card-header flex-between" style="margin-bottom: 12px; gap: 10px; flex-wrap: wrap;">
          <p class="form-hint" style="margin: 0; flex: 1; min-width: 220px;">Observa tus bucles automáticos y diseña pequeños experimentos de cambio.</p>
          <button type="button" class="btn-primary" id="btn-create-pattern" style="font-size: 0.85rem; padding: 8px 16px;">
            + Nuevo Patrón
          </button>
        </div>

        <!-- Category Filters -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 16px;">
          ${['all', 'Pareja', 'Trabajo', 'Familia', 'Amigos', 'Otro'].map(cat => `
            <button type="button" class="badge pattern-filter-chip ${this.selectedCategory === cat ? 'active' : ''}" 
                    data-pattern-cat="${cat}" 
                    style="cursor: pointer; border: 1px solid var(--border-subtle); padding: 6px 12px; background: ${this.selectedCategory === cat ? 'var(--sage-500)' : 'var(--bg-surface-elevated)'}; color: ${this.selectedCategory === cat ? '#fff' : 'var(--text-secondary)'};">
              ${cat === 'all' ? 'Todos los ámbitos' : cat}
            </button>
          `).join('')}
        </div>

        <!-- Patterns List or Empty State -->
        <div id="patterns-list">
          ${filteredPatterns.length === 0 ? this.renderEmptyState() : filteredPatterns.map(p => this.renderPatternCard(p)).join('')}
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div style="text-align: center; padding: 40px 20px; background-color: var(--bg-surface-elevated); border-radius: var(--radius-md);">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">🔬</div>
        <h3 class="card-title" style="font-size: 1.1rem;">No tienes patrones mapeados en este ámbito</h3>
        <p class="card-subtitle mt-2" style="max-width: 460px; margin: 0 auto; font-size: 0.88rem;">
          En los momentos de calma es cuando mejor podemos ver las trampas que nos tiende el piloto automático.
          Registra un conflicto o dilema que sientas que se repite una y otra vez.
        </p>
        <button type="button" class="btn-primary mt-4" id="btn-empty-create-pattern">
          Comenzar a mapear mi primer bucle
        </button>
      </div>
    `;
  }

  renderPatternCard(pattern) {
    const loop = pattern.loop || {};
    const exp = pattern.weeklyExperiment || {};
    const checkins = pattern.checkins || [];
    const latestCheckin = checkins.length > 0 ? checkins[0] : null;

    return `
      <div class="card" style="background-color: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); margin-bottom: 24px; padding: 20px;">
        <div class="flex-between" style="margin-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span class="badge" style="background: var(--sage-100); color: var(--sage-800); margin-bottom: 6px;">
                ${pattern.category}
              </span>
              ${window.stateManager?.isExampleItem?.(pattern) ? '<span class="badge example-item-badge" style="margin-bottom: 6px;">🧪 Ejemplo guía</span>' : ''}
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
              ${pattern.title}
            </h3>
          </div>
          <button type="button" class="btn-icon" data-delete-pattern-id="${pattern.id}" title="Eliminar patrón" style="width: 32px; height: 32px; border: none; background: transparent; color: var(--text-muted);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>

        <!-- The 4-step loop diagram -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 16px;">
          <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); border-left: 4px solid var(--accent-tension);">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-tension); margin-bottom: 2px;">
              1. Detonante Habitual
            </div>
            <div style="font-size: 0.88rem; color: var(--text-primary);">${loop.trigger || '—'}</div>
          </div>

          <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); border-left: 4px solid var(--accent-warmth);">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-warmth); margin-bottom: 2px;">
              2. Mi Respuesta Automática (Sumisión/Evitación)
            </div>
            <div style="font-size: 0.88rem; color: var(--text-primary);">${loop.autoResponse || '—'}</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); border-left: 4px solid var(--sage-400);">
              <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--sage-600); margin-bottom: 2px;">
                3. Alivio Inmediato (Falsa Paz)
              </div>
              <div style="font-size: 0.82rem; color: var(--text-secondary);">${loop.shortTermGain || '—'}</div>
            </div>

            <div style="background-color: var(--bg-surface); padding: 12px 14px; border-radius: var(--radius-md); border-left: 4px solid var(--accent-sorrow);">
              <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-sorrow); margin-bottom: 2px;">
                4. Coste a Largo Plazo
              </div>
              <div style="font-size: 0.82rem; color: var(--text-secondary);">${loop.longTermCost || '—'}</div>
            </div>
          </div>
        </div>

        <!-- Weekly ACT Experiment Box -->
        <div style="background: linear-gradient(135deg, rgba(87, 139, 116, 0.15), rgba(74, 122, 102, 0.05)); border: 1px dashed var(--sage-400); border-radius: var(--radius-md); padding: 16px; margin-bottom: 14px;">
          <div class="flex-between">
            <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--sage-700);">
              🧪 El Experimento ACT de la Semana
            </span>
            <button type="button" class="btn-add-followup" data-edit-exp-id="${pattern.id}" style="font-size: 0.75rem;">
              Editar experimento
            </button>
          </div>
          <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-top: 6px; line-height: 1.4;">
            "${exp.text || 'Sin experimento definido todavía.'}"
          </div>
        </div>

        <!-- Weekly Check-in Section -->
        <div class="flex-between" style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <div>
            ${latestCheckin ? `
              <span style="font-size: 0.8rem; color: var(--text-muted);">
                Último check-in: <strong>${this.renderCheckinStatusBadge(latestCheckin.status)}</strong>
              </span>
            ` : `
              <span style="font-size: 0.8rem; color: var(--text-muted);">
                Aún no has hecho check-in esta semana
              </span>
            `}
          </div>

          <button type="button" class="btn-secondary" data-checkin-pattern-id="${pattern.id}" style="font-size: 0.82rem; padding: 6px 14px;">
            📝 Check-in Semanal
          </button>
        </div>

        <!-- History of check-ins if any -->
        ${checkins.length > 0 ? `
          <div style="margin-top: 12px; font-size: 0.82rem; background: var(--bg-surface); padding: 10px 14px; border-radius: var(--radius-sm);">
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Último aprendizaje registrado:</div>
            <div style="color: var(--text-secondary); font-style: italic;">"${latestCheckin.learned}"</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderCheckinStatusBadge(status) {
    if (status === 'completed') {
      return '<span style="color: #426f5c;">🌟 Conseguido con éxito</span>';
    } else if (status === 'in_progress') {
      return '<span style="color: #c98a58;">🌿 En progreso y aprendizaje</span>';
    } else {
      return '<span style="color: #607b8b;">💧 Postergado con compasión</span>';
    }
  }

  bindEvents() {
    // Filter chips
    document.querySelectorAll('.pattern-filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.dataset.patternCat;
        this.render();
        this.bindEvents();
      });
    });

    // Create Pattern Buttons
    document.getElementById('btn-create-pattern')?.addEventListener('click', () => {
      this.openCreatePatternModal();
    });
    document.getElementById('btn-empty-create-pattern')?.addEventListener('click', () => {
      this.openCreatePatternModal();
    });

    // Delete pattern
    document.querySelectorAll('[data-delete-pattern-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.deletePatternId;
        if (confirm('¿Eliminar este patrón del radar?')) {
          window.stateManager.deletePattern(id);
          window.app?.showToast('Patrón eliminado');
          this.render();
          this.bindEvents();
        }
      });
    });

    // Edit experiment
    document.querySelectorAll('[data-edit-exp-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.editExpId;
        this.openEditExperimentModal(id);
      });
    });

    // Weekly Check-in
    document.querySelectorAll('[data-checkin-pattern-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.checkinPatternId;
        this.openCheckinModal(id);
      });
    });
  }

  // Modals
  openCreatePatternModal() {
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    window.app?.setModalSize?.('wide');

    const patternTemplates = [
      {
        chip: '🤝 Ceder en planes por evitar malas caras',
        title: 'Ceder en planes por miedo al enfado o frialdad',
        cat: 'Pareja',
        trigger: 'Me proponen un plan cuando estoy agotado/a o no me apetece.',
        response: 'Digo que sí rápido fingiendo entusiasmo o me callo.',
        short: 'Evito tensión inmediata y caras largas.',
        long: 'Agotamiento, resentimiento acumulado y distancia interna.',
        exp: 'Pedir 15 minutos antes de responder sí o no para consultar qué quiero realmente.'
      },
      {
        chip: '💼 Asumir carga extra en el trabajo sin decir no',
        title: 'Asumir tareas fuera de horario o alcance por miedo a decepcionar',
        cat: 'Trabajo',
        trigger: 'Llega una petición urgente al final del día o fuera de mis funciones.',
        response: 'Acepto de inmediato y me quedo hasta tarde para cumplir.',
        short: 'Me perciben disponible y evito incomodar.',
        long: 'Estrés crónico, pérdida de descanso y resentimiento laboral.',
        exp: 'Responder: «Puedo revisarlo mañana a primera hora o repriorizar lo actual».'
      },
      {
        chip: '💬 Sobre-justificarme cuando alguien cambia el tono',
        title: 'Dar mil explicaciones cuando noto silencio o frialdad ajena',
        cat: 'Familia',
        trigger: 'Alguien cercano suspira, cambia el tono o se queda serio.',
        response: 'Me pongo en alerta y doy excusas durante minutos para recuperar aprobación.',
        short: 'Calmo momentáneamente mi ansiedad por el vínculo.',
        long: 'Desgaste mental, hipervigilancia e inseguridad.',
        exp: 'Expresar mi límite o postura en 1 sola frase amable y sostener 15 segundos de silencio.'
      }
    ];

    modalBody.innerHTML = `
      <h3 class="card-title">Mapear un Bucle Recurrente</h3>
      <p class="card-subtitle mt-1">Describe tu caso con tus palabras o abre ejemplos si te quedas en blanco.</p>

      <div style="margin-top: 8px; margin-bottom: 12px;">
        <button type="button" class="btn-inline-link" id="btn-radar-toggle-templates" style="font-size: 0.78rem;">
          💡 ¿Bloqueado? Ver plantillas de ejemplo
        </button>
        <div class="quick-chips-row hidden" id="radar-templates-row" style="margin-top: 8px;">
          ${patternTemplates.map((t, idx) => `
            <button type="button" class="quick-fill-chip" data-pattern-template="${idx}">
              ⚡ ${t.chip}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="modal-grid-2col">
        <div class="form-group">
          <label class="form-label" for="pat-title">Nombre del Patrón</label>
          <input type="text" id="pat-title" class="form-input" placeholder="Ej: Ceder en planes por miedo a mala cara">
        </div>

        <div class="form-group">
          <label class="form-label" for="pat-cat">Ámbito</label>
          <select id="pat-cat" class="form-input">
            <option value="Pareja">Pareja</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Familia">Familia</option>
            <option value="Amigos">Amigos</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div class="modal-grid-2col mt-3">
        <div class="form-group">
          <label class="form-label" for="pat-trigger">1. Detonante habitual</label>
          <input type="text" id="pat-trigger" class="form-input" placeholder="Qué situación o gesto dispara el bucle...">
        </div>

        <div class="form-group">
          <label class="form-label" for="pat-response">2. Mi respuesta automática</label>
          <input type="text" id="pat-response" class="form-input" placeholder="Qué haces de inmediato por reflejo...">
        </div>

        <div class="form-group">
          <label class="form-label" for="pat-short">3. Alivio inmediato (Falsa Paz)</label>
          <input type="text" id="pat-short" class="form-input" placeholder="Qué evitas a corto plazo...">
        </div>

        <div class="form-group">
          <label class="form-label" for="pat-long">4. Coste a largo plazo</label>
          <input type="text" id="pat-long" class="form-input" placeholder="Qué factura pagas después...">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="pat-exp">🧪 Experimento ACT de la Semana</label>
        <textarea id="pat-exp" class="form-textarea" rows="2" style="min-height: 68px;" placeholder="Un micro-cambio pequeño y realista para esta semana..."></textarea>
        ${this.renderOppositesGeneratorHtml()}
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
        <button type="button" class="btn-primary" id="btn-modal-save-pattern">Guardar Patrón</button>
      </div>
    `;

    modal.classList.add('active');
    this.bindOppositesGenerator(modalBody, 'pat-exp');

    document.getElementById('btn-radar-toggle-templates')?.addEventListener('click', (e) => {
      const row = document.getElementById('radar-templates-row');
      if (!row) return;
      const isHidden = row.classList.toggle('hidden');
      e.currentTarget.textContent = isHidden
        ? '💡 ¿Bloqueado? Ver plantillas de ejemplo'
        : '▴ Ocultar plantillas de ejemplo';
    });

    modalBody.querySelectorAll('[data-pattern-template]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = patternTemplates[parseInt(btn.dataset.patternTemplate, 10)];
        if (!t) return;
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val;
        };
        setVal('pat-title', t.title);
        setVal('pat-cat', t.cat);
        setVal('pat-trigger', t.trigger);
        setVal('pat-response', t.response);
        setVal('pat-short', t.short);
        setVal('pat-long', t.long);
        setVal('pat-exp', t.exp);
        modalBody.querySelectorAll('[data-pattern-template]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    document.getElementById('btn-modal-save-pattern')?.addEventListener('click', () => {
      const title = document.getElementById('pat-title')?.value?.trim();
      const cat = document.getElementById('pat-cat')?.value || 'Pareja';
      const trigger = document.getElementById('pat-trigger')?.value?.trim();
      const autoResponse = document.getElementById('pat-response')?.value?.trim();
      const shortTermGain = document.getElementById('pat-short')?.value?.trim();
      const longTermCost = document.getElementById('pat-long')?.value?.trim();
      const expText = document.getElementById('pat-exp')?.value?.trim();

      if (!title) {
        window.app?.showToast('Por favor dale un nombre al patrón');
        return;
      }

      window.stateManager.addPattern({
        title,
        category: cat,
        loop: { trigger, autoResponse, shortTermGain, longTermCost },
        weeklyExperiment: { text: expText || 'Observar el detonante cuando ocurra y respirar 3 veces antes de responder.' }
      });

      modal.classList.remove('active');
      window.app?.showToast('Patrón recurrente registrado');
      this.render();
      this.bindEvents();
    });
  }

  openEditExperimentModal(patternId) {
    const patterns = window.stateManager.getPatterns();
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return;

    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    window.app?.setModalSize?.('medium');

    modalBody.innerHTML = `
      <h3 class="card-title">Definir Experimento Semanal</h3>
      <p class="card-subtitle mt-2">Para el patrón: <strong>${pattern.title}</strong></p>

      <div class="form-group mt-4">
        <label class="form-label" for="edit-exp-text">Experimento de conducta ACT</label>
        <p class="form-hint">Debe ser una micro-acción realista, no un cambio titánico inalcanzable:</p>
        <textarea id="edit-exp-text" class="form-textarea" style="min-height: 100px;">${pattern.weeklyExperiment?.text || ''}</textarea>
      </div>

      ${this.renderOppositesGeneratorHtml()}

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
        <button type="button" class="btn-primary" id="btn-modal-save-exp">Guardar Experimento</button>
      </div>
    `;

    modal.classList.add('active');
    this.bindOppositesGenerator(modalBody, 'edit-exp-text');

    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    document.getElementById('btn-modal-save-exp')?.addEventListener('click', () => {
      const text = document.getElementById('edit-exp-text')?.value?.trim();
      if (!text) {
        window.app?.showToast('Por favor describe el experimento');
        return;
      }

      window.stateManager.updatePattern(patternId, {
        weeklyExperiment: {
          text,
          definedAt: Date.now(),
          targetDate: Date.now() + (7 * 24 * 60 * 60 * 1000)
        }
      });

      modal.classList.remove('active');
      window.app?.showToast('Experimento semanal actualizado');
      this.render();
      this.bindEvents();
    });
  }

  openCheckinModal(patternId) {
    const patterns = window.stateManager.getPatterns();
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return;

    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    window.app?.setModalSize?.('default');

    modalBody.innerHTML = `
      <h3 class="card-title">Check-in Semanal del Experimento</h3>
      <p class="card-subtitle mt-2">
        Experimento: <em>"${pattern.weeklyExperiment?.text || 'Sin definir'}"</em>
      </p>

      <div class="form-group mt-4">
        <label class="form-label">¿Cómo resultó esta semana?</label>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
          <label class="btn-secondary" style="display: flex; align-items: center; gap: 10px; cursor: pointer; text-align: left;">
            <input type="radio" name="chk-status" value="completed" checked>
            <span><strong>🌟 Conseguido:</strong> Apliqué la micro-acción y sostuve la incomodidad</span>
          </label>
          <label class="btn-secondary" style="display: flex; align-items: center; gap: 10px; cursor: pointer; text-align: left;">
            <input type="radio" name="chk-status" value="in_progress">
            <span><strong>🌿 En progreso:</strong> Lo intenté o me di cuenta justo a tiempo</span>
          </label>
          <label class="btn-secondary" style="display: flex; align-items: center; gap: 10px; cursor: pointer; text-align: left;">
            <input type="radio" name="chk-status" value="delayed">
            <span><strong>💧 Caí en el piloto:</strong> Cedo de nuevo pero me trato con compasión</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="chk-learned">¿Qué aprendiste sobre tu mente o sobre la situación?</label>
        <textarea id="chk-learned" class="form-textarea" placeholder="Ej: Descubrí que la otra persona no se molestó tanto como mi mente predecía, o noté mucha culpa que fue bajando tras 10 minutos..."></textarea>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-modal-cancel">Cancelar</button>
        <button type="button" class="btn-primary" id="btn-modal-save-chk">Guardar Check-in</button>
      </div>
    `;

    modal.classList.add('active');

    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    document.getElementById('btn-modal-save-chk')?.addEventListener('click', () => {
      const selectedRadio = document.querySelector('input[name="chk-status"]:checked');
      const status = selectedRadio ? selectedRadio.value : 'completed';
      const learned = document.getElementById('chk-learned')?.value?.trim() || 'Sin comentarios adicionales.';

      window.stateManager.addPatternCheckin(patternId, {
        status,
        learned
      });

      modal.classList.remove('active');
      window.app?.showToast('Check-in semanal guardado');
      this.render();
      this.bindEvents();
    });
  }
}

window.radarPatronesApp = new RadarPatronesApp();
