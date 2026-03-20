<?php
/**
 * Plugin Name: Do.Qix ROI Calculator V2
 * Plugin URI:  https://doqix.co.za
 * Description: Interactive ROI calculator V2 with dynamic tiers, sliders, thresholds, and named presets. Use shortcode [doqix_roi_calculator_v2] or [doqix_roi_calculator_v2 preset="name"] on any page.
 * Version:     2.0.0
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
define( 'DOQIX_ROI_V2_VERSION',    '2.1.0' );
define( 'DOQIX_ROI_V2_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DOQIX_ROI_V2_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DOQIX_ROI_V2_OPTION_KEY', 'doqix_roi_v2_settings' );

/**
 * Default values for a single preset.
 *
 * @return array
 */
function doqix_roi_v2_get_preset_defaults() {
	return array(
		'label'          => 'Default',
		'heading_text'   => 'See What You Could Save',
		'intro_text'     => 'SA businesses waste 20-30 hours per week on tasks that could run themselves. Drag the sliders to see what automation would mean for yours.',
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
 * Structured arrays for tiers and sliders allow N items
 * without code changes. Content/display settings live inside presets.
 *
 * @return array
 */
function doqix_roi_v2_get_defaults() {
	return array(
		/* Pricing tiers — sorted by threshold ascending */
		'tiers' => array(
			array( 'name' => 'Solo',       'price' => 999,  'threshold' => 2500 ),
			array( 'name' => 'Team',       'price' => 2500, 'threshold' => 7500 ),
			array( 'name' => 'Business',   'price' => 5500, 'threshold' => 25000 ),
			array( 'name' => 'Enterprise', 'price' => 0,    'threshold' => 100000 ),
		),

		/* Sliders — each with a role for the generic formula */
		'sliders' => array(
			array(
				'key'     => 'people',
				'label'   => 'People doing repetitive tasks',
				'tooltip' => 'How many staff spend time on repetitive, rule-based work?',
				'role'    => 'multiplier',
				'format'  => 'number',
				'default' => 3,
				'min'     => 1,
				'max'     => 50,
				'step'    => 1,
				'prefix'  => '',
				'suffix'  => '',
			),
			array(
				'key'     => 'hours',
				'label'   => 'Hours per person per week',
				'tooltip' => 'How many hours does each person spend on repetitive tasks every week? Think data entry, copy-pasting, manual emails, reporting.',
				'role'    => 'multiplier',
				'format'  => 'number',
				'default' => 8,
				'min'     => 1,
				'max'     => 40,
				'step'    => 1,
				'prefix'  => '',
				'suffix'  => ' hr',
			),
			array(
				'key'     => 'rate',
				'label'   => 'Average hourly cost',
				'tooltip' => 'What you pay per hour per person — include salary, benefits, and overheads.',
				'role'    => 'rate',
				'format'  => 'currency',
				'default' => 150,
				'min'     => 50,
				'max'     => 1000,
				'step'    => 50,
				'prefix'  => 'R',
				'suffix'  => '',
			),
			array(
				'key'     => 'efficiency',
				'label'   => 'Automation efficiency',
				'tooltip' => 'What percentage of those manual hours can realistically be automated. 70% is a conservative starting point.',
				'role'    => 'efficiency',
				'format'  => 'percentage',
				'default' => 70,
				'min'     => 50,
				'max'     => 90,
				'step'    => 5,
				'prefix'  => '',
				'suffix'  => '%',
			),
			array(
				'key'     => 'error',
				'label'   => 'Monthly error cost',
				'tooltip' => 'What do manual mistakes cost you each month? Think re-work, wrong invoices, missed follow-ups.',
				'role'    => 'flat_monthly',
				'format'  => 'currency',
				'default' => 2000,
				'min'     => 0,
				'max'     => 50000,
				'step'    => 500,
				'prefix'  => 'R',
				'suffix'  => '',
			),
		),

		/* Threshold configuration for tier mapping */
		'thresholds' => array(
			'roi_bump_pct'         => 600,
			'efficiency_bump_pct'  => 80,
			'next_tier_multiplier' => 2,
			'roi_cap_display'      => 10,
		),

		/* Presets */
		'presets' => array( 'default' => doqix_roi_v2_get_preset_defaults() ),
	);
}

/* ── Load classes ── */
require_once DOQIX_ROI_V2_PLUGIN_DIR . 'includes/class-doqix-roi-admin.php';
require_once DOQIX_ROI_V2_PLUGIN_DIR . 'includes/class-doqix-roi-frontend.php';

/* ── Instantiate ── */
if ( is_admin() ) {
	new Doqix_ROI_V2_Admin();
}
new Doqix_ROI_V2_Frontend();

/* ── Migration: move legacy per-field content/display settings into presets ── */
function doqix_roi_v2_maybe_migrate() {
	$s = get_option( DOQIX_ROI_V2_OPTION_KEY, array() );
	if ( empty( $s ) || isset( $s['presets'] ) ) {
		return;
	}

	$preset_keys   = array( 'heading_text', 'intro_text', 'footnote_text', 'color_accent', 'color_cta', 'cta_enabled', 'cta_url', 'cta_text', 'cta_subtext', 'share_url', 'share_enabled' );
	$default_preset = doqix_roi_v2_get_preset_defaults();
	foreach ( $preset_keys as $k ) {
		if ( isset( $s[ $k ] ) ) {
			$default_preset[ $k ] = $s[ $k ];
			unset( $s[ $k ] );
		}
	}
	$s['presets'] = array( 'default' => $default_preset );
	update_option( DOQIX_ROI_V2_OPTION_KEY, $s );
}
add_action( 'admin_init', 'doqix_roi_v2_maybe_migrate' );

/* ── Activation: seed defaults (preserves existing on re-activation) ── */
register_activation_hook( __FILE__, function () {
	add_option( DOQIX_ROI_V2_OPTION_KEY, doqix_roi_v2_get_defaults() );
} );
