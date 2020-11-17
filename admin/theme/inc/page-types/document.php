<?php

function create_document_page_type() {
    $labels = array(
        'name'               => 'Dokumenty',
        'singular_name'      => 'Dokument',
        'menu_name'          => 'Dokumenty',
        'name_admin_bar'     => 'Dokument',
        'add_new'            => 'Nahrát dokument',
        'add_new_item'       => 'Nahrát nový dokument',
        'new_item'           => 'Nový dokument',
        'edit_item'          => 'Upravit dokument',
        'view_item'          => 'Zobrazit dokument',
        'all_items'          => 'Všechny dokumenty',
        'search_items'       => 'Hledat dokumenty',
        'parent_item_colon'  => 'Nadřazený dokument',
        'not_found'          => 'Dokument nenalezen',
        'not_found_in_trash' => 'Žádný dokument v koši'
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
        'show_in_rest' => true,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-cloud',
        'capability_type'     => 'post',
        'hierarchical'        => false,
        'supports'            => array( 'title' ),
        'has_archive'         => true,
        'rewrite'             => array( 'slug' => 'dokument' ),
        'query_var'           => true
    );

    register_post_type( 'document', $args );
    
    // Labels part for the GUI
    $labels = array(
        'name' => _x('Typy', 'taxonomy general name'),
        'singular_name' => _x('Typ', 'taxonomy singular name'),
        'search_items' => __('Vyhledat typ'),
        'popular_items' => __('Populární typy'),
        'all_items' => __('Všechny typy'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Upravit typ'),
        'update_item' => __('Aktualizovat typ'),
        'add_new_item' => __('Přidat nový typ'),
        'new_item_name' => __('Název typu'),
        'separate_items_with_commas' => __('Oddělte jednotlivé typy čárkou'),
        'add_or_remove_items' => __('Přidat nebo odebrat typ'),
        'choose_from_most_used' => __('Vyberte z nejpoužívanějších typů'),
        'menu_name' => __('Typy')
    );

    // Now register the non-hierarchical taxonomy like tag
    register_taxonomy('types', 'document', array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'dokumenty'),
    ));
}

add_action('init', 'create_document_page_type', 0);
