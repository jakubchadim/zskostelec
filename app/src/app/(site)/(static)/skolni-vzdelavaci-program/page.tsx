import { BookOpenCheck } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { Callout, DocList, Section } from '@/components/static/kit'
import { staticPageMetadata } from '@/components/static/meta'
import { buildSvpContent, isSvpDocument, SVP_CATEGORY_SLUG } from '@/components/static/svp'
import { getDocumentCategories, getDocuments } from '@/lib/content'

export const metadata = staticPageMetadata({
  title: 'Školní vzdělávací program',
  description:
    'Školní vzdělávací program ZŠ Gutha-Jarkovského po kapitolách: charakteristika školy, učební plán, osnovy vzdělávacích oblastí, hodnocení a přílohy ke stažení.',
  path: '/skolni-vzdelavaci-program/'
})

/** The ŠVP chapters (PDFs from the CMS documents category) under the names the school uses. */
export default async function SvpPage() {
  const [documents, categories] = await Promise.all([getDocuments(), getDocumentCategories()])
  const categoryId = categories.find((c) => c.slug === SVP_CATEGORY_SLUG)?.id ?? null
  const { complete, groups, other } = buildSvpContent(documents.filter((d) => isSvpDocument(d, categoryId)))

  return (
    <>
      <PageHero
        title="Školní vzdělávací program"
        colorKey="skolni-vzdelavaci-program"
        eyebrow="O škole"
        lead="Podle čeho u nás učíme: od charakteristiky školy přes osnovy jednotlivých předmětů až po hodnocení žáků. Každá kapitola je ke stažení jako PDF."
      />

      {complete && (
        <Section eyebrow="Celý dokument" title="ŠVP v jednom souboru">
          <DocList docs={[complete]} />
        </Section>
      )}

      {groups.map((group, idx) => (
        <Section key={group.eyebrow} eyebrow={group.eyebrow} title={group.title} tinted={idx % 2 === 0} accent={accentAt(idx + 1)}>
          <DocList docs={group.docs} />
        </Section>
      ))}

      {other.length > 0 && (
        <Section eyebrow="Ke stažení" title="Další dokumenty">
          <DocList docs={other} />
        </Section>
      )}

      {groups.length === 0 && other.length === 0 && (
        <Section eyebrow="Ke stažení" title="Kapitoly připravujeme">
          <Callout icon={BookOpenCheck} accent={accentAt(0)} title="Dokumenty zatím nejsou nahrané">
            Kapitoly ŠVP sem doplníme co nejdřív. Do té doby se prosím obraťte na vedení školy.
          </Callout>
        </Section>
      )}
    </>
  )
}
