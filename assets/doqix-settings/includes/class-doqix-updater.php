<?php
/**
 * Do.Qix Plugin Updater
 *
 * Checks GitHub for plugin updates via a central updates.json manifest.
 * Loaded by doqix-settings, used by all Do.Qix plugins.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( class_exists( 'Doqix_Updater' ) ) {
    return; // Already loaded
}

class Doqix_Updater {

    /** @var string GitHub raw URL for updates.json */
    private const MANIFEST_URL = 'https://raw.githubusercontent.com/StephanM-ZA/doqix_website/main/updates.json';

    /** @var string Transient key for caching */
    private const CACHE_KEY = 'doqix_update_manifest';

    /** @var int Cache duration in seconds (6 hours) */
    private const CACHE_TTL = 21600;

    /** @var array Registered plugins: slug => plugin_file */
    private static $plugins = array();

    /** @var bool Whether hooks are registered */
    private static $hooked = false;

    /**
     * Register a plugin for update checks.
     *
     * @param string $slug        Plugin directory name (e.g., 'doqix-pricing-carousel')
     * @param string $plugin_file Plugin file relative to plugins dir (e.g., 'doqix-pricing-carousel/doqix-pricing-carousel.php')
     * @param string $version     Current installed version
     */
    public static function register( $slug, $plugin_file, $version ) {
        self::$plugins[ $slug ] = array(
            'file'    => $plugin_file,
            'version' => $version,
        );

        if ( ! self::$hooked ) {
            add_filter( 'pre_set_site_transient_update_plugins', array( __CLASS__, 'check_updates' ) );
            add_filter( 'plugins_api', array( __CLASS__, 'plugin_info' ), 20, 3 );
            add_filter( 'upgrader_post_install', array( __CLASS__, 'after_install' ), 10, 3 );
            self::$hooked = true;
        }
    }

    /**
     * Fetch the manifest from GitHub (cached).
     */
    private static function get_manifest() {
        $cached = get_transient( self::CACHE_KEY );
        if ( false !== $cached ) {
            return $cached;
        }

        $response = wp_remote_get( self::MANIFEST_URL, array(
            'timeout' => 10,
            'headers' => array( 'Accept' => 'application/json' ),
        ) );

        if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
            return array();
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( ! is_array( $data ) ) {
            return array();
        }

        set_transient( self::CACHE_KEY, $data, self::CACHE_TTL );
        return $data;
    }

    /**
     * Check for updates and inject into WP transient.
     */
    public static function check_updates( $transient ) {
        if ( empty( $transient->checked ) ) {
            return $transient;
        }

        $manifest = self::get_manifest();
        if ( empty( $manifest ) ) {
            return $transient;
        }

        foreach ( self::$plugins as $slug => $info ) {
            if ( ! isset( $manifest[ $slug ] ) ) {
                continue;
            }

            $remote = $manifest[ $slug ];
            $local_version = $info['version'];

            if ( version_compare( $remote['version'], $local_version, '>' ) ) {
                $update = (object) array(
                    'slug'         => $slug,
                    'plugin'       => $info['file'],
                    'new_version'  => $remote['version'],
                    'package'      => $remote['download_url'],
                    'url'          => 'https://github.com/StephanM-ZA/doqix_website',
                    'requires'     => isset( $remote['requires'] ) ? $remote['requires'] : '',
                    'tested'       => isset( $remote['tested'] ) ? $remote['tested'] : '',
                    'requires_php' => isset( $remote['requires_php'] ) ? $remote['requires_php'] : '',
                );
                $transient->response[ $info['file'] ] = $update;
            }
        }

        return $transient;
    }

    /**
     * Provide plugin info for the "View Details" popup.
     */
    public static function plugin_info( $result, $action, $args ) {
        if ( 'plugin_information' !== $action ) {
            return $result;
        }

        if ( ! isset( $args->slug ) || ! isset( self::$plugins[ $args->slug ] ) ) {
            return $result;
        }

        $manifest = self::get_manifest();
        if ( ! isset( $manifest[ $args->slug ] ) ) {
            return $result;
        }

        $remote = $manifest[ $args->slug ];
        $info   = self::$plugins[ $args->slug ];

        return (object) array(
            'name'          => $args->slug,
            'slug'          => $args->slug,
            'version'       => $remote['version'],
            'author'        => '<a href="https://doqix.co.za">Do.Qix</a>',
            'homepage'      => 'https://doqix.co.za',
            'download_link' => $remote['download_url'],
            'requires'      => isset( $remote['requires'] ) ? $remote['requires'] : '',
            'tested'        => isset( $remote['tested'] ) ? $remote['tested'] : '',
            'requires_php'  => isset( $remote['requires_php'] ) ? $remote['requires_php'] : '',
            'sections'      => array(
                'description' => 'Do.Qix plugin. Visit <a href="https://doqix.co.za">doqix.co.za</a> for details.',
                'changelog'   => '<p>See <a href="https://github.com/StephanM-ZA/doqix_website/releases">GitHub releases</a> for changelog.</p>',
            ),
        );
    }

    /**
     * Fix directory name after GitHub ZIP extraction.
     * GitHub ZIPs extract to "plugin-name-main/" or similar -- rename to the correct slug.
     */
    public static function after_install( $response, $hook_extra, $result ) {
        if ( ! isset( $hook_extra['plugin'] ) ) {
            return $response;
        }

        // Find which of our plugins this is
        $target_slug = '';
        foreach ( self::$plugins as $slug => $info ) {
            if ( $info['file'] === $hook_extra['plugin'] ) {
                $target_slug = $slug;
                break;
            }
        }

        if ( empty( $target_slug ) ) {
            return $response;
        }

        global $wp_filesystem;
        $proper_dir = WP_PLUGIN_DIR . '/' . $target_slug;

        // If the extracted directory doesn't match the expected slug, rename it
        if ( isset( $result['destination'] ) && $result['destination'] !== $proper_dir ) {
            $wp_filesystem->move( $result['destination'], $proper_dir );
            $result['destination'] = $proper_dir;
        }

        // Re-activate if it was active
        if ( is_plugin_active( $hook_extra['plugin'] ) ) {
            activate_plugin( $hook_extra['plugin'] );
        }

        return $response;
    }

    /**
     * Clear the cached manifest (call when you want to force a fresh check).
     */
    public static function clear_cache() {
        delete_transient( self::CACHE_KEY );
    }
}
