# CHECKPOINT

## Status: COMPLETE and SHIPPED. Session closed 28 September 2026.

VoltIQ landing page is live at https://digitaloperations.co.za/doqix/voltiq.html
Repo clean, local and origin both at d079325.

## Releases this session
| Tag | Commit | What |
|---|---|---|
| web-v0.14.0 | eae1561 | VoltIQ landing page, three-tier pricing, FoxESS support |
| web-v0.14.1 | ef7f56f | Products menu links VoltIQ and SocialIQ to their own pages |
| web-v0.14.2 | 0c8bd37 | Pricing cards equal height, CTAs aligned |
| web-v0.14.3 | 6381716 | Restored the gap above pricing CTAs when cards stack |
Plus docs commits 5ea447b, 84224c3, d079325 and CI fix 5140825.

## What shipped
Dedicated VoltIQ page built from the real VoltIQ project at
`/Users/stephanmarais/Projects/development_projects/build/VoltIQ`.

- 11 sections: hero plate, problem band, 4 alternating spotlights, three
  audiences, supported inverters, 3-tier pricing, straight talk, CTA.
- Full VoltIQ amber brand (#FF8000) in a scoped `.voltiq-theme` block so the
  shared header and footer stay Do.Qix teal. 8 marketing renders plus the
  logo lockup, copied into `design|site/images/voltiq/`.
- Pricing: Home R99 (WhatsApp report, one system) / Installer R199 (adds the
  multi-brand dashboard, morning brief, issue alerts) / Fleet R499 (adds fleet
  analytics, suggestions from own baselines, early fault warnings, upsell
  flags, white-label, multi-user). Quoted as "from R99" everywhere.
- FoxESS added as the fourth supported brand. CONFIRMED production-live by the
  product owner on 28 Sep 2026, so the terms-page claim is sound.
- Products card CTA, info popup and the global header dropdown all route to
  voltiq.html. `header.js` gained an optional per-product `href`.
- Terms tab: per-tier breakdown, new Fleet analytics/warnings advisory clause,
  Last Updated 28 September 2026.
- NEW `docs/market/VoltIQ_Competitive_Gaps.md`: capability audit verified
  against the VoltIQ codebase, competitor baseline, and the rules for what the
  website may and may not claim.

## Page length and responsive
Mobile audit at 390px drove a 39% trim: 21,391px (25 screens) -> 13,010px (15.4).
Cut as duplication, not content loss: the Features section, How It Works, and
the 5W grid (the audiences section is the 5W in another form; recorded in
Product_Deep_Links.md so nobody re-adds it).
Measured at 320/375/390/768/900/1024/1440/1920: no horizontal overflow anywhere.
Pricing and audience grids stack until `lg` so tablet is not 3 x 218px.
Pre-trim backup: scratchpad/voltiq-before-trim.html (session scratch, not durable).

## Deploy tooling fixed
`.github/workflows/deploy-site.yml` had no `workflow_dispatch` trigger, so the
CLAUDE.md remedy "gh workflow run deploy-site.yml" returned HTTP 422 and could
never have worked. Added in 5140825 and verified by dispatching (run
36444176860). NOTE: GitHub takes about a minute to re-index a workflow after a
trigger change; a 422 immediately after the push is expected, not a failure.
If a Pages deploy stalls in "waiting", `gh run rerun <run-id>` clears it. The
first 0.14.0 deploy stalled ~9 minutes with nothing blocking it.

## Still open (content, not code)
1. Sample figures on two renders (48.6 MWp / 1 284 sites / R4.82m). Captioned
   as illustrative on the page. Crop or swap if not acceptable.
2. `alerts-phone.jpg` has garbled AI sub-text under clean alert headings,
   visible at full zoom in the detection spotlight.
3. The tier feature split is my reading of the brief and is written into the
   live terms page. Worth a read-through of the VoltIQ tab.
4. ACTION NEEDED FROM THE USER: submit
   https://digitaloperations.co.za/doqix/sitemap.xml to Google Search Console.
   Google ignores IndexNow, so it does not yet know voltiq.html exists. Every
   deploy already pinged Bing, Yandex, Seznam, Naver and Yep.
5. Do NOT claim Performance Ratio, string-level monitoring, O&M ticketing, a
   public API, or consumption forensics. See the gap doc for why.

## Environment notes
- Local preview server was stopped at end of session. `.claude/launch.json`
  (gitignored) still holds the `site` config on port 8791 for `preview_start`.
- Port 8765 is held by an unrelated pre-existing Python process. Untouched.
- Pre-existing untracked, deliberately never committed: `graphify-out/`,
  `.gitattributes`, `.graphifyignore`.
