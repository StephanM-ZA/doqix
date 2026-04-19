# Background Color Change Notes

When changing the background color (currently testing navy #0e1330 vs original #131318), the following ALL need updating:

## 1. global.css
- `body { background-color }` — main page background
- `--color-bg` CSS variable
- `.site-footer { background }` — footer (darker shade)
- `.timeline-circle.outline { background-color }` — must match page bg
- `.hero-gradient` — may need opacity boost (currently 15% for navy)

## 2. Tailwind Config (in each HTML file)
These are in the `<script id="tailwind-config">` block:
- `"surface-dim"` — main background
- `"surface"` — same as surface-dim
- `"background"` — same as surface-dim
- `"surface-container-lowest"` — deepest sections (darker than bg)
- `"surface-container-low"` — section backgrounds (slightly lighter)
- `"surface-container"` — card-like containers
- `"surface-container-high"` — elevated elements
- `"surface-container-highest"` — inputs, top layer
- `"surface-bright"` — focus/hover state

## 3. Hardcoded bg colors in HTML
Search for these patterns in each page:
- `bg-[#131318]` or whatever the old bg color was
- `bg-[#0e0e13]` — deep sections
- `bg-[#1a1a20]` — card backgrounds (now handled by .card class)
- `bg-[#16161c]` — stat card backgrounds (now handled by .card class)
- `bg-zinc-950` — nav/header background

## 4. Card background
- `--card-bg` in global.css — currently #1a2248 for navy scheme
- Must have enough contrast against the section background

## 5. Color relationships (navy scheme tested)
| Role | Original (charcoal) | Navy scheme |
|------|---------------------|-------------|
| Body bg | #131318 | #0e1330 |
| Deeper sections | #0e0e13 | #0a0f28 |
| Section bg alt | #1b1b20 | #111738 |
| Container | #1f1f25 | #141a3e |
| Container high | #2a292f | #182045 |
| Container highest | #35343a | #1e2550 |
| Surface bright | #39383e | #222a55 |
| Card bg | #1a1a20 | #1a2248 |
| Footer bg | #0a0a0f | #080c24 |

## 6. Spec docs to update
- `design/next-prompt.md` — Background color value
- `design/Website_Copy.md` — if it references colors
- `design/DESIGN.md` — design system colors

## 7. Pages that need the Tailwind config updated
ALL pages share the same Tailwind config colors. When we move to a framework, this becomes one config file. For now, each HTML file has its own config block that needs matching:
- index.html (DONE for navy)
- services.html
- products.html
- contact.html
- privacy-policy.html
- terms-and-conditions.html
- thank-you.html
- 404.html
- exit-popup.html
- cookie-banner.html

## 8. Current scheme — Royal Navy #0C1830 (FINAL)

| Role | Value | Tailwind Config Key |
|------|-------|-------------------|
| Body bg | #0C1830 | surface-dim, surface, background |
| Deeper sections | #081024 | surface-container-lowest |
| Section bg alt | #101C36 | surface-container-low |
| Container | #14203C | surface-container |
| Container high | #1A2A48 | surface-container-high |
| Container highest | #1E3050 | surface-container-highest |
| Surface bright | #223656 | surface-bright |
| Card bg | #14203C | (--card-bg in global.css) |
| Footer bg | #060C1C | (.site-footer in global.css) |
| Hero gradient | rgba(0, 229, 160, 0.10) | (.hero-gradient in global.css) |
| Text on accent | #0C1830 | (buttons, CTAs on teal bg) |

## 9. Pages updated
- index.html — DONE (Tailwind config + hardcoded bg colors)
- services.html — TODO
- products.html — TODO
- contact.html — TODO
- privacy-policy.html — TODO
- terms-and-conditions.html — TODO
- thank-you.html — TODO
- 404.html — TODO
- exit-popup.html — TODO
- cookie-banner.html — TODO

## Decision Status
Background color: **#0C1830** (Royal Navy) — DECIDED 2026-04-19.
