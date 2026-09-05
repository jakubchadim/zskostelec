import { wpFetch, wpFetchAllPages, wpFetchCollection, wpFetchOrNull, WP_CACHE_TAGS } from '../client'
import { getUrlRewriteConfig } from '../env'
import { normalizeBlocks, transformBlocks } from '../blocks/normalizer'
import { rewriteAdminUrls } from '../blocks/urls'
import type { RawBlock, TransformedBlock } from '../blocks/types'
import { asId, type DateString, type ID, type Nullable, type RawHTML } from '../types'
import { getCategoryBySlug } from './category'
import { getGalleryById, type WpGallery } from './gallery'
import { resolveAcfMedia } from './media'

/** Posts-per-page for category pagination (`strana-N`), matching the Gatsby-era `paginationLimit`. */
export const CATEGORY_PAGE_SIZE = 15

type RawGalleryRef = { ID?: number; id?: number }

type RawWpPost = {
  id: number
  slug: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  blocks?: RawBlock[]
  categories: number[]
  acf?: {
    link?: string | null
    file?: unknown
    gallery?: RawGalleryRef[] | null
  }
}

export type WpPostAcf = {
  link: Nullable<string>
  file: Nullable<string>
  gallery: ID[]
}

export type WpPost = {
  id: ID
  slug: string
  link: Nullable<string>
  title: RawHTML
  excerpt: RawHTML
  content: RawHTML
  date: DateString
  blocks: TransformedBlock[]
  categories: ID[]
  acf: WpPostAcf
  galleries?: WpGallery[]
}

const POST_FIELDS = ['id', 'slug', 'link', 'title', 'excerpt', 'content', 'date', 'blocks', 'categories', 'acf']

/**
 * Ported from `web/src/components/article/normalizer.ts`: a post with no
 * body content acts as a pure "link" or "file download" article, and its
 * effective `link` (used everywhere in place of its real permalink)
 * becomes the ACF `link` field, or the attached file's URL, or `null` if
 * neither is set. A post with real content always keeps its own permalink.
 * `hasAcf` mirrors the original's outer `if (entity?.acf)` guard - a post
 * with no `acf` key at all never gets the override, even if content is
 * also empty (in practice `acf-to-rest-api` always includes an `acf` key,
 * so this only matters for a WP install/plugin config this wasn't tested
 * against - see T1 review finding 4).
 */
export function resolvePostLink(input: {
  hasAcf: boolean
  hasContent: boolean
  permalink: string
  acfLink: Nullable<string>
  fileUrl: Nullable<string>
}): Nullable<string> {
  if (!input.hasAcf || input.hasContent) {
    return input.permalink
  }

  return input.acfLink ?? input.fileUrl ?? null
}

/** Shared by the lean listing fetches (`getPostRouteEntries`, `getPostPreviews`): resolves the ACF file to a URL, then applies `resolvePostLink`. */
async function resolveListingLink(input: {
  hasAcf: boolean
  hasContent: boolean
  rewrittenLink: string
  rewrittenAcfLink: Nullable<string>
  rawAcfFile: unknown
}): Promise<Nullable<string>> {
  const fileMedia = input.rawAcfFile != null ? await resolveAcfMedia(input.rawAcfFile) : null

  return resolvePostLink({
    hasAcf: input.hasAcf,
    hasContent: input.hasContent,
    permalink: input.rewrittenLink,
    acfLink: input.rewrittenAcfLink,
    fileUrl: fileMedia?.source_url ?? null
  })
}

async function normalizePost(raw: RawWpPost): Promise<WpPost> {
  const search = getUrlRewriteConfig()
  // Exclude acf.file from the rewrite: a file download URL must stay
  // absolute (media isn't served by this site yet - see gallery.ts's
  // normalizeGallery for the same reasoning). acf.link legitimately does
  // get relative-ized here, same as `link` itself - it's a navigational
  // link (matching the original article normalizer's own
  // `link.replace(adminOrigin, '')`), not a media/file URL.
  const rewritten = rewriteAdminUrls({ ...raw, acf: { ...raw.acf, file: undefined } }, search)
  const blocks = normalizeBlocks(transformBlocks(rewritten.blocks ?? [], null), search)

  const acfLink = rewritten.acf?.link ?? null
  const fileMedia = raw.acf?.file != null ? await resolveAcfMedia(raw.acf.file) : null
  const fileLink = fileMedia?.source_url ?? null

  const galleryIds = (rewritten.acf?.gallery ?? [])
    .map((ref) => ref.ID ?? ref.id)
    .filter((id): id is number => id != null)
    .map((id) => asId(id))

  const galleries = galleryIds.length
    ? (await Promise.all(galleryIds.map((id) => getGalleryById(id)))).filter(
        (gallery): gallery is WpGallery => gallery != null
      )
    : undefined

  return {
    id: asId(rewritten.id),
    slug: rewritten.slug,
    link: resolvePostLink({
      hasAcf: raw.acf != null,
      hasContent: Boolean(rewritten.content.rendered),
      permalink: rewritten.link,
      acfLink,
      fileUrl: fileLink
    }),
    title: rewritten.title.rendered as RawHTML,
    excerpt: rewritten.excerpt.rendered as RawHTML,
    content: rewritten.content.rendered as RawHTML,
    date: rewritten.date as DateString,
    blocks,
    categories: rewritten.categories.map(asId),
    acf: { link: acfLink, file: fileLink, gallery: galleryIds },
    galleries
  }
}

export async function getPosts(): Promise<WpPost[]> {
  const raw = await wpFetchAllPages<RawWpPost>('wp/v2/posts', {
    fields: POST_FIELDS,
    params: { status: 'publish' },
    tags: [WP_CACHE_TAGS.posts]
  })

  return Promise.all(raw.map(normalizePost))
}

export async function getPostBySlug(slug: string): Promise<WpPost | null> {
  const results = await wpFetch<RawWpPost[]>('wp/v2/posts', {
    fields: POST_FIELDS,
    params: { slug, status: 'publish' },
    tags: [WP_CACHE_TAGS.posts, `post-${slug}`]
  })

  const [raw] = results
  return raw ? normalizePost(raw) : null
}

export async function getPostById(id: ID): Promise<WpPost | null> {
  const raw = await wpFetchOrNull<RawWpPost>(`wp/v2/posts/${id}`, {
    fields: POST_FIELDS,
    tags: [WP_CACHE_TAGS.posts, `post-${id}`]
  })

  return raw ? normalizePost(raw) : null
}

/** Latest posts in a category by slug, e.g. for the homepage's per-category article previews. */
export async function getPostsByCategory(
  categorySlug: string,
  opts: { limit: number; excludePostId?: ID }
): Promise<WpPost[]> {
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    return []
  }

  const raw = await wpFetch<RawWpPost[]>('wp/v2/posts', {
    fields: POST_FIELDS,
    params: {
      categories: category.id,
      per_page: opts.limit,
      status: 'publish',
      exclude: opts.excludePostId
    },
    tags: [WP_CACHE_TAGS.posts, `category-${category.id}`]
  })

  return Promise.all(raw.map(normalizePost))
}

/** A single `offset`/`limit` page of a category's posts, plus the total count for pagination UI. */
export async function getPostsForCategory(
  categoryId: ID,
  opts: { offset: number; limit: number }
): Promise<{ posts: WpPost[]; totalCount: number }> {
  const { items, totalCount } = await wpFetchCollection<RawWpPost>('wp/v2/posts', {
    fields: POST_FIELDS,
    params: {
      categories: categoryId,
      offset: opts.offset,
      per_page: opts.limit,
      status: 'publish'
    },
    tags: [WP_CACHE_TAGS.posts, `category-${categoryId}`]
  })

  return { posts: await Promise.all(items.map(normalizePost)), totalCount }
}

export type PostRouteEntry = { id: ID; link: Nullable<string>; categories: ID[] }

type RawWpPostRouteEntry = {
  id: number
  link: string
  categories: number[]
  excerpt: { rendered: string }
  acf?: { link?: string | null; file?: unknown }
}

const POST_ROUTE_FIELDS = ['id', 'link', 'categories', 'excerpt', 'acf']

/**
 * A cheap listing for route classification only (see T1 review finding
 * 2) - trims `content`/`blocks` entirely, skipping the whole block-
 * transform/normalize/JSDOM pipeline for every post on every route
 * resolution. `resolvePostLink`'s content-emptiness check still needs
 * *something* to gate on (see `web/src/components/article/normalizer.ts`'s
 * `if (!entity.content)`), so this proxies it with `excerpt` instead of
 * `content`: WP caps excerpts at 10 words
 * (`admin/theme/inc/articles.php`'s `my_excerpt_length` filter) and
 * auto-generates them FROM content when no manual excerpt is set, so an
 * empty excerpt reliably (and cheaply) means empty content. The one edge
 * case this can miss is an editor manually setting a custom excerpt on an
 * otherwise content-less "link" article - implausible for a post whose
 * entire point is having no body, and disclosed here rather than silently
 * assumed. Actual page rendering still goes through `getPostById`/
 * `getPostBySlug`, which read the real, un-proxied `content`.
 */
export async function getPostRouteEntries(): Promise<PostRouteEntry[]> {
  const raw = await wpFetchAllPages<RawWpPostRouteEntry>('wp/v2/posts', {
    fields: POST_ROUTE_FIELDS,
    params: { status: 'publish' },
    tags: [WP_CACHE_TAGS.posts]
  })

  return Promise.all(
    raw.map(async (post) => {
      const rewritten = rewriteAdminUrls(
        { link: post.link, acf: { link: post.acf?.link ?? null } },
        getUrlRewriteConfig()
      )

      return {
        id: asId(post.id),
        link: await resolveListingLink({
          hasAcf: post.acf != null,
          hasContent: Boolean(post.excerpt.rendered),
          rewrittenLink: rewritten.link,
          rewrittenAcfLink: rewritten.acf.link,
          rawAcfFile: post.acf?.file
        }),
        categories: post.categories.map(asId)
      }
    })
  )
}

export type PostPreview = {
  id: ID
  title: RawHTML
  excerpt: RawHTML
  date: DateString
  link: Nullable<string>
}

type RawWpPostPreview = {
  id: number
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  date: string
  acf?: { link?: string | null; file?: unknown }
}

const POST_PREVIEW_FIELDS = ['id', 'link', 'title', 'excerpt', 'date', 'acf']

/**
 * Lean listing fetch for article preview cards
 * (`components/article/article.tsx`'s `Article`, which only ever renders
 * `title`/`excerpt`/`date`/`link` - `id` is used solely as the React key at
 * call sites). Trims `content`/`blocks`/`categories` entirely, same trick
 * as `getPostRouteEntries` (including the `excerpt`-as-content-emptiness-
 * proxy for `resolvePostLink` - see that function's doc comment).
 * `getPostsForCategory`/`getPostsByCategory` still exist for callers that
 * need a full post — `home-data.ts` legitimately keeps `getPostsByCategory`,
 * since its first preview article can be promoted to the full-content
 * homepage mainPost. The category listing, post sidebar, and
 * `getStaticRoutes`' count read use this lean fetch instead (T1 fast-follow
 * backlog item: "getPostsForCategory runs the full block-normalization
 * pipeline ... for all 15 posts per category page").
 */
export async function getPostPreviews(
  categoryId: ID,
  opts: { offset?: number; limit: number; excludePostId?: ID }
): Promise<{ posts: PostPreview[]; totalCount: number }> {
  const { items, totalCount } = await wpFetchCollection<RawWpPostPreview>('wp/v2/posts', {
    fields: POST_PREVIEW_FIELDS,
    params: {
      categories: categoryId,
      offset: opts.offset ?? 0,
      per_page: opts.limit,
      status: 'publish',
      exclude: opts.excludePostId
    },
    tags: [WP_CACHE_TAGS.posts, `category-${categoryId}`]
  })

  const posts = await Promise.all(
    items.map(async (post) => {
      const rewritten = rewriteAdminUrls(
        {
          link: post.link,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          acf: { link: post.acf?.link ?? null }
        },
        getUrlRewriteConfig()
      )

      return {
        id: asId(post.id),
        title: rewritten.title.rendered as RawHTML,
        excerpt: rewritten.excerpt.rendered as RawHTML,
        date: rewritten.date as DateString,
        link: await resolveListingLink({
          hasAcf: post.acf != null,
          hasContent: Boolean(post.excerpt.rendered),
          rewrittenLink: rewritten.link,
          rewrittenAcfLink: rewritten.acf.link,
          rawAcfFile: post.acf?.file
        })
      }
    })
  )

  return { posts, totalCount }
}
