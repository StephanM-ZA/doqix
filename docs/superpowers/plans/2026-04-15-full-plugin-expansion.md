# Full Plugin Expansion — Carousel v1.3.0 + Calculator v2.2.0

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform both plugins into fully-fledged, professional-grade WordPress plugins with comprehensive admin color/style controls and real-time live preview on every settings tab.

**Architecture:** Both plugins use the same pattern: preset-level settings stored as a single WP option, CSS custom properties injected inline on the wrapper element, and vanilla JS for admin interactions. The carousel already has a live preview card on the Colours tab — we extend that pattern to all tabs and replicate it in the calculator. No external dependencies (no Bootstrap, no jQuery) — everything is self-contained vanilla CSS/JS for WP theme isolation.

**Tech Stack:** PHP 7.4+, vanilla JS (ES5 for WP compat), CSS custom properties, WordPress Settings API

---

## File Map

### Carousel Plugin (v1.2.1 → v1.3.0)

| File | Action | Responsibility |
|------|--------|---------------|
| `assets/doqix-pricing-carousel/doqix-pricing-carousel.php` | Modify | Add new defaults, bump version |
| `assets/doqix-pricing-carousel/includes/class-admin.php` | Modify | New color fields, style controls, expanded preview on all tabs |
| `assets/doqix-pricing-carousel/includes/class-frontend.php` | Modify | Inject new CSS vars, arrow icon rendering |
| `assets/doqix-pricing-carousel/assets/css/frontend.css` | Modify | New CSS variables, arrow/dot/crumb styling |
| `assets/doqix-pricing-carousel/assets/js/frontend.js` | Modify | Read new config for arrow icons, sizes |
| `assets/doqix-pricing-carousel/assets/js/admin.js` | Modify | Preview on all tabs, style control preview |
| `assets/doqix-pricing-carousel/assets/css/admin.css` | Modify | Preview card in all tabs, new control styles |

### Calculator Plugin (v2.1.6 → v2.2.0)

| File | Action | Responsibility |
|------|--------|---------------|
| `assets/doqix-roi-calculator-v2/doqix-roi-calculator.php` | Modify | Add new defaults, bump version |
| `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` | Modify | Replace 2-field colors section with full color panel + live preview |
| `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-frontend.php` | Modify | Inject all new CSS vars |
| `assets/doqix-roi-calculator-v2/assets/css/doqix-roi-calculator.css` | Modify | Consume new CSS variables |
| `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-calculator.js` | Modify | Read --roi-line from CSS var instead of hardcoded |
| `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-admin.js` | Modify | Full live preview JS, color picker sync |
| `assets/doqix-roi-calculator-v2/assets/css/doqix-roi-admin.css` | Create | Admin styles for color grid + preview card |

### Shared

| File | Action |
|------|--------|
| `updates.json` | Modify — bump both versions |

---

## PART A: CAROUSEL PLUGIN v1.3.0

### Task 1: Add New Preset Defaults (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/doqix-pricing-carousel.php:73-171`

- [ ] **Step 1: Add new color default keys to `doqix_pricing_get_preset_defaults()`**

Add these after the existing `color_exc_title` key (line 111):

```php
'color_exc_title'      => '',

/* Navigation: dots */
'color_dot_bg'            => '',
'color_dot_active_bg'     => '',

/* Navigation: breadcrumbs */
'color_crumb_bg'          => '',
'color_crumb_text'        => '',
'color_crumb_active_bg'   => '',
'color_crumb_active_text' => '',

/* Navigation: arrow hover icon */
'color_arrow_hover_color' => '',

/* Card extras */
'color_card_border'       => '',
'color_price_text'        => '',
'color_subtitle_text'     => '',
'color_body_text'         => '',
'color_featured_border'   => '',

/* Billing toggle */
'color_toggle_bg'         => '',
'color_toggle_active_bg'  => '',

/* Style controls */
'arrow_size'              => 'medium',
'arrow_shape'             => 'circle',
'arrow_icon'              => 'chevron',
'dot_size'                => 'medium',
'card_border_radius'      => 12,
'card_shadow'             => 'subtle',
'card_gap'                => 24,
'featured_border_width'   => 2,
```

- [ ] **Step 2: Bump version**

Update line 19: `Version: 1.3.0`
Update line 20: `define( 'DOQIX_PRICING_VERSION', '1.3.0' );`

- [ ] **Step 3: Verify defaults load**

The existing deep-merge migration in the activation hook + `array_replace_recursive` ensures new keys get added to existing presets with empty/default values. No separate migration function needed.

---

### Task 2: Add New Color Fields to Admin Colours Tab (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php:878-965`

- [ ] **Step 1: Expand the `$colour_fields` array in `render_colours_tab()`**

Replace the existing `$colour_fields` array (lines 881-895) with a grouped version:

```php
$colour_groups = array(
    __( 'Card', 'doqix-pricing-carousel' ) => array(
        'color_header_bg'       => array( __( 'Header Background', 'doqix-pricing-carousel' ), '#0886B5' ),
        'color_header_text'     => array( __( 'Header Text', 'doqix-pricing-carousel' ), '#ffffff' ),
        'color_card_bg'         => array( __( 'Card Background', 'doqix-pricing-carousel' ), '#f9fcfd' ),
        'color_card_border'     => array( __( 'Card Border', 'doqix-pricing-carousel' ), '#e0e0e0' ),
        'color_accent'          => array( __( 'Accent Colour', 'doqix-pricing-carousel' ), '#0886B5' ),
        'color_price_text'      => array( __( 'Price Text', 'doqix-pricing-carousel' ), '#ffffff' ),
        'color_subtitle_text'   => array( __( 'Subtitle Text', 'doqix-pricing-carousel' ), '#ffffff' ),
        'color_body_text'       => array( __( 'Body Text', 'doqix-pricing-carousel' ), '#1d2327' ),
        'color_featured_border' => array( __( 'Featured Border', 'doqix-pricing-carousel' ), '#0886B5' ),
    ),
    __( 'CTA Button', 'doqix-pricing-carousel' ) => array(
        'color_cta_bg'          => array( __( 'Background', 'doqix-pricing-carousel' ), '#0886B5' ),
        'color_cta_text'        => array( __( 'Text', 'doqix-pricing-carousel' ), '#ffffff' ),
        'color_cta_hover_bg'    => array( __( 'Hover Background', 'doqix-pricing-carousel' ), '#076d94' ),
        'color_cta_hover_text'  => array( __( 'Hover Text', 'doqix-pricing-carousel' ), '#ffffff' ),
    ),
    __( 'Badge', 'doqix-pricing-carousel' ) => array(
        'color_badge_bg'        => array( __( 'Background', 'doqix-pricing-carousel' ), '#ff9500' ),
        'color_badge_text'      => array( __( 'Text', 'doqix-pricing-carousel' ), '#ffffff' ),
    ),
    __( 'Features & Excludes', 'doqix-pricing-carousel' ) => array(
        'color_feat_text'       => array( __( 'Features Text', 'doqix-pricing-carousel' ), '#1d2327' ),
        'color_feat_check'      => array( __( 'Checkmark', 'doqix-pricing-carousel' ), '#0886B5' ),
        'color_exc_text'        => array( __( 'Excludes Text', 'doqix-pricing-carousel' ), '#999999' ),
        'color_exc_title'       => array( __( 'Excludes Title', 'doqix-pricing-carousel' ), '#666666' ),
    ),
    __( 'Navigation: Arrows', 'doqix-pricing-carousel' ) => array(
        'color_arrow_bg'          => array( __( 'Background', 'doqix-pricing-carousel' ), '#ffffff' ),
        'color_arrow_color'       => array( __( 'Icon', 'doqix-pricing-carousel' ), '#555555' ),
        'color_arrow_hover_bg'    => array( __( 'Hover Background', 'doqix-pricing-carousel' ), '#ffffff' ),
        'color_arrow_hover_color' => array( __( 'Hover Icon', 'doqix-pricing-carousel' ), '#333333' ),
    ),
    __( 'Navigation: Dots', 'doqix-pricing-carousel' ) => array(
        'color_dot_bg'          => array( __( 'Inactive', 'doqix-pricing-carousel' ), '#cccccc' ),
        'color_dot_active_bg'   => array( __( 'Active', 'doqix-pricing-carousel' ), '#0886B5' ),
    ),
    __( 'Navigation: Breadcrumbs', 'doqix-pricing-carousel' ) => array(
        'color_crumb_bg'          => array( __( 'Inactive Background', 'doqix-pricing-carousel' ), '#f0f0f0' ),
        'color_crumb_text'        => array( __( 'Inactive Text', 'doqix-pricing-carousel' ), '#aaaaaa' ),
        'color_crumb_active_bg'   => array( __( 'Active Background', 'doqix-pricing-carousel' ), '#0886B5' ),
        'color_crumb_active_text' => array( __( 'Active Text', 'doqix-pricing-carousel' ), '#ffffff' ),
    ),
    __( 'Billing Toggle', 'doqix-pricing-carousel' ) => array(
        'color_toggle_bg'        => array( __( 'Inactive Track', 'doqix-pricing-carousel' ), '#cccccc' ),
        'color_toggle_active_bg' => array( __( 'Active Track', 'doqix-pricing-carousel' ), '#0886B5' ),
    ),
);
```

- [ ] **Step 2: Render grouped color fields with section headers**

Replace the existing flat loop (lines 906-919) with grouped rendering:

```php
<div class="doqix-colours-pickers">
    <?php foreach ( $colour_groups as $group_label => $fields ) : ?>
        <h4 class="doqix-color-group-label"><?php echo esc_html( $group_label ); ?></h4>
        <div class="doqix-color-grid">
            <?php foreach ( $fields as $key => $meta ) :
                $label          = $meta[0];
                $visual_default = $meta[1];
                $var_suffix     = str_replace( '_', '-', str_replace( 'color_', '', $key ) );
                $data_var       = '--pricing-' . $var_suffix;
                $this->render_color_field(
                    $base . '[' . $key . ']',
                    $label,
                    $preset[ $key ] ?? '',
                    $data_var,
                    $visual_default
                );
            endforeach; ?>
        </div>
    <?php endforeach; ?>
</div>
```

- [ ] **Step 3: Move arrow colour pickers OUT of carousel tab**

Remove the 3 arrow colour pickers from `render_carousel_tab()` (approx lines 790-797) — they are now in the Colours tab under "Navigation: Arrows". Leave a note comment:

```php
<!-- Arrow colours moved to Colours tab -->
```

---

### Task 3: Add Style Controls to Carousel Tab (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php` — `render_carousel_tab()` method

- [ ] **Step 1: Add Arrow Style controls section**

After the existing nav_style radio cards, add an "Arrow Appearance" fieldset:

```php
<!-- ═══ Arrow Appearance ═══ -->
<fieldset class="doqix-fieldset">
    <legend><?php esc_html_e( 'Arrow Appearance', 'doqix-pricing-carousel' ); ?></legend>
    <div class="doqix-field-grid">
        <div class="doqix-field">
            <label><?php esc_html_e( 'Size', 'doqix-pricing-carousel' ); ?></label>
            <div class="doqix-radio-pills">
                <?php foreach ( array( 'small' => 'S', 'medium' => 'M', 'large' => 'L' ) as $val => $label ) : ?>
                <label class="doqix-pill <?php echo ( $preset['arrow_size'] ?? 'medium' ) === $val ? 'active' : ''; ?>">
                    <input type="radio" name="<?php echo esc_attr( $base . '[arrow_size]' ); ?>"
                           value="<?php echo esc_attr( $val ); ?>"
                           <?php checked( $preset['arrow_size'] ?? 'medium', $val ); ?>>
                    <?php echo esc_html( $label ); ?>
                </label>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="doqix-field">
            <label><?php esc_html_e( 'Shape', 'doqix-pricing-carousel' ); ?></label>
            <div class="doqix-radio-pills">
                <?php foreach ( array( 'circle' => '&#9679;', 'rounded' => '&#9644;', 'square' => '&#9632;' ) as $val => $icon ) : ?>
                <label class="doqix-pill <?php echo ( $preset['arrow_shape'] ?? 'circle' ) === $val ? 'active' : ''; ?>">
                    <input type="radio" name="<?php echo esc_attr( $base . '[arrow_shape]' ); ?>"
                           value="<?php echo esc_attr( $val ); ?>"
                           <?php checked( $preset['arrow_shape'] ?? 'circle', $val ); ?>>
                    <?php echo $icon; ?>
                </label>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="doqix-field">
            <label><?php esc_html_e( 'Icon', 'doqix-pricing-carousel' ); ?></label>
            <div class="doqix-radio-pills">
                <?php foreach ( array( 'chevron' => '&#x2039; &#x203A;', 'arrow' => '&#x2190; &#x2192;', 'caret' => '&#x25C0; &#x25B6;' ) as $val => $icon ) : ?>
                <label class="doqix-pill <?php echo ( $preset['arrow_icon'] ?? 'chevron' ) === $val ? 'active' : ''; ?>">
                    <input type="radio" name="<?php echo esc_attr( $base . '[arrow_icon]' ); ?>"
                           value="<?php echo esc_attr( $val ); ?>"
                           <?php checked( $preset['arrow_icon'] ?? 'chevron', $val ); ?>>
                    <?php echo $icon; ?>
                </label>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</fieldset>
```

- [ ] **Step 2: Add Dot Size control**

```php
<div class="doqix-field">
    <label><?php esc_html_e( 'Dot Size', 'doqix-pricing-carousel' ); ?></label>
    <div class="doqix-radio-pills">
        <?php foreach ( array( 'small' => 'S', 'medium' => 'M', 'large' => 'L' ) as $val => $label ) : ?>
        <label class="doqix-pill <?php echo ( $preset['dot_size'] ?? 'medium' ) === $val ? 'active' : ''; ?>">
            <input type="radio" name="<?php echo esc_attr( $base . '[dot_size]' ); ?>"
                   value="<?php echo esc_attr( $val ); ?>"
                   <?php checked( $preset['dot_size'] ?? 'medium', $val ); ?>>
            <?php echo esc_html( $label ); ?>
        </label>
        <?php endforeach; ?>
    </div>
</div>
```

- [ ] **Step 3: Add Card Style controls section**

```php
<fieldset class="doqix-fieldset">
    <legend><?php esc_html_e( 'Card Style', 'doqix-pricing-carousel' ); ?></legend>
    <div class="doqix-field-grid">
        <div class="doqix-field">
            <label for="<?php echo esc_attr( $base . '[card_border_radius]' ); ?>">
                <?php esc_html_e( 'Border Radius (px)', 'doqix-pricing-carousel' ); ?>
            </label>
            <input type="number" name="<?php echo esc_attr( $base . '[card_border_radius]' ); ?>"
                   value="<?php echo esc_attr( $preset['card_border_radius'] ?? 12 ); ?>"
                   min="0" max="30" class="small-text">
        </div>
        <div class="doqix-field">
            <label><?php esc_html_e( 'Shadow', 'doqix-pricing-carousel' ); ?></label>
            <div class="doqix-radio-pills">
                <?php foreach ( array( 'none' => 'None', 'subtle' => 'Subtle', 'medium' => 'Medium', 'strong' => 'Strong' ) as $val => $label ) : ?>
                <label class="doqix-pill <?php echo ( $preset['card_shadow'] ?? 'subtle' ) === $val ? 'active' : ''; ?>">
                    <input type="radio" name="<?php echo esc_attr( $base . '[card_shadow]' ); ?>"
                           value="<?php echo esc_attr( $val ); ?>"
                           <?php checked( $preset['card_shadow'] ?? 'subtle', $val ); ?>>
                    <?php echo esc_html( $label ); ?>
                </label>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="doqix-field">
            <label for="<?php echo esc_attr( $base . '[card_gap]' ); ?>">
                <?php esc_html_e( 'Card Gap (px)', 'doqix-pricing-carousel' ); ?>
            </label>
            <input type="number" name="<?php echo esc_attr( $base . '[card_gap]' ); ?>"
                   value="<?php echo esc_attr( $preset['card_gap'] ?? 24 ); ?>"
                   min="0" max="60" step="4" class="small-text">
        </div>
        <div class="doqix-field">
            <label for="<?php echo esc_attr( $base . '[featured_border_width]' ); ?>">
                <?php esc_html_e( 'Featured Border Width (px)', 'doqix-pricing-carousel' ); ?>
            </label>
            <input type="number" name="<?php echo esc_attr( $base . '[featured_border_width]' ); ?>"
                   value="<?php echo esc_attr( $preset['featured_border_width'] ?? 2 ); ?>"
                   min="0" max="6" class="small-text">
        </div>
    </div>
</fieldset>
```

---

### Task 4: Update Sanitization (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php` — `sanitize_settings()` method

- [ ] **Step 1: Add new color keys to the sanitization whitelist**

Find the existing color key sanitization loop and add these keys:

```php
$color_keys = array(
    // existing 17...
    'color_header_bg', 'color_header_text', 'color_accent', 'color_card_bg',
    'color_cta_bg', 'color_cta_text', 'color_cta_hover_bg', 'color_cta_hover_text',
    'color_arrow_bg', 'color_arrow_color', 'color_arrow_hover_bg',
    'color_badge_bg', 'color_badge_text',
    'color_feat_text', 'color_feat_check', 'color_exc_text', 'color_exc_title',
    // new 15
    'color_dot_bg', 'color_dot_active_bg',
    'color_crumb_bg', 'color_crumb_text', 'color_crumb_active_bg', 'color_crumb_active_text',
    'color_arrow_hover_color',
    'color_card_border', 'color_price_text', 'color_subtitle_text', 'color_body_text',
    'color_featured_border',
    'color_toggle_bg', 'color_toggle_active_bg',
);
```

- [ ] **Step 2: Add style control sanitization**

After the color sanitization, add:

```php
// Style controls
$preset['arrow_size']  = in_array( $preset['arrow_size'] ?? 'medium', array( 'small', 'medium', 'large' ), true ) ? $preset['arrow_size'] : 'medium';
$preset['arrow_shape'] = in_array( $preset['arrow_shape'] ?? 'circle', array( 'circle', 'rounded', 'square' ), true ) ? $preset['arrow_shape'] : 'circle';
$preset['arrow_icon']  = in_array( $preset['arrow_icon'] ?? 'chevron', array( 'chevron', 'arrow', 'caret' ), true ) ? $preset['arrow_icon'] : 'chevron';
$preset['dot_size']    = in_array( $preset['dot_size'] ?? 'medium', array( 'small', 'medium', 'large' ), true ) ? $preset['dot_size'] : 'medium';
$preset['card_shadow'] = in_array( $preset['card_shadow'] ?? 'subtle', array( 'none', 'subtle', 'medium', 'strong' ), true ) ? $preset['card_shadow'] : 'subtle';
$preset['card_border_radius']   = max( 0, min( 30, intval( $preset['card_border_radius'] ?? 12 ) ) );
$preset['card_gap']             = max( 0, min( 60, intval( $preset['card_gap'] ?? 24 ) ) );
$preset['featured_border_width'] = max( 0, min( 6, intval( $preset['featured_border_width'] ?? 2 ) ) );
```

---

### Task 5: Inject New CSS Variables on Frontend (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-frontend.php:154-189`

- [ ] **Step 1: Add new CSS variable mappings to the inline style builder**

Extend the `$colour_map` array to include all new keys:

```php
$colour_map = array(
    // existing mappings...
    'color_header_bg'       => '--pricing-header-bg',
    'color_header_text'     => '--pricing-header-text',
    'color_accent'          => '--pricing-accent',
    'color_card_bg'         => '--pricing-card-bg',
    'color_cta_bg'          => '--pricing-cta-bg',
    'color_cta_text'        => '--pricing-cta-text',
    'color_cta_hover_bg'    => '--pricing-cta-hover-bg',
    'color_cta_hover_text'  => '--pricing-cta-hover-text',
    'color_arrow_bg'        => '--pricing-arrow-bg',
    'color_arrow_color'     => '--pricing-arrow-color',
    'color_arrow_hover_bg'  => '--pricing-arrow-hover-bg',
    'color_badge_bg'        => '--pricing-badge-bg',
    'color_badge_text'      => '--pricing-badge-text',
    'color_feat_text'       => '--pricing-feat-text',
    'color_feat_check'      => '--pricing-feat-check',
    'color_exc_text'        => '--pricing-exc-text',
    'color_exc_title'       => '--pricing-exc-title',
    // NEW
    'color_dot_bg'            => '--pricing-dot-bg',
    'color_dot_active_bg'     => '--pricing-dot-active-bg',
    'color_crumb_bg'          => '--pricing-crumb-bg',
    'color_crumb_text'        => '--pricing-crumb-text',
    'color_crumb_active_bg'   => '--pricing-crumb-active-bg',
    'color_crumb_active_text' => '--pricing-crumb-active-text',
    'color_arrow_hover_color' => '--pricing-arrow-hover-color',
    'color_card_border'       => '--pricing-card-border',
    'color_price_text'        => '--pricing-price-text',
    'color_subtitle_text'     => '--pricing-subtitle-text',
    'color_body_text'         => '--pricing-body-text',
    'color_featured_border'   => '--pricing-featured-border',
    'color_toggle_bg'         => '--pricing-toggle-bg',
    'color_toggle_active_bg'  => '--pricing-toggle-active-bg',
);
```

- [ ] **Step 2: Add style variables to inline style**

After the color loop, add style variables:

```php
// Style variables
$shadow_map = array(
    'none'   => 'none',
    'subtle' => '0 2px 8px rgba(0,0,0,0.06)',
    'medium' => '0 4px 16px rgba(0,0,0,0.12)',
    'strong' => '0 8px 28px rgba(0,0,0,0.18)',
);
$card_shadow = $shadow_map[ $preset['card_shadow'] ?? 'subtle' ] ?? $shadow_map['subtle'];
$style .= '--pricing-card-radius:' . intval( $preset['card_border_radius'] ?? 12 ) . 'px;';
$style .= '--pricing-card-shadow:' . $card_shadow . ';';
$style .= '--pricing-card-gap:' . intval( $preset['card_gap'] ?? 24 ) . 'px;';
$style .= '--pricing-featured-border-width:' . intval( $preset['featured_border_width'] ?? 2 ) . 'px;';

// Arrow size map
$arrow_sizes = array( 'small' => 32, 'medium' => 44, 'large' => 56 );
$arrow_size_px = $arrow_sizes[ $preset['arrow_size'] ?? 'medium' ] ?? 44;
$style .= '--pricing-arrow-size:' . $arrow_size_px . 'px;';

// Arrow shape
$arrow_shapes = array( 'circle' => '50%', 'rounded' => '8px', 'square' => '0' );
$style .= '--pricing-arrow-radius:' . ( $arrow_shapes[ $preset['arrow_shape'] ?? 'circle' ] ?? '50%' ) . ';';

// Dot size map
$dot_sizes = array( 'small' => 8, 'medium' => 10, 'large' => 14 );
$dot_size_px = $dot_sizes[ $preset['dot_size'] ?? 'medium' ] ?? 10;
$style .= '--pricing-dot-size:' . $dot_size_px . 'px;';
```

- [ ] **Step 3: Pass arrow icon config to JS**

Add to the `wp_localize_script` config:

```php
'arrowIcon' => $preset['arrow_icon'] ?? 'chevron',
```

---

### Task 6: Update Frontend CSS to Use New Variables (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/assets/css/frontend.css`

- [ ] **Step 1: Update card styling to use new variables**

Replace hardcoded values with CSS variable references:

```css
/* Cards — update border, radius, shadow, gap */
.doqix-pricing-card {
  border-radius: var(--pricing-card-radius, 12px);
  border: 1px solid var(--pricing-card-border, #e0e0e0);
  box-shadow: var(--pricing-card-shadow, 0 2px 8px rgba(0,0,0,0.06));
}

.doqix-pricing-card.doqix-featured {
  border: var(--pricing-featured-border-width, 2px) solid var(--pricing-featured-border, var(--pricing-accent, #0886B5));
}

/* Header — update radius to match card */
.doqix-pricing-header {
  border-radius: var(--pricing-card-radius, 12px) var(--pricing-card-radius, 12px) 0 0;
}

/* Price text color */
.doqix-pricing-price {
  color: var(--pricing-price-text, inherit);
}

/* Subtitle text color */
.doqix-pricing-sub {
  color: var(--pricing-subtitle-text, inherit);
}

/* Body text */
.doqix-pricing-body {
  color: var(--pricing-body-text, inherit);
}

/* Grid gap */
.doqix-pricing[data-mode="grid"] .doqix-pricing-track {
  gap: var(--pricing-card-gap, 24px);
}

/* Arrow sizing */
#doqix-pricing .doqix-nav-arrow {
  width: var(--pricing-arrow-size, 44px) !important;
  min-width: var(--pricing-arrow-size, 44px) !important;
  max-width: var(--pricing-arrow-size, 44px) !important;
  height: var(--pricing-arrow-size, 44px) !important;
  min-height: var(--pricing-arrow-size, 44px) !important;
  max-height: var(--pricing-arrow-size, 44px) !important;
  border-radius: var(--pricing-arrow-radius, 50%) !important;
}

/* Arrow hover icon color */
#doqix-pricing .doqix-nav-arrow:hover {
  color: var(--pricing-arrow-hover-color, var(--pricing-arrow-color, #555)) !important;
}

/* Dot sizing + colors */
.doqix-nav-dot {
  width: var(--pricing-dot-size, 10px);
  height: var(--pricing-dot-size, 10px);
  background: var(--pricing-dot-bg, rgba(0,0,0,0.15));
}

.doqix-nav-dot.doqix-nav-active {
  background: var(--pricing-dot-active-bg, var(--pricing-accent, #0886B5));
}

/* Breadcrumb colors */
.doqix-nav-crumb {
  background: var(--pricing-crumb-bg, rgba(0,0,0,0.04));
  color: var(--pricing-crumb-text, #aaa);
}

.doqix-nav-crumb.doqix-nav-active {
  background: var(--pricing-crumb-active-bg, var(--pricing-accent, #0886B5));
  border-color: var(--pricing-crumb-active-bg, var(--pricing-accent, #0886B5));
  color: var(--pricing-crumb-active-text, #fff);
}

/* Billing toggle */
.doqix-billing-switch {
  background: var(--pricing-toggle-bg, #ccc);
}

.doqix-billing-switch.doqix-billing-on {
  background: var(--pricing-toggle-active-bg, var(--pricing-accent, #0886B5));
}
```

---

### Task 7: Update Frontend JS for Arrow Icons (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/assets/js/frontend.js:203-224`

- [ ] **Step 1: Use arrow icon config when creating arrow buttons**

Replace the hardcoded `‹`/`›` with icon lookup:

```javascript
var arrowIcons = {
    chevron: ['\u2039', '\u203A'],       // ‹ ›
    arrow:   ['\u2190', '\u2192'],       // ← →
    caret:   ['\u25C0', '\u25B6']        // ◀ ▶
};
var icons = arrowIcons[config.arrowIcon] || arrowIcons.chevron;

// In arrow creation:
leftArrow.textContent = icons[0];
rightArrow.textContent = icons[1];
```

---

### Task 8: Expand Admin Live Preview to All Tabs (Carousel)

**Files:**
- Modify: `assets/doqix-pricing-carousel/assets/js/admin.js`
- Modify: `assets/doqix-pricing-carousel/assets/css/admin.css`
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php`

- [ ] **Step 1: Move preview card to a persistent sidebar**

In `class-admin.php`, render the preview card once at the top of the preset content area (outside any sub-tab), positioned as a sticky sidebar that persists across all sub-tabs. Replace the preview rendering in `render_colours_tab()` with a shared method:

```php
private function render_preview_sidebar( $preset_slug, $preset, $colour_groups ) {
    // Build initial style vars from ALL color groups
    $style_vars = '';
    foreach ( $colour_groups as $fields ) {
        foreach ( $fields as $key => $meta ) {
            $var_suffix = str_replace( '_', '-', str_replace( 'color_', '', $key ) );
            $val = $preset[ $key ] ?? '';
            $style_vars .= '--pricing-' . $var_suffix . ':' . esc_attr( $val ?: $meta[1] ) . ';';
        }
    }
    // Add style vars
    $shadow_map = array( 'none' => 'none', 'subtle' => '0 2px 8px rgba(0,0,0,0.06)', 'medium' => '0 4px 16px rgba(0,0,0,0.12)', 'strong' => '0 8px 28px rgba(0,0,0,0.18)' );
    $style_vars .= '--pricing-card-radius:' . intval( $preset['card_border_radius'] ?? 12 ) . 'px;';
    $style_vars .= '--pricing-card-shadow:' . ( $shadow_map[ $preset['card_shadow'] ?? 'subtle' ] ?? $shadow_map['subtle'] ) . ';';
    ?>
    <div class="doqix-preview-sidebar">
        <span class="doqix-preview-label"><?php esc_html_e( 'LIVE PREVIEW', 'doqix-pricing-carousel' ); ?></span>
        <div id="doqix-preview-card" class="doqix-preview-card" style="<?php echo $style_vars; ?>">
            <!-- Same preview card HTML as before -->
            <div class="doqix-preview-badge">MOST POPULAR</div>
            <div class="doqix-preview-header">
                <div class="doqix-preview-name">Team</div>
                <div class="doqix-preview-sub">Small teams (2-15 people)</div>
                <div class="doqix-preview-price">R2,500<span>/mo</span></div>
                <div class="doqix-preview-setup">R1,500 setup</div>
            </div>
            <div class="doqix-preview-body">
                <div class="doqix-preview-savings">Save ~R8,000-R20,000/mo</div>
                <div class="doqix-preview-feat">Up to 3 workflows</div>
                <div class="doqix-preview-feat">Priority + WhatsApp (24hr)</div>
                <div class="doqix-preview-feat">Hosting &amp; monitoring</div>
                <div class="doqix-preview-feat">POPIA compliant</div>
                <div class="doqix-preview-feat">No lock-in</div>
                <div class="doqix-preview-excludes">
                    <div class="doqix-preview-exc-title">Excludes:</div>
                    <div class="doqix-preview-exc-item">Training (R1,500/session)</div>
                    <div class="doqix-preview-exc-item">Additional hosting costs</div>
                </div>
            </div>
            <div class="doqix-preview-cta">Start Free</div>
            <!-- Mini nav preview -->
            <div class="doqix-preview-nav">
                <span class="doqix-preview-arrow doqix-preview-arrow-left">&#x2039;</span>
                <span class="doqix-preview-dot active"></span>
                <span class="doqix-preview-dot"></span>
                <span class="doqix-preview-dot"></span>
                <span class="doqix-preview-arrow doqix-preview-arrow-right">&#x203A;</span>
            </div>
        </div>
    </div>
    <?php
}
```

- [ ] **Step 2: Update admin.css for persistent preview sidebar**

```css
/* Preview sidebar — sticky, visible on all tabs */
.doqix-preset-content {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 24px;
    align-items: start;
}

.doqix-preview-sidebar {
    position: sticky;
    top: 40px;
    order: 2;
}

/* Tab content fills left column */
.doqix-tab-content {
    order: 1;
}

/* Mini nav in preview */
.doqix-preview-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 0 8px;
    background: var(--pricing-card-bg, #f9fcfd);
    border-radius: 0 0 var(--pricing-card-radius, 12px) var(--pricing-card-radius, 12px);
}

.doqix-preview-arrow {
    width: 24px;
    height: 24px;
    border-radius: var(--pricing-arrow-radius, 50%);
    background: var(--pricing-arrow-bg, #fff);
    color: var(--pricing-arrow-color, #555);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 1px solid rgba(0,0,0,0.1);
}

.doqix-preview-dot {
    width: var(--pricing-dot-size, 8px);
    height: var(--pricing-dot-size, 8px);
    border-radius: 50%;
    background: var(--pricing-dot-bg, #ccc);
}

.doqix-preview-dot.active {
    background: var(--pricing-dot-active-bg, var(--pricing-accent, #0886B5));
}
```

- [ ] **Step 3: Update admin.js to handle style control live preview**

Add listeners for radio pills and number inputs that update the preview:

```javascript
// Radio pill activation + preview
document.addEventListener('change', function(e) {
    var pill = e.target.closest('.doqix-pill input[type="radio"]');
    if (!pill) return;

    // Update pill active states
    var group = pill.closest('.doqix-radio-pills');
    group.querySelectorAll('.doqix-pill').forEach(function(p) { p.classList.remove('active'); });
    pill.closest('.doqix-pill').classList.add('active');

    var preview = document.getElementById('doqix-preview-card');
    if (!preview) return;

    var name = pill.getAttribute('name');
    var val = pill.value;

    // Arrow shape → preview
    if (name.indexOf('[arrow_shape]') > -1) {
        var shapes = { circle: '50%', rounded: '8px', square: '0' };
        preview.style.setProperty('--pricing-arrow-radius', shapes[val] || '50%');
    }
    // Card shadow → preview
    if (name.indexOf('[card_shadow]') > -1) {
        var shadows = { none: 'none', subtle: '0 2px 8px rgba(0,0,0,0.06)', medium: '0 4px 16px rgba(0,0,0,0.12)', strong: '0 8px 28px rgba(0,0,0,0.18)' };
        preview.style.setProperty('--pricing-card-shadow', shadows[val] || shadows.subtle);
    }
    // Dot size → preview
    if (name.indexOf('[dot_size]') > -1) {
        var sizes = { small: '8px', medium: '10px', large: '14px' };
        preview.style.setProperty('--pricing-dot-size', sizes[val] || '10px');
    }
    // Arrow size → preview
    if (name.indexOf('[arrow_size]') > -1) {
        // Scale preview arrows proportionally
        var arrowSizes = { small: '20px', medium: '24px', large: '28px' };
        preview.querySelectorAll('.doqix-preview-arrow').forEach(function(a) {
            a.style.width = arrowSizes[val] || '24px';
            a.style.height = arrowSizes[val] || '24px';
        });
    }
});

// Number inputs → preview (border radius, gap)
document.addEventListener('input', function(e) {
    var preview = document.getElementById('doqix-preview-card');
    if (!preview) return;

    var name = e.target.name || '';
    if (name.indexOf('[card_border_radius]') > -1) {
        preview.style.setProperty('--pricing-card-radius', e.target.value + 'px');
    }
});
```

---

## PART B: ROI CALCULATOR v2.2.0

### Task 9: Add New Preset Defaults (Calculator)

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/doqix-roi-calculator.php`

- [ ] **Step 1: Add new color keys to `doqix_roi_v2_get_preset_defaults()`**

Expand from 2 color fields to 21:

```php
// Existing
'color_accent'        => '',
'color_cta'           => '',

// NEW — Card & Layout
'color_card_bg'       => '',
'color_card_border'   => '',
'color_heading_text'  => '',
'color_body_text'     => '',

// Slider
'color_slider_track'  => '',
'color_slider_label'  => '',

// Hero Result
'color_hero_bg'       => '',
'color_hero_value'    => '',
'color_hero_label'    => '',

// Result Cards
'color_result_value'  => '',
'color_result_label'  => '',

// CTA
'color_cta_text'      => '',
'color_cta_hover_bg'  => '',
'color_cta_hover_text' => '',

// Share
'color_share_text'    => '',

// Misc
'color_footnote'      => '',
'color_tier_text'     => '',
'color_roi_highlight' => '',
'color_tooltip_bg'    => '',
'color_tooltip_text'  => '',

// Style controls
'card_border_radius'  => 8,
'card_shadow'         => 'subtle',
'cta_border_radius'   => 8,
```

- [ ] **Step 2: Bump version**

```php
Version: 2.2.0
define( 'DOQIX_ROI_V2_VERSION', '2.2.0' );
```

---

### Task 10: Replace Calculator Colors Section with Full Panel + Live Preview

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php:852-899`

- [ ] **Step 1: Replace the 2-field colors section with grouped color grid + live preview**

Replace everything from `<!-- ═══════════════ COLORS ═══════════════ -->` through line 899 with:

```php
<!-- ═══════════════ COLORS ═══════════════ -->
<h2><?php esc_html_e( 'Colors', 'doqix-roi-calculator' ); ?></h2>
<p class="description"><?php esc_html_e( 'Customize all calculator colors. Empty fields inherit from your theme.', 'doqix-roi-calculator' ); ?></p>

<div class="doqix-roi-colours-layout">

    <!-- Left column: grouped colour pickers -->
    <div class="doqix-roi-colours-pickers">
        <?php
        $colour_groups = array(
            __( 'Accent & Cards', 'doqix-roi-calculator' ) => array(
                'color_accent'       => array( __( 'Accent (sliders, highlights)', 'doqix-roi-calculator' ), '#0886B5' ),
                'color_card_bg'      => array( __( 'Card Background', 'doqix-roi-calculator' ), '#ffffff' ),
                'color_card_border'  => array( __( 'Card Border', 'doqix-roi-calculator' ), '#e0e0e0' ),
                'color_heading_text' => array( __( 'Heading Text', 'doqix-roi-calculator' ), '#1d2327' ),
                'color_body_text'    => array( __( 'Body / Intro Text', 'doqix-roi-calculator' ), '#555555' ),
            ),
            __( 'Sliders', 'doqix-roi-calculator' ) => array(
                'color_slider_track' => array( __( 'Track (unfilled)', 'doqix-roi-calculator' ), '#d9dee2' ),
                'color_slider_label' => array( __( 'Label Text', 'doqix-roi-calculator' ), '#1d2327' ),
            ),
            __( 'Hero Result', 'doqix-roi-calculator' ) => array(
                'color_hero_bg'    => array( __( 'Background', 'doqix-roi-calculator' ), '#ffffff' ),
                'color_hero_value' => array( __( 'Amount Text', 'doqix-roi-calculator' ), '#1d2327' ),
                'color_hero_label' => array( __( 'Label Text', 'doqix-roi-calculator' ), '#666666' ),
            ),
            __( 'Result Cards', 'doqix-roi-calculator' ) => array(
                'color_result_value'  => array( __( 'Value Text', 'doqix-roi-calculator' ), '#1d2327' ),
                'color_result_label'  => array( __( 'Label Text', 'doqix-roi-calculator' ), '#666666' ),
                'color_roi_highlight' => array( __( 'ROI Multiplier', 'doqix-roi-calculator' ), '#0886B5' ),
                'color_tier_text'     => array( __( 'Tier Suggestion', 'doqix-roi-calculator' ), '#555555' ),
            ),
            __( 'CTA Button', 'doqix-roi-calculator' ) => array(
                'color_cta'           => array( __( 'Background', 'doqix-roi-calculator' ), '#0886B5' ),
                'color_cta_text'      => array( __( 'Text', 'doqix-roi-calculator' ), '#ffffff' ),
                'color_cta_hover_bg'  => array( __( 'Hover Background', 'doqix-roi-calculator' ), '#076d94' ),
                'color_cta_hover_text' => array( __( 'Hover Text', 'doqix-roi-calculator' ), '#ffffff' ),
            ),
            __( 'Share Button', 'doqix-roi-calculator' ) => array(
                'color_share_text' => array( __( 'Text & Border', 'doqix-roi-calculator' ), '#0886B5' ),
            ),
            __( 'Tooltips', 'doqix-roi-calculator' ) => array(
                'color_tooltip_bg'   => array( __( 'Background', 'doqix-roi-calculator' ), '#1a1a1a' ),
                'color_tooltip_text' => array( __( 'Text', 'doqix-roi-calculator' ), '#ffffff' ),
            ),
            __( 'Misc', 'doqix-roi-calculator' ) => array(
                'color_footnote' => array( __( 'Footnote', 'doqix-roi-calculator' ), '#999999' ),
            ),
        );

        foreach ( $colour_groups as $group_label => $fields ) : ?>
            <h4 class="doqix-roi-color-group"><?php echo esc_html( $group_label ); ?></h4>
            <div class="doqix-roi-color-grid">
                <?php foreach ( $fields as $key => $meta ) :
                    $val       = $p[ $key ] ?? '';
                    $display   = ! empty( $val ) ? $val : $meta[1];
                    $var_name  = '--roi-' . str_replace( 'color_', '', str_replace( '_', '-', $key ) );
                ?>
                <div class="doqix-roi-color-field">
                    <label><?php echo esc_html( $meta[0] ); ?></label>
                    <span class="doqix-color-swatch">
                        <input type="color"
                               name="<?php echo esc_attr( "{$opt}[presets][{$slug}][{$key}]" ); ?>"
                               value="<?php echo esc_attr( $display ); ?>"
                               data-var="<?php echo esc_attr( $var_name ); ?>"
                               data-visual-default="<?php echo esc_attr( $meta[1] ); ?>"
                               <?php if ( empty( $val ) ) echo 'data-is-default="1"'; ?>>
                        <code><?php echo esc_html( empty( $val ) ? 'Theme default' : $val ); ?></code>
                        <?php if ( ! empty( $val ) ) : ?>
                        <button type="button" class="button-link doqix-roi-reset-color">&times;</button>
                        <?php endif; ?>
                    </span>
                </div>
                <?php endforeach; ?>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- Right column: live preview -->
    <div class="doqix-roi-preview-area">
        <span class="doqix-roi-preview-label"><?php esc_html_e( 'LIVE PREVIEW', 'doqix-roi-calculator' ); ?></span>
        <?php
        // Build initial CSS vars
        $pv = '';
        foreach ( $colour_groups as $fields ) {
            foreach ( $fields as $key => $meta ) {
                $var_name = '--roi-' . str_replace( 'color_', '', str_replace( '_', '-', $key ) );
                $val = $p[ $key ] ?? '';
                $pv .= $var_name . ':' . esc_attr( $val ?: $meta[1] ) . ';';
            }
        }
        $pv .= '--roi-radius:' . intval( $p['card_border_radius'] ?? 8 ) . 'px;';
        $shadow_map = array( 'none' => 'none', 'subtle' => '0 2px 8px rgba(0,0,0,0.08)', 'medium' => '0 4px 16px rgba(0,0,0,0.12)', 'strong' => '0 8px 28px rgba(0,0,0,0.18)' );
        $pv .= '--roi-shadow:' . ( $shadow_map[ $p['card_shadow'] ?? 'subtle' ] ?? $shadow_map['subtle'] ) . ';';
        ?>
        <div id="doqix-roi-preview" class="doqix-roi-preview" style="<?php echo $pv; ?>">
            <!-- Mini slider mockup -->
            <div class="doqix-roi-pv-inputs">
                <div class="doqix-roi-pv-slider">
                    <span class="doqix-roi-pv-label">Team members</span>
                    <span class="doqix-roi-pv-value">5</span>
                    <div class="doqix-roi-pv-track">
                        <div class="doqix-roi-pv-fill" style="width:40%"></div>
                        <div class="doqix-roi-pv-thumb" style="left:40%"></div>
                    </div>
                </div>
                <div class="doqix-roi-pv-slider">
                    <span class="doqix-roi-pv-label">Hours / week</span>
                    <span class="doqix-roi-pv-value">8</span>
                    <div class="doqix-roi-pv-track">
                        <div class="doqix-roi-pv-fill" style="width:60%"></div>
                        <div class="doqix-roi-pv-thumb" style="left:60%"></div>
                    </div>
                </div>
            </div>
            <!-- Mini hero result -->
            <div class="doqix-roi-pv-hero">
                <div class="doqix-roi-pv-amount">R12,500</div>
                <div class="doqix-roi-pv-hero-label">Your Monthly Savings</div>
            </div>
            <!-- Mini result cards -->
            <div class="doqix-roi-pv-cards">
                <div class="doqix-roi-pv-card">
                    <div class="doqix-roi-pv-card-value">R150K</div>
                    <div class="doqix-roi-pv-card-label">per year</div>
                </div>
                <div class="doqix-roi-pv-card">
                    <div class="doqix-roi-pv-card-value">625%</div>
                    <div class="doqix-roi-pv-card-label">ROI</div>
                </div>
            </div>
            <!-- Mini CTA -->
            <div class="doqix-roi-pv-cta">Start Free Trial</div>
            <!-- Mini share -->
            <div class="doqix-roi-pv-share">Share Results</div>
            <!-- Mini footnote -->
            <div class="doqix-roi-pv-footnote">* Based on average savings</div>
        </div>
    </div>

</div><!-- .doqix-roi-colours-layout -->

<!-- Style Controls -->
<h3><?php esc_html_e( 'Style', 'doqix-roi-calculator' ); ?></h3>
<table class="form-table">
    <tr>
        <th scope="row"><?php esc_html_e( 'Card Border Radius (px)', 'doqix-roi-calculator' ); ?></th>
        <td>
            <input type="number" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][card_border_radius]" ); ?>"
                   value="<?php echo esc_attr( $p['card_border_radius'] ?? 8 ); ?>"
                   min="0" max="24" class="small-text" data-preview-var="--roi-radius" data-preview-suffix="px">
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'Card Shadow', 'doqix-roi-calculator' ); ?></th>
        <td>
            <?php foreach ( array( 'none' => 'None', 'subtle' => 'Subtle', 'medium' => 'Medium', 'strong' => 'Strong' ) as $sv => $sl ) : ?>
            <label style="margin-right:16px;">
                <input type="radio" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][card_shadow]" ); ?>"
                       value="<?php echo esc_attr( $sv ); ?>"
                       <?php checked( $p['card_shadow'] ?? 'subtle', $sv ); ?>>
                <?php echo esc_html( $sl ); ?>
            </label>
            <?php endforeach; ?>
        </td>
    </tr>
    <tr>
        <th scope="row"><?php esc_html_e( 'CTA Border Radius (px)', 'doqix-roi-calculator' ); ?></th>
        <td>
            <input type="number" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][cta_border_radius]" ); ?>"
                   value="<?php echo esc_attr( $p['cta_border_radius'] ?? 8 ); ?>"
                   min="0" max="24" class="small-text" data-preview-var="--roi-cta-radius" data-preview-suffix="px">
        </td>
    </tr>
</table>
```

---

### Task 11: Update Calculator Sanitization

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` — `sanitize_settings()` method

- [ ] **Step 1: Add all new color keys to the sanitization loop**

```php
$color_keys = array(
    'color_accent', 'color_cta',
    'color_card_bg', 'color_card_border', 'color_heading_text', 'color_body_text',
    'color_slider_track', 'color_slider_label',
    'color_hero_bg', 'color_hero_value', 'color_hero_label',
    'color_result_value', 'color_result_label', 'color_roi_highlight', 'color_tier_text',
    'color_cta_text', 'color_cta_hover_bg', 'color_cta_hover_text',
    'color_share_text', 'color_footnote',
    'color_tooltip_bg', 'color_tooltip_text',
);

foreach ( $color_keys as $ck ) {
    if ( isset( $preset[ $ck ] ) ) {
        $preset[ $ck ] = sanitize_hex_color( $preset[ $ck ] ) ?: '';
    }
}

// Style controls
$preset['card_border_radius'] = max( 0, min( 24, intval( $preset['card_border_radius'] ?? 8 ) ) );
$preset['card_shadow'] = in_array( $preset['card_shadow'] ?? 'subtle', array( 'none', 'subtle', 'medium', 'strong' ), true ) ? $preset['card_shadow'] : 'subtle';
$preset['cta_border_radius'] = max( 0, min( 24, intval( $preset['cta_border_radius'] ?? 8 ) ) );
```

---

### Task 12: Inject All New CSS Variables on Calculator Frontend

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-frontend.php:202-217`

- [ ] **Step 1: Replace the 2-variable injection with full variable map**

```php
$colour_map = array(
    'color_accent'        => '--roi-accent',
    'color_cta'           => '--roi-action',
    'color_card_bg'       => '--roi-card-bg',
    'color_card_border'   => '--roi-line',
    'color_heading_text'  => '--roi-heading-text',
    'color_body_text'     => '--roi-body-text',
    'color_slider_track'  => '--roi-slider-track',
    'color_slider_label'  => '--roi-slider-label',
    'color_hero_bg'       => '--roi-hero-bg',
    'color_hero_value'    => '--roi-hero-value',
    'color_hero_label'    => '--roi-hero-label',
    'color_result_value'  => '--roi-result-value',
    'color_result_label'  => '--roi-result-label',
    'color_roi_highlight' => '--roi-highlight',
    'color_tier_text'     => '--roi-tier-text',
    'color_cta_text'      => '--roi-cta-text',
    'color_cta_hover_bg'  => '--roi-cta-hover-bg',
    'color_cta_hover_text' => '--roi-cta-hover-text',
    'color_share_text'    => '--roi-share-text',
    'color_footnote'      => '--roi-footnote',
    'color_tooltip_bg'    => '--roi-tooltip-bg',
    'color_tooltip_text'  => '--roi-tooltip-text',
);

$style = '';
$theme_color = $this->get_theme_accent_color();

foreach ( $colour_map as $key => $var ) {
    $val = $preset[ $key ] ?? '';
    // Fallback: accent and cta inherit from theme color
    if ( empty( $val ) && in_array( $key, array( 'color_accent', 'color_cta' ), true ) ) {
        $val = $theme_color;
    }
    if ( ! empty( $val ) ) {
        $style .= $var . ':' . esc_attr( $val ) . ';';
    }
}

// Style variables
$shadow_map = array(
    'none'   => 'none',
    'subtle' => '0 2px 8px rgba(0,0,0,0.08)',
    'medium' => '0 4px 16px rgba(0,0,0,0.12)',
    'strong' => '0 8px 28px rgba(0,0,0,0.18)',
);
$style .= '--roi-radius:' . intval( $preset['card_border_radius'] ?? 8 ) . 'px;';
$style .= '--roi-shadow:' . ( $shadow_map[ $preset['card_shadow'] ?? 'subtle' ] ?? $shadow_map['subtle'] ) . ';';
$style .= '--roi-cta-radius:' . intval( $preset['cta_border_radius'] ?? 8 ) . 'px;';
```

---

### Task 13: Update Calculator CSS to Consume All New Variables

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/assets/css/doqix-roi-calculator.css`

- [ ] **Step 1: Add new variable declarations and update selectors**

Update the `:root` / `.doqix-roi` block:

```css
.doqix-roi {
  --roi-accent: #0886B5;
  --roi-action: #0886B5;
  --roi-line: rgba(13,32,40,0.12);
  --roi-shadow: 0 2px 8px rgba(0,0,0,0.08);
  --roi-radius: 8px;
  --roi-card-bg: #fff;
  --roi-heading-text: inherit;
  --roi-body-text: inherit;
  --roi-slider-track: rgba(13,32,40,0.12);
  --roi-slider-label: inherit;
  --roi-hero-bg: #fff;
  --roi-hero-value: inherit;
  --roi-hero-label: inherit;
  --roi-result-value: inherit;
  --roi-result-label: inherit;
  --roi-highlight: #0886B5;
  --roi-tier-text: inherit;
  --roi-cta-text: #fff;
  --roi-cta-hover-bg: inherit;
  --roi-cta-hover-text: #fff;
  --roi-share-text: #0886B5;
  --roi-footnote: inherit;
  --roi-tooltip-bg: #1a1a1a;
  --roi-tooltip-text: #fff;
  --roi-cta-radius: 8px;
}
```

Then update each selector to consume its variable:

```css
/* Headings */
.doqix-roi h2 { color: var(--roi-heading-text); }

/* Intro */
.doqix-roi .section-intro { color: var(--roi-body-text); }

/* Slider labels */
.doqix-roi .slider-label { color: var(--roi-slider-label); }

/* Slider track */
#roi-calculator input[type="range"] { background: var(--roi-slider-track); }

/* Hero */
.doqix-roi .hero-result { background: var(--roi-hero-bg); }
.doqix-roi .hero-amount { color: var(--roi-hero-value); }
.doqix-roi .hero-label { color: var(--roi-hero-label); }

/* Result cards */
.doqix-roi .card-value { color: var(--roi-result-value); }
.doqix-roi .card-label { color: var(--roi-result-label); }

/* ROI multiplier */
.doqix-roi .roi-multiplier { color: var(--roi-highlight); }

/* Tier text */
.doqix-roi .tier-text { color: var(--roi-tier-text); }

/* CTA */
#roi-calculator a.roi-cta { color: var(--roi-cta-text); border-radius: var(--roi-cta-radius); }
#roi-calculator a.roi-cta:hover { background: var(--roi-cta-hover-bg, var(--roi-action)); color: var(--roi-cta-hover-text); }

/* Share */
#roi-calculator button.share-btn { color: var(--roi-share-text); border-color: var(--roi-share-text); }
#roi-calculator button.share-btn:hover { background: var(--roi-share-text); }
#roi-calculator button.share-btn:focus { outline-color: var(--roi-share-text); }

/* Tooltip */
.doqix-roi .slider-label .tooltip { background: var(--roi-tooltip-bg); color: var(--roi-tooltip-text); }
.doqix-roi .slider-label .tooltip::after { border-top-color: var(--roi-tooltip-bg); }

/* Footnote */
.doqix-roi .roi-footnote { color: var(--roi-footnote); }
```

---

### Task 14: Fix Hardcoded Slider Track Color in JS (Calculator)

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-calculator.js:65-72`

- [ ] **Step 1: Read --roi-slider-track from CSS instead of hardcoded value**

Replace the hardcoded `rgba(13,32,40,0.12)` in `updateSliderFill()`:

```javascript
function updateSliderFill(slider) {
    var min = parseFloat(slider.min);
    var max = parseFloat(slider.max);
    var val = parseFloat(slider.value);
    var pct = ((val - min) / (max - min)) * 100;
    var trackColor = getComputedStyle(container).getPropertyValue('--roi-slider-track').trim() || 'rgba(13,32,40,0.12)';
    slider.style.background = 'linear-gradient(to right, ' + accentColor + ' ' + pct + '%, ' + trackColor + ' ' + pct + '%)';
}
```

---

### Task 15: Create Calculator Admin CSS + Preview Styles

**Files:**
- Create: `assets/doqix-roi-calculator-v2/assets/css/doqix-roi-admin.css`

- [ ] **Step 1: Create the admin CSS file with color grid and preview styles**

```css
/* Do.Qix ROI Calculator — Admin Styles */

/* Color panel layout */
.doqix-roi-colours-layout {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 24px;
    align-items: start;
}

.doqix-roi-colour-group { margin: 16px 0 8px; font-size: 13px; font-weight: 600; color: #1d2327; }
.doqix-roi-colour-group:first-child { margin-top: 0; }

.doqix-roi-color-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.doqix-roi-color-field label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 4px; color: #50575e; }

.doqix-color-swatch {
    display: flex;
    align-items: center;
    gap: 8px;
}

.doqix-color-swatch input[type="color"] {
    width: 36px; height: 36px;
    padding: 2px; border: 1px solid #ddd; border-radius: 4px;
    cursor: pointer;
}

.doqix-color-swatch code { font-size: 11px; color: #666; }

.doqix-roi-reset-color {
    color: #b32d2e !important; font-size: 16px; text-decoration: none !important;
    cursor: pointer; padding: 0 4px;
}

/* Preview */
.doqix-roi-preview-area { position: sticky; top: 40px; }

.doqix-roi-preview-label {
    display: block; text-align: center; font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; color: #999; margin-bottom: 8px;
}

.doqix-roi-preview {
    background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;
    padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Preview — inputs panel */
.doqix-roi-pv-inputs {
    background: var(--roi-card-bg, #fff);
    border: 1px solid var(--roi-line, rgba(13,32,40,0.12));
    border-radius: var(--roi-radius, 8px);
    padding: 12px;
    margin-bottom: 10px;
    box-shadow: var(--roi-shadow);
}

.doqix-roi-pv-slider { margin-bottom: 10px; }
.doqix-roi-pv-slider:last-child { margin-bottom: 0; }

.doqix-roi-pv-label { font-size: 11px; font-weight: 600; color: var(--roi-slider-label, inherit); }
.doqix-roi-pv-value { float: right; font-size: 11px; font-weight: 700; color: var(--roi-accent, #0886B5); }

.doqix-roi-pv-track {
    position: relative; height: 4px; border-radius: 2px;
    background: var(--roi-slider-track, rgba(13,32,40,0.12));
    margin-top: 6px;
}

.doqix-roi-pv-fill {
    position: absolute; top: 0; left: 0; height: 100%; border-radius: 2px;
    background: var(--roi-accent, #0886B5);
}

.doqix-roi-pv-thumb {
    position: absolute; top: 50%; transform: translate(-50%, -50%);
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--roi-accent, #0886B5);
    border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* Preview — hero */
.doqix-roi-pv-hero {
    background: var(--roi-hero-bg, var(--roi-card-bg, #fff));
    border: 1px solid var(--roi-line, rgba(13,32,40,0.12));
    border-radius: var(--roi-radius, 8px);
    padding: 14px; text-align: center; margin-bottom: 8px;
    box-shadow: var(--roi-shadow);
}

.doqix-roi-pv-amount { font-size: 24px; font-weight: 700; color: var(--roi-hero-value, inherit); }
.doqix-roi-pv-hero-label { font-size: 10px; color: var(--roi-hero-label, #666); margin-top: 2px; }

/* Preview — result cards */
.doqix-roi-pv-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px; }

.doqix-roi-pv-card {
    background: var(--roi-card-bg, #fff);
    border: 1px solid var(--roi-line, rgba(13,32,40,0.12));
    border-radius: var(--roi-radius, 8px);
    padding: 8px; text-align: center;
    box-shadow: var(--roi-shadow);
}

.doqix-roi-pv-card-value { font-size: 14px; font-weight: 700; color: var(--roi-result-value, inherit); }
.doqix-roi-pv-card-label { font-size: 9px; color: var(--roi-result-label, #666); }

/* Preview — CTA */
.doqix-roi-pv-cta {
    display: block; width: 100%; padding: 10px;
    background: var(--roi-action, #0886B5); color: var(--roi-cta-text, #fff);
    border-radius: var(--roi-cta-radius, var(--roi-radius, 8px));
    text-align: center; font-size: 12px; font-weight: 700;
    margin-bottom: 6px; border: none;
}

/* Preview — share */
.doqix-roi-pv-share {
    display: block; width: 100%; padding: 8px;
    background: transparent; color: var(--roi-share-text, var(--roi-action, #0886B5));
    border: 1px solid var(--roi-share-text, var(--roi-action, #0886B5));
    border-radius: var(--roi-cta-radius, var(--roi-radius, 8px));
    text-align: center; font-size: 11px; font-weight: 600;
    margin-bottom: 6px;
}

/* Preview — footnote */
.doqix-roi-pv-footnote {
    font-size: 9px; text-align: center; color: var(--roi-footnote, #999);
}

/* Responsive: stack on narrow screens */
@media (max-width: 1200px) {
    .doqix-roi-colours-layout { grid-template-columns: 1fr; }
    .doqix-roi-preview-area { position: static; max-width: 300px; margin: 0 auto; }
}
```

- [ ] **Step 2: Enqueue the admin CSS**

In `class-doqix-roi-admin.php`, in the `enqueue_admin_assets()` method, add:

```php
wp_enqueue_style(
    'doqix-roi-v2-admin',
    plugin_dir_url( DOQIX_ROI_V2_FILE ) . 'assets/css/doqix-roi-admin.css',
    array(),
    DOQIX_ROI_V2_VERSION
);
```

---

### Task 16: Add Live Preview JS to Calculator Admin

**Files:**
- Modify: `assets/doqix-roi-calculator-v2/assets/js/doqix-roi-admin.js`

- [ ] **Step 1: Add color picker → live preview sync**

Append to the IIFE:

```javascript
/* ── Live Preview ── */
var roiPreview = document.getElementById('doqix-roi-preview');

if (roiPreview) {
    // Color picker → preview
    document.addEventListener('input', function(e) {
        if (e.target.type !== 'color') return;
        var dataVar = e.target.getAttribute('data-var');
        if (!dataVar) return;

        roiPreview.style.setProperty(dataVar, e.target.value);

        // Sync hex code display
        var field = e.target.closest('.doqix-color-swatch');
        if (field) {
            var codeEl = field.querySelector('code');
            if (codeEl) codeEl.textContent = e.target.value;
        }
        e.target.removeAttribute('data-is-default');
    });

    // Reset button
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('doqix-roi-reset-color')) return;
        var swatch = e.target.closest('.doqix-color-swatch');
        if (!swatch) return;

        var input = swatch.querySelector('input[type="color"]');
        if (!input) return;

        var visualDefault = input.getAttribute('data-visual-default') || '#0886B5';
        input.value = visualDefault;
        input.setAttribute('data-is-default', '1');

        var codeEl = swatch.querySelector('code');
        if (codeEl) codeEl.textContent = 'Theme default';

        e.target.style.display = 'none';

        // Update preview
        var dataVar = input.getAttribute('data-var');
        if (dataVar) roiPreview.style.setProperty(dataVar, visualDefault);
    });

    // Number inputs with data-preview-var
    document.addEventListener('input', function(e) {
        var previewVar = e.target.getAttribute('data-preview-var');
        if (!previewVar) return;
        var suffix = e.target.getAttribute('data-preview-suffix') || '';
        roiPreview.style.setProperty(previewVar, e.target.value + suffix);
    });

    // Shadow radio → preview
    document.addEventListener('change', function(e) {
        if (e.target.type !== 'radio') return;
        var name = e.target.name || '';
        if (name.indexOf('[card_shadow]') === -1) return;

        var shadows = {
            none: 'none',
            subtle: '0 2px 8px rgba(0,0,0,0.08)',
            medium: '0 4px 16px rgba(0,0,0,0.12)',
            strong: '0 8px 28px rgba(0,0,0,0.18)'
        };
        roiPreview.style.setProperty('--roi-shadow', shadows[e.target.value] || shadows.subtle);
    });

    // On form submit, clear values of default-marked inputs
    var form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function() {
            var defaults = form.querySelectorAll('input[data-is-default="1"]');
            for (var i = 0; i < defaults.length; i++) {
                defaults[i].value = '';
            }
        });
    }
}
```

---

### Task 17: Update updates.json + Final Version Bumps

**Files:**
- Modify: `updates.json`

- [ ] **Step 1: Bump carousel to 1.3.0 and calculator v2 to 2.2.0 in updates.json**

Update the version fields and download_url tags for both plugins.

---

## Execution Order

Tasks 1-8 (Carousel) and Tasks 9-16 (Calculator) are **independent** and can be worked in parallel.

Task 17 (updates.json) depends on both being done.

**Recommended parallel execution:**
- Agent A: Tasks 1-8 (Carousel v1.3.0)
- Agent B: Tasks 9-16 (Calculator v2.2.0)
- Then: Task 17 (version manifest)
