# CHECKPOINT — Do.Qix Website Build

**Date:** 2026-04-15
**Branch:** main
**Last commit:** `7dff602` feat(pricing-carousel): update features/excludes to generic language, v1.2.0

---

## Current Task: Website Copy + Docs Reorganisation — IN PROGRESS

**Status:** Hero copy updated, enterprise sales kit built, docs folder reorganised into categorised structure, plan folders populated with standard 5-doc structure per tier, 7 testimonials drafted, pricing HTML block generated.

---

## Completed This Session

### Website copy
- [x] Updated Home hero H1/Subhead in `docs/website/Website_Copy.md` to "Your workflows, on autopilot."
- [x] Replaced 3 placeholder testimonials with 7 representative SA testimonials (Solo/Team/Business mix)
- [x] Generated LiveCanvas 4-tier pricing HTML block (Solo/Team/Business/Enterprise) with Team as featured

### Enterprise sales kit (built, then restructured into `docs/plans/04_Enterprise/`)
- [x] Pricing model, calculator, discovery questionnaire, proposal template, website enterprise copy

### Plans folder (`docs/plans/`)
- [x] Master README + 4 tier folders (01_Solo, 02_Team, 03_Business, 04_Enterprise)
- [x] Each tier has standard 5 files:
  - README.md
  - 01_Pricing_Breakdown.md
  - 02_Whats_Included.md
  - 03_Target_Customer.md
  - 04_Sales_Copy.md
  - 05_ROI_Messaging.md
- [x] Enterprise extras: `sub_tiers/` (Foundation, Growth, Partnership) + `sales_tooling/` (Calculator, Discovery, Proposal, Pricing Model Ref)

### Docs reorganisation
- [x] `docs/` categorised into folders:
  - `architecture/` — DoQix_Architecture, Structure, SiteMap, Wireframe
  - `website/` — Website_Copy, SEO_Strategy, Social_Media_Plan
  - `pricing/` — Pricing_Strategy, Pricing_Competitor_Comparison
  - `plans/` — tier folders (see above)
  - `market/` — SA_Competitor_List
  - `security/` — Security_Implementation_Guide, n8n_Security_Recommendations
  - `legal/` — Terms_and_Conditions
  - `build/` — Build_Checklist
  - `superpowers/` — untouched
- [x] Created `docs/README.md` master index
- [x] Updated cross-reference paths inside `plans/` to new pricing/ and website/ locations

---

## Files Modified This Session

- `docs/website/Website_Copy.md` (hero + testimonials)
- `docs/README.md` (new)
- `docs/plans/**` (30+ new files)
- Moved: all previously-root-level docs into categorised subfolders

---

## Next Steps

1. **Decide on testimonial imagery** — AI-generated, stock, or initials/silhouettes (see prior session recommendation)
2. **Source 7 profile images** and save to `assets/testimonials/` as `01_lerato.jpg` … `07_sipho.jpg`
3. **Drop the pricing HTML block** into the Pricing section of the WordPress site
4. **Apply hero copy** to the live WordPress site (manual — user said they'd handle)
5. **Replace placeholder SVGs** in pricing HTML with 4 distinct tier icons
6. **Sync** any plan changes back into `docs/pricing/Pricing_Strategy.md` and `docs/website/Website_Copy.md` for consistency
7. **Consider** creating `docs/website/Testimonial_Assets.md` to track image sourcing + POPIA consent per testimonial

---

## Uncommitted Changes

- `CHECKPOINT.md` (modified)
- All new docs/plans/** and docs/README.md and reorganisation moves — currently untracked/modified
- `assets/doqix-pricing-carousel.zip` (untracked — local artifact, do not commit)
- `.claude/` (untracked)

**Nothing has been git-committed yet this session.** Recommend running `/commit` (commit-specialist) when ready to persist the reorganisation and new docs.
