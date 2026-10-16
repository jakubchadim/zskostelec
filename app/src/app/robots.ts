import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

/**
 * AI training crawlers walk every old article and listing page, and each
 * visit after an admin save re-renders the page - burning Vercel ISR write
 * units for no visitors. Search engines (Google, Seznam, Bing) stay allowed.
 */
const BLOCKED_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'PerplexityBot',
  'cohere-ai',
  'Diffbot',
  'ImagesiftBot',
  'Timpibot'
]

/** Allow everything except AI crawlers, point at the sitemap when `SITE_URL` is configured. */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: BLOCKED_BOTS, disallow: '/' }
    ],
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined
  }
}
