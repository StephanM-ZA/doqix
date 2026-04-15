<?php
/**
 * Frontend: shortcode rendering and conditional asset enqueue.
 * V2: loop-based slider rendering from structured config + named presets.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_ROI_V2_Frontend {

	/** @var bool Whether the shortcode was found on the current page. */
	private $enqueue = false;

	public function __construct() {
		add_shortcode( 'doqix_roi_calculator_v2', array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue_assets' ) );
		add_action( 'wp_head', array( $this, 'maybe_inject_og_tags' ), 1 );
	}

	/**
	 * Inject Open Graph meta tags on pages containing the shortcode.
	 *
	 * Prevents social-media link previews from showing raw shortcode text.
	 */
	public function maybe_inject_og_tags() {
		if ( ! is_singular() ) {
			return;
		}

		$post = get_queried_object();
		if ( ! $post || ! isset( $post->post_content ) ) {
			return;
		}

		$found = has_shortcode( $post->post_content, 'doqix_roi_calculator_v2' );
		if ( ! $found ) {
			$builder_meta = get_post_meta( $post->ID, '_themify_builder_settings_json', true );
			if ( $builder_meta && is_string( $builder_meta ) && strpos( $builder_meta, 'doqix_roi_calculator_v2' ) !== false ) {
				$found = true;
			}
		}

		if ( ! $found ) {
			return;
		}

		/* Resolve preset — use default if shortcode atts can't be parsed early */
		$all     = wp_parse_args( get_option( DOQIX_ROI_V2_OPTION_KEY, array() ), doqix_roi_v2_get_defaults() );
		$presets = isset( $all['presets'] ) ? $all['presets'] : array();
		$preset  = isset( $presets['default'] ) ? $presets['default'] : doqix_roi_v2_get_preset_defaults();
		$preset  = wp_parse_args( $preset, doqix_roi_v2_get_preset_defaults() );

		$og_title = ! empty( $preset['heading_text'] )
			? wp_strip_all_tags( $preset['heading_text'] ) . ' — ' . get_bloginfo( 'name' )
			: get_the_title( $post ) . ' — ' . get_bloginfo( 'name' );

		$og_desc = ! empty( $preset['og_description'] )
			? wp_strip_all_tags( $preset['og_description'] )
			: ( ! empty( $preset['intro_text'] ) ? wp_strip_all_tags( $preset['intro_text'] ) : '' );

		$og_url = get_permalink( $post );

		if ( $og_title ) {
			echo '<meta property="og:title" content="' . esc_attr( $og_title ) . '" />' . "\n";
		}
		if ( $og_desc ) {
			echo '<meta property="og:description" content="' . esc_attr( $og_desc ) . '" />' . "\n";
			echo '<meta name="description" content="' . esc_attr( $og_desc ) . '" />' . "\n";
		}
		if ( $og_url ) {
			echo '<meta property="og:url" content="' . esc_url( $og_url ) . '" />' . "\n";
		}
		echo '<meta property="og:type" content="website" />' . "\n";
	}

	/**
	 * Conditionally enqueue CSS + JS only on pages that contain the shortcode.
	 */
	public function maybe_enqueue_assets() {
		if ( ! is_singular() ) {
			return;
		}

		$post = get_queried_object();
		if ( ! $post || ! isset( $post->post_content ) ) {
			return;
		}

		$found = has_shortcode( $post->post_content, 'doqix_roi_calculator_v2' );

		/* Themify Builder fallback: builder modules are stored in post meta,
		   not in post_content, so has_shortcode() misses them. */
		if ( ! $found ) {
			$builder_meta = get_post_meta( $post->ID, '_themify_builder_settings_json', true );
			if ( $builder_meta && is_string( $builder_meta ) && strpos( $builder_meta, 'doqix_roi_calculator_v2' ) !== false ) {
				$found = true;
			}
		}

		if ( ! $found ) {
			return;
		}

		$this->do_enqueue();
	}

	/**
	 * Build the config array passed to JS. Single source of truth.
	 */
	private function build_config( $preset = array(), $all = array() ) {
		return array(
			'tiers'        => $all['tiers'],
			'sliders'      => $all['sliders'],
			'thresholds'   => $all['thresholds'],
			'share_url'    => $preset['share_url'],
			'color_accent' => $preset['color_accent'],
			'color_cta'    => $preset['color_cta'],
		);
	}

	/**
	 * Enqueue assets and localize config.
	 */
	private function do_enqueue( $preset = null, $all = null ) {
		if ( $this->enqueue ) {
			return;
		}

		$this->enqueue = true;

		if ( null === $all ) {
			$all = $this->get_settings();
		}
		if ( null === $preset ) {
			$presets = isset( $all['presets'] ) && is_array( $all['presets'] ) ? $all['presets'] : array();
			$preset = isset( $presets['default'] ) ? $presets['default'] : doqix_roi_v2_get_preset_defaults();
		}

		wp_enqueue_style(
			'doqix-roi-calculator-v2',
			DOQIX_ROI_V2_PLUGIN_URL . 'assets/css/doqix-roi-calculator.css',
			array(),
			DOQIX_ROI_V2_VERSION
		);

		wp_enqueue_script(
			'doqix-roi-calculator-v2',
			DOQIX_ROI_V2_PLUGIN_URL . 'assets/js/doqix-roi-calculator.js',
			array(),
			DOQIX_ROI_V2_VERSION,
			true
		);

		wp_localize_script( 'doqix-roi-calculator-v2', 'doqixRoiConfig', $this->build_config( $preset, $all ) );
	}

	/**
	 * Render [doqix_roi_calculator_v2] shortcode.
	 *
	 * @return string HTML output.
	 */
	public function render_shortcode( $atts ) {
		$atts = shortcode_atts( array( 'preset' => 'default' ), $atts, 'doqix_roi_calculator_v2' );

		$all     = $this->get_settings();
		$presets = isset( $all['presets'] ) && is_array( $all['presets'] ) ? $all['presets'] : array();
		$preset  = isset( $presets[ $atts['preset'] ] ) ? $presets[ $atts['preset'] ] : ( isset( $presets['default'] ) ? $presets['default'] : doqix_roi_v2_get_preset_defaults() );
		$preset  = wp_parse_args( $preset, doqix_roi_v2_get_preset_defaults() );

		/* If assets weren't enqueued via the hook (e.g. Themify late-render),
		   enqueue them now so they still appear on the page. */
		$this->do_enqueue( $preset, $all );

		$sliders = $all['sliders'];

		/* Check for special display conditions */
		$has_people_and_hours = false;
		$has_efficiency       = false;
		$people_default       = 0;
		$hours_default        = 0;

		foreach ( $sliders as $slider ) {
			if ( 'people' === $slider['key'] ) {
				$people_default = $slider['default'];
			}
			if ( 'hours' === $slider['key'] ) {
				$hours_default = $slider['default'];
			}
			if ( 'efficiency' === $slider['role'] ) {
				$has_efficiency = true;
			}
		}

		/* Check if both 'people' and 'hours' keys exist */
		$slider_keys = array_column( $sliders, 'key' );
		if ( in_array( 'people', $slider_keys, true ) && in_array( 'hours', $slider_keys, true ) ) {
			$has_people_and_hours = true;
		}

		/* Resolve colors: preset override -> theme color -> CSS fallback */
		$theme_color = self::get_theme_accent_color();

		/* Full colour map: setting key → CSS variable name */
		$colour_map = array(
			'color_accent'        => '--roi-accent',
			'color_cta'           => '--roi-action',
			'color_card_bg'       => '--roi-card-bg',
			'color_card_border'   => '--roi-line',
			'color_heading_text'  => '--roi-heading-text',
			'color_body_text'     => '--roi-body-text',
			'color_slider_track'  => '--roi-slider-track',
			'color_slider_label'  => '--roi-slider-label',
			'color_hero_bg'       => '--roi-hero-bg',
			'color_hero_value'    => '--roi-hero-value',
			'color_hero_label'    => '--roi-hero-label',
			'color_result_value'  => '--roi-result-value',
			'color_result_label'  => '--roi-result-label',
			'color_roi_highlight' => '--roi-highlight',
			'color_tier_text'     => '--roi-tier-text',
			'color_cta_text'      => '--roi-cta-text',
			'color_cta_hover_bg'  => '--roi-cta-hover-bg',
			'color_cta_hover_text'=> '--roi-cta-hover-text',
			'color_share_text'    => '--roi-share-text',
			'color_footnote'      => '--roi-footnote',
			'color_tooltip_bg'    => '--roi-tooltip-bg',
			'color_tooltip_text'  => '--roi-tooltip-text',
		);

		$inline_vars = '';
		foreach ( $colour_map as $setting_key => $css_var ) {
			$value = ! empty( $preset[ $setting_key ] ) ? $preset[ $setting_key ] : '';

			/* Accent and CTA fall back to theme color if empty */
			if ( '' === $value && in_array( $setting_key, array( 'color_accent', 'color_cta' ), true ) ) {
				$value = $theme_color;
			}

			if ( '' !== $value ) {
				$inline_vars .= $css_var . ':' . esc_attr( $value ) . ';';
			}
		}

		/* Style variables */
		$shadow_map = array( 'none' => 'none', 'subtle' => '0 2px 8px rgba(0,0,0,0.08)', 'medium' => '0 4px 16px rgba(0,0,0,0.12)', 'strong' => '0 8px 28px rgba(0,0,0,0.18)' );
		$inline_vars .= '--roi-radius:' . intval( $preset['card_border_radius'] ?? 8 ) . 'px;';
		$inline_vars .= '--roi-shadow:' . ( $shadow_map[ $preset['card_shadow'] ?? 'subtle' ] ?? $shadow_map['subtle'] ) . ';';
		$inline_vars .= '--roi-cta-radius:' . intval( $preset['cta_border_radius'] ?? 8 ) . 'px;';

		ob_start();
		?>
<section class="doqix-roi" id="roi-calculator"<?php if ( $inline_vars ) echo ' style="' . $inline_vars . '"'; ?>>

	<?php if ( ! empty( $preset['heading_text'] ) ) : ?>
	<h2><?php echo wp_kses_post( $preset['heading_text'] ); ?></h2>
	<?php endif; ?>
	<?php if ( ! empty( $preset['intro_text'] ) ) : ?>
	<p class="section-intro"><?php echo wp_kses_post( $preset['intro_text'] ); ?></p>
	<?php endif; ?>

	<div class="roi-grid">

		<!-- Inputs -->
		<div class="roi-inputs">
			<div class="panel-label"><?php esc_html_e( 'Your Team', 'doqix-roi-calculator' ); ?></div>

			<?php foreach ( $sliders as $slider ) :
				$key     = $slider['key'];
				$format  = $slider['format'];
				$prefix  = $slider['prefix'];
				$suffix  = $slider['suffix'];

				/* Format the display value */
				$display_val = $slider['default'];
				if ( 'currency' === $format ) {
					$display_val = $prefix . number_format( $slider['default'] );
				} elseif ( 'percentage' === $format ) {
					$display_val = $slider['default'] . '%';
				} else {
					$display_val = $prefix . $slider['default'] . $suffix;
				}

				/* Format range labels */
				if ( 'currency' === $format ) {
					$min_label = $prefix . number_format( $slider['min'] );
					$max_label = $prefix . number_format( $slider['max'] );
				} elseif ( 'percentage' === $format ) {
					$min_label = $slider['min'] . '%';
					$max_label = $slider['max'] . '%';
				} else {
					$min_label = $prefix . $slider['min'] . $suffix;
					$max_label = $prefix . $slider['max'] . $suffix;
				}
			?>
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php echo esc_html( $slider['label'] ); ?><?php if ( ! empty( $slider['tooltip'] ) ) : ?><span class="tooltip"><?php echo esc_html( $slider['tooltip'] ); ?></span><?php endif; ?></span>
					<span class="slider-value" id="val-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $display_val ); ?></span>
				</div>
				<input type="range"
					id="slider-<?php echo esc_attr( $key ); ?>"
					min="<?php echo esc_attr( $slider['min'] ); ?>"
					max="<?php echo esc_attr( $slider['max'] ); ?>"
					value="<?php echo esc_attr( $slider['default'] ); ?>"
					step="<?php echo esc_attr( $slider['step'] ); ?>">
				<div class="slider-range-labels">
					<span><?php echo esc_html( $min_label ); ?></span>
					<span><?php echo esc_html( $max_label ); ?></span>
				</div>
				<?php
				/* Special: total hours display after 'hours' slider when both people+hours exist */
				if ( 'hours' === $key && $has_people_and_hours ) : ?>
				<div class="total-hours" id="out-total-hours">= <?php echo esc_html( $people_default * $hours_default ); ?> hrs/week across your team</div>
				<?php endif; ?>
				<?php
				/* Special: efficiency note after efficiency-role sliders */
				if ( 'efficiency' === $slider['role'] ) : ?>
				<div class="efficiency-note" id="out-efficiency-note" style="display:none;"></div>
				<?php endif; ?>
			</div>
			<?php endforeach; ?>
		</div>

		<!-- Outputs -->
		<div class="roi-outputs">

			<div class="hero-result">
				<div class="hero-amount" id="out-monthly">R0</div>
				<div class="hero-label"><?php esc_html_e( 'Your Monthly Savings', 'doqix-roi-calculator' ); ?></div>
			</div>

			<div class="result-cards">
				<div class="result-card">
					<div class="card-value" id="out-annual">R0</div>
					<div class="card-label"><?php esc_html_e( 'per year', 'doqix-roi-calculator' ); ?></div>
				</div>
				<div class="result-card">
					<div class="card-value" id="out-roi-pct">0%</div>
					<div class="card-label"><?php esc_html_e( 'return on investment', 'doqix-roi-calculator' ); ?></div>
				</div>
				<div class="result-card">
					<div class="card-value" id="out-hours-month">0 hrs</div>
					<div class="card-label"><?php esc_html_e( 'back per month', 'doqix-roi-calculator' ); ?></div>
				</div>
				<div class="result-card">
					<div class="card-value" id="out-hours-year">0 hrs</div>
					<div class="card-label"><?php esc_html_e( 'back per year', 'doqix-roi-calculator' ); ?></div>
				</div>
				<div class="result-card tier-suggestion">
					<div class="tier-text" id="out-tier"></div>
				</div>
			</div>

			<div class="benchmark" id="out-benchmark"></div>

			<?php if ( ! isset( $preset['cta_enabled'] ) || ! empty( $preset['cta_enabled'] ) ) : ?>
			<a href="<?php echo esc_url( $preset['cta_url'] ); ?>" class="roi-cta">
				<?php echo esc_html( $preset['cta_text'] ); ?>
				<span class="cta-sub"><?php echo esc_html( $preset['cta_subtext'] ); ?></span>
			</a>
			<?php endif; ?>

			<?php if ( ! empty( $preset['share_enabled'] ) ) : ?>
			<button type="button" class="share-btn" id="btn-share"><?php esc_html_e( 'Share Your Results', 'doqix-roi-calculator' ); ?></button>
			<?php endif; ?>

		</div>

	</div>

	<?php if ( ! empty( $preset['footnote_text'] ) ) : ?>
	<p class="roi-footnote"><?php echo wp_kses_post( $preset['footnote_text'] ); ?></p>
	<?php endif; ?>
</section>
		<?php
		return ob_get_clean();
	}

	/* ────────────────────────────────────────────
	 * Helper
	 * ──────────────────────────────────────────── */

	private function get_settings() {
		return $this->deep_parse_args(
			get_option( DOQIX_ROI_V2_OPTION_KEY, array() ),
			doqix_roi_v2_get_defaults()
		);
	}

	private function deep_parse_args( $args, $defaults ) {
		if ( ! is_array( $args ) ) {
			return $defaults;
		}

		$result = $defaults;

		foreach ( $defaults as $key => $default_value ) {
			if ( array_key_exists( $key, $args ) ) {
				if ( is_array( $default_value ) && is_array( $args[ $key ] ) ) {
					if ( isset( $default_value[0] ) ) {
						$result[ $key ] = $args[ $key ];
					} else {
						$result[ $key ] = $this->deep_parse_args( $args[ $key ], $default_value );
					}
				} else {
					$result[ $key ] = $args[ $key ];
				}
			}
		}

		/* For presets: include saved presets that are not in defaults */
		if ( isset( $args['presets'] ) && is_array( $args['presets'] ) ) {
			foreach ( $args['presets'] as $slug => $saved_preset ) {
				if ( ! isset( $result['presets'][ $slug ] ) ) {
					$result['presets'][ $slug ] = wp_parse_args( $saved_preset, doqix_roi_v2_get_preset_defaults() );
				}
			}
		}

		return $result;
	}

	/* ────────────────────────────────────────────
	 * Detect active theme's accent/link color
	 * ──────────────────────────────────────────── */

	private static function get_theme_accent_color() {
		/* Themify framework: accent stored as separate options (themify_setting-KEY) */
		$themify_keys = array( 'styling-link_color', 'styling-accent_color' );
		foreach ( $themify_keys as $key ) {
			$val = get_option( 'themify_setting-' . $key, '' );
			if ( ! empty( $val ) ) {
				if ( strpos( $val, '#' ) !== 0 ) {
					$val = '#' . $val;
				}
				$color = sanitize_hex_color( $val );
				if ( $color ) {
					return $color;
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
					$color = sanitize_hex_color( $val );
					if ( $color ) {
						return $color;
					}
				}
			}
		}

		/* Standard WP theme mods */
		foreach ( array( 'link_color', 'accent_color', 'primary_color' ) as $mod_key ) {
			$color = get_theme_mod( $mod_key, '' );
			if ( $color ) {
				$color = sanitize_hex_color( $color );
				if ( $color ) {
					return $color;
				}
			}
		}

		/* Fallback: no theme color detected -> let CSS handle it */
		return '';
	}
}
