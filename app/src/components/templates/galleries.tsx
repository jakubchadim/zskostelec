import { notFound } from 'next/navigation'
import { getGalleryPage, getPageById, type ResolvedRoute } from '@/lib/content'
import type { TemplateProps } from './registry'
import { Container } from '@/components/ui/container'
import { ArticlePagination } from '@/components/article/pagination'
import { PageHero } from '@/components/ui/page-hero'
import { Reveal } from '@/components/ui/reveal'
import { PageBody } from './page-body'
import { GalleryCard } from '@/components/gallery/gallery-card'
import { hasPreview } from '@/components/gallery/has-preview'

type GalleriesRoute = Extract<ResolvedRoute, { kind: 'page' }>

/**
 * The `page-galleries.php` template: page title/content, then a paginated
 * grid of gallery cards. Ports `web/src/templates/allGallery.tsx`, which
 * rendered every gallery on a single page - this splits them across
 * `…/strana-N/` pages on the same scheme the category listing uses.
 */
export async function GalleriesTemplate({ data }: TemplateProps) {
  const route = data as GalleriesRoute
  const page = await getPageById(route.id)

  if (!page) {
    notFound()
  }

  const { galleries: pageGalleries, totalPages } = await getGalleryPage(route.pageNumber)
  // A gallery without any photo has nothing to show on a card.
  const galleries = pageGalleries.filter(hasPreview)

  // A `strana-N` beyond the last page has no content to show. `resolveRoute`
  // can't catch it (it resolves paths without counting galleries), so it's
  // caught here.
  if (route.pageNumber > totalPages) {
    notFound()
  }


  return (
    <>
      <PageHero
        title={null}
        titleHtml={page.title}
        colorKey="fotogalerie"
        eyebrow={route.pageNumber > 1 ? `Strana ${route.pageNumber} z ${totalPages}` : 'Momentky ze školy'}
        lead={route.pageNumber === 1 ? 'Výlety, soutěže, besídky i obyčejné dny ve třídách. Klikněte na fotku a prohlížejte.' : undefined}
      />
      {route.pageNumber === 1 && <PageBody page={page} intro />}

      <Container className="pt-6">
        <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 xs:grid-cols-2 md:grid-cols-3">
          {galleries.map((gallery, idx) => (
            <li key={gallery.id}>
              <Reveal delay={(idx % 3) * 80}>
                <GalleryCard gallery={gallery} index={idx} />
              </Reveal>
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="pt-14">
            <ArticlePagination
              totalPages={totalPages}
              current={route.pageNumber}
              generateLink={(page) => (page === 1 ? route.basePath : `${route.basePath}strana-${page}/`)}
            />
          </div>
        )}
      </Container>
    </>
  )
}
