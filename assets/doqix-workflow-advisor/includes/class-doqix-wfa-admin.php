<?php
/**
 * Admin: Settings page for the Workflow Advisor.
 * Dynamic repeater UI for categories, services, and workflows.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_WFA_Admin {

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
			__( 'Workflow Advisor', 'doqix-workflow-advisor' ),
			__( 'Workflow Advisor', 'doqix-workflow-advisor' ),
			'manage_options',
			'doqix-workflow-advisor',
			array( $this, 'render_settings_page' ),
			'dashicons-randomize',
			81
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
			'doqix-wfa-admin',
			DOQIX_WFA_PLUGIN_URL . 'assets/css/doqix-wfa-admin.css',
			array(),
			DOQIX_WFA_VERSION
		);
		wp_enqueue_script(
			'doqix-wfa-admin',
			DOQIX_WFA_PLUGIN_URL . 'assets/js/doqix-wfa-admin.js',
			array(),
			DOQIX_WFA_VERSION,
			true
		);
	}

	/* ────────────────────────────────────────────
	 * Register settings (Settings API)
	 * ──────────────────────────────────────────── */

	public function register_settings() {
		register_setting(
			'doqix_wfa_settings_group',
			DOQIX_WFA_OPTION_KEY,
			array( $this, 'sanitize_settings' )
		);
	}

	/* ────────────────────────────────────────────
	 * Sanitize
	 * ──────────────────────────────────────────── */

	public function sanitize_settings( $input ) {
		$defaults  = doqix_wfa_get_defaults();
		$sanitized = array();

		/* ── Categories ── */
		$sanitized['categories'] = array();
		if ( ! empty( $input['categories'] ) && is_array( $input['categories'] ) ) {
			foreach ( $input['categories'] as $cat ) {
				$name = sanitize_text_field( $cat['name'] ?? '' );
				if ( '' === $name ) {
					continue;
				}
				$key = sanitize_key( $cat['key'] ?? '' );
				if ( '' === $key ) {
					$key = sanitize_key( str_replace( ' ', '-', strtolower( $name ) ) );
				}
				$sanitized['categories'][] = array(
					'key'  => $key,
					'name' => $name,
				);
			}
		}
		if ( empty( $sanitized['categories'] ) ) {
			$sanitized['categories'] = $defaults['categories'];
		}

		/* Build valid category keys for validation */
		$valid_cat_keys = array_column( $sanitized['categories'], 'key' );

		/* ── Services ── */
		$sanitized['services'] = array();
		if ( ! empty( $input['services'] ) && is_array( $input['services'] ) ) {
			foreach ( $input['services'] as $svc ) {
				$name = sanitize_text_field( $svc['name'] ?? '' );
				if ( '' === $name ) {
					continue;
				}
				$key = sanitize_key( $svc['key'] ?? '' );
				if ( '' === $key ) {
					$key = sanitize_key( str_replace( ' ', '-', strtolower( $name ) ) );
				}
				$category = sanitize_key( $svc['category'] ?? '' );
				if ( ! in_array( $category, $valid_cat_keys, true ) ) {
					$category = $valid_cat_keys[0] ?? '';
				}
				$sanitized['services'][] = array(
					'key'      => $key,
					'name'     => $name,
					'category' => $category,
				);
			}
		}
		if ( empty( $sanitized['services'] ) ) {
			$sanitized['services'] = $defaults['services'];
		}

		/* ── Workflows ── */
		$sanitized['workflows'] = array();
		$valid_difficulties = array( 'easy', 'medium', 'hard' );

		if ( ! empty( $input['workflows'] ) && is_array( $input['workflows'] ) ) {
			foreach ( $input['workflows'] as $wf ) {
				$title = sanitize_text_field( $wf['title'] ?? '' );
				if ( '' === $title ) {
					continue;
				}

				$description = sanitize_textarea_field( $wf['description'] ?? '' );
				$hours_saved = absint( $wf['hours_saved'] ?? 0 );
				$difficulty  = in_array( $wf['difficulty'] ?? '', $valid_difficulties, true )
					? $wf['difficulty']
					: 'medium';

				/* Required categories (checkbox group) */
				$wf_cats = array();
				if ( ! empty( $wf['categories'] ) && is_array( $wf['categories'] ) ) {
					foreach ( $wf['categories'] as $cat_key ) {
						$cat_key = sanitize_key( $cat_key );
						if ( in_array( $cat_key, $valid_cat_keys, true ) ) {
							$wf_cats[] = $cat_key;
						}
					}
				}

				/* Steps (sub-repeater) */
				$steps = array();
				if ( ! empty( $wf['steps'] ) && is_array( $wf['steps'] ) ) {
					foreach ( $wf['steps'] as $step ) {
						$label = sanitize_text_field( $step['label'] ?? '' );
						if ( '' === $label ) {
							continue;
						}
						$type = in_array( $step['type'] ?? '', array( 'trigger', 'action' ), true )
							? $step['type']
							: 'action';
						$steps[] = array(
							'label' => $label,
							'type'  => $type,
						);
					}
				}

				$sanitized['workflows'][] = array(
					'title'       => $title,
					'description' => $description,
					'categories'  => $wf_cats,
					'steps'       => $steps,
					'hours_saved' => $hours_saved,
					'difficulty'  => $difficulty,
				);
			}
		}
		if ( empty( $sanitized['workflows'] ) ) {
			$sanitized['workflows'] = $defaults['workflows'];
		}

		/* ── Colors — empty = use theme default ── */
		$sanitized['color_accent'] = isset( $input['color_accent'] ) && '' !== $input['color_accent']
			? sanitize_hex_color( $input['color_accent'] )
			: '';
		$sanitized['color_cta'] = isset( $input['color_cta'] ) && '' !== $input['color_cta']
			? sanitize_hex_color( $input['color_cta'] )
			: '';

		/* ── CTA ── */
		$sanitized['cta_url']     = esc_url_raw( $input['cta_url'] ?? $defaults['cta_url'] );
		$sanitized['cta_text']    = sanitize_text_field( $input['cta_text'] ?? $defaults['cta_text'] );
		$sanitized['cta_subtext'] = sanitize_text_field( $input['cta_subtext'] ?? $defaults['cta_subtext'] );

		/* ── Lead Capture ── */
		$sanitized['lead_form_enabled'] = ! empty( $input['lead_form_enabled'] ) ? 1 : 0;
		$sanitized['lead_form_heading'] = sanitize_text_field( $input['lead_form_heading'] ?? $defaults['lead_form_heading'] );

		/* ── Display ── */
		$sanitized['disclaimer_text'] = sanitize_text_field( $input['disclaimer_text'] ?? $defaults['disclaimer_text'] );

		return $sanitized;
	}

	/* ────────────────────────────────────────────
	 * Render page
	 * ──────────────────────────────────────────── */

	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$s   = $this->get_settings();
		$opt = DOQIX_WFA_OPTION_KEY;

		/* Build category key→name map for dropdowns/checkboxes */
		$cat_map = array();
		foreach ( $s['categories'] as $cat ) {
			$cat_map[ $cat['key'] ] = $cat['name'];
		}
		?>
		<div class="wrap doqix-wfa-admin">
			<h1><?php esc_html_e( 'Do.Qix Workflow Advisor Settings', 'doqix-workflow-advisor' ); ?></h1>
			<p><?php esc_html_e( 'Use the shortcode [doqix_workflow_advisor] to display the advisor on any page or post.', 'doqix-workflow-advisor' ); ?></p>

			<form method="post" action="options.php">
				<?php settings_fields( 'doqix_wfa_settings_group' ); ?>

				<!-- ═══════════════ CATEGORIES ═══════════════ -->
				<h2><?php esc_html_e( 'Categories', 'doqix-workflow-advisor' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Tool categories group services. Workflows require categories, not specific services — so adding a new service to a category automatically works with all related workflows.', 'doqix-workflow-advisor' ); ?></p>

				<table class="widefat doqix-repeater" id="doqix-categories-table">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Key', 'doqix-workflow-advisor' ); ?></th>
							<th><?php esc_html_e( 'Name', 'doqix-workflow-advisor' ); ?></th>
							<th class="doqix-col-action"></th>
						</tr>
					</thead>
					<tbody id="doqix-categories-body">
						<?php foreach ( $s['categories'] as $i => $cat ) : ?>
						<tr class="doqix-repeater-row" data-index="<?php echo esc_attr( $i ); ?>">
							<td>
								<input type="text" name="<?php echo esc_attr( "{$opt}[categories][{$i}][key]" ); ?>"
									value="<?php echo esc_attr( $cat['key'] ); ?>" class="regular-text doqix-cat-key" readonly>
							</td>
							<td>
								<input type="text" name="<?php echo esc_attr( "{$opt}[categories][{$i}][name]" ); ?>"
									value="<?php echo esc_attr( $cat['name'] ); ?>" class="regular-text doqix-cat-name" required>
							</td>
							<td class="doqix-col-action">
								<button type="button" class="button doqix-remove-row"><?php esc_html_e( 'Remove', 'doqix-workflow-advisor' ); ?></button>
							</td>
						</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
				<p><button type="button" class="button" id="doqix-add-category"><?php esc_html_e( '+ Add Category', 'doqix-workflow-advisor' ); ?></button></p>

				<!-- ═══════════════ SERVICES ═══════════════ -->
				<h2><?php esc_html_e( 'Services', 'doqix-workflow-advisor' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Business tools/services that users can select. Each service belongs to one category.', 'doqix-workflow-advisor' ); ?></p>

				<table class="widefat doqix-repeater" id="doqix-services-table">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Key', 'doqix-workflow-advisor' ); ?></th>
							<th><?php esc_html_e( 'Name', 'doqix-workflow-advisor' ); ?></th>
							<th><?php esc_html_e( 'Category', 'doqix-workflow-advisor' ); ?></th>
							<th class="doqix-col-action"></th>
						</tr>
					</thead>
					<tbody id="doqix-services-body">
						<?php foreach ( $s['services'] as $i => $svc ) : ?>
						<tr class="doqix-repeater-row" data-index="<?php echo esc_attr( $i ); ?>">
							<td>
								<input type="text" name="<?php echo esc_attr( "{$opt}[services][{$i}][key]" ); ?>"
									value="<?php echo esc_attr( $svc['key'] ); ?>" class="regular-text doqix-svc-key" readonly>
							</td>
							<td>
								<input type="text" name="<?php echo esc_attr( "{$opt}[services][{$i}][name]" ); ?>"
									value="<?php echo esc_attr( $svc['name'] ); ?>" class="regular-text doqix-svc-name" required>
							</td>
							<td>
								<select name="<?php echo esc_attr( "{$opt}[services][{$i}][category]" ); ?>" class="doqix-svc-category">
									<?php foreach ( $s['categories'] as $cat ) : ?>
									<option value="<?php echo esc_attr( $cat['key'] ); ?>" <?php selected( $svc['category'], $cat['key'] ); ?>>
										<?php echo esc_html( $cat['name'] ); ?>
									</option>
									<?php endforeach; ?>
								</select>
							</td>
							<td class="doqix-col-action">
								<button type="button" class="button doqix-remove-row"><?php esc_html_e( 'Remove', 'doqix-workflow-advisor' ); ?></button>
							</td>
						</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
				<p><button type="button" class="button" id="doqix-add-service"><?php esc_html_e( '+ Add Service', 'doqix-workflow-advisor' ); ?></button></p>

				<!-- ═══════════════ WORKFLOWS ═══════════════ -->
				<h2><?php esc_html_e( 'Workflows', 'doqix-workflow-advisor' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Curated automation workflows. Each workflow specifies which categories it requires — a match is found when the user has selected at least one service from each required category.', 'doqix-workflow-advisor' ); ?></p>

				<div id="doqix-workflows-container">
					<?php foreach ( $s['workflows'] as $i => $wf ) : ?>
					<div class="doqix-workflow-card doqix-repeater-row" data-index="<?php echo esc_attr( $i ); ?>">
						<div class="doqix-workflow-card-header">
							<strong class="doqix-workflow-card-title"><?php echo esc_html( $wf['title'] ?: __( 'New Workflow', 'doqix-workflow-advisor' ) ); ?></strong>
							<button type="button" class="button doqix-remove-row"><?php esc_html_e( 'Remove', 'doqix-workflow-advisor' ); ?></button>
						</div>
						<div class="doqix-workflow-card-body">
							<div class="doqix-field-grid">
								<label>
									<?php esc_html_e( 'Title', 'doqix-workflow-advisor' ); ?>
									<input type="text" name="<?php echo esc_attr( "{$opt}[workflows][{$i}][title]" ); ?>"
										value="<?php echo esc_attr( $wf['title'] ); ?>" class="regular-text doqix-wf-title" required>
								</label>
								<label>
									<?php esc_html_e( 'Hours Saved/Month', 'doqix-workflow-advisor' ); ?>
									<input type="number" name="<?php echo esc_attr( "{$opt}[workflows][{$i}][hours_saved]" ); ?>"
										value="<?php echo esc_attr( $wf['hours_saved'] ); ?>" min="0" class="small-text">
								</label>
								<label>
									<?php esc_html_e( 'Difficulty', 'doqix-workflow-advisor' ); ?>
									<select name="<?php echo esc_attr( "{$opt}[workflows][{$i}][difficulty]" ); ?>">
										<option value="easy" <?php selected( $wf['difficulty'], 'easy' ); ?>><?php esc_html_e( 'Easy', 'doqix-workflow-advisor' ); ?></option>
										<option value="medium" <?php selected( $wf['difficulty'], 'medium' ); ?>><?php esc_html_e( 'Medium', 'doqix-workflow-advisor' ); ?></option>
										<option value="hard" <?php selected( $wf['difficulty'], 'hard' ); ?>><?php esc_html_e( 'Hard', 'doqix-workflow-advisor' ); ?></option>
									</select>
								</label>
							</div>

							<div class="doqix-desc-row">
								<label>
									<?php esc_html_e( 'Description', 'doqix-workflow-advisor' ); ?>
									<textarea name="<?php echo esc_attr( "{$opt}[workflows][{$i}][description]" ); ?>" class="large-text" rows="2"><?php echo esc_textarea( $wf['description'] ); ?></textarea>
								</label>
							</div>

							<div class="doqix-cats-row">
								<span class="doqix-label"><?php esc_html_e( 'Required Categories', 'doqix-workflow-advisor' ); ?></span>
								<div class="doqix-checkbox-group doqix-wf-categories">
									<?php foreach ( $s['categories'] as $cat ) : ?>
									<label>
										<input type="checkbox"
											name="<?php echo esc_attr( "{$opt}[workflows][{$i}][categories][]" ); ?>"
											value="<?php echo esc_attr( $cat['key'] ); ?>"
											<?php checked( in_array( $cat['key'], $wf['categories'] ?? array(), true ) ); ?>>
										<?php echo esc_html( $cat['name'] ); ?>
									</label>
									<?php endforeach; ?>
								</div>
							</div>

							<div class="doqix-steps-row">
								<span class="doqix-label"><?php esc_html_e( 'Flow Steps', 'doqix-workflow-advisor' ); ?></span>
								<table class="doqix-steps-table" data-wf-index="<?php echo esc_attr( $i ); ?>">
									<thead>
										<tr>
											<th><?php esc_html_e( 'Label', 'doqix-workflow-advisor' ); ?></th>
											<th><?php esc_html_e( 'Type', 'doqix-workflow-advisor' ); ?></th>
											<th class="doqix-col-action"></th>
										</tr>
									</thead>
									<tbody>
										<?php foreach ( $wf['steps'] as $j => $step ) : ?>
										<tr class="doqix-step-row" data-step-index="<?php echo esc_attr( $j ); ?>">
											<td>
												<input type="text" name="<?php echo esc_attr( "{$opt}[workflows][{$i}][steps][{$j}][label]" ); ?>"
													value="<?php echo esc_attr( $step['label'] ); ?>" class="regular-text" required>
											</td>
											<td>
												<select name="<?php echo esc_attr( "{$opt}[workflows][{$i}][steps][{$j}][type]" ); ?>">
													<option value="trigger" <?php selected( $step['type'], 'trigger' ); ?>><?php esc_html_e( 'Trigger', 'doqix-workflow-advisor' ); ?></option>
													<option value="action" <?php selected( $step['type'], 'action' ); ?>><?php esc_html_e( 'Action', 'doqix-workflow-advisor' ); ?></option>
												</select>
											</td>
											<td class="doqix-col-action">
												<button type="button" class="button doqix-remove-step"><?php esc_html_e( 'Remove', 'doqix-workflow-advisor' ); ?></button>
											</td>
										</tr>
										<?php endforeach; ?>
									</tbody>
								</table>
								<button type="button" class="button doqix-add-step"><?php esc_html_e( '+ Add Step', 'doqix-workflow-advisor' ); ?></button>
							</div>
						</div>
					</div>
					<?php endforeach; ?>
				</div>
				<p><button type="button" class="button" id="doqix-add-workflow"><?php esc_html_e( '+ Add Workflow', 'doqix-workflow-advisor' ); ?></button></p>

				<!-- ═══════════════ COLORS ═══════════════ -->
				<h2><?php esc_html_e( 'Colors', 'doqix-workflow-advisor' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Customize the accent and CTA button colors to match your theme.', 'doqix-workflow-advisor' ); ?></p>

				<?php
				$accent_val     = $s['color_accent'];
				$cta_val        = $s['color_cta'];
				$accent_display = ! empty( $accent_val ) ? $accent_val : '#0886B5';
				$cta_display    = ! empty( $cta_val )    ? $cta_val    : '#0886B5';
				?>
				<table class="form-table">
					<tr>
						<th scope="row"><label for="color-accent"><?php esc_html_e( 'Accent Color', 'doqix-workflow-advisor' ); ?></label></th>
						<td>
							<span class="doqix-color-field">
								<input type="color" id="color-accent"
									name="<?php echo esc_attr( "{$opt}[color_accent]" ); ?>"
									value="<?php echo esc_attr( $accent_display ); ?>"
									<?php if ( empty( $accent_val ) ) echo 'data-is-default="1"'; ?>>
								<?php if ( ! empty( $accent_val ) ) : ?>
								<code><?php echo esc_html( $accent_val ); ?></code>
								<button type="button" class="button-link doqix-reset-color" data-target="color-accent"><?php esc_html_e( 'Reset to theme default', 'doqix-workflow-advisor' ); ?></button>
								<?php else : ?>
								<code><?php esc_html_e( 'Theme default', 'doqix-workflow-advisor' ); ?></code>
								<?php endif; ?>
							</span>
							<p class="description"><?php esc_html_e( 'Used for selected service cards, flow diagrams, and interactive elements.', 'doqix-workflow-advisor' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="color-cta"><?php esc_html_e( 'CTA Button Color', 'doqix-workflow-advisor' ); ?></label></th>
						<td>
							<span class="doqix-color-field">
								<input type="color" id="color-cta"
									name="<?php echo esc_attr( "{$opt}[color_cta]" ); ?>"
									value="<?php echo esc_attr( $cta_display ); ?>"
									<?php if ( empty( $cta_val ) ) echo 'data-is-default="1"'; ?>>
								<?php if ( ! empty( $cta_val ) ) : ?>
								<code><?php echo esc_html( $cta_val ); ?></code>
								<button type="button" class="button-link doqix-reset-color" data-target="color-cta"><?php esc_html_e( 'Reset to theme default', 'doqix-workflow-advisor' ); ?></button>
								<?php else : ?>
								<code><?php esc_html_e( 'Theme default', 'doqix-workflow-advisor' ); ?></code>
								<?php endif; ?>
							</span>
							<p class="description"><?php esc_html_e( 'Used for the CTA button and "Show My Workflows" button.', 'doqix-workflow-advisor' ); ?></p>
						</td>
					</tr>
				</table>

				<!-- ═══════════════ CTA ═══════════════ -->
				<h2><?php esc_html_e( 'Call to Action', 'doqix-workflow-advisor' ); ?></h2>

				<table class="form-table">
					<tr>
						<th scope="row"><label for="cta-url"><?php esc_html_e( 'CTA URL', 'doqix-workflow-advisor' ); ?></label></th>
						<td><input type="url" id="cta-url" name="<?php echo esc_attr( "{$opt}[cta_url]" ); ?>" value="<?php echo esc_attr( $s['cta_url'] ); ?>" class="regular-text"></td>
					</tr>
					<tr>
						<th scope="row"><label for="cta-text"><?php esc_html_e( 'CTA Text', 'doqix-workflow-advisor' ); ?></label></th>
						<td><input type="text" id="cta-text" name="<?php echo esc_attr( "{$opt}[cta_text]" ); ?>" value="<?php echo esc_attr( $s['cta_text'] ); ?>" class="regular-text"></td>
					</tr>
					<tr>
						<th scope="row"><label for="cta-subtext"><?php esc_html_e( 'CTA Subtext', 'doqix-workflow-advisor' ); ?></label></th>
						<td><input type="text" id="cta-subtext" name="<?php echo esc_attr( "{$opt}[cta_subtext]" ); ?>" value="<?php echo esc_attr( $s['cta_subtext'] ); ?>" class="regular-text"></td>
					</tr>
				</table>

				<!-- ═══════════════ LEAD CAPTURE ═══════════════ -->
				<h2><?php esc_html_e( 'Lead Capture', 'doqix-workflow-advisor' ); ?></h2>

				<table class="form-table">
					<tr>
						<th scope="row"><?php esc_html_e( 'Enable Lead Form', 'doqix-workflow-advisor' ); ?></th>
						<td>
							<label>
								<input type="checkbox" name="<?php echo esc_attr( "{$opt}[lead_form_enabled]" ); ?>" value="1" <?php checked( ! empty( $s['lead_form_enabled'] ) ); ?>>
								<?php esc_html_e( 'Show a lead capture form before the CTA button', 'doqix-workflow-advisor' ); ?>
							</label>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="lead-form-heading"><?php esc_html_e( 'Form Heading', 'doqix-workflow-advisor' ); ?></label></th>
						<td><input type="text" id="lead-form-heading" name="<?php echo esc_attr( "{$opt}[lead_form_heading]" ); ?>" value="<?php echo esc_attr( $s['lead_form_heading'] ); ?>" class="regular-text"></td>
					</tr>
				</table>

				<!-- ═══════════════ DISPLAY ═══════════════ -->
				<h2><?php esc_html_e( 'Display Options', 'doqix-workflow-advisor' ); ?></h2>

				<table class="form-table">
					<tr>
						<th scope="row"><label for="disclaimer-text"><?php esc_html_e( 'Disclaimer Text', 'doqix-workflow-advisor' ); ?></label></th>
						<td>
							<input type="text" id="disclaimer-text" name="<?php echo esc_attr( "{$opt}[disclaimer_text]" ); ?>" value="<?php echo esc_attr( $s['disclaimer_text'] ); ?>" class="regular-text">
							<p class="description"><?php esc_html_e( 'Shown at the bottom of the advisor. Leave empty to hide.', 'doqix-workflow-advisor' ); ?></p>
						</td>
					</tr>
				</table>

				<?php submit_button(); ?>
			</form>
		</div>
		<?php
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
}
