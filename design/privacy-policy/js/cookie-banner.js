/* Do.Qix Cookie Banner — three-tier consent, persists in localStorage */

(function () {
    var STORAGE_KEY = 'doqix_cookie_consent';
    if (localStorage.getItem(STORAGE_KEY)) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie notice');
    banner.innerHTML =
        '<div class="cookie-banner-inner">' +
            '<div class="cookie-banner-content">' +
                '<div class="cookie-banner-text">' +
                    '<span class="material-symbols-outlined cookie-banner-icon">cookie</span>' +
                    '<div>' +
                        '<p class="cookie-banner-heading">We use cookies to improve your experience</p>' +
                        '<p class="cookie-banner-sub">Nothing shady. Here is exactly what we use.</p>' +
                    '</div>' +
                '</div>' +
                '<button class="cookie-banner-toggle" aria-expanded="false">' +
                    'View details <span class="material-symbols-outlined cookie-banner-chevron">expand_more</span>' +
                '</button>' +
                '<div class="cookie-banner-details">' +
                    '<table>' +
                        '<thead><tr><th>Service</th><th>Type</th><th>Purpose</th><th>Category</th></tr></thead>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td>Exit-intent popup</td>' +
                                '<td>sessionStorage</td>' +
                                '<td>Shows popup once per session. Cleared when you close the tab.</td>' +
                                '<td><span class="cookie-cat essential">Essential</span></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>Cookie consent</td>' +
                                '<td>localStorage</td>' +
                                '<td>Remembers your cookie choice so we don\'t ask again.</td>' +
                                '<td><span class="cookie-cat essential">Essential</span></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>Google Fonts</td>' +
                                '<td>External CDN</td>' +
                                '<td>Loads our typeface (Inter). May expose your IP to Google.</td>' +
                                '<td><span class="cookie-cat functional">Functional</span></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>Tailwind CDN</td>' +
                                '<td>External CDN</td>' +
                                '<td>Loads our CSS framework. May expose your IP to CDN servers.</td>' +
                                '<td><span class="cookie-cat functional">Functional</span></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>GitHub Pages</td>' +
                                '<td>Hosting</td>' +
                                '<td>Serves website files. Standard server logs (IP, browser type).</td>' +
                                '<td><span class="cookie-cat functional">Functional</span></td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    '<p class="cookie-banner-note">We do not use analytics, tracking pixels, or advertising cookies.</p>' +
                '</div>' +
            '</div>' +
            '<div class="cookie-banner-actions">' +
                '<button class="cookie-banner-btn decline" data-consent="decline">Decline</button>' +
                '<button class="cookie-banner-btn essentials" data-consent="essentials">Only Essentials</button>' +
                '<button class="cookie-banner-btn allow" data-consent="allow">Allow All</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(banner);

    /* Show after short delay */
    setTimeout(function () {
        banner.classList.add('show');
    }, 1000);

    /* Toggle details */
    var toggle = banner.querySelector('.cookie-banner-toggle');
    var details = banner.querySelector('.cookie-banner-details');
    var chevron = banner.querySelector('.cookie-banner-chevron');
    toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        details.classList.toggle('open');
        chevron.style.transform = expanded ? '' : 'rotate(180deg)';
    });

    /* Consent buttons */
    banner.querySelectorAll('.cookie-banner-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            localStorage.setItem(STORAGE_KEY, btn.getAttribute('data-consent'));
            banner.classList.remove('show');
            setTimeout(function () { banner.remove(); }, 300);
        });
    });
})();
