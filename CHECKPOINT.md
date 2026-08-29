# CHECKPOINT — Do.Qix Website

**Date:** 2026-06-24
**Branch:** main
**Tag (current):** web-v0.12.10 — shipped, deployed (commit `0343b0e`)
**Working tree:** dirty (only this CHECKPOINT.md update — no other uncommitted edits)

---

## Session 2026-08-17 — SEO audit (no code changes)

**Task:** Installed the `claude-seo` plugin (manual install, v2.2.4) and ran a full audit of the live site.

**Deliverables:** `docs/SEO-Audit-2026-08-17.md` (health 62/100, 8 pages) · `docs/GEO-ANALYSIS.md` (AI search 44/100) · `docs/CONTENT-ANALYSIS.md` (E-E-A-T 42/100).

**Note on the image finding:** it is a conformance gap against `docs/web-standards.md`, not a Lighthouse problem. Lighthouse does not score page weight, so PSI rates these pages well regardless. The standard's own budgets are the argument: avatars under 2 KB (actual 158-242 KB), full-width images under 100 KB (actual 5.68-8.34 MB), total mobile payload under 2 MB (actual ~28.9 MB on products). Reference implementation already exists at `site/products.html:198` (SocialIQ `<picture>` + WebP).

**Two findings needing action before any further work:**
1. **`scripts/` is deleted on disk** (unstaged, still in HEAD). `.github/workflows/deploy-site.yml` lines 41 and 57 call `check-sitemap.js` and `indexnow-ping.js`; `package.json` points `build`/`build:sitemap`/`check:sitemap`/`indexnow`/`watch` at these paths. Committing this deletion breaks the deploy. Fix: `git checkout -- scripts/`
2. **Product images are 28.7 MB total** (`learniq` 8.34 / `nomadiq` 8.22 / `vendiq` 6.52 / `voltiq` 5.68 MB), each 2816×1536 rendered in a 192 px box, duplicated across `design/` and `site/` (~57 MB in git). `socialiq.jpg` at 0.06 MB shows the correct pattern.

**Other confirmed:** root `robots.txt` is 404 so `/doqix/robots.txt` is inert per RFC 9309 (apex lives in `StephanM-ZA/stephanm-za.github.io`); homepage has zero raw-HTML links to products/services because nav is JS-injected; `header.js` lacks `defer`; three homepage statistics are unsourced.

**Verified healthy:** canonicals, redirects (single-hop), titles/descriptions, self-hosted fonts, local Tailwind, cache-busting, IndexNow wiring, house style (zero em dashes, zero AI-tell vocabulary).

**Not completed:** content/E-E-A-T formal scoring and local SEO pass (specialist agents did not return). Re-run via `/seo content` and `/seo local`.

**Working tree:** unchanged by this session apart from `docs/SEO-Audit-2026-08-17.md` (new) and this checkpoint. Local `main` is 2 commits behind `origin/main`.

---

## This session (2026-06-24) — web-v0.12.10

**Task:** User reported the ROI calculator gave the "wrong calc." Initial ask was to make error cost per-user, then changed direction mid-fix: keep error cost as a flat monthly total, just raise the slider ceiling.

**Fix shipped:**
- `CONFIG.error.max` raised R50,000 → R1,000,000 in both copies of `roi-calculator.js` (`design/components/js/` and `site/js/`). One-line config change.
- Error cost stays a **flat monthly total, not per-user** (user's final decision).
- No other code needed: the range label auto-derives from config, and `formatZAR` already renders ≥R1M as "R1M".

**Release housekeeping (per CLAUDE.md):**
- Cache-bust `?v=` bumped 0.12.9 → 0.12.10 across all design/ + site/ HTML (174 refs). Two pre-existing outliers left as-is (`?v=0.7.8`, `?v=0.9.4` on unrelated assets).
- CLAUDE.md "Current version" note updated.
- Commit `0343b0e`, annotated tag `web-v0.12.10`, pushed to `StephanM-ZA/doqix`.
- Deploy `deploy-site.yml` run `28072465942` — **completed / success** (30s, verified).

**Side effect to note:** commit-specialist switched the git remote from HTTPS → SSH to get the push through (auth error on HTTPS). Same repo (`git@github.com:StephanM-ZA/doqix.git`). Persists for future pushes.

---

## Prior session's release ladder (3 ships)

| Tag | Commit | Deploy | Theme |
|---|---|---|---|
| web-v0.12.7 | `8546aa8` | ✅ ~1m | **Favicon Google-spec compliant + SVG variant** |
| web-v0.12.8 | `8ec92eb` | ✅ ~28s | Hero video 404 + pain-card spacing + CI Actions bump (Node 24) |
| web-v0.12.9 | `5b3ee85` | ✅ 40s | Productivity Trap card spacing tightened to match outcome cards (24px) |

Previous session's ladder (v0.12.0 – v0.12.6) is in git history; not repeated here.

---

## What landed this session

### web-v0.12.7 — Favicon overhaul

**Why:** Google search results were showing an old/default site icon. Root cause: the existing `favicon_green.png` was 298×296, which violates Google's favicon spec ("must be a square that's a multiple of 48px"). Google falls back to a cached/default icon when the favicon doesn't meet spec.

**What:**
- `favicon_green.png` resized 298×296 → **192×192** (square, multiple of 48 — meets Google spec)
- New `favicon_green.svg` added for crisp browser-tab rendering at any DPI
- `<link rel="icon">` tags in 14 design HTML files updated to declare both formats with explicit `sizes` attributes (`type="image/svg+xml" sizes="any"` first, `type="image/png" sizes="192x192"` second — modern browsers prefer SVG, Google falls back to PNG)
- `site.webmanifest` updated to list both icon entries
- Filename kept stable per Google's "URL stability matters" guidance

**Manual user-side action required (still pending):**
- Open Search Console → URL Inspection → enter `https://digitaloperations.co.za/doqix/` → click **Request Indexing**. Optional: repeat for `/services.html`, `/products.html`, `/contact.html`
- One-time: submit sitemap `https://digitaloperations.co.za/doqix/sitemap.xml` if never done
- Realistic refresh windows after Request Indexing: search-result icon 1–7 days, Knowledge Panel logo 2–6 weeks (Google's own schedule)

### web-v0.12.8 — Three fixes in one push

1. **Hero video 404 (homepage + services).** `site/index.html` and `site/services.html` carried `../hero-video.mp4` / `../hero-poster.jpg` / `../services-hero-video.mp4` paths from the design/ source. In the deployed `/doqix/` subpath, `../` resolved one level too high → 404. Fixed by extending the sync sed pipeline in `Session_Checklist.md` (3 new path mappings for `../hero-video.mp4`, `../hero-poster.jpg`, `../services-hero-video.mp4`) so future syncs cannot regress.
2. **Productivity Trap cards spacing (initial fix).** Wrapper `<div>` was using class `space-y-6-group` — not a valid Tailwind utility, did nothing, cards collapsed with zero gap. Initially fixed to `space-y-8` (32px). Refined in v0.12.9 (see below).
3. **GitHub Actions deprecation cleanup.** Deploy workflow logs warned about Node.js 20 actions being deprecated by 2 June 2026. Bumped: `actions/checkout@v4→v6`, `actions/setup-node@v4→v6`, `actions/configure-pages@v5→v6`, `actions/upload-pages-artifact@v3→v5`, `actions/deploy-pages@v4→v5`. Workflow Node runtime moved 20 → **22** (Node 20 reached EOL April 2026). `release-plugins.yml` checkout also bumped to v6. **Left untouched:** `softprops/action-gh-release@v2` (third-party, only used on plugin release tags — defer until next plugin release cycle).

### web-v0.12.9 — Card spacing polish

User compared the Productivity Trap card spacing (32px, `space-y-8`) against the outcome cards further down the homepage (24px, `gap-6`) and asked for the spacing to match. Wrapper changed `space-y-8` → `space-y-6` so vertical gap between Productivity Trap cards matches the outcome cards' grid gap.

---

## Open items for next session

(Carried over from prior CHECKPOINT — none of these were touched this session.)

1. **Domain swap on `products-terms.html`** — only the visible "Website:" line says `doqix.co.za`. Technical refs (canonical, og:url, mailto) still on `digitaloperations.co.za`. User confirmed htaccess + DNS redirect is in place, so flipping is safe. ~2 minutes.
2. **Apply the domain swap site-wide** — other pages (`terms-and-conditions.html`, `privacy-policy.html`, `index.html`, footer, header) still reference `digitaloperations.co.za`. Separate sweep when ready.
3. **"Product cards same size" rule — where to save it?** Options: `global` (`master_commands/basic-rules.md`) / `project` (`doqix_website/CLAUDE.md`, recommended) / `session`.
4. **Existing product images are 5–9 MB each** (NomadIQ, VendIQ, VoltIQ, LearnIQ — 2816×1536 PNGs). They violate `docs/web-standards.md` (target <100KB). SocialIQ was already crunched to 64K WebP + 57K JPG with proper `<picture>` fallback. Migrating the other four = meaningful page-speed win.
5. **WhatsApp morning report cadence — formalise in T&Cs?** Marketing commits to "once every morning." `products-terms.html` VoltIQ tab doesn't yet specify cadence.
6. **Local preview server** — was running at `:8080` (PID 7460) per prior session. Verify with `lsof -ti:8080`; kill with `kill $(lsof -ti:8080)` if no longer needed.

### New from this session

7. **Backup of original 298×296 favicon PNG** is at `/tmp/favicon_green_original.png` if ever needed (will be cleared on reboot).
8. **`softprops/action-gh-release@v2`** still pinned at v2 in `release-plugins.yml` — bump to v3 next time a plugin release is being cut, so any breakage is caught with a real release ready to roll back.
9. **GitHub Search Console "Request Indexing"** for `/doqix/` is the single most effective accelerator for the favicon refresh — must be done manually by the user (not automatable from this side).

---

## Standing project rules (active across all sessions)

- **Golden Rules** (HARD): WHERE → UPDATE → COMMIT → PUSH → BUMP. No commit/push autonomy. See `docs/build/Session_Checklist.md`.
- **Sync sed pipeline** in `Session_Checklist.md` is now the source of truth for design→site path translations. If you add a new root-level asset to `design/` and reference it from a page HTML with `../foo.ext`, add the mapping to the pipeline before syncing.
- **5W Product Marketing Strategy**: every product gets the 7-block template + 3 capability beats. SSOT: `docs/website/Product_5W_Strategy.md`.
- No inline JS, no em dashes, no hardcoded HTML values, "Last Updated" on legal pages, sitemap entry for new HTML pages.
- No fabricated numbers, no AI-tell phrases.
- Don't market integrations until they're live.

---

## Verification commands (next session)

```bash
# Confirm latest deploy
gh run list --workflow=deploy-site.yml --limit=3

# Confirm tags upstream
git fetch --tags && git tag -l 'web-v0.12.*'

# Cache-bust sanity (should all be at 0.12.10)
grep -r '?v=0.12' site/ | grep -v '0.12.10'   # should return nothing

# Confirm hero video 404 stays fixed
curl -sI https://digitaloperations.co.za/doqix/hero-video.mp4 | head -1   # HTTP/2 200
curl -sI https://digitaloperations.co.za/doqix/services-hero-video.mp4 | head -1   # HTTP/2 200

# Confirm favicon is the new 192×192
curl -sI https://digitaloperations.co.za/doqix/favicon_green.png | grep -i 'content-length'   # ~20 KB
curl -sI https://digitaloperations.co.za/doqix/favicon_green.svg | head -1   # HTTP/2 200

# Confirm Productivity Trap wrapper uses space-y-6
grep -n 'space-y-6\b' site/index.html   # line ~158 should match
```
