# Do.Qix Website — Project Instructions

> Basic rules and standards: [[/Volumes/External/development_projects/master_commands/basic-rules.md]]

---

## WordPress Plugin Rules

### Version Bump on Push (MANDATORY)

Before pushing any plugin changes to GitHub, you MUST:

1. **Bump the version** in BOTH the plugin header (`Version: x.x.x`) AND the version constant (`define('DOQIX_*_VERSION', 'x.x.x')`)
2. **Update `updates.json`** in the repo root with the new version number for every plugin that changed
3. **Use semantic versioning**: patch (x.x.1) for fixes, minor (x.1.0) for features, major (1.0.0) for breaking changes

This ensures WordPress detects the update and users can click "Update" in the admin.

**Never push plugin changes without bumping the version.**
