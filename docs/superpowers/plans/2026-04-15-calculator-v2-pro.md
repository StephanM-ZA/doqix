# Calculator V2 Pro — Phase 2A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Do.Qix ROI Calculator V2 mathematically unbreakable, fully configurable from admin (every label, every template, every output), and currency/locale-agnostic — the most complete WordPress calculator plugin on the market.

**Architecture:** Extends the existing preset-based settings system. All new fields are preset-level (so different presets can have different labels/templates). Currency settings are global. Mathematical hardening is in the JS calculation engine. No new PHP files — everything extends existing classes.

**Tech Stack:** PHP 7.4+, vanilla JS (ES5), WordPress Settings API, CSS custom properties

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `assets/doqix-roi-calculator-v2/doqix-roi-calculator.php` | Modify | New defaults for labels, templates, toggles, currency |
| `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` | Modify | New admin sections: Labels, Templates, Toggles, Currency |
| `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-frontend.php` | Modify | Use configurable labels in HTML, pass all config to JS |
| `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-calculator.js` | Modify | Math hardening, configurable templates, generic currency formatter |
| `assets/doqix-roi-calculator-v2/assets/css/doqix-roi-calculator.css` | No change | Already fully variable-driven from Phase 1 |

---

## Task 1: Mathematical Hardening (JS)

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-calculator.js`

- [ ] **Step 1: Add safe math helper functions at the top of the IIFE**

After the `var config = ...` line, before any other code:

```javascript
/* ── Safe math helpers ── */
var MAX_SAFE = 9007199254740991; // Number.MAX_SAFE_INTEGER

function safeFloat(val, fallback) {
    var n = parseFloat(val);
    return isFinite(n) ? n : (fallback || 0);
}

function safeProduct(arr) {
    if (arr.length === 0) return 1;
    var result = 1;
    for (var i = 0; i < arr.length; i++) {
        result *= arr[i];
        if (!isFinite(result) || result > MAX_SAFE) return MAX_SAFE;
    }
    return Math.max(0, result);
}

function safeSum(arr) {
    var result = 0;
    for (var i = 0; i < arr.length; i++) {
        result += arr[i];
        if (!isFinite(result) || result > MAX_SAFE) return MAX_SAFE;
    }
    return Math.max(0, result);
}

function safeDivide(a, b) {
    if (b === 0 || !isFinite(a) || !isFinite(b)) return 0;
    var result = a / b;
    return isFinite(result) ? result : 0;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
```

- [ ] **Step 2: Replace raw parseFloat/math in calculate()**

In the `calculate()` function, replace:

```javascript
// BEFORE:
var rawVal = parseFloat(el.value);

// AFTER:
var rawVal = safeFloat(el.value, sCfg.default || 0);
```

Replace the product/sum calculations:

```javascript
// BEFORE:
var multiplierProduct = 1;
for (var mi = 0; mi < multipliers.length; mi++) {
    multiplierProduct *= multipliers[mi];
}
// ... similar for efficiencyProduct, rateSum, flatSum

// AFTER:
var multiplierProduct = safeProduct(multipliers);
var efficiencyProduct = safeProduct(efficiencies);
var rateSum = safeSum(rates);
var flatSum = safeSum(flatMonthlys);
```

- [ ] **Step 3: Guard the final calculations**

```javascript
var hoursSavedMonth = clamp(multiplierProduct * WEEKS_PER_MONTH * efficiencyProduct, 0, MAX_SAFE);
var monthlySavings  = clamp((hoursSavedMonth * rateSum) + flatSum, 0, MAX_SAFE);
var annualSavings   = clamp(monthlySavings * 12, 0, MAX_SAFE);
var hoursSavedYear  = clamp(hoursSavedMonth * 12, 0, MAX_SAFE);
```

- [ ] **Step 4: Guard tier ROI calculations**

In the `getTier()` function:

```javascript
// BEFORE:
var roi = ((monthlySavings - matched.price) / matched.price) * 100;

// AFTER:
var roi = safeDivide(monthlySavings - matched.price, matched.price) * 100;
```

And in the output section:

```javascript
// BEFORE:
var roiPct = Math.round(((monthlySavings - tier.price) / tier.price) * 100);
var roiMultiplier = Math.round(monthlySavings / tier.price);

// AFTER:
var roiPct = Math.round(safeDivide(monthlySavings - tier.price, tier.price) * 100);
var roiMultiplier = Math.round(safeDivide(monthlySavings, tier.price));
```

- [ ] **Step 5: Guard the share recalculation**

The share button click handler duplicates the calculation. Apply the same safe math:

```javascript
// In share click handler:
var multiplierProduct = safeProduct(shareMultipliers);
var efficiencyProduct = safeProduct(shareEfficiencies);
// etc.
```

Where `shareMultipliers` etc. are local arrays built the same way as in `calculate()`.

- [ ] **Step 6: Commit**

```
git commit -m "fix(roi-calculator): mathematical hardening — NaN/Infinity/overflow guards"
```

---

## Task 2: Admin Slider Validation (PHP)

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` — `sanitize_settings()` method

- [ ] **Step 1: Add slider config validation in the sanitization**

Find where sliders are sanitized. After the existing sanitization, add:

```php
// Slider config validation
if ( ! empty( $new['sliders'] ) && is_array( $new['sliders'] ) ) {
    foreach ( $new['sliders'] as $i => &$slider ) {
        $slider['min']     = floatval( $slider['min'] ?? 0 );
        $slider['max']     = floatval( $slider['max'] ?? 100 );
        $slider['step']    = max( 0.01, floatval( $slider['step'] ?? 1 ) );
        $slider['default'] = floatval( $slider['default'] ?? $slider['min'] );

        // Enforce min < max (swap if reversed)
        if ( $slider['min'] >= $slider['max'] ) {
            $temp = $slider['min'];
            $slider['min'] = $slider['max'];
            $slider['max'] = $temp;
            // If they were equal, push max up by 1
            if ( $slider['min'] >= $slider['max'] ) {
                $slider['max'] = $slider['min'] + 1;
            }
        }

        // Clamp default within range
        $slider['default'] = max( $slider['min'], min( $slider['max'], $slider['default'] ) );

        // Enforce non-negative for multiplier/rate roles
        if ( in_array( $slider['role'] ?? '', array( 'multiplier', 'rate' ), true ) ) {
            $slider['min'] = max( 0, $slider['min'] );
            $slider['default'] = max( 0, $slider['default'] );
        }

        // Enforce 0-100 range for efficiency role
        if ( ( $slider['role'] ?? '' ) === 'efficiency' ) {
            $slider['min'] = max( 0, $slider['min'] );
            $slider['max'] = min( 100, $slider['max'] );
            $slider['default'] = max( $slider['min'], min( $slider['max'], $slider['default'] ) );
        }
    }
    unset( $slider );
}
```

- [ ] **Step 2: Add admin notice if no rate-role sliders exist**

After sanitization completes, check for formula completeness:

```php
$has_rate = false;
foreach ( $new['sliders'] ?? array() as $s ) {
    if ( ( $s['role'] ?? '' ) === 'rate' ) {
        $has_rate = true;
        break;
    }
}
if ( ! $has_rate ) {
    add_settings_error(
        'doqix_roi_v2_settings',
        'no_rate_slider',
        __( 'No slider with the "Hourly rate" role found. Savings will only include flat monthly amounts.', 'doqix-roi-calculator' ),
        'warning'
    );
}
```

- [ ] **Step 3: Commit**

```
git commit -m "fix(roi-calculator): admin validation — slider min/max/step/default enforcement"
```

---

## Task 3: Currency & Locale System (Global)

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/doqix-roi-calculator.php` — add currency defaults
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` — currency fields in Global tab
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-frontend.php` — pass currency config to JS
- Modify: `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-calculator.js` — generic currency formatter

- [ ] **Step 1: Add currency defaults to the global settings**

In `doqix-roi-calculator.php`, in the defaults function, add to the top-level (NOT preset-level):

```php
'currency' => array(
    'symbol'              => 'R',
    'position'            => 'before',   // 'before' or 'after'
    'thousand_separator'  => ',',
    'decimal_separator'   => '.',
    'decimal_places'      => 0,
    'abbreviate'          => 1,          // 1 = use k/M for large numbers
    'abbreviate_threshold' => 100000,
),
```

- [ ] **Step 2: Add Currency section to Global admin tab**

In `render_global_tab()`, add a Currency fieldset before the Tiers section:

```php
<h2><?php esc_html_e( 'Currency & Number Format', 'doqix-roi-calculator' ); ?></h2>
<table class="form-table">
    <tr>
        <th scope="row"><?php esc_html_e( 'Currency Symbol', 'doqix-roi-calculator' ); ?></th>
        <td>
            <input type="text" name="<?php echo esc_attr( "{$opt}[currency][symbol]" ); ?>"
                   value="<?php echo esc_attr( $s['currency']['symbol'] ?? 'R' ); ?>"
                   class="small-text" style="width:60px">
            <p class="description"><?php esc_html_e( 'e.g. R, $, €, £', 'doqix-roi-calculator' ); ?></p>
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Symbol Position', 'doqix-roi-calculator' ); ?></th>
        <td>
            <label><input type="radio" name="<?php echo esc_attr( "{$opt}[currency][position]" ); ?>"
                          value="before" <?php checked( $s['currency']['position'] ?? 'before', 'before' ); ?>>
                <?php esc_html_e( 'Before (R1,000)', 'doqix-roi-calculator' ); ?></label><br>
            <label><input type="radio" name="<?php echo esc_attr( "{$opt}[currency][position]" ); ?>"
                          value="after" <?php checked( $s['currency']['position'] ?? 'before', 'after' ); ?>>
                <?php esc_html_e( 'After (1,000€)', 'doqix-roi-calculator' ); ?></label>
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Thousand Separator', 'doqix-roi-calculator' ); ?></th>
        <td>
            <select name="<?php echo esc_attr( "{$opt}[currency][thousand_separator]" ); ?>">
                <option value="," <?php selected( $s['currency']['thousand_separator'] ?? ',', ',' ); ?>>Comma (1,000)</option>
                <option value="." <?php selected( $s['currency']['thousand_separator'] ?? ',', '.' ); ?>>Period (1.000)</option>
                <option value=" " <?php selected( $s['currency']['thousand_separator'] ?? ',', ' ' ); ?>>Space (1 000)</option>
                <option value="" <?php selected( $s['currency']['thousand_separator'] ?? ',', '' ); ?>>None (1000)</option>
            </select>
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Decimal Places', 'doqix-roi-calculator' ); ?></th>
        <td>
            <input type="number" name="<?php echo esc_attr( "{$opt}[currency][decimal_places]" ); ?>"
                   value="<?php echo esc_attr( $s['currency']['decimal_places'] ?? 0 ); ?>"
                   min="0" max="2" class="small-text">
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Large Number Format', 'doqix-roi-calculator' ); ?></th>
        <td>
            <label><input type="checkbox" name="<?php echo esc_attr( "{$opt}[currency][abbreviate]" ); ?>"
                          value="1" <?php checked( $s['currency']['abbreviate'] ?? 1, 1 ); ?>>
                <?php esc_html_e( 'Abbreviate large numbers (100k, 1.2M)', 'doqix-roi-calculator' ); ?></label>
            <br>
            <label><?php esc_html_e( 'Abbreviate above:', 'doqix-roi-calculator' ); ?>
                <input type="number" name="<?php echo esc_attr( "{$opt}[currency][abbreviate_threshold]" ); ?>"
                       value="<?php echo esc_attr( $s['currency']['abbreviate_threshold'] ?? 100000 ); ?>"
                       min="1000" step="1000" class="small-text">
            </label>
        </td>
    </tr>
</table>
```

- [ ] **Step 3: Sanitize currency settings**

In `sanitize_settings()`:

```php
if ( isset( $new['currency'] ) ) {
    $new['currency']['symbol']              = sanitize_text_field( $new['currency']['symbol'] ?? 'R' );
    $new['currency']['position']            = in_array( $new['currency']['position'] ?? 'before', array( 'before', 'after' ), true ) ? $new['currency']['position'] : 'before';
    $new['currency']['thousand_separator']  = in_array( $new['currency']['thousand_separator'] ?? ',', array( ',', '.', ' ', '' ), true ) ? $new['currency']['thousand_separator'] : ',';
    $new['currency']['decimal_separator']   = in_array( $new['currency']['decimal_separator'] ?? '.', array( '.', ',' ), true ) ? $new['currency']['decimal_separator'] : '.';
    $new['currency']['decimal_places']      = max( 0, min( 2, intval( $new['currency']['decimal_places'] ?? 0 ) ) );
    $new['currency']['abbreviate']          = ! empty( $new['currency']['abbreviate'] ) ? 1 : 0;
    $new['currency']['abbreviate_threshold'] = max( 1000, intval( $new['currency']['abbreviate_threshold'] ?? 100000 ) );
}
```

- [ ] **Step 4: Pass currency config to frontend JS**

In `class-doqix-roi-frontend.php`, in `build_config()`, add:

```php
'currency' => array(
    'symbol'    => $settings['currency']['symbol'] ?? 'R',
    'position'  => $settings['currency']['position'] ?? 'before',
    'thousands' => $settings['currency']['thousand_separator'] ?? ',',
    'decimal'   => $settings['currency']['decimal_separator'] ?? '.',
    'decimals'  => intval( $settings['currency']['decimal_places'] ?? 0 ),
    'abbreviate' => ! empty( $settings['currency']['abbreviate'] ),
    'abbrevThreshold' => intval( $settings['currency']['abbreviate_threshold'] ?? 100000 ),
),
```

- [ ] **Step 5: Replace hardcoded formatZAR() with generic formatCurrency()**

In `doqix-roi-calculator.js`, replace `formatZAR`:

```javascript
var curr = config.currency || {};
var currSymbol    = curr.symbol || 'R';
var currPosition  = curr.position || 'before';
var currThousands = curr.thousands !== undefined ? curr.thousands : ',';
var currDecimal   = curr.decimal || '.';
var currDecimals  = curr.decimals || 0;
var currAbbrev    = curr.abbreviate !== false;
var currAbbrevAt  = curr.abbrevThreshold || 100000;

function formatCurrency(n) {
    n = Math.round(n * Math.pow(10, currDecimals)) / Math.pow(10, currDecimals);
    if (currAbbrev && Math.abs(n) >= 1000000) {
        var formatted = (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        return currPosition === 'before' ? currSymbol + formatted : formatted + currSymbol;
    }
    if (currAbbrev && Math.abs(n) >= currAbbrevAt) {
        var formatted = Math.round(n / 1000) + 'k';
        return currPosition === 'before' ? currSymbol + formatted : formatted + currSymbol;
    }
    // Full number with separators
    var parts = n.toFixed(currDecimals).split('.');
    var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currThousands);
    var formatted = currDecimals > 0 && parts[1] ? intPart + currDecimal + parts[1] : intPart;
    return currPosition === 'before' ? currSymbol + formatted : formatted + currSymbol;
}
```

Then replace all `formatZAR(` with `formatCurrency(` throughout the file.

- [ ] **Step 6: Update slider value formatting to use currency config**

In `formatSliderValue()`:

```javascript
function formatSliderValue(sliderCfg, rawVal) {
    var val = parseFloat(rawVal);
    if (sliderCfg.format === 'currency') {
        return formatCurrency(val);
    }
    if (sliderCfg.format === 'percentage') {
        return Math.round(val) + '%';
    }
    return (sliderCfg.prefix || '') + Math.round(val) + (sliderCfg.suffix || '');
}
```

- [ ] **Step 7: Commit**

```
git commit -m "feat(roi-calculator): currency & locale system — configurable symbol, position, separators"
```

---

## Task 4: Configurable Labels & Text (Preset-Level)

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/doqix-roi-calculator.php` — new preset defaults
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` — Labels section
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-frontend.php` — use labels in HTML + pass to JS
- Modify: `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-calculator.js` — use configurable templates

- [ ] **Step 1: Add label defaults to preset**

In `doqix_roi_v2_get_preset_defaults()`:

```php
/* Labels */
'label_panel'           => 'Your Team',
'label_hero'            => 'Your Monthly Savings',
'label_annual'          => 'per year',
'label_roi'             => 'return on investment',
'label_hours_month'     => 'back per month',
'label_hours_year'      => 'back per year',
'label_share_btn'       => 'Share your results',
'label_efficiency_note' => 'Reaching {pct}% automation typically requires additional workflows beyond the base plan.',
'label_total_hours'     => '= {hours} hrs/week across your team',

/* Templates (with {placeholder} tokens) */
'template_tier_with_price'  => 'You\'d pay us <strong>{tier_price}/mo</strong> for our <strong>{tier_name}</strong> plan.<br>You\'d save <strong>{monthly}/mo</strong>. That\'s <span class="roi-multiplier">{roi_x}</span> your investment back.',
'template_tier_enterprise'  => 'At this scale, our <strong>{tier_name}</strong> plan is the right fit.<br>You\'d save <strong>{monthly}/mo</strong>. We\'ll scope pricing to your needs.',
'template_tier_no_match'    => 'Start with one quick win — even small automations compound over time.<br><strong>{hours_month} hours</strong> back is still <strong>{hours_month} hours</strong> you\'re not wasting.',
'template_share'            => "💡 Ever wondered what repetitive work actually costs? I just found out:\n\n💰 Monthly: *{monthly}*\n📊 Annual: *{annual}*\n⏱️ Hours saved: *{hours_month}/month*\n\n👉 {share_url}",
```

- [ ] **Step 2: Add Labels & Templates admin section**

In the preset tab rendering, add a new section after "Content" and before "Colors":

```php
<!-- ═══════════════ LABELS & TEMPLATES ═══════════════ -->
<h2><?php esc_html_e( 'Labels & Templates', 'doqix-roi-calculator' ); ?></h2>
<p class="description"><?php esc_html_e( 'Customize all visible text. Use {placeholders} in templates — they are replaced with calculated values.', 'doqix-roi-calculator' ); ?></p>

<table class="form-table">
    <tr>
        <th scope="row"><?php esc_html_e( 'Input Panel Label', 'doqix-roi-calculator' ); ?></th>
        <td><input type="text" name="...[label_panel]" value="..." class="regular-text"></td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Hero Result Label', 'doqix-roi-calculator' ); ?></th>
        <td><input type="text" name="...[label_hero]" value="..." class="regular-text"></td>
    </tr>
    <!-- Result card labels -->
    <tr>
        <th scope="row"><?php esc_html_e( 'Annual Savings Label', 'doqix-roi-calculator' ); ?></th>
        <td><input type="text" name="...[label_annual]" value="..." class="regular-text"></td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'ROI Label', 'doqix-roi-calculator' ); ?></th>
        <td><input type="text" name="...[label_roi]" value="..." class="regular-text"></td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Hours/Month Label', 'doqix-roi-calculator' ); ?></th>
        <td><input type="text" name="...[label_hours_month]" value="..." class="regular-text"></td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Hours/Year Label', 'doqix-roi-calculator' ); ?></th>
        <td><input type="text" name="...[label_hours_year]" value="..." class="regular-text"></td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Share Button Text', 'doqix-roi-calculator' ); ?></th>
        <td><input type="text" name="...[label_share_btn]" value="..." class="regular-text"></td>
    </tr>
</table>

<h3><?php esc_html_e( 'Templates', 'doqix-roi-calculator' ); ?></h3>
<p class="description"><?php esc_html_e( 'Available placeholders: {monthly}, {annual}, {hours_month}, {hours_year}, {roi_pct}, {roi_x}, {tier_name}, {tier_price}, {people}, {rate}, {pct}, {hours}, {share_url}', 'doqix-roi-calculator' ); ?></p>

<table class="form-table">
    <tr>
        <th scope="row"><?php esc_html_e( 'Tier (with price)', 'doqix-roi-calculator' ); ?></th>
        <td>
            <textarea name="...[template_tier_with_price]" rows="3" class="large-text">...</textarea>
            <p class="description"><?php esc_html_e( 'HTML allowed. Shown when a priced tier matches.', 'doqix-roi-calculator' ); ?></p>
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Tier (enterprise/custom)', 'doqix-roi-calculator' ); ?></th>
        <td><textarea name="...[template_tier_enterprise]" rows="3" class="large-text">...</textarea></td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Tier (no match)', 'doqix-roi-calculator' ); ?></th>
        <td><textarea name="...[template_tier_no_match]" rows="3" class="large-text">...</textarea></td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Efficiency Note', 'doqix-roi-calculator' ); ?></th>
        <td>
            <input type="text" name="...[label_efficiency_note]" value="..." class="large-text">
            <p class="description"><?php esc_html_e( '{pct} = current efficiency percentage', 'doqix-roi-calculator' ); ?></p>
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Total Hours Display', 'doqix-roi-calculator' ); ?></th>
        <td>
            <input type="text" name="...[label_total_hours]" value="..." class="regular-text">
            <p class="description"><?php esc_html_e( '{hours} = calculated total hours', 'doqix-roi-calculator' ); ?></p>
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Share Message', 'doqix-roi-calculator' ); ?></th>
        <td>
            <textarea name="...[template_share]" rows="6" class="large-text">...</textarea>
            <p class="description"><?php esc_html_e( 'Plain text with {placeholders}. Newlines preserved. This is what gets shared/copied.', 'doqix-roi-calculator' ); ?></p>
        </td>
    </tr>
</table>
```

- [ ] **Step 3: Use configurable labels in frontend PHP**

In `class-doqix-roi-frontend.php`, replace hardcoded strings:

```php
// BEFORE:
<div class="panel-label"><?php esc_html_e( 'Your Team', 'doqix-roi-calculator' ); ?></div>
// AFTER:
<div class="panel-label"><?php echo esc_html( $preset['label_panel'] ?? 'Your Team' ); ?></div>

// BEFORE:
<div class="hero-label"><?php esc_html_e( 'Your Monthly Savings', 'doqix-roi-calculator' ); ?></div>
// AFTER:
<div class="hero-label"><?php echo esc_html( $preset['label_hero'] ?? 'Your Monthly Savings' ); ?></div>

// Same for all card labels:
// 'per year' → $preset['label_annual']
// 'return on investment' → $preset['label_roi']
// 'back per month' → $preset['label_hours_month']
// 'back per year' → $preset['label_hours_year']
```

- [ ] **Step 4: Pass labels and templates to JS config**

In `build_config()`:

```php
'labels' => array(
    'share_btn'       => $preset['label_share_btn'] ?? 'Share your results',
    'efficiency_note' => $preset['label_efficiency_note'] ?? 'Reaching {pct}% automation typically requires additional workflows beyond the base plan.',
    'total_hours'     => $preset['label_total_hours'] ?? '= {hours} hrs/week across your team',
),
'templates' => array(
    'tier_with_price' => $preset['template_tier_with_price'] ?? '...',
    'tier_enterprise' => $preset['template_tier_enterprise'] ?? '...',
    'tier_no_match'   => $preset['template_tier_no_match'] ?? '...',
    'share'           => $preset['template_share'] ?? '...',
),
```

- [ ] **Step 5: Use configurable templates in JS**

Replace hardcoded strings in `calculate()`:

```javascript
var labels = config.labels || {};
var templates = config.templates || {};

// Total hours display
if (outTotalHours && valsByKey.people !== undefined && valsByKey.hours !== undefined) {
    var totalHrs = Math.round(valsByKey.people * valsByKey.hours);
    outTotalHours.textContent = (labels.total_hours || '= {hours} hrs/week across your team')
        .replace(/\{hours\}/g, totalHrs);
}

// Efficiency note
if (outEfficiencyNote) {
    if (maxEfficiency >= 0.80) {
        outEfficiencyNote.textContent = (labels.efficiency_note || 'Reaching {pct}% automation typically requires additional workflows beyond the base plan.')
            .replace(/\{pct\}/g, Math.round(maxEfficiency * 100));
        outEfficiencyNote.style.display = 'block';
    } else {
        outEfficiencyNote.style.display = 'none';
    }
}

// Tier suggestion — use templates
function fillTemplate(tpl, data) {
    return tpl
        .replace(/\{monthly\}/g, data.monthly || '')
        .replace(/\{annual\}/g, data.annual || '')
        .replace(/\{hours_month\}/g, data.hours_month || '')
        .replace(/\{hours_year\}/g, data.hours_year || '')
        .replace(/\{roi_pct\}/g, data.roi_pct || '')
        .replace(/\{roi_x\}/g, data.roi_x || '')
        .replace(/\{tier_name\}/g, data.tier_name || '')
        .replace(/\{tier_price\}/g, data.tier_price || '')
        .replace(/\{people\}/g, data.people || '')
        .replace(/\{rate\}/g, data.rate || '')
        .replace(/\{share_url\}/g, config.share_url || '');
}

// In the tier output section:
if (tier && tier.price > 0) {
    // ...
    outTier.innerHTML = fillTemplate(templates.tier_with_price || '...', templateData);
} else if (tier && tier.price === 0) {
    outTier.innerHTML = fillTemplate(templates.tier_enterprise || '...', templateData);
} else {
    outTier.innerHTML = fillTemplate(templates.tier_no_match || '...', templateData);
}

// Share message
var shareText = fillTemplate(templates.share || '...', templateData);
```

- [ ] **Step 6: Sanitize label and template fields**

In `sanitize_settings()`, for each preset:

```php
$text_fields = array(
    'label_panel', 'label_hero', 'label_annual', 'label_roi',
    'label_hours_month', 'label_hours_year', 'label_share_btn',
    'label_efficiency_note', 'label_total_hours',
);
foreach ( $text_fields as $f ) {
    if ( isset( $preset[ $f ] ) ) {
        $preset[ $f ] = sanitize_text_field( $preset[ $f ] );
    }
}

// Templates allow limited HTML (strong, br, span with class)
$template_fields = array( 'template_tier_with_price', 'template_tier_enterprise', 'template_tier_no_match' );
$allowed_html = array( 'strong' => array(), 'br' => array(), 'span' => array( 'class' => array() ) );
foreach ( $template_fields as $f ) {
    if ( isset( $preset[ $f ] ) ) {
        $preset[ $f ] = wp_kses( $preset[ $f ], $allowed_html );
    }
}

// Share template is plain text
if ( isset( $preset['template_share'] ) ) {
    $preset['template_share'] = sanitize_textarea_field( $preset['template_share'] );
}
```

- [ ] **Step 7: Commit**

```
git commit -m "feat(roi-calculator): configurable labels & templates — all text admin-editable"
```

---

## Task 5: Show/Hide Section Toggles (Preset-Level)

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/doqix-roi-calculator.php` — toggle defaults
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` — toggle checkboxes
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-frontend.php` — conditional rendering

- [ ] **Step 1: Add toggle defaults to preset**

```php
/* Section visibility */
'show_hero'            => 1,
'show_results'         => 1,
'show_tier'            => 1,
'show_nudge'           => 1,
'show_total_hours'     => 1,
'show_efficiency_note' => 1,
```

(`show_cta` and `show_share` already exist as `cta_enabled` and `share_enabled`.)

- [ ] **Step 2: Add toggle section to admin Display Options**

In the preset tab, extend the existing "Display Options" section:

```php
<h3><?php esc_html_e( 'Section Visibility', 'doqix-roi-calculator' ); ?></h3>
<p class="description"><?php esc_html_e( 'Toggle individual sections of the calculator output.', 'doqix-roi-calculator' ); ?></p>

<table class="form-table">
    <?php
    $toggles = array(
        'show_hero'            => __( 'Hero Result (big savings number)', 'doqix-roi-calculator' ),
        'show_results'         => __( 'Result Cards (annual, ROI, hours)', 'doqix-roi-calculator' ),
        'show_tier'            => __( 'Tier Suggestion', 'doqix-roi-calculator' ),
        'show_nudge'           => __( 'Nudge Quote', 'doqix-roi-calculator' ),
        'show_total_hours'     => __( 'Total Hours Display (below hours slider)', 'doqix-roi-calculator' ),
        'show_efficiency_note' => __( 'Efficiency Note (high automation warning)', 'doqix-roi-calculator' ),
    );
    foreach ( $toggles as $key => $label ) : ?>
    <tr>
        <th scope="row"><?php echo esc_html( $label ); ?></th>
        <td>
            <input type="hidden" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][{$key}]" ); ?>" value="0">
            <label>
                <input type="checkbox" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][{$key}]" ); ?>"
                       value="1" <?php checked( $p[ $key ] ?? 1, 1 ); ?>>
                <?php esc_html_e( 'Visible', 'doqix-roi-calculator' ); ?>
            </label>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
```

- [ ] **Step 3: Wrap frontend HTML sections in conditionals**

In `class-doqix-roi-frontend.php`:

```php
<?php if ( ! empty( $preset['show_hero'] ) ) : ?>
<div class="hero-result">...</div>
<?php endif; ?>

<?php if ( ! empty( $preset['show_results'] ) ) : ?>
<div class="result-cards">...</div>
<?php endif; ?>

<?php if ( ! empty( $preset['show_tier'] ) ) : ?>
<div class="result-card tier-suggestion">...</div>
<?php endif; ?>

<?php if ( ! empty( $preset['show_nudge'] ) ) : ?>
<div class="benchmark" id="out-benchmark"></div>
<?php endif; ?>
```

For total hours and efficiency note — these are already conditionally rendered, but add the toggle check:

```php
<?php if ( 'hours' === $key && $has_people_and_hours && ! empty( $preset['show_total_hours'] ) ) : ?>
<div class="total-hours" id="out-total-hours">...</div>
<?php endif; ?>

<?php if ( 'efficiency' === $slider['role'] && ! empty( $preset['show_efficiency_note'] ) ) : ?>
<div class="efficiency-note" id="out-efficiency-note" style="display:none;"></div>
<?php endif; ?>
```

- [ ] **Step 4: Guard JS against missing elements**

The JS already uses `if (outTier)`, `if (outBenchmark)`, etc. guards before writing to output elements. When a section is hidden, the element won't exist, so the JS gracefully skips it. Verify all output writes are guarded.

- [ ] **Step 5: Commit**

```
git commit -m "feat(roi-calculator): section visibility toggles — show/hide hero, results, tier, nudge"
```

---

## Task 6: Version Bump + updates.json

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/doqix-roi-calculator.php` — bump to v2.3.0
- Modify: `updates.json`

- [ ] **Step 1: Bump version to 2.3.0 (minor — new features)**

Header: `Version: 2.3.0`
Constant: `define( 'DOQIX_ROI_V2_VERSION', '2.3.0' );`

- [ ] **Step 2: Update updates.json**

- [ ] **Step 3: Commit**

```
git commit -m "chore: bump roi-calculator-v2 to v2.3.0, update updates.json"
```

---

## Execution Order

Tasks 1-5 are sequential (each builds on the previous).
Task 6 is the final version bump.

**Recommended:** Execute as a single subagent chain (Task 1 → 2 → 3 → 4 → 5 → 6) since each touches the same files and they build incrementally.
