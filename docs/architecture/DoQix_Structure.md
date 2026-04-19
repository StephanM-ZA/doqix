# Do.Qix Website Structure

**Version:** 3.0
**Date:** February 11, 2026
**Aligned with:** Website_Copy.md v7.0, Pricing_Strategy.md v2.0
**Purpose:** Define the content organization, section order, and global elements for the Do.Qix website. Every section earns its spot — if it doesn't move someone toward the CTA, it doesn't belong.

---

## Global Elements

### Header (Sticky — all pages)
- **Logo:** "Do.Qix" + "Efficiency, Engineered" (Inter, 24px, --ink)
- **Nav:** Home | Services | Products | Contact (Inter, 16px, --text, hover --accent)
- **CTA Button:** "Start Free" (--action bg, #FFF text, 12px 24px padding, 4px radius)
- **Behaviour:** Fixed on scroll. Mobile: hamburger with same 3 links + CTA.

### Footer (All pages)
- **Brand:** Do.Qix — Efficiency, Engineered
- **Quick Links:** Home | Services | Products | Contact | Privacy Policy | Terms & Conditions
- **Contact:** hello@doqix.co.za | Phone | WhatsApp
- **Social:** LinkedIn | X
- **Legal:** © 2026 Do.Qix. All rights reserved.
- **Styling:** --bg background, 1px --line border-top

### Color Palette
| Token | Value | Use |
|-------|-------|-----|
| --ink | #0D2028 | Headings, logo |
| --accent | #ff8000 | Icons, highlights, hover states |
| --action | #0886B5 | CTA buttons, active links |
| --text | #0D2028 | Body text |
| --bg | #FFFFFF | Page background |
| --muted | #6B7980 | Secondary text, captions |
| --line | rgba(13,32,40,0.12) | Borders, dividers |

### Typography
| Element | Font | Size | Color |
|---------|------|------|-------|
| Body | Inter | 16px, 1.5 line-height | --text |
| H1 | Inter Bold | 32px | --ink |
| H2 | Inter Bold | 24px | --ink |
| H3 | Inter Bold | 18px | --ink |
| Secondary | Inter | 14px | --muted |

### Tone
Friendly SA expert. Warm, direct, no jargon. A little playful. Every section answers "What's in it for me?" Anti-buzzword principle: we lead with understanding, not technology. See Tone Guide in Website_Copy.md v7.0.

### Images
Authentic and relatable. Real people, South African businesses. Video and animated workflow visuals to explain concepts. No generic stock photos. Workflow grid image (20 automation diagrams) as key visual on Services page.

---

## Page Structures

### 1. HOME (`/`)

**Goal:** Aha moment in 5 seconds. Scroll = deeper understanding. Every section moves toward the CTA.

| # | Section | Content Summary | Visual Element |
|---|---------|----------------|----------------|
| 1 | **Hero** | H1: "Stop the Busywork. Start What Matters." Subhead: Automations that handle the work your team shouldn't be doing, no code needed. CTA. Proof line (100+ workflows, 24hr response, priced in rands). | Short intro video or animated workflow (60s max) |
| 2 | **The Problem** | H2: "Your Team Is Losing a Full Day Every Week." 30% stat. 6 relatable pain points (bullet list). Three cost cards: money drain, talent waste, growth killer. "The Productivity Trap." | Infographic showing 30% stat. Icon cards. |
| 3 | **What We Do** | H2: "We Take the Boring Stuff Off Your Plate." Four benefits: mornings back, budgets stretch, data works, people do real work. Job-loss fear addressed directly. | Benefit icons |
| 4 | **How It Works** | H2: "Three Steps. That's It." 1. Tell us. 2. We build. 3. You get time back. CTA. | 3-step flow graphic |
| 5 | **Why Us** | H2: "Why SA Businesses Choose Us." Plain English. Fix first then automate. Rands not dollars. Data in your hands (n8n). Local (load-shedding, POPIA, WhatsApp). Long-term partner. | Trust icons |
| 6 | **Real Results** | H2: "This Is What Automation Actually Looks Like." 4 SA-framed scenarios (property, accounting, e-commerce, consultancy). Stat badges. | Result cards with metrics |
| 7 | **Testimonials** | H2: "Don't Take Our Word For It." 3 SA testimonials (placeholder until real ones). | Quote cards with names/cities |
| 8 | **Bottom CTA** | H2: "Ready to Get Your Time Back?" CTA. 15 min, no commitment, no pitch. | Full-width CTA block |

### 2. SERVICES (`/services`)

**Goal:** Show exactly what we do, how we do it, and what it's worth. Build confidence in the process.

| # | Section | Content Summary | Visual Element |
|---|---------|----------------|----------------|
| 1 | **Hero** | H1: "What We Automate." Subhead: rule-based tasks, zero jargon, zero fluff. | Clean, minimal |
| 2 | **How Automation Works** | H2: "The Simple Logic Behind Every Automation." Trigger → Rule → Condition → Action explained with R5,000 order example. | 4-step flow diagram |
| 3 | **What We Automate** | H2: "The Workflows We Build Every Day." 12 workflow categories with specific app names, flow descriptions, and "What you stop doing" lines. Industry list. 400+ tools. | **20-workflow grid image** (prominent). App icons per category. |
| 4 | **Quick Wins** | H2: "Where Most Businesses Start." 8 department-specific examples with actual app-to-app flows. | Icon list |
| 5 | **Our 5-Step Plan** | H2: "Our 5-Step Plan." Identify → Map → Start Small → Test & Refine → Monitor & Optimise. | Sequential step graphic |
| 6 | **ROI Calculator** | H2: "See What You Could Save." Formula + 3 rand-denominated examples (R11k, R30k, R20k). CTA. | Interactive calculator (future) or static examples |
| 7 | **The Caution** | H2: "One Thing We Tell Every Client First." Industry quote: "Automation applied to an inefficient operation will magnify the inefficiency." Why we streamline first. | Quote block |
| 8 | **Pricing** | H2: "Pricing That Makes Sense." 4 tier cards: Solo (R999/mo, free setup), Team (R2,500/mo, R1,500 setup), Business (R5,500/mo, R2,500 setup, training included), Enterprise (custom quote, training included). Month-to-month. Extra workflows per tier (Solo +R750, Team +R650, Business +R500). Launch offer: first month 50%. Enterprise CTA: "Show Me What's Possible." | 4-column pricing cards, Team highlighted as "Most popular" |
| 9 | **Data & Control** | H2: "Your Data. Your Rules." n8n self-hosted. POPIA. No lock-in. It just works. No dollar subscriptions. | Bullet list with icons |
| 10 | **Bottom CTA** | H2: "Ready to See What's Possible?" 15-min call. CTA. | Full-width CTA block |

### 3. PRODUCTS (`/products`)

**Goal:** Showcase Do.Qix SaaS products. Each product gets a card with clear value prop, features, pricing, and CTA. Page is modular — products are added/removed as the catalogue evolves.

| # | Section | Content Summary | Visual Element |
|---|---------|----------------|----------------|
| 1 | **Hero** | H1: "Tools That Work While You Don't." Subhead: Standalone products built from what we've learned automating SA businesses. No setup calls needed — just pick, subscribe, and go. | Clean, minimal |
| 2 | **Product Grid** | Modular cards — one per product. Each card: Product name, one-line tagline, 3-5 key features (bullet), pricing, CTA button. Cards are added/removed as products launch. Template below. | Product cards with icons |
| 3 | **Why Our Products** | H2: "Built From Real Automation Experience." We don't build theoretical tools — every product comes from patterns we've seen across hundreds of SA workflows. SA-hosted. ZAR pricing. No lock-in. | Trust icons |
| 4 | **Services Cross-Sell** | H2: "Need Something Custom?" Link back to Services page. Not every problem fits a product — our done-for-you automation service handles the rest. | Link to /services |
| 5 | **Bottom CTA** | H2: "Questions About Our Products?" CTA to /contact. | Full-width CTA block |

**Product Card Template (repeat per product):**

| Field | Content |
|-------|---------|
| **Name** | Product name |
| **Tagline** | One sentence — what it does and who it's for |
| **Features** | 3-5 bullet points |
| **Pricing** | Monthly price in ZAR (or "Free" / "From Rx/mo") |
| **CTA** | "Start Free Trial" / "Subscribe" / "Learn More" |
| **Badge** *(optional)* | "New" / "Popular" / "Coming Soon" |

*Products to be added as they launch. Page should display gracefully with 1 product or 10.*

### 4. CONTACT (`/contact`)

**Goal:** Make it dead simple to reach out. Remove every friction point.

| # | Section | Content Summary | Visual Element |
|---|---------|----------------|----------------|
| 1 | **Hero** | H1: "Let's Get Your Time Back." Subhead: Tell us, we'll fix it, no pressure. | Clean, minimal |
| 2 | **Form (2-column)** | Left: Name, Email, Company (optional), Size (dropdown), "Biggest time-waster?" (textarea), "How did you hear?" (optional). Button: "Get My Free Plan." Right: Email, phone, WhatsApp, hours, "We'll tell you straight." | 2-column layout |
| 3 | **What Happens Next** | 5 numbered steps: respond fast, listen, no pitch, clear plan, you decide. | Numbered list |
| 4 | **FAQs** | 7 questions: timelines, tech knowledge, apps, existing systems, data safety, cost, cancellation. | Accordion or list |
| 5 | **Trust Signals** | Near form: 100+ workflows, data in your hands, POPIA, no lock-in, no hidden fees. | Badge row |

### Supporting Pages

**Thank You (`/thank-you`):** Confirmation + next steps + link to content.
**Privacy Policy (`/privacy`):** POPIA compliance.
**Terms & Conditions (`/terms`):** Service agreement covering automation services and SaaS products. SA law. See `docs/Terms_and_Conditions.md`.
**404:** "This page got automated out of existence." Links to Home and Contact.

---

## Conversion Strategy

| Strategy | Implementation |
|----------|---------------|
| **One CTA everywhere** | "Start Free" on every page, in header, and in at least 2 section CTAs per page |
| **Exit-intent popup** | Fires on all pages when mouse moves to close. "Your team is losing a full day every week." CTA. Dismiss: "I'll keep doing it manually." |
| **Social proof near CTAs** | Trust badges (100+ workflows, POPIA, no lock-in) placed near every CTA button |
| **Cross-linking** | Every section links forward. No dead ends. |
| **Low-commitment offer** | "Free Automation Plan" = no cost, no obligation. 15-minute call. |
| **Specificity** | Rand amounts (R11,000, R30,000), named apps (Xero, Shopify, HubSpot), SA cities (Joburg, Cape Town, Durban) |
| **Fear addressed** | "We're not replacing anyone" on Home page. |
| **Mobile CTA bar** | Sticky bottom bar on mobile: "Start Free" button always visible |

---

## Anti-Drop-Off Rules

1. No separate Pricing page — pricing lives on Services
2. No separate About page — "Why Us" lives on Home
3. No sub-menus or dropdowns (Products is a single flat page, not a category tree)
4. CTA visible at all times (header + mobile sticky bar)
5. Maximum scroll depth before a CTA: 2 sections
6. Form is short: 4 required fields, 2 optional
7. No pages with only text — every section has a visual element
8. Page load target: under 3 seconds
