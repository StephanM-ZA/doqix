# Do.Qix Plans — Master Index

> Every pricing tier has its own folder with the **same 5-doc structure**.
> Use the top-level table to jump to any plan; drill into the folder for details.

**Version:** 1.0 · **Date:** 2026-04-15 · **Source of truth:** `../pricing/Pricing_Strategy.md` v2.0

---

## The Four Plans at a Glance

| Tier | Monthly | Setup | Workflows | For | Folder |
|------|---------|-------|-----------|-----|--------|
| **Solo** | R999/mo | Free | 1 | Solopreneurs, freelancers | [01_Solo/](./01_Solo/) |
| **Team** ⭐ | R2,500/mo | R1,500 | Up to 3 | Small teams (2–15) | [02_Team/](./02_Team/) |
| **Business** | R5,500/mo | R2,500 | Up to 6 | Growing SMEs (15–50) | [03_Business/](./03_Business/) |
| **Enterprise** | Custom (from R15K/mo) | Custom (from R80K) | Unlimited (scoped) | Larger ops (50+) | [04_Enterprise/](./04_Enterprise/) |

---

## Standard Folder Structure (every plan)

Each plan folder contains exactly these files, in the same order:

```
NN_PlanName/
├── README.md                   ← plan overview + nav
├── 01_Pricing_Breakdown.md     ← every number, itemised
├── 02_Whats_Included.md        ← features, inclusions, exclusions
├── 03_Target_Customer.md       ← who it's for, who it's not for
├── 04_Sales_Copy.md            ← website + proposal copy for this tier
└── 05_ROI_Messaging.md         ← value narrative, payback math
```

**Enterprise has extras** (scoped engagements need more tooling):

```
04_Enterprise/
├── (standard 5 files above)
├── sub_tiers/                  ← Foundation / Growth / Partnership breakdowns
└── sales_tooling/              ← Discovery, pricing calculator, proposal template
```

---

## When to Edit What

| If you're changing... | Update this file first |
|-----------------------|------------------------|
| A price or setup fee | `NN_PlanName/01_Pricing_Breakdown.md` |
| What's included in a tier | `NN_PlanName/02_Whats_Included.md` |
| Who a tier targets | `NN_PlanName/03_Target_Customer.md` |
| Website or proposal copy | `NN_PlanName/04_Sales_Copy.md` |
| ROI story / value claims | `NN_PlanName/05_ROI_Messaging.md` |
| Enterprise sub-tier specifics | `04_Enterprise/sub_tiers/` |
| Enterprise sales process | `04_Enterprise/sales_tooling/` |

**After editing any plan:** sync the change into `../pricing/Pricing_Strategy.md` and `../website/Website_Copy.md` so the website matches.

---

## Cross-References

- `../pricing/Pricing_Strategy.md` — Overall pricing philosophy, margin analysis, MRR projections
- `../pricing/Pricing_Competitor_Comparison.md` — SA market benchmarks
- `../website/Website_Copy.md` — Where plan copy gets published
- `../../planning/Competitive_Copy_Audit.md` — Competitor positioning
