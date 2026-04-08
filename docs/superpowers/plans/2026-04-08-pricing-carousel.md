# Do.Qix Pricing Carousel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WordPress plugin that renders configurable pricing tables as a grid or carousel, with full admin UI for managing cards, colours, layout, and presets.

**Architecture:** Single WordPress plugin following the existing Do.Qix ecosystem patterns (ROI Calculator V2). Admin class handles a tabbed settings page with repeater cards. Frontend class renders a shortcode with conditional asset loading. Vanilla JS for carousel and admin interactions. CSS variables for theming with a three-tier colour cascade (card → preset → theme).

**Tech Stack:** PHP 7.4+ (WordPress plugin API), vanilla JavaScript (no dependencies), CSS3 (custom properties, flexbox, transitions)

**Spec:** `docs/superpowers/specs/2026-04-08-pricing-carousel-design.md`
**Mockups:** `.superpowers/brainstorm/19744-1775636369/content/` — `admin-full-v2.html` (admin), `card-layout-v6.html` (frontend)

---

## File Map

| File | Responsibility |
|------|---------------|
| `assets/doqix-pricing-carousel/doqix-pricing-carousel.php` | Constants, defaults, hooks, activation, class loading |
| `assets/doqix-pricing-carousel/includes/class-admin.php` | Admin settings page: tabs, repeaters, sanitisation |
| `assets/doqix-pricing-carousel/includes/class-frontend.php` | Shortcode rendering, conditional enqueue |
| `assets/doqix-pricing-carousel/assets/css/admin.css` | Admin UI styles |
| `assets/doqix-pricing-carousel/assets/js/admin.js` | Repeaters, mini rich text, tab switching, colour sync |
| `assets/doqix-pricing-carousel/assets/css/frontend.css` | Card styles, grid, carousel, responsive |
| `assets/doqix-pricing-carousel/assets/js/frontend.js` | Carousel logic, swipe, navigation, active scaling |
| `assets/doqix-pricing-carousel/uninstall.php` | Clean removal |
| `assets/doqix-pricing-carousel/readme.txt` | Plugin readme |
| `assets/doqix-settings/doqix-settings.php` | **Modify:** Add parent menu, rename to "Site Settings" |
| `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php` | **Modify:** Switch to submenu under Do.Qix |

---

### Task 1: Unified Do.Qix Admin Menu

Update existing plugins to create a shared parent menu. This must happen first so the pricing carousel can register under it.

**Files:**
- Modify: `assets/doqix-settings/doqix-settings.php:108-116` (add_settings_page method)
- Modify: `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php:27-37` (add_settings_page method)

- [ ] **Step 1: Update doqix-settings to register parent menu**

In `assets/doqix-settings/doqix-settings.php`, replace the `add_settings_page` method (lines 108-116):

```php
public function add_settings_page() {
    // Register parent Do.Qix menu
    add_menu_page(
        'Do.Qix',
        'Do.Qix',
        'manage_options',
        'doqix-settings',
        array( $this, 'render_settings_page' ),
        'dashicons-admin-generic',
        80
    );

    // Rename the auto-created first submenu item
    add_submenu_page(
        'doqix-settings',
        'Site Settings',
        'Site Settings',
        'manage_options',
        'doqix-settings',
        array( $this, 'render_settings_page' )
    );
}
```

- [ ] **Step 2: Update ROI Calculator to register as submenu**

In `assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php`, replace the `add_settings_page` method (lines 27-37):

```php
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
```

- [ ] **Step 3: Verify in WordPress admin**

Activate both plugins. Check:
- "Do.Qix" parent menu appears in sidebar with dashicons-admin-generic icon
- "Site Settings" submenu opens the doqix-settings page
- "ROI Calculator" submenu opens the ROI calculator settings
- Deactivating doqix-settings makes ROI Calculator show as standalone top-level menu

- [ ] **Step 4: Commit**

```bash
git add assets/doqix-settings/doqix-settings.php assets/doqix-roi-calculator-v2/includes/class-doqix-roi-admin.php
git commit -m "feat(wordpress): unify Do.Qix admin menu with submenu structure"
```

---

### Task 2: Main Plugin File — Constants, Defaults, Hooks

**Files:**
- Create: `assets/doqix-pricing-carousel/doqix-pricing-carousel.php`

- [ ] **Step 1: Create plugin directory structure**

```bash
mkdir -p assets/doqix-pricing-carousel/{includes,assets/{css,js},languages}
```

- [ ] **Step 2: Write the main plugin file**

Create `assets/doqix-pricing-carousel/doqix-pricing-carousel.php`:

```php
<?php
/**
 * Plugin Name: Do.Qix Pricing Carousel
 * Plugin URI:  https://doqix.co.za
 * Description: Configurable pricing table carousel with admin-managed tiers, colours, and presets. Use shortcode [doqix_pricing] or [doqix_pricing preset="name"].
 * Version:     1.0.0
 * Author:      Do.Qix
 * Author URI:  https://doqix.co.za
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: doqix-pricing-carousel
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* ── Constants ── */
define( 'DOQIX_PRICING_VERSION',    '1.0.0' );
define( 'DOQIX_PRICING_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DOQIX_PRICING_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DOQIX_PRICING_OPTION_KEY', 'doqix_pricing_settings' );

/**
 * Default values for a single card.
 *
 * @return array
 */
function doqix_pricing_get_card_defaults() {
    return array(
        'name'              => '',
        'subtitle'          => '',
        'price'             => '',
        'price_suffix'      => '/mo',
        'price_annual'      => '',
        'setup_fee'         => '',
        'savings'           => '',
        'features'          => '',
        'description'       => '',
        'excludes'          => '',
        'cta_label'         => 'Start Free',
        'cta_url'           => '/contact',
        'badge'             => '',
        'featured'          => 0,
        'icon_type'         => 'none',
        'icon_value'        => '',
        'sort_order'        => 0,
        'color_header_bg'   => '',
        'color_header_text' => '',
        'color_cta_bg'      => '',
        'color_cta_text'    => '',
        'color_badge_bg'    => '',
        'color_badge_text'  => '',
        'color_card_bg'     => '',
        'color_feat_text'   => '',
        'color_feat_check'  => '',
        'color_exc_text'    => '',
    );
}

/**
 * Default values for a single preset.
 *
 * @return array
 */
function doqix_pricing_get_preset_defaults() {
    return array(
        'label'             => 'Default',

        /* Carousel settings */
        'display_desktop'   => 'grid',
        'display_mobile'    => 'carousel',
        'mobile_breakpoint' => 768,
        'nav_style'         => 'breadcrumbs',
        'autoplay'          => 0,
        'autoplay_speed'    => 5000,
        'active_scale'      => 1.15,

        /* Billing toggle */
        'billing_toggle'    => 0,
        'monthly_label'     => 'Monthly',
        'annual_label'      => 'Annual',
        'annual_discount'   => 15,

        /* Preset-level colours (empty = theme default) */
        'color_header_bg'   => '',
        'color_header_text' => '',
        'color_accent'      => '',
        'color_card_bg'     => '',
        'color_cta_bg'      => '',
        'color_cta_text'    => '',
        'color_badge_bg'    => '',
        'color_badge_text'  => '',
        'color_feat_text'   => '',
        'color_feat_check'  => '',
        'color_exc_text'    => '',
        'color_exc_title'   => '',

        /* Cards */
        'cards' => array(
            array_merge( doqix_pricing_get_card_defaults(), array(
                'name'     => 'Solo',
                'subtitle' => 'Solopreneurs & freelancers',
                'price'    => '999',
                'savings'  => '~R3,000-R8,000/mo',
                'setup_fee'=> 'Free setup',
                'features' => '<p>1 workflow</p><p>Email support (48hr)</p><p>Hosting &amp; monitoring</p><p>POPIA compliant</p><p>No lock-in</p>',
                'excludes' => '<p>Training (R1,500/session)</p><p>Additional hosting costs</p>',
            ) ),
            array_merge( doqix_pricing_get_card_defaults(), array(
                'name'      => 'Team',
                'subtitle'  => 'Small teams (2-15 people)',
                'price'     => '2500',
                'savings'   => '~R8,000-R20,000/mo',
                'setup_fee' => 'R1,500 setup',
                'badge'     => 'Most Popular',
                'featured'  => 1,
                'features'  => '<p>Up to 3 workflows</p><p>Priority + WhatsApp (24hr)</p><p>Hosting &amp; monitoring</p><p>POPIA compliant</p><p>No lock-in</p>',
                'excludes'  => '<p>Training (R1,500/session)</p><p>Additional hosting costs</p>',
                'sort_order' => 1,
            ) ),
            array_merge( doqix_pricing_get_card_defaults(), array(
                'name'      => 'Business',
                'subtitle'  => 'Growing SMEs (15-50 people)',
                'price'     => '5500',
                'savings'   => '~R20,000-R50,000/mo',
                'setup_fee' => 'R2,500 setup',
                'features'  => '<p>Up to 6 workflows</p><p>Dedicated + monthly strategy call</p><p>Training included</p><p>Hosting &amp; monitoring</p><p>No lock-in</p>',
                'excludes'  => '<p>Additional hosting costs</p>',
                'sort_order' => 2,
            ) ),
            array_merge( doqix_pricing_get_card_defaults(), array(
                'name'      => 'Enterprise',
                'subtitle'  => 'Larger operations (50+)',
                'price'     => 'Custom',
                'price_suffix' => '',
                'savings'   => 'R50,000+/mo',
                'setup_fee' => "Let's talk",
                'cta_label' => "Show Me What's Possible",
                'features'  => '<p>Unlimited workflows (scoped)</p><p>Dedicated account manager</p><p>Training included</p><p>Hosting &amp; monitoring</p><p>No lock-in</p>',
                'excludes'  => '<p>Quoted separately</p>',
                'sort_order' => 3,
            ) ),
        ),
    );
}

/**
 * Single source of truth for all default settings.
 *
 * @return array
 */
function doqix_pricing_get_defaults() {
    return array(
        'global' => array(
            'version'         => DOQIX_PRICING_VERSION,
            'currency_symbol' => 'R',
            'currency_position' => 'before',
        ),
        'presets' => array(
            'default' => doqix_pricing_get_preset_defaults(),
        ),
    );
}

/**
 * Detect theme accent colour (Themify first, then WP theme mods).
 *
 * @return string Hex colour or empty string.
 */
function doqix_pricing_get_theme_accent_color() {
    $themify = get_option( 'themify_setting', array() );
    foreach ( array( 'styling-link_color', 'styling-accent_color' ) as $tf_key ) {
        if ( ! empty( $themify[ $tf_key ] ) ) {
            $color = sanitize_hex_color( $themify[ $tf_key ] );
            if ( $color ) {
                return $color;
            }
        }
    }
    foreach ( array( 'link_color', 'accent_color', 'primary_color' ) as $mod_key ) {
        $color = get_theme_mod( $mod_key, '' );
        $color = sanitize_hex_color( $color );
        if ( $color ) {
            return $color;
        }
    }
    return '';
}

/* ── Load classes ── */
require_once DOQIX_PRICING_PLUGIN_DIR . 'includes/class-admin.php';
require_once DOQIX_PRICING_PLUGIN_DIR . 'includes/class-frontend.php';

/* ── Instantiate ── */
if ( is_admin() ) {
    new Doqix_Pricing_Admin();
}
new Doqix_Pricing_Frontend();

/* ── Activation: seed defaults ── */
register_activation_hook( __FILE__, function () {
    add_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );
} );
```

- [ ] **Step 3: Create placeholder class files**

Create `assets/doqix-pricing-carousel/includes/class-admin.php`:

```php
<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Doqix_Pricing_Admin {
    public function __construct() {
        // Hooks added in Task 3
    }
}
```

Create `assets/doqix-pricing-carousel/includes/class-frontend.php`:

```php
<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Doqix_Pricing_Frontend {
    public function __construct() {
        // Hooks added in Task 8
    }
}
```

- [ ] **Step 4: Verify plugin activates without errors**

Activate "Do.Qix Pricing Carousel" in WordPress admin. Check:
- No PHP errors
- Plugin appears in active plugins list
- "Pricing Carousel" submenu appears under "Do.Qix" (if doqix-settings is active)

- [ ] **Step 5: Commit**

```bash
git add assets/doqix-pricing-carousel/
git commit -m "feat(pricing-carousel): scaffold plugin with constants, defaults, and class stubs"
```

---

### Task 3: Admin Class — Settings Page Skeleton with Tabs

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php`

- [ ] **Step 1: Write the admin class with menu registration, settings, and tab rendering**

Replace the entire contents of `assets/doqix-pricing-carousel/includes/class-admin.php`:

```php
<?php
/**
 * Admin: Settings page for the Pricing Carousel.
 * Tabbed UI: Preset tabs (top) + sub-tabs per preset (Cards, Carousel, Colours, Billing).
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

    /* ── Menu registration ── */

    public function add_settings_page() {
        $parent_slug = 'doqix-settings';

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

    /* ── Asset enqueue (only on our page) ── */

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

    /* ── Settings API ── */

    public function register_settings() {
        register_setting(
            'doqix_pricing_settings_group',
            DOQIX_PRICING_OPTION_KEY,
            array( 'sanitize_callback' => array( $this, 'sanitize_settings' ) )
        );
    }

    /* ── Helpers ── */

    private function get_settings() {
        return get_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );
    }

    private function get_current_preset_slug() {
        $s       = $this->get_settings();
        $presets = isset( $s['presets'] ) ? $s['presets'] : array();
        $tab     = isset( $_GET['preset'] ) ? sanitize_key( $_GET['preset'] ) : '';
        if ( $tab && isset( $presets[ $tab ] ) ) {
            return $tab;
        }
        // Return first preset key
        reset( $presets );
        return key( $presets ) ?: 'default';
    }

    private function get_current_sub_tab() {
        $valid = array( 'cards', 'carousel', 'colours', 'billing' );
        $tab   = isset( $_GET['sub'] ) ? sanitize_key( $_GET['sub'] ) : 'cards';
        return in_array( $tab, $valid, true ) ? $tab : 'cards';
    }

    /* ── Preset actions (add/delete) ── */

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

            $s = $this->get_settings();
            if ( ! isset( $s['presets'][ $slug ] ) ) {
                $new_preset          = doqix_pricing_get_preset_defaults();
                $new_preset['label'] = $label;
                $s['presets'][ $slug ] = $new_preset;
                update_option( DOQIX_PRICING_OPTION_KEY, $s );
            }

            wp_safe_redirect( add_query_arg( array( 'page' => 'doqix-pricing-carousel', 'preset' => $slug ), admin_url( 'admin.php' ) ) );
            exit;
        }

        /* Delete preset */
        if ( isset( $_GET['delete_preset'] ) && isset( $_GET['_wpnonce'] ) ) {
            $slug = sanitize_key( $_GET['delete_preset'] );
            if ( 'default' === $slug ) {
                return; // Cannot delete default
            }
            if ( ! wp_verify_nonce( $_GET['_wpnonce'], 'doqix_pricing_delete_' . $slug ) ) {
                return;
            }

            $s = $this->get_settings();
            unset( $s['presets'][ $slug ] );
            update_option( DOQIX_PRICING_OPTION_KEY, $s );

            wp_safe_redirect( add_query_arg( array( 'page' => 'doqix-pricing-carousel' ), admin_url( 'admin.php' ) ) );
            exit;
        }
    }

    /* ── Render settings page ── */

    public function render_settings_page() {
        $s            = $this->get_settings();
        $presets      = isset( $s['presets'] ) ? $s['presets'] : array();
        $current_slug = $this->get_current_preset_slug();
        $current_sub  = $this->get_current_sub_tab();
        $preset       = isset( $presets[ $current_slug ] ) ? $presets[ $current_slug ] : doqix_pricing_get_preset_defaults();
        $base_url     = admin_url( 'admin.php?page=doqix-pricing-carousel' );

        ?>
        <div class="wrap doqix-pricing-admin">
            <h1><?php esc_html_e( 'Pricing Carousel Settings', 'doqix-pricing-carousel' ); ?></h1>
            <p class="description">
                <?php esc_html_e( 'Shortcode:', 'doqix-pricing-carousel' ); ?>
                <code>[doqix_pricing]</code>
                <?php esc_html_e( 'or', 'doqix-pricing-carousel' ); ?>
                <code>[doqix_pricing preset="<?php echo esc_attr( $current_slug ); ?>"]</code>
            </p>

            <!-- Preset tabs -->
            <nav class="nav-tab-wrapper doqix-preset-tabs">
                <?php foreach ( $presets as $slug => $p ) :
                    $active = ( $slug === $current_slug ) ? ' nav-tab-active' : '';
                    $url    = add_query_arg( 'preset', $slug, $base_url );
                    ?>
                    <a class="nav-tab<?php echo $active; ?>" href="<?php echo esc_url( $url ); ?>">
                        <?php echo esc_html( $p['label'] ); ?>
                        <?php if ( 'default' !== $slug ) : ?>
                            <span class="doqix-delete-preset" data-href="<?php echo esc_url( wp_nonce_url( add_query_arg( 'delete_preset', $slug, $base_url ), 'doqix_pricing_delete_' . $slug ) ); ?>" title="<?php esc_attr_e( 'Delete preset', 'doqix-pricing-carousel' ); ?>">&times;</span>
                        <?php endif; ?>
                    </a>
                <?php endforeach; ?>
                <button type="button" class="nav-tab doqix-add-preset-btn" title="<?php esc_attr_e( 'Add preset', 'doqix-pricing-carousel' ); ?>">+</button>
            </nav>

            <!-- Add preset form (hidden by default, shown via JS) -->
            <div id="doqix-add-preset-form" style="display:none; margin:12px 0;">
                <form method="post">
                    <?php wp_nonce_field( 'doqix_pricing_preset_action', 'doqix_pricing_preset_nonce' ); ?>
                    <input type="text" name="doqix_pricing_new_preset_name" placeholder="<?php esc_attr_e( 'Preset name', 'doqix-pricing-carousel' ); ?>" required>
                    <button type="submit" name="doqix_pricing_add_preset" class="button button-secondary"><?php esc_html_e( 'Add', 'doqix-pricing-carousel' ); ?></button>
                    <button type="button" class="button doqix-cancel-preset"><?php esc_html_e( 'Cancel', 'doqix-pricing-carousel' ); ?></button>
                </form>
            </div>

            <!-- Sub tabs -->
            <div class="doqix-sub-tabs">
                <?php
                $sub_tabs = array(
                    'cards'    => __( 'Cards', 'doqix-pricing-carousel' ),
                    'carousel' => __( 'Carousel', 'doqix-pricing-carousel' ),
                    'colours'  => __( 'Colours', 'doqix-pricing-carousel' ),
                    'billing'  => __( 'Billing', 'doqix-pricing-carousel' ),
                );
                foreach ( $sub_tabs as $tab_key => $tab_label ) :
                    $active = ( $tab_key === $current_sub ) ? ' doqix-sub-active' : '';
                    $url    = add_query_arg( array( 'preset' => $current_slug, 'sub' => $tab_key ), $base_url );
                    ?>
                    <a class="doqix-sub-tab<?php echo $active; ?>" href="<?php echo esc_url( $url ); ?>">
                        <?php echo esc_html( $tab_label ); ?>
                    </a>
                <?php endforeach; ?>
            </div>

            <!-- Tab content -->
            <div class="doqix-tab-content">
                <form method="post" action="options.php">
                    <?php settings_fields( 'doqix_pricing_settings_group' ); ?>

                    <!-- Preserve global settings -->
                    <input type="hidden" name="<?php echo esc_attr( DOQIX_PRICING_OPTION_KEY ); ?>[_preset_slug]" value="<?php echo esc_attr( $current_slug ); ?>">
                    <input type="hidden" name="<?php echo esc_attr( DOQIX_PRICING_OPTION_KEY ); ?>[_sub_tab]" value="<?php echo esc_attr( $current_sub ); ?>">

                    <?php
                    switch ( $current_sub ) {
                        case 'cards':
                            $this->render_cards_tab( $preset, $current_slug );
                            break;
                        case 'carousel':
                            $this->render_carousel_tab( $preset, $current_slug );
                            break;
                        case 'colours':
                            $this->render_colours_tab( $preset, $current_slug );
                            break;
                        case 'billing':
                            $this->render_billing_tab( $preset, $current_slug );
                            break;
                    }
                    ?>

                    <?php submit_button(); ?>
                </form>
            </div>
        </div>
        <?php
    }

    /* ── Tab renderers (stubs — implemented in Tasks 4-7) ── */

    private function render_cards_tab( $preset, $slug ) {
        echo '<p>Cards tab — Task 4</p>';
    }

    private function render_carousel_tab( $preset, $slug ) {
        echo '<p>Carousel tab — Task 5</p>';
    }

    private function render_colours_tab( $preset, $slug ) {
        echo '<p>Colours tab — Task 6</p>';
    }

    private function render_billing_tab( $preset, $slug ) {
        echo '<p>Billing tab — Task 7</p>';
    }

    /* ── Sanitisation (stub — implemented in Task 7) ── */

    public function sanitize_settings( $input ) {
        // Stub — pass through for now
        $s           = $this->get_settings();
        $preset_slug = isset( $input['_preset_slug'] ) ? sanitize_key( $input['_preset_slug'] ) : 'default';
        $sub_tab     = isset( $input['_sub_tab'] ) ? sanitize_key( $input['_sub_tab'] ) : 'cards';

        // Preserve all existing data, only update the current tab
        // Full implementation in Task 7
        return $s;
    }
}
```

- [ ] **Step 2: Create empty asset files**

Create empty files so enqueue doesn't 404:

`assets/doqix-pricing-carousel/assets/css/admin.css`:
```css
/* Do.Qix Pricing Carousel — Admin Styles */
```

`assets/doqix-pricing-carousel/assets/js/admin.js`:
```javascript
/* Do.Qix Pricing Carousel — Admin JS */
(function() { 'use strict'; })();
```

- [ ] **Step 3: Verify settings page loads**

Navigate to Do.Qix → Pricing Carousel in WP admin. Check:
- Page loads without errors
- Preset tabs show "Default" + "+" button
- Sub-tabs show Cards, Carousel, Colours, Billing
- Clicking sub-tabs switches content (stub text)
- Adding a new preset works and redirects
- Shortcode hint displays with current preset name

- [ ] **Step 4: Commit**

```bash
git add assets/doqix-pricing-carousel/
git commit -m "feat(pricing-carousel): admin settings page skeleton with preset and sub-tab navigation"
```

---

### Task 4: Admin — Cards Tab

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php` (render_cards_tab method)

- [ ] **Step 1: Implement the render_cards_tab method**

Replace the `render_cards_tab` stub in `class-admin.php`:

```php
private function render_cards_tab( $preset, $slug ) {
    $cards    = isset( $preset['cards'] ) ? $preset['cards'] : array();
    $opt      = DOQIX_PRICING_OPTION_KEY;
    $base     = $opt . '[presets][' . esc_attr( $slug ) . '][cards]';

    echo '<div id="doqix-cards-repeater">';

    foreach ( $cards as $i => $card ) {
        $card  = wp_parse_args( $card, doqix_pricing_get_card_defaults() );
        $name  = $base . '[' . $i . ']';
        $title = ! empty( $card['name'] ) ? esc_html( $card['name'] ) : __( 'New Card', 'doqix-pricing-carousel' );

        ?>
        <div class="doqix-card-panel doqix-repeater-row" data-index="<?php echo (int) $i; ?>">
            <div class="doqix-card-header" onclick="doqixPricingToggleCard(this)">
                <span class="doqix-drag-handle">⋮⋮</span>
                <span class="doqix-card-title"><?php echo $title; ?></span>
                <?php if ( ! empty( $card['badge'] ) ) : ?>
                    <span class="doqix-badge-preview"><?php echo esc_html( $card['badge'] ); ?></span>
                <?php endif; ?>
                <?php if ( $card['featured'] ) : ?>
                    <span class="doqix-featured-star">★</span>
                <?php endif; ?>
                <button type="button" class="doqix-remove-card" onclick="event.stopPropagation();doqixPricingRemoveCard(this)"><?php esc_html_e( 'Remove', 'doqix-pricing-carousel' ); ?></button>
                <span class="doqix-collapse-icon">▶</span>
            </div>
            <div class="doqix-card-body">
                <div class="doqix-field-grid">
                    <?php $this->render_text_field( $name . '[name]', __( 'Tier Name', 'doqix-pricing-carousel' ), $card['name'] ); ?>
                    <?php $this->render_text_field( $name . '[subtitle]', __( 'Subtitle', 'doqix-pricing-carousel' ), $card['subtitle'] ); ?>
                    <?php $this->render_text_field( $name . '[price]', __( 'Price', 'doqix-pricing-carousel' ), $card['price'] ); ?>
                    <?php $this->render_text_field( $name . '[price_suffix]', __( 'Price Suffix', 'doqix-pricing-carousel' ), $card['price_suffix'] ); ?>
                    <?php $this->render_text_field( $name . '[price_annual]', __( 'Annual Price', 'doqix-pricing-carousel' ), $card['price_annual'], __( 'Used when billing toggle is on', 'doqix-pricing-carousel' ) ); ?>
                    <?php $this->render_text_field( $name . '[setup_fee]', __( 'Setup Fee', 'doqix-pricing-carousel' ), $card['setup_fee'] ); ?>
                    <?php $this->render_text_field( $name . '[savings]', __( 'Savings Line', 'doqix-pricing-carousel' ), $card['savings'] ); ?>
                    <?php $this->render_text_field( $name . '[cta_label]', __( 'CTA Label', 'doqix-pricing-carousel' ), $card['cta_label'] ); ?>
                    <?php $this->render_text_field( $name . '[cta_url]', __( 'CTA URL', 'doqix-pricing-carousel' ), $card['cta_url'] ); ?>
                    <?php $this->render_text_field( $name . '[badge]', __( 'Badge Text', 'doqix-pricing-carousel' ), $card['badge'], __( 'Empty = no badge', 'doqix-pricing-carousel' ) ); ?>
                    <div class="doqix-field">
                        <label><?php esc_html_e( 'Featured', 'doqix-pricing-carousel' ); ?></label>
                        <label class="doqix-toggle">
                            <input type="hidden" name="<?php echo esc_attr( $name ); ?>[featured]" value="0">
                            <input type="checkbox" name="<?php echo esc_attr( $name ); ?>[featured]" value="1" <?php checked( $card['featured'], 1 ); ?>>
                            <span class="doqix-toggle-slider"></span>
                            <span class="doqix-toggle-label"><?php esc_html_e( 'Highlight this card', 'doqix-pricing-carousel' ); ?></span>
                        </label>
                    </div>
                    <div class="doqix-field">
                        <label><?php esc_html_e( 'Icon', 'doqix-pricing-carousel' ); ?></label>
                        <select name="<?php echo esc_attr( $name ); ?>[icon_type]">
                            <option value="none" <?php selected( $card['icon_type'], 'none' ); ?>><?php esc_html_e( 'None', 'doqix-pricing-carousel' ); ?></option>
                            <option value="dashicon" <?php selected( $card['icon_type'], 'dashicon' ); ?>><?php esc_html_e( 'Dashicon', 'doqix-pricing-carousel' ); ?></option>
                            <option value="url" <?php selected( $card['icon_type'], 'url' ); ?>><?php esc_html_e( 'Image URL', 'doqix-pricing-carousel' ); ?></option>
                        </select>
                    </div>
                </div>

                <input type="hidden" name="<?php echo esc_attr( $name ); ?>[sort_order]" value="<?php echo (int) $i; ?>">

                <?php $this->render_mini_editor( $name . '[features]', __( 'Features', 'doqix-pricing-carousel' ), $card['features'] ); ?>
                <?php $this->render_mini_editor( $name . '[description]', __( 'Description', 'doqix-pricing-carousel' ), $card['description'], true ); ?>
                <?php $this->render_mini_editor( $name . '[excludes]', __( 'Excludes', 'doqix-pricing-carousel' ), $card['excludes'] ); ?>

                <!-- Colour overrides -->
                <div class="doqix-color-overrides-toggle" onclick="this.nextElementSibling.classList.toggle('doqix-open')">
                    <span class="doqix-collapse-icon">▶</span>
                    <?php esc_html_e( 'Colour Overrides', 'doqix-pricing-carousel' ); ?>
                    <span class="doqix-hint"><?php esc_html_e( '(empty = inherit from preset)', 'doqix-pricing-carousel' ); ?></span>
                </div>
                <div class="doqix-color-overrides">
                    <div class="doqix-color-grid">
                        <?php
                        $card_colors = array(
                            'color_header_bg'   => __( 'Header BG', 'doqix-pricing-carousel' ),
                            'color_header_text'  => __( 'Header Text', 'doqix-pricing-carousel' ),
                            'color_cta_bg'      => __( 'CTA BG', 'doqix-pricing-carousel' ),
                            'color_cta_text'    => __( 'CTA Text', 'doqix-pricing-carousel' ),
                            'color_badge_bg'    => __( 'Badge BG', 'doqix-pricing-carousel' ),
                            'color_badge_text'  => __( 'Badge Text', 'doqix-pricing-carousel' ),
                            'color_card_bg'     => __( 'Card BG', 'doqix-pricing-carousel' ),
                            'color_feat_text'   => __( 'Features Text', 'doqix-pricing-carousel' ),
                            'color_feat_check'  => __( 'Features Check', 'doqix-pricing-carousel' ),
                            'color_exc_text'    => __( 'Excludes Text', 'doqix-pricing-carousel' ),
                        );
                        foreach ( $card_colors as $key => $label ) {
                            $this->render_color_field( $name . '[' . $key . ']', $label, $card[ $key ] );
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    echo '</div>';
    ?>
    <button type="button" class="button button-secondary" id="doqix-add-card"><?php esc_html_e( '+ Add Card', 'doqix-pricing-carousel' ); ?></button>
    <?php
}

/* ── Field helper methods ── */

private function render_text_field( $name, $label, $value, $hint = '' ) {
    ?>
    <div class="doqix-field">
        <label><?php echo esc_html( $label ); ?></label>
        <input type="text" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $value ); ?>"<?php if ( $hint ) : ?> placeholder="<?php echo esc_attr( $hint ); ?>"<?php endif; ?>>
        <?php if ( $hint ) : ?><span class="doqix-hint"><?php echo esc_html( $hint ); ?></span><?php endif; ?>
    </div>
    <?php
}

private function render_color_field( $name, $label, $value ) {
    $display = ! empty( $value ) ? $value : __( 'Preset', 'doqix-pricing-carousel' );
    ?>
    <div class="doqix-field">
        <label><?php echo esc_html( $label ); ?></label>
        <div class="doqix-color-field">
            <input type="color" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $value ?: '#0886B5' ); ?>" data-default="<?php echo esc_attr( $value ); ?>">
            <code><?php echo esc_html( $display ); ?></code>
            <button type="button" class="doqix-reset-color"><?php esc_html_e( 'Reset', 'doqix-pricing-carousel' ); ?></button>
        </div>
    </div>
    <?php
}

private function render_mini_editor( $name, $label, $value, $optional = false ) {
    ?>
    <div class="doqix-editor-section">
        <div class="doqix-section-title">
            <?php echo esc_html( $label ); ?>
            <?php if ( $optional ) : ?><span class="doqix-hint"><?php esc_html_e( '(optional)', 'doqix-pricing-carousel' ); ?></span><?php endif; ?>
        </div>
        <div class="doqix-mini-editor">
            <div class="doqix-mini-toolbar">
                <button type="button" onclick="document.execCommand('bold')" title="Bold"><b>B</b></button>
                <button type="button" onclick="document.execCommand('italic')" title="Italic"><i>I</i></button>
                <span class="doqix-sep"></span>
                <button type="button" onclick="document.execCommand('insertUnorderedList')" title="List">☰</button>
                <button type="button" onclick="doqixPricingInsertLink(this)" title="Link">🔗</button>
            </div>
            <div class="doqix-mini-editor-content" contenteditable="true" data-target="<?php echo esc_attr( $name ); ?>"><?php echo wp_kses_post( $value ); ?></div>
            <input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $value ); ?>">
        </div>
    </div>
    <?php
}
```

- [ ] **Step 2: Verify cards tab renders**

Navigate to Pricing Carousel → Cards tab. Check:
- All 4 default cards render as collapsible panels
- Team card shows badge preview and featured star in header
- Expanding a card shows all fields: text inputs, toggle, select, mini editors, colour overrides
- Mini editors show the HTML content from defaults

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/includes/class-admin.php
git commit -m "feat(pricing-carousel): admin cards tab with repeater panels, mini editors, and colour overrides"
```

---

### Task 5: Admin — Carousel & Billing Tabs

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php` (render_carousel_tab, render_billing_tab)

- [ ] **Step 1: Implement render_carousel_tab**

Replace the `render_carousel_tab` stub:

```php
private function render_carousel_tab( $preset, $slug ) {
    $opt  = DOQIX_PRICING_OPTION_KEY . '[presets][' . esc_attr( $slug ) . ']';
    ?>
    <h3><?php esc_html_e( 'Display Mode', 'doqix-pricing-carousel' ); ?></h3>
    <p class="description"><?php esc_html_e( 'Choose a layout for each screen size.', 'doqix-pricing-carousel' ); ?></p>

    <div class="doqix-device-split">
        <div class="doqix-device-panel">
            <div class="doqix-device-header">🖥 <?php esc_html_e( 'Desktop', 'doqix-pricing-carousel' ); ?></div>
            <div class="doqix-device-body">
                <label class="doqix-radio-option">
                    <input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_desktop]" value="grid" <?php checked( $preset['display_desktop'], 'grid' ); ?>>
                    <span><strong><?php esc_html_e( 'Grid', 'doqix-pricing-carousel' ); ?></strong><br><small><?php esc_html_e( 'All cards visible in a row', 'doqix-pricing-carousel' ); ?></small></span>
                </label>
                <label class="doqix-radio-option">
                    <input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_desktop]" value="carousel" <?php checked( $preset['display_desktop'], 'carousel' ); ?>>
                    <span><strong><?php esc_html_e( 'Carousel', 'doqix-pricing-carousel' ); ?></strong><br><small><?php esc_html_e( 'Scroll/swipe with active card scaling', 'doqix-pricing-carousel' ); ?></small></span>
                </label>
            </div>
        </div>
        <div class="doqix-device-panel">
            <div class="doqix-device-header">📱 <?php esc_html_e( 'Mobile', 'doqix-pricing-carousel' ); ?></div>
            <div class="doqix-device-body">
                <label class="doqix-radio-option">
                    <input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mobile]" value="grid" <?php checked( $preset['display_mobile'], 'grid' ); ?>>
                    <span><strong><?php esc_html_e( 'Grid', 'doqix-pricing-carousel' ); ?></strong><br><small><?php esc_html_e( 'Cards stack vertically', 'doqix-pricing-carousel' ); ?></small></span>
                </label>
                <label class="doqix-radio-option">
                    <input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mobile]" value="carousel" <?php checked( $preset['display_mobile'], 'carousel' ); ?>>
                    <span><strong><?php esc_html_e( 'Carousel', 'doqix-pricing-carousel' ); ?></strong><br><small><?php esc_html_e( 'Swipe with active card + peeking edges', 'doqix-pricing-carousel' ); ?></small></span>
                </label>
            </div>
        </div>
    </div>

    <div class="doqix-field" style="margin:16px 0;">
        <label><?php esc_html_e( 'Breakpoint (px)', 'doqix-pricing-carousel' ); ?></label>
        <input type="number" name="<?php echo esc_attr( $opt ); ?>[mobile_breakpoint]" value="<?php echo (int) $preset['mobile_breakpoint']; ?>" min="320" max="1200" step="1" class="small-text">
        <span class="doqix-hint"><?php esc_html_e( 'Below this width → mobile layout', 'doqix-pricing-carousel' ); ?></span>
    </div>

    <hr>

    <h3><?php esc_html_e( 'Navigation Style', 'doqix-pricing-carousel' ); ?></h3>
    <p class="description"><?php esc_html_e( 'Applies when carousel mode is active.', 'doqix-pricing-carousel' ); ?></p>

    <div class="doqix-nav-options">
        <?php
        $nav_styles = array(
            'arrows'      => array( '‹ ›', __( 'Arrows', 'doqix-pricing-carousel' ), __( 'Side buttons', 'doqix-pricing-carousel' ) ),
            'dots'        => array( '● ● ●', __( 'Dots', 'doqix-pricing-carousel' ), __( 'Below carousel', 'doqix-pricing-carousel' ) ),
            'breadcrumbs' => array( 'A | B | C', __( 'Breadcrumbs', 'doqix-pricing-carousel' ), __( 'Named pills', 'doqix-pricing-carousel' ) ),
        );
        foreach ( $nav_styles as $value => $meta ) : ?>
            <label class="doqix-nav-option">
                <input type="radio" name="<?php echo esc_attr( $opt ); ?>[nav_style]" value="<?php echo esc_attr( $value ); ?>" <?php checked( $preset['nav_style'], $value ); ?>>
                <span class="doqix-nav-preview"><?php echo esc_html( $meta[0] ); ?></span>
                <span class="doqix-nav-label"><?php echo esc_html( $meta[1] ); ?></span>
                <span class="doqix-nav-sublabel"><?php echo esc_html( $meta[2] ); ?></span>
            </label>
        <?php endforeach; ?>
    </div>

    <p class="doqix-note"><?php esc_html_e( 'Navigation controls are hidden when grid mode is active on that screen size.', 'doqix-pricing-carousel' ); ?></p>

    <hr>

    <h3><?php esc_html_e( 'Carousel Options', 'doqix-pricing-carousel' ); ?></h3>

    <div class="doqix-field-grid" style="max-width:500px;">
        <div class="doqix-field">
            <label><?php esc_html_e( 'Active Card Scale', 'doqix-pricing-carousel' ); ?></label>
            <input type="number" name="<?php echo esc_attr( $opt ); ?>[active_scale]" value="<?php echo esc_attr( $preset['active_scale'] ); ?>" min="1" max="1.5" step="0.05" class="small-text">
            <span class="doqix-hint"><?php esc_html_e( '1.0 = same size, 1.15 = 15% larger', 'doqix-pricing-carousel' ); ?></span>
        </div>
        <div class="doqix-field">
            <label><?php esc_html_e( 'Autoplay', 'doqix-pricing-carousel' ); ?></label>
            <label class="doqix-toggle">
                <input type="hidden" name="<?php echo esc_attr( $opt ); ?>[autoplay]" value="0">
                <input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[autoplay]" value="1" <?php checked( $preset['autoplay'], 1 ); ?>>
                <span class="doqix-toggle-slider"></span>
                <span class="doqix-toggle-label"><?php esc_html_e( 'Auto-advance cards', 'doqix-pricing-carousel' ); ?></span>
            </label>
            <label style="margin-top:8px;display:block;"><?php esc_html_e( 'Speed (ms)', 'doqix-pricing-carousel' ); ?></label>
            <input type="number" name="<?php echo esc_attr( $opt ); ?>[autoplay_speed]" value="<?php echo (int) $preset['autoplay_speed']; ?>" min="1000" step="500" class="small-text">
        </div>
    </div>
    <?php
}
```

- [ ] **Step 2: Implement render_billing_tab**

Replace the `render_billing_tab` stub:

```php
private function render_billing_tab( $preset, $slug ) {
    $opt = DOQIX_PRICING_OPTION_KEY . '[presets][' . esc_attr( $slug ) . ']';
    ?>
    <div class="doqix-field" style="margin-bottom:20px;">
        <label><?php esc_html_e( 'Enable Monthly/Annual Toggle', 'doqix-pricing-carousel' ); ?></label>
        <label class="doqix-toggle">
            <input type="hidden" name="<?php echo esc_attr( $opt ); ?>[billing_toggle]" value="0">
            <input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[billing_toggle]" value="1" <?php checked( $preset['billing_toggle'], 1 ); ?>>
            <span class="doqix-toggle-slider"></span>
            <span class="doqix-toggle-label"><?php esc_html_e( 'Show billing period toggle on frontend (default: off)', 'doqix-pricing-carousel' ); ?></span>
        </label>
    </div>

    <div class="doqix-field-grid" style="max-width:500px;">
        <?php $this->render_text_field( $opt . '[monthly_label]', __( 'Monthly Label', 'doqix-pricing-carousel' ), $preset['monthly_label'] ); ?>
        <?php $this->render_text_field( $opt . '[annual_label]', __( 'Annual Label', 'doqix-pricing-carousel' ), $preset['annual_label'] ); ?>
        <div class="doqix-field">
            <label><?php esc_html_e( 'Annual Discount %', 'doqix-pricing-carousel' ); ?></label>
            <input type="number" name="<?php echo esc_attr( $opt ); ?>[annual_discount]" value="<?php echo (int) $preset['annual_discount']; ?>" min="0" max="100" class="small-text">
        </div>
    </div>
    <?php
}
```

- [ ] **Step 3: Verify both tabs render**

Check Carousel and Billing tabs in WP admin:
- Carousel: Desktop/Mobile radio panels, breakpoint input, nav style options, scale/autoplay fields
- Billing: Toggle, labels, discount percentage

- [ ] **Step 4: Commit**

```bash
git add assets/doqix-pricing-carousel/includes/class-admin.php
git commit -m "feat(pricing-carousel): admin carousel and billing tabs"
```

---

### Task 6: Admin — Colours Tab with Live Preview

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php` (render_colours_tab)

- [ ] **Step 1: Implement render_colours_tab**

Replace the `render_colours_tab` stub:

```php
private function render_colours_tab( $preset, $slug ) {
    $opt = DOQIX_PRICING_OPTION_KEY . '[presets][' . esc_attr( $slug ) . ']';

    $colors = array(
        'color_header_bg'   => __( 'Header Background', 'doqix-pricing-carousel' ),
        'color_header_text' => __( 'Header Text', 'doqix-pricing-carousel' ),
        'color_accent'      => __( 'Accent Colour', 'doqix-pricing-carousel' ),
        'color_card_bg'     => __( 'Card Background', 'doqix-pricing-carousel' ),
        'color_cta_bg'      => __( 'CTA Background', 'doqix-pricing-carousel' ),
        'color_cta_text'    => __( 'CTA Text', 'doqix-pricing-carousel' ),
        'color_badge_bg'    => __( 'Badge Background', 'doqix-pricing-carousel' ),
        'color_badge_text'  => __( 'Badge Text', 'doqix-pricing-carousel' ),
        'color_feat_text'   => __( 'Features Text', 'doqix-pricing-carousel' ),
        'color_feat_check'  => __( 'Features Checkmark', 'doqix-pricing-carousel' ),
        'color_exc_text'    => __( 'Excludes Text', 'doqix-pricing-carousel' ),
        'color_exc_title'   => __( 'Excludes Title', 'doqix-pricing-carousel' ),
    );

    $defaults = array(
        'color_header_bg'   => '#0886B5',
        'color_header_text' => '#ffffff',
        'color_accent'      => '#0886B5',
        'color_card_bg'     => '#f9fcfd',
        'color_cta_bg'      => '#0886B5',
        'color_cta_text'    => '#ffffff',
        'color_badge_bg'    => '#ff9500',
        'color_badge_text'  => '#ffffff',
        'color_feat_text'   => '#1d2327',
        'color_feat_check'  => '#0886B5',
        'color_exc_text'    => '#999999',
        'color_exc_title'   => '#666666',
    );

    ?>
    <p class="description"><?php esc_html_e( 'Preset-level colours. Cards inherit these unless overridden per-card. Empty = theme default.', 'doqix-pricing-carousel' ); ?></p>

    <div class="doqix-colours-layout">
        <!-- Pickers -->
        <div class="doqix-color-grid">
            <?php foreach ( $colors as $key => $label ) :
                $val     = ! empty( $preset[ $key ] ) ? $preset[ $key ] : '';
                $display = $val ?: __( 'Theme default', 'doqix-pricing-carousel' );
                $picker  = $val ?: $defaults[ $key ];
                ?>
                <div class="doqix-field">
                    <label><?php echo esc_html( $label ); ?></label>
                    <div class="doqix-color-field">
                        <input type="color" name="<?php echo esc_attr( $opt . '[' . $key . ']' ); ?>" value="<?php echo esc_attr( $picker ); ?>" data-var="--pricing-<?php echo esc_attr( str_replace( 'color_', '', $key ) ); ?>" data-default="<?php echo esc_attr( $val ); ?>">
                        <code><?php echo esc_html( $display ); ?></code>
                        <button type="button" class="doqix-reset-color"><?php esc_html_e( 'Reset', 'doqix-pricing-carousel' ); ?></button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Live preview card -->
        <div class="doqix-preview-area">
            <div class="doqix-preview-label"><?php esc_html_e( 'LIVE PREVIEW', 'doqix-pricing-carousel' ); ?></div>
            <div class="doqix-preview-card" id="doqix-preview-card">
                <div class="doqix-preview-badge"><?php esc_html_e( 'MOST POPULAR', 'doqix-pricing-carousel' ); ?></div>
                <div class="doqix-preview-header">
                    <div class="doqix-preview-name"><?php esc_html_e( 'Team', 'doqix-pricing-carousel' ); ?></div>
                    <div class="doqix-preview-sub"><?php esc_html_e( 'Small teams (2-15 people)', 'doqix-pricing-carousel' ); ?></div>
                    <div class="doqix-preview-price">R2,500<span>/mo</span></div>
                    <div class="doqix-preview-setup"><?php esc_html_e( 'R1,500 setup', 'doqix-pricing-carousel' ); ?></div>
                </div>
                <div class="doqix-preview-body">
                    <div class="doqix-preview-savings"><?php esc_html_e( 'Save ~R8,000-R20,000/mo', 'doqix-pricing-carousel' ); ?></div>
                    <div class="doqix-preview-feat"><?php esc_html_e( 'Up to 3 workflows', 'doqix-pricing-carousel' ); ?></div>
                    <div class="doqix-preview-feat"><?php esc_html_e( 'Priority + WhatsApp (24hr)', 'doqix-pricing-carousel' ); ?></div>
                    <div class="doqix-preview-feat"><?php esc_html_e( 'Hosting & monitoring', 'doqix-pricing-carousel' ); ?></div>
                    <div class="doqix-preview-feat"><?php esc_html_e( 'No lock-in', 'doqix-pricing-carousel' ); ?></div>
                    <div class="doqix-preview-excludes">
                        <div class="doqix-preview-exc-title"><?php esc_html_e( 'Excludes:', 'doqix-pricing-carousel' ); ?></div>
                        <div class="doqix-preview-exc-item"><?php esc_html_e( 'Training (R1,500/session)', 'doqix-pricing-carousel' ); ?></div>
                        <div class="doqix-preview-exc-item"><?php esc_html_e( 'Additional hosting costs', 'doqix-pricing-carousel' ); ?></div>
                    </div>
                </div>
                <div class="doqix-preview-cta"><?php esc_html_e( 'Start Free', 'doqix-pricing-carousel' ); ?></div>
            </div>
        </div>
    </div>
    <?php
}
```

- [ ] **Step 2: Verify colours tab**

Check: 12 colour pickers render in 2-column grid, preview card shows on right, preview label says "LIVE PREVIEW".

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/includes/class-admin.php
git commit -m "feat(pricing-carousel): admin colours tab with live preview card"
```

---

### Task 7: Admin — Sanitisation

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-admin.php` (sanitize_settings method)

- [ ] **Step 1: Implement full sanitisation**

Replace the `sanitize_settings` stub:

```php
public function sanitize_settings( $input ) {
    $s           = $this->get_settings();
    $preset_slug = isset( $input['_preset_slug'] ) ? sanitize_key( $input['_preset_slug'] ) : 'default';
    $sub_tab     = isset( $input['_sub_tab'] ) ? sanitize_key( $input['_sub_tab'] ) : 'cards';

    if ( ! isset( $s['presets'][ $preset_slug ] ) ) {
        $s['presets'][ $preset_slug ] = doqix_pricing_get_preset_defaults();
    }
    $preset = &$s['presets'][ $preset_slug ];
    $p_input = isset( $input['presets'][ $preset_slug ] ) ? $input['presets'][ $preset_slug ] : array();

    switch ( $sub_tab ) {
        case 'cards':
            $this->sanitize_cards( $preset, $p_input );
            break;
        case 'carousel':
            $this->sanitize_carousel( $preset, $p_input );
            break;
        case 'colours':
            $this->sanitize_colours( $preset, $p_input );
            break;
        case 'billing':
            $this->sanitize_billing( $preset, $p_input );
            break;
    }

    return $s;
}

private function sanitize_cards( &$preset, $input ) {
    if ( ! isset( $input['cards'] ) || ! is_array( $input['cards'] ) ) {
        return;
    }

    $cards = array();
    foreach ( $input['cards'] as $i => $card_input ) {
        $card = doqix_pricing_get_card_defaults();

        $text_fields = array( 'name', 'subtitle', 'price', 'price_suffix', 'price_annual', 'setup_fee', 'savings', 'cta_label', 'cta_url', 'badge', 'icon_value' );
        foreach ( $text_fields as $field ) {
            if ( isset( $card_input[ $field ] ) ) {
                $card[ $field ] = sanitize_text_field( $card_input[ $field ] );
            }
        }

        $rich_fields = array( 'features', 'description', 'excludes' );
        foreach ( $rich_fields as $field ) {
            if ( isset( $card_input[ $field ] ) ) {
                $card[ $field ] = wp_kses_post( $card_input[ $field ] );
            }
        }

        $card['featured']   = ! empty( $card_input['featured'] ) ? 1 : 0;
        $card['sort_order']  = isset( $card_input['sort_order'] ) ? absint( $card_input['sort_order'] ) : $i;
        $card['icon_type']   = isset( $card_input['icon_type'] ) && in_array( $card_input['icon_type'], array( 'none', 'dashicon', 'url' ), true ) ? $card_input['icon_type'] : 'none';

        $color_fields = array( 'color_header_bg', 'color_header_text', 'color_cta_bg', 'color_cta_text', 'color_badge_bg', 'color_badge_text', 'color_card_bg', 'color_feat_text', 'color_feat_check', 'color_exc_text' );
        foreach ( $color_fields as $field ) {
            if ( isset( $card_input[ $field ] ) ) {
                $card[ $field ] = sanitize_hex_color( $card_input[ $field ] ) ?: '';
            }
        }

        $cards[] = $card;
    }

    $preset['cards'] = $cards;
}

private function sanitize_carousel( &$preset, $input ) {
    $preset['display_desktop']   = isset( $input['display_desktop'] ) && in_array( $input['display_desktop'], array( 'grid', 'carousel' ), true ) ? $input['display_desktop'] : 'grid';
    $preset['display_mobile']    = isset( $input['display_mobile'] ) && in_array( $input['display_mobile'], array( 'grid', 'carousel' ), true ) ? $input['display_mobile'] : 'carousel';
    $preset['mobile_breakpoint'] = isset( $input['mobile_breakpoint'] ) ? absint( $input['mobile_breakpoint'] ) : 768;
    $preset['nav_style']         = isset( $input['nav_style'] ) && in_array( $input['nav_style'], array( 'arrows', 'dots', 'breadcrumbs' ), true ) ? $input['nav_style'] : 'breadcrumbs';
    $preset['active_scale']      = isset( $input['active_scale'] ) ? floatval( $input['active_scale'] ) : 1.15;
    $preset['autoplay']          = ! empty( $input['autoplay'] ) ? 1 : 0;
    $preset['autoplay_speed']    = isset( $input['autoplay_speed'] ) ? absint( $input['autoplay_speed'] ) : 5000;

    if ( $preset['active_scale'] < 1 ) { $preset['active_scale'] = 1; }
    if ( $preset['active_scale'] > 1.5 ) { $preset['active_scale'] = 1.5; }
    if ( $preset['mobile_breakpoint'] < 320 ) { $preset['mobile_breakpoint'] = 320; }
    if ( $preset['autoplay_speed'] < 1000 ) { $preset['autoplay_speed'] = 1000; }
}

private function sanitize_colours( &$preset, $input ) {
    $color_keys = array( 'color_header_bg', 'color_header_text', 'color_accent', 'color_card_bg', 'color_cta_bg', 'color_cta_text', 'color_badge_bg', 'color_badge_text', 'color_feat_text', 'color_feat_check', 'color_exc_text', 'color_exc_title' );
    foreach ( $color_keys as $key ) {
        if ( isset( $input[ $key ] ) ) {
            $preset[ $key ] = sanitize_hex_color( $input[ $key ] ) ?: '';
        }
    }
}

private function sanitize_billing( &$preset, $input ) {
    $preset['billing_toggle']  = ! empty( $input['billing_toggle'] ) ? 1 : 0;
    $preset['monthly_label']   = isset( $input['monthly_label'] ) ? sanitize_text_field( $input['monthly_label'] ) : 'Monthly';
    $preset['annual_label']    = isset( $input['annual_label'] ) ? sanitize_text_field( $input['annual_label'] ) : 'Annual';
    $preset['annual_discount'] = isset( $input['annual_discount'] ) ? absint( $input['annual_discount'] ) : 15;
    if ( $preset['annual_discount'] > 100 ) { $preset['annual_discount'] = 100; }
}
```

- [ ] **Step 2: Verify saving works**

Test each tab:
- Cards: Change a tier name, save, reload — name persists
- Carousel: Change display mode, save, reload — selection persists
- Colours: Change a colour, save, reload — colour persists
- Billing: Toggle on, save, reload — toggle persists
- Switch between tabs — data from other tabs is preserved

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/includes/class-admin.php
git commit -m "feat(pricing-carousel): admin sanitisation for all tabs with validation"
```

---

### Task 8: Admin CSS

**Files:**
- Modify: `assets/doqix-pricing-carousel/assets/css/admin.css`

- [ ] **Step 1: Write the complete admin stylesheet**

Replace the contents of `assets/doqix-pricing-carousel/assets/css/admin.css` with the full admin styles. Reference the mockup at `.superpowers/brainstorm/19744-1775636369/content/admin-full-v2.html` for exact visual targets. Key sections to style:

- `.doqix-pricing-admin` — wrapper
- `.doqix-sub-tabs` / `.doqix-sub-tab` / `.doqix-sub-active` — sub-tab navigation with bottom border active state
- `.doqix-tab-content` — white background, border, padding
- `.doqix-card-panel` / `.doqix-card-header` / `.doqix-card-body` — collapsible card panels with hover states
- `.doqix-drag-handle` / `.doqix-card-title` / `.doqix-badge-preview` / `.doqix-featured-star` / `.doqix-remove-card` / `.doqix-collapse-icon` — card header elements
- `.doqix-field-grid` — 2-column CSS grid for form fields
- `.doqix-field` — field wrapper with label + input
- `.doqix-toggle` / `.doqix-toggle-slider` — CSS-only toggle switch
- `.doqix-mini-editor` / `.doqix-mini-toolbar` / `.doqix-mini-editor-content` — lightweight rich text editor
- `.doqix-color-field` — colour picker with hex code and reset button
- `.doqix-color-overrides` / `.doqix-color-overrides-toggle` — collapsible colour section per card
- `.doqix-color-grid` — 2-column grid for colour pickers
- `.doqix-device-split` / `.doqix-device-panel` — side-by-side device panels for carousel tab
- `.doqix-radio-option` — styled radio with border, selected state
- `.doqix-nav-options` / `.doqix-nav-option` — visual radio cards for nav style
- `.doqix-colours-layout` — grid with pickers left, sticky preview right
- `.doqix-preview-area` / `.doqix-preview-card` — live preview card styles (matching frontend card appearance with CSS variables)
- `.doqix-note` — info callout with yellow left border
- `.doqix-hint` — small grey helper text
- `.doqix-add-preset-btn` / `#doqix-add-preset-form` — add preset UI
- `.doqix-delete-preset` — delete button on preset tabs

Use the exact CSS from the mockup HTML files as reference. The preview card styles should mirror the frontend card design (header band, features with dividers, excludes section, CTA button) using CSS variables so they update live.

- [ ] **Step 2: Verify visual appearance**

Compare WP admin page to the mockup at `http://localhost` (restart visual companion if needed). All tabs should match the approved mockup styling.

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/assets/css/admin.css
git commit -m "feat(pricing-carousel): admin stylesheet"
```

---

### Task 9: Admin JS — Repeaters, Mini Editor, Tabs, Colour Sync

**Files:**
- Modify: `assets/doqix-pricing-carousel/assets/js/admin.js`

- [ ] **Step 1: Write the complete admin JavaScript**

Replace the contents of `assets/doqix-pricing-carousel/assets/js/admin.js`. Key functionality:

```javascript
/**
 * Do.Qix Pricing Carousel — Admin JS
 * Vanilla JS. No jQuery.
 */
(function() {
    'use strict';

    var OPT = 'doqix_pricing_settings';

    /* ── Card panel toggle ── */
    window.doqixPricingToggleCard = function(header) {
        var body = header.nextElementSibling;
        var icon = header.querySelector('.doqix-collapse-icon');
        body.classList.toggle('doqix-open');
        if (icon) icon.classList.toggle('doqix-open');
    };

    /* ── Remove card ── */
    window.doqixPricingRemoveCard = function(btn) {
        var panel = btn.closest('.doqix-card-panel');
        var container = panel.parentElement;
        var panels = container.querySelectorAll('.doqix-card-panel');
        if (panels.length <= 1) return; // Keep at least 1
        panel.remove();
        reindexCards(container);
    };

    /* ── Add card ── */
    function initAddCard() {
        var btn = document.getElementById('doqix-add-card');
        if (!btn) return;

        btn.addEventListener('click', function() {
            var container = document.getElementById('doqix-cards-repeater');
            var panels = container.querySelectorAll('.doqix-card-panel');
            var newIndex = panels.length;
            // Clone last panel, clear values, update indices
            var last = panels[panels.length - 1];
            var clone = last.cloneNode(true);
            clearCardPanel(clone, newIndex);
            container.appendChild(clone);
            reindexCards(container);
        });
    }

    function clearCardPanel(panel, index) {
        panel.setAttribute('data-index', index);
        // Clear text inputs
        var inputs = panel.querySelectorAll('input[type="text"], input[type="number"]');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].name.indexOf('[cta_label]') > -1) {
                inputs[i].value = 'Start Free';
            } else if (inputs[i].name.indexOf('[cta_url]') > -1) {
                inputs[i].value = '/contact';
            } else if (inputs[i].name.indexOf('[price_suffix]') > -1) {
                inputs[i].value = '/mo';
            } else {
                inputs[i].value = '';
            }
        }
        // Clear checkboxes
        var checks = panel.querySelectorAll('input[type="checkbox"]');
        for (var j = 0; j < checks.length; j++) { checks[j].checked = false; }
        // Clear editors
        var editors = panel.querySelectorAll('.doqix-mini-editor-content');
        for (var k = 0; k < editors.length; k++) { editors[k].innerHTML = ''; }
        // Clear hidden editor values
        var hiddens = panel.querySelectorAll('.doqix-mini-editor input[type="hidden"]');
        for (var l = 0; l < hiddens.length; l++) { hiddens[l].value = ''; }
        // Update title
        var title = panel.querySelector('.doqix-card-title');
        if (title) title.textContent = 'New Card';
        // Remove badge/star
        var badge = panel.querySelector('.doqix-badge-preview');
        if (badge) badge.remove();
        var star = panel.querySelector('.doqix-featured-star');
        if (star) star.remove();
        // Collapse
        var body = panel.querySelector('.doqix-card-body');
        if (body) body.classList.add('doqix-open'); // open new card
    }

    function reindexCards(container) {
        var slug = document.querySelector('input[name$="[_preset_slug]"]').value;
        var base = OPT + '[presets][' + slug + '][cards]';
        var panels = container.querySelectorAll('.doqix-card-panel');

        for (var i = 0; i < panels.length; i++) {
            panels[i].setAttribute('data-index', i);
            var fields = panels[i].querySelectorAll('input, select, textarea');
            for (var j = 0; j < fields.length; j++) {
                var name = fields[j].getAttribute('name');
                if (name) {
                    fields[j].setAttribute('name',
                        name.replace(
                            /doqix_pricing_settings\[presets\]\[[^\]]+\]\[cards\]\[\d+\]/,
                            base + '[' + i + ']'
                        )
                    );
                }
            }
            // Update sort order hidden
            var sortInput = panels[i].querySelector('input[name$="[sort_order]"]');
            if (sortInput) sortInput.value = i;
        }

        // Disable remove if only 1 card
        var removeBtns = container.querySelectorAll('.doqix-remove-card');
        for (var k = 0; k < removeBtns.length; k++) {
            removeBtns[k].disabled = panels.length <= 1;
        }
    }

    /* ── Mini editor: sync contenteditable → hidden input on form submit ── */
    function initMiniEditors() {
        var editors = document.querySelectorAll('.doqix-mini-editor-content');
        for (var i = 0; i < editors.length; i++) {
            editors[i].addEventListener('input', function() {
                var target = this.getAttribute('data-target');
                var hidden = this.parentElement.querySelector('input[name="' + target + '"]');
                if (hidden) hidden.value = this.innerHTML;
            });
        }

        // Also sync on form submit
        var form = document.querySelector('.doqix-pricing-admin form');
        if (form) {
            form.addEventListener('submit', function() {
                var eds = document.querySelectorAll('.doqix-mini-editor-content');
                for (var j = 0; j < eds.length; j++) {
                    var t = eds[j].getAttribute('data-target');
                    var h = eds[j].parentElement.querySelector('input[name="' + t + '"]');
                    if (h) h.value = eds[j].innerHTML;
                }
            });
        }
    }

    /* ── Insert link in mini editor ── */
    window.doqixPricingInsertLink = function(btn) {
        var url = prompt('Enter URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    };

    /* ── Colour picker: live preview sync ── */
    function initColourPickers() {
        var pickers = document.querySelectorAll('.doqix-color-field input[type="color"]');
        var preview = document.getElementById('doqix-preview-card');

        for (var i = 0; i < pickers.length; i++) {
            pickers[i].addEventListener('input', function() {
                var code = this.parentElement.querySelector('code');
                if (code) code.textContent = this.value;

                // Update preview card CSS variable
                var varName = this.getAttribute('data-var');
                if (varName && preview) {
                    preview.style.setProperty(varName, this.value);
                    // Also update border colour if accent
                    if (varName === '--pricing-accent') {
                        preview.style.borderColor = this.value;
                    }
                }
            });
        }

        // Reset buttons
        var resets = document.querySelectorAll('.doqix-reset-color');
        for (var j = 0; j < resets.length; j++) {
            resets[j].addEventListener('click', function() {
                var input = this.parentElement.querySelector('input[type="color"]');
                var original = input.getAttribute('data-default');
                input.value = original || '#0886B5';
                input.dispatchEvent(new Event('input'));
                var code = this.parentElement.querySelector('code');
                if (code) code.textContent = original || 'Theme default';
            });
        }
    }

    /* ── Preset add/delete ── */
    function initPresetActions() {
        var addBtn = document.querySelector('.doqix-add-preset-btn');
        var form = document.getElementById('doqix-add-preset-form');
        var cancelBtn = document.querySelector('.doqix-cancel-preset');

        if (addBtn && form) {
            addBtn.addEventListener('click', function() {
                form.style.display = form.style.display === 'none' ? 'block' : 'none';
            });
        }
        if (cancelBtn && form) {
            cancelBtn.addEventListener('click', function() {
                form.style.display = 'none';
            });
        }

        // Delete preset confirmation
        var delBtns = document.querySelectorAll('.doqix-delete-preset');
        for (var i = 0; i < delBtns.length; i++) {
            delBtns[i].addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Delete this preset? This cannot be undone.')) {
                    window.location.href = this.getAttribute('data-href');
                }
            });
        }
    }

    /* ── Card title live update ── */
    function initCardTitleSync() {
        document.addEventListener('input', function(e) {
            if (e.target.name && e.target.name.indexOf('[name]') > -1 && e.target.closest('.doqix-card-panel')) {
                var panel = e.target.closest('.doqix-card-panel');
                var title = panel.querySelector('.doqix-card-title');
                if (title) title.textContent = e.target.value || 'New Card';
            }
        });
    }

    /* ── Init ── */
    document.addEventListener('DOMContentLoaded', function() {
        initAddCard();
        initMiniEditors();
        initColourPickers();
        initPresetActions();
        initCardTitleSync();
    });
})();
```

- [ ] **Step 2: Test all admin interactions**

Verify in WP admin:
- Expanding/collapsing card panels
- Adding a new card (clones, clears values, reindexes)
- Removing a card (removes, reindexes, can't remove last)
- Mini editors: typing updates hidden input, bold/italic/list/link work
- Card title updates live as you type the tier name
- Colour pickers update the live preview card in real time
- Reset colour buttons restore defaults
- Preset add/delete with confirmation
- Form submission saves all data correctly

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/assets/js/admin.js
git commit -m "feat(pricing-carousel): admin JS — repeaters, mini editors, colour sync, preset actions"
```

---

### Task 10: Frontend — Shortcode and Rendering

**Files:**
- Modify: `assets/doqix-pricing-carousel/includes/class-frontend.php`

- [ ] **Step 1: Write the complete frontend class**

Replace `assets/doqix-pricing-carousel/includes/class-frontend.php`:

```php
<?php
/**
 * Frontend: shortcode rendering and conditional asset enqueue.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Doqix_Pricing_Frontend {

    /** @var bool Guard against double-enqueue. */
    private $enqueue = false;

    public function __construct() {
        add_shortcode( 'doqix_pricing', array( $this, 'render_shortcode' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue_assets' ) );
    }

    /* ── Conditional enqueue ── */

    public function maybe_enqueue_assets() {
        if ( ! is_singular() ) {
            return;
        }

        $post = get_queried_object();
        if ( ! $post || ! isset( $post->post_content ) ) {
            return;
        }

        $found = has_shortcode( $post->post_content, 'doqix_pricing' );

        /* Themify Builder fallback */
        if ( ! $found ) {
            $builder_meta = get_post_meta( $post->ID, '_themify_builder_settings_json', true );
            if ( $builder_meta && is_string( $builder_meta ) && strpos( $builder_meta, 'doqix_pricing' ) !== false ) {
                $found = true;
            }
        }

        if ( ! $found ) {
            return;
        }

        $this->do_enqueue();
    }

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

    /* ── Shortcode ── */

    public function render_shortcode( $atts ) {
        $atts = shortcode_atts( array( 'preset' => 'default' ), $atts, 'doqix_pricing' );
        $all  = get_option( DOQIX_PRICING_OPTION_KEY, doqix_pricing_get_defaults() );

        $presets = isset( $all['presets'] ) ? $all['presets'] : array();
        $preset  = isset( $presets[ $atts['preset'] ] ) ? $presets[ $atts['preset'] ] : ( isset( $presets['default'] ) ? $presets['default'] : doqix_pricing_get_preset_defaults() );

        $this->do_enqueue( $preset, $all );

        $cards         = isset( $preset['cards'] ) ? $preset['cards'] : array();
        $theme_accent  = doqix_pricing_get_theme_accent_color();
        $global        = isset( $all['global'] ) ? $all['global'] : array();
        $currency      = isset( $global['currency_symbol'] ) ? $global['currency_symbol'] : 'R';
        $currency_pos  = isset( $global['currency_position'] ) ? $global['currency_position'] : 'before';

        /* Build config for JS */
        $js_config = array(
            'displayDesktop'  => $preset['display_desktop'],
            'displayMobile'   => $preset['display_mobile'],
            'breakpoint'      => (int) $preset['mobile_breakpoint'],
            'navStyle'        => $preset['nav_style'],
            'activeScale'     => (float) $preset['active_scale'],
            'autoplay'        => (int) $preset['autoplay'],
            'autoplaySpeed'   => (int) $preset['autoplay_speed'],
            'billingToggle'   => (int) $preset['billing_toggle'],
            'monthlyLabel'    => $preset['monthly_label'],
            'annualLabel'     => $preset['annual_label'],
            'annualDiscount'  => (int) $preset['annual_discount'],
            'cardNames'       => array_map( function( $c ) { return $c['name']; }, $cards ),
        );

        wp_localize_script( 'doqix-pricing-frontend', 'doqixPricingConfig', $js_config );

        /* Resolve colours for inline CSS variables */
        $accent = $preset['color_accent'] ?: $theme_accent ?: '#0886B5';

        ob_start();
        ?>
        <div class="doqix-pricing"
             id="doqix-pricing"
             style="
                --pricing-accent: <?php echo esc_attr( $accent ); ?>;
                --pricing-header-bg: <?php echo esc_attr( $preset['color_header_bg'] ?: $accent ); ?>;
                --pricing-header-text: <?php echo esc_attr( $preset['color_header_text'] ?: '#ffffff' ); ?>;
                --pricing-card-bg: <?php echo esc_attr( $preset['color_card_bg'] ?: '#f9fcfd' ); ?>;
                --pricing-cta-bg: <?php echo esc_attr( $preset['color_cta_bg'] ?: $accent ); ?>;
                --pricing-cta-text: <?php echo esc_attr( $preset['color_cta_text'] ?: '#ffffff' ); ?>;
                --pricing-badge-bg: <?php echo esc_attr( $preset['color_badge_bg'] ?: '#ff9500' ); ?>;
                --pricing-badge-text: <?php echo esc_attr( $preset['color_badge_text'] ?: '#ffffff' ); ?>;
                --pricing-feat-text: <?php echo esc_attr( $preset['color_feat_text'] ?: '#1d2327' ); ?>;
                --pricing-feat-check: <?php echo esc_attr( $preset['color_feat_check'] ?: $accent ); ?>;
                --pricing-exc-text: <?php echo esc_attr( $preset['color_exc_text'] ?: '#999999' ); ?>;
                --pricing-exc-title: <?php echo esc_attr( $preset['color_exc_title'] ?: '#666666' ); ?>;
                --pricing-active-scale: <?php echo esc_attr( $preset['active_scale'] ); ?>;
             "
             data-display-desktop="<?php echo esc_attr( $preset['display_desktop'] ); ?>"
             data-display-mobile="<?php echo esc_attr( $preset['display_mobile'] ); ?>"
             data-breakpoint="<?php echo (int) $preset['mobile_breakpoint']; ?>">

            <?php if ( $preset['billing_toggle'] ) : ?>
                <div class="doqix-pricing-billing-toggle">
                    <span class="doqix-billing-label doqix-billing-active"><?php echo esc_html( $preset['monthly_label'] ); ?></span>
                    <div class="doqix-billing-switch" data-discount="<?php echo (int) $preset['annual_discount']; ?>">
                        <div class="doqix-billing-thumb"></div>
                    </div>
                    <span class="doqix-billing-label"><?php echo esc_html( $preset['annual_label'] ); ?> (<?php printf( esc_html__( 'save %d%%', 'doqix-pricing-carousel' ), $preset['annual_discount'] ); ?>)</span>
                </div>
            <?php endif; ?>

            <div class="doqix-pricing-track">
                <?php foreach ( $cards as $i => $card ) :
                    $card = wp_parse_args( $card, doqix_pricing_get_card_defaults() );
                    $is_featured = ! empty( $card['featured'] );

                    /* Per-card colour overrides via inline style */
                    $card_style = '';
                    $card_colors = array(
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
                    foreach ( $card_colors as $field => $var ) {
                        if ( ! empty( $card[ $field ] ) ) {
                            $card_style .= $var . ':' . esc_attr( $card[ $field ] ) . ';';
                        }
                    }

                    $price_display = '';
                    if ( 'before' === $currency_pos && is_numeric( $card['price'] ) ) {
                        $price_display = $currency . number_format( (float) $card['price'] );
                    } elseif ( is_numeric( $card['price'] ) ) {
                        $price_display = number_format( (float) $card['price'] ) . $currency;
                    } else {
                        $price_display = $card['price']; // "Custom", "Let's talk", etc.
                    }
                    ?>
                    <div class="doqix-pricing-card <?php echo $is_featured ? 'doqix-featured' : ''; ?>"
                         data-index="<?php echo (int) $i; ?>"
                         data-price="<?php echo esc_attr( $card['price'] ); ?>"
                         data-price-annual="<?php echo esc_attr( $card['price_annual'] ); ?>"
                         <?php if ( $card_style ) : ?>style="<?php echo $card_style; ?>"<?php endif; ?>>

                        <?php if ( ! empty( $card['badge'] ) ) : ?>
                            <div class="doqix-pricing-badge"><?php echo esc_html( $card['badge'] ); ?></div>
                        <?php endif; ?>

                        <div class="doqix-pricing-header">
                            <div class="doqix-pricing-name"><?php echo esc_html( $card['name'] ); ?></div>
                            <div class="doqix-pricing-sub"><?php echo esc_html( $card['subtitle'] ); ?></div>
                            <div class="doqix-pricing-price">
                                <span class="doqix-price-value"><?php echo esc_html( $price_display ); ?></span><span class="doqix-price-suffix"><?php echo esc_html( $card['price_suffix'] ); ?></span>
                            </div>
                            <div class="doqix-pricing-setup"><?php echo esc_html( $card['setup_fee'] ); ?></div>
                        </div>

                        <div class="doqix-pricing-body">
                            <?php if ( ! empty( $card['savings'] ) ) : ?>
                                <div class="doqix-pricing-savings"><?php echo esc_html( $card['savings'] ); ?></div>
                            <?php endif; ?>

                            <?php if ( ! empty( $card['features'] ) ) : ?>
                                <div class="doqix-pricing-features"><?php echo wp_kses_post( $card['features'] ); ?></div>
                            <?php endif; ?>

                            <?php if ( ! empty( $card['description'] ) ) : ?>
                                <div class="doqix-pricing-description"><?php echo wp_kses_post( $card['description'] ); ?></div>
                            <?php endif; ?>

                            <?php if ( ! empty( $card['excludes'] ) ) : ?>
                                <div class="doqix-pricing-excludes">
                                    <div class="doqix-pricing-exc-title"><?php esc_html_e( 'Excludes:', 'doqix-pricing-carousel' ); ?></div>
                                    <?php echo wp_kses_post( $card['excludes'] ); ?>
                                </div>
                            <?php endif; ?>
                        </div>

                        <a class="doqix-pricing-cta" href="<?php echo esc_url( $card['cta_url'] ); ?>">
                            <?php echo esc_html( $card['cta_label'] ); ?>
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Navigation (rendered by JS based on nav_style config) -->
            <div class="doqix-pricing-nav"></div>
        </div>
        <?php
        return ob_get_clean();
    }
}
```

- [ ] **Step 2: Verify shortcode renders**

Add `[doqix_pricing]` to a test page. Check:
- All 4 cards render with correct content
- CSS variables are set in inline style
- Data attributes present for JS
- No PHP errors

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/includes/class-frontend.php
git commit -m "feat(pricing-carousel): frontend shortcode rendering with colour cascade and billing toggle"
```

---

### Task 11: Frontend CSS

**Files:**
- Modify: `assets/doqix-pricing-carousel/assets/css/frontend.css`

- [ ] **Step 1: Write the complete frontend stylesheet**

Replace `assets/doqix-pricing-carousel/assets/css/frontend.css`. Reference the mockup at `.superpowers/brainstorm/19744-1775636369/content/card-layout-v6.html` for exact visual targets. Key sections:

- `.doqix-pricing` — wrapper with CSS variable declarations and fallbacks, max-width, margin auto
- `.doqix-pricing *, .doqix-pricing *::before, .doqix-pricing *::after` — box-sizing reset
- **Grid mode:** `.doqix-pricing-track` — flexbox row, gap, centre alignment, wrap
- **Carousel mode:** `.doqix-pricing[data-mode="carousel"] .doqix-pricing-track` — flexbox nowrap, overflow hidden, transition on transform
- `.doqix-pricing-card` — `flex: 0 0 300px`, border-radius 12px, overflow visible (for badge), border, shadow. Transitions on transform, opacity, filter (0.4s ease). Inactive state: scaled down, opacity 0.6, slight blur
- `.doqix-pricing-card.doqix-active` — `transform: scale(var(--pricing-active-scale))`, full opacity, no blur, z-index 2
- `.doqix-featured` — accent border, deeper shadow
- `.doqix-pricing-badge` — absolute positioned pill above card (`top: -14px`, `left: 50%`, `translateX(-50%)`), `border-radius: 20px`, badge bg/text colours
- `.doqix-pricing-header` — header bg colour, white text, centred, padding, top border-radius
- `.doqix-pricing-name` — 18px bold
- `.doqix-pricing-price` — 36px extra-bold
- `.doqix-pricing-body` — card bg colour, padding
- `.doqix-pricing-savings` — accent colour, centred, bold
- `.doqix-pricing-features p` — `padding: 8px 0`, `border-bottom: 1px solid #e8eff2`, features text colour. `::before` with `✓ ` in feat-check colour
- `.doqix-pricing-features p:last-child` — no border-bottom
- `.doqix-pricing-excludes` — `margin-top: 14px`, `padding-top: 12px`, `border-top: 2px solid #f0f0f0`
- `.doqix-pricing-exc-title` — exc-title colour, bold
- `.doqix-pricing-excludes p` — exc-text colour, bullet prefix
- `.doqix-pricing-cta` — block, CTA bg/text colours, padding, border-radius, centred, bold, hover darken
- **Billing toggle:** `.doqix-pricing-billing-toggle` — centred flex, pill background, toggle switch
- **Navigation:** `.doqix-pricing-nav` — centred flex. `.doqix-nav-arrow`, `.doqix-nav-dot`, `.doqix-nav-crumb` styles
- **Responsive:** `@media (max-width: 768px)` — card flex-basis smaller, grid stacks vertically. Use CSS class toggling from JS based on data-breakpoint

All colours use `var(--pricing-*)` with fallback defaults matching spec.

- [ ] **Step 2: Verify card appearance matches mockup**

Compare rendered cards on test page to the approved card-layout-v6 mockup.

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/assets/css/frontend.css
git commit -m "feat(pricing-carousel): frontend CSS — card styles, grid, carousel, responsive"
```

---

### Task 12: Frontend JS — Carousel, Swipe, Navigation

**Files:**
- Modify: `assets/doqix-pricing-carousel/assets/js/frontend.js`

- [ ] **Step 1: Write the complete frontend JavaScript**

Replace `assets/doqix-pricing-carousel/assets/js/frontend.js`. Key functionality:

```javascript
/**
 * Do.Qix Pricing Carousel — Frontend JS
 * Vanilla JS. Reads config from window.doqixPricingConfig.
 */
(function() {
    'use strict';

    var config = window.doqixPricingConfig || {};
    var container, track, cards, nav;
    var currentIndex = 0;
    var isCarousel = false;
    var autoplayTimer = null;

    function init() {
        container = document.getElementById('doqix-pricing');
        if (!container) return;

        track = container.querySelector('.doqix-pricing-track');
        cards = track.querySelectorAll('.doqix-pricing-card');
        nav   = container.querySelector('.doqix-pricing-nav');

        if (!cards.length) return;

        // Set initial active to featured card (or first)
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].classList.contains('doqix-featured')) {
                currentIndex = i;
                break;
            }
        }

        handleResize();
        window.addEventListener('resize', debounce(handleResize, 150));

        // Billing toggle
        initBillingToggle();
    }

    function handleResize() {
        var bp        = config.breakpoint || 768;
        var isMobile  = window.innerWidth < bp;
        var mode      = isMobile ? config.displayMobile : config.displayDesktop;

        if (mode === 'carousel' && !isCarousel) {
            enableCarousel();
        } else if (mode !== 'carousel' && isCarousel) {
            disableCarousel();
        }

        if (isCarousel) {
            positionCards();
        }
    }

    function enableCarousel() {
        isCarousel = true;
        container.setAttribute('data-mode', 'carousel');
        buildNav();
        initSwipe();
        positionCards();

        if (config.autoplay) {
            startAutoplay();
        }
    }

    function disableCarousel() {
        isCarousel = false;
        container.setAttribute('data-mode', 'grid');
        nav.innerHTML = '';
        track.style.transform = '';
        stopAutoplay();

        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.remove('doqix-active');
            cards[i].style.transform = '';
            cards[i].style.opacity = '';
            cards[i].style.filter = '';
        }
    }

    function positionCards() {
        var scale     = config.activeScale || 1.15;
        var inactive  = 1 / scale;
        var trackW    = track.offsetWidth;
        var cardW     = cards[0].offsetWidth + 24; // card + gap
        var offset    = (trackW / 2) - (cardW / 2) - (currentIndex * cardW);

        track.style.transform = 'translateX(' + offset + 'px)';

        for (var i = 0; i < cards.length; i++) {
            if (i === currentIndex) {
                cards[i].classList.add('doqix-active');
                cards[i].style.transform = 'scale(' + scale + ')';
                cards[i].style.opacity = '1';
                cards[i].style.filter = 'none';
            } else {
                cards[i].classList.remove('doqix-active');
                cards[i].style.transform = 'scale(' + inactive + ')';
                cards[i].style.opacity = '0.6';
                cards[i].style.filter = 'blur(0.5px)';
            }
        }

        updateNav();
    }

    function navigate(dir) {
        currentIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + dir));
        positionCards();
        if (config.autoplay) { stopAutoplay(); startAutoplay(); }
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(cards.length - 1, index));
        positionCards();
        if (config.autoplay) { stopAutoplay(); startAutoplay(); }
    }

    /* ── Navigation ── */

    function buildNav() {
        nav.innerHTML = '';
        var style = config.navStyle || 'breadcrumbs';

        if (style === 'arrows') {
            var left  = document.createElement('button');
            left.className = 'doqix-nav-arrow doqix-nav-left';
            left.innerHTML = '&#8249;';
            left.addEventListener('click', function() { navigate(-1); });

            var right = document.createElement('button');
            right.className = 'doqix-nav-arrow doqix-nav-right';
            right.innerHTML = '&#8250;';
            right.addEventListener('click', function() { navigate(1); });

            nav.appendChild(left);
            nav.appendChild(right);
        } else if (style === 'dots') {
            for (var i = 0; i < cards.length; i++) {
                (function(idx) {
                    var dot = document.createElement('button');
                    dot.className = 'doqix-nav-dot';
                    dot.addEventListener('click', function() { goTo(idx); });
                    nav.appendChild(dot);
                })(i);
            }
        } else { // breadcrumbs
            var names = config.cardNames || [];
            for (var j = 0; j < cards.length; j++) {
                (function(idx) {
                    var crumb = document.createElement('button');
                    crumb.className = 'doqix-nav-crumb';
                    crumb.textContent = names[idx] || ('Card ' + (idx + 1));
                    crumb.addEventListener('click', function() { goTo(idx); });
                    nav.appendChild(crumb);
                })(j);
            }
        }
    }

    function updateNav() {
        var style = config.navStyle || 'breadcrumbs';

        if (style === 'dots') {
            var dots = nav.querySelectorAll('.doqix-nav-dot');
            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('doqix-nav-active', i === currentIndex);
            }
        } else if (style === 'breadcrumbs') {
            var crumbs = nav.querySelectorAll('.doqix-nav-crumb');
            for (var j = 0; j < crumbs.length; j++) {
                crumbs[j].classList.toggle('doqix-nav-active', j === currentIndex);
            }
        }
    }

    /* ── Touch swipe ── */

    function initSwipe() {
        var startX = 0;
        track.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', function(e) {
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                navigate(diff > 0 ? 1 : -1);
            }
        });
    }

    /* ── Autoplay ── */

    function startAutoplay() {
        autoplayTimer = setInterval(function() {
            if (currentIndex >= cards.length - 1) {
                currentIndex = -1; // Will wrap to 0
            }
            navigate(1);
        }, config.autoplaySpeed || 5000);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    /* ── Billing toggle ── */

    function initBillingToggle() {
        var toggle = container.querySelector('.doqix-billing-switch');
        if (!toggle) return;

        var isAnnual = false;
        var labels   = container.querySelectorAll('.doqix-billing-label');

        toggle.addEventListener('click', function() {
            isAnnual = !isAnnual;
            toggle.classList.toggle('doqix-billing-on', isAnnual);
            labels[0].classList.toggle('doqix-billing-active', !isAnnual);
            labels[1].classList.toggle('doqix-billing-active', isAnnual);

            // Swap prices
            for (var i = 0; i < cards.length; i++) {
                var priceEl    = cards[i].querySelector('.doqix-price-value');
                var monthly    = cards[i].getAttribute('data-price');
                var annual     = cards[i].getAttribute('data-price-annual');

                if (!priceEl || !monthly) continue;

                var val = isAnnual && annual ? annual : monthly;
                var currency = '<?php /* set by PHP */ ?>' || 'R';

                if (!isNaN(val) && val !== '') {
                    priceEl.textContent = 'R' + Number(val).toLocaleString();
                } else {
                    priceEl.textContent = val;
                }
            }
        });
    }

    /* ── Utility ── */

    function debounce(fn, ms) {
        var timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(fn, ms);
        };
    }

    /* ── Start ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
```

Note: The billing toggle currency symbol will need to be passed via `doqixPricingConfig.currencySymbol` from PHP. Add `'currencySymbol' => $currency` to the `$js_config` array in `class-frontend.php` and use `config.currencySymbol` instead of the hardcoded `'R'` in the JS.

- [ ] **Step 2: Add currencySymbol to JS config**

In `class-frontend.php`, add to the `$js_config` array:

```php
'currencySymbol' => $currency,
```

And in `frontend.js`, replace the billing toggle price line:

```javascript
priceEl.textContent = config.currencySymbol + Number(val).toLocaleString();
```

- [ ] **Step 3: Test carousel interactions**

Verify on test page:
- Grid mode on desktop: cards in a row
- Carousel mode on mobile (resize browser): active card scales up, neighbours peek
- Swipe/touch navigation works
- Arrow/dot/breadcrumb navigation works (switch nav_style in admin to test each)
- Autoplay advances cards (if enabled)
- Billing toggle swaps prices (if enabled)

- [ ] **Step 4: Commit**

```bash
git add assets/doqix-pricing-carousel/assets/js/frontend.js assets/doqix-pricing-carousel/includes/class-frontend.php
git commit -m "feat(pricing-carousel): frontend JS — carousel, swipe, navigation, billing toggle"
```

---

### Task 13: Uninstall and Readme

**Files:**
- Create: `assets/doqix-pricing-carousel/uninstall.php`
- Create: `assets/doqix-pricing-carousel/readme.txt`

- [ ] **Step 1: Write uninstall.php**

```php
<?php
/**
 * Fired when the plugin is uninstalled.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

delete_option( 'doqix_pricing_settings' );
```

- [ ] **Step 2: Write readme.txt**

```
=== Do.Qix Pricing Carousel ===
Contributors: doqix
Tags: pricing, carousel, pricing table, saas, pricing comparison
Requires at least: 5.6
Tested up to: 6.7
Stable tag: 1.0.0
License: GPL-2.0-or-later

Configurable pricing table carousel with admin-managed tiers, colours, and presets.

== Description ==

Build beautiful pricing tables with a full admin UI. Supports grid and carousel layouts, per-card colour customisation, featured card highlighting, multiple presets, and a billing toggle.

Shortcode: [doqix_pricing] or [doqix_pricing preset="name"]

== Changelog ==

= 1.0.0 =
* Initial release
```

- [ ] **Step 3: Commit**

```bash
git add assets/doqix-pricing-carousel/uninstall.php assets/doqix-pricing-carousel/readme.txt
git commit -m "feat(pricing-carousel): add uninstall cleanup and readme"
```

---

### Task 14: End-to-End Verification

- [ ] **Step 1: Full admin test**

1. Activate all three Do.Qix plugins
2. Verify unified menu: Do.Qix → Pricing Carousel, ROI Calculator, Site Settings (alphabetical)
3. Cards tab: add a card, edit, remove, save — data persists
4. Carousel tab: change desktop to carousel, mobile to grid, save — persists
5. Colours tab: change header bg colour, verify live preview updates, save — persists
6. Billing tab: enable toggle, save — persists
7. Create a new preset "Services Page", configure differently, save
8. Delete the "Services Page" preset

- [ ] **Step 2: Full frontend test**

1. Add `[doqix_pricing]` to a page
2. Desktop: verify grid layout with all 4 cards
3. Resize to mobile: verify carousel with active scaling, peeking edges
4. Test navigation (change nav_style in admin and re-test)
5. Verify per-card colour overrides render correctly
6. Verify featured card has accent border and badge
7. Test `[doqix_pricing preset="services-page"]` with a different preset

- [ ] **Step 3: Commit any fixes found during testing**

```bash
git add -A
git commit -m "fix(pricing-carousel): end-to-end testing fixes"
```
