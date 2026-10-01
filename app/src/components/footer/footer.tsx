import Link from 'next/link'
import { MapPin, Users } from 'lucide-react'
import { NavLink } from '../nav/nav-link'
import { Container } from '../ui/container'
import { Cloud, PaperPlane, Star, WaveEdge } from '../ui/doodles'
import { BackToTop } from './back-to-top'
import type { NavItem } from '../nav/types'

type FooterProps = {
  fastFirst: NavItem[]
  fastSecond: NavItem[]
}

function FooterNavList({ items }: { items: NavItem[] }) {
  return (
    <ul className="m-0 list-none space-y-2 p-0">
      {items.map((item, idx) => (
        <li key={`${item.slug ?? item.url}-${idx}`}>
          <NavLink
            item={item}
            className="font-semibold text-white-1/85 underline-offset-4 transition-colors hover:text-sun hover:underline"
          />
        </li>
      ))}
    </ul>
  )
}

function FooterHeading({ children }: { children: string }) {
  return <h2 className="mb-4 font-display text-lg font-bold text-sun">{children}</h2>
}

/** Site footer: wavy top edge, doodles, quick links, contact card and a back-to-top rocket. */
export default function Footer({ fastFirst, fastSecond }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-16 text-white-1">
      <WaveEdge className="-mb-px block h-10 w-full text-ink sm:h-14" />
      <div className="relative overflow-hidden bg-ink">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Cloud className="absolute top-10 w-28 text-white-1/10 animate-drift [animation-delay:-12s]" />
          <Star className="absolute top-12 right-[6%] w-10 rotate-12 text-sun animate-float" />
          <PaperPlane className="absolute bottom-24 left-[4%] hidden w-14 text-sky animate-fly md:block" />
        </div>
        <Container className="relative">
          <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1.3fr] md:gap-8 md:py-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="block size-16 shrink-0 rounded-[26%] border-[2.5px] border-white-1">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
                  <img src="/logo.svg" alt="" className="block size-full rounded-[22%]" />
                </span>
                <p className="m-0 font-display text-xl leading-tight font-bold">
                  ZŠ Gutha-Jarkovského
                  <span className="block text-base font-semibold text-white-1/70">Kostelec nad Orlicí</span>
                </p>
              </div>
              <p className="mt-5 max-w-xs text-white-1/70">
                Škola, kde se učíme s radostí, zvědavostí a&nbsp;respektem.
              </p>
            </div>
            <div>
              <FooterHeading>Rychle</FooterHeading>
              <FooterNavList items={fastFirst} />
            </div>
            <div>
              <FooterHeading>Užitečné</FooterHeading>
              <FooterNavList items={fastSecond} />
            </div>
            <div>
              <FooterHeading>Kontakt</FooterHeading>
              <address className="space-y-3 not-italic text-white-1/85">
                <a
                  href="https://mapy.cz/zakladni?q=Palack%C3%A9ho%20n%C3%A1m%C4%9Bst%C3%AD%2045%2C%20Kostelec%20nad%20Orlic%C3%AD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 transition-colors hover:text-sun"
                >
                  <MapPin className="mt-1 size-5 shrink-0 text-berry" aria-hidden />
                  <span>
                    Palackého náměstí 45
                    <br />
                    517 41 Kostelec nad Orlicí
                  </span>
                </a>
                <Link href="/zamestnanci/" className="flex items-center gap-3 transition-colors hover:text-sun">
                  <Users className="size-5 shrink-0 text-grass" aria-hidden />
                  Kontakty na zaměstnance
                </Link>
              </address>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-dashed border-white-1/15 py-6 text-sm text-white-1/60 sm:flex-row">
            <span>© {year} ZŠ Kostelec nad Orlicí</span>
            <BackToTop />
          </div>
        </Container>
      </div>
    </footer>
  )
}
