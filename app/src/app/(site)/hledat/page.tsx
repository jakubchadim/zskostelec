import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Article } from '@/components/article/article'
import { ArticleEmptyState } from '@/components/article/empty-state'
import { ArticlePagination } from '@/components/article/pagination'
import { documentsHref, DOCUMENT_SEARCH_PARAM } from '@/components/file/filter'
import { FileCard } from '@/components/file/file-card'
import { GalleryCard } from '@/components/gallery/gallery-card'
import { hasPreview } from '@/components/gallery/has-preview'
import { SearchForm, SEARCH_PATH } from '@/components/search/search-form'
import { matchesAllWords, searchSitePages } from '@/components/search/site-pages'
import { LinkList } from '@/components/static/kit'
import { accentAt } from '@/components/ui/accent'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { getDocuments, searchGalleries, searchPosts, searchQuery } from '@/lib/content'
import { buildTitle } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: buildTitle('Hledání'),
  // Result pages are endless query variations - nothing for search engines to index.
  robots: { index: false, follow: true }
}

/** One result type shown on its own, all pages of it (`?v=clanky`). */
const VIEWS = { clanky: 'Články', fotogalerie: 'Fotogalerie' } as const
type View = keyof typeof VIEWS

const PREVIEW = { posts: 6, galleries: 6, documents: 8 }
const PAGE_SIZE = { clanky: 15, fotogalerie: 12 }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

function viewHref(query: string, view: View | null, page = 1): string {
  const params = new URLSearchParams({ q: query })
  if (view) params.set('v', view)
  if (page > 1) params.set('strana', String(page))
  return `${SEARCH_PATH}?${params}`
}

function ResultHeading({ title, count, idx, more }: { title: string; count: number; idx: number; more?: { href: string; label: string } }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 className="flex items-center gap-3 text-2xl">
        {title}
        <span className={cn('rounded-full px-2.5 py-0.5 font-sans text-sm font-bold', accentAt(idx).tint)}>{count}</span>
      </h2>
      {more && (
        <Link href={more.href} className="btn bg-paper py-2 text-base">
          {more.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}

/**
 * Site search: pages written in code, articles and galleries (from their
 * folded `searchText` column in the CMS) and documents. Rendered per request;
 * the overview shows a few of each kind, `?v=` lists one kind page by page.
 */
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = first(params.q).trim().slice(0, 100)
  const viewParam = first(params.v)
  const view: View | null = viewParam in VIEWS ? (viewParam as View) : null
  const page = Math.max(1, Number.parseInt(first(params.strana), 10) || 1)
  const searchable = searchQuery(query) !== ''

  const hero = (
    <PageHero
      title={searchable ? `Hledání: ${query}` : 'Hledání'}
      colorKey="hledat"
      eyebrow={view ? VIEWS[view] : 'Na celém webu'}
      back={view ? { href: viewHref(query, null), label: 'Všechny výsledky' } : undefined}
    >
      <SearchForm defaultValue={query} autoFocus={!searchable} className="max-w-2xl" />
    </PageHero>
  )

  if (!searchable) {
    return (
      <>
        {hero}
        <Container className="pt-4">
          <p className="text-lg text-gray-8">Napište aspoň dvě písmena. Hledá se v článcích, fotogaleriích, dokumentech a stránkách školy.</p>
        </Container>
      </>
    )
  }

  if (view === 'clanky') {
    const { posts, totalCount } = await searchPosts(query, { page, limit: PAGE_SIZE.clanky })
    const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE.clanky), 1)
    return (
      <>
        {hero}
        <Container className="pt-4">
          <ResultHeading title="Články" count={totalCount} idx={1} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post, idx) => (
              <Article key={post.id} post={post} index={idx} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pt-12">
              <ArticlePagination totalPages={totalPages} current={page} generateLink={(p) => viewHref(query, 'clanky', p)} />
            </div>
          )}
        </Container>
      </>
    )
  }

  if (view === 'fotogalerie') {
    const { galleries, totalCount } = await searchGalleries(query, { page, limit: PAGE_SIZE.fotogalerie })
    const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE.fotogalerie), 1)
    return (
      <>
        {hero}
        <Container className="pt-4">
          <ResultHeading title="Fotogalerie" count={totalCount} idx={2} />
          <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 xs:grid-cols-2 md:grid-cols-3">
            {galleries.filter(hasPreview).map((gallery, idx) => (
              <li key={gallery.id}>
                <GalleryCard gallery={gallery} index={idx} />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="pt-12">
              <ArticlePagination totalPages={totalPages} current={page} generateLink={(p) => viewHref(query, 'fotogalerie', p)} />
            </div>
          )}
        </Container>
      </>
    )
  }

  const [posts, galleries, documents] = await Promise.all([
    searchPosts(query, { page: 1, limit: PREVIEW.posts }),
    searchGalleries(query, { page: 1, limit: PREVIEW.galleries }),
    getDocuments()
  ])
  const pages = searchSitePages(query)
  const matchingDocuments = documents.filter((document) => matchesAllWords(`${document.title} ${document.filename}`, query))
  const shownGalleries = galleries.galleries.filter(hasPreview)
  const nothing = pages.length + posts.totalCount + galleries.totalCount + matchingDocuments.length === 0

  return (
    <>
      {hero}
      <Container className="space-y-14 pt-4">
        {nothing && (
          <ArticleEmptyState
            parentCategoryLink={null}
            title="Nic jsme nenašli"
            text="Zkuste jiné nebo kratší slovo. Na velikosti písmen ani na diakritice nezáleží."
          />
        )}

        {pages.length > 0 && (
          <section aria-label="Stránky">
            <ResultHeading title="Stránky" count={pages.length} idx={0} />
            <LinkList links={pages.map((p) => ({ title: p.title, href: p.path, note: p.description }))} />
          </section>
        )}

        {posts.totalCount > 0 && (
          <section aria-label="Články">
            <ResultHeading
              title="Články"
              count={posts.totalCount}
              idx={1}
              more={posts.totalCount > PREVIEW.posts ? { href: viewHref(query, 'clanky'), label: 'Všechny články' } : undefined}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {posts.posts.map((post, idx) => (
                <Article key={post.id} post={post} index={idx} />
              ))}
            </div>
          </section>
        )}

        {galleries.totalCount > 0 && (
          <section aria-label="Fotogalerie">
            <ResultHeading
              title="Fotogalerie"
              count={galleries.totalCount}
              idx={2}
              more={galleries.totalCount > PREVIEW.galleries ? { href: viewHref(query, 'fotogalerie'), label: 'Všechny fotogalerie' } : undefined}
            />
            {shownGalleries.length > 0 ? (
              <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 xs:grid-cols-2 md:grid-cols-3">
                {shownGalleries.map((gallery, idx) => (
                  <li key={gallery.id}>
                    <GalleryCard gallery={gallery} index={idx} />
                  </li>
                ))}
              </ul>
            ) : (
              <LinkList links={galleries.galleries.map((g) => ({ title: g.title, href: g.link }))} />
            )}
          </section>
        )}

        {matchingDocuments.length > 0 && (
          <section aria-label="Dokumenty">
            <ResultHeading
              title="Dokumenty"
              count={matchingDocuments.length}
              idx={3}
              more={
                matchingDocuments.length > PREVIEW.documents
                  ? { href: `${documentsHref()}?${new URLSearchParams({ [DOCUMENT_SEARCH_PARAM]: query })}`, label: 'Všechny dokumenty' }
                  : undefined
              }
            />
            <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
              {matchingDocuments.slice(0, PREVIEW.documents).map((document) => (
                <li key={document.id}>
                  <FileCard name={document.title || document.filename} href={document.fileUrl} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  )
}
