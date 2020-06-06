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
                            return get_transformed_blocks(parse_blocks( $post['content']['raw']));
                        },
                    ]
                );
            }
        }
    }
);
