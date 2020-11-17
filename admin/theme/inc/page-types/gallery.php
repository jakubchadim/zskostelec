<?php

function create_gallery_post_type() {
    $labels = array(
        'name'               => 'Fotogalerie',
        'singular_name'      => 'Fotogalerie',
        'menu_name'          => 'Fotogalerie',
        'name_admin_bar'     => 'Fotogalerie',
        'add_new'            => 'Přidat fotogalerii',
        'add_new_item'       => 'Přidat fotogalerii',
        'new_item'           => 'Nová fotogalerie',
        'edit_item'          => 'Upravit fotogalerii',
        'view_item'          => 'Zobrazit fotogalerii',
        'all_items'          => 'Všechny fotogalerie',
        'search_items'       => 'Hledat fotogalerie',
        'parent_item_colon'  => 'Nadřazená fotogalerie',
        'not_found'          => 'Fotogalerie nenalezena',
        'not_found_in_trash' => 'Žádná fotogalerie v koši'
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


