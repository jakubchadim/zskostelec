import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest, SanitizedCollectionConfig } from 'payload'
import { schoolYearOf, schoolYearSlug } from '../components/gallery/school-year'

/*
 * Content changed in the admin -> refresh the pages that show it. Pages are
 * cached until revalidated (no time-based ISR) and every refreshed page is
 * rendered again on its next visit - by crawlers too, and each render wakes
 * the Neon database. Flushing the whole site on every save (and on every
 * 2-second autosave of a draft) kept the database awake around the clock and
 * used up its compute quota, so each collection now names just its pages.
 *
 * Accepted staleness: the "more from this category" box on other articles and
 * listing pages past `LISTING_PAGES` keep their content until the next deploy.
 * Skipped for bulk imports (`req.context.skipRevalidate`) and outside Next (scripts).
 */

type Doc = { id?: number | string; slug?: string | null; _status?: string | null; categories?: unknown[] | null; publishedAt?: string | null }

/** Listing pages refreshed after a change: the first one plus a few `strana-N/`. */
const LISTING_PAGES = 5

export function listingPaths(basePath: string): string[] {
  return [basePath, ...Array.from({ length: LISTING_PAGES - 1 }, (_, i) => `${basePath}strana-${i + 2}/`)]
}

/** A relationship value: the id, or the populated document. */
const relId = (value: unknown) => (value && typeof value === 'object' ? (value as { id: unknown }).id : value)

const unique = <T>(values: (T | null | undefined)[]) => [...new Set(values.filter((v): v is T => v != null && v !== ''))]

/** Listings of the given categories and of their parents (a parent lists its children's articles too). */
async function categoryPaths(refs: unknown[], req: PayloadRequest): Promise<string[]> {
  const ids = unique(refs.map((ref) => String(relId(ref) ?? '')))
  if (!ids.length) return []

  const { docs } = await req.payload.find({ collection: 'categories', pagination: false, depth: 0, select: { slug: true, parent: true }, req })
  const byId = new Map(docs.map((c) => [String(c.id), c]))
  const parentOf = (c: (typeof docs)[number]) => (c.parent != null ? byId.get(String(relId(c.parent))) : undefined)
  // Same URLs as `categoryLink` in lib/content (not imported: that module is server-only, the hooks also run in scripts).
  const linkOf = (c: (typeof docs)[number]) => {
    const parent = parentOf(c)
    return parent ? `/clanky/${parent.slug}/${c.slug}/` : `/clanky/${c.slug}/`
  }

  return ids.flatMap((id) => {
    const cat = byId.get(id)
    if (!cat) return []
    const parent = parentOf(cat)
    return [...listingPaths(linkOf(cat)), ...(parent ? listingPaths(linkOf(parent)) : [])]
  })
}

/** Paths showing the changed documents (the new and previous version), or 'all' for the whole site. */
export async function pathsFor(collection: string, docs: Doc[], req: PayloadRequest): Promise<string[] | 'all'> {
  const slugs = unique(docs.map((d) => d.slug))

  switch (collection) {
    case 'posts':
      return ['/', ...slugs.map((s) => `/${s}/`), ...(await categoryPaths(docs.flatMap((d) => d.categories ?? []), req))]
    case 'galleries': {
      // Articles show their galleries under the text.
      const ids = unique(docs.map((d) => d.id))
      const posts = ids.length
        ? (await req.payload.find({ collection: 'posts', where: { galleries: { in: ids } }, pagination: false, depth: 0, select: { slug: true }, req })).docs
        : []
      // The school-year listings the gallery is (or was, before a date change) in.
      const years = unique(docs.map((d) => (d.publishedAt ? schoolYearOf(d.publishedAt) : null)))
      return [
        '/',
        ...listingPaths('/fotogalerie/'),
        ...years.flatMap((year) => listingPaths(`/fotogalerie/${schoolYearSlug(year)}/`)),
        ...slugs.map((s) => `/fotogalerie/${s}/`),
        ...unique(posts.map((p) => p.slug)).map((s) => `/${s}/`)
      ]
    }
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
      // Categories (their names and links are on every article), media (a deleted file can be anywhere).
      return 'all'
  }
}

/** Drafts and autosaves don't change the public site - unless the document was or becomes published. */
function touchesPublicSite(collection: SanitizedCollectionConfig, docs: (Doc | undefined)[]): boolean {
  if (!collection.versions || !collection.versions.drafts) return true
  return docs.some((d) => d?._status === 'published')
}

async function revalidate(collection: SanitizedCollectionConfig, docs: (Doc | undefined)[], req: PayloadRequest) {
  if (req.context.skipRevalidate || !touchesPublicSite(collection, docs)) return
  try {
    const paths = await pathsFor(
      collection.slug,
      docs.filter((d): d is Doc => Boolean(d)),
      req
    )
    const { revalidatePath } = await import('next/cache')
    if (paths === 'all') revalidatePath('/', 'layout')
    else for (const path of new Set(paths)) revalidatePath(path)
  } catch (error) {
    // Outside a Next.js request (e.g. a CLI script) there is nothing to revalidate;
    // a failed lookup must not fail the save itself.
    console.warn(`[revalidate] ${collection.slug}:`, error)
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ collection, doc, previousDoc, req }) => {
  await revalidate(collection, [doc, previousDoc], req)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  await revalidate(collection, [doc], req)
  return doc
}
