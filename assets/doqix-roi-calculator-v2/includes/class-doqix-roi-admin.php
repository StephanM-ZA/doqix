<?php
/**
 * Admin: Settings page for the ROI Calculator V2.
 * Dynamic repeater UI for tiers and sliders.
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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	/* ────────────────────────────────────────────
	 * Menu
	 * ──────────────────────────────────────────── */

	public function add_settings_page() {
		$this->hook = add_menu_page(
			__( 'ROI Calculator', 'doqix-roi-calculator' ),
			__( 'ROI Calculator', 'doqix-roi-calculator' ),
			'manage_options',
			'doqix-roi-calculator',
			array( $this, 'render_settings_page' ),
			'dashicons-calculator',
			80
		);
	}

	/* ────────────────────────────────────────────
	 * Admin CSS + JS — only on our settings page
	 * ──────────────────────────────────────────── */

	public function enqueue_admin_assets( $hook_suffix ) {
		if ( $hook_suffix !== $this->hook ) {
			return;
		}
		wp_enqueue_style(
			'doqix-roi-admin',
			DOQIX_ROI_PLUGIN_URL . 'assets/css/doqix-roi-admin.css',
			array(),
			DOQIX_ROI_VERSION
		);
		wp_enqueue_script(
			'doqix-roi-admin',
			DOQIX_ROI_PLUGIN_URL . 'assets/js/doqix-roi-admin.js',
			array(),
			DOQIX_ROI_VERSION,
			true
		);
	}

	/* ────────────────────────────────────────────
	 * Register settings (Settings API)
	 * ──────────────────────────────────────────── */

	public function register_settings() {
		register_setting(
			'doqix_roi_v2_settings_group',
			DOQIX_ROI_OPTION_KEY,
			array( $this, 'sanitize_settings' )
		);
	}

	/* ────────────────────────────────────────────
	 * Sanitize
	 * ──────────────────────────────────────────── */

	public function sanitize_settings( $input ) {
		$defaults  = doqix_roi_get_defaults();
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

		/* ── Content ── */
		$sanitized['heading_text'] = sanitize_text_field( $input['heading_text'] ?? $defaults['heading_text'] );
		$sanitized['intro_text']   = sanitize_textarea_field( $input['intro_text'] ?? $defaults['intro_text'] );

		/* ── Colors — empty = use theme default ── */
		$sanitized['color_accent'] = isset( $input['color_accent'] ) && '' !== $input['color_accent'] ? sanitize_hex_color( $input['color_accent'] ) : '';
		$sanitized['color_cta']    = isset( $input['color_cta'] ) && '' !== $input['color_cta'] ? sanitize_hex_color( $input['color_cta'] ) : '';

		/* ── CTA ── */
		$sanitized['cta_url']     = esc_url_raw( $input['cta_url'] ?? $defaults['cta_url'] );
		$sanitized['cta_text']    = sanitize_text_field( $input['cta_text'] ?? $defaults['cta_text'] );
		$sanitized['cta_subtext'] = sanitize_text_field( $input['cta_subtext'] ?? $defaults['cta_subtext'] );
		$sanitized['share_url']   = esc_url_raw( $input['share_url'] ?? $defaults['share_url'] );

		/* ── Display ── */
		$sanitized['share_enabled']    = ! empty( $input['share_enabled'] ) ? 1 : 0;
		$sanitized['footnote_text'] = sanitize_text_field( $input['footnote_text'] ?? $defaults['footnote_text'] );

		return $sanitized;
	}

	/* ────────────────────────────────────────────
	 * Render page
	 * ──────────────────────────────────────────── */

	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$s = $this->get_settings();
		$opt = DOQIX_ROI_OPTION_KEY;
		?>
		<div class="wrap doqix-roi-admin">
			<h1><?php esc_html_e( 'Do.Qix ROI Calculator Settings', 'doqix-roi-calculator' ); ?></h1>
			<p><?php esc_html_e( 'Use the shortcode [doqix_roi_calculator] to display the calculator on any page or post.', 'doqix-roi-calculator' ); ?></p>

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

				<!-- ═══════════════ CONTENT ═══════════════ -->
				<h2><?php esc_html_e( 'Content', 'doqix-roi-calculator' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Configure the heading and intro text shown above the calculator.', 'doqix-roi-calculator' ); ?></p>

				<table class="form-table">
					<tr>
						<th scope="row"><label for="heading-text"><?php esc_html_e( 'Heading', 'doqix-roi-calculator' ); ?></label></th>
						<td><input type="text" id="heading-text" name="<?php echo esc_attr( "{$opt}[heading_text]" ); ?>" value="<?php echo esc_attr( $s['heading_text'] ); ?>" class="regular-text"></td>
					</tr>
					<tr>
						<th scope="row"><label for="intro-text"><?php esc_html_e( 'Intro Text', 'doqix-roi-calculator' ); ?></label></th>
						<td><textarea id="intro-text" name="<?php echo esc_attr( "{$opt}[intro_text]" ); ?>" class="large-text" rows="3"><?php echo esc_textarea( $s['intro_text'] ); ?></textarea></td>
					</tr>
				</table>

				<!-- ═══════════════ COLORS ═══════════════ -->
				<h2><?php esc_html_e( 'Colors', 'doqix-roi-calculator' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Customize the slider accent and CTA button colors to match your theme.', 'doqix-roi-calculator' ); ?></p>

				<?php
				$accent_val = $s['color_accent'];
				$cta_val    = $s['color_cta'];
				$accent_display = ! empty( $accent_val ) ? $accent_val : '#0886B5';
				$cta_display    = ! empty( $cta_val )    ? $cta_val    : '#0886B5';
				?>
				<table class="form-table">
					<tr>
						<th scope="row"><label for="color-accent"><?php esc_html_e( 'Slider Accent Color', 'doqix-roi-calculator' ); ?></label></th>
						<td>
							<span class="doqix-color-field">
								<input type="color" id="color-accent"
									name="<?php echo esc_attr( "{$opt}[color_accent]" ); ?>"
									value="<?php echo esc_attr( $accent_display ); ?>"
									<?php if ( empty( $accent_val ) ) echo 'data-is-default="1"'; ?>>
								<?php if ( ! empty( $accent_val ) ) : ?>
								<code><?php echo esc_html( $accent_val ); ?></code>
								<button type="button" class="button-link doqix-reset-color" data-target="color-accent"><?php esc_html_e( 'Reset to theme default', 'doqix-roi-calculator' ); ?></button>
								<?php else : ?>
								<code><?php esc_html_e( 'Theme default', 'doqix-roi-calculator' ); ?></code>
								<?php endif; ?>
							</span>
							<p class="description"><?php esc_html_e( 'Used for slider thumbs, track fill, value display, and ROI multiplier text.', 'doqix-roi-calculator' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="color-cta"><?php esc_html_e( 'CTA Button Color', 'doqix-roi-calculator' ); ?></label></th>
						<td>
							<span class="doqix-color-field">
								<input type="color" id="color-cta"
									name="<?php echo esc_attr( "{$opt}[color_cta]" ); ?>"
									value="<?php echo esc_attr( $cta_display ); ?>"
									<?php if ( empty( $cta_val ) ) echo 'data-is-default="1"'; ?>>
								<?php if ( ! empty( $cta_val ) ) : ?>
								<code><?php echo esc_html( $cta_val ); ?></code>
								<button type="button" class="button-link doqix-reset-color" data-target="color-cta"><?php esc_html_e( 'Reset to theme default', 'doqix-roi-calculator' ); ?></button>
								<?php else : ?>
								<code><?php esc_html_e( 'Theme default', 'doqix-roi-calculator' ); ?></code>
								<?php endif; ?>
							</span>
							<p class="description"><?php esc_html_e( 'Used for the CTA button background and share button outline.', 'doqix-roi-calculator' ); ?></p>
						</td>
					</tr>
				</table>

				<!-- ═══════════════ CTA ═══════════════ -->
				<h2><?php esc_html_e( 'Call to Action', 'doqix-roi-calculator' ); ?></h2>

				<table class="form-table">
					<tr>
						<th scope="row"><label for="cta-url"><?php esc_html_e( 'CTA URL', 'doqix-roi-calculator' ); ?></label></th>
						<td><input type="url" id="cta-url" name="<?php echo esc_attr( "{$opt}[cta_url]" ); ?>" value="<?php echo esc_attr( $s['cta_url'] ); ?>" class="regular-text"></td>
					</tr>
					<tr>
						<th scope="row"><label for="cta-text"><?php esc_html_e( 'CTA Text', 'doqix-roi-calculator' ); ?></label></th>
						<td><input type="text" id="cta-text" name="<?php echo esc_attr( "{$opt}[cta_text]" ); ?>" value="<?php echo esc_attr( $s['cta_text'] ); ?>" class="regular-text"></td>
					</tr>
					<tr>
						<th scope="row"><label for="cta-subtext"><?php esc_html_e( 'CTA Subtext', 'doqix-roi-calculator' ); ?></label></th>
						<td><input type="text" id="cta-subtext" name="<?php echo esc_attr( "{$opt}[cta_subtext]" ); ?>" value="<?php echo esc_attr( $s['cta_subtext'] ); ?>" class="regular-text"></td>
					</tr>
					<tr>
						<th scope="row"><label for="share-url"><?php esc_html_e( 'Share URL', 'doqix-roi-calculator' ); ?></label></th>
						<td><input type="url" id="share-url" name="<?php echo esc_attr( "{$opt}[share_url]" ); ?>" value="<?php echo esc_attr( $s['share_url'] ); ?>" class="regular-text"></td>
					</tr>
				</table>

				<!-- ═══════════════ DISPLAY ═══════════════ -->
				<h2><?php esc_html_e( 'Display Options', 'doqix-roi-calculator' ); ?></h2>

				<table class="form-table">
					<tr>
						<th scope="row"><?php esc_html_e( 'Show Share Button', 'doqix-roi-calculator' ); ?></th>
						<td>
							<label>
								<input type="checkbox" name="<?php echo esc_attr( "{$opt}[share_enabled]" ); ?>" value="1" <?php checked( ! empty( $s['share_enabled'] ) ); ?>>
								<?php esc_html_e( 'Enabled', 'doqix-roi-calculator' ); ?>
							</label>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="footnote-text"><?php esc_html_e( 'Footnote Text', 'doqix-roi-calculator' ); ?></label></th>
						<td>
							<input type="text" id="footnote-text" name="<?php echo esc_attr( "{$opt}[footnote_text]" ); ?>" value="<?php echo esc_attr( $s['footnote_text'] ); ?>" class="large-text">
							<p class="description"><?php esc_html_e( 'Shown centred at the bottom of the calculator. Leave empty to hide.', 'doqix-roi-calculator' ); ?></p>
						</td>
					</tr>
				</table>

				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Helper
	 * ──────────────────────────────────────────── */

	private function get_settings() {
		return $this->deep_parse_args(
			get_option( DOQIX_ROI_OPTION_KEY, array() ),
			doqix_roi_get_defaults()
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
						// For associative arrays (thresholds), merge
						$result[ $key ] = $this->deep_parse_args( $args[ $key ], $default_value );
					}
				} else {
					$result[ $key ] = $args[ $key ];
				}
			}
		}

		return $result;
	}
}
