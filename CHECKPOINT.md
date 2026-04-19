# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-19
**Branch:** main
**Version:** web-v0.4.1 (pushed), uncommitted changes pending

---

## Completed This Session

1. **Logo & favicon** — Replaced text "Do.Qix" with logo_new_green.png in header (3rem) and footer (10rem width), added favicon_green.png
2. **Footer redesign** — Contact info with icons (email, phone, WhatsApp SVG, location), social links (LinkedIn, Instagram, Facebook), footer-top/footer-bottom layout, removed "Efficiency, Engineered"
3. **Hero video** — AdobeStock .mov converted to .mp4 (8.3MB), runs as background behind hero at 10% opacity with edge fades
4. **Mobile menu** — Hamburger icon (animated to X), full-width dropdown with nav links + CTA, hides desktop CTA on mobile
5. **Header feather** — Soft gradient fade at bottom edge of fixed nav (85% opacity, feather at 98%)
6. **Bullet list component** — Common `.bullet-list` in global.css with double-ring teal bullets (filled inner, thin outer ring)
7. **Scroll anchor offset** — `scroll-margin-top: 6rem` on all sections with IDs
8. **Nav hover** — Changed from white to teal (#00e5a0)
9. **Section spacing** — Reduced all sections from py-32 to py-20
10. **Cache-busting** — Added `?v=X.Y.Z` to all CSS/JS links, documented as MANDATORY rule
11. **Dynamic pricing highlight** — Calculator tier moves "Recommended" badge and teal border to matching pricing card
12. **Pricing banner** — Changes from orange "Launch offer" to teal "Based on your numbers, we recommend [Tier]" after calculator interaction
13. **Component snippets** — Updated header.html and footer.html in design/components/
14. **Contact details** — Email: stephan@digitaloperations.co.za, Phone: +27 61 514 8375, WhatsApp: wa.me link, Location: Cape Town

## Files Modified (uncommitted)

- `design/index/index.html` — Pricing cards with data-tier + pricing-badge on all 4 cards
- `design/index/js/roi-calculator.js` — Dynamic pricing highlight + banner update logic
- `design/global.css` — Pricing card styles (.pricing-card, .pricing-popular, .pricing-badge)
- `index.html` — Root sync
- `js/roi-calculator.js` — Root sync
- `global.css` — Root sync
- `.gitignore` — Added *.mov

## Already Pushed (web-v0.4.1)

- Logo, favicon, hero video, mobile menu, footer redesign
- Cache-busting version strings

## Rules Added

- Cache-busting on deploy (MANDATORY) — bump ?v= strings with every web-vX.Y.Z tag
- .mov files excluded from git (1.6GB each)

## Next Steps

1. Push uncommitted pricing highlight changes
2. Confirm live site renders correctly after CDN cache clears
3. Fix any remaining footer spacing issues
4. Start services page design
5. Update remaining pages with Royal Navy colour scheme + common header/footer

---

## Resume Command
Say "resume" to continue.
