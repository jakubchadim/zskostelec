import Link from 'next/link'
import {
  ArrowUpRight,
  BookOpen,
  Camera,
  FileSearch,
  Laptop,
  Link2,
  Newspaper,
  Trophy,
  Users,
  Utensils,
  type LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/components/nav/types'
import { accentAt } from '@/components/ui/accent'
import { Reveal } from '@/components/ui/reveal'

/** Picks an icon for a fast-menu item from its title/URL - editors don't have to configure anything. */
function iconFor(item: NavItem): LucideIcon {
  const key = `${item.title} ${item.url}`.toLowerCase()
  const rules: [RegExp, LucideIcon][] = [
    [/edupage|web|online/, Laptop],
    [/úspěch|uspech|ocen/, Trophy],
    [/zaměst|zamest|učitel|kontakt/, Users],
    [/dokument|formul/, FileSearch],
    [/foto|galer/, Camera],
    [/strav|jídel|jidel|oběd/, Utensils],
    [/časopis|gut/, Newspaper],
    [/družin|druzin|kroužk/, BookOpen]
  ]
  return rules.find(([re]) => re.test(key))?.[1] ?? Link2
}

type QuickLinksProps = {
  items: NavItem[]
}

/** Big colourful icon tiles for the most-used destinations (the two WP "fast menus"). */
export function QuickLinks({ items }: QuickLinksProps) {
  const links = items.filter((item) => item.url && item.url !== '#' && item.url !== '/#')

  if (links.length === 0) {
    return null
  }

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-5">
      {links.map((item, idx) => {
        const Icon = iconFor(item)
        const accent = accentAt(idx + 1)
        const external = item.url.startsWith('http') || item.target === '_blank'
        const cls = cn(
          'group sticker hover-lift flex h-full flex-col items-start gap-3 p-4 sm:p-5',
          accent.tint
        )
        const content = (
          <>
            <span
              className={cn(
                'grid size-12 place-items-center rounded-2xl border-[2.5px] border-ink bg-paper transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110'
              )}
            >
              <Icon className={cn('size-6', accent.text)} aria-hidden />
            </span>
            <span className="flex w-full items-end justify-between gap-2 font-display text-lg leading-tight font-bold">
              {item.title}
              {external && <ArrowUpRight className="size-4 shrink-0 opacity-60" aria-label="(nové okno)" />}
            </span>
          </>
        )

        return (
          <li key={`${item.url}-${idx}`}>
            <Reveal delay={idx * 70} className="h-full">
              {external ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className={cls}>
                  {content}
                </a>
              ) : (
                <Link href={item.url} className={cls}>
                  {content}
                </Link>
              )}
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
