import type { Metadata } from 'next'
import { staticPageMetadata } from '@/components/static/meta'
import { TrailStory } from '@/components/history/v3/trail-story'

export const metadata: Metadata = {
  ...staticPageMetadata({
    title: 'Historie – varianta 3',
    description:
      'Stezka časem: projdi se s panem Guthem po 17 zastávkách z historie kosteleckých škol, sbírej razítka do turistického deníku a získej certifikát poutníka.',
    path: '/historie-3/'
  }),
  robots: { index: false }
}

export default function HistorieStezkaPage() {
  return <TrailStory />
}
