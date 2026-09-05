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
  acf?: { preview?: unknown; gallery?: unknown[] | null }
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

export function normalizeGallery(raw: RawWpGallery): WpGallery {
  // Only rewrite the non-media fields (link/slug/title/date) - image URLs
  // inside `acf.preview`/`acf.gallery` must stay absolute: media isn't
  // served by this site yet (it's still on the WP admin origin until T10
  // migrates it to R2), so relative-izing them would break every image.
  const rewritten = rewriteAdminUrls(
    { id: raw.id, slug: raw.slug, link: raw.link, title: raw.title, date: raw.date },
    getUrlRewriteConfig()
  )

  const galleryImages = (raw.acf?.gallery ?? [])
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
  const raw = await wpFetchAllPages<RawWpGallery>('wp/v2/gallery', {
    fields: GALLERY_FIELDS,
    tags: [WP_CACHE_TAGS.gallery]
  })

  return raw.map(normalizeGallery).filter((gallery) => gallery.acf.preview != null)
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
