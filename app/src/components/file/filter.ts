import type { ID, WpDocument, WpDocumentCategory } from '@/lib/wp'
import { foldText } from '@/lib/utils'

export type DocumentGroup = {
  /** `null` = the trailing "Ostatní" bucket for documents matching no known category. */
  category: WpDocumentCategory | null
  documents: WpDocument[]
}

export type DocumentFilters = {
  name: string
  categoryIds: ID[]
}

export const EMPTY_DOCUMENT_FILTERS: DocumentFilters = { name: '', categoryIds: [] }

/** Case- and diacritics-insensitive substring match against `${title}||${filename}`. */
export function matchesDocumentName(document: WpDocument, name: string): boolean {
  const query = foldText(name)
  if (!query) {
    return true
  }

  return foldText(`${document.title}||${document.filename}`).includes(query)
}

/**
 * Groups documents by category (a document with multiple `categoryIds` appears in each of
 * those groups, matching how the legacy category filter treated it), in `categories` order,
 * with a trailing "Ostatní" group (`category: null`) for documents matching no known category.
 * Empty groups are dropped - an empty category never renders a section.
 */
export function groupDocumentsByCategory(documents: WpDocument[], categories: WpDocumentCategory[]): DocumentGroup[] {
  const groups: DocumentGroup[] = categories.map((category) => ({
    category,
    documents: documents.filter((document) => document.categoryIds.includes(category.id))
  }))

  const knownIds = new Set(categories.map((category) => category.id))
  const uncategorized = documents.filter((document) => !document.categoryIds.some((id) => knownIds.has(id)))

  if (uncategorized.length) {
    groups.push({ category: null, documents: uncategorized })
  }

  return groups.filter((group) => group.documents.length > 0)
}

/**
 * Applies live filter state on top of `groupDocumentsByCategory`'s output: a non-empty
 * `categoryIds` selection drops any group not selected (including the "Ostatní" bucket, which
 * can never match a specific category selection); `name` filters documents within each
 * remaining group. Groups left with zero documents are dropped.
 */
export function filterDocumentGroups(groups: DocumentGroup[], filters: DocumentFilters): DocumentGroup[] {
  return groups
    .filter((group) => filters.categoryIds.length === 0 || (group.category != null && filters.categoryIds.includes(group.category.id)))
    .map((group) => ({ ...group, documents: group.documents.filter((document) => matchesDocumentName(document, filters.name)) }))
    .filter((group) => group.documents.length > 0)
}
