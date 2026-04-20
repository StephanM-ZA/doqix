# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-20
**Branch:** main
**Version:** web-v0.5.0 (pushed, live)

---

## Homepage (index.html) — COMPLETE

### Features Built
1. **Hero** — Video background (10% opacity), headline, proof points with double-ring bullets, CTA
2. **Problem section** — Pain points with stats
3. **Solution section** — Feature cards
4. **How it works** — Step-by-step timeline
5. **ROI Calculator** — Config-driven sliders, tier recommendations, contextual nudges, share button with emoji copy, CTA links to contact with pre-filled results
6. **Pricing** — 4 tiers (Solo R999, Team R2500, Business R5500, Enterprise custom), dynamic highlight from calculator
7. **Testimonials** — Infinite carousel with autoplay, 7 profile photos loaded
8. **CTA section** — Final conversion block ("Let's Talk" links to contact)
9. **Header** — Logo image, nav (Home, Contact), mobile hamburger, "Get Started" links to #pricing
10. **Footer** — Logo, contact info (email, phone, WhatsApp, location), nav/legal/social links, copyright

### Updates This Session (web-v0.5.0)
- Testimonial photos added (7 images matched by name)
- All buttons updated: "Get Started" (nav/hero), "Select Plan" (pricing), "Let's Talk" (bottom CTA)
- No button uses the word "Free" anywhere
- All CTA buttons wired: Get Started -> #pricing, Select Plan -> contact.html, Let's Talk -> contact.html
- ROI calculator CTA links to contact.html with pre-filled results via URL param
- Share text updated (removed "free calculator")
- Services and Products removed from nav until pages are ready
- Favicon and logo updated

---

## Contact Page (contact.html) — COMPLETE

### Features Built
1. **Hero** — Radial gradient (hero-gradient class), "Let's Get Your Time Back" with green accent
2. **Form** — 2-column layout (7/5 grid), fields: name, email, company, size, message, source
3. **Form validation** — Client-side required fields, email format, honeypot spam protection
4. **Form submission** — POST to n8n webhook, "Sending..." state, success message
5. **Contact info card** — "Prefer a chat?" with email, phone, WhatsApp, location, hours
6. **Trust badges** — 100+ Workflows, POPIA Compliant, No Lock-in, No Hidden Fees
7. **What Happens Next** — 5-step vertical timeline with pill label "Your Journey"
8. **FAQ** — 7 accordion items with pill label "Got Questions?", copy from Website_Copy.md
9. **Bottom CTA** — "Ready to Get Your Time Back?" with "Let's Talk" linking to #contact-form
10. **Header/Footer** — Global components, Contact set as active nav link

### n8n Webhook (live)
- Workflow: "DoQix - Website Contact Form" in Do.Qix folder
- Endpoint: https://hooks.digitaloperations.co.za/webhook/doqix-contact (POST)
- Sends email to stephan@digitaloperations.co.za with branded HTML template
- From: stephan@digitaloperations.co.za
- Email delivery has slight delay (mail server greylisting), arrives within minutes
- ROI calculator results pre-fill the message field via ?roi= URL parameter

---

## New Reusable Components Added to global.css
- `.form-field` — Form inputs with focus states, validation, error display
- `.faq-item` — Accordion Q&A with chevron rotation
- `.trust-badge` — Stat/icon trust signal cards
- `.contact-channel` — Icon-circle + label + value rows
- `a.btn:hover` / `a.btn-primary:hover` — Fix for teal-on-teal hover bug on link buttons

---

## New Documentation
- `docs/build/Page_Build_Playbook.md` — Step-by-step instructions for building each page, design system reference, button text convention, per-page checklist

---

## Design System Established
- **Background:** Royal Navy #0C1830 with full surface hierarchy
- **Logo:** logo_new_green.png (header 3rem, footer 10rem width)
- **Favicon:** favicon_green.png
- **Font:** Inter only
- **Accent:** Teal #00e5a0, Amber #ff8000
- **Common components in global.css:** .bullet-list, .banner, .callout, .card, .btn variants, .form-field, .faq-item, .trust-badge, .contact-channel, .hero-gradient, .timeline, pricing cards, footer/header styles
- **Component HTML snippets:** design/components/header.html, design/components/footer.html

---

## Button Text Convention
| Context | Text |
|---------|------|
| Header/nav CTA | "Get Started" -> #pricing (or index.html#pricing from other pages) |
| Hero CTA | "Get Started" -> #pricing |
| Mid-page section CTAs | "Get Started" -> #pricing |
| Pricing cards | "Select Plan" -> contact.html |
| Enterprise pricing | "Show Me What's Possible" |
| Contact form submit | "Get My Plan" |
| Bottom CTA | "Let's Talk" -> contact.html |
| ROI calculator CTA | "Get Started" -> contact.html with ?roi= data |

**Rule:** No button uses the word "Free". Ever.

---

## Pages To Build

| Page | Stitch Design | Status |
|------|--------------|--------|
| index.html | design/index/ | DONE |
| contact.html | design/contact/ | DONE |
| services.html | design/services/ | TODO |
| products.html | design/products/ | TODO |
| privacy-policy.html | design/privacy-policy/ | TODO |
| terms-and-conditions.html | design/terms-and-conditions/ | TODO |
| thank-you.html | design/thank-you/ | TODO |
| 404.html | design/404/ | TODO |
| cookie-banner.html | design/cookie-banner/ | TODO (overlay component) |
| exit-popup.html | design/exit-popup/ | TODO (overlay component) |

**Nav links:** Pages added to nav only when complete. Current nav: Home | Contact.

---

## Rules (in CLAUDE.md + memory)
- No inline JS
- No em dashes
- No hardcoding
- No "Free" in buttons
- Version tag (web-vX.Y.Z) on every push
- Cache-bust (?v=X.Y.Z) on all CSS/JS links
- Sync design/ to root on every push
- All sections use px-8 padding (matches footer)
- main = website, plugins = WordPress plugins
- Pages added to nav only when fully built

---

## Deployment Notes
- GitHub Pages builds are working correctly (legacy mode, main:/)
- CDN is GitHub's Fastly (cache-control: max-age=600, 10 min)
- No Cloudflare proxy layer detected (DNS only)
- Browser-level caching is the main cause of "not updating" after push
- Hard refresh (Cmd+Shift+R) or incognito window resolves stale content
- Root domain (digitaloperations.co.za) redirects to /doqix/ via stephanm-za.github.io repo

## Contact Details
- Email: stephan@digitaloperations.co.za
- Phone: +27 61 514 8375
- WhatsApp: wa.me/27615148375
- Location: Cape Town, South Africa

## Deployment
- GitHub Pages: digitaloperations.co.za/doqix/
- Two-repo setup: stephanm-za.github.io (CNAME + redirect) + doqix (content)
- Cloudflare DNS, SSL active
- n8n webhook: hooks.digitaloperations.co.za/webhook/doqix-contact

---

## Next Steps

1. Build services page (design/services/) — most complex, shares ROI calculator + pricing
2. Build products page (design/products/)
3. Build remaining pages (privacy-policy, terms, thank-you, 404)
4. Add cookie-banner and exit-popup overlays
5. Add each page to nav as completed
6. Fix email deliverability (SPF/DKIM on mail server)

---

## Resume Command
Say "resume" to continue. Next up: services page.
