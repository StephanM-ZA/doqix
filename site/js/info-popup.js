/* Do.Qix product info popup.
   Triggered by buttons with [data-product] inside .info-popup-trigger.
   Visual language mirrors the build-popup ("Got An Idea") flow:
   eyebrow pill, accent title, hook, feature pills, 5W rows, glow CTA. */

(function () {
    var TRIGGER_SELECTOR = '.info-popup-trigger';

    var PRODUCTS = {
        nomadiq: {
            name: 'NomadIQ',
            statusLabel: 'Live · Custom pricing',
            statusTone: 'live',
            titleHtml: 'Field operations, managed from <span class="accent">anywhere</span>',
            hook: '"Did the team show up?" — answered before you finish your coffee. NomadIQ replaces paper time-sheets and spreadsheet admin with a verifiable record your client can see live.',
            pills: ['GPS-verified', 'Offline-first', 'Multi-tenant', 'POPIA-compliant', 'Learns from your feedback'],
            who: "Service companies with field staff: cleaners, technicians, security teams, maintenance crews. If \"did the team actually show up?\" is a question you can't answer fast enough, you're our customer.",
            what: 'Offline-first mobile app for field staff with GPS-verified check-ins, photo capture, and live-syncing dashboards. Multi-tenant with per-company branding so it scales from one site to a national rollout. Dashboards adapt over time: the metrics your team uses most rise to the top, the noise drops away.',
            why: 'Paper-based attendance lies. Spreadsheet admin breaks. NomadIQ turns "we were there" into a time-stamped, GPS-tagged record your client can see in real time.',
            when: 'When manual time-sheets eat your margin, when client disputes drag for weeks, or the day you pick up a contract that requires SLA reporting you can\'t currently produce.',
            where: 'Anywhere with field staff and intermittent connectivity. The PWA caches offline and syncs when signal returns. Built for SA labour realities, hosted on SA infrastructure.',
            primaryHref: 'contact.html?product=nomadiq',
            secondaryHref: 'products.html#nomadiq',
            footnote: 'Custom pricing per organisation.'
        },
        vendiq: {
            name: 'VendIQ',
            statusLabel: 'Live · Custom pricing',
            statusTone: 'live',
            titleHtml: 'Retail intelligence that moves as fast as <span class="accent">your stock</span>',
            hook: 'Your gut already knows store X is leaking margin. VendIQ gives you the proof before month-end does.',
            pills: ['Real-time', 'POS-fed', 'AI summaries', 'ABC analytics', 'Learns from your feedback'],
            who: "FMCG retailers and vending operators running multiple stores or machines, multiple SKUs, and multiple suppliers. If your reports arrive too late to act on, you're our customer.",
            what: 'Real-time analytics for sales, inventory, distribution gaps, and exit stock. ABC classification, redistribution detection, AI-generated executive summaries, and a custom report builder. Summaries sharpen as your team flags which insights drove decisions and which were noise.',
            why: "Stockouts you can't see, redistribution that wasn't authorised, and Friday-afternoon reports that arrive too late to act on are all margin going out the back door. VendIQ surfaces them before they hit the bottom line.",
            when: 'The week you realise your retail dashboard is a lagging indicator rather than a working tool. The day rate-of-sale starts mattering more than month-end revenue.',
            where: 'SA retail and vending. Ingests POS and stock data from your existing systems through APIs or scheduled imports. SA-hosted, POPIA-compliant data handling.',
            primaryHref: 'contact.html?product=vendiq',
            secondaryHref: 'products.html#vendiq',
            footnote: 'Custom pricing tiered by stores, SKUs, and report volume.'
        },
        socialiq: {
            name: 'SocialIQ',
            statusLabel: 'Live · From R499/mo',
            statusTone: 'live',
            titleHtml: 'You don\'t have time to write. <span class="accent">We do.</span>',
            hook: 'Tell SocialIQ the topics that matter to your business and the sources you trust. It does the research, drafts the posts in your voice, and queues everything for you to approve before anything publishes.',
            pills: ['Research from your sources', 'Drafted in your voice', 'You approve every post', 'Multi-channel', 'Learns from your feedback'],
            who: "Founders, marketers, and small teams who know they should be showing up on social every week but never have time to research and write. If your social presence is the thing that always slips when the week gets busy, you're our customer.",
            what: 'We do the time-consuming part. Tell SocialIQ the topics that matter and the sources you trust, and it pulls fresh material, drafts posts in your brand voice, and queues everything in a dashboard for you to approve before it publishes. Every approval, edit, and rejection feeds back into the writer: drafts sound more like you over time, not less.',
            why: 'Most social media tools just schedule what you already wrote. Most "AI content" tools produce generic mush you would be embarrassed to post. SocialIQ does the slow parts (research and writing) so you only do the fast parts (approve, edit, publish).',
            when: "The week social posting goes from \"we should\" to \"competitors are eating our lunch.\" When you've tried hiring a social media manager and it didn't stick. When your team is great at the work but not at the marketing that brings the work in.",
            where: 'Your voice, your topics, your sources. ZAR pricing, SA-hosted infrastructure. Drafts target your major social channels with platform-appropriate teaser overlays. Multi-tenant ready: agencies can run SocialIQ for several clients from one dashboard.',
            primaryHref: 'contact.html?product=socialiq',
            secondaryHref: 'products-terms.html#socialiq',
            secondaryLabel: 'Read SocialIQ terms',
            footnote: 'From R499 per month. Pricing scales with the social channels you choose and the agreed posting cadence; final price is locked at onboarding. Month-to-month, no long-term contract.'
        },
        voltiq: {
            name: 'VoltIQ',
            statusLabel: 'Live · R99/mo flat',
            statusTone: 'live',
            titleHtml: 'Every solar system on <span class="accent">one screen</span>',
            hook: 'Multi-brand fleets mean multi-portal mornings. Customers notice broken systems before you do. VoltIQ ends both of those problems on day one.',
            pills: [
                { label: 'Deye', check: true },
                { label: 'Sunsynk', check: true },
                { label: 'Luxpower (in progress)' },
                'WhatsApp-first',
                'White-label',
                'Learns from your feedback'
            ],
            who: "Solar installers and EPCs running fleets across Deye and Sunsynk inverters. If you're managing more systems than you can manually check each morning, you're our customer.",
            what: "One screen for every solar system you've installed. Automated issue detection, upsell opportunity flags, and a co-branded WhatsApp morning report you can send straight to your clients. R99 a month, flat. Detection logic improves as your team confirms, edits, or dismisses each alert: the more you use VoltIQ, the fewer false positives you see.",
            why: 'Customers notice broken systems before you do. Every call you take about a fault you should have caught is a churn risk. VoltIQ turns silent faults into morning alerts.',
            when: 'Now. The longer you wait, the more silent faults you carry on your books — and the more competitor installers add proactive monitoring to their pitch.',
            where: 'South African installers, ZAR pricing, SA-hosted infrastructure. Live with Deye and Sunsynk; Luxpower integration in progress; more brands to follow.',
            primaryHref: 'contact.html?product=voltiq',
            secondaryHref: 'products-terms.html#voltiq',
            secondaryLabel: 'Read VoltIQ terms',
            footnote: 'R99 per month, flat. Month-to-month, no long-term contract.'
        },
        learniq: {
            name: 'LearnIQ',
            statusLabel: 'In Development',
            statusTone: 'dev',
            titleHtml: 'Teach AI <span class="accent">properly</span>',
            hook: 'Stop panicking about AI in school. Start teaching kids how to use, evaluate, and create with it — and the ethics of when not to.',
            pills: ['4 age bands', '5 competencies', 'EN + AF', 'UNESCO-aligned', 'Mobile-first', 'Learns from your feedback'],
            who: 'Schools, parents, and teachers preparing students for an AI-shaped working world. Four age bands cover Grade 1 through tertiary; separate streams for parents and teachers.',
            what: 'A bilingual (English + Afrikaans) AI literacy curriculum aligned to the UNESCO AI Competency Framework. Five competency areas: Understanding, Using, Creating, Ethics, and Evaluating. The curriculum updates as teachers flag which modules land and which need work: it improves with every cohort that goes through it.',
            why: 'Most "AI in school" guidance is panic. Learners who skip this conversation will be the ones locked out of work that already requires AI fluency.',
            when: 'Now. Schools that wait will produce graduates with the wrong skills.',
            where: 'SA classrooms first. Mobile-first and offline-capable so it works wherever there is or isn\'t reliable connectivity.',
            primaryHref: 'contact.html?product=learniq',
            secondaryHref: 'products.html#learniq',
            primaryLabel: 'Register early interest',
            footnote: 'In active development. Pricing, learner caps, and pilot details will be confirmed at general availability.'
        }
    };

    var triggers = Array.prototype.slice.call(document.querySelectorAll(TRIGGER_SELECTOR));
    if (!triggers.length) return;

    var overlay = null;
    var card = null;
    var lastTrigger = null;
    var keydownHandler = null;

    function buildOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'info-popup-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'info-popup-title');
        overlay.innerHTML =
            '<div class="info-popup-backdrop"></div>' +
            '<div class="info-popup-card" role="document">' +
                '<button class="info-popup-close" type="button" aria-label="Close">' +
                    '<svg style="width:1.5rem;height:1.5rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>' +
                    '</svg>' +
                '</button>' +
                '<div class="info-popup-content"></div>' +
            '</div>';
        document.body.appendChild(overlay);
        card = overlay.querySelector('.info-popup-card');
        overlay.querySelector('.info-popup-close').addEventListener('click', close);
        overlay.querySelector('.info-popup-backdrop').addEventListener('click', close);
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderPill(p) {
        if (typeof p === 'string') {
            return '<span class="info-popup-pill">' + escapeHtml(p) + '</span>';
        }
        var check = p.check ? '<span class="check" aria-hidden="true">✓</span>' : '';
        return '<span class="info-popup-pill">' + check + escapeHtml(p.label) + '</span>';
    }

    function renderRow(label, body) {
        return '<div class="info-popup-fivew-row">' +
                   '<span class="info-popup-fivew-marker">' + escapeHtml(label) + '</span>' +
                   '<p>' + escapeHtml(body) + '</p>' +
               '</div>';
    }

    function render(slug) {
        var d = PRODUCTS[slug];
        if (!d) return false;
        var statusClass = d.statusTone === 'dev' ? 'dev' : '';
        var pillsHtml = (d.pills || []).map(renderPill).join('');
        var primaryLabel = d.primaryLabel || 'Get in Touch';
        var secondaryLabel = d.secondaryLabel || 'See product';
        var html =
            '<span class="info-popup-eyebrow ' + statusClass + '">' +
                '<span class="dot" aria-hidden="true"></span>' +
                escapeHtml(d.statusLabel) +
            '</span>' +
            '<h2 id="info-popup-title" class="info-popup-title">' + d.titleHtml + '</h2>' +
            '<p class="info-popup-hook">' + escapeHtml(d.hook) + '</p>' +
            (pillsHtml ? '<div class="info-popup-pills">' + pillsHtml + '</div>' : '') +
            '<div class="info-popup-fivew">' +
                renderRow('Who', d.who) +
                renderRow('What', d.what) +
                renderRow('Why', d.why) +
                renderRow('When', d.when) +
                renderRow('Where', d.where) +
            '</div>' +
            '<div class="info-popup-actions">' +
                '<a href="' + d.primaryHref + '" class="btn btn-primary glow">' + escapeHtml(primaryLabel) + '</a>' +
                (d.secondaryHref ? '<a href="' + d.secondaryHref + '" class="info-popup-secondary">' + escapeHtml(secondaryLabel) + '</a>' : '') +
            '</div>' +
            (d.footnote ? '<p class="info-popup-footnote">' + d.footnote + '</p>' : '');
        overlay.querySelector('.info-popup-content').innerHTML = html;
        if (card) card.scrollTop = 0;
        return true;
    }

    function open(slug, trigger) {
        if (!overlay) buildOverlay();
        if (!render(slug)) return;
        lastTrigger = trigger || null;
        overlay.style.display = '';
        void overlay.offsetHeight;
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        var closeBtn = overlay.querySelector('.info-popup-close');
        if (closeBtn) closeBtn.focus();
        keydownHandler = function (e) {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', keydownHandler);
    }

    function close() {
        if (!overlay) return;
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler);
            keydownHandler = null;
        }
        setTimeout(function () {
            if (overlay && !overlay.classList.contains('show')) overlay.style.display = 'none';
        }, 300);
        if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
        lastTrigger = null;
    }

    triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            var slug = (trigger.getAttribute('data-product') || '').toLowerCase();
            if (slug) open(slug, trigger);
        });
    });
})();
