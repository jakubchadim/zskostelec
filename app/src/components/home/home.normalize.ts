import type { WpCategory, WpPost } from '@/lib/wp'

export type HomeArticlePreview = {
  category: WpCategory
  articles: WpPost[]
}

export type HomeSelection = {
  mainPost: WpPost | null
  previews: HomeArticlePreview[]
}

/**
 * Ported from `web/.gatsby/gatsby-node.ts`'s HOME `getPageContext` branch
 * (the `mainPost`/`articlePreviews` assembly). Deliberately preserves two
 * legacy quirks rather than fixing them - this migration's bar is behavior
 * parity with the live site; behavior changes are a call for the site
 * owner, later:
 *
 * - The fallback main post is only ever popped from `previews[0]` (the
 *   main-category preview) - `previews[1]`/`previews[2]` are fetched with
 *   the same (absent) `excludePostId` and can still contain that same
 *   post; legacy never retroactively excludes it from them.
 * - Filtering (dropping empty-article previews) happens *after* the
 *   fallback pop, and callers destructure the *filtered* array
 *   positionally - so an empty middle category shifts a later one into
 *   its grid slot instead of leaving that slot empty.
 */
export function selectMainPostAndPreviews(
  explicitMainPost: WpPost | null,
  previews: HomeArticlePreview[]
): HomeSelection {
  let mainPost = explicitMainPost
  let result = previews

  // Legacy quirk: only previews[0] ever contributes the fallback main post.
  if (!mainPost && previews[0]?.articles.length) {
    const [first, ...rest] = previews[0].articles
    mainPost = first
    result = previews.map((preview, idx) => (idx === 0 ? { ...preview, articles: rest } : preview))
  }

  // Legacy quirk: positional, not identity-based - see doc comment above.
  return { mainPost, previews: result.filter((preview) => preview.articles.length > 0) }
}
