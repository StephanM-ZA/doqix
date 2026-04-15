<?php
/**
 * Plugin Name: Do.Qix ROI Calculator
 * Plugin URI:  https://doqix.co.za
 * Description: Interactive ROI calculator showing potential automation savings. Use shortcode [doqix_roi_calculator] on any page.
 * Version:     1.3.0
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
define( 'DOQIX_ROI_VERSION',    '1.3.0' );
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

		// Card & Layout
		'color_card_bg'        => '',
		'color_card_border'    => '',
		'color_heading_text'   => '',
		'color_body_text'      => '',

		// Slider
		'color_slider_track'   => '',
		'color_slider_label'   => '',

		// Hero Result
		'color_hero_bg'        => '',
		'color_hero_value'     => '',
		'color_hero_label'     => '',

		// Result Cards
		'color_result_value'   => '',
		'color_result_label'   => '',

		// CTA extras
		'color_cta_text'       => '',
		'color_cta_hover_bg'   => '',
		'color_cta_hover_text' => '',

		// Share
		'color_share_text'     => '',

		// Misc
		'color_footnote'       => '',
		'color_tier_text'      => '',
		'color_roi_highlight'  => '',
		'color_tooltip_bg'     => '',
		'color_tooltip_text'   => '',

		// Style controls
		'card_border_radius'   => 8,
		'card_shadow'          => 'subtle',
		'cta_border_radius'    => 8,

		'cta_enabled'    => 1,
		'cta_url'        => '/contact',
		'cta_text'       => 'Ready to turn these savings into reality?',
		'cta_subtext'    => "We'll walk you through exactly where to start.",
		'share_url'      => 'https://doqix.co.za',
		'share_enabled'  => 1,
		'og_description' => '',
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

/* ── Deep merge defaults ── */

/**
 * Recursively merge default values into existing settings.
 *
 * - Missing keys get the default value.
 * - Associative arrays are recursed into.
 * - Scalars and indexed (numeric) arrays are kept as-is.
 *
 * @param array $defaults Default settings.
 * @param array $existing Existing (stored) settings.
 * @return array Merged settings.
 */
function doqix_roi_deep_merge_defaults( $defaults, $existing ) {
	foreach ( $defaults as $key => $value ) {
		if ( ! isset( $existing[ $key ] ) ) {
			$existing[ $key ] = $value;
		} elseif ( is_array( $value ) && is_array( $existing[ $key ] ) && ! wp_is_numeric_array( $value ) ) {
			$existing[ $key ] = doqix_roi_deep_merge_defaults( $value, $existing[ $key ] );
		}
		// Scalar or numeric array — keep existing
	}
	return $existing;
}

/* ── Migration: legacy preset restructure + version upgrade ── */

/**
 * Phase 1: Move legacy per-field content/display settings into presets.
 * Phase 2: Deep-merge current defaults so new fields get default values
 *          while existing user data is preserved.
 */
function doqix_roi_maybe_migrate() {
	$s = get_option( DOQIX_ROI_OPTION_KEY );
	if ( false === $s || empty( $s ) ) {
		return; // Fresh install — activation hook handles this
	}

	$dirty = false;

	/* Phase 1: Legacy preset migration (pre-preset → presets structure) */
	if ( ! isset( $s['presets'] ) ) {
		$preset_keys    = array( 'heading_text', 'intro_text', 'footnote_text', 'color_accent', 'color_cta', 'cta_enabled', 'cta_url', 'cta_text', 'cta_subtext', 'share_url', 'share_enabled' );
		$default_preset = doqix_roi_get_preset_defaults();
		foreach ( $preset_keys as $k ) {
			if ( isset( $s[ $k ] ) ) {
				$default_preset[ $k ] = $s[ $k ];
				unset( $s[ $k ] );
			}
		}
		$s['presets'] = array( 'default' => $default_preset );
		$dirty = true;
	}

	/* Phase 2: Version-based migration — merge new default fields */
	$stored_version = isset( $s['version'] ) ? $s['version'] : '0.0.0';
	if ( version_compare( $stored_version, DOQIX_ROI_VERSION, '>=' ) ) {
		if ( $dirty ) {
			update_option( DOQIX_ROI_OPTION_KEY, $s );
		}
		return; // Up to date
	}

	// Deep merge top-level defaults
	$defaults = doqix_roi_get_defaults();
	$s = doqix_roi_deep_merge_defaults( $defaults, $s );

	// Deep merge preset-level defaults into each existing preset
	$preset_defaults = doqix_roi_get_preset_defaults();
	if ( isset( $s['presets'] ) && is_array( $s['presets'] ) ) {
		foreach ( $s['presets'] as $slug => &$preset ) {
			$preset = doqix_roi_deep_merge_defaults( $preset_defaults, $preset );
		}
		unset( $preset );
	}

	// Stamp current version
	$s['version'] = DOQIX_ROI_VERSION;
	update_option( DOQIX_ROI_OPTION_KEY, $s );
}
add_action( 'plugins_loaded', 'doqix_roi_maybe_migrate' );

/* ── Load classes ── */
require_once DOQIX_ROI_PLUGIN_DIR . 'includes/class-doqix-roi-admin.php';
require_once DOQIX_ROI_PLUGIN_DIR . 'includes/class-doqix-roi-frontend.php';

/* ── Instantiate ── */
if ( is_admin() ) {
	new Doqix_ROI_Admin();
}
new Doqix_ROI_Frontend();

/* ── GitHub Update Checker ── */
if ( ! class_exists( 'Doqix_Updater' ) ) {
	$updater_path = WP_PLUGIN_DIR . '/doqix-settings/includes/class-doqix-updater.php';
	if ( file_exists( $updater_path ) ) {
		require_once $updater_path;
	}
}
if ( class_exists( 'Doqix_Updater' ) ) {
	Doqix_Updater::register( 'doqix-roi-calculator', plugin_basename( __FILE__ ), DOQIX_ROI_VERSION );
}

/* ── Activation: seed defaults (preserves existing on re-activation) ── */
register_activation_hook( __FILE__, function () {
	add_option( DOQIX_ROI_OPTION_KEY, doqix_roi_get_defaults() );
} );
