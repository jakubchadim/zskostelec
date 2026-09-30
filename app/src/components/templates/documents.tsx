import { notFound } from 'next/navigation'
import { DocumentsExplorer } from '@/components/file/documents-explorer'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { getDocumentCategories, getDocuments, getPageById, type ResolvedRoute } from '@/lib/wp'
import { PageBody } from './page-body'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

/** Documents: hero + page intro + searchable, category-grouped downloads. */
export async function DocumentsTemplate({ data }: TemplateProps) {
  const route = data as PageRouteData
  const [page, documents, categories] = await Promise.all([
    getPageById(route.id),
    getDocuments(),
    getDocumentCategories()
  ])

  if (!page) {
    notFound()
  }

  return (
    <>
      <PageHero title={null} titleHtml={page.title} colorKey="dokumenty" eyebrow="Ke stažení" />
      <PageBody page={page} intro />
      <Container className="pt-4">
        <DocumentsExplorer documents={documents} categories={categories} />
      </Container>
    </>
  )
}
