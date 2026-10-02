import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowLeft, Hand, HeartHandshake, RotateCcw, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accentAt, tiltAt } from '@/components/ui/accent'
import { Sparkle, Squiggle, Star } from '@/components/ui/doodles'
import { SchoolMark } from '@/components/ui/school-logo'
import { CHAPTERS, ETIQUETTE_RULES } from '../story'
import { ChapterCard } from './chapter-card'
import { Director } from './director'
import { FOCUS, LAST_STEP, reelsFor, stampFor } from './steps'
import { Town } from './town'
import css from './journey.module.css'

const STAGE_ID = 'v1-stage'
const ROOT_ID = 'v1-root'
const HERO_ID = 'zacatek'

/** Odometer-style year: four rolling reels (0-9 and "?"). */
function Odometer() {
  const glyphs = '0123456789?'.split('')
  return (
    <div
      data-v1-hud
      aria-hidden
      className="absolute -top-3 -left-2 z-10 -rotate-2 rounded-2xl border-[2.5px] border-ink bg-paper px-2.5 pt-1 pb-1 shadow-pop sm:-top-5 sm:-left-4 sm:px-3.5 sm:pt-1.5"
    >
      <div className="flex font-display text-[1.7rem] leading-none font-extrabold tabular-nums sm:text-[3.1rem]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn('block h-[1.1em] w-[0.6em] overflow-hidden', i === 3 && 'text-primary-3')}
            style={{ '--r': `var(--r${i}, 10)` } as CSSProperties}
          >
            <span className={css.reel} style={{ transitionDelay: `${i * 90}ms` }}>
              {glyphs.map((glyph) => (
                <span key={glyph}>{glyph}</span>
              ))}
            </span>
          </span>
        ))}
      </div>
      <span
        data-v1-stamp
        hidden
        className="absolute -right-3 -bottom-3 rotate-3 rounded-full border-2 border-ink bg-berry px-2 py-0.5 font-display text-xs leading-tight font-extrabold whitespace-nowrap text-white-1 shadow-pop-sm sm:text-sm"
      />
    </div>
  )
}

/** The sticky "window" with the drawn town, the odometer and the chapter dots. */
function Stage() {
  return (
    <div
      id={STAGE_ID}
      data-last={LAST_STEP}
      className={cn(
        css.stage,
        'sticky top-[82px] z-20 -mx-4 flex h-[44svh] flex-col bg-cream/90 px-4 pt-4 pb-1 backdrop-blur-sm',
        'sm:mx-0 sm:h-[calc(100svh-82px)] sm:self-start sm:bg-transparent sm:px-0 sm:pt-9 sm:pb-4 sm:backdrop-blur-none md:top-[92px] md:h-[calc(100svh-92px)]'
      )}
      style={{ '--step': 0 } as CSSProperties}
    >
      <div className="grid min-h-0 flex-1 place-items-center [container-type:size]">
        <div className="relative h-[min(100cqh,80cqw)] w-[min(100cqw,125cqh)]">
          <div className="absolute inset-0 overflow-hidden rounded-[1.4rem] border-[2.5px] border-ink bg-sky-tint shadow-pop sm:rounded-[2rem] sm:shadow-pop-lg">
            <Town className="block size-full" />
          </div>
          <Odometer />
        </div>
      </div>
      <nav aria-label="Kapitoly příběhu" className="relative mx-auto mt-2 w-full max-w-xl sm:mt-4">
        <div aria-hidden className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-3">
          <div className={cn(css.progress, 'h-full rounded-full bg-tangerine')} />
        </div>
        <ol className="relative m-0 flex list-none justify-between p-0">
          <li>
            <a
              href={`#${HERO_ID}`}
              data-v1-dot={HERO_ID}
              title="Začátek"
              aria-label="Začátek příběhu"
              className={cn(css.dot, 'group block rounded-full p-[3px] sm:p-1')}
            >
              <span className="block size-2 rounded-full border-2 border-ink bg-paper transition-transform group-hover:scale-125 sm:size-3" />
            </a>
          </li>
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                data-v1-dot={chapter.id}
                title={`${chapter.year} – ${chapter.title}`}
                aria-label={`${chapter.year}: ${chapter.title}`}
                className={cn(css.dot, 'group block rounded-full p-[3px] sm:p-1')}
              >
                <span
                  className={cn(
                    'block size-2 rounded-full border-2 border-ink transition-transform group-hover:scale-125 sm:size-3',
                    chapter.guth ? 'bg-sun' : 'bg-paper'
                  )}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

function Hero() {
  return (
    <section
      id={HERO_ID}
      data-v1-step={0}
      data-reels="????"
      aria-labelledby="v1-title"
      className="relative flex min-h-[48svh] flex-col justify-center py-10 sm:min-h-[calc(100svh-92px)] sm:py-16"
    >
      <Star aria-hidden className="absolute top-6 right-2 w-10 rotate-12 animate-float text-sun sm:top-14" />
      <Sparkle aria-hidden className="absolute right-[30%] bottom-[18%] hidden w-6 animate-float-slow text-berry sm:block" />
      <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-extrabold tracking-wide text-primary-3 uppercase shadow-pop-sm">
        Příběh naší školy
      </p>
      <h1 id="v1-title" className="text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95]">
        Cesta{' '}
        <span className="relative inline-block">
          časem
          <Squiggle aria-hidden className="absolute -bottom-2 left-0 h-4 w-full text-sun sm:-bottom-3 sm:h-5" />
        </span>
      </h1>
      <p className="mt-5 max-w-xl text-lg text-gray-8">
        Nasedněte do stroje času! Jak budete rolovat, kreslený Kostelec poroste – od školy u fary ve 14. století až po dnešní
        školu. A cestou potkáme kluka s brýlemi, po kterém se naše škola jmenuje.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="group flex items-center gap-2 rounded-full border-2 border-ink bg-tangerine-tint py-1 pr-4 pl-1 font-display font-bold shadow-pop-sm">
          <SchoolMark className="size-9" />
          Průvodce: pan Guth
        </span>
        <Link
          href="/historie/"
          className="text-sm font-bold text-secondary-3 underline decoration-2 underline-offset-4 hover:text-ink"
        >
          Raději klasická historie
        </Link>
      </div>
      <a
        href={`#${CHAPTERS[0].id}`}
        className={cn(
          css.hint,
          'mt-10 inline-flex w-fit items-center gap-2 font-display text-lg font-bold text-gray-7 hover:text-ink'
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full border-[2.5px] border-ink bg-sun shadow-pop-sm">
          <ArrowDown className="size-5" aria-hidden />
        </span>
        Rolujte dolů a sledujte, jak město roste
      </a>
    </section>
  )
}

const RULE_ICONS = [Hand, Utensils, HeartHandshake]

function Ending() {
  return (
    <section
      aria-labelledby="v1-guth-rules"
      className="relative overflow-hidden border-t-[2.5px] border-ink bg-sun-tint py-16 sm:py-22"
    >
      <Squiggle aria-hidden className="absolute top-8 -right-6 w-40 -rotate-6 text-tangerine opacity-70" />
      <Star aria-hidden className="absolute bottom-10 left-[4%] hidden w-12 -rotate-12 animate-float text-berry sm:block" />
      <div className="mx-auto w-full max-w-site px-4 sm:px-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="group shrink-0">
            <SchoolMark outline="#1d2150" className="size-24 [filter:drop-shadow(4px_4px_0_#1d2150)] sm:size-32" />
          </span>
          <div>
            <h2 id="v1-guth-rules">Co by na to řekl pan Guth?</h2>
            <p className="mt-3 max-w-2xl text-lg text-gray-8">
              Kluk s brýlemi z Kostelce se stal ceremoniářem prezidenta a napsal Společenský katechismus. Tady jsou tři jeho rady,
              které se hodí i o přestávce:
            </p>
          </div>
        </div>
        <ul className="m-0 mt-10 grid list-none gap-7 p-0 md:grid-cols-3">
          {ETIQUETTE_RULES.map((rule, i) => {
            const accent = accentAt(i + 2)
            const Icon = RULE_ICONS[i % RULE_ICONS.length]
            return (
              <li key={rule} className={cn('sticker hover-lift relative p-6 pt-8', tiltAt(i + 1))}>
                <span
                  className={cn(
                    'absolute -top-6 left-5 flex size-12 items-center justify-center rounded-2xl border-[2.5px] border-ink shadow-pop-sm',
                    accent.bg
                  )}
                >
                  <Icon className="size-6" aria-hidden />
                </span>
                <p className={cn('text-xs font-extrabold tracking-[0.14em] uppercase', accent.text)}>Rada č. {i + 1}</p>
                <blockquote className="m-0 mt-2 font-display text-xl leading-snug font-semibold text-ink">„{rule}“</blockquote>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 text-sm text-gray-7">Citáty z knihy J. Gutha-Jarkovského Společenský katechismus.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/historie/" className="btn bg-tangerine text-ink">
            <ArrowLeft className="size-5" aria-hidden />
            Zpět na Historii
          </Link>
          <a href={`#${HERO_ID}`} className="btn bg-paper">
            <RotateCcw className="size-5" aria-hidden />
            Cestovat znovu
          </a>
        </div>
      </div>
    </section>
  )
}

/** /historie-1/ - "Cesta časem": scrollytelling over a hand-drawn town that grows with the story. */
export function Journey() {
  return (
    <div id={ROOT_ID}>
      {/* No JS: show the finished town and hide the scroll-only HUD. */}
      <noscript>
        <style>{`#${STAGE_ID}{--step:99 !important}#${STAGE_ID} [data-v1-hud]{display:none}`}</style>
      </noscript>
      <div className="mx-auto w-full max-w-[90rem] px-4 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:px-6 md:grid-cols-[11fr_9fr] lg:gap-x-14">
        <Stage />
        <div className="relative pb-[30svh] sm:pb-[35svh]">
          <div
            aria-hidden
            className="absolute top-[calc(100svh-92px)] bottom-[30svh] left-1/2 hidden w-0 border-l-[3px] border-dashed border-gray-4 sm:block"
          />
          <Hero />
          {CHAPTERS.map((chapter, index) => {
            const focus = chapter.scene ? FOCUS[chapter.scene] : undefined
            const stamp = stampFor(chapter)
            return (
              <article
                key={chapter.id}
                id={chapter.id}
                data-v1-step={index + 1}
                data-reels={reelsFor(chapter)}
                data-stamp={stamp || undefined}
                data-fx={focus?.[0]}
                data-fy={focus?.[1]}
                className={cn(
                  css.chapter,
                  'relative flex min-h-[62svh] scroll-mt-[44svh] items-center py-12 sm:min-h-[80svh] sm:scroll-mt-28'
                )}
              >
                <ChapterCard chapter={chapter} index={index} total={CHAPTERS.length} />
              </article>
            )
          })}
        </div>
      </div>
      <Ending />
      <Director stageId={STAGE_ID} rootId={ROOT_ID} />
    </div>
  )
}
