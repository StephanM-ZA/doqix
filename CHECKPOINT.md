# CHECKPOINT — Do.Qix Website

**Date:** 2026-04-21
**Branch:** main
**Latest commit:** 4aa2838 (pushed, deployed)
**Tag:** web-v0.9.1
**Tool calls this session:** ~8

## Completed This Session

### 1. Audit: Header, Footer, and Social Links
- Confirmed all 8 pages use JS-based header (`header.js`) and footer (`footer.js`)
- No page has inline header/footer HTML anymore
- Footer JS component has all 3 social links: LinkedIn, Facebook, Instagram
- Static HTML files (`design/components/header.html`, `design/components/footer.html`) are unused/outdated
- User asked about social links; Instagram was missing from static footer but present in JS footer

## Prior Session Work (still in place)
- ROI calculator with info icons (green 'i' circles, click-to-toggle tooltips)
- ROI calculator extracted to JS component (both index + services pages)
- Privacy policy + cookie banner updated with GA disclosure
- Asset path fix for site/ HTML files

## Current State
- **Header:** JS component on all 8 pages (`header.js`)
- **Footer:** JS component on all 8 pages (`footer.js`) with 3 socials (LinkedIn, Facebook, Instagram)
- **ROI calculator:** JS component with info icons (index + services)
- **Static component files:** `design/components/header.html` and `footer.html` are unused, can be deleted
- Cache versions: `0.8.1` for global.css + roi-calculator.js, `0.7.8` for everything else

## Key Files
- `design/components/js/header.js` — header component (source of truth)
- `design/components/js/footer.js` — footer component (source of truth, has all 3 socials)
- `design/components/js/roi-calculator.js` — ROI calculator component (source of truth)
- `design/global.css` — all styling
- `design/components/header.html` — UNUSED static reference (can delete)
- `design/components/footer.html` — UNUSED static reference (can delete)

## Important Learnings
- JS-injected elements with `scroll-reveal` class stay invisible unless registered with IntersectionObserver
- `main.js` has no `doqixReveal` function — future JS components must NOT use `scroll-reveal` class
- Design-to-site sync must fix ALL `../` paths, not just `../global.css`
- Tooltips should only trigger on explicit icon click, not label hover

## Next Steps
- User to decide: delete unused static `header.html` and `footer.html`?
- User to verify info icons render and are visible on live site
