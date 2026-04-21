/* Do.Qix FAQ Section — single source of truth, injected via JS */
/* IP-protected: pricing details, service descriptions */

(function(){
  'use strict';

  var el = document.getElementById('faq-section');
  if (!el) return;

  /* ── Chevron SVG ─────────────────────────────── */
  var chevron = '<svg style="width:1.5rem;height:1.5rem" class="hi faq-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>';

  /* ── FAQ data ────────────────────────────────── */
  var faqs = [
    {
      q: 'How long does it take to build an automation?',
      a: 'Simple workflows: a few days. Complex multi-system automations: 2-4 weeks. We\'ll give you a clear timeline before we start.'
    },
    {
      q: 'Do I need any technical knowledge?',
      a: 'None. We handle everything: design, building, testing, and ongoing management.'
    },
    {
      q: 'What apps do you work with?',
      a: 'Over 400 and counting. Google Workspace, Microsoft 365, Xero, QuickBooks, Salesforce, HubSpot, Pipedrive, Slack, WhatsApp, Shopify, WooCommerce, Airtable, Notion, BambooHR, Zendesk, Intercom, Eventbrite, DocuSign, Trello, Asana, Jira, WordPress, Mailchimp, Stripe, Typeform, Twilio, Buffer, and more. If your app has an API, we can connect it.'
    },
    {
      q: 'What about my existing systems?',
      a: 'If it has an API (most modern tools do), we can connect it. We\'ll check compatibility in the initial consultation.'
    },
    {
      q: 'Is my data safe?',
      a: 'Yes. We self-host your automations, so your data stays on infrastructure you control. Fully POPIA compliant.'
    },
    {
      q: 'What does it cost?',
      a: 'Four plans: Solo (R999/mo), Team (R2,500/mo), Business (R5,500/mo), and Enterprise (custom quote). Flat monthly retainer, no per-user fees, no credits, no per-task charges. Solo has zero setup fee. Training included on Business and Enterprise. All in ZAR. Month-to-month on every plan. First month at 50% during launch. See full pricing on the Services page.'
    },
    {
      q: 'Can I cancel?',
      a: 'Anytime. No lock-in contracts. We keep your business because we deliver results.'
    }
  ];

  /* ── Build FAQ item HTML ─────────────────────── */
  function faqItem(f) {
    return '<details class="faq-item">' +
      '<summary><span>' + f.q + '</span>' + chevron + '</summary>' +
      '<div class="faq-answer">' + f.a + '</div>' +
      '</details>';
  }

  var itemsHTML = '';
  for (var i = 0; i < faqs.length; i++) {
    itemsHTML += faqItem(faqs[i]);
  }

  /* ── Inject HTML ─────────────────────────────── */
  el.innerHTML =
    '<div class="text-center mb-16 scroll-reveal">' +
    '<span class="label">Got Questions?</span>' +
    '<h2 class="mt-6 mb-4">Frequently <span class="text-primary">Asked Questions</span></h2>' +
    '<p>Everything you need to know before we get started.</p>' +
    '</div>' +
    '<div class="space-y-4 scroll-reveal">' + itemsHTML + '</div>';

  /* ── Inject JSON-LD structured data ──────────── */
  var jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': []
  };
  for (var j = 0; j < faqs.length; j++) {
    jsonLd.mainEntity.push({
      '@type': 'Question',
      'name': faqs[j].q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faqs[j].a
      }
    });
  }
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);

  /* ── Register with scroll-reveal ──────��──────── */
  if (window.doqixReveal) window.doqixReveal(el);

})();
