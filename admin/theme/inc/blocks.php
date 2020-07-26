<?php
add_action(
    'rest_api_init',
    function () {

        if ( ! function_exists( 'use_block_editor_for_post_type' ) ) {
            require ABSPATH . 'wp-admin/includes/post.php';
        }

        // Surface all Gutenberg blocks in the WordPress REST API
        $post_types = get_post_types_by_support( [ 'editor' ] );
        foreach ( $post_types as $post_type ) {
            if ( use_block_editor_for_post_type( $post_type ) ) {
                register_rest_field(
                    $post_type,
                    'blocks',
                    [
                        'get_callback' => function ( array $post ) {
                            return parse_blocks( $post['content']['raw']);
                        },
                    ]
                );
            }
        }
    }
);

// Theme colors
add_theme_support( 'editor-color-palette', array(
    array(
        'name'  => __( 'Primary', 'genesis-sample' ),
        'slug'  => 'primary',
        'color'	=> '#FFC107',
    ),
    array(
        'name'  => __( 'Secondary', 'genesis-sample' ),
        'slug'  => 'secondary',
        'color'	=> '#009688',
    ),
    array(
        'name'  => __( 'White', 'genesis-sample' ),
        'slug'  => 'white',
        'color'	=> '#fff',
    ),
    array(
        'name'  => __( 'Light gray', 'genesis-sample' ),
        'slug'  => 'light-gray',
        'color'	=> '#f5f5f5',
    ),
    array(
        'name'  => __( 'Medium gray', 'genesis-sample' ),
        'slug'  => 'medium-gray',
        'color' => '#999',
    ),
    array(
        'name'  => __( 'Dark gray', 'genesis-sample' ),
        'slug'  => 'dark-gray',
        'color' => '#333',
    ),
    array(
        'name'  => __( 'Black', 'genesis-sample' ),
        'slug'  => 'black',
        'color'	=> '#191919',
    )
) );

add_theme_support( 'disable-custom-colors' );
add_theme_support( 'editor-gradient-presets', array() );
add_theme_support( 'disable-custom-gradients' );
