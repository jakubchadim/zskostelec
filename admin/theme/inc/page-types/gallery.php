<?php

function create_gallery_post_type() {
    $labels = array(
        'name'               => 'Gallery',
        'singular_name'      => 'Gallery',
        'menu_name'          => 'Galleries',
        'name_admin_bar'     => 'Gallery',
        'add_new'            => 'New Gallery',
        'add_new_item'       => 'New Gallery',
        'new_item'           => 'New Gallery',
        'edit_item'          => 'Edit Gallery',
        'view_item'          => 'View Gallery',
        'all_items'          => 'All Galleries',
        'search_items'       => 'Search Galleries',
        'parent_item_colon'  => 'Parent Gallery',
        'not_found'          => 'No Galleries Found',
        'not_found_in_trash' => 'No Galleries Found in Trash'
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'exclude_from_search' => false,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_nav_menus'   => false,
        'show_in_menu'        => true,
        'show_in_admin_bar'   => true,
        'show_in_rest'        => true,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-format-gallery',
        'capability_type'     => 'post',
        'hierarchical'        => false,
        'supports'            => array( 'title' ),
        'has_archive'         => false,
        'rewrite'             => array( 'slug' => 'fotogalerie' ),
        'query_var'           => true
    );

    register_post_type( 'gallery', $args );
}

add_action('init', 'create_gallery_post_type');


