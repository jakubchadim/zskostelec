import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

/**
 * AI training and SEO crawlers walk every old article and listing page, and
 * each first visit renders the page - burning Vercel CPU, ISR write units and
 * Neon compute for no visitors. Search engines (Google, Seznam, Bing) stay
 * allowed. The worst of them are also denied in the Vercel Firewall.
 */
const BLOCKED_BOTS = [
  'meta-webindexer',
  'DataForSeoBot',
  'AhrefsBot',
  'PetalBot',
  'Amzn-SearchBot',
  'SemrushBot',
  'SERankingBacklinksBot',
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

/**
 * Allow everything except AI crawlers, point at the sitemap when `SITE_URL` is configured.
 * Tag-filtered listings (`<listing>/stitek-<slug>/`) are left out: every article and
 * gallery is reachable from the unfiltered listings and the sitemap, and the filter
 * combinations (× school year × page) would be thousands more URLs to crawl and render.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/*/stitek-' },
      { userAgent: BLOCKED_BOTS, disallow: '/' }
    ],
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined
  }
}
