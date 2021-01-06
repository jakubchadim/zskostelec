<?php
// Menu to rest API
include_once( get_template_directory() . '/plugins/wp-api-menus/wp-api-menus.php' );

add_action( 'rest_api_init', 'wp_rest_menus_init' );

function register_my_menus() {
    register_nav_menus(
        array(
            'main-menu' => __( 'Hlavní menu' )
        )
    );
}

add_action( 'init', 'register_my_menus' );
