<?php

function transform_blocks ($blocks, &$result, $parentId) {
    foreach ($blocks as &$block) {
        $blockResult = [
            'blockId' => uniqid(),
            'parentId' => $parentId,
            'type' => $block['blockName'],
            'attrs' => json_encode($block['attrs']),
            'content' => str_replace(["\n", "\r"], '', strval($block['innerHTML']))
        ];

        if ($block['innerBlocks'] && count($block['innerBlocks']) > 0) {
            transform_blocks($block['innerBlocks'], $result, $blockResult['blockId']);
        }

        if (!($blockResult['type'] == null && $blockResult['content'] == '')) {
            array_push($result, $blockResult);
        }
    }
}

function get_transformed_blocks ($blocks) {
    $transformedBlocks = [];

    transform_blocks($blocks, $transformedBlocks, null);

    return $transformedBlocks;
}

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
                            return parse_blocks($post['content']['raw']);
                        },
                    ]
                );
            }
        }
    }
);

$colorPalette = array(
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
);

// Theme colors
add_theme_support( 'editor-color-palette', $colorPalette );

add_action('admin_head', function () use ($colorPalette) {
    echo '<style>';

    foreach ($colorPalette as $color) {
        echo '
        .has-inline-color.has-' . $color['slug'] . '-color {
            color: ' .  $color['color'] . ';
        }
        ';
    }

    echo '</style>';
});

add_theme_support( 'disable-custom-colors' );
