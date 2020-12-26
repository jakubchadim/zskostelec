<?php

include_once( get_template_directory() . '/inc/acf.php' );
include_once( get_template_directory() . '/inc/articles.php' );
include_once( get_template_directory() . '/inc/menu.php' );
include_once( get_template_directory() . '/inc/blocks.php' );
include_once( get_template_directory() . '/inc/page-types.php' );
include_once( get_template_directory() . '/inc/urls.php' );
include_once( get_template_directory() . '/inc/editor.php' );
include_once( get_template_directory() . '/inc/disable-comments.php' );

add_filter( 'intermediate_image_sizes', '__return_empty_array' ); // Disable image previews
