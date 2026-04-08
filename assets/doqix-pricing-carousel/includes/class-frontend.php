<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_Pricing_Frontend {

	/**
	 * Guard against double-enqueue.
	 *
	 * @var bool
	 */
	private $enqueue = false;

	/**
	 * Constructor — register shortcode and conditional asset loading.
	 */
	public function __construct() {
		add_shortcode( 'doqix_pricing', array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue_assets' ) );
	}

	/* ─── Asset Loading ─── */

	/**
	 * Conditionally enqueue assets only on pages that contain the shortcode.
	 */
	public function maybe_enqueue_assets() {
		if ( ! is_singular() ) {
			return;
		}

		$post = get_queried_object();
		if ( ! $post || empty( $post->post_content ) ) {
			return;
		}

		$found = has_shortcode( $post->post_content, 'doqix_pricing' );

		/* Themify Builder fallback — shortcode may live inside builder JSON. */
		if ( ! $found ) {
			$builder_json = get_post_meta( $post->ID, '_themify_builder_settings_json', true );
			if ( ! empty( $builder_json ) && is_string( $builder_json ) && strpos( $builder_json, 'doqix_pricing' ) !== false ) {
				$found = true;
			}
		}

		if ( $found ) {
			$this->do_enqueue();
		}
	}

	/**
	 * Register and enqueue frontend CSS/JS.
	 *
	 * @param array|null $preset  Resolved preset settings (optional).
	 * @param array|null $all     Full plugin settings (optional).
	 */
	private function do_enqueue( $preset = null, $all = null ) {
		if ( $this->enqueue ) {
			return;
		}
		$this->enqueue = true;

		if ( null === $all ) {
			$all = get_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );
		}

		wp_enqueue_style(
			'doqix-pricing-frontend',
			DOQIX_PRICING_PLUGIN_URL . 'assets/css/frontend.css',
			array(),
			DOQIX_PRICING_VERSION
		);

		wp_enqueue_script(
			'doqix-pricing-frontend',
			DOQIX_PRICING_PLUGIN_URL . 'assets/js/frontend.js',
			array(),
			DOQIX_PRICING_VERSION,
			true
		);
	}

	/* ─── Shortcode Rendering ─── */

	/**
	 * Render the [doqix_pricing] shortcode.
	 *
	 * @param  array|string $atts Shortcode attributes.
	 * @return string             HTML output.
	 */
	public function render_shortcode( $atts ) {
		$atts = shortcode_atts( array( 'preset' => 'default' ), $atts, 'doqix_pricing' );

		$all       = get_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );
		$defaults  = doqix_pricing_get_defaults();
		$preset_key = sanitize_key( $atts['preset'] );

		/* Resolve preset — fall back to default. */
		if ( isset( $all['presets'][ $preset_key ] ) ) {
			$preset = wp_parse_args( $all['presets'][ $preset_key ], doqix_pricing_get_preset_defaults() );
		} elseif ( isset( $all['presets']['default'] ) ) {
			$preset = wp_parse_args( $all['presets']['default'], doqix_pricing_get_preset_defaults() );
		} else {
			$preset = doqix_pricing_get_preset_defaults();
		}

		$global = isset( $all['global'] ) ? wp_parse_args( $all['global'], $defaults['global'] ) : $defaults['global'];

		/* Enqueue assets. */
		$this->do_enqueue( $preset, $all );

		/* Theme accent colour. */
		$theme_accent = doqix_pricing_get_theme_accent_color();

		/* Cards — sort by sort_order. */
		$cards = isset( $preset['cards'] ) && is_array( $preset['cards'] ) ? $preset['cards'] : array();
		usort( $cards, function ( $a, $b ) {
			return intval( $a['sort_order'] ?? 0 ) - intval( $b['sort_order'] ?? 0 );
		} );

		$card_defaults  = doqix_pricing_get_card_defaults();
		$currency       = $global['currency_symbol'];

		/* Build card name list for JS. */
		$card_names = array();
		foreach ( $cards as $card ) {
			$card_names[] = ! empty( $card['name'] ) ? $card['name'] : '';
		}

		/* ── JS Config ── */
		$config = array(
			'displayDesktop' => $preset['display_desktop'],
			'displayMobile'  => $preset['display_mobile'],
			'breakpoint'     => intval( $preset['mobile_breakpoint'] ),
			'navStyle'       => $preset['nav_style'],
			'activeScale'    => floatval( $preset['active_scale'] ),
			'autoplay'       => intval( $preset['autoplay'] ),
			'autoplaySpeed'  => intval( $preset['autoplay_speed'] ),
			'loop'           => intval( $preset['loop'] ?? 0 ),
			'billingToggle'  => intval( $preset['billing_toggle'] ),
			'monthlyLabel'   => $preset['monthly_label'],
			'annualLabel'    => $preset['annual_label'],
			'annualDiscount' => intval( $preset['annual_discount'] ),
			'cardNames'      => $card_names,
			'currencySymbol' => $currency,
		);

		wp_localize_script( 'doqix-pricing-frontend', 'doqixPricingConfig', $config );

		/* ── Inline CSS Variables (wrapper) ── */
		$colour_map = array(
			'color_accent'      => '--pricing-accent',
			'color_header_bg'   => '--pricing-header-bg',
			'color_header_text' => '--pricing-header-text',
			'color_card_bg'     => '--pricing-card-bg',
			'color_cta_bg'         => '--pricing-cta-bg',
			'color_cta_text'       => '--pricing-cta-text',
			'color_cta_hover_bg'   => '--pricing-cta-hover-bg',
			'color_cta_hover_text' => '--pricing-cta-hover-text',
			'color_arrow_bg'       => '--pricing-arrow-bg',
			'color_arrow_color'    => '--pricing-arrow-color',
			'color_arrow_hover_bg' => '--pricing-arrow-hover-bg',
			'color_badge_bg'    => '--pricing-badge-bg',
			'color_badge_text'  => '--pricing-badge-text',
			'color_feat_text'   => '--pricing-feat-text',
			'color_feat_check'  => '--pricing-feat-check',
			'color_exc_text'    => '--pricing-exc-text',
			'color_exc_title'   => '--pricing-exc-title',
		);

		$wrapper_vars = array();
		foreach ( $colour_map as $key => $var ) {
			$val = ! empty( $preset[ $key ] ) ? $preset[ $key ] : '';
			/* Fall back to theme accent for --pricing-accent. */
			if ( '' === $val && 'color_accent' === $key && '' !== $theme_accent ) {
				$val = $theme_accent;
			}
			if ( '' !== $val ) {
				$wrapper_vars[] = esc_attr( $var ) . ':' . esc_attr( $val );
			}
		}

		/* Active scale as CSS variable. */
		$wrapper_vars[] = '--pricing-active-scale:' . esc_attr( $preset['active_scale'] );

		$wrapper_style = implode( ';', $wrapper_vars );

		/* ── Build HTML ── */
		ob_start();
		?>
<div class="doqix-pricing" id="doqix-pricing"
	style="<?php echo $wrapper_style; ?>"
	data-display-desktop="<?php echo esc_attr( $preset['display_desktop'] ); ?>"
	data-display-mobile="<?php echo esc_attr( $preset['display_mobile'] ); ?>"
	data-breakpoint="<?php echo esc_attr( intval( $preset['mobile_breakpoint'] ) ); ?>">

<?php if ( ! empty( $preset['billing_toggle'] ) ) : ?>
	<div class="doqix-pricing-billing-toggle">
		<span class="doqix-billing-label doqix-billing-active"><?php echo esc_html( $preset['monthly_label'] ); ?></span>
		<div class="doqix-billing-switch" data-discount="<?php echo esc_attr( intval( $preset['annual_discount'] ) ); ?>">
			<div class="doqix-billing-thumb"></div>
		</div>
		<span class="doqix-billing-label"><?php echo esc_html( $preset['annual_label'] ); ?> (save <?php echo esc_html( intval( $preset['annual_discount'] ) ); ?>%)</span>
	</div>
<?php endif; ?>

	<div class="doqix-pricing-track">
<?php
		foreach ( $cards as $index => $card ) :
			$card = wp_parse_args( $card, $card_defaults );

			/* Per-card colour overrides. */
			$card_colour_map = array(
				'color_header_bg'   => '--pricing-header-bg',
				'color_header_text' => '--pricing-header-text',
				'color_cta_bg'      => '--pricing-cta-bg',
				'color_cta_text'    => '--pricing-cta-text',
				'color_badge_bg'    => '--pricing-badge-bg',
				'color_badge_text'  => '--pricing-badge-text',
				'color_card_bg'     => '--pricing-card-bg',
				'color_feat_text'   => '--pricing-feat-text',
				'color_feat_check'  => '--pricing-feat-check',
				'color_exc_text'    => '--pricing-exc-text',
			);

			$card_vars = array();
			foreach ( $card_colour_map as $ckey => $cvar ) {
				if ( ! empty( $card[ $ckey ] ) ) {
					$card_vars[] = esc_attr( $cvar ) . ':' . esc_attr( $card[ $ckey ] );
				}
			}
			$card_style = ! empty( $card_vars ) ? implode( ';', $card_vars ) : '';

			/* Card classes. */
			$card_classes = 'doqix-pricing-card';
			if ( ! empty( $card['featured'] ) ) {
				$card_classes .= ' doqix-featured';
			}

			/* Price formatting. */
			$price_display = $this->format_price( $card['price'], $currency );
			$price_annual_raw = isset( $card['price_annual'] ) ? $card['price_annual'] : '';
			$price_annual_numeric = $this->extract_numeric_price( $price_annual_raw );
			$price_numeric        = $this->extract_numeric_price( $card['price'] );
			?>
		<div class="<?php echo esc_attr( $card_classes ); ?>"
			data-index="<?php echo esc_attr( $index ); ?>"
			data-price="<?php echo esc_attr( $price_numeric ); ?>"
			data-price-annual="<?php echo esc_attr( $price_annual_numeric ); ?>"
			<?php if ( '' !== $card_style ) : ?>style="<?php echo $card_style; ?>"<?php endif; ?>>

<?php if ( ! empty( $card['badge'] ) ) : ?>
			<div class="doqix-pricing-badge"><?php echo esc_html( $card['badge'] ); ?></div>
<?php endif; ?>

			<div class="doqix-pricing-header">
				<div class="doqix-pricing-name"><?php echo esc_html( $card['name'] ); ?></div>
				<div class="doqix-pricing-sub"><?php echo esc_html( $card['subtitle'] ); ?></div>
				<div class="doqix-pricing-price">
					<span class="doqix-price-value"><?php echo esc_html( $price_display ); ?></span><?php if ( ! empty( $card['price_suffix'] ) ) : ?><span class="doqix-price-suffix"><?php echo esc_html( $card['price_suffix'] ); ?></span><?php endif; ?>
				</div>
<?php if ( ! empty( $card['setup_fee'] ) ) : ?>
				<div class="doqix-pricing-setup"><?php echo esc_html( $card['setup_fee'] ); ?></div>
<?php endif; ?>
			</div>

			<div class="doqix-pricing-body">
<?php if ( ! empty( $card['savings'] ) ) : ?>
				<div class="doqix-pricing-savings"><?php echo esc_html( $card['savings'] ); ?></div>
<?php endif; ?>
<?php if ( ! empty( $card['features'] ) ) : ?>
				<div class="doqix-pricing-features">
					<?php echo $this->html_to_divs( $card['features'], 'doqix-pricing-feat' ); ?>
				</div>
<?php endif; ?>
<?php if ( ! empty( $card['description'] ) ) : ?>
				<div class="doqix-pricing-description"><?php echo wp_kses_post( $card['description'] ); ?></div>
<?php endif; ?>
<?php if ( ! empty( $card['excludes'] ) ) : ?>
				<div class="doqix-pricing-excludes">
					<div class="doqix-pricing-exc-title">Excludes:</div>
					<?php echo $this->html_to_divs( $card['excludes'], 'doqix-pricing-exc-item' ); ?>
				</div>
<?php endif; ?>
			</div>

			<?php
				$cta_url = $card['cta_url'];
				if ( ! empty( $card['name'] ) ) {
					$cta_url = add_query_arg( 'plan', sanitize_title( $card['name'] ), $cta_url );
				}
			?>
			<a class="doqix-pricing-cta" href="<?php echo esc_url( $cta_url ); ?>" data-plan="<?php echo esc_attr( $card['name'] ); ?>"><?php echo esc_html( $card['cta_label'] ); ?></a>
		</div>
<?php endforeach; ?>
	</div>

	<div class="doqix-pricing-nav"></div>
</div>
		<?php
		return ob_get_clean();
	}

	/* ─── Price Helpers ─── */

	/**
	 * Format a price value for display.
	 *
	 * If numeric, prepend currency symbol and format with number_format.
	 * Otherwise return as-is (e.g. "Custom").
	 *
	 * @param  string $price    Raw price value.
	 * @param  string $currency Currency symbol.
	 * @return string
	 */
	private function format_price( $price, $currency ) {
		/* Strip currency symbol and commas to test if numeric. */
		$cleaned = str_replace( array( $currency, ',', ' ' ), '', $price );

		if ( is_numeric( $cleaned ) ) {
			return $currency . number_format( floatval( $cleaned ), 0, '.', ',' );
		}

		return $price;
	}

	/**
	 * Extract a numeric price for data attributes.
	 *
	 * @param  string $price Raw price string.
	 * @return string        Numeric string or empty.
	 */
	private function extract_numeric_price( $price ) {
		$cleaned = preg_replace( '/[^0-9.]/', '', $price );
		return is_numeric( $cleaned ) ? $cleaned : '';
	}

	/**
	 * Convert HTML (ul/li, p tags, or plain text) into flat div elements.
	 *
	 * Strips <ul>, <ol>, <li>, <p> wrappers and outputs one <div> per item.
	 * This avoids theme CSS overriding list styles.
	 *
	 * @param  string $html  Raw HTML content.
	 * @param  string $class CSS class for each div.
	 * @return string        Cleaned HTML with divs.
	 */
	private function html_to_divs( $html, $class ) {
		$items = array();

		/* Try <li> items first */
		if ( preg_match_all( '/<li[^>]*>(.*?)<\/li>/si', $html, $matches ) ) {
			$items = $matches[1];
		}
		/* Try <p> items */
		elseif ( preg_match_all( '/<p[^>]*>(.*?)<\/p>/si', $html, $matches ) ) {
			$items = $matches[1];
		}
		/* Plain text — split by newlines */
		else {
			$items = array_filter( array_map( 'trim', preg_split( '/\r?\n/', wp_strip_all_tags( $html ) ) ) );
		}

		$out = '';
		foreach ( $items as $item ) {
			$text = trim( wp_strip_all_tags( $item ) );
			if ( '' !== $text ) {
				$out .= '<div class="' . esc_attr( $class ) . '">' . esc_html( $text ) . '</div>';
			}
		}
		return $out;
	}
}
