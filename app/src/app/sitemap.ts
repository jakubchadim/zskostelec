import type { MetadataRoute } from 'next'
import { getSitemapRoutes } from '@/lib/content'
import { getSiteUrl } from '@/lib/seo'

/**
 * Every statically-known route (pages, posts, categories incl. `strana-N`
 * pagination, galleries), as absolute URLs under `SITE_URL`. Degrades to an
 * empty sitemap - never a build failure - when `SITE_URL`/`WP_URL` aren't
 * set or WP is unreachable, mirroring `generateStaticParams`'s own
 * WP-unreachable fallback in `app/[[...slug]]/page.tsx`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  if (!siteUrl) {
    return []
  }

  try {
    const routes = await getSitemapRoutes()
    return routes.map(({ path, lastModified }) => ({ url: new URL(path, siteUrl).toString(), lastModified }))
  } catch (error) {
    console.warn('[sitemap] CMS unreachable, returning an empty sitemap:', error)
    return []
  }
}

// Rebuilt once a day so new articles and galleries show up without a deploy.
export const revalidate = 86400
