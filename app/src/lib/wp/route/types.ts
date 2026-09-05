import type { ID, Nullable } from '../types'
import type { PageTemplateType } from '../entities/page'

/**
 * The result of classifying a URL path against WP content. `null` (not a
 * union member) means "not found" - callers do `if (!resolved) notFound()`.
 */
export type ResolvedRoute =
  | { kind: 'page'; id: ID; templateType: PageTemplateType }
  | { kind: 'post'; id: ID; categoryId: ID }
  | { kind: 'category'; id: ID; rootCategoryId: ID; pageNumber: number; basePath: string }
  | { kind: 'gallery'; id: ID; allGalleryLink: Nullable<string> }
