<?php
$page_types_dir = get_template_directory() . '/inc/page-types/';

function load_custom_page_type ($dir, $type) {
    $file_string = file_get_contents($dir . $type . '.json');
    $afc_groups = json_decode($file_string, true);

    if (is_array($afc_groups)) {
        foreach ($afc_groups as $group) {
            acf_add_local_field_group($group);
        }
    }
}

include_once( $page_types_dir . 'gallery.php' );
include_once( $page_types_dir . 'document.php' );
include_once( $page_types_dir . 'employee.php' );
include_once( $page_types_dir . 'gutak.php' );

if( function_exists('acf_add_local_field_group') ) {
    load_custom_page_type($page_types_dir,'homepage');
    load_custom_page_type($page_types_dir,'gallery');
    load_custom_page_type($page_types_dir,'document');
    load_custom_page_type($page_types_dir,'building');
    load_custom_page_type($page_types_dir,'employee');
    load_custom_page_type($page_types_dir,'gutak');
    load_custom_page_type($page_types_dir,'article');
}

// Remove comments page in menu
add_action('admin_menu', function () {
    remove_menu_page('edit-comments.php');
});

// Remove comments links from admin bar
add_action('init', function () {
    if (is_admin_bar_showing()) {
        remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
    }
});

// Disable Tags Dashboard WP
add_action('admin_menu', 'my_remove_sub_menus');

function my_remove_sub_menus() {
    remove_submenu_page('edit.php', 'edit-tags.php?taxonomy=post_tag');
}
// Remove tags support from posts
function myprefix_unregister_tags() {
    unregister_taxonomy_for_object_type('post_tag', 'post');
}
add_action('init', 'myprefix_unregister_tags');
