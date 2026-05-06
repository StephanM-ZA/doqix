# CHECKPOINT — Do.Qix Website

**Date:** 2026-05-06
**Branch:** main
**Tag (current):** web-v0.12.5 — shipped, deployed
**Working tree:** clean
**Local preview server:** still running at http://localhost:8080 (PID 7460; check with `lsof -ti:8080`, kill when done)

---

## Session's release ladder (7 ships in one session)

| Tag | Commit | Deploy | Theme |
|---|---|---|---|
| web-v0.12.0 | `219b8f9` | ✅ 41s | 5W info popup + SocialIQ launch + chevron CTAs + scroll-reveal removed + Golden Rules |
| web-v0.12.1 | `18ad7d3` | ✅ | New `Social_Promo_Copy.md` (SocialIQ + VoltIQ posts) |
| web-v0.12.2 | `5193240` | ✅ | Social copy URLs swapped to `doqix.co.za` + em dashes removed |
| web-v0.12.3 | `8766e27` | ✅ 30s | VoltIQ WhatsApp recipient corrected to installer + asterisks/terms-footers stripped |
| web-v0.12.4 | `1666d3a` | ✅ 47s | Luxpower flipped from "in progress" → live across 14 references in 7 files |
| web-v0.12.5 | `19c847b` | ✅ 37s | **Products dropdown/submenu in global header (per-product anchors)** |

Plus chore: `61c6ff0` — CHECKPOINT refresh between v0.12.4 and v0.12.5.

---

## What landed in `web-v0.12.5` (latest)

1. **Products dropdown in the global header**
   - `design/components/js/header.js` (and `site/js/header.js`): the Products nav item now has a child dropdown listing all 5 products. Sub-items anchor to `products.html#<slug>`.
   - Single source of truth: a `PRODUCTS` array at the top of `header.js`. Adding/renaming a product = edit one array.
   - Generic `.has-submenu` / `.nav-submenu` / `.mobile-submenu` CSS classes — reusable common-component pattern for any future nav item that needs children.
2. **Behavior:**
   - **Desktop:** hover or keyboard focus reveals the dropdown. Click on the parent still navigates to `products.html`. Hover-bridge keeps the panel open between parent and child.
   - **Mobile:** tap a caret next to "Products" inside the hamburger menu to expand an inline submenu.
   - **Keyboard a11y:** focus-within reveals the panel; `Escape` closes it.
3. **CSS:** ~180 new lines for the dropdown panel, hover/focus transitions, mobile inline submenu, and animated caret rotation.
4. **Cache-bust:** `?v=0.12.4` → `?v=0.12.5` across 23 HTML files.

---

## Bigger picture: what changed across the session

### Products page surface
- Pulsating ⓘ trigger on every product card
- 5W info popup (Who/What/Why/When/Where) styled like the build-popup
- New SocialIQ product card + popup + tab + image (web-optimised WebP/JPG)
- Right-chevron common component on every `.btn` (CSS-drawn, hover nudges)
- Product cards forced equal height/width on md+
- `.btn-ghost` strengthened to read as a real secondary CTA
- Scroll-reveal animation removed site-wide
- **NEW: Products dropdown in the header** with per-product anchors

### Marketing surfaces
- VoltIQ pricing: R99/mo flat
- VoltIQ inverters: Deye, Sunsynk, **Luxpower** (all live)
- SocialIQ pricing: From R499/mo (scaling with channels × cadence)
- "Learns from your feedback" capability beat on every product
- "Posting memory" beat added to SocialIQ
- "Growing upsell library" beat added to VoltIQ
- VoltIQ WhatsApp morning brief recipient = installer (clarified across all surfaces)
- Social copy: 8 posts (IG / FB / LinkedIn / WhatsApp × 2 products) with question-led configurability framing
- All promo URLs use `doqix.co.za`

### Process / governance
- **Golden Rules** locked into `docs/build/Session_Checklist.md` (WHERE → UPDATE → COMMIT → PUSH → BUMP) + project memory at `feedback_session-checklist-mandatory.md`
- **5W Product Marketing Strategy** — new SSOT at `docs/website/Product_5W_Strategy.md` + project memory at `feedback_5w-product-strategy.md`
- **Design source-only** rule in memory (`feedback_design-source-only.md`)
- `.gitignore` anchored `/build/` and `/dist/` to root so `docs/build/Session_Checklist.md` is trackable
- Don't market integrations until they're live (reinforced by Luxpower flip)

### Docs created/updated
- `docs/website/Product_5W_Strategy.md` (new SSOT)
- `docs/website/Product_Deep_Links.md` (refreshed conventions, doqix.co.za URLs)
- `docs/website/Social_Promo_Copy.md` (new copy-paste ready posts)
- `docs/build/Session_Checklist.md` (Golden Rules block at top)
- `CLAUDE.md` (current version line + new Product Marketing Strategy section)
- `design/DESIGN.md` (scroll-reveal removal noted)

---

## Open items for next session

1. **Domain swap on `products-terms.html`** — only the visible "Website:" line says `doqix.co.za`. Technical refs (canonical, og:url, mailto) still on `digitaloperations.co.za`. User confirmed htaccess + DNS redirect is in place, so flipping is safe. ~2 minutes.

2. **Apply the domain swap site-wide** — other pages (`terms-and-conditions.html`, `privacy-policy.html`, `index.html`, footer, header) still reference `digitaloperations.co.za`. Separate sweep when ready.

3. **"Product cards same size" rule — where to save it?** Options:
   - `global` (`master_commands/basic-rules.md`) — applies to every project
   - `project` (`doqix_website/CLAUDE.md`) — recommended
   - `session` — don't save, follow it this session only

4. **Existing product images are 5–9 MB each** (NomadIQ, VendIQ, VoltIQ, LearnIQ — 2816×1536 PNGs). They violate `docs/web-standards.md` (target <100KB). The new SocialIQ image was crunched to 64K WebP + 57K JPG with proper `<picture>` fallback. Migrating the other four to the same pattern is a meaningful page-speed win.

5. **WhatsApp morning report cadence — formalise in T&Cs?** The marketing now commits to "once every morning." The `products-terms.html` VoltIQ tab doesn't yet specify cadence. Worth tightening if/when you formalise the SLA.

6. **Local preview server** still running at `:8080` (PID 7460). Kill with `kill $(lsof -ti:8080)` if you don't need it.

---

## Standing project rules (active across all sessions)

- **Golden Rules** (HARD): WHERE → UPDATE → COMMIT → PUSH → BUMP. No commit/push autonomy.
- **5W Product Marketing Strategy**: every product gets the 7-block template + 3 capability beats (Learns-from-feedback, In-your-voice, Human-approval). Pricing language: Flat / From / Custom.
- **No inline JS, no em dashes, no hardcoded HTML values, "Last Updated" on legal pages, sitemap entry for new HTML pages.**
- **No fabricated numbers, no AI-tell phrases.**
- **Don't market integrations until they're live.**

---

## Verification commands (next session)

```
# Confirm latest deploy
gh run list --workflow=deploy-site.yml --limit=2

# Confirm tag exists upstream
git fetch --tags && git tag -l 'web-v0.12.*'

# Cache-bust sanity (should all be at 0.12.5)
grep -r '?v=0.12' site/ | grep -v '0.12.5'   # should return nothing

# Confirm Luxpower is live (no in-progress phrasing left)
grep -rinE 'luxpower.*(in progress|coming|in active)' design/ docs/ site/   # should return nothing

# Confirm Products dropdown is wired
grep -c 'has-submenu' site/js/header.js   # should be > 0
```
