import Link from 'next/link'
import { cn } from '@/lib/utils'
import { WpImage } from '@/components/image/wp-image'
import { tiltAt } from '@/components/ui/accent'
import type { HeroPhoto } from './hero'

/**
 * Endless, gently scrolling row of polaroids from the latest galleries.
 * The list is rendered twice so the CSS marquee can loop seamlessly; the
 * duplicate is hidden from assistive tech and keyboard. Hovering pauses it.
 */
export function PhotoStrip({ photos }: { photos: HeroPhoto[] }) {
  if (photos.length === 0) {
    return null
  }

  const renderRow = (duplicate: boolean) =>
    photos.map((photo, idx) => (
      <li key={`${duplicate ? 'd' : 'o'}-${photo.link}`} aria-hidden={duplicate || undefined} className="shrink-0 px-3 py-6">
        <Link
          href={photo.link}
          tabIndex={duplicate ? -1 : undefined}
          className={cn(
            'group block w-56 rounded-md border-[2.5px] border-ink bg-paper p-2 pb-3 shadow-pop transition-transform duration-300 hover:scale-105 hover:rotate-0 sm:w-64',
            tiltAt(idx)
          )}
        >
          <span className="relative block aspect-square overflow-hidden rounded-sm bg-gray-3">
            <WpImage media={photo.media} sizes="16rem" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </span>
          <span className="mt-2 line-clamp-1 block px-1 text-center font-display font-bold" dangerouslySetInnerHTML={{ __html: photo.title }} />
        </Link>
      </li>
    ))

  return (
    <div className="group/strip relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
      <ul className="m-0 flex w-max list-none animate-marquee p-0 group-hover/strip:[animation-play-state:paused] group-focus-within/strip:[animation-play-state:paused]">
        {renderRow(false)}
        {renderRow(true)}
      </ul>
    </div>
  )
}
