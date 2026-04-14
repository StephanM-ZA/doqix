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
