import type { Nullable } from './types'

/** Posts-per-page for category pagination (`strana-N`), matching the Gatsby-era `paginationLimit`. */
export const CATEGORY_PAGE_SIZE = 15

/**
 * Ported from `web/src/components/article/normalizer.ts`: a post with no
 * body content acts as a pure "link" or "file download" article, and its
 * effective `link` (used everywhere in place of its real permalink)
 * becomes the ACF `link` field, or the attached file's URL, or `null` if
 * neither is set. A post with real content always keeps its own permalink.
 * `hasAcf` mirrors the original's outer `if (entity?.acf)` guard - a post
 * with no `acf` key at all never gets the override, even if content is
 * also empty (in practice `acf-to-rest-api` always includes an `acf` key,
 * so this only matters for a WP install/plugin config this wasn't tested
 * against - see T1 review finding 4).
 */
export function resolvePostLink(input: {
  hasAcf: boolean
  hasContent: boolean
  permalink: string
  acfLink: Nullable<string>
  fileUrl: Nullable<string>
}): Nullable<string> {
  if (!input.hasAcf || input.hasContent) {
    return input.permalink
  }

  return input.acfLink ?? input.fileUrl ?? null
}
