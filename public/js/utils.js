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
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Ignore scroll errors (e.g. no window)
    }
  }

  /**
   * Binds click handlers for all [data-goto-step] buttons within scope.
   * @param {Element|Document} scope
   * @param {function(number): boolean|void} onGoto - called with the parsed step.
   */
  function bindGotoStep(scope, onGoto) {
    (scope || document).querySelectorAll?.('[data-goto-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetStep = parseInt(e.currentTarget.dataset.gotoStep, 10);
        if (targetStep) onGoto(targetStep);
      });
    });
  }

  /**
   * Shared canonical UI primitives.
   * Use these helpers across subapps to ensure visual consistency and single-point iteration.
   */
  let pendingSwipeCommit = null;
  let pendingLeavingHtml = '';
  let pendingLeavingTitleHtml = '';

  const KhoraUI = Object.freeze({
    setPendingSwipeCommit(state) {
      pendingSwipeCommit = state || null;
    },

    prepareTypeformTransition(containerOrId) {
      if (typeof document === 'undefined') return;
      if (pendingSwipeCommit) {
        pendingLeavingHtml = '';
        pendingLeavingTitleHtml = '';
        return;
      }
      const root = typeof containerOrId === 'string'
        ? document.getElementById(containerOrId)
        : containerOrId;
      const stage = root?.querySelector?.('.act-typeform-stage');
      if (!stage) {
        pendingLeavingHtml = '';
        pendingLeavingTitleHtml = '';
        return;
      }
      const parts = Array.from(stage.children || [])
        .filter(c => !c.classList?.contains('act-typeform-footer') && !c.classList?.contains('swipe-skeleton') && !c.classList?.contains('swipe-step-preview') && !c.classList?.contains('act-typeform-leaving'))
        .map(c => c.outerHTML || '')
        .join('');
      pendingLeavingHtml = parts.replace(/\sid="[^"]*"/g, '');
      const titleEl = root?.querySelector?.('.act-typeform-step-trigger, .act-typeform-step-counter-mobile');
      pendingLeavingTitleHtml = titleEl ? (titleEl.outerHTML || '').replace(/\sid="[^"]*"/g, '') : '';
    },
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
      const hasSteps = Array.isArray(steps) && steps.length > 0;
      const currentStepObj = hasSteps ? steps.find(s => s.step === currentStep) : null;
      const shortLabel = currentStepObj ? String(currentStepObj.label || '').replace(/^\d+\.\s*/, '') : '';

      const stepTriggerHtml = hasSteps
        ? `<button type="button" class="act-typeform-step-trigger" aria-expanded="false" aria-haspopup="true"><span>${esc(currentStep)} / ${esc(totalSteps)}${shortLabel ? ` · <strong>${esc(shortLabel)}</strong>` : ''}</span><svg class="act-typeform-step-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></button>`
        : `<span class="act-typeform-step-counter-mobile">${esc(currentStep)} / ${esc(totalSteps)}</span>`;

      const stepDropdownHtml = hasSteps
        ? `
          <div class="act-typeform-step-dropdown hidden" role="menu" aria-label="${esc(navAriaLabel)}">
            ${steps.map(s => {
              const isAct = s.step === currentStep;
              const isDone = s.step < currentStep;
              const cls = isAct ? 'active' : (isDone ? 'completed' : '');
              return `<button type="button" role="menuitem" class="act-typeform-dropdown-item ${cls}" data-goto-step="${esc(s.step)}" ${isAct ? 'aria-current="step"' : ''}><span>${esc(s.label)}</span>${isDone ? '<span class="act-typeform-dropdown-check" aria-hidden="true">✓</span>' : ''}</button>`;
            }).join('')}
          </div>
        `.trim()
        : '';

      const stepsNav = hasSteps
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
              <div class="act-typeform-topbar-left">
                <button type="button" class="act-typeform-exit-btn" data-flow-exit aria-label="Volver al inicio" title="Volver al inicio"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                <span class="badge act-typeform-badge-desktop" style="background-color: rgba(87, 139, 116, 0.16); color: var(--sage-700)">
                  ${esc(currentStep)} / ${esc(totalSteps)}
                </span>
              </div>
              <div class="act-typeform-topbar-right">
                ${backBtn}
                ${stepTriggerHtml}
              </div>
            </div>
            ${stepDropdownHtml}
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
     * Applies the global directional slide + smooth progress-fill transition to a Typeform shell.
     * @param {string|HTMLElement} containerOrId
     * @param {number} prevStep
     * @param {number} nextStep
     * @param {number} totalSteps
     */
    animateTypeformTransition(containerOrId, prevStep, nextStep, totalSteps) {
      if (typeof document === 'undefined') return;
      const root = typeof containerOrId === 'string'
        ? document.getElementById(containerOrId)
        : containerOrId;
      if (!root) return;
      const stage = root.querySelector?.('.act-typeform-stage');
      const commitState = pendingSwipeCommit;
      const leavingHtml = pendingLeavingHtml;
      const leavingTitleHtml = pendingLeavingTitleHtml;
      pendingSwipeCommit = null;
      pendingLeavingHtml = '';
      pendingLeavingTitleHtml = '';
      if (stage && prevStep && nextStep && prevStep !== nextStep) {
        const isNext = nextStep > prevStep;
        // Ghost lifetime: derive from the CSS motion token so removal never clips the animation.
        let ghostMs = 440;
        try {
          const token = getComputedStyle(document.documentElement).getPropertyValue('--motion-nav-duration').trim();
          const ms = token.endsWith('ms') ? Number.parseFloat(token) : Number.parseFloat(token) * 1000;
          if (Number.isFinite(ms) && ms > 0) ghostMs = Math.round(ms) + 40;
        } catch {
          // Fall back to the default
        }
        if (leavingHtml && !commitState && typeof document.createElement === 'function') {
          const ghost = document.createElement('div');
          ghost.className = `act-typeform-leaving ${isNext ? 'leave-to-left' : 'leave-to-right'}`;
          ghost.setAttribute('aria-hidden', 'true');
          ghost.innerHTML = leavingHtml;
          stage.appendChild(ghost);
          setTimeout(() => ghost.remove?.(), ghostMs);
        }
        const cls = isNext ? 'swipe-from-right' : 'swipe-from-left';
        stage.classList?.remove('swipe-from-right', 'swipe-from-left');
        if (commitState) {
          stage.style?.setProperty?.('--swipe-start-x', `${Math.round(commitState.offset)}px`);
          stage.style?.setProperty?.('--swipe-start-opacity', String(commitState.opacity));
        } else {
          stage.style?.removeProperty?.('--swipe-start-x');
          stage.style?.removeProperty?.('--swipe-start-opacity');
        }
        void stage.offsetWidth;
        stage.classList?.add(cls);
      }
      const fill = root.querySelector?.('.act-progress-fill');
      if (fill && totalSteps > 0 && prevStep && nextStep && prevStep !== nextStep) {
        const prevPct = (prevStep / totalSteps) * 100;
        const nextPct = (nextStep / totalSteps) * 100;
        fill.style.transition = 'none';
        fill.style.width = `${prevPct}%`;
        void fill.offsetWidth;
        const applyTarget = () => {
          fill.style.transition = '';
          fill.style.width = `${nextPct}%`;
        };
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(applyTarget);
        } else {
          applyTarget();
        }
      }
      const titleEl = root.querySelector?.('.act-typeform-step-trigger, .act-typeform-step-counter-mobile');
      if (titleEl && prevStep && nextStep && prevStep !== nextStep) {
        const isNext = nextStep > prevStep;
        const titleParent = titleEl.parentElement;
        if (leavingTitleHtml && !commitState && titleParent && typeof document.createElement === 'function') {
          const titleGhost = document.createElement('div');
          titleGhost.className = `act-typeform-title-leaving ${isNext ? 'leave-to-left' : 'leave-to-right'}`;
          titleGhost.setAttribute('aria-hidden', 'true');
          titleGhost.innerHTML = leavingTitleHtml;
          titleParent.appendChild(titleGhost);
          setTimeout(() => titleGhost.remove?.(), ghostMs);
        }
        const titleCls = isNext ? 'step-label-next' : 'step-label-prev';
        titleEl.classList?.remove('step-label-next', 'step-label-prev');
        if (commitState) {
          titleEl.style?.setProperty?.('--swipe-title-start-opacity', String(commitState.opacity));
        } else {
          titleEl.style?.removeProperty?.('--swipe-title-start-opacity');
        }
        void titleEl.offsetWidth;
        titleEl.classList?.add(titleCls);
      }
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

  /**
   * Shared horizontal swipe navigation config & controller.
   * Standardizes thresholds, deadzone, edge guards, skeleton feedback, and directional transitions
   * across both sub-tab views and Typeform step flows.
   */
  const KhoraSwipe = Object.freeze({
    CONFIG: Object.freeze({
      COMMIT_RATIO: 0.26,
      DEADZONE_PX: 12,
      EDGE_GUARD_PX: 24,
      START_ANGLE_RATIO: 1.4,
      COMMIT_ANGLE_RATIO: 1.2,
      BOUNCE_MS: 440
    }),

    /**
     * Binds horizontal swipe navigation to document touch events.
     * @param {Object} adapter
     * @param {Function} adapter.isBlocked - (target, clientX) => boolean
     * @param {Function} adapter.resolveContext - () => { element, skeletonHost, hasTarget(dir), onProgress(dir, progress), onClearProgress(), onCommit(dir) } | null
     * @param {Function} [adapter.onHaptic] - () => void
     */
    bind(adapter) {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      const cfg = KhoraSwipe.CONFIG;

      let startX = 0;
      let startY = 0;
      let dragOriginX = 0;
      let eligible = false;
      let dragging = false;
      let bounceTimer = null;
      let skeletonEl = null;
      let previewEl = null;
      let previewDir = null;
      let activeCtx = null;

      const ensurePreview = (host, dir, html) => {
        if (!host || !html) return null;
        if (!previewEl || previewEl.parentElement !== host) {
          if (previewEl) previewEl.remove();
          previewEl = document.createElement('div');
          previewEl.className = 'swipe-step-preview';
          previewEl.setAttribute('aria-hidden', 'true');
          host.appendChild(previewEl);
          previewDir = null;
        }
        if (previewDir !== dir) {
          previewEl.innerHTML = html;
          previewDir = dir;
        }
        return previewEl;
      };

      const hidePreview = () => {
        if (!previewEl) return;
        previewEl.classList.remove('active');
        previewEl.style.transition = '';
        previewEl.style.transform = '';
        previewEl.style.opacity = '';
        previewDir = null;
      };

      const ensureSkeleton = (host) => {
        if (!host) return null;
        if (skeletonEl && skeletonEl.parentElement === host) return skeletonEl;
        if (skeletonEl) skeletonEl.remove();
        skeletonEl = document.createElement('div');
        skeletonEl.className = 'swipe-skeleton';
        skeletonEl.setAttribute('aria-hidden', 'true');
        skeletonEl.innerHTML = `
          <div class="swipe-skeleton-title"></div>
          <div class="swipe-skeleton-line"></div>
          <div class="swipe-skeleton-line short"></div>
          <div class="swipe-skeleton-block"></div>
          <div class="swipe-skeleton-block"></div>
        `;
        host.appendChild(skeletonEl);
        return skeletonEl;
      };

      const hideSkeleton = () => {
        if (!skeletonEl) return;
        skeletonEl.classList.remove('active');
        skeletonEl.style.transition = '';
        skeletonEl.style.transform = '';
        skeletonEl.style.opacity = '';
      };

      const getDragTargets = (ctx) => {
        if (Array.isArray(ctx?.elements)) return ctx.elements.filter(Boolean);
        return ctx?.element ? [ctx.element] : [];
      };

      const resetFeedback = (animateBack = false, lastDir = 'next') => {
        activeCtx?.onClearProgress?.();
        const targets = getDragTargets(activeCtx);
        const vw = window.innerWidth || 375;
        if (animateBack) {
          const backTransition = 'transform 0.34s var(--motion-nav-ease, cubic-bezier(0.25, 0.1, 0.25, 1)), opacity 0.34s ease-out';
          targets.forEach(el => {
            el.style.transition = backTransition;
          });
          if (previewEl && previewEl.classList.contains('active')) {
            previewEl.style.transition = backTransition;
            previewEl.style.transform = `translateX(${lastDir === 'next' ? vw : -vw}px)`;
            previewEl.style.opacity = '0';
          }
          if (skeletonEl && skeletonEl.classList.contains('active')) {
            skeletonEl.style.transition = backTransition;
            skeletonEl.style.transform = `translateX(${lastDir === 'next' ? vw : -vw}px)`;
            skeletonEl.style.opacity = '0';
          }
          bounceTimer = setTimeout(() => {
            targets.forEach(el => { el.style.transition = ''; });
            hidePreview();
            hideSkeleton();
            bounceTimer = null;
            activeCtx = null;
          }, cfg.BOUNCE_MS);
        } else {
          targets.forEach(el => { el.style.transition = ''; });
          hidePreview();
          hideSkeleton();
          activeCtx = null;
        }
        targets.forEach(el => {
          el.style.transform = '';
          el.style.opacity = '';
        });
      };

      document.addEventListener('touchstart', (e) => {
        if (bounceTimer) {
          clearTimeout(bounceTimer);
          bounceTimer = null;
        }
        if (dragging || skeletonEl?.classList?.contains('active')) {
          resetFeedback(false);
        }
        dragging = false;
        activeCtx = null;
        if (!e.touches || e.touches.length !== 1) {
          eligible = false;
          return;
        }
        const t = e.touches[0];
        if (t.clientX < cfg.EDGE_GUARD_PX || t.clientX > (window.innerWidth || 375) - cfg.EDGE_GUARD_PX) {
          eligible = false;
          return;
        }
        if (adapter.isBlocked(e.target, t.clientX)) {
          eligible = false;
          return;
        }
        startX = t.clientX;
        startY = t.clientY;
        eligible = true;
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (!eligible || !e.touches || e.touches.length !== 1) return;
        const t = e.touches[0];
        const deltaX = t.clientX - startX;
        const deltaY = t.clientY - startY;

        if (!dragging) {
          if (Math.abs(deltaY) > 16 && Math.abs(deltaY) >= Math.abs(deltaX)) {
            eligible = false;
            return;
          }
          if (Math.abs(deltaX) < cfg.DEADZONE_PX || Math.abs(deltaX) <= Math.abs(deltaY) * cfg.START_ANGLE_RATIO) return;
          activeCtx = adapter.resolveContext();
          if (!activeCtx || getDragTargets(activeCtx).length === 0) {
            eligible = false;
            return;
          }
          dragging = true;
          dragOriginX = t.clientX;
        }

        const visualDeltaX = t.clientX - dragOriginX;
        const dir = deltaX < 0 ? 'next' : 'prev';
        const hasTarget = activeCtx.hasTarget(dir);
        const targets = getDragTargets(activeCtx);
        const vw = window.innerWidth || 375;

        const hasPreview = hasTarget && typeof activeCtx.getPreviewHtml === 'function';
        const progress = Math.min(1, Math.abs(visualDeltaX) / (vw * 0.85));

        targets.forEach(el => {
          el.classList.remove('swipe-from-right', 'swipe-from-left');
          el.style.animation = 'none';
          el.style.transition = 'none';
          if (hasTarget) {
            if (hasPreview) {
              el.style.transform = `translateX(${visualDeltaX}px)`;
              el.style.opacity = String(Math.max(0, 1 - progress).toFixed(3));
            } else {
              const dragX = activeCtx.useSkeleton === false ? visualDeltaX * 0.55 : visualDeltaX;
              el.style.transform = `translateX(${dragX}px)`;
              el.style.opacity = String(Math.max(0.18, 1 - progress * 0.82).toFixed(3));
            }
          } else {
            el.style.transform = `translateX(${visualDeltaX * 0.25}px)`;
          }
        });

        if (hasTarget) {
          const commitThreshold = vw * cfg.COMMIT_RATIO;
          if (hasPreview) {
            const html = activeCtx.getPreviewHtml(dir);
            const prev = ensurePreview(activeCtx.previewHost, dir, html);
            if (prev) {
              prev.classList.add('active');
              prev.style.transition = 'none';
              prev.style.transform = `translateX(${visualDeltaX + (dir === 'next' ? vw : -vw)}px)`;
              prev.style.opacity = String(progress.toFixed(3));
            }
            hideSkeleton();
          } else if (activeCtx.useSkeleton !== false) {
            const skel = ensureSkeleton(activeCtx.skeletonHost);
            if (skel) {
              skel.classList.add('active');
              skel.style.transition = 'none';
              skel.style.transform = `translateX(${visualDeltaX + (dir === 'next' ? vw : -vw)}px)`;
              skel.style.opacity = String(0.14 + Math.min(0.28, Math.abs(visualDeltaX) / vw));
            }
          } else {
            hideSkeleton();
          }
          activeCtx.onProgress?.(dir, Math.abs(visualDeltaX) / commitThreshold);
        } else {
          hidePreview();
          hideSkeleton();
          activeCtx.onClearProgress?.();
        }
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        const wasDragging = dragging;
        dragging = false;
        if (!eligible || !e.changedTouches || e.changedTouches.length !== 1) {
          if (wasDragging) resetFeedback(true);
          return;
        }
        eligible = false;

        const t = e.changedTouches[0];
        const deltaX = t.clientX - startX;
        const deltaY = t.clientY - startY;
        const dir = deltaX < 0 ? 'next' : 'prev';
        const vw = window.innerWidth || 375;
        const isValidSwipe =
          Math.abs(deltaX) >= vw * cfg.COMMIT_RATIO &&
          Math.abs(deltaX) > Math.abs(deltaY) * cfg.COMMIT_ANGLE_RATIO;

        if (!isValidSwipe || !activeCtx || !activeCtx.hasTarget(dir)) {
          if (wasDragging) resetFeedback(true, dir);
          return;
        }

        const visualDeltaX = t.clientX - dragOriginX;
        const progress = Math.min(1, Math.abs(visualDeltaX) / (vw * 0.85));
        const hasPreview = typeof activeCtx.getPreviewHtml === 'function';
        const commitState = {
          offset: visualDeltaX + (dir === 'next' ? vw : -vw),
          opacity: hasPreview ? Number(progress.toFixed(3)) : Number(Math.max(0.25, progress).toFixed(3))
        };

        const ctx = activeCtx;
        resetFeedback(false);
        adapter.onHaptic?.();
        ctx.onCommit(dir, commitState);
      }, { passive: true });

      document.addEventListener('touchcancel', () => {
        const wasDragging = dragging;
        eligible = false;
        dragging = false;
        if (wasDragging) resetFeedback(true);
      }, { passive: true });
    }
  });

  global.KhoraUtils = Object.freeze({
    escapeHtml,
    scrollToTop,
    bindGotoStep
  });

  global.KhoraSwipe = KhoraSwipe;
  global.KhoraUI = KhoraUI;
})(typeof window !== 'undefined' ? window : globalThis);
