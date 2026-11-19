/**
 * ECOSISTEMA ACT - Sub-App 5: La Brújula de Valores
 * Clarificación rápida en 2 pasos: Situación/Bloqueo → Valor Faro y Micro-Acción
 */

class BrujulaValoresApp {
  constructor() {
    this.currentStep = 1; // 1: Situación y Bloqueo, 2: Valor Faro y Micro-Acción
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
      'Pedir 15 minutos antes de dar una respuesta definitiva',
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

  render() {
    const container = document.getElementById('brujula-valores-view');
    if (!container) return;

    const bodyContent = this.currentStep === 1 ? this.renderStep1() : this.renderStep2();
    const historyEntries = window.stateManager.getCompassEntries();

    container.innerHTML = `
      <div class="view-plain-shell">
        <div class="card-header flex-between" style="margin-bottom: 12px;">
          <div class="title-with-help">
<h2 class="card-title" style="margin: 0;">La Brújula de Valores</h2>
            <button type="button" class="help-info-trigger" data-help-topic="brujula-valores" aria-label="Información de esta herramienta">ⓘ</button>
          </div>
          <span class="badge" style="background: var(--sage-100); color: var(--sage-700);">
            Paso ${this.currentStep} de 2
          </span>
        </div>

        <div id="compass-body">
          ${bodyContent}
        </div>
      </div>

      ${historyEntries.length > 0 ? `
        <div class="card mt-4">
          <div class="card-header" style="margin-bottom: 12px;">
            <div class="title-with-help">
              <h3 class="card-title" style="font-size: 1.05rem; margin: 0;">Nortes Fijados Recientemente</h3>
              <button type="button" class="help-info-trigger" data-help-topic="nortes-recientes" aria-label="Información de esta herramienta">ⓘ</button>
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
      <div class="form-group">
        <label class="form-label" for="compass-situation">1. ¿En qué situación dudas o sientes presión?</label>
        <textarea id="compass-situation" class="form-textarea" rows="2" style="min-height: 68px;" placeholder="Describe con tus palabras la situación en 1 línea...">${esc(this.formData.situation)}</textarea>
        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-compass-toggle-sit" style="font-size: 0.78rem;">
            ${this.showSitExamples ?'▴ Ocultar ejemplos' :'¿Bloqueado? Ver ejemplos de situaciones'}
          </button>
          ${this.showSitExamples ? `
            <div class="quick-chips-row" style="margin-top: 8px;">
              ${this.situationChips.map(sit => `
                <button type="button" class="quick-fill-chip ${this.formData.situation === sit ? 'active' : ''}" data-compass-sit-chip="${esc(sit)}">
                  ${sit}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="form-group mt-4">
        <label class="form-label">2. ¿Qué te está frenando ahora mismo? (opcional)</label>
        <div class="chip-grid mt-2" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
          ${this.barrierOptions.map(b => `
            <button type="button" class="chip-btn ${this.selectedBarrierId === b.id ? 'selected' : ''}" data-compass-barrier="${b.id}" style="padding: 12px 14px; text-align: left; align-items: flex-start;">
              <span style="font-weight: 700; font-size: 0.86rem;">${b.label}</span>
            </button>
          `).join('')}
          <button type="button" class="chip-btn ${this.selectedBarrierId === 'otro' ? 'selected' : ''}" data-compass-barrier="otro" style="padding: 12px 14px; text-align: left; align-items: flex-start;">
<span style="font-weight: 700; font-size: 0.86rem;">Otro bloqueo / Escribirlo yo</span>
          </button>
        </div>
        ${this.selectedBarrierId === 'otro' ? `
          <input type="text" id="compass-custom-barrier" class="form-input mt-2" value="${esc(this.customBarrierText)}" placeholder="Escribe qué sientes que te frena...">
        ` : ''}
      </div>

      <div class="btn-group">
        <button type="button" class="btn-primary" id="btn-compass-next-1">
          Elegir Valor y Acción
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
  }

  renderStep2() {
    const profileValues = window.stateManager.getProfile()?.coreValues || [];
    const esc = window.KhoraUtils.escapeHtml;
    const valObj = this.valuesCatalog.find(v => v.id === this.formData.selectedValue) || {
      id: this.formData.selectedValue || 'este valor',
      icon:''
    };

    return `
      <div class="form-group">
        <label class="form-label" for="compass-custom-value">1. ¿Qué Valor guía tu respuesta hoy?</label>

        ${profileValues.length > 0 ? `
          <div style="margin-top: 6px; margin-bottom: 10px;">
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--sage-700); display: block; margin-bottom: 6px;">
              Tus Valores («Yo»):
            </span>
            <div class="quick-chips-row" style="margin-top: 0;">
              ${profileValues.map(pv => {
                const labelVal = `${pv.domain}: ${pv.statement.slice(0, 38)}${pv.statement.length > 38 ? '…' : ''}`;
                const isSel = this.formData.selectedValue === labelVal;
                return `
                  <button type="button" class="quick-fill-chip ${isSel ? 'active' : ''}" data-compass-val="${esc(labelVal)}" data-compass-micro="${esc(pv.microAction || '')}">
<strong>${esc(pv.domain)}:</strong> ${esc(pv.statement.slice(0, 34))}${pv.statement.length > 34 ?'…' :''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <input type="text" id="compass-custom-value" class="form-input" value="${esc(this.formData.selectedValue)}"
               placeholder="Escribe tu valor (ej: Presencia, Honestidad, Cuidado, Curiosidad...)">

        <div style="margin-top: 8px;">
          <button type="button" class="btn-inline-link" id="btn-compass-toggle-val-examples" style="font-size: 0.78rem;">
            ${this.showValueExamples ?'▴ Ocultar ejemplos de valores' :'¿Bloqueado? Ver ejemplos de valores'}
          </button>
          ${this.showValueExamples ? `
            <div class="chip-grid mt-2" style="grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));">
              ${this.valuesCatalog.map(val => `
                <button type="button" class="chip-btn ${this.formData.selectedValue === val.id ? 'selected' : ''}" data-compass-val="${val.id}" style="padding: 10px 8px;">
                  <span style="font-size: 1.35rem;">${val.icon}</span>
                  <span style="font-weight: 700; font-size: 0.84rem;">${val.id}</span>
                  <small style="font-size: 0.68rem; color: var(--text-muted); line-height: 1.25;">${val.desc}</small>
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="form-group mt-4">
        <div style="background: linear-gradient(135deg, var(--bg-surface-elevated), var(--bg-surface)); border: 1.5px solid var(--sage-400); border-radius: var(--radius-lg); padding: 18px;">
          <h3 style="font-size: 1.08rem; font-weight: 800; color: var(--text-primary); line-height: 1.4; margin-bottom: 10px;">
            ${valObj.icon} Si fueras fiel a «${esc(valObj.id)}», ¿qué harías concretamente?
          </h3>

          <textarea id="compass-key-action" class="form-textarea" rows="2" style="min-height: 78px; font-size: 0.94rem;" placeholder="Escribe con tus palabras una micro-acción concreta para hoy...">${this.formData.keyAction}</textarea>

          <div style="margin-top: 8px;">
            <button type="button" class="btn-inline-link" id="btn-compass-toggle-action-examples" style="font-size: 0.78rem;">
              ${this.showActionExamples ?'▴ Ocultar ejemplos' :'¿Necesitas ideas? Ver ejemplos de micro-acciones'}
            </button>
            ${this.showActionExamples ? `
              <div class="quick-chips-row" style="margin-top: 8px;">
                ${this.actionChips.map(act => `
                  <button type="button" class="quick-fill-chip ${this.formData.keyAction === act ? 'active' : ''}" data-compass-action-chip="${esc(act)}">
                    + ${act}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="btn-group" style="justify-content: space-between; margin-top: 20px;">
        <button type="button" class="btn-secondary" id="btn-compass-prev-2">← Atrás</button>
        <button type="button" class="btn-primary" id="btn-compass-save">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Fijar Mi Micro-Acción
        </button>
      </div>
    `;
  }

  bindEvents() {
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

    document.getElementById('btn-compass-next-1')?.addEventListener('click', () => {
      this.currentStep = 2;
      this.render();
      this.bindEvents();
    });

    // Step 2 Events
    document.getElementById('compass-custom-value')?.addEventListener('input', (e) => {
      this.formData.selectedValue = e.target.value;
    });

    document.getElementById('btn-compass-toggle-val-examples')?.addEventListener('click', () => {
      this.showValueExamples = !this.showValueExamples;
      this.render();
      this.bindEvents();
    });

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

    document.getElementById('btn-compass-prev-2')?.addEventListener('click', () => {
      this.currentStep = 1;
      this.render();
      this.bindEvents();
    });

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

      const container = document.getElementById('brujula-valores-view');
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
        window.app?.navigate('guia-inicio');
      });

      window.app?.showToast('Norte de valores fijado');
    });
  }
}

window.brujulaValoresApp = new BrujulaValoresApp();
