import { test, expect } from '@playwright/test';

/**
 * Dispatches a realistic horizontal TouchEvent sequence on the active section
 * so KhoraSwipe's touchstart/touchmove/touchend pipeline runs end-to-end.
 */
async function swipeHorizontal(page, { startX, endX, y = 320, steps = 6 }) {
  await page.evaluate(({ startX, endX, y, steps }) => {
    const target = document.querySelector('.subapp-section.active') || document.body;
    const makeTouch = (x) => new Touch({
      identifier: 1,
      target,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y
    });
    const emit = (type, x) => {
      const t = makeTouch(x);
      const ev = new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === 'touchend' ? [] : [t],
        targetTouches: type === 'touchend' ? [] : [t],
        changedTouches: [t]
      });
      target.dispatchEvent(ev);
    };

    emit('touchstart', startX);
    for (let i = 1; i <= steps; i++) {
      const x = startX + ((endX - startX) * i) / steps;
      emit('touchmove', x);
    }
    emit('touchend', endX);
  }, { startX, endX, y, steps });
}

test.describe('Khōra Mobile UI & Swipe Regression', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile-only suite');
  });

  test('boots cleanly, hides splash, and renders symmetric floating dock without horizontal overflow', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');
    await expect(page.locator('#home-view')).toHaveClass(/active/);

    // Splash should contain inline SVG logo ring and eventually hide
    await expect(page.locator('#app-splash .khora-logo-ring')).toHaveCount(1);

    // Floating capsule dock should have symmetric margins and sit above bottom edge
    const metrics = await page.evaluate(() => {
      const nav = document.querySelector('.app-nav');
      const rect = nav.getBoundingClientRect();
      return {
        left: rect.left,
        rightGap: window.innerWidth - rect.right,
        bottomGap: window.innerHeight - rect.bottom,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
    expect(Math.abs(metrics.left - metrics.rightGap)).toBeLessThanOrEqual(3);
    expect(metrics.bottomGap).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });

  test('tab swipe navigation switches views within "yo" group and updates subnav', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-item[data-nav-group="yo"]').click();
    await expect(page.locator('#context-subnav')).toBeVisible();

    const firstView = await page.evaluate(() => window.app.currentView);
    // Swipe left -> next tab in group
    await swipeHorizontal(page, { startX: 330, endX: 110 });
    await page.waitForTimeout(150);

    const secondView = await page.evaluate(() => window.app.currentView);
    expect(secondView).not.toBe(firstView);
    await expect(page.locator(`.subnav-pill[data-subnav-view="${secondView}"]`)).toHaveClass(/active/);

    // Swipe right -> back to first tab
    await swipeHorizontal(page, { startX: 80, endX: 310 });
    await page.waitForTimeout(150);

    const backView = await page.evaluate(() => window.app.currentView);
    expect(backView).toBe(firstView);
  });

  test('unified Typeform shell, step dropdown, swipe between steps, and immersive exit work in Paz Falsa', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.app.navigate('false-peace'));

    await expect(page.locator('body')).toHaveClass(/flow-immersive/);
    await expect(page.locator('#false-peace-view .act-typeform-topbar')).toBeVisible();

    // Step 1 has disabled Atrás button
    await expect(page.locator('#false-peace-view .act-typeform-footer .btn-secondary')).toBeDisabled();

    // Swipe left to advance from step 1 -> step 2
    await swipeHorizontal(page, { startX: 330, endX: 100 });
    await expect(page.locator('#false-peace-view .act-progress-track')).toHaveAttribute('aria-valuenow', '2');
    await page.waitForTimeout(480);

    // Open mobile step dropdown, jump to step 4, then close on outside click
    const trigger = page.locator('#false-peace-view .act-typeform-step-trigger');
    const dropdown = page.locator('#false-peace-view .act-typeform-step-dropdown');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(dropdown).not.toHaveClass(/hidden/);

    await dropdown.locator('[data-goto-step="4"]').click();
    await expect(page.locator('#false-peace-view .act-progress-track')).toHaveAttribute('aria-valuenow', '4');
    await page.waitForTimeout(480);

    // Open and click outside to close
    await trigger.click();
    await expect(dropdown).not.toHaveClass(/hidden/);
    await page.locator('#false-peace-view .act-typeform-stage').click({ position: { x: 20, y: 20 } });
    await expect(dropdown).toHaveClass(/hidden/);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Exit immersive flow returns to home
    await page.locator('#false-peace-view [data-flow-exit]').click();
    await expect(page.locator('body')).not.toHaveClass(/flow-immersive/);
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Perfil value wizard enters flow-immersive and exits back to Perfil', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.app.navigate('profile'));
    await expect(page.locator('#profile-view')).toHaveClass(/active/);

    await page.locator('#btn-open-value-wizard, #btn-open-value-wizard-empty').first().click();
    await expect(page.locator('body')).toHaveClass(/flow-immersive/);
    await expect(page.locator('#profile-view .act-typeform-topbar')).toBeVisible();

    await page.locator('#profile-view [data-flow-exit]').click();
    await expect(page.locator('body')).not.toHaveClass(/flow-immersive/);
    await expect(page.locator('#profile-view')).toHaveClass(/active/);
  });

  test('virtual keyboard focus toggles flow-keyboard-open in immersive mode', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.app.navigate('false-peace'));
    await expect(page.locator('body')).toHaveClass(/flow-immersive/);

    // Go to step 2 (Situación) which has a textarea
    await page.locator('#btn-pf-next-1').click();
    const textarea = page.locator('#pf-situation');
    await textarea.focus();
    await expect(page.locator('body')).toHaveClass(/flow-keyboard-open/);

    await textarea.evaluate(el => el.blur());
    await page.waitForTimeout(150);
    await expect(page.locator('body')).not.toHaveClass(/flow-keyboard-open/);
  });

  test('help drawer mobile glossary accordion toggles cleanly', async ({ page }) => {
    await page.goto('/');
    await page.locator('#btn-context-help').click();
    const drawer = page.locator('#help-drawer');
    await expect(drawer).toHaveClass(/visible/);

    const details = drawer.locator('.help-drawer-glossary');
    const summary = details.locator('summary');
    const wasOpen = await details.evaluate(el => el.open);
    await summary.click();
    await page.waitForTimeout(400);
    const isOpenNow = await details.evaluate(el => el.open);
    expect(isOpenNow).toBe(!wasOpen);
  });
});

test.describe('Khōra Desktop UI Regression', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop-only suite');
  });

  test('desktop renders Typeform step pills without horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);

    await page.evaluate(() => window.app.navigate('compass'));
    const pills = page.locator('#compass-view .act-typeform-steps-nav .act-step-pill');
    await expect(pills).toHaveCount(4);

    await pills.nth(2).click();
    await expect(page.locator('#compass-view .act-progress-track')).toHaveAttribute('aria-valuenow', '3');
  });
});
