# Build Request Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a guided multi-step popup that opens from the "Let's Build" header CTA (and `?build=1` URL parameter), captures custom build ideas, computes a transparent starting price with two delivery options, and submits to a new webhook.

**Architecture:** Vanilla IIFE-wrapped JavaScript module (matches the existing `exit-popup.js` and `header.js` pattern). The module exposes `window.DoqixBuildPopup.open()` so the header script can trigger it. Pure-function calculator is testable in isolation. All visual styles extend `global.css` using a `.build-popup-*` namespace that mirrors the existing `.exit-popup-*` family. Config (pricing, launch offer) lives in a JSON file the popup fetches at load with hardcoded fallbacks.

**Tech Stack:** Vanilla JS (no framework), CSS, HTML. Tailwind CLI for utility CSS (already present). No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-28-build-request-popup-design.md`

---

## File Structure

### Files to create

```
design/build-request/
  build-request.html            Preview/test page (matches design/exit-popup/exit-popup.html pattern)
  build-request-tests.html      Browser test harness for the calculator
  js/
    build-request.js            Wizard state machine, calculator, submission, config loader
design/
  build-request-config.json     Launch offer + pricing config
docs/superpowers/plans/
  2026-04-28-build-request-popup.md  This file
```

### Files to modify

```
design/global.css                       Add .build-popup-* styles
design/components/js/header.js          Bind clicks on #cta-lets-build* and ?build=1 auto-open
design/thank-you/thank-you.html         Wrap copy in containers with data-attrs for swapping
design/thank-you/js/thank-you.js        New file (currently absent) — param-driven copy switcher
design/index/index.html                 Add build-request.js script tag
design/services/services.html           Same
design/products/products.html           Same
design/contact/contact.html             Same
design/cookie-banner/cookie-banner.html Add disclosure for build-popup analytics
```

### Sync targets (via CLAUDE.md sync rules)

`site/` mirrors of every changed `design/` file. Cache-bust version bump to `web-v0.10.0`.

---

## Task 1: Pricing config + calculator with browser test harness

**Files:**
- Create: `design/build-request-config.json`
- Create: `design/build-request/js/build-request.js` (calculator + rounding helpers only)
- Create: `design/build-request/build-request-tests.html` (test harness)

**Why first:** the calculator is the only pure logic in the popup. Getting it test-covered first means everything else can be built confidently on top.

- [ ] **Step 1.1: Create the config file**

Create `design/build-request-config.json` with the exact contents:

```json
{
  "launch_offer": {
    "enabled": true,
    "spots_remaining": 7,
    "total_spots": 10,
    "discount_pct": 0.20,
    "label": "20% off setup"
  },
  "base": {
    "automation": 3000,
    "dashboard":  8000,
    "app":       15000,
    "unsure":     8000
  },
  "size_multiplier": {
    "small":   1,
    "medium":  2,
    "big":     4,
    "unsure":  2
  },
  "login_addon": 5000,
  "integ_addon": 3000,
  "managed": {
    "setup_pct":    0.20,
    "hosting_base": 1500
  }
}
```

- [ ] **Step 1.2: Write the failing calculator tests**

Create `design/build-request/build-request-tests.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Build Request — Calculator Tests</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 2rem; max-width: 900px; margin: 0 auto; background: #0C1830; color: #e4e1e9; }
    h1 { color: #00e5a0; }
    .pass { color: #00e5a0; }
    .fail { color: #ff6b6b; font-weight: 700; }
    .case { padding: 0.5rem 0; border-bottom: 1px solid #14203C; font-family: monospace; font-size: 0.85rem; }
    .summary { margin-top: 2rem; padding: 1rem; background: #14203C; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>Build Request — Calculator Tests</h1>
  <div id="results"></div>
  <div id="summary" class="summary"></div>
  <script src="js/build-request.js?v=0.10.0"></script>
  <script>
    var T = window.DoqixBuildPopup._test;
    var passed = 0, failed = 0, lines = [];
    function expect(name, actual, expected) {
      var ok = JSON.stringify(actual) === JSON.stringify(expected);
      var cls = ok ? 'pass' : 'fail';
      var icon = ok ? '✓' : '✗';
      lines.push('<div class="case ' + cls + '">' + icon + ' ' + name +
                 (ok ? '' : '<br>  expected: ' + JSON.stringify(expected) + '<br>  actual:   ' + JSON.stringify(actual)) +
                 '</div>');
      if (ok) passed++; else failed++;
    }

    var cfg = {
      base: { automation: 3000, dashboard: 8000, app: 15000, unsure: 8000 },
      size_multiplier: { small: 1, medium: 2, big: 4, unsure: 2 },
      login_addon: 5000, integ_addon: 3000,
      managed: { setup_pct: 0.20, hosting_base: 1500 },
      launch_offer: { enabled: true, spots_remaining: 5, discount_pct: 0.20 }
    };

    /* Rounding helpers */
    expect('roundUp(7600, 500)', T.roundUp(7600, 500), 8000);
    expect('roundUp(7500, 500)', T.roundUp(7500, 500), 7500);
    expect('roundUp(7501, 500)', T.roundUp(7501, 500), 8000);
    expect('roundNearest(7600, 500)', T.roundNearest(7600, 500), 7500);
    expect('roundNearest(7750, 500)', T.roundNearest(7750, 500), 8000);
    expect('roundNearest(2541.67, 500)', T.roundNearest(2541.67, 500), 2500);

    /* Threshold rule */
    expect('type=unsure → consultation',
      T.routeFor({ type: 'unsure', size: 'small', login: 'no', integrations: 'no' }), 'consultation');
    expect('two unsures → consultation',
      T.routeFor({ type: 'app', size: 'unsure', login: 'unsure', integrations: 'no' }), 'consultation');
    expect('one unsure → estimate',
      T.routeFor({ type: 'app', size: 'medium', login: 'unsure', integrations: 'no' }), 'estimate');
    expect('zero unsures → estimate',
      T.routeFor({ type: 'app', size: 'medium', login: 'yes', integrations: 'yes' }), 'estimate');

    /* Worked examples from spec */
    var r1 = T.calculate({ type: 'automation', size: 'small', login: 'no', integrations: 'no' }, cfg);
    expect('small auto build_cost', r1.build_cost, 3000);
    expect('small auto handover', r1.handover_price, 3000);
    expect('small auto min_months', r1.min_months, 6);
    expect('small auto managed_setup', r1.managed_setup, 500);
    expect('small auto managed_monthly', r1.managed_monthly, 2000);

    var r2 = T.calculate({ type: 'app', size: 'medium', login: 'yes', integrations: 'yes' }, cfg);
    expect('medium app build_cost', r2.build_cost, 38000);
    expect('medium app handover', r2.handover_price, 38000);
    expect('medium app min_months', r2.min_months, 12);
    expect('medium app managed_setup', r2.managed_setup, 7500);
    expect('medium app managed_monthly', r2.managed_monthly, 4000);

    var r3 = T.calculate({ type: 'app', size: 'big', login: 'yes', integrations: 'yes' }, cfg);
    expect('big app build_cost', r3.build_cost, 68000);
    expect('big app min_months', r3.min_months, 18);
    expect('big app managed_setup', r3.managed_setup, 13500);
    expect('big app managed_monthly', r3.managed_monthly, 4500);

    var r4 = T.calculate({ type: 'dashboard', size: 'small', login: 'no', integrations: 'no' }, cfg);
    expect('small dash build_cost', r4.build_cost, 8000);
    expect('small dash min_months', r4.min_months, 6);
    expect('small dash managed_setup', r4.managed_setup, 1500);
    expect('small dash managed_monthly', r4.managed_monthly, 2500);

    /* Defaulting unsure */
    var r5 = T.calculate({ type: 'app', size: 'unsure', login: 'no', integrations: 'no' }, cfg);
    expect('unsure size defaults to medium', r5.build_cost, 30000); // 15000 * 2

    /* Discount */
    expect('handover after 20% discount',
      T.applyDiscount(38000, 0.20), 30500); // 38000 * 0.8 = 30400 → roundNearest 500 = 30500
    expect('managed setup after 20% discount',
      T.applyDiscount(7500, 0.20), 6000);

    /* Render results */
    document.getElementById('results').innerHTML = lines.join('');
    document.getElementById('summary').innerHTML =
      '<strong>' + passed + ' passed</strong>' +
      (failed > 0 ? ', <span class="fail">' + failed + ' failed</span>' : '');
  </script>
</body>
</html>
```

- [ ] **Step 1.3: Run tests to verify they fail**

Open `design/build-request/build-request-tests.html` in a browser.
Expected: page errors out (`window.DoqixBuildPopup` undefined). All assertions fail.

- [ ] **Step 1.4: Implement the calculator**

Create `design/build-request/js/build-request.js`:

```javascript
/* Do.Qix Build Request Popup — calculator + state machine + rendering. */

(function () {
    'use strict';

    /* ──────────── Rounding helpers ──────────── */
    function roundUp(x, step) { return Math.ceil(x / step) * step; }
    function roundNearest(x, step) { return Math.round(x / step) * step; }

    /* ──────────── Defaults applied when an answer is "unsure" ──────────── */
    var UNSURE_DEFAULTS = { size: 'medium', login: 'no', integrations: 'no' };

    function applyUnsureDefaults(answers) {
        return {
            type:         answers.type,
            size:         answers.size === 'unsure' ? UNSURE_DEFAULTS.size : answers.size,
            login:        answers.login === 'unsure' ? UNSURE_DEFAULTS.login : answers.login,
            integrations: answers.integrations === 'unsure' ? UNSURE_DEFAULTS.integrations : answers.integrations
        };
    }

    /* ──────────── Threshold rule ──────────── */
    function routeFor(answers) {
        if (answers.type === 'unsure') return 'consultation';
        var unsures = 0;
        if (answers.size === 'unsure') unsures++;
        if (answers.login === 'unsure') unsures++;
        if (answers.integrations === 'unsure') unsures++;
        return unsures >= 2 ? 'consultation' : 'estimate';
    }

    /* ──────────── Calculator ──────────── */
    function calculate(answers, cfg) {
        var a = applyUnsureDefaults(answers);
        var basePrice = cfg.base[a.type] != null ? cfg.base[a.type] : cfg.base.unsure;
        var sizeMult = cfg.size_multiplier[a.size];
        var loginAdd = a.login === 'yes' ? cfg.login_addon : 0;
        var integAdd = a.integrations === 'yes' ? cfg.integ_addon : 0;

        var buildCost = roundUp((basePrice * sizeMult) + loginAdd + integAdd, 500);

        var minMonths = buildCost < 15000 ? 6
                      : buildCost <= 50000 ? 12
                      : 18;

        var managedSetup = roundNearest(buildCost * cfg.managed.setup_pct, 500);
        var amortized = roundNearest((buildCost - managedSetup) / minMonths, 500);
        var managedMonthly = amortized + cfg.managed.hosting_base;

        return {
            build_cost:      buildCost,
            handover_price:  buildCost,
            managed_setup:   managedSetup,
            managed_monthly: managedMonthly,
            min_months:      minMonths
        };
    }

    function applyDiscount(price, pct) {
        return roundNearest(price * (1 - pct), 500);
    }

    /* ──────────── Public surface ──────────── */
    window.DoqixBuildPopup = {
        /* Test exports — used by build-request-tests.html. Do not call from production code. */
        _test: { roundUp: roundUp, roundNearest: roundNearest, routeFor: routeFor, calculate: calculate, applyDiscount: applyDiscount }
    };
})();
```

- [ ] **Step 1.5: Run tests to verify they pass**

Reload `build-request-tests.html` in the browser.
Expected: all assertions show ✓ in green; summary reads "29 passed".

- [ ] **Step 1.6: Commit**

```bash
git add design/build-request-config.json \
         design/build-request/js/build-request.js \
         design/build-request/build-request-tests.html
git commit -m "feat(build-popup): add config, calculator, and test harness"
```

---

## Task 2: Popup CSS scaffolding

**Files:**
- Modify: `design/global.css` (append `.build-popup-*` styles at end)

**Why now:** with no styles in place, every render task we do will look broken. Adding the CSS once gives every later task a working canvas.

- [ ] **Step 2.1: Append the build-popup CSS block**

Open `design/global.css` and append this block at the end (after the existing `.exit-popup-*` rules around line 1394):

```css
/* ============================================
   BUILD REQUEST POPUP — mirrors exit-popup pattern
   ============================================ */
#build-popup-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease;
}
#build-popup-overlay.show { display: block; opacity: 1; }

.build-popup-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(12, 24, 48, 0.85);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.build-popup-card {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, calc(-50% + 2rem));
    width: calc(100% - 2rem);
    max-width: 36rem;
    max-height: calc(100vh - 2rem);
    max-height: calc(100dvh - 2rem);
    overflow-y: auto;
    background: var(--color-surface-container, #14203C);
    border: 1px solid rgba(59, 74, 65, 0.2);
    border-radius: 1rem;
    padding: 2.5rem 2rem 1.5rem;
    box-shadow: 0 40px 80px -20px rgba(0, 229, 160, 0.08);
    transition: transform 0.3s ease;
}
#build-popup-overlay.show .build-popup-card {
    transform: translate(-50%, -50%);
}

@media (max-width: 480px) {
    .build-popup-card { padding: 2rem 1.25rem 1.25rem; }
}

.build-popup-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #bacbbf;
    cursor: pointer;
    padding: 0.25rem;
    transition: color 0.2s;
    z-index: 2;
}
.build-popup-close:hover { color: #00e5a0; }

.build-popup-progress {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 0.4rem;
    margin-top: 0.25rem;
}
.build-popup-progress .seg {
    flex: 1;
    height: 3px;
    background: rgba(59, 74, 65, 0.5);
    border-radius: 2px;
    transition: background 0.2s;
}
.build-popup-progress .seg.done { background: #00e5a0; }

.build-popup-step-counter {
    font-size: 0.7rem;
    color: #84958a;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
}

.build-popup-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #00e5a0;
    background: rgba(0, 229, 160, 0.08);
    padding: 0.3rem 0.7rem;
    border-radius: 100px;
    border: 1px solid rgba(0, 229, 160, 0.2);
    margin-bottom: 0.9rem;
}

.build-popup-title {
    font-size: 1.4rem !important;
    font-weight: 900 !important;
    line-height: 1.15 !important;
    letter-spacing: -0.02em !important;
    color: #e4e1e9 !important;
    margin-bottom: 0.6rem !important;
}
.build-popup-title .accent { color: #00e5a0; }

.build-popup-body-text {
    font-size: 0.875rem;
    color: #bacbbf;
    line-height: 1.55;
    margin-bottom: 1rem;
    max-width: 30rem;
}
.build-popup-helper {
    font-size: 0.78rem;
    color: #84958a;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.build-popup-preview-card {
    background: #0C1830;
    border: 1px dashed rgba(0, 229, 160, 0.4);
    border-radius: 8px;
    padding: 0.9rem;
    margin-bottom: 1rem;
}
.build-popup-preview-card .lbl {
    font-size: 0.6rem; color: #00e5a0; letter-spacing: 0.1em; margin-bottom: 0.4rem;
}
.build-popup-preview-card .name {
    font-size: 0.875rem; color: #e4e1e9; font-weight: 600; margin-bottom: 0.3rem;
}
.build-popup-preview-card .price {
    font-size: 1.3rem; color: #00e5a0; font-weight: 700; margin-bottom: 0.3rem;
}
.build-popup-preview-card .foot {
    font-size: 0.7rem; color: #84958a;
}

.build-popup-stat-strip {
    display: flex;
    justify-content: space-around;
    padding: 0.8rem 0;
    border-top: 1px solid rgba(59, 74, 65, 0.3);
    border-bottom: 1px solid rgba(59, 74, 65, 0.3);
    margin-bottom: 1rem;
}
.build-popup-stat-strip .stat { text-align: center; }
.build-popup-stat-strip .num {
    font-size: 1.1rem; color: #00e5a0; font-weight: 700; line-height: 1; margin-bottom: 0.2rem;
}
.build-popup-stat-strip .lbl {
    font-size: 0.65rem; color: #84958a; letter-spacing: 0.05em;
}

.build-popup-launch-card {
    background: linear-gradient(135deg, rgba(0, 229, 160, 0.12), rgba(0, 229, 160, 0.04));
    border: 1px solid rgba(0, 229, 160, 0.3);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
}
.build-popup-launch-card .top {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.7rem; gap: 0.8rem;
}
.build-popup-launch-card .lbl {
    font-size: 0.6rem; color: #00e5a0; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.2rem;
}
.build-popup-launch-card .txt {
    font-size: 0.85rem; color: #e4e1e9; font-weight: 600; line-height: 1.3;
}
.build-popup-launch-card .pill {
    background: #00e5a0; color: #0C1830;
    padding: 0.3rem 0.65rem; border-radius: 100px;
    font-size: 0.7rem; font-weight: 700; white-space: nowrap; flex-shrink: 0;
}
.build-popup-launch-card .meter {
    display: flex; align-items: center; justify-content: space-between; gap: 0.8rem;
    padding-top: 0.6rem; border-top: 1px solid rgba(0, 229, 160, 0.15);
}
.build-popup-launch-card .meter-label .small {
    font-size: 0.65rem; color: #bacbbf; margin-bottom: 0.1rem; letter-spacing: 0.04em;
}
.build-popup-launch-card .meter-label .big {
    font-size: 0.95rem; color: #e4e1e9; font-weight: 700;
}
.build-popup-launch-card .meter-label .big .accent { color: #00e5a0; }
.build-popup-launch-card .squares { display: flex; gap: 0.25rem; flex-wrap: nowrap; }
.build-popup-launch-card .square {
    width: 18px; height: 18px; border-radius: 4px;
    background: rgba(59, 74, 65, 0.5);
    border: 1px solid rgba(59, 74, 65, 0.3);
    transition: background 0.3s;
}
.build-popup-launch-card .square.taken {
    background: rgba(0, 229, 160, 0.15);
    border-color: rgba(0, 229, 160, 0.3);
}
.build-popup-launch-card .square.available {
    background: #00e5a0;
    border-color: #00e5a0;
    box-shadow: 0 0 8px rgba(0, 229, 160, 0.4);
}
@media (max-width: 480px) {
    .build-popup-launch-card .square { width: 14px; height: 14px; }
    .build-popup-launch-card .squares { gap: 0.18rem; }
}

.build-popup-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.build-popup-option {
    background: #1A2A48;
    border: 1px solid rgba(59, 74, 65, 0.4);
    border-radius: 8px;
    padding: 0.85rem 1rem;
    text-align: left;
    color: #e4e1e9;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    font-family: inherit;
    width: 100%;
}
.build-popup-option:hover { border-color: rgba(0, 229, 160, 0.4); }
.build-popup-option[aria-pressed="true"] {
    background: rgba(0, 229, 160, 0.08);
    border: 2px solid #00e5a0;
    padding: calc(0.85rem - 1px) calc(1rem - 1px);
}
.build-popup-option .opt-title {
    font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; color: #e4e1e9;
}
.build-popup-option[aria-pressed="true"] .opt-title { color: #00e5a0; }
.build-popup-option .opt-desc {
    font-size: 0.75rem; color: #84958a; line-height: 1.45;
}
.build-popup-option[aria-pressed="true"] .opt-desc { color: #bacbbf; }

.build-popup-integ-text {
    margin-top: -0.3rem;
    margin-bottom: 1rem;
    display: none;
}
.build-popup-integ-text.show { display: block; }
.build-popup-integ-text input {
    width: 100%;
    background: #0C1830;
    border: 1px solid rgba(59, 74, 65, 0.5);
    border-radius: 6px;
    padding: 0.6rem 0.8rem;
    color: #e4e1e9;
    font-size: 0.8rem;
    font-family: inherit;
}
.build-popup-integ-text input:focus {
    outline: none;
    border-color: #00e5a0;
    box-shadow: 0 0 0 3px rgba(0, 229, 160, 0.15);
}

.build-popup-est-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.8rem;
    margin-bottom: 0.8rem;
}
@media (min-width: 640px) {
    .build-popup-est-grid { grid-template-columns: 1fr 1fr; }
}
.build-popup-est-card {
    background: #1A2A48;
    border: 1px solid rgba(59, 74, 65, 0.4);
    border-radius: 10px;
    padding: 1rem;
    position: relative;
}
.build-popup-est-card.recommended {
    background: rgba(0, 229, 160, 0.05);
    border: 2px solid #00e5a0;
    padding: calc(1rem - 1px);
}
.build-popup-est-card .badge {
    position: absolute;
    top: -10px;
    right: 0.8rem;
    background: #00e5a0;
    color: #0C1830;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    letter-spacing: 0.08em;
}
.build-popup-est-card .icon-name {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;
}
.build-popup-est-card .icon-name .name {
    font-weight: 700; font-size: 0.9rem; color: #e4e1e9;
}
.build-popup-est-card .price {
    font-size: 1.3rem; font-weight: 800; color: #00e5a0; margin-bottom: 0.2rem; letter-spacing: -0.01em;
}
.build-popup-est-card .price .strike {
    color: #84958a; text-decoration: line-through; font-size: 0.85rem; font-weight: 500; margin-right: 0.4rem;
}
.build-popup-est-card .meta {
    font-size: 0.7rem; color: #bacbbf; margin-bottom: 0.5rem;
}
.build-popup-est-card .desc {
    font-size: 0.75rem; color: #bacbbf; line-height: 1.5;
}
.build-popup-est-disclaimer {
    font-size: 0.7rem; color: #84958a; text-align: center; margin: 0.6rem 0 1rem; font-style: italic;
}

.build-popup-form-row {
    display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.8rem;
}
.build-popup-form-row label {
    font-size: 0.75rem; font-weight: 500; color: #bacbbf;
}
.build-popup-form-row label .req { color: #ff6b6b; }
.build-popup-form-row input,
.build-popup-form-row textarea {
    background: #0C1830;
    border: 1px solid rgba(59, 74, 65, 0.5);
    border-radius: 6px;
    padding: 0.7rem 0.9rem;
    color: #e4e1e9;
    font-size: 0.85rem;
    font-family: inherit;
}
.build-popup-form-row input:focus,
.build-popup-form-row textarea:focus {
    outline: none;
    border-color: #00e5a0;
    box-shadow: 0 0 0 3px rgba(0, 229, 160, 0.15);
}
.build-popup-form-row.has-error input,
.build-popup-form-row.has-error textarea {
    border-color: #ff6b6b;
}
.build-popup-form-row .field-error {
    color: #ff6b6b;
    font-size: 0.7rem;
    display: none;
}
.build-popup-form-row.has-error .field-error { display: block; }

.build-popup-honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.build-popup-actions {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(59, 74, 65, 0.2);
}
.build-popup-actions .btn-back {
    background: transparent;
    color: #bacbbf;
    border: 1px solid rgba(59, 74, 65, 0.5);
    padding: 0.85rem 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-family: inherit;
    flex: 0 0 auto;
}
.build-popup-actions .btn-back:hover { color: #e4e1e9; border-color: rgba(186, 203, 191, 0.3); }
.build-popup-actions .btn-next {
    flex: 1;
}

.build-popup-footnote {
    font-size: 0.65rem;
    color: #84958a;
    text-align: center;
    margin-top: 0.6rem;
}

.build-popup-body {
    transition: opacity 0.15s ease;
}
.build-popup-body.fading { opacity: 0; }

body.build-popup-open { overflow: hidden; }
```

- [ ] **Step 2.2: Rebuild Tailwind**

Run: `npm run build`
Expected: Tailwind rebuilds and the new CSS lands in `design/tailwind.css`. (The `.build-popup-*` rules are not Tailwind utilities, so they stay in `global.css` only — but the build step is required by the project.)

- [ ] **Step 2.3: Commit**

```bash
git add design/global.css design/tailwind.css
git commit -m "feat(build-popup): add CSS scaffolding for popup overlay and screens"
```

---

## Task 3: Preview page with hardcoded welcome screen

**Files:**
- Create: `design/build-request/build-request.html`

**Why now:** the preview page lets us see every screen we render in steps 4-onward without having to wire up triggers first.

- [ ] **Step 3.1: Create the preview page**

Create `design/build-request/build-request.html`:

```html
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Do.Qix | Build Request Popup Preview</title>
<link rel="icon" type="image/png" href="../favicon_green.png"/>
<link rel="preload" as="font" type="font/woff2" crossorigin href="../fonts/inter-var.woff2"/>
<link rel="stylesheet" href="../tailwind.css?v=0.10.0"/>
<link rel="stylesheet" href="../global.css?v=0.10.0"/>
</head>
<body class="bg-surface-dim text-on-surface font-body" style="font-family: Inter, sans-serif;">

<!-- Simulated page content behind the popup -->
<div style="max-width:56rem; margin:0 auto; padding:6rem 2rem; opacity:0.4;">
  <h1 style="font-size:3rem; font-weight:900; margin-bottom:1rem;">Your idea, priced honestly.</h1>
  <p style="color:#bacbbf;">Simulated background page. The popup is shown below.</p>
  <p style="margin-top:2rem;">
    <button id="open-popup" style="background:#00e5a0;color:#0C1830;border:none;padding:0.75rem 1.5rem;border-radius:8px;font-weight:700;cursor:pointer;">Open Popup</button>
  </p>
</div>

<script src="js/build-request.js?v=0.10.0"></script>
<script>
  document.getElementById('open-popup').addEventListener('click', function () {
    window.DoqixBuildPopup.open({ trigger: 'preview_button' });
  });
  /* Auto-open on load for fast iteration */
  window.addEventListener('load', function () {
    window.DoqixBuildPopup.open({ trigger: 'preview_auto' });
  });
</script>
</body>
</html>
```

- [ ] **Step 3.2: Open in browser to confirm scaffolding**

Open `design/build-request/build-request.html`.
Expected: page loads with the "Open Popup" button. Clicking it does nothing yet (intentional — `open()` not implemented). No console errors.

- [ ] **Step 3.3: Commit**

```bash
git add design/build-request/build-request.html
git commit -m "feat(build-popup): add preview page scaffold"
```

---

## Task 4: Welcome screen + open/close lifecycle

**Files:**
- Modify: `design/build-request/js/build-request.js`

- [ ] **Step 4.1: Implement open/close, config loader, and welcome render**

Open `design/build-request/js/build-request.js`. Replace the entire file with the following (this includes all calculator code from Task 1 plus the new lifecycle and welcome screen):

```javascript
/* Do.Qix Build Request Popup — calculator + state machine + rendering. */

(function () {
    'use strict';

    /* ──────────── Hardcoded config fallback (mirrors build-request-config.json) ──────────── */
    var FALLBACK_CONFIG = {
        launch_offer: { enabled: true, spots_remaining: 7, total_spots: 10, discount_pct: 0.20, label: '20% off setup' },
        base: { automation: 3000, dashboard: 8000, app: 15000, unsure: 8000 },
        size_multiplier: { small: 1, medium: 2, big: 4, unsure: 2 },
        login_addon: 5000,
        integ_addon: 3000,
        managed: { setup_pct: 0.20, hosting_base: 1500 }
    };

    /* ──────────── Module state ──────────── */
    var state = {
        config: FALLBACK_CONFIG,
        configLoaded: false,
        currentStep: 0,    // 0=welcome, 1=Q1, 2=Q2, 3=Q3, 4=Q4, 5=estimate|consultation, 6=contact
        answers: { type: null, size: null, login: null, integrations: null, integrations_text: '' },
        contact: { name: '', email: '', phone: '', company: '', notes: '' },
        trigger: null,
        previousFocus: null
    };

    var overlay = null;
    var bodyEl = null;

    /* ──────────── Rounding helpers ──────────── */
    function roundUp(x, step) { return Math.ceil(x / step) * step; }
    function roundNearest(x, step) { return Math.round(x / step) * step; }

    /* ──────────── Pure logic ──────────── */
    var UNSURE_DEFAULTS = { size: 'medium', login: 'no', integrations: 'no' };
    function applyUnsureDefaults(a) {
        return {
            type:         a.type,
            size:         a.size === 'unsure' ? UNSURE_DEFAULTS.size : a.size,
            login:        a.login === 'unsure' ? UNSURE_DEFAULTS.login : a.login,
            integrations: a.integrations === 'unsure' ? UNSURE_DEFAULTS.integrations : a.integrations
        };
    }
    function routeFor(answers) {
        if (answers.type === 'unsure') return 'consultation';
        var u = 0;
        if (answers.size === 'unsure') u++;
        if (answers.login === 'unsure') u++;
        if (answers.integrations === 'unsure') u++;
        return u >= 2 ? 'consultation' : 'estimate';
    }
    function calculate(answers, cfg) {
        var a = applyUnsureDefaults(answers);
        var basePrice = cfg.base[a.type] != null ? cfg.base[a.type] : cfg.base.unsure;
        var sizeMult = cfg.size_multiplier[a.size];
        var loginAdd = a.login === 'yes' ? cfg.login_addon : 0;
        var integAdd = a.integrations === 'yes' ? cfg.integ_addon : 0;
        var buildCost = roundUp((basePrice * sizeMult) + loginAdd + integAdd, 500);
        var minMonths = buildCost < 15000 ? 6 : buildCost <= 50000 ? 12 : 18;
        var managedSetup = roundNearest(buildCost * cfg.managed.setup_pct, 500);
        var amortized = roundNearest((buildCost - managedSetup) / minMonths, 500);
        return {
            build_cost: buildCost,
            handover_price: buildCost,
            managed_setup: managedSetup,
            managed_monthly: amortized + cfg.managed.hosting_base,
            min_months: minMonths
        };
    }
    function applyDiscount(price, pct) { return roundNearest(price * (1 - pct), 500); }

    /* ──────────── Config loader ──────────── */
    function loadConfig() {
        if (state.configLoaded) return Promise.resolve(state.config);
        var path = pathToConfig();
        return fetch(path, { cache: 'no-cache' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (json) {
                if (json) state.config = mergeConfig(FALLBACK_CONFIG, json);
                state.configLoaded = true;
                return state.config;
            })
            .catch(function () { state.configLoaded = true; return state.config; });
    }
    function pathToConfig() {
        /* Same base detection used in header.js */
        if (window.location.pathname.indexOf('/doqix/') !== -1) return 'build-request-config.json';
        var depth = window.location.pathname.split('/').filter(Boolean).length;
        return depth > 1 ? '../build-request-config.json' : 'build-request-config.json';
    }
    function mergeConfig(base, override) {
        var out = {};
        for (var k in base) out[k] = base[k];
        for (var k2 in override) {
            out[k2] = (typeof base[k2] === 'object' && typeof override[k2] === 'object')
                ? mergeConfig(base[k2], override[k2]) : override[k2];
        }
        return out;
    }

    /* ──────────── Overlay scaffolding ──────────── */
    function ensureOverlay() {
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'build-popup-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'build-popup-title');
        overlay.innerHTML =
            '<div class="build-popup-backdrop"></div>' +
            '<div class="build-popup-card" role="document">' +
                '<button class="build-popup-close" aria-label="Close">' +
                    '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>' +
                    '</svg>' +
                '</button>' +
                '<div class="build-popup-body" id="build-popup-body"></div>' +
            '</div>';
        document.body.appendChild(overlay);
        bodyEl = overlay.querySelector('#build-popup-body');
        overlay.querySelector('.build-popup-close').addEventListener('click', closePopup);
        overlay.querySelector('.build-popup-backdrop').addEventListener('click', closePopup);
        return overlay;
    }

    function openPopup(opts) {
        opts = opts || {};
        state.trigger = opts.trigger || 'unknown';
        state.previousFocus = document.activeElement;
        ensureOverlay();
        loadConfig().then(function () {
            state.currentStep = 0;
            state.answers = { type: null, size: null, login: null, integrations: null, integrations_text: '' };
            state.contact = { name: '', email: '', phone: '', company: '', notes: '' };
            renderStep();
            document.body.classList.add('build-popup-open');
            overlay.style.display = 'block';
            void overlay.offsetHeight;
            overlay.classList.add('show');
            var first = overlay.querySelector('button, [tabindex]:not([tabindex="-1"])');
            if (first) first.focus();
        });
    }

    function closePopup() {
        if (!overlay) return;
        overlay.classList.remove('show');
        document.body.classList.remove('build-popup-open');
        setTimeout(function () { overlay.style.display = 'none'; }, 300);
        if (state.previousFocus && state.previousFocus.focus) state.previousFocus.focus();
    }

    /* ──────────── Rendering ──────────── */
    function renderStep() {
        bodyEl.classList.add('fading');
        setTimeout(function () {
            bodyEl.innerHTML = htmlForStep();
            wireStepHandlers();
            bodyEl.classList.remove('fading');
        }, 100);
    }

    function htmlForStep() {
        switch (state.currentStep) {
            case 0: return renderWelcome();
            default: return '<p style="color:#bacbbf;">Step ' + state.currentStep + ' not yet implemented.</p>';
        }
    }

    function renderWelcome() {
        var lo = state.config.launch_offer;
        var showOffer = lo && lo.enabled && lo.spots_remaining > 0;
        var squares = '';
        if (showOffer) {
            var taken = lo.total_spots - lo.spots_remaining;
            for (var i = 0; i < lo.total_spots; i++) {
                squares += '<span class="square ' + (i < taken ? 'taken' : 'available') + '"></span>';
            }
        }
        return ''
            + '<span class="build-popup-eyebrow">In about 60 seconds</span>'
            + '<h2 class="build-popup-title" id="build-popup-title">Find out what your idea would <span class="accent">cost.</span></h2>'
            + '<p class="build-popup-body-text">Answer 4 simple questions and we\'ll show you a real starting price. No "contact us for a quote". Actual numbers.</p>'
            + '<div class="build-popup-preview-card">'
                + '<p class="lbl">↓ YOU\'LL GET SOMETHING LIKE THIS ↓</p>'
                + '<p class="name">🤝 We build &amp; manage</p>'
                + '<p class="price">R5,000 + R3,500/mo</p>'
                + '<p class="foot">12-month minimum, then month-to-month</p>'
            + '</div>'
            + '<div class="build-popup-stat-strip">'
                + '<div class="stat"><div class="num">60s</div><div class="lbl">to fill in</div></div>'
                + '<div class="stat"><div class="num">4</div><div class="lbl">questions</div></div>'
                + '<div class="stat"><div class="num">R0</div><div class="lbl">to ask</div></div>'
            + '</div>'
            + (showOffer
                ? '<div class="build-popup-launch-card">'
                    + '<div class="top">'
                        + '<div><div class="lbl">Launch offer</div><div class="txt">First ' + lo.total_spots + ' builds get ' + lo.label + '</div></div>'
                        + '<div class="pill">−' + Math.round(lo.discount_pct * 100) + '%</div>'
                    + '</div>'
                    + '<div class="meter">'
                        + '<div class="meter-label"><div class="small">Spots remaining</div><div class="big"><span class="accent">' + lo.spots_remaining + '</span> of ' + lo.total_spots + '</div></div>'
                        + '<div class="squares">' + squares + '</div>'
                    + '</div>'
                + '</div>'
                : '')
            + '<button class="btn btn-primary glow" data-action="start" style="width:100%;">Start →</button>'
            + '<p class="build-popup-footnote">No spam. No follow-up calls unless you want them.</p>';
    }

    function wireStepHandlers() {
        var startBtn = bodyEl.querySelector('[data-action="start"]');
        if (startBtn) startBtn.addEventListener('click', function () { state.currentStep = 1; renderStep(); });
    }

    /* ──────────── Public surface ──────────── */
    window.DoqixBuildPopup = {
        open: openPopup,
        close: closePopup,
        _test: { roundUp: roundUp, roundNearest: roundNearest, routeFor: routeFor, calculate: calculate, applyDiscount: applyDiscount }
    };
})();
```

- [ ] **Step 4.2: Reload preview page and verify**

Reload `design/build-request/build-request.html`.
Expected:
- Popup auto-opens on load.
- Welcome screen visible: eyebrow pill, heading "Find out what your idea would cost.", preview card, stat strip, launch offer with 7 green squares + 3 faded, "Start →" button, footnote.
- Clicking the X close button or backdrop dismisses the popup.
- Clicking "Start →" replaces the body with "Step 1 not yet implemented." (placeholder until next task).
- Reload the test harness — all 29 assertions still pass.

- [ ] **Step 4.3: Commit**

```bash
git add design/build-request/js/build-request.js
git commit -m "feat(build-popup): welcome screen with launch offer and open/close lifecycle"
```

---

## Task 5: Question screens (Q1–Q4) and answer state

**Files:**
- Modify: `design/build-request/js/build-request.js`

- [ ] **Step 5.1: Add question definitions**

Inside the IIFE, before the `htmlForStep` function, add this block:

```javascript
    /* ──────────── Question definitions ──────────── */
    var QUESTIONS = [
        {
            key: 'type',
            title: 'What kind of thing are you trying to build?',
            helper: 'Pick the closest. Don\'t worry about getting this exactly right.',
            options: [
                { value: 'automation', title: '🔄 An automation', desc: 'Something that runs in the background' },
                { value: 'dashboard',  title: '📊 A dashboard',   desc: 'A place to see your data at a glance' },
                { value: 'app',        title: '📱 An app',        desc: 'Something people open and use' },
                { value: 'unsure',     title: '🤔 Not sure yet',  desc: 'We\'ll figure it out together' }
            ]
        },
        {
            key: 'size',
            title: 'How big does the idea feel?',
            helper: 'Rough is fine. Pick the closest match — we\'ll firm it up on the call.',
            options: [
                { value: 'small',  title: '🌱 Small',     desc: 'A calculator, or a form that emails you when filled in.' },
                { value: 'medium', title: '🏗️ Medium',   desc: 'A booking system with admin, or an app with a few screens.' },
                { value: 'big',    title: '🏢 Big',       desc: 'A platform with users, payments, dashboards, lots of features.' },
                { value: 'unsure', title: '🤔 Not sure',  desc: 'That\'s fine — we\'ll figure it out together on a call.' }
            ]
        },
        {
            key: 'login',
            title: 'Will people need to log in?',
            helper: '',
            options: [
                { value: 'yes',    title: '✅ Yes',       desc: 'Different people see different things' },
                { value: 'no',     title: '❌ No',         desc: 'Anyone with the link can use it' },
                { value: 'unsure', title: '🤔 Not sure',   desc: '' }
            ]
        },
        {
            key: 'integrations',
            title: 'Does it need to connect to other tools you already use?',
            helper: 'Things like Xero, Gmail, WhatsApp, Shopify, etc.',
            options: [
                { value: 'yes',    title: '✅ Yes',       desc: '' },
                { value: 'no',     title: '❌ No',         desc: '' },
                { value: 'unsure', title: '🤔 Not sure',   desc: '' }
            ],
            withFreeText: true
        }
    ];
```

- [ ] **Step 5.2: Add the renderQuestion + progress bar functions**

Below `renderWelcome`, add:

```javascript
    function renderProgress(stepIdx, totalSteps) {
        var segs = '';
        for (var i = 1; i <= totalSteps; i++) {
            segs += '<div class="seg ' + (i <= stepIdx ? 'done' : '') + '"></div>';
        }
        return '<div class="build-popup-progress">' + segs + '</div>'
             + '<p class="build-popup-step-counter">Step ' + stepIdx + ' of ' + totalSteps + '</p>';
    }

    function renderQuestion(stepIdx) {
        /* stepIdx is 1..4 (welcome=0). Question index is stepIdx - 1. */
        var q = QUESTIONS[stepIdx - 1];
        var current = state.answers[q.key];
        var optionsHtml = q.options.map(function (o) {
            var pressed = current === o.value ? 'true' : 'false';
            return '<button type="button" class="build-popup-option" aria-pressed="' + pressed + '" data-value="' + o.value + '">'
                + '<div class="opt-title">' + o.title + '</div>'
                + (o.desc ? '<div class="opt-desc">' + o.desc + '</div>' : '')
                + '</button>';
        }).join('');

        var freeText = '';
        if (q.withFreeText) {
            var visible = state.answers[q.key] === 'yes';
            freeText = '<div class="build-popup-integ-text ' + (visible ? 'show' : '') + '">'
                + '<input type="text" data-integ-text placeholder="Which ones? (optional, e.g. Xero, Gmail)" value="' + (state.answers.integrations_text || '').replace(/"/g, '&quot;') + '"/>'
                + '</div>';
        }

        var canContinue = !!current;

        return ''
            + renderProgress(stepIdx, 5)
            + '<h2 class="build-popup-title" id="build-popup-title">' + q.title + '</h2>'
            + (q.helper ? '<p class="build-popup-helper">' + q.helper + '</p>' : '')
            + '<div class="build-popup-options">' + optionsHtml + '</div>'
            + freeText
            + '<div class="build-popup-actions">'
                + '<button type="button" class="btn-back" data-action="back">← Back</button>'
                + '<button type="button" class="btn btn-primary glow btn-next" data-action="next" ' + (canContinue ? '' : 'disabled') + '>Continue →</button>'
            + '</div>';
    }
```

- [ ] **Step 5.3: Update htmlForStep + wireStepHandlers**

Replace `htmlForStep` and `wireStepHandlers` with:

```javascript
    function htmlForStep() {
        if (state.currentStep === 0) return renderWelcome();
        if (state.currentStep >= 1 && state.currentStep <= 4) return renderQuestion(state.currentStep);
        return '<p style="color:#bacbbf;">Step ' + state.currentStep + ' not yet implemented.</p>';
    }

    function wireStepHandlers() {
        var startBtn = bodyEl.querySelector('[data-action="start"]');
        if (startBtn) startBtn.addEventListener('click', function () { state.currentStep = 1; renderStep(); });

        bodyEl.querySelectorAll('.build-popup-option').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var q = QUESTIONS[state.currentStep - 1];
                state.answers[q.key] = btn.getAttribute('data-value');
                /* Show/hide free text field for integrations question */
                if (q.withFreeText) {
                    var ft = bodyEl.querySelector('.build-popup-integ-text');
                    if (ft) ft.classList.toggle('show', state.answers[q.key] === 'yes');
                    if (state.answers[q.key] !== 'yes') state.answers.integrations_text = '';
                }
                /* Update aria-pressed for all options + enable continue */
                bodyEl.querySelectorAll('.build-popup-option').forEach(function (b) {
                    b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
                });
                var nextBtn = bodyEl.querySelector('[data-action="next"]');
                if (nextBtn) nextBtn.disabled = false;
            });
        });

        var integTextInput = bodyEl.querySelector('[data-integ-text]');
        if (integTextInput) {
            integTextInput.addEventListener('input', function () {
                state.answers.integrations_text = integTextInput.value;
            });
        }

        var backBtn = bodyEl.querySelector('[data-action="back"]');
        if (backBtn) backBtn.addEventListener('click', function () {
            state.currentStep = Math.max(0, state.currentStep - 1);
            renderStep();
        });

        var nextBtn = bodyEl.querySelector('[data-action="next"]');
        if (nextBtn) nextBtn.addEventListener('click', function () {
            state.currentStep++;
            renderStep();
        });
    }
```

- [ ] **Step 5.4: Verify in browser**

Reload `design/build-request/build-request.html`.
Expected:
- Click "Start →" — Q1 appears with progress bar (1 of 5 filled), title "What kind of thing are you trying to build?", 4 options.
- Click an option — green ring appears, Continue enables.
- Continue → Q2 ("How big?"), progress shows 2 of 5.
- On Q4, selecting "Yes" reveals a text input below; selecting "No" or "Not sure" hides it again and clears the value.
- Back button returns to previous step with the previously-selected answer still highlighted.
- After Q4, Continue advances to step 5 → "Step 5 not yet implemented."

- [ ] **Step 5.5: Commit**

```bash
git add design/build-request/js/build-request.js
git commit -m "feat(build-popup): question screens Q1–Q4 with answer state and free-text reveal"
```

---

## Task 6: Estimate result + consultation result + threshold routing

**Files:**
- Modify: `design/build-request/js/build-request.js`

- [ ] **Step 6.1: Add result-screen renderers**

After `renderQuestion`, add:

```javascript
    function formatRand(n) { return 'R' + n.toLocaleString('en-ZA', { maximumFractionDigits: 0 }); }

    function renderEstimate() {
        var r = calculate(state.answers, state.config);
        var lo = state.config.launch_offer;
        var discountActive = lo && lo.enabled && lo.spots_remaining > 0;
        var pct = discountActive ? lo.discount_pct : 0;

        var handover = r.handover_price;
        var handoverDiscounted = discountActive ? applyDiscount(handover, pct) : handover;
        var managedSetup = r.managed_setup;
        var managedSetupDiscounted = discountActive ? applyDiscount(managedSetup, pct) : managedSetup;

        /* Stash full estimate object for submission */
        state.estimate = {
            build_cost: r.build_cost,
            handover_price: handover,
            managed_setup: managedSetup,
            managed_monthly: r.managed_monthly,
            min_months: r.min_months,
            launch_offer_applied: discountActive,
            handover_price_after_discount: handoverDiscounted,
            managed_setup_after_discount: managedSetupDiscounted
        };

        var handoverPriceHtml = discountActive
            ? '<span class="strike">' + formatRand(handover) + '</span>' + formatRand(handoverDiscounted)
            : formatRand(handover);
        var managedSetupHtml = discountActive
            ? '<span class="strike">' + formatRand(managedSetup) + '</span>' + formatRand(managedSetupDiscounted)
            : formatRand(managedSetup);

        return ''
            + renderProgress(5, 5)
            + '<p class="build-popup-step-counter">Your starting estimate</p>'
            + '<h2 class="build-popup-title" id="build-popup-title">Two ways to make<br/>it happen.</h2>'
            + '<p class="build-popup-helper">Here\'s where projects like yours typically begin. We\'ll firm up the final numbers on a quick call.</p>'
            + '<div class="build-popup-est-grid">'
                + '<div class="build-popup-est-card">'
                    + '<div class="icon-name"><span class="icon">🏗️</span><span class="name">We build it, you run it</span></div>'
                    + '<div class="price">' + handoverPriceHtml + '</div>'
                    + '<div class="meta">Once-off · yours forever</div>'
                    + '<div class="desc">We hand over the code and setup. You arrange your own hosting (~R200/mo on your side).</div>'
                + '</div>'
                + '<div class="build-popup-est-card recommended">'
                    + '<div class="badge">RECOMMENDED</div>'
                    + '<div class="icon-name"><span class="icon">🤝</span><span class="name">We build &amp; manage</span></div>'
                    + '<div class="price">' + managedSetupHtml + ' + ' + formatRand(r.managed_monthly) + '/mo</div>'
                    + '<div class="meta">' + r.min_months + '-month minimum, then month-to-month</div>'
                    + '<div class="desc">We host, monitor, fix, and improve. You focus on running your business.</div>'
                + '</div>'
            + '</div>'
            + '<p class="build-popup-est-disclaimer">Both options include the same build.' + (discountActive ? ' Prices reflect your launch offer.' : '') + '</p>'
            + '<div class="build-popup-actions">'
                + '<button type="button" class="btn-back" data-action="back">← Back</button>'
                + '<button type="button" class="btn btn-primary glow btn-next" data-action="next">Continue →</button>'
            + '</div>';
    }

    function renderConsultation() {
        state.estimate = null;
        return ''
            + renderProgress(5, 5)
            + '<h2 class="build-popup-title" id="build-popup-title">Sounds like we should<br/><span class="accent">talk first.</span></h2>'
            + '<p class="build-popup-body-text">Some ideas are easier to scope on a quick call than through a form. We\'ll listen, ask the right questions, and send you a clear plan with real numbers within 24 hours.</p>'
            + '<div class="build-popup-actions">'
                + '<button type="button" class="btn-back" data-action="back">← Back</button>'
                + '<button type="button" class="btn btn-primary glow btn-next" data-action="next">Continue →</button>'
            + '</div>';
    }
```

- [ ] **Step 6.2: Wire step 5 routing**

Replace `htmlForStep` with:

```javascript
    function htmlForStep() {
        if (state.currentStep === 0) return renderWelcome();
        if (state.currentStep >= 1 && state.currentStep <= 4) return renderQuestion(state.currentStep);
        if (state.currentStep === 5) {
            state.route = routeFor(state.answers);
            return state.route === 'estimate' ? renderEstimate() : renderConsultation();
        }
        return '<p style="color:#bacbbf;">Step ' + state.currentStep + ' not yet implemented.</p>';
    }
```

- [ ] **Step 6.3: Verify in browser**

Reload `design/build-request/build-request.html`. Walk through several scenarios:

1. **Estimate path:** Q1=app, Q2=medium, Q3=yes, Q4=yes. Step 5 shows "Two ways to make it happen." with both cards. Recommended card has green ring + RECOMMENDED badge. Prices: handover R38,000 → R30,500 (strike), managed R7,500 → R6,000 + R4,000/mo, "12-month minimum".
2. **Consultation path A:** Q1=Not sure. Step 5 shows "Sounds like we should talk first." with no estimate.
3. **Consultation path B:** Q1=app, Q2=Not sure, Q3=Not sure. Step 5 shows consultation screen.
4. **Single unsure:** Q1=app, Q2=Not sure, Q3=yes, Q4=yes. Step 5 shows estimate (size defaults to medium).
5. **Back button:** from step 5 returns to Q4 with previous answer still highlighted.

- [ ] **Step 6.4: Commit**

```bash
git add design/build-request/js/build-request.js
git commit -m "feat(build-popup): estimate + consultation result screens with threshold routing"
```

---

## Task 7: Contact step + form validation

**Files:**
- Modify: `design/build-request/js/build-request.js`

- [ ] **Step 7.1: Add contact-step renderer + validator**

Below `renderConsultation`, add:

```javascript
    function renderContact() {
        var submitLabel = state.route === 'estimate' ? 'Send My Estimate' : 'Get a Call';
        var c = state.contact;
        return ''
            + '<p class="build-popup-step-counter">Last step</p>'
            + '<h2 class="build-popup-title" id="build-popup-title">Where do we send it?</h2>'
            + '<p class="build-popup-helper">' + (state.route === 'estimate'
                ? 'We\'ll email you a copy of your estimate and follow up within 24 hours.'
                : 'A real person will reach out within 24 hours.') + '</p>'
            + '<form id="build-popup-form" novalidate>'
                + '<div class="build-popup-form-row">'
                    + '<label for="bp-name">Your name <span class="req">*</span></label>'
                    + '<input id="bp-name" name="name" type="text" required value="' + escapeAttr(c.name) + '"/>'
                    + '<p class="field-error">Please enter your name.</p>'
                + '</div>'
                + '<div class="build-popup-form-row">'
                    + '<label for="bp-email">Email <span class="req">*</span></label>'
                    + '<input id="bp-email" name="email" type="email" required value="' + escapeAttr(c.email) + '"/>'
                    + '<p class="field-error">Please enter a valid email.</p>'
                + '</div>'
                + '<div class="build-popup-form-row">'
                    + '<label for="bp-phone">Phone <span class="req">*</span></label>'
                    + '<input id="bp-phone" name="phone" type="tel" required value="' + escapeAttr(c.phone) + '"/>'
                    + '<p class="field-error">Please enter your phone number.</p>'
                + '</div>'
                + '<div class="build-popup-form-row">'
                    + '<label for="bp-company">Company <span style="color:#84958a;font-weight:400;">(optional)</span></label>'
                    + '<input id="bp-company" name="company" type="text" value="' + escapeAttr(c.company) + '"/>'
                + '</div>'
                + '<div class="build-popup-form-row">'
                    + '<label for="bp-notes">Anything else we should know? <span style="color:#84958a;font-weight:400;">(optional)</span></label>'
                    + '<textarea id="bp-notes" name="notes" rows="3" placeholder="Deadlines, special considerations, anything that helps us scope it right.">' + escapeText(c.notes) + '</textarea>'
                + '</div>'
                + '<div class="build-popup-honeypot" aria-hidden="true">'
                    + '<label for="bp-website">Website</label>'
                    + '<input id="bp-website" name="website" type="text" tabindex="-1" autocomplete="off"/>'
                + '</div>'
                + '<div class="build-popup-actions">'
                    + '<button type="button" class="btn-back" data-action="back">← Back</button>'
                    + '<button type="submit" class="btn btn-primary glow btn-next" data-action="submit">' + submitLabel + '</button>'
                + '</div>'
                + '<p class="build-popup-footnote">By submitting, you agree to our <a href="privacy-policy.html" style="color:#00e5a0;text-decoration:underline;">Privacy Policy</a>.</p>'
            + '</form>';
    }

    function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }
    function escapeText(s) { return String(s || '').replace(/</g, '&lt;'); }

    function validateContact() {
        var rows = bodyEl.querySelectorAll('.build-popup-form-row');
        var valid = true;
        ['name', 'email', 'phone'].forEach(function (key) {
            var el = bodyEl.querySelector('[name="' + key + '"]');
            if (!el) return;
            var row = el.closest('.build-popup-form-row');
            var v = (el.value || '').trim();
            var bad = !v;
            if (key === 'email' && v) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            row.classList.toggle('has-error', bad);
            if (bad) valid = false;
        });
        return valid;
    }

    function readContact() {
        return {
            name:    (bodyEl.querySelector('[name="name"]')    || {}).value || '',
            email:   (bodyEl.querySelector('[name="email"]')   || {}).value || '',
            phone:   (bodyEl.querySelector('[name="phone"]')   || {}).value || '',
            company: (bodyEl.querySelector('[name="company"]') || {}).value || '',
            notes:   (bodyEl.querySelector('[name="notes"]')   || {}).value || '',
            website: (bodyEl.querySelector('[name="website"]') || {}).value || ''
        };
    }
```

- [ ] **Step 7.2: Wire step 6 + form handling**

Update `htmlForStep`:

```javascript
    function htmlForStep() {
        if (state.currentStep === 0) return renderWelcome();
        if (state.currentStep >= 1 && state.currentStep <= 4) return renderQuestion(state.currentStep);
        if (state.currentStep === 5) {
            state.route = routeFor(state.answers);
            return state.route === 'estimate' ? renderEstimate() : renderConsultation();
        }
        if (state.currentStep === 6) return renderContact();
        return '<p style="color:#bacbbf;">Unknown step.</p>';
    }
```

Update `wireStepHandlers` — add at the bottom (just before the closing `}`):

```javascript
        var form = bodyEl.querySelector('#build-popup-form');
        if (form) {
            ['name', 'email', 'phone', 'company', 'notes'].forEach(function (k) {
                var el = form.querySelector('[name="' + k + '"]');
                if (!el) return;
                el.addEventListener('input', function () {
                    state.contact[k] = el.value;
                    var row = el.closest('.build-popup-form-row');
                    if (row) row.classList.remove('has-error');
                });
            });
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var c = readContact();
                if (c.website) return;     /* Honeypot tripped — silently drop */
                state.contact = { name: c.name, email: c.email, phone: c.phone, company: c.company, notes: c.notes };
                if (!validateContact()) return;
                /* Submission added in Task 8 */
                console.log('[build-popup] would submit', buildPayload());
                alert('Submission wiring up next. Payload logged to console.');
            });
        }
```

- [ ] **Step 7.3: Add buildPayload helper**

After `readContact`, add:

```javascript
    function buildPayload() {
        return {
            route: state.route,
            answers: {
                type:              state.answers.type,
                size:              state.answers.size,
                login:             state.answers.login,
                integrations:     state.answers.integrations,
                integrations_text: state.answers.integrations_text || ''
            },
            estimate: state.estimate || null,
            contact: {
                name:    state.contact.name,
                email:   state.contact.email,
                phone:   state.contact.phone,
                company: state.contact.company,
                notes:   state.contact.notes
            },
            meta: {
                page:         window.location.pathname,
                referrer:     document.referrer || '',
                submitted_at: new Date().toISOString(),
                user_agent:   navigator.userAgent
            }
        };
    }
```

- [ ] **Step 7.4: Verify in browser**

Reload preview. Walk through to step 6 via both routes:
- Estimate path: contact step shows "Send My Estimate" button.
- Consultation path: shows "Get a Call" button.
- Submitting empty form shows red borders on Name/Email/Phone with error messages.
- Submitting with invalid email shows error on Email only.
- Submitting valid data logs the full payload to console and shows the alert.
- Filling the honeypot and submitting silently does nothing.
- Back from step 6 returns to step 5 with answers preserved.

- [ ] **Step 7.5: Commit**

```bash
git add design/build-request/js/build-request.js
git commit -m "feat(build-popup): contact step with validation, honeypot, and payload assembly"
```

---

## Task 8: Webhook submission, dedupe, and redirect

**Files:**
- Modify: `design/build-request/js/build-request.js`

- [ ] **Step 8.1: Add submit function**

Replace the `form.addEventListener('submit', ...)` block in `wireStepHandlers` with:

```javascript
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var c = readContact();
                if (c.website) return;
                state.contact = { name: c.name, email: c.email, phone: c.phone, company: c.company, notes: c.notes };
                if (!validateContact()) return;
                submitForm(form);
            });
```

After `buildPayload`, add:

```javascript
    var WEBHOOK_URL = 'https://hooks.digitaloperations.co.za/webhook/doqix-build-request';
    var lastSubmission = { hash: null, at: 0 };

    function payloadHash(p) {
        return [p.route, p.answers.type, p.answers.size, p.answers.login, p.answers.integrations, p.contact.email].join('|');
    }

    function submitForm(form) {
        var payload = buildPayload();
        var h = payloadHash(payload);
        var now = Date.now();
        if (lastSubmission.hash === h && (now - lastSubmission.at) < 30000) {
            /* Dedupe — same payload within 30s */
            redirectToThankYou();
            return;
        }
        lastSubmission = { hash: h, at: now };

        var btn = form.querySelector('[data-action="submit"]');
        var btnText = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(function () { redirectToThankYou(); })
            .catch(function () { redirectToThankYou(); });
    }

    function redirectToThankYou() {
        var params = ['from=build', 'route=' + encodeURIComponent(state.route || 'consultation')];
        if (state.estimate) {
            params.push('type=' + encodeURIComponent(state.answers.type));
            params.push('size=' + encodeURIComponent(state.answers.size));
            params.push('build=' + encodeURIComponent(state.estimate.build_cost));
        }
        var base = thankYouPath();
        window.location.href = base + '?' + params.join('&');
    }

    function thankYouPath() {
        if (window.location.pathname.indexOf('/doqix/') !== -1) return 'thank-you.html';
        var depth = window.location.pathname.split('/').filter(Boolean).length;
        return depth > 1 ? '../thank-you/thank-you.html' : 'thank-you.html';
    }
```

- [ ] **Step 8.2: Verify in browser (network blocking expected)**

Reload preview. Submit a valid form on the estimate path.
Expected:
- Submit button shows "Sending…" and disables.
- Browser navigates to `../thank-you/thank-you.html?from=build&route=estimate&type=app&size=medium&build=38000` (URL bar shows this exact pattern).
- Network tab shows the POST attempt to `hooks.digitaloperations.co.za` (will fail with CORS or 404 since the webhook isn't created yet — that's fine, redirect still happens).
- Submit twice in quick succession with the same data — second submission still redirects but no duplicate POST appears in Network tab (dedupe).

- [ ] **Step 8.3: Commit**

```bash
git add design/build-request/js/build-request.js
git commit -m "feat(build-popup): webhook submission with dedupe and thank-you redirect"
```

---

## Task 9: Triggers — header bindings + URL parameter auto-open

**Files:**
- Modify: `design/components/js/header.js`

- [ ] **Step 9.1: Bind clicks and URL param**

Open `design/components/js/header.js`. After the existing IIFE (after the closing `})();`), append a second IIFE that handles the build-popup wiring:

```javascript

/* Do.Qix Build Popup — header CTA bindings + ?build=1 auto-open */
(function () {
    function bind() {
        var ids = ['cta-lets-build', 'cta-lets-build-mobile'];
        ids.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el || el._doqixBuildBound) return;
            el._doqixBuildBound = true;
            el.addEventListener('click', function (e) {
                if (!window.DoqixBuildPopup) return;
                e.preventDefault();
                window.DoqixBuildPopup.open({ trigger: 'header_cta' });
            });
        });
    }

    /* The header is injected by the IIFE above; bind after the DOM has it */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    /* In case header.js loaded before DoqixBuildPopup, retry once */
    setTimeout(bind, 100);

    /* ?build=1 deep link */
    function autoOpen() {
        try {
            var p = new URLSearchParams(window.location.search);
            if (p.get('build') === '1' && window.DoqixBuildPopup) {
                window.DoqixBuildPopup.open({ trigger: 'url_param' });
            }
        } catch (err) {}
    }
    window.addEventListener('load', function () { setTimeout(autoOpen, 500); });
})();
```

- [ ] **Step 9.2: Verify on a real page**

Open `design/index/index.html` in the browser. Reload (it currently links to `header.js` so the new code is live).
Expected:
- Page loads normally with no console errors.
- Clicking "Let's Build" in the header still currently jumps to `#pricing` because `build-request.js` isn't loaded on this page yet (that's Task 10). No visual regression.
- Visiting `index.html?build=1` does nothing yet (popup script not loaded).

- [ ] **Step 9.3: Commit**

```bash
git add design/components/js/header.js
git commit -m "feat(build-popup): wire header CTAs and ?build=1 URL parameter"
```

---

## Task 10: Wire build-request.js into all customer-facing pages

**Files:**
- Modify: `design/index/index.html`
- Modify: `design/services/services.html`
- Modify: `design/products/products.html`
- Modify: `design/contact/contact.html`

- [ ] **Step 10.1: Add the script tag to each page**

In every file listed above, locate the existing `<script defer src="../components/js/exit-popup.js?v=0.9.20"></script>` line near the closing `</body>` and add directly above it:

```html
<script defer src="../build-request/js/build-request.js?v=0.10.0"></script>
```

(For `index/index.html` and other pages where the path differs, the relative path is `../build-request/js/build-request.js` because every customer-facing HTML lives one folder deep under `design/`.)

- [ ] **Step 10.2: Verify the integration on index**

Open `design/index/index.html` in the browser. Reload.
Expected:
- Click "Let's Build" in the header → popup opens with welcome screen. No `#pricing` jump.
- Walk through the wizard to submission. Redirect to `../thank-you/thank-you.html?from=build&...` happens (page may show old thank-you copy — that's fixed in Task 11).
- Visit `index.html?build=1` → popup auto-opens after ~500ms.
- Repeat on `services.html`, `products.html`, `contact.html` — all should open the popup from the header CTA.

- [ ] **Step 10.3: Commit**

```bash
git add design/index/index.html design/services/services.html \
        design/products/products.html design/contact/contact.html
git commit -m "feat(build-popup): wire build-request.js into customer-facing pages"
```

---

## Task 11: Thank-you page — journey-specific copy

**Files:**
- Modify: `design/thank-you/thank-you.html`
- Create: `design/thank-you/js/thank-you.js`

- [ ] **Step 11.1: Replace the hardcoded hero copy with data-attribute placeholders**

Open `design/thank-you/thank-you.html`. Locate the existing hero block (the `<section>` containing the success icon, "We Got You.", and "Thanks for reaching out" copy). Replace the heading + lead + the three-step list with:

```html
<span class="label inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4" data-thank-eyebrow>Thank You</span>
<h1 data-thank-heading>
    We Got You. <span class="text-primary">We'll Be In Touch Soon</span>
</h1>

<p class="text-lg text-on-surface-variant max-w-xl mx-auto" data-thank-body>
    Thanks for reaching out. Here's what happens next:
</p>

<div class="max-w-md mx-auto text-left space-y-4" data-thank-steps>
    <!-- Default copy preserved here so the page works without JS -->
    <!-- The existing three step blocks from the original page stay as-is —
         they remain the default content. -->
</div>

<div class="flex flex-col sm:flex-row gap-4 justify-center pt-4" data-thank-cta>
    <a href="contact.html" class="btn btn-primary lg glow inline-block">Send Another Message</a>
    <a href="index.html" class="btn btn-ghost lg inline-block">Back to Home</a>
</div>
```

(Note: the existing three step `<div class="flex items-start gap-4">` blocks remain inside `data-thank-steps`. Do not delete them — they are the default no-JS fallback.)

- [ ] **Step 11.2: Add the script tag**

Just above `</body>`, add:

```html
<script src="js/thank-you.js?v=0.10.0"></script>
```

- [ ] **Step 11.3: Create the param-driven copy switcher**

Create `design/thank-you/js/thank-you.js`:

```javascript
/* Do.Qix Thank-You Page — journey-specific copy switcher.
   Reads ?from and ?route URL params and rewrites the hero block. */

(function () {
    'use strict';

    var CALENDLY_URL = 'https://calendly.com/digitaloperations/15-min';

    var p;
    try { p = new URLSearchParams(window.location.search); } catch (e) { return; }
    var from = p.get('from');
    if (from !== 'build') return;

    var route = p.get('route') || 'consultation';
    var heading = document.querySelector('[data-thank-heading]');
    var body = document.querySelector('[data-thank-body]');
    var steps = document.querySelector('[data-thank-steps]');
    var eyebrow = document.querySelector('[data-thank-eyebrow]');
    if (!heading || !body || !steps) return;

    var bookCta = '<a href="' + CALENDLY_URL + '" target="_blank" rel="noopener" class="btn btn-primary lg glow inline-block" style="margin-top:1.5rem;">Book a 15-min call →</a>';

    if (route === 'estimate') {
        if (eyebrow) eyebrow.textContent = 'Estimate Sent';
        heading.innerHTML = 'Estimate sent. <span class="text-primary">Now we talk.</span>';
        body.innerHTML = 'Your starting price is on its way to your inbox. We\'ll be in touch within 24 hours to walk through it.';
        steps.innerHTML = '<p style="text-align:center;color:var(--on-surface-variant,#bacbbf);">Hot to start? Skip the wait:</p>' + '<div style="text-align:center;">' + bookCta + '</div>';
    } else {
        if (eyebrow) eyebrow.textContent = 'Got It';
        heading.innerHTML = 'Got it. <span class="text-primary">Talk soon.</span>';
        body.innerHTML = 'We\'ll review what you sent and reach out within 24 hours with a few clarifying questions and a starting plan.';
        steps.innerHTML = '<p style="text-align:center;color:var(--on-surface-variant,#bacbbf);">Want to skip the wait?</p>' + '<div style="text-align:center;">' + bookCta + '</div>';
    }
})();
```

- [ ] **Step 11.4: Verify the journey copy**

In the browser, visit `design/thank-you/thank-you.html?from=build&route=estimate&type=app&size=medium&build=38000`.
Expected:
- Heading: "Estimate sent. Now we talk."
- Body: "Your starting price is on its way to your inbox..."
- Replaces the steps with a "Book a 15-min call →" button linking to Calendly.

Visit `thank-you.html?from=build&route=consultation`.
Expected:
- Heading: "Got it. Talk soon."
- Body: "We'll review what you sent..."
- Same calendly CTA.

Visit `thank-you.html` with no params.
Expected: original "We Got You" copy unchanged (default contact-form path).

- [ ] **Step 11.5: Commit**

```bash
git add design/thank-you/thank-you.html design/thank-you/js/thank-you.js
git commit -m "feat(build-popup): journey-specific copy on thank-you page via URL params"
```

---

## Task 12: Accessibility — focus trap, escape key, dirty-close confirmation

**Files:**
- Modify: `design/build-request/js/build-request.js`

- [ ] **Step 12.1: Add focus trap and keyboard handlers**

In `build-request.js`, just above the `window.DoqixBuildPopup =` block, add:

```javascript
    /* ──────────── Focus trap + keyboard ──────────── */
    function focusableEls() {
        return overlay.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    }

    function handleKeydown(e) {
        if (!overlay || !overlay.classList.contains('show')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            attemptClose();
            return;
        }
        if (e.key === 'Tab') {
            var els = focusableEls();
            if (els.length === 0) return;
            var first = els[0];
            var last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function isDirty() {
        return state.currentStep > 0 && (
            state.answers.type || state.answers.size || state.answers.login || state.answers.integrations ||
            state.contact.name || state.contact.email || state.contact.phone
        );
    }

    function attemptClose() {
        if (isDirty() && !window.confirm('Close and discard your answers?')) return;
        closePopup();
    }
```

- [ ] **Step 12.2: Wire keydown listener and route close handlers through attemptClose**

Inside `ensureOverlay`, replace:

```javascript
        overlay.querySelector('.build-popup-close').addEventListener('click', closePopup);
        overlay.querySelector('.build-popup-backdrop').addEventListener('click', closePopup);
```

with:

```javascript
        overlay.querySelector('.build-popup-close').addEventListener('click', attemptClose);
        overlay.querySelector('.build-popup-backdrop').addEventListener('click', attemptClose);
```

In `openPopup`, just before `var first = overlay.querySelector(...)`, add:

```javascript
            document.addEventListener('keydown', handleKeydown);
```

In `closePopup`, just after `overlay.classList.remove('show');`, add:

```javascript
        document.removeEventListener('keydown', handleKeydown);
```

- [ ] **Step 12.3: Verify**

Reload preview.
- Open popup, press Tab repeatedly — focus cycles through close button → option buttons / form fields → Continue, then back to close.
- Press Escape on the welcome screen → popup closes immediately (no confirmation, nothing to discard).
- Advance to Q1, select an option, press Escape → confirm dialog appears. Cancel keeps popup open. OK closes it.
- After close, focus returns to whatever was focused before opening.

- [ ] **Step 12.4: Commit**

```bash
git add design/build-request/js/build-request.js
git commit -m "feat(build-popup): focus trap, escape key, and dirty-close confirmation"
```

---

## Task 13: Cookie banner disclosure update

**Files:**
- Modify: `design/cookie-banner/cookie-banner.html` (or wherever the disclosure copy lives — confirm via grep first)

- [ ] **Step 13.1: Locate the disclosure copy**

Run: search for "cookie" / "tracking" / "analytics" copy in `design/cookie-banner/`.

```bash
ls design/cookie-banner/
```

Open the disclosure HTML and find the section listing what is tracked.

- [ ] **Step 13.2: Add the build-popup analytics line**

Insert a list item (matching the existing copy style) describing what the build-popup analytics track:

```
- Build Request popup interactions: open, step advances, abandonment, estimate shown, submission. We use this only to improve the form's drop-off rate; no personal information is sent until you submit the contact step.
```

Match the existing markup pattern (likely a `<li>` inside a `<ul>`, or a paragraph in a list — copy the surrounding structure exactly).

- [ ] **Step 13.3: Commit**

```bash
git add design/cookie-banner/cookie-banner.html
git commit -m "docs(cookie-banner): disclose build-popup analytics events"
```

---

## Task 14: Analytics events with consent gating

**Files:**
- Modify: `design/build-request/js/build-request.js`

- [ ] **Step 14.1: Detect existing consent mechanism**

Grep the codebase for the consent flag:

```bash
grep -r "consent\|gtag\|dataLayer" design/components/js/cookie-banner.js
```

Note the global the cookie banner exposes (commonly `window.doqixConsentGranted` or `localStorage.getItem('doqix_cookie_consent')`). Use whichever exists.

- [ ] **Step 14.2: Add analytics emit helper + wire events**

Inside the IIFE in `build-request.js`, just above the public surface block, add:

```javascript
    /* ──────────── Analytics (consent-gated) ──────────── */
    function consentGranted() {
        try {
            return localStorage.getItem('doqix_cookie_consent') === 'granted';
        } catch (e) { return false; }
    }
    function emit(name, props) {
        if (!consentGranted()) return;
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, props || {});
        } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
            window.dataLayer.push({ event: name, ...(props || {}) });
        }
    }
```

> Note: If your project uses a different consent storage key (discovered in Step 14.1), replace `'doqix_cookie_consent'` and the comparison value accordingly.

In `openPopup`, after the `loadConfig().then(...)` opens, inside the `.then` callback right before `renderStep()`, add:

```javascript
            emit('build_popup_opened', { trigger: state.trigger });
```

In `wireStepHandlers`, after the `nextBtn` click handler, replace the existing one with:

```javascript
        var nextBtn = bodyEl.querySelector('[data-action="next"]');
        if (nextBtn) nextBtn.addEventListener('click', function () {
            var fromStep = state.currentStep;
            state.currentStep++;
            emit('build_popup_step_advanced', { from_step: fromStep, to_step: state.currentStep });
            if (state.currentStep === 5) {
                state.route = routeFor(state.answers);
                emit('build_popup_estimate_shown', { route: state.route, build_cost: state.estimate ? state.estimate.build_cost : 0 });
            }
            renderStep();
        });
```

In `attemptClose`, inside the `if (isDirty() ...)` branch (after the `confirm`, before `closePopup()`), add:

```javascript
        emit('build_popup_abandoned', { last_step: state.currentStep });
```

In `submitForm`, just before the `fetch(...)`, add:

```javascript
        emit('build_popup_submitted', { route: state.route, build_cost: state.estimate ? state.estimate.build_cost : 0 });
```

- [ ] **Step 14.3: Verify**

In the browser DevTools console, with consent NOT granted (clear the storage key), walk through the wizard. No analytics events should fire (check Network and console).

Set `localStorage.setItem('doqix_cookie_consent', 'granted')` (or whatever key the banner uses), reload, and walk through. Each event should fire — visible in the Network tab (gtag pings) or `dataLayer` array (`window.dataLayer` in console).

- [ ] **Step 14.4: Commit**

```bash
git add design/build-request/js/build-request.js
git commit -m "feat(build-popup): consent-gated analytics events"
```

---

## Task 15: Sync to site/, version bump, cache-bust

**Files:**
- Modify: `design/global.css`, every HTML file with `?v=` strings
- Mirror everything to `site/`

- [ ] **Step 15.1: Bump cache-bust versions**

Per CLAUDE.md, every cache-busting query string in HTML files needs to bump from `0.9.20` to `0.10.0`. Run:

```bash
grep -rln "v=0.9.20" design/ site/
```

For each file in the output, replace all occurrences of `?v=0.9.20` with `?v=0.10.0`. (The build-request files were created with `0.10.0` already — they're fine.)

- [ ] **Step 15.2: Update CLAUDE.md current version line**

In `CLAUDE.md`, change:

```
- Current version: **web-v0.9.20** (a11y: footer text contrast bumped to WCAG AA)
```

to:

```
- Current version: **web-v0.10.0** (feat: Let's Build popup — guided wizard, estimate calculator, launch offer)
```

- [ ] **Step 15.3: Rebuild Tailwind**

Run: `npm run build`
Expected: `design/tailwind.css` and `site/tailwind.css` updated.

- [ ] **Step 15.4: Sync design/ → site/**

Per CLAUDE.md sync rules:

```bash
# Copy CSS
cp design/global.css site/global.css

# Copy build-request JS + config
mkdir -p site/build-request/js
cp design/build-request/js/build-request.js site/build-request/js/build-request.js
cp design/build-request-config.json site/build-request-config.json

# Copy thank-you JS
mkdir -p site/thank-you/js
cp design/thank-you/js/thank-you.js site/thank-you/js/thank-you.js

# Copy modified header.js
cp design/components/js/header.js site/js/header.js

# Copy each modified HTML file, fixing CSS paths from ../global.css to global.css and ../tailwind.css to tailwind.css
# (Do this manually for each: index.html, services.html, products.html, contact.html, thank-you/thank-you.html)
```

Then for each modified HTML file in `design/`, copy to `site/` with the path fix:

```bash
sed -e 's|\.\./global\.css|global.css|g' \
    -e 's|\.\./tailwind\.css|tailwind.css|g' \
    -e 's|\.\./components/js/|js/|g' \
    -e 's|\.\./build-request/js/build-request\.js|js/build-request.js|g' \
    -e 's|\.\./fonts/|fonts/|g' \
    design/index/index.html > site/index.html
```

Repeat the same `sed` invocation for each of `services.html`, `products.html`, `contact.html`, `thank-you/thank-you.html`.

For the JS files referenced from the site root, copy `design/build-request/js/build-request.js` to `site/js/build-request.js`:

```bash
cp design/build-request/js/build-request.js site/js/build-request.js
```

(The site/ paths flatten one level, so the JS lives directly under `site/js/`.)

- [ ] **Step 15.5: Verify the synced site works**

Open `site/index.html` in a browser. Reload.
Expected:
- All assets load (no 404 in DevTools Network tab).
- Header "Let's Build" opens the popup.
- Walk through to submission, redirect to `thank-you.html?from=build&route=...`.
- Thank-you page shows the journey-specific copy.

- [ ] **Step 15.6: Run the calculator test harness one more time**

Open `design/build-request/build-request-tests.html` in a browser.
Expected: 29 of 29 assertions pass.

- [ ] **Step 15.7: Commit and tag**

```bash
git add .
git commit -m "chore(build-popup): bump cache-bust to 0.10.0 and sync to site/"
git tag -a web-v0.10.0 -m "feat(website): Let's Build popup — guided wizard, estimate calculator, launch offer"
```

(Do not push yet — the user reviews first.)

---

## Self-Review Notes

After writing this plan, the following pass-throughs were done:

1. **Spec coverage:** every section of `2026-04-28-build-request-popup-design.md` maps to one or more tasks above. Calculator (§4) → Task 1. Config (§5) → Task 1. Screens (§6) → Tasks 4–7. Submission (§7) → Task 8. Thank-you (§8) → Task 11. Visual design (§9) → Task 2. Triggers + analytics (§10) → Tasks 9, 14. Accessibility (§11) → Task 12. File layout (§12) → all tasks.

2. **Placeholder scan:** no TBD / TODO / "implement appropriate error handling". Every code step shows the actual code. Every command step shows the exact command.

3. **Type consistency:** payload field names match the spec (`build_cost`, `handover_price`, `managed_setup`, `managed_monthly`, `min_months`, `launch_offer_applied`, `handover_price_after_discount`, `managed_setup_after_discount`). Function names referenced across tasks match (`renderEstimate`, `renderConsultation`, `renderQuestion`, `attemptClose`, `submitForm`, `buildPayload`, `redirectToThankYou`).

4. **Manual gotchas to watch for:**
   - `design/cookie-banner/cookie-banner.html` markup wasn't read in this plan — the implementer must inspect the file in Task 13.1 and match the existing list style.
   - The consent storage key in Task 14.1 was assumed (`doqix_cookie_consent`); the implementer must grep first and adjust if different.
   - The `index.html`, `services.html`, etc. file paths assume the existing one-level-deep structure (`design/<page>/<page>.html`); verified true at the time of writing via the directory listing in the spec session.
