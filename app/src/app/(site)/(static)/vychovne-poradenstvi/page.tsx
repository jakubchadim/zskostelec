import {
  Backpack,
  BookOpenCheck,
  Building2,
  ClipboardList,
  Eye,
  FolderOpen,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  MapPinned,
  MessagesSquare,
  Package,
  Presentation,
  Puzzle,
  RefreshCw,
  Search,
  Sparkles,
  Users
} from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { Callout, DocList, LinkList, PersonCard, Section } from '@/components/static/kit'
import { StepPath } from '@/components/static/step-path'
import { AudienceTabs } from '@/components/static/audience-tabs'
import { ActivityGrid, Glossary } from '@/components/static/activity-grid'
import { staticPageMetadata } from '@/components/static/meta'
import { WorkplacePopover } from '@/components/workplaces/workplace-popover'

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
              place: (
                <>
                  Pracoviště <WorkplacePopover place="palackeho">Palackého náměstí</WorkplacePopover>
                </>
              ),
              hours: 'Konzultace denně po předchozí ústní nebo telefonické domluvě',
              phones: ['608983497'],
              email: 'romana.tomanova@zskostelec.cz'
            }}
          />
          <Callout icon={HeartHandshake} accent={accentAt(3)} title="Kdy se ozvat?">
            Když má vaše dítě potíže s učením nebo chováním, potřebuje podpůrná opatření či individuální plán, je
            mimořádně nadané – nebo jen nevíte, na koho se obrátit. Rádi poradíme.
          </Callout>
        </div>
      </Section>

      <Section eyebrow="Krok za krokem" title="Jak podpora probíhá" tinted accent={accentAt(1)}>
        <StepPath
          steps={[
            {
              icon: Eye,
              title: 'Všimneme si',
              tag: 'učitel, rodič i žák',
              text: 'Něco nejde – v učení nebo v chování. Nebo dítě naopak výrazně předbíhá a potřebuje víc výzvy.'
            },
            {
              icon: Search,
              title: 'Podíváme se, kde je potíž',
              text: 'Výchovná poradkyně udělá orientační šetření: pozorování, rozhovor s učiteli i s vámi.'
            },
            {
              icon: ClipboardList,
              title: 'Plán pedagogické podpory',
              tag: 'škola sama',
              text: 'První úpravy výuky nastavíme hned ve škole – plán připravíme, hlídáme a vyhodnocujeme.'
            },
            {
              icon: Building2,
              title: 'Vyšetření v poradně',
              tag: 's vaším souhlasem',
              text: 'Když to nestačí, zprostředkujeme diagnostiku v PPP nebo SPC – u obtíží i u mimořádného nadání.'
            },
            {
              icon: Puzzle,
              title: 'Podpůrná opatření',
              text: 'Podle doporučení poradny připravíme podmínky: individuální plán, pomůcky, úpravy výuky.'
            },
            {
              icon: RefreshCw,
              title: 'Průběžně vyhodnocujeme',
              text: 'Jak se daří? Plány pravidelně upravujeme spolu s učiteli i s vámi.'
            }
          ]}
        />
      </Section>

      <Section eyebrow="Co děláme" title="Činnosti výchovné poradkyně">
        <AudienceTabs
          label="Pro koho"
          tabs={[
            {
              key: 'rodice',
              label: 'Rodičům',
              icon: <Users aria-hidden />,
              panel: (
                <ActivityGrid
                  items={[
                    {
                      icon: MessagesSquare,
                      title: 'Konzultace',
                      text: 'denně po předchozí domluvě'
                    },
                    {
                      icon: Building2,
                      title: 'Cesta do poradny',
                      text: 'zprostředkujeme vyšetření v PPP nebo SPC'
                    },
                    {
                      icon: MapPinned,
                      title: 'Kam se obrátit',
                      text: 'přehled poradenských zařízení v regionu'
                    },
                    {
                      icon: Backpack,
                      title: 'Zápis do 1. tříd',
                      text: 'zápis nanečisto s mateřskými školami i samotný zápis'
                    }
                  ]}
                />
              )
            },
            {
              key: 'zaci',
              label: 'Žákům',
              icon: <GraduationCap aria-hidden />,
              panel: (
                <ActivityGrid
                  items={[
                    {
                      icon: Puzzle,
                      title: 'Podpora při potížích',
                      text: 'péče o žáky se speciálními vzdělávacími potřebami'
                    },
                    {
                      icon: Sparkles,
                      title: 'Výzvy pro nadané',
                      text: 'práce s nadanými a mimořádně nadanými žáky'
                    },
                    {
                      icon: ClipboardList,
                      title: 'Plán na míru',
                      text: 'individuální vzdělávací plán, když je potřeba'
                    },
                    {
                      icon: Package,
                      title: 'Pomůcky',
                      text: 'kompenzační pomůcky a učební materiály'
                    }
                  ]}
                />
              )
            },
            {
              key: 'ucitele',
              label: 'Učitelům',
              icon: <Presentation aria-hidden />,
              panel: (
                <ActivityGrid
                  items={[
                    {
                      icon: Lightbulb,
                      title: 'Metodická pomoc',
                      text: 'integrace, IVP, práce s nadanými žáky'
                    },
                    {
                      icon: BookOpenCheck,
                      title: 'Nové metody',
                      text: 'pedagogická diagnostika a intervence'
                    },
                    {
                      icon: ClipboardList,
                      title: 'Plány podpory',
                      text: 'příprava a vyhodnocování PLPP a IVP'
                    },
                    {
                      icon: FolderOpen,
                      title: 'Evidence',
                      text: 'odborné zprávy a záznamy o přijatých opatřeních'
                    }
                  ]}
                />
              )
            }
          ]}
        />
      </Section>

      <Section eyebrow="Slovníček" title="Zkratky, na které narazíte" tinted accent={accentAt(4)}>
        <Glossary
          terms={[
            {
              term: 'SVP',
              full: 'Speciální vzdělávací potřeby',
              text: 'Dítě potřebuje k učení nějakou formu podpory.'
            },
            {
              term: 'PO',
              full: 'Podpůrná opatření',
              text: 'Úpravy výuky v 5 stupních – první nastavuje škola sama, vyšší doporučuje poradna.'
            },
            {
              term: 'PLPP',
              full: 'Plán pedagogické podpory',
              text: 'První krok – úpravy, které škola nastaví sama.'
            },
            {
              term: 'IVP',
              full: 'Individuální vzdělávací plán',
              text: 'Výuka upravená na míru konkrétnímu žákovi.'
            },
            {
              term: 'PPP',
              full: 'Pedagogicko-psychologická poradna',
              text: 'Vyšetří obtíže v učení, chování i nadání.'
            },
            {
              term: 'SPC',
              full: 'Speciálně pedagogické centrum',
              text: 'Pro děti se zdravotním postižením.'
            }
          ]}
        />
      </Section>

      <Section eyebrow="Budoucí prvňáčci" title="Zápis do 1. tříd">
        <DocList
          docs={[
            {
              title: 'Desatero pro budoucí prvňáčky a jejich rodiče',
              href: '/soubory/vychovne-poradenstvi/Desatero-pro-budouci-prvnacky-a-jejich-rodice.pdf',
              note: 'PDF'
            },
            {
              title: 'Vše o zápisu do 1. tříd',
              href: '/soubory/vychovne-poradenstvi/Vse-o-zapisu-do-1.-trid.pdf',
              note: 'PDF'
            }
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
            {
              title: 'PPP Ústí nad Orlicí',
              href: 'http://www.pppuo.cz',
              note: 'pppuo.cz'
            }
          ]}
        />
      </Section>
    </>
  )
}
