import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

/** Allow everything, point at the sitemap when `SITE_URL` is configured. */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined
  }
}
