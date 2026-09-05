import Link from 'next/link'
import { Container } from '@/components/ui/container'
import type { WpPost } from '@/lib/wp'
import { isExternalUrl } from './is-external-url'

type HeroProps = { mainPost: WpPost | null }

/**
 * The orange gradient hero band - ports `MainHeading`/`MainHeadingInfo*` in
 * `web/src/templates/home.tsx`. Renders nothing for the main-post copy when
 * there's no main post (matches legacy's `{mainPost && (...)}` guard). The
 * logo photo shows from `sm` up - legacy's `theme.media.xs.down` is a
 * *range* breakpoint (`max-width: 667px`, i.e. "below `sm`"), not "below
 * `xs`"; same for the vertical padding step below.
 */
export function Hero({ mainPost }: HeroProps) {
  return (
    <section className="-mt-[5.0625rem] bg-linear-to-b from-primary-1 to-[#ed704a] pt-[81px] pb-16 text-white-1">
      <Container>
        <div className="flex items-center">
          <div className="hidden w-2/5 min-w-[35%] pr-4 sm:block">
            <img src="/logo.svg" alt="" className="mx-auto block w-full max-w-[18.75rem]" />
          </div>
          {mainPost && (
            <div className="py-4 sm:py-8">
              <h2
                className="top text-[1.75rem] font-light sm:text-[2rem] md:text-[2.3125rem]"
                dangerouslySetInnerHTML={{ __html: mainPost.title }}
              />
              <h3 className="text-title-5 font-light" dangerouslySetInnerHTML={{ __html: mainPost.excerpt }} />
              {mainPost.link != null && (
                <Link
                  href={mainPost.link}
                  target={isExternalUrl(mainPost.link) ? '_blank' : undefined}
                  rel={isExternalUrl(mainPost.link) ? 'noopener noreferrer' : undefined}
                  className="inline-block min-w-[6em] rounded-small border border-white-1 bg-white-1/10 px-[14px] py-[9px] text-center text-4 font-medium hover:bg-white-1/20"
                >
                  Zjistit více
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
