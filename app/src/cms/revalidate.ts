import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeDeleteHook,
  CollectionSlug,
  PayloadRequest,
  SanitizedCollectionConfig
} from 'payload'
import { schoolYearOf, schoolYearSlug, schoolYearsUntil } from '../components/gallery/school-year'

/*
 * Content changed in the admin -> refresh exactly the pages that show it.
 * Articles and galleries are prerendered at build and every page is cached
 * until revalidated (no time-based ISR); a refreshed page is rendered again on
 * its next visit - by crawlers too - costing Vercel CPU, ISR writes and a Neon
 * wake-up. So nothing flushes the whole site: each collection names its pages.
 *
 * Accepted staleness until the next deploy: the "more from this category" box
 * on other articles, listing pages past `LISTING_PAGES`, and images embedded in
 * an article's text whose media file was changed or deleted.
 * Skipped for bulk imports (`req.context.skipRevalidate`) and outside Next (scripts).
 */

type Doc = {
  id?: number | string
  slug?: string | null
  _status?: string | null
  parent?: unknown
  categories?: unknown[] | null
  tags?: unknown[] | null
  publishedAt?: string | null
}

/** Lists every article and gallery; cached until one of them changes. */
const SITEMAP = '/sitemap.xml'

/** Listing pages refreshed after a change: the first one plus a few `strana-N/`. */
const LISTING_PAGES = 5

export function listingPaths(basePath: string): string[] {
  return [basePath, ...Array.from({ length: LISTING_PAGES - 1 }, (_, i) => `${basePath}strana-${i + 2}/`)]
}

/** A relationship value: the id, or the populated document. */
const relId = (value: unknown) => (value && typeof value === 'object' ? (value as { id: unknown }).id : value)

const unique = <T>(values: (T | null | undefined)[]) => [...new Set(values.filter((v): v is T => v != null && v !== ''))]

/** A listing and its tag-filtered variants (`<listing>/stitek-<slug>/`) for the given tags. */
const withTags = (basePath: string, tagSlugs: string[]) => [basePath, ...tagSlugs.map((slug) => `${basePath}stitek-${slug}/`)].flatMap(listingPaths)

/** Slugs of the tags the changed documents carry (or carried). */
async function tagSlugs(docs: Doc[], req: PayloadRequest): Promise<string[]> {
  const ids = unique(docs.flatMap((d) => d.tags ?? []).map((ref) => Number(relId(ref))))
  if (!ids.length) return []
  const { docs: tags } = await req.payload.find({ collection: 'tags', where: { id: { in: ids } }, pagination: false, depth: 0, select: { slug: true }, req })
  return unique(tags.map((t) => t.slug))
}

async function allTagSlugs(req: PayloadRequest): Promise<string[]> {
  const { docs } = await req.payload.find({ collection: 'tags', pagination: false, depth: 0, select: { slug: true }, req })
  return unique(docs.map((t) => t.slug))
}

type CategoryRow = { id: number | string; slug?: string | null; parent?: unknown }

async function allCategories(req: PayloadRequest) {
  const { docs } = await req.payload.find({ collection: 'categories', pagination: false, depth: 0, select: { slug: true, parent: true }, req })
  const byId = new Map<string, CategoryRow>(docs.map((c) => [String(c.id), c]))
  const parentOf = (c: CategoryRow) => (c.parent != null ? byId.get(String(relId(c.parent))) : undefined)
  // Same URLs as `categoryLink` in lib/content (not imported: that module is server-only, the hooks also run in scripts).
  const linkOf = (c: CategoryRow) => {
    const parent = parentOf(c)
    return parent ? `/clanky/${parent.slug}/${c.slug}/` : `/clanky/${c.slug}/`
  }
  return { docs, byId, parentOf, linkOf }
}

/** Listings of the given categories and of their parents (a parent lists its children's articles too), with their tag filters. */
async function categoryPaths(refs: unknown[], tags: string[], req: PayloadRequest): Promise<string[]> {
  const ids = unique(refs.map((ref) => String(relId(ref) ?? '')))
  if (!ids.length) return []

  const { byId, parentOf, linkOf } = await allCategories(req)
  return ids.flatMap((id) => {
    const cat = byId.get(id)
    if (!cat) return []
    const parent = parentOf(cat)
    return [...withTags(linkOf(cat), tags), ...(parent ? withTags(linkOf(parent), tags) : [])]
  })
}

/** Every listing that shows tag chips: category listings, the galleries index and its school years. */
async function allListingBases(req: PayloadRequest): Promise<string[]> {
  const { docs, linkOf } = await allCategories(req)
  return [...docs.map(linkOf), '/fotogalerie/', ...schoolYearsUntil().map((year) => `/fotogalerie/${schoolYearSlug(year)}/`)]
}

/** A tag shows up only as a filter chip (and the name of its filtered listing) - never on articles or galleries. */
async function tagChangePaths(docs: Doc[], req: PayloadRequest): Promise<string[]> {
  const slugs = unique(docs.map((d) => d.slug))
  return (await allListingBases(req)).flatMap((base) => withTags(base, slugs))
}

/**
 * A category's name and link are on its articles (back link, "more from…"), on the
 * homepage, in the sub-category chips of its parent and siblings, and on its own
 * listings - under the old and the new slug.
 */
async function categoryChangePaths(docs: Doc[], req: PayloadRequest): Promise<string[]> {
  const ids = unique(docs.map((d) => d.id))
  const [{ docs: all, byId, linkOf }, tags, posts] = await Promise.all([
    allCategories(req),
    allTagSlugs(req),
    ids.length
      ? req.payload.find({ collection: 'posts', where: { categories: { in: ids } }, pagination: false, depth: 0, select: { slug: true }, req })
      : { docs: [] as { slug?: string | null }[] }
  ])
  const ownLinks = docs.map((d) => {
    const parent = d.parent != null ? byId.get(String(relId(d.parent))) : undefined
    return parent ? `/clanky/${parent.slug}/${d.slug}/` : `/clanky/${d.slug}/`
  })
  return [
    '/',
    ...unique(ownLinks).flatMap((link) => withTags(link, tags)),
    ...all.flatMap((c) => listingPaths(linkOf(c))),
    ...unique(posts.docs.map((p) => p.slug)).map((s) => `/${s}/`)
  ]
}

/** Pages showing the given media files: galleries (photos, cover), article attachments, documents, Guťák, staff photos. */
async function mediaPaths(docs: Doc[], req: PayloadRequest): Promise<string[]> {
  const ids = unique(docs.map((d) => d.id))
  if (!ids.length) return []

  const find = (collection: CollectionSlug, where: Parameters<PayloadRequest['payload']['find']>[0]['where']) =>
    req.payload.find({ collection, where, pagination: false, depth: 0, req }).then((res) => res.docs as Doc[])

  const [galleries, posts, documents, gutak, staff] = await Promise.all([
    find('galleries', { or: [{ photos: { in: ids } }, { cover: { in: ids } }] }),
    find('posts', { file: { in: ids } }),
    find('documents', { file: { in: ids } }),
    find('gutak', { or: [{ file: { in: ids } }, { cover: { in: ids } }] }),
    find('staff', { photo: { in: ids } })
  ])
  return [
    ...(galleries.length ? await pathsFor('galleries', galleries, req) : []),
    ...(posts.length ? await pathsFor('posts', posts, req) : []),
    ...(documents.length ? await pathsFor('documents', documents, req) : []),
    ...(gutak.length ? await pathsFor('gutak', gutak, req) : []),
    ...(staff.length ? await pathsFor('staff', staff, req) : [])
  ]
}

/** Paths showing the changed documents (the new and previous version). */
export async function pathsFor(collection: string, docs: Doc[], req: PayloadRequest): Promise<string[]> {
  const slugs = unique(docs.map((d) => d.slug))

  switch (collection) {
    case 'posts':
      return [
        '/',
        SITEMAP,
        ...slugs.map((s) => `/${s}/`),
        ...(await categoryPaths(docs.flatMap((d) => d.categories ?? []), await tagSlugs(docs, req), req))
      ]
    case 'galleries': {
      // Articles show their galleries under the text.
      const ids = unique(docs.map((d) => d.id))
      const posts = ids.length
        ? (await req.payload.find({ collection: 'posts', where: { galleries: { in: ids } }, pagination: false, depth: 0, select: { slug: true }, req })).docs
        : []
      // The school-year listings the gallery is (or was, before a date change) in, each also filtered by its tags.
      const years = unique(docs.map((d) => (d.publishedAt ? schoolYearOf(d.publishedAt) : null)))
      const tags = await tagSlugs(docs, req)
      return [
        '/',
        SITEMAP,
        ...withTags('/fotogalerie/', tags),
        ...years.flatMap((year) => withTags(`/fotogalerie/${schoolYearSlug(year)}/`, tags)),
        ...slugs.map((s) => `/fotogalerie/${s}/`),
        ...unique(posts.map((p) => p.slug)).map((s) => `/${s}/`)
      ]
    }
    case 'tags':
      return tagChangePaths(docs, req)
    case 'categories':
      return categoryChangePaths(docs, req)
    case 'media':
      return mediaPaths(docs, req)
    case 'documents':
    case 'document-categories':
      // The ŠVP page lists its chapters from the documents.
      return ['/dokumenty/', '/skolni-vzdelavaci-program/']
    case 'gutak':
      return ['/gutak/']
    case 'staff':
    case 'staff-positions':
    case 'staff-buildings':
      return ['/zamestnanci/', '/pracoviste/']
    default:
      return []
  }
}

/** Created but not yet used anywhere: a new tag (no article carries it) or an uploaded file (not in any gallery yet). */
const INVISIBLE_WHEN_CREATED = new Set(['tags', 'media'])

/** Drafts and autosaves don't change the public site - unless the document was or becomes published. */
function touchesPublicSite(collection: SanitizedCollectionConfig, docs: (Doc | undefined)[]): boolean {
  if (!collection.versions || !collection.versions.drafts) return true
  return docs.some((d) => d?._status === 'published')
}

async function revalidate(collection: SanitizedCollectionConfig, docs: (Doc | undefined)[], req: PayloadRequest, knownPaths?: string[]) {
  if (req.context.skipRevalidate || !touchesPublicSite(collection, docs)) return
  try {
    const paths =
      knownPaths ??
      (await pathsFor(
        collection.slug,
        docs.filter((d): d is Doc => Boolean(d)),
        req
      ))
    const { revalidatePath } = await import('next/cache')
    for (const path of new Set(paths)) revalidatePath(path)
  } catch (error) {
    // Outside a Next.js request (e.g. a CLI script) there is nothing to revalidate;
    // a failed lookup must not fail the save itself.
    console.warn(`[revalidate] ${collection.slug}:`, error)
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ collection, doc, previousDoc, operation, req }) => {
  if (operation === 'create' && INVISIBLE_WHEN_CREATED.has(collection.slug)) return doc
  await revalidate(collection, [doc, previousDoc], req)
  return doc
}

const pathsBeforeDeleteKey = (collection: string, id: unknown) => `revalidate:${collection}:${String(id)}`

/**
 * Deleting a document also removes the references to it (a gallery's photos, an
 * article's categories), so the pages that showed it must be found before the delete.
 */
export const rememberPathsBeforeDelete: CollectionBeforeDeleteHook = async ({ collection, id, req }) => {
  if (req.context.skipRevalidate) return
  try {
    const doc = (await req.payload.findByID({ collection: collection.slug as CollectionSlug, id, depth: 0, req })) as Doc
    req.context[pathsBeforeDeleteKey(collection.slug, id)] = await pathsFor(collection.slug, [doc], req)
  } catch (error) {
    console.warn(`[revalidate] ${collection.slug} before delete:`, error)
  }
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, id, req }) => {
  const known = req.context[pathsBeforeDeleteKey(collection.slug, id ?? doc?.id)] as string[] | undefined
  await revalidate(collection, [doc], req, known)
  return doc
}
