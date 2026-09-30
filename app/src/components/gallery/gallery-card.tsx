import Link from 'next/link'
import { getGalleryPreviewImages, type WpGallery } from '@/lib/wp'
import { WpImage } from '@/components/image/wp-image'
import { tiltAt } from '@/components/ui/accent'
import { cn } from '@/lib/utils'
import { formatGalleryDate } from './format-date'

const CARD_IMAGE_SIZES = '(min-width: 55.125em) 33vw, (min-width: 26em) 50vw, 100vw'

type GalleryCardProps = {
  gallery: WpGallery
  index?: number
}

/** One gallery on the index: a tilted polaroid with washi tape, straightening on hover. */
export function GalleryCard({ gallery, index = 0 }: GalleryCardProps) {
  const [preview] = getGalleryPreviewImages(gallery, 1)

  if (!preview) {
    return null
  }

  return (
    <Link
      href={gallery.link}
      className={cn(
        'group relative block rounded-md border-[2.5px] border-ink bg-paper p-2.5 pb-4 shadow-pop transition-all duration-300 hover:z-10 hover:scale-[1.03] hover:rotate-0 hover:shadow-pop-lg',
        tiltAt(index)
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rounded-sm opacity-80',
          index % 3 === 0 ? 'bg-sun rotate-2' : index % 3 === 1 ? 'bg-berry/70 -rotate-3' : 'bg-sky/70 rotate-1'
        )}
      />
      <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-gray-3">
        <WpImage
          media={preview}
          sizes={CARD_IMAGE_SIZES}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </span>
      <span className="block px-1 pt-3">
        <span className="block text-xs font-extrabold tracking-wide text-gray-6">{formatGalleryDate(gallery.date)}</span>
        <span className="mt-0.5 line-clamp-2 block font-display text-lg leading-snug font-bold" dangerouslySetInnerHTML={{ __html: gallery.title }} />
      </span>
    </Link>
  )
}
