import 'server-only'
import { cache } from 'react'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
// Runtime values only from dependency-free modules: the `@/lib/wp` barrel pulls in the old
// Gutenberg normalizers (jsdom), which crash on Vercel's Node (ERR_REQUIRE_ESM).
import { asId } from '@/lib/wp/types'
import { PageTemplateType } from '@/lib/wp/page-template'
import { resolvePostLink } from '@/lib/wp/post-link'
import { GALLERY_PAGE_SIZE } from '@/lib/wp/gallery-preview'
import type {
  ID,
  PostPreview,
  ResolvedRoute,
  WpCategory,
  WpDocument,
  WpDocumentCategory,
  WpGallery,
  WpMediaLike,
  WpPage,
  WpPost
} from '@/lib/wp'
import type { Where } from 'payload'
import type { Category, Gallery, Media, Post } from '@/payload-types'
import type { WpBuilding, WpEmployee, WpGutak, WpPosition } from '@/lib/wp'
import { cms } from './payload'
import { mediaUrl, toMediaLike } from './media'

/*
 * Content for the public site from the CMS (Payload), in the same shapes
 * the templates used to get from WordPress (`@/lib/wp` types), so the
 * templates and components stay as they are. URLs are unchanged:
 *   /<post-slug>/                       article
 *   /clanky/<parent>/<category>/        category (+ strana-N/)
 *   /fotogalerie/<slug>/                gallery
 *   /, /fotogalerie/, /dokumenty/, /zamestnanci/, /gutak/, /pracoviste/   fixed pages
 */

export { PageTemplateType } from '@/lib/wp/page-template'
export { getGalleryPreviewImages, GALLERY_PAGE_SIZE } from '@/lib/wp/gallery-preview'
export { CATEGORY_PAGE_SIZE } from '@/lib/wp/post-link'
export type { ResolvedRoute, WpCategory, WpGallery, WpPage, WpPost, PostPreview } from '@/lib/wp'


const PUBLISHED = { _status: { equals: 'published' } } as const

// ------------------------------------------------------------------ pages

type FixedPage = { slug: string; path: string; title: string; template: PageTemplateType }

/** The pages that used to be WP pages with a special template; their content now lives in code. */
const FIXED_PAGES: FixedPage[] = [
  { slug: 'uvodni-strana', path: '/', title: 'Úvodní strana', template: PageTemplateType.HOME },
  { slug: 'fotogalerie', path: '/fotogalerie/', title: 'Fotogalerie', template: PageTemplateType.GALLERIES },
  { slug: 'dokumenty', path: '/dokumenty/', title: 'Dokumenty', template: PageTemplateType.DOCUMENTS },
  { slug: 'zamestnanci', path: '/zamestnanci/', title: 'Zaměstnanci', template: PageTemplateType.EMPLOYEES },
  { slug: 'gutak', path: '/gutak/', title: 'Školní časopis Guťák', template: PageTemplateType.GUTAKY },
  { slug: 'pracoviste', path: '/pracoviste/', title: 'Pracoviště školy', template: PageTemplateType.DEFAULT }
]

/** Homepage settings that used to be ACF fields on the WP home page. */
const HOME_ACF = {
  mainCategory: { slug: 'upozorneni' },
  additionalCategoryFirst: { slug: 'aktuality' },
  additionalCategorySecond: { slug: 'uspechy-zaku' },
  sectionLink: { url: '/pracoviste/', title: 'Pracoviště', target: '' }
}

function fixedPage(page: FixedPage, mainPost: ID | null = null): WpPage {
  const isHome = page.template === PageTemplateType.HOME
  return {
    id: asId(`page:${page.slug}`),
    slug: page.slug,
    link: page.path,
    title: page.title,
    content: '',
    blocks: [],
    template: page.template,
    acf: {
      mainPost,
      mainCategory: isHome ? HOME_ACF.mainCategory : null,
      additionalCategoryFirst: isHome ? HOME_ACF.additionalCategoryFirst : null,
      additionalCategorySecond: isHome ? HOME_ACF.additionalCategorySecond : null,
      fastMenu: null,
      fastMenuSecond: null,
      sectionLink: isHome ? HOME_ACF.sectionLink : null
    }
  } as unknown as WpPage
}

export async function getPageById(id: ID): Promise<WpPage | null> {
  const page = FIXED_PAGES.find((p) => `page:${p.slug}` === id)
  if (!page) return null
  if (page.template !== PageTemplateType.HOME) return fixedPage(page)
  // Main homepage article: the newest one marked "pinned" in the admin.
  const payload = await cms()
  const pinned = await payload.find({
    collection: 'posts',
    where: { and: [PUBLISHED, { pinned: { equals: true } }] },
    sort: '-publishedAt',
    limit: 1,
    depth: 0,
    select: { pinned: true }
  })
  return fixedPage(page, pinned.docs[0] ? asId(String(pinned.docs[0].id)) : null)
}

// ------------------------------------------------------------------ categories

const allCategories = cache(async (): Promise<Category[]> => {
  const payload = await cms()
  const res = await payload.find({ collection: 'categories', pagination: false, depth: 0, sort: 'title' })
  return res.docs
})

function categoryLink(cat: Category, all: Category[]): string {
  const parent = typeof cat.parent === 'number' ? all.find((c) => c.id === cat.parent) : cat.parent
  return parent ? `/clanky/${parent.slug}/${cat.slug}/` : `/clanky/${cat.slug}/`
}

function toCategory(cat: Category, all: Category[]): WpCategory {
  const parent = typeof cat.parent === 'number' ? all.find((c) => c.id === cat.parent) : cat.parent
  return {
    id: asId(String(cat.id)),
    slug: cat.slug ?? '',
    name: cat.title,
    link: categoryLink(cat, all),
    parent: parent ? { id: asId(String(parent.id)), name: parent.title, link: categoryLink(parent, all) } : null
  }
}

export async function getCategories(): Promise<WpCategory[]> {
  const all = await allCategories()
  return all.map((cat) => toCategory(cat, all))
}

export async function getCategoryById(id: ID): Promise<WpCategory | null> {
  const all = await allCategories()
  const cat = all.find((c) => String(c.id) === String(id))
  return cat ? toCategory(cat, all) : null
}

export async function getCategoryBySlug(slug: string): Promise<WpCategory | null> {
  const all = await allCategories()
  const cat = all.find((c) => c.slug === slug)
  return cat ? toCategory(cat, all) : null
}

/** A category and its sub-categories (a parent's listing shows its children's articles too, like WP). */
async function categoryWithChildren(id: ID): Promise<number[]> {
  const all = await allCategories()
  const root = Number(id)
  return [root, ...all.filter((c) => (typeof c.parent === 'number' ? c.parent : c.parent?.id) === root).map((c) => c.id)]
}

// ------------------------------------------------------------------ posts

function lexicalToHtml(content: Post['content']): string {
  if (!content) return ''
  try {
    return convertLexicalToHTML({ data: content as unknown as SerializedEditorState, disableContainer: true })
  } catch {
    return ''
  }
}

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function excerptOf(post: Post, html: string): string {
  if (post.excerpt?.trim()) return post.excerpt.trim()
  const text = plain(html)
  return text.length > 220 ? `${text.slice(0, 220).replace(/\s+\S*$/, '')}…` : text
}

function postLink(post: Post, html: string): string | null {
  return resolvePostLink({
    hasAcf: true,
    hasContent: Boolean(plain(html)),
    permalink: `/${post.slug}/`,
    acfLink: post.link?.trim() || null,
    fileUrl: mediaUrl(post.file as Media | number | null)
  })
}

function toGallery(g: Gallery): WpGallery {
  const photos = (g.photos ?? []).map((p) => toMediaLike(p as Media | number)).filter((m): m is WpMediaLike => m != null)
  return {
    id: asId(String(g.id)),
    slug: g.slug ?? '',
    link: `/fotogalerie/${g.slug}/`,
    title: g.title,
    date: g.publishedAt,
    acf: { preview: toMediaLike(g.cover as Media | number | null) ?? photos[0] ?? null, gallery: photos }
  } as unknown as WpGallery
}

export async function getPostById(id: ID): Promise<WpPost | null> {
  const payload = await cms()
  try {
    const post = await payload.findByID({ collection: 'posts', id: Number(id), depth: 2 })
    if (!post || post._status !== 'published') return null
    const html = lexicalToHtml(post.content)
    const galleries = (post.galleries ?? []).filter((g): g is Gallery => typeof g === 'object' && g?._status === 'published')
    return {
      id: asId(String(post.id)),
      slug: post.slug ?? '',
      link: postLink(post, html),
      title: post.title,
      excerpt: excerptOf(post, html),
      content: html,
      date: post.publishedAt,
      blocks: [],
      categories: (post.categories ?? []).map((c) => asId(String(typeof c === 'number' ? c : c.id))),
      acf: {
        link: post.link?.trim() || null,
        file: mediaUrl(post.file as Media | number | null),
        gallery: galleries.map((g) => asId(String(g.id)))
      },
      galleries: galleries.map(toGallery)
    } as unknown as WpPost
  } catch {
    return null
  }
}

function toPreview(post: Post): PostPreview {
  const html = lexicalToHtml(post.content)
  return {
    id: asId(String(post.id)),
    title: post.title,
    excerpt: excerptOf(post, html),
    date: post.publishedAt,
    link: postLink(post, html)
  } as unknown as PostPreview
}

export async function getPostPreviews(
  categoryId: ID,
  opts: { offset?: number; limit: number; excludePostId?: ID }
): Promise<{ posts: PostPreview[]; totalCount: number }> {
  const payload = await cms()
  const ids = await categoryWithChildren(categoryId)
  const offset = opts.offset ?? 0
  const where: Where = {
    and: [
      PUBLISHED,
      { categories: { in: ids } },
      ...(opts.excludePostId ? [{ id: { not_equals: Number(opts.excludePostId) } }] : [])
    ]
  }
  // Payload paginates by page; offsets here are always multiples of the limit.
  const res = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: opts.limit,
    page: Math.floor(offset / opts.limit) + 1,
    depth: 1,
    select: { title: true, slug: true, excerpt: true, content: true, publishedAt: true, link: true, file: true }
  })
  return { posts: res.docs.map((doc) => toPreview(doc as Post)), totalCount: res.totalDocs }
}

/** Newest articles of a category for the homepage blocks (only id/title/excerpt/date/link are read there). */
export async function getPostsByCategory(categorySlug: string, opts: { limit: number; excludePostId?: ID }): Promise<WpPost[]> {
  const category = await getCategoryBySlug(categorySlug)
  if (!category) return []
  const { posts } = await getPostPreviews(category.id, opts)
  return posts.map(
    (p) =>
      ({ ...p, slug: '', content: '', blocks: [], categories: [category.id], acf: { link: null, file: null, gallery: [] } }) as unknown as WpPost
  )
}

// ------------------------------------------------------------------ galleries

export async function getGalleryById(id: ID): Promise<WpGallery | null> {
  const payload = await cms()
  try {
    const g = await payload.findByID({ collection: 'galleries', id: Number(id), depth: 1 })
    return g && g._status === 'published' ? toGallery(g) : null
  } catch {
    return null
  }
}

/** One page of the galleries index (newest first) + how many pages there are. */
export async function getGalleryPage(page: number): Promise<{ galleries: WpGallery[]; totalPages: number; totalCount: number }> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'galleries',
    where: PUBLISHED,
    sort: '-publishedAt',
    limit: GALLERY_PAGE_SIZE,
    page,
    depth: 1,
    // Only the first few photos are needed for the card's photo stack.
    select: { title: true, slug: true, publishedAt: true, cover: true, photos: true }
  })
  return { galleries: res.docs.map((g) => toGallery(g as Gallery)), totalPages: Math.max(res.totalPages, 1), totalCount: res.totalDocs }
}

export async function getLatestGalleries(limit: number): Promise<WpGallery[]> {
  const payload = await cms()
  const res = await payload.find({ collection: 'galleries', where: PUBLISHED, sort: '-publishedAt', limit, depth: 1 })
  return res.docs.map(toGallery)
}

// ------------------------------------------------------------------ documents

export async function getDocuments(): Promise<WpDocument[]> {
  const payload = await cms()
  const res = await payload.find({ collection: 'documents', pagination: false, depth: 1, sort: 'title' })
  return res.docs.map((d) => {
    const file = typeof d.file === 'object' ? d.file : null
    return {
      id: asId(String(d.id)),
      title: d.title,
      categoryIds: [asId(String(typeof d.category === 'number' ? d.category : d.category.id))],
      filename: file?.filename ?? '',
      fileUrl: file?.url ?? ''
    }
  })
}

export async function getDocumentCategories(): Promise<WpDocumentCategory[]> {
  const payload = await cms()
  const res = await payload.find({ collection: 'document-categories', pagination: false, depth: 0, sort: 'order' })
  return res.docs.map((c) => ({ id: asId(String(c.id)), name: c.title }))
}

// ------------------------------------------------------------------ routing

const pageRoute = (page: FixedPage, pageNumber = 1, basePath = page.path): ResolvedRoute => ({
  kind: 'page',
  id: asId(`page:${page.slug}`),
  templateType: page.template,
  pageNumber,
  basePath
})

/** Catch-all categories: only used as an article's "home" when it has no more specific one. */
const GENERAL_CATEGORY_SLUGS = ['aktuality']

/**
 * The category an article belongs to for its back link and "more from…" box.
 * Many notices are in both Upozornění and Aktuality (WP lists Aktuality first),
 * so the specific category wins over the general one.
 */
async function primaryCategoryId(categories: (number | Category)[]): Promise<number | string> {
  const all = await allCategories()
  const cats = categories
    .map((c) => (typeof c === 'number' ? all.find((x) => x.id === c) : c))
    .filter((c): c is Category => Boolean(c))
  const specific = cats.find((c) => !GENERAL_CATEGORY_SLUGS.includes(c.slug ?? ''))
  return (specific ?? cats[0])?.id ?? ''
}

/** URL path segments -> what to render (null = 404). */
export async function resolveRoute(segments: string[]): Promise<ResolvedRoute | null> {
  const path = `/${segments.map(decodeURIComponent).join('/')}${segments.length ? '/' : ''}`

  // strana-N pagination (galleries index, categories)
  const pageMatch = path.match(/^(.*\/)strana-(\d+)\/$/)
  const basePath = pageMatch ? pageMatch[1] : path
  const pageNumber = pageMatch ? Number(pageMatch[2]) : 1
  if (pageMatch && pageNumber < 2) return null

  const fixed = FIXED_PAGES.find((p) => p.path === basePath)
  if (fixed) {
    if (pageNumber > 1 && fixed.template !== PageTemplateType.GALLERIES) return null
    return pageRoute(fixed, pageNumber, basePath)
  }

  const parts = basePath.split('/').filter(Boolean)

  if (parts[0] === 'clanky' && parts.length >= 2 && parts.length <= 3) {
    const all = await allCategories()
    const cat = all.find((c) => categoryLink(c, all) === basePath)
    if (!cat) return null
    const parentId = typeof cat.parent === 'number' ? cat.parent : cat.parent?.id
    return { kind: 'category', id: asId(String(cat.id)), rootCategoryId: asId(String(parentId ?? cat.id)), pageNumber, basePath }
  }

  if (pageMatch) return null
  const payload = await cms()

  if (parts[0] === 'fotogalerie' && parts.length === 2) {
    const res = await payload.find({ collection: 'galleries', where: { and: [PUBLISHED, { slug: { equals: parts[1] } }] }, limit: 1, depth: 0, select: { slug: true } })
    return res.docs[0] ? { kind: 'gallery', id: asId(String(res.docs[0].id)), allGalleryLink: '/fotogalerie/' } : null
  }

  if (parts.length === 1) {
    const res = await payload.find({
      collection: 'posts',
      where: { and: [PUBLISHED, { slug: { equals: parts[0] } }] },
      limit: 1,
      depth: 0,
      select: { id: true, categories: true }
    })
    const post = res.docs[0]
    if (!post) return null
    return { kind: 'post', id: asId(String(post.id)), categoryId: asId(String(await primaryCategoryId(post.categories ?? []))) }
  }

  return null
}

/**
 * Paths prerendered at build: the fixed pages, category listings and the
 * first galleries pages. Articles and galleries render on first visit
 * (ISR) - prerendering ~5 000 of them would make every build slow.
 */
export async function getStaticRoutes(): Promise<{ path: string }[]> {
  const all = await allCategories()
  return [...FIXED_PAGES.map((p) => ({ path: p.path })), ...all.map((c) => ({ path: categoryLink(c, all) }))]
}

/** Every public URL, for sitemap.xml. */
export async function getSitemapRoutes(): Promise<{ path: string; lastModified?: string }[]> {
  const payload = await cms()
  const [posts, galleries] = await Promise.all([
    payload.find({ collection: 'posts', where: PUBLISHED, pagination: false, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'galleries', where: PUBLISHED, pagination: false, depth: 0, select: { slug: true, updatedAt: true } })
  ])
  return [
    ...(await getStaticRoutes()),
    ...posts.docs.map((p) => ({ path: `/${p.slug}/`, lastModified: p.updatedAt })),
    ...galleries.docs.map((g) => ({ path: `/fotogalerie/${g.slug}/`, lastModified: g.updatedAt }))
  ]
}

// ------------------------------------------------------------------ staff & Guťák

const relIds = (rels: (number | { id: number })[] | null | undefined): ID[] =>
  (rels ?? []).map((rel) => asId(String(typeof rel === 'number' ? rel : rel.id)))

/** Sorted by priority (vedení školy first), then name. */
export const getEmployees = cache(async (): Promise<WpEmployee[]> => {
  const payload = await cms()
  const res = await payload.find({ collection: 'staff', pagination: false, depth: 1 })
  return res.docs
    .map((s) => ({
      id: asId(String(s.id)),
      name: s.name,
      positionIds: relIds(s.positions),
      buildingIds: relIds(s.buildings),
      priority: s.priority,
      email: s.email ?? '',
      phone: s.phone ?? '',
      photo: toMediaLike(s.photo as Media | number | null)
    }))
    .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name, 'cs'))
})

export const getBuildings = cache(async (): Promise<WpBuilding[]> => {
  const payload = await cms()
  const res = await payload.find({ collection: 'staff-buildings', pagination: false, depth: 0, sort: 'id' })
  return res.docs.map((b) => ({ id: asId(String(b.id)), name: b.name, workplace: b.workplace ?? null }))
})

export const getPositions = cache(async (): Promise<WpPosition[]> => {
  const payload = await cms()
  const res = await payload.find({ collection: 'staff-positions', pagination: false, depth: 0, sort: 'id' })
  return res.docs.map((p) => ({ id: asId(String(p.id)), name: p.name }))
})

export async function getGutaky(): Promise<WpGutak[]> {
  const payload = await cms()
  const res = await payload.find({ collection: 'gutak', pagination: false, depth: 1, sort: '-publishedAt' })
  return res.docs.map((g) => ({
    id: asId(String(g.id)),
    title: g.title,
    fileUrl: mediaUrl(g.file as Media | number) ?? '',
    preview: toMediaLike(g.cover as Media | number | null)
  }))
}
