import { notFound } from 'next/navigation'
import { ArticlePreviewBox } from '@/components/home/article-preview-box'
import { FastMenuBox } from '@/components/home/fast-menu-box'
import { Hero } from '@/components/home/hero'
import { getHomeData } from '@/components/home/home-data'
import { SecondSection } from '@/components/home/second-section'
import { getNavData } from '@/components/nav/data'
import { Container } from '@/components/ui/container'
import { getPageById, type ResolvedRoute } from '@/lib/wp'
import type { TemplateProps } from './registry'

type HomeRoute = Extract<ResolvedRoute, { kind: 'page' }>

/**
 * Homepage template - ports `web/src/templates/home.tsx`. The `data` prop
 * carries the *resolved route* (`{kind:'page', id, templateType:'page-home'}`
 * from `resolveRoute`), not the page entity itself: `registry.tsx`'s
 * `TemplateProps<T = unknown>` is one shared shape across every Wave-2
 * template, so each template fetches and narrows its own data instead of
 * `registry.tsx` growing a per-key generic.
 *
 * Per `admin/theme/inc/page-types/homepage.json` and the legacy GraphQL
 * query in `web/src/templates/home.tsx`, the home page's `content`/`blocks`
 * are never read - the whole page is hand-built from ACF fields only, so
 * there's no generic block content to render here.
 */
export async function HomeTemplate({ data }: TemplateProps) {
  const { id } = data as HomeRoute
  const page = await getPageById(id)

  if (!page) {
    notFound()
  }

  // getNavData() is also called once already in app/src/app/layout.tsx;
  // calling it again here for fastFirst/fastSecond is safe rather than a
  // double network hit - Next dedupes identical `fetch()` calls (same URL
  // + options) across a single server-rendered request via automatic
  // request memoization, and `getMenuBySlug` issues the same URLs both
  // times. This was the cleanest way to get the two "fast menu" lists into
  // the homepage without registry.tsx or layout.tsx growing extra plumbing.
  const [{ mainPost, previews }, menus] = await Promise.all([getHomeData(page), getNavData()])

  const [warnings, additionalFirst, additionalSecond] = previews

  return (
    <>
      <Hero mainPost={mainPost} />
      <section className="bg-gray-1 py-8 sm:py-10 md:py-12">
        <Container>
          <div className="relative z-10 -mt-24">
            <div className="mx-auto max-w-[21.875rem] [&>*]:mt-2 sm:grid sm:max-w-none sm:grid-cols-2 sm:grid-rows-3 sm:gap-3 sm:[&>*]:mt-0 md:grid-cols-3 md:grid-rows-2">
              {warnings && (
                <ArticlePreviewBox preview={warnings} className="sm:col-start-1 sm:row-start-1 sm:row-span-2" />
              )}
              <FastMenuBox
                title={page.acf.fastMenu}
                items={menus.fastFirst}
                className="sm:col-start-2 sm:row-start-1"
              />
              <FastMenuBox
                title={page.acf.fastMenuSecond}
                items={menus.fastSecond}
                className="sm:col-start-2 sm:row-start-2 md:col-start-3 md:row-start-1"
              />
              {additionalFirst && (
                <ArticlePreviewBox
                  preview={additionalFirst}
                  className="sm:col-start-1 sm:row-start-3 md:col-start-2 md:row-start-2"
                />
              )}
              {additionalSecond && (
                <ArticlePreviewBox
                  preview={additionalSecond}
                  className="sm:col-start-2 sm:row-start-3 md:col-start-3 md:row-start-2"
                />
              )}
            </div>
          </div>
          <SecondSection sectionLink={page.acf.sectionLink} />
        </Container>
      </section>
    </>
  )
}
