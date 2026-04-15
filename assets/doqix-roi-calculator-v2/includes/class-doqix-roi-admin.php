<?php
/**
 * Admin: Settings page for the ROI Calculator V2.
 * Tabbed UI: Global (tiers, sliders, thresholds) + per-preset tabs (content, colors, CTA, display).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_ROI_V2_Admin {

	/** @var string Settings page hook suffix. */
	private $hook = '';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_settings_page' ), 20 );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_init', array( $this, 'handle_preset_actions' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
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
				__( 'ROI Calculator', 'doqix-roi-calculator' ),
				__( 'ROI Calculator', 'doqix-roi-calculator' ),
				'manage_options',
				'doqix-roi-calculator-v2',
				array( $this, 'render_settings_page' )
			);
		} else {
			// Fallback: standalone top-level menu
			$this->hook = add_menu_page(
				__( 'ROI Calculator V2', 'doqix-roi-calculator' ),
				__( 'ROI Calculator V2', 'doqix-roi-calculator' ),
				'manage_options',
				'doqix-roi-calculator-v2',
				array( $this, 'render_settings_page' ),
				'dashicons-calculator',
				81
			);
		}
	}

	/* ────────────────────────────────────────────
	 * Admin CSS + JS — only on our settings page
	 * ──────────────────────────────────────────── */

	public function enqueue_admin_assets( $hook_suffix ) {
		if ( $hook_suffix !== $this->hook ) {
			return;
		}
		wp_enqueue_style(
			'doqix-roi-v2-admin',
			DOQIX_ROI_V2_PLUGIN_URL . 'assets/css/doqix-roi-admin.css',
			array(),
			DOQIX_ROI_V2_VERSION
		);
		wp_enqueue_script(
			'doqix-roi-v2-admin',
			DOQIX_ROI_V2_PLUGIN_URL . 'assets/js/doqix-roi-admin.js',
			array(),
			DOQIX_ROI_V2_VERSION,
			true
		);
	}

	/* ────────────────────────────────────────────
	 * Register settings (Settings API)
	 * ──────────────────────────────────────────── */

	public function register_settings() {
		register_setting(
			'doqix_roi_v2_settings_group',
			DOQIX_ROI_V2_OPTION_KEY,
			array( $this, 'sanitize_settings' )
		);
	}

	/* ────────────────────────────────────────────
	 * Preset actions (add / delete) — via admin_init
	 * ──────────────────────────────────────────── */

	public function handle_preset_actions() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		/* Add preset */
		if ( isset( $_POST['doqix_roi_v2_add_preset'] ) && ! empty( $_POST['doqix_roi_v2_new_preset_name'] ) ) {
			check_admin_referer( 'doqix_roi_v2_preset_action', 'doqix_roi_v2_preset_nonce' );

			$label = sanitize_text_field( wp_unslash( $_POST['doqix_roi_v2_new_preset_name'] ) );
			$slug  = sanitize_key( str_replace( ' ', '-', strtolower( $label ) ) );

			if ( '' === $slug ) {
				return;
			}

			$s = get_option( DOQIX_ROI_V2_OPTION_KEY, doqix_roi_v2_get_defaults() );
			if ( ! isset( $s['presets'] ) ) {
				$s['presets'] = array();
			}

			if ( ! isset( $s['presets'][ $slug ] ) ) {
				$new_preset          = doqix_roi_v2_get_preset_defaults();
				$new_preset['label'] = $label;
				$s['presets'][ $slug ] = $new_preset;
				update_option( DOQIX_ROI_V2_OPTION_KEY, $s );
			}

			wp_safe_redirect( add_query_arg( array(
				'page' => 'doqix-roi-calculator-v2',
				'tab'  => 'preset-' . $slug,
			), admin_url( 'admin.php' ) ) );
			exit;
		}

		/* Delete preset */
		if ( isset( $_GET['doqix_roi_v2_delete_preset'] ) && ! empty( $_GET['doqix_roi_v2_delete_preset'] ) ) {
			check_admin_referer( 'doqix_roi_v2_delete_preset', '_wpnonce' );

			$slug = sanitize_key( wp_unslash( $_GET['doqix_roi_v2_delete_preset'] ) );

			if ( 'default' === $slug ) {
				return; // cannot delete default preset
			}

			$s = get_option( DOQIX_ROI_V2_OPTION_KEY, doqix_roi_v2_get_defaults() );
			if ( isset( $s['presets'][ $slug ] ) ) {
				unset( $s['presets'][ $slug ] );
				update_option( DOQIX_ROI_V2_OPTION_KEY, $s );
			}

			wp_safe_redirect( add_query_arg( array(
				'page' => 'doqix-roi-calculator-v2',
				'tab'  => 'global',
			), admin_url( 'admin.php' ) ) );
			exit;
		}
	}

	/* ────────────────────────────────────────────
	 * Sanitize
	 * ──────────────────────────────────────────── */

	public function sanitize_settings( $input ) {
		$defaults  = doqix_roi_v2_get_defaults();
		$sanitized = array();

		/* ── Tiers ── */
		$sanitized['tiers'] = array();
		if ( ! empty( $input['tiers'] ) && is_array( $input['tiers'] ) ) {
			foreach ( $input['tiers'] as $tier ) {
				$name = sanitize_text_field( $tier['name'] ?? '' );
				if ( '' === $name ) {
					continue; // skip empty rows
				}
				$sanitized['tiers'][] = array(
					'name'      => $name,
					'price'     => absint( $tier['price'] ?? 0 ),
					'threshold' => absint( $tier['threshold'] ?? 0 ),
				);
			}
		}
		if ( empty( $sanitized['tiers'] ) ) {
			$sanitized['tiers'] = $defaults['tiers'];
		}

		/* ── Sliders ── */
		$sanitized['sliders'] = array();
		$valid_roles   = array( 'multiplier', 'rate', 'efficiency', 'flat_monthly' );
		$valid_formats = array( 'number', 'currency', 'percentage' );

		if ( ! empty( $input['sliders'] ) && is_array( $input['sliders'] ) ) {
			foreach ( $input['sliders'] as $slider ) {
				$label = sanitize_text_field( $slider['label'] ?? '' );
				if ( '' === $label ) {
					continue; // skip empty rows
				}

				$key = sanitize_key( $slider['key'] ?? '' );
				if ( '' === $key ) {
					$key = sanitize_key( str_replace( ' ', '-', strtolower( $label ) ) );
				}

				$role   = in_array( $slider['role'] ?? '', $valid_roles, true ) ? $slider['role'] : 'multiplier';
				$format = in_array( $slider['format'] ?? '', $valid_formats, true ) ? $slider['format'] : 'number';

				$min  = intval( $slider['min'] ?? 0 );
				$max  = intval( $slider['max'] ?? 100 );
				$step = intval( $slider['step'] ?? 1 );
				$def  = intval( $slider['default'] ?? $min );

				if ( $min > $max ) {
					$min = $max;
				}
				if ( $def < $min ) {
					$def = $min;
				}
				if ( $def > $max ) {
					$def = $max;
				}
				if ( $step < 1 ) {
					$step = 1;
				}

				$sanitized['sliders'][] = array(
					'key'     => $key,
					'label'   => $label,
					'tooltip' => sanitize_text_field( $slider['tooltip'] ?? '' ),
					'role'    => $role,
					'format'  => $format,
					'default' => $def,
					'min'     => $min,
					'max'     => $max,
					'step'    => $step,
					'prefix'  => sanitize_text_field( $slider['prefix'] ?? '' ),
					'suffix'  => sanitize_text_field( $slider['suffix'] ?? '' ),
				);
			}
		}
		if ( empty( $sanitized['sliders'] ) ) {
			$sanitized['sliders'] = $defaults['sliders'];
		}

		/* ── Thresholds ── */
		$sanitized['thresholds'] = array(
			'roi_bump_pct'         => absint( $input['thresholds']['roi_bump_pct'] ?? $defaults['thresholds']['roi_bump_pct'] ),
			'efficiency_bump_pct'  => min( 100, absint( $input['thresholds']['efficiency_bump_pct'] ?? $defaults['thresholds']['efficiency_bump_pct'] ) ),
			'next_tier_multiplier' => max( 1, absint( $input['thresholds']['next_tier_multiplier'] ?? $defaults['thresholds']['next_tier_multiplier'] ) ),
			'roi_cap_display'      => max( 1, absint( $input['thresholds']['roi_cap_display'] ?? $defaults['thresholds']['roi_cap_display'] ) ),
		);

		/* ── Presets ── */
		$existing  = get_option( DOQIX_ROI_V2_OPTION_KEY, array() );
		$existing_presets = isset( $existing['presets'] ) && is_array( $existing['presets'] ) ? $existing['presets'] : array();
		$preset_defaults  = doqix_roi_v2_get_preset_defaults();

		$sanitized['presets'] = array();

		if ( ! empty( $input['presets'] ) && is_array( $input['presets'] ) ) {
			foreach ( $input['presets'] as $slug => $preset_input ) {
				$slug = sanitize_key( $slug );
				if ( '' === $slug ) {
					continue;
				}

				$base = isset( $existing_presets[ $slug ] ) ? $existing_presets[ $slug ] : $preset_defaults;

				$preset_sanitized = array(
					'label'         => sanitize_text_field( $preset_input['label'] ?? $base['label'] ),
					'heading_text'  => wp_kses_post( $preset_input['heading_text'] ?? $base['heading_text'] ),
					'intro_text'    => wp_kses_post( $preset_input['intro_text'] ?? $base['intro_text'] ),
					'footnote_text' => wp_kses_post( $preset_input['footnote_text'] ?? $base['footnote_text'] ),
					'cta_enabled'   => ! empty( $preset_input['cta_enabled'] ) ? 1 : 0,
					'cta_url'       => sanitize_text_field( $preset_input['cta_url'] ?? $base['cta_url'] ),
					'cta_text'      => sanitize_text_field( $preset_input['cta_text'] ?? $base['cta_text'] ),
					'cta_subtext'   => sanitize_text_field( $preset_input['cta_subtext'] ?? $base['cta_subtext'] ),
					'share_url'     => esc_url_raw( $preset_input['share_url'] ?? $base['share_url'] ),
					'share_enabled' => ! empty( $preset_input['share_enabled'] ) ? 1 : 0,
					'og_description' => sanitize_text_field( $preset_input['og_description'] ?? $base['og_description'] ?? '' ),
				);

				/* Sanitize all color keys */
				$color_keys = array(
					'color_accent', 'color_cta',
					'color_card_bg', 'color_card_border', 'color_heading_text', 'color_body_text',
					'color_slider_track', 'color_slider_label',
					'color_hero_bg', 'color_hero_value', 'color_hero_label',
					'color_result_value', 'color_result_label', 'color_roi_highlight', 'color_tier_text',
					'color_cta_text', 'color_cta_hover_bg', 'color_cta_hover_text',
					'color_share_text', 'color_footnote',
					'color_tooltip_bg', 'color_tooltip_text',
				);
				foreach ( $color_keys as $ck ) {
					$preset_sanitized[ $ck ] = isset( $preset_input[ $ck ] ) && '' !== $preset_input[ $ck ]
						? sanitize_hex_color( $preset_input[ $ck ] )
						: '';
				}

				/* Sanitize style controls */
				$preset_sanitized['card_border_radius'] = max( 0, min( 24, intval( $preset_input['card_border_radius'] ?? $base['card_border_radius'] ?? 8 ) ) );
				$valid_shadows = array( 'none', 'subtle', 'medium', 'strong' );
				$preset_sanitized['card_shadow'] = in_array( $preset_input['card_shadow'] ?? '', $valid_shadows, true )
					? $preset_input['card_shadow']
					: ( $base['card_shadow'] ?? 'subtle' );
				$preset_sanitized['cta_border_radius'] = max( 0, min( 24, intval( $preset_input['cta_border_radius'] ?? $base['cta_border_radius'] ?? 8 ) ) );

				$sanitized['presets'][ $slug ] = $preset_sanitized;
			}
		}

		/* Preserve any presets that were not submitted (they are on other tabs) */
		foreach ( $existing_presets as $slug => $existing_preset ) {
			if ( ! isset( $sanitized['presets'][ $slug ] ) ) {
				$sanitized['presets'][ $slug ] = $existing_preset;
			}
		}

		/* Ensure default preset always exists */
		if ( ! isset( $sanitized['presets']['default'] ) ) {
			$sanitized['presets']['default'] = $preset_defaults;
		}

		return $sanitized;
	}

	/* ────────────────────────────────────────────
	 * Render page — tabbed UI
	 * ──────────────────────────────────────────── */

	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$s       = $this->get_settings();
		$opt     = DOQIX_ROI_V2_OPTION_KEY;
		$presets = isset( $s['presets'] ) && is_array( $s['presets'] ) ? $s['presets'] : array( 'default' => doqix_roi_v2_get_preset_defaults() );
		$active  = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'global';
		?>
		<div class="wrap doqix-roi-admin">
			<h1><?php esc_html_e( 'Do.Qix ROI Calculator V2 Settings', 'doqix-roi-calculator' ); ?></h1>
			<p><?php esc_html_e( 'Use [doqix_roi_calculator_v2] to display the calculator, or [doqix_roi_calculator_v2 preset="name"] for a specific preset.', 'doqix-roi-calculator' ); ?></p>

			<!-- Tab navigation -->
			<h2 class="nav-tab-wrapper">
				<a href="<?php echo esc_url( add_query_arg( array( 'page' => 'doqix-roi-calculator-v2', 'tab' => 'global' ), admin_url( 'admin.php' ) ) ); ?>"
				   class="nav-tab <?php echo 'global' === $active ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'Global', 'doqix-roi-calculator' ); ?>
				</a>
				<?php foreach ( $presets as $slug => $preset ) : ?>
				<a href="<?php echo esc_url( add_query_arg( array( 'page' => 'doqix-roi-calculator-v2', 'tab' => 'preset-' . $slug ), admin_url( 'admin.php' ) ) ); ?>"
				   class="nav-tab <?php echo ( 'preset-' . $slug ) === $active ? 'nav-tab-active' : ''; ?>">
					<?php echo esc_html( $preset['label'] ?? ucfirst( $slug ) ); ?>
				</a>
				<?php endforeach; ?>
				<a href="<?php echo esc_url( add_query_arg( array( 'page' => 'doqix-roi-calculator-v2', 'tab' => 'info' ), admin_url( 'admin.php' ) ) ); ?>"
				   class="nav-tab <?php echo 'info' === $active ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'Info', 'doqix-roi-calculator' ); ?>
				</a>
			</h2>

			<?php if ( 'global' === $active ) : ?>
				<?php $this->render_global_tab( $s, $opt ); ?>
			<?php elseif ( 'info' === $active ) : ?>
				<?php $this->render_info_tab(); ?>
			<?php else :
				$preset_slug = str_replace( 'preset-', '', $active );
				if ( isset( $presets[ $preset_slug ] ) ) {
					$this->render_preset_tab( $preset_slug, $presets[ $preset_slug ], $opt );
				}
			endif; ?>

			<!-- Add preset form -->
			<div style="margin-top:20px;padding:15px;background:#f9f9f9;border:1px solid #ccd0d4;">
				<h3 style="margin-top:0;"><?php esc_html_e( 'Add New Preset', 'doqix-roi-calculator' ); ?></h3>
				<form method="post" action="">
					<?php wp_nonce_field( 'doqix_roi_v2_preset_action', 'doqix_roi_v2_preset_nonce' ); ?>
					<label>
						<?php esc_html_e( 'Preset Name:', 'doqix-roi-calculator' ); ?>
						<input type="text" name="doqix_roi_v2_new_preset_name" value="" class="regular-text" required>
					</label>
					<?php submit_button( __( 'Add Preset', 'doqix-roi-calculator' ), 'secondary', 'doqix_roi_v2_add_preset', false ); ?>
				</form>
			</div>
		</div>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Global tab: tiers, sliders, thresholds
	 * ──────────────────────────────────────────── */

	private function render_global_tab( $s, $opt ) {
		?>
		<form method="post" action="options.php">
			<?php settings_fields( 'doqix_roi_v2_settings_group' ); ?>

			<!-- ═══════════════ TIERS ═══════════════ -->
			<h2><?php esc_html_e( 'Pricing Tiers', 'doqix-roi-calculator' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Configure pricing tiers. Set price to 0 for custom/enterprise pricing. Tiers are matched by monthly savings threshold.', 'doqix-roi-calculator' ); ?></p>

			<table class="widefat doqix-repeater" id="doqix-tiers-table">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Name', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Price (R/mo)', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Threshold (R/mo savings)', 'doqix-roi-calculator' ); ?></th>
						<th class="doqix-col-action"></th>
					</tr>
				</thead>
				<tbody id="doqix-tiers-body">
					<?php foreach ( $s['tiers'] as $i => $tier ) : ?>
					<tr class="doqix-repeater-row" data-index="<?php echo esc_attr( $i ); ?>">
						<td>
							<input type="text" name="<?php echo esc_attr( "{$opt}[tiers][{$i}][name]" ); ?>"
								value="<?php echo esc_attr( $tier['name'] ); ?>" class="regular-text" required>
						</td>
						<td>
							<input type="number" name="<?php echo esc_attr( "{$opt}[tiers][{$i}][price]" ); ?>"
								value="<?php echo esc_attr( $tier['price'] ); ?>" min="0" step="1" class="small-text">
						</td>
						<td>
							<input type="number" name="<?php echo esc_attr( "{$opt}[tiers][{$i}][threshold]" ); ?>"
								value="<?php echo esc_attr( $tier['threshold'] ); ?>" min="0" step="1" class="small-text">
						</td>
						<td class="doqix-col-action">
							<button type="button" class="button doqix-remove-row"><?php esc_html_e( 'Remove', 'doqix-roi-calculator' ); ?></button>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
			<p><button type="button" class="button doqix-add-tier" id="doqix-add-tier"><?php esc_html_e( '+ Add Tier', 'doqix-roi-calculator' ); ?></button></p>

			<!-- ═══════════════ SLIDERS ═══════════════ -->
			<h2><?php esc_html_e( 'Slider Configuration', 'doqix-roi-calculator' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Configure input sliders. Each slider has a role that determines how it plugs into the savings formula.', 'doqix-roi-calculator' ); ?></p>

			<div id="doqix-sliders-container">
				<?php foreach ( $s['sliders'] as $i => $slider ) : ?>
				<div class="doqix-slider-card doqix-repeater-row" data-index="<?php echo esc_attr( $i ); ?>">
					<div class="doqix-slider-card-header">
						<strong class="doqix-slider-card-title"><?php echo esc_html( $slider['label'] ?: __( 'New Slider', 'doqix-roi-calculator' ) ); ?></strong>
						<button type="button" class="button doqix-remove-row"><?php esc_html_e( 'Remove', 'doqix-roi-calculator' ); ?></button>
					</div>
					<div class="doqix-slider-card-body">
						<div class="doqix-field-grid">
							<label>
								<?php esc_html_e( 'Key', 'doqix-roi-calculator' ); ?>
								<input type="text" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][key]" ); ?>"
									value="<?php echo esc_attr( $slider['key'] ); ?>" class="regular-text doqix-slider-key" readonly>
							</label>
							<label>
								<?php esc_html_e( 'Label', 'doqix-roi-calculator' ); ?>
								<input type="text" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][label]" ); ?>"
									value="<?php echo esc_attr( $slider['label'] ); ?>" class="regular-text doqix-slider-label" required>
							</label>
							<label>
								<?php esc_html_e( 'Role', 'doqix-roi-calculator' ); ?>
								<select name="<?php echo esc_attr( "{$opt}[sliders][{$i}][role]" ); ?>">
									<option value="multiplier" <?php selected( $slider['role'], 'multiplier' ); ?>><?php esc_html_e( 'Multiplier', 'doqix-roi-calculator' ); ?></option>
									<option value="rate" <?php selected( $slider['role'], 'rate' ); ?>><?php esc_html_e( 'Hourly rate', 'doqix-roi-calculator' ); ?></option>
									<option value="efficiency" <?php selected( $slider['role'], 'efficiency' ); ?>><?php esc_html_e( 'Efficiency (%)', 'doqix-roi-calculator' ); ?></option>
									<option value="flat_monthly" <?php selected( $slider['role'], 'flat_monthly' ); ?>><?php esc_html_e( 'Monthly flat amount', 'doqix-roi-calculator' ); ?></option>
								</select>
							</label>
							<label>
								<?php esc_html_e( 'Format', 'doqix-roi-calculator' ); ?>
								<select name="<?php echo esc_attr( "{$opt}[sliders][{$i}][format]" ); ?>">
									<option value="number" <?php selected( $slider['format'], 'number' ); ?>><?php esc_html_e( 'Number', 'doqix-roi-calculator' ); ?></option>
									<option value="currency" <?php selected( $slider['format'], 'currency' ); ?>><?php esc_html_e( 'Currency (R)', 'doqix-roi-calculator' ); ?></option>
									<option value="percentage" <?php selected( $slider['format'], 'percentage' ); ?>><?php esc_html_e( 'Percentage (%)', 'doqix-roi-calculator' ); ?></option>
								</select>
							</label>
							<label>
								<?php esc_html_e( 'Default', 'doqix-roi-calculator' ); ?>
								<input type="number" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][default]" ); ?>"
									value="<?php echo esc_attr( $slider['default'] ); ?>" class="small-text">
							</label>
							<label>
								<?php esc_html_e( 'Min', 'doqix-roi-calculator' ); ?>
								<input type="number" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][min]" ); ?>"
									value="<?php echo esc_attr( $slider['min'] ); ?>" class="small-text">
							</label>
							<label>
								<?php esc_html_e( 'Max', 'doqix-roi-calculator' ); ?>
								<input type="number" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][max]" ); ?>"
									value="<?php echo esc_attr( $slider['max'] ); ?>" class="small-text">
							</label>
							<label>
								<?php esc_html_e( 'Step', 'doqix-roi-calculator' ); ?>
								<input type="number" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][step]" ); ?>"
									value="<?php echo esc_attr( $slider['step'] ); ?>" min="1" class="small-text">
							</label>
							<label>
								<?php esc_html_e( 'Prefix', 'doqix-roi-calculator' ); ?>
								<input type="text" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][prefix]" ); ?>"
									value="<?php echo esc_attr( $slider['prefix'] ); ?>" class="small-text" style="width:60px">
							</label>
							<label>
								<?php esc_html_e( 'Suffix', 'doqix-roi-calculator' ); ?>
								<input type="text" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][suffix]" ); ?>"
									value="<?php echo esc_attr( $slider['suffix'] ); ?>" class="small-text" style="width:60px">
							</label>
						</div>
						<div class="doqix-tooltip-row">
							<label>
								<?php esc_html_e( 'Tooltip', 'doqix-roi-calculator' ); ?>
								<input type="text" name="<?php echo esc_attr( "{$opt}[sliders][{$i}][tooltip]" ); ?>"
									value="<?php echo esc_attr( $slider['tooltip'] ); ?>" class="large-text">
							</label>
						</div>
					</div>
				</div>
				<?php endforeach; ?>
			</div>
			<p><button type="button" class="button doqix-add-slider" id="doqix-add-slider"><?php esc_html_e( '+ Add Slider', 'doqix-roi-calculator' ); ?></button></p>

			<!-- ═══════════════ THRESHOLDS ═══════════════ -->
			<h2><?php esc_html_e( 'Tier Thresholds', 'doqix-roi-calculator' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Fine-tune how the calculator recommends pricing tiers.', 'doqix-roi-calculator' ); ?></p>

			<table class="form-table">
				<tr>
					<th scope="row"><label for="th-roi-bump"><?php esc_html_e( 'ROI bump %', 'doqix-roi-calculator' ); ?></label></th>
					<td>
						<input type="number" id="th-roi-bump"
							name="<?php echo esc_attr( "{$opt}[thresholds][roi_bump_pct]" ); ?>"
							value="<?php echo esc_attr( $s['thresholds']['roi_bump_pct'] ); ?>"
							min="0" step="1" class="small-text">
						<p class="description"><?php esc_html_e( 'Bump to next tier when ROI exceeds this percentage.', 'doqix-roi-calculator' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="th-eff-bump"><?php esc_html_e( 'Efficiency bump %', 'doqix-roi-calculator' ); ?></label></th>
					<td>
						<input type="number" id="th-eff-bump"
							name="<?php echo esc_attr( "{$opt}[thresholds][efficiency_bump_pct]" ); ?>"
							value="<?php echo esc_attr( $s['thresholds']['efficiency_bump_pct'] ); ?>"
							min="0" max="100" step="1" class="small-text">
						<p class="description"><?php esc_html_e( 'Bump tier when efficiency slider value >= this percentage.', 'doqix-roi-calculator' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="th-next-mult"><?php esc_html_e( 'Next tier multiplier', 'doqix-roi-calculator' ); ?></label></th>
					<td>
						<input type="number" id="th-next-mult"
							name="<?php echo esc_attr( "{$opt}[thresholds][next_tier_multiplier]" ); ?>"
							value="<?php echo esc_attr( $s['thresholds']['next_tier_multiplier'] ); ?>"
							min="1" step="1" class="small-text">
						<p class="description"><?php esc_html_e( 'Only bump if savings >= next tier price x this multiplier.', 'doqix-roi-calculator' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="th-roi-cap"><?php esc_html_e( 'ROI display cap', 'doqix-roi-calculator' ); ?></label></th>
					<td>
						<input type="number" id="th-roi-cap"
							name="<?php echo esc_attr( "{$opt}[thresholds][roi_cap_display]" ); ?>"
							value="<?php echo esc_attr( $s['thresholds']['roi_cap_display'] ); ?>"
							min="1" step="1" class="small-text">
						<p class="description"><?php esc_html_e( 'Show "Nx+" when ROI multiplier exceeds this value.', 'doqix-roi-calculator' ); ?></p>
					</td>
				</tr>
			</table>

			<?php
			/* Pass through existing presets as hidden fields so they are not lost on global-tab save */
			$all = $this->get_settings();
			if ( isset( $all['presets'] ) && is_array( $all['presets'] ) ) {
				foreach ( $all['presets'] as $slug => $preset ) {
					foreach ( $preset as $pk => $pv ) {
						echo '<input type="hidden" name="' . esc_attr( "{$opt}[presets][{$slug}][{$pk}]" ) . '" value="' . esc_attr( $pv ) . '">';
					}
				}
			}
			?>

			<?php submit_button(); ?>
		</form>
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
			<p><?php esc_html_e( 'The ROI calculator uses a role-based formula driven by the sliders configured in the Global tab. Each slider has a role that determines how its value feeds into the savings calculation.', 'doqix-roi-calculator' ); ?></p>

			<!-- Slider Roles -->
			<h3><?php esc_html_e( 'Slider Roles', 'doqix-roi-calculator' ); ?></h3>
			<table class="widefat striped" style="max-width:860px;">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Role', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'How it works', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Example', 'doqix-roi-calculator' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><strong><?php esc_html_e( 'Multiplier', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'All multiplier slider values are multiplied together. The product represents the total weekly hours of repetitive work across the team.', 'doqix-roi-calculator' ); ?></td>
						<td><code>3 people x 8 hrs/week = 24 hrs/week</code></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Efficiency (%)', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'Converted to a decimal (divided by 100) and multiplied together. Represents the percentage of manual work that automation can realistically handle.', 'doqix-roi-calculator' ); ?></td>
						<td><code>70% &rarr; 0.70</code></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Hourly Rate', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'All rate slider values are summed. The total is the cost per hour of the manual work being automated.', 'doqix-roi-calculator' ); ?></td>
						<td><code>R150/hr</code></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Monthly Flat Amount', 'doqix-roi-calculator' ); ?></strong></td>
						<td><?php esc_html_e( 'All flat monthly values are summed and added directly to the monthly savings. Covers fixed recurring costs like error correction, rework, or licence fees.', 'doqix-roi-calculator' ); ?></td>
						<td><code>R2 000 error cost/month</code></td>
					</tr>
				</tbody>
			</table>

			<!-- Core Formula -->
			<h3><?php esc_html_e( 'Core Formula', 'doqix-roi-calculator' ); ?></h3>
			<div style="background:#f6f7f7;border:1px solid #c3c4c7;border-radius:4px;padding:16px 20px;font-family:monospace;font-size:13px;line-height:2;">
				<strong>1.</strong> <?php esc_html_e( 'Hours Saved / Month', 'doqix-roi-calculator' ); ?> = (<em><?php esc_html_e( 'Multiplier Product', 'doqix-roi-calculator' ); ?></em>) &times; 4.33 &times; (<em><?php esc_html_e( 'Efficiency Product', 'doqix-roi-calculator' ); ?></em>)<br>
				<strong>2.</strong> <?php esc_html_e( 'Monthly Savings', 'doqix-roi-calculator' ); ?> = (<em><?php esc_html_e( 'Hours Saved / Month', 'doqix-roi-calculator' ); ?></em> &times; <em><?php esc_html_e( 'Rate Sum', 'doqix-roi-calculator' ); ?></em>) + <em><?php esc_html_e( 'Flat Monthly Sum', 'doqix-roi-calculator' ); ?></em><br>
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
						<td><?php esc_html_e( 'Multiplier Product', 'doqix-roi-calculator' ); ?></td>
						<td><code>3 people &times; 8 hours = 24 hrs/week</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Efficiency Product', 'doqix-roi-calculator' ); ?></td>
						<td><code>70% &rarr; 0.70</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Hours Saved / Month', 'doqix-roi-calculator' ); ?></td>
						<td><code>24 &times; 4.33 &times; 0.70 = 72.7 hrs</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Rate Sum', 'doqix-roi-calculator' ); ?></td>
						<td><code>R150/hr</code></td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Flat Monthly Sum', 'doqix-roi-calculator' ); ?></td>
						<td><code>R2 000</code></td>
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
				<li><?php esc_html_e( 'Tiers are sorted by threshold (ascending). The highest tier whose threshold the monthly savings meets or exceeds is selected as the base match.', 'doqix-roi-calculator' ); ?></li>
				<li><strong><?php esc_html_e( 'ROI Bump:', 'doqix-roi-calculator' ); ?></strong> <?php printf(
					/* translators: %s = ROI bump percentage setting */
					esc_html__( 'If the ROI percentage exceeds the "ROI bump" setting (%s%%), the calculator bumps the recommendation to the next tier. This indicates the client is getting exceptional value and could benefit from a higher-tier plan.', 'doqix-roi-calculator' ),
					esc_html( $s['thresholds']['roi_bump_pct'] )
				); ?></li>
				<li><strong><?php esc_html_e( 'Efficiency Bump:', 'doqix-roi-calculator' ); ?></strong> <?php printf(
					/* translators: %1$s = efficiency bump %, %2$s = next tier multiplier */
					esc_html__( 'If the efficiency slider is at or above %1$s%% AND monthly savings are at least %2$sx the next tier\'s price (or the next tier is Enterprise/custom), the recommendation bumps up. High efficiency signals mature automation readiness.', 'doqix-roi-calculator' ),
					esc_html( $s['thresholds']['efficiency_bump_pct'] ),
					esc_html( $s['thresholds']['next_tier_multiplier'] )
				); ?></li>
			</ol>

			<!-- ROI Calculation -->
			<h3><?php esc_html_e( 'ROI Percentage', 'doqix-roi-calculator' ); ?></h3>
			<div style="background:#f6f7f7;border:1px solid #c3c4c7;border-radius:4px;padding:16px 20px;font-family:monospace;font-size:13px;line-height:2;">
				<?php esc_html_e( 'ROI %', 'doqix-roi-calculator' ); ?> = ((<em><?php esc_html_e( 'Monthly Savings', 'doqix-roi-calculator' ); ?></em> &minus; <em><?php esc_html_e( 'Tier Price', 'doqix-roi-calculator' ); ?></em>) / <em><?php esc_html_e( 'Tier Price', 'doqix-roi-calculator' ); ?></em>) &times; 100
			</div>
			<p class="description" style="margin-top:8px;">
				<?php printf(
					/* translators: %s = ROI cap display value */
					esc_html__( 'When the ROI multiplier exceeds %sx, it displays as "%sx+" to avoid unrealistically large numbers. Enterprise tiers (price = 0) show a custom pricing message instead of ROI.', 'doqix-roi-calculator' ),
					esc_html( $s['thresholds']['roi_cap_display'] ),
					esc_html( $s['thresholds']['roi_cap_display'] )
				); ?>
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
					<?php foreach ( $s['tiers'] as $tier ) : ?>
					<tr>
						<td><?php echo esc_html( $tier['name'] ); ?></td>
						<td><?php echo $tier['price'] > 0 ? 'R' . esc_html( number_format( $tier['price'] ) ) : esc_html__( 'Custom', 'doqix-roi-calculator' ); ?></td>
						<td>R<?php echo esc_html( number_format( $tier['threshold'] ) ); ?>+</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<h4><?php esc_html_e( 'Sliders', 'doqix-roi-calculator' ); ?></h4>
			<table class="widefat striped" style="max-width:860px;">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Label', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Role', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Default', 'doqix-roi-calculator' ); ?></th>
						<th><?php esc_html_e( 'Range', 'doqix-roi-calculator' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $s['sliders'] as $slider ) : ?>
					<tr>
						<td><?php echo esc_html( $slider['label'] ); ?></td>
						<td><?php echo esc_html( $slider['role'] ); ?></td>
						<td><?php echo esc_html( $slider['prefix'] . $slider['default'] . $slider['suffix'] ); ?></td>
						<td><?php echo esc_html( $slider['prefix'] . $slider['min'] . $slider['suffix'] . ' – ' . $slider['prefix'] . $slider['max'] . $slider['suffix'] ); ?></td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<h4 style="margin-top:20px;"><?php esc_html_e( 'Threshold Settings', 'doqix-roi-calculator' ); ?></h4>
			<table class="widefat striped" style="max-width:860px;">
				<tbody>
					<tr>
						<td><?php esc_html_e( 'ROI bump %', 'doqix-roi-calculator' ); ?></td>
						<td><?php echo esc_html( $s['thresholds']['roi_bump_pct'] ); ?>%</td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Efficiency bump %', 'doqix-roi-calculator' ); ?></td>
						<td><?php echo esc_html( $s['thresholds']['efficiency_bump_pct'] ); ?>%</td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'Next tier multiplier', 'doqix-roi-calculator' ); ?></td>
						<td><?php echo esc_html( $s['thresholds']['next_tier_multiplier'] ); ?>x</td>
					</tr>
					<tr>
						<td><?php esc_html_e( 'ROI display cap', 'doqix-roi-calculator' ); ?></td>
						<td><?php echo esc_html( $s['thresholds']['roi_cap_display'] ); ?>x</td>
					</tr>
				</tbody>
			</table>

		</div>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Preset tab: content, colors, CTA, display
	 * ──────────────────────────────────────────── */

	private function render_preset_tab( $slug, $preset, $opt ) {
		$preset_defaults = doqix_roi_v2_get_preset_defaults();
		$p = wp_parse_args( $preset, $preset_defaults );

		/* Delete link (not for default) */
		if ( 'default' !== $slug ) {
			$delete_url = wp_nonce_url(
				add_query_arg( array(
					'page' => 'doqix-roi-calculator-v2',
					'doqix_roi_v2_delete_preset' => $slug,
				), admin_url( 'admin.php' ) ),
				'doqix_roi_v2_delete_preset'
			);
			$sc = '[doqix_roi_calculator_v2 preset="' . esc_attr( $slug ) . '"]';
			echo '<div style="background:#f0f0f1;padding:12px 16px;margin:16px 0;border-radius:4px;display:flex;align-items:center;gap:10px;">'
				. '<strong>' . esc_html__( 'Shortcode:', 'doqix-roi-calculator' ) . '</strong> '
				. '<code id="doqix-v2-shortcode-text">' . $sc . '</code>'
				. '<button type="button" class="button button-small" id="doqix-v2-copy-shortcode" onclick="navigator.clipboard.writeText(document.getElementById(\'doqix-v2-shortcode-text\').textContent).then(function(){var b=document.getElementById(\'doqix-v2-copy-shortcode\');b.textContent=\'Copied!\';setTimeout(function(){b.textContent=\'Copy\';},1500);});">Copy</button>'
				. '</div>';
			echo '<p><a href="' . esc_url( $delete_url ) . '" class="button button-link-delete" onclick="return confirm(\'' . esc_js( __( 'Delete this preset?', 'doqix-roi-calculator' ) ) . '\');">'
				. esc_html__( 'Delete this preset', 'doqix-roi-calculator' ) . '</a></p>';
		} else {
			$sc = '[doqix_roi_calculator_v2]';
			echo '<div style="background:#f0f0f1;padding:12px 16px;margin:16px 0;border-radius:4px;display:flex;align-items:center;gap:10px;">'
				. '<strong>' . esc_html__( 'Shortcode:', 'doqix-roi-calculator' ) . '</strong> '
				. '<code id="doqix-v2-shortcode-text">' . $sc . '</code>'
				. '<button type="button" class="button button-small" id="doqix-v2-copy-shortcode" onclick="navigator.clipboard.writeText(document.getElementById(\'doqix-v2-shortcode-text\').textContent).then(function(){var b=document.getElementById(\'doqix-v2-copy-shortcode\');b.textContent=\'Copied!\';setTimeout(function(){b.textContent=\'Copy\';},1500);});">Copy</button>'
				. '</div>';
		}
		?>
		<form method="post" action="options.php">
			<?php settings_fields( 'doqix_roi_v2_settings_group' ); ?>

			<?php
			/* Pass through global settings as hidden fields */
			$all = $this->get_settings();
			foreach ( array( 'tiers', 'sliders' ) as $global_key ) {
				if ( isset( $all[ $global_key ] ) && is_array( $all[ $global_key ] ) ) {
					foreach ( $all[ $global_key ] as $gi => $row ) {
						foreach ( $row as $rk => $rv ) {
							echo '<input type="hidden" name="' . esc_attr( "{$opt}[{$global_key}][{$gi}][{$rk}]" ) . '" value="' . esc_attr( $rv ) . '">';
						}
					}
				}
			}
			if ( isset( $all['thresholds'] ) && is_array( $all['thresholds'] ) ) {
				foreach ( $all['thresholds'] as $tk => $tv ) {
					echo '<input type="hidden" name="' . esc_attr( "{$opt}[thresholds][{$tk}]" ) . '" value="' . esc_attr( $tv ) . '">';
				}
			}

			/* Pass through OTHER presets as hidden fields */
			if ( isset( $all['presets'] ) && is_array( $all['presets'] ) ) {
				foreach ( $all['presets'] as $other_slug => $other_preset ) {
					if ( $other_slug === $slug ) {
						continue;
					}
					foreach ( $other_preset as $pk => $pv ) {
						echo '<input type="hidden" name="' . esc_attr( "{$opt}[presets][{$other_slug}][{$pk}]" ) . '" value="' . esc_attr( $pv ) . '">';
					}
				}
			}
			?>

			<!-- Preset label (hidden for default) -->
			<?php if ( 'default' !== $slug ) : ?>
			<table class="form-table">
				<tr>
					<th scope="row"><label><?php esc_html_e( 'Preset Label', 'doqix-roi-calculator' ); ?></label></th>
					<td><input type="text" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][label]" ); ?>" value="<?php echo esc_attr( $p['label'] ); ?>" class="regular-text"></td>
				</tr>
			</table>
			<?php else : ?>
			<input type="hidden" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][label]" ); ?>" value="<?php echo esc_attr( $p['label'] ); ?>">
			<?php endif; ?>

			<!-- ═══════════════ CONTENT ═══════════════ -->
			<h2><?php esc_html_e( 'Content', 'doqix-roi-calculator' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Configure the heading and intro text shown above the calculator.', 'doqix-roi-calculator' ); ?></p>

			<table class="form-table">
				<tr>
					<th scope="row"><label><?php esc_html_e( 'Heading', 'doqix-roi-calculator' ); ?></label></th>
					<td><?php wp_editor( $p['heading_text'], 'doqix_roi_v2_heading_' . $slug, array(
						'textarea_name' => "{$opt}[presets][{$slug}][heading_text]",
						'teeny'         => false,
						'media_buttons' => false,
						'textarea_rows' => 3,
					) ); ?></td>
				</tr>
				<tr>
					<th scope="row"><label><?php esc_html_e( 'Intro Text', 'doqix-roi-calculator' ); ?></label></th>
					<td><?php wp_editor( $p['intro_text'], 'doqix_roi_v2_intro_' . $slug, array(
						'textarea_name' => "{$opt}[presets][{$slug}][intro_text]",
						'teeny'         => false,
						'media_buttons' => false,
						'textarea_rows' => 5,
					) ); ?></td>
				</tr>
			</table>

			<!-- ═══════════════ COLORS ═══════════════ -->
			<h2><?php esc_html_e( 'Colors & Style', 'doqix-roi-calculator' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Customize every color in the calculator. Empty fields inherit from your theme. The preview updates live as you pick colors.', 'doqix-roi-calculator' ); ?></p>

			<?php
			/* ── Color groups definition ── */
			$color_groups = array(
				'Accent & Cards' => array(
					array( 'key' => 'color_accent',       'label' => 'Accent (sliders, highlights)', 'var' => '--roi-accent',        'default' => '#0886B5' ),
					array( 'key' => 'color_card_bg',       'label' => 'Card Background',              'var' => '--roi-card-bg',       'default' => '#ffffff' ),
					array( 'key' => 'color_card_border',   'label' => 'Card Border',                  'var' => '--roi-line',          'default' => '#e0e0e0' ),
					array( 'key' => 'color_heading_text',  'label' => 'Heading Text',                 'var' => '--roi-heading-text',  'default' => '#1d2327' ),
					array( 'key' => 'color_body_text',     'label' => 'Body / Intro Text',            'var' => '--roi-body-text',     'default' => '#555555' ),
				),
				'Sliders' => array(
					array( 'key' => 'color_slider_track',  'label' => 'Track (unfilled)',  'var' => '--roi-slider-track',  'default' => '#d9dee2' ),
					array( 'key' => 'color_slider_label',  'label' => 'Label Text',        'var' => '--roi-slider-label',  'default' => '#1d2327' ),
				),
				'Hero Result' => array(
					array( 'key' => 'color_hero_bg',     'label' => 'Background',   'var' => '--roi-hero-bg',     'default' => '#ffffff' ),
					array( 'key' => 'color_hero_value',  'label' => 'Amount Text',  'var' => '--roi-hero-value',  'default' => '#1d2327' ),
					array( 'key' => 'color_hero_label',  'label' => 'Label Text',   'var' => '--roi-hero-label',  'default' => '#666666' ),
				),
				'Result Cards' => array(
					array( 'key' => 'color_result_value',  'label' => 'Value Text',     'var' => '--roi-result-value',  'default' => '#1d2327' ),
					array( 'key' => 'color_result_label',  'label' => 'Label Text',     'var' => '--roi-result-label',  'default' => '#666666' ),
					array( 'key' => 'color_roi_highlight', 'label' => 'ROI Multiplier', 'var' => '--roi-highlight',     'default' => '#0886B5' ),
					array( 'key' => 'color_tier_text',     'label' => 'Tier Suggestion','var' => '--roi-tier-text',     'default' => '#555555' ),
				),
				'CTA Button' => array(
					array( 'key' => 'color_cta',            'label' => 'Background',       'var' => '--roi-action',         'default' => '#0886B5' ),
					array( 'key' => 'color_cta_text',       'label' => 'Text',             'var' => '--roi-cta-text',       'default' => '#ffffff' ),
					array( 'key' => 'color_cta_hover_bg',   'label' => 'Hover Background', 'var' => '--roi-cta-hover-bg',   'default' => '#076d94' ),
					array( 'key' => 'color_cta_hover_text', 'label' => 'Hover Text',       'var' => '--roi-cta-hover-text', 'default' => '#ffffff' ),
				),
				'Share Button' => array(
					array( 'key' => 'color_share_text', 'label' => 'Text & Border', 'var' => '--roi-share-text', 'default' => '#0886B5' ),
				),
				'Tooltips' => array(
					array( 'key' => 'color_tooltip_bg',   'label' => 'Background', 'var' => '--roi-tooltip-bg',   'default' => '#1a1a1a' ),
					array( 'key' => 'color_tooltip_text', 'label' => 'Text',       'var' => '--roi-tooltip-text', 'default' => '#ffffff' ),
				),
				'Misc' => array(
					array( 'key' => 'color_footnote', 'label' => 'Footnote', 'var' => '--roi-footnote', 'default' => '#999999' ),
				),
			);
			?>

			<div class="doqix-roi-colours-layout">
				<!-- Left column: color pickers -->
				<div class="doqix-roi-colours-panel">
					<?php foreach ( $color_groups as $group_label => $fields ) : ?>
					<div class="doqix-roi-color-group">
						<h4><?php echo esc_html( $group_label ); ?></h4>
						<div class="doqix-roi-color-grid">
							<?php foreach ( $fields as $field ) :
								$val            = isset( $p[ $field['key'] ] ) ? $p[ $field['key'] ] : '';
								$display_val    = ! empty( $val ) ? $val : $field['default'];
								$is_default     = empty( $val );
							?>
							<div class="doqix-roi-color-field">
								<label><?php echo esc_html( $field['label'] ); ?></label>
								<span class="doqix-color-swatch">
									<input type="color"
										name="<?php echo esc_attr( "{$opt}[presets][{$slug}][{$field['key']}]" ); ?>"
										value="<?php echo esc_attr( $display_val ); ?>"
										data-var="<?php echo esc_attr( $field['var'] ); ?>"
										data-visual-default="<?php echo esc_attr( $field['default'] ); ?>"
										<?php if ( $is_default ) echo 'data-is-default="1"'; ?>>
									<code><?php echo $is_default ? esc_html__( 'Theme default', 'doqix-roi-calculator' ) : esc_html( $val ); ?></code>
									<?php if ( ! $is_default ) : ?>
									<button type="button" class="button-link doqix-roi-reset-color">&times;</button>
									<?php endif; ?>
								</span>
							</div>
							<?php endforeach; ?>
						</div>
					</div>
					<?php endforeach; ?>

					<!-- Style Controls -->
					<div class="doqix-roi-color-group">
						<h4><?php esc_html_e( 'Style Controls', 'doqix-roi-calculator' ); ?></h4>
						<div class="doqix-roi-style-controls">
							<div class="doqix-roi-style-field">
								<label><?php esc_html_e( 'Card Border Radius (px)', 'doqix-roi-calculator' ); ?></label>
								<input type="number"
									name="<?php echo esc_attr( "{$opt}[presets][{$slug}][card_border_radius]" ); ?>"
									value="<?php echo esc_attr( $p['card_border_radius'] ?? 8 ); ?>"
									min="0" max="24" step="1" class="small-text"
									data-preview-var="--roi-radius"
									data-preview-suffix="px">
							</div>
							<div class="doqix-roi-style-field">
								<label><?php esc_html_e( 'Card Shadow', 'doqix-roi-calculator' ); ?></label>
								<div class="doqix-roi-shadow-radios">
									<?php
									$shadow_val = $p['card_shadow'] ?? 'subtle';
									$shadow_options = array( 'none' => 'None', 'subtle' => 'Subtle', 'medium' => 'Medium', 'strong' => 'Strong' );
									foreach ( $shadow_options as $sval => $slabel ) : ?>
									<label>
										<input type="radio"
											name="<?php echo esc_attr( "{$opt}[presets][{$slug}][card_shadow]" ); ?>"
											value="<?php echo esc_attr( $sval ); ?>"
											<?php checked( $shadow_val, $sval ); ?>>
										<?php echo esc_html( $slabel ); ?>
									</label>
									<?php endforeach; ?>
								</div>
							</div>
							<div class="doqix-roi-style-field">
								<label><?php esc_html_e( 'CTA Border Radius (px)', 'doqix-roi-calculator' ); ?></label>
								<input type="number"
									name="<?php echo esc_attr( "{$opt}[presets][{$slug}][cta_border_radius]" ); ?>"
									value="<?php echo esc_attr( $p['cta_border_radius'] ?? 8 ); ?>"
									min="0" max="24" step="1" class="small-text"
									data-preview-var="--roi-cta-radius"
									data-preview-suffix="px">
							</div>
						</div>
					</div>
				</div>

				<!-- Right column: live preview -->
				<div class="doqix-roi-preview-area">
					<div class="doqix-roi-preview-label"><?php esc_html_e( 'LIVE PREVIEW', 'doqix-roi-calculator' ); ?></div>
					<div class="doqix-roi-preview" id="doqix-roi-preview"
						style="
							--roi-accent:<?php echo esc_attr( ! empty( $p['color_accent'] ) ? $p['color_accent'] : '#0886B5' ); ?>;
							--roi-action:<?php echo esc_attr( ! empty( $p['color_cta'] ) ? $p['color_cta'] : '#0886B5' ); ?>;
							--roi-card-bg:<?php echo esc_attr( ! empty( $p['color_card_bg'] ) ? $p['color_card_bg'] : '#ffffff' ); ?>;
							--roi-line:<?php echo esc_attr( ! empty( $p['color_card_border'] ) ? $p['color_card_border'] : '#e0e0e0' ); ?>;
							--roi-heading-text:<?php echo esc_attr( ! empty( $p['color_heading_text'] ) ? $p['color_heading_text'] : '#1d2327' ); ?>;
							--roi-body-text:<?php echo esc_attr( ! empty( $p['color_body_text'] ) ? $p['color_body_text'] : '#555555' ); ?>;
							--roi-slider-track:<?php echo esc_attr( ! empty( $p['color_slider_track'] ) ? $p['color_slider_track'] : '#d9dee2' ); ?>;
							--roi-slider-label:<?php echo esc_attr( ! empty( $p['color_slider_label'] ) ? $p['color_slider_label'] : '#1d2327' ); ?>;
							--roi-hero-bg:<?php echo esc_attr( ! empty( $p['color_hero_bg'] ) ? $p['color_hero_bg'] : '#ffffff' ); ?>;
							--roi-hero-value:<?php echo esc_attr( ! empty( $p['color_hero_value'] ) ? $p['color_hero_value'] : '#1d2327' ); ?>;
							--roi-hero-label:<?php echo esc_attr( ! empty( $p['color_hero_label'] ) ? $p['color_hero_label'] : '#666666' ); ?>;
							--roi-result-value:<?php echo esc_attr( ! empty( $p['color_result_value'] ) ? $p['color_result_value'] : '#1d2327' ); ?>;
							--roi-result-label:<?php echo esc_attr( ! empty( $p['color_result_label'] ) ? $p['color_result_label'] : '#666666' ); ?>;
							--roi-highlight:<?php echo esc_attr( ! empty( $p['color_roi_highlight'] ) ? $p['color_roi_highlight'] : '#0886B5' ); ?>;
							--roi-tier-text:<?php echo esc_attr( ! empty( $p['color_tier_text'] ) ? $p['color_tier_text'] : '#555555' ); ?>;
							--roi-cta-text:<?php echo esc_attr( ! empty( $p['color_cta_text'] ) ? $p['color_cta_text'] : '#ffffff' ); ?>;
							--roi-cta-hover-bg:<?php echo esc_attr( ! empty( $p['color_cta_hover_bg'] ) ? $p['color_cta_hover_bg'] : '#076d94' ); ?>;
							--roi-cta-hover-text:<?php echo esc_attr( ! empty( $p['color_cta_hover_text'] ) ? $p['color_cta_hover_text'] : '#ffffff' ); ?>;
							--roi-share-text:<?php echo esc_attr( ! empty( $p['color_share_text'] ) ? $p['color_share_text'] : '#0886B5' ); ?>;
							--roi-footnote:<?php echo esc_attr( ! empty( $p['color_footnote'] ) ? $p['color_footnote'] : '#999999' ); ?>;
							--roi-tooltip-bg:<?php echo esc_attr( ! empty( $p['color_tooltip_bg'] ) ? $p['color_tooltip_bg'] : '#1a1a1a' ); ?>;
							--roi-tooltip-text:<?php echo esc_attr( ! empty( $p['color_tooltip_text'] ) ? $p['color_tooltip_text'] : '#ffffff' ); ?>;
							--roi-radius:<?php echo intval( $p['card_border_radius'] ?? 8 ); ?>px;
							--roi-shadow:<?php
								$sm = array( 'none' => 'none', 'subtle' => '0 2px 8px rgba(0,0,0,0.08)', 'medium' => '0 4px 16px rgba(0,0,0,0.12)', 'strong' => '0 8px 28px rgba(0,0,0,0.18)' );
								echo esc_attr( $sm[ $p['card_shadow'] ?? 'subtle' ] ?? $sm['subtle'] );
							?>;
							--roi-cta-radius:<?php echo intval( $p['cta_border_radius'] ?? 8 ); ?>px;
						">
						<!-- Mini sliders section -->
						<div class="prev-inputs" style="background:var(--roi-card-bg);border:1px solid var(--roi-line);border-radius:var(--roi-radius);padding:12px;box-shadow:var(--roi-shadow);margin-bottom:10px;">
							<div style="font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;opacity:0.55;margin-bottom:8px;color:var(--roi-slider-label);">Your Team</div>
							<?php for ( $si = 0; $si < 2; $si++ ) : ?>
							<div style="margin-bottom:8px;">
								<div style="display:flex;justify-content:space-between;margin-bottom:3px;">
									<span style="font-size:9px;font-weight:600;color:var(--roi-slider-label);"><?php echo $si === 0 ? 'People doing tasks' : 'Hours per person'; ?></span>
									<span style="font-size:9px;font-weight:700;color:var(--roi-accent);"><?php echo $si === 0 ? '3' : '8 hr'; ?></span>
								</div>
								<div style="height:4px;border-radius:2px;background:var(--roi-slider-track);position:relative;">
									<div style="height:100%;width:40%;border-radius:2px;background:var(--roi-accent);"></div>
									<div style="width:10px;height:10px;border-radius:50%;background:var(--roi-accent);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);position:absolute;top:-3px;left:38%;"></div>
								</div>
							</div>
							<?php endfor; ?>
						</div>

						<!-- Mini hero result -->
						<div class="prev-hero" style="background:var(--roi-hero-bg);border:1px solid var(--roi-line);border-radius:var(--roi-radius);padding:12px;text-align:center;box-shadow:var(--roi-shadow);margin-bottom:10px;">
							<div style="font-weight:700;font-size:22px;line-height:1.1;color:var(--roi-hero-value);">R12,911</div>
							<div style="font-size:9px;color:var(--roi-hero-label);opacity:0.7;margin-top:2px;">Your Monthly Savings</div>
						</div>

						<!-- Mini result cards -->
						<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
							<div style="background:var(--roi-card-bg);border:1px solid var(--roi-line);border-radius:var(--roi-radius);padding:8px;box-shadow:var(--roi-shadow);">
								<div style="font-weight:700;font-size:12px;color:var(--roi-result-value);">R154,930</div>
								<div style="font-size:8px;color:var(--roi-result-label);opacity:0.7;">per year</div>
							</div>
							<div style="background:var(--roi-card-bg);border:1px solid var(--roi-line);border-radius:var(--roi-radius);padding:8px;box-shadow:var(--roi-shadow);">
								<div style="font-weight:700;font-size:12px;color:var(--roi-result-value);">415%</div>
								<div style="font-size:8px;color:var(--roi-result-label);opacity:0.7;">return on investment</div>
							</div>
						</div>

						<!-- Mini tier text -->
						<div style="text-align:center;font-size:8px;color:var(--roi-tier-text);opacity:0.8;margin-bottom:10px;">
							That's <span style="font-weight:700;color:var(--roi-highlight);">5x</span> your investment back.
						</div>

						<!-- Mini CTA button -->
						<div style="background:var(--roi-action);color:var(--roi-cta-text);border-radius:var(--roi-cta-radius);padding:8px;text-align:center;font-weight:700;font-size:10px;margin-bottom:6px;cursor:default;">
							Ready to turn these savings into reality?
							<div style="font-weight:400;font-size:8px;opacity:0.85;margin-top:1px;">We'll walk you through exactly where to start.</div>
						</div>

						<!-- Mini share button -->
						<div style="border:1px solid var(--roi-share-text);color:var(--roi-share-text);border-radius:var(--roi-cta-radius);padding:6px;text-align:center;font-weight:600;font-size:9px;margin-bottom:8px;cursor:default;">
							Share Your Results
						</div>

						<!-- Mini footnote -->
						<div style="font-size:7px;text-align:center;color:var(--roi-footnote);opacity:0.6;">
							*For estimate purposes only.
						</div>
					</div>
				</div>
			</div>

			<!-- ═══════════════ CTA ═══════════════ -->
			<h2><?php esc_html_e( 'Call to Action', 'doqix-roi-calculator' ); ?></h2>
			<?php $cta_on = ! isset( $p['cta_enabled'] ) || ! empty( $p['cta_enabled'] ); ?>
			<table class="form-table">
				<tr>
					<th scope="row"><?php esc_html_e( 'Show CTA Button', 'doqix-roi-calculator' ); ?></th>
					<td>
						<label>
							<input type="checkbox"
								name="<?php echo esc_attr( "{$opt}[presets][{$slug}][cta_enabled]" ); ?>"
								value="1"
								<?php checked( $cta_on ); ?>
								id="doqix-cta-enabled-<?php echo esc_attr( $slug ); ?>"
								onchange="document.getElementById('doqix-cta-fields-<?php echo esc_attr( $slug ); ?>').style.opacity=this.checked?'1':'0.4';document.getElementById('doqix-cta-fields-<?php echo esc_attr( $slug ); ?>').style.pointerEvents=this.checked?'auto':'none';">
							<?php esc_html_e( 'Enabled — uncheck to hide the CTA button on the frontend', 'doqix-roi-calculator' ); ?>
						</label>
					</td>
				</tr>
			</table>
			<div id="doqix-cta-fields-<?php echo esc_attr( $slug ); ?>" style="<?php echo $cta_on ? '' : 'opacity:0.4;pointer-events:none;'; ?>">
			<table class="form-table">
				<tr>
					<th scope="row"><label for="cta-url-<?php echo esc_attr( $slug ); ?>"><?php esc_html_e( 'CTA URL', 'doqix-roi-calculator' ); ?></label></th>
					<td><input type="text" id="cta-url-<?php echo esc_attr( $slug ); ?>" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][cta_url]" ); ?>" value="<?php echo esc_attr( $p['cta_url'] ); ?>" class="regular-text"></td>
				</tr>
				<tr>
					<th scope="row"><label for="cta-text-<?php echo esc_attr( $slug ); ?>"><?php esc_html_e( 'CTA Text', 'doqix-roi-calculator' ); ?></label></th>
					<td><input type="text" id="cta-text-<?php echo esc_attr( $slug ); ?>" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][cta_text]" ); ?>" value="<?php echo esc_attr( $p['cta_text'] ); ?>" class="regular-text"></td>
				</tr>
				<tr>
					<th scope="row"><label for="cta-subtext-<?php echo esc_attr( $slug ); ?>"><?php esc_html_e( 'CTA Subtext', 'doqix-roi-calculator' ); ?></label></th>
					<td><input type="text" id="cta-subtext-<?php echo esc_attr( $slug ); ?>" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][cta_subtext]" ); ?>" value="<?php echo esc_attr( $p['cta_subtext'] ); ?>" class="regular-text"></td>
				</tr>
				<tr>
					<th scope="row"><label for="share-url-<?php echo esc_attr( $slug ); ?>"><?php esc_html_e( 'Share URL', 'doqix-roi-calculator' ); ?></label></th>
					<td><input type="url" id="share-url-<?php echo esc_attr( $slug ); ?>" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][share_url]" ); ?>" value="<?php echo esc_attr( $p['share_url'] ); ?>" class="regular-text"></td>
				</tr>
			</table>
			</div>

			<!-- ═══════════════ DISPLAY ═══════════════ -->
			<h2><?php esc_html_e( 'Display Options', 'doqix-roi-calculator' ); ?></h2>

			<table class="form-table">
				<tr>
					<th scope="row"><?php esc_html_e( 'Show Share Button', 'doqix-roi-calculator' ); ?></th>
					<td>
						<label>
							<input type="checkbox" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][share_enabled]" ); ?>" value="1" <?php checked( ! empty( $p['share_enabled'] ) ); ?>>
							<?php esc_html_e( 'Enabled', 'doqix-roi-calculator' ); ?>
						</label>
					</td>
				</tr>
				<tr>
					<th scope="row"><label><?php esc_html_e( 'Footnote Text', 'doqix-roi-calculator' ); ?></label></th>
					<td>
						<?php wp_editor( $p['footnote_text'], 'doqix_roi_v2_footnote_' . $slug, array(
							'textarea_name' => "{$opt}[presets][{$slug}][footnote_text]",
							'teeny'         => false,
							'media_buttons' => false,
							'textarea_rows' => 3,
						) ); ?>
						<p class="description"><?php esc_html_e( 'Shown centred at the bottom of the calculator. Leave empty to hide.', 'doqix-roi-calculator' ); ?></p>
					</td>
				</tr>
			</table>

			<!-- ═══════════════ SOCIAL SHARE PREVIEW ═══════════════ -->
			<h2><?php esc_html_e( 'Social Share Preview (Open Graph)', 'doqix-roi-calculator' ); ?></h2>

			<table class="form-table">
				<tr>
					<th scope="row"><label for="og-desc-<?php echo esc_attr( $slug ); ?>"><?php esc_html_e( 'OG Description', 'doqix-roi-calculator' ); ?></label></th>
					<td>
						<input type="text" id="og-desc-<?php echo esc_attr( $slug ); ?>" name="<?php echo esc_attr( "{$opt}[presets][{$slug}][og_description]" ); ?>" value="<?php echo esc_attr( $p['og_description'] ?? '' ); ?>" class="large-text" placeholder="<?php esc_attr_e( 'Leave blank to use intro text', 'doqix-roi-calculator' ); ?>">
						<p class="description"><?php esc_html_e( 'Shown in WhatsApp/social media link previews. Leave blank to use the intro text above.', 'doqix-roi-calculator' ); ?></p>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Helpers
	 * ──────────────────────────────────────────── */

	private function get_settings() {
		return $this->deep_parse_args(
			get_option( DOQIX_ROI_V2_OPTION_KEY, array() ),
			doqix_roi_v2_get_defaults()
		);
	}

	/**
	 * Deep merge that preserves array structures (unlike wp_parse_args which is shallow).
	 */
	private function deep_parse_args( $args, $defaults ) {
		if ( ! is_array( $args ) ) {
			return $defaults;
		}

		$result = $defaults;

		foreach ( $defaults as $key => $default_value ) {
			if ( array_key_exists( $key, $args ) ) {
				if ( is_array( $default_value ) && is_array( $args[ $key ] ) ) {
					// For indexed arrays (tiers, sliders), use the saved value directly
					if ( isset( $default_value[0] ) ) {
						$result[ $key ] = $args[ $key ];
					} else {
						// For associative arrays (thresholds, presets), merge
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
}
