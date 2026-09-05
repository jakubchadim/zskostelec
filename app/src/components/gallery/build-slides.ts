import type { SlideImage } from 'yet-another-react-lightbox'
import { buildSrcSet } from '@/components/image/wp-image'
import type { WpMediaLike } from '@/lib/wp'

/**
 * Reshapes a gallery's images into `yet-another-react-lightbox` slides.
 *
 * Deliberately does NOT use `media.source_url` directly for the full-size
 * slide: ACF's `preview_size` setting for the gallery/preview image fields
 * (`admin/theme/inc/page-types/gallery.json`) means the raw top-level url an
 * ACF image field returns isn't guaranteed to be the true original - the
 * `media_details.sizes` map's largest named entry is the best resolution the
 * data layer actually gives us. Reuses the already-tested `buildSrcSet` (the
 * same logic `<WpImage>` uses internally) so the thumbnail and the lightbox
 * agree on what "largest available" means.
 */
export function buildLightboxSlides(images: WpMediaLike[]): SlideImage[] {
  return images.map((media) => {
    const variants = buildSrcSet(media)
    const largest = variants[variants.length - 1]

    return {
      src: largest?.source_url ?? media.source_url,
      width: largest?.width,
      height: largest?.height,
      alt: media.alt_text ?? '',
      srcSet:
        variants.length > 1
          ? variants.map((variant) => ({ src: variant.source_url, width: variant.width, height: variant.height ?? 0 }))
          : undefined
    }
  })
}
