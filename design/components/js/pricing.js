/* Do.Qix Pricing Cards — single source of truth, injected via JS */
/* IP-protected: plans, pricing, and features combined in one component */

(function(){
  'use strict';

  var el = document.getElementById('pricing-section');
  if (!el) return;

  /* ── Check icon SVG (reused per feature line) ── */
  var chk = '<svg style="width:1.125rem;height:1.125rem" class="hi text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>';

  /* ── Rocket icon for banner ────────────────────── */
  var rocket = '<svg style="width:1.25rem;height:1.25rem" class="hi align-middle animated-rocket" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>' +
    '</svg>';

  /* ── Feature line helper ───────────────────────── */
  function li(text) {
    return '<li class="flex items-center gap-2">' + chk + ' ' + text + '</li>';
  }

  /* ── Plan card helper ──────────────────────────── */
  function card(tier, price, features, cta, ctaClass, popular) {
    return '<div class="card pricing-card' + (popular ? ' pricing-popular' : '') + ' p-8 space-y-8 relative" data-tier="' + tier + '">' +
      '<div class="pricing-badge">Recommended</div>' +
      '<div class="space-y-2">' +
      '<h3>' + tier + '</h3>' +
      '<div class="text-4xl font-black text-on-surface">' + price + '</div>' +
      '</div>' +
      '<ul class="space-y-4 text-sm text-on-surface-variant">' + features + '</ul>' +
      '<a href="contact.html?plan=' + tier.toLowerCase() + '" class="btn ' + ctaClass + ' full">' + cta + '</a>' +
      '</div>';
  }

  /* ── Inject HTML ────────────────────────────────── */
  el.innerHTML =
    '<div class="max-w-7xl mx-auto space-y-20">' +
    '<div class="text-center space-y-4">' +
    '<span class="label">Simple &amp; Local</span>' +
    '<h2>Pricing That Makes <span class="text-primary">Sense</span></h2>' +
    '<p class="max-w-3xl mx-auto">No hidden fees. No confusing credit systems. No per-task charges that punish you for growing. Everything in South African rands. Month-to-month. We keep clients because we deliver, not because of contracts.</p>' +
    '</div>' +

    '<div class="banner orange" id="pricing-banner">' +
    rocket + ' <span id="pricing-banner-text">Launch offer: First month at 50% on any plan.</span>' +
    '</div>' +

    '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">' +

    /* Solo */
    card('Solo',
      'R999<span class="text-sm font-medium text-on-surface-variant">/mo</span>',
      li('1 Workflow') +
      li('Free Setup') +
      li('Email Support (48hr)') +
      li('Best for: Solopreneurs &amp; freelancers'),
      'Select Plan', 'btn-ghost', false) +

    /* Team */
    card('Team',
      'R2,500<span class="text-sm font-medium text-on-surface-variant">/mo</span>',
      li('Up to 3 Workflows') +
      li('R1,500 Setup') +
      li('Priority + WhatsApp (24hr)') +
      li('Best for: Small teams (2-15)'),
      'Select Plan', 'btn-primary', true) +

    /* Business */
    card('Business',
      'R5,500<span class="text-sm font-medium text-on-surface-variant">/mo</span>',
      li('Up to 6 Workflows') +
      li('R2,500 Setup') +
      li('Dedicated + Monthly Strategy Call') +
      li('Best for: Growing SMEs (15-50)'),
      'Select Plan', 'btn-ghost', false) +

    /* Enterprise */
    card('Enterprise',
      'Custom',
      li('Unlimited Workflows (scoped)') +
      li('Setup: Let\'s talk') +
      li('Dedicated Account Manager') +
      li('Best for: Larger operations (50+)'),
      'Show Me What\'s Possible', 'btn-ghost', false) +

    '</div>' +
    '<p class="caption">Every plan includes: Hosting, monitoring, maintenance, POPIA compliance, and no lock-in. You own what we build.</p>' +
    '<div class="text-center mt-6"><a href="contact.html" class="btn btn-primary md">Get Started</a></div>' +
    '</div>';

  /* ── Register with scroll-reveal ─────────────── */
  if (window.doqixReveal) window.doqixReveal(el);

})();
