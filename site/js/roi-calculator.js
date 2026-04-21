/* Do.Qix ROI Calculator — HTML + logic, single source of truth */
/* IP-protected: pricing tiers, nudge copy, and ROI logic */

(function(){
  'use strict';

  var roiContainer = document.getElementById('roi-calculator');
  if (!roiContainer) return;

  /* ── Inject HTML ───────────────────────────────── */
  roiContainer.innerHTML =
    '<div class="text-center space-y-4 mb-12">' +
      '<span class="label">The Mathematics</span>' +
      '<h2>See What <span class="text-primary">You Could Save</span></h2>' +
      '<p class="intro">Every business bleeds time differently. Move the sliders to match your team, and see exactly what you could reclaim each month.</p>' +
    '</div>' +

    '<div class="roi-grid">' +

      /* Inputs */
      '<div class="roi-inputs">' +
        '<div class="panel-label">Your Team</div>' +

        '<div class="slider-group">' +
          '<div class="slider-header">' +
            '<span class="slider-label">People doing repetitive tasks<span class="info-icon" data-tip="people">i</span><span class="tooltip">How many staff spend time on repetitive, rule-based work? This multiplies with hours and rate to calculate your total savings.</span></span>' +
            '<span class="slider-value" id="val-people"></span>' +
          '</div>' +
          '<input type="range" id="slider-people"/>' +
          '<div class="slider-range-labels"><span></span><span></span></div>' +
        '</div>' +

        '<div class="slider-group">' +
          '<div class="slider-header">' +
            '<span class="slider-label">Hours per person per week<span class="info-icon" data-tip="hours">i</span><span class="tooltip">Hours each person spends on repetitive tasks weekly. Think data entry, copy-pasting, manual emails, reporting. Multiplied by people count to get total team hours.</span></span>' +
            '<span class="slider-value" id="val-hours"></span>' +
          '</div>' +
          '<input type="range" id="slider-hours"/>' +
          '<div class="slider-range-labels"><span></span><span></span></div>' +
          '<div class="total-hours" id="out-total-hours"></div>' +
        '</div>' +

        '<div class="slider-group">' +
          '<div class="slider-header">' +
            '<span class="slider-label">Average hourly cost<span class="info-icon" data-tip="rate">i</span><span class="tooltip">What you pay per hour per person (salary + benefits + overheads). This converts saved hours into Rand value.</span></span>' +
            '<span class="slider-value" id="val-rate"></span>' +
          '</div>' +
          '<input type="range" id="slider-rate"/>' +
          '<div class="slider-range-labels"><span></span><span></span></div>' +
        '</div>' +

        '<div class="slider-group">' +
          '<div class="slider-header">' +
            '<span class="slider-label">Automation efficiency<span class="info-icon" data-tip="efficiency">i</span><span class="tooltip">What percentage of manual hours can realistically be automated. 70% is a conservative start. Higher values may require additional workflows and affect the recommended plan tier.</span></span>' +
            '<span class="slider-value" id="val-efficiency"></span>' +
          '</div>' +
          '<input type="range" id="slider-efficiency"/>' +
          '<div class="slider-range-labels"><span></span><span></span></div>' +
          '<div class="efficiency-note" id="out-efficiency-note"></div>' +
        '</div>' +

        '<div class="slider-group">' +
          '<div class="slider-header">' +
            '<span class="slider-label">Monthly error cost<span class="info-icon" data-tip="error">i</span><span class="tooltip">What manual mistakes cost you monthly: re-work, wrong invoices, missed follow-ups. Added directly to your monthly savings total.</span></span>' +
            '<span class="slider-value" id="val-error"></span>' +
          '</div>' +
          '<input type="range" id="slider-error"/>' +
          '<div class="slider-range-labels"><span></span><span></span></div>' +
        '</div>' +
      '</div>' +

      /* Outputs */
      '<div class="roi-outputs">' +

        '<div class="hero-result">' +
          '<div class="hero-amount" id="out-monthly">R0</div>' +
          '<div class="hero-label">Your Monthly Savings <div class="card-tooltip-wrap" style="display:inline-block;position:relative"><span class="info-icon">i</span><span class="card-tooltip">The total Rand value you could reclaim each month by automating repetitive work.<span class="tip-formula">(people \u00d7 hours \u00d7 4.33 \u00d7 rate \u00d7 efficiency) + error cost</span><span class="tip-affects">Affected by: all five sliders</span></span></div></div>' +
        '</div>' +

        '<div class="result-cards">' +
          '<div class="result-card">' +
            '<div class="card-header"><div class="card-value" id="out-annual">R0</div><div class="card-tooltip-wrap"><span class="info-icon">i</span><span class="card-tooltip">Monthly savings multiplied by 12.<span class="tip-formula">(hours saved \u00d7 rate + errors) \u00d7 12</span><span class="tip-affects">Affected by: all sliders</span></span></div></div>' +
            '<div class="card-label">per year</div>' +
          '</div>' +
          '<div class="result-card">' +
            '<div class="card-header"><div class="card-value" id="out-roi-pct">0%</div><div class="card-tooltip-wrap"><span class="info-icon">i</span><span class="card-tooltip">How much you get back above the cost of the recommended plan. Higher = better value.<span class="tip-formula">(savings - plan cost) / plan cost</span><span class="tip-affects">Affected by: all sliders + plan tier</span></span></div></div>' +
            '<div class="card-label">return on investment</div>' +
          '</div>' +
          '<div class="result-card hours">' +
            '<div class="card-header"><div class="card-value" id="out-hours-month">0 hrs</div><div class="card-tooltip-wrap"><span class="info-icon">i</span><span class="card-tooltip">Total team hours freed up each month by automating repetitive work.<span class="tip-formula">people \u00d7 hours \u00d7 4.33 weeks \u00d7 efficiency</span><span class="tip-affects">Affected by: people, hours, efficiency</span></span></div></div>' +
            '<div class="card-label">back per month</div>' +
          '</div>' +
          '<div class="result-card hours">' +
            '<div class="card-header"><div class="card-value" id="out-hours-year">0 hrs</div><div class="card-tooltip-wrap"><span class="info-icon">i</span><span class="card-tooltip">Total team hours freed up over a full year.<span class="tip-formula">monthly hours \u00d7 12</span><span class="tip-affects">Affected by: people, hours, efficiency</span></span></div></div>' +
            '<div class="card-label">back per year</div>' +
          '</div>' +
          '<div class="result-card tier-suggestion">' +
            '<div class="tier-text" id="out-tier"></div>' +
          '</div>' +
        '</div>' +

        '<div class="benchmark" id="out-benchmark"></div>' +

        '<a href="contact.html" class="roi-cta" id="roi-cta-link">' +
          'Get Started' +
          '<span class="cta-sub">15 minutes. No commitment. We\'ll show you where to start.</span>' +
        '</a>' +

        '<button type="button" class="share-btn" id="btn-share">Share Your Results</button>' +

      '</div>' +

    '</div>' +

    '<p class="roi-footnote">Estimates based on your inputs. Actual savings depend on processes automated. All figures in ZAR.</p>';

  /* ── Slider config (single source of truth) ──── */
  var CONFIG = {
    people:     { default: 3,    min: 1,  max: 50,    step: 1   },
    hours:      { default: 8,    min: 1,  max: 40,    step: 1   },
    rate:       { default: 150,  min: 50, max: 1000,  step: 50  },
    efficiency: { default: 70,   min: 50, max: 90,    step: 5   },
    error:      { default: 2000, min: 0,  max: 50000, step: 500 }
  };

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
  var outRoiPct     = document.getElementById('out-roi-pct');
  var outTier       = document.getElementById('out-tier');
  var outEffNote    = document.getElementById('out-efficiency-note');
  var outBenchmark  = document.getElementById('out-benchmark');
  var btnShare      = document.getElementById('btn-share');
  var pricingBannerText = document.getElementById('pricing-banner-text');
  var pricingBanner = document.getElementById('pricing-banner');
  var calcTouched = false;

  // Apply config to sliders
  function initSlider(slider, valEl, cfg, format) {
    slider.min = cfg.min;
    slider.max = cfg.max;
    slider.step = cfg.step;
    slider.value = cfg.default;
    valEl.textContent = format ? format(cfg.default) : cfg.default;
  }
  initSlider(sliderPeople, valPeople, CONFIG.people);
  initSlider(sliderHours, valHours, CONFIG.hours);
  initSlider(sliderRate, valRate, CONFIG.rate, function(v){ return 'R'+v; });
  initSlider(sliderEfficiency, valEfficiency, CONFIG.efficiency, function(v){ return v+'%'; });
  initSlider(sliderError, valError, CONFIG.error, function(v){ return 'R'+Number(v).toLocaleString('en-ZA'); });

  // Update range labels from config
  function setRangeLabels(slider, minLabel, maxLabel) {
    var labels = slider.parentElement.querySelector('.slider-range-labels');
    if (labels) {
      labels.children[0].textContent = minLabel;
      labels.children[1].textContent = maxLabel;
    }
  }
  setRangeLabels(sliderPeople, CONFIG.people.min, CONFIG.people.max);
  setRangeLabels(sliderHours, CONFIG.hours.min+' hr', CONFIG.hours.max+' hrs');
  setRangeLabels(sliderRate, 'R'+CONFIG.rate.min.toLocaleString('en-ZA'), 'R'+CONFIG.rate.max.toLocaleString('en-ZA'));
  setRangeLabels(sliderEfficiency, CONFIG.efficiency.min+'%', CONFIG.efficiency.max+'%');
  setRangeLabels(sliderError, 'R'+CONFIG.error.min.toLocaleString('en-ZA'), 'R'+CONFIG.error.max.toLocaleString('en-ZA'));

  // Set initial total hours
  outTotalHours.textContent = '= '+(CONFIG.people.default * CONFIG.hours.default)+' hrs/week across your team';

  var WEEKS_PER_MONTH = 4.33;
  var accentColor = '#00e5a0';
  var trackColor  = 'rgba(255,255,255,0.08)';

  function formatZAR(n){
    n=Math.round(n);
    if(n>=1000000)return'R'+(n/1000000).toFixed(1).replace(/\.0$/,'')+'M';
    if(n>=100000)return'R'+Math.round(n/1000)+'k';
    return'R'+n.toLocaleString('en-ZA');
  }

  function formatHours(n){
    n=Math.round(n);
    if(n>=10000)return Math.round(n/1000)+'k';
    return n.toLocaleString('en-ZA');
  }

  function updateSliderFill(slider){
    var min=parseFloat(slider.min),max=parseFloat(slider.max),val=parseFloat(slider.value);
    var pct=((val-min)/(max-min))*100;
    slider.style.background='linear-gradient(to right,'+accentColor+' 0%,'+accentColor+' '+pct+'%,'+trackColor+' '+pct+'%,'+trackColor+' 100%)';
  }

  var TIERS=[
    null,
    {name:'Solo',price:999},
    {name:'Team',price:2500},
    {name:'Business',price:5500},
    {name:'Enterprise',price:0}
  ];

  function getTier(efficiency,monthlySavings){
    var tier=0;
    if(monthlySavings>=2500)tier=1;
    if(monthlySavings>=7500)tier=2;
    if(monthlySavings>=15000)tier=3;
    if(monthlySavings>=100000)tier=4;
    while(tier>=1&&tier<4&&TIERS[tier].price>0){
      var r=((monthlySavings-TIERS[tier].price)/TIERS[tier].price)*100;
      if(r>600){tier++}else{break}
    }
    if(efficiency>=0.80&&tier>=1&&tier<4){
      var next=TIERS[tier+1];
      if(next.price===0||monthlySavings>=next.price*2)tier++;
    }
    if(tier>4)tier=4;
    return TIERS[tier];
  }

  var nudges={
    solo:[
      '{hours} hours a month back. Imagine what you\u2019d do with an extra day every week.',
      'You\u2019re leaving {monthly} on the table every month. One workflow changes that.',
      'At {rate} an hour, every task you still do manually is money walking out the door.',
      '{annual} a year in wasted time. And that\u2019s before you count the stress.',
      'What if your mornings weren\u2019t eaten by admin? That\u2019s what {hours} hours back looks like.',
      'One automated process. That\u2019s all it takes to change your week when you\u2019re flying solo.',
      'Your hourly rate says your time is worth {rate}. Your admin tasks disagree.',
      '{monthly} a month. That\u2019s not savings. That\u2019s freedom you\u2019re currently giving away.',
      'Every hour on busywork is an hour your competitors are spending on growth.',
      'Start with the one task that makes you groan every Monday. The rest falls into place.',
      'You didn\u2019t start a business to process invoices. Let\u2019s fix that.'
    ],
    team:[
      '{people} people \u00d7 {hours} wasted hours = a problem with a very clear solution.',
      'Your team is spending {hours} hours a month on work that doesn\u2019t need them. What if they didn\u2019t?',
      '{annual} a year. That\u2019s a full hire being spent on tasks a machine handles better.',
      'The fastest-growing teams automate first, hire second. You\u2019re looking at why.',
      'Three workflows. That\u2019s usually all it takes to free up your team\u2019s best hours.',
      'What would your {people} people do with {hours} extra hours a month? That\u2019s the real question.',
      'Teams your size see ROI in month one. That\u2019s not marketing. That\u2019s maths.',
      'You hired smart people. They\u2019re spending {hours} hours on tasks that don\u2019t need a brain.',
      'The gap between drowning in admin and scaling fast is often just three automated workflows.',
      '{monthly} a month. Redirect that into growth and watch what happens.',
      'Your competitors already automated this. The longer you wait, the wider the gap.'
    ],
    business:[
      '{people} people on manual processes is a strategic problem, not just an operational one.',
      '{annual} a year. At your scale, that\u2019s not waste. It\u2019s a competitive blind spot.',
      'Finance, sales, ops. Three departments, six workflows. That\u2019s how Business clients start.',
      'At this size, the cost of not automating is bigger than the cost of automating. By a lot.',
      '{hours} hours of manual work a month across your team. That\u2019s roles, not tasks.',
      'Your competitors who automated last year are already ahead. This is how you close the gap.',
      '{monthly} a month between you and your next growth phase. What\u2019s stopping you?',
      'Most businesses your size discover 6+ automatable processes on the first call.',
      'Your team is doing {hours} hours of work that doesn\u2019t need a human. Let\u2019s change that.',
      'The ROI at your scale pays back in the first billing cycle. That\u2019s not a pitch. It\u2019s the maths.'
    ],
    enterprise:[
      'At this scale, every month without automation costs more than the automation itself.',
      '{annual} a year. That\u2019s not a line item. That\u2019s a strategic lever.',
      'You\u2019re not automating tasks anymore. You\u2019re automating departments.',
      'This is operational redesign territory. The quick wins are long behind you.',
      '{hours} hours a month is structural waste. Automation is how you fix structural.',
      'Enterprise clients automate 10+ workflows in quarter one. The compounding from there is real.',
      '{monthly} a month is a strategic advantage your competitors probably don\u2019t have yet.',
      'At your scale, ROI isn\u2019t hours saved. It\u2019s what your people can finally focus on.',
      'Automation at this level isn\u2019t a tool. It\u2019s infrastructure.'
    ]
  };

  function getNudge(tierName,data){
    var pool=nudges[tierName.toLowerCase()]||nudges.team;
    var idx=Math.floor(Math.random()*pool.length);
    return pool[idx]
      .replace(/\{monthly\}/g,data.monthly).replace(/\{annual\}/g,data.annual)
      .replace(/\{hours\}/g,data.hours).replace(/\{people\}/g,data.people)
      .replace(/\{rate\}/g,data.rate).replace(/\{tier\}/g,data.tier)
      .replace(/\{price\}/g,data.price);
  }

  function calculate(){
    var people=parseInt(sliderPeople.value,10);
    var hours=parseInt(sliderHours.value,10);
    var rate=parseInt(sliderRate.value,10);
    var efficiency=parseInt(sliderEfficiency.value,10)/100;
    var errorCost=parseInt(sliderError.value,10);

    var hoursSavedMonth=people*hours*WEEKS_PER_MONTH*efficiency;
    var monthlySavings=(hoursSavedMonth*rate)+errorCost;
    var annualSavings=monthlySavings*12;
    var hoursSavedYear=hoursSavedMonth*12;

    var tier=getTier(efficiency,monthlySavings);

    valPeople.textContent=people;
    valHours.textContent=hours;
    outTotalHours.textContent='= '+(people*hours)+' hrs/week across your team';
    valRate.textContent='R'+rate;
    valEfficiency.textContent=Math.round(efficiency*100)+'%';
    valError.textContent=formatZAR(errorCost);

    outMonthly.textContent=formatZAR(monthlySavings);
    outAnnual.textContent=formatZAR(annualSavings);
    outHoursMonth.textContent=formatHours(hoursSavedMonth)+' hrs';
    outHoursYear.textContent=formatHours(hoursSavedYear)+' hrs';

    // Always calculate ROI against a reference price
    var refPrice=tier&&tier.price>0?tier.price:(tier&&tier.price===0?TIERS[3].price:TIERS[1].price);
    var roiPct=Math.round(((monthlySavings-refPrice)/refPrice)*100);
    if(roiPct<0)roiPct=0;
    outRoiPct.textContent=roiPct.toLocaleString('en-ZA')+'%';

    if(tier&&tier.price>0){
      var roiMult=Math.round(monthlySavings/tier.price);
      if(roiMult<1)roiMult=1;
      var multText=roiMult>10?'10x+':roiMult+'x';
      outTier.innerHTML=
        'You\u2019d pay us <strong>'+formatZAR(tier.price)+'/mo</strong> for our <strong>'+tier.name+'</strong> plan.<br>'+
        'You\u2019d save <strong>'+formatZAR(monthlySavings)+'/mo</strong>. That\u2019s <span class="roi-multiplier">'+multText+'</span> your investment back.';
    }else if(tier&&tier.price===0){
      outTier.innerHTML=
        'At this scale, our <strong>Enterprise</strong> plan is the right fit.<br>'+
        'You\u2019d save <strong>'+formatZAR(monthlySavings)+'/mo</strong>. We\u2019ll scope pricing to your needs.';
    }else{
      outTier.innerHTML=
        'Start with one quick win. Even small automations compound over time.<br>'+
        '<strong>'+formatHours(hoursSavedMonth)+' hours</strong> back is still <strong>'+formatHours(hoursSavedMonth)+' hours</strong> you\u2019re not wasting.';
    }

    outBenchmark.textContent=getNudge(tier?tier.name:'solo',{
      monthly:formatZAR(monthlySavings),annual:formatZAR(annualSavings),
      hours:formatHours(hoursSavedMonth),people:people.toString(),
      rate:formatZAR(rate),tier:tier?tier.name:'Solo',
      price:(tier&&tier.price>0)?formatZAR(tier.price):'Custom'
    });

    if(efficiency>=0.80){
      outEffNote.textContent='Reaching '+Math.round(efficiency*100)+'% automation typically requires additional workflows beyond the base plan.';
      outEffNote.style.display='block';
    }else{
      outEffNote.style.display='none';
    }

    updateSliderFill(sliderPeople);
    updateSliderFill(sliderHours);
    updateSliderFill(sliderRate);
    updateSliderFill(sliderEfficiency);
    updateSliderFill(sliderError);

    // Highlight matching pricing card
    highlightPricingCard(tier?tier.name:'Team');

    // Update pricing banner after calculator interaction
    if(calcTouched&&pricingBannerText&&pricingBanner){
      var tierName=tier?tier.name:'Team';
      pricingBannerText.textContent='Based on your numbers, we recommend the '+tierName+' plan. First month at 50%.';
    }

    // Update ROI CTA link with results
    var ctaLink=document.getElementById('roi-cta-link');
    if(ctaLink){
      var roiMsg='I used the ROI calculator and here are my results:\n\n'+
        'Monthly savings: '+formatZAR(monthlySavings)+'\n'+
        'Annual savings: '+formatZAR(annualSavings)+'\n'+
        'Hours back: '+formatHours(hoursSavedMonth)+'/month\n'+
        'Recommended plan: '+(tier?tier.name:'Solo');
      ctaLink.href='contact.html?roi='+encodeURIComponent(roiMsg);
    }
  }

  function highlightPricingCard(tierName){
    var cards=document.querySelectorAll('.pricing-card');
    cards.forEach(function(card){
      var cardTier=card.getAttribute('data-tier');
      if(cardTier===tierName){
        card.classList.add('pricing-popular');
      }else{
        card.classList.remove('pricing-popular');
      }
    });
  }

  function onSliderInput(){calcTouched=true;calculate();}
  sliderPeople.addEventListener('input',onSliderInput);
  sliderHours.addEventListener('input',onSliderInput);
  sliderRate.addEventListener('input',onSliderInput);
  sliderEfficiency.addEventListener('input',onSliderInput);
  sliderError.addEventListener('input',onSliderInput);

  // Info icon click/touch handler (works for both slider tooltips and card tooltips)
  var activeTooltip=null;
  function dismissTooltip(){
    if(activeTooltip){activeTooltip.classList.remove('tooltip-visible');activeTooltip=null}
  }
  function toggleTooltip(icon,e){
    e.preventDefault();
    e.stopPropagation();
    var tip=icon.parentElement.querySelector('.tooltip, .card-tooltip');
    if(!tip)return;
    if(activeTooltip&&activeTooltip!==tip)dismissTooltip();
    if(tip.classList.contains('tooltip-visible')){tip.classList.remove('tooltip-visible');activeTooltip=null}
    else{tip.classList.add('tooltip-visible');activeTooltip=tip}
  }
  roiContainer.addEventListener('click',function(e){
    var icon=e.target.closest('.info-icon');
    if(icon){toggleTooltip(icon,e);return}
    dismissTooltip();
  });
  roiContainer.addEventListener('touchstart',function(e){
    var icon=e.target.closest('.info-icon');
    if(icon){toggleTooltip(icon,e);return}
    dismissTooltip();
  },{passive:false});
  window.addEventListener('scroll',function(){dismissTooltip()},{passive:true});

  // Share
  if(btnShare){
    btnShare.addEventListener('click',function(){
      var people=parseInt(sliderPeople.value,10);
      var hours=parseInt(sliderHours.value,10);
      var rate=parseInt(sliderRate.value,10);
      var efficiency=parseInt(sliderEfficiency.value,10)/100;
      var errorCost=parseInt(sliderError.value,10);
      var hoursSavedMonth=people*hours*WEEKS_PER_MONTH*efficiency;
      var monthlySavings=(hoursSavedMonth*rate)+errorCost;
      var annualSavings=monthlySavings*12;
      var shareText=
        '\uD83D\uDEA8 If you run a business in SA, you *NEED* to see this... \uD83D\uDC40\n\n'+
        '\uD83E\uDD2F I\'m losing *'+formatZAR(monthlySavings)+' p/month* to tasks a machine should be doing.\n\n'+
        '\uD83D\uDCC8 That\'s *'+formatZAR(annualSavings)+' p/year*. Gone. Poof. \uD83D\uDCA8\n\n'+
        '\u23F1\uFE0F *'+formatHours(hoursSavedMonth)+' hours* every month on stuff nobody signed up to do.\n\n'+
        '\uD83D\uDD25 Don\'t waste time. \u23F0 30 seconds to find out yours..\n\uD83D\uDC49 https://doqix.co.za/#roi-calculator';
      if(navigator.share){navigator.share({title:'My Automation Savings',text:shareText}).catch(function(){});return}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(shareText).then(showCopied,fallbackCopy)}
      else{fallbackCopy()}
      function fallbackCopy(){var ta=document.createElement('textarea');ta.value=shareText;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');showCopied()}catch(e){}document.body.removeChild(ta)}
      function showCopied(){btnShare.textContent='Copied to clipboard!';btnShare.classList.add('copied');setTimeout(function(){btnShare.textContent='Share Your Results';btnShare.classList.remove('copied')},2000)}
    });
  }

  calculate();
})();
