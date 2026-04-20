# Do.Qix Page Build Playbook

**Version:** 1.0
**Date:** 2026-04-19
**Purpose:** Step-by-step instructions for building each remaining page, based on the proven homepage (index.html) build process. Follow this exactly.

---

## Reference: What Worked on index.html

The homepage is the gold standard. It started as a Stitch-generated HTML file, was stripped of Stitch inline styles, wired to the design system, and synced to root for deployment. That same process applies to every page.

---

## Source Files Available

Each page has a Stitch-generated HTML file and screenshot in its design directory:

| Page | Stitch Source | Screenshot | Status |
|------|--------------|------------|--------|
| services.html | `design/services/services.html` | `design/services/screen.png` | TODO |
| products.html | `design/products/products.html` | `design/products/screen.png` | TODO |
| contact.html | `design/contact/contact.html` | `design/contact/screen.png` | TODO |
| privacy-policy.html | `design/privacy-policy/privacy-policy.html` | `design/privacy-policy/screen.png` | TODO |
| terms-and-conditions.html | `design/terms-and-conditions/terms-and-conditions.html` | `design/terms-and-conditions/screen.png` | TODO |
| thank-you.html | `design/thank-you/thank-you.html` | `design/thank-you/screen.png` | TODO |
| 404.html | `design/404/404.html` | `design/404/screen.png` | TODO |
| cookie-banner | `design/cookie-banner/cookie-banner.html` | `design/cookie-banner/screen.png` | TODO (overlay) |
| exit-popup | `design/exit-popup/exit-popup.html` | `design/exit-popup/screen.png` | TODO (overlay) |

Additional Stitch exports are in `docs/website/html/stitch-v2/` (animated + unified variants per page). Use these as visual reference if the design directory versions need rework.

---

## Step-by-Step Build Process

### Step 1: Prepare the Head Block

Every page MUST use the exact same `<head>` structure as the homepage. Copy the head from `design/index/index.html` (lines 1-84) and change only:

1. **`<title>`** to match the page (e.g., "Do.Qix | Services", "Do.Qix | Contact Us")
2. **Favicon path** stays `../favicon_green.png` (design version) / `favicon_green.png` (root version)
3. **Tailwind CDN** script stays identical: `https://cdn.tailwindcss.com?plugins=forms,container-queries`
4. **Tailwind config** stays identical (the full inline config block, lines 11-79). Do NOT change colors, radii, or fonts.
5. **global.css** link stays `../global.css?v=X.Y.Z` (design version) / `global.css?v=X.Y.Z` (root version)
6. **Page-specific `<style>` block** can contain styles unique to this page (keep minimal)

```html
<!-- Template head (design version) -->
<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Do.Qix | [PAGE TITLE]</title>
<link rel="icon" type="image/png" href="../favicon_green.png"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
        <!-- COPY EXACT CONFIG FROM design/index/index.html lines 12-78 -->
    }
</script>
<link rel="stylesheet" href="../global.css?v=X.Y.Z"/>
<style>
    /* Page-specific styles only */
</style>
</head>
```

**Important:** All sections must use `px-8` horizontal padding to match the homepage and align with the footer (which uses `padding: 4rem 2rem` = 32px). Do NOT use `px-6` as it causes a visible misalignment with the footer.

### Step 2: Strip Stitch Inline Styles

The Stitch-generated HTML files have extensive inline Tailwind classes. The homepage process was:

1. **Keep Tailwind layout classes** (flex, grid, gap, padding, margin, responsive breakpoints like `md:`, `lg:`)
2. **Replace Stitch color classes** with design system tokens. Stitch generates its own color palette that may not match. Map to:
   - Background: `bg-background` or `bg-surface` or `bg-surface-container`
   - Text: `text-on-surface` or `text-on-surface-variant`
   - Accent: `text-primary` (#00e5a0 teal), `text-secondary` (#ff8000 amber)
   - Borders: `border-outline-variant`
3. **Move repeated component styles to global.css** if they will be used across pages. Single-use styles stay as Tailwind classes or in the page `<style>` block.
4. **Remove any inline `<script>` blocks** and move JS to external files in the page's `js/` folder

### Step 3: Wire Up Header and Footer

The homepage has header and footer hardcoded inline (copied from `design/components/header.html` and `design/components/footer.html`). Two approaches:

**Option A: Hardcode (used for homepage)**
Copy the header from `design/components/header.html` and footer from `design/components/footer.html` directly into the page HTML. Set the `.active` class on the current page's nav link manually.

**Option B: Dynamic load via components.js**
Use placeholder elements and load dynamically:
```html
<header id="site-header"></header>
<!-- page content -->
<footer id="site-footer"></footer>
<script src="js/components.js?v=X.Y.Z" data-base="."></script>
```
The `components.js` file (at root `js/components.js`) fetches `components/header.html` and `components/footer.html`, then sets the active nav link based on the current URL. The `data-base` attribute controls the base path for component fetching.

**Current decision:** Homepage uses Option A (hardcoded). For new pages, use whichever approach is chosen. If hardcoding, keep header/footer markup identical to the component files.

**Header CTA link rule:** The header "Get Started" button links to `index.html#pricing` by default (from the component file). However, if the current page has its own `#pricing` section (e.g. services.html), change the header CTA to `#pricing` (on-page scroll) so users stay on the page instead of navigating away.

### Step 4: Apply Content from Copy Document

All page copy lives in `design/Website_Copy.md` (v7.0). Do NOT invent, rephrase, or rewrite copy. Use exactly what the document specifies for:
- Headings (H1, H2, H3)
- Body paragraphs
- Button labels
- Proof points and stats
- Card content

Cross-reference section structure with `docs/architecture/DoQix_Structure.md` for section order and visual elements per page.

### Step 5: Apply Design System Patterns

Reference `design/DESIGN.md` for all visual patterns. Key patterns to reuse:

| Pattern | Global CSS Class | Used On |
|---------|-----------------|---------|
| Hero gradient (radial teal glow, no video) | `.hero-gradient` | All inner pages (services, products, contact, etc.). Homepage uses this + video overlay. |
| Stat cards (bold stat + icon + desc) | `.stat-number`, `.stat-number.teal/.orange` | Home (problem section), Services (ROI examples) |
| Vertical timeline/steps | `.timeline`, `.timeline-line`, `.timeline-circle.active/.outline` | Home (how it works), Contact (what happens next) |
| Pricing cards (4-column) | `.pricing-card`, `.pricing-popular`, `.pricing-badge` | Home (pricing), Services (pricing) |
| Banner/announcement pill | `.banner`, `.banner.teal/.orange` | Any page with launch offers |
| Section label pill | `<label>` (global styling) | Above every H2 section heading |
| Scroll reveal animation | `.scroll-reveal` (+ `.stagger-1` to `.stagger-5`) | All sections on all pages |
| Button styles | `.btn`, `.btn-primary`, `.btn-ghost`, `.glow` | All CTAs |
| Card hover lift | `.card` | All card components |
| Form fields | `.form-field`, `.field-error`, `.has-error` | Contact, exit-popup |
| FAQ accordion | `.faq-item`, `.faq-answer`, `.faq-chevron` | Contact, possibly services |
| Trust badges | `.trust-badge`, `.trust-stat`, `.trust-label`, `.trust-icon` | Contact, possibly other pages |
| Contact channels | `.contact-channel`, `.channel-icon`, `.channel-label`, `.channel-value` | Contact |
| Bullet list | `.bullet-list` | Home (hero proof points), anywhere |
| Callout card | `.callout`, `.callout.teal/.orange` | Home, services |
| Caption text | `.caption` | Micro-copy below CTAs, closing remarks |

### Step 6: Add Page-Specific JavaScript

If the page needs interactive behavior (calculators, carousels, accordions, form validation):

1. Create JS file(s) in `design/[page]/js/` folder
2. Name files by feature: `accordion.js`, `form-validation.js`, etc.
3. All interactive logic in external JS, zero inline scripts
4. Link at bottom of body, before `</body>`:
```html
<script src="js/main.js?v=X.Y.Z"></script>
<script src="js/[page-specific].js?v=X.Y.Z"></script>
```

**main.js** (shared across pages) handles:
- Scroll reveal (IntersectionObserver for `.scroll-reveal` elements)
- Mobile menu toggle (hamburger open/close)
- Hero video autoplay (homepage only, but safe to load everywhere)

Only add page-specific JS files for features unique to that page.

### Step 7: Copy Check

Before considering the page done, verify:

- [ ] No em dashes anywhere in the copy (use periods, commas, colons, parentheses instead)
- [ ] No hardcoded values that belong in JS/CSS config
- [ ] No inline `<script>` blocks (all JS in external files)
- [ ] Copy matches `design/Website_Copy.md` exactly
- [ ] Button text follows convention (see Button Text below)
- [ ] No button uses the word "Free"
- [ ] If using `<a>` as a button, add `.btn` class (prevents teal-on-teal hover bug)
- [ ] Contact details match: stephan@digitaloperations.co.za, +27 61 514 8375, wa.me/27615148375

### Step 7b: Add Page to Navigation

Pages are only added to the nav when they are fully built and ready. Do NOT link unfinished pages.

When a page is complete, add it to the nav in all three places:
1. `design/components/header.html` (desktop `.nav-link` + mobile `.mobile-link`)
2. The hardcoded header in every existing page's design HTML
3. Sync all updated files to root

Current nav: **Home | Contact**. Add each page as it ships (e.g. Services, Products).

### Step 8: Sync Design to Root

This is mandatory before every push. The design directory is source of truth, root is what GitHub Pages deploys.

```bash
# 1. Copy global CSS
cp design/global.css global.css

# 2. Copy page HTML (fix CSS/asset paths)
# Design version uses ../global.css, ../favicon_green.png
# Root version uses global.css, favicon_green.png
sed 's|\.\./global\.css|global.css|g; s|\.\./favicon_green\.png|favicon_green.png|g; s|\.\./logo_new_green\.png|logo_new_green.png|g; s|\.\./hero-video\.mp4|hero-video.mp4|g' design/[page]/[page].html > [page].html

# 3. Copy page JS files (if any)
cp design/[page]/js/*.js js/

# 4. Copy shared JS
cp design/index/js/main.js js/main.js
```

**Path fixes from design to root:**
| Design path | Root path |
|-------------|-----------|
| `../global.css` | `global.css` |
| `../favicon_green.png` | `favicon_green.png` |
| `../logo_new_green.png` | `logo_new_green.png` |
| `../hero-video.mp4` | `hero-video.mp4` |
| `js/[file].js` | `js/[file].js` (same, no change needed) |

### Step 9: Cache-Bust Version Strings

Every CSS and JS reference in HTML must include `?v=X.Y.Z` matching the current `web-vX.Y.Z` tag.

Files to update in BOTH design and root HTML:
- `global.css?v=X.Y.Z`
- `js/main.js?v=X.Y.Z`
- Any page-specific JS: `js/[feature].js?v=X.Y.Z`

When bumping version, use sed across all HTML files:
```bash
sed -i '' 's/?v=OLD/?v=NEW/g' design/*/index.html design/*/*.html index.html services.html products.html contact.html [etc]
```

### Step 10: Commit, Tag, and Push

Follow the commit + tag workflow:

```bash
# Stage all changed files (design + root)
git add design/[page]/ [page].html global.css js/ design/global.css

# Commit with conventional message
git commit -m "feat(website): add [page] page

[Brief description of what the page contains]"

# Tag with next version
git tag -a web-vX.Y.Z -m "[page] page added"

# Push commit and tag
git push origin main --tags
```

**Versioning guide:**
- New page = minor bump (0.5.0, 0.6.0, etc.)
- Fix to existing page = patch bump (0.5.1, 0.5.2, etc.)
- Major redesign = major bump (1.0.0)

---

## Page-Specific Notes

### services.html
- Stitch source: `design/services/services.html` (38KB, most complex page)
- Also reference: `docs/website/html/stitch-v2/03-services-animated.html`
- Sections per Structure doc: Hero, How Automation Works, What We Automate (12 categories), Quick Wins (8 examples), 5-Step Plan, ROI Calculator, The Caution (blockquote), Pricing (4 tiers), Data and Control, Bottom CTA
- May reuse ROI calculator JS from homepage (`js/roi-calculator.js`)
- Pricing section reuses same card pattern as homepage

### products.html
- Stitch source: `design/products/products.html` (18KB)
- Sections: Hero, Product Grid (modular cards), Why Our Products, Services Cross-Sell, Bottom CTA
- Product cards are modular; new products added as cards over time
- Simpler page, no heavy JS needed

### contact.html
- Stitch source: `design/contact/contact.html` (23KB)
- Sections: Hero, Form (2-column: form left, contact info right), What Happens Next (5 steps), FAQs (accordion), Trust Signals
- Needs form JS: validation, honeypot, submission handling
- FAQ accordion needs JS (create `js/accordion.js`)
- Form action: redirect to `/thank-you`, email notification, webhook to CRM

### privacy-policy.html
- Stitch source: `design/privacy-policy/privacy-policy.html` (13KB)
- Simple text page with legal content
- POPIA compliance content
- No special JS needed beyond main.js

### terms-and-conditions.html
- Stitch source: `design/terms-and-conditions/terms-and-conditions.html` (17KB)
- Content source: `docs/legal/Terms_and_Conditions.md`
- Simple text page, no special JS

### thank-you.html
- Stitch source: `design/thank-you/thank-you.html` (10KB)
- Confirmation page after form submission
- Simple: H1, confirmation message, next steps, link to content
- No special JS beyond main.js

### 404.html
- Stitch source: `design/404/404.html` (13KB)
- Fun message: "This page got automated out of existence."
- Links to Home and Contact
- No special JS

### cookie-banner (overlay component)
- Stitch source: `design/cookie-banner/cookie-banner.html` (10KB)
- Not a standalone page; injected as overlay on all pages
- Needs its own JS for consent management
- Will need to be loaded on every page via script

### exit-popup (overlay component)
- Stitch source: `design/exit-popup/exit-popup.html` (10KB)
- Not a standalone page; triggered on exit intent
- Fires once per session
- Headline: "Your team is losing a full day every week."
- Needs JS for exit-intent detection

---

## Design System Quick Reference

### Colors (Tailwind tokens from config)
| Token | Hex | Use |
|-------|-----|-----|
| `primary` | #00e5a0 | Teal: CTAs, active states, focus rings |
| `secondary` | #ff8000 | Amber: badges, highlights, proof points |
| `background` / `surface-dim` | #0C1830 | Royal navy: page background |
| `surface` | #0C1830 | Section backgrounds |
| `surface-container` | #14203C | Cards, panels |
| `surface-container-high` | #1A2A48 | Elevated cards, hover states |
| `on-surface` | #e4e1e9 | Primary text |
| `on-surface-variant` | #bacbbf | Secondary/muted text |
| `outline-variant` | #3b4a41 | Borders, dividers |

### Typography
- **Font:** Inter only, loaded from Google Fonts CDN
- **H1:** 900 weight, 64px mobile / 96px desktop, -0.04em tracking
- **H2:** 900 weight, 40px mobile / 60px desktop, -0.02em tracking
- **H3:** 700 weight, 24px mobile / 32px desktop
- **Body:** 400 weight, 16-20px
- **Labels/Nav:** 500 weight, 14px

### Button Text Convention

Never use the word "Free" in any button. Use context-appropriate text:

| Context | Button Text |
|---------|------------|
| Header / nav CTA | "Let's Build" (id="cta-lets-build") -> TBD (currently #pricing or index.html#pricing) |
| Mobile menu CTA | "Let's Build" (id="cta-lets-build-mobile") -> same as header CTA |
| Hero CTA | "Get Started" |
| Mid-page section CTAs | "Get Started" |
| Pricing cards (Solo, Team, Business) | "Select Plan" |
| Enterprise pricing card | "Show Me What's Possible" |
| Contact form submit | "Get My Plan" |
| Bottom CTA (final conversion) | "Let's Talk" |

**Important:** When using `<a>` tags as buttons, always add the `.btn` class. The global `a:hover` turns text teal, which causes teal-on-teal invisible text on `.btn-primary` buttons. The global CSS fix (`a.btn-primary:hover { color: #0C1830 }`) only applies when `.btn` is present.

### Global CSS Classes (from global.css)
- `.btn`, `.btn-primary`, `.btn-ghost`, `.glow` (buttons)
- `.site-header`, `.nav-container`, `.nav-link`, `.nav-link.active` (header)
- `.site-footer`, `.footer-container` (footer)
- `.hero-gradient` (radial teal glow background for hero sections)
- `.scroll-reveal` + `.visible` + `.stagger-1` to `.stagger-5` (scroll animation)
- `.card` (standard card with hover lift)
- `.bullet-list` (styled list items with double-ring bullets)
- `.banner`, `.banner.teal`, `.banner.orange` (announcement pill)
- `.callout`, `.callout.teal`, `.callout.orange` (callout card)
- `.caption` (italic micro-copy, closing remarks)
- `<label>` / `.label` (section pill badge, auto-styled globally)
- `.stat-number`, `.stat-number.teal`, `.stat-number.orange` (large stat display)
- `.timeline`, `.timeline-line`, `.timeline-circle.active/.outline` (vertical steps)
- `.form-field`, `.field-error`, `.has-error` (form inputs with validation)
- `.faq-item`, `.faq-answer`, `.faq-chevron` (accordion Q&A)
- `.trust-badge`, `.trust-stat`, `.trust-label`, `.trust-icon` (trust signal cards)
- `.contact-channel`, `.channel-icon`, `.channel-label`, `.channel-value` (contact info rows)

### File Structure (per page)
```
design/
  [page]/
    [page].html          # Design version (source of truth)
    js/                  # Page-specific JS (if needed)
      [feature].js
    screen.png           # Stitch screenshot reference
  components/
    header.html          # Shared header
    footer.html          # Shared footer
  global.css             # Shared styles (source of truth)

[root]/
  [page].html            # Deployed version (paths fixed)
  global.css             # Deployed copy
  js/
    main.js              # Shared JS
    components.js         # Component loader
    [feature].js          # Page-specific JS
  components/
    header.html           # Deployed header component
    footer.html           # Deployed footer component
```

---

## Checklist Per Page

Use this checklist for every page build:

- [ ] Head block matches homepage template (fonts, Tailwind CDN, config, global.css)
- [ ] Cache-bust `?v=X.Y.Z` on all CSS/JS references
- [ ] Stitch inline styles stripped/replaced with design system tokens
- [ ] Header matches `design/components/header.html`
- [ ] Footer matches `design/components/footer.html`
- [ ] Active nav link set for current page
- [ ] Copy matches `design/Website_Copy.md` exactly
- [ ] No em dashes in any text
- [ ] No inline `<script>` blocks
- [ ] No hardcoded values (config in JS/CSS)
- [ ] `.scroll-reveal` class on all animatable sections
- [ ] Mobile responsive (test hamburger menu, stack layouts)
- [ ] Design version synced to root with path fixes
- [ ] Root version has correct asset paths (no `../`)
- [ ] Version tag bumped (`web-vX.Y.Z`)
- [ ] All files committed (design + root)
- [ ] Tag created and pushed with commit

---

## Build Order (Recommended)

1. **services.html** (most complex, shares ROI calculator + pricing with homepage)
2. **products.html** (simpler, modular card layout)
3. **contact.html** (form + FAQ accordion needs JS work)
4. **thank-you.html** (simple confirmation page)
5. **privacy-policy.html** (legal text page)
6. **terms-and-conditions.html** (legal text page)
7. **404.html** (fun standalone page)
8. **cookie-banner** (overlay, inject into all pages after building)
9. **exit-popup** (overlay, inject into all pages last)

---

## Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Website Copy (v7.0) | `design/Website_Copy.md` | All page copy, word for word |
| Design System | `design/DESIGN.md` | Visual patterns, colors, typography, animation |
| Stitch Prompt | `design/next-prompt.md` | Design system tokens for Stitch generation |
| Site Structure | `docs/architecture/DoQix_Structure.md` | Section order + visual elements per page |
| Build Checklist | `docs/build/Build_Checklist.md` | Original phase-by-phase build plan |
| Architecture | `docs/architecture/DoQix_Architecture.md` | Technical stack, design tokens, performance targets |
| Pricing Strategy | `docs/pricing/Pricing_Strategy.md` | Tier details for pricing sections |
| Terms and Conditions | `docs/legal/Terms_and_Conditions.md` | Legal copy for T&C page |
| FAQ Content | `docs/website/FAQ.md` | FAQ answers for contact page |
| Project Rules | `CLAUDE.md` | Mandatory build rules (no inline JS, no em dashes, etc.) |
