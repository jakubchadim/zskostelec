import { notFound } from 'next/navigation'
import { Camera } from 'lucide-react'
import { getGalleryById, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { GalleryViewer } from '@/components/gallery/gallery-viewer'
import { formatGalleryDate } from '@/components/gallery/format-date'
import { ArticleEmptyState } from '@/components/article/empty-state'

type GalleryRoute = Extract<ResolvedRoute, { kind: 'gallery' }>

/** Single gallery: hero (back link, date, photo count) + photo grid with lightbox. */
export async function GalleryTemplate({ data }: TemplateProps) {
  const route = data as GalleryRoute
  const gallery = await getGalleryById(route.id)

  if (!gallery) {
    notFound()
  }

  const count = gallery.acf.gallery.length

  return (
    <>
      <PageHero
        title={null}
        titleHtml={gallery.title}
        colorKey="fotogalerie"
        back={route.allGalleryLink != null ? { href: route.allGalleryLink, label: 'Fotogalerie' } : undefined}
      >
        <div className="flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full border-2 border-ink bg-paper px-3 py-1">{formatGalleryDate(gallery.date)}</span>
          {count > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1">
              <Camera className="size-4" aria-hidden />
              {count} {count === 1 ? 'fotka' : count < 5 ? 'fotky' : 'fotek'}
            </span>
          )}
        </div>
      </PageHero>

      <Container className="pt-6">
        {/* A gallery can have a preview but zero images (see "Fix empty gallery", 1acb6d7). */}
        {count === 0 ? (
          <ArticleEmptyState
            parentCategoryLink={route.allGalleryLink ?? null}
            title="Fotky se teprve vyvolávají"
            text="V této galerii zatím nejsou žádné fotografie."
            actionLabel="Zpět na fotogalerii"
          />
        ) : <GalleryViewer images={gallery.acf.gallery} />}
      </Container>
    </>
  )
}
