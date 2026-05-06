# Product Deep Links

Use these URLs in social posts, ad campaigns, partner emails, and QR codes.

The **promo URL is the product card anchor** on the products page. It lands the user on the card with full info, the pulsating ⓘ for a 5W rundown, and the "Get in Touch" CTA. The contact-form-prefill URL stays available for in-page UX (the card buttons still use it) but is *not* the URL to share externally.

Base URL: `https://digitaloperations.co.za/doqix/`

## Deep Links

| Product | Promo URL (share this) | Contact form prefill (in-page only) | Product T&Cs Tab |
|---|---|---|---|
| **NomadIQ** | `https://digitaloperations.co.za/doqix/products.html#nomadiq` | `contact.html?product=nomadiq` | `products-terms.html#nomadiq` (placeholder; full terms issued on engagement) |
| **VendIQ** | `https://digitaloperations.co.za/doqix/products.html#vendiq` | `contact.html?product=vendiq` | `products-terms.html#vendiq` (placeholder; full terms issued on engagement) |
| **VoltIQ** | `https://digitaloperations.co.za/doqix/products.html#voltiq` | `contact.html?product=voltiq` | `https://digitaloperations.co.za/doqix/products-terms.html#voltiq` |
| **SocialIQ** | `https://digitaloperations.co.za/doqix/products.html#socialiq` | `contact.html?product=socialiq` | `https://digitaloperations.co.za/doqix/products-terms.html#socialiq` |
| **LearnIQ** | `https://digitaloperations.co.za/doqix/products.html#learniq` | `contact.html?product=learniq` | `products-terms.html#learniq` (placeholder; full terms at GA) |

All product terms live on a single tabbed page (`products-terms.html`). Deep-link to a specific product's tab via the URL fragment (`#nomadiq`, `#vendiq`, `#voltiq`, `#learniq`). The page defaults to the VoltIQ tab when no fragment is supplied.

## Why share the card URL, not the form URL

When a prospect clicks a promo link they need *context first, action second*. Landing on the contact form with no preamble is a bounce risk. Landing on the product card lets them:

1. See the price chip (where applicable, e.g. VoltIQ R99/mo).
2. Tap the pulsating ⓘ for the Who/What/Why/When/Where rundown.
3. Read the feature list and inverter / integration support.
4. Click "Get in Touch" themselves — at which point the `?product=…` prefill kicks in and they arrive at a contact form with the message already drafted.

That two-tap path tags the lead with the same product attribution while preserving information context. Share `products.html#<product>`; the prefill takes over once the user clicks the button.

## How the prefill works (in-page only)

The "Get in Touch" button on each product card carries `?product=<slug>`. When the contact page loads, `design/contact/js/contact-form.js` reads the query string, prefills the message with `"I was looking at your <Product> product and am interested to find out more."`, and scrolls the form into view. The webhook payload then carries that text as source attribution.

If you ever genuinely want to skip the card and land users straight on the form (e.g. a "Get in Touch" CTA on a non-products page), use the `contact.html?product=<slug>` URL directly. That's the only legitimate use of the prefill URL in promo material.

## When you change something

If you add a new product, rename one, or change the slug, edit:

- `design/contact/js/contact-form.js` (the `productNames` map)
- `design/products/products.html` (card `id`, ⓘ trigger `data-product`, button `?product=`)
- `design/products-terms/products-terms.html` (add a tab + panel)
- `design/products-terms/js/products-terms.js` (the `PRODUCTS` config + optionally `DEFAULT_PRODUCT`)
- `design/components/js/info-popup.js` (the `PRODUCTS` config — 5W copy, pills, hrefs)
- `design/terms-and-conditions/terms-and-conditions.html` (the §17 Products section)
- `scripts/build-sitemap.js` (`PAGE_META` if URLs change)
- This document

## VoltIQ — promotional snapshot (release status)

VoltIQ is the first SaaS product going on active promotion.

- **Price:** R99 per month, flat. Billed monthly in advance, ZAR. Month-to-month, no long-term contract.
- **Currently supported inverters at launch:** **Deye**, **Sunsynk**.
- **In progress:** **Luxpower**. Additional brands will follow.
- **What it does:** unified fleet monitoring for solar installers, automated issue detection, upsell flagging, co-branded WhatsApp morning reports, white-label dashboard.
- **Compliance footnote required in every promo asset:** include an asterisk after the price linking to `products-terms.html#voltiq`. The product card on the site already does this.
- **Don't promise:** Luxpower compatibility (still in progress), SunGrow/Growatt/Huawei or any other brand not listed above.

### Suggested promo copy (short)

> VoltIQ — every solar system on one screen. R99/mo.\* Launching with Deye and Sunsynk, Luxpower coming soon.
>
> See it: digitaloperations.co.za/doqix/products.html#voltiq
>
> \*Terms apply: digitaloperations.co.za/doqix/products-terms.html#voltiq

### Suggested promo copy (long)

> Managing a fleet of solar installs across Deye and Sunsynk shouldn't mean juggling four monitoring portals. VoltIQ pulls every system onto one screen, alerts you when something breaks before the customer notices, flags upsell opportunities, and ships a co-branded WhatsApp morning report you can send straight to your clients.
>
> R99 per month, flat.\* Launching with Deye and Sunsynk. Luxpower support is in progress; more inverters to follow.
>
> See it: digitaloperations.co.za/doqix/products.html#voltiq
>
> \*Terms apply: digitaloperations.co.za/doqix/products-terms.html#voltiq

## SocialIQ — promotional snapshot (release status)

SocialIQ is the second SaaS product going on active promotion.

- **Price:** From R499 per month. Pricing scales with the social channels you choose and the agreed posting cadence; final price is locked at onboarding. Billed monthly in advance, ZAR. Month-to-month, no long-term contract.
- **Positioning:** "You don't have time to write. We do." Lead with the time problem, the research-from-your-sources promise, and the human-approval safety net. Do NOT lead with quantity, platform list, or a fixed posting cadence.
- **What it does:** Tell SocialIQ the topics that matter and the sources you trust. It pulls fresh material, drafts posts in your brand voice, and queues everything in a dashboard for you to approve before publishing.
- **What's NOT included:** Publishing to platforms (you connect your own accounts), paid media management, strategic consulting.
- **Compliance footnote required in every promo asset:** include an asterisk after the price linking to `products-terms.html#socialiq`.
- **Don't promise:** a specific number of posts or a fixed platform list in marketing surfaces (those live in the engagement scope), automatic publishing without review (drafts always require human approval), credentials storage for destination platforms (we don't store them), or strategic content/brand consulting (out of scope).

### SocialIQ promo copy (short)

> SocialIQ — you don't have time to write social posts. We do. From R499/mo.\* Tell us your topics and sources; we research, draft in your voice, and queue everything for your approval.
>
> See it: digitaloperations.co.za/doqix/products.html#socialiq
>
> \*Terms apply: digitaloperations.co.za/doqix/products-terms.html#socialiq

### SocialIQ promo copy (long)

> Most "social media tools" just schedule what you already wrote. Most "AI content tools" produce generic mush you would be embarrassed to post. SocialIQ does the slow parts: it researches the topics that matter to your business from the sources you trust, drafts posts in your brand voice, and queues everything for you to approve before anything goes live. The fast parts (read, edit, publish) stay with you.
>
> From R499 per month.\* Pricing scales with the channels you choose and the agreed posting cadence; final price is locked at onboarding. Month-to-month, no long-term contract.
>
> See it: digitaloperations.co.za/doqix/products.html#socialiq
>
> \*Terms apply: digitaloperations.co.za/doqix/products-terms.html#socialiq

## Other products — promotion status

- **NomadIQ:** Live, custom pricing per organisation. Share `products.html#nomadiq` to lead with the card.
- **VendIQ:** Live, tiered pricing by stores/SKUs. Share `products.html#vendiq` to lead with the card.
- **LearnIQ:** In progress. Pricing not finalised. Share `products.html#learniq` only to register early interest.

## Tracking note

The card-anchor promo URL does NOT carry product attribution by itself — the user has to click "Get in Touch" before the `?product=` prefill kicks in and the lead arrives tagged.

If you need promo-channel attribution upstream of that click (LinkedIn vs Instagram vs partner email), add a `?src=<channel>` parameter to the card URL (e.g. `products.html?src=linkedin#voltiq`) and extend a small JS handler on the products page to forward it as `source` when the user clicks any product card button. Currently no such handler exists; the n8n webhook gets attribution only from the prefilled message text once the user lands on the contact form.
