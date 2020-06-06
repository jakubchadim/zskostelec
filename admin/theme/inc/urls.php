<?php
if (isset($_GET['activated']) && is_admin()) {
    global $wp_rewrite;
    $wp_rewrite->set_permalink_structure('/%postname%/');
    $wp_rewrite->flush_rules();
}

/**
 * Redirect to Permalink setting Page.
 * Otherwise Redirect rule will not work Properly.
 */
function redirect_to_permalink() {
    wp_redirect('options-permalink.php');
}

add_action( 'after_switch_theme', 'redirect_to_permalink' );

function update_frontend_url ($link) {
    return $link; // TODO: update frontnend url
}

add_filter('preview_post_link', 'update_frontend_url');
add_filter('post_link', 'update_frontend_url');
add_filter('preview_page_link', 'update_frontend_url');
add_filter('page_link', 'update_frontend_url');
