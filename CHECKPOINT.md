# CHECKPOINT — Do.Qix Website

**Date:** February 11, 2026
**Status:** n8n Security Recommendations document created. ROI Calculator tier logic overhaul complete from prior session.
**Tool call count:** ~12 this session

---

## What Was Done This Session — n8n Security Recommendations

### Created: `docs/n8n_Security_Recommendations.md`

Comprehensive security hardening document for Do.Qix's self-hosted n8n infrastructure. Two parallel research agents gathered findings on n8n security and POPIA compliance, then results were compiled into a single actionable document.

### Document Contents (11 sections, 26-item checklist)

| Section | Key Content |
|---------|-------------|
| 1. Critical CVE | CVE-2025-68668 (CVSS 9.9) — Python Code Node sandbox escape. Upgrade to v2.0.0+ mandatory. |
| 2. Infrastructure | Traefik reverse proxy, SA hosting options (AWS Cape Town, Hetzner SA), firewall rules |
| 3. n8n Application Security | Essential env vars, encryption key management, webhook auth, RBAC limitations |
| 4. Docker Hardening | Full production Docker Compose (Traefik + PostgreSQL + n8n + task runner), container checklist |
| 5. Database Security | PostgreSQL hardening (SSL, SCRAM-SHA-256, pg_hba.conf, dedicated user) |
| 6. Backup & Recovery | Daily automated encrypted backup script, restore procedure, monthly test schedule |
| 7. POPIA Compliance | Dual role (Operator + Responsible Party), DPA requirements, PIIA, breach notification, juristic person protection, enforcement actions, PAIA Section 51 manual, automated decision-making (Section 71) |
| 8. Multi-Tenant | Separate instances per client recommended (no RBAC in Community Edition) |
| 9. Monitoring | Prometheus + Grafana + UptimeRobot, alert conditions, n8n Error Workflow |
| 10. Update Management | Version pinning, 48hr security patch cadence, v2.0.0 breaking changes |
| 11. Load-Shedding | Cloud hosting eliminates risk; on-premises needs UPS + graceful shutdown + LTE failover |

### Key Findings

- **CVE-2025-68668** — critical n8n vulnerability (CVSS 9.9), fixed in v2.0.0. External task runners now mandatory.
- **POPIA dual role** — Do.Qix is Operator for client workflows but Responsible Party for execution logs/metadata/own business data
- **Juristic person protection** — POPIA uniquely protects companies (not just people). International DPAs designed for GDPR may have gaps.
- **Enforcement is real** — R5M fine to Dept of Education, R500k to Blouberg Municipality, R100k to Lancet Labs. Max penalty R10M + 10 years.
- **Community Edition has no RBAC** — separate instances per client is the only way to isolate data
- **PAIA Section 51 manual** — must be published on website (mandatory, often overlooked)

---

## Files Modified This Session

| File | Action |
|------|--------|
| `docs/n8n_Security_Recommendations.md` | Created — 11 sections, production configs, 26-item checklist |
| `CHECKPOINT.md` | Updated |

---

## Files Modified in Prior Sessions (same conversation)

| File | Action |
|------|--------|
| `assets/roi_calculator/roi-calculator.html` | Major refactor — tier logic, display caps, abbreviations, labels, total hours |
| `docs/DoQix_Structure.md` | Products page, nav, footer, Terms & Conditions |
| `docs/Website_Copy.md` | Products page copy, nav, footer, SEO |
| `docs/Terms_and_Conditions.md` | Created — 17 sections, SA law, POPIA, CPA |
| `docs/DoQix_Wireframe.md` | ROI section updated |

---

## All Docs in `/docs/`

| File | Status |
|------|--------|
| DoQix_Architecture.md | Finalized |
| DoQix_SiteMap.md | Finalized |
| DoQix_Structure.md | Finalized |
| DoQix_Wireframe.md | Finalized |
| Pricing_Strategy.md | Finalized |
| SA_Competitor_List.md | Finalized |
| SEO_Strategy.md | Finalized |
| Social_Media_Plan.md | Finalized |
| Terms_and_Conditions.md | Finalized |
| Website_Copy.md | Finalized |
| n8n_Security_Recommendations.md | **New this session** |

---

## Key Decisions

- **Separate n8n instances per client** — recommended for POPIA compliance (no RBAC in Community Edition)
- **SA cloud hosting preferred** — AWS Cape Town or Hetzner SA for data sovereignty + load-shedding resilience
- **PostgreSQL required** — SQLite not suitable for production
- **DPA with every client** — mandatory under Section 21
- **Information Officer registration** — mandatory, CEO/MD is default by law
- **Execution data auto-pruning** — 7-day default, adjust per client DPA

---

## Placeholders Still in Website_Copy.md
- Testimonials (Jane M., David K., Thandi N.) — placeholder until real quotes
- Phone/WhatsApp numbers — `[number]`
- Case study links on Thank You page

---

## Next Steps

1. **Review security doc** — have IT security professional and POPIA specialist review `n8n_Security_Recommendations.md`
2. **Immediate actions from checklist** — register Information Officer, publish PAIA Section 51 manual, upgrade n8n to v2.0.0+
3. **DPA template** — draft a standard operator agreement / data processing addendum for client contracts
4. **Browser testing (calculator)** — test all tier scenarios, verify 600% ROI gate, check responsive views
5. **WordPress test** — paste calculator into Themify Custom HTML module
6. **Consider slider max reduction** — People: 50→20, Hours: 40→20, Rate: R1,000→R500
7. **Contact form pre-fill** — should calculator values carry through to contact page?
8. **Replace placeholder testimonials** with real client quotes
9. **Design phase** — Figma prototyping
10. **Build phase** — WordPress implementation

---

## Uncommitted Changes

Not a git repository — no git state to track.
