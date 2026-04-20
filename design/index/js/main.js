// Force hero video autoplay
var heroVideo = document.querySelector('.hero-video-bg video');
if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.autoplay = true;
    heroVideo.load();
    var playInterval = setInterval(function () {
        if (!heroVideo.paused) {
            clearInterval(playInterval);
            return;
        }
        heroVideo.play().catch(function () {});
    }, 300);
    setTimeout(function () { clearInterval(playInterval); }, 15000);
}

// Scroll reveal — auto-applied globally
var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.01 });

// Auto-apply scroll-reveal to direct children of every <section> in <main>
// Skip: hero video backgrounds, elements already marked, first section (hero)
var sections = document.querySelectorAll('main section');
sections.forEach(function (section, index) {
    // Skip the first section (hero) — it should be visible immediately
    if (index === 0) return;

    var children = section.querySelectorAll(':scope > *');
    children.forEach(function (el) {
        if (!el.classList.contains('hero-video-bg') && !el.classList.contains('scroll-reveal')) {
            el.classList.add('scroll-reveal');
        }
    });
});

document.querySelectorAll('.scroll-reveal').forEach(function (el) {
    revealObserver.observe(el);
});

// Scroll indicator — visible at top, hidden once scrolled past hero
var scrollIndicator = document.getElementById('scrollIndicator');
if (scrollIndicator) {
    var heroSection = document.getElementById('hero');
    var indicatorOffset = heroSection ? heroSection.offsetHeight : 400;
    window.addEventListener('scroll', function () {
        if (window.scrollY > indicatorOffset * 0.3) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    });
}

// Back to top button
var backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile menu toggle
var hamburger = document.querySelector('.nav-hamburger');
var mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
}
