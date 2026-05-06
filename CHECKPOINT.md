# CHECKPOINT — Do.Qix Website

**Date:** 2026-05-06
**Branch:** main
**Tag (current):** web-v0.12.0 (being committed in this session)
**Previous tag:** web-v0.11.0

---

## State at commit web-v0.12.0

All changes staged and committed. Push to origin main with --tags in progress.

### What shipped in web-v0.12.0

1. **5W info popup** — pulsating info trigger on every product card opens a Who/What/Why/When/Where popup styled like the build-popup. Hash deep-linking via `data-product`. Keyboard a11y. JS in `design/components/js/info-popup.js`.
2. **SocialIQ product** — 5th product card on products.html, full tab on products-terms.html, deep-link prefill on contact form, popup 5W copy, web-optimised hero image (WebP 64K + JPG 57K, both 1200x1200). Pricing: "From R499/mo" scaling model.
3. **Right-chevron common component** — CSS-drawn chevron via `.btn::after` (hover nudge). Replaces Unicode arrow. Suppressed on `.btn-back` and `.no-arrow`. Hardcoded arrows stripped from JS button text.
4. **Product cards equal height** — `#products .card { min-height: 780px }` on md+.
5. **`.btn-ghost` strengthened** — 1.5px primary-tinted border, subtle fill, hover scale.
6. **Scroll-reveal animation removed** site-wide — IntersectionObserver stripped from main.js, all `.scroll-reveal` CSS removed from global.css, class stripped from every HTML page.
7. **"Learns from your feedback"** capability beat added to every product (pill + WHAT row addendum).
8. **Golden Rules locked** into `docs/build/Session_Checklist.md` and project memory.
9. **5W Product Marketing Strategy** — new SSOT at `docs/website/Product_5W_Strategy.md`.
10. **`.gitignore` anchored** `/build/` and `/dist/` so `docs/build/` is trackable.
11. **Cache-bust bumped** `?v=0.11.0` → `?v=0.12.0` across all 23 HTML files.

---

## Next steps

- Verify GitHub Pages deploy completes successfully (`gh run list --workflow=deploy-site.yml`)
- Domain decision still open: swap `digitaloperations.co.za` → `doqix.co.za` in canonical/og:url/mailto across all pages? Requires doqix.co.za to be live and hello@doqix.co.za to be a working mailbox.
