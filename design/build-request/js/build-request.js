/* Do.Qix Build Request Popup — calculator + state machine + rendering. */

(function () {
    'use strict';

    var ROUND_STEP = 500;
    var FADE_OUT_MS = 300;       /* must match CSS #build-popup-overlay transition: opacity 0.3s */
    var STEP_FADE_MS = 100;      /* must match half of CSS .build-popup-body transition: 0.15s ease */

    /* ──────────── Hardcoded config fallback (mirrors build-request-config.json) ──────────── */
    var FALLBACK_CONFIG = {
        launch_offer: { enabled: true, spots_remaining: 7, total_spots: 10, discount_pct: 0.20, label: '20% off setup' },
        base: { automation: 3000, dashboard: 8000, app: 15000, unsure: 8000 },
        size_multiplier: { small: 1, medium: 2, big: 4, unsure: 2 },
        login_addon: 5000,
        integ_addon: 3000,
        managed: { setup_pct: 0.20, hosting_base: 1500 },
        min_months_tiers: [
            { max_build: 14999, months: 6  },
            { max_build: 50000, months: 12 },
            { max_build: null,  months: 18 }
        ]
    };

    /* ──────────── Module state ──────────── */
    var state = {
        config: FALLBACK_CONFIG,
        configLoaded: false,
        currentStep: 0,    /* 0=welcome, 1-4=questions, 5=result, 6=contact */
        answers: { type: null, size: null, login: null, integrations: null, integrations_text: '' },
        contact: { name: '', email: '', phone: '', company: '', notes: '' },
        trigger: null,
        previousFocus: null
    };

    var overlay = null;
    var bodyEl = null;
    var closeTimer = null;

    /* ──────────── Rounding helpers ──────────── */
    function roundUp(x, step) { return Math.ceil(x / step) * step; }
    function roundNearest(x, step) { return Math.round(x / step) * step; }

    /* ──────────── Defaults applied when an answer is "unsure" ──────────── */
    var UNSURE_DEFAULTS = { size: 'medium', login: 'no', integrations: 'no' };

    function applyUnsureDefaults(a) {
        return {
            type:         a.type,
            size:         a.size === 'unsure' ? UNSURE_DEFAULTS.size : a.size,
            login:        a.login === 'unsure' ? UNSURE_DEFAULTS.login : a.login,
            integrations: a.integrations === 'unsure' ? UNSURE_DEFAULTS.integrations : a.integrations
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

    /* ──────────── Min-months tier lookup ──────────── */
    function pickMinMonths(buildCost, cfg) {
        var tiers = cfg.min_months_tiers;
        for (var i = 0; i < tiers.length; i++) {
            var t = tiers[i];
            if (t.max_build === null || buildCost <= t.max_build) return t.months;
        }
        return 12;  /* defensive fallback if config is empty/malformed */
    }

    /* ──────────── Calculator ──────────── */
    function calculate(answers, cfg) {
        var a = applyUnsureDefaults(answers);
        /* Defensive fallback for direct callers: production always routes
           type==='unsure' to consultation, but tests may invoke calculate() directly. */
        var basePrice = cfg.base[a.type] != null ? cfg.base[a.type] : cfg.base.unsure;
        var sizeMult = cfg.size_multiplier[a.size];
        var loginAdd = a.login === 'yes' ? cfg.login_addon : 0;
        var integAdd = a.integrations === 'yes' ? cfg.integ_addon : 0;

        var buildCost = roundUp((basePrice * sizeMult) + loginAdd + integAdd, ROUND_STEP);
        var minMonths = pickMinMonths(buildCost, cfg);
        var managedSetup = roundNearest(buildCost * cfg.managed.setup_pct, ROUND_STEP);
        var amortized = roundNearest((buildCost - managedSetup) / minMonths, ROUND_STEP);
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
        return roundNearest(price * (1 - pct), ROUND_STEP);
    }

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
        /* Same base detection pattern used in header.js. */
        if (window.location.pathname.indexOf('/doqix/') !== -1) return 'build-request-config.json';
        var depth = window.location.pathname.split('/').filter(Boolean).length;
        return depth > 1 ? '../build-request-config.json' : 'build-request-config.json';
    }
    function mergeConfig(base, override) {
        var out = {};
        for (var k in base) out[k] = base[k];
        for (var k2 in override) {
            out[k2] = (typeof base[k2] === 'object' && typeof override[k2] === 'object' && !Array.isArray(override[k2]))
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
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
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
            void overlay.offsetHeight;  /* force reflow before transition */
            overlay.classList.add('show');
            var first = overlay.querySelector('button, [tabindex]:not([tabindex="-1"])');
            if (first) first.focus();
        });
    }

    function closePopup() {
        if (!overlay || !overlay.classList.contains('show')) return;
        overlay.classList.remove('show');
        document.body.classList.remove('build-popup-open');
        closeTimer = setTimeout(function () { overlay.style.display = 'none'; closeTimer = null; }, FADE_OUT_MS);
        if (state.previousFocus && state.previousFocus.focus) state.previousFocus.focus();
    }

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
            helper: 'Rough is fine. Pick the closest match. We\'ll firm it up on the call.',
            options: [
                { value: 'small',  title: '🌱 Small',     desc: 'A calculator, or a form that emails you when filled in.' },
                { value: 'medium', title: '🏗️ Medium',   desc: 'A booking system with admin, or an app with a few screens.' },
                { value: 'big',    title: '🏢 Big',       desc: 'A platform with users, payments, dashboards, lots of features.' },
                { value: 'unsure', title: '🤔 Not sure',  desc: 'That\'s fine. We\'ll figure it out together on a call.' }
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

    /* ──────────── Rendering ──────────── */
    function renderStep() {
        bodyEl.classList.add('fading');
        setTimeout(function () {
            bodyEl.innerHTML = htmlForStep();
            wireStepHandlers();
            bodyEl.classList.remove('fading');
        }, STEP_FADE_MS);
    }

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

    function formatRand(n) {
        return 'R' + n.toLocaleString('en-ZA', { maximumFractionDigits: 0 });
    }

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
                    + '<div class="meta">Once-off, yours forever</div>'
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

    function escapeAttr(s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function escapeText(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    function renderContact() {
        var submitLabel = state.route === 'estimate' ? 'Send My Estimate' : 'Get a Call';
        var c = state.contact;
        var helperText = state.route === 'estimate'
            ? 'We\'ll email you a copy of your estimate and follow up within 24 hours.'
            : 'A real person will reach out within 24 hours.';
        return ''
            + '<p class="build-popup-step-counter">Last step</p>'
            + '<h2 class="build-popup-title" id="build-popup-title">Where do we send it?</h2>'
            + '<p class="build-popup-helper">' + helperText + '</p>'
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

    function validateContact() {
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

    function buildPayload() {
        return {
            route: state.route,
            answers: {
                type:               state.answers.type,
                size:               state.answers.size,
                login:              state.answers.login,
                integrations:       state.answers.integrations,
                integrations_text:  state.answers.integrations_text || ''
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

    /* ──────────── Submission ──────────── */
    var WEBHOOK_URL = 'https://hooks.digitaloperations.co.za/webhook/doqix-build-request';
    var DEDUPE_WINDOW_MS = 30000;
    var lastSubmission = { hash: null, at: 0 };

    function payloadHash(p) {
        return [p.route, p.answers.type, p.answers.size, p.answers.login, p.answers.integrations, p.contact.email].join('|');
    }

    function submitForm(form) {
        var payload = buildPayload();
        var h = payloadHash(payload);
        var now = Date.now();
        if (lastSubmission.hash === h && (now - lastSubmission.at) < DEDUPE_WINDOW_MS) {
            /* Same payload submitted within the dedupe window. Go straight to thank-you. */
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
                if (c.website) return;     /* Honeypot tripped: silently drop */
                state.contact = { name: c.name, email: c.email, phone: c.phone, company: c.company, notes: c.notes };
                if (!validateContact()) return;
                submitForm(form);
            });
        }
    }

    /* ──────────── Public surface ──────────── */
    window.DoqixBuildPopup = {
        open: openPopup,
        close: closePopup,
        _test: { roundUp: roundUp, roundNearest: roundNearest, routeFor: routeFor, calculate: calculate, applyDiscount: applyDiscount }
    };
})();
