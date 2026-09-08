import type { ID, Nullable } from '../types'
import type { PageTemplateType } from '../entities/page'

/**
 * The result of classifying a URL path against WP content. `null` (not a
 * union member) means "not found" - callers do `if (!resolved) notFound()`.
 */
export type ResolvedRoute =
  /** `pageNumber`/`basePath` only vary for paginated page templates (the
   * galleries index); every other page template gets page 1 and ignores them. */
  | { kind: 'page'; id: ID; templateType: PageTemplateType; pageNumber: number; basePath: string }
  | { kind: 'post'; id: ID; categoryId: ID }
  | { kind: 'category'; id: ID; rootCategoryId: ID; pageNumber: number; basePath: string }
  | { kind: 'gallery'; id: ID; allGalleryLink: Nullable<string> }
