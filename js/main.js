// Force hero video autoplay (some browsers block even muted autoplay)
var heroVideo = document.querySelector('.hero-video-bg video');
if (heroVideo) {
    heroVideo.muted = true;
    function tryPlay() {
        heroVideo.play().catch(function () {
            setTimeout(tryPlay, 500);
        });
    }
    if (heroVideo.readyState >= 2) {
        tryPlay();
    } else {
        heroVideo.addEventListener('canplay', tryPlay);
        heroVideo.load();
    }
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

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
