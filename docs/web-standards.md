# Do.Qix Web Standards

Performance, accessibility, SEO, and best practices standards for the Do.Qix website. Reference this document before every push.

---

## Performance

### Scripts

- All non-critical `<script>` tags MUST have the `defer` attribute
- Only render-critical scripts load without defer: `header.js`
- Tailwind is built locally (see CLAUDE.md "Tailwind CSS Build"). Do not re-introduce `cdn.tailwindcss.com`
- All scroll/touch event listeners MUST use `{ passive: true }` unless they call `preventDefault()`
- Never read layout properties (`offsetHeight`, `offsetWidth`, `getBoundingClientRect`) synchronously during page load. Wrap in `requestAnimationFrame`
- SVG markup inside JS string literals MUST be on a single line. Multi-line SVGs inside quotes cause `SyntaxError`

### Images

- All below-fold images MUST have `loading="lazy"`
- All `<img>` elements MUST have explicit `width` and `height` attributes matching their display size
- Testimonial avatars: 48x48 display size, use `width="48" height="48"`
- Use `<picture>` with WebP source and JPG fallback for raster images
- Compress images to their actual display dimensions, not source dimensions

```html
<picture>
  <source srcset="images/photo.webp" type="image/webp"/>
  <img src="images/photo.jpg" alt="Description" width="48" height="48" loading="lazy" class="..."/>
</picture>
```

### Video

- Background/decorative videos MUST use `preload="none"` (not `preload="metadata"`)
- Always provide a `poster` image so something displays before the video loads
- Compress background videos aggressively (CRF 30-35, 1280px max width, no audio)

```html
<video autoplay muted loop playsinline preload="none" poster="hero-poster.jpg" src="hero-video.mp4"></video>
```

### Payload Targets

| Asset type | Target size |
|-----------|------------|
| Hero video | Under 700KB |
| Avatar images (48x48 WebP) | Under 2KB each |
| Full-width images | Under 100KB |
| Total page payload (mobile) | Under 2MB |

### Cache-Busting

- All CSS and JS references in HTML use `?v=X.Y.Z` matching the current `web-vX.Y.Z` tag
- Bump `?v=` on every commit that changes CSS or JS files
- The footer build version reads from its own `?v=` param automatically

---

## Accessibility

### Headings

- Every page MUST have exactly one `<h1>`
- Headings MUST follow sequential order: h1 > h2 > h3 > h4. Never skip levels
- Footer and header labels are NOT semantic headings. Use `<p class="footer-col-heading">` instead of `<h4>`
- Navigation links are NOT headings

### Forms

- Every `<input>`, `<select>`, and `<textarea>` MUST have an associated `<label>` element
- Use `for="id"` on the label matching the input's `id`
- If a visible label is not appropriate, use `aria-label` on the input

### Colour Contrast

- Text MUST meet WCAG AA contrast ratio: 4.5:1 for normal text, 3:1 for large text (18px+ bold or 24px+)
- Key colour combinations to verify:
  - `#e4e1e9` (on-surface) on `#0C1830` (background) = 12.3:1 (pass)
  - `#bacbbf` (on-surface-variant) on `#0C1830` = 8.7:1 (pass)
  - `#84958a` (outline) on `#0C1830` = 4.8:1 (pass for large text only)
  - `#00e5a0` (primary) on `#0C1830` = 8.1:1 (pass)
- Never use `#84958a` (outline) for body-size text on dark backgrounds

### Images and Media

- All `<img>` elements MUST have descriptive `alt` text
- Decorative images use `alt=""`
- SVG icons MUST have `aria-hidden="true"` when used alongside text
- `<video>` elements SHOULD include a `<track kind="captions">` element for accessibility

### Interactive Elements

- All buttons MUST have accessible labels (text content or `aria-label`)
- Close buttons: use `aria-label="Close"`
- Links opening new tabs MUST have `target="_blank" rel="noopener"`
- Dialogs MUST have `role="dialog"` and `aria-label`
- Modal dialogs MUST have `aria-modal="true"` and trap focus

### Keyboard Navigation

- All interactive elements MUST be reachable via Tab key
- Escape key MUST close open modals and popups
- Focus order MUST follow visual reading order

---

## SEO

### Meta Tags (every page)

```html
<title>Page Title | Do.Qix</title>
<meta name="description" content="Under 160 chars describing page content"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="https://digitaloperations.co.za/doqix/page.html"/>
```

### Open Graph (every page)

```html
<meta property="og:title" content="Page Title | Do.Qix"/>
<meta property="og:description" content="Description"/>
<meta property="og:image" content="https://digitaloperations.co.za/doqix/images/og_image.jpg"/>
<meta property="og:url" content="https://digitaloperations.co.za/doqix/page.html"/>
<meta property="og:type" content="website"/>
```

### Structured Data

- Homepage MUST have `ProfessionalService` JSON-LD schema
- Validate with Google Rich Results Test after changes

### Crawlability

- All pages MUST be linked from navigation or footer
- Use descriptive anchor text, not "click here"
- Internal links use relative paths (`contact.html`, not absolute URLs)

---

## Best Practices

### Security Headers

- All external links MUST use `rel="noopener"` with `target="_blank"`
- Content Security Policy should be configured at the hosting level
- No inline event handlers (`onclick`, `onload`, etc.)

### Console

- Zero console errors in production
- `console.warn` is acceptable for defensive guards (e.g., Tailwind CDN check)
- Never leave `console.log` in production code

### Third-Party Resources

- Preconnect to critical third-party origins:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
```

- Any new third-party resource MUST be disclosed in the cookie banner
- Analytics/tracking MUST be gated behind cookie consent ("Allow All" only)

### JS String Literals

- Never use multi-line strings with single/double quotes in JS
- If HTML contains newlines, either collapse to one line or split into concatenated strings on separate lines:

```js
// WRONG - will throw SyntaxError
'<svg>
  <path d="..."/>
</svg>'

// CORRECT - single line
'<svg><path d="..."/></svg>'

// CORRECT - concatenated
'<svg>' +
'<path d="..."/>' +
'</svg>'
```

---

## Pre-Push Checklist

Before every push, verify:

1. [ ] `?v=` cache-bust strings bumped to match new tag version
2. [ ] `defer` on all non-critical scripts
3. [ ] No console errors (test in browser)
4. [ ] Images have `loading="lazy"`, `width`, `height`, and `alt`
5. [ ] Heading hierarchy is sequential (h1 > h2 > h3, no skips)
6. [ ] Cookie banner disclosure matches actual tracking/analytics
7. [ ] Design files synced to `site/` folder
8. [ ] New version tag created (`web-vX.Y.Z`)
