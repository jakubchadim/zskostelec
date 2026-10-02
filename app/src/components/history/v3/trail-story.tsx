import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowLeft, ArrowUp, BookOpenCheck, Footprints, Stamp as StampIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SchoolMark } from '@/components/ui/school-logo'
import { WaveEdge } from '@/components/ui/doodles'
import { CHAPTERS, ETIQUETTE_RULES, PHOTOS, type Chapter, type Photo } from '../story'
import { Certificate } from './certificate'
import { KCT_RED, KctMark, NaucnaMark, Stamp, stampInk, stampTilt, TrailDefs, WOOD, WoodSign } from './marks'
import { Passport } from './passport'
import { Postcard } from './postcard'
import { SummitScene, TrailheadScene } from './scenery'
import { TrailController } from './trail-controller'
import { Vignette } from './vignettes'
import s from './trail.module.css'

const TOTAL = CHAPTERS.length
/** The river Orlice flows across the trail after this stop. */
const RIVER_AFTER = 'lhota'

/** Extra school photos that belong to a stop's text (second postcard). */
const EXTRA_PHOTOS: Record<string, Photo> = {
  realka: PHOTOS.rolnicka,
  masaryk: PHOTOS.skolaPrace
}

const INK = '#1d2150'

export function TrailStory() {
  return (
    <>
      <TrailDefs />
      <Hero />
      <section id="stezka" aria-labelledby="stezka-title" className={cn(s.map, 'relative overflow-x-clip pt-6 pb-10 sm:pt-10')}>
        <div className="mx-auto w-full max-w-[1100px] px-4">
          <StartSign />
          <TrailController>
            <ol className="relative m-0 list-none p-0">
              {CHAPTERS.map((chapter, i) => (
                <Stop key={chapter.id} chapter={chapter} index={i} />
              ))}
            </ol>
          </TrailController>
        </div>
        <Passport />
      </section>
      <Finish />
    </>
  )
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  return (
    <section className={cn('relative overflow-hidden', s.sky)}>
      <div className="mx-auto grid w-full max-w-[1100px] items-center gap-8 px-4 pt-8 pb-20 md:grid-cols-[1.05fr_1fr] md:pt-12 md:pb-24">
        <div>
          <Link
            href="/historie/"
            className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-bold shadow-pop-sm transition-transform hover:-translate-x-1"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Historie školy
          </Link>
          <p className="mb-2 flex items-center gap-2 font-display text-base font-bold tracking-wide text-[#0f5fb3] uppercase">
            <KctMark className="w-7" />
            Výlet do historie kosteleckých škol
          </p>
          <h1>
            Stezka <span className="highlight">časem</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-8">
            Nazuj boty a vyraz s panem Guthem na procházku sedmi stoletími. Na každé ze {TOTAL} zastávek tě čeká kus příběhu
            kosteleckých škol – a razítko do turistického deníku.
          </p>

          <div className="mt-5 max-w-xl rounded-2xl border-[2.5px] border-ink bg-paper p-4 shadow-pop-sm">
            <p className="m-0 flex gap-3 text-[0.98rem] text-gray-8">
              <SchoolMark outline={INK} className="size-11 shrink-0 -rotate-6" />
              <span>
                <strong className="font-display text-ink">Proč zrovna stezka?</strong> Jiří Guth-Jarkovský, jehož jméno naše
                škola nese, miloval turistiku. Z Kostelce vede červeně značená Stezka Dr. Gutha-Jarkovského – původně 40 km
                až do Letohradu.
              </span>
            </p>
          </div>

          <ul className="mt-5 grid max-w-xl gap-2 text-sm font-bold sm:grid-cols-3">
            <li className="flex items-center gap-2 rounded-full border-2 border-ink bg-sun-tint px-3 py-1.5">
              <Footprints className="size-5 shrink-0" aria-hidden /> Scrolluj = jdi
            </li>
            <li className="flex items-center gap-2 rounded-full border-2 border-ink bg-berry-tint px-3 py-1.5">
              <StampIcon className="size-5 shrink-0" aria-hidden /> Sbírej razítka
            </li>
            <li className="flex items-center gap-2 rounded-full border-2 border-ink bg-grass-tint px-3 py-1.5">
              <BookOpenCheck className="size-5 shrink-0" aria-hidden /> V cíli certifikát
            </li>
          </ul>

          <a href="#stezka" className="btn mt-6 bg-tangerine text-lg text-white-1">
            Vyrazit na stezku
            <ArrowDown className="size-5" aria-hidden />
          </a>
        </div>
        <TrailheadScene className="mx-auto w-full max-w-[34rem]" />
      </div>
      <WaveEdge className={cn('absolute inset-x-0 -bottom-px h-8 w-full sm:h-12', s.waveToMap)} />
    </section>
  )
}

function StartSign() {
  return (
    <div className="relative mb-8 flex justify-start md:justify-center">
      <div className="relative inline-flex flex-col items-center">
        <div
          className="relative rounded-xl border-[2.5px] border-ink px-6 py-2 text-center text-[#fff6e6] shadow-pop"
          style={{ backgroundColor: WOOD, backgroundImage: 'repeating-linear-gradient(178deg, transparent 0 9px, rgba(90,50,15,0.2) 9px 10.5px)' }}
        >
          <h2 id="stezka-title" className="font-display text-3xl leading-tight font-extrabold [text-shadow:0_2px_0_rgba(70,35,8,0.55)]">
            Start!
          </h2>
          <p className="m-0 text-sm font-bold opacity-90">{TOTAL} zastávek · od 14. století po dnešek</p>
        </div>
        <div aria-hidden className="h-6 w-3 border-x-[2.5px] border-ink" style={{ backgroundColor: WOOD }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ stop */

function Stop({ chapter: c, index: i }: { chapter: Chapter; index: number }) {
  const left = i % 2 === 0
  const extra = EXTRA_PHOTOS[c.id]
  const tilt = left ? 2.2 : -2.2

  return (
    <li
      id={c.id}
      data-stop={c.id}
      data-river-after={c.id === RIVER_AFTER ? '' : undefined}
      className={cn(
        s.stop,
        left ? s.left : s.right,
        'relative grid scroll-mt-24 gap-7 pl-11 md:grid-cols-[minmax(0,1fr)_170px_minmax(0,1fr)] md:gap-0 md:pl-0',
        c.id === RIVER_AFTER ? 'pb-32 md:pb-40' : 'pb-16 md:pb-24'
      )}
    >
      {/* mobile: paint mark on the trail in the gutter */}
      <span data-anchor aria-hidden className="absolute top-8 left-[6px] w-[30px] md:hidden">
        <KctMark />
      </span>

      {/* desktop: signpost in the middle column */}
      <div aria-hidden className="relative hidden md:col-start-2 md:row-start-1 md:block md:self-start">
        <Signpost year={c.year} n={i + 1} left={left} />
      </div>

      <div className={cn('min-w-0 md:row-start-1', left ? 'md:col-start-1' : 'md:col-start-3')}>
        <article className={cn('sticker relative px-4 pt-10 pb-6 xs:px-5 sm:px-7', s.card)}>
          <WoodSign year={c.year} className="absolute -top-6 left-4 -rotate-2 sm:left-6" />
          <Stamp
            year={c.year}
            n={i + 1}
            color={stampInk(i)}
            className={cn('pointer-events-none absolute -top-7 -right-3 w-18 sm:-right-5 sm:w-20', s.cardStamp)}
            style={{ '--tilt': `${stampTilt(i)}deg` } as CSSProperties}
          />
          <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-extrabold tracking-wider text-gray-7 uppercase">
            <span>
              Zastávka {i + 1} z {TOTAL}
            </span>
            {c.guth && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-tangerine-tint py-0.5 pr-2.5 pl-1 tracking-normal text-primary-3 normal-case">
                <SchoolMark className="size-5" />
                Ze života pana Gutha
              </span>
            )}
          </p>
          <h3 className="mt-2 pr-12 text-[1.55rem] sm:text-[1.85rem]">
            <span className="sr-only">{c.year}: </span>
            {c.title}
          </h3>
          <div className="mt-3 space-y-3 text-gray-8">
            {c.text.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          {c.fun && (
            <aside className="mt-5 flex items-start gap-3 rounded-2xl border-[2.5px] border-ink bg-grass-tint p-3 pr-4 shadow-pop-sm">
              <NaucnaMark className="mt-0.5 w-7 shrink-0" />
              <p className="m-0 text-[0.98rem] text-gray-8">
                <strong className="block font-display text-[#16784a]">Naučná tabule: věděli jste?</strong>
                {c.fun}
              </p>
            </aside>
          )}
        </article>
      </div>

      <div className={cn('min-w-0 md:row-start-1 md:self-center md:px-3', left ? 'md:col-start-3' : 'md:col-start-1', s.side)}>
        {c.photo ? (
          <div className="mx-auto max-w-[27rem]">
            <Postcard photo={c.photo} year={c.year} tilt={tilt} />
            {extra && <Postcard photo={extra} year={c.year} tilt={-tilt * 1.4} className={cn('-mt-4 w-[86%]', left ? 'ml-auto' : 'mr-auto')} />}
          </div>
        ) : (
          <Vignette id={c.id} className={cn('hidden md:block', left ? 'rotate-2' : '-rotate-2')} />
        )}
      </div>
    </li>
  )
}

/** Wooden post with a white direction plate (year) pointing at the card. */
function Signpost({ year, n, left }: { year: string; n: number; left: boolean }) {
  const pole = left ? 64 : 106
  const plate = left ? 'M6 41 L26 22 H136 V60 H26 Z' : 'M164 41 L144 22 H34 V60 H144 Z'
  const markX = left ? 110 : 40
  const textX = left ? 70 : 100
  const yearSize = year.length <= 4 ? 22 : 16
  return (
    <>
      <svg viewBox="0 0 170 160" className="block w-full" overflow="visible">
        <rect x={pole - 6} y="10" width="12" height="148" rx="3" fill={WOOD} stroke={INK} strokeWidth="2.6" />
        <path d={`M${pole - 9} 10 h18 l-3 -8 h-12 z`} fill="#8a5427" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        {/* KČT mark painted on the post */}
        <rect x={pole - 9} y="110" width="18" height="13" fill="#fff" stroke={INK} strokeWidth="1.8" />
        <rect x={pole - 8} y="114.3" width="16" height="4.4" fill={KCT_RED} />
        <g className={s.plate} style={{ transformOrigin: `${pole}px 30px` }}>
          <path d={plate} fill="#fff" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
          <rect x={markX} y="32" width="20" height="14" rx="1.5" fill="#fff" stroke={INK} strokeWidth="1.8" />
          <rect x={markX + 1} y="36.6" width="18" height="4.8" fill={KCT_RED} />
          <text x={textX} y={41 + yearSize * 0.34} textAnchor="middle" fontSize={yearSize} fontWeight="800" fill={INK} fontFamily="var(--font-display)">
            {year}
          </text>
        </g>
        <rect x={pole - 26} y="70" width="52" height="20" rx="3" fill="#ffcf33" stroke={INK} strokeWidth="2.4" />
        <text x={pole} y="84.5" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily="var(--font-body)">
          č. {n}
        </text>
        <path d={`M${pole - 18} 158 q2 -10 5 -12 M${pole - 12} 158 q0 -12 0 -15 M${pole + 14} 158 q-2 -10 -4 -12`} stroke="#16784a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
      {/* The trail passes beside the post, on the side away from the card. */}
      <span
        data-anchor
        data-side={left ? 1 : -1}
        className="absolute size-2"
        style={{ left: `calc(${((left ? 146 : 24) / 170) * 100}% - 4px)`, top: `calc(${(96 / 160) * 100}% - 4px)` }}
      />
    </>
  )
}

/* ---------------------------------------------------------------- finish */

function Finish() {
  return (
    <section id="cil" aria-labelledby="cil-title" className={cn('relative overflow-hidden pt-4 pb-20', s.finish)}>
      <div className="mx-auto w-full max-w-[1100px] px-4">
        <SummitScene className="mx-auto mb-6 w-full max-w-[30rem]" />
        <div className="text-center">
          <h2 id="cil-title" className="text-[clamp(2.2rem,5vw,3.25rem)]">
            Cíl! <span className="squiggle">Jsi na vrcholu.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-8">
            Ušel(a) jsi cestu od školy u fary až k dnešní škole se čtyřmi budovami. Za všech {TOTAL} razítek ti pan Guth vystaví
            certifikát poutníka.
          </p>
        </div>

        <div className="mt-10">
          <Certificate />
        </div>

        <RulesBoard />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/historie/" className="btn bg-paper">
            <ArrowLeft className="size-5" aria-hidden />
            Zpět na Historii školy
          </Link>
          <a href="#stezka" className="btn bg-sky-tint">
            Ještě jednou od startu
            <ArrowUp className="size-5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}

function RulesBoard() {
  return (
    <section aria-labelledby="rady-title" className="mx-auto mt-16 max-w-3xl">
      <div
        className="rounded-[1.4rem] border-[2.5px] border-ink p-3 shadow-pop-lg sm:p-4"
        style={{ backgroundColor: WOOD, backgroundImage: 'repeating-linear-gradient(176deg, transparent 0 11px, rgba(90,50,15,0.2) 11px 12.5px)' }}
      >
        <div className="rounded-xl border-[2.5px] border-ink bg-paper px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <NaucnaMark className="w-8 shrink-0" />
            <h3 id="rady-title" className="text-[1.6rem] sm:text-[1.9rem]">
              Rady na cestu od pana Gutha
            </h3>
          </div>
          <p className="mt-2 text-gray-8">
            Pan Guth byl ceremoniářem prezidenta a o slušném chování napsal celé knihy. Tady jsou tři rady z jeho Společenského
            katechismu – hodí se na stezce, ve škole i doma.
          </p>
          <ol className="mt-5 space-y-4">
            {ETIQUETTE_RULES.map((rule, i) => (
              <li key={rule} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-full border-[2.5px] border-ink font-display text-lg font-extrabold text-white-1 shadow-pop-sm"
                  style={{ backgroundColor: stampInk(i) }}
                >
                  {i + 1}
                </span>
                <blockquote className="m-0 pt-1 font-display text-[1.2rem] leading-snug font-semibold text-ink">„{rule}“</blockquote>
              </li>
            ))}
          </ol>
          <p className="mt-5 mb-0 text-right text-sm font-bold text-gray-7">— J. S. Guth-Jarkovský, Společenský katechismus</p>
        </div>
      </div>
      {/* the board's legs */}
      <div aria-hidden className="mx-auto flex max-w-xl justify-between px-10">
        <span className="block h-12 w-4 border-x-[2.5px] border-b-[2.5px] border-ink" style={{ backgroundColor: WOOD }} />
        <span className="block h-12 w-4 border-x-[2.5px] border-b-[2.5px] border-ink" style={{ backgroundColor: WOOD }} />
      </div>
    </section>
  )
}
