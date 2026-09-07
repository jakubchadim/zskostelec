import { wpFetch, wpFetchAllPages, wpFetchOrNull, WP_CACHE_TAGS } from '../client'
import { getUrlRewriteConfig } from '../env'
import { rewriteAdminUrls } from '../blocks/urls'
import { asId, type DateString, type ID, type Nullable, type RawHTML, type WpMediaLike } from '../types'
import { normalizeAcfImage } from './media'

type RawWpGallery = {
  id: number
  slug: string
  link: string
  title: { rendered: string }
  date: string
  acf?: { preview?: unknown; gallery?: unknown[] | false | null }
}

export type WpGalleryAcf = {
  preview: Nullable<WpMediaLike>
  gallery: WpMediaLike[]
}

export type WpGallery = {
  id: ID
  slug: string
  link: string
  title: RawHTML
  date: DateString
  acf: WpGalleryAcf
}

const GALLERY_FIELDS = ['id', 'slug', 'link', 'title', 'date', 'acf']
/** Trims the (potentially huge) `acf.gallery` image repeater - for listing fetches that only ever read `acf.preview`. */
const GALLERY_LISTING_FIELDS = ['id', 'slug', 'link', 'title', 'date', 'acf.preview']
const GALLERY_ROUTE_FIELDS = ['id', 'link']

export function normalizeGallery(raw: RawWpGallery): WpGallery {
  // Only rewrite the non-media fields (link/slug/title/date) - image URLs
  // inside `acf.preview`/`acf.gallery` must stay absolute: media isn't
  // served by this site yet (it's still on the WP admin origin until T10
  // migrates it to R2), so relative-izing them would break every image.
  const rewritten = rewriteAdminUrls(
    { id: raw.id, slug: raw.slug, link: raw.link, title: raw.title, date: raw.date },
    getUrlRewriteConfig()
  )

  // acf-to-rest-api serializes an empty ACF repeater/gallery field as the
  // boolean `false`, not `null`/`[]` (confirmed against live data - ~6 of
  // 900 galleries on this WP install), so `?? []` alone doesn't catch it.
  const rawGalleryImages = raw.acf?.gallery
  const galleryImages = (Array.isArray(rawGalleryImages) ? rawGalleryImages : [])
    .map((image) => normalizeAcfImage(image))
    .filter((image): image is WpMediaLike => image != null)

  const preview = normalizeAcfImage(raw.acf?.preview) ?? galleryImages[0] ?? null

  return {
    id: asId(rewritten.id),
    slug: rewritten.slug,
    link: rewritten.link,
    title: rewritten.title.rendered as RawHTML,
    date: rewritten.date as DateString,
    acf: { preview, gallery: galleryImages }
  }
}

export async function getGalleryById(id: ID): Promise<WpGallery | null> {
  const raw = await wpFetchOrNull<RawWpGallery>(`wp/v2/gallery/${id}`, {
    fields: GALLERY_FIELDS,
    tags: [WP_CACHE_TAGS.gallery, `gallery-${id}`]
  })

  return raw ? normalizeGallery(raw) : null
}

export async function getGalleryBySlug(slug: string): Promise<WpGallery | null> {
  const results = await wpFetch<RawWpGallery[]>('wp/v2/gallery', {
    fields: GALLERY_FIELDS,
    params: { slug },
    tags: [WP_CACHE_TAGS.gallery, `gallery-${slug}`]
  })

  const [raw] = results
  return raw ? normalizeGallery(raw) : null
}

/**
 * All galleries with a preview image set - matches the Gatsby-era
 * `allGalleryQuery` filter (`acf.preview.link != null`). A gallery without
 * a preview never got a routable page in production (see git history:
 * "Fix empty gallery", "Fix post with null gallery preview"), so this is
 * the right default for the galleries index / static route generation.
 * Use `getGalleryById`/`getGalleryBySlug` directly when a gallery is
 * needed regardless of whether it has a preview (e.g. resolving a post's
 * embedded gallery relation, which already tolerates preview-less
 * galleries by filtering them out at render time).
 */
export async function getGalleries(): Promise<WpGallery[]> {
  // Listing-only: the galleries index (`GalleryCard`) and `hasPreview` only
  // ever read `acf.preview`, never the full `acf.gallery` image array - and
  // that array is what was pushing this fetch (all galleries, all pages)
  // past Next's 2MB-per-entry data-cache limit. `getGalleryById`/
  // `getGalleryBySlug` keep the full `GALLERY_FIELDS` for the single-gallery
  // detail page, which does need every image.
  const raw = await wpFetchAllPages<RawWpGallery>('wp/v2/gallery', {
    fields: GALLERY_LISTING_FIELDS,
    tags: [WP_CACHE_TAGS.gallery]
  })

  return raw.map(normalizeGallery).filter((gallery) => gallery.acf.preview != null)
}

export type GalleryRouteEntry = { id: ID; link: string }

type RawWpGalleryRouteEntry = { id: number; link: string }

/**
 * Cheap listing for route classification only, same rationale as
 * `getPostRouteEntries` in `entities/post.ts`: `buildLinkIndex` only keys on
 * `id`/`link` and runs on every route resolution (every page render), so
 * pulling the full `acf` gallery/image data there was both needless and the
 * main source of the 2MB data-cache overflow warnings.
 */
export async function getGalleryRouteEntries(): Promise<GalleryRouteEntry[]> {
  const raw = await wpFetchAllPages<RawWpGalleryRouteEntry>('wp/v2/gallery', {
    fields: GALLERY_ROUTE_FIELDS,
    tags: [WP_CACHE_TAGS.gallery]
  })

  return raw.map((entry) => ({
    id: asId(entry.id),
    link: rewriteAdminUrls({ link: entry.link }, getUrlRewriteConfig()).link
  }))
}

/** Ported from web/src/components/gallery/normalizer.ts: preview image first, then the gallery array, deduped, capped at `limit`. */
export function getGalleryPreviewImages(gallery: WpGallery, limit = 4): WpMediaLike[] {
  const candidates = [gallery.acf.preview, ...gallery.acf.gallery].filter(
    (image): image is WpMediaLike => image != null
  )

  const seen = new Set<string>()
  const unique: WpMediaLike[] = []

  for (const image of candidates) {
    if (!seen.has(image.id)) {
      seen.add(image.id)
      unique.push(image)
    }
  }

  return unique.slice(0, limit)
}
