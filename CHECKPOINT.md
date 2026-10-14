# CHECKPOINT

## Status: COMPLETE. VendIQ live at web-v0.18.0 (commit c1cdf98, deploy run 38517940831 success); em-dash cleanup released as web-v0.18.1.

Live: https://digitaloperations.co.za/doqix/vendiq.html

Previous state (VoltIQ launch, web-v0.17.2) is complete; its notes are kept below.

## Current task
Dedicated VendIQ page modelled on voltiq.html. Pricing "Contact us" via
contact.html?product=vendiq. Client sign-in links to https://vendiq.digitaloperations.co.za.
Copy sourced ONLY from VendIQ repo: docs/client-facing/positioning.md, vendiq-brief.md,
pitch-copy.md, podcast-script.md. Sector neutral (manufacturing, wholesale, retail).

## Files changed (uncommitted)
- NEW design/vendiq/vendiq.html, site/vendiq.html
- NEW design/images/vendiq/ + site/images/vendiq/: vendiq-logo.svg, vendiq-mark.svg,
  vendiq-og.png (from VendIQ/logo kit), vendiq-card.jpg (generated card image),
  report-slow.jpg, guardrails.jpg (cropped console shots: client name, money,
  "Liquor & Tobacco" rows and "180 idle days" caption removed)
- design/components/js/header.js: VendIQ nav entry -> vendiq.html, tagline "Inventory decisions, graded"
- design/components/js/info-popup.js: VendIQ popup rewritten (5W, sector neutral, no SA-hosted claim)
- design/products/products.html: VendIQ card rewritten, image -> vendiq-card.jpg, button "See VendIQ"
- scripts/build-sitemap.js: vendiq.html in PAGE_META
- site/* synced + npm run build (nav baked, sitemap includes vendiq.html)

## Key decisions
- No client name/figures anywhere (verified text, metadata, pixels).
- Exit-report screenshot dropped (retail-only labels).
- Unbuilt items labelled: email delivery + re-grading read-out "Being built"; bounded automation, supplier return doc "Planned".
- Old card render images/vendiq.png left on disk, no longer referenced.

## Verified
375 / 768 / 1024 / 1440: no horizontal overflow, nothing escaping cards, CTA above fold
at 1024x768 and 1440x900. Popup links: See VendIQ -> vendiq.html, Read VendIQ terms.

## Next steps
1. User review of the page in the browser pane.
2. DONE: products-terms.html VendIQ tab no longer says "FMCG retailers and vending operators" and
   "tiered by stores, SKUs, report volume" (binding text, not touched).
3. DONE: docs/website/Product_Deep_Links.md no longer says "tiered pricing by stores/SKUs".
4. DONE (web-v0.18.1): em dashes removed from NomadIQ + LearnIQ hooks, SocialIQ tier list, T&C product-terms line.
5. DONE: web-v0.18.0 released and verified live.
6. Note: commit c1cdf98 trailer reads "Claude Sonnet 5.5" (subagent attribution); left as is, already pushed.

Done since: products-terms VendIQ tab rewritten (Last Updated Oct 14, 2026); Product_Deep_Links.md updated.

## Environment
- Preview: .claude/launch.json "site", port 8791 (running).

---

## Previous checkpoint (VoltIQ)

## Status: COMPLETE. VoltIQ launched, priced, and SEO/GEO hardened.

Live: https://digitaloperations.co.za/doqix/voltiq.html at web-v0.17.2
Repo clean, local and origin in sync. Sitemap submitted to Google Search Console
by the owner on 29 Sep 2026.

## Releases
| Tag | What |
|---|---|
| web-v0.14.0 | VoltIQ landing page, FoxESS as 4th brand |
| web-v0.14.1 | Products menu links to VoltIQ and SocialIQ pages |
| web-v0.14.2/.3 | Pricing card alignment, then the mobile spacing regression it caused |
| web-v0.15.0/.1 | Pricing to From R99/R299/R999, asterisk + explainer note |
| web-v0.16.0 | Pricing model corrected to base-plus-add-ons per tier |
| web-v0.17.0 | Static nav baking, tier-accurate meta copy, structured data |
| web-v0.17.1 | site/robots.txt made self-explanatory |
| web-v0.17.2 | Garbled sub-text removed from alerts-phone render |

Plus, in a DIFFERENT repo: `StephanM-ZA/stephanm-za.github.io` commit 71f9a3e
added the root robots.txt. See below.

## Pricing model (current, verified live)
Each tier is a base plus separately priced add-ons. NOT one shared scale.
- **Home R99/mo per home.** One home, WhatsApp alert when it needs attention,
  no dashboard. Add-ons: scheduled reporting, each additional home.
- **Installer from R299/mo.** Every system fitted, whatever the number, so
  adding installs does not move the price. Dashboard, WhatsApp message, issue
  alerts. Add-on: scheduled reporting beyond the standard message.
- **Fleet R999/mo PER LARGE SITE and it multiplies.** Per-site dashboard and
  weekly report, fleet analytics, multi-user. Add-ons: extra reports, early
  fault warnings, upsell flagging, white-label, baseline suggestions.
Brands: Deye, Sunsynk, Luxpower, FoxESS. FoxESS confirmed production-live by
the owner 28 Sep 2026.

## Two things that live OUTSIDE this repo
1. **Root robots.txt** is in `StephanM-ZA/stephanm-za.github.io` (the apex Pages
   repo). This project is a GitHub Pages *project* site under /doqix/ and
   cannot serve one. It carries the crawler rules, deliberate AI-crawler
   allowances and the Sitemap directive. `site/robots.txt` is a comment-only
   placeholder explaining this.
2. **thank-you.html** is kept out of the index by its own noindex meta tag,
   never by a Disallow. A Disallow would stop crawlers seeing the tag.

## Build: nav baking (READ THIS BEFORE SYNCING)
`scripts/build-nav.js` bakes header/footer into every site/*.html by executing
the real header.js/footer.js against a DOM stub, so those files stay the single
source of truth. Before this, the nav was injected at runtime and the served
HTML had 9 anchor tags with ZERO links to inner pages; voltiq.html had no static
inbound link anywhere. Now 43 anchors.

**ORDER MATTERS: sync design->site FIRST, then `npm run build`.** Copying a page
from design/ overwrites the baked nav with the empty placeholder. The build
fails if the homepage loses its static links.

## Indexing chain, verified live 29 Sep 2026
root robots 200 and allows | Sitemap directive readable | sitemap valid, 10 URLs
| voltiq listed | index,follow | self-canonical | internal links present |
JSON-LD present | page 200.

## Still open
1. **Sample figures on two renders** (48.6 MWp / 1 284 sites / R4.82m on
   hero-fleet-console and three-devices). Captioned "illustrative, sample data".
   Cosmetic. Crop the screen detail if the invented numbers are unwanted.
2. **YouTube walkthrough.** The GEO audit's strongest remaining recommendation:
   YouTube presence correlates with AI citation far more than backlinks. Link it
   from voltiq.html and add to `sameAs` in design/index/index.html. Production
   work, not code.
3. **llms.txt deliberately NOT added.** No major AI vendor has confirmed they
   read it. Revisit only if that changes; it would go in the apex repo.
4. Read-through of the VoltIQ tab on products-terms.html: it now encodes the
   full tier and add-on structure including per-site multiplication, and it is
   the binding version.

## Environment
- Local preview: `.claude/launch.json` (gitignored), port 8791. Running.
- Port 8765 held by an unrelated pre-existing process.
- Never committed, intentionally: graphify-out/, .gitattributes, .graphifyignore.
