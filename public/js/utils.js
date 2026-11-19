/**
 * Shared client-side utilities for Khōra.
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

  global.KhoraUtils = Object.freeze({
    escapeHtml
  });
})(window);
