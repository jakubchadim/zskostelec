import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Baloo_2, Nunito } from 'next/font/google'
import Header from '@/components/nav/header'
import Footer from '@/components/footer/footer'
import { getNavData } from '@/components/nav/data'
import { getSiteUrl, SITE_DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo'
import './globals.css'

// Self-hosted at build time via next/font. `latin-ext` is required for
// Czech diacritics. Baloo 2 = rounded, friendly display face for headings;
// Nunito = rounded-terminal body face that stays very legible at small sizes.
const display = Baloo_2({
  variable: '--font-display-face',
  weight: ['500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap'
})

const body = Nunito({
  variable: '--font-body',
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap'
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DEFAULT_DESCRIPTION,
  metadataBase: siteUrl ? new URL(siteUrl) : undefined
}

export const viewport: Viewport = {
  themeColor: '#ff8a00'
}

type RootLayoutProps = {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const menus = await getNavData()

  return (
    <html lang="cs" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#obsah"
          className="sr-only z-[100] rounded-full bg-ink px-4 py-2 font-bold text-white-1 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Přeskočit na obsah
        </a>
        <Header menu={menus.main} />
        <main id="obsah" className="flex-1">
          {children}
        </main>
        <Footer fastFirst={menus.fastFirst} fastSecond={menus.fastSecond} />
      </body>
    </html>
  )
}
