import Image from 'next/image'
import Link from 'next/link'
import { Coins, HandHelping, LifeBuoy, Megaphone, MessagesSquare, ShieldCheck, Users } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { accentAt } from '@/components/ui/accent'
import { Callout, DocList, FactGrid, IconCard, JumpNav, PersonCard, Section } from '@/components/static/kit'
import { ProgramFilter, type Program } from '@/components/static/program-filter'
import { staticPageMetadata } from '@/components/static/meta'
import { WorkplacePopover } from '@/components/workplaces/workplace-popover'

export const metadata = staticPageMetadata({
  title: 'Prevence rizikového chování',
  description:
    'Školní metodička prevence, preventivní programy pro 1. a 2. stupeň, projekt Bezpečné klima školy, informace o šikaně a krizový plán.',
  path: '/prevence-rizikoveho-chovani/'
})

const PROGRAMS: Program[] = [
  {
    title: 'Žijeme reálně, nikoli virtuálně',
    text: 'Dlouhodobý projekt: o přestávkách žáci nepotřebují mobil a komunikují spolu tváří v tvář.',
    audience: ['1', '2'],
    tag: 'celá škola'
  },
  {
    title: 'Kočičí zahrada',
    text: 'Průběžné lekce preventivního programu pod vedením proškolených učitelek naší školy.',
    audience: ['1'],
    tag: '2. a 3. ročník'
  },
  {
    title: 'Dlouhodobý program se Semiramis',
    text: 'Program všeobecné prevence s Centrem primární prevence Semiramis – lektoři pracují se třídami na zdravých vztazích. Letos poprvé i 4. třídy.',
    audience: ['1', '2']
  },
  {
    title: 'Adaptační pobyt',
    text: 'Posílení vztahů v nové třídě a poznání s třídním učitelem – na chatě Roubenka v Sedloňově v Orlických horách, s příspěvkem 800 Kč na žáka z dotací.',
    audience: ['2'],
    tag: '6. ročník'
  },
  {
    title: 'Úcta k životu',
    text: 'Certifikované programy primární prevence pod vedením lektora Mgr. Víta Pospíšila.',
    audience: ['1']
  },
  {
    title: 'OD5K10 – Centrum 5Ka',
    text: 'Prevence užívání návykových látek a šikany, bezpečný pohyb v kyberprostoru, psychická odolnost.',
    audience: ['2']
  },
  {
    title: 'Programy Policie ČR',
    text: 'Preventivní programy pro třídy prvního i druhého stupně.',
    audience: ['1', '2']
  },
  {
    title: 'Bezpečně v dopravě',
    text: 'Projektové dopoledne s tématikou primární prevence ve všech třídách.',
    audience: ['1', '2'],
    tag: 'celá škola'
  },
  {
    title: 'Třídnické hodiny jinak',
    text: '2–3hodinová společná práce třídního učitele a třídy zhruba jednou za dva měsíce.',
    audience: ['1', '2']
  },
  {
    title: 'Výchova k ctnostem',
    text: 'Celoroční projekt podle odborné metodiky, kterou si učitelé 1. stupně osvojili na semináři.',
    audience: ['1']
  },
  {
    title: 'Klídek ve škole',
    text: 'Každý čtvrtek docházejí dvě pracovnice NZDM Klídek na budovu Palackého a nabízejí žákům konzultace.',
    audience: ['2']
  },
  {
    title: 'Psychoterapeut',
    text: 'Externí spolupráce s psychoterapeutem Mgr. Janem Kučerou.',
    audience: ['1', '2'],
    tag: 'externí pracovník'
  }
]

export default function PrevencePage() {
  return (
    <>
      <PageHero
        title="Prevence rizikového chování"
        colorKey="prevence-rizikoveho-chovani"
        eyebrow="Poradenství"
        lead="Bezpečná třída, dobré vztahy a pomoc, když se něco děje. Co pro to ve škole děláme a na koho se obrátit."
      >
        <JumpNav
          items={[
            { href: '#pomoc', label: 'Potřebuji pomoc' },
            { href: '#kontakt', label: 'Metodička prevence' },
            { href: '#programy', label: 'Programy 2025/26' },
            { href: '#dokumenty', label: 'Dokumenty' },
            { href: '#spoluprace', label: 'Spolupráce' }
          ]}
        />
      </PageHero>

      <Section id="pomoc" eyebrow="Děje se něco?" title="Nebojte se ozvat">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout icon={LifeBuoy} accent={accentAt(2)} title="Pro žáky">
            Ubližuje ti někdo, posmívá se ti nebo tě vylučuje z party – ve škole nebo na internetu? Řekni to třídnímu učiteli,
            metodičce prevence nebo komukoli z dospělých ve škole. Nejsi v tom sám.
            <a
              href="/soubory/prevence-rizikoveho-chovani/Informace-pro-zaky-sikanovani.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-4 bg-paper py-2 text-base"
            >
              Informace pro žáky – šikanování
            </a>
          </Callout>
          <Callout icon={HandHelping} accent={accentAt(1)} title="Pro rodiče">
            Všimli jste si změny v chování dítěte, nebo máte podezření na šikanu? Kontaktujte metodičku prevence – poradíme a
            domluvíme další postup.
            <a
              href="/soubory/prevence-rizikoveho-chovani/Informace-pro-rodice-sikanovani.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-4 bg-paper py-2 text-base"
            >
              Informace pro rodiče – šikanování
            </a>
          </Callout>
        </div>
      </Section>

      <Section id="kontakt" eyebrow="Školní metodička prevence" title="Kontakt" tinted accent={accentAt(3)}>
        <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <PersonCard
            person={{
              name: 'Mgr. Pavla Řeháková, DiS.',
              role: 'školní metodička prevence, sociální pedagožka',
              place: (
                <>
                  Pracoviště <WorkplacePopover place="palackeho">Palackého náměstí</WorkplacePopover>,{' '}
                  <WorkplacePopover place="komenskeho">Komenského</WorkplacePopover>,{' '}
                  <WorkplacePopover place="drtinova">Drtinova</WorkplacePopover>
                </>
              ),
              hours: 'Konzultace po domluvě',
              phones: ['775177678'],
              email: 'pavla.rehakova@zskostelec.cz'
            }}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <IconCard icon={ShieldCheck} title="Metodika a koordinace" accent={accentAt(0)}>
              <ul>
                <li>preventivní plán školy</li>
                <li>metodická pomoc učitelům i rodičům</li>
                <li>koordinace prevence ve škole i s externími organizacemi</li>
                <li>diagnostika třídních kolektivů</li>
              </ul>
            </IconCard>
            <IconCard icon={Megaphone} title="Informace" accent={accentAt(1)}>
              <ul>
                <li>sledování změn v legislativě</li>
                <li>předávání informací učitelům</li>
                <li>spolupráce s rodiči při podezření na rizikové chování</li>
              </ul>
            </IconCard>
            <IconCard icon={MessagesSquare} title="Poradenství" accent={accentAt(2)}>
              <ul>
                <li>pedagogům – postupy, práce se třídou</li>
                <li>rodičům – změny chování, spolupráce se SVP, PPP, OSPOD</li>
                <li>žákům – jak chránit své bezpečí a na koho se obrátit</li>
              </ul>
            </IconCard>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-6">
          Činnost metodika prevence stanovuje vyhláška č. 72/2005 Sb., o poskytování poradenských služeb ve školách.
        </p>
      </Section>

      <Section id="programy" eyebrow="Školní rok 2025/26" title="Bezpečné klima školy VII. – Společně a bezpečně">
        <p className="mb-6 max-w-3xl text-lg">
          Dlouhodobý projekt za finanční podpory Královéhradeckého kraje (dotační program KHK a Šablony IV OP JAK II).
          Všechny aktivity kromě adaptačního pobytu jsou pro žáky zdarma.
        </p>
        <FactGrid
          className="mb-10"
          facts={[
            { icon: Coins, label: 'Dotace KHK – prevence', value: '36 000 Kč' },
            { icon: Users, label: 'Dotace KHK – etická výchova', value: '20 000 Kč' },
            { icon: HandHelping, label: 'Nadace Kinský', value: '100 000 Kč' }
          ]}
        />
        <ProgramFilter programs={PROGRAMS} />
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Image
            src="/soubory/prevence-rizikoveho-chovani/Kralovehradecky-kraj.png"
            alt="Královéhradecký kraj"
            width={175}
            height={77}
          />
          <Image src="/soubory/prevence-rizikoveho-chovani/Fond-Kinsky.jpg" alt="Nadace Kinský" width={221} height={120} />
        </div>
        <p className="mt-4 text-gray-7">
          Termíny všech aktivit jsou v plánu práce v aplikaci EduPage, fotky z programů ve{' '}
          <Link href="/fotogalerie/">fotogalerii</Link>.
        </p>
      </Section>

      <Section id="dokumenty" eyebrow="Ke stažení" title="Dokumenty" tinted accent={accentAt(4)}>
        <DocList
          docs={[
            { title: 'Preventivní program', href: '/soubory/prevence-rizikoveho-chovani/Preventivni-program.pdf' },
            { title: 'Školní program proti šikanování', href: '/soubory/prevence-rizikoveho-chovani/Skolni-program-proti-sikanovani.pdf' },
            {
              title: 'Strategie prevence a řešení školní neúspěšnosti',
              href: '/soubory/prevence-rizikoveho-chovani/Strategie-prevence-a-reseni-skolni-neuspesnosti.pdf'
            },
            { title: 'Krizový plán', href: '/soubory/prevence-rizikoveho-chovani/Krizovy-plan.pdf' },
            { title: 'Krizový plán graficky', href: '/soubory/prevence-rizikoveho-chovani/KRIZOVY-PLAN-graficky.pdf' },
            { title: 'Informace pro rodiče – šikanování', href: '/soubory/prevence-rizikoveho-chovani/Informace-pro-rodice-sikanovani.pdf' },
            { title: 'Informace pro žáky – šikanování', href: '/soubory/prevence-rizikoveho-chovani/Informace-pro-zaky-sikanovani.pdf' }
          ]}
        />
      </Section>

      <Section id="spoluprace" eyebrow="Odborná spolupráce" title="S kým spolupracujeme">
        <div className="grid gap-4 md:grid-cols-3">
          <PersonCard
            person={{
              name: 'Mgr. Zdenka Ženatová-Moravcová',
              role: 'PPP Královéhradeckého kraje, pracoviště Rychnov n. Kn.',
              note: 'Speciální pedagog, metodik prevence',
              phones: ['494535476', '775235476'],
              email: 'ppprychnov@seznam.cz'
            }}
          />
          <PersonCard
            person={{
              name: 'Jaroslava Popiolková, DiS.',
              role: 'vedoucí OSV Kostelec nad Orlicí',
              phones: ['725568015'],
              email: 'jpopiolkova@muko.cz'
            }}
          />
          <PersonCard
            person={{
              name: 'Bc. Inka Kopecká',
              role: 'kurátorka pro mládež, OSV Kostelec nad Orlicí',
              phones: ['771270310'],
              email: 'ikopecka@muko.cz'
            }}
          />
        </div>
      </Section>
    </>
  )
}
