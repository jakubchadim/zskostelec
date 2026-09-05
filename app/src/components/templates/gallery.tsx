import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getGalleryById, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'
import { Container } from '@/components/ui/container'
import { GalleryViewer } from '@/components/gallery/gallery-viewer'
import { formatGalleryDate } from '@/components/gallery/format-date'

type GalleryRoute = Extract<ResolvedRoute, { kind: 'gallery' }>

/**
 * Single gallery: back link, title/date, thumbnail grid with a lightbox (or
 * an empty-gallery message). Ports `web/src/templates/gallery.tsx`.
 */
export async function GalleryTemplate({ data }: TemplateProps) {
  const route = data as GalleryRoute
  const gallery = await getGalleryById(route.id)

  if (!gallery) {
    notFound()
  }

  return (
    <Container>
      <div className="py-8 sm:py-10 md:py-12">
        {route.allGalleryLink != null && (
          <div className="mb-2 text-[0.875em]">
            <Link
              href={route.allGalleryLink}
              className="inline-flex items-center gap-2 text-secondary-1 no-underline hover:text-secondary-2 hover:underline"
            >
              <ArrowLeft className="size-[1.2em]" aria-hidden />
              Fotogalerie
            </Link>
          </div>
        )}

        <div className="opacity-70">{formatGalleryDate(gallery.date)}</div>
        <h1 className="top" dangerouslySetInnerHTML={{ __html: gallery.title }} />

        {/* "Fix empty gallery" (1acb6d7): a gallery can have a resolved
            preview but zero images in `acf.gallery` - it's still routable
            (only `preview` is required), so this case is real. */}
        {gallery.acf.gallery.length === 0 ? (
          <p>Prázdná fotogalerie</p>
        ) : (
          <GalleryViewer images={gallery.acf.gallery} />
        )}
      </div>
    </Container>
  )
}
