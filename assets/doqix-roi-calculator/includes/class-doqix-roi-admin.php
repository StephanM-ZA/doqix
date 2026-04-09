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
		add_action( 'admin_menu', array( $this, 'add_settings_page' ), 20 );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_init', array( $this, 'handle_preset_actions' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_css' ) );
	}

	/* ────────────────────────────────────────────
	 * Menu
	 * ──────────────────────────────────────────── */

	public function add_settings_page() {
		$parent_slug = 'doqix-settings';

		// Check if parent Do.Qix menu exists (doqix-settings plugin active)
		if ( ! empty( $GLOBALS['admin_page_hooks'][ $parent_slug ] ) ) {
			$this->hook = add_submenu_page(
				$parent_slug,
				__( 'ROI Calculator V1', 'doqix-roi-calculator' ),
				__( 'ROI Calculator V1', 'doqix-roi-calculator' ),
				'manage_options',
				'doqix-roi-calculator',
				array( $this, 'render_settings_page' )
			);
		} else {
			// Fallback: standalone top-level menu
			$this->hook = add_menu_page(
				__( 'ROI Calculator V1', 'doqix-roi-calculator' ),
				__( 'ROI Calculator V1', 'doqix-roi-calculator' ),
				'manage_options',
				'doqix-roi-calculator',
				array( $this, 'render_settings_page' ),
				'dashicons-calculator',
				80
			);
		}
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
	 * Register settings (Settings API) — Global tab only
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
	}

	/* ────────────────────────────────────────────
	 * Preset add / delete actions
	 * ──────────────────────────────────────────── */

	public function handle_preset_actions() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		if ( ! isset( $_POST['doqix_roi_preset_nonce'] ) || ! wp_verify_nonce( $_POST['doqix_roi_preset_nonce'], 'doqix_roi_preset_action' ) ) {
			return;
		}

		$s = $this->get_settings();
		if ( ! isset( $s['presets'] ) ) {
			$s['presets'] = array( 'default' => doqix_roi_get_preset_defaults() );
		}

		if ( isset( $_POST['doqix_add_preset'] ) && ! empty( $_POST['new_preset_name'] ) ) {
			$name = sanitize_text_field( $_POST['new_preset_name'] );
			$slug = sanitize_key( str_replace( ' ', '-', strtolower( $name ) ) );
			if ( $slug && ! isset( $s['presets'][ $slug ] ) ) {
				$p = doqix_roi_get_preset_defaults();
				$p['label'] = $name;
				$s['presets'][ $slug ] = $p;
				update_option( DOQIX_ROI_OPTION_KEY, $s );
				wp_safe_redirect( admin_url( 'admin.php?page=doqix-roi-calculator&tab=preset-' . $slug ) );
				exit;
			}
		}

		if ( isset( $_POST['doqix_delete_preset'] ) && ! empty( $_POST['delete_preset_slug'] ) ) {
			$slug = sanitize_key( $_POST['delete_preset_slug'] );
			if ( $slug !== 'default' && isset( $s['presets'][ $slug ] ) ) {
				unset( $s['presets'][ $slug ] );
				update_option( DOQIX_ROI_OPTION_KEY, $s );
				wp_safe_redirect( admin_url( 'admin.php?page=doqix-roi-calculator&tab=global' ) );
				exit;
			}
		}
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
		$extra_class = ! empty( $args['class'] ) ? ' ' . esc_attr( $args['class'] ) : '';
		?>
		<input type="<?php echo esc_attr( $type ); ?>"
			name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $key . ']' ); ?>"
			value="<?php echo esc_attr( $s[ $key ] ); ?>"
			class="regular-text<?php echo $extra_class; ?>">
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

	public function render_cta_toggle_field() {
		$s = $this->get_settings();
		$enabled = ! isset( $s['cta_enabled'] ) || ! empty( $s['cta_enabled'] );
		?>
		<label>
			<input type="checkbox"
				name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[cta_enabled]' ); ?>"
				value="1"
				<?php checked( $enabled ); ?>
				id="doqix-cta-enabled"
				onchange="var els=document.querySelectorAll('.doqix-cta-field');for(var i=0;i<els.length;i++){els[i].closest('tr').style.opacity=this.checked?'1':'0.4';els[i].closest('tr').style.pointerEvents=this.checked?'auto':'none';}">
			<?php esc_html_e( 'Enabled — uncheck to hide the CTA button on the frontend', 'doqix-roi-calculator' ); ?>
		</label>
		<script>
		document.addEventListener('DOMContentLoaded',function(){
			var cb=document.getElementById('doqix-cta-enabled');
			if(cb&&!cb.checked){var els=document.querySelectorAll('.doqix-cta-field');for(var i=0;i<els.length;i++){els[i].closest('tr').style.opacity='0.4';els[i].closest('tr').style.pointerEvents='none';}}
		});
		</script>
		<?php
	}

	public function render_textarea_field( $args ) {
		$key = $args['field'];
		$s   = $this->get_settings();
		?>
		<textarea
			name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $key . ']' ); ?>"
			class="large-text" rows="3"><?php echo esc_textarea( $s[ $key ] ); ?></textarea>
		<?php
	}

	public function render_editor_field( $args ) {
		$key  = $args['field'];
		$s    = $this->get_settings();
		$rows = isset( $args['rows'] ) ? $args['rows'] : 5;
		wp_editor( $s[ $key ], 'doqix_roi_' . $key, array(
			'textarea_name' => DOQIX_ROI_OPTION_KEY . '[' . $key . ']',
			'teeny'         => false,
			'media_buttons' => false,
			'textarea_rows' => $rows,
		) );
	}

	public function render_color_field( $args ) {
		$key       = $args['field'];
		$s         = $this->get_settings();
		$value     = $s[ $key ];
		$has_value = ! empty( $value );
		$display   = $has_value ? $value : '#0886B5';
		?>
		<span class="doqix-color-field">
			<input type="color"
				name="<?php echo esc_attr( DOQIX_ROI_OPTION_KEY . '[' . $key . ']' ); ?>"
				value="<?php echo esc_attr( $display ); ?>"
				<?php if ( ! $has_value ) echo 'data-is-default="1"'; ?>>
			<?php if ( $has_value ) : ?>
			<code><?php echo esc_html( $value ); ?></code>
			<button type="button" class="button-link doqix-reset-color" onclick="this.parentElement.querySelector('input[type=color]').value='#0886B5';this.parentElement.querySelector('input[type=color]').name='';this.parentElement.querySelector('code').textContent='Theme default';this.style.display='none';"><?php esc_html_e( 'Reset to theme default', 'doqix-roi-calculator' ); ?></button>
			<?php else : ?>
			<code><?php esc_html_e( 'Theme default', 'doqix-roi-calculator' ); ?></code>
			<?php endif; ?>
		</span>
		<?php if ( ! empty( $args['description'] ) ) : ?>
		<p class="description"><?php echo esc_html( $args['description'] ); ?></p>
		<?php endif; ?>
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

		/* Presets — merge with existing (don't wipe presets not being edited) */
		$existing = wp_parse_args( get_option( DOQIX_ROI_OPTION_KEY, array() ), $defaults );
		$sanitized['presets'] = isset( $existing['presets'] ) ? $existing['presets'] : array( 'default' => doqix_roi_get_preset_defaults() );

		if ( ! empty( $input['presets'] ) && is_array( $input['presets'] ) ) {
			foreach ( $input['presets'] as $slug => $pi ) {
				$slug = sanitize_key( $slug );
				$pd   = doqix_roi_get_preset_defaults();
				$sanitized['presets'][ $slug ] = array(
					'label'          => sanitize_text_field( $pi['label'] ?? $pd['label'] ),
					'heading_text'   => wp_kses_post( $pi['heading_text'] ?? $pd['heading_text'] ),
					'intro_text'     => wp_kses_post( $pi['intro_text'] ?? $pd['intro_text'] ),
					'footnote_text'  => wp_kses_post( $pi['footnote_text'] ?? $pd['footnote_text'] ),
					'color_accent'   => isset( $pi['color_accent'] ) && '' !== $pi['color_accent'] ? sanitize_hex_color( $pi['color_accent'] ) : '',
					'color_cta'      => isset( $pi['color_cta'] ) && '' !== $pi['color_cta'] ? sanitize_hex_color( $pi['color_cta'] ) : '',
					'cta_enabled'    => ! empty( $pi['cta_enabled'] ) ? 1 : 0,
					'cta_url'        => sanitize_text_field( $pi['cta_url'] ?? $pd['cta_url'] ),
					'cta_text'       => sanitize_text_field( $pi['cta_text'] ?? $pd['cta_text'] ),
					'cta_subtext'    => sanitize_text_field( $pi['cta_subtext'] ?? $pd['cta_subtext'] ),
					'share_url'      => sanitize_text_field( $pi['share_url'] ?? $pd['share_url'] ),
					'share_enabled'  => ! empty( $pi['share_enabled'] ) ? 1 : 0,
				);
			}
		}

		return $sanitized;
	}

	/* ────────────────────────────────────────────
	 * Render page — tabbed: Global + per-preset
	 * ──────────────────────────────────────────── */

	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$s       = $this->get_settings();
		$opt     = DOQIX_ROI_OPTION_KEY;
		$presets = isset( $s['presets'] ) ? $s['presets'] : array( 'default' => doqix_roi_get_preset_defaults() );
		$current_tab = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'global';
		?>
		<div class="wrap doqix-roi-admin">
			<h1><?php esc_html_e( 'Do.Qix ROI Calculator Settings', 'doqix-roi-calculator' ); ?></h1>

			<h2 class="nav-tab-wrapper">
				<a href="?page=doqix-roi-calculator&tab=global" class="nav-tab <?php echo $current_tab === 'global' ? 'nav-tab-active' : ''; ?>">Global Settings</a>
				<?php foreach ( $presets as $slug => $preset ) : ?>
				<a href="?page=doqix-roi-calculator&tab=preset-<?php echo esc_attr( $slug ); ?>" class="nav-tab <?php echo $current_tab === 'preset-' . $slug ? 'nav-tab-active' : ''; ?>"><?php echo esc_html( $preset['label'] ?? ucfirst( $slug ) ); ?></a>
				<?php endforeach; ?>
				<a href="?page=doqix-roi-calculator&tab=info" class="nav-tab <?php echo $current_tab === 'info' ? 'nav-tab-active' : ''; ?>">Info</a>
			</h2>

			<form method="post" style="margin:10px 0;">
				<?php wp_nonce_field( 'doqix_roi_preset_action', 'doqix_roi_preset_nonce' ); ?>
				<input type="text" name="new_preset_name" placeholder="New preset name" style="width:200px">
				<input type="submit" name="doqix_add_preset" class="button" value="+ Add Preset">
			</form>

			<?php if ( $current_tab === 'info' ) : ?>
				<?php $this->render_info_tab(); ?>
			<?php elseif ( $current_tab === 'global' ) : ?>
				<p>These settings are shared across all presets.</p>
				<form method="post" action="options.php">
					<?php
					settings_fields( 'doqix_roi_settings_group' );
					do_settings_sections( 'doqix-roi-calculator' );
					submit_button();
					?>
				</form>
			<?php else :
				$preset_slug = str_replace( 'preset-', '', $current_tab );
				if ( ! isset( $presets[ $preset_slug ] ) ) {
					echo '<p>Preset not found.</p></div>';
					return;
				}
				$preset = wp_parse_args( $presets[ $preset_slug ], doqix_roi_get_preset_defaults() );
				?>

				<?php $shortcode_text = $preset_slug === 'default' ? '[doqix_roi_calculator]' : '[doqix_roi_calculator preset="' . esc_attr( $preset_slug ) . '"]'; ?>
				<div style="background:#f0f0f1;padding:12px 16px;margin:16px 0;border-radius:4px;display:flex;align-items:center;gap:10px;">
					<strong>Shortcode:</strong>
					<code id="doqix-shortcode-text"><?php echo $shortcode_text; ?></code>
					<button type="button" class="button button-small" id="doqix-copy-shortcode" onclick="navigator.clipboard.writeText(document.getElementById('doqix-shortcode-text').textContent).then(function(){var b=document.getElementById('doqix-copy-shortcode');b.textContent='Copied!';setTimeout(function(){b.textContent='Copy';},1500);});">Copy</button>
				</div>

				<form method="post" action="options.php">
					<?php settings_fields( 'doqix_roi_settings_group' ); ?>

					<h2>Preset Settings</h2>
					<table class="form-table">
						<tr>
							<th>Preset Name</th>
							<td><input type="text" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][label]" ); ?>" value="<?php echo esc_attr( $preset['label'] ); ?>" class="regular-text" <?php echo $preset_slug === 'default' ? 'readonly' : ''; ?>></td>
						</tr>
					</table>

					<h2>Content</h2>
					<table class="form-table">
						<tr>
							<th>Heading</th>
							<td><?php wp_editor( $preset['heading_text'], 'doqix_roi_heading_' . $preset_slug, array( 'textarea_name' => "{$opt}[presets][{$preset_slug}][heading_text]", 'teeny' => false, 'media_buttons' => false, 'textarea_rows' => 3 ) ); ?></td>
						</tr>
						<tr>
							<th>Description</th>
							<td><?php wp_editor( $preset['intro_text'], 'doqix_roi_intro_' . $preset_slug, array( 'textarea_name' => "{$opt}[presets][{$preset_slug}][intro_text]", 'teeny' => false, 'media_buttons' => false, 'textarea_rows' => 5 ) ); ?></td>
						</tr>
						<tr>
							<th>Footnote / Disclaimer</th>
							<td><?php wp_editor( $preset['footnote_text'], 'doqix_roi_footnote_' . $preset_slug, array( 'textarea_name' => "{$opt}[presets][{$preset_slug}][footnote_text]", 'teeny' => false, 'media_buttons' => false, 'textarea_rows' => 3 ) ); ?></td>
						</tr>
					</table>

					<h2>Colors</h2>
					<table class="form-table">
						<tr>
							<th>Slider Accent Color</th>
							<td><input type="color" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][color_accent]" ); ?>" value="<?php echo esc_attr( ! empty( $preset['color_accent'] ) ? $preset['color_accent'] : '#0886B5' ); ?>"><p class="description">Used for slider thumbs, track fill, value display.</p></td>
						</tr>
						<tr>
							<th>CTA Button Color</th>
							<td><input type="color" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][color_cta]" ); ?>" value="<?php echo esc_attr( ! empty( $preset['color_cta'] ) ? $preset['color_cta'] : '#0886B5' ); ?>"><p class="description">Used for CTA button background and share button outline.</p></td>
						</tr>
					</table>

					<h2>Call to Action</h2>
					<?php $cta_on = ! isset( $preset['cta_enabled'] ) || ! empty( $preset['cta_enabled'] ); ?>
					<table class="form-table">
						<tr>
							<th>Show CTA Button</th>
							<td><label><input type="checkbox" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][cta_enabled]" ); ?>" value="1" <?php checked( $cta_on ); ?> id="doqix-cta-enabled" onchange="document.getElementById('doqix-cta-fields').style.opacity=this.checked?'1':'0.4';document.getElementById('doqix-cta-fields').style.pointerEvents=this.checked?'auto':'none';"> Enabled</label></td>
						</tr>
					</table>
					<div id="doqix-cta-fields" style="<?php echo $cta_on ? '' : 'opacity:0.4;pointer-events:none;'; ?>">
					<table class="form-table">
						<tr><th>CTA URL</th><td><input type="text" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][cta_url]" ); ?>" value="<?php echo esc_attr( $preset['cta_url'] ); ?>" class="regular-text" placeholder="/contact"></td></tr>
						<tr><th>CTA Text</th><td><input type="text" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][cta_text]" ); ?>" value="<?php echo esc_attr( $preset['cta_text'] ); ?>" class="regular-text"></td></tr>
						<tr><th>CTA Subtext</th><td><input type="text" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][cta_subtext]" ); ?>" value="<?php echo esc_attr( $preset['cta_subtext'] ); ?>" class="regular-text"></td></tr>
						<tr><th>Share URL</th><td><input type="text" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][share_url]" ); ?>" value="<?php echo esc_attr( $preset['share_url'] ); ?>" class="regular-text"></td></tr>
					</table>
					</div>

					<h2>Display Options</h2>
					<table class="form-table">
						<tr><th>Show Share Button</th><td><label><input type="checkbox" name="<?php echo esc_attr( "{$opt}[presets][{$preset_slug}][share_enabled]" ); ?>" value="1" <?php checked( ! empty( $preset['share_enabled'] ) ); ?>> Enabled</label></td></tr>
					</table>

					<?php submit_button(); ?>
				</form>

				<?php if ( $preset_slug !== 'default' ) : ?>
				<form method="post" style="margin-top:20px;">
					<?php wp_nonce_field( 'doqix_roi_preset_action', 'doqix_roi_preset_nonce' ); ?>
					<input type="hidden" name="delete_preset_slug" value="<?php echo esc_attr( $preset_slug ); ?>">
					<input type="submit" name="doqix_delete_preset" class="button button-link-delete" value="Delete this preset" onclick="return confirm('Delete this preset?');">
				</form>
				<?php endif; ?>
			<?php endif; ?>
		</div>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Info tab: calculation logic reference
	 * ──────────────────────────────────────────── */

	private function render_info_tab() {
		$s = $this->get_settings();
		?>
		<div class="doqix-info-tab" style="max-width:860px;">

			<h2><?php esc_html_e( 'How the Calculator Works', 'doqix-roi-calculator' ); ?></h2>
			<p><?php esc_html_e( 'The ROI calculator uses five fixed sliders to estimate monthly and annual savings from automating repetitive tasks. Each slider has a specific role in the formula.', 'doqix-roi-calculator' ); ?></p>

			<!-- Slider Roles -->
			<h3><?php esc_html_e( 'Slider Roles', 'doqix-roi-calculator' ); ?></h3>
			<table class="widefat striped" style="max-width:860px;">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Slider', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Role', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'How it works', 'doqix-roi-calculator' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><strong><?php esc_html_e( 'People', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'Multiplier', 'doqix-roi-calculator' ); ?></td>
						<td><?php esc_html_e( 'Number of team members doing repetitive tasks. Multiplied with hours to get total weekly hours.', 'doqix-roi-calculator' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Hours per person per week', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'Multiplier', 'doqix-roi-calculator' ); ?></td>
						<td><?php esc_html_e( 'Hours each person spends on repetitive work per week. Multiplied with people count.', 'doqix-roi-calculator' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Hourly cost (R)', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'Rate', 'doqix-roi-calculator' ); ?></td>
						<td><?php esc_html_e( 'Average cost per hour of manual labour. Multiplied by hours saved to calculate rand value of savings.', 'doqix-roi-calculator' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Efficiency (%)', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'Efficiency', 'doqix-roi-calculator' ); ?></td>
						<td><?php esc_html_e( 'Percentage of manual work that automation can realistically handle. Converted to decimal (e.g. 70% = 0.70).', 'doqix-roi-calculator' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Monthly error cost (R)', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'Flat monthly', 'doqix-roi-calculator' ); ?></td>
						<td><?php esc_html_e( 'Fixed monthly cost from errors, rework, or waste. Added directly to monthly savings.', 'doqix-roi-calculator' ); ?></td>
					</tr>
				</tbody>
			</table>

			<!-- Core Formula -->
			<h3><?php esc_html_e( 'Core Formula', 'doqix-roi-calculator' ); ?></h3>
			<div style="background:#f6f7f7;border:1px solid #c3c4c7;border-radius:4px;padding:16px 20px;font-family:monospace;font-size:13px;line-height:2;">
				<strong>1.</strong> <?php esc_html_e( 'Hours Saved / Month', 'doqix-roi-calculator' ); ?> = <em><?php esc_html_e( 'People', 'doqix-roi-calculator' ); ?></em> &times; <em><?php esc_html_e( 'Hours', 'doqix-roi-calculator' ); ?></em> &times; 4.33 &times; <em><?php esc_html_e( 'Efficiency', 'doqix-roi-calculator' ); ?></em><br>
				<strong>2.</strong> <?php esc_html_e( 'Monthly Savings', 'doqix-roi-calculator' ); ?> = (<em><?php esc_html_e( 'Hours Saved / Month', 'doqix-roi-calculator' ); ?></em> &times; <em><?php esc_html_e( 'Hourly Cost', 'doqix-roi-calculator' ); ?></em>) + <em><?php esc_html_e( 'Error Cost', 'doqix-roi-calculator' ); ?></em><br>
				<strong>3.</strong> <?php esc_html_e( 'Annual Savings', 'doqix-roi-calculator' ); ?> = <?php esc_html_e( 'Monthly Savings', 'doqix-roi-calculator' ); ?> &times; 12<br>
				<strong>4.</strong> <?php esc_html_e( 'Hours Saved / Year', 'doqix-roi-calculator' ); ?> = <?php esc_html_e( 'Hours Saved / Month', 'doqix-roi-calculator' ); ?> &times; 12
			</div>

			<p class="description" style="margin-top:8px;">
				<?php esc_html_e( 'The constant 4.33 converts weekly hours to monthly (52 weeks / 12 months).', 'doqix-roi-calculator' ); ?>
			</p>

			<!-- Worked Example -->
			<h3><?php esc_html_e( 'Worked Example (Default Sliders)', 'doqix-roi-calculator' ); ?></h3>
			<table class="widefat striped" style="max-width:860px;">
				<tbody>
					<tr>
						<td><?php esc_html_e( 'People x Hours', 'doqix-roi-calculator' ); ?></td>
						<td><code>3 people &times; 8 hours = 24 hrs/week</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Efficiency', 'doqix-roi-calculator' ); ?></td>
						<td><code>70% &rarr; 0.70</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Hours Saved / Month', 'doqix-roi-calculator' ); ?></td>
						<td><code>24 &times; 4.33 &times; 0.70 = 72.7 hrs</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Hourly Cost', 'doqix-roi-calculator' ); ?></td>
						<td><code>R150/hr</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Error Cost', 'doqix-roi-calculator' ); ?></td>
						<td><code>R2 000/month</code></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Monthly Savings', 'doqix-roi-calculator' ); ?></strong></td>
						<td><code>(72.7 &times; R150) + R2 000 = <strong>R12 911</strong></code></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Annual Savings', 'doqix-roi-calculator' ); ?></strong></td>
						<td><code>R12 911 &times; 12 = <strong>R154 930</strong></code></td>
					</tr>
				</tbody>
			</table>

			<!-- Tier Matching -->
			<h3><?php esc_html_e( 'Tier Matching Logic', 'doqix-roi-calculator' ); ?></h3>
			<p><?php esc_html_e( 'After calculating monthly savings, the calculator recommends a pricing tier using these steps:', 'doqix-roi-calculator' ); ?></p>
			<ol style="line-height:1.8;">
				<li><?php esc_html_e( 'Base match by monthly savings threshold: Solo (R2 500+), Team (R7 500+), Business (R25 000+), Enterprise (R100 000+).', 'doqix-roi-calculator' ); ?></li>
				<li><strong><?php esc_html_e( 'ROI Bump:', 'doqix-roi-calculator' ); ?></strong> <?php esc_html_e( 'If the ROI percentage exceeds 600%, the calculator bumps the recommendation to the next tier. This indicates the client is getting exceptional value and could benefit from a higher-tier plan.', 'doqix-roi-calculator' ); ?></li>
				<li><strong><?php esc_html_e( 'Efficiency Bump:', 'doqix-roi-calculator' ); ?></strong> <?php esc_html_e( 'If the efficiency slider is at or above 80% AND monthly savings are at least 2x the next tier\'s price (or the next tier is Enterprise), the recommendation bumps up. High efficiency signals mature automation readiness.', 'doqix-roi-calculator' ); ?></li>
			</ol>

			<!-- ROI Calculation -->
			<h3><?php esc_html_e( 'ROI Percentage', 'doqix-roi-calculator' ); ?></h3>
			<div style="background:#f6f7f7;border:1px solid #c3c4c7;border-radius:4px;padding:16px 20px;font-family:monospace;font-size:13px;line-height:2;">
				<?php esc_html_e( 'ROI %', 'doqix-roi-calculator' ); ?> = ((<em><?php esc_html_e( 'Monthly Savings', 'doqix-roi-calculator' ); ?></em> &minus; <em><?php esc_html_e( 'Tier Price', 'doqix-roi-calculator' ); ?></em>) / <em><?php esc_html_e( 'Tier Price', 'doqix-roi-calculator' ); ?></em>) &times; 100
			</div>
			<p class="description" style="margin-top:8px;">
				<?php esc_html_e( 'When the ROI multiplier exceeds 10x, it displays as "10x+" to avoid unrealistically large numbers. Enterprise tier (price = 0) shows a custom pricing message instead of ROI.', 'doqix-roi-calculator' ); ?>
			</p>

			<!-- Current Config Summary -->
			<h3><?php esc_html_e( 'Current Configuration', 'doqix-roi-calculator' ); ?></h3>

			<h4><?php esc_html_e( 'Tiers', 'doqix-roi-calculator' ); ?></h4>
			<table class="widefat striped" style="max-width:860px;">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Name', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Price', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Threshold', 'doqix-roi-calculator' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					$thresholds = array( 1 => 'R2 500+', 2 => 'R7 500+', 3 => 'R25 000+', 4 => 'R100 000+' );
					for ( $i = 1; $i <= 4; $i++ ) :
						$name  = $s[ 'tier_' . $i . '_name' ];
						$price = $s[ 'tier_' . $i . '_price' ];
					?>
					<tr>
						<td><?php echo esc_html( $name ); ?></td>
						<td><?php echo $price > 0 ? 'R' . esc_html( number_format( $price ) ) : esc_html__( 'Custom', 'doqix-roi-calculator' ); ?></td>
						<td><?php echo esc_html( $thresholds[ $i ] ); ?></td>
					</tr>
					<?php endfor; ?>
				</tbody>
			</table>

			<h4><?php esc_html_e( 'Sliders', 'doqix-roi-calculator' ); ?></h4>
			<table class="widefat striped" style="max-width:860px;">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Slider', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Default', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Range', 'doqix-roi-calculator' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					$slider_info = array(
						'people'     => array( 'label' => 'People', 'prefix' => '', 'suffix' => '' ),
						'hours'      => array( 'label' => 'Hours per person per week', 'prefix' => '', 'suffix' => '' ),
						'rate'       => array( 'label' => 'Hourly cost', 'prefix' => 'R', 'suffix' => '' ),
						'efficiency' => array( 'label' => 'Efficiency', 'prefix' => '', 'suffix' => '%' ),
						'error'      => array( 'label' => 'Monthly error cost', 'prefix' => 'R', 'suffix' => '' ),
					);
					foreach ( $slider_info as $key => $info ) :
						$def = $s[ $key . '_default' ];
						$min = $s[ $key . '_min' ];
						$max = $s[ $key . '_max' ];
					?>
					<tr>
						<td><?php echo esc_html( $info['label'] ); ?></td>
						<td><?php echo esc_html( $info['prefix'] . number_format( $def ) . $info['suffix'] ); ?></td>
						<td><?php echo esc_html( $info['prefix'] . number_format( $min ) . $info['suffix'] . ' – ' . $info['prefix'] . number_format( $max ) . $info['suffix'] ); ?></td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

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
