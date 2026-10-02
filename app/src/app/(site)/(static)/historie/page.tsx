import { staticPageMetadata } from '@/components/static/meta'
import { Journey } from '@/components/history/journey/journey'

export const metadata = staticPageMetadata({
  title: 'Historie',
  description:
    'Cesta časem: příběh kosteleckých škol od 14. století po dnešek a Jiřího Gutha-Jarkovského, po kterém se škola jmenuje – kreslené městečko, které roste s každou kapitolou, i s namluveným vyprávěním.',
  path: '/historie/'
})

export default function HistoryJourneyPage() {
  return <Journey />
}
