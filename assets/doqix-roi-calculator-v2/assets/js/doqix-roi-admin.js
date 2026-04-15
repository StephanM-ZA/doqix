/**
 * Do.Qix ROI Calculator — Admin Repeater Logic
 * Version: 2.0.0
 *
 * Vanilla JS (no jQuery). Handles add/remove rows for tiers and sliders.
 */
(function() {
  'use strict';

  var OPT = 'doqix_roi_v2_settings';

  /* ── Helpers ── */

  /** Slugify a label into a valid key: lowercase, spaces→hyphens, strip non-alphanumeric */
  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  /** Re-index all rows in a container so array indices are sequential */
  function reindexRows(container, section) {
    var rows = container.querySelectorAll('.doqix-repeater-row');
    for (var i = 0; i < rows.length; i++) {
      rows[i].setAttribute('data-index', i);
      var inputs = rows[i].querySelectorAll('input, select, textarea');
      for (var j = 0; j < inputs.length; j++) {
        var name = inputs[j].getAttribute('name');
        if (name) {
          inputs[j].setAttribute('name',
            name.replace(
              new RegExp(OPT + '\\[' + section + '\\]\\[\\d+\\]'),
              OPT + '[' + section + '][' + i + ']'
            )
          );
        }
      }
    }
    updateRemoveButtons(container);
  }

  /** Disable remove button if only 1 row remains */
  function updateRemoveButtons(container) {
    var rows = container.querySelectorAll('.doqix-repeater-row');
    var removeButtons = container.querySelectorAll('.doqix-remove-row');
    for (var i = 0; i < removeButtons.length; i++) {
      removeButtons[i].disabled = rows.length <= 1;
    }
  }

  /* ── Tier repeater ── */

  var tiersBody = document.getElementById('doqix-tiers-body');
  var addTierBtn = document.getElementById('doqix-add-tier');

  if (addTierBtn && tiersBody) {
    addTierBtn.addEventListener('click', function() {
      var rows = tiersBody.querySelectorAll('.doqix-repeater-row');
      var idx = rows.length;
      var tr = document.createElement('tr');
      tr.className = 'doqix-repeater-row';
      tr.setAttribute('data-index', idx);
      tr.innerHTML =
        '<td><input type="text" name="' + OPT + '[tiers][' + idx + '][name]" value="" class="regular-text" required></td>' +
        '<td><input type="number" name="' + OPT + '[tiers][' + idx + '][price]" value="0" min="0" step="1" class="small-text"></td>' +
        '<td><input type="number" name="' + OPT + '[tiers][' + idx + '][threshold]" value="0" min="0" step="1" class="small-text"></td>' +
        '<td class="doqix-col-action"><button type="button" class="button doqix-remove-row">Remove</button></td>';
      tiersBody.appendChild(tr);
      updateRemoveButtons(tiersBody);
    });

    tiersBody.addEventListener('click', function(e) {
      if (!e.target.classList.contains('doqix-remove-row')) return;
      var row = e.target.closest('.doqix-repeater-row');
      if (row && tiersBody.querySelectorAll('.doqix-repeater-row').length > 1) {
        row.remove();
        reindexRows(tiersBody, 'tiers');
      }
    });

    updateRemoveButtons(tiersBody);
  }

  /* ── Slider repeater ── */

  var slidersContainer = document.getElementById('doqix-sliders-container');
  var addSliderBtn = document.getElementById('doqix-add-slider');

  if (addSliderBtn && slidersContainer) {
    addSliderBtn.addEventListener('click', function() {
      var cards = slidersContainer.querySelectorAll('.doqix-repeater-row');
      var idx = cards.length;
      var div = document.createElement('div');
      div.className = 'doqix-slider-card doqix-repeater-row';
      div.setAttribute('data-index', idx);
      div.innerHTML =
        '<div class="doqix-slider-card-header">' +
          '<strong class="doqix-slider-card-title">New Slider</strong>' +
          '<button type="button" class="button doqix-remove-row">Remove</button>' +
        '</div>' +
        '<div class="doqix-slider-card-body">' +
          '<div class="doqix-field-grid">' +
            '<label>Key<input type="text" name="' + OPT + '[sliders][' + idx + '][key]" value="" class="regular-text doqix-slider-key" readonly></label>' +
            '<label>Label<input type="text" name="' + OPT + '[sliders][' + idx + '][label]" value="" class="regular-text doqix-slider-label" required></label>' +
            '<label>Role<select name="' + OPT + '[sliders][' + idx + '][role]">' +
              '<option value="multiplier">Multiplier</option>' +
              '<option value="rate">Hourly rate</option>' +
              '<option value="efficiency">Efficiency (%)</option>' +
              '<option value="flat_monthly">Monthly flat amount</option>' +
            '</select></label>' +
            '<label>Format<select name="' + OPT + '[sliders][' + idx + '][format]">' +
              '<option value="number">Number</option>' +
              '<option value="currency">Currency (R)</option>' +
              '<option value="percentage">Percentage (%)</option>' +
            '</select></label>' +
            '<label>Default<input type="number" name="' + OPT + '[sliders][' + idx + '][default]" value="1" class="small-text"></label>' +
            '<label>Min<input type="number" name="' + OPT + '[sliders][' + idx + '][min]" value="0" class="small-text"></label>' +
            '<label>Max<input type="number" name="' + OPT + '[sliders][' + idx + '][max]" value="100" class="small-text"></label>' +
            '<label>Step<input type="number" name="' + OPT + '[sliders][' + idx + '][step]" value="1" min="1" class="small-text"></label>' +
            '<label>Prefix<input type="text" name="' + OPT + '[sliders][' + idx + '][prefix]" value="" class="small-text" style="width:60px"></label>' +
            '<label>Suffix<input type="text" name="' + OPT + '[sliders][' + idx + '][suffix]" value="" class="small-text" style="width:60px"></label>' +
          '</div>' +
          '<div class="doqix-tooltip-row">' +
            '<label>Tooltip<input type="text" name="' + OPT + '[sliders][' + idx + '][tooltip]" value="" class="large-text"></label>' +
          '</div>' +
        '</div>';
      slidersContainer.appendChild(div);
      updateRemoveButtons(slidersContainer);
    });

    slidersContainer.addEventListener('click', function(e) {
      if (!e.target.classList.contains('doqix-remove-row')) return;
      var row = e.target.closest('.doqix-repeater-row');
      if (row && slidersContainer.querySelectorAll('.doqix-repeater-row').length > 1) {
        row.remove();
        reindexRows(slidersContainer, 'sliders');
      }
    });

    /* Auto-generate key from label + update card title */
    slidersContainer.addEventListener('input', function(e) {
      if (!e.target.classList.contains('doqix-slider-label')) return;
      var card = e.target.closest('.doqix-repeater-row');
      if (!card) return;

      var keyInput = card.querySelector('.doqix-slider-key');
      var titleEl  = card.querySelector('.doqix-slider-card-title');

      if (keyInput) {
        keyInput.value = slugify(e.target.value);
      }
      if (titleEl) {
        titleEl.textContent = e.target.value || 'New Slider';
      }
    });

    updateRemoveButtons(slidersContainer);
  }

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

  /* ── Legacy reset (for any remaining old-style resets) ── */
  var resetBtns = document.querySelectorAll('.doqix-reset-color');
  for (var ri = 0; ri < resetBtns.length; ri++) {
    resetBtns[ri].addEventListener('click', function() {
      var target = this.getAttribute('data-target');
      var input = document.getElementById(target);
      if (input) {
        input.setAttribute('data-is-default', '1');
        input.name = '';
      }
      var field = this.closest('.doqix-color-field');
      if (field) {
        var codeEl = field.querySelector('code');
        if (codeEl) codeEl.textContent = 'Theme default';
      }
      this.style.display = 'none';
    });
  }

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
