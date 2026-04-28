// Testimonial carousel - infinite loop
let testimonialIndex = 0;
const track = document.getElementById('testimonialTrack');
const originalSlides = track ? Array.from(track.querySelectorAll('.testimonial-slide')) : [];
const dotsContainer = document.getElementById('testimonialDots');
let autoPlayInterval;
const totalOriginal = originalSlides.length;

// Cache viewport-derived value so animation-loop reads don't trigger forced reflow.
let cachedVisibleCount = 2;
function updateVisibleCount() {
    cachedVisibleCount = window.innerWidth <= 640 ? 1 : 2;
}
function getVisibleCount() {
    return cachedVisibleCount;
}
updateVisibleCount();

function initTestimonials() {
    if (!originalSlides.length) return;
    const visible = getVisibleCount();
    for (let i = 0; i < visible; i++) {
        const clone = originalSlides[i].cloneNode(true);
        track.appendChild(clone);
    }
    buildDots();
    startAutoPlay();
    window.addEventListener('resize', () => { updateVisibleCount(); buildDots(); }, { passive: true });

    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.parentElement.addEventListener('mouseleave', () => startAutoPlay());

    track.addEventListener('transitionend', () => {
        if (testimonialIndex >= totalOriginal) {
            track.style.transition = 'none';
            testimonialIndex = 0;
            updatePosition();
            track.offsetHeight;
            track.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
            updateDots();
        }
    });
}

function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalOriginal; i++) {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot' + (i === testimonialIndex % totalOriginal ? ' active' : '');
        dot.onclick = () => { testimonialIndex = i; updatePosition(); updateDots(); resetAutoPlay(); };
        dotsContainer.appendChild(dot);
    }
}

function updatePosition() {
    const slideWidth = getVisibleCount() === 1 ? 100 : 50;
    track.style.transform = `translateX(-${testimonialIndex * slideWidth}%)`;
}

function updateDots() {
    const activeDot = testimonialIndex % totalOriginal;
    dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
        d.classList.toggle('active', i === activeDot);
    });
}

function testimonialNext() {
    testimonialIndex++;
    track.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
    updatePosition();
    updateDots();
    resetAutoPlay();
}

function testimonialPrev() {
    if (testimonialIndex <= 0) {
        track.style.transition = 'none';
        testimonialIndex = totalOriginal;
        updatePosition();
        track.offsetHeight;
        track.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
        testimonialIndex = totalOriginal - 1;
        updatePosition();
    } else {
        testimonialIndex--;
        updatePosition();
    }
    updateDots();
    resetAutoPlay();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => testimonialNext(), 8000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Touch swipe support for mobile
if (track) {
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { testimonialNext(); } else { testimonialPrev(); }
        }
    }, { passive: true });
}

initTestimonials();
