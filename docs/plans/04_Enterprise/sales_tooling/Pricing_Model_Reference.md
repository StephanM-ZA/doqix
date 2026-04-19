# 01 — Enterprise Pricing Model

> The costing framework, industry benchmarks, and margin logic behind every enterprise quote.

**Version:** 1.0 · **Date:** 2026-04-15

---

## 1. The Three Industry Models

| Model | How it works | When to use |
|-------|--------------|-------------|
| **Custom retainer + setup** | One-off setup fee + monthly managed service | **Do.Qix default.** Most SA enterprise deals. |
| **Consumption-based** | Per-task / per-run / per-operation | When volume is stable and easy to measure. Risky if volume spikes. |
| **Value-based / outcome-based** | % of documented annual savings (20–30%) | Premium sell, hard to land, highest margin. Use the *narrative* even if not the structure. |

**Do.Qix approach:** Structure as **retainer + setup** (#1), **sell with the value narrative** (#3).

---

## 2. South African Enterprise Benchmarks (ZAR)

| Component | Typical Range | Notes |
|-----------|---------------|-------|
| Discovery & scoping sprint | R15K – R60K | 1–2 weeks. Credit against build. |
| Build per workflow | R8K – R40K | Complexity & integration dependent |
| Full enterprise setup (multi-workflow) | R75K – R500K+ | Onboarding, SSO, security review, training |
| Monthly managed retainer | R15K – R80K+ | Hosting, monitoring, SLA, minor changes |
| Change request / new workflow | R5K – R25K each | Or bundled in quarterly credit pool |
| Dedicated solutions engineer | R25K – R60K/mo | Top-tier partnerships only |

### International Benchmarks (context only)

| Platform / Firm | Typical Enterprise Deal |
|-----------------|------------------------|
| Workato | $10K – $50K/yr platform + services |
| Tray.io | $2K – $10K/mo + implementation |
| Boomi / MuleSoft | $50K – $500K/yr enterprise contracts |
| n8n-based global agencies | $2K – $15K/mo retainers |

---

## 3. Do.Qix Enterprise Packages

Every enterprise proposal presents **three options**. The middle is the anchor.

### Option A — Foundation
- **Setup:** ~R80,000
- **Monthly:** ~R15,000
- Scope: 3 core workflows, standard integrations, email support, monthly check-in
- For: companies testing the waters, small ops team

### Option B — Growth *(recommended)*
- **Setup:** ~R180,000
- **Monthly:** ~R35,000
- Scope: 6–8 workflows, priority integrations, SLA support, quarterly reviews, change-request credit pool
- For: established mid-market, multi-department rollout

### Option C — Partnership
- **Setup:** ~R400,000
- **Monthly:** ~R65,000
- Scope: Unlimited workflow coverage, dedicated solutions engineer, SSO & security review, monthly roadmap, on-call SLA
- For: true enterprise, regulated industries, high-integration complexity

> Numbers are **anchors**, not fixed. Final quote comes from [02_Pricing_Calculator.md](./02_Pricing_Calculator.md).

---

## 4. Bottom-Up Costing Formula

```
BUILD COST
  = (estimated build hours) × (blended rate: R850 – R1,500/hr)
  + integration complexity premium (15%–40% uplift on tricky APIs)
  + risk buffer (20%–30% on first-time enterprise clients)

MANAGED SERVICE (monthly)
  = hosting & infra pass-through
  + monitoring/support hours × rate
  + margin (50%–70%)

ANNUAL UPLIFT
  = 7%–10% CPI-linked clause in contract
```

See [02_Pricing_Calculator.md](./02_Pricing_Calculator.md) for the worksheet.

---

## 5. What's In vs Out of the Retainer

### Included in monthly retainer
- Hosting, uptime monitoring, infrastructure
- Minor tweaks (< 2 hours each)
- Quarterly review session
- One workflow health-check per month
- Email/ticket support within SLA

### Excluded (billed separately)
- New workflows
- Major refactors of existing workflows
- New system integrations
- Training beyond initial onboarding
- Out-of-hours emergency support
- Custom reporting / BI dashboards

---

## 6. Contract Structure

| Clause | Standard |
|--------|----------|
| Term | 12 months minimum |
| Invoicing | Monthly in advance |
| Setup fee | Paid 50% upfront, 50% on go-live |
| Termination | 90 days' written notice |
| Annual uplift | 7–10% CPI-linked |
| SLA | Defined per tier (Foundation/Growth/Partnership) |
| IP | Client owns workflows; Do.Qix retains reusable components |
| Data | Client data stays in client environment where possible |

---

## 7. Margin Targets (internal only)

| Item | Target Gross Margin |
|------|---------------------|
| Setup/implementation | 40–55% |
| Monthly retainer | 55–70% |
| Change requests | 50–65% |
| Blended engagement | **≥ 50%** |

Track actuals per engagement in a "landed cost" sheet — real delivery hours vs quoted. If margin drops below 40% on any engagement, escalate.

---

## 8. Pricing Levers (when to flex)

**Raise price when:**
- Regulated industry (financial services, healthcare, legal)
- Custom SLA demands (99.9%+, on-call, < 1hr response)
- Integration with legacy/on-prem systems
- High transaction volume (> 10K runs/day)
- Multi-entity / multi-country deployment

**Consider discount (max 15%) when:**
- Multi-year contract commitment (minimum 2 years)
- Reference-customer rights + case study participation
- Pre-paid annual
- Strategic logo for sector entry

**Never discount:**
- To close faster
- Because the buyer "asked"
- Without getting something in return

---

## 9. Common Pricing Objections & Responses

| Objection | Response |
|-----------|----------|
| "It's too expensive" | Reframe: "What's the cost of not doing it? We're replacing [X hours × Y staff × R rate] of weekly waste." |
| "Can you come down 20%?" | "I can adjust scope, not price. What would you like to take out?" |
| "Competitor X is cheaper" | "What's included in their quote? Usually it's software-only, no delivery, no managed service." |
| "We need to start smaller" | "Foundation tier is designed for exactly that. Here's what it gets you." |
| "Let us think about it" | "Of course. What specifically do you need to decide on? I'll send a one-pager summarising the options." |
