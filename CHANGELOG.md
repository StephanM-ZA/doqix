# Changelog

All notable changes to this project are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- ROI Calculator V1 — WordPress plugin with admin settings, Themify integration (`assets/doqix-roi-calculator/`)
- ROI Calculator V2 — Enhanced WordPress plugin with same fixes (`assets/doqix-roi-calculator-v2/`)
- Workflow Advisor v1.2 — WordPress plugin with 10 categories, 31 services, 15 workflows (`assets/doqix-workflow-advisor/`)
  - Step-level tool category matching (active/inactive step visualization)
  - Live refresh, tab badges, chip bar, brand logos (22 SVG + 9 colored initials)
- Standalone Workflow Advisor test HTML (`assets/doqix-workflow-advisor-test.html`)
- ROI Calculator V1 deployment zip (`assets/doqix-roi-calculator.zip`)

### Fixed
- Themify `get_theme_accent_color()` across all plugins
- Centered heading/intro, 11px footnote, smaller mobile slider thumbs (ROI plugins)

### Planned
- Figma design prototypes
- Live deployment configuration
- Contact form integration
- Analytics setup

---

## [0.1.0] - 2026-02-12

**Tag:** `v0.1.0`
**Branch:** `main`

### Added

- Project documentation structure
  - Website architecture (DoQix_Architecture.md)
  - Site map and navigation (DoQix_SiteMap.md)
  - Page structure and components (DoQix_Structure.md)
  - Complete page wireframes (DoQix_Wireframe.md)
  - Service pricing strategy (Pricing_Strategy.md)
  - SEO optimization plan (SEO_Strategy.md)
  - Social media marketing plan (Social_Media_Plan.md)
  - Competitor analysis for South African market (SA_Competitor_List.md)
  - Complete website copy (Website_Copy.md)
  - Terms and conditions (SA law, POPIA, CPA compliance)
  - Security implementation guide
  - n8n security recommendations (CVE-2025-68668, POPIA compliance)

- ROI Calculator Widget
  - Interactive HTML calculator (assets/roi_calculator/roi-calculator.html)
  - Three-tier calculation system (People, Hours, Rate)
  - Visual progress bars with abbreviations
  - 600% ROI validation warning
  - Responsive mobile/desktop design
  - WordPress integration ready

- Project configuration
  - README.md with project overview and structure
  - CHANGELOG.md for version tracking
  - .gitignore with security patterns
  - CHECKPOINT.md for session state tracking

### Security

- Comprehensive n8n security hardening guide
- POPIA compliance framework (Operator + Responsible Party roles)
- Multi-tenant architecture recommendations
- Backup and disaster recovery procedures
- South African data sovereignty considerations

---

## Version History

| Version | Date | Tag | Status |
|---------|------|-----|--------|
| 0.1.0 | 2026-02-12 | v0.1.0 | Initial |

---

**End of Changelog**

> **Last Updated:** 2026-02-12
