import { notFound } from 'next/navigation'
import { PageHero } from '@/components/ui/page-hero'
import { getPageById, type ResolvedRoute } from '@/lib/content'
import { PageBody } from './page-body'
import { WORKPLACES_SLUG, WorkplacesTemplate } from './workplaces'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

/** Default WP page template: colourful hero + the page's blocks at reading width. */
export async function PageTemplate({ data }: TemplateProps) {
  const route = data as PageRouteData
  const page = await getPageById(route.id)

  if (!page) {
    notFound()
  }

  // A plain WP page with a bespoke interactive layout (no WP template needed).
  if (page.slug === WORKPLACES_SLUG) {
    return <WorkplacesTemplate page={page} />
  }

  return (
    <>
      <PageHero title={null} titleHtml={page.title} colorKey={page.slug} />
      <PageBody page={page} />
    </>
  )
}
