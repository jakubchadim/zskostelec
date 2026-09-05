import { WP_CACHE_TAGS } from '@/lib/wp/client'

export type RevalidatePayload = {
  type?: unknown
  id?: unknown
  slug?: unknown
}

const ALL_TAGS: readonly string[] = Object.values(WP_CACHE_TAGS)

/**
 * WP post_type / taxonomy name -> the single `WP_CACHE_TAGS` entry to revalidate.
 *
 * Every fetch in `app/src/lib/wp/entities/*.ts` always carries its content type's
 * coarse tag alongside any per-entity tag (e.g. `getPostBySlug` -> `[posts,
 * post-${slug}]`, `getPostsByCategory` -> `[posts, category-${id}]`). Since
 * `revalidateTag(x)` busts any cache entry whose tag list contains `x`,
 * revalidating the coarse tag alone is always sufficient - per-entity tags add
 * no extra correctness, only redundancy. Concretely: a post save only needs
 * `posts` - that alone also busts category listings and route entries, since
 * those fetches carry `posts` too (`categories` holds only category *entities*,
 * not post listings, so a post edit never needs it). `documentCategories`/
 * `positions`/`building` are taxonomies on `document`/`employee` and already
 * share that post type's own tag in the data layer (`document.ts`/
 * `employee.ts` tag their term-listing fetches the same as the entity
 * fetches), so they map straight through with no dedicated tag of their own.
 */
const TYPE_TAGS: Record<string, string> = {
  post: WP_CACHE_TAGS.posts,
  page: WP_CACHE_TAGS.pages,
  category: WP_CACHE_TAGS.categories,
  gallery: WP_CACHE_TAGS.gallery,
  employee: WP_CACHE_TAGS.employee,
  positions: WP_CACHE_TAGS.employee,
  building: WP_CACHE_TAGS.employee,
  document: WP_CACHE_TAGS.document,
  documentCategories: WP_CACHE_TAGS.document,
  gutak: WP_CACHE_TAGS.gutak,
  menu: WP_CACHE_TAGS.menus,
  media: WP_CACHE_TAGS.media,
  attachment: WP_CACHE_TAGS.media
}

/**
 * Unknown/missing `type` falls back to every known tag - cheap (this only
 * marks cache entries stale, it doesn't force a rebuild) and it never leaves
 * the site stale from a mapping gap or a malformed webhook body.
 */
export function resolveRevalidationTags(payload: RevalidatePayload): string[] {
  const type = typeof payload?.type === 'string' ? payload.type : undefined
  const tag = type ? TYPE_TAGS[type] : undefined

  return tag ? [tag] : [...ALL_TAGS]
}
