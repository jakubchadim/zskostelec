import Image from 'next/image'
import {
  Apple,
  CalendarClock,
  ClipboardList,
  Clock,
  CreditCard,
  KeyRound,
  Soup,
  Stethoscope,
  Smartphone,
  UtensilsCrossed,
  Wallet,
  Thermometer,
  PiggyBank
} from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { Container } from '@/components/ui/container'
import { accentAt } from '@/components/ui/accent'
import { Accordion, Callout, DocList, FactGrid, JumpNav, PersonCard, Section } from '@/components/static/kit'
import { DeadlineHelper, PricePicker } from '@/components/static/canteen-widgets'
import { staticPageMetadata } from '@/components/static/meta'
import { cn } from '@/lib/utils'

export const metadata = staticPageMetadata({
  title: 'Školní stravování',
  description:
    'Obědy pro žáky ve školní restauraci Primirest (Komenského 1473): ceny, výdejní doba, jak se přihlásit, objednat, odhlásit a zaplatit.',
  path: '/skolni-stravovani/'
})

/*
 * Source: "Vnitřní řád školní jídelny" (Primirest, provozovna č. 7330),
 * platnost od 1. 9. 2026, and the canteen's opening-hours sheet. When a new
 * řád comes out, update the numbers here and swap the PDF in
 * public/soubory/skolni-stravovani/.
 */
const MENU_URL = 'https://primiapp.cz/#/public/dining/menu/3013/117'
const PRIMIAPP_URL = 'https://primiapp.cz'

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Odevzdejte přihlášku',
    text: 'Přihlášku ke stravování vyplní každý žák (zákonný zástupce) – na začátku i během školního roku. Bez ní nelze jídlo vydat. S přihláškou dostanete variabilní a specifický symbol.'
  },
  {
    icon: KeyRound,
    title: 'Kupte si čip',
    text: 'Čipem se žák přihlašuje u výdeje. Čip se kupuje v kanceláři jídelny za smluvní cenu, patří strávníkovi a nepůjčuje se.'
  },
  {
    icon: Smartphone,
    title: 'Zaregistrujte se v PrimiApp',
    text: 'Na PrimiApp.cz nebo v mobilní aplikaci uvidíte jídelníček, zůstatek a konzumaci, objednáte a odhlásíte obědy, můžete omezit nákup sladkostí a nastavit upozornění na nízký zůstatek. Autorizační kód vám pošle jídelna e-mailem.'
  },
  {
    icon: Wallet,
    title: 'Pošlete zálohu',
    text: 'Plaťte vždy na měsíc dopředu – částku si určíte sami. Na kontě musí být kladný zůstatek, jinak automatická objednávka neproběhne.'
  }
]

export default function SkolniStravovaniPage() {
  return (
    <>
      <PageHero
        title="Školní stravování"
        colorKey="skolni-stravovani"
        eyebrow="Obědy pro žáky"
        lead="Obědy vaří a vydává Primirest ve školní restauraci v Komenského ulici. Všechno důležité na jednom místě – bez listování PDFkem."
      >
        <div className="flex flex-wrap gap-3">
          <a href={MENU_URL} target="_blank" rel="noopener noreferrer" className="btn bg-sun text-lg">
            <Soup className="size-5" aria-hidden />
            Jídelníček
          </a>
          <a href={PRIMIAPP_URL} target="_blank" rel="noopener noreferrer" className="btn bg-paper text-lg">
            <Smartphone className="size-5" aria-hidden />
            Objednat v PrimiApp
          </a>
        </div>
        <div className="mt-5">
          <JumpNav
            items={[
              { href: '#kdy', label: 'Kdy a kde' },
              { href: '#cena', label: 'Kolik to stojí' },
              { href: '#odhlasovani', label: 'Odhlašování' },
              { href: '#zacinate', label: 'Jak začít' },
              { href: '#platba', label: 'Platba' },
              { href: '#co-kdyz', label: 'Co když…' },
              { href: '#kontakt', label: 'Kontakt' }
            ]}
          />
        </div>
      </PageHero>

      <Section id="kdy" eyebrow="Kdy a kde" title="Výdej obědů">
        <FactGrid
          facts={[
            { icon: UtensilsCrossed, label: 'Obědy', value: '11:00 – 14:30', hint: 'pondělí až pátek' },
            {
              icon: Thermometer,
              label: 'Do jídlonosiče',
              value: '11:00 – 11:15',
              hint: 'jen první den nemoci, u bočního vchodu do stravovacího pavilonu'
            },
            { icon: Clock, label: 'Kancelář jídelny', value: '6:00 – 14:30', hint: 'úřední hodiny po telefonické domluvě' }
          ]}
        />
        <p className="mt-6 text-lg">
          Školní restaurace – jídelna a bufet ZŠ, MŠ a OA, <strong>Komenského 1473, Kostelec nad Orlicí</strong>. Výdej pro
          veřejnost je 11:00 – 11:45.
        </p>
      </Section>

      <Section id="cena" eyebrow="Ceník" title="Kolik stojí oběd" tinted accent={accentAt(0)}>
        <PricePicker
          bands={[
            { label: '7–10 let', ages: '7–10 let', price: 36 },
            { label: '11–14 let', ages: '11–14 let', price: 38 },
            { label: '15+ let', ages: '15 a více', price: 41 }
          ]}
        />
        <p className="mt-4 text-gray-7">
          Menu obsahuje polévku, hlavní jídlo, doplněk a nápoj (neslazený čaj, voda). Každý den se vybírá ze 3 jídel (MENU
          č. 1, 2 nebo 3). Na čip lze odebrat jen jedno dotované jídlo denně. Od druhého dne nemoci a o prázdninách se platí
          cena včetně režijních nákladů.
        </p>
      </Section>

      <Section id="odhlasovani" eyebrow="Objednávky" title="Stihnu to ještě?">
        <DeadlineHelper />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: CalendarClock,
              title: 'Každou středu',
              text: 'vyjde jídelníček na další týden a proběhne automatická objednávka.'
            },
            {
              icon: Smartphone,
              title: 'Změna menu',
              text: 'nejpozději den předem do 14:00 – v PrimiApp nebo na terminálu před jídelnou.'
            },
            {
              icon: Stethoscope,
              title: 'Zrušení (nemoc)',
              text: 'telefonicky nebo e-mailem do 8:00 ráno v den, kdy má žák chybět.'
            }
          ].map((item, idx) => (
            <div key={item.title} className={cn('sticker flex gap-3 p-5', accentAt(idx + 1).tint)}>
              <item.icon className={cn('size-7 shrink-0', accentAt(idx + 1).text)} aria-hidden />
              <p className="m-0">
                <strong className="font-display text-lg">{item.title}</strong> {item.text}
              </p>
            </div>
          ))}
        </div>
        <Callout className="mt-6" accent={accentAt(2)} icon={Clock} title="Pozor na nevyzvednuté obědy">
          Objednané jídlo (i to objednané automaticky), které si žák nevyzvedne do 14:00, se z konta odečte.
        </Callout>
      </Section>

      <Section id="zacinate" eyebrow="Začínáte?" title="Čtyři kroky k prvnímu obědu" tinted accent={accentAt(3)}>
        <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <li key={step.title} className="sticker relative flex flex-col gap-3 p-5 pt-7">
              <span
                className={cn(
                  'absolute -top-4 left-5 grid size-9 place-items-center rounded-full border-[2.5px] border-ink font-display text-lg font-extrabold',
                  accentAt(idx).bg
                )}
              >
                {idx + 1}
              </span>
              <step.icon className={cn('size-7', accentAt(idx).text)} aria-hidden />
              <h3 className="font-display text-xl leading-tight">{step.title}</h3>
              <p className="m-0 text-gray-8">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid items-center gap-6 md:grid-cols-[1fr_18rem]">
          <Callout icon={Smartphone} accent={accentAt(1)} title="Mobilní aplikace PrimiApp">
            Vše, co znáte z portálu PrimiApp.cz, teď i v telefonu. Aplikaci najdete v App Store i Google Play pod názvem{' '}
            <strong>PrimiApp</strong> – nebo naskenujte QR kód z letáku.
          </Callout>
          <a
            href="/soubory/skolni-stravovani/Primirest-mobilni-aplikace-2026_1.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="sticker hover-lift block rotate-2 overflow-hidden p-0"
          >
            <Image
              src="/soubory/skolni-stravovani/Primirest-mobilni-aplikace-2026_1.jpg"
              alt="Leták PrimiApp s QR kódy pro stažení aplikace (iPhone a Android)"
              width={1240}
              height={1754}
              sizes="18rem"
              className="h-auto w-full"
            />
          </a>
        </div>
      </Section>

      <Section id="platba" eyebrow="Platba" title="Jak zaplatit">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="sticker p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-display text-xl">
              <CreditCard className="size-6 text-[#0f5fb3]" aria-hidden /> Převodem na účet Primirestu
            </h3>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="font-bold">Účet</dt>
              <dd className="m-0 font-display text-xl font-bold">43-2324190217/0100</dd>
              <dt className="font-bold">Banka</dt>
              <dd className="m-0">Komerční banka, Praha</dd>
              <dt className="font-bold">Variabilní symbol</dt>
              <dd className="m-0">každý strávník dostane s přihláškou</dd>
              <dt className="font-bold">Specifický symbol</dt>
              <dd className="m-0">číslo závodu – také z přihlášky</dd>
            </dl>
            <p className="mt-4 mb-0 rounded-xl bg-berry-tint p-3 text-sm font-semibold">
              S chybným variabilním nebo specifickým symbolem se platba nepřiřadí ke kontu žáka.
            </p>
          </div>
          <div className="grid gap-4">
            <Callout icon={Smartphone} accent={accentAt(3)} title="Platební brána">
              Kartou přímo na PrimiApp.cz nebo v aplikaci PrimiApp.
            </Callout>
            <Callout icon={Wallet} accent={accentAt(0)} title="Hotově na pobočce KB">
              Vkladem na účet na pobočce Komerční banky (za poplatek).
            </Callout>
            <Callout icon={PiggyBank} accent={accentAt(4)} title="Přeplatek na konci roku">
              Pokud o vrácení nepožádáte, převede se do dalšího školního roku. Vrácení lze kdykoli písemně požádat v
              kanceláři jídelny – pak je potřeba na září složit novou zálohu.
            </Callout>
          </div>
        </div>
      </Section>

      <Section id="co-kdyz" eyebrow="Co když…" title="Nejčastější situace" tinted accent={accentAt(4)}>
        <Accordion
          items={[
            {
              title: 'Dítě onemocnělo',
              content: (
                <>
                  <p>
                    Oběd zrušte telefonicky nebo e-mailem do 8:00. Pokud to nestihnete, můžete si <strong>první den nemoci</strong>{' '}
                    oběd vyzvednout do vlastní omyvatelné nádoby (nebo jednorázového obalu za poplatek) mezi 11:00 a 11:15 u
                    bočního vchodu do stravovacího pavilonu.
                  </p>
                  <p>Od druhého dne nemoci se platí plná cena včetně režijních nákladů – proto obědy včas odhlaste.</p>
                </>
              )
            },
            {
              title: 'Žák zapomněl nebo ztratil čip',
              content: (
                <>
                  <p>
                    Ztrátu nebo krádež hned nahlaste vedoucí jídelny – čip se zablokuje, aby ho nikdo nezneužil. Při ztrátě je
                    potřeba koupit čip nový.
                  </p>
                  <p>
                    Bez čipu se jídlo vydá jen po podpisu „povolení ručního vstupu“. Takto účtované položky pak nejde
                    reklamovat.
                  </p>
                </>
              )
            },
            {
              title: 'Dítě má alergii nebo dietu',
              content: (
                <>
                  <p>
                    Přineste potvrzení od dětského lékaře a s vedoucí jídelny domluvte vhodnou kombinaci jídel. Jídelna
                    dietní jídla nevaří, po domluvě ale připraví pokrm s nižším obsahem alergenu – stoprocentně ho však vyloučit
                    nedokáže.
                  </p>
                  <p>
                    Při silné alergii může žák nosit vlastní jídlo (s lékařským potvrzením a smlouvou o donášce). Jídelna ho
                    uloží zvlášť a ohřeje.
                  </p>
                </>
              )
            },
            {
              title: 'Porce je malá nebo jídlo není v pořádku',
              content: (
                <p>
                  Velikost porce se reklamuje hned u výdejního pultu (pracovník ji převáží), kvalitu jídla ihned po zjištění.
                  Připomínky přijímá vedoucí jídelny, šéfkuchař nebo ředitel školy.
                </p>
              )
            },
            {
              title: 'Žák odchází ze školy',
              content: (
                <p>
                  Při ukončení studia nebo přestupu je potřeba ukončit stravování a vyrovnat konto v kanceláři jídelny.
                  Přeplatek se vrací na písemnou žádost.
                </p>
              )
            },
            {
              title: 'Chci se přijít podívat nebo ochutnat',
              content: (
                <p>
                  Zákonní zástupci, kteří odevzdali přihlášku, mohou do jídelny přijít pro dítě a oběd i ochutnat.
                </p>
              )
            }
          ]}
        />
      </Section>

      <Section id="kontakt" eyebrow="Kontakt" title="Školní restaurace Primirest">
        <div className="grid gap-4 md:grid-cols-2">
          <PersonCard
            person={{
              name: 'Miroslava Nováková',
              role: 'vedoucí školní jídelny',
              place: 'Komenského 1473, Kostelec nad Orlicí',
              hours: 'Kancelář 6:00 – 14:30, po telefonické domluvě',
              phones: ['731438293', '731438381'],
              email: 'zr.7330@primirest.cz'
            }}
          />
          <div className="flex flex-col gap-4">
            <Callout icon={Apple} accent={accentAt(3)} title="Co dalšího jídelna nabízí">
              Bufet se svačinami z vlastní výroby, ovocem, dezerty a saláty.
            </Callout>
            <DocList
              className="sm:grid-cols-1"
              docs={[
                {
                  title: 'Vnitřní řád školní jídelny',
                  href: '/soubory/skolni-stravovani/VNITRNI-RAD-OA-ZS-PDF.pdf',
                  note: 'PDF, platný od 1. 9. 2026 – úplné znění'
                },
                {
                  title: 'Otevírací doba jídelny a restaurace',
                  href: '/soubory/skolni-stravovani/Oteviraci-dobaSJ_2025.pdf',
                  note: 'PDF'
                }
              ]}
            />
          </div>
        </div>
      </Section>

      <Container className="pb-12">
        <p className="text-sm text-gray-6">
          Stravování zajišťuje Primirest – zařízení školního stravování spol. s r.o., provozovna č. 7330. Údaje vychází z
          vnitřního řádu školní jídelny; v případě rozporu platí řád.
        </p>
      </Container>
    </>
  )
}
