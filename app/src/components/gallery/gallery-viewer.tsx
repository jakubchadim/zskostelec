'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ZoomIn } from 'lucide-react'
import { WpImage } from '@/components/image/wp-image'
import type { WpMediaLike } from '@/lib/wp'
import { buildViewerSlides } from './build-slides'
import { PhotoViewer } from './photo-viewer'

const BATCH_SIZE = 24
const THUMBNAIL_SIZES = '(min-width: 55.125em) 25vw, (min-width: 41.75em) 33vw, 50vw'
/** `?foto=12` opens the 12th photo - shareable links to a single photo. */
const PARAM = 'foto'

type GalleryViewerProps = {
  images: WpMediaLike[]
}

function setPhotoParam(index: number | null) {
  const url = new URL(window.location.href)
  if (index === null) url.searchParams.delete(PARAM)
  else url.searchParams.set(PARAM, String(index + 1))
  window.history.replaceState(window.history.state, '', url)
}

/**
 * Thumbnail grid with a progressive "load more" reveal + the full-screen
 * photo viewer. The server still sends the full `images` array in one shot;
 * the grid just limits how much of it is in the DOM at a time, while the
 * viewer (and its film strip) can browse every photo.
 */
export function GalleryViewer({ images }: GalleryViewerProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const slides = useMemo(() => buildViewerSlides(images), [images])
  const visibleImages = images.slice(0, visibleCount)
  const hasMore = visibleCount < images.length

  const show = useCallback((index: number | null) => {
    setViewerIndex(index)
    setPhotoParam(index)
  }, [])

  // Arriving via a shared ?foto=N link opens that photo.
  useEffect(() => {
    const n = Number(new URL(window.location.href).searchParams.get(PARAM))
    if (!Number.isInteger(n) || n < 1 || n > images.length) return
    const timer = setTimeout(() => setViewerIndex(n - 1))
    return () => clearTimeout(timer)
  }, [images.length])

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4">
        {visibleImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => show(index)}
            aria-label={`Otevřít fotografii ${index + 1} z ${images.length}`}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border-[2.5px] border-ink bg-gray-3 pb-[100%] shadow-pop-sm transition-all duration-200 hover:-translate-y-1 hover:rotate-1 hover:shadow-pop focus-visible:outline-4 focus-visible:outline-sky"
          >
            <WpImage
              media={image}
              sizes={THUMBNAIL_SIZES}
              alt={image.alt_text || `Fotografie ${index + 1} z galerie`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span
              aria-hidden
              className="absolute right-2 bottom-2 grid size-9 scale-75 place-items-center rounded-full border-2 border-ink bg-sun opacity-0 shadow-pop-sm transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
            >
              <ZoomIn className="size-4" />
            </span>
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

      <PhotoViewer slides={slides} index={viewerIndex} onIndexChange={show} />
    </>
  )
}
