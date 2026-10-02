import { BookOpenCheck, HeartHandshake, Lightbulb, Puzzle } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { Callout, DocList, IconCard, LinkList, PersonCard, Section } from '@/components/static/kit'
import { staticPageMetadata } from '@/components/static/meta'

export const metadata = staticPageMetadata({
  title: 'Výchovné poradenství',
  description:
    'Výchovná poradkyně školy: péče o žáky se speciálními vzdělávacími potřebami a nadané žáky, spolupráce s poradnami, zápis do 1. tříd.',
  path: '/vychovne-poradenstvi/'
})

export default function VychovnePoradenstviPage() {
  return (
    <>
      <PageHero
        title="Výchovné poradenství"
        colorKey="vychovne-poradenstvi"
        eyebrow="Poradenství"
        lead="Když dítě potřebuje ve škole víc podpory – nebo naopak víc výzvy. Pomůžeme najít cestu a domluvit se s poradnou."
      />

      <Section eyebrow="Výchovná poradkyně" title="Kontakt">
        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
          <PersonCard
            person={{
              name: 'Mgr. Romana Tomanová',
              role: 'výchovná poradkyně',
              place: 'Pracoviště Palackého náměstí',
              hours: 'Konzultace denně po předchozí ústní nebo telefonické domluvě',
              phones: ['608983497'],
              email: 'romana.tomanova@zskostelec.cz'
            }}
          />
          <Callout icon={HeartHandshake} accent={accentAt(3)} title="Kdy se ozvat?">
            Když má vaše dítě potíže s učením nebo chováním, potřebuje podpůrná opatření či individuální plán, je mimořádně
            nadané – nebo jen nevíte, na koho se obrátit. Rádi poradíme.
          </Callout>
        </div>
      </Section>

      <Section eyebrow="Co děláme" title="Činnosti výchovné poradkyně" tinted accent={accentAt(1)}>
        <div className="grid gap-4 lg:grid-cols-3">
          <IconCard icon={Puzzle} title="Poradenské činnosti" accent={accentAt(0)}>
            <ul>
              <li>vyhledávání a orientační šetření žáků, jejichž vývoj a vzdělávání vyžadují zvláštní pozornost</li>
              <li>péče o tyto žáky, včetně přípravy, kontroly a evidence plánu pedagogické podpory</li>
              <li>zprostředkování diagnostiky speciálních vzdělávacích potřeb a mimořádného nadání v PPP nebo SPC</li>
              <li>spolupráce s poradnami při zajišťování podpůrných opatření</li>
              <li>příprava podmínek pro vzdělávání žáků se SVP ve škole</li>
              <li>koordinace poradenských služeb a vzdělávacích opatření u těchto žáků</li>
            </ul>
          </IconCard>
          <IconCard icon={Lightbulb} title="Metodické a informační činnosti" accent={accentAt(2)}>
            <ul>
              <li>příprava a vyhodnocování plánu pedagogické podpory</li>
              <li>tvorba a vyhodnocování individuálních vzdělávacích plánů</li>
              <li>práce s nadanými a mimořádně nadanými žáky</li>
              <li>nové metody pedagogické diagnostiky a intervence pro učitele</li>
              <li>metodická pomoc učitelům v otázkách integrace, IVP a práce s nadanými žáky</li>
              <li>informace o poradenských zařízeních v regionu pro žáky a rodiče</li>
              <li>shromažďování odborných zpráv o žácích v poradenské péči</li>
              <li>písemné záznamy o činnosti a realizovaných opatřeních</li>
            </ul>
          </IconCard>
          <IconCard icon={BookOpenCheck} title="Další činnosti" accent={accentAt(4)}>
            <ul>
              <li>nákup kompenzačních pomůcek a učebních materiálů pro žáky se SVP</li>
              <li>spolupráce s mateřskými školami (zápis nanečisto)</li>
              <li>účast na zápisu dětí do 1. tříd</li>
            </ul>
          </IconCard>
        </div>
      </Section>

      <Section eyebrow="Budoucí prvňáčci" title="Zápis do 1. tříd">
        <DocList
          docs={[
            {
              title: 'Desatero pro budoucí prvňáčky a jejich rodiče',
              href: '/soubory/vychovne-poradenstvi/Desatero-pro-budouci-prvnacky-a-jejich-rodice.pdf',
              note: 'PDF'
            },
            { title: 'Vše o zápisu do 1. tříd', href: '/soubory/vychovne-poradenstvi/Vse-o-zapisu-do-1.-trid.pdf', note: 'PDF' }
          ]}
        />
      </Section>

      <Section eyebrow="Poradenská zařízení" title="Užitečné odkazy" tinted accent={accentAt(0)}>
        <LinkList
          links={[
            {
              title: 'PPP Rychnov nad Kněžnou',
              href: 'http://www.poradenstvikhk.cz/ppp/ppp-rychnov-nad-kneznou/',
              note: 'Pedagogicko-psychologická poradna'
            },
            {
              title: 'SPC Rychnov nad Kněžnou',
              href: 'http://www.poradenstvikhk.cz/spc/spc-rychnov-nad-kneznou/',
              note: 'Speciálně pedagogické centrum'
            },
            {
              title: 'PPP Hradec Králové',
              href: 'http://www.poradenstvikhk.cz/ppp/ppp-hradec-kralove/',
              note: 'Pedagogicko-psychologická poradna'
            },
            { title: 'PPP Ústí nad Orlicí', href: 'http://www.pppuo.cz', note: 'pppuo.cz' }
          ]}
        />
      </Section>
    </>
  )
}
