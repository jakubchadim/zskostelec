import Link from 'next/link'
import { cn } from '@/lib/utils'
import { accentAt } from '@/components/ui/accent'
import { schoolYearLabel, schoolYearSlug, schoolYearsUntil } from './school-year'

/** School-year chips above the galleries grid ("Vše", 2026/2027 … 2011/2012), styled like the category switcher. */
export function SchoolYearSwitcher({ current }: { current: number | null }) {
  const chip = 'rounded-full border-2 border-ink px-4 py-1.5 font-display font-bold transition-all hover:-translate-y-0.5'

  return (
    <nav aria-label="Školní rok" className="flex flex-wrap gap-2">
      <Link href="/fotogalerie/" aria-current={current == null ? 'page' : undefined} className={cn(chip, current == null ? 'bg-ink text-white-1' : 'bg-paper shadow-pop-sm')}>
        Vše
      </Link>
      {schoolYearsUntil().map((year, idx) => {
        const active = year === current
        return (
          <Link
            key={year}
            href={`/fotogalerie/${schoolYearSlug(year)}/`}
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
