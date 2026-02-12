# Do.Qix Website

> Documentation and planning repository for the Do.Qix automation services website.

**Repository:** Local (no remote)
**Version:** v0.1.0
**License:** Proprietary
**Visibility:** Private

---

## Overview

Do.Qix is a South African automation services company helping businesses streamline operations through no-code/low-code automation solutions. This repository contains all planning, documentation, and assets for the company website including architecture, wireframes, content strategy, SEO plans, and security recommendations for the self-hosted n8n infrastructure.

---

## Features

<!-- Update this section with each new feature -->

| Feature | Description | Added |
|---------|-------------|-------|
| Project Documentation | Complete website planning and architecture docs | v0.1.0 |
| ROI Calculator | Interactive HTML widget for calculating automation ROI | v0.1.0 |
| Security Recommendations | Comprehensive n8n security and POPIA compliance guide | v0.1.0 |

### Planned Features

- [ ] WordPress implementation
- [ ] Figma design prototypes
- [ ] Live deployment configuration
- [ ] Contact form integration
- [ ] Analytics setup

---

## Quick Start

### Prerequisites

- No build requirements (documentation repository)
- For ROI calculator testing: Modern web browser
- For WordPress integration: WordPress 5.0+ with Themify or similar page builder

### Project Structure

```
doqix_website/
├── docs/                           # All project documentation
│   ├── DoQix_Architecture.md      # Technical architecture and stack decisions
│   ├── DoQix_SiteMap.md           # Site navigation structure
│   ├── DoQix_Structure.md         # Page layout and component structure
│   ├── DoQix_Wireframe.md         # Detailed wireframes for all pages
│   ├── Pricing_Strategy.md        # Pricing model and tiers
│   ├── SA_Competitor_List.md      # South African competitor analysis
│   ├── SEO_Strategy.md            # Search optimization strategy
│   ├── Social_Media_Plan.md       # Social media marketing plan
│   ├── Terms_and_Conditions.md    # Legal terms (SA law, POPIA, CPA)
│   ├── Website_Copy.md            # All website content and copy
│   ├── Security_Implementation_Guide.md  # General security practices
│   └── n8n_Security_Recommendations.md   # n8n-specific security hardening
├── assets/
│   └── roi_calculator/
│       └── roi-calculator.html    # Interactive ROI calculator widget
├── planning/                      # Historical planning artifacts
├── remotion-video/                # Video content materials
├── CHECKPOINT.md                  # Session state tracking
├── CHANGELOG.md                   # Version history
├── README.md                      # This file
└── .gitignore                     # Git exclusion patterns
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [CHANGELOG.md](./CHANGELOG.md) | Version history and changes |
| [DoQix_Architecture.md](./docs/DoQix_Architecture.md) | Technical architecture and stack |
| [DoQix_Wireframe.md](./docs/DoQix_Wireframe.md) | Complete page wireframes |
| [Website_Copy.md](./docs/Website_Copy.md) | All website content |
| [Pricing_Strategy.md](./docs/Pricing_Strategy.md) | Service pricing and tiers |
| [SEO_Strategy.md](./docs/SEO_Strategy.md) | Search optimization plan |
| [n8n_Security_Recommendations.md](./docs/n8n_Security_Recommendations.md) | Security hardening guide |

---

## Key Components

### ROI Calculator

Interactive HTML widget located at `/assets/roi_calculator/roi-calculator.html`

**Features:**
- Three-tier calculation (People, Hours Saved, Hourly Rate)
- Visual tier progress bars with abbreviations (5k, 10k, 25k, etc.)
- Smart validation and 600% ROI warning
- Responsive design for mobile/desktop
- Ready for WordPress integration

**Testing:** Open `roi-calculator.html` directly in browser

### Security Documentation

Comprehensive security guide covering:
- **CVE-2025-68668** (CVSS 9.9) — Critical n8n vulnerability
- POPIA compliance (dual role: Operator + Responsible Party)
- Multi-tenant architecture for client isolation
- Backup, monitoring, and disaster recovery
- South African hosting considerations (AWS Cape Town, Hetzner SA)

---

## Development Workflow

This is a documentation repository. Changes follow this workflow:

1. Create feature branch from `main`
2. Update relevant documentation
3. Follow commit message format (see CHANGELOG)
4. Merge back to `main`

**Commit format:** Conventional Commits (feat:, fix:, docs:, etc.)

---

## Outstanding Tasks

From CHECKPOINT.md:

1. Review security doc with IT security professional and POPIA specialist
2. Immediate security actions: register Information Officer, publish PAIA Section 51 manual
3. Draft DPA template for client contracts
4. Browser testing for ROI calculator (all tiers, responsive views)
5. WordPress integration testing (Themify Custom HTML module)
6. Replace placeholder testimonials with real client quotes
7. Design phase (Figma prototyping)
8. Build phase (WordPress implementation)

---

## Placeholders to Replace

**In Website_Copy.md:**
- Testimonials (Jane M., David K., Thandi N.)
- Phone/WhatsApp numbers (`[number]`)
- Case study links on Thank You page

---

## License

Proprietary - Do.Qix Digital Operations

---

> **Maintained by:** Digital Operations Team
> **Last Updated:** 2026-02-12
