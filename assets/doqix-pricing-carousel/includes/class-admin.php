<?php
/**
 * Admin: Settings page for the Pricing Carousel.
 * Tabbed UI: preset tabs with sub-tabs (Cards, Carousel, Colours, Billing).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Doqix_Pricing_Admin {

	/** @var string Settings page hook suffix. */
	private $hook = '';

	public function __construct() {
		add_action( 'admin_menu',            array( $this, 'add_settings_page' ) );
		add_action( 'admin_init',            array( $this, 'register_settings' ) );
		add_action( 'admin_init',            array( $this, 'handle_preset_actions' ) );
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
				__( 'Pricing Carousel', 'doqix-pricing-carousel' ),
				__( 'Pricing Carousel', 'doqix-pricing-carousel' ),
				'manage_options',
				'doqix-pricing-carousel',
				array( $this, 'render_settings_page' )
			);
		} else {
			// Fallback: standalone top-level menu
			$this->hook = add_menu_page(
				__( 'Pricing Carousel', 'doqix-pricing-carousel' ),
				__( 'Pricing Carousel', 'doqix-pricing-carousel' ),
				'manage_options',
				'doqix-pricing-carousel',
				array( $this, 'render_settings_page' ),
				'dashicons-money-alt',
				82
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
			'doqix-pricing-admin',
			DOQIX_PRICING_PLUGIN_URL . 'assets/css/admin.css',
			array(),
			DOQIX_PRICING_VERSION
		);
		wp_enqueue_script(
			'doqix-pricing-admin',
			DOQIX_PRICING_PLUGIN_URL . 'assets/js/admin.js',
			array(),
			DOQIX_PRICING_VERSION,
			true
		);
	}

	/* ────────────────────────────────────────────
	 * Register settings (Settings API)
	 * ──────────────────────────────────────────── */

	public function register_settings() {
		register_setting(
			'doqix_pricing_settings_group',
			DOQIX_PRICING_OPTION_KEY,
			array( $this, 'sanitize_settings' )
		);
	}

	/* ────────────────────────────────────────────
	 * Helpers
	 * ──────────────────────────────────────────── */

	/**
	 * Get current settings merged with defaults.
	 *
	 * @return array
	 */
	public function get_settings() {
		$defaults = doqix_pricing_get_defaults();
		$saved    = get_option( DOQIX_PRICING_OPTION_KEY, array() );
		return wp_parse_args( $saved, $defaults );
	}

	/**
	 * Get the current preset slug from the URL, validated against existing presets.
	 *
	 * @return string
	 */
	private function get_current_preset_slug() {
		$s       = $this->get_settings();
		$presets = isset( $s['presets'] ) && is_array( $s['presets'] ) ? $s['presets'] : array();
		$slug    = isset( $_GET['preset'] ) ? sanitize_key( wp_unslash( $_GET['preset'] ) ) : 'default';

		if ( ! isset( $presets[ $slug ] ) ) {
			$slug = 'default';
		}

		return $slug;
	}

	/**
	 * Get the current sub-tab from the URL, validated.
	 *
	 * @return string
	 */
	private function get_current_sub_tab() {
		$valid = array( 'cards', 'carousel', 'colours', 'billing' );
		$sub   = isset( $_GET['sub'] ) ? sanitize_key( wp_unslash( $_GET['sub'] ) ) : 'cards';

		if ( ! in_array( $sub, $valid, true ) ) {
			$sub = 'cards';
		}

		return $sub;
	}

	/* ────────────────────────────────────────────
	 * Preset actions (add / delete) — via admin_init
	 * ──────────────────────────────────────────── */

	public function handle_preset_actions() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		/* Add preset */
		if ( isset( $_POST['doqix_pricing_add_preset'] ) && ! empty( $_POST['doqix_pricing_new_preset_name'] ) ) {
			check_admin_referer( 'doqix_pricing_preset_action', 'doqix_pricing_preset_nonce' );

			$label = sanitize_text_field( wp_unslash( $_POST['doqix_pricing_new_preset_name'] ) );
			$slug  = sanitize_key( str_replace( ' ', '-', strtolower( $label ) ) );

			if ( '' === $slug ) {
				return;
			}

			$s = get_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );
			if ( ! isset( $s['presets'] ) ) {
				$s['presets'] = array();
			}

			if ( ! isset( $s['presets'][ $slug ] ) ) {
				$new_preset          = doqix_pricing_get_preset_defaults();
				$new_preset['label'] = $label;
				$s['presets'][ $slug ] = $new_preset;
				update_option( DOQIX_PRICING_OPTION_KEY, $s );
			}

			wp_safe_redirect( add_query_arg( array(
				'page'   => 'doqix-pricing-carousel',
				'preset' => $slug,
			), admin_url( 'admin.php' ) ) );
			exit;
		}

		/* Delete preset */
		if ( isset( $_GET['doqix_pricing_delete_preset'] ) && ! empty( $_GET['doqix_pricing_delete_preset'] ) ) {
			check_admin_referer( 'doqix_pricing_delete_preset', '_wpnonce' );

			$slug = sanitize_key( wp_unslash( $_GET['doqix_pricing_delete_preset'] ) );

			if ( 'default' === $slug ) {
				return; // cannot delete default preset
			}

			$s = get_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );
			if ( isset( $s['presets'][ $slug ] ) ) {
				unset( $s['presets'][ $slug ] );
				update_option( DOQIX_PRICING_OPTION_KEY, $s );
			}

			wp_safe_redirect( add_query_arg( array(
				'page'   => 'doqix-pricing-carousel',
				'preset' => 'default',
			), admin_url( 'admin.php' ) ) );
			exit;
		}
	}

	/* ────────────────────────────────────────────
	 * Sanitize (STUB — full implementation in later task)
	 * ──────────────────────────────────────────── */

	public function sanitize_settings( $input ) {
		$existing = get_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );

		// Read which preset + sub-tab was submitted
		$preset_slug = isset( $input['_preset_slug'] ) ? sanitize_key( $input['_preset_slug'] ) : 'default';
		$sub_tab     = isset( $input['_sub_tab'] ) ? sanitize_key( $input['_sub_tab'] ) : 'cards';

		// For now, return existing settings unchanged
		return $existing;
	}

	/* ────────────────────────────────────────────
	 * Render page — preset tabs + sub-tabs
	 * ──────────────────────────────────────────── */

	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$s           = $this->get_settings();
		$presets     = isset( $s['presets'] ) && is_array( $s['presets'] ) ? $s['presets'] : array( 'default' => doqix_pricing_get_preset_defaults() );
		$active_slug = $this->get_current_preset_slug();
		$active_sub  = $this->get_current_sub_tab();
		$preset      = isset( $presets[ $active_slug ] ) ? $presets[ $active_slug ] : doqix_pricing_get_preset_defaults();
		$page_slug   = 'doqix-pricing-carousel';
		?>
		<div class="wrap doqix-pricing-admin">
			<h1>
				<?php esc_html_e( 'Do.Qix Pricing Carousel', 'doqix-pricing-carousel' ); ?>
				<small style="font-size:13px;font-weight:normal;color:#666;margin-left:10px;">
					<?php esc_html_e( '[doqix_pricing] or [doqix_pricing preset="name"]', 'doqix-pricing-carousel' ); ?>
				</small>
			</h1>

			<!-- ═══════════════ Preset Tabs ═══════════════ -->
			<h2 class="nav-tab-wrapper doqix-preset-tabs">
				<?php foreach ( $presets as $slug => $p ) :
					$tab_url = add_query_arg( array( 'page' => $page_slug, 'preset' => $slug ), admin_url( 'admin.php' ) );
					$is_active = ( $slug === $active_slug );
				?>
				<a href="<?php echo esc_url( $tab_url ); ?>"
				   class="nav-tab <?php echo $is_active ? 'nav-tab-active' : ''; ?>">
					<?php echo esc_html( $p['label'] ?? ucfirst( $slug ) ); ?>
					<?php if ( 'default' !== $slug ) : ?>
						<span class="doqix-preset-delete"
							  title="<?php esc_attr_e( 'Delete preset', 'doqix-pricing-carousel' ); ?>">
							<a href="<?php echo esc_url( wp_nonce_url(
								add_query_arg( array(
									'page' => $page_slug,
									'doqix_pricing_delete_preset' => $slug,
								), admin_url( 'admin.php' ) ),
								'doqix_pricing_delete_preset'
							) ); ?>"
							   onclick="return confirm('<?php esc_attr_e( 'Delete this preset?', 'doqix-pricing-carousel' ); ?>');"
							   class="doqix-delete-link">&times;</a>
						</span>
					<?php endif; ?>
				</a>
				<?php endforeach; ?>

				<button type="button" class="nav-tab doqix-add-preset-btn" id="doqix-add-preset-toggle">+</button>
			</h2>

			<!-- Hidden add-preset form -->
			<div id="doqix-add-preset-form" style="display:none;margin:10px 0;padding:15px;background:#f9f9f9;border:1px solid #ccd0d4;">
				<form method="post" action="">
					<?php wp_nonce_field( 'doqix_pricing_preset_action', 'doqix_pricing_preset_nonce' ); ?>
					<label>
						<?php esc_html_e( 'Preset Name:', 'doqix-pricing-carousel' ); ?>
						<input type="text" name="doqix_pricing_new_preset_name" value="" class="regular-text" required>
					</label>
					<?php submit_button( __( 'Add Preset', 'doqix-pricing-carousel' ), 'secondary', 'doqix_pricing_add_preset', false ); ?>
					<button type="button" class="button" id="doqix-add-preset-cancel"><?php esc_html_e( 'Cancel', 'doqix-pricing-carousel' ); ?></button>
				</form>
			</div>

			<!-- ═══════════════ Sub-Tabs ═══════════════ -->
			<?php
			$sub_tabs = array(
				'cards'    => __( 'Cards', 'doqix-pricing-carousel' ),
				'carousel' => __( 'Carousel', 'doqix-pricing-carousel' ),
				'colours'  => __( 'Colours', 'doqix-pricing-carousel' ),
				'billing'  => __( 'Billing', 'doqix-pricing-carousel' ),
			);
			?>
			<ul class="subsubsub doqix-sub-tabs" style="margin:15px 0 20px;">
				<?php $i = 0; foreach ( $sub_tabs as $sub_slug => $sub_label ) :
					$sub_url  = add_query_arg( array( 'page' => $page_slug, 'preset' => $active_slug, 'sub' => $sub_slug ), admin_url( 'admin.php' ) );
					$is_active_sub = ( $sub_slug === $active_sub );
				?>
				<li>
					<a href="<?php echo esc_url( $sub_url ); ?>"
					   class="<?php echo $is_active_sub ? 'current' : ''; ?>">
						<?php echo esc_html( $sub_label ); ?>
					</a>
					<?php if ( ++$i < count( $sub_tabs ) ) echo ' | '; ?>
				</li>
				<?php endforeach; ?>
			</ul>

			<!-- ═══════════════ Form ═══════════════ -->
			<form method="post" action="options.php" class="doqix-pricing-form">
				<?php settings_fields( 'doqix_pricing_settings_group' ); ?>
				<input type="hidden" name="<?php echo esc_attr( DOQIX_PRICING_OPTION_KEY ); ?>[_preset_slug]" value="<?php echo esc_attr( $active_slug ); ?>">
				<input type="hidden" name="<?php echo esc_attr( DOQIX_PRICING_OPTION_KEY ); ?>[_sub_tab]" value="<?php echo esc_attr( $active_sub ); ?>">

				<?php
				switch ( $active_sub ) {
					case 'cards':
						$this->render_cards_tab( $active_slug, $preset );
						break;
					case 'carousel':
						$this->render_carousel_tab( $active_slug, $preset );
						break;
					case 'colours':
						$this->render_colours_tab( $active_slug, $preset );
						break;
					case 'billing':
						$this->render_billing_tab( $active_slug, $preset );
						break;
				}
				?>

				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/* ────────────────────────────────────────────
	 * Tab render methods (STUBS)
	 * ──────────────────────────────────────────── */

	private function render_cards_tab( $preset_slug, $preset ) {
		echo '<div class="doqix-tab-content doqix-tab-cards">';
		echo '<p>' . esc_html__( 'Cards tab — full implementation in a later task.', 'doqix-pricing-carousel' ) . '</p>';
		echo '</div>';
	}

	private function render_carousel_tab( $preset_slug, $preset ) {
		echo '<div class="doqix-tab-content doqix-tab-carousel">';
		echo '<p>' . esc_html__( 'Carousel tab — full implementation in a later task.', 'doqix-pricing-carousel' ) . '</p>';
		echo '</div>';
	}

	private function render_colours_tab( $preset_slug, $preset ) {
		echo '<div class="doqix-tab-content doqix-tab-colours">';
		echo '<p>' . esc_html__( 'Colours tab — full implementation in a later task.', 'doqix-pricing-carousel' ) . '</p>';
		echo '</div>';
	}

	private function render_billing_tab( $preset_slug, $preset ) {
		echo '<div class="doqix-tab-content doqix-tab-billing">';
		echo '<p>' . esc_html__( 'Billing tab — full implementation in a later task.', 'doqix-pricing-carousel' ) . '</p>';
		echo '</div>';
	}

	/* ────────────────────────────────────────────
	 * Reusable field renderers (used by later tasks)
	 * ──────────────────────────────────────────── */

	/**
	 * Render a text input field.
	 *
	 * @param string $name  Input name attribute.
	 * @param string $label Field label.
	 * @param string $value Current value.
	 * @param string $hint  Optional hint text.
	 */
	public function render_text_field( $name, $label, $value, $hint = '' ) {
		?>
		<div class="doqix-field">
			<label for="<?php echo esc_attr( $name ); ?>">
				<?php echo esc_html( $label ); ?>
			</label>
			<input type="text"
				   id="<?php echo esc_attr( $name ); ?>"
				   name="<?php echo esc_attr( $name ); ?>"
				   value="<?php echo esc_attr( $value ); ?>"
				   class="regular-text">
			<?php if ( $hint ) : ?>
				<p class="description"><?php echo esc_html( $hint ); ?></p>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Render a colour picker field with reset button.
	 *
	 * @param string $name  Input name attribute.
	 * @param string $label Field label.
	 * @param string $value Current hex value (or empty).
	 */
	public function render_color_field( $name, $label, $value ) {
		?>
		<div class="doqix-field doqix-color-field">
			<label for="<?php echo esc_attr( $name ); ?>">
				<?php echo esc_html( $label ); ?>
			</label>
			<input type="color"
				   id="<?php echo esc_attr( $name ); ?>"
				   name="<?php echo esc_attr( $name ); ?>"
				   value="<?php echo esc_attr( $value ?: '#000000' ); ?>"
				   class="doqix-color-input">
			<code class="doqix-color-hex"><?php echo esc_html( $value ?: '' ); ?></code>
			<button type="button" class="button button-small doqix-color-reset"
					data-default=""
					title="<?php esc_attr_e( 'Reset to theme default', 'doqix-pricing-carousel' ); ?>">
				<?php esc_html_e( 'Reset', 'doqix-pricing-carousel' ); ?>
			</button>
		</div>
		<?php
	}

	/**
	 * Render a mini WYSIWYG editor (contenteditable + hidden input).
	 *
	 * @param string $name     Input name attribute.
	 * @param string $label    Section title.
	 * @param string $value    Current HTML value.
	 * @param bool   $optional Whether this field is optional.
	 */
	public function render_mini_editor( $name, $label, $value, $optional = false ) {
		$editor_id = sanitize_key( str_replace( array( '[', ']' ), '-', $name ) );
		?>
		<div class="doqix-field doqix-mini-editor-wrap">
			<label>
				<?php echo esc_html( $label ); ?>
				<?php if ( $optional ) : ?>
					<span class="description">(<?php esc_html_e( 'optional', 'doqix-pricing-carousel' ); ?>)</span>
				<?php endif; ?>
			</label>
			<div class="doqix-mini-toolbar">
				<button type="button" class="button button-small" data-cmd="bold" title="Bold"><b>B</b></button>
				<button type="button" class="button button-small" data-cmd="italic" title="Italic"><i>I</i></button>
				<button type="button" class="button button-small" data-cmd="insertUnorderedList" title="Bullet list">&#8226;</button>
				<button type="button" class="button button-small" data-cmd="createLink" title="Link">&#128279;</button>
			</div>
			<div class="doqix-mini-editor"
				 id="<?php echo esc_attr( $editor_id ); ?>"
				 contenteditable="true"
				 data-target="<?php echo esc_attr( $name ); ?>">
				<?php echo wp_kses_post( $value ); ?>
			</div>
			<input type="hidden"
				   name="<?php echo esc_attr( $name ); ?>"
				   value="<?php echo esc_attr( $value ); ?>"
				   class="doqix-mini-editor-input">
		</div>
		<?php
	}
}
