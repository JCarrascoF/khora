/**
 * ECOSISTEMA ACT - Sub-App 1: El Espejo de la Paz Falsa
 * Micro-diario guiado de 4 pasos para detectar autoabandono
 */

class PazFalsaApp {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.entryData = {
      context: 'Trabajo',
      situation: '',
      internalConflict: {
        wanted: '',
        did: ''
      },
      toll: {
        resentment: 5,
        physicalExhaustion: 5,
        anxiety: 4,
        emptiness: 3
      },
      note: ''
    };
    this.showSitExamples = false;
    this.showConflictExamples = false;
    this.situationChips = [
      'Acepté un plan o encargo cuando no tenía energía',
      'Me callé mi opinión para evitar una mala cara o discusión',
      'Pedí perdón o di mil explicaciones sin haber hecho nada malo',
      'Asumí una tarea o responsabilidad que no me correspondía'
    ];
    this.wantedChips = [
      'Decir que hoy necesito descansar',
      'Expresar que no estoy de acuerdo con calma',
      'Decir que no puedo encargarme de esto'
    ];
    this.didChips = [
      'Dije que sí sonriendo y me tragué el malestar',
      'Me callé y cambié de tema',
      'Me justifiqué de más y acabé cediendo'
    ];
  }

  init() {
    this.render();
    this.bindEvents();
  }

  resetForm() {
    this.currentStep = 1;
    this.showSitExamples = false;
    this.showConflictExamples = false;
    this.entryData = {
      context: 'Trabajo',
      situation: '',
      internalConflict: { wanted: '', did: '' },
      toll: { resentment: 5, physicalExhaustion: 5, anxiety: 4, emptiness: 3 },
      note: ''
    };
    this.render();
    this.bindEvents();
  }

  setStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    this.currentStep = step;
    this.render();
    this.bindEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const container = document.getElementById('paz-falsa-view');
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
<h2 class="card-title" style="margin: 0;">El Espejo de la Paz Falsa</h2>
            <button type="button" class="help-info-trigger" data-help-topic="paz-falsa" aria-label="Información de esta herramienta">ⓘ</button>
          </div>
          <span class="badge" style="background-color: var(--sage-100); color: var(--sage-700)">
            Paso ${this.currentStep} de ${this.totalSteps}
          </span>
        </div>

        <!-- Step Indicator Bar -->
        <div class="step-bar-container">
          <div class="step-bar-track">
            <div class="step-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="step-node ${this.currentStep >= 1 ? (this.currentStep === 1 ? 'active' : 'completed') : ''}">1</div>
          <div class="step-node ${this.currentStep >= 2 ? (this.currentStep === 2 ? 'active' : 'completed') : ''}">2</div>
          <div class="step-node ${this.currentStep >= 3 ? (this.currentStep === 3 ? 'active' : 'completed') : ''}">3</div>
          <div class="step-node ${this.currentStep >= 4 ? (this.currentStep === 4 ? 'active' : 'completed') : ''}">4</div>
        </div>

        <!-- Step Body -->
        <div id="pf-step-body">
          ${stepHtml}
        </div>
      </div>
    `;
  }

  renderStep1() {
    const contexts = [
      { id:'Pareja', label:'Pareja', icon:'', desc:'Vínculo y convivencia' },
      { id:'Trabajo', label:'Trabajo', icon:'', desc:'Jefes, equipo o clientes' },
      { id:'Familia', label:'Familia', icon:'', desc:'Padres o familiares' },
      { id:'Amigos', label:'Amigos', icon:'', desc:'Círculo social' },
      { id:'Otro', label:'Otro', icon:'', desc:'Otras situaciones' }
    ];

    return `
      <div class="form-group">
        <label class="form-label">¿Dónde acabas de ceder o callarte?</label>
        <div class="chip-grid mt-2">
          ${contexts.map(c => `
            <button type="button" class="chip-btn ${this.entryData.context === c.id ? 'selected' : ''}" data-context="${c.id}">
              <span style="font-size: 1.5rem;">${c.icon}</span>
              <span>${c.label}</span>
              <small style="font-size: 0.7rem; color: var(--text-muted);">${c.desc}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-primary" id="btn-pf-next-1">
          Continuar
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderStep2() {
    return `
      <div class="form-group">
        <label class="form-label" for="pf-situation">¿Qué ocurrió?</label>
        <textarea id="pf-situation" class="form-textarea mt-1" rows="2" style="min-height: 76px;" placeholder="Describe brevemente con tus palabras qué ocurrió...">${this.entryData.situation}</textarea>
        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-pf-toggle-sit-examples" style="font-size: 0.78rem;">
            ${this.showSitExamples ?'▴ Ocultar ejemplos' :'¿Bloqueado? Ver ejemplos'}
          </button>
          ${this.showSitExamples ? `
            <div class="quick-chips-row" style="margin-top: 8px;">
              ${this.situationChips.map(sit => `
                <button type="button" class="quick-fill-chip ${this.entryData.situation === sit ? 'active' : ''}" data-pf-sit-chip="${sit.replace(/"/g, '&quot;')}">
                  ${sit}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-pf-prev-2">Atrás</button>
        <button type="button" class="btn-primary" id="btn-pf-next-2">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderStep3() {
    return `
      <div class="form-group">
        <label class="form-label">La Verdad vs. La Máscara</label>
        
        <div class="mt-2" style="background-color: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border-left: 4px solid var(--sage-500); margin-bottom: 12px;">
          <label class="form-label" for="pf-wanted" style="color: var(--sage-700);">
            ¿Qué quería hacer o decir yo realmente?
          </label>
          <textarea id="pf-wanted" class="form-textarea mt-1" style="min-height: 64px;" placeholder="Lo que necesitabas de verdad...">${this.entryData.internalConflict.wanted}</textarea>
          ${this.showConflictExamples ? `
            <div class="quick-chips-row" style="margin-top: 8px;">
              ${this.wantedChips.map(w => `
                <button type="button" class="quick-fill-chip ${this.entryData.internalConflict.wanted === w ? 'active' : ''}" data-pf-wanted-chip="${w.replace(/"/g, '&quot;')}">
                  ${w}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div style="background-color: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border-left: 4px solid var(--accent-tension);">
          <label class="form-label" for="pf-did" style="color: var(--accent-tension);">
            ¿Qué hice al final?
          </label>
          <textarea id="pf-did" class="form-textarea mt-1" style="min-height: 64px;" placeholder="Cómo actuaste por fuera...">${this.entryData.internalConflict.did}</textarea>
          ${this.showConflictExamples ? `
            <div class="quick-chips-row" style="margin-top: 8px;">
              ${this.didChips.map(d => `
                <button type="button" class="quick-fill-chip ${this.entryData.internalConflict.did === d ? 'active' : ''}" data-pf-did-chip="${d.replace(/"/g, '&quot;')}">
                  ${d}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-pf-toggle-conflict-examples" style="font-size: 0.78rem;">
            ${this.showConflictExamples ?'▴ Ocultar ejemplos' :'¿Bloqueado? Ver ejemplos'}
          </button>
        </div>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-pf-prev-3">Atrás</button>
        <button type="button" class="btn-primary" id="btn-pf-next-3">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderStep4() {
    const toll = this.entryData.toll;
    return `
      <div class="form-group">
        <div class="title-with-help" style="margin-bottom: 4px;">
          <label class="form-label" style="margin-bottom: 0;">El Peaje Emocional</label>
          <button type="button" class="help-info-trigger" data-help-topic="peaje-emocional" aria-label="Información de esta herramienta">ⓘ</button>
        </div>

        <!-- Sliders -->
        <div class="slider-group mt-4">
          <div class="slider-header">
<span>Resentimiento hacia la otra persona o situación</span>
            <span class="slider-val-badge" id="val-resentment">${toll.resentment}/10</span>
          </div>
          <input type="range" class="range-slider" id="slider-resentment" min="0" max="10" value="${toll.resentment}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>Agotamiento Físico o Pesadez Somática</span>
            <span class="slider-val-badge" id="val-exhaustion">${toll.physicalExhaustion}/10</span>
          </div>
          <input type="range" class="range-slider" id="slider-exhaustion" min="0" max="10" value="${toll.physicalExhaustion}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>Ansiedad o Hipervigilancia</span>
            <span class="slider-val-badge" id="val-anxiety">${toll.anxiety}/10</span>
          </div>
          <input type="range" class="range-slider" id="slider-anxiety" min="0" max="10" value="${toll.anxiety}">
        </div>

        <div class="slider-group">
          <div class="slider-header">
<span>Sensación de Vacío o Desconexión de Uno Mismo</span>
            <span class="slider-val-badge" id="val-emptiness">${toll.emptiness}/10</span>
          </div>
          <input type="range" class="range-slider" id="slider-emptiness" min="0" max="10" value="${toll.emptiness}">
        </div>

        <!-- Venting note -->
        <div class="form-group mt-4">
          <label class="form-label" for="pf-note">Nota de desahogo libre (opcional)</label>
          <textarea id="pf-note" class="form-textarea" placeholder="Escribe aquí cualquier sensación o pensamiento crudo para vaciar la mente...">${this.entryData.note}</textarea>
        </div>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-secondary" id="btn-pf-prev-4">Atrás</button>
        <button type="button" class="btn-primary" id="btn-pf-save">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Registrar en mi Diario Privado
        </button>
      </div>
    `;
  }

  bindEvents() {
    // Step 1 Context Selectors
    const contextChips = document.querySelectorAll('.chip-btn[data-context]');
    contextChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const target = e.currentTarget;
        this.entryData.context = target.dataset.context;
        contextChips.forEach(c => c.classList.remove('selected'));
        target.classList.add('selected');
      });
    });

    const next1 = document.getElementById('btn-pf-next-1');
    if (next1) {
      next1.addEventListener('click', () => this.setStep(2));
    }

    // Step 2
    const prev2 = document.getElementById('btn-pf-prev-2');
    const next2 = document.getElementById('btn-pf-next-2');
    const situationInput = document.getElementById('pf-situation');
    if (situationInput) {
      situationInput.addEventListener('input', (e) => {
        this.entryData.situation = e.target.value;
      });
    }
    document.querySelectorAll('[data-pf-sit-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.pfSitChip;
        this.entryData.situation = val;
        if (situationInput) situationInput.value = val;
        document.querySelectorAll('[data-pf-sit-chip]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
    document.getElementById('btn-pf-toggle-sit-examples')?.addEventListener('click', () => {
      this.showSitExamples = !this.showSitExamples;
      this.render();
      this.bindEvents();
    });
    if (prev2) prev2.addEventListener('click', () => this.setStep(1));
    if (next2) next2.addEventListener('click', () => this.setStep(3));

    // Step 3
    const prev3 = document.getElementById('btn-pf-prev-3');
    const next3 = document.getElementById('btn-pf-next-3');
    document.getElementById('btn-pf-toggle-conflict-examples')?.addEventListener('click', () => {
      this.showConflictExamples = !this.showConflictExamples;
      this.render();
      this.bindEvents();
    });
    const wantedInput = document.getElementById('pf-wanted');
    const didInput = document.getElementById('pf-did');
    if (wantedInput) {
      wantedInput.addEventListener('input', (e) => {
        this.entryData.internalConflict.wanted = e.target.value;
      });
    }
    if (didInput) {
      didInput.addEventListener('input', (e) => {
        this.entryData.internalConflict.did = e.target.value;
      });
    }
    document.querySelectorAll('[data-pf-wanted-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.pfWantedChip;
        this.entryData.internalConflict.wanted = val;
        if (wantedInput) wantedInput.value = val;
        document.querySelectorAll('[data-pf-wanted-chip]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
    document.querySelectorAll('[data-pf-did-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.pfDidChip;
        this.entryData.internalConflict.did = val;
        if (didInput) didInput.value = val;
        document.querySelectorAll('[data-pf-did-chip]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
    if (prev3) prev3.addEventListener('click', () => this.setStep(2));
    if (next3) next3.addEventListener('click', () => this.setStep(4));

    // Step 4 Sliders
    const setupSlider = (id, key, badgeId) => {
      const slider = document.getElementById(id);
      const badge = document.getElementById(badgeId);
      if (slider && badge) {
        slider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.entryData.toll[key] = val;
          badge.textContent = `${val}/10`;
        });
      }
    };

    setupSlider('slider-resentment', 'resentment', 'val-resentment');
    setupSlider('slider-exhaustion', 'physicalExhaustion', 'val-exhaustion');
    setupSlider('slider-anxiety', 'anxiety', 'val-anxiety');
    setupSlider('slider-emptiness', 'emptiness', 'val-emptiness');

    const noteInput = document.getElementById('pf-note');
    if (noteInput) {
      noteInput.addEventListener('input', (e) => {
        this.entryData.note = e.target.value;
      });
    }

    const prev4 = document.getElementById('btn-pf-prev-4');
    if (prev4) prev4.addEventListener('click', () => this.setStep(3));

    const saveBtn = document.getElementById('btn-pf-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveEntry());
    }
  }

  saveEntry() {
    const entry = window.stateManager.addPazFalsaEntry(this.entryData);

    const container = document.getElementById('paz-falsa-view');
    if (!container) return;

    // Show empathetic ACT validation screen
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 36px 20px;">
        <div style="width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 50%; background-color: var(--sage-100); display: flex; align-items: center; justify-content: center; color: var(--sage-600);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 class="card-title">Has nombrado la verdad con valentía</h3>
        <p class="card-subtitle mt-2" style="max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Observar el coste de la falsa paz no es para juzgarte, sino para recuperar la lealtad contigo mismo. 
          Tu dolor y tu resentimiento son señales de que tus límites importan.
        </p>

        <div class="card mt-4" style="background-color: var(--bg-surface-elevated); max-width: 480px; margin-left: auto; margin-right: auto; text-align: left;">
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Contexto: <strong>${entry.context}</strong></div>
          <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">"${entry.situation || 'Momento de concesión'}"</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
            <span class="badge" style="background: rgba(184, 107, 89, 0.15); color: var(--accent-tension);">Resentimiento: ${entry.toll.resentment}/10</span>
            <span class="badge" style="background: rgba(96, 123, 139, 0.15); color: var(--accent-sorrow);">Agotamiento: ${entry.toll.physicalExhaustion}/10</span>
          </div>
        </div>

        <div class="btn-group" style="justify-content: center; margin-top: 24px;">
          <button type="button" class="btn-secondary" id="btn-pf-new">
            Nuevo Registro
          </button>
          <button type="button" class="btn-primary" id="btn-pf-go-insight">
            Ver en Panel de Insight
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-pf-new')?.addEventListener('click', () => {
      this.resetForm();
    });

    document.getElementById('btn-pf-go-insight')?.addEventListener('click', () => {
      window.app?.navigate('insight');
    });

    window.app?.showToast('Registro de autoabandono guardado');
  }
}

window.pazFalsaApp = new PazFalsaApp();
