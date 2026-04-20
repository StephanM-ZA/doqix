# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-20
**Branch:** main
**Version:** web-v0.6.4 (pushed, live)

---

## Homepage (index.html) — COMPLETE

### Features Built
1. **Hero** — Video background (10% opacity), headline, proof points with double-ring bullets, CTA
2. **Problem section** — Pain points with stats
3. **Solution section** — Feature cards
4. **How it works** — Step-by-step timeline
5. **ROI Calculator** — Config-driven sliders, tier recommendations, contextual nudges, share button with emoji copy, CTA links to contact with pre-filled results
6. **Pricing** — 4 tiers (Solo R999, Team R2500, Business R5500, Enterprise custom), dynamic highlight from calculator
7. **Testimonials** — Infinite carousel with autoplay, 7 profile photos in images/ folder
8. **CTA section** — Final conversion block with "Next Step" pill, "Let's Talk" links to contact
9. **Header** — Logo image, nav (Home, Services, Contact), mobile hamburger, "Get Started" links to #pricing
10. **Footer** — Logo, contact info (email, phone, WhatsApp, location), nav/legal/social links, copyright
11. **Exit-intent popup** — Fires once per session on exit intent

### Updates This Session (web-v0.6.x)
- Services added to nav across all pages
- "Next Step" pill added to bottom CTA
- Enterprise CTA fixed from dead `<button>` to `<a href="contact.html">`
- Testimonial images moved to images/ subfolder
- Exit-intent popup loaded on all pages

---

## Services Page (services.html) — COMPLETE

### Features Built
1. **Hero** — Video background (15% opacity), hero-gradient, "What We Automate" with green accent
2. **How Automation Works** — 4 logic cards (Trigger, Rule, Condition, Action)
3. **What We Automate** — 12 category cards with apps and "what you stop doing"
4. **Quick Wins** — 8 department cards showing fastest results
5. **Our 5-Step Plan** — Vertical timeline (Identify, Map, Start Small, Test & Refine, Monitor & Optimise)
6. **The Caution** — Blockquote: "Automation applied to an inefficient operation will magnify the inefficiency"
7. **Why Choose Us** — 6 reason cards (Plain English, Fix First, Rand Pricing, Data Control, Local, Long-term)
8. **Real Results** — Stat row + 4 SA case study cards
9. **ROI Calculator** — Reused from homepage
10. **Pricing** — 4 tiers reused from homepage
11. **Data & Control** — 6 n8n/POPIA features
12. **Bottom CTA** — "Next Step" pill, "Ready to See What's Possible?", "Let's Talk" to contact
13. **Header** — Services set as active nav link, CTA links to #pricing (on-page)
14. **Exit-intent popup** — Fires once per session

### Hero Video
- Source: AdobeStock_769539850.mov (924MB 4K ProRes, deleted after conversion)
- Converted: services-hero-video.mp4 (661KB, 1280px, H.264, CRF 28)
- Opacity: 15% (page-specific override, homepage is 10%)

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
9. **Bottom CTA** — "Next Step" pill, "Ready to Get Your Time Back?" with "Let's Talk" linking to #contact-form
10. **Header/Footer** — Global components, Contact set as active nav link
11. **Exit-intent popup** — Fires once per session

### n8n Webhook (live)
- Workflow: "DoQix - Website Contact Form" in Do.Qix folder
- Endpoint: https://hooks.digitaloperations.co.za/webhook/doqix-contact (POST)
- Sends email to stephan@digitaloperations.co.za with branded HTML template
- From: stephan@digitaloperations.co.za
- Email delivery has slight delay (mail server greylisting), arrives within minutes
- ROI calculator results pre-fill the message field via ?roi= URL parameter

---

## 404 Page (404.html) — COMPLETE

### Features Built
1. **Hero** — Full viewport, hero-gradient, "404" pill
2. **Headline** — "This page got automated out of existence"
3. **CTAs** — "Take Me Home" (index) + "Get In Touch" (contact)
4. **No scroll-reveal** — Single-section page, content always visible
5. **Exit-intent popup** — Fires once per session

---

## Exit-Intent Popup — COMPLETE (overlay component)

### Implementation
- **JS:** `design/components/js/exit-popup.js` (synced to `js/exit-popup.js`)
- **CSS:** In global.css under EXIT-INTENT POPUP section
- **No HTML file needed** — JS injects the overlay HTML into the DOM
- **Loaded on:** All 4 pages (index, services, contact, 404)

### Behaviour
- Fires once per session (sessionStorage)
- 5-second minimum time on page before trigger
- Desktop: mouse leaves viewport from the top
- Mobile: rapid scroll-up near top of page
- Dismiss: X button, backdrop click, "I'll keep doing it manually" text, Escape key
- CTA: "Get Started" -> contact.html

### Copy
- Headline: "Your team is losing a full day every week to busywork"
- Body: "30% of the average work week goes to tasks a machine could handle. We'll show you exactly where."
- CTA: "Get Started" (no "Free")
- Dismiss: "I'll keep doing it manually"

---

## Design Folder Cleanup (this session)

### Deleted
- AdobeStock_1678170583.mov (1.6GB raw homepage stock footage)
- bg-test.html, color-test.html (test files)
- BACKGROUND-CHANGE-NOTES.md (old session notes)
- roi-calculator-preview.html (standalone preview)
- design-system/ folder (duplicate DESIGN.md)
- js/components.js (unreferenced)

### Reorganized
- 7 testimonial images moved from design/ root to design/images/
- Root copies moved to images/ subfolder
- Image paths updated in index.html (design + root)

---

## Reusable Components in global.css
- `.form-field` — Form inputs with focus states, validation, error display
- `.faq-item` — Accordion Q&A with chevron rotation
- `.trust-badge` — Stat/icon trust signal cards
- `.contact-channel` — Icon-circle + label + value rows
- `a.btn:hover` / `a.btn-primary:hover` — Fix for teal-on-teal hover bug on link buttons
- `#exit-popup-overlay` — Exit-intent popup with backdrop, card, slide-up animation

---

## Documentation
- `docs/build/Page_Build_Playbook.md` — Step-by-step build process, design system reference, button text convention, per-page checklist
- Updated: Header CTA link rule (on-page #pricing for pages with pricing section)

---

## Design System
- **Background:** Royal Navy #0C1830 with full surface hierarchy
- **Logo:** logo_new_green.png (header 3rem, footer 10rem width)
- **Favicon:** favicon_green.png
- **Font:** Inter only
- **Accent:** Teal #00e5a0, Amber #ff8000
- **Component HTML:** design/components/header.html, design/components/footer.html
- **Component JS:** design/components/js/exit-popup.js

---

## Button Text Convention
| Context | Text |
|---------|------|
| Header/nav CTA | "Let's Build" (id="cta-lets-build") -> TBD (currently #pricing or index.html#pricing) |
| Hero CTA | "Get Started" -> #pricing |
| Mid-page section CTAs | "Get Started" -> #pricing |
| Pricing cards | "Select Plan" -> contact.html |
| Enterprise pricing | "Show Me What's Possible" -> contact.html |
| Contact form submit | "Get My Plan" |
| Bottom CTA | "Let's Talk" -> contact.html |
| ROI calculator CTA | "Get Started" -> contact.html with ?roi= data |
| Exit popup CTA | "Get Started" -> contact.html |

**Rule:** No button uses the word "Free". Ever.

---

## Heading Convention
- Every H2 has a `<label>` pill above it (e.g., "Our Services", "The Logic", "Next Step")
- Every H1 and H2 has a `<span class="text-primary">` green accent on key words
- H3s do not end with periods

---

## Pages Status

| Page | Stitch Design | Status |
|------|--------------|--------|
| index.html | design/index/ | DONE |
| contact.html | design/contact/ | DONE |
| services.html | design/services/ | DONE |
| 404.html | design/404/ | DONE |
| exit-popup | design/components/js/ | DONE (overlay component) |
| products.html | design/products/ | TODO |
| privacy-policy.html | design/privacy-policy/ | TODO |
| terms-and-conditions.html | design/terms-and-conditions/ | TODO |
| thank-you.html | design/thank-you/ | TODO |
| cookie-banner | design/cookie-banner/ | TODO (overlay component) |

**Nav links:** Home | Services | Contact (pages added when complete).

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
- Pills above every H2, green accent on key words
- Header CTA links to #pricing on pages with pricing, index.html#pricing otherwise

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

1. Fix email deliverability (SPF/DKIM on mail server)
2. Push all unpushed pages as web-v0.7.0

## Future Website Functionality (roadmap)

- **AI Builder** — site feature TBD
- **AI Chatbot** — site feature TBD

---

## Unpushed Changes This Session

Everything below is built but NOT yet pushed (pending approval):

### Pages Built
- **Services page** (web-v0.6.0 to v0.6.5, pushed)
- **404 page** (web-v0.6.3, pushed)
- **Exit-intent popup** component (web-v0.6.4/v0.6.5, pushed)
- **Thank-you page** (web-v0.6.6/v0.6.7, pushed)
- **Privacy policy page** + MD source (NOT pushed)
- **Terms and conditions page** (NOT pushed)
- **Cookie banner** component (NOT pushed)
- **Products page** with 4 products: NomadIQ, VendIQ, VoltIQ, LearnIQ (NOT pushed)
- **Products added to nav** on all pages (NOT pushed)
- **Header CTA** changed to "Let's Build" with anchor IDs (pushed partially)
- **Bottom CTA teal tint** on services + contact (pushed)
- **Design folder cleanup** (pushed)
- **Registered entity** updated to Digital Operations and Technology (Pty) Ltd (NOT pushed)

### Pending Fixes (from consistency audit)
1. contact.html missing Products nav link (desktop + mobile)
2. Cache-bust versions inconsistent across all pages (normalize to 0.7.0)
3. exit-popup.js missing from thank-you, privacy-policy, terms pages
4. thank-you.html has trimmed Tailwind config (needs full palette)
5. text-zinc-* classes in pricing/testimonials (replace with design tokens)
6. terms-and-conditions.html references doqix.co.za (should be digitaloperations.co.za/doqix)
7. thank-you.html H1 needs label pill
8. Mobile/responsive audit pending

### Tool Call Count: 50+ (checkpointing now)

## Resume Command
Say "resume" to continue. Fix consistency issues, then push all unpushed pages.
