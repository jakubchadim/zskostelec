import Link from 'next/link'
import { SearchX } from 'lucide-react'
import type { Nullable } from '@/lib/wp'

type ArticleEmptyStateProps = {
  /** Link back to the parent (root) category, shown as "Vyčistit filtr" when set. */
  parentCategoryLink: Nullable<string>
}

/**
 * "No articles" state for an empty category page. Ports the
 * `NonIdealState` usage in `web/src/templates/category.tsx`.
 */
export function ArticleEmptyState({ parentCategoryLink }: ArticleEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <SearchX className="size-12 opacity-50" aria-hidden />
      <h2 className="m-0">Články nenalezeny</h2>
      <p className="m-0 opacity-70">Nalezeno 0 článků. Zkuste hledat jinde.</p>
      {parentCategoryLink && (
        <Link
          href={parentCategoryLink}
          className="inline-block rounded-small bg-primary-1 px-4 py-2 font-medium text-white-1 hover:bg-primary-2"
        >
          Vyčistit filtr
        </Link>
      )}
    </div>
  )
}
