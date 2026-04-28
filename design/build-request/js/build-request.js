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
