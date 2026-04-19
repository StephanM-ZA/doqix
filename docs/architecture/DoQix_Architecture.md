# Do.Qix Website Architecture

**Version:** 3.0
**Date:** February 11, 2026
**Aligned with:** Website_Copy.md v7.0, DoQix_Structure.md v3.0, DoQix_SiteMap.md v3.0
**Changelog v3.0:** Replaced Astra + Elementor Pro with Themify (theme + builder). Updated pricing display to 4-tier flat retainer model. Aligned all cross-references to current doc versions.
**Purpose:** Technical and functional blueprint for the Do.Qix website. Simple site, built for speed, mobile-first, conversion-focused. Three pages. No bloat.

---

## Design Principles

1. **Simple beats clever.** Three pages, flat nav, one CTA. If a feature doesn't help convert, it doesn't ship.
2. **Fast beats pretty.** Under 3 seconds load time. Every image optimised. No unnecessary scripts.
3. **Mobile-first.** Most visitors will find us on their phone. Design for mobile, enhance for desktop.
4. **SA-first.** Pricing in rands. POPIA compliant. WhatsApp as a contact channel. Host locally where possible.

---

## Technical Stack

### Platform
**WordPress** (self-hosted) — reflects Do.Qix's ethos of data control and self-hosting.

### Theme & Builder
- **Primary:** Themify Ultra + Themify Builder (theme and builder in one package — fewer moving parts, faster)
- **Requirement:** Must support custom CSS variables, responsive design, and modular sections
- **Note:** Themify Builder replaces Elementor Pro — handles page building, popups, and form styling natively

### Plugins (Keep minimal — every plugin is a performance cost)

| Category | Plugin | Purpose |
|----------|--------|---------|
| **Forms** | Quform | Contact form with webhook/email integration (licensed) |
| **SEO** | Yoast SEO | Meta titles, descriptions, schema markup |
| **Performance** | WP Super Cache | Caching, minification, lazy-loading (free) |
| **Images** | ShortPixel or Smush | Image compression, WebP conversion |
| **Analytics** | Google Analytics 4 (via Google Site Kit) | Traffic, conversions, UTM tracking |
| **Security** | All-In-One Security (AIOS) | Firewall, login protection, malware scan (free) |
| **POPIA** | Complianz or CookieYes | Cookie consent banner, privacy policy generator |
| **Backup** | UpdraftPlus | Automated backups |

**Do NOT install:** Social share plugins, slider plugins, heavy animation libraries, comment plugins, or anything not on this list without review.

### Hosting
- **Primary:** Afrihost, Hetzner SA, or SiteGround (SA data centre preferred for POPIA)
- **Requirements:** SSL included, 99.9% uptime, daily backups, staging environment
- **CDN:** Cloudflare free tier (performance + basic DDoS protection)

---

## CSS Design Tokens

```css
:root {
  /* Colors */
  --ink: #0D2028;
  --accent: #ff8000;
  --action: #0886B5;
  --text: #0D2028;
  --bg: #FFFFFF;
  --muted: #6B7980;
  --line: rgba(13, 32, 40, 0.12);

  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Inter', sans-serif;

  /* Spacing */
  --section-padding: 80px 0;
  --section-padding-mobile: 48px 0;
  --container-max: 1200px;

  /* Buttons */
  --btn-radius: 4px;
  --btn-padding: 12px 24px;
}
```

### Typography Scale
| Element | Font | Weight | Size (desktop) | Size (mobile) | Color |
|---------|------|--------|----------------|---------------|-------|
| H1 | Inter | 700 | 40px | 28px | --ink |
| H2 | Inter | 700 | 32px | 24px | --ink |
| H3 | Inter | 600 | 24px | 20px | --ink |
| Body | Inter | 400 | 16px | 16px | --text |
| Secondary | Inter | 400 | 14px | 14px | --muted |
| CTA Button | Inter | 600 | 16px | 16px | #FFFFFF on --action |

---

## Page Architecture

### Page Count: 3 + 3 supporting

| Page | Template | Sections | Notes |
|------|----------|----------|-------|
| **Home** (`/`) | Full-width Themify | 8 sections | Hero, Problem, What We Do, How It Works, Why Us, Results, Testimonials, Bottom CTA |
| **Services** (`/services`) | Full-width Themify | 10 sections | Hero, How Automation Works, What We Automate (+ workflow grid image), Quick Wins, 5-Step Plan, ROI, Caution, Pricing, Data & Control, Bottom CTA |
| **Contact** (`/contact`) | Full-width Themify | 5 sections | Hero, Form (2-col), What Happens Next, FAQs, Trust Signals |
| **Thank You** (`/thank-you`) | Simple | 1 section | Confirmation + next steps |
| **Privacy** (`/privacy`) | Simple | 1 section | POPIA policy text |
| **404** | Custom | 1 section | Fun message + links |

### Navigation
- **Desktop:** Sticky header. Logo left, 3 nav links center/right, CTA button right.
- **Mobile:** Sticky header. Logo left, hamburger right. Expand: 3 links + CTA button.
- **No sub-menus, no dropdowns, no mega-menus.**

---

## Pricing Display

Based on Do.Qix Plans (February 2026):

### Pricing Tier Structure

| | **Solo** | **Team** *(Most popular)* | **Business** | **Enterprise** |
|---|---|---|---|---|
| **Best for** | Solopreneurs & freelancers | Small teams (2-15 people) | Growing SMEs (15-50 people) | Larger operations (50+) |
| **Setup** | Free | R1,500 | R2,500 | Let's talk |
| **Monthly** | R999/mo | R2,500/mo | R5,500/mo | Custom quote |
| **Workflows** | 1 | Up to 3 | Up to 6 | Unlimited (scoped) |
| **Support** | Email (48hr) | Priority + WhatsApp (24hr) | Dedicated + monthly strategy call | Dedicated account manager |
| **Training** | R1,500/session | R1,500/session | Included | Included |
| **You'll save** | ~R3,000-R8,000/mo | ~R8,000-R20,000/mo | ~R20,000-R50,000/mo | R50,000+/mo |
| **CTA** | Start Free | Start Free | Start Free | Show Me What's Possible |

### Display approach
- Show as 4-column pricing cards on Services page (stack 2x2 on mobile)
- Highlight "Team" as recommended/popular
- Each card shows: plan name, "best for" line, setup fee, monthly rate, workflows included, support level, training, savings anchor, CTA
- Below cards: "Every plan includes hosting, monitoring, maintenance, POPIA compliance, and no lock-in."
- Extra workflows row: Solo +R750/mo, Team +R650/mo, Business +R500/mo
- Launch offer line: "First month at 50% on any plan"
- Add-ons shown as a simple row below the cards

---

## Form & Lead Capture

### Contact Form
- **Fields:** Name*, Email*, Company (optional), Company Size* (dropdown), Biggest time-waster* (textarea), How did you hear? (optional dropdown)
- **Submit:** "Get My Free Plan"
- **Micro-copy:** "We'll be in touch within 24 hours. Usually sooner."
- **Action on submit:** Redirect to `/thank-you`, send notification email, optionally webhook to CRM/n8n

### Exit-Intent Popup
- **Trigger:** Mouse moves toward browser close (desktop), back button (mobile)
- **Content:** "Your team is losing a full day every week." + CTA
- **Frequency:** Once per session
- **Implementation:** Themify Builder popup module or OptinMonster

### Mobile Sticky CTA Bar
- Fixed bottom bar on mobile viewports
- "Start Free" button
- Background: --action, text: white
- Appears after scrolling past hero

---

## Integrations

| Integration | Purpose | Implementation |
|-------------|---------|----------------|
| **Google Analytics 4** | Traffic, conversion tracking | GA4 via Google Site Kit plugin |
| **UTM Parameters** | Campaign tracking to Contact form | Capture UTM params in hidden form fields |
| **Email notifications** | Form submission alerts | Form plugin notification emails |
| **CRM webhook** | Send leads to CRM/pipeline | Form plugin webhook action or n8n webhook trigger |
| **WhatsApp** | Contact channel | wa.me link in contact details |
| **Schema markup** | SEO: LocalBusiness, Service, FAQ | Yoast SEO or manual JSON-LD in header |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page load (mobile, 3G) | < 3 seconds |
| Largest Contentful Paint | < 2.5 seconds |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| Google PageSpeed (mobile) | 90+ |
| Google PageSpeed (desktop) | 95+ |

### How to hit targets
- WP Super Cache caching + minification
- Images: WebP format, lazy-loaded, compressed
- Fonts: Inter via Google Fonts CDN
- Workflow grid image: Compress heavily, consider progressive JPEG
- Video: Lazy-load embed, don't autoplay on mobile
- No render-blocking JS above the fold
- Minimal plugins (see list above — no exceptions)

---

## Security & Compliance

| Requirement | Implementation |
|-------------|----------------|
| **SSL** | Free via hosting (Let's Encrypt) or Cloudflare |
| **POPIA** | Cookie consent banner (Complianz), Privacy Policy page, minimal data collection, SA-hosted data |
| **Form security** | Honeypot + reCAPTCHA v3 on contact form |
| **Login security** | AIOS: limit login attempts, 2FA for admin |
| **Updates** | WordPress core, theme, plugins: auto-update minor, manual major |
| **Backups** | Daily automated (UpdraftPlus) to off-site storage |

---

## Build Process

1. **Setup:** Install WordPress on hosting. Install Themify Ultra theme (includes Themify Builder).
2. **Design tokens:** Apply CSS variables (colors, fonts, spacing) via Themify Customizer + custom CSS.
3. **Pages:** Build Home, Services, Contact as full-width Themify Builder layouts. Match wireframe section-by-section.
4. **Content:** Drop in copy from Website_Copy.md v7.0. Add images, video, workflow grid.
5. **Pricing:** Build 4-column pricing cards on Services page (Solo/Team/Business/Enterprise). Team highlighted as "Most popular."
6. **Forms:** Configure contact form with webhook/email actions. Build exit-intent popup. Add mobile sticky CTA.
7. **SEO:** Configure Yoast: titles, descriptions, schema markup for each page.
8. **Performance:** Install WP Super Cache, compress images, self-host fonts, test PageSpeed.
9. **Compliance:** Install Complianz, create Privacy Policy, add cookie banner.
10. **Test:** Mobile responsiveness (iPhone, Android), form submissions, load times, all links, exit-intent, CTA visibility.
11. **Launch:** Point domain, verify SSL, submit to Google Search Console, create Google Business Profile.

---

## Post-Launch

- **Analytics review:** Weekly for first month, then monthly
- **A/B testing:** Hero headline, CTA text, pricing card order (future)
- **Content:** Blog posts when ready (not in main nav — footer link only)
- **Case studies:** Add named SA clients as they come in → replace placeholder scenarios
- **Testimonials:** Replace placeholders with real quotes as collected
