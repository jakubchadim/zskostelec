import { notFound } from 'next/navigation'
import { getGalleries, getPageById, GALLERY_PAGE_SIZE, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'
import { Container } from '@/components/ui/container'
import { ArticlePagination } from '@/components/article/pagination'
import { BlockContent } from '@/components/block/content'
import { Section } from '@/components/block/section'
import { GalleryCard } from '@/components/gallery/gallery-card'
import { hasPreview } from '@/components/gallery/has-preview'
import { sortByDateDesc } from '@/components/gallery/sort-by-date'

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

  // Parity with the legacy query's `filter: { acf: { preview: { link: { ne: null } } } }` -
  // `getGalleries()` already applies this at the data-layer level; re-asserting it
  // here too via `hasPreview` documents the intent at the render site.
  const allGalleries = sortByDateDesc(await getGalleries()).filter(hasPreview)
  const totalPages = Math.max(Math.ceil(allGalleries.length / GALLERY_PAGE_SIZE), 1)

  // A `strana-N` beyond the last page has no content to show. `resolveRoute`
  // can't catch it (it resolves paths without counting galleries), so it's
  // caught here.
  if (route.pageNumber > totalPages) {
    notFound()
  }

  const offset = (route.pageNumber - 1) * GALLERY_PAGE_SIZE
  const galleries = allGalleries.slice(offset, offset + GALLERY_PAGE_SIZE)

  const title = (
    <Container>
      <h1 className="top" dangerouslySetInnerHTML={{ __html: page.title }} />
    </Container>
  )

  return (
    <>
      {page.blocks.length > 0 ? (
        <BlockContent blocks={page.blocks} title={title} />
      ) : (
        <Section>
          {title}
          {page.content && (
            <Container>
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </Container>
          )}
        </Section>
      )}

      <Container>
        <div className="pt-1 pb-4 sm:pt-4 md:pt-8">
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="pt-8 pb-2 sm:pt-10 sm:pb-8 md:pt-12">
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
