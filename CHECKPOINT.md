# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-19
**Branch:** main (website), plugins (WordPress plugins)
**Version:** web-v0.1.1

---

## Completed This Session

1. **Em dash cleanup** — Removed all em dashes (~200+) from Website_Copy.md, next-prompt.md, and index.html
2. **ROI Calculator** — Built interactive calculator from V1 plugin, dark-themed, config-driven, inserted into index page
3. **Callout component** — Added `.callout` with `.orange` and `.teal` variants to global.css
4. **JS extraction** — All inline JS moved to external files (js/main.js, js/testimonial-carousel.js, js/roi-calculator.js)
5. **No-hardcode rule** — Slider config moved to JS CONFIG object, HTML is bare markup
6. **Black text fix** — All #0a0a0f changed to #0D2028 across all files
7. **Heading consistency** — Removed trailing periods from all headings
8. **GitHub push** — All files committed and pushed, tagged web-v0.1.1
9. **Root sync** — Design files synced to root for GitHub Pages deployment
10. **Custom domain** — digitaloperations.co.za configured in GitHub Pages, DNS records updated at Xneelo

## Rules Established

- No inline JS (external files only, HTML stays minimal)
- No em dashes in copy
- No hardcoding (values in JS/CSS config)
- Version tag (web-vX.Y.Z) on every website push
- Sync design/ to root on every push (GitHub Pages serves from main:/)
- main = website, plugins = WordPress plugins
- Black text = #0D2028, never #000 or #0a0a0f

## Current State

- Homepage design complete with ROI calculator
- DNS propagating for digitaloperations.co.za → GitHub Pages
- HTTPS pending (GitHub auto-provisions SSL certificate)
- 9 other pages still need design work

## Next Steps

1. Confirm DNS propagation and enable HTTPS
2. Start services page design
3. Sync site/ folder structure (currently outdated)

---

## Resume Command
Say "resume" to continue.
