'use client'

import { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { WpImage } from '@/components/image/wp-image'
import type { WpMediaLike } from '@/lib/wp'
import { buildLightboxSlides } from './build-slides'

const BATCH_SIZE = 24
const THUMBNAIL_SIZES = '(min-width: 55.125em) 25vw, (min-width: 41.75em) 33vw, 50vw'

type GalleryViewerProps = {
  images: WpMediaLike[]
}

/**
 * Thumbnail grid with a progressive "load more" reveal + a click-to-open
 * lightbox. Replaces the legacy site's single unbounded grid (which rendered
 * every photo in the gallery at once) - the server still sends the full
 * `images` array in one shot, this just limits how much of it is in the DOM
 * at a time.
 */
export function GalleryViewer({ images }: GalleryViewerProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Built over the FULL gallery, not just the visible slice, so lightbox
  // prev/next can browse every photo even before "load more" is clicked.
  const slides = useMemo(() => buildLightboxSlides(images), [images])
  const visibleImages = images.slice(0, visibleCount)
  const hasMore = visibleCount < images.length

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4">
        {visibleImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`Otevřít fotografii ${index + 1} z ${images.length}`}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border-[2.5px] border-ink bg-gray-3 pb-[100%] shadow-pop-sm transition-all duration-200 hover:-translate-y-1 hover:rotate-1 hover:shadow-pop"
          >
            <WpImage
              media={image}
              sizes={THUMBNAIL_SIZES}
              alt={image.alt_text || `Fotografie ${index + 1} z galerie`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + BATCH_SIZE, images.length))}
            className="btn bg-sun text-lg"
          >
            Načíst další fotky ({images.length - visibleCount})
          </button>
        </div>
      )}

      <Lightbox
        open={lightboxIndex != null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={slides}
        plugins={[Zoom]}
      />
    </>
  )
}
