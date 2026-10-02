import type { Metadata } from 'next'
import { staticPageMetadata } from '@/components/static/meta'
import { ComicBook } from '@/components/history/v2/book'

export const metadata: Metadata = {
  ...staticPageMetadata({
    title: 'Historie – varianta 2',
    description: 'Komiks „Kluk s brýlemi“: pět století kostelecké školy, jak je vypráví Jiří Guth-Jarkovský.',
    path: '/historie-2/'
  }),
  robots: { index: false }
}

export default function Historie2Page() {
  return <ComicBook />
}
