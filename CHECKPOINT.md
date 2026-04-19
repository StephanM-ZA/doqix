# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-19
**Branch:** main (website), plugins (WordPress plugins)
**Task:** Design refinement of Do.Qix homepage

---

## Current State

### Completed — Index Page Design
1. **Global stylesheet** (`design/global.css`) — single source of truth for all styles
2. **Colors fixed** — secondary #ff8000, all greens #00e5a0, no more teal-400/zinc mismatches
3. **Navy background testing** — currently #0e1330 on index (decision pending)
4. **Typography** — all H1/H2/H3/H4/p stripped of inline styles, controlled by global.css
5. **H2 treatment** — all have teal accent on key phrase + pill label above
6. **Components built in global.css:**
   - `.btn` / `.btn-primary` / `.btn-ghost` (sm/md/lg/full, glow variant)
   - `.card` (single bg via --card-bg, hover lift)
   - `.label` / `.label.orange` (pill labels)
   - `.banner` / `.banner.orange` / `.banner.teal`
   - `.caption` (italic, muted, centered, 14px)
   - `.stat-number` with .teal/.orange/.xl variants
   - `.timeline` / `.timeline-line` / `.timeline-circle`
   - `.site-header` / `.nav-container` / `.nav-link`
   - `.site-footer` / `.footer-container` / `.footer-col`
   - `.scroll-reveal` with staggers
   - `.app-carousel-track` / `.app-carousel-item` (endless auto-scroll, 15 apps)
   - `.testimonial-carousel` (2 visible, arrows, dots, auto 8s, pause on hover, infinite loop)
   - `.animated-rocket` (bounce)
   - `.hero-gradient`
7. **Copy corrected** — blended spec + Stitch (kept better versions where noted)
8. **Header/Footer** — common components with correct content
9. **Section anchors** — all 8 sections have IDs

### GitHub Structure
- **main** — website at root (pushed)
- **plugins** — WordPress plugins (pushed)

### NOT Yet Done
- Other 9 pages not started
- Background color decision pending
- site/ folder needs sync from design/index/
- GitHub Pages not configured
- Copy docs need final sync

---

## Resume Command
Say "resume" to continue. Next: sync site/, configure GitHub Pages, then services page.
