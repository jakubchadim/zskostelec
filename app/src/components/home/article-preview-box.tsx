import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { WpPost } from '@/lib/wp'
import { Box, BoxHeader } from './box'
import { formatArticleDate } from './format-date'
import type { HomeArticlePreview } from './home.normalize'
import { isExternalUrl } from './is-external-url'

function ArticleLink({ post }: { post: WpPost }) {
  if (post.link == null) {
    return <span dangerouslySetInnerHTML={{ __html: post.title }} />
  }

  if (isExternalUrl(post.link)) {
    return (
      <a href={post.link} target="_blank" rel="noopener noreferrer" dangerouslySetInnerHTML={{ __html: post.title }} />
    )
  }

  return <Link href={post.link} dangerouslySetInnerHTML={{ __html: post.title }} />
}

type ArticlePreviewBoxProps = { preview: HomeArticlePreview; className?: string }

/**
 * One category's article-list card - ports the `ArticlesCategory` +
 * `UiBox.ScrollParalax`/`ScrollContainer` combo from
 * `web/src/templates/home.tsx`. Desktop (`sm` breakpoint up): fixed-height
 * card, header + list scroll together as one region, with a fade at the
 * top/bottom edge. Mobile (below `sm`): only the first article shows and
 * there's no internal scrolling - matches legacy's `ArticleScrollContainer`
 * overriding back to `position: static` below that breakpoint (legacy's
 * `theme.media.xs.down` is a *range* breakpoint, `max-width: 667px` - i.e.
 * "below `sm`", not "below `xs`").
 */
export function ArticlePreviewBox({ preview, className }: ArticlePreviewBoxProps) {
  const { category, articles } = preview

  return (
    <Box fullHeight className={className}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-5 bg-linear-to-b from-white-1 to-transparent sm:block"
      />
      <div className="h-full max-sm:static max-sm:h-auto sm:absolute sm:inset-0 sm:overflow-y-auto">
        <BoxHeader>
          <h2 className="mt-1 font-bold">{category.name}</h2>
        </BoxHeader>
        <div className="px-4 pb-3 xs:px-6 xs:pb-5">
          {articles.map((article, idx) => (
            <div key={article.id} className={cn(idx !== 0 && 'max-sm:hidden')}>
              {idx !== 0 && <hr className="my-3 border-gray-2" />}
              <div className="text-[0.8em] opacity-50">{formatArticleDate(article.date)}</div>
              <ArticleLink post={article} />
              <div
                className="mt-1 text-[0.875em] opacity-70 [&_p]:mt-1"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
            </div>
          ))}
          <div className="mt-6 mb-2 text-center">
            <Link href={category.link} className="font-bold">
              {category.name.toLowerCase() === 'upozornění' ? 'Všechna' : 'Všechny'} {category.name.toLowerCase()}
            </Link>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] hidden h-5 bg-linear-to-t from-white-1 to-transparent sm:block"
      />
    </Box>
  )
}
