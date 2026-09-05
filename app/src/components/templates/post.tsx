import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCategoryById, getGalleryPreviewImages, getPostById, getPostsByCategory, type ResolvedRoute } from '@/lib/wp'
import { Container } from '@/components/ui/container'
import { BlockContent } from '@/components/block/content'
import { Article, formatArticleDate, isExternalHref } from '@/components/article/article'
import { GalleryPreview } from '@/components/article/gallery-preview'
import type { TemplateProps } from '@/components/templates/registry'

/**
 * Single-post page: back-link to the category, date, title, body (via
 * `BlockContent`, falling back to the raw `content` when a post has no
 * parsed blocks), embedded galleries, and a sidebar of 3 more posts from
 * the same category. Ports `web/src/templates/post.tsx`.
 *
 * Typed against plain `TemplateProps` (not the narrowed route variant) and
 * narrowed internally, so this stays assignable to
 * `ComponentType<TemplateProps>` in the registry without a cast there.
 */
export async function PostTemplate({ data }: TemplateProps) {
  const route = data as Extract<ResolvedRoute, { kind: 'post' }>
  const post = await getPostById(route.id)

  if (!post) {
    notFound()
  }

  const category = await getCategoryById(route.categoryId)
  const relatedPosts = category ? await getPostsByCategory(category.slug, { limit: 3, excludePostId: post.id }) : []

  const hasBody = post.blocks.length > 0 || Boolean(post.content)
  const fallbackLink = post.acf.link ?? post.acf.file

  const galleries = (post.galleries ?? []).filter((gallery) => getGalleryPreviewImages(gallery).length > 0)

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <Container>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            {category && (
              <div className="mb-2 text-sm">
                <Link
                  href={category.link}
                  className="inline-flex items-center gap-2 text-secondary-1 hover:text-secondary-2"
                >
                  <ArrowLeft className="size-[1.2em]" aria-hidden />
                  {category.name}
                </Link>
              </div>
            )}
            <div className="opacity-70">{formatArticleDate(post.date)}</div>
            <h1 className="top" dangerouslySetInnerHTML={{ __html: post.title }} />
            {hasBody ? (
              <BlockContent blocks={post.blocks} />
            ) : (
              fallbackLink && (
                <a
                  href={fallbackLink}
                  target={isExternalHref(fallbackLink) ? '_blank' : undefined}
                  rel={isExternalHref(fallbackLink) ? 'noopener noreferrer' : undefined}
                  className="inline-block rounded-small border border-black-1 px-3 py-2 font-medium hover:bg-gray-2"
                >
                  Zobrazit
                </a>
              )
            )}
            {galleries.length > 0 && (
              <div className="mt-8 space-y-8">
                {galleries.map((gallery) => (
                  <GalleryPreview key={gallery.id} gallery={gallery} />
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 md:gap-8">
              {relatedPosts.map((relatedPost, idx) => (
                <div key={relatedPost.id} className={idx >= 2 ? 'hidden md:block' : undefined}>
                  <Article post={relatedPost} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
