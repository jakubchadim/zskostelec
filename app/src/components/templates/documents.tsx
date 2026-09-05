import { notFound } from 'next/navigation'
import { BlockContent } from '@/components/block/content'
import { DocumentsExplorer } from '@/components/file/documents-explorer'
import { Container } from '@/components/ui/container'
import { getDocumentCategories, getDocuments, getPageById, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

/** Documents page (page.template === DOCUMENTS) - port of web/src/templates/allDocument.tsx:
 * page intro + a filterable, category-grouped document listing (see DocumentsExplorer). */
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
      <Container>
        <h1 className="top">{page.title}</h1>
      </Container>
      {page.blocks.length > 0 ? (
        <BlockContent blocks={page.blocks} />
      ) : (
        <Container>
          {/* See templates/page.tsx for why this is plain dangerouslySetInnerHTML. */}
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </Container>
      )}
      <Container>
        <div className="pt-1 pb-4 sm:py-4 md:pt-8 md:pb-4">
          <DocumentsExplorer documents={documents} categories={categories} />
        </div>
      </Container>
    </>
  )
}
