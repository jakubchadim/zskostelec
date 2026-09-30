import Link from 'next/link'
import { ArrowRight, Pin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatArticleDate, isExternalHref } from '@/components/article/article'
import { tiltAt } from '@/components/ui/accent'
import { Reveal } from '@/components/ui/reveal'
import type { HomeArticlePreview } from './home.normalize'
import { allLabel } from './section-heading'

const NOTE_COLORS = ['bg-sun-tint', 'bg-sky-tint', 'bg-berry-tint', 'bg-grass-tint', 'bg-grape-tint', 'bg-tangerine-tint']
const PIN_COLORS = ['text-berry', 'text-sky', 'text-grass', 'text-grape', 'text-tangerine', 'text-berry']

/**
 * "Nástěnka" - the notices category rendered as pinned sticky notes on a
 * cork-ish board. Important-but-short info (school supplies lists, holiday
 * opening hours) reads naturally as notes rather than as news cards.
 */
export function NoticeBoard({ preview }: { preview: HomeArticlePreview }) {
  const { category, articles } = preview

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="relative rounded-[2rem] border-[2.5px] border-ink bg-[#d9a066] p-4 shadow-pop-lg sm:p-8">
      {/* cork speckle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(#8b5a2b 1.2px, transparent 1.4px), radial-gradient(#f3c48c 1px, transparent 1.2px)',
          backgroundSize: '14px 14px, 19px 19px',
          backgroundPosition: '0 0, 7px 9px'
        }}
      />
      <ul className="relative m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, idx) => {
          const external = article.link != null && isExternalHref(article.link)
          const note = (
            <>
              <Pin
                className={cn('absolute -top-3 left-1/2 size-7 -translate-x-1/2 rotate-12 fill-current drop-shadow', PIN_COLORS[idx % PIN_COLORS.length])}
                aria-hidden
              />
              <span className="block text-xs font-extrabold tracking-wide text-gray-7">{formatArticleDate(article.date)}</span>
              <span className="mt-1 block font-display text-xl leading-snug font-bold" dangerouslySetInnerHTML={{ __html: article.title }} />
              <span
                className="mt-2 line-clamp-3 block text-[0.95rem] text-gray-8 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
            </>
          )
          const cls = cn(
            'relative block h-full rounded-md border-2 border-ink p-5 pt-6 shadow-pop transition-transform duration-300 hover:z-10 hover:scale-[1.03] hover:rotate-0',
            NOTE_COLORS[idx % NOTE_COLORS.length],
            tiltAt(idx)
          )

          return (
            <li key={article.id} className={idx >= 3 ? 'max-sm:hidden' : undefined}>
              <Reveal delay={idx * 80} className="h-full">
                {article.link == null ? (
                  <div className={cls}>{note}</div>
                ) : external ? (
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className={cls}>
                    {note}
                  </a>
                ) : (
                  <Link href={article.link} className={cls}>
                    {note}
                  </Link>
                )}
              </Reveal>
            </li>
          )
        })}
      </ul>
      <div className="relative mt-8 text-center">
        <Link href={category.link} className="btn bg-paper">
          {allLabel(category.name)}
          <ArrowRight className="size-5" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
