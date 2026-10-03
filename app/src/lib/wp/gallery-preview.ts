import type { WpMediaLike } from './types'

/**
 * Galleries per page on the galleries index. Legacy rendered every gallery
 * on one page; with ~900 of them that's a huge document and a huge image
 * payload, so the index paginates on the same `strana-N` scheme as
 * categories. 12 divides evenly into the 1/2/3-column grid.
 */
export const GALLERY_PAGE_SIZE = 12

/** Ported from web/src/components/gallery/normalizer.ts: preview image first, then the gallery array, deduped, capped at `limit`. */
export function getGalleryPreviewImages(gallery: { acf: { preview: WpMediaLike | null; gallery: WpMediaLike[] } }, limit = 4): WpMediaLike[] {
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
