<?php
/**
 * Plugin Name: Do.Qix ROI Calculator
 * Plugin URI:  https://doqix.co.za
 * Description: Interactive ROI calculator showing potential automation savings. Use shortcode [doqix_roi_calculator] on any page.
 * Version:     1.0.0
 * Author:      Do.Qix
 * Author URI:  https://doqix.co.za
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: doqix-roi-calculator
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ── Constants ── */
define( 'DOQIX_ROI_VERSION',    '1.0.0' );
define( 'DOQIX_ROI_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DOQIX_ROI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DOQIX_ROI_OPTION_KEY', 'doqix_roi_settings' );

/**
 * Single source of truth for all default settings.
 *
 * @return array
 */
function doqix_roi_get_defaults() {
	return array(
		/* Pricing tiers */
		'tier_1_name'  => 'Solo',
		'tier_1_price' => 999,
		'tier_2_name'  => 'Team',
		'tier_2_price' => 2500,
		'tier_3_name'  => 'Business',
		'tier_3_price' => 5500,
		'tier_4_name'  => 'Enterprise',
		'tier_4_price' => 0,

		/* Slider: People */
		'people_default' => 3,
		'people_min'     => 1,
		'people_max'     => 50,
		'people_step'    => 1,

		/* Slider: Hours */
		'hours_default' => 8,
		'hours_min'     => 1,
		'hours_max'     => 40,
		'hours_step'    => 1,

		/* Slider: Rate */
		'rate_default' => 150,
		'rate_min'     => 50,
		'rate_max'     => 1000,
		'rate_step'    => 50,

		/* Slider: Efficiency */
		'efficiency_default' => 70,
		'efficiency_min'     => 50,
		'efficiency_max'     => 90,
		'efficiency_step'    => 5,

		/* Slider: Error cost */
		'error_default' => 2000,
		'error_min'     => 0,
		'error_max'     => 50000,
		'error_step'    => 500,

		/* Heading + intro */
		'heading_text' => 'See What You Could Save',
		'intro_text'   => 'SA businesses waste 20–30 hours per week on tasks that could run themselves. Drag the sliders to see what automation would mean for yours.',

		/* Colors — empty = use theme defaults from CSS */
		'color_accent' => '',
		'color_cta'    => '',

		/* Call to action */
		'cta_url'     => '/contact',
		'cta_text'    => 'Ready to turn these savings into reality?',
		'cta_subtext' => "We'll walk you through exactly where to start.",

		/* Share */
		'share_enabled' => 1,
		'share_url'     => 'https://doqix.co.za',

		/* Display */
		'footnote_text' => 'Self-hosted. No middleman pricing. *For estimate purposes only.',
	);
}

/* ── Load classes ── */
require_once DOQIX_ROI_PLUGIN_DIR . 'includes/class-doqix-roi-admin.php';
require_once DOQIX_ROI_PLUGIN_DIR . 'includes/class-doqix-roi-frontend.php';

/* ── Instantiate ── */
if ( is_admin() ) {
	new Doqix_ROI_Admin();
}
new Doqix_ROI_Frontend();

/* ── Activation: seed defaults (preserves existing on re-activation) ── */
register_activation_hook( __FILE__, function () {
	add_option( DOQIX_ROI_OPTION_KEY, doqix_roi_get_defaults() );
} );
