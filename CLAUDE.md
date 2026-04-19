# Do.Qix Website — Project Instructions

> Basic rules and standards: [[/Volumes/External/development_projects/master_commands/basic-rules.md]]

---

## WordPress Plugin Rules

### Version Bump on Push (MANDATORY)

Before pushing any plugin changes to GitHub, you MUST:

1. **Bump the version** in BOTH the plugin header (`Version: x.x.x`) AND the version constant (`define('DOQIX_*_VERSION', 'x.x.x')`)
2. **Update `updates.json`** in the repo root with the new version number for every plugin that changed
3. **Use semantic versioning**: patch (x.x.1) for fixes, minor (x.1.0) for features, major (1.0.0) for breaking changes
4. **Create and push a git tag** (`v*` pattern, e.g. `v1.2.2-roi-info`) to trigger the GitHub Actions release workflow

This ensures WordPress detects the update and users can click "Update" in the admin.

**Never push plugin changes without bumping the version.**

### Release Workflow

- GitHub Actions workflow (`.github/workflows/release-plugins.yml`) only triggers on **tags** matching `v*` — pushing to `main` alone does NOT create a release.
- The workflow packages ALL plugin directories under `assets/` into zips (with correct parent folder structure) and creates a GitHub Release with the zips attached.
- WordPress auto-update reads `updates.json` which points `download_url` to the latest GitHub Release zip.
- **Do NOT commit pre-built zip files** to the repo — the workflow builds them from source. The `assets/*.zip` files in the repo are local development artifacts only.

### Zip Structure

WordPress requires plugin zips to contain a parent folder matching the plugin slug:
```
doqix-roi-calculator.zip
  └── doqix-roi-calculator/
      ├── doqix-roi-calculator.php
      ├── includes/
      └── assets/
```
**Never** build flat zips (files at root) — this causes WordPress update loops.

---

## Website Development Rules

### No Inline JavaScript (MANDATORY)

All JavaScript MUST be in external `.js` files, never inline `<script>` blocks. HTML files should remain minimal with only markup.

- Place JS files in a `js/` folder relative to the HTML file (e.g., `design/index/js/`)
- Link with `<script src="js/filename.js"></script>` before `</body>`
- One JS file per component/feature (e.g., `roi-calculator.js`, `testimonial-carousel.js`)
- Shared utilities go in `js/main.js`

### No Em Dashes in Copy (MANDATORY)

Em dashes (—) are a telltale sign of AI-generated text. Never use them in any customer-facing copy.

Use instead:
- **Period** for new thoughts: "X. Y"
- **Comma** for soft connections: "X, Y"
- **Colon** for elaboration/lists: "X: Y"
- **Parentheses** for asides: "X (aside) Y"
- **En dash** (–) for attributions only (standard typography)

### No Hardcoding Unless Necessary (MANDATORY)

Never hardcode values in HTML when they can be defined in JS or CSS config. HTML should contain structure and IDs only. All data, defaults, ranges, labels, and configuration values belong in the JS or CSS files that control the component.

### Git Tag on Every Website Push (MANDATORY)

Every push to `main` that changes website files MUST be tagged for rollback capability.

**Process:**
1. Commit website changes
2. Create an annotated git tag: `git tag -a web-vX.Y.Z -m "description"`
3. Push the commit AND the tag: `git push origin main --tags`

**Versioning:**
- Use `web-v` prefix to distinguish from plugin tags (`v*`)
- Semantic versioning: patch (x.x.1) for fixes, minor (x.1.0) for features/new pages, major (1.0.0) for redesigns
- Current version: **web-v0.1.0** (homepage design complete)

**Never push website changes without creating a version tag.**

### Sync Design to Root (MANDATORY)

GitHub Pages serves from `main:/` (root). The source of truth is in `design/`, but root-level files are what gets deployed. After ANY change to design files:

1. Copy `design/global.css` to root `global.css`
2. Copy `design/index/js/*.js` to root `js/`
3. Copy `design/[page]/[page].html` to root `[page].html`, fixing CSS path from `../global.css` to `global.css`

**This sync is part of the push process — commit the root files alongside the design files.**

### Branch Strategy

- **main** = website files only (design/, docs/, site/, CLAUDE.md, etc.)
- **plugins** = WordPress plugins only (assets/ folder)

Never mix website and plugin commits on the same branch.
