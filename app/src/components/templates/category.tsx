import { notFound } from 'next/navigation'
import { CATEGORY_PAGE_SIZE, getCategories, getCategoryById, getPostPreviews, type ResolvedRoute } from '@/lib/content'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { Reveal } from '@/components/ui/reveal'
import { Article } from '@/components/article/article'
import { ArticlePagination } from '@/components/article/pagination'
import { ArticleEmptyState } from '@/components/article/empty-state'
import { CategorySwitcher } from '@/components/filter/category-switcher'
import type { TemplateProps } from '@/components/templates/registry'

/** Paginated category listing: hero (+ sub-category chips), card grid or empty state, `strana-N` pagination. */
export async function CategoryTemplate({ data }: TemplateProps) {
  const route = data as Extract<ResolvedRoute, { kind: 'category' }>
  const category = await getCategoryById(route.id)

  if (!category) {
    notFound()
  }

  const [{ posts, totalCount }, allCategories] = await Promise.all([
    getPostPreviews(route.id, {
      offset: (route.pageNumber - 1) * CATEGORY_PAGE_SIZE,
      limit: CATEGORY_PAGE_SIZE
    }),
    getCategories()
  ])

  const siblings = allCategories.filter((sibling) => sibling.parent?.id === route.rootCategoryId)
  const heading = category.parent ? category.parent.name : category.name
  const totalPages = Math.max(Math.ceil(totalCount / CATEGORY_PAGE_SIZE), 1)
  const rootLink = category.parent?.link ?? category.link

  return (
    <>
      <PageHero
        title={heading}
        colorKey={heading}
        eyebrow={route.pageNumber > 1 ? `Strana ${route.pageNumber} z ${totalPages}` : `${totalCount} ${totalCount === 1 ? 'článek' : totalCount < 5 && totalCount > 0 ? 'články' : 'článků'}`}
      >
        {siblings.length > 0 && <CategorySwitcher current={category} siblings={siblings} rootLink={rootLink} />}
      </PageHero>
      <Container className="pt-4">
        {posts.length === 0 ? (
          <ArticleEmptyState parentCategoryLink={category.parent?.link ?? null} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post, idx) => (
              <Reveal key={post.id} delay={(idx % 3) * 80}>
                <Article post={post} index={idx} />
              </Reveal>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="pt-12">
            <ArticlePagination
              totalPages={totalPages}
              current={route.pageNumber}
              generateLink={(page) => (page === 1 ? route.basePath : `${route.basePath}strana-${page}/`)}
            />
          </div>
        )}
      </Container>
    </>
  )
}
