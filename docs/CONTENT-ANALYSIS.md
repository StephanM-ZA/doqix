# Content Quality & E-E-A-T Analysis — Do.Qix

**URL:** https://digitaloperations.co.za/doqix/
**Date:** 2026-08-17
**Pages:** index, products, services, contact (legal pages assessed for Trust contribution only)

> **Scoring caveat, stated up front:** the scores below are this skill's own heuristics. They are not Google-internal signals, and no third-party tool has access to Google's ranking data. Search Console is the first-party source. Treat these as a structured critique, not a ranking prediction.

---

## Content Quality Score: 66 / 100

## AI Citation Readiness: 38 / 100

---

## The headline

**The prose is excellent. The credentialing is absent.**

These are separable problems, and conflating them would lead you to rewrite copy that does not need rewriting. Run through the QRG scorer, all four pages land at 95-97 overall quality with **zero filler matches and zero AI-pattern matches**:

| Page | Overall quality | Filler | AI patterns | Flags |
|---|---|---|---|---|
| index | 97 | 0 | 0 | none |
| products | 96 | 0 | 0 | none |
| services | 97 | 0 | 0 | none |
| contact | 95 | 0 | 0 | `repetitive` |

That is a better result than most commercial sites produce, and it corroborates the house-style rules in `CLAUDE.md` — the zero em dashes and zero AI-tell vocabulary are not an accident, they are a policy working.

Readability is likewise strong: 11.8 words per sentence average on the homepage, 13.7 on services, median 9 on both. Below the conventional 15-20 target, which for B2B marketing copy is a feature rather than a fault. (Noting per Google that readability scores are not a ranking factor; this is a quality indicator only.)

So the content problem is not writing quality. It is that **nothing on the site establishes who is behind it.**

---

## Google's Who / How / Why test

| Question | Answer | Verdict |
|---|---|---|
| **Who** created it? | No byline anywhere. No About page (`/about.html` → **404**). No team page (`/team.html` → **404**). No named person appears on any page except in testimonial attributions, which describe *customers*, not the company. The legal entity "Digital Operations and Technology (Pty) Ltd" appears only inside JSON-LD `alternateName`. | **Fails** |
| **How** was it created? | No process disclosure. The services page does document the automation methodology (Trigger / Rule / Condition / Action, a 5-step engagement plan), which is genuine process transparency about the *service*. Nothing about who builds it or how the content itself is produced. | **Partial** |
| **Why** does it exist? | Clearly to help a specific buyer solve a specific problem. Not written to a word-count target, not churned for freshness, no niche-entry-without-expertise pattern. Pricing is published openly, which is the opposite of click-farming. | **Passes** |

Two of three answers are weak, and the weak one is "Who" — the question that matters most for a B2B service where the buyer is handing over operational data.

---

## E-E-A-T Breakdown: 47 / 100

| Factor | Score | Key signals |
|---|---|---|
| Experience | 8/20 | Case studies present but anonymized; testimonials present but unverifiable |
| Expertise | 11/25 | Real domain depth in the copy; zero credentialing, no named humans |
| Authoritativeness | 10/25 | Zero external citations; 3 social profiles exist but are JS-only; `sameAs` now populated |
| Trustworthiness | 18/30 | Excellent legal and pricing transparency; no address, no dates, unsourced claims |

*Weights follow Google's stated hierarchy — trust is most important — rather than an equal split. Google publishes no numeric weights; this split is the skill's internal model.*

### Experience — 8/20

The site does claim first-hand experience ("Built From Real Automation Experience", "100+ workflows running for SA businesses"), and the services page carries four case studies. But every one is anonymized: *"the property agency that stopped losing leads"*, *"the accounting firm that got Fridays back"*. No company name, no quantified before/after, no link.

Seven testimonials appear, attributed as first name plus surname initial with a role and city — Lerato M. (Bookkeeping Consultant, Pretoria), Reuben P. (Managing Director, Cape Town), and so on. No company, no LinkedIn, no photo attributable to a real person, no indication whether these are Google reviews or direct quotes.

There is no original research, no proprietary dataset, no before/after screenshots of actual automations built.

**What would move this most:** two named case studies, with permission, carrying one checkable metric each. That single change addresses Experience, Authoritativeness and Trust simultaneously.

### Expertise — 11/25

Scored higher than it might appear, because **the domain knowledge is genuinely evident**: the Trigger/Rule/Condition/Action model, POPIA specifics, self-hosting architecture, over 400 named integrations, honest build-time ranges ("simple workflows: a few days; complex multi-system automations: 2-4 weeks"). Someone who has actually done this work wrote this.

None of it is attributed to a person. No bylines, no bios, no credentials, no certifications, no years-in-business claim, no team photographs. The competitors ranking above you lead with exactly this — one surfaced in the SXO pass leads with "23 years."

**The absence of an About page is the single largest structural content gap on the site.** It is also the cheapest to fix.

### Authoritativeness — 10/25

The lowest score in the model, and it is measured rather than inferred.

- **Zero external outbound links** on index, products and services. One on contact. Not a single citation to any authoritative source anywhere on the commercial pages.
- **Partial brand entity presence.** Nothing on Wikipedia, Reddit or YouTube. But LinkedIn, Facebook and Instagram profiles all exist and are linked from `footer.js` — the initial US-weighted search missed them, and they sit behind client-side rendering, so no AI crawler can follow them.
- `sameAs` was empty; populated 2026-08-17 with all three profiles. The remaining gap is that the visible footer links are JS-injected, and that the profiles do not point back at the site.
- No industry recognition, press coverage, awards, partner badges, or third-party listings.
- No measurable backlink authority (Common Crawl reports the domain not in graph).

The three homepage statistics compound this. "Research shows professionals spend nearly 30% of their work week on manual, low-value tasks" cites no research. Linking the actual study would convert a liability into an authority signal at essentially zero cost.

### Trustworthiness — 18/30

The strongest dimension, and genuinely so:

- HTTPS with HSTS ✓
- **Four separate legal documents** — privacy policy, terms and conditions, product terms, fair build terms — totalling 1,291-1,820 words each. That is unusually thorough for a company this size and reads as a real trust investment.
- Phone and email published, both crawlable ✓
- **Fully transparent pricing** with named tiers in rands, no "contact us for pricing" gate ✓
- POPIA compliance stated with the self-hosting rationale ✓
- Cookie consent implemented ✓

Working against it: no street address anywhere; no publication or last-updated dates on any commercial page (`htmldate` returns `publication_date: None`); testimonials and case studies unverifiable; three unsourced statistics.

---

## Content metrics

| Page | Words | Type minimum | Status |
|---|---|---|---|
| index | 1,075 | 500 | Pass |
| products | 615 | 400 (complex product) | Pass |
| services | 1,603 | 800 | Pass |
| contact | 610 | — | Pass |

All pages clear their topical-coverage floors. Word count is not a ranking factor and these are floors rather than targets — no page needs padding.

**Keyword optimization:** clean. Primary term appears in title, H1 and first 100 words on every page, with natural semantic variation and no stuffing. `Business Workflow Automation South Africa | Do.Qix` through to the H1 and opening sentence is textbook.

**Structure:** logical H1→H2→H3 on all pages, single H1 each, 4-6 lists per page. Two gaps: **no tables anywhere** despite four priced tiers and five products being exactly the comparative data tables exist for, and almost no question-phrased headings.

**Multimedia:** alt text coverage is 100% across all 12 images — better than most sites achieve. But no tables, no charts, no infographics, and no `ImageObject`/`VideoObject` schema on the two videos.

**Internal linking — the significant defect.** In raw HTML, the homepage links to `contact.html` and nothing else. Not products, not services. Both nav and footer are JavaScript-injected, so link equity and crawl paths only exist for renderers that execute JS. Against a guideline of 3-5 internal links per 1,000 words, the 1,075-word homepage has one.

**Freshness:** no dates on any commercial page. Content under three months old is roughly 3x more likely to be cited in AI answers, and there is currently no way for any system to tell how old this content is.

---

## AI Citation Readiness: 38 / 100

Content-side view; the full surface analysis is in [GEO-ANALYSIS.md](GEO-ANALYSIS.md).

**Working for you:** all content is server-rendered, so AI crawlers see it without executing JS. The FAQ answers on `contact.html` are the most citable material on the site — specific, self-contained, entity-dense.

**Working against you:** no passage falls in the 134-167 word citable band; three statistics carry no attribution; no dates; no tables; entity presence is zero, so even a well-formed quote has no recognised source to attribute to.

**Highest-leverage content change for AI citation:** move the "over 400 integrations" and POPIA answers from the contact page onto services. They are the two most quotable passages you have, sitting on the page with the least commercial intent.

---

## Issues found

| # | Issue | Severity |
|---|---|---|
| 1 | No About or Team page (both 404). No byline, bio or credential anywhere. | **High** |
| 2 | Zero external citations on all three commercial pages. | **High** |
| 3 | Three statistics stated with no source, publisher or date. | **High** |
| 4 | Case studies and testimonials fully anonymized and unverifiable. | **High** |
| 5 | Internal linking collapses without JavaScript — homepage has one raw-HTML link. | **High** |
| 6 | No publication or last-updated dates on any commercial page. | Medium |
| 7 | No tables, despite tiered pricing and a five-product catalogue. | Medium |
| 8 | Almost no question-phrased headings; the 7 real FAQ questions are not headings. | Medium |
| 9 | `contact.html` flagged `repetitive` by the quality scorer. | Low |
| 10 | No street address. | Medium |

---

## Recommendations, by leverage

1. **Write an About page.** Named founder or team, real credentials, years of experience, a photograph, and the story of why the business exists. Add `Person` schema and link it to the `ProfessionalService` entity. This is one page, and it moves Expertise, Experience, Authoritativeness and Trust at once. It is the highest-return content work available.

   *Falsifiable:* `/doqix/about.html` returns 200 and contains a named person with attributed credentials.

2. **Fix the three statistics.** Link the study behind the 30% claim, or drop it. Convert "one client cut R20,000/month" into a named, linked case study or remove the number. Unsourced specifics read as fabricated to both quality raters and answer engines.

   *Falsifiable:* each statistic has an adjacent `<a href>` to a named, dated source.

3. **Name two case studies**, with permission, each with one checkable metric. If no client will consent, say plainly that examples are illustrative — that is more trustworthy than implied-but-unverifiable scale.

   *Falsifiable:* at least two case studies carry a company name and a specific figure.

4. **Add static internal links** in a server-rendered block. Content that cannot be reached without JS is invisible to every AI crawler and to link-equity flow.

   *Falsifiable:* `curl` the homepage and find `href="services.html"` in the raw response.

5. **Add dates.** Visible "last updated" plus `dateModified` in schema on the commercial pages, matching the convention your legal pages already follow.

6. **Convert pricing to a table**, and wrap the seven FAQ questions in `<h3>` inside their existing `<summary>` elements. Both are small, mechanical, and improve citability directly.

7. **Cite outward.** Link POPIA legislation, the integration platforms named, and any research referenced. Outbound citation to authoritative sources is a positive signal, not a leak.

---

## What not to change

Worth stating explicitly, because an audit that only lists faults invites over-correction:

- **Do not rewrite the copy for quality.** It scores 95-97 with zero filler and zero AI patterns. Rewriting risks making it worse.
- **Do not pad any page to hit a word count.** All pages clear their floors; word count is not a ranking factor.
- **Do not add `Review` or `AggregateRating` schema** to the current testimonials. Marking up unattributable quotes as structured reviews risks a manual action.
- **Do not add FAQPage markup anywhere new.** Google retired FAQ rich results for all sites on 2026-05-07. The existing one on `contact.html` should stay, but it earns nothing in Google SERPs.
- **Keep the pricing transparency and the four legal documents.** These are your strongest trust assets and they are doing real work.
