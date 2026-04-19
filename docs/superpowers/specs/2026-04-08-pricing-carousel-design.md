# Do.Qix Pricing Carousel — Design Spec

**Date:** 2026-04-08
**Version:** 1.0
**Status:** Approved
**Plugin name:** doqix-pricing-carousel
**Shortcode:** `[doqix_pricing]` / `[doqix_pricing preset="name"]`

---

## Overview

A WordPress plugin that renders a configurable pricing table as either a responsive grid or an interactive carousel. Follows the existing Do.Qix plugin ecosystem patterns (ROI Calculator V2, Workflow Advisor). Built with vanilla JS, no external dependencies.

---

## Plugin Structure

```
doqix-pricing-carousel/
├── doqix-pricing-carousel.php          # Constants, defaults, hooks, activation
├── includes/
│   ├── class-admin.php                 # Settings page, tabs, repeaters, sanitisation
│   └── class-frontend.php              # Shortcode, conditional enqueue, rendering
├── assets/
│   ├── css/
│   │   ├── admin.css                   # Admin UI, repeaters, tabs, mini editor
│   │   └── frontend.css                # Carousel, cards, responsive, animations
│   └── js/
│       ├── admin.js                    # Repeaters, mini rich text, tab switching
│       └── frontend.js                 # Carousel logic, swipe, nav, active scaling
├── languages/
│   └── doqix-pricing-carousel.pot
├── uninstall.php
└── readme.txt
```

**Option key:** `doqix_pricing_settings`

### Admin Menu Structure (Unified Do.Qix Menu)

All Do.Qix plugins share a single parent menu in the WP admin sidebar:

```
Do.Qix                    (parent — registered by doqix-settings)
  ├── Pricing Carousel     (doqix-pricing-carousel — new)
  ├── ROI Calculator       (doqix-roi-calculator-v2)
  └── Site Settings        (doqix-settings, renamed from "Settings")
```

**Implementation:**
- `doqix-settings` registers the parent menu via `add_menu_page()` with slug `doqix-settings`, dashicon `dashicons-admin-generic`, menu position 80
- `doqix-settings` renames its own submenu label from "Settings" to "Site Settings"
- `doqix-roi-calculator-v2` changes from `add_menu_page()` to `add_submenu_page('doqix-settings', ...)`
- `doqix-pricing-carousel` registers via `add_submenu_page('doqix-settings', ...)`
- If `doqix-settings` is not active, each plugin falls back to its own `add_menu_page()` so it still works standalone

**Required changes to existing plugins:**
1. `doqix-settings` — Add parent menu registration, rename submenu to "Site Settings"
2. `doqix-roi-calculator-v2` — Switch from `add_menu_page()` to `add_submenu_page('doqix-settings', ...)`

---

## Data Structure

```php
'doqix_pricing_settings' => [
    'global' => [
        'version'           => '1.0.0',
        'currency_symbol'   => 'R',
        'currency_position' => 'before',
    ],
    'presets' => [
        'default' => [
            'label'             => 'Default',

            // Carousel settings
            'display_desktop'   => 'grid',
            'display_mobile'    => 'carousel',
            'mobile_breakpoint' => 768,
            'nav_style'         => 'breadcrumbs',   // arrows|dots|breadcrumbs
            'autoplay'          => 0,
            'autoplay_speed'    => 5000,
            'active_scale'      => 1.15,

            // Billing toggle
            'billing_toggle'    => 0,
            'monthly_label'     => 'Monthly',
            'annual_label'      => 'Annual',
            'annual_discount'   => 15,

            // Preset-level colours (empty = theme default)
            'color_header_bg'   => '',
            'color_header_text' => '',
            'color_accent'      => '',
            'color_card_bg'     => '',
            'color_cta_bg'      => '',
            'color_cta_text'    => '',
            'color_badge_bg'    => '',
            'color_badge_text'  => '',
            'color_feat_text'   => '',
            'color_feat_check'  => '',
            'color_exc_text'    => '',
            'color_exc_title'   => '',

            // Cards (flat array, repeater)
            'cards' => [
                [
                    'name'             => 'Solo',
                    'subtitle'         => 'Solopreneurs & freelancers',
                    'price'            => '999',
                    'price_suffix'     => '/mo',
                    'price_annual'     => '849',
                    'setup_fee'        => 'Free setup',
                    'savings'          => '~R3,000-R8,000/mo',
                    'features'         => '<p>...</p>',   // lightweight rich text HTML
                    'description'      => '',
                    'excludes'         => '<p>...</p>',   // lightweight rich text HTML
                    'cta_label'        => 'Start Free',
                    'cta_url'          => '/contact',
                    'badge'            => '',
                    'featured'         => 0,
                    'icon_type'        => 'none',         // none|dashicon|url
                    'icon_value'       => '',
                    'sort_order'       => 0,
                    // Per-card colour overrides (empty = inherit preset)
                    'color_header_bg'  => '',
                    'color_header_text'=> '',
                    'color_cta_bg'     => '',
                    'color_cta_text'   => '',
                    'color_badge_bg'   => '',
                    'color_badge_text' => '',
                    'color_card_bg'    => '',
                    'color_feat_text'  => '',
                    'color_feat_check' => '',
                    'color_exc_text'   => '',
                ],
            ],
        ],
    ],
]
```

### Colour Cascade

Resolution order for any colour value:
1. **Card-level override** (if set)
2. **Preset-level colour** (if set)
3. **Theme accent colour** (auto-detected via Themify then WP theme mods)
4. **CSS fallback default**

---

## Frontend Card Design

### Card Style: "Bold Featured" with Clean Excludes

**Structure per card:**
- **Badge** — pill positioned above the card (absolute, `top: -14px`, centred). Only shown if `badge` field is non-empty. Contrasting colour (default: orange `#ff9500`).
- **Header band** — coloured background with tier name, subtitle, price (large), price suffix, and setup fee. Price lives in the header.
- **Body** — light background (`#f9fcfd` default):
  - Savings line (accent colour, centred)
  - Features list with thin divider lines between items. Checkmark prefix (`✓`) in accent colour.
  - Excludes section — separated by `2px solid` border-top. "Excludes:" label in darker grey, items in lighter grey with bullet prefix.
- **CTA button** — full-width, rounded, accent-coloured.

**Featured card differentiation:**
- Accent-coloured border (`2px solid`)
- Deeper box shadow
- No scale transform in grid mode (same size as others)
- In carousel mode: active card scales to `active_scale` value (default 1.15)

**Non-featured cards:**
- `1px solid #e0e0e0` border
- Subtle shadow

### Carousel Behaviour

**Responsive display modes (admin-configurable per preset):**
- Desktop layout: grid or carousel (admin toggle)
- Mobile layout: grid or carousel (admin toggle)
- Breakpoint: configurable px value (default 768)

**Carousel mode:**
- Active card scaled to `active_scale` (default 1.15 = 15% larger)
- Neighbour cards at `1 / active_scale` relative size, reduced opacity (0.6), slight blur
- Edges of neighbour cards visible (peeking)
- Touch swipe support
- Smooth transitions (0.4s ease)

**Navigation styles (admin selects one):**
1. **Arrows** — circular buttons on left/right sides of carousel
2. **Dots** — small circles below carousel, active dot highlighted
3. **Breadcrumb pills** — named pills with tier names below carousel, active pill highlighted

Navigation controls hidden when grid mode is active on that screen size.

**Grid mode:**
- Desktop: cards in a horizontal row, equal width
- Mobile grid: cards stack vertically

### Billing Toggle (Future-Ready)

- Admin toggle, default off
- When enabled: shows Monthly/Annual pill toggle above the pricing cards
- Switching toggles between `price` and `price_annual` values on each card
- Discount percentage shown in label: "Annual (save 15%)"

---

## Admin UI

### Tab Structure

**Top-level tabs:** One per preset + "+" button to add new preset. Delete button (×) on hover per preset tab.

**Sub-tabs per preset:**

#### Cards Tab
- Repeater panels — collapsible, one per card
- Panel header: drag handle, tier name, badge preview pill, featured star (★), remove button, collapse arrow
- Expanded panel:
  - 2-column field grid: Name, Subtitle, Price, Price Suffix, Annual Price, Setup Fee, Savings, CTA Label, CTA URL, Badge Text, Featured toggle, Icon selector
  - Full-width: Features editor (lightweight rich text), Description editor (optional), Excludes editor
  - Collapsible "Colour Overrides" section (closed by default): 10 colour pickers matching preset-level colours, each with "Reset to preset" button
- "Add Card" button at bottom

#### Carousel Tab
- Desktop/Mobile display mode split (side-by-side device panels)
- Breakpoint field
- Navigation style selector (arrows/dots/breadcrumbs) — visual radio cards
- Active card scale (number input)
- Autoplay toggle + speed (ms)
- Note: nav controls hidden when grid is active

#### Colours Tab
- 12 preset-level colour pickers in 2-column grid:
  - Header BG, Header Text, Accent, Card BG, CTA BG, CTA Text, Badge BG, Badge Text, Features Text, Features Checkmark, Excludes Text, Excludes Title
- Each with hex code display + "Reset to theme default" button
- **Live preview card** (sticky right column) — updates in real time as colours change. Shows a full featured card with badge, header, features, excludes, and CTA.

#### Billing Tab
- Enable toggle (default off)
- Monthly label, Annual label
- Discount percentage
- Frontend preview showing the toggle pill

### Rich Text Editor (Lightweight)

- Minimal toolbar: **Bold**, *Italic*, bullet list, link
- `contenteditable` div — no TinyMCE/wp_editor overhead
- Stores HTML, sanitised with `wp_kses_post()` on save
- Used for: features, description, excludes fields

---

## Technical Patterns (Following Existing Ecosystem)

### From ROI Calculator V2 / Workflow Advisor:

- **Constants:** `DOQIX_PRICING_VERSION`, `DOQIX_PRICING_PLUGIN_DIR`, `DOQIX_PRICING_PLUGIN_URL`, `DOQIX_PRICING_OPTION_KEY`
- **Defaults function:** `doqix_pricing_get_defaults()` — single source of truth
- **Activation hook:** `add_option()` to seed defaults, preserving existing
- **Conditional enqueue:** Check `has_shortcode()` + Themify Builder meta fallback
- **Config to JS:** `wp_localize_script()` passing flat config object
- **CSS variables:** `--pricing-accent`, `--pricing-header-bg`, etc. set via inline styles from admin values
- **ID-prefixed selectors** to beat aggressive theme styles
- **Theme colour detection:** Themify settings → WP theme mods → CSS fallback
- **Sanitisation:** Deep recursive merge, `sanitize_text_field()`, `sanitize_hex_color()`, `absint()`, `wp_kses_post()` for rich text
- **Tab preservation:** Form submission preserves fields from other tabs
- **Admin assets:** Only loaded on plugin's settings page (hook suffix check)

### Vanilla JS (No Dependencies):

- Frontend carousel: event delegation, touch swipe detection, CSS transform transitions
- Admin: repeater add/remove/re-index, collapsible panels, contenteditable rich text with execCommand, colour picker sync
- No jQuery, no external libraries

---

## Shortcode Usage

```
[doqix_pricing]                          <!-- uses 'default' preset -->
[doqix_pricing preset="services-page"]   <!-- uses named preset -->
```

---

## Mockup References

All mockups saved in `.superpowers/brainstorm/` session directory:
- `card-layout-v6.html` — Frontend carousel with active scaling + 3 nav styles
- `admin-full-v2.html` — Complete admin UI (all 4 tabs interactive)
- `admin-carousel-v2.html` — Desktop/Mobile display split
- `admin-colours-v2.html` — Live preview card with all 12 colour pickers
