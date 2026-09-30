import Link from 'next/link'
import type { Nullable } from '@/lib/wp'
import { PaperPlane } from '@/components/ui/doodles'

type ArticleEmptyStateProps = {
  /** Link back to the parent (root) category, shown as "Zobrazit vše" when set. */
  parentCategoryLink: Nullable<string>
  title?: string
  text?: string
  actionLabel?: string
}

/** Friendly "nothing here yet" state for an empty category page. */
export function ArticleEmptyState({
  parentCategoryLink,
  title = 'Tady zatím nic není',
  text = 'V této rubrice zatím nejsou žádné články. Zkuste se podívat jinam.',
  actionLabel = 'Zobrazit vše'
}: ArticleEmptyStateProps) {
  return (
    <div className="sticker mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-12 text-center">
      <PaperPlane className="w-20 text-sky animate-fly" />
      <h2 className="text-2xl">{title}</h2>
      <p className="m-0 text-gray-7">{text}</p>
      {parentCategoryLink && (
        <Link href={parentCategoryLink} className="btn bg-sun">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
