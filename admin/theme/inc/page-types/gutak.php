<?php

function create_gutak_page_type() {
    $labels = array(
        'name'               => 'Guťák',
        'singular_name'      => 'Guťák',
        'menu_name'          => 'Guťák',
        'name_admin_bar'     => 'Guťák',
        'add_new'            => 'Nahrát Guťák',
        'add_new_item'       => 'Nahrát nový Guťák',
        'new_item'           => 'Nový Guťák',
        'edit_item'          => 'Upravit Guťák',
        'view_item'          => 'Zobrazit Guťák',
        'all_items'          => 'Všechny Guťáky',
        'search_items'       => 'Hledat Guťáky',
        'parent_item_colon'  => 'Nadřazený Guťák',
        'not_found'          => 'Guťák nenalezen',
        'not_found_in_trash' => 'Žádný Guťák v koši'
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'exclude_from_search' => false,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_nav_menus'   => true,
        'show_in_menu'        => true,
        'show_in_admin_bar'   => true,
        'show_in_rest'        => true,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-welcome-view-site',
        'capability_type'     => 'post',
        'hierarchical'        => false,
        'supports'            => array( 'title' ),
        'has_archive'         => true,
        'rewrite'             => array( 'slug' => 'gutak' ),
        'query_var'           => true
    );

    register_post_type( 'gutak', $args );
}

add_action('init', 'create_gutak_page_type', 0);
