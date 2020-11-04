<?php

function create_employee_post_type() {
    $labels = array(
        'name'               => 'Employee',
        'singular_name'      => 'Employee',
        'menu_name'          => 'Employees',
        'name_admin_bar'     => 'Employee',
        'add_new'            => 'New Employee',
        'add_new_item'       => 'New Employee',
        'new_item'           => 'New Employee',
        'edit_item'          => 'Edit Employee',
        'view_item'          => 'View Employee',
        'all_items'          => 'All Employees',
        'search_items'       => 'Search Employees',
        'parent_item_colon'  => 'Parent Employee',
        'not_found'          => 'No Employees Found',
        'not_found_in_trash' => 'No Employees Found in Trash'
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
}

add_action('init', 'create_employee_post_type');


