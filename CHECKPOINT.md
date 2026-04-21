# CHECKPOINT — Do.Qix Website

**Date:** 2026-04-21
**Branch:** main
**Latest commit:** 73bf05a (pushed, deployed)

## Completed This Session

### 1. Heroicons Upload
- Pushed `design/heroicons-master/` to GitHub (commit 2f73ac4)

### 2. Icon Replacement (Material Symbols -> Heroicons)
- Wrote a Python script to map 76 unique Material Symbol names to Heroicon equivalents
- Replaced 477 icon instances across 20 HTML files and 11 JS files
- Removed Google Fonts Material Symbols `<link>` import from all HTML
- Updated `global.css`: `.material-symbols-outlined` -> `.hi` base class
- WhatsApp SVG logo kept as-is (brand logo)
- Zero material-symbols references remain in any live file

### 3. Repo Restructure (site/ folder)
- Created `site/` folder as the deploy target
- Moved all deployed files (HTML, CSS, JS, images, videos, robots.txt, sitemap, manifest) from root into `site/`
- Root now contains only config: CLAUDE.md, README, CHANGELOG, updates.json, assets/, design/, docs/, planning/

### 4. GitHub Pages Deployment
- Created `.github/workflows/deploy-site.yml` (Actions-based deployment from `site/`)
- Switched GitHub Pages from legacy build (`path: /`) to Actions workflow (`build_type: workflow`)
- Verified workflow runs successfully (14s deploy time)
- Site live at digitaloperations.co.za/doqix

### 5. Documentation Updates
- Updated CLAUDE.md: sync instructions (design -> site/), verify instructions (Actions workflow), new repo structure section, icons section (Heroicons with `.hi` class)

## Key Files
- `.github/workflows/deploy-site.yml` — deploys `site/` to GitHub Pages on push to main
- `design/` — source of truth for all website files
- `site/` — deployed output (synced from design/)
- `design/heroicons-master/optimized/24/` — icon SVG source (outline + solid)
- `design/global.css` — `.hi` base class for heroicon SVGs

## Next Steps
- Visually verify heroicons render correctly at all sizes in browser
- Check all pages: homepage, services, products, contact, 404, thank-you, legal pages
- Confirm cookie banner and exit popup icons work (JS-injected)
