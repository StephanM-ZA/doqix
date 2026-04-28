# Build Request Popup — Design Spec

**Date:** 2026-04-28
**Status:** Approved
**Owner:** Stephan Marais
**Trigger:** Header "Let's Build" CTA + `?build=1` URL parameter

---

## 1. Purpose

A guided multi-step popup that helps non-technical visitors describe a custom build idea (app, automation, dashboard, or "not sure"), then shows them a real starting price with two delivery options:

- **Build & hand over** — once-off price, customer hosts and manages.
- **Build & manage** — lower setup fee plus a monthly retainer with a minimum term that scales with build cost.

When the form cannot confidently estimate (user is too unsure on key inputs), the popup gracefully routes the user to a consultation request instead of showing a fabricated number.

The popup occupies its own lane separate from the standard automation retainer plans (Solo / Team / Business / Enterprise). Those plans remain month-to-month with no lock-in. Custom builds are a different model with their own minimum terms — clearly framed as "fair for both sides", not as a contract trap.

---

## 2. Goals & Non-Goals

### Goals

- Capture leads with custom build ideas with low friction for non-technical users.
- Give the prospect a transparent, on-brand starting price within ~60 seconds.
- Surface two genuine commercial options (own it vs we run it) and let the prospect self-select.
- Route uncertain prospects to a consultation, preserving the lead without fabricating numbers.
- Promote a real launch discount via a visual spots-remaining meter that hides itself when sold out.

### Non-Goals (v1)

- Calendar booking flow inside the popup (Calendly link on thank-you page is a hardcoded URL for now).
- A/B testing variants of the welcome screen.
- Backend admin UI for the offer config — `build-request-config.json` is hand-edited, committed, and deployed.
- Automatic decrement of `spots_remaining` based on submissions — manual edit by the owner when a booking is confirmed, to keep the counter truthful.

---

## 3. User Flow

```
[ Visitor clicks "Let's Build" or visits ?build=1 ]
              │
              ▼
   ┌─────────────────────┐
   │  Welcome screen     │  Hook + preview card + stat strip + launch offer
   └─────────────────────┘
              │  Start →
              ▼
   ┌─────────────────────┐
   │  Q1 What kind?      │  automation / dashboard / app / not sure
   └─────────────────────┘
              │
              ▼
   ┌─────────────────────┐
   │  Q2 How big?        │  small / medium / big / not sure
   └─────────────────────┘
              │
              ▼
   ┌─────────────────────┐
   │  Q3 Login?          │  yes / no / not sure
   └─────────────────────┘
              │
              ▼
   ┌─────────────────────┐
   │  Q4 Integrations?   │  yes (with optional free-text) / no / not sure
   └─────────────────────┘
              │
              ▼
   [ Threshold rule evaluated ]
       │                    │
       ▼ confident          ▼ uncertain
   ┌──────────┐        ┌──────────────┐
   │ Estimate │        │ Consultation │
   └──────────┘        └──────────────┘
       │                    │
       └─────────┬──────────┘
                 ▼
   ┌─────────────────────┐
   │  Contact step       │  name * / email * / phone * / company / notes
   └─────────────────────┘
                 │  Submit
                 ▼
   POST /webhook/doqix-build-request
                 │
                 ▼
   thank-you.html?from=build&route=<estimate|consultation>
```

### Threshold rule

Decides whether to show an estimate or route to consultation:

```
if (Q1.type === 'unsure')                                    → consultation
if (count('unsure' across Q2.size, Q3.login, Q4.integ) >= 2) → consultation
else                                                          → estimate
```

When estimate is shown but a single answer is "Not sure", the calculator defaults that input to a sensible middle value (`size: medium`, `login: no`, `integrations: no`).

---

## 4. The Calculator

Pure function. Takes the wizard answers plus config, returns the build cost and both delivery option prices. All tunable values come from `build-request-config.json`.

### Inputs

```json
{
  "type":         "automation | dashboard | app | unsure",
  "size":         "small | medium | big | unsure",
  "login":        "yes | no | unsure",
  "integrations": "yes | no | unsure",
  "integrations_text": "string (optional, free-text)"
}
```

### Build cost formula

```
basePrice  = config.base[type]
sizeMult   = config.size_multiplier[size]
loginAdd   = login === 'yes' ? config.login_addon : 0
integAdd   = integrations === 'yes' ? config.integ_addon : 0

buildCost  = (basePrice * sizeMult) + loginAdd + integAdd
buildCost  = roundUp(buildCost, 500)
```

### Two delivery options

```
// Option A — handover
handoverPrice = buildCost

// Option B — managed
minMonths = buildCost <  15000 ? 6
          : buildCost <= 50000 ? 12
          : 18

managedSetup   = round(buildCost * config.managed.setup_pct, 500)
amortized      = round((buildCost - managedSetup) / minMonths, 500)
hostingBase    = config.managed.hosting_base
managedMonthly = amortized + hostingBase
```

### Launch discount (when active and route is `estimate`)

```
discountPct           = config.launch_offer.discount_pct
handoverAfter         = round(handoverPrice * (1 - discountPct), 500)
managedSetupAfter     = round(managedSetup   * (1 - discountPct), 500)
```

The estimate UI shows the original price as strikethrough alongside the discounted price.

### Worked examples

| Scenario | Inputs | Build | Handover | Managed (setup + /mo) | Min term |
|---|---|---|---|---|---|
| Small automation, no login, no integ | auto/small/no/no | R3,000 | R3,000 once-off | R500 + R2,000/mo | 6 mo |
| Medium app, login + integ | app/medium/yes/yes | R38,000 | R38,000 once-off | R7,500 + R4,000/mo | 12 mo |
| Big app, login + integ | app/big/yes/yes | R68,000 | R68,000 once-off | R13,500 + R4,500/mo | 18 mo |
| Small dashboard, no login | dash/small/no/no | R8,000 | R8,000 once-off | R1,500 + R2,500/mo | 6 mo |

---

## 5. Configuration File

`design/build-request-config.json` (synced to `site/build-request-config.json`):

```json
{
  "launch_offer": {
    "enabled": true,
    "spots_remaining": 7,
    "total_spots": 10,
    "discount_pct": 0.20,
    "label": "20% off setup"
  },
  "base": {
    "automation": 3000,
    "dashboard":  8000,
    "app":       15000,
    "unsure":     8000
  },
  "size_multiplier": {
    "small":   1,
    "medium":  2,
    "big":     4,
    "unsure":  2
  },
  "login_addon": 5000,
  "integ_addon": 3000,
  "managed": {
    "setup_pct":    0.20,
    "hosting_base": 1500
  }
}
```

The popup fetches this file once on load. If the fetch fails, it falls back to the same values hardcoded in `build-request.js` so the popup keeps working. To change a price or close the launch offer, the owner edits this file, commits, and deploys.

When `launch_offer.enabled` is `false` or `spots_remaining` is `0`, the welcome-screen launch banner is removed entirely (no "sold out" tombstone). Discounts in the calculator are also disabled.

---

## 6. Screens

### 6.1 Welcome

- **Eyebrow** (pill): "In about 60 seconds"
- **Heading**: "Find out what your idea would cost." (with green accent on "cost")
- **Body**: "Answer 4 simple questions and we'll show you a real starting price. No 'contact us for a quote'. Actual numbers."
- **Preview card** (dashed green border): mock estimate showing "🤝 We build & manage · R5,000 + R3,500/mo · 12-month minimum, then month-to-month".
- **Stat strip** (top + bottom border): `60s · to fill in` | `4 · questions` | `R0 · to ask`.
- **Launch-offer card** (when active):
  - Top row: "Launch offer · First 10 builds get 20% off setup" with a green `−20%` pill on the right.
  - Bottom row: "Spots remaining · 7 of 10" plus a 10-square meter. Filled green squares = remaining, faded squares = taken. Bright squares have a soft green glow.
  - Optional last-spot styling: when `spots_remaining === 1`, the card border, label, pill, and final square shift to amber for added urgency.
- **CTA**: `Start →` (full-width primary).
- **Footer**: "No spam. No follow-up calls unless you want them."

### 6.2 Q1 — What kind of thing?

Single-select option list:

- 🔄 An automation — "Something that runs in the background"
- 📊 A dashboard — "A place to see your data at a glance"
- 📱 An app — "Something people open and use"
- 🤔 Not sure yet — "We'll figure it out together"

### 6.3 Q2 — How big does it feel?

- 🌱 Small — "A calculator, or a form that emails you when filled in"
- 🏗️ Medium — "A booking system with admin, or an app with a few screens"
- 🏢 Big — "A platform with users, payments, dashboards, lots of features"
- 🤔 Not sure — "That's fine — we'll figure it out together on a call"

### 6.4 Q3 — Will people need to log in?

- ✅ Yes — "Different people see different things"
- ❌ No — "Anyone with the link can use it"
- 🤔 Not sure

### 6.5 Q4 — Connect to other tools?

- ✅ Yes — followed by an optional one-line free text "Which ones? (optional, e.g. Xero, Gmail)"
- ❌ No
- 🤔 Not sure

### 6.6a Estimate result (route: estimate)

- **Eyebrow**: "Your starting estimate"
- **Heading**: "Two ways to make it happen."
- **Helper**: "Here's where projects like yours typically begin. We'll firm up the final numbers on a quick call."
- **Card A (left or top): 🏗️ We build it, you run it**
  - Price: `R{handoverPrice}` (with strikethrough of original if discount active)
  - Meta: "Once-off · yours forever"
  - Body: "We hand over the code and setup. You arrange your own hosting (~R200/mo on your side)."
- **Card B (right or bottom): 🤝 We build & manage** — `RECOMMENDED` badge, green accent ring
  - Price: `R{managedSetup} + R{managedMonthly}/mo` (strikethrough on setup if discount active)
  - Meta: "{minMonths}-month minimum, then month-to-month"
  - Body: "We host, monitor, fix, and improve. You focus on running your business."
- **Disclaimer**: "Both options include the same build. Prices reflect your launch offer." (last sentence only when discount applied)
- **CTA**: `Continue →` (advances to contact step)

### 6.6b Consultation result (route: consultation)

- **Heading**: "Sounds like we should talk first."
- **Body**: "Some ideas are easier to scope on a quick call than through a form. We'll listen, ask the right questions, and send you a clear plan with real numbers within 24 hours."
- **CTA**: `Continue →` (advances to contact step)

### 6.7 Contact step

Form fields (existing `.form-field` markup from `global.css`):

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | yes | |
| Email | email | yes | regex validated |
| Phone | tel | yes | |
| Company | text | no | |
| Anything else? | textarea | no | |
| Honeypot `website` | text | hidden | submission silently dropped if filled |

Cookie consent gate: webhook submission is allowed regardless of consent (they are voluntarily submitting). Analytics events are gated on consent (see §10).

Submit button label varies by route:

- Estimate route: `Send My Estimate`
- Consultation route: `Get a Call`

### 6.8 Submission redirect

```
thank-you.html
  ?from=build
  &route=<estimate|consultation>
  &type=<type>     (estimate route only)
  &size=<size>     (estimate route only)
  &build=<buildCost>  (estimate route only)
```

---

## 7. Submission

### 7.1 Endpoint

```
POST https://hooks.digitaloperations.co.za/webhook/doqix-build-request
Content-Type: application/json
```

A new endpoint, separate from the contact form's `/webhook/doqix-contact`. Wired to its own n8n workflow on the owner's side, outside this spec.

### 7.2 Payload

```json
{
  "route": "estimate",
  "answers": {
    "type": "app",
    "size": "medium",
    "login": "yes",
    "integrations": "yes",
    "integrations_text": "Xero and Gmail"
  },
  "estimate": {
    "build_cost":                     38000,
    "handover_price":                 38000,
    "managed_setup":                  7500,
    "managed_monthly":                4000,
    "min_months":                     12,
    "launch_offer_applied":           true,
    "handover_price_after_discount":  30500,
    "managed_setup_after_discount":   6000
  },
  "contact": {
    "name":    "Jane Smith",
    "email":   "jane@example.com",
    "phone":   "+27 82 555 1234",
    "company": "Acme Pty",
    "notes":   "We need this by end of Q3"
  },
  "meta": {
    "page":         "/services.html",
    "referrer":     "https://google.com/...",
    "submitted_at": "2026-04-28T14:30:00Z",
    "user_agent":   "Mozilla/5.0 ..."
  }
}
```

`estimate` is `null` when `route === "consultation"`.

### 7.3 Failure handling

If the network request fails or returns a non-2xx, redirect to `thank-you.html` anyway. The webhook may have already received it; better to thank the prospect than scare them with a broken form.

### 7.4 Dedupe

If the same payload (hash of `answers + contact.email`) is submitted twice within 30 seconds, dedupe client-side. Stops accidental double-clicks creating duplicate records.

---

## 8. Thank-you page changes

`design/thank-you/thank-you.html` reads `?from` and `?route` params on load and swaps the headline and body copy:

| from | route | Heading | Body |
|---|---|---|---|
| (none) | (none) | "We Got You" *(existing)* | Existing contact-form copy |
| `build` | `estimate` | "Estimate sent. Now we talk." | "Your starting price is on its way to your inbox. We'll be in touch within 24 hours to walk through it. Hot to start? [Book a 15-min call →]" |
| `build` | `consultation` | "Got it. Talk soon." | "We'll review what you sent and reach out within 24 hours with a few clarifying questions and a starting plan. [Book a 15-min call →]" |

The "Book a 15-min call" link is a hardcoded Calendly URL. Calendar embedding is out of scope for v1.

---

## 9. Visual Design

The popup mirrors the existing `exit-popup` overlay pattern verbatim, with `.build-popup-*` class names so they don't collide.

### 9.1 Container structure

```html
<div id="build-popup-overlay" role="dialog" aria-modal="true" aria-labelledby="build-popup-title">
  <div class="build-popup-backdrop"></div>
  <div class="build-popup-card">
    <button class="build-popup-close" aria-label="Close">…</button>
    <div class="build-popup-progress">…</div>
    <div class="build-popup-body"><!-- screen content --></div>
  </div>
</div>
```

### 9.2 Style tokens (mirrors exit-popup exactly)

| Token | Value |
|---|---|
| Overlay z-index | `9999` |
| Backdrop | `rgba(12, 24, 48, 0.85)` + `backdrop-filter: blur(4px)` |
| Card background | `var(--color-surface-container, #14203C)` |
| Card border | `1px solid rgba(59, 74, 65, 0.2)` |
| Card radius | `1rem` |
| Card max-width | `36rem` |
| Card max-height | `calc(100dvh - 2rem)` with `overflow-y: auto` |
| Card padding (desktop) | `3rem 2rem` |
| Card padding (≤480px) | `2.5rem 1.5rem 2rem` |
| Card shadow | `0 40px 80px -20px rgba(0, 229, 160, 0.08)` |
| Open animation | translate from `-50%, calc(-50% + 2rem)` to `-50%, -50%` over 300ms ease |
| Close button | `top: 1.5rem; right: 1.5rem`, color `#bacbbf`, hover `#00e5a0` |
| Heading | `1.5rem`, weight 900, color `#e4e1e9` |
| Body text | `0.875rem`, color `#bacbbf`, line-height `1.5`, max-width `28rem` |
| Buttons | existing `.btn .btn-primary` (sm/md/lg, plus `.glow`), `.btn-ghost` for Back |
| Form fields | existing `.form-field` classes |
| Eyebrow text | existing `.label` class style |

### 9.3 Wizard-specific additions

1. **Progress bar**: 5 segments (one per screen including welcome), `#00e5a0` filled / `rgba(59, 74, 65, 0.4)` unfilled, `3px` height. "Step N of 5" muted counter underneath.
2. **Step body cross-fade**: 150ms cross-fade on `.build-popup-body` only when advancing between steps. Progress bar and close button stay still.
3. **Sticky CTA row**: when card content is long, Back / Continue buttons sit in a row at the card bottom with a `border-top: 1px solid rgba(59, 74, 65, 0.2)` separator.
4. **Option buttons** (Q1–Q4): background `#1A2A48`, border `rgba(59, 74, 65, 0.4)`, selected state has `2px solid #00e5a0` border with `rgba(0, 229, 160, 0.08)` background tint.
5. **Estimate cards**: same look as Q-options, recommended option uses the green ring + background tint, plus a `RECOMMENDED` pill badge anchored to the top-right edge.
6. **Mobile (≤480px)**: same centered modal, `max-height: calc(100dvh - 2rem)` lets the card grow to nearly fill the viewport. No separate full-screen sheet — keeps it consistent with `exit-popup`.

### 9.4 Animations

- Open: backdrop fades in 200ms, card slides up + fades in 300ms ease-out.
- Close: reverse.
- Step transitions: 150ms cross-fade on body content.
- Bright launch-offer squares: subtle pulse on the soft green glow (slow, calm — not distracting).

---

## 10. Triggers, Tracking, Consent

### 10.1 Triggers

1. Click on `#cta-lets-build` (desktop header nav-cta) — opens popup.
2. Click on `#cta-lets-build-mobile` (mobile menu CTA) — opens popup.
3. URL parameter `?build=1` on any page — auto-opens popup on load (after 500ms to let the page settle).

The current behaviour of these CTAs (jumping to `index.html#pricing`) is removed: clicks are intercepted with `e.preventDefault()` and the popup opens instead.

### 10.2 Cookie banner

Per the existing `cookie_tracking_sync` memory, the cookie banner disclosure must be updated to mention this popup's analytics events. The webhook submission itself is essential and not gated; only the analytics events listed below depend on consent.

### 10.3 Analytics events (consent-gated)

```
build_popup_opened          { trigger: 'header_cta' | 'url_param' }
build_popup_step_advanced   { from_step: number, to_step: number }
build_popup_abandoned       { last_step: number }
build_popup_estimate_shown  { build_cost: number, route: 'estimate' | 'consultation' }
build_popup_submitted       { route, build_cost? }
```

Events flow into the existing analytics setup (gtag or equivalent — same as the rest of the site).

---

## 11. Accessibility

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at the screen's heading id.
- Focus is moved into the popup on open; first focusable element receives focus.
- A focus trap keeps Tab and Shift-Tab inside the popup while it's open.
- Escape key closes. If the user has answered any questions, a confirm step prevents accidental data loss.
- All interactive elements are real `<button>` or `<a>` elements with proper labels — never clickable `<div>`.
- All option-list items are real `<button>`s, with `aria-pressed` reflecting selected state.
- Body scroll is locked while the popup is open (`body { overflow: hidden }`); restored on close.
- Colour contrast meets WCAG AA — all text colours are pulled from the same tokens used elsewhere on the site, which already meet AA.
- Mobile keyboard handling: when an input on the contact step is focused, the sticky CTA row repositions above the on-screen keyboard via a `visualViewport` watcher; the focused input scrolls into view.

---

## 12. File Layout

### Files to create

```
design/build-request/
  build-request.html              Preview/test page (mirrors design/exit-popup/exit-popup.html)
  js/
    build-request.js              Wizard state machine, calculator, submission, config loader
design/
  build-request-config.json       Launch offer + pricing config

docs/superpowers/specs/
  2026-04-28-build-request-popup-design.md   This file
```

### Files to modify

```
design/global.css                  Add .build-popup-* styles + launch-card .square styles
design/components/header.html      No markup change; bound by header.js
design/components/js/header.js     Bind clicks on #cta-lets-build and #cta-lets-build-mobile;
                                   add ?build=1 auto-open on page load
design/thank-you/thank-you.html    Add data-attribute placeholders for journey-specific copy
design/thank-you/js/thank-you.js   New (if not present) — read ?from and ?route params,
                                   swap heading and body copy, render Calendly link
design/index/index.html            Script tag: js/build-request.js + meta config link
design/services/services.html      Same script tag
design/products/products.html      Same script tag
design/contact/contact.html        Same script tag
design/cookie-banner/cookie-banner.html    Add disclosure line about build-popup analytics
                                            (per cookie_tracking_sync memory)
```

Plus the standard `site/` sync per CLAUDE.md and a cache-bust bump to `web-v0.10.0` (new feature → minor bump).

---

## 13. Out of Scope

- Calendar booking inside the popup.
- A/B test variants of the welcome screen.
- Backend admin UI for editing the config.
- Auto-decrement of `spots_remaining` on submission.
- WordPress plugin integration (future phase if desired).

---

## 14. Open Questions

None at design time. Implementation will firm up:

- Exact Calendly URL to use on the thank-you page.
- Final pricing tunables once we see real submissions.
- Whether to emit analytics via `gtag` vs `dataLayer` push (matches whatever is current site convention at build time).
