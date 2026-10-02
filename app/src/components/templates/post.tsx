import { notFound } from 'next/navigation'
import { CalendarDays, Clock, Download } from 'lucide-react'
import { getCategoryById, getGalleryPreviewImages, getPostById, getPostPreviews, type ResolvedRoute } from '@/lib/content'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { Reveal } from '@/components/ui/reveal'
import { BlockContent } from '@/components/block/content'
import { ArticleRow, formatArticleDate, isExternalHref } from '@/components/article/article'
import { GalleryPreview } from '@/components/article/gallery-preview'
import { Pencil } from '@/components/ui/doodles'
import type { TemplateProps } from '@/components/templates/registry'

/** ~200 words/minute, rounded up, from the rendered HTML. */
function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/**
 * Single post: colourful hero (back to category, date, reading time), the
 * body on a paper card at a comfortable reading width, embedded galleries
 * as polaroids, and a "more from this category" sidebar.
 */
export async function PostTemplate({ data }: TemplateProps) {
  const route = data as Extract<ResolvedRoute, { kind: 'post' }>
  const post = await getPostById(route.id)

  if (!post) {
    notFound()
  }

  const category = await getCategoryById(route.categoryId)
  const relatedPosts = category
    ? (await getPostPreviews(category.id, { limit: 5, excludePostId: post.id })).posts
        .filter((relatedPost) => relatedPost.id !== post.id)
        .slice(0, 4)
    : []

  const hasBody = post.blocks.length > 0 || Boolean(post.content)
  const fallbackLink = post.acf.link ?? post.acf.file
  const galleries = (post.galleries ?? []).filter((gallery) => getGalleryPreviewImages(gallery).length > 0)

  return (
    <>
      <PageHero
        titleHtml={post.title}
        title={null}
        colorKey={category?.name ?? 'post'}
        back={category ? { href: category.link, label: category.name } : undefined}
      >
        <div className="flex flex-wrap gap-2 text-sm font-bold">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1">
            <CalendarDays className="size-4" aria-hidden />
            <time dateTime={post.date}>{formatArticleDate(post.date)}</time>
          </span>
          {post.content && (
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1">
              <Clock className="size-4" aria-hidden />
              {readingMinutes(post.content)} min čtení
            </span>
          )}
        </div>
      </PageHero>

      <Container className="pt-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <article className="sticker relative p-5 sm:p-10">
              <Pencil className="absolute -top-8 -right-4 hidden w-14 rotate-12 text-sun sm:block" />
              {hasBody ? (
                post.blocks.length > 0 ? (
                  <BlockContent blocks={post.blocks} inline />
                ) : (
                  <div className="wp-prose" dangerouslySetInnerHTML={{ __html: post.content }} />
                )
              ) : (
                fallbackLink && (
                  <a
                    href={fallbackLink}
                    target={isExternalHref(fallbackLink) ? '_blank' : undefined}
                    rel={isExternalHref(fallbackLink) ? 'noopener noreferrer' : undefined}
                    className="btn bg-sun"
                  >
                    <Download className="size-5" aria-hidden />
                    Zobrazit
                  </a>
                )
              )}
            </article>

            {galleries.length > 0 && (
              <div className="mt-12 space-y-12">
                {galleries.map((gallery) => (
                  <Reveal key={gallery.id}>
                    <GalleryPreview gallery={gallery} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {relatedPosts.length > 0 && category && (
            <aside aria-labelledby="dalsi-clanky" className="lg:sticky lg:top-24 lg:self-start">
              <div className="sticker bg-sky-tint p-5">
                <h2 id="dalsi-clanky" className="font-display text-xl">
                  Další z rubriky {category.name}
                </h2>
                <ul className="m-0 mt-4 list-none space-y-1 rounded-2xl border-2 border-ink bg-paper p-2">
                  {relatedPosts.map((relatedPost, idx) => (
                    <li key={relatedPost.id}>
                      <ArticleRow post={relatedPost} index={idx} />
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </Container>
    </>
  )
}
