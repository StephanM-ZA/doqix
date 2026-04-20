# CHECKPOINT — Do.Qix Website Design

**Date:** 2026-04-20
**Branch:** main
**Version:** web-v0.7.5 (pushed, live)

---

## All Pages — COMPLETE

| Page | Status | Version |
|------|--------|---------|
| index.html | DONE | v0.7.0+ |
| services.html | DONE | v0.7.0+ |
| products.html | DONE | v0.7.0+ |
| contact.html | DONE | v0.7.0+ |
| 404.html | DONE | v0.7.0+ |
| thank-you.html | DONE | v0.7.0+ |
| privacy-policy.html | DONE | v0.7.0+ |
| terms-and-conditions.html | DONE | v0.7.0+ |
| exit-popup | DONE (overlay) | v0.7.0+ |
| cookie-banner | DONE (overlay) | v0.7.0+ |

**Nav:** Home | Services | Products | Contact

---

## SEO — Implemented

### Phase 1 (meta + indexing)
- Meta descriptions on all pages
- Keyword-forward page titles
- Canonical URLs
- Open Graph + Twitter Card tags
- robots.txt + sitemap.xml
- noindex on thank-you + 404
- JSON-LD: LocalBusiness (index), FAQPage (contact), Service (services)

### Phase 3 (performance)
- Font preconnect hints
- Hero video preload="metadata"

### Phase 4 (polish)
- Dead social links removed
- `<label>` eyebrows changed to `<span class="label">`
- site.webmanifest created
- hreflang="en-za" on all indexable pages
- Google Search Console verified
- Google Analytics 4 (G-BC57HM6CTG) on all pages
- OG image (og_image.jpg) linked

---

## This Session (web-v0.7.0 to v0.7.5)

### Built and Pushed
- Privacy policy page (POPIA-compliant, 15 sections)
- Terms and conditions page
- Products page (NomadIQ, VendIQ, VoltIQ, LearnIQ with images, badges, overlays)
- Cookie banner component (3-tier consent)
- Products added to nav on all pages
- Header CTA changed to "Let's Build"
- Consistency audit fixes (nav, cache-bust, scripts, Tailwind config, design tokens, domains, pills)
- Mobile/responsive audit fixes (typography scaling, hero height, footer grid, tap targets, hamburger, arrows, legal tables)
- Full SEO implementation (Phases 1, 3, 4)
- Scroll-reveal made global via main.js
- Services blockquote card green border fix (inset box-shadow)
- Services Data & Control section in cards
- Contact trust badges in cards
- Product status badges (Live/In Progress)
- Product images with tinted overlays
- Contact form pre-fill from product links
- FAQ v2.0 expanded to 120+ questions (committed, not pushed)
- Folder cleanup: removed AdobeStock (1.6GB), site/, components/, samples/, remotion-video/, preview files
- Registered entity updated to Digital Operations and Technology (Pty) Ltd

---

## Design System
- **Background:** Royal Navy #0C1830
- **Accent:** Teal #00e5a0, Amber #ff8000
- **Font:** Inter only
- **Logo:** logo_new_green.png
- **Components:** design/components/ (header, footer, exit-popup, cookie-banner)
- **Eyebrows:** `<span class="label">` (not `<label>`)
- **Cards:** `.card` class with hover lift + scroll-reveal (global)
- **Product badges:** `.product-badge.live` (green), `.product-badge.in-progress` (orange)

---

## Button Text Convention
| Context | Text |
|---------|------|
| Header/nav CTA | "Let's Build" (id="cta-lets-build") |
| Hero CTA | "Get Started" -> #pricing |
| Pricing cards | "Select Plan" -> contact.html |
| Enterprise pricing | "Show Me What's Possible" -> contact.html |
| Contact form submit | "Get My Plan" |
| Bottom CTA | "Let's Talk" -> contact.html |
| ROI calculator CTA | "Get Started" -> contact.html with ?roi= data |
| Exit popup CTA | "Get Started" -> contact.html |
| Product "Learn More" | -> contact.html?product=[name] (pre-fills message) |

**Rule:** No button uses the word "Free". Ever.

---

## Contact Details
- Email: stephan@digitaloperations.co.za
- Phone: +27 61 514 8375
- WhatsApp: wa.me/27615148375
- Location: Cape Town, South Africa
- Entity: Digital Operations and Technology (Pty) Ltd, trading as Do.Qix

## Deployment
- GitHub Pages: digitaloperations.co.za/doqix/
- Two-repo setup: stephanm-za.github.io (CNAME + redirect) + doqix (content)
- Cloudflare DNS, SSL active
- n8n webhook: hooks.digitaloperations.co.za/webhook/doqix-contact
- Google Search Console: verified (HTML tag)
- Google Analytics: G-BC57HM6CTG

---

## Uncommitted Changes
- Folder cleanup (deleted AdobeStock, site/, components/, samples/, remotion-video/, preview files)
- FAQ v2.0 (committed, not pushed)

---

## Still To Do

### Performance
1. Replace Tailwind CDN with compiled/purged CSS
2. Add poster images to hero videos
3. Add Apple Touch Icon (180x180)

### External Setup
4. Create Google Business Profile for Cape Town
5. Register on SA directories (Yellow Pages, Brabys, Cylex, Snupit)
6. Fix email deliverability (SPF/DKIM on mail server)
7. Verify Cloudflare settings (HSTS, Always HTTPS, Full SSL mode)

### Content
8. Add real social media links once profiles exist
9. Blog/case studies page for long-tail keyword content
10. Create per-product OG images

### Future Website Functionality (roadmap)
- **AI Builder** — site feature TBD
- **AI Chatbot** — site feature TBD

---

## Resume Command
Say "resume" to continue from this checkpoint.
