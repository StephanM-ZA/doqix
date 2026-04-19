# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-19
**Branch:** main
**Version:** web-v0.4.3 (pushed, clean)

---

## Homepage (index.html) — COMPLETE

### Features Built
1. **Hero** — Video background (10% opacity), headline, proof points with double-ring bullets, CTA
2. **Problem section** — Pain points with stats
3. **Solution section** — Feature cards
4. **How it works** — Step-by-step timeline
5. **ROI Calculator** — Config-driven sliders, tier recommendations, contextual nudges, share button
6. **Pricing** — 4 tiers (Solo R999, Team R2500, Business R5500, Enterprise custom), dynamic highlight from calculator
7. **Testimonials** — Infinite carousel with autoplay
8. **CTA section** — Final conversion block
9. **Header** — Logo image, nav links with teal hover, mobile hamburger menu, feathered bottom edge
10. **Footer** — Logo, contact info (email, phone, WhatsApp, location), nav/legal/social links, copyright

### Design System Established
- **Background:** Royal Navy #0C1830 with full surface hierarchy
- **Logo:** logo_new_green.png (header 3rem, footer 10rem width)
- **Favicon:** favicon_green.png
- **Font:** Inter only
- **Accent:** Teal #00e5a0, Amber #ff8000
- **Common components in global.css:** .bullet-list, .banner, .callout, .card, .btn variants, pricing cards, footer/header styles
- **Component HTML snippets:** design/components/header.html, design/components/footer.html

### Rules (in CLAUDE.md + memory)
- No inline JS
- No em dashes
- No hardcoding
- Version tag (web-vX.Y.Z) on every push
- Cache-bust (?v=X.Y.Z) on all CSS/JS links
- Sync design/ to root on every push
- main = website, plugins = WordPress plugins

---

## Pages To Build

| Page | Stitch Design | Status |
|------|--------------|--------|
| index.html | design/index/ | DONE |
| services.html | design/services/ | TODO |
| products.html | design/products/ | TODO |
| contact.html | design/contact/ | TODO |
| privacy-policy.html | design/privacy-policy/ | TODO |
| terms-and-conditions.html | design/terms-and-conditions/ | TODO |
| thank-you.html | design/thank-you/ | TODO |
| 404.html | design/404/ | TODO |
| cookie-banner.html | design/cookie-banner/ | TODO (overlay component) |
| exit-popup.html | design/exit-popup/ | TODO (overlay component) |

### Each Page Needs
1. Link global.css (with cache-bust version)
2. Update Tailwind config to Royal Navy colour scheme
3. Use common header from components/header.html
4. Use common footer from components/footer.html
5. Strip Stitch inline styles, use global.css classes
6. Fix copy (no em dashes)
7. External JS only
8. Sync to root with path fixes

---

## Contact Details
- Email: stephan@digitaloperations.co.za
- Phone: +27 61 514 8375
- WhatsApp: wa.me/27615148375
- Location: Cape Town, South Africa

## Deployment
- GitHub Pages: digitaloperations.co.za/doqix/
- Two-repo setup: stephanm-za.github.io (CNAME) + doqix (content)
- Cloudflare DNS, SSL active

---

## Resume Command
Say "resume" to continue with services page.
