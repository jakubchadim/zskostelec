import type { Metadata } from 'next'
import { buildTitle, getSiteUrl, SITE_NAME } from '@/lib/seo'

/** Metadata for a hand-made static page (title, description, canonical, OG). */
export function staticPageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const siteUrl = getSiteUrl()
  const canonical = siteUrl ? new URL(path, siteUrl).toString() : undefined
  const fullTitle = buildTitle(title)

  return {
    title: fullTitle,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title: fullTitle, description, type: 'website', url: canonical, siteName: SITE_NAME, locale: 'cs_CZ' }
  }
}

/**
 * WP page slugs now served by hand-made routes under `app/(static)/`.
 * The catch-all skips them in `generateStaticParams` so the two routes
 * never compete for the same path.
 */
export const STATIC_PAGE_SLUGS = [
  'historie',
  'uredni-deska',
  'skolni-stravovani',
  'skolni-druzina',
  'klub-rodicu',
  'vychovne-poradenstvi',
  'karierove-poradenstvi',
  'prevence-rizikoveho-chovani',
  'dotacni-programy-projekty',
  'prohlaseni-o-pristupnosti',
  'skolska-rada'
] as const
