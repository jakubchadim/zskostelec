import { notFound } from 'next/navigation'
import { BlockContent } from '@/components/block/content'
import { Section } from '@/components/block/section'
import { WpImage } from '@/components/image/wp-image'
import { Container } from '@/components/ui/container'
import { getGutaky, getPageById, type ResolvedRoute, type WpGutak } from '@/lib/wp'
import type { TemplateProps } from './registry'

type PageRouteData = Extract<ResolvedRoute, { kind: 'page' }>

function GutakCard({ gutak }: { gutak: WpGutak }) {
  return (
    <a
      href={gutak.fileUrl}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-medium bg-white-1 shadow-small hover:shadow-lift"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-gray-3">
        {gutak.preview ? (
          <WpImage
            media={gutak.preview}
            alt={gutak.title}
            sizes="(min-width: 41.75em) 33vw, 50vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- static placeholder asset, not WP media
          <img
            src="/gutak-placeholder.png"
            alt={gutak.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
        )}
      </div>
      <h4 className="m-0 bg-white-1 p-5 font-light">{gutak.title}</h4>
    </a>
  )
}

/** Guťák (school magazine) issues page (page.template === GUTAKY) - port of
 * web/src/templates/allGutak.tsx: page intro + a grid of issue covers linking to their file. */
export async function GutakTemplate({ data }: TemplateProps) {
  const route = data as PageRouteData
  const [page, gutaky] = await Promise.all([getPageById(route.id), getGutaky()])

  if (!page) {
    notFound()
  }

  const title = (
    <Container>
      <h1 className="top">{page.title}</h1>
    </Container>
  )

  return (
    <>
      {page.blocks.length > 0 ? (
        <BlockContent blocks={page.blocks} title={title} />
      ) : (
        <Section>
          {title}
          <Container>
            {/* See templates/page.tsx for why this is plain dangerouslySetInnerHTML. */}
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </Container>
        </Section>
      )}
      <Container>
        <div className="grid grid-cols-1 gap-4 pt-1 pb-4 xs:grid-cols-2 sm:grid-cols-3 sm:py-4 md:pt-8 md:pb-4">
          {gutaky.map((gutak) => (
            <GutakCard key={gutak.id} gutak={gutak} />
          ))}
        </div>
      </Container>
    </>
  )
}
