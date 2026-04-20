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
