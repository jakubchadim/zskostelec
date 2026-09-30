import Link from 'next/link'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import type { WpCategory } from '@/lib/wp'

type CategorySwitcherProps = {
  /** The category currently being viewed. */
  current: WpCategory
  /** Every subcategory under the same root. */
  siblings: WpCategory[]
  /** Root category link ("Vše"). */
  rootLink: string
}

/**
 * Sub-category filter as a row of always-visible chips. Replaces the legacy
 * hidden "vyberte kategorii" dropdown next to the heading - chips show the
 * available options up front and are one tap on a phone.
 */
export function CategorySwitcher({ current, siblings, rootLink }: CategorySwitcherProps) {
  const isRoot = current.parent == null
  const chip = 'rounded-full border-2 border-ink px-4 py-1.5 font-display font-bold transition-all hover:-translate-y-0.5'

  return (
    <nav aria-label="Podkategorie" className="flex flex-wrap gap-2">
      <Link href={rootLink} aria-current={isRoot ? 'page' : undefined} className={cn(chip, isRoot ? 'bg-ink text-white-1' : 'bg-paper shadow-pop-sm')}>
        Vše
      </Link>
      {siblings.map((sibling, idx) => {
        const active = sibling.id === current.id
        return (
          <Link
            key={sibling.id}
            href={sibling.link}
            aria-current={active ? 'page' : undefined}
            className={cn(chip, active ? 'bg-ink text-white-1' : cn(accentAt(idx).tint, 'shadow-pop-sm'))}
          >
            {sibling.name}
          </Link>
        )
      })}
    </nav>
  )
}
