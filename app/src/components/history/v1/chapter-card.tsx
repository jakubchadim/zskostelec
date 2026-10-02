import Image from 'next/image'
import { Maximize2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt, tiltAt } from '@/components/ui/accent'
import { SchoolMark } from '@/components/ui/school-logo'
import type { Chapter, Photo } from '../story'
import css from './journey.module.css'

/** Archival photo as a taped polaroid; click opens a native popover lightbox (no JS needed). */
export function Polaroid({ photo, id, index }: { photo: Photo; id: string; index: number }) {
  const popId = `foto-${id}`
  return (
    <figure className={cn('relative mx-auto mt-7 w-[88%] max-w-sm', index % 2 ? 'rotate-2' : '-rotate-2')}>
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 z-10 h-6 w-22 -translate-x-1/2 -rotate-3 bg-sun/70 shadow-small [clip-path:polygon(3%_0,100%_6%,97%_100%,0_92%)]"
      />
      <button
        type="button"
        popoverTarget={popId}
        className="group block w-full cursor-zoom-in border-[2.5px] border-ink bg-white-1 p-2.5 pb-1.5 text-left shadow-pop transition-transform duration-200 hover:-translate-y-1 hover:rotate-1 hover:shadow-pop-lg"
        aria-label={`Zvětšit fotografii: ${photo.caption}`}
      >
        <span className="relative block aspect-[4/3] overflow-hidden bg-gray-2">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 668px) 360px, 88vw"
            className={cn('object-cover object-[50%_30%]', css.sepia)}
          />
          <span
            aria-hidden
            className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full border-2 border-ink bg-paper opacity-0 shadow-pop-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Maximize2 className="size-4" />
          </span>
        </span>
        <figcaption className="px-1 pt-2 pb-1 font-display text-[0.95rem] leading-snug font-semibold text-gray-8">
          {photo.caption}
          {photo.credit && <span className="mt-0.5 block font-sans text-xs font-normal text-gray-7">{photo.credit}</span>}
        </figcaption>
      </button>
      <div id={popId} popover="auto" className={css.lightbox}>
        <div className="relative rotate-[-0.6deg] border-[2.5px] border-ink bg-white-1 p-3 shadow-pop-lg">
          <span className="relative block h-[min(72vh,640px)] w-[min(84vw,860px)]">
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(min-width: 900px) 860px, 84vw"
              className={cn('object-contain', css.sepia)}
            />
          </span>
          <p className="mt-2 max-w-[60ch] font-display text-base font-semibold text-ink">
            {photo.caption}
            {photo.credit && <span className="block font-sans text-xs font-normal text-gray-7">{photo.credit}</span>}
          </p>
          <button
            type="button"
            popoverTarget={popId}
            popoverTargetAction="hide"
            className="absolute -top-4 -right-4 flex size-11 items-center justify-center rounded-full border-[2.5px] border-ink bg-sun shadow-pop-sm transition-transform hover:rotate-90"
            aria-label="Zavřít fotografii"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </figure>
  )
}

/** "Víte, že…?" bubble, spoken by little Mr Guth (the school mark) as the story's guide. */
function FunBubble({ text, tint }: { text: string; tint: string }) {
  return (
    <div className="mt-6 flex items-end gap-3">
      <span className="group shrink-0" aria-hidden>
        <SchoolMark outline="#1d2150" className="size-12 [filter:drop-shadow(2px_2px_0_#1d2150)] sm:size-14" />
      </span>
      <p
        className={cn(
          'relative mb-3 rounded-[1.25rem] rounded-bl-none border-[2.5px] border-ink px-4 py-3 text-[0.98rem] leading-snug font-semibold shadow-pop-sm',
          tint
        )}
      >
        <span className="block font-display text-sm font-extrabold tracking-wide uppercase opacity-80">Víte, že…?</span>
        {text}
      </p>
    </div>
  )
}

export function ChapterCard({ chapter, index, total }: { chapter: Chapter; index: number; total: number }) {
  const accent = accentAt(index)
  return (
    <div className={cn(css.card, 'sticker relative px-5 pt-7 pb-6 sm:px-7')}>
      <div className="absolute -top-5 left-4 flex flex-wrap items-center gap-2 sm:left-6">
        <span
          className={cn(
            'rounded-full border-[2.5px] border-ink px-3.5 py-0.5 font-display text-lg font-extrabold shadow-pop-sm',
            accent.bg,
            tiltAt(index)
          )}
        >
          {chapter.year}
        </span>
        {chapter.guth && (
          <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-tangerine-tint py-0.5 pr-3 pl-1 text-xs font-extrabold text-primary-3 shadow-pop-sm">
            <SchoolMark className="size-5" />
            Ze života pana Gutha
          </span>
        )}
      </div>
      <p className="mb-1 text-xs font-extrabold tracking-[0.14em] text-gray-7 uppercase">
        Kapitola {index + 1} / {total}
      </p>
      <h2 className="text-[1.6rem] sm:text-[1.85rem]">{chapter.title}</h2>
      <div className="mt-3 space-y-3 text-gray-8">
        {chapter.text.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {chapter.fun && <FunBubble text={chapter.fun} tint={accent.tint} />}
      {chapter.photo && <Polaroid photo={chapter.photo} id={chapter.id} index={index} />}
    </div>
  )
}
