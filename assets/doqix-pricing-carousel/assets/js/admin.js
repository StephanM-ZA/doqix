/**
 * Do.Qix Pricing Carousel — Admin JS
 * Vanilla JS IIFE. Handles card repeaters, mini editors, colour sync, preset actions.
 */
(function() {
  'use strict';

  var OPT = 'doqix_pricing_settings';

  /* ────────────────────────────────────────────
   * 1. Card Panel Toggle
   * ──────────────────────────────────────────── */

  window.doqixPricingToggleCard = function(header) {
    var panel = header.closest('.doqix-card-panel');
    if (!panel) return;
    panel.classList.toggle('doqix-open');
  };

  /* ────────────────────────────────────────────
   * 2. Remove Card
   * ──────────────────────────────────────────── */

  window.doqixPricingRemoveCard = function(btn) {
    var panel = btn.closest('.doqix-card-panel');
    if (!panel) return;

    var container = panel.parentElement;
    var panels = container.querySelectorAll('.doqix-card-panel');

    if (panels.length <= 1) return;

    panel.remove();
    reindexCards(container);
  };

  /* ────────────────────────────────────────────
   * 3. Add Card
   * ──────────────────────────────────────────── */

  var addCardBtn = document.getElementById('doqix-add-card');
  if (addCardBtn) {
    addCardBtn.addEventListener('click', function() {
      var container = document.getElementById('doqix-cards-container');
      if (!container) return;

      var panels = container.querySelectorAll('.doqix-card-panel');
      var lastPanel = panels[panels.length - 1];
      if (!lastPanel) return;

      var clone = lastPanel.cloneNode(true);

      // Clear all field values except CTA defaults
      var inputs = clone.querySelectorAll('input, select, textarea');
      for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        var name = inp.getAttribute('name') || '';

        if (inp.type === 'checkbox') {
          inp.checked = false;
        } else if (inp.type === 'hidden') {
          // Keep hidden inputs that are checkbox fallbacks (value="0") as-is
          // Clear sort_order and mini-editor hidden inputs
          if (name.indexOf('[sort_order]') !== -1) {
            inp.value = '0';
          } else if (inp.classList.contains('doqix-mini-editor-input')) {
            inp.value = '';
          }
        } else if (inp.type === 'color') {
          // Reset colour overrides to default empty-like state
          inp.value = '#000000';
        } else if (inp.tagName === 'SELECT') {
          inp.selectedIndex = 0;
        } else {
          // Text / number fields: keep CTA defaults, clear rest
          if (name.indexOf('[cta_label]') !== -1) {
            inp.value = 'Start Free';
          } else if (name.indexOf('[cta_url]') !== -1) {
            inp.value = '/contact';
          } else if (name.indexOf('[price_suffix]') !== -1) {
            inp.value = '/mo';
          } else {
            inp.value = '';
          }
        }
      }

      // Clear contenteditable editors
      var editors = clone.querySelectorAll('.doqix-mini-editor');
      for (var e = 0; e < editors.length; e++) {
        editors[e].innerHTML = '';
      }

      // Reset colour hex labels
      var hexCodes = clone.querySelectorAll('.doqix-color-hex');
      for (var h = 0; h < hexCodes.length; h++) {
        hexCodes[h].textContent = '';
      }

      // Reset title
      var title = clone.querySelector('.doqix-card-title');
      if (title) title.textContent = 'Untitled Card';

      // Remove badge preview and featured star
      var badge = clone.querySelector('.doqix-badge-preview');
      if (badge) badge.remove();
      var star = clone.querySelector('.doqix-featured-star');
      if (star) star.remove();

      // Close colour overrides if open
      var overrides = clone.querySelector('.doqix-color-overrides');
      if (overrides) overrides.style.display = 'none';

      // Append to container before the "Add Card" button wrapper
      container.appendChild(clone);

      // Reindex all cards
      reindexCards(container);

      // Open the new card body
      var newBody = clone.querySelector('.doqix-card-body');
      if (newBody) newBody.classList.add('doqix-open');
      var newArrow = clone.querySelector('.doqix-collapse-arrow');
      if (newArrow) newArrow.classList.add('doqix-open');
    });
  }

  /* ────────────────────────────────────────────
   * 4. Reindex Cards
   * ──────────────────────────────────────────── */

  function reindexCards(container) {
    var slugInput = document.querySelector('input[name$="[_preset_slug]"]');
    var slug = slugInput ? slugInput.value : 'default';
    var panels = container.querySelectorAll('.doqix-card-panel');

    for (var i = 0; i < panels.length; i++) {
      panels[i].setAttribute('data-index', i);

      var fields = panels[i].querySelectorAll('input, select, textarea');
      for (var j = 0; j < fields.length; j++) {
        var name = fields[j].getAttribute('name');
        if (!name) continue;

        // Replace existing card index pattern
        fields[j].setAttribute('name',
          name.replace(
            new RegExp(OPT + '\\[presets\\]\\[[^\\]]+\\]\\[cards\\]\\[\\d+\\]'),
            OPT + '[presets][' + slug + '][cards][' + i + ']'
          )
        );
      }

      // Update data-target on contenteditable editors
      var editors = panels[i].querySelectorAll('.doqix-mini-editor');
      for (var e = 0; e < editors.length; e++) {
        var target = editors[e].getAttribute('data-target');
        if (target) {
          editors[e].setAttribute('data-target',
            target.replace(
              new RegExp(OPT + '\\[presets\\]\\[[^\\]]+\\]\\[cards\\]\\[\\d+\\]'),
              OPT + '[presets][' + slug + '][cards][' + i + ']'
            )
          );
        }
      }

      // Update sort_order hidden input
      var sortInput = panels[i].querySelector('input[name$="[sort_order]"]');
      if (sortInput) sortInput.value = i;
    }

    // Disable remove buttons if only 1 card
    var removeBtns = container.querySelectorAll('.doqix-remove-card');
    for (var r = 0; r < removeBtns.length; r++) {
      removeBtns[r].disabled = panels.length <= 1;
    }
  }

  // Initial disable check on page load
  var cardsContainer = document.getElementById('doqix-cards-container');
  if (cardsContainer) {
    reindexCards(cardsContainer);
  }

  /* ────────────────────────────────────────────
   * 5. Mini Editor Sync
   * ──────────────────────────────────────────── */

  document.addEventListener('input', function(e) {
    if (!e.target.classList.contains('doqix-mini-editor')) return;

    var targetName = e.target.getAttribute('data-target');
    if (!targetName) return;

    var hiddenInput = e.target.parentElement.querySelector('.doqix-mini-editor-input');
    if (hiddenInput) {
      hiddenInput.value = e.target.innerHTML;
    }
  });

  // Sync all editors on form submit
  var form = document.querySelector('.doqix-pricing-form');
  if (form) {
    form.addEventListener('submit', function() {
      var editors = document.querySelectorAll('.doqix-mini-editor');
      for (var i = 0; i < editors.length; i++) {
        var hiddenInput = editors[i].parentElement.querySelector('.doqix-mini-editor-input');
        if (hiddenInput) {
          hiddenInput.value = editors[i].innerHTML;
        }
      }
    });
  }

  /* ────────────────────────────────────────────
   * 5b. Mini Editor Toolbar Commands
   * ──────────────────────────────────────────── */

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.doqix-mini-toolbar button[data-cmd]');
    if (!btn) return;

    e.preventDefault();
    var cmd = btn.getAttribute('data-cmd');

    if (cmd === 'createLink') {
      doqixPricingInsertLink(btn);
    } else {
      document.execCommand(cmd, false, null);
    }
  });

  /* ────────────────────────────────────────────
   * 6. Insert Link
   * ──────────────────────────────────────────── */

  window.doqixPricingInsertLink = function(btn) {
    var url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  /* ────────────────────────────────────────────
   * 7. Colour Picker -> Live Preview
   * ──────────────────────────────────────────── */

  document.addEventListener('input', function(e) {
    if (e.target.type !== 'color') return;

    var field = e.target.closest('.doqix-color-field');
    if (!field) return;

    // Update hex code display
    var codeEl = field.querySelector('code');
    if (codeEl) codeEl.textContent = e.target.value;

    // Update live preview CSS custom property
    var dataVar = e.target.getAttribute('data-var');
    if (dataVar) {
      var preview = document.getElementById('doqix-preview-card');
      if (preview) {
        preview.style.setProperty(dataVar, e.target.value);

        // If accent colour, also update the preview card border
        if (dataVar === '--pricing-accent') {
          preview.style.borderColor = e.target.value;
        }
      }
    }
  });

  /* ────────────────────────────────────────────
   * 8. Reset Colour Buttons
   * ──────────────────────────────────────────── */

  document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('doqix-color-reset')) return;

    var field = e.target.closest('.doqix-color-field');
    if (!field) return;

    var colorInput = field.querySelector('input[type="color"]');
    if (!colorInput) return;

    var defaultVal = e.target.getAttribute('data-default') || '#000000';
    colorInput.value = defaultVal;

    // Update hex code display
    var codeEl = field.querySelector('code');
    if (codeEl) codeEl.textContent = defaultVal === '#000000' ? '' : defaultVal;

    // Clear the name so empty value is submitted (= theme default)
    colorInput.value = defaultVal;

    // Trigger input event to update preview
    var evt = new Event('input', { bubbles: true });
    colorInput.dispatchEvent(evt);
  });

  /* ────────────────────────────────────────────
   * 9. Preset Actions
   * ──────────────────────────────────────────── */

  // Toggle add-preset form
  var addPresetToggle = document.getElementById('doqix-add-preset-toggle');
  var addPresetForm = document.getElementById('doqix-add-preset-form');

  if (addPresetToggle && addPresetForm) {
    addPresetToggle.addEventListener('click', function() {
      addPresetForm.style.display = addPresetForm.style.display === 'none' ? '' : 'none';
    });
  }

  // Cancel add-preset
  var cancelPreset = document.getElementById('doqix-add-preset-cancel');
  if (cancelPreset && addPresetForm) {
    cancelPreset.addEventListener('click', function() {
      addPresetForm.style.display = 'none';
    });
  }

  // Delete preset confirmation (delegated for .doqix-delete-link)
  document.addEventListener('click', function(e) {
    var deleteLink = e.target.closest('.doqix-delete-link');
    if (!deleteLink) return;

    e.preventDefault();
    if (confirm('Delete this preset?')) {
      window.location.href = deleteLink.href;
    }
  });

  /* ────────────────────────────────────────────
   * 10. Card Title Live Update
   * ──────────────────────────────────────────── */

  document.addEventListener('input', function(e) {
    var inp = e.target;
    if (!inp.name || inp.name.indexOf('[name]') === -1) return;

    var panel = inp.closest('.doqix-card-panel');
    if (!panel) return;

    var titleEl = panel.querySelector('.doqix-card-title');
    if (titleEl) {
      titleEl.textContent = inp.value || 'Untitled Card';
    }
  });

  /* ────────────────────────────────────────────
   * 11. Colour Overrides Toggle
   * ──────────────────────────────────────────── */

  document.addEventListener('click', function(e) {
    var toggle = e.target.closest('.doqix-color-overrides-toggle');
    if (!toggle) return;

    e.preventDefault();
    var overrides = toggle.nextElementSibling;
    if (!overrides) return;

    overrides.classList.toggle('doqix-open');
    toggle.classList.toggle('doqix-open');
  });

})();
