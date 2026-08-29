# GEO / AI Search Analysis — Do.Qix

**URL:** https://digitaloperations.co.za/doqix/
**Date:** 2026-08-17
**Framing:** Per Google's AI Optimization Guide, GEO and AEO are rebranded labels for SEO. Nothing below is a separate discipline — it is SEO fundamentals applied to AI-search surfaces.

---

## GEO Readiness Score: 47 / 100

*Revised from 44. LinkedIn, Facebook and Instagram profiles all exist and are linked in `footer.js`; the initial US-weighted search missed them. `sameAs` populated 2026-08-17. Score remains capped because the footer links are client-injected, so no AI crawler can follow them.*

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 50 | 12.5 |
| Structural readability | 20% | 50 | 10.0 |
| Multi-modal content | 15% | 50 | 7.5 |
| Authority and brand signals | 20% | 30 | 6.0 |
| Technical accessibility | 20% | 55 | 11.0 |
| **Total** | | | **47.0** |

The score is dragged down almost entirely by one dimension. Technically the site is in decent shape for AI crawlers. As an *entity* it is thinly established: three social profiles exist, but they are reachable only after JavaScript runs, and there is no presence on the platforms that actually drive AI citation.

---

## 1. The finding that reframes everything

**Do.Qix owns `doqix.co.za` and uses it only as a redirect.**

```
https://doqix.co.za          → 301 → https://digitaloperations.co.za/doqix/
Server: Apache at doqix.co.za Port 443
Redirect is path-preserving: /some/path → /doqix/some/path
```

So the brand controls a **brand-exact domain on an Apache server it administers**, and points it at a subpath of a differently-named domain hosted on GitHub Pages, where it has no root control.

This single decision causes or worsens three separate problems:

1. **Entity resolution.** The brand is "Do.Qix". The canonical URL is `digitaloperations.co.za/doqix/`. An AI engine resolving the entity "Do.Qix" sees a URL whose domain carries a different name. Domain-as-entity-anchor is one of the cheapest disambiguation signals available, and it is currently discarded.
2. **The robots.txt gap.** `digitaloperations.co.za/robots.txt` is 404 and cannot be fixed from this repo (the apex is a separate GitHub Pages repo). But `doqix.co.za` runs Apache under the owner's control — a root `robots.txt` is trivially servable there. Today even that is thrown away: `doqix.co.za/robots.txt` 301s to the inert subpath copy.
3. **Sitemap discovery.** Covered in the main audit. A brand-exact apex the owner controls would give Google root-level `Sitemap:` discovery immediately.

**Recommendation:** serve the site from `doqix.co.za` as the canonical origin, and reverse the redirect. This is the highest-leverage structural change available and it resolves items 1, 2 and 3 together.

- **How would we know this failed?** `curl -I https://doqix.co.za/` returns 200 rather than 301, and `curl https://doqix.co.za/robots.txt` returns a real robots.txt with a `Sitemap:` line.
- **Leading indicator:** GSC property for `doqix.co.za` starts reporting impressions for brand queries.

---

## 2. Brand entity presence — the primary constraint

**Measured, not assumed.** Searches run for the brand, the legal entity, and all four product names.

| Signal | Correlation with AI citation | Do.Qix presence |
|---|---|---|
| YouTube mentions | ~0.737 (strongest) | **None found** |
| Reddit mentions | High | **None found** |
| Wikipedia presence | High | **None found** |
| LinkedIn presence | Moderate | **Exists** — `linkedin.com/company/do-qix` |
| Facebook / Instagram | Supporting | **Both exist** — linked in `footer.js`, so **visible only after JavaScript runs** |
| Domain Rating | ~0.266 (weak) | No measurable Common Crawl signal |

A search for `"Do.Qix" workflow automation South Africa` returns the competitor set — [ensun](https://ensun.io/search/workflow-automation/south-africa), [Tapnet](https://www.tapnet.co.za/workflow-automation), [Exclr8](https://www.exclr8.co.za/automation.php), [CompanyConnect.Tech](https://companyconnect.tech/workflow-automation/), [Kinetix Group](https://kinetixgroup.co.za/optimising-business-processes-in-south-africa/), [Co-Foundry](https://co-foundry.co.za/top-business-workflow-automation-companies-in-south-africa/), [Katlego Solutions](https://katlegosolutions.co.za/your-solution-to-workflow-automation-in-south-africa/) — and Do.Qix appears nowhere in it. A search for the legal entity "Digital Operations and Technology (Pty) Ltd" surfaces unrelated Cape Town automation firms, not this one.

Since brand mentions correlate roughly 3x more strongly with AI visibility than backlinks, and Do.Qix has neither, **AI-search visibility is currently near zero regardless of on-page work.** No amount of passage rewriting changes this. The entity has to exist somewhere an AI engine already trusts.

*Caveat: this search index is US-weighted. A South African brand may hold presence on local surfaces this cannot see. The result is directionally reliable — a total absence across Reddit, YouTube and Wikipedia is not a geographic artifact — but treat SA-specific directory presence as unverified.*

---

## 3. Product name entity collisions (new)

All four product names already resolve to other entities:

| Product | Existing entity | Severity |
|---|---|---|
| **NomadIQ** | [`nomadiq.co.za`](https://www.nomadiq.co.za/) — live, titled "nomadiQ Home \| **THE Official site for South Africa**". Same country, same TLD, camping/equipment rental. Also [nomadiq-sw on GitHub](https://github.com/nomadiq-sw). | **High** |
| **VendIQ** | [AI sales assistant on GitHub](https://github.com/GurmanKD/VendIQ) | Medium |
| **LearnIQ** | [Devpost project](https://devpost.com/software/learniq), coding-education platform | Medium |
| **VoltIQ** | No strong collision found | Low |

NomadIQ is the serious one. An established South African `.co.za` brand holds that exact name and explicitly self-describes as the official South African site for it. For any AI engine performing entity resolution on "NomadIQ" plus a South African context, Do.Qix loses — the incumbent has the domain, the history, and the geographic match.

**Recommendation:** disambiguate in markup and copy. Always render the product as "Do.Qix NomadIQ" rather than bare "NomadIQ", and give each product a `SoftwareApplication` node with an explicit `provider` reference to the Do.Qix `@id`. This does not defeat the incumbent but it stops the two entities being conflated.

- **How would we know this failed?** Search `NomadIQ automation South Africa` and check whether any Do.Qix URL appears at all.

---

## 4. AI crawler access

| Crawler | Status | Why |
|---|---|---|
| GPTBot, OAI-SearchBot | Allowed by default | Root robots.txt is 404, so no rules apply |
| ClaudeBot, PerplexityBot | Allowed by default | Same |
| CCBot, anthropic-ai, Google-Extended | Allowed by default | Same — no opt-out exists either |

Not blocked, but **not deliberately allowed either** — there is no working robots.txt anywhere on the origin. The file at `/doqix/robots.txt` is inert per RFC 9309 (crawlers only read the origin root). Practical harm today is nil, since a 404 defaults to allow. The gap is that the site has no mechanism to welcome search crawlers, exclude training crawlers, or keep `thank-you.html` out of the crawl set.

Note also that user-triggered fetchers — `ChatGPT-User`, `Google-Agent`, `Google-NotebookLM` — ignore robots.txt by design and cannot be controlled this way regardless.

**Snippet controls:** all four pages carry `index,follow` with no `nosnippet`, `max-snippet` or `data-nosnippet` (0 occurrences). Appearance in AI Overviews and AI Mode is governed by exactly these directives, so the site is fully eligible for AI-feature display. Correct as-is — no change needed.

---

## 5. llms.txt and licensing

| File | Root | `/doqix/` |
|---|---|---|
| `llms.txt` | 404 | 404 |
| `ai.txt` | 404 | 404 |
| `rsl.xml` | 404 | 404 |
| `.well-known/rsl` | 404 | 404 |

**No action recommended.** Google states plainly that it ignores `llms.txt` and that adding one will neither help nor harm Search visibility, including generative features. Mueller called the discovery use case a dead end. Reported here for completeness only — it is not a citation lever and should not be prioritised over anything in this document.

RSL 1.0 is absent. Relevant only if the business wants machine-readable AI licensing terms, which is a commercial decision, not an SEO one.

---

## 6. Passage-level citability

**Optimal band is 134-167 words per self-contained block. No passage on any audited page falls in that band.**

The homepage front-loads reasonably well — roughly 44% of AI citations come from the first 30% of a page, and the first 60 words do carry a usable definition:

> "Do.Qix connects the tools you use daily, eliminates repetitive busywork, and runs your business processes automatically so you can focus on what matters."

That is quotable. What follows is not, because the page fragments into 22 headings of 20-40 word chunks.

**Strongest existing passages** (all from the `contact.html` FAQ, present in raw HTML as well as JSON-LD):

- *"Over 400 and counting. Google Workspace, Microsoft 365, Xero, QuickBooks, Salesforce, HubSpot, Pipedrive, Slack, WhatsApp, Shopify, WooCommerce, Airtable, Notion, and more. If your app has an API, we can connect it."* — 37 words, 13 named entities, fully self-contained.
- *"Four plans: Solo (R999/mo), Team (R2,500/mo), Business (R5,500/mo), and Enterprise (custom quote). Flat monthly retainer, no per-user fees, no credits, no per-task charges. All in ZAR."* — specific, checkable.
- *"Yes. We self-host your automations, so your data stays on infrastructure you control. Fully POPIA compliant."* — direct, with a verifiable compliance claim.

These are good. They are just short, and buried on the contact page rather than where commercial intent lands.

**Weakest, and actively harmful:** three statistics stated with no source, publisher or date.

- "Research shows professionals spend nearly 30% of their work week on manual, low-value tasks"
- "Most clients reclaim 8-15 hours a week within the first month"
- "One client cut R20,000/month in preventable data errors alone"

`htmldate` returns `publication_date: None` for the homepage. There is no machine-detectable freshness signal anywhere, and content under three months old is roughly 3x more likely to be cited.

---

## 7. Structural readability

Clean `H1 → H2 → H3` nesting on all pages, single H1 each, lists present (4-6 per page). Genuinely fine.

The gap is **question-phrased headings, of which there are almost none.** Homepage headings are benefit statements ("Your Team Is Losing a Full Day Every Week", "Three Steps. That's It."). Services has 60 headings and not one question. Products has two ("Need Something Custom?", "Questions About Our Products?") but neither is followed by a direct answer.

Worst case: the seven real questions on `contact.html` are **not headings at all**. They sit in `<span>` inside `<summary>` elements:

```html
<span>How long does it take to build an automation?</span>
...
<div class="faq-answer">Simple workflows: a few days. Complex multi-system automations: 2-4 weeks...</div>
```

The FAQPage JSON-LD is correct, so machines reading schema get the Q&A. Machines weighting the visible heading hierarchy get nothing. Wrapping those seven in `<h3>` inside the existing `<summary>` is a small change with no visual or behavioural cost.

**No tables anywhere on any page** — for a business selling four priced tiers and five products, comparison tables are the single most citable format available and are entirely absent.

---

## 8. Multi-modal content

| Page | Images | Alt missing | Video | Tables | Lists |
|---|---|---|---|---|---|
| index | 7 | 0 | 1 | 0 | 6 |
| products | 5 | 0 | 0 | 0 | 5 |
| services | 0 | 0 | 1 | 0 | 4 |
| contact | 0 | 0 | 0 | 0 | 0 (7 `<details>`) |

Alt text coverage is 100% — genuinely good, and rarer than it should be.

Gaps: no tables, no charts or infographics, no `ImageObject` or `VideoObject` schema on either video, and no product screenshots showing the actual interfaces. The ROI calculator is a real interactive asset and a legitimate citability differentiator, but it carries no schema and no static summary of what it computes, so an AI engine cannot describe it.

---

## 9. Technical accessibility — strong, with one hole

**Server-side rendering is correct.** `render_page.py --mode auto` reports `is_spa: false` on every page; trafilatura extracts full body copy, headings, pricing and FAQ text from raw HTML with no JS execution. AI crawlers do not run JavaScript, and here they do not need to.

**The hole:** navigation *is* JS-injected. Raw `index.html` contains zero links to `products.html` or `services.html` — both nav and footer are built client-side by `header.js` and `footer.js`.

```
index.html    → contact.html only
products.html → contact.html, services.html
services.html → contact.html
contact.html  → privacy-policy.html
```

Googlebot renders JS and copes. GPTBot, ClaudeBot and PerplexityBot do not. To every AI crawler, the Do.Qix homepage is a leaf node linking only to a contact page — the two commercial pages are unreachable by link traversal, and with no working root robots.txt there is no sitemap fallback either.

This is the highest-impact technical fix in this document.

---

## 10. Platform breakdown

| Platform | Score | Reasoning |
|---|---|---|
| **Bing Copilot** | 35 | Best of the five. IndexNow is live and correctly configured with `keyLocation` compensating for the subpath — the only automated discovery channel that works today. |
| **Google AI Overviews** | 15 | Strongly ranking-correlated, and 92% of citations come from top-10 pages. The site does not rank. Fix ranking first; AIO follows. |
| **Google AI Mode** | 15 | Broader pool (~9 domains/query) and weaker ranking correlation, which should favour a newcomer — but it weights freshness and entity authority, and the site has neither dates nor entity presence. |
| **ChatGPT** | 10 | Cites Wikipedia (47.9%) and Reddit (11.3%). Do.Qix appears on neither. |
| **Perplexity** | 10 | Cites Reddit (46.7%) most heavily. Same absence. |

AI Mode and AI Overviews agree on conclusions ~86% of the time but cite the same URLs only 13.7% of the time. They remain distinct citation engines even though Google merged the *experience* at I/O 2026, so both are scored separately.

---

## Top 5 highest-impact changes

1. **Add static nav links** in a server-rendered block outside the JS-injected containers. Without this, AI crawlers cannot reach the products or services pages at all. *Falsifiable:* `curl -s https://digitaloperations.co.za/doqix/ | grep 'href="products.html"'` returns a match.

2. **Surface the three social profiles you already have.** LinkedIn, Facebook and Instagram all exist and are all linked from `footer.js` — meaning Googlebot sees them and no AI crawler does, since the footer is client-injected. `sameAs` has now been populated with all three (2026-08-17), which is the machine-readable half and is JS-independent. Two steps remain: (a) render the footer links in server-side HTML so non-JS crawlers can follow them, which the H2 static-nav fix delivers anyway, and (b) set the website field on each profile to point back, making the corroboration bidirectional. Then extend to YouTube and Clutch/Crunchbase. *Falsifiable:* `curl` the homepage and find `linkedin.com/company/do-qix` in the raw response.

3. **Move the canonical origin to `doqix.co.za`.** Resolves entity anchoring, root robots.txt, and sitemap discovery in one change, using infrastructure already owned. *Falsifiable:* `curl -I https://doqix.co.za/` returns 200, and `/robots.txt` there serves a real file.

4. **Attribute the three statistics, and add dates.** Link a named, dated source for the 30% claim, or convert it to a linked case study. Add `dateModified` to the pages. Unsourced numbers are the weakest possible material for an answer engine, and freshness is a live citation factor. *Falsifiable:* `htmldate` returns a non-null publication date.

5. **Write one 134-167 word self-contained answer block** near the top of the homepage and the services page, answering "What is workflow automation and what does it cost in South Africa?" using the pricing and integration specifics that already exist on the contact page. *Falsifiable:* section word count falls in the band and reads correctly with no surrounding context.

---

## Schema recommendations for AI discoverability

- Add `@id` to the homepage `ProfessionalService` node and reference it from every other page's schema. Nothing currently ties the entities together.
- Populate `sameAs` once real profiles exist. Empty array today.
- `SoftwareApplication` per product with an explicit `provider` reference — doubles as the NomadIQ collision mitigation.
- `VideoObject` on the two hero videos; `ImageObject` on product imagery.
- `dateModified` sitewide.
- Do **not** add `Review` or `AggregateRating` — the testimonials are unattributable and marking them up risks a manual action.

## Content reformatting suggestions

- Wrap the seven `contact.html` FAQ questions in `<h3>` inside the existing `<summary>`. Keeps the accordion, fixes the heading hierarchy.
- Convert the four pricing tiers into a real `<table>`. Currently prose and cards; tables are the most citable comparative format.
- Add question-phrased H2s to services and products: "How does workflow automation work?", "What does automation cost in South Africa?", "Which apps can Do.Qix connect?"
- Move the "over 400 integrations" and POPIA answers out of the contact page and onto services, where commercial intent lands. They are the two most citable passages on the site and they are in the least-trafficked place.
- Add `label[for]` to the five unlabeled inputs on homepage and services. `agent_ux_check.py` scores both 80/100 for this alone; products and contact score 100.

---

## Limitations

- Search index is US-weighted. SA-local surfaces may hold presence not visible here.
- No live citation testing against ChatGPT, Perplexity or AI Overviews was performed — that needs DataForSEO's AI-visibility endpoints, which are not installed. Platform scores are structural assessments, not measured citation rates.
- No CrUX or Lighthouse data (no Google API key configured).
- Testimonial authenticity was not assessed; only their presentation as unattributable.
