=== Do.Qix Workflow Advisor ===
Contributors: doqix
Tags: workflow, automation, advisor, tools, matching
Requires at least: 5.6
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Interactive workflow advisor matching your business tools against curated automation workflows for South African businesses.

== Description ==

The Do.Qix Workflow Advisor lets prospects select the business tools they already use and instantly see which automation workflows are possible. A curated library of 15 workflows is matched against the user's tool selection using category-based matching.

**Features:**

* Category-based tool matching — add a new tool to a category and all related workflows work automatically
* 15 curated workflows covering common SA business automation scenarios
* Visual flow diagrams showing trigger → action steps
* Difficulty badges (Easy / Medium / Hard) and hours-saved estimates
* Partial match support with "You'd also need..." notes
* Optional lead capture form before CTA
* Admin-configurable categories, services, and workflows via repeater UI
* Zero dependencies — vanilla JS, no jQuery
* Fully responsive with mobile-friendly card layout
* Conditional asset loading — CSS/JS only on pages with the shortcode
* Themify Builder compatible
* Translation-ready with text domain

**Usage:**

Place the shortcode `[doqix_workflow_advisor]` on any page or post.

Configure settings at **Workflow Advisor** in the admin menu.

== Installation ==

1. Upload the `doqix-workflow-advisor` folder to `/wp-content/plugins/`
2. Activate the plugin through the Plugins menu
3. Add `[doqix_workflow_advisor]` to any page or post
4. (Optional) Adjust settings at Workflow Advisor admin page

== Changelog ==

= 1.0.0 =
* Initial release
* 10 categories, 31 services, 15 curated workflows
* Category-based matching algorithm with partial match support
* Admin repeater UI for categories, services, and workflows
* Visual flow diagrams with difficulty badges
* Optional lead capture form
* Themify Builder compatible conditional enqueue
