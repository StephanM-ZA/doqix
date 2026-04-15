<?php
/**
 * Frontend: shortcode rendering and conditional asset enqueue.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_ROI_Frontend {

	/** @var bool Whether the shortcode was found on the current page. */
	private $enqueue = false;

	public function __construct() {
		add_shortcode( 'doqix_roi_calculator', array( $this, 'render_shortcode' ) );
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

		$found = has_shortcode( $post->post_content, 'doqix_roi_calculator' );
		if ( ! $found ) {
			$builder_meta = get_post_meta( $post->ID, '_themify_builder_settings_json', true );
			if ( $builder_meta && is_string( $builder_meta ) && strpos( $builder_meta, 'doqix_roi_calculator' ) !== false ) {
				$found = true;
			}
		}

		if ( ! $found ) {
			return;
		}

		/* Resolve preset — use default if shortcode atts can't be parsed early */
		$all     = wp_parse_args( get_option( DOQIX_ROI_OPTION_KEY, array() ), doqix_roi_get_defaults() );
		$presets = isset( $all['presets'] ) ? $all['presets'] : array();
		$preset  = isset( $presets['default'] ) ? $presets['default'] : doqix_roi_get_preset_defaults();
		$preset  = wp_parse_args( $preset, doqix_roi_get_preset_defaults() );

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

		$found = has_shortcode( $post->post_content, 'doqix_roi_calculator' );

		/* Themify Builder fallback: builder modules are stored in post meta,
		   not in post_content, so has_shortcode() misses them. */
		if ( ! $found ) {
			$builder_meta = get_post_meta( $post->ID, '_themify_builder_settings_json', true );
			if ( $builder_meta && is_string( $builder_meta ) && strpos( $builder_meta, 'doqix_roi_calculator' ) !== false ) {
				$found = true;
			}
		}

		if ( ! $found ) {
			return;
		}

		$this->enqueue = true;

		/* CSS in <head> */
		wp_enqueue_style(
			'doqix-roi-calculator',
			DOQIX_ROI_PLUGIN_URL . 'assets/css/doqix-roi-calculator.css',
			array(),
			DOQIX_ROI_VERSION
		);

		/* JS in footer — no jQuery dependency */
		wp_enqueue_script(
			'doqix-roi-calculator',
			DOQIX_ROI_PLUGIN_URL . 'assets/js/doqix-roi-calculator.js',
			array(),
			DOQIX_ROI_VERSION,
			true
		);

		/* Pass tier config to JS — preset-specific colors are set per shortcode instance */
		$all = wp_parse_args(
			get_option( DOQIX_ROI_OPTION_KEY, array() ),
			doqix_roi_get_defaults()
		);

		/* Use default preset for the early-enqueue localize (shortcode render may override) */
		$presets = isset( $all['presets'] ) ? $all['presets'] : array();
		$preset  = isset( $presets['default'] ) ? $presets['default'] : doqix_roi_get_preset_defaults();
		$preset  = wp_parse_args( $preset, doqix_roi_get_preset_defaults() );

		wp_localize_script( 'doqix-roi-calculator', 'doqixRoiConfig', array(
			'tier_1_name'   => $all['tier_1_name'],
			'tier_1_price'  => $all['tier_1_price'],
			'tier_2_name'   => $all['tier_2_name'],
			'tier_2_price'  => $all['tier_2_price'],
			'tier_3_name'   => $all['tier_3_name'],
			'tier_3_price'  => $all['tier_3_price'],
			'tier_4_name'   => $all['tier_4_name'],
			'tier_4_price'  => $all['tier_4_price'],
			'share_url'     => $preset['share_url'],
			'color_accent'  => $preset['color_accent'],
			'color_cta'     => $preset['color_cta'],
		) );
	}

	/**
	 * Render [doqix_roi_calculator] shortcode.
	 *
	 * @return string HTML output.
	 */
	public function render_shortcode( $atts ) {
		$atts = shortcode_atts( array( 'preset' => 'default' ), $atts, 'doqix_roi_calculator' );
		$preset_slug = sanitize_key( $atts['preset'] );

		/* Load all settings and resolve the requested preset */
		$all = wp_parse_args(
			get_option( DOQIX_ROI_OPTION_KEY, array() ),
			doqix_roi_get_defaults()
		);
		$presets = isset( $all['presets'] ) ? $all['presets'] : array();
		$preset  = isset( $presets[ $preset_slug ] ) ? $presets[ $preset_slug ] : ( isset( $presets['default'] ) ? $presets['default'] : doqix_roi_get_preset_defaults() );
		$preset  = wp_parse_args( $preset, doqix_roi_get_preset_defaults() );

		/* If assets weren't enqueued via the hook (e.g. Themify late-render),
		   enqueue them now so they still appear on the page. */
		if ( ! $this->enqueue ) {
			wp_enqueue_style(
				'doqix-roi-calculator',
				DOQIX_ROI_PLUGIN_URL . 'assets/css/doqix-roi-calculator.css',
				array(),
				DOQIX_ROI_VERSION
			);
			wp_enqueue_script(
				'doqix-roi-calculator',
				DOQIX_ROI_PLUGIN_URL . 'assets/js/doqix-roi-calculator.js',
				array(),
				DOQIX_ROI_VERSION,
				true
			);

			wp_localize_script( 'doqix-roi-calculator', 'doqixRoiConfig', array(
				'tier_1_name'   => $all['tier_1_name'],
				'tier_1_price'  => $all['tier_1_price'],
				'tier_2_name'   => $all['tier_2_name'],
				'tier_2_price'  => $all['tier_2_price'],
				'tier_3_name'   => $all['tier_3_name'],
				'tier_3_price'  => $all['tier_3_price'],
				'tier_4_name'   => $all['tier_4_name'],
				'tier_4_price'  => $all['tier_4_price'],
				'share_url'     => $preset['share_url'],
				'color_accent'  => $preset['color_accent'],
				'color_cta'     => $preset['color_cta'],
			) );

			$this->enqueue = true;
		}

		/* Resolve colors: preset override → theme color → CSS fallback */
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
<section class="doqix-roi" id="roi-calculator"<?php if ( $inline_vars ) echo ' style="' . esc_attr( $inline_vars ) . '"'; ?>>

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

			<!-- People -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'People doing repetitive tasks', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'How many staff spend time on repetitive, rule-based work?', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-people"><?php echo esc_html( $all['people_default'] ); ?></span>
				</div>
				<input type="range" id="slider-people" min="<?php echo esc_attr( $all['people_min'] ); ?>" max="<?php echo esc_attr( $all['people_max'] ); ?>" value="<?php echo esc_attr( $all['people_default'] ); ?>" step="<?php echo esc_attr( $all['people_step'] ); ?>">
				<div class="slider-range-labels"><span><?php echo esc_html( $all['people_min'] ); ?></span><span><?php echo esc_html( $all['people_max'] ); ?></span></div>
			</div>

			<!-- Hours -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Hours per person per week', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'How many hours does each person spend on repetitive tasks every week? Think data entry, copy-pasting, manual emails, reporting.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-hours"><?php echo esc_html( $all['hours_default'] ); ?></span>
				</div>
				<input type="range" id="slider-hours" min="<?php echo esc_attr( $all['hours_min'] ); ?>" max="<?php echo esc_attr( $all['hours_max'] ); ?>" value="<?php echo esc_attr( $all['hours_default'] ); ?>" step="<?php echo esc_attr( $all['hours_step'] ); ?>">
				<div class="slider-range-labels"><span><?php echo esc_html( $all['hours_min'] ); ?> hr</span><span><?php echo esc_html( $all['hours_max'] ); ?> hrs</span></div>
				<div class="total-hours" id="out-total-hours">= <?php echo esc_html( $all['people_default'] * $all['hours_default'] ); ?> hrs/week across your team</div>
			</div>

			<!-- Rate -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Average hourly cost', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'What you pay per hour per person — include salary, benefits, and overheads.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-rate">R<?php echo esc_html( $all['rate_default'] ); ?></span>
				</div>
				<input type="range" id="slider-rate" min="<?php echo esc_attr( $all['rate_min'] ); ?>" max="<?php echo esc_attr( $all['rate_max'] ); ?>" value="<?php echo esc_attr( $all['rate_default'] ); ?>" step="<?php echo esc_attr( $all['rate_step'] ); ?>">
				<div class="slider-range-labels"><span>R<?php echo esc_html( number_format( $all['rate_min'] ) ); ?></span><span>R<?php echo esc_html( number_format( $all['rate_max'] ) ); ?></span></div>
			</div>

			<!-- Efficiency -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Automation efficiency', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'What percentage of those manual hours can realistically be automated. 70% is a conservative starting point.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-efficiency"><?php echo esc_html( $all['efficiency_default'] ); ?>%</span>
				</div>
				<input type="range" id="slider-efficiency" min="<?php echo esc_attr( $all['efficiency_min'] ); ?>" max="<?php echo esc_attr( $all['efficiency_max'] ); ?>" value="<?php echo esc_attr( $all['efficiency_default'] ); ?>" step="<?php echo esc_attr( $all['efficiency_step'] ); ?>">
				<div class="slider-range-labels"><span><?php echo esc_html( $all['efficiency_min'] ); ?>%</span><span><?php echo esc_html( $all['efficiency_max'] ); ?>%</span></div>
				<div class="efficiency-note" id="out-efficiency-note" style="display:none;"></div>
			</div>

			<!-- Error cost -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Monthly error cost', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'What do manual mistakes cost you each month? Think re-work, wrong invoices, missed follow-ups.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-error">R<?php echo esc_html( number_format( $all['error_default'] ) ); ?></span>
				</div>
				<input type="range" id="slider-error" min="<?php echo esc_attr( $all['error_min'] ); ?>" max="<?php echo esc_attr( $all['error_max'] ); ?>" value="<?php echo esc_attr( $all['error_default'] ); ?>" step="<?php echo esc_attr( $all['error_step'] ); ?>">
				<div class="slider-range-labels"><span>R<?php echo esc_html( number_format( $all['error_min'] ) ); ?></span><span>R<?php echo esc_html( number_format( $all['error_max'] ) ); ?></span></div>
			</div>
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

		/* Fallback: no theme color detected → let CSS handle it */
		return '';
	}
}
