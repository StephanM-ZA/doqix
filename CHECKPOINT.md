# CHECKPOINT — Do.Qix Website Build

**Date:** 2026-03-20
**Branch:** main
**Status:** ROI Calculator styling issue — needs fix

---

## Current Issue
ROI Calculator V1 styling is broken on frontend. Changes to heading/description/footnote CSS inadvertently affected the overall calculator layout. The calculator cards, buttons, and text are being overridden by Themify theme styles.

**Root cause:** Removed too much CSS from the plugin — only heading, description, and footnote formatting should have been stripped. The calculator structural styling (cards, sliders, buttons, CTA, result panels) must remain intact.

**Fix needed:** Restore the calculator's structural CSS while keeping heading/description/footnote as unstyled `<div>` wrappers controlled by the editor. Same fix needed on V2.

---

## Overall Progress

### Phase 1: Foundation — COMPLETE
### Phase 2: Home Page — IN PROGRESS
- [x] Step 8: Hero
- [x] Step 9: The Problem
- [ ] Step 10: What We Do ← NEXT (after ROI fix)
- [ ] Steps 11-15: remaining

### Phases 3-10: Not started

---

## ROI Calculator Changes This Session

### Features added (both V1 & V2):
1. **WYSIWYG editors** for heading, description, footnote (with colour picker + font size)
2. **Named presets system** — tabbed admin UI, each preset gets own shortcode
3. **CTA toggle** — checkbox to show/hide CTA, greyed out fields when disabled
4. **V2 renamed** to coexist with V1 (different constants, classes, shortcode `[doqix_roi_calculator_v2]`)
5. **CTA URL** accepts relative paths (`/contact`)

### Current issue:
- Heading changed from `<h2>` to `<div class="roi-heading">`
- Description and footnote already `<div>`
- Stripped ALL formatting CSS from heading, description, footnote
- But this broke the overall layout — Themify theme styles now override calculator cards/buttons/etc.
- Need to isolate: only remove formatting from heading/description/footnote, leave everything else intact

---

## Key Decisions (carried from previous session)

- Plugins: WP Super Cache, AIOS, Quform
- Font: Inter via Google Fonts
- CTA: "Start Free" (buttons), "Get My Free Plan" (form submit)
- Muted colour: #6B7980

---

## Files Modified This Session
- `assets/doqix-roi-calculator/` — all 3 PHP files + CSS
- `assets/doqix-roi-calculator-v2/` — all 3 PHP files + CSS + JS + admin CSS

## Next Steps
1. Fix ROI calculator CSS — restore structural styles, keep heading/description/footnote editor-driven
2. Rezip and test
3. Continue Phase 2: Step 10 (What We Do)
