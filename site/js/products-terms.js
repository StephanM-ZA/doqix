/* Do.Qix product-terms tabs.
   Tabs deep-link via URL hash (#nomadiq | #vendiq | #voltiq | #learniq).
   Default tab when no hash: VoltIQ. */

(function () {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.product-tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.product-panel'));
    if (!tabs.length || !panels.length) return;

    var DEFAULT_PRODUCT = 'voltiq';
    var VALID = tabs.map(function (t) { return t.getAttribute('data-product'); });

    function activate(product, opts) {
        opts = opts || {};
        if (VALID.indexOf(product) === -1) product = DEFAULT_PRODUCT;

        tabs.forEach(function (tab) {
            var match = tab.getAttribute('data-product') === product;
            tab.setAttribute('aria-selected', match ? 'true' : 'false');
            tab.setAttribute('tabindex', match ? '0' : '-1');
        });
        panels.forEach(function (panel) {
            panel.classList.toggle('is-active', panel.id === 'panel-' + product);
        });

        if (opts.updateHash) {
            var newHash = '#' + product;
            if (window.location.hash !== newHash) {
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', newHash);
                } else {
                    window.location.hash = newHash;
                }
            }
        }

        if (opts.focusTab) {
            var targetTab = tabs.find(function (t) { return t.getAttribute('data-product') === product; });
            if (targetTab) targetTab.focus();
        }
    }

    /* Tab clicks */
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            activate(tab.getAttribute('data-product'), { updateHash: true });
        });
    });

    /* Keyboard navigation: Left/Right arrows, Home, End */
    var tablist = document.querySelector('.product-tabs');
    if (tablist) {
        tablist.addEventListener('keydown', function (e) {
            var key = e.key;
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(key) === -1) return;
            e.preventDefault();
            var current = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
            var next = current;
            if (key === 'ArrowRight') next = (current + 1) % tabs.length;
            else if (key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
            else if (key === 'Home') next = 0;
            else if (key === 'End') next = tabs.length - 1;
            activate(tabs[next].getAttribute('data-product'), { updateHash: true, focusTab: true });
        });
    }

    /* Hash changes (e.g., back/forward, external link) */
    window.addEventListener('hashchange', function () {
        var product = (window.location.hash || '').replace('#', '').toLowerCase();
        if (VALID.indexOf(product) !== -1) activate(product, { updateHash: false });
    });

    /* Initial load */
    var initial = (window.location.hash || '').replace('#', '').toLowerCase();
    activate(VALID.indexOf(initial) !== -1 ? initial : DEFAULT_PRODUCT, { updateHash: false });
})();
