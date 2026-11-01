import Link from 'next/link'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { tagLink } from '@/components/filter/tag-switcher'
import type { SiteTag } from '@/lib/content'
import { schoolYearLabel, schoolYearSlug, schoolYearsUntil } from './school-year'

/** School-year chips above the galleries grid ("Vše", 2026/2027 … 2011/2012), styled like the category switcher; keeps the chosen tag. */
export function SchoolYearSwitcher({ current, tag }: { current: number | null; tag: SiteTag | null }) {
  const chip = 'rounded-full border-2 border-ink px-4 py-1.5 font-display font-bold transition-all hover:-translate-y-0.5'

  return (
    <nav aria-label="Školní rok" className="flex flex-wrap gap-2">
      <Link href={tagLink('/fotogalerie/', tag)} aria-current={current == null ? 'page' : undefined} className={cn(chip, current == null ? 'bg-ink text-white-1' : 'bg-paper shadow-pop-sm')}>
        Vše
      </Link>
      {schoolYearsUntil().map((year, idx) => {
        const active = year === current
        return (
          <Link
            key={year}
            href={tagLink(`/fotogalerie/${schoolYearSlug(year)}/`, tag)}
            aria-current={active ? 'page' : undefined}
            className={cn(chip, active ? 'bg-ink text-white-1' : cn(accentAt(idx).tint, 'shadow-pop-sm'))}
          >
            {schoolYearLabel(year)}
          </Link>
        )
      })}
    </nav>
  )
}
