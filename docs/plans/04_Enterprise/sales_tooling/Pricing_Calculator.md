# 02 — Enterprise Pricing Calculator

> Bottom-up worksheet to turn discovery findings into a quote number.
> Use this *after* discovery, *before* writing the proposal.

**Version:** 1.0 · **Date:** 2026-04-15

---

## How to Use

1. Fill in **Section A** (inputs) from your discovery notes.
2. Work through **Section B** (build cost).
3. Work through **Section C** (monthly retainer).
4. Apply **Section D** (modifiers).
5. Map the result to the nearest tier in [01_Pricing_Model.md](./01_Pricing_Model.md).
6. Round to clean numbers (R5K increments). Never quote odd figures.

---

## SECTION A — Inputs (from discovery)

| Input | Value |
|-------|-------|
| Number of workflows in scope | _____ |
| Number of distinct system integrations | _____ |
| Integration complexity (simple / medium / hard) | _____ |
| Expected monthly run volume | _____ |
| Number of users / stakeholders to train | _____ |
| SLA tier required (standard / priority / 24-7) | _____ |
| Compliance requirements (POPIA / ISO / PCI / other) | _____ |
| Legacy/on-prem systems involved? (Y/N) | _____ |
| First-time enterprise client? (Y/N) | _____ |

---

## SECTION B — Build Cost (one-off setup)

### B1. Per-workflow build hours

| Workflow complexity | Hours (each) |
|---------------------|--------------|
| Simple (1–2 systems, happy path) | 8–16 hrs |
| Medium (3–4 systems, error handling, branching) | 16–40 hrs |
| Hard (5+ systems, custom logic, legacy APIs) | 40–100 hrs |

**Formula:**
```
Build hours = Σ (hours per workflow × number of workflows)
```

### B2. Blended rate
- Junior build: R850/hr
- Mid: R1,100/hr
- Senior / solutions: R1,500/hr
- **Default blended:** R1,100/hr

### B3. Base build cost
```
Base build = build hours × R1,100
```

### B4. Uplift — integration complexity
- Simple stack (REST APIs, common SaaS): +0%
- Medium (OAuth dances, legacy SOAP, rate-limit gymnastics): +15–25%
- Hard (on-prem, custom DBs, SAP/Oracle, file drops): +30–40%

### B5. Uplift — risk buffer (first-time enterprise)
- Known client / similar past work: +0%
- New client / familiar stack: +15%
- New client / new stack: +25–30%

### B6. Uplift — compliance overhead
- Standard: +0%
- POPIA-only: +5%
- POPIA + ISO/PCI/sector-specific: +15–25%

### B7. Fixed additions
| Item | Cost |
|------|------|
| Discovery sprint (if separate) | R15K–R30K |
| Training & handover | R15K–R40K |
| Documentation package | R10K–R25K |
| Security review (if required) | R20K–R60K |

### B8. TOTAL SETUP QUOTE
```
Setup = B3 × (1 + B4 + B5 + B6) + B7
```
Round up to nearest R5,000.

---

## SECTION C — Monthly Retainer

### C1. Hosting & infra pass-through
| Scale | Monthly |
|-------|---------|
| Small (< 10K runs/mo) | R1,500 – R3,500 |
| Medium (10K–100K runs/mo) | R3,500 – R8,000 |
| Large (100K+ runs/mo) | R8,000 – R25,000+ |

### C2. Support hours bucket
| SLA tier | Hours/mo included | Rate |
|----------|-------------------|------|
| Standard (email, 48hr) | 4 hrs | R1,100 |
| Priority (email + WhatsApp, 8hr) | 8 hrs | R1,100 |
| 24-7 on-call | 12 hrs + on-call premium | R1,500 |

### C3. Monitoring & proactive checks
- Flat: R3,000–R6,000/mo (depending on number of workflows)

### C4. Margin uplift
Multiply C1+C2+C3 by **1.6–1.8x** (i.e. 60–80% margin on managed service).

### C5. Change-request credit pool (optional, Growth+)
- 10 hrs/mo at reduced rate (R950/hr) = R9,500/mo
- Unused hours roll over 1 quarter max

### C6. TOTAL MONTHLY
```
Monthly = (C1 + C2 + C3) × 1.7 + C5 (if included)
```
Round to nearest R1,000.

---

## SECTION D — Modifiers (final sanity check)

| Factor | Adjustment |
|--------|-----------|
| Multi-year commitment (2+ yrs) | −10% monthly |
| Reference customer / case study rights | −5% monthly |
| Strategic logo for new sector | −10% overall (max) |
| Aggressive timeline (< 6 weeks to go-live) | +20% setup |
| Multi-entity / multi-region | +25–50% setup |
| After-hours cutover required | +R15K fixed |

**Rule:** Never stack more than 15% total discount.

---

## SECTION E — Worked Example

**Scenario:** Mid-market logistics firm, 6 workflows, 4 integrations (Xero, Shopify, custom WMS, WhatsApp Business), POPIA required, new client, standard SLA.

| Step | Calc | Value |
|------|------|-------|
| B1 | 4 medium (25hr each) + 2 hard (60hr each) = 220 hrs | 220 hrs |
| B3 | 220 × R1,100 | R242,000 |
| B4 | Medium complexity uplift: +20% | ×1.20 |
| B5 | New client / familiar stack: +15% | ×1.15 |
| B6 | POPIA: +5% | ×1.05 |
| B7 | Discovery R25K + Training R30K + Docs R15K | +R70,000 |
| **Setup total** | 242,000 × 1.20 × 1.15 × 1.05 + 70,000 | **≈ R420,000** |
| C1 | Medium volume | R5,000 |
| C2 | Priority SLA (8hr × R1,100) | R8,800 |
| C3 | Monitoring | R5,000 |
| C4 | (5,000 + 8,800 + 5,000) × 1.7 | R31,960 |
| C5 | Change-request pool | R9,500 |
| **Monthly total** | Round | **R42,000/mo** |

→ Falls between Growth and Partnership. Quote as **Growth+** or position **Partnership** to anchor and let them step down to a customised Growth.

---

## SECTION F — Quote Output Template

Paste this into the proposal (04_Proposal_Template.md, Pricing section):

```
Implementation (one-off):    R_________
  Invoiced 50% on signature, 50% on go-live

Managed Service (monthly):   R_________ /month
  Invoiced monthly in advance
  Includes: [list from C2/C3/C5]

Term:                        12 months
Annual uplift:               CPI + up to 3%
Termination:                 90 days written notice
```
