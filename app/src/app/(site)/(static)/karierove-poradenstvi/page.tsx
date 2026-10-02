import { Briefcase, Brain, Compass, School } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { DocList, IconCard, LinkList, PersonCard, Section } from '@/components/static/kit'
import { Countdown } from '@/components/static/countdown'
import { staticPageMetadata } from '@/components/static/meta'
import { WorkplacePopover } from '@/components/workplaces/workplace-popover'

export const metadata = staticPageMetadata({
  title: 'Kariérové poradenství',
  description: 'Pomoc s volbou střední školy a povolání: kontakt na kariérového poradce, termíny přihlášek a přijímacích zkoušek, užitečné odkazy.',
  path: '/karierove-poradenstvi/'
})

export default function KarierovePoradenstviPage() {
  return (
    <>
      <PageHero
        title="Kariérové poradenství"
        colorKey="karierove-poradenstvi"
        eyebrow="Poradenství"
        lead="Kam po deváté třídě? Pomůžeme vybrat střední školu nebo učiliště a pohlídat všechny termíny."
      />

      <Section eyebrow="Důležité termíny" title="Přijímačky na střední školy">
        <Countdown
          milestones={[
            { label: 'Odevzdání přihlášek na SŠ', when: '1. – 22. 2. 2027', start: '2027-02-01', end: '2027-02-22' },
            { label: 'Přijímací zkoušky', when: '12. – 13. 4. 2027', start: '2027-04-12', end: '2027-04-13' }
          ]}
        />
      </Section>

      <Section eyebrow="Kariérový poradce" title="Na koho se obrátit" tinted accent={accentAt(1)}>
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <PersonCard
            person={{
              name: 'Mgr. Petr Málek',
              role: 'kariérový poradce',
              place: (
                <>
                  Pracoviště <WorkplacePopover place="palackeho">Palackého náměstí</WorkplacePopover>
                </>
              ),
              hours: 'Konzultace denně po ústní či telefonické domluvě',
              phones: ['775902746']
            }}
          />
          <IconCard icon={Compass} title="S čím pomůžeme" accent={accentAt(2)}>
            <ul>
              <li>volba dalšího vzdělávání – SŠ a SOU</li>
              <li>spolupráce s Úřadem práce v Rychnově nad Kněžnou</li>
              <li>informační servis – studijní obory, dny otevřených dveří, školské výstavy</li>
              <li>spolupráce s PPP – testy studijních předpokladů a prostorové orientace</li>
            </ul>
          </IconCard>
        </div>
      </Section>

      <Section eyebrow="Pomoc zvenku" title="Kam dál pro radu">
        <div className="grid gap-4 md:grid-cols-2">
          <IconCard icon={Briefcase} title="Úřad práce RK – informační a poradenské středisko" accent={accentAt(3)}>
            <ul>
              <li>podrobné informace o SŠ a SOU</li>
              <li>charakteristiky povolání včetně videí</li>
              <li>zájmové oblasti volby povolání</li>
              <li>profesní šetření pro volbu povolání – program COMDI</li>
            </ul>
            <PersonCard
              className="mt-4 h-auto border-2 shadow-none"
              person={{
                name: 'Eva Buňatová',
                role: 'odborný pracovník pro volbu povolání',
                phones: ['950159431'],
                email: 'eva.bunatova@uradprace.cz'
              }}
            />
          </IconCard>
          <IconCard icon={Brain} title="Pedagogicko-psychologická poradna Rychnov n. Kn." accent={accentAt(4)}>
            <ul>
              <li>testy obecných studijních předpokladů</li>
              <li>osobnostní testy, poradenská činnost</li>
            </ul>
            <PersonCard
              className="mt-4 h-auto border-2 shadow-none"
              person={{ name: 'PPP Rychnov nad Kněžnou', place: 'Javornická 1501, Rychnov nad Kněžnou', phones: ['494535476'] }}
            />
          </IconCard>
        </div>
      </Section>

      <Section eyebrow="Ke stažení a odkazy" title="Užitečné materiály" tinted accent={accentAt(0)}>
        <DocList docs={[{ title: 'Desatero vycházejícího žáka', href: '/soubory/karierove-poradenstvi/desatero.pdf', note: 'PDF' }]} />
        <LinkList
          className="mt-4"
          links={[
            {
              title: 'InfoAbsolvent.cz',
              href: 'https://www.infoabsolvent.cz/',
              note: 'Všechny střední školy v ČR, obory, kontakty, požadavky k přijímačkám'
            },
            { title: 'PPP Rychnov nad Kněžnou', href: 'http://www.ppprychnov.cz/', note: 'Pedagogicko-psychologická poradna' }
          ]}
        />
        <p className="mt-6 flex items-center gap-2 text-gray-7">
          <School className="size-5" aria-hidden /> Kariérové poradenství patří k metodické a informační činnosti školního
          poradenského pracoviště.
        </p>
      </Section>
    </>
  )
}
