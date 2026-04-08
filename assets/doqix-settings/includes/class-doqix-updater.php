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

    /** @var string WP option key for GitHub token */
    private const TOKEN_OPTION = 'doqix_github_token';

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
            add_filter( 'http_request_args', array( __CLASS__, 'inject_auth_header' ), 10, 2 );
            self::$hooked = true;
        }
    }

    /** @var string GitHub API URL for latest release */
    private const RELEASE_API_URL = 'https://api.github.com/repos/StephanM-ZA/doqix_website/releases/latest';

    /**
     * Fetch the manifest from GitHub and resolve download URLs from latest release (cached).
     */
    private static function get_manifest() {
        $cached = get_transient( self::CACHE_KEY );
        if ( false !== $cached ) {
            return $cached;
        }

        $token   = get_option( self::TOKEN_OPTION, '' );
        $headers = array( 'Accept' => 'application/json' );
        if ( ! empty( $token ) ) {
            $headers['Authorization'] = 'token ' . $token;
        }

        // Fetch updates.json manifest
        $response = wp_remote_get( self::MANIFEST_URL, array(
            'timeout' => 10,
            'headers' => $headers,
        ) );

        if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
            return array();
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( ! is_array( $data ) ) {
            return array();
        }

        // Fetch latest release to get actual asset download URLs (required for private repos)
        $release_headers = array(
            'Accept'     => 'application/vnd.github.v3+json',
            'User-Agent' => 'DoQix-WordPress-Updater',
        );
        if ( ! empty( $token ) ) {
            $release_headers['Authorization'] = 'token ' . $token;
        }

        $release_response = wp_remote_get( self::RELEASE_API_URL, array(
            'timeout' => 10,
            'headers' => $release_headers,
        ) );

        if ( ! is_wp_error( $release_response ) && 200 === wp_remote_retrieve_response_code( $release_response ) ) {
            $release = json_decode( wp_remote_retrieve_body( $release_response ), true );
            if ( isset( $release['assets'] ) && is_array( $release['assets'] ) ) {
                // Build asset name → browser_download_url map
                $asset_urls = array();
                foreach ( $release['assets'] as $asset ) {
                    $asset_urls[ $asset['name'] ] = $asset['url']; // API URL for private repos
                }
                // Override download_url in manifest with actual API asset URLs
                foreach ( $data as $slug => &$plugin_info ) {
                    $zip_name = $slug . '.zip';
                    if ( isset( $asset_urls[ $zip_name ] ) ) {
                        $plugin_info['download_url'] = $asset_urls[ $zip_name ];
                    }
                }
                unset( $plugin_info );
            }
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
     * Inject auth header for GitHub API/download requests to our repo.
     */
    public static function inject_auth_header( $args, $url ) {
        $token = get_option( self::TOKEN_OPTION, '' );
        if ( empty( $token ) ) {
            return $args;
        }

        // Only inject for requests to our GitHub repo
        $is_github = strpos( $url, 'github.com/StephanM-ZA/doqix_website' ) !== false
            || strpos( $url, 'raw.githubusercontent.com/StephanM-ZA/doqix_website' ) !== false
            || strpos( $url, 'api.github.com/repos/StephanM-ZA/doqix_website' ) !== false;

        if ( $is_github ) {
            $args['headers']['Authorization'] = 'token ' . $token;

            // For release asset downloads via API, request binary content
            if ( strpos( $url, 'api.github.com/repos/StephanM-ZA/doqix_website/releases/assets/' ) !== false ) {
                $args['headers']['Accept'] = 'application/octet-stream';
            }
        }

        return $args;
    }

    /**
     * Get the token option key (for use in settings page).
     */
    public static function get_token_option_key() {
        return self::TOKEN_OPTION;
    }

    /**
     * Clear the cached manifest (call when you want to force a fresh check).
     */
    public static function clear_cache() {
        delete_transient( self::CACHE_KEY );
    }
}
