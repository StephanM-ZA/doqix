# CHECKPOINT — Do.Qix Website

**Date:** 2026-05-06
**Branch:** main
**Tag (current):** web-v0.12.0 — shipped
**Previous tag:** web-v0.11.0
**Working tree:** clean
**Local preview server:** still running at http://localhost:8080 (PID was 7460; check with `lsof -ti:8080` and `kill` when done)

---

## Release shipped: `web-v0.12.0`

**Commit:** `219b8f9`
**Tag:** `web-v0.12.0` (annotated, pushed)
**Deploy run:** `25455001930` — **completed successfully in 41s**

### What landed in this release

1. **5W info popup** — pulsating ⓘ trigger on every product card opens a Who/What/Why/When/Where popup styled like the existing build-popup ("Got An Idea") flow. Eyebrow pill, title with green accent, hook line, feature pills, 5W rows, glow CTA + secondary text link. Hash-based deep-linking via `data-product`. Keyboard a11y. JS in `design/components/js/info-popup.js`.
2. **SocialIQ product** — 5th product card on `products.html`, full tab on `products-terms.html`, deep-link prefill in `contact-form.js`, popup 5W copy. Web-optimised hero image (WebP 64K + JPG 57K, both 1200×1200, both under the 100KB target). Pricing model: **"From R499/mo"** scales with channels × cadence; final price locked at onboarding.
3. **Right-chevron common component** on every `.btn` site-wide — CSS-drawn via `::after` (border-tricks square, rotated 45°), hover nudges 3px right via the standalone `translate` property. Replaced the Unicode `→` because Inter renders it misaligned at bold weights. Suppressed on `.btn-back` and `.no-arrow`. Hardcoded ` →` stripped from button text in `info-popup.js`, `build-request.js`, `thank-you.js` to avoid double-arrows.
4. **Product cards equal height + width** — `#products .card { min-height: 780px }` on md+. Width was already equal via `grid-cols-2`. Locked as a project rule.
5. **`.btn-ghost` strengthened** — was a faint 1px grey border, now 1.5px primary-tinted border with subtle fill and a hover scale. Reads as a real secondary CTA.
6. **Scroll-reveal animation removed site-wide** — IntersectionObserver block stripped from `main.js`, all `.scroll-reveal` CSS removed from `global.css`, the class stripped from every HTML page, `data-disable-scroll-reveal` opt-out attribute removed from legal pages, `app-carousel.js` cleaned up. Only hover/transition animations remain.
7. **"Learns from your feedback" capability beat** added to every product — new pill (always last in the pills array) + a one-sentence addendum in each product's WHAT row. Brand-level differentiator: every Do.Qix product gets sharper as the customer uses it.
8. **Golden Rules** (`WHERE → UPDATE → COMMIT → PUSH → BUMP` ladder + trigger phrase reference table) locked into `docs/build/Session_Checklist.md` and mirrored in project memory at `feedback_session-checklist-mandatory.md`.
9. **5W Product Marketing Strategy** — new SSOT at `docs/website/Product_5W_Strategy.md`. Defines the template (status pill → title-with-accent → hook → feature pills → 5W rows → CTAs → footnote), per-section guidance, anti-hallucination + anti-AI-tells rules, and the "Flat" vs "From" vs "Custom" pricing-language principle. Referenced from `CLAUDE.md` and project memory at `feedback_5w-product-strategy.md`.
10. **`.gitignore` anchored** `/build/` and `/dist/` to root so `docs/build/Session_Checklist.md` and `docs/build/Build_Checklist.md` are trackable. Both committed in this release.
11. **Cache-bust bumped** `?v=0.11.0` → `?v=0.12.0` across all 23 HTML files; `Current version` line in `CLAUDE.md` updated.

---

## Standing rules locked into memory this session

- **Golden Rules ladder** (`WHERE → UPDATE → COMMIT → PUSH → BUMP`) — `feedback_session-checklist-mandatory.md`
- **5W Product Marketing Strategy** — `feedback_5w-product-strategy.md` (every product gets the 5W template + 3 capability beats: Learns-from-feedback, In-your-voice, Human-approval)
- **Design folder source-only** — `feedback_design-source-only.md` (never preview from `design/`; only the local server pointed at `site/`)
- **Product cards same size** rule applied via CSS, but I never asked the user where to persist this rule (global / project / session). Outstanding.

---

## Open items for next session

1. **Domain swap on `products-terms.html`** — flip the canonical / `og:url` / `mailto:hello@…` from `digitaloperations.co.za` to `doqix.co.za`. Currently only the visible "Website:" line on the page is flipped. Requires:
   - `doqix.co.za` to redirect to `digitaloperations.co.za/doqix/` (or to host the site directly)
   - `hello@doqix.co.za` to be a working mailbox
   - Confirm both, then I can flip in 2 minutes.

2. **Apply the domain swap site-wide** — other pages (`terms-and-conditions.html`, `privacy-policy.html`, `index.html`, footer, header) all reference `digitaloperations.co.za`. If the rebrand to `doqix.co.za` is going across the board, that's a separate sweep.

3. **"Product cards same size" rule — where to save it?** Options:
   - `global` (`master_commands/basic-rules.md`) — applies to every project
   - `project` (`doqix_website/CLAUDE.md`) — this project only (recommended)
   - `session` — don't save, follow it this session only

4. **Existing product images are 5–9 MB each** (NomadIQ, VendIQ, VoltIQ, LearnIQ are all 2816×1536 PNGs). They violate `docs/web-standards.md` (target <100KB for full-width images). The new SocialIQ image was crunched down to 64K WebP + 57K JPG with the proper `<picture>` fallback. Migrating the other four product images to the same pattern would be a meaningful page-speed win — split into a separate cleanup pass.

5. **Existing pages still have `data-disable-scroll-reveal`** — wait, no, that was swept in this release. Disregard.

6. **Local preview server** still running at `:8080`. If you don't need it: `kill $(lsof -ti:8080)`.

---

## Verification commands (next session)

```
# Confirm deploy state
gh run list --workflow=deploy-site.yml --limit=2

# Confirm tag exists upstream
git fetch --tags && git tag -l 'web-v0.12.*'

# Local preview after pulling fresh
cd site && python3 -m http.server 8080
# then http://localhost:8080/products.html
```
