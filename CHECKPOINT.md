# CHECKPOINT — Do.Qix Website Plugins

**Date:** 2026-03-13
**Status:** Homepage Redirect renamed to DoQix Settings with tabbed UI | ROI V1 complete + zipped | ROI V2 complete (no zip) | Workflow Advisor v1.2 (step-level categories) | WFA test HTML updated

---

## Latest: DoQix Settings Plugin (formerly Homepage Redirect) — COMPLETE

**Location:** `assets/doqix-settings/`
**Zip:** `assets/doqix-settings.zip`
**Status:** Ready to install (replaces old doqix-homepage-redirect plugin)

### What Changed (v2.0.0)
- **Renamed** from "Do.Qix Homepage Redirect" to "Do.Qix Settings"
- **Folder** renamed from `doqix-homepage-redirect/` to `doqix-settings/`
- **File** renamed from `doqix-homepage-redirect.php` to `doqix-settings.php`
- **Class** renamed from `Doqix_Homepage_Redirect` to `Doqix_Settings`
- **Tabbed interface** added using WordPress native `nav-tab-wrapper`
- **Homepage Redirect** is now the first tab
- Menu appears at **Settings > Do.Qix Settings**
- Existing DB settings preserved (same option key `doqix_redirect_settings`)

### Adding New Tabs
1. Add entry to `get_tabs()` method
2. Add `case` in `render_settings_page()` switch
3. Register new settings in `register_settings()`
4. Create `render_*_tab()` method

### Important: WordPress Deployment
Since folder/file paths changed, must **deactivate old plugin** and **activate new one** in WordPress.

### Redirect Loop Fix (still applies)
WordPress Settings > Reading — `/doqix` must NOT be set as static front page. Plugin includes `redirect_canonical` filter as backup.

---

## Previous Plugins

### 1. Workflow Advisor Plugin — v1.2 Step-Level Categories
All 10 files at `assets/doqix-workflow-advisor/`
- 10 categories, 31 services, 15 curated workflows
- Step-level tool categories with active/inactive visual states
- **Standalone test file:** `assets/doqix-workflow-advisor-test.html`

### 2. ROI Calculator V1 — Fixes Applied + Zipped
- **Zip:** `assets/doqix-roi-calculator.zip`

### 3. ROI Calculator V2 — Same Fixes Applied (no zip yet)
- Location: `assets/doqix-roi-calculator-v2/`

## Pending / Next Steps

1. Deploy doqix-settings.zip to WordPress (deactivate old, activate new)
2. User testing Workflow Advisor v1.2 step categories via test HTML
3. Create V2 ROI Calculator zip (when requested)
4. Create Workflow Advisor zip (when requested)
5. Add additional settings tabs as needed

---

## Git State

**Repository:** `/Volumes/External/development_projects/build/doqix_website`
**Branch:** `main`
**Remote:** None configured
**Last commit:** `1faf799` feat(wordpress): add Do.Qix ROI Calculator plugin
**Uncommitted:** DoQix Settings plugin (renamed from homepage redirect), old homepage-redirect.zip, modified ROI calculator files, workflow advisor files
