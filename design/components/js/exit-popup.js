/* Do.Qix Exit-Intent Popup — fires once per session */

(function () {
    var STORAGE_KEY = 'doqix_exit_shown';
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    /* Minimum time on page before popup can trigger (ms) */
    var MIN_TIME = 5000;
    var loaded = Date.now();
    var triggered = false;

    /* Build overlay HTML */
    var overlay = document.createElement('div');
    overlay.id = 'exit-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Before you go');
    overlay.innerHTML =
        '<div class="exit-popup-backdrop"></div>' +
        '<div class="exit-popup-card">' +
            '<button class="exit-popup-close" aria-label="Close">' +
                '<svg style="width: 1.5rem; height: 1.5rem" class="hi" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>' +
            '</button>' +
            '<div class="exit-popup-icon">' +
                '<svg style="width: 1.75rem; height: 1.75rem" class="hi" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>' +
            '</div>' +
            '<h2 class="exit-popup-heading">' +
                'Your team is losing a <span class="text-primary">full day every week</span> to busywork' +
            '</h2>' +
            '<p class="exit-popup-body">' +
                '<span style="color:#e4e1e9;font-weight:700;">30%</span> of the average work week goes to tasks a machine could handle. ' +
                'We\'ll show you exactly where.' +
            '</p>' +
            '<a href="contact.html" class="btn btn-primary lg glow exit-popup-cta">Get Started</a>' +
            '<button class="exit-popup-dismiss">I\'ll keep doing it manually</button>' +
        '</div>';

    document.body.appendChild(overlay);

    /* Close logic */
    function close() {
        overlay.classList.remove('show');
        sessionStorage.setItem(STORAGE_KEY, '1');
        setTimeout(function () { overlay.style.display = 'none'; }, 300);
    }

    overlay.querySelector('.exit-popup-close').addEventListener('click', close);
    overlay.querySelector('.exit-popup-dismiss').addEventListener('click', close);
    overlay.querySelector('.exit-popup-backdrop').addEventListener('click', close);

    /* Show logic */
    function show() {
        if (triggered) return;
        if (Date.now() - loaded < MIN_TIME) return;
        triggered = true;
        overlay.style.display = '';
        /* Force reflow before adding class for transition */
        void overlay.offsetHeight;
        overlay.classList.add('show');
        sessionStorage.setItem(STORAGE_KEY, '1');
    }

    /* Desktop: mouse leaves viewport from top */
    document.addEventListener('mouseout', function (e) {
        if (e.clientY <= 0) show();
    });

    /* Mobile: rapid scroll up near top of page (skip if back-to-top triggered) */
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
        var current = window.scrollY;
        if (current < 200 && lastScroll - current > 50 && !window._scrollingToTop) {
            show();
        }
        lastScroll = current;
    }, { passive: true });

    /* Escape key */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('show')) close();
    });
})();
