/* Do.Qix Testimonials Carousel — single source of truth, injected via JS */
/* IP-protected: client names, roles, quotes, and plan tiers combined in one component */

(function(){
  'use strict';

  var el = document.getElementById('testimonials-section');
  if (!el) return;

  /* ── Arrow SVGs ──────────────────────────────── */
  var arrowLeft = '<svg style="width:1.5rem;height:1.5rem" class="hi" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>';
  var arrowRight = '<svg style="width:1.5rem;height:1.5rem" class="hi" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>';

  /* ── Testimonial data ────────────────────────── */
  var testimonials = [
    {
      quote: "I used to do my invoicing on Sunday nights. Do.Qix built me one workflow and I haven't sent an invoice manually since. It paid for itself in the first month.",
      name: 'Lerato M.',
      role: 'Bookkeeping Consultant, Pretoria',
      plan: 'Solo plan',
      img: 'lerato-m.jpg'
    },
    {
      quote: "We're a team of six and the admin was quietly eating a full day every week. Three Do.Qix workflows later (lead capture, quote-to-invoice, weekly reporting) and Fridays are for actual work again.",
      name: 'Reuben P.',
      role: 'Managing Director, Cape Town',
      plan: 'Team plan',
      img: 'reuben-p.jpg'
    },
    {
      quote: "I liked that they didn't try to sell me anything I didn't need. They mapped our processes, showed me where the time was going, and built exactly what we agreed. Refreshingly boring.",
      name: 'Thandi N.',
      role: 'Founder, Durban',
      plan: 'Team plan',
      img: 'thandi-n.jpg'
    },
    {
      quote: "We were drowning in WhatsApp orders. Do.Qix built a flow that captures every message, pushes it into our system, and fires off the confirmation automatically. We've handled 30% more volume without hiring.",
      name: 'Imraan S.',
      role: 'Director, Johannesburg',
      plan: 'Business plan',
      img: 'imraan-s.jpg'
    },
    {
      quote: "The monthly strategy call is the part nobody advertises but everybody should. We come in with one problem, leave with three automations on the roadmap. Feels like having an ops team we didn't have to hire.",
      name: 'Nadia V.',
      role: 'COO, Cape Town',
      plan: 'Business plan',
      img: 'nadia-v.jpg'
    },
    {
      quote: "What sold me was the rand pricing and month-to-month. No dollar exposure, no lock-in, no 'enterprise' sales theatre. They build, they bill, they keep things running.",
      name: 'Johan B.',
      role: 'Founder, Stellenbosch',
      plan: 'Team plan',
      img: 'johan.b.jpg'
    },
    {
      quote: "Our finance team got their month-ends back. What used to be a three-day reporting scramble now runs on its own by Tuesday lunchtime. I don't think they'd let us cancel if we tried.",
      name: 'Sipho D.',
      role: 'Finance Manager, Sandton',
      plan: 'Business plan',
      img: 'sipho-d.jpg'
    }
  ];

  /* ── Resolve image base path ─────────────────── */
  var imgBase = '../images/';

  /* ── Build slide HTML ────────────────────────── */
  function slide(t) {
    return '<div class="testimonial-slide">' +
      '<div class="card p-8 space-y-6">' +
      '<p class="italic">"' + t.quote + '"</p>' +
      '<div class="flex items-center gap-4">' +
      '<img src="' + imgBase + t.img + '" alt="' + t.name + '" class="w-12 h-12 rounded-full object-cover"/>' +
      '<div>' +
      '<div class="font-bold">' + t.name + '</div>' +
      '<div class="text-xs text-on-surface-variant uppercase">' + t.role + '</div>' +
      '<div class="text-xs text-primary font-medium mt-1">' + t.plan + '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  var slidesHTML = '';
  for (var i = 0; i < testimonials.length; i++) {
    slidesHTML += slide(testimonials[i]);
  }

  /* ── Inject markup ───────────────────────────── */
  el.innerHTML =
    '<div class="max-w-7xl mx-auto px-8 mb-16 text-center space-y-4">' +
    '<span class="label">Testimonials</span>' +
    '<h2>Don\'t Take <span class="text-primary">Our Word For It</span></h2>' +
    '</div>' +
    '<div class="max-w-5xl mx-auto px-8 relative">' +
    '<button class="testimonial-arrow testimonial-prev" id="tPrev">' + arrowLeft + '</button>' +
    '<button class="testimonial-arrow testimonial-next" id="tNext">' + arrowRight + '</button>' +
    '<div class="testimonial-track-wrapper">' +
    '<div class="testimonial-track" id="testimonialTrack">' + slidesHTML + '</div>' +
    '</div>' +
    '<div class="testimonial-dots" id="testimonialDots"></div>' +
    '</div>';

  /* ── Carousel logic ──────────────────────────── */
  var testimonialIndex = 0;
  var track = document.getElementById('testimonialTrack');
  var originalSlides = Array.from(track.querySelectorAll('.testimonial-slide'));
  var dotsContainer = document.getElementById('testimonialDots');
  var autoPlayInterval;
  var totalOriginal = originalSlides.length;

  function getVisibleCount() {
    return window.innerWidth <= 640 ? 1 : 2;
  }

  function initTestimonials() {
    var visible = getVisibleCount();
    for (var i = 0; i < visible; i++) {
      track.appendChild(originalSlides[i].cloneNode(true));
    }
    buildDots();
    startAutoPlay();
    window.addEventListener('resize', buildDots);

    track.parentElement.addEventListener('mouseenter', function(){ clearInterval(autoPlayInterval); });
    track.parentElement.addEventListener('mouseleave', function(){ startAutoPlay(); });

    track.addEventListener('transitionend', function(){
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
    for (var i = 0; i < totalOriginal; i++) {
      var dot = document.createElement('div');
      dot.className = 'testimonial-dot' + (i === testimonialIndex % totalOriginal ? ' active' : '');
      dot.setAttribute('data-i', i);
      dot.onclick = function(){ var idx = parseInt(this.getAttribute('data-i')); testimonialIndex = idx; updatePosition(); updateDots(); resetAutoPlay(); };
      dotsContainer.appendChild(dot);
    }
  }

  function updatePosition() {
    var slideWidth = getVisibleCount() === 1 ? 100 : 50;
    track.style.transform = 'translateX(-' + (testimonialIndex * slideWidth) + '%)';
  }

  function updateDots() {
    var activeDot = testimonialIndex % totalOriginal;
    var dots = dotsContainer.querySelectorAll('.testimonial-dot');
    for (var i = 0; i < dots.length; i++) {
      if (i === activeDot) { dots[i].classList.add('active'); }
      else { dots[i].classList.remove('active'); }
    }
  }

  function goNext() {
    testimonialIndex++;
    track.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
    updatePosition();
    updateDots();
    resetAutoPlay();
  }

  function goPrev() {
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
    autoPlayInterval = setInterval(goNext, 8000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  /* ── Button bindings ─────────────────────────── */
  document.getElementById('tPrev').onclick = goPrev;
  document.getElementById('tNext').onclick = goNext;

  /* ── Touch swipe support ─────────────────────── */
  var touchStartX = 0;
  track.addEventListener('touchstart', function(e){
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', function(e){
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { goNext(); } else { goPrev(); }
    }
  }, { passive: true });

  initTestimonials();

  /* ── Register with scroll-reveal ─────────────── */
  if (window.doqixReveal) window.doqixReveal(el);

})();
