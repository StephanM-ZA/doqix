/**
 * Do.Qix ROI Calculator V1 — Admin Color & Preview Logic
 * Version: 1.3.0
 *
 * Vanilla JS (no jQuery). Handles color picker sync, live preview, reset buttons,
 * shadow radio handler, and form submit cleanup for default colors.
 */
(function() {
  'use strict';

  /* ── Color picker → hex text sync + live preview ── */
  var preview = document.getElementById('doqix-roi-preview');

  var colorInputs = document.querySelectorAll('input[type="color"]');
  for (var ci = 0; ci < colorInputs.length; ci++) {
    colorInputs[ci].addEventListener('input', function() {
      /* Update code label */
      var swatch = this.closest('.doqix-color-swatch');
      var field  = this.closest('.doqix-roi-color-field') || this.closest('.doqix-color-field');
      var codeEl = (swatch || field) ? (swatch || field).querySelector('code') : null;
      if (codeEl) codeEl.textContent = this.value;
      this.removeAttribute('data-is-default');

      /* Show reset button if hidden */
      var resetBtn = swatch ? swatch.querySelector('.doqix-roi-reset-color') : null;
      if (!resetBtn && swatch) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'button-link doqix-roi-reset-color';
        btn.textContent = '\u00d7';
        swatch.appendChild(btn);
      }

      /* Update live preview */
      var cssVar = this.getAttribute('data-var');
      if (cssVar && preview) {
        preview.style.setProperty(cssVar, this.value);
      }
    });
  }

  /* ── Reset to theme default (new panel) ── */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.doqix-roi-reset-color');
    if (!btn) return;

    var swatch = btn.closest('.doqix-color-swatch');
    if (!swatch) return;

    var input = swatch.querySelector('input[type="color"]');
    if (!input) return;

    var visualDefault = input.getAttribute('data-visual-default');
    if (visualDefault) {
      input.value = visualDefault;
    }
    input.setAttribute('data-is-default', '1');

    var codeEl = swatch.querySelector('code');
    if (codeEl) codeEl.textContent = 'Theme default';

    btn.remove();

    /* Update live preview with visual default */
    var cssVar = input.getAttribute('data-var');
    if (cssVar && preview && visualDefault) {
      preview.style.setProperty(cssVar, visualDefault);
    }
  });

  /* ── Number inputs → live preview (border radius etc.) ── */
  var numInputs = document.querySelectorAll('input[data-preview-var]');
  for (var ni = 0; ni < numInputs.length; ni++) {
    numInputs[ni].addEventListener('input', function() {
      var cssVar = this.getAttribute('data-preview-var');
      var suffix = this.getAttribute('data-preview-suffix') || '';
      if (cssVar && preview) {
        preview.style.setProperty(cssVar, this.value + suffix);
      }
    });
  }

  /* ── Shadow radio buttons → live preview ── */
  var shadowMap = {
    'none':   'none',
    'subtle': '0 2px 8px rgba(0,0,0,0.08)',
    'medium': '0 4px 16px rgba(0,0,0,0.12)',
    'strong': '0 8px 28px rgba(0,0,0,0.18)'
  };

  var shadowRadios = document.querySelectorAll('input[type="radio"]');
  for (var sri = 0; sri < shadowRadios.length; sri++) {
    if (shadowRadios[sri].name && shadowRadios[sri].name.indexOf('[card_shadow]') !== -1) {
      shadowRadios[sri].addEventListener('change', function() {
        if (preview && shadowMap[this.value] !== undefined) {
          preview.style.setProperty('--roi-shadow', shadowMap[this.value]);
        }
      });
    }
  }

  /* ── Form submit: clear default color values so empty string is stored ── */
  var form = document.querySelector('form[action="options.php"]');
  if (form) {
    form.addEventListener('submit', function() {
      var defaults = form.querySelectorAll('input[type="color"][data-is-default="1"]');
      for (var di = 0; di < defaults.length; di++) {
        defaults[di].value = '';
        /* Also set a hidden input to ensure empty string is submitted */
        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = defaults[di].name;
        hidden.value = '';
        form.appendChild(hidden);
        defaults[di].name = '';
      }
    });
  }
})();
