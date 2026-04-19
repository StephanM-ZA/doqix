# Do.Qix Website: Stitch Prompt (Copy-Accurate)

**IMPORTANT: Use the EXACT text provided below for all headings, subheadings, body copy, buttons, and labels. Do NOT invent, rephrase, or add any content. If text is not specified, leave it out.**

---

## GLOBAL DESIGN SYSTEM (applies to ALL pages)

**Platform:** Web, Desktop-first, fully responsive
**Theme:** Dark with electric accents, premium but not cold. Think Vercel meets Stripe, but warmer and more human.

**Colors:**
- Background: #0C1830 (royal navy)
- Surface: #14203C (cards, panels, sections)
- Surface Hover: #1A2A48
- Primary Accent: #00e5a0 (electric teal: CTAs, active states, focus rings)
- Secondary Accent: #ff8000 (warm amber: badges, highlights, proof points)
- Tertiary Accent: #e09c58 (soft gold: secondary highlights, accents)
- Text Primary: #f0f0f5 (off-white)
- Text Secondary: #c0c0d0 (cool gray: captions, muted info)
- Text On Accent: #0C1830 (text on teal buttons)
- Border: #1e1e2a (card edges, dividers)
- Danger: #ff6b6b (errors only)

**Typography: Inter ONLY (NON-NEGOTIABLE):**
Inter is the ONLY font for this entire website. No Space Grotesk, no DM Sans, no Manrope, no other fonts. Load Inter from Google Fonts with weights 400, 500, 600, 700, 900. Apply `font-family: 'Inter', sans-serif` to ALL elements. Use weight variation for hierarchy:
- 900 black: H1 hero headlines (64px mobile, 96px desktop). No italics. Tight tracking (-0.04em). Key phrase in primary teal color. Large, punchy, ultra-bold with white text and teal accent on the action phrase.
- 900 black: H2 section headings (40px mobile, 60px desktop). Tracking -0.02em. Same weight as H1 but noticeably smaller to maintain hierarchy.
- 700 bold: H3 subheadings (24px mobile, 32px desktop)
- 600 semibold: subheadings, CTAs, card titles
- 500 medium: nav links, labels, badges
- 400 regular: body text (16-20px)

**Layout:**
- 8px base grid
- Section padding: 80-120px vertical
- Max width: 1200px centered
- Border radius: 12px cards, 8px buttons, 24px pills/badges

**Banner Style (for promotional banners, launch offers, announcements):**
- Full-width rounded pill shape (large border-radius, ~999px)
- Dark teal-tinted background (semi-transparent primary at ~10-15% opacity)
- Subtle teal border (primary color at ~20% opacity)
- Teal text, centered, with a sparkle/auto_awesome icon before the text
- Example: the "Launch Special: First month 50% off on all plans." banner
- Use this style wherever a banner or announcement strip is needed

**Stat Card Style (for benefit/impact sections):**
- Dark surface background (#14203C) with subtle border, generous rounded corners (16-24px)
- Bold title in white (600 weight, ~20px)
- Large hero stat number below title in accent color (teal for time stats, amber/secondary for money stats). Big, punchy, 40-48px, 700-900 weight
- Supporting description in muted text below the stat
- Large subtle icon in top-right corner (low opacity ~20%, outlined style), e.g., clock for time, piggy bank for money
- Cards hover-lift on interaction
- Use this pattern for benefit cards, ROI examples, and impact stats throughout the site

**Vertical Step/Timeline Style (for process sections like "How It Works", "Our 5-Step Plan", "What Happens Next"):**
- Numbered circles on the left: solid teal fill (#00e5a0) with dark text for active/first step, dark fill with teal border for subsequent steps
- Vertical connecting line between circles: thin gradient line (teal fading to transparent), drawn downward as user scrolls
- Step title: bold white text (700 weight), right of the circle
- Step description: muted text below the title
- Generous vertical spacing between steps (64-80px)
- Steps stagger-reveal on scroll (each step fades up 80ms after the previous)
- Use this pattern for ALL numbered process/timeline sections

**Pricing Card Style:**
- 4 cards side by side, equal height, dark surface background
- Standard cards: subtle border (#1e1e2a), ghost-style CTA button (outlined, not filled)
- Featured/popular card: elevated with teal border (2px solid #00e5a0), teal filled CTA button, amber "MOST POPULAR" badge floating above the card (pill shape, uppercase, small text)
- Plan name: bold white, top of card
- Price: large bold display (32-40px), white, with "/mo" in smaller muted text
- Feature list: teal checkmark icons, concise bullet points
- CTA buttons at bottom, aligned across all cards
- Cards hover-lift on interaction
- Use this layout for pricing on all pages where pricing appears

**Ambient Glow Effect (for visual depth and section breaks):**
- Use large radial gradient circles (400-800px diameter) with primary teal at very low opacity (~5-15%)
- Position off-center or at section edges: top-right, bottom-left, behind hero content
- Apply heavy blur (100-150px) so the glow feels atmospheric, not like a shape
- Creates a subtle "breathing" depth that breaks up the flat dark background
- Use sparingly, 1-2 per major section maximum. Hero sections and CTA sections benefit most.
- Never use a hard-edged shape. The glow should melt into the background seamlessly.

**Global Nav (all pages):**
- Left: "Do.Qix" logo wordmark + "Efficiency, Engineered" tagline
- Center/Right links: Home | Services | Products | Contact
- Far right: "Start Free" teal pill button
- Sticky, transparent on hero, frosted-glass (#14203C + backdrop-blur) on scroll

**Global Footer (all pages):**
- "Do.Qix. Efficiency, Engineered"
- Links: Home | Services | Products | Contact | Privacy Policy | Terms & Conditions
- Email: hello@doqix.co.za | Phone: [number] | WhatsApp: [number]
- Social: LinkedIn | X
- "© 2026 Do.Qix. All rights reserved."

---

## ANIMATION (CRITICAL, NON-NEGOTIABLE)

**This site MUST feel alive. Every section MUST animate. A static page is a failed page.**

Motion is the brand. Do.Qix automates things, so the site itself should feel automated, alive, and in motion.

**Required animations per section:**
- Hero headline: Staggered word-by-word fade-up on load (spring physics, 60ms stagger)
- All sections: Fade-up + slight scale (0.97 to 1.0) on scroll into view
- CTA buttons: Teal glow pulse on hover (box-shadow bloom), micro-scale on press
- Numbers/stats: Count-up animation from 0 when scrolled into view
- Cards: Hover lift with shadow depth increase
- Pain points/list items: Sequential slide-in with staggered delay
- Nav: Transparent to frosted-glass on scroll
- Testimonial carousel: Smooth horizontal slide with momentum/snap

**Timing:**
- Micro-interactions: 150ms
- Component transitions: 300ms
- Section reveals: 500ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for enters, `ease-in` for exits
- Stagger: 60-80ms between siblings
- Scroll trigger: Intersection Observer, 0.1 threshold, fire once only

**Implementation:** CSS @keyframes + transitions + Intersection Observer in inline `<script>` tags. Respect `prefers-reduced-motion`.

---

## Page 1: HOME

### Section 1: Hero
- **H1:** "Your workflows, on autopilot."
- **Subhead:** "Do.Qix connects the tools you use daily, eliminates repetitive busywork, and runs your business processes automatically so you can focus on what matters."
- **CTA button:** "Start Free"
- **Proof line (below CTA, small text, amber accents on numbers):** "100+ workflows running for SA businesses | Response within 24 hours | Priced in rands"
- **Visual:** Animated node diagram showing app icons (Xero, Google Sheets, WhatsApp, Gmail) connected by flowing lines with data particles. Gentle floating/orbiting animation.
- Full viewport height.

### Section 2: The Problem
- **H2:** "Your Team Is Losing a Full Day Every Week"
- **Intro text:** "Research shows professionals spend nearly 30% of their work week on manual, low-value tasks. That's more than a full day, every single week, lost to work a machine should be doing."
- **Large stat:** "30%" in teal accent, large display size with count-up animation
- **Six pain points as icon list:**
  1. "Copying the same data between apps, again"
  2. "Manually sending invoices and chasing payments"
  3. "Updating three systems every time a new customer signs up"
  4. "Spending Friday afternoon pulling together the same report"
  5. "Forwarding emails because there's no system to route them"
  6. "Fixing mistakes caused by tired eyes and too many spreadsheets"
- **Three cost cards (dark surface, hover lift):**
  - Card 1: Title: "It drains your money." Body: "One wrong number cascades into wrong invoices, wrong deliveries, and hours of corrections. Reducing errors by just 10-20% can cut processing costs by 20-30%."
  - Card 2: Title: "It wastes your best people." Body: "You hired smart, creative problem-solvers. They're spending half their day copying and pasting. That's not just inefficient, it's demoralising."
  - Card 3: Title: "It kills your growth." Body: "When everyone's buried in admin, innovation stalls. Customer response times slow down. Your competitors who have automated are already moving faster."
- **Closing line (italic, muted):** "We call it the Productivity Trap. You're busy all day, but never getting ahead."

### Section 3: Solution
- **H2:** "We Take the Boring Stuff Off Your Plate"
- **Intro:** "We design and build automations that handle the tasks eating your team's day. The spreadsheet shuffle, the inbox routing, the same 47 steps every Monday morning. All of it runs in the background, 24/7. Think of us as your automation department, without the overhead of hiring one."
- **Four benefit blocks (2x2 grid, each with icon, bold title, description):**
  - "Your mornings come back." "The admin that ate the first two hours of every day? It runs itself now. Most clients reclaim 8-15 hours a week within the first month."
  - "Your budgets stretch further." "Fewer manual steps means fewer mistakes, less rework, and lower running costs. One client cut R20,000/month in preventable data errors alone."
  - "Your data actually works for you." "Information flows where it needs to go, accurately, every time, at any volume. No more 'which version is the latest?' moments."
  - "Your people do the work you hired them for." "When the busywork disappears, your team can finally focus on strategy, clients, and the ideas that actually grow the business."
- **Callout card (bordered, distinct):** "And here's the thing: we're not replacing anyone. Automation takes over the robotic tasks (the admin grind, the data shuffling, the stuff nobody signed up to do forever). Your team keeps their jobs and gets to do more meaningful work. That's the whole point."

### Section 4: How It Works
- **H2:** "Three Steps. That's It."
- **Three vertical steps connected by animated progress line:**
  - Step 1: "Tell us what's wasting your time." "A quick call, 15 minutes. We ask things like: What do you do every day that feels like groundhog day? Where do things fall through the cracks? No tech speak. Just a conversation."
  - Step 2: "We build your automations." "We map your process, find the bottlenecks, and build workflows that connect your apps and handle the busywork. You don't touch a line of code. You don't learn new software. We do all of it."
  - Step 3: "You get your time back." "Your automations go live. Data flows where it needs to go. Emails send themselves. Reports update on their own. We monitor everything and keep it running. You focus on what matters."
- **CTA:** "Start Free"

### Section 5: ROI
- **H2:** "See What You Could Save"
- **Formula (prominent display):** "(Hours Saved x Hourly Rate x Frequency) + Errors Prevented = Monthly Benefit"
- **Three example cards (count-up animation on numbers):**
  - "Your admin spends 2 hours/day on data entry at R250/hr. That's R11,000/month on one task. Automate it, and that money goes back into the business."
  - "Sales team loses 30 min per lead on manual CRM entry. 200 leads/month. That's R30,000/month in selling time recovered."
  - "Data errors cost R500 each to fix. Happens 40 times/month. That's R20,000/month in preventable rework."
- **Closing:** "Now add those up. Across every repetitive task in your company. The ROI is real, it's fast, and it compounds."
- **CTA:** "Want us to calculate yours? Start Free."

### Section 6: Pricing
- **H2:** "Pricing That Makes Sense"
- **Intro:** "No hidden fees. No confusing credit systems. No per-task charges that punish you for growing. Everything in South African rands. Month-to-month. We keep clients because we deliver, not because of contracts."
- **Launch offer banner (teal gradient strip above cards):** "Launch offer: First month at 50% on any plan."
- **Four pricing cards side by side (Team card elevated with amber "Most Popular" badge):**

  **Solo:**
  - Best for: Solopreneurs & freelancers
  - Setup: Free
  - Price: R999/mo
  - Workflows: 1
  - Support: Email (48hr)
  - CTA: "Start Free"

  **Team (Most Popular):**
  - Best for: Small teams (2-15 people)
  - Setup: R1,500
  - Price: R2,500/mo
  - Workflows: Up to 3
  - Support: Priority + WhatsApp (24hr)
  - CTA: "Start Free"

  **Business:**
  - Best for: Growing SMEs (15-50 people)
  - Setup: R2,500
  - Price: R5,500/mo
  - Workflows: Up to 6
  - Support: Dedicated + monthly strategy call
  - CTA: "Start Free"

  **Enterprise:**
  - Best for: Larger operations (50+)
  - Setup: Let's talk
  - Price: Custom quote
  - Workflows: Unlimited (scoped)
  - Support: Dedicated account manager
  - CTA: "Show Me What's Possible"

- **Below cards:** "Every plan includes: Hosting, monitoring, maintenance, POPIA compliance, and no lock-in. You own what we build."
- **CTA:** "Start Free"

### Section 7: Testimonials
- **H2:** "Don't Take Our Word For It"
- **Horizontal scrolling carousel of 7 testimonial cards. Each card: quote, name, role, city, plan badge. Dark surface with left teal accent border.**
  1. "I used to do my invoicing on Sunday nights. Do.Qix built me one workflow and I haven't sent an invoice manually since. It paid for itself in the first month." – Lerato M., Bookkeeping Consultant, Pretoria (Solo plan)
  2. "We're a team of six and the admin was quietly eating a full day every week. Three Do.Qix workflows later (lead capture, quote-to-invoice, weekly reporting) and Fridays are for actual work again." – Reuben P., Managing Director, Cape Town (Team plan)
  3. "I liked that they didn't try to sell me anything I didn't need. They mapped our processes, showed me where the time was going, and built exactly what we agreed. Refreshingly boring." – Thandi N., Founder, Durban (Team plan)
  4. "We were drowning in WhatsApp orders. Do.Qix built a flow that captures every message, pushes it into our system, and fires off the confirmation automatically. We've handled 30% more volume without hiring." – Imraan S., Director, Johannesburg (Business plan)
  5. "The monthly strategy call is the part nobody advertises but everybody should. We come in with one problem, leave with three automations on the roadmap. Feels like having an ops team we didn't have to hire." – Nadia V., COO, Cape Town (Business plan)
  6. "What sold me was the rand pricing and month-to-month. No dollar exposure, no lock-in, no 'enterprise' sales theatre. They build, they bill, they keep things running." – Johan B., Founder, Stellenbosch (Team plan)
  7. "Our finance team got their month-ends back. What used to be a three-day reporting scramble now runs on its own by Tuesday lunchtime. I don't think they'd let us cancel if we tried." – Sipho D., Finance Manager, Sandton (Business plan)

### Section 8: Bottom CTA
- **H2:** "Ready to Get Your Time Back?"
- **Body:** "Every day your team spends on repetitive tasks is a day they're not spending on work that grows the business."
- **CTA:** "Start Free"
- **Reassurance (small text below):** "15 minutes. No commitment. No sales pitch. Just a clear picture of where you're losing time, and how to get it back."

---

## Page 2: SERVICES

### Section 1: Hero
- **H1:** "What We Automate"
- **Subhead:** "If it's rule-based and eating your team's day, we can automate it. Zero jargon. Zero fluff. Here's how we turn 'busy' into 'effective.'"

### Section 2: How Automation Works
- **H2:** "The Simple Logic Behind Every Automation"
- **Intro:** "Every automation, from the simplest reminder to the most complex multi-system workflow, follows four steps:"
- **Four-step horizontal flow connected by animated arrows:**
  - **Trigger:** "Something happens." Example: "A new order lands. A form gets submitted. An invoice becomes overdue."
  - **Rule:** "A decision is made." Example: "IF the order is over R5,000, THEN flag as high-priority."
  - **Condition:** "A check runs." Example: "Is this a returning customer? Has this been paid already?"
  - **Action:** "The task gets done." Example: "Tag them in the CRM. Send the email. Alert the manager. Generate the PDF."
- **Closing:** "That's it. Once it's set up, it runs every time. Perfectly, 24/7, without coffee breaks."

### Section 3: What We Automate
- **H2:** "The Workflows We Build Every Day"
- **Intro:** "We connect the apps you already use and make them talk to each other. Here's a taste of what that looks like:"
- **12 workflow category cards in a grid. Each card has: category title, description, "Apps we connect:" line, "What you stop doing:" line in muted text.**

  1. **Finance & Billing:** "Invoices submitted via Typeform get filed in Google Drive, routed for manager approval, and pushed straight into QuickBooks, with payment confirmations sent automatically. Contract renewals trigger reminders 30 days out, update Salesforce, and alert your team on Slack. Stripe payments flow into Airtable, generate QuickBooks invoices, and notify finance. No human in the loop." Apps: Xero, QuickBooks, Stripe, Google Drive, Typeform, Airtable. Stop doing: Manual invoicing, chasing approvals, reconciling spreadsheets.

  2. **Sales & Lead Management:** "Leads from HubSpot get qualified by filters, added to Mailchimp sequences, and (when they open key emails) pushed into Salesforce with a follow-up task assigned. Your sales pipeline in Pipedrive triggers contract generation in Google Docs, sends it for e-signature via DocuSign, and notifies the team on Slack when it's signed." Apps: HubSpot, Pipedrive, Salesforce, Mailchimp, DocuSign, Google Docs. Stop doing: Manually qualifying leads, forgetting follow-ups, chasing signatures.

  3. **E-commerce & Orders:** "Order placed? Airtable updates, shipping label generates via API, stock check runs in real time, and the customer gets a confirmation email, all before you've finished your coffee. Low stock triggers a purchase order in Xero and alerts your ops team on Slack." Apps: Shopify, WooCommerce, Airtable, Xero, Slack. Stop doing: Manually updating stock, emailing tracking numbers, reacting to stockouts.

  4. **HR & Employee Onboarding:** "New hire added in BambooHR? Their Google Workspace account spins up, an onboarding doc generates in Notion, they get a Slack channel invite, and a welcome email lands in their inbox, all within minutes." Apps: BambooHR, Google Workspace, Notion, Slack. Stop doing: 2-day onboarding admin compressed into minutes.

  5. **Customer Support:** "Support ticket hits Zendesk? It gets categorised by urgency, logged in Airtable, and routed to the right agent in Intercom, with an auto-reply already sent to the customer. No more ticket ping-pong." Apps: Zendesk, Intercom, Airtable. Stop doing: Manually sorting tickets, slow first-response times.

  6. **Marketing & Content:** "Blog post drafted in Google Sheets? It flows to Trello for review, assets download from Google Drive, and when approved it publishes to WordPress, schedules social via Buffer, and notifies the content team on Slack." Apps: Google Sheets, Trello, WordPress, Buffer, Slack, Google Drive. Stop doing: Manual publishing, forgetting social posts, chasing approvals.

  7. **Data Sync & Reporting:** "Databases out of sync? We schedule nightly syncs between PostgreSQL, MySQL, and Elasticsearch, with a Slack alert when it's done. Reports pull themselves together and land in inboxes on schedule." Apps: PostgreSQL, MySQL, Elasticsearch, Google Sheets. Stop doing: Friday afternoon data marathons, "which version is latest?" conversations.

  8. **Event Management:** "Eventbrite registration triggers a Google Contact entry, adds them to the right Mailchimp list, sends an SMS reminder before the event, and fires a Typeform feedback survey after." Apps: Eventbrite, Google Contacts, Mailchimp, SMS, Typeform. Stop doing: Manual attendee management, forgetting post-event follow-up.

  9. **Compliance & Audits:** "Scheduled checks pull files from Box, filter by policy criteria, log results in Google Sheets, and flag non-compliance directly into Jira with an email to the responsible party." Apps: Box, Google Sheets, Jira. Stop doing: Manual compliance checks, hoping nothing slips through.

  10. **Social Media & Feedback:** "Social mentions tracked via Twitter get analysed for sentiment. Positive mentions get logged, negative ones trigger alerts. Customer feedback from Typeform gets categorised in Airtable and turns into Trello feature requests automatically." Apps: Twitter/X, Typeform, Airtable, Trello, Buffer. Stop doing: Manual sentiment tracking, feedback sitting unread in a spreadsheet.

  11. **Creative Approvals:** "Design file lands in Google Drive? Slack notification goes to the reviewer, approval flow kicks in, and once approved it moves to 'Done' in Asana with the creator notified. Rejected? Feedback loops back with notes." Apps: Google Drive, Slack, Asana. Stop doing: "Did you see my email about the design?" conversations.

  12. **Facility & IoT:** "Sensor alert from your building? IFTTT creates an Asana maintenance task, Twilio sends an SMS to the facilities manager, and everything gets logged in Google Sheets for reporting." Apps: IoT sensors, IFTTT, Asana, Twilio, Google Sheets. Stop doing: Reacting to building issues instead of preventing them.

- **Below grid:** "Not sure if your task qualifies? That's what the free plan call is for. We'll tell you straight, even if the answer is 'don't automate this yet.'"
- **Extra line:** "The apps shown above are just the start. We connect 400+ tools. If it has an API, we can plug it in."

### Section 4: Quick Wins
- **H2:** "Where Most Businesses Start"
- **Intro:** "Not sure where to begin? These deliver the fastest results:"
- **Eight items in a grid (icon + bold label + one-line description):**
  1. **Sales:** "Leads auto-qualify from HubSpot into Salesforce. Contracts generate and send for DocuSign signature. No more lost leads or unsigned deals."
  2. **Support:** "Zendesk tickets get categorised, routed to the right agent, and auto-replied to, in seconds."
  3. **Finance:** "Typeform submissions trigger invoice creation in QuickBooks, with approval flows and payment confirmations built in."
  4. **E-commerce:** "Shopify orders update Airtable inventory, generate shipping labels, and alert your team when stock runs low, before your customers notice."
  5. **HR:** "BambooHR new hire triggers Google Workspace setup, Notion onboarding docs, and a Slack welcome, all in minutes."
  6. **Marketing:** "Blog posts flow from Google Sheets through Trello approval to WordPress publishing and Buffer social scheduling, hands-free."
  7. **Events:** "Eventbrite registrations sync to contacts, trigger email sequences, send SMS reminders, and fire post-event surveys automatically."
  8. **Compliance:** "Scheduled audits pull files, check against policy, log results, and flag issues in Jira. No manual checks."

### Section 5: Our Process
- **H2:** "Our 5-Step Plan"
- **Intro:** "We don't just throw tech at your problems. We follow a structured approach, because the biggest reason automation fails isn't the technology. It's skipping the prep."
- **Five vertical timeline steps with animated connecting line:**
  1. **Identify:** "We find the repetitive, rule-based, high-volume tasks. We talk to the people who actually do the work. They always know where the pain is."
  2. **Map:** "We chart your current process: every step, every handoff, every bottleneck. You can't automate what you can't see. And you shouldn't automate a broken process."
  3. **Start Small:** "We pick one process for a quick win. You see results fast, your team builds confidence, and we build from there."
  4. **Test & Refine:** "We stress-test everything. We deliberately try to break it. We check edge cases and make sure it's rock solid before it goes live."
  5. **Monitor & Optimise:** "Your automations go live but we don't walk away. We track performance, flag issues, and fine-tune as your business evolves."

### Section 6: The Caution
- **H2:** "One Thing We Tell Every Client First"
- **Blockquote card (prominent, bordered):** "Automation applied to an inefficient operation will magnify the inefficiency."
- **Body:** "This is why we don't skip steps. We streamline your process first: eliminate the waste, simplify the steps, standardise the workflow. Then we automate. It takes a little longer upfront but it means what we build actually works."

### Section 7: Why Do.Qix
- **H2:** "Why SA Businesses Choose Us"
- **Six value cards in a 2x3 or 3x2 grid:**
  1. **"We speak plain English."** "No jargon, no 47-page proposals. If your gran wouldn't understand it, we haven't explained it well enough."
  2. **"We fix the process first, then automate it."** "Most companies skip straight to building. We don't. Automating a mess just gives you a faster mess. We streamline first, then build, so it actually works."
  3. **"We price in rands, not dollars."** "Flat monthly rate. No confusing credit systems. No per-task fees that balloon when you grow. No nasty surprises. You know your number before we start."
  4. **"Your data stays in your hands."** "We build on n8n, a powerful open-source platform we self-host for you. Your data lives where you decide. Not on someone else's cloud. Not behind someone else's paywall. No lock-in, ever."
  5. **"We're here. We get it."** "Load-shedding contingencies, POPIA compliance, the reality of ZAR budgets and dollar-priced tools. We understand because we're building businesses here too. When you need help, you talk to a real person who knows your world."
  6. **"We don't disappear after launch."** "We monitor your automations, keep them running, and evolve them as your business grows. Long-term partner, not hit-and-run."

### Section 8: Real Results
- **H2:** "This Is What Automation Actually Looks Like"
- **Intro:** "These are the kinds of results we build for, the same patterns we implement for SA businesses every day."
- **Four case study cards (bold title, story paragraph, key stat highlighted):**
  1. **"The property agency that stopped losing leads."** "A Joburg-based property group was capturing leads from five different portals, manually. Agents were spending the first hour of every day copying contact details into their CRM. We automated the entire flow: leads from all portals now land in the right agent's pipeline instantly, with a welcome WhatsApp sent within seconds. Lead response time went from hours to under a minute. They haven't lost a lead to a slow reply since."
  2. **"The accounting firm that got Fridays back."** "A mid-size firm in Cape Town was spending 6+ hours every Friday pulling data from Xero, formatting reports, and emailing them to clients. We built an automation that pulls the numbers, populates the report template, and delivers it, every Friday at 7am, without anyone lifting a finger. That's 300+ hours a year, back to billable work."
  3. **"The e-commerce brand that stopped hiring for admin."** "An online retailer was about to hire a third admin assistant just to keep up with order processing, stock updates, and shipping notifications. We automated the lot, from order confirmation to tracking updates to restock alerts. They didn't need the hire. They redeployed the budget into marketing and grew 40% that quarter."
  4. **"The professional services firm that killed the copy-paste."** "A Durban consultancy had staff entering the same client data into four different systems for every new engagement. Contracts, onboarding emails, project setup, billing, all manual. We connected the systems. Now they enter client details once, and everything cascades. Errors dropped to near zero. Onboarding time went from 2 days to 20 minutes."
- **Stat badges:** "8-15 hours/week reclaimed" | "95%+ reduction in data entry errors" | "R11,000-R30,000/month in recovered time" | "Days-to-minutes onboarding improvements"

### Section 9: Data & Control
- **H2:** "Your Data. Your Rules."
- **Intro:** "We build on n8n, a powerful open-source automation platform we manage and self-host for you. You get the power of a custom-built system without ever touching a server."
- **Six points (icon grid):**
  1. "Your data stays here. On infrastructure you control, not scattered across someone else's cloud in another country"
  2. "POPIA compliant from day one. Not bolted on as an afterthought"
  3. "No vendor lock-in. If we part ways, your automations still work. You own what we build"
  4. "It just works. Document reading, smart routing, auto-classification, built into your workflows where it genuinely saves time"
  5. "Powerful technology, SME-friendly pricing. The same platform that runs workflows for global companies, managed for you at a fraction of the cost"
  6. "No dollar-denominated subscription creeping up every year while the rand moves the wrong way"

### Section 10: Bottom CTA
- **H2:** "Ready to See What's Possible?"
- **Body:** "15-minute call. We'll show you where your time is going and how to get it back."
- **CTA:** "Start Free"

---

## Page 3: PRODUCTS

### Section 1: Hero
- **H1:** "Tools That Work While You Don't"
- **Subhead:** "We've spent years automating SA businesses. These are the tools we've built from what we've learned. Standalone products you can start using today. No setup calls. No custom quotes. Just pick, subscribe, and go."

### Section 2: Product Grid
- **IMPORTANT: This is a PLACEHOLDER page. Do NOT invent product names, pricing, or features.**
- Show an empty-state or "coming soon" grid with 3-4 placeholder cards
- Each placeholder card shows: subtle dashed border, "Coming Soon" badge, muted text "New products launching soon"
- The grid should feel designed and intentional, not broken. Show the template structure without fake content

### Section 3: Why Our Products
- **H2:** "Built From Real Automation Experience"
- **Intro:** "We don't build tools in a vacuum. Every product comes from patterns we've seen across hundreds of workflows for South African businesses."
- **Four points:**
  1. "SA-hosted. Your data stays local."
  2. "Priced in rands. No dollar surprises."
  3. "No lock-in. Cancel anytime, export your data."
  4. "Built by the people who automate for a living. We know what works because we build it every day."

### Section 4: Services Cross-Sell
- **H2:** "Need Something Custom?"
- **Body:** "Our products handle common patterns. But every business is different. If you need workflows built specifically for your processes, our done-for-you automation service handles the rest, from mapping to building to monitoring."
- **CTA:** "See Our Services" (links to /services)

### Section 5: Bottom CTA
- **H2:** "Questions About Our Products?"
- **Body:** "Not sure which product fits? Want to know if it works with your setup? Just ask. We'll tell you straight."
- **CTA:** "Get In Touch" (links to /contact)

---

## Page 4: CONTACT

### Section 1: Hero
- **H1:** "Let's Get Your Time Back"
- **Subhead:** "Tell us what's wasting your time. We'll show you how to fix it. No pressure, no pitch. Just a straight conversation."

### Section 2: Contact Form (2-column layout)

**Left column, form fields:**
- Your Name (text input)
- Email Address (email input)
- Company Name (text input, marked optional)
- Company Size (dropdown): Just me / 2-15 / 16-50 / 51+
- "What's your biggest time-waster?" (textarea, placeholder: "The task that drives you crazy. The one you wish would just... do itself.")
- "How did you hear about us?" (dropdown, optional): Google / LinkedIn / Referral / Social Media / Other
- **Submit button:** "Get My Free Plan" (teal)
- **Micro-copy below button:** "We'll be in touch within 24 hours. Usually sooner."

**Right column, contact info card (elevated surface):**
- **"Prefer a chat?"**
- "We're real people. We'd love to hear from you."
- Email: hello@doqix.co.za
- Phone: [number]
- WhatsApp: [number]
- Location: South Africa
- Hours: Mon-Fri, 8am-5pm SAST
- "Not sure if your task can be automated? Ask us. We'll tell you straight."

### Section 3: What Happens Next
- **Five numbered steps (vertical list with icons):**
  1. **"We respond fast."** "Within 24 hours. Usually much sooner. A real person, not an autoresponder."
  2. **"We listen."** "A quick 15-minute call to understand your business and where your time is going. We ask questions. You talk."
  3. **"No sales pitch."** "If automation doesn't make sense for you, we'll say so. We'd rather be honest than waste your time."
  4. **"You get a clear plan."** "Your biggest opportunities mapped out, potential savings estimated, and a straightforward quote. No obligation."
  5. **"You decide."** "No pressure. No follow-up calls every three days. When you're ready, we're here."

### Section 4: FAQ Accordion
- **Seven expandable questions (clean expand/collapse animation):**
  1. **"How long does it take to build an automation?"** "Simple workflows: a few days. Complex multi-system automations: 2-4 weeks. We'll give you a clear timeline before we start."
  2. **"Do I need any technical knowledge?"** "None. We handle everything: design, building, testing, and ongoing management."
  3. **"What apps do you work with?"** "Over 400 and counting. Google Workspace, Microsoft 365, Xero, QuickBooks, Salesforce, HubSpot, Pipedrive, Slack, WhatsApp, Shopify, WooCommerce, Airtable, Notion, BambooHR, Zendesk, Intercom, Eventbrite, DocuSign, Trello, Asana, Jira, WordPress, Mailchimp, Stripe, Typeform, Twilio, Buffer, and if your app has an API, we can connect it."
  4. **"What about my existing systems?"** "If it has an API (most modern tools do), we can connect it. We'll check compatibility in the free plan session."
  5. **"Is my data safe?"** "Yes. We self-host your automations, so your data stays on infrastructure you control. Fully POPIA compliant."
  6. **"What does it cost?"** "Four plans: Solo (R999/mo), Team (R2,500/mo), Business (R5,500/mo), and Enterprise (custom quote). Flat monthly retainer, no per-user fees, no credits, no per-task charges. Solo has zero setup fee. Training included on Business and Enterprise. All in ZAR. Month-to-month on every plan. First month at 50% during launch."
  7. **"Can I cancel?"** "Anytime. No lock-in contracts. We keep your business because we deliver results."

### Section 5: Trust Signals (near form area)
- Row of badges/icons:
  - "100+ workflows delivered"
  - "POPIA compliant"
  - "No lock-in. No hidden fees."
  - "Your data stays in your hands"

---

## MICRO PAGES

### 404 Page
- **H1:** "This page got automated out of existence."
- **Body:** "The page you're looking for isn't here, but we can definitely help you find what you need."
- **Two buttons:** "Take me home" | "Get a Free Automation Plan"
- **Tone:** Playful, warm, simple. NOT techy. No "ERROR 404: LOGIC FAULT" or platform status cards.

### Thank You Page
- **H1:** "We Got You. We'll Be In Touch Soon."
- **Body:** "Thanks for reaching out. Here's what happens next:"
  - "A real person reviews your submission"
  - "We get back to you within 24 hours (usually faster)"
  - "We'll set up a quick call to learn about your business"
- **"While you wait:"** "Read how a Joburg property group went from losing leads to responding in under a minute" (link to case study)
- **Tone:** Warm confirmation. Do NOT add fabricated stats, case study numbers, or marketing sections.

### Exit-Intent Popup
- **Headline:** "Your team is losing a full day every week to busywork."
- **Body:** "30% of the average work week goes to tasks a machine could handle. We'll show you exactly where, for free."
- **CTA:** "Start Free"
- **Dismiss link:** "I'll keep doing it manually"

### Cookie Banner
- **This is a BANNER overlay, not a full page.**
- Single line at bottom of screen: "We use cookies to improve your experience. Nothing shady."
- Two buttons: "Accept" | "Learn More"
