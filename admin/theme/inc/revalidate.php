<?php

/**
 * Fires a fire-and-forget webhook to the Next.js app's on-demand ISR
 * revalidation endpoint (`app/src/app/api/revalidate/route.ts`) whenever
 * content changes here. Non-blocking and defensive throughout: a failure to
 * reach the app (unset config, network error, non-2xx response) must never
 * break the admin save flow.
 *
 * Configure via container/environment variables (see
 * `admin/docker-compose.yaml` and `admin/.env.template`):
 *   APP_REVALIDATE_URL    - the app's origin, e.g. https://zskostelec.vercel.app
 *   APP_REVALIDATE_SECRET - shared secret, must match REVALIDATE_SECRET on the app side
 *
 * If either is unset, `trigger_app_revalidate()` silently no-ops - safe for
 * local dev without the app running, but it means content only refreshes on
 * the app's time-based ISR fallback (`WP_REVALIDATE_SECONDS`) until both are
 * set.
 */

function app_revalidate_url() {
    $url = getenv( 'APP_REVALIDATE_URL' );
    // The trailing slash is REQUIRED: the app runs with `trailingSlash: true`
    // (T8), so a request to `/api/revalidate` (no slash) 308-redirects - a
    // redirect `wp_remote_post()`'s non-blocking transport can never follow,
    // silently degrading revalidation to the 5-minute time-based fallback.
    return $url ? rtrim( $url, '/' ) . '/api/revalidate/' : null;
}

function app_revalidate_secret() {
    $secret = getenv( 'APP_REVALIDATE_SECRET' );
    return $secret ? $secret : null;
}

/**
 * Fires-and-forgets a revalidation request. `$type` must match one of the
 * WP post_type / taxonomy names handled by the mapping in
 * `app/src/app/api/revalidate/mapping.ts` (post, page, category, gallery,
 * employee, positions, building, document, documentCategories, gutak, menu,
 * media, attachment) - anything else falls back there to revalidating every
 * tag, so an unrecognized `$type` is still safe, just less targeted.
 */
function trigger_app_revalidate( $type, $id = null, $slug = null ) {
    $endpoint = app_revalidate_url();
    $secret   = app_revalidate_secret();

    if ( ! $endpoint || ! $secret ) {
        return;
    }

    $body = array( 'type' => $type );

    if ( $id !== null ) {
        $body['id'] = $id;
    }

    if ( $slug !== null && $slug !== '' ) {
        $body['slug'] = $slug;
    }

    wp_remote_post( $endpoint, array(
        'timeout'   => 3,
        'blocking'  => false,
        'sslverify' => true,
        'headers'   => array(
            'Content-Type'        => 'application/json',
            'X-Revalidate-Secret' => $secret,
        ),
        'body' => wp_json_encode( $body ),
    ) );
}

/**
 * Post types whose save/trash/delete should trigger a revalidation. The
 * `type` sent to the app is just the WP post_type name itself.
 */
function app_revalidate_post_types() {
    return array( 'post', 'page', 'gallery', 'employee', 'document', 'gutak' );
}

function app_revalidate_on_save_post( $post_id, $post, $update ) {
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    if ( wp_is_post_revision( $post_id ) ) {
        return;
    }

    // Draft/pending saves shouldn't ping the app - only a real publish (or a
    // status transition among the trash/delete hooks below) should. Without
    // this, every autosave-free manual save while an editor is drafting fires
    // a webhook for content nobody can see yet.
    if ( in_array( $post->post_status, array( 'auto-draft', 'draft', 'pending', 'inherit' ), true ) ) {
        return;
    }

    if ( ! in_array( $post->post_type, app_revalidate_post_types(), true ) ) {
        return;
    }

    trigger_app_revalidate( $post->post_type, $post_id, $post->post_name );
}
add_action( 'save_post', 'app_revalidate_on_save_post', 10, 3 );

function app_revalidate_on_post_status_change( $post_id ) {
    $post = get_post( $post_id );

    if ( ! $post || ! in_array( $post->post_type, app_revalidate_post_types(), true ) ) {
        return;
    }

    trigger_app_revalidate( $post->post_type, $post_id, $post->post_name );
}
add_action( 'trashed_post', 'app_revalidate_on_post_status_change' );
add_action( 'untrashed_post', 'app_revalidate_on_post_status_change' );
add_action( 'before_delete_post', 'app_revalidate_on_post_status_change' );

/**
 * Taxonomy term changes. `documentCategories`/`positions`/`building` share
 * their post type's cache tag on the app side (see document.ts/employee.ts),
 * so they're mapped straight through by taxonomy name.
 */
function app_revalidate_taxonomies() {
    return array( 'category', 'documentCategories', 'positions', 'building' );
}

function app_revalidate_on_term_change( $term_id, $tt_id, $taxonomy ) {
    if ( ! in_array( $taxonomy, app_revalidate_taxonomies(), true ) ) {
        return;
    }

    trigger_app_revalidate( $taxonomy, $term_id );
}
add_action( 'created_term', 'app_revalidate_on_term_change', 10, 3 );
add_action( 'edited_term', 'app_revalidate_on_term_change', 10, 3 );
add_action( 'delete_term', 'app_revalidate_on_term_change', 10, 3 );

/**
 * Nav menu changes (see inc/menu.php - `main-menu`, exposed over REST by
 * wp-api-menus as e.g. `top-menu`). Looks up the real menu slug so the app
 * gets the same value `menu.ts`'s `getMenuBySlug`/`LEGACY_MENU_SLUGS` use.
 */
function app_revalidate_on_menu_update( $menu_id ) {
    $menu = wp_get_nav_menu_object( $menu_id );
    trigger_app_revalidate( 'menu', $menu_id, $menu ? $menu->slug : null );
}
add_action( 'wp_update_nav_menu', 'app_revalidate_on_menu_update' );

/**
 * Media library changes (uploads, edits - e.g. alt text/caption - and
 * deletions are all real content changes for anything embedding an image).
 */
function app_revalidate_on_attachment_change( $post_id ) {
    trigger_app_revalidate( 'attachment', $post_id );
}
add_action( 'add_attachment', 'app_revalidate_on_attachment_change' );
add_action( 'edit_attachment', 'app_revalidate_on_attachment_change' );
add_action( 'delete_attachment', 'app_revalidate_on_attachment_change' );
