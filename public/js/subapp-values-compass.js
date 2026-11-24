/**
 * ECOSISTEMA ACT - Sub-App 5: La Brújula de Valores
 * Clarificación rápida en 2 pasos: Situación/Bloqueo → Valor Faro y Micro-Acción
 */

class BrujulaValoresApp {
  constructor() {
    this.currentStep = 1; // 1: Situación, 2: Bloqueo, 3: Valor, 4: Micro-acción
    this.totalSteps = 4;
    this.valuesCatalog = [
      { id:'Dignidad', icon:'', desc:'Autorrespeto sin ceder por miedo' },
      { id:'Autocuidado', icon:'', desc:'Proteger mi energía y descanso' },
      { id:'Honestidad', icon:'', desc:'Decir mi verdad con serenidad' },
      { id:'Paz Interior', icon:'', desc:'Calma real sin sumisión interna' },
      { id:'Autonomía', icon:'', desc:'Elegir por mí, no por presión' },
      { id:'Valentía', icon:'', desc:'Sostener un límite incómodo' },
      { id:'Respeto Mutuo', icon:'', desc:'Acuerdos justos para ambos' },
      { id:'Presencia y Calma', icon:'', desc:'Aterrizar aquí ante la duda' },
      { id:'Compasión Propia', icon:'', desc:'Tratarme con amabilidad humana' }
    ];

    this.situationChips = [
      'Me piden algo para lo que hoy no tengo energía',
      'Quiero decir «no» a un plan sin dar mil excusas',
      'Temo que se enfaden o pongan mala cara si pongo un límite',
      'Estoy sobrecargado/a y dudo si parar a descansar',
      'Me callo lo que pienso para no generar tensión'
    ];

    this.barrierOptions = [
      {
        id: 'miedo_enfado',
        label:'Miedo al enfado o mala cara ajena',
        motive: 'Complacencia por miedo al conflicto o rechazo',
        shortVsLong: 'Alivio inmediato por fuera, pero agotamiento y falsa paz por dentro',
        fear: 'Que se enfaden o me retiren el afecto si pongo un límite'
      },
      {
        id: 'culpa',
        label:'Culpa o sentir que soy egoísta',
        motive: 'Fusión con la culpa al priorizar mis necesidades',
        shortVsLong: 'Evito sentirme egoísta ahora, pero acumulo desgaste y resentimiento',
        fear: 'Creer que soy mala persona por cuidar mi energía'
      },
      {
        id: 'agobio',
        label:'Agobio / Querer quitármelo de encima ya',
        motive: 'Evitación experiencial: huir de la incomodidad física',
        shortVsLong: 'Alivio pasajero ahora, pero mi mundo y mi margen se encogen',
        fear: 'Que la angustia o la incertidumbre serán insoportables'
      },
      {
        id: 'piloto',
        label:'Inercia de complacer en automático',
        motive: 'Piloto automático de decir «sí» sin consultar conmigo',
        shortVsLong: 'Respondo rápido para destensar, pero me traiciono otra vez',
        fear: 'No saber sostener un silencio o una respuesta firme'
      }
    ];

    this.actionChips = [
      'Tomar una pausa antes de dar una respuesta definitiva',
      'Decir con amabilidad que hoy no puedo, en 1 sola frase sin justificarme',
      'Expresar con calma lo que sí necesito o prefiero hacer',
      'Sostener mi decisión aunque al otro no le encante al principio'
    ];

    this.selectedBarrierId = '';
    this.customBarrierText = '';
    this.showSitExamples = false;
    this.showValueExamples = false;
    this.showActionExamples = false;
    this.formData = {
      situation: '',
      selectedValue: '',
      answers: {
        motive: '',
        shortVsLong: '',
        fear: ''
      },
      keyAction: ''
    };
  }

  init() {
    this.render();
    this.bindEvents();
  }

  reset() {
    this.currentStep = 1;
    this.selectedBarrierId = '';
    this.customBarrierText = '';
    this.showSitExamples = false;
    this.showValueExamples = false;
    this.showActionExamples = false;
    this.formData = {
      situation: '',
      selectedValue: '',
      answers: {
        motive: '',
        shortVsLong: '',
        fear: ''
      },
      keyAction: ''
    };
    this.render();
    this.bindEvents();
  }

  setStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    const prevStep = this.currentStep;
    this.currentStep = step;
    window.KhoraUI?.prepareTypeformTransition?.('compass-view');
    this.render();
    window.KhoraUI?.animateTypeformTransition?.('compass-view', prevStep, step, this.totalSteps);
    this.bindEvents();
    window.KhoraUtils.scrollToTop();
  }

  render() {
    const container = document.getElementById('compass-view');
    if (!container) return;

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

    const historyEntries = window.stateManager.getCompassEntries();

    container.innerHTML = `
      ${window.KhoraUI.renderTypeformShell({
        currentStep: this.currentStep,
        totalSteps: this.totalSteps,
        steps: [
          { step: 1, label: '1. Situación' },
          { step: 2, label: '2. Valor' },
          { step: 3, label: '3. Pasajero' },
          { step: 4, label: '4. Acción' }
        ],
        navAriaLabel: 'Pasos de Brújula de Valores',
        helpTopic: 'brujula-valores',
        bodyId: 'compass-body',
        stepHtml
      })}

      ${this.currentStep === 1 && historyEntries.length > 0 ? `
        <div class="card mt-4" style="max-width: 660px; margin-left: auto; margin-right: auto;">
          <div class="card-header" style="margin-bottom: 12px;">
            <div class="title-with-help">
              <h3 class="card-title" style="font-size: 1.05rem; margin: 0;">Nortes Fijados Recientemente</h3>
              <button type="button" class="help-info-trigger" data-help-topic="nortes-recientes" aria-label="Información de esta herramienta">?</button>
            </div>
          </div>
          <div>
            ${historyEntries.slice(0, 3).map(entry => {
              const esc = window.KhoraUtils.escapeHtml;
              return `
              <div class="history-item" style="background-color: var(--bg-surface-elevated);">
                <div class="history-header" style="flex-wrap: wrap; gap: 6px;">
                  <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                    <span class="history-tag espacio-act">Valor: ${esc(entry.selectedValue)}</span>
                    ${window.stateManager?.isExampleItem?.(entry) ? '<span class="badge example-item-badge">Ejemplo guía</span>' : ''}
                  </div>
                  <span class="history-date">${new Date(entry.timestamp).toLocaleDateString('es-ES')}</span>
                </div>
                <div class="history-title">"${esc(entry.situation || 'Situación de encrucijada')}"</div>
                <div class="history-detail" style="color: var(--sage-700); font-weight: 600;">
                  Acción elegida: "${esc(entry.keyAction)}"
                </div>
              </div>
            `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  renderStep1() {
    const esc = window.KhoraUtils.escapeHtml;
    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿En qué situación dudas o sientes presión?</h3>
      </div>

      <div class="form-group">
        <textarea id="compass-situation" class="form-textarea" rows="3" style="min-height: 84px;" placeholder="Descríbelo en una línea…">${esc(this.formData.situation)}</textarea>
        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-compass-toggle-sit" style="font-size: 0.8rem;">
            ${this.showSitExamples ? 'Ocultar ideas' : 'Ver ideas'}
          </button>
          ${this.showSitExamples ? `
            <div class="quick-chips-row" style="margin-top: 8px;">
              ${this.situationChips.map(sit => `
                <button type="button" class="quick-fill-chip ${this.formData.situation === sit ? 'active' : ''}" data-compass-sit-chip="${esc(sit)}">
                  ${esc(sit)}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" disabled>Atrás</button>
        <button type="button" class="btn-primary" id="btn-compass-next-1">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderStep2() {
    const esc = window.KhoraUtils.escapeHtml;
    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Qué te está frenando ahora?</h3>
      </div>

      <div class="form-group">
        <div class="chip-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
          ${this.barrierOptions.map(b => `
            <button type="button" class="chip-btn ${this.selectedBarrierId === b.id ? 'selected' : ''}" data-compass-barrier="${b.id}" style="padding: 12px 14px; text-align: left; align-items: flex-start;">
              <span style="font-weight: 700; font-size: 0.88rem;">${b.label}</span>
            </button>
          `).join('')}
          <button type="button" class="chip-btn ${this.selectedBarrierId === 'otro' ? 'selected' : ''}" data-compass-barrier="otro" style="padding: 12px 14px; text-align: left; align-items: flex-start;">
            <span style="font-weight: 700; font-size: 0.88rem;">Otro bloqueo / Escribirlo yo</span>
          </button>
        </div>
        ${this.selectedBarrierId === 'otro' ? `
          <input type="text" id="compass-custom-barrier" class="form-input mt-3" value="${esc(this.customBarrierText)}" placeholder="Escribe qué sientes que te frena…">
        ` : ''}
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-compass-prev-2">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-compass-next-2">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderStep3() {
    const profileValues = window.stateManager.getProfile()?.coreValues || [];
    const esc = window.KhoraUtils.escapeHtml;

    return `
      <div class="act-step-header">
        <h3 class="act-step-question">¿Qué valor guía tu respuesta hoy?</h3>
      </div>

      <div class="form-group">
        ${profileValues.length > 0 ? `
          <div class="quick-chips-row" style="margin-top: 0; margin-bottom: 10px;">
            ${profileValues.map(pv => {
              const labelVal = `${pv.domain}: ${pv.statement.slice(0, 38)}${pv.statement.length > 38 ? '…' : ''}`;
              const isSel = this.formData.selectedValue === labelVal;
              return `
                <button type="button" class="quick-fill-chip ${isSel ? 'active' : ''}" data-compass-val="${esc(labelVal)}" data-compass-micro="${esc(pv.microAction || '')}">
                  <strong>${esc(pv.domain)}:</strong> ${esc(pv.statement.slice(0, 34))}${pv.statement.length > 34 ? '…' : ''}
                </button>
              `;
            }).join('')}
          </div>
        ` : ''}

        <input type="text" id="compass-custom-value" class="form-input" value="${esc(this.formData.selectedValue)}"
               placeholder="Escribe tu valor (ej: Honestidad, Calma, Cuidado…)">

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-compass-toggle-val-examples" style="font-size: 0.8rem;">
            ${this.showValueExamples ? 'Ocultar ideas' : 'Ver ideas'}
          </button>
          ${this.showValueExamples ? `
            <div class="chip-grid mt-2" style="grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));">
              ${this.valuesCatalog.map(val => `
                <button type="button" class="chip-btn ${this.formData.selectedValue === val.id ? 'selected' : ''}" data-compass-val="${val.id}" style="padding: 10px 8px;">
                  <span style="font-weight: 700; font-size: 0.84rem;">${val.id}</span>
                  <small class="explanatory-subtext" style="font-size: 0.68rem; color: var(--text-muted); line-height: 1.25;">${val.desc}</small>
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-compass-prev-3">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-compass-next-3">
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderStep4() {
    const esc = window.KhoraUtils.escapeHtml;
    const valLabel = (this.formData.selectedValue || '').trim() || 'este valor';

    return `
      <div class="act-step-header">
        <h3 class="act-step-question">Si fueras fiel a «${esc(valLabel)}», ¿qué harías hoy?</h3>
      </div>

      <div class="form-group">
        <textarea id="compass-key-action" class="form-textarea" rows="3" style="min-height: 84px; font-size: 0.95rem;" placeholder="Escribe un paso concreto y pequeño para hoy…">${esc(this.formData.keyAction)}</textarea>

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-compass-toggle-action-examples" style="font-size: 0.8rem;">
            ${this.showActionExamples ? 'Ocultar ideas' : 'Ver ideas'}
          </button>
          ${this.showActionExamples ? `
            <div class="quick-chips-row" style="margin-top: 8px;">
              ${this.actionChips.map(act => `
                <button type="button" class="quick-fill-chip ${this.formData.keyAction === act ? 'active' : ''}" data-compass-action-chip="${esc(act)}">
                  + ${esc(act)}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="act-typeform-footer">
        <button type="button" class="btn-secondary" id="btn-compass-prev-4">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-compass-save">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Guardar y terminar
        </button>
      </div>
    `;
  }

  bindEvents() {
    const viewRoot = document.getElementById('compass-view') || document;
    viewRoot.querySelectorAll('[data-goto-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetStep = parseInt(e.currentTarget.dataset.gotoStep, 10);
        if (targetStep && targetStep !== this.currentStep) {
          this.setStep(targetStep);
        }
      });
    });

    // Step 1 Events
    const sitInput = document.getElementById('compass-situation');
    if (sitInput) {
      sitInput.addEventListener('input', (e) => {
        this.formData.situation = e.target.value;
      });
    }

    document.getElementById('btn-compass-toggle-sit')?.addEventListener('click', () => {
      this.showSitExamples = !this.showSitExamples;
      this.render();
      this.bindEvents();
    });

    document.querySelectorAll('[data-compass-sit-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.compassSitChip;
        this.formData.situation = val;
        if (sitInput) sitInput.value = val;
        document.querySelectorAll('[data-compass-sit-chip]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    document.querySelectorAll('[data-compass-barrier]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bId = e.currentTarget.dataset.compassBarrier;
        if (bId === 'otro') {
          this.selectedBarrierId = 'otro';
          this.formData.answers = {
            motive: this.customBarrierText || 'Otro bloqueo personal',
            shortVsLong: '',
            fear: ''
          };
          this.render();
          this.bindEvents();
          document.getElementById('compass-custom-barrier')?.focus?.();
          return;
        }
        const found = this.barrierOptions.find(b => b.id === bId);
        if (found) {
          this.selectedBarrierId = bId;
          this.formData.answers = {
            motive: found.motive,
            shortVsLong: found.shortVsLong,
            fear: found.fear
          };
          this.render();
          this.bindEvents();
        }
      });
    });

    document.getElementById('compass-custom-barrier')?.addEventListener('input', (e) => {
      this.customBarrierText = e.target.value;
      this.formData.answers = {
        motive: e.target.value || 'Otro bloqueo personal',
        shortVsLong: '',
        fear: ''
      };
    });

    document.getElementById('btn-compass-next-1')?.addEventListener('click', () => this.setStep(2));
    document.getElementById('btn-compass-prev-2')?.addEventListener('click', () => this.setStep(1));
    document.getElementById('btn-compass-next-2')?.addEventListener('click', () => this.setStep(3));

    // Step 3 Events
    document.getElementById('compass-custom-value')?.addEventListener('input', (e) => {
      this.formData.selectedValue = e.target.value;
    });

    document.getElementById('btn-compass-toggle-val-examples')?.addEventListener('click', () => {
      this.showValueExamples = !this.showValueExamples;
      this.render();
      this.bindEvents();
    });

    document.getElementById('btn-compass-prev-3')?.addEventListener('click', () => this.setStep(2));
    document.getElementById('btn-compass-next-3')?.addEventListener('click', () => {
      const valText = this.formData.selectedValue?.trim();
      if (!valText) {
        window.app?.showToast('Escribe o elige el valor que guía tu respuesta');
        document.getElementById('compass-custom-value')?.focus?.();
        return;
      }
      this.setStep(4);
    });

    // Step 4 Events
    document.getElementById('btn-compass-toggle-action-examples')?.addEventListener('click', () => {
      this.showActionExamples = !this.showActionExamples;
      this.render();
      this.bindEvents();
    });

    document.querySelectorAll('[data-compass-val]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.formData.selectedValue = e.currentTarget.dataset.compassVal;
        const suggestedMicro = e.currentTarget.dataset.compassMicro || '';
        if (suggestedMicro && !this.formData.keyAction?.trim()) {
          this.formData.keyAction = suggestedMicro;
        }
        this.render();
        this.bindEvents();
      });
    });

    const keyActionInput = document.getElementById('compass-key-action');
    if (keyActionInput) {
      keyActionInput.addEventListener('input', (e) => {
        this.formData.keyAction = e.target.value;
      });
    }

    document.querySelectorAll('[data-compass-action-chip]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const act = e.currentTarget.dataset.compassActionChip;
        this.formData.keyAction = act;
        if (keyActionInput) keyActionInput.value = act;
        document.querySelectorAll('[data-compass-action-chip]').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    document.getElementById('btn-compass-prev-4')?.addEventListener('click', () => this.setStep(3));

    document.getElementById('btn-compass-save')?.addEventListener('click', () => {
      const valText = this.formData.selectedValue?.trim();
      const actionText = this.formData.keyAction?.trim();
      if (!valText) {
        window.app?.showToast('Escribe o elige el valor que guía tu respuesta');
        document.getElementById('compass-custom-value')?.focus?.();
        return;
      }
      if (!actionText) {
        window.app?.showToast('Escribe o elige una micro-acción concreta');
        document.getElementById('compass-key-action')?.focus?.();
        return;
      }
      this.formData.selectedValue = valText;

      window.stateManager.addCompassEntry(this.formData);

      const container = document.getElementById('compass-view');
      if (!container) return;

      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 32px 20px;">
<div style="font-size: 2.4rem; margin-bottom: 10px;"></div>
          <h3 class="card-title">Norte fijado con éxito</h3>
          <p class="card-subtitle mt-2" data-keep-explanation="true" style="max-width: 480px; margin: 0 auto;">
            Elección consciente basada en <strong>${this.formData.selectedValue}</strong>.
          </p>

          <div class="card mt-4" style="background-color: var(--bg-surface-elevated); max-width: 480px; margin: 16px auto; text-align: left; border-left: 4px solid var(--sage-500);">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Tu Micro-Acción Elegida:</div>
            <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); line-height: 1.5;">
              "${actionText}"
            </div>
          </div>

          <div class="btn-group" style="justify-content: center; margin-top: 20px;">
            <button type="button" class="btn-secondary" id="btn-compass-restart">
              Hacer otra consulta
            </button>
            <button type="button" class="btn-primary" id="btn-compass-go-home">
              Volver al Inicio Guiado
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-compass-restart')?.addEventListener('click', () => {
        this.reset();
      });

      document.getElementById('btn-compass-go-home')?.addEventListener('click', () => {
        window.app?.navigate('home');
      });

      window.app?.showToast('Norte de valores fijado');
    });
  }
}

window.brujulaValoresApp = new BrujulaValoresApp();
