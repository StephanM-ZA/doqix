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
}, { threshold: 0.1 });

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
    var indicatorOffset = 400;
    requestAnimationFrame(function () {
        var heroSection = document.getElementById('hero');
        if (heroSection) indicatorOffset = heroSection.offsetHeight;
    });
    window.addEventListener('scroll', function () {
        if (window.scrollY > indicatorOffset * 0.3) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    }, { passive: true });
}

// Back to top button
var backToTop = document.getElementById('backToTop');
window._scrollingToTop = false;
if (backToTop) {
    window.addEventListener('scroll', function () {
        if (window._scrollingToTop) return;
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });
    backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window._scrollingToTop = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        var checkDone = setInterval(function () {
            if (window.scrollY <= 1) {
                clearInterval(checkDone);
                window._scrollingToTop = false;
                backToTop.classList.remove('visible');
            }
        }, 50);
    });
    backToTop.addEventListener('touchend', function (e) {
        e.preventDefault();
        backToTop.click();
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
