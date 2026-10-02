import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Footprints, Map as MapIcon, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DoodlePopover } from '@/components/ui/doodle-popover'
import { WORKPLACES, type WorkplaceKey } from './data'
import { TownMiniMap, walkFromSquare } from './town-mini-map'

const TINT: Record<string, string> = {
  berry: 'bg-berry-tint',
  sky: 'bg-sky-tint',
  grass: 'bg-grass-tint',
  grape: 'bg-grape-tint'
}

const DECOR: Record<string, string> = {
  berry: 'decoration-berry',
  sky: 'decoration-sky',
  grass: 'decoration-grass',
  grape: 'decoration-grape'
}

type WorkplacePopoverProps = {
  /** Which school building. */
  place: WorkplaceKey
  /** Trigger text; defaults to the building's address. */
  children?: ReactNode
  className?: string
}

/**
 * A school building mentioned in text ("Erbenova 891", "pracoviště
 * Palackého náměstí"): dotted underline in the building's colour, and on
 * hover / tap a card with a doodle map of the town pinning the building,
 * the walk from the square, what's inside and links to the 3D town map and
 * navigation. Usable from server components.
 */
export function WorkplacePopover({ place, children, className }: WorkplacePopoverProps) {
  const w = WORKPLACES.find((item) => item.key === place)!
  const walk = walkFromSquare(place)
  const navUrl = `https://mapy.cz/zakladni?q=${encodeURIComponent(`${w.address}, Kostelec nad Orlicí`)}`

  return (
    <DoodlePopover
      label={`Pracoviště ${w.name}, ${w.address}`}
      triggerClassName={cn(DECOR[w.accent], className)}
      card={
        <>
          <span className={cn('flex items-center gap-3 px-4 pt-4 pb-3', TINT[w.accent])}>
            <Image
              src={`/soubory/pracoviste/${w.key}.jpg`}
              alt=""
              width={96}
              height={96}
              sizes="4rem"
              className="size-16 shrink-0 -rotate-3 rounded-xl border-[2.5px] border-ink object-cover shadow-pop-sm"
            />
            <span className="min-w-0">
              <span className="block text-[0.7rem] font-extrabold tracking-wider text-gray-7 uppercase">Pracoviště školy</span>
              <span className="block font-display text-xl leading-tight font-extrabold text-ink">{w.name}</span>
              <span className="block text-sm font-bold text-gray-7">{w.address}</span>
            </span>
          </span>
          <span className={cn('block px-3 pb-3', TINT[w.accent])}>
            <TownMiniMap active={place} />
          </span>
          <span className="block border-t-[2.5px] border-ink px-4 py-3">
            <span className="flex flex-wrap gap-1.5">
              {w.roles.map((role) => (
                <span key={role} className={cn('rounded-full border-2 border-ink px-2 py-0.5 text-xs font-extrabold', TINT[w.accent])}>
                  {role}
                </span>
              ))}
            </span>
            <span className="mt-2.5 grid gap-1 text-sm text-gray-8">
              <span className="flex items-center gap-2">
                <Footprints className="size-4 shrink-0" aria-hidden />
                {walk === null ? 'Přímo na Palackého náměstí' : `Asi ${walk} min pěšky z náměstí`}
              </span>
              {w.hours && (
                <span className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0" aria-hidden />
                  {w.hours}
                </span>
              )}
            </span>
          </span>
          <span className="grid grid-cols-2 border-t-2 border-dashed border-gray-3 bg-paper font-display text-sm font-bold text-ink">
            <Link href={`/pracoviste/#${w.key}`} className="flex items-center gap-2 px-4 py-2.5 hover:bg-cream">
              <MapIcon className="size-4" aria-hidden />
              Mapa města
            </Link>
            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-l-2 border-dashed border-gray-3 px-4 py-2.5 hover:bg-cream"
            >
              <Navigation className="size-4" aria-hidden />
              Navigovat
            </a>
          </span>
        </>
      }
    >
      {children ?? w.address}
    </DoodlePopover>
  )
}
