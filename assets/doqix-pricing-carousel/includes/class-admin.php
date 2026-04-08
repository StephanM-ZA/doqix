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
		add_action( 'admin_menu',            array( $this, 'add_settings_page' ), 20 );
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
		$settings = $this->get_settings();

		// Read which preset + sub-tab was submitted
		$preset_slug = isset( $input['_preset_slug'] ) ? sanitize_key( $input['_preset_slug'] ) : 'default';
		$sub_tab     = isset( $input['_sub_tab'] ) ? sanitize_key( $input['_sub_tab'] ) : 'cards';

		// Ensure presets array exists
		if ( ! isset( $settings['presets'] ) || ! is_array( $settings['presets'] ) ) {
			$settings['presets'] = array( 'default' => doqix_pricing_get_preset_defaults() );
		}

		// Get or create the target preset
		if ( ! isset( $settings['presets'][ $preset_slug ] ) ) {
			$settings['presets'][ $preset_slug ] = doqix_pricing_get_preset_defaults();
		}

		// Merge with defaults so all keys exist
		$settings['presets'][ $preset_slug ] = wp_parse_args(
			$settings['presets'][ $preset_slug ],
			doqix_pricing_get_preset_defaults()
		);

		// Read submitted preset data
		$preset_input = isset( $input['presets'][ $preset_slug ] ) && is_array( $input['presets'][ $preset_slug ] )
			? $input['presets'][ $preset_slug ]
			: array();

		// Delegate to sub-tab sanitiser
		switch ( $sub_tab ) {
			case 'cards':
				$this->sanitize_cards( $settings['presets'][ $preset_slug ], $preset_input );
				break;
			case 'carousel':
				$this->sanitize_carousel( $settings['presets'][ $preset_slug ], $preset_input );
				break;
			case 'colours':
				$this->sanitize_colours( $settings['presets'][ $preset_slug ], $preset_input );
				break;
			case 'billing':
				$this->sanitize_billing( $settings['presets'][ $preset_slug ], $preset_input );
				break;
		}

		return $settings;
	}

	/**
	 * Sanitise cards sub-tab input.
	 *
	 * @param array $preset Reference to the preset being updated.
	 * @param array $input  Submitted preset data.
	 */
	private function sanitize_cards( &$preset, $input ) {
		if ( ! isset( $input['cards'] ) || ! is_array( $input['cards'] ) ) {
			$preset['cards'] = array();
			return;
		}

		$existing_cards = isset( $preset['cards'] ) ? $preset['cards'] : array();
		$clean_cards = array();
		foreach ( $input['cards'] as $raw_card ) {
			if ( ! is_array( $raw_card ) ) {
				continue;
			}

			$card = doqix_pricing_get_card_defaults();

			// Text fields
			$text_keys = array(
				'name', 'subtitle', 'price', 'price_suffix', 'price_annual',
				'setup_fee', 'savings', 'cta_label', 'cta_url', 'badge', 'icon_value',
			);
			foreach ( $text_keys as $key ) {
				if ( isset( $raw_card[ $key ] ) ) {
					$card[ $key ] = sanitize_text_field( $raw_card[ $key ] );
				}
			}

			// Auto-calculate annual price if empty and monthly price is numeric
			if ( empty( $card['price_annual'] ) && is_numeric( $card['price'] ) ) {
				$discount = isset( $preset['annual_discount'] ) ? (int) $preset['annual_discount'] : 15;
				$card['price_annual'] = (string) round( (float) $card['price'] * ( 1 - $discount / 100 ) );
			}


			// Rich text fields
			$rich_keys = array( 'features', 'description', 'excludes' );
			foreach ( $rich_keys as $key ) {
				if ( isset( $raw_card[ $key ] ) ) {
					$card[ $key ] = wp_kses_post( $raw_card[ $key ] );
				}
			}

			// Featured: 0 or 1
			$card['featured'] = ! empty( $raw_card['featured'] ) ? 1 : 0;

			// Sort order
			$card['sort_order'] = isset( $raw_card['sort_order'] ) ? absint( $raw_card['sort_order'] ) : 0;

			// Icon type: validate against allowed values
			$valid_icon_types = array( 'none', 'dashicon', 'image' );
			if ( isset( $raw_card['icon_type'] ) && in_array( $raw_card['icon_type'], $valid_icon_types, true ) ) {
				$card['icon_type'] = $raw_card['icon_type'];
			}

			// Card-level colour overrides
			$color_keys = array(
				'color_header_bg', 'color_header_text', 'color_cta_bg', 'color_cta_text',
				'color_badge_bg', 'color_badge_text', 'color_card_bg',
				'color_feat_text', 'color_feat_check', 'color_exc_text',
			);
			foreach ( $color_keys as $key ) {
				if ( isset( $raw_card[ $key ] ) && '' !== $raw_card[ $key ] ) {
					$sanitized = sanitize_hex_color( $raw_card[ $key ] );
					$card[ $key ] = $sanitized ? $sanitized : '';
				} else {
					$card[ $key ] = '';
				}
			}

			$clean_cards[] = $card;
		}

		$preset['cards'] = $clean_cards;
	}

	/**
	 * Sanitise carousel sub-tab input.
	 *
	 * @param array $preset Reference to the preset being updated.
	 * @param array $input  Submitted preset data.
	 */
	private function sanitize_carousel( &$preset, $input ) {
		// Display modes
		$valid_display = array( 'grid', 'carousel' );

		if ( isset( $input['display_desktop'] ) && in_array( $input['display_desktop'], $valid_display, true ) ) {
			$preset['display_desktop'] = $input['display_desktop'];
		}
		if ( isset( $input['display_mobile'] ) && in_array( $input['display_mobile'], $valid_display, true ) ) {
			$preset['display_mobile'] = $input['display_mobile'];
		}

		// Mobile breakpoint: clamp 320-1200
		if ( isset( $input['mobile_breakpoint'] ) ) {
			$bp = absint( $input['mobile_breakpoint'] );
			$preset['mobile_breakpoint'] = max( 320, min( 1200, $bp ) );
		}

		// Nav style
		$valid_nav = array( 'arrows', 'dots', 'breadcrumbs' );
		if ( isset( $input['nav_style'] ) && in_array( $input['nav_style'], $valid_nav, true ) ) {
			$preset['nav_style'] = $input['nav_style'];
		}

		// Active scale: clamp 1.0-1.5
		if ( isset( $input['active_scale'] ) ) {
			$scale = floatval( $input['active_scale'] );
			$preset['active_scale'] = max( 1.0, min( 1.5, $scale ) );
		}

		// Autoplay
		$preset['autoplay'] = ! empty( $input['autoplay'] ) ? 1 : 0;

		// Autoplay speed: min 1000
		if ( isset( $input['autoplay_speed'] ) ) {
			$speed = absint( $input['autoplay_speed'] );
			$preset['autoplay_speed'] = max( 1000, $speed );
		}
	}

	/**
	 * Sanitise colours sub-tab input.
	 *
	 * @param array $preset Reference to the preset being updated.
	 * @param array $input  Submitted preset data.
	 */
	private function sanitize_colours( &$preset, $input ) {
		$colour_keys = array(
			'color_header_bg', 'color_header_text', 'color_accent', 'color_card_bg',
			'color_cta_bg', 'color_cta_text', 'color_badge_bg', 'color_badge_text',
			'color_feat_text', 'color_feat_check', 'color_exc_text', 'color_exc_title',
		);

		foreach ( $colour_keys as $key ) {
			if ( isset( $input[ $key ] ) && '' !== $input[ $key ] ) {
				$sanitized = sanitize_hex_color( $input[ $key ] );
				$preset[ $key ] = $sanitized ? $sanitized : '';
			} else {
				$preset[ $key ] = '';
			}
		}
	}

	/**
	 * Sanitise billing sub-tab input.
	 *
	 * @param array $preset Reference to the preset being updated.
	 * @param array $input  Submitted preset data.
	 */
	private function sanitize_billing( &$preset, $input ) {
		// Billing toggle
		$preset['billing_toggle'] = ! empty( $input['billing_toggle'] ) ? 1 : 0;

		// Labels
		if ( isset( $input['monthly_label'] ) ) {
			$preset['monthly_label'] = sanitize_text_field( $input['monthly_label'] );
		}
		if ( isset( $input['annual_label'] ) ) {
			$preset['annual_label'] = sanitize_text_field( $input['annual_label'] );
		}

		// Annual discount: 0-100
		if ( isset( $input['annual_discount'] ) ) {
			$discount = absint( $input['annual_discount'] );
			$preset['annual_discount'] = min( 100, $discount );
		}
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
		$cards   = isset( $preset['cards'] ) && is_array( $preset['cards'] ) ? $preset['cards'] : array();
		$opt     = DOQIX_PRICING_OPTION_KEY . '[presets][' . esc_attr( $preset_slug ) . '][cards]';
		?>
		<div class="doqix-tab-content doqix-tab-cards" id="doqix-cards-container">
		<?php foreach ( $cards as $i => $raw_card ) :
			$card = wp_parse_args( $raw_card, doqix_pricing_get_card_defaults() );
			$base = $opt . '[' . $i . ']';
		?>
			<div class="doqix-card-panel doqix-repeater-row" data-index="<?php echo esc_attr( $i ); ?>">

				<!-- Panel header -->
				<div class="doqix-card-header" onclick="doqixPricingToggleCard(this)">
					<span class="doqix-drag-handle" title="<?php esc_attr_e( 'Drag to reorder', 'doqix-pricing-carousel' ); ?>">&#8942;&#8942;</span>
					<span class="doqix-card-title"><?php echo esc_html( $card['name'] ?: __( 'Untitled Card', 'doqix-pricing-carousel' ) ); ?></span>
					<?php if ( '' !== $card['badge'] ) : ?>
						<span class="doqix-badge-preview"><?php echo esc_html( $card['badge'] ); ?></span>
					<?php endif; ?>
					<?php if ( ! empty( $card['featured'] ) ) : ?>
						<span class="doqix-featured-star" title="<?php esc_attr_e( 'Featured', 'doqix-pricing-carousel' ); ?>">&#9733;</span>
					<?php endif; ?>
					<button type="button" class="doqix-remove-card"
							onclick="event.stopPropagation(); doqixPricingRemoveCard(this);"><?php esc_html_e( 'Remove', 'doqix-pricing-carousel' ); ?></button>
					<span class="doqix-collapse-arrow">&#9654;</span>
				</div>

				<!-- Panel body -->
				<div class="doqix-card-body">

					<!-- 2-column field grid -->
					<div class="doqix-field-grid">
						<?php
						$this->render_text_field( $base . '[name]', __( 'Name', 'doqix-pricing-carousel' ), $card['name'] );
						$this->render_text_field( $base . '[subtitle]', __( 'Subtitle', 'doqix-pricing-carousel' ), $card['subtitle'] );
						$this->render_text_field( $base . '[price]', __( 'Price', 'doqix-pricing-carousel' ), $card['price'] );
						$this->render_text_field( $base . '[price_suffix]', __( 'Price Suffix', 'doqix-pricing-carousel' ), $card['price_suffix'] );

						$discount   = isset( $preset['annual_discount'] ) ? (int) $preset['annual_discount'] : 15;
						$calc_price = is_numeric( $card['price'] ) ? round( (float) $card['price'] * ( 1 - $discount / 100 ) ) : '';
						$display_val = ! empty( $card['price_annual'] ) ? $card['price_annual'] : '';
						?>
						<div class="doqix-field">
							<label><?php esc_html_e( 'Annual Price', 'doqix-pricing-carousel' ); ?></label>
							<input type="text"
								name="<?php echo esc_attr( $base . '[price_annual]' ); ?>"
								value="<?php echo esc_attr( $display_val ); ?>"
								placeholder="<?php echo esc_attr( $calc_price ); ?>"
								class="doqix-annual-price"
								data-discount="<?php echo esc_attr( $discount ); ?>">
							<span class="doqix-hint">
								<?php printf( esc_html__( 'Auto: %s%% off monthly price. Leave empty to use calculated value, or type to override.', 'doqix-pricing-carousel' ), $discount ); ?>
							</span>
						</div>
						<?php
						$this->render_text_field( $base . '[setup_fee]', __( 'Setup Fee', 'doqix-pricing-carousel' ), $card['setup_fee'] );
						$this->render_text_field( $base . '[savings]', __( 'Savings Line', 'doqix-pricing-carousel' ), $card['savings'] );
						$this->render_text_field( $base . '[cta_label]', __( 'CTA Label', 'doqix-pricing-carousel' ), $card['cta_label'] );
						$this->render_text_field( $base . '[cta_url]', __( 'CTA URL', 'doqix-pricing-carousel' ), $card['cta_url'] );
						$this->render_text_field( $base . '[badge]', __( 'Badge Text', 'doqix-pricing-carousel' ), $card['badge'], __( 'Empty = no badge', 'doqix-pricing-carousel' ) );
						?>

						<!-- Featured toggle -->
						<div class="doqix-field">
							<label>
								<?php esc_html_e( 'Featured', 'doqix-pricing-carousel' ); ?>
							</label>
							<input type="hidden" name="<?php echo esc_attr( $base . '[featured]' ); ?>" value="0">
							<label class="doqix-toggle-label">
								<input type="checkbox"
									   name="<?php echo esc_attr( $base . '[featured]' ); ?>"
									   value="1"
									   <?php checked( $card['featured'], 1 ); ?>>
								<?php esc_html_e( 'Highlight this card', 'doqix-pricing-carousel' ); ?>
							</label>
						</div>

						<!-- Hidden sort_order -->
						<input type="hidden" name="<?php echo esc_attr( $base . '[sort_order]' ); ?>" value="<?php echo esc_attr( $i ); ?>">
					</div>

					<!-- Full-width mini editors -->
					<?php
					$this->render_mini_editor( $base . '[features]', __( 'Features', 'doqix-pricing-carousel' ), $card['features'] );
					$this->render_mini_editor( $base . '[description]', __( 'Description', 'doqix-pricing-carousel' ), $card['description'], true );
					$this->render_mini_editor( $base . '[excludes]', __( 'Excludes', 'doqix-pricing-carousel' ), $card['excludes'] );
					?>

					<!-- Collapsible colour overrides -->
					<div class="doqix-color-overrides-section">
						<a href="#" class="doqix-color-overrides-toggle">
							<?php esc_html_e( 'Colour Overrides (empty = inherit from preset)', 'doqix-pricing-carousel' ); ?>
						</a>
						<div class="doqix-color-overrides">
							<div class="doqix-field-grid">
								<?php
								$this->render_color_field( $base . '[color_header_bg]', __( 'Header BG', 'doqix-pricing-carousel' ), $card['color_header_bg'] );
								$this->render_color_field( $base . '[color_header_text]', __( 'Header Text', 'doqix-pricing-carousel' ), $card['color_header_text'] );
								$this->render_color_field( $base . '[color_cta_bg]', __( 'CTA BG', 'doqix-pricing-carousel' ), $card['color_cta_bg'] );
								$this->render_color_field( $base . '[color_cta_text]', __( 'CTA Text', 'doqix-pricing-carousel' ), $card['color_cta_text'] );
								$this->render_color_field( $base . '[color_badge_bg]', __( 'Badge BG', 'doqix-pricing-carousel' ), $card['color_badge_bg'] );
								$this->render_color_field( $base . '[color_badge_text]', __( 'Badge Text', 'doqix-pricing-carousel' ), $card['color_badge_text'] );
								$this->render_color_field( $base . '[color_card_bg]', __( 'Card BG', 'doqix-pricing-carousel' ), $card['color_card_bg'] );
								$this->render_color_field( $base . '[color_feat_text]', __( 'Features Text', 'doqix-pricing-carousel' ), $card['color_feat_text'] );
								$this->render_color_field( $base . '[color_feat_check]', __( 'Features Check', 'doqix-pricing-carousel' ), $card['color_feat_check'] );
								$this->render_color_field( $base . '[color_exc_text]', __( 'Excludes Text', 'doqix-pricing-carousel' ), $card['color_exc_text'] );
								?>
							</div>
						</div>
					</div>

				</div><!-- .doqix-card-body -->

			</div><!-- .doqix-card-panel -->
		<?php endforeach; ?>

			<p>
				<button type="button" class="button button-secondary" id="doqix-add-card">
					<?php esc_html_e( '+ Add Card', 'doqix-pricing-carousel' ); ?>
				</button>
			</p>

		</div><!-- .doqix-tab-cards -->
		<?php
	}

	private function render_carousel_tab( $preset_slug, $preset ) {
		$base = DOQIX_PRICING_OPTION_KEY . '[presets][' . esc_attr( $preset_slug ) . ']';
		?>
		<div class="doqix-tab-content doqix-tab-carousel">

			<!-- Display Mode -->
			<h3><?php esc_html_e( 'Display Mode', 'doqix-pricing-carousel' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Choose how pricing cards are presented on desktop and mobile devices.', 'doqix-pricing-carousel' ); ?></p>

			<div class="doqix-device-split">
				<!-- Desktop -->
				<div class="doqix-device-panel">
					<h4><?php esc_html_e( 'Desktop', 'doqix-pricing-carousel' ); ?></h4>
					<label>
						<input type="radio"
							   name="<?php echo esc_attr( $base . '[display_desktop]' ); ?>"
							   value="grid"
							   <?php checked( $preset['display_desktop'] ?? 'grid', 'grid' ); ?>>
						<strong><?php esc_html_e( 'Grid', 'doqix-pricing-carousel' ); ?></strong>
						&mdash; <?php esc_html_e( 'All cards visible in a row', 'doqix-pricing-carousel' ); ?>
					</label><br>
					<label>
						<input type="radio"
							   name="<?php echo esc_attr( $base . '[display_desktop]' ); ?>"
							   value="carousel"
							   <?php checked( $preset['display_desktop'] ?? 'grid', 'carousel' ); ?>>
						<strong><?php esc_html_e( 'Carousel', 'doqix-pricing-carousel' ); ?></strong>
						&mdash; <?php esc_html_e( 'Scroll/swipe with active card scaling', 'doqix-pricing-carousel' ); ?>
					</label>
				</div>

				<!-- Mobile -->
				<div class="doqix-device-panel">
					<h4><?php esc_html_e( 'Mobile', 'doqix-pricing-carousel' ); ?></h4>
					<label>
						<input type="radio"
							   name="<?php echo esc_attr( $base . '[display_mobile]' ); ?>"
							   value="grid"
							   <?php checked( $preset['display_mobile'] ?? 'carousel', 'grid' ); ?>>
						<strong><?php esc_html_e( 'Grid', 'doqix-pricing-carousel' ); ?></strong>
						&mdash; <?php esc_html_e( 'Cards stack vertically', 'doqix-pricing-carousel' ); ?>
					</label><br>
					<label>
						<input type="radio"
							   name="<?php echo esc_attr( $base . '[display_mobile]' ); ?>"
							   value="carousel"
							   <?php checked( $preset['display_mobile'] ?? 'carousel', 'carousel' ); ?>>
						<strong><?php esc_html_e( 'Carousel', 'doqix-pricing-carousel' ); ?></strong>
						&mdash; <?php esc_html_e( 'Swipe with active card + peeking edges', 'doqix-pricing-carousel' ); ?>
					</label>
				</div>
			</div>

			<!-- Breakpoint -->
			<div class="doqix-field" style="margin-top:15px;">
				<label for="<?php echo esc_attr( $base . '[mobile_breakpoint]' ); ?>">
					<?php esc_html_e( 'Mobile Breakpoint (px)', 'doqix-pricing-carousel' ); ?>
				</label>
				<input type="number"
					   id="<?php echo esc_attr( $base . '[mobile_breakpoint]' ); ?>"
					   name="<?php echo esc_attr( $base . '[mobile_breakpoint]' ); ?>"
					   value="<?php echo esc_attr( $preset['mobile_breakpoint'] ?? 768 ); ?>"
					   min="320" max="1200"
					   class="small-text">
				<p class="description"><?php esc_html_e( 'Below this width → mobile layout', 'doqix-pricing-carousel' ); ?></p>
			</div>

			<hr>

			<!-- Navigation Style -->
			<h3><?php esc_html_e( 'Navigation Style', 'doqix-pricing-carousel' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Applies when carousel mode is active.', 'doqix-pricing-carousel' ); ?></p>

			<div class="doqix-nav-options">
				<?php
				$nav_current = $preset['nav_style'] ?? 'breadcrumbs';
				$nav_choices = array(
					'arrows'      => array(
						'preview'  => '&#8249; &#8250;',
						'label'    => __( 'Arrows', 'doqix-pricing-carousel' ),
						'sublabel' => __( 'Side buttons', 'doqix-pricing-carousel' ),
					),
					'dots'        => array(
						'preview'  => '&#9679; &#9679; &#9679;',
						'label'    => __( 'Dots', 'doqix-pricing-carousel' ),
						'sublabel' => __( 'Below carousel', 'doqix-pricing-carousel' ),
					),
					'breadcrumbs' => array(
						'preview'  => 'A | B | C',
						'label'    => __( 'Breadcrumbs', 'doqix-pricing-carousel' ),
						'sublabel' => __( 'Named pills', 'doqix-pricing-carousel' ),
					),
				);
				foreach ( $nav_choices as $val => $meta ) : ?>
					<label class="doqix-nav-option <?php echo ( $nav_current === $val ) ? 'active' : ''; ?>">
						<input type="radio"
							   name="<?php echo esc_attr( $base . '[nav_style]' ); ?>"
							   value="<?php echo esc_attr( $val ); ?>"
							   <?php checked( $nav_current, $val ); ?>>
						<span class="doqix-nav-preview"><?php echo $meta['preview']; ?></span>
						<span class="doqix-nav-label"><?php echo esc_html( $meta['label'] ); ?></span>
						<span class="doqix-nav-sublabel"><?php echo esc_html( $meta['sublabel'] ); ?></span>
					</label>
				<?php endforeach; ?>
			</div>

			<p class="doqix-note"><?php esc_html_e( 'Navigation controls are hidden when grid mode is active on that screen size.', 'doqix-pricing-carousel' ); ?></p>

			<hr>

			<!-- Carousel Options -->
			<h3><?php esc_html_e( 'Carousel Options', 'doqix-pricing-carousel' ); ?></h3>

			<div class="doqix-field-grid">
				<!-- Active card scale -->
				<div class="doqix-field">
					<label for="<?php echo esc_attr( $base . '[active_scale]' ); ?>">
						<?php esc_html_e( 'Active Card Scale', 'doqix-pricing-carousel' ); ?>
					</label>
					<input type="number"
						   id="<?php echo esc_attr( $base . '[active_scale]' ); ?>"
						   name="<?php echo esc_attr( $base . '[active_scale]' ); ?>"
						   value="<?php echo esc_attr( $preset['active_scale'] ?? 1.15 ); ?>"
						   step="0.05" min="1" max="1.5"
						   class="small-text">
					<p class="description"><?php esc_html_e( '1.0 = same size, 1.15 = 15% larger', 'doqix-pricing-carousel' ); ?></p>
				</div>

				<!-- Autoplay toggle + speed -->
				<div class="doqix-field">
					<label>
						<?php esc_html_e( 'Autoplay', 'doqix-pricing-carousel' ); ?>
					</label>
					<input type="hidden" name="<?php echo esc_attr( $base . '[autoplay]' ); ?>" value="0">
					<label class="doqix-toggle-label">
						<input type="checkbox"
							   name="<?php echo esc_attr( $base . '[autoplay]' ); ?>"
							   value="1"
							   <?php checked( $preset['autoplay'] ?? 0, 1 ); ?>>
						<?php esc_html_e( 'Enable autoplay', 'doqix-pricing-carousel' ); ?>
					</label>
					<br>
					<label for="<?php echo esc_attr( $base . '[autoplay_speed]' ); ?>" style="margin-top:8px;display:inline-block;">
						<?php esc_html_e( 'Speed (ms)', 'doqix-pricing-carousel' ); ?>
					</label>
					<input type="number"
						   id="<?php echo esc_attr( $base . '[autoplay_speed]' ); ?>"
						   name="<?php echo esc_attr( $base . '[autoplay_speed]' ); ?>"
						   value="<?php echo esc_attr( $preset['autoplay_speed'] ?? 5000 ); ?>"
						   min="1000" step="500"
						   class="small-text">
				</div>
			</div>

		</div><!-- .doqix-tab-carousel -->
		<?php
	}

	private function render_colours_tab( $preset_slug, $preset ) {
		$base = DOQIX_PRICING_OPTION_KEY . '[presets][' . esc_attr( $preset_slug ) . ']';

		$colour_fields = array(
			'color_header_bg'   => array( __( 'Header Background', 'doqix-pricing-carousel' ), '#0886B5' ),
			'color_header_text' => array( __( 'Header Text', 'doqix-pricing-carousel' ), '#ffffff' ),
			'color_accent'      => array( __( 'Accent Colour', 'doqix-pricing-carousel' ), '#0886B5' ),
			'color_card_bg'     => array( __( 'Card Background', 'doqix-pricing-carousel' ), '#f9fcfd' ),
			'color_cta_bg'      => array( __( 'CTA Background', 'doqix-pricing-carousel' ), '#0886B5' ),
			'color_cta_text'    => array( __( 'CTA Text', 'doqix-pricing-carousel' ), '#ffffff' ),
			'color_badge_bg'    => array( __( 'Badge Background', 'doqix-pricing-carousel' ), '#ff9500' ),
			'color_badge_text'  => array( __( 'Badge Text', 'doqix-pricing-carousel' ), '#ffffff' ),
			'color_feat_text'   => array( __( 'Features Text', 'doqix-pricing-carousel' ), '#1d2327' ),
			'color_feat_check'  => array( __( 'Features Checkmark', 'doqix-pricing-carousel' ), '#0886B5' ),
			'color_exc_text'    => array( __( 'Excludes Text', 'doqix-pricing-carousel' ), '#999999' ),
			'color_exc_title'   => array( __( 'Excludes Title', 'doqix-pricing-carousel' ), '#666666' ),
		);
		?>
		<div class="doqix-tab-content doqix-tab-colours">

			<p class="description"><?php esc_html_e( 'Preset-level colours. Cards inherit these unless overridden per-card. Empty = theme default.', 'doqix-pricing-carousel' ); ?></p>

			<div class="doqix-colours-layout">

				<!-- Left column: colour pickers -->
				<div class="doqix-colours-pickers">
					<div class="doqix-color-grid">
						<?php foreach ( $colour_fields as $key => $meta ) :
							$label          = $meta[0];
							$visual_default = $meta[1];
							$var_suffix     = str_replace( '_', '-', str_replace( 'color_', '', $key ) );
							$data_var       = '--pricing-' . $var_suffix;
							$this->render_color_field(
								$base . '[' . $key . ']',
								$label,
								$preset[ $key ] ?? '',
								$data_var,
								$visual_default
							);
						endforeach; ?>
					</div>
				</div>

				<!-- Right column: live preview -->
				<div class="doqix-preview-area">
					<span class="doqix-preview-label"><?php esc_html_e( 'LIVE PREVIEW', 'doqix-pricing-carousel' ); ?></span>
					<?php
					// Build initial CSS custom property values from preset (use visual defaults for preview)
					$style_vars = '';
					foreach ( $colour_fields as $key => $meta ) {
						$var_suffix     = str_replace( '_', '-', str_replace( 'color_', '', $key ) );
						$val            = $preset[ $key ] ?? '';
						$visual_default = $meta[1];
						$style_vars .= '--pricing-' . $var_suffix . ':' . esc_attr( $val ?: $visual_default ) . ';';
					}
					?>
					<div id="doqix-preview-card" class="doqix-preview-card" style="<?php echo $style_vars; ?>">
						<div class="doqix-preview-badge">MOST POPULAR</div>
						<div class="doqix-preview-header">
							<div class="doqix-preview-name">Team</div>
							<div class="doqix-preview-sub">Small teams (2-15 people)</div>
							<div class="doqix-preview-price">R2,500<span>/mo</span></div>
							<div class="doqix-preview-setup">R1,500 setup</div>
						</div>
						<div class="doqix-preview-body">
							<div class="doqix-preview-savings">Save ~R8,000-R20,000/mo</div>
							<div class="doqix-preview-feat">Up to 3 workflows</div>
							<div class="doqix-preview-feat">Priority + WhatsApp (24hr)</div>
							<div class="doqix-preview-feat">Hosting &amp; monitoring</div>
							<div class="doqix-preview-feat">POPIA compliant</div>
							<div class="doqix-preview-feat">No lock-in</div>
							<div class="doqix-preview-excludes">
								<div class="doqix-preview-exc-title">Excludes:</div>
								<div class="doqix-preview-exc-item">Training (R1,500/session)</div>
								<div class="doqix-preview-exc-item">Additional hosting costs</div>
							</div>
						</div>
						<div class="doqix-preview-cta">Start Free</div>
					</div>
				</div>

			</div>

		</div><!-- .doqix-tab-colours -->
		<?php
	}

	private function render_billing_tab( $preset_slug, $preset ) {
		$base = DOQIX_PRICING_OPTION_KEY . '[presets][' . esc_attr( $preset_slug ) . ']';
		?>
		<div class="doqix-tab-content doqix-tab-billing">

			<!-- Enable billing toggle -->
			<div class="doqix-field">
				<label>
					<?php esc_html_e( 'Billing Toggle', 'doqix-pricing-carousel' ); ?>
				</label>
				<input type="hidden" name="<?php echo esc_attr( $base . '[billing_toggle]' ); ?>" value="0">
				<label class="doqix-toggle-label">
					<input type="checkbox"
						   name="<?php echo esc_attr( $base . '[billing_toggle]' ); ?>"
						   value="1"
						   <?php checked( $preset['billing_toggle'] ?? 0, 1 ); ?>>
					<?php esc_html_e( 'Show billing period toggle on frontend (default: off)', 'doqix-pricing-carousel' ); ?>
				</label>
			</div>

			<!-- Labels and discount -->
			<div class="doqix-field-grid" style="max-width:500px;">
				<?php
				$this->render_text_field(
					$base . '[monthly_label]',
					__( 'Monthly Label', 'doqix-pricing-carousel' ),
					$preset['monthly_label'] ?? 'Monthly'
				);
				$this->render_text_field(
					$base . '[annual_label]',
					__( 'Annual Label', 'doqix-pricing-carousel' ),
					$preset['annual_label'] ?? 'Annual'
				);
				?>
				<div class="doqix-field">
					<label for="<?php echo esc_attr( $base . '[annual_discount]' ); ?>">
						<?php esc_html_e( 'Annual Discount %', 'doqix-pricing-carousel' ); ?>
					</label>
					<input type="number"
						   id="<?php echo esc_attr( $base . '[annual_discount]' ); ?>"
						   name="<?php echo esc_attr( $base . '[annual_discount]' ); ?>"
						   value="<?php echo esc_attr( $preset['annual_discount'] ?? 15 ); ?>"
						   min="0" max="100"
						   class="small-text">
				</div>
			</div>

		</div><!-- .doqix-tab-billing -->
		<?php
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
	/**
	 * @param string $name     Field name.
	 * @param string $label    Display label.
	 * @param string $value    Saved value (empty = theme default).
	 * @param string $data_var CSS variable name for live preview (optional).
	 * @param string $visual_default Fallback colour shown in picker when value is empty.
	 */
	public function render_color_field( $name, $label, $value, $data_var = '', $visual_default = '#0886B5' ) {
		$is_set      = ! empty( $value );
		$picker_val  = $is_set ? $value : $visual_default;
		$display_hex = $is_set ? $value : $visual_default;
		?>
		<div class="doqix-field">
			<label for="<?php echo esc_attr( $name ); ?>">
				<?php echo esc_html( $label ); ?>
			</label>
			<div class="doqix-color-field">
				<input type="color"
					   id="<?php echo esc_attr( $name ); ?>"
					   name="<?php echo esc_attr( $name ); ?>"
					   value="<?php echo esc_attr( $picker_val ); ?>"
					   class="doqix-color-input"
					   data-is-set="<?php echo $is_set ? '1' : '0'; ?>"
					   data-visual-default="<?php echo esc_attr( $visual_default ); ?>"
					   <?php if ( $data_var ) : ?>data-var="<?php echo esc_attr( $data_var ); ?>"<?php endif; ?>>
				<code class="doqix-color-hex"><?php echo esc_html( $display_hex ); ?></code>
				<button type="button" class="doqix-color-reset"
						data-default="<?php echo esc_attr( $visual_default ); ?>"
						title="<?php esc_attr_e( 'Reset to theme default', 'doqix-pricing-carousel' ); ?>">
					<?php esc_html_e( 'Reset', 'doqix-pricing-carousel' ); ?>
				</button>
			</div>
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
		<div class="doqix-field doqix-wp-editor-wrap">
			<label>
				<?php echo esc_html( $label ); ?>
				<?php if ( $optional ) : ?>
					<span class="description">(<?php esc_html_e( 'optional', 'doqix-pricing-carousel' ); ?>)</span>
				<?php endif; ?>
			</label>
			<?php
			wp_editor( $value, $editor_id, array(
				'textarea_name' => $name,
				'textarea_rows' => 6,
				'media_buttons' => false,
				'teeny'         => true,
				'quicktags'     => true,
				'tinymce'       => array(
					'toolbar1' => 'bold,italic,underline,bullist,numlist,link,unlink',
					'toolbar2' => '',
				),
			) );
			?>
		</div>
		<?php
	}
}
