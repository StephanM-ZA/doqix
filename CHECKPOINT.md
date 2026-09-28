# CHECKPOINT

## Current task
VoltIQ product page for the Do.Qix website, plus three-tier pricing rolled across
every VoltIQ surface, plus a competitive gap audit. Previewing locally at
http://localhost:8791/voltiq.html. NOTHING COMMITTED, NOTHING PUSHED.

## Status: built and verified, awaiting sign-off

## Pricing: three tiers (current)
| Tier | Price | Includes |
|---|---|---|
| VoltIQ Home | R99/mo | WhatsApp report on one system. No dashboard. |
| VoltIQ Installer | R199/mo | Everything in Home across the book, plus the multi-brand dashboard, morning brief, issue alerts, encrypted credentials. |
| VoltIQ Fleet | R499/mo | Everything in Installer, plus fleet analytics, suggestions from own baselines, early fault warnings, upsell flags, white-label, multi-user. |

Entry price is quoted as "from R99" everywhere. Four supported brands:
Deye, Sunsynk, Luxpower, FoxESS.

## The page: design/voltiq/voltiq.html -> site/voltiq.html
11 sections: hero plate | problem band | 4 alternating spotlights (dashboard,
detection, morning brief, upsell) | three audiences | supported inverters |
3-tier pricing | straight talk | CTA.

**Trimmed 2026-09-28 after a mobile length audit.** At 390px the page was
21,391px (25 phone screens). Now 14,098px (16.7 screens), a 34% cut, with no
content lost that was not already said elsewhere:
- DELETED the Features section (9 cards, 36 bullets) - restated the spotlights
  and the pricing cards. Its only unique content, POPIA + Privacy Policy, moved
  to the pricing fine-print paragraph.
- DELETED How It Works - four numbered steps repeating the four numbered spotlights.
- DELETED the 5W grid (user decision) - duplicated the audiences section. The
  audiences section is the 5W in another form. Noted in Product_Deep_Links.md so
  nobody re-adds it.
- Inverters 1,861px -> 696px (four identical cards -> chip row + paragraph).
- Pricing fine print: three cards -> one paragraph.
- Audience cards: second paragraph dropped from each.
Backup of the pre-trim page: scratchpad/voltiq-before-trim.html
Full VoltIQ amber brand (#FF8000) via a scoped `.voltiq-theme` style block so the
shared header/footer stay Do.Qix teal. 7 marketing renders from the VoltIQ repo.

## Files changed (all uncommitted)
- `design/voltiq/voltiq.html` + `site/voltiq.html` (NEW)
- `design|site/images/voltiq/` (NEW, 9 files, 1.6 MB)
- `design/products/products.html` + `site/products.html` (chip "From R99",
  tier-mapped bullets, four brands, CTA -> voltiq.html)
- `design/components/js/info-popup.js` + `site/js/info-popup.js`
- `design/products-terms/products-terms.html` + `site/products-terms.html`
  (three-tier clauses, new Fleet analytics/warnings clause, FoxESS,
  Last Updated -> September 28, 2026)
- `docs/website/Product_Deep_Links.md`, `Social_Promo_Copy.md`, `Product_5W_Strategy.md`
- `docs/market/VoltIQ_Competitive_Gaps.md` (NEW, 155 lines)
- `scripts/build-sitemap.js`, cache-bust `?v=0.14.0` sitewide
- `.claude/launch.json` (NEW, preview on port 8791)

## SYNC GOTCHA (bit me once, do not repeat)
The design -> site sed MUST run components-first:
```
sed -e 's|\.\./components/js/|js/|g' -e 's|"\.\./|"|g' design/X/X.html > site/X.html
```
Reversed order produces `components/js/header.js`, a broken path.
`products.html` also needs `../build-request/js/` -> `js/build-request.js`
patched separately after the sed.

## Responsive audit (measured, not eyeballed)
Checked 320 / 375 / 390 / 768 / 900 / 1024 / 1440 / 1920. No horizontal overflow
at any width; document scrollWidth equals innerWidth throughout.
Fixes applied:
- audiences, pricing and straight-talk grids were 3 x 218px at 768. Changed
  md:grid-cols-3 -> lg:grid-cols-3 so tablet stacks.
- global.css centres section copy under 640px, which made the long-form blocks
  ragged both sides. Spotlight paragraphs now left-align on mobile.
- .voltiq-card-img drops to 12rem under 640.
- Card images bleed 1px over the card border (needs max-width:none, Tailwind
  preflight caps img at 100%) or the border reads as a white edge on a photo.
Page height at 1440: 9,424px. At 390: 14,098px.

## Verified
- `npm run build` OK, `npm run check:sitemap` OK (10 URLs)
- design/site in sync for voltiq, products, products-terms (diffed)
- site diffs vs git HEAD contain only intended changes plus cache-bust
- 1440x950 and 375x812 render clean, no console errors
- Zero em dashes in all VoltIQ copy; no AI-tell vocabulary
- `node --check` passes on info-popup.js

## Decisions taken this session
- Full VoltIQ amber brand (user chose over Do.Qix teal)
- Teal "signal" accent was over-applied and has been pulled back to amber
- Live fleet data strip was built, verified working, then REMOVED at user request
  (endpoint still exists: GET https://n8n.digitaloperations.co.za/webhook/fleet-live)

## Open flags
1. **FoxESS is now a legal supported-brand claim** on the terms page. Confirm it
   is production-live, not just code-complete.
2. **Mock figures in two renders** (48.6 MWp / 1 284 sites / R4.82m). Captioned
   "Illustrative dashboard, sample data". Crop or swap if not acceptable.
3. **alerts-phone.jpg** has garbled AI sub-text under clean headings.
4. **Tier feature split** is my reading of the user's instruction. Verify before ship.
5. **Do NOT claim** Performance Ratio, string-level monitoring, O&M ticketing,
   public API, or consumption forensics. See the gap doc.
6. Pre-existing em dashes remain in NomadIQ/LearnIQ popup copy. Out of scope.

## Next steps (only after sign-off)
1. Commit, tag `web-v0.14.0`, `git push origin main --tags`
2. `gh run list --workflow=deploy-site.yml --limit=1`
3. `graphify update .`

## Branch
main. Also uncommitted from before: `graphify-out/`, `.gitattributes`, `.graphifyignore`
