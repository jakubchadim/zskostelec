<?php

function create_employee_post_type() {
    $labels = array(
        'name'               => 'Zaměstnanec',
        'singular_name'      => 'Zaměstnanec',
        'menu_name'          => 'Zaměstnanci',
        'name_admin_bar'     => 'Zaměstnanec',
        'add_new'            => 'Přidat zaměstnance',
        'add_new_item'       => 'Přidat nového zaměstnance',
        'new_item'           => 'Nový zaměstnanec',
        'edit_item'          => 'Upravit zaměstnance',
        'view_item'          => 'Zobrazit zaměstnance',
        'all_items'          => 'Všichni zaměstnanci',
        'search_items'       => 'Hledat zaměstnance',
        'parent_item_colon'  => 'Nadřazený zaměstnanec',
        'not_found'          => 'Zaměstnanec nenalezen',
        'not_found_in_trash' => 'Žádný zaměstnanec v koši'
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
        'menu_icon'           => 'dashicons-businessman',
        'capability_type'     => 'post',
        'hierarchical'        => false,
        'supports'            => array( 'title' ),
        'has_archive'         => false,
        'rewrite'             => array( 'slug' => 'zamestnanec' ),
        'query_var'           => true
    );

    register_post_type( 'employee', $args );

    // Labels part for the GUI
    $labels = array(
        'name' => _x('Pracoviště', 'taxonomy general name'),
        'singular_name' => _x('Pracoviště', 'taxonomy singular name'),
        'search_items' => __('Vyhledat pracoviště'),
        'popular_items' => __('Populární pracoviště'),
        'all_items' => __('Všechny pracoviště'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Upravit pracoviště'),
        'update_item' => __('Aktualizovat pracoviště'),
        'add_new_item' => __('Přidat nové pracoviště'),
        'new_item_name' => __('Název pracoviště'),
        'separate_items_with_commas' => __('Oddělte jednotlivé pracoviště čárkou'),
        'add_or_remove_items' => __('Přidat nebo odebrat pracoviště'),
        'choose_from_most_used' => __('Vyberte z nejpoužívanějších pracovišť'),
        'menu_name' => __('Pracoviště')
    );

    // Now register the non-hierarchical taxonomy like tag
    register_taxonomy('building', 'employee', array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'pracoviste'),
    ));

    // Labels part for the GUI
    $labels = array(
        'name' => _x('Pozice', 'taxonomy general name'),
        'singular_name' => _x('Pozice', 'taxonomy singular name'),
        'search_items' => __('Vyhledat pozici'),
        'popular_items' => __('Populární pozice'),
        'all_items' => __('Všechny pozice'),
        'parent_item' => null,
        'parent_item_colon' => null,
        'edit_item' => __('Upravit pozici'),
        'update_item' => __('Aktualizovat pozici'),
        'add_new_item' => __('Přidat novou pozici'),
        'new_item_name' => __('Název pozice'),
        'separate_items_with_commas' => __('Oddělte jednotlivé pozice čárkou'),
        'add_or_remove_items' => __('Přidat nebo odebrat pozici'),
        'choose_from_most_used' => __('Vyberte z nejpoužívanějších pozicí'),
        'menu_name' => __('Pozice')
    );

    // Now register the non-hierarchical taxonomy like tag
    register_taxonomy('positions', 'employee', array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array('slug' => 'pozice'),
    ));
}

add_action('init', 'create_employee_post_type');


