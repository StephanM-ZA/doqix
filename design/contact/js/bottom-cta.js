/* Do.Qix Bottom CTA — single source of truth, injected via JS */
/* Reads data attributes from placeholder div to customise per page */

(function(){
  'use strict';

  var el = document.getElementById('bottom-cta');
  if (!el) return;

  /* ── Page-specific config via data attributes ── */
  var heading   = el.getAttribute('data-heading')   || 'Ready to Get <span class="text-primary">Your Time Back?</span>';
  var body      = el.getAttribute('data-body')       || '15 minutes. No commitment. No sales pitch. Just a clear picture of where you\'re losing time, and how to get it back.';
  var btnText   = el.getAttribute('data-btn')        || "Let's Talk";
  var btnHref   = el.getAttribute('data-href')       || 'contact.html';
  var btnClass  = el.getAttribute('data-btn-class')  || 'btn btn-primary lg glow inline-block';

  /* ── Shield icon SVG ─────────────────────────── */
  var shield = '<svg style="width:1rem;height:1rem" class="hi text-primary align-middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>';

  /* ── Caption (only on index page) ────────────── */
  var caption = el.getAttribute('data-caption');
  var captionHTML = caption ? '<p class="caption">' + shield + caption + '</p>' : '';

  /* ── Inject HTML ─────────────────────────────── */
  el.innerHTML =
    '<div class="absolute inset-0 bg-primary/5 -z-10"></div>' +
    '<div class="max-w-3xl mx-auto text-center space-y-6">' +
    '<span class="label">Next Step</span>' +
    '<h2>' + heading + '</h2>' +
    '<p class="text-lg max-w-xl mx-auto">' + body + '</p>' +
    '<a href="' + btnHref + '" class="' + btnClass + '">' + btnText + '</a>' +
    captionHTML +
    '</div>';

  /* ── Register with scroll-reveal ─────────────── */
  if (window.doqixReveal) window.doqixReveal(el);

})();
