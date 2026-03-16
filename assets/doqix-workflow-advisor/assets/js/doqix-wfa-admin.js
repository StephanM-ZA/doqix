/**
 * Do.Qix Workflow Advisor — Admin Repeater Logic
 * Version: 1.0.0
 *
 * Vanilla JS (no jQuery). Handles add/remove rows for categories,
 * services, and workflows (with sub-repeater for steps).
 * Auto-syncs category changes to service dropdowns and workflow checkboxes.
 */
(function() {
  'use strict';

  var OPT = 'doqix_wfa_settings';

  /* ── Helpers ── */

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

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

  function updateRemoveButtons(container) {
    var rows = container.querySelectorAll('.doqix-repeater-row');
    var removeButtons = container.querySelectorAll('.doqix-remove-row');
    for (var i = 0; i < removeButtons.length; i++) {
      removeButtons[i].disabled = rows.length <= 1;
    }
  }

  /** Get current categories from the categories table */
  function getCurrentCategories() {
    var cats = [];
    var rows = categoriesBody.querySelectorAll('.doqix-repeater-row');
    for (var i = 0; i < rows.length; i++) {
      var keyInput = rows[i].querySelector('.doqix-cat-key');
      var nameInput = rows[i].querySelector('.doqix-cat-name');
      if (keyInput && nameInput && keyInput.value) {
        cats.push({ key: keyInput.value, name: nameInput.value });
      }
    }
    return cats;
  }

  /** Refresh all service category dropdowns with current categories */
  function refreshServiceDropdowns() {
    var cats = getCurrentCategories();
    var selects = servicesBody.querySelectorAll('.doqix-svc-category');
    for (var i = 0; i < selects.length; i++) {
      var currentVal = selects[i].value;
      selects[i].innerHTML = '';
      for (var c = 0; c < cats.length; c++) {
        var opt = document.createElement('option');
        opt.value = cats[c].key;
        opt.textContent = cats[c].name;
        if (cats[c].key === currentVal) opt.selected = true;
        selects[i].appendChild(opt);
      }
    }
  }

  /** Refresh all workflow category checkbox groups */
  function refreshWorkflowCheckboxes() {
    var cats = getCurrentCategories();
    var groups = workflowsContainer.querySelectorAll('.doqix-wf-categories');
    for (var i = 0; i < groups.length; i++) {
      var card = groups[i].closest('.doqix-repeater-row');
      var idx = card ? card.getAttribute('data-index') : i;

      /* Collect currently checked */
      var checked = {};
      var existing = groups[i].querySelectorAll('input[type="checkbox"]');
      for (var e = 0; e < existing.length; e++) {
        if (existing[e].checked) {
          checked[existing[e].value] = true;
        }
      }

      /* Rebuild */
      groups[i].innerHTML = '';
      for (var c = 0; c < cats.length; c++) {
        var label = document.createElement('label');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.name = OPT + '[workflows][' + idx + '][categories][]';
        cb.value = cats[c].key;
        if (checked[cats[c].key]) cb.checked = true;
        label.appendChild(cb);
        label.appendChild(document.createTextNode(' ' + cats[c].name));
        groups[i].appendChild(label);
      }
    }
  }

  /** Build category options HTML for a service dropdown */
  function buildCategoryOptions(selectedKey) {
    var cats = getCurrentCategories();
    var html = '';
    for (var c = 0; c < cats.length; c++) {
      html += '<option value="' + cats[c].key + '"' +
        (cats[c].key === selectedKey ? ' selected' : '') + '>' +
        cats[c].name + '</option>';
    }
    return html;
  }

  /* ── Category repeater ── */

  var categoriesBody = document.getElementById('doqix-categories-body');
  var addCategoryBtn = document.getElementById('doqix-add-category');

  if (addCategoryBtn && categoriesBody) {
    addCategoryBtn.addEventListener('click', function() {
      var rows = categoriesBody.querySelectorAll('.doqix-repeater-row');
      var idx = rows.length;
      var tr = document.createElement('tr');
      tr.className = 'doqix-repeater-row';
      tr.setAttribute('data-index', idx);
      tr.innerHTML =
        '<td><input type="text" name="' + OPT + '[categories][' + idx + '][key]" value="" class="regular-text doqix-cat-key" readonly></td>' +
        '<td><input type="text" name="' + OPT + '[categories][' + idx + '][name]" value="" class="regular-text doqix-cat-name" required></td>' +
        '<td class="doqix-col-action"><button type="button" class="button doqix-remove-row">Remove</button></td>';
      categoriesBody.appendChild(tr);
      updateRemoveButtons(categoriesBody);
    });

    categoriesBody.addEventListener('click', function(e) {
      if (!e.target.classList.contains('doqix-remove-row')) return;
      var row = e.target.closest('.doqix-repeater-row');
      if (row && categoriesBody.querySelectorAll('.doqix-repeater-row').length > 1) {
        row.remove();
        reindexRows(categoriesBody, 'categories');
        refreshServiceDropdowns();
        refreshWorkflowCheckboxes();
      }
    });

    /* Auto-generate key from name + sync dropdowns/checkboxes */
    categoriesBody.addEventListener('input', function(e) {
      if (!e.target.classList.contains('doqix-cat-name')) return;
      var row = e.target.closest('.doqix-repeater-row');
      if (!row) return;
      var keyInput = row.querySelector('.doqix-cat-key');
      if (keyInput) {
        keyInput.value = slugify(e.target.value);
      }
      refreshServiceDropdowns();
      refreshWorkflowCheckboxes();
    });

    updateRemoveButtons(categoriesBody);
  }

  /* ── Service repeater ── */

  var servicesBody = document.getElementById('doqix-services-body');
  var addServiceBtn = document.getElementById('doqix-add-service');

  if (addServiceBtn && servicesBody) {
    addServiceBtn.addEventListener('click', function() {
      var rows = servicesBody.querySelectorAll('.doqix-repeater-row');
      var idx = rows.length;
      var tr = document.createElement('tr');
      tr.className = 'doqix-repeater-row';
      tr.setAttribute('data-index', idx);
      tr.innerHTML =
        '<td><input type="text" name="' + OPT + '[services][' + idx + '][key]" value="" class="regular-text doqix-svc-key" readonly></td>' +
        '<td><input type="text" name="' + OPT + '[services][' + idx + '][name]" value="" class="regular-text doqix-svc-name" required></td>' +
        '<td><select name="' + OPT + '[services][' + idx + '][category]" class="doqix-svc-category">' +
          buildCategoryOptions('') +
        '</select></td>' +
        '<td class="doqix-col-action"><button type="button" class="button doqix-remove-row">Remove</button></td>';
      servicesBody.appendChild(tr);
      updateRemoveButtons(servicesBody);
    });

    servicesBody.addEventListener('click', function(e) {
      if (!e.target.classList.contains('doqix-remove-row')) return;
      var row = e.target.closest('.doqix-repeater-row');
      if (row && servicesBody.querySelectorAll('.doqix-repeater-row').length > 1) {
        row.remove();
        reindexRows(servicesBody, 'services');
      }
    });

    /* Auto-generate key from name */
    servicesBody.addEventListener('input', function(e) {
      if (!e.target.classList.contains('doqix-svc-name')) return;
      var row = e.target.closest('.doqix-repeater-row');
      if (!row) return;
      var keyInput = row.querySelector('.doqix-svc-key');
      if (keyInput) {
        keyInput.value = slugify(e.target.value);
      }
    });

    updateRemoveButtons(servicesBody);
  }

  /* ── Workflow repeater ── */

  var workflowsContainer = document.getElementById('doqix-workflows-container');
  var addWorkflowBtn = document.getElementById('doqix-add-workflow');

  if (addWorkflowBtn && workflowsContainer) {
    addWorkflowBtn.addEventListener('click', function() {
      var cards = workflowsContainer.querySelectorAll('.doqix-repeater-row');
      var idx = cards.length;
      var cats = getCurrentCategories();

      /* Build category checkboxes */
      var cbHtml = '';
      for (var c = 0; c < cats.length; c++) {
        cbHtml += '<label><input type="checkbox" name="' + OPT + '[workflows][' + idx + '][categories][]" value="' + cats[c].key + '"> ' + cats[c].name + '</label>';
      }

      var div = document.createElement('div');
      div.className = 'doqix-workflow-card doqix-repeater-row';
      div.setAttribute('data-index', idx);
      div.innerHTML =
        '<div class="doqix-workflow-card-header">' +
          '<strong class="doqix-workflow-card-title">New Workflow</strong>' +
          '<button type="button" class="button doqix-remove-row">Remove</button>' +
        '</div>' +
        '<div class="doqix-workflow-card-body">' +
          '<div class="doqix-field-grid">' +
            '<label>Title<input type="text" name="' + OPT + '[workflows][' + idx + '][title]" value="" class="regular-text doqix-wf-title" required></label>' +
            '<label>Hours Saved/Month<input type="number" name="' + OPT + '[workflows][' + idx + '][hours_saved]" value="0" min="0" class="small-text"></label>' +
            '<label>Difficulty<select name="' + OPT + '[workflows][' + idx + '][difficulty]">' +
              '<option value="easy">Easy</option>' +
              '<option value="medium" selected>Medium</option>' +
              '<option value="hard">Hard</option>' +
            '</select></label>' +
          '</div>' +
          '<div class="doqix-desc-row">' +
            '<label>Description<textarea name="' + OPT + '[workflows][' + idx + '][description]" class="large-text" rows="2"></textarea></label>' +
          '</div>' +
          '<div class="doqix-cats-row">' +
            '<span class="doqix-label">Required Categories</span>' +
            '<div class="doqix-checkbox-group doqix-wf-categories">' + cbHtml + '</div>' +
          '</div>' +
          '<div class="doqix-steps-row">' +
            '<span class="doqix-label">Flow Steps</span>' +
            '<table class="doqix-steps-table" data-wf-index="' + idx + '">' +
              '<thead><tr><th>Label</th><th>Type</th><th class="doqix-col-action"></th></tr></thead>' +
              '<tbody>' +
                '<tr class="doqix-step-row" data-step-index="0">' +
                  '<td><input type="text" name="' + OPT + '[workflows][' + idx + '][steps][0][label]" value="" class="regular-text" required></td>' +
                  '<td><select name="' + OPT + '[workflows][' + idx + '][steps][0][type]"><option value="trigger">Trigger</option><option value="action">Action</option></select></td>' +
                  '<td class="doqix-col-action"><button type="button" class="button doqix-remove-step">Remove</button></td>' +
                '</tr>' +
              '</tbody>' +
            '</table>' +
            '<button type="button" class="button doqix-add-step">+ Add Step</button>' +
          '</div>' +
        '</div>';
      workflowsContainer.appendChild(div);
      updateRemoveButtons(workflowsContainer);
    });

    /* Remove workflow */
    workflowsContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('doqix-remove-row')) {
        var row = e.target.closest('.doqix-repeater-row');
        if (row && workflowsContainer.querySelectorAll('.doqix-repeater-row').length > 1) {
          row.remove();
          reindexWorkflows();
        }
        return;
      }

      /* Add step */
      if (e.target.classList.contains('doqix-add-step')) {
        var stepsRow = e.target.closest('.doqix-steps-row');
        var table = stepsRow.querySelector('.doqix-steps-table');
        var tbody = table.querySelector('tbody');
        var wfIdx = table.getAttribute('data-wf-index');
        var stepRows = tbody.querySelectorAll('.doqix-step-row');
        var stepIdx = stepRows.length;

        var tr = document.createElement('tr');
        tr.className = 'doqix-step-row';
        tr.setAttribute('data-step-index', stepIdx);
        tr.innerHTML =
          '<td><input type="text" name="' + OPT + '[workflows][' + wfIdx + '][steps][' + stepIdx + '][label]" value="" class="regular-text" required></td>' +
          '<td><select name="' + OPT + '[workflows][' + wfIdx + '][steps][' + stepIdx + '][type]"><option value="trigger">Trigger</option><option value="action" selected>Action</option></select></td>' +
          '<td class="doqix-col-action"><button type="button" class="button doqix-remove-step">Remove</button></td>';
        tbody.appendChild(tr);
        updateStepRemoveButtons(tbody);
        return;
      }

      /* Remove step */
      if (e.target.classList.contains('doqix-remove-step')) {
        var stepRow = e.target.closest('.doqix-step-row');
        var stepsBody = stepRow.closest('tbody');
        if (stepRow && stepsBody.querySelectorAll('.doqix-step-row').length > 1) {
          stepRow.remove();
          reindexSteps(stepsBody);
        }
        return;
      }
    });

    /* Auto-update card title from workflow title */
    workflowsContainer.addEventListener('input', function(e) {
      if (!e.target.classList.contains('doqix-wf-title')) return;
      var card = e.target.closest('.doqix-repeater-row');
      if (!card) return;
      var titleEl = card.querySelector('.doqix-workflow-card-title');
      if (titleEl) {
        titleEl.textContent = e.target.value || 'New Workflow';
      }
    });

    updateRemoveButtons(workflowsContainer);

    /* Initialize step remove buttons */
    var allStepBodies = workflowsContainer.querySelectorAll('.doqix-steps-table tbody');
    for (var sb = 0; sb < allStepBodies.length; sb++) {
      updateStepRemoveButtons(allStepBodies[sb]);
    }
  }

  /** Re-index workflow cards and their steps */
  function reindexWorkflows() {
    var cards = workflowsContainer.querySelectorAll('.doqix-repeater-row');
    for (var i = 0; i < cards.length; i++) {
      cards[i].setAttribute('data-index', i);

      /* Re-index all inputs/selects/textareas in the card */
      var fields = cards[i].querySelectorAll('input, select, textarea');
      for (var j = 0; j < fields.length; j++) {
        var name = fields[j].getAttribute('name');
        if (name) {
          fields[j].setAttribute('name',
            name.replace(
              new RegExp(OPT + '\\[workflows\\]\\[\\d+\\]'),
              OPT + '[workflows][' + i + ']'
            )
          );
        }
      }

      /* Update steps table data-wf-index */
      var stepsTable = cards[i].querySelector('.doqix-steps-table');
      if (stepsTable) {
        stepsTable.setAttribute('data-wf-index', i);
      }
    }
    updateRemoveButtons(workflowsContainer);
  }

  /** Re-index steps within a workflow's tbody */
  function reindexSteps(tbody) {
    var rows = tbody.querySelectorAll('.doqix-step-row');
    var table = tbody.closest('.doqix-steps-table');
    var wfIdx = table ? table.getAttribute('data-wf-index') : '0';

    for (var i = 0; i < rows.length; i++) {
      rows[i].setAttribute('data-step-index', i);
      var fields = rows[i].querySelectorAll('input, select');
      for (var j = 0; j < fields.length; j++) {
        var name = fields[j].getAttribute('name');
        if (name) {
          fields[j].setAttribute('name',
            name.replace(
              new RegExp('\\[steps\\]\\[\\d+\\]'),
              '[steps][' + i + ']'
            )
          );
        }
      }
    }
    updateStepRemoveButtons(tbody);
  }

  /** Disable step remove button if only 1 step remains */
  function updateStepRemoveButtons(tbody) {
    var rows = tbody.querySelectorAll('.doqix-step-row');
    var btns = tbody.querySelectorAll('.doqix-remove-step');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = rows.length <= 1;
    }
  }

  /* ── Color picker → hex text sync ── */
  var colorInputs = document.querySelectorAll('input[type="color"]');
  for (var ci = 0; ci < colorInputs.length; ci++) {
    colorInputs[ci].addEventListener('input', function() {
      var field = this.closest('.doqix-color-field');
      if (!field) return;
      var codeEl = field.querySelector('code');
      if (codeEl) codeEl.textContent = this.value;
      this.removeAttribute('data-is-default');
    });
  }

  /* ── Reset to theme default ── */
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
})();
