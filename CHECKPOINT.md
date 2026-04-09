# CHECKPOINT — Do.Qix Website Build

**Date:** 2026-04-09
**Branch:** main
**Last commit:** `82d7d72` fix(pricing-carousel): increase card gap 6px→10px, v1.1.9

---

## Current Task: Pricing Carousel Plugin — LIVE TESTING

**Status:** Plugin is live on WordPress, iterating on frontend styling and features.

### Completed Since Last Checkpoint
- [x] Admin UI CSS audit against mockup (colour pickers, preview card)
- [x] Default cards populated from Pricing Strategy v2.0 (with force-migration)
- [x] Frontend: converted `<ul><li>` to `<div>` to bypass Themify overrides
- [x] Frontend: per-component `#doqix-pricing` scoped `!important` rules for font sizes
- [x] Frontend: Inter font as primary
- [x] Frontend: card corner radius fixed (header bg = card bg, no gap)
- [x] Frontend: arrows positioned left/right of carousel (absolute)
- [x] Frontend: autoplay bug fixed (was running when set to off)
- [x] Frontend: CTA hover colours configurable (admin Colours tab)
- [x] Frontend: arrow colours configurable (admin Carousel tab)
- [x] Frontend: loop toggle added (Carousel tab)
- [x] Frontend: inactive cards — CTA disabled, click-to-activate
- [x] Frontend: CTA links include `?plan=tier-name` for contact form
- [x] Frontend: inactive card opacity configurable (Carousel tab)
- [x] Frontend: excludes spacing tightened
- [x] Frontend: CTA button slimmed down
- [x] Frontend: card gap adjusted (10px per side)
- [x] Colour fields now persist on save (fixed JS clearing unset fields)

### Current Version: 1.1.9

### Remaining Tasks (Pricing Carousel)
- [ ] Final visual polish based on user feedback
- [ ] End-to-end test: carousel mode, grid mode, responsive, touch swipe
- [ ] Admin: ensure all tabs save correctly (Cards, Carousel, Colours, Billing)
- [ ] Frontend: test with billing toggle on
- [ ] Uninstall hook + readme.txt
- [ ] Final code review

### Known Issues
- WordPress auto-update sometimes doesn't detect new version immediately — user must click "Check Now" in Plugin Updates

---

## Website Build Progress

### Phase 1: Foundation — COMPLETE
### Phase 2: Home Page — IN PROGRESS
- [x] Step 8: Hero
- [x] Step 9: The Problem
- [ ] Step 10: What We Do ← NEXT (after plugin)
- [ ] Steps 11-15 remaining

### Phases 3-10: Not started

---

## ROI Calculator — COMPLETE (v2.1.0)

---

## Key Decisions

| Decision | Value |
|----------|-------|
| Plugins | WP Super Cache, AIOS, Quform |
| Font | Inter (Google Fonts) |
| CTA buttons | "Start Free" (Solo/Team/Business), "Show Me What's Possible" (Enterprise) |
| Pricing model | 4-tier flat retainer (Solo/Team/Business/Enterprise) |
| Pricing Carousel | Bold header band, badge pill, clean excludes, carousel + grid hybrid |
| Admin menu | Unified "Do.Qix" parent with alphabetical submenus |
| Frontend approach | No `<ul><li>` — use `<div>` elements to avoid Themify theme overrides |
| CTA links | Include `?plan=tier-name` query param for contact form pre-fill |

---

## Future Roadmap Items
- [ ] Common CSS for all plugins (shared `doqix-admin-common.css` with CSS variables)
- [ ] Remove hardcoded colours across plugins — use shared variables

---

## How to Resume
Say `resume` after `/compact` or `/clear`. The plan is at `docs/superpowers/plans/2026-04-08-pricing-carousel.md`. Preview file at `.superpowers/brainstorm/19744-1775636369/content/frontend-preview.html`.
