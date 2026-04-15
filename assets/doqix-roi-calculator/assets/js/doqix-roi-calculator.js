/**
 * Do.Qix ROI Calculator — Frontend Logic
 * Version: 1.0.0
 *
 * Config-driven: reads tier names/prices and share URL from
 * window.doqixRoiConfig (set by wp_localize_script).
 * Falls back to hardcoded defaults if config is missing.
 */
(function() {
  'use strict';

  var config = window.doqixRoiConfig || {};

  /* ── DOM refs ── */
  var sliderPeople     = document.getElementById('slider-people');
  var sliderHours      = document.getElementById('slider-hours');
  var sliderRate       = document.getElementById('slider-rate');
  var sliderEfficiency = document.getElementById('slider-efficiency');
  var sliderError      = document.getElementById('slider-error');

  var valPeople     = document.getElementById('val-people');
  var valHours      = document.getElementById('val-hours');
  var valRate       = document.getElementById('val-rate');
  var valEfficiency = document.getElementById('val-efficiency');
  var valError      = document.getElementById('val-error');

  var outTotalHours = document.getElementById('out-total-hours');
  var outMonthly    = document.getElementById('out-monthly');
  var outAnnual     = document.getElementById('out-annual');
  var outHoursMonth = document.getElementById('out-hours-month');
  var outHoursYear  = document.getElementById('out-hours-year');
  var outRoiPct          = document.getElementById('out-roi-pct');
  var outTier            = document.getElementById('out-tier');
  var outEfficiencyNote  = document.getElementById('out-efficiency-note');
  var outBenchmark       = document.getElementById('out-benchmark');
  var btnShare           = document.getElementById('btn-share');
  var container          = document.getElementById('roi-calculator');

  /* Bail if the calculator isn't on this page */
  if ( ! container ) return;

  /* ── Helpers ── */
  var WEEKS_PER_MONTH = 4.33;

  function formatZAR(n) {
    n = Math.round(n);
    if (n >= 1000000) return 'R' + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 100000)  return 'R' + Math.round(n / 1000) + 'k';
    return 'R' + n.toLocaleString('en-ZA');
  }

  function formatHours(n) {
    n = Math.round(n);
    if (n >= 10000) return Math.round(n / 1000) + 'k';
    return n.toLocaleString('en-ZA');
  }

  /* ── Accent color (admin-configurable, falls back to CSS variable) ── */
  var accentColor = config.color_accent || '#0886B5';
  try {
    if (!config.color_accent) {
      var computed = getComputedStyle(container).getPropertyValue('--roi-accent').trim();
      if (computed) accentColor = computed;
    }
  } catch(e) {}

  /* ── Slider track colour (unfilled portion — reads CSS var) ── */
  var trackColor = 'rgba(13,32,40,0.12)';
  try {
    var computed = getComputedStyle(container).getPropertyValue('--roi-slider-track').trim();
    if (computed) trackColor = computed;
  } catch(e) {}

  /* ── Slider track fill (accent colour up to thumb) ── */
  function updateSliderFill(slider) {
    var min = parseFloat(slider.min);
    var max = parseFloat(slider.max);
    var val = parseFloat(slider.value);
    var pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
      'linear-gradient(to right, ' + accentColor + ' 0%, ' + accentColor + ' ' + pct + '%, ' + trackColor + ' ' + pct + '%, ' + trackColor + ' 100%)';
  }

  /* ── Tier mapping (config-driven with hardcoded fallbacks) ── */
  var TIERS = [
    null,
    { name: config.tier_1_name  || 'Solo',       price: parseInt(config.tier_1_price, 10)  || 999  },
    { name: config.tier_2_name  || 'Team',       price: parseInt(config.tier_2_price, 10)  || 2500 },
    { name: config.tier_3_name  || 'Business',   price: parseInt(config.tier_3_price, 10)  || 5500 },
    { name: config.tier_4_name  || 'Enterprise', price: parseInt(config.tier_4_price, 10)  || 0    }
  ];

  /* Tier 4 (Enterprise) price is intentionally 0 (custom pricing) */
  TIERS[4].price = parseInt(config.tier_4_price, 10) || 0;

  function getTier(efficiency, monthlySavings) {
    var tier = 0;
    if (monthlySavings >= 2500)   tier = 1;
    if (monthlySavings >= 7500)   tier = 2;
    if (monthlySavings >= 15000)  tier = 3;
    if (monthlySavings >= 100000) tier = 4;

    while (tier >= 1 && tier < 4 && TIERS[tier].price > 0) {
      var roiPct = ((monthlySavings - TIERS[tier].price) / TIERS[tier].price) * 100;
      if (roiPct > 600) { tier++; } else { break; }
    }

    if (efficiency >= 0.80 && tier >= 1 && tier < 4) {
      var next = TIERS[tier + 1];
      if (next.price === 0 || monthlySavings >= next.price * 2) {
        tier++;
      }
    }

    if (tier > 4) tier = 4;
    return TIERS[tier];
  }

  /* ── Contextual nudge quotes (50) ── */
  var nudges = {
    solo: [
      '{hours} hours a month back. Imagine what you\u2019d do with an extra day every week.',
      'You\u2019re leaving {monthly} on the table every month. One workflow changes that.',
      'At {rate} an hour, every task you still do manually is money walking out the door.',
      '{annual} a year in wasted time \u2014 and that\u2019s before you count the stress.',
      'What if your mornings weren\u2019t eaten by admin? That\u2019s what {hours} hours back looks like.',
      'One automated process. That\u2019s all it takes to change your week when you\u2019re flying solo.',
      'Your hourly rate says your time is worth {rate}. Your admin tasks disagree.',
      'Most solopreneurs automate one thing \u2014 then immediately ask \u2018what else can you do?\u2019',
      '{monthly} a month. That\u2019s not savings \u2014 that\u2019s freedom you\u2019re currently giving away.',
      'Every hour on busywork is an hour your competitors are spending on growth.',
      'Start with the one task that makes you groan every Monday. The rest falls into place.',
      'You didn\u2019t start a business to process invoices. Let\u2019s fix that.'
    ],
    team: [
      '{people} people \u00d7 {hours} wasted hours = a problem with a very clear solution.',
      'Your team is spending {hours} hours a month on work that doesn\u2019t need them. What if they didn\u2019t?',
      '{annual} a year. That\u2019s a full hire being spent on tasks a machine handles better.',
      'The fastest-growing teams automate first, hire second. You\u2019re looking at why.',
      'Three workflows. That\u2019s usually all it takes to free up your team\u2019s best hours.',
      'What would your {people} people do with {hours} extra hours a month? That\u2019s the real question.',
      'At {rate} per hour across {people} people \u2014 every manual process is a compounding cost.',
      'Teams your size see ROI in month one. That\u2019s not marketing \u2014 that\u2019s maths.',
      'You hired smart people. They\u2019re spending {hours} hours on tasks that don\u2019t need a brain.',
      'The gap between drowning in admin and scaling fast is often just three automated workflows.',
      '{monthly} a month. Redirect that into growth and watch what happens.',
      'Most teams start with invoicing. Then they can\u2019t stop automating everything else.',
      'Your competitors already automated this. The longer you wait, the wider the gap.',
      'Stop paying {people} people to do a machine\u2019s job. That\u2019s not efficiency \u2014 it\u2019s habit.'
    ],
    business: [
      '{people} people on manual processes is a strategic problem, not just an operational one.',
      '{annual} a year. At your scale, that\u2019s not waste \u2014 it\u2019s a competitive blind spot.',
      'Finance, sales, ops \u2014 three departments, six workflows. That\u2019s how Business clients start.',
      'At this size, the cost of not automating is bigger than the cost of automating. By a lot.',
      '{hours} hours of manual work a month across your team. That\u2019s roles, not tasks.',
      'Your competitors who automated last year are already ahead. This is how you close the gap.',
      'At {rate} across {people} people, every month you wait multiplies what you\u2019re losing.',
      'Automation at this scale isn\u2019t an optimisation \u2014 it\u2019s a strategic decision.',
      '{monthly} a month between you and your next growth phase. What\u2019s stopping you?',
      'Most businesses your size discover 6+ automatable processes on the first call. Just saying.',
      'Manual processes at {people} people don\u2019t just cost time \u2014 they introduce risk you can\u2019t see.',
      'This is where the businesses that automate pull away from the ones that don\u2019t.',
      'Your team is doing {hours} hours of work that doesn\u2019t need a human. Let\u2019s change that.',
      'The ROI at your scale pays back in the first billing cycle. That\u2019s not a pitch \u2014 it\u2019s the maths.'
    ],
    enterprise: [
      'At this scale, every month without automation costs more than the automation itself.',
      '{annual} a year. That\u2019s not a line item \u2014 that\u2019s a strategic lever.',
      'You\u2019re not automating tasks anymore. You\u2019re automating departments.',
      'This is operational redesign territory. The quick wins are long behind you.',
      '{hours} hours a month is structural waste. Automation is how you fix structural.',
      'The question isn\u2019t \u2018should we automate?\u2019 \u2014 it\u2019s \u2018why haven\u2019t we started?\u2019',
      'Enterprise clients automate 10+ workflows in quarter one. The compounding from there is real.',
      '{monthly} a month is a strategic advantage your competitors probably don\u2019t have yet.',
      'At your scale, ROI isn\u2019t hours saved \u2014 it\u2019s what your people can finally focus on.',
      'Automation at this level isn\u2019t a tool. It\u2019s infrastructure.'
    ]
  };

  function getNudge(tierName, data) {
    var pool = nudges[tierName.toLowerCase()] || nudges.team;
    var idx = Math.floor(Math.random() * pool.length);
    var text = pool[idx];
    return text
      .replace(/\{monthly\}/g, data.monthly)
      .replace(/\{annual\}/g, data.annual)
      .replace(/\{hours\}/g, data.hours)
      .replace(/\{people\}/g, data.people)
      .replace(/\{rate\}/g, data.rate)
      .replace(/\{tier\}/g, data.tier)
      .replace(/\{price\}/g, data.price);
  }

  /* ── Core calculation ── */
  function calculate() {
    var people     = parseInt(sliderPeople.value, 10);
    var hours      = parseInt(sliderHours.value, 10);
    var rate       = parseInt(sliderRate.value, 10);
    var efficiency = parseInt(sliderEfficiency.value, 10) / 100;
    var errorCost  = parseInt(sliderError.value, 10);

    var hoursSavedMonth  = people * hours * WEEKS_PER_MONTH * efficiency;
    var monthlySavings   = (hoursSavedMonth * rate) + errorCost;
    var annualSavings    = monthlySavings * 12;
    var hoursSavedYear   = hoursSavedMonth * 12;

    var tier = getTier(efficiency, monthlySavings);

    /* ── Update display values ── */
    valPeople.textContent     = people;
    valHours.textContent      = hours;
    outTotalHours.textContent = '= ' + (people * hours) + ' hrs/week across your team';
    valRate.textContent       = 'R' + rate;
    valEfficiency.textContent = Math.round(efficiency * 100) + '%';
    valError.textContent      = formatZAR(errorCost);

    outMonthly.textContent    = formatZAR(monthlySavings);
    outAnnual.textContent     = formatZAR(annualSavings);
    outHoursMonth.textContent = formatHours(hoursSavedMonth) + ' hrs';
    outHoursYear.textContent  = formatHours(hoursSavedYear) + ' hrs';

    if (tier && tier.price > 0) {
      var roiPct = Math.round(((monthlySavings - tier.price) / tier.price) * 100);
      if (roiPct < 0) roiPct = 0;
      outRoiPct.textContent = roiPct.toLocaleString('en-ZA') + '%';

      var roiMultiplier = Math.round(monthlySavings / tier.price);
      if (roiMultiplier < 1) roiMultiplier = 1;
      var multiplierText = roiMultiplier > 10 ? '10x+' : roiMultiplier + 'x';

      outTier.innerHTML =
        'You\u2019d pay us <strong>' + formatZAR(tier.price) + '/mo</strong> for our <strong>' + tier.name + '</strong> plan.<br>' +
        'You\u2019d save <strong>' + formatZAR(monthlySavings) + '/mo</strong>. That\u2019s <span class="roi-multiplier">' + multiplierText + '</span> your investment back.';

    } else if (tier && tier.price === 0) {
      outRoiPct.textContent = '\u2014';
      outTier.innerHTML =
        'At this scale, our <strong>Enterprise</strong> plan is the right fit.<br>' +
        'You\u2019d save <strong>' + formatZAR(monthlySavings) + '/mo</strong>. We\u2019ll scope pricing to your needs.';

    } else {
      outRoiPct.textContent = '\u2014';
      outTier.innerHTML =
        'Start with one quick win \u2014 even small automations compound over time.<br>' +
        '<strong>' + formatHours(hoursSavedMonth) + ' hours</strong> back is still <strong>' + formatHours(hoursSavedMonth) + ' hours</strong> you\u2019re not wasting.';
    }

    var tierName = tier ? tier.name : 'solo';
    outBenchmark.textContent = getNudge(tierName, {
      monthly: formatZAR(monthlySavings),
      annual: formatZAR(annualSavings),
      hours: formatHours(hoursSavedMonth),
      people: people.toString(),
      rate: formatZAR(rate),
      tier: tier ? tier.name : 'Solo',
      price: (tier && tier.price > 0) ? formatZAR(tier.price) : 'Custom'
    });

    if (efficiency >= 0.80) {
      outEfficiencyNote.textContent = 'Reaching ' + Math.round(efficiency * 100) + '% automation typically requires additional workflows beyond the base plan.';
      outEfficiencyNote.style.display = 'block';
    } else {
      outEfficiencyNote.style.display = 'none';
    }

    updateSliderFill(sliderPeople);
    updateSliderFill(sliderHours);
    updateSliderFill(sliderRate);
    updateSliderFill(sliderEfficiency);
    updateSliderFill(sliderError);
  }

  /* ── Event listeners ── */
  sliderPeople.addEventListener('input', calculate);
  sliderHours.addEventListener('input', calculate);
  sliderRate.addEventListener('input', calculate);
  sliderEfficiency.addEventListener('input', calculate);
  sliderError.addEventListener('input', calculate);

  /* ── Touch-friendly tooltips ── */
  var activeTooltip = null;

  function handleTooltipTouch(e) {
    var label = e.target.closest('.slider-label');
    if (!label) {
      if (activeTooltip) {
        activeTooltip.classList.remove('tooltip-visible');
        activeTooltip = null;
      }
      return;
    }
    var tip = label.querySelector('.tooltip');
    if (!tip) return;

    e.preventDefault();

    if (activeTooltip && activeTooltip !== tip) {
      activeTooltip.classList.remove('tooltip-visible');
    }

    if (tip.classList.contains('tooltip-visible')) {
      tip.classList.remove('tooltip-visible');
      activeTooltip = null;
    } else {
      tip.classList.add('tooltip-visible');
      activeTooltip = tip;
    }
  }

  container.addEventListener('touchstart', handleTooltipTouch, { passive: false });

  window.addEventListener('scroll', function() {
    if (activeTooltip) {
      activeTooltip.classList.remove('tooltip-visible');
      activeTooltip = null;
    }
  }, { passive: true });

  /* ── Share results ── */
  if (btnShare) {
    btnShare.addEventListener('click', function() {
      var people     = parseInt(sliderPeople.value, 10);
      var hours      = parseInt(sliderHours.value, 10);
      var rate       = parseInt(sliderRate.value, 10);
      var efficiency = parseInt(sliderEfficiency.value, 10) / 100;
      var errorCost  = parseInt(sliderError.value, 10);

      var hoursSavedMonth = people * hours * WEEKS_PER_MONTH * efficiency;
      var monthlySavings  = (hoursSavedMonth * rate) + errorCost;
      var annualSavings   = monthlySavings * 12;

      var shareText =
        '\uD83D\uDCA1 Ever wondered what repetitive work actually costs? I just found out:\n' +
        '\n' +
        '\uD83D\uDCB0 Monthly: *' + formatZAR(monthlySavings) + '*\n' +
        '\uD83D\uDCCA Annual: *' + formatZAR(annualSavings) + '*\n' +
        '\u23F1\uFE0F Hours saved: *' + formatHours(hoursSavedMonth) + '/month*\n' +
        '\n' +
        '\uD83D\uDC49 Go to https://doqix.co.za to find out more.';

      var shareUrl   = config.share_url || 'https://doqix.co.za';
      var shareTitle = 'My Automation Savings \u2014 DoQix - Efficiency Engineered';

      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          text: shareText
        }).catch(function() {});
        return;
      }

      var clipText = shareText;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(clipText).then(showCopied, fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = clipText;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showCopied(); }
        catch(e) {}
        document.body.removeChild(ta);
      }

      function showCopied() {
        btnShare.textContent = 'Copied to clipboard!';
        btnShare.classList.add('copied');
        setTimeout(function() {
          btnShare.textContent = 'Share Your Results';
          btnShare.classList.remove('copied');
        }, 2000);
      }
    });
  }

  /* ── Initial render ── */
  calculate();
})();
