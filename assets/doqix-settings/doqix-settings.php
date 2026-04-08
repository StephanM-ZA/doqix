<?php
/**
 * Plugin Name: Do.Qix Settings
 * Plugin URI: https://www.digitaloperations.co.za
 * Description: Central settings hub for Do.Qix customizations. Currently includes homepage redirect settings with support for additional tabs.
 * Version: 2.0.1
 * Author: Digital Operations
 * Author URI: https://www.digitaloperations.co.za
 * License: GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'DOQIX_SETTINGS_VERSION', '2.0.1' );

class Doqix_Settings {

    private const OPTION_KEY = 'doqix_redirect_settings';
    private const MENU_SLUG  = 'doqix-settings';

    public function __construct() {
        add_action( 'plugins_loaded', array( $this, 'maybe_migrate' ) );
        add_action( 'init', array( $this, 'maybe_redirect_early' ), 1 );
        add_filter( 'redirect_canonical', array( $this, 'stop_canonical_redirect' ), 10, 2 );
        add_action( 'admin_menu', array( $this, 'add_settings_page' ), 5 );
        add_action( 'admin_init', array( $this, 'register_settings' ) );
        add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'settings_link' ) );
    }

    /**
     * Migrate stored settings when the plugin version is bumped.
     *
     * Uses wp_parse_args to add any new default fields while preserving
     * existing user values.
     */
    public function maybe_migrate() {
        $settings = get_option( self::OPTION_KEY );
        if ( false === $settings ) {
            return; // Fresh install — nothing to migrate
        }

        $stored_version = isset( $settings['_version'] ) ? $settings['_version'] : '0.0.0';
        if ( version_compare( $stored_version, DOQIX_SETTINGS_VERSION, '>=' ) ) {
            return; // Up to date
        }

        $defaults = array(
            'enabled'            => 1,
            'redirect_path'      => '/doqix',
            'redirect_logged_in' => 0,
        );
        $settings = wp_parse_args( $settings, $defaults );

        // Stamp current version
        $settings['_version'] = DOQIX_SETTINGS_VERSION;
        update_option( self::OPTION_KEY, $settings );
    }

    private function get_redirect_settings() {
        return wp_parse_args(
            get_option( self::OPTION_KEY, array() ),
            array(
                'enabled'            => 1,
                'redirect_path'      => '/doqix',
                'redirect_logged_in' => 0,
            )
        );
    }

    private function get_current_tab() {
        return isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'redirect';
    }

    /**
     * Returns the registered tabs.
     * Add new tabs here as array items: 'slug' => 'Label'.
     */
    private function get_tabs() {
        return array(
            'redirect' => 'Homepage Redirect',
            'updates'  => 'Plugin Updates',
        );
    }

    /**
     * Stop WordPress from canonically redirecting /doqix back to /
     * when the doqix page is set as the static front page.
     */
    public function stop_canonical_redirect( $redirect_url, $requested_url ) {
        $settings = $this->get_redirect_settings();

        if ( ! $settings['enabled'] ) {
            return $redirect_url;
        }

        $path         = trim( sanitize_text_field( $settings['redirect_path'] ), '/' );
        $request_path = trim( wp_parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ), '/' );

        if ( $request_path === $path ) {
            return false;
        }

        return $redirect_url;
    }

    public function maybe_redirect_early() {
        if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
            return;
        }

        $settings = $this->get_redirect_settings();

        if ( ! $settings['enabled'] ) {
            return;
        }

        $request_path = trim( wp_parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ), '/' );
        $home_path    = trim( wp_parse_url( home_url(), PHP_URL_PATH ), '/' );

        if ( $home_path && strpos( $request_path, $home_path ) === 0 ) {
            $request_path = trim( substr( $request_path, strlen( $home_path ) ), '/' );
        }

        if ( $request_path !== '' ) {
            return;
        }

        if ( ! $settings['redirect_logged_in'] && is_user_logged_in() ) {
            return;
        }

        $path = sanitize_text_field( $settings['redirect_path'] );
        $url  = home_url( $path );

        wp_redirect( $url, 302 );
        exit;
    }

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

    public function register_settings() {
        register_setting( 'doqix_settings_redirect', self::OPTION_KEY, array(
            'sanitize_callback' => array( $this, 'sanitize_redirect_settings' ),
        ) );
        register_setting( 'doqix_settings_updates', Doqix_Updater::get_token_option_key(), array(
            'sanitize_callback' => 'sanitize_text_field',
        ) );
    }

    public function sanitize_redirect_settings( $input ) {
        return array(
            'enabled'            => ! empty( $input['enabled'] ) ? 1 : 0,
            'redirect_path'      => sanitize_text_field( $input['redirect_path'] ?? '/doqix' ),
            'redirect_logged_in' => ! empty( $input['redirect_logged_in'] ) ? 1 : 0,
        );
    }

    public function settings_link( $links ) {
        $url  = admin_url( 'admin.php?page=' . self::MENU_SLUG );
        $link = '<a href="' . esc_url( $url ) . '">Settings</a>';
        array_unshift( $links, $link );
        return $links;
    }

    public function render_settings_page() {
        $current_tab = $this->get_current_tab();
        $tabs        = $this->get_tabs();
        ?>
        <div class="wrap">
            <h1>Do.Qix Settings</h1>
            <nav class="nav-tab-wrapper">
                <?php foreach ( $tabs as $slug => $label ) : ?>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::MENU_SLUG . '&tab=' . $slug ) ); ?>"
                       class="nav-tab <?php echo $current_tab === $slug ? 'nav-tab-active' : ''; ?>">
                        <?php echo esc_html( $label ); ?>
                    </a>
                <?php endforeach; ?>
            </nav>
            <div class="doqix-tab-content" style="margin-top: 20px;">
                <?php
                switch ( $current_tab ) {
                    case 'updates':
                        $this->render_updates_tab();
                        break;
                    case 'redirect':
                    default:
                        $this->render_redirect_tab();
                        break;
                }
                ?>
            </div>
        </div>
        <?php
    }

    private function render_redirect_tab() {
        $settings = $this->get_redirect_settings();
        ?>
        <form method="post" action="options.php">
            <?php settings_fields( 'doqix_settings_redirect' ); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">Enable Redirect</th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[enabled]" value="1" <?php checked( $settings['enabled'], 1 ); ?>>
                            Redirect homepage visitors
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Redirect Path</th>
                    <td>
                        <input type="text" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[redirect_path]" value="<?php echo esc_attr( $settings['redirect_path'] ); ?>" class="regular-text">
                        <p class="description">Path to redirect to (e.g. <code>/doqix</code>). Relative to your site URL.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Redirect Logged-in Users</th>
                    <td>
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[redirect_logged_in]" value="1" <?php checked( $settings['redirect_logged_in'], 1 ); ?>>
                            Also redirect logged-in users (admins included)
                        </label>
                        <p class="description">Leave unchecked to only redirect visitors. This lets you still access the homepage as an admin.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
        <?php
    }
    private function render_updates_tab() {
        $token_key = Doqix_Updater::get_token_option_key();
        $token     = get_option( $token_key, '' );
        ?>
        <form method="post" action="options.php">
            <?php settings_fields( 'doqix_settings_updates' ); ?>
            <h2>GitHub Auto-Updates</h2>
            <p class="description">Do.Qix plugins check GitHub for new versions. Since the repository is private, a personal access token is required.</p>
            <table class="form-table">
                <tr>
                    <th scope="row">GitHub Token</th>
                    <td>
                        <input type="password" name="<?php echo esc_attr( $token_key ); ?>" value="<?php echo esc_attr( $token ); ?>" class="regular-text" autocomplete="off">
                        <p class="description">
                            A GitHub personal access token with <code>repo</code> scope.<br>
                            Create one at <a href="https://github.com/settings/tokens" target="_blank">github.com/settings/tokens</a> → "Generate new token (classic)" → check <code>repo</code> → Generate.
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Status</th>
                    <td>
                        <?php
                        if ( empty( $token ) ) {
                            echo '<span style="color:#cc1818;">&#10007; No token set — updates will not work for private repos.</span>';
                        } else {
                            // Quick test: try to fetch the manifest
                            Doqix_Updater::clear_cache();
                            $test_response = wp_remote_get( 'https://raw.githubusercontent.com/StephanM-ZA/doqix_website/main/updates.json', array(
                                'timeout' => 5,
                                'headers' => array(
                                    'Authorization' => 'token ' . $token,
                                    'Accept'        => 'application/json',
                                ),
                            ) );
                            if ( ! is_wp_error( $test_response ) && 200 === wp_remote_retrieve_response_code( $test_response ) ) {
                                echo '<span style="color:#00a32a;">&#10003; Connected — token is valid and can reach the repository.</span>';
                            } else {
                                $code = is_wp_error( $test_response ) ? $test_response->get_error_message() : wp_remote_retrieve_response_code( $test_response );
                                echo '<span style="color:#cc1818;">&#10007; Connection failed (' . esc_html( $code ) . '). Check your token has <code>repo</code> scope.</span>';
                            }
                        }
                        ?>
                    </td>
                </tr>
            </table>
            <?php submit_button( 'Save Token' ); ?>
        </form>
        <?php
    }
}

new Doqix_Settings();

/* ── Plugin Updater ── */
require_once __DIR__ . '/includes/class-doqix-updater.php';
Doqix_Updater::register( 'doqix-settings', plugin_basename( __FILE__ ), DOQIX_SETTINGS_VERSION );
