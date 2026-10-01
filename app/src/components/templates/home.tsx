import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Article, ArticleRow } from '@/components/article/article'
import { Hero, type HeroPhoto } from '@/components/home/hero'
import { getHomeData } from '@/components/home/home-data'
import { NoticeBoard } from '@/components/home/notice-board'
import { PhotoStrip } from '@/components/home/photo-strip'
import { QuickLinks } from '@/components/home/quick-links'
import { SecondSection } from '@/components/home/second-section'
import { allLabel, SectionHeading } from '@/components/home/section-heading'
import { getNavData } from '@/components/nav/data'
import { sortByDateDesc } from '@/components/gallery/sort-by-date'
import { ACCENTS } from '@/components/ui/accent'
import { Container } from '@/components/ui/container'
import { Sparkle, Star } from '@/components/ui/doodles'
import { Reveal } from '@/components/ui/reveal'
import { getLatestGalleries, getPageById, type ResolvedRoute } from '@/lib/wp'
import { Trophy } from 'lucide-react'
import type { TemplateProps } from './registry'

type HomeRoute = Extract<ResolvedRoute, { kind: 'page' }>

const PHOTO_COUNT = 10

/** Latest gallery previews for the hero collage + photo strip. Never fails the homepage. */
async function getLatestPhotos(): Promise<HeroPhoto[]> {
  try {
    const galleries = sortByDateDesc(await getLatestGalleries(PHOTO_COUNT))
    return galleries.map((gallery) => ({ media: gallery.acf.preview!, title: gallery.title, link: gallery.link }))
  } catch (error) {
    console.warn('[home] galleries unavailable:', error)
    return []
  }
}

/**
 * Homepage. The page's own `content`/`blocks` are never read - the whole
 * page is built from ACF fields (main post, three categories, fast menus,
 * section link) plus the latest galleries for photos.
 *
 * Section order follows what visitors come for: quick links first
 * (parents - EduPage, documents, staff), then time-sensitive notices,
 * news, achievements, photos, and finally the "where to find us" block.
 */
export async function HomeTemplate({ data }: TemplateProps) {
  const { id } = data as HomeRoute
  const page = await getPageById(id)

  if (!page) {
    notFound()
  }

  // getNavData() is deduped with the call in layout.tsx (same fetch URLs).
  const [{ mainPost, previews }, menus, photos] = await Promise.all([getHomeData(page), getNavData(), getLatestPhotos()])

  const [notices, news, achievements] = previews
  const quickLinks = [...menus.fastFirst, ...menus.fastSecond]

  return (
    <>
      <Hero mainPost={mainPost} photos={photos.slice(0, 3)} newsAnchor={news || achievements ? '#aktuality' : null} />

      <section aria-labelledby="rychle" className="relative -mt-6 pb-16">
        <Container>
          <h2 id="rychle" className="sr-only">
            Rychlé odkazy
          </h2>
          <QuickLinks items={quickLinks} />
        </Container>
      </section>

      {notices && notices.articles.length > 0 && (
        <section aria-labelledby="nastenka" className="pb-20">
          <Container>
            <SectionHeading id="nastenka" eyebrow="Nástěnka" title={notices.category.name} accent={ACCENTS[2]} />
            <NoticeBoard preview={notices} />
          </Container>
        </section>
      )}

      {(news || achievements) && (
        <section id="aktuality" aria-labelledby="aktuality-nadpis" className="relative pb-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-10">
              {news && (
                <div>
                  <SectionHeading
                    id="aktuality-nadpis"
                    eyebrow="Ze školy"
                    title={news.category.name}
                    accent={ACCENTS[1]}
                    action={{ href: news.category.link, label: allLabel(news.category.name) }}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    {news.articles.map((article, idx) => (
                      <Reveal key={article.id} delay={idx * 90} className={idx === 0 ? 'sm:col-span-2' : undefined}>
                        <Article post={article} index={idx + 1} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}

              {achievements && (
                <aside aria-labelledby="uspechy">
                  <Reveal className="sticker relative h-full bg-grape-tint p-6">
                    <Star className="absolute -top-5 -right-3 w-12 rotate-12 text-sun animate-float" />
                    <Sparkle className="absolute top-16 -left-4 w-7 text-berry animate-float-slow" />
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center rounded-2xl border-[2.5px] border-ink bg-sun">
                        <Trophy className="size-6" aria-hidden />
                      </span>
                      <h2 id="uspechy" className="text-2xl">
                        {achievements.category.name}
                      </h2>
                    </div>
                    <p className="mt-3 text-gray-8">Na naše žáky jsme hrdí. Tohle se jim povedlo:</p>
                    <ul className="m-0 mt-4 list-none space-y-1 rounded-2xl border-2 border-ink bg-paper p-2">
                      {achievements.articles.map((article, idx) => (
                        <li key={article.id}>
                          <ArticleRow post={article} index={idx + 4} />
                        </li>
                      ))}
                    </ul>
                    <Link href={achievements.category.link} className="btn mt-5 w-full bg-sun">
                      {allLabel(achievements.category.name)}
                    </Link>
                  </Reveal>
                </aside>
              )}
            </div>
          </Container>
        </section>
      )}

      {photos.length > 0 && (
        <section aria-labelledby="fotky" className="pb-20">
          <Container>
            <SectionHeading
              id="fotky"
              eyebrow="Fotogalerie"
              title="Jak to u nás vypadá"
              accent={ACCENTS[3]}
              action={{ href: '/fotogalerie/', label: 'Všechny fotky' }}
              className="mb-2"
            />
          </Container>
          <PhotoStrip photos={photos} />
        </section>
      )}

      <section className="pb-8">
        <Container>
          <SecondSection sectionLink={page.acf.sectionLink} />
        </Container>
      </section>
    </>
  )
}
