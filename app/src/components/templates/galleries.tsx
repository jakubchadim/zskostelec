import { notFound } from 'next/navigation'
import { getGalleries, getPageById, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'
import { Container } from '@/components/ui/container'
import { BlockContent } from '@/components/block/content'
import { GalleryCard } from '@/components/gallery/gallery-card'
import { hasPreview } from '@/components/gallery/has-preview'
import { sortByDateDesc } from '@/components/gallery/sort-by-date'

type GalleriesRoute = Extract<ResolvedRoute, { kind: 'page' }>

/**
 * The `page-galleries.php` template: page title/content, then a grid of
 * gallery cards. Ports `web/src/templates/allGallery.tsx`.
 *
 * Deviates from the legacy nesting: legacy injected the title/grid as
 * `title`/`footer` slot props into `<BlockContent>`, which the current
 * (T3 placeholder) `BlockContent` doesn't support. Rendering title -> blocks
 * (or raw content) -> grid as three siblings produces the same visible
 * content/order without depending on an API that doesn't exist yet.
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
  const galleries = sortByDateDesc(await getGalleries()).filter(hasPreview)

  return (
    <>
      <Container>
        <h1 className="top" dangerouslySetInnerHTML={{ __html: page.title }} />
      </Container>

      {page.blocks.length > 0 ? (
        <BlockContent blocks={page.blocks} />
      ) : page.content ? (
        <Container>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </Container>
      ) : null}

      <Container>
        <div className="pt-1 pb-4 sm:pt-4 md:pt-8">
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}
