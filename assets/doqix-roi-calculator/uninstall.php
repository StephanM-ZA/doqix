<?php
/**
 * Fired when the plugin is uninstalled (deleted via WP admin).
 * Removes the single options row from wp_options.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'doqix_roi_settings' );
