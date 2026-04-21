# CHECKPOINT — Do.Qix Website

**Date:** 2026-04-21
**Branch:** main
**Latest commit:** 5cd1977 (pushed, deployed, tagged web-v0.8.5)
**Tool calls this session:** ~25

## Completed This Session (Continuation)

### Services Content Component Completed
- `services-content.js` built (396 lines) — extracts ALL services page sections into JS
- Two injection targets: `#services-content` (sections 2-8) and `#services-data-control` (section 11)
- Services.html reduced from ~738 lines to ~144 lines

### Full File Distribution Done
All component JS files from `design/components/js/` copied to:
- Every page's `js/` folder (index, services, products, contact, 404, thank-you, privacy-policy, terms-and-conditions)
- `site/js/` for deployment
- Old `testimonial-carousel.js` and `components.js` removed

### Cache-Bust Version Bump
- All 143 `?v=0.7.8` references updated to `?v=0.9.0` across all HTML files

### Site Sync Complete
- All 8 HTML files synced from `design/` to `site/` with path fixes (`../global.css` → `global.css`, etc.)
- `global.css` synced to `site/`
- All JS files in `site/js/`

## Still Pending

### 1. Commit and Push with New web-v Tag
- Stage all changes
- Commit with descriptive message about JS component extraction
- Tag as `web-v0.9.0` (major feature: all content extracted to JS components)
- Push commit + tag
- Verify GitHub Pages build

## Summary of All Components (source of truth: design/components/js/)
1. **tailwind-config.js** — Shared Tailwind theme config
2. **header.js** — Site header/nav
3. **footer.js** — Site footer + back-to-top button
4. **main.js** — Scroll-reveal + doqixReveal utility (source: design/index/js/)
5. **testimonials.js** — 7 client testimonials + carousel
6. **bottom-cta.js** — Parameterised CTA via data attributes
7. **faq.js** — 7 FAQ items + JSON-LD structured data
8. **products.js** — 4 product cards + Why Products + Cross-Sell
9. **services-content.js** — All services page content (8 sections)
10. **roi-calculator.js** — ROI calculator widget
11. **pricing.js** — 4 pricing plan cards
12. **cookie-banner.js** — Cookie consent banner
13. **exit-popup.js** — Exit-intent popup
