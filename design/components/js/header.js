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

    /* Single source of truth for the Products submenu.
       Update this array if a product is added/renamed/removed. */
    var PRODUCTS = [
        { slug: 'nomadiq',  name: 'NomadIQ',  tagline: 'Field operations, managed from anywhere' },
        { slug: 'vendiq',   name: 'VendIQ',   tagline: 'Retail intelligence' },
        { slug: 'voltiq',   name: 'VoltIQ',   tagline: 'Solar fleet monitoring' },
        { slug: 'socialiq', name: 'SocialIQ', tagline: 'Your social media writer' },
        { slug: 'learniq',  name: 'LearnIQ',  tagline: 'AI literacy for SA classrooms' }
    ];

    function buildSubmenuItems(linkClass) {
        return PRODUCTS.map(function (p) {
            return '<a class="' + linkClass + '" href="products.html#' + p.slug + '" data-product="' + p.slug + '">' +
                       '<span class="nav-submenu-name">' + p.name + '</span>' +
                       '<span class="nav-submenu-tagline">' + p.tagline + '</span>' +
                   '</a>';
        }).join('');
    }

    el.innerHTML =
        '<header class="site-header">' +
        '<nav class="nav-container">' +
        '<a href="index.html" class="nav-logo">' +
        '<img src="' + base + 'logo_new_green.png" alt="Do.Qix" width="568" height="168" class="logo-img"/>' +
        '</a>' +
        '<div class="nav-links">' +
        '<a class="nav-link" href="index.html">Home</a>' +
        '<a class="nav-link" href="services.html">Services</a>' +
        '<div class="nav-link-wrapper has-submenu">' +
            '<a class="nav-link nav-link-parent" href="products.html" aria-haspopup="true" aria-expanded="false">' +
                'Products' +
                '<span class="nav-link-caret" aria-hidden="true"></span>' +
            '</a>' +
            '<div class="nav-submenu" role="menu">' +
                buildSubmenuItems('nav-submenu-link') +
            '</div>' +
        '</div>' +
        '<a class="nav-link" href="contact.html">Contact</a>' +
        '</div>' +
        '<a href="?idea=1" class="btn btn-primary sm glow nav-cta" id="cta-lets-build">Got An Idea</a>' +
        '<button class="nav-hamburger" aria-label="Menu">' +
        '<span></span><span></span><span></span>' +
        '</button>' +
        '</nav>' +
        '<div class="mobile-menu">' +
        '<a class="mobile-link" href="index.html">Home</a>' +
        '<a class="mobile-link" href="services.html">Services</a>' +
        '<div class="mobile-link-wrapper has-submenu">' +
            '<a class="mobile-link mobile-link-parent" href="products.html">Products</a>' +
            '<button class="mobile-submenu-toggle" aria-expanded="false" aria-label="Expand Products"><span class="nav-link-caret" aria-hidden="true"></span></button>' +
            '<div class="mobile-submenu">' +
                buildSubmenuItems('mobile-submenu-link') +
            '</div>' +
        '</div>' +
        '<a class="mobile-link" href="contact.html">Contact</a>' +
        '<a href="?idea=1" class="btn btn-primary md glow" id="cta-lets-build-mobile" style="width:100%;margin-top:1rem;">Got An Idea</a>' +
        '</div>' +
        '</header>';

    /* Mark active page */
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';
    if (page === '' || page === 'doqix') page = 'index';
    el.querySelectorAll('.nav-link, .mobile-link').forEach(function (link) {
        var href = (link.getAttribute('href') || '').split('#')[0].replace('.html', '');
        if (href === page || (href === 'index' && page === 'index')) {
            link.classList.add('active');
        }
    });

    /* Desktop submenu: open on hover or focus-within (handled by CSS).
       Click on the parent still navigates to products.html. */

    /* Mobile submenu: tap caret to expand the product list inline. */
    var mobileToggle = el.querySelector('.mobile-submenu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function (e) {
            e.preventDefault();
            var wrapper = mobileToggle.closest('.has-submenu');
            var isOpen = wrapper.classList.toggle('is-open');
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    /* Close desktop submenu on Escape (keyboard a11y) */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var openSubmenu = el.querySelector('.nav-link-wrapper.is-open');
        if (openSubmenu) openSubmenu.classList.remove('is-open');
    });
})();

/* Do.Qix Build Popup — header CTA bindings + ?build=1 auto-open */
(function () {
    function bind() {
        var ids = ['cta-lets-build', 'cta-lets-build-mobile'];
        ids.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el || el._doqixBuildBound) return;
            el._doqixBuildBound = true;
            el.addEventListener('click', function (e) {
                if (!window.DoqixBuildPopup) return;
                e.preventDefault();
                window.DoqixBuildPopup.open({ trigger: 'header_cta' });
            });
        });
    }

    /* The header is injected synchronously by the IIFE above; bind once the DOM has it. */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    /* Defensive retry in case build-request.js loads after this file. */
    setTimeout(bind, 100);

    /* ?idea=1 deep link auto-open. */
    function autoOpen() {
        try {
            var p = new URLSearchParams(window.location.search);
            if (p.get('idea') === '1' && window.DoqixBuildPopup) {
                window.DoqixBuildPopup.open({ trigger: 'url_param' });
            }
        } catch (err) { /* old browser, swallow */ }
    }
    window.addEventListener('load', function () { setTimeout(autoOpen, 500); });
})();
