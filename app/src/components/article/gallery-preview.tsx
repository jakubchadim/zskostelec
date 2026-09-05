import Link from 'next/link'
import { getGalleryPreviewImages, type WpGallery } from '@/lib/wp'
import { WpImage } from '@/components/image/wp-image'
import { cn } from '@/lib/utils'

type GalleryPreviewProps = {
  gallery: WpGallery
}

/**
 * Embedded gallery preview grid for a post body. Ports the legacy
 * `GalleryView` (web/src/templates/post.tsx), minus the lightbox: every
 * tile — including the last "more photos" tile — links straight to the
 * gallery's own page instead of opening a modal, since the lightbox
 * (yet-another-react-lightbox) is T5's Galleries task to wire up. Images
 * come from the already-ported `getGalleryPreviewImages` (preview + gallery
 * array, deduped, capped at 4 — the same computed field the legacy
 * Gatsby normalizer produced).
 */
export function GalleryPreview({ gallery }: GalleryPreviewProps) {
  const images = getGalleryPreviewImages(gallery)

  if (images.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {images.map((image, idx) => {
        const isLast = idx === images.length - 1

        return (
          <Link
            key={image.id}
            href={gallery.link}
            className="group relative block aspect-square overflow-hidden rounded-medium bg-gray-3 shadow-small hover:shadow-lift"
          >
            <WpImage
              media={image}
              sizes="(min-width: 41.75em) 25vw, 50vw"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-110',
                isLast && 'opacity-50 blur-[2px]'
              )}
            />
            {isLast && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg whitespace-nowrap opacity-80">
                Více fotografií
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
