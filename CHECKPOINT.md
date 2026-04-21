# CHECKPOINT — Do.Qix Website

**Date:** 2026-04-21
**Branch:** main

## Completed This Session

### 1. Heroicons Upload
- Pushed `design/heroicons-master/` to GitHub (commit 2f73ac4)

### 2. Icon Replacement (Material Symbols -> Heroicons)
- Replaced ~76 unique Material Symbol font icons with inline Heroicon SVGs
- 477 total icon instances across 20 HTML files and 11 JS files
- Removed Google Fonts Material Symbols font import from all HTML
- Updated `global.css`: `.material-symbols-outlined` -> `.hi` base class
- Kept WhatsApp SVG logo untouched (brand logo)

### 3. Repo Restructure (Option 2: site/ folder)
- Created `site/` folder for deployed website files
- Moved all deployed files from root to `site/`
- Created `.github/workflows/deploy-site.yml` (Actions deployment from site/)
- Switched GitHub Pages from legacy to Actions workflow
- Updated CLAUDE.md with new structure, sync rules, icons section

## Files Modified
- All `design/**/*.html` files (icon replacement)
- `design/global.css` + `site/global.css` (CSS updates)
- All `design/**/js/cookie-banner.js` and `exit-popup.js` (JS icon replacement)
- `site/js/cookie-banner.js`, `site/js/exit-popup.js`
- `.github/workflows/deploy-site.yml` (new)
- `CLAUDE.md` (updated)

## Next Steps
1. Commit all changes
2. Push + verify Actions workflow deploys correctly
3. Test live site at digitaloperations.co.za/doqix
