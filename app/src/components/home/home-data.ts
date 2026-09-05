import { getCategoryBySlug, getPostById, getPostsByCategory } from '@/lib/wp'
import type { WpPage } from '@/lib/wp'
import { selectMainPostAndPreviews, type HomeArticlePreview, type HomeSelection } from './home.normalize'

const MAIN_CATEGORY_LIMIT = 6
const ADDITIONAL_CATEGORY_LIMIT = 3

/**
 * Assembles the homepage's main post + per-category article previews.
 * Ports `web/.gatsby/gatsby-node.ts`'s HOME `getPageContext` branch: the
 * main post (if set) is fetched by id; each of the page's three ACF
 * categories (`mainCategory`, `additionalCategoryFirst/Second`) gets its
 * own preview, the first with a 6-article limit and the other two with 3,
 * all excluding the main post id. See `home.normalize.ts` for the pure
 * fallback/slot logic this defers to.
 */
export async function getHomeData(page: WpPage): Promise<HomeSelection> {
  const categorySlugs = [page.acf.mainCategory, page.acf.additionalCategoryFirst, page.acf.additionalCategorySecond]
    .filter((category): category is { slug: string } => category != null)
    .map((category) => category.slug)

  const mainPostId = page.acf.mainPost

  const [explicitMainPost, rawPreviews] = await Promise.all([
    mainPostId ? getPostById(mainPostId) : Promise.resolve(null),
    Promise.all(
      categorySlugs.map(async (slug, idx): Promise<HomeArticlePreview | null> => {
        const [category, articles] = await Promise.all([
          getCategoryBySlug(slug),
          getPostsByCategory(slug, {
            limit: idx === 0 ? MAIN_CATEGORY_LIMIT : ADDITIONAL_CATEGORY_LIMIT,
            // Legacy applies the same mainPost id as the exclusion for
            // every category fetch, not just the one it belongs to.
            excludePostId: mainPostId ?? undefined
          })
        ])

        return category ? { category, articles } : null
      })
    )
  ])

  const previews = rawPreviews.filter((preview): preview is HomeArticlePreview => preview != null)

  return selectMainPostAndPreviews(explicitMainPost, previews)
}
