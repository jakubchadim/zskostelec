import type { Metadata } from 'next'
import { staticPageMetadata } from '@/components/static/meta'
import { Journey } from '@/components/history/v1/journey'

export const metadata: Metadata = {
  ...staticPageMetadata({
    title: 'Historie – varianta 1',
    description:
      'Cesta časem: příběh kosteleckých škol a Jiřího Gutha-Jarkovského jako kreslené městečko, které roste s každou kapitolou.',
    path: '/historie-1/'
  }),
  robots: { index: false }
}

export default function HistoryJourneyPage() {
  return <Journey />
}
