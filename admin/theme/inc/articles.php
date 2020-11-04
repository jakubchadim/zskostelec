<?php

function my_excerpt_length() {
    return 10;
}

function new_excerpt_more() {
    return '...';
}

add_filter('excerpt_length', 'my_excerpt_length', 999);
add_filter('excerpt_more', 'new_excerpt_more');
