import Link from 'next/link'
import type { WpAcfLink } from '@/lib/wp'

type SecondSectionProps = { sectionLink: WpAcfLink | null }

/**
 * The "Najdete nás na pracovištích" CTA block - ports `SecondSection` in
 * `web/src/templates/home.tsx`. `school.png` is a bundled marketing image
 * (no WP-media equivalent), copied from `web/src/images/school@2x.png`.
 */
export function SecondSection({ sectionLink }: SecondSectionProps) {
  return (
    <div className="mx-auto mt-8 flex max-w-[21.875rem] flex-col items-center text-center sm:mt-10 sm:max-w-none sm:flex-row sm:text-left md:mt-12">
      <div className="mt-2 sm:mt-0 sm:w-1/2">
        <h2 className="top text-[1.75rem] font-light sm:text-[2rem] md:text-[2.3125rem]">
          Najdete nás na pracovištích v <b className="text-primary-1">Kostelci nad Orlicí</b>
        </h2>
        <h3 className="text-title-5 font-light">Podívejte se kde všude</h3>
        {sectionLink?.url && (
          <Link
            href={sectionLink.url}
            className="mt-4 inline-block min-w-[6em] rounded-small bg-primary-1 px-3 py-2 text-center text-4 font-medium text-white-1 hover:bg-primary-2"
          >
            Zobrazit pracoviště
          </Link>
        )}
      </div>
      <div className="mt-2 sm:mt-0 sm:w-1/2">
        <img
          src="/school.png"
          alt=""
          width={1600}
          height={1020}
          className="mx-auto block w-[90%] sm:ml-auto sm:w-[95%]"
        />
      </div>
    </div>
  )
}
