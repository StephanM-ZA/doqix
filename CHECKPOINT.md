# CHECKPOINT — Do.Qix Website Build

**Date:** 2026-04-14
**Branch:** main
**Last commit:** `9bd4169` fix(roi-calculator): lower Business tier threshold R25K→R15K, v1.2.3 & v2.1.3

---

## Current Task: Pricing Audit & ROI Calculator Refinement — COMPLETE

**Status:** Pricing audit done, calculator updated, competitor research documented.

### Completed This Session
- [x] ROI Calculator V1 & V2: Info tab added (calculation logic reference)
- [x] Fixed zip structure (parent folder) — was causing WordPress update loop
- [x] Added release workflow knowledge to CLAUDE.md (tags trigger GitHub Actions)
- [x] Full competitor pricing research (SA + international)
- [x] Competitor comparison table saved to `docs/Pricing_Competitor_Comparison.md`
- [x] Pricing Strategy doc updated with correct inclusions/exclusions:
  - All tiers include: n8n hosting, workflow builds, monitoring, maintenance, POPIA
  - NOT included: AI integration, additional hosting beyond n8n, third-party API costs, training (Solo/Team)
- [x] Business tier threshold lowered: R25,000 → R15,000 (was unreachable with defaults)
- [x] Calculator math verified correct with default sliders

### Current Versions
- ROI Calculator V1: **1.2.3**
- ROI Calculator V2: **2.1.3**
- Pricing Carousel: **1.1.9**

### Remaining Tasks (Pricing Carousel)
- [ ] Final visual polish based on user feedback
- [ ] End-to-end test: carousel mode, grid mode, responsive, touch swipe
- [ ] Admin: ensure all tabs save correctly (Cards, Carousel, Colours, Billing)
- [ ] Frontend: test with billing toggle on
- [ ] Uninstall hook + readme.txt
- [ ] Final code review

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

## ROI Calculator — COMPLETE (V1: 1.2.3, V2: 2.1.3)

---

## Key Decisions

| Decision | Value |
|----------|-------|
| Plugins | WP Super Cache, AIOS, Quform |
| Font | Inter (Google Fonts) |
| CTA buttons | "Start Free" (Solo/Team/Business), "Show Me What's Possible" (Enterprise) |
| Pricing model | 4-tier flat retainer (Solo/Team/Business/Enterprise) |
| Pricing includes | n8n hosting, workflow builds, monitoring, maintenance, POPIA |
| Pricing excludes | AI integration, extra hosting, third-party API costs, training (Solo/Team) |
| Business threshold | R15,000 monthly savings (lowered from R25,000) |
| Pricing Carousel | Bold header band, badge pill, clean excludes, carousel + grid hybrid |
| Admin menu | Unified "Do.Qix" parent with alphabetical submenus |
| Frontend approach | No `<ul><li>` — use `<div>` elements to avoid Themify theme overrides |
| CTA links | Include `?plan=tier-name` query param for contact form pre-fill |
| Release workflow | Push `v*` tag to trigger GitHub Actions → builds zips → GitHub Release |

---

## Key Reference Documents

| Document | Location |
|----------|----------|
| Pricing Strategy v2.0 | `docs/Pricing_Strategy.md` |
| Competitor Comparison | `docs/Pricing_Competitor_Comparison.md` |
| Pricing Carousel Plan | `docs/superpowers/plans/2026-04-08-pricing-carousel.md` |

---

## Future Roadmap Items
- [ ] Common CSS for all plugins (shared `doqix-admin-common.css` with CSS variables)
- [ ] Remove hardcoded colours across plugins — use shared variables
- [ ] Enable annual billing toggle (15% discount) on pricing carousel

---

## How to Resume
Say `resume` after `/compact` or `/clear`.
