import type { MetadataRoute } from 'next'
import { getStaticRoutes } from '@/lib/wp'
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

  if (!siteUrl || !process.env.WP_URL) {
    return []
  }

  try {
    const routes = await getStaticRoutes()
    return routes.map(({ path }) => ({ url: new URL(path, siteUrl).toString() }))
  } catch (error) {
    console.warn('[sitemap] WP unreachable, returning an empty sitemap:', error)
    return []
  }
}
