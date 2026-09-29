# CHECKPOINT

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
