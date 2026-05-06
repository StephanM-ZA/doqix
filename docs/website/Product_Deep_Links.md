# Product Deep Links

Use these URLs in social posts, ad campaigns, partner emails, and QR codes. Each link prefills the contact form's message field with the relevant product so the lead arrives tagged.

Base URL: `https://digitaloperations.co.za/doqix/`

## Deep Links

| Product | Promo URL (contact form, prefilled) | Card Anchor | Product T&Cs Tab |
|---|---|---|---|
| **NomadIQ** | `https://digitaloperations.co.za/doqix/contact.html?product=nomadiq` | `products.html#nomadiq` | `products-terms.html#nomadiq` (placeholder; full terms issued on engagement) |
| **VendIQ** | `https://digitaloperations.co.za/doqix/contact.html?product=vendiq` | `products.html#vendiq` | `products-terms.html#vendiq` (placeholder; full terms issued on engagement) |
| **VoltIQ** | `https://digitaloperations.co.za/doqix/contact.html?product=voltiq` | `products.html#voltiq` | `https://digitaloperations.co.za/doqix/products-terms.html#voltiq` |
| **LearnIQ** | `https://digitaloperations.co.za/doqix/contact.html?product=learniq` | `products.html#learniq` | `products-terms.html#learniq` (placeholder; full terms at GA) |

All product terms live on a single tabbed page (`products-terms.html`). Deep-link to a specific product's tab via the URL fragment (`#nomadiq`, `#vendiq`, `#voltiq`, `#learniq`). The page defaults to the VoltIQ tab when no fragment is supplied.

The `?product=` parameter is read by `design/contact/js/contact-form.js`; it prefills the message with `"I was looking at your <Product> product and am interested to find out more."` and scrolls the form into view.

## How the deep link works

1. User clicks the promo URL.
2. Contact page loads, JS reads `?product=` from the query string.
3. Message field auto-fills, form scrolls into view.
4. On submit, the standard `doqix-contact` webhook fires. Source attribution lives in the message text, so make sure not to repurpose the param name without updating the JS handler.

If you change the param name or add new products, edit:

- `design/contact/js/contact-form.js` (the `productNames` map)
- `design/products/products.html` (the four card buttons)
- `design/terms-and-conditions/terms-and-conditions.html` (the §17 Products section that links to `products-terms.html`)
- `design/products-terms/products-terms.html` (add a new tab + panel)
- `design/products-terms/js/products-terms.js` (extend `VALID` if a new tab is added — JS reads `data-product` attributes from the DOM, so no list editing needed for additions, but the `DEFAULT_PRODUCT` constant may need updating)
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
> \*Terms apply: digitaloperations.co.za/doqix/products-terms.html#voltiq

### Suggested promo copy (long)

> Managing a fleet of solar installs across Deye and Sunsynk shouldn't mean juggling four monitoring portals. VoltIQ pulls every system onto one screen, alerts you when something breaks before the customer notices, flags upsell opportunities, and ships a co-branded WhatsApp morning report you can send straight to your clients.
>
> R99 per month, flat.\* Launching with Deye and Sunsynk. Luxpower support is in progress; more inverters to follow.
>
> Get in touch: digitaloperations.co.za/doqix/contact.html?product=voltiq
>
> \*Terms apply: digitaloperations.co.za/doqix/products-terms.html#voltiq

## Other products — promotion status

- **NomadIQ:** Live, custom pricing per organisation. No public promo price; lead via deep link to scope.
- **VendIQ:** Live, tiered pricing by stores/SKUs. No public promo price; lead via deep link to scope.
- **LearnIQ:** In progress. Pricing not finalised. Use the deep link only to register early interest.

## Tracking note

These deep links currently rely on the prefilled message text for source attribution at the n8n webhook end. If campaign-level tracking is required (e.g., LinkedIn vs Instagram vs partner email), add a `&src=<channel>` parameter and extend `contact-form.js` to capture it into the `source` field of the webhook payload.
