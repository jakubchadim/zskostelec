<?php
$acfPath = '/plugins/advanced-custom-fields-pro/';

// 1. customize ACF path
add_filter('acf/settings/path', function () use ($acfPath) {
    return get_template_directory() . $acfPath;
});

// 2. customize ACF dir
add_filter('acf/settings/dir', function () use ($acfPath) {
    return get_template_directory_uri() . $acfPath;
});

// 3. Hide ACF field group menu item
// add_filter('acf/settings/show_admin', '__return_false');

// 4. Include ACF
include_once( get_template_directory() . $acfPath . 'acf.php' );


// Include ACF API
define( 'ACF_TO_REST_API_REQUEST_VERSION', 2);

include_once( get_template_directory() . '/plugins/acf-to-rest-api/class-acf-to-rest-api.php' );

add_action( 'init', ['ACF_To_REST_API', 'init'] );

add_action('admin_head', 'hide_donation_notice');

function hide_donation_notice() {
    echo '<style>.acf-to-rest-api-donation-notice { display: none !important;}</style>';
}
