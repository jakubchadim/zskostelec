import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getCategoryById,
  getGalleryById,
  getPageById,
  getPostById,
  getStaticRoutes,
  resolveRoute,
  PageTemplateType,
  type ResolvedRoute
} from '@/lib/wp'
import { templateRegistry } from '@/components/templates/registry'
import { templateKeyForRoute } from '@/components/templates/route-mapping'
import { buildTitle, decodeEntities, getSiteUrl, htmlToPlainText, pathFromSlug, SITE_DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug?: string[] }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const resolved = await resolveRoute(slug ?? [])

  if (!resolved) {
    notFound()
  }

  const Template = templateRegistry[templateKeyForRoute(resolved)]

  if (!Template) {
    notFound()
  }

  return <Template data={resolved} />
}

/**
 * Per-route metadata for the catch-all. Re-fetches `resolveRoute` and the
 * resolved entity independently of the page component above - safe and
 * cheap, since Next automatically dedupes identical `fetch()` calls within
 * a single request (already relied on elsewhere, e.g. `templates/home.tsx`
 * calling `getNavData()` a second time), not a second round-trip to WP.
 *
 * A WP-unreachable failure (network error, WP down) returns *minimal*
 * metadata (just the site name) rather than throwing or returning nothing -
 * an ISR-served page during a WP outage still needs a sane `<title>`. A
 * genuinely missing entity (bad slug, or a race with content deleted after
 * `resolveRoute` matched it) calls `notFound()` here too, so the 404
 * response carries correct not-found metadata rather than whatever the
 * last-resolved route would have produced.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  let resolved: ResolvedRoute | null
  try {
    resolved = await resolveRoute(slug ?? [])
  } catch (error) {
    console.warn('[generateMetadata] WP unreachable, falling back to minimal metadata:', error)
    return { title: SITE_NAME, description: SITE_DEFAULT_DESCRIPTION }
  }

  if (!resolved) {
    notFound()
  }

  const siteUrl = getSiteUrl()
  const canonical = siteUrl ? new URL(pathFromSlug(slug), siteUrl).toString() : undefined
  const base: Metadata = canonical ? { alternates: { canonical } } : {}

  switch (resolved.kind) {
    case 'page': {
      const page = await getPageById(resolved.id)
      if (!page) {
        notFound()
      }

      const title = resolved.templateType === PageTemplateType.HOME ? 'Vítejte' : decodeEntities(page.title)
      const fullTitle = buildTitle(title)

      return {
        ...base,
        title: fullTitle,
        description: SITE_DEFAULT_DESCRIPTION,
        openGraph: {
          title: fullTitle,
          description: SITE_DEFAULT_DESCRIPTION,
          type: 'website',
          url: canonical,
          siteName: SITE_NAME,
          locale: 'cs_CZ'
        }
      }
    }

    case 'post': {
      const post = await getPostById(resolved.id)
      if (!post) {
        notFound()
      }

      const title = decodeEntities(post.title)
      const fullTitle = buildTitle(title)
      const description = htmlToPlainText(post.excerpt) || SITE_DEFAULT_DESCRIPTION
      const previewImage = post.galleries?.find((gallery) => gallery.acf.preview != null)?.acf.preview

      return {
        ...base,
        title: fullTitle,
        description,
        openGraph: {
          title: fullTitle,
          description,
          type: 'article',
          url: canonical,
          siteName: SITE_NAME,
          locale: 'cs_CZ',
          publishedTime: post.date,
          images: previewImage ? [{ url: previewImage.source_url }] : undefined
        }
      }
    }

    case 'category': {
      const category = await getCategoryById(resolved.id)
      if (!category) {
        notFound()
      }

      const name = decodeEntities(category.name)
      const title = resolved.pageNumber > 1 ? `${name} – strana ${resolved.pageNumber}` : name
      const fullTitle = buildTitle(title)

      return {
        ...base,
        title: fullTitle,
        description: SITE_DEFAULT_DESCRIPTION,
        openGraph: {
          title: fullTitle,
          description: SITE_DEFAULT_DESCRIPTION,
          type: 'website',
          url: canonical,
          siteName: SITE_NAME,
          locale: 'cs_CZ'
        }
      }
    }

    case 'gallery': {
      const gallery = await getGalleryById(resolved.id)
      if (!gallery) {
        notFound()
      }

      const title = decodeEntities(gallery.title)
      const fullTitle = buildTitle(title)

      return {
        ...base,
        title: fullTitle,
        description: SITE_DEFAULT_DESCRIPTION,
        openGraph: {
          title: fullTitle,
          description: SITE_DEFAULT_DESCRIPTION,
          type: 'website',
          url: canonical,
          siteName: SITE_NAME,
          locale: 'cs_CZ',
          images: gallery.acf.preview ? [{ url: gallery.acf.preview.source_url }] : undefined
        }
      }
    }
  }
}

export async function generateStaticParams() {
  // Without a reachable WP (or WP_URL unset, e.g. CI), build nothing statically;
  // `dynamicParams` serves every route on demand via ISR instead.
  if (!process.env.WP_URL) {
    return []
  }

  try {
    const routes = await getStaticRoutes()

    return routes.map(({ path }) => ({
      slug: path.split('/').filter(Boolean)
    }))
  } catch (error) {
    console.warn('[generateStaticParams] WP unreachable, falling back to fully dynamic rendering:', error)
    return []
  }
}

export const dynamicParams = true
