import Link from 'next/link'
import { Camera } from 'lucide-react'
import type { WpGallery } from '@/lib/wp'
import { getGalleryPreviewImages } from '@/lib/wp/gallery-preview'
import { WpImage } from '@/components/image/wp-image'
import { tiltAt } from '@/components/ui/accent'
import { cn } from '@/lib/utils'

type GalleryPreviewProps = {
  gallery: WpGallery
}

/**
 * A post's embedded gallery as a row of tilted polaroids; the last one is a
 * "more photos" tile. Every tile links to the gallery page (lightbox lives
 * there).
 */
export function GalleryPreview({ gallery }: GalleryPreviewProps) {
  const images = getGalleryPreviewImages(gallery)
  const hasMore = getGalleryPreviewImages(gallery, Infinity).length > images.length

  if (images.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="mb-6 flex items-center gap-3 text-2xl">
        <span className="grid size-10 place-items-center rounded-xl border-2 border-ink bg-grass-tint">
          <Camera className="size-5" aria-hidden />
        </span>
        <span dangerouslySetInnerHTML={{ __html: gallery.title }} />
      </h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {images.map((image, idx) => {
          // A "more photos" teaser only when the gallery really holds more than shown.
          const isLast = idx === images.length - 1 && hasMore

          return (
            <Link
              key={image.id}
              href={gallery.link}
              aria-label={isLast ? 'Zobrazit všechny fotografie' : `Fotografie ${idx + 1}`}
              className={cn(
                'group relative block rounded-md border-[2.5px] border-ink bg-paper p-1.5 pb-5 shadow-pop transition-transform duration-300 hover:z-10 hover:scale-105 hover:rotate-0',
                tiltAt(idx)
              )}
            >
              <span className="relative block aspect-square overflow-hidden rounded-sm bg-gray-3">
                <WpImage
                  media={image}
                  sizes="(min-width: 41.75em) 25vw, 50vw"
                  className={cn('absolute inset-0 h-full w-full object-cover', isLast && 'scale-110 blur-[3px] brightness-75')}
                />
                {isLast && (
                  <span className="absolute inset-0 grid place-items-center p-2 text-center font-display text-lg font-bold text-white-1">
                    Další fotky →
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
