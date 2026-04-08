<?php
/**
 * Plugin Name: Do.Qix ROI Calculator
 * Plugin URI:  https://doqix.co.za
 * Description: Interactive ROI calculator showing potential automation savings. Use shortcode [doqix_roi_calculator] on any page.
 * Version:     1.2.0
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
define( 'DOQIX_ROI_VERSION',    '1.2.0' );
define( 'DOQIX_ROI_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DOQIX_ROI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DOQIX_ROI_OPTION_KEY', 'doqix_roi_settings' );

/**
 * Default values for a single preset.
 *
 * @return array
 */
function doqix_roi_get_preset_defaults() {
	return array(
		'label'          => 'Default',
		'heading_text'   => 'See What You Could Save',
		'intro_text'     => 'SA businesses waste 20–30 hours per week on tasks that could run themselves. Drag the sliders to see what automation would mean for yours.',
		'footnote_text'  => 'Self-hosted. No middleman pricing. *For estimate purposes only.',
		'color_accent'   => '',
		'color_cta'      => '',
		'cta_enabled'    => 1,
		'cta_url'        => '/contact',
		'cta_text'       => 'Ready to turn these savings into reality?',
		'cta_subtext'    => "We'll walk you through exactly where to start.",
		'share_url'      => 'https://doqix.co.za',
		'share_enabled'  => 1,
	);
}

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

		/* Presets */
		'presets' => array( 'default' => doqix_roi_get_preset_defaults() ),
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

/* ── Migration: move legacy per-field content/display settings into presets ── */
function doqix_roi_maybe_migrate() {
	$s = get_option( DOQIX_ROI_OPTION_KEY, array() );
	if ( empty( $s ) || isset( $s['presets'] ) ) {
		return;
	}

	$preset_keys   = array( 'heading_text', 'intro_text', 'footnote_text', 'color_accent', 'color_cta', 'cta_enabled', 'cta_url', 'cta_text', 'cta_subtext', 'share_url', 'share_enabled' );
	$default_preset = doqix_roi_get_preset_defaults();
	foreach ( $preset_keys as $k ) {
		if ( isset( $s[ $k ] ) ) {
			$default_preset[ $k ] = $s[ $k ];
			unset( $s[ $k ] );
		}
	}
	$s['presets'] = array( 'default' => $default_preset );
	update_option( DOQIX_ROI_OPTION_KEY, $s );
}
add_action( 'admin_init', 'doqix_roi_maybe_migrate' );

/* ── Activation: seed defaults (preserves existing on re-activation) ── */
register_activation_hook( __FILE__, function () {
	add_option( DOQIX_ROI_OPTION_KEY, doqix_roi_get_defaults() );
} );
