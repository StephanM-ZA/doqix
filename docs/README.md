# Do.Qix Docs — Master Index

> All project documentation, organised by purpose.
> Each subfolder groups related docs; start here to find anything.

**Last reorganised:** 2026-04-15

---

## Folder Map

| Folder | What's inside | When to look here |
|--------|---------------|-------------------|
| [architecture/](./architecture/) | Technical architecture, site map, wireframes, page structure | Building or changing the website |
| [website/](./website/) | Website copy, SEO strategy, social media plan | Editing what's on the site or in marketing |
| [pricing/](./pricing/) | Pricing strategy, competitor pricing comparison | Changing prices, margins, or positioning |
| [plans/](./plans/) | Full breakdown per pricing tier (Solo / Team / Business / Enterprise) | Editing any specific plan — pricing, inclusions, copy, ROI |
| [market/](./market/) | SA competitor list and landscape | Researching competition or positioning |
| [security/](./security/) | Security implementation, n8n security recommendations | Any security, compliance, or hosting decisions |
| [legal/](./legal/) | Terms & conditions | Contract or legal copy changes |
| [build/](./build/) | Build checklist for site implementation | Sprint planning / implementation |
| [superpowers/](./superpowers/) | Tool-specific working files | Working with superpowers-style skills |

---

## Quick File Lookup (alphabetical)

| File | Folder |
|------|--------|
| `Build_Checklist.md` | [build/](./build/) |
| `DoQix_Architecture.md` | [architecture/](./architecture/) |
| `DoQix_SiteMap.md` | [architecture/](./architecture/) |
| `DoQix_Structure.md` | [architecture/](./architecture/) |
| `DoQix_Wireframe.md` | [architecture/](./architecture/) |
| `n8n_Security_Recommendations.md` | [security/](./security/) |
| `Pricing_Competitor_Comparison.md` | [pricing/](./pricing/) |
| `Pricing_Strategy.md` | [pricing/](./pricing/) |
| `SA_Competitor_List.md` | [market/](./market/) |
| `Security_Implementation_Guide.md` | [security/](./security/) |
| `SEO_Strategy.md` | [website/](./website/) |
| `Social_Media_Plan.md` | [website/](./website/) |
| `Terms_and_Conditions.md` | [legal/](./legal/) |
| `Website_Copy.md` | [website/](./website/) |
| **Plans (tiered)** | [plans/](./plans/) → see `plans/README.md` |

---

## When to Edit What

| If you're changing... | Edit here |
|-----------------------|-----------|
| Website copy (any page) | `website/Website_Copy.md` |
| A pricing tier's details | `plans/NN_TierName/` (then sync `pricing/Pricing_Strategy.md` + `website/Website_Copy.md`) |
| Overall pricing philosophy / margins | `pricing/Pricing_Strategy.md` |
| Site architecture / stack | `architecture/DoQix_Architecture.md` |
| Page layouts / wireframes | `architecture/DoQix_Wireframe.md` |
| Page structure / sections | `architecture/DoQix_Structure.md` |
| SEO / keywords | `website/SEO_Strategy.md` |
| Social media plan | `website/Social_Media_Plan.md` |
| Terms & conditions | `legal/Terms_and_Conditions.md` |
| Security / compliance | `security/` |
| Build tasks | `build/Build_Checklist.md` |

**Rule:** After editing a plan or pricing doc, check whether the change needs to propagate to `website/Website_Copy.md` for the live site.

---

## Related Folders (outside docs/)

- `../planning/` — Research, strategy, pre-docs drafts, competitive audits
- `../assets/` — WordPress plugin source
- `../remotion-video/` — Video asset source
- `../CLAUDE.md` — Project-level AI instructions
- `../CHECKPOINT.md` — Session state
