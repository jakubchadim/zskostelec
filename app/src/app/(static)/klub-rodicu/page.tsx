import { HandCoins, MessagesSquare, Users } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { Callout, DocList, PersonCard, Section } from '@/components/static/kit'
import { staticPageMetadata } from '@/components/static/meta'

export const metadata = staticPageMetadata({
  title: 'Klub rodičů',
  description: 'Klub rodičů při ZŠ Gutha-Jarkovského: výbor, kontakty, pravidla pro vyplácení příspěvků a formulář žádosti.',
  path: '/klub-rodicu/'
})

export default function KlubRodicuPage() {
  return (
    <>
      <PageHero
        title="Klub rodičů"
        colorKey="klub-rodicu"
        eyebrow="O škole"
        lead="Každá třída má ve výboru svého zástupce z řad rodičů. Klub úzce spolupracuje se školou a řeší náměty a připomínky rodičů."
      />

      <Section eyebrow="Jak to funguje" title="Rodiče pro školu">
        <div className="grid gap-4 md:grid-cols-3">
          <Callout icon={Users} accent={accentAt(0)} title="Zástupce v každé třídě">
            Každá třída si volí svého zástupce ve výboru – na něj se můžete obracet s náměty a připomínkami.
          </Callout>
          <Callout icon={MessagesSquare} accent={accentAt(1)} title="Spolupráce se školou">
            Klub rodičů úzce spolupracuje s vedením školy a snaží se řešit všechny podněty od rodičů.
          </Callout>
          <Callout icon={HandCoins} accent={accentAt(3)} title="Příspěvky klubu">
            Učitelé mohou o příspěvek klubu požádat podle pravidel na daný školní rok – pravidla i formulář najdete níže.
          </Callout>
        </div>
      </Section>

      <Section eyebrow="Výbor KR" title="Kontakty" tinted accent={accentAt(4)}>
        <div className="grid gap-4 md:grid-cols-3">
          <PersonCard person={{ name: 'Šárka Dostálová', role: 'předsedkyně', phones: ['737614876'], email: 'dostalova.sarka@allrisk.cz' }} />
          <PersonCard person={{ name: 'Jitka Zářecká', role: 'místopředsedkyně', phones: ['603107979'], email: 'jitka.zarecka@gmail.com' }} />
          <PersonCard
            person={{ name: 'Eva Marková Špačková', role: 'místopředsedkyně', phones: ['732205890'], email: 'markovaspackova@gmail.com' }}
          />
        </div>
      </Section>

      <Section eyebrow="Ke stažení" title="Pravidla a formuláře">
        <DocList
          docs={[
            {
              title: 'Pravidla pro vyplácení příspěvků KR 2025/2026',
              href: '/soubory/klub-rodicu/Pravidla-pro-vyplaceni-prispevku-2025-II..pdf',
              note: 'PDF, 10. 9. 2025'
            },
            { title: 'Formulář žádosti o příspěvek', href: '/soubory/klub-rodicu/Zadosti-pro-ucitele.docx', note: 'Word' }
          ]}
        />
        <p className="mt-8 text-sm text-gray-6">
          Klub rodičů při Základní škole Gutha-Jarkovského Kostelec nad Orlicí, z.s., Komenského 80, 517 41 Kostelec nad Orlicí,
          IČ 270 13 014.
        </p>
      </Section>
    </>
  )
}
