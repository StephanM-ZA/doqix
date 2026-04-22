# Design System: Do.Qix Website

**Project:** Do.Qix  
**Source of truth:** `design/global.css`  
**Font:** Inter (Google Fonts, weights 400/500/600/700/900)  
**Icons:** Heroicons (inline SVG, outline default, solid for emphasis, class `.hi`)

---

## 1. Visual Identity

Premium dark with electric energy. Near-black canvas, vivid teal accents, warm amber secondary. The mood is confident and alive without being corporate. Density is low: generous whitespace, spacious sections (py-20 to py-24), clean visual hierarchy through contrast and scale.

---

## 2. Colour Palette

### CSS Custom Properties (`:root`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#0C1830` | Page background, body bg |
| `--color-surface` | `#141419` | Legacy surface reference |
| `--card-bg` | `#14203C` | All card backgrounds |
| `--color-surface-hover` | `#1a1a22` | Surface hover states |
| `--color-primary` | `#00e5a0` | Primary accent (Electric Teal) |
| `--color-secondary` | `#ff8000` | Secondary accent (Warm Amber) |
| `--color-tertiary` | `#e09c58` | Tertiary accent |
| `--color-text-primary` | `#f0f0f5` | Primary text (headings, emphasis) |
| `--color-text-secondary` | `#c0c0d0` | Body text, paragraphs |
| `--color-text-on-accent` | `#0C1830` | Text on teal/amber backgrounds |
| `--color-border` | `#1e1e2a` | Structural borders |
| `--color-danger` | `#ff6b6b` | Error states |
| `--color-form-input` | `#1E3050` | Form input backgrounds |

### Tailwind Colour Map (per-page `<script>`)

| Key | Hex | Notes |
|-----|-----|-------|
| `primary` | `#00e5a0` | Electric Teal |
| `secondary` | `#ff8000` | Warm Amber |
| `background` / `surface-dim` | `#0C1830` | Page canvas |
| `surface` | `#0C1830` | Same as background |
| `surface-container` | `#14203C` | Card-level surfaces |
| `surface-container-low` | `#101C36` | Alternating section bg |
| `surface-container-high` | `#1A2A48` | Elevated surfaces |
| `surface-container-highest` | `#1E3050` | Tooltips, popovers |
| `surface-container-lowest` | `#081024` | Deepest surface |
| `surface-bright` | `#223656` | Bright surface state |
| `on-surface` | `#e4e1e9` | Text on surfaces |
| `on-surface-variant` | `#bacbbf` | Muted text on surfaces |
| `on-primary` | `#003824` | Text on primary colour |
| `outline` | `#84958a` | Border/outline colour |
| `outline-variant` | `#3b4a41` | Subtle borders |

### Hardcoded Colours (in CSS)

| Hex | Where Used |
|-----|-----------|
| `#e4e1e9` | Body text, h1/h2 colour, mobile links |
| `#ffffff` | h3/h4 colour, footer column headings |
| `#c0c0d0` | Paragraph text, footer contact items, logo tagline |
| `#9a9aaa` | Captions, slider range labels, muted meta text |
| `#666` | Footer copyright text |
| `#060C1C` | Footer background, mobile menu bg |
| `#1E3050` | Tooltip bg, FAQ hover bg, contact channel icons |
| `#47ffb8` | Cookie toggle hover, allow button hover |

### Opacity Patterns

- Card borders: `rgba(255, 255, 255, 0.08)` (rest), `0.15` (hover)
- Section borders: `rgba(255, 255, 255, 0.05)`
- Primary tinted bg: `rgba(0, 229, 160, 0.1)` (labels, badges)
- Primary tinted border: `rgba(0, 229, 160, 0.2)` (labels), `0.3` (back-to-top, badges)
- Amber tinted bg: `rgba(255, 128, 0, 0.1)` to `0.15`
- Amber tinted border: `rgba(255, 128, 0, 0.2)` to `0.3`
- Outline borders: `rgba(59, 74, 65, 0.2)` to `0.3`

---

## 3. Typography

**Single typeface:** Inter at all levels. No display font, no monospace except formula tooltips.

### Heading Scale

| Element | Mobile | Desktop (768px+) | Weight | Letter-spacing | Line-height |
|---------|--------|-------------------|--------|----------------|-------------|
| `h1` | 2.5rem (480px: 4rem) | 6rem | 900 | -0.04em | 0.9 |
| `h2` | 2rem (480px: 3rem) | 3.75rem | 900 | -0.02em | 1.1 |
| `h3` | 1.5rem | 2rem | 700 | normal | 1.3 |
| `h4` | 1.125rem | 1.25rem | 600 | normal | 1.4 |

### Body & Labels

| Class/Element | Size | Weight | Line-height | Colour |
|---------------|------|--------|-------------|--------|
| `p` | 1rem | 400 | 1.6 | `#c0c0d0` |
| `.lead` / `.text-lg` | 1.125rem | 400 | 1.7 | inherited |
| `.label` | 0.6875rem | 600 | - | `#00e5a0` |
| `.caption` | 0.875rem | 400 italic | - | `#9a9aaa` |
| `.stat-number` | 3rem (md: 3.75rem) | 900 | 1 | varies |
| `.stat-number.xl` | 7rem (md: 10rem) | 900 | 1 | varies |

### Text Selection

Background: `#00e5a0`, Text: `#0C1830`

---

## 4. Components

### `.label` (Eyebrow Pill)

Uppercase pill with teal tint. `display: inline-flex`, `border-radius: 9999px`, `padding: 0.375rem 1rem`. Green by default, `.label.orange` for amber variant. Centres on mobile.

### `.btn` (Button)

Pill-shaped (`border-radius: 9999px`), `font-weight: 700`, Inter.

| Variant | Background | Text | Hover |
|---------|-----------|------|-------|
| `.btn-primary` | `#00e5a0` | `#0C1830` | scale(1.05), brightness(1.1), teal shadow |
| `.btn-primary.glow` | `#00e5a0` | `#0C1830` | + pulsing teal box-shadow animation |
| `.btn-ghost` | transparent | `#e4e1e9` | bg `#14203C`, border/text `#00e5a0` |

**Sizes:** `.sm` (0.75/2rem), default (0.75/2rem), `.md` (1.25/2.5rem), `.lg` (1.5/3rem), `.full` (100% width)

**Transition:** `400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)` (spring easing)

### `.card`

Background: `var(--card-bg)` (`#14203C`). Border: `1px solid rgba(255, 255, 255, 0.08)`. Radius: `2rem`. Hover: translateY(-8px), border brightens to 0.15, deep shadow.

**Transition:** `400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`

### `.banner`

Full-width centred pill. Max-width 42rem. Variants: `.banner.orange`, `.banner.teal`.

### `.callout`

Rounded container (`1rem` radius), max-width 56rem. Contains `.callout-icon` (circle, 4rem). Stacks vertical on mobile, horizontal (768px+). Variants: `.callout.orange`, `.callout.teal`.

### `.pricing-card` / `.pricing-popular`

Standard card with optional popular treatment: `2px solid #00e5a0` border, teal shadow. `.pricing-badge` pill appears only inside `.pricing-popular`.

### `.product-badge`

Absolute positioned pill, centred at top of card (top: -0.875rem). Variants: `.live` (teal bg), `.in-progress` (amber bg). Both with `#0C1830` text.

### `.trust-badge`

Background: `#101C36`. Contains `.trust-stat` (teal, 1.875rem, 900 weight), `.trust-label` (uppercase, 0.6875rem), optional `.trust-icon`.

### `.bullet-list`

Custom styled list with teal dot bullets (0.5rem circles with double-ring box-shadow). Left-aligned, centres on mobile.

### `.faq-item`

`<details>` based accordion. Card bg, 1rem radius. Summary styled as flex row with chevron. Hover: bg shifts to `#1A2A48`. Chevron rotates 180deg on open.

---

## 5. Navigation

### `.site-header`

Fixed, full-width, z-index 50. Background: linear gradient from `rgba(6, 12, 28, 0.85)` with `backdrop-filter: blur(20px)`. Height: 5rem. Max-width: 80rem.

### Desktop (768px+)

Logo left, `.nav-links` centre/right (flex, gap 2.5rem), CTA button right. Nav links: 0.6875rem, uppercase, 500 weight, `#c0c0d0`. Active: `#00e5a0` with 2px bottom border.

### Mobile (<768px)

Logo + hamburger. Three-line hamburger animates to X on open. `.mobile-menu` slides down with 1.5rem gap links. CTA hidden (shown in mobile menu). Menu bg: `#060C1C`.

---

## 6. Footer

Background: `#060C1C`. Border-top: `rgba(255, 255, 255, 0.05)`. Padding: 4rem 2rem.

**Layout:** Single column mobile, `2fr 1fr 1fr 1fr` grid on desktop. Contains brand column (logo, contact items with icons), social links column, navigate column, legal column.

**Copyright:** `#666`, 0.75rem, border-top separator with 2rem padding-top. Build version shown at 50% opacity.

---

## 7. Form Fields

`.form-field` containers with label + input/select/textarea. Input bg: `#1E3050`. Border: `rgba(59, 74, 65, 0.3)`. Radius: 0.5rem. Focus: teal border + teal glow ring. Error state: `.has-error` shows red border and `.field-error` message. Select has custom chevron SVG.

---

## 8. Layout Patterns

### Section Rhythm

- Hero sections: `py-24 px-8 hero-gradient` (radial teal glow, 10% opacity)
- Content sections: `py-24 px-8` or `py-20 px-8`
- Alternating sections: add `bg-surface-container-low` (`#101C36`)
- Max content width: `max-w-7xl` (80rem) for grids, `max-w-4xl` for text-heavy
- Hero text: `max-w-2xl mx-auto text-center`

### Scroll Sections

`section[id]` gets `scroll-margin-top: 6rem` to clear fixed header.

### Mobile (max 640px)

Sections centre text. Labels auto-margin centre. Section padding reduces to 2-3rem vertical. List items stay left-aligned within centred containers.

### Common Grid Patterns

- 4-column feature grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
- 2-column product grid: `grid-cols-1 md:grid-cols-2 gap-8`
- 3-column overview: `grid-cols-1 md:grid-cols-3 gap-8`

---

## 9. Animation System

### Scroll Reveal (`.scroll-reveal`)

Applied automatically by `main.js` to direct children of all `<section>` elements inside `<main>`, except the first section (hero).

- Start: `opacity: 0; translateY(20px) scale(0.97)`
- End: `opacity: 1; transform: none`
- Duration: `500ms`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (spring snap)
- Trigger: IntersectionObserver, threshold 0.1, trigger once
- Stagger: `.stagger-1` through `.stagger-5` (80ms increments)

### Button/Card Spring

Shared easing: `400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`. Used on `.btn-primary` hover, `.card` hover, `.timeline-circle` hover.

### Teal Glow Pulse (`@keyframes pulse-teal`)

3s infinite. Box-shadow blooms from 0 to `20px 4px rgba(0, 229, 160, 0.2)`. Applied via `.btn-primary.glow` or `.animate-pulse-teal`.

### Scroll Indicator

`.scroll-arrow` bounces vertically (8px) on 2s loop. Fades out on scroll.

### Back-to-Top

Fixed button, bottom-right (`bottom: 2rem; right: 1.25rem`). Hidden by default (opacity 0, translateY 1rem). `.visible` class shows it. Hover: solid teal bg with dark icon.

### Accessibility

All motion disabled under `prefers-reduced-motion: reduce`. Scroll reveals show immediately, pulse animations stop, spring transitions removed.

---

## 10. Specialised Components

### Timeline / Steps

Vertical timeline with connecting line (teal gradient, top to bottom fading). Numbered circles on the line: `.active` (solid teal, glow shadow) and `.outline` (border only). Desktop: wider padding and larger circles.

### Testimonial Carousel

Horizontal slide track with momentum easing (`600ms cubic-bezier(0.16, 1, 0.3, 1)`). Two slides visible on desktop, one on mobile. Arrow buttons (teal outline circles) on sides, hide on mobile. Dot indicators: 0.5rem circles, active dot expands to 1.5rem pill.

### App Carousel

Infinite horizontal scroll (`@keyframes app-scroll`, 60s linear). Pauses on hover. Items at 60% opacity, full on hover.

### ROI Calculator

Two-panel grid (stacks on mobile). Input panel with range sliders (teal thumbs, 22px). Output panel with hero result card (radial teal glow), 2x2 result cards grid, tier suggestion, CTA, and share button. Info icons (serif italic "i" in teal circle) with click-to-toggle tooltips.

### Exit-Intent Popup

Fixed overlay with backdrop blur. Centred card (max 36rem), slides up on show. Contains icon, heading, body, CTA button, dismiss link. Z-index: 9999.

### Cookie Banner

Fixed bottom, slides up. Inner card (max 48rem, `#14203C` bg). Expandable details table. Three actions: Allow (teal), Essentials Only (dark), Decline (text). Z-index: 9998.

### Contact Channels

Horizontal items with circle icon (3rem, `#1E3050` bg, teal icon), label (uppercase micro), and value. Icon scales on hover.

---

## 11. Page Inventory

| Page | Path | Key Sections |
|------|------|-------------|
| Home | `index/index.html` | Hero (video bg), trust badges, services preview, ROI calculator, testimonials, app carousel, CTA |
| Services | `services/services.html` | Hero (video bg), service categories, automation stats, process timeline, ROI calculator, CTA |
| Products | `products/products.html` | Hero, product grid (4 cards), why-products features, cross-sell CTA |
| Contact | `contact/contact.html` | Hero, contact form, contact channels, FAQ accordion, trust badges |
| Privacy Policy | `privacy-policy/privacy-policy.html` | Legal content |
| Terms | `terms-and-conditions/terms-and-conditions.html` | Legal content |
| Thank You | `thank-you/thank-you.html` | Confirmation message |
| 404 | `404/404.html` | Error message with navigation |

### Global Components (JS-injected)

| Component | Source | Injected Into |
|-----------|--------|---------------|
| Header | `components/js/header.js` | `#site-header` on all pages |
| Footer | `components/js/footer.js` | `#site-footer` on all pages |
| Exit Popup | `components/js/exit-popup.js` | All marketing pages |
| Cookie Banner | `components/js/cookie-banner.js` | All pages |
| ROI Calculator | `index/js/roi-calculator.js` | Home + Services |
| Scroll Reveal | per-page `main.js` | Auto-applied to section children |

---

## 12. Utilities

| Class | Purpose |
|-------|---------|
| `.hi` | Heroicon base: `display: inline-block; vertical-align: middle; flex-shrink: 0` |
| `.text-primary` | Tailwind: sets text to primary teal |
| `.scrollbar-hide` | Hides scrollbars (webkit + Firefox) |
| `.spring-transition` | Applies spring easing: `400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)` |
| `.hero-gradient` | Radial teal glow background for hero sections |
