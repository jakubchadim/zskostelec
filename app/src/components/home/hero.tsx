import Link from 'next/link'
import { ArrowRight, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { Blob, Cloud, PaperPlane, Pencil, Sparkle, Star, Sun, WaveEdge } from '@/components/ui/doodles'
import { WpImage } from '@/components/image/wp-image'
import type { WpMediaLike, WpPost } from '@/lib/wp'
import { isExternalUrl } from './is-external-url'
import { TownPopover } from './town-popover'

export type HeroPhoto = { media: WpMediaLike; title: string; link: string }

type HeroProps = {
  mainPost: WpPost | null
  photos: HeroPhoto[]
  /** In-page anchor of the news section, or null when the homepage has none. */
  newsAnchor: string | null
}

const POLAROID_LAYOUT = [
  'left-[4%] top-[6%] w-[58%] -rotate-6 z-10',
  'right-[2%] top-[0%] w-[48%] rotate-[5deg] z-20',
  'left-[22%] bottom-[2%] w-[56%] rotate-2 z-30'
]

function Polaroid({ photo, className, priority }: { photo: HeroPhoto; className: string; priority?: boolean }) {
  return (
    <Link
      href={photo.link}
      className={cn(
        'group absolute block rounded-md border-[2.5px] border-ink bg-paper p-2 pb-9 shadow-pop transition-all duration-300 hover:z-40 hover:scale-105 hover:rotate-0',
        className
      )}
    >
      <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-gray-3">
        <WpImage
          media={photo.media}
          sizes="(min-width: 55.125em) 22vw, 50vw"
          priority={priority}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
      <span
        className="absolute inset-x-2 bottom-1.5 truncate text-center font-display text-sm font-bold text-gray-8"
        dangerouslySetInnerHTML={{ __html: photo.title }}
      />
      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-4deg] rounded-sm bg-sun/80" />
    </Link>
  )
}

/**
 * Homepage hero: big friendly headline, two CTAs, a "Právě teď" sticker
 * with the main post, and a polaroid collage of the latest gallery photos,
 * surrounded by floating doodles.
 */
export function Hero({ mainPost, photos, newsAnchor }: HeroProps) {
  const mainLink = mainPost?.link ?? null

  return (
    <section className="relative overflow-hidden bg-tangerine-tint">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Blob className="absolute -top-24 -left-24 w-80 text-sun/50" />
        <Blob className="absolute -right-32 bottom-0 w-[28rem] rotate-90 text-berry-tint" />
        <Cloud className="absolute top-8 hidden w-32 text-white-1 animate-drift sm:block" />
        <Cloud className="absolute top-40 hidden w-20 text-white-1 animate-drift [animation-delay:-20s] sm:block" />
        <Star className="absolute top-[18%] left-[46%] hidden w-9 text-sun animate-float md:block" />
        <Sparkle className="absolute bottom-[22%] left-[6%] w-8 text-sky animate-float-slow" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 pt-10 pb-24 md:grid-cols-[1.1fr_1fr] md:pt-16 md:pb-32">
          <div className="animate-pop-in">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-extrabold shadow-pop-sm">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grass opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-grass" />
              </span>
              ZŠ Gutha-Jarkovského
            </span>
            <h1 className="relative mt-5 text-[2.6rem] leading-[1.05] sm:text-6xl md:text-[4.2rem]">
              Učíme se <span className="squiggle whitespace-nowrap text-primary-3">s&nbsp;radostí</span>
              <br />a objevujeme svět
              <Sun className="absolute -top-20 right-[12%] hidden w-18 text-sun animate-spin-slow sm:block" />
            </h1>
            <p className="mt-6 max-w-lg text-lg text-gray-8">
              Základní škola v srdci <TownPopover>Kostelce nad Orlicí</TownPopover>. Tady najdete novinky ze tříd, fotky z
              výletů, dokumenty i kontakty na naše učitele.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {newsAnchor && (
                <Link href={newsAnchor} className="btn bg-tangerine text-lg text-ink">
                  Co je nového
                  <ArrowRight className="size-5" aria-hidden />
                </Link>
              )}
              <a
                href="https://zsgjkno.edupage.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-paper text-lg"
              >
                EduPage
              </a>
            </div>

            {mainPost && mainLink && (
              <Link
                href={mainLink}
                target={isExternalUrl(mainLink) ? '_blank' : undefined}
                rel={isExternalUrl(mainLink) ? 'noopener noreferrer' : undefined}
                className="group sticker hover-lift mt-10 flex max-w-lg items-center gap-4 p-4"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-berry text-white-1 group-hover:animate-wiggle">
                  <Megaphone className="size-6" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-extrabold tracking-wider text-[#b3164a] uppercase">Právě teď</span>
                  <span className="block font-display text-lg leading-snug font-bold" dangerouslySetInnerHTML={{ __html: mainPost.title }} />
                </span>
                <ArrowRight className="ml-auto size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            )}
          </div>

          <div className="relative mx-auto aspect-[1/0.92] w-full max-w-[34rem]">
            {photos.length > 0 ? (
              photos
                .slice(0, 3)
                .map((photo, idx) => (
                  <Polaroid key={photo.link} photo={photo} className={cn(POLAROID_LAYOUT[idx], 'animate-pop-in')} priority={idx === 0} />
                ))
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- bundled illustration
              <img src="/school.png" alt="" className="absolute inset-0 h-full w-full object-contain" />
            )}
            <PaperPlane className="absolute -top-6 left-[38%] z-40 w-16 text-sky animate-fly" />
            <Pencil className="absolute right-[-2%] bottom-[8%] z-40 w-14 rotate-12 text-sun animate-float-slow" />
          </div>
        </div>
      </Container>

      <WaveEdge className="absolute inset-x-0 -bottom-px h-10 w-full text-cream sm:h-16" />
    </section>
  )
}
