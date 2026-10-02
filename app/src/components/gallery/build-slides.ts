import { buildSrcSet } from '@/components/image/wp-image'
import type { WpMediaLike } from '@/lib/wp'

export type ViewerSlide = {
  /** Largest available variant - the fallback `src` of the big photo. */
  src: string
  /** `srcset` string over every known variant (undefined when there's only one). */
  srcSet?: string
  width?: number
  height?: number
  alt: string
  /** Smallest variant, for the film strip. */
  thumb: string
}

/**
 * Reshapes a gallery's images into slides for the photo viewer.
 *
 * Deliberately does NOT use `media.source_url` directly for the full-size
 * slide: ACF's `preview_size` setting for the gallery/preview image fields
 * (`admin/theme/inc/page-types/gallery.json`) means the raw top-level url an
 * ACF image field returns isn't guaranteed to be the true original - the
 * `media_details.sizes` map's largest named entry is the best resolution the
 * data layer actually gives us. Reuses the already-tested `buildSrcSet` (the
 * same logic `<WpImage>` uses internally) so the thumbnails and the viewer
 * agree on what "largest available" means.
 */
export function buildViewerSlides(images: WpMediaLike[]): ViewerSlide[] {
  return images.map((media) => {
    const variants = buildSrcSet(media)
    const largest = variants[variants.length - 1]
    // ~150-300px wide is plenty for a 4rem film-strip frame.
    const thumb = variants.find((variant) => variant.width >= 150) ?? largest

    return {
      src: largest?.source_url ?? media.source_url,
      width: largest?.width,
      height: largest?.height,
      alt: media.alt_text ?? '',
      srcSet: variants.length > 1 ? variants.map((variant) => `${variant.source_url} ${variant.width}w`).join(', ') : undefined,
      thumb: thumb?.source_url ?? media.source_url
    }
  })
}
