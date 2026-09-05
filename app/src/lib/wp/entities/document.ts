import { wpFetchAllPages, WP_CACHE_TAGS } from '../client'
import { asId, type ID } from '../types'
import { extractUrl } from './media'

type RawWpDocument = {
  id: number
  title: { rendered: string }
  documentCategories: number[]
  acf?: { file?: { filename?: string; url?: unknown } | null }
}

export type WpDocument = {
  id: ID
  title: string
  categoryIds: ID[]
  filename: string
  fileUrl: string
}

type RawWpTerm = { id: number; name: string }
export type WpDocumentCategory = { id: ID; name: string }

const DOCUMENT_FIELDS = ['id', 'title', 'documentCategories', 'acf']

function normalizeDocument(raw: RawWpDocument): WpDocument {
  return {
    id: asId(raw.id),
    title: raw.title.rendered,
    categoryIds: (raw.documentCategories ?? []).map(asId),
    filename: raw.acf?.file?.filename ?? '',
    fileUrl: extractUrl(raw.acf?.file?.url)
  }
}

export async function getDocuments(): Promise<WpDocument[]> {
  const raw = await wpFetchAllPages<RawWpDocument>('wp/v2/document', {
    fields: DOCUMENT_FIELDS,
    tags: [WP_CACHE_TAGS.document]
  })

  return raw.map(normalizeDocument)
}

export async function getDocumentCategories(): Promise<WpDocumentCategory[]> {
  const raw = await wpFetchAllPages<RawWpTerm>('wp/v2/documentCategories', {
    fields: ['id', 'name'],
    tags: [WP_CACHE_TAGS.document]
  })

  return raw.map((term) => ({ id: asId(term.id), name: term.name }))
}
