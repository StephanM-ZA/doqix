=== Do.Qix ROI Calculator ===
Contributors: doqix
Tags: roi, calculator, automation, savings
Requires at least: 5.6
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 2.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Interactive ROI calculator showing potential automation savings for South African businesses.

== Description ==

The Do.Qix ROI Calculator is an interactive widget that lets prospects estimate their potential savings from business process automation. Admin-configurable sliders and pricing tiers drive a role-based formula, and results update in real-time.

**V2 Features:**

* Dynamic tiers — add, remove, or reorder pricing tiers from the admin panel
* Dynamic sliders — add or remove input sliders with configurable roles (multiplier, rate, efficiency, flat monthly)
* Role-based formula — calculations adapt automatically to whichever sliders are configured
* Configurable tier thresholds — set per-tier savings thresholds and bump logic from admin
* Zero dependencies — vanilla JS, no jQuery
* Fully responsive with touch-friendly 36px+ slider thumbs on mobile
* Conditional asset loading — CSS/JS only on pages with the shortcode
* Themify Builder compatible
* Translation-ready with text domain

**Usage:**

Place the shortcode `[doqix_roi_calculator]` on any page or post.

Configure settings at **ROI Calculator** in the admin menu.

== Installation ==

1. Upload the `doqix-roi-calculator-v2` folder to `/wp-content/plugins/`
2. Deactivate V1 if active (Do.Qix ROI Calculator v1.0.0)
3. Activate the plugin through the Plugins menu
4. Add `[doqix_roi_calculator]` to any page or post
5. (Optional) Adjust settings at ROI Calculator admin page

== Changelog ==

= 2.0.0 =
* Dynamic tiers: add/remove pricing tiers from admin
* Dynamic sliders: add/remove input sliders with role-based formula
* Configurable tier thresholds and bump logic
* Admin repeater UI for tiers and sliders
* Separate option key (doqix_roi_v2_settings) — no V1 collision
* All V1 defaults preserved as initial configuration
