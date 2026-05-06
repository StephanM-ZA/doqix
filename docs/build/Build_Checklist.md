# Do.Qix Website Build Checklist

**Version:** 1.0
**Date:** March 16, 2026
**Aligned with:** DoQix_Architecture.md v3.0, DoQix_Structure.md v3.0, Website_Copy.md v7.0, DoQix_Wireframe.md v3.0

---

## Phase 1: Foundation

- [ ] 1. Install WordPress on hosting (Afrihost/Hetzner/SiteGround)
- [ ] 2. Install Themify Ultra theme + Themify Builder
- [ ] 3. Install plugins:
  - [ ] Quform
  - [ ] Yoast SEO
  - [ ] WP Super Cache
  - [ ] ShortPixel or Smush
  - [ ] Google Site Kit (GA4)
  - [ ] All-In-One Security (AIOS)
  - [ ] Complianz or CookieYes
  - [ ] UpdraftPlus
- [ ] 4. Set up Cloudflare (free tier) + SSL
- [ ] 5. Apply design tokens — custom CSS in Themify Customizer:
  - [ ] Colours: `--ink #0D2028`, `--accent #ff8000`, `--action #0886B5`, `--text #0D2028`, `--bg #FFFFFF`, `--muted #6B7980`, `--line rgba(13,32,40,0.12)`
  - [ ] Font: Inter via Google Fonts CDN
  - [ ] Typography scale: H1 40/28px, H2 32/24px, H3 24/20px, Body 16px
  - [ ] Button styles: 4px radius, `--action` bg, white text, 12px 24px padding
- [ ] 6. Build sticky Header: logo left, nav links (Home | Services | Products | Contact), CTA button right
- [ ] 7. Build Footer: brand + tagline, quick links, contact info (hello@doqix.co.za, phone, WhatsApp), social (LinkedIn, X), legal line

---

## Phase 2: Home Page (`/`)

- [ ] 8. **Hero** — H1: "Stop the Busywork. Start What Matters." Subhead. CTA button. Proof line (100+ workflows | 24hr response | Priced in rands). Video/animation placeholder
- [ ] 9. **The Problem** — H2: "Your Team Is Losing a Full Day Every Week." 30% stat infographic. 6 bullet pain points. 3 icon cards (Money Drain / Talent Waste / Growth Killer). "Productivity Trap" closing line
- [ ] 10. **What We Do** — H2: "We Take the Boring Stuff Off Your Plate." 4 benefit cards (Mornings Back / Budgets Stretch / Data Works / People Do Real Work). "Not replacing anyone" reassurance
- [ ] 11. **How It Works** — H2: "Three Steps. That's It." 3-step flow graphic (Tell Us / We Build / Time Back). CTA button
- [ ] 12. **Why Us** — H2: "Why SA Businesses Choose Us." 6 trust points in 2-column grid (Plain English / Fix First / Rands Not Dollars / Data In Your Hands / We're Here / We Don't Disappear)
- [ ] 13. **Real Results** — H2: "This Is What Automation Actually Looks Like." 4 scenario cards (Property Agency JHB / Accounting Firm CPT / E-commerce Brand / Consultancy DBN). 4 stat badges (8-15 hrs/wk, 95%+ error reduction, R11k-R30k/mo saved, Days→minutes)
- [ ] 14. **Testimonials** — H2: "Don't Take Our Word For It." 3 quote cards (Jane M. JHB / David K. CPT / Thandi N. DBN)
- [ ] 15. **Bottom CTA** — Full-width `--action` bg. H2: "Ready to Get Your Time Back?" CTA button. "15 minutes. No commitment. No sales pitch."

---

## Phase 3: Services Page (`/services`)

- [ ] 16. **Hero** — H1: "What We Automate." Subhead: rule-based tasks, zero jargon, zero fluff
- [ ] 17. **How Automation Works** — H2: "The Simple Logic Behind Every Automation." 4-step flow diagram (Trigger / Rule / Condition / Action) with R5,000 order example
- [ ] 18. **What We Automate** — H2: "The Workflows We Build Every Day." Workflow grid image (prominent). 12 category cards (Finance & Billing, Sales & Leads, E-commerce, HR, Support, Marketing, Data Sync, Events, Compliance, Social & Feedback, Creative Approvals, Facility & IoT). Each with app names + "what you stop doing." Industry line + "400+ tools"
- [ ] 19. **Quick Wins** — H2: "Where Most Businesses Start." 8 department examples (Sales, Support, Finance, E-commerce, HR, Marketing, Events, Compliance) with specific app-to-app flows
- [ ] 20. **5-Step Plan** — H2: "Our 5-Step Plan." Sequential graphic (Identify / Map / Start Small / Test & Refine / Monitor & Optimise)
- [ ] 21. **ROI Calculator** — H2: "See What You Could Save." Embed ROI calculator widget. 3 static examples (R11k, R30k, R20k). CTA button
- [ ] 22. **The Caution** — H2: "One Thing We Tell Every Client First." Blockquote: "Automation applied to an inefficient operation will magnify the inefficiency." "We streamline first. Then automate."
- [ ] 23. **Pricing** — H2: "Pricing That Makes Sense." 4-column cards:
  - [ ] Solo: R999/mo, free setup, 1 workflow, email support
  - [ ] Team (highlighted "Most Popular"): R2,500/mo, R1,500 setup, up to 3 workflows, Priority + WhatsApp
  - [ ] Business: R5,500/mo, R2,500 setup, up to 6 workflows, dedicated + strategy call, training included
  - [ ] Enterprise: custom quote, unlimited scoped, dedicated account manager, training included
  - [ ] Inclusions line: hosting, monitoring, maintenance, POPIA, no lock-in
  - [ ] Extra workflows: Solo +R750, Team +R650, Business +R500
  - [ ] Add-on: Emergency support R500/hr
  - [ ] Launch offer: First month 50%
- [ ] 24. **Data & Control** — H2: "Your Data. Your Rules." 6 bullets (self-hosted n8n, POPIA, no lock-in, no dollar subs, etc.)
- [ ] 25. **Bottom CTA** — Full-width. H2: "Ready to See What's Possible?" CTA button

---

## Phase 4: Products Page (`/products`)

- [ ] 26. **Hero** — H1: "Tools That Work While You Don't." Subhead about standalone products
- [ ] 27. **Product Grid** — Placeholder card(s) using template: name, tagline, 3-5 features, ZAR price, CTA, optional badge (New/Popular/Coming Soon)
- [ ] 28. **Why Our Products** — H2: "Built From Real Automation Experience." 4 trust bullets (SA-hosted, rands, no lock-in, built by automators)
- [ ] 29. **Services Cross-Sell** — H2: "Need Something Custom?" Link to /services
- [ ] 30. **Bottom CTA** — H2: "Questions About Our Products?" CTA to /contact

---

## Phase 5: Contact Page (`/contact`)

- [ ] 31. **Hero** — H1: "Let's Get Your Time Back." Subhead
- [ ] 32. **Form (2-column layout)**
  - [ ] Left: Name*, Email*, Company (optional), Company Size* (dropdown: Just me / 2-15 / 16-50 / 51+), Biggest time-waster* (textarea), How did you hear? (optional dropdown). Button: "Get My Free Plan". Micro-copy: "24 hours. Usually sooner."
  - [ ] Right: "Prefer a chat?" — email, phone, WhatsApp, hours, "we'll tell you straight" line
  - [ ] Trust badges below form: 100+ workflows, POPIA, no lock-in, no hidden fees
- [ ] 33. **What Happens Next** — 5 numbered steps (Respond fast / Listen / No pitch / Clear plan / You decide)
- [ ] 34. **FAQs** — 7 questions in accordion or list (Timelines, Tech knowledge, Apps, Existing systems, Data safety, Cost, Cancellation)
- [ ] 35. **Form actions** — email notification + webhook to CRM/n8n + redirect to /thank-you

---

## Phase 6: Supporting Pages

- [ ] 36. **Thank You** (`/thank-you`) — H1: "We Got You." Confirmation + next steps + content link
- [ ] 37. **Privacy Policy** (`/privacy`) — POPIA compliance (use Complianz generator)
- [ ] 38. **Terms & Conditions** (`/terms`) — from docs/Terms_and_Conditions.md
- [ ] 39. **404 Page** — H1: "This page got automated out of existence." Links to Home + Contact

---

## Phase 7: Conversion Elements

- [ ] 40. **Exit-intent popup** — Themify popup module. Headline: "Your team is losing a full day every week." CTA. Dismiss: "I'll keep doing it manually." Fires once per session on all pages
- [ ] 41. **Mobile sticky CTA bar** — fixed bottom bar, `--action` bg, white text, "Start Free" button. Appears after scrolling past hero

---

## Phase 8: SEO & Performance

- [ ] 42. **Yoast SEO** — set page titles + meta descriptions for all pages:
  - [ ] Home: "Do.Qix | Stop the Busywork. Start What Matters | Workflow Automation South Africa"
  - [ ] Services: "What We Automate | Business Process Automation for SA SMEs | Do.Qix"
  - [ ] Products: "Our Products | SaaS Tools for SA Businesses | Do.Qix"
  - [ ] Contact: "Start Free | Do.Qix South Africa"
- [ ] 43. **Schema markup** — LocalBusiness, Service, FAQ (Yoast or manual JSON-LD)
- [ ] 44. **WP Super Cache** — enable caching, minification, lazy-loading
- [ ] 45. **Compress images** — WebP conversion via ShortPixel/Smush, compress workflow grid heavily
- [ ] 46. **PageSpeed test** — target 90+ mobile, 95+ desktop. Fix any issues

---

## Phase 9: Security & Compliance

- [ ] 47. **AIOS** — limit login attempts, enable 2FA for admin
- [ ] 48. **Complianz** — cookie consent banner configured
- [ ] 49. **Form security** — honeypot + reCAPTCHA v3 on contact form
- [ ] 50. **UpdraftPlus** — configure daily automated backups to off-site storage

---

## Phase 10: Launch

- [ ] 51. **Test everything:**
  - [ ] Mobile responsiveness (iPhone + Android)
  - [ ] All form submissions work
  - [ ] All links work (no dead ends)
  - [ ] Exit-intent popup fires correctly
  - [ ] CTA visible at all times (header + mobile bar)
  - [ ] Page load under 3 seconds
- [ ] 52. **Point domain** + verify SSL active
- [ ] 53. **Google Search Console** — submit sitemap
- [ ] 54. **Google Business Profile** — create/verify

---

## Reference Docs

| Doc | Purpose |
|-----|---------|
| `DoQix_Architecture.md` | Technical stack, design tokens, performance targets |
| `DoQix_Structure.md` | Page sections, content summary, visual elements |
| `DoQix_Wireframe.md` | Layout wireframes for each page |
| `Website_Copy.md` | All copy, word for word |
| `Pricing_Strategy.md` | Pricing tier details |
| `SEO_Strategy.md` | SEO approach |
| `Security_Implementation_Guide.md` | Security details |
| `Terms_and_Conditions.md` | T&C copy |
