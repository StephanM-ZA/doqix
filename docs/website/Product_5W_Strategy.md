# Product 5W Strategy

> **Project rule.** Every Do.Qix product (current and future) is described using this template. Wherever a product is written about — products page card, info popup, terms tab, promo copy, landing page, blog post — the 5W structure applies.

This doc is the single source of truth for "how do we talk about a Do.Qix product?" If a marketing surface conflicts with this template, fix the surface, not the template.

---

## The template (in order)

Every product description, popup, or pitch follows these blocks **in this exact order**:

1. **Status pill** — eyebrow chip, 6 chars or fewer where possible. Examples: `Live`, `Live · R99/mo`, `In Development`. Tone is `live` (green) or `dev` (orange).
2. **Title with green accent** — short, sharp, in-voice. The headline hook *plus* one phrase wrapped in `<span class="accent">…</span>`. Examples:
    - `Every solar system on <accent>one screen</accent>`
    - `You don't have time to write. <accent>We do.</accent>`
    - `Field operations, managed from <accent>anywhere</accent>`
3. **Hook line** — one to two sentences directly under the title. Names the customer's pain or the differentiator. No fluff, no hedge.
4. **Feature pills** — 3–6 short capability tags. Pillify: `GPS-verified`, `Real-time`, `R99/mo flat`, `Multi-channel`. **Always include `Learns from your feedback` as the last pill** — every Do.Qix product has a feedback pipeline.
5. **5W rows** — five labelled rows, one paragraph each, in this order:
    - **Who** — the customer profile + their pain
    - **What** — what the product mechanically does (and one sentence on the feedback loop — *every product*)
    - **Why** — the differentiator, why this matters
    - **When** — the trigger moment, the cost of waiting
    - **Where** — the operational context (geography, integrations, hosting, channels)
6. **CTAs** — primary glow button (`Get in Touch`) + secondary text link (`See product` or `Read terms`). Buttons get the standard chevron via `.btn::after`.
7. **Footnote** — small print on pricing or status (e.g., "R99/mo flat. Month-to-month, no long-term contract.").

---

## Section-by-section guidance

### Status pill

- **Live with flat public pricing**: `Live · R<X>/mo flat` (e.g., `Live · R99/mo flat`). Use **flat** when every customer pays the same rate regardless of scope.
- **Live with scaling public pricing**: `Live · From R<X>/mo` (e.g., `Live · From R499/mo`). Use **From** when the deliverable scales with customer scope (channels, cadence, system count, seats). The R<X> is the floor; final price is locked in the engagement letter at onboarding.
- **Live with custom pricing**: `Live · Custom pricing`. Use when no public floor exists.
- **In development**: `In Development`. Use the `dev` tone (orange). Every other status uses `live` (green).

### Pricing language ("Flat" vs "From" vs "Custom")

The status pill's pricing language must match how the product actually bills. Pick one:

| Pricing model | Status pill | Card chip | Footnote pattern |
|---|---|---|---|
| Flat (same rate for everyone) | `Live · R<X>/mo flat` | `R<X> /month` | "R<X> per month, flat. Month-to-month, no long-term contract." |
| Scaling (depends on scope) | `Live · From R<X>/mo` | `From R<X> /month` (small "From" prefix) | "From R<X> per month. Pricing scales with [the dimensions]; final price locked at onboarding." |
| Custom | `Live · Custom pricing` | (no chip — link to contact instead) | "Custom pricing per organisation. Contact us for a quote." |

When you use **From** pricing, the T&Cs page MUST also explain the scaling dimensions explicitly (e.g., SocialIQ scales on channels × cadence). Don't leave the customer guessing what the floor includes.

### Title

- Short. One line. No marketing-ese.
- Wrap one short phrase in `<span class="accent">…</span>` (1–3 words).
- The accented phrase carries the punch. Test: read the title with the accent phrase removed — the rest should still make sense, and the accented phrase should land hardest.

### Hook line

- One or two sentences max.
- Lead with the customer's pain OR the unique differentiator.
- No "we are passionate about…" "leveraging cutting-edge…" kind of language.
- Anti-pattern: any sentence that could appear on five other products' pages. If it could, rewrite it product-specific.

### Feature pills

- 3–6 pills. Each is 1–4 words.
- Mix categories: technical capability, business outcome, integration, channel, and one cultural/voice pill.
- **Always end with `Learns from your feedback`** — see "Capability beats every product must carry" below.
- Examples (do):
    - VoltIQ: `Deye ✓` `Sunsynk ✓` `Luxpower ✓` `WhatsApp-first` `White-label` `Learns from your feedback`
    - SocialIQ: `Research from your sources` `Drafted in your voice` `You approve every post` `Multi-channel` `Learns from your feedback`
- Examples (don't):
    - `Best in class`, `Award-winning`, `Industry-leading` — empty marketing claims
    - Any pill that names a number you can't honestly commit to

### 5W rows

Each row is *one paragraph*, 2–4 sentences. Plain language.

**Who** — Be specific about who is and isn't a customer. End with a "you're our customer" line that calls out a recognisable pain.

> Example (NomadIQ): "Service companies with field staff: cleaners, technicians, security teams, maintenance crews. If 'did the team actually show up?' is a question you can't answer fast enough, you're our customer."

**What** — Describe the mechanism, not the marketing. End with a sentence on how the product *learns from feedback over time*. This is mandatory; see below.

> Example (SocialIQ): "We do the time-consuming part. Tell SocialIQ the topics that matter and the sources you trust, and it pulls fresh material, drafts posts in your brand voice, and queues everything in a dashboard for you to approve before it publishes. Every approval, edit, and rejection feeds back into the writer: drafts sound more like you over time, not less."

**Why** — One paragraph contrasting the product against the obvious alternative ("most X just Y, this product Z"). Make the differentiator concrete.

> Example (SocialIQ): "Most social media tools just schedule what you already wrote. Most 'AI content' tools produce generic mush you would be embarrassed to post. SocialIQ does the slow parts (research and writing) so you only do the fast parts (approve, edit, publish)."

**When** — Trigger moments. Three concrete situations where the customer realises they need this *now*. Strong on cost-of-waiting framing.

> Example (VoltIQ): "Now. The longer you wait, the more silent faults you carry on your books. Every customer who calls you about a fault you should have caught is a churn risk."

**Where** — Operational context only. Geography (SA-hosted), pricing (ZAR), supported integrations, channels, hosting model. **Do not** restate marketing themes here — keep it factual.

> Example (NomadIQ): "Anywhere with field staff and intermittent connectivity. The PWA caches offline and syncs when signal returns. Built for SA labour realities, hosted on SA infrastructure."

### CTAs

- Primary: `<a class="btn btn-primary glow">Get in Touch</a>` (the chevron is added automatically by `.btn::after`).
- Secondary: a smaller text link (`info-popup-secondary` class). Usually points to the product T&Cs tab or the card anchor.
- Don't promote three actions; two is enough. The popup is for "tell me more," not for forking the journey.

### Footnote

- Pricing fact, contract terms, or status caveat. Small grey type, never bold.
- Always end with the pricing terms link or product-specific T&Cs anchor where relevant.

---

## Capability beats every product must carry

These three messages appear on every product, in slightly different wording:

1. **Learns from your feedback** — the "feedback pipeline" message. Surfaces as a pill (always last) AND a one-sentence beat in the WHAT row. Every Do.Qix product gets sharper as the customer uses it; this is a brand-level differentiator.
2. **In your voice / your sources / your topics** — Do.Qix products adapt to *your* business. They are not generic. Lead with "your" wherever the surface allows.
3. **Human approval / human review** — automation does the slow work, you make the call. Particularly important for SocialIQ, but every product surfaces this somewhere (NomadIQ via dashboards you control, VoltIQ via alerts you confirm, etc.).

---

## Anti-hallucination rules

When writing 5W copy for any product:

- **Verify before claiming.** Don't invent integrations, capabilities, customer counts, or compliance certifications. Source claims from existing product docs, codebases, or direct user input.
- **No fabricated numbers.** Don't write "10+ stores", "1000+ posts", "47% faster" unless you have it documented somewhere I can point to. Round, made-up numbers are an AI tell.
- **No fixed quantity promises** unless the product literally guarantees it. SocialIQ deliberately does NOT name a posting cadence in marketing because the cadence flexes per customer. VoltIQ says R99/mo flat because that IS the rate.
- **No platforms not yet supported.** VoltIQ markets Deye, Sunsynk, and Luxpower (all live). Don't list any other brand (SunGrow, Growatt, Huawei, etc.) as supported until it's confirmed live. The same principle applies to any product: never market integrations / platforms before they actually ship.

---

## Anti-AI-tells (prose rules)

These also live in the project CLAUDE.md, but specifically for product copy:

- **No em dashes (—).** Use period, comma, colon, parentheses, or en dash for attributions.
- **No "delve into," "leverage," "harness the power of," "unlock," "in today's fast-paced world."**
- **No three-item rhyming triads.** "Faster, smarter, better" is the AI tell of AI tells.
- **No starting with "Are you tired of…?"** — start with the customer, not the rhetorical question.
- **South African English, human voice.** Spell "colour," "organisation," "centralised." Sentences can be short. A fragment is fine. So is "yes" or "no" as a paragraph.

---

## Where the template is wired (canonical implementation)

When you change this strategy, update each of these surfaces too:

- `design/products/products.html` — card layout per product
- `design/components/js/info-popup.js` — the `PRODUCTS` config object renders the 5W
- `design/products-terms/products-terms.html` — per-product tab content
- `docs/website/Product_Deep_Links.md` — promo copy snippets
- This document

If a new product is added, it MUST:
1. Have all 7 template blocks above
2. Carry the three capability beats (feedback / your-voice / human approval)
3. Pass the anti-hallucination + anti-AI-tells checks
4. Be added in the same order across products page, popup, terms tab, deep-link doc
