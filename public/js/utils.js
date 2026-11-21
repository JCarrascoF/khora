/**
 * Shared client-side utilities and UI component primitives for Khōra.
 * Loaded before subapps and app.js.
 */
(function (global) {
  'use strict';

  /**
   * Escapes a value for safe interpolation into HTML text or double/single-quoted attributes.
   * @param {unknown} value
   * @returns {string}
   */
  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Smoothly scrolls the window to the top of the page.
   */
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Shared canonical UI primitives.
   * Use these helpers across subapps to ensure visual consistency and single-point iteration.
   */
  const KhoraUI = Object.freeze({
    /**
     * Renders a standardized step or card header with title, optional contextual help trigger and step badge.
     * @param {Object} options
     * @param {string} options.title - Header title
     * @param {number} [options.currentStep] - Current step index (1-based)
     * @param {number} [options.totalSteps] - Total steps
     * @param {string} [options.helpTopic] - Data-help-topic key for contextual help (?)
     * @param {string} [options.helpAriaLabel] - Accessibility label for help button
     * @param {string} [options.badgeStyle] - Optional inline style or class
     * @returns {string} HTML string
     */
    renderHeader({ title, currentStep, totalSteps, badgeStyle = '' }) {
      const esc = escapeHtml;
      const badge = (currentStep && totalSteps)
        ? `<span class="badge" style="${badgeStyle || 'background-color: var(--sage-100); color: var(--sage-700);'}">Paso ${esc(currentStep)} de ${esc(totalSteps)}</span>`
        : '';
      return `
        <div class="card-header flex-between" style="margin-bottom: 12px;">
          <div class="title-with-help">
            <h2 class="card-title" style="margin: 0;">${esc(title)}</h2>
          </div>
          ${badge}
        </div>
      `.trim();
    },

    /**
     * Renders a standardized Typeform-style focused single-column step shell.
     * @param {Object} options
     * @param {number} options.currentStep - 1-based current step
     * @param {number} options.totalSteps - Total number of steps
     * @param {string} [options.helpTopic] - Optional contextual help topic key
     * @param {string} [options.bodyId='typeform-step-body'] - ID for the step body container
     * @param {string} [options.stepHtml=''] - Inner HTML for the current step
     * @param {boolean} [options.compact=false] - Compact mode for modals (no outer max-width margin)
     * @returns {string} HTML string
     */
    renderTypeformShell({
      currentStep,
      totalSteps,
      steps = [],
      navAriaLabel = 'Pasos',
      backId = '',
      backLabel = '← Volver',
      bodyId = 'typeform-step-body',
      stepHtml = '',
      compact = false
    }) {
      const esc = escapeHtml;
      const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 100;
      const backBtn = backId
        ? `<button type="button" class="btn-inline-link" id="${esc(backId)}">${esc(backLabel)}</button>`
        : '';
      const stepsNav = Array.isArray(steps) && steps.length > 0
        ? `
          <nav class="act-typeform-steps-nav" aria-label="${esc(navAriaLabel)}">
            ${steps.map(s => {
              const cls = s.step === currentStep ? 'active' : (s.step < currentStep ? 'completed' : '');
              return `<button type="button" class="act-step-pill ${cls}" data-goto-step="${esc(s.step)}" ${s.step === currentStep ? 'aria-current="step"' : ''}>${esc(s.label)}</button>`;
            }).join('')}
          </nav>
        `.trim()
        : '';

      return `
        <div class="act-typeform-shell" ${compact ? 'style="max-width: 100%; margin: 0;"' : ''}>
          <div class="act-typeform-topbar">
            <div class="act-typeform-topbar-row">
              <span class="badge" style="background-color: rgba(87, 139, 116, 0.16); color: var(--sage-700)">
                ${esc(currentStep)} / ${esc(totalSteps)}
              </span>
              ${backBtn}
            </div>
            <div class="act-progress-track" role="progressbar" aria-valuenow="${esc(currentStep)}" aria-valuemin="1" aria-valuemax="${esc(totalSteps)}">
              <div class="act-progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
            ${stepsNav}
          </div>

          <div id="${esc(bodyId)}" class="act-typeform-stage">
            ${stepHtml}
          </div>
        </div>
      `.trim();
    },

    /**
     * Renders a multi-step progress stepper (nodes, pills, hairline or minimal text).
     * @param {Object} options
     * @param {number} options.currentStep - Current step index (1-based)
     * @param {number} options.totalSteps - Total steps
     * @param {Array<{step: number, label: string}>} [options.steps] - Step labels (for pills or labeled nodes)
     * @param {'nodes' | 'pills' | 'text' | 'hairline'} [options.variant='nodes']
     * @returns {string} HTML string
     */
    renderStepper({ currentStep, totalSteps, steps = [], variant = 'nodes' }) {
      const esc = escapeHtml;
      const progressPercent = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 100;

      if (variant === 'pills' && steps.length > 0) {
        return `
          <div class="act-progress-track" role="progressbar" aria-valuenow="${esc(currentStep)}" aria-valuemin="1" aria-valuemax="${esc(totalSteps)}">
            <div class="act-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <nav class="act-typeform-steps-nav" aria-label="Pasos">
            ${steps.map(s => {
              const cls = s.step === currentStep ? 'active' : (s.step < currentStep ? 'completed' : '');
              return `<button type="button" class="act-step-pill ${cls}" data-goto-step="${esc(s.step)}" ${s.step === currentStep ? 'aria-current="step"' : ''}>${esc(s.label)}</button>`;
            }).join('')}
          </nav>
        `.trim();
      }

      if (variant === 'text') {
        return `<span class="step-info-badge">Paso ${esc(currentStep)} de ${esc(totalSteps)}</span>`;
      }

      if (variant === 'hairline') {
        return `
          <div class="cozy-loop-box" role="navigation" aria-label="Pasos">
            ${steps.map((s, idx) => {
              const num = String(idx + 1).padStart(2, '0');
              const isActive = (idx + 1) === currentStep;
              const lbl = typeof s === 'object' ? s.label : s;
              return `<span class="cozy-loop-step ${isActive ? 'active' : ''}">${num} · ${esc(lbl)}</span>`;
            }).join('')}
          </div>
        `.trim();
      }

      // Default: 'nodes'
      let nodesHtml = '';
      for (let i = 1; i <= totalSteps; i++) {
        const cls = currentStep >= i ? (currentStep === i ? 'active' : 'completed') : '';
        nodesHtml += `<div class="step-node ${cls}">${i}</div>`;
      }

      return `
        <div class="step-bar-container">
          <div class="step-bar-track">
            <div class="step-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          ${nodesHtml}
        </div>
      `.trim();
    },

    /**
     * Renders a bottom action button group (Back / Next or Save).
     * @param {Object} options
     * @param {string} [options.prevId] - ID for the back button (if omitted, no back button)
     * @param {string} [options.prevLabel='Atrás']
     * @param {string} [options.nextId] - ID for next button
     * @param {string} [options.nextLabel='Continuar']
     * @param {string} [options.nextIcon] - SVG icon html or null
     * @param {string} [options.extraHtml=''] - Extra button or link in the group
     * @returns {string} HTML string
     */
    renderActionBar({ prevId, prevLabel = 'Atrás', nextId, nextLabel = 'Continuar', nextIcon = '', extraHtml = '' }) {
      const esc = escapeHtml;
      const prevBtn = prevId
        ? `<button type="button" class="btn-secondary" id="${esc(prevId)}">${esc(prevLabel)}</button>`
        : '';
      const nextBtn = nextId
        ? `<button type="button" class="btn-primary" id="${esc(nextId)}">${esc(nextLabel)}${nextIcon ? ` ${nextIcon}` : ''}</button>`
        : '';
      return `
        <div class="btn-group">
          ${prevBtn}
          ${extraHtml}
          ${nextBtn}
        </div>
      `.trim();
    },

    /**
     * Renders an empty state placeholder.
     * @param {Object} options
     * @param {string} options.title
     * @param {string} [options.description]
     * @param {string} [options.actionHtml]
     * @returns {string} HTML string
     */
    renderEmptyState({ title, description = '', actionHtml = '' }) {
      const esc = escapeHtml;
      return `
        <div class="empty-state" style="text-align: center; padding: 32px 16px;">
          <h4 style="margin: 0 0 8px; color: var(--text-primary); font-weight: 600;">${esc(title)}</h4>
          ${description ? `<p style="margin: 0 0 16px; color: var(--text-secondary); font-size: 0.9rem;">${esc(description)}</p>` : ''}
          ${actionHtml}
        </div>
      `.trim();
    },

    /**
     * Renders internal subnav / segment tabs.
     * @param {Object} options
     * @param {Array<{id: string, label: string}>} options.tabs
     * @param {string} options.activeId
     * @param {string} [options.dataAttr='data-tab']
     * @returns {string} HTML string
     */
    renderInternalTabs({ tabs, activeId, dataAttr = 'data-tab' }) {
      const esc = escapeHtml;
      return `
        <div class="internal-tabs" role="tablist">
          ${tabs.map(t => {
            const isActive = t.id === activeId;
            return `<button type="button" role="tab" aria-selected="${isActive}" class="internal-tab-btn ${isActive ? 'active' : ''}" ${esc(dataAttr)}="${esc(t.id)}">${esc(t.label)}</button>`;
          }).join('')}
        </div>
      `.trim();
    },

    /**
     * Transitions a button through inline feedback states ('pending' | 'ok' | 'error' | 'reset')
     * instead of firing a floating toast banner.
     * @param {HTMLButtonElement | null} btn
     * @param {'pending' | 'ok' | 'error' | 'reset'} state
     * @param {string} [label]
     * @param {{ resetMs?: number, onDone?: () => void }} [options]
     */
    buttonInlineState(btn, state, label, { resetMs = 1500, onDone } = {}) {
      if (!btn) {
        if (state === 'ok' && typeof onDone === 'function') onDone();
        return;
      }

      if (btn._inlineStateTimer) {
        clearTimeout(btn._inlineStateTimer);
        btn._inlineStateTimer = null;
      }

      if (btn.dataset.inlineOrigHtml === undefined) {
        btn.dataset.inlineOrigHtml = btn.innerHTML;
        btn.dataset.inlineOrigDisabled = btn.disabled ? '1' : '0';
      }

      const restore = () => {
        btn.classList.remove('btn-inline-pending', 'btn-inline-ok', 'btn-inline-error');
        if (btn.dataset.inlineOrigHtml !== undefined) {
          btn.innerHTML = btn.dataset.inlineOrigHtml;
          delete btn.dataset.inlineOrigHtml;
        }
        if (btn.dataset.inlineOrigDisabled !== undefined) {
          btn.disabled = btn.dataset.inlineOrigDisabled === '1';
          delete btn.dataset.inlineOrigDisabled;
        } else {
          btn.disabled = false;
        }
      };

      if (state === 'reset') {
        restore();
        return;
      }

      btn.classList.remove('btn-inline-pending', 'btn-inline-ok', 'btn-inline-error');

      if (state === 'pending') {
        btn.disabled = true;
        btn.classList.add('btn-inline-pending');
        btn.textContent = label || 'Guardando…';
        return;
      }

      if (state === 'ok') {
        btn.disabled = true;
        btn.classList.add('btn-inline-ok');
        btn.textContent = label || '✓ Guardado';
        btn._inlineStateTimer = setTimeout(() => {
          btn._inlineStateTimer = null;
          restore();
          if (typeof onDone === 'function') onDone();
        }, resetMs);
        return;
      }

      if (state === 'error') {
        btn.disabled = false;
        btn.classList.add('btn-inline-error');
        btn.textContent = label || 'No se pudo';
        btn._inlineStateTimer = setTimeout(() => {
          btn._inlineStateTimer = null;
          restore();
        }, resetMs);
      }
    }
  });

  global.KhoraUtils = Object.freeze({
    escapeHtml,
    scrollToTop
  });

  global.KhoraUI = KhoraUI;
})(typeof window !== 'undefined' ? window : globalThis);
