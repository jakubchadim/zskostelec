import { BlockContent } from '@/components/block/content'
import { BlockContainer } from '@/components/block/block-container'
import { Container } from '@/components/ui/container'
import type { WpPage } from '@/lib/wp'

/**
 * A WP page's own body under its hero: Gutenberg blocks when present,
 * otherwise the classic-editor HTML. Renders nothing for an empty page, so
 * listing templates (galleries, staff, documents) don't get a blank gap;
 * `intro` aligns it with the listing that follows.
 */
export function PageBody({ page, intro }: { page: WpPage; intro?: boolean }) {
  if (page.blocks.length === 0 && !page.content.trim()) {
    return null
  }

  const body =
    page.blocks.length > 0 ? (
      <BlockContent blocks={page.blocks} />
    ) : (
      <section className="wp-prose py-6 sm:py-8">
        <BlockContainer>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </BlockContainer>
      </section>
    )

  if (!intro) {
    return body
  }

  // Short intro above a listing: left-aligned with the listing below it
  // instead of centred at reading width.
  return (
    <Container className="text-lg [&_.block-container]:mx-0 [&_.block-container]:max-w-3xl [&_.block-container]:px-0 [&_section]:pb-2">
      {body}
    </Container>
  )
}
