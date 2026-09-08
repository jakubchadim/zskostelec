import { getCategories } from '../entities/category'
import { getGalleries, getGalleryRouteEntries, GALLERY_PAGE_SIZE } from '../entities/gallery'
import { getPages, PageTemplateType } from '../entities/page'
import { CATEGORY_PAGE_SIZE, getPostPreviews, getPostRouteEntries } from '../entities/post'
import type { ID } from '../types'
import type { ResolvedRoute } from './types'

type IndexEntry =
  | { kind: 'page'; id: ID; templateType: PageTemplateType; basePath: string }
  | { kind: 'post'; id: ID; categoryId: ID }
  | { kind: 'category'; id: ID; rootCategoryId: ID; basePath: string }
  | { kind: 'gallery'; id: ID; allGalleryLink: string | null }

const PAGINATION_SUFFIX = /^(.*\/)strana-(\d+)\/?$/

/** WP `link` fields are already site-relative after `rewriteAdminUrls`; this just normalizes any stray absolute origin and slashes. */
function normalizePath(link: string): string {
  const withoutOrigin = link.replace(/^https?:\/\/[^/]+/, '')
  const withLeadingSlash = withoutOrigin.startsWith('/') ? withoutOrigin : `/${withoutOrigin}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

/**
 * Inserts an entry into the path index, explicit first-wins on collision:
 * `buildLinkIndex` indexes pages, then categories, then posts, then
 * galleries, in that order, so an earlier kind always wins a path
 * collision over a later one (e.g. a content-less "link article" whose
 * *real* WP permalink happens to alias an existing page's path never
 * silently shadows that page). First-wins is a deliberate, disclosed
 * choice, not an accident of insertion order - logged so a genuine
 * collision in live data surfaces immediately instead of shadowing
 * content silently (T1 fast-follow backlog item).
 */
function setIndexEntry(byPath: Map<string, IndexEntry>, path: string, entry: IndexEntry): void {
  const existing = byPath.get(path)

  if (existing) {
    console.warn(
      `[wp/route] path collision at "${path}": keeping ${existing.kind} (id ${existing.id}), ignoring ${entry.kind} (id ${entry.id})`
    )
    return
  }

  byPath.set(path, entry)
}

/**
 * Builds a lightweight path -> entry index by fetching every page/post/
 * category/gallery (each independently cached/deduped by Next's fetch
 * cache, per their own tags) and keying on each entity's own `link` field -
 * the same "URL parity is automatic if we key routing on `link`" approach
 * `web/.gatsby/gatsby-node.ts`'s `createPages` used. Not memoized beyond
 * that per-entity fetch caching, so it always reflects the current
 * revalidation window rather than freezing at server-process start.
 *
 * Posts use `getPostRouteEntries()` rather than the full `getPosts()` -
 * classification only needs `id`/`link`/`categories` (plus enough ACF to
 * detect an external effective link), never `content`/`blocks`, so this
 * skips running the block pipeline over every post just to classify one
 * URL (T1 review finding 2). Galleries use the equivalent
 * `getGalleryRouteEntries()` for the same reason - classification only
 * needs `id`/`link`, never the full `acf.gallery` image array (which is
 * what pushed the full gallery listing fetch past Next's 2MB data-cache
 * entry limit).
 */
async function buildLinkIndex(): Promise<Map<string, IndexEntry>> {
  const [pages, posts, categories, galleries] = await Promise.all([
    getPages(),
    getPostRouteEntries(),
    getCategories(),
    getGalleryRouteEntries()
  ])

  const byPath = new Map<string, IndexEntry>()
  const defaultCategoryId = categories[0]?.id

  const galleriesPage = pages.find((page) => page.template === PageTemplateType.GALLERIES)
  const allGalleryLink = galleriesPage ? normalizePath(galleriesPage.link) : null

  for (const page of pages) {
    const basePath = normalizePath(page.link)
    setIndexEntry(byPath, basePath, { kind: 'page', id: page.id, templateType: page.template, basePath })
  }

  for (const category of categories) {
    const basePath = normalizePath(category.link)
    setIndexEntry(byPath, basePath, {
      kind: 'category',
      id: category.id,
      rootCategoryId: category.parent?.id ?? category.id,
      basePath
    })
  }

  for (const post of posts) {
    // A content-less "article" post's effective link can point at a
    // genuinely external URL (see resolvePostLink in entities/post.ts) -
    // those are never locally routable, matching the explicit skip in
    // web/.gatsby/gatsby-node.ts (`post.link.startsWith('http')`).
    if (!post.link || post.link.startsWith('http')) {
      continue
    }

    const categoryId = post.categories[0] ?? defaultCategoryId

    if (!categoryId) {
      continue
    }

    setIndexEntry(byPath, normalizePath(post.link), { kind: 'post', id: post.id, categoryId })
  }

  for (const gallery of galleries) {
    setIndexEntry(byPath, normalizePath(gallery.link), { kind: 'gallery', id: gallery.id, allGalleryLink })
  }

  return byPath
}

function toResolvedRoute(entry: IndexEntry, pageNumber: number): ResolvedRoute {
  return entry.kind === 'category' || entry.kind === 'page' ? { ...entry, pageNumber } : entry
}

type PaginatedEntry = Extract<IndexEntry, { kind: 'category' } | { kind: 'page' }>

/** The listings that serve `…/strana-N/` pages of their own content. */
function isPaginatedEntry(entry: IndexEntry): entry is PaginatedEntry {
  return entry.kind === 'category' || (entry.kind === 'page' && entry.templateType === PageTemplateType.GALLERIES)
}

export async function resolveRoute(slugSegments: string[]): Promise<ResolvedRoute | null> {
  const path = normalizePath(`/${slugSegments.join('/')}`)
  const index = await buildLinkIndex()

  const exact = index.get(path)
  if (exact) {
    return toResolvedRoute(exact, 1)
  }

  const paginationMatch = path.match(PAGINATION_SUFFIX)
  if (paginationMatch) {
    const [, basePath, pageNumberRaw] = paginationMatch
    const entry = index.get(basePath)

    if (entry && isPaginatedEntry(entry)) {
      return toResolvedRoute(entry, Number(pageNumberRaw))
    }
  }

  return null
}

/** Every statically known route, including all `strana-N` category pagination pages - for `generateStaticParams`. */
export async function getStaticRoutes(): Promise<{ path: string; route: ResolvedRoute }[]> {
  const index = await buildLinkIndex()
  const routes: { path: string; route: ResolvedRoute }[] = []

  for (const [path, entry] of index) {
    if (!isPaginatedEntry(entry)) {
      routes.push({ path, route: toResolvedRoute(entry, 1) })
      continue
    }

    const totalPages = await countListingPages(entry)

    for (let page = 1; page <= totalPages; page += 1) {
      const pagePath = page === 1 ? path : `${entry.basePath}strana-${page}/`
      routes.push({ path: pagePath, route: toResolvedRoute(entry, page) })
    }
  }

  return routes
}

/** How many `strana-N` pages a paginated listing has. */
async function countListingPages(entry: PaginatedEntry): Promise<number> {
  if (entry.kind === 'category') {
    // Count-only: the lean preview fetch reads totalCount from X-WP-Total
    // without pulling content/blocks through the normalization pipeline.
    const { totalCount } = await getPostPreviews(entry.id, { offset: 0, limit: 1 })
    return Math.max(Math.ceil(totalCount / CATEGORY_PAGE_SIZE), 1)
  }

  // Galleries index. `getGalleries()` applies the preview filter that decides
  // what the index actually shows, so its length is the count to paginate on.
  const galleries = await getGalleries()
  return Math.max(Math.ceil(galleries.length / GALLERY_PAGE_SIZE), 1)
}
