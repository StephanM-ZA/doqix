# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-19
**Branch:** main (website), plugins (WordPress plugins)
**Version:** web-v0.3.0

---

## Completed This Session

1. **Em dash cleanup** — Removed ~200+ em dashes from Website_Copy.md, next-prompt.md, index.html
2. **ROI Calculator** — Built from V1 plugin, dark-themed, config-driven JS, inserted into index
3. **Callout component** — `.callout` with `.orange`/`.teal` variants in global.css
4. **JS extraction** — All JS in external files (js/main.js, js/testimonial-carousel.js, js/roi-calculator.js)
5. **No-hardcode** — Slider config in JS CONFIG object, HTML bare markup
6. **Text colour** — All #0a0a0f changed to #0C1830 (text on accent matches background)
7. **Heading consistency** — Removed trailing periods from all headings
8. **Background colour** — Royal Navy #0C1830 with full surface colour scheme, gradient at 10%
9. **GitHub Pages** — Two-repo setup: stephanm-za.github.io (custom domain) + doqix (website)
10. **Custom domain** — digitaloperations.co.za configured via Cloudflare DNS

## Rules Established (in CLAUDE.md + memory)

- No inline JS (external files only)
- No em dashes in copy
- No hardcoding (values in JS/CSS config)
- Version tag (web-vX.Y.Z) on every website push
- Sync design/ to root on every push
- main = website, plugins = WordPress plugins
- Text on accent = #0C1830

## Background Colour Scheme (Royal Navy #0C1830)

| Role | Value |
|------|-------|
| Body bg | #0C1830 |
| Deeper sections | #081024 |
| Section bg alt | #101C36 |
| Container | #14203C |
| Container high | #1A2A48 |
| Container highest | #1E3050 |
| Surface bright | #223656 |
| Card bg | #14203C |
| Footer bg | #060C1C |
| Hero gradient | rgba(0, 229, 160, 0.10) |

## Deployment Setup

- **stephanm-za.github.io** repo — holds CNAME for digitaloperations.co.za
- **doqix** repo — website files, serves at digitaloperations.co.za/doqix/
- Cloudflare DNS — 4x A records (185.199.*) DNS only + www CNAME
- SSL pending GitHub certificate provisioning

## Next Steps

1. Confirm SSL and site live at digitaloperations.co.za/doqix/
2. Start services page design
3. Update remaining pages with Royal Navy colour scheme

---

## Resume Command
Say "resume" to continue.
