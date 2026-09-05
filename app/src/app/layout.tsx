import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Roboto } from 'next/font/google'
import Header from '@/components/nav/header'
import Footer from '@/components/footer/footer'
import { getNavData } from '@/components/nav/data'
import { getSiteUrl, SITE_DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo'
import './globals.css'

// Replaces gatsby-plugin-google-fonts (`roboto:300,400,400i,700`, external
// fonts.googleapis.com <link>) with next/font/google: self-hosted at build
// time, no external request, no layout shift. `latin-ext` is required (not
// just `latin`) for Czech diacritics — Google's own <link> served it via
// automatic unicode-range subsetting, but next/font needs it listed.
const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['300', '400', '700'],
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

type RootLayoutProps = {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const menus = await getNavData()

  return (
    <html lang="cs" className={`${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header menu={menus.main} />
        <main className="flex-1">{children}</main>
        <Footer fastFirst={menus.fastFirst} fastSecond={menus.fastSecond} />
      </body>
    </html>
  )
}
