<?php
/**
 * Admin: Settings page for the ROI Calculator.
 * Registers a page at Settings > ROI Calculator using the WordPress Settings API.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_ROI_Admin {

	/** @var string Settings page hook suffix. */
	private $hook = '';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_css' ) );
	}

	/* ────────────────────────────────────────────
	 * Menu
	 * ──────────────────────────────────────────── */

	public function add_settings_page() {
		$this->hook = add_options_page(
			__( 'ROI Calculator', 'doqix-roi-calculator' ),
			__( 'ROI Calculator', 'doqix-roi-calculator' ),
			'manage_options',
			'doqix-roi-calculator',
			array( $this, 'render_settings_page' )
		);
	}

	/* ────────────────────────────────────────────
	 * Admin CSS — only on our settings page
	 * ──────────────────────────────────────────── */

	public function enqueue_admin_css( $hook_suffix ) {
		if ( $hook_suffix !== $this->hook ) {
			return;
		}
		wp_enqueue_style(
			'doqix-roi-admin',
			DOQIX_ROI_PLUGIN_URL . 'assets/css/doqix-roi-admin.css',
			array(),
			DOQIX_ROI_VERSION
		);
	}

	/* ────────────────────────────────────────────
	 * Register settings (Settings API)
	 * ──────────────────────────────────────────── */

	public function register_settings() {
		register_setting(
			'doqix_roi_settings_group',
			DOQIX_ROI_OPTION_KEY,
			array( $this, 'sanitize_settings' )
		);

		/* ── Section 1: Pricing Tiers ── */
		add_settings_section(
			'doqix_roi_tiers',
			__( 'Pricing Tiers', 'doqix-roi-calculator' ),
			function () {
				echo '<p>' . esc_html__( 'Configure the four pricing tiers shown in the calculator. Tier 4 (Enterprise) uses custom pricing when the price is set to 0.', 'doqix-roi-calculator' ) . '</p>';
			},
			'doqix-roi-calculator'
		);

		for ( $i = 1; $i <= 4; $i++ ) {
			add_settings_field(
				'tier_' . $i,
				/* translators: %d is tier number */
				sprintf( __( 'Tier %d', 'doqix-roi-calculator' ), $i ),
				array( $this, 'render_tier_field' ),
				'doqix-roi-calculator',
				'doqix_roi_tiers',
				array( 'tier' => $i )
			);
		}

		/* ── Section 2: Slider Configuration ── */
		add_settings_section(
			'doqix_roi_sliders',
			__( 'Slider Configuration', 'doqix-roi-calculator' ),
			function () {
				echo '<p>' . esc_html__( 'Set the default value, minimum, maximum, and step for each slider.', 'doqix-roi-calculator' ) . '</p>';
			},
			'doqix-roi-calculator'
		);

		$sliders = array(
			'people'     => __( 'People', 'doqix-roi-calculator' ),
			'hours'      => __( 'Hours per person per week', 'doqix-roi-calculator' ),
			'rate'       => __( 'Hourly cost (R)', 'doqix-roi-calculator' ),
			'efficiency' => __( 'Efficiency (%)', 'doqix-roi-calculator' ),
			'error'      => __( 'Monthly error cost (R)', 'doqix-roi-calculator' ),
		);

		foreach ( $sliders as $key => $label ) {
			add_settings_field(
				'slider_' . $key,
				$label,
				array( $this, 'render_slider_field' ),
				'doqix-roi-calculator',
				'doqix_roi_sliders',
				array( 'slider' => $key )
			);
		}

		/* ── Section 3: Call to Action ── */
		add_settings_section(
			'doqix_roi_cta',
			__( 'Call to Action', 'doqix-roi-calculator' ),
			function () {
				echo '<p>' . esc_html__( 'Configure the CTA button and share functionality.', 'doqix-roi-calculator' ) . '</p>';
			},
			'doqix-roi-calculator'
		);

		$cta_fields = array(
			'cta_url'     => __( 'CTA URL', 'doqix-roi-calculator' ),
			'cta_text'    => __( 'CTA Text', 'doqix-roi-calculator' ),
			'cta_subtext' => __( 'CTA Subtext', 'doqix-roi-calculator' ),
			'share_url'   => __( 'Share URL', 'doqix-roi-calculator' ),
		);

		foreach ( $cta_fields as $key => $label ) {
			add_settings_field(
				$key,
				$label,
				array( $this, 'render_text_field' ),
				'doqix-roi-calculator',
				'doqix_roi_cta',
				array( 'field' => $key )
			);
		}

		/* ── Section 4: Display Options ── */
		add_settings_section(
			'doqix_roi_display',
			__( 'Display Options', 'doqix-roi-calculator' ),
			function () {
				echo '<p>' . esc_html__( 'Toggle display elements and set the POPIA note text.', 'doqix-roi-calculator' ) . '</p>';
			},
			'doqix-roi-calculator'
		);

		add_settings_field(
			'share_enabled',
			__( 'Show Share Button', 'doqix-roi-calculator' ),
			array( $this, 'render_checkbox_field' ),
			'doqix-roi-calculator',
			'doqix_roi_display',
			array( 'field' => 'share_enabled' )
		);

		add_settings_field(
			'popia_note',
			__( 'POPIA Note', 'doqix-roi-calculator' ),
			array( $this, 'render_text_field' ),
			'doqix-roi-calculator',
			'doqix_roi_display',
			array( 'field' => 'popia_note' )
		);
	}

	/* ────────────────────────────────────────────
	 * Field renderers
	 * ──────────────────────────────────────────── */

	public function render_tier_field( $args ) {
		$i = $args['tier'];
		$s = $this->get_settings();
		$name_key  = 'tier_' . $i . '_name';
		$price_key = 'tier_' . $i . '_price';
		?>
		<label>
			<?php esc_html_e( 'Name:', 'doqix-roi-calculator' ); ?>
			<input type="text"
				name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $name_key . ']' ); ?>"
				value="<?php echo esc_attr( $s[ $name_key ] ); ?>"
				class="regular-text doqix-roi-tier-name">
		</label>
		<label>
			<?php esc_html_e( 'Price (R/mo):', 'doqix-roi-calculator' ); ?>
			<input type="number"
				name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $price_key . ']' ); ?>"
				value="<?php echo esc_attr( $s[ $price_key ] ); ?>"
				min="0" step="1"
				class="small-text doqix-roi-tier-price">
		</label>
		<?php
		if ( $i === 4 ) {
			echo '<p class="description">' . esc_html__( 'Set price to 0 for custom/enterprise pricing.', 'doqix-roi-calculator' ) . '</p>';
		}
	}

	public function render_slider_field( $args ) {
		$key = $args['slider'];
		$s   = $this->get_settings();
		$fields = array(
			'default' => __( 'Default', 'doqix-roi-calculator' ),
			'min'     => __( 'Min', 'doqix-roi-calculator' ),
			'max'     => __( 'Max', 'doqix-roi-calculator' ),
			'step'    => __( 'Step', 'doqix-roi-calculator' ),
		);

		foreach ( $fields as $suffix => $label ) {
			$field_key = $key . '_' . $suffix;
			?>
			<label>
				<?php echo esc_html( $label ); ?>:
				<input type="number"
					name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $field_key . ']' ); ?>"
					value="<?php echo esc_attr( $s[ $field_key ] ); ?>"
					min="0" step="1"
					class="small-text">
			</label>
			<?php
		}
	}

	public function render_text_field( $args ) {
		$key = $args['field'];
		$s   = $this->get_settings();
		$type = ( strpos( $key, 'url' ) !== false ) ? 'url' : 'text';
		?>
		<input type="<?php echo esc_attr( $type ); ?>"
			name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $key . ']' ); ?>"
			value="<?php echo esc_attr( $s[ $key ] ); ?>"
			class="regular-text">
		<?php
	}

	public function render_checkbox_field( $args ) {
		$key = $args['field'];
		$s   = $this->get_settings();
		?>
		<label>
			<input type="checkbox"
				name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $key . ']' ); ?>"
				value="1"
				<?php checked( ! empty( $s[ $key ] ) ); ?>>
			<?php esc_html_e( 'Enabled', 'doqix-roi-calculator' ); ?>
		</label>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Sanitize
	 * ──────────────────────────────────────────── */

	public function sanitize_settings( $input ) {
		$defaults  = doqix_roi_get_defaults();
		$sanitized = array();

		/* Tier names */
		for ( $i = 1; $i <= 4; $i++ ) {
			$sanitized[ 'tier_' . $i . '_name' ]  = sanitize_text_field( $input[ 'tier_' . $i . '_name' ] ?? $defaults[ 'tier_' . $i . '_name' ] );
			$sanitized[ 'tier_' . $i . '_price' ] = absint( $input[ 'tier_' . $i . '_price' ] ?? $defaults[ 'tier_' . $i . '_price' ] );
		}

		/* Sliders */
		$slider_keys = array( 'people', 'hours', 'rate', 'efficiency', 'error' );
		foreach ( $slider_keys as $key ) {
			foreach ( array( 'default', 'min', 'max', 'step' ) as $suffix ) {
				$field = $key . '_' . $suffix;
				$sanitized[ $field ] = absint( $input[ $field ] ?? $defaults[ $field ] );
			}

			/* Boundary checks: default must be between min and max */
			$min = $sanitized[ $key . '_min' ];
			$max = $sanitized[ $key . '_max' ];
			$def = $sanitized[ $key . '_default' ];

			if ( $min > $max ) {
				$sanitized[ $key . '_min' ] = $max;
				$min = $max;
			}
			if ( $def < $min ) {
				$sanitized[ $key . '_default' ] = $min;
			}
			if ( $def > $max ) {
				$sanitized[ $key . '_default' ] = $max;
			}
			if ( $sanitized[ $key . '_step' ] < 1 ) {
				$sanitized[ $key . '_step' ] = 1;
			}
		}

		/* CTA */
		$sanitized['cta_url']     = esc_url_raw( $input['cta_url'] ?? $defaults['cta_url'] );
		$sanitized['cta_text']    = sanitize_text_field( $input['cta_text'] ?? $defaults['cta_text'] );
		$sanitized['cta_subtext'] = sanitize_text_field( $input['cta_subtext'] ?? $defaults['cta_subtext'] );
		$sanitized['share_url']   = esc_url_raw( $input['share_url'] ?? $defaults['share_url'] );

		/* Display */
		$sanitized['share_enabled'] = ! empty( $input['share_enabled'] ) ? 1 : 0;
		$sanitized['popia_note']    = sanitize_text_field( $input['popia_note'] ?? $defaults['popia_note'] );

		return $sanitized;
	}

	/* ────────────────────────────────────────────
	 * Render page
	 * ──────────────────────────────────────────── */

	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap doqix-roi-admin">
			<h1><?php esc_html_e( 'Do.Qix ROI Calculator Settings', 'doqix-roi-calculator' ); ?></h1>
			<p><?php esc_html_e( 'Use the shortcode [doqix_roi_calculator] to display the calculator on any page or post.', 'doqix-roi-calculator' ); ?></p>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'doqix_roi_settings_group' );
				do_settings_sections( 'doqix-roi-calculator' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Helper
	 * ──────────────────────────────────────────── */

	private function get_settings() {
		return wp_parse_args(
			get_option( DOQIX_ROI_OPTION_KEY, array() ),
			doqix_roi_get_defaults()
		);
	}
}
