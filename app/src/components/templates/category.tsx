import { notFound } from 'next/navigation'
import { CATEGORY_PAGE_SIZE, getCategories, getCategoryById, getPostsForCategory, type ResolvedRoute } from '@/lib/wp'
import { Container } from '@/components/ui/container'
import { Article } from '@/components/article/article'
import { ArticlePagination } from '@/components/article/pagination'
import { ArticleEmptyState } from '@/components/article/empty-state'
import { CategorySwitcher } from '@/components/filter/category-switcher'
import type { TemplateProps } from '@/components/templates/registry'

/**
 * Paginated category listing: heading (+ sibling-category switcher when
 * there are any), a grid of article preview cards or an empty state, and
 * `strana-N` pagination. Ports `web/src/templates/category.tsx`.
 *
 * Typed against plain `TemplateProps` (not the narrowed route variant) and
 * narrowed internally, so this stays assignable to
 * `ComponentType<TemplateProps>` in the registry without a cast there.
 */
export async function CategoryTemplate({ data }: TemplateProps) {
  const route = data as Extract<ResolvedRoute, { kind: 'category' }>
  const category = await getCategoryById(route.id)

  if (!category) {
    notFound()
  }

  const [{ posts, totalCount }, allCategories] = await Promise.all([
    getPostsForCategory(route.id, {
      offset: (route.pageNumber - 1) * CATEGORY_PAGE_SIZE,
      limit: CATEGORY_PAGE_SIZE
    }),
    getCategories()
  ])

  const siblings = allCategories.filter((sibling) => sibling.parent?.id === route.rootCategoryId)
  const heading = category.parent ? category.parent.name : category.name
  const totalPages = Math.max(Math.ceil(totalCount / CATEGORY_PAGE_SIZE), 1)

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <Container>
        <h1 className="top flex flex-wrap items-baseline gap-1">
          {heading}
          {siblings.length > 0 && (
            <CategorySwitcher current={category} siblings={siblings} rootLink={category.parent?.link ?? null} />
          )}
        </h1>
        {posts.length === 0 ? (
          <ArticleEmptyState parentCategoryLink={category.parent?.link ?? null} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {posts.map((post) => (
              <Article key={post.id} post={post} />
            ))}
          </div>
        )}
        {posts.length > 0 && (
          <div className="pt-8 pb-2 sm:pt-10 sm:pb-8 md:pt-12">
            <ArticlePagination
              totalPages={totalPages}
              current={route.pageNumber}
              generateLink={(page) => (page === 1 ? route.basePath : `${route.basePath}strana-${page}/`)}
            />
          </div>
        )}
      </Container>
    </section>
  )
}
