# CHECKPOINT

## Status: SHIPPED. web-v0.14.0 is live.

Live: https://digitaloperations.co.za/doqix/voltiq.html
Commit: eae1561  Tag: web-v0.14.0  Deploy run: 36442024689 (success, 49s)

## What shipped
Dedicated VoltIQ landing page plus a three-tier pricing rollout across every
VoltIQ surface, built from the real VoltIQ project at
`/Users/stephanmarais/Projects/development_projects/build/VoltIQ`.

- `voltiq.html` (NEW): 11 sections. Hero plate, problem band, 4 alternating
  spotlights, three audiences, supported inverters, 3-tier pricing, straight
  talk, CTA. Full VoltIQ amber brand (#FF8000) in a scoped `.voltiq-theme`
  block so the shared header and footer stay Do.Qix teal. 8 marketing renders
  plus the logo lockup.
- Pricing: Home R99 (WhatsApp report, one system) / Installer R199 (adds the
  multi-brand dashboard, morning brief, issue alerts) / Fleet R499 (adds fleet
  analytics, suggestions from own baselines, early fault warnings, upsell flags,
  white-label, multi-user). Quoted as "from R99" everywhere.
- FoxESS added as the fourth supported brand (Deye, Sunsynk, Luxpower, FoxESS).
- Products card CTA and info popup now route to voltiq.html.
- Terms tab: per-tier breakdown, new Fleet analytics/warnings advisory clause,
  Last Updated 28 September 2026.
- NEW `docs/market/VoltIQ_Competitive_Gaps.md`: capability audit verified against
  the VoltIQ codebase, competitor baseline, and the rules for what the website
  may and may not claim.
- Cache-bust ?v=0.14.0 across every HTML file in design/ and site/.

## Verified live
voltiq/products/products-terms/index/sitemap all HTTP 200. All 9 VoltIQ assets
200. Live page carries ?v=0.14.0, all three tier prices, FoxESS x6. Card CTA
resolves to voltiq.html. Terms shows the three-tier callout. Sitemap lists
voltiq.html. info-popup.js on the CDN has the new href and status label.
IndexNow notified 10 URLs, HTTP 200.

## Page length and responsive work
Mobile audit at 390px drove a 34% trim: 21,391px (25 screens) -> 14,098px (16.7).
Removed as duplication, not content loss:
- Features section (9 cards, 36 bullets) restated the spotlights and pricing.
- How It Works restated the four numbered spotlights.
- The 5W grid (user decision) duplicated the audiences section.
Inverters 1,861 -> 696px, pricing fine print 3 cards -> 1 paragraph.
Measured at 320/375/390/768/900/1024/1440/1920: no horizontal overflow anywhere.
Tablet fix: audiences, pricing and straight-talk grids were 3 x 218px at 768;
now md:grid-cols-3 -> lg:grid-cols-3. Desktop page height 9,424px at 1440.
Pre-trim backup: scratchpad/voltiq-before-trim.html

## Deploy tooling: issue found and FIXED this session
`.github/workflows/deploy-site.yml` had NO `workflow_dispatch` trigger, so the
remedy documented in CLAUDE.md ("re-run it: gh workflow run deploy-site.yml")
returned HTTP 422 and could never have worked. Fixed in commit 5140825; the
CLAUDE.md instruction is now correct as written and there is a Run button in
the Actions tab. Verified by actually dispatching: run 36444176860, event
workflow_dispatch, success. Note GitHub took roughly a minute to re-index the
workflow before dispatch was accepted.

Also seen: the first web-v0.14.0 deploy stalled ~9 minutes in "waiting" on the
github-pages environment with no reviewers configured, main in the allowed
deployment branches, nothing holding the `pages` concurrency lock and GitHub
reporting all systems operational. `gh run rerun <run-id>` cleared it in 49s.
If a deploy stalls again, that is the fallback.

## Still open for the user (content, not code)
1. ~~FoxESS supported-brand claim~~ CLOSED 28 Sep 2026: product owner confirmed
   FoxESS is live in production. The claim on the live terms page is sound.
2. Two renders show sample figures (48.6 MWp / 1 284 sites / R4.82m). Captioned
   as illustrative on the page.
3. alerts-phone.jpg has garbled AI sub-text under clean alert headings.
4. The tier feature split is my reading of the brief and is now written into the
   terms page.
5. Do NOT claim Performance Ratio, string-level monitoring, O&M ticketing, a
   public API, or consumption forensics. See the gap doc.

## Branch
main, clean except pre-existing untracked: graphify-out/, .gitattributes,
.graphifyignore (deliberately not committed).
