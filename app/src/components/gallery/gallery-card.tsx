import Link from 'next/link'
import { getGalleryPreviewImages, type WpGallery } from '@/lib/wp'
import { WpImage } from '@/components/image/wp-image'
import { formatGalleryDate } from './format-date'

const CARD_IMAGE_SIZES = '(min-width: 55.125em) 33vw, (min-width: 26em) 50vw, 100vw'

type GalleryCardProps = {
  gallery: WpGallery
}

/** One card in the galleries index grid: preview image + a date/title caption strip below it. */
export function GalleryCard({ gallery }: GalleryCardProps) {
  const [preview] = getGalleryPreviewImages(gallery, 1)

  if (!preview) {
    return null
  }

  return (
    <Link
      href={gallery.link}
      className="group block overflow-hidden rounded-medium bg-white-1 shadow-small transition-shadow duration-200 ease-in-out hover:shadow-lift"
    >
      <div className="relative w-full overflow-hidden pb-[80%]">
        <WpImage
          media={preview}
          sizes={CARD_IMAGE_SIZES}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="px-5 pt-5 pb-1 text-2 opacity-70">{formatGalleryDate(gallery.date)}</div>
      <h4 className="m-0 px-5 pb-5 font-light" dangerouslySetInnerHTML={{ __html: gallery.title }} />
    </Link>
  )
}
