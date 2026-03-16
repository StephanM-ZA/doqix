<?php
/**
 * Frontend: shortcode rendering and conditional asset enqueue.
 * Workflow Advisor — service selection, matching, and results display.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_WFA_Frontend {

	/** @var bool Whether the shortcode was found on the current page. */
	private $enqueue = false;

	public function __construct() {
		add_shortcode( 'doqix_workflow_advisor', array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue_assets' ) );
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

		$found = has_shortcode( $post->post_content, 'doqix_workflow_advisor' );

		/* Themify Builder fallback: builder modules are stored in post meta,
		   not in post_content, so has_shortcode() misses them. */
		if ( ! $found ) {
			$builder_meta = get_post_meta( $post->ID, '_themify_builder_settings_json', true );
			if ( $builder_meta && is_string( $builder_meta ) && strpos( $builder_meta, 'doqix_workflow_advisor' ) !== false ) {
				$found = true;
			}
		}

		if ( ! $found ) {
			return;
		}

		$this->do_enqueue();
	}

	/**
	 * Build the config array passed to JS.
	 */
	private function build_config() {
		$s = $this->get_settings();

		return array(
			'categories'        => $s['categories'],
			'services'          => $s['services'],
			'workflows'         => $s['workflows'],
			'color_accent'      => $s['color_accent'],
			'color_cta'         => $s['color_cta'],
			'cta_url'           => $s['cta_url'],
			'cta_text'          => $s['cta_text'],
			'cta_subtext'       => $s['cta_subtext'],
			'lead_form_enabled' => $s['lead_form_enabled'],
			'lead_form_heading' => $s['lead_form_heading'],
			'disclaimer_text'   => $s['disclaimer_text'],
		);
	}

	/**
	 * Enqueue assets and localize config.
	 */
	private function do_enqueue() {
		if ( $this->enqueue ) {
			return;
		}

		$this->enqueue = true;

		wp_enqueue_style(
			'doqix-wfa-frontend',
			DOQIX_WFA_PLUGIN_URL . 'assets/css/doqix-wfa-frontend.css',
			array(),
			DOQIX_WFA_VERSION
		);

		wp_enqueue_script(
			'doqix-wfa-frontend',
			DOQIX_WFA_PLUGIN_URL . 'assets/js/doqix-wfa-frontend.js',
			array(),
			DOQIX_WFA_VERSION,
			true
		);

		wp_localize_script( 'doqix-wfa-frontend', 'doqixWfaConfig', $this->build_config() );
	}

	/**
	 * Render [doqix_workflow_advisor] shortcode.
	 *
	 * @return string HTML output.
	 */
	public function render_shortcode( $atts ) {
		$this->do_enqueue();

		$s = $this->get_settings();

		/* Resolve colors: admin override → theme color → CSS fallback */
		$theme_color = self::get_theme_accent_color();
		$accent      = ! empty( $s['color_accent'] ) ? $s['color_accent'] : $theme_color;
		$cta         = ! empty( $s['color_cta'] )    ? $s['color_cta']    : $theme_color;

		$inline_vars = '';
		if ( $accent ) {
			$inline_vars .= '--wfa-accent:' . esc_attr( $accent ) . ';';
		}
		if ( $cta ) {
			$inline_vars .= '--wfa-action:' . esc_attr( $cta ) . ';';
		}

		/* Build category list for filter tabs */
		$categories = $s['categories'];
		$services   = $s['services'];

		ob_start();
		?>
<section class="doqix-wfa" id="workflow-advisor"<?php if ( $inline_vars ) echo ' style="' . $inline_vars . '"'; ?>>

	<!-- Step 1: Service Selection -->
	<div class="wfa-step wfa-step-select" id="wfa-step-select">
		<h2><?php esc_html_e( 'Select Your Business Tools', 'doqix-workflow-advisor' ); ?></h2>
		<p class="wfa-intro"><?php esc_html_e( 'Choose the tools you already use and we\'ll show you which workflows can be automated.', 'doqix-workflow-advisor' ); ?></p>

		<!-- Category filter tabs -->
		<div class="wfa-filter-tabs" id="wfa-filter-tabs">
			<button type="button" class="wfa-tab wfa-tab-active" data-category="all"><?php esc_html_e( 'All', 'doqix-workflow-advisor' ); ?></button>
			<?php foreach ( $categories as $cat ) : ?>
			<button type="button" class="wfa-tab" data-category="<?php echo esc_attr( $cat['key'] ); ?>"><?php echo esc_html( $cat['name'] ); ?></button>
			<?php endforeach; ?>
		</div>

		<!-- Selected tools chip bar -->
		<div class="wfa-selected-bar" id="wfa-selected-bar" style="display:none;"></div>

		<!-- Service cards grid -->
		<div class="wfa-services-grid" id="wfa-services-grid">
			<?php foreach ( $services as $svc ) :
				$initial = mb_strtoupper( mb_substr( $svc['name'], 0, 1 ) );
			?>
			<button type="button" class="wfa-service-card" data-service="<?php echo esc_attr( $svc['key'] ); ?>" data-category="<?php echo esc_attr( $svc['category'] ); ?>">
				<span class="wfa-service-initial"><?php echo esc_html( $initial ); ?></span>
				<span class="wfa-service-name"><?php echo esc_html( $svc['name'] ); ?></span>
			</button>
			<?php endforeach; ?>
		</div>

		<!-- Footer bar -->
		<div class="wfa-footer-bar" id="wfa-footer-bar">
			<span class="wfa-selected-count" id="wfa-selected-count">0 tools selected</span>
			<button type="button" class="wfa-show-btn" id="wfa-show-btn" disabled><?php esc_html_e( 'Show My Workflows', 'doqix-workflow-advisor' ); ?></button>
		</div>
	</div>

	<!-- Step 2: Results (hidden until button click) -->
	<div class="wfa-step wfa-step-results" id="wfa-step-results" style="display:none;">
		<h2><?php esc_html_e( 'Your Top Workflow Matches', 'doqix-workflow-advisor' ); ?></h2>
		<div class="wfa-results-grid" id="wfa-results-grid">
			<!-- Populated by JS -->
		</div>
		<div class="wfa-no-results" id="wfa-no-results" style="display:none;">
			<p><?php esc_html_e( 'No matching workflows found. Try selecting more tools above.', 'doqix-workflow-advisor' ); ?></p>
		</div>
	</div>

	<!-- Step 3: CTA -->
	<div class="wfa-step wfa-step-cta" id="wfa-step-cta" style="display:none;">
		<?php if ( ! empty( $s['lead_form_enabled'] ) ) : ?>
		<!-- Lead form -->
		<div class="wfa-lead-form" id="wfa-lead-form">
			<h3><?php echo esc_html( $s['lead_form_heading'] ); ?></h3>
			<div class="wfa-form-fields">
				<input type="text" class="wfa-input" id="wfa-lead-name" placeholder="<?php esc_attr_e( 'Your name', 'doqix-workflow-advisor' ); ?>" required>
				<input type="email" class="wfa-input" id="wfa-lead-email" placeholder="<?php esc_attr_e( 'Email address', 'doqix-workflow-advisor' ); ?>" required>
				<input type="tel" class="wfa-input" id="wfa-lead-phone" placeholder="<?php esc_attr_e( 'Phone number', 'doqix-workflow-advisor' ); ?>">
			</div>
			<a href="<?php echo esc_url( $s['cta_url'] ); ?>" class="wfa-cta" id="wfa-cta-submit">
				<?php echo esc_html( $s['cta_text'] ); ?>
				<span class="wfa-cta-sub"><?php echo esc_html( $s['cta_subtext'] ); ?></span>
			</a>
		</div>
		<?php else : ?>
		<!-- Direct CTA -->
		<a href="<?php echo esc_url( $s['cta_url'] ); ?>" class="wfa-cta" id="wfa-cta-link">
			<?php echo esc_html( $s['cta_text'] ); ?>
			<span class="wfa-cta-sub"><?php echo esc_html( $s['cta_subtext'] ); ?></span>
		</a>
		<?php endif; ?>
	</div>

	<!-- Step 4: Disclaimer -->
	<?php if ( ! empty( $s['disclaimer_text'] ) ) : ?>
	<p class="wfa-disclaimer" id="wfa-disclaimer" style="display:none;"><?php echo esc_html( $s['disclaimer_text'] ); ?></p>
	<?php endif; ?>

</section>
		<?php
		return ob_get_clean();
	}

	/* ────────────────────────────────────────────
	 * Helpers
	 * ──────────────────────────────────────────── */

	private function get_settings() {
		return $this->deep_parse_args(
			get_option( DOQIX_WFA_OPTION_KEY, array() ),
			doqix_wfa_get_defaults()
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

		return $result;
	}

	private static function get_theme_accent_color() {
		/* Themify themes: accent stored in themify_setting option */
		$themify = get_option( 'themify_setting', array() );
		if ( is_array( $themify ) ) {
			foreach ( array( 'styling-link_color', 'styling-accent_color' ) as $tf_key ) {
				if ( ! empty( $themify[ $tf_key ] ) ) {
					$color = $themify[ $tf_key ];
					if ( strpos( $color, '#' ) !== 0 ) {
						$color = '#' . $color;
					}
					$color = sanitize_hex_color( $color );
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
