import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { WpAcfLink } from '@/lib/wp'
import { Cloud, Star } from '@/components/ui/doodles'
import { Reveal } from '@/components/ui/reveal'

type SecondSectionProps = { sectionLink: WpAcfLink | null }

/** "Najdete nás na pracovištích" block - the bundled school illustration under drifting clouds. */
export function SecondSection({ sectionLink }: SecondSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-[2.5px] border-ink bg-sky-tint shadow-pop-lg">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Cloud className="absolute top-6 w-28 text-white-1 animate-drift" />
        <Cloud className="absolute top-24 w-16 text-white-1 animate-drift [animation-delay:-18s]" />
        <Star className="absolute right-8 bottom-8 w-8 text-sun animate-float" />
      </div>
      <div className="relative grid items-center gap-6 p-6 sm:p-10 md:grid-cols-2">
        <Reveal>
          <span className="font-display text-base font-extrabold tracking-wider text-[#0f5fb3] uppercase">Kde nás najdete</span>
          <h2 className="mt-1">
            Učíme na několika <span className="highlight">pracovištích</span> v&nbsp;Kostelci nad Orlicí
          </h2>
          <p className="mt-4 max-w-md text-lg text-gray-8">
            Každá budova má svou atmosféru. Podívejte se, kde všude nás potkáte.
          </p>
          {sectionLink?.url && (
            <Link href={sectionLink.url} className="btn mt-6 bg-sky text-white-1">
              <MapPin className="size-5" aria-hidden />
              Zobrazit pracoviště
            </Link>
          )}
        </Reveal>
        <Reveal delay={150}>
          {/* eslint-disable-next-line @next/next/no-img-element -- bundled illustration */}
          <img
            src="/school.png"
            alt="Ilustrace školní budovy"
            width={1600}
            height={1020}
            loading="lazy"
            className="mx-auto block w-full max-w-lg transition-transform duration-500 hover:scale-105 hover:-rotate-1"
          />
        </Reveal>
      </div>
    </div>
  )
}
