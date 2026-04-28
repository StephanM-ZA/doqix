/* Do.Qix Thank-You Page.
   1) Journey-specific copy switcher: reads ?from and ?route URL params
      and rewrites the hero block when the visitor arrived from the build
      request popup.
   2) 10-second countdown redirect to the homepage. */

(function () {
    'use strict';

    var BOOKING_URL = 'https://calendar.app.google/vuvvB5soQex9QdQL8';

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

    var bookCta = '<a href="' + BOOKING_URL + '" target="_blank" rel="noopener" class="btn btn-primary lg glow inline-block" style="margin-top:1.5rem;">Book a 15-min call \u2192</a>';

    if (route === 'estimate') {
        if (eyebrow) eyebrow.textContent = 'Estimate Sent';
        heading.innerHTML = 'Estimate sent. <span class="text-primary">Now we talk.</span>';
        body.innerHTML = 'Your starting price is on its way to your inbox. We\'ll be in touch within 24 hours to walk through it.';
        steps.innerHTML = '<p style="text-align:center;color:#bacbbf;">Hot to start? Skip the wait:</p>' +
                         '<div style="text-align:center;">' + bookCta + '</div>';
    } else {
        if (eyebrow) eyebrow.textContent = 'Got It';
        heading.innerHTML = 'Got it. <span class="text-primary">Talk soon.</span>';
        body.innerHTML = 'We\'ll review what you sent and reach out within 24 hours with a few clarifying questions and a starting plan.';
        steps.innerHTML = '<p style="text-align:center;color:#bacbbf;">Want to skip the wait?</p>' +
                         '<div style="text-align:center;">' + bookCta + '</div>';
    }
})();

/* 10-second countdown redirect to homepage.
   Suppressed for build-popup visitors so they can act on the Calendly CTA. */
(function () {
    'use strict';

    /* Skip the auto-redirect for build-popup visitors so they can act on the Calendly CTA. */
    try {
        var p = new URLSearchParams(window.location.search);
        if (p.get('from') === 'build') {
            var countdownText = document.getElementById('countdown-text');
            if (countdownText) countdownText.style.display = 'none';
            return;
        }
    } catch (e) { /* old browser, fall through to default countdown */ }

    var el = document.getElementById('countdown');
    if (!el) return;

    var seconds = 10;

    var timer = setInterval(function () {
        seconds--;
        el.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(timer);
            window.location.href = 'index.html';
        }
    }, 1000);
})();
