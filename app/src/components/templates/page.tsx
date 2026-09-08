import { notFound } from 'next/navigation'
import { BlockContent } from '@/components/block/content'
import { Section } from '@/components/block/section'
import { Container } from '@/components/ui/container'
import { getPageById, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

/** Default WP page template (page.template === DEFAULT) - port of web/src/templates/page.tsx. */
export async function PageTemplate({ data }: TemplateProps) {
  const route = data as PageRouteData
  const page = await getPageById(route.id)

  if (!page) {
    notFound()
  }

  const title = (
    <Container>
      <h1 className="top">{page.title}</h1>
    </Container>
  )

  return page.blocks.length > 0 ? (
    <BlockContent blocks={page.blocks} title={title} />
  ) : (
    <Section>
      {title}
      <Container>
        {/* Classic-editor fallback for a page with zero Gutenberg blocks. Legacy additionally
            rewrote internal <a>/<img> here via html-react-parser (Link routing, lazy images);
            that dependency isn't available in app/. Admin-origin URLs are already rewritten to
            site-relative ones at fetch time (T1's rewriteAdminUrls runs over the whole raw page
            object, this content field included) - only the client-side <Link>/lazy-image
            upgrade is missing, and this path should be rare in practice. */}
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </Container>
    </Section>
  )
}
