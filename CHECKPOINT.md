# CHECKPOINT — Do.Qix Website

**Date:** 2026-05-06
**Branch:** main
**Latest commit:** 177f066 (pushed, deployed as web-v0.10.10)
**Tag (current):** web-v0.10.10
**Working tree:** dirty (changes below). NOT committed, NOT tagged, NOT pushed — per user instruction "don't push until I tell you".
**Local preview server:** `python3 -m http.server 8080` running in `site/` (PID 7460). Stop with `kill 7460` or `kill $(lsof -ti:8080)`.

---

## What this session built

### 1. Products page promotional changes (`design/products/products.html`)
- All 4 product card buttons relabelled `Learn More` → `Get in Touch`. Deep-link query strings unchanged: `?product=nomadiq|vendiq|voltiq|learniq` (already wired through `design/contact/js/contact-form.js`).
- VoltIQ card: prominent **R99/month** price chip between description and feature bullets — `text-4xl` R99, soft `bg-primary/10` pill with `border-2 border-primary/30`. Asterisk + "Terms apply" both link to `products-terms.html#voltiq`.
- VoltIQ launch note above button: "Launching with Deye and Sunsynk. Luxpower and more inverters coming soon."

### 2. Tabbed product T&Cs page (NEW, replaces an earlier per-product approach)
- New file: `design/products-terms/products-terms.html` — single page, four tabs (NomadIQ / VendIQ / **VoltIQ** / LearnIQ). Tab default: VoltIQ.
- New file: `design/products-terms/js/products-terms.js` — external tab/hash-routing JS. Hash-deep-linking (`#voltiq`, `#nomadiq`, etc.), keyboard a11y (←/→/Home/End), `history.replaceState` so no scroll jump.
- VoltIQ tab content: R99/month flat (NOT per system — corrected after first draft), Deye + Sunsynk supported, Luxpower in progress, advisory caveats for alerts/reports, WhatsApp opt-in responsibility, white-label brand IP, cancellation flow.
- NomadIQ + VendIQ tabs: "Live, custom pricing — terms issued on engagement" with `?product=…` CTA.
- LearnIQ tab: "In development" with early-interest CTA.

### 3. Main `terms-and-conditions.html` §17 trimmed
- Removed the inline per-product subsections (was 17.1 NomadIQ / 17.2 VendIQ / 17.3 VoltIQ / 17.4 LearnIQ).
- Replaced with a brief "Products" reference paragraph + callout linking out to `products-terms.html`.
- "17. Contact" renumbered to **18. Contact**.
- "Last Updated" bumped to May 6, 2026.

### 4. Process/operational artifacts
- New file: `docs/website/Product_Deep_Links.md` — single source of truth for every promo URL, T&Cs anchor, VoltIQ promo copy (short + long), tracking-extension hint.
- New file: `docs/build/Session_Checklist.md` — the canonical edit-build-sync-preview-push workflow for this project, including the exact sed pipeline for `design/` → `site/` path fixes.
- New memory: `feedback_session-checklist-mandatory.md` (HARD RULE) + `feedback_design-source-only.md`. Both indexed in `MEMORY.md`.
- `scripts/build-sitemap.js`: added `products-terms.html` to `PAGE_META` (priority 0.4, monthly).

---

## Key decisions / corrections during the session

1. **R99 is flat per month.** First draft had it as "R99 per system" — user corrected. All "per system" language stripped from the chip, the products-terms VoltIQ tab, and the deep-link doc.
2. **No § cross-references** to the main Terms inside products-terms.html. User flagged "§3 of T is confusing." All `§3 / §3.4 / §4 / §5 / §6.4 / §7.1 / §35` references replaced with plain-language statements or generic links.
3. **One tabbed product T&Cs page**, not separate per-product pages. Earlier draft of `design/voltiq-terms/voltiq-terms.html` was created then deleted in favour of the tabbed approach. The "tab per product" structure is what the user explicitly chose.
4. **`Website: doqix.co.za`** displayed in the products-terms contact block. Canonical/og:url/mailto still point at `digitaloperations.co.za` — see Open Questions below.
5. **HARD RULE established:** every change to this project must follow `docs/build/Session_Checklist.md`, tracked via TodoWrite. Locked into memory; applies retroactively from this session forward.
6. **Earlier this session (resolved):** `web-v0.10.10` shipped — buttons site-wide now have `white-space: nowrap`. Done, pushed, deployed.

---

## Files modified / created (uncommitted)

**Modified:**
- `CHECKPOINT.md`
- `design/products/products.html`
- `design/terms-and-conditions/terms-and-conditions.html`
- `design/tailwind.css` (rebuilt)
- `scripts/build-sitemap.js`
- `site/products.html`
- `site/sitemap.xml`
- `site/tailwind.css`
- `site/terms-and-conditions.html`

**Created:**
- `design/products-terms/products-terms.html`
- `design/products-terms/js/products-terms.js`
- `docs/website/Product_Deep_Links.md`
- `docs/build/Session_Checklist.md`
- `site/js/products-terms.js`
- `site/products-terms.html`

---

## Open questions / next steps on resume

1. **Domain swap on products-terms.html — finish the rest?** Currently only the visible "Website:" line says `doqix.co.za`. The technical refs still point at `digitaloperations.co.za`:
   - `<link rel="canonical">` (line ~10)
   - `<link rel="alternate" hreflang>` (line ~11)
   - `<meta property="og:url">` (line ~15)
   - `mailto:hello@digitaloperations.co.za` (in Contact block)
   - Decision needed: is `doqix.co.za` set up as a redirect/alias, and is `hello@doqix.co.za` a working mailbox? If yes, flip all four. If no, leave as-is.

2. **Push & version bump.** Currently sitting at `web-v0.10.10`. The changes in this session are feature-level (new page, new pricing surface, new tabs). Suggested bump: `web-v0.11.0`. On push, also update every `?v=0.10.10` → `?v=0.11.0` cache-bust string across all design/ + site/ HTML files, plus the `Current version` line in `CLAUDE.md`. Don't push until user says so.

3. **Apply the same domain decision (Q1) site-wide?** Other pages (`terms-and-conditions.html`, `privacy-policy.html`, `index.html`, footer) all reference `digitaloperations.co.za`. If the doqix.co.za rebrand is going across the board, that's a separate sweep.

4. **Live preview server.** Still running on port 8080 (PID 7460). Use http://localhost:8080/products.html and http://localhost:8080/products-terms.html#voltiq to verify before pushing.
