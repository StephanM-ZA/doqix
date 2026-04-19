// Testimonial carousel - infinite loop
let testimonialIndex = 0;
const track = document.getElementById('testimonialTrack');
const originalSlides = track ? Array.from(track.querySelectorAll('.testimonial-slide')) : [];
const dotsContainer = document.getElementById('testimonialDots');
let autoPlayInterval;
const totalOriginal = originalSlides.length;

function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    return 2;
}

function initTestimonials() {
    if (!originalSlides.length) return;
    const visible = getVisibleCount();
    for (let i = 0; i < visible; i++) {
        const clone = originalSlides[i].cloneNode(true);
        track.appendChild(clone);
    }
    buildDots();
    startAutoPlay();
    window.addEventListener('resize', buildDots);

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

initTestimonials();
