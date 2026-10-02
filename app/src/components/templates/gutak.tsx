import { notFound } from 'next/navigation'
import { WpImage } from '@/components/image/wp-image'
import { tiltAt } from '@/components/ui/accent'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'
import { getGutaky, type WpGutak } from '@/lib/wp'
import { getPageById, type ResolvedRoute } from '@/lib/content'
import { PageBody } from './page-body'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

function GutakCard({ gutak, index }: { gutak: WpGutak; index: number }) {
  return (
    <a
      href={gutak.fileUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'group block rounded-lg border-[2.5px] border-ink bg-paper p-2 shadow-pop transition-transform duration-300 hover:z-10 hover:scale-105 hover:rotate-0',
        tiltAt(index)
      )}
    >
      <span className="relative block aspect-[3/4] overflow-hidden rounded-md border-2 border-ink/10 bg-sun-tint">
        {gutak.preview ? (
          <WpImage
            media={gutak.preview}
            alt=""
            sizes="(min-width: 55.125em) 25vw, (min-width: 26em) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- bundled magazine logo used as a cover placeholder
          <img
            src="/gutak-placeholder.png"
            alt=""
            className="absolute inset-0 h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-300 group-hover:-rotate-3"
          />
        )}
      </span>
      <span className="flex items-center justify-between gap-2 px-1 pt-3 pb-1">
        <span className="font-display text-lg font-bold">{gutak.title}</span>
        <span className="rounded-full border-2 border-ink bg-sun px-2 text-xs font-extrabold">Číst</span>
      </span>
    </a>
  )
}

/** Guťák (school magazine): hero + intro + a wall of tilted magazine covers. */
export async function GutakTemplate({ data }: TemplateProps) {
  const route = data as PageRouteData
  const [page, gutaky] = await Promise.all([getPageById(route.id), getGutaky()])

  if (!page) {
    notFound()
  }

  return (
    <>
      <PageHero title={null} titleHtml={page.title} colorKey="gutak" eyebrow="Píšou žáci" />
      <PageBody page={page} intro />
      <Container className="pt-4">
        <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 md:grid-cols-4 md:gap-8">
          {gutaky.map((gutak, idx) => (
            <li key={gutak.id}>
              <Reveal delay={(idx % 4) * 70}>
                <GutakCard gutak={gutak} index={idx} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
