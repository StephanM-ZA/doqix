/* Do.Qix Product Cards + Why Products + Cross-Sell — single source of truth */
/* IP-protected: product names, descriptions, features, badges */

(function(){
  'use strict';

  var el = document.getElementById('products-section');
  if (!el) return;

  /* ── Reusable SVGs ───────────────────────────── */
  var chk = '<svg style="width:1.125rem;height:1.125rem" class="hi text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>';

  function li(text) {
    return '<li class="flex items-start gap-2">' + chk + '<span class="text-sm text-on-surface-variant">' + text + '</span></li>';
  }

  /* ── Product data ────────────────────────────── */
  var products = [
    {
      id: 'nomadiq',
      name: 'NomadIQ',
      tagline: 'Field operations, managed from anywhere',
      badge: 'live',
      img: 'nomadiq.png',
      imgAlt: 'NomadIQ - Digital Nomad Visa Automation',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>',
      desc: 'GPS-verified check-ins, site management, and team tracking for service companies with staff in the field. Offline-first mobile app syncs when connectivity returns. Manage clients, projects, vehicles, and materials across multiple locations from one dashboard.',
      features: [
        'Offline-first PWA for field staff',
        'GPS-verified check-in/check-out with photo capture',
        'Customisable dashboard with drag-and-drop widgets',
        'Multi-tenant with per-company branding',
        'Role-based access (admin, manager, staff, accountant)'
      ]
    },
    {
      id: 'vendiq',
      name: 'VendIQ',
      tagline: 'Retail intelligence that moves as fast as your stock',
      badge: 'live',
      img: 'vendiq.png',
      imgAlt: 'VendIQ - Retail Intelligence',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>',
      desc: 'Real-time sales, inventory, and pricing analytics for FMCG retailers and vending operators. Rate-of-sale tracking, gap analysis, exit stock intelligence, and AI-driven recommendations across stores and categories.',
      features: [
        'Rate of Sale analytics with ABC classification',
        'Distribution gap analysis across locations',
        'Exit stock intelligence with redistribution detection',
        'AI-generated executive summaries',
        'Interactive report builder (custom reports can be built)'
      ]
    },
    {
      id: 'voltiq',
      name: 'VoltIQ',
      tagline: 'Every solar system on one screen',
      badge: 'live',
      img: 'voltiq.png',
      imgAlt: 'VoltIQ - Energy and Load Management',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>',
      desc: 'Unified monitoring for solar installers managing fleets across multiple inverter brands. Automated issue detection, upsell opportunities, and co-branded WhatsApp morning reports delivered to your phone.',
      features: [
        'Multi-brand inverter support (Deye, Sunsynk, more coming)',
        'Automated issue detection and alerts',
        'Upsell opportunity identification',
        'Co-branded WhatsApp morning reports',
        'White-label installer dashboard'
      ]
    },
    {
      id: 'learniq',
      name: 'LearnIQ',
      tagline: 'Teaching South Africa to use AI properly',
      badge: 'in-progress',
      img: 'learniq.png',
      imgAlt: 'LearnIQ - Learning Management System',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>',
      desc: 'Age-appropriate AI literacy curriculum for students (Grade 1 to tertiary), parents, and teachers. Bilingual (English + Afrikaans), aligned to UNESCO AI Competency Framework, built for SA classrooms.',
      features: [
        'Four student bands from Grade 1 to tertiary',
        'Five competency areas (Understanding, Using, Creating, Ethics, Evaluating)',
        'Bilingual content (English + Afrikaans)',
        'Modules for parents and teachers',
        'Mobile-first, offline-capable platform'
      ]
    }
  ];

  /* ── Image base path ─────────────────────────── */
  var imgBase = '../images/';

  /* ── Build product card HTML ─────────────────── */
  function card(p) {
    var featuresHTML = '';
    for (var i = 0; i < p.features.length; i++) {
      featuresHTML += li(p.features[i]);
    }
    var badgeLabel = p.badge === 'live' ? 'Live' : 'In Progress';
    return '<div class="card p-0 flex flex-col h-full relative" id="' + p.id + '">' +
      '<div class="product-badge ' + p.badge + '">' + badgeLabel + '</div>' +
      '<div class="h-48 relative overflow-hidden">' +
      '<img src="' + imgBase + p.img + '" alt="' + p.imgAlt + '" class="w-full h-full object-cover"/>' +
      '<div class="absolute inset-0 bg-surface-dim/60"></div>' +
      '</div>' +
      '<div class="p-8 flex flex-col flex-grow">' +
      '<div class="flex justify-between items-start mb-6">' +
      '<div>' +
      '<h3 class="text-2xl font-black mb-1">' + p.name + '</h3>' +
      '<p class="text-primary text-sm font-medium">' + p.tagline + '</p>' +
      '</div>' +
      '<svg style="width:1.875rem;height:1.875rem" class="hi text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' + p.icon + '</svg>' +
      '</div>' +
      '<p class="text-on-surface-variant text-sm mb-6 leading-relaxed">' + p.desc + '</p>' +
      '<ul class="space-y-3 mb-8">' + featuresHTML + '</ul>' +
      '<div class="mt-auto">' +
      '<a href="contact.html?product=' + p.id + '" class="btn btn-primary full">Learn More</a>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  var cardsHTML = '';
  for (var i = 0; i < products.length; i++) {
    cardsHTML += card(products[i]);
  }

  /* ── Why Our Products data ───────────────────── */
  var whyItems = [
    {
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"/>',
      title: 'SA-hosted',
      text: 'Your data stays local. South African infrastructure, South African laws.'
    },
    {
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>',
      title: 'Priced in Rands',
      text: 'No dollar surprises. Fixed ZAR pricing that fits your budget.'
    },
    {
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>',
      title: 'No Lock-in',
      text: 'Cancel anytime, export your data. We keep you because we deliver.'
    },
    {
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/>',
      title: 'Built by Practitioners',
      text: 'We know what works because we build automation for a living, every day.'
    }
  ];

  function whyCard(w) {
    return '<div class="card p-6 text-center">' +
      '<svg style="width:1.875rem;height:1.875rem" class="hi text-primary mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' + w.icon + '</svg>' +
      '<h3 class="text-base font-bold mb-2">' + w.title + '</h3>' +
      '<p class="text-on-surface-variant text-sm">' + w.text + '</p>' +
      '</div>';
  }

  var whyHTML = '';
  for (var i = 0; i < whyItems.length; i++) {
    whyHTML += whyCard(whyItems[i]);
  }

  /* ── Inject all sections ─────────────────────── */
  el.innerHTML =
    /* Product Grid */
    '<div class="max-w-7xl mx-auto">' +
    '<div class="text-center mb-16">' +
    '<span class="label">The Catalogue</span>' +
    '<h2 class="mt-6 mb-4">Built for <span class="text-primary">South African Business</span></h2>' +
    '</div>' +
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-8">' + cardsHTML + '</div>' +
    '</div>' +

    /* Why Our Products */
    '</section>' +
    '<section id="why-products" class="py-24 px-8 bg-surface-container-low overflow-hidden">' +
    '<div class="max-w-7xl mx-auto">' +
    '<div class="text-center mb-16">' +
    '<span class="label">Why Do.Qix Products</span>' +
    '<h2 class="mt-6 mb-4">Built From Real <span class="text-primary">Automation Experience</span></h2>' +
    '<p class="max-w-2xl mx-auto">We don\'t build tools in a vacuum. Every product comes from patterns we\'ve seen across hundreds of workflows for South African businesses.</p>' +
    '</div>' +
    '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">' + whyHTML + '</div>' +
    '</div>' +

    /* Services Cross-Sell */
    '</section>' +
    '<section id="custom" class="py-24 px-8 overflow-hidden">' +
    '<div class="max-w-4xl mx-auto">' +
    '<div class="card p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">' +
    '<div class="max-w-xl text-center md:text-left">' +
    '<span class="label">Custom Solutions</span>' +
    '<h2 class="mt-4 mb-4">Need Something <span class="text-primary">Custom?</span></h2>' +
    '<p class="text-on-surface-variant">Our products handle common patterns. But every business is different. If you need workflows built specifically for your processes, our done-for-you automation service handles the rest, from mapping to building to monitoring.</p>' +
    '</div>' +
    '<a href="services.html" class="btn btn-primary lg flex-shrink-0">See Our Services</a>' +
    '</div>' +
    '</div>';

  /* ── Register with scroll-reveal ─────────────── */
  if (window.doqixReveal) window.doqixReveal(el);

})();
