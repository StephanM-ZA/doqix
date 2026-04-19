# Design System: Do.Qix Website
**Project:** Do.Qix — South African Workflow Automation

## 1. Visual Theme & Atmosphere

The aesthetic is **premium dark with electric energy** — a near-black canvas punctuated by vivid teal and warm amber sparks. The mood sits between the polished minimalism of Vercel and the confident clarity of Stripe, but with more warmth and human approachability. Nothing feels corporate or cold. The site radiates quiet confidence — like a fast-moving startup that already has its act together.

Density is deliberately low. Generous whitespace gives every element room to breathe. Sections are spacious (80-120px vertical padding) and never feel cramped. The visual hierarchy is earned through contrast, scale, and motion — not decoration or visual noise.

The overall feel: **kinetic, confident, alive.** Every section responds to the user. The page moves forward with momentum — it never feels static.

## 2. Color Palette & Roles

### Backgrounds
- **Void Charcoal** (#0D2028) — The primary canvas. A near-black with a cool blue undertone that feels deep without being flat. Used for page background and full-width sections.
- **Elevated Onyx** (#141419) — A subtle step above the canvas. Used for cards, panels, and content containers to create soft depth separation without harsh contrast.
- **Whisper Lift** (#1a1a22) — The hover/active state for surfaces. A barely perceptible brightening that rewards interaction.

### Accents
- **Electric Teal** (#00e5a0) — The signature "go" color. Vivid, energetic, impossible to miss. Used for primary CTAs, active states, focus rings, progress indicators, and success feedback. This is the brand's heartbeat.
- **Warm Amber** (#ffb347) — A human counterpoint to the teal's electric energy. Used for badges ("Most Popular"), proof points, highlights, and secondary emphasis. Adds warmth without competing with teal.
- **Coral Alert** (#ff6b6b) — Reserved exclusively for errors, warnings, and destructive actions. Rarely seen but instantly understood.

### Text
- **Soft Cloud** (#f0f0f5) — Primary text color. An off-white that avoids the harshness of pure white on dark backgrounds. Used for headings, body copy, and any text that needs to command attention.
- **Muted Steel** (#8a8a9a) — Secondary text. A cool gray for captions, placeholders, supporting copy, and anything that should recede behind primary content.
- **Void Charcoal** (#0D2028) — Text rendered on top of Electric Teal buttons and badges. Dark-on-bright for maximum contrast.

### Structural
- **Shadow Line** (#1e1e2a) — Subtle borders for card edges, dividers, and section separators. Visible enough to define boundaries, quiet enough to never dominate.

## 3. Typography Rules

**Inter is the only typeface.** No secondary fonts. No display alternatives. Inter at varying weights provides all the hierarchy and character this design needs.

| Level | Weight | Size | Spacing | Role |
|-------|--------|------|---------|------|
| Display Large | 700 Bold | 72px | -0.02em tight | Hero headlines, major page titles |
| Display Medium | 700 Bold | 56px | -0.02em tight | Section hero text, key statements |
| Heading Large | 700 Bold | 40px | -0.01em | Section titles (H2) |
| Heading Medium | 600 Semibold | 32px | -0.01em | Subsection titles (H3) |
| Heading Small | 600 Semibold | 24px | Normal | Card titles, feature names |
| Body Large | 400 Regular | 20px | Normal | Lead paragraphs, hero subtext |
| Body Medium | 400 Regular | 16px | Normal | Standard body copy |
| Body Small | 400 Regular | 14px | Normal | Supporting text, descriptions |
| Label Medium | 500 Medium | 14px | +0.01em | Navigation links, button text, form labels |
| Label Small | 500 Medium | 12px | +0.02em | Badges, captions, micro-copy |

Line height is generous: 1.1 for display text (tight for impact), 1.6 for body text (open for readability). Headings use negative letter-spacing for a confident, dense feel. Labels use positive letter-spacing for clarity at small sizes.

## 4. Component Stylings

### Buttons
- **Primary CTA:** Pill-shaped with generously rounded ends (24px radius). Solid Electric Teal (#00e5a0) fill with Void Charcoal (#0D2028) text. On hover: a soft teal glow blooms outward (box-shadow pulse animation), subtle scale-up to 1.02. On press: micro scale-down. Font: Inter 600, 14-16px.
- **Secondary/Ghost:** Transparent fill with Shadow Line (#1e1e2a) border, Soft Cloud (#f0f0f5) text. On hover: border brightens, background fills to Whisper Lift (#1a1a22).
- **Text Link:** No underline at rest. Electric Teal (#00e5a0) color. Underline slides in on hover from left to right.

### Cards & Containers
- **Standard Card:** Elevated Onyx (#141419) background with 1px Shadow Line (#1e1e2a) border. Generously rounded corners (12px radius). On hover: card lifts with increased shadow depth and background shifts to Whisper Lift (#1a1a22). Transition: 300ms with spring easing.
- **Highlighted Card:** Same as standard but with a subtle Electric Teal (#00e5a0) left border accent (3px) or a faint teal top glow. Used for featured items (e.g., "Most Popular" pricing tier).
- **Callout Card:** Slightly different treatment — dashed or double border, or a subtle gradient background — to distinguish editorial/important notes from data cards.

### Inputs & Forms
- Elevated Onyx (#141419) background with 1px Shadow Line (#1e1e2a) border. Moderately rounded corners (8px). On focus: border transitions to Electric Teal (#00e5a0) with a soft teal glow ring. Placeholder text in Muted Steel (#8a8a9a). Input text in Soft Cloud (#f0f0f5).

### Badges & Pills
- Fully rounded (24px radius), pill-shaped. Small, compact. Background varies by type:
  - Amber badge: Warm Amber (#ffb347) background with dark text — for "Most Popular", proof points
  - Teal badge: Electric Teal (#00e5a0) background with dark text — for status, success
  - Muted badge: Whisper Lift (#1a1a22) with Muted Steel text — for labels, categories

### Navigation
- Transparent over the hero section. Transitions to a frosted-glass dark surface (Elevated Onyx with backdrop-blur) on scroll. Sticky positioning. Logo left, links center or right, primary CTA pill button right. Transition: 300ms smooth.

## 5. Layout Principles

- **Max content width:** 1200px, always centered with auto margins
- **Grid:** 8px base unit. All spacing values are multiples of 8
- **Section vertical padding:** 80-120px — sections breathe, never feel stacked
- **Card gaps:** 24-32px between cards in grids
- **Content grids:** 2-column and 4-column on desktop, stack to single column on mobile
- **Desktop-first** design that scales down responsively
- **Visual hierarchy** earned through size contrast, color weight, and spatial position — not through borders, boxes, or decorative elements

## 6. Motion & Animation (Critical)

**This site must feel alive. Every section animates. Static pages are failures.**

### Entrance Animations
- **Section reveal:** Elements fade up (translateY 30px to 0) with slight scale (0.97 to 1.0) as they scroll into view. Duration: 500ms. Easing: cubic-bezier(0.16, 1, 0.3, 1) — a spring-like snap that feels confident.
- **Staggered siblings:** When multiple cards or items enter together, each staggers by 60-80ms. The effect cascades left-to-right or top-to-bottom.
- **Hero headline:** Words fade up individually with spring physics, 60ms stagger per word. The first thing users see should feel crafted.

### Interactive Animations
- **Button hover:** Teal glow pulse (box-shadow bloom), scale to 1.02. Duration: 150ms.
- **Button press:** Scale down to 0.98. Duration: 100ms.
- **Card hover:** Lift upward with deeper shadow, background brightens. Duration: 300ms.
- **Link hover:** Underline slides in from left. Duration: 200ms.

### Data Animations
- **Count-up numbers:** Statistics and monetary values count up from 0 to their final value when scrolled into view. Duration: 1500-2000ms with easing deceleration.
- **Progress lines:** Vertical connecting lines in step-based sections draw downward as the user scrolls, revealing steps sequentially.

### Ambient Motion
- **Hero visual:** Node diagram with app icons gently floating/orbiting, data particles flowing along connection lines. Continuous, subtle, never distracting.
- **Testimonial carousel:** Smooth horizontal slide with momentum physics and snap-to-card behavior.

### Timing Reference
| Type | Duration | Easing |
|------|----------|--------|
| Micro-interaction | 150ms | ease-out |
| Component transition | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Section reveal | 500ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Count-up numbers | 1500-2000ms | ease-out deceleration |
| Exit/dismiss | 200ms | ease-in |

### Implementation
- Scroll triggers: Intersection Observer API, threshold 0.1, trigger once (no re-animate on scroll up)
- CSS: @keyframes for repeating animations, transitions for interactive states
- JS: Inline `<script>` for Intersection Observer setup and count-up logic
- Accessibility: All motion disabled when `prefers-reduced-motion: reduce` is set
