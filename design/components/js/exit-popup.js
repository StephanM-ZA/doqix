/* Do.Qix Exit-Intent Popup — fires once per session */

(function () {
    var STORAGE_KEY = 'doqix_exit_shown';
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    /* Suppress when the user has already engaged with the build-request popup
       in this session — they've seen our primary CTA, no need to nag with a
       second one. Also suppress when arriving via the ?idea=1 deep link. */
    if (sessionStorage.getItem('doqix_build_opened')) return;
    try {
        if (new URLSearchParams(window.location.search).get('idea') === '1') return;
    } catch (e) { /* old browser, fall through */ }

    /* Tightened triggers — see CLAUDE.md exit-popup notes
       1. Engagement gate: must scroll OR click before exit-popup is allowed
       2. Min time on page: 15s (was 5s)
       3. Desktop re-entry cancellation: 300ms grace window
       4. Mobile trigger disabled entirely
       5. Form-field focus suppresses fire */
    var MIN_TIME = 15000;
    var REENTRY_GRACE_MS = 300;
    var loaded = Date.now();
    var triggered = false;
    var engaged = false;
    var pendingTimer = null;

    function isMobile() {
        return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    }
    function isFormFocused() {
        var a = document.activeElement;
        if (!a) return false;
        var tag = (a.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || a.isContentEditable === true;
    }
    function markEngaged() { engaged = true; }
    window.addEventListener('scroll', markEngaged, { passive: true, once: true });
    document.addEventListener('click', markEngaged, { once: true });

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

    /* Show logic. All gates checked here so triggers stay simple. */
    function show() {
        if (triggered) return;
        if (Date.now() - loaded < MIN_TIME) return;
        if (!engaged) return;
        if (isFormFocused()) return;
        triggered = true;
        overlay.style.display = '';
        /* Force reflow before adding class for transition */
        void overlay.offsetHeight;
        overlay.classList.add('show');
        sessionStorage.setItem(STORAGE_KEY, '1');
    }

    /* Desktop: mouse leaves viewport from top — with re-entry cancellation.
       Skipped on mobile / touch devices (pointer: coarse). */
    if (!isMobile()) {
        document.addEventListener('mouseout', function (e) {
            if (e.clientY > 0) return;
            if (pendingTimer) return;     /* already waiting */
            pendingTimer = setTimeout(function () {
                pendingTimer = null;
                show();
            }, REENTRY_GRACE_MS);
        });
        document.addEventListener('mouseover', function () {
            if (pendingTimer) {
                clearTimeout(pendingTimer);
                pendingTimer = null;
            }
        });
    }

    /* Escape key */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('show')) close();
    });
})();
