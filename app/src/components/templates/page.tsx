import { notFound } from 'next/navigation'
import { PageHero } from '@/components/ui/page-hero'
import { getPageById, type ResolvedRoute } from '@/lib/wp'
import { PageBody } from './page-body'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

/** Default WP page template: colourful hero + the page's blocks at reading width. */
export async function PageTemplate({ data }: TemplateProps) {
  const route = data as PageRouteData
  const page = await getPageById(route.id)

  if (!page) {
    notFound()
  }

  return (
    <>
      <PageHero title={null} titleHtml={page.title} colorKey={page.slug} />
      <PageBody page={page} />
    </>
  )
}
