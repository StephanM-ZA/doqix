/* Do.Qix Pricing Carousel — Frontend JS */
(function () {
  'use strict';

  var config = window.doqixPricingConfig || {};
  var container, track, cards, nav;
  var currentIndex = 0;
  var isCarousel = false;
  var autoplayTimer = null;

  /* ─── Utilities ─── */

  function debounce(fn, ms) {
    var timer;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, ms);
    };
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function formatPrice(value, symbol) {
    var num = parseFloat(value);
    if (isNaN(num)) {
      return value;
    }
    return symbol + num.toLocaleString();
  }

  /* ─── Init ─── */

  function init() {
    container = document.getElementById('doqix-pricing');
    if (!container) {
      return;
    }

    track = container.querySelector('.doqix-pricing-track');
    cards = container.querySelectorAll('.doqix-pricing-card');
    nav = container.querySelector('.doqix-pricing-nav');

    if (!track || !cards.length) {
      return;
    }

    /* Set initial active index to featured card or first. */
    var featured = container.querySelector('.doqix-featured');
    if (featured) {
      currentIndex = parseInt(featured.getAttribute('data-index'), 10) || 0;
    }

    handleResize();
    window.addEventListener('resize', debounce(handleResize, 150));

    if (config.billingToggle) {
      initBillingToggle();
    }
  }

  /* ─── Resize / Mode ─── */

  function handleResize() {
    var isMobile = window.innerWidth < (config.breakpoint || 768);
    var mode = isMobile ? (config.displayMobile || 'carousel') : (config.displayDesktop || 'grid');

    container.setAttribute('data-mode', mode);

    if (mode === 'carousel') {
      enableCarousel();
    } else {
      disableCarousel();
    }
  }

  /* ─── Carousel Enable / Disable ─── */

  function enableCarousel() {
    isCarousel = true;
    buildNav();
    initSwipe();
    positionCards();
    if (config.autoplay) {
      startAutoplay();
    }
  }

  function disableCarousel() {
    isCarousel = false;
    stopAutoplay();

    /* Clear nav. */
    if (nav) {
      nav.innerHTML = '';
    }

    /* Reset transforms, opacity, filters on all cards. */
    track.style.transform = '';
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.transform = '';
      cards[i].style.opacity = '';
      cards[i].style.filter = '';
      cards[i].classList.remove('doqix-active');
    }
  }

  /* ─── Position Cards ─── */

  function positionCards() {
    if (!isCarousel) {
      return;
    }

    var activeScale = config.activeScale || 1.15;
    var inactiveScale = 1 / activeScale;

    /* Calculate offset to centre active card in track. */
    var trackRect = track.getBoundingClientRect();
    var trackCenter = trackRect.width / 2;

    var activeCard = cards[currentIndex];
    /* Use offsetLeft relative to track + half the card width. */
    var cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
    var offset = trackCenter - cardCenter;

    track.style.transform = 'translateX(' + offset + 'px)';

    for (var i = 0; i < cards.length; i++) {
      if (i === currentIndex) {
        cards[i].style.transform = 'scale(' + activeScale + ')';
        cards[i].style.opacity = '1';
        cards[i].style.filter = 'none';
        cards[i].classList.add('doqix-active');
      } else {
        cards[i].style.transform = 'scale(' + inactiveScale + ')';
        cards[i].style.opacity = '0.6';
        cards[i].style.filter = 'blur(0.5px)';
        cards[i].classList.remove('doqix-active');
      }
    }

    updateNav();
  }

  /* ─── Navigation ─── */

  function navigate(dir) {
    goTo(currentIndex + dir);
  }

  function goTo(index) {
    currentIndex = clamp(index, 0, cards.length - 1);
    positionCards();
    resetAutoplay();
  }

  function buildNav() {
    if (!nav) {
      return;
    }
    nav.innerHTML = '';

    var style = config.navStyle || 'dots';

    if (style === 'arrows') {
      var left = document.createElement('button');
      left.className = 'doqix-nav-arrow doqix-nav-left';
      left.setAttribute('type', 'button');
      left.setAttribute('aria-label', 'Previous');
      left.textContent = '\u2039';
      left.addEventListener('click', function () {
        navigate(-1);
      });

      var right = document.createElement('button');
      right.className = 'doqix-nav-arrow doqix-nav-right';
      right.setAttribute('type', 'button');
      right.setAttribute('aria-label', 'Next');
      right.textContent = '\u203A';
      right.addEventListener('click', function () {
        navigate(1);
      });

      nav.appendChild(left);
      nav.appendChild(right);
    } else if (style === 'dots') {
      for (var i = 0; i < cards.length; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 'doqix-nav-dot';
          dot.setAttribute('type', 'button');
          dot.setAttribute('aria-label', 'Go to card ' + (idx + 1));
          dot.addEventListener('click', function () {
            goTo(idx);
          });
          nav.appendChild(dot);
        })(i);
      }
    } else if (style === 'breadcrumbs') {
      var names = config.cardNames || [];
      for (var j = 0; j < cards.length; j++) {
        (function (idx) {
          var crumb = document.createElement('button');
          crumb.className = 'doqix-nav-crumb';
          crumb.setAttribute('type', 'button');
          crumb.textContent = names[idx] || 'Tier ' + (idx + 1);
          crumb.addEventListener('click', function () {
            goTo(idx);
          });
          nav.appendChild(crumb);
        })(j);
      }
    }

    updateNav();
  }

  function updateNav() {
    /* Dots. */
    var dots = nav.querySelectorAll('.doqix-nav-dot');
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('doqix-nav-active', i === currentIndex);
    }

    /* Breadcrumbs. */
    var crumbs = nav.querySelectorAll('.doqix-nav-crumb');
    for (var j = 0; j < crumbs.length; j++) {
      crumbs[j].classList.toggle('doqix-nav-active', j === currentIndex);
    }
  }

  /* ─── Touch / Swipe ─── */

  function initSwipe() {
    var startX = 0;

    track.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 50) {
        navigate(delta < 0 ? 1 : -1);
      }
    });
  }

  /* ─── Autoplay ─── */

  function startAutoplay() {
    stopAutoplay();
    var speed = config.autoplaySpeed || 4000;
    autoplayTimer = setInterval(function () {
      var next = currentIndex + 1;
      if (next >= cards.length) {
        next = 0;
      }
      goTo(next);
    }, speed);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    if (config.autoplay && isCarousel) {
      startAutoplay();
    }
  }

  /* ─── Billing Toggle ─── */

  function initBillingToggle() {
    var toggle = container.querySelector('.doqix-billing-switch');
    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', function () {
      var isAnnual = toggle.classList.toggle('doqix-billing-on');

      /* Swap active label. */
      var labels = container.querySelectorAll('.doqix-billing-label');
      if (labels.length >= 2) {
        if (isAnnual) {
          labels[0].classList.remove('doqix-billing-active');
          labels[1].classList.add('doqix-billing-active');
        } else {
          labels[0].classList.add('doqix-billing-active');
          labels[1].classList.remove('doqix-billing-active');
        }
      }

      /* Swap price values. */
      var symbol = config.currencySymbol || 'R';
      for (var i = 0; i < cards.length; i++) {
        var priceEl = cards[i].querySelector('.doqix-price-value');
        if (!priceEl) {
          continue;
        }

        var monthly = cards[i].getAttribute('data-price');
        var annual = cards[i].getAttribute('data-price-annual');

        var raw = isAnnual ? annual : monthly;

        if (raw === '' || raw === null) {
          /* No annual price available — keep current display. */
          continue;
        }

        priceEl.textContent = formatPrice(raw, symbol);
      }
    });
  }

  /* ─── Boot ─── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
