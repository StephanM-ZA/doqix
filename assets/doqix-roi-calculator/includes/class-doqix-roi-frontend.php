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

		/* Pass tier config + share URL to JS */
		$settings = wp_parse_args(
			get_option( DOQIX_ROI_OPTION_KEY, array() ),
			doqix_roi_get_defaults()
		);

		wp_localize_script( 'doqix-roi-calculator', 'doqixRoiConfig', array(
			'tier_1_name'  => $settings['tier_1_name'],
			'tier_1_price' => $settings['tier_1_price'],
			'tier_2_name'  => $settings['tier_2_name'],
			'tier_2_price' => $settings['tier_2_price'],
			'tier_3_name'  => $settings['tier_3_name'],
			'tier_3_price' => $settings['tier_3_price'],
			'tier_4_name'  => $settings['tier_4_name'],
			'tier_4_price' => $settings['tier_4_price'],
			'share_url'    => $settings['share_url'],
		) );
	}

	/**
	 * Render [doqix_roi_calculator] shortcode.
	 *
	 * @return string HTML output.
	 */
	public function render_shortcode( $atts ) {
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

			$settings = wp_parse_args(
				get_option( DOQIX_ROI_OPTION_KEY, array() ),
				doqix_roi_get_defaults()
			);

			wp_localize_script( 'doqix-roi-calculator', 'doqixRoiConfig', array(
				'tier_1_name'  => $settings['tier_1_name'],
				'tier_1_price' => $settings['tier_1_price'],
				'tier_2_name'  => $settings['tier_2_name'],
				'tier_2_price' => $settings['tier_2_price'],
				'tier_3_name'  => $settings['tier_3_name'],
				'tier_3_price' => $settings['tier_3_price'],
				'tier_4_name'  => $settings['tier_4_name'],
				'tier_4_price' => $settings['tier_4_price'],
				'share_url'    => $settings['share_url'],
			) );

			$this->enqueue = true;
		}

		$s = wp_parse_args(
			get_option( DOQIX_ROI_OPTION_KEY, array() ),
			doqix_roi_get_defaults()
		);

		ob_start();
		?>
<section class="doqix-roi" id="roi-calculator">

	<h2><?php esc_html_e( 'See What You Could Save', 'doqix-roi-calculator' ); ?></h2>
	<p class="section-intro"><?php esc_html_e( 'SA businesses waste 20–30 hours per week on tasks that could run themselves. Drag the sliders to see what automation would mean for yours.', 'doqix-roi-calculator' ); ?></p>

	<div class="roi-grid">

		<!-- Inputs -->
		<div class="roi-inputs">
			<div class="panel-label"><?php esc_html_e( 'Your Team', 'doqix-roi-calculator' ); ?></div>

			<!-- People -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'People doing repetitive tasks', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'How many staff spend time on repetitive, rule-based work?', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-people"><?php echo esc_html( $s['people_default'] ); ?></span>
				</div>
				<input type="range" id="slider-people" min="<?php echo esc_attr( $s['people_min'] ); ?>" max="<?php echo esc_attr( $s['people_max'] ); ?>" value="<?php echo esc_attr( $s['people_default'] ); ?>" step="<?php echo esc_attr( $s['people_step'] ); ?>">
				<div class="slider-range-labels"><span><?php echo esc_html( $s['people_min'] ); ?></span><span><?php echo esc_html( $s['people_max'] ); ?></span></div>
			</div>

			<!-- Hours -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Hours per person per week', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'How many hours does each person spend on repetitive tasks every week? Think data entry, copy-pasting, manual emails, reporting.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-hours"><?php echo esc_html( $s['hours_default'] ); ?></span>
				</div>
				<input type="range" id="slider-hours" min="<?php echo esc_attr( $s['hours_min'] ); ?>" max="<?php echo esc_attr( $s['hours_max'] ); ?>" value="<?php echo esc_attr( $s['hours_default'] ); ?>" step="<?php echo esc_attr( $s['hours_step'] ); ?>">
				<div class="slider-range-labels"><span><?php echo esc_html( $s['hours_min'] ); ?> hr</span><span><?php echo esc_html( $s['hours_max'] ); ?> hrs</span></div>
				<div class="total-hours" id="out-total-hours">= <?php echo esc_html( $s['people_default'] * $s['hours_default'] ); ?> hrs/week across your team</div>
			</div>

			<!-- Rate -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Average hourly cost', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'What you pay per hour per person — include salary, benefits, and overheads.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-rate">R<?php echo esc_html( $s['rate_default'] ); ?></span>
				</div>
				<input type="range" id="slider-rate" min="<?php echo esc_attr( $s['rate_min'] ); ?>" max="<?php echo esc_attr( $s['rate_max'] ); ?>" value="<?php echo esc_attr( $s['rate_default'] ); ?>" step="<?php echo esc_attr( $s['rate_step'] ); ?>">
				<div class="slider-range-labels"><span>R<?php echo esc_html( number_format( $s['rate_min'] ) ); ?></span><span>R<?php echo esc_html( number_format( $s['rate_max'] ) ); ?></span></div>
			</div>

			<!-- Efficiency -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Automation efficiency', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'What percentage of those manual hours can realistically be automated. 70% is a conservative starting point.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-efficiency"><?php echo esc_html( $s['efficiency_default'] ); ?>%</span>
				</div>
				<input type="range" id="slider-efficiency" min="<?php echo esc_attr( $s['efficiency_min'] ); ?>" max="<?php echo esc_attr( $s['efficiency_max'] ); ?>" value="<?php echo esc_attr( $s['efficiency_default'] ); ?>" step="<?php echo esc_attr( $s['efficiency_step'] ); ?>">
				<div class="slider-range-labels"><span><?php echo esc_html( $s['efficiency_min'] ); ?>%</span><span><?php echo esc_html( $s['efficiency_max'] ); ?>%</span></div>
				<div class="efficiency-note" id="out-efficiency-note" style="display:none;"></div>
			</div>

			<!-- Error cost -->
			<div class="slider-group">
				<div class="slider-header">
					<span class="slider-label"><?php esc_html_e( 'Monthly error cost', 'doqix-roi-calculator' ); ?><span class="tooltip"><?php esc_html_e( 'What do manual mistakes cost you each month? Think re-work, wrong invoices, missed follow-ups.', 'doqix-roi-calculator' ); ?></span></span>
					<span class="slider-value" id="val-error">R<?php echo esc_html( number_format( $s['error_default'] ) ); ?></span>
				</div>
				<input type="range" id="slider-error" min="<?php echo esc_attr( $s['error_min'] ); ?>" max="<?php echo esc_attr( $s['error_max'] ); ?>" value="<?php echo esc_attr( $s['error_default'] ); ?>" step="<?php echo esc_attr( $s['error_step'] ); ?>">
				<div class="slider-range-labels"><span>R<?php echo esc_html( number_format( $s['error_min'] ) ); ?></span><span>R<?php echo esc_html( number_format( $s['error_max'] ) ); ?></span></div>
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

			<a href="<?php echo esc_url( $s['cta_url'] ); ?>" class="roi-cta">
				<?php echo esc_html( $s['cta_text'] ); ?>
				<span class="cta-sub"><?php echo esc_html( $s['cta_subtext'] ); ?></span>
			</a>

			<?php if ( ! empty( $s['share_enabled'] ) ) : ?>
			<button type="button" class="share-btn" id="btn-share"><?php esc_html_e( 'Share Your Results', 'doqix-roi-calculator' ); ?></button>
			<?php endif; ?>

			<?php if ( ! empty( $s['popia_note'] ) ) : ?>
			<p class="popia-note"><?php echo esc_html( $s['popia_note'] ); ?></p>
			<?php endif; ?>
		</div>

	</div>
</section>
		<?php
		return ob_get_clean();
	}
}
