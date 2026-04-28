/* Do.Qix Global Header — single source of truth, injected via JS */

(function () {
    var base = '';
    if (window.location.pathname.indexOf('/doqix/') !== -1) {
        base = '';
    } else {
        var depth = window.location.pathname.split('/').filter(Boolean).length;
        if (depth > 1) base = '../';
    }

    var el = document.getElementById('site-header');
    if (!el) return;

    el.innerHTML =
        '<header class="site-header">' +
        '<nav class="nav-container">' +
        '<a href="index.html" class="nav-logo">' +
        '<img src="' + base + 'logo_new_green.png" alt="Do.Qix" width="568" height="168" class="logo-img"/>' +
        '</a>' +
        '<div class="nav-links">' +
        '<a class="nav-link" href="index.html">Home</a>' +
        '<a class="nav-link" href="services.html">Services</a>' +
        '<a class="nav-link" href="products.html">Products</a>' +
        '<a class="nav-link" href="contact.html">Contact</a>' +
        '</div>' +
        '<a href="index.html#pricing" class="btn btn-primary sm glow nav-cta" id="cta-lets-build">Let\'s Build</a>' +
        '<button class="nav-hamburger" aria-label="Menu">' +
        '<span></span><span></span><span></span>' +
        '</button>' +
        '</nav>' +
        '<div class="mobile-menu">' +
        '<a class="mobile-link" href="index.html">Home</a>' +
        '<a class="mobile-link" href="services.html">Services</a>' +
        '<a class="mobile-link" href="products.html">Products</a>' +
        '<a class="mobile-link" href="contact.html">Contact</a>' +
        '<a href="index.html#pricing" class="btn btn-primary md glow" id="cta-lets-build-mobile" style="width:100%;margin-top:1rem;">Let\'s Build</a>' +
        '</div>' +
        '</header>';

    /* Mark active page */
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';
    if (page === '' || page === 'doqix') page = 'index';
    el.querySelectorAll('.nav-link, .mobile-link').forEach(function (link) {
        var href = link.getAttribute('href').replace('.html', '');
        if (href === page || (href === 'index' && page === 'index')) {
            link.classList.add('active');
        }
    });
})();
