/* Do.Qix Cookie Banner — three-tier consent, persists in localStorage */
/* GA4 is only loaded when the user clicks "Allow All" */

(function () {
    var STORAGE_KEY = 'doqix_cookie_consent';
    var GA_ID = 'G-BC57HM6CTG';

    /* Load GA4 dynamically — only called when consent is "allow" */
    function loadGA4() {
        if (window._doqixGA4Loaded) return;
        window._doqixGA4Loaded = true;
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
    }

    /* Check existing consent on every page load */
    var consent = localStorage.getItem(STORAGE_KEY);
    if (consent === 'allow') {
        loadGA4();
        return;
    }
    if (consent) return; /* declined or essentials — no banner, no GA4 */

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie notice');
    banner.innerHTML =
        '<div class="cookie-banner-inner">' +
            '<div class="cookie-banner-content">' +
                '<div class="cookie-banner-text">' +
                    '<svg style="width: 1.5rem; height: 1.5rem" class="hi cookie-banner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>' +
                    '<div>' +
                        '<p class="cookie-banner-heading">We use cookies to improve your experience</p>' +
                        '<p class="cookie-banner-sub">Nothing shady. Here is exactly what we use.</p>' +
                    '</div>' +
                '</div>' +
                '<button class="cookie-banner-toggle" aria-expanded="false">' +
                    'View details <svg style="width: 1rem; height: 1rem" class="hi cookie-banner-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>' +
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
                            '<tr>' +
                                '<td>Google Analytics</td>' +
                                '<td>Analytics cookie</td>' +
                                '<td>Tracks page views and site usage to help us improve. Only loaded if you click "Allow All".</td>' +
                                '<td><span class="cookie-cat analytics">Analytics</span></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>Build Request popup</td>' +
                                '<td>Analytics events</td>' +
                                '<td>Tracks when you open the build request popup, advance steps, or submit, so we can improve the form. Only sent if you click "Allow All". No personal information is sent until you submit the contact step.</td>' +
                                '<td><span class="cookie-cat analytics">Analytics</span></td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    '<p class="cookie-banner-note">We do not use tracking pixels or advertising cookies. Analytics is only loaded with your explicit consent.</p>' +
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
            var choice = btn.getAttribute('data-consent');
            localStorage.setItem(STORAGE_KEY, choice);
            if (choice === 'allow') loadGA4();
            banner.classList.remove('show');
            setTimeout(function () { banner.remove(); }, 300);
        });
    });
})();
