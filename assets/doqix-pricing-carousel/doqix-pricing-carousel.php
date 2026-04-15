<?php
/**
 * Plugin Name: Do.Qix Pricing Carousel
 * Plugin URI:  https://doqix.co.za
 * Description: Configurable pricing table carousel. Use shortcode [doqix_pricing] or [doqix_pricing preset="name"].
 * Version:     1.2.1
 * Author:      Do.Qix
 * Author URI:  https://doqix.co.za
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: doqix-pricing-carousel
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ── Constants ── */
define( 'DOQIX_PRICING_VERSION',    '1.2.1' );
define( 'DOQIX_PRICING_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DOQIX_PRICING_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DOQIX_PRICING_OPTION_KEY', 'doqix_pricing_settings' );

/* ── Default: single card fields ── */

/**
 * Default values for a single pricing card.
 *
 * @return array
 */
function doqix_pricing_get_card_defaults() {
	return array(
		'name'              => '',
		'subtitle'          => '',
		'price'             => '',
		'price_suffix'      => '/mo',
		'price_annual'      => '',
		'setup_fee'         => '',
		'savings'           => '',
		'features'          => '',
		'description'       => '',
		'excludes'          => '',
		'cta_label'         => 'Start Free',
		'cta_url'           => '/contact',
		'badge'             => '',
		'featured'          => 0,
		'icon_type'         => 'none',
		'icon_value'        => '',
		'sort_order'        => 0,

		/* Per-card colour overrides (empty = inherit from preset) */
		'color_header_bg'   => '',
		'color_header_text' => '',
		'color_cta_bg'      => '',
		'color_cta_text'    => '',
		'color_badge_bg'    => '',
		'color_badge_text'  => '',
		'color_card_bg'     => '',
		'color_feat_text'   => '',
		'color_feat_check'  => '',
		'color_exc_text'    => '',
	);
}

/* ── Default: single preset ── */

/**
 * Default values for a preset (carousel settings + cards).
 *
 * @return array
 */
function doqix_pricing_get_preset_defaults() {
	return array(
		'label'             => 'Default',

		/* Carousel / layout */
		'display_desktop'   => 'grid',
		'display_mobile'    => 'carousel',
		'mobile_breakpoint' => 768,
		'nav_style'         => 'breadcrumbs',
		'autoplay'          => 0,
		'autoplay_speed'    => 5000,
		'active_scale'      => 1.05,
		'inactive_opacity'  => 0.6,
		'loop'              => 0,

		/* Billing toggle */
		'billing_toggle'    => 0,
		'monthly_label'     => 'Monthly',
		'annual_label'      => 'Annual',
		'annual_discount'   => 15,

		/* Preset-level colours (empty = theme default) */
		'color_header_bg'      => '',
		'color_header_text'    => '',
		'color_accent'         => '',
		'color_card_bg'        => '',
		'color_cta_bg'         => '',
		'color_cta_text'       => '',
		'color_cta_hover_bg'   => '',
		'color_cta_hover_text' => '',
		'color_arrow_bg'       => '',
		'color_arrow_color'    => '',
		'color_arrow_hover_bg' => '',
		'color_badge_bg'       => '',
		'color_badge_text'     => '',
		'color_feat_text'      => '',
		'color_feat_check'     => '',
		'color_exc_text'       => '',
		'color_exc_title'      => '',

		/* Cards */
		'cards'             => array(
			array_merge( doqix_pricing_get_card_defaults(), array(
				'name'        => 'Solo',
				'subtitle'    => 'Solopreneurs & freelancers',
				'price'       => 'R999',
				'price_suffix' => '/mo',
				'setup_fee'   => 'Free setup',
				'savings'     => 'Save ~R3,000-R8,000/mo',
				'features'    => '<ul><li>1 workflow</li><li>Email support (48hr)</li><li>Workflow hosting &amp; monitoring</li><li>Workflow builds</li><li>Maintenance &amp; updates</li><li>POPIA compliant</li><li>No lock-in</li></ul>',
				'excludes'    => '<ul><li>Training (R1,500/session)</li><li>Extra workflows (+R750/mo each)</li><li>Third-party API costs</li><li>Additional services (quoted separately)</li></ul>',
				'cta_label'   => 'Start Free',
				'cta_url'     => '/contact',
				'sort_order'  => 0,
			) ),
			array_merge( doqix_pricing_get_card_defaults(), array(
				'name'        => 'Team',
				'subtitle'    => 'Small teams (2-15 people)',
				'price'       => 'R2,500',
				'price_suffix' => '/mo',
				'setup_fee'   => 'R1,500 setup',
				'savings'     => 'Save ~R8,000-R20,000/mo',
				'features'    => '<ul><li>Up to 3 workflows</li><li>Priority + WhatsApp (24hr)</li><li>Workflow hosting &amp; monitoring</li><li>Workflow builds</li><li>Maintenance &amp; updates</li><li>POPIA compliant</li><li>No lock-in</li></ul>',
				'excludes'    => '<ul><li>Training (R1,500/session)</li><li>Extra workflows (+R650/mo each)</li><li>Third-party API costs</li><li>Additional services (quoted separately)</li></ul>',
				'cta_label'   => 'Start Free',
				'cta_url'     => '/contact',
				'badge'       => 'Most Popular',
				'featured'    => 1,
				'sort_order'  => 1,
			) ),
			array_merge( doqix_pricing_get_card_defaults(), array(
				'name'        => 'Business',
				'subtitle'    => 'Growing SMEs (15-50 people)',
				'price'       => 'R5,500',
				'price_suffix' => '/mo',
				'setup_fee'   => 'R2,500 setup',
				'savings'     => 'Save ~R20,000-R50,000/mo',
				'features'    => '<ul><li>Up to 6 workflows</li><li>Dedicated + monthly strategy call</li><li>Training included</li><li>Workflow hosting &amp; monitoring</li><li>Workflow builds</li><li>Maintenance &amp; updates</li><li>POPIA compliant</li><li>No lock-in</li></ul>',
				'excludes'    => '<ul><li>Extra workflows (+R500/mo each)</li><li>Third-party API costs</li><li>Additional services (quoted separately)</li></ul>',
				'cta_label'   => 'Start Free',
				'cta_url'     => '/contact',
				'sort_order'  => 2,
			) ),
			array_merge( doqix_pricing_get_card_defaults(), array(
				'name'        => 'Enterprise',
				'subtitle'    => 'Larger operations (50+)',
				'price'       => 'Custom',
				'price_suffix' => '',
				'setup_fee'   => "Let's talk",
				'savings'     => 'Save R50,000+/mo',
				'features'    => '<ul><li>Unlimited workflows (scoped)</li><li>Dedicated account manager</li><li>Training included</li><li>Workflow hosting &amp; monitoring</li><li>Workflow builds</li><li>Maintenance &amp; updates</li><li>POPIA compliant</li><li>No lock-in</li></ul>',
				'excludes'    => '<ul><li>Additional services (quoted separately)</li></ul>',
				'cta_label'   => 'Show Me What\'s Possible',
				'cta_url'     => '/contact',
				'sort_order'  => 3,
			) ),
		),
	);
}

/* ── Default: full settings ── */

/**
 * Single source of truth for all default settings.
 *
 * @return array
 */
function doqix_pricing_get_defaults() {
	return array(
		'global' => array(
			'version'           => DOQIX_PRICING_VERSION,
			'currency_symbol'   => 'R',
			'currency_position' => 'before',
		),
		'presets' => array(
			'default' => doqix_pricing_get_preset_defaults(),
		),
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
function doqix_pricing_deep_merge_defaults( $defaults, $existing ) {
	foreach ( $defaults as $key => $value ) {
		if ( ! isset( $existing[ $key ] ) ) {
			$existing[ $key ] = $value;
		} elseif ( is_array( $value ) && is_array( $existing[ $key ] ) && ! wp_is_numeric_array( $value ) ) {
			$existing[ $key ] = doqix_pricing_deep_merge_defaults( $value, $existing[ $key ] );
		}
		// Scalar or numeric array — keep existing
	}
	return $existing;
}

/* ── Version migration ── */

/**
 * Migrate stored settings when the plugin version is bumped.
 *
 * Deep-merges current defaults so new fields get their default values
 * while existing user data is preserved.
 */
function doqix_pricing_maybe_migrate() {
	$settings = get_option( DOQIX_PRICING_OPTION_KEY );
	if ( false === $settings ) {
		return; // Fresh install — activation hook handles this
	}

	$stored_version = isset( $settings['global']['version'] ) ? $settings['global']['version'] : '0.0.0';
	if ( version_compare( $stored_version, DOQIX_PRICING_VERSION, '>=' ) ) {
		return; // Up to date
	}

	// ── 1.2.0: One-time reset — update cards with generic hosting language and catch-all excludes
	if ( version_compare( $stored_version, '1.2.0', '<' ) ) {
		$fresh_preset = doqix_pricing_get_preset_defaults();
		if ( isset( $settings['presets']['default'] ) ) {
			$settings['presets']['default']['cards'] = $fresh_preset['cards'];
		}
	}

	// Deep merge current defaults into existing settings
	$defaults = doqix_pricing_get_defaults();
	$settings = doqix_pricing_deep_merge_defaults( $defaults, $settings );

	// Also merge preset-level defaults into each existing preset
	$preset_defaults = doqix_pricing_get_preset_defaults();
	if ( isset( $settings['presets'] ) && is_array( $settings['presets'] ) ) {
		foreach ( $settings['presets'] as $slug => &$preset ) {
			$preset = doqix_pricing_deep_merge_defaults( $preset_defaults, $preset );
			// Merge card-level defaults into each existing card
			if ( isset( $preset['cards'] ) && is_array( $preset['cards'] ) ) {
				$card_defaults = doqix_pricing_get_card_defaults();
				foreach ( $preset['cards'] as &$card ) {
					$card = doqix_pricing_deep_merge_defaults( $card_defaults, $card );
				}
				unset( $card );
			}
		}
		unset( $preset );
	}

	// Stamp current version
	$settings['global']['version'] = DOQIX_PRICING_VERSION;
	update_option( DOQIX_PRICING_OPTION_KEY, $settings );
}
add_action( 'plugins_loaded', 'doqix_pricing_maybe_migrate' );

/* ── Theme colour detection ── */

/**
 * Attempt to detect the current theme's accent colour.
 *
 * Checks Themify settings first, then standard WP theme mods.
 *
 * @return string Hex colour string or empty string.
 */
function doqix_pricing_get_theme_accent_color() {
	$themify_keys = array( 'styling-link_color', 'styling-accent_color' );

	/* Themify framework: accent stored as separate options (themify_setting-KEY) */
	foreach ( $themify_keys as $key ) {
		$val = get_option( 'themify_setting-' . $key, '' );
		if ( ! empty( $val ) ) {
			if ( strpos( $val, '#' ) !== 0 ) {
				$val = '#' . $val;
			}
			if ( preg_match( '/^#[0-9a-fA-F]{3,6}$/', $val ) ) {
				return $val;
			}
		}
	}

	/* Themify (legacy/array form): themify_setting as a single option */
	$themify = get_option( 'themify_setting', array() );
	if ( is_array( $themify ) ) {
		foreach ( $themify_keys as $tf_key ) {
			if ( ! empty( $themify[ $tf_key ] ) ) {
				$val = $themify[ $tf_key ];
				if ( strpos( $val, '#' ) !== 0 ) {
					$val = '#' . $val;
				}
				if ( preg_match( '/^#[0-9a-fA-F]{3,6}$/', $val ) ) {
					return $val;
				}
			}
		}
	}

	/* Standard WP theme mods */
	$wp_keys = array( 'link_color', 'accent_color', 'primary_color' );
	foreach ( $wp_keys as $key ) {
		$val = get_theme_mod( $key, '' );
		if ( ! empty( $val ) && preg_match( '/^#[0-9a-fA-F]{3,6}$/', $val ) ) {
			return $val;
		}
	}

	return '';
}

/* ── Load classes ── */
require_once DOQIX_PRICING_PLUGIN_DIR . 'includes/class-admin.php';
require_once DOQIX_PRICING_PLUGIN_DIR . 'includes/class-frontend.php';

/* ── Instantiate ── */
if ( is_admin() ) {
	new Doqix_Pricing_Admin();
}
new Doqix_Pricing_Frontend();

/* ── GitHub Update Checker ── */
if ( ! class_exists( 'Doqix_Updater' ) ) {
	$updater_path = WP_PLUGIN_DIR . '/doqix-settings/includes/class-doqix-updater.php';
	if ( file_exists( $updater_path ) ) {
		require_once $updater_path;
	}
}
if ( class_exists( 'Doqix_Updater' ) ) {
	Doqix_Updater::register( 'doqix-pricing-carousel', plugin_basename( __FILE__ ), DOQIX_PRICING_VERSION );
}

/* ── Activation: seed defaults (preserves existing on re-activation) ── */
register_activation_hook( __FILE__, function () {
	add_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );
} );
