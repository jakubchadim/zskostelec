import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { Container } from '@/components/ui/container'
import { accentAt } from '@/components/ui/accent'
import { Reveal } from '@/components/ui/reveal'
import { staticPageMetadata } from '@/components/static/meta'
import { cn } from '@/lib/utils'

export const metadata = staticPageMetadata({
  title: 'Dotační programy, projekty',
  description: 'Projekty školy financované z dotací: Operační program Jan Amos Komenský, Etické dílny II, Bezpečné klima školy.',
  path: '/dotacni-programy-projekty/'
})

const PROJECTS = [
  {
    title: 'Operační program Jan Amos Komenský',
    text: 'Projekt spolufinancovaný Evropskou unií a Ministerstvem školství, mládeže a tělovýchovy.',
    logo: { src: '/soubory/dotacni-programy-projekty/logo-eu-msmt.png', width: 2326, height: 332, alt: 'Spolufinancováno Evropskou unií, MŠMT' }
  },
  {
    title: 'Etické dílny II',
    text: 'Projekt etické výchovy podpořený Královéhradeckým krajem.',
    logo: { src: '/soubory/dotacni-programy-projekty/logo-khk.png', width: 3239, height: 842, alt: 'Královéhradecký kraj' }
  },
  {
    title: 'Bezpečné klima školy VI. – Spolu a bezpečně',
    text: 'Královéhradecký kraj je poskytovatelem dotace na realizaci projektu v době od 1. 8. 2024 do 31. 7. 2025.',
    period: '1. 8. 2024 – 31. 7. 2025',
    logo: { src: '/soubory/dotacni-programy-projekty/logo-khk.png', width: 3239, height: 842, alt: 'Královéhradecký kraj' }
  }
]

export default function DotacniProgramyPage() {
  return (
    <>
      <PageHero
        title="Dotační programy, projekty"
        colorKey="dotacni-programy-projekty"
        eyebrow="O škole"
        lead="Díky dotacím můžeme dělat víc – od etické výchovy po prevenci. Tady jsou projekty, do kterých je škola zapojená."
      />
      <Container className="py-10">
        <ul className="m-0 grid list-none gap-6 p-0">
          {PROJECTS.map((p, idx) => (
            <li key={p.title}>
              <Reveal delay={idx * 80}>
                <article className="sticker grid gap-5 overflow-hidden p-0 md:grid-cols-[1fr_1.2fr]">
                  <div className={cn('flex flex-col justify-center gap-2 p-6', accentAt(idx).tint)}>
                    {p.period && (
                      <span className="w-fit rounded-full border-2 border-ink bg-paper px-3 py-0.5 text-sm font-extrabold">{p.period}</span>
                    )}
                    <h2 className="text-2xl sm:text-3xl">{p.title}</h2>
                    <p className="m-0 text-gray-8">{p.text}</p>
                  </div>
                  <div className="grid place-items-center bg-white-1 p-6">
                    <Image src={p.logo.src} alt={p.logo.alt} width={p.logo.width} height={p.logo.height} sizes="(min-width: 882px) 36rem, 100vw" className="h-auto max-h-20 w-auto" />
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/clanky/projekty/" className="btn bg-sun">
            Články o projektech <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/prevence-rizikoveho-chovani/#programy" className="btn bg-paper">
            Bezpečné klima školy 2025/26 <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </>
  )
}
