import Link from 'next/link'
import { ArrowRight, Camera } from 'lucide-react'
import { getGalleryPreviewImages, type WpGallery } from '@/lib/wp'
import { WpImage } from '@/components/image/wp-image'
import { accentAt } from '@/components/ui/accent'
import { cn } from '@/lib/utils'
import { formatGalleryDate } from './format-date'

const CARD_IMAGE_SIZES = '(min-width: 55.125em) 33vw, (min-width: 26em) 50vw, 100vw'

type GalleryCardProps = {
  gallery: WpGallery
  index?: number
}

/**
 * One gallery on the index, drawn as a little stack of photos: the cover
 * on top, two coloured "photos" peeking out underneath. At rest it's tidy;
 * on hover/focus the stack fans out, the cover zooms and an arrow slides in.
 */
export function GalleryCard({ gallery, index = 0 }: GalleryCardProps) {
  const [preview] = getGalleryPreviewImages(gallery, 1)

  if (!preview) {
    return null
  }

  const back = accentAt(index + 1)
  const middle = accentAt(index + 3)

  return (
    <Link href={gallery.link} className="group relative block pt-3 outline-none">
      {/* The stack behind the cover */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-4 top-0 bottom-6 rounded-[1.5rem] border-[2.5px] border-ink transition-transform duration-300 ease-out group-hover:-translate-x-3 group-hover:-rotate-6 group-focus-visible:-rotate-6',
          back.tint
        )}
      />
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-2 top-1.5 bottom-4 rounded-[1.5rem] border-[2.5px] border-ink transition-transform duration-300 ease-out group-hover:translate-x-3 group-hover:rotate-4 group-focus-visible:rotate-4',
          middle.tint
        )}
      />

      <span className="sticker relative block overflow-hidden transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-pop-lg group-focus-visible:ring-4 group-focus-visible:ring-sky">
        <span className="relative block aspect-[4/3] overflow-hidden border-b-[2.5px] border-ink bg-gray-3">
          <WpImage
            media={preview}
            sizes={CARD_IMAGE_SIZES}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper/95 px-2.5 py-0.5 text-xs font-extrabold">
            <Camera className="size-3.5" aria-hidden />
            {formatGalleryDate(gallery.date)}
          </span>
        </span>
        <span className="flex items-start justify-between gap-3 p-4">
          <span
            className="line-clamp-2 font-display text-lg leading-snug font-bold"
            dangerouslySetInnerHTML={{ __html: gallery.title }}
          />
          <span
            aria-hidden
            className={cn(
              'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-12 max-sm:hidden',
              back.bg
            )}
          >
            <ArrowRight className="size-4" />
          </span>
        </span>
      </span>
    </Link>
  )
}
