<?php

function gb_gutenberg_admin_styles() {
    echo '
        <style>
            /* Main column width */
            .wp-block {
                max-width: 720px;
            }
 
            /* Width of "wide" blocks */
            .wp-block[data-align="wide"] {
                max-width: 1080px;
            }
 
            /* Width of "full-wide" blocks */
            .wp-block[data-align="full"] {
                max-width: none;
            }	
        </style>
    ';
}

function hide_editor() {
    // Get the Post ID.
    $post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'] ;
    if ( !isset( $post_id ) ) return;

    // Hide the editor on a page with a specific page template
    // Get the name of the Page Template file.
    $template_file = get_post_meta($post_id, '_wp_page_template', true);


    if ($template_file == 'page-projects.php'){ // the filename of the page template
        remove_post_type_support('page', 'editor');
    }
}

add_action('admin_head', 'gb_gutenberg_admin_styles');

add_theme_support( 'editor-gradient-presets', array() );
add_theme_support( 'disable-custom-gradients' );

add_action( 'admin_init', 'hide_editor' );
